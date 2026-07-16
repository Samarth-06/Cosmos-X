import { motion } from "framer-motion";
import { Play, Rocket, Shield, ArrowRight } from "lucide-react";

interface Props {
  moduleId: number;
  moduleTitle: string;
  moduleTheory: string;
  rocketComponent: string;
  tasks: { id: string; title: string; concept: string }[];
  moduleColor: string;
  onStart: () => void;
}

export default function ModuleIntroCard({
  moduleId,
  moduleTitle,
  moduleTheory,
  rocketComponent,
  tasks,
  moduleColor,
  onStart,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl max-h-full bg-slate-950/80 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl overflow-hidden flex flex-col">
        {/* Subtle accent glow line at the top */}
        <div
          className="absolute top-0 inset-x-0 h-1 z-20"
          style={{ backgroundColor: moduleColor }}
        />

        {/* Sticky Header */}
        <div className="flex justify-between items-start p-6 pb-4 border-b border-white/5 bg-slate-950/90 z-10 shrink-0">
            <div className="space-y-1">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-widest"
                style={{
                  borderColor: `${moduleColor}30`,
                  color: moduleColor,
                  background: `${moduleColor}08`,
                }}
              >
                <Shield className="w-3 h-3" />
                MODULE {String(moduleId).padStart(2, "0")} INTRO
              </div>
              <h2 className="font-rushblade text-white text-base tracking-wider mt-2">
                {moduleTitle}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                Target Payload
              </span>
              <span
                className="font-mono text-[11px] font-bold mt-0.5 inline-block"
                style={{ color: moduleColor }}
              >
                {rocketComponent}
              </span>
            </div>
          </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin">
          {/* Module Theory */}
          <div className="space-y-3 border-l-2 pl-4 py-1" style={{ borderColor: moduleColor }}>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Operational Blueprint
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium whitespace-pre-wrap">
              {moduleTheory}
            </p>
          </div>

          {/* Tasks list checklist */}
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 space-y-3">
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between">
              <span>Required Sub-tasks ({tasks.length})</span>
              <span>Est. time: {tasks.length * 4} mins</span>
            </div>
            <div className="grid gap-2">
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 bg-slate-950/60 border border-white/5 px-3 py-2 rounded-lg"
                >
                  <div
                    className="w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[9px] font-bold shrink-0"
                    style={{
                      borderColor: `${moduleColor}30`,
                      color: moduleColor,
                      backgroundColor: `${moduleColor}08`,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-200 font-semibold truncate">
                      {task.title.replace(/Task \d\.\d\s+—\s+/i, "")}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono tracking-wide truncate">
                      {task.concept}
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-slate-600 uppercase">
                    standby
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <Rocket className="w-3.5 h-3.5 text-cyan-400" />
              <span>Complete all checkpoints to unlock rocket assembly</span>
            </div>
            <button
              onClick={onStart}
              style={{
                backgroundColor: `${moduleColor}20`,
                borderColor: `${moduleColor}50`,
              }}
              className="group flex items-center gap-2 border text-white font-bold px-5 py-2 rounded-full text-xs font-rushblade tracking-wider transition-all hover:brightness-110 active:scale-95 shadow-md cursor-pointer"
            >
              Initialize Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
