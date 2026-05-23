import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, getQuizAnswers } from "@/lib/supabase";
import { QuizForm } from "./QuizForm";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const me = await getProfile(session.user.id);
  if (!me) redirect("/profile/edit");

  const answers = await getQuizAnswers(session.user.id);
  const isFirstTime = answers.length === 0;

  return (
    <main className="container quiz-page">
      {isFirstTime ? (
        <div className="quiz-welcome">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/owl-quiz.png" alt="" className="quiz-welcome-illo" />
          <p className="quiz-welcome-kicker">One step before you meet anyone.</p>
          <h1>Take the compatibility quiz</h1>
          <p className="quiz-welcome-body">
            Amor y Fe matches on convictions, not photos. Answer 22 short
            questions — it takes about 10 minutes — and we&apos;ll show you
            who among our members actually aligns with your faith, your
            values, and your way of life.
          </p>
          <p className="muted small">
            You can skip individual questions and come back, but everyone
            sees more meaningful matches after they finish.
          </p>
        </div>
      ) : (
        <header className="quiz-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/owl-quiz.png" alt="" className="quiz-hero-illustration" />
          <h1>Compatibility quiz</h1>
          <p className="muted">
            Update your answers anytime — your matches will recalculate.
          </p>
        </header>
      )}
      <QuizForm initial={answers} />
    </main>
  );
}
