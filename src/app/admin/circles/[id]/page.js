"use client";

import { useState, useEffect, useCallback, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  CircleDot, FileText, Users, Pin, Send, Loader2, MapPin,
  Copy, Check, Crown, Shield, Calendar, Search, Trash2,
  ChevronLeft, ChevronRight, Plus, Sparkles, CheckCircle2, X,
  MessageCircle, Clock, ArrowLeft, Eye, Filter, UserX, Info
} from "lucide-react";

const PRAYERS = ["Fajr", "Zuhr", "Asr", "Maghrib", "Isha"];

const REACTIONS = [
  { key: "alhamdulillah", label: "Alhamdulillah", emoji: "🤲" },
  { key: "mashallah",     label: "MashAllah",     emoji: "✨" },
  { key: "love",          label: "Love",           emoji: "❤️" },
];

const CATEGORY_CONFIG = {
  ibadat:       { label: "Ibadat",       color: "bg-emerald-50 text-emerald-700 border-emerald-200"  },
  business:     { label: "Business",     color: "bg-amber-50  text-amber-700  border-amber-200"      },
  announcement: { label: "Announcement", color: "bg-red-50    text-red-700    border-red-200"         },
  general:      { label: "General",      color: "bg-slate-50  text-slate-600  border-slate-200"      },
};

function RoleBadge({ role, email }) {
  if (email === "admin_access@taseescircle.com" || role === "super_admin") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wide border border-red-200">
        <Shield size={9} /> TaseesCircle Admin
      </span>
    );
  }
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gold/15 text-gold text-[10px] font-bold rounded-full uppercase tracking-wide">
        <Crown size={9} /> Circle Admin
      </span>
    );
  }
  if (role === "moderator") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wide">
        <Shield size={9} /> Mod
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 bg-beige-100 text-charcoal-300 text-[10px] font-bold rounded-full uppercase tracking-wide">
      Member
    </span>
  );
}

function Avatar({ src, name, size = "md" }) {
  const sizeMap = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  return src ? (
    <img src={src} alt={name || ""} className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-white shrink-0`} />
  ) : (
    <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-gold/60 to-gold flex items-center justify-center text-white font-bold ring-2 ring-white shrink-0`}>
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

export default function AdminCircleDetailPage({ params }) {
  const resolvedParams = use(params);
  const circleId = resolvedParams.id;
  const { user } = useAuth();

  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("feed");

  // Post creation state
  const [showCompose, setShowCompose] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postCategory, setPostCategory] = useState("general");
  const [postPinned, setPostPinned] = useState(false);
  const [posting, setPosting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

  // Member management state
  const [memberSearch, setMemberSearch] = useState("");
  const [updatingMemberId, setUpdatingMemberId] = useState(null);
  const [selectedMemberForHistory, setSelectedMemberForHistory] = useState(null);

  // Check-In Hub state
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkinFilter, setCheckinFilter] = useState("all"); // 'all', 'checked', 'missing'

  // Copy code state
  const [copied, setCopied] = useState(false);

  // Fetch all circle data
  const fetchData = useCallback(async () => {
    const supabase = createClient();
    if (!supabase || !circleId) return;

    try {
      // 1. Fetch Circle + Masjid info
      const { data: circleData, error: circleErr } = await supabase
        .from("circles")
        .select(`
          *,
          masjids(*, profiles!masjids_created_by_fkey(full_name, email))
        `)
        .eq("id", circleId)
        .single();

      if (circleErr) console.error("Error fetching circle:", circleErr);
      setCircle(circleData);

      if (!circleData?.masjids) {
        setLoading(false);
        return;
      }

      const masjidId = circleData.masjids.id;

      // 2. Fetch Circle Posts + Reactions
      const { data: postsData } = await supabase
        .from("circle_posts")
        .select(`
          *,
          profiles(full_name, avatar_url, email, role),
          circle_post_reactions(user_id, reaction)
        `)
        .eq("circle_id", circleId)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      setPosts(
        (postsData || []).map((p) => ({
          ...p,
          reactions: p.circle_post_reactions || [],
        }))
      );

      let finalMembers = membersData || [];
      const hasTaseesAdmin = finalMembers.some(
        (m) => m.profiles?.email === "admin_access@taseescircle.com"
      );
      if (!hasTaseesAdmin) {
        finalMembers = [
          {
            id: "taseescircle-system-admin",
            masjid_id: masjidId,
            joined_at: circleData.created_at || new Date().toISOString(),
            join_method: "system",
            role: "admin",
            profiles: {
              id: "taseescircle-admin-id",
              full_name: "TaseesCircle System Admin",
              avatar_url: null,
              email: "admin_access@taseescircle.com",
            },
          },
          ...finalMembers,
        ];
      }

      setMembers(finalMembers);

      // 4. Fetch Daily Prayer Reports for Circle
      const { data: reportsData } = await supabase
        .from("daily_reports")
        .select("*, profiles(id, full_name, email, avatar_url)")
        .eq("circle_id", circleId)
        .order("report_date", { ascending: false });

      setReports(reportsData || []);
    } catch (err) {
      console.error("Super Admin Circle fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [circleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Post Creation by Super Admin
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postBody.trim() || !user?.id) return;
    setPosting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("circle_posts")
        .insert({
          circle_id: circleId,
          posted_by: user.id,
          title: postTitle.trim(),
          body: postBody.trim(),
          category: postCategory,
          is_pinned: postPinned,
        })
        .select("*, profiles(full_name, avatar_url, email)")
        .single();

      if (!error && data) {
        setPosts((prev) => [{ ...data, reactions: [] }, ...prev]);
        setPostTitle("");
        setPostBody("");
        setPostPinned(false);
        setShowCompose(false);
      } else if (error) {
        alert("Failed to create post: " + error.message);
      }
    } finally {
      setPosting(false);
    }
  };

  // Handle Toggle Pin
  const handleTogglePin = async (post) => {
    const supabase = createClient();
    if (!supabase) return;
    const newPinned = !post.is_pinned;

    const { error } = await supabase
      .from("circle_posts")
      .update({ is_pinned: newPinned })
      .eq("id", post.id);

    if (!error) {
      setPosts((prev) =>
        prev
          .map((p) => (p.id === post.id ? { ...p, is_pinned: newPinned } : p))
          .sort((a, b) => (b.is_pinned === a.is_pinned ? 0 : b.is_pinned ? 1 : -1))
      );
    }
  };

  // Handle Delete Post
  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post as Super Admin?")) return;
    setDeletingPostId(postId);

    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("circle_posts").delete().eq("id", postId);
      if (!error) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        alert("Failed to delete post: " + error.message);
      }
    }
    setDeletingPostId(null);
  };

  // Handle Role Change for Member
  const handleRoleChange = async (memberId, newRole) => {
    setUpdatingMemberId(memberId);
    const supabase = createClient();
    if (supabase) {
      const targetMember = members.find((m) => m.id === memberId);
      const roleName = newRole === "admin" ? "Circle Admin" : newRole === "moderator" ? "Circle Moderator" : "Circle Member";
      const circleTitle = circle?.masjids?.name || circle?.name || "Circle";

      const { error } = await supabase
        .from("masjid_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (!error) {
        setMembers((prev) =>
          prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
        );

        // Send in-app notification to member
        if (targetMember?.user_id) {
          await supabase.from("notifications").insert({
            user_id: targetMember.user_id,
            title: "Role Updated",
            message: `Your role in ${circleTitle} has been updated to ${roleName} by TaseesCircle Admin.`,
            type: "general",
            link: `/dashboard/circles/${circleId}`,
          });
        }

        // Log admin audit action
        if (user?.id) {
          await supabase.from("admin_actions").insert({
            admin_id: user.id,
            masjid_id: circle?.masjids?.id || null,
            action_type: "update_role",
            notes: `Changed role of ${targetMember?.profiles?.full_name || targetMember?.profiles?.email || memberId} to ${newRole} in ${circleTitle}`,
          });
        }
      } else {
        alert("Failed to update role: " + error.message);
      }
    }
    setUpdatingMemberId(null);
  };

  // Handle Remove Member
  const handleRemoveMember = async (memberId, memberName) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from this circle?`)) return;
    setUpdatingMemberId(memberId);
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("masjid_members").delete().eq("id", memberId);
      if (!error) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
      } else {
        alert("Failed to remove member: " + error.message);
      }
    }
    setUpdatingMemberId(null);
  };

  // Copy code helper
  const copyCode = () => {
    if (circle?.masjids?.unique_code) {
      navigator.clipboard.writeText(circle.masjids.unique_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share WhatsApp helper
  const shareWhatsApp = () => {
    if (!circle?.masjids) return;
    const text = `Join our Masjid circle on Ta'sees Circle!\n\nMasjid: ${circle.masjids.name}\nCode: ${circle.masjids.unique_code}\n\nJoin here: ${window.location.origin}/dashboard/join-masjid`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-48 bg-beige-100 rounded-2xl" />
        <div className="h-12 bg-beige-100 rounded-xl" />
        <div className="h-64 bg-beige-100 rounded-2xl" />
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <CircleDot size={40} className="text-beige-300 mx-auto mb-3" />
        <h2 className="font-heading font-bold text-charcoal-600 text-xl mb-2">Circle Not Found</h2>
        <p className="text-sm text-charcoal-300 mb-6">This circle could not be located or does not exist.</p>
        <Link
          href="/admin/circles"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
        >
          <ArrowLeft size={16} /> Back to All Circles
        </Link>
      </div>
    );
  }

  const masjid = circle.masjids;
  const filteredMembers = members.filter((m) => {
    if (!memberSearch) return true;
    const q = memberSearch.toLowerCase();
    return (
      m.profiles?.full_name?.toLowerCase().includes(q) ||
      m.profiles?.email?.toLowerCase().includes(q)
    );
  });

  // Calculate Check-In Stats for Selected Date
  const reportsForDate = reports.filter((r) => r.report_date === selectedDate);
  const checkedInUserIds = new Set(reportsForDate.map((r) => r.user_id));

  // Compute breakdown of prayers for selected date
  const prayerCounts = { Fajr: 0, Zuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 };
  let totalPrayersCompleted = 0;
  reportsForDate.forEach((r) => {
    const pObj = r.ibadat_data?.prayers || {};
    PRAYERS.forEach((p) => {
      if (pObj[p]) {
        prayerCounts[p] += 1;
        totalPrayersCompleted += 1;
      }
    });
  });

  const totalPossiblePrayers = members.length * 5;
  const completionPercentage = totalPossiblePrayers > 0
    ? Math.round((totalPrayersCompleted / totalPossiblePrayers) * 100)
    : 0;

  // Filter members list for Prayer Check-In Hub
  const membersForCheckin = members.filter((m) => {
    const isCheckedIn = checkedInUserIds.has(m.profiles?.id);
    if (checkinFilter === "checked") return isCheckedIn;
    if (checkinFilter === "missing") return !isCheckedIn;
    return true;
  });

  // Member Reports History Modal data
  const selectedMemberReports = selectedMemberForHistory
    ? reports.filter((r) => r.user_id === selectedMemberForHistory.profiles?.id)
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Top Navigation & Back Button ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/circles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-400 hover:text-charcoal-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to All Circles
        </Link>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full uppercase border border-red-200">
          <Shield size={12} /> Super Admin Control
        </span>
      </div>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600 rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-lg"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CircleDot size={18} className="text-gold" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Super Admin Circle Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold leading-tight">
              {circle.name || masjid?.name}
            </h1>
            <p className="text-sm text-white/70 flex items-center gap-1.5 mt-2">
              <MapPin size={14} className="text-gold" /> {masjid?.area}, {masjid?.city}, {masjid?.country}
            </p>

            <div className="flex flex-wrap items-center gap-5 mt-5">
              <span className="flex items-center gap-1.5 text-xs text-white/80 font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Users size={14} className="text-gold" /> {members.length} Members
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/80 font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <FileText size={14} className="text-gold" /> {posts.length} Posts
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/80 font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 size={14} className="text-emerald-400" /> {reportsForDate.length} Check-ins Today
              </span>
            </div>
          </div>

          {/* Unique Code Card */}
          {masjid?.unique_code && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 min-w-[200px] shrink-0 border border-white/15 shadow-inner">
              <p className="text-[10px] uppercase tracking-widest text-white/60 font-semibold mb-1">
                Circle Join Code
              </p>
              <p className="text-2xl font-mono font-bold tracking-[0.2em] text-gold">
                {masjid.unique_code}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={copyCode}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-all border border-white/10"
                >
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={shareWhatsApp}
                  className="flex items-center justify-center p-2 bg-[#25D366] hover:bg-[#1ebe57] rounded-lg text-white transition-all"
                  title="Share on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Main Tab Bar ───────────────────────────────────────────────── */}
      <div className="flex rounded-2xl bg-beige-100 p-1.5 gap-1.5 overflow-x-auto scrollbar-none border border-beige-200">
        {[
          { key: "feed", label: `Circle Feed (${posts.length})`, icon: <MessageCircle size={16} /> },
          { key: "members", label: `Members (${members.length})`, icon: <Users size={16} /> },
          { key: "checkin", label: "Prayer Check-In Hub", icon: <CheckCircle2 size={16} /> },
          { key: "admin_tools", label: "Circle Admin Tools", icon: <Shield size={16} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
              tab === t.key
                ? "bg-white text-charcoal-600 shadow-sm border border-beige-200"
                : "text-charcoal-400 hover:text-charcoal-600 hover:bg-beige-200/60"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: CIRCLE FEED ─────────────────────────────────────────── */}
      {tab === "feed" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Super Admin Compose Box */}
          {!showCompose ? (
            <button
              onClick={() => setShowCompose(true)}
              className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border-2 border-dashed border-beige-300 text-charcoal-400 hover:border-gold hover:text-gold transition-all text-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                  <Plus size={18} />
                </div>
                <span className="font-medium">Post to this circle as Super Admin…</span>
              </div>
              <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold uppercase border border-red-200">
                Super Admin
              </span>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-beige-200 shadow-card overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-beige-100 bg-beige-50">
                <span className="text-sm font-bold text-charcoal-600 flex items-center gap-2">
                  <Shield size={14} className="text-red-500" /> New Super Admin Post
                </span>
                <button
                  onClick={() => setShowCompose(false)}
                  className="p-1 rounded-lg hover:bg-beige-200 transition-colors"
                >
                  <X size={18} className="text-charcoal-400" />
                </button>
              </div>
              <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Post title…"
                  required
                  className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-600 placeholder:text-charcoal-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                />
                <textarea
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                  placeholder="Write your post content for this circle…"
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-600 placeholder:text-charcoal-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none resize-none"
                />
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="px-3 py-2 border border-beige-300 rounded-lg text-xs text-charcoal-500 focus:border-gold outline-none bg-white font-medium"
                    >
                      {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 text-xs text-charcoal-500 font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={postPinned}
                        onChange={(e) => setPostPinned(e.target.checked)}
                        className="accent-gold w-4 h-4"
                      />
                      <Pin size={13} className="text-gold" /> Pin post to top
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCompose(false)}
                      className="px-4 py-2.5 text-xs text-charcoal-400 font-semibold hover:text-charcoal-600 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={posting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 shadow-md"
                    >
                      {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      {posting ? "Publishing…" : "Publish Post"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* Posts List */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-beige-200 p-12 text-center">
              <FileText size={40} className="text-beige-300 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-charcoal-600 text-base mb-1">No Posts in Circle</h3>
              <p className="text-sm text-charcoal-300">
                Create a new post above to share announcements or updates with this circle.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const catCfg = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG.general;
                const isTaseesPost =
                  post.profiles?.email === "admin_access@taseescircle.com" ||
                  post.profiles?.role === "super_admin" ||
                  !post.profiles?.full_name ||
                  post.profiles?.full_name === "Unknown";

                const authorName = isTaseesPost
                  ? "TaseesCircle Admin"
                  : post.profiles?.full_name || "Circle Member";

                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-2xl border border-beige-200 overflow-hidden hover:shadow-md transition-all ${
                      post.is_pinned ? "border-l-4 border-l-gold" : ""
                    }`}
                  >
                    {post.is_pinned && (
                      <div className="flex items-center gap-1.5 px-6 py-2 bg-gold/10 border-b border-gold/20">
                        <Pin size={12} className="text-gold" />
                        <span className="text-[11px] font-bold text-gold uppercase tracking-wider">
                          Pinned Post
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          {isTaseesPost ? (
                            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white shadow-xs ring-2 ring-white shrink-0">
                              <Shield size={16} />
                            </div>
                          ) : (
                            <Avatar src={post.profiles?.avatar_url} name={post.profiles?.full_name} size="sm" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-charcoal-600">{authorName}</p>
                              {isTaseesPost && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wide border border-red-200">
                                  <Shield size={9} /> Official Announcement
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-charcoal-300 flex items-center gap-1 mt-0.5">
                              <Clock size={11} />
                              {new Date(post.created_at).toLocaleDateString("en-PK", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${catCfg.color}`}>
                            {catCfg.label}
                          </span>
                          {/* Super Admin Actions */}
                          <button
                            onClick={() => handleTogglePin(post)}
                            title={post.is_pinned ? "Unpin Post" : "Pin Post"}
                            className={`p-2 rounded-lg border transition-colors ${
                              post.is_pinned
                                ? "bg-gold/10 text-gold border-gold/30"
                                : "bg-beige-50 text-charcoal-400 border-beige-200 hover:bg-beige-100"
                            }`}
                          >
                            <Pin size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deletingPostId === post.id}
                            title="Delete Post (Super Admin)"
                            className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {deletingPostId === post.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </div>

                      <h3 className="font-heading font-bold text-charcoal-600 text-lg mb-2">{post.title}</h3>
                      <p className="text-sm text-charcoal-400 leading-relaxed whitespace-pre-wrap">{post.body}</p>

                      {/* Reaction counts summary */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-beige-100 text-xs text-charcoal-300">
                        {REACTIONS.map((r) => {
                          const cnt = (post.reactions || []).filter((x) => x.reaction === r.key).length;
                          return (
                            <span
                              key={r.key}
                              className="px-2.5 py-1 bg-beige-50 rounded-full border border-beige-200 text-charcoal-500 font-medium"
                            >
                              {r.emoji} {r.label} ({cnt})
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ── TAB 2: MEMBERS DIRECTORY ────────────────────────────────────── */}
      {tab === "members" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search members by name or email…"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-beige-200 rounded-xl text-sm text-charcoal-600 placeholder:text-charcoal-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none shadow-sm"
            />
          </div>

          <div className="bg-white rounded-2xl border border-beige-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-beige-50 border-b border-beige-100 flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">
                Total {filteredMembers.length} Circle Member{filteredMembers.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-beige-50">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-beige-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar src={member.profiles?.avatar_url} name={member.profiles?.full_name} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-charcoal-600 truncate">
                          {member.profiles?.full_name || "Anonymous Member"}
                        </p>
                        <RoleBadge role={member.role} email={member.profiles?.email} />
                      </div>
                      <p className="text-xs text-charcoal-300 truncate mt-0.5">{member.profiles?.email}</p>
                      <p className="text-[11px] text-charcoal-200 mt-0.5">
                        Joined {new Date(member.joined_at).toLocaleDateString()} • Method: {member.join_method || "code"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Prayer History Button */}
                    <button
                      onClick={() => setSelectedMemberForHistory(member)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-beige-100 hover:bg-beige-200 text-charcoal-600 text-xs font-semibold rounded-lg transition-colors border border-beige-200"
                    >
                      <Eye size={13} className="text-islamic-green" /> View Prayer Log
                    </button>

                    {member.profiles?.email !== "admin_access@taseescircle.com" && (
                      <>
                        {/* Change Role Dropdown */}
                        <select
                          value={member.role}
                          disabled={updatingMemberId === member.id}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          className="px-3 py-1.5 bg-white border border-beige-300 rounded-lg text-xs font-semibold text-charcoal-600 focus:border-gold outline-none"
                        >
                          <option value="admin">Circle Admin</option>
                          <option value="moderator">Moderator</option>
                          <option value="member">Member</option>
                        </select>

                        {/* Remove Member Button */}
                        <button
                          onClick={() => handleRemoveMember(member.id, member.profiles?.full_name)}
                          disabled={updatingMemberId === member.id}
                          title="Remove Member from Circle"
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors disabled:opacity-50"
                        >
                          <UserX size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAB 3: PRAYER CHECK-IN HUB ─────────────────────────────────── */}
      {tab === "checkin" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Header Controls & Date Selector */}
          <div className="bg-white rounded-2xl border border-beige-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-bold text-charcoal-600 text-lg flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-islamic-green" />
                  Circle Member Prayer Check-Ins
                </h2>
                <p className="text-xs text-charcoal-300 mt-1">
                  Monitor daily prayer completions and reflections for all members in this circle.
                </p>
              </div>

              {/* Date Selector */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-beige-300 rounded-xl text-xs font-semibold text-charcoal-600 focus:border-gold outline-none bg-beige-50"
                />
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
                  className="px-3 py-2 bg-beige-100 hover:bg-beige-200 text-charcoal-600 text-xs font-semibold rounded-xl transition-colors"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Overall Completion Metrics Banner */}
            <div className="bg-gradient-to-r from-islamic-green/10 via-islamic-green/5 to-transparent rounded-xl p-5 border border-islamic-green/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-islamic-green">
                    Circle Prayer Completion Rate ({selectedDate})
                  </p>
                  <p className="text-2xl font-bold text-charcoal-600 mt-1">
                    {completionPercentage}%{" "}
                    <span className="text-xs font-medium text-charcoal-300">
                      ({totalPrayersCompleted} of {totalPossiblePrayers} total prayers logged)
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center px-4 py-2 bg-white rounded-xl border border-beige-200">
                    <p className="text-lg font-bold text-charcoal-600">{reportsForDate.length}</p>
                    <p className="text-[10px] text-charcoal-300 font-semibold uppercase">Checked In</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-white rounded-xl border border-beige-200">
                    <p className="text-lg font-bold text-charcoal-600">{members.length - reportsForDate.length}</p>
                    <p className="text-[10px] text-charcoal-300 font-semibold uppercase">Missing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Per-Prayer Breakdown Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {PRAYERS.map((p) => {
                const count = prayerCounts[p];
                const pct = members.length > 0 ? Math.round((count / members.length) * 100) : 0;
                return (
                  <div key={p} className="bg-beige-50 rounded-xl p-3 border border-beige-200 text-center">
                    <p className="text-xs font-bold text-charcoal-500 uppercase">{p}</p>
                    <p className="text-xl font-bold text-islamic-green mt-1">{count} <span className="text-xs text-charcoal-300 font-normal">/ {members.length}</span></p>
                    <p className="text-[10px] text-charcoal-300 font-medium mt-0.5">{pct}% members</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Bar & Member Prayer Cards */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {["all", "checked", "missing"].map((f) => (
                <button
                  key={f}
                  onClick={() => setCheckinFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    checkinFilter === f
                      ? "bg-charcoal-600 text-white"
                      : "bg-white text-charcoal-400 border border-beige-200 hover:bg-beige-50"
                  }`}
                >
                  {f === "all" ? `All (${members.length})` : f === "checked" ? `Checked In (${reportsForDate.length})` : `Missing (${members.length - reportsForDate.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Member Check-In Status List */}
          <div className="bg-white rounded-2xl border border-beige-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-beige-100">
              {membersForCheckin.length === 0 ? (
                <div className="p-8 text-center text-sm text-charcoal-300">No members match this filter.</div>
              ) : (
                membersForCheckin.map((member) => {
                  const report = reportsForDate.find((r) => r.user_id === member.profiles?.id);
                  const pObj = report?.ibadat_data?.prayers || {};
                  const prayedCount = PRAYERS.filter((p) => pObj[p]).length;

                  return (
                    <div key={member.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <Avatar src={member.profiles?.avatar_url} name={member.profiles?.full_name} size="md" />
                        <div>
                          <p className="text-sm font-bold text-charcoal-600">{member.profiles?.full_name || "Unknown User"}</p>
                          <p className="text-xs text-charcoal-300">{member.profiles?.email}</p>
                          {report?.ibadat_data?.reflection && (
                            <p className="text-xs text-charcoal-500 italic mt-1 bg-beige-50 px-3 py-1.5 rounded-lg border border-beige-200">
                              &ldquo;{report.ibadat_data.reflection}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Prayer Checkmarks */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          {PRAYERS.map((p) => {
                            const isPrayed = pObj[p];
                            return (
                              <span
                                key={p}
                                title={`${p}: ${isPrayed ? "Prayed" : "Not Prayed"}`}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                  isPrayed
                                    ? "bg-islamic-green text-white shadow-xs"
                                    : "bg-beige-100 text-charcoal-300"
                                }`}
                              >
                                {p}
                              </span>
                            );
                          })}
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            prayedCount === 5
                              ? "bg-emerald-100 text-emerald-700"
                              : prayedCount > 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-beige-100 text-charcoal-300"
                          }`}
                        >
                          {prayedCount}/5
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAB 4: CIRCLE ADMIN TOOLS & DETAILS ──────────────────────── */}
      {tab === "admin_tools" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Invite Code & Share Card */}
          <div className="bg-white rounded-2xl border border-beige-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
                <Sparkles size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="text-base font-bold text-charcoal-600">Circle Invite Code</h3>
                <p className="text-xs text-charcoal-300">Share this code with community members to join this circle</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-beige-50 rounded-xl mb-4 border border-beige-200">
              <span className="text-3xl font-mono font-bold tracking-[0.25em] text-gold flex-1">
                {masjid?.unique_code || "N/A"}
              </span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-beige-300 rounded-lg text-xs font-semibold text-charcoal-600 hover:border-gold hover:text-gold transition-all"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <button
              onClick={shareWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-sm font-bold rounded-xl hover:bg-[#1ebe57] transition-all shadow-sm"
            >
              Share Join Code on WhatsApp
            </button>
          </div>

          {/* Circle Overview Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-beige-200 p-5">
              <p className="text-xs text-charcoal-300 font-semibold uppercase">Total Members</p>
              <p className="text-3xl font-bold text-charcoal-600 mt-2">{members.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-beige-200 p-5">
              <p className="text-xs text-charcoal-300 font-semibold uppercase">Admins / Mods</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">
                {members.filter((m) => m.role === "admin" || m.role === "moderator" || m.profiles?.email === "admin_access@taseescircle.com").length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-beige-200 p-5">
              <p className="text-xs text-charcoal-300 font-semibold uppercase">Circle Posts</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{posts.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-beige-200 p-5">
              <p className="text-xs text-charcoal-300 font-semibold uppercase">Total Check-Ins</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{reports.length}</p>
            </div>
          </div>

          {/* Masjid Metadata */}
          <div className="bg-white rounded-2xl border border-beige-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-charcoal-600 flex items-center gap-2">
              <Info size={18} className="text-gold" /> Masjid Metadata & Creator Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-beige-50 rounded-xl border border-beige-200">
                <p className="text-xs font-semibold text-charcoal-300 uppercase">Masjid Name</p>
                <p className="font-bold text-charcoal-600 mt-1">{masjid?.name}</p>
              </div>
              <div className="p-4 bg-beige-50 rounded-xl border border-beige-200">
                <p className="text-xs font-semibold text-charcoal-300 uppercase">Location</p>
                <p className="font-bold text-charcoal-600 mt-1">
                  {masjid?.area}, {masjid?.city}, {masjid?.country} ({masjid?.zip_code})
                </p>
              </div>
              <div className="p-4 bg-beige-50 rounded-xl border border-beige-200">
                <p className="text-xs font-semibold text-charcoal-300 uppercase">Created By</p>
                <p className="font-bold text-charcoal-600 mt-1">
                  {masjid?.profiles?.full_name || "Unknown Creator"} ({masjid?.profiles?.email || "No email"})
                </p>
              </div>
              <div className="p-4 bg-beige-50 rounded-xl border border-beige-200">
                <p className="text-xs font-semibold text-charcoal-300 uppercase">Approval Date</p>
                <p className="font-bold text-charcoal-600 mt-1">
                  {masjid?.approved_at ? new Date(masjid.approved_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── MEMBER PRAYER HISTORY MODAL ───────────────────────────────── */}
      <AnimatePresence>
        {selectedMemberForHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl border border-beige-200 flex flex-col"
            >
              <div className="p-5 bg-beige-50 border-b border-beige-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={selectedMemberForHistory.profiles?.avatar_url}
                    name={selectedMemberForHistory.profiles?.full_name}
                    size="sm"
                  />
                  <div>
                    <h3 className="font-bold text-charcoal-600 text-sm">
                      {selectedMemberForHistory.profiles?.full_name}
                    </h3>
                    <p className="text-xs text-charcoal-300">{selectedMemberForHistory.profiles?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMemberForHistory(null)}
                  className="p-1 rounded-lg hover:bg-beige-200 transition-colors"
                >
                  <X size={18} className="text-charcoal-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                  Prayer History ({selectedMemberReports.length} total entries logged)
                </h4>

                {selectedMemberReports.length === 0 ? (
                  <p className="text-sm text-charcoal-300 text-center py-6">
                    No prayer check-ins recorded for this member yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedMemberReports.map((rep) => {
                      const pObj = rep.ibadat_data?.prayers || {};
                      const count = PRAYERS.filter((p) => pObj[p]).length;
                      return (
                        <div key={rep.id} className="p-4 bg-beige-50 rounded-xl border border-beige-200 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-charcoal-600">{rep.report_date}</span>
                            <span className="font-bold text-islamic-green">{count}/5 Prayers</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {PRAYERS.map((p) => (
                              <span
                                key={p}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  pObj[p] ? "bg-islamic-green text-white" : "bg-beige-200 text-charcoal-300"
                                }`}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                          {rep.ibadat_data?.reflection && (
                            <p className="text-xs text-charcoal-500 italic pt-1 border-t border-beige-200">
                              &ldquo;{rep.ibadat_data.reflection}&rdquo;
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
