"use client";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import NotificationBell from "./NotificationBell";

export default function DashboardTopbar({ user, profile, onMenuToggle, signOut }) {
  const { t: translate } = useLanguage();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.avatar_url;
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0];

  return (
    <header className="fixed top-0 end-0 start-0 lg:start-64 z-20 bg-white/95 backdrop-blur-md border-b border-beige-200 px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Mobile menu + Page title area */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-charcoal-400 hover:bg-beige-100 transition-colors"
            aria-label={translate("Open menu")}
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="text-xs text-charcoal-200 font-medium"><T>
              Assalamu Alaikum 👋
            </T></p>
            <p className="text-sm font-semibold text-charcoal-600 truncate max-w-[200px] sm:max-w-none">
              {fullName}
            </p>
          </div>
        </div>

        {/* Right: Notifications + User menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher compact />
          {/* Notification Bell */}
          <NotificationBell userId={user?.id} />

          {/* User Avatar Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl border border-beige-200 hover:bg-beige-50 transition-all"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-gold text-white flex items-center justify-center text-xs font-bold">
                  {fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <ChevronDown
                size={14}
                className={`text-charcoal-300 transition-transform hidden sm:block ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute end-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card-hover border border-beige-200 py-2 z-50 animate-slide-down">
                <div className="px-4 py-3 border-b border-beige-100">
                  <p className="text-xs text-charcoal-300"><T>Signed in as</T></p>
                  <p className="text-sm font-semibold text-charcoal-600 truncate">{fullName}</p>
                  <p className="text-xs text-charcoal-400 truncate">{user?.email}</p>
                </div>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal-400 hover:bg-beige-50 transition-colors"
                >
                  <Settings size={16} /><T>
                  Profile Settings
                </T></Link>

                <div className="border-t border-beige-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-start"
                  >
                    <LogOut size={16} /><T>
                    Sign Out
                  </T></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
