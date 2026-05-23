"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export function QuizStepLink({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <Link href="/quiz" className="step-link">
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="step-link step-link-button"
      onClick={() => signIn("facebook", { callbackUrl: "/quiz" })}
    >
      {children}
    </button>
  );
}
