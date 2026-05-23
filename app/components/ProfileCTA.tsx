import Link from "next/link";

export function ProfileCTA({
  hasProfile,
  hasQuiz = false,
}: {
  hasProfile: boolean;
  hasQuiz?: boolean;
}) {
  if (!hasProfile) {
    return (
      <Link href="/profile/edit" className="btn btn-coral">
        Complete your profile →
      </Link>
    );
  }
  if (!hasQuiz) {
    return (
      <Link href="/quiz" className="btn btn-coral">
        Take the compatibility quiz →
      </Link>
    );
  }
  return (
    <Link href="/browse" className="btn btn-coral">
      Browse members →
    </Link>
  );
}
