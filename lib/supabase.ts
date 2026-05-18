import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return cached;
}

export type UserUpsert = {
  facebook_id: string;
  email: string;
  name: string | null;
  image: string | null;
};

export type UserRow = {
  id: string;
  facebook_id: string;
  email: string;
  name: string | null;
  image: string | null;
};

export async function upsertUser(user: UserUpsert): Promise<UserRow | null> {
  const client = getAdminClient();
  if (!client) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[supabase] skipping upsert — env not configured", user.email);
    }
    return null;
  }
  const { data, error } = await client
    .from("users")
    .upsert(
      {
        facebook_id: user.facebook_id,
        email: user.email,
        name: user.name,
        image: user.image,
        last_login_at: new Date().toISOString(),
      },
      { onConflict: "facebook_id" }
    )
    .select("id, facebook_id, email, name, image")
    .single();
  if (error) {
    console.error("[supabase] upsert failed", error);
    return null;
  }
  return data as UserRow;
}

export type Profile = {
  user_id: string;
  display_name: string;
  age: number | null;
  gender: "male" | "female" | null;
  looking_for: "male" | "female" | "both" | null;
  denomination: string | null;
  church_name: string | null;
  location: string | null;
  bio: string | null;
  photo_url: string | null;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const client = getAdminClient();
  if (!client) return null;
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[supabase] getProfile failed", error);
    return null;
  }
  return (data as Profile) ?? null;
}

export async function upsertProfile(profile: Profile): Promise<Profile | null> {
  const client = getAdminClient();
  if (!client) return null;
  const { data, error } = await client
    .from("profiles")
    .upsert(
      { ...profile, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    )
    .select("*")
    .single();
  if (error) {
    console.error("[supabase] upsertProfile failed", error);
    return null;
  }
  return data as Profile;
}

export async function listMatchableProfiles(
  excludeUserId: string,
  viewer: Profile
): Promise<Profile[]> {
  const client = getAdminClient();
  if (!client) return [];

  let query = client
    .from("profiles")
    .select("*")
    .neq("user_id", excludeUserId)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (viewer.looking_for === "male" || viewer.looking_for === "female") {
    query = query.eq("gender", viewer.looking_for);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[supabase] listMatchableProfiles failed", error);
    return [];
  }
  return (data ?? []) as Profile[];
}

export async function getLikedIds(likerId: string): Promise<Set<string>> {
  const client = getAdminClient();
  if (!client) return new Set();
  const { data, error } = await client
    .from("likes")
    .select("liked_id")
    .eq("liker_id", likerId);
  if (error) {
    console.error("[supabase] getLikedIds failed", error);
    return new Set();
  }
  return new Set((data ?? []).map((r) => r.liked_id as string));
}

export async function like(
  likerId: string,
  likedId: string
): Promise<{ matched: boolean }> {
  const client = getAdminClient();
  if (!client) return { matched: false };
  if (likerId === likedId) return { matched: false };

  const { error: insertError } = await client
    .from("likes")
    .upsert(
      { liker_id: likerId, liked_id: likedId },
      { onConflict: "liker_id,liked_id" }
    );
  if (insertError) {
    console.error("[supabase] like insert failed", insertError);
    return { matched: false };
  }

  const { data: reciprocal, error: checkError } = await client
    .from("likes")
    .select("liker_id")
    .eq("liker_id", likedId)
    .eq("liked_id", likerId)
    .maybeSingle();
  if (checkError) {
    console.error("[supabase] like reciprocal check failed", checkError);
    return { matched: false };
  }
  return { matched: Boolean(reciprocal) };
}

export async function unlike(likerId: string, likedId: string): Promise<void> {
  const client = getAdminClient();
  if (!client) return;
  const { error } = await client
    .from("likes")
    .delete()
    .eq("liker_id", likerId)
    .eq("liked_id", likedId);
  if (error) console.error("[supabase] unlike failed", error);
}

export async function listMatches(userId: string): Promise<Profile[]> {
  const client = getAdminClient();
  if (!client) return [];

  const matchedIds = await getMatchedUserIds(userId);
  if (matchedIds.length === 0) return [];

  const { data: profiles, error: profErr } = await client
    .from("profiles")
    .select("*")
    .in("user_id", matchedIds);
  if (profErr) {
    console.error("[supabase] listMatches profiles failed", profErr);
    return [];
  }
  return (profiles ?? []) as Profile[];
}

async function getMatchedUserIds(userId: string): Promise<string[]> {
  const client = getAdminClient();
  if (!client) return [];

  const { data: outgoing, error: outErr } = await client
    .from("likes")
    .select("liked_id")
    .eq("liker_id", userId);
  if (outErr) return [];
  const likedIds = (outgoing ?? []).map((r) => r.liked_id as string);
  if (likedIds.length === 0) return [];

  const { data: incoming, error: inErr } = await client
    .from("likes")
    .select("liker_id")
    .eq("liked_id", userId)
    .in("liker_id", likedIds);
  if (inErr) return [];
  return (incoming ?? []).map((r) => r.liker_id as string);
}

export async function isMatched(
  userA: string,
  userB: string
): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;
  const { data, error } = await client
    .from("likes")
    .select("liker_id, liked_id")
    .or(
      `and(liker_id.eq.${userA},liked_id.eq.${userB}),and(liker_id.eq.${userB},liked_id.eq.${userA})`
    );
  if (error) {
    console.error("[supabase] isMatched failed", error);
    return false;
  }
  return (data?.length ?? 0) >= 2;
}

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

export async function sendMessage(
  senderId: string,
  recipientId: string,
  body: string
): Promise<Message | null> {
  const client = getAdminClient();
  if (!client) return null;
  const { data, error } = await client
    .from("messages")
    .insert({ sender_id: senderId, recipient_id: recipientId, body })
    .select("*")
    .single();
  if (error) {
    console.error("[supabase] sendMessage failed", error);
    return null;
  }
  return data as Message;
}

export async function listThread(
  userA: string,
  userB: string
): Promise<Message[]> {
  const client = getAdminClient();
  if (!client) return [];
  const { data, error } = await client
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userA},recipient_id.eq.${userB}),and(sender_id.eq.${userB},recipient_id.eq.${userA})`
    )
    .order("created_at", { ascending: true })
    .limit(500);
  if (error) {
    console.error("[supabase] listThread failed", error);
    return [];
  }
  return (data ?? []) as Message[];
}

export async function markThreadRead(
  viewerId: string,
  otherId: string
): Promise<void> {
  const client = getAdminClient();
  if (!client) return;
  const { error } = await client
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", viewerId)
    .eq("sender_id", otherId)
    .is("read_at", null);
  if (error) console.error("[supabase] markThreadRead failed", error);
}

export type ConversationSummary = {
  partner: Profile;
  last_message: Message | null;
  unread_count: number;
};

export async function listConversations(
  userId: string
): Promise<ConversationSummary[]> {
  const client = getAdminClient();
  if (!client) return [];

  const matchedIds = await getMatchedUserIds(userId);
  if (matchedIds.length === 0) return [];

  const { data: profiles } = await client
    .from("profiles")
    .select("*")
    .in("user_id", matchedIds);

  const summaries: ConversationSummary[] = [];
  for (const partner of (profiles ?? []) as Profile[]) {
    const { data: lastArr } = await client
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},recipient_id.eq.${partner.user_id}),and(sender_id.eq.${partner.user_id},recipient_id.eq.${userId})`
      )
      .order("created_at", { ascending: false })
      .limit(1);

    const { count } = await client
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", userId)
      .eq("sender_id", partner.user_id)
      .is("read_at", null);

    summaries.push({
      partner,
      last_message: (lastArr?.[0] as Message) ?? null,
      unread_count: count ?? 0,
    });
  }

  summaries.sort((a, b) => {
    const at = a.last_message?.created_at ?? "";
    const bt = b.last_message?.created_at ?? "";
    return bt.localeCompare(at);
  });

  return summaries;
}
