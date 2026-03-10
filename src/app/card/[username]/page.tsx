import { createClient } from "@/lib/supabase/server";
import PublicCardClient from "./PublicCardClient";

export const dynamic = 'force-dynamic';

export default async function PublicCardPage(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  const username = params.username;
  const supabase = await createClient();

  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral px-4 text-center">
        <div>
          <h1 className="text-xl font-bold text-primary">Card Not Found</h1>
          <p className="mt-3 text-sm text-text-muted">This digital business card does not exist.</p>
        </div>
      </div>
    );
  }

  // Record an analytics view event (fire-and-forget but with error logging)
  supabase.from("analytics_events").insert({
    profile_id: profile.id,
    event_type: "view",
  }).then(({ error }) => {
    if (error) console.error("Analytics insert error:", error.message);
  });

  // Fetch Links
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: true });

  // Fetch Products (Business Only)
  let products = [];
  if (profile.card_type === 'business') {
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    products = productsData || [];
  }

  return <PublicCardClient profile={profile} links={links || []} products={products} />;
}
