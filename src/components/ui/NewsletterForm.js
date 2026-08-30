"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
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
          <span className="text-charcoal-600 font-medium text-sm sm:text-base">
            JazakAllah Khair! You&apos;ve been subscribed.
          </span>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1 w-full">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-200" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-beige-300 bg-white text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-gold text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-sm whitespace-nowrap"
          >
            Subscribe
            <ArrowRight size={16} />
          </button>
        </form>
      )}
    </motion.div>
  );
}
