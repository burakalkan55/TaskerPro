"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

type ColumnStatus = "todo" | "doing" | "done";

export default function RoomPage({ params }: any) {
  const { id: roomId } = params;
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [authChecking, setAuthChecking] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newTask, setNewTask] = useState("");

  const statuses: ColumnStatus[] = ["todo", "doing", "done"];

  async function fetchTasks() {
    try {
      const res = await fetch(`/api/tasks/list/${roomId}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (e) {
      console.error("Fetch tasks error:", e);
    }
  }

  // ✔ Auth kontrolü + tasks fetch
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (!data.user) return router.replace("/login");

        await fetchTasks();
      } catch (e) {
        router.replace("/login");
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  // ✔ Task oluşturma
  async function createTask(e: any) {
    e.preventDefault();
    if (!newTask.trim()) return;

    const res = await fetch("/api/tasks/create", {
      method: "POST",
      body: JSON.stringify({ title: newTask, roomId }),
    });

    const data = await res.json();

    if (res.ok) {
      setTasks([...tasks, data.task]);
      setNewTask("");
      setOpenModal(false);
    }
  }

  // ✔ Task status güncelleme
  async function updateTask(taskId: string, status: ColumnStatus) {
    const res = await fetch("/api/tasks/update", {
      method: "POST",
      body: JSON.stringify({ taskId, status }),
    });

    if (res.ok) fetchTasks();
  }

  // ✔ columns tipli şekilde oluştur
  const columns: Record<ColumnStatus, any[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    doing: tasks.filter((t) => t.status === "doing"),
    done: tasks.filter((t) => t.status === "done"),
  };

  if (authChecking)
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 text-center text-gray-600">Checking access...</div>
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-50">
     

      <div className="pt-28 max-w-7xl mx-auto px-6">
        {/* PAGE HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Room Board</h1>

          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            + Add Task
          </button>
        </div>

        {/* TRELLO STYLE COLUMNS */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {statuses.map((status) => (
            <div key={status} className="bg-white p-4 rounded-xl border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 capitalize text-gray-900">
                {status}
              </h2>

              <div className="flex flex-col gap-3">
                {columns[status]?.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-100 p-3 rounded-lg border hover:bg-gray-200 transition"
                  >
                    <p className="font-medium">{task.title}</p>

                    {/* STATUS BUTTONS */}
                    <div className="flex gap-2 mt-2">
                      {status !== "todo" && (
                        <button
                          onClick={() => updateTask(task.id, "todo")}
                          className="text-xs px-2 py-1 bg-gray-300 rounded"
                        >
                          To-Do
                        </button>
                      )}

                      {status !== "doing" && (
                        <button
                          onClick={() => updateTask(task.id, "doing")}
                          className="text-xs px-2 py-1 bg-yellow-400 rounded"
                        >
                          Doing
                        </button>
                      )}

                      {status !== "done" && (
                        <button
                          onClick={() => updateTask(task.id, "done")}
                          className="text-xs px-2 py-1 bg-green-500 text-white rounded"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
            >
              <h2 className="text-2xl font-semibold">Add Task</h2>

              <form onSubmit={createTask} className="mt-4 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Task title"
                  className="border border-gray-300 px-4 py-2 rounded-md"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Add
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
