/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
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
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'aura': '0 0 20px -5px rgba(212, 175, 55, 0.4)',
        'aura-strong': '0 0 30px -5px rgba(212, 175, 55, 0.6)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
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
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseAura: {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 40px -5px rgba(212, 175, 55, 0.8)' },
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
      }
    },
  },
  plugins: [],
};