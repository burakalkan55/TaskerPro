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

  // SCROLL SHRINK EFFECT
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GET USER FROM /api/me
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        setUser(data.user || null);
      } catch (_) {}
    }
    fetchUser();
  }, []);

  const isDashboard = pathname.startsWith("/dashboard");

  const closeMenu = () => setIsOpen(false);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    window.location.href = "/login";
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200"
    >
      <nav
        className={`max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        {/* LOGO */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
          <Logo size={isScrolled ? 24 : 30} />
          <span
            className={`font-bold text-gray-900 transition-all ${
              isScrolled ? "text-xl" : "text-2xl"
            }`}
          >
            Tasker<span className="text-blue-600">Pro</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-gray-700">

          {/* DASHBOARD MENUS */}
          {isDashboard ? (
            <>
              <Link href="/" className="hover:text-blue-600 transition">
                Home
              </Link>
              
            </>
          ) : (
            /* LANDING PAGE MENUS */
            <>
              <Link href="/" className="hover:text-blue-600 transition">
                Home
              </Link>
              <a href="#features" className="hover:text-blue-600 transition">
                Features
              </a>
              <a href="#why" className="hover:text-blue-600 transition">
                Why Us
              </a>
            </>
          )}
        </div>

        {/* DESKTOP RIGHT BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            !isDashboard && (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )
          ) : (
            <>
              {/* DASHBOARD BUTTON */}
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>

              {/* LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden p-2 rounded-md border border-gray-300 text-gray-700"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
           <svg
  className="h-6 w-6 text-gray-800"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
>
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
</svg>

          ) : (
            <svg
  className="h-6 w-6 text-gray-800"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
>
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
</svg>

          )}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95">
          <div className="max-w-7xl mx-auto flex flex-col gap-2 px-4 py-4">

            {/* MOBILE LINKS */}
            {isDashboard ? (
              <>
                <Link href="/" onClick={closeMenu} className="py-2">
                  Home
                </Link>
                <Link href="/dashboard" onClick={closeMenu} className="py-2">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/" onClick={closeMenu} className="py-2">
                  Home
                </Link>
                <a href="#features" onClick={closeMenu} className="py-2">
                  Features
                </a>
                <a href="#why" onClick={closeMenu} className="py-2">
                  Why Us
                </a>
              </>
            )}

            {/* MOBILE AUTH BUTTONS */}
            <div className="mt-3 flex flex-col gap-2">
              {!user ? (
                !isDashboard && (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="w-full text-center px-4 py-2 border rounded-md"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Register
                    </Link>
                  </>
                )
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="w-full text-center px-4 py-2 border rounded-md"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-center px-4 py-2 bg-red-600 text-white rounded-md"
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
