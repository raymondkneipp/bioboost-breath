import useSound from "use-sound";

// Import your sound files
import boopMp3 from "../../assets/boop.mp3";
import tickMp3 from "../../assets/tick.mp3";

// Define sound types for type safety
export type SoundType = "boop" | "tick";

// Map of sound files
const SOUNDS = {
  boop: boopMp3,
  tick: tickMp3,
} as const;

interface UseSoundOptions {
  volume?: number;
  playbackRate?: number;
  interrupt?: boolean;
  soundEnabled?: boolean;
}

/**
 * Hook that provides access to multiple sound effects with consistent API
 */
export function useSounds(globalOptions: UseSoundOptions = {}) {
  const {
    volume: globalVolume = 0.5,
    playbackRate: globalPlaybackRate = 1,
    interrupt: globalInterrupt = true,
    soundEnabled: globalSoundEnabled = true,
  } = globalOptions;

  // Create a play function for each sound
  const soundPlayers = Object.entries(SOUNDS).reduce(
    (acc, [key, soundPath]) => {
      // TypeScript knows key is a SoundType thanks to the as const above
      const soundKey = key as SoundType;

      const [play, { stop }] = useSound(soundPath, {
        volume: globalVolume,
        playbackRate: globalPlaybackRate,
        interrupt: globalInterrupt,
      });

      acc[soundKey] = {
        play: globalSoundEnabled ? play : () => {},
        stop,
      };

      return acc;
    },
    {} as Record<SoundType, { play: () => void; stop: () => void }>,
  );

  /**
   * Plays the specified sound and executes the provided function
   * @param soundType The type of sound to play
   * @param fn Optional function to execute after the sound plays
   * @returns The result of the executed function (if provided)
   */
  const playSound = <T>(soundType: SoundType, fn?: () => T): T | void => {
    if (globalSoundEnabled) {
      soundPlayers[soundType].play();
    }

    if (fn) {
      return fn();
    }
  };

  /**
   * Creates a wrapped version of a function that plays the specified sound before execution
   * @param soundType The type of sound to play
   * @param fn Function to wrap with the sound effect
   * @returns Wrapped function that plays sound before executing the original
   */
  const withSound = <T extends (...args: any[]) => any>(
    soundType: SoundType,
    fn: T,
  ): ((...args: Parameters<T>) => ReturnType<T>) => {
    return (...args: Parameters<T>): ReturnType<T> => {
      if (globalSoundEnabled) {
        soundPlayers[soundType].play();
      }
      return fn(...args);
    };
  };

  // Convenience methods for common sounds
  const boop = <T>(fn?: () => T): T | void => playSound("boop", fn);
  const tick = <T>(fn?: () => T): T | void => playSound("tick", fn);

  // Convenience wrappers
  const withBoop = <T extends (...args: any[]) => any>(fn: T) =>
    withSound("boop", fn);
  const withTick = <T extends (...args: any[]) => any>(fn: T) =>
    withSound("tick", fn);

  return {
    // Direct sound players
    sounds: soundPlayers,

    // General methods
    playSound,
    withSound,

    // Convenience methods for specific sounds
    boop,
    tick,

    // Convenience wrappers
    withBoop,
    withTick,

    // Global controls
    setEnabled: (enabled: boolean) => {
      globalOptions.soundEnabled = enabled;
    },
  };
}
