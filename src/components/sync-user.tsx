"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function SyncUser() {
  const { user, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsertFromClerk);

  useEffect(() => {
    if (!isLoaded || !user) return;

    void upsertUser({
      clerkUserId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? "unknown@email.com",
      name: user.fullName ?? user.firstName ?? "Anonymous User",
      imageUrl: user.imageUrl,
    });
  }, [isLoaded, upsertUser, user]);

  return null;
}
