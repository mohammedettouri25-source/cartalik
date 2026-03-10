import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Activity } from 'lucide-react';
import { redirect } from 'next/navigation';
import DashboardContent from './DashboardContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Security Check: Verify if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return redirect('/dashboard');
  }

  // Use service role for admin fetches to bypass RLS
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Fetch orders
  const { data: orders, error } = await supabaseAdmin
    .from('card_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-red-600 flex items-center gap-4">
        <Activity className="w-8 h-8 opacity-50" />
        <div>
          <h3 className="font-black uppercase tracking-tight text-lg leading-tight">System Interrupt</h3>
          <p className="text-sm font-medium mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  // Fetch profiles
  const { data: allProfiles, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch all subscriptions separately to ensure join issues don't occur
  const { data: allSubscriptions, error: subsError } = await supabaseAdmin
    .from('subscriptions')
    .select('*');

  if (profilesError || subsError) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-red-600 flex items-center gap-4">
        <Activity className="w-8 h-8 opacity-50" />
        <div>
          <h3 className="font-black uppercase tracking-tight text-lg leading-tight">Data Sync Error</h3>
          <p className="text-sm font-medium mt-1">{profilesError?.message || subsError?.message}</p>
        </div>
      </div>
    );
  }

  // Map subscriptions to profiles
  const profilesWithSubs = (allProfiles || []).map(p => ({
    ...p,
    subscriptions: (allSubscriptions || []).filter(s => s.profile_id === p.id)
  }));

  // Fetch profiles count
  const totalUsers = allProfiles?.length || 0;

  // Filter to only profiles that need attention (expired or missing subscription)
  const expired = profilesWithSubs.filter((p: any) => {
    const sub = p.subscriptions?.[0];
    
    // 1. If profile is inactive, it always needs attention
    if (!p.is_active) return true;

    // 2. If it is active BUT has no subscription record, it needs attention (Status=none fix)
    if (!sub) return true;

    // 3. If it is active BUT subscription is expired or past end date, it needs attention
    if (sub.status !== 'active') return true;
    if (sub.current_period_end && new Date(sub.current_period_end) < new Date()) return true;

    return false;
  });

  console.log(`ADMIN_FETCH: Found ${allProfiles?.length} profiles and ${allSubscriptions?.length} subs.`);
  console.log(`ADMIN_EXPIRED: Found ${expired.length} profiles meeting expiration criteria.`);

  // Calculate 30-day Acquisition Stats for the Chart
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const currentPeriod = (allProfiles || []).filter(p => new Date(p.created_at) >= thirtyDaysAgo);
  const previousPeriod = (allProfiles || []).filter(p => {
    const d = new Date(p.created_at);
    return d >= sixtyDaysAgo && d < thirtyDaysAgo;
  });

  const currentCount = currentPeriod.length;
  const previousCount = previousPeriod.length;

  let growthPercent = 0;
  if (previousCount > 0) {
    growthPercent = Math.round(((currentCount - previousCount) / previousCount) * 100 * 10) / 10;
  } else if (currentCount > 0) {
    growthPercent = 100;
  }

  // Generate 12 bars (each representing ~2.5 days for a 30-day view)
  const chartData = [];
  const chartLabels = [];
  
  // Create 12 data points
  for (let i = 11; i >= 0; i--) {
    const daysOffset = Math.floor((i * 30) / 11);
    const start = new Date(now.getTime() - (daysOffset + 2) * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - daysOffset * 24 * 60 * 60 * 1000);
    
    const count = currentPeriod.filter(p => {
      const d = new Date(p.created_at);
      return d >= start && d <= end;
    }).length;
    
    chartData.push(count);

    if (i % 3 === 0) {
       chartLabels.push(end.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }));
    }
  }

  const acquisitionStats = {
    growthPercent,
    chartData,
    chartLabels: chartLabels.reverse()
  };

  return (
    <>
      <div className="absolute top-4 right-4 text-[10px] text-slate-400 font-mono z-50 bg-white/80 p-1 px-2 rounded-md border border-slate-100 italic">
        Last Sync: {new Date().toLocaleTimeString()} (Data: {allProfiles?.length || 0}u)
      </div>
      <DashboardContent 
        orders={orders || []} 
        totalUsers={totalUsers}
        expiredProfiles={expired}
        acquisitionStats={acquisitionStats}
      />
    </>
  );
}
