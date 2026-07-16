import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, HelpCircle, ArrowDown } from "lucide-react";
import TaskWorkspaceLayout from "./TaskWorkspaceLayout";
import { saveTaskScore } from "@/lib/module1-store";

interface Props {
  onComplete: () => void;
}

interface Scenario {
  id: number;
  title: string;
  flow: string[];
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  analogy: string;
  complexExplanation: string;
  xpReward: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Scenario 1: Sending ₹5,000 to a friend",
    flow: ["You", "Your Bank", "Payment Network (UPI/SWIFT)", "Friend's Bank", "Friend"],
    question: "How many intermediaries are involved in this transfer?",
    options: ["1 Intermediary", "2 Intermediaries", "3 Intermediaries", "4 Intermediaries"],
    correct: 2,
    explanation: "There are 3 intermediaries: Your Bank, the Payment Network, and the Friend's Bank. Each middleman introduces operational latency, fee cuts, and a single point of failure.",
    analogy: "Imagine mailing a physical letter. You drop it in a mailbox. The local carrier takes it to a sorting hub, who ships it to a cargo transport, who delivers it to your friend's post office. That's a chain of middlemen you must trust — and every link can fail.",
    complexExplanation: "In digital banking, databases are siloed per institution. To route funds, banks pass settlement ledger requests through centralized switches like SWIFT or UPI, adding operational overhead, clearing times, and multiple trust dependencies.",
    xpReward: 3,
  },
  {
    id: 2,
    title: "Scenario 2: Buying a book online",
    flow: ["You", "Amazon Platform", "Payment Gateway (Razorpay)", "Your Bank", "Seller's Bank", "Seller"],
    question: "Who ultimately controls whether the seller gets paid?",
    options: ["Your Bank", "Amazon Platform", "The Seller", "Razorpay Payment Gateway"],
    correct: 1,
    explanation: "Amazon controls the trade matchmaking database. They hold escrow custody and have root permissions to hold, block, or reverse payouts unilaterally — without needing your approval.",
    analogy: "Imagine trading toys at a schoolyard but a supervisor stands in the middle holding both toys, deciding who gets what. If the supervisor takes a dislike to your trade, they can cancel it instantly.",
    complexExplanation: "Centralized e-commerce platforms act as trusted clearing brokers. They hold database state locks on purchases, creating dependency risks where merchants are at the mercy of unilateral updates to platform policy.",
    xpReward: 3,
  },
  {
    id: 3,
    title: "Scenario 3: Posting a photo on social media",
    flow: ["You", "Instagram Servers", "CDN Gateway", "Followers' Feed"],
    question: "Who can delete your photo at any time without your consent?",
    options: ["Your followers", "The government only", "Meta / Instagram Platform", "Nobody, it is mine"],
    correct: 2,
    explanation: "Meta owns and hosts the database. When you agree to the Terms of Service, you transfer actual physical custody of your media to their centralized server arrays — permanently.",
    analogy: "Imagine writing a poem on a public bulletin board in a shopping mall. You wrote the poem, but the mall management owns the bulletin board and can paint over it anytime they like.",
    complexExplanation: "Centralized content architectures use proprietary cloud storage buckets. Since node write access is strictly gatekept by server owners, your data is rent-hosted rather than peer-owned.",
    xpReward: 3,
  },
  {
    id: 4,
    title: "Scenario 4: Storing files in the cloud",
    flow: ["You", "Google Drive Cloud Engine", "Storage Server Cluster", "Your Device"],
    question: "What happens if the cloud platform suspends your account?",
    options: [
      "You receive a 30-day recovery grace period",
      "You lose access to all your files immediately",
      "Your documents are auto-transferred to local storage",
      "The database decrypts files to offline modes"
    ],
    correct: 1,
    explanation: "If account keys are blocked on centralized servers, you lose read/write rights to your files instantly — because the database is not on your machine.",
    analogy: "Imagine keeping your physical diary locked inside a safe at a commercial bank vault. If the bank locks its front doors, you can't read your own writing until they decide to let you in.",
    complexExplanation: "Cloud storage relies on centralized identity providers (IdPs). If your credentials are invalidated on their directory servers, all authorization tokens to downstream buckets expire immediately.",
    xpReward: 3,
  },
  {
    id: 5,
    title: "Scenario 5: Cross-Border Wire (India → USA)",
    flow: ["You", "Local Bank Branch", "SWIFT Network Engine", "Correspondent Clearing Node", "Recipient Bank", "Recipient"],
    question: "How long does a cross-border bank transfer typically take to clear?",
    options: ["Instantaneous real-time update", "2–5 business days", "24-hour fixed delay", "1 business week minimum"],
    correct: 1,
    explanation: "SWIFT routing relies on correspondent banking grids. Each node in the chain checks compliance and settles assets manually, requiring 2–5 business days and collecting fees at every hop.",
    analogy: "Imagine passing a message down a line of 10 people in different languages. Each person must translate the message, write it down, and hand it to the next. Delays and translation fees accumulate at every step.",
    complexExplanation: "Without a global shared distributed ledger, banks settle balances using double-entry bookkeeping. Reconciliation requires sequential ledger checks across international jurisdictions — each adding delay and cost.",
    xpReward: 3,
  },
];

// Helper to highlight blockchain keywords inline
function KW({ children }: { children: string }) {
  return (
    <span className="text-cyan-400 font-bold font-mono">{children}</span>
  );
}

function Quote({ children }: { children: string }) {
  return (
    <div className="border-l-2 border-amber-500/60 pl-3 my-1">
      <p className="italic text-amber-200/80 text-[9.5px] font-sans leading-relaxed">"{children}"</p>
    </div>
  );
}

export default function Task1_1_MiddlemanMapper({ onComplete }: Props) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [allDone, setAllDone] = useState(false);

  const scenario = SCENARIOS[currentScenario];
  const selected = selections[currentScenario] !== undefined ? selections[currentScenario] : null;
  const isCorrect = selected === scenario.correct;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelections((prev) => ({ ...prev, [currentScenario]: idx }));
  };

  const handleNext = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario((n) => n + 1);
    } else {
      setAllDone(true);
    }
  };

  const handlePrev = () => {
    if (currentScenario > 0) {
      setCurrentScenario((n) => n - 1);
    }
  };

  const totalScore = SCENARIOS.reduce((acc, sc, idx) => {
    return acc + (selections[idx] === sc.correct ? sc.xpReward : 0);
  }, 0);

  if (allDone) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-4 bg-slate-950/20 rounded-2xl border border-white/10 select-none">
        <div className="max-w-md w-full bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl text-center space-y-4 backdrop-blur-md">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto animate-bounce text-base">
            🗺️
          </div>
          <div>
            <h3 className="font-rushblade text-cyan-400 text-sm tracking-widest uppercase">
              INTERMEDIARY ANALYSIS SECURED
            </h3>
            <p className="text-white font-mono text-[9px] mt-1 uppercase tracking-wider">
              Centralized Dependency Nodes: <span className="text-cyan-400 font-bold">12 Cleared</span>
            </p>
          </div>
          <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3.5 text-[10px] text-slate-300 leading-relaxed text-left font-mono">
            <span className="text-amber-400 font-bold">SYSTEM REPORT: </span>
            Every digital transaction relies on centralized <KW>databases</KW> owned by third parties. They introduce <KW>single points of failure</KW>, delays, and transaction friction. <KW>Blockchain</KW> removes the necessity for these <KW>intermediaries</KW> by establishing a peer-to-peer <KW>consensus</KW> network.
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono text-[10px]">
            <span className="text-slate-400">Score: <span className="text-emerald-400 font-bold">{totalScore} / 15 XP</span></span>
            <button
              onClick={() => {
                saveTaskScore("task1_1", totalScore, 15, true);
                onComplete();
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-full text-[9px] font-rushblade shadow-[0_0_15px_rgba(6,182,212,0.25)] transition uppercase tracking-wider"
            >
              Proceed to Task 1.2 ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TaskWorkspaceLayout
      moduleColor="#22d3ee"
      taskTitle="Task 1.1 — Map the Middlemen"
      taskConcept="Centralized dependencies and trust"
      theoryContent={
        <div className="space-y-4 text-[10.5px] leading-relaxed text-slate-300 select-text">
          {/* Glowing Section Title */}
          <div className="border-b border-cyan-500/20 pb-2">
            <span className="font-mono text-[8px] text-cyan-400 uppercase tracking-widest font-bold">UNDERSTANDING MIDDLEMEN</span>
            <h4 className="font-rushblade text-white text-xs tracking-wider uppercase mt-0.5 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
              Centralized Custody
            </h4>
          </div>

          {/* Simple Explanation — starts easy */}
          <div className="bg-slate-900/50 border border-amber-500/20 rounded-2xl p-3 space-y-2">
            <span className="font-mono text-[8.5px] text-amber-400 font-bold uppercase tracking-wider block">🟡 Real-World Analogy</span>
            <Quote>{scenario.analogy}</Quote>
          </div>

          {/* Mid-level explanation */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-3 space-y-1.5">
            <span className="font-mono text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block">📌 What's happening here?</span>
            <p className="font-sans text-slate-300">
              Every digital system you rely on — banking, social media, cloud storage — is controlled by a <KW>central server</KW>.
              You don't own your data; you <em>rent</em> access to it. That central node is the <KW>intermediary</KW>.
            </p>
          </div>

          {/* Complex Technical Explanation — gets harder */}
          <div className="bg-slate-900/40 border border-cyan-500/10 rounded-2xl p-3 space-y-2">
            <span className="font-mono text-[8.5px] text-cyan-400 font-bold uppercase tracking-wider block">🔬 Technological Deep Dive</span>
            <p className="font-sans text-slate-300">
              {scenario.complexExplanation}
            </p>
            <p className="font-sans text-slate-400 text-[9.5px]">
              Without a unified, shared <KW>peer-to-peer ledger</KW>, transactions remain bound to proprietary clearinghouses. This delegates total systemic control to central server nodes, granting them absolute <KW>censorship</KW> and write privileges.
            </p>
          </div>

          {/* Scenario Navigator */}
          <div className="border border-white/10 bg-slate-950/60 p-3 rounded-2xl select-none">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-widest font-bold">Scenario Navigator</span>
              <div className="flex gap-1.5">
                <button
                  disabled={currentScenario === 0}
                  onClick={handlePrev}
                  className="px-2.5 py-1 bg-slate-900 border border-white/10 rounded-lg text-[8px] font-mono text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-30 transition cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-2.5 h-2.5" /> Back
                </button>
                <button
                  disabled={currentScenario === SCENARIOS.length - 1}
                  onClick={handleNext}
                  className="px-2.5 py-1 bg-slate-900 border border-white/10 rounded-lg text-[8px] font-mono text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-30 transition cursor-pointer flex items-center gap-1"
                >
                  Next <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              {SCENARIOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentScenario(i)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] transition-all duration-300 cursor-pointer ${
                    i === currentScenario
                      ? "bg-cyan-500 text-slate-950 font-bold scale-110 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                      : selections[i] !== undefined
                      ? selections[i] === SCENARIOS[i].correct
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
        </div>
      }
      challengeContent={
        <div className="space-y-4 select-none">
          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4">
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-1.5 font-bold">Active Case Study</span>
            <h4 className="text-[12.5px] text-white font-bold leading-snug">{scenario.title}</h4>
          </div>

          {/* VERTICAL TRANSACTION FLOW — highlighted active intermediary nodes */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/10 flex flex-col items-center">
            <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest block mb-4">Vertical Pipeline Flow</span>

            <div className="flex flex-col items-center w-full">
              {scenario.flow.map((node, i) => {
                const isEndpoint = i === 0 || i === scenario.flow.length - 1;
                const isIntermediary = !isEndpoint;
                const isHighlighted = isIntermediary && selected !== null;

                return (
                  <div key={i} className="flex flex-col items-center w-full">
                    {/* Node Box */}
                    <motion.div
                      animate={isHighlighted ? { scale: [1, 1.04, 1] } : {}}
                      transition={{ duration: 1.2, repeat: isHighlighted ? Infinity : 0 }}
                      className={`w-[88%] min-w-0 py-2 px-3 rounded-2xl text-[10px] font-mono font-bold border transition-all duration-400 ${
                        isEndpoint
                          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                          : isHighlighted
                          ? "bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.3)]"
                          : "bg-slate-900 border-white/5 text-slate-400"
                      }`}
                    >
                      <div className="flex justify-between items-center px-1 gap-2 w-full min-w-0">
                        <span className="opacity-40 text-[8px] font-mono shrink-0">0{i + 1}</span>
                        <span className="truncate flex-1 text-center min-w-0">{node}</span>
                        <span className="text-[8px] shrink-0">
                          {i === 0 ? "SND" : i === scenario.flow.length - 1 ? "REC" : "MID"}
                        </span>
                      </div>
                    </motion.div>

                    {/* Connecting Pipe */}
                    {i < scenario.flow.length - 1 && (
                      <div className="py-1.5 flex flex-col items-center select-none">
                        <div className="w-[1.5px] h-3.5 bg-linear-to-b from-cyan-500/40 to-slate-800" />
                        <ArrowDown className="w-3 h-3 text-cyan-500/50 -mt-1.5 shrink-0" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-amber-400 border border-amber-500/20 bg-amber-500/5 py-1.5 px-3 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span>{scenario.flow.length - 2} Intermediary Path Node{scenario.flow.length - 2 === 1 ? "" : "s"} Detected</span>
            </div>
          </div>
        </div>
      }
      labContent={
        <div className="space-y-3 flex-1 flex flex-col justify-between min-h-0 select-none">

          {/* Question card */}
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Consensus Check</span>
            </div>
            <p className="text-[11.5px] text-white font-bold leading-relaxed">{scenario.question}</p>
          </div>

          {/* Options as flashcard-style buttons */}
          <div className="flex flex-col gap-2 grow justify-center">
            {scenario.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectOpt = i === scenario.correct;

              let style = "bg-slate-950/60 hover:bg-slate-900 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)]";
              if (selected !== null) {
                if (isCorrectOpt) style = "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]";
                else if (isSelected) style = "bg-rose-950/40 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]";
                else style = "bg-slate-950/30 border-white/5 text-slate-600 opacity-50";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`text-left border rounded-2xl px-4 py-2.5 text-[10px] font-mono transition-all flex items-center justify-between gap-2 min-h-[48px] cursor-pointer w-full min-w-0 ${style}`}
                >
                  <span className="flex-1 wrap-break-word line-clamp-2">{opt}</span>
                  {selected !== null && isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {selected !== null && isSelected && !isCorrectOpt && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation + Proceed — appears after selecting */}
          <div className="min-h-[105px] max-h-[145px] overflow-y-auto pr-1">
            <AnimatePresence mode="wait">
              {selected !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-2.5"
                >
                  <div
                    className={`rounded-2xl p-3 border text-[9.5px] font-mono leading-relaxed ${
                      isCorrect ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300" : "bg-rose-500/10 border-rose-500/25 text-rose-300"
                    }`}
                  >
                    <span className="font-bold uppercase tracking-wider block mb-1">
                      {isCorrect ? "✓ SYSTEM ANALYSIS APPROVED" : "✗ MISMATCH DETECTED"}
                    </span>
                    {scenario.explanation}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-2.5 rounded-2xl text-[9px] font-rushblade font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] transition uppercase tracking-wider cursor-pointer"
                  >
                    <span>{currentScenario < SCENARIOS.length - 1 ? "Submit & Next Scenario" : "Submit & Complete Task"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      }
    />
  );
}
