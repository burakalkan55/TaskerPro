"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("/api/rooms/list");
        const data = await res.json();
        setRooms(data.rooms || []);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
      setLoading(false);
    }

    fetchRooms();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      
     

      <div className="pt-28 max-w-6xl mx-auto px-6">

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold text-gray-900"
        >
          Dashboard
        </motion.h1>

        <p className="text-gray-600 mt-2 mb-6">
          Manage your rooms and collaborate efficiently.
        </p>

        {/* CREATE ROOM */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8 px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          + Create Room
        </motion.button>

        {/* ROOMS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {loading && <p className="text-gray-500">Loading rooms...</p>}

          {!loading && rooms.length === 0 && (
            <p className="text-gray-500">You have no rooms yet.</p>
          )}

          {!loading &&
            rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="p-5 bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition cursor-pointer"
                onClick={() => (window.location.href = `/room/${room.id}`)}
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {room.name}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Created: {new Date(room.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
        </div>
      </div>
    </main>
  );
}
