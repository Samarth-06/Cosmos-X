import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PlanetRoom, { type PlanetModule } from "@/components/PlanetRoom";
import marsTex from "@/assets/planets/mars.jpg";

export const Route = createFileRoute("/planets/mars")({
  component: MarsModule,
});

const MARS_MODULES: PlanetModule[] = [
  {
    id: 1,
    title: "MODULE 01",
    topic: "Wallets & Transactions",
    stageName: "Rust Canyon",
    iconName: "wallet",
    description: "Learn how public/private keypairs translate to blockchain wallet addresses, fee estimations, and mempool queue priority.",
    tasks: ["Task 1.1: Wallet Generation", "Task 1.2: Transaction Payload", "Task 1.3: Gas Wars"],
  },
];

function MarsModule() {
  return (
    <PlanetRoom
      planetId="4"
      planetName="Mars"
      topic="Wallets & Transactions"
      color="#EF4444"
      texture={marsTex}
      difficulty="Intermediate"
      time="1h 20m"
      badgeId="gas_guru"
      badgeName="Gas Guru"
      badgeIcon="⛽"
      modules={MARS_MODULES}
      renderTeaser={(activeModuleId, onComplete) => {
        return <MarsTeaser activeModuleId={activeModuleId} onComplete={onComplete} />;
      }}
    />
  );
}

function MarsTeaser({ activeModuleId, onComplete }: { activeModuleId: number; onComplete: (xp: number) => void }) {
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(false);

  const generateWallet = () => {
    // Generate a simulated Stellar address (starts with G)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let addr = "G";
    for (let i = 0; i < 55; i++) {
      addr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAddress(addr);
    onComplete(100);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="max-w-md text-center space-y-4">
        <span className="text-4xl">🚀</span>
        <h3 className="font-display text-base font-bold text-white">Wallet Address Telemetry Builder</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Generating a secure keypair is the first step to executing ledger transactions. Try triggering the visual generator below to create a simulated public address key.
        </p>

        {address && (
          <div className="bg-slate-950 border border-white/5 rounded-2xl p-4 font-mono text-[10px] break-all select-all flex flex-col items-center gap-1.5 animate-fade-in text-red-400">
            <span className="text-[8px] text-muted-foreground uppercase">Stellar Public Address Key</span>
            <span>{address}</span>
          </div>
        )}

        <button
          onClick={generateWallet}
          className="bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition font-mono"
        >
          Generate Public Address
        </button>
      </div>
    </div>
  );
}
