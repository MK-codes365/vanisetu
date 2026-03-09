"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useState, useEffect, Suspense } from "react";

function TrackContent() {
  const { t, language } = useLanguage();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/db/list");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setApplications(data.items || []);
      } catch (err: any) {
        console.error("Fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-500 bg-green-500/10";
      case "REJECTED":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-amber-500 bg-amber-500/10";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "APPROVED") return t("statusApproved");
    if (status === "REJECTED") return t("statusRejected");
    return t("statusPending");
  };

  const playStatusVoice = (app: any) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const serviceName = t(
        `service${app.serviceId.charAt(0).toUpperCase() + app.serviceId.slice(1)}Name`,
      );
      const status = getStatusLabel(app.status);
      const text =
        language === "hi"
          ? `${serviceName} के लिए आपका आवेदन ${status} है।`
          : `Your application for ${serviceName} is ${status}.`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Header */}
      <header className="w-full px-6 py-8 mx-auto max-w-7xl md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
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
          <span className="text-sm font-semibold text-foreground/70 group-hover:text-primary">
            {t("goBack")}
          </span>
        </Link>
        <h1 className="text-xl font-black tracking-tighter">
          VANI<span className="text-primary">SETU</span>
        </h1>
      </header>

      <main className="flex-1 w-full max-w-4xl px-6 pb-24 flex flex-col gap-12">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold tracking-tight">
            {t("trackTitle")}
          </h2>
          <p className="text-foreground/60">{t("trackSubtitle")}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-foreground/40 italic">
              Syncing with AWS DynamoDB...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/10 text-center">
            <p className="text-red-500 font-bold mb-2">
              Error connecting to database
            </p>
            <p className="text-foreground/40 text-sm">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6 text-2xl">
              📂
            </div>
            <h3 className="text-xl font-bold mb-2">{t("noApplications")}</h3>
            <Link
              href="/services"
              className="text-primary font-bold hover:underline"
            >
              {t("viewServices")} →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="glass-morphism p-8 rounded-[40px] border border-foreground/5 hover:border-primary/20 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {app.serviceId === "ration"
                        ? "🌾"
                        : app.serviceId === "aadhar"
                          ? "🆔"
                          : "📋"}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black mb-1">
                        {t(
                          `service${app.serviceId.charAt(0).toUpperCase() + app.serviceId.slice(1)}Name`,
                        )}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-foreground/40 font-medium">
                        <span>
                          {t("applicationDate")}:{" "}
                          {new Date(app.timestamp).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="font-mono">{app.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`px-6 py-3 rounded-2xl font-bold text-sm ${getStatusColor(app.status)}`}
                    >
                      {getStatusLabel(app.status)}
                    </div>
                    <button
                      onClick={() => playStatusVoice(app)}
                      className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group/btn shadow-sm"
                      title="Hear Status"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="mt-10 relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-foreground/5 -translate-y-1/2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-1000"
                      style={{
                        width: app.status === "APPROVED" ? "100%" : "33%",
                      }}
                    />
                  </div>
                  <div className="relative flex justify-between">
                    {[
                      { label: "Submitted", active: true },
                      { label: "In Review", active: true },
                      { label: "Finalized", active: app.status === "APPROVED" },
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-4 border-background z-10 ${step.active ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-zinc-200"}`}
                        />
                        <span
                          className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${step.active ? "text-foreground" : "text-foreground/20"}`}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button for Home */}
      <div className="fixed bottom-10 inset-x-0 flex justify-center pointer-events-none">
        <Link
          href="/"
          className="pointer-auto flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold shadow-2xl hover:scale-105 transition-all text-sm pointer-events-auto"
        >
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
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {t("home")}
        </Link>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
