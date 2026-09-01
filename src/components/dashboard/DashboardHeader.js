"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV_LINKS, SITE_NAME } from "@/lib/constants";
import NotificationBell from "./NotificationBell";
import {
  LayoutDashboard,
  CircleDot,
  Plus,
  Link as LinkIcon,
  Bell,
  MessageSquare,
  UserCircle,
  LogOut,
  ChevronDown,
  Globe,
  Settings,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  CircleDot,
  Plus,
  Link: LinkIcon,
  Bell,
  MessageSquare,
  UserCircle,
};

export default function DashboardHeader({ user, profile, signOut }) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hasCircle = !!profile?.current_masjid_id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const filteredLinks = DASHBOARD_NAV_LINKS.filter((link) => {
    if (link.requiresCircle && !hasCircle) return false;
    if (link.hideIfCircle && hasCircle) return false;
    return true;
  });

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.avatar_url;
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-beige-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white font-heading font-bold text-lg">T</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-base text-charcoal-600 block leading-none">
                  {SITE_NAME}
                </span>
                <span className="text-[10px] text-gold font-bold tracking-widest uppercase block mt-1">
                  User Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Horizontal Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {filteredLinks.map((link) => {
              const Icon = iconMap[link.icon] || LayoutDashboard;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-gold/15 text-gold font-semibold shadow-sm"
                      : "text-charcoal-400 hover:text-charcoal-600 hover:bg-beige-100"
                  }`}
                >
                  <Icon size={16} className={active ? "text-gold" : "text-charcoal-300"} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Notification Bell, Exit Site Button, User Avatar */}
          <div className="flex items-center gap-3">
            {/* Realtime Notification Bell */}
            <NotificationBell userId={user?.id} />

            {/* Visit Public Site */}
            <Link
              href="/"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-beige-300 hover:border-gold text-xs text-charcoal-400 hover:text-gold transition-all"
              title="Return to Public Website"
            >
              <Globe size={14} />
              <span>Website</span>
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-beige-200 hover:bg-beige-50 transition-all"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gold/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-gold text-white flex items-center justify-center text-xs font-bold ring-2 ring-gold/30">
                    {fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-xs font-medium text-charcoal-600 max-w-[100px] truncate hidden sm:inline-block">
                  {fullName}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-charcoal-300 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card-hover border border-beige-200 py-2 z-50 animate-slide-down">
                  <div className="px-4 py-3 border-b border-beige-100">
                    <p className="text-xs text-charcoal-300">Signed in as</p>
                    <p className="text-sm font-semibold text-charcoal-600 truncate">{fullName}</p>
                    <p className="text-xs text-charcoal-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal-400 hover:bg-beige-50 transition-colors"
                  >
                    <Settings size={16} />
                    Profile Settings
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal-400 hover:bg-beige-50 transition-colors"
                  >
                    <Globe size={16} />
                    Back to Public Website
                  </Link>

                  <div className="border-t border-beige-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scrollable Nav */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-beige-100 scrollbar-none">
          {filteredLinks.map((link) => {
            const Icon = iconMap[link.icon] || LayoutDashboard;
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                  active
                    ? "bg-gold/15 text-gold font-semibold"
                    : "text-charcoal-400 bg-beige-50 hover:bg-beige-100"
                }`}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
