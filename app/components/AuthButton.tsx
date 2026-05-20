"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

type Variant = "facebook" | "ghost";

export function AuthButton({ variant = "facebook" }: { variant?: Variant }) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  if (status === "loading") {
    return (
      <button
        className={`btn ${variant === "ghost" ? "btn-ghost" : "btn-facebook"}`}
        disabled
      >
        Loading…
      </button>
    );
  }

  if (session?.user) {
    const name = session.user.name ?? "Friend";
    const firstName = name.split(" ")[0];
    const initials = name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("");
    return (
      <div className="user-menu" ref={menuRef}>
        <button
          type="button"
          className="user-trigger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label="Account menu"
        >
          <span className="avatar" aria-hidden="true">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" />
            ) : (
              initials
            )}
          </span>
        </button>
        {menuOpen && (
          <div className="user-menu-panel" role="menu">
            <div className="user-menu-header">
              <span className="muted small">Signed in as</span>
              <strong>{firstName}</strong>
            </div>
            <Link
              href="/profile/edit"
              className="user-menu-item"
              onClick={() => setMenuOpen(false)}
            >
              Edit profile
            </Link>
            <Link
              href="/quiz"
              className="user-menu-item"
              onClick={() => setMenuOpen(false)}
            >
              Compatibility quiz
            </Link>
            <button
              type="button"
              className="user-menu-item danger"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </button>
          </div>
        )}
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.683 4.533-4.683 1.312 0 2.686.235 2.686.235v2.971h-1.513c-1.49 0-1.955.93-1.955 1.886v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}
