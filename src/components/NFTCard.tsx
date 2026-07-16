import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, ExternalLink, Star } from "lucide-react";

export type NFTRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export interface NFTItem {
  id: string;
  name: string;
  planet: string;
  planetColor: string;
  rarity: NFTRarity;
  price: number; // XLM
  image: string; // emoji or url
  owner: string;
  description: string;
  badge?: string;
}

const RARITY_STYLES: Record<NFTRarity, { border: string; glow: string; badge: string; text: string }> = {
  Common: {
    border: "border-slate-500/40",
    glow: "shadow-[0_0_20px_rgba(100,116,139,0.2)]",
    badge: "bg-slate-500/20 text-slate-300",
    text: "text-slate-400",
  },
  Uncommon: {
    border: "border-green-500/50",
    glow: "shadow-[0_0_25px_rgba(34,197,94,0.2)]",
    badge: "bg-green-500/20 text-green-300",
    text: "text-green-400",
  },
  Rare: {
    border: "border-blue-500/50",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    badge: "bg-blue-500/20 text-blue-300",
    text: "text-blue-400",
  },
  Epic: {
    border: "border-purple-500/50",
    glow: "shadow-[0_0_35px_rgba(168,85,247,0.3)]",
    badge: "bg-purple-500/20 text-purple-300",
    text: "text-purple-400",
  },
  Legendary: {
    border: "border-amber-400/60",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.4)]",
    badge: "bg-amber-400/20 text-amber-300",
    text: "text-amber-400",
  },
};

interface NFTCardProps {
  nft: NFTItem;
  onBuy?: (nft: NFTItem) => void;
}

export default function NFTCard({ nft, onBuy }: NFTCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount] = useState(Math.floor(Math.random() * 200) + 5);
  const styles = RARITY_STYLES[nft.rarity];

  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 3, rotateY: 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: "800px" }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-gradient-to-b from-slate-900/80 to-[#040816]/95 backdrop-blur-xl ${styles.border} ${styles.glow} transition-all duration-300`}
    >
      {/* Planet atmosphere shimmer */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${nft.planetColor}15 0%, transparent 70%)`,
        }}
      />

      {/* NFT Image Area */}
      <div
        className="relative flex h-48 items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 60%, ${nft.planetColor}22 0%, transparent 70%)`,
          borderBottom: `1px solid ${nft.planetColor}20`,
        }}
      >
        <div className="text-6xl transition-transform duration-500 group-hover:scale-110">{nft.image}</div>

        {/* Rarity badge */}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest ${styles.badge}`}>
          {nft.rarity}
        </span>

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((l) => !l); }}
          className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] backdrop-blur transition hover:bg-black/60"
        >
          <Heart className={`h-3 w-3 ${liked ? "fill-rose-400 text-rose-400" : "text-white/60"}`} />
          <span className={liked ? "text-rose-400" : "text-white/60"}>{likeCount + (liked ? 1 : 0)}</span>
        </button>

        {/* Planet tag */}
        <div
          className="absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 font-mono text-[9px] font-semibold"
          style={{ background: `${nft.planetColor}22`, color: nft.planetColor, border: `1px solid ${nft.planetColor}40` }}
        >
          {nft.planet}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-[13px] font-semibold leading-tight text-foreground">{nft.name}</h3>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{nft.description}</p>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-2.5 w-2.5 ${i < (nft.rarity === "Legendary" ? 5 : nft.rarity === "Epic" ? 4 : nft.rarity === "Rare" ? 3 : nft.rarity === "Uncommon" ? 2 : 1) ? `fill-current ${styles.text}` : "text-white/15"}`}
            />
          ))}
          <span className={`ml-1 font-mono text-[9px] ${styles.text}`}>{nft.rarity}</span>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div>
            <div className="font-mono text-[9px] text-muted-foreground">Price</div>
            <div className="font-display text-base font-bold text-foreground">{nft.price} <span className="text-xs text-secondary">XLM</span></div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] text-muted-foreground">Owner</div>
            <div className="font-mono text-[10px] text-muted-foreground/80">{nft.owner.slice(0, 6)}…</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onBuy?.(nft)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-semibold text-white transition"
            style={{
              background: `linear-gradient(135deg, ${nft.planetColor}cc, ${nft.planetColor}88)`,
              boxShadow: `0 0 20px ${nft.planetColor}30`,
            }}
          >
            <ShoppingCart className="h-3 w-3" />
            Buy Now
          </button>
          <button className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10">
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
