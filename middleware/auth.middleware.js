import { CognitoJwtVerifier } from "aws-jwt-verify";

// Create a verifier instance (for Access Tokens)
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId: process.env.COGNITO_CLIENT_ID,
  tokenUse: "access",
});

const verifyCognitoToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const payload = await verifier.verify(token);
    console.log(payload);

    // Attach user details to request
    req.user = {
      sub: payload.sub,
      username: payload["username"] || payload["cognito:username"],
      email: payload.email,
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res
      .status(401)
      .json({ message: "Unauthorized", error: err.message });
  }
};

export default verifyCognitoToken;
