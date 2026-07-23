import React from "react";
import { BookOpen, FlaskConical, Terminal, Zap, Cpu } from "lucide-react";

interface TaskWorkspaceLayoutProps {
  moduleColor: string;
  taskTitle: string;
  taskConcept: string;
  theoryTitle?: string;
  theoryContent: React.ReactNode;
  challengeTitle?: string;
  challengeContent: React.ReactNode;
  labTitle?: string;
  labContent: React.ReactNode;
}

export default function TaskWorkspaceLayout({
  moduleColor,
  taskTitle,
  taskConcept,
  theoryTitle = "Theory & Background",
  theoryContent,
  challengeTitle = "Challenge Scenario",
  challengeContent,
  labTitle = "Hands-on Lab",
  labContent,
}: TaskWorkspaceLayoutProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden task-panel-glass rounded-2xl border border-white/8">
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 bg-slate-950/90 shrink-0 select-none relative overflow-hidden"
        style={{ borderLeftColor: moduleColor, borderLeftWidth: "3px" }}
      >
        {/* Subtle header glow */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none"
          style={{ background: `linear-gradient(90deg, ${moduleColor}12, transparent)` }}
        />

        <div
          className="p-2 border rounded-lg shrink-0 relative z-10"
          style={{ backgroundColor: `${moduleColor}15`, borderColor: `${moduleColor}35`, color: moduleColor }}
        >
          <Terminal className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0 relative z-10">
          <h3 className="font-rushblade text-white text-xs tracking-wider uppercase truncate" style={{ textShadow: `0 0 15px ${moduleColor}40` }}>
            {taskTitle}
          </h3>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono mt-0.5">
            Concept: {taskConcept}
          </p>
        </div>

        {/* Right side status badge + live indicator */}
        <div className="flex items-center gap-2 shrink-0 relative z-10">
          <div className="hidden sm:flex items-center gap-1 text-[8px] font-mono" style={{ color: `${moduleColor}90` }}>
            <Cpu className="w-3 h-3" />
            <span>3-PANEL WORKSPACE</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span
            className="text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border flex items-center gap-1.5"
            style={{ color: moduleColor, borderColor: `${moduleColor}40`, backgroundColor: `${moduleColor}10` }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: moduleColor }} />
            Active Lab
          </span>
        </div>
      </div>

      {/* ── 3-PANEL LAYOUT ──────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[34%_33%_33%] divide-y lg:divide-y-0 lg:divide-x divide-white/5 overflow-y-auto lg:overflow-hidden">
        {/* ── LEFT: THEORY ───────────────────────────────────────────── */}
        <div className="flex flex-col min-h-[350px] lg:min-h-0 h-full overflow-hidden panel-theory">
          <div
            className="flex items-center gap-2 px-4 py-2 border-b border-white/5 shrink-0 relative"
            style={{ backgroundColor: `${moduleColor}08` }}
          >
            {/* Colored left accent on panel header */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ backgroundColor: moduleColor, boxShadow: `0 0 8px ${moduleColor}` }} />
            <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: moduleColor }} />
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">{theoryTitle}</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-blue-500 opacity-60" />
              <div className="w-1 h-1 rounded-full bg-blue-500 opacity-40" />
              <div className="w-1 h-1 rounded-full bg-blue-500 opacity-20" />
            </div>
          </div>
          <div className="flex-1 min-w-0 p-4 lg:p-5 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 wrap-break-word">
            {theoryContent}
          </div>
        </div>

        {/* ── CENTER: CHALLENGE ──────────────────────────────────────── */}
        <div className="flex flex-col min-h-[400px] lg:min-h-0 h-full overflow-hidden panel-challenge">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 shrink-0 bg-slate-900/30 relative">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber-500" style={{ boxShadow: '0 0 8px #f59e0b' }} />
            <FlaskConical className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">{challengeTitle}</span>
            <div className="ml-auto">
              <Zap className="w-3 h-3 text-amber-500 opacity-50" />
            </div>
          </div>
          <div className="flex-1 min-w-0 p-4 lg:p-5 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 wrap-break-word">
            {challengeContent}
          </div>
        </div>

        {/* ── RIGHT: HANDS-ON LAB ────────────────────────────────────── */}
        <div className="flex flex-col min-h-[450px] lg:min-h-0 h-full overflow-hidden panel-lab scan-line-overlay">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 shrink-0 bg-slate-900/30 relative">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-500" style={{ boxShadow: '0 0 8px #10b981' }} />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">{labTitle}</span>
            <div className="ml-auto text-[8px] font-mono text-emerald-500 opacity-50 animate-pulse">LIVE</div>
          </div>
          <div className="flex-1 min-w-0 p-4 lg:p-5 overflow-y-auto flex flex-col gap-3 scrollbar-thin data-stream-bg relative z-10 wrap-break-word">
            {labContent}
          </div>
        </div>

      </div>
    </div>
  );
}
