"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
    setUser(null);
  };

  return { user, loading, signInWithGoogle, signOut };
}
