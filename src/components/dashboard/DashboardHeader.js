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
  Lock,
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

export default function DashboardHeader({ user, profile, signOut, isProfileComplete }) {
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
      {/* Tier 1: Main Header Bar (Brand + Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-beige-100">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Title */}
          <Link
            href={isProfileComplete ? "/dashboard" : "/dashboard/profile?setup=required"}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-heading font-bold text-base">T</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base text-charcoal-600">
                {SITE_NAME}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-gold bg-gold/10 rounded-full uppercase tracking-wider">
                User Dashboard
              </span>
            </div>
          </Link>

          {/* Right User Actions */}
          <div className="flex items-center gap-3">
            {/* Realtime Notification Bell */}
            <NotificationBell userId={user?.id} />

            {/* Visit Public Site */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-beige-300 hover:border-gold text-xs text-charcoal-400 hover:text-gold transition-all"
              title="Return to Public Website"
            >
              <Globe size={14} />
              <span className="hidden sm:inline">Website</span>
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-full border border-beige-200 hover:bg-beige-50 transition-all"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-gold/30"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-gold text-white flex items-center justify-center text-xs font-bold ring-2 ring-gold/30">
                    {fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-xs font-medium text-charcoal-600 max-w-[120px] truncate hidden sm:inline-block">
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
      </div>

      {/* Tier 2: Dedicated Navigation Tab Bar (Single Line, No Text Wrapping) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          {filteredLinks.map((link) => {
            const Icon = iconMap[link.icon] || LayoutDashboard;
            const active = isActive(link.href);
            const isLocked = !isProfileComplete && link.href !== "/dashboard/profile";

            if (isLocked) {
              return (
                <span
                  key={link.href}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-charcoal-300 bg-beige-50 opacity-60 cursor-not-allowed whitespace-nowrap shrink-0"
                  title="Complete profile setup to unlock"
                >
                  <Lock size={14} className="text-amber-500 shrink-0" />
                  <span className="whitespace-nowrap">{link.label}</span>
                </span>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-gold/15 text-gold font-semibold shadow-sm"
                    : "text-charcoal-400 hover:text-charcoal-600 hover:bg-beige-100"
                }`}
              >
                <Icon size={16} className={`shrink-0 ${active ? "text-gold" : "text-charcoal-300"}`} />
                <span className="whitespace-nowrap">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
