"use client";

import { signIn, signOut, useSession } from "next-auth/react";

type Variant = "facebook" | "ghost";

export function AuthButton({ variant = "facebook" }: { variant?: Variant }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button className={`btn ${variant === "ghost" ? "btn-ghost" : "btn-facebook"}`} disabled>
        Loading…
      </button>
    );
  }

  if (session?.user) {
    const name = session.user.name ?? "Friend";
    const initials = name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("");
    return (
      <div className="signed-in">
        <span className="avatar" aria-hidden="true">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" />
          ) : (
            initials
          )}
        </span>
        <span>Welcome, {name.split(" ")[0]}</span>
        <button
          className="btn btn-ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      className={`btn ${variant === "ghost" ? "btn-ghost" : "btn-facebook"}`}
      onClick={() => signIn("facebook", { callbackUrl: "/" })}
    >
      {variant === "facebook" ? (
        <>
          <FacebookIcon />
          Continue with Facebook
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.683 4.533-4.683 1.312 0 2.686.235 2.686.235v2.971h-1.513c-1.49 0-1.955.93-1.955 1.886v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}
