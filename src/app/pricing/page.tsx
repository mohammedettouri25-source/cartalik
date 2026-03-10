"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Shield,
  Sparkles,
  ChevronDown,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors pr-4">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm text-text-muted leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { t } = useLocale();

  const plans = [
    {
      id: "personal",
      name: t('orderPage.personal'),
      price: "149",
      icon: Smartphone,
      desc: t('pricingPage.personalDesc'),
      features: [
        t('pricingPage.featPersonal1'),
        t('pricingPage.featPersonal2'),
        t('pricingPage.featPersonal3'),
        t('pricingPage.featPersonal4'),
        t('pricingPage.featPersonal5'),
        t('pricingPage.featPersonal6'),
        t('pricingPage.featPersonal7'),
        t('pricingPage.featPersonal8'),
        t('pricingPage.featPersonal9'),
      ],
      cta: t('pricingPage.getPersonal'),
      popular: false,
    },
    {
      id: "business",
      name: t('orderPage.business'),
      price: "199",
      icon: CreditCard,
      desc: t('pricingPage.businessDesc'),
      features: [
        t('pricingPage.featBusiness1'),
        t('pricingPage.featBusiness2'),
        t('pricingPage.featBusiness3'),
        t('pricingPage.featBusiness4'),
        t('pricingPage.featBusiness5'),
        t('pricingPage.featBusiness6'),
        t('pricingPage.featBusiness7'),
        t('pricingPage.featBusiness8'),
      ],
      cta: t('pricingPage.getBusiness'),
      popular: true,
    },
  ];

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
  ];

  return (
    <div className="pt-24 lg:pt-32">
      {/* Hero */}
      <section className="pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {t('pricingPage.badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight text-balance">
            {t('pricingPage.titlePrefix')}{" "}
            <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
              {t('pricingPage.titleHighlight')}
            </span>
          </h1>
          <p className="mt-5 text-lg text-text-muted max-w-2xl mx-auto">
            {t('pricingPage.subtitle')}
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                id={plan.id}
                className={`relative bg-white rounded-2xl p-8 transition-shadow duration-300 ${
                  plan.popular
                    ? "ring-2 ring-accent shadow-xl shadow-accent/10"
                    : "border border-border hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-accent text-white text-xs font-bold">
                    {t('pricingPage.mostPopular')}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.popular ? "gradient-accent" : "bg-accent/10"
                    }`}
                  >
                    <plan.icon
                      className={`w-5 h-5 ${
                        plan.popular ? "text-white" : "text-accent"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-primary">
                    {plan.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-text-muted text-sm">MAD</span>
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  {t('pricingPage.cardPurchase')}
                </p>
                <p className="mt-3 text-sm text-text-muted">{plan.desc}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-text-muted">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/order?type=${plan.id}`}
                  className={`mt-8 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.popular
                      ? "gradient-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02]"
                      : "bg-neutral text-primary hover:bg-neutral-dark"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Subscription */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-neutral rounded-2xl p-8 border border-border text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-primary">
                {t('pricingPage.subscriptionTitle')}
              </h3>
              <p className="mt-2 text-3xl font-extrabold text-primary">
                {t('pricingPage.subscriptionPrice')}
              </p>
              <p className="mt-3 text-sm text-text-muted max-w-md mx-auto">
                {t('pricingPage.subscriptionDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight text-center">
            {t('faq.title')}
          </h2>
          <p className="mt-4 text-text-muted text-center">
            {t('faq.subtitle')}
          </p>
          <div className="mt-12 bg-neutral rounded-2xl p-6 sm:p-8">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('pricingPage.ctaTitle')}
          </h2>
          <p className="mt-4 text-white/60 max-w-lg mx-auto">
            {t('pricingPage.ctaDesc')}
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full font-semibold gradient-accent shadow-xl shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
          >
            {t('pricingPage.ctaButton')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
