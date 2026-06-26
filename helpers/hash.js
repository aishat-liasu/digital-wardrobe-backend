import crypto from "crypto";

/**
 * Computes the Cognito SECRET_HASH
 * @param {string} username - The user's email or username
 * @param {string} clientId - The Cognito App Client ID
 * @param {string} clientSecret - The Cognito App Client Secret
 * @returns {string} Base64-encoded hash
 */
export function generateSecretHash(username, clientId, clientSecret) {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}
