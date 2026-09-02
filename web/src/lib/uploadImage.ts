import { getSupabaseClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Shared upload helper for every admin image field. Each caller passes its
 * own public Storage bucket — kept separate per content type
 * (product-images / blog-images) rather than one shared bucket, same
 * reasoning as products.categories vs blog_categories staying separate
 * tables (see AGENTS.md Phase 9). Throws with a user-facing message on
 * failure so callers can show it directly in a toast.
 */
export async function uploadImage(bucket: string, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image is too large — please choose one under 5MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const supabase = getSupabaseClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) {
    throw new Error("Couldn't upload image — please try again.");
  }

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
