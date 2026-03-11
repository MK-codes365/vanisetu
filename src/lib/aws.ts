import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { TextractClient } from "@aws-sdk/client-textract";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { StartStreamTranscriptionCommand, TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PollyClient } from "@aws-sdk/client-polly";

// Explicitly reference all possible environment variables for Next.js bundling
const ENV_NAMES = {
  ACCESS_KEY: 'VANI_AWS_ACCESS_KEY_ID',
  ACCESS_KEY_ALT: 'VANI_ACCESS_KEY_ID',
  SECRET_KEY: 'VANI_AWS_SECRET_ACCESS_KEY',
  SECRET_KEY_ALT: 'VANI_SECRET_ACCESS_KEY',
  REGION: 'VANI_AWS_REGION',
  REGION_ALT: 'VANI_REGION',
  DATA_REGION: 'VANI_AWS_DATA_REGION',
  DATA_REGION_ALT: 'VANI_DATA_REGION',
  SESSION_TOKEN: 'VANI_AWS_SESSION_TOKEN',
  SESSION_TOKEN_ALT: 'VANI_SESSION_TOKEN',
};

function getRawEnv(key: string): string | undefined {
  const val = process.env[key];
  if (val !== undefined) {
    const trimmed = val.trim();
    if (trimmed.length === 0) {
      console.warn(`[AWS-ENV] Warning: Key "${key}" exists but is empty.`);
    }
    return trimmed;
  }
  
  // Case-insensitive/whitespace-flexible fallback
  const actualKey = Object.keys(process.env).find(k => k.trim().toUpperCase() === key.toUpperCase());
  if (actualKey) {
    const valFallback = process.env[actualKey]?.trim();
    console.warn(`[AWS-ENV] Map match: Found "${actualKey}" instead of exact "${key}".`);
    return valFallback;
  }

  return undefined;
}

export function getAwsCredentials() {
  const accessKeyId = getRawEnv(ENV_NAMES.ACCESS_KEY) || getRawEnv(ENV_NAMES.ACCESS_KEY_ALT) || "";
  const secretAccessKey = getRawEnv(ENV_NAMES.SECRET_KEY) || getRawEnv(ENV_NAMES.SECRET_KEY_ALT) || "";
  const sessionToken = getRawEnv(ENV_NAMES.SESSION_TOKEN) || getRawEnv(ENV_NAMES.SESSION_TOKEN_ALT);

  return {
    accessKeyId,
    secretAccessKey,
    ...(sessionToken ? { sessionToken } : {}),
  };
}

export function getAwsRegion(type: 'config' | 'data' = 'config') {
  if (type === 'data') {
    return getRawEnv(ENV_NAMES.DATA_REGION) || getRawEnv(ENV_NAMES.DATA_REGION_ALT) || "ap-south-1";
  }
  return getRawEnv(ENV_NAMES.REGION) || getRawEnv(ENV_NAMES.REGION_ALT) || "ca-central-1";
}

const credentials = getAwsCredentials();
const region = getAwsRegion('config');
const dataRegion = getAwsRegion('data');

console.log("--- AWS Client Initialization (Vani Setu) ---");
console.log("- Access Key ID found:", credentials.accessKeyId ? `YES (starts with ${credentials.accessKeyId.substring(0, 4)}, len: ${credentials.accessKeyId.length})` : "NO (MISSING)");
console.log("- Secret Key found:", credentials.secretAccessKey ? `YES (len: ${credentials.secretAccessKey.length})` : "NO (MISSING)");
console.log("- Config Region (Bedrock):", region);
console.log("- Data Region (S3/TTS/Transcribe):", dataRegion);

// Runtime diagnostic check for Amplify reserved variables
if (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_SECRET_ACCESS_KEY) {
  console.warn("! WARNING: AWS_* reserved variables detected. Amplify may override these. Use VANI_AWS_* instead.");
}

// Initial connectivity self-test
if (credentials.accessKeyId && credentials.secretAccessKey) {
  const testClient = new S3Client({ region: dataRegion, credentials });
  testClient.send(new ListBucketsCommand({})).then(() => {
    console.log("- AWS Connectivity Test: SUCCESS");
  }).catch((err) => {
    console.error("- AWS Connectivity Test: FAILED", err.name, err.message);
    if (err.name === 'UnrecognizedClientException') {
      console.error("  [TIP] Check for trailing spaces in Amplify environment variables.");
    }
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
