"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { CreditCard, Eye, EyeOff, ArrowRight } from "lucide-react";
import { login } from "@/app/auth/actions";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-neutral">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/25 p-1">
              <img src="/images/logo.png" alt="Cartalik Logo" className="w-full h-full object-contain filter brightness-0 invert" />
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight">
              Cartalik
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-primary">
            {t('login.welcomeBack')}
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 text-center">
              {error}
            </div>
          )}
          <form className="space-y-5" action={login}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5" htmlFor="email">
                {t('login.emailLabel')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-neutral border border-border text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5" htmlFor="password">
                {t('login.passwordLabel')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-neutral border border-border text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs text-accent hover:text-accent-dark font-medium transition-colors"
              >
                {t('login.forgotPassword')}
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-accent text-white text-sm font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-200"
            >
              {t('login.loginBtn')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>


        </div>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-text-muted">
          {t('login.noCard')}{" "}
          <Link
            href="/order"
            className="text-accent font-semibold hover:text-accent-dark transition-colors"
          >
            {t('login.orderLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
