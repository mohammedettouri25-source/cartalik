'use client';

import { useActionState, useEffect, useState } from 'react';
import { UserPlus, ChevronDown, AlertCircle, Loader2, Sparkles, ShieldCheck, Mail, Key, CreditCard, Activity } from 'lucide-react';
import { createManualUser } from './actions';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';

const initialState = {
  success: false,
  error: '',
};

export default function ManualUserForm() {
  const { t } = useLocale();
  const [state, formAction, isPending] = useActionState(createManualUser, initialState);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/admin/users');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden group/module">
      <details 
        className="group" 
        open={isOpen} 
        onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="flex items-center justify-between p-8 cursor-pointer hover:bg-slate-50 transition-all list-none">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-accent shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">{t('dashboard.deploymentModule')}</h2>
              <p className="text-sm font-medium text-slate-400">{t('dashboard.directNeuralInsertion')}</p>
            </div>
          </div>
          <div className={`p-2 rounded-xl border border-slate-100 transition-all ${isOpen ? 'bg-slate-900 border-slate-900' : 'bg-white'}`}>
            <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
          </div>
        </summary>
        
        <div className="px-8 pb-10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="h-px bg-slate-100" />
          
          <form action={formAction} className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  <UserPlus className="w-3 h-3" />
                  {t('dashboard.legalIdentity')}
                </label>
                <input 
                  name="full_name" 
                  required 
                  disabled={isPending}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none disabled:opacity-50 transition-all placeholder:text-slate-300" 
                  placeholder="e.g. ALEXANDER DRAKE" 
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  <Mail className="w-3 h-3" />
                  {t('dashboard.commLink')}
                </label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  disabled={isPending}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none disabled:opacity-50 transition-all placeholder:text-slate-300" 
                  placeholder="drake@nexus.com" 
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  <Key className="w-3 h-3" />
                  {t('dashboard.accessCipher')}
                </label>
                <div className="relative group/cipher">
                  <input 
                    name="password" 
                    required 
                    minLength={6} 
                    defaultValue="Cartalik2026!" 
                    disabled={isPending}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-black tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none disabled:opacity-50 transition-all text-indigo-600" 
                  />
                  <div className="absolute end-4 top-1/2 -translate-y-1/2 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg border border-indigo-100 opacity-0 group-focus-within/cipher:opacity-100 transition-opacity uppercase font-black tracking-tighter">{t('dashboard.secure')}</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  <CreditCard className="w-3 h-3" />
                  {t('dashboard.hardwareProtocol')}
                </label>
                <select 
                  name="card_type" 
                  required 
                  disabled={isPending}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none disabled:opacity-50 transition-all appearance-none cursor-pointer"
                >
                  <option value="personal">{t('registry.personal').toUpperCase()}{t('dashboard.neuralLink')}</option>
                  <option value="business">{t('registry.business').toUpperCase()}{t('dashboard.enterpriseHub')}</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-200/50">
              <label className="flex items-center gap-4 cursor-pointer group/toggle">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked 
                    disabled={isPending}
                    className="peer sr-only" 
                  />
                  <div className="w-12 h-6 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-1 after:start-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all rtl:peer-checked:after:-translate-x-6 ltr:peer-checked:after:translate-x-6 shadow-inner" />
                </div>
                <div>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-widest group-hover:text-green-600 transition-colors">{t('dashboard.immediateActivation')}</span>
                  <p className="text-xs font-medium text-slate-400">{t('dashboard.initHardware')}</p>
                </div>
              </label>
            </div>

            {state.error && (
              <div className="md:col-span-2 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 text-sm animate-shake">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                </div>
                <p className="font-bold uppercase tracking-tight italic">{state.error}</p>
              </div>
            )}

            {state.success && (
              <div className="md:col-span-2 p-5 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-4 text-green-700 text-sm animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 text-green-600" />
                </div>
                <div>
                  <p className="font-black uppercase tracking-tight text-base leading-none mb-1">{t('dashboard.deploymentSuccess')}</p>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{t('dashboard.redirectingToHub')}</p>
                </div>
              </div>
            )}

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit" 
                disabled={isPending || state.success}
                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-200 hover:shadow-accent/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rtl:translate-x-full ltr:-translate-x-full rtl:group-hover/btn:-translate-x-full ltr:group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('dashboard.bypassingSecurityGate')}
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5 text-accent" />
                    {t('dashboard.executeDeployment')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </details>
    </div>
  );
}
