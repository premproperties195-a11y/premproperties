"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
<<<<<<< HEAD
import { fetchCompanyData } from "../lib/data";
=======
import companyData from "../data/company.json";
>>>>>>> 5355a49 (first commit)

export default function Header({ nav }: { nav?: any[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [member, setMember] = useState<any>(null);
<<<<<<< HEAD
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCompanyData();
      setCompany(data);
    };
    loadData();

=======

  useEffect(() => {
>>>>>>> 5355a49 (first commit)
    const fetchMember = async () => {
      try {
        const res = await fetch("/api/member/session");
        const data = await res.json();
        if (data.authenticated) setMember(data);
      } catch (e) { }
    };
    fetchMember();
  }, []);

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

<<<<<<< HEAD
  const navLinks = nav || company?.navigation || [
=======
  const navLinks = nav || companyData.navigation || [
>>>>>>> 5355a49 (first commit)
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Properties", href: "/properties" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

<<<<<<< HEAD
  const logoUrl = company?.appearance?.logo || "/logo.png";
  const logoHeight = company?.appearance?.logoHeight || "80";

=======
>>>>>>> 5355a49 (first commit)
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white py-4 shadow-sm" : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="group relative z-50">
          <img
<<<<<<< HEAD
            src={logoUrl}
            alt={company?.company?.name || "PREM Properties"}
            style={{ height: `${logoHeight}px` }}
            className="w-auto object-contain"
=======
            src="/logo.png"
            alt="PREM Properties"
            className="h-20 w-auto object-contain"
>>>>>>> 5355a49 (first commit)
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

          <Link href="/contact/" className="px-6 py-2 bg-[var(--primary)] text-white text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors rounded-sm shadow-md">
            Enquire
          </Link>
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          className={`md:hidden relative z-50 focus:outline-none ${scrolled ? "text-black" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 md:hidden text-black"
          >
            {navLinks.map((item, i) => (
              <Link
                key={i}
                href={item.href?.endsWith("/") ? item.href : `${item.href}/`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-sans font-bold hover:text-[var(--primary)] uppercase tracking-widest"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-8 py-3 bg-[var(--primary)] text-white text-lg font-bold uppercase tracking-wider hover:bg-black transition-colors rounded-sm shadow-md"
            >
              Enquire
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
