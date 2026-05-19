"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const REASONS = [
  { value: "fake_profile", label: "Fake profile" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "harassment", label: "Harassment or threatening behavior" },
  { value: "spam", label: "Spam or scam" },
  { value: "underage", label: "Underage user" },
  { value: "other", label: "Other" },
];

export function ProfileActions({
  userId,
  displayName,
}: {
  userId: string;
  displayName: string;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBlock() {
    if (!confirm(`Block ${displayName}? They won't be able to see or message you, and you won't see them either.`)) {
      return;
    }
    setPending(true);
    try {
      await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked_id: userId }),
      });
      router.push("/browse");
    } finally {
      setPending(false);
      setMenuOpen(false);
    }
  }

  async function handleReport(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      setError("Pick a reason");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reported_id: userId,
          reason,
          details: details.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Report failed");
        return;
      }
      alert(`Thanks — we've received your report and ${displayName} has been blocked.`);
      router.push("/browse");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="profile-actions">
      <button
        type="button"
        className="actions-trigger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="More options"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {menuOpen && (
        <div className="actions-menu" role="menu">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setReportOpen(true);
            }}
          >
            🚩 Report {displayName}
          </button>
          <button type="button" onClick={handleBlock} disabled={pending}>
            🚫 Block {displayName}
          </button>
        </div>
      )}

      {reportOpen && (
        <div className="modal-backdrop" onClick={() => setReportOpen(false)}>
          <form
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleReport}
          >
            <h2>Report {displayName}</h2>
            <p className="muted small">
              Reports are reviewed by our team. The user will also be blocked.
            </p>

            <fieldset className="reason-list">
              <legend className="field-label">Reason</legend>
              {REASONS.map((r) => (
                <label key={r.value} className="reason-option">
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </fieldset>

            <label className="field">
              <span className="field-label">Additional details (optional)</span>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="What happened?"
              />
            </label>

            {error && <div className="alert error small">{error}</div>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setReportOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-facebook"
                disabled={pending}
              >
                {pending ? "Submitting…" : "Submit report"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
