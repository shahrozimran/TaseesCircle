"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  MessageSquare, Send, CheckCircle, AlertCircle, Loader2,
  Mail, Shield,
} from "lucide-react";

export default function SupportPage() {
  const { user, profile } = useAuth();
  const [recipient, setRecipient] = useState("tasees_admin");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Please fill in both subject and message.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const supabase = createClient();
      if (!supabase) return;

      const { error: insertError } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          masjid_id: profile?.current_masjid_id || null,
          recipient,
          subject: subject.trim(),
          message: message.trim(),
          status: "open",
          priority: "medium",
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setSuccess(true);
      setSubject("");
      setMessage("");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-beige-200 p-8 sm:p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-islamic-green/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-islamic-green" />
          </div>
          <h2 className="font-heading font-bold text-charcoal-600 text-xl mb-3">
            Message Sent!
          </h2>
          <p className="text-sm text-charcoal-300 mb-6">
            Your message has been sent to {recipient === "tasees_admin" ? "the Ta'sees Circle team" : "your circle moderator"}. You will receive a response via email and a notification on your dashboard.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
          >
            <MessageSquare size={16} />
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600">
          Contact Support
        </h1>
        <p className="text-sm text-charcoal-300 mt-1">
          Send a message to our team or your circle moderator. We&apos;ll respond to your email.
        </p>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Recipient Selection */}
          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-2">
              Send to
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRecipient("tasees_admin")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  recipient === "tasees_admin"
                    ? "border-gold bg-gold/5"
                    : "border-beige-200 hover:border-beige-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  recipient === "tasees_admin" ? "bg-gold/20" : "bg-beige-100"
                }`}>
                  <Mail size={18} className={recipient === "tasees_admin" ? "text-gold" : "text-charcoal-300"} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-600">Ta&apos;sees Circle</p>
                  <p className="text-[11px] text-charcoal-300">Platform support team</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRecipient("moderator")}
                disabled={!profile?.current_masjid_id}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  recipient === "moderator"
                    ? "border-gold bg-gold/5"
                    : "border-beige-200 hover:border-beige-300"
                } ${!profile?.current_masjid_id ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  recipient === "moderator" ? "bg-gold/20" : "bg-beige-100"
                }`}>
                  <Shield size={18} className={recipient === "moderator" ? "text-gold" : "text-charcoal-300"} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-600">Circle Moderator</p>
                  <p className="text-[11px] text-charcoal-300">
                    {profile?.current_masjid_id ? "Your circle's moderator" : "Join a circle first"}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-1.5">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your query"
              required
              className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-1.5">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your query or concern in detail..."
              rows={6}
              required
              className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
