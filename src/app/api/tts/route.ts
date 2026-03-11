import { getPollyClient } from "@/lib/aws";
import { SynthesizeSpeechCommand, VoiceId, Engine } from "@aws-sdk/client-polly";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const pollyClient = getPollyClient(); // fresh per request
  let body: any;
  try {
    body = await req.json();
    const { text, language } = body;

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Mumbai (ap-south-1) voice selection
    let voiceId: VoiceId = "Kajal";
    let engine: Engine = "neural";

    if (language === "en") {
      voiceId = "Aditi";
      engine = "standard"; 
    }

    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: "mp3",
      VoiceId: voiceId,
      Engine: engine,
      LanguageCode: language === "hi" ? "hi-IN" : "en-IN",
    });

    const response = await pollyClient.send(command);

    if (!response.AudioStream) {
      throw new Error("Empty audio stream from Polly");
    }

    return new Response(response.AudioStream as any, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error: unknown) {
    console.error("TTS Route Error:", error);
    const message = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
