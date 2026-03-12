"use client";

import Link from "next/link";
import Image from "next/image";

import { useLocale } from "@/context/LocaleContext";

export function Footer() {
  const { t } = useLocale();

  const footerLinks = {
    [t('footer.product')]: [
      { label: t('common.features'), href: "/features" },
      { label: t('common.pricing'), href: "/pricing" },
      { label: t('footer.personalCard'), href: "/pricing#personal" },
      { label: t('footer.businessCard'), href: "/pricing#business" },
    ],
    [t('footer.company')]: [
      { label: t('footer.about'), href: "#" },
      { label: t('footer.blog'), href: "#" },
      { label: t('footer.careers'), href: "#" },
      { label: t('footer.contact'), href: "#" },
    ],
    [t('footer.legal')]: [
      { label: t('footer.privacy'), href: "#" },
      { label: t('footer.terms'), href: "#" },
      { label: t('footer.cookie'), href: "#" },
    ],
  };

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="relative w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-xl shadow-accent/20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12 mb-6">
              <Image 
                src="/images/logo.png" 
                alt="Cartalik Logo" 
                fill 
                className="object-contain filter brightness-0 invert p-2" 
              />
            </div>
              <span className="text-xl font-bold tracking-tight">Cartalik</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              {t('footer.desc')}
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4 text-white/90">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            {t('common.copyright').replace('2026', new Date().getFullYear().toString())}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
