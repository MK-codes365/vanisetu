import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    VANI_AWS_ACCESS_KEY_ID: process.env.VANI_AWS_ACCESS_KEY_ID,
    VANI_AWS_SECRET_ACCESS_KEY: process.env.VANI_AWS_SECRET_ACCESS_KEY,
    VANI_AWS_REGION: process.env.VANI_AWS_REGION,
    VANI_AWS_DATA_REGION: process.env.VANI_AWS_DATA_REGION,
    VANI_ACCESS_KEY_ID: process.env.VANI_ACCESS_KEY_ID,
    VANI_SECRET_ACCESS_KEY: process.env.VANI_SECRET_ACCESS_KEY,
    VANI_REGION: process.env.VANI_REGION,
    VANI_DATA_REGION: process.env.VANI_DATA_REGION,
    VANI_AWS_S3_BUCKET_NAME: process.env.VANI_AWS_S3_BUCKET_NAME,
    VANI_S3_BUCKET_NAME: process.env.VANI_S3_BUCKET_NAME,
    VANI_AWS_BEDROCK_MODEL_ID: process.env.VANI_AWS_BEDROCK_MODEL_ID,
    VANI_BEDROCK_MODEL_ID: process.env.VANI_BEDROCK_MODEL_ID,
  },
};

export default nextConfig;
