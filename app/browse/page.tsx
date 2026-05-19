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
import { PassButton } from "@/app/components/PassButton";
import { Filters } from "./Filters";
import { ActiveFilterChips } from "./ActiveFilterChips";

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
        <h1>Discover</h1>
        <p className="muted">
          Believers on the island who share your faith.
        </p>
      </header>

      <Filters resultCount={profiles.length} />
      <ActiveFilterChips filters={filters} />

      {profiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏝️</div>
          <h2>No matches found</h2>
          <p className="muted">
            Try widening your filters, or check back soon as new members join.
          </p>
        </div>
      ) : (
        <ul className="discover-grid">
          {profiles.map((p) => (
            <li key={p.user_id} className="discover-card">
              <Link
                href={`/profile/${p.user_id}`}
                className="discover-photo"
                aria-label={`View ${p.display_name}'s profile`}
              >
                {p.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo_url} alt="" />
                ) : (
                  <div className="photo-placeholder">
                    {p.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="discover-gradient" aria-hidden="true" />
                <div className="discover-overlay">
                  <h3>
                    {p.display_name}
                    {p.age && <span className="age">, {p.age}</span>}
                  </h3>
                  {p.location && (
                    <p className="discover-loc">📍 {p.location}</p>
                  )}
                </div>
              </Link>

              <div className="discover-fab">
                <PassButton
                  passedId={p.user_id}
                  displayName={p.display_name}
                />
                <LikeButton
                  likedId={p.user_id}
                  initialLiked={likedIds.has(p.user_id)}
                  displayName={p.display_name}
                  compact
                />
              </div>

              <div className="discover-body">
                <div className="card-meta">
                  {p.denomination && (
                    <span className="tag">⛪ {p.denomination}</span>
                  )}
                </div>
                {p.church_name && (
                  <p className="card-church muted small">{p.church_name}</p>
                )}
                {p.bio && <p className="card-bio">{truncate(p.bio, 140)}</p>}
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
