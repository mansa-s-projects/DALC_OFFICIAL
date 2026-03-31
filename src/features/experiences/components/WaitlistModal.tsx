'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useJoinWaitlist, useWaitlistStatus } from '../hooks/useWaitlist';
import { useAppStore } from '../../../store/useAppStore';
import type { ExperienceService } from '../types';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: ExperienceService;
  selectedDate?: string;
  selectedTimeSlot?: string;
}

export default function WaitlistModal({ 
  isOpen, 
  onClose, 
  experience, 
  selectedDate,
  selectedTimeSlot 
}: WaitlistModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const profile = useAppStore((s) => s.profile);
  const session = useAppStore((s) => s.session);
  
  const { data: existingEntry } = useWaitlistStatus(experience.id, session?.user?.id);
  const joinWaitlist = useJoinWaitlist();

  const handleJoin = async () => {
    if (!session?.user?.id) return;
    
    try {
      await joinWaitlist.mutateAsync({
        experience_id: experience.id,
        user_id: session.user.id,
        time_slot: selectedTimeSlot,
        booking_date: selectedDate,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to join waitlist:', error);
    }
  };

  const isAlreadyOnWaitlist = !!existingEntry;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md rounded-2xl border border-luxury-gold/30 bg-[#0E1012] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-b from-luxury-gold/10 to-transparent border-b border-white/10">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-luxury-gold/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-luxury-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-display text-white">
                    {isAlreadyOnWaitlist ? 'You\'re on the List!' : 'Join Waitlist'}
                  </h2>
                  <p className="text-white/50 text-sm">
                    {experience.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted || isAlreadyOnWaitlist ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg text-white mb-2">
                    {isAlreadyOnWaitlist ? 'Already Registered' : 'You\'re on the Waitlist!'}
                  </h3>
                  <p className="text-white/50 text-sm mb-6">
                    {isAlreadyOnWaitlist 
                      ? 'We\'ll notify you when a spot opens up.'
                      : 'We\'ll notify you via email and in-app notification when a spot becomes available.'
                    }
                  </p>
                  
                  {selectedDate && (
                    <div className="bg-white/5 rounded-lg p-4 text-left mb-4">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Preferred Date</p>
                      <p className="text-white text-sm">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                      {selectedTimeSlot && (
                        <>
                          <p className="text-xs text-white/40 uppercase tracking-wider mb-1 mt-2">Preferred Time</p>
                          <p className="text-white text-sm">{selectedTimeSlot}</p>
                        </>
                      )}
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    className="w-full py-3 px-6 rounded-xl bg-luxury-gold text-luxury-black font-semibold hover:bg-luxury-gold/90 transition-colors"
                  >
                    Got it
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <p className="text-white/70 text-sm mb-4">
                      This experience is currently sold out. Join the waitlist and we\'ll notify you immediately when a spot opens up.
                    </p>
                    
                    {selectedDate && (
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Requested Date</p>
                        <p className="text-white">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        {selectedTimeSlot && (
                          <>
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-1 mt-2">Requested Time</p>
                            <p className="text-white">{selectedTimeSlot}</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {!session?.user ? (
                    <div className="text-center py-4">
                      <p className="text-white/50 text-sm mb-4">Sign in to join the waitlist</p>
                      <a
                        href="/auth/login"
                        className="inline-block w-full py-3 px-6 rounded-xl bg-luxury-gold text-luxury-black font-semibold hover:bg-luxury-gold/90 transition-colors text-center"
                      >
                        Sign In
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleJoin}
                        disabled={joinWaitlist.isPending}
                        className="w-full py-3 px-6 rounded-xl bg-luxury-gold text-luxury-black font-semibold hover:bg-luxury-gold/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {joinWaitlist.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          'Join Waitlist'
                        )}
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full py-3 px-6 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
                      >
                        Maybe Later
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
