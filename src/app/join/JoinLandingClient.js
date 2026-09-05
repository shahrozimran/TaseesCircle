"use client";
import T from "@/components/i18n/T";


import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { CircleDot, Loader2 } from "lucide-react";

export default function JoinLandingClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const masjidCode = searchParams.get("masjid") || "";
  const refCode = searchParams.get("ref") || "";

  useEffect(() => {
    if (loading) return;

    if (user) {
      // Logged in → go to dashboard join page with params
      const params = new URLSearchParams();
      if (masjidCode) params.set("masjid", masjidCode);
      if (refCode) params.set("ref", refCode);
      router.push(`/dashboard/join-masjid?${params.toString()}`);
    } else {
      // Not logged in → go to login with redirect
      const params = new URLSearchParams();
      if (masjidCode) params.set("masjid", masjidCode);
      if (refCode) params.set("ref", refCode);
      router.push(`/login?redirect=${encodeURIComponent(`/dashboard/join-masjid?${params.toString()}`)}`);
    }
  }, [user, loading, router, masjidCode, refCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 pt-24 pb-12">
      <div className="bg-white rounded-2xl shadow-card p-8 sm:p-12 text-center max-w-md w-full mx-4">
        <div className="w-16 h-16 rounded-full bg-islamic-green/10 flex items-center justify-center mx-auto mb-5">
          <CircleDot size={32} className="text-islamic-green" />
        </div>
        <h1 className="font-heading font-bold text-charcoal-600 text-xl sm:text-2xl mb-3"><T>
          Joining a Circle
        </T></h1>
        <p className="text-sm text-charcoal-300 mb-6">
          {user ? "Redirecting to your dashboard..." : "Please sign in to join a Masjid circle."}
        </p>
        <Loader2 size={24} className="animate-spin text-gold mx-auto" />
      </div>
    </div>
  );
}
