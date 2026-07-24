import { motion } from "framer-motion";
import { ArrowRight, Compass, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getUserState,
  getUserLevel,
  getUserRank,
  getOngoingPlanetInfo,
  LEVELS,
  type UserState,
} from "@/lib/user-store";
import { useWallet } from "@/features/achievements/useWallet";

interface HeroContentProps {
  onBeginJourney: () => void;
  onContinueLearning: () => void;
}

export default function HeroContent({ onBeginJourney, onContinueLearning }: HeroContentProps) {
  return (
    <div className="pointer-events-none relative z-10 flex min-h-screen items-center px-3 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 pt-16 sm:pt-20 lg:pt-24 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-center lg:gap-12">
        {/* Left — shifted further left to reveal the 3D asteroid belt */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="pointer-events-auto max-w-xl lg:max-w-md lg:-translate-x-6 xl:-translate-x-10"
        >
          {/* Top section badge bar — widened horizontally & aligned with left text */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/4 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/90 backdrop-blur shadow-[0_0_20px_rgba(255,255,255,0.03)]">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_10px_currentColor]" />
            Interactive Blockchain Universe
          </div>

          <h1 className="mt-4 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            <span className="block">Master blockchain</span>
            <span className="block">
              by <span className="text-gradient">exploring</span>
            </span>
            <span className="block">our solar system.</span>
          </h1>

          <p className="mt-3.5 max-w-md text-[13.5px] leading-relaxed text-muted-foreground sm:text-[14.5px]">
            CosmosX teaches you blockchain visually through cinematic
            simulations — planet by planet — before your first real transaction
            on the Stellar Mainnet. No jargon. No docs first. Just experience.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onBeginJourney}
              className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary via-primary-glow to-secondary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-[0_0_40px_-8px_var(--color-primary)] transition hover:shadow-[0_0_60px_-6px_var(--color-secondary)] cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Begin Journey
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onContinueLearning}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4.5 py-2.5 text-xs sm:text-sm font-medium text-foreground backdrop-blur transition hover:bg-white/10 cursor-pointer"
            >
              Continue Learning
            </button>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-2 py-2.5 text-xs sm:text-sm font-medium text-muted-foreground transition hover:text-foreground cursor-pointer"
            >
              <Compass className="h-3.5 w-3.5" />
              Explore curriculum
            </Link>
          </div>

          {/* Stats grid — perfectly positioned above the fold */}
          <div className="mt-5 grid max-w-md grid-cols-3 gap-5 border-t border-white/8 pt-3.5">
            <Stat label="Planets" value="8" hint="learning modules" />
            <Stat label="Simulations" value="30+" hint="hands-on labs" />
            <Stat label="Learners" value="25k+" hint="orbiting now" />
          </div>
        </motion.div>

        {/* Right — horizontally expanded dashboard glass card shifted right for asteroid belt visibility */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
          className="pointer-events-auto w-full max-w-95 ml-auto lg:translate-x-14 xl:translate-x-16"
        >
          <DashboardCard />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="mx-auto h-8 w-px bg-linear-to-b from-transparent via-white/40 to-transparent" />
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Scroll to launch
        </p>
      </motion.div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div>
      <div className="font-display text-xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </div>
      <div className="text-[10px] text-muted-foreground/70">{hint}</div>
    </div>
  );
}

function DashboardCard() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const { address } = useWallet();

  useEffect(() => {
    setUserState(getUserState());
  }, []);

  if (!userState) {
    return (
      <div className="glass-strong relative overflow-hidden rounded-2xl p-5 h-72 animate-pulse bg-white/5" />
    );
  }

  const level = getUserLevel(userState.xp);
  const levelNum = String(LEVELS.indexOf(level) + 1).padStart(2, "0");
  const completionPct = Math.round((userState.completedPlanets.length / 8) * 100);

  const rank = getUserRank(userState.xp);
  const walletStatus = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Ready";
  const walletTone = address ? "success" : "accent";

  const ongoing = getOngoingPlanetInfo(userState);

  return (
    <div className="glass-strong relative overflow-hidden rounded-2xl p-5 sm:p-5.5 shadow-2xl backdrop-blur-md border border-white/10">
      {/* subtle top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {level}
          </div>
          <div className="mt-0.5 font-display text-base font-semibold">{level} · Level {levelNum}</div>
        </div>
        <div className="relative">
          <div className="h-9.5 w-9.5 rounded-full bg-linear-to-br from-secondary to-primary p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-surface text-xs font-semibold">
              {level.charAt(0)}
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success shadow-[0_0_10px_currentColor]" />
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4.5">
        <div className="flex items-baseline justify-between text-[11.5px]">
          <span className="text-muted-foreground">Galaxy Progress</span>
          <span className="font-mono text-foreground font-semibold">{completionPct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-linear-to-r from-primary via-secondary to-accent"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[9px] uppercase tracking-widest text-muted-foreground/70 font-mono">
          <span>{userState.completedPlanets.length} planets complete</span>
          <span>{8 - userState.completedPlanets.length} remaining</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-4.5 grid grid-cols-2 gap-2.5">
        <MiniStat label="Wallet" value={walletStatus} tone={walletTone} />
        <MiniStat label="Streak" value={`${userState.streak} days`} tone="accent" />
        <MiniStat label="XP Points" value={`${userState.xp.toLocaleString()}`} tone="primary" />
        <MiniStat label="Rank" value={rank} tone="secondary" />
      </div>

      {/* Ongoing / Recommended mission */}
      <div className="mt-4.5 rounded-xl border border-white/8 bg-white/3 p-3.5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {ongoing.isOngoing ? "Ongoing Task" : "Recommended"}
          </div>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-accent">
            {ongoing.name}
          </span>
        </div>
        <div className="mt-1 font-display text-sm font-semibold">
          {ongoing.topic}
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
          {ongoing.tagline}
        </div>
        <Link to={ongoing.route} className="mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white/8 py-2 text-xs font-semibold text-foreground transition hover:bg-white/12 cursor-pointer">
          {ongoing.isOngoing ? "Resume ongoing task" : "Begin mission"}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "accent" | "primary" | "secondary";
}) {
  const dot =
    tone === "success"
      ? "bg-success"
      : tone === "accent"
      ? "bg-accent"
      : tone === "primary"
      ? "bg-primary"
      : "bg-secondary";
  return (
    <div className="rounded-xl border border-white/6 bg-white/2 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        <span className={`h-1 w-1 rounded-full ${dot} shadow-[0_0_6px_currentColor]`} />
        {label}
      </div>
      <div className="mt-1 font-display text-sm font-semibold">{value}</div>
    </div>
  );
}
