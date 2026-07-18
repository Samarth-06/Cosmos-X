import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronRight, CircleDot, Command, RotateCcw, TerminalSquare } from "lucide-react";

export type TerminalMissionId =
  | "ledger-audit"
  | "hash-fingerprint"
  | "signal-integrity"
  | "block-header";

type TerminalTone = "command" | "output" | "success" | "error" | "warning" | "muted";

interface TerminalLine {
  id: number;
  text: string;
  tone: TerminalTone;
}

interface LabAccount {
  name: string;
  network: "testnet" | "mainnet";
  publicKey: string;
}

interface TerminalState {
  network: "testnet" | "mainnet";
  accounts: LabAccount[];
  auditedLedger: boolean;
  calculatedBalances: boolean;
  hashedInput: boolean;
  auditedSignals: boolean;
  hashedHeader: boolean;
}

export interface CosmosTerminalProps {
  mission: TerminalMissionId;
  accent: string;
  onObjectiveComplete?: () => void;
  compact?: boolean;
}

interface MissionCopy {
  label: string;
  title: string;
  objective: string;
  hint: string;
  starter: string[];
}

export const TERMINAL_MISSIONS: Record<TerminalMissionId, MissionCopy> = {
  "ledger-audit": {
    label: "Ledger replay",
    title: "Oxygen Ledger Audit",
    objective: "Inspect the append-only ledger, then derive balances from its history.",
    hint: "Start with `ledger audit oxygen`, then run `ledger balances`.",
    starter: [
      "COSMOS TERMINAL // SIMULATION PROVIDER ONLINE",
      "Mission data staged. This terminal never submits a real transaction.",
    ],
  },
  "hash-fingerprint": {
    label: "Cryptographic fingerprint",
    title: "SHA-256 Calibration",
    objective: "Hash the supplied telemetry string and inspect its fixed-length digest.",
    hint: 'Try `hash "Blockchain is secure"`.',
    starter: [
      "HASHING MODULE READY // SHA-256 SIMULATION",
      "A digest is calculated locally in your browser; no data leaves this lab.",
    ],
  },
  "signal-integrity": {
    label: "Integrity audit",
    title: "Alien Signal Checksum",
    objective: "Compare the received messages against their expected fingerprints.",
    hint: "Run `signal audit`, then `signal verify 4` once you identify the mismatch.",
    starter: [
      "INBOUND SIGNAL BUFFER MOUNTED",
      "Four messages received. One has been altered in transit.",
    ],
  },
  "block-header": {
    label: "Block sealing",
    title: "Header Hash Lab",
    objective: "Inspect a block header and hash the complete header payload.",
    hint: "Run `block inspect`, then `block hash`.",
    starter: [
      "BLOCK ASSEMBLY SANDBOX INITIALIZED",
      "Header fields are ready to seal into one tamper-evident fingerprint.",
    ],
  },
};

const INITIAL_STATE: TerminalState = {
  network: "testnet",
  accounts: [],
  auditedLedger: false,
  calculatedBalances: false,
  hashedInput: false,
  auditedSignals: false,
  hashedHeader: false,
};

const tokenize = (value: string) => value.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((part) => part.replace(/^"|"$/g, "")) ?? [];

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function makePublicKey(name: string) {
  const body = name.toUpperCase().replace(/[^A-Z0-9]/g, "").padEnd(34, "X").slice(0, 34);
  return `G${body}SIMULATEDKEY`;
}

function line(id: number, text: string, tone: TerminalTone = "output"): TerminalLine {
  return { id, text, tone };
}

export default function CosmosTerminal({ mission, accent, onObjectiveComplete, compact = false }: CosmosTerminalProps) {
  const copy = TERMINAL_MISSIONS[mission];
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [state, setState] = useState<TerminalState>(INITIAL_STATE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const nextLine = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const completionFired = useRef(false);

  const append = (entries: Array<{ text: string; tone?: TerminalTone }>) => {
    setLines((current) => [
      ...current,
      ...entries.map((entry) => line(nextLine.current++, entry.text, entry.tone)),
    ]);
  };

  const completeObjective = (nextState: TerminalState) => {
    const complete =
      (mission === "ledger-audit" && nextState.auditedLedger && nextState.calculatedBalances) ||
      (mission === "hash-fingerprint" && nextState.hashedInput) ||
      (mission === "signal-integrity" && nextState.auditedSignals) ||
      (mission === "block-header" && nextState.hashedHeader);

    if (complete && !completionFired.current) {
      completionFired.current = true;
      setIsComplete(true);
      append([{ text: "✓ MISSION OBJECTIVE COMPLETED — state checkpoint verified.", tone: "success" }]);
      onObjectiveComplete?.();
    }
  };

  const reset = () => {
    nextLine.current = 0;
    completionFired.current = false;
    setInput("");
    setHistory([]);
    setHistoryIndex(-1);
    setState(INITIAL_STATE);
    setIsComplete(false);
    setLines([
      ...copy.starter.map((text) => line(nextLine.current++, text, "muted")),
      line(nextLine.current++, `OBJECTIVE: ${copy.objective}`, "warning"),
      line(nextLine.current++, `HINT: ${copy.hint}`, "output"),
    ]);
  };

  useEffect(() => {
    reset();
    // The mission is a distinct temporary lab session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [lines, isProcessing]);

  const run = async (raw: string) => {
    const command = raw.trim();
    if (!command || isProcessing) return;

    setInput("");
    setHistory((current) => [command, ...current.filter((item) => item !== command)].slice(0, 30));
    setHistoryIndex(-1);
    append([{ text: `learner@cosmos-lab:~$ ${command}`, tone: "command" }]);

    const tokens = tokenize(command);
    const [program = "", subcommand = "", action = "", ...args] = tokens;
    const lowerProgram = program.toLowerCase();
    const lowerSub = subcommand.toLowerCase();
    const lowerAction = action.toLowerCase();

    if (lowerProgram === "clear") {
      setLines([]);
      return;
    }
    if (lowerProgram === "reset") {
      reset();
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 220));

    try {
      if (lowerProgram === "help" || command === "cosmos --help") {
        append([{ text: `COSMOS TERMINAL — SIMULATED LEARNING ENVIRONMENT\n\nCore commands:\n  help                       Show this command guide\n  status                     Inspect temporary session state\n  clear | Ctrl+L             Clear terminal output\n  reset                      Start this mission again\n\nMission commands:\n  ${mission === "ledger-audit" ? "ledger audit oxygen\n  ledger balances" : mission === "hash-fingerprint" ? 'hash "Blockchain is secure"' : mission === "signal-integrity" ? "signal audit\n  signal verify <index>" : "block inspect\n  block hash"}\n\nPractice commands:\n  stellar --version\n  stellar network list\n  stellar keys generate <alias> --network testnet\n  stellar keys list`, tone: "output" }]);
      } else if (lowerProgram === "status") {
        append([{ text: `SIMULATION STATUS\n  network: ${state.network}\n  accounts: ${state.accounts.length}\n  completed actions: ${[
          state.auditedLedger && "ledger audited",
          state.calculatedBalances && "balances replayed",
          state.hashedInput && "digest generated",
          state.auditedSignals && "signal checked",
          state.hashedHeader && "header sealed",
        ].filter(Boolean).join(", ") || "none"}\n  real network activity: none`, tone: "output" }]);
      } else if (lowerProgram === "stellar") {
        if (lowerSub === "--version") {
          append([{ text: "stellar 23.1.0 (CosmosX simulation)\nStellar CLI-compatible learning commands", tone: "output" }]);
        } else if (lowerSub === "network" && lowerAction === "list") {
          append([{ text: "NETWORK     PASSPHRASE\n────────────────────────────────────────────────\ntestnet     Test SDF Network ; September 2015\nmainnet     Public Global Stellar Network ; September 2015", tone: "output" }]);
        } else if (lowerSub === "keys" && lowerAction === "generate") {
          const alias = args[0];
          const flagIndex = args.findIndex((item) => item === "--network");
          const network = flagIndex >= 0 ? args[flagIndex + 1] : "testnet";
          if (!alias) {
            append([{ text: "error: missing required argument <alias>\nUsage: stellar keys generate <alias> --network testnet", tone: "error" }]);
          } else if (network !== "testnet" && network !== "mainnet") {
            append([{ text: `error: unknown network '${network}'\nAvailable networks:\n  testnet\n  mainnet\nHint: this lab uses testnet.`, tone: "error" }]);
          } else if (state.accounts.some((account) => account.name === alias)) {
            append([{ text: `error: account alias '${alias}' already exists in this session`, tone: "error" }]);
          } else {
            const account: LabAccount = { name: alias, network, publicKey: makePublicKey(alias) };
            const next = { ...state, accounts: [...state.accounts, account] };
            setState(next);
            append([{ text: `✓ Keypair generated in simulation\n✓ Account alias: ${alias}\n✓ Network: ${network}\n\nPublic Key:\n${account.publicKey}\n\nNo account was created on a live network.`, tone: "success" }]);
          }
        } else if (lowerSub === "keys" && lowerAction === "list") {
          const accounts = state.accounts.length
            ? state.accounts.map((account) => `${account.name.padEnd(14)} ${account.network.padEnd(9)} ${account.publicKey}`).join("\n")
            : "(no keys generated in this temporary session)";
          append([{ text: `ALIAS          NETWORK   PUBLIC KEY\n${accounts}`, tone: "output" }]);
        } else {
          append([{ text: `error: unsupported stellar command '${tokens.slice(1).join(" ") || ""}'\nRun: stellar --version\nOr: help`, tone: "error" }]);
        }
      } else if (lowerProgram === "ledger") {
        if (lowerSub === "audit" && lowerAction === "oxygen") {
          const next = { ...state, auditedLedger: true };
          setState(next);
          completeObjective(next);
          append([{ text: "APPEND-ONLY OXYGEN LEDGER\n[Tx 0] Genesis → Mint 1000 Oxygen to Station_Alpha\n[Tx 1] Station_Alpha → Send 300 Oxygen to Station_Beta\n[Tx 2] Station_Alpha → Send 200 Oxygen to Station_Gamma\n[Tx 3] Station_Beta → Send 100 Oxygen to Station_Gamma\n[Tx 4] Station_Gamma → Send 50 Oxygen to Station_Alpha\n[Tx 5] Station_Beta → Send 50 Oxygen to Station_Alpha\n\nAudit note: no balance was overwritten; the history is the source of truth.", tone: "output" }]);
        } else if (lowerSub === "balances") {
          if (!state.auditedLedger) {
            append([{ text: "error: ledger history has not been loaded\nHint: run `ledger audit oxygen` before replaying balances.", tone: "error" }]);
          } else {
            const next = { ...state, calculatedBalances: true };
            setState(next);
            append([{ text: "STATE REPLAY COMPLETE\n──────────────────────────\nStation_Alpha   600 OXY\nStation_Beta    150 OXY\nStation_Gamma   250 OXY\n\nEvery value was derived by replaying ledger entries, not read from a mutable balance field.", tone: "success" }]);
            completeObjective(next);
          }
        } else {
          append([{ text: "error: invalid ledger syntax\nUsage:\n  ledger audit oxygen\n  ledger balances", tone: "error" }]);
        }
      } else if (lowerProgram === "hash") {
        const value = tokens.slice(1).join(" ");
        if (!value) {
          append([{ text: 'error: missing input\nUsage: hash "text to fingerprint"', tone: "error" }]);
        } else {
          const digest = await sha256(value);
          const isMissionValue = mission !== "hash-fingerprint" || value === "Blockchain is secure";
          const next = { ...state, hashedInput: state.hashedInput || isMissionValue };
          setState(next);
          append([{ text: `SHA-256(${JSON.stringify(value)})\n${digest}\n\nLength: ${digest.length} hexadecimal characters (256 bits)`, tone: "success" }]);
          completeObjective(next);
        }
      } else if (lowerProgram === "signal") {
        if (lowerSub === "audit") {
          append([{ text: 'RECEIVED SIGNALS\n1  "Sector 5 is clear"\n2  "Oxygen status: 98%"\n3  "Maintain speed at 5000 km/h"\n4  "Initiating Landing Sequence"\n\nExpected digest labels report message 4 as `Initiating landing sequence`. Hash comparison is case-sensitive.', tone: "output" }]);
        } else if (lowerSub === "verify" && lowerAction === "4") {
          const next = { ...state, auditedSignals: true };
          setState(next);
          append([{ text: "CHECKSUM MISMATCH CONFIRMED\nMessage 4 differs by capitalization. Its digest cannot match the expected control fingerprint.\n\nIntegrity conclusion: transmission was modified in transit.", tone: "success" }]);
          completeObjective(next);
        } else if (lowerSub === "verify") {
          append([{ text: `checksum match: message ${action || "?"}\nNo alteration detected. Continue the audit.`, tone: "warning" }]);
        } else {
          append([{ text: "error: invalid signal syntax\nUsage:\n  signal audit\n  signal verify <index>", tone: "error" }]);
        }
      } else if (lowerProgram === "block") {
        if (lowerSub === "inspect") {
          append([{ text: "BLOCK HEADER #849\nheight:       849\ntimestamp:    1782294910\nprev_hash:    0000a39f12bc8e0018f2bb7c71e892cbb87a9bc19cce01ef\ntx_root:      7e91c2a4d4f8b33a\nnonce:        38491\n\nThe header commits to both parent history and its transaction set.", tone: "output" }]);
        } else if (lowerSub === "hash") {
          const payload = "849|1782294910|0000a39f12bc8e0018f2bb7c71e892cbb87a9bc19cce01ef|7e91c2a4d4f8b33a|38491";
          const digest = await sha256(payload);
          const next = { ...state, hashedHeader: true };
          setState(next);
          append([{ text: `HEADER PAYLOAD\n${payload}\n\nBLOCK HASH\n${digest}\n\nChanging any header field produces a completely different digest.`, tone: "success" }]);
          completeObjective(next);
        } else {
          append([{ text: "error: invalid block syntax\nUsage:\n  block inspect\n  block hash", tone: "error" }]);
        }
      } else {
        const suggestion = lowerProgram === "steller" ? "\nDid you mean: stellar" : lowerProgram === "hsah" ? "\nDid you mean: hash" : "";
        append([{ text: `bash: ${program}: command not found${suggestion}`, tone: "error" }]);
      }
    } catch {
      append([{ text: "terminal error: the simulation could not process that command. Try `help`.", tone: "error" }]);
    } finally {
      setIsProcessing(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void run(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setLines([]);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? "");
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      setInput(nextIndex === -1 ? "" : history[nextIndex] ?? "");
    }
  };

  return (
    <section className={`overflow-hidden rounded-2xl border border-white/10 bg-[#050811] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_50px_rgba(0,0,0,0.35)] ${compact ? "" : "min-h-[410px]"}`}>
      <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] px-3 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-400/90" />
            <span className="h-2 w-2 rounded-full bg-amber-300/90" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/90" />
          </div>
          <TerminalSquare className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
          <div className="min-w-0">
            <p className="truncate font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-200">Cosmos Terminal</p>
            <p className="truncate font-mono text-[7.5px] uppercase tracking-[0.13em] text-slate-500">{copy.label} · Testnet sandbox</p>
          </div>
        </div>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 font-mono text-[7px] font-bold uppercase tracking-widest text-amber-300">Simulated</span>
      </header>

      <div className={`flex flex-col ${compact ? "h-[332px]" : "h-[390px]"}`}>
        <div className="border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent px-3 py-2">
          <div className="flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-[0.12em]" style={{ color: accent }}>
            <CircleDot className="h-3 w-3" /> Mission · {copy.title}
          </div>
          <p className="mt-1 text-[9px] leading-relaxed text-slate-400">{copy.objective}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 font-mono text-[9.5px] leading-relaxed scrollbar-thin" onClick={() => inputRef.current?.focus()}>
          {lines.map((entry) => (
            <pre key={entry.id} className={`mb-2 whitespace-pre-wrap break-words ${
              entry.tone === "command" ? "text-cyan-300" :
              entry.tone === "success" ? "text-emerald-300" :
              entry.tone === "error" ? "text-rose-300" :
              entry.tone === "warning" ? "text-amber-300" :
              entry.tone === "muted" ? "text-slate-500" : "text-slate-300"
            }`}>{entry.text}</pre>
          ))}
          {isProcessing && (
            <div className="mb-2 flex items-center gap-1.5 text-slate-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: accent }} />
              processing simulated command…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 bg-black/35 px-3 py-2.5">
          <Command className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
          <span className="shrink-0 font-mono text-[9px] font-semibold text-emerald-300">learner@cosmos:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            aria-label="Cosmos terminal command"
            placeholder="Type help to explore commands"
            className="min-w-0 flex-1 bg-transparent font-mono text-[10px] text-slate-100 outline-none placeholder:text-slate-700 disabled:opacity-50"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" disabled={isProcessing || !input.trim()} className="rounded-lg border border-white/10 bg-white/5 p-1 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Run command">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-3 border-t border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2">
            <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> Lab state verified</div>
            <button onClick={reset} className="inline-flex items-center gap-1 text-[8px] font-mono text-slate-400 transition hover:text-white"><RotateCcw className="h-3 w-3" /> Reset</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
