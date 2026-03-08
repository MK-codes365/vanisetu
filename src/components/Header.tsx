"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl md:px-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            {t("heroTitle")}
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
