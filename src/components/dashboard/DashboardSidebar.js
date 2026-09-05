"use client";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV_LINKS } from "@/lib/constants";
import BrandLogo from "@/components/ui/BrandLogo";
import {
  LayoutDashboard,
  CircleDot,
  Plus,
  Link as LinkIcon,
  Bell,
  MessageSquare,
  UserCircle,
  LogOut,
  X,
  Shield,
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

export default function DashboardSidebar({ isOpen, onClose, user, profile, isAdmin }) {
  const { t: translate } = useLanguage();
  const pathname = usePathname();
  const hasCircle = !!profile?.current_masjid_id;

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  // Filter nav links based on circle status
  const filteredLinks = DASHBOARD_NAV_LINKS.filter((link) => {
    if (link.requiresCircle && !hasCircle) return false;
    if (link.hideIfCircle && hasCircle) return false;
    return true;
  });

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.avatar_url;
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0];

  return (
    <aside
      className={`fixed top-0 start-0 h-full w-64 bg-charcoal-600 text-white z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? "translate-x-0" : "invisible lg:visible -translate-x-full rtl:translate-x-full"
      } lg:translate-x-0 lg:rtl:translate-x-0`}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
          <div>
            <BrandLogo className="w-32" eager />
            <span className="block mt-2 text-[10px] text-white/40 font-medium tracking-wider uppercase"><T>Dashboard</T></span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60"
          aria-label={translate("Close sidebar")}
        >
          <X size={18} />
        </button>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-gold/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-white text-sm font-bold ring-2 ring-gold/30">
              {fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{fullName}</p>
            <p className="text-[11px] text-white/40 truncate">{user?.email}</p>
          </div>
        </div>
        {hasCircle && (
          <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-islamic-green/20 border border-islamic-green/30">
            <p className="text-[10px] text-islamic-green-light font-medium uppercase tracking-wider"><T>Active Circle</T></p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {filteredLinks.map((link) => {
            const Icon = iconMap[link.icon] || LayoutDashboard;
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gold/20 text-gold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} className={active ? "text-gold" : ""} />
                <T>{link.label}</T>
                {link.icon === "Bell" && (
                  <span className="ms-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center notification-badge" id="sidebar-notification-count" style={{ display: "none" }}>
                    0
                  </span>
                )}
              </Link>
            );
          })}
        </div>

      </nav>

      {/* Back to Site */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <LayoutDashboard size={18} /><T>
          Back to Website
        </T></Link>
      </div>
    </aside>
  );
}
