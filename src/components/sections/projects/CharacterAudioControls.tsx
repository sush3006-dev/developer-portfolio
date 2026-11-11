import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface CharacterAudioControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const CharacterAudioControls: React.FC<CharacterAudioControlsProps> = ({ videoRef }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8); // Initial enabled volume 80%
  const [isSliderVisible, setIsSliderVisible] = useState(false);

  // Initialize audio settings based on user preference or defaults
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check stored preference
    try {
      const savedMute = sessionStorage.getItem('project_audio_muted');
      const savedVolume = sessionStorage.getItem('project_audio_volume');

      if (savedVolume !== null) {
        const v = parseFloat(savedVolume);
        if (!isNaN(v)) {
          setVolume(v);
          video.volume = v;
        }
      } else {
        video.volume = 0.8;
      }

      if (savedMute === 'false') {
        // User had unmuted previously in this session
        // Note: Browsers may still require interaction on first load, so we safely attempt
        video.muted = false;
        setIsMuted(false);
      } else {
        video.muted = true;
        setIsMuted(true);
      }
    } catch {
      video.muted = true;
      video.volume = 0.8;
      setIsMuted(true);
    }
  }, [videoRef]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      // Unmuting
      video.muted = false;
      const targetVolume = volume > 0 ? volume : 0.8;
      video.volume = targetVolume;
      setVolume(targetVolume);
      setIsMuted(false);

      // Ensure video is playing
      if (video.paused) {
        video.play().catch(() => {});
      }

      try {
        sessionStorage.setItem('project_audio_muted', 'false');
        sessionStorage.setItem('project_audio_volume', targetVolume.toString());
      } catch {}
    } else {
      // Muting
      video.muted = true;
      setIsMuted(true);
      try {
        sessionStorage.setItem('project_audio_muted', 'true');
      } catch {}
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);

    const video = videoRef.current;
    if (!video) return;

    video.volume = newVol;
    if (newVol === 0) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }

    try {
      sessionStorage.setItem('project_audio_volume', newVol.toString());
      sessionStorage.setItem('project_audio_muted', newVol === 0 ? 'true' : 'false');
    } catch {}
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-4 h-4 text-slate-500" />;
    if (volume < 0.5) return <Volume1 className="w-4 h-4 text-[#D4A500]" />;
    return <Volume2 className="w-4 h-4 text-[#D4A500]" />;
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsSliderVisible(true)}
      onMouseLeave={() => setIsSliderVisible(false)}
    >
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm rounded-full py-1.5 px-3 transition-all duration-300 hover:border-[#D4A500]/60 hover:shadow-md">
        {/* Mute/Unmute Toggle Button */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute character original audio' : 'Mute character audio'}
          className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A500] rounded-full p-1 -m-1 cursor-pointer transition-colors"
        >
          {getVolumeIcon()}
          <span className="text-[11px] font-semibold text-slate-700 tracking-tight select-none">
            {isMuted ? 'Sound Off' : `${Math.round(volume * 100)}%`}
          </span>
        </button>

        {/* Volume Slider - smoothly revealed on hover/focus */}
        <div
          className={`flex items-center overflow-hidden transition-all duration-300 ease-out ${
            isSliderVisible || !isMuted ? 'w-20 opacity-100 ml-1' : 'w-0 opacity-0'
          }`}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Character volume slider"
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D4A500]"
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterAudioControls;

