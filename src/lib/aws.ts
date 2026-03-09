import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { TextractClient } from "@aws-sdk/client-textract";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { StartStreamTranscriptionCommand, TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PollyClient } from "@aws-sdk/client-polly";

// Hyper-robust helper to get env variables, stripping ALL non-printable characters and whitespace
function getEnv(keyPrefix: string): string {
  const env = process.env;
  const keys = Object.keys(env);
  
  // Search for any key that matches when trimmed
  const actualKey = keys.find(k => k.trim() === keyPrefix);
  if (actualKey) {
    const val = env[actualKey];
    if (val) {
      // Aggressively strip everything except printable ASCII
      const cleaned = val.replace(/[^\x21-\x7E]/g, '').trim();
      return cleaned;
    }
  }
  return "";
}

const region = getEnv("VANI_AWS_REGION") || getEnv("VANI_REGION") || "ca-central-1";
const dataRegion = getEnv("VANI_AWS_DATA_REGION") || getEnv("VANI_DATA_REGION") || "ap-south-1";

const accessKeyId = getEnv("VANI_AWS_ACCESS_KEY_ID") || getEnv("VANI_ACCESS_KEY_ID");
const secretAccessKey = getEnv("VANI_AWS_SECRET_ACCESS_KEY") || getEnv("VANI_SECRET_ACCESS_KEY");

console.log("--- AWS Client Initialization (Ultra-Robust v2) ---");
console.log("- Node Environment:", process.env.NODE_ENV);
console.log("- Access Key ID Length:", accessKeyId?.length || 0);
console.log("- Secret Key Length:", secretAccessKey?.length || 0);
console.log("- Session Token Status:", (getEnv("VANI_AWS_SESSION_TOKEN") || getEnv("VANI_SESSION_TOKEN")) ? "PRESENT" : "MISSING");
console.log("- Region:", region);
console.log("- Data Region:", dataRegion);

const credentials = {
  accessKeyId,
  secretAccessKey,
  ...(getEnv("VANI_AWS_SESSION_TOKEN") || getEnv("VANI_SESSION_TOKEN") ? { 
    sessionToken: getEnv("VANI_AWS_SESSION_TOKEN") || getEnv("VANI_SESSION_TOKEN") 
  } : {}),
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
