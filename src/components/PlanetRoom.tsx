import { useState, useEffect, useRef, Suspense } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Lock, Star, RotateCcw, Compass, Info, Cpu, Play } from "lucide-react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { awardXP, awardBadge } from "@/lib/user-store";
import XPNotification, { useXPNotification } from "@/components/XPNotification";

// 3D globe component
function RotatingPlanet({ textureUrl }: { textureUrl: string }) {
  const tex = useLoader(TextureLoader, textureUrl);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.4, 64, 64]} />
      <meshStandardMaterial map={tex} roughness={0.8} metalness={0.2} />
    </mesh>
  );
}

export interface PlanetModule {
  id: number;
  title: string;
  topic: string;
  stageName: string;
  iconName: string;
  description: string;
  tasks: string[];
}

interface PlanetRoomProps {
  planetId: string;
  planetName: string;
  topic: string;
  color: string;
  texture: string;
  difficulty: string;
  time: string;
  modules: PlanetModule[];
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  // Specific interactive teaser element if any
  renderTeaser?: (activeModuleId: number, onComplete: (xp: number) => void) => React.ReactNode;
}

export default function PlanetRoom({
  planetId,
  planetName,
  topic,
  color,
  texture,
  difficulty,
  time,
  modules,
  badgeId,
  badgeName,
  badgeIcon,
  renderTeaser,
}: PlanetRoomProps) {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [wavePhase, setWavePhase] = useState<"idle" | "charge" | "expand" | "impact">("idle");
  const [baseRadius, setBaseRadius] = useState(200);
  const [isLaunchingNext, setIsLaunchingNext] = useState(false);

  const { notification, show: showXP, hide: hideXP } = useXPNotification();

  // Resize orbit radius dynamically
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

  // Magnetic pulse effect loop
  useEffect(() => {
    if (activeModule !== null) return;
    const interval = setInterval(() => {
      setWavePhase("charge");
      setTimeout(() => setWavePhase("expand"), 1200);
      setTimeout(() => setWavePhase("impact"), 2400);
      setTimeout(() => setWavePhase("idle"), 2600);
    }, 6500);
    return () => clearInterval(interval);
  }, [activeModule]);

  // Load progress
  useEffect(() => {
    const local = localStorage.getItem(`cosmosx-completed-${planetId}`);
    if (local) {
      try {
        setCompletedModules(JSON.parse(local));
      } catch (e) {
        setCompletedModules([]);
      }
    }
  }, [planetId]);

  const saveProgress = (list: number[]) => {
    setCompletedModules(list);
    localStorage.setItem(`cosmosx-completed-${planetId}`, JSON.stringify(list));
  };

  const handleReset = () => {
    saveProgress([]);
    setActiveModule(null);
    setSelectedModuleId(null);
  };

  const handleModuleComplete = (moduleId: number, xpReward: number = 100) => {
    if (!completedModules.includes(moduleId)) {
      const updated = [...completedModules, moduleId];
      saveProgress(updated);
      awardXP(xpReward);
      showXP(xpReward, `${modules.find(m => m.id === moduleId)?.title} Complete!`);

      // Check if all modules are complete
      if (updated.length === modules.length) {
        awardBadge(badgeId);
        showXP(250, `${badgeName} Badge Earned! ${badgeIcon}`);
      }
    }
  };

  const currentActiveModuleId =
    completedModules.length < modules.length ? completedModules.length + 1 : modules.length;

  return (
    <main className="h-screen bg-[#040816] text-white relative flex flex-col justify-between overflow-hidden">
      {/* Background Starfield */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0.8px,transparent_0.8px)] bg-size-[24px_24px] opacity-15" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(4,8,22,0.65)_100%)]" />
      </div>

      {/* XP Toast Notification */}
      <XPNotification
        amount={notification?.amount ?? 0}
        label={notification?.label ?? ""}
        visible={!!notification}
        onHide={hideXP}
      />

      {/* Top Header */}
      <header className="relative z-20 flex justify-between items-center border-b border-white/10 bg-slate-950/60 p-4 md:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="group flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition bg-slate-900/60 hover:bg-slate-900/90 px-4 py-2 rounded-full border border-white/10 hover:border-cyan-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] relative overflow-hidden"
          >
            <ChevronLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-mono tracking-wider font-semibold text-[10px]">EVACUATE TO SOLAR ORBIT</span>
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
            <p className="text-[9px] text-cyan-400/80 font-mono tracking-wider mt-0.5 select-none uppercase">
              cosmosx://planet-{planetId}/{planetName}/operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex flex-col items-end text-right font-mono text-[9px] text-muted-foreground select-none">
            <div className="flex items-center gap-1.5 font-bold tracking-wider">
              <span style={{ color }}>{planetName.toUpperCase()} PROGRESS:</span>
              <span className="text-slate-200">{completedModules.length} / {modules.length} MODULES</span>
            </div>

            {/* Visual HUD progress bar ticks */}
            <div className="flex items-center gap-1 mt-1.5">
              {modules.map((_, idx) => {
                const isSegmentDone = completedModules.includes(idx + 1);
                const isSegmentActive = idx + 1 === currentActiveModuleId;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-1.5 rounded-sm border transition-all duration-500`}
                    style={{
                      backgroundColor: isSegmentDone ? color : isSegmentActive ? `${color}30` : "#020617",
                      borderColor: isSegmentDone || isSegmentActive ? color : "rgba(255,255,255,0.1)",
                      boxShadow: isSegmentDone
                        ? `0 0 6px ${color}`
                        : isSegmentActive
                        ? `0 0 4px ${color}80`
                        : "none",
                    }}
                    title={`Module ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-white/10" />

          <button
            onClick={handleReset}
            className="group flex items-center gap-1 text-[9px] font-mono text-rose-400 hover:text-rose-300 transition bg-rose-500/5 hover:bg-rose-500/10 px-3 py-2 rounded-md border border-rose-500/20 hover:border-rose-500/50 relative overflow-hidden"
          >
            <RotateCcw className="w-3 h-3 group-hover:rotate-[-60deg] transition-transform duration-300" />
            <span className="font-semibold tracking-wider">RESET SECTOR</span>
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="flex-1 px-4 lg:px-8 py-3 w-full relative z-10 flex flex-col justify-center min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeModule === null ? (
            /* ORBIT MODULE SELECTION VIEW */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative flex-1 min-h-0 overflow-hidden"
            >
              {/* Module selection circular map (Col-span 9) */}
              <div className="lg:col-span-9 relative h-full flex items-center justify-center min-h-0">
                {/* 3D Planet Globe */}
                <div
                  style={{ width: baseRadius * 1.5, height: baseRadius * 1.5 }}
                  className="absolute top-1/2 left-1/2 pointer-events-none z-0 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <Canvas camera={{ position: [0, 0, 5.8] }}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[10, 10, 10]} intensity={3} />
                    <Suspense fallback={null}>
                      <RotatingPlanet textureUrl={texture} />
                    </Suspense>
                  </Canvas>
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_60%,rgba(4,8,22,0.85)_98%)]" />

                  {/* Concentric buildup glow shield */}
                  <div
                    className="absolute inset-0 rounded-full border transition-all duration-1000"
                    style={{
                      borderColor: wavePhase === "charge" ? `${color}70` : `${color}15`,
                      boxShadow:
                        wavePhase === "charge"
                          ? `0 0 50px ${color}55, inset 0 0 40px ${color}35`
                          : `inset 0 0 30px ${color}10`,
                      transform: wavePhase === "charge" ? "scale(1.03)" : "scale(1)",
                    }}
                  />
                </div>

                {/* Expanding magnetic energy wave ring */}
                <AnimatePresence>
                  {wavePhase === "expand" && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 rounded-full border-2 pointer-events-none z-0"
                      style={{ borderColor: `${color}70` }}
                      initial={{ width: 0, height: 0, opacity: 0.8, x: "-50%", y: "-50%" }}
                      animate={{
                        width: baseRadius * 2,
                        height: baseRadius * 2,
                        opacity: [0.8, 0.9, 0.3, 0],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>

                {/* SVG Perfect Circular Orbit Path Line */}
                <svg
                  style={{ width: baseRadius * 2 + 20, height: baseRadius * 2 + 20 }}
                  className="absolute top-1/2 left-1/2 pointer-events-none z-0 transform -translate-x-1/2 -translate-y-1/2"
                  viewBox={`0 0 ${baseRadius * 2 + 20} ${baseRadius * 2 + 20}`}
                >
                  <circle
                    cx={baseRadius + 10}
                    cy={baseRadius + 10}
                    r={baseRadius}
                    fill="none"
                    stroke={wavePhase === "impact" ? color : "rgba(255,255,255,0.08)"}
                    strokeWidth={wavePhase === "impact" ? 1.8 : 1.2}
                    strokeDasharray="4 6"
                    className="transition-all duration-150"
                  />
                </svg>

                {/* Left Area Dashboard headers */}
                <div className="absolute top-0 left-0 z-10 select-none">
                  <h2 className="font-display text-sm lg:text-base font-bold text-white tracking-wider">
                    {planetName.toUpperCase()} EXPEDITION ORBIT
                  </h2>
                  <p className="text-[9px] lg:text-[10px] font-mono text-muted-foreground uppercase mt-0.5">
                    Navigate the cryptographic path in real time
                  </p>
                </div>

                {/* Glassy bubbles rendered dynamically in circular orbit */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {modules.map((mod, idx) => {
                    const isCompleted = completedModules.includes(mod.id);
                    const isActive = mod.id === currentActiveModuleId;
                    const isUnlocked = mod.id === 1 || isCompleted || isActive;
                    const isSelected = selectedModuleId === mod.id;

                    // Calculate orbit coordinates
                    const angle = -90 + (idx * (360 / modules.length));
                    const rad = (angle * Math.PI) / 180;
                    const animatedRadius = wavePhase === "impact" ? baseRadius + 15 : baseRadius;
                    const x = Math.cos(rad) * animatedRadius;
                    const y = Math.sin(rad) * animatedRadius;

                    return (
                      <div key={mod.id}>
                        <motion.div
                          className="absolute top-1/2 left-1/2 pointer-events-auto"
                          animate={{ x, y }}
                          transition={{ type: "spring", stiffness: 140, damping: 9 }}
                          style={{
                            translateX: "-50%",
                            translateY: "-50%",
                            width: "48px",
                            height: "48px",
                            overflow: "visible",
                          }}
                        >
                          <div className="relative w-full h-full flex items-center justify-center">
                            {isActive && (
                              <div
                                className="absolute inset-[-4px] rounded-full border border-dashed animate-spin"
                                style={{ borderColor: color, animationDuration: "8s" }}
                              />
                            )}

                            <button
                              onClick={() => {
                                if (!isUnlocked) return;
                                setSelectedModuleId(isSelected ? null : mod.id);
                              }}
                              style={{
                                borderColor: isUnlocked ? `${color}70` : "rgba(255,255,255,0.1)",
                                color: isUnlocked ? color : "rgba(255,255,255,0.4)",
                                background: isUnlocked
                                  ? `radial-gradient(circle at 35% 35%, ${color}44 0%, ${color}10 50%, rgba(4,8,22,0.95) 90%)`
                                  : "rgba(15,23,42,0.6)",
                                boxShadow: isUnlocked ? `0 0 15px ${color}20` : "none",
                              }}
                              className={`w-12 h-12 rounded-full flex items-center justify-center relative border transition-all duration-300 glass-bubble`}
                            >
                              {isUnlocked ? (
                                isCompleted ? (
                                  <span className="text-xs">✓</span>
                                ) : (
                                  <span className="font-mono text-xs font-bold">{mod.id}</span>
                                )
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-muted-foreground/60" />
                              )}
                            </button>

                            {/* Label */}
                            <div
                              className="absolute w-36 pointer-events-none select-none text-center flex flex-col items-center"
                              style={{
                                top: angle > -45 && angle < 135 ? "110%" : "auto",
                                bottom: angle <= -45 || angle >= 135 ? "110%" : "auto",
                              }}
                            >
                              <span className="font-mono text-[8px] font-bold" style={{ color: isUnlocked ? color : "rgba(255,255,255,0.3)" }}>
                                {mod.title}
                              </span>
                              <span className="text-[9px] text-slate-200 mt-0.5 truncate max-w-full font-semibold">
                                {mod.topic}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar detail/description card (Col-span 3) */}
              <div className="lg:col-span-3 flex flex-col justify-between h-full bg-slate-950/40 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono" style={{ color }}>
                    <Cpu className="w-4 h-4" />
                    <span>TELEMETRY CARD</span>
                  </div>

                  {selectedModuleId ? (
                    (() => {
                      const mod = modules.find((m) => m.id === selectedModuleId)!;
                      const isCompleted = completedModules.includes(mod.id);
                      return (
                        <div className="space-y-3 animate-fade-in">
                          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                            {mod.title}
                          </div>
                          <h3 className="text-sm font-bold text-white">{mod.topic}</h3>
                          <div className="text-[11px] text-muted-foreground leading-relaxed">
                            {mod.description}
                          </div>

                          <div className="border-t border-white/5 pt-3">
                            <span className="font-mono text-[9px] text-muted-foreground uppercase block mb-1">
                              Objectives:
                            </span>
                            <ul className="space-y-1">
                              {mod.tasks.map((task, i) => (
                                <li key={i} className="text-[10px] text-slate-300 flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            onClick={() => setActiveModule(mod.id)}
                            className="w-full mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-background transition hover:brightness-110"
                            style={{ background: color }}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {isCompleted ? "Replay Simulation" : "Launch Simulator"}
                          </button>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-12 text-muted-foreground text-xs font-mono">
                      Select an orbital node to query module coordinates and launch interactive labs.
                    </div>
                  )}
                </div>

                <div className="border-t border-white/5 pt-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>SECTOR: {planetName.toUpperCase()}</span>
                    <span>SECURE COMMS</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE WORKSPACE */
            <motion.div
              key="workspace"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col relative flex-1 min-h-0 overflow-hidden gap-4"
            >
              {/* Back to orbit row */}
              <div className="flex justify-between items-center border-b border-white/10 bg-slate-950/80 p-3 rounded-xl backdrop-blur-md shrink-0">
                <button
                  onClick={() => {
                    setActiveModule(null);
                    setSelectedModuleId(null);
                  }}
                  className="group flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-400 transition font-mono"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="text-[10px] uppercase tracking-wide">Back to Orbit Grid</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color }}>
                    MODULE {activeModule}: {modules.find(m => m.id === activeModule)?.topic.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Rendering teaser simulation or generic coming soon */}
              <div className="flex-1 min-h-0 relative overflow-hidden">
                {renderTeaser ? (
                  renderTeaser(activeModule, (xp) => handleModuleComplete(activeModule, xp))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-slate-950/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-full animate-pulse text-slate-400 mb-4">
                      <Cpu className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">Simulated Blockchain Node Starting...</h3>
                    <p className="text-xs text-muted-foreground text-center max-w-md mb-6 font-mono">
                      Establishing link to simulated {planetName} ledger. Initializing WASM network layer and synchronizing node states...
                    </p>
                    <button
                      onClick={() => handleModuleComplete(activeModule, 100)}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-950 hover:bg-slate-200 transition"
                    >
                      Bypass & Mark Complete (+100 XP)
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 py-2.5 text-center shrink-0">
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
          COSMOSX CLASSIFIED OPERATIONS UNIT · PLANET {planetId} ({planetName.toUpperCase()})
        </p>
      </footer>
    </main>
  );
}
