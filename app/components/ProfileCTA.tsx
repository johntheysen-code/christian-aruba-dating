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
    <Link href="/browse" className="btn btn-facebook">
      Browse members →
    </Link>
  );
}
