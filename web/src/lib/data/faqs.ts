import { getSupabaseClient } from "@/lib/supabase/client";
import type { Faq } from "@/content/faqs";

export async function getFaqs(): Promise<Faq[]> {
  const { data, error } = await getSupabaseClient().from("faqs").select("*").order("id");
  if (error) throw error;
  return data as Faq[];
}
