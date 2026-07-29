"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ToastType = "success" | "error" | "info";

/**
 * One shared toast implementation, replacing the 4 near-identical
 * copy-pasted `showNotification()` functions scattered across the legacy
 * site's main.js, shop.js, customer-account.js, and admin-dashboard.js.
 */
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback((message: string, type: ToastType = "info") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ message, type });
    timeoutRef.current = setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { toast, show, dismiss: () => setToast(null) };
}

const COLORS: Record<ToastType, string> = {
  success: "#4CAF50",
  error: "#f44336",
  info: "#2196F3",
};

export function ToastViewport({
  toast,
  onDismiss,
}: {
  toast: { message: string; type: ToastType } | null;
  onDismiss: () => void;
}) {
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "100px",
        right: "20px",
        background: COLORS[toast.type],
        color: "white",
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        style={{ background: "none", border: "none", color: "white", fontSize: "1.2rem", cursor: "pointer" }}
      >
        &times;
      </button>
    </div>
  );
}
