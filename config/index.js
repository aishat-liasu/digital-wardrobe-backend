import "dotenv/config";

export const config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        poolMax: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX) : 50,
        poolMin: process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN) : 10,
        logging: process.env.DB_LOGGING === "true",
    },
    app: {
        runMigrations: process.env.RUN_MIGRATIONS === "true",
        runSeeders: process.env.RUN_SEEDERS === "true",
        corsOrigin: process.env.CORS_ORIGIN,
        corsCredentials: process.env.CORS_CREDENTIALS === "true",
    },
    aws: {
        region: process.env.AWS_REGION || "us-east-1",
        bucketName: process.env.AWS_BUCKET_NAME,
        s3AccessKey: process.env.S3_ACCESS_KEY,
        s3SecretKey: process.env.S3_ACCESS_SECRET,
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        clientId: process.env.COGNITO_CLIENT_ID,
        clientSecret: process.env.COGNITO_CLIENT_SECRET,
        cognitoAccessKey: process.env.COGNITO_ACCESS_KEY,
        cognitoSecretKey: process.env.COGNITO_ACCESS_SECRET,
    },
    logger: {
        format: process.env.LOG_FORMAT || "dev",
        dir: process.env.LOG_DIR || "../logs",
    }
};
