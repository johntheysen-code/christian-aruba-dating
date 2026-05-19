"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Profile } from "@/lib/supabase";
import { PhotosManager } from "./PhotosManager";

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

const ATTENDANCE_OPTIONS = [
  { value: "multiple", label: "Multiple times a week" },
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "A few times a month" },
  { value: "occasionally", label: "Occasionally" },
  { value: "rarely", label: "Rarely" },
];

const PRAYER_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "occasionally", label: "Occasionally" },
];

const MARRIAGE_OPTIONS = [
  { value: "ready", label: "Ready for marriage" },
  { value: "open", label: "Open to marriage in time" },
  { value: "taking_slow", label: "Taking it slow" },
];

const CHILDREN_OPTIONS = [
  { value: "want", label: "Want children" },
  { value: "have_want_more", label: "Have children, want more" },
  { value: "have_done", label: "Have children, not planning more" },
  { value: "no_kids", label: "Don't want children" },
  { value: "undecided", label: "Undecided" },
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
    denomination: initial?.denomination ?? "",
    church_name: initial?.church_name ?? "",
    location: initial?.location ?? "",
    bio: initial?.bio ?? "",
    favorite_verse: initial?.favorite_verse ?? "",
    statement_of_faith: initial?.statement_of_faith ?? "",
    church_attendance: initial?.church_attendance ?? "",
    prayer_life: initial?.prayer_life ?? "",
    marriage_intention: initial?.marriage_intention ?? "",
    children_plans: initial?.children_plans ?? "",
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
        setTimeout(() => router.push("/"), 800);
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <PhotosManager
        initialPhotos={initial?.photos ?? (initial?.photo_url ? [initial.photo_url] : fallbackPhoto ? [fallbackPhoto] : [])}
      />

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

      <Field label="I am" required>
        <select
          value={form.gender}
          onChange={(e) => update("gender", e.target.value)}
          required
        >
          <option value="">Select…</option>
          <option value="male">A man seeking a woman</option>
          <option value="female">A woman seeking a man</option>
        </select>
      </Field>

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

      <div className="section-divider">
        <h2>Your faith</h2>
        <p className="muted small">Optional, but it&apos;s what brings people here.</p>
      </div>

      <Field label="A scripture close to your heart">
        <textarea
          value={form.favorite_verse}
          onChange={(e) => update("favorite_verse", e.target.value)}
          rows={2}
          maxLength={500}
          placeholder="e.g. 'I can do all things through Christ who strengthens me.' — Philippians 4:13"
        />
      </Field>

      <Field label="A short statement of faith">
        <textarea
          value={form.statement_of_faith}
          onChange={(e) => update("statement_of_faith", e.target.value)}
          rows={3}
          maxLength={800}
          placeholder="What do you believe? Where are you on your walk?"
        />
      </Field>

      <Field label="Church attendance">
        <select
          value={form.church_attendance}
          onChange={(e) => update("church_attendance", e.target.value)}
        >
          <option value="">Prefer not to say</option>
          {ATTENDANCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Prayer life">
        <select
          value={form.prayer_life}
          onChange={(e) => update("prayer_life", e.target.value)}
        >
          <option value="">Prefer not to say</option>
          {PRAYER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="section-divider">
        <h2>Looking ahead</h2>
      </div>

      <Field label="Marriage">
        <select
          value={form.marriage_intention}
          onChange={(e) => update("marriage_intention", e.target.value)}
        >
          <option value="">Prefer not to say</option>
          {MARRIAGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Children">
        <select
          value={form.children_plans}
          onChange={(e) => update("children_plans", e.target.value)}
        >
          <option value="">Prefer not to say</option>
          {CHILDREN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
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
