"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Link2,
  BarChart3,
  QrCode,
  CreditCard as SubIcon,
  Sparkles,
  Menu,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import { logout } from "@/app/auth/actions";
import { useLocale } from "@/context/LocaleContext";

interface UserProfile {
  name: string;
  username: string;
  photo_url: string;
}

export default function DashboardSidebar({ profile, children }: { profile: UserProfile | null, children: React.ReactNode }) {
  const { t } = useLocale();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const navItems = [
    { icon: User, label: t('userSidebar.profile'), id: "profile", color: "blue" },
    { icon: Link2, label: t('userSidebar.links'), id: "links", color: "accent" },
    { icon: BarChart3, label: t('userSidebar.analytics'), id: "analytics", color: "indigo" },
    { icon: Users, label: t('userSidebar.leads') || "Leads", id: "leads", color: "emerald" },
    { icon: QrCode, label: t('userSidebar.qrCode'), id: "qr", color: "amber" },
    { icon: SubIcon, label: t('userSidebar.subscription'), id: "subscription", color: "purple" },
    { icon: Sparkles, label: t('userSidebar.aiTools'), id: "ai", color: "rose" },
  ];

  const initials = profile?.name ? profile.name.substring(0, 2).toUpperCase() : "US";
  const publicCardUrl = `/card/${profile?.username || 'new'}`;

  const colorMap: Record<string, string> = {
    blue: "group-hover:text-blue-500 group-hover:bg-blue-50",
    accent: "group-hover:text-accent group-hover:bg-green-50",
    indigo: "group-hover:text-indigo-500 group-hover:bg-indigo-50",
    amber: "group-hover:text-amber-500 group-hover:bg-amber-50",
    purple: "group-hover:text-purple-500 group-hover:bg-purple-50",
    rose: "group-hover:text-rose-500 group-hover:bg-rose-50",
    emerald: "group-hover:text-emerald-500 group-hover:bg-emerald-50",
  };

  const activeColorMap: Record<string, string> = {
    blue: "text-blue-500 bg-white shadow-sm",
    accent: "text-accent bg-white shadow-sm",
    indigo: "text-indigo-500 bg-white shadow-sm",
    amber: "text-amber-500 bg-white shadow-sm",
    purple: "text-purple-500 bg-white shadow-sm",
    rose: "text-rose-500 bg-white shadow-sm",
    emerald: "text-emerald-500 bg-white shadow-sm",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-inter" suppressHydrationWarning>
      {/* Mobile Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 bg-white rounded-2xl shadow-xl border border-slate-200 text-slate-600"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform p-1">
              <img src="/images/logo.png" alt="Cartalik Logo" className="w-full h-full object-contain filter brightness-0 invert" />
            </div>
            <div>
              <span className="font-black text-slate-900 tracking-tighter text-xl block leading-none">CARTALIK</span>
              <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{t('userSidebar.userConsole')}</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {t('userSidebar.cardEngine')}
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "leads") {
                  window.location.href = "/dashboard/leads";
                  return;
                }
                if (window.location.pathname.includes('/leads')) {
                    window.location.href = `/dashboard#${item.id}`;
                    return;
                }
                setActiveTab(item.id);
                setSidebarOpen(false);
                const element = document.getElementById(item.id);
                if (element) {
                  const y = element.getBoundingClientRect().top + window.scrollY - 40;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id
                  ? "bg-slate-50 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className={`p-2 rounded-lg bg-slate-100 transition-all ${
                activeTab === item.id ? activeColorMap[item.color] : colorMap[item.color]
              }`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`font-semibold text-sm ${activeTab === item.id ? "text-slate-900" : ""}`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              )}
            </button>
          ))}

          <div className="px-4 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {t('userSidebar.external')}
          </div>

          <Link
            href={publicCardUrl}
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group"
          >
            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all text-slate-500 group-hover:text-blue-500">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">{t('userSidebar.publicProfile')}</span>
          </Link>
        </nav>

        {/* Profile/Footer Section */}
        <div className="p-6 mt-auto">
          <div className="bg-slate-900 rounded-2xl p-4 shadow-xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-accent/20 transition-colors" />
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-accent ring-1 ring-slate-700 font-bold overflow-hidden">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('userSidebar.operator')}</p>
                <p className="text-sm font-bold text-white truncate">{profile?.name || t('userSidebar.member')}</p>
              </div>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-red-500 transition-all rounded-lg backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4 text-red-400 group-hover:text-white" />
                {t('userSidebar.endSession')}
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative overflow-x-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 gradient-accent opacity-[0.03] blur-[100px] pointer-events-none" />
        <div className="p-4 md:p-10 relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
