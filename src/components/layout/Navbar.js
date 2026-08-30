"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import MobileMenu from "./MobileMenu";
import UserMenu from "@/components/auth/UserMenu";
import { useAuth } from "@/hooks/useAuth";

const heroRoutes = [
  "/",
  "/about",
  "/discussions",
  "/discussions/pakistan",
  "/discussions/canada",
  "/pakistan",
  "/canada",
  "/resources",
  "/contact",
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(null);
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const hasDarkHero = heroRoutes.includes(pathname);
  const isSolid = scrolled || !hasDarkHero;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSolid
            ? "bg-white/95 backdrop-blur-md shadow-navbar py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="section-container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-heading font-bold text-lg">T</span>
            </div>
            <span
              className={`font-heading font-bold text-xl transition-colors ${
                isSolid ? "text-charcoal-600" : "text-white"
              }`}
            >
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative">
                {link.children ? (
                  /* Dropdown */
                  <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(link.label)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        link.children.some((c) => isActive(c.href))
                          ? "text-gold"
                          : isSolid
                          ? "text-charcoal-400 hover:text-charcoal-600 hover:bg-beige-100"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          dropdownOpen === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen === link.label && (
                      <div className="absolute top-full left-0 pt-2 animate-slide-down">
                        <div className="bg-white rounded-xl shadow-card-hover border border-beige-200 py-2 min-w-[180px]">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className={`block px-4 py-2.5 text-sm transition-colors ${
                                isActive(child.href)
                                  ? "text-gold bg-beige-50 font-medium"
                                  : "text-charcoal-400 hover:text-charcoal-600 hover:bg-beige-50"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Regular Link */
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? "text-gold"
                        : isSolid
                        ? "text-charcoal-400 hover:text-charcoal-600 hover:bg-beige-100"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Auth Button or User Menu */}
            {user ? (
              <UserMenu scrolled={isSolid} />
            ) : (
              <Link
                href="/login"
                className="ml-4 flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <LogIn size={16} />
                Sign In / Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isSolid
                ? "text-charcoal-500 hover:bg-beige-100"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
