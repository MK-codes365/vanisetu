import { S3Client, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const region = process.env.AWS_REGION || "ca-central-1";
const dataRegion = process.env.AWS_DATA_REGION || "ap-south-1";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};

const s3Client = new S3Client({ region: dataRegion, credentials });
const dynamoClient = new DynamoDBClient({ region: dataRegion, credentials });

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "vanisetu-scans-prototype";
const TABLE_NAME = process.env.AWS_DYNAMODB_TABLE_NAME || "VaniSetuSubmissions";

async function setupS3() {
  console.log(`Checking S3 Bucket: ${BUCKET_NAME}...`);
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`✓ Bucket "${BUCKET_NAME}" already exists.`);
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      console.log(`Creating S3 Bucket: ${BUCKET_NAME}...`);
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      console.log(`✓ Bucket "${BUCKET_NAME}" created successfully.`);
    } else {
      console.error(`Error checking/creating bucket: ${error.message}`);
    }
  }
}

async function setupDynamoDB() {
  console.log(`Checking DynamoDB Table: ${TABLE_NAME}...`);
  try {
    await dynamoClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`✓ Table "${TABLE_NAME}" already exists.`);
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") {
      console.log(`Creating DynamoDB Table: ${TABLE_NAME}...`);
      const command = new CreateTableCommand({
        TableName: TABLE_NAME,
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST",
      });
      await dynamoClient.send(command);
      console.log(`✓ Table "${TABLE_NAME}" created successfully (On-Demand).`);
    } else {
      console.error(`Error checking/creating table: ${error.message}`);
    }
  }
}

async function main() {
  console.log("--- Vani Setu AWS Resource Setup ---");
  await setupS3();
  await setupDynamoDB();
  console.log("--- Setup Complete ---");
}

main().catch((err) => console.error("Setup failed:", err));
