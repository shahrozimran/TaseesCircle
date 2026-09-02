"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Users, Search, CircleDot, Shield, Mail } from "lucide-react";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchUsers = async () => {
      const supabase = createClient();
      if (!supabase) return;

      let { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          masjids(name),
          masjid_members(role, masjid_id)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) {
        if (error) console.warn("Profiles join query error, performing direct fetch:", error.message);
        const { data: directProfiles } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        data = directProfiles || [];
      }

      setUsers(data || []);
      setLoading(false);
    };

    fetchUsers();
  }, [user?.id]);

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search) ||
      u.city?.toLowerCase().includes(search) ||
      u.country?.toLowerCase().includes(search)
    );
  });

  const getRoleBadge = (u) => {
    if (u.role === "super_admin") {
      return <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase">Super Admin</span>;
    }
    const memberRole = u.masjid_members?.[0]?.role;
    if (memberRole === "admin") {
      return <span className="px-2 py-0.5 bg-gold/10 text-gold text-[10px] font-bold rounded-full uppercase">Circle Admin</span>;
    }
    if (memberRole === "moderator") {
      return <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase">Moderator</span>;
    }
    if (memberRole === "member") {
      return <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase">Member</span>;
    }
    return <span className="px-2 py-0.5 bg-beige-100 text-charcoal-300 text-[10px] font-bold rounded-full uppercase">No Circle</span>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600">Users</h1>
        <p className="text-sm text-charcoal-300 mt-1">All registered users ({users.length} total)</p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-200" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, city..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>

      {/* Users List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-beige-100 rounded-xl" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-beige-200 overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3 bg-beige-50 border-b border-beige-100 text-[11px] text-charcoal-300 font-medium uppercase tracking-wider">
            <div className="col-span-4">User</div>
            <div className="col-span-3">Circle</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-3">Joined</div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users size={32} className="text-beige-300 mx-auto mb-2" />
              <p className="text-sm text-charcoal-300">No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-beige-50">
              {filteredUsers.map((u) => (
                <div key={u.id} className="px-5 py-3 sm:grid sm:grid-cols-12 gap-4 items-center hover:bg-beige-50 transition-colors">
                  {/* User Info */}
                  <div className="col-span-4 flex items-center gap-3 mb-2 sm:mb-0">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-beige-200 flex items-center justify-center text-charcoal-400 text-xs font-bold shrink-0">
                        {u.full_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-charcoal-600 truncate">{u.full_name || "—"}</p>
                      <p className="text-[11px] text-charcoal-300 truncate">{u.email}</p>
                    </div>
                  </div>

                  {/* Circle */}
                  <div className="col-span-3 mb-1 sm:mb-0">
                    {u.masjids?.name ? (
                      <span className="text-xs text-charcoal-500 flex items-center gap-1">
                        <CircleDot size={10} className="text-islamic-green" /> {u.masjids.name}
                      </span>
                    ) : (
                      <span className="text-xs text-charcoal-200">—</span>
                    )}
                  </div>

                  {/* Role */}
                  <div className="col-span-2 mb-1 sm:mb-0">
                    {getRoleBadge(u)}
                  </div>

                  {/* Joined */}
                  <div className="col-span-3">
                    <p className="text-xs text-charcoal-300">{new Date(u.created_at).toLocaleDateString()}</p>
                    {u.city && <p className="text-[10px] text-charcoal-200">{u.city}, {u.country}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
