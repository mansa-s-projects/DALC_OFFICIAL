import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { useUploadDocument } from '../../hooks/useRelocationDocs';
import type { CreateDocumentInput, DocumentStatus } from '../../types/relocation';

// ─── Props Interface ──────────────────────────────────────────────────────────

interface DocumentUploaderProps {
  userId: string;
  profileId?: string;
  onUploadComplete?: () => void;
}

// ─── File Type Helpers ────────────────────────────────────────────────────────

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return <ImageIcon className="w-5 h-5 text-luxury-gold" />;
  }
  return <FileText className="w-5 h-5 text-luxury-gold" />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DocumentUploader({
  userId,
  profileId,
  onUploadComplete,
}: DocumentUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState('other');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadDocument = useUploadDocument();

  // Document types
  const documentTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'visa_application', label: 'Visa Application' },
    { value: 'birth_certificate', label: 'Birth Certificate' },
    { value: 'marriage_certificate', label: 'Marriage Certificate' },
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'employment_contract', label: 'Employment Contract' },
    { value: 'educational_certificate', label: 'Educational Certificate' },
    { value: 'medical_report', label: 'Medical Report' },
    { value: 'other', label: 'Other Document' },
  ];

  // Drag handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setUploadError(null);

    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const selectedFiles = Array.from(e.target.files || []);
    validateAndAddFiles(selectedFiles);
  }, []);

  // Validate and add files
  const validateAndAddFiles = (newFiles: File[]) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of newFiles) {
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max 10MB)`);
        continue;
      }
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
        continue;
      }
      validFiles.push(file);
    }

    if (errors.length > 0) {
      setUploadError(errors.join(', '));
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    for (const file of files) {
      const input: CreateDocumentInput = {
        user_id: userId,
        relocation_profile_id: profileId || null,
        document_type: documentType,
        document_name: file.name,
        file_url: null, // Would be set after actual upload
        file_size: file.size,
        mime_type: file.type,
        status: 'uploaded' as DocumentStatus,
        expiry_date: null,
        notes: null,
      };

      await uploadDocument.mutateAsync(input);
    }

    setFiles([]);
    onUploadComplete?.();
  };

  return (
    <div className="border border-white/10 bg-white/[0.02] p-6">
      <h3 className="text-white font-display text-lg mb-6">Upload Documents</h3>

      {/* Document Type Selector */}
      <div className="mb-6">
        <label className="block text-gray-500 text-xs uppercase tracking-widest mb-3">
          Document Type
        </label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white text-sm focus:border-luxury-gold focus:outline-none transition-colors"
        >
          {documentTypes.map((type) => (
            <option key={type.value} value={type.value} className="bg-luxury-black">
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        animate={{
          borderColor: isDragOver ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255, 255, 255, 0.1)',
          backgroundColor: isDragOver ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.02)',
        }}
        className="relative border-2 border-dashed p-8 text-center cursor-pointer transition-all hover:border-luxury-gold/40"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />

        <motion.div
          animate={{ scale: isDragOver ? 1.1 : 1 }}
          className="inline-flex items-center justify-center w-16 h-16 border border-luxury-gold/30 bg-luxury-gold/10 mb-4"
        >
          <Upload className="w-8 h-8 text-luxury-gold" />
        </motion.div>

        <p className="text-white font-medium mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-gray-500 text-sm">
          PDF, Word, or images up to 10MB
        </p>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 border border-red-500/30 bg-red-500/10 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{uploadError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
              Selected Files ({files.length})
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10"
                >
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{file.name}</p>
                    <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Upload Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleUpload}
              disabled={uploadDocument.isPending}
              className="w-full mt-4 py-3 bg-luxury-gold text-luxury-black font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploadDocument.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Upload {files.length} File{files.length !== 1 ? 's' : ''}
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Progress Indicator */}
      {uploadDocument.isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <div className="h-1 bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-luxury-gold"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
          </div>
          <p className="text-center text-gray-500 text-xs mt-2">Uploading documents...</p>
        </motion.div>
      )}
    </div>
  );
}
