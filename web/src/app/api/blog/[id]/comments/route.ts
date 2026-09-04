import { getSupabaseClient } from "@/lib/supabase/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
// Separate Map from api/contact/route.ts's — a burst of comments on a
// popular post shouldn't eat into (or be capped by) the contact form's
// budget from the same visitor, and vice versa.
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}

function getClientKey(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

interface CommentPayload {
  name: string;
  email: string;
  comment: string;
}

function isValidPayload(value: unknown): value is CommentPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.name === "string" &&
    v.name.trim() !== "" &&
    typeof v.email === "string" &&
    EMAIL_REGEX.test(v.email) &&
    typeof v.comment === "string" &&
    v.comment.trim() !== ""
  );
}

/**
 * Backs BlogComments.tsx on /blog/[id]. Guest name+email, same identity
 * pattern as /api/contact — no Supabase Auth required. Goes through this
 * route rather than a direct browser Supabase insert so validation and
 * rate-limiting are consistent with every other public write on the site.
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const postId = Number(params.id);
  if (!Number.isInteger(postId)) {
    return new Response("Invalid post id", { status: 400 });
  }

  const clientKey = getClientKey(req);
  if (isRateLimited(clientKey)) {
    return new Response("Too many requests — please wait a minute and try again.", {
      status: 429,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!isValidPayload(body)) {
    return new Response("Missing or invalid comment fields.", { status: 400 });
  }

  const { name, email, comment } = body;

  const { data, error } = await getSupabaseClient()
    .from("blog_comments")
    .insert({ post_id: postId, name, email, comment })
    .select("id, post_id, created_at, name, comment")
    .single();

  if (error) {
    console.error("Failed to save blog comment:", error);
    return new Response("Something went wrong saving your comment.", { status: 500 });
  }

  return Response.json({
    id: data.id,
    postId: data.post_id,
    createdAt: data.created_at,
    name: data.name,
    comment: data.comment,
  });
}
