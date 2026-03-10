import { createClient } from '@/lib/supabase/server';
import { Activity } from 'lucide-react';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import UsersClientTable from './UsersClientTable';

export default async function UsersManagement() {
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

  // Fetch all profiles
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
          <h3 className="font-black uppercase tracking-tight text-lg leading-tight">Registry Fault</h3>
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

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <UsersClientTable profiles={profilesWithSubs} />
    </div>
  );
}
