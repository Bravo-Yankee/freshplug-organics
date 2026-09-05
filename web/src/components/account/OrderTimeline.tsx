import type { Order } from "@/lib/data/account";

const STEPS: { key: Order["status"]; label: string }[] = [
  { key: "pending", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "fulfilled", label: "Fulfilled" },
];

/**
 * A cancelled order never reached "fulfilled" through the normal pipeline,
 * so it gets its own single-badge rendering instead of a partially-lit
 * three-step timeline that would misleadingly suggest progress.
 */
export function OrderTimeline({ status }: { status: Order["status"] }) {
  if (status === "cancelled") {
    return (
      <div className="order-timeline order-timeline-cancelled">
        <span className="order-timeline-step cancelled">Cancelled</span>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.key === status);

  return (
    <div className="order-timeline">
      {STEPS.map((step, index) => {
        const state = index < currentIndex ? "completed" : index === currentIndex ? "current" : "upcoming";
        return (
          <div className={`order-timeline-step ${state}`} key={step.key}>
            <span className="order-timeline-dot" />
            <span className="order-timeline-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
