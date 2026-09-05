"use client";
import T from "@/components/i18n/T";


import { useAuth } from "@/hooks/useAuth";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginButton({ className }) {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className={`px-4 py-2 text-xs text-charcoal-300 animate-pulse ${className}`}><T>
        Loading...
      </T></div>
    );
  }

  if (user) {
    return null; // Handled by UserMenu
  }

  return (
    <Link
      href="/login"
      className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all ${className}`}
    >
      <LogIn size={16} /><T>
      Sign In / Login
    </T></Link>
  );
}
