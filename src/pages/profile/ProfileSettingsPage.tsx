'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings, 
  Bell, 
  Mail, 
  Smartphone, 
  Check,
  Loader2
} from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabase';

interface NotificationPreferences {
  booking_confirmations: boolean;
  request_updates: boolean;
  messages: boolean;
  waitlist_alerts: boolean;
  promotions: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  booking_confirmations: true,
  request_updates: true,
  messages: true,
  waitlist_alerts: true,
  promotions: true,
  marketing: false,
};

export default function ProfileSettingsPage() {
  const { profile, session } = useAppStore();
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreferences() {
      if (!session?.user || !supabase) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('notification_preferences')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        
        if (data?.notification_preferences) {
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...(data.notification_preferences as Partial<NotificationPreferences>),
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPreferences();
  }, [session?.user]);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!session?.user || !supabase) return;
    
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: preferences })
        .eq('id', session.user.id);
      
      if (error) throw error;
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const notificationOptions: { key: keyof NotificationPreferences; label: string; description: string; channels: string[] }[] = [
    {
      key: 'booking_confirmations',
      label: 'Booking Confirmations',
      description: 'Get notified when your bookings are confirmed or cancelled',
      channels: ['Email', 'In-app'],
    },
    {
      key: 'request_updates',
      label: 'Request Updates',
      description: 'Stay informed about your concierge request status changes',
      channels: ['Email', 'In-app'],
    },
    {
      key: 'messages',
      label: 'Messages from Concierge',
      description: 'Receive messages from your dedicated concierge team',
      channels: ['Email', 'In-app'],
    },
    {
      key: 'waitlist_alerts',
      label: 'Waitlist Alerts',
      description: 'Get notified when spots open up for sold-out experiences',
      channels: ['In-app'],
    },
    {
      key: 'promotions',
      label: 'Promotional Offers',
      description: 'Exclusive deals and special offers from Dubai À La Carte',
      channels: ['Email'],
    },
    {
      key: 'marketing',
      label: 'Marketing Newsletter',
      description: 'News, guides and inspiration about Dubai lifestyle',
      channels: ['Email'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/profile"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-display text-white">Preferences</h1>
              <p className="text-white/40 text-sm">Manage your notification and account preferences</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-luxury-gold" />
            </div>
          ) : (
            <>
              {/* Notifications Section */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-luxury-gold" />
                  <h2 className="text-lg font-medium text-white">Notifications</h2>
                </div>
                
                <div className="bg-luxury-black/50 border border-white/10 rounded-xl overflow-hidden">
                  {notificationOptions.map((option, index) => (
                    <div
                      key={option.key}
                      className={`flex items-center justify-between p-4 ${
                        index < notificationOptions.length - 1 ? 'border-b border-white/10' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm text-white">{option.label}</p>
                        <p className="text-xs text-white/40 mt-0.5">{option.description}</p>
                        <div className="flex gap-2 mt-2">
                          {option.channels.map((channel) => (
                            <span
                              key={channel}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40"
                            >
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle(option.key)}
                        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                          preferences[option.key]
                            ? 'bg-luxury-gold'
                            : 'bg-white/10'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            preferences[option.key] ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-4 w-full rounded-lg bg-luxury-gold py-2.5 text-sm font-semibold text-black hover:bg-luxury-gold/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {saved ? (
                    <><Check className="w-4 h-4" /> Saved</>
                  ) : saving ? (
                    'Saving...'
                  ) : (
                    'Save Preferences'
                  )}
                </button>
              </section>

              {/* Account Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-luxury-gold" />
                  <h2 className="text-lg font-medium text-white">Account</h2>
                </div>
                
                <div className="bg-luxury-black/50 border border-white/10 rounded-xl overflow-hidden">
                  <Link
                    to="/profile/security"
                    className="flex items-center justify-between p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-white/40" />
                      <div>
                        <p className="text-sm text-white">Privacy & Security</p>
                        <p className="text-xs text-white/40">Password and account settings</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  </Link>
                  
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-white/40" />
                      <div>
                        <p className="text-sm text-white">Profile Information</p>
                        <p className="text-xs text-white/40">Name, phone and avatar</p>
                      </div>
                    </div>
                    <Link to="/profile" className="text-xs text-luxury-gold hover:text-white">
                      Edit
                    </Link>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

function Lock({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
