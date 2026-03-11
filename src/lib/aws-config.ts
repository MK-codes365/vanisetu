/**
 * AWS configuration constants.
 *
 * IMPORTANT: Each line uses static dot-notation (`process.env.FOO`) so that
 * Next.js / webpack DefinePlugin can inline the literal string value at build
 * time.  Bracket-notation (`process.env[key]`) is intentionally avoided here
 * because webpack cannot statically replace dynamic key accesses.
 */

export const AWS_ACCESS_KEY_ID =
  (process.env.VANI_AWS_ACCESS_KEY_ID || "").trim() ||
  (process.env.VANI_ACCESS_KEY_ID || "").trim();

export const AWS_SECRET_ACCESS_KEY =
  (process.env.VANI_AWS_SECRET_ACCESS_KEY || "").trim() ||
  (process.env.VANI_SECRET_ACCESS_KEY || "").trim();

export const AWS_SESSION_TOKEN =
  (process.env.VANI_AWS_SESSION_TOKEN || "").trim() ||
  (process.env.VANI_SESSION_TOKEN || "").trim() ||
  undefined;

/** Bedrock region (Canada) */
export const AWS_CONFIG_REGION =
  (process.env.VANI_AWS_REGION || "").trim() ||
  (process.env.VANI_REGION || "").trim() ||
  "ca-central-1";

/** Data services region: S3, Textract, Transcribe, Polly, DynamoDB (Mumbai) */
export const AWS_DATA_REGION =
  (process.env.VANI_AWS_DATA_REGION || "").trim() ||
  (process.env.VANI_DATA_REGION || "").trim() ||
  "ap-south-1";

export const S3_BUCKET_NAME =
  (process.env.VANI_AWS_S3_BUCKET_NAME || "").trim() ||
  (process.env.VANI_S3_BUCKET_NAME || "").trim() ||
  "vanisetu-scans-prototype";

export const DYNAMODB_TABLE_NAME =
  (process.env.VANI_AWS_DYNAMODB_TABLE_NAME || "").trim() ||
  (process.env.VANI_DYNAMODB_TABLE_NAME || "").trim() ||
  "VaniSetuSubmissions";

export const BEDROCK_MODEL_ID =
  (process.env.VANI_AWS_BEDROCK_MODEL_ID || "").trim() ||
  (process.env.VANI_BEDROCK_MODEL_ID || "").trim() ||
  "us.amazon.nova-2-lite-v1:0";
