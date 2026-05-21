import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  countUnreadMessages,
  getProfile,
  getQuizAnswers,
} from "@/lib/supabase";
import { AuthButton } from "./AuthButton";
import { NavLinks } from "./NavLinks";

export async function TopNav() {
  const session = await getServerSession(authOptions);
  const signedIn = Boolean(session?.user?.id);

  const [profile, unread, quizAnswers] = signedIn
    ? await Promise.all([
        getProfile(session!.user!.id!),
        countUnreadMessages(session!.user!.id!),
        getQuizAnswers(session!.user!.id!),
      ])
    : [null, 0, []];

  const hasProfile = Boolean(profile);
  const hasQuiz = quizAnswers.length > 0;

  return (
    <header className="topnav-wrap">
      <div className="container topnav">
        <Link href="/" className="brand">
          <span className="brand-amor">Amor</span>
          <span className="brand-conj"> y </span>
          <span className="brand-fe">Fe</span>
        </Link>

        {signedIn && hasProfile && (
          <>
            <NavLinks unreadCount={unread} />
            {!hasQuiz && (
              <Link href="/quiz" className="nav-quiz-cta">
                ✨ Find your match
              </Link>
            )}
          </>
        )}

        <AuthButton variant="ghost" />
      </div>
    </header>
  );
}
