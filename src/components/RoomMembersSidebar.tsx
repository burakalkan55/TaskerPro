"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function RoomMembersSidebar({ roomId }: { roomId: string }) {
  const [members, setMembers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  async function fetchMembers() {
    const res = await fetch(`/api/rooms/members?roomId=${roomId}`);
    const data = await res.json();
    setMembers(data.members || []);
  }

  useEffect(() => {
    fetchMembers();
  }, [roomId]);

  return (
    <aside
      className={`
        fixed right-0 top-20 h-[calc(100vh-5rem)] w-64 bg-white shadow-xl 
        border-l border-gray-200 px-4 py-5 transition-all
        ${open ? "translate-x-0" : "translate-x-64"}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute left-[-34px] top-6 bg-white shadow-md px-2 py-1 rounded-l-lg border"
      >
        {open ? "→" : "←"}
      </button>

      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Room Members
      </h2>

      <div className="space-y-3 overflow-auto h-full pr-2">
        {members.length === 0 && (
          <p className="text-sm text-gray-500">No members yet.</p>
        )}

        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border hover:bg-gray-100"
          >
            <Image
              src={m.user.avatar || "/default-avatar.png"}
              width={36}
              height={36}
              alt={m.user.name}
              className="rounded-full border"
            />

            <div className="flex flex-col">
              <span className="text-sm font-medium">{m.user.name}</span>
              <span className="text-xs text-gray-500">{m.user.email}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
