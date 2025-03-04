import { useState, useEffect } from "react";
import { useSounds } from "./use-sounds";

export enum BreathState {
  INHALE = "INHALE",
  INHALE_HOLD = "INHALE_HOLD",
  EXHALE = "EXHALE",
  EXHALE_HOLD = "EXHALE_HOLD",
}

type CountdownState = {
  isCountingDown: boolean;
  count: number;
};

// Custom hook for breathing cycle management with countdown
export const useBreathingCycle = (
  totalCycles: number,
  durations: Record<BreathState, number> = {
    [BreathState.INHALE]: 5000,
    [BreathState.INHALE_HOLD]: 5000,
    [BreathState.EXHALE]: 5000,
    [BreathState.EXHALE_HOLD]: 5000,
  },
  countdownSeconds: number = 3,
) => {
  const [currentState, setCurrentState] = useState<BreathState>(
    BreathState.INHALE,
  );
  const [cycleCount, setCycleCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(
    durations[BreathState.INHALE],
  );
  const [countdown, setCountdown] = useState<CountdownState>({
    isCountingDown: false,
    count: countdownSeconds,
  });

  // Track whether the session has started (for proper resume behavior)
  const [hasStarted, setHasStarted] = useState(false);

  // Total time in the current session (in seconds)
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const { withTick, boop } = useSounds();

  const states = [
    BreathState.INHALE,
    BreathState.INHALE_HOLD,
    BreathState.EXHALE,
    BreathState.EXHALE_HOLD,
  ];

  // Calculate total session time when parameters change
  useEffect(() => {
    const cycleTime = Object.values(durations).reduce(
      (sum, duration) => sum + duration,
      0,
    );
    setTotalSessionTime((cycleTime * totalCycles) / 1000);
  }, [durations, totalCycles]);

  const nextState = () => {
    boop();
    const currentIndex = states.indexOf(currentState);
    const nextIndex = (currentIndex + 1) % states.length;
    const nextBreathState = states[nextIndex];

    // If we've completed a full cycle
    if (nextIndex === 0) {
      const newCycleCount = cycleCount + 1;
      setCycleCount(newCycleCount);

      // Check if we've reached the total number of cycles
      if (newCycleCount >= totalCycles) {
        setIsActive(false);
        setHasStarted(false);
        return;
      }
    }

    setCurrentState(nextBreathState);
    setRemainingTime(durations[nextBreathState]);
  };

  // Handle the countdown
  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;

    if (countdown.isCountingDown && countdown.count > 0 && isActive) {
      countdownTimer = setTimeout(
        withTick(() => {
          setCountdown((prev) => ({
            ...prev,
            count: prev.count - 1,
          }));
        }),
        1000,
      );
    } else if (countdown.isCountingDown && countdown.count === 0 && isActive) {
      // Countdown finished, start the actual cycle
      setCountdown({
        isCountingDown: false,
        count: countdownSeconds,
      });
      // Only reset these if we're starting fresh
      if (!hasStarted) {
        setCurrentState(BreathState.INHALE);
        setCycleCount(0);
        setRemainingTime(durations[BreathState.INHALE]);
        setElapsedTime(0);
      }
      setHasStarted(true);
    }

    return () => {
      clearTimeout(countdownTimer);
    };
  }, [countdown, countdownSeconds, durations, isActive, hasStarted]);

  // Handle the active breathing cycle
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timerId: NodeJS.Timeout;
    let elapsedTimeTracker: NodeJS.Timeout;

    if (isActive && !countdown.isCountingDown && hasStarted) {
      // Update remaining time every 100ms
      intervalId = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 100) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 100;
        });
      }, 100);

      // Move to next state when timer completes
      timerId = setTimeout(() => {
        nextState();
      }, remainingTime);

      // Track elapsed time of the session
      elapsedTimeTracker = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
    }

    return () => {
      clearInterval(intervalId);
      clearTimeout(timerId);
      clearInterval(elapsedTimeTracker);
    };
  }, [
    isActive,
    currentState,
    remainingTime,
    countdown.isCountingDown,
    hasStarted,
  ]);

  const startCycle = () => {
    // If already started once, just resume
    if (hasStarted) {
      setIsActive(true);
      return;
    }

    // Start with countdown
    setIsActive(true);
    setCountdown({
      isCountingDown: true,
      count: countdownSeconds,
    });
  };

  const pauseCycle = () => {
    setIsActive(false);
  };

  const resumeCycle = () => {
    setIsActive(true);
  };

  const resetCycle = () => {
    setIsActive(false);
    setHasStarted(false);
    setCurrentState(BreathState.INHALE);
    setCycleCount(0);
    setRemainingTime(durations[BreathState.INHALE]);
    setElapsedTime(0);
    setCountdown({
      isCountingDown: false,
      count: countdownSeconds,
    });
  };

  const timeLeft = totalSessionTime - elapsedTime;

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    currentState,
    cycleCount,
    isActive,
    hasStarted,
    progress: 1 - remainingTime / durations[currentState],
    remainingTime,
    totalCycles,
    startCycle,
    pauseCycle,
    resumeCycle,
    resetCycle,
    countdown,
    isCountingDown: countdown.isCountingDown,
    countdownValue: countdown.count,
    timeLeft,
    formattedTimeLeft: formatTime(timeLeft),
    totalSessionTime,
    elapsedTime,
  };
};
