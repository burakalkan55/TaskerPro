"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import IncomingInvitesModal from "@/components/IncomingInvitesModal";

export default function Dashboard() {
  const router = useRouter();

  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [openInvitesModal, setOpenInvitesModal] = useState(false);
  const [inviteCount, setInviteCount] = useState(0);
  // Fetch invite count
  async function fetchInviteCount() {
    try {
      const res = await fetch("/api/invite/list");
      const data = await res.json();
      setInviteCount((data.invites || []).length);
    } catch (err) {
      setInviteCount(0);
    }
  }

  // Fetch rooms
  async function fetchRooms() {
    try {
      const res = await fetch("/api/rooms/list");
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (err) {
      console.error("Room fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Davet kabul edildiğinde tetiklenecek fonksiyon
  async function handleInviteAccepted() {
    await fetchRooms();
    await fetchInviteCount();
  }

  useEffect(() => {
    fetchInviteCount();
  }, []);

  useEffect(() => {
    if (!openInvitesModal) fetchInviteCount();
  }, [openInvitesModal]);

  // 👇 ÖNCE AUTH KONTROLÜ
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (!data.user) {
          router.replace("/login");
          return;
        }

        // Kullanıcı varsa odaları çek
        await fetchRooms();
      } catch (err) {
        console.error("Auth check error:", err);
        router.replace("/login");
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleCreateRoom(e: any) {
    e.preventDefault();
    if (!roomName.trim()) return;

    const res = await fetch("/api/rooms/create", {
      method: "POST",
      body: JSON.stringify({ name: roomName }),
    });

    const data = await res.json();

    if (res.ok) {
      setRooms([data.room, ...rooms]);
      setOpenModal(false);
      setRoomName("");
    }
  }
  async function handleDeleteRoom(id: string) {
    if (!confirm("Are you sure you want to delete this room?")) return;

    const res = await fetch(`/api/rooms/delete?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert(data.error || "Error deleting room");
    }
  }


  // 🔄 Auth kontrolü bitene kadar basit loading göster
  if (authChecking) {
    return (
      <main className="min-h-screen bg-gray-50">
        <h1>yükleniyor</h1>
        <div className="pt-32 text-center text-gray-600">Checking access...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar can be added here if needed */}
      <div className="pt-28 max-w-6xl mx-auto px-6">
        {/* PAGE TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-3xl font-bold text-gray-900 mb-1"
        >
          Your Workspaces
        </motion.h1>

        <p className="text-gray-600 mb-6">
          Manage rooms, collaborate and organize your workflow.
        </p>

        <div className="flex gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm"
          >
            + Create Room
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenInvitesModal(true)}
            className="relative px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
            </svg>
            Incoming Invites
            {inviteCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-bounce">
                {inviteCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* ROOM CARDS GRID */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <p className="text-gray-500 text-lg">Loading rooms...</p>
          )}

          {!loading && rooms.length === 0 && (
            <p className="text-gray-500 text-lg">No rooms yet.</p>
          )}

          {!loading &&
            rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => (window.location.href = `/room/${room.id}`)}
                className="cursor-pointer bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all relative"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {room.name}
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  Created {new Date(room.createdAt).toLocaleDateString()}
                </p>

                {/* Delete button always visible, positioned top right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRoom(room.id);
                  }}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 absolute top-3 right-3"
                >
                  Delete
                </button>

                <div className="mt-3 text-blue-600 font-medium hover:underline">
                  Open →
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* CREATE ROOM MODAL */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
            >
              <h2 className="text-2xl font-semibold text-gray-900">
                Create New Room
              </h2>

              <form onSubmit={handleCreateRoom} className="mt-4 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Room name"
                  className="border border-gray-300 px-4 py-2 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INCOMING INVITES MODAL */}
      <IncomingInvitesModal 
        open={openInvitesModal} 
        onClose={() => setOpenInvitesModal(false)} 
        onInviteAccepted={handleInviteAccepted}
      />
    </main>
  );
}
