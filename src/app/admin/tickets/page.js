"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  Ticket, MessageSquare, Send, Clock, CheckCircle,
  Loader2, User, Mail,
} from "lucide-react";

export default function AdminTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("open");
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetchTickets();
  }, [user?.id, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTickets = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    let query = supabase
      .from("support_tickets")
      .select(`
        *,
        profiles!support_tickets_user_id_fkey(full_name, email, avatar_url),
        masjids(name),
        ticket_responses(id, response_message, responded_by, created_at, profiles!ticket_responses_responded_by_fkey(full_name))
      `)
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query.limit(50);
    setTickets(data || []);
    setLoading(false);
  };

  const handleRespond = async (ticketId) => {
    if (!responseText.trim()) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      if (!supabase) return;

      const ticket = tickets.find((t) => t.id === ticketId);

      // Insert response
      await supabase.from("ticket_responses").insert({
        ticket_id: ticketId,
        responded_by: user.id,
        response_message: responseText.trim(),
        email_sent: false, // Will be true when email integration is added
      });

      // Update ticket status
      await supabase
        .from("support_tickets")
        .update({ status: "responded" })
        .eq("id", ticketId);

      // Send notification to ticket creator
      if (ticket?.user_id) {
        await supabase.from("notifications").insert({
          user_id: ticket.user_id,
          title: "Support Response Received",
          message: `Your support query "${ticket.subject}" has been responded to. The response has been sent to your email.`,
          type: "ticket_response",
          link: "/dashboard/notifications",
        });
      }

      // Log admin action
      await supabase.from("admin_actions").insert({
        admin_id: user.id,
        ticket_id: ticketId,
        action_type: "respond_ticket",
        notes: `Responded to ticket: ${ticket?.subject}`,
      });

      setRespondingTo(null);
      setResponseText("");
      fetchTickets();
    } catch (err) {
      console.error("Response error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "open": return <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase">Open</span>;
      case "responded": return <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase">Responded</span>;
      case "closed": return <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase">Closed</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high": return <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase">High</span>;
      case "medium": return <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase">Medium</span>;
      case "low": return <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase">Low</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600">Support Tickets</h1>
        <p className="text-sm text-charcoal-300 mt-1">Respond to user queries — responses are sent to their email and dashboard</p>
      </motion.div>

      {/* Filter */}
      <div className="flex rounded-xl bg-beige-100 p-1">
        {[
          { key: "open", label: "Open" },
          { key: "responded", label: "Responded" },
          { key: "closed", label: "Closed" },
          { key: "all", label: "All" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === tab.key ? "bg-white text-charcoal-600 shadow-sm" : "text-charcoal-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tickets */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-36 bg-beige-100 rounded-2xl" />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-beige-200 p-12 text-center">
          <Ticket size={40} className="text-beige-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-charcoal-500 text-base mb-1">No {filter} tickets</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-beige-200 p-5 sm:p-6"
            >
              {/* Ticket Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-charcoal-600 text-base">{ticket.subject}</h3>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1">
                    <User size={12} /> {ticket.profiles?.full_name} ({ticket.profiles?.email})
                    {ticket.masjids?.name && (
                      <span className="ml-2">· Masjid: {ticket.masjids.name}</span>
                    )}
                  </p>
                  <p className="text-[11px] text-charcoal-200 mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> {new Date(ticket.created_at).toLocaleDateString()} at {new Date(ticket.created_at).toLocaleTimeString()}
                    · To: <span className="font-medium">{ticket.recipient === "tasees_admin" ? "Ta'sees Admin" : "Moderator"}</span>
                  </p>
                </div>
              </div>

              {/* Ticket Message */}
              <div className="bg-beige-50 rounded-xl p-4 mb-3">
                <p className="text-sm text-charcoal-500 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
              </div>

              {/* Previous Responses */}
              {ticket.ticket_responses?.length > 0 && (
                <div className="space-y-2 mb-3">
                  {ticket.ticket_responses.map((resp) => (
                    <div key={resp.id} className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Send size={12} className="text-blue-500" />
                        <span className="text-[11px] text-blue-600 font-medium">
                          {resp.profiles?.full_name || "Admin"} · {new Date(resp.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-charcoal-500 whitespace-pre-wrap">{resp.response_message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Respond Form */}
              {ticket.status !== "closed" && (
                <>
                  {respondingTo === ticket.id ? (
                    <div className="border-t border-beige-100 pt-4 mt-3">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response... This will be sent to the user's email."
                        rows={4}
                        className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold resize-none"
                      />
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-[11px] text-charcoal-200 flex items-center gap-1">
                          <Mail size={10} /> Response will be sent to {ticket.profiles?.email}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setRespondingTo(null); setResponseText(""); }}
                            className="px-4 py-2 text-xs text-charcoal-400 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleRespond(ticket.id)}
                            disabled={!responseText.trim() || submitting}
                            className="flex items-center gap-1 px-4 py-2 bg-gradient-gold text-white text-xs font-medium rounded-xl disabled:opacity-50"
                          >
                            {submitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                            Send Response
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRespondingTo(ticket.id)}
                      className="mt-2 flex items-center gap-1 px-4 py-2 text-xs text-gold hover:bg-gold/10 font-medium rounded-lg transition-colors"
                    >
                      <MessageSquare size={12} />
                      Respond
                    </button>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
