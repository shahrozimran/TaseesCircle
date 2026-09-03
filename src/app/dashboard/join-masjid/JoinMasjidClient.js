"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Link as LinkIcon,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
  MapPin,
  ArrowRight,
  UserPlus,
} from "lucide-react";

export default function JoinMasjidClient() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const refCode = searchParams.get("ref") || "";
  const masjidParam = searchParams.get("masjid") || "";

  const [code, setCode] = useState(masjidParam || "");
  const [referralCode, setReferralCode] = useState(refCode);
  const [searchResult, setSearchResult] = useState(null);
  const [referralResult, setReferralResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState(refCode ? "referral" : "code");

  // Redirect if user already has a circle
  useEffect(() => {
    if (profile?.current_masjid_id) {
      router.push("/dashboard/my-circle");
    }
  }, [profile, router]);

  // Auto-search if params provided
  useEffect(() => {
    if (masjidParam) handleCodeSearch(masjidParam);
    if (refCode) handleReferralSearch(refCode);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCodeSearch = async (searchCode) => {
    const codeToSearch = (searchCode || code).trim().toUpperCase();
    if (!codeToSearch || codeToSearch.length < 4) {
      setError("Please enter a valid masjid code (at least 4 characters).");
      return;
    }

    setSearching(true);
    setError("");
    setSearchResult(null);

    try {
      const supabase = createClient();
      if (!supabase) return;

      const { data, error: fetchError } = await supabase
        .from("masjids")
        .select("id, name, area, city, country, member_count, unique_code")
        .eq("unique_code", codeToSearch)
        .eq("status", "approved")
        .maybeSingle();

      if (fetchError) {
        setError("An error occurred while searching. Please try again.");
        return;
      }

      if (!data) {
        setError("No masjid found with this code. Please check and try again.");
        return;
      }

      setSearchResult(data);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSearching(false);
    }
  };

  const handleReferralSearch = async (searchRef) => {
    const refToSearch = (searchRef || referralCode).trim();
    if (!refToSearch) {
      setError("Please enter a referral code.");
      return;
    }

    setSearching(true);
    setError("");
    setReferralResult(null);

    try {
      const supabase = createClient();
      if (!supabase) return;

      const { data, error: fetchError } = await supabase
        .from("referrals")
        .select(`
          id,
          referral_code,
          status,
          masjid_id,
          referrer_id,
          masjids (id, name, area, city, country, member_count, unique_code),
          profiles!referrals_referrer_id_fkey (full_name)
        `)
        .eq("referral_code", refToSearch)
        .eq("status", "pending")
        .maybeSingle();

      if (fetchError || !data) {
        setError("Invalid or expired referral code. Please check and try again.");
        return;
      }

      setReferralResult(data);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSearching(false);
    }
  };

  const handleJoin = async (method) => {
    setJoining(true);
    setError("");

    try {
      const supabase = createClient();
      if (!supabase) return;

      let result;

      if (method === "code") {
        // Use transactional RPC — enforces role=member, validates approved masjid (C-04)
        const { data, error: rpcError } = await supabase.rpc("join_masjid_by_code", {
          p_code: code.trim().toUpperCase(),
        });
        if (rpcError) throw new Error(rpcError.message);
        result = data;
      } else {
        // Use transactional RPC — atomically consumes referral + inserts member (H-05, H-06)
        const { data, error: rpcError } = await supabase.rpc("join_masjid_by_referral", {
          p_referral_code: referralCode.trim(),
        });
        if (rpcError) throw new Error(rpcError.message);
        result = data;
      }

      if (!result?.success) {
        setError(result?.error || "Failed to join. Please try again.");
        return;
      }

      setSuccess("You have successfully joined the circle! Redirecting...");
      setTimeout(() => router.push("/dashboard/my-circle"), 2000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setJoining(false);
    }
  };


  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-beige-200 p-8 sm:p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-islamic-green/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-islamic-green" />
          </div>
          <h2 className="font-heading font-bold text-charcoal-600 text-xl sm:text-2xl mb-3">
            Welcome to the Circle!
          </h2>
          <p className="text-sm text-charcoal-300">{success}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600">
          Join a Masjid Circle
        </h1>
        <p className="text-sm text-charcoal-300 mt-1">
          Enter a Masjid code or referral code to join an existing circle.
        </p>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex rounded-xl bg-beige-100 p-1 mb-6">
        <button
          onClick={() => { setActiveTab("code"); setError(""); setSearchResult(null); }}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === "code"
              ? "bg-white text-charcoal-600 shadow-sm"
              : "text-charcoal-300 hover:text-charcoal-400"
          }`}
        >
          Join by Code
        </button>
        <button
          onClick={() => { setActiveTab("referral"); setError(""); setReferralResult(null); }}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === "referral"
              ? "bg-white text-charcoal-600 shadow-sm"
              : "text-charcoal-300 hover:text-charcoal-400"
          }`}
        >
          Join by Referral
        </button>
      </div>

      {/* Join by Code */}
      {activeTab === "code" && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8"
        >
          <h3 className="font-heading font-bold text-charcoal-600 text-lg flex items-center gap-2 mb-5">
            <LinkIcon size={20} className="text-gold" />
            Enter Masjid Code
          </h3>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-200" />
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); setSearchResult(null); }}
                placeholder="Enter 6-character code (e.g., A7K3X9)"
                maxLength={6}
                className="w-full pl-10 pr-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors uppercase font-mono tracking-widest"
              />
            </div>
            <button
              onClick={() => handleCodeSearch()}
              disabled={searching || !code.trim()}
              className="px-5 py-3 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 shrink-0"
            >
              {searching ? <Loader2 size={16} className="animate-spin" /> : "Search"}
            </button>
          </div>

          {/* Search Result */}
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-beige-50 rounded-xl p-5 border border-beige-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-heading font-bold text-charcoal-600 text-base">
                    {searchResult.name}
                  </h4>
                  <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {searchResult.area}, {searchResult.city}, {searchResult.country}
                  </p>
                  <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1">
                    <Users size={12} /> {searchResult.member_count} members
                  </p>
                </div>
                <button
                  onClick={() => handleJoin("code")}
                  disabled={joining}
                  className="flex items-center gap-2 px-5 py-2.5 bg-islamic-green text-white text-sm font-medium rounded-xl hover:bg-islamic-green-light transition-all disabled:opacity-50"
                >
                  {joining ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Join Circle
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Join by Referral */}
      {activeTab === "referral" && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8"
        >
          <h3 className="font-heading font-bold text-charcoal-600 text-lg flex items-center gap-2 mb-5">
            <UserPlus size={20} className="text-gold" />
            Enter Referral Code
          </h3>

          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => { setReferralCode(e.target.value); setError(""); setReferralResult(null); }}
                placeholder="Enter referral code"
                className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>
            <button
              onClick={() => handleReferralSearch()}
              disabled={searching || !referralCode.trim()}
              className="px-5 py-3 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 shrink-0"
            >
              {searching ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
            </button>
          </div>

          {/* Referral Result */}
          {referralResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-beige-50 rounded-xl p-5 border border-beige-200"
            >
              <div className="mb-3 px-3 py-2 bg-gold/10 rounded-lg">
                <p className="text-xs text-gold font-medium">
                  You were invited by <span className="font-bold">{referralResult.profiles?.full_name || "a member"}</span>
                </p>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-heading font-bold text-charcoal-600 text-base">
                    {referralResult.masjids?.name}
                  </h4>
                  <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {referralResult.masjids?.area}, {referralResult.masjids?.city}, {referralResult.masjids?.country}
                  </p>
                  <p className="text-xs text-charcoal-300 flex items-center gap-1 mt-1">
                    <Users size={12} /> {referralResult.masjids?.member_count} members
                  </p>
                </div>
                <button
                  onClick={() => handleJoin("referral")}
                  disabled={joining}
                  className="flex items-center gap-2 px-5 py-2.5 bg-islamic-green text-white text-sm font-medium rounded-xl hover:bg-islamic-green-light transition-all disabled:opacity-50"
                >
                  {joining ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Accept & Join
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-beige-50 border border-beige-200 rounded-xl p-4">
        <p className="text-xs text-charcoal-300 leading-relaxed">
          <span className="font-medium">Don&apos;t have a code?</span> Ask your Masjid community leader for the unique circle code or a referral link. Each person can only be part of one circle at a time.
        </p>
      </div>
    </div>
  );
}
