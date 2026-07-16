import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PlanetRoom, { type PlanetModule } from "@/components/PlanetRoom";
import earthTex from "@/assets/planets/earth.jpg";

export const Route = createFileRoute("/planets/earth")({
  component: EarthModule,
});

const EARTH_MODULES: PlanetModule[] = [
  {
    id: 1,
    title: "MODULE 01",
    topic: "Consensus Mechanisms",
    stageName: "Biosphere Core",
    iconName: "consensus",
    description: "Learn how strangers agree on ledger balances without centralized brokers. Compare PoW, PoS, and FBA.",
    tasks: ["Task 1.1: Byzantine Generals", "Task 1.2: PoW Hash Race", "Task 1.3: Quorum Slices"],
  },
];

interface NodeState {
  id: number;
  name: string;
  stake: number;
  active: boolean;
  status: "Syncing" | "Synced" | "Failed";
}

function EarthModule() {
  return (
    <PlanetRoom
      planetId="3"
      planetName="Earth"
      topic="Consensus & Networks"
      color="#10B981"
      texture={earthTex}
      difficulty="Intermediate"
      time="1h 30m"
      badgeId="consensus_king"
      badgeName="Consensus King"
      badgeIcon="⚡"
      modules={EARTH_MODULES}
      renderTeaser={(activeModuleId, onComplete) => {
        return <EarthTeaser activeModuleId={activeModuleId} onComplete={onComplete} />;
      }}
    />
  );
}

function EarthTeaser({ activeModuleId, onComplete }: { activeModuleId: number; onComplete: (xp: number) => void }) {
  const [nodes, setNodes] = useState<NodeState[]>([
    { id: 1, name: "Node Alpha (Stellar core)", stake: 25000, active: true, status: "Synced" },
    { id: 2, name: "Node Beta (Lobstr anchor)", stake: 12000, active: true, status: "Synced" },
    { id: 3, name: "Node Gamma (Freighter connector)", stake: 8000, active: true, status: "Synced" },
    { id: 4, name: "Node Delta (Lumen validator)", stake: 5000, active: false, status: "Syncing" },
  ]);
  const [isSimulated, setIsSimulated] = useState(false);
  const [networkAgreement, setNetworkAgreement] = useState(75); // %

  const toggleNode = (id: number) => {
    const next = nodes.map((node) => {
      if (node.id === id) {
        const nextActive = !node.active;
        return {
          ...node,
          active: nextActive,
          status: nextActive ? ("Synced" as const) : ("Failed" as const),
        };
      }
      return node;
    });
    setNodes(next);

    // Calculate agreement based on active stakes
    const activeNodes = next.filter((n) => n.active);
    const totalStake = next.reduce((sum, n) => sum + n.stake, 0);
    const activeStake = activeNodes.reduce((sum, n) => sum + n.stake, 0);
    const percent = Math.round((activeStake / totalStake) * 100);
    setNetworkAgreement(percent);
  };

  const handleSimulate = () => {
    setIsSimulated(true);
    onComplete(100);
  };

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md overflow-y-auto">
      
      {/* Left panel: Info */}
      <div className="space-y-4 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <span>⚡ CONSENSUS NETWORK LAB</span>
          </div>
          <h3 className="text-base font-bold text-white">Quorum slice Byzantine agreement</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            In decentralized networks, ledger consistency depends on validator nodes agreeing on block transitions. In the Stellar network, nodes form dynamic quorums through overlapping **quorum slices**.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Toggle validator nodes in the panel to simulate node network failures. Notice how network agreement slips when highly-weighted core nodes drop offline.
          </p>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-[10px] text-emerald-400 font-mono">
          <span>
            MISSION TARGET: Maintain at least 60% network agreement to confirm transactions. Click "Establish Consensus Link" to submit telemetry.
          </span>
        </div>
      </div>

      {/* Right panel: Nodes */}
      <div className="space-y-5">
        
        {/* Node lists */}
        <div className="space-y-3">
          <div className="flex justify-between items-center font-mono text-[9px] text-muted-foreground uppercase">
            <span>Validator node</span>
            <span>Weight / status</span>
          </div>
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => toggleNode(node.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none ${
                node.active
                  ? "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50"
                  : "bg-slate-950 border-white/5 opacity-55 hover:opacity-80"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${node.active ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
                <div>
                  <div className="font-display text-[12px] font-bold text-white">{node.name}</div>
                  <div className="font-mono text-[8px] text-muted-foreground">Stake Weight: {node.stake.toLocaleString()} XLM</div>
                </div>
              </div>
              <span className="font-mono text-[10px] text-slate-300 uppercase">{node.status}</span>
            </div>
          ))}
        </div>

        {/* agreement bar */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-1 font-mono text-[9px]">
            <span className="text-muted-foreground">Network Agreement</span>
            <span className={networkAgreement >= 60 ? "text-emerald-400" : "text-rose-400"}>{networkAgreement}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                networkAgreement >= 60 ? "bg-emerald-400" : "bg-rose-500"
              }`}
              style={{ width: `${networkAgreement}%` }}
            />
          </div>
        </div>

        <div className="pt-2">
          {isSimulated ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-center text-xs font-semibold font-mono">
              ✓ Consensus Link Established! +100 XP Earned
            </div>
          ) : (
            <button
              onClick={handleSimulate}
              disabled={networkAgreement < 60}
              className={`w-full font-bold text-xs py-2.5 rounded-xl transition font-mono ${
                networkAgreement >= 60
                  ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 cursor-pointer"
                  : "bg-slate-800 text-muted-foreground cursor-not-allowed"
              }`}
            >
              Establish Consensus Link
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
