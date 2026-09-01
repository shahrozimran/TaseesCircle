"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Users, CircleDot, CheckCircle, Clock, Ticket,
  TrendingUp, ArrowRight,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMasjids: 0,
    pendingApprovals: 0,
    openTickets: 0,
    totalCircles: 0,
    totalMembers: 0,
  });
  const [recentApprovals, setRecentApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      const supabase = createClient();
      if (!supabase) return;

      try {
        const [
          { count: totalUsers },
          { count: totalMasjids },
          { count: pendingApprovals },
          { count: openTickets },
          { count: totalCircles },
          { count: totalMembers },
        ] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("masjids").select("id", { count: "exact", head: true }),
          supabase.from("masjids").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
          supabase.from("circles").select("id", { count: "exact", head: true }),
          supabase.from("masjid_members").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          totalUsers: totalUsers || 0,
          totalMasjids: totalMasjids || 0,
          pendingApprovals: pendingApprovals || 0,
          openTickets: openTickets || 0,
          totalCircles: totalCircles || 0,
          totalMembers: totalMembers || 0,
        });

        // Recent pending masjids
        const { data: pending } = await supabase
          .from("masjids")
          .select("id, name, city, country, created_at, profiles!masjids_created_by_fkey(full_name)")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5);
        setRecentApprovals(pending || []);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-50 text-blue-600", iconBg: "bg-blue-100" },
    { label: "Total Masjids", value: stats.totalMasjids, icon: CircleDot, color: "bg-islamic-green/10 text-islamic-green", iconBg: "bg-islamic-green/20" },
    { label: "Pending Approvals", value: stats.pendingApprovals, icon: Clock, color: "bg-amber-50 text-amber-600", iconBg: "bg-amber-100", urgent: stats.pendingApprovals > 0 },
    { label: "Open Tickets", value: stats.openTickets, icon: Ticket, color: "bg-red-50 text-red-600", iconBg: "bg-red-100", urgent: stats.openTickets > 0 },
    { label: "Active Circles", value: stats.totalCircles, icon: TrendingUp, color: "bg-purple-50 text-purple-600", iconBg: "bg-purple-100" },
    { label: "Circle Members", value: stats.totalMembers, icon: Users, color: "bg-gold/10 text-gold", iconBg: "bg-gold/20" },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-beige-200 rounded-lg w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 bg-beige-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600">Admin Overview</h1>
        <p className="text-sm text-charcoal-300 mt-1">Platform-wide statistics and quick actions</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-2xl border p-5 ${
              stat.urgent ? "border-red-200 shadow-card" : "border-beige-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon size={18} className={stat.color.split(" ")[1]} />
              </div>
            </div>
            <p className="text-2xl font-bold text-charcoal-600">{stat.value}</p>
            <p className="text-xs text-charcoal-300 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/approvals"
          className="bg-white rounded-2xl border border-beige-200 p-5 hover:border-gold hover:shadow-card transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <CheckCircle size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal-600">Masjid Approvals</p>
              <p className="text-xs text-charcoal-300">{stats.pendingApprovals} pending</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-charcoal-300 group-hover:text-gold transition-colors" />
        </Link>

        <Link
          href="/admin/tickets"
          className="bg-white rounded-2xl border border-beige-200 p-5 hover:border-gold hover:shadow-card transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Ticket size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal-600">Support Tickets</p>
              <p className="text-xs text-charcoal-300">{stats.openTickets} open</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-charcoal-300 group-hover:text-gold transition-colors" />
        </Link>
      </div>

      {/* Recent Pending Approvals */}
      {recentApprovals.length > 0 && (
        <div className="bg-white rounded-2xl border border-beige-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-beige-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal-600">Recent Pending Masjids</h3>
            <Link href="/admin/approvals" className="text-xs text-gold font-medium">View All →</Link>
          </div>
          <div className="divide-y divide-beige-50">
            {recentApprovals.map((masjid) => (
              <div key={masjid.id} className="px-5 py-3 flex items-center justify-between hover:bg-beige-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-charcoal-600">{masjid.name}</p>
                  <p className="text-[11px] text-charcoal-300">
                    {masjid.city}, {masjid.country} · by {masjid.profiles?.full_name || "Unknown"}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full uppercase">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
