"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  async function loadUser() {
    const res = await fetch("/api/profile/get", { credentials: "include" });

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    setUser(data.user);
    setName(data.user.name || "");
    setBio(data.user.bio || "");
    setLoading(false);
  }

  async function saveChanges() {
    await fetch("/api/profile/update", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio }),
    });

    loadUser();
  }

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">My Profile</h1>

      <div className="bg-white shadow rounded-2xl p-6 border border-gray-200 space-y-5">
        <p className="text-gray-500 text-sm">
          Joined: {new Date(user!.createdAt).toLocaleDateString()}
        </p>

        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Bio</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={saveChanges}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </main>
  );
}
