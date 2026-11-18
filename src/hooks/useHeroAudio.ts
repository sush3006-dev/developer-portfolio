import { useEffect, useRef, useCallback } from 'react';

/**
 * Coordinated Hero Media Controller
 * Synchronizes HTML5 Character Video with 3-Layer Audio:
 * - Layer 1: Ambient Background Music (/audio/hero-music.mp3 @ 28% volume)
 * - Layer 2: Character Footsteps & Impacts (native video audio track @ 92% volume)
 * - Layer 3: Environmental Ambience (/audio/hero-ambience.mp3 @ 16% volume)
 */
interface UseHeroAudioOptions {
  heroRef: React.RefObject<HTMLElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const TARGET_VOLUMES = {
  video: 0.92,   // Crisp Foley footsteps and kick impacts
  music: 0.28,   // Soft ambient music pad
  ambience: 0.16, // Subtle room resonance
};

export function useHeroAudio({ heroRef, videoRef }: UseHeroAudioOptions): void {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);

  const isHeroInViewRef = useRef<boolean>(true);
  const isPlayingRef = useRef<boolean>(false);
  const hasUnlockedAudioRef = useRef<boolean>(false);
  const fadeAnimRef = useRef<number | null>(null);

  // Smooth volume fading via requestAnimationFrame
  const fadeTo = useCallback((targetRatio: number, durationMs: number, onComplete?: () => void) => {
    const video = videoRef.current;
    const music = musicRef.current;
    const ambience = ambienceRef.current;
    if (!video || !music || !ambience) return;

    if (fadeAnimRef.current !== null) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }

    const startTime = performance.now();
    const startVolumes = {
      video: video.volume,
      music: music.volume,
      ambience: ambience.volume,
    };

    const targetVolumes = {
      video: TARGET_VOLUMES.video * targetRatio,
      music: TARGET_VOLUMES.music * targetRatio,
      ambience: TARGET_VOLUMES.ambience * targetRatio,
    };

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Smooth cosine easing
      const ease = 0.5 * (1 - Math.cos(Math.PI * progress));

      video.volume = Math.max(0, Math.min(1, startVolumes.video + (targetVolumes.video - startVolumes.video) * ease));
      music.volume = Math.max(0, Math.min(1, startVolumes.music + (targetVolumes.music - startVolumes.music) * ease));
      ambience.volume = Math.max(0, Math.min(1, startVolumes.ambience + (targetVolumes.ambience - startVolumes.ambience) * ease));

      if (progress < 1) {
        fadeAnimRef.current = requestAnimationFrame(tick);
      } else {
        fadeAnimRef.current = null;
        if (onComplete) onComplete();
      }
    };

    fadeAnimRef.current = requestAnimationFrame(tick);
  }, [videoRef]);

  // Synchronize audio tracks with the master video timeline
  const syncAudioWithVideo = useCallback(() => {
    const video = videoRef.current;
    const music = musicRef.current;
    const ambience = ambienceRef.current;
    if (!video || !music || !ambience) return;

    const vTime = video.currentTime;
    if (Math.abs(music.currentTime - vTime) > 0.08) {
      music.currentTime = vTime;
    }
    if (Math.abs(ambience.currentTime - vTime) > 0.08) {
      ambience.currentTime = vTime;
    }
  }, [videoRef]);

  // Start/Resume media playback with fade-in
  const playMediaWithFade = useCallback(() => {
    const video = videoRef.current;
    const music = musicRef.current;
    const ambience = ambienceRef.current;
    if (!video || !music || !ambience) return;

    // Start video playback
    video.play().catch(() => {});

    // If audio is unlocked, start audio layers and fade in
    if (hasUnlockedAudioRef.current) {
      video.muted = false;
      syncAudioWithVideo();

      Promise.all([music.play(), ambience.play()])
        .then(() => {
          isPlayingRef.current = true;
          fadeTo(1.0, 750);
        })
        .catch(() => {});
    }
  }, [videoRef, fadeTo, syncAudioWithVideo]);

  // Pause media playback with fade-out
  const pauseMediaWithFade = useCallback(() => {
    const video = videoRef.current;
    const music = musicRef.current;
    const ambience = ambienceRef.current;
    if (!video) return;

    fadeTo(0, 350, () => {
      video.pause();
      music?.pause();
      ambience?.pause();
      isPlayingRef.current = false;
    });
  }, [videoRef, fadeTo]);

  // Initialize and handle autoplay lifecycle
  useEffect(() => {
    const music = new Audio('/audio/hero-music.mp3');
    const ambience = new Audio('/audio/hero-ambience.mp3');

    [music, ambience].forEach((audio) => {
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0;
    });

    musicRef.current = music;
    ambienceRef.current = ambience;

    const video = videoRef.current;
    if (video) {
      video.volume = 0;
      video.muted = true; // Ensure instant, non-blocking visual playback
      video.play().catch(() => {});
    }

    // Silent interaction listener to unlock audio on first gesture
    const unlockAudio = () => {
      ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'].forEach((evt) => {
        window.removeEventListener(evt, unlockAudio);
      });

      hasUnlockedAudioRef.current = true;

      const currentVideo = videoRef.current;
      if (currentVideo && isHeroInViewRef.current && !document.hidden) {
        currentVideo.muted = false;
        syncAudioWithVideo();
        music.play().catch(() => {});
        ambience.play().catch(() => {});
        fadeTo(1.0, 750);
        isPlayingRef.current = true;
      }
    };

    // Attempt unmuted autoplay test
    music
      .play()
      .then(() => {
        // Unmuted autoplay permitted!
        hasUnlockedAudioRef.current = true;
        if (video) video.muted = false;
        ambience.play().catch(() => {});
        if (isHeroInViewRef.current && !document.hidden) {
          fadeTo(1.0, 750);
          isPlayingRef.current = true;
        } else {
          music.pause();
          ambience.pause();
          if (video) video.pause();
        }
      })
      .catch(() => {
        // Unmuted autoplay restricted: video continues playing smoothly (muted)
        // Attach silent one-time unlock listener
        ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'].forEach((evt) => {
          window.addEventListener(evt, unlockAudio, { once: true, passive: true });
        });
      });

    // Timeupdate listener on video for continuous audio sync
    const handleTimeUpdate = () => {
      if (isPlayingRef.current && hasUnlockedAudioRef.current) {
        syncAudioWithVideo();
      }
    };

    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('seeked', syncAudioWithVideo);

    return () => {
      if (fadeAnimRef.current !== null) {
        cancelAnimationFrame(fadeAnimRef.current);
      }
      ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'].forEach((evt) => {
        window.removeEventListener(evt, unlockAudio);
      });

      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('seeked', syncAudioWithVideo);

      music.pause();
      ambience.pause();
      music.src = '';
      ambience.src = '';
      musicRef.current = null;
      ambienceRef.current = null;
    };
  }, [videoRef, fadeTo, syncAudioWithVideo]);

  // Viewport IntersectionObserver: Pause when scrolling away, resume when returning
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.15;
        isHeroInViewRef.current = inView;

        if (inView) {
          if (!document.hidden) {
            playMediaWithFade();
          }
        } else {
          pauseMediaWithFade();
        }
      },
      {
        threshold: [0, 0.15, 0.5],
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [heroRef, playMediaWithFade, pauseMediaWithFade]);

  // Page visibility listener: Pause when tab is hidden, resume when returning
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseMediaWithFade();
      } else if (isHeroInViewRef.current) {
        playMediaWithFade();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [playMediaWithFade, pauseMediaWithFade]);
}
