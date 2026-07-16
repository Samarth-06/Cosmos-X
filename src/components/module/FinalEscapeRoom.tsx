import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Clock, Shield, Coins, Sparkles, Volume2, VolumeX, Rocket, ShieldCheck, AlertTriangle } from "lucide-react";

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
      "Excessive network memory and block header overhead"
    ],
    answer: "Single point of failure and vulnerability to tampering"
  },
  {
    id: 2,
    module: 1,
    question: "How does a centralized clearinghouse prevent the double-spending problem?",
    choices: [
      "By using proof-of-work mining systems",
      "By acting as a single source of truth to check balances",
      "By distributing database copies to all system users",
      "By applying asymmetric encryption to client accounts"
    ],
    answer: "By acting as a single source of truth to check balances"
  },
  {
    id: 3,
    module: 2,
    question: "Which key is used to digitally sign a transaction to prove authorization?",
    choices: [
      "The recipient's public key",
      "The sender's private key",
      "The network validator's public key",
      "The shared ledger master key"
    ],
    answer: "The sender's private key"
  },
  {
    id: 4,
    module: 2,
    question: "What is the primary function of a public key in transaction validation?",
    choices: [
      "To check that the sender's private signature is authentic",
      "To decrypt private metadata inside transaction fields",
      "To compute the proof-of-work target difficulty",
      "To encrypt block contents before storage"
    ],
    answer: "To check that the sender's private signature is authentic"
  },
  {
    id: 5,
    module: 3,
    question: "What cryptographic element binds a block directly to its predecessor?",
    choices: [
      "The previous block's SHA-256 hash",
      "The block index height count",
      "The miner's public wallet address",
      "The cumulative network difficulty rate"
    ],
    answer: "The previous block's SHA-256 hash"
  },
  {
    id: 6,
    module: 3,
    question: "Which data structure is used to hash all block transactions into a single root?",
    choices: [
      "Merkle Tree",
      "Red-Black Tree",
      "Binary Search Tree",
      "Fibonacci Heap"
    ],
    answer: "Merkle Tree"
  },
  {
    id: 7,
    module: 4,
    question: "What property makes it computationally infeasible to find two different inputs that map to the same hash?",
    choices: [
      "Collision resistance",
      "Pre-image resistance",
      "Avalanche effect",
      "Deterministic scaling"
    ],
    answer: "Collision resistance"
  },
  {
    id: 8,
    module: 4,
    question: "What happens to a SHA-256 hash if you modify a single byte of transaction data?",
    choices: [
      "Only a single character of the hash shifts",
      "The hash changes completely (avalanche effect)",
      "The hash output is truncated by half",
      "The hash remains identical but turns red"
    ],
    answer: "The hash changes completely (avalanche effect)"
  },
  {
    id: 9,
    module: 5,
    question: "If block 3's transaction data is altered, what happens to block 4?",
    choices: [
      "Block 4 is deleted from all client machines",
      "Block 4's previous hash pointer becomes invalid",
      "Block 4 updates its own hash to match the changes",
      "Nothing, block 4 remains completely unaffected"
    ],
    answer: "Block 4's previous hash pointer becomes invalid"
  },
  {
    id: 10,
    module: 5,
    question: "Why is it difficult to alter historic data on a live blockchain network?",
    choices: [
      "Modifying any block requires recalculating all subsequent block hashes",
      "Historic blocks are automatically archived and locked offline",
      "The public key signatures of older transactions expire",
      "Only genesis blocks can be updated by the master node"
    ],
    answer: "Modifying any block requires recalculating all subsequent block hashes"
  },
  {
    id: 11,
    module: 6,
    question: "How do decentralized nodes synchronize database states without a central server?",
    choices: [
      "They query peer nodes using gossip protocols",
      "They rely on manual user file updates",
      "They upload state logs to a central backup cluster",
      "They download blocks from a master validator node"
    ],
    answer: "They query peer nodes using gossip protocols"
  },
  {
    id: 12,
    module: 6,
    question: "What is the primary role of a full node in a blockchain network?",
    choices: [
      "To validate and keep a complete copy of the blockchain ledger",
      "To lease computing power for web hosting services",
      "To manage private keys for active network participants",
      "To coordinate global transaction pricing lists"
    ],
    answer: "To validate and keep a complete copy of the blockchain ledger"
  },
  {
    id: 13,
    module: 7,
    question: "In Proof of Work (PoW), what criteria must a block hash meet to be valid?",
    choices: [
      "It must be numerically less than the network target difficulty",
      "It must match the transaction signatures exactly",
      "It must contain a prime number of leading zeroes",
      "It must be generated using the validator's private key"
    ],
    answer: "It must be numerically less than the network target difficulty"
  },
  {
    id: 14,
    module: 7,
    question: "How are block validators primarily chosen in a Proof of Stake (PoS) consensus network?",
    choices: [
      "Based on the value of their locked (staked) tokens",
      "Based on their computer's raw hashing speed",
      "By alphabetical ordering of node IP addresses",
      "Through arbitrary selection by the core founders"
    ],
    answer: "Based on the value of their locked (staked) tokens"
  },
  {
    id: 15,
    module: 7,
    question: "What happens to a PoS validator who double-signs blocks or validates fraudulent transactions?",
    choices: [
      "A portion of their staked tokens is slashed",
      "Their private key is revoked by the network",
      "Their hardware is shut down remotely",
      "They are blocked from sending basic transactions"
    ],
    answer: "A portion of their staked tokens is slashed"
  },
  {
    id: 16,
    module: 8,
    question: "Which feature of public blockchains allows open transparency for auditing transactions?",
    choices: [
      "Immutable, publicly accessible ledger history",
      "Encrypted state channels for validator nodes",
      "Private transaction mempools",
      "Central database access controls"
    ],
    answer: "Immutable, publicly accessible ledger history"
  },
  {
    id: 17,
    module: 8,
    question: "How does a blockchain explorer trace the history of a digital asset?",
    choices: [
      "By querying bank account records",
      "By scanning the chain of inputs and outputs across blocks",
      "By tracing user IP addresses on network nodes",
      "By decrypting transaction private keys"
    ],
    answer: "By scanning the chain of inputs and outputs across blocks"
  },
  {
    id: 18,
    module: 2,
    question: "What is the consequence of losing your wallet's private key?",
    choices: [
      "Permanently losing access to recover or sign transactions for your funds",
      "The blockchain will email you a reset link after 24 hours",
      "Your tokens are automatically converted into cash",
      "The network issues a replacement private key matching your ID"
    ],
    answer: "Permanently losing access to recover or sign transactions for your funds"
  },
  {
    id: 19,
    module: 4,
    question: "Which of the following is an asymmetric encryption/signature algorithm, not a cryptographic hash?",
    choices: [
      "RSA-2048",
      "SHA-256",
      "Keccak-256",
      "MD5"
    ],
    answer: "RSA-2048"
  },
  {
    id: 20,
    module: 5,
    question: "What mechanisms prevent a rogue node from successfully writing fake transactions onto the block history?",
    choices: [
      "Peer nodes independently audit blocks against rules and reject invalid sets",
      "The blockchain automatically alerts internet service providers",
      "The central coordinator node encrypts the rogue node's ledger",
      "The rogue node's keyboard is locked by the gossip protocol"
    ],
    answer: "Peer nodes independently audit blocks against rules and reject invalid sets"
  }
];

export default function FinalEscapeRoom({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameActionsRef = useRef<{
    fireLaser: () => void;
    triggerCollision: () => void;
    setWarpSpeed: (active: boolean) => void;
  } | null>(null);

  // Game/Quiz UI States
  const [gameState, setGameState] = useState<"START" | "COUNTDOWN" | "PLAYING" | "WARP" | "GAMEOVER" | "SUCCESS">("START");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds per question
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [correctCount, setCorrectCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [warpCountdown, setWarpCountdown] = useState(4);
  const [preLaunchCount, setPreLaunchCount] = useState(3);

  // Audio Synthesizer Logic
  const playSynth = (type: "laser" | "crash" | "explosion" | "warp") => {
    if (!audioEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      if (type === "laser") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "crash") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === "explosion") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "warp") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(60, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 4.0);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2.0);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 4.0);
      }
    } catch (e) {
      console.warn("Synth failed: ", e);
    }
  };

  // Timer loop for active question
  useEffect(() => {
    if (gameState !== "PLAYING" || selectedOption !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswerSelect(""); // triggers timeout/failure
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentIdx, selectedOption]);

  // Countdown loop
  useEffect(() => {
    if (gameState !== "COUNTDOWN") return;
    
    if (preLaunchCount === 3) {
       playSynth("warp");
    }

    if (preLaunchCount <= 0) {
      setGameState("PLAYING");
      return;
    }

    const timer = setTimeout(() => {
      setPreLaunchCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState, preLaunchCount]);

  // Answer selection callback
  const handleAnswerSelect = (option: string) => {
    setSelectedOption(option);
    const correct = RESCUE_QUESTIONS[currentIdx].answer;

    if (option === correct) {
      setScore((s) => s + 150 + timeLeft * 10);
      setCorrectCount((c) => c + 1);
      playSynth("laser");
      gameActionsRef.current?.fireLaser();
    } else {
      setShield((s) => Math.max(0, s - 20));
      playSynth("crash");
      gameActionsRef.current?.triggerCollision();
    }

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      if (currentIdx < RESCUE_QUESTIONS.length - 1) {
        setCurrentIdx((i) => i + 1);
        setTimeLeft(10);
        setSelectedOption(null);
      } else {
        evaluateGameOutcome();
      }
    }, 1500);
  };

  const evaluateGameOutcome = () => {
    if (shield > 0 && correctCount >= 12) {
      setGameState("SUCCESS");
    } else {
      setGameState("GAMEOVER");
    }
  };

  const handleStartGame = () => {
    setCurrentIdx(0);
    setTimeLeft(10);
    setScore(0);
    setShield(100);
    setCorrectCount(0);
    setSelectedOption(null);
    setPreLaunchCount(3);
    setGameState("COUNTDOWN");
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

    // Standard Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04040a, 0.008);

    // Position camera closer & lower to look UP slightly at the ship, making it clearly visible
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 2.2, 10.5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor(0x04040a, 1);

    // Ambient light - strong white light to fully illuminate the spacecraft details
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    // Directional light from front-top-right to cast metallic reflections
    const dirLight = new THREE.DirectionalLight(0x00ffff, 4.0);
    dirLight.position.set(5, 10, 15);
    scene.add(dirLight);

    // Spotlight pointing ahead
    const shipSpot = new THREE.SpotLight(0xef4444, 15, 90, Math.PI / 8, 0.5, 1.0);
    shipSpot.position.set(0, 0, 0);
    scene.add(shipSpot);
    scene.add(shipSpot.target);

    // --- SPACESHIP DESIGN (Premium Silver & Red Stripe) ---
    const shipGroup = new THREE.Group();
    scene.add(shipGroup);

    // 1. Silver metallic Fuselage
    const fuselageGeom = new THREE.CylinderGeometry(0.04, 0.45, 2.8, 10);
    fuselageGeom.rotateX(Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1, // Silver metallic
      roughness: 0.1,
      metalness: 0.95,
    });
    const fuselage = new THREE.Mesh(fuselageGeom, bodyMat);
    shipGroup.add(fuselage);

    // 2. Bold Red Racing Stripe
    const stripeGeom = new THREE.BoxGeometry(0.1, 0.15, 2.2);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    const stripe = new THREE.Mesh(stripeGeom, stripeMat);
    stripe.position.set(0, 0.32, -0.1);
    shipGroup.add(stripe);

    // 3. Cockpit Glass
    const cockpitGeom = new THREE.SphereGeometry(0.24, 10, 10);
    cockpitGeom.scale(1, 0.65, 1.8);
    const cockpitMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan glass
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.8,
    });
    const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat);
    cockpit.position.set(0, 0.2, -0.6);
    shipGroup.add(cockpit);

    // 4. Wings with Red tips
    const wingGeom = new THREE.BoxGeometry(1.6, 0.06, 0.8);
    wingGeom.translate(0, -0.05, 0.2);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark carbon wings
      roughness: 0.3,
      metalness: 0.8,
    });
    const wingL = new THREE.Mesh(wingGeom, wingMat);
    wingL.position.x = -0.95;
    wingL.rotation.y = 0.12;
    wingL.rotation.z = -0.05;
    shipGroup.add(wingL);

    const wingR = wingL.clone();
    wingR.position.x = 0.95;
    wingR.rotation.y = -0.12;
    wingR.rotation.z = 0.05;
    shipGroup.add(wingR);

    // Thruster exhaust pipe
    const thrusterGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.3, 8);
    thrusterGeom.rotateX(Math.PI / 2);
    const thrusterPipe = new THREE.Mesh(thrusterGeom, new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.4 }));
    thrusterPipe.position.set(0, 0, 1.35);
    shipGroup.add(thrusterPipe);

    // Thruster exhaust flame
    const exhaustGeom = new THREE.ConeGeometry(0.16, 1.0, 8);
    exhaustGeom.rotateX(-Math.PI / 2);
    exhaustGeom.translate(0, 0, 1.85);
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xd97706,
      emissiveIntensity: 6,
      transparent: true,
      opacity: 0.95,
    });
    const exhaust = new THREE.Mesh(exhaustGeom, flameMat);
    shipGroup.add(exhaust);

    // Headlight Spot target
    const headlightTarget = new THREE.Object3D();
    headlightTarget.position.set(0, 0, -40);
    shipGroup.add(headlightTarget);
    shipSpot.target = headlightTarget;

    // Position ship initially
    shipGroup.position.set(0, -0.6, 0);

    // Laser and Collision Emitters
    const activeLasers: THREE.Mesh[] = [];
    const particles: any[] = [];
    
    // --- REALISTIC FRAGMENTED ASTEROID DESIGN (Volcanic Lava theme) ---
    const asteroidGroup = new THREE.Group();
    scene.add(asteroidGroup);

    // Main rock core (Jagged Dodecahedron)
    const rockCoreGeom = new THREE.DodecahedronGeometry(1.6, 1);
    const posAttr = rockCoreGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);
      const distort = 0.82 + Math.random() * 0.36;
      posAttr.setXYZ(i, vx * distort, vy * distort, vz * distort);
    }
    rockCoreGeom.computeVertexNormals();

    const rockCoreMat = new THREE.MeshStandardMaterial({
      color: 0x27272a, // Deep charcoal rock
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
      emissive: 0x3f1616, // volcanic dim red glow in cracks
      emissiveIntensity: 1.2,
    });
    const rockCore = new THREE.Mesh(rockCoreGeom, rockCoreMat);
    asteroidGroup.add(rockCore);

    // Volcanic lava neon lines overlay
    const lavaEdges = new THREE.EdgesGeometry(rockCoreGeom);
    const lavaWire = new THREE.LineSegments(lavaEdges, new THREE.LineBasicMaterial({ color: 0xff3700, linewidth: 2 }));
    asteroidGroup.add(lavaWire);

    // Add 4 smaller orbit debris rocks to make the obstacle cluster look highly realistic
    const miniRockGeom = new THREE.IcosahedronGeometry(0.35, 0);
    const miniRockMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.9, flatShading: true });
    
    const offsets = [
      new THREE.Vector3(2.0, -0.5, 0.8),
      new THREE.Vector3(-1.8, 0.8, -1.2),
      new THREE.Vector3(0.5, -1.5, -2.0),
      new THREE.Vector3(-0.6, 1.8, 1.5)
    ];

    offsets.forEach((off) => {
      const miniMesh = new THREE.Mesh(miniRockGeom, miniRockMat);
      miniMesh.position.copy(off);
      miniMesh.scale.set(Math.random() * 0.8 + 0.6, Math.random() * 0.8 + 0.6, Math.random() * 0.8 + 0.6);
      asteroidGroup.add(miniMesh);
    });

    asteroidGroup.position.set(0, -0.5, -35); // place target directly ahead

    // Particle Burst Creator
    const createExplosion = (pos: THREE.Vector3, colorHex: number, count = 20) => {
      const geom = new THREE.SphereGeometry(0.12, 4, 4);
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
          life: 35,
          maxLife: 35,
        });
      }
    };

    // Stardust Field (Lines representing high speed)
    const starCount = 200;
    const starsGroup = new THREE.Group();
    scene.add(starsGroup);

    const starLines: { line: THREE.Line; speed: number; length: number; ox: number; oy: number; oz: number }[] = [];
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

    for (let i = 0; i < starCount; i++) {
      const ox = (Math.random() - 0.5) * 50;
      const oy = (Math.random() - 0.5) * 35;
      const oz = Math.random() * -250;
      
      const geom = new THREE.BufferGeometry();
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1.2)];
      geom.setFromPoints(points);

      const line = new THREE.Line(geom, lineMat);
      line.position.set(ox, oy, oz);
      starsGroup.add(line);

      starLines.push({
        line,
        speed: Math.random() * 0.7 + 1.4,
        length: 1.2,
        ox,
        oy,
        oz,
      });
    }

    // Action Ref hooks mapping
    let shakeIntensity = 0;
    let warpActive = gameState === "WARP";
    let damageFireDuration = 0;

    gameActionsRef.current = {
      fireLaser: () => {
        // Roll pilot dodge rotation
        shipGroup.rotation.z = Math.PI * 2;
        
        // Spawn wings lasers
        const laserMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const laserL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5, 6), laserMat);
        laserL.rotation.x = Math.PI / 2;
        laserL.position.set(-0.9, 0, -0.6);
        shipGroup.add(laserL);

        const laserR = laserL.clone();
        laserR.position.x = 0.9;
        shipGroup.add(laserR);

        activeLasers.push(laserL, laserR);

        // Explode asteroid cluster
        setTimeout(() => {
          playSynth("explosion");
          createExplosion(asteroidGroup.position, 0x00ffff, 25);
          // scale down asteroid to mock destruction
          asteroidGroup.scale.set(0.01, 0.01, 0.01);
          
          setTimeout(() => {
            // Respawn asteroid in distance
            asteroidGroup.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4 - 0.5, -35);
            asteroidGroup.scale.set(1, 1, 1);
          }, 850);
        }, 300);
      },
      triggerCollision: () => {
        // Bring asteroid close for collision visual
        asteroidGroup.position.set(0, -0.5, -4);
        setTimeout(() => {
          shakeIntensity = 0.55;
          createExplosion(shipGroup.position, 0xff3700, 25);
          shipGroup.rotation.x = -0.3; // pitch back
          asteroidGroup.position.set(0, -0.5, -35);
          // Set damaged status -> catch fire for 3.5 seconds
          damageFireDuration = 3.5;
        }, 120);
      },
      setWarpSpeed: (active: boolean) => {
        warpActive = active;
      },
    };

    // Frame Resize binding
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Spaceship floating motion idle
      if (!warpActive) {
        shipGroup.position.y = -0.6 + Math.sin(elapsed * 2.2) * 0.12;
        shipGroup.position.x = Math.cos(elapsed * 1.6) * 0.08;
        shipGroup.rotation.z += (0 - shipGroup.rotation.z) * 0.1;
        shipGroup.rotation.x += (0 - shipGroup.rotation.x) * 0.1;
        exhaust.scale.set(1, 1 + Math.sin(elapsed * 18) * 0.15, 1);
        asteroidGroup.rotation.y += 0.012;
        asteroidGroup.rotation.z += 0.004;
        
        // CATCHING FIRE (Trailing fiery smoke particles if damaged)
        if (damageFireDuration > 0) {
          damageFireDuration -= 0.016; // approx time step
          if (Math.random() < 0.35) {
            // Spawn flame bubble particle
            const fireGeom = new THREE.SphereGeometry(Math.random() * 0.16 + 0.06, 5, 5);
            const fireMat = new THREE.MeshBasicMaterial({
              color: Math.random() > 0.4 ? 0xff4500 : 0xffaa00,
              transparent: true,
              opacity: 0.85
            });
            const fireMesh = new THREE.Mesh(fireGeom, fireMat);
            fireMesh.position.copy(shipGroup.position);
            fireMesh.position.x += (Math.random() - 0.5) * 0.4;
            fireMesh.position.y += (Math.random() - 0.5) * 0.2 + 0.2;
            fireMesh.position.z += 0.2 + Math.random() * 0.6;
            scene.add(fireMesh);

            particles.push({
              mesh: fireMesh,
              vx: (Math.random() - 0.5) * 0.06,
              vy: Math.random() * 0.08 + 0.06, // float up
              vz: Math.random() * 0.12 + 0.18, // float back
              life: 25,
              maxLife: 25
            });
          }
        }
      } else {
        // Warp flight
        shipGroup.position.set(0, -0.6, 0);
        shipGroup.rotation.set(0, 0, 0);
        shipGroup.scale.addScalar(-0.0035);
        exhaust.scale.set(1.4, 4.5, 1.4);
        flameMat.color.setHex(0x00ffff); // Cyan drive plume
        flameMat.emissive.setHex(0x06b6d4);
      }

      // Update stardust line segments Z values
      starLines.forEach((s) => {
        const starSpeed = warpActive ? 32 : s.speed;
        const starLen = warpActive ? 42 : s.length;
        s.line.position.z += starSpeed;
        s.line.scale.z = starLen;

        if (s.line.position.z > 25) {
          s.line.position.z = -250;
          s.line.position.x = (Math.random() - 0.5) * 50;
          s.line.position.y = (Math.random() - 0.5) * 35;
        }
      });

      // Fly lasers forward
      for (let i = activeLasers.length - 1; i >= 0; i--) {
        const l = activeLasers[i];
        l.position.z -= 3.0;
        if (l.position.z < -65) {
          shipGroup.remove(l);
          activeLasers.splice(i, 1);
        }
      }

      // Move explosion shards
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

      // Screen/Camera Shaking damping
      if (shakeIntensity > 0) {
        camera.position.x = (Math.random() - 0.5) * shakeIntensity;
        camera.position.y = 2.2 + (Math.random() - 0.5) * shakeIntensity;
        shakeIntensity *= 0.88;
        if (shakeIntensity < 0.02) shakeIntensity = 0;
      } else {
        camera.position.set(0, 2.2, 10.5);
      }
      camera.lookAt(0, 0, -20);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // Clean up Three.js contexts
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

  const currentQuestion = RESCUE_QUESTIONS[currentIdx];

  return (
    <div className="bg-slate-950/70 border border-red-500/20 rounded-2xl p-4 lg:p-5 backdrop-blur-md shadow-2xl flex flex-col justify-between h-full min-h-0 flex-1 overflow-hidden select-none relative z-10">
      
      {/* HUD HEADER PANEL */}
      <div className="w-full flex items-center justify-between mb-3.5 bg-slate-950/60 border border-white/5 px-4 py-2.5 rounded-xl backdrop-blur-md shrink-0 font-mono text-[9px] text-slate-400">
        <div className="flex gap-4">
          <div>
            <span className="block opacity-60">RESCUE SCORE</span>
            <span className="text-[11px] font-bold text-white flex items-center gap-1 mt-0.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> {score.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="block opacity-60">Consensus sealed</span>
            <span className="text-[11px] font-bold text-emerald-400 mt-0.5">{correctCount} / 20</span>
          </div>
        </div>

        {gameState === "PLAYING" && (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="opacity-60">SHIELD HULL STATUS</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                  <div
                    style={{ width: `${shield}%` }}
                    className={`h-full transition-all duration-300 ${shield > 40 ? "bg-cyan-400" : "bg-red-500"}`}
                  />
                </div>
                <span className="text-[10px] text-white font-bold">{shield}%</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`p-1.5 rounded-lg border transition-all ${
            audioEnabled
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
              : "bg-slate-900/60 border-white/5 text-slate-500"
          }`}
          title="Toggle Synthesizer Feedback"
        >
          {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* TWO-COLUMN LAYOUT (FLUID HEIGHT, FIT ON SCREEN) */}
      <div className="flex-1 min-h-0 flex flex-row gap-4">
        
        {/* Left Column: Square Canvas Viewport */}
        <div className="w-[45%] aspect-square h-full max-h-[420px] bg-[#020207] border border-white/10 rounded-2xl overflow-hidden relative flex items-center justify-center shrink-0">
          
          {/* WebGL Canvas */}
          {(gameState === "PLAYING" || gameState === "WARP") && (
            <canvas ref={canvasRef} className="w-full h-full block" />
          )}

          {/* 1. START OVERLAY */}
          {gameState === "START" && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-5 text-center space-y-4">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse">
                <Sparkles className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-[11.5px] font-bold tracking-widest text-white uppercase font-rushblade">
                  MERCURY RESCUE TRANSIT
                </h2>
                <p className="text-[9px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed font-mono">
                  Pilot the V-2 escape rocket through the volcanic space debris grid.
                </p>
              </div>
              <button
                onClick={handleStartGame}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-[9px] tracking-wider rounded-lg transition shadow-[0_0_15px_rgba(220,38,38,0.3)] cursor-pointer"
              >
                START ENGINES
              </button>
            </div>
          )}

          {/* 1.5 COUNTDOWN OVERLAY */}
          {gameState === "COUNTDOWN" && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-5 text-center space-y-4 z-20">
              <motion.div
                key={preLaunchCount}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-7xl font-rushblade font-bold text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] uppercase"
              >
                {preLaunchCount > 0 ? preLaunchCount : "LAUNCH"}
              </motion.div>
            </div>
          )}

          {/* 2. WARP SPEED TAKEOFF OVERLAY */}
          {gameState === "WARP" && (
            <div className="absolute inset-0 bg-cyan-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center p-5 text-center space-y-3">
              <h1 className="font-rushblade text-base font-black text-cyan-300 tracking-widest uppercase animate-pulse">
                WARPING TO VENUS...
              </h1>
              <p className="font-mono text-[8px] text-cyan-400 font-bold uppercase tracking-widest animate-ping">
                SPEED: 48,000 KM/S
              </p>
            </div>
          )}

          {/* 3. SUCCESS / COMPLETE OVERLAY */}
          {gameState === "SUCCESS" && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-5 text-center space-y-4">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-bounce text-sm">
                🛸
              </div>
              <div>
                <h2 className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase font-rushblade">
                  ESC PROTOCOL SECURED
                </h2>
                <p className="text-[8.5px] text-slate-400 mt-1 max-w-xs mx-auto font-mono">
                  All sectors verify consensus locks. Ready for launch takeoff!
                </p>
              </div>
              <button
                onClick={triggerLaunchWarp}
                className="px-5 py-2 bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold font-mono text-[9px] tracking-wider rounded-lg transition shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-1.5 animate-pulse"
              >
                <Rocket className="w-3.5 h-3.5 -rotate-45" /> WARP SPEED TO VENUS ➔
              </button>
            </div>
          )}

          {/* 4. HULL COLLAPSED GAME OVER OVERLAY */}
          {gameState === "GAMEOVER" && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-5 text-center space-y-4">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-bounce text-sm">
                💥
              </div>
              <div>
                <h2 className="text-[11px] font-bold tracking-widest text-red-500 uppercase font-rushblade">
                  HULL COLLAPSE
                </h2>
                <p className="text-[8.5px] text-slate-400 mt-1 max-w-xs mx-auto font-mono">
                  Space debris has vaporized your spacecraft. Core links lost.
                </p>
              </div>
              <button
                onClick={handleStartGame}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-[9px] tracking-wider rounded-lg transition shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer"
              >
                RETRY FLIGHT
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Question Content / Stats Panel */}
        <div className="flex-1 flex flex-col justify-between min-h-0 pl-2">
          
          {/* Display instructions/rules when not actively answering */}
          {gameState !== "PLAYING" ? (
            <div className="h-full flex flex-col justify-center space-y-4 p-2 text-slate-300">
              <div className="border-l-2 border-red-500 pl-3">
                <span className="font-mono text-[9px] text-red-400 font-bold uppercase tracking-widest">
                  MISSION TELEMETRY SYSTEM
                </span>
                <h3 className="font-rushblade text-white text-xs lg:text-sm tracking-wider uppercase mt-0.5">
                  GOSSIP NETWORK INITIALIZER
                </h3>
              </div>
              <div className="text-[10.5px] font-mono leading-relaxed space-y-2.5 opacity-90">
                <p>
                  To secure launch clearances for your assembled spacecraft, you must solve a sequential grid of **20 questions** covering the Mercury curriculum modules.
                </p>
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 space-y-1 text-slate-400 text-[10px]">
                  <div className="flex gap-2"><span>⚡</span><span>Select choices before the **10-second timer** expires.</span></div>
                  <div className="flex gap-2"><span>⚡</span><span>**Correct Answers** activate laser cannons to disintegrate debris.</span></div>
                  <div className="flex gap-2"><span>⚡</span><span>**Incorrect/Timeouts** trigger high-impact collision damage.</span></div>
                  <div className="flex gap-2"><span>⚡</span><span>At least **12 correct answers** are required to successfully launch.</span></div>
                </div>
              </div>
              <p className="text-[9px] font-mono text-slate-500 italic">
                Secure flight logs can be repeated multiple times. Ensure consensus signatures are sealed.
              </p>
            </div>
          ) : (
            currentQuestion && (
              <div className="h-full flex flex-col justify-between min-h-0">
                
                {/* Active Question Title & Time */}
                <div className="border-l-2 border-red-500 pl-3.5 select-text mb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8.5px] text-red-400 font-bold uppercase tracking-widest">
                      CHALLENGE {currentIdx + 1} / 20 · MODULE 0{currentQuestion.module}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-white bg-slate-950/70 border border-white/10 px-2 py-0.5 rounded-full select-none">
                      <Clock className="w-3 h-3 text-red-400 animate-pulse" />
                      <span className={timeLeft <= 3 ? "text-red-500 animate-pulse font-extrabold" : "text-slate-200"}>
                        {timeLeft}s
                      </span>
                    </div>
                  </div>
                  <h3 className="font-sans text-[11px] lg:text-[12px] font-bold text-slate-100 mt-1.5 select-text leading-snug">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* MCQ Selection Choices */}
                <div className="flex-1 min-h-0 flex flex-col justify-center gap-2">
                  {currentQuestion.choices.map((choice, i) => {
                    const isSelected = selectedOption === choice;
                    const isCorrect = choice === currentQuestion.answer;
                    const hasAnswered = selectedOption !== null;

                    let btnStyle = "bg-slate-950/60 hover:bg-slate-950/90 border-white/10 text-slate-300 hover:text-white";
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]";
                      } else if (isSelected) {
                        btnStyle = "bg-red-950/40 border-red-500 text-red-400 font-bold shadow-[0_0_10px_rgba(239,68,68,0.15)]";
                      } else {
                        btnStyle = "bg-slate-950/30 border-white/5 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={i}
                        disabled={hasAnswered}
                        onClick={() => handleAnswerSelect(choice)}
                        className={`w-full text-left border p-2.5 rounded-xl text-[9.5px] font-sans transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-white/5 pt-2.5 mt-3 flex justify-between font-mono text-[8px] text-slate-500">
                  <span>SECURE SYSTEM TRANSMISSION ACTIVE</span>
                  <span>WARNING: DEBRIS DENSITIES INCREASING UPSTREAM</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
