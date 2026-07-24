# 🌌 CosmosX — Interactive 3D Blockchain Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stellar](https://img.shields.io/badge/Blockchain-Stellar%20%2F%20Soroban-purple.svg)](https://stellar.org)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-cyan.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

> **Master Blockchain Fundamentals & Stellar Soroban Smart Contracts through Cinematic 3D Solar System Space Simulations.**

CosmosX turns abstract blockchain concepts into interactive, visual space missions. Explorers learn decentralization, digital ledgers, block header hashing, consensus mechanisms, smart contract execution, and NFT trading—all before submitting their first transaction on the Stellar Testnet.

---

## 📌 Table of Contents

- [🌌 CosmosX — Interactive 3D Blockchain Learning Platform](#-cosmosx--interactive-3d-blockchain-learning-platform)
  - [📌 Table of Contents](#-table-of-contents)
  - [🚀 Overview](#-overview)
  - [✨ Key Features \& Recent Enhancements](#-key-features--recent-enhancements)
  - [🗺️ Application Route Map](#️-application-route-map)
  - [🎓 Mercury Expedition Curriculum (Modules 1–8)](#-mercury-expedition-curriculum-modules-18)
  - [📂 Directory \& Repository Structure](#-directory--repository-structure)
  - [🛠️ Technology Stack](#️-technology-stack)
  - [⚙️ Local Setup \& Installation](#️-local-setup--installation)
  - [🔗 Stellar Testnet \& Soroban Smart Contracts](#-stellar-testnet--soroban-smart-contracts)
  - [⚡ Supabase Integration](#-supabase-integration)
  - [📚 Documentation \& References](#-documentation--references)

---

## 🚀 Overview

Learning blockchain development can feel overwhelming with abstract cryptographic math, terminal commands, and confusing terminology. **CosmosX** solves this by providing a **game-based 3D visual learning environment** where every planet represents a core domain of blockchain technology:

1. **Mercury**: Blockchain Foundations (Centralization vs. Decentralization, Ledgers, Blocks, Cryptography, Consensus, Smart Contracts, Tokens, Use Cases)
2. **Venus**: Cryptography, Keypairs & SHA-256 Hashing
3. **Earth**: Consensus Mechanisms & Federated Byzantine Agreement (SCP)
4. **Mars**: Smart Contracts & Soroban Execution Environments
5. **Jupiter**: Scalability, Layer 2 & Rollups
6. **Saturn**: Automated Market Makers (AMM) & Liquidity Pools
7. **Uranus**: Cross-Chain Bridges & Cryptographic Proofs
8. **Neptune**: Stellar Mainnet Launch & Real Transaction Execution

---

## ✨ Key Features & Recent Enhancements

- 🪐 **Interactive 3D Solar System Engine**: Real-time Three.js / React Three Fiber interactive 3D planets with orbital physics, dynamic light reflections, and smooth camera transitions.
- 🎨 **Task 1.3 Standardized Learning Typography**: Unified visual hierarchy across theory panels, interactive simulations, and knowledge checks using `Space Grotesk` headings, `Inter` body text, and `JetBrains Mono` code snippets.
- 🎓 **8-Module Mercury Curriculum**: 30+ interactive tasks including Middleman Mapping, Corrupted Command Auditing, Barter Dilemma Solving, Mempool Gatekeeping, and Database vs. Blockchain matrices.
- ⏱️ **Timed Escape Room Mission**: Final challenge forcing learners to apply all 8 modules under a timed 8-minute countdown to graduate from Mercury.
- 💎 **Decentralized Exoplanet NFT Marketplace**: Soroban smart contract-backed asset trading with Freighter wallet integration, live ledger synchronization, buy/list/offer operations, and local fallback mode.
- 🏆 **Gamification System**: XP accumulation, rank progression (Cadet → Galaxy Master), verifiable achievement badges, and streak tracking.
- 🛡️ **Agent Profile Dossier**: Instant slide-over profile drawer showing learner stats, honors, module scores, and Supabase auth sync status.
- ⚡ **Supabase Auth & Database Ready**: Fully typed query interface (`supabase-queries.ts`) supporting email auth, OAuth, profiles, user progress, and task scores.

---

## 🗺️ Application Route Map

CosmosX uses **TanStack Router** for fully type-safe, client-side routing. Below is the complete route tree:

| Route Path | Component / Page | Description |
|---|---|---|
| `/` | `src/routes/index.tsx` | **Main Solar System 3D Landing Page** — Interactive 3D solar system, hero section, planetary academy previews, and global HUD. |
| `/planets/mercury` | `src/routes/planets/mercury.tsx` | **Mercury Expedition Workspace** — 8-Module curriculum workspace, theory views, interactive games, Agent Profile Dossier, and Escape Room. |
| `/planets/$planet` | `src/routes/planets/$planet.tsx` | **Planet Explorer Fallback** — Dynamic route handler for Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. |
| `/marketplace` | `src/routes/marketplace.tsx` | **Exoplanet NFT Marketplace** — Soroban contract-backed asset trading, data room explorer, Freighter wallet connect, and portfolio dashboard. |
| `/dashboard` | `src/routes/dashboard.tsx` | **Commander Dashboard** — Personal learning metrics, valuation charts, XP breakdown, and progress tracking. |
| `/leaderboard` | `src/routes/leaderboard.tsx` | **Global Leaderboard** — Community rank standings, top explorer profiles, and live activity feeds. |
| `/community` | `src/routes/community.tsx` | **Explorer Community** — Discussion forums, strategy guides, and peer Q&A. |
| `/docs` | `src/routes/docs.tsx` | **Documentation Hub** — Integrated technical guides, Soroban setup tutorials, and curriculum reference manual. |

---

## 🎓 Mercury Expedition Curriculum (Modules 1–8)

```
MERCURY EXPEDITION
├── Module 01: Why Does Blockchain Exist? (Dark Horizon)
│   ├── Task 1.1: Map the Middlemen (Centralized Payment Routing)
│   ├── Task 1.2: Corrupted Command (Single Point of Failure Audit)
│   ├── Task 1.3: Trade Dilemma (The Trust Problem & Barter Solver)
│   └── Module 01 Verification Gate
├── Module 02: Transactions & Digital Ledgers (First Light)
│   ├── Task 2.1–2.5: Transaction Payloads, Append-Only Bookkeeping, Mempool Gatekeeper
│   └── Module 02 Verification Gate
├── Module 03: Blocks & Blockchain Structure (Solar Rise)
│   ├── Task 3.1–3.5: Block Headers, Genesis Blocks, Hashing Links, Throughput
│   └── Module 03 Verification Gate
├── Module 04: Cryptography & Keys (Peak Light)
│   ├── Task 4.1–4.5: Hash Functions, Public/Private Keypairs, Signatures
│   └── Module 04 Verification Gate
├── Module 05: Consensus Mechanisms (Solar Flare)
│   ├── Task 5.1–5.5: Byzantine Fault Tolerance, FBA, Quorum Slices
│   └── Module 05 Verification Gate
├── Module 06: Smart Contracts & Execution (Descent)
│   ├── Task 6.1–6.5: Automated Code, State Transitions, Soroban Runtime
│   └── Module 06 Verification Gate
├── Module 07: Tokens & Asset Standards (Twilight)
│   ├── Task 7.1–7.5: Native Assets, Fungible Tokens, Non-Fungible Tokens (NFTs)
│   └── Module 07 Verification Gate
├── Module 08: Real-World Applications & Synthesis (Nightfall)
│   ├── Task 8.1–8.5: Immutability, Traceability, DB vs. Blockchain Matrix
│   ├── Module 08 Verification Gate
│   └── FINAL MISSION: Mercury Escape Room (Timed 8-Minute Challenge)
```

---

## 📂 Directory & Repository Structure

```
CosmosX/
├── contracts/                        # Soroban Smart Contracts (Rust)
│   ├── achievement/                  # Achievement NFT Minting Contract
│   │   ├── src/lib.rs                # Rust Contract logic
│   │   └── Cargo.toml                # Soroban contract manifest
│   └── marketplace/                  # Exoplanet Marketplace Contract
│       ├── src/lib.rs                # Asset Registration, Minting, Listing & Bids
│       └── Cargo.toml
├── docs/                             # Comprehensive Technical Documentation
│   ├── stellar-integration/          # 7-Part Stellar Testnet Integration Guides
│   ├── ADMIN_GUIDE.md                # Platform Administration Guide
│   ├── CONTRACTS.md                  # Soroban Smart Contract Architecture Spec
│   ├── DEPLOYMENT.md                 # Deployment & Hosting Specs
│   ├── USER_GUIDE.md                 # Learner & Commander Handbook
│   ├── ROADMAP.md                    # Project Vision & Future Planetary Modules
│   └── cosmox_vision_plan.md         # Full Technical Architecture & Vision
├── public/                           # Public Static Web Assets
│   ├── logo.jpg                      # Official CosmosX Planet Logo
│   └── favicon.ico                   # Browser Favicon
├── resources/                        # External Reference Materials & Assets
│   └── CosmosX_Mercury_Curriculum.pdf# Complete 8-Module Official Curriculum Manual
├── src/                              # Frontend Source Code
│   ├── assets/                       # Planet Textures & Diagrams
│   ├── components/                   # Core React Components
│   │   ├── module/                   # Module Theory, Interactive Simulations & Games
│   │   ├── SolarSystem.tsx           # Three.js 3D Solar System Canvas
│   │   ├── Nav.tsx                   # Top Glassmorphism Navigation Bar
│   │   ├── NFTCard.tsx               # Marketplace NFT Card Component
│   │   └── Planet3DViewer.tsx        # 3D Planet Previewer Component
│   ├── features/                     # Feature Modules
│   │   ├── achievements/             # Soroban Achievement Minting Hooks & Buttons
│   │   └── marketplace/              # Marketplace Chain State Sync & Admin Panels
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useUserProgress.ts        # Learner Progress & XP Sync Hook
│   │   ├── useTaskScore.ts           # Task Evaluation & Score Recording Hook
│   │   └── useAuth.ts                # Supabase Authentication Hook
│   ├── lib/                          # Core Data Stores & Utilities
│   │   ├── stellar/                  # Stellar SDK & Freighter Wallet Client
│   │   ├── supabase.ts               # Supabase Client Initialization
│   │   ├── supabase-queries.ts       # Typed Supabase Database Helper Functions
│   │   ├── user-store.ts             # Gamification & XP State Management
│   │   ├── module1-store.ts          # Mercury Progress & Verification Store
│   │   └── mercury-curriculum.ts     # Mercury Curriculum Content Schema
│   ├── routes/                       # TanStack Router Page Routes
│   │   ├── __root.tsx                # Root App Shell & Layout
│   │   ├── index.tsx                 # Solar System 3D Landing Page
│   │   ├── marketplace.tsx           # Exoplanet NFT Marketplace Page
│   │   ├── dashboard.tsx             # Learner Dashboard Page
│   │   ├── leaderboard.tsx           # Global Leaderboard Page
│   │   ├── community.tsx             # Community Forum Page
│   │   ├── docs.tsx                  # In-App Documentation Page
│   │   └── planets/                  # Planet Workspace Routes
│   ├── routeTree.gen.ts              # Auto-generated TanStack Route Tree
│   ├── styles.css                    # Unified Design Tokens & Typography System
│   └── main.tsx                      # App Entry Point
├── package.json                      # Dependencies & NPM Scripts
├── vite.config.ts                    # Vite Configuration & Rolldown Bundler Options
└── tsconfig.json                     # TypeScript Compiler Configuration
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design** | Vanilla CSS Tokens, TailwindCSS v4, Framer Motion |
| **3D Rendering** | Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei` |
| **Routing** | TanStack Router (`@tanstack/react-router`) |
| **Blockchain Client** | `@stellar/stellar-sdk`, `@creit.tech/stellar-wallets-kit` (Freighter) |
| **Smart Contracts** | Soroban CLI, Rust, WebAssembly (`wasm32-unknown-unknown`) |
| **Backend & Auth** | Supabase Client (`@supabase/supabase-js`) |
| **State & Storage** | LocalStorage persistence + Supabase cloud fallback sync |

---

## ⚙️ Local Setup & Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Freighter Wallet Extension** (optional for testnet transactions): [Freighter Download](https://www.freighter.app/)

### Step 1: Clone Repository & Install Dependencies

```bash
git clone https://github.com/Samarth-06/CosmosX.git
cd CosmosX
npm install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory (or copy `.env.testnet.example`):

```bash
cp .env.testnet.example .env.local
```

Example `.env.local` configuration:

```env
# Stellar Testnet RPC & Network Settings
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Deployed Soroban Smart Contract Addresses (Testnet)
VITE_ACHIEVEMENT_CONTRACT_ID=CA...
VITE_MARKETPLACE_CONTRACT_ID=CB...

# Supabase Authentication & Database Configuration (Optional)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173/`.

---

## 🔗 Stellar Testnet & Soroban Smart Contracts

CosmosX includes two production-grade Soroban smart contracts written in Rust:

1. **Achievement Contract** (`contracts/achievement/`):
   - Mints verifiable Soulbound Achievement NFTs to learners upon completing verification gates.
2. **Exoplanet Marketplace Contract** (`contracts/marketplace/`):
   - Handles asset registration, minting, fixed-price listings, buy orders, bids, and ownership transfers directly on Stellar Testnet.

### Compiling & Deploying Contracts

To compile and deploy smart contracts to Stellar Testnet (requires `soroban-cli` installed):

```bash
# Build contracts to WebAssembly
cd contracts/marketplace
cargo build --target wasm32-unknown-unknown --release

# Deploy contract to Stellar Testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/cosmosx_marketplace.wasm \
  --source <YOUR_STELLAR_SECRET_KEY> \
  --network testnet
```

---

## ⚡ Supabase Integration

CosmosX is pre-wired for **Supabase Auth & Database Synchronization**. All query helpers are centralized in `src/lib/supabase-queries.ts`.

### Supabase Tables Schema
- `profiles`: User display names, avatar URLs, title ranks, and activity timestamps.
- `user_progress`: Total XP, current streak, verified module arrays, and completion percentages.
- `task_scores`: Individual score records for each curriculum task.
- `module_completions`: Verification gate logs.

*Note: If Supabase keys are not set, CosmosX seamlessly operates in local state mode with zero errors.*

---

## 📚 Documentation & References

For in-depth developer guides, architectural diagrams, and curriculum material, explore the following resources:

- 📖 [User & Commander Handbook](docs/USER_GUIDE.md)
- 🛠️ [Admin & Operator Guide](docs/ADMIN_GUIDE.md)
- 📝 [Soroban Smart Contract Specification](docs/CONTRACTS.md)
- 🌐 [Deployment & Hosting Guide](docs/DEPLOYMENT.md)
- 🗺️ [Project Roadmap & Vision](docs/ROADMAP.md)
- 📜 [Official Mercury Curriculum PDF Manual](resources/CosmosX_Mercury_Curriculum.pdf)
- 📡 [7-Part Stellar Integration Guides](docs/stellar-integration/)

---

<p center><strong>CosmosX Operations Unit · Master Blockchain by Exploring the Solar System.</strong></p>
