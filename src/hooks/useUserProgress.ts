/**
 * useUserProgress — Read and write the learner's progress
 *
 * Usage:
 *   const { progress, loading, syncTaskToCloud, addXP } = useUserProgress(userId);
 */

import { useState, useEffect, useCallback } from "react";
import type { UserProgress } from "@/lib/supabase-types";
import {
  getUserProgress,
  updateUserProgress,
  addXP as dbAddXP,
  updateStreak,
  setCurrentTask,
} from "@/lib/supabase-queries";

export function useUserProgress(userId: string | null) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);

  // Load progress on mount / user change
  useEffect(() => {
    if (!userId) { setProgress(null); return; }
    setLoading(true);
    getUserProgress(userId)
      .then(setProgress)
      .finally(() => setLoading(false));
  }, [userId]);

  /** Persist the current task position to the cloud. */
  const syncCurrentTask = useCallback(
    async (planet: string, moduleId: number, taskId: string, completionPct: number) => {
      if (!userId) return;
      await setCurrentTask(userId, planet, moduleId, taskId, completionPct);
      // Refresh local state
      const updated = await getUserProgress(userId);
      setProgress(updated);
    },
    [userId],
  );

  /** Add XP and refresh local state. */
  const addXP = useCallback(
    async (xp: number) => {
      if (!userId) return;
      await dbAddXP(userId, xp);
      const updated = await getUserProgress(userId);
      setProgress(updated);
    },
    [userId],
  );

  /** Call once per day on login to maintain streak. */
  const refreshStreak = useCallback(async () => {
    if (!userId) return;
    await updateStreak(userId);
    const updated = await getUserProgress(userId);
    setProgress(updated);
  }, [userId]);

  /** Directly update arbitrary progress fields. */
  const update = useCallback(
    async (fields: Partial<Omit<UserProgress, "id" | "user_id" | "created_at">>) => {
      if (!userId) return;
      await updateUserProgress(userId, fields);
      const updated = await getUserProgress(userId);
      setProgress(updated);
    },
    [userId],
  );

  return { progress, loading, syncCurrentTask, addXP, refreshStreak, update };
}
