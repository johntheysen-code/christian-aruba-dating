import type { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import { upsertUser } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
      authorization: {
        params: { scope: "email public_profile" },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "facebook" && user.email) {
        const row = await upsertUser({
          facebook_id: account.providerAccountId,
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        });
        if (row) {
          (user as { dbId?: string }).dbId = row.id;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      const dbId = (user as { dbId?: string } | undefined)?.dbId;
      if (dbId) token.dbId = dbId;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.dbId) {
        (session.user as { id?: string }).id = token.dbId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
