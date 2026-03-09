"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";

// Convert Float32 PCM samples → Int16 little-endian ArrayBuffer
function float32ToInt16Buffer(floatSamples: Float32Array[]): ArrayBuffer {
  const total = floatSamples.reduce((n, a) => n + a.length, 0);
  const buf = new ArrayBuffer(total * 2);
  const view = new DataView(buf);
  let offset = 0;
  for (const samples of floatSamples) {
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }
  return buf;
}

export default function VoicePage() {
  const { t, language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [transcript, setTranscript] = useState("");
  const [detectedLang, setDetectedLang] = useState("");
  const router = useRouter();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pcmChunksRef = useRef<Float32Array[]>([]);

  const startRecording = async () => {
    setTranscript("");
    setStatusMsg("");
    pcmChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        pcmChunksRef.current.push(new Float32Array(channelData));
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

      setIsListening(true);
    } catch (err: unknown) {
      console.error("Microphone access error:", err);
      setStatusMsg("Microphone access denied. Please check your settings.");
    }
  };

  const handleStreamingResponse = async (response: Response) => {
    setIsProcessing(true);
    setStatusMsg("Transcribing audio...");

    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedTranscript = "";
    let latestPartial = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.language && data.language !== detectedLang) {
              setDetectedLang(data.language);
            }
            if (data.text) {
              setTranscript(data.text);
              if (!data.isPartial) {
                accumulatedTranscript += data.text + " ";
                latestPartial = "";
              } else {
                latestPartial = data.text;
              }
            }
          } catch (e) {
            console.warn("Transcript parse error:", e);
          }
        }
      }

      const final = (accumulatedTranscript + latestPartial).trim();
      if (final.length > 1) {
        setTranscript(final);
        await handleAnalyze(final);
      } else {
        setStatusMsg("I couldn't hear that. Could you try again?");
        setIsProcessing(false);
      }
    } catch (err: unknown) {
      console.error("Streaming error:", err);
      setStatusMsg("Something went wrong with the connection.");
      setIsProcessing(false);
    }
  };

  const stopRecording = async () => {
    setIsListening(false);

    processorRef.current?.disconnect();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());

    if (pcmChunksRef.current.length === 0) {
      setStatusMsg("No audio detected.");
      return;
    }

    const pcmBuffer = float32ToInt16Buffer(pcmChunksRef.current);
    const lang = language === "hi" ? "hi-IN" : "en-IN";

    try {
      const response = await fetch(`/api/transcribe?lang=${lang}`, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: pcmBuffer,
      });

      if (!response.ok) throw new Error("Transcription server error");

      await handleStreamingResponse(response);
    } catch (err: unknown) {
      console.error("Transcribe failed:", err);
      setStatusMsg("Failed to process your request.");
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleAnalyze = async (text: string) => {
    // Basic Noise Filter: Ignore small common vocalizations
    const noiseWords = [
      "yeah",
      "okay",
      "the",
      "hello",
      "ji",
      "जी",
      "हां",
      "हाँ",
    ];
    if (
      text.split(" ").length === 1 &&
      noiseWords.includes(text.toLowerCase())
    ) {
      setStatusMsg("I didn't quite catch that. Try again?");
      setIsProcessing(false);
      return;
    }

    setStatusMsg("Finding the best service for you...");
    try {
      const response = await fetch("/api/ai/analyze-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, language }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (data.service_id === "unknown") {
        setStatusMsg(
          "I'm sorry, I couldn't identify a government service in your request. Could you please rephrase it?",
        );
        setIsProcessing(false);
        return;
      }

      const reasoning = data.reasoning || data.reason || "";
      router.push(
        `/services?q=${encodeURIComponent(text)}&recommend=${data.service_id}&reason=${encodeURIComponent(reasoning)}`,
      );
    } catch (err) {
      console.error("AI Analysis failed:", err);
      router.push(`/services?q=${encodeURIComponent(text)}`);
    }
  };

  return (
    <div className="relative min-h-[calc(100-3.5rem)] flex flex-col items-center justify-center overflow-hidden bg-background font-sans pt-16">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_50%,#4f46e510_0%,transparent_50%)]" />

      {/* Manual language hint to make it super clear */}
      <div className="absolute top-8 right-8 z-50">
        <p className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold mb-1">
          Active Mode
        </p>
        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
          {language === "hi" ? "हिन्दी (Hindi)" : "English"}
        </div>
      </div>

      <main className="flex flex-col items-center gap-12 text-center animate-fade-in w-full max-w-2xl px-6">
        {/* State Indicator */}
        <div className="h-8">
          {isProcessing && (
            <div className="flex items-center gap-2 text-primary animate-pulse font-semibold">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{statusMsg || t("voiceAnalyzing")}</span>
            </div>
          )}
          {!isProcessing && statusMsg && (
            <p className="text-sm font-medium text-red-500">{statusMsg}</p>
          )}
        </div>

        {/* Massive Mic Button */}
        <div className="relative">
          {/* Animated Rings */}
          {isListening && (
            <>
              <div
                className="absolute inset-0 rounded-full bg-primary/20 animate-ping"
                style={{ animationDuration: "2s" }}
              />
              <div
                className="absolute -inset-8 rounded-full bg-primary/10 animate-pulse"
                style={{ animationDuration: "3s" }}
              />
              <div
                className="absolute -inset-16 rounded-full bg-primary/5 animate-pulse"
                style={{ animationDuration: "4s" }}
              />
            </>
          )}

          <button
            onClick={toggleListening}
            disabled={isProcessing}
            className={`relative flex items-center justify-center w-64 h-64 rounded-full transition-all duration-500 shadow-2xl ${
              isListening
                ? "bg-primary scale-110 shadow-primary/40"
                : isProcessing
                  ? "bg-zinc-200 cursor-not-allowed text-zinc-400"
                  : "bg-foreground/5 hover:bg-foreground/10 hover:scale-105"
            }`}
          >
            {isProcessing ? (
              <svg
                className="animate-spin h-20 w-20 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isListening ? "text-white" : "text-primary"}
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            )}
          </button>
        </div>

        {/* Live Transcript Display */}
        <div className="h-24 w-full flex flex-col justify-center">
          {transcript ? (
            <div className="bg-foreground/5 rounded-2xl p-6 glass-morphism border border-foreground/5 transition-all">
              <p className="text-lg font-medium text-foreground italic">
                &quot;{transcript}...&quot;
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2
                className={`text-3xl font-bold tracking-tight transition-colors duration-500 ${isListening ? "text-primary" : "text-foreground"}`}
              >
                {isListening ? t("voiceListening") : t("readyToListen")}
              </h2>
              <p className="text-lg text-foreground/60 max-w-xs mx-auto">
                {isListening ? t("describeService") : t("tapMic")}
              </p>
            </div>
          )}
        </div>

        {/* Language Indicator */}
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-morphism border border-foreground/5 text-sm font-medium text-foreground/70">
          <span
            className={`w-2 h-2 rounded-full ${detectedLang ? "bg-green-500" : "bg-zinc-400 animate-pulse"}`}
          />
          {detectedLang ? (
            <span>
              {t("detecting")}:{" "}
              {detectedLang === "hi-IN" ? "Hindi (हिन्दी)" : "English"}
            </span>
          ) : (
            <span>{t("detecting")}...</span>
          )}
        </div>
      </main>

      {/* Footer Instructions */}
      {!transcript && (
        <footer className="absolute bottom-12 text-sm text-foreground/40 font-medium px-6 text-center">
          {t("trySaying")}
        </footer>
      )}
    </div>
  );
}
