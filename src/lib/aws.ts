import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { TextractClient } from "@aws-sdk/client-textract";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { StartStreamTranscriptionCommand, TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PollyClient } from "@aws-sdk/client-polly";

// Explicitly reference all possible environment variables to ensure Next.js bundles them into the runtime
// We use .trim() on the values in case the user copied trailing spaces/tabs into the Amplify Console values
const accessKeyId = (
  process.env.VANI_AWS_ACCESS_KEY_ID || 
  process.env.VANI_ACCESS_KEY_ID || 
  ""
).trim();

const secretAccessKey = (
  process.env.VANI_AWS_SECRET_ACCESS_KEY || 
  process.env.VANI_SECRET_ACCESS_KEY || 
  ""
).trim();

const region = (
  process.env.VANI_AWS_REGION || 
  process.env.VANI_REGION || 
  "ca-central-1"
).trim();

const dataRegion = (
  process.env.VANI_AWS_DATA_REGION || 
  process.env.VANI_DATA_REGION || 
  "ap-south-1"
).trim();

const sessionToken = (
  process.env.VANI_AWS_SESSION_TOKEN || 
  process.env.VANI_SESSION_TOKEN || 
  ""
).trim();

console.log("--- AWS Client Initialization (Next.js Compatible Build) ---");
console.log("- Access Key ID Length:", accessKeyId?.length || 0);
console.log("- Secret Key Length:", secretAccessKey?.length || 0);
console.log("- Region:", region);
console.log("- Data Region:", dataRegion);

const credentials = {
  accessKeyId,
  secretAccessKey,
  ...(sessionToken ? { sessionToken } : {}),
};

// Initial connectivity self-test
if (accessKeyId && secretAccessKey) {
  const testClient = new S3Client({ region: dataRegion, credentials });
  testClient.send(new ListBucketsCommand({})).then(() => {
    console.log("- AWS Connection Self-Test: SUCCESS");
  }).catch((err) => {
    console.log("- AWS Connection Self-Test: FAILED", err.name, err.message);
  });
}

console.log("---------------------------------------------------------");

export const s3Client = new S3Client({
  region: dataRegion,
  credentials,
});

export const textractClient = new TextractClient({
  region: dataRegion,
  credentials,
});

// Use the configured region for Bedrock
export const bedrockClient = new BedrockRuntimeClient({
  region,
  credentials,
});

export const transcribeClient = new TranscribeStreamingClient({
  region: dataRegion,
  credentials,
});

export const pollyClient = new PollyClient({
  region: dataRegion,
  credentials,
});

export const dynamoClient = new DynamoDBClient({
  region: dataRegion,
  credentials,
});
