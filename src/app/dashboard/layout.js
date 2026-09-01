"use client";

import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }) {
  const { user, profile, loading, signOut } = useAuth();

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

  // Middleware handles redirect, but guard here as well
  if (!user) return null;

  return (
    <div className="min-h-screen bg-beige-50 flex flex-col">
      {/* Top Navigation Header */}
      <DashboardHeader
        user={user}
        profile={profile}
        signOut={signOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
