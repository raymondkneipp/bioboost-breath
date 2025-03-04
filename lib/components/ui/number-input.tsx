import * as React from "react";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import { cn } from "~/lib/utils";
import { Button } from "~/lib/components/ui/button";
import { useSounds } from "~/lib/hooks/use-sounds";

function useNumberInput() {
  const context = React.useContext(NumberInputContext);
  if (!context) {
    throw new Error("This component must be used within a <NumberInput>.");
  }
  return context;
}

function useHoldAction(actionFn: () => void, delay = 500, interval = 100) {
  // Store state to track if the button is being held
  const [isHolding, setIsHolding] = React.useState(false);
  const actionRef = React.useRef(actionFn);

  // Keep the action reference updated
  React.useEffect(() => {
    actionRef.current = actionFn;
  }, [actionFn]);

  // Setup interval when holding state changes
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    if (isHolding) {
      // Execute immediately
      actionRef.current();

      // Setup initial delay before rapid execution
      timeoutId = setTimeout(() => {
        // Start rapid execution
        intervalId = setInterval(() => {
          actionRef.current();
        }, interval);
      }, delay);
    }

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHolding, delay, interval]);

  // Handlers for mouse/touch events
  const start = React.useCallback(() => {
    setIsHolding(true);
  }, []);

  const stop = React.useCallback(() => {
    setIsHolding(false);
  }, []);

  return { start, stop, isHolding };
}

type NumberInputContext = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

const NumberInputContext = React.createContext<NumberInputContext>(
  {} as NumberInputContext,
);

export function NumberInput({
  value,
  onChange,
  min = 1,
  max = 60,
  step = 1,
  children,
  className,
  ...rest
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  // Ensure the value is within bounds
  const validatedValue = Math.min(Math.max(value, min), max);

  // If the value was out of bounds, update it
  React.useEffect(() => {
    if (validatedValue !== value) {
      onChange(validatedValue);
    }
  }, [validatedValue, value, onChange]);

  const contextValue = React.useMemo(
    () => ({
      value: validatedValue,
      min,
      max,
      step,
      onChange,
    }),
    [validatedValue, min, max, step, onChange],
  );

  return (
    <NumberInputContext.Provider value={contextValue}>
      <div
        className={cn("flex flex-col gap-2 items-center", className)}
        {...rest}
      >
        {children}
      </div>
    </NumberInputContext.Provider>
  );
}

function NumberInputIncrementOld({
  children = <IconChevronUp />,
  holdDelay = 500,
  holdInterval = 100,
  ...rest
}: React.HTMLAttributes<HTMLButtonElement> & {
  holdDelay?: number;
  holdInterval?: number;
}) {
  const { value, max, step, onChange } = useNumberInput();
  const { withBoop } = useSounds();

  // Create a stable increment function
  const increment = React.useCallback(() => {
    onChange((prevValue) => Math.min(prevValue + step, max));
  }, [max, step, onChange]);

  // Use our fixed hold action hook
  const { start, stop, isHolding } = useHoldAction(
    withBoop(increment),
    holdDelay,
    holdInterval,
  );

  return (
    <Button
      size="icon"
      variant="secondary"
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={stop}
      onTouchStart={start}
      onTouchEnd={stop}
      onContextMenu={(e) => {
        // Prevent context menu from appearing on long press (mobile)
        if (isHolding) e.preventDefault();
      }}
      aria-label="Increase value"
      disabled={value >= max}
      className={isHolding ? "bg-blue-300" : undefined}
      {...rest}
    >
      {children}
    </Button>
  );
}

function NumberInputDecrementOld({
  children = <IconChevronDown />,
  holdDelay = 500,
  holdInterval = 100,
  ...rest
}: React.HTMLAttributes<HTMLButtonElement> & {
  holdDelay?: number;
  holdInterval?: number;
}) {
  const { value, min, step, onChange } = useNumberInput();
  const { withBoop } = useSounds();

  // Create a stable decrement function
  const decrement = React.useCallback(() => {
    onChange((prevValue) => Math.max(prevValue - step, min));
  }, [min, step, onChange]);

  // Use our fixed hold action hook
  const { start, stop, isHolding } = useHoldAction(
    withBoop(decrement),
    holdDelay,
    holdInterval,
  );

  return (
    <Button
      size="icon"
      variant="secondary"
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={stop}
      onTouchStart={start}
      onTouchEnd={stop}
      onContextMenu={(e) => {
        // Prevent context menu from appearing on long press (mobile)
        if (isHolding) e.preventDefault();
      }}
      aria-label="Decrease value"
      disabled={value <= min}
      className={isHolding ? "bg-blue-300" : undefined}
      {...rest}
    >
      {children}
    </Button>
  );
}

function NumberInputLabel({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-blue-700 flex flex-col items-center gap-1 text-sm",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

function NumberInputValue({
  suffix = "",
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  suffix?: string;
}) {
  const { value } = useNumberInput();
  return (
    <span className={cn("font-medium", className)} aria-live="polite" {...rest}>
      {value}
      {suffix}
    </span>
  );
}

// Input component for manual value entry
function NumberInputField({
  className,
  ...rest
}: Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "type" | "min" | "max"
>) {
  const { value, min, max, onChange } = useNumberInput();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.min(Math.max(newValue, min), max));
    }
  };

  return (
    <input
      type="number"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      className={cn(
        "w-16 text-center p-2 rounded border border-blue-400 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300",
        className,
      )}
      {...rest}
    />
  );
}

// Export all components
NumberInput.Value = NumberInputValue;
NumberInput.Label = NumberInputLabel;
NumberInput.Increment = NumberInputIncrement;
NumberInput.Decrement = NumberInputDecrement;
NumberInput.Field = NumberInputField;

// In both NumberInputIncrement and NumberInputDecrement components,
// modify the handlers to prevent double-firing

function NumberInputIncrement({
  children = <IconChevronUp />,
  holdDelay = 500,
  holdInterval = 100,
  ...rest
}: React.HTMLAttributes<HTMLButtonElement> & {
  holdDelay?: number;
  holdInterval?: number;
}) {
  const { value, max, step, onChange } = useNumberInput();
  const { withBoop } = useSounds();

  // Track whether we're on a touch device
  const isTouchRef = React.useRef(false);

  // Create a stable increment function
  const increment = React.useCallback(() => {
    onChange((prevValue) => Math.min(prevValue + step, max));
  }, [max, step, onChange]);

  // Use our fixed hold action hook
  const { start, stop, isHolding } = useHoldAction(
    withBoop(increment),
    holdDelay,
    holdInterval,
  );

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchRef.current = true;
    start();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    isTouchRef.current = true;
    stop();
  };

  // Handle mouse events, but only if not triggered by touch
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTouchRef.current) {
      start();
    }
    // Reset after a short delay to handle future mouse events
    setTimeout(() => {
      isTouchRef.current = false;
    }, 500);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isTouchRef.current) {
      stop();
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => {
        // Prevent context menu from appearing on long press (mobile)
        if (isHolding) e.preventDefault();
      }}
      aria-label="Increase value"
      disabled={value >= max}
      className={isHolding ? "bg-blue-300" : undefined}
      {...rest}
    >
      {children}
    </Button>
  );
}

function NumberInputDecrement({
  children = <IconChevronDown />,
  holdDelay = 500,
  holdInterval = 100,
  ...rest
}: React.HTMLAttributes<HTMLButtonElement> & {
  holdDelay?: number;
  holdInterval?: number;
}) {
  const { value, min, step, onChange } = useNumberInput();
  const { withBoop } = useSounds();

  // Track whether we're on a touch device
  const isTouchRef = React.useRef(false);

  // Create a stable decrement function
  const decrement = React.useCallback(() => {
    onChange((prevValue) => Math.max(prevValue - step, min));
  }, [min, step, onChange]);

  // Use our fixed hold action hook
  const { start, stop, isHolding } = useHoldAction(
    withBoop(decrement),
    holdDelay,
    holdInterval,
  );

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchRef.current = true;
    start();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    isTouchRef.current = true;
    stop();
  };

  // Handle mouse events, but only if not triggered by touch
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTouchRef.current) {
      start();
    }
    // Reset after a short delay to handle future mouse events
    setTimeout(() => {
      isTouchRef.current = false;
    }, 500);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isTouchRef.current) {
      stop();
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => {
        // Prevent context menu from appearing on long press (mobile)
        if (isHolding) e.preventDefault();
      }}
      aria-label="Decrease value"
      disabled={value <= min}
      className={isHolding ? "bg-blue-300" : undefined}
      {...rest}
    >
      {children}
    </Button>
  );
}
