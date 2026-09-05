"use client";
import LocalizedForm from "@/components/i18n/LocalizedForm";
import T from "@/components/i18n/T";
import BrandLogo from "@/components/ui/BrandLogo";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Users, Heart, Star, Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeRedirect } from "@/lib/utils/safeRedirect";

const benefits = [
  { icon: BookOpen, text: "Access exclusive Islamic learning materials" },
  { icon: Users, text: "Connect with community members worldwide" },
  { icon: Heart, text: "Register your Masjid and create a Circle" },
  { icon: Star, text: "Join guided circles on Ibadat & Halal Business" },
  { icon: Shield, text: "Submit daily reports and track your progress" },
];

export default function LoginClient() {
  const { t: translate } = useLanguage();
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));

  // Form state
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [emailTab, setEmailTab] = useState(false); // false = Google, true = Email form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50 pt-24 pb-12 px-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-beige-200" />
          <div className="h-4 w-32 bg-beige-200 rounded" />
        </div>
      </div>
    );
  }

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
          <h2 className="font-heading font-bold text-charcoal-600 text-xl sm:text-2xl mb-2"><T>
            Assalamu Alaikum!
          </T></h2>
          <p className="text-charcoal-300 text-xs sm:text-sm mb-6"><T>
            Redirecting to your dashboard...
          </T></p>
        </motion.div>
      </div>
    );
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    try {
      if (authMode === "signup") {
        if (!fullName.trim()) {
          setFormError("Please enter your full name.");
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setFormError("Password must be at least 6 characters.");
          setSubmitting(false);
          return;
        }

        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setFormError(error.message);
        } else {
          setFormSuccess("Account created! Please check your email to verify your account, then sign in.");
          setAuthMode("login");
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setFormError(error.message);
        } else {
          router.push(redirectTo);
        }
      }
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em] font-medium"><T>
              Welcome to Ta&apos;sees Circle
            </T></span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-charcoal-600 mt-2 sm:mt-3 mb-3 sm:mb-4"><T>
              Join Our Community
            </T></h1>
            <p className="text-charcoal-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8"><T>
              Sign in to register your Masjid, create your Circle, and connect with Muslim communities worldwide. Your journey of faith, community, and halal business starts here.
            </T></p>

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
                  <span className="text-charcoal-400 text-xs sm:text-sm"><T>{benefit.text}</T></span>
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
                <BrandLogo className="w-36 mx-auto mb-4" eager />
                <h2 className="font-heading font-bold text-charcoal-600 text-lg sm:text-xl mb-1"><T>
                  Assalamu Alaikum
                </T></h2>
                <p className="text-charcoal-300 text-xs sm:text-sm"><T>
                  Peace be upon you. {authMode === "signup" ? "Create your account." : "Sign in to continue."}</T>
                </p>
              </div>

              {!emailTab ? (
                <>
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
                    </svg><T>
                    Continue with Google
                  </T></button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5 sm:my-6">
                    <div className="h-px flex-1 bg-beige-200" />
                    <span className="text-xs text-charcoal-200"><T>or</T></span>
                    <div className="h-px flex-1 bg-beige-200" />
                  </div>

                  {/* Email Login Option */}
                  <button
                    onClick={() => setEmailTab(true)}
                    className="w-full flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 bg-gradient-gold text-white font-medium rounded-xl hover:shadow-lg transition-all text-xs sm:text-sm"
                  >
                    <Mail size={16} /><T>
                    Continue with Email
                  </T></button>
                </>
              ) : (
                <>
                  {/* Email/Password Form */}
                  <LocalizedForm onSubmit={handleEmailAuth} className="space-y-4">
                    {/* Mode Toggle */}
                    <div className="flex rounded-lg bg-beige-50 p-1 mb-2">
                      <button
                        type="button"
                        onClick={() => { setAuthMode("login"); setFormError(""); setFormSuccess(""); }}
                        className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                          authMode === "login"
                            ? "bg-white text-charcoal-600 shadow-sm"
                            : "text-charcoal-300 hover:text-charcoal-400"
                        }`}
                      ><T>
                        Sign In
                      </T></button>
                      <button
                        type="button"
                        onClick={() => { setAuthMode("signup"); setFormError(""); setFormSuccess(""); }}
                        className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                          authMode === "signup"
                            ? "bg-white text-charcoal-600 shadow-sm"
                            : "text-charcoal-300 hover:text-charcoal-400"
                        }`}
                      ><T>
                        Create Account
                      </T></button>
                    </div>

                    {/* Full Name (signup only) */}
                    {authMode === "signup" && (
                      <div>
                        <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                          Full Name
                        </T></label>
                        <div className="relative">
                          <User size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-charcoal-200" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={translate("Enter your full name")}
                            required
                            className="w-full ps-10 pe-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                        Email Address
                      </T></label>
                      <div className="relative" dir="ltr">
                        <Mail size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-charcoal-200" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={translate("you@example.com")}
                          required
                          className="w-full ps-10 pe-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                        Password
                      </T></label>
                      <div className="relative" dir="ltr">
                        <Lock size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-charcoal-200" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={translate(authMode === "signup" ? "At least 6 characters" : "Enter your password")}
                          required
                          minLength={6}
                          className="w-full ps-10 pe-12 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={translate(showPassword ? "Hide password" : "Show password")}
                          className="absolute end-3 top-1/2 -translate-y-1/2 text-charcoal-200 hover:text-charcoal-400 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                        </button>
                      </div>
                    </div>

                    {/* Error/Success Messages */}
                    {formError && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                        <T>{formError}</T>
                      </div>
                    )}
                    {formSuccess && (
                      <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-xs">
                        <T>{formSuccess}</T>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-gold text-white font-medium rounded-xl hover:shadow-lg transition-all text-xs sm:text-sm disabled:opacity-50"
                    >
                      <T>{submitting ? (
                        "Please wait..."
                      ) : (
                        <>
                          <T>{authMode === "signup" ? "Create Account" : "Sign In"}</T>
                          <ArrowRight size={16} />
                        </>
                      )}</T>
                    </button>
                  </LocalizedForm>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5 sm:my-6">
                    <div className="h-px flex-1 bg-beige-200" />
                    <span className="text-xs text-charcoal-200"><T>or</T></span>
                    <div className="h-px flex-1 bg-beige-200" />
                  </div>

                  {/* Back to Google */}
                  <button
                    onClick={() => { setEmailTab(false); setFormError(""); setFormSuccess(""); }}
                    className="w-full flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-beige-50 border border-beige-200 rounded-xl text-charcoal-400 font-medium hover:bg-beige-100 transition-all text-xs sm:text-sm"
                  ><T>
                    ← Back to Google Sign In
                  </T></button>
                </>
              )}

              <p className="text-[11px] sm:text-xs text-charcoal-200 text-center mt-5 sm:mt-6 leading-relaxed"><T>
                By signing in, you agree to our Terms of Service and Privacy Policy.
                Your information is kept secure and is never shared.
              </T></p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
