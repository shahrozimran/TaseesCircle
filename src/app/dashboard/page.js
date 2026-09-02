"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Link as LinkIcon,
  CircleDot,
  Users,
  Bell,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  UserPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const { user, profile, refetchProfile } = useAuth();
  const [masjidData, setMasjidData] = useState(null);
  const [pendingMasjid, setPendingMasjid] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  // resolvedMasjidId: either from profile or from fallback masjid_members lookup
  const [resolvedMasjidId, setResolvedMasjidId] = useState(null);

  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const hasCircle = !!(profile?.current_masjid_id || resolvedMasjidId);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();
      if (!supabase || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        let activeMasjidId = profile?.current_masjid_id;

        // ── FALLBACK HEAL ──────────────────────────────────────────────
        // If profile.current_masjid_id is null (stale due to old RLS bug),
        // check masjid_members directly. If a row exists, the admin already
        // approved the masjid but the trigger never ran on the old broken path.
        if (!activeMasjidId) {
          const { data: membership } = await supabase
            .from("masjid_members")
            .select("masjid_id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (membership?.masjid_id) {
            activeMasjidId = membership.masjid_id;
            setResolvedMasjidId(activeMasjidId);
            // Heal the profile so future loads are correct
            refetchProfile();
          }
        }
        // ────────────────────────────────────────────────────────────────

        // Fetch user's masjid
        if (activeMasjidId) {
          const { data: masjid } = await supabase
            .from("masjids")
            .select("*, circles(*)")
            .eq("id", activeMasjidId)
            .single();
          setMasjidData(masjid);
        }

        // Check for pending masjid registration
        const { data: pending } = await supabase
          .from("masjids")
          .select("*")
          .eq("created_by", user.id)
          .eq("status", "pending")
          .limit(1)
          .maybeSingle();
        setPendingMasjid(pending);

        // Fetch recent notifications
        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);
        setRecentNotifications(notifs || []);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id, profile?.current_masjid_id, refetchProfile]);

  const renderTypeIcon = (type) => {
    switch (type) {
      case "approval": return <CheckCircle size={16} className="text-green-500" />;
      case "rejection": return <XCircle size={16} className="text-red-500" />;
      case "ticket_response": return <Mail size={16} className="text-blue-500" />;
      case "member_joined": return <UserPlus size={16} className="text-gold" />;
      default: return <Bell size={16} className="text-gold" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-beige-200 rounded-lg w-64" />
          <div className="h-4 bg-beige-100 rounded w-96" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="h-48 bg-beige-100 rounded-2xl" />
            <div className="h-48 bg-beige-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-charcoal-600">
          Assalamu Alaikum, {fullName}
        </h1>
        <p className="text-sm text-charcoal-300 mt-1">
          Welcome to your Ta&apos;sees Circle dashboard. May Allah bless your day.
        </p>
      </motion.div>

      {/* Pending Approval Banner */}
      {pendingMasjid && !hasCircle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 text-sm">Masjid Registration Pending</h3>
            <p className="text-xs text-amber-600 mt-1">
              Your Masjid &quot;<span className="font-medium">{pendingMasjid.name}</span>&quot; in {pendingMasjid.city}, {pendingMasjid.country} is awaiting approval from the Ta&apos;sees Circle team. You will be notified via email and on your dashboard once approved.
            </p>
          </div>
        </motion.div>
      )}

      {/* Active Circle Card */}
      {hasCircle && masjidData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-br from-islamic-green to-islamic-green-light rounded-2xl p-6 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CircleDot size={18} />
                <span className="text-xs font-medium uppercase tracking-wider text-white/70">Your Active Circle</span>
              </div>
              <h2 className="text-lg sm:text-xl font-heading font-bold">{masjidData.name}</h2>
              <p className="text-sm text-white/80 mt-1">
                {masjidData.area}, {masjidData.city}, {masjidData.country}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1 text-xs text-white/70">
                  <Users size={14} /> {masjidData.member_count} members
                </span>
                {masjidData.unique_code && (
                  <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-mono">
                    Code: {masjidData.unique_code}
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/dashboard/my-circle"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-all"
            >
              View Circle →
            </Link>
          </div>
        </motion.div>
      )}

      {/* No Circle — CTAs */}
      {!hasCircle && !pendingMasjid && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Register Masjid CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/dashboard/register-masjid" className="block group">
              <div className="bg-white rounded-2xl border-2 border-beige-200 hover:border-gold p-6 sm:p-8 transition-all hover:shadow-card-hover group-hover:-translate-y-1 duration-300 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus size={24} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-charcoal-600 text-lg mb-2">
                  Register Your Masjid
                </h3>
                <p className="text-sm text-charcoal-300 leading-relaxed">
                  Create a new circle for your Masjid community. Add your Masjid details and get a unique code to invite members.
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-gold text-sm font-medium group-hover:gap-2 transition-all">
                  Get Started →
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Join Masjid CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/dashboard/join-masjid" className="block group">
              <div className="bg-white rounded-2xl border-2 border-beige-200 hover:border-islamic-green p-6 sm:p-8 transition-all hover:shadow-card-hover group-hover:-translate-y-1 duration-300 h-full">
                <div className="w-14 h-14 rounded-2xl bg-islamic-green flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LinkIcon size={24} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-charcoal-600 text-lg mb-2">
                  Join a Masjid Circle
                </h3>
                <p className="text-sm text-charcoal-300 leading-relaxed">
                  Have a Masjid code or referral? Join an existing circle to connect with your community.
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-islamic-green text-sm font-medium group-hover:gap-2 transition-all">
                  Join Now →
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      )}

      {/* Recent Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-2xl border border-beige-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-beige-100">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-charcoal-300" />
            <h3 className="text-sm font-bold text-charcoal-600">Recent Notifications</h3>
          </div>
          <Link
            href="/dashboard/notifications"
            className="text-xs text-gold hover:text-gold-dark font-medium"
          >
            View All
          </Link>
        </div>

        {recentNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={28} className="text-beige-300 mx-auto mb-2" />
            <p className="text-sm text-charcoal-300">No notifications yet</p>
            <p className="text-xs text-charcoal-200 mt-1">
              You&apos;ll receive updates about your circle, approvals, and more.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-beige-50">
            {recentNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`px-5 py-3 flex items-start gap-3 hover:bg-beige-50 transition-colors ${
                  !notif.is_read ? "bg-gold/5" : ""
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-beige-100 flex items-center justify-center shrink-0 mt-0.5">
                  {renderTypeIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.is_read ? "font-semibold text-charcoal-600" : "text-charcoal-400"}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-charcoal-300 mt-0.5 truncate">{notif.message}</p>
                </div>
                {!notif.is_read && (
                  <div className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Link
          href="/dashboard/support"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-beige-200 hover:border-gold hover:shadow-card transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <MessageSquare size={18} className="text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal-600">Contact Support</p>
            <p className="text-xs text-charcoal-300">Get help from our team</p>
          </div>
        </Link>

        <Link
          href="/dashboard/notifications"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-beige-200 hover:border-gold hover:shadow-card transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <Bell size={18} className="text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal-600">Notifications</p>
            <p className="text-xs text-charcoal-300">View all updates</p>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-beige-200 hover:border-gold hover:shadow-card transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <CircleDot size={18} className="text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal-600">Visit Website</p>
            <p className="text-xs text-charcoal-300">Back to main site</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
