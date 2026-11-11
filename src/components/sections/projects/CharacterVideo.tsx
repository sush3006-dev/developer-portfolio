/**
 * CharacterVideo.tsx
 *
 * Renders the 3D character with a genuinely transparent background.
 *
 * Visual source: /project_char.webm  (VP9 alpha — no background)
 * Audio source:  /project_audio.m4a  (original audio, synchronized)
 *
 * Requirements:
 * - IntersectionObserver controls play/pause based on #projects visibility.
 * - Tab visibilitychange pauses/resumes.
 * - Browser autoplay: unmuted audio playback is attempted automatically.
 *   If blocked by browser policy, it silently falls back to muted playback.
 * - STRICTLY NO audio controls, no speaker icon, no slider, no popup, no button.
 * - Single silent window interaction listener to unlock audio naturally on first tap/click.
 * - Falls back gracefully to original project.mp4 if WebM fails to load.
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CharacterVideoProps {
  className?: string;
}

export const CharacterVideo: React.FC<CharacterVideoProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isIntersectingRef = useRef(false);
  const audioUnlockedRef = useRef(false);

  // Whether WebM loaded successfully (falls back to mp4 if not)
  const [webmFailed, setWebmFailed] = useState(false);

  /* ── Synchronized play / pause ── */
  const playMedia = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    video.play().catch(() => {});

    if (audio) {
      audio.volume = 0.8;
      audio.currentTime = video.currentTime;
      audio.play().then(() => {
        audioUnlockedRef.current = true;
      }).catch(() => {
        // Silently fallback if browser restricts unmuted audio autoplay
        audioUnlockedRef.current = false;
      });
    }
  }, []);

  const pauseMedia = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    video?.pause();
    audio?.pause();
  }, []);

  /* ── IntersectionObserver: play when Projects is visible ── */
  useEffect(() => {
    const projectsSection = document.getElementById('projects');
    const targetEl = projectsSection ?? videoRef.current;
    if (!targetEl) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          playMedia();
        } else {
          pauseMedia();
        }
      },
      { threshold: 0.15 }
    );
    observerRef.current.observe(targetEl);

    return () => observerRef.current?.disconnect();
  }, [playMedia, pauseMedia]);

  /* ── Tab visibility ── */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        pauseMedia();
      } else if (isIntersectingRef.current) {
        playMedia();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [playMedia, pauseMedia]);

  /* ── One-time silent unlock on user interaction ── */
  useEffect(() => {
    const unlockAudio = () => {
      if (audioUnlockedRef.current) return;
      const audio = audioRef.current;
      const video = videoRef.current;
      if (audio && isIntersectingRef.current && video) {
        audio.volume = 0.8;
        audio.currentTime = video.currentTime;
        audio.play().then(() => {
          audioUnlockedRef.current = true;
        }).catch(() => {});
      }
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  /* ── Keep video/audio in time sync ── */
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio || !audioUnlockedRef.current) return;
    const drift = Math.abs(video.currentTime - audio.currentTime);
    if (drift > 0.25) {
      audio.currentTime = video.currentTime;
    }
  }, []);

  return (
    <div className={`relative flex items-end justify-center w-full ${className}`}>
      {/* Hidden audio element — synchronized with the transparent WebM */}
      <audio
        ref={audioRef}
        src="/project_audio.m4a"
        loop
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Character presentation layer — clean, no container box, no border, no bg */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ maxWidth: 'clamp(260px, 42vw, 480px)' }}
      >
        {/* Transparent character video */}
        <video
          ref={videoRef}
          src={webmFailed ? '/project.mp4' : '/project_char.webm'}
          loop
          muted
          playsInline
          preload="auto"
          onError={() => setWebmFailed(true)}
          onTimeUpdate={handleTimeUpdate}
          aria-label="3D animated character — sitting at desk working"
          className="w-full h-auto object-contain pointer-events-none select-none"
          style={{
            display: 'block',
            background: 'transparent',
            // Natural soft grounding contact shadow
            filter: webmFailed
              ? 'none'
              : 'drop-shadow(0 20px 28px rgba(15,23,42,0.08)) drop-shadow(0 6px 10px rgba(15,23,42,0.04))',
          }}
        />
      </div>
    </div>
  );
};

export default CharacterVideo;
