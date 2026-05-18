import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, listMatchableProfiles } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const me = await getProfile(session.user.id);
  if (!me) redirect("/profile/edit");

  const profiles = await listMatchableProfiles(session.user.id, me);

  return (
    <main className="container browse-page">
      <header className="browse-header">
        <Link href="/" className="back-link">
          ← Home
        </Link>
        <h1>Discover</h1>
        <p className="muted">
          Believers on the island who match what you&apos;re looking for.
        </p>
      </header>

      {profiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏝️</div>
          <h2>No matches just yet</h2>
          <p className="muted">
            Check back soon — we&apos;re a new community and members are
            joining every week. Invite a friend from your church to grow the
            family.
          </p>
        </div>
      ) : (
        <ul className="profile-grid">
          {profiles.map((p) => (
            <li key={p.user_id} className="profile-card">
              <div className="card-photo">
                {p.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo_url} alt={`${p.display_name}'s photo`} />
                ) : (
                  <div className="photo-placeholder">
                    {p.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="card-body">
                <h3>
                  {p.display_name}
                  {p.age && <span className="age">, {p.age}</span>}
                </h3>
                <div className="card-meta">
                  {p.denomination && <span className="tag">⛪ {p.denomination}</span>}
                  {p.location && <span className="tag">🏝️ {p.location}</span>}
                </div>
                {p.church_name && (
                  <p className="card-church muted small">{p.church_name}</p>
                )}
                {p.bio && <p className="card-bio">{truncate(p.bio, 180)}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}
