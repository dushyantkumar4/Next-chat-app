import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listForConversation = query({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!me) return [];

    const sent = await ctx.db
      .query("messages")
      .withIndex("by_sender_receiver", (q) => q.eq("senderId", me._id).eq("receiverId", args.otherUserId))
      .collect();

    const received = await ctx.db
      .query("messages")
      .withIndex("by_receiver_sender", (q) => q.eq("receiverId", me._id).eq("senderId", args.otherUserId))
      .collect();

    return [...sent, ...received].sort((a, b) => a.sentAt - b.sentAt);
  },
});

export const send = mutation({
  args: {
    receiverId: v.id("users"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!me) throw new Error("Profile not found");

    return await ctx.db.insert("messages", {
      senderId: me._id,
      receiverId: args.receiverId,
      body: args.body,
      sentAt: Date.now(),
    });
  },
});
