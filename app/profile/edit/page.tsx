import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, getQuizAnswers } from "@/lib/supabase";
import { QUIZ_QUESTIONS } from "@/lib/quiz";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const [existing, quizAnswers] = await Promise.all([
    getProfile(session.user.id),
    getQuizAnswers(session.user.id),
  ]);

  const quizPct = Math.round(
    (quizAnswers.length / QUIZ_QUESTIONS.length) * 100
  );

  return (
    <main className="container profile-page">
      <header className="profile-header">
        <h1>{existing ? "Edit your profile" : "Create your profile"}</h1>
        <p className="muted">
          Tell other believers a bit about who you are and what you&apos;re
          looking for.
        </p>
      </header>

      {existing && (
        <div className="quiz-cta">
          <div className="quiz-cta-body">
            <strong>Compatibility quiz</strong>
            <p className="muted small">
              {quizAnswers.length === 0
                ? "Take the quiz to see how well you align with other members."
                : `${quizAnswers.length} of ${QUIZ_QUESTIONS.length} questions answered`}
            </p>
            <div className="quiz-cta-progress" aria-hidden="true">
              <div className="quiz-cta-bar">
                <div
                  className="quiz-cta-fill"
                  style={{ width: `${quizPct}%` }}
                />
              </div>
              <span>{quizPct}%</span>
            </div>
          </div>
          <Link href="/quiz" className="btn btn-facebook quiz-cta-btn">
            {quizAnswers.length === 0 ? "Take the quiz" : "Continue quiz"}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      <ProfileForm
        initial={existing}
        fallbackName={session.user.name ?? ""}
        fallbackPhoto={session.user.image ?? ""}
      />
    </main>
  );
}
