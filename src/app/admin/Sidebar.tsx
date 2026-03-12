'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LogOut, LayoutDashboard, Users, UserCircle, Shield, ChevronRight, LucideIcon } from 'lucide-react';
import { logout } from '@/app/auth/actions';
import { useLocale } from '@/context/LocaleContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  activeColor: string;
}

function NavItem({ href, icon: Icon, label, activeColor }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
        isActive 
          ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 rtl:-translate-x-1 ltr:translate-x-1' 
          : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
      }`}
    >
      <div className={`p-2 rounded-xl transition-all ${
        isActive 
          ? 'bg-white/10 text-white' 
          : `bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:${activeColor}`
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`font-bold text-sm flex-1 ${isActive ? 'text-white' : ''}`}>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 text-accent animate-pulse" />}
    </Link>
  );
}

export default function Sidebar({ userEmail }: { userEmail?: string }) {
  const { t } = useLocale();

  return (
    <aside className="w-full md:w-80 bg-white border-e border-slate-100 flex flex-col sticky top-0 md:h-screen overflow-y-auto z-30 transition-all duration-500">
      <div className="p-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-xl shadow-accent/20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6 relative">
            <Image 
              src="/images/logo.png" 
              alt="Cartalik Logo" 
              fill
              className="object-contain filter brightness-0 invert p-1.5" 
            />
          </div>
          <div>
            <span className="font-black text-slate-900 tracking-tighter text-2xl block leading-none">CARTALIK</span>
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mt-1 block">{t('nav.hqTerminal')}</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-6 space-y-8">
        <div>
          <div className="px-4 mb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            {t('sidebar.coreSystems')}
          </div>
          <div className="space-y-2">
            <NavItem 
              href="/admin" 
              icon={LayoutDashboard} 
              label={t('sidebar.controlCenter')}
              activeColor="text-accent" 
            />
            <NavItem 
              href="/admin/users" 
              icon={Users} 
              label={t('sidebar.nodeRegistry')}
              activeColor="text-blue-500" 
            />
          </div>
        </div>

        <div>
          <div className="px-4 mb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            {t('sidebar.external')}
          </div>
          <div className="space-y-2">
            <NavItem 
              href="/dashboard" 
              icon={UserCircle} 
              label={t('sidebar.userView')}
              activeColor="text-indigo-500" 
            />
          </div>
        </div>
      </nav>

      <div className="p-8 mt-auto space-y-6">
        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-5 shadow-2xl shadow-slate-300 relative overflow-hidden group/session">
          <div className="absolute top-0 end-0 w-32 h-32 bg-accent/10 rounded-full -me-16 -mt-16 blur-3xl group-hover/session:bg-accent/20 transition-colors duration-700" />
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent ring-1 ring-white/10 group-hover/session:scale-110 transition-transform duration-500">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{t('sidebar.rootAccess')}</p>
              <p className="text-sm font-black text-white truncate uppercase italic">{userEmail?.split('@')[0]}</p>
            </div>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-black text-white bg-white/5 hover:bg-red-500 transition-all duration-300 rounded-[1.25rem] backdrop-blur-md uppercase tracking-widest border border-white/5 hover:border-red-400 group/btn"
            >
              <LogOut className="w-4 h-4 text-red-400 group-hover/btn:text-white transition-colors" />
              {t('sidebar.disconnect')}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
