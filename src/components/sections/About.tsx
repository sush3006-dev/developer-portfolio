import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Brain, TrendingUp, Landmark } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { useSectionTransition } from '../../hooks/useSectionTransition';

gsap.registerPlugin(ScrollTrigger);

interface AreaOfInterest {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconHoverClass: string;
}

const AREAS_OF_INTEREST: AreaOfInterest[] = [
  {
    id: 'software-engineering',
    label: 'Software Engineering',
    icon: Code2,
    iconHoverClass: 'group-hover:scale-110 group-hover:-rotate-3',
  },
  {
    id: 'artificial-intelligence',
    label: 'Artificial Intelligence',
    icon: Brain,
    iconHoverClass: 'group-hover:scale-110 group-hover:rotate-3',
  },
  {
    id: 'financial-markets',
    label: 'Financial Markets',
    icon: TrendingUp,
    iconHoverClass: 'group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
  },
  {
    id: 'fintech',
    label: 'FinTech',
    icon: Landmark,
    iconHoverClass: 'group-hover:scale-110 group-hover:rotate-2',
  },
];

export const About: React.FC = () => {
  const { about } = portfolioData;
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Premium scroll-driven section transition (pinned receding as next section enters)
  useSectionTransition(sectionRef, contentRef, {
    isOutgoingPinned: true,
    isIncomingAnimated: false,
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
          '.about-char-anim',
          '.about-eyebrow-anim',
          '.about-heading-anim',
          '.about-paragraph-anim',
          '.about-closing-anim',
          '.about-interest-label-anim',
          '.about-block-anim',
        ],
        { opacity: 1, y: 0, scale: 1 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Continuous physical float and depth parallax for character and editorial text
      gsap.fromTo(
        '.about-char-parallax',
        { y: 35, scale: 0.98 },
        {
          y: -25,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        '.about-char-shadow',
        { scaleX: 0.9, opacity: 0.15 },
        {
          scaleX: 1.1,
          opacity: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        '.about-text-col',
        { y: 25 },
        {
          y: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      // 2. Reference-inspired card fanning & progressive settling on scroll
      const fanConfigs = [
        { rot: -5, x: -16, y: 32, scale: 0.95 },
        { rot: -1.8, x: -5, y: 18, scale: 0.98 },
        { rot: 1.8, x: 5, y: 18, scale: 0.98 },
        { rot: 5, x: 16, y: 32, scale: 0.95 },
      ];

      const cards = gsap.utils.toArray<HTMLElement>('.about-card-fanned');
      cards.forEach((card, idx) => {
        const cfg = fanConfigs[idx] || { rot: 0, x: 0, y: 20, scale: 0.96 };
        gsap.fromTo(
          card,
          {
            rotation: cfg.rot,
            x: cfg.x,
            y: cfg.y,
            scale: cfg.scale,
            opacity: 0.85,
            transformOrigin: '50% 120%',
          },
          {
            rotation: 0,
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.about-interest-section',
              start: 'top 92%',
              end: 'top 48%',
              scrub: 0.8,
            },
          }
        );
      });

      // 3. Ambient lighting orbs parallax
      gsap.fromTo(
        '.about-ambient-orb',
        { y: -35 },
        {
          y: 35,
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
      id="about"
      style={{ perspective: '1200px' }}
      className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center py-12 lg:py-16 px-6 sm:px-10 lg:px-16 relative z-[20] overflow-hidden scroll-mt-6 border-b border-slate-100/80 bg-[#FFFEFA]"
    >
      <div
        ref={contentRef}
        className="section-transition-inner w-full flex flex-col justify-center will-change-transform"
        style={{ transformOrigin: 'center top', transformStyle: 'preserve-3d' }}
      >
        {/* =========================================================================
            GOLDEN AMBIENT LIGHTING (Matching Education Section)
          Soft diffused radial glow behind right-side text, feathered into warm-white
          ========================================================================= */}
      <div
        className="about-ambient-orb absolute -top-24 -right-24 w-[480px] h-[480px] bg-[radial-gradient(circle_at_top_right,rgba(212,165,0,0.20)_0%,rgba(212,165,0,0.08)_45%,transparent_70%)] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="about-ambient-orb absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-amber-100/35 via-orange-50/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="about-ambient-orb absolute -bottom-28 -left-24 w-96 h-96 bg-gradient-to-tr from-slate-100/60 via-sky-50/20 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto relative z-10">
        {/* =========================================================================
            MAIN ABOUT COMPOSITION (2-Column Desktop: Left Character, Right Content)
            ========================================================================= */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6 md:gap-10 lg:gap-12">
        
        {/* LEFT COLUMN: ORIGINAL 3D CHARACTER */}
        <div className="about-char-anim relative shrink-0 flex flex-col items-center justify-center w-full sm:w-52 md:w-60 lg:w-72 self-center py-2">
          <div className="about-char-parallax relative w-full flex items-center justify-center">
            <img
              src={about.characterImage || '/assets/aistudio/about_character_clean.png'}
              alt="Developer Character"
              className="max-h-[300px] sm:max-h-[350px] md:max-h-[390px] lg:max-h-[430px] w-auto object-contain select-none pointer-events-none drop-shadow-[0_12px_28px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:scale-[1.02]"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/about_character_clean.png';
              }}
            />
          </div>
          {/* Subtle soft grounding shadow under character feet */}
          <div
            className="about-char-shadow w-28 sm:w-36 md:w-44 h-3.5 bg-slate-900/10 rounded-full blur-[4px] -mt-2 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* RIGHT COLUMN: INTRODUCTION CONTENT */}
        <div className="about-text-col flex-1 w-full flex flex-col justify-center text-left md:pl-2">
          
          {/* Eyebrow Label with Golden Bullet matching Education Section */}
          <div className="about-eyebrow-anim flex items-center gap-2 mb-2.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#D4A500] shadow-[0_0_8px_rgba(212,165,0,0.45)] shrink-0"
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
              ABOUT ME
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="about-heading-anim font-heading text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-[#07163F] leading-[1.2] mb-4">
            Beyond Code, <span className="text-slate-700">Into Ideas.</span>
          </h2>

          {/* Introduction Paragraphs (Staggered Entrance Animation) */}
          <div className="space-y-3 text-xs sm:text-[13px] md:text-sm lg:text-[15px] text-slate-600 leading-relaxed font-normal max-w-3xl">
            <p className="about-paragraph-anim">
              I'm a Computer Engineering student driven by curiosity, creativity and the desire to build meaningful technology.
            </p>
            <p className="about-paragraph-anim">
              I enjoy exploring ideas, understanding complex problems and discovering how technology can create real-world impact.
            </p>
            <p className="about-paragraph-anim">
              For me, engineering is not just about writing code. It's about thinking critically, experimenting with ideas and continuously learning.
            </p>
          </div>

          {/* Slightly Emphasized Closing Statement (Appears Last) */}
          <div className="about-closing-anim mt-5 pt-3.5 border-t border-slate-100 max-w-3xl flex items-center">
            <p className="text-xs sm:text-sm font-semibold text-[#07163F] tracking-tight italic">
              “Always curious. Always exploring. Always building.”
            </p>
          </div>

        </div>

      </div>

      {/* =========================================================================
          LOWER CONTENT AREA: "AREAS OF INTEREST"
          1 x 4 Horizontal Grid on Desktop (4 equal cards in one row)
          Independent interactive hover states with golden highlights
          ========================================================================= */}
      <div className="about-interest-section relative z-10 mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-slate-100/90 w-full">
        
        {/* Section Eyebrow */}
        <div className="about-interest-label-anim flex items-center gap-2 mb-3.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
          <h3 className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            AREAS OF INTEREST
          </h3>
        </div>

        {/* 4 Cards Grid: Desktop 1x4 (lg:grid-cols-4), Tablet 2x2 (sm:grid-cols-2), Mobile 1-col (grid-cols-1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-3.5 w-full">
          {AREAS_OF_INTEREST.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                tabIndex={0}
                role="region"
                aria-label={item.label}
                className="about-card-fanned group relative py-3.5 px-4 rounded-2xl bg-slate-50/85 hover:bg-white border border-slate-200/80 hover:border-[#D4A500] flex items-center justify-center gap-3 text-center cursor-default shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(212,165,0,0.12),0_4px_8px_-2px_rgba(15,23,42,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A500]/50"
              >
                {/* Icon Container: Transitions to subtle pale-gold with golden border on hover */}
                <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-amber-50/90 border border-slate-200/70 group-hover:border-[#D4A500]/40 flex items-center justify-center text-slate-700 group-hover:text-[#D4A500] shadow-sm group-hover:shadow-[0_0_12px_rgba(212,165,0,0.22)] shrink-0 transition-all duration-300 ease-out">
                  <Icon className={`w-4 h-4 transition-transform duration-300 ease-out ${item.iconHoverClass}`} />
                </div>

                {/* Card Title: Navy heading with subtle warm gold emphasis on hover */}
                <span className="text-xs sm:text-[13px] font-bold tracking-tight text-slate-800 font-heading group-hover:text-[#07163F] group-hover:drop-shadow-[0_1px_1px_rgba(212,165,0,0.15)] whitespace-nowrap transition-colors duration-300">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      </div>
      </div>
    </section>
  );
};

export default About;
