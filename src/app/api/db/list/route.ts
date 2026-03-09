import { dynamoClient } from "@/lib/aws";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tableName = process.env.VANI_AWS_DYNAMODB_TABLE_NAME || "VaniSetuSubmissions";

    const command = new ScanCommand({
      TableName: tableName,
    });

    const response = await dynamoClient.send(command);
    
    // Convert DynamoDB items to standard JSON
    const items = (response.Items || []).map((item) => unmarshall(item));

    // Sort by timestamp descending
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("DynamoDB List Error:", error);
    
    // Fallback for local development if DynamoDB is not set up
    if (error.name === "ResourceNotFoundException" || error.name === "UnrecognizedClientException") {
       return NextResponse.json({ 
         items: [], 
         warning: "Using empty list (AWS not configured or table missing)" 
       });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
