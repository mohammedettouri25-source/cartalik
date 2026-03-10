'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Zap,
  User,
  Mail,
  Phone as PhoneIcon,
  Sparkles,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { submitCardOrder } from './actions';
import { useLocale } from '@/context/LocaleContext';

export default function OrderPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'business' ? 'business' : 'personal';
  
  const [cardType, setCardType] = useState<'personal' | 'business'>(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('cardType', cardType);

    const result = await submitCardOrder(formData);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || t('orderPage.errorMsg'));
    }
    setIsSubmitting(false);
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          
          <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto text-accent mb-8 animate-zoom-in">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('orderPage.successTitle')}</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            {t('orderPage.successDesc').replace('{type}', t(`orderPage.${cardType}`))}
          </p>
          
          <div className="pt-6">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              {t('orderPage.backHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 px-4 sm:px-6">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {t('orderPage.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {t('orderPage.titlePrefix')} <span className="text-accent underline decoration-accent/20 underline-offset-8">{t('orderPage.titleHighlight')}</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            {t('orderPage.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200 border border-slate-100 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('orderPage.hardwareTier')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCardType('personal')}
                    className={`relative p-5 rounded-2xl border-2 transition-all text-left group ${
                      cardType === 'personal' 
                        ? 'border-accent bg-accent/[0.02] shadow-lg shadow-accent/5' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <Smartphone className={`w-6 h-6 mb-3 ${cardType === 'personal' ? 'text-accent' : 'text-slate-300'}`} />
                    <div className="font-bold text-slate-900 leading-none mb-1">{t('orderPage.personal')}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">149 MAD</div>
                    {cardType === 'personal' && (
                      <div className="absolute top-4 right-4 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardType('business')}
                    className={`relative p-5 rounded-2xl border-2 transition-all text-left group ${
                      cardType === 'business' 
                        ? 'border-blue-500 bg-blue-500/[0.02] shadow-lg shadow-blue-500/5' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mb-3 ${cardType === 'business' ? 'text-blue-500' : 'text-slate-300'}`} />
                    <div className="font-bold text-slate-900 leading-none mb-1">{t('orderPage.business')}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">199 MAD</div>
                    {cardType === 'business' && (
                      <div className="absolute top-4 right-4 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('orderPage.fullNameLabel')}</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-accent transition-colors" />
                    <input
                      name="fullName"
                      type="text"
                      required
                      placeholder={t('orderPage.fullNamePlaceholder')}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold transition-all text-slate-900 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('orderPage.emailLabel')}</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-accent transition-colors" />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder={t('orderPage.emailPlaceholder')}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold transition-all text-slate-900 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('orderPage.phoneLabel')}</label>
                  <div className="relative group">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-accent transition-colors" />
                    <input
                      name="phone"
                      type="tel"
                      placeholder={t('orderPage.phonePlaceholder')}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold transition-all text-slate-900 placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all ${
                  isSubmitting 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-1 shadow-2xl shadow-slate-200 active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {t('orderPage.submitBtn')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-accent/20 transition-colors" />
              <h3 className="text-xl font-bold mb-6 tracking-tight relative z-10">{t('orderPage.summaryTitle')}</h3>
              
              <div className="space-y-5 relative z-10">
                {[
                  { icon: Zap, label: t('orderPage.summaryCheck1'), desc: t('orderPage.summaryDesc1') },
                  { icon: Shield, label: t('orderPage.summaryCheck2'), desc: t('orderPage.summaryDesc2') },
                  { icon: CreditCard, label: t('orderPage.summaryCheck3'), desc: t('orderPage.summaryDesc3') },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group/item">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-accent ring-1 ring-white/10 group-hover/item:scale-110 transition-transform">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{item.label}</div>
                      <div className="text-slate-400 text-[10px] font-medium leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('orderPage.dueToday')}</div>
                  <div className="text-2xl font-black text-accent">{cardType === 'personal' ? '149' : '199'} MAD</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('orderPage.statusLabel')}</div>
                  <div className="text-[10px] font-black text-white bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">{t('orderPage.statusValue')}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                {t('orderPage.terms')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
