import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import PlanetRoom, { type PlanetModule } from "@/components/PlanetRoom";
import venusTex from "@/assets/planets/venus.jpg";

export const Route = createFileRoute("/planets/venus")({
  component: VenusModule,
});

const VENUS_MODULES: PlanetModule[] = [
  {
    id: 1,
    title: "MODULE 01",
    topic: "Introduction to Cryptography",
    stageName: "Acid Clouds",
    iconName: "cipher",
    description: "Learn the origin of cryptography, symmetrical versus asymmetrical key distributions, and hashing concepts.",
    tasks: ["Task 1.1: Classic Ciphers", "Task 1.2: Hashing Mechanics", "Task 1.3: Verification Methods"],
  },
  {
    id: 2,
    title: "MODULE 02",
    topic: "Cryptographic Keys",
    stageName: "Sulfur Fields",
    iconName: "keys",
    description: "Explore the mathematics of key generation, public vs. private keys, and secure seed phrases.",
    tasks: ["Task 2.1: Key Generation", "Task 2.2: Signature Signing", "Task 2.3: PublicKey Recovery"],
  },
];

// SHA-256 encoder helper using Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function VenusModule() {
  return (
    <PlanetRoom
      planetId="2"
      planetName="Venus"
      topic="Cryptography & Keys"
      color="#F59E0B"
      texture={venusTex}
      difficulty="Beginner"
      time="1h 10m"
      badgeId="hash_cracker"
      badgeName="Hash Cracker"
      badgeIcon="🔐"
      modules={VENUS_MODULES}
      renderTeaser={(activeModuleId, onComplete) => {
        return <VenusTeaser activeModuleId={activeModuleId} onComplete={onComplete} />;
      }}
    />
  );
}

function VenusTeaser({ activeModuleId, onComplete }: { activeModuleId: number; onComplete: (xp: number) => void }) {
  const [inputText1, setInputText1] = useState("CosmosX");
  const [inputText2, setInputText2] = useState("CosmosY");
  const [hash1, setHash1] = useState("");
  const [hash2, setHash2] = useState("");
  const [isMatchVerified, setIsMatchVerified] = useState(false);

  useEffect(() => {
    sha256(inputText1).then(setHash1);
  }, [inputText1]);

  useEffect(() => {
    sha256(inputText2).then(setHash2);
  }, [inputText2]);

  const handleVerify = () => {
    setIsMatchVerified(true);
    onComplete(100);
  };

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md overflow-y-auto">
      
      {/* Left panel: Info */}
      <div className="space-y-4 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
            <span>🔐 HASH FORGE LAB</span>
          </div>
          <h3 className="text-base font-bold text-white">The Cryptographic Avalanche Effect</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            In hashing algorithms like SHA-256, changing even a single byte or character in the input string causes a massive, unpredictable change in the resulting hash. This property is known as the **avalanche effect**.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Try modifying the inputs on the right side. Observe how a one-letter difference between **Input A** and **Input B** produces completely unrelated hashes.
          </p>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-[10px] text-amber-400 font-mono">
          <span>
            MISSION TARGET: Tweak inputs until you understand data integrity. Click "Validate Telemetry Link" to save progress and earn 100 XP.
          </span>
        </div>
      </div>

      {/* Right panel: Live simulator */}
      <div className="space-y-5">
        
        {/* Input A */}
        <div className="space-y-1.5">
          <label className="font-mono text-[9px] text-muted-foreground uppercase block">Input A</label>
          <input
            type="text"
            value={inputText1}
            onChange={(e) => setInputText1(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500/40"
          />
          <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5">
            <span className="font-mono text-[8px] text-muted-foreground uppercase block mb-1">SHA-256 Hash A</span>
            <span className="font-mono text-[10px] text-amber-400 break-all select-all block">{hash1}</span>
          </div>
        </div>

        {/* Input B */}
        <div className="space-y-1.5">
          <label className="font-mono text-[9px] text-muted-foreground uppercase block">Input B</label>
          <input
            type="text"
            value={inputText2}
            onChange={(e) => setInputText2(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500/40"
          />
          <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5">
            <span className="font-mono text-[8px] text-muted-foreground uppercase block mb-1">SHA-256 Hash B</span>
            <span className="font-mono text-[10px] text-amber-400 break-all select-all block">{hash2}</span>
          </div>
        </div>

        <div className="pt-2">
          {isMatchVerified ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-center text-xs font-semibold font-mono">
              ✓ Telemetry Link Verified! +100 XP Earned
            </div>
          ) : (
            <button
              onClick={handleVerify}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition font-mono"
            >
              Validate Telemetry Link
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
