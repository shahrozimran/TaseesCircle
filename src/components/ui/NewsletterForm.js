"use client";
import LocalizedForm from "@/components/i18n/LocalizedForm";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { validateEmail } from "@/lib/security";

export default function NewsletterForm() {
  const { t: translate } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Subscription failed. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
    } catch (err) {
      setLoading(false);
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-lg mx-auto"
    >
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-3 py-4 text-center px-4"
        >
          <CheckCircle size={22} className="text-islamic-green shrink-0" />
          <span className="text-charcoal-600 font-medium text-sm sm:text-base"><T>
            JazakAllah Khair! You&apos;ve been subscribed.
          </T></span>
        </motion.div>
      ) : (
        <LocalizedForm onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1 w-full">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-200" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setErrorMessage("");
                setEmail(e.target.value);
              }}
              maxLength={254}
              placeholder={translate("Enter your email address")}
              required
              className={`w-full ps-12 pe-4 py-3.5 rounded-xl border bg-white text-charcoal-500 placeholder:text-charcoal-200 focus:ring-2 transition-all text-sm ${
                errorMessage
                  ? "border-red-400 focus:ring-red-200"
                  : "border-beige-300 focus:border-gold focus:ring-gold/20"
              }`}
            />
            {errorMessage && (
              <span className="flex items-center gap-1 text-[11px] text-red-500 mt-1 ps-1">
                <AlertCircle size={12} className="shrink-0" /> <T>{errorMessage}</T>
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-gold text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-sm whitespace-nowrap self-start sm:self-auto disabled:opacity-50"
          >
            <T>{loading ? "Subscribing..." : "Subscribe"}</T>
            <ArrowRight size={16} />
          </button>
        </LocalizedForm>
      )}
    </motion.div>
  );
}
