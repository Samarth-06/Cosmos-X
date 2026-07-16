import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";

const PLANETS_META = [
  { id: "mercury", name: "Mercury", color: "#00E5FF", emoji: "☿", x: 50, y: 50 },
  { id: "venus", name: "Venus", color: "#F59E0B", emoji: "♀", x: 50, y: 50 },
  { id: "earth", name: "Earth", color: "#10B981", emoji: "🌍", x: 50, y: 50 },
  { id: "mars", name: "Mars", color: "#EF4444", emoji: "♂", x: 50, y: 50 },
  { id: "jupiter", name: "Jupiter", color: "#F97316", emoji: "♃", x: 50, y: 50 },
  { id: "saturn", name: "Saturn", color: "#8B5CF6", emoji: "♄", x: 50, y: 50 },
  { id: "uranus", name: "Uranus", color: "#06B6D4", emoji: "⛢", x: 50, y: 50 },
  { id: "neptune", name: "Neptune", color: "#3B82F6", emoji: "♆", x: 50, y: 50 },
];

// Constellation positions (SVG coords, 600x300 viewBox)
const NODE_POSITIONS = [
  { id: "mercury", cx: 60, cy: 150 },
  { id: "venus", cx: 140, cy: 80 },
  { id: "earth", cx: 230, cy: 200 },
  { id: "mars", cx: 320, cy: 90 },
  { id: "jupiter", cx: 400, cy: 180 },
  { id: "saturn", cx: 470, cy: 70 },
  { id: "uranus", cx: 540, cy: 200 },
  { id: "neptune", cx: 600, cy: 130 },
];

const CONNECTIONS = [
  ["mercury", "venus"],
  ["venus", "earth"],
  ["earth", "mars"],
  ["mars", "jupiter"],
  ["jupiter", "saturn"],
  ["saturn", "uranus"],
  ["uranus", "neptune"],
];

interface SkillTreeProps {
  completedPlanets: string[];
  planetProgress: Record<string, number>;
  onPlanetClick?: (id: string) => void;
}

export default function SkillTree({ completedPlanets, planetProgress, onPlanetClick }: SkillTreeProps) {
  const getPos = (id: string) => NODE_POSITIONS.find((n) => n.id === id)!;
  const getMeta = (id: string) => PLANETS_META.find((p) => p.id === id)!;

  const isUnlocked = (id: string, idx: number) => {
    if (idx === 0) return true;
    const prev = NODE_POSITIONS[idx - 1].id;
    return completedPlanets.includes(prev);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-slate-950/80 to-[#040816]/90 p-4">
      {/* Starfield bg */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,white_0.6px,transparent_0.6px)] bg-[size:20px_20px] opacity-[0.08]" />

      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground">Constellation Progress</h3>
        <span className="font-mono text-[10px] text-muted-foreground">{completedPlanets.length} / 8 planets</span>
      </div>

      <svg viewBox="30 40 600 250" className="w-full" style={{ height: "180px" }}>
        {/* Connection lines */}
        {CONNECTIONS.map(([fromId, toId]) => {
          const from = getPos(fromId);
          const to = getPos(toId);
          const fromComplete = completedPlanets.includes(fromId);
          const toComplete = completedPlanets.includes(toId);
          const lit = fromComplete && toComplete;
          const partial = fromComplete && !toComplete;

          return (
            <g key={`${fromId}-${toId}`}>
              {/* Base line */}
              <line
                x1={from.cx} y1={from.cy} x2={to.cx} y2={to.cy}
                stroke={lit ? getMeta(fromId).color : "rgba(255,255,255,0.06)"}
                strokeWidth={lit ? "1.5" : "1"}
                strokeDasharray={partial ? "4 4" : undefined}
              />
              {/* Glow if complete */}
              {lit && (
                <line
                  x1={from.cx} y1={from.cy} x2={to.cx} y2={to.cy}
                  stroke={getMeta(fromId).color}
                  strokeWidth="4"
                  opacity="0.15"
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {NODE_POSITIONS.map(({ id, cx, cy }, idx) => {
          const meta = getMeta(id);
          const completed = completedPlanets.includes(id);
          const progress = planetProgress[id] ?? 0;
          const unlocked = isUnlocked(id, idx);

          return (
            <g
              key={id}
              className={unlocked ? "cursor-pointer" : "cursor-not-allowed"}
              onClick={() => unlocked && onPlanetClick?.(id)}
            >
              {/* Outer glow ring if completed */}
              {completed && (
                <circle cx={cx} cy={cy} r="22" fill="none" stroke={meta.color} strokeWidth="1" opacity="0.3">
                  <animate attributeName="r" values="20;25;20" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Progress arc */}
              {progress > 0 && !completed && (
                <circle
                  cx={cx} cy={cy} r="16"
                  fill="none"
                  stroke={meta.color}
                  strokeWidth="2"
                  strokeDasharray={`${(progress / 100) * 100.5} 100.5`}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${cx} ${cy})`}
                  opacity="0.7"
                />
              )}

              {/* Node circle */}
              <circle
                cx={cx} cy={cy} r="14"
                fill={completed ? `${meta.color}22` : unlocked ? "rgba(13,17,28,0.9)" : "rgba(4,8,22,0.95)"}
                stroke={completed ? meta.color : unlocked ? `${meta.color}50` : "rgba(255,255,255,0.08)"}
                strokeWidth={completed ? "1.5" : "1"}
              />

              {/* Emoji text */}
              <text
                x={cx} y={cy + 5}
                textAnchor="middle"
                fontSize="11"
                className="select-none"
                opacity={unlocked ? 1 : 0.3}
              >
                {meta.emoji}
              </text>

              {/* Name label */}
              <text
                x={cx} y={cy + 28}
                textAnchor="middle"
                fontSize="7"
                fill={completed ? meta.color : unlocked ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"}
                className="select-none font-mono"
              >
                {meta.name}
              </text>

              {/* Lock icon */}
              {!unlocked && (
                <text x={cx + 8} y={cy - 8} fontSize="8" opacity="0.4">🔒</text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-4 text-[9px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-3 rounded-full bg-emerald-500" /> Complete
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-3 rounded-full border border-cyan-500/50" /> In Progress
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-3 rounded-full bg-white/10" /> Locked
        </span>
      </div>
    </div>
  );
}
