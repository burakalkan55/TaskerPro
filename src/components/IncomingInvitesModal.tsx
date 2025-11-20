"use client";

import { useEffect, useState } from "react";

export default function IncomingInvitesModal({ open, onClose, onInviteAccepted }: any) {
  const [invites, setInvites] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  async function loadInvites() {
    const res = await fetch("/api/invite/list");
    const data = await res.json();
    setInvites(data.invites || []);
  }

  useEffect(() => {
    if (open) loadInvites();
  }, [open]);

  async function acceptInvite(id: string, roomId: string) {
    await fetch("/api/invite/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteId: id, roomId }),
    });
    setSuccessMsg("Başarıyla kabul edildi!");
    setTimeout(() => setSuccessMsg(""), 2000);
    loadInvites();
    if (onInviteAccepted) {
      onInviteAccepted();
    }
  }

  async function rejectInvite(id: string) {
    await fetch("/api/invite/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteId: id }),
    });
    setSuccessMsg("Başarıyla reddedildi!");
    setTimeout(() => setSuccessMsg(""), 2000);
    loadInvites();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Incoming Invites</h2>

        {successMsg && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-center font-medium animate-fade-in">
            {successMsg}
          </div>
        )}

        {invites.length === 0 && (
          <div className="text-gray-500 text-sm">No invites.</div>
        )}

        {invites.map((inv: any) => (
          <div key={inv.id} className="border p-3 rounded-lg mb-3">
            <div className="font-medium">{inv.room.name}</div>
            <div className="text-sm text-gray-500">
              From: {inv.sender.name || inv.sender.email}
            </div>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => acceptInvite(inv.id, inv.roomId)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg"
              >
                Accept
              </button>

              <button
                onClick={() => rejectInvite(inv.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={onClose}
          className="mt-4 border px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
