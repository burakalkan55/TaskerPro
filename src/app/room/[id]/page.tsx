"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import InviteModal from "@/components/InviteModal";


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

  // CREATE MODAL
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // EDIT MODAL
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState<Status>("todo");

  // DELETE MODAL
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const statuses: Status[] = ["todo", "doing", "done"];

  const columns: Record<Status, Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    doing: tasks.filter((t) => t.status === "doing"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const [inviteOpen, setInviteOpen] = useState(false);
  

  // ---- FETCH TASKS ----
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

  // ---- CREATE TASK ----
  async function handleCreateTask(e: FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("/api/tasks/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), roomId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error || "Create failed");
        return;
      }

      // optimistic
      setTasks((prev) => [...prev, data.task]);
      setNewTitle("");
      setCreateOpen(false);
    } catch (err) {
      console.error("createTask error:", err);
    }
  }

  // ---- OPEN EDIT MODAL ----
  function openEditModal(task: Task) {
    setEditTask(task);
    setEditTitle(task.title);
    setEditStatus(task.status);
  }

  // ---- UPDATE TASK ----
  async function handleUpdateTask() {
    if (!editTask) return;
    if (!editTitle.trim()) return;

    try {
      const res = await fetch("/api/tasks/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editTask.id,
          title: editTitle.trim(),
          status: editStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Update failed");
        return;
      }

      // local state güncelle
      setTasks((prev) =>
        prev.map((t) => (t.id === data.task.id ? data.task : t))
      );

      setEditTask(null);
    } catch (err) {
      console.error("updateTask error:", err);
    }
  }

  // ---- OPEN DELETE MODAL ----
  function openDeleteModal(id: string) {
    setDeleteId(id);
  }

  // ---- DELETE TASK ----
  async function handleDeleteTask() {
    if (!deleteId) return;

    try {
      const res = await fetch("/api/tasks/delete", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Delete failed");
        return;
      }

      setTasks((prev) => prev.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("deleteTask error:", err);
    }
  }

  // ---- DRAG AND DROP HANDLER ----
  async function handleTaskStatusChange(taskId: string, newStatus: Status) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    // API call to persist change
    try {
      const res = await fetch("/api/tasks/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          title: task.title,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Update failed");
        // Revert on error
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
        );
      }
    } catch (err) {
      console.error("updateTask error:", err);
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">


     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

  {/* HEADER */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

    {/* LEFT SIDE: TITLE */}
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
        Room Board
      </h1>
      <p className="text-slate-500 text-sm sm:text-base mt-1">
        Organize your work in To-do, Doing and Done columns.
      </p>
    </div>

    {/* RIGHT SIDE BUTTONS */}
    <div className="flex items-center gap-3">

      {/* INVITE BUTTON */}
      <button
        onClick={() => setInviteOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                   bg-purple-600 text-white text-sm font-medium shadow-sm 
                   hover:bg-purple-700 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Invite
      </button>

      {/* ADD TASK BUTTON */}
      <button
        onClick={() => setCreateOpen(true)}
        className="inline-flex items-center px-4 sm:px-5 py-2.5 
                   bg-blue-600 text-white text-sm font-medium 
                   rounded-lg shadow-sm hover:bg-blue-700 transition"
      >
        + Add Task
      </button>

    </div>
  </div>

        {/* BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {(statuses as readonly Status[]).map((status) => (
            <section
              key={status}
              onDragOver={(e: any) => {
                e.preventDefault();
                e.dataTransfer!.dropEffect = "move";
              }}
              onDrop={(e: any) => {
                e.preventDefault();
                const taskId = e.dataTransfer?.getData("taskId");
                if (taskId) {
                  handleTaskStatusChange(taskId, status);
                }
              }}
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
                    draggable
                    onDragStart={(e: any) => {
                      e.dataTransfer?.setData("taskId", task.id);
                      e.dataTransfer!.effectAllowed = "move";
                    }}
                    onDragOver={(e: any) => {
                      e.preventDefault();
                      e.dataTransfer!.dropEffect = "move";
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between cursor-grab active:cursor-grabbing"
                  >
                    <span className="truncate">{task.title}</span>

                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <button
                        onClick={() => openEditModal(task)}
                        className="text-[11px] px-2 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(task.id)}
                        className="text-[11px] px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      <AnimatePresence>
        {createOpen && (
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
                    onClick={() => setCreateOpen(false)}
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

      {/* EDIT TASK MODAL */}
      <AnimatePresence>
        {editTask && (
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
                Edit Task
              </h2>

              <div className="space-y-4">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Task title..."
                />

                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Status)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="todo">To-do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditTask(null)}
                    className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateTask}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE TASK MODAL */}
      <AnimatePresence>
        {deleteId && (
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
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Delete Task?
              </h2>
              <p className="text-sm text-slate-600 mb-5">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteTask}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
