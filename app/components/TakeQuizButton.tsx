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
      Take the Quiz →
    </button>
  );
}
