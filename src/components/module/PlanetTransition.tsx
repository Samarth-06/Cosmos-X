import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, FastForward } from "lucide-react";

interface Props {
  targetPlanet: string;
  onComplete: () => void;
}

export default function PlanetTransition({ targetPlanet, onComplete }: Props) {
  const [phase, setPhase] = useState<"launch" | "space" | "arrive">("launch");

  useEffect(() => {
    // Launch phase: 0s -> 2s
    const t1 = setTimeout(() => {
      setPhase("space");
    }, 2000);

    // Space phase: 2s -> 4.5s
    const t2 = setTimeout(() => {
      setPhase("arrive");
    }, 4500);

    // Arrive phase: 4.5s -> 6.5s -> complete
    const t3 = setTimeout(() => {
      onComplete();
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040816] overflow-hidden pointer-events-auto"
    >
      {/* Background Starfield Motion Blur */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {phase === "space" && (
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 3, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeIn" }}
            className="w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(255,255,255,0.2)_100%)] pointer-events-none blur-sm"
          />
        )}
      </div>

      {/* Main Container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* LAUNCH PHASE */}
          {phase === "launch" && (
            <motion.div
              key="launch"
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -300, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeIn" }}
              className="flex flex-col items-center"
            >
              <Rocket className="w-24 h-24 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]" />
              <motion.div
                animate={{ height: [20, 150, 20], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-4 bg-linear-to-b from-orange-500 via-yellow-400 to-transparent mt-2 rounded-full"
              />
              <h2 className="mt-8 font-rushblade text-2xl tracking-widest text-cyan-400 uppercase animate-pulse">
                Initiating Launch
              </h2>
            </motion.div>
          )}

          {/* SPACE PHASE */}
          {phase === "space" && (
            <motion.div
              key="space"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <Rocket className="w-16 h-16 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-pulse" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute inset-0 bg-cyan-400/30 rounded-full blur-md"
                />
              </div>
              <h2 className="mt-8 font-rushblade text-xl tracking-widest text-white uppercase">
                Hyper-space Jump
              </h2>
            </motion.div>
          )}

          {/* ARRIVE PHASE */}
          {phase === "arrive" && (
            <motion.div
              key="arrive"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="w-48 h-48 rounded-full bg-linear-to-br from-orange-400 via-amber-600 to-amber-900 shadow-[0_0_80px_rgba(245,158,11,0.6)] flex items-center justify-center overflow-hidden relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
                 <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(transparent,rgba(0,0,0,0.8))]" />
              </div>
              <h2 className="mt-8 font-rushblade text-3xl tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                Approaching {targetPlanet}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip Button */}
        <button
          onClick={onComplete}
          className="absolute bottom-12 right-12 flex items-center gap-2 text-slate-400 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
        >
          Skip Sequence <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
