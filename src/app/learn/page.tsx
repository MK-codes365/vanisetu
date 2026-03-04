"use client";

import Link from "next/link";
import VoiceGuide from "@/components/VoiceGuide";
import { useLanguage } from "@/context/language-context";
import { useState } from "react";

const getCards = (t: (key: string) => string) => [
  {
    id: "health",
    title: t("serviceAyushmanName"),
    category: t("catHealth"),
    description: t("serviceAyushmanDesc"),
    fullContent: t("serviceAyushmanFull"),
    icon: "🏥",
    color: "from-emerald-500/20 to-teal-500/20",
    textColor: "text-emerald-600",
  },
  {
    id: "farming",
    title: t("servicePMKisanName"),
    category: t("catAgriculture"),
    description: t("servicePMKisanDesc"),
    fullContent: t("servicePMKisanDesc") + " " + t("servicePMKisanDesc"),
    icon: "🚜",
    color: "from-orange-500/20 to-amber-500/20",
    textColor: "text-orange-600",
  },
  {
    id: "skills",
    title: t("serviceDigitalName"),
    category: t("catEducation"),
    description: t("serviceDigitalDesc"),
    fullContent: t("serviceDigitalFull"),
    icon: "📱",
    color: "from-blue-500/20 to-indigo-500/20",
    textColor: "text-blue-600",
  },
  {
    id: "women",
    title: t("serviceUjjwalaName"),
    category: t("catWelfare"),
    description: t("serviceUjjwalaDesc"),
    fullContent: t("serviceUjjwalaFull"),
    icon: "🔥",
    color: "from-pink-500/20 to-rose-500/20",
    textColor: "text-pink-600",
  },
];

export default function LearnPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(t("catAll"));

  const cards = getCards(t);
  const categories = [
    t("catAll"),
    t("catHealth"),
    t("catAgriculture"),
    t("catEducation"),
    t("catWelfare"),
  ];

  const filteredCards =
    activeCategory === t("catAll")
      ? cards
      : cards.filter((c) => c.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-background pb-24 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[60%] h-[40%] -z-10 bg-primary/5 blur-[120px] rounded-full" />

      <header className="px-6 py-12 mx-auto max-w-7xl md:px-12">
        <Link href="/" className="flex items-center gap-2 group w-fit mb-8">
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

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            {t("knowledgePower")}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            {t("learnEmpower")}
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed">
            {t("learnSubtitle")}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mt-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 mx-auto max-w-7xl md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="group flex flex-col p-8 glass-morphism rounded-[40px] border border-foreground/5 hover:border-primary/20 transition-all relative overflow-hidden"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} blur-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity`}
            />

            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <VoiceGuide text={card.fullContent} label={t("hearGuide")} />
            </div>

            <div className="mb-2">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${card.textColor}`}
              >
                {card.category}
              </span>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">
                {card.title}
              </h3>
            </div>

            <p className="text-foreground/60 leading-relaxed mb-8">
              {card.description}
            </p>

            <div className="mt-auto flex items-center gap-4">
              <button className="flex-1 py-4 bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold rounded-2xl transition-all text-sm">
                {t("viewDetails")}
              </button>
              <button className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all text-sm">
                {t("applyNow")}
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Footer Info */}
      <section className="mt-24 px-6 mx-auto max-w-7xl md:px-12">
        <div className="p-12 glass-morphism rounded-[50px] border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent flex flex-col md:row items-center gap-12 text-center md:text-left">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-extrabold">{t("needMoreHelp")}</h2>
            <p className="text-foreground/60 text-lg">{t("helpDesc")}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/voice"
                className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all text-sm"
              >
                {t("startVoiceAssistant")}
              </Link>
            </div>
          </div>
          <div className="w-48 h-48 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-32 h-32 bg-primary/40 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-4xl">
                ❓
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
