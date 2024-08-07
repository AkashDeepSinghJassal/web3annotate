import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    region: "ap-south-1"
})
export default s3Client