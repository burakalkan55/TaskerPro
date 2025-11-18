"use client";

import Link from "next/link";
import { motion } from "@/components/motion";
import HeroIllustration from "@/components/HeroIllustration";

export default function Home() {
  return (
    <main className="pt-32 pb-20">

      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto flex flex-col items-center text-center px-6">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl"
        >
          Smart Task Management <br />
          for <span className="text-blue-600">Professional Teams</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-gray-600 text-lg mt-6 max-w-2xl"
        >
          TaskerPro is a clean, corporate and minimal task management platform.
          Create rooms, invite teammates, assign tasks and track progress seamlessly.
        </motion.p>

        <motion.div
          className="mt-10 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-200 transition"
          >
            Login
          </Link>
        </motion.div>

        {/* HERO ILLUSTRATION */}
        <HeroIllustration />
      </section>



      {/* --- FEATURES SECTION (scroll smooth reveal) --- */}
      <motion.section
        id="features"
        className="max-w-7xl mx-auto mt-32 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }} 
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-center mb-10">Core Features</h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* CARD */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-3">Task Rooms</h3>
            <p className="text-gray-600">
              Organize your tasks into dedicated rooms and keep your workflow clean.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-3">Team Invitations</h3>
            <p className="text-gray-600">
              Invite members to your rooms, manage approvals and collaborate.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-3">Assign & Track Tasks</h3>
            <p className="text-gray-600">
              Drag tasks between columns like To-Do → Doing → Done.
            </p>
          </motion.div>

        </div>
      </motion.section>



      {/* --- WHY SECTION (scroll smooth reveal) --- */}
      <motion.section
        id="why"
        className="max-w-7xl mx-auto mt-32 px-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold mb-6">Why TaskerPro?</h2>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg">
          Unlike noisy and chaotic dashboards, TaskerPro is built for sharp, 
          clean and focused collaboration. Everything feels predictable, 
          minimal and ideal for corporate workflows.
        </p>
      </motion.section>

    </main>
  );
}
