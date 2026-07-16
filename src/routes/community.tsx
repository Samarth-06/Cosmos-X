import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, Globe, ArrowLeft, Send, Sparkles, Trophy, Share2, Shield, Calendar } from "lucide-react";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import { seedDemoState } from "@/lib/user-store";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
});

const GUILDS = [
  { id: "g1", name: "Stellar Cartographers", motto: "Mapping the outer ledger grids.", members: 1420, rank: "#1", level: 24, logo: "🧭" },
  { id: "g2", name: "Soroban Architects", motto: "Rust & WASM compilations.", members: 980, rank: "#2", level: 19, logo: "🤖" },
  { id: "g3", name: "Hash Crusaders", motto: "Unlocking cryptographic keys.", members: 750, rank: "#3", level: 15, logo: "🔐" },
  { id: "g4", name: "Anchor Fleet", motto: "Building liquidity bridges.", members: 512, rank: "#4", level: 12, logo: "⚓" },
];

const FORUM_POSTS = [
  { id: "p1", author: "NovaStellar", role: "Galaxy Master", title: "How to optimize fee bids in the Mars Gas War challenge", likes: 84, comments: 22, tag: "Guide" },
  { id: "p2", author: "SorobanDev", role: "Astronaut", title: "Deploying Rust smart contracts in sandboxed container environments", likes: 52, comments: 14, tag: "Tech" },
  { id: "p3", author: "ConsensusKing", role: "Navigator", title: "Understanding SCP Quorum Slices: Simple visual breakdown", likes: 41, comments: 9, tag: "Theory" },
  { id: "p4", author: "CosmicCadet", role: "Cadet", title: "Why does the SHA-256 hash output look completely random?", likes: 12, comments: 18, tag: "Question" },
];

const COMMUNITY_EVENTS = [
  { id: "e1", title: "Stellar Consensus Hackathon", date: "July 24, 2026", type: "Competition", reward: "+1500 XP & Rare Badge" },
  { id: "e2", title: "Soroban Smart Contract Audit Meetup", date: "August 2, 2026", type: "Live Lab", reward: "+500 XP" },
];

function CommunityPage() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Cadet: establishing connection node...",
    "SorobanDev: deployed contract on simulated Jupiter node successfully!",
    "CryptoKnight: Mercury escape room Timed run completed in 1m 42s!",
    "NovaStellar: welcome all new explorers! Let's reach Neptune.",
  ]);

  useEffect(() => {
    seedDemoState();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages((prev) => [...prev, `You: ${newMessage}`]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,white_0.7px,transparent_0.7px)] bg-[size:22px_22px] opacity-[0.07] z-0" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-base font-semibold">
              Cosmos<span className="text-secondary">X</span>
            </Link>
            <span className="text-white/20">/</span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> Community
            </span>
          </div>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10">
        
        {/* Left Column: Guilds & Forum Posts (Col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Guilds section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-white tracking-wider uppercase">Active Explorer Guilds</h2>
              <span className="font-mono text-[9px] text-muted-foreground">Cooperative Operations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GUILDS.map((g) => (
                <div key={g.id} className="bg-slate-950/40 border border-white/8 rounded-2xl p-4 backdrop-blur-md flex items-start gap-3.5 hover:border-white/15 transition">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                    {g.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-[13px] font-bold text-white truncate">{g.name}</h3>
                      <span className="rounded bg-secondary/10 px-1 py-0.2 font-mono text-[8px] text-secondary">
                        Lvl {g.level}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{g.motto}</p>
                    <div className="flex items-center justify-between mt-3 font-mono text-[9px] text-muted-foreground border-t border-white/5 pt-2">
                      <span>{g.members} members</span>
                      <span className="text-secondary font-bold">Rank {g.rank}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social share card builder */}
          <div className="bg-gradient-to-r from-cyan-950/20 via-slate-900/60 to-purple-950/20 border border-cyan-500/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.05)]">
            <div className="flex items-center gap-2 text-xs font-mono text-secondary mb-2">
              <Share2 className="w-4 h-4" />
              <span>SHARE TELEMETRY CARD</span>
            </div>
            <h3 className="font-display text-sm font-bold text-white mb-1">Generate Verified Certificate</h3>
            <p className="text-xs text-muted-foreground max-w-lg mb-4">
              Export your on-chain verified completion status as a social share graphic mapped to your real Stellar credentials.
            </p>
            <div className="flex gap-2">
              <button className="bg-secondary text-background font-bold text-xs px-4 py-2 rounded-xl hover:brightness-110 transition flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                Generate Certificate
              </button>
              <button className="bg-white/5 border border-white/10 text-slate-300 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-white/10 transition">
                LinkedIn Export
              </button>
            </div>
          </div>

          {/* Forum posts */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-white tracking-wider uppercase">General Communications</h2>
              <span className="font-mono text-[9px] text-muted-foreground">Mission Logs</span>
            </div>
            <div className="space-y-3">
              {FORUM_POSTS.map((post) => (
                <div key={post.id} className="bg-slate-950/40 border border-white/8 rounded-2xl p-4 backdrop-blur-md hover:bg-slate-950/60 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[12px] font-bold text-slate-200">{post.author}</span>
                      <span className="text-[9px] font-mono text-muted-foreground">({post.role})</span>
                    </div>
                    <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[8px] text-muted-foreground">
                      {post.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white hover:text-secondary cursor-pointer transition mb-3">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 font-mono text-[9px] text-muted-foreground">
                    <button className="hover:text-rose-400 transition flex items-center gap-1">
                      <span>♥</span> {post.likes}
                    </button>
                    <button className="hover:text-secondary transition flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {post.comments} comments
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Ticker & Chat Comms (Col-span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Chat Comms Box */}
          <div className="bg-slate-950/40 border border-white/8 rounded-2xl p-4 backdrop-blur-md flex flex-col h-[320px]">
            <div className="flex items-center gap-1.5 text-xs font-mono text-secondary border-b border-white/5 pb-2.5 mb-3">
              <Globe className="w-4 h-4 animate-pulse" />
              <span>SECURE OPERATIONS CHAT</span>
            </div>

            {/* Chat message feed */}
            <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-[10px] text-slate-300 pr-1 select-text">
              {messages.map((m, i) => (
                <div key={i} className="leading-relaxed border-l border-white/5 pl-2.5">
                  {m}
                </div>
              ))}
            </div>

            {/* Chat Send */}
            <form onSubmit={handleSendMessage} className="mt-3 flex gap-2 pt-2 border-t border-white/5">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type signal..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-secondary/40 font-mono text-white placeholder-slate-500"
              />
              <button
                type="submit"
                className="bg-secondary text-background p-2.5 rounded-xl hover:brightness-110 transition flex items-center justify-center focus:outline-none"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
              </button>
            </form>
          </div>

          {/* Live Activity Ticker */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Live Telemetry</span>
              <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> LIVE
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-slate-900/60 to-[#040816]/80">
              <LiveActivityFeed maxItems={6} />
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-slate-950/40 border border-white/8 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-xs font-mono text-secondary border-b border-white/5 pb-2.5 mb-3">
              <Calendar className="w-4 h-4" />
              <span>COSMIC EVENTS</span>
            </div>
            <div className="space-y-3">
              {COMMUNITY_EVENTS.map((e) => (
                <div key={e.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-bold text-white">{e.title}</span>
                    <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 font-mono text-[7px] text-amber-400">
                      {e.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground">
                    <span>{e.date}</span>
                    <span>Reward: {e.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 py-2.5 text-center shrink-0">
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
          COSMOSX CLASSIFIED OPERATIONS UNIT · COMMUNITY FORUMS
        </p>
      </footer>
    </div>
  );
}
