"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);

  async function loadUser() {
    const res = await fetch("/api/profile/get", { credentials: "include" });

    if (res.status === 401) return (window.location.href = "/login");

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

  async function uploadAvatar(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      credentials: "include",
      body: form,
    });

    const data = await res.json();
    setUser((prev: any) => ({ ...prev, avatar: data.avatar }));

    setUploading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">My Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-6">

        {/* AVATAR SECTION */}
        <div className="flex items-center gap-6">
          <img
            src={user.avatar || "/default-avatar.png"}
            className="w-20 h-20 rounded-full object-cover border"
          />

          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            {uploading ? "Uploading..." : "Change Avatar"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </label>
        </div>

        {/* NAME */}
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            className="w-full border mt-1 px-3 py-2 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* BIO */}
        <div>
          <label className="text-sm font-medium">Bio</label>
          <textarea
            className="w-full border mt-1 px-3 py-2 rounded-lg h-24"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={saveChanges}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </main>
  );
}
