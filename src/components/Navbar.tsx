"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "@/components/motion";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#why", label: "Why Us" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200"
    >
      <nav
        className={`max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 transition-[padding] duration-300 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        {/* LOGO + TEXT */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={closeMenu}
        >
          <Logo size={isScrolled ? 24 : 30} />
          <span
            className={`font-bold tracking-tight text-gray-900 transition-[font-size] duration-300 ${
              isScrolled ? "text-xl" : "text-2xl"
            }`}
          >
            Tasker<span className="text-blue-600">Pro</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`hover:text-blue-600 transition ${
                pathname === link.href ? "text-blue-600" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex gap-3">
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
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-gray-300 text-gray-700"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? (
            // X icon
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95">
          <div className="max-w-7xl mx-auto flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="py-2 text-gray-700 hover:text-blue-600 transition"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={closeMenu}
                className="w-full text-center px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
