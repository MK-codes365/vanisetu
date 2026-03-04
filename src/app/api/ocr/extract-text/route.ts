import { textractClient } from "@/lib/aws";
import { AnalyzeDocumentCommand, FeatureType } from "@aws-sdk/client-textract";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64, s3Object } = await req.json();

    let document: any = {};

    if (s3Object) {
      document = {
        S3Object: {
          Bucket: s3Object.bucket,
          Name: s3Object.key,
        },
      };
    } else if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      document = {
        Bytes: buffer,
      };
    } else {
      return NextResponse.json({ error: "No image source provided" }, { status: 400 });
    }

    const command = new AnalyzeDocumentCommand({
      Document: document,
      FeatureTypes: [FeatureType.FORMS, FeatureType.TABLES],
    });

    const response = await textractClient.send(command);

    // Extract key-value pairs (simplified for prototype)
    const blocks = response.Blocks || [];
    const text = blocks
      .filter((b) => b.BlockType === "LINE")
      .map((b) => b.Text)
      .join(" ");

    return NextResponse.json({
      text,
      raw: response,
    });
  } catch (error: any) {
    console.error("Textract Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
