import React, { useState } from 'react';
import { AcademicBackground } from './education/AcademicBackground';
import { CertificationCoverFlow } from './education/CertificationCoverFlow';
import { CertificateLibraryModal } from './education/CertificateLibraryModal';
import { ContinuousLearning } from './education/ContinuousLearning';

export const Education: React.FC = () => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <section
      id="education"
      className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center py-12 lg:py-16 px-6 sm:px-10 lg:px-16 relative overflow-hidden scroll-mt-6 border-b border-slate-100/80 bg-[#FFFEFA] select-none"
    >
      {/* Golden Ambient Lighting Orbs matching Design System */}
      <div
        className="absolute -top-24 -right-24 w-[480px] h-[480px] bg-[radial-gradient(circle_at_top_right,rgba(212,165,0,0.20)_0%,rgba(212,165,0,0.08)_45%,transparent_70%)] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-amber-100/35 via-orange-50/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-28 -left-24 w-96 h-96 bg-gradient-to-tr from-slate-100/60 via-sky-50/20 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center gap-10 sm:gap-14">

      {/* =========================================================================
          SECTION HEADER: OVERALL SECTION IDENTITY
          ========================================================================= */}
      <div className="relative z-10 w-full flex flex-col items-center text-center">
        {/* Eyebrow Label with Golden Dot matching About Section */}
        <div className="flex items-center justify-center gap-2 mb-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#D4A500] shadow-[0_0_8px_rgba(212,165,0,0.45)] shrink-0"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            EDUCATION &amp; LEARNING
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#07163F] tracking-tight leading-[1.2] mb-3">
          The Journey of Continuous Growth<span className="text-[#D4A500]">.</span>
        </h2>

        {/* Subtitle Description */}
        <p className="text-xs sm:text-[13px] md:text-sm lg:text-[15px] text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          My academic foundation, professional credentials, and the skills I&apos;m continuously developing to build meaningful technology and understand financial markets.
        </p>
      </div>

      {/* =========================================================================
          COMPONENT ONE: ACADEMIC BACKGROUND
          ========================================================================= */}
      <div className="relative z-10 w-full">
        <AcademicBackground />
      </div>

      {/* =========================================================================
          COMPONENT TWO: CERTIFICATIONS & CREDENTIALS (3D COVER-FLOW CAROUSEL)
          ========================================================================= */}
      <div className="relative z-10 w-full">
        <CertificationCoverFlow onOpenLibrary={() => setIsLibraryOpen(true)} />
      </div>

      {/* =========================================================================
          COMPONENT THREE: CONTINUOUS LEARNING
          ========================================================================= */}
      <div className="relative z-10 w-full">
        <ContinuousLearning />
      </div>

      {/* =========================================================================
          CLOSING STATEMENT
          ========================================================================= */}
      <div className="relative z-10 w-full pt-8 border-t border-slate-100/90 text-center">
        <p className="text-xs sm:text-sm font-mono tracking-widest text-slate-400 uppercase">
          Learning today<span className="text-[#D4A500] mx-2">•</span>Building for tomorrow
        </p>
      </div>

      {/* Expanded Certificate Library Modal */}
      <CertificateLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />
      </div>
    </section>
  );
};

export default Education;
