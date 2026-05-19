import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { countUnreadMessages, getProfile } from "@/lib/supabase";
import { AuthButton } from "./AuthButton";
import { NavLinks } from "./NavLinks";

export async function TopNav() {
  const session = await getServerSession(authOptions);
  const signedIn = Boolean(session?.user?.id);

  const [profile, unread] = signedIn
    ? await Promise.all([
        getProfile(session!.user!.id!),
        countUnreadMessages(session!.user!.id!),
      ])
    : [null, 0];

  const hasProfile = Boolean(profile);

  return (
    <header className="topnav-wrap">
      <div className="container topnav">
        <Link href="/" className="brand">
          Christian<span>Aruba</span>Dating
        </Link>

        {signedIn && hasProfile ? (
          <>
            <NavLinks unreadCount={unread} />
            <AuthButton variant="ghost" />
          </>
        ) : signedIn ? (
          <AuthButton variant="ghost" />
        ) : (
          <AuthButton variant="ghost" />
        )}
      </div>
    </header>
  );
}
