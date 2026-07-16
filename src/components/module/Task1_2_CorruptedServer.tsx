import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, Shield, ShieldOff, ArrowRight, ArrowLeft, HelpCircle } from "lucide-react";
import TaskWorkspaceLayout from "./TaskWorkspaceLayout";
import { saveTaskScore } from "@/lib/module1-store";

interface Props {
  onComplete: () => void;
}

type Phase = "normal" | "breach" | "investigate";

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  unit: string;
  status: "ok" | "flagged" | "deleted";
  original?: number;
}

const ORIGINAL_TXNS: Transaction[] = [
  { id: "TX-001", from: "Station Alpha", to: "Station Beta", amount: 200, unit: "fuel", status: "ok" },
  { id: "TX-002", from: "Station Gamma", to: "Station Delta", amount: 150, unit: "fuel", status: "ok" },
  { id: "TX-003", from: "Station Beta", to: "Station Epsilon", amount: 100, unit: "fuel", status: "ok" },
];

const CORRUPTED_TXNS: Transaction[] = [
  { id: "TX-001", from: "Station Alpha", to: "Station Beta", amount: 9999, unit: "fuel", status: "flagged", original: 200 },
  { id: "TX-002", from: "Station Gamma", to: "Station Delta", amount: 0, unit: "fuel", status: "deleted", original: 150 },
  { id: "TX-003", from: "Station Beta", to: "Station Epsilon", amount: 100, unit: "fuel", status: "ok" },
];

const QUESTIONS = [
  {
    id: 1,
    question: "Q1: Why was the attacker able to modify the transaction logs undetected?",
    options: [
      "The database had zero encryption keys installed",
      "Only one copy of the data exists, controlled by a single master server node",
      "The station nodes did not have sufficient bandwidth to verify",
      "The transaction sizes exceeded the server hardware limits"
    ],
    correct: 1,
    explanation: "Because there is only one centralized database. If an attacker breaches the admin firewall, they can rewrite history instantly, and all user nodes are forced to accept the fake state.",
    analogy: "Imagine planning a road trip with 3 friends. Instead of keeping the plan on a group chat (distributed ledger), it is written on a single piece of paper kept by Bob. If someone sneaks in and alters Bob's paper, everyone follows the fake plan because Bob's paper is the single point of failure.",
    complexExplanation: "Centralized systems rely on a single administrative Domain Name System (DNS) or server authority. Once a hacker gains administrative shell privileges (root access), they bypass data consistency audits, allowing malicious injection of state changes."
  },
  {
    id: 2,
    question: "Q2: How does distributing database copies to multiple network nodes prevent this exploit?",
    options: [
      "Replication speeds up transaction processing times",
      "If 100 copies exist, nodes audit database states. Fake updates are rejected by consensus.",
      "Multiple databases require larger server space",
      "It allows nodes to encrypt each other's keys"
    ],
    correct: 1,
    explanation: "With peer-to-peer copies, all machines compare data signatures. If one computer modifies its local records, the remaining 99 nodes reject it as a mismatch, preserving history.",
    analogy: "Imagine if all 4 friends carry identical copies of the trip plan in their pockets. If someone edits Bob's paper, the other three look at their papers, see they don't match Bob's, and instantly override the edit. The truth is protected by consensus.",
    complexExplanation: "Decentralized consensus protocols (like Gossip/BFT) compare hash trees of local ledger copies. A malicious transaction is discarded if it fails to receive approval from the majority of independent nodes."
  }
];

export default function Task1_2_CorruptedServer({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("normal");
  const [breachStep, setBreachStep] = useState(0); // 0=pre, 1=shaking, 2=complete
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Web Audio Alarm Synthesizer
  const playAlarmSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.8);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 1.2);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 1.6);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 2.0);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.6);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.1);
    } catch (e) {
      console.warn("Audio Context failed: ", e);
    }
  };

  // Auto-advance breach simulation
  useEffect(() => {
    if (phase !== "breach") return;
    setIsShaking(true);
    setIsFlashing(true);
    playAlarmSound();
    setBreachStep(1);

    const flashTimeout = setTimeout(() => {
      setIsFlashing(false);
    }, 1500);

    const t1 = setTimeout(() => {
      setIsShaking(false);
      setBreachStep(2);
      setPhase("investigate");
    }, 2500);

    return () => {
      clearTimeout(flashTimeout);
      clearTimeout(t1);
    };
  }, [phase]);

  const handleSelect = (optionIdx: number) => {
    if (answers[currentQuestionIdx] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [currentQuestionIdx]: optionIdx }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx((idx) => idx + 1);
    } else {
      // Completed task
      saveTaskScore("task1_2", 10, 10, true);
      onComplete();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((idx) => idx - 1);
    }
  };

  const activeQuestion = QUESTIONS[currentQuestionIdx];
  const selectedAnswer = answers[currentQuestionIdx] !== undefined ? answers[currentQuestionIdx] : null;
  const isCorrect = selectedAnswer === activeQuestion.correct;

  const currentTransactions =
    phase === "investigate" || (phase === "breach" && breachStep === 2)
      ? CORRUPTED_TXNS
      : ORIGINAL_TXNS;

  return (
    <TaskWorkspaceLayout
      moduleColor="#22d3ee"
      taskTitle="Task 1.2 — The Corrupted Command Center"
      taskConcept="Single Points of Failure (SPF)"
      theoryContent={
        <div className="space-y-4 text-[10.5px] leading-relaxed text-slate-300 select-text">
          {/* Header with glow */}
          <div className="border-b border-white/5 pb-2">
            <span className="font-mono text-[8px] text-cyan-400 uppercase tracking-widest font-bold">EXPLOITING WEAKNESSES</span>
            <h4 className="font-rushblade text-white text-xs tracking-wider uppercase mt-0.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
              Single Point of Failure
            </h4>
          </div>

          {/* Simple Analogy */}
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 space-y-2">
            <span className="font-mono text-[8.5px] text-amber-400 font-bold uppercase tracking-wider block">Real-World Analogy</span>
            <p className="font-sans italic text-slate-300">
              "{activeQuestion.analogy}"
            </p>
          </div>

          {/* Complex Technical Detail */}
          <div className="space-y-2">
            <span className="font-mono text-[8.5px] text-cyan-400 font-bold uppercase tracking-wider block">Technological Vulnerability</span>
            <p className="font-sans">
              {activeQuestion.complexExplanation}
            </p>
            <p className="font-sans">
              A <span className="text-cyan-400 font-bold font-mono">centralized database</span> acts as a single gateway. If that gateway is compromised by administrative key theft or a server crash, the entire network's state is corrupted or halted instantly.
            </p>
          </div>

          {/* Traversal Navigator (To & Fro) */}
          {phase === "investigate" && (
            <div className="border border-white/5 bg-slate-950/60 p-3 rounded-xl select-none">
              <div className="flex items-center justify-between">
                <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Question Navigator</span>
                <div className="flex gap-1.5">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={handlePrevQuestion}
                    className="px-2 py-1 bg-slate-900 border border-white/10 rounded-lg text-[8px] font-mono text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-2.5 h-2.5" /> Back
                  </button>
                  <button
                    disabled={currentQuestionIdx === QUESTIONS.length - 1}
                    onClick={handleNextQuestion}
                    className="px-2 py-1 bg-slate-900 border border-white/10 rounded-lg text-[8px] font-mono text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer flex items-center gap-1"
                  >
                    Next <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mt-2.5 justify-center">
                {QUESTIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestionIdx(i)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] transition-all duration-300 cursor-pointer ${
                      i === currentQuestionIdx
                        ? "bg-cyan-500 text-slate-950 font-bold scale-110 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                        : answers[i] !== undefined
                        ? answers[i] === QUESTIONS[i].correct
                          ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                          : "bg-rose-500/20 border border-rose-500/40 text-rose-400"
                        : "bg-slate-900 border border-white/10 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      challengeContent={
        <div className="space-y-4 select-none h-full flex flex-col relative overflow-hidden">
          {/* Flashing Intrusion Overlay */}
          <AnimatePresence>
            {isFlashing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-red-600/35 z-30 pointer-events-none rounded-2xl flex items-center justify-center border border-red-500"
              />
            )}
          </AnimatePresence>

          {/* Main Simulation Sandbox Wrapper - can shake! */}
          <motion.div
            animate={isShaking ? {
              x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
              y: [0, 5, -5, 5, -5, 2, -2, 1, -1, 0]
            } : {}}
            transition={{ duration: 0.65, repeat: isShaking ? Infinity : 0 }}
            className={`grow bg-slate-950/80 border rounded-2xl p-4 flex flex-col justify-between transition-colors duration-300 relative ${
              phase === "normal"
                ? "border-emerald-500/20"
                : phase === "breach"
                ? "border-red-500 bg-red-950/15"
                : "border-red-500/30"
            }`}
          >
            {/* Top State Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${phase === "normal" ? "bg-emerald-400" : "bg-red-500 animate-ping"}`} />
                <span className="font-mono text-[9px] font-bold text-white uppercase tracking-widest">
                  MERCURY_CENTRAL_DB
                </span>
              </div>
              <span className={`font-mono text-[8px] font-bold px-2 py-0.5 rounded-full border ${
                phase === "normal"
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                  : "text-red-400 border-red-500/30 bg-red-500/10 animate-pulse"
              }`}>
                {phase === "normal" ? "● STATUS_SECURE" : "[!] EXPLOITED_ROOT_BREACH"}
              </span>
            </div>

            {/* Flash intruder overlay during breach */}
            {phase === "breach" && (
              <div className="flex-1 flex flex-col items-center justify-center p-3 text-center space-y-2">
                <AlertTriangle className="w-10 h-10 text-red-500 animate-bounce" />
                <h4 className="font-rushblade text-red-500 text-xs font-bold tracking-widest uppercase">
                  OVERWRITING DATA RECORDS
                </h4>
                <p className="font-mono text-[8.5px] text-red-400 animate-pulse">
                  INJECTING FAKE TX AMOUNTS ... BYPASSING FIREWALLS
                </p>
              </div>
            )}

            {/* Transaction Logs */}
            {phase !== "breach" && (
              <div className="space-y-2 flex-1 mt-4">
                <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                  Active Transaction Registers
                </span>
                <div className="space-y-1.5">
                  {currentTransactions.map((tx, idx) => (
                    <div
                      key={tx.id}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 border text-[10px] font-mono transition-all duration-300 ${
                        tx.status === "ok"
                          ? "bg-slate-900/60 border-white/5 text-slate-300"
                          : tx.status === "flagged"
                          ? "bg-red-500/10 border-red-500/40 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.15)] animate-pulse"
                          : "bg-slate-900/20 border-dashed border-white/5 text-slate-600 line-through"
                      }`}
                    >
                      <span className="opacity-40">{tx.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200">{tx.from.split(" ")[1]}</span>
                        <span className="text-slate-500 text-[8px]">➔</span>
                        <span className="font-bold text-slate-200">{tx.to.split(" ")[1]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {tx.status === "flagged" && tx.original !== undefined && (
                          <span className="text-slate-600 line-through text-[9px] font-bold">{tx.original} fuel</span>
                        )}
                        <span className={`font-extrabold ${
                          tx.status === "deleted" ? "text-red-500/70" : tx.status === "flagged" ? "text-red-400" : "text-emerald-400"
                        }`}>
                          {tx.status === "deleted" ? "VAPORIZED" : `${tx.amount} fuel`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Info Banner */}
            <div className="border-t border-white/5 pt-2 mt-3 flex justify-between font-mono text-[8px] text-slate-500">
              <span>LEDGER SYSTEM ID: 0x889A</span>
              <span>TYPE: CENTRAL CLEARING</span>
            </div>
          </motion.div>
        </div>
      }
      labContent={
        <div className="space-y-3 flex-1 flex flex-col justify-between min-h-0 select-none">
          {/* Phase Control Trigger - SIMULATE BREACH */}
          {phase === "normal" && (
            <div className="flex-1 flex flex-col justify-center items-center p-3">
              <button
                onClick={() => setPhase("breach")}
                className="w-full relative overflow-hidden bg-linear-to-r from-red-700 via-rose-600 to-red-700 hover:from-red-600 hover:to-red-600 text-white font-bold py-3.5 rounded-xl text-[10px] font-rushblade tracking-widest cursor-pointer shadow-[0_0_25px_rgba(220,38,38,0.45)] border border-red-500 animate-pulse flex items-center justify-center gap-2 uppercase before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] before:bg-size-[15px_15px]"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 animate-ping" />
                Simulate Database Breach
              </button>
              <p className="text-[9px] font-mono text-slate-500 mt-2 text-center">
                Click to deploy administrative compromise simulation
              </p>
            </div>
          )}

          {phase === "breach" && (
            <div className="grow flex items-center justify-center p-5">
              <div className="text-center space-y-2">
                <span className="w-5 h-5 rounded-full border-2 border-red-500 border-t-transparent animate-spin inline-block" />
                <p className="font-mono text-[9px] text-red-400 animate-pulse uppercase tracking-widest">
                  Compromising database cluster...
                </p>
              </div>
            </div>
          )}

          {/* Investigation Panel - MCQ */}
          {phase === "investigate" && activeQuestion && (
            <div className="flex-1 flex flex-col justify-between min-h-0">
              {/* Question Description */}
              <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Investigate Check</span>
                </div>
                <p className="text-[11px] text-white font-bold leading-relaxed">{activeQuestion.question}</p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2 grow justify-center my-3">
                {activeQuestion.options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrectOpt = i === activeQuestion.correct;

                  let style = "bg-slate-950/60 hover:bg-slate-900 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)]";
                  if (selectedAnswer !== null) {
                    if (isCorrectOpt) style = "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]";
                    else if (isSelected) style = "bg-rose-950/40 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(239,68,68,0.15)]";
                    else style = "bg-slate-950/30 border-white/5 text-slate-600 opacity-50";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={selectedAnswer !== null}
                      className={`text-left border rounded-xl px-4 py-2.5 text-[9.5px] font-mono transition-all flex items-center justify-between gap-2 min-h-[48px] cursor-pointer w-full min-w-0 ${style}`}
                    >
                      <span className="flex-1 wrap-break-word line-clamp-2">{opt}</span>
                      {selectedAnswer !== null && isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      {selectedAnswer !== null && isSelected && !isCorrectOpt && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation underneath the questions (irrespective of answer, proceed button is always visible) */}
              <div className="min-h-[110px] max-h-[145px] overflow-y-auto pr-1">
                <AnimatePresence mode="wait">
                  {selectedAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2.5"
                    >
                      <div
                        className={`rounded-xl p-3 border text-[9.5px] font-mono leading-relaxed ${
                          isCorrect ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300" : "bg-rose-500/10 border-rose-500/25 text-rose-300"
                        }`}
                      >
                        <span className="font-bold uppercase tracking-wider block mb-1">
                          {isCorrect ? "✓ SYSTEM ANALYSIS CONFIRMED" : "✗ ANOMALY OBSERVED"}
                        </span>
                        {activeQuestion.explanation}
                      </div>

                      {/* Always show Proceed button for each subtask, irrespective of the correctness of the answer */}
                      <button
                        onClick={handleNextQuestion}
                        className="w-full flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-2.5 rounded-xl text-[9px] font-rushblade font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] transition uppercase tracking-wider cursor-pointer"
                      >
                        <span>{currentQuestionIdx < QUESTIONS.length - 1 ? "Submit & Next Question" : "Submit & Complete Task"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
