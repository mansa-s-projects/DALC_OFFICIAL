'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { MapPin, Bell, ArrowRight, Wifi, Navigation, Layers } from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';

const FEATURES = [
  {
    icon: Navigation,
    label: 'Real-Time Positioning',
    description: 'See every DALC-vetted venue, transport pickup point, and dining destination on a live city map.',
  },
  {
    icon: Layers,
    label: 'Multi-Layer Filtering',
    description: 'Toggle between nightlife, experiences, transport hubs, hotels, and business districts.',
  },
  {
    icon: Wifi,
    label: 'Live Availability',
    description: 'Real-time venue occupancy, wait times, and booking windows — all pinned to the map.',
  },
];

export default function LiveMapPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const dots: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 60; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
        a: Math.random(),
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${d.a * 0.4})`;
        ctx.fill();
      });
      dots.forEach((a, i) => {
        dots.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(201,168,76,${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="min-h-screen bg-[#080706] flex flex-col">
      <Navbar />

      <section className="relative flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden min-h-[75vh]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

        <div className="relative z-10 mb-10">
          <div className="relative w-20 h-20 mx-auto">
            <motion.div
              animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-luxury-gold/20"
            />
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              className="absolute inset-0 rounded-full bg-luxury-gold/15"
            />
            <div className="relative z-10 w-20 h-20 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-luxury-gold" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.5em] mb-5">Coming Soon</p>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">Dubai Live Map</h1>
          <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed mb-10">
            An interactive real-time city layer showing every DALC venue, transport node, and experience on a living map of Dubai.
          </p>
          <Link
            href="/request"
            className="inline-flex items-center gap-3 px-8 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
          >
            <Bell className="w-4 h-4" />
            Notify Me at Launch
          </Link>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.03]" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/[0.03]" />
        </div>
      </section>

      <section className="px-4 md:px-8 max-w-5xl mx-auto pb-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {FEATURES.map(({ icon: Icon, label, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-[#080706] p-8 flex flex-col gap-4"
            >
              <div className="w-10 h-10 border border-luxury-gold/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-luxury-gold" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-display text-lg">{label}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 text-gray-500 text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors"
          >
            Browse Experiences in the meantime
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
