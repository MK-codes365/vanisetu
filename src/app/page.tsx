"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_20%_20%,#4f46e515_0%,transparent_20%),radial-gradient(circle_at_80%_80%,#f43f5e15_0%,transparent_20%)]" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse-slow" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] animate-pulse-slow" />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-8 mx-auto max-w-7xl md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-bold text-xl shadow-lg shadow-primary/20">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            {t("heroTitle")}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            {t("services")}
          </a>
          <a
            href="#"
            className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            {t("howItWorks")}
          </a>
          <button className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            {t("getStarted")}
          </button>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center px-6 pt-16 pb-32 mx-auto text-center max-w-7xl md:px-12 md:pt-24 lg:pt-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {t("nextGenVoice")}
        </div>

        {/* Heading */}
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="block">{t("hllrbTitle")}</span>
          <span className="gradient-text">{t("forRuralIndia")}</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mb-12 text-lg leading-relaxed text-foreground/70 sm:text-xl md:text-2xl">
          {t("platformDesc")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/voice"
            className="group relative flex items-center justify-center gap-3 px-8 py-5 text-lg font-bold text-white bg-primary rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:animate-pulse"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            {t("startSpeaking")}
          </Link>

          <Link
            href="/services"
            className="flex items-center justify-center gap-2 px-8 py-5 text-lg font-bold text-foreground glass-morphism rounded-2xl border border-foreground/10 hover:bg-foreground/5 transition-all shadow-lg hover:-translate-y-1 active:scale-95"
          >
            {t("viewServices")}
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
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Impact & Education Section */}
        <section className="w-full mt-32 py-16 border-y border-foreground/5 bg-gradient-to-br from-primary/5 to-transparent rounded-[50px] px-8 md:px-16 flex flex-col lg:flex-row items-center gap-12 text-left">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
              {t("digitalEmpowerment")}
            </div>
            <h2 className="text-3xl font-extrabold text-foreground sm:text-5xl">
              {t("knowledgePower")} <br className="hidden md:block" />{" "}
              <span className="gradient-text">{t("forEveryCitizen")}</span>
            </h2>
            <p className="text-lg text-foreground/60 leading-relaxed max-w-xl">
              {t("learnDesc")}
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 group px-8 py-4 bg-foreground text-background font-bold rounded-2xl hover:scale-105 transition-all"
            >
              {t("openKnowledgeHub")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="p-6 glass-morphism rounded-3xl border border-foreground/5 space-y-2 hover:-translate-y-1 transition-transform">
              <div className="text-3xl">📚</div>
              <h4 className="font-bold text-sm">{t("govtSchemes")}</h4>
              <p className="text-xs text-foreground/50">
                {t("simplifiedEligibility")}
              </p>
            </div>
            <div className="p-6 glass-morphism rounded-3xl border border-foreground/5 space-y-2 translate-y-4 hover:translate-y-3 transition-transform">
              <div className="text-3xl">🎙️</div>
              <h4 className="font-bold text-sm">{t("audioHelp")}</h4>
              <p className="text-xs text-foreground/50">
                {t("listenDontRead")}
              </p>
            </div>
            <div className="p-6 glass-morphism rounded-3xl border border-foreground/5 space-y-2 hover:-translate-y-1 transition-transform">
              <div className="text-3xl">⚖️</div>
              <h4 className="font-bold text-sm">{t("citizenRights")}</h4>
              <p className="text-xs text-foreground/50">{t("knowYourLaw")}</p>
            </div>
            <div className="p-6 glass-morphism rounded-3xl border border-foreground/5 space-y-2 translate-y-4 hover:translate-y-3 transition-transform">
              <div className="text-3xl">💡</div>
              <h4 className="font-bold text-sm">{t("digitalSkills")}</h4>
              <p className="text-xs text-foreground/50">
                {t("learnToUseTech")}
              </p>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-8 mt-24 sm:grid-cols-3 w-full text-center">
          {[
            {
              title: t("dialectsTitle"),
              desc: t("dialectsDesc"),
              icon: "🌐",
            },
            {
              title: t("voiceGuidedTitle"),
              desc: t("voiceGuidedDesc"),
              icon: "🎙️",
            },
            {
              title: t("directConnectTitle"),
              desc: t("directConnectDesc"),
              icon: "⚡",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-8 transition-all glass-morphism rounded-3xl group hover:border-primary/30 hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-14 h-14 mb-4 text-3xl rounded-2xl bg-primary/10 transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-foreground/60">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
