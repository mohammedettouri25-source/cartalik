import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

import { LocaleProvider } from "@/context/LocaleContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const tajawal = Tajawal({
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  subsets: ["arabic"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "Cartalik — Your Smart NFC Business Card",
  description:
    "Create your digital NFC business card. Tap, share, and connect instantly with a modern smart card.",
  keywords: ["NFC", "business card", "digital card", "smart card", "Cartalik"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${tajawal.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LocaleProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </LocaleProvider>
      </body>
    </html>
  );
}
