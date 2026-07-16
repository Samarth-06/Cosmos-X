import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PlanetRoom, { type PlanetModule } from "@/components/PlanetRoom";
import neptuneTex from "@/assets/planets/neptune.jpg";

export const Route = createFileRoute("/planets/neptune")({
  component: NeptuneModule,
});

const NEPTUNE_MODULES: PlanetModule[] = [
  {
    id: 1,
    title: "MODULE 01",
    topic: "Stellar Mainnet Launch",
    stageName: "Deep Abyss",
    iconName: "rocket",
    description: "Connect a real browser extension wallet (Freighter, Lobstr) and submit your first transaction on the Stellar testnet faucet.",
    tasks: ["Task 1.1: Wallet Sync", "Task 1.2: Testnet Faucet", "Task 1.3: Mainnet Deploy"],
  },
];

function NeptuneModule() {
  return (
    <PlanetRoom
      planetId="8"
      planetName="Neptune"
      topic="Stellar Mainnet"
      color="#3B82F6"
      texture={neptuneTex}
      difficulty="Advanced"
      time="2h 30m"
      badgeId="mainnet_launch"
      badgeName="Mainnet Launch"
      badgeIcon="🚀"
      modules={NEPTUNE_MODULES}
      renderTeaser={(activeModuleId, onComplete) => {
        return <NeptuneTeaser activeModuleId={activeModuleId} onComplete={onComplete} />;
      }}
    />
  );
}

function NeptuneTeaser({ activeModuleId, onComplete }: { activeModuleId: number; onComplete: (xp: number) => void }) {
  const [connected, setConnected] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleConnect = () => {
    setConnected(true);
    setTxHash("0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
    onComplete(150);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="max-w-md w-full text-center space-y-4">
        <span className="text-4xl">🔑</span>
        <h3 className="font-display text-base font-bold text-white">Stellar Wallet Connection</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Connect your Freighter browser wallet to authorize cryptographic signatures. This enables live ledger transactions.
        </p>

        {connected && txHash && (
          <div className="bg-slate-950 border border-white/5 rounded-2xl p-4 font-mono text-[9px] break-all select-all flex flex-col items-center gap-1.5 animate-fade-in text-blue-400">
            <span className="text-[8px] text-muted-foreground uppercase">Simulated Transaction Hash Signature</span>
            <span>{txHash}</span>
          </div>
        )}

        {connected ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-center text-xs font-semibold font-mono">
            ✓ Wallet Connected & Faucet Funded! +150 XP Earned
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="w-full bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition font-mono"
          >
            Connect Freighter Wallet
          </button>
        )}
      </div>
    </div>
  );
}
