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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const isFacebookPhoto =
    form.photo_url === fallbackPhoto && fallbackPhoto.length > 0;

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/profile/photo", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed");
      } else {
        setForm((f) => ({ ...f, photo_url: data.url }));
      }
    } catch {
      setUploadError("Network error — try again");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

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
      <div className="photo-preview">
        {form.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.photo_url} alt="Profile photo" />
        ) : (
          <div className="photo-placeholder large">
            {form.display_name.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <label className="photo-upload-label">
          {uploading ? "Uploading…" : "Change photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoUpload}
            disabled={uploading}
            hidden
          />
        </label>
        <p className="muted small">
          {isFacebookPhoto
            ? "Using your Facebook photo. Upload your own to make it your own."
            : "JPEG, PNG, or WebP up to 4 MB"}
        </p>
        {uploadError && <p className="alert error small">{uploadError}</p>}
      </div>

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
