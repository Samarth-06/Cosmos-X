/**
 * CosmosX — Supabase TypeScript Types
 * Auto-generated shape matching the SQL schema.
 * Update this file when schema changes.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Enums ────────────────────────────────────────────────────────────────────

export type Planet =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export type UserRole = "student" | "instructor" | "admin";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type TaskType =
  | "inspector"
  | "terminal-audit"
  | "drag-drop"
  | "math-console"
  | "server-audit"
  | "validator-terminal"
  | "graph-matcher"
  | "comparison"
  | "cosmos-terminal"
  | "story-adventure";

export type AchievementCategory =
  | "learning"
  | "streak"
  | "speed"
  | "perfect"
  | "social"
  | "hidden";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export type NetworkType = "testnet" | "mainnet" | "devnet";

export type TerminalProvider = "simulation" | "container" | "remote-vm";

// ─── Row Types ────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;                          // UUID — mirrors auth.users.id
  username: string;
  display_name: string | null;
  avatar_url: string | null;           // Supabase Storage public URL
  bio: string | null;
  email: string;
  email_verified: boolean;
  role: UserRole;
  onboarding_complete: boolean;
  learning_goal: string | null;        // e.g. "developer" | "investor" | "curious"
  experience_level: ExperienceLevel;
  created_at: string;                  // ISO 8601
  updated_at: string;
  last_active_at: string | null;
}

export interface UserProgress {
  id: string;
  user_id: string;

  // Current curriculum position
  current_planet: Planet;
  current_module_id: number;           // 1–8
  current_task_id: string;             // e.g. "task2_3" | "story" | "final_challenge"
  current_task_step: string;           // sub-step within a task e.g. "init" | "deployed"

  // XP & Level
  total_xp: number;
  level: number;
  xp_to_next_level: number;

  // Mercury-specific progress
  mercury_completion_pct: number;      // 0–100
  mercury_modules_verified: number[];  // e.g. [1, 2, 3]
  mercury_started_at: string | null;
  mercury_completed_at: string | null;

  // Streaks
  current_streak_days: number;
  longest_streak_days: number;
  last_activity_date: string | null;   // DATE as string "YYYY-MM-DD"

  // Aggregate stats
  total_tasks_completed: number;
  total_time_spent_mins: number;

  created_at: string;
  updated_at: string;
}

export interface TaskScore {
  id: string;
  user_id: string;

  planet: string;
  module_id: number;
  task_id: string;
  task_title: string | null;
  task_type: TaskType;

  score: number;
  max_score: number;
  passed: boolean;
  attempts: number;
  hints_used: number;
  xp_awarded: number;

  time_spent_secs: number | null;
  started_at: string | null;
  completed_at: string;
}

export interface ModuleCompletion {
  id: string;
  user_id: string;

  planet: string;
  module_id: number;
  module_title: string | null;

  verified: boolean;
  verification_score: number;
  verification_max: number;

  rocket_component_name: string | null;
  rocket_component_emoji: string | null;
  xp_awarded: number;

  first_attempted_at: string;
  verified_at: string | null;
}

export interface Achievement {
  id: string;
  user_id: string;

  achievement_key: string;
  achievement_name: string;
  achievement_description: string | null;
  achievement_icon: string | null;
  achievement_category: AchievementCategory;
  rarity: AchievementRarity;
  xp_awarded: number;
  trigger_context: Json | null;

  unlocked_at: string;
}

export interface AchievementDefinition {
  key: string;
  name: string;
  description: string;
  icon: string | null;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xp_reward: number;
  unlock_condition: string;
}

export interface TerminalSession {
  id: string;
  user_id: string;

  planet: string;
  module_id: number;
  task_id: string;

  network: NetworkType;
  provider_type: TerminalProvider;

  command_history: CommandHistoryEntry[];
  session_state: TerminalSessionState;

  task_completed: boolean;
  completion_trigger: string | null;

  started_at: string;
  ended_at: string | null;
  duration_secs: number;
}

export interface CommandHistoryEntry {
  cmd: string;
  output: string;
  timestamp: string;
  success: boolean;
}

export interface TerminalSessionState {
  currentDirectory?: string;
  network?: NetworkType;
  accounts?: { name: string; network: string; publicKey?: string }[];
  contracts?: { name: string; address: string }[];
  transactionHistory?: { txid: string; from: string; to: string; amount: number }[];
  completedCommands?: string[];
}

export interface RocketComponent {
  id: string;
  user_id: string;

  planet: string;
  component_index: number;             // 1–8
  component_name: string;
  component_emoji: string | null;
  unlocked_by_module_id: number | null;
  unlocked_at: string;
}

// ─── Leaderboard View Row ────────────────────────────────────────────────────

export interface LeaderboardRow {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  level: number;
  current_streak_days: number;
  total_tasks_completed: number;
  mercury_completion_pct: number;
  modules_verified_count: number;
  achievement_count: number;
  last_active: string;
}

// ─── Insert/Update payloads ──────────────────────────────────────────────────

export type ProfileInsert = Omit<Profile, "created_at" | "updated_at" | "last_active_at">;
export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at">>;

export type UserProgressUpdate = Partial<
  Omit<UserProgress, "id" | "user_id" | "created_at">
>;

export type TaskScoreUpsert = {
  user_id: string;
  planet: string;
  module_id: number;
  task_id: string;
  task_title?: string;
  task_type: TaskType;
  score: number;
  max_score: number;
  passed: boolean;
  attempts?: number;
  hints_used?: number;
  xp_awarded?: number;
  time_spent_secs?: number;
  started_at?: string;
};

export type ModuleCompletionUpsert = {
  user_id: string;
  planet: string;
  module_id: number;
  module_title?: string;
  verified: boolean;
  verification_score: number;
  verification_max: number;
  rocket_component_name?: string;
  rocket_component_emoji?: string;
  xp_awarded?: number;
  verified_at?: string;
};

// ─── Database type map (for createClient<Database>) ─────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      user_progress: {
        Row: UserProgress;
        Insert: { user_id: string };
        Update: UserProgressUpdate;
      };
      task_scores: {
        Row: TaskScore;
        Insert: TaskScoreUpsert;
        Update: Partial<TaskScoreUpsert>;
      };
      module_completions: {
        Row: ModuleCompletion;
        Insert: ModuleCompletionUpsert;
        Update: Partial<ModuleCompletionUpsert>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, "id" | "unlocked_at">;
        Update: Partial<Achievement>;
      };
      achievement_definitions: {
        Row: AchievementDefinition;
        Insert: AchievementDefinition;
        Update: Partial<AchievementDefinition>;
      };
      terminal_sessions: {
        Row: TerminalSession;
        Insert: Omit<TerminalSession, "id">;
        Update: Partial<TerminalSession>;
      };
      rocket_components: {
        Row: RocketComponent;
        Insert: Omit<RocketComponent, "id">;
        Update: Partial<RocketComponent>;
      };
    };
    Views: {
      leaderboard: {
        Row: LeaderboardRow;
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
