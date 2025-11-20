"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
}

export default function InviteModal({ open, onClose, roomId }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleInvite() {
    if (!email.trim()) return;

    setSending(true);
    setMessage("");

    try {
      const res = await fetch("/api/invite/send", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Invite failed.");
      } else {
        setMessage("Invitation sent successfully!");
        setEmail("");
      }
    } catch (error) {
      setMessage("Server error.");
    }

    setSending(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
          >
            {/* TITLE */}
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              Invite User
            </h2>

            <p className="text-sm text-slate-500 mb-4">
              Enter the email of the user you want to invite to this room.
            </p>

            {/* INPUT */}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="User email…"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />

            {/* MESSAGE */}
            {message && (
              <p
                className={`mt-2 text-sm ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleInvite}
                disabled={sending}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
