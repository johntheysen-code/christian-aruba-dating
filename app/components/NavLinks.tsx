"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PROTECTED_LINKS = [
  { href: "/browse", label: "Discover" },
  { href: "/matches", label: "Matches" },
  { href: "/messages", label: "Messages" },
];

export function NavLinks({
  unreadCount,
  hasQuiz,
}: {
  unreadCount: number;
  hasQuiz: boolean;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    return (
      pathname === href || (href !== "/" && pathname.startsWith(href))
    );
  }

  return (
    <nav className="nav-links" aria-label="Primary">
      <Link
        href="/quiz"
        className={`nav-link nav-quiz ${isActive("/quiz") ? "is-active" : ""} ${
          hasQuiz ? "is-complete" : "is-incomplete"
        }`}
      >
        Quiz
        {hasQuiz ? (
          <span className="nav-check" aria-label="completed">
            ✓
          </span>
        ) : (
          <span className="nav-dot" aria-label="incomplete" />
        )}
      </Link>

      {PROTECTED_LINKS.map((link) => {
        const active = isActive(link.href);
        const locked = !hasQuiz;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${active ? "is-active" : ""} ${
              locked ? "is-locked" : ""
            }`}
            aria-disabled={locked ? "true" : undefined}
            title={locked ? "Take the quiz first" : undefined}
          >
            {link.label}
            {link.href === "/messages" && unreadCount > 0 && !locked && (
              <span className="nav-badge">{unreadCount}</span>
            )}
          </Link>
        );
      })}

      <Link
        href="/profile/edit"
        className={`nav-link ${isActive("/profile/edit") ? "is-active" : ""}`}
      >
        Profile
      </Link>
    </nav>
  );
}
