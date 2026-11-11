/**
 * ProjectProgress.tsx
 *
 * Thin golden progress bar that fills during the 2.5 s auto-shuffle interval.
 * Synced perfectly with useStackTimer's onProgress callback.
 * Resets when the timer ticks (progress snaps back to 0).
 */
import React, { useRef, useEffect } from 'react';

interface ProjectProgressProps {
  progress: number; // 0–1
  paused: boolean;
  accentColor?: string;
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({
  progress,
  paused,
  accentColor = '#D4A500',
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${Math.min(progress * 100, 100)}%`;
    }
  }, [progress]);

  return (
    <div
      className="w-full h-[3px] rounded-full bg-slate-200/60 overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Auto-advance timer"
    >
      <div
        ref={barRef}
        className="h-full rounded-full origin-left"
        style={{
          background: accentColor,
          width: '0%',
          opacity: paused ? 0.4 : 1,
          transition: paused ? 'opacity 0.2s' : 'none',
          boxShadow: `0 0 6px ${accentColor}66`,
        }}
      />
    </div>
  );
};

export default ProjectProgress;

