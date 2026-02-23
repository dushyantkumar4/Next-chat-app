import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_user_id", ["clerkUserId"]),

  messages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    body: v.string(),
    sentAt: v.number(),
  })
    .index("by_sender_receiver", ["senderId", "receiverId"])
    .index("by_receiver_sender", ["receiverId", "senderId"]),
});
