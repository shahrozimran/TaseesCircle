"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { CircleDot, Users, MapPin, Eye, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminCirclesPage() {
  const { user } = useAuth();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCircle, setExpandedCircle] = useState(null);
  const [circleMembers, setCircleMembers] = useState({});

  useEffect(() => {
    if (!user?.id) return;

    const fetchCircles = async () => {
      const supabase = createClient();
      if (!supabase) return;

      const { data } = await supabase
        .from("circles")
        .select(`
          *,
          masjids(id, name, area, city, country, member_count, unique_code, created_by, status,
            profiles!masjids_created_by_fkey(full_name, email)
          )
        `)
        .order("created_at", { ascending: false });

      setCircles(data || []);
      setLoading(false);
    };

    fetchCircles();
  }, [user?.id]);

  const toggleExpand = async (circleId, masjidId) => {
    if (expandedCircle === circleId) {
      setExpandedCircle(null);
      return;
    }

    setExpandedCircle(circleId);

    // Fetch members if not already loaded
    if (!circleMembers[circleId]) {
      const supabase = createClient();
      if (!supabase) return;

      const { data } = await supabase
        .from("masjid_members")
        .select("*, profiles(full_name, email, avatar_url)")
        .eq("masjid_id", masjidId)
        .order("joined_at", { ascending: true });

      setCircleMembers((prev) => ({ ...prev, [circleId]: data || [] }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600">All Circles</h1>
        <p className="text-sm text-charcoal-300 mt-1">Browse all circles and their members</p>
      </motion.div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-beige-100 rounded-2xl" />)}
        </div>
      ) : circles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-beige-200 p-12 text-center">
          <CircleDot size={40} className="text-beige-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-charcoal-500 text-base mb-1">No Circles Yet</h3>
          <p className="text-sm text-charcoal-300">Circles are created when a masjid is approved.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {circles.map((circle, i) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-beige-200 overflow-hidden"
            >
              <div
                className="p-5 sm:p-6 flex items-start justify-between cursor-pointer hover:bg-beige-50 transition-colors"
                onClick={() => toggleExpand(circle.id, circle.masjids?.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CircleDot size={16} className="text-islamic-green" />
                    <h3 className="font-heading font-bold text-charcoal-600 text-base">
                      {circle.name || circle.masjids?.name}
                    </h3>
                  </div>
                  <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {circle.masjids?.area}, {circle.masjids?.city}, {circle.masjids?.country}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-charcoal-300 flex items-center gap-1">
                      <Users size={12} /> {circle.masjids?.member_count || 0} members
                    </span>
                    {circle.masjids?.unique_code && (
                      <span className="text-xs text-charcoal-300 font-mono">
                        Code: {circle.masjids.unique_code}
                      </span>
                    )}
                    <span className="text-xs text-charcoal-200">
                      Created by: {circle.masjids?.profiles?.full_name || "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {expandedCircle === circle.id ? (
                    <ChevronUp size={16} className="text-charcoal-300" />
                  ) : (
                    <ChevronDown size={16} className="text-charcoal-300" />
                  )}
                </div>
              </div>

              {/* Expanded: Member List */}
              {expandedCircle === circle.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="border-t border-beige-100"
                >
                  {circleMembers[circle.id] ? (
                    circleMembers[circle.id].length === 0 ? (
                      <div className="p-6 text-center text-sm text-charcoal-300">No members yet</div>
                    ) : (
                      <div className="divide-y divide-beige-50">
                        {circleMembers[circle.id].map((member) => (
                          <div key={member.id} className="px-5 py-3 flex items-center gap-3">
                            {member.profiles?.avatar_url ? (
                              <img src={member.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-beige-200 flex items-center justify-center text-charcoal-400 text-xs font-bold">
                                {member.profiles?.full_name?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-charcoal-600 truncate">{member.profiles?.full_name}</p>
                              <p className="text-[11px] text-charcoal-300">{member.profiles?.email}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              member.role === "admin" ? "bg-gold/10 text-gold"
                              : member.role === "moderator" ? "bg-blue-50 text-blue-600"
                              : "bg-beige-100 text-charcoal-300"
                            }`}>
                              {member.role}
                            </span>
                            <span className="text-[10px] text-charcoal-200">
                              {new Date(member.joined_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="p-6 text-center">
                      <div className="animate-pulse flex justify-center">
                        <div className="w-6 h-6 rounded-full bg-beige-200" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
