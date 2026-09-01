"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const supabase = createClient();
    if (!supabase) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setNotifications(data || []);
      setLoading(false);
    };

    fetchNotifications();
  }, [user?.id]);

  const markAllAsRead = async () => {
    const supabase = createClient();
    if (!supabase) return;

    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "approval": return "✅";
      case "rejection": return "❌";
      case "ticket_response": return "📩";
      case "member_joined": return "👋";
      default: return "🔔";
    }
  };

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600">
            Notifications
          </h1>
          <p className="text-sm text-charcoal-300 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gold hover:bg-gold/10 rounded-lg transition-colors"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </motion.div>

      <div className="bg-white rounded-2xl border border-beige-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-beige-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-beige-200 rounded w-3/4" />
                  <div className="h-2 bg-beige-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={40} className="text-beige-300 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-charcoal-500 text-base mb-1">No Notifications</h3>
            <p className="text-sm text-charcoal-300">
              You&apos;ll receive notifications about masjid approvals, support responses, and circle updates.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-beige-50">
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`px-5 py-4 flex items-start gap-3 hover:bg-beige-50 transition-colors ${
                  !notif.is_read ? "bg-gold/5" : ""
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">{getTypeIcon(notif.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.is_read ? "font-semibold text-charcoal-600" : "text-charcoal-400"}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-charcoal-300 mt-1 leading-relaxed">{notif.message}</p>
                  <p className="text-[11px] text-charcoal-200 mt-2">{timeAgo(notif.created_at)}</p>
                </div>
                {!notif.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 mt-2" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
