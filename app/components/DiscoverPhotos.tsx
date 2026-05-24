"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  userId: string;
  photos: string[];
  displayName: string;
  age: number | null;
  location: string | null;
  compatibilityScore: number | null;
  quizState: "scored" | "their_quiz_pending" | "your_quiz_pending";
};

export function DiscoverPhotos({
  userId,
  photos,
  displayName,
  age,
  location,
  compatibilityScore,
  quizState,
}: Props) {
  const [index, setIndex] = useState(0);
  const limitedPhotos = photos.slice(0, 2);
  const safePhotos = limitedPhotos.length > 0 ? limitedPhotos : [""];
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

  const profileHref = `/profile/${userId}`;

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

      {hasMultiple ? (
        <>
          <button
            type="button"
            className="photo-tap photo-tap-left"
            onClick={prev}
            aria-label="Previous photo"
          />
          <Link
            href={profileHref}
            className="photo-tap photo-tap-center"
            aria-label={`Open ${displayName}'s profile`}
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
      ) : (
        <Link
          href={profileHref}
          className="photo-tap photo-tap-full"
          aria-label={`Open ${displayName}'s profile`}
        />
      )}

      <div className="discover-gradient" aria-hidden="true" />
      <div className="discover-overlay">
        <h3>
          {displayName}
          {age && <span className="age">, {age}</span>}
        </h3>
        {location && <p className="discover-loc">📍 {location}</p>}
      </div>
      <CompatibilityBadge
        score={compatibilityScore}
        quizState={quizState}
        displayName={displayName}
      />
    </div>
  );
}

function CompatibilityBadge({
  score,
  quizState,
  displayName,
}: {
  score: number | null;
  quizState: "scored" | "their_quiz_pending" | "your_quiz_pending";
  displayName: string;
}) {
  if (quizState === "your_quiz_pending") {
    return (
      <span
        className="compat-badge compat-badge--prompt"
        title="Take the quiz to see your compatibility with members."
      >
        Take the quiz
      </span>
    );
  }
  if (quizState === "their_quiz_pending" || score === null) {
    return (
      <span
        className="compat-badge compat-badge--pending"
        title={`${displayName} hasn't completed the compatibility quiz yet.`}
      >
        Quiz pending
      </span>
    );
  }
  if (score >= 80) {
    return (
      <span className="compat-badge compat-badge--high">
        ♥ {score}% match
      </span>
    );
  }
  if (score >= 60) {
    return (
      <span className="compat-badge compat-badge--mid">
        {score}% match
      </span>
    );
  }
  return (
    <span className="compat-badge compat-badge--low">
      {score}% match
    </span>
  );
}
