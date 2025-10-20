const AWS = require("@aws-sdk/client-s3");

// AWS region
const REGION = process.env.AWS_REGION || "us-east-1";

// Initialize AWS SDK
AWS.config.update({
  region: REGION,
});

// S3 bucket for cloth images
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
});

// Cognito for authentication
const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});

// Secrets Manager for environment variables and credentials
const secretsManager = new AWS.SecretsManager({
  apiVersion: "2017-10-17",
});

module.exports = {
  AWS,
  REGION,
  s3,
  cognito,
  secretsManager,
};
