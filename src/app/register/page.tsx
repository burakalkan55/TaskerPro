"use client";

import { motion } from "@/components/motion";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = new FormData(e.target);
    const name = form.get("name");
    const email = form.get("email");
    const password = form.get("password");

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.error || "Error creating account");
      setLoading(false);
      return;
    }

    setMsg("Account created! Redirecting...");

    setTimeout(() => {
      window.location.href = "/login";
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
          Create Account
        </h1>

        {msg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center mb-4 font-medium ${
              msg.includes("Redirecting") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Full Name</label>
            <input
              name="name"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition"
              placeholder="John Doe"
            />
          </div>

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
            {loading ? "Creating..." : "Register"}
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </main>
  );
}
