import { S3Client, HeadBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, DescribeTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const dataRegion = process.env.AWS_DATA_REGION || "ap-south-1";
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};

async function diagnostic() {
  console.log("--- AWS Resource Diagnostic (Simplified) ---");
  console.log(`Region: ${dataRegion}`);
  console.log(`Access Key: ${credentials.accessKeyId.substring(0, 8)}...`);

  // 1. S3 Check
  const s3 = new S3Client({ region: dataRegion, credentials });
  const BUCKET = process.env.AWS_S3_BUCKET_NAME || "vanisetu-scans-prototype";
  
  try {
    console.log(`\nTesting S3 for "${BUCKET}"...`);
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
    console.log(`✓ Bucket "${BUCKET}" exists and is accessible.`);
  } catch (e: any) {
    console.error(`✗ S3 HeadBucket Error: ${e.name} - ${e.message}`);
    
    try {
      console.log("Listing buckets...");
      const buckets = await s3.send(new ListBucketsCommand({}));
      console.log(`Available Buckets: ${buckets.Buckets?.map(b => b.Name).join(", ") || "None"}`);
    } catch (le: any) {
      console.error(`✗ ListBuckets Error: ${le.name} - ${le.message}`);
    }
  }

  // 2. DynamoDB Check
  const ddb = new DynamoDBClient({ region: dataRegion, credentials });
  const TABLE = process.env.AWS_DYNAMODB_TABLE_NAME || "VaniSetuSubmissions";
  
  try {
    console.log(`\nTesting DynamoDB for "${TABLE}"...`);
    const table = await ddb.send(new DescribeTableCommand({ TableName: TABLE }));
    console.log(`✓ Table Status: ${table.Table?.TableStatus}`);
    console.log(`✓ Table ARN: ${table.Table?.TableArn}`);
  } catch (e: any) {
    console.error(`✗ DynamoDB DescribeTable Error: ${e.name} - ${e.message}`);
    
    try {
      console.log("Listing tables...");
      const list = await ddb.send(new ListTablesCommand({}));
      console.log(`Available Tables: ${list.TableNames?.join(", ") || "None"}`);
    } catch (le: any) {
      console.error(`✗ ListTables Error: ${le.name} - ${le.message}`);
    }
  }
}

diagnostic();
