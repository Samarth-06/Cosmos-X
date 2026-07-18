import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PlanetRoom, { type PlanetModule } from "@/components/PlanetRoom";
import jupiterTex from "@/assets/planets/jupiter.jpg";

export const Route = createFileRoute("/planets/jupiter")({
  component: JupiterModule,
});

const JUPITER_MODULES: PlanetModule[] = [
  {
    id: 1,
    title: "MODULE 01",
    topic: "Smart Contracts",
    stageName: "Great Red Spot",
    iconName: "contract",
    description: "Write, compile, and execute smart contracts on the Soroban sandboxed virtual ledger.",
    tasks: ["Task 1.1: Deploy Hello Contract", "Task 1.2: State Management", "Task 1.3: Bug Hunting"],
  },
];

function JupiterModule() {
  return (
    <PlanetRoom
      planetId="5"
      planetName="Jupiter"
      topic="Smart Contracts"
      color="#F97316"
      texture={jupiterTex}
      difficulty="Advanced"
      time="2h 10m"
      badgeId="contract_deployer"
      badgeName="Contract Deployer"
      badgeIcon="🤖"
      modules={JUPITER_MODULES}
      renderTeaser={(activeModuleId, onComplete) => {
        return <JupiterTeaser activeModuleId={activeModuleId} onComplete={onComplete} />;
      }}
    />
  );
}

function JupiterTeaser({ activeModuleId, onComplete }: { activeModuleId: number; onComplete: (xp: number) => void }) {
  const [deployed, setDeployed] = useState(false);
  const codeSample = `#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol_short!("Hello"), to]
    }
}`;

  const handleDeploy = () => {
    setDeployed(true);
    onComplete(100);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="max-w-md w-full text-center space-y-4">
        <span className="text-4xl">🤖</span>
        <h3 className="font-display text-base font-bold text-white">Soroban smart contract IDE</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Soroban smart contracts are compiled using WebAssembly and executed on Stellar nodes. Try deploying the Rust contract compiler telemetry below.
        </p>

        <div className="bg-slate-950 border border-white/5 rounded-2xl p-3.5 text-left font-mono text-[9.5px] overflow-x-auto text-orange-400">
          <pre>{codeSample}</pre>
        </div>

        {deployed ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-center text-xs font-semibold font-mono">
            ✓ Smart Contract Compiled & Deployed to simulated node! +100 XP Earned
          </div>
        ) : (
          <button
            onClick={handleDeploy}
            className="w-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition font-mono"
          >
            Deploy hello_world.wasm
          </button>
        )}
      </div>
    </div>
  );
}
