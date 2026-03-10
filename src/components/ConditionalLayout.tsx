'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide navbar/footer on admin, dashboard and card pages
  const isExcludedRoute = pathname?.startsWith('/admin') || 
                         pathname?.startsWith('/dashboard') || 
                         pathname?.startsWith('/card') ||
                         pathname === '/login' || 
                         pathname === '/signup';

  if (isExcludedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
