'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import ar from '@/locales/ar.json';

type Locale = 'en' | 'fr' | 'ar';
type Translations = typeof en;

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Translations> = { en, fr, ar };

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('cartalik_locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr' || savedLocale === 'ar')) {
      setLocale(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('cartalik_locale', newLocale);
    
    // Handle RTL
    if (newLocale === 'ar') {
      document.body.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.body.dir = 'ltr';
      document.documentElement.lang = newLocale;
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[locale];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Fallback to English
        let fallback: any = translations['en'];
        for (const fk of keys) {
          if (fallback && fallback[fk]) {
            fallback = fallback[fk];
          } else {
            return key; // Key not found
          }
        }
        return fallback;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
