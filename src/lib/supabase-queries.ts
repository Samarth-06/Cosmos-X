/**
 * CosmosX — Supabase Query Helpers
 *
 * All database operations go through this file.
 * The rest of the app never imports supabase directly — use these helpers.
 *
 * NOTE: Type casts use `as unknown as T` because the Supabase client is
 * initialized without a generated Database generic (requires Supabase CLI).
 * Once you run `supabase gen types typescript`, update supabase.ts to use
 * createClient<Database>(...) and remove the casts here.
 */

import { supabase, isSupabaseConfigured } from "./supabase";
import type {
  Profile,
  UserProgress,
  TaskScoreUpsert,
  ModuleCompletionUpsert,
  Achievement,
  LeaderboardRow,
  TerminalSession,
  TerminalSessionState,
  CommandHistoryEntry,
  UserProgressUpdate,
  ProfileUpdate,
} from "./supabase-types";

// Convenience: typed query builder (cast needed until CLI types are generated)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ────────────────────────────────────────────────────────────────────────────
// Guard: silently no-op when Supabase is not yet configured
// ────────────────────────────────────────────────────────────────────────────

function guardConfigured(): boolean {
  if (!isSupabaseConfigured()) {
    console.debug("[CosmosX/db] Supabase not configured — skipping sync.");
    return false;
  }
  return true;
}

// ============================================================================
// AUTH
// ============================================================================

/** Sign up with email + password. Optionally pass display name. */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
  username?: string,
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName ?? email.split("@")[0],
        username: username ?? email.split("@")[0],
      },
    },
  });
}

/** Sign in with email + password. */
export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

/** Sign in with Google OAuth (redirects). */
export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/` },
  });
}

/** Sign out the current user. */
export async function signOut() {
  return supabase.auth.signOut();
}

/** Get the current authenticated session. */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Get the current authenticated user. */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ============================================================================
// PROFILES
// ============================================================================

/** Fetch a user's public profile by user ID. */
export async function getProfile(userId: string): Promise<Profile | null> {
  if (!guardConfigured()) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) { console.error("[CosmosX/db] getProfile:", error.message); return null; }
  return data;
}

/** Update the current user's profile fields. */
export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<boolean> {
  if (!guardConfigured()) return false;
  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) { console.error("[CosmosX/db] updateProfile:", error.message); return false; }
  return true;
}

/** Update avatar URL after uploading to Supabase Storage. */
export async function updateAvatar(userId: string, avatarUrl: string): Promise<boolean> {
  return updateProfile(userId, { avatar_url: avatarUrl });
}

/** Mark last_active_at to now (call on user activity). */
export async function touchLastActive(userId: string): Promise<void> {
  if (!guardConfigured()) return;
  await supabase
    .from("profiles")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", userId);
}

// ============================================================================
// USER PROGRESS
// ============================================================================

/** Get the user's progress record. */
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  if (!guardConfigured()) return null;
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) { console.error("[CosmosX/db] getUserProgress:", error.message); return null; }
  return data;
}

/** Update specific fields in the user progress record. */
export async function updateUserProgress(
  userId: string,
  updates: UserProgressUpdate,
): Promise<boolean> {
  if (!guardConfigured()) return false;
  const { error } = await supabase
    .from("user_progress")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) { console.error("[CosmosX/db] updateUserProgress:", error.message); return false; }
  return true;
}

/** Advance the user to a specific task in the curriculum. */
export async function setCurrentTask(
  userId: string,
  planet: string,
  moduleId: number,
  taskId: string,
  completionPct: number,
): Promise<boolean> {
  return updateUserProgress(userId, {
    current_planet: planet as UserProgress["current_planet"],
    current_module_id: moduleId,
    current_task_id: taskId,
    mercury_completion_pct: completionPct,
  });
}

/** Add XP to a user. Automatically updates level. */
export async function addXP(userId: string, xpGained: number): Promise<boolean> {
  if (!guardConfigured()) return false;
  const progress = await getUserProgress(userId);
  if (!progress) return false;

  const newXP = progress.total_xp + xpGained;
  const newLevel = Math.floor(Math.sqrt(newXP / 50)) + 1;
  const xpToNext = newLevel * newLevel * 50 - newXP;

  return updateUserProgress(userId, {
    total_xp: newXP,
    level: Math.min(newLevel, 100),
    xp_to_next_level: Math.max(0, xpToNext),
  });
}

/** Update the user's daily streak. Call once per day on login. */
export async function updateStreak(userId: string): Promise<void> {
  if (!guardConfigured()) return;
  const progress = await getUserProgress(userId);
  if (!progress) return;

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const lastActivity = progress.last_activity_date;

  if (lastActivity === today) return; // already updated today

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const isConsecutive = lastActivity === yesterday;

  const newStreak = isConsecutive ? progress.current_streak_days + 1 : 1;

  await updateUserProgress(userId, {
    current_streak_days: newStreak,
    longest_streak_days: Math.max(progress.longest_streak_days, newStreak),
    last_activity_date: today,
  });
}

/** Mark a Mercury module as verified in the progress array. */
export async function markMercuryModuleVerified(
  userId: string,
  moduleId: number,
): Promise<boolean> {
  if (!guardConfigured()) return false;
  const progress = await getUserProgress(userId);
  if (!progress) return false;

  const existing = progress.mercury_modules_verified ?? [];
  if (existing.includes(moduleId)) return true; // already verified

  const updated = [...existing, moduleId].sort((a, b) => a - b);
  const completionPct = Math.round((updated.length / 8) * 100);

  return updateUserProgress(userId, {
    mercury_modules_verified: updated,
    mercury_completion_pct: completionPct,
    total_tasks_completed: progress.total_tasks_completed + 1,
    ...(moduleId === 1 && !progress.mercury_started_at
      ? { mercury_started_at: new Date().toISOString() }
      : {}),
    ...(updated.length === 8
      ? { mercury_completed_at: new Date().toISOString() }
      : {}),
  });
}

// ============================================================================
// TASK SCORES
// ============================================================================

/** Save (upsert) a task score. Called when a learner completes a task. */
export async function saveTaskScoreToSupabase(
  score: TaskScoreUpsert,
): Promise<boolean> {
  if (!guardConfigured()) return false;
  const { error } = await supabase
    .from("task_scores")
    .upsert(score, { onConflict: "user_id,planet,task_id" });
  if (error) { console.error("[CosmosX/db] saveTaskScore:", error.message); return false; }

  // Award XP
  if (score.xp_awarded && score.xp_awarded > 0) {
    await addXP(score.user_id, score.xp_awarded);
  }

  return true;
}

/** Fetch all task scores for a user on a given planet. */
export async function getTaskScoresForPlanet(
  userId: string,
  planet: string = "mercury",
) {
  if (!guardConfigured()) return [];
  const { data, error } = await supabase
    .from("task_scores")
    .select("*")
    .eq("user_id", userId)
    .eq("planet", planet)
    .order("completed_at", { ascending: false });
  if (error) { console.error("[CosmosX/db] getTaskScores:", error.message); return []; }
  return data ?? [];
}

/** Get a single task score record. */
export async function getTaskScore(userId: string, taskId: string, planet = "mercury") {
  if (!guardConfigured()) return null;
  const { data, error } = await supabase
    .from("task_scores")
    .select("*")
    .eq("user_id", userId)
    .eq("task_id", taskId)
    .eq("planet", planet)
    .single();
  if (error) return null;
  return data;
}

// ============================================================================
// MODULE COMPLETIONS
// ============================================================================

/** Record a module verification (pass or fail). */
export async function saveModuleCompletion(
  completion: ModuleCompletionUpsert,
): Promise<boolean> {
  if (!guardConfigured()) return false;
  const { error } = await supabase
    .from("module_completions")
    .upsert(completion, { onConflict: "user_id,planet,module_id" });
  if (error) {
    console.error("[CosmosX/db] saveModuleCompletion:", error.message);
    return false;
  }

  if (completion.verified) {
    // Update progress tracking
    await markMercuryModuleVerified(completion.user_id, completion.module_id);

    // Award module XP
    if (completion.xp_awarded) {
      await addXP(completion.user_id, completion.xp_awarded);
    }

    // Unlock rocket component
    if (completion.rocket_component_name) {
      await unlockRocketComponent(
        completion.user_id,
        completion.planet,
        completion.module_id,
        completion.rocket_component_name,
        completion.rocket_component_emoji,
      );
    }
  }

  return true;
}

/** Get all verified module completions for a user on a planet. */
export async function getModuleCompletions(userId: string, planet = "mercury") {
  if (!guardConfigured()) return [];
  const { data, error } = await supabase
    .from("module_completions")
    .select("*")
    .eq("user_id", userId)
    .eq("planet", planet)
    .eq("verified", true)
    .order("module_id");
  if (error) { console.error("[CosmosX/db] getModuleCompletions:", error.message); return []; }
  return data ?? [];
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

/** Unlock an achievement for a user (safe to call multiple times — upsert). */
export async function unlockAchievement(
  userId: string,
  achievementKey: string,
  achievementName: string,
  options?: {
    description?: string;
    icon?: string;
    category?: Achievement["achievement_category"];
    rarity?: Achievement["rarity"];
    xpAwarded?: number;
    triggerContext?: Record<string, unknown>;
  },
): Promise<boolean> {
  if (!guardConfigured()) return false;
  const { error } = await db.from("achievements").upsert(
    {
      user_id: userId,
      achievement_key: achievementKey,
      achievement_name: achievementName,
      achievement_description: options?.description ?? null,
      achievement_icon: options?.icon ?? null,
      achievement_category: options?.category ?? "learning",
      rarity: options?.rarity ?? "common",
      xp_awarded: options?.xpAwarded ?? 10,
      trigger_context: options?.triggerContext ?? null,
      unlocked_at: new Date().toISOString(),
    },
    { onConflict: "user_id,achievement_key" },
  );
  if (error) { console.error("[CosmosX/db] unlockAchievement:", error.message); return false; }

  // Award XP for achievement
  if (options?.xpAwarded) {
    await addXP(userId, options.xpAwarded);
  }

  return true;
}

/** Get all achievements for a user. */
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  if (!guardConfigured()) return [];
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId)
    .order("unlocked_at", { ascending: false });
  if (error) { console.error("[CosmosX/db] getUserAchievements:", error.message); return []; }
  return data ?? [];
}

/** Check if a user already has a specific achievement. */
export async function hasAchievement(userId: string, key: string): Promise<boolean> {
  if (!guardConfigured()) return false;
  const { data } = await supabase
    .from("achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_key", key)
    .single();
  return !!data;
}

// ─── Achievement auto-check helpers ─────────────────────────────────────────

/**
 * Run after each task completion to check and unlock relevant achievements.
 * This is a lightweight client-side check — for critical checks, use DB triggers.
 */
export async function checkAndUnlockAchievements(
  userId: string,
  context: {
    taskId: string;
    score: number;
    maxScore: number;
    hintsUsed: number;
    timeSpentSecs?: number;
    moduleId: number;
    planet: string;
  },
): Promise<void> {
  if (!guardConfigured()) return;

  const checks: Array<() => Promise<void>> = [];

  // First task ever
  checks.push(async () => {
    const progress = await getUserProgress(userId);
    if (progress && progress.total_tasks_completed === 0) {
      await unlockAchievement(userId, "first_steps", "First Steps", {
        icon: "🚀", rarity: "common", xpAwarded: 10,
        description: "Complete your first task",
        triggerContext: { taskId: context.taskId },
      });
    }
  });

  // Perfect score
  if (context.score === context.maxScore && context.hintsUsed === 0) {
    checks.push(async () => {
      await unlockAchievement(userId, "perfect_score", "Flawless", {
        icon: "✨", rarity: "common", xpAwarded: 15,
        description: "Score 10/10 on any task",
        triggerContext: { taskId: context.taskId, score: context.score },
      });
    });
  }

  // No hints needed
  if (context.hintsUsed === 0 && context.score >= context.maxScore * 0.8) {
    checks.push(async () => {
      const already = await hasAchievement(userId, "no_hints");
      if (!already) {
        await unlockAchievement(userId, "no_hints", "No Hints Needed", {
          icon: "🧠", rarity: "common", xpAwarded: 15,
          description: "Complete a task without using hints",
        });
      }
    });
  }

  // Speed runner (< 60 seconds)
  if (context.timeSpentSecs && context.timeSpentSecs < 60 && context.score > 0) {
    checks.push(async () => {
      const already = await hasAchievement(userId, "speed_runner");
      if (!already) {
        await unlockAchievement(userId, "speed_runner", "Speed Runner", {
          icon: "⚡", rarity: "rare", xpAwarded: 30,
          description: "Complete a task in under 60 seconds",
          triggerContext: { timeSpentSecs: context.timeSpentSecs },
        });
      }
    });
  }

  // Run all checks in parallel
  await Promise.allSettled(checks.map((c) => c()));
}

// ============================================================================
// TERMINAL SESSIONS
// ============================================================================

/** Start a new terminal session for a task. Returns the session ID. */
export async function startTerminalSession(
  userId: string,
  planet: string,
  moduleId: number,
  taskId: string,
  network: TerminalSession["network"] = "testnet",
): Promise<string | null> {
  if (!guardConfigured()) return null;
  const { data, error } = await supabase
    .from("terminal_sessions")
    .insert({
      user_id: userId,
      planet,
      module_id: moduleId,
      task_id: taskId,
      network,
      provider_type: "simulation",
      command_history: [],
      session_state: {},
      task_completed: false,
      started_at: new Date().toISOString(),
      duration_secs: 0,
    })
    .select("id")
    .single();
  if (error) { console.error("[CosmosX/db] startTerminalSession:", error.message); return null; }

  // First terminal use achievement
  const already = await hasAchievement(userId, "terminal_first");
  if (!already) {
    await unlockAchievement(userId, "terminal_first", "Terminal Operator", {
      icon: "💻", rarity: "common", xpAwarded: 10,
      description: "Use the Cosmos Terminal for the first time",
    });
  }

  return data.id;
}

/** Append a command entry to an existing terminal session's history. */
export async function appendTerminalCommand(
  sessionId: string,
  entry: CommandHistoryEntry,
): Promise<void> {
  if (!guardConfigured() || !sessionId) return;

  // Fetch current history first (no array_append in JS SDK easily)
  const { data: session } = await supabase
    .from("terminal_sessions")
    .select("command_history")
    .eq("id", sessionId)
    .single();

  if (!session) return;

  const history = (session.command_history as CommandHistoryEntry[]) ?? [];
  history.push(entry);

  await supabase
    .from("terminal_sessions")
    .update({ command_history: history })
    .eq("id", sessionId);
}

/** Update the session state snapshot (accounts, contracts, etc.). */
export async function updateTerminalState(
  sessionId: string,
  state: TerminalSessionState,
): Promise<void> {
  if (!guardConfigured() || !sessionId) return;
  await supabase
    .from("terminal_sessions")
    .update({ session_state: state })
    .eq("id", sessionId);
}

/** Mark a terminal session as completed. */
export async function completeTerminalSession(
  sessionId: string,
  completionTrigger: string,
  durationSecs: number,
): Promise<void> {
  if (!guardConfigured() || !sessionId) return;
  await supabase
    .from("terminal_sessions")
    .update({
      task_completed: true,
      completion_trigger: completionTrigger,
      ended_at: new Date().toISOString(),
      duration_secs: durationSecs,
    })
    .eq("id", sessionId);
}

// ============================================================================
// ROCKET COMPONENTS
// ============================================================================

/** Unlock a rocket component when a module is verified. */
export async function unlockRocketComponent(
  userId: string,
  planet: string,
  moduleId: number,
  componentName: string,
  componentEmoji?: string | null,
): Promise<boolean> {
  if (!guardConfigured()) return false;
  const { error } = await db.from("rocket_components").upsert(
    {
      user_id: userId,
      planet,
      component_index: moduleId,
      component_name: componentName,
      component_emoji: componentEmoji ?? null,
      unlocked_by_module_id: moduleId,
      unlocked_at: new Date().toISOString(),
    },
    { onConflict: "user_id,planet,component_index" },
  );
  if (error) { console.error("[CosmosX/db] unlockRocketComponent:", error.message); return false; }
  return true;
}

/** Get all rocket components for a user on a planet. */
export async function getRocketComponents(userId: string, planet = "mercury") {
  if (!guardConfigured()) return [];
  const { data, error } = await supabase
    .from("rocket_components")
    .select("*")
    .eq("user_id", userId)
    .eq("planet", planet)
    .order("component_index");
  if (error) { console.error("[CosmosX/db] getRocketComponents:", error.message); return []; }
  return data ?? [];
}

// ============================================================================
// LEADERBOARD
// ============================================================================

/** Fetch top N users from the leaderboard materialized view. */
export async function getLeaderboard(limit = 50): Promise<LeaderboardRow[]> {
  if (!guardConfigured()) return [];
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("total_xp", { ascending: false })
    .limit(limit);
  if (error) { console.error("[CosmosX/db] getLeaderboard:", error.message); return []; }
  return data ?? [];
}

/** Get the user's rank from the leaderboard. */
export async function getUserRank(userId: string): Promise<number | null> {
  if (!guardConfigured()) return null;
  const { data, error } = await supabase
    .from("leaderboard")
    .select("user_id, total_xp")
    .order("total_xp", { ascending: false });
  if (error || !data) return null;
  const rank = data.findIndex((row) => row.user_id === userId);
  return rank === -1 ? null : rank + 1;
}

// ============================================================================
// STORAGE
// ============================================================================

/** Upload a user avatar and return the public URL. */
export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<string | null> {
  if (!guardConfigured()) return null;
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await db.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) { console.error("[CosmosX/db] uploadAvatar:", uploadError.message); return null; }

  const { data } = db.storage.from("avatars").getPublicUrl(path);
  const publicUrl = data.publicUrl;

  // Save URL to profile
  await updateAvatar(userId, publicUrl);
  return publicUrl;
}



