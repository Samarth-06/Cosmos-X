import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, BookOpen, ChevronRight, Play, ArrowLeft, Cpu, Terminal } from "lucide-react";
import { seedDemoState } from "@/lib/user-store";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

const DOC_SECTIONS = [
  {
    id: "genesis",
    title: "Chapter 1: Genesis",
    planet: "Mercury",
    color: "#00E5FF",
    pages: [
      { id: "cent-vs-decent", title: "Centralization vs. Decentralization", content: "Centralization concentrates command and database state routing within a single coordinator node (e.g. centralized server). Decentralization splits database replication across a distributed network of nodes, avoiding single points of failure." },
      { id: "trustless", title: "The Problem of Trust", content: "Blockchains resolve the double-spend dilemma by using cryptographic consensus instead of middleman verification authorities (banks, clearing houses). This creates a trustless bookkeeping environment." },
    ],
  },
  {
    id: "cryptography",
    title: "Chapter 2: Cryptography",
    planet: "Venus",
    color: "#F59E0B",
    pages: [
      { id: "hashing", title: "Cryptographic Hash Functions", content: "A hash function maps arbitrary size data to a fixed-length string (e.g. SHA-256). Crucial properties: deterministic, collision-resistant, avalanche effect (small input changes cause wild output changes)." },
      { id: "keys", title: "Public & Private Keypairs", content: "Asymmetric cryptography utilizes a private key for digital signature creation and a public key for signature verification. This allows message authentication without revealing the secret." },
    ],
  },
  {
    id: "consensus",
    title: "Chapter 3: Consensus",
    planet: "Earth",
    color: "#10B981",
    pages: [
      { id: "pow-pos", title: "PoW vs. PoS Consensus", content: "Proof-of-Work uses hardware processing difficulty (hashing nonces) to confirm blocks. Proof-of-Stake uses token staking collateral to select validators and prevent network attacks." },
      { id: "stellar-fba", title: "Stellar Consensus Protocol (SCP)", content: "Unlike PoW/PoS, SCP utilizes Federated Byzantine Agreement. Nodes establish trust dynamically through quorum slices, forming global quorums without centralized validator coordinates." },
    ],
  },
];

const GLOSSARY = [
  { term: "Blockchain", def: "A chronological, decentralized chain of cryptographic blocks containing verified transactional ledger records." },
  { term: "Consensus", def: "The process by which distributed validator nodes agree on the validity of incoming ledger transactions." },
  { term: "Double Spending", def: "An attack vector where the same digital asset token is spent twice, resolved by chronological block consensus." },
  { term: "Mempool", def: "A temporary storage node queue where unconfirmed, pending transactions wait to be ordered into blocks." },
  { term: "Private Key", def: "A secret cryptographic key used to sign transactions, proving ownership of wallet addresses." },
  { term: "SHA-256", def: "A secure cryptographic hash algorithm producing a 256-bit (32-byte) message signature output." },
];

function DocsPage() {
  const [selectedPage, setSelectedPage] = useState<string>("cent-vs-decent");
  const [searchQuery, setSearchQuery] = useState("");
  const [glossaryQuery, setGlossaryQuery] = useState("");

  useEffect(() => {
    seedDemoState();
  }, []);

  const activePageObj = DOC_SECTIONS.flatMap((s) => s.pages).find((p) => p.id === selectedPage);
  const activeSection = DOC_SECTIONS.find((s) => s.pages.some((p) => p.id === selectedPage));

  const filteredGlossary = GLOSSARY.filter((g) =>
    g.term.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
    g.def.toLowerCase().includes(glossaryQuery.toLowerCase())
  );

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
              <FileText className="h-3.5 w-3.5" /> Documentation
            </span>
          </div>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
        </div>
      </header>

      {/* Main split view */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 min-h-0">
        
        {/* Left Sidebar navigation (Col-span 3) */}
        <div className="lg:col-span-3 space-y-5 bg-slate-950/40 border border-white/10 rounded-2xl p-4 backdrop-blur-md h-fit max-h-[calc(100vh-140px)] overflow-y-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-secondary">
            <BookOpen className="w-4 h-4" />
            <span>CURRICULUM CHAPTERS</span>
          </div>

          <div className="space-y-4 pt-2">
            {DOC_SECTIONS.map((section) => (
              <div key={section.id} className="space-y-1.5">
                <span
                  style={{ color: section.color }}
                  className="font-mono text-[9px] font-bold uppercase tracking-widest block"
                >
                  {section.title} ({section.planet})
                </span>
                <div className="space-y-0.5 border-l border-white/5 pl-2.5">
                  {section.pages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPage(p.id)}
                      className={`w-full text-left font-display text-xs py-1.5 px-2 rounded-lg transition duration-200 ${
                        selectedPage === p.id
                          ? "bg-white/5 text-secondary font-semibold"
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center content viewer (Col-span 6) */}
        <div className="lg:col-span-6 bg-slate-950/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between h-fit min-h-[400px]">
          {activePageObj && activeSection && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: activeSection.color }}>
                <Cpu className="w-4 h-4" />
                <span>Sector: {activeSection.planet} Docs</span>
              </div>

              <h2 className="font-display text-lg font-bold text-white border-b border-white/5 pb-3">
                {activePageObj.title}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                {activePageObj.content}
              </p>

              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3 text-[10px] text-muted-foreground font-mono leading-relaxed">
                <p className="font-bold text-white uppercase mb-1">PRO-TIP DEVELOPER TELEMETRY:</p>
                To explore this concept practically, return to your dashboard constellation tree map, unlock Sector {activeSection.planet}, and complete the simulator operations.
              </div>
            </div>
          )}

          <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
            <span>COSMOSX ENCYCLOPEDIA v2.10</span>
            <Link
              to="/dashboard"
              className="text-secondary hover:text-cyan-400 transition flex items-center gap-1.5"
            >
              <span>Back to Mission Map</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right Glossary Widget (Col-span 3) */}
        <div className="lg:col-span-3 space-y-4 bg-slate-950/40 border border-white/10 rounded-2xl p-4 backdrop-blur-md h-fit">
          <div className="flex items-center gap-2 text-xs font-mono text-secondary">
            <Terminal className="w-4 h-4" />
            <span>GLOSSARY SYSTEM</span>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={glossaryQuery}
              onChange={(e) => setGlossaryQuery(e.target.value)}
              placeholder="Filter glossary..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-secondary/40 font-mono text-white placeholder-slate-500"
            />
          </div>

          <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredGlossary.map((g, i) => (
              <div key={i} className="space-y-0.5 border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                <span className="font-display text-xs font-bold text-slate-200 block">{g.term}</span>
                <span className="text-[10px] text-muted-foreground leading-snug block font-mono">{g.def}</span>
              </div>
            ))}
            {filteredGlossary.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-[10px] font-mono">
                No matching terms found.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 py-2.5 text-center shrink-0">
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
          COSMOSX CLASSIFIED OPERATIONS UNIT · REFERENCE MANUAL
        </p>
      </footer>
    </div>
  );
}
