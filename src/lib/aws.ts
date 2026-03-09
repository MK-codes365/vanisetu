import { S3Client } from "@aws-sdk/client-s3";
import { TextractClient } from "@aws-sdk/client-textract";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { StartStreamTranscriptionCommand, TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PollyClient } from "@aws-sdk/client-polly";

// Robust helper to get env variables even if they have hidden trailing spaces/tabs in the name or value
function getEnv(keyPrefix: string): string {
  const env = process.env;
  // Look for exact match first
  if (env[keyPrefix]) return env[keyPrefix]!.trim();
  
  // Look for match with trailing whitespace in the key name
  const actualKey = Object.keys(env).find(k => k.trim() === keyPrefix);
  if (actualKey) {
    const value = env[actualKey];
    return value ? value.trim() : "";
  }
  return "";
}

const region = getEnv("VANI_AWS_REGION") || getEnv("VANI_REGION") || "ca-central-1";
const dataRegion = getEnv("VANI_AWS_DATA_REGION") || getEnv("VANI_DATA_REGION") || "ap-south-1";

const accessKeyId = getEnv("VANI_AWS_ACCESS_KEY_ID") || getEnv("VANI_ACCESS_KEY_ID");
const secretAccessKey = getEnv("VANI_AWS_SECRET_ACCESS_KEY") || getEnv("VANI_SECRET_ACCESS_KEY");

console.log("--- AWS Client Initialization (Robust Build) ---");
console.log("- Access Key Status:", accessKeyId ? "PRESENT (Masked)" : "MISSING");
console.log("- Secret Key Status:", secretAccessKey ? "PRESENT (Masked)" : "MISSING");
console.log("----------------------------------------");

const credentials = {
  accessKeyId,
  secretAccessKey,
  ...(getEnv("VANI_AWS_SESSION_TOKEN") || getEnv("VANI_SESSION_TOKEN") ? { 
    sessionToken: getEnv("VANI_AWS_SESSION_TOKEN") || getEnv("VANI_SESSION_TOKEN") 
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
