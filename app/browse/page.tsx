import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getLikedIds,
  getProfile,
  listMatchableProfiles,
  type BrowseFilters,
} from "@/lib/supabase";
import { LikeButton } from "@/app/components/LikeButton";
import { Filters } from "./Filters";

export const dynamic = "force-dynamic";

function parseAge(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  if (!Number.isInteger(n) || n < 18 || n > 100) return undefined;
  return n;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const me = await getProfile(session.user.id);
  if (!me) redirect("/profile/edit");

  const filters: BrowseFilters = {
    ageMin: parseAge(typeof searchParams.age_min === "string" ? searchParams.age_min : undefined),
    ageMax: parseAge(typeof searchParams.age_max === "string" ? searchParams.age_max : undefined),
    denomination: typeof searchParams.denomination === "string" ? searchParams.denomination : undefined,
    location: typeof searchParams.location === "string" ? searchParams.location : undefined,
  };

  const [profiles, likedIds] = await Promise.all([
    listMatchableProfiles(session.user.id, me, filters),
    getLikedIds(session.user.id),
  ]);

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

      <Filters resultCount={profiles.length} />

      {profiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏝️</div>
          <h2>No matches found</h2>
          <p className="muted">
            Try widening your filters, or check back soon as new members join.
          </p>
        </div>
      ) : (
        <ul className="profile-grid">
          {profiles.map((p) => (
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
                  {p.location && <span className="tag">🏝️ {p.location}</span>}
                </div>
                {p.church_name && (
                  <p className="card-church muted small">{p.church_name}</p>
                )}
                {p.bio && <p className="card-bio">{truncate(p.bio, 180)}</p>}
                <div className="card-actions">
                  <LikeButton
                    likedId={p.user_id}
                    initialLiked={likedIds.has(p.user_id)}
                    displayName={p.display_name}
                  />
                </div>
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
