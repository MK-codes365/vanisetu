"use client";

import { useLanguage } from "@/context/language-context";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <div className="bg-foreground/5 border border-foreground/10 p-1 rounded-full flex gap-1">
        <button
          onClick={() => setLanguage("en")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            language === "en"
              ? "bg-primary text-white shadow-md scale-105"
              : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage("hi")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            language === "hi"
              ? "bg-primary text-white shadow-md scale-105"
              : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
          }`}
        >
          हिन्दी
        </button>
      </div>
    </div>
  );
}
