"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginClient() {
  const { user, profile, loading, signInWithEmail, signOut } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === "super_admin") {
        router.push("/admin");
      } else {
        setError("Access denied. Invalid administrator credentials.");
        signOut();
      }
    }
  }, [user, profile, loading, router, signOut]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { data, error: authError } = await signInWithEmail(email, password);
      if (authError) {
        setError(authError.message);
        setSubmitting(false);
        return;
      }

      // Explicitly check profile role in database
      const supabase = createClient();
      if (supabase && data?.user) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (!userProfile || userProfile.role !== "super_admin") {
          setError("Access denied. Invalid administrator credentials.");
          await signOut();
          setSubmitting(false);
          return;
        }

        router.push("/admin");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-600 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-charcoal-400" />
          <div className="h-3 w-28 bg-charcoal-400 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-red-400" />
            </div>
            <h1 className="font-heading font-bold text-white text-xl sm:text-2xl">
              Admin Portal
            </h1>
            <p className="text-white/40 text-xs sm:text-sm mt-1">
              Ta&apos;sees Circle — Database Credentials Required
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2"
            >
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Email/Password Form ONLY */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@taseescircle.org"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Authenticate Admin
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Notice */}
          <p className="text-center text-[10px] text-white/20 mt-8 leading-relaxed">
            Strict Database Verification Enforced.
            <br />
            Only authorized admin accounts in `profiles` table can access.
          </p>
        </div>

        {/* Back to site link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            ← Back to Ta&apos;sees Circle
          </a>
        </div>
      </motion.div>
    </div>
  );
}
