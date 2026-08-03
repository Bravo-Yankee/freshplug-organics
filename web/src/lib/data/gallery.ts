import { getSupabaseClient } from "@/lib/supabase/client";
import type { GalleryPhoto } from "@/content/gallery";

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const { data, error } = await getSupabaseClient().from("gallery_photos").select("*").order("id");
  if (error) throw error;
  return data as GalleryPhoto[];
}
