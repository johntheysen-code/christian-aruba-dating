"use client";

import Link from "next/link";
import type { BrowseFilters } from "@/lib/supabase";

type Chip = { key: string; label: string; remove: string };

export function ActiveFilterChips({ filters }: { filters: BrowseFilters }) {
  const chips = buildChips(filters);
  if (chips.length === 0) return null;

  return (
    <div className="filter-chips" aria-label="Active filters">
      {chips.map((c) => (
        <Link
          key={c.key}
          href={c.remove}
          className="filter-chip"
          aria-label={`Remove ${c.label}`}
        >
          {c.label}
          <span aria-hidden="true">×</span>
        </Link>
      ))}
      <Link href="/browse" className="filter-chip clear">
        Clear all
      </Link>
    </div>
  );
}

function buildChips(f: BrowseFilters): Chip[] {
  const chips: Chip[] = [];
  const current = new URLSearchParams();
  if (f.ageMin !== undefined) current.set("age_min", String(f.ageMin));
  if (f.ageMax !== undefined) current.set("age_max", String(f.ageMax));
  if (f.denomination) current.set("denomination", f.denomination);
  if (f.location) current.set("location", f.location);

  function without(key: string): string {
    const next = new URLSearchParams(current);
    next.delete(key);
    return `/browse${next.toString() ? `?${next}` : ""}`;
  }

  if (f.ageMin !== undefined || f.ageMax !== undefined) {
    const label =
      f.ageMin !== undefined && f.ageMax !== undefined
        ? `Age ${f.ageMin}–${f.ageMax}`
        : f.ageMin !== undefined
          ? `Age ${f.ageMin}+`
          : `Age up to ${f.ageMax}`;
    const next = new URLSearchParams(current);
    next.delete("age_min");
    next.delete("age_max");
    chips.push({
      key: "age",
      label,
      remove: `/browse${next.toString() ? `?${next}` : ""}`,
    });
  }
  if (f.denomination) {
    chips.push({
      key: "denomination",
      label: f.denomination,
      remove: without("denomination"),
    });
  }
  if (f.location) {
    chips.push({
      key: "location",
      label: f.location,
      remove: without("location"),
    });
  }
  return chips;
}
