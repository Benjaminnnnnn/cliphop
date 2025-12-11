import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { IConversation, IMessage } from "../../../types";
import Navbar from "../../components/Navbar";
import useAuthStore from "../../store/authStore";

dayjs.extend(relativeTime);

const MessagesPage = () => {
  const { userProfile } = useAuthStore();
  const router = useRouter();
  const { userId: targetUserId } = router.query as { userId?: string };

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const otherParticipant = useMemo(() => {
    if (!selectedConversation || !userProfile) return null;
    return selectedConversation.participants.find(
      (p) => p._id !== userProfile._id
    );
  }, [selectedConversation, userProfile]);

  const fetchConversations = async () => {
    if (!userProfile) return;
    const { data } = await axios.get(
      `/api/conversation?userId=${userProfile._id}`
    );
    setConversations(data || []);
    if (data?.length && !selectedConversation) {
      setSelectedConversation(data[0]);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data } = await axios.get(
      `/api/messages?conversationId=${conversationId}`
    );
    setMessages(data || []);
  };

  const ensureConversation = async () => {
    if (!userProfile || !targetUserId) return;
    const { data } = await axios.post("/api/conversation", {
      userId: userProfile._id,
      participantId: targetUserId,
    });
    setSelectedConversation(data);
    fetchConversations();
  };

  const sendMessage = async () => {
    if (!userProfile || !selectedConversation || !text.trim()) return;
    const other =
      selectedConversation.participants.find((p) => p._id !== userProfile._id)
        ?._id || userProfile._id;
    const { data } = await axios.post("/api/messages", {
      conversationId: selectedConversation._id,
      text: text.trim(),
      from: userProfile._id,
      to: other,
    });
    setText("");
    setMessages((prev) => [...prev, data]);
    fetchConversations();
  };

  const deleteConversation = async (conversationId: string) => {
    await axios.delete(`/api/conversation?conversationId=${conversationId}`);
    const remaining = conversations.filter((c) => c._id !== conversationId);
    setConversations(remaining);
    if (selectedConversation?._id === conversationId) {
      setSelectedConversation(remaining[0] || null);
      setMessages([]);
    }
    setPendingDeleteId(null);
    setConfirmOpen(false);
  };

  useEffect(() => {
    if (userProfile) {
      fetchConversations();
    }
  }, [userProfile]);

  useEffect(() => {
    if (selectedConversation?._id) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation?._id]);

  useEffect(() => {
    if (targetUserId && userProfile) {
      ensureConversation();
    }
  }, [targetUserId, userProfile]);

  if (!userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-600">
          Please sign in to view your messages.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Navbar />
      <div className="mx-auto flex h-full w-full max-w-6xl flex-1 gap-6 px-4 pb-6 pt-2 md:px-8">
        <div className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:p-6">
          <aside className="flex h-full w-full flex-col border-b border-slate-200 pb-4 md:w-1/3 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">
              Conversations
            </h2>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
              {conversations.length ? (
                conversations.map((conv) => {
                  const other =
                    conv.participants.find((p) => p._id !== userProfile._id) ||
                    conv.participants[0];
                  const isActive = selectedConversation?._id === conv._id;
                  return (
                    <div
                      key={conv._id}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                        isActive
                          ? "border-slate-300 bg-slate-100"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedConversation(conv)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                          {other?.image && (
                            <Image
                              src={other.image}
                              alt={other.userName}
                              layout="fill"
                              objectFit="cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800">
                            {other?.userName || "Unknown"}
                          </span>
                          <span className="text-xs text-slate-500">
                            {conv.lastMessage?.text
                              ? conv.lastMessage.text.slice(0, 40)
                              : "No messages yet"}
                          </span>
                        </div>
                        <span className="ml-auto text-[10px] font-semibold text-slate-400">
                          {conv.updatedAt
                            ? dayjs(conv.updatedAt).fromNow()
                            : ""}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedConversation(conv);
                          setPendingDeleteId(conv._id);
                          setConfirmOpen(true);
                        }}
                        className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">No conversations yet.</p>
              )}
            </div>
          </aside>

          <section className="flex h-full w-full flex-1 flex-col rounded-xl bg-slate-50 p-4 shadow-inner shadow-white/70">
            {selectedConversation ? (
              <>
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  {otherParticipant && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                      <Image
                        src={otherParticipant.image}
                        alt={otherParticipant.userName}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">
                      {otherParticipant?.userName || "Conversation"}
                    </span>
                    <Link href={`/profile/${otherParticipant?._id || ""}`}>
                      <a className="text-xs text-blue-500 hover:underline">
                        View profile
                      </a>
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto rounded-xl bg-white p-3 shadow-inner shadow-white/60">
                  {messages.length ? (
                    messages.map((msg) => {
                      const isMine = msg.from?._id === userProfile._id;
                      return (
                        <div
                          key={msg._id}
                          className={`flex w-full ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                              isMine
                                ? "bg-[#ff6b6b] text-white"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span className="mt-1 block text-[10px] opacity-70">
                              {dayjs(msg.createdAt).fromNow()}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
                      No messages yet.
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-inner shadow-white/60 transition focus:border-brand/50 focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
                      text.trim()
                        ? "bg-[#ff6b6b] hover:-translate-y-0.5 hover:shadow-md"
                        : "cursor-not-allowed bg-slate-300 text-slate-100"
                    }`}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
                Select a conversation to start messaging.
              </div>
            )}
          </section>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-base font-semibold text-slate-900">
              Delete conversation?
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This will remove the conversation and its messages for you.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setPendingDeleteId(null);
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => pendingDeleteId && deleteConversation(pendingDeleteId)}
                className="rounded-full bg-[#ff6b6b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
