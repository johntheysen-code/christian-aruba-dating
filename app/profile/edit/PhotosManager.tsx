"use client";

import { useState } from "react";

const MAX_PHOTOS = 6;

export function PhotosManager({
  initialPhotos,
}: {
  initialPhotos: string[];
}) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photos.length >= MAX_PHOTOS) {
      setError(`You can have up to ${MAX_PHOTOS} photos`);
      e.target.value = "";
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/profile/photo", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
      } else if (Array.isArray(data.photos)) {
        setPhotos(data.photos);
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function manage(action: "delete" | "primary", url: string) {
    try {
      const res = await fetch("/api/profile/photo/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, url }),
      });
      const data = await res.json();
      if (Array.isArray(data.photos)) setPhotos(data.photos);
    } catch {
      setError("Network error — try again");
    }
  }

  return (
    <div className="photos-manager">
      <div className="photos-grid">
        {photos.map((url, idx) => (
          <div key={url} className={`photo-tile ${idx === 0 ? "is-primary" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" />
            {idx === 0 && <span className="primary-badge">Primary</span>}
            <div className="photo-tile-actions">
              {idx !== 0 && (
                <button
                  type="button"
                  className="tile-btn"
                  onClick={() => manage("primary", url)}
                  title="Make primary"
                  aria-label="Make this the primary photo"
                >
                  ★
                </button>
              )}
              <button
                type="button"
                className="tile-btn danger"
                onClick={() => manage("delete", url)}
                title="Delete"
                aria-label="Delete photo"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <label className="photo-add">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              disabled={uploading}
              hidden
            />
            <span>{uploading ? "Uploading…" : "+ Add photo"}</span>
          </label>
        )}
      </div>
      <p className="muted small">
        Up to {MAX_PHOTOS} photos. The first one is your primary photo shown
        on Discover. JPEG, PNG, or WebP up to 4 MB each.
      </p>
      {error && <div className="alert error small">{error}</div>}
    </div>
  );
}
