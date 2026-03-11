import { S3Client } from "@aws-sdk/client-s3";
import { TextractClient } from "@aws-sdk/client-textract";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PollyClient } from "@aws-sdk/client-polly";

import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN,
  AWS_CONFIG_REGION,
  AWS_DATA_REGION,
} from "./aws-config";

// Log at module load for CloudWatch diagnostics
console.log("--- Vani Setu AWS Init ---");
console.log("Access Key:", AWS_ACCESS_KEY_ID ? `${AWS_ACCESS_KEY_ID.substring(0, 4)}... (len:${AWS_ACCESS_KEY_ID.length})` : "MISSING");
console.log("Secret Key:", AWS_SECRET_ACCESS_KEY ? `SET (len:${AWS_SECRET_ACCESS_KEY.length})` : "MISSING");
console.log("Config Region (Bedrock):", AWS_CONFIG_REGION);
console.log("Data Region (S3/Transcribe):", AWS_DATA_REGION);
console.log("--------------------------");

function buildCredentials() {
  const creds: any = {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  };
  if (AWS_SESSION_TOKEN) creds.sessionToken = AWS_SESSION_TOKEN;
  return creds;
}

/** Exported helpers so API routes can read config values */
export function getAwsCredentials() {
  return buildCredentials();
}
export function getAwsRegion(type: "config" | "data" = "config") {
  return type === "data" ? AWS_DATA_REGION : AWS_CONFIG_REGION;
}

/** Factory functions — create a fresh client per request */
export function getS3Client() {
  return new S3Client({ region: AWS_DATA_REGION, credentials: buildCredentials() });
}
export function getTextractClient() {
  return new TextractClient({ region: AWS_DATA_REGION, credentials: buildCredentials() });
}
export function getBedrockClient() {
  return new BedrockRuntimeClient({ region: AWS_CONFIG_REGION, credentials: buildCredentials() });
}
export function getTranscribeClient() {
  return new TranscribeStreamingClient({ region: AWS_DATA_REGION, credentials: buildCredentials() });
}
export function getPollyClient() {
  return new PollyClient({ region: AWS_DATA_REGION, credentials: buildCredentials() });
}
export function getDynamoClient() {
  return new DynamoDBClient({ region: AWS_DATA_REGION, credentials: buildCredentials() });
}

// Singleton exports for backward compatibility
export const s3Client = getS3Client();
export const textractClient = getTextractClient();
export const bedrockClient = getBedrockClient();
export const transcribeClient = getTranscribeClient();
export const pollyClient = getPollyClient();
export const dynamoClient = getDynamoClient();
