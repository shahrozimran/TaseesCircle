"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default function DashboardLayout({ children }) {
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-beige-200" />
          <div className="h-3 w-28 bg-beige-200 rounded" />
          <div className="h-2 w-20 bg-beige-100 rounded" />
        </div>
      </div>
    );
  }

  // Middleware handles redirect, but just in case
  if (!user) return null;

  return (
    <div className="min-h-screen bg-beige-50 flex">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        profile={profile}
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Topbar */}
        <DashboardTopbar
          user={user}
          profile={profile}
          onMenuToggle={() => setSidebarOpen(true)}
          signOut={signOut}
          isAdmin={isAdmin}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 sm:pt-22 lg:pt-24">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
