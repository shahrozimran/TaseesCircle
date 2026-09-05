"use client";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  Ticket, MessageSquare, Send, Clock, CheckCircle,
  Loader2, User, Mail, MailCheck, MailX, RefreshCw, XCircle,
  Shield,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    open:      "px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase border border-red-200",
    responded: "px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase border border-blue-200",
    closed:    "px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase border border-green-200",
  };
  const labels = { open: "Open", responded: "Responded", closed: "Closed" };
  return <span className={map[status] || map.open}><T>{labels[status] || status}</T></span>;
}

function PriorityBadge({ priority }) {
  const map = {
    high:   "px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase border border-red-200",
    medium: "px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase border border-amber-200",
    low:    "px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase border border-green-200",
  };
  return <span className={map[priority] || map.medium}><T>{priority || "medium"}</T></span>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminTicketsPage() {
  const { t: translate , dateLocale} = useLanguage();
  const { user } = useAuth();
  const [tickets,       setTickets]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [filter,        setFilter]        = useState("open");
  const [respondingTo,  setRespondingTo]  = useState(null);
  const [responseText,  setResponseText]  = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [responseError, setResponseError] = useState("");
  const [closingId,     setClosingId]     = useState(null);

  const fetchTickets = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    setLoading(true);

    let query = supabase
      .from("support_tickets")
      .select(`
        *,
        profiles!support_tickets_user_id_fkey(full_name, email, avatar_url),
        masjids(name),
        ticket_responses(
          id, response_message, email_sent, responded_by, created_at,
          profiles!ticket_responses_responded_by_fkey(full_name)
        )
      `)
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query.limit(50);
    setTickets(data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (!user?.id) return;
    fetchTickets();
  }, [user?.id, fetchTickets]);

  // ── Respond via server API ───────────────────────────────────────────────────
  const handleRespond = async (ticketId) => {
    if (!responseText.trim()) return;
    setSubmitting(true);
    setResponseError("");

    try {
      const res = await fetch("/api/support/respond", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, responseMessage: responseText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResponseError(data.error || "Failed to send response.");
        return;
      }
      setRespondingTo(null);
      setResponseText("");
      fetchTickets();
    } catch {
      setResponseError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Close ticket ─────────────────────────────────────────────────────────────
  const handleClose = async (ticketId) => {
    setClosingId(ticketId);
    const supabase = createClient();
    if (supabase) {
      await supabase.from("support_tickets").update({ status: "closed" }).eq("id", ticketId);
      fetchTickets();
    }
    setClosingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600"><T>Support Tickets</T></h1>
          <p className="text-sm text-charcoal-300 mt-1"><T>
            Respond to user queries — responses are sent to their email and shown in their dashboard
          </T></p>
        </div>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-charcoal-400 hover:text-gold hover:bg-gold/5 rounded-lg transition-all font-medium border border-beige-200"
        >
          <RefreshCw size={13} /><T> Refresh
        </T></button>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex rounded-xl bg-beige-100 p-1">
        {[
          { key: "open",      label: "Open" },
          { key: "responded", label: "Responded" },
          { key: "closed",    label: "Closed" },
          { key: "all",       label: "All" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === tab.key ? "bg-white text-charcoal-600 shadow-sm" : "text-charcoal-300 hover:text-charcoal-500"
            }`}
          >
            <T>{tab.label}</T>
          </button>
        ))}
      </div>

      {/* Tickets list */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 bg-beige-100 rounded-2xl" />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-beige-200 p-12 text-center">
          <Ticket size={40} className="text-beige-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-charcoal-500 text-base mb-1"><T>No {filter} tickets</T></h3>
          <p className="text-sm text-charcoal-300"><T>All caught up!</T></p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-beige-200 overflow-hidden"
            >
              {/* ── Header ── */}
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-heading font-bold text-charcoal-600 text-base">{ticket.subject}</h3>
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                    <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1 flex-wrap">
                      <User size={12} />
                      <span className="font-medium">{ticket.profiles?.full_name || <T>Unknown</T>}</span>
                      <span>({ticket.profiles?.email})</span>
                      {ticket.masjids?.name && <span className="ms-1">· {ticket.masjids.name}</span>}
                    </p>
                    <p className="text-[11px] text-charcoal-200 mt-0.5 flex items-center gap-1">
                      <Clock size={10} />
                      <T>{new Date(ticket.created_at).toLocaleDateString(dateLocale, {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}</T>
                      <span className="ms-1"><T>· To: </T><span className="font-medium"><T>{ticket.recipient === "tasees_admin" ? "TaseesCircle Admin" : "Moderator"}</T></span></span>
                    </p>
                  </div>

                  {/* Close button */}
                  {ticket.status !== "closed" && (
                    <button
                      onClick={() => handleClose(ticket.id)}
                      disabled={closingId === ticket.id}
                      title={translate("Close ticket")}
                      className="ms-3 p-1.5 text-charcoal-200 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      {closingId === ticket.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                    </button>
                  )}
                </div>

                {/* ── Original message ── */}
                <div className="bg-beige-50 rounded-xl p-4 mb-3">
                  <p className="text-sm text-charcoal-500 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
                </div>

                {/* ── Previous Responses ── */}
                {ticket.ticket_responses?.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <p className="text-[11px] font-bold text-charcoal-300 uppercase tracking-wide"><T>
                      Responses ({ticket.ticket_responses.length}</T>)
                    </p>
                    {[...ticket.ticket_responses]
                      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                      .map((resp) => (
                        <div key={resp.id} className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <Shield size={12} className="text-blue-500" />
                              <span className="text-[11px] text-blue-600 font-bold">
                                {resp.profiles?.full_name || "TaseesCircle Admin"}
                              </span>
                            </div>
                            <span className="text-[10px] text-charcoal-200">
                              · <T>{new Date(resp.created_at).toLocaleDateString(dateLocale, {
                                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                              })}</T>
                            </span>
                            {resp.email_sent ? (
                              <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                                <MailCheck size={11} /><T> Email sent
                              </T></span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] text-amber-500 font-medium">
                                <MailX size={11} /><T> Email pending
                              </T></span>
                            )}
                          </div>
                          <p className="text-sm text-charcoal-500 whitespace-pre-wrap leading-relaxed">
                            {resp.response_message}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                {/* ── Respond form ── */}
                {ticket.status !== "closed" && (
                  <>
                    {respondingTo === ticket.id ? (
                      <div className="border-t border-beige-100 pt-4 mt-3">
                        {responseError && (
                          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                            <T>{responseError}</T>
                          </div>
                        )}
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder={translate("Type your response... This will be sent to the user's email and shown in their dashboard.")}
                          rows={4}
                          className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold resize-none transition-colors"
                        />
                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                          <p className="text-[11px] text-charcoal-200 flex items-center gap-1">
                            <Mail size={10} /><T>
                            Response will be emailed to </T><strong className="ms-1">{ticket.profiles?.email}</strong>
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setRespondingTo(null); setResponseText(""); setResponseError(""); }}
                              className="px-4 py-2 text-xs text-charcoal-400 font-medium hover:bg-beige-50 rounded-lg transition-colors"
                            ><T>
                              Cancel
                            </T></button>
                            <button
                              onClick={() => handleRespond(ticket.id)}
                              disabled={!responseText.trim() || submitting}
                              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-gold text-white text-xs font-medium rounded-xl disabled:opacity-50 hover:shadow-md transition-all"
                            >
                              {submitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}<T>
                              Send Response & Email
                            </T></button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => { setRespondingTo(ticket.id); setResponseError(""); }}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs text-gold hover:bg-gold/10 font-medium rounded-lg transition-colors"
                        >
                          <MessageSquare size={12} />
                          <T>{ticket.ticket_responses?.length > 0 ? "Reply Again" : "Respond"}</T>
                        </button>
                        {ticket.status === "responded" && (
                          <span className="flex items-center gap-1 text-[11px] text-green-600 font-medium ms-1">
                            <CheckCircle size={12} /><T> Responded
                          </T></span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
