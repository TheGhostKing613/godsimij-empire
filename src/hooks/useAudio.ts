import { useEffect, useRef } from 'react';

const AUDIO_ENABLED_KEY = 'empire_audio_enabled';
const AUDIO_VOLUME_KEY = 'empire_audio_volume';

export const useAudio = () => {
  const flameIgnitionRef = useRef<HTMLAudioElement | null>(null);
  const reactionFlickerRef = useRef<HTMLAudioElement | null>(null);
  const navWhooshRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const enabled = localStorage.getItem(AUDIO_ENABLED_KEY) !== 'false';
    const volume = parseFloat(localStorage.getItem(AUDIO_VOLUME_KEY) || '0.5');

    if (enabled && typeof Audio !== 'undefined') {
      flameIgnitionRef.current = new Audio('/sounds/flame-ignition.mp3');
      reactionFlickerRef.current = new Audio('/sounds/reaction-flicker.mp3');
      navWhooshRef.current = new Audio('/sounds/nav-whoosh.mp3');

      [flameIgnitionRef.current, reactionFlickerRef.current, navWhooshRef.current].forEach(
        audio => {
          if (audio) audio.volume = volume;
        }
      );
    }

    return () => {
      [flameIgnitionRef.current, reactionFlickerRef.current, navWhooshRef.current].forEach(
        audio => {
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
          }
        }
      );
    };
  }, []);

  const playFlameIgnition = () => {
    const enabled = localStorage.getItem(AUDIO_ENABLED_KEY) !== 'false';
    if (enabled && flameIgnitionRef.current) {
      flameIgnitionRef.current.currentTime = 0;
      flameIgnitionRef.current.play().catch(() => {});
    }
  };

  const playReaction = () => {
    const enabled = localStorage.getItem(AUDIO_ENABLED_KEY) !== 'false';
    if (enabled && reactionFlickerRef.current) {
      reactionFlickerRef.current.currentTime = 0;
      reactionFlickerRef.current.play().catch(() => {});
    }
  };

  const playWhoosh = () => {
    const enabled = localStorage.getItem(AUDIO_ENABLED_KEY) !== 'false';
    if (enabled && navWhooshRef.current) {
      navWhooshRef.current.currentTime = 0;
      navWhooshRef.current.play().catch(() => {});
    }
  };

  return { playFlameIgnition, playReaction, playWhoosh };
};
