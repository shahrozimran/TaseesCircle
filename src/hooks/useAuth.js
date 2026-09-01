"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data from profiles table
  const fetchProfile = useCallback(async (userId) => {
    const supabase = createClient();
    if (!supabase || !userId) return null;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    return data;
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // If Supabase isn't configured yet, just stop loading
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const profileData = await fetchProfile(user.id);
        setProfile(profileData);
      }

      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const profileData = await fetchProfile(currentUser.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithGoogle = async () => {
    const supabase = createClient();
    if (!supabase) {
      console.warn("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Login error:", error.message);
  };

  const signInWithEmail = async (email, password) => {
    const supabase = createClient();
    if (!supabase) {
      return { error: { message: "Supabase not configured" } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };
    return { data };
  };

  const signUpWithEmail = async (email, password, fullName) => {
    const supabase = createClient();
    if (!supabase) {
      return { error: { message: "Supabase not configured" } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) return { error };
    return { data };
  };

  const resetPassword = async (email) => {
    const supabase = createClient();
    if (!supabase) {
      return { error: { message: "Supabase not configured" } };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/profile`,
    });

    if (error) return { error };
    return { success: true };
  };

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
    isAdmin: profile?.role === "super_admin",
  };
}
