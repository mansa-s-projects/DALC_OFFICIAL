/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './middleware.ts'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        luxury: {
          gold: '#D4AF37',
          black: '#0A0A0A',
          charcoal: '#1A1A1A',
          beige: '#F5F5DC',
          white: '#FFFFFF',
          silver: '#E5E4E2',
        },
        aura: {
          glow: 'rgba(212, 175, 55, 0.6)',
          faint: 'rgba(212, 175, 55, 0.1)',
        },
        cipher: {
          void: '#080706',
          ink: '#0D0B08',
          deep: '#120F0A',
          surface: '#181510',
          card: '#1E1B14',
          card2: '#242118',
          gold: '#C9A84C',
          'gold-bright': '#E8CC70',
          'gold-mid': '#A88535',
          'gold-dim': '#7A6025',
          'gold-faint': '#3D2E0C',
          'gold-trace': '#221808',
          beige: '#F5EDD8',
          'beige-mid': '#D4C9A8',
          'beige-dim': '#8A7D60',
          'beige-trace': '#2A2518',
          rim: 'rgba(212,195,150,0.07)',
          rim2: 'rgba(212,195,150,0.12)',
          rim3: 'rgba(212,195,150,0.22)',
          white: 'rgba(245,237,216,0.95)',
          muted: 'rgba(212,195,150,0.60)',
          dim: 'rgba(212,195,150,0.30)',
          faint: 'rgba(212,195,150,0.14)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Cormorant Garamond', 'serif'],
        body: ['var(--font-body)', 'Outfit', 'sans-serif'],
        mono: ['var(--font-mono)', 'DM Mono', 'monospace'],
      },
      boxShadow: {
        aura: '0 0 20px -5px rgba(212, 175, 55, 0.4)',
        'aura-strong': '0 0 30px -5px rgba(212, 175, 55, 0.6)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backgroundImage: {
        'speed-lines': "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 11px)",
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-aura': 'pulseAura 3s infinite',
        'trending-pulse': 'trendingPulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        marquee: 'marquee 40s linear infinite',
        breathe: 'breathe 9s ease-in-out infinite',
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scroll-line': 'scrollLine 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseAura: {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(201,168,76,0.4)' },
          '50%': { boxShadow: '0 0 40px -5px rgba(201,168,76,0.7)' },
        },
        trendingPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.15)', opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.12)', opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollLine: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '51%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
      },
    },
  },
  plugins: [],
};
