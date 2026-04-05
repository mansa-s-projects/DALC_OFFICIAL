'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  Bell,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import { AvatarUpload } from '../../components/AvatarUpload';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabase';
import { useUserTransportBookings } from '../../hooks/useTransportBooking';
import { useUserExperienceBookings } from '../../hooks/useExperienceBooking';
import { useUserStaysBookings } from '../../hooks/useStaysBooking';
import { useRequests } from '../../hooks/useRequests';
import { SKILL_LABELS, REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS } from '../../types';
import type { UserSkill, UserTier } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileTab = 'overview' | 'bookings' | 'requests' | 'saved' | 'documents' | 'settings';

interface BookingItem {
  id: string;
  type: 'transport' | 'experience' | 'stay';
  title: string;
  date: string;
  status: string;
  amount?: string;
  details?: Record<string, string>;
}

// ─── Tier Config ──────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<UserTier, { label: string; color: string; ring: string; gradient: string }> = {
  standard: { 
    label: 'Standard',  
    color: 'text-white/60',    
    ring: 'border-white/20',
    gradient: 'from-white/5 to-transparent'
  },
  gold:     { 
    label: 'Gold',      
    color: 'text-[#EFD7A4]',   
    ring: 'border-[#C8A46B]/50',
    gradient: 'from-[#C8A46B]/20 to-transparent'
  },
  platinum: { 
    label: 'Platinum',  
    color: 'text-[#D0D8E8]',   
    ring: 'border-[#A8B8D0]/50',
    gradient: 'from-[#A8B8D0]/20 to-transparent'
  },
  black:    { 
    label: 'Black',     
    color: 'text-white',        
    ring: 'border-white/40',
    gradient: 'from-white/20 to-transparent'
  },
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

// ─── Bookings Section ─────────────────────────────────────────────────────────

function BookingsSection({ userId }: { userId: string }) {
  const { data: transportBookings, isLoading: transportLoading } = useUserTransportBookings(userId);
  const { data: experienceBookings, isLoading: experienceLoading } = useUserExperienceBookings(userId);
  const { data: stayBookings, isLoading: staysLoading } = useUserStaysBookings(userId);

  const isLoading = transportLoading || experienceLoading || staysLoading;

  const allBookings: BookingItem[] = [
    ...(transportBookings?.map((b: any) => ({
      id: b.id,
      type: 'transport' as const,
      title: `${b.vehicle_name || 'Vehicle'} Rental`,
      date: b.start_date || b.created_at,
      status: b.status || 'confirmed',
      amount: b.total_price ? `AED ${b.total_price}` : undefined,
      details: {
        'Pickup': b.pickup_location || 'TBD',
        'Duration': b.duration_days ? `${b.duration_days} days` : 'N/A',
      },
    })) || []),
    ...(experienceBookings?.map((b: any) => ({
      id: b.id,
      type: 'experience' as const,
      title: b.experience_name || 'Experience',
      date: b.booking_date || b.created_at,
      status: b.status || 'confirmed',
      amount: b.total_price ? `AED ${b.total_price}` : undefined,
      details: {
        'Guests': b.guest_count?.toString() || 'N/A',
        'Time': b.time_slot || 'TBD',
      },
    })) || []),
    ...(stayBookings?.map((b: any) => ({
      id: b.id,
      type: 'stay' as const,
      title: b.property_name || 'Accommodation',
      date: b.check_in || b.created_at,
      status: b.status || 'confirmed',
      amount: b.total_price ? `AED ${b.total_price}` : undefined,
      details: {
        'Check-in': b.check_in ? new Date(b.check_in).toLocaleDateString() : 'TBD',
        'Nights': b.nights?.toString() || 'N/A',
      },
    })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#C8A46B] animate-spin" />
      </div>
    );
  }

  if (allBookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h3 className="text-lg text-white mb-2">No bookings yet</h3>
        <p className="text-white/40 text-sm mb-6">Start exploring and book your first experience</p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A46B] text-black rounded-xl font-medium hover:bg-[#EFD7A4] transition-colors"
        >
          Explore Dubai
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allBookings.map((booking) => (
        <div
          key={booking.id}
          className="p-5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                booking.type === 'transport' ? 'bg-blue-500/10' :
                booking.type === 'experience' ? 'bg-purple-500/10' :
                'bg-emerald-500/10'
              }`}>
                {booking.type === 'transport' && <MapPin className="w-6 h-6 text-blue-400" />}
                {booking.type === 'experience' && <Star className="w-6 h-6 text-purple-400" />}
                {booking.type === 'stay' && <Calendar className="w-6 h-6 text-emerald-400" />}
              </div>
              <div>
                <h4 className="text-white font-medium">{booking.title}</h4>
                <p className="text-white/40 text-sm mt-1">
                  {new Date(booking.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                {booking.details && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {Object.entries(booking.details).map(([key, value]) => (
                      <span key={key} className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${
                booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' :
                booking.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                'bg-white/10 text-white/60'
              }`}>
                {booking.status}
              </span>
              {booking.amount && (
                <p className="text-[#C8A46B] font-medium mt-2">{booking.amount}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Requests Section ─────────────────────────────────────────────────────────

function RequestsSection({ userId }: { userId: string }) {
  const { requests, requestsQuery } = useRequests(userId);

  if (requestsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#C8A46B] animate-spin" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h3 className="text-lg text-white mb-2">No requests yet</h3>
        <p className="text-white/40 text-sm mb-6">Submit a concierge request for personalized assistance</p>
        <Link
          href="/request"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A46B] text-black rounded-xl font-medium hover:bg-[#EFD7A4] transition-colors"
        >
          Make a Request
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Link
          key={request.id}
          href={`/my-requests/${request.id}`}
          className="block p-5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white font-medium">
                {request.venue_name || request.title || 'Concierge Request'}
              </h4>
              <p className="text-white/40 text-sm mt-1 capitalize">
                {request.category.replace(/-/g, ' ')}
              </p>
              {request.date_time && (
                <p className="text-white/30 text-xs mt-1">
                  {new Date(request.date_time).toLocaleDateString()}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              REQUEST_STATUS_COLORS[request.status]
            }`}>
              {REQUEST_STATUS_LABELS[request.status]}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Settings Section ─────────────────────────────────────────────────────────

function SettingsSection() {
  const router = useRouter();
  const { profile, session, clearAuth } = useAppStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateEmail = async (newEmail: string) => {
    if (!supabase) return;
    setIsUpdating(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setIsUpdating(false);
    if (error) alert(error.message);
    else alert('Check your email to confirm the change');
  };

  const handleChangePassword = async () => {
    if (!supabase || !profile?.email) return;
    setIsUpdating(true);
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
    setIsUpdating(false);
    if (error) alert(error.message);
    else alert('Password reset email sent');
  };

  const handleDeleteAccount = async () => {
    if (!supabase || !session?.user) return;
    setIsUpdating(true);
    
    // Soft delete - mark profile as deleted
    const { error } = await supabase
      .from('profiles')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', session.user.id);

    if (error) {
      alert('Failed to delete account');
      setIsUpdating(false);
      return;
    }

    await supabase.auth.signOut();
    clearAuth();
    router.push('/');
  };

  const handleSignOutAll = async () => {
    if (!supabase) return;
    setIsUpdating(true);
    await supabase.auth.signOut({ scope: 'global' });
    clearAuth();
    router.push('/');
  };

  return (
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#C8A46B]" />
          Account Settings
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => handleChangePassword()}
            disabled={isUpdating}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            <div>
              <p className="text-white text-sm">Change Password</p>
              <p className="text-white/40 text-xs">Reset via email</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" />
          </button>
          <button
            onClick={handleSignOutAll}
            disabled={isUpdating}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            <div>
              <p className="text-white text-sm">Sign Out All Devices</p>
              <p className="text-white/40 text-xs">End all active sessions</p>
            </div>
            <LogOut className="w-4 h-4 text-white/30" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#C8A46B]" />
          Notifications
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Booking confirmations', default: true },
            { label: 'Request updates', default: true },
            { label: 'Promotional offers', default: false },
            { label: 'New experiences', default: true },
          ].map((item) => (
            <label key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5 cursor-pointer">
              <span className="text-white/70 text-sm">{item.label}</span>
              <input 
                type="checkbox" 
                defaultChecked={item.default}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#C8A46B] focus:ring-[#C8A46B]"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#C8A46B]" />
          Privacy
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 cursor-pointer">
            <span className="text-white/70 text-sm">Allow concierge to contact me</span>
            <input 
              type="checkbox" 
              defaultChecked={true}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#C8A46B]"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <h3 className="text-red-400 font-medium mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Danger Zone
        </h3>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-2 p-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-white/60 text-sm">This will permanently delete your account. Are you sure?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isUpdating}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { profile, session, clearAuth, savedVenues } = useAppStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
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

  const TABS: { id: ProfileTab; label: string; icon: typeof User }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'requests', label: 'My Requests', icon: ClipboardList },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
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

      {/* Hero Section */}
      <section className={`pt-28 pb-12 px-4 md:px-8 bg-gradient-to-b ${tierConfig.gradient}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-start gap-5"
          >
            {/* Avatar with Upload */}
            <AvatarUpload 
              currentUrl={profile?.avatar_url} 
              size="lg"
            />

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

      {/* Tabs Navigation */}
      <div className="border-b border-white/8">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-[#C8A46B] text-[#C8A46B]'
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <section className="py-8 px-4 md:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Skills / Interests */}
                  {profile?.skills && profile.skills.length > 0 && (
                    <div className="rounded-xl border border-white/8 bg-white/3 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-[#C8A46B]" />
                          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-[0.15em]">Your Interests</h2>
                        </div>
                        <Link
                          href="/onboarding"
                          className="text-xs text-[#C8A46B] hover:text-[#EFD7A4] transition-colors"
                        >
                          Update
                        </Link>
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
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
                    {[
                      { icon: ClipboardList, label: 'My Requests', desc: 'Track your concierge requests', href: '#', onClick: () => setActiveTab('requests') },
                      { icon: Bookmark, label: 'Saved Venues', desc: `${savedVenues.length} saved`, href: '#', onClick: () => setActiveTab('saved') },
                      { icon: Shield, label: 'Privacy & Security', desc: 'Manage your data', href: '#', onClick: () => setActiveTab('settings') },
                      { icon: Crown, label: 'Membership', desc: `${tierConfig.label} tier benefits`, href: '/membership' },
                    ].map(({ icon: Icon, label, desc, href, onClick }, idx) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={(e) => {
                          if (onClick) {
                            e.preventDefault();
                            onClick();
                          }
                        }}
                        className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors group ${idx < 3 ? 'border-b border-white/6' : ''}`}
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
                  </div>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && session?.user && (
                <BookingsSection userId={session.user.id} />
              )}

              {/* Requests Tab */}
              {activeTab === 'requests' && session?.user && (
                <RequestsSection userId={session.user.id} />
              )}

              {/* Saved Tab */}
              {activeTab === 'saved' && (
                <div className="text-center py-12">
                  <Bookmark className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg text-white mb-2">Saved Venues</h3>
                  <p className="text-white/40 text-sm mb-6">
                    {savedVenues.length > 0 
                      ? `${savedVenues.length} venues saved`
                      : 'No saved venues yet'
                    }
                  </p>
                  <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A46B] text-black rounded-xl font-medium hover:bg-[#EFD7A4] transition-colors"
                  >
                    Explore Venues
                  </Link>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg text-white mb-2">Documents</h3>
                  <p className="text-white/40 text-sm mb-6">
                    Your relocation and visa documents will appear here
                  </p>
                  <Link
                    href="/move-to-dubai"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A46B] text-black rounded-xl font-medium hover:bg-[#EFD7A4] transition-colors"
                  >
                    Start Relocation
                  </Link>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <SettingsSection />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Sign Out */}
      <section className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050607] to-transparent">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-sm text-red-400/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </section>

      <div className="h-20" /> {/* Spacer for fixed button */}
      <Footer />
    </div>
  );
}
