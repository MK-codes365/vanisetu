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

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full mt-32 py-16 scroll-mt-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-5xl">
              {t("howItWorks")}
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              {t("howItWorksSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />

            {[
              {
                step: "01",
                title: t("step1Title"),
                desc: t("step1Desc"),
                icon: "🎙️",
                color: "bg-blue-500/10 text-blue-600",
              },
              {
                step: "02",
                title: t("step2Title"),
                desc: t("step2Desc"),
                icon: "🧠",
                color: "bg-purple-500/10 text-purple-600",
              },
              {
                step: "03",
                title: t("step3Title"),
                desc: t("step3Desc"),
                icon: "✅",
                color: "bg-green-500/10 text-green-600",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-8 glass-morphism rounded-[40px] border border-foreground/5 hover:border-primary/20 transition-all hover:-translate-y-2 group"
              >
                <div
                  className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed text-center">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

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

        {/* Feature Highlights - 3D Section */}
        <div className="grid grid-cols-1 gap-12 mt-32 sm:grid-cols-3 w-full perspective-1000">
          {[
            {
              title: t("dialectsTitle"),
              desc: t("dialectsDesc"),
              icon: "🌐",
              color: "from-blue-500/20 to-indigo-500/20",
            },
            {
              title: t("voiceGuidedTitle"),
              desc: t("voiceGuidedDesc"),
              icon: "🎙️",
              color: "from-purple-500/20 to-pink-500/20",
            },
            {
              title: t("directConnectTitle"),
              desc: t("directConnectDesc"),
              icon: "⚡",
              color: "from-amber-500/20 to-orange-500/20",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="feature-card-3d preserve-3d relative flex flex-col items-center p-10 glass-morphism rounded-[40px] border border-foreground/10 group cursor-default"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[40px] -z-10 blur-xl`}
              />

              <div className="floating-icon flex items-center justify-center w-20 h-20 mb-8 text-4xl rounded-3xl bg-white shadow-2xl preserve-3d ring-1 ring-black/5">
                {feature.icon}
              </div>

              <div className="floating-content preserve-3d space-y-3">
                <h3 className="text-2xl font-black text-foreground tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-base text-foreground/50 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>

              {/* Decorative 3D elements */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
