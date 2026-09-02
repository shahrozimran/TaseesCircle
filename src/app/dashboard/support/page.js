"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  MessageSquare, Send, CheckCircle, AlertCircle, Loader2,
  Mail, Shield, Clock, Inbox, RefreshCw, ChevronDown, ChevronUp,
  AlertTriangle,
} from "lucide-react";

// ─── Spam Folder Warning Note ────────────────────────────────────────────────
function SpamFolderNote({ className = "" }) {
  return (
    <div className={`p-4 bg-amber-50/90 border border-amber-200/80 rounded-xl flex items-start gap-3 text-left ${className}`}>
      <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
      <div className="text-xs text-amber-900 leading-relaxed">
        <p className="font-bold text-amber-950 mb-0.5 flex items-center gap-1">
          📬 Check Your Email Spam / Junk Folder
        </p>
        <p className="text-amber-800">
          Our response will be sent from <strong>taseescircle@gmail.com</strong>. Automated emails may occasionally be placed in your <strong>Spam or Junk folder</strong>.
        </p>
        <p className="mt-1 font-semibold text-amber-900">
          💡 Tip: If our email goes to Spam, open it and click <strong>&quot;Report as Not Spam&quot;</strong> so all future replies land directly in your Primary Inbox!
        </p>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    open:      { label: "Open",      cls: "bg-red-50 text-red-600 border-red-200" },
    responded: { label: "Responded", cls: "bg-blue-50 text-blue-600 border-blue-200" },
    closed:    { label: "Closed",    cls: "bg-green-50 text-green-600 border-green-200" },
  };
  const cfg = map[status] || map.open;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── My Queries Tab ───────────────────────────────────────────────────────────
function MyQueriesTab({ userId }) {
  const [tickets, setTickets]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState({});

  const fetchTickets = useCallback(async () => {
    const supabase = createClient();
    if (!supabase || !userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("support_tickets")
      .select(`
        *,
        ticket_responses(
          id, response_message, email_sent, created_at,
          profiles!ticket_responses_responded_by_fkey(full_name)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    setTickets(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-beige-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-beige-200 p-12 text-center">
        <Inbox size={40} className="text-beige-300 mx-auto mb-3" />
        <h3 className="font-heading font-bold text-charcoal-500 text-base mb-1">No queries yet</h3>
        <p className="text-sm text-charcoal-300">
          When you send a query, it will appear here along with any responses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-charcoal-300">{tickets.length} quer{tickets.length === 1 ? "y" : "ies"} submitted</p>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 font-medium transition-colors"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {tickets.map((ticket, i) => {
        const isOpen = expanded[ticket.id];
        const hasResponses = ticket.ticket_responses?.length > 0;
        const sortedResponses = [...(ticket.ticket_responses || [])].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        return (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-beige-200 overflow-hidden"
          >
            {/* Ticket header — always visible */}
            <button
              onClick={() => toggleExpand(ticket.id)}
              className="w-full text-left p-5 hover:bg-beige-50/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-heading font-bold text-charcoal-600 text-sm truncate">
                      {ticket.subject}
                    </h3>
                    <StatusBadge status={ticket.status} />
                    {hasResponses && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-200">
                        <MessageSquare size={9} /> {sortedResponses.length} response{sortedResponses.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-charcoal-300 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(ticket.created_at).toLocaleDateString("en-PK", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                    <span className="ml-2">· To: {ticket.recipient === "tasees_admin" ? "TaseesCircle" : "Circle Moderator"}</span>
                  </p>
                </div>
                <div className="shrink-0 text-charcoal-300">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-4 border-t border-beige-100 pt-4">
                    {/* Original message */}
                    <div>
                      <p className="text-[11px] font-bold text-charcoal-300 uppercase tracking-wide mb-2">Your Query</p>
                      <div className="bg-beige-50 rounded-xl p-4">
                        <p className="text-sm text-charcoal-500 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
                      </div>
                    </div>

                    {/* Responses */}
                    <div>
                      <p className="text-[11px] font-bold text-charcoal-300 uppercase tracking-wide mb-2">
                        Responses {hasResponses ? `(${sortedResponses.length})` : ""}
                      </p>
                      {hasResponses ? (
                        <div className="space-y-3">
                          {sortedResponses.map((resp) => (
                            <div
                              key={resp.id}
                              className="bg-gradient-to-br from-islamic-green/5 to-islamic-green/10 border border-islamic-green/20 rounded-xl p-4"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-full bg-islamic-green/20 flex items-center justify-center">
                                  <Shield size={13} className="text-islamic-green" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-charcoal-600">TaseesCircle Admin</p>
                                  <p className="text-[10px] text-charcoal-300">
                                    {new Date(resp.created_at).toLocaleDateString("en-PK", {
                                      day: "numeric", month: "short", year: "numeric",
                                    })}
                                    {resp.email_sent && (
                                      <span className="ml-2 text-islamic-green font-medium">· ✉ Sent to your email</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-charcoal-500 leading-relaxed whitespace-pre-wrap">
                                {resp.response_message}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                            <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-charcoal-500">Awaiting Response</p>
                              <p className="text-[11px] text-charcoal-300 mt-0.5">
                                Our team will review your query and reply via email. You&apos;ll also be notified here.
                              </p>
                            </div>
                          </div>
                          <SpamFolderNote />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Send Query Tab ───────────────────────────────────────────────────────────
function SendQueryTab({ user, profile }) {
  const [recipient, setRecipient] = useState("tasees_admin");
  const [subject,   setSubject]   = useState("");
  const [message,   setMessage]   = useState("");
  const [priority,  setPriority]  = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Please fill in both subject and message.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/support/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject:   subject.trim(),
          message:   message.trim(),
          recipient,
          priority,
          masjid_id: profile?.current_masjid_id || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed. Please try again.");
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
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-beige-200 p-8 sm:p-12 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-islamic-green/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-islamic-green" />
        </div>
        <h2 className="font-heading font-bold text-charcoal-600 text-xl mb-3">Query Sent!</h2>
        <p className="text-sm text-charcoal-400 mb-2 leading-relaxed">
          Your query has been submitted and the TaseesCircle team has been notified via email.
        </p>
        <p className="text-sm text-charcoal-400 mb-5 leading-relaxed">
          You&apos;ll receive a response via email at <strong>{profile?.email || user?.email}</strong> and it will appear in the <strong>My Queries</strong> tab.
        </p>
        <SpamFolderNote className="mb-6" />
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setSuccess(false)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
          >
            <MessageSquare size={16} />
            Send Another Query
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8">
      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Recipient */}
        <div>
          <label className="block text-xs font-medium text-charcoal-400 mb-2">Send to</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRecipient("tasees_admin")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                recipient === "tasees_admin" ? "border-gold bg-gold/5" : "border-beige-200 hover:border-beige-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${recipient === "tasees_admin" ? "bg-gold/20" : "bg-beige-100"}`}>
                <Mail size={18} className={recipient === "tasees_admin" ? "text-gold" : "text-charcoal-300"} />
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal-600">TaseesCircle</p>
                <p className="text-[11px] text-charcoal-300">Platform support team</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRecipient("moderator")}
              disabled={!profile?.current_masjid_id}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                recipient === "moderator" ? "border-gold bg-gold/5" : "border-beige-200 hover:border-beige-300"
              } ${!profile?.current_masjid_id ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${recipient === "moderator" ? "bg-gold/20" : "bg-beige-100"}`}>
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
          <label className="block text-xs font-medium text-charcoal-400 mb-1.5">Subject *</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your query"
            required
            maxLength={150}
            className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-medium text-charcoal-400 mb-1.5">Priority</label>
          <div className="flex gap-2">
            {[
              { value: "low",    label: "Low",    cls: "bg-green-50 text-green-600 border-green-300" },
              { value: "medium", label: "Medium", cls: "bg-amber-50 text-amber-600 border-amber-300" },
              { value: "high",   label: "High",   cls: "bg-red-50 text-red-600 border-red-300" },
            ].map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border-2 transition-all ${
                  priority === p.value ? p.cls + " shadow-sm" : "border-beige-200 text-charcoal-300 hover:border-beige-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-medium text-charcoal-400 mb-1.5">Message *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your query or concern in detail..."
            rows={6}
            required
            maxLength={3000}
            className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
          />
          <p className="text-[11px] text-charcoal-200 mt-1 text-right">{message.length}/3000</p>
        </div>

        {/* Email note */}
        <div className="flex items-center gap-2 p-3 bg-beige-50 rounded-xl border border-beige-200">
          <Mail size={14} className="text-charcoal-300 shrink-0" />
          <p className="text-[11px] text-charcoal-400">
            Your query will be sent to <strong>taseescircle@gmail.com</strong>. Responses will be emailed to{" "}
            <strong>{profile?.email || user?.email || "your registered email"}</strong>.
          </p>
        </div>

        {/* Spam folder warning note */}
        <SpamFolderNote />

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? (
            <><Loader2 size={16} className="animate-spin" /> Sending...</>
          ) : (
            <><Send size={16} /> Send Query</>
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SupportPage() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState("send");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600">Contact Support</h1>
        <p className="text-sm text-charcoal-300 mt-1">
          Send a query or view responses to your previous submissions.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-beige-100 p-1">
        {[
          { key: "send",    label: "Send Query",  icon: Send },
          { key: "queries", label: "My Queries",  icon: Inbox },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              tab === key ? "bg-white text-charcoal-600 shadow-sm" : "text-charcoal-300 hover:text-charcoal-500"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === "send" ? (
          <motion.div
            key="send"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
          >
            <SendQueryTab user={user} profile={profile} />
          </motion.div>
        ) : (
          <motion.div
            key="queries"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            <MyQueriesTab userId={user?.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
