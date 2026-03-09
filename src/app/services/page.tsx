"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { useState, Suspense } from "react";

const getServices = (t: (key: string) => string) => [
  {
    id: "ration",
    name: t("serviceRationName"),
    category: t("catFood"),
    categoryKey: "catFood",
    desc: t("serviceRationDesc"),
    icon: "🌾",
    keywords: ["ration", "wheat", "rice", "food", " अनाज", "चावल"],
  },
  {
    id: "aadhar",
    name: t("serviceAadharName"),
    category: t("catIdentity"),
    categoryKey: "catIdentity",
    desc: t("serviceAadharDesc"),
    icon: "🆔",
    keywords: ["aadhar", "identity", "uidai", "aadhaar", "कार्ड", "पहचान"],
  },
  {
    id: "pmkisan",
    name: t("servicePMKisanName"),
    category: t("catAgriculture"),
    categoryKey: "catAgriculture",
    desc: t("servicePMKisanDesc"),
    icon: "🚜",
    keywords: ["kisan", "farmer", "agriculture", "money", "खेती", "किसान"],
  },
  {
    id: "ayushman",
    name: t("serviceAyushmanName"),
    category: t("catHealth"),
    categoryKey: "catHealth",
    desc: t("serviceAyushmanDesc"),
    icon: "🏥",
    keywords: ["health", "medical", "hospital", "ayushman", "इलाज", "अस्पताल"],
  },
  {
    id: "awas",
    name: t("serviceAwasName"),
    category: t("catHousing"),
    categoryKey: "catHousing",
    desc: t("serviceAwasDesc"),
    icon: "🏠",
    keywords: ["home", "house", "awas", "housing", "घर", "आवास"],
  },
  {
    id: "pension",
    name: t("servicePensionName"),
    category: t("catWelfare"),
    categoryKey: "catWelfare",
    desc: t("servicePensionDesc"),
    icon: "👴",
    keywords: ["pension", "old", "money", "welfare", "पेंशन", "बुढ़ापा"],
  },
];

function ServicesContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const recommendedId = searchParams.get("recommend");
  const reason = searchParams.get("reason");
  const [filterKey, setFilterKey] = useState("catAll");
  const [isPlaying, setIsPlaying] = useState(false);
  const { language } = useLanguage();

  const playTTS = async (text: string) => {
    if (isPlaying) return;
    setIsPlaying(true);

    // Use native speech for short phrases to save bandwidth
    if (
      text.length < 60 &&
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      return;
    }

    try {
      const resp = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || "TTS failed");
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    } catch (err: any) {
      console.error(err);
      alert(`Speech Error: ${err.message}`);
      setIsPlaying(false);
    }
  };

  const services = getServices(t);
  const categories = [
    { key: "catAll", label: t("catAll") },
    ...Array.from(
      new Map(services.map((s) => [s.categoryKey, s.category])).entries(),
    ).map(([key, label]) => ({ key, label })),
  ];

  const filteredServices = services
    .map((s) => ({
      ...s,
      recommended: s.id === recommendedId,
    }))
    .filter((s) => {
      const matchesFilter =
        filterKey === "catAll" || s.categoryKey === filterKey;

      const matchesSearch =
        query === "" ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.desc.toLowerCase().includes(query.toLowerCase()) ||
        s.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase()));

      const isAiRecommended = s.id === recommendedId;

      return matchesFilter && (matchesSearch || isAiRecommended);
    });

  return (
    <div className="relative min-h-screen bg-background pb-24 font-sans">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] -z-10 bg-primary/5 blur-[120px]" />

      <header className="px-6 py-8 mx-auto max-w-7xl md:px-12 flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 group w-fit">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground/5 text-foreground group-hover:bg-primary group-hover:text-white transition-all">
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground/70 group-hover:text-primary transition-colors">
            {t("goBack")}
          </span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {t("govtServices")}
          </h1>
          {query && (
            <p className="text-lg text-foreground/60 italic">
              {t("showingResultsFor")}{" "}
              <span className="text-primary font-semibold">
                &quot;{query}&quot;
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/track"
            className="px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-bold hover:bg-foreground hover:text-background transition-all"
          >
            {t("myApplications")}
          </Link>
        </div>

        {/* AI Reasoning / Voice Box */}
        {reason && (
          <div className="glass-morphism p-6 rounded-3xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center gap-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-3xl shrink-0">
              🤖
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest">
                AI Voice Guide
              </h4>
              <p className="text-foreground/80 leading-relaxed font-medium">
                {reason}
              </p>
            </div>
            <button
              onClick={() => playTTS(reason)}
              disabled={isPlaying}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${
                isPlaying
                  ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                  : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
              }`}
            >
              {isPlaying ? (
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
              {isPlaying ? "Reading..." : "Listen to Guide"}
            </button>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterKey(cat.key)}
              className={`px-5 py-2 whitespace-nowrap rounded-full text-sm font-bold transition-all ${
                filterKey === cat.key
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 mx-auto max-w-7xl md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Link
              key={service.id}
              href={`/scan?id=${service.id}`}
              className="group flex flex-col p-6 glass-morphism rounded-3xl border border-foreground/5 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden"
            >
              {service.recommended && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                  {t("recommendedLabel")}
                </div>
              )}

              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>

              <h3 className="text-xl font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.name}
              </h3>

              <div className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-4">
                {service.category}
              </div>

              <p className="text-sm text-foreground/60 leading-relaxed mb-6">
                {service.desc}
              </p>

              <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
                {t("applyNow")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-24 glass-morphism rounded-3xl border border-dashed border-foreground/10">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-foreground">
              {t("noServicesFound")}
            </h3>
            <p className="text-foreground/50">{t("trySearchingElse")}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
