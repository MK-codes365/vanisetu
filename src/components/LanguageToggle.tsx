"use client";

import { useLanguage } from "@/context/language-context";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-full flex gap-1 shadow-2xl">
        <button
          onClick={() => setLanguage("en")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            language === "en"
              ? "bg-orange-500 text-white shadow-lg scale-105"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage("hi")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            language === "hi"
              ? "bg-orange-500 text-white shadow-lg scale-105"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          हिन्दी
        </button>
      </div>
    </div>
  );
}
