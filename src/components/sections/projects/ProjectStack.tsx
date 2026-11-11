/**
 * ProjectStack.tsx
 *
 * GSAP-powered automatic deck-shuffle animation.
 *
 * Card arrangement (reference-accurate):
 *   - Front card: ~-12° rotation, largest scale, lowest visual position
 *   - Cards fan rightward and upward toward the back
 *   - Every 1.8 s the front card flies out bottom-left, moves behind all
 *     other cards, and the deck advances one step
 *
 * Interactions:
 *   - Hover / focus  → pause auto-shuffle
 *   - Click top card → toggle details (auto-shuffle pauses while open)
 *   - Click rear card → bring to front first, then open/switch details
 *   - Prev / Next buttons and keyboard arrows → manual advance
 *   - Swipe left/right on touch devices
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import gsap from 'gsap';
import { Project } from '../../../data/projects';
import { useStackTimer } from '../../../hooks/useStackTimer';

/* ─────────────────────────── types ─────────────────────────── */

export interface ProjectStackHandle {
  pause: () => void;
  resume: () => void;
  advance: (direction?: 'next' | 'prev') => void;
}

interface ProjectStackProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (project: Project) => void;
  onProgressChange: (progress: number) => void;
  isDetailOpen: boolean;
}

/* ─────────────────── geometric constants ─────────────────────
   These values reproduce the reference video's fanned-deck look.
   index 0 = front card in the internal order array.
*/
const CARD_W = 230; // px – rendered width of each card
const CARD_H = 310; // px – rendered height of each card

function getCardTransform(relativeIndex: number, total: number) {
  const i = relativeIndex;

  if (i === 0) {
    // FRONT CARD: tilted ~-12°
    return {
      x: 0,
      y: 0,
      rotation: -12,
      scale: 1,
      zIndex: total + 2,
      opacity: 1,
    };
  }

  // Cards fan to the right and slightly upward, shrinking toward the back.
  return {
    x: 30 * i,             // shift right per card
    y: -16 * i,            // shift up per card (rear cards sit higher)
    rotation: -12 + 6.5 * i, // rotate towards 0° / slight positive
    scale: 1 - 0.055 * i,
    zIndex: total + 2 - i,
    opacity: i >= total - 1 ? 0.6 : 1 - 0.08 * i,
  };
}

/* ──────────────────────── component ──────────────────────── */

const ProjectStack = forwardRef<ProjectStackHandle, ProjectStackProps>(
  function ProjectStack(
    { projects, selectedProjectId, onSelectProject, onProgressChange, isDetailOpen },
    ref
  ) {
    const total = projects.length;

    /**
     * `order` is an array of project indices that describes the current
     * front-to-back arrangement. order[0] is the FRONT card's project index.
     */
    const [order, setOrder] = useState<number[]>(() =>
      Array.from({ length: total }, (_, i) => i)
    );
    const orderRef = useRef(order);

    // DOM refs — one per project slot
    const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(total).fill(null));

    // Interaction state
    const [isHovered, setIsHovered] = useState(false);
    const [animating, setAnimating] = useState(false);
    const animatingRef = useRef(false);

    // Touch swipe
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    // Reduced-motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── keep refs in sync ── */
    useEffect(() => { orderRef.current = order; }, [order]);

    /* ───────────── apply positions ─────────────────── */
    const applyPositions = useCallback(
      (currentOrder: number[], animated = false, duration = 0.55) => {
        currentOrder.forEach((projectIndex, relPos) => {
          const el = cardRefs.current[projectIndex];
          if (!el) return;
          const target = getCardTransform(relPos, total);

          if (animated && !prefersReducedMotion) {
            gsap.to(el, {
              x: target.x,
              y: target.y,
              rotation: target.rotation,
              scale: target.scale,
              opacity: target.opacity,
              zIndex: target.zIndex,
              duration,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          } else {
            gsap.set(el, {
              x: target.x,
              y: target.y,
              rotation: target.rotation,
              scale: target.scale,
              opacity: target.opacity,
              zIndex: target.zIndex,
            });
          }
        });
      },
      [total, prefersReducedMotion]
    );

    useEffect(() => {
      applyPositions(order, false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ───────────── ADVANCE (shuffle front card to back) ──────── */
    const advance = useCallback(
      (direction: 'next' | 'prev' = 'next') => {
        if (animatingRef.current) return;
        animatingRef.current = true;
        setAnimating(true);

        const currentOrder = orderRef.current;
        const frontProjIdx = currentOrder[0];
        const frontEl = cardRefs.current[frontProjIdx];

        if (!frontEl) {
          animatingRef.current = false;
          setAnimating(false);
          return;
        }

        // Build new order
        const newOrder =
          direction === 'next'
            ? [...currentOrder.slice(1), currentOrder[0]]  // move front to back
            : [currentOrder[currentOrder.length - 1], ...currentOrder.slice(0, -1)]; // move back to front

        orderRef.current = newOrder;

        if (prefersReducedMotion) {
          // Simple crossfade without motion
          gsap.to(frontEl, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              setOrder(newOrder);
              applyPositions(newOrder, false);
              gsap.to(frontEl, {
                opacity: getCardTransform(newOrder.indexOf(frontProjIdx), total).opacity,
                duration: 0.2,
              });
              animatingRef.current = false;
              setAnimating(false);
            },
          });
          return;
        }

        if (direction === 'next') {
          // Phase 1: fly front card out to bottom-left with rotation (target: ~0.45s)
          const tl = gsap.timeline({
            onComplete: () => {
              // Phase 2: snap it behind all other cards (off-screen, low zIndex)
              gsap.set(frontEl, {
                zIndex: 1,
                x: -120,
                y: 60,
                rotation: -32,
                scale: 0.78,
                opacity: 0,
                filter: 'blur(0px)',
              });

              // Update state
              setOrder(newOrder);

              // Phase 3: animate remaining cards to new positions (target: ~0.55s)
              applyPositions(newOrder, true, 0.55);

              // The old front card is now last in newOrder; animate into position (settling: ~0.35s)
              const newRelPos = newOrder.indexOf(frontProjIdx);
              const finalTarget = getCardTransform(newRelPos, total);
              gsap.to(frontEl, {
                x: finalTarget.x,
                y: finalTarget.y,
                rotation: finalTarget.rotation,
                scale: finalTarget.scale,
                opacity: finalTarget.opacity,
                zIndex: finalTarget.zIndex,
                duration: 0.35,
                ease: 'power2.out',
                delay: 0.05,
                onComplete: () => {
                  animatingRef.current = false;
                  setAnimating(false);
                },
              });
            },
          });

          // Exit animation: swing out bottom-left with subtle motion blur
          tl.to(frontEl, {
            x: -280,
            y: 180,
            rotation: -48,
            scale: 0.75,
            opacity: 0,
            filter: 'blur(4px)',
            duration: 0.45,
            ease: 'power2.in',
            zIndex: total + 10,
          });
        } else {
          // PREV: bring last card forward
          const backProjIdx = currentOrder[currentOrder.length - 1];
          const backEl = cardRefs.current[backProjIdx];

          if (!backEl) {
            animatingRef.current = false;
            setAnimating(false);
            return;
          }

          gsap.set(backEl, {
            x: -180,
            y: 60,
            rotation: -48,
            scale: 0.72,
            opacity: 0,
            zIndex: total + 10,
          });

          setOrder(newOrder);
          applyPositions(newOrder.slice(1), true, 0.45);

          gsap.to(backEl, {
            x: 0,
            y: 0,
            rotation: -12,
            scale: 1,
            opacity: 1,
            zIndex: total + 2,
            duration: 0.45,
            ease: 'power3.out',
            onComplete: () => {
              animatingRef.current = false;
              setAnimating(false);
            },
          });
        }
      },
      [applyPositions, prefersReducedMotion, total]
    );

    /* ───────────── auto-shuffle timer (1.8 seconds) ────────────── */
    const timerPaused = isHovered || isDetailOpen || animating;

    const { reset: resetTimer } = useStackTimer({
      interval: 1800, // 1.8 seconds exact per requirement
      paused: timerPaused || prefersReducedMotion,
      onTick: () => advance('next'),
      onProgress: onProgressChange,
    });

    // Expose imperative handle to parent
    useImperativeHandle(
      ref,
      () => ({
        pause() {},
        resume() {},
        advance(direction: 'next' | 'prev' = 'next') {
          advance(direction);
        },
      }),
      [advance]
    );

    /* ───────────── card click handler ───────────── */
    const handleCardClick = useCallback(
      (projectIndex: number) => {
        const clickedProject = projects[projectIndex];
        if (!clickedProject) return;

        // CASE 2: Click the SAME project card again -> toggle/close!
        if (selectedProjectId === clickedProject.id) {
          onSelectProject(clickedProject);
          return;
        }

        const currentOrder = orderRef.current;
        const relPos = currentOrder.indexOf(projectIndex);

        // CASE 1: Click the front card when not selected -> select & open
        if (relPos === 0) {
          onSelectProject(clickedProject);
          return;
        }

        // CASE 3: Click a rear card -> animate to front, then select
        if (animatingRef.current) return;

        const newOrder = [
          projectIndex,
          ...currentOrder.filter((i) => i !== projectIndex),
        ];

        // Keep orderRef immediately in sync
        orderRef.current = newOrder;
        animatingRef.current = true;
        setAnimating(true);

        const el = cardRefs.current[projectIndex];
        if (el) {
          gsap.set(el, { zIndex: total + 10 });
          gsap.to(el, {
            x: 0,
            y: 0,
            rotation: -12,
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out',
          });
        }

        // Push remaining cards back
        newOrder.slice(1).forEach((pi, newRelIdx) => {
          const relEl = cardRefs.current[pi];
          if (!relEl) return;
          const tgt = getCardTransform(newRelIdx + 1, total);
          gsap.to(relEl, { ...tgt, duration: 0.45, ease: 'power2.out' });
        });

        setOrder(newOrder);
        setTimeout(() => {
          animatingRef.current = false;
          setAnimating(false);
          onSelectProject(clickedProject);
          resetTimer();
        }, 470);
      },
      [onSelectProject, projects, resetTimer, selectedProjectId, total]
    );

    /* ───────────── keyboard nav ──────────────────── */
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          advance('next');
          resetTimer();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          advance('prev');
          resetTimer();
        }
      },
      [advance, resetTimer]
    );

    /* ───────────── touch swipe ───────────────────── */
    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 35) {
        if (dx < 0) {
          advance('next');
          resetTimer();
        } else {
          advance('prev');
          resetTimer();
        }
      }
    };

    /* ───────────── render ────────────────────────── */
    const stageW = CARD_W + (total - 1) * 30 + 50;
    const stageH = CARD_H + (total - 1) * 16 + 30;

    return (
      <div
        className="relative select-none focus:outline-none"
        style={{ width: stageW, height: stageH, maxWidth: '100%' }}
        tabIndex={0}
        aria-label="Interactive project card stack. Use arrow keys to navigate."
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {projects.map((project, projectIndex) => {
          const relPos = order.indexOf(projectIndex);
          const isFront = relPos === 0;
          const isSelected = selectedProjectId === project.id;

          return (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[projectIndex] = el;
              }}
              onClick={() => handleCardClick(projectIndex)}
              role="button"
              tabIndex={isFront ? 0 : -1}
              aria-label={`Project ${project.number}: ${project.title}${
                isFront ? ' (front, click to toggle details)' : ''
              }`}
              className="absolute cursor-pointer rounded-[22px] overflow-hidden transition-shadow group"
              style={{
                width: CARD_W,
                height: CARD_H,
                top: 0,
                left: 0,
                willChange: 'transform, opacity',
              }}
            >
              {/* Coordinated flat card background */}
              <div
                className="absolute inset-0 rounded-[22px]"
                style={{ background: project.color }}
              />

              {/* Subtle top-light gradient reflection */}
              <div
                className="absolute inset-0 rounded-[22px] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.14) 0%, transparent 65%)',
                }}
              />

              {/* 16:9 Project Thumbnail Mockup Preview */}
              {project.thumbnail && (
                <div className="absolute top-[42px] inset-x-3 h-[116px] rounded-xl overflow-hidden border border-white/15 bg-black/25 shadow-md pointer-events-none group-hover:border-white/30 transition-all duration-300">
                  <img
                    src={project.thumbnail}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />
                </div>
              )}

              {/* Number badge — top left */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span
                  className="text-[11px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded shadow-xs"
                  style={{
                    background:
                      project.textColor === '#07163F'
                        ? 'rgba(7,22,63,0.12)'
                        : 'rgba(255,255,255,0.15)',
                    color: project.accentColor,
                  }}
                >
                  #{project.number}
                </span>
              </div>

              {/* Click-to-view hint on front card */}
              {isFront && (
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span
                    className="text-[9px] font-mono tracking-widest uppercase font-semibold opacity-85"
                    style={{ color: project.accentColor }}
                  >
                    {isSelected ? 'Selected' : 'Click to view'}
                  </span>
                </div>
              )}

              {/* Title & Info — bottom of card */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 z-10">
                <div
                  className="h-[1.5px] w-7 mb-2 opacity-50 rounded-full"
                  style={{ background: project.accentColor }}
                />
                <p
                  className="text-[10px] font-mono tracking-wider uppercase mb-0.5 font-semibold opacity-85 truncate"
                  style={{ color: project.accentColor }}
                >
                  {project.category}
                </p>
                <h3
                  className="font-heading text-base font-bold leading-snug line-clamp-2"
                  style={{ color: project.textColor }}
                >
                  {project.title}
                </h3>
              </div>

              {/* Selected highlight ring */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-[22px] pointer-events-none ring-2 ring-[#D4A500]"
                  style={{
                    boxShadow: '0 0 24px rgba(212,165,0,0.4)',
                  }}
                />
              )}

              {/* Front card subtle edge highlight */}
              {isFront && !isSelected && (
                <div
                  className="absolute inset-0 rounded-[22px] pointer-events-none"
                  style={{
                    boxShadow:
                      'inset 0 0 0 1px rgba(255,255,255,0.2), 0 28px 56px -16px rgba(0,0,0,0.45)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

ProjectStack.displayName = 'ProjectStack';
export { ProjectStack };
export default ProjectStack;
