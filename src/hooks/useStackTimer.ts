import { useEffect, useRef, useCallback } from 'react';

interface UseStackTimerOptions {
  /** Duration of one full cycle in ms */
  interval: number;
  /** Called when the timer fires — advance the deck */
  onTick: () => void;
  /** Whether the timer should be paused */
  paused: boolean;
  /** Callback receiving progress 0–1 on every animation frame */
  onProgress?: (progress: number) => void;
}

/**
 * Drives the automatic card-shuffle timer.
 *
 * Uses requestAnimationFrame for smooth progress reporting.
 * Correctly handles pause/resume by accumulating elapsed time — the
 * timer does NOT reset when paused; it resumes from where it left off.
 */
export function useStackTimer({
  interval,
  onTick,
  paused,
  onProgress,
}: UseStackTimerOptions) {
  // Accumulated elapsed ms before the last pause
  const accumulatedRef = useRef(0);
  // Timestamp when the current run segment started
  const segmentStartRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const pausedRef = useRef(paused);
  const onTickRef = useRef(onTick);
  const onProgressRef = useRef(onProgress);
  const intervalRef = useRef(interval);

  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { onTickRef.current = onTick; }, [onTick]);
  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);
  useEffect(() => { intervalRef.current = interval; }, [interval]);

  const reset = useCallback(() => {
    accumulatedRef.current = 0;
    segmentStartRef.current = null;
  }, []);

  useEffect(() => {
    let running = true;
    // Handle the case where paused state changes
    let wasPaused = pausedRef.current;

    const tick = (now: number) => {
      if (!running) return;

      const isPaused = pausedRef.current;

      if (isPaused) {
        // If we just became paused, record how much we've elapsed in this segment
        if (!wasPaused && segmentStartRef.current !== null) {
          accumulatedRef.current += now - segmentStartRef.current;
          segmentStartRef.current = null;
        }
        wasPaused = true;
        onProgressRef.current?.(accumulatedRef.current / intervalRef.current);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // We are running
      if (wasPaused || segmentStartRef.current === null) {
        // Just unpaused (or first frame): start a new segment
        segmentStartRef.current = now;
        wasPaused = false;
      }

      const elapsed = accumulatedRef.current + (now - segmentStartRef.current);
      const progress = Math.min(elapsed / intervalRef.current, 1);
      onProgressRef.current?.(progress);

      if (progress >= 1) {
        // Timer fired — reset and call tick
        accumulatedRef.current = 0;
        segmentStartRef.current = now; // start next cycle immediately
        onTickRef.current();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []); // stable — only created once

  return { reset };
}
