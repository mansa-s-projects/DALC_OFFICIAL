"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User, Search, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { useAppStore } from "@/store/useAppStore";
import { signOut } from "@/lib/auth";
import NotificationBell from "@/components/notifications/NotificationBell";

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

const TRAVEL_ITEMS = [
  { label: "Visa Services",  path: "/services/visas" },
  { label: "Flights",        path: "/travel/flights" },
  { label: "Hotels",         path: "/travel/hotels" },
  { label: "Private Jets",   path: "/travel/jets" },
  { label: "Car Rental",     path: "/travel/car-rental" },
];

const FLAT_NAV = [
  { label: "Experiences",   path: "/experiences" },
  { label: "Nightlife",     path: "/nightlife" },
  { label: "Business",      path: "/business" },
  { label: "Move To Dubai", path: "/move-to-dubai" },
  { label: "Concierge",     path: "/request" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled]           = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [travelOpen, setTravelOpen]           = useState(false);
  const [mobileTravelOpen, setMobileTravelOpen] = useState(false);
  const travelRef = useRef<HTMLDivElement>(null);
  const pathname  = usePathname();
  const router    = useRouter();
  const session   = useAppStore((s) => s.session);
  const profile   = useAppStore((s) => s.profile);
  const showAdminLink = profile?.role === 'admin' || profile?.role === 'sales_manager' || profile?.role === 'concierge';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setTravelOpen(false);
    setMobileTravelOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (travelRef.current && !travelRef.current.contains(e.target as Node)) {
        setTravelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const displayName = profile?.first_name || session?.user?.email?.split("@")[0] || "";
  const isTravelActive = pathname.startsWith("/travel") || pathname.startsWith("/services/visas");

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-4" : "py-6",
      )}
      style={
        isScrolled
          ? { background: `rgba(13,11,8,0.92)`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.rim}` }
          : { background: "transparent", borderBottom: "1px solid transparent" }
      }
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/branding/logo-main.png"
            alt="DALC"
            width={400}
            height={130}
            className="h-10 md:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            style={{ filter: "brightness(0) invert(1)" }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">

          {/* Flat items before Travel */}
          {FLAT_NAV.slice(0, 2).map((item) => (
            <NavLink key={item.path} href={item.path} label={item.label} />
          ))}

          {/* Travel dropdown */}
          <div ref={travelRef} className="relative">
            <button
              onClick={() => setTravelOpen(o => !o)}
              className="flex items-center gap-1 transition-colors duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: isTravelActive ? C.gold : (travelOpen ? C.gold : C.muted),
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
              onMouseLeave={(e) => { if (!travelOpen && !isTravelActive) e.currentTarget.style.color = C.muted; }}
            >
              Travel
              <ChevronDown
                className="w-3 h-3 transition-transform duration-200"
                style={{ transform: travelOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {travelOpen && (
              <div
                className="absolute top-full left-1/2 mt-3 w-52 overflow-hidden rounded-xl"
                style={{
                  transform: "translateX(-50%)",
                  background: "rgba(13,11,8,0.97)",
                  border: `1px solid ${C.rim2}`,
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                }}
              >
                {TRAVEL_ITEMS.map((item, i) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex items-center px-4 py-3 text-xs transition-colors duration-150"
                    style={{
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: pathname === item.path ? C.gold : C.muted,
                      borderBottom: i < TRAVEL_ITEMS.length - 1 ? `1px solid ${C.rim}` : "none",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; e.currentTarget.style.background = "rgba(201,168,76,0.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = pathname === item.path ? C.gold : C.muted; e.currentTarget.style.background = "transparent"; }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Remaining flat items */}
          {FLAT_NAV.slice(2).map((item) => (
            <NavLink key={item.path} href={item.path} label={item.label} />
          ))}

          {showAdminLink && (
            <NavLink href="/admin" label="Admin" gold />
          )}

          {session ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => (window as any).__openSearchModal?.()}
                className="p-2 transition-colors duration-200"
                style={{ color: C.dim }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.dim; }}
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
              </button>
              <NotificationBell />
              <Link
                href="/profile"
                className="flex items-center gap-2 transition-colors duration-200"
                style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.12em", color: C.muted }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.muted; }}
              >
                <User className="w-4 h-4" style={{ color: C.gold }} />
                <span>{displayName}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 transition-colors duration-200"
                style={{ color: C.dim }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.dim; }}
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
                onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.dim; }}
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
              </button>
              <Link
                href="/login"
                className="px-6 py-2 transition-all duration-300 inline-block"
                style={{ border: `1px solid rgba(201,168,76,0.30)`, color: C.gold, background: "transparent", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.textBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.gold; }}
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
          {FLAT_NAV.slice(0, 2).map((item) => (
            <MobileNavLink key={item.path} href={item.path} label={item.label} />
          ))}

          {/* Travel accordion */}
          <div>
            <button
              onClick={() => setMobileTravelOpen(o => !o)}
              className="flex items-center justify-between w-full font-display font-light text-xl pb-4"
              style={{ color: "rgba(245,237,216,0.80)", borderBottom: `1px solid ${C.rim}` }}
            >
              Travel
              <ChevronDown
                className="w-5 h-5 transition-transform duration-200"
                style={{ color: C.gold, transform: mobileTravelOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            {mobileTravelOpen && (
              <div className="flex flex-col pt-2 pb-2">
                {TRAVEL_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="py-3 pl-4 font-mono text-sm uppercase tracking-widest transition-colors"
                    style={{ color: pathname === item.path ? C.gold : C.muted, borderBottom: `1px solid ${C.rim}` }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {FLAT_NAV.slice(2).map((item) => (
            <MobileNavLink key={item.path} href={item.path} label={item.label} />
          ))}

          <button
            onClick={() => { setIsMobileMenuOpen(false); (window as any).__openSearchModal?.(); }}
            className="font-display font-light text-xl pb-4 text-left"
            style={{ color: "rgba(245,237,216,0.80)", borderBottom: `1px solid ${C.rim}` }}
          >
            Search
          </button>

          {showAdminLink && (
            <MobileNavLink href="/admin" label="Admin Dashboard" gold />
          )}

          {session ? (
            <>
              <MobileNavLink href="/profile" label="My Profile" />
              <button
                onClick={handleSignOut}
                className="font-display font-light text-xl text-left pb-4"
                style={{ color: C.dim, borderBottom: `1px solid ${C.rim}` }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <MobileNavLink href="/login" label="Sign In" gold />
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, label, gold = false }: { href: string; label: string; gold?: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className="relative group transition-colors duration-200"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: isActive || gold ? C.gold : C.muted,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
      onMouseLeave={(e) => { if (!isActive && !gold) e.currentTarget.style.color = C.muted; }}
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full" style={{ background: C.gold }} />
    </Link>
  );
}

function MobileNavLink({ href, label, gold = false }: { href: string; label: string; gold?: boolean }) {
  return (
    <Link
      href={href}
      className="font-display font-light text-xl pb-4"
      style={{ color: gold ? C.gold : "rgba(245,237,216,0.80)", borderBottom: `1px solid ${C.rim}` }}
    >
      {label}
    </Link>
  );
}
