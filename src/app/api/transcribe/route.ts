import { getTranscribeClient } from "@/lib/aws";
import { StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // Create a fresh client per request — reads credentials from process.env now
  const transcribeClient = getTranscribeClient();

  // Runtime diagnostic
  const vaniKeys = Object.keys(process.env).filter(k => k.includes("VANI"));
  const ak = (transcribeClient.config as any).credentials?.accessKeyId || 'MISSING';
  const region = transcribeClient.config.region;
  console.log("--- Runtime Diagnostic ---");
  console.log("- VANI keys:", vaniKeys.join(", ") || "(none)");
  console.log("- Access Key:", ak !== 'MISSING' ? `${ak.substring(0, 4)}... (len: ${ak.length})` : 'MISSING');
  console.log("- Region:", region);
  console.log("--------------------------");

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
      MediaEncoding: "pcm",
      MediaSampleRateHertz: 16000,
      AudioStream: audioStream(),
    });

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

    if (error.name === "AccessDeniedException") {
      return NextResponse.json({ error: "AWS Access Denied. Check Amplify IAM Role permissions." }, { status: 403 });
    }
    if (error.name === "UnrecognizedClientException") {
      const credsProvider = (transcribeClient.config as any).credentials;
      const resolvedCreds = typeof credsProvider === 'function' ? await credsProvider().catch(() => null) : credsProvider;
      const akPrefix = resolvedCreds?.accessKeyId?.substring(0, 4) || 'MISSING';
      const regionProvider = transcribeClient.config.region;
      const resolvedRegion = typeof regionProvider === 'function' ? await (regionProvider as any)().catch(() => 'unknown') : regionProvider;

      return NextResponse.json({
        error: `Invalid AWS Credentials. Region: ${resolvedRegion}, Key Starts with: ${akPrefix}. Add VANI_ACCESS_KEY_ID in Amplify Console > Environment Variables.`
      }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
