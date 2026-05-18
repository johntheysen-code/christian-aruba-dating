import Link from "next/link";

export function ProfileCTA({ hasProfile }: { hasProfile: boolean }) {
  if (!hasProfile) {
    return (
      <Link href="/profile/edit" className="btn btn-facebook">
        Complete your profile →
      </Link>
    );
  }
  return (
    <div className="cta-row">
      <Link href="/browse" className="btn btn-facebook">
        Browse members
      </Link>
      <Link href="/matches" className="btn btn-ghost">
        Matches
      </Link>
      <Link href="/messages" className="btn btn-ghost">
        Messages
      </Link>
      <Link href="/profile/edit" className="btn btn-ghost">
        Edit profile
      </Link>
    </div>
  );
}
