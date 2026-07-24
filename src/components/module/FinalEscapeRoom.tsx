import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import {
  Clock,
  Shield,
  Coins,
  Sparkles,
  Volume2,
  VolumeX,
  Rocket,
  ShieldCheck,
  AlertTriangle,
  Skull,
  Crosshair,
  Zap,
  CheckCircle2,
  Trophy,
  Flame,
  MousePointer,
  Compass,
} from "lucide-react";

interface Props {
  onComplete: () => void;
}

interface Question {
  id: number;
  module: number;
  question: string;
  choices: string[];
  answer: string;
}

const RESCUE_QUESTIONS: Question[] = [
  {
    id: 1,
    module: 1,
    question: "What is the primary vulnerability of a centralized database ledger?",
    choices: [
      "Single point of failure and vulnerability to tampering",
      "Slower transaction processing than peer-to-peer databases",
      "Inability to run standard SQL query parameters",
      "Excessive network memory and block header overhead",
    ],
    answer: "Single point of failure and vulnerability to tampering",
  },
  {
    id: 2,
    module: 1,
    question: "How does a centralized clearinghouse prevent the double-spending problem?",
    choices: [
      "By using proof-of-work mining systems",
      "By acting as a single source of truth to check balances",
      "By distributing database copies to all system users",
      "By applying asymmetric encryption to client accounts",
    ],
    answer: "By acting as a single source of truth to check balances",
  },
  {
    id: 3,
    module: 2,
    question: "Which key is used to digitally sign a transaction to prove authorization?",
    choices: [
      "The recipient's public key",
      "The sender's private key",
      "The network validator's public key",
      "The shared ledger master key",
    ],
    answer: "The sender's private key",
  },
  {
    id: 4,
    module: 2,
    question: "What is the primary function of a public key in transaction validation?",
    choices: [
      "To check that the sender's private signature is authentic",
      "To decrypt private metadata inside transaction fields",
      "To compute the proof-of-work target difficulty",
      "To encrypt block contents before storage",
    ],
    answer: "To check that the sender's private signature is authentic",
  },
  {
    id: 5,
    module: 3,
    question: "What cryptographic element binds a block directly to its predecessor?",
    choices: [
      "The previous block's SHA-256 hash",
      "The block index height count",
      "The miner's public wallet address",
      "The cumulative network difficulty rate",
    ],
    answer: "The previous block's SHA-256 hash",
  },
  {
    id: 6,
    module: 3,
    question: "Which data structure is used to hash all block transactions into a single root?",
    choices: [
      "Merkle Tree",
      "Red-Black Tree",
      "Binary Search Tree",
      "Fibonacci Heap",
    ],
    answer: "Merkle Tree",
  },
  {
    id: 7,
    module: 4,
    question: "What property makes it computationally infeasible to find two different inputs that map to the same hash?",
    choices: [
      "Collision resistance",
      "Pre-image resistance",
      "Avalanche effect",
      "Deterministic scaling",
    ],
    answer: "Collision resistance",
  },
  {
    id: 8,
    module: 4,
    question: "Which hashing algorithm is most widely used to secure bitcoin block headers?",
    choices: [
      "SHA-256",
      "Scrypt",
      "Ethash",
      "MD5",
    ],
    answer: "SHA-256",
  },
  {
    id: 9,
    module: 5,
    question: "In block linking, what happens if a malicious user alters a transaction in Block 2?",
    choices: [
      "All subsequent block hashes become invalid due to broken hash linkages",
      "The network automatically rolls back the entire internet router stack",
      "The block's size increases to consume infinite disk storage",
      "The malicious user receives double the mining reward",
    ],
    answer: "All subsequent block hashes become invalid due to broken hash linkages",
  },
  {
    id: 10,
    module: 5,
    question: "What is a Merkle Root?",
    choices: [
      "The single cryptographic hash that summarizes all transactions inside a block",
      "The genesis block height number",
      "The private key used to sign block headers",
      "The validator's node IP coordinate",
    ],
    answer: "The single cryptographic hash that summarizes all transactions inside a block",
  },
  {
    id: 11,
    module: 6,
    question: "Which network topology is least vulnerable to a single point of failure?",
    choices: [
      "Distributed / Peer-to-Peer network",
      "Centralized star network",
      "Decentralized multicluster hub network",
      "Standard client-server database",
    ],
    answer: "Distributed / Peer-to-Peer network",
  },
  {
    id: 12,
    module: 6,
    question: "What is the primary role of a full node in a blockchain network?",
    choices: [
      "To validate and keep a complete copy of the blockchain ledger",
      "To lease computing power for web hosting services",
      "To manage private keys for active network participants",
      "To coordinate global transaction pricing lists",
    ],
    answer: "To validate and keep a complete copy of the blockchain ledger",
  },
  {
    id: 13,
    module: 7,
    question: "In Proof of Work (PoW), what criteria must a block hash meet to be valid?",
    choices: [
      "It must be numerically less than the network target difficulty",
      "It must match the transaction signatures exactly",
      "It must contain a prime number of leading zeroes",
      "It must be generated using the validator's private key",
    ],
    answer: "It must be numerically less than the network target difficulty",
  },
  {
    id: 14,
    module: 7,
    question: "How are block validators primarily chosen in a Proof of Stake (PoS) consensus network?",
    choices: [
      "Based on the value of their locked (staked) tokens",
      "Based on their computer's raw hashing speed",
      "By alphabetical ordering of node IP addresses",
      "Through arbitrary selection by the core founders",
    ],
    answer: "Based on the value of their locked (staked) tokens",
  },
  {
    id: 15,
    module: 7,
    question: "What happens to a PoS validator who double-signs blocks or validates fraudulent transactions?",
    choices: [
      "A portion of their staked tokens is slashed",
      "Their private key is revoked by the network",
      "Their hardware is shut down remotely",
      "They are blocked from sending basic transactions",
    ],
    answer: "A portion of their staked tokens is slashed",
  },
  {
    id: 16,
    module: 8,
    question: "Which feature of public blockchains allows open transparency for auditing transactions?",
    choices: [
      "Immutable, publicly accessible ledger history",
      "Encrypted state channels for validator nodes",
      "Private transaction mempools",
      "Central database access controls",
    ],
    answer: "Immutable, publicly accessible ledger history",
  },
  {
    id: 17,
    module: 8,
    question: "How does a blockchain explorer trace the history of a digital asset?",
    choices: [
      "By querying bank account records",
      "By scanning the chain of inputs and outputs across blocks",
      "By tracing user IP addresses on network nodes",
      "By decrypting transaction private keys",
    ],
    answer: "By scanning the chain of inputs and outputs across blocks",
  },
  {
    id: 18,
    module: 2,
    question: "What is the consequence of losing your wallet's private key?",
    choices: [
      "Permanently losing access to recover or sign transactions for your funds",
      "The blockchain will email you a reset link after 24 hours",
      "Your tokens are automatically converted into cash",
      "The network issues a replacement private key matching your ID",
    ],
    answer: "Permanently losing access to recover or sign transactions for your funds",
  },
  {
    id: 19,
    module: 4,
    question: "Which of the following is an asymmetric encryption/signature algorithm, not a cryptographic hash?",
    choices: [
      "RSA-2048",
      "SHA-256",
      "Keccak-256",
      "MD5",
    ],
    answer: "RSA-2048",
  },
  {
    id: 20,
    module: 5,
    question: "What mechanisms prevent a rogue node from successfully writing fake transactions onto the block history?",
    choices: [
      "Peer nodes independently audit blocks against rules and reject invalid sets",
      "The blockchain automatically alerts internet service providers",
      "The central coordinator node encrypts the rogue node's ledger",
      "The rogue node's keyboard is locked by the gossip protocol",
    ],
    answer: "Peer nodes independently audit blocks against rules and reject invalid sets",
  },
];

export default function FinalEscapeRoom({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const gameActionsRef = useRef<{
    fireLaser: () => void;
    triggerCollision: () => void;
    setWarpSpeed: (active: boolean) => void;
    setShipTarget: (x: number, y: number) => void;
    triggerExplosionAtIndexes: (indexes: number[]) => void;
  } | null>(null);

  // Game/Quiz UI States
  const [gameState, setGameState] = useState<"START" | "COUNTDOWN" | "PLAYING" | "WARP" | "GAMEOVER" | "SUCCESS">("START");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [correctCount, setCorrectCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [warpCountdown, setWarpCountdown] = useState(4);
  const [preLaunchCount, setPreLaunchCount] = useState(3);
  const [scanning, setScanning] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "timeout" | null>(null);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [hoveredOptionIdx, setHoveredOptionIdx] = useState<number | null>(null);
  const [explodingIndexes, setExplodingIndexes] = useState<number[]>([]);

  // Dynamically shuffle choices for all 20 questions so correct answers are non-patterned
  const shuffleChoices = (choices: string[]) => {
    const arr = [...choices];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setActiveQuestions(
      RESCUE_QUESTIONS.map((q) => ({
        ...q,
        choices: shuffleChoices(q.choices),
      }))
    );
  }, []);

  // Audio Context Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humNodeRef = useRef<OscillatorNode | null>(null);

  const getAudioCtx = (): AudioContext | null => {
    try {
      if (typeof window === "undefined") return null;
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtxClass) return null;
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      return ctx;
    } catch (e) {
      console.warn("AudioContext error: ", e);
      return null;
    }
  };

  useEffect(() => {
    if (!audioEnabled || (gameState !== "PLAYING" && gameState !== "WARP")) {
      stopEngineHum();
      return;
    }
    startEngineHum();
    return () => stopEngineHum();
  }, [gameState, audioEnabled]);

  const startEngineHum = () => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;

      if (humNodeRef.current) {
        try { humNodeRef.current.stop(); } catch (e) {}
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(55, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(90, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      humNodeRef.current = osc;
    } catch (e) {
      console.warn("AudioContext initialization failed: ", e);
    }
  };

  const stopEngineHum = () => {
    if (humNodeRef.current) {
      try {
        humNodeRef.current.stop();
      } catch (e) {}
      humNodeRef.current = null;
    }
  };

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    if (!nextState) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
      stopEngineHum();
    }
  };

  const playSynth = (type: "laser" | "crash" | "explosion" | "warp" | "tension" | "success" | "ignition" | "beep") => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;

      if (type === "laser") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === "crash") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === "explosion") {
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === "warp") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 4.0);
        gain.gain.setValueAtTime(0.005, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 2.0);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 4.0);
      } else if (type === "tension") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(420, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "ignition") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(40, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      } else if (type === "beep") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "success") {
        [0, 0.12, 0.24, 0.36].forEach((delay, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(523.25 + idx * 130, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.3);
        });
      }
    } catch (e) {
      console.warn("Synth failed: ", e);
    }
  };

  // Timer loop for active question
  useEffect(() => {
    if (gameState !== "PLAYING" || selectedOption !== null || feedback !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 4 && prev > 1) {
          playSynth("tension");
        }
        if (prev <= 1) {
          handleTimeout();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentIdx, selectedOption, feedback]);

  // Task 6: NASA Mission Control Voice Synthesizer Handover
  const speakVoice = (text: string) => {
    if (!audioEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 0.88;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("SpeechSynthesis error: ", e);
    }
  };

  // Task 5 & 6: Cinematic 3..2..1 Launch Sequence & NASA Audio Handover
  useEffect(() => {
    if (gameState !== "COUNTDOWN") return;

    if (preLaunchCount === 3) {
      speakVoice("Three");
      playSynth("beep");
    } else if (preLaunchCount === 2) {
      speakVoice("Two");
      playSynth("beep");
    } else if (preLaunchCount === 1) {
      speakVoice("One");
      playSynth("beep");
    } else if (preLaunchCount === 0) {
      speakVoice("Mission launched. Commander, handing over control to you.");
      playSynth("warp");
      const handoverTimer = setTimeout(() => {
        setGameState("PLAYING");
      }, 2800);
      return () => clearTimeout(handoverTimer);
    }

    const timer = setTimeout(() => {
      setPreLaunchCount((prev) => prev - 1);
    }, 1100);

    return () => clearTimeout(timer);
  }, [gameState, preLaunchCount]);

  // Task 7: Timeout Behavior (Highlight correct answer clearly, apply damage, advance)
  const handleTimeout = () => {
    if (selectedOption !== null || feedback !== null) return;
    setFeedback("timeout");
    setShield((s) => Math.max(0, s - 20));
    playSynth("crash");
    gameActionsRef.current?.triggerCollision();

    setTimeout(() => {
      advanceQuestion();
    }, 1400);
  };

  // V-Shaped positions for 3D rocket flying target coordinates
  const V_OPTION_POSITIONS = [
    { x: -3.5, y: 1.6 },  // Top-Left (Option A)
    { x: -3.5, y: -1.6 }, // Bottom-Left (Option B)
    { x: 3.5, y: 1.6 },   // Top-Right (Option C)
    { x: 3.5, y: -1.6 },  // Bottom-Right (Option D)
  ];

  const handleOptionClick = (option: string, index: number) => {
    if (selectedOption !== null || feedback !== null) return;

    setSelectedOption(option);

    // Steer rocket smoothly toward the chosen V-shaped HUD box
    const pos = V_OPTION_POSITIONS[index] || { x: 0, y: 0 };
    gameActionsRef.current?.setShipTarget(pos.x, pos.y);

    const questionsList = activeQuestions.length > 0 ? activeQuestions : RESCUE_QUESTIONS;
    const safeIdx = Math.min(currentIdx, questionsList.length - 1);
    const correct = questionsList[safeIdx].answer;

    if (option === correct) {
      setFeedback("correct");
      setScore((s) => s + 150 + timeLeft * 10);
      setCorrectCount((c) => c + 1);
      playSynth("laser");
      playSynth("explosion");
      gameActionsRef.current?.fireLaser();

      // Trigger self-destruction bombing explosion of remaining 3 incorrect options! (Task 5)
      const incorrectIndexes = [0, 1, 2, 3].filter((i) => i !== index);
      setExplodingIndexes(incorrectIndexes);
      gameActionsRef.current?.triggerExplosionAtIndexes(incorrectIndexes);
    } else {
      setFeedback("incorrect");
      setShield((s) => Math.max(0, s - 20));
      playSynth("crash");
      gameActionsRef.current?.triggerCollision();
    }

    setTimeout(() => {
      advanceQuestion();
    }, 1200);
  };

  const handleAnswerSelect = handleOptionClick;

  // Task 3 Method 2: Manual Spacecraft Navigation & Mouse Hover Auto-Highlighting
  const handleMouseMoveViewport = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "PLAYING" || selectedOption !== null || !viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1); // -1 to 1

    gameActionsRef.current?.setShipTarget(nx * 1.8, ny * 0.9);

    // Auto highlight option based on cursor quadrant position
    let idx: number | null = null;
    if (nx < 0 && ny > 0) idx = 0;       // Top-Left (Option A)
    else if (nx < 0 && ny <= 0) idx = 1;  // Bottom-Left (Option B)
    else if (nx >= 0 && ny > 0) idx = 2;  // Top-Right (Option C)
    else if (nx >= 0 && ny <= 0) idx = 3; // Bottom-Right (Option D)

    setHoveredOptionIdx(idx);
  };

  const handleViewportClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "PLAYING" || selectedOption !== null || hoveredOptionIdx === null) return;
    const questionsList = activeQuestions.length > 0 ? activeQuestions : RESCUE_QUESTIONS;
    const safeIdx = Math.min(currentIdx, questionsList.length - 1);
    const choice = questionsList[safeIdx]?.choices[hoveredOptionIdx];
    if (choice) {
      handleAnswerSelect(choice, hoveredOptionIdx);
    }
  };

  const advanceQuestion = () => {
    setFeedback(null);
    setExplodingIndexes([]);
    setSelectedOption(null);
    setHoveredOptionIdx(null);
    gameActionsRef.current?.setShipTarget(0, -0.6); // Reset ship to center

    const totalQ = activeQuestions.length > 0 ? activeQuestions.length : RESCUE_QUESTIONS.length;
    if (currentIdx < totalQ - 1) {
      setCurrentIdx((i) => i + 1);
      setTimeLeft(10);
    } else {
      evaluateGameOutcome();
    }
  };

  const evaluateGameOutcome = () => {
    if (shield > 0 && correctCount >= 12) {
      setGameState("SUCCESS");
      playSynth("success");
    } else {
      setGameState("GAMEOVER");
    }
  };

  const handleStartGame = () => {
    setActiveQuestions(
      RESCUE_QUESTIONS.map((q) => ({
        ...q,
        choices: shuffleChoices(q.choices),
      }))
    );
    setCurrentIdx(0);
    setTimeLeft(10);
    setScore(0);
    setShield(100);
    setCorrectCount(0);
    setSelectedOption(null);
    setPreLaunchCount(3);
    setGameState("COUNTDOWN");
    speakVoice("Launch sequence initiated.");
    playSynth("ignition");
  };

  const handleAbortMission = () => {
    setShowAbortConfirm(false);
    setGameState("START");
    setCurrentIdx(0);
    setTimeLeft(10);
    setScore(0);
    setShield(100);
    setCorrectCount(0);
    setSelectedOption(null);
    setFeedback(null);
    stopEngineHum();
  };

  const triggerLaunchWarp = () => {
    setGameState("WARP");
    playSynth("warp");
    gameActionsRef.current?.setWarpSpeed(true);

    const interval = setInterval(() => {
      setWarpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 1200);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // --- THREE.JS GAME INSTANTIATION AND ANIMATION LOOP ---
  useEffect(() => {
    if (gameState !== "PLAYING" && gameState !== "WARP") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04040a, 0.012);

    const camera = new THREE.PerspectiveCamera(62, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 2.5, 11);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor(0x04040a, 1);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x22d3ee, 5.0);
    dirLight.position.set(6, 12, 10);
    scene.add(dirLight);

    const muzzleLight = new THREE.PointLight(0x22d3ee, 0, 15);
    scene.add(muzzleLight);

    // Spacecraft Design Group
    const shipGroup = new THREE.Group();
    scene.add(shipGroup);

    const fuselageGeom = new THREE.CylinderGeometry(0.02, 0.42, 2.6, 12);
    fuselageGeom.rotateX(Math.PI / 2);
    const fuselageMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.1,
      metalness: 0.98,
    });
    const fuselage = new THREE.Mesh(fuselageGeom, fuselageMat);
    shipGroup.add(fuselage);

    const wingGeom = new THREE.BoxGeometry(2.0, 0.05, 0.9);
    wingGeom.translate(0, -0.05, 0.3);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const wingL = new THREE.Mesh(wingGeom, wingMat);
    wingL.position.x = -1.1;
    wingL.rotation.y = 0.1;
    shipGroup.add(wingL);

    const wingR = wingL.clone();
    wingR.position.x = 1.1;
    wingR.rotation.y = -0.1;
    shipGroup.add(wingR);

    const cockpitGeom = new THREE.SphereGeometry(0.22, 8, 8);
    const cockpitMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat);
    cockpit.position.set(0, 0.15, -0.6);
    shipGroup.add(cockpit);

    const exhaustGeom = new THREE.ConeGeometry(0.18, 1.1, 8);
    exhaustGeom.rotateX(-Math.PI / 2);
    exhaustGeom.translate(0, 0, 1.8);
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xf97316,
      emissiveIntensity: 5.0,
      transparent: true,
      opacity: 0.95,
    });
    const exhaust = new THREE.Mesh(exhaustGeom, exhaustMat);
    shipGroup.add(exhaust);

    shipGroup.position.set(0, -0.6, 0);

    // Arrays & Collections
    const activeLasers: THREE.Mesh[] = [];
    const particles: any[] = [];
    const shockwaves: { mesh: THREE.Mesh; scaleSpeed: number; opacitySpeed: number; life: number }[] = [];

    // Obstacle Group
    const obstacleGroup = new THREE.Group();
    scene.add(obstacleGroup);

    const asteroidGeom = new THREE.DodecahedronGeometry(1.65, 1);
    const posAttr = asteroidGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);
      const deform = 0.82 + Math.random() * 0.35;
      posAttr.setXYZ(i, vx * deform, vy * deform, vz * deform);
    }
    asteroidGeom.computeVertexNormals();

    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
      emissive: 0x450a0a,
      emissiveIntensity: 1.5,
    });
    const asteroidMesh = new THREE.Mesh(asteroidGeom, asteroidMat);
    obstacleGroup.add(asteroidMesh);

    const lavaEdges = new THREE.EdgesGeometry(asteroidGeom);
    const lavaWire = new THREE.LineSegments(lavaEdges, new THREE.LineBasicMaterial({ color: 0xff4500, linewidth: 1.5 }));
    obstacleGroup.add(lavaWire);

    // Floating Debris Shards
    const debrisGroup = new THREE.Group();
    scene.add(debrisGroup);

    const debrisList: { mesh: THREE.Mesh; rotX: number; rotY: number; speedZ: number }[] = [];
    const debrisGeom = new THREE.TetrahedronGeometry(0.35);
    const debrisMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.4 });

    for (let d = 0; d < 25; d++) {
      const dMesh = new THREE.Mesh(debrisGeom, debrisMat);
      const dx = (Math.random() - 0.5) * 45;
      const dy = (Math.random() - 0.5) * 30;
      const dz = Math.random() * -140;
      dMesh.position.set(dx, dy, dz);
      debrisGroup.add(dMesh);

      debrisList.push({
        mesh: dMesh,
        rotX: (Math.random() - 0.5) * 0.04,
        rotY: (Math.random() - 0.5) * 0.04,
        speedZ: Math.random() * 0.35 + 0.2,
      });
    }

    obstacleGroup.position.set(0, -0.5, -38);

    // Parallax Starfields
    const starsGroup = new THREE.Group();
    scene.add(starsGroup);

    const starCount = 350;
    const starLines: { line: THREE.Line; speed: number; length: number; ox: number; oy: number; oz: number }[] = [];
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 });

    for (let i = 0; i < starCount; i++) {
      const ox = (Math.random() - 0.5) * 65;
      const oy = (Math.random() - 0.5) * 48;
      const oz = Math.random() * -280;

      const geom = new THREE.BufferGeometry();
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1.5)];
      geom.setFromPoints(points);

      const line = new THREE.Line(geom, lineMat);
      line.position.set(ox, oy, oz);
      starsGroup.add(line);

      starLines.push({
        line,
        speed: Math.random() * 0.95 + 1.2,
        length: 1.5,
        ox,
        oy,
        oz,
      });
    }

    // Ship Target Coordinates for smooth flying lerp (Task 3 & 4)
    let targetX = 0;
    let targetY = -0.6;
    let shakeIntensity = 0;
    let warpActive = gameState === "WARP";
    let damageFireDuration = 0;

    const createShockwave = (pos: THREE.Vector3) => {
      const geom = new THREE.RingGeometry(0.1, 1.8, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      mesh.rotation.x = Math.PI / 2;
      scene.add(mesh);

      shockwaves.push({
        mesh,
        scaleSpeed: 0.22,
        opacitySpeed: 0.04,
        life: 25,
      });
    };

    const createCollisionBurst = (pos: THREE.Vector3, colorHex: number, count = 35) => {
      const geom = new THREE.SphereGeometry(0.12, 5, 5);
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.95,
      });

      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.copy(pos);
        scene.add(mesh);

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const speed = Math.random() * 0.4 + 0.15;

        particles.push({
          mesh,
          vx: Math.sin(phi) * Math.cos(theta) * speed,
          vy: Math.sin(phi) * Math.sin(theta) * speed,
          vz: Math.cos(phi) * speed,
          life: 30,
          maxLife: 30,
        });
      }
    };

    gameActionsRef.current = {
      setShipTarget: (x: number, y: number) => {
        targetX = x;
        targetY = y;
      },
      fireLaser: () => {
        const laserMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
        const laserGeom = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 6);
        laserGeom.rotateX(Math.PI / 2);

        const laserL = new THREE.Mesh(laserGeom, laserMat);
        laserL.position.set(shipGroup.position.x - 1.1, shipGroup.position.y - 0.6, shipGroup.position.z + 0.5);
        scene.add(laserL);

        const laserR = laserL.clone();
        laserR.position.x = shipGroup.position.x + 1.1;
        scene.add(laserR);

        activeLasers.push(laserL, laserR);

        shipGroup.position.z += 0.45;
        muzzleLight.intensity = 8.0;

        setTimeout(() => {
          playSynth("explosion");
          createExplosion(obstacleGroup.position);
          createShockwave(obstacleGroup.position);
          shakeIntensity = 0.35;

          obstacleGroup.scale.set(0.01, 0.01, 0.01);

          setTimeout(() => {
            obstacleGroup.position.set((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4 - 0.5, -38);
            obstacleGroup.scale.set(1, 1, 1);
          }, 700);
        }, 320);
      },
      triggerCollision: () => {
        obstacleGroup.position.set(shipGroup.position.x, shipGroup.position.y, -4);
        setTimeout(() => {
          shakeIntensity = 0.7;
          createCollisionBurst(shipGroup.position, 0xff4500, 40);
          shipGroup.rotation.x = -0.35;
          obstacleGroup.position.set(0, -0.5, -38);
          damageFireDuration = 3.5;
        }, 120);
      },
      triggerExplosionAtIndexes: (indexes: number[]) => {
        const vPos = [
          new THREE.Vector3(-3.5, 1.6, 0),
          new THREE.Vector3(-3.5, -1.6, 0),
          new THREE.Vector3(3.5, 1.6, 0),
          new THREE.Vector3(3.5, -1.6, 0),
        ];
        indexes.forEach((idx) => {
          if (vPos[idx]) {
            createCollisionBurst(vPos[idx], 0xef4444, 25);
            createShockwave(vPos[idx]);
          }
        });
      },
      setWarpSpeed: (active: boolean) => {
        warpActive = active;
      },
    };

    const createExplosion = (pos: THREE.Vector3) => {
      createCollisionBurst(pos, 0x22d3ee, 25);
      createCollisionBurst(pos, 0x10b981, 20);
      createCollisionBurst(pos, 0xf59e0b, 15);
    };

    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Animation Render Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      const elapsed = clock.getElapsedTime();

      if (!warpActive) {
        // Smooth inertial movement lerp towards target position (Task 3 & 4)
        const lastX = shipGroup.position.x;
        shipGroup.position.x += (targetX - shipGroup.position.x) * 0.12;
        shipGroup.position.y += (targetY + Math.sin(elapsed * 2.4) * 0.1 - shipGroup.position.y) * 0.12;

        const dx = shipGroup.position.x - lastX;
        shipGroup.rotation.z = -dx * 4.2; // Smooth banking roll
        shipGroup.rotation.y = -dx * 1.8; // Smooth yaw

        shipGroup.position.z += (0 - shipGroup.position.z) * 0.15;
        muzzleLight.intensity += (0 - muzzleLight.intensity) * 0.12;

        exhaust.scale.set(1, 1 + Math.sin(elapsed * 20) * 0.18, 1);
        obstacleGroup.rotation.y += 0.015;
        obstacleGroup.rotation.z += 0.005;

        if (obstacleGroup.position.z < -14 && selectedOption === null) {
          obstacleGroup.position.z += 0.35;
        }

        debrisList.forEach((d) => {
          d.mesh.rotation.x += d.rotX;
          d.mesh.rotation.y += d.rotY;
          d.mesh.position.z += d.speedZ;
          if (d.mesh.position.z > 20) {
            d.mesh.position.z = -140;
            d.mesh.position.x = (Math.random() - 0.5) * 45;
            d.mesh.position.y = (Math.random() - 0.5) * 30;
          }
        });

        if (damageFireDuration > 0) {
          damageFireDuration -= 0.016;
          if (Math.random() < 0.45) {
            const fireGeom = new THREE.SphereGeometry(Math.random() * 0.15 + 0.06, 5, 5);
            const fireMat = new THREE.MeshBasicMaterial({
              color: Math.random() > 0.4 ? 0xff4500 : 0xffaa00,
              transparent: true,
              opacity: 0.85,
            });
            const fireMesh = new THREE.Mesh(fireGeom, fireMat);
            fireMesh.position.copy(shipGroup.position);
            fireMesh.position.x += (Math.random() - 0.5) * 0.35;
            fireMesh.position.y += (Math.random() - 0.5) * 0.15 + 0.25;
            fireMesh.position.z += 0.2 + Math.random() * 0.5;
            scene.add(fireMesh);

            particles.push({
              mesh: fireMesh,
              vx: (Math.random() - 0.5) * 0.05,
              vy: Math.random() * 0.08 + 0.05,
              vz: Math.random() * 0.12 + 0.18,
              life: 25,
              maxLife: 25,
            });
          }
        }
      } else {
        // Warp travel
        shipGroup.position.set(0, -0.6, 0);
        shipGroup.rotation.set(0, 0, 0);
        shipGroup.scale.addScalar(-0.0035);
        exhaust.scale.set(1.4, 4.8, 1.4);
        exhaustMat.color.setHex(0x22d3ee);
        exhaustMat.emissive.setHex(0x06b6d4);
      }

      // Parallax star lines
      starLines.forEach((s) => {
        const starSpeed = warpActive ? 40 : s.speed;
        const starLen = warpActive ? 52 : s.length;
        s.line.position.z += starSpeed;
        s.line.scale.z = starLen;

        if (s.line.position.z > 25) {
          s.line.position.z = -280;
          s.line.position.x = (Math.random() - 0.5) * 65;
          s.line.position.y = (Math.random() - 0.5) * 48;
        }
      });

      // Fly laser bolts
      for (let i = activeLasers.length - 1; i >= 0; i--) {
        const l = activeLasers[i];
        l.position.z -= 2.6;
        if (l.position.z < -65) {
          scene.remove(l);
          activeLasers.splice(i, 1);
        }
      }

      // Particles
      for (let p = particles.length - 1; p >= 0; p--) {
        const part = particles[p];
        part.mesh.position.x += part.vx;
        part.mesh.position.y += part.vy;
        part.mesh.position.z += part.vz;
        part.life--;

        const ratio = part.life / part.maxLife;
        part.mesh.scale.set(ratio, ratio, ratio);

        if (part.life <= 0) {
          scene.remove(part.mesh);
          part.mesh.geometry.dispose();
          part.mesh.material.dispose();
          particles.splice(p, 1);
        }
      }

      // Shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.mesh.scale.addScalar(sw.scaleSpeed);
        (sw.mesh.material as THREE.MeshBasicMaterial).opacity -= sw.opacitySpeed;
        sw.life--;

        if (sw.life <= 0) {
          scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          (sw.mesh.material as THREE.MeshBasicMaterial).dispose();
          shockwaves.splice(s, 1);
        }
      }

      // Camera shake
      if (shakeIntensity > 0) {
        camera.position.x = (Math.random() - 0.5) * shakeIntensity;
        camera.position.y = 2.5 + (Math.random() - 0.5) * shakeIntensity;
        shakeIntensity *= 0.88;
        if (shakeIntensity < 0.02) shakeIntensity = 0;
      } else {
        camera.position.set(0, 2.5, 11);
      }
      camera.lookAt(0, 0, -22);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      scene.traverse((obj) => {
        if ((obj as any).geometry) (obj as any).geometry.dispose();
        if ((obj as any).material) {
          if (Array.isArray((obj as any).material)) {
            (obj as any).material.forEach((m: any) => m.dispose());
          } else {
            (obj as any).material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [gameState]);

  const questionsList = activeQuestions.length > 0 ? activeQuestions : RESCUE_QUESTIONS;
  const currentQuestion = questionsList[Math.min(currentIdx, questionsList.length - 1)] || questionsList[0];

  const getTimerColor = () => {
    if (timeLeft > 6) return { text: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400/30" };
    if (timeLeft > 3) return { text: "text-amber-400", bg: "bg-amber-400", border: "border-amber-400/40" };
    return { text: "text-red-500", bg: "bg-red-500", border: "border-red-500/70" };
  };

  const timerColor = getTimerColor();

  const attemptedCount = Math.min(currentIdx + (selectedOption !== null || feedback !== null ? 1 : 0), 20);

  return (
    <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3 lg:p-4 backdrop-blur-md shadow-2xl flex flex-col justify-between h-full min-h-0 flex-1 overflow-hidden select-none relative z-10">

      {/* HUD HEADER PANEL (Task 1 & 9 — Rebalanced & Symmetrical, z-40 Always Accessible) */}
      <div className="w-full flex items-center justify-between mb-3 bg-slate-950/70 border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md shrink-0 font-mono text-[9px] text-slate-400 relative z-40">
        <div className="flex gap-4 lg:gap-5 items-center">
          <div>
            <span className="block opacity-60">RESCUE SCORE</span>
            <span className="text-[11px] font-bold text-white flex items-center gap-1 mt-0.5 font-mono">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> {score.toLocaleString()}
            </span>
          </div>
          <div className="w-px h-5 bg-white/10" />
          <div>
            <span className="block opacity-60">CONSENSUS KEYS</span>
            <span className="text-[11px] font-bold text-emerald-400 mt-0.5">{correctCount} / 20</span>
          </div>
          <div className="w-px h-5 bg-white/10" />
          <div>
            <span className="block opacity-60">PROGRESS (ATTEMPTED)</span>
            <span className="text-[11px] font-bold text-cyan-400 mt-0.5">{attemptedCount} / 20</span>
          </div>
        </div>

        {gameState === "PLAYING" && (
          <div className="flex items-center gap-6">
            {/* Dynamic HUD Pressure Timer Badge */}
            <motion.div
              animate={timeLeft <= 3 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ repeat: timeLeft <= 3 ? Infinity : 0, duration: 0.5 }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border bg-slate-950 font-mono font-extrabold ${timerColor.border} ${timerColor.text} ${
                timeLeft <= 3 ? "shadow-[0_0_18px_rgba(239,68,68,0.6)]" : ""
              }`}
            >
              <Clock className={`w-3.5 h-3.5 ${timeLeft <= 3 ? "animate-pulse" : ""}`} />
              <span className="text-xs">{timeLeft}s</span>
            </motion.div>

            {/* Hull Shield Bar */}
            <div className="flex flex-col items-end">
              <span className="opacity-60">HULL SHIELD STATUS</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                  <div
                    style={{ width: `${shield}%` }}
                    className={`h-full transition-all duration-300 ${shield > 40 ? "bg-cyan-400" : "bg-red-500 animate-pulse"}`}
                  />
                </div>
                <span className="text-[10px] text-white font-bold">{shield}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAbortConfirm(true)}
            className="px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[9.5px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
            title="Quit Current Mission"
          >
            <Skull className="w-3.5 h-3.5 text-red-400" />
            <span>QUIT MISSION</span>
          </button>

          <button
            onClick={toggleAudio}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-mono text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              audioEnabled
                ? "bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                : "bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)] animate-pulse"
            }`}
            title={audioEnabled ? "Mute All Sound & Voice" : "Unmute Sound & Voice"}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
                <span>AUDIO MUTED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* FULL-WIDTH GAMEPLAY VIEWPORT FRAME (Task 1 & 9 — Single Screen, No Scrollbar) */}
      <div
        ref={viewportRef}
        onMouseMove={handleMouseMoveViewport}
        onClick={handleViewportClick}
        className="flex-1 w-full h-full bg-[#020207] border border-white/10 rounded-2xl overflow-hidden relative flex items-center justify-center min-h-0 select-none cursor-pointer"
      >
        {/* WebGL Canvas Viewport (100% Full Width) */}
        {(gameState === "PLAYING" || gameState === "WARP") && (
          <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
        )}

        {/* Top-Center Incoming Question Signal Banner (Task 2 & 9 — Compact Fit, No Overlap) */}
        {gameState === "PLAYING" && currentQuestion && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[85%] max-w-md lg:max-w-lg pointer-events-none">
            <div className="bg-slate-950/90 border border-cyan-500/40 rounded-xl p-2.5 sm:p-3 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.25)] text-center space-y-1">
              <div className="flex items-center justify-between text-[8px] sm:text-[8.5px] font-mono text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 pb-0.5">
                <span className="flex items-center gap-1.5"><Crosshair className="w-3 h-3 text-cyan-400 animate-spin" /> OBSTACLE SIGNAL TRANSMISSION</span>
                <span className="text-slate-400">GATE {currentIdx + 1} / 20 · M0{currentQuestion.module}</span>
              </div>
              <p className="font-['Space_Grotesk'] text-[11px] sm:text-xs font-bold text-white tracking-wide leading-snug">
                "{currentQuestion.question}"
              </p>
            </div>
          </div>
        )}

        {/* TASK 2 & 3: V-SHAPED HUD ANSWER SELECTION CAPSULES (2 Left, 2 Right surrounding Ship, Zero Overlap) */}
        {gameState === "PLAYING" && currentQuestion && (
          <div className="absolute inset-0 z-20 pointer-events-none p-4 lg:p-6 flex flex-col justify-between">
            {/* Top Row: Option A (Left Upper) & Option C (Right Upper) */}
            <div className="flex justify-between items-start gap-3 mt-1">
              {[0, 2].map((idx) => {
                const choice = currentQuestion.choices[idx];
                if (!choice) return null;
                const isSelected = selectedOption === choice;
                const isCorrect = choice === currentQuestion.answer;
                const hasAnswered = selectedOption !== null;
                const isHovered = hoveredOptionIdx === idx;
                const isExploding = explodingIndexes.includes(idx);

                let cardStyle = "bg-slate-950/85 border-white/15 text-slate-200 hover:border-cyan-400 hover:text-white";
                let prefix = idx === 0 ? "A" : "C";

                if (hasAnswered) {
                  if (isCorrect) {
                    cardStyle = "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.03] ring-2 ring-emerald-400/50";
                  } else if (isSelected) {
                    cardStyle = "bg-red-950/90 border-red-500 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.5)]";
                  } else {
                    cardStyle = "bg-slate-950/40 border-white/5 text-slate-600 opacity-40";
                  }
                } else if (isHovered) {
                  cardStyle = "bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-[1.03] ring-2 ring-cyan-400/50";
                }

                if (feedback === "timeout" && isCorrect) {
                  cardStyle = "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-pulse";
                }

                return (
                  <motion.div
                    key={`q-${currentIdx}-opt-${idx}`}
                    initial={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0, filter: "brightness(1)" }}
                    animate={
                      isExploding
                        ? {
                            x: [0, -10, 10, -6, 6, 0],
                            y: [0, 6, -6, 3, 0],
                            rotate: [0, -6, 8, -10, 12],
                            scale: [1, 1.05, 0.7, 0.2, 0],
                            opacity: [1, 1, 0.8, 0.3, 0],
                            filter: ["brightness(1)", "brightness(2.5)", "brightness(1.8)", "brightness(0)"],
                          }
                        : { opacity: 1, scale: 1, rotate: 0, x: 0, y: 0, filter: "brightness(1)" }
                    }
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-xl"
                  >
                    <button
                      disabled={hasAnswered}
                      onClick={() => handleAnswerSelect(choice, idx)}
                      onMouseEnter={() => setHoveredOptionIdx(idx)}
                      onMouseLeave={() => setHoveredOptionIdx(null)}
                      className={`w-56 sm:w-64 lg:w-72 pointer-events-auto border rounded-xl p-2.5 lg:p-3 transition-all duration-300 backdrop-blur-md cursor-pointer flex items-center gap-2.5 relative overflow-hidden ${cardStyle}`}
                    >
                      <span className={`w-5 h-5 lg:w-6 lg:h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold shrink-0 transition-colors ${isHovered ? "bg-cyan-400 text-slate-950 font-black" : "bg-white/10 border border-white/20 text-slate-300"}`}>
                        {prefix}
                      </span>
                      <span className="font-['Inter'] text-[10.5px] lg:text-[11.5px] font-semibold leading-snug text-left">
                        {choice}
                      </span>

                      {/* Realistic Hiroshima/Nagasaki Atomic Nuclear Bombing Effect (Strictly Contained in Card Area) */}
                      {isExploding && (
                        <motion.div
                          initial={{ opacity: 1 }}
                          animate={{ opacity: [1, 1, 0.9, 0] }}
                          transition={{ duration: 0.55 }}
                          className="absolute inset-0 z-30 pointer-events-none rounded-xl overflow-hidden bg-red-950/40"
                        >
                          {/* 1. Blinding Localized Nuclear Flash */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: [0, 1, 0.8, 0], scale: [0.8, 1.2, 1.5] }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0 bg-white shadow-[inset_0_0_30px_rgba(255,255,255,1)]"
                          />

                          {/* 2. Localized Atomic Fireball & Fire Wave Ring */}
                          <motion.div
                            initial={{ scale: 0.2, opacity: 1 }}
                            animate={{ scale: [0.2, 1.3, 1.8], opacity: [1, 0.9, 0] }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute inset-0 bg-linear-to-r from-amber-400 via-orange-500 to-red-700 rounded-xl blur-[1px]"
                          />

                          {/* 3. Contained Shattered Debris & Ember Sparks */}
                          {[
                            { x: -35, y: -20, r: 120 },
                            { x: 40, y: -22, r: -110 },
                            { x: -30, y: 22, r: 140 },
                            { x: 35, y: 20, r: -130 },
                            { x: 0, y: -30, r: 60 },
                            { x: 0, y: 30, r: -60 },
                          ].map((p, i) => (
                            <motion.div
                              key={i}
                              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0, rotate: p.r }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="absolute top-1/2 left-1/2 w-2.5 h-2.5 -mt-1.25 -ml-1.25 bg-linear-to-br from-amber-300 via-orange-600 to-slate-900 rounded-xs shadow-[0_0_6px_rgba(239,68,68,1)]"
                            />
                          ))}
                        </motion.div>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Row: Option B (Left Lower) & Option D (Right Lower) */}
            <div className="flex justify-between items-end gap-3 mb-1">
              {[1, 3].map((idx) => {
                const choice = currentQuestion.choices[idx];
                if (!choice) return null;
                const isSelected = selectedOption === choice;
                const isCorrect = choice === currentQuestion.answer;
                const hasAnswered = selectedOption !== null;
                const isHovered = hoveredOptionIdx === idx;
                const isExploding = explodingIndexes.includes(idx);

                let cardStyle = "bg-slate-950/85 border-white/15 text-slate-200 hover:border-cyan-400 hover:text-white";
                let prefix = idx === 1 ? "B" : "D";

                if (hasAnswered) {
                  if (isCorrect) {
                    cardStyle = "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.03] ring-2 ring-emerald-400/50";
                  } else if (isSelected) {
                    cardStyle = "bg-red-950/90 border-red-500 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.5)]";
                  } else {
                    cardStyle = "bg-slate-950/40 border-white/5 text-slate-600 opacity-40";
                  }
                } else if (isHovered) {
                  cardStyle = "bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-[1.03] ring-2 ring-cyan-400/50";
                }

                if (feedback === "timeout" && isCorrect) {
                  cardStyle = "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-pulse";
                }

                return (
                  <motion.div
                    key={`q-${currentIdx}-opt-${idx}`}
                    initial={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0, filter: "brightness(1)" }}
                    animate={
                      isExploding
                        ? {
                            x: [0, -10, 10, -6, 6, 0],
                            y: [0, 6, -6, 3, 0],
                            rotate: [0, -6, 8, -10, 12],
                            scale: [1, 1.05, 0.7, 0.2, 0],
                            opacity: [1, 1, 0.8, 0.3, 0],
                            filter: ["brightness(1)", "brightness(2.5)", "brightness(1.8)", "brightness(0)"],
                          }
                        : { opacity: 1, scale: 1, rotate: 0, x: 0, y: 0, filter: "brightness(1)" }
                    }
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-xl"
                  >
                    <button
                      disabled={hasAnswered}
                      onClick={() => handleAnswerSelect(choice, idx)}
                      onMouseEnter={() => setHoveredOptionIdx(idx)}
                      onMouseLeave={() => setHoveredOptionIdx(null)}
                      className={`w-56 sm:w-64 lg:w-72 pointer-events-auto border rounded-xl p-2.5 lg:p-3 transition-all duration-300 backdrop-blur-md cursor-pointer flex items-center gap-2.5 relative overflow-hidden ${cardStyle}`}
                    >
                      <span className={`w-5 h-5 lg:w-6 lg:h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold shrink-0 transition-colors ${isHovered ? "bg-cyan-400 text-slate-950 font-black" : "bg-white/10 border border-white/20 text-slate-300"}`}>
                        {prefix}
                      </span>
                      <span className="font-['Inter'] text-[10.5px] lg:text-[11.5px] font-semibold leading-snug text-left">
                        {choice}
                      </span>

                      {/* Realistic Hiroshima/Nagasaki Atomic Nuclear Bombing Effect (Strictly Contained in Card Area) */}
                      {isExploding && (
                        <motion.div
                          initial={{ opacity: 1 }}
                          animate={{ opacity: [1, 1, 0.9, 0] }}
                          transition={{ duration: 0.55 }}
                          className="absolute inset-0 z-30 pointer-events-none rounded-xl overflow-hidden bg-red-950/40"
                        >
                          {/* 1. Blinding Localized Nuclear Flash */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: [0, 1, 0.8, 0], scale: [0.8, 1.2, 1.5] }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0 bg-white shadow-[inset_0_0_30px_rgba(255,255,255,1)]"
                          />

                          {/* 2. Localized Atomic Fireball & Fire Wave Ring */}
                          <motion.div
                            initial={{ scale: 0.2, opacity: 1 }}
                            animate={{ scale: [0.2, 1.3, 1.8], opacity: [1, 0.9, 0] }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute inset-0 bg-linear-to-r from-amber-400 via-orange-500 to-red-700 rounded-xl blur-[1px]"
                          />

                          {/* 3. Contained Shattered Debris & Ember Sparks */}
                          {[
                            { x: -35, y: -20, r: 120 },
                            { x: 40, y: -22, r: -110 },
                            { x: -30, y: 22, r: 140 },
                            { x: 35, y: 20, r: -130 },
                            { x: 0, y: -30, r: 60 },
                            { x: 0, y: 30, r: -60 },
                          ].map((p, i) => (
                            <motion.div
                              key={i}
                              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0, rotate: p.r }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="absolute top-1/2 left-1/2 w-2.5 h-2.5 -mt-1.25 -ml-1.25 bg-linear-to-br from-amber-300 via-orange-600 to-slate-900 rounded-xs shadow-[0_0_6px_rgba(239,68,68,1)]"
                            />
                          ))}
                        </motion.div>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Correct / Incorrect floating feedback toast */}
        {gameState === "PLAYING" && selectedOption !== null && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 font-mono text-[10px] bg-slate-950/95 px-5 py-2.5 rounded-xl border border-white/20 pointer-events-none uppercase tracking-wider shadow-2xl">
            {feedback === "correct" && (
              <span className="text-emerald-400 font-extrabold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> DIRECT IMPACT — INCORRECT OPTIONS DISINTEGRATED (+150 XP)
              </span>
            )}
            {feedback === "incorrect" && (
              <span className="text-red-500 font-extrabold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" /> CRITICAL COLLISION — SHIELD HULL COMPROMISED (-20%)
              </span>
            )}
          </div>
        )}

        {/* Task 7: Timeout Feedback Banner */}
        {gameState === "PLAYING" && feedback === "timeout" && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-amber-950/90 border border-amber-500/40 text-amber-300 font-mono text-[10px] px-5 py-2.5 rounded-xl text-center uppercase tracking-wider flex items-center gap-2 animate-pulse shadow-2xl">
            <Clock className="w-4 h-4 text-amber-400" /> TIME EXPIRED — CORRECT ANSWER HIGHLIGHTED IN GREEN (-20% HULL)
          </div>
        )}

        {/* 1. CLASSIFIED MINIMAL & CINEMATIC BRIEFING OVERLAY */}
        {gameState === "START" && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-between p-3.5 lg:p-4 z-30 overflow-hidden font-mono select-none">
            
            {/* DUAL-COLUMN CONTENT FRAME (Compact Fit, Zero Overflow) */}
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4 py-1.5 overflow-hidden">

              {/* TASK 1: LEFT PANEL — CONCISE COMMANDER TRANSMISSION */}
              <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-3.5 backdrop-blur-md flex flex-col justify-between shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden">
                <div className="flex items-center gap-2.5 border-b border-cyan-500/20 pb-2.5">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-cyan-400/50 shrink-0 bg-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                    <img
                      src="/commander_hologram.png"
                      alt="Commander Hologram"
                      className="w-full h-full object-cover opacity-90 filter contrast-125"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-cyan-500/10 via-transparent to-cyan-500/30 pointer-events-none" />
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest block">
                      SECURE ENCRYPTED COMM LINK
                    </span>
                    <h2 className="font-['Space_Grotesk'] text-xs font-bold text-white uppercase tracking-wider">
                      COMMANDER TRANSMISSION
                    </h2>
                  </div>
                </div>

                <div className="my-auto space-y-1.5 text-slate-200 font-['Inter'] text-[10.5px] leading-relaxed">
                  <p className="font-bold text-cyan-300">Commander,</p>
                  <p>
                    Mercury's blockchain network is under attack. Your mission is to pilot the rescue spacecraft through hostile space while solving blockchain challenges under strict time pressure.
                  </p>
                  <p className="text-slate-300 text-[10px]">
                    Every correct answer clears a threat. Every wrong answer or timeout damages your spacecraft.
                  </p>
                  <p className="text-slate-300 text-[10px]">
                    Complete the mission to unlock the launch toward <strong className="text-cyan-400">Planet Venus</strong>.
                  </p>
                  <p className="font-bold text-emerald-400 pt-0.5">Good luck, Commander.</p>
                </div>

                <div className="border-t border-cyan-500/20 pt-1.5 flex items-center justify-between text-[7.5px] text-slate-400 uppercase">
                  <span>TRANSMISSION ID: CMD-8849</span>
                  <span className="text-emerald-400 flex items-center gap-1">● AUDIO SYNTH ACTIVE</span>
                </div>
              </div>

              {/* TASK 2: RIGHT PANEL — DEDICATED MISSION PARAMETERS */}
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3.5 backdrop-blur-md flex flex-col justify-between shadow-2xl">
                <div className="border-b border-white/10 pb-2 flex items-center justify-between">
                  <span className="font-['Space_Grotesk'] text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> MISSION PARAMETERS
                  </span>
                  <span className="text-[8px] font-mono text-cyan-400 uppercase">SYSTEM SPECIFICATION</span>
                </div>

                <div className="space-y-1.5 my-auto text-[9.5px] font-mono">
                  <div className="flex justify-between items-center bg-slate-950/70 py-1.5 px-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-400">Mission Type</span>
                    <span className="text-cyan-300 font-bold">Time-Based Rescue Operation</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/70 py-1.5 px-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-400">Total Challenges</span>
                    <span className="text-white font-bold">20 Sequential Gates</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/70 py-1.5 px-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-400">Time Per Question</span>
                    <span className="text-amber-400 font-bold">10 Seconds Dynamic</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/70 py-1.5 px-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-400">Passing Requirement</span>
                    <span className="text-emerald-400 font-bold">12 / 20 Correct Keys (60%)</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/70 py-1.5 px-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-400">Mission Damage</span>
                    <span className="text-red-400 font-bold">Wrong Answer / Timeout (-20%)</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/70 py-1.5 px-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-400">Mission Reward</span>
                    <span className="text-emerald-300 font-bold">Unlock Mercury Rocket Launch</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/70 py-1.5 px-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-400">Next Destination</span>
                    <span className="text-cyan-400 font-bold">Planet Venus Orbit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM CENTER LAUNCH BUTTON (Separate Bottom Console Bar, Zero Overlapping) */}
            <div className="w-full shrink-0 pt-2 pb-1 border-t border-white/10 flex items-center justify-center backdrop-blur-md">
              <button
                onClick={handleStartGame}
                className="px-9 py-2.5 bg-linear-to-r from-red-600 via-rose-500 to-red-600 hover:from-red-500 hover:to-rose-400 text-white font-bold font-mono text-xs tracking-widest rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer flex items-center justify-center gap-2.5 uppercase hover:shadow-[0_0_35px_rgba(239,68,68,0.75)] active:scale-95 border border-red-400/50"
              >
                <Rocket className="w-4 h-4 text-white animate-pulse" /> AUTHORIZE MISSION LAUNCH
              </button>
            </div>
          </div>
        )}

        {/* TASK 5, 6 & 7: CINEMATIC LAUNCH STAGING COUNTDOWN */}
        {gameState === "COUNTDOWN" && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-5 z-30 select-none font-mono">
            <div className="space-y-2">
              <span className="text-xs text-red-400 font-bold uppercase tracking-widest block animate-pulse">
                ⚠ MISSION AUTHORIZED — LAUNCH SEQUENCE INITIATED
              </span>
              <div className="text-[10px] text-cyan-400 uppercase tracking-wider flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                {preLaunchCount === 3 && "INITIALIZING NAVIGATION SYSTEMS..."}
                {preLaunchCount === 2 && "ENGINE CORE ONLINE · IGNITION READY..."}
                {preLaunchCount === 1 && "THRUSTERS AT MAXIMUM CAPABILITY..."}
                {preLaunchCount <= 0 && "MISSION LAUNCHED — HANDING OVER CONTROL TO COMMANDER"}
              </div>
            </div>

            <motion.div
              key={preLaunchCount}
              initial={{ scale: 2.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.45, type: "spring" }}
              className="text-9xl font-rushblade font-bold text-red-500 drop-shadow-[0_0_45px_rgba(239,68,68,0.95)] uppercase"
            >
              {preLaunchCount > 0 ? preLaunchCount : "LAUNCH"}
            </motion.div>

            <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.0, ease: "linear" }}
                className="h-full bg-linear-to-r from-red-500 via-amber-400 to-emerald-400"
              />
            </div>
          </div>
        )}

        {/* 2. WARP SPEED TAKEOFF OVERLAY */}
        {gameState === "WARP" && (
          <div className="absolute inset-0 bg-cyan-950/30 backdrop-blur-[1px] flex flex-col items-center justify-center p-5 text-center space-y-3 z-30">
            <h1 className="font-rushblade text-lg font-black text-cyan-300 tracking-widest uppercase animate-pulse">
              WARPING TO VENUS...
            </h1>
            <p className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest animate-ping">
              HYPERDRIVE VELOCITY: 48,000 KM/S
            </p>
          </div>
        )}

        {/* 3. SUCCESS / COMPLETE CELEBRATION OVERLAY */}
        {gameState === "SUCCESS" && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-5 z-30">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="w-16 h-16 bg-emerald-500/15 border-2 border-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)]"
            >
              <Trophy className="w-8 h-8 text-emerald-400 animate-bounce" />
            </motion.div>

            <div>
              <h2 className="text-base font-bold tracking-widest text-emerald-400 uppercase font-rushblade">
                MISSION SUCCESS — CONGRATULATIONS, COMMANDER!
              </h2>
              <p className="text-[10px] text-slate-300 mt-1.5 max-w-sm mx-auto font-mono leading-relaxed">
                All 20 consensus gates verified! Your V-2 rocket has cleared Mercury orbit and is prepared for interplanetary launch.
              </p>
            </div>

            <div className="flex gap-4 w-full max-w-xs">
              <div className="flex-1 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-2.5 text-center font-mono">
                <span className="text-[8px] text-slate-400 block uppercase">Final Score</span>
                <span className="font-bold text-sm text-emerald-300">+{score.toLocaleString()} XP</span>
              </div>
              <div className="flex-1 rounded-xl border border-amber-400/30 bg-amber-400/10 p-2.5 text-center font-mono">
                <span className="text-[8px] text-slate-400 block uppercase">Keys Verified</span>
                <span className="font-bold text-sm text-amber-300">{correctCount} / 20</span>
              </div>
            </div>

            <button
              onClick={triggerLaunchWarp}
              className="px-6 py-3 bg-linear-to-r from-emerald-500 via-cyan-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-bold font-mono text-[10px] tracking-wider rounded-xl transition shadow-[0_0_30px_rgba(16,185,129,0.4)] cursor-pointer flex items-center gap-2 animate-pulse"
            >
              <Rocket className="w-4 h-4 -rotate-45" /> WARP SPEED TO VENUS ➔
            </button>
          </div>
        )}

        {/* 4. HULL COLLAPSED GAME OVER OVERLAY */}
        {gameState === "GAMEOVER" && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-5 text-center space-y-4 z-30">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] text-xl animate-bounce">
              💥
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-widest text-red-500 uppercase font-rushblade">
                HULL COLLAPSE — SIGNAL LOST
              </h2>
              <p className="text-[9.5px] text-slate-400 mt-1 max-w-xs mx-auto font-mono">
                Volcanic space debris compromised your spacecraft hull before completing clearance gates.
              </p>
            </div>
            <button
              onClick={handleStartGame}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-[9px] tracking-wider rounded-xl transition shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer"
            >
              RETRY MISSION FLIGHT
            </button>
          </div>
        )}
      </div>

      {/* Abort Mission Confirmation Modal */}
      <AnimatePresence>
        {showAbortConfirm && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-950 border border-red-500/40 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-[0_0_35px_rgba(239,68,68,0.35)]"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/40 mx-auto flex items-center justify-center text-red-400">
                <Skull className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-rushblade text-lg text-red-400 uppercase tracking-widest">MISSION ABORT?</h3>
                <p className="text-xs text-slate-300 font-mono mt-1.5 leading-relaxed">
                  Leaving now will stop navigation and restart the Rescue Mission from the beginning.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAbortMission}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-bold uppercase rounded-xl transition cursor-pointer"
                >
                  Abort Mission
                </button>
                <button
                  onClick={() => setShowAbortConfirm(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[10px] font-bold uppercase rounded-xl border border-white/10 transition cursor-pointer"
                >
                  Continue Mission
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

