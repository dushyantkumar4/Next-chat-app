import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-bold">Realtime Chat App</h1>
      <p className="max-w-2xl text-slate-600">
        Beginner-friendly demo using Next.js App Router for UI, Clerk for authentication, and Convex for realtime backend + database.
      </p>

      <SignedOut>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link className="rounded-lg bg-slate-900 px-4 py-2 text-white" href="/sign-up">
            Create account
          </Link>
          <Link className="rounded-lg border border-slate-300 bg-white px-4 py-2" href="/sign-in">
            Sign in
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-3">
          <Link className="rounded-lg bg-sky-600 px-4 py-2 text-white" href="/chat">
            Go to chat
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </main>
  );
}
