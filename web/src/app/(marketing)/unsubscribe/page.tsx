import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Manage your Freshplug Organics newsletter subscription.",
};

interface UnsubscribePageProps {
  searchParams: { status?: string };
}

/**
 * Landed on from the link in api/newsletter/unsubscribe/route.ts's
 * redirect — that route does the actual database update, this page just
 * confirms it happened (or flags an already-used/invalid link).
 */
export default function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const done = searchParams.status === "done";

  return (
    <section className="page-header">
      <div className="container">
        <h1>{done ? "You're unsubscribed" : "Link not recognized"}</h1>
        <p>
          {done
            ? "You won't receive any more newsletter emails from us. If that was a mistake, you can resubscribe any time from the homepage."
            : "That unsubscribe link is invalid or has already been used."}
        </p>
      </div>
    </section>
  );
}
