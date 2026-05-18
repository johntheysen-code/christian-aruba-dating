import Link from "next/link";

export function ProfileCTA({ hasProfile }: { hasProfile: boolean }) {
  return (
    <Link href="/profile/edit" className="btn btn-facebook">
      {hasProfile ? "Edit your profile" : "Complete your profile →"}
    </Link>
  );
}
