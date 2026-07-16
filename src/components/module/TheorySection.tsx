import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpaceOrganism from "./SpaceOrganism";
import { Database, ShieldAlert, AlertTriangle, Copy, Cpu, Layers, CheckCircle2 } from "lucide-react";

interface TheorySectionProps {
  onComplete: () => void;
}

interface TheorySlide {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconColor: string;
  content: string[];
  note?: string;
  customRender?: React.ReactNode;
}

export default function TheorySection({ onComplete }: TheorySectionProps) {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isNodding, setIsNodding] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);

  const slides: TheorySlide[] = [
    {
      id: 1,
      title: "Centralized Systems",
      subtitle: "Traditional Database Architecture",
      icon: <Database className="w-5 h-5" />,
      iconColor: "#22d3ee",
      content: [
        "Traditional applications commonly use centralized systems.",
        "In a centralized system, one organization or authority controls the database and manages the information stored inside it.",
        "Banks, companies, universities, governments, and online platforms commonly use centralized databases.",
        "Examples of traditional database technologies include MySQL and PostgreSQL.",
        "These databases are fast, efficient, reliable, and extremely useful when the organization controlling the database can be trusted.",
      ],
      note: "Centralized systems are the backbone of today's internet, prioritizing speed and admin control.",
    },
    {
      id: 2,
      title: "The Problem of Trust",
      subtitle: "Why centralization can fall short",
      icon: <ShieldAlert className="w-5 h-5" />,
      iconColor: "#f59e0b",
      content: [
        "Problems can arise when multiple independent parties need to share information but do not completely trust each other.",
        "If one organization controls the central database, every participant must trust that organization to: Store records correctly, protect the database, prevent unauthorized modifications, avoid secretly changing information, and keep the central server online.",
        "If the authority becomes dishonest, compromised, attacked, or unavailable, the entire system may be affected.",
      ],
      note: "Centralization relies on 100% blind trust in the network host.",
    },
    {
      id: 3,
      title: "Single Point of Failure",
      subtitle: "A vulnerability of centralization",
      icon: <AlertTriangle className="w-5 h-5" />,
      iconColor: "#f43f5e",
      content: [
        "A centralized database can create a single point of failure.",
        "If the central server fails, is attacked, becomes unavailable, or has its records manipulated, every participant depending on that server may be affected.",
        "This does not mean centralized databases are bad. It means that systems depending entirely on one central authority inherit all risks associated with that authority.",
      ],
    },
    {
      id: 4,
      title: "Multiple Copies of Records",
      subtitle: "Distributing the ledger",
      icon: <Copy className="w-5 h-5" />,
      iconColor: "#38bdf8",
      content: [
        "One possible approach to reducing dependence on a single authority is allowing multiple independent participants to maintain copies of shared records.",
        "If one copy is secretly modified, differences between records can potentially be detected through verification.",
        "This creates an important idea: Participants should not always need to blindly trust one database owner.",
        "However, simply copying databases is NOT enough to create a blockchain. Blockchain requires additional technologies and consensus mechanisms that we will explore later.",
      ],
      note: "Note: Record comparison is NOT blockchain consensus. True blockchain mechanisms are more complex.",
    },
    {
      id: 5,
      title: "Why Blockchain Was Introduced",
      subtitle: "The decentralization milestone",
      icon: <Cpu className="w-5 h-5" />,
      iconColor: "#818cf8",
      content: [
        "Blockchain technology was introduced to help multiple participants maintain and verify shared records without depending entirely on one central authority.",
        "Blockchain combines several concepts and technologies, including: Distributed records, Cryptography, Hashing, Blocks, Network participation, Transaction verification, and Consensus mechanisms.",
      ],
      note: "Blockchain solves the coordination problem among distrustful parties.",
    },
    {
      id: 6,
      title: "Blockchain vs. Traditional Databases",
      subtitle: "Choosing the right architecture",
      icon: <Layers className="w-5 h-5" />,
      iconColor: "#2dd4bf",
      content: [
        "Choosing between blockchain and a traditional database depends entirely on the specific problem you are solving.",
      ],
      customRender: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 font-mono text-[10px] leading-relaxed">
          <div className="bg-slate-950/80 border border-cyan-500/20 p-3 rounded-lg relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="text-cyan-400 font-bold border-b border-white/5 pb-1.5 mb-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              TRADITIONAL DATABASE
            </div>
            <ul className="space-y-1.5 list-none text-slate-300">
              {["High-performance, low-latency", "Single trusted organization controls state", "Centralized management acceptable", "Ideal for: Banking cores, e-commerce, internal tools"].map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 shrink-0 mt-0.5">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-950/80 border border-teal-500/20 p-3 rounded-lg relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
            <div className="text-teal-400 font-bold border-b border-white/5 pb-1.5 mb-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              BLOCKCHAIN
            </div>
            <ul className="space-y-1.5 list-none text-slate-300">
              {["High security via distributed nodes", "Participants do not fully trust each other", "Records require independent verification", "Ideal for: Multi-party settlement, asset tracking"].map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-teal-400 shrink-0 mt-0.5">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "Mission Analysis Complete!",
      subtitle: "Reviewing flight notes",
      icon: <CheckCircle2 className="w-5 h-5" />,
      iconColor: "#4ade80",
      content: [
        "You investigated the corrupted Space Command Center.",
        "You discovered the risks of depending entirely on one central database.",
        "You learned why trust becomes difficult when independent participants share information.",
        "You discovered how maintaining independent copies can reduce blind dependence on one authority.",
        "And most importantly... You discovered WHY blockchain exists.",
      ],
    },
  ];

  const handleNext = () => {
    setIsNodding(true);
    setShowNextButton(false);
  };

  const onNodFinished = () => {
    setIsNodding(false);
    if (currentSlideIdx < slides.length - 1) {
      setCurrentSlideIdx(currentSlideIdx + 1);
      setShowNextButton(true);
    } else {
      onComplete();
    }
  };

  const activeSlide = slides[currentSlideIdx];
  const progress = ((currentSlideIdx + 1) / slides.length) * 100;

  return (
    <div className="bg-slate-950/70 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Progress bar */}
      <div className="h-0.5 bg-slate-900">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="p-5 relative">
        {/* Slide counter top right */}
        <div className="absolute top-4 right-5 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => i <= currentSlideIdx && setCurrentSlideIdx(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentSlideIdx
                  ? "w-4 h-2 bg-cyan-400"
                  : i < currentSlideIdx
                  ? "w-2 h-2 bg-emerald-500"
                  : "w-2 h-2 bg-slate-700"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* Companion area */}
          <div className="shrink-0 mx-auto md:mx-0 w-20">
            <SpaceOrganism isNodding={isNodding} onNodComplete={onNodFinished} />
          </div>

          {/* Slide content */}
          <div className="flex-1 space-y-4 w-full">
            {/* Icon + title row */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIdx}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Slide header card */}
                <div
                  className="flex items-center gap-3 p-3 rounded-xl border relative overflow-hidden"
                  style={{ borderColor: `${activeSlide.iconColor}25`, background: `linear-gradient(135deg, ${activeSlide.iconColor}10, transparent)` }}
                >
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${activeSlide.iconColor}50, transparent)` }} />
                  <div
                    className="p-2 rounded-lg border shrink-0 theory-icon-glow"
                    style={{ color: activeSlide.iconColor, borderColor: `${activeSlide.iconColor}30`, backgroundColor: `${activeSlide.iconColor}15` }}
                  >
                    {activeSlide.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-none">{activeSlide.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                      {activeSlide.subtitle}
                    </p>
                  </div>
                  {/* Step label */}
                  <div className="ml-auto shrink-0 font-mono text-[9px]" style={{ color: `${activeSlide.iconColor}80` }}>
                    {currentSlideIdx + 1}/{slides.length}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed min-h-[100px]">
                  {activeSlide.content.map((p, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      className="flex items-start gap-2"
                    >
                      <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ backgroundColor: activeSlide.iconColor, opacity: 0.7 }} />
                      {p}
                    </motion.p>
                  ))}

                  {activeSlide.customRender}

                  {activeSlide.note && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: activeSlide.content.length * 0.07 + 0.2 }}
                      className="mt-3 bg-slate-900/60 border border-white/5 p-2.5 rounded-lg text-[10px] text-muted-foreground font-mono flex items-start gap-2"
                    >
                      <span className="text-amber-400 shrink-0">💡</span>
                      <span>{activeSlide.note}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Action button */}
            {showNextButton && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end pt-1"
              >
                <button
                  onClick={handleNext}
                  className="btn-submit-glow px-4 py-2 rounded-lg font-bold text-slate-950 text-[10px] font-mono uppercase tracking-wider shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: activeSlide.iconColor, boxShadow: `0 0 20px ${activeSlide.iconColor}40` }}
                >
                  {currentSlideIdx === slides.length - 1 ? "Unlock Challenge ➔" : "Next Concept ➔"}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
