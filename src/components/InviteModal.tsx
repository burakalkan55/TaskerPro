"use client";

import { useState, useEffect } from "react";

export default function InviteModal({ open, onClose, roomId }: any) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  async function searchUser(text: string) {
    setQuery(text);
    setSelectedUser(null);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${text}`);
      const data = await res.json();
      setResults(data.users || []);
    } catch (err) {
      console.error("search error:", err);
    }
    setLoading(false);
  }

  async function sendInvite() {
    if (!selectedUser) return;

    try {
      const res = await fetch("/api/invite/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          receiverId: selectedUser.id, // ✔ DOĞRU ID GÖNDERİYORUZ
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error sending invite");
        return;
      }

      alert("Invite sent!");
      onClose();
    } catch (err) {
      console.error("invite send error:", err);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Invite User</h2>

        {/* Arama Input */}
        <input
          className="w-full border px-3 py-2 rounded-lg"
          placeholder="Search user..."
          value={query}
          onChange={(e) => searchUser(e.target.value)}
        />

        {/* Arama Sonuçları */}
        <div className="mt-3 border rounded-lg p-2 max-h-40 overflow-auto">
          {loading && <p className="text-sm text-gray-500">Searching...</p>}

          {!loading && results.length === 0 && (
            <p className="text-sm text-gray-400">No users found.</p>
          )}

          {results.map((user: any) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                selectedUser?.id === user.id
                  ? "bg-purple-100 border border-purple-400"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={!selectedUser}
            onClick={sendInvite}
            className={`px-4 py-2 rounded-lg text-white 
              ${
                selectedUser
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}
