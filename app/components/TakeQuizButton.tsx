"use client";

import { signIn } from "next-auth/react";

export function TakeQuizButton({
  large = false,
}: {
  large?: boolean;
}) {
  return (
    <button
      type="button"
      className={`btn btn-coral ${large ? "btn-large" : ""}`}
      onClick={() => signIn("facebook", { callbackUrl: "/quiz" })}
    >
      <FacebookIcon />
      Take the Quiz
      <span className="btn-arrow" aria-hidden="true">→</span>
    </button>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="btn-icon"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.683 4.533-4.683 1.312 0 2.686.235 2.686.235v2.971h-1.513c-1.49 0-1.955.93-1.955 1.886v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}
