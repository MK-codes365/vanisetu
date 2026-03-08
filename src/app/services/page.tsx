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
    desc: t("serviceRationDesc"),
    icon: "🌾",
  },
  {
    id: "aadhar",
    name: t("serviceAadharName"),
    category: t("catIdentity"),
    desc: t("serviceAadharDesc"),
    icon: "🆔",
  },
  {
    id: "pmkisan",
    name: t("servicePMKisanName"),
    category: t("catAgriculture"),
    desc: t("servicePMKisanDesc"),
    icon: "🚜",
  },
  {
    id: "ayushman",
    name: t("serviceAyushmanName"),
    category: t("catHealth"),
    desc: t("serviceAyushmanDesc"),
    icon: "🏥",
  },
  {
    id: "awas",
    name: t("serviceAwasName"),
    category: t("catHousing"),
    desc: t("serviceAwasDesc"),
    icon: "🏠",
  },
  {
    id: "pension",
    name: t("servicePensionName"),
    category: t("catWelfare"),
    desc: t("servicePensionDesc"),
    icon: "👴",
  },
];

function ServicesContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const recommendedId = searchParams.get("recommend");
  const [filter, setFilter] = useState(t("catAll"));

  const services = getServices(t);
  const categories = [
    t("catAll"),
    ...Array.from(new Set(services.map((s) => s.category))),
  ];

  const filteredServices = services
    .map((s) => ({
      ...s,
      recommended: s.id === recommendedId,
    }))
    .filter((s) => {
      const matchesFilter = filter === t("catAll") || s.category === filter;

      const matchesSearch =
        query === "" ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.desc.toLowerCase().includes(query.toLowerCase());

      const isAiRecommended = s.id === recommendedId;

      return matchesFilter && (matchesSearch || isAiRecommended);
    });

  return (
    <div className="relative min-h-screen bg-background pb-24 font-sans">
      {/* Background Decor */}
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
              <span className="text-primary font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 whitespace-nowrap rounded-full text-sm font-bold transition-all ${
                filter === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
              }`}
            >
              {cat}
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
