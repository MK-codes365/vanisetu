"use client";

import { useState, useEffect } from "react";

interface VoiceGuideProps {
  text: string;
  label?: string;
}

export default function VoiceGuide({
  text,
  label = "Listen to Guide",
}: VoiceGuideProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSynth(window.speechSynthesis);
    }
  }, []);

  const stopSpeaking = () => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const speak = () => {
    if (!synth) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Attempt to find a local language voice if possible (defaulting to primary)
    const voices = synth.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes("hi-IN"));
    if (hindiVoice) utterance.voice = hindiVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synth.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
        isSpeaking
          ? "bg-primary text-white shadow-lg shadow-primary/30"
          : "bg-primary/10 text-primary hover:bg-primary/20"
      }`}
    >
      <div className="relative">
        {isSpeaking ? (
          <div className="flex gap-1 items-center">
            <span className="w-1 h-3 bg-white rounded-full animate-[bounce_1s_infinite_0s]" />
            <span className="w-1 h-4 bg-white rounded-full animate-[bounce_1s_infinite_0.1s]" />
            <span className="w-1 h-3 bg-white rounded-full animate-[bounce_1s_infinite_0.2s]" />
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </div>
      {isSpeaking ? "Speaking..." : label}
    </button>
  );
}
