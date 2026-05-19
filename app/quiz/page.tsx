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

  return (
    <main className="container quiz-page">
      <header className="quiz-header">
        <h1>Compatibility quiz</h1>
        <p className="muted">
          Answer honestly — your responses help us calculate how well you and
          another member align on what matters most. You can skip any
          question and come back later.
        </p>
      </header>
      <QuizForm initial={answers} />
    </main>
  );
}
