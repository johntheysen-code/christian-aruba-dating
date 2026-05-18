import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile } from "@/lib/supabase";
import { AuthButton } from "./components/AuthButton";
import { ProfileCTA } from "./components/ProfileCTA";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const profile = session?.user?.id ? await getProfile(session.user.id) : null;
  const signedIn = Boolean(session?.user);

  return (
    <>
      <header className="container">
        <nav className="nav">
          <div className="brand">
            Christian<span>Aruba</span>Dating
          </div>
          <AuthButton variant="ghost" />
        </nav>
      </header>

      <main>
        <section className="container hero">
          <div>
            <h1>Faith first. Love that follows.</h1>
            <p className="lede">
              A Christ-centered community for singles on the One Happy Island.
              Meet believers who share your values, your worship, and your walk.
            </p>
            <p className="verse">
              &ldquo;Above all else, guard your heart, for everything you do
              flows from it.&rdquo; — Proverbs 4:23
            </p>
            {signedIn ? (
              <ProfileCTA hasProfile={Boolean(profile)} />
            ) : (
              <AuthButton variant="facebook" />
            )}
          </div>
          <div className="hero-art" aria-hidden="true" />
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
                  ? `Welcome back, ${profile.display_name}.`
                  : "You're almost in."}
              </h2>
              <p>
                {profile
                  ? "Soon you'll be able to browse other members. For now, keep your profile fresh."
                  : "Set up your profile so other believers can find you."}
              </p>
              <ProfileCTA hasProfile={Boolean(profile)} />
            </>
          ) : (
            <>
              <h2>Ready to meet someone who shares your faith?</h2>
              <p>
                Sign in with Facebook to create your profile. It takes a
                minute.
              </p>
              <AuthButton variant="facebook" />
            </>
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          &copy; {new Date().getFullYear()} Christian Aruba Dating · Made with
          love in Aruba
        </div>
      </footer>
    </>
  );
}
