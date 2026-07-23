// ═══════════════════════════════════════════════
// CosmosX — Global User / Gamification Store
// ═══════════════════════════════════════════════

export type UserLevel =
  | "Cadet"
  | "Explorer"
  | "Navigator"
  | "Astronaut"
  | "Commander"
  | "Galaxy Master";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  planet: string;
  earnedAt?: number; // timestamp ms
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  planet: string;
  badge?: string;
  timestamp: number;
}

export interface UserState {
  xp: number;
  streak: number;
  lastLoginDate: string; // ISO date YYYY-MM-DD
  completedPlanets: string[];
  earnedBadgeIds: string[];
  planetProgress: Record<string, number>; // planet id -> % 0-100
  activityDates: string[]; // ISO dates of active days (last 30)
  recentActivity: ActivityItem[];
}

// ── Level thresholds ─────────────────────────
export const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  Cadet: 0,
  Explorer: 500,
  Navigator: 2000,
  Astronaut: 5000,
  Commander: 10000,
  "Galaxy Master": 25000,
};

export const LEVELS: UserLevel[] = [
  "Cadet",
  "Explorer",
  "Navigator",
  "Astronaut",
  "Commander",
  "Galaxy Master",
];

// ── All badges ────────────────────────────────
export const ALL_BADGES: Badge[] = [
  {
    id: "first_block",
    name: "First Block",
    description: "Complete Module 01 on Mercury",
    icon: "🏅",
    planet: "mercury",
  },
  {
    id: "hash_cracker",
    name: "Hash Cracker",
    description: "Solve all Venus cryptography challenges",
    icon: "🔐",
    planet: "venus",
  },
  {
    id: "consensus_king",
    name: "Consensus King",
    description: "Complete Earth's consensus simulator",
    icon: "⚡",
    planet: "earth",
  },
  {
    id: "gas_guru",
    name: "Gas Guru",
    description: "Complete Mars with optimal fee management",
    icon: "⛽",
    planet: "mars",
  },
  {
    id: "contract_deployer",
    name: "Contract Deployer",
    description: "Deploy your first Soroban contract on Jupiter",
    icon: "🤖",
    planet: "jupiter",
  },
  {
    id: "token_forge",
    name: "Token Forge",
    description: "Issue a custom token on Saturn",
    icon: "🪙",
    planet: "saturn",
  },
  {
    id: "nft_pioneer",
    name: "NFT Pioneer",
    description: "Mint your first NFT on Uranus",
    icon: "💎",
    planet: "uranus",
  },
  {
    id: "mainnet_launch",
    name: "Mainnet Launch",
    description: "Execute a real Stellar transaction",
    icon: "🚀",
    planet: "neptune",
  },
  {
    id: "galaxy_master",
    name: "Galaxy Master",
    description: "Complete all 8 planets",
    icon: "🌌",
    planet: "all",
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Top 10% on any timed challenge",
    icon: "🏆",
    planet: "any",
  },
  {
    id: "mercury_graduate",
    name: "Mercury Graduate",
    description: "Complete all 8 Mercury modules + escape room",
    icon: "🎓",
    planet: "mercury",
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    planet: "any",
  },
];

// ── Simulated leaderboard users ───────────────
export const LEADERBOARD_USERS = [
  { rank: 1, name: "NovaStellar", xp: 24800, level: "Galaxy Master" as UserLevel, streak: 47, planets: 8, avatar: "N", color: "#00E5FF" },
  { rank: 2, name: "CryptoKnight", xp: 22100, level: "Galaxy Master" as UserLevel, streak: 31, planets: 8, avatar: "C", color: "#8B5CF6" },
  { rank: 3, name: "BlockChainBob", xp: 19500, level: "Commander" as UserLevel, streak: 28, planets: 7, avatar: "B", color: "#F59E0B" },
  { rank: 4, name: "StellarSage", xp: 17200, level: "Commander" as UserLevel, streak: 22, planets: 7, avatar: "S", color: "#10B981" },
  { rank: 5, name: "OrbitEngineer", xp: 15600, level: "Commander" as UserLevel, streak: 19, planets: 6, avatar: "O", color: "#EC4899" },
  { rank: 6, name: "HashQueen", xp: 13900, level: "Astronaut" as UserLevel, streak: 15, planets: 6, avatar: "H", color: "#F97316" },
  { rank: 7, name: "SorobanDev", xp: 12100, level: "Astronaut" as UserLevel, streak: 12, planets: 5, avatar: "S", color: "#6366F1" },
  { rank: 8, name: "DefiPilot", xp: 10800, level: "Astronaut" as UserLevel, streak: 9, planets: 5, avatar: "D", color: "#00E5FF" },
  { rank: 9, name: "ZeroKnowledge", xp: 9400, level: "Astronaut" as UserLevel, streak: 7, planets: 4, avatar: "Z", color: "#8B5CF6" },
  { rank: 10, name: "MerkleTree", xp: 8200, level: "Navigator" as UserLevel, streak: 5, planets: 4, avatar: "M", color: "#F59E0B" },
  { rank: 11, name: "LedgerLord", xp: 7100, level: "Navigator" as UserLevel, streak: 4, planets: 3, avatar: "L", color: "#10B981" },
  { rank: 12, name: "CosmicCoder", xp: 6300, level: "Navigator" as UserLevel, streak: 3, planets: 3, avatar: "C", color: "#EC4899" },
  { rank: 13, name: "ByteWatcher", xp: 5500, level: "Navigator" as UserLevel, streak: 2, planets: 2, avatar: "B", color: "#F97316" },
  { rank: 14, name: "QuantumNode", xp: 4200, level: "Explorer" as UserLevel, streak: 1, planets: 2, avatar: "Q", color: "#6366F1" },
  { rank: 15, name: "VoidWalker", xp: 3100, level: "Explorer" as UserLevel, streak: 0, planets: 1, avatar: "V", color: "#00E5FF" },
];

// ── Simulated activity feed ───────────────────
export const SIMULATED_ACTIVITY: ActivityItem[] = [
  { id: "a1", user: "NovaStellar", action: "earned", planet: "Neptune", badge: "Mainnet Launch 🚀", timestamp: Date.now() - 1000 * 60 * 2 },
  { id: "a2", user: "CryptoKnight", action: "completed", planet: "Jupiter", badge: "Contract Deployer 🤖", timestamp: Date.now() - 1000 * 60 * 7 },
  { id: "a3", user: "StellarSage", action: "reached rank", planet: "", badge: "Commander ⭐", timestamp: Date.now() - 1000 * 60 * 12 },
  { id: "a4", user: "HashQueen", action: "earned", planet: "Venus", badge: "Hash Cracker 🔐", timestamp: Date.now() - 1000 * 60 * 18 },
  { id: "a5", user: "OrbitEngineer", action: "minted NFT on", planet: "Uranus", badge: "NFT Pioneer 💎", timestamp: Date.now() - 1000 * 60 * 25 },
  { id: "a6", user: "BlockChainBob", action: "completed", planet: "Saturn", badge: "Token Forge 🪙", timestamp: Date.now() - 1000 * 60 * 31 },
  { id: "a7", user: "DefiPilot", action: "earned", planet: "Mercury", badge: "Mercury Graduate 🎓", timestamp: Date.now() - 1000 * 60 * 45 },
  { id: "a8", user: "SorobanDev", action: "reached", planet: "", badge: "7-day streak 🔥", timestamp: Date.now() - 1000 * 60 * 58 },
];

// ── Storage key ───────────────────────────────
const STORAGE_KEY = "cosmosx_user_state_v1";

// ── Default state ─────────────────────────────
const DEFAULT_STATE: UserState = {
  xp: 0,
  streak: 0,
  lastLoginDate: "",
  completedPlanets: [],
  earnedBadgeIds: [],
  planetProgress: {
    mercury: 0,
    venus: 0,
    earth: 0,
    mars: 0,
    jupiter: 0,
    saturn: 0,
    uranus: 0,
    neptune: 0,
  },
  activityDates: [],
  recentActivity: [],
};

// ── Read / Write ──────────────────────────────
export function getUserState(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveUserState(state: UserState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* silent */
  }
}

// ── Helpers ───────────────────────────────────
export function getUserLevel(xp: number): UserLevel {
  let level: UserLevel = "Cadet";
  for (const [lvl, threshold] of Object.entries(LEVEL_THRESHOLDS)) {
    if (xp >= threshold) level = lvl as UserLevel;
  }
  return level;
}

export function getNextLevelInfo(xp: number): { level: UserLevel; xpNeeded: number; xpToNext: number; progress: number } {
  const currentLevel = getUserLevel(xp);
  const currentIdx = LEVELS.indexOf(currentLevel);
  const nextLevel = LEVELS[currentIdx + 1] as UserLevel | undefined;
  if (!nextLevel) {
    return { level: currentLevel, xpNeeded: LEVEL_THRESHOLDS["Galaxy Master"], xpToNext: 0, progress: 100 };
  }
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = LEVEL_THRESHOLDS[nextLevel];
  const xpInRange = xp - currentThreshold;
  const rangeSize = nextThreshold - currentThreshold;
  return {
    level: nextLevel,
    xpNeeded: nextThreshold,
    xpToNext: nextThreshold - xp,
    progress: Math.round((xpInRange / rangeSize) * 100),
  };
}

export function awardXP(amount: number): UserState {
  const state = getUserState();
  state.xp += amount;
  // Update streak
  const today = new Date().toISOString().split("T")[0];
  if (!state.activityDates.includes(today)) {
    state.activityDates = [...state.activityDates.slice(-29), today];
  }
  if (state.lastLoginDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    state.streak = state.lastLoginDate === yesterday ? state.streak + 1 : 1;
    state.lastLoginDate = today;
  }
  saveUserState(state);
  return state;
}

export function awardBadge(badgeId: string): UserState {
  const state = getUserState();
  if (!state.earnedBadgeIds.includes(badgeId)) {
    state.earnedBadgeIds = [...state.earnedBadgeIds, badgeId];
    const badge = ALL_BADGES.find((b) => b.id === badgeId);
    if (badge) {
      const activity: ActivityItem = {
        id: `act_${Date.now()}`,
        user: "You",
        action: "earned",
        planet: badge.planet,
        badge: `${badge.name} ${badge.icon}`,
        timestamp: Date.now(),
      };
      state.recentActivity = [activity, ...state.recentActivity.slice(0, 9)];
    }
  }
  saveUserState(state);
  return state;
}

export function updatePlanetProgress(planetId: string, progress: number): void {
  const state = getUserState();
  state.planetProgress = { ...state.planetProgress, [planetId]: Math.min(100, progress) };
  if (progress >= 100 && !state.completedPlanets.includes(planetId)) {
    state.completedPlanets = [...state.completedPlanets, planetId];
  }
  saveUserState(state);
}

export function getTotalXP(): number {
  return getUserState().xp;
}

export function getEarnedBadges(): Badge[] {
  const { earnedBadgeIds } = getUserState();
  return ALL_BADGES.filter((b) => earnedBadgeIds.includes(b.id));
}

export function getLockedBadges(): Badge[] {
  const { earnedBadgeIds } = getUserState();
  return ALL_BADGES.filter((b) => !earnedBadgeIds.includes(b.id));
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Seed demo XP so dashboard looks good on first load
export function seedDemoState(): void {
  const state = getUserState();
  if (state.xp === 0 && state.earnedBadgeIds.length === 0) {
    state.xp = 1250;
    state.streak = 3;
    const today = new Date().toISOString().split("T")[0];
    state.lastLoginDate = today;
    state.activityDates = [
      new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
      new Date(Date.now() - 86400000).toISOString().split("T")[0],
      today,
    ];
    state.planetProgress = {
      mercury: 100,
      venus: 0,
      earth: 0,
      mars: 0,
      jupiter: 0,
      saturn: 0,
      uranus: 0,
      neptune: 0,
    };
    state.completedPlanets = ["mercury"];
    state.earnedBadgeIds = ["first_block", "mercury_graduate"];
    saveUserState(state);
  }
}
