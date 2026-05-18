"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Profile } from "@/lib/supabase";

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

type Props = {
  initial: Profile | null;
  fallbackName: string;
  fallbackPhoto: string;
};

export function ProfileForm({ initial, fallbackName, fallbackPhoto }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    display_name: initial?.display_name ?? fallbackName.split(" ")[0] ?? "",
    age: initial?.age ? String(initial.age) : "",
    gender: initial?.gender ?? "",
    looking_for: initial?.looking_for ?? "",
    denomination: initial?.denomination ?? "",
    church_name: initial?.church_name ?? "",
    location: initial?.location ?? "",
    bio: initial?.bio ?? "",
    photo_url: initial?.photo_url ?? fallbackPhoto,
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else {
        setSuccess(true);
        router.refresh();
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {form.photo_url && (
        <div className="photo-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={form.photo_url} alt="Profile photo" />
          <p className="muted small">From your Facebook profile</p>
        </div>
      )}

      <Field label="Display name" required>
        <input
          type="text"
          value={form.display_name}
          onChange={(e) => update("display_name", e.target.value)}
          maxLength={60}
          required
          placeholder="What should people call you?"
        />
      </Field>

      <Field label="Age" required>
        <input
          type="number"
          value={form.age}
          onChange={(e) => update("age", e.target.value)}
          min={18}
          max={100}
          required
        />
      </Field>

      <div className="row-2">
        <Field label="I am" required>
          <select
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
            required
          >
            <option value="">Select…</option>
            <option value="male">A man</option>
            <option value="female">A woman</option>
          </select>
        </Field>

        <Field label="Looking for" required>
          <select
            value={form.looking_for}
            onChange={(e) => update("looking_for", e.target.value)}
            required
          >
            <option value="">Select…</option>
            <option value="female">Women</option>
            <option value="male">Men</option>
            <option value="both">Both</option>
          </select>
        </Field>
      </div>

      <Field label="Denomination">
        <select
          value={form.denomination}
          onChange={(e) => update("denomination", e.target.value)}
        >
          <option value="">Prefer not to say</option>
          {DENOMINATIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Your church (optional)">
        <input
          type="text"
          value={form.church_name}
          onChange={(e) => update("church_name", e.target.value)}
          maxLength={120}
          placeholder="e.g. Pro Cathedral San Francisco"
        />
      </Field>

      <Field label="Where on the island?">
        <select
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        >
          <option value="">Prefer not to say</option>
          {ARUBA_LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </Field>

      <Field label="About you">
        <textarea
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          rows={5}
          maxLength={1000}
          placeholder="Share a little about your faith, hobbies, and what you're hoping to find."
        />
        <p className="muted small">{form.bio.length} / 1000</p>
      </Field>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">Saved ✓</div>}

      <div className="actions">
        <button type="submit" className="btn btn-facebook" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save changes" : "Create profile"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required && <span className="req"> *</span>}
      </span>
      {children}
    </label>
  );
}
