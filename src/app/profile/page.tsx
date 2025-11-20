"use client";

import { useEffect, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  avatar?: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Avatar upload
  const [uploading, setUploading] = useState(false);

  // Password modal
  const [passOpen, setPassOpen] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);

  // ---- Load user from backend ----
  async function loadUser() {
    try {
      const res = await fetch("/api/profile/get", { credentials: "include" });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setName(data.user.name || "");
      setBio(data.user.bio || "");
    } catch (err) {
      console.error("profile get error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  // ---- Save profile (name + bio) ----
  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveMsg(data.error || "Something went wrong");
        return;
      }

      setSaveMsg("Profile updated successfully.");
      setUser(data.user);
    } catch (err) {
      console.error("profile update error:", err);
      setSaveMsg("Error updating profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 2000);
    }
  }

  // ---- Avatar upload ----
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error || "Avatar upload failed");
        setUploading(false);
        return;
      }

      setUser((prev) =>
        prev ? { ...prev, avatar: data.avatar } : prev
      );
    } catch (err) {
      console.error("avatar upload error:", err);
    } finally {
      setUploading(false);
    }
  }

  // ---- Password change ----
  async function handlePasswordUpdate() {
    setPassMsg("");

    if (!oldPass || !newPass || !newPass2) {
      setPassMsg("Please fill in all fields.");
      return;
    }

    if (newPass !== newPass2) {
      setPassMsg("New passwords do not match.");
      return;
    }

    setLoadingPass(true);

    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: oldPass,
          newPassword: newPass,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPassMsg(data.error || "Error updating password.");
        setLoadingPass(false);
        return;
      }

      setPassMsg("Password updated successfully!");
      setOldPass("");
      setNewPass("");
      setNewPass2("");

      setTimeout(() => {
        setPassOpen(false);
        setPassMsg("");
      }, 1200);
    } catch (err) {
      console.error("password change error:", err);
      setPassMsg("Error updating password.");
    } finally {
      setLoadingPass(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <span className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading profile...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-sm">User not found.</p>
      </main>
    );
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Profile
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            Manage your personal information, avatar and account security.
          </p>
        </div>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 border border-slate-200 shadow-xl shadow-slate-100 rounded-2xl overflow-hidden"
        >
          {/* Top banner */}
          <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500" />

          <div className="px-6 pb-6 pt-0 md:px-8 md:pb-8">
            <div className="flex flex-col md:flex-row gap-6 -mt-12 md:-mt-14">
              {/* LEFT: Avatar + Basic Info */}
              <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
                <div className="relative">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg object-cover bg-slate-100"
                  />
                  <label className="absolute bottom-0 right-0 bg-white rounded-full shadow p-1.5 cursor-pointer border border-slate-200 hover:bg-slate-50">
                    <svg
                      className="w-4 h-4 text-slate-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232 16.5 3.964a2.121 2.121 0 1 1 3 3L18.232 8.5M15.232 5.232 6.5 14l-2 4 4-2 8.732-8.768M18 20H6"
                      />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={uploading}
                    />
                  </label>
                </div>

                <div className="text-center md:text-left space-y-1">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {user.name || "New User"}
                  </h2>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <p className="text-xs text-slate-400">
                    Member since <span className="font-medium">{joinedDate}</span>
                  </p>
                </div>

                <button
                  onClick={() => setPassOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs md:text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 17v-5m-6 2V10a6 6 0 1 1 12 0v4M5 11h14v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7z"
                    />
                  </svg>
                  Change Password
                </button>

                {uploading && (
                  <p className="text-xs text-blue-600">Uploading avatar...</p>
                )}
              </div>

              {/* RIGHT: Form */}
              <div className="flex-1">
                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-6 mt-2 md:mt-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                      Profile Information
                    </h3>
                  
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-800">
                        Full Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-800">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white min-h-[90px]"
                        placeholder="Tell a bit about your role, team or working style..."
                      />
                    </div>
                  </div>

                  {saveMsg && (
                    <p
                      className={`text-xs ${
                        saveMsg.includes("success")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {saveMsg}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                    >
                      {saving && (
                        <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                      )}
                      <span>{saving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* PASSWORD MODAL */}
      <AnimatePresence>
        {passOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  Change Password
                </h2>
                <button
                  onClick={() => setPassOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Choose a strong password that you don&apos;t use elsewhere.
              </p>

              {passMsg && (
                <p
                  className={`text-xs ${
                    passMsg.includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {passMsg}
                </p>
              )}

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-800">
                    Old Password
                  </label>
                  <input
                    type="password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-800">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-800">
                    Repeat New Password
                  </label>
                  <input
                    type="password"
                    value={newPass2}
                    onChange={(e) => setNewPass2(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setPassOpen(false)}
                  className="px-4 py-2 text-xs md:text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  disabled={loadingPass}
                  className="px-4 py-2 text-xs md:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {loadingPass && (
                    <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{loadingPass ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
