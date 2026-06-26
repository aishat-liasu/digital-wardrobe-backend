import { S3Client } from "@aws-sdk/client-s3";
import { config } from "./index.js";

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.s3AccessKey,
    secretAccessKey: config.aws.s3SecretKey,
  },
});

export { s3Client };
