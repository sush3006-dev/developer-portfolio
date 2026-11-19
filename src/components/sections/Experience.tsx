import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Users,
  Compass,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { EXPERIENCE_ITEMS, ExperienceCardItem } from '../../data/experienceData';

/**
 * Wave path data: An organic, continuous cubic Bézier curve matching the sketch
 * 1. Begins upper-left (40, 160)
 * 2. Descends into a smooth valley (290, 320)
 * 3. Slowly rises into a large, elegant hill (550, 110)
 * 4. Continues across an elevated central region (760, 160)
 * 5. Gradually descends toward the right (940, 300)
 * 6. Ends with a smooth, natural endpoint (1060, 240)
 */
const ROADMAP_PATH =
  'M 40,160 C 130,160 200,320 290,320 C 380,320 460,110 550,110 C 630,110 690,140 760,160 C 820,180 870,300 940,300 C 980,300 1020,250 1060,240';

/**
 * 4 Milestone coordinates along the SVG curve
 * Alternating:
 * - 01 COMMUNITY: ABOVE the timeline
 * - 02 LEADERSHIP: BELOW the timeline
 * - 03 INNOVATION: ABOVE the timeline
 * - 04 PROFESSIONAL GROWTH: BELOW the timeline
 */
const MILESTONE_COORDS = [
  {
    id: 'community',
    // Position directly on path
    pathX: 177,
    pathY: 252,
    // Stem endpoint where heading connects
    stemEndY: 110,
    // Placement relative to timeline: ABOVE
    position: 'above' as const,
  },
  {
    id: 'leadership',
    pathX: 407,
    pathY: 231,
    stemEndY: 365,
    // Placement relative to timeline: BELOW
    position: 'below' as const,
  },
  {
    id: 'innovation',
    pathX: 638,
    pathY: 122,
    stemEndY: 65,
    // Placement relative to timeline: ABOVE
    position: 'above' as const,
  },
  {
    id: 'professional-growth',
    pathX: 864,
    pathY: 256,
    stemEndY: 365,
    // Placement relative to timeline: BELOW
    position: 'below' as const,
  },
];

/**
 * Milestone icon renderer
 */
const MilestoneIcon: React.FC<{ iconName: ExperienceCardItem['iconName']; className?: string }> = ({
  iconName,
  className = 'w-4 h-4',
}) => {
  switch (iconName) {
    case 'Users':
      return <Users className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Lightbulb':
      return <Lightbulb className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    default:
      return <Users className={className} />;
  }
};

/**
 * Badge styling helper matching existing design system
 */
const getBadgeStyles = (variant: ExperienceCardItem['badge']['variant']) => {
  switch (variant) {
    case 'amber':
      return 'bg-amber-100/90 text-amber-900 border-amber-300/80';
    case 'slate':
      return 'bg-slate-200/90 text-slate-800 border-slate-300/80';
    case 'blue':
      return 'bg-blue-100/90 text-blue-900 border-blue-300/80';
    case 'emerald':
      return 'bg-emerald-100/90 text-emerald-900 border-emerald-300/80';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mainWaveRef = useRef<SVGPathElement>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [hoveredMilestoneId, setHoveredMilestoneId] = useState<string | null>(null);

  // Active or hovered milestone ID
  const currentActiveId = hoveredMilestoneId || activeMilestoneId;

  // Entrance and progressive timeline drawing animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = sectionRef.current;
    const waveEl = mainWaveRef.current;

    if (!el) return;

    if (waveEl) {
      const pathLength = waveEl.getTotalLength();
      waveEl.style.strokeDasharray = `${pathLength}`;
      waveEl.style.strokeDashoffset = prefersReducedMotion ? '0' : `${pathLength}`;
    }

    if (prefersReducedMotion) return;

    let ctx: gsap.Context | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !ctx) {
          ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

            // 1. Eyebrow label & Main Heading fade-in
            tl.fromTo(
              '.exp-heading-anim',
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            )
            // 2. Animated Underline smooth draw
            .fromTo(
              '.exp-underline-anim',
              { scaleX: 0, opacity: 0 },
              { scaleX: 1, opacity: 1, duration: 0.7, ease: 'power2.out' },
              '-=0.35'
            )
            // 3. Subtitle
            .fromTo(
              '.exp-subtitle-anim',
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
              '-=0.3'
            );

            // 4. Progressive wave stroke-dashoffset draw from left to right
            if (waveEl) {
              const pathLength = waveEl.getTotalLength();
              tl.to(
                waveEl,
                {
                  strokeDashoffset: 0,
                  duration: 2.2,
                  ease: 'power1.inOut',
                },
                '-=0.2'
              );
            }

            // 5. Staggered node, stem, and heading activation as wave reaches each milestone
            tl.fromTo(
              '.exp-node-anim',
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.45, stagger: 0.38, ease: 'back.out(2)' },
              '-=1.9'
            )
            .fromTo(
              '.exp-stem-anim',
              { strokeDashoffset: 160, opacity: 0 },
              { strokeDashoffset: 0, opacity: 1, duration: 0.4, stagger: 0.38, ease: 'power1.out' },
              '-=1.85'
            )
            .fromTo(
              '.exp-heading-pill-anim',
              {
                opacity: 0,
                y: (index) => (MILESTONE_COORDS[index]?.position === 'above' ? -14 : 14),
                scale: 0.94,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.38,
                ease: 'power2.out',
              },
              '-=1.8'
            );
          }, el);

          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center py-10 sm:py-12 lg:py-14 px-6 sm:px-10 lg:px-16 relative overflow-hidden scroll-mt-6 border-b border-slate-100/80 bg-[#FFFEFA] select-none"
    >
      {/* Subtle ambient lighting orbs matching About & Skills palette */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-amber-100/35 via-orange-50/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-20 w-80 h-80 bg-gradient-to-tr from-slate-100/50 via-sky-50/15 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center">

      {/* =========================================================================
          SECTION INTRODUCTION: CENTERED HIERARCHY WITH ANIMATED UNDERLINE
          ========================================================================= */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mb-6 sm:mb-8">
        {/* Eyebrow Label with Amber Dot */}
        <div className="exp-heading-anim flex items-center justify-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            EXPERIENCE &amp; LEADERSHIP
          </span>
        </div>

        {/* Main Heading with Animated Underline */}
        <div className="relative inline-block mb-3">
          <h2 className="exp-heading-anim font-heading text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-slate-900 leading-[1.2]">
            THE JOURNEY OF GROWTH
          </h2>
          {/* Subtle animated underline */}
          <div
            className="exp-underline-anim h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2.5 rounded-full w-28 sm:w-36 origin-center"
            aria-hidden="true"
          />
        </div>

        {/* Subtitle */}
        <p className="exp-subtitle-anim text-xs sm:text-[13px] md:text-sm text-slate-600 leading-relaxed font-normal max-w-xl mx-auto">
          Every experience shapes the way I think, build and grow.
        </p>
      </div>

      {/* =========================================================================
          MAIN VISUAL: ORGANIC WAVY HORIZONTAL ROADMAP
          One continuous cubic Bézier curve with 4 alternating milestones
          ========================================================================= */}
      <div className="relative z-10 w-full overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth">
        {/* Responsive Roadmap Canvas: viewBox 1100x480 */}
        <div className="min-w-[860px] md:min-w-0 relative w-full aspect-[1100/480] max-h-[520px]">
          
          {/* SVG TIMELINE LAYER */}
          <svg
            viewBox="0 0 1100 480"
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            fill="none"
          >
            <defs>
              {/* Primary active timeline gradient */}
              <linearGradient id="roadmap-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="35%" stopColor="#d97706" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#0f172a" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.75" />
              </linearGradient>

              {/* Golden light orb glow filter */}
              <filter id="gold-soft-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
              </filter>
            </defs>

            {/* 1. Background soft wave glow track */}
            <path
              d={ROADMAP_PATH}
              stroke="#e2e8f0"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-70"
            />

            {/* 2. Main Animated Wavy Timeline (Drawn dynamically on entrance) */}
            <path
              ref={mainWaveRef}
              d={ROADMAP_PATH}
              stroke="url(#roadmap-wave-grad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]"
            />

            {/* 3. Moving Golden Light traveling continuously along the curved timeline */}
            <g className="pointer-events-none">
              {/* Ambient aura */}
              <circle r="12" fill="#f59e0b" opacity="0.22" filter="url(#gold-soft-blur)" />
              {/* Core golden point */}
              <circle r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              {/* Subtle trailing particles */}
              <circle r="2.5" fill="#fbbf24" opacity="0.6" cx="-7" />
              <circle r="1.5" fill="#fcd34d" opacity="0.35" cx="-12" />

              <animateMotion
                dur="9s"
                repeatCount="indefinite"
                rotate="auto"
                path={ROADMAP_PATH}
              />
            </g>

            {/* 4. Connecting Stems between Wave Nodes and Headings */}
            {MILESTONE_COORDS.map((coord) => {
              const isHighlighted = currentActiveId === coord.id;

              return (
                <line
                  key={`stem-${coord.id}`}
                  x1={coord.pathX}
                  y1={coord.pathY}
                  x2={coord.pathX}
                  y2={coord.stemEndY}
                  stroke={isHighlighted ? '#f59e0b' : '#cbd5e1'}
                  strokeWidth={isHighlighted ? '2' : '1.5'}
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  className="exp-stem-anim transition-colors duration-300"
                />
              );
            })}

            {/* 5. Milestone Nodes along the Curve */}
            {MILESTONE_COORDS.map((coord) => {
              const isHighlighted = currentActiveId === coord.id;

              return (
                <g
                  key={`node-${coord.id}`}
                  className="exp-node-anim cursor-pointer transition-transform duration-300"
                  style={{ transformOrigin: `${coord.pathX}px ${coord.pathY}px` }}
                >
                  {/* Subtle pulsing ripple when highlighted */}
                  {isHighlighted && (
                    <circle
                      cx={coord.pathX}
                      cy={coord.pathY}
                      r="16"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      className="animate-ping opacity-40"
                    />
                  )}

                  {/* Outer ring */}
                  <circle
                    cx={coord.pathX}
                    cy={coord.pathY}
                    r={isHighlighted ? 9.5 : 8}
                    fill="#ffffff"
                    stroke={isHighlighted ? '#f59e0b' : '#0f172a'}
                    strokeWidth="2.5"
                    className="transition-all duration-300 shadow-md"
                  />

                  {/* Core amber dot */}
                  <circle
                    cx={coord.pathX}
                    cy={coord.pathY}
                    r={isHighlighted ? 4 : 3.5}
                    fill="#f59e0b"
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>

          {/* =====================================================================
              HTML INTERACTIVE OVERLAY: HEADINGS & FLOATING PANELS
              Positioned precisely in % coordinates relative to the 1100x480 canvas
              ===================================================================== */}
          {MILESTONE_COORDS.map((coord) => {
            const item = EXPERIENCE_ITEMS.find((it) => it.id === coord.id);
            if (!item) return null;

            const isHighlighted = currentActiveId === coord.id;
            const isAbove = coord.position === 'above';

            // Percentage positioning for perfect responsive synchronization
            const leftPercent = (coord.pathX / 1100) * 100;
            const topPercent = (coord.stemEndY / 480) * 100;

            return (
              <div
                key={`overlay-${coord.id}`}
                className="absolute"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  transform: isAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0%)',
                  zIndex: isHighlighted ? 50 : 20,
                }}
                onMouseEnter={() => setHoveredMilestoneId(coord.id)}
                onMouseLeave={() => setHoveredMilestoneId(null)}
              >
                {/* Milestone Heading Pill Container */}
                <div className="relative group/milestone flex flex-col items-center">
                  
                  {/* The Interactive Heading Pill (Default clean state) */}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMilestoneId(activeMilestoneId === coord.id ? null : coord.id)
                    }
                    className={`exp-heading-pill-anim flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all duration-300 cursor-pointer select-none border shadow-2xs ${
                      isHighlighted
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg -translate-y-1 scale-105'
                        : 'bg-white/95 hover:bg-slate-900 hover:text-white text-slate-800 border-slate-200/90 hover:border-slate-900 hover:-translate-y-0.5 hover:shadow-md'
                    }`}
                  >
                    {/* Milestone Icon in elevated square */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isHighlighted
                          ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-2xs scale-105'
                          : 'bg-slate-100 group-hover/milestone:bg-slate-800 text-slate-700 group-hover/milestone:text-amber-400 border border-slate-200/80 group-hover/milestone:border-slate-700'
                      }`}
                    >
                      <MilestoneIcon iconName={item.iconName} className="w-3.5 h-3.5" />
                    </div>

                    {/* Milestone Number & Category Title */}
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        className={`text-xs font-mono font-bold transition-colors ${
                          isHighlighted ? 'text-amber-400' : 'text-slate-400 group-hover/milestone:text-amber-400'
                        }`}
                      >
                        {item.number}.
                      </span>
                      <span className="text-xs sm:text-[13px] font-heading font-extrabold tracking-tight">
                        {item.category}
                      </span>
                    </div>

                    {/* Subtle Explore indicator dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isHighlighted
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-slate-300 group-hover/milestone:bg-amber-400'
                      }`}
                    />
                  </button>

                  {/* =================================================================
                      FLOATING DESCRIPTION PANEL (Zero Layout Shifts)
                      Anchored independently without pushing or altering curve
                      ================================================================= */}
                  {isHighlighted && (
                    <div
                      className={`absolute w-72 sm:w-80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.18)] transition-all duration-300 ease-out z-50 animate-in fade-in zoom-in-95 pointer-events-auto ${
                        isAbove
                          ? 'top-full mt-2.5 left-1/2 -translate-x-1/2'
                          : 'bottom-full mb-2.5 left-1/2 -translate-x-1/2'
                      } ${coord.id === 'professional-growth' ? 'sm:left-auto sm:right-0 sm:translate-x-0' : ''} ${
                        coord.id === 'community' ? 'sm:left-0 sm:translate-x-0' : ''
                      }`}
                      onMouseEnter={() => setHoveredMilestoneId(coord.id)}
                      onMouseLeave={() => setHoveredMilestoneId(null)}
                    >
                      {/* Header: Category, Icon, and Context Badge */}
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                            <MilestoneIcon iconName={item.iconName} className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[11px] font-heading font-bold uppercase tracking-tight text-slate-900">
                            {item.category}
                          </span>
                        </div>

                        {/* Verified Context Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border shadow-2xs ${getBadgeStyles(
                            item.badge.variant
                          )}`}
                        >
                          {item.badge.text}
                        </span>
                      </div>

                      {/* Role or Focus Headline */}
                      <h4 className="font-heading text-sm sm:text-[15px] font-extrabold text-slate-900 leading-snug tracking-tight mb-2">
                        {item.role}
                      </h4>

                      {/* Concise, factual description */}
                      <p className="text-xs text-slate-600 leading-relaxed font-normal mb-3">
                        {item.description}
                      </p>

                      {/* Footer: Verified Experience Indicator */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{item.footerLabel || 'Verified Roadmap Milestone'}</span>
                        </span>
                        <span className="text-amber-500 font-bold shrink-0">#{item.number}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="flex md:hidden items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 mt-2">
        <span>Tap milestones or swipe along the curve</span>
        <ArrowRight className="w-3 h-3 text-slate-400 animate-pulse" />
      </div>
      </div>
    </section>
  );
};

export default Experience;
