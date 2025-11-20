"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // SCROLL EFFECT
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GET USER
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        setUser(data.user || null);
      } catch {}
    }
    fetchMe();
  }, []);

  const closeMenu = () => setIsOpen(false);
  const isDashboard = pathname.startsWith("/dashboard");

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    window.location.href = "/login";
  }

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm"
    >
      <nav
        className={`max-w-7xl mx-auto flex items-center justify-between px-5 transition-all duration-300 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Logo size={isScrolled ? 22 : 30} />
          <span
            className={`font-bold tracking-tight text-gray-900 transition-all ${
              isScrolled ? "text-lg" : "text-2xl"
            }`}
          >
            Tasker<span className="text-blue-600">Pro</span>
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-8 text-gray-700">
          {!isDashboard && (
            <>
              <Link
                href="/"
                className="hover:text-blue-600 transition font-medium"
              >
                Home
              </Link>
              <a
                href="#features"
                className="hover:text-blue-600 transition font-medium"
              >
                Features
              </a>
              <a
                href="#why"
                className="hover:text-blue-600 transition font-medium"
              >
                Why Us
              </a>
            </>
          )}

          {isDashboard && (
            <Link
              href="/"
              className="hover:text-blue-600 transition font-medium"
            >
              Home
            </Link>
          )}
        </div>

        {/* DESKTOP ACTION BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            !isDashboard && (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )
          ) : (
            <div className="flex items-center gap-4">
              {/* PROFILE DROPDOWN */}
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user.name || "Profile"}
                </span>
              </Link>

              {/* DASHBOARD */}
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Dashboard
              </Link>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium shadow hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden p-2 rounded-lg border border-gray-300 text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white/95 border-t border-gray-200">
          <div className="flex flex-col gap-3 px-5 py-4">

            {/* LINKS */}
            {!isDashboard ? (
              <>
                <Link href="/" onClick={closeMenu} className="py-2 font-medium">
                  Home
                </Link>
                <a href="#features" onClick={closeMenu} className="py-2 font-medium">
                  Features
                </a>
                <a href="#why" onClick={closeMenu} className="py-2 font-medium">
                  Why Us
                </a>
              </>
            ) : (
              <>
                <Link href="/" onClick={closeMenu} className="py-2 font-medium">
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="py-2 font-medium"
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* AUTH BUTTONS */}
            <div className="mt-3 flex flex-col gap-2">
              {!user ? (
                !isDashboard && (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="w-full text-center px-4 py-2 border rounded-md font-medium"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium shadow"
                    >
                      Register
                    </Link>
                  </>
                )
              ) : (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md"
                  >
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span>{user.name}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md font-medium shadow"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
