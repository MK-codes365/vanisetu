import { dynamoClient } from "@/lib/aws";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const tableName = process.env.VANI_AWS_DYNAMODB_TABLE_NAME || "VaniSetuSubmissions";

    const item = {
      ...data,
      timestamp: new Date().toISOString(),
      status: "PENDING_VERIFICATION",
    };

    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item),
    });

    await dynamoClient.send(command);

    return NextResponse.json({
      message: "Data saved to DynamoDB successfully",
      id: data.id,
    });
  } catch (error: any) {
    console.error("DynamoDB Save Error:", error);
    let errorMessage = error.message;
    if (error.name === "ResourceNotFoundException") {
      errorMessage = `DynamoDB Table "${process.env.VANI_AWS_DYNAMODB_TABLE_NAME || "VaniSetuSubmissions"}" does not exist. Please run "npx tsx scripts/setup-aws-resources.ts" to create it.`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
