"use client";

import { useState } from "react";

type Props = {
  photos: string[];
  displayName: string;
  age: number | null;
  location: string | null;
  compatibilityScore: number | null;
  quizState: "scored" | "their_quiz_pending" | "your_quiz_pending";
};

export function DiscoverPhotos({
  photos,
  displayName,
  age,
  location,
  compatibilityScore,
  quizState,
}: Props) {
  const [index, setIndex] = useState(0);
  const safePhotos = photos.length > 0 ? photos : [""];
  const hasMultiple = safePhotos.length > 1;

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i - 1 + safePhotos.length) % safePhotos.length);
  }

  function next(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + 1) % safePhotos.length);
  }

  function jump(e: React.MouseEvent, idx: number) {
    e.preventDefault();
    e.stopPropagation();
    setIndex(idx);
  }

  return (
    <div className="discover-photo">
      {safePhotos[index] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={safePhotos[index]} alt={`${displayName}'s photo`} />
      ) : (
        <div className="photo-placeholder">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}

      {hasMultiple && (
        <>
          <button
            type="button"
            className="photo-tap photo-tap-left"
            onClick={prev}
            aria-label="Previous photo"
          />
          <button
            type="button"
            className="photo-tap photo-tap-right"
            onClick={next}
            aria-label="Next photo"
          />
          <div className="photo-dots" aria-hidden="true">
            {safePhotos.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`photo-dot ${i === index ? "is-active" : ""}`}
                onClick={(e) => jump(e, i)}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="discover-gradient" aria-hidden="true" />
      <div className="discover-overlay">
        <h3>
          {displayName}
          {age && <span className="age">, {age}</span>}
        </h3>
        {location && <p className="discover-loc">📍 {location}</p>}
      </div>
      {quizState === "scored" && compatibilityScore !== null ? (
        <span
          className={`compat-badge ${compatBadgeClass(compatibilityScore)}`}
        >
          {compatibilityScore}% match
        </span>
      ) : quizState === "their_quiz_pending" ? (
        <span
          className="compat-badge pending"
          title={`${displayName} hasn't completed the compatibility quiz yet. Score will appear once they do.`}
        >
          Quiz pending
        </span>
      ) : (
        <span
          className="compat-badge take-quiz"
          title="Take the quiz to see your compatibility with members."
        >
          Take the quiz
        </span>
      )}
    </div>
  );
}

function compatBadgeClass(score: number): string {
  if (score >= 85) return "great";
  if (score >= 70) return "good";
  if (score >= 50) return "ok";
  return "low";
}
