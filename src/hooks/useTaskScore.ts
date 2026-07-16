/**
 * useTaskScore — Save task scores and read history
 *
 * Usage:
 *   const { saveScore, scores, loading } = useTaskScore(userId, "mercury");
 */

import { useState, useEffect, useCallback } from "react";
import type { TaskScore, TaskScoreUpsert } from "@/lib/supabase-types";
import {
  saveTaskScoreToSupabase,
  getTaskScoresForPlanet,
  checkAndUnlockAchievements,
} from "@/lib/supabase-queries";

export function useTaskScore(userId: string | null, planet = "mercury") {
  const [scores, setScores] = useState<TaskScore[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) { setScores([]); return; }
    setLoading(true);
    getTaskScoresForPlanet(userId, planet)
      .then(setScores)
      .finally(() => setLoading(false));
  }, [userId, planet]);

  /** Save a task score. Triggers XP award + achievement checks automatically. */
  const saveScore = useCallback(
    async (
      payload: Omit<TaskScoreUpsert, "user_id"> & {
        timeSpentSecs?: number;
        startedAt?: Date;
      },
    ) => {
      if (!userId) return;

      const scorePayload: TaskScoreUpsert = {
        ...payload,
        user_id: userId,
        xp_awarded: calculateXP(payload.score, payload.max_score, payload.hints_used ?? 0),
        time_spent_secs: payload.timeSpentSecs,
        started_at: payload.startedAt?.toISOString(),
      };

      await saveTaskScoreToSupabase(scorePayload);

      // Check achievements
      await checkAndUnlockAchievements(userId, {
        taskId: payload.task_id,
        score: payload.score,
        maxScore: payload.max_score,
        hintsUsed: payload.hints_used ?? 0,
        timeSpentSecs: payload.timeSpentSecs,
        moduleId: payload.module_id,
        planet,
      });

      // Refresh local state
      const updated = await getTaskScoresForPlanet(userId, planet);
      setScores(updated);
    },
    [userId, planet],
  );

  return { scores, loading, saveScore };
}

/** XP calculation: base 10 + bonuses for perfect score and no hints */
function calculateXP(score: number, maxScore: number, hintsUsed: number): number {
  let xp = 10; // base
  if (score === maxScore) xp += 5; // perfect bonus
  if (hintsUsed === 0 && score > 0) xp += 5; // no hints bonus
  return xp;
}
