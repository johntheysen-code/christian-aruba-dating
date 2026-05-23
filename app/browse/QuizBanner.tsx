"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "amoryfe.quizBannerDismissed";

export function QuizBanner({ hasQuiz }: { hasQuiz: boolean }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(KEY) === "1");
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  }

  if (dismissed) return null;

  return (
    <div className="quiz-banner" role="status">
      <div className="quiz-banner-body">
        <strong>How compatibility works</strong>
        <p>
          Your match percentage appears on each profile once you{" "}
          <strong>and</strong> that member have completed the quiz. The more
          members who take it, the sharper your matches.
          {!hasQuiz && (
            <>
              {" "}
              <Link href="/quiz">Take the quiz now →</Link>
            </>
          )}
        </p>
      </div>
      <button
        type="button"
        className="quiz-banner-close"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
