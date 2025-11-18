"use client";

import { motion } from "@/components/motion";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.error || "Login failed");
      setLoading(false);
      return;
    }

    setMsg("Login successful! Redirecting...");

    setTimeout(() => {
      window.location.href = "/dashboard"; // veya /rooms
    }, 1500);

    setLoading(false);
  }

  return (
    <main className="flex justify-center items-start min-h-screen pt-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-xl p-7 mt-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Login
        </h1>

        {msg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center mb-4 font-medium ${
              msg.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm mb-1 block">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md mt-2 hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </motion.div>
    </main>
  );
}
