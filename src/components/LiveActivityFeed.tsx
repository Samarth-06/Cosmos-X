import { useEffect, useRef, useState } from "react";
import { SIMULATED_ACTIVITY, formatTimeAgo, type ActivityItem } from "@/lib/user-store";

interface LiveActivityFeedProps {
  className?: string;
  maxItems?: number;
}

export default function LiveActivityFeed({ className = "", maxItems = 6 }: LiveActivityFeedProps) {
  const [items, setItems] = useState<ActivityItem[]>(SIMULATED_ACTIVITY.slice(0, maxItems));
  const [paused, setPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Occasionally inject a new random activity item
  useEffect(() => {
    if (paused) return;
    const NAMES = ["CosmicCoder", "ByteWatcher", "QuantumNode", "VoidWalker", "LedgerLord", "MerkleTree"];
    const ACTIONS = [
      { action: "earned", planet: "Mercury", badge: "First Block 🏅" },
      { action: "completed", planet: "Venus", badge: "Hash Cracker 🔐" },
      { action: "earned", planet: "Earth", badge: "Consensus King ⚡" },
      { action: "reached rank", planet: "", badge: "Navigator 🌟" },
      { action: "minted NFT on", planet: "Uranus", badge: "NFT Pioneer 💎" },
    ];
    const interval = setInterval(() => {
      const user = NAMES[Math.floor(Math.random() * NAMES.length)];
      const ev = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const newItem: ActivityItem = {
        id: `live_${Date.now()}`,
        user,
        action: ev.action,
        planet: ev.planet,
        badge: ev.badge,
        timestamp: Date.now(),
      };
      setItems((prev) => [newItem, ...prev.slice(0, maxItems - 1)]);
    }, 7000);
    return () => clearInterval(interval);
  }, [paused, maxItems]);

  return (
    <div
      className={`${className} overflow-hidden`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      ref={tickerRef}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`flex items-start gap-2.5 border-b border-white/5 px-3 py-2.5 transition-colors hover:bg-white/[0.02] ${i === 0 ? "animate-fade-in-down" : ""}`}
        >
          {/* Avatar */}
          <div
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
            style={{
              background: `hsl(${(item.user.charCodeAt(0) * 47) % 360}, 70%, 25%)`,
              color: `hsl(${(item.user.charCodeAt(0) * 47) % 360}, 85%, 75%)`,
              boxShadow: `0 0 8px hsl(${(item.user.charCodeAt(0) * 47) % 360}, 70%, 40% / 0.4)`,
            }}
          >
            {item.user[0]}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] leading-tight text-foreground/85">
              <span className="font-semibold text-foreground">{item.user}</span>{" "}
              <span className="text-muted-foreground">{item.action}</span>
              {item.planet && (
                <span className="text-muted-foreground"> on {item.planet}</span>
              )}
            </p>
            {item.badge && (
              <p className="mt-0.5 text-[10px] text-secondary/80 font-mono">{item.badge}</p>
            )}
          </div>

          <span className="mt-0.5 shrink-0 font-mono text-[9px] text-muted-foreground/60">
            {formatTimeAgo(item.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}
