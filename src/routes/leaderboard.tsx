import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus, Globe, Flame, ArrowLeft, Star } from "lucide-react";
import { LEADERBOARD_USERS, getUserState, getUserLevel, seedDemoState, type UserLevel } from "@/lib/user-store";
import LiveActivityFeed from "@/components/LiveActivityFeed";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

const PLANET_TABS = [
  { id: "global", label: "Global", emoji: "🌌" },
  { id: "mercury", label: "Mercury", emoji: "☿" },
  { id: "venus", label: "Venus", emoji: "♀" },
  { id: "earth", label: "Earth", emoji: "🌍" },
  { id: "mars", label: "Mars", emoji: "♂" },
  { id: "jupiter", label: "Jupiter", emoji: "♃" },
];

const PERIOD_TABS = [
  { id: "alltime", label: "All Time" },
  { id: "weekly", label: "Weekly Sprint" },
  { id: "monthly", label: "Monthly" },
];

const LEVEL_COLORS: Record<string, string> = {
  "Galaxy Master": "#F59E0B",
  Commander: "#8B5CF6",
  Astronaut: "#00E5FF",
  Navigator: "#10B981",
  Explorer: "#3B82F6",
  Cadet: "#6B7280",
};

function getMedalColor(rank: number) {
  if (rank === 1) return { border: "border-amber-400/50", bg: "bg-amber-400/10", text: "text-amber-400", shadow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]", medal: "🥇" };
  if (rank === 2) return { border: "border-slate-300/40", bg: "bg-slate-300/8", text: "text-slate-300", shadow: "shadow-[0_0_15px_rgba(203,213,225,0.2)]", medal: "🥈" };
  if (rank === 3) return { border: "border-amber-700/40", bg: "bg-amber-700/8", text: "text-amber-600", shadow: "shadow-[0_0_15px_rgba(180,83,9,0.2)]", medal: "🥉" };
  return { border: "border-white/6", bg: "", text: "text-muted-foreground", shadow: "", medal: "" };
}

function LeaderboardPage() {
  const [planetTab, setPlanetTab] = useState("global");
  const [periodTab, setPeriodTab] = useState("alltime");

  seedDemoState();
  const userState = getUserState();
  const userXP = userState.xp;
  const userLevel = getUserLevel(userXP);

  // Shuffle XP slightly for different periods to simulate real data
  const multiplier = periodTab === "weekly" ? 0.08 : periodTab === "monthly" ? 0.35 : 1;
  const displayUsers = LEADERBOARD_USERS.map((u) => ({
    ...u,
    xp: Math.round(u.xp * multiplier),
    change: Math.floor(Math.random() * 5) - 2,
  })).sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));

  // Where does the user rank?
  const userRank = displayUsers.length + 1;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,white_0.7px,transparent_0.7px)] bg-[size:22px_22px] opacity-[0.07]" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-base font-semibold">
              Cosmos<span className="text-secondary">X</span>
            </Link>
            <span className="text-white/20">/</span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Trophy className="h-3.5 w-3.5" /> Leaderboard
            </span>
          </div>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* Main leaderboard */}
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

              {/* Title */}
              <div className="mb-6">
                <h1 className="font-display text-2xl font-bold">Galaxy Rankings</h1>
                <p className="mt-1 text-sm text-muted-foreground">Top explorers ranked by XP earned. Weekly sprints reset every Monday.</p>
              </div>

              {/* Planet tabs */}
              <div className="mb-4 flex gap-1 overflow-x-auto pb-1">
                {PLANET_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPlanetTab(tab.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-medium transition ${planetTab === tab.id ? "bg-white/10 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
                  >
                    <span>{tab.emoji}</span> {tab.label}
                  </button>
                ))}
              </div>

              {/* Period tabs */}
              <div className="mb-6 flex gap-1 rounded-xl border border-white/8 bg-white/[0.02] p-1 w-fit">
                {PERIOD_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPeriodTab(tab.id)}
                    className={`rounded-lg px-4 py-1.5 font-mono text-[11px] font-medium transition ${periodTab === tab.id ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Top 3 podium */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                {[displayUsers[1], displayUsers[0], displayUsers[2]].map((u, i) => {
                  const podiumRank = [2, 1, 3][i];
                  const medal = getMedalColor(podiumRank);
                  const height = podiumRank === 1 ? "h-28" : podiumRank === 2 ? "h-20" : "h-16";
                  return (
                    <div key={u.rank} className={`flex flex-col items-center gap-2 rounded-2xl border ${medal.border} ${medal.bg} ${medal.shadow} p-3 transition`}>
                      {/* Avatar */}
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                        style={{ background: `${u.color}22`, color: u.color, border: `2px solid ${u.color}40` }}
                      >
                        {u.avatar}
                      </div>
                      <div className="text-center">
                        <div className="font-display text-[12px] font-semibold text-foreground">{u.name}</div>
                        <div className={`font-mono text-[9px] ${medal.text}`}>{medal.medal} #{u.rank}</div>
                        <div className="mt-1 font-mono text-[11px] font-bold text-foreground">{u.xp.toLocaleString()} XP</div>
                        <div className="font-mono text-[9px]" style={{ color: LEVEL_COLORS[u.level] }}>{u.level}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-2xl border border-white/8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/[0.02]">
                      <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Rank</th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Explorer</th>
                      <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">XP</th>
                      <th className="hidden px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:table-cell">Streak</th>
                      <th className="hidden px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:table-cell">Planets</th>
                      <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayUsers.slice(3).map((u) => {
                      const medal = getMedalColor(u.rank);
                      return (
                        <tr
                          key={u.rank}
                          className="border-b border-white/5 transition hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-3">
                            <span className={`font-mono text-sm font-bold ${medal.text}`}>#{u.rank}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                                style={{ background: `${u.color}22`, color: u.color }}
                              >
                                {u.avatar}
                              </div>
                              <div>
                                <div className="font-display text-[13px] font-semibold text-foreground">{u.name}</div>
                                <div className="font-mono text-[9px]" style={{ color: LEVEL_COLORS[u.level] }}>{u.level}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm font-bold text-foreground">{u.xp.toLocaleString()}</td>
                          <td className="hidden px-4 py-3 text-right sm:table-cell">
                            <span className="flex items-center justify-end gap-1 font-mono text-[11px] text-orange-400">
                              <Flame className="h-3 w-3" /> {u.streak}d
                            </span>
                          </td>
                          <td className="hidden px-4 py-3 text-right md:table-cell">
                            <div className="flex items-center justify-end gap-0.5">
                              {Array.from({ length: 8 }).map((_, i) => (
                                <Star key={i} className={`h-2 w-2 ${i < u.planets ? "fill-secondary text-secondary" : "text-white/15"}`} />
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {u.change > 0 ? (
                              <span className="flex items-center justify-end gap-0.5 font-mono text-[10px] text-emerald-400"><TrendingUp className="h-3 w-3" />+{u.change}</span>
                            ) : u.change < 0 ? (
                              <span className="flex items-center justify-end gap-0.5 font-mono text-[10px] text-rose-400"><TrendingDown className="h-3 w-3" />{u.change}</span>
                            ) : (
                              <span className="flex items-center justify-end gap-0.5 font-mono text-[10px] text-muted-foreground"><Minus className="h-3 w-3" /></span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* User's own rank - pinned at bottom */}
                <div className="border-t border-cyan-500/20 bg-cyan-950/20 p-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-secondary">#{userRank}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 font-bold text-secondary text-xs">Y</div>
                    <div className="flex-1">
                      <div className="font-display text-[13px] font-semibold">You</div>
                      <div className="font-mono text-[9px]" style={{ color: LEVEL_COLORS[userLevel] }}>{userLevel}</div>
                    </div>
                    <span className="font-mono text-sm font-bold text-foreground">{userXP.toLocaleString()} XP</span>
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground">
                    You need <span className="text-secondary font-semibold">{(displayUsers[displayUsers.length - 1].xp - userXP).toLocaleString()} more XP</span> to enter the top {displayUsers.length}.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5 lg:col-span-4">
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>

              {/* Weekly Sprint Info */}
              <div className="mb-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-[#040816]/90 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Weekly Sprint</span>
                </div>
                <h3 className="font-display text-base font-bold">Resets in 3d 14h</h3>
                <p className="mt-1 text-[11px] text-muted-foreground">Top 10 explorers this week earn bonus XP, rare NFT drops, and a featured badge.</p>
                <div className="mt-3 space-y-1.5">
                  {displayUsers.slice(0, 3).map((u) => (
                    <div key={u.rank} className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5">
                      <span className="font-mono text-[10px] text-amber-400">{u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : "🥉"}</span>
                      <span className="flex-1 font-display text-[12px] text-foreground">{u.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{Math.round(u.xp * 0.08).toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Activity */}
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Live Activity</span>
                <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> LIVE
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-slate-900/60 to-[#040816]/80">
                <LiveActivityFeed maxItems={8} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
