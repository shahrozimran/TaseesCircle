"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { User, Save, CheckCircle, AlertCircle, Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [city, setCity] = useState(profile?.city || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

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
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("An unexpected error occurred.");
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
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600">
          Profile Settings
        </h1>
        <p className="text-sm text-charcoal-300 mt-1">
          Manage your account information
        </p>
      </motion.div>

      {/* Avatar Section */}
      <div className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8 mb-6">
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

      {/* Edit Form */}
      <div className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8">
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {saved && (
          <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <p className="text-xs text-green-600">Profile updated successfully!</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-1.5">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 border border-beige-200 rounded-xl text-sm text-charcoal-300 bg-beige-50 cursor-not-allowed"
            />
            <p className="text-[11px] text-charcoal-200 mt-1">Email cannot be changed</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-charcoal-400 mb-1.5">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., +92 300 1234567"
                className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-400 mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Lahore"
                className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-1.5">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g., Pakistan"
              className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="mt-6 bg-white rounded-2xl border border-red-200 p-6">
        <h3 className="font-heading font-bold text-red-600 text-sm mb-3">Sign Out</h3>
        <p className="text-xs text-charcoal-300 mb-4">
          Sign out of your account. You can sign back in anytime.
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
