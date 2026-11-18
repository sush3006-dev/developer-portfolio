import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AcademicBackground } from './education/AcademicBackground';
import { CertificationCoverFlow } from './education/CertificationCoverFlow';
import { CertificateLibraryModal } from './education/CertificateLibraryModal';
import { ContinuousLearning } from './education/ContinuousLearning';
import { useSectionTransition } from '../../hooks/useSectionTransition';

gsap.registerPlugin(ScrollTrigger);

export const Education: React.FC = () => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Premium scroll-driven section transition (incoming entrance & outgoing pinned receding)
  useSectionTransition(sectionRef, contentRef, {
    isOutgoingPinned: true,
    isIncomingAnimated: true,
    pinDistance: '+=80%',
  });

  // Smooth, scroll-driven progressive transitions inspired by reference video
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = sectionRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.set(
        [
          '.edu-header-anim',
          '.edu-academic-block',
          '.edu-academic-card',
          '.edu-coverflow-block',
          '.edu-learning-block',
          '.edu-learning-card',
          '.edu-closing-block',
        ],
        { opacity: 1, y: 0, scale: 1 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Overall Section Header
      gsap.fromTo(
        '.edu-header-anim',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 0.8,
          },
        }
      );

      // 2. Component One: Academic Background
      const academicTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.edu-academic-block',
          start: 'top 85%',
          end: 'top 45%',
          scrub: 0.8,
        },
      });

      academicTl
        .fromTo(
          '.edu-academic-block',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6 }
        )
        .fromTo(
          '.edu-academic-card',
          { opacity: 0, y: 30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.1, ease: 'power2.out', duration: 0.6 },
          0.1
        );

      // 3. Component Two: Certification CoverFlow Carousel
      gsap.fromTo(
        '.edu-coverflow-block',
        { opacity: 0, y: 44, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.edu-coverflow-block',
            start: 'top 85%',
            end: 'top 45%',
            scrub: 0.8,
          },
        }
      );

      // 4. Component Three: Continuous Learning
      const learningTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.edu-learning-block',
          start: 'top 85%',
          end: 'top 45%',
          scrub: 0.8,
        },
      });

      learningTl
        .fromTo(
          '.edu-learning-block',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6 }
        )
        .fromTo(
          '.edu-learning-card',
          { opacity: 0, y: 28, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.08, ease: 'power2.out', duration: 0.6 },
          0.1
        );

      // 5. Closing statement
      gsap.fromTo(
        '.edu-closing-block',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.edu-closing-block',
            start: 'top 95%',
            end: 'bottom 90%',
            scrub: 0.8,
          },
        }
      );

      // 6. Ambient lighting orbs parallax
      gsap.fromTo(
        '.edu-ambient-orb',
        { y: -30 },
        {
          y: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="education"
      style={{ perspective: '1200px' }}
      className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center py-12 lg:py-16 px-6 sm:px-10 lg:px-16 relative z-[50] overflow-hidden scroll-mt-6 border-b border-slate-100/80 bg-[#FFFEFA] select-none"
    >
      <div
        ref={contentRef}
        className="section-transition-inner w-full flex flex-col justify-center will-change-transform"
        style={{ transformOrigin: 'center top', transformStyle: 'preserve-3d' }}
      >
        {/* Golden Ambient Lighting Orbs matching About Section */}
      <div
        className="edu-ambient-orb absolute -top-24 -right-24 w-[480px] h-[480px] bg-[radial-gradient(circle_at_top_right,rgba(212,165,0,0.20)_0%,rgba(212,165,0,0.08)_45%,transparent_70%)] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="edu-ambient-orb absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-amber-100/35 via-orange-50/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="edu-ambient-orb absolute -bottom-28 -left-24 w-96 h-96 bg-gradient-to-tr from-slate-100/60 via-sky-50/20 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center gap-10 sm:gap-14">

      {/* =========================================================================
          SECTION HEADER: OVERALL SECTION IDENTITY
          ========================================================================= */}
      <div className="relative z-10 w-full flex flex-col items-center text-center">
        {/* Eyebrow Label with Golden Dot matching About Section */}
        <div className="edu-header-anim flex items-center justify-center gap-2 mb-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#D4A500] shadow-[0_0_8px_rgba(212,165,0,0.45)] shrink-0"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            EDUCATION &amp; LEARNING
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="edu-header-anim font-heading text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#07163F] tracking-tight leading-[1.2] mb-3">
          The Journey of Continuous Growth<span className="text-[#D4A500]">.</span>
        </h2>

        {/* Subtitle Description */}
        <p className="edu-header-anim text-xs sm:text-[13px] md:text-sm lg:text-[15px] text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          My academic foundation, professional credentials, and the skills I&apos;m continuously developing to build meaningful technology and understand financial markets.
        </p>
      </div>

      {/* =========================================================================
          COMPONENT ONE: ACADEMIC BACKGROUND
          ========================================================================= */}
      <div className="edu-academic-block relative z-10 w-full">
        <AcademicBackground />
      </div>

      {/* =========================================================================
          COMPONENT TWO: CERTIFICATIONS & CREDENTIALS (3D COVER-FLOW CAROUSEL)
          ========================================================================= */}
      <div className="edu-coverflow-block relative z-10 w-full">
        <CertificationCoverFlow onOpenLibrary={() => setIsLibraryOpen(true)} />
      </div>

      {/* =========================================================================
          COMPONENT THREE: CONTINUOUS LEARNING
          ========================================================================= */}
      <div className="edu-learning-block relative z-10 w-full">
        <ContinuousLearning />
      </div>

      {/* =========================================================================
          CLOSING STATEMENT
          ========================================================================= */}
      <div className="edu-closing-block relative z-10 w-full pt-8 border-t border-slate-100/90 text-center">
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
      </div>
    </section>
  );
};
