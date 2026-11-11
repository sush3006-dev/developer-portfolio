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
      {/* Subtle Ambient Lighting Orbs matching Design System */}
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
        {/* Eyebrow Label with Amber Dot */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            EDUCATION &amp; LEARNING
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2.5">
          The Journey of Continuous Growth<span className="text-amber-500">.</span>
        </h2>

        {/* Subtitle Description */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
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
          Learning today<span className="text-amber-500 mx-2">•</span>Building for tomorrow
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

