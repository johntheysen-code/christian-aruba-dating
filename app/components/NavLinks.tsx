"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/browse", label: "Discover" },
  { href: "/matches", label: "Matches" },
  { href: "/messages", label: "Messages" },
  { href: "/profile/edit", label: "Profile" },
];

export function NavLinks({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();

  return (
    <nav className="nav-links" aria-label="Primary">
      {LINKS.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${active ? "is-active" : ""}`}
          >
            {link.label}
            {link.href === "/messages" && unreadCount > 0 && (
              <span className="nav-badge">{unreadCount}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
