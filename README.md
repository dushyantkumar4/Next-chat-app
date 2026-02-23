# Simple Realtime Live Chat (Next.js + Convex + Clerk)

This project is intentionally **simple and beginner-friendly**.
It gives you one-to-one realtime chat with authentication and a clean responsive UI.

---

## 1) Step-by-step explanation (beginner friendly)

## Step 1: What stack are we using?

- **Next.js App Router** = frontend + routing (`app/` folder)
- **TypeScript** = type safety
- **Clerk** = signup/signin/logout and user session
- **Convex** = backend API + database + realtime updates
- **Tailwind CSS** = quick responsive styling

If you come from React + Express + MongoDB:

- Convex functions (`query`, `mutation`) are like your Express routes.
- Convex tables are like MongoDB collections.
- `useQuery` is like “fetch data”, but live and auto-updating.
- `useMutation` is like POST/PUT requests.

## Step 2: Auth with Clerk

Clerk handles all auth UI and session logic:

- `<SignUp />` page for registration
- `<SignIn />` page for login
- `<UserButton />` for profile + logout
- `middleware.ts` protects `/chat`

No manual JWT creation/verification needed.

## Step 3: Convex backend schema

We keep only **2 tables**:

1. `users`
2. `messages`

`users` stores Clerk user info in Convex.
`messages` stores one-to-one messages.

## Step 4: Sync Clerk user into Convex

When a logged-in user opens chat, `SyncUser` runs `upsertFromClerk` mutation.
That ensures each Clerk user exists in Convex `users` table.

## Step 5: User list + realtime chat

- Left sidebar: `listOtherUsers` query returns everyone except me.
- Chat window: `listForConversation` query returns both directions of messages.
- Send button: `send` mutation inserts message.
- Because Convex is realtime, both users instantly see updates.

## Step 6: Responsive layout

- Mobile: stacked layout
- Tablet/Desktop: sidebar + main chat area
- Tailwind utility classes keep UI modern and clean.

---

## 2) Folder structure

```bash
.
├── convex/
│   ├── schema.ts
│   ├── users.ts
│   ├── messages.ts
│   └── _generated/
│       ├── api.ts
│       └── server.ts
├── middleware.ts
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── chat/page.tsx
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   └── components/
│       ├── providers.tsx
│       ├── sync-user.tsx
│       └── chat-shell.tsx
└── convex.json
```

---

## 3) Convex schema & functions

## `convex/schema.ts`

Defines tables and indexes:

- `users`
  - `clerkUserId`
  - `email`
  - `name`
  - `imageUrl`
- `messages`
  - `senderId`
  - `receiverId`
  - `body`
  - `sentAt`

## `convex/users.ts`

- `getCurrentUser`: returns logged-in user from Convex.
- `listOtherUsers`: returns all users except current user.
- `upsertFromClerk`: create/update user profile from Clerk data.

## `convex/messages.ts`

- `listForConversation(otherUserId)`: returns both sent + received messages sorted by time.
- `send(receiverId, body)`: saves new message.

---

## 4) Clerk setup

## Install and set env values

```bash
npm install
# if needed later:
# npm install @clerk/nextjs convex
```

Create `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

## Add Clerk middleware

`middleware.ts` protects `/chat` route.

## Add Clerk provider

`src/app/layout.tsx` wraps the app with `<ClerkProvider>`.

## Add auth pages

- `/sign-in`
- `/sign-up`

---

## 5) Frontend components

## `providers.tsx`

Adds Convex React provider connected to Clerk auth.

## `sync-user.tsx`

After user logs in, syncs Clerk user into Convex `users` table.

## `chat-shell.tsx`

Main chat UI with:

- Sidebar users list
- Selected conversation messages
- Message input + send button
- `useQuery` for live data
- `useMutation` for sending messages

---

## 6) Simple explanation of realtime flow

1. User sends message.
2. `send` mutation inserts it into Convex `messages` table.
3. Convex detects DB change.
4. Any active `useQuery(listForConversation)` subscribers get new data automatically.
5. UI re-renders instantly (no manual refresh / polling).

That is why Convex can replace the typical Express + Socket.IO setup for simple realtime apps.

---

## 7) Demo/interview talking points

Use these while presenting:

1. **"I used Clerk to avoid custom auth complexity."**
   - No manual JWT middleware.
   - Ready-made sign in/sign up/logout components.

2. **"I used Convex as backend + DB + realtime engine."**
   - Queries and mutations replace Express routes.
   - Tables replace MongoDB collections.
   - Realtime updates are built in.

3. **"Architecture is intentionally simple."**
   - 2 tables only (`users`, `messages`).
   - 2 backend files (`users.ts`, `messages.ts`).
   - 1 main chat UI component.

4. **"Great for beginner explanation."**
   - Easy mental model.
   - Clear folder structure.
   - No advanced patterns or over-engineering.

---

## Run locally

```bash
npm install
npx convex dev
npm run dev
```

Open `http://localhost:3000`.

> Note: In a normal Convex project, `convex/_generated/*` is auto-generated by `npx convex codegen` / `npx convex dev`.
