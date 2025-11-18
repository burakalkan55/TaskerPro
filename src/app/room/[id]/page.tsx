"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";


type Status = "todo" | "doing" | "done";

interface Task {
  id: string;
  title: string;
  status: Status;
}

export default function RoomBoardPage() {
  const params = useParams();
  const roomId = params.id as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const statuses: Status[] = ["todo", "doing", "done"];

  const columns: Record<Status, Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    doing: tasks.filter((t) => t.status === "doing"),
    done: tasks.filter((t) => t.status === "done"),
  };

  async function fetchTasks() {
    if (!roomId) return;

    try {
      const res = await fetch(`/api/tasks/list?roomId=${roomId}`, {
        credentials: "include",
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("fetchTasks error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("/api/tasks/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, roomId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error || "create error");
        return;
      }

      // Hızlı hissetmesi için local state’e ekle
      setTasks((prev) => [...prev, data.task]);
      setNewTitle("");
      setModalOpen(false);
    } catch (err) {
      console.error("createTask error:", err);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Room Board
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Organize your work in To-do, Doing and Done columns.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center px-4 sm:px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition"
          >
            + Add Task
          </button>
        </div>

        {/* BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {(statuses as readonly Status[]).map((status) => (
            <section
              key={status}
              className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm flex flex-col max-h-[60vh] sm:max-h-[65vh]"
            >
              {/* COLUMN HEADER */}
              <header className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 capitalize">
                  {status === "todo"
                    ? "To-do"
                    : status === "doing"
                    ? "Doing"
                    : "Done"}
                </h2>
                <span className="text-xs rounded-full bg-slate-100 text-slate-500 px-2 py-0.5">
                  {columns[status].length}
                </span>
              </header>

              {/* TASK LIST (SCROLLABLE) */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 custom-scroll">
                {loading && status === "todo" && (
                  <p className="text-xs text-slate-400">Loading tasks...</p>
                )}

                {!loading && columns[status].length === 0 && (
                  <p className="text-xs text-slate-300 italic">
                    No tasks in this list yet.
                  </p>
                )}

                {columns[status].map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    {task.title}
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      <AnimatePresence>
        {modalOpen && (
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
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Create Task
              </h2>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
