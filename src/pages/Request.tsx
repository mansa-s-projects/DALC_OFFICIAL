import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { motion } from 'framer-motion';
import { useRequests } from '../hooks/useRequests';
import { useAppStore } from '../store/useAppStore';
import { Category } from '../types';

export default function Request() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session = useAppStore((s) => s.session);
  const venueId = searchParams.get('venue') || undefined;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    venueName: searchParams.get('venueName') || '',
    date: '',
    guests: '2',
    name: '',
    contact: '',
    notes: ''
  });
  const { createRequest } = useRequests(session?.user?.id);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createRequest.mutateAsync({
        venue_id: venueId,
        venue_name: formData.venueName,
        category: 'dining' as Category,
        request_type: 'booking',
        date_time: `${formData.date}T20:00:00`,
        party_size: Number(formData.guests) || 2,
        contact_name: formData.name,
        contact_info: formData.contact,
        notes: formData.notes || undefined,
      });

      navigate('/request/success');
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Unable to submit request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-display text-white mb-4">Request Reservation</h1>
          <p className="text-gray-400">Our concierge team will confirm availability within 30 minutes.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-luxury-gold' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-xl border border-white/10 relative overflow-hidden">
          {step === 1 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Venue</label>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={e => setFormData({...formData, venueName: e.target.value})}
                  className="w-full bg-luxury-black/50 border border-white/10 rounded p-4 text-white focus:border-luxury-gold outline-none"
                  placeholder="e.g. Zuma, Aura Skypool..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-luxury-black/50 border border-white/10 rounded p-4 text-white focus:border-luxury-gold outline-none"
                    required
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Guests</label>
                   <select
                     value={formData.guests}
                     onChange={e => setFormData({...formData, guests: e.target.value})}
                     className="w-full bg-luxury-black/50 border border-white/10 rounded p-4 text-white focus:border-luxury-gold outline-none"
                   >
                     {[1,2,3,4,5,6,7,8,9,10, '10+'].map(n => (
                       <option key={n} value={n}>{n} Guests</option>
                     ))}
                   </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-luxury-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">
                Next Step
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
               <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-luxury-black/50 border border-white/10 rounded p-4 text-white focus:border-luxury-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Contact (WhatsApp preferred)</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={e => setFormData({...formData, contact: e.target.value})}
                  className="w-full bg-luxury-black/50 border border-white/10 rounded p-4 text-white focus:border-luxury-gold outline-none"
                  required
                />
              </div>
               <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Special Requests</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-luxury-black/50 border border-white/10 rounded p-4 text-white focus:border-luxury-gold outline-none h-32"
                  placeholder="Dietary requirements, occasion, table preference..."
                />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                  Back
                </button>
                <button
                  type="submit"
                  disabled={createRequest.isPending}
                  className="flex-[2] py-4 bg-luxury-gold text-black font-bold uppercase tracking-widest hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createRequest.isPending ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-20 h-20 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-luxury-gold rounded-full animate-pulse" />
              </div>
              <h2 className="text-3xl font-display text-white mb-4">Request Received</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Thank you, {formData.name}. Our team has received your request for {formData.venueName}. We will contact you shortly via WhatsApp to confirm the details.
              </p>
              <button onClick={() => navigate('/explore')} className="px-8 py-3 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                Return to Explore
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed top-6 right-6 z-[120] max-w-sm bg-[#141414] border border-red-400/30 text-white px-5 py-4 rounded shadow-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-red-300 mb-1">Submission failed</p>
          <p className="text-sm text-gray-300">{toastMessage}</p>
        </div>
      )}

      <Footer />
    </div>
  );
}
