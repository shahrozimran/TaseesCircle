"use client";
import LocalizedForm from "@/components/i18n/LocalizedForm";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Save, CheckCircle, AlertCircle, Loader2, LogOut, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProfileClient() {
  const { t: translate } = useLanguage();
  const { user, profile, signOut, refreshProfile, refetchProfile, isProfileComplete } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Track whether we are in the middle of saving so the layout guard won't
  // redirect us away while we're completing the save + refetch cycle.
  const isSavingRef = useRef(false);

  const isSetupRequired = searchParams.get("setup") === "required" || !isProfileComplete;

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [city, setCity] = useState(profile?.city || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Sync profile data when loaded
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "");
      setCountry(profile.country || "");
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    isSavingRef.current = true;
    setError("");
    setSaved(false);

    if (!fullName.trim()) {
      setError("Please enter your Full Name.");
      setSaving(false);
      isSavingRef.current = false;
      return;
    }
    if (!city.trim()) {
      setError("Please enter your City.");
      setSaving(false);
      isSavingRef.current = false;
      return;
    }
    if (!country.trim()) {
      setError("Please enter your Country.");
      setSaving(false);
      isSavingRef.current = false;
      return;
    }

    try {
      const supabase = createClient();
      if (!supabase) return;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          city: city.trim() || null,
          country: country.trim() || null,
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        isSavingRef.current = false;
        return;
      }

      // Refresh the shared auth context so isProfileComplete is current before
      // the layout guard re-evaluates (H-08). Use refreshProfile (canonical name).
      const updatedProfile = await (refreshProfile || refetchProfile)();

      // Double-check the returned data is complete before navigating
      const profileIsNowComplete = !!(
        updatedProfile?.full_name?.trim() &&
        updatedProfile?.city?.trim() &&
        updatedProfile?.country?.trim()
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
        isSavingRef.current = false;
        if (profileIsNowComplete) {
          router.push("/dashboard");
        }
      }, 1500);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      isSavingRef.current = false;
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.avatar_url;
  const displayName = fullName || user?.user_metadata?.full_name || user?.email?.split("@")[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600"><T>
          Profile Settings
        </T></h1>
        <p className="text-sm text-charcoal-300 mt-1">
          <T>{isSetupRequired
            ? "Complete your profile to unlock all dashboard features"
            : "Manage and update your account information in the database"}</T>
        </p>
      </motion.div>

      {/* Warning Banner if profile is incomplete */}
      {isSetupRequired && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Lock size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-amber-900 text-sm sm:text-base"><T>
              Profile Setup Required
            </T></h3>
            <p className="text-xs sm:text-sm text-amber-700 mt-1 leading-relaxed"><T message="Please enter your {name}, {city}, and {country} below and click {save} to save them into the database. Other dashboard features are locked until your details are saved." values={{ name: <strong><T>Full Name</T></strong>, city: <strong><T>City</T></strong>, country: <strong><T>Country</T></strong>, save: <strong><T>Save Changes</T></strong> }} /></p>
          </div>
        </motion.div>
      )}

      {/* Avatar Card */}
      <div className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover ring-4 ring-beige-100" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center text-white text-xl font-bold ring-4 ring-beige-100">
              {displayName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <div>
            <p className="text-lg font-heading font-bold text-charcoal-600">{displayName}</p>
            <p className="text-sm text-charcoal-300">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8">
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-600 font-medium"><T>{error}</T></p>
          </div>
        )}

        {saved && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle size={18} className="text-green-500 shrink-0" />
            <p className="text-sm text-green-700 font-medium"><T>
              Profile saved to database! Redirecting to dashboard...
            </T></p>
          </div>
        )}

        <LocalizedForm onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
              Full Name </T><span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={translate("e.g., Muhammad Ali")}
              required
              className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>Email</T></label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-beige-200 rounded-xl text-sm text-charcoal-300 bg-beige-50 cursor-not-allowed"
            />
            <p className="text-[11px] text-charcoal-200 mt-1"><T>Email cannot be changed</T></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                City </T><span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={translate("e.g., Lahore")}
                required
                className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                Country </T><span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={translate("e.g., Pakistan")}
                required
                className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
              Phone Number
            </T></label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={translate("e.g., +92 300 1234567")}
              className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-gold text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 w-full sm:w-auto"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <T>{saving ? "Saving to Database..." : "Save Changes"}</T>
          </button>
        </LocalizedForm>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h3 className="font-heading font-bold text-red-600 text-sm mb-3"><T>Sign Out</T></h3>
        <p className="text-xs text-charcoal-300 mb-4"><T>
          Sign out of your account. You can sign back in anytime.
        </T></p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-all"
        >
          <LogOut size={16} /><T>
          Sign Out
        </T></button>
      </div>
    </div>
  );
}
