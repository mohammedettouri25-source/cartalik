import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LeadsTable from "./LeadsTable";

export default async function LeadsPage() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // Fetch leads for the current user
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (leadsError) {
    console.error("Error fetching leads:", leadsError);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none mb-2">Network Leads</h1>
        <p className="text-slate-500 font-medium">Manage and export contacts collected from your smart card.</p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        <LeadsTable initialLeads={leads || []} />
      </div>
    </div>
  );
}
