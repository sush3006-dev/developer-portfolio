import React, { useEffect, useRef, useCallback } from 'react';

export interface HeroFrameAnimationProps {
  /** Total number of sequential frames to render (default: 299) */
  totalFrames?: number;
  /** Playback frame rate in frames per second (default: 30) */
  fps?: number;
  /** Directory path where frames are located (default: '/frames') */
  frameDir?: string;
  /** Number of initial buffer frames required before starting playback (default: 15) */
  initialBuffer?: number;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * HeroFrameAnimation Component
 * 
 * High-performance, zero-blocking character animation rendered via HTML5 Canvas.
 * 
 * Key Performance Features:
 * - Immediate initial paint of Frame 1 with 0ms perceptible delay
 * - Progressive streaming: Starts playback immediately once the initial 15 frames are ready
 * - Asynchronous background preloading for remaining frames (16..299)
 * - Zero loading bars, zero progress percentages, zero blocking screens
 * - Retains previous frame if network lags (no blank canvas or flickering)
 * - Precise 30 FPS timing using requestAnimationFrame and delta accumulation
 * - Offscreen asynchronous image decoding via native img.decode()
 * - Tab visibility and viewport intersection observers to eliminate idle CPU/GPU usage
 * - Responsive object-cover calculation matching original focal positioning
 */
export const HeroFrameAnimation: React.FC<HeroFrameAnimationProps> = ({
  totalFrames = 299,
  fps = 30,
  frameDir = '/frames',
  initialBuffer = 15,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pre-allocated array of Image elements (reused across the session)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  // Tracking set for frames currently being fetched to prevent duplicate network calls
  const inFlightRef = useRef<Set<number>>(new Set());
  const lastRenderedImgRef = useRef<HTMLImageElement | null>(null);
  const currentFrameRef = useRef<number>(0);

  // Animation and stream state refs (avoids React re-render overhead at 30fps)
  const isPlaybackReadyRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);
  const isInViewRef = useRef<boolean>(true);
  const animFrameIdRef = useRef<number | null>(null);

  // Cached container dimensions & device pixel ratio
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1,
  });

  // Helper to format frame path: frame_000001.jpg .. frame_000299.jpg
  const getFramePath = useCallback(
    (frameIndex: number): string => {
      const paddedNumber = String(frameIndex).padStart(6, '0');
      return `${frameDir}/frame_${paddedNumber}.jpg`;
    },
    [frameDir]
  );

  /**
   * Draw the specified frame onto the HTML5 Canvas using responsive object-cover
   * matching original video focal position:
   * - Desktop (>= 1024px): 52% X, 35% Y
   * - Tablet / Mobile: 50% X, 35% Y
   */
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const { width, height } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    let img = imagesRef.current[frameIndex];

    // Fallback to last successfully rendered frame or frame 0 to prevent blank canvas
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = lastRenderedImgRef.current || imagesRef.current[0];
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    lastRenderedImgRef.current = img;

    const containerAspect = width / height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH;

    // Responsive focal position preserving character visibility
    let focalX = 0.50;
    const focalY = 0.35;
    if (width >= 1024) {
      focalX = 0.52;
    }

    let sWidth = imgW;
    let sHeight = imgH;
    let sx = 0;
    let sy = 0;

    if (containerAspect > imgAspect) {
      // Container is wider than the 16:9 image
      sWidth = imgW;
      sHeight = imgW / containerAspect;
      sx = 0;
      sy = Math.max(0, Math.min(imgH - sHeight, (imgH - sHeight) * focalY));
    } else {
      // Container is taller/narrower than the 16:9 image
      sHeight = imgH;
      sWidth = imgH * containerAspect;
      sy = 0;
      sx = Math.max(0, Math.min(imgW - sWidth, (imgW - sWidth) * focalX));
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      img,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }, []);

  /**
   * Resize canvas backing store to match container size and device pixel ratio
   */
  const updateCanvasSize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    dimensionsRef.current = { width, height, dpr };

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Redraw immediately after size update
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  /**
   * Asynchronously load and decode a single frame with off-thread decoding
   */
  const loadSingleFrame = useCallback(
    (frameNum: number): Promise<HTMLImageElement | null> => {
      const frameIdx = frameNum - 1;

      // Return cached image if already available
      if (imagesRef.current[frameIdx] && imagesRef.current[frameIdx]!.complete) {
        return Promise.resolve(imagesRef.current[frameIdx]);
      }

      if (inFlightRef.current.has(frameNum)) {
        return Promise.resolve(null);
      }

      inFlightRef.current.add(frameNum);

      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFramePath(frameNum);

        const onResolved = () => {
          imagesRef.current[frameIdx] = img;
          inFlightRef.current.delete(frameNum);
          resolve(img);
        };

        const onFailed = () => {
          inFlightRef.current.delete(frameNum);
          resolve(null);
        };

        if (typeof img.decode === 'function') {
          img
            .decode()
            .then(onResolved)
            .catch(() => {
              if (img.complete && img.naturalWidth > 0) {
                onResolved();
              } else {
                img.onload = onResolved;
                img.onerror = onFailed;
              }
            });
        } else {
          (img as HTMLImageElement).onload = onResolved;
          (img as HTMLImageElement).onerror = onFailed;
        }
      });
    },
    [getFramePath]
  );

  // Initialize Canvas ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateCanvasSize();

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateCanvasSize]);

  // Page visibility & Scroll Intersection handlers
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const container = containerRef.current;
    let intersectionObserver: IntersectionObserver | null = null;

    if (container && 'IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isInViewRef.current = entry.isIntersecting;
          }
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(container);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
    };
  }, []);

  // Progressive Streaming Preloader: Instant start with 15-frame buffer, then background stream
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(totalFrames).fill(null);
    inFlightRef.current.clear();
    isPlaybackReadyRef.current = false;

    const streamFrames = async () => {
      // Step 1: Immediately fetch and paint Frame 1 with top priority (0ms delay)
      const firstFrame = await loadSingleFrame(1);
      if (isCancelled) return;

      if (firstFrame) {
        imagesRef.current[0] = firstFrame;
        lastRenderedImgRef.current = firstFrame;
        drawFrame(0);
      }

      // Step 2: Concurrently fetch the initial 15-frame playback buffer
      const bufferTarget = Math.min(initialBuffer, totalFrames);
      const bufferQueue: number[] = [];
      for (let i = 2; i <= bufferTarget; i++) {
        bufferQueue.push(i);
      }

      const bufferConcurrency = 8;
      const bufferWorker = async () => {
        while (bufferQueue.length > 0 && !isCancelled) {
          const frameNum = bufferQueue.shift()!;
          await loadSingleFrame(frameNum);
        }
      };

      await Promise.all(
        Array.from({ length: bufferConcurrency }, () => bufferWorker())
      );

      if (isCancelled) return;

      // Step 3: Initial buffer is ready! Release playback immediately!
      isPlaybackReadyRef.current = true;

      // Step 4: Progressively load all remaining frames (16..299) silently in the background
      const remainingQueue: number[] = [];
      for (let i = bufferTarget + 1; i <= totalFrames; i++) {
        remainingQueue.push(i);
      }

      const backgroundConcurrency = 6;
      const backgroundWorker = async () => {
        while (remainingQueue.length > 0 && !isCancelled) {
          const frameNum = remainingQueue.shift()!;
          await loadSingleFrame(frameNum);
        }
      };

      await Promise.all(
        Array.from({ length: backgroundConcurrency }, () => backgroundWorker())
      );
    };

    streamFrames();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, initialBuffer, loadSingleFrame, drawFrame]);

  // Continuous 30 FPS Animation Loop
  useEffect(() => {
    const frameInterval = 1000 / fps; // 33.333ms for 30 FPS
    let lastTimestamp = performance.now();
    let accumulatedTime = 0;

    const tick = (now: number) => {
      animFrameIdRef.current = requestAnimationFrame(tick);

      // Only advance if tab is active, in viewport, and initial playback buffer is released
      if (!isVisibleRef.current || !isInViewRef.current || !isPlaybackReadyRef.current) {
        lastTimestamp = now;
        return;
      }

      const delta = now - lastTimestamp;
      lastTimestamp = now;

      // Discard spike when tab returns from background to prevent lag bursts
      if (delta > 500) {
        accumulatedTime = 0;
        return;
      }

      accumulatedTime += delta;

      while (accumulatedTime >= frameInterval) {
        const nextIndex = (currentFrameRef.current + 1) % totalFrames;
        const nextImg = imagesRef.current[nextIndex];

        // Check if next frame is loaded and valid
        if (nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
          currentFrameRef.current = nextIndex;
          accumulatedTime -= frameInterval;
          drawFrame(currentFrameRef.current);
        } else {
          // If next frame is still decoding/streaming, retain existing frame on canvas.
          // Reset accumulatedTime so we don't skip or rush when it arrives.
          accumulatedTime = 0;
          break;
        }
      }
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [fps, totalFrames, drawFrame]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#8b9e9f] ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
};

export default HeroFrameAnimation;
