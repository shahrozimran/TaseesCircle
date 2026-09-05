"use client";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle, XCircle, Clock, MapPin, User,
  Loader2, AlertCircle, Eye,
} from "lucide-react";

export default function AdminApprovalsPage() {
  const { t: translate , dateLocale} = useLanguage();
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

      // Generate unique code
      const { data: codeResult } = await supabase.rpc("generate_unique_code");
      const uniqueCode = codeResult || masjidId.substring(0, 6).toUpperCase();

      // Use the SECURITY DEFINER RPC function which atomically:
      // 1. Approves the masjid + sets unique_code
      // 2. Creates the circle
      // 3. Adds creator as admin member (bypasses RLS — this was the bug)
      // 4. Sends approval notification to creator
      // 5. Logs the admin action
      const { data: result, error: rpcError } = await supabase.rpc(
        "approve_masjid_and_add_creator",
        {
          p_masjid_id:   masjidId,
          p_admin_id:    user.id,
          p_unique_code: uniqueCode,
        }
      );

      if (rpcError) {
        console.error("Approval RPC error:", rpcError);
        alert(translate(`Approval failed: ${rpcError.message}`));
        return;
      }

      if (!result?.success) {
        console.error("Approval failed:", result?.error);
        alert(translate(`Approval failed: ${result?.error || "Unknown error"}`));
        return;
      }

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
      case "pending": return <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full uppercase"><T>Pending</T></span>;
      case "approved": return <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase"><T>Approved</T></span>;
      case "rejected": return <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase"><T>Rejected</T></span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600"><T>Masjid Approvals</T></h1>
        <p className="text-sm text-charcoal-300 mt-1"><T>Review and manage masjid registrations</T></p>
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
            <T>{tab.label}</T>
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
          <h3 className="font-heading font-bold text-charcoal-500 text-base mb-1"><T>No {filter} masjids</T></h3>
          <p className="text-sm text-charcoal-300"><T>All clear! Check back later.</T></p>
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
                    <T>{getStatusBadge(masjid.status)}</T>
                  </div>
                  <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {masjid.zip_code} · {masjid.area}, {masjid.city}, <T>{masjid.country}</T>
                  </p>
                  <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1">
                    <User size={12} /><T> Submitted by </T>{masjid.profiles?.full_name || <T>Unknown</T>} ({masjid.profiles?.email})
                  </p>
                  <p className="text-[11px] text-charcoal-200 mt-1"><T>
                    Submitted {new Date(masjid.created_at).toLocaleDateString(dateLocale)} at {new Date(masjid.created_at).toLocaleTimeString(dateLocale)}</T>
                  </p>
                  {masjid.description && (
                    <p className="text-xs text-charcoal-400 mt-2 p-2 bg-beige-50 rounded-lg">{masjid.description}</p>
                  )}
                  {masjid.rejection_reason && (
                    <p className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded-lg">
                      <span className="font-medium"><T>Rejection reason:</T></span> <T>{masjid.rejection_reason}</T>
                    </p>
                  )}
                  {masjid.unique_code && (
                    <p className="text-xs text-islamic-green mt-2 font-mono"><T>Code: </T>{masjid.unique_code}</p>
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
                      {processing === masjid.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}<T>
                      Approve
                    </T></button>
                    <button
                      onClick={() => { setShowRejectModal(masjid.id); setRejectReason(""); }}
                      disabled={processing === masjid.id}
                      className="flex items-center gap-1 px-4 py-2 border-2 border-red-200 text-red-600 text-xs font-medium rounded-xl hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      <XCircle size={12} /><T>
                      Reject
                    </T></button>
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
                  <p className="text-xs font-medium text-charcoal-400 mb-2"><T>Rejection reason *</T></p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder={translate("Please provide a reason for rejection...")}
                    rows={3}
                    className="w-full px-3 py-2 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-red-300 focus:ring-1 focus:ring-red-300 resize-none"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleReject(masjid.id)}
                      disabled={!rejectReason.trim() || processing === masjid.id}
                      className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-xs font-medium rounded-xl hover:bg-red-600 disabled:opacity-50"
                    >
                      <T>{processing === masjid.id ? <Loader2 size={12} className="animate-spin" /> : "Confirm Reject"}</T>
                    </button>
                    <button
                      onClick={() => setShowRejectModal(null)}
                      className="px-4 py-2 text-xs text-charcoal-400 hover:text-charcoal-600 font-medium"
                    ><T>
                      Cancel
                    </T></button>
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
