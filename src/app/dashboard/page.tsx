import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClientPage from "./ClientPage";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch Links (ordered by sort_order or created_at)
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // Fetch Subscriptions
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  // Fetch Analytics Events
  const { data: analytics } = await supabase
    .from("analytics_events")
    .select("*")
    .eq("profile_id", user.id);

  // Fetch Business Features (Conditional)
  let leads = [];
  let products = [];
  
  if (profile?.card_type === 'business') {
    const { data: leadsData } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    leads = leadsData || [];

    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("profile_id", user.id)
      .order("sort_order", { ascending: true });
    products = productsData || [];
  }

  return (
    <DashboardClientPage 
      profile={profile} 
      links={links || []} 
      subscription={subscription} 
      analytics={analytics || []} 
      leads={leads}
      products={products}
    />
  );
}
