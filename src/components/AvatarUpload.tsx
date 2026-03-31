'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Loader2, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';

interface AvatarUploadProps {
  currentUrl?: string;
  onUploadComplete?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: { container: 'w-12 h-12', icon: 16 },
  md: { container: 'w-20 h-20', icon: 24 },
  lg: { container: 'w-32 h-32', icon: 32 },
};

export function AvatarUpload({ currentUrl, onUploadComplete, size = 'md' }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = useAppStore((s) => s.session);
  const setProfile = useAppStore((s) => s.setProfile);
  const profile = useAppStore((s) => s.profile);

  const sizes = SIZE_MAP[size];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview || !session?.user) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Convert preview to file
      const response = await fetch(preview);
      const blob = await response.blob();
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

      const userId = session.user.id;
      const filePath = `${userId}/${Date.now()}.jpg`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Update local state
      if (profile) {
        setProfile({ ...profile, avatar_url: publicUrl });
      }

      onUploadComplete?.(publicUrl);
      setIsOpen(false);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = async () => {
    if (!session?.user) return;

    try {
      // Update profile to remove avatar
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', session.user.id);

      if (error) throw error;

      // Update local state
      if (profile) {
        setProfile({ ...profile, avatar_url: undefined });
      }

      onUploadComplete?.('');
      setIsOpen(false);
      setPreview(null);
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  return (
    <>
      {/* Avatar Display with Upload Button */}
      <div className="relative group">
        <div 
          className={`${sizes.container} rounded-full border-2 border-[#C8A46B]/30 overflow-hidden bg-white/5 flex items-center justify-center`}
        >
          {currentUrl ? (
            <img 
              src={currentUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-2xl text-white/60">
              {profile?.first_name?.charAt(0).toUpperCase() || 
               profile?.email?.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>
        
        {/* Upload Button Overlay */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera className="w-5 h-5 text-white" style={{ width: sizes.icon * 0.8, height: sizes.icon * 0.8 }} />
        </button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
            onClick={() => !isUploading && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm rounded-2xl border border-[#C8A46B]/30 bg-[#0E1012] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display text-white">Update Avatar</h2>
                {!isUploading && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Preview Area */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full border-2 border-[#C8A46B]/30 overflow-hidden bg-white/5 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : currentUrl ? (
                    <img src={currentUrl} alt="Current" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-10 h-10 text-white/30" />
                  )}
                </div>
              </div>

              {/* File Input */}
              {!isUploading && (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-6 rounded-xl border border-[#C8A46B]/30 bg-[#C8A46B]/10 text-[#EFD7A4] font-medium hover:bg-[#C8A46B]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {preview ? 'Choose Different Photo' : 'Select Photo'}
                  </button>

                  {preview && (
                    <button
                      onClick={handleUpload}
                      className="w-full py-3 px-6 rounded-xl bg-[#C8A46B] text-black font-semibold hover:bg-[#EFD7A4] transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Avatar
                    </button>
                  )}

                  {currentUrl && (
                    <button
                      onClick={handleRemove}
                      className="w-full py-3 px-6 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors"
                    >
                      Remove Avatar
                    </button>
                  )}
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-[#C8A46B]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#C8A46B]"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-white/30 text-center mt-4">
                Supported: JPG, PNG, GIF • Max 5MB
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
