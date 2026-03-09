import { s3Client } from "@/lib/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64, filename } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    const bucketName = process.env.VANI_AWS_S3_BUCKET_NAME || process.env.VANI_S3_BUCKET_NAME || "vanisetu-scans-prototype";
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const key = `scans/${filename || `scan-${Date.now()}.jpg`}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    });

    await s3Client.send(command);

    return NextResponse.json({
      message: "Upload successful",
      bucket: bucketName,
      key: key,
    });
  } catch (error: any) {
    console.error("S3 Upload Error:", error);
    let errorMessage = error.message;
    if (error.name === "NoSuchBucket" || error.message.includes("The specified bucket does not exist")) {
      errorMessage = `S3 Bucket "${process.env.VANI_AWS_S3_BUCKET_NAME}" does not exist. Please run "npx tsx scripts/setup-aws-resources.ts" to create it.`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
