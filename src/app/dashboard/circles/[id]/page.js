"use client";

import { useState, useEffect, useCallback, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  CircleDot, FileText, Users, Pin, Send, Loader2, MapPin,
  Copy, Check, Crown, Shield, User, Calendar, Search,
  ChevronRight, Plus, Bell, Heart, Star, HandMetal,
  Settings, UserCog, RefreshCw, Sparkles, BookOpen,
  CheckCircle2, X, MessageCircle, Clock, ArrowLeft,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  if (role === "admin")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/15 text-gold text-[10px] font-bold rounded-full uppercase tracking-wide">
        <Crown size={9} /> Circle Admin
      </span>
    );
  if (role === "moderator")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wide">
        <Shield size={9} /> Mod
      </span>
    );
  return (
    <span className="px-2 py-0.5 bg-beige-100 text-charcoal-300 text-[10px] font-bold rounded-full uppercase tracking-wide">
      Member
    </span>
  );
}

function Avatar({ src, name, size = "md" }) {
  const sizeMap = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  return src ? (
    <img src={src} alt={name} className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-white`} />
  ) : (
    <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-gold/60 to-gold flex items-center justify-center text-white font-bold ring-2 ring-white`}>
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, userId, circleId, onReact }) {
  const [reactions, setReactions] = useState(post.reactions || []);
  const [reacting, setReacting]   = useState(null);

  const myReactions = reactions
    .filter((r) => r.user_id === userId)
    .map((r) => r.reaction);

  const countByType = (type) => reactions.filter((r) => r.reaction === type).length;

  const handleReact = async (type) => {
    if (reacting) return;
    setReacting(type);
    const alreadyReacted = myReactions.includes(type);

    // Optimistic update
    if (alreadyReacted) {
      setReactions((prev) => prev.filter((r) => !(r.user_id === userId && r.reaction === type)));
    } else {
      setReactions((prev) => [...prev, { user_id: userId, reaction: type }]);
    }

    await onReact(post.id, type, alreadyReacted);
    setReacting(null);
  };

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border border-beige-200 overflow-hidden hover:shadow-md transition-shadow ${post.is_pinned ? "border-l-4 border-l-gold" : ""}`}
    >
      {post.is_pinned && (
        <div className="flex items-center gap-1.5 px-5 py-2 bg-gold/8 border-b border-gold/20">
          <Pin size={12} className="text-gold" />
          <span className="text-[11px] font-semibold text-gold uppercase tracking-wide">Pinned</span>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
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
                <Clock size={10} />
                {new Date(post.created_at).toLocaleDateString("en-PK", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${catCfg.color}`}>
            {catCfg.label}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-heading font-bold text-charcoal-600 text-base mb-2 leading-snug">{post.title}</h3>
        <p className="text-sm text-charcoal-400 leading-relaxed whitespace-pre-wrap">{post.body}</p>

        {/* Reactions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-beige-100">
          {REACTIONS.map((r) => {
            const count = countByType(r.key);
            const mine  = myReactions.includes(r.key);
            return (
              <button
                key={r.key}
                onClick={() => handleReact(r.key)}
                disabled={reacting === r.key}
                title={r.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                  ${mine
                    ? "bg-gold/10 border-gold/30 text-gold"
                    : "bg-beige-50 border-beige-200 text-charcoal-300 hover:bg-beige-100 hover:border-beige-300"
                  }`}
              >
                <span className="text-base leading-none">{r.emoji}</span>
                {count > 0 && <span>{count}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Compose Box ──────────────────────────────────────────────────────────────
function ComposeBox({ circleId, userId, onPost }) {
  const [open,     setOpen]     = useState(false);
  const [title,    setTitle]    = useState("");
  const [body,     setBody]     = useState("");
  const [category, setCategory] = useState("general");
  const [pinned,   setPinned]   = useState(false);
  const [saving,   setSaving]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("circle_posts")
        .insert({
          circle_id:  circleId,
          posted_by:  userId,
          title:      title.trim(),
          body:       body.trim(),
          category,
          is_pinned:  pinned,
        })
        .select("*, profiles(full_name, avatar_url)")
        .single();

      if (!error && data) {
        onPost({ ...data, reactions: [] });
        setTitle(""); setBody(""); setPinned(false); setOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border-2 border-dashed border-beige-300 text-charcoal-300 hover:border-gold hover:text-gold transition-all group text-sm"
      >
        <div className="w-8 h-8 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
          <Plus size={16} />
        </div>
        <span>Share something with your circle…</span>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-beige-200 shadow-card overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-beige-100 bg-beige-50">
        <span className="text-sm font-semibold text-charcoal-600">New Post</span>
        <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-beige-200 transition-colors">
          <X size={16} className="text-charcoal-400" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title…"
          required
          className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-600 placeholder:text-charcoal-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your post…"
          rows={4}
          required
          className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-600 placeholder:text-charcoal-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none resize-none"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-beige-300 rounded-lg text-xs text-charcoal-500 focus:border-gold outline-none"
            >
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 text-xs text-charcoal-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="accent-gold"
              />
              <Pin size={12} /> Pin post
            </label>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-xs text-charcoal-400 font-medium hover:text-charcoal-600 rounded-lg">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 bg-gradient-gold text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              {saving ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

// ─── Prayer Check-In ──────────────────────────────────────────────────────────
function CheckInTab({ circleId, userId }) {
  const [prayers,    setPrayers]    = useState({});
  const [reflection, setReflection] = useState("");
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [existing,   setExisting]   = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      if (!supabase) return;
      const { data } = await supabase
        .from("daily_reports")
        .select("*")
        .eq("user_id", userId)
        .eq("report_date", today)
        .maybeSingle();
      if (data) {
        setExisting(data);
        setPrayers(data.ibadat_data?.prayers || {});
        setReflection(data.ibadat_data?.reflection || "");
      }
    };
    if (userId) load();
  }, [userId, today]);

  const togglePrayer = (p) =>
    setPrayers((prev) => ({ ...prev, [p]: !prev[p] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      if (!supabase) return;
      const payload = {
        user_id:    userId,
        circle_id:  circleId,
        report_date: today,
        ibadat_data: { prayers, reflection },
      };
      if (existing) {
        await supabase.from("daily_reports").update(payload).eq("id", existing.id);
      } else {
        const { data } = await supabase.from("daily_reports").insert(payload).select().single();
        setExisting(data);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const prayedCount = PRAYERS.filter((p) => prayers[p]).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Date banner */}
      <div className="bg-gradient-to-br from-islamic-green to-islamic-green-light rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={16} />
          <span className="text-sm font-semibold">Daily Prayer Check-In</span>
        </div>
        <p className="text-xs text-white/70">
          {new Date().toLocaleDateString("en-PK", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${(prayedCount / 5) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold">{prayedCount}/5</span>
        </div>
        {prayedCount === 5 && (
          <p className="mt-2 text-xs text-white/90 font-medium">MashAllah! All prayers completed today 🤲</p>
        )}
      </div>

      {/* Prayer toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {PRAYERS.map((p) => (
          <button
            key={p}
            onClick={() => togglePrayer(p)}
            className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 transition-all font-medium text-sm
              ${prayers[p]
                ? "bg-islamic-green border-islamic-green text-white shadow-md scale-105"
                : "bg-white border-beige-200 text-charcoal-400 hover:border-islamic-green/50"
              }`}
          >
            {prayers[p] ? <CheckCircle2 size={22} /> : <div className="w-5 h-5 rounded-full border-2 border-current opacity-40" />}
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Reflection */}
      <div className="bg-white rounded-2xl border border-beige-200 p-5">
        <label className="block text-xs font-semibold text-charcoal-400 mb-2 uppercase tracking-wider">
          Reflection (optional)
        </label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Any thoughts, goals, or duas for today…"
          rows={3}
          className="w-full px-4 py-3 border border-beige-200 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-islamic-green focus:ring-2 focus:ring-islamic-green/20 outline-none resize-none"
        />
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium"
        >
          <CheckCircle2 size={16} /> Alhamdulillah! Check-in saved.
        </motion.div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-islamic-green to-islamic-green-light text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
        {saving ? "Saving…" : existing ? "Update Check-In" : "Save Check-In"}
      </button>
    </motion.div>
  );
}

// ─── Members Tab ──────────────────────────────────────────────────────────────
function MembersTab({ members, userId, canManage, onRoleChange }) {
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(null);

  const filtered = members.filter((m) =>
    m.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.profiles?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (memberId, newRole) => {
    setLoading(memberId);
    await onRoleChange(memberId, newRole);
    setLoading(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members…"
          className="w-full pl-10 pr-4 py-3 border border-beige-200 rounded-xl text-sm text-charcoal-600 placeholder:text-charcoal-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-beige-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-beige-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">
            {filtered.length} Member{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="divide-y divide-beige-50">
          {filtered.map((member) => {
            const isMe = member.profiles?.id === userId;
            return (
              <div key={member.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-beige-50/60 transition-colors">
                <Avatar src={member.profiles?.avatar_url} name={member.profiles?.full_name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-charcoal-600 truncate">
                    {member.profiles?.full_name || "Unknown"}
                    {isMe && <span className="ml-1.5 text-[10px] text-charcoal-300">(you)</span>}
                  </p>
                  <p className="text-[11px] text-charcoal-300">
                    Joined {new Date(member.joined_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <RoleBadge role={member.role} />
                  {canManage && !isMe && member.profiles?.email !== "admin_access@taseescircle.com" && (
                    <select
                      value={member.role}
                      disabled={loading === member.id}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="text-[10px] border border-beige-200 rounded-lg px-2 py-1 text-charcoal-400 focus:border-gold outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="member">Member</option>
                    </select>
                  )}
                  {loading === member.id && <Loader2 size={12} className="animate-spin text-gold" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Admin Tools Tab ──────────────────────────────────────────────────────────
function AdminTab({ masjid, circle, members }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    if (masjid?.unique_code) {
      navigator.clipboard.writeText(masjid.unique_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const shareWhatsApp = () => {
    const text = `Join our Masjid circle on Ta'sees Circle!\n\nMasjid: ${masjid?.name}\nCode: ${masjid?.unique_code}\n\nJoin here: ${window.location.origin}/dashboard/join-masjid`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Invite Card */}
      <div className="bg-white rounded-2xl border border-beige-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
            <Sparkles size={18} className="text-gold" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal-600">Invite Members</h3>
            <p className="text-xs text-charcoal-300">Share your circle code to invite people</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-beige-50 rounded-xl mb-4">
          <span className="text-2xl font-mono font-bold tracking-[0.25em] text-gold flex-1">
            {masjid?.unique_code || "------"}
          </span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-beige-200 rounded-lg text-xs font-medium text-charcoal-400 hover:border-gold hover:text-gold transition-all"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <button
          onClick={shareWhatsApp}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:bg-[#1ebe57] transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Share on WhatsApp
        </button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Members", value: members.length,                                     icon: <Users size={18} className="text-gold" />,          bg: "bg-gold/10" },
          { label: "Admins",        value: members.filter((m) => m.role === "admin" || m.profiles?.email === "admin_access@taseescircle.com").length,    icon: <Crown size={18} className="text-amber-500" />,       bg: "bg-amber-50" },
          { label: "Moderators",    value: members.filter((m) => m.role === "moderator" && m.profiles?.email !== "admin_access@taseescircle.com").length, icon: <Shield size={18} className="text-blue-500" />,       bg: "bg-blue-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-beige-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-charcoal-600">{stat.value}</p>
            <p className="text-xs text-charcoal-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CircleViewPage({ params }) {
  const resolvedParams = use(params);
  const circleId = resolvedParams.id;
  const { user, profile } = useAuth();

  const [circle,  setCircle]  = useState(null);
  const [posts,   setPosts]   = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("feed");
  const [userRole, setUserRole] = useState("member");

  const canPost = userRole === "admin" || userRole === "moderator";

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    const supabase = createClient();
    if (!supabase || !circleId || !user?.id) return;

    try {
      // Circle + Masjid
      const { data: circleData } = await supabase
        .from("circles")
        .select("*, masjids(*)")
        .eq("id", circleId)
        .single();
      setCircle(circleData);

      if (!circleData?.masjids) { setLoading(false); return; }

      // Posts + reactions
      const { data: postsData } = await supabase
        .from("circle_posts")
        .select(`
          *,
          profiles(full_name, avatar_url, email, role),
          circle_post_reactions(user_id, reaction)
        `)
        .eq("circle_id", circleId)
        .order("is_pinned", { ascending: false })
        .order("created_at",  { ascending: false })
        .limit(50);

      setPosts(
        (postsData || []).map((p) => ({ ...p, reactions: p.circle_post_reactions || [] }))
      );

      // Members — primary list query
      const { data: memberData } = await supabase
        .from("masjid_members")
        .select("*, profiles(id, full_name, avatar_url, email, role)")
        .eq("masjid_id", circleData.masjids.id)
        .order("joined_at", { ascending: true });

      // ── Also fetch OUR OWN row directly (bypasses list RLS edge cases) ──
      const { data: myMemberRow } = await supabase
        .from("masjid_members")
        .select("id, role, masjid_id, joined_at, join_method")
        .eq("user_id", user.id)
        .eq("masjid_id", circleData.masjids.id)
        .maybeSingle();

      let finalMembers = memberData || [];

      // ── CREATOR SELF-INJECTION FALLBACK ───────────────────────────────
      // If the member list is empty but we know we belong here
      // (profile.current_masjid_id matches this circle's masjid),
      // inject ourselves so the UI never shows 0 members to the creator.
      const belongsHere = profile?.current_masjid_id === circleData.masjids.id;
      const alreadyInList = finalMembers.some((m) => m.profiles?.id === user.id);

      if (!alreadyInList && (myMemberRow || belongsHere)) {
        // Build a synthetic member entry from known data
        finalMembers = [
          {
            id:          myMemberRow?.id         || "self-synthetic",
            masjid_id:   circleData.masjids.id,
            joined_at:   myMemberRow?.joined_at  || new Date().toISOString(),
            join_method: myMemberRow?.join_method || "creator",
            role:        myMemberRow?.role        || "moderator",
            profiles: {
              id:         user.id,
              full_name:  profile?.full_name  || user.user_metadata?.full_name || "You",
              avatar_url: profile?.avatar_url || null,
              email:      user.email           || "",
              role:       profile?.role        || "user",
            },
          },
          ...finalMembers,
        ];
      }
      // Retain all real circle members (creators, admins, moderators, members).
      // Only filter out the platform super admin account if present.
      finalMembers = finalMembers.filter(
        (m) => m.profiles?.email !== "admin_access@taseescircle.com"
      );

      setMembers(finalMembers);

      const my = finalMembers.find((m) => m.profiles?.id === user.id);
      if (my) setUserRole(my.role);
      else if (myMemberRow?.role) setUserRole(myMemberRow.role);
    } catch (err) {
      console.error("Circle fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [circleId, user?.id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Realtime subscriptions ─────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();
    if (!supabase || !circleId) return;

    const postSub = supabase
      .channel(`circle_posts_${circleId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "circle_posts", filter: `circle_id=eq.${circleId}` },
        () => { fetchAll(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(postSub); };
  }, [circleId, fetchAll]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleNewPost = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handleReact = async (postId, type, remove) => {
    const supabase = createClient();
    if (!supabase) return;
    if (remove) {
      await supabase.from("circle_post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("reaction", type);
    } else {
      await supabase.from("circle_post_reactions")
        .insert({ post_id: postId, user_id: user.id, reaction: type });
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from("masjid_members").update({ role: newRole }).eq("id", memberId);
    setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, role: newRole } : m));
  };

  // ── Loading / Not Found ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-6">
        <div className="h-44 bg-beige-100 rounded-2xl" />
        <div className="h-12 bg-beige-100 rounded-xl" />
        <div className="h-64 bg-beige-100 rounded-2xl" />
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-beige-100 flex items-center justify-center mx-auto mb-4">
          <CircleDot size={28} className="text-beige-300" />
        </div>
        <h2 className="font-heading font-bold text-charcoal-600 text-xl mb-2">Circle Not Found</h2>
        <p className="text-sm text-charcoal-300 mb-6">This circle doesn&apos;t exist or you don&apos;t have access.</p>
        <Link href="/dashboard/my-circle" className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all">
          <ArrowLeft size={16} /> Back to My Circle
        </Link>
      </div>
    );
  }

  const masjid   = circle.masjids;
  const pinnedPosts  = posts.filter((p) => p.is_pinned);
  const regularPosts = posts.filter((p) => !p.is_pinned);

  const TABS = [
    { key: "feed",    label: "Feed",                    icon: <MessageCircle size={15} /> },
    { key: "members", label: `Members (${members.length})`, icon: <Users size={15} />        },
    { key: "checkin", label: "Prayer Check-In",         icon: <CheckCircle2 size={15} />    },
    ...(canPost ? [{ key: "admin", label: "Admin Tools", icon: <Settings size={15} /> }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Hero Header ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600 rounded-2xl p-6 sm:p-8 text-white overflow-hidden"
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CircleDot size={16} className="text-gold" />
              <span className="text-xs font-medium uppercase tracking-widest text-white/50">Circle</span>
              <RoleBadge role={userRole} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold leading-tight">{circle.name || masjid?.name}</h1>
            <p className="text-sm text-white/60 flex items-center gap-1.5 mt-2">
              <MapPin size={13} /> {masjid?.area}, {masjid?.city}, {masjid?.country}
            </p>
            <div className="flex items-center gap-5 mt-4">
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <Users size={13} /> {members.length} members
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <FileText size={13} /> {posts.length} posts
              </span>
            </div>
          </div>

          {/* Code card */}
          {masjid?.unique_code && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[170px] shrink-0 border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Circle Code</p>
              <p className="text-xl font-mono font-bold tracking-[0.25em] text-gold">{masjid.unique_code}</p>
              <Link
                href="/dashboard/my-circle"
                className="inline-flex items-center gap-1 mt-3 text-[11px] text-white/40 hover:text-white transition-colors"
              >
                <ArrowLeft size={11} /> My Circle
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Tab Bar ───────────────────────────────────────────────────── */}
      <div className="flex rounded-2xl bg-beige-100 p-1.5 gap-1 overflow-x-auto scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0
              ${tab === t.key
                ? "bg-white text-charcoal-600 shadow-sm"
                : "text-charcoal-300 hover:text-charcoal-500 hover:bg-beige-200/60"
              }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Feed Tab ──────────────────────────────────────────────────── */}
      {tab === "feed" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Compose */}
          {canPost && (
            <ComposeBox circleId={circleId} userId={user.id} onPost={handleNewPost} />
          )}

          {/* Pinned banner */}
          {pinnedPosts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Pin size={13} className="text-gold" />
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Pinned</span>
              </div>
              {pinnedPosts.map((post) => (
                <PostCard key={post.id} post={post} userId={user.id} circleId={circleId} onReact={handleReact} />
              ))}
            </div>
          )}

          {/* Regular posts */}
          {regularPosts.length > 0 && (
            <div className="space-y-4">
              {pinnedPosts.length > 0 && (
                <div className="flex items-center gap-2">
                  <MessageCircle size={13} className="text-charcoal-300" />
                  <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Latest Posts</span>
                </div>
              )}
              {regularPosts.map((post) => (
                <PostCard key={post.id} post={post} userId={user.id} circleId={circleId} onReact={handleReact} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {posts.length === 0 && (
            <div className="bg-white rounded-2xl border border-beige-200 p-14 text-center">
              <div className="w-16 h-16 rounded-2xl bg-beige-100 flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-beige-300" />
              </div>
              <h3 className="font-heading font-bold text-charcoal-600 text-base mb-1">No posts yet</h3>
              <p className="text-sm text-charcoal-300">
                {canPost
                  ? "Be the first to share something with your circle!"
                  : "Posts from your circle admin and moderators will appear here."}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Members Tab ───────────────────────────────────────────────── */}
      {tab === "members" && (
        <MembersTab
          members={members}
          userId={user.id}
          canManage={canPost}
          onRoleChange={handleRoleChange}
        />
      )}

      {/* ── Check-In Tab ──────────────────────────────────────────────── */}
      {tab === "checkin" && (
        <CheckInTab circleId={circleId} userId={user.id} />
      )}

      {/* ── Admin Tools Tab ───────────────────────────────────────────── */}
      {tab === "admin" && canPost && (
        <AdminTab masjid={masjid} circle={circle} members={members} />
      )}
    </div>
  );
}
