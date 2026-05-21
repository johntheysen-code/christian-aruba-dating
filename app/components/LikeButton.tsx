"use client";

import { useState } from "react";

type Props = {
  likedId: string;
  initialLiked: boolean;
  displayName: string;
  compact?: boolean;
};

export function LikeButton({
  likedId,
  initialLiked,
  displayName,
  compact = false,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [pending, setPending] = useState(false);
  const [matchToast, setMatchToast] = useState(false);

  async function toggle() {
    if (pending) return;
    setPending(true);
    const next = !liked;
    setLiked(next);
    try {
      if (next) {
        const res = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ liked_id: likedId }),
        });
        const data = await res.json();
        if (data?.matched) {
          setMatchToast(true);
          setTimeout(() => setMatchToast(false), 3500);
        }
      } else {
        await fetch("/api/likes", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ liked_id: likedId }),
        });
      }
    } catch {
      setLiked(!next);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`${compact ? "like-fab" : "like-btn"} ${liked ? "is-liked" : ""}`}
        onClick={toggle}
        aria-label={liked ? `Unlike ${displayName}` : `Like ${displayName}`}
        disabled={pending}
      >
        <svg
          width={compact ? 22 : 20}
          height={compact ? 22 : 20}
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {!compact && <span>{liked ? "Liked" : "Like"}</span>}
      </button>
      {matchToast && (
        <div className="match-toast" role="status">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/owl-match.png" alt="" className="match-toast-icon" />
          <span>It&apos;s a match with {displayName}!</span>
        </div>
      )}
    </>
  );
}
