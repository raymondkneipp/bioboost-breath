import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  completeDelay?: number; // Time in ms to show 100% before reset
  showPulse?: boolean; // Option to add pulse effect when complete
}

export function Progress({
  value,
  className,
  completeDelay = 500,
  showPulse = true,
  ...rest
}: ProgressProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // When reaching 100%, show completion state temporarily before reset
    if (value >= 100) {
      setDisplayValue(100);
      setIsComplete(true);

      const timer = setTimeout(() => {
        // Fade out effect by transitioning to 0
        setDisplayValue(0);

        // Reset complete state after transition duration
        const resetTimer = setTimeout(() => {
          setIsComplete(false);
        }, 300); // Duration of opacity transition

        return () => clearTimeout(resetTimer);
      }, completeDelay);

      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
      setIsComplete(false);
    }
  }, [value, completeDelay]);

  return (
    <div
      className={cn(
        "h-2 w-full mx-auto bg-blue-100 rounded-2xl overflow-hidden shadow shadow-blue-400 relative",
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          "bg-gradient-to-r from-blue-800 to-blue-500 h-full transition-all ease-out duration-300",
          isComplete ? "opacity-0" : "opacity-100",
          showPulse && isComplete ? "animate-pulse" : "",
        )}
        style={{
          width: `${displayValue}%`,
          borderRadius: displayValue < 100 ? "0 9999px 9999px 0" : 0,
        }}
      />

      {/* Completion indicator - briefly appears when complete */}
      {isComplete && (
        <div className="absolute inset-0 bg-green-500 animate-pulse opacity-70 transition-opacity duration-300" />
      )}
    </div>
  );
}
