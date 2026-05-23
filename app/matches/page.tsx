import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, getQuizAnswers, listMatches } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const me = await getProfile(session.user.id);
  if (!me) redirect("/profile/edit");

  const quizCheck = await getQuizAnswers(session.user.id);
  if (quizCheck.length === 0) redirect("/quiz");

  const matches = await listMatches(session.user.id);

  return (
    <main className="container browse-page">
      <header className="browse-header">
        <h1>Your matches</h1>
        <p className="muted">
          People you&apos;ve liked who also liked you back.
        </p>
      </header>

      {matches.length === 0 ? (
        <div className="empty-state">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/owl-empty.png" alt="" className="empty-illustration" />
          <h2>No matches yet</h2>
          <p className="muted">
            Keep liking profiles on the <Link href="/browse">Discover</Link>{" "}
            page. When someone you liked likes you back, you&apos;ll see them
            here.
          </p>
        </div>
      ) : (
        <ul className="profile-grid">
          {matches.map((p) => (
            <li key={p.user_id} className="profile-card">
              <Link href={`/profile/${p.user_id}`} className="card-photo">
                {p.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo_url} alt={`${p.display_name}'s photo`} />
                ) : (
                  <div className="photo-placeholder">
                    {p.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
              <div className="card-body">
                <Link href={`/profile/${p.user_id}`} className="card-name-link">
                  <h3>
                    {p.display_name}
                    {p.age && <span className="age">, {p.age}</span>}
                  </h3>
                </Link>
                <div className="card-meta">
                  {p.denomination && <span className="tag">⛪ {p.denomination}</span>}
                  {p.location && (
                    <span className="tag">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/divi.png" alt="" className="tag-divi" />
                      {p.location}
                    </span>
                  )}
                </div>
                {p.church_name && (
                  <p className="card-church muted small">{p.church_name}</p>
                )}
                {p.bio && <p className="card-bio">{p.bio}</p>}
                <div className="card-actions">
                  <Link
                    href={`/messages/${p.user_id}`}
                    className="btn btn-facebook btn-sm"
                  >
                    Send message
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
