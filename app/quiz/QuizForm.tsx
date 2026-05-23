"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORY_LABELS,
  QUIZ_QUESTIONS,
  type QuizCategory,
} from "@/lib/quiz";

type AnswerState = Record<string, number>;

export function QuizForm({
  initial,
}: {
  initial: Array<{ question_id: string; answer_index: number }>;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswerState>(() => {
    const map: AnswerState = {};
    for (const a of initial) map[a.question_id] = a.answer_index;
    return map;
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const out: Record<QuizCategory, typeof QUIZ_QUESTIONS> = {
      faith_essentials: [],
      faith_practices: [],
      christian_convictions: [],
      marriage_family: [],
      lifestyle: [],
      life_location: [],
    };
    for (const q of QUIZ_QUESTIONS) out[q.category].push(q);
    return out;
  }, []);

  const answeredCount = Object.keys(answers).length;
  const total = QUIZ_QUESTIONS.length;
  const progress = (answeredCount / total) * 100;

  function pick(questionId: string, optionIndex: number) {
    setAnswers((prev) => {
      const next = { ...prev };
      if (next[questionId] === optionIndex) {
        delete next[questionId];
      } else {
        next[questionId] = optionIndex;
      }
      return next;
    });
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    const payload = Object.entries(answers).map(([question_id, answer_index]) => ({
      question_id,
      answer_index,
    }));
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed");
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => router.push("/browse"), 800);
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <div className="quiz-progress" role="status">
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="muted small">
          {answeredCount} / {total} answered
        </span>
      </div>

      {(Object.keys(CATEGORY_LABELS) as QuizCategory[]).map((cat) => (
        <section key={cat} className="quiz-category">
          <h2>{CATEGORY_LABELS[cat]}</h2>
          {grouped[cat].map((q) => (
            <fieldset key={q.id} className="quiz-question">
              <legend>{q.prompt}</legend>
              <div className="quiz-options">
                {q.options.map((opt, idx) => {
                  const checked = answers[q.id] === idx;
                  return (
                    <label
                      key={idx}
                      className={`quiz-option ${checked ? "is-checked" : ""}`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={idx}
                        checked={checked}
                        onChange={() => pick(q.id, idx)}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </section>
      ))}

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">Saved ✓ Redirecting…</div>}

      <div className="actions quiz-actions">
        <span className="muted small">
          {answeredCount === 0
            ? "Pick at least one to save."
            : `Saving ${answeredCount} answer${answeredCount === 1 ? "" : "s"}`}
        </span>
        <button
          type="submit"
          className="btn btn-coral"
          disabled={saving || answeredCount === 0}
        >
          {saving ? "Saving…" : "Save answers"}
        </button>
      </div>
    </form>
  );
}
