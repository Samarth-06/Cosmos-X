/**
 * useLeaderboard — Leaderboard data and current user rank
 *
 * Usage:
 *   const { rows, userRank, loading } = useLeaderboard(userId);
 */

import { useState, useEffect, useCallback } from "react";
import type { LeaderboardRow } from "@/lib/supabase-types";
import { getLeaderboard, getUserRank } from "@/lib/supabase-queries";

export function useLeaderboard(userId: string | null, limit = 50) {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [board, rank] = await Promise.all([
      getLeaderboard(limit),
      userId ? getUserRank(userId) : Promise.resolve(null),
    ]);
    setRows(board);
    setUserRank(rank);
    setLoading(false);
  }, [userId, limit]);

  useEffect(() => { refresh(); }, [refresh]);

  const currentUserRow = rows.find((r) => r.user_id === userId) ?? null;

  return { rows, userRank, currentUserRow, loading, refresh };
}
