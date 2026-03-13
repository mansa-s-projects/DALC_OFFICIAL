import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/useAppStore';
import { signOut } from '../../lib/auth';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = useAppStore((s) => s.session);
  const profile = useAppStore((s) => s.profile);
  const isAdmin = useAppStore((s) => s.isAdmin);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = profile?.first_name || session?.user?.email?.split('@')[0] || '';

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled
        ? "bg-luxury-black/90 backdrop-blur-md border-luxury-gold/20 py-4"
        : "bg-transparent border-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-8 flex items-end justify-center pb-1">
             <svg viewBox="0 0 40 100" className="h-full w-auto text-luxury-gold fill-current transition-transform duration-500 group-hover:scale-110">
               {/* Center Spire */}
               <path d="M19 0 L21 0 L21 100 L19 100 Z" />
               {/* Steps Right */}
               <path d="M21 20 L25 20 L25 100 L21 100 Z" className="opacity-90"/>
               <path d="M25 40 L29 40 L29 100 L25 100 Z" className="opacity-75"/>
               <path d="M29 60 L33 60 L33 100 L29 100 Z" className="opacity-60"/>
               <path d="M33 80 L38 80 L38 100 L33 100 Z" className="opacity-40"/>
               {/* Steps Left */}
               <path d="M15 20 L19 20 L19 100 L15 100 Z" className="opacity-90"/>
               <path d="M11 40 L15 40 L15 100 L11 100 Z" className="opacity-75"/>
               <path d="M7 60 L11 60 L11 100 L7 100 Z" className="opacity-60"/>
               <path d="M2 80 L7 80 L7 100 L2 100 Z" className="opacity-40"/>
             </svg>
            <div className="absolute inset-0 bg-luxury-gold/30 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Explore', 'Live Map', 'My Requests'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium text-gray-300 hover:text-luxury-gold tracking-widest uppercase transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-luxury-gold hover:text-white tracking-widest uppercase transition-colors relative group"
            >
              Admin
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <User className="w-4 h-4 text-luxury-gold" />
                <span className="tracking-wider">{displayName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-luxury-gold transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="px-6 py-2 border border-luxury-gold/30 text-luxury-gold text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300">
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-luxury-black border-b border-white/10 p-6 flex flex-col gap-6 md:hidden">
          {['Explore', 'Live Map', 'My Requests'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replace(' ', '-')}`}
              className="text-lg font-display text-white border-b border-white/5 pb-2"
            >
              {item}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-lg font-display text-luxury-gold border-b border-white/5 pb-2">
              Admin Dashboard
            </Link>
          )}
          {session ? (
            <button
              onClick={handleSignOut}
              className="text-lg font-display text-gray-400 text-left border-b border-white/5 pb-2"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="text-lg font-display text-luxury-gold border-b border-white/5 pb-2">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
