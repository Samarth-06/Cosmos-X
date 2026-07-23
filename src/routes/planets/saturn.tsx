import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PlanetRoom, { type PlanetModule } from "@/components/PlanetRoom";
import saturnTex from "@/assets/planets/saturn.jpg";

export const Route = createFileRoute("/planets/saturn")({
  component: SaturnModule,
});

const SATURN_MODULES: PlanetModule[] = [
  {
    id: 1,
    title: "MODULE 01",
    topic: "Tokens & Assets",
    stageName: "Ring System",
    iconName: "token",
    description: "Issue, mint, and distribute custom tokens on the Stellar ledger using trustlines and anchors.",
    tasks: ["Task 1.1: Issue Asset", "Task 1.2: Set Supply", "Task 1.3: Trustlines"],
  },
];

function SaturnModule() {
  return (
    <PlanetRoom
      planetId="6"
      planetName="Saturn"
      topic="Tokens & Assets"
      color="#8B5CF6"
      texture={saturnTex}
      difficulty="Advanced"
      time="1h 50m"
      badgeId="token_forge"
      badgeName="Token Forge"
      badgeIcon="🪙"
      modules={SATURN_MODULES}
      renderTeaser={(activeModuleId, onComplete) => {
        return <SaturnTeaser activeModuleId={activeModuleId} onComplete={onComplete} />;
      }}
    />
  );
}

function SaturnTeaser({ activeModuleId, onComplete }: { activeModuleId: number; onComplete: (xp: number) => void }) {
  const [tokenName, setTokenName] = useState("LUMENX");
  const [supply, setSupply] = useState("1000000");
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    setCreated(true);
    onComplete(100);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="max-w-md w-full text-center space-y-4">
        <span className="text-4xl">🪙</span>
        <h3 className="font-display text-base font-bold text-white">Asset Issuance Console</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Create customized digital assets by setting supply and token identifiers. Submit to verify transaction validity.
        </p>

        <div className="space-y-3 text-left">
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] text-muted-foreground uppercase block">Token Symbol</label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-violet-500/40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] text-muted-foreground uppercase block">Max Supply</label>
            <input
              type="text"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-violet-500/40"
            />
          </div>
        </div>

        {created ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-center text-xs font-semibold font-mono">
            ✓ Token {tokenName} Issued on Simulated Ledger! +100 XP Earned
          </div>
        ) : (
          <button
            onClick={handleCreate}
            className="w-full bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition font-mono"
          >
            Forge Asset
          </button>
        )}
      </div>
    </div>
  );
}
