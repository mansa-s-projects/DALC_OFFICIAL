'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Eye,
  Car,
  Users,
  Home,
  Lock,
  CheckCircle,
} from 'lucide-react';
import Footer from '@/components/navigation/Footer';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SERVICES = [
  {
    icon: Shield,
    label: 'Personal Protection Officers',
    desc: 'Discreet, professionally trained close protection agents. Ex-military and government-vetted, operating in plain clothes or formal attire.',
  },
  {
    icon: Car,
    label: 'Secure Transport',
    desc: 'Armoured and executive vehicle options. Trained security drivers with route management, counter-surveillance, and emergency protocols.',
  },
  {
    icon: Eye,
    label: 'Advance Team',
    desc: 'Pre-event site surveys, threat assessment, route planning, and venue security sweeps "” before you arrive anywhere.',
  },
  {
    icon: Users,
    label: 'Event Security',
    desc: 'Crowd management, access control, and VIP protection for private events, parties, and high-profile gatherings.',
  },
  {
    icon: Home,
    label: 'Residential Security',
    desc: 'Villa and estate security "” manned guarding, CCTV monitoring, access management, and domestic staff vetting.',
  },
  {
    icon: Lock,
    label: 'Executive Travel Security',
    desc: 'Comprehensive security for international travel "” airport assistance, hotel safety review, and in-country protection throughout the UAE and region.',
  },
];

const WHY_US = [
  {
    stat: '100%',
    label: 'Licensed & Insured',
    desc: 'All officers hold UAE security licences and are fully insured. We operate in full compliance with UAE regulations.',
  },
  {
    stat: 'Ex-Mil',
    label: 'Military-Grade Training',
    desc: 'Our team includes veterans of elite military and government protection units across multiple countries.',
  },
  {
    stat: 'Zero',
    label: 'Discretion Policy',
    desc: 'We operate on a strict no-disclosure policy. Client identities and protection details are never shared.',
  },
  {
    stat: '24/7',
    label: 'Always Available',
    desc: 'Around-the-clock deployment. Last-minute security arrangements are our speciality.',
  },
];

const PROCESS = [
  { num: '01', title: 'Consultation', desc: 'A confidential discussion about your needs, schedule, exposure level, and concerns "” no obligation.' },
  { num: '02', title: 'Risk Assessment', desc: 'Our security analysts conduct a threat and vulnerability assessment tailored to your profile and itinerary.' },
  { num: '03', title: 'Deployment Plan', desc: 'We design a comprehensive protection plan "” team composition, vehicles, communication protocols, and contingencies.' },
  { num: '04', title: '24/7 Coverage', desc: 'Your protection team is deployed. Continuous communication, daily briefings, and instant incident response.' },
];

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function VipSecurityPage() {
  return (
    <div className="min-h-screen bg-luxury-black">
      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop"
            alt="VIP security Dubai"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/90 via-luxury-black/60 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.06),transparent_65%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-28 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/services" className="inline-flex items-center gap-2 text-gray-500 text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors duration-300 mb-10">
              <ArrowLeft className="w-3.5 h-3.5" />
              All Services
            </Link>

            <div className="inline-flex items-center gap-2 px-5 py-2 border border-luxury-gold/30 bg-luxury-gold/5 mb-8 block">
              <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em]">
                Dubai · VIP Security
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[84px] font-display text-white leading-[0.92] mb-7 tracking-tight">
              Your Safety.
              <br />
              <em className="not-italic text-luxury-gold">Our Priority.</em>
            </h1>

            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
              Discreet, professional personal protection for high-net-worth individuals, families,
              and executives in Dubai and across the region.
            </p>

            {/* Privacy-first CTA "” WhatsApp only */}
            <div className="flex justify-center">
              <a
                href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20a%20confidential%20security%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-10 py-5 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                Request a Confidential Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <p className="text-gray-600 text-xs uppercase tracking-widest mt-5">
              WhatsApp only "” no public contact form "” your privacy is paramount
            </p>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Discretion Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-y border-white/[0.07] bg-white/[0.02] py-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-10">
          {[
            { icon: Lock, label: 'NDA Standard for All Clients' },
            { icon: Shield, label: 'UAE Licensed & Insured' },
            { icon: Eye, label: 'No Public Client Disclosure' },
            { icon: CheckCircle, label: 'Government Background Checks' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={idx} {...fade(idx * 0.08)} className="flex items-center gap-3 text-gray-400">
                <Icon className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                <span className="text-xs uppercase tracking-widest">{item.label}</span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ Services â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-16">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Services</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Comprehensive protection.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <motion.div key={idx} {...fade(idx * 0.07)}>
                <div className="border border-white/[0.07] hover:border-luxury-gold/30 bg-luxury-black p-8 transition-all duration-500 group h-full">
                  <div className="text-luxury-gold/60 group-hover:text-luxury-gold transition-colors duration-300 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg text-white mb-3">{svc.label}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{svc.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ Why Trust Us â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-16 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Why Trust Us</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">
              The standard that never compromises.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05]">
            {WHY_US.map((item, idx) => (
              <motion.div key={idx} {...fade(idx * 0.08)} className="bg-luxury-black p-8 text-center">
                <p className="font-display text-4xl text-luxury-gold mb-2">{item.stat}</p>
                <p className="text-white text-xs font-bold uppercase tracking-wider mb-3">{item.label}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Narrative â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fade()}>
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Our Approach</p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              Protection that feels
              <br />
              <span className="text-luxury-gold">invisible.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              The best security is the kind no one knows is there. Our officers are trained to blend
              seamlessly into any environment "” whether a Michelin-starred restaurant, a royal gathering,
              or a corporate board meeting.
            </p>
            <p className="text-gray-400 leading-relaxed mb-5">
              We understand that our clients require absolute discretion. Their identities, schedules,
              and protection arrangements are never disclosed under any circumstances. Every engagement
              begins with a mutual NDA.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Our team has operated at the highest levels "” protecting heads of state, major business
              figures, and prominent families across the Gulf, Europe, and beyond.
            </p>
          </motion.div>

          <motion.div {...fade(0.15)}>
            <div className="relative border border-white/[0.07] bg-white/[0.02] p-10">
              <div className="absolute top-0 left-0 w-12 h-[1px] bg-luxury-gold/60" />
              <div className="absolute top-0 left-0 w-[1px] h-12 bg-luxury-gold/60" />
              <div className="absolute bottom-0 right-0 w-12 h-[1px] bg-luxury-gold/60" />
              <div className="absolute bottom-0 right-0 w-[1px] h-12 bg-luxury-gold/60" />

              <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-8">Our Standards</p>
              <div className="space-y-5">
                {[
                  'All officers ex-military or government service',
                  'UAE security licence mandatory for all personnel',
                  'Full background and criminal record check',
                  'Regular re-certification and training',
                  'Weapons cleared where permitted by UAE law',
                  'Fluent in English and Arabic minimum',
                  'Strict no-social-media policy',
                ].map((standard, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-luxury-gold mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ How It Works â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-16 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Our Process</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">From consultation to coverage.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05]">
            {PROCESS.map((step, idx) => (
              <motion.div key={idx} {...fade(idx * 0.08)} className="bg-luxury-black p-8">
                <span className="font-display text-[52px] leading-none text-luxury-gold/12 font-bold block mb-4 select-none">{step.num}</span>
                <h3 className="font-display text-lg text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Final CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fade()}>
            <Shield className="w-10 h-10 text-luxury-gold/40 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-display text-white mb-8 leading-tight">
              Your security consultation
              <br />
              <span className="text-luxury-gold">is completely confidential.</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-12 max-w-xl mx-auto">
              We do not publish client lists, case studies, or any identifying information.
              All enquiries are treated with absolute discretion from the first message.
            </p>
            <a
              href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20a%20confidential%20security%20consultation.%20Please%20contact%20me%20privately."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-12 py-5 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
            >
              Request a Security Consultation
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-gray-600 text-xs uppercase tracking-widest mt-5">
              WhatsApp only · No public form · End-to-end encrypted
            </p>

            <div className="mt-12 pt-10 border-t border-white/[0.07]">
              <Link href="/services" className="text-gray-500 text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors duration-300 inline-flex items-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


