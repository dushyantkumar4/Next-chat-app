"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SyncUser } from "./sync-user";

type User = {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
};

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  body: string;
  sentAt: number;
};

export function ChatShell() {
  const me = useQuery(api.users.getCurrentUser) as User | null | undefined;
  const usersQuery = useQuery(api.users.listOtherUsers) as User[] | undefined;
  const users = usersQuery ?? [];

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [text, setText] = useState("");

  const selectedUser = users.find((user) => user._id === selectedUserId) ?? null;

  const messages =
    (useQuery(
      api.messages.listForConversation,
      selectedUserId ? { otherUserId: selectedUserId as never } : "skip",
    ) as Message[] | undefined) ?? [];

  const sendMessage = useMutation(api.messages.send);

  const handleSend = async () => {
    if (!selectedUserId || !text.trim()) return;
    await sendMessage({ receiverId: selectedUserId as never, body: text.trim() });
    setText("");
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-100">
      <SyncUser />

      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="text-lg font-semibold">Live Chat</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white md:w-80 md:border-b-0 md:border-r">
          <div className="p-3 text-sm font-medium text-slate-500">Users</div>
          <div className="max-h-56 overflow-y-auto md:max-h-[calc(100vh-110px)]">
            {users.length === 0 ? (
              <p className="px-3 pb-3 text-sm text-slate-500">No users found yet.</p>
            ) : (
              users.map((user) => {
                const isActive = user._id === selectedUserId;
                return (
                  <button
                    key={user._id}
                    onClick={() => setSelectedUserId(user._id)}
                    className={`w-full border-t border-slate-100 px-3 py-3 text-left ${
                      isActive ? "bg-sky-100" : "hover:bg-slate-50"
                    }`}
                  >
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="flex flex-1 flex-col">
          <div className="border-b border-slate-200 bg-white px-4 py-3">
            {selectedUser ? (
              <p className="font-medium">Chatting with {selectedUser.name}</p>
            ) : (
              <p className="text-slate-500">Select a user to start chatting</p>
            )}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => {
              const isMine = message.senderId === me?._id;
              return (
                <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      isMine ? "bg-sky-600 text-white" : "bg-white text-slate-800"
                    }`}
                  >
                    <p>{message.body}</p>
                    <p className={`mt-1 text-[10px] ${isMine ? "text-sky-100" : "text-slate-400"}`}>
                      {new Date(message.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSend();
                }}
                placeholder={selectedUserId ? "Type a message..." : "Select a user first"}
                disabled={!selectedUserId}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
              />
              <button
                onClick={() => void handleSend()}
                disabled={!selectedUserId || !text.trim()}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
