import React from 'react';
import { motion } from 'motion/react';
import { FileCheck, FileQuestion, UploadCloud, CheckCircle2 } from 'lucide-react';

interface DocumentStatus {
  name: string;
  submitted: boolean;
}

interface DocumentRequirementsProps {
  required: string[];
  submitted?: string[];
  showUpload?: boolean;
  onUpload?: (docName: string) => void;
  title?: string;
}

export default function DocumentRequirements({
  required,
  submitted = [],
  showUpload = false,
  onUpload,
  title = 'Required Documents',
}: DocumentRequirementsProps) {
  const docs: DocumentStatus[] = required.map(name => ({
    name,
    submitted: submitted.includes(name),
  }));

  const submittedCount = docs.filter(d => d.submitted).length;
  const allDone = submittedCount === docs.length && docs.length > 0;

  return (
    <div className="bg-white/[0.03] border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-white font-display text-base mb-1">{title}</h3>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            {submittedCount} of {docs.length} provided
          </p>
        </div>
        {allDone && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-400/30 px-2 py-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Complete
          </span>
        )}
      </div>

      {/* List */}
      <ul className="space-y-2">
        {docs.map((doc, idx) => (
          <motion.li
            key={doc.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`flex items-center justify-between gap-3 p-3 border transition-all duration-300 ${
              doc.submitted
                ? 'border-emerald-500/20 bg-emerald-500/5'
                : 'border-white/5 bg-white/[0.015]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {doc.submitted ? (
                <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <FileQuestion className="w-4 h-4 text-gray-500 flex-shrink-0" />
              )}
              <span
                className={`text-sm leading-snug truncate ${
                  doc.submitted ? 'text-emerald-300' : 'text-gray-300'
                }`}
              >
                {doc.name}
              </span>
            </div>

            {doc.submitted ? (
              <span className="text-[10px] text-emerald-500 uppercase tracking-widest flex-shrink-0">
                Received
              </span>
            ) : showUpload && onUpload ? (
              <button
                onClick={() => onUpload(doc.name)}
                className="flex items-center gap-1.5 text-[10px] text-luxury-gold border border-luxury-gold/30 px-2 py-1 hover:bg-luxury-gold/10 transition-colors duration-200 flex-shrink-0 uppercase tracking-widest"
              >
                <UploadCloud className="w-3 h-3" />
                Upload
              </button>
            ) : (
              <span className="text-[10px] text-gray-600 uppercase tracking-widest flex-shrink-0">
                Pending
              </span>
            )}
          </motion.li>
        ))}
      </ul>

      {docs.length === 0 && (
        <p className="text-gray-600 text-sm text-center py-4 italic">No documents required.</p>
      )}

      {showUpload && !allDone && (
        <p className="mt-4 text-gray-600 text-xs leading-relaxed">
          Upload clear, colour scans or photos. Accepted formats: PDF, JPG, PNG (max 10 MB each).
        </p>
      )}
    </div>
  );
}
