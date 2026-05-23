"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MessageForm({
  recipientId,
  partnerName,
}: {
  recipientId: string;
  partnerName: string;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: recipientId, body: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send");
      } else {
        setText("");
        router.refresh();
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="thread-form" onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError(null);
        }}
        placeholder={`Message ${partnerName}…`}
        rows={2}
        maxLength={2000}
      />
      <button
        type="submit"
        className="btn btn-coral"
        disabled={sending || text.trim().length === 0}
      >
        {sending ? "Sending…" : "Send"}
      </button>
      {error && <p className="alert error thread-error">{error}</p>}
    </form>
  );
}
