"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (confirmText !== "DELETE" || pending) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Delete failed — please email us.");
        setPending(false);
        return;
      }
      await signOut({ callbackUrl: "/?deleted=1" });
    } catch {
      setError("Network error — try again or email us.");
      setPending(false);
    }
  }

  return (
    <div className="danger-zone">
      <h2>Delete account</h2>
      <p className="muted small">
        Permanently delete your profile, photos, quiz answers, likes,
        matches, and messages. This cannot be undone.
      </p>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => setOpen(true)}
      >
        Delete my account
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => !pending && setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete your account?</h2>
            <p className="muted">
              This will permanently remove your profile, photos, quiz answers,
              likes, matches, and message history. We cannot recover any of it.
            </p>
            <p className="muted small">
              Type <strong>DELETE</strong> (in capital letters) to confirm.
            </p>
            <label className="field">
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                autoFocus
                disabled={pending}
              />
            </label>
            {error && <div className="alert error small">{error}</div>}
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || pending}
              >
                {pending ? "Deleting…" : "Permanently delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
