import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { TextractClient } from "@aws-sdk/client-textract";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PollyClient } from "@aws-sdk/client-polly";

// Reads a key from process.env, trimming whitespace.
// Checks case-insensitively as a fallback for Amplify quirks.
function getRawEnv(key: string): string | undefined {
  const val = process.env[key];
  if (val !== undefined) {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  // Case-insensitive fallback
  const actualKey = Object.keys(process.env).find(
    (k) => k.trim().toUpperCase() === key.toUpperCase()
  );
  return actualKey ? process.env[actualKey]?.trim() || undefined : undefined;
}

// --- Lazy credentials / region resolution ---
// We do NOT read process.env at module load time because in Amplify's
// serverless SSR environment the variables may not be injected yet.
// Instead, each exported factory function reads them fresh on every call.

function getCredentials() {
  const accessKeyId =
    getRawEnv("VANI_AWS_ACCESS_KEY_ID") ||
    getRawEnv("VANI_ACCESS_KEY_ID") ||
    "";
  const secretAccessKey =
    getRawEnv("VANI_AWS_SECRET_ACCESS_KEY") ||
    getRawEnv("VANI_SECRET_ACCESS_KEY") ||
    "";
  const sessionToken =
    getRawEnv("VANI_AWS_SESSION_TOKEN") ||
    getRawEnv("VANI_SESSION_TOKEN");

  if (!accessKeyId) {
    console.error(
      "[AWS] CRITICAL: No access key found. Set VANI_ACCESS_KEY_ID in Amplify Console."
    );
  }

  return {
    accessKeyId,
    secretAccessKey,
    ...(sessionToken ? { sessionToken } : {}),
  };
}

function getRegion(type: "config" | "data" = "config") {
  if (type === "data") {
    return (
      getRawEnv("VANI_AWS_DATA_REGION") ||
      getRawEnv("VANI_DATA_REGION") ||
      "ap-south-1"
    );
  }
  return (
    getRawEnv("VANI_AWS_REGION") ||
    getRawEnv("VANI_REGION") ||
    "ca-central-1"
  );
}

// Export helper so API routes can log resolved credentials for debugging
export function getAwsCredentials() {
  return getCredentials();
}
export function getAwsRegion(type: "config" | "data" = "config") {
  return getRegion(type);
}

// --- Lazy client factories ---
// Each call creates a fresh client with credentials read at that instant.

export function getS3Client() {
  return new S3Client({ region: getRegion("data"), credentials: getCredentials() });
}

export function getTextractClient() {
  return new TextractClient({ region: getRegion("data"), credentials: getCredentials() });
}

export function getBedrockClient() {
  return new BedrockRuntimeClient({ region: getRegion("config"), credentials: getCredentials() });
}

export function getTranscribeClient() {
  return new TranscribeStreamingClient({ region: getRegion("data"), credentials: getCredentials() });
}

export function getPollyClient() {
  return new PollyClient({ region: getRegion("data"), credentials: getCredentials() });
}

export function getDynamoClient() {
  return new DynamoDBClient({ region: getRegion("data"), credentials: getCredentials() });
}

// --- Deprecated singleton exports (kept for backward compat, but lazy now) ---
// These are recreated on first import using the factory functions above.
export const s3Client = getS3Client();
export const textractClient = getTextractClient();
export const bedrockClient = getBedrockClient();
export const transcribeClient = getTranscribeClient();
export const pollyClient = getPollyClient();
export const dynamoClient = getDynamoClient();
