import { bedrockClient } from "@/lib/aws";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { transcript, language } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const isHindi = language === "hi";
    let modelId = process.env.VANI_AWS_BEDROCK_MODEL_ID || "us.amazon.nova-2-lite-v1:0";

    const prompt = `
      You are an AI assistant for Vani Setu, a platform for rural Indian citizens.
      Analyze the following user request and determine which government service they need.

      User Request: "${transcript}"
      Language Preference: ${isHindi ? "Hindi (हिन्दी)" : "English"}

      Available Service IDs:
      - ration: Ration Card (Food & Civil Supplies / राशन कार्ड)
      - aadhar: Aadhaar Services (Identity / आधार कार्ड)
      - pmkisan: PM-Kisan (Agriculture / किसान सम्मान निधि)
      - ayushman: Ayushman Bharat (Health / आयुष्मान भारत)
      - awas: PM Awas Yojana (Housing / आवास योजना)
      - pension: Old Age Pension (Social Welfare / पेंशन)
      - unknown: Use this if the request is gibberish, noise, or not related to govt services.

      Return a JSON response with:
      1. "service_id": One of [ration, aadhar, pmkisan, ayushman, awas, pension, unknown]
      2. "confidence": A score between 0 and 1.
      3. "reasoning": A brief explanation in ${isHindi ? "pure Hindi (Devanagari)" : "simple English"}. 
         IMPORTANT: Since the user's interface is in ${isHindi ? "Hindi" : "English"}, you MUST provide the reasoning in ${isHindi ? "Hindi" : "English"}.

      CRITICAL: If the user says something that is NOT a request (e.g., just "Yeah" or "The"), return "unknown".
    `;

    let input: any;
    
    // Model-specific payload formatting
    if (modelId.includes("titan-text")) {
      input = {
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          inputText: prompt + "\nRespond only in valid JSON.",
          textGenerationConfig: {
            maxTokenCount: 500,
            temperature: 0.1,
            topP: 0.9,
          },
        }),
      };
    } else if (modelId.includes("claude-3")) {
      input = {
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: [{ type: "text", text: prompt + "\nRespond only in valid JSON." }],
            },
          ],
          temperature: 0.1,
          top_p: 0.9,
        }),
      };
    } else {
      input = {
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [{ text: prompt + "\nRespond only in valid JSON." }],
            },
          ],
          inferenceConfig: {
            maxTokens: 500,
            temperature: 0.1,
            topP: 0.9,
          },
        }),
      };
    }

    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    let aiText = "";
    if (modelId.includes("titan-text")) {
      aiText = responseBody.results[0].outputText;
    } else if (modelId.includes("claude-3")) {
      aiText = responseBody.content[0].text;
    } else {
      aiText = responseBody.output.message.content[0].text;
    }
    
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Parse error" };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Bedrock Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
