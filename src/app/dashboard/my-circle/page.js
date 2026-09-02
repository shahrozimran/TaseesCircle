"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  CircleDot, Users, MapPin, Copy, Check, Share2,
  Settings, UserPlus, Shield, Crown, UserMinus,
  MessageSquare, ExternalLink, Loader2,
} from "lucide-react";

export default function MyCirclePage() {
  const { user, profile, refetchProfile } = useAuth();
  const router = useRouter();
  const [masjid, setMasjid] = useState(null);
  const [members, setMembers] = useState([]);
  const [circle, setCircle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      if (!supabase) return;

      try {
        let activeMasjidId = profile?.current_masjid_id;

        // ── FALLBACK HEAL ──────────────────────────────────────────────
        // If current_masjid_id is null, check masjid_members directly.
        // This heals profiles stale from the old RLS bug.
        if (!activeMasjidId) {
          const { data: membership } = await supabase
            .from("masjid_members")
            .select("masjid_id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (membership?.masjid_id) {
            activeMasjidId = membership.masjid_id;
            refetchProfile(); // update profile in background
          } else {
            // Truly no circle — redirect to dashboard
            router.push("/dashboard");
            return;
          }
        }
        // ────────────────────────────────────────────────────────────────

        // Fetch masjid data
        const { data: masjidData } = await supabase
          .from("masjids")
          .select("*")
          .eq("id", activeMasjidId)
          .single();
        setMasjid(masjidData);

        // Fetch circle data
        const { data: circleData } = await supabase
          .from("circles")
          .select("*")
          .eq("masjid_id", activeMasjidId)
          .maybeSingle();
        setCircle(circleData);

        // Fetch members
        const { data: memberData } = await supabase
          .from("masjid_members")
          .select(`
            id, role, join_method, joined_at,
            profiles (id, full_name, avatar_url, email)
          `)
          .eq("masjid_id", activeMasjidId)
          .order("joined_at", { ascending: true });
        // Filter out system admin accounts — should never show in user-facing member list
        setMembers(
          (memberData || []).filter(
            (m) =>
              m.profiles?.email !== "admin_access@taseescircle.com" &&
              m.profiles?.role !== "super_admin"
          )
        );
      } catch (err) {
        console.error("Error fetching circle data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && profile !== null && profile !== undefined) {
      fetchData();
    }
  }, [profile, user?.id, router, refetchProfile]);


  const isAdmin = members.find((m) => m.profiles?.id === user?.id)?.role === "admin";
  const isMod = members.find((m) => m.profiles?.id === user?.id)?.role === "moderator";
  const canManage = isAdmin || isMod;

  const copyCode = () => {
    if (masjid?.unique_code) {
      navigator.clipboard.writeText(masjid.unique_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const text = `Join our Masjid circle on Ta'sees Circle!\n\nMasjid: ${masjid?.name}\nCode: ${masjid?.unique_code}\n\nJoin here: ${window.location.origin}/join?masjid=${masjid?.unique_code}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-gold/10 text-gold text-[10px] font-bold rounded-full uppercase">
            <Crown size={10} /> Admin
          </span>
        );
      case "moderator":
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase">
            <Shield size={10} /> Moderator
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-beige-100 text-charcoal-300 text-[10px] font-bold rounded-full uppercase">
            Member
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-40 bg-beige-100 rounded-2xl" />
        <div className="h-60 bg-beige-100 rounded-2xl" />
      </div>
    );
  }

  if (!masjid) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CircleDot size={48} className="text-beige-300 mx-auto mb-4" />
        <h2 className="font-heading font-bold text-charcoal-600 text-xl mb-2">No Circle Found</h2>
        <p className="text-sm text-charcoal-300 mb-6">You haven&apos;t joined any circle yet.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Circle Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-charcoal-600 to-charcoal-500 rounded-2xl p-6 sm:p-8 text-white islamic-pattern"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CircleDot size={18} className="text-gold" />
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">Your Circle</span>
              {canManage && getRoleBadge(isAdmin ? "admin" : "moderator")}
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold">{masjid.name}</h1>
            <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
              <MapPin size={14} /> {masjid.area}, {masjid.city}, {masjid.country}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs text-white/60">
                <Users size={14} /> {masjid.member_count} members
              </span>
            </div>
          </div>

          {/* Code & Share */}
          {masjid.unique_code && (
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[180px]">
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Circle Code</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold tracking-[0.2em] text-gold">
                  {masjid.unique_code}
                </span>
                <button
                  onClick={copyCode}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white/60" />}
                </button>
              </div>
              <button
                onClick={shareWhatsApp}
                className="flex items-center gap-1 mt-2 text-[11px] text-white/50 hover:text-white transition-colors"
              >
                <Share2 size={12} /> Share on WhatsApp
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-beige-100 p-1 overflow-x-auto">
        {[
          { key: "overview", label: "Overview" },
          { key: "members", label: `Members (${members.length})` },
          ...(circle ? [{ key: "circle", label: "View Circle" }] : []),
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap px-4 ${
              activeTab === tab.key
                ? "bg-white text-charcoal-600 shadow-sm"
                : "text-charcoal-300 hover:text-charcoal-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {masjid.description && (
            <div className="bg-white rounded-2xl border border-beige-200 p-6">
              <h3 className="font-heading font-bold text-charcoal-600 text-sm mb-2">About</h3>
              <p className="text-sm text-charcoal-400 leading-relaxed">{masjid.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-beige-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Users size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-charcoal-600">{masjid.member_count}</p>
                  <p className="text-xs text-charcoal-300">Total Members</p>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/support"
              className="bg-white rounded-2xl border border-beige-200 p-5 hover:border-gold transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <MessageSquare size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-600">Contact Support</p>
                  <p className="text-xs text-charcoal-300">Get help from our team</p>
                </div>
              </div>
            </Link>
          </div>

          {circle && (
            <Link
              href={`/dashboard/circles/${circle.id}`}
              className="block bg-white rounded-2xl border-2 border-islamic-green/20 p-5 hover:border-islamic-green hover:shadow-card transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-islamic-green/10 flex items-center justify-center group-hover:bg-islamic-green/20 transition-colors">
                    <CircleDot size={18} className="text-islamic-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-600">Enter Your Circle</p>
                    <p className="text-xs text-charcoal-300">View posts, content & community</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-charcoal-300 group-hover:text-islamic-green transition-colors" />
              </div>
            </Link>
          )}
        </motion.div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-2xl border border-beige-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-beige-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal-600">Members</h3>
              {canManage && (
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gold/10 text-gold text-xs font-medium rounded-lg hover:bg-gold/20 transition-colors"
                >
                  <UserPlus size={12} /> Invite
                </button>
              )}
            </div>
            <div className="divide-y divide-beige-50">
              {members.map((member) => (
                <div key={member.id} className="px-5 py-3 flex items-center gap-3 hover:bg-beige-50 transition-colors">
                  {member.profiles?.avatar_url ? (
                    <img
                      src={member.profiles.avatar_url}
                      alt={member.profiles.full_name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-beige-200 flex items-center justify-center text-charcoal-400 text-sm font-bold">
                      {member.profiles?.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal-600 truncate">
                      {member.profiles?.full_name || "Unknown"}
                    </p>
                    <p className="text-[11px] text-charcoal-300">
                      Joined {new Date(member.joined_at).toLocaleDateString()} via {member.join_method}
                    </p>
                  </div>
                  {getRoleBadge(member.role)}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Circle Tab */}
      {activeTab === "circle" && circle && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
          <Link
            href={`/dashboard/circles/${circle.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
          >
            Enter Circle View
            <ExternalLink size={16} />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
