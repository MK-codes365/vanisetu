import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const dataRegion = process.env.AWS_DATA_REGION || "ap-south-1";
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};

const s3Client = new S3Client({ region: dataRegion, credentials });
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "vanisetu-scans-prototype";

async function verify() {
  console.log(`Diagnostic: Checking S3 Bucket "${BUCKET_NAME}" in region "${dataRegion}"...`);
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log("SUCCESS: Bucket is accessible.");
  } catch (error: any) {
    console.error(`FAILURE: ${error.name} - ${error.message}`);
    console.error(`Error Code: ${error.Code || error.$metadata?.httpStatusCode}`);
  }
}

verify();
