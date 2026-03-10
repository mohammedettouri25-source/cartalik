"use client";

import {
  Zap,
  QrCode,
  BarChart3,
  Sparkles,
  Globe,
  Shield,
  Smartphone,
  CreditCard,
  Users,
  MessageCircle,
  MapPin,
  Star,
  Download,
  Palette,
  Languages,
  Moon,
  Wallet,
  UserPlus,
  LineChart,
  Link as LinkIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function FeaturesPage() {
  const { t } = useLocale();

  const coreFeatures = [
    { icon: Zap, title: t('featuresPage.feat1Title'), desc: t('featuresPage.feat1Desc') },
    { icon: QrCode, title: t('featuresPage.feat2Title'), desc: t('featuresPage.feat2Desc') },
    { icon: BarChart3, title: t('featuresPage.feat3Title'), desc: t('featuresPage.feat3Desc') },
    { icon: Sparkles, title: t('featuresPage.feat4Title'), desc: t('featuresPage.feat4Desc') },
    { icon: Globe, title: t('featuresPage.feat5Title'), desc: t('featuresPage.feat5Desc') },
    { icon: Shield, title: t('featuresPage.feat6Title'), desc: t('featuresPage.feat6Desc') },
  ];

  const additionalFeatures = [
    { icon: MessageCircle, title: t('featuresPage.feat7Title'), desc: t('featuresPage.feat7Desc') },
    { icon: Download, title: t('featuresPage.feat8Title'), desc: t('featuresPage.feat8Desc') },
    { icon: Star, title: t('featuresPage.feat9Title'), desc: t('featuresPage.feat9Desc') },
    { icon: MapPin, title: t('featuresPage.feat10Title'), desc: t('featuresPage.feat10Desc') },
    { icon: Palette, title: t('featuresPage.feat11Title'), desc: t('featuresPage.feat11Desc') },
    { icon: UserPlus, title: t('featuresPage.feat12Title'), desc: t('featuresPage.feat12Desc') },
  ];

  return (
    <div className="pt-24 lg:pt-32">
      {/* Hero */}
      <section className="pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {t('featuresPage.badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight text-balance">
            {t('featuresPage.titlePrefix')}{" "}
            <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
              {t('featuresPage.titleHighlight')}
            </span>
          </h1>
          <p className="mt-5 text-lg text-text-muted max-w-2xl mx-auto">
            {t('featuresPage.subtitle')}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...coreFeatures, ...additionalFeatures].map((f, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-border bg-white hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent transition-colors duration-300">
                  <f.icon className="w-6 h-6 text-accent group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base font-bold text-primary">{f.title}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 lg:py-28 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            {t('featuresPage.compareTitle')}
          </h2>
          <p className="mt-4 text-text-muted max-w-2xl mx-auto">
            {t('featuresPage.compareSubtitle')}
          </p>

          <div className="mt-12 grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {/* Personal */}
            <div className="bg-white rounded-2xl p-8 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-bold text-primary">{t('orderPage.personal')}</h3>
              </div>
              <p className="text-sm text-text-muted mb-4">
                {t('featuresPage.personalDesc')}
              </p>
              <ul className="space-y-2 text-sm text-text-muted">
                {[
                  t('featuresPage.compareCheck1'),
                  t('featuresPage.compareCheck2'),
                  t('featuresPage.compareCheck3'),
                  t('featuresPage.compareCheck4'),
                  t('featuresPage.compareCheck5'),
                  t('featuresPage.compareCheck6'),
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Business */}
            <div className="bg-white rounded-2xl p-8 ring-2 ring-accent shadow-xl shadow-accent/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-primary">{t('orderPage.business')}</h3>
              </div>
              <p className="text-sm text-text-muted mb-4">
                {t('featuresPage.businessDesc')}
              </p>
              <ul className="space-y-2 text-sm text-text-muted">
                {[
                  t('featuresPage.compareCheck7'),
                  t('featuresPage.compareCheck8'),
                  t('featuresPage.compareCheck9'),
                  t('featuresPage.compareCheck10'),
                  t('featuresPage.compareCheck11'),
                  t('featuresPage.compareCheck12'),
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('featuresPage.ctaTitle')}
          </h2>
          <p className="mt-4 text-white/60 max-w-lg mx-auto">
            {t('featuresPage.ctaDesc')}
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full font-semibold gradient-accent shadow-xl shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
          >
            {t('common.createYourCard')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
