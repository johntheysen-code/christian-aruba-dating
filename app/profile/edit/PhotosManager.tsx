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
    if (action === "delete") {
      const idx = photos.indexOf(url);
      const isPrimary = idx === 0;
      const isOnlyPhoto = photos.length === 1;
      let msg: string | null = null;
      if (isOnlyPhoto) {
        msg = "Delete your only photo? Other members won't see a photo on your profile.";
      } else if (isPrimary) {
        msg = `Delete your primary photo? Your next photo will become primary.`;
      }
      if (msg && !confirm(msg)) return;
    }
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

  const photoCount = photos.length;
  const photosNeeded = Math.max(0, 3 - photoCount);

  return (
    <div className="photos-manager">
      {photosNeeded > 0 && (
        <div className="photo-nudge">
          <span className="photo-nudge-icon">📸</span>
          <div>
            <strong>
              Add {photosNeeded} more photo{photosNeeded === 1 ? "" : "s"} to look 2× more attractive
            </strong>
            <p className="muted small">
              Profiles with 3+ photos get noticed more on Discover. Show
              different sides of you: a smile, a hobby, a Sunday at church.
            </p>
          </div>
        </div>
      )}
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
