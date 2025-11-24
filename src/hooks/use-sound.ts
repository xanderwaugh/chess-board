"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Sound types for chess events
 */
export type ChessSoundType = "move" | "capture" | "notify" | "gameEnd";

interface UseSoundOptions {
  enabled?: boolean;
  volume?: number;
  /**
   * Custom sound file paths or URLs to override default sounds.
   * You can provide paths for any or all sound types.
   * @example { gameEnd: "/custom/game-end.mp3" }
   * @example { move: "https://example.com/move.mp3", capture: "/custom/capture.mp3" }
   */
  sounds?: Partial<Record<ChessSoundType, string>>;
}

interface UseSoundReturn {
  play: (sound: ChessSoundType) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const SOUND_PATHS: Record<ChessSoundType, string> = {
  move: "/audio/move-self.mp3",
  capture: "/audio/capture.mp3",
  notify: "/audio/notify.mp3",
  gameEnd: "/audio/game-end.webm",
};

/**
 * Hook for playing chess sound effects
 */
export function useSound(options: UseSoundOptions = {}): UseSoundReturn {
  const [enabled, setEnabled] = useState(options.enabled ?? true);
  const [volume, setVolume] = useState(options.volume ?? 0.5);
  const audioRefs = useRef<Map<ChessSoundType, HTMLAudioElement>>(new Map());

  // Merge custom sounds with defaults
  const soundPaths = useMemo(
    () => ({ ...SOUND_PATHS, ...options.sounds }),
    [options.sounds],
  );

  // Initialize audio elements
  useEffect(() => {
    const map = new Map<ChessSoundType, HTMLAudioElement>();

    Object.entries(soundPaths).forEach(([type, path]) => {
      const audio = new Audio(path);
      audio.volume = volume;
      audio.preload = "auto";
      map.set(type as ChessSoundType, audio);
    });

    audioRefs.current = map;

    // Cleanup
    return () => {
      map.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      map.clear();
    };
  }, [volume, soundPaths]);

  // Update volume for all audio elements when volume changes
  useEffect(() => {
    audioRefs.current.forEach((audio) => {
      audio.volume = volume;
    });
  }, [volume]);

  const play = useCallback(
    (sound: ChessSoundType) => {
      if (!enabled) return;

      const audio = audioRefs.current.get(sound);
      if (audio) {
        // Reset audio to start if already playing
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.warn(`Failed to play sound ${sound}:`, error);
        });
      }
    },
    [enabled],
  );

  return {
    play,
    enabled,
    setEnabled,
    volume,
    setVolume,
  };
}
