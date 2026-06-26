import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config/index.js";
import { s3Client } from "../config/aws.js";

import { sanitizeFileName } from "../helpers/sanitizeFileName.js";

class StorageService {
  /**
   * Deletes a file from the S3 bucket
   * @param {string} key - The key/path of the file in the bucket
   */
  deleteFile = async (key) => {
    try {
      const command = new DeleteObjectCommand({
        Bucket: config.aws.bucketName;,
        Key: key,
      });
      await s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  };

  getFile = async (key) => {
    if (!key) return null;

    try {
      const command = new GetObjectCommand({
        Bucket: config.aws.bucketName,
        Key: key,
      });

      const imageUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });

      return imageUrl;
    } catch (error) {
      return null;
    }
  };

  /**
   * Generates a temporary URL for the frontend to upload directly
   *
   * @returns {string} - Public URL of the uploaded file
   */
  generatePresignedUrl = async ({
    fileName,
    fileType,
    targetFolder = "clothes",
    cognitoId = "Unknown",
  }) => {
    const envFolder = config.env || "development";
    const sanitizedKey = sanitizeFileName(fileName);
    const filePath = `${envFolder}/${targetFolder}/${cognitoId}/${sanitizedKey}`;

    const command = new PutObjectCommand({
      Bucket: config.aws.bucketName,
      Key: filePath,
      ContentType: fileType,
    });

    // URL expires in 120 seconds
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 120,
    });

    return {
      presignedUrl,
      filePath,
      fileName: sanitizedKey,
    };
  };
}
export default StorageService;
