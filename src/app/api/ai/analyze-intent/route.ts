import { bedrockClient } from "@/lib/aws";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    let modelId = process.env.VANI_AWS_BEDROCK_MODEL_ID || "us.amazon.nova-2-lite-v1:0";

    const prompt = `
      You are an AI assistant for Vani Setu, a platform for rural Indian citizens.
      Analyze the following user request and determine which government service they need.
      The request might be in English, Hindi (Devanagari or Romanized), or other regional languages.

      User Request: "${transcript}"

      Available Service IDs:
      - ration: Ration Card (Food & Civil Supplies / राशन कार्ड)
      - aadhar: Aadhaar Services (Identity / आधार कार्ड)
      - pension: Old Age Pension (Social Welfare / पेंशन)
      - birth: Birth Certificate (Certificates / जन्म प्रमाण पत्र)
      - land: Land Records (Revenue / जमीन के कागज)
      - health: Digital Health Card (Health / स्वास्थ्य कार्ड)

      Return a JSON response with:
      1. "service_id": One of [ration, aadhar, pension, birth, land, health]
      2. "confidence": A score between 0 and 1
      3. "reasoning": A brief explanation in simple Hindi or English.

      IMPORTANT: Even if the user speaks in Hindi, you MUST return one of the standard English "service_id" strings above.
    `;

    let input: any;
    
    // Check which model we are using to format the request correctly
    if (modelId.includes("titan-text")) {
      input = {
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          inputText: prompt + "\nBe extremely concise. Return ONLY the JSON.",
          textGenerationConfig: {
            maxTokenCount: 100,
            temperature: 0.1,
            topP: 0.9,
          },
        }),
      };
    } else if (modelId.includes("claude-3")) {
      // Claude 3 formatting
      input = {
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 100,
          messages: [
            {
              role: "user",
              content: [{ type: "text", text: prompt + "\nBe extremely concise. Return ONLY the JSON." }],
            },
          ],
          temperature: 0.1,
          top_p: 0.9,
        }),
      };
    } else {
      // Default Nova formatting
      input = {
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [{ text: prompt + "\nBe extremely concise. Return ONLY the JSON." }],
            },
          ],
          inferenceConfig: {
            maxTokens: 100,
            temperature: 0.1,
            topP: 0.9,
          },
        }),
      };
    }

    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract the JSON from the response based on the model
    let aiText = "";
    if (modelId.includes("titan-text")) {
      aiText = responseBody.results[0].outputText;
    } else if (modelId.includes("claude-3")) {
      aiText = responseBody.content[0].text;
    } else {
      aiText = responseBody.output.message.content[0].text;
    }
    
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Bedrock Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
