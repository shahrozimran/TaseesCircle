"use client";
import T from "@/components/i18n/T";


import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserMenu({ scrolled }) {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0];

  return (
    <div className="relative ms-2" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
          scrolled
            ? "border-beige-300 bg-beige-50 hover:bg-beige-100 text-charcoal-600"
            : "border-white/30 bg-white/10 hover:bg-white/20 text-white"
        }`}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={fullName}
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center text-xs font-bold">
            {fullName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-xs font-medium max-w-[100px] truncate hidden sm:inline-block">{fullName}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card-hover border border-beige-200 py-2 z-50 animate-slide-down">
          <div className="px-4 py-3 border-b border-beige-100">
            <p className="text-xs text-charcoal-300"><T>Signed in as</T></p>
            <p className="text-sm font-semibold text-charcoal-600 truncate">{fullName}</p>
            <p className="text-xs text-charcoal-400 truncate">{user.email}</p>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal-500 hover:bg-beige-50 transition-colors font-medium"
          >
            <LayoutDashboard size={16} className="text-gold" /><T>
            Go to Dashboard
          </T></Link>

          <Link
            href="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal-400 hover:bg-beige-50 transition-colors"
          >
            <User size={16} /><T>
            Profile Settings
          </T></Link>

          <div className="border-t border-beige-100 mt-1 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
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
  );
}
