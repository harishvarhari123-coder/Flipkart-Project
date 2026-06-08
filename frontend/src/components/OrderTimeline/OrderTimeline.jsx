import { useEffect, useState } from "react";
import "./OrderTimeline.css";

// ─── Step definitions ───────────────────────────────────────────────
const STEPS = [
  { key: "Ordered",          label: "Ordered",           icon: "📦", dateField: "ordered_at" },
  { key: "Confirmed",        label: "Confirmed",         icon: "✅", dateField: "confirmed_at" },
  { key: "Shipped",          label: "Shipped",           icon: "🚚", dateField: "shipped_at" },
  { key: "Out for Delivery", label: "Out for Delivery",  icon: "📍", dateField: "out_for_delivery_at" },
  { key: "Delivered",        label: "Delivered",         icon: "🏠", dateField: "delivered_at" },
];

const STATUS_ORDER = STEPS.map((s) => s.key);

const ETA_HINTS = {
  Ordered:          "Processing your order…",
  Confirmed:        "Estimated ship: within 24 hrs",
  Shipped:          "Estimated delivery: 3–5 days",
  "Out for Delivery": "Arriving today",
  Delivered:        "Delivered!",
};

// ─── Helpers ────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (iso) => {
  if (!iso) return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

// ─── Component ──────────────────────────────────────────────────────
/**
 * OrderTimeline
 *
 * Props:
 *  order {object} — shape:
 *    {
 *      id: string,
 *      status: "Ordered" | "Confirmed" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled",
 *      ordered_at: ISO string,
 *      confirmed_at: ISO string | null,
 *      shipped_at: ISO string | null,
 *      out_for_delivery_at: ISO string | null,
 *      delivered_at: ISO string | null,
 *    }
 *
 *  pollInterval {number} — ms between live polls (default: 30000). Set 0 to disable.
 *  onPoll {function} — async fn() that returns a fresh order object (used for live polling).
 */
export default function OrderTimeline({ order: initialOrder, pollInterval = 30000, onPoll }) {
  const [order, setOrder] = useState(initialOrder);
  const [log, setLog]     = useState([{ time: formatTime(), msg: "Tracking started", status: initialOrder.status }]);
  const [visible, setVisible] = useState(false);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Sync prop changes (e.g. parent re-fetches)
  useEffect(() => {
    if (initialOrder.status !== order.status) {
      setOrder(initialOrder);
      setLog((prev) => [
        { time: formatTime(), msg: `Status updated → ${initialOrder.status}`, status: initialOrder.status },
        ...prev,
      ]);
    }
  }, [initialOrder]);

  // Live polling
  useEffect(() => {
    if (!pollInterval || !onPoll) return;
    const id = setInterval(async () => {
      try {
        const fresh = await onPoll();
        if (fresh && fresh.status !== order.status) {
          setOrder(fresh);
          setLog((prev) => [
            { time: formatTime(), msg: `Live update → ${fresh.status}`, status: fresh.status },
            ...prev,
          ]);
        }
      } catch (e) {
        console.warn("OrderTimeline poll failed:", e);
      }
    }, pollInterval);
    return () => clearInterval(id);
  }, [pollInterval, onPoll, order.status]);

  // ── Cancelled ────────────────────────────────────────────────────
  if (order.status === "Cancelled") {
    return (
      <div className={`ot-root ${visible ? "ot-visible" : ""}`}>
        <div className="ot-card ot-cancelled-card">
          <div className="ot-cancelled-icon">✕</div>
          <p className="ot-cancelled-title">Order Cancelled</p>
          <p className="ot-cancelled-sub">
            Your order <strong>#{order.id}</strong> has been cancelled.
            If you were charged, a refund will be initiated within 5–7 business days.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(order.status);
  const isDelivered  = order.status === "Delivered";

  return (
    <div className={`ot-root ${visible ? "ot-visible" : ""}`}>
      {/* Header */}
      <div className="ot-header">
        <div className="ot-order-meta">
          <span className="ot-order-label">Order ID:</span>
          <span className="ot-order-id" style={{ color: 'var(--primary, #2563eb)', fontWeight: '700' }}>
            {'Harikart-' + String(Number(order.id) * 137 + 4829).padStart(6, '0')}
          </span>
        </div>
        <span className={`ot-status-badge ${isDelivered ? "ot-badge-done" : "ot-badge-live"}`}>
          <span className="ot-badge-dot" />
          {isDelivered ? "Delivered" : "Live tracking"}
        </span>
      </div>

      {/* Timeline */}
      <div className="ot-card">
        <div className="ot-steps">
          {STEPS.map((step, i) => {
            const completed = i <= currentIndex;
            const active    = i === currentIndex;
            return (
              <div
                key={step.key}
                className={`ot-step${completed ? " ot-completed" : ""}${active ? " ot-active" : ""}`}
                style={{ "--delay": `${i * 80}ms` }}
              >
                {/* Icon + connector line */}
                <div className="ot-step-track">
                  <div className="ot-step-icon">
                    {completed ? (
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="2.5,8.5 6.5,12.5 13.5,4.5" />
                      </svg>
                    ) : (
                      <span className="ot-step-icon-char">{step.icon}</span>
                    )}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`ot-connector${completed ? " ot-connector-done" : ""}`}>
                      <div className="ot-connector-fill" />
                    </div>
                  )}
                </div>

                {/* Label + date */}
                <div className="ot-step-info">
                  <span className="ot-step-label">{step.label}</span>
                  {order[step.dateField] && (
                    <span className="ot-step-date">{formatDate(order[step.dateField])}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ETA bar */}
        {ETA_HINTS[order.status] && (
          <div className="ot-eta">
            <span className="ot-eta-icon">🕐</span>
            <span>{ETA_HINTS[order.status]}</span>
          </div>
        )}
      </div>

      {/* Activity log */}
      {log.length > 0 && (
        <div className="ot-log">
          <p className="ot-log-heading">Activity log</p>
          {log.slice(0, 6).map((entry, i) => (
            <div key={i} className="ot-log-row">
              <span className="ot-log-time">{entry.time}</span>
              <span className="ot-log-msg">{entry.msg}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}