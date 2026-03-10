"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitLead(formData: FormData, userId: string, source: string = 'NFC') {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const message = formData.get("message") as string;

  if (!name || !phone) {
    throw new Error("Name and Phone are required.");
  }

  const { error } = await supabase.from("leads").insert({
    user_id: userId,
    name,
    phone,
    email,
    company,
    message,
    source,
  });

  if (error) {
    console.error("Error inserting lead:", error);
    throw new Error("Failed to save contact information.");
  }

  return { success: true };
}
