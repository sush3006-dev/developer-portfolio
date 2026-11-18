import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Download } from 'lucide-react';
import { Navbar } from '../layout/Navbar';
import { useHeroAudio } from '../../hooks/useHeroAudio';
import { portfolioData } from '../../data/portfolio';

interface HeroProps {
  activeSection?: string;
}

export const Hero: React.FC<HeroProps> = ({ activeSection = 'home' }) => {
  const { developer } = portfolioData;
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Synchronized Hero Video & 3-Layer Cinematic Background Audio
  useHeroAudio({ heroRef, videoRef });

  // GSAP Entrance Animations for Hero Elements
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-nav-layer',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.1 }
      )
      .fromTo(
        '.hero-heading',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      )
      .fromTo(
        '.hero-desc',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      )
      .fromTo(
        '.hero-cta',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        '.hero-right-side',
        { opacity: 0, x: 25, scale: 0.96 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8 },
        '-=0.5'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full min-h-[calc(100vh-40px)] hero-surface overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-10 transition-all duration-300 border-b border-slate-200/50"
    >
      {/* =========================================================================
          LAYER 1: Full-Screen Character Video (Preserves Character Dimensions, Alignment & Ratio)
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#8b9e9f]" aria-hidden="true">
        <video
          ref={videoRef}
          src="/hero.mp4"
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Hero character animation"
          className="w-full h-full object-cover object-[50%_35%] lg:object-[52%_35%] pointer-events-none select-none block"
        />
      </div>

        {/* =========================================================================
            LAYER 2: Cinematic Scrims & Contrast Balancing Overlays
            Ensures text readability without blocking character visibility
            ========================================================================= */}
        {/* Left Side Scrim: Guarantees 100% crystal-clear contrast for typography */}
        <div
          className="absolute inset-y-0 left-0 w-full sm:w-[75%] md:w-[62%] lg:w-[48%] bg-gradient-to-r from-white/95 via-white/70 to-transparent pointer-events-none z-[1]"
          aria-hidden="true"
        />

        {/* Top Header Scrim: Keeps the navigation bar crisp and readable */}
        <div
          className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/75 via-white/35 to-transparent pointer-events-none z-[1]"
          aria-hidden="true"
        />

        {/* Bottom Ambient Scrim: Harmonizes video edge with lower container border */}
        <div
          className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent pointer-events-none z-[1]"
          aria-hidden="true"
        />

        {/* Golden Ambient Glow matching Education Section */}
        <div
          className="absolute -top-20 -right-20 w-[440px] h-[440px] bg-[radial-gradient(circle_at_top_right,rgba(212,165,0,0.35)_0%,rgba(212,165,0,0.16)_40%,transparent_70%)] rounded-full blur-2xl pointer-events-none z-[2]"
          style={{ mixBlendMode: 'screen' }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-[#D4A500]/30 via-amber-200/15 to-transparent rounded-full blur-3xl pointer-events-none z-[2]"
          style={{ mixBlendMode: 'screen' }}
          aria-hidden="true"
        />

        {/* =========================================================================
            LAYER 4: Navigation Bar (Highest Layer, Full Accessibility)
            ========================================================================= */}
        <div className="hero-nav-layer relative z-30 w-full">
          <Navbar activeSection={activeSection} />
        </div>

        {/* =========================================================================
            LAYER 3: Hero Content (3-Part Composition: Left Text, Center Character, Right Resume & Availability)
            ========================================================================= */}
        <div className="relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 pb-8 sm:py-12 px-2 sm:px-6 my-auto">
          
          {/* Left Column (lg:col-span-7): Heading, Title, Bio, and Action Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-20 max-w-xl">
            <h1 className="hero-heading font-heading text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              {developer.greeting}{' '}
              <span className="text-[#1a2332] font-black inline-block">
                {developer.name}
              </span>
            </h1>

            {/* Subheading: Professional Title */}
            <h2 className="hero-subtitle font-heading text-lg sm:text-xl md:text-2xl lg:text-[25px] font-bold tracking-tight text-slate-800 drop-shadow-sm mt-1.5 sm:mt-2 leading-snug">
              {developer.role}
            </h2>

            {/* Description Paragraph */}
            <p className="hero-desc mt-3.5 sm:mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal max-w-lg bg-white/40 sm:bg-transparent backdrop-blur-[2px] sm:backdrop-blur-none p-2 sm:p-0 rounded-lg">
              {developer.shortBio}
            </p>

            {/* Primary Action Buttons & Resume Button */}
            <div className="hero-cta mt-6 sm:mt-7 flex flex-col items-start gap-3 sm:gap-3.5">
              <div className="flex flex-wrap items-center gap-3.5">
                <a
                  href="#projects"
                  className="px-6 py-2.5 sm:py-3 rounded-lg bg-[#1f2838] hover:bg-[#111723] text-white text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="px-6 py-2.5 sm:py-3 rounded-lg border border-slate-300/90 bg-white/70 hover:bg-white text-slate-800 hover:text-slate-950 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Contact Me
                </a>
              </div>

              {/* Compact Resume Button directly below, aligned with the left edge */}
              <a
                href={developer.resumeUrl || '/resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-lg border border-slate-300/90 bg-white/80 hover:bg-white text-slate-800 hover:text-slate-950 text-xs font-semibold backdrop-blur-md shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
                title="Resume"
              >
                <Download className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-950 transition-colors" />
                <span>Resume</span>
              </a>
            </div>
          </div>

          {/* Right Column (lg:col-span-5): Availability Indicator */}
          <div className="hero-right-side lg:col-span-5 flex flex-wrap sm:flex-row lg:flex-col items-start lg:items-end justify-center z-20 gap-2.5 sm:gap-3">
            {/* Availability Indicator */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 whitespace-nowrap">
                Open to Opportunities
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Spacer for balanced vertical symmetry */}
        <div className="h-2 sm:h-4" aria-hidden="true" />
    </section>
  );
};

export default Hero;
