'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Crown,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  Bookmark,
  ClipboardList,
  Edit3,
  Shield,
  Check,
} from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabase';
import { SKILL_LABELS } from '../../types';
import type { UserSkill, UserTier } from '../../types';

// ─── Tier config ──────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<UserTier, { label: string; color: string; ring: string }> = {
  standard: { label: 'Standard',  color: 'text-white/60',    ring: 'border-white/20' },
  gold:     { label: 'Gold',      color: 'text-[#EFD7A4]',   ring: 'border-[#C8A46B]/50' },
  platinum: { label: 'Platinum',  color: 'text-[#D0D8E8]',   ring: 'border-[#A8B8D0]/50' },
  black:    { label: 'Black',     color: 'text-white',        ring: 'border-white/40' },
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditProfileModal({
  initialFirstName,
  initialLastName,
  initialPhone,
  onClose,
  onSave,
}: {
  initialFirstName: string;
  initialLastName: string;
  initialPhone: string;
  onClose: () => void;
  onSave: (first: string, last: string, phone: string) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(firstName, lastName, phone);
    setSaving(false);
    setSaved(true);
    setTimeout(onClose, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0E1012] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-white mb-5">Edit Profile</h2>
        <div className="space-y-4">
          {[
            { label: 'First Name', value: firstName, setter: setFirstName, placeholder: 'John' },
            { label: 'Last Name', value: lastName, setter: setLastName, placeholder: 'Doe' },
            { label: 'Phone', value: phone, setter: setPhone, placeholder: '+971 50 000 0000' },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-[0.1em]">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-[#C8A46B]/50 transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white/80 hover:border-white/20 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex-1 rounded-xl bg-[#C8A46B] py-2.5 text-sm font-semibold text-black hover:bg-[#EFD7A4] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {saved ? (
              <><Check className="h-4 w-4" /> Saved</>
            ) : saving ? (
              'Saving…'
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { profile, session, clearAuth, savedVenues } = useAppStore();
  const [showEdit, setShowEdit] = useState(false);

  const isLoggedIn = Boolean(session && profile);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050607] text-white">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm"
          >
            <div className="mx-auto mb-6 h-16 w-16 rounded-full border border-[#C8A46B]/20 flex items-center justify-center">
              <User className="h-7 w-7 text-[#C8A46B]/60" />
            </div>
            <h2 className="font-display text-2xl text-white mb-2">Sign In Required</h2>
            <p className="text-white/40 mb-6 text-sm">Create an account or sign in to view your profile.</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/auth/login"
                className="rounded-xl border border-[#C8A46B]/30 bg-[#C8A46B]/10 px-6 py-2.5 text-sm text-[#EFD7A4] hover:bg-[#C8A46B]/20 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="rounded-xl bg-[#C8A46B] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#EFD7A4] transition-all"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const tier = (profile?.tier as UserTier) ?? 'standard';
  const tierConfig = TIER_CONFIG[tier];
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    profile?.email?.split('@')[0] ||
    'Member';

  const handleEditSave = async (first: string, last: string, phone: string) => {
    if (!supabase || !session?.user) return;
    await supabase
      .from('profiles')
      .update({ first_name: first, last_name: last, phone })
      .eq('id', session.user.id);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    clearAuth();
    router.push('/');
  };

  const QUICK_LINKS = [
    { icon: ClipboardList, label: 'My Requests', desc: 'Track all your bookings', href: '/my-requests' },
    { icon: Bookmark, label: 'Saved Venues', desc: `${savedVenues.length} saved`, href: '/explore' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Manage your data', href: '#' },
    { icon: Settings, label: 'Preferences', desc: 'Notifications & settings', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <Navbar />

      {showEdit && (
        <EditProfileModal
          initialFirstName={profile?.first_name ?? ''}
          initialLastName={profile?.last_name ?? ''}
          initialPhone={profile?.phone ?? ''}
          onClose={() => setShowEdit(false)}
          onSave={handleEditSave}
        />
      )}

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-12 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-start gap-5"
          >
            {/* Avatar */}
            <div className={`relative flex-shrink-0 h-20 w-20 rounded-full border-2 ${tierConfig.ring} flex items-center justify-center bg-white/5 overflow-hidden`}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-2xl text-white/80">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
              {tier !== 'standard' && (
                <div className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-full bg-[#0a0b0c] border border-[#0a0b0c] flex items-center justify-center">
                  <Crown className={`h-3.5 w-3.5 ${tierConfig.color}`} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="font-display text-2xl text-white truncate">{displayName}</h1>
                <button
                  onClick={() => setShowEdit(true)}
                  className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
                  title="Edit profile"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
              <span className={`text-xs font-bold uppercase tracking-[0.2em] ${tierConfig.color}`}>
                {tierConfig.label} Member
              </span>
              <div className="mt-2 space-y-1">
                {profile?.email && (
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Skills / Interests ─────────────────────────────────────────────── */}
      {profile?.skills && profile.skills.length > 0 && (
        <section className="pb-8 px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-white/8 bg-white/3 p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-[#C8A46B]" />
                <h2 className="text-sm font-semibold text-white/80 uppercase tracking-[0.15em]">Your Interests</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {(profile.skills as UserSkill[]).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#C8A46B]/25 bg-[#C8A46B]/8 px-3 py-1 text-xs text-[#EFD7A4]/80"
                  >
                    {SKILL_LABELS[skill] ?? skill}
                  </span>
                ))}
              </div>
              <Link
                href="/onboarding"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-[#C8A46B] transition-colors"
              >
                <Edit3 className="h-3 w-3" /> Update interests
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Quick Links ───────────────────────────────────────────────────── */}
      <section className="pb-8 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-white/8 bg-white/3 overflow-hidden"
          >
            {QUICK_LINKS.map(({ icon: Icon, label, desc, href }, idx) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors group ${idx < QUICK_LINKS.length - 1 ? 'border-b border-white/6' : ''}`}
              >
                <div className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-[#C8A46B]/30 transition-colors">
                  <Icon className="h-4 w-4 text-white/40 group-hover:text-[#C8A46B]/80 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 group-hover:text-white transition-colors">{label}</p>
                  <p className="text-xs text-white/30">{desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Sign Out ──────────────────────────────────────────────────────────────── */}
      <section className="pb-24 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-sm text-red-400/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </motion.button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
