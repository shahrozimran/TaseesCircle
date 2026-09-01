"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle, XCircle, Clock, MapPin, User,
  Loader2, AlertCircle, Eye,
} from "lucide-react";

export default function AdminApprovalsPage() {
  const { user } = useAuth();
  const [masjids, setMasjids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [processing, setProcessing] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchMasjids();
  }, [user?.id, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMasjids = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    let query = supabase
      .from("masjids")
      .select("*, profiles!masjids_created_by_fkey(full_name, email, avatar_url)")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query.limit(50);
    setMasjids(data || []);
    setLoading(false);
  };

  const handleApprove = async (masjidId) => {
    setProcessing(masjidId);
    try {
      const supabase = createClient();
      if (!supabase) return;

      // Generate unique code using the database function
      const { data: codeResult } = await supabase.rpc("generate_unique_code");
      const uniqueCode = codeResult || masjidId.substring(0, 6).toUpperCase();

      // Update masjid status
      const { error: updateError } = await supabase
        .from("masjids")
        .update({
          status: "approved",
          unique_code: uniqueCode,
          approved_at: new Date().toISOString(),
        })
        .eq("id", masjidId);

      if (updateError) {
        console.error("Approval error:", updateError);
        return;
      }

      // Get masjid data for circle creation
      const masjidData = masjids.find((m) => m.id === masjidId);

      // Create circle
      await supabase.from("circles").insert({
        masjid_id: masjidId,
        name: masjidData?.name || "Circle",
        description: masjidData?.description || null,
      });

      // Add creator as admin member
      if (masjidData?.created_by) {
        await supabase.from("masjid_members").insert({
          masjid_id: masjidId,
          user_id: masjidData.created_by,
          role: "admin",
          join_method: "creator",
        });

        // Send notification to creator
        await supabase.from("notifications").insert({
          user_id: masjidData.created_by,
          title: "Masjid Approved! ✅",
          message: `Your Masjid "${masjidData.name}" has been approved. Your circle code is: ${uniqueCode}. Share this code with your community to start building your circle.`,
          type: "approval",
          link: "/dashboard/my-circle",
        });
      }

      // Log admin action
      await supabase.from("admin_actions").insert({
        admin_id: user.id,
        masjid_id: masjidId,
        action_type: "approve_masjid",
        notes: `Approved masjid "${masjidData?.name}" with code ${uniqueCode}`,
      });

      fetchMasjids();
    } catch (err) {
      console.error("Approve error:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (masjidId) => {
    if (!rejectReason.trim()) return;

    setProcessing(masjidId);
    try {
      const supabase = createClient();
      if (!supabase) return;

      const masjidData = masjids.find((m) => m.id === masjidId);

      await supabase
        .from("masjids")
        .update({
          status: "rejected",
          rejection_reason: rejectReason.trim(),
        })
        .eq("id", masjidId);

      // Send notification to creator
      if (masjidData?.created_by) {
        await supabase.from("notifications").insert({
          user_id: masjidData.created_by,
          title: "Masjid Registration Update",
          message: `Your Masjid "${masjidData.name}" registration was not approved. Reason: ${rejectReason.trim()}. Please contact us for more details.`,
          type: "rejection",
          link: "/dashboard/support",
        });
      }

      // Log admin action
      await supabase.from("admin_actions").insert({
        admin_id: user.id,
        masjid_id: masjidId,
        action_type: "reject_masjid",
        notes: `Rejected: ${rejectReason.trim()}`,
      });

      setShowRejectModal(null);
      setRejectReason("");
      fetchMasjids();
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending": return <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full uppercase">Pending</span>;
      case "approved": return <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase">Approved</span>;
      case "rejected": return <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase">Rejected</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600">Masjid Approvals</h1>
        <p className="text-sm text-charcoal-300 mt-1">Review and manage masjid registrations</p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex rounded-xl bg-beige-100 p-1">
        {[
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
          { key: "all", label: "All" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === tab.key ? "bg-white text-charcoal-600 shadow-sm" : "text-charcoal-300 hover:text-charcoal-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Masjid List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-beige-100 rounded-2xl" />)}
        </div>
      ) : masjids.length === 0 ? (
        <div className="bg-white rounded-2xl border border-beige-200 p-12 text-center">
          <CheckCircle size={40} className="text-beige-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-charcoal-500 text-base mb-1">No {filter} masjids</h3>
          <p className="text-sm text-charcoal-300">All clear! Check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {masjids.map((masjid, i) => (
            <motion.div
              key={masjid.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-beige-200 p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-charcoal-600 text-base">{masjid.name}</h3>
                    {getStatusBadge(masjid.status)}
                  </div>
                  <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {masjid.zip_code} · {masjid.area}, {masjid.city}, {masjid.country}
                  </p>
                  <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1">
                    <User size={12} /> Submitted by {masjid.profiles?.full_name || "Unknown"} ({masjid.profiles?.email})
                  </p>
                  <p className="text-[11px] text-charcoal-200 mt-1">
                    Submitted {new Date(masjid.created_at).toLocaleDateString()} at {new Date(masjid.created_at).toLocaleTimeString()}
                  </p>
                  {masjid.description && (
                    <p className="text-xs text-charcoal-400 mt-2 p-2 bg-beige-50 rounded-lg">{masjid.description}</p>
                  )}
                  {masjid.rejection_reason && (
                    <p className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded-lg">
                      <span className="font-medium">Rejection reason:</span> {masjid.rejection_reason}
                    </p>
                  )}
                  {masjid.unique_code && (
                    <p className="text-xs text-islamic-green mt-2 font-mono">Code: {masjid.unique_code}</p>
                  )}
                </div>

                {/* Actions */}
                {masjid.status === "pending" && (
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(masjid.id)}
                      disabled={processing === masjid.id}
                      className="flex items-center gap-1 px-4 py-2 bg-islamic-green text-white text-xs font-medium rounded-xl hover:bg-islamic-green-light transition-all disabled:opacity-50"
                    >
                      {processing === masjid.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                      Approve
                    </button>
                    <button
                      onClick={() => { setShowRejectModal(masjid.id); setRejectReason(""); }}
                      disabled={processing === masjid.id}
                      className="flex items-center gap-1 px-4 py-2 border-2 border-red-200 text-red-600 text-xs font-medium rounded-xl hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      <XCircle size={12} />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Reject Modal */}
              {showRejectModal === masjid.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-beige-100"
                >
                  <p className="text-xs font-medium text-charcoal-400 mb-2">Rejection reason *</p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    rows={3}
                    className="w-full px-3 py-2 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-red-300 focus:ring-1 focus:ring-red-300 resize-none"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleReject(masjid.id)}
                      disabled={!rejectReason.trim() || processing === masjid.id}
                      className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-xs font-medium rounded-xl hover:bg-red-600 disabled:opacity-50"
                    >
                      {processing === masjid.id ? <Loader2 size={12} className="animate-spin" /> : "Confirm Reject"}
                    </button>
                    <button
                      onClick={() => setShowRejectModal(null)}
                      className="px-4 py-2 text-xs text-charcoal-400 hover:text-charcoal-600 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
