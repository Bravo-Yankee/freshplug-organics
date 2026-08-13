import { getProducts } from "@/lib/data/products";
import { getFaqs } from "@/lib/data/faqs";
import type { Product } from "@/content/products";
import type { Faq } from "@/content/faqs";

const INSTRUCTIONS = `You are the customer support assistant for Freshplug Organics, an organic poultry farm in Kenya selling eggs, chicken, turkey, live birds, and chicks. All prices are in Kenyan Shillings (KSH).

Answer questions using only the product catalog and FAQ data below. If a question can't be answered from that data (e.g. it needs a specific order status, or asks about something not covered), say so plainly and point the customer to WhatsApp on 254714221885 or the Contact page rather than guessing.

Keep answers short and direct — a sentence or two for a simple question, a short list only when comparing multiple products. Do not invent products, prices, or policies that aren't in the data below.`;

function formatProducts(products: Product[]): string {
  return products
    .map((p) => {
      const options = Object.entries(p.options)
        .map(([key, values]) => `${key}: ${values.join(", ")}`)
        .join("; ");
      return `- ${p.name} (${p.category}) — KSH ${p.price}${p.inStock ? "" : " [out of stock]"}. ${p.description} Options: ${options || "none"}.`;
    })
    .join("\n");
}

function formatFaqs(faqs: Faq[]): string {
  return faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
}

/**
 * Renders a deterministic grounding block from the current catalog + FAQ
 * data, passed as the Gemini systemInstruction on every request.
 * getProducts()/getFaqs() already order by id; kept deterministic here too
 * (no timestamps, stable key order) since Gemini's own request-level
 * caching (ai.caches) needs an identical prefix to hit — not wired up here,
 * as this grounding text is well under the token minimum for explicit
 * context caching.
 */
export async function buildSystemPrompt(): Promise<string> {
  const [products, faqs] = await Promise.all([getProducts(), getFaqs()]);

  return `${INSTRUCTIONS}

## Product catalog

${formatProducts(products)}

## Frequently asked questions

${formatFaqs(faqs)}`;
}
