"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InvitesPanel({ open, onClose }: any) {
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    async function fetchInvites() {
      try {
        setLoading(true);
        const res = await fetch("/api/invite/list", { credentials: "include" });
        const data = await res.json();
        setInvites(data.invites || []);
      } catch (err) {
        console.error("Error fetching invites:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInvites();
  }, [open]);

  async function handleAccept(inviteId: string) {
    try {
      const res = await fetch("/api/invite/accept", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId }),
      });

      if (res.ok) {
        setInvites(invites.filter((inv) => inv.id !== inviteId));
      }
    } catch (err) {
      console.error("Error accepting invite:", err);
    }
  }

  async function handleReject(inviteId: string) {
    try {
      const res = await fetch("/api/invite/reject", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId }),
      });

      if (res.ok) {
        setInvites(invites.filter((inv) => inv.id !== inviteId));
      }
    } catch (err) {
      console.error("Error rejecting invite:", err);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* PANEL */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* HEADER */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Room Invites</h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  {invites.length} pending
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6">
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {!loading && invites.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="w-12 h-12 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-gray-500 font-medium">No invitations</p>
                  <p className="text-gray-400 text-sm mt-1">
                    You're all caught up!
                  </p>
                </div>
              )}

              {!loading && invites.length > 0 && (
                <div className="space-y-3">
                  {invites.map((invite: any, index: number) => (
                    <motion.div
                      key={invite.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {invite.room.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            from{" "}
                            <span className="font-medium text-gray-900">
                              {invite.sender.name}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(invite.id)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(invite.id)}
                          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
