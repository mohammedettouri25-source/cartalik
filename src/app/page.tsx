"use client";

import Link from "next/link";
import {
  Smartphone,
  Globe,
  Users,
  Zap,
  QrCode,
  BarChart3,
  Sparkles,
  Shield,
  ArrowRight,
  Check,
  CreditCard,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen">
      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                {t('hero.badge')}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary leading-[1.1] tracking-tight text-balance">
                {t('hero.titlePrefix')}{" "}
                <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              <p className="mt-6 text-lg text-text-muted leading-relaxed max-w-lg">
                {t('hero.description')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/order"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold gradient-accent shadow-xl shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
                >
                  {t('common.createYourCard')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-primary font-semibold bg-neutral hover:bg-neutral-dark transition-all duration-200"
                >
                  {t('common.learnMore')}
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-accent" /> {t('hero.check1')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-accent" /> {t('hero.check2')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-accent" /> {t('hero.check3')}
                </span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end animate-float">
              <div className="relative group">
                <div className="absolute inset-0 rounded-[3rem] bg-accent/30 blur-[100px] scale-90 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <img 
                    src="/images/hero_nfc.png" 
                    alt="Cartalik NFC Tap"
                    className="w-full max-w-[500px] h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] rounded-[3rem]"
                  />
                  {/* Floating Overlay Card */}
                  <div className="absolute -bottom-6 -left-6 sm:-left-12 w-64 sm:w-72 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/10 border border-white/50 p-5 space-y-4 animate-float-delayed">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-accent/20">AK</div>
                        <div>
                          <h3 className="text-sm font-bold text-primary">{t('homePageExample.name')}</h3>
                          <p className="text-[10px] text-text-muted">{t('homePageExample.title')}</p>
                        </div>
                      </div>
                      <div className="w-20 h-20 flex items-center justify-center">
                        <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                    </div>
                    <button className="w-full py-2.5 rounded-xl gradient-accent text-white text-[10px] font-bold shadow-lg shadow-accent/20">{t('homePageExample.saveContact')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{t('howItWorks.title')}</h2>
            <p className="mt-4 text-text-muted">{t('howItWorks.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: "/images/step_order.png", title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
              { img: "/images/step_tap.png", title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
              { img: "/images/step_connect.png", title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
            ].map((step, i) => (
              <div key={i} className="relative p-8 rounded-[2.5rem] bg-neutral border border-border hover:border-accent/30 transition-all group text-center">
                <div className="flex justify-center mb-6">
                  <img 
                    src={step.img} 
                    alt={step.title}
                    className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                  />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section className="py-24 bg-neutral overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{t('featuresPage.title')}</h2>
            <p className="mt-4 text-text-muted">{t('featuresPage.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: t('featuresPage.feat1Title'), desc: t('featuresPage.feat1Desc') },
              { icon: QrCode, title: t('featuresPage.feat2Title'), desc: t('featuresPage.feat2Desc') },
              { icon: BarChart3, title: t('featuresPage.feat3Title'), desc: t('featuresPage.feat3Desc') },
              { icon: Sparkles, title: t('featuresPage.feat4Title'), desc: t('featuresPage.feat4Desc') },
              { icon: Globe, title: t('featuresPage.feat5Title'), desc: t('featuresPage.feat5Desc') },
              { icon: Shield, title: t('featuresPage.feat6Title'), desc: t('featuresPage.feat6Desc') },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white border border-border hover:shadow-xl hover:shadow-primary/5 transition-all">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Pricing ───── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">{t('pricingPage.title')}</h2>
            <p className="mt-4 text-text-muted">{t('pricingPage.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { id: 'personal', name: t('orderPage.personal'), price: '149', popular: false, features: [t('pricingFeatures.nfcCard'), t('pricingFeatures.digitalProfile'), t('pricingFeatures.basicAnalytics'), t('pricingFeatures.standardSupport')] },
              { id: 'business', name: t('orderPage.business'), price: '199', popular: true, features: [t('pricingFeatures.premiumCard'), t('pricingFeatures.enhancedProfile'), t('pricingFeatures.productShowcase'), t('pricingFeatures.leadManagement'), t('pricingFeatures.customBranding')] },
            ].map((plan) => (
              <div className={`relative p-8 rounded-[3rem] border-2 transition-all ${plan.popular ? "border-accent bg-white shadow-2xl shadow-accent/10 scale-105 z-10" : "border-border bg-neutral hover:border-accent/30"}`}>
                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full gradient-accent text-white text-[10px] font-black uppercase tracking-widest">{t('pricingPage.mostPopular')}</div>}
                <h3 className="text-xl font-bold text-primary">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-primary">{plan.price}</span>
                  <span className="text-sm font-bold text-text-muted">MAD</span>
                </div>
                <p className="mt-1 text-xs text-text-muted font-medium">{t('pricingPage.cardPurchase')}</p>
                <div className="h-px bg-border my-8" />
                <ul className="space-y-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-primary font-medium">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center"><Check className="w-3 h-3 text-accent" /></div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/order?type=${plan.id}`} className={`mt-8 block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${plan.popular ? "gradient-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02]" : "bg-neutral text-primary hover:bg-neutral-dark"}`}>{t('pricingPage.getStarted')}</Link>
              </div>
            ))}
          </div>

          {/* Subscription Info */}
          <div className="mt-16 max-w-xl mx-auto">
            <div className="p-8 rounded-[2.5rem] bg-neutral border border-border text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-accent" />
                <span className="text-sm font-bold text-primary">{t('pricingPage.subscriptionTitle')}</span>
              </div>
              <p className="text-2xl font-extrabold text-primary">{t('pricingPage.subscriptionPrice')}</p>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">{t('pricingPage.subscriptionDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
