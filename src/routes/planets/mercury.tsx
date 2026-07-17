import { useState, useEffect, useRef, Suspense } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  RotateCcw,
  Play,
  Compass,
  Star,
  Rocket,
  Info,
  Bot,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Zap,
} from "lucide-react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";

import mercuryTex from "@/assets/planets/mercury.jpg";
import RocketAssembly from "@/components/module/RocketAssembly";
import MercuryChapterOne from "@/components/module/MercuryChapterOne";
import Task1_1_MiddlemanMapper from "@/components/module/Task1_1_MiddlemanMapper";
import Task1_2_CorruptedServer from "@/components/module/Task1_2_CorruptedServer";
import Task1_3_TradeDilemma from "@/components/module/Task1_3_TradeDilemma";
import Task1_4_ComparisonEngine from "@/components/module/Task1_4_ComparisonEngine";
import Task1_5_CardSorter from "@/components/module/Task1_5_CardSorter";
import GenericSandboxRunner from "@/components/module/GenericSandboxRunner";
import FinalEscapeRoom from "@/components/module/FinalEscapeRoom";
import { MERCURY_CURRICULUM } from "@/lib/mercury-curriculum";
import {
  Module1Task,
  MODULE1_TASKS,
  getMercuryCurrentTask,
  setMercuryCurrentTask,
  resetMercuryProgress,
  getVerifiedModules,
} from "@/lib/module1-store";
import ModuleVerificationScreen from "@/components/module/ModuleVerificationScreen";
import ModuleIntroCard from "@/components/module/ModuleIntroCard";
import PlanetTransition from "@/components/module/PlanetTransition";

export const Route = createFileRoute("/planets/mercury")({
  component: MercuryModule,
});

interface ModuleDetail {
  id: number;
  title: string;
  topic: string;
  stageName: string;
  iconName: "horizon" | "sunrise" | "solar-rise" | "scorch" | "peak" | "descent" | "twilight" | "night";
  tasks: string[];
  description: string;
  color: string; // Unique elegant color code
  angle: number; // Angle in degrees around the circle
}

const MERCURY_EXPEDITION_MODULES: ModuleDetail[] = [
  {
    id: 1,
    title: "MODULE 01",
    topic: "Why Does Blockchain Exist?",
    stageName: "Dark Horizon",
    iconName: "horizon",
    angle: -90, // 12 o'clock
    color: "#00E5FF", // Cyan
    description: "Audit centralized command routing database to isolate systemic vulnerabilities and discover why decentralization is required.",
    tasks: [
      "Task 1.1: Centralized Systems",
      "Task 1.2: Single Point of Failure",
      "Task 1.3: The Trust Problem",
    ],
  },
  {
    id: 2,
    title: "MODULE 02",
    topic: "Transactions & Digital Ledgers",
    stageName: "First Light",
    iconName: "sunrise",
    angle: -45,
    color: "#3B82F6", // Electric Blue
    description: "Examine transaction payloads, audit append-only digital ledgers, trace the transaction lifecycle, and act as a mempool validator.",
    tasks: [
      "Task 2.1: What is a Transaction?",
      "Task 2.2: The Digital Ledger & Bookkeeping",
      "Task 2.3: Transaction Lifecycle",
      "Task 2.4: Mempool Gatekeeper",
      "Task 2.5: Ledger Recovery",
    ],
  },
  {
    id: 3,
    title: "MODULE 03",
    topic: "Blocks & Blockchain Structure",
    stageName: "Solar Rise",
    iconName: "solar-rise",
    angle: 0, // 3 o'clock
    color: "#8B5CF6", // Violet
    description: "Learn block header metadata structures, audit genesis configurations, calculate TPS throughput, and reconstruct chronological blockchains.",
    tasks: [
      "Task 3.1: What is a Block? (Header and Body)",
      "Task 3.2: The Genesis Block",
      "Task 3.3: Capacity vs. Speed",
      "Task 3.4: Rebuild the Chain",
      "Task 3.5: Repair the Space Log",
    ],
  },
  {
    id: 4,
    title: "MODULE 04",
    topic: "Hashing & Data Integrity",
    stageName: "Scorch Zone",
    iconName: "scorch",
    angle: 45,
    color: "#EC4899", // Magenta
    description: "Learn cryptographic hash parameters, investigate the avalanche effect, compare hashing to encryption, and run checksum integrity audits.",
    tasks: [
      "Task 4.1: What is Hashing?",
      "Task 4.2: The Avalanche Effect",
      "Task 4.3: Hashing vs. Encryption",
      "Task 4.4: Detect a Tampered Signal",
      "Task 4.5: SHA-256 Calibration",
    ],
  },
  {
    id: 5,
    title: "MODULE 05",
    topic: "How Blocks Are Connected",
    stageName: "Solar Peak",
    iconName: "peak",
    angle: 90, // 6 o'clock
    color: "#F59E0B", // Amber
    description: "Audit parent hash back-links, trigger chain reaction domino effects, hash block headers, and repair broken transaction ledger links.",
    tasks: [
      "Task 5.1: Cryptographic Links",
      "Task 5.2: The Domino Effect",
      "Task 5.3: Hashing a Block Header",
      "Task 5.4: Chain Integrity",
      "Task 5.5: Repair the Ledger",
    ],
  },
  {
    id: 6,
    title: "MODULE 06",
    topic: "Decentralization & Distributed Networks",
    stageName: "Solar Descent",
    iconName: "descent",
    angle: 135,
    color: "#10B981", // Emerald
    description: "Map network topologies, audit node configuration Sync parameters, simulate Gossip transmission routing, and calculate Byzantine Fault tolerance.",
    tasks: [
      "Task 6.1: Topologies",
      "Task 6.2: Node Config",
      "Task 6.3: Gossip Protocols",
      "Task 6.4: Fault Tolerance",
      "Task 6.5: Network Recovery",
    ],
  },
  {
    id: 7,
    title: "MODULE 07",
    topic: "Consensus & Transaction Validation",
    stageName: "Twilight Zone",
    iconName: "twilight",
    angle: 180, // 9 o'clock
    color: "#F97316", // Orange
    description: "Solve Byzantine Generals puzzles, compare PoW vs. PoS consensus systems, identify federated quorum cores, and order double-spending transactions.",
    tasks: [
      "Task 7.1: Consensus Problem",
      "Task 7.2: PoW vs. PoS",
      "Task 7.3: Federated Consensus",
      "Task 7.4: Double-Spend Resolution",
      "Task 7.5: Council Decision",
    ],
  },
  {
    id: 8,
    title: "MODULE 08",
    topic: "Immutability, Transparency & Blockchain Use Cases",
    stageName: "Eternal Night",
    iconName: "night",
    angle: -135,
    color: "#6366F1", // Indigo
    description: "Verify shipping logs using traceability, calculate throughput costs comparing DB to BC, match industry use cases, and sort database architecture models.",
    tasks: [
      "Task 8.1: Immutability & Traceability",
      "Task 8.2: Hashing Drawbacks",
      "Task 8.3: Real-World Use Cases",
      "Task 8.4: Database Decision Matrix",
      "Task 8.5: Technology Selection",
    ],
  },
];

const getLabelStyles = (angle: number, isSelected: boolean) => {
  if (angle === -90) {
    return {
      className: "absolute bottom-full left-1/2 flex flex-col items-center text-center pb-2 w-44",
      animate: { y: isSelected ? -40 : 0, x: "-50%" }
    };
  }
  if (angle === 90) {
    return {
      className: "absolute top-full left-1/2 flex flex-col items-center text-center pt-2 w-44",
      animate: { y: isSelected ? 40 : 0, x: "-50%" }
    };
  }
  if (angle === -45 || angle === 0 || angle === 45) {
    return {
      className: "absolute left-full top-1/2 flex flex-col items-start text-left pl-3.5 w-44",
      animate: { x: isSelected ? 40 : 0, y: "-50%" }
    };
  }
  return {
    className: "absolute right-full top-1/2 flex flex-col items-end text-right pr-3.5 w-44",
    animate: { x: isSelected ? -40 : 0, y: "-50%" }
  };
};

const getArrowAlignment = (angle: number) => {
  if (angle === -90 || angle === 90) return "justify-center";
  if (angle === -45 || angle === 0 || angle === 45) return "justify-start pl-1.5";
  return "justify-end pr-1.5";
};

function RotatingMercury() {
  const tex = useLoader(TextureLoader, mercuryTex);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 0.12;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial
        map={tex}
        roughness={0.9}
        metalness={0.15}
      />
    </mesh>
  );
}

function SmallMercury() {
  const tex = useLoader(TextureLoader, mercuryTex);
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (meshRef.current) meshRef.current.rotation.y += dt * 0.18;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshStandardMaterial map={tex} roughness={0.85} metalness={0.15} />
    </mesh>
  );
}

function getUrlForTask(task: Module1Task): string {
  if (task === "story" || task === "task1_1") return "cosmosx://mercury/ch1/task-1.1-map-the-middlemen";
  if (task === "task1_2") return "cosmosx://mercury/ch1/task-1.2-corrupted-command";
  if (task === "task1_3") return "cosmosx://mercury/ch1/task-1.3-trade-dilemma";
  const match = task.match(/^task(\d+)_(\d+)$/);
  if (match) return `cosmosx://mercury/ch${match[1]}/task-${match[1]}.${match[2]}`;
  const vm = task.match(/^task(\d+)_verify$/);
  if (vm) return `cosmosx://mercury/ch${vm[1]}/module-${vm[1]}-verification`;
  if (task === "final_challenge") return "cosmosx://mercury/final/escape-room";
  if (task === "completed") return "cosmosx://mercury/complete/graduation";
  return "cosmosx://mercury/sandbox";
}

function getNovaHint(task: Module1Task): string {
  if (task === "task1_1") return "Map all the middlemen in the UPI transaction flow. Look for every hop between sender and receiver.";
  if (task === "task1_2") return "A server is corrupted. Identify which records were tampered with and why it matters.";
  if (task === "task1_3") return "Two traders need to swap goods without trusting each other. Find the trustless mechanism.";
  if (task.endsWith("_verify")) return "Review your task scores. You need to pass all 3 tasks to unlock the next module.";
  if (task === "final_challenge") return "All 8 modules complete. Execute the final timed escape room to graduate from Mercury.";
  if (task === "completed") return "Mercury mastered! You've earned the First Block badge. Launch to Venus next.";
  return "Complete each task in sequence. Read the theory panel first, then attempt the challenge.";
}
function renderModuleIcon(type: string, isUnlocked: boolean, color: string, className = "w-5 h-5") {
  const strokeColor = isUnlocked ? color : "#475569";
  switch (type) {
    case "horizon":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
          <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10A10 10 0 0 0 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.88.66-3.6 1.76-4.97A7.95 7.95 0 0 1 12 16a7.95 7.95 0 0 1 6.24-10.97C19.34 6.4 20 8.12 20 10c0 4.41-3.59 8-8 8z" />
        </svg>
      );
    case "sunrise":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
          <path d="M2 18h20M12 4v4M6.34 6.34l2.83 2.83M17.66 6.34l-2.83 2.83" />
          <path d="M18 18a6 6 0 0 0-12 0" />
        </svg>
      );
    case "solar-rise":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" />
        </svg>
      );
    case "scorch":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case "peak":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
          <circle cx="12" cy="12" r="6" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
        </svg>
      );
    case "descent":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
          <path d="M2 16h20M12 22v-4M6.34 19.66l2.83-2.83M17.66 19.66l-2.83-2.83" />
          <path d="M6 16a6 6 0 0 1 12 0" />
        </svg>
      );
    case "twilight":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8" />
        </svg>
      );
    case "night":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v1M12 20v1M3 12h1M20 12h1M19 19l-1-1M5 5L4 4" />
        </svg>
      );
    default:
      return <Star className="w-4 h-4 text-slate-500" />;
  }
}

const MODULES = MERCURY_EXPEDITION_MODULES.map(m => ({
  id: m.id,
  num: String(m.id).padStart(2, "0"),
  title: m.topic,
  stageName: m.stageName,
  iconName: m.iconName,
  color: m.color,
  verifyId: `task${m.id}_verify` as Module1Task,
  tasks: m.id === 1 ? [
    { id: "task1_1" as Module1Task, label: "Map the Middlemen" },
    { id: "task1_2" as Module1Task, label: "Corrupted Command" },
    { id: "task1_3" as Module1Task, label: "Trade Dilemma" },
  ] : (MERCURY_CURRICULUM.find(c => c.id === m.id)?.tasks || []).map(t => ({
    id: t.id as Module1Task,
    label: t.title.split(" — ")[1] || t.title.split(" – ")[1] || t.title,
  })),
}));

function MercuryWorkspace({
  task,
  onTaskChange,
  onBack,
  completedModuleIds,
  currentActiveModuleId,
  activeTaskInfo,
  handleLaunchRocket,
  showIntro,
  introModuleId,
  currentModuleDef,
  setAcknowledgedIntros,
}: {
  task: Module1Task;
  onTaskChange: (t: Module1Task) => void;
  onBack: () => void;
  completedModuleIds: number[];
  currentActiveModuleId: number;
  activeTaskInfo: { taskDef: any; color: string } | null;
  handleLaunchRocket: () => void;
  showIntro: boolean;
  introModuleId: number | null;
  currentModuleDef: any;
  setAcknowledgedIntros: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const sidebarExpanded = !sidebarCollapsed || sidebarHovered;

  const [expandedModule, setExpandedModule] = useState<number>(() => {
    const match = task.match(/^task(\d+)_/);
    return match ? parseInt(match[1]) : 1;
  });
  const [urlAnimating, setUrlAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentUrl = getUrlForTask(task);

  // Auto-expand the module the task belongs to
  useEffect(() => {
    const match = task.match(/^task(\d+)_/);
    if (match) setExpandedModule(parseInt(match[1]));
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setUrlAnimating(true);
    const t = setTimeout(() => setUrlAnimating(false), 700);
    return () => clearTimeout(t);
  }, [task]);

  const isTaskDone = (taskId: Module1Task) => {
    const current = MODULE1_TASKS.indexOf(task);
    const target = MODULE1_TASKS.indexOf(taskId);
    return current > target;
  };
  const isModuleDone = (id: number) => completedModuleIds.includes(id);
  const isModuleUnlocked = (id: number) => id <= currentActiveModuleId;

  const activeModDef = MODULES.find((m) => {
    const match = task.match(/^task(\d+)_/);
    return match ? m.id === parseInt(match[1]) : m.id === 1;
  });
  const accentColor = activeModDef?.color ?? "#22d3ee";

  return (
    <div className="h-screen bg-[#030711] text-white flex flex-col overflow-hidden w-full relative z-10">
      {/* Starfield */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0.7px,transparent_0.7px)] bg-size-[28px_28px] opacity-[0.06]" />
      </div>

      {/* ── WORKSPACE HEADER ── */}
      <header className="relative z-20 shrink-0 flex items-center gap-4 px-5 py-3 bg-[#08101f]/90 border-b border-white/8 backdrop-blur-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition font-mono text-[10px] group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          MERCURY
        </button>

        <div className="w-px h-4 bg-white/10" />

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
            {task.match(/^task(\d+)_(\d+)$/) ? `Module ${task.match(/^task(\d+)_(\d+)$/)![1].padStart(2,"0")} · Task ${task.match(/^task(\d+)_(\d+)$/)![2]}` :
             task.match(/^task(\d+)_verify$/) ? `Module ${task.match(/^task(\d+)_verify$/)![1].padStart(2,"0")} · Verification` :
             task === "final_challenge" ? "Final Mission · Escape Room" :
             task === "completed" ? "Mercury Complete" : "Sandbox"}
          </span>
        </div>

        {/* Module progress ticks */}
        <div className="ml-auto hidden md:flex items-center gap-1">
          {MODULES.map((mod) => {
            const done = isModuleDone(mod.id);
            const active = mod.id === currentActiveModuleId;
            return (
              <div key={mod.id} className="w-4 h-1.5 rounded-sm border transition-all duration-500"
                style={{
                  backgroundColor: done ? "#10b981" : active ? `${mod.color}30` : "transparent",
                  borderColor: done ? "#10b981" : active ? mod.color : "rgba(255,255,255,0.1)",
                  boxShadow: done ? "0 0 5px rgba(16,185,129,0.6)" : active ? `0 0 4px ${mod.color}70` : "none",
                }}
                title={`Module ${mod.num}`}
              />
            );
          })}
        </div>

        <button onClick={() => { resetMercuryProgress(); onBack(); }}
          className="flex items-center gap-1.5 text-[9px] font-mono text-rose-400 hover:text-rose-300 bg-rose-500/8 hover:bg-rose-500/15 px-2.5 py-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500/40 transition shrink-0">
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:block">RESET</span>
        </button>
      </header>

      {/* ── BODY: SIDEBAR + BROWSER ── */}
      <div className="flex flex-1 min-h-0 relative z-10 w-full">

        {/* ── LEFT MODULE SIDEBAR ── */}
        <aside
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
          className={`shrink-0 border-r border-white/8 bg-[#060d1a]/80 backdrop-blur-md flex flex-col overflow-hidden transition-all duration-300 ease-in-out relative z-30 ${
            sidebarExpanded ? "w-60" : "w-16"
          }`}
        >
          {/* Planet mini header */}
          <div className={`pt-3 pb-3 border-b border-white/8 shrink-0 transition-all duration-300 ${sidebarExpanded ? "px-3" : "px-0 flex flex-col items-center"}`}>
            <div className="flex items-center gap-2.5 w-full justify-center px-1">
              <div className="w-8 h-8 rounded-xl overflow-hidden border shrink-0" style={{ borderColor: `${accentColor}30`, boxShadow: `0 0 12px ${accentColor}25` }}>
                <Canvas camera={{ position: [0, 0, 4] }}>
                  <ambientLight intensity={0.3} />
                  <pointLight position={[8, 8, 8]} intensity={3} />
                  <Suspense fallback={null}><SmallMercury /></Suspense>
                </Canvas>
              </div>
              {sidebarExpanded && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">Planet 01</p>
                    <h2 className="font-rushblade text-xs text-white">MERCURY</h2>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSidebarCollapsed(!sidebarCollapsed);
                    }}
                    className="ml-auto w-5 h-5 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition shrink-0"
                    title={sidebarCollapsed ? "Pin Sidebar" : "Collapse Sidebar"}
                  >
                    {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                  </button>
                </>
              )}
            </div>
            {sidebarExpanded && (
              <div className="mt-2 w-full px-1">
                <div className="flex justify-between text-[8px] font-mono text-slate-600 mb-1">
                  <span>{completedModuleIds.length}/8 done</span>
                  <span>{Math.round((completedModuleIds.length / 8) * 100)}%</span>
                </div>
                <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.round((completedModuleIds.length / 8) * 100)}%`, background: `linear-gradient(90deg, ${accentColor}70, ${accentColor})` }} />
                </div>
              </div>
            )}
          </div>

          {/* Module + task list */}
          <nav className="flex-1 overflow-y-auto scrollbar-none py-2 space-y-1.5 px-2">
            {MODULES.map((mod) => {
              const done = isModuleDone(mod.id);
              const unlocked = isModuleUnlocked(mod.id);
              const isExpanded = expandedModule === mod.id;
              const currentTaskInMod = task.startsWith(`task${mod.id}_`);

              return (
                <div key={mod.id} className="flex flex-col items-center w-full">
                  <button
                    onClick={() => {
                      if (!unlocked) return;
                      setExpandedModule(isExpanded ? 0 : mod.id);
                      setSidebarCollapsed(false); // Lock it open when they click
                    }}
                    disabled={!unlocked}
                    className={`w-full flex items-center rounded-xl text-left transition-all ${
                      sidebarExpanded ? "gap-2 px-2.5 py-2" : "justify-center p-2"
                    } ${
                      currentTaskInMod ? "bg-white/8 border border-white/10" :
                      unlocked ? "hover:bg-white/5" : "opacity-35 cursor-not-allowed"
                    }`}
                  >
                    {sidebarExpanded ? (
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[9px] font-mono font-bold border transition-all"
                        style={{
                          borderColor: done ? "rgba(52,211,153,0.4)" : currentTaskInMod ? `${mod.color}50` : unlocked ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                          color: done ? "#34d399" : currentTaskInMod ? mod.color : unlocked ? "#94a3b8" : "#374151",
                          backgroundColor: done ? "rgba(52,211,153,0.1)" : currentTaskInMod ? `${mod.color}15` : "transparent",
                        }}
                      >
                        {done ? "✓" : !unlocked ? <Lock className="w-2.5 h-2.5" /> : mod.num}
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        {renderModuleIcon(mod.iconName, unlocked, done ? "#34d399" : mod.color, "w-4.5 h-4.5")}
                      </div>
                    )}
                    {sidebarExpanded && (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] font-mono uppercase tracking-wider truncate" style={{ color: unlocked ? mod.color : "#374151" }}>
                            MODULE {mod.num}
                          </p>
                          <p className={`text-[10px] truncate mt-0.5 ${currentTaskInMod ? "text-white font-medium" : unlocked ? "text-slate-400" : "text-slate-700"}`}>
                            {mod.title}
                          </p>
                        </div>
                        <ChevronRight className={`w-3 h-3 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""} ${unlocked ? "text-slate-500" : "text-slate-800"}`} />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {sidebarExpanded && isExpanded && unlocked && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden w-full">
                        <div className="pl-9 pr-2 pb-1 pt-0.5 space-y-0.5">
                          {mod.tasks.map((t) => {
                            const tDone = isTaskDone(t.id);
                            const tActive = task === t.id;
                            return (
                              <button key={t.id} onClick={() => { onTaskChange(t.id); setSidebarCollapsed(false); }}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-all hover:bg-white/5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: tDone ? "#34d399" : tActive ? mod.color : "rgba(255,255,255,0.15)" }} />
                                <span className="font-mono text-[10px] truncate"
                                  style={{ color: tActive ? mod.color : tDone ? "#34d399" : "#64748b", fontWeight: tActive ? "700" : "400" }}>
                                  {t.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Final challenge */}
            <button
              disabled={completedModuleIds.length < 8}
              onClick={() => { onTaskChange("final_challenge"); setSidebarCollapsed(false); }}
              className={`w-full flex items-center rounded-xl text-left border transition-all ${
                sidebarExpanded ? "gap-2 px-2.5 py-2 mt-1" : "justify-center p-2 mt-2"
              } ${
                completedModuleIds.length >= 8 ? "border-rose-400/20 bg-rose-500/8 hover:bg-rose-500/12" : "border-transparent opacity-25 cursor-not-allowed"
              }`}
            >
              <div className="w-6 h-6 rounded-lg border border-rose-400/30 bg-rose-500/15 flex items-center justify-center text-rose-400 shrink-0">
                <Rocket className="w-3 h-3" />
              </div>
              {sidebarExpanded && (
                <div className="min-w-0">
                  <p className="text-[8px] font-mono text-rose-400 uppercase tracking-wider">FINAL MISSION</p>
                  <p className="text-[10px] text-slate-400 truncate">Escape Room</p>
                </div>
              )}
            </button>
          </nav>

          {/* NOVA */}
          <div className={`mx-2 mb-2 rounded-xl border border-violet-400/20 bg-violet-400/5 shrink-0 transition-all duration-300 ${sidebarExpanded ? "p-2.5" : "p-2.5 flex justify-center"}`}>
            <div className="flex items-center gap-1.5 w-full justify-center">
              <Bot className="w-4 h-4 text-violet-300 shrink-0" />
              {sidebarExpanded && (
                <>
                  <span className="text-[8px] font-mono text-violet-300 uppercase tracking-wider min-w-0 truncate">NOVA · AI Guide</span>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </>
              )}
            </div>
            {sidebarExpanded && (
              <p className="text-[9px] text-slate-400 leading-relaxed mt-1">{getNovaHint(task)}</p>
            )}
          </div>
        </aside>

        {/* ── VIRTUAL BROWSER (content only) ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#040916] h-full overflow-hidden relative">

          {/* Browser chrome */}
          <div className="shrink-0 bg-[#08101f]/95 border-b border-white/8 backdrop-blur-md relative z-20">
            {/* Tab strip */}
            <div className="flex items-end gap-0 px-3 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-t-xl border border-b-0 text-[10px] font-mono bg-[#0d1628]/90 min-w-0 max-w-xs"
                style={{ borderColor: `${accentColor}25` }}>
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}80` }} />
                <span className="truncate text-white/80">{activeModDef?.title ?? "Mercury Sandbox"}</span>
              </div>
            </div>

            {/* URL row */}
            <div className="flex items-center gap-2.5 px-3 pb-2 pt-1">
              {/* Traffic lights */}
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              </div>

              {/* Nav buttons */}
              <div className="flex gap-0.5 shrink-0">
                <button className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-400 hover:bg-white/5 transition">
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button className="w-6 h-6 rounded-md flex items-center justify-center text-slate-700 cursor-not-allowed">
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-400 hover:bg-white/5 transition">
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>

              {/* URL bar */}
              <div className="flex-1 flex items-center gap-2 bg-[#0a0f1e]/90 border rounded-lg px-3 py-1 min-w-0 transition-all duration-500"
                style={{ borderColor: urlAnimating ? `${accentColor}50` : "rgba(255,255,255,0.1)", boxShadow: urlAnimating ? `0 0 12px ${accentColor}18` : "none" }}>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 5px rgba(52,211,153,0.7)" }} />
                  <span className="text-[8px] font-mono text-emerald-400/70 uppercase tracking-wider hidden sm:block">SECURE</span>
                </div>
                <div className="w-px h-2.5 bg-white/10 shrink-0" />
                <motion.span key={currentUrl} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-[10px] truncate flex-1" style={{ color: accentColor }}>
                  {currentUrl}
                </motion.span>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 bg-slate-900/50 border border-white/8 px-2 py-1 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-[8px]" style={{ color: accentColor }}>SANDBOX</span>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto min-h-0 relative z-10 p-4">
            <AnimatePresence mode="wait">
              {task === "story" && (
                <motion.div key="story" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full">
                  <MercuryChapterOne onComplete={() => onTaskChange("task1_1")} />
                </motion.div>
              )}
              {task === "task1_1" && (
                <motion.div key="t1_1" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full">
                  <Task1_1_MiddlemanMapper onComplete={() => onTaskChange("task1_2")} />
                </motion.div>
              )}
              {task === "task1_2" && (
                <motion.div key="t1_2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full">
                  <Task1_2_CorruptedServer onComplete={() => onTaskChange("task1_3")} />
                </motion.div>
              )}
              {task === "task1_3" && (
                <motion.div key="t1_3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full">
                  <Task1_3_TradeDilemma onComplete={() => onTaskChange("task1_verify")} />
                </motion.div>
              )}

              {/* Module Intro Card */}
              {showIntro && currentModuleDef && (
                <motion.div key={`intro-${introModuleId}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col justify-between">
                  <ModuleIntroCard
                    moduleId={introModuleId!}
                    moduleTitle={currentModuleDef.title}
                    moduleTheory={currentModuleDef.moduleTheory}
                    rocketComponent={currentModuleDef.rocketComponent}
                    tasks={currentModuleDef.tasks}
                    moduleColor={currentModuleDef.color}
                    onStart={() => {
                      setAcknowledgedIntros(prev => ({ ...prev, [introModuleId!]: true }));
                    }}
                  />
                </motion.div>
              )}

              {!showIntro && activeTaskInfo && !task.endsWith("_verify") && !["task1_1","task1_2","task1_3","final_challenge","completed"].includes(task) && (
                <motion.div key={task} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                  <GenericSandboxRunner taskDef={activeTaskInfo.taskDef} moduleColor={activeTaskInfo.color}
                    onComplete={() => {
                      const idx = MODULE1_TASKS.indexOf(task);
                      onTaskChange(MODULE1_TASKS[idx + 1] || "completed");
                    }}
                  />
                </motion.div>
              )}

              {([1,2,3,4,5,6,7,8] as const).map((modId) => {
                const vk = `task${modId}_verify` as Module1Task;
                const next = modId < 8 ? `task${modId + 1}_1` as Module1Task : "final_challenge";
                const MODULE_TITLES: Record<number, string> = {
                  1: "Why Does Blockchain Exist?",
                  2: "Transactions & Digital Ledgers",
                  3: "Blocks & Data Structures",
                  4: "Mining & Proof of Work",
                  5: "Nodes & Peer-to-Peer Networks",
                  6: "Consensus Mechanisms",
                  7: "Smart Contracts",
                  8: "DeFi & Real-World Applications",
                };
                return task === vk ? (
                  <motion.div key={vk} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                    <ModuleVerificationScreen moduleId={modId} moduleTitle={MODULE_TITLES[modId]}
                      onVerified={() => onTaskChange(next)}
                      onRetry={() => onTaskChange(`task${modId}_1` as Module1Task)}
                    />
                  </motion.div>
                ) : null;
              })}

              {task === "final_challenge" && (
                <motion.div key="final" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                  <FinalEscapeRoom onComplete={handleLaunchRocket} />
                </motion.div>
              )}

              {task === "completed" && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center p-8 text-center gap-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                    className="w-24 h-24 rounded-full flex items-center justify-center border-2"
                    style={{ backgroundColor: "rgba(251,191,36,0.12)", borderColor: "rgba(251,191,36,0.4)", boxShadow: "0 0 50px rgba(251,191,36,0.25)" }}>
                    <Trophy className="w-10 h-10 text-amber-400" />
                  </motion.div>
                  <div>
                    <h1 className="font-rushblade text-3xl text-white">MERCURY COMPLETE</h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-sm">All 8 modules mastered. First Block badge unlocked.</p>
                  </div>
                  <div className="flex gap-3">
                    {[{ l: "XP Earned", v: "+800", c: "#22d3ee" }, { l: "Badge", v: "🏆 First Block", c: "#f59e0b" }, { l: "Next", v: "Venus ➔", c: "#8b5cf6" }].map((s) => (
                      <div key={s.l} className="rounded-2xl border px-5 py-3 text-center" style={{ borderColor: `${s.c}25`, backgroundColor: `${s.c}08` }}>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500 mb-1">{s.l}</p>
                        <p className="font-rushblade text-lg" style={{ color: s.c }}>{s.v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleLaunchRocket}
                      className="px-7 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:scale-[1.02]">
                      Back to Solar System
                    </button>
                    <Link to="/planets/$planet" params={{ planet: "venus" }} className="px-6 py-3 bg-violet-500/20 border border-violet-400/30 text-violet-300 hover:bg-violet-500/30 font-semibold text-sm rounded-xl transition-all">
                      Enter Venus ➔
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MercuryModule() {
  const router = useRouter();
  const [task, setTask] = useState<Module1Task>("story");
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [acknowledgedIntros, setAcknowledgedIntros] = useState<Record<number, boolean>>({});

  const match = task.match(/^task(\d)_1$/);
  const introModuleId = match ? parseInt(match[1]) : null;
  const showIntro = introModuleId !== null && introModuleId >= 2 && introModuleId <= 8 && !acknowledgedIntros[introModuleId];
  const currentModuleDef = showIntro ? MERCURY_CURRICULUM.find(m => m.id === introModuleId) : null;

  const activeTaskInfo = (() => {
    for (const mod of MERCURY_CURRICULUM) {
      const found = mod.tasks.find((t) => t.id === task);
      if (found) {
        return { taskDef: found, color: mod.color };
      }
    }
    return null;
  })();
  const [isLaunching, setIsLaunching] = useState(false);
  const [wavePhase, setWavePhase] = useState<"idle" | "charge" | "expand" | "impact">("idle");
  const [baseRadius, setBaseRadius] = useState(210);

  // Resize listener to scale orbit diameter dynamically for laptop viewports
  useEffect(() => {
    const handleResize = () => {
      const h = window.innerHeight;
      const calculatedRadius = Math.max(140, Math.min(185, (h - 220) * 0.32));
      setBaseRadius(calculatedRadius);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync state on mount
  useEffect(() => {
    try {
      if (import.meta.env.DEV) {
        // Auto-unlock/complete all modules in development mode
        const current = localStorage.getItem("cosmos-x-mercury-step");
        if (current !== "final_challenge") {
          localStorage.setItem("cosmos-x-mercury-step", "final_challenge");
          localStorage.setItem("cosmos-x-verified-modules", JSON.stringify([1,2,3,4,5,6,7,8]));
          const scores: Record<string, { score: number; maxScore: number; passed: boolean }> = {
            "task1_1": { score: 15, maxScore: 15, passed: true },
            "task1_2": { score: 10, maxScore: 10, passed: true },
            "task1_3": { score: 10, maxScore: 10, passed: true }
          };
          for (let m = 2; m <= 8; m++) {
            for (let t = 1; t <= 5; t++) {
              scores[`task${m}_${t}`] = { score: 10, maxScore: 10, passed: true };
            }
          }
          localStorage.setItem("cosmos-x-task-scores", JSON.stringify(scores));
        }
      }
      const currentTask = getMercuryCurrentTask();
      setTask(currentTask);
      // Keep all module task satellites collapsed initially so user sees the planet and modules clean
      setSelectedModuleId(null);
    } catch (err) {
      console.error("Failed to load local storage progress", err);
    }
  }, []);

  // Periodic Circular Magnetic Energy-Wave timeline sequence loop (repeats every 6.5s)
  useEffect(() => {
    if (activeModule !== null) return;
    
    const triggerWave = () => {
      setWavePhase("charge");
      
      const expandTimeout = setTimeout(() => {
        setWavePhase("expand");
      }, 1200);

      const impactTimeout = setTimeout(() => {
        setWavePhase("impact");
      }, 2400); // 1.2s charge + 1.2s expand animation duration

      const recoilTimeout = setTimeout(() => {
        setWavePhase("idle");
      }, 2600); // snap back after 200ms impact push

      return { expandTimeout, impactTimeout, recoilTimeout };
    };

    // Run initially
    const timeouts = triggerWave();

    const interval = setInterval(() => {
      timeouts.expandTimeout = setTimeout(() => setWavePhase("expand"), 1200);
      timeouts.impactTimeout = setTimeout(() => setWavePhase("impact"), 2400);
      timeouts.recoilTimeout = setTimeout(() => setWavePhase("idle"), 2600);
      setWavePhase("charge");
    }, 6500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeouts.expandTimeout);
      clearTimeout(timeouts.impactTimeout);
      clearTimeout(timeouts.recoilTimeout);
    };
  }, [activeModule]);

  const handleNextTask = (next: Module1Task) => {
    try {
      setTask(next);
      setMercuryCurrentTask(next);
      if (next === "completed") {
        setActiveModule(null);
        setSelectedModuleId(null);
      } else if (next === "final_challenge") {
        setActiveModule(9);
        setSelectedModuleId(null);
      }
    } catch (err) {
      console.error("Failed to persist task state", err);
    }
  };

  const handleLaunchModule = (modId: number) => {
    try {
      setActiveModule(modId);
      
      // If we are launching the currently active module, keep their current task progress.
      // Otherwise (if they are replaying a completed module), start them at task 1 of that module.
      if (modId === currentActiveModuleId) {
        const currentTask = getMercuryCurrentTask();
        setTask(currentTask);
      } else {
        const taskKey = `task${modId}_1` as Module1Task;
        setTask(taskKey);
        setMercuryCurrentTask(taskKey);
      }
    } catch (err) {
      console.error("Failed to launch module", err);
    }
  };

  const handleReset = () => {
    try {
      resetMercuryProgress();
      setTask("story");
      setActiveModule(null);
      setSelectedModuleId(null);
      setAcknowledgedIntros({});
    } catch (err) {
      console.error("Failed to reset progress", err);
    }
  };

  const handleLaunchRocket = () => {
    setIsLaunching(true);
  };

  const getCompletedModuleIds = (currentTask: Module1Task): number[] => {
    const ids: number[] = [];
    const idx = MODULE1_TASKS.indexOf(currentTask);
    
    if (idx >= 5) ids.push(1);
    if (idx >= 9) ids.push(2);
    if (idx >= 13) ids.push(3);
    if (idx >= 17) ids.push(4);
    if (idx >= 21) ids.push(5);
    if (idx >= 25) ids.push(6);
    if (idx >= 29) ids.push(7);
    if (idx >= 33) ids.push(8);
    return ids;
  };

  const completedModuleIds = getVerifiedModules();
  const currentActiveModuleId =
    completedModuleIds.length < 8 ? completedModuleIds.length + 1 : 9; // 9 = final escape room

  const renderBubbleIcon = (type: string, isUnlocked: boolean, color: string) => {
    const strokeColor = isUnlocked ? color : "#475569";
    switch (type) {
      case "horizon":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
            <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10A10 10 0 0 0 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.88.66-3.6 1.76-4.97A7.95 7.95 0 0 1 12 16a7.95 7.95 0 0 1 6.24-10.97C19.34 6.4 20 8.12 20 10c0 4.41-3.59 8-8 8z" />
          </svg>
        );
      case "sunrise":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
            <path d="M2 18h20M12 4v4M6.34 6.34l2.83 2.83M17.66 6.34l-2.83 2.83" />
            <path d="M18 18a6 6 0 0 0-12 0" />
          </svg>
        );
      case "solar-rise":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" />
          </svg>
        );
      case "scorch":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        );
      case "peak":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
            <circle cx="12" cy="12" r="6" />
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
          </svg>
        );
      case "descent":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
            <path d="M2 16h20M12 22v-4M6.34 19.66l2.83-2.83M17.66 19.66l-2.83-2.83" />
            <path d="M6 16a6 6 0 0 1 12 0" />
          </svg>
        );
      case "twilight":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
            <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8" />
          </svg>
        );
      case "night":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v1M12 20v1M3 12h1M20 12h1M19 19l-1-1M5 5L4 4" />
          </svg>
        );
      default:
        return <Star className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <main className="h-screen bg-[#040816] text-white relative flex flex-col justify-between overflow-hidden">
      {/* Background Starfield */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0.8px,transparent_0.8px)] bg-size-[24px_24px] opacity-15" />
        <div className="absolute inset-0 bg-linear-to-tr from-cyan-950/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(4,8,22,0.65)_100%)]" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 flex justify-between items-center border-b border-white/10 bg-slate-950/60 p-4 md:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="group flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition bg-slate-900/60 hover:bg-slate-900/90 px-4 py-2 rounded-full border border-white/10 hover:border-cyan-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] relative overflow-hidden"
          >
            <ChevronLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-mono tracking-wider font-semibold text-[10px]">EVACUATE TO SOLAR ORBIT</span>
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Link>
          <div className="hidden sm:block h-4 w-px bg-white/15" />
          
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <h1 className="font-rushblade text-base tracking-tight text-white select-none hover:text-cyan-400 transition-colors duration-300">
                COSMOSX
              </h1>
            </div>
            <p className="text-[9px] text-cyan-400/80 font-mono tracking-wider mt-0.5 select-none hover:text-cyan-400 transition-all">
              cosmosx://planet-1/mercury/blockchain-foundations<span className="text-cyan-600/75">?lat=28.59n&amp;lon=80.68w&amp;freq=1420.4mhz</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex flex-col items-end text-right font-mono text-[9px] text-muted-foreground select-none">
            <div className="flex items-center gap-1.5 font-bold tracking-wider">
              <span className="text-cyan-400">MERCURY PROGRESS:</span>
              <span className="text-slate-200">{completedModuleIds.length} / 8 MODULES</span>
            </div>
            
            {/* Visual HUD progress bar ticks */}
            <div className="flex items-center gap-1 mt-1.5">
              {Array.from({ length: 8 }).map((_, idx) => {
                const isSegmentDone = idx < completedModuleIds.length;
                const isSegmentActive = idx === completedModuleIds.length;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-1.5 rounded-sm border transition-all duration-500 ${
                      isSegmentDone
                        ? "bg-emerald-500 border-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                        : isSegmentActive
                          ? "bg-cyan-500/30 border-cyan-400 animate-pulse shadow-[0_0_4px_rgba(6,182,212,0.3)]"
                          : "bg-slate-950 border-white/10"
                    }`}
                    title={`Module ${idx + 1}: ${isSegmentDone ? "Completed" : isSegmentActive ? "Active" : "Locked"}`}
                  />
                );
              })}
            </div>
          </div>
          
          <div className="hidden sm:block h-6 w-px bg-white/10" />

          <button
            onClick={handleReset}
            className="group flex items-center gap-1 text-[9px] font-mono text-rose-400 hover:text-rose-300 transition bg-rose-500/5 hover:bg-rose-500/10 px-3 py-2 rounded-md border border-rose-500/20 hover:border-rose-500/50 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(239,68,68,0.02)]"
          >
            <RotateCcw className="w-3 h-3 group-hover:rotate-[-60deg] transition-transform duration-300" />
            <span className="font-semibold tracking-wider">RESET SECTOR</span>
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-rose-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </button>
        </div>
      </header>
      {/* Main Grid Content */}
      <div className="flex-1 px-4 lg:px-8 py-3 w-full relative z-10 flex flex-col justify-center min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeModule === null ? (
            /* 1. COMPLETED CIRCULAR MAGNETIC ORBIT EXPEDITION MAP */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative flex-1 min-h-0 overflow-hidden"
            >
              {/* Module selection circular map (Col-span 9) */}


              <div className="lg:col-span-9 relative h-full flex items-center justify-center min-h-0">
                
                {/* 3D ROTATING MERCURY PLANET (Positioned exactly in the center of the left workspace area) */}
                <div
                  style={{ width: baseRadius * 1.5, height: baseRadius * 1.5 }}
                  className="absolute top-1/2 left-1/2 pointer-events-none z-0 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <Canvas camera={{ position: [0, 0, 5.8] }}>
                    <ambientLight intensity={0.25} />
                    <pointLight position={[10, 10, 10]} intensity={3.5} />
                    <Suspense fallback={null}>
                      <RotatingMercury />
                    </Suspense>
                  </Canvas>
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_60%,rgba(4,8,22,0.85)_98%)]" />
                  
                  {/* Concentric buildup glow shield around planet boundary */}
                  <div
                    className={`absolute inset-0 rounded-full border transition-all duration-1000 ${
                      wavePhase === "charge"
                        ? "border-cyan-400/40 shadow-[0_0_50px_rgba(34,211,238,0.55),inset_0_0_40px_rgba(34,211,238,0.35)] scale-[1.03]"
                        : "border-cyan-500/5 shadow-[inset_0_0_30px_rgba(6,182,212,0.1)] scale-100"
                    }`}
                  />
                </div>

                {/* Left Area Dashboard text headers */}
                <div className="absolute top-0 left-0 z-10 select-none">
                  <h2 className="font-rushblade text-sm lg:text-base text-white tracking-wider">ORBITAL SECTOR DEPLOYMENT</h2>
                  <p className="text-[9px] lg:text-[10px] font-mono text-muted-foreground uppercase mt-0.5">Explore curriculum paths orbiting Mercury</p>
                </div>
                
                <div className="absolute top-0 right-0 z-30 select-none flex flex-col items-end">
                  {completedModuleIds.length < 8 ? (
                    <div className="group relative">
                      <button
                        disabled
                        className="text-slate-500 bg-slate-900/50 border border-slate-700/40 px-4 py-2.5 rounded-xl text-[10.5px] font-mono font-bold tracking-widest uppercase cursor-not-allowed flex items-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        RESCUE MISSION
                      </button>
                      <div className="absolute top-full right-0 mt-2 whitespace-nowrap bg-slate-950 border border-white/10 text-slate-300 text-[9px] font-mono px-3 py-1.5 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        Locked — complete all 8 modules to unlock
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => {
                        setActiveModule(9);
                        handleNextTask("final_challenge");
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(127,0,0,0.5)",
                          "0 0 25px rgba(185,28,28,0.85)",
                          "0 0 10px rgba(127,0,0,0.5)"
                        ],
                        scale: [1, 1.04, 1]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="bg-linear-to-r from-red-700 to-rose-600 text-white border border-red-500 px-4 py-2.5 rounded-xl text-[10.5px] font-mono font-bold tracking-widest uppercase cursor-pointer pointer-events-auto flex items-center gap-2 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] bg-size-[15px_15px] animate-pulse" />
                      <Rocket className="w-3.5 h-3.5 relative z-10 animate-bounce" />
                      <span className="relative z-10">ENTER RESCUE MISSION ➔</span>
                    </motion.button>
                  )}
                </div>

                {/* Glassy bubbles rendered dynamically in circular orbit */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {MERCURY_EXPEDITION_MODULES.map((mod) => {
                    const isCompleted = completedModuleIds.includes(mod.id);
                    const isActive = mod.id === currentActiveModuleId;
                    const isUnlocked = mod.id === 1 || isCompleted || isActive;
                    const isSelected = selectedModuleId === mod.id;

                    // Trig: module position on orbit ring
                    const rad = (mod.angle * Math.PI) / 180;

                    // Wave impulse: modules remain in fixed orbital positions (wave animation runs in background)
                    const animatedRadius = baseRadius;

                    const x = Math.cos(rad) * animatedRadius;
                    const y = Math.sin(rad) * animatedRadius;

                    // Task arc constants — compact satellite crown around module icon
                    // Tasks are CHILDREN of the module wrapper, so they inherit
                    // the parent's wave displacement automatically (no extra animation needed).
                    const TASK_ARC_RADIUS = 48; // px from module icon center
                    const TASK_ANGLE_STEP = 38; // degrees between tasks → ±76° total spread

                    return (
                      <div key={mod.id}>
                        {/* Module container — orbital position + wave displacement via spring animate */}
                        <motion.div
                          className="absolute top-1/2 left-1/2 pointer-events-auto"
                          animate={{ x, y }}
                          transition={{ type: "spring", stiffness: 140, damping: 9 }}
                          onMouseEnter={() => {
                            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                            if (isUnlocked) {
                              setSelectedModuleId(mod.id);
                            }
                          }}
                          onMouseLeave={() => {
                            hoverTimeoutRef.current = setTimeout(() => {
                              setSelectedModuleId(null);
                            }, 400); // 400ms delay to allow clicking tasks
                          }}
                          style={{
                            translateX: "-50%",
                            translateY: "-50%",
                            width: "48px",
                            height: "48px",
                            overflow: "visible",
                          }}
                        >
                          <div className="relative w-full h-full flex items-center justify-center">
                            {/* Concentric signal ring for active module */}
                            {isActive && (
                              <div className="concentric-ring" style={{ color: mod.color }} />
                            )}

                            {/* Glass bubble module button */}
                            <div className="relative group">
                              <button
                                style={{
                                  borderColor: isUnlocked ? `${mod.color}60` : `${mod.color}30`,
                                  color: isUnlocked ? mod.color : `${mod.color}80`,
                                  background: isUnlocked
                                    ? `radial-gradient(circle at 35% 35%, ${mod.color}55 0%, ${mod.color}20 40%, rgba(4,8,22,0.95) 90%)`
                                    : `radial-gradient(circle at 35% 35%, ${mod.color}16 0%, ${mod.color}06 40%, rgba(4,8,22,0.98) 100%)`,
                                  boxShadow: isUnlocked
                                    ? `0 0 20px ${mod.color}25, inset 0 0 15px ${mod.color}10, 0 10px 25px rgba(0,0,0,0.5)`
                                    : `0 0 8px ${mod.color}12`,
                                  opacity: isUnlocked ? 1 : 0.72,
                                }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center relative border transition-all duration-300 ${
                                  isUnlocked
                                    ? isCompleted
                                      ? "glass-bubble glass-bubble-hover"
                                      : "glass-bubble glass-bubble-hover vacuum-aberration"
                                    : "cursor-not-allowed backdrop-blur-md"
                                }`}
                              >
                                <div className="absolute top-1 left-2 w-4 h-2 bg-white/20 rounded-full rotate-[-15deg] pointer-events-none" />
                                {isUnlocked ? (
                                  renderBubbleIcon(mod.iconName, true, mod.color)
                                ) : (
                                  <div className="relative flex items-center justify-center w-full h-full">
                                    <div className="opacity-70">
                                      {renderBubbleIcon(mod.iconName, true, mod.color)}
                                    </div>
                                    <Lock
                                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 drop-shadow"
                                      style={{ color: mod.color }}
                                    />
                                  </div>
                                )}
                              </button>
                            </div>

                            {/* Outer-facing text labels — direction-aware */}
                            <motion.div
                              {...getLabelStyles(mod.angle, isSelected)}
                              className={`${getLabelStyles(mod.angle, isSelected).className} select-none pointer-events-none z-10`}
                              transition={{ type: "spring", stiffness: 140, damping: 9 }}
                            >
                              {/* Triangular active module indicator pointing downwards slightly higher */}
                              {isActive && (
                                <div className={`flex w-full ${getArrowAlignment(mod.angle)} mb-2`}>
                                  <svg
                                    width="8"
                                    height="5"
                                    viewBox="0 0 24 12"
                                    fill="currentColor"
                                    style={{ color: mod.color }}
                                    className="animate-pulse"
                                  >
                                    <polygon points="12,12 0,0 24,0" />
                                  </svg>
                                </div>
                              )}
                              <span
                                className="block font-mono text-[8px] font-bold uppercase tracking-wider"
                                style={{ color: isUnlocked ? mod.color : `${mod.color}70` }}
                              >
                                {mod.title}
                              </span>
                              <span className={`block text-[9.5px] font-bold mt-0.5 truncate w-full ${
                                isUnlocked ? "text-slate-200" : "text-slate-500 font-normal"
                              }`}>
                                {mod.topic}
                              </span>
                              <span className="block text-[8px] text-muted-foreground font-mono mt-0.5 opacity-60">
                                {mod.stageName}
                              </span>
                            </motion.div>
                          </div>

                          {/* ── Task Satellite Crown ─────────────────────────────────────
                              Placed OUTSIDE the inner relative div so they're only
                              clipped by the outer motion.div which has overflow:visible.
                              Positions are (x, y) offsets from this motion.div's center.
                              The motion.div translate(-50%,-50%) puts its top-left at
                              (-24,-24) relative to orbital center, so capsule coords
                              need to be relative to (24, 24) = center of the 48px box. */}
                          <AnimatePresence>
                            {isSelected && (
                              <>
                                {Array.from({ length: 3 }).map((_, taskIdx) => {
                                  const taskNum = taskIdx + 1;

                                  // Fixed arc: Task2 at 12 o'clock (-90°), Task1 at ~10 o'clock (-128°), Task3 at ~2 o'clock (-52°)
                                  const taskAngle = -90 + (taskIdx - 1) * 38;
                                  const taskRad = (taskAngle * Math.PI) / 180;

                                  // 42px from module center = just outside the 48px neon ring edge
                                  const SATELLITE_ARC_RADIUS = 42;

                                  // Offset from motion.div center (24,24)
                                  const tlx = 24 + SATELLITE_ARC_RADIUS * Math.cos(taskRad);
                                  const tly = 24 + SATELLITE_ARC_RADIUS * Math.sin(taskRad);

                                  const getIsTaskCompleted = (mId: number, tNum: number): boolean => {
                                    const currentIdx = MODULE1_TASKS.indexOf(task);
                                    if (currentIdx === -1) return false;
                                    if (task === "completed") return true;
                                    if (task === "final_challenge") return true;
                                    const targetTaskKey = `task${mId}_${tNum}`;
                                    const targetIdx = MODULE1_TASKS.indexOf(targetTaskKey as Module1Task);
                                    return currentIdx > targetIdx;
                                  };
                                  const isTaskCompleted = getIsTaskCompleted(mod.id, taskNum);
                                  const isTaskUnlocked = mod.id <= currentActiveModuleId;

                                  return (
                                    <motion.div
                                      key={taskIdx}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15,
                                        delay: taskIdx * 0.05,
                                      }}
                                      className="absolute flex items-center justify-center pointer-events-none"
                                      style={{
                                        left: tlx,
                                        top: tly,
                                        translateX: "-50%",
                                        translateY: "-50%",
                                        zIndex: 50,
                                        width: "32px",
                                        height: "32px",
                                      }}
                                    >
                                      {/* Space capsule docking pod shape */}
                                      <div className="absolute pointer-events-none flex items-center justify-center">
                                        <svg width="28" height="18" viewBox="0 0 28 18" fill="none" className="overflow-visible">
                                          <path
                                            d="M 5,1 L 23,1 L 27,9 L 23,17 L 5,17 L 1,9 Z"
                                            fill={isTaskCompleted ? "#021a10" : "#070a13"}
                                            stroke={isTaskUnlocked ? (isTaskCompleted ? "#00FF66" : mod.color) : `${mod.color}25`}
                                            strokeWidth="1.2"
                                            style={{
                                              filter: isTaskUnlocked
                                                ? isTaskCompleted
                                                  ? "drop-shadow(0 0 5px rgba(0,255,102,0.85))"
                                                  : `drop-shadow(0 0 3px ${mod.color}50)`
                                                : "none",
                                            }}
                                          />
                                          <path
                                            d="M 8,4 L 20,4 M 8,14 L 20,14"
                                            stroke={isTaskUnlocked ? (isTaskCompleted ? "rgba(0,255,102,0.25)" : `${mod.color}20`) : `${mod.color}08`}
                                            strokeWidth="0.8"
                                          />
                                          <circle cx="5.5" cy="4" r="0.5" fill={isTaskUnlocked ? (isTaskCompleted ? "#00FF66" : `${mod.color}50`) : `${mod.color}15`} />
                                          <circle cx="22.5" cy="4" r="0.5" fill={isTaskUnlocked ? (isTaskCompleted ? "#00FF66" : `${mod.color}50`) : `${mod.color}15`} />
                                          <circle cx="22.5" cy="14" r="0.5" fill={isTaskUnlocked ? (isTaskCompleted ? "#00FF66" : `${mod.color}50`) : `${mod.color}15`} />
                                          <circle cx="5.5" cy="14" r="0.5" fill={isTaskUnlocked ? (isTaskCompleted ? "#00FF66" : `${mod.color}50`) : `${mod.color}15`} />
                                        </svg>
                                      </div>
                                      <motion.button
                                        whileHover={isTaskUnlocked ? { scale: 1.12 } : undefined}
                                        whileTap={isTaskUnlocked ? { scale: 0.92 } : undefined}
                                        style={{
                                          width: "16px",
                                          height: "16px",
                                          cursor: isTaskUnlocked ? "pointer" : "not-allowed",
                                          color: isTaskUnlocked
                                            ? isTaskCompleted ? "#00FF66" : mod.color
                                            : `${mod.color}30`,
                                          textShadow: isTaskUnlocked
                                            ? isTaskCompleted
                                              ? "0 0 5px rgba(0,255,102,0.95)"
                                              : `0 0 4px ${mod.color}`
                                            : "none",
                                          zIndex: 60,
                                        }}
                                        className="rounded-full flex items-center justify-center font-mono text-[9px] font-bold pointer-events-auto bg-transparent border-0 select-none"
                                        onClick={() => {
                                          if (!isTaskUnlocked) return;
                                          setActiveModule(mod.id);
                                          const taskKey = `task${mod.id}_${taskNum}` as Module1Task;
                                          handleNextTask(taskKey);
                                        }}
                                        title={isTaskUnlocked ? `Task ${mod.id}.${taskNum}` : "Locked"}
                                      >
                                        {taskNum}
                                      </motion.button>
                                    </motion.div>
                                  );
                                })}
                              </>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>



                {/* Command text footer inside left sector */}
                <div className="absolute bottom-0 left-0 w-full text-[10px] text-muted-foreground font-mono flex justify-between items-center z-10 select-none">
                  <span>EXPEDITION MONITOR: Audit nodes to configure launch platform systems.</span>
                  <span>COSMOSX SIGNAL NODE v1.02</span>
                </div>
              </div>

              {/* WWII V-2 Rocket Card (Col-span 3) */}
              <div className="lg:col-span-3 h-full min-h-0 overflow-hidden pr-1">
                <RocketAssembly completedModules={completedModuleIds} />
              </div>
            </motion.div>
          ) : (
            /* 2. ACTIVE OPERATION SCREEN WORKSPACE */
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              <MercuryWorkspace
                task={task}
                onTaskChange={handleNextTask}
                onBack={() => {
                  setActiveModule(null);
                  setSelectedModuleId(null);
                }}
                completedModuleIds={completedModuleIds}
                currentActiveModuleId={currentActiveModuleId}
                activeTaskInfo={activeTaskInfo}
                handleLaunchRocket={handleLaunchRocket}
                showIntro={showIntro}
                introModuleId={introModuleId}
                currentModuleDef={currentModuleDef}
                setAcknowledgedIntros={setAcknowledgedIntros}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Launch Overlay */}
      {isLaunching && (
        <PlanetTransition targetPlanet="Venus" onComplete={() => router.navigate({ to: "/" })} />
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 py-2.5 text-center">
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
          COSMOSX CLASSIFIED OPERATIONS UNIT · PLANET 01 (MERCURY)
        </p>
      </footer>
    </main>
  );
}
