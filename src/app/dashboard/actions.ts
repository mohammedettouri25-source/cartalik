"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to update your profile");
  }

  const updates: Record<string, string | null> = {
    name: formData.get("name") as string,
    title: formData.get("title") as string,
    company: formData.get("company") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    whatsapp: formData.get("whatsapp") as string,
    bio: formData.get("bio") as string,
  };

  // Only include color fields if they are provided
  const fontColor = formData.get("font_color") as string;
  const bgColor = formData.get("bg_color") as string;
  if (fontColor) updates.font_color = fontColor;
  if (bgColor) updates.bg_color = bgColor;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile", error);
    throw new Error("Could not update profile");
  }

  revalidatePath("/dashboard");
}

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to upload a photo");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("File size must be less than 2MB");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-${Math.random()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("profiles")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Storage upload error", uploadError);
    throw new Error(`Storage error: ${uploadError.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("profiles")
    .getPublicUrl(filePath);

  // Update profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ photo_url: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    console.error("Profile update error", updateError);
    throw new Error("Could not update profile with new photo");
  }

  revalidatePath("/dashboard");
  return publicUrl;
}
export async function uploadPDF(formData: FormData, field: "cv_url" | "catalogue_url") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to upload files");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type
  if (file.type !== "application/pdf") {
    throw new Error("File must be a PDF");
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size must be less than 5MB");
  }

  const fileName = `${user.id}-${field}-${Math.random()}.pdf`;
  const filePath = `${user.id}/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("profiles")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Storage upload error", uploadError);
    throw new Error(`Storage error: ${uploadError.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("profiles")
    .getPublicUrl(filePath);

  // Update profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ [field]: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    console.error("Profile update error", updateError);
    throw new Error("Could not update profile with new file");
  }

  revalidatePath("/dashboard");
  return publicUrl;
}

export async function addLink(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to add links");
  }

  const newLink = {
    profile_id: user.id,
    platform: formData.get("platform") as string,
    url: formData.get("url") as string,
  };

  const { error } = await supabase.from("links").insert(newLink);

  if (error) {
    console.error("Error adding link", error);
    throw new Error("Could not add link");
  }

  revalidatePath("/dashboard");
}

export async function deleteLink(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to delete links");
  }

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) {
    console.error("Error deleting link", error);
    throw new Error("Could not delete link");
  }

  revalidatePath("/dashboard");
}

export async function reorderLinks(orderedIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to reorder links");
  }

  // Update sort_order for each link
  const updates = orderedIds.map((id, index) =>
    supabase
      .from("links")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("profile_id", user.id)
  );

  await Promise.all(updates);
  revalidatePath("/dashboard");
}

/* ─── Business Features: Leads ─── */

export async function getLeads() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads", error);
    return [];
  }

  return data;
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error("Could not delete lead");

  revalidatePath("/dashboard");
}

/* ─── Business Features: Products ─── */

export async function getProducts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching products", error);
    return [];
  }

  return data;
}

export async function addProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  let imageUrl = formData.get("image_url") as string || null;
  const file = formData.get("image") as File;

  if (file && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-product-${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Storage upload error", uploadError);
      throw new Error(`Storage error: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from("profiles")
      .getPublicUrl(filePath);

    imageUrl = publicUrl;
  }

  const newProduct = {
    profile_id: user.id,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    external_link: formData.get("external_link") as string,
    image_url: imageUrl,
  };

  const { error } = await supabase.from("products").insert(newProduct);

  if (error) throw new Error("Could not add product");

  revalidatePath("/dashboard");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const updates = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    external_link: formData.get("external_link") as string,
    image_url: formData.get("image_url") as string,
  };

  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) throw new Error("Could not update product");

  revalidatePath("/dashboard");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);

  if (error) throw new Error("Could not delete product");

  revalidatePath("/dashboard");
}

/* ─── Public Action: Submit Lead ─── */
export async function submitLead(ownerId: string, formData: FormData) {
  const supabase = await createClient();
  
  const leadData = {
    user_id: ownerId,
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    company: formData.get("company") as string,
    message: formData.get("message") as string,
    source: "NFC_CARD"
  };

  const { error } = await supabase.from("leads").insert(leadData);

  if (error) {
    console.error("Error submitting lead:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
