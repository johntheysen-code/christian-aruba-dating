# Amor y Fe — App Overview

A complete walk-through of what the app does, every screen, every flow, and the UX principles behind each decision. Share this with designers, marketers, product folks, or pastors who want to evaluate the product.

> **Live site:** https://amoryfe.app
> **Repo:** https://github.com/johntheysen-code/christian-aruba-dating

---

## 1. What it is

**Amor y Fe** (*Love and Faith*) is a Christian dating site for singles on Aruba. It is:

- **Marriage-first**, not casual encounters
- **Compatibility-driven** via a 22-question quiz
- **One-man-one-woman** matching only (biblical view)
- **Local to Aruba** — Papiamento accents, Aruban towns, the shoco bird and divi-divi tree as mascots
- **Faith-explicit** — every conviction question, every visual choice

Built as a solo founder's project, currently in private beta. Free to use.

---

## 2. Tech stack (so a developer can verify)

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Auth | NextAuth.js + Facebook OAuth |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (profile photos) |
| Hosting | Vercel |
| Styling | Vanilla CSS (no Tailwind / component library) |
| Domain | `amoryfe.app` |

---

## 3. The full user journey

Step by step from first visit to first match.

### Step 1 — First visit (logged out)
User lands on the **homepage**. Sees:
- Top nav with brand logo (shoco couple) and "Continue with Facebook" button
- Hero with the headline **"Equally Yoked, by design."** + Papiamento subline + body copy
- Hero illustration (watercolor Aruban beach scene with couple under divi-divi tree)
- **Two CTAs:** primary coral **"Take the Quiz →"** + secondary outlined **"Continue with Facebook"**
- Three-step "How it works" section
- FAQ accordion
- Footer with owl illustration

### Step 2 — Sign in
User clicks either CTA → Facebook OAuth flow → returns to site authenticated.
- Both buttons end the same way; "Take the Quiz" includes `callbackUrl=/quiz` to drop them in the quiz immediately
- Facebook sign-in is the only way in — every member is a verified real person

### Step 3 — Profile creation (required)
First-time users with no profile are redirected to **`/profile/edit`**.
- Photo upload (up to 6 photos, primary photo on top, drag to reorder, delete)
- A coral "Add N more photos to look 2× more attractive" nudge if <3 photos
- Required fields: display name, age, gender ("A man seeking a woman" / "A woman seeking a man")
- Optional fields: denomination, church name, location (Aruba towns dropdown), bio
- Optional faith fields: favorite verse, statement of faith, church attendance, prayer life
- Optional life fields: marriage intention, children plans
- A **Compatibility quiz** banner with a progress bar shows at the top
- A **danger zone** at the bottom for self-serve account deletion

### Step 4 — Quiz (required to access matching)
Once profile exists, user is **hard-redirected** to `/quiz`. They cannot bypass this — Discover, Matches, and Messages all redirect back here until the quiz has at least one answer saved.

- First-time visitors see a full ocean-blue **welcome interstitial** at the top: owl illustration + kicker "ONE STEP BEFORE YOU MEET ANYONE" + headline + framing copy
- 22 questions in 6 categories:
  - **Faith essentials** (Bible authority, salvation, prayer, spiritual life, denomination importance) — weight ×3
  - **Faith practices** (church attendance, tithing, Bible reading, ministry involvement) — weight ×2
  - **Christian convictions** (carnival, physical intimacy, cohabitation, bars/nightclubs, media choices, tattoos/piercings) — weight ×3
  - **Marriage & family** (marriage timing, children, leadership view, extended family importance) — weight ×2
  - **Lifestyle** (physical activity, introvert/extrovert) — weight ×1
  - **Life & location** (commitment to Aruba, missions/service) — weight ×2
- Sticky progress bar shows "X / 22 answered"
- Each answered question is a coral pill button; tap to select, tap again to deselect
- Save button at the bottom; redirects to Discover after save

### Step 5 — Discover (browsing matches)
After saving the quiz, user lands on **`/browse`**. Sees:
- A nav bar with Quiz tab (now showing ✓ green check), Discover (active), Matches, Messages, Profile
- A **Filters** button + a "5 matches" counter
- Active filters shown as removable coral chips
- A grid of **profile cards**, max 4 per row on desktop, responsive down to 1 on mobile

Each profile card shows:
- A photo carousel (tap left/right thirds to flip through photos, dots at the top)
- A small **compatibility badge** at top-left:
  - **"85% match"** (green) if both took the quiz
  - **"Quiz pending"** (muted gray) if other person hasn't taken it
  - **"Take the quiz"** (coral) if viewer hasn't
- A floating **X (Pass)** button at top-right of the photo
- A bottom gradient overlay with name + age + location
- Card body (clickable to view profile): denomination tag, church name, bio snippet, "Read profile to like →"

### Step 6 — View a profile
Clicking the card body opens **`/profile/[userId]`**.
- Big square photo, name, age, denomination/location tags, church name
- A kebab menu (⋮) for **Block** or **Report**
- A **Compatibility section** showing overall % + category breakdown (color-coded progress bars)
- An **About** section with the bio (truncated to 160 chars if not matched yet)
- A small coral hint: "🔒 Full bio, additional photos, and faith details unlock when you both like each other."
- Once matched, the gated sections reveal: full bio, additional photos gallery, Faith section, Looking ahead section
- A **Like (♥)** button at the bottom — clicking it commits

### Step 7 — Like and match
- Like is recorded server-side
- If the other person had previously liked you → instant **"🎉 It's a match with [Name]!"** toast at the bottom of the screen with the celebration owl illustration
- Both users can now see each other's full profile + send messages

### Step 8 — Matches page
**`/matches`** shows a grid of all mutual matches.
- Each card: photo, name, age, denomination, location, bio, **"Send message"** button

### Step 9 — Messaging
- `/messages` shows a list of conversations with unread count badges
- `/messages/[userId]` is the thread view: chat bubbles (blue for you, sand for them), timestamps, sticky compose form at the bottom
- Only matched users can message each other (server-enforced)
- Opening a thread marks all incoming messages as read

---

## 4. Page-by-page feature inventory

### Top navigation (sticky, every page)
- **Brand logo** — two shoco owls (Aruba's national bird) hugging with a coral heart above
- **Brand wordmark** — "Amor y Fe" in three colors: coral "Amor", italic gray "y", deep blue "Fe"
- **Five tabs** (visible after profile + quiz exist):
  - **Quiz** — coral with red dot when incomplete, green ✓ when complete
  - **Discover** / **Matches** / **Messages** / **Profile** — all locked (gray) until quiz is done
- **Avatar dropdown** (top right) — opens to: signed-in name, Edit profile, Compatibility quiz, Sign out
- On mobile (< 640px), nav links wrap to a second row inside the same header

### Homepage (`/`)
- Hero (kicker + headline + Papiamento sub + body + 2 CTAs + watercolor illustration)
- How it works (3 cards, Step 1 is fully clickable to start the quiz)
- FAQ accordion (7 expandable questions)
- CTA repeat block
- Footer with owl illustration + Privacy/Terms links

### Quiz (`/quiz`)
- First-time welcome interstitial
- Returning-user header
- Progress bar (sticky)
- 6 category sections, 22 questions
- Save button + redirect to Discover

### Profile edit (`/profile/edit`)
- Quiz CTA banner with progress
- Multi-photo manager + nudge
- Basic / faith / life form fields
- Save → redirect home
- Delete account danger zone

### Discover (`/browse`)
- Filters panel + active filter chips
- "How compatibility works" banner (dismissable, only shown if quiz incomplete)
- Profile card grid

### Profile detail (`/profile/[userId]`)
- Hero (photo + name + meta + actions menu)
- Compatibility section (with bars)
- About (gated)
- Photos gallery (gated)
- Faith section (gated)
- Looking ahead section (gated)
- Like + Message buttons

### Matches (`/matches`)
- Card grid of mutual matches with Send message links

### Messages (`/messages`, `/messages/[userId]`)
- Conversation list with avatars and unread badges
- Thread view with chat bubbles + compose

### 404 (`/not-found`)
- Confused owl + "Take me home" button

### Privacy & Terms (`/privacy`, `/terms`)
- Standard legal content

---

## 5. UX principles applied (with examples)

| Principle | How it shows up |
|---|---|
| **Marriage-first, not swipe-first** | Like requires viewing the full profile. No swipe gestures. Match required before messaging. |
| **Christian intentionality** | One-man-one-woman matching only. Convictions in the quiz. Quiz is unbypassable. |
| **Gradual reveal (modesty)** | Bio truncated, photos gated, faith details hidden until mutual interest |
| **Local identity** | Papiamento subline ("Traha pa nos dushi Aruba"), Aruban town dropdowns, shoco mascot, divi-divi tree icon |
| **Safety by default** | Facebook verification, one-tap block, report-with-reason flow, self-delete instantly |
| **No dark patterns** | No fake notifications, no FOMO countdowns, no "X people liked you, upgrade to see who" |
| **Mobile-first** | Built and tested on iPhone, container padding scales, nav wraps gracefully |

---

## 6. What's intentionally NOT built (yet)

Honest list of gaps a reviewer might ask about:

- **Email notifications** — new match, new message (needs Resend integration)
- **Push notifications** — requires PWA or native app
- **Custom domain** — still on Vercel subdomain
- **Real-time chat** — currently refresh-based, no typing indicators or read receipts
- **Photo verification** (selfie matching for anti-catfish)
- **Daily devotional / verse of the day** on homepage
- **Profile completion meter** (basic encouragement only)
- **Member referral system**
- **Admin dashboard for moderation** (reports are saved but no admin UI to review them)
- **Premium / paid features**
- **Native mobile app**
- **Multiple languages** beyond English (Papiamento phrases sprinkled in)
- **Search by keyword / name**
- **"Who viewed you" / "Who liked you"** feature
- **Faith-based prompts** (Hinge-style answer prompts on profiles)
- **Local meetup / event listings**
- **Press mentions / testimonials** section

The launch playbook (`marketing/launch-playbook.md`) prioritizes which of these are worth building first based on real user signal.

---

## 7. Safety and privacy

- **Authentication:** Facebook OAuth only. No anonymous accounts.
- **Visibility:** Profiles are only visible to other signed-in members.
- **Messaging:** Strictly between matched users; server-enforced.
- **Block:** Mutual hiding — neither user sees the other; tears down any existing match.
- **Report:** Saved to a `reports` table with reason categories; auto-blocks the reported user. (No admin UI yet — reports require manual database review.)
- **Data deletion:** Self-serve at any time. Permanently removes profile, photos (from Supabase Storage), quiz answers, likes, matches, messages.

---

## 8. How to test as a reviewer

### As a public visitor
1. Visit https://amoryfe.app on any device
2. Read homepage, explore FAQ, try the "Take the Quiz" button
3. Facebook will prompt to sign in — you must be added as a tester first (contact the founder)

### As a tester
Once added as a Facebook app tester:
1. Sign in
2. Create your profile
3. Take the quiz (10-15 minutes)
4. Browse Discover — you'll see seeded test profiles
5. Try Liking and Passing
6. View a profile detail to see the full compatibility breakdown
7. Test the danger zone deletion on Profile → Delete account

---

## 9. Brand reference (for designers)

| Element | Detail |
|---|---|
| Tagline | "Equally Yoked, by design." |
| Sub-tagline (Papiamento) | "Traha pa nos dushi Aruba." (Made for our sweet Aruba) |
| Promise | "Less swiping. More marriage." |
| Mascot | Two shocos (burrowing owls — Aruba's national bird, pair-bonded) |
| Iconic illustration | Divi-divi tree (replaces palm-tree emoji throughout) |
| Primary color | Coral `#e8745a` |
| Secondary color | Ocean blue `#074d65` / `#0a6b8a` |
| Background warm | Sand `#fff8ec` |

Full brand brief at [`marketing/brand-brief.md`](./brand-brief.md).
StoryBrand BrandScript at [`marketing/brandscript.md`](./brandscript.md).
Positioning at [`marketing/positioning.md`](./positioning.md).

---

## 10. What to ask a reviewer

Suggested questions to bring to a professional:

- **Designer:** Does the hero flow / illustration / brand voice feel cohesive? Anything off?
- **UX person:** Is the quiz gate too aggressive, or appropriate? Does the "Like only from profile" flow feel right?
- **Christian leader (pastor):** Does the language and product feel like it would respect your congregation? What might make you uncomfortable recommending it?
- **Marketer:** Where does the first-time visit lose users? What's the missing channel?
- **Engineer:** Any obvious technical risks? What would you add for a small launch?
- **Real Aruban single:** Would you actually sign up? What's missing? What's awkward?

You don't need all five — even one honest critique sharpens the product.

---

*Last updated: today. Site has been built iteratively by John Theysen with Claude. This document mirrors what is currently live.*
