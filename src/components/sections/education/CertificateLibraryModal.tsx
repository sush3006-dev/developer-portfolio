import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Award,
  ShieldCheck,
  Clock,
  ExternalLink,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import {
  CERTIFICATIONS,
  CERTIFICATE_CATEGORIES,
  CertificateCategory,
  filterCertificatesByCategory,
  searchCertificates,
} from '../../../data/certificationsData';

interface CertificateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateLibraryModal: React.FC<CertificateLibraryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CertificateCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter & search
  const categoryFiltered = filterCertificatesByCategory(CERTIFICATIONS, selectedCategory);
  const displayedCertificates = searchCertificates(categoryFiltered, searchQuery);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Certificate Library"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl bg-white card-surface border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-scaleIn">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-amber-50/20">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Return to Carousel"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase block">
                CREDENTIAL EXPLORER
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Certificate Library
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Certificate Library"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by credential title, issuing organization, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {CERTIFICATE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'bg-slate-100/80 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'All' ? 'All Certificates' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {displayedCertificates.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <Award className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">No credentials found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try selecting another category or clearing your search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayedCertificates.map((cert) => {
                const isInProgress = cert.status === 'in-progress';
                return (
                  <div
                    key={cert.id}
                    className="rounded-2xl p-5 border border-slate-200/80 bg-white hover:border-amber-300 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      {/* Status & Category */}
                      <div className="flex items-center justify-between text-[10px] font-mono mb-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold border ${
                            isInProgress
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {isInProgress ? 'IN PREPARATION' : 'VERIFIED'}
                        </span>
                        <span className="text-slate-400 uppercase font-semibold">
                          {cert.category}
                        </span>
                      </div>

                      {/* Title & Issuer */}
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mb-1">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mb-3">
                        {cert.issuer}
                      </p>

                      {/* Description */}
                      {cert.description && (
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                          {cert.description}
                        </p>
                      )}

                      {/* Skills */}
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {cert.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 text-[11px]">
                        {cert.issueDate || 'Target: 2025–26'}
                      </span>

                      {cert.credentialUrl ? (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-bold"
                        >
                          <span>Credential</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          {isInProgress ? 'Exam Prep' : 'Completed'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Showing {displayedCertificates.length} credentials</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-semibold cursor-pointer transition-colors"
          >
            Return to Carousel
          </button>
        </div>
      </div>
    </div>
  );
};

