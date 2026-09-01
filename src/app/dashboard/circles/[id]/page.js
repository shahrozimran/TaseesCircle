"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  CircleDot, FileText, MessageSquare, Users, Pin,
  Send, Loader2, AlertCircle, Mail, Shield,
} from "lucide-react";
import Link from "next/link";

export default function CircleViewPage({ params }) {
  const resolvedParams = use(params);
  const circleId = resolvedParams.id;
  const { user, profile } = useAuth();
  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [userRole, setUserRole] = useState("member");

  // New post form (admin/mod only)
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postCategory, setPostCategory] = useState("general");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!circleId || !user?.id) return;

    const fetchCircleData = async () => {
      const supabase = createClient();
      if (!supabase) return;

      try {
        // Fetch circle
        const { data: circleData } = await supabase
          .from("circles")
          .select("*, masjids(*)")
          .eq("id", circleId)
          .single();
        setCircle(circleData);

        if (circleData?.masjids) {
          // Fetch posts
          const { data: postsData } = await supabase
            .from("circle_posts")
            .select("*, profiles(full_name, avatar_url)")
            .eq("circle_id", circleId)
            .order("is_pinned", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(50);
          setPosts(postsData || []);

          // Fetch members
          const { data: memberData } = await supabase
            .from("masjid_members")
            .select("*, profiles(id, full_name, avatar_url, email)")
            .eq("masjid_id", circleData.masjids.id)
            .order("joined_at", { ascending: true });
          setMembers(memberData || []);

          // Determine user's role
          const myMembership = memberData?.find((m) => m.profiles?.id === user.id);
          if (myMembership) setUserRole(myMembership.role);
        }
      } catch (err) {
        console.error("Error fetching circle:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCircleData();
  }, [circleId, user?.id]);

  const canPost = userRole === "admin" || userRole === "moderator";

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postBody.trim()) return;

    setPosting(true);
    try {
      const supabase = createClient();
      if (!supabase) return;

      const { data: newPost, error } = await supabase
        .from("circle_posts")
        .insert({
          circle_id: circleId,
          posted_by: user.id,
          title: postTitle.trim(),
          body: postBody.trim(),
          category: postCategory,
        })
        .select("*, profiles(full_name, avatar_url)")
        .single();

      if (!error && newPost) {
        setPosts((prev) => [newPost, ...prev]);
        setPostTitle("");
        setPostBody("");
        setShowPostForm(false);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setPosting(false);
    }
  };

  const getCategoryBadge = (cat) => {
    const colors = {
      ibadat: "bg-islamic-green/10 text-islamic-green",
      business: "bg-gold/10 text-gold",
      announcement: "bg-red-50 text-red-600",
      general: "bg-beige-100 text-charcoal-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colors[cat] || colors.general}`}>
        {cat}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-32 bg-beige-100 rounded-2xl" />
        <div className="h-64 bg-beige-100 rounded-2xl" />
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CircleDot size={48} className="text-beige-300 mx-auto mb-4" />
        <h2 className="font-heading font-bold text-charcoal-600 text-xl mb-2">Circle Not Found</h2>
        <p className="text-sm text-charcoal-300">This circle doesn&apos;t exist or you don&apos;t have access.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Circle Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-islamic-green to-islamic-green-light rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <CircleDot size={18} />
          <span className="text-xs font-medium uppercase tracking-wider text-white/70">Circle</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-heading font-bold">
          {circle.name || circle.masjids?.name}
        </h1>
        <p className="text-sm text-white/70 mt-1">
          {circle.masjids?.area}, {circle.masjids?.city}, {circle.masjids?.country}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs text-white/60 flex items-center gap-1">
            <Users size={14} /> {members.length} members
          </span>
          <span className="text-xs text-white/60 flex items-center gap-1">
            <FileText size={14} /> {posts.length} posts
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-beige-100 p-1 overflow-x-auto">
        {[
          { key: "content", label: "📋 Content Feed" },
          { key: "contact", label: "📩 Contact" },
          { key: "members", label: `👥 Members (${members.length})` },
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

      {/* Content Feed Tab */}
      {activeTab === "content" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* New Post Button (admin/mod only) */}
          {canPost && (
            <div className="bg-white rounded-2xl border border-beige-200 p-4">
              {!showPostForm ? (
                <button
                  onClick={() => setShowPostForm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-beige-50 rounded-xl text-sm text-charcoal-300 hover:bg-beige-100 transition-colors text-left"
                >
                  <FileText size={16} />
                  Create a new post for your circle...
                </button>
              ) : (
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Post title"
                    required
                    className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold"
                  />
                  <textarea
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                    placeholder="Write your post content..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="px-3 py-2 border border-beige-300 rounded-lg text-xs text-charcoal-500"
                    >
                      <option value="general">General</option>
                      <option value="ibadat">Ibadat</option>
                      <option value="business">Business</option>
                      <option value="announcement">Announcement</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPostForm(false)}
                        className="px-4 py-2 text-xs text-charcoal-400 hover:text-charcoal-600 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={posting}
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-gold text-white text-xs font-medium rounded-lg disabled:opacity-50"
                      >
                        {posting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                        Post
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Posts List */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-beige-200 p-12 text-center">
              <FileText size={40} className="text-beige-300 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-charcoal-500 text-base mb-1">No Posts Yet</h3>
              <p className="text-sm text-charcoal-300">
                {canPost ? "Create the first post for your circle!" : "Posts from admins and moderators will appear here."}
              </p>
            </div>
          ) : (
            posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-beige-200 p-5 sm:p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {post.profiles?.avatar_url ? (
                      <img src={post.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-beige-200 flex items-center justify-center text-charcoal-400 text-xs font-bold">
                        {post.profiles?.full_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-charcoal-600">{post.profiles?.full_name}</p>
                      <p className="text-[11px] text-charcoal-200">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.is_pinned && <Pin size={12} className="text-gold" />}
                    {getCategoryBadge(post.category)}
                  </div>
                </div>
                <h3 className="font-heading font-bold text-charcoal-600 text-base mb-2">{post.title}</h3>
                <p className="text-sm text-charcoal-400 leading-relaxed whitespace-pre-wrap">{post.body}</p>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Contact Tab */}
      {activeTab === "contact" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-white rounded-2xl border border-beige-200 p-6">
            <h3 className="font-heading font-bold text-charcoal-600 text-lg mb-4">
              Need Help or Have a Question?
            </h3>
            <p className="text-sm text-charcoal-300 mb-6">
              Members can reach out via two channels. Your query will be responded to via email and you&apos;ll get a notification on your dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/support"
                className="flex items-center gap-3 p-5 rounded-xl border-2 border-beige-200 hover:border-gold transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Mail size={22} className="text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-600">Contact Ta&apos;sees Circle</p>
                  <p className="text-[11px] text-charcoal-300">Platform support team</p>
                </div>
              </Link>

              <Link
                href="/dashboard/support"
                className="flex items-center gap-3 p-5 rounded-xl border-2 border-beige-200 hover:border-islamic-green transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-islamic-green/10 flex items-center justify-center group-hover:bg-islamic-green/20 transition-colors">
                  <Shield size={22} className="text-islamic-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-600">Contact Moderator</p>
                  <p className="text-[11px] text-charcoal-300">Your circle&apos;s moderator</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-2xl border border-beige-200 overflow-hidden">
            <div className="divide-y divide-beige-50">
              {members.map((member) => (
                <div key={member.id} className="px-5 py-3 flex items-center gap-3 hover:bg-beige-50 transition-colors">
                  {member.profiles?.avatar_url ? (
                    <img src={member.profiles.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-beige-200 flex items-center justify-center text-charcoal-400 text-sm font-bold">
                      {member.profiles?.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal-600 truncate">{member.profiles?.full_name}</p>
                    <p className="text-[11px] text-charcoal-300">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    member.role === "admin" ? "bg-gold/10 text-gold"
                    : member.role === "moderator" ? "bg-blue-50 text-blue-600"
                    : "bg-beige-100 text-charcoal-300"
                  }`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
