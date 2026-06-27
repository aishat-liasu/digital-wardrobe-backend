import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AdminGetUserCommand,
  ResendConfirmationCodeCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import UserService from "./user.service.js";
import { generateSecretHash } from "../helpers/hash.js";
import { AppError } from "../utils/appError.js";

import { config } from "../config/index.js";

const userPoolId = config.aws.userPoolId;
const clientId = config.aws.clientId;
const clientSecret = config.aws.clientSecret;
const client = new CognitoIdentityProviderClient({});
const userService = new UserService();

class AuthService {
  signUp = async ({ email, firstName, lastName }) => {
    const secretHash = generateSecretHash(email, clientId, clientSecret);
    const params = {
      ClientId: clientId,
      Username: email,
      SecretHash: secretHash,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "given_name", Value: firstName },
        { Name: "family_name", Value: lastName },
      ],
    };
    const command = new SignUpCommand(params);
    return await client.send(command);
  };

  confirmSignUp = async ({ email, code }) => {
    const secretHash = generateSecretHash(email, clientId, clientSecret);
    const params = {
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code,
      SecretHash: secretHash,
    };
    const command = new ConfirmSignUpCommand(params);
    await client.send(command);

    //get user details for verified user
    const userData = await this.getUserData(email);

    await userService.createUser(userData);
    return userData;
  };

  getUserData = async (email) => {
    const client = new CognitoIdentityProviderClient({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.cognitoAccessKey,
        secretAccessKey: config.aws.cognitoSecretKey,
      },
    });

    // Get user data from Cognito
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: email,
    });

    const userRes = await client.send(getUserCommand);

    if (userRes?.UserStatus === "UNCONFIRMED") {
      throw new AppError(400, `The email ${email} hasn't been verified.`);
    }
    const attributes = {};
    userRes.UserAttributes.forEach((attr) => {
      attributes[attr.Name] = attr.Value;
    });

    const userData = {
      cognitoId: attributes.sub,
      firstName: attributes.given_name || "",
      lastName: attributes.family_name || "",
      email: attributes.email,
    };

    return userData;
  };

  resendVerificationCode = async (email) => {
    const secretHash = generateSecretHash(email, clientId, clientSecret);
    const params = {
      ClientId: clientId,
      Username: email,
      SecretHash: secretHash,
    };
    const command = new ResendConfirmationCodeCommand(params);
    return await client.send(command);
  };

  login = async (email) => {
    const secretHash = generateSecretHash(email, clientId, clientSecret);
    const params = {
      AuthFlow: "USER_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PREFERRED_CHALLENGE: "EMAIL_OTP",
        SECRET_HASH: secretHash,
      },
    };

    const command = new InitiateAuthCommand(params);
    return await client.send(command);
  };

  verifyOtp = async ({ email, code, session }) => {
    const secretHash = generateSecretHash(email, clientId, clientSecret);
    const params = {
      ClientId: clientId,
      Session: session,
      ChallengeName: "EMAIL_OTP",
      ChallengeResponses: {
        USERNAME: email,
        EMAIL_OTP_CODE: code,
        SECRET_HASH: secretHash,
      },
    };

    const command = new RespondToAuthChallengeCommand(params);
    const authResult = await client.send(command);

    // After successful OTP validation, ensure user exists in DB
    const userData = await this.getUserData(email);
    const findUser = await userService.getUserByCognitoId(userData.cognitoId);

    if (!findUser) {
      await userService.createUser(userData);
    }

    return authResult;
  };

  refreshToken = async ({ email, refreshToken }) => {
    try {
      const secretHash = generateSecretHash(email, clientId, clientSecret);

      const params = {
        ClientId: clientId,
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: secretHash,
        },
      };

      const command = new InitiateAuthCommand(params);

      return await client.send(command);
    } catch (error) {
      console.error("Refresh Token Failed:", error);
      throw new AppError(
        401,
        "Session expired. Please log in again.",
        "UNAUTHORIZED",
      );
    }
  };
}

export default AuthService;
