import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, ArrowLeft, HelpCircle, Orbit, Wind, Fuel, Lock, Check } from "lucide-react";
import TaskWorkspaceLayout from "./TaskWorkspaceLayout";
import { saveTaskScore } from "@/lib/module1-store";

interface Props {
  onComplete: () => void;
}

type Round = 1 | 2 | 3;
type Round1Choice = "orion" | "vega" | "neither" | null;

const WEAKNESS_OPTIONS = [
  { id: "a", text: "The central bank restricts trading balances to node members only" },
  { id: "b", text: "Transaction fees are determined dynamically based on distance" },
  { id: "c", text: "The escrow server represents a Single Point of Failure (SPF) that can be hacked, compromised, or censored", correct: true },
  { id: "d", text: "Transactions are limited to physical asset deliveries only" },
];

export default function Task1_3_TradeDilemma({ onComplete }: Props) {
  const [round, setRound] = useState<Round>(1);
  const [round1Choice, setRound1Choice] = useState<Round1Choice>(null);
  const [downsides, setDownsides] = useState<string[]>([]);
  const [weaknessAnswer, setWeaknessAnswer] = useState<string | null>(null);

  const handleRound1Select = (choice: "orion" | "vega" | "neither") => {
    if (round1Choice !== null) return;
    setRound1Choice(choice);
  };

  const handleRound3Select = (id: string) => {
    if (weaknessAnswer !== null) return;
    setWeaknessAnswer(id);
  };

  const toggleDownside = (id: string) => {
    setDownsides((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const allDownsidesSelected = downsides.length === 4;

  const handleNextRound = () => {
    if (round === 1) {
      setRound(2);
    } else if (round === 2) {
      setRound(3);
    } else {
      // Complete task
      saveTaskScore("task1_3", 10, 10, true);
      onComplete();
    }
  };

  const handlePrevRound = () => {
    if (round === 2) {
      setRound(1);
    } else if (round === 3) {
      setRound(2);
    }
  };

  return (
    <TaskWorkspaceLayout
      moduleColor="#22d3ee"
      taskTitle="Task 1.3 — Space Station Trade Dilemma"
      taskConcept="The trust problem in trade"
      theoryContent={
        <div className="space-y-4 text-[10.5px] leading-relaxed text-slate-300 select-text">
          {/* Header with glow */}
          <div className="border-b border-white/5 pb-2">
            <span className="font-mono text-[8px] text-cyan-400 uppercase tracking-widest font-bold">REMOVING THE TRUST BARRIER</span>
            <h4 className="font-rushblade text-white text-xs tracking-wider uppercase mt-0.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
              The Trust Dilemma
            </h4>
          </div>

          {/* Simple Analogy */}
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 space-y-2">
            <span className="font-mono text-[8.5px] text-amber-400 font-bold uppercase tracking-wider block">Real-World Analogy</span>
            <p className="font-sans italic text-slate-300">
              {round === 1 && (
                `"Imagine trading a rare stamp for a toy train with an online stranger. Who ships first? If you ship first, they might block you. If they ship first, you might block them. This deadlock is the classical Trust Dilemma. Trade fails because trust is zero."`
              )}
              {round === 2 && (
                `"To solve this deadlock, you use a central escrow service like eBay. You send the stamp to eBay, and the stranger sends the train to eBay. eBay audits both, takes a fee, and forwards them. It works, but you pay a cut and trust them with your items."`
              )}
              {round === 3 && (
                `"What happens if eBay's vault catches fire or gets robbed? Your stamp and the stranger's train are both lost because eBay was the single central custody node. True trustless trade requires removing central servers."`
              )}
            </p>
          </div>

          {/* Complex Technical Detail */}
          <div className="space-y-2">
            <span className="font-mono text-[8.5px] text-cyan-400 font-bold uppercase tracking-wider block">Technological Consensus</span>
            <p className="font-sans">
              In 2008, Satoshi Nakamoto bypassed this by defining a shared *cryptographic peer-to-peer ledger*. Instead of trusting a central escrow agent, transacting parties trust the math of *consensus algorithms* (like Proof of Work) and cryptography.
            </p>
            <p className="font-sans">
              Ledger entries are secured by *hash chains* and verified by decentralized nodes. Transactions are direct, immutable, and censor-resistant.
            </p>
          </div>

          {/* Traversal Navigator (To & Fro) */}
          <div className="border border-white/5 bg-slate-950/60 p-3 rounded-xl select-none">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Round Navigator</span>
              <div className="flex gap-1.5">
                <button
                  disabled={round === 1}
                  onClick={handlePrevRound}
                  className="px-2 py-1 bg-slate-900 border border-white/10 rounded-lg text-[8px] font-mono text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-2.5 h-2.5" /> Back
                </button>
                <button
                  disabled={round === 3}
                  onClick={handleNextRound}
                  className="px-2 py-1 bg-slate-900 border border-white/10 rounded-lg text-[8px] font-mono text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer flex items-center gap-1"
                >
                  Next <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-2.5 justify-center">
              {([1, 2, 3] as Round[]).map((r) => {
                const isCurrent = round === r;
                let ansExists = false;
                let isCorrect = false;
                if (r === 1) {
                  ansExists = round1Choice !== null;
                  isCorrect = round1Choice === "neither";
                } else if (r === 2) {
                  ansExists = downsides.length > 0;
                  isCorrect = allDownsidesSelected;
                } else if (r === 3) {
                  ansExists = weaknessAnswer !== null;
                  isCorrect = weaknessAnswer === "c";
                }

                return (
                  <button
                    key={r}
                    onClick={() => setRound(r)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] transition-all duration-300 cursor-pointer ${
                      isCurrent
                        ? "bg-cyan-500 text-slate-950 font-bold scale-110 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                        : ansExists
                        ? isCorrect
                          ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                          : "bg-rose-500/20 border border-rose-500/40 text-rose-400"
                        : "bg-slate-900 border border-white/10 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      }
      challengeContent={
        <div className="space-y-4 select-none h-full flex flex-col justify-between">
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Orbit className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                <p className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  The Trade Environment
                </p>
              </div>
              <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans mt-2">
                Two space stations — <strong>Station Orion</strong> (surplus Oxygen) and <strong>Station Vega</strong> (surplus Fuel) — wish to execute a barter trade across opposite sides of the galaxy. They have never transacted before.
              </p>
            </div>

            {/* Conversation box */}
            <div className="bg-slate-950 border border-white/5 p-3.5 rounded-xl font-mono text-[9.5px] leading-relaxed my-3">
              <p className="text-cyan-300">Orion: <span className="text-white">"I will send 500 Oxygen units for 300 Fuel units."</span></p>
              <p className="text-purple-300 mt-1.5">Vega: <span className="text-white">"Agreed. But who routes their shipment first?"</span></p>
            </div>

            {/* Escrow Visualization for Round 2 & 3 */}
            {round >= 2 && (
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3 space-y-2">
                <p className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest">
                  Central Escrow State
                </p>
                <div className="space-y-1.5 font-mono text-[9px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-cyan-400 font-bold">Orion</span>
                    <span className="text-slate-500">➔</span>
                    <span className="bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded text-amber-300">500 Oxygen in Escrow</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-emerald-400">✓ Deposited</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-purple-400 font-bold">Vega</span>
                    <span className="text-slate-500">➔</span>
                    <span className="bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded text-amber-300">300 Fuel in Escrow</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-emerald-400">✓ Deposited</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      labContent={
        <div className="space-y-3 flex-1 flex flex-col justify-between min-h-0 select-none">
          <AnimatePresence mode="wait">
            {/* ROUND 1 VIEW */}
            {round === 1 && (
              <motion.div key="round1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Verify question</span>
                  <p className="text-[11px] text-white font-bold leading-relaxed">Without trust, who should transmit first?</p>
                </div>

                <div className="flex flex-col gap-2 grow justify-center">
                  {[
                    { id: "orion", label: "Orion sends first", text: "500 Oxygen upfront", icon: Wind },
                    { id: "vega", label: "Vega sends first", text: "300 Fuel upfront", icon: Fuel },
                    { id: "neither", label: "Neither sends", text: "Deadlock — no trade", icon: Lock },
                  ].map((c) => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleRound1Select(c.id as any)}
                        className={`rounded-xl p-2.5 border text-left text-[10px] font-mono transition-all flex items-center gap-3 cursor-pointer ${
                          round1Choice === c.id
                            ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                            : "bg-slate-950/60 border-white/10 text-slate-300 hover:border-cyan-500/30"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="flex-1">
                          <p className="font-bold">{c.label}</p>
                          <p className="text-slate-500 mt-0.5 text-[9px]">{c.text}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Explanation */}
                <div className="min-h-[110px] max-h-[145px] overflow-y-auto pr-1">
                  {round1Choice && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
                      <div className={`rounded-xl p-3 border text-[9.5px] font-mono leading-relaxed ${
                        round1Choice === "neither"
                          ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                          : "bg-rose-500/10 border-rose-500/25 text-rose-300"
                      }`}>
                        <span className="font-bold uppercase tracking-wider block mb-1">
                          {round1Choice === "neither" ? "✓ TRUST LOGS VERIFIED" : "✗ TRANSACTION FAILED"}
                        </span>
                        {round1Choice === "neither"
                          ? "Outcome: Deadlock. Neither station risks sending first. The trade fails, and both stations suffer resource shortages. An escrow service is needed."
                          : "Outcome: Defalcation. The first sender transmits their assets, but the receiver stays silent, pocketing the resource without paying back."}
                      </div>

                      {/* Submit and proceed button for this subtask */}
                      <button
                        onClick={handleNextRound}
                        className="w-full flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-2.5 rounded-xl text-[9px] font-rushblade font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] transition uppercase tracking-wider cursor-pointer"
                      >
                        <span>Submit & Proceed to Round 2</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ROUND 2 VIEW */}
            {round === 2 && (
              <motion.div key="round2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Verify question</span>
                  <p className="text-[11px] text-white font-bold leading-relaxed">Select all 4 weaknesses of using a Central Escrow Server:</p>
                </div>

                <div className="flex flex-col gap-1.5 grow justify-center">
                  {[
                    { id: "fees", label: "Charges commission fee percentages on every swap." },
                    { id: "delay", label: "Takes multiple days to settle ledger accounts." },
                    { id: "custody", label: "Maintains absolute custody/control over your assets." },
                    { id: "spf", label: "Represents a Single Point of Failure (SPF) vulnerable to hacker exploits." },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => toggleDownside(d.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-[9.5px] font-mono transition-all flex items-center gap-2 cursor-pointer ${
                        downsides.includes(d.id)
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                          : "bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/25"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${
                        downsides.includes(d.id) ? "bg-rose-500/40 border-rose-500/60 text-rose-300" : "border-slate-600"
                      }`}>
                        {downsides.includes(d.id) && <span>✓</span>}
                      </div>
                      <span>{d.label}</span>
                    </button>
                  ))}
                </div>

                {/* Immediate Explanation */}
                <div className="min-h-[110px] max-h-[145px] overflow-y-auto pr-1">
                  {allDownsidesSelected && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
                      <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-xl text-[9px] font-mono text-emerald-300 leading-relaxed">
                        <span className="font-bold uppercase tracking-wider block mb-1">✓ WEAKNESS ANALYSIS COMPLETED</span>
                        All weaknesses mapped. The Central Escrow works, but is slow, expensive, and insecure. We need a decentralized alternative.
                      </div>

                      {/* Submit and proceed button for this subtask */}
                      <button
                        onClick={handleNextRound}
                        className="w-full flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-2.5 rounded-xl text-[9px] font-rushblade font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] transition uppercase tracking-wider cursor-pointer"
                      >
                        <span>Submit & Proceed to Round 3</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ROUND 3 VIEW */}
            {round === 3 && (
              <motion.div key="round3" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Verify question</span>
                  <p className="text-[11.5px] text-white font-bold leading-relaxed">What represents the core structural hazard of the Central Escrow Server?</p>
                </div>

                <div className="flex flex-col gap-2 grow justify-center">
                  {WEAKNESS_OPTIONS.map((opt) => {
                    const isSelected = weaknessAnswer === opt.id;
                    const isCorrectOpt = opt.correct || false;

                    let style = "bg-slate-950/60 hover:bg-slate-900 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)]";
                    if (weaknessAnswer !== null) {
                      if (isCorrectOpt) style = "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]";
                      else if (isSelected) style = "bg-rose-950/40 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(239,68,68,0.15)]";
                      else style = "bg-slate-950/30 border-white/5 text-slate-600 opacity-50";
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleRound3Select(opt.id)}
                        disabled={weaknessAnswer !== null}
                        className={`text-left border rounded-xl px-4 py-2.5 text-[9.5px] font-mono transition-all flex items-center justify-between gap-2 min-h-[48px] cursor-pointer w-full min-w-0 ${style}`}
                      >
                        <span className="flex-1 wrap-break-word line-clamp-2">{opt.text}</span>
                        {weaknessAnswer !== null && isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        {weaknessAnswer !== null && isSelected && !isCorrectOpt && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Explanation */}
                <div className="min-h-[110px] max-h-[145px] overflow-y-auto pr-1">
                  {weaknessAnswer !== null && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
                      <div className={`rounded-xl p-3 border text-[9.5px] font-mono leading-relaxed ${
                        weaknessAnswer === "c" ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300" : "bg-rose-500/10 border-rose-500/25 text-rose-300"
                      }`}>
                        <span className="font-bold uppercase tracking-wider block mb-1">
                          {weaknessAnswer === "c" ? "✓ DECENTRALIZED PARADIGM SHIFT" : "✗ SUB-OPTIMAL EXPLOIT"}
                        </span>
                        {WEAKNESS_OPTIONS.find(o => o.id === weaknessAnswer)?.correct
                          ? "Correct! The escrow database exists in one physical database. Blockchain eliminates this central database node using distributed consensus."
                          : "Incorrect copy. The primary concern is single points of failure that can compromise all transactions."}
                      </div>

                      {/* Always show Proceed button for each subtask, irrespective of the correctness of the answer */}
                      <button
                        onClick={handleNextRound}
                        className="w-full flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-2.5 rounded-xl text-[9px] font-rushblade font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] transition uppercase tracking-wider cursor-pointer"
                      >
                        <span>Submit & Complete Module</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    />
  );
}
