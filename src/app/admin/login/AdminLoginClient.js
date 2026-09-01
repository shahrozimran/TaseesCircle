"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginClient() {
  const { user, profile, loading, signInWithEmail, signInWithGoogle } = useAuth();
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
        setError("Access denied. This login is restricted to administrators only.");
      }
    }
  }, [user, profile, loading, router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { error: authError } = await signInWithEmail(email, password);
      if (authError) {
        setError(authError.message);
        return;
      }
      // Auth state change will trigger the useEffect above to check admin role
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    await signInWithGoogle();
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
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
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
              Admin Access
            </h1>
            <p className="text-white/40 text-xs sm:text-sm mt-1">
              Ta&apos;sees Circle — Restricted Area
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

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1.5">
                Email
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
                Password
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
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Sign In as Admin
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] text-white/20 uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white/70 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-[10px] text-white/15 mt-6">
            This page is restricted to authorized administrators only.
            Unauthorized access attempts are logged.
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
