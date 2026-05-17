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
        await upsertUser({
          facebook_id: account.providerAccountId,
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
  },
};
