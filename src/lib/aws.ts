import { S3Client } from "@aws-sdk/client-s3";
import { TextractClient } from "@aws-sdk/client-textract";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { StartStreamTranscriptionCommand, TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PollyClient } from "@aws-sdk/client-polly";

const region = process.env.VANI_AWS_REGION || process.env.VANI_REGION || "ca-central-1";
const dataRegion = process.env.VANI_AWS_DATA_REGION || process.env.VANI_DATA_REGION || "ap-south-1";

const accessKeyId = process.env.VANI_AWS_ACCESS_KEY_ID || process.env.VANI_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.VANI_AWS_SECRET_ACCESS_KEY || process.env.VANI_SECRET_ACCESS_KEY || "";

console.log("AWS Client Initialization Debug:");
console.log("- Region:", region);
console.log("- Data Region:", dataRegion);
console.log("- Access Key ID:", accessKeyId ? `${accessKeyId.substring(0, 4)}...${accessKeyId.substring(accessKeyId.length - 4)}` : "MISSING");
console.log("- Secret Key:", secretAccessKey ? "PRESENT (Masked)" : "MISSING");

const credentials = {
  accessKeyId,
  secretAccessKey,
  ...(process.env.VANI_AWS_SESSION_TOKEN || process.env.VANI_SESSION_TOKEN ? { 
    sessionToken: process.env.VANI_AWS_SESSION_TOKEN || process.env.VANI_SESSION_TOKEN 
  } : {}),
};

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
