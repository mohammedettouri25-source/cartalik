'use client';

import { useLocale } from '@/context/LocaleContext';
import { Globe, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
] as const;

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 hover:border-accent/30 hover:bg-white transition-all group"
      >
        <Globe className="w-4 h-4 text-slate-400 group-hover:text-accent transition-colors" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
          {currentLang.code}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 py-2 z-50 animate-zoom-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code as 'en' | 'fr' | 'ar');
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-accent/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{lang.flag}</span>
                <span className={`text-[11px] font-bold ${locale === lang.code ? 'text-accent' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {lang.label}
                </span>
              </div>
              {locale === lang.code && (
                <Check className="w-3 h-3 text-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
