import { transcribeClient } from "@/lib/aws";
import { StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // Runtime diagnostic
  const creds = (transcribeClient.config as any).credentials;
  const accessKey = typeof creds === 'function' ? 'async' : (creds?.accessKeyId || 'MISSING');
  console.log("--- Transcribe API Request Diagnostics ---");
  console.log("- Runtime Access Key:", accessKey === 'async' ? 'async' : (accessKey !== 'MISSING' ? `${accessKey.substring(0, 4)}...${accessKey.substring(accessKey.length - 4)}` : 'MISSING'));
  console.log("- Runtime Region:", transcribeClient.config.region);
  console.log("-----------------------------------------");

  try {
    const lang = (req.nextUrl.searchParams.get("lang") as string) || "hi-IN";

    if (!req.body) {
      return NextResponse.json({ error: "No audio data provided" }, { status: 400 });
    }

    // Adapt the Request's ReadableStream to an AsyncIterable for AWS SDK
    const reader = req.body.getReader();
    const CHUNK_SIZE = 8192; 

    async function* audioStream() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        for (let offset = 0; offset < value.length; offset += CHUNK_SIZE) {
          const chunk = value.slice(offset, offset + CHUNK_SIZE);
          yield { AudioEvent: { AudioChunk: chunk } };
        }
      }
    }

    const command = new StartStreamTranscriptionCommand({
      IdentifyLanguage: true,
      LanguageOptions: "en-IN,hi-IN",
      PreferredLanguage: lang as any,
      MediaEncoding: "pcm",       // Raw signed 16-bit PCM, little-endian
      MediaSampleRateHertz: 16000, // Must match frontend sampleRate
      AudioStream: audioStream(),
    });

    console.log(`Starting transcription stream (Hint: ${lang}, Region: ${transcribeClient.config.region})`);

    const response = await transcribeClient.send(command);

    if (!response.TranscriptResultStream) {
      throw new Error("Failed to start transcription stream");
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let identifiedLang = "";
          for await (const event of response.TranscriptResultStream!) {
            const newLang = event.TranscriptEvent?.Transcript?.Results?.[0]?.LanguageCode;
            if (newLang && newLang !== identifiedLang) {
              identifiedLang = newLang;
            }

            if (event.TranscriptEvent?.Transcript?.Results) {
              for (const result of event.TranscriptEvent.Transcript.Results) {
                const transcript = result.Alternatives?.[0]?.Transcript;
                if (transcript) {
                  const data = JSON.stringify({
                    text: transcript,
                    isPartial: result.IsPartial,
                    language: identifiedLang || lang,
                  });
                  controller.enqueue(encoder.encode(data + "\n"));
                }
              }
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Transcribe Error:", error);
    const message = error.message || "Unknown error";
    // Check for common AWS permission/configuration errors
    if (error.name === "AccessDeniedException") {
      return NextResponse.json({ error: "AWS Access Denied. Check Amplify IAM Role permissions." }, { status: 403 });
    }
    if (error.name === "UnrecognizedClientException") {
      console.error("DEBUG: UnrecognizedClientException details:", {
        message: error.message,
        name: error.name,
        requestId: error.$metadata?.requestId,
      });
      return NextResponse.json({ error: "Invalid AWS Credentials in Amplify environment variables. Debug: Check server logs for masked key status." }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
