"use client";
import { formatRelativeTime } from "@/lib/i18n/translate.mjs";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function NotificationBell({ userId }) {
  const { t: translate, locale } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    if (!supabase) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
      setLoading(false);
    };

    fetchNotifications();

    // Subscribe to realtime notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev].slice(0, 10));
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAllAsRead = async () => {
    const supabase = createClient();
    if (!supabase) return;

    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
    setUnreadCount(0);
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

  const timeAgo = (dateStr) => formatRelativeTime(dateStr, locale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-charcoal-400 hover:bg-beige-100 transition-colors"
        aria-label={translate("Notifications")}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse-soft">
            <T>{unreadCount > 9 ? "9+" : unreadCount}</T>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-card-hover border border-beige-200 z-50 animate-slide-down overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-beige-100">
            <h3 className="text-sm font-bold text-charcoal-600"><T>Notifications</T></h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-gold hover:text-gold-dark font-medium transition-colors"
              ><T>
                Mark all as read
              </T></button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-beige-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-beige-200 rounded w-3/4" />
                        <div className="h-2 bg-beige-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="text-beige-300 mx-auto mb-2" />
                <p className="text-sm text-charcoal-300"><T>No notifications yet</T></p>
                <p className="text-xs text-charcoal-200 mt-1"><T>
                  You&apos;ll see updates here
                </T></p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-beige-50 hover:bg-beige-50 transition-colors cursor-pointer ${
                    !notification.is_read ? "bg-gold/5" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-lg shrink-0 mt-0.5">
                      <T>{getTypeIcon(notification.type)}</T>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.is_read ? "font-semibold text-charcoal-600" : "text-charcoal-400"}`}>
                        <T>{notification.title}</T>
                      </p>
                      <p className="text-xs text-charcoal-300 mt-0.5 line-clamp-2">
                        <T>{notification.message}</T>
                      </p>
                      <p className="text-[10px] text-charcoal-200 mt-1">
                        <T>{timeAgo(notification.created_at)}</T>
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-beige-100 text-center">
              <Link
                href="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gold hover:text-gold-dark font-medium transition-colors"
              ><T>
                View all notifications →
              </T></Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
