"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, CreditCard, ArrowRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import LanguageSwitcher from "./LanguageSwitcher";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLocale();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="w-32 h-32 transition-all group-hover:scale-105">
              <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
            >
              {t('common.features')}
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
            >
              {t('common.pricing')}
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
            >
              {t('common.login')}
            </Link>

            <div className="h-6 w-px bg-slate-100 mx-2" />

            <LanguageSwitcher />

            <Link
              href="/order"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white gradient-accent shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
            >
              {t('common.getYourCard')}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-neutral transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-80 border-t border-border/50" : "max-h-0"
          }`}
      >
        <div className="px-4 py-4 space-y-2 bg-white">
          <Link
            href="/features"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-neutral hover:text-primary transition-colors"
          >
            {t('common.features')}
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-neutral hover:text-primary transition-colors"
          >
            {t('common.pricing')}
          </Link>
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-neutral hover:text-primary transition-colors"
          >
            {t('common.login')}
          </Link>
          <Link
            href="/order"
            onClick={() => setIsOpen(false)}
            className="block mx-4 mt-2 text-center px-5 py-3 rounded-full text-sm font-semibold text-white gradient-accent shadow-lg shadow-accent/25"
          >
            {t('common.getYourCard')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
