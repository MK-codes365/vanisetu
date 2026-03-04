"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";

export default function VoicePage() {
  const { t, language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const router = useRouter();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      // Dynamically set language based on toggle
      recognitionRef.current.lang = language === "hi" ? "hi-IN" : "en-IN";

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => (prev + " " + finalTranscript).trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setIsListening(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
      if (transcript.length > 2) {
        handleAnalyze();
      }
    } else {
      setTranscript("");
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleAnalyze = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/ai/analyze-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // Navigate to services with the AI's recommendation
      router.push(
        `/services?q=${encodeURIComponent(transcript.trim())}&recommend=${data.service_id}`,
      );
    } catch (err) {
      console.error("AI Analysis failed:", err);
      // Fallback: just go to services with the transcript
      router.push(`/services?q=${encodeURIComponent(transcript.trim())}`);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_50%,#4f46e510_0%,transparent_50%)]" />

      {/* Header/Nav */}
      <nav className="absolute top-0 w-full flex items-center justify-between px-6 py-8 mx-auto max-w-7xl md:px-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/5 text-foreground hover:bg-primary hover:text-white transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground/70 group-hover:text-primary transition-colors">
            {t("goBack")}
          </span>
        </Link>
      </nav>

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
              {t("voiceAnalyzing")}
            </div>
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
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-bounce"
              >
                <path d="M12 2v20" />
                <path d="M9 22h6" />
                <path d="M8 2h8" />
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
                "{transcript}..."
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
        {!transcript && (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-morphism border border-foreground/5 text-sm font-medium text-foreground/70">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {t("detecting")}: {t("languagesList")}
          </div>
        )}
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
