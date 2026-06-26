import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const { AWS_BUCKET_NAME, NODE_ENV } = process.env;
import { sanitizeFileName } from "../helpers/sanitizeFileName.js";
import { s3Client } from "../config/aws.js";

class StorageService {
  /**
   * Deletes a file from the S3 bucket
   * @param {string} key - The key/path of the file in the bucket
   */
  deleteFile = async (key) => {
    try {
      const command = new DeleteObjectCommand({
        Bucket: AWS_BUCKET_NAME,
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
        Bucket: AWS_BUCKET_NAME,
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
    const envFolder = NODE_ENV || "dev";
    const sanitizedKey = sanitizeFileName(fileName);
    const filePath = `${envFolder}/${targetFolder}/${cognitoId}/${sanitizedKey}`;

    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
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
