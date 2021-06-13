// import("dotenv").config({ silent: true });
import dotenv from 'dotenv'
dotenv.config({ silent: true })

const {
    NODE_ENV,
    PORT,
    DATABASE,
    AWS_KEY_ID,
    AWS_SECRET_KEY_ACCESS,
    AWS_BUCKET,
} = process.env;

// module.exports = {
//     environment: NODE_ENV || "production",
//     port: PORT,
//     database: DATABASE,
//     databasePassword: DATABASE_PASSWORD,
//     awsRegion: AWS_REGION,
//     awsAccessKeyId: AWS_KEY_ID,
//     awsSecretAccessKey: AWS_SECRET_KEY_ACCESS,
//     awsBucketName: AWS_BUCKET || "",
// }

export const awsRegion = "";
export const awsAccessKeyId = AWS_KEY_ID;
export const awsSecretAccessKey = AWS_SECRET_KEY_ACCESS;
export const awsBucketName = AWS_BUCKET;
