'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Mail, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Check, 
  AlertTriangle,
  Trash2,
  Download
} from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabase';

export default function ProfileSecurityPage() {
  const navigate = useNavigate();
  const { profile, session, clearAuth } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async () => {
    if (!session?.user || !supabase) return;
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      setSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!session?.user || !supabase) return;
    
    setDeleting(true);
    
    try {
      // Delete user data from profiles
      await supabase
        .from('profiles')
        .delete()
        .eq('id', session.user.id);
      
      // Delete auth user
      const { error } = await supabase.auth.admin.deleteUser(session.user.id);
      
      if (error) throw error;
      
      clearAuth();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please contact support.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

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
              <h1 className="text-2xl font-display text-white">Privacy & Security</h1>
              <p className="text-white/40 text-sm">Manage your account security and privacy settings</p>
            </div>
          </div>

          {/* Security Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-luxury-gold" />
              <h2 className="text-lg font-medium text-white">Security</h2>
            </div>
            
            <div className="bg-luxury-black/50 border border-white/10 rounded-xl overflow-hidden">
              {/* Email */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-sm text-white">Email Address</p>
                    <p className="text-xs text-white/40">{profile?.email || session?.user?.email}</p>
                  </div>
                </div>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified
                </span>
              </div>
              
              {/* Phone */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-sm text-white">Phone Number</p>
                    <p className="text-xs text-white/40">{profile?.phone || 'Not set'}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="text-xs text-luxury-gold hover:text-white"
                >
                  Update in profile
                </Link>
              </div>
              
              {/* Password Change */}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-5 h-5 text-white/40" />
                  <p className="text-sm text-white">Change Password</p>
                </div>
                
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-luxury-gold/50 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-luxury-gold/50 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-luxury-gold/50 transition-colors"
                  />
                  
                  <button
                    onClick={handlePasswordChange}
                    disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                    className="w-full rounded-lg bg-luxury-gold py-2.5 text-sm font-semibold text-black hover:bg-luxury-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {saved ? (
                      <><Check className="w-4 h-4" /> Password Updated</>
                    ) : saving ? (
                      'Updating...'
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-luxury-gold" />
              <h2 className="text-lg font-medium text-white">Privacy</h2>
            </div>
            
            <div className="bg-luxury-black/50 border border-white/10 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <p className="text-sm text-white">Download Your Data</p>
                  <p className="text-xs text-white/40">Export all your account data</p>
                </div>
                <button className="p-2 text-white/40 hover:text-luxury-gold transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4">
                <p className="text-xs text-white/40 mb-3">
                  Your data is stored securely and you can request a copy at any time.
                </p>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-medium text-red-400">Danger Zone</h2>
            </div>
            
            <div className="bg-luxury-black/50 border border-red-500/20 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-white">Delete Account</p>
                  <p className="text-xs text-white/40">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </section>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#0E1012] p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-medium text-white">Delete Account</h3>
                </div>
                <p className="text-white/60 text-sm mb-6">
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
