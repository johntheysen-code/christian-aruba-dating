import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getLikedIds,
  getProfile,
  getQuizAnswers,
  getQuizAnswersFor,
  listMatchableProfiles,
  type BrowseFilters,
} from "@/lib/supabase";
import { computeCompatibility, toAnswerMap } from "@/lib/quiz";
import { LikeButton } from "@/app/components/LikeButton";
import { PassButton } from "@/app/components/PassButton";
import { DiscoverPhotos } from "@/app/components/DiscoverPhotos";
import { Filters } from "./Filters";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { QuizBanner } from "./QuizBanner";

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

  const quizCheck = await getQuizAnswers(session.user.id);
  if (quizCheck.length === 0) redirect("/quiz");

  const filters: BrowseFilters = {
    ageMin: parseAge(typeof searchParams.age_min === "string" ? searchParams.age_min : undefined),
    ageMax: parseAge(typeof searchParams.age_max === "string" ? searchParams.age_max : undefined),
    denomination: typeof searchParams.denomination === "string" ? searchParams.denomination : undefined,
    location: typeof searchParams.location === "string" ? searchParams.location : undefined,
  };

  const [profiles, likedIds, myAnswers] = await Promise.all([
    listMatchableProfiles(session.user.id, me, filters),
    getLikedIds(session.user.id),
    getQuizAnswers(session.user.id),
  ]);

  const myAnswerMap = toAnswerMap(myAnswers);
  const iTookQuiz = myAnswers.length > 0;
  const otherAnswersMap = await getQuizAnswersFor(
    profiles.map((p) => p.user_id)
  );
  type QuizState = "scored" | "their_quiz_pending" | "your_quiz_pending";
  const compatibility = new Map<string, number | null>();
  const quizStates = new Map<string, QuizState>();
  for (const p of profiles) {
    const theirRows = otherAnswersMap.get(p.user_id) ?? [];
    const theyTookQuiz = theirRows.length > 0;

    if (!iTookQuiz) {
      compatibility.set(p.user_id, null);
      quizStates.set(p.user_id, "your_quiz_pending");
      continue;
    }
    if (!theyTookQuiz) {
      compatibility.set(p.user_id, null);
      quizStates.set(p.user_id, "their_quiz_pending");
      continue;
    }
    const result = computeCompatibility(myAnswerMap, toAnswerMap(theirRows));
    if (result.answeredBoth === 0) {
      compatibility.set(p.user_id, null);
      quizStates.set(p.user_id, "their_quiz_pending");
    } else {
      compatibility.set(p.user_id, result.overall);
      quizStates.set(p.user_id, "scored");
    }
  }

  return (
    <main className="container browse-page">
      <header className="browse-header">
        <h1>Discover</h1>
        <p className="muted">
          Believers on the island who share your faith.
        </p>
      </header>

      <QuizBanner hasQuiz={iTookQuiz} />
      <Filters resultCount={profiles.length} />
      <ActiveFilterChips filters={filters} />

      {profiles.length === 0 ? (
        <div className="empty-state">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/owl-empty.png" alt="" className="empty-illustration" />
          <h2>No matches found</h2>
          <p className="muted">
            Try widening your filters, or check back soon as new members join.
          </p>
        </div>
      ) : (
        <ul className="discover-grid">
          {profiles.map((p) => {
            const photos =
              p.photos && p.photos.length > 0
                ? p.photos
                : p.photo_url
                  ? [p.photo_url]
                  : [];
            const score = compatibility.get(p.user_id) ?? null;
            const quizState = quizStates.get(p.user_id) ?? "their_quiz_pending";
            return (
            <li key={p.user_id} className="discover-card">
              <DiscoverPhotos
                photos={photos}
                displayName={p.display_name}
                age={p.age}
                location={p.location}
                compatibilityScore={score}
                quizState={quizState}
              />

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

              <Link href={`/profile/${p.user_id}`} className="discover-body">
                <div className="card-meta">
                  {p.denomination && (
                    <span className="tag">⛪ {p.denomination}</span>
                  )}
                </div>
                {p.church_name && (
                  <p className="card-church muted small">{p.church_name}</p>
                )}
                {p.bio && <p className="card-bio">{truncate(p.bio, 140)}</p>}
                <span className="view-profile-link">View profile →</span>
              </Link>
            </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}
