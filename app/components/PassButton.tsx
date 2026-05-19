"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PassButton({
  passedId,
  displayName,
}: {
  passedId: string;
  displayName: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handlePass() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/passes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passed_id: passedId }),
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className="pass-fab"
      onClick={handlePass}
      aria-label={`Pass on ${displayName}`}
      disabled={pending}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
