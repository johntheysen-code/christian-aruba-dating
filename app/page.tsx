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
            <h1>
              Equally Yoked,
              <br />
              by design.
            </h1>
            <p className="hero-tagline">
              Traha pa nos dushi Aruba.{" "}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/divi.png" alt="" className="inline-divi" />
            </p>
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
            <h2>How Amor y Fe brings two believers together</h2>
            <p className="sub">From single to soulmate, in three steps.</p>
            <ol className="steps-grid">
              <li className="step step-1">
                <span className="step-number">1</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/owl-quiz.png"
                  alt=""
                  className="step-illustration"
                />
                <h3>Take the quiz</h3>
                <p>
                  Answer 22 questions about your faith, convictions, and life
                  goals — from Scripture and prayer to carnival, marriage, and
                  children.
                </p>
              </li>
              <li className="step step-2">
                <span className="step-number">2</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/owl-match.png"
                  alt=""
                  className="step-illustration"
                />
                <h3>See your matches</h3>
                <p>
                  Every profile gets a compatibility score with a breakdown by
                  category, so you spend time on the people who actually fit.
                </p>
              </li>
              <li className="step step-3">
                <span className="step-number">3</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/owl-chat.png"
                  alt=""
                  className="step-illustration"
                />
                <h3>Start the conversation</h3>
                <p>
                  When you both like each other, you can message — privately
                  and safely, only between matched members.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="faq">
          <div className="container">
            <h2>Common questions</h2>
            <p className="sub">Everything to know before you sign in.</p>
            <div className="faq-list">
              <details className="faq-item">
                <summary>How does matching work?</summary>
                <p>
                  We don&apos;t rely on swiping. Take our 22-question
                  compatibility quiz — covering faith essentials, Christian
                  convictions, marriage intentions, and lifestyle — and we
                  calculate how aligned you are with every other member.
                  Higher score, deeper potential connection.
                </p>
              </details>

              <details className="faq-item">
                <summary>How is Amor y Fe different from other dating apps?</summary>
                <p>
                  Amor y Fe is built for believers seeking marriage, not
                  casual encounters. Matching is restricted to one man and
                  one woman, in keeping with a biblical view of marriage.
                  Our compatibility quiz goes far deeper than denomination —
                  measuring the convictions and life direction that actually
                  matter — so the matches you see are people who genuinely
                  share your way of life.
                </p>
              </details>

              <details className="faq-item">
                <summary>Is my information private?</summary>
                <p>
                  Yes. Your profile is only visible to other signed-in
                  members of Amor y Fe. Messages stay private between matched
                  users. We never sell or share your data with third parties.
                  See our{" "}
                  <a href="/privacy">Privacy Policy</a> for full details.
                </p>
              </details>

              <details className="faq-item">
                <summary>How do I know other members are real?</summary>
                <p>
                  Every member signs in with Facebook, which verifies they
                  are a real person tied to a real account. No anonymous
                  profiles, no catfish. If anyone feels off, you can block or
                  report them in one tap.
                </p>
              </details>

              <details className="faq-item">
                <summary>Do I need to be from Aruba?</summary>
                <p>
                  Amor y Fe is designed for believers living on the One Happy
                  Island. Matching, filters, and community references assume
                  you&apos;re on Aruba. If you&apos;re visiting or planning to
                  move here, you&apos;re welcome too.
                </p>
              </details>

              <details className="faq-item">
                <summary>Is there a cost?</summary>
                <p>
                  Free to use. We may add optional premium features later,
                  but core matching, messaging, and profile features will
                  always stay free for our community.
                </p>
              </details>

              <details className="faq-item">
                <summary>Can I delete my account?</summary>
                <p>
                  Yes — anytime. Go to your <a href="/profile/edit">Profile</a>{" "}
                  page and scroll to the bottom: click <strong>Delete my
                  account</strong>, confirm by typing DELETE, and your
                  profile, photos, quiz answers, likes, matches, and messages
                  are permanently removed. No emails, no waiting.
                </p>
              </details>
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
        <div className="container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/owl-footer.png" alt="" className="footer-illustration" />
          <div className="footer-row">
            <span>
              &copy; {new Date().getFullYear()} Amor y Fe · Made with love in
              Aruba
            </span>
            <nav className="footer-links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
