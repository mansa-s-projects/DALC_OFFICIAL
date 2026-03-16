import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import DocumentUploader from '../../../components/relocation/DocumentUploader';
import { useUserDocuments } from '../hooks/useRelocationDocs';
import { useRelocationProfile } from '../hooks/useRelocation';
import { useUser } from '../../../hooks/useUser';
import { DOCUMENT_STATUS_LABELS } from '../types';
import type { DocumentStatus } from '../types';

// ─── Status Icon Component ────────────────────────────────────────────────────

function StatusIcon({ status }: { status: DocumentStatus }) {
  switch (status) {
    case 'verified':
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case 'uploaded':
      return <Clock className="w-5 h-5 text-amber-500" />;
    case 'rejected':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'expired':
      return <AlertCircle className="w-5 h-5 text-gray-500" />;
    default:
      return <div className="w-5 h-5 rounded-full border-2 border-white/20" />;
  }
}

// ─── Status Color Helper ──────────────────────────────────────────────────────

function getStatusColor(status: DocumentStatus): string {
  switch (status) {
    case 'verified':
      return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400';
    case 'uploaded':
      return 'border-amber-500/30 bg-amber-500/5 text-amber-400';
    case 'rejected':
      return 'border-red-500/30 bg-red-500/5 text-red-400';
    case 'expired':
      return 'border-gray-500/30 bg-gray-500/5 text-gray-400';
    default:
      return 'border-white/10 bg-white/[0.02] text-gray-400';
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Documents() {
  const { data: userData } = useUser();
  const userId = userData?.session?.user?.id ?? '';

  const { data: profile, isLoading: profileLoading } = useRelocationProfile(userId);
  const { data: documents, isLoading: docsLoading } = useUserDocuments(userId);

  const isLoading = profileLoading || docsLoading;

  // Calculate stats
  const totalDocs = documents?.length ?? 0;
  const uploadedDocs = documents?.filter((d) => d.status !== 'pending').length ?? 0;
  const verifiedDocs = documents?.filter((d) => d.status === 'verified').length ?? 0;

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/move-to-dubai/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-luxury-gold transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest">Back to Dashboard</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border border-luxury-gold/30 bg-luxury-gold/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em]">
                  Document Centre
                </p>
                <h1 className="text-3xl md:text-4xl font-display text-white">
                  Your Documents
                </h1>
              </div>
            </div>

            {/* Stats */}
            {!isLoading && (
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-display text-luxury-gold">{uploadedDocs}/{totalDocs}</p>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">Uploaded</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-display text-emerald-500">{verifiedDocs}</p>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">Verified</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ── Left Column: Upload Area ────────────────────────────────── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upload Area */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <DocumentUploader 
                    userId={userId} 
                    profileId={profile?.id} 
                  />
                </motion.div>

                {/* Document List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="border border-white/10 bg-white/[0.02] p-6"
                >
                  <h3 className="text-white font-display text-lg mb-6">Required Documents</h3>
                  
                  {documents && documents.length > 0 ? (
                    <div className="space-y-4">
                      {documents.map((doc, idx) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-center gap-4 p-4 border ${getStatusColor(doc.status)} transition-all`}
                        >
                          <StatusIcon status={doc.status} />
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{doc.document_name}</p>
                            <p className="text-xs opacity-70">
                              {DOCUMENT_STATUS_LABELS[doc.status]}
                            </p>
                          </div>

                          {doc.expiry_date && (
                            <div className="text-right hidden sm:block">
                              <p className="text-xs opacity-50">Expires</p>
                              <p className="text-xs">
                                {new Date(doc.expiry_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}

                          {doc.file_size && (
                            <div className="text-right hidden sm:block">
                              <p className="text-xs opacity-50">Size</p>
                              <p className="text-xs">
                                {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          )}

                          {doc.file_url ? (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 border border-current text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                            >
                              View
                            </a>
                          ) : (
                            <span className="px-3 py-1.5 border border-white/10 text-white/30 text-xs uppercase tracking-widest cursor-not-allowed">
                              Pending
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-white/10">
                      <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">No documents required yet.</p>
                      <p className="text-gray-600 text-sm mt-1">
                        Complete your intake form to generate your document checklist.
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* ── Right Column: Info ──────────────────────────────────────── */}
              <div className="space-y-6">
                {/* Help Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="border border-white/10 bg-white/[0.02] p-6"
                >
                  <h3 className="text-white font-display text-base mb-4">Document Tips</h3>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                      <span>Ensure all documents are clear and legible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                      <span>PDF format preferred for official documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                      <span>File size limit: 10MB per document</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                      <span>Keep expiry dates updated for time-sensitive docs</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Common Documents */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="border border-white/10 bg-white/[0.02] p-6"
                >
                  <h3 className="text-white font-display text-base mb-4">Common Documents</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      'Passport (valid 6+ months)',
                      'Visa Application Form',
                      'Birth Certificate',
                      'Marriage Certificate',
                      'Bank Statements (3 months)',
                      'Employment Contract',
                      'Educational Certificates',
                      'Medical Fitness Report',
                    ].map((doc) => (
                      <div key={doc} className="flex items-center gap-2 text-gray-400">
                        <div className="w-1 h-1 rounded-full bg-luxury-gold/50" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Need Help */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="border border-luxury-gold/20 bg-luxury-gold/5 p-6"
                >
                  <AlertCircle className="w-6 h-6 text-luxury-gold mb-3" />
                  <h3 className="text-white font-display text-base mb-2">Need Help?</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Unsure which documents you need? Our team can guide you through 
                    the requirements.
                  </p>
                  <Link
                    to="/business/consultation/new"
                    className="inline-flex items-center gap-2 text-luxury-gold text-sm hover:underline"
                  >
                    Book a Consultation
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
