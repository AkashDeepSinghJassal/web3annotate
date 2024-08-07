import { S3Client } from "@aws-sdk/client-s3";
import config from "../config/index.js";

const s3Client = new S3Client({
    credentials: {
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretKey,
    },
    region: config.aws.region
})
console.log("s3 slient init")
export default s3Client