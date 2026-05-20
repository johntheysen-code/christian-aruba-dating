import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, getQuizAnswers } from "@/lib/supabase";
import { AuthButton } from "./components/AuthButton";
import { ProfileCTA } from "./components/ProfileCTA";
import { HeroArt } from "./components/HeroArt";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const [profile, quizAnswers] = userId
    ? await Promise.all([getProfile(userId), getQuizAnswers(userId)])
    : [null, []];
  const signedIn = Boolean(session?.user);
  const hasProfile = Boolean(profile);
  const hasQuiz = quizAnswers.length > 0;

  return (
    <>
      <main>
        <section className="container hero">
          <div>
            <p className="hero-kicker">Not another Christian dating app.</p>
            <h1>Equally yoked, by design.</h1>
            <p className="hero-tagline">Traha pa nos dushi Aruba. 🌴</p>
            <p className="lede">
              Take the 22-question compatibility quiz and meet believers who
              actually share your faith, your values, and your way of life.
              Less swiping. More marriage.
            </p>
            <p className="verse">— 2 Corinthians 6:14</p>
            {signedIn ? (
              <ProfileCTA hasProfile={hasProfile} hasQuiz={hasQuiz} />
            ) : (
              <AuthButton variant="facebook" />
            )}
          </div>
          <HeroArt />
        </section>

        <section className="how-it-works">
          <div className="container">
            <h2>How it works</h2>
            <p className="sub">From quiz to conversation in three steps.</p>
            <ol className="steps-grid">
              <li className="step">
                <span className="step-number">1</span>
                <h3>Take the quiz</h3>
                <p>
                  Answer 22 questions about your faith, convictions, and life
                  goals — from Scripture and prayer to carnival, marriage, and
                  children.
                </p>
              </li>
              <li className="step">
                <span className="step-number">2</span>
                <h3>See your matches</h3>
                <p>
                  Every profile gets a compatibility score with a breakdown by
                  category, so you spend time on the people who actually fit.
                </p>
              </li>
              <li className="step">
                <span className="step-number">3</span>
                <h3>Start the conversation</h3>
                <p>
                  When you both like each other, you can message — privately
                  and safely, only between matched members.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2>Built for our island, rooted in faith</h2>
            <p className="sub">
              Made for the Aruban church community — from Oranjestad to San
              Nicolas.
            </p>
            <div className="feature-grid">
              <div className="feature">
                <div className="icon">⛪</div>
                <h3>Shared faith</h3>
                <p>
                  Filter by denomination, church home, and where you are on
                  your spiritual journey.
                </p>
              </div>
              <div className="feature">
                <div className="icon">🏝️</div>
                <h3>Local to Aruba</h3>
                <p>
                  Connect with believers right here on the island — no
                  long-distance guessing games.
                </p>
              </div>
              <div className="feature">
                <div className="icon">🤝</div>
                <h3>Safe &amp; verified</h3>
                <p>
                  Sign in with Facebook so every member is a real person, not a
                  bot or catfish.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container cta">
          {signedIn ? (
            <>
              <h2>
                {profile
                  ? hasQuiz
                    ? `Welcome back, ${profile.display_name}.`
                    : `One step left, ${profile.display_name}.`
                  : "You're almost in."}
              </h2>
              <p>
                {!hasProfile
                  ? "Set up your profile so other believers can find you."
                  : !hasQuiz
                    ? "The compatibility quiz takes 5 minutes and unlocks accurate matching."
                    : "Keep your profile fresh and check who's new this week."}
              </p>
              <ProfileCTA hasProfile={hasProfile} hasQuiz={hasQuiz} />
            </>
          ) : (
            <>
              <h2>Ready to meet someone who shares your faith?</h2>
              <p>
                Sign in with Facebook to create your profile and take the
                quiz. It takes a few minutes.
              </p>
              <AuthButton variant="facebook" />
            </>
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-row">
          <span>
            &copy; {new Date().getFullYear()} Christian Aruba Dating · Made
            with love in Aruba
          </span>
          <nav className="footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
