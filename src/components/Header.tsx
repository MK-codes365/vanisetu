"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl md:px-12">
        <Link href="/" className="flex flex-col items-center group">
          <div className="group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Vani Setu Logo"
              width={52}
              height={52}
              className="rounded-xl shadow-lg shadow-primary/20 object-contain"
              priority
            />
          </div>
          <span
            className="mt-1 text-sm font-extrabold tracking-widest uppercase"
            style={{
              background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.15em",
              fontFamily: "'Geist', sans-serif",
            }}
          >
            Vani Setu
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/services"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {t("services")}
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {t("howItWorks")}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
