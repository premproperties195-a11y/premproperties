"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { fetchCompanyData } from "../lib/data";

export default function Header({ nav }: { nav?: any[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [member, setMember] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = window.localStorage.getItem("theme");
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCompanyData();
      setCompany(data);
    };
    loadData();

    const fetchMember = async () => {
      try {
        const res = await fetch("/api/member/session");
        const data = await res.json();
        if (data.authenticated) setMember(data);
      } catch (e) { }
    };
    fetchMember();

    const syncThemeFromStorage = () => {
      const savedTheme = window.localStorage.getItem("theme");
      const nextTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
      setTheme(nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
      document.documentElement.style.colorScheme = nextTheme;
    };

    syncThemeFromStorage();
    window.addEventListener("storage", syncThemeFromStorage);
    return () => window.removeEventListener("storage", syncThemeFromStorage);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    await fetch("/api/member/logout", { method: "POST" });
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = nav || company?.navigation || [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Properties", href: "/properties" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  const logoUrl = company?.appearance?.logo || "/logo.png";
  const logoHeight = company?.appearance?.logoHeight || "80";

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const isDarkTheme = theme === "dark";
  const themeToggleLabel = isDarkTheme ? "Light Mode" : "Dark Mode";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white py-4 shadow-sm" : "bg-transparent py-4 sm:py-5 md:py-6"
        }`}
    >
      <div className="container-shell flex items-center justify-between gap-3">
        {/* LOGO */}
        <Link href="/" className="group relative z-50 shrink-0">
          <img
            src={logoUrl}
            alt={company?.company?.name || "PREM Properties"}
            style={{ height: `${logoHeight}px` }}
            className="w-auto max-h-[48px] sm:max-h-[56px] md:max-h-[72px] object-contain"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item, i) => (
            <Link
              key={i}
              href={item.href?.endsWith("/") ? item.href : `${item.href}/`}
              className={`text-sm uppercase font-bold tracking-wide transition-colors ${scrolled ? "text-gray-600 hover:text-black" : "text-white/90 hover:text-white"
                }`}
            >
              {item.label}
            </Link>
          ))}
          {member ? (
            <div className="flex items-center gap-4">
              <span className={`text-xs font-bold uppercase tracking-widest ${scrolled ? "text-gray-400" : "text-white/60"}`}>Member: {member.name || member.email}</span>
              <button
                onClick={handleLogout}
                className={`text-xs uppercase font-bold tracking-wide transition-colors ${scrolled ? "text-red-500 hover:text-red-700" : "text-red-400 hover:text-red-300"}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login/"
              className={`text-sm uppercase font-bold tracking-wide transition-colors ${scrolled ? "text-gray-600 hover:text-black" : "text-white/90 hover:text-white"}`}
            >
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDarkTheme}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
              scrolled
                ? "border-gray-300 bg-white/80 text-gray-700 hover:text-black"
                : "border-white/20 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <span>{isDarkTheme ? "☀" : "☾"}</span>
            <span>{themeToggleLabel}</span>
          </button>

          <Link href="/contact/" className="px-5 py-2 bg-[var(--primary)] text-white text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors rounded-sm shadow-md">
            Enquire
          </Link>
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          className={`md:hidden relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/10 backdrop-blur-sm focus:outline-none ${scrolled ? "border-black/10 bg-white/80 text-black" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 transition-transform ${scrolled || mobileMenuOpen ? "bg-black" : "bg-white"} ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 transition-opacity ${scrolled || mobileMenuOpen ? "bg-black" : "bg-white"} ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 transition-transform ${scrolled || mobileMenuOpen ? "bg-black" : "bg-white"} ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center space-y-6 bg-white px-6 text-black md:hidden"
          >
            <div className="flex w-full max-w-sm flex-col items-center space-y-6">
              {navLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.href?.endsWith("/") ? item.href : `${item.href}/`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-sans font-bold hover:text-[var(--primary)] uppercase tracking-widest"
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-gray-100 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black"
              >
                <span>{isDarkTheme ? "☀" : "☾"}</span>
                <span>{themeToggleLabel}</span>
              </button>
              <Link
                href="/contact/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-8 py-3 bg-[var(--primary)] text-white text-base font-bold uppercase tracking-wider hover:bg-black transition-colors rounded-sm shadow-md"
              >
                Enquire
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
