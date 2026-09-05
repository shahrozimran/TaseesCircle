"use client";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LogIn, LayoutDashboard } from "lucide-react";
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
  const { t: translate } = useLanguage();
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

  // Hide public navbar inside dashboard or admin views to prevent double-header conflict
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const hasDarkHero = heroRoutes.includes(pathname);
  const isSolid = scrolled || !hasDarkHero;

  return (
    <>
      <nav
        className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 ${
          isSolid
            ? "bg-white/95 backdrop-blur-md shadow-navbar py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="section-container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-heading font-bold text-lg"><T>T</T></span>
            </div>
            <span
              className={`font-heading font-bold text-base xl:text-xl transition-colors ${
                isSolid ? "text-charcoal-600" : "text-white"
              }`}
            >
              <T>{SITE_NAME}</T>
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
                      className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${
                        link.children.some((c) => isActive(c.href))
                          ? "text-gold"
                          : isSolid
                          ? "text-charcoal-400 hover:text-charcoal-600 hover:bg-beige-100"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <T>{link.label}</T>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          dropdownOpen === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen === link.label && (
                      <div className="absolute top-full start-0 pt-2 animate-slide-down">
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
                              <T>{child.label}</T>
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
                    className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? "text-gold"
                        : isSolid
                        ? "text-charcoal-400 hover:text-charcoal-600 hover:bg-beige-100"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <T>{link.label}</T>
                  </Link>
                )}
              </div>
            ))}

            <LanguageSwitcher dark={!isSolid} />
            {/* Logged-in State: Dashboard Button + User Menu */}
            {user ? (
              <div className="flex items-center gap-2 ms-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-gold text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  <LayoutDashboard size={16} /><T>
                  Dashboard
                </T></Link>
                <UserMenu scrolled={isSolid} />
              </div>
            ) : (
              <Link
                href="/login"
                className="ms-4 flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <LogIn size={16} /><T>
                Sign In / Login
              </T></Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher dark={!isSolid} compact />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isSolid
                ? "text-charcoal-500 hover:bg-beige-100"
                : "text-white hover:bg-white/10"
            }`}
            aria-label={translate("Toggle menu")}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
        user={user}
      />
    </>
  );
}
