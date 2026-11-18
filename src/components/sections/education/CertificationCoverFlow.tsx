import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Award } from 'lucide-react';
import { CERTIFICATIONS } from '../../../data/certificationsData';
import { CertificateCardPreview } from './CertificateCardPreview';

interface CertificationCoverFlowProps {
  onOpenLibrary: () => void;
}

export const CertificationCoverFlow: React.FC<CertificationCoverFlowProps> = ({
  onOpenLibrary,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = CERTIFICATIONS.length;

  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Safely clamp activeIndex when CERTIFICATIONS change
  useEffect(() => {
    if (activeIndex >= total) {
      setActiveIndex(Math.max(0, total - 1));
    }
  }, [total, activeIndex]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Autoplay timer (every 4.5s, pauses on hover / interaction)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused || total <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, total, handleNext]);

  // Pointer drag & touch swipe handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const deltaX = e.clientX - dragStartX.current;
    if (deltaX > 45) {
      handlePrev();
    } else if (deltaX < -45) {
      handleNext();
    }
    dragStartX.current = null;
    isDragging.current = false;
  };

  // Compute 3D Cover-Flow styles for each card based on its offset from activeIndex
  const getCardTransformStyle = (index: number) => {
    const diff = index - activeIndex;

    // Mobile check
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;

    const baseOffset = isMobile ? 110 : isTablet ? 150 : 180;
    const secondaryOffset = isMobile ? 180 : isTablet ? 250 : 310;

    if (diff === 0) {
      // CENTER ACTIVE CARD
      return {
        transform: 'translate3d(0, 0, 0) scale(1) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        pointerEvents: 'auto' as const,
      };
    } else if (diff === 1) {
      // IMMEDIATE RIGHT
      return {
        transform: `translate3d(${baseOffset}px, 0, -80px) scale(0.80) rotateY(-26deg)`,
        zIndex: 20,
        opacity: 0.72,
        pointerEvents: 'auto' as const,
      };
    } else if (diff === -1) {
      // IMMEDIATE LEFT
      return {
        transform: `translate3d(-${baseOffset}px, 0, -80px) scale(0.80) rotateY(26deg)`,
        zIndex: 20,
        opacity: 0.72,
        pointerEvents: 'auto' as const,
      };
    } else if (diff === 2) {
      // FURTHER RIGHT
      return {
        transform: `translate3d(${secondaryOffset}px, 0, -160px) scale(0.64) rotateY(-34deg)`,
        zIndex: 10,
        opacity: 0.38,
        pointerEvents: 'auto' as const,
      };
    } else if (diff === -2) {
      // FURTHER LEFT
      return {
        transform: `translate3d(-${secondaryOffset}px, 0, -160px) scale(0.64) rotateY(34deg)`,
        zIndex: 10,
        opacity: 0.38,
        pointerEvents: 'auto' as const,
      };
    } else {
      // FAR OFF-SCREEN
      const dir = diff > 0 ? 1 : -1;
      return {
        transform: `translate3d(${dir * (secondaryOffset + 120)}px, 0, -240px) scale(0.5) rotateY(${
          dir * -40
        }deg)`,
        zIndex: 1,
        opacity: 0,
        pointerEvents: 'none' as const,
      };
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Component Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8 pb-3 border-b border-slate-100/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#D4A500] shadow-[0_0_8px_rgba(212,165,0,0.45)] shrink-0"
              aria-hidden="true"
            />
            <span className="text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              02 — CERTIFICATIONS &amp; CREDENTIALS
            </span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#07163F] tracking-tight">
            Knowledge earned. Skills validated<span className="text-[#D4A500]">.</span>
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{activeIndex + 1}</span>
          <span>/</span>
          <span>{total} CREDENTIALS</span>
        </div>
      </div>

      {/* 3D Cover-Flow Carousel Container */}
      <div
        tabIndex={0}
        role="region"
        aria-label="3D Certifications Cover-Flow Carousel"
        onKeyDown={handleKeyDown}
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative w-full h-[450px] sm:h-[480px] flex items-center justify-center overflow-hidden focus:outline-none select-none touch-pan-y"
        style={{
          perspective: '1200px',
        }}
      >
        {/* Soft Ambient Background Glow Behind Center Card */}
        <div
          className="absolute w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none -translate-y-4"
          aria-hidden="true"
        />

        {/* 3D Carousel Stage */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {CERTIFICATIONS.map((item, idx) => {
            const transformStyle = getCardTransformStyle(idx);
            const isActive = idx === activeIndex;

            return (
              <div
                key={item.id}
                className="absolute transition-all duration-500 ease-out will-change-transform"
                style={transformStyle}
              >
                <CertificateCardPreview
                  item={item}
                  isActive={isActive}
                  onSelect={() => setActiveIndex(idx)}
                />
              </div>
            );
          })}
        </div>

        {/* Previous Navigation Button */}
        {total > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous Certificate"
            className="absolute left-2 sm:left-4 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#07163F] border border-slate-200/90 hover:border-[#D4A500] shadow-md hover:shadow-[0_8px_20px_-4px_rgba(212,165,0,0.15)] flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A500]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Navigation Button */}
        {total > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next Certificate"
            className="absolute right-2 sm:right-4 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#07163F] border border-slate-200/90 hover:border-[#D4A500] shadow-md hover:shadow-[0_8px_20px_-4px_rgba(212,165,0,0.15)] flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A500]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Pagination Dot Indicators */}
      {total > 1 && (
        <div className="flex items-center gap-1.5 mt-4 mb-5">
          {CERTIFICATIONS.map((_, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to certificate ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                  isActive
                    ? 'w-6 h-2 bg-[#D4A500] shadow-sm'
                    : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            );
          })}
        </div>
      )}

      {/* VIEW ALL CERTIFICATES Action Button */}
      <button
        onClick={onOpenLibrary}
        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#07163F] hover:bg-slate-900 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A500] hover:translate-y-[-1px]"
      >
        <Award className="w-4 h-4 text-[#D4A500]" />
        <span>VIEW ALL CERTIFICATES</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#D4A500] transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};

