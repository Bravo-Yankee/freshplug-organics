"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the Freshplug Organics assistant. Ask me about our eggs, chicken, turkey, chicks, or how ordering and delivery work.",
};

/**
 * Floating chat button + panel, in the same fixed-position family as the
 * legacy site's WhatsApp quick-order button (assets/js/main.js) but built
 * as a real React component against /api/chat instead of a wa.me link.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Position is inline-styled (not a CSS class), so the mobile bottom-tabbar
  // clearance — 80px, same offset .cart-toggle/.whatsapp-float/.back-to-top
  // use via the max-width: 768px media query — has to be applied here in JS
  // rather than picked up from that stylesheet rule automatically.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    setIsMobile(query.matches);
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        const errorText = await res.text().catch(() => "");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              errorText || "Sorry, something went wrong reaching the assistant. Please try again shortly.",
          },
        ]);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let receivedAny = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) receivedAny = true;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
      }

      // The stream can fail after the Response has already committed to a
      // 200 (e.g. an upstream API error mid-request) — there's no clean
      // error status to check in that case, only a stream that ended with
      // no text. Replace the empty bubble rather than leaving it hanging.
      if (!receivedAny) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Sorry, something went wrong reaching the assistant. Please try again shortly.",
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't reach the assistant. Please try again." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: isMobile ? "80px" : "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#b5533c",
          color: "white",
          border: "none",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.25)",
          fontSize: "1.5rem",
          cursor: "pointer",
          zIndex: 10000,
        }}
      >
        <i className={open ? "fas fa-times" : "fas fa-comment"} />
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: isMobile ? "150px" : "90px",
            right: "20px",
            width: "340px",
            maxWidth: "calc(100vw - 40px)",
            height: "460px",
            maxHeight: isMobile ? "calc(100vh - 190px)" : "calc(100vh - 130px)",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 10000,
          }}
        >
          <div style={{ background: "#b5533c", color: "white", padding: "1rem" }}>
            <strong>Freshplug Assistant</strong>
          </div>

          <div
            ref={scrollRef}
            style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? "#b5533c" : "#f1efe9",
                  color: m.role === "user" ? "white" : "#333",
                  padding: "0.6rem 0.9rem",
                  borderRadius: "10px",
                  maxWidth: "85%",
                  fontSize: "0.9rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content || (pending && i === messages.length - 1 ? "…" : "")}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} style={{ display: "flex", borderTop: "1px solid #eee", padding: "0.5rem" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our products…"
              disabled={pending}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "0.5rem",
                fontSize: "0.9rem",
              }}
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              style={{
                background: "#b5533c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 0.9rem",
                cursor: pending ? "default" : "pointer",
                opacity: pending || !input.trim() ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
