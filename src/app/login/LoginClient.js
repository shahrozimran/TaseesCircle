"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Users, Heart, Star, Shield } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: BookOpen, text: "Access exclusive Islamic learning materials" },
  { icon: Users, text: "Connect with community members worldwide" },
  { icon: Heart, text: "Register for events and programs" },
  { icon: Star, text: "Receive personalized content recommendations" },
  { icon: Shield, text: "Save your progress across all resources" },
];

export default function LoginClient() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50 pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 sm:p-10 text-center max-w-md w-full"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-islamic-green/10 flex items-center justify-center mx-auto mb-4">
            <Star size={26} className="text-islamic-green" />
          </div>
          <h2 className="font-heading font-bold text-charcoal-600 text-xl sm:text-2xl mb-2">
            Assalamu Alaikum!
          </h2>
          <p className="text-charcoal-300 text-xs sm:text-sm mb-6">
            Welcome back, {user.user_metadata?.full_name || user.email}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gradient-gold text-white font-medium rounded-lg hover:shadow-lg transition-all text-sm"
          >
            Go to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 pt-24 sm:pt-28 pb-12">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em] font-medium">
              Welcome to Ta'sees Circle
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-charcoal-600 mt-2 sm:mt-3 mb-3 sm:mb-4">
              Join Our Community
            </h1>
            <p className="text-charcoal-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8">
              Sign in to access exclusive features, register for events, and connect with Muslim communities in Pakistan and Canada. Your journey of faith and community starts here.
            </p>

            {/* Benefits */}
            <div className="space-y-3 sm:space-y-4 mb-6 lg:mb-0">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <benefit.icon size={15} className="text-gold" />
                  </div>
                  <span className="text-charcoal-400 text-xs sm:text-sm">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Login Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-card-hover p-6 sm:p-8 md:p-10 border border-beige-100">
              {/* Islamic Greeting */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-white font-heading font-bold text-xl sm:text-2xl">T</span>
                </div>
                <h2 className="font-heading font-bold text-charcoal-600 text-lg sm:text-xl mb-1">
                  Assalamu Alaikum
                </h2>
                <p className="text-charcoal-300 text-xs sm:text-sm">
                  Peace be upon you. Sign in to continue.
                </p>
              </div>

              {/* Google Login */}
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-5 sm:px-6 py-3.5 border-2 border-beige-300 rounded-xl text-charcoal-500 font-medium hover:border-gold hover:bg-beige-50 transition-all text-xs sm:text-sm disabled:opacity-50"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {loading ? "Loading..." : "Continue with Google"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5 sm:my-6">
                <div className="h-px flex-1 bg-beige-200" />
                <span className="text-xs text-charcoal-200">or</span>
                <div className="h-px flex-1 bg-beige-200" />
              </div>

              {/* Browse as Guest */}
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-beige-50 border border-beige-200 rounded-xl text-charcoal-400 font-medium hover:bg-beige-100 transition-all text-xs sm:text-sm"
              >
                Continue as Guest
              </Link>

              <p className="text-[11px] sm:text-xs text-charcoal-200 text-center mt-5 sm:mt-6 leading-relaxed">
                By signing in, you agree to our Terms of Service and Privacy Policy.
                Your information is kept secure and is never shared.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
