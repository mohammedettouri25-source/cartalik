import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from './Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Protect Admin route
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-inter" suppressHydrationWarning>
      <Sidebar userEmail={user.email} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 relative">
        {/* Background Decorative Element */}
        <div className="fixed top-0 right-0 w-1/3 h-1/3 gradient-accent opacity-[0.03] blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
