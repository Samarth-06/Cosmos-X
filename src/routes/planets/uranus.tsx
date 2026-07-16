import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PlanetRoom, { type PlanetModule } from "@/components/PlanetRoom";
import uranusTex from "@/assets/planets/uranus.jpg";

export const Route = createFileRoute("/planets/uranus")({
  component: UranusModule,
});

const URANUS_MODULES: PlanetModule[] = [
  {
    id: 1,
    title: "MODULE 01",
    topic: "NFTs & Ownership",
    stageName: "Ice Winds",
    iconName: "nft",
    description: "Understand digital ownership, metadata schemas, and interplanetary filesystem (IPFS) configurations.",
    tasks: ["Task 1.1: Metadata JSON", "Task 1.2: IPFS Hashing", "Task 1.3: Ledger Mint"],
  },
];

function UranusModule() {
  return (
    <PlanetRoom
      planetId="7"
      planetName="Uranus"
      topic="NFTs & Ownership"
      color="#06B6D4"
      texture={uranusTex}
      difficulty="Advanced"
      time="1h 40m"
      badgeId="nft_pioneer"
      badgeName="NFT Pioneer"
      badgeIcon="💎"
      modules={URANUS_MODULES}
      renderTeaser={(activeModuleId, onComplete) => {
        return <UranusTeaser activeModuleId={activeModuleId} onComplete={onComplete} />;
      }}
    />
  );
}

function UranusTeaser({ activeModuleId, onComplete }: { activeModuleId: number; onComplete: (xp: number) => void }) {
  const [nftName, setNftName] = useState("Uranus Storm Art");
  const [desc, setDesc] = useState("Helios series generative planet artwork");
  const [minted, setMinted] = useState(false);

  const handleMint = () => {
    setMinted(true);
    onComplete(100);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="max-w-md w-full text-center space-y-4">
        <span className="text-4xl">💎</span>
        <h3 className="font-display text-base font-bold text-white">NFT Minting Studio</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Mint a unique digital token by linking metadata to the ledger blockchain database.
        </p>

        <div className="space-y-3 text-left">
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] text-muted-foreground uppercase block">Asset Name</label>
            <input
              type="text"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] text-muted-foreground uppercase block">Description</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/40"
            />
          </div>
        </div>

        {minted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-center text-xs font-semibold font-mono">
            ✓ NFT Minted to Simulated IPFS Registry! +100 XP Earned
          </div>
        ) : (
          <button
            onClick={handleMint}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition font-mono"
          >
            Mint NFT
          </button>
        )}
      </div>
    </div>
  );
}
