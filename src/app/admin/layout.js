"use client";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import T from "@/components/i18n/T";


import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_LINKS } from "@/lib/constants";
import BrandLogo from "@/components/ui/BrandLogo";
import {
  LayoutDashboard, CheckCircle, Ticket, CircleDot, Users,
  X,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  CheckCircle,
  Ticket,
  CircleDot,
  Users,
};

export default function AdminLayout({ children }) {
  const { user, profile, loading, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (loading) {
    // Don't show loading spinner on login page
    if (pathname === "/admin/login") return <>{children}</>;

    return (
      <div className="min-h-screen bg-charcoal-600 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-charcoal-400" />
          <div className="h-3 w-28 bg-charcoal-400 rounded" />
        </div>
      </div>
    );
  }

  // Admin login page — render without sidebar
  if (pathname === "/admin/login") return <>{children}</>;

  if (!user || !isAdmin) return null;

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-charcoal-50 flex">
      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 start-0 h-full w-64 bg-charcoal-600 text-white z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "invisible lg:visible -translate-x-full rtl:translate-x-full"
        } lg:translate-x-0 lg:rtl:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <Link href="/admin" onClick={() => setSidebarOpen(false)}>
            <BrandLogo className="w-20" dark eager />
            <span className="block mt-2 text-xs font-medium text-white/70"><T>Admin Panel</T></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/60">
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {ADMIN_NAV_LINKS.map((link) => {
              const Icon = iconMap[link.icon] || LayoutDashboard;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-red-500/20 text-red-400"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  <T>{link.label}</T>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1 min-h-screen lg:ms-64">
        {/* Top Bar */}
        <header className="fixed top-0 end-0 start-0 lg:start-64 z-20 bg-white/95 backdrop-blur-md border-b border-beige-200 px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-charcoal-400 hover:bg-beige-100"
              >
                <LayoutDashboard size={20} />
              </button>
              <BrandLogo symbol className="w-9 lg:hidden" eager />
              <div className="min-w-0">
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-red-600 bg-red-50 rounded-full uppercase"><T>
                  Admin
                </T></span>
                <p className="text-sm font-semibold text-charcoal-600 mt-0.5 max-w-[120px] sm:max-w-none truncate">
                  {profile?.full_name || user?.email}
                </p>
              </div>
            </div>
            <LanguageSwitcher compact />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 sm:pt-22 lg:pt-24">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
