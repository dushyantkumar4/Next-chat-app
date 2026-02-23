/*
 * Minimal local fallback so the project compiles before running `npx convex codegen`.
 * After you run codegen, Convex will replace this file with strongly typed references.
 */

export const api = {
  users: {
    getCurrentUser: "users:getCurrentUser",
    listOtherUsers: "users:listOtherUsers",
    upsertFromClerk: "users:upsertFromClerk",
  },
  messages: {
    listForConversation: "messages:listForConversation",
    send: "messages:send",
  },
} as const;
