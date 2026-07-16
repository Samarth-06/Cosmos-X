import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, Filter, Search, Tag, Sparkles, Heart } from "lucide-react";
import NFTCard, { type NFTItem, type NFTRarity } from "@/components/NFTCard";
import { awardXP, getUserState, seedDemoState } from "@/lib/user-store";
import XPNotification, { useXPNotification } from "@/components/XPNotification";

export const Route = createFileRoute("/marketplace")({
  component: MarketplacePage,
});

const FEATURED_DROP = {
  name: "GALAXY Genesis Planet #001",
  rarity: "Legendary" as NFTRarity,
  price: 2500,
  image: "🪐",
  planet: "Mercury",
  planetColor: "#00E5FF",
  owner: "CosmosX Foundation",
  description: "The 1-of-1 Genesis Planet NFT representing the core founding member token of the Mercury orbital sector.",
};

const MARKETPLACE_NFTS: NFTItem[] = [
  {
    id: "nft_mercury_genesis",
    name: "Mercury Genesis Orb",
    planet: "Mercury",
    planetColor: "#00E5FF",
    rarity: "Legendary",
    price: 1500,
    image: "🪐",
    owner: "GXYZ...921A",
    description: "Verifiable Genesis Proof-of-Completion of the Mercury blockchain foundations sector.",
  },
  {
    id: "nft_venus_cipher",
    name: "Cipher Sentinel Avatar",
    planet: "Venus",
    planetColor: "#F59E0B",
    rarity: "Epic",
    price: 680,
    image: "🔐",
    owner: "GA5B...339X",
    description: "Premium animated avatar cosmetic key unlocked by decrypting all secret cipher layers of Venus.",
  },
  {
    id: "nft_earth_validator",
    name: "Quorum Validator Core",
    planet: "Earth",
    planetColor: "#10B981",
    rarity: "Rare",
    price: 320,
    image: "🌍",
    owner: "GCN2...884F",
    description: "Federated Byzantine Agreement core quorum validator certificate, earned by stabilizing the live consensus network.",
  },
  {
    id: "nft_mars_rocket",
    name: "Evacuation Pod V-2",
    planet: "Mars",
    planetColor: "#EF4444",
    rarity: "Uncommon",
    price: 120,
    image: "🚀",
    owner: "GMR3...228R",
    description: "Sleek metallic rocket fuselage cosmetic skin, issue-able via simulated token engine factory.",
  },
  {
    id: "nft_jupiter_contract",
    name: "Soroban WASM Core",
    planet: "Jupiter",
    planetColor: "#F97316",
    rarity: "Epic",
    price: 750,
    image: "🤖",
    owner: "GJP5...911V",
    description: "Verified smart contract compiler core, demonstrating capability of sandboxed Rust/WASM ledger operations.",
  },
  {
    id: "nft_saturn_anchor",
    name: "DeFi Anchor Ledger",
    planet: "Saturn",
    planetColor: "#8B5CF6",
    rarity: "Rare",
    price: 400,
    image: "🪙",
    owner: "GST7...448P",
    description: "A stable value token reserve anchor ledger showing custom issued anchor certifications.",
  },
  {
    id: "nft_uranus_collect",
    name: "Helios Cosmos Art #42",
    planet: "Uranus",
    planetColor: "#06B6D4",
    rarity: "Common",
    price: 45,
    image: "💎",
    owner: "GUR8...002Y",
    description: "Helios series generative planet artwork piece minted on simulated IPFS storage network.",
  },
  {
    id: "nft_neptune_node",
    name: "Freighter Port Key",
    planet: "Neptune",
    planetColor: "#3B82F6",
    rarity: "Legendary",
    price: 1800,
    image: "🔑",
    owner: "GNP9...115K",
    description: "Proof-of-Verification key issued for performing first real live Stellar network transaction.",
  },
];

const PLANETS_MARKET = [
  { id: "mercury", name: "Mercury", color: "#00E5FF", emoji: "☿", x: 12, y: 55, nfts: 3 },
  { id: "venus", name: "Venus", color: "#F59E0B", emoji: "♀", x: 23, y: 38, nfts: 5 },
  { id: "earth", name: "Earth", color: "#10B981", emoji: "🌍", x: 35, y: 62, nfts: 8 },
  { id: "mars", name: "Mars", color: "#EF4444", emoji: "♂", x: 47, y: 45, nfts: 4 },
  { id: "jupiter", name: "Jupiter", color: "#F97316", emoji: "♃", x: 60, y: 70, nfts: 12 },
  { id: "saturn", name: "Saturn", color: "#8B5CF6", emoji: "♄", x: 73, y: 35, nfts: 6 },
  { id: "uranus", name: "Uranus", color: "#06B6D4", emoji: "⛢", x: 84, y: 58, nfts: 7 },
  { id: "neptune", name: "Neptune", color: "#3B82F6", emoji: "♆", x: 94, y: 48, nfts: 2 },
];

function MarketplacePage() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [rarityFilter, setRarityFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"browse" | "map" | "portfolio">("map");
  const [userBalance, setUserBalance] = useState<number>(3250); // XLM demo balance
  const [ownedNfts, setOwnedNfts] = useState<NFTItem[]>([]);

  const { notification, show: showXP, hide: hideXP } = useXPNotification();

  useEffect(() => {
    seedDemoState();
  }, []);

  const handleBuy = (nft: NFTItem) => {
    if (userBalance >= nft.price) {
      setUserBalance((b) => b - nft.price);
      setOwnedNfts((prev) => [...prev, nft]);
      awardXP(150);
      showXP(150, `Successfully Purchased ${nft.name}!`);
    } else {
      showXP(0, "Insufficient XLM balance for transaction.");
    }
  };

  // Filter logic
  const filteredNfts = MARKETPLACE_NFTS.filter((nft) => {
    const matchesPlanet = selectedPlanet ? nft.planet.toLowerCase() === selectedPlanet.toLowerCase() : true;
    const matchesRarity = rarityFilter === "All" ? true : nft.rarity === rarityFilter;
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlanet && matchesRarity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,white_0.7px,transparent_0.7px)] bg-[size:22px_22px] opacity-[0.07] z-0" />

      {/* XP Toast Notification */}
      <XPNotification
        amount={notification?.amount ?? 0}
        label={notification?.label ?? ""}
        visible={!!notification}
        onHide={hideXP}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-base font-semibold">
              Cosmos<span className="text-secondary">X</span>
            </Link>
            <span className="text-white/20">/</span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShoppingBag className="h-3.5 w-3.5" /> Market
            </span>
          </div>

          {/* Balance HUD */}
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-secondary/10 px-3.5 py-1.5 border border-secondary/20 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase">Balance:</span>
              <span className="font-mono text-xs font-bold text-secondary">{userBalance.toLocaleString()} XLM</span>
            </div>
            <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/5 bg-slate-950/20 py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex gap-2">
          <button
            onClick={() => setActiveTab("map")}
            className={`rounded-lg px-4 py-1.5 font-mono text-[11px] font-medium transition ${
              activeTab === "map" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🗺️ 2D Solar Map
          </button>
          <button
            onClick={() => setActiveTab("browse")}
            className={`rounded-lg px-4 py-1.5 font-mono text-[11px] font-medium transition ${
              activeTab === "browse" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🛍️ Browse Grid
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`rounded-lg px-4 py-1.5 font-mono text-[11px] font-medium transition ${
              activeTab === "portfolio" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎒 Your Inventory ({ownedNfts.length})
          </button>
        </div>
      </div>

      <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 z-10">
        <AnimatePresence mode="wait">
          {activeTab === "map" && (
            /* 2D SOLAR SYSTEM MAP BROWSE GRID */
            <motion.div
              key="map-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="text-center max-w-lg mx-auto">
                <h2 className="font-display text-xl font-bold text-white mb-1">Click a Planet to Browse</h2>
                <p className="text-xs text-muted-foreground">
                  Explore localized asset markets, achievement collections, and restricted land parcels across orbital grids.
                </p>
              </div>

              {/* Interactive 2D Solar System Chart */}
              <div className="relative h-[320px] rounded-3xl border border-white/8 bg-gradient-to-b from-[#070b19] to-[#040816] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0.6px,transparent_0.6px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Sun Glow in Center Left */}
                <div className="absolute left-[-60px] top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl" />
                <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-24 h-48 rounded-r-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_50px_rgba(245,158,11,0.4)]" />

                {/* Grid Lines */}
                <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/5 pointer-events-none" />

                {PLANETS_MARKET.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPlanet(p.name);
                      setActiveTab("browse");
                    }}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center gap-1.5 focus:outline-none"
                  >
                    {/* Pulsing ring */}
                    <div
                      className="absolute inset-[-6px] rounded-full border border-dashed opacity-0 group-hover:opacity-100 animate-spin"
                      style={{ borderColor: p.color, animationDuration: "12s" }}
                    />
                    {/* Orbit bubble */}
                    <div
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${p.color}44 0%, ${p.color}08 50%, rgba(4,8,22,0.95) 90%)`,
                        borderColor: `${p.color}60`,
                        boxShadow: `0 0 15px ${p.color}15`,
                      }}
                      className="w-11 h-11 rounded-full flex items-center justify-center border text-lg relative transition duration-300 group-hover:scale-110"
                    >
                      {p.emoji}
                      <span
                        style={{ backgroundColor: p.color }}
                        className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold text-background rounded-full px-1 py-0.2 shrink-0 border border-background shadow"
                      >
                        {p.nfts}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground group-hover:text-white transition uppercase tracking-wider">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Featured drop card */}
              <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-[#070b19]/80 to-amber-950/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(245,158,11,0.06)]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    {FEATURED_DROP.image}
                  </div>
                  <div>
                    <span className="rounded-full bg-amber-400/20 text-amber-300 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest">
                      {FEATURED_DROP.rarity} Featured Drop
                    </span>
                    <h3 className="font-display text-base font-bold text-white mt-1">{FEATURED_DROP.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-md">{FEATURED_DROP.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBuy(FEATURED_DROP as any)}
                  className="w-full sm:w-auto shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition shadow-lg shadow-amber-400/10"
                >
                  Acquire Genesis Piece ({FEATURED_DROP.price} XLM)
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "browse" && (
            /* BROWSING CATALOGUE GRID */
            <motion.div
              key="browse-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start"
            >
              {/* Sidebar Filters */}
              <div className="lg:col-span-1 space-y-5 bg-slate-950/40 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-mono text-secondary">
                  <Filter className="w-4 h-4" />
                  <span>FILTER SYSTEM</span>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search assets..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-secondary/40 font-mono text-white placeholder-slate-500"
                  />
                </div>

                {/* Planet Selector */}
                <div>
                  <label className="font-mono text-[9px] text-muted-foreground uppercase block mb-1.5">Planet Sector</label>
                  <select
                    value={selectedPlanet ?? "All"}
                    onChange={(e) => setSelectedPlanet(e.target.value === "All" ? null : e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-secondary/40 font-mono"
                  >
                    <option value="All">All Sectors</option>
                    <option value="Mercury">Mercury</option>
                    <option value="Venus">Venus</option>
                    <option value="Earth">Earth</option>
                    <option value="Mars">Mars</option>
                    <option value="Jupiter">Jupiter</option>
                    <option value="Saturn">Saturn</option>
                    <option value="Uranus">Uranus</option>
                    <option value="Neptune">Neptune</option>
                  </select>
                </div>

                {/* Rarity Selector */}
                <div>
                  <label className="font-mono text-[9px] text-muted-foreground uppercase block mb-1.5">Rarity Tier</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", "Common", "Uncommon", "Rare", "Epic", "Legendary"].map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setRarityFilter(tier)}
                        className={`rounded-lg px-2.5 py-1 font-mono text-[9px] transition ${
                          rarityFilter === tier
                            ? "bg-white/10 text-foreground border border-white/20"
                            : "text-muted-foreground border border-white/5 hover:text-foreground"
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPlanet && (
                  <button
                    onClick={() => setSelectedPlanet(null)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white rounded-xl py-1.5 text-[10px] font-mono transition"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* NFT Browse list (Col-span 3) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
                  <span>Found {filteredNfts.length} assets</span>
                  {selectedPlanet && <span>Filtered by: {selectedPlanet}</span>}
                </div>

                {filteredNfts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNfts.map((nft) => (
                      <NFTCard key={nft.id} nft={nft} onBuy={handleBuy} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-950/20 border border-white/6 rounded-2xl">
                    <p className="text-sm text-muted-foreground font-mono">No telemetry files matching criteria.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "portfolio" && (
            /* PORTFOLIO INVENTORY VIEW */
            <motion.div
              key="portfolio-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-white">Your Cargo Bay</h2>
                  <p className="text-xs text-muted-foreground">Proof-of-Completion NFTs and cosmetic skins loaded in your local wallet.</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-muted-foreground">Valuation:</span>
                  <span className="font-mono text-sm font-bold text-secondary block">
                    {ownedNfts.reduce((sum, n) => sum + n.price, 0).toLocaleString()} XLM
                  </span>
                </div>
              </div>

              {ownedNfts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ownedNfts.map((nft, idx) => (
                    <NFTCard
                      key={`${nft.id}-${idx}`}
                      nft={{ ...nft, owner: "YOU (Local address)" }}
                      onBuy={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
                  <div className="text-4xl mb-3">🎒</div>
                  <h3 className="font-display text-sm font-bold text-white mb-1">Cargo Bay is Empty</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                    Verify modules in learning sectors to earn badges, or acquire items directly from the marketplace browse directory.
                  </p>
                  <button
                    onClick={() => setActiveTab("map")}
                    className="px-4 py-2 bg-white text-slate-950 font-semibold text-xs rounded-xl hover:bg-slate-200 transition"
                  >
                    Go to Solar Map
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 py-2.5 text-center">
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
          COSMOSX CLASSIFIED OPERATIONS UNIT · CENTRAL MARKETPLACE DIRECTORY
        </p>
      </footer>
    </div>
  );
}
