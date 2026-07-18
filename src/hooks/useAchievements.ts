/**
 * useAchievements — List and unlock achievements
 *
 * Usage:
 *   const { achievements, loading, unlock } = useAchievements(userId);
 */

import { useState, useEffect, useCallback } from "react";
import type { Achievement } from "@/lib/supabase-types";
import { getUserAchievements, unlockAchievement } from "@/lib/supabase-queries";

export function useAchievements(userId: string | null) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);

  useEffect(() => {
    if (!userId) { setAchievements([]); return; }
    setLoading(true);
    getUserAchievements(userId)
      .then(setAchievements)
      .finally(() => setLoading(false));
  }, [userId]);

  const unlock = useCallback(
    async (
      key: string,
      name: string,
      options?: Parameters<typeof unlockAchievement>[3],
    ) => {
      if (!userId) return;
      const alreadyHave = achievements.some((a) => a.achievement_key === key);
      if (alreadyHave) return; // already unlocked, skip silently

      const ok = await unlockAchievement(userId, key, name, options);
      if (ok) {
        const updated = await getUserAchievements(userId);
        setAchievements(updated);
        const fresh = updated.find((a) => a.achievement_key === key);
        if (fresh) setRecentUnlock(fresh);
      }
    },
    [userId, achievements],
  );

  /** Clear the "recent unlock" notification after showing it. */
  const clearRecentUnlock = useCallback(() => setRecentUnlock(null), []);

  const byCategory = achievements.reduce<Record<string, Achievement[]>>(
    (acc, a) => {
      const cat = a.achievement_category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(a);
      return acc;
    },
    {},
  );

  return { achievements, byCategory, loading, recentUnlock, clearRecentUnlock, unlock };
}
