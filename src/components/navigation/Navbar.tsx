"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User, Search } from "lucide-react";
import { cn } from "../../utils/cn";
import { useAppStore } from "../../store/useAppStore";
import { signOut } from "../../lib/auth";
import NotificationBell from "../notifications/NotificationBell";

// DALC palette
const C = {
  gold: "#C9A84C",
  goldDim: "#7A6025",
  ink: "#0D0B08",
  deep: "#120F0A",
  white: "rgba(245,237,216,0.95)",
  muted: "rgba(212,195,150,0.60)",
  dim: "rgba(212,195,150,0.30)",
  rim: "rgba(212,195,150,0.07)",
  rim2: "rgba(212,195,150,0.12)",
  rim3: "rgba(212,195,150,0.22)",
  textBg: "#100800",
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const session = useAppStore((s) => s.session);
  const profile = useAppStore((s) => s.profile);
  const showAdminLink = profile?.role === 'admin' || profile?.role === 'sales_manager' || profile?.role === 'concierge';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const displayName =
    profile?.first_name || session?.user?.email?.split("@")[0] || "";

  const navItems = [
    { label: "Move To Dubai", path: "/move-to-dubai" },
    { label: "Nightlife", path: "/nightlife" },
    { label: "Experiences", path: "/experiences" },
    { label: "Travel", path: "/travel" },
    { label: "Concierge", path: "/request" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-4" : "py-6",
      )}
      style={
        isScrolled
          ? {
              background: `rgba(13,11,8,0.92)`,
              backdropFilter: "blur(16px)",
              borderBottom: `1px solid ${C.rim}`,
            }
          : {
              background: "transparent",
              borderBottom: "1px solid transparent",
            }
      }
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-8 flex items-end justify-center pb-1">
            <svg
              viewBox="0 0 40 100"
              className="h-full w-auto fill-current transition-transform duration-500 group-hover:scale-110"
              style={{ color: C.gold }}
            >
              <path d="M19 0 L21 0 L21 100 L19 100 Z" />
              <path
                d="M21 20 L25 20 L25 100 L21 100 Z"
                className="opacity-90"
              />
              <path
                d="M25 40 L29 40 L29 100 L25 100 Z"
                className="opacity-75"
              />
              <path
                d="M29 60 L33 60 L33 100 L29 100 Z"
                className="opacity-60"
              />
              <path
                d="M33 80 L38 80 L38 100 L33 100 Z"
                className="opacity-40"
              />
              <path
                d="M15 20 L19 20 L19 100 L15 100 Z"
                className="opacity-90"
              />
              <path
                d="M11 40 L15 40 L15 100 L11 100 Z"
                className="opacity-75"
              />
              <path d="M7 60 L11 60 L11 100 L7 100 Z" className="opacity-60" />
              <path d="M2 80 L7 80 L7 100 L2 100 Z" className="opacity-40" />
            </svg>
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "rgba(201,168,76,0.18)",
                filter: "blur(12px)",
              }}
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="relative group transition-colors duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.muted,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.muted;
              }}
            >
              {item.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                style={{ background: C.gold }}
              />
            </Link>
          ))}

          {showAdminLink && (
            <Link
              href="/admin"
              className="relative group transition-colors duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.gold,
              }}
            >
              Admin
              <span
                className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                style={{ background: C.gold }}
              />
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => (window as any).__openSearchModal?.()}
                className="p-2 transition-colors duration-200"
                style={{ color: C.dim }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.dim;
                }}
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
              </button>
              <NotificationBell />
              <Link
                href="/profile"
                className="flex items-center gap-2 transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  color: C.muted,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.muted;
                }}
              >
                <User className="w-4 h-4" style={{ color: C.gold }} />
                <span>{displayName}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 transition-colors duration-200"
                style={{ color: C.dim }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.dim;
                }}
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => (window as any).__openSearchModal?.()}
                className="p-2 transition-colors duration-200"
                style={{ color: C.dim }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.dim;
                }}
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
              </button>
              <Link
                href="/login"
                className="px-6 py-2 transition-all duration-300 inline-block"
                style={{
                  border: `1px solid rgba(201,168,76,0.30)`,
                  color: C.gold,
                  background: "transparent",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.gold;
                  e.currentTarget.style.color = C.textBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.gold;
                }}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden transition-colors duration-200"
          style={{ color: C.muted }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="absolute top-full left-0 w-full p-8 flex flex-col gap-6 md:hidden"
          style={{ background: C.deep, borderBottom: `1px solid ${C.rim}` }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="font-display font-light text-xl pb-4"
              style={{
                color: "rgba(245,237,216,0.80)",
                borderBottom: `1px solid ${C.rim}`,
              }}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              (window as any).__openSearchModal?.();
            }}
            className="font-display font-light text-xl pb-4 text-left"
            style={{
              color: "rgba(245,237,216,0.80)",
              borderBottom: `1px solid ${C.rim}`,
            }}
          >
            Search
          </button>
          {showAdminLink && (
            <Link
              href="/admin"
              className="font-display font-light text-xl pb-4"
              style={{ color: C.gold, borderBottom: `1px solid ${C.rim}` }}
            >
              Admin Dashboard
            </Link>
          )}
          {session ? (
            <>
              <Link
                href="/profile"
                className="font-display font-light text-xl pb-4"
                style={{
                  color: "rgba(245,237,216,0.80)",
                  borderBottom: `1px solid ${C.rim}`,
                }}
              >
                My Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="font-display font-light text-xl text-left pb-4"
                style={{ color: C.dim, borderBottom: `1px solid ${C.rim}` }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="font-display font-light text-xl pb-4"
              style={{ color: C.gold, borderBottom: `1px solid ${C.rim}` }}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
