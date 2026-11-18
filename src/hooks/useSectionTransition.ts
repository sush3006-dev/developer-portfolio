import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface SectionTransitionOptions {
  /**
   * Whether this section temporarily stays pinned and transforms backward (recedes)
   * as the next section enters from below.
   */
  isOutgoingPinned?: boolean;
  /**
   * Whether this section's content has a smooth scale/translate entrance
   * as it enters the viewport from below.
   */
  isIncomingAnimated?: boolean;
  /**
   * The scroll distance for the pinned transition. Default: '+=80%'.
   */
  pinDistance?: string | number;
}

/**
 * useSectionTransition
 *
 * Implements a premium, scroll-driven section transition system:
 * - When in view, the section content recedes (translateY: -60px, scale: 0.94, rotateX: 2.2deg, opacity: 0.65)
 *   while pinned in place as the next section slides smoothly over it.
 * - The incoming section content smoothly expands (scale: 0.96 -> 1.0, y: 35px -> 0px) as it takes over.
 * - Fully bidirectional (reverses smoothly on upward scroll).
 * - Responsive: subtle 2D mode on mobile/tablet to avoid distortion.
 * - Respects prefers-reduced-motion.
 */
export function useSectionTransition(
  sectionRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
  options: SectionTransitionOptions = {}
) {
  const {
    isOutgoingPinned = true,
    isIncomingAnimated = true,
    pinDistance = '+=80%',
  } = options;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sectionEl = sectionRef.current;
    const contentEl = contentRef.current;
    if (prefersReducedMotion || !sectionEl || !contentEl) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 1024;

      // 1. Incoming section entrance animation (scale: 0.96 -> 1.0, y: 35px -> 0px)
      if (isIncomingAnimated) {
        gsap.fromTo(
          contentEl,
          {
            scale: 0.96,
            y: isMobile ? 20 : 35,
          },
          {
            scale: 1,
            y: 0,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.8,
            },
          }
        );
      }

      // 2. Outgoing section receding & pinning as next section enters over it
      if (isOutgoingPinned) {
        const outgoingTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: () =>
              sectionEl.offsetHeight > window.innerHeight
                ? 'bottom bottom'
                : 'top top',
            end: pinDistance,
            pin: true,
            pinSpacing: false,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        outgoingTl.to(contentEl, {
          y: isMobile ? -30 : -60,
          scale: isMobile ? 0.96 : 0.94,
          rotateX: isMobile ? 0 : 2.2,
          opacity: 0.65,
          ease: 'power1.inOut',
        });
      }
    }, sectionEl);

    return () => ctx.revert();
  }, [isOutgoingPinned, isIncomingAnimated, pinDistance]);
}
