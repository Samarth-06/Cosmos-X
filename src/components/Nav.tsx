import { Link } from "@tanstack/react-router";
import { Menu, LogOut, User, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getUserState, getUserLevel, type UserState } from "@/lib/user-store";
import { WalletConnectButton } from "@/features/achievements/WalletConnectButton";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Learn", to: "/" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Docs", to: "/docs" },
  { label: "Community", to: "/community" },
  { label: "Leaderboard", to: "/leaderboard" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userState, setUserState] = useState<UserState | null>(null);

  useEffect(() => {
    setUserState(getUserState());

    const checkUser = () => {
      const stored = localStorage.getItem("cosmos_x_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkUser();

    window.addEventListener("cosmos-x-auth-change", checkUser);
    return () => {
      window.removeEventListener("cosmos-x-auth-change", checkUser);
    };
  }, []);

  const level = userState ? getUserLevel(userState.xp) : "Cadet";

  const handleAuthClick = () => {
    if (user) {
      localStorage.removeItem("cosmos_x_user");
      window.dispatchEvent(new CustomEvent("cosmos-x-auth-change"));
    } else {
      localStorage.setItem("cosmos_x_user", JSON.stringify({ email: "agent.cosmosx@galaxy.io" }));
      window.dispatchEvent(new CustomEvent("cosmos-x-auth-change"));
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <nav className="glass flex items-center justify-between rounded-full px-4 py-2.5 md:px-6">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-8.5 w-8.5 overflow-hidden relative rounded-full border border-white/10 bg-slate-950 shrink-0 flex items-center justify-center transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.1)] group-hover:border-cyan-500/30 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.35)]">
              <img
                src="/logo.jpg"
                className="absolute w-[185%] h-[185%] max-w-none top-[-22%] left-[-42.5%] mix-blend-screen"
                style={{ clipPath: 'inset(0% 0% 45% 0%)' }}
                alt="CosmosX Logo"
              />
            </div>
            <span className="font-display text-[15.5px] font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-400">
              Cosmos<span className="text-secondary group-hover:text-cyan-400">X</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((i) => (
              <li key={i.label}>
                <Link
                  to={i.to as any}
                  activeProps={{ className: "bg-white/10 text-foreground" }}
                  className="rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-mono text-slate-300 sm:inline-flex">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>{user.email}</span>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="hidden items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-white/10 sm:inline-flex cursor-pointer"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_currentColor]" />
                <span>Connect</span>
              </button>
            )}

            <button
              onClick={handleAuthClick}
              className="rounded-full bg-linear-to-r from-primary to-primary-glow px-4 py-1.5 text-[13px] font-semibold text-primary-foreground shadow-[0_0_20px_-4px_var(--color-primary)] transition hover:shadow-[0_0_28px_-2px_var(--color-primary)] cursor-pointer flex items-center justify-center gap-1.5"
            >
              {user && <LogOut className="w-3.5 h-3.5" />}
              <span>{user ? "Sign out" : "Sign in"}</span>
            </button>

            {userState && (
              <div className="hidden items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-[11px] font-mono text-amber-400 sm:inline-flex">
                <Zap className="h-3 w-3 fill-current" />
                <span>{level} ({userState.xp} XP)</span>
              </div>
            )}
            <div className="hidden sm:block w-40">
              <WalletConnectButton />
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-white/5 lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>

        {open && (
          <div className="glass-strong mt-2 rounded-2xl p-3 lg:hidden">
            <ul className="flex flex-col">
              {NAV_ITEMS.map((i) => (
                <li key={i.label}>
                  <Link
                    to={i.to as any}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

