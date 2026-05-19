"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const DENOMINATIONS = [
  "Catholic",
  "Protestant",
  "Methodist",
  "Evangelical",
  "Pentecostal",
  "Seventh-day Adventist",
  "Non-denominational",
  "Other",
];

const ARUBA_LOCATIONS = [
  "Oranjestad",
  "Noord",
  "Paradera",
  "Santa Cruz",
  "Savaneta",
  "San Nicolas",
  "Other",
];

export function Filters({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ageMin, setAgeMin] = useState(searchParams.get("age_min") ?? "");
  const [ageMax, setAgeMax] = useState(searchParams.get("age_max") ?? "");
  const [denomination, setDenomination] = useState(
    searchParams.get("denomination") ?? ""
  );
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [open, setOpen] = useState(false);

  const hasFilters =
    ageMin !== "" || ageMax !== "" || denomination !== "" || location !== "";

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (ageMin) params.set("age_min", ageMin);
    if (ageMax) params.set("age_max", ageMax);
    if (denomination) params.set("denomination", denomination);
    if (location) params.set("location", location);
    router.push(`/browse${params.toString() ? `?${params}` : ""}`);
    setOpen(false);
  }

  function reset() {
    setAgeMin("");
    setAgeMax("");
    setDenomination("");
    setLocation("");
    router.push("/browse");
  }

  return (
    <div className="filters">
      <button
        type="button"
        className="filters-toggle btn btn-ghost"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
        Filters
        {hasFilters && <span className="filter-dot" />}
      </button>
      <span className="result-count muted small">
        {resultCount} {resultCount === 1 ? "match" : "matches"}
      </span>

      {open && (
        <form className="filter-panel" onSubmit={apply}>
          <div className="filter-row">
            <label className="field">
              <span className="field-label">Age min</span>
              <input
                type="number"
                min={18}
                max={100}
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                placeholder="18"
              />
            </label>
            <label className="field">
              <span className="field-label">Age max</span>
              <input
                type="number"
                min={18}
                max={100}
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                placeholder="100"
              />
            </label>
          </div>

          <label className="field">
            <span className="field-label">Denomination</span>
            <select
              value={denomination}
              onChange={(e) => setDenomination(e.target.value)}
            >
              <option value="">Any</option>
              {DENOMINATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Location</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Anywhere on Aruba</option>
              {ARUBA_LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <div className="filter-actions">
            <button type="button" className="btn btn-ghost" onClick={reset}>
              Reset
            </button>
            <button type="submit" className="btn btn-facebook">
              Apply filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
