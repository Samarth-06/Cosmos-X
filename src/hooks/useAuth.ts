/**
 * useAuth — Authentication state and actions
 *
 * Usage:
 *   const { user, session, loading, signIn, signUp, signOut } = useAuth();
 */

import { useState, useEffect, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut as doSignOut } from "@/lib/supabase-queries";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;

  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>;
  signInGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    // Load initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sess) => {
        setSession(sess);
        setUser(sess?.user ?? null);
        setLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, [configured]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await signInWithEmail(email, password);
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    const { error } = await signUpWithEmail(email, password, displayName);
    return { error: error?.message ?? null };
  }, []);

  const signInGoogle = useCallback(async () => {
    const { error } = await signInWithGoogle();
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await doSignOut();
    setUser(null);
    setSession(null);
  }, []);

  return { user, session, loading, isConfigured: configured, signIn, signUp, signInGoogle, signOut };
}
