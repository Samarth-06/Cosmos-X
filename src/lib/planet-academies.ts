export type AcademyPlanetId = "venus" | "earth" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune";

export interface AcademyMission {
  id: string;
  phase: string;
  title: string;
  shortTitle: string;
  simpleTheory: string;
  technicalTheory: string;
  quote: string;
  keyTerms: string[];
  scenarioLabel: string;
  scenario: string[];
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
  terminalCommand?: string;
  terminalSuccess?: string;
}

export interface PlanetAcademy {
  id: AcademyPlanetId;
  name: string;
  topic: string;
  color: string;
  glow: string;
  status: string;
  tagline: string;
  overview: string;
  missions: AcademyMission[];
}

export const PLANET_ACADEMIES: Record<AcademyPlanetId, PlanetAcademy> = {
  venus: {
    id: "venus", name: "Venus", topic: "Cryptography & Keys", color: "#d99b5f", glow: "rgba(217,155,95,0.32)", status: "SIGNATURE ARRAY CALIBRATED",
    tagline: "Identity without a gatekeeper.",
    overview: "A keypair lets you prove authority over an account without revealing a secret. This preview academy turns abstract cryptography into the simple habit of protecting a private key and verifying a public signature.",
    missions: [
      {
        id: "keys", phase: "01 · Identity", title: "The Two-Key Vault", shortTitle: "Keypair fundamentals",
        simpleTheory: "Think of a public key as the address of a locked mailbox: anyone can send something there. Your private key is the only key that can authorize what leaves it. Sharing your address is fine; sharing the private key is like taping your house key to the mailbox.",
        technicalTheory: "A wallet derives a public key from a private key using one-way elliptic-curve mathematics. A digital signature proves that the holder of the private key approved a precise message, while verifiers only need the public key.",
        quote: "A private key is not an identity card. It is authority.", keyTerms: ["private key", "public key", "digital signature"],
        scenarioLabel: "VAULT TELEMETRY", scenario: ["PUBLIC · GVENUS…82PX", "PRIVATE · never displayed", "ACTION · sign transfer"],
        question: "Which item must never be sent to another person or pasted into a website?", choices: ["Public address", "Transaction ID", "Private key", "Network passphrase"], correct: 2,
        explanation: "The private key authorizes signatures. Anyone who obtains it can act as the account owner; the public address is designed to be shared.",
      },
      {
        id: "signatures", phase: "02 · Proof", title: "Signature Signal", shortTitle: "What a signature proves",
        simpleTheory: "A signature is a tamper-proof approval stamp. If even one character in the message changes after you approve it, the old stamp no longer fits.",
        technicalTheory: "Signing binds a private key to a transaction payload. Verification recomputes the cryptographic relationship against the public key, giving authenticity and integrity without exposing the secret material.",
        quote: "Verify the message, not just the messenger.", keyTerms: ["integrity", "authentication", "verification"],
        scenarioLabel: "SIGNATURE RELAY", scenario: ["PAYLOAD · 25 XLM → ORBIT", "SIGNATURE · valid", "AFTER EDIT · signature invalid"],
        question: "What happens to a valid signature if the amount changes from 25 to 250 after signing?", choices: ["It remains valid", "It becomes invalid", "It encrypts the amount", "It creates a new key"], correct: 1,
        explanation: "A signature covers the exact transaction bytes. Changing the amount changes the message, so the original signature cannot verify.",
      },
      {
        id: "lab", phase: "03 · Lab", title: "Generate a Testnet Identity", shortTitle: "Terminal practice",
        simpleTheory: "Practice on testnet first. It behaves like a learning network, so you can learn the flow without putting real funds at risk.",
        technicalTheory: "Network selection is part of transaction context. The same key format can exist across networks, but a testnet account and a mainnet account belong to distinct ledgers and trust boundaries.",
        quote: "Experiment freely; authorize carefully.", keyTerms: ["testnet", "account alias", "simulation"],
        scenarioLabel: "LAB OBJECTIVE", scenario: ["NETWORK · testnet", "ALIAS · venus-cadet", "LIVE ACTIVITY · none"],
        question: "Why is testnet the right first environment for a new blockchain workflow?", choices: ["It removes the need for keys", "It is a safe place to practice without real funds", "It automatically signs transactions", "It has no ledger"], correct: 1,
        explanation: "Testnet lets you rehearse the same concepts and tooling in a non-production environment. It does not remove security responsibilities.",
        terminalCommand: "stellar keys generate venus-cadet --network testnet", terminalSuccess: "✓ Simulated keypair generated · no live account was funded.",
      },
    ],
  },
  earth: {
    id: "earth", name: "Earth", topic: "Consensus & Networks", color: "#46a9e8", glow: "rgba(70,169,232,0.30)", status: "QUORUM RELAY STABLE",
    tagline: "Agreement among independent machines.",
    overview: "Earth is where a blockchain becomes a network. Explore how independent nodes validate, communicate and converge on the same ordered history without a central database administrator.",
    missions: [
      {
        id: "nodes", phase: "01 · Network", title: "Independent Witnesses", shortTitle: "Node roles",
        simpleTheory: "Imagine several referees each keeping their own copy of the score. One referee can make a mistake, but the game does not depend on one clipboard.",
        technicalTheory: "Full nodes independently validate protocol rules and maintain ledger data. Validator nodes participate in the consensus process; light clients verify selected facts using compact proofs.",
        quote: "Redundancy turns a failure into an event, not a disaster.", keyTerms: ["full node", "validator", "ledger replica"],
        scenarioLabel: "EARTH NODE MESH", scenario: ["N1 · full history", "N2 · validator", "N3 · light client"],
        question: "Which node role actively participates in deciding whether a new block is valid?", choices: ["Archive image", "Validator", "Private key", "Block explorer"], correct: 1,
        explanation: "Validators participate in the consensus process. Full nodes still enforce rules independently, while light clients use reduced data.",
      },
      {
        id: "quorum", phase: "02 · Agreement", title: "Quorum Overlap", shortTitle: "Consensus paths",
        simpleTheory: "A group reaches a dependable decision when enough members agree and their trusted circles overlap. If every group trusted a completely different set, they could split into conflicting realities.",
        technicalTheory: "Federated Byzantine Agreement relies on quorum slices: the validators each node considers sufficient. Overlapping slices allow agreement to spread through the network while tolerating some faulty participants.",
        quote: "Consensus is a relationship graph, not a vote counter alone.", keyTerms: ["quorum slice", "Byzantine fault", "overlap"],
        scenarioLabel: "TRUST GRAPH", scenario: ["ALPHA trusts · BETA + GAMMA", "BETA trusts · GAMMA + DELTA", "OVERLAP · GAMMA"],
        question: "Why is overlap between trusted validator sets important?", choices: ["It makes addresses shorter", "It connects agreement across the network", "It hides transactions", "It replaces signatures"], correct: 1,
        explanation: "Overlap carries a decision from one trust group to another, helping independent nodes converge instead of permanently splitting.",
      },
      {
        id: "lab", phase: "03 · Lab", title: "Broadcast a Validated Signal", shortTitle: "Network practice",
        simpleTheory: "Nodes only pass along messages they consider valid. That simple local rule helps protect the whole network from junk or conflicting transactions.",
        technicalTheory: "Gossip propagation decentralizes distribution: each peer validates, stores and relays eligible messages. Invalid payloads are rejected at the first verifying node rather than forwarded for a central authority to clean up.",
        quote: "Validate locally; propagate responsibly.", keyTerms: ["gossip", "propagation", "validation"],
        scenarioLabel: "RELAY ORDER", scenario: ["NODE · earth-01", "PAYLOAD · valid", "DESTINATION · peer mesh"],
        question: "What should a node do with an invalid transaction it receives?", choices: ["Forward it with a warning", "Store it forever", "Reject it and stop propagation", "Ask one central server"], correct: 2,
        explanation: "Independent validation prevents invalid transactions from contaminating the peer-to-peer relay path.",
        terminalCommand: "network gossip --from earth-01 --tx valid", terminalSuccess: "✓ Valid payload relayed to 4 simulated peers; no real network traffic was sent.",
      },
    ],
  },
  mars: {
    id: "mars", name: "Mars", topic: "Wallets & Transactions", color: "#e8674e", glow: "rgba(232,103,78,0.30)", status: "WALLET BAY SEALED",
    tagline: "Every transfer is a signed instruction.",
    overview: "A wallet is a key-management interface, not a vault holding coins. On Mars, trace how a transaction is constructed, signed, funded and finally submitted to a network queue.",
    missions: [
      { id: "wallet", phase: "01 · Wallet", title: "Address Is Not a Wallet", shortTitle: "Self-custody basics", simpleTheory: "Your wallet app helps you hold keys and prepare instructions. The funds are recorded on the network ledger, while the private key is what authorizes access.", technicalTheory: "Wallet software manages keypairs, derives addresses and builds canonical transaction envelopes. It should never treat a display balance as the source of truth; validators determine state from the ledger.", quote: "The wallet holds authority; the ledger records state.", keyTerms: ["self-custody", "address", "transaction envelope"], scenarioLabel: "MARS WALLET", scenario: ["ADDRESS · GMARS…9QF", "SECRET · protected locally", "BALANCE · ledger-derived"], question: "Where is a blockchain account's current state ultimately recorded?", choices: ["Only inside the wallet app", "On the shared ledger", "Inside a screenshot", "In the public key"], correct: 1, explanation: "Wallets present and authorize state; the network ledger is the authoritative record accepted by validators." },
      { id: "fees", phase: "02 · Fees", title: "The Cost of Inclusion", shortTitle: "Transaction fees", simpleTheory: "A fee is a small inclusion cost. It helps prevent a network from being flooded with endless free requests and can influence processing priority.", technicalTheory: "Fees are part of a transaction's signed payload. On many networks, validators or protocol rules select transactions from a mempool according to validity, fee policy and available capacity.", quote: "A fee is part of the protocol's anti-spam design.", keyTerms: ["mempool", "fee", "capacity"], scenarioLabel: "FEE METER", scenario: ["TRANSFER · 24 units", "NETWORK FEE · 0.00001", "STATUS · pending validation"], question: "Why do blockchain networks typically charge transaction fees?", choices: ["To hide the transaction", "To prevent spam and allocate limited capacity", "To create private keys", "To change the public address"], correct: 1, explanation: "Fees make unlimited spam expensive and help networks ration scarce block or ledger capacity." },
      { id: "lab", phase: "03 · Lab", title: "Build a Transfer Draft", shortTitle: "Transaction practice", simpleTheory: "Before any network submission, a wallet constructs a clear instruction: who sends, who receives, how much and under which rules.", technicalTheory: "A transaction draft becomes valid only after it is signed by the appropriate key and passes network checks such as sequence number, balance and fee requirements.", quote: "Read the instruction before you authorize it.", keyTerms: ["recipient", "amount", "signature"], scenarioLabel: "DRAFT PAYLOAD", scenario: ["FROM · nova", "TO · orbit", "AMOUNT · 24", "MODE · simulation"], question: "What makes a transaction authorization different from simply typing a payment request?", choices: ["It includes a digital signature", "It is always public", "It removes fees", "It never needs validation"], correct: 0, explanation: "A digital signature proves the authorized key approved the exact transaction data; validators still verify it before inclusion.", terminalCommand: "wallet sign --from nova --to orbit --amount 24", terminalSuccess: "✓ Transfer draft signed in simulation · nothing was submitted to a live ledger." },
    ],
  },
  jupiter: {
    id: "jupiter", name: "Jupiter", topic: "Smart Contracts", color: "#c086ff", glow: "rgba(192,134,255,0.30)", status: "CONTRACT ORBIT NOMINAL", tagline: "Programs that enforce shared rules.", overview: "Smart contracts are deterministic programs stored and executed by a blockchain. Jupiter focuses on what they can guarantee, and the security boundaries they cannot magically solve.", missions: [
      { id: "rules", phase: "01 · Logic", title: "Code as a Shared Rulebook", shortTitle: "Contract fundamentals", simpleTheory: "A smart contract is like a vending machine: when the defined conditions are met, it follows the same written rule for everyone. There is no cashier deciding case by case.", technicalTheory: "A contract executes deterministic code against on-chain state. Every validating node must be able to reproduce the same result from the same inputs, making nondeterministic operations unsuitable for the execution path.", quote: "A contract is predictable code, not independent judgment.", keyTerms: ["determinism", "on-chain state", "execution"], scenarioLabel: "RULE ENGINE", scenario: ["IF · payment received", "THEN · release access", "ELSE · retain state"], question: "Why must smart contract execution be deterministic?", choices: ["So each validator gets the same result", "So code stays secret", "So gas is free", "So contracts can browse websites"], correct: 0, explanation: "Nodes independently reproduce execution. If the same input could produce different results, the network could not agree on state." },
      { id: "safety", phase: "02 · Safety", title: "Guard Conditions", shortTitle: "Defensive design", simpleTheory: "A good automated rule checks the door is locked before it opens the vault. Contracts need explicit checks because code will execute exactly as written.", technicalTheory: "Authorization, input validation, state-transition ordering and failure handling are critical contract controls. Bugs can become irreversible economic behavior once deployed.", quote: "On-chain code is a promise with no undo button.", keyTerms: ["authorization", "input validation", "state transition"], scenarioLabel: "ESCROW GUARD", scenario: ["ROLE · buyer / seller", "REQUIRE · funds locked", "RELEASE · authorized path"], question: "Which control stops an arbitrary account from releasing an escrow payment?", choices: ["A clear authorization check", "A larger block", "A public address", "A faster wallet"], correct: 0, explanation: "The contract must explicitly verify that the caller has the required role or satisfies a defined multisignature condition." },
      { id: "lab", phase: "03 · Lab", title: "Invoke an Escrow Rule", shortTitle: "Contract practice", simpleTheory: "This lab calls a simulated rule, not a live contract. Focus on the inputs and the condition the program evaluates.", technicalTheory: "An invocation includes a contract identifier, a function, serialized arguments and an authorization context. A real network validates all of those before committing a state change.", quote: "Simulation builds judgment before deployment carries consequences.", keyTerms: ["invoke", "arguments", "authorization"], scenarioLabel: "SIMULATED INVOCATION", scenario: ["CONTRACT · escrow", "FUNCTION · release", "AMOUNT · 120"], question: "What is a contract invocation?", choices: ["A request to run a named contract function with inputs", "A replacement for all private keys", "A browser cookie", "A way to edit old blocks"], correct: 0, explanation: "Invocations request deterministic execution of a specific function against contract state, subject to its rules and authorization.", terminalCommand: "contract invoke escrow --amount 120 --release", terminalSuccess: "✓ Escrow release path evaluated in simulation; no on-chain state changed." },
    ],
  },
  saturn: {
    id: "saturn", name: "Saturn", topic: "Tokens & Assets", color: "#e7c27e", glow: "rgba(231,194,126,0.30)", status: "ASSET RINGS SYNCHRONIZED", tagline: "Issuance, trust and clear provenance.", overview: "An asset is more than a ticker. Saturn explores who issues it, who trusts that issuer and why clear supply and redemption rules matter.", missions: [
      { id: "issuer", phase: "01 · Issuance", title: "Who Backs the Asset?", shortTitle: "Issuer identity", simpleTheory: "A token's name can be copied. Its issuer is the part that tells you which organization or account stands behind a particular asset.", technicalTheory: "Many asset protocols identify an asset by the tuple of asset code and issuer account. This prevents two unrelated issuers using the same short code from being mistaken for one another.", quote: "A ticker tells you what; an issuer tells you whose promise it is.", keyTerms: ["issuer", "asset code", "provenance"], scenarioLabel: "ASSET ID", scenario: ["CODE · AURORA", "ISSUER · GSATURN…21R", "SUPPLY · protocol-defined"], question: "Why is an issuer identifier important alongside an asset code?", choices: ["It distinguishes assets with the same code", "It hides the supply", "It removes trust decisions", "It encrypts transfers"], correct: 0, explanation: "The issuer makes an asset identity unambiguous. A code alone can be reused by unrelated issuers." },
      { id: "trust", phase: "02 · Acceptance", title: "Trustline Control", shortTitle: "Receiving assets", simpleTheory: "Before receiving a new asset, an account can choose to opt in. It is like adding a new contact before accepting messages from that source.", technicalTheory: "A trustline records an account's willingness to hold a particular issuer's asset, often with a limit. It helps users control which issued assets can affect their balances.", quote: "Opt-in is a control, not a guarantee of value.", keyTerms: ["trustline", "limit", "issuer risk"], scenarioLabel: "ACCOUNT POLICY", scenario: ["ASSET · AURORA", "LIMIT · 10,000", "STATUS · opt-in required"], question: "What does creating a trustline primarily express?", choices: ["Willingness to hold a specific issued asset", "Ownership of the issuer", "A private key backup", "A mining reward"], correct: 0, explanation: "A trustline is an explicit account-level rule for a particular issuer and asset, not a statement that the asset is risk-free." },
      { id: "lab", phase: "03 · Lab", title: "Issue a Simulated Asset", shortTitle: "Asset practice", simpleTheory: "Create an asset only in this sandbox. The goal is to inspect the issuer, code and supply parameters before any real-world product is involved.", technicalTheory: "Issuance policies should define supply, distribution, redemption, compliance and disclosure. A technical token command cannot make an asset economically sound by itself.", quote: "Tokenization changes the rail, not the need for responsible design.", keyTerms: ["issuance", "supply", "distribution"], scenarioLabel: "ISSUANCE PARAMETERS", scenario: ["CODE · aurora", "SUPPLY · 1,000,000", "NETWORK · simulation"], question: "Which question remains important after an asset is technically issued?", choices: ["Who backs it and what are its rules?", "Can the code be three letters?", "Does it remove all risk?", "Can it overwrite history?"], correct: 0, explanation: "Technology can represent an asset, but governance, backing, disclosure and redemption terms determine what that representation means.", terminalCommand: "asset issue aurora --supply 1000000", terminalSuccess: "✓ Asset parameters recorded in simulation; no token exists on any public network." },
    ],
  },
  uranus: {
    id: "uranus", name: "Uranus", topic: "NFTs & Ownership", color: "#65d1dc", glow: "rgba(101,209,220,0.30)", status: "PROVENANCE ARRAY ONLINE", tagline: "A record of uniqueness and history.", overview: "NFTs can represent unique identifiers and ownership history. Uranus separates the technical record from the legal and practical rights that real-world ownership may require.", missions: [
      { id: "identity", phase: "01 · Uniqueness", title: "One Token, One Identifier", shortTitle: "NFT basics", simpleTheory: "A non-fungible token is meant to be distinguishable from another token. Think of a concert ticket with a unique serial number, not a pile of identical coins.", technicalTheory: "NFT contracts map unique token identifiers to owners and metadata references. The token record is unique on that contract, but the link between token ownership and off-chain rights depends on external terms.", quote: "Uniqueness in a ledger is not automatically ownership in the physical world.", keyTerms: ["token ID", "metadata", "ownership record"], scenarioLabel: "TOKEN RECORD", scenario: ["ID · atlas-01", "OWNER · explorer", "METADATA · content reference"], question: "What makes an NFT non-fungible?", choices: ["Each token can have a distinct identity and attributes", "It has no owner", "It cannot be transferred", "It is always a physical object"], correct: 0, explanation: "NFTs use unique token identifiers and often distinct metadata, unlike interchangeable units of the same fungible asset." },
      { id: "provenance", phase: "02 · History", title: "Trace the Transfer Path", shortTitle: "Provenance", simpleTheory: "A ledger can show a sequence of transfers, like a signed handover sheet. That can be useful for checking a digital item's history.", technicalTheory: "On-chain provenance records transactions between addresses. It does not independently prove that an uploader had copyright, that off-chain media remains available or that a legal title transferred.", quote: "A transparent history is evidence; it is not a universal legal oracle.", keyTerms: ["provenance", "transfer history", "metadata URI"], scenarioLabel: "HANDOVER LOG", scenario: ["MINT · creator", "TRANSFER · collector", "CURRENT · explorer"], question: "What can on-chain NFT provenance reliably show?", choices: ["The recorded transfer history between addresses", "Automatic copyright ownership", "That media will always be hosted", "A guaranteed market price"], correct: 0, explanation: "The ledger can show token movements, but rights, hosting and value require information outside the chain." },
      { id: "lab", phase: "03 · Lab", title: "Mint a Sandbox Collectible", shortTitle: "NFT practice", simpleTheory: "This simulation creates a unique record only inside CosmosX. Treat minting as the beginning of an asset design discussion, not proof of value.", technicalTheory: "A mint operation defines token identity, recipient and metadata policy. Robust implementations also consider access controls, royalties, storage persistence and user-facing disclosure.", quote: "Mint responsibly: identity, rights and storage all matter.", keyTerms: ["mint", "recipient", "metadata"], scenarioLabel: "MINT REQUEST", scenario: ["TOKEN · atlas-01", "RECIPIENT · explorer", "MODE · simulation"], question: "Which information is most useful to establish a token's unique identity?", choices: ["A unique token ID and its issuing contract", "Only a display image", "The owner’s password", "A block color"], correct: 0, explanation: "The issuing contract plus token ID is the durable on-chain identity. Visual metadata alone can be copied.", terminalCommand: "nft mint atlas-01 --to explorer", terminalSuccess: "✓ Unique sandbox token minted to explorer; no public NFT was created." },
    ],
  },
  neptune: {
    id: "neptune", name: "Neptune", topic: "Stellar Mainnet", color: "#5e78ff", glow: "rgba(94,120,255,0.34)", status: "LAUNCH WINDOW PROTECTED", tagline: "Production is a responsibility, not a button.", overview: "Neptune prepares learners for live-network judgment. It deliberately keeps this version in simulation mode: understand passphrases, review transaction details and respect the difference between practice and irreversible production action.", missions: [
      { id: "networks", phase: "01 · Context", title: "Testnet vs Mainnet", shortTitle: "Network boundaries", simpleTheory: "Testnet is a practice field; mainnet is where real value and real consequences exist. A similar-looking command can mean something very different depending on the network context.", technicalTheory: "Network passphrases and configuration bind transaction signatures to a specific ledger. Production workflows require stronger review, key protection and operational controls than experimentation.", quote: "The safest live transaction is the one you understood before signing.", keyTerms: ["mainnet", "testnet", "network passphrase"], scenarioLabel: "NETWORK SWITCH", scenario: ["TESTNET · practice value", "MAINNET · real value", "DEFAULT · simulation only"], question: "Why must a wallet make network context obvious before signing?", choices: ["The same action can have real consequences on mainnet", "It improves screen brightness", "It replaces the private key", "It makes hashes reversible"], correct: 0, explanation: "Network context determines which ledger a signed transaction targets. Production actions can be irreversible and involve real assets." },
      { id: "review", phase: "02 · Safety", title: "The Preflight Review", shortTitle: "Before signing", simpleTheory: "Before sending something irreversible, pause like a pilot before launch: destination, amount, fee and network all deserve a deliberate check.", technicalTheory: "Transaction review should include canonical recipient address, asset identifier, amount, fee, sequence/nonce, authorization scope and network. Hardware wallets and multisignature policies reduce single-key risk but do not replace review.", quote: "Slow is smooth; smooth is safe.", keyTerms: ["preflight", "multisignature", "authorization scope"], scenarioLabel: "PREFLIGHT CHECK", scenario: ["DESTINATION · verified", "AMOUNT · confirmed", "NETWORK · explicit"], question: "Which is a sound production transaction habit?", choices: ["Review recipient, amount, asset and network before signing", "Share the seed phrase for backup", "Assume a copied address is correct", "Skip fees and sequence checks"], correct: 0, explanation: "Independent review protects against common high-impact errors such as wrong recipients, wrong networks and incorrect amounts." },
      { id: "lab", phase: "03 · Simulation", title: "Choose a Safe Network", shortTitle: "Production readiness", simpleTheory: "This final lab intentionally keeps you on testnet. Competence is knowing when not to perform a live action from a learning environment.", technicalTheory: "A production integration should use explicit network configuration, secure key custody, confirmation UX, monitoring and recovery procedures. CosmosX's simulation provider contains none of the authority to submit mainnet transactions.", quote: "Practice the discipline before you handle the consequence.", keyTerms: ["simulation provider", "key custody", "production controls"], scenarioLabel: "LAUNCH POLICY", scenario: ["REQUEST · network context", "ALLOWED · testnet", "MAINNET · disabled in lab"], question: "What is the correct outcome for a learning simulation that receives a mainnet action request?", choices: ["Clearly prevent it and explain the boundary", "Silently submit it", "Expose the private key", "Pretend a real transfer occurred"], correct: 0, explanation: "A responsible learning simulation must be explicit that it cannot and does not send live-network transactions.", terminalCommand: "stellar network use testnet", terminalSuccess: "✓ Testnet context selected in simulation. Mainnet execution remains unavailable by design." },
    ],
  },
};

const PROGRESS_PREFIX = "cosmos-x-planet-preview-progress-";

export function getPlanetAcademyCompletion(id: AcademyPlanetId): number {
  if (typeof window === "undefined") return 0;
  const saved = Number(window.localStorage.getItem(`${PROGRESS_PREFIX}${id}`));
  return Number.isFinite(saved) ? Math.max(0, Math.min(100, saved)) : 0;
}

export function savePlanetAcademyCompletion(id: AcademyPlanetId, completeMissions: number): number {
  const completion = Math.round((Math.max(0, Math.min(3, completeMissions)) / 3) * 100);
  if (typeof window !== "undefined") window.localStorage.setItem(`${PROGRESS_PREFIX}${id}`, String(completion));
  return completion;
}
