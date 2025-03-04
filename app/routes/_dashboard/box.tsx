import { createFileRoute } from "@tanstack/react-router";
import { NumberInput } from "~/lib/components/ui/number-input";
import React from "react";
import { Button } from "~/lib/components/ui/button";
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconRepeat,
  IconChevronLeft,
  IconChevronRight,
  IconArrowLeft,
  IconRocket,
  IconWind,
  IconLungsFilled,
  IconLungs,
  IconX,
} from "@tabler/icons-react";
import { useBreathingCycle } from "~/lib/hooks/breathing-cycle";
import { BoxInstructions } from "~/lib/components/box/instructions";
import { Progress } from "~/lib/components/ui/progress";
import { useSounds } from "~/lib/hooks/use-sounds";
import { Countdown } from "~/lib/components/box/countdown";
import { StateIndicator } from "~/lib/components/box/state-indicator";
import { BoxSettings } from "~/lib/components/box/settings";
import { BOX_PROGRAMS, BoxProgramName } from "~/lib/data/box/programs";

export const Route = createFileRoute("/_dashboard/box")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BreathingExerciseWithCountdown />;
}

const BreathingExerciseWithCountdown: React.FC = () => {
  const [inhale, setInhale] = React.useState(5);
  const [inhaleHold, setInhaleHold] = React.useState(5);
  const [exhale, setExhale] = React.useState(5);
  const [exhaleHold, setExhaleHold] = React.useState(5);
  const [repeat, setRepeat] = React.useState(6);

  const { withBoop, withTick } = useSounds();

  const totalTime = (inhale + inhaleHold + exhale + exhaleHold) * repeat;
  const formattedTime = `${Math.floor(totalTime / 60)}m ${totalTime % 60}s`;

  const [showInstructions, setShowInstructions] = React.useState(true);

  const [selectedProgram, setSelectedProgram] = React.useState<
    BoxProgramName | "custom"
  >("Focus");

  const {
    currentState,
    cycleCount,
    isActive,
    hasStarted,
    progress,
    totalCycles,
    startCycle,
    pauseCycle,
    resumeCycle,
    resetCycle,
    remainingTime,
    isCountingDown,
    countdownValue,
    formattedTimeLeft,
  } = useBreathingCycle(
    repeat,
    {
      INHALE: inhale * 1000,
      INHALE_HOLD: inhaleHold * 1000,
      EXHALE: exhale * 1000,
      EXHALE_HOLD: exhaleHold * 1000,
    },
    3,
  ); // 3-second countdown

  return (
    <div className="flex flex-col items-center gap-6 px-2 py-12 w-full max-w-md mx-auto relative z-10">
      {showInstructions ? (
        <BoxInstructions
          onContinue={withBoop(() => setShowInstructions(false))}
        />
      ) : (
        <>
          {/* Show countdown if we're in countdown mode */}
          {isCountingDown && isActive && <Countdown value={countdownValue} />}

          {hasStarted && !isCountingDown && (
            <Button onClick={withBoop(resetCycle)} variant="ghost" size="sm">
              <IconX /> Cancel
            </Button>
          )}

          {/* Show breathing UI when session has started (even when paused) */}
          {hasStarted && !isCountingDown && (
            <div className="flex flex-col gap-2 w-full">
              <StateIndicator currentState={currentState} />

              <div className="flex flex-col items-center gap-2 mb-6">
                <Progress value={progress * 100} />
                <p className="text-sm text-blue-900">
                  {Math.ceil(remainingTime / 1000)}s left
                </p>
              </div>

              <div className="text-center mb-4">
                <p>
                  Cycle: <span className="font-semibold">{cycleCount + 1}</span>{" "}
                  of {totalCycles}
                </p>
                <p className="font-semibold mt-2 text-lg">
                  {formattedTimeLeft}
                </p>
              </div>
            </div>
          )}

          {/* Configure UI when not started */}
          {!hasStarted && !isCountingDown && (
            <div className="flex flex-col gap-8 items-center w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={withBoop(() => setShowInstructions(true))}
              >
                <IconArrowLeft />
                Back
              </Button>

              <h2 className="text-xl font-semibold">Select Program</h2>

              <div className="flex flex-col gap-2 w-full">
                {BOX_PROGRAMS.map((program) => (
                  <Button
                    variant={
                      program.name === selectedProgram ? "default" : "secondary"
                    }
                    onClick={withBoop(() => {
                      setSelectedProgram(program.name);
                      setInhale(program.inhale);
                      setInhaleHold(program.inhaleHold);
                      setExhale(program.exhale);
                      setExhaleHold(program.exhaleHold);
                    })}
                    className="h-auto flex-col items-start gap-2 py-4"
                  >
                    {program.name}
                    <div className="grid grid-cols-4 divide-x divide-blue-200 mt-4 w-full">
                      <div className="font-normal flex flex-col items-center gap-1 px-3">
                        <IconWind className="-rotate-90" />
                        <span className="text-sm">Inhale</span>
                        <span className="text-md font-medium">
                          {program.inhale}s
                        </span>
                      </div>
                      <div className="font-normal flex flex-col items-center gap-1 px-3">
                        <IconLungsFilled />
                        <span className="text-sm">Hold</span>
                        <span className="text-md font-medium">
                          {program.inhaleHold}s
                        </span>
                      </div>
                      <div className="font-normal flex flex-col items-center gap-1 px-3">
                        <IconWind className="rotate-90" />
                        <span className="text-sm">Exhale</span>
                        <span className="text-md font-medium">
                          {program.exhale}s
                        </span>
                      </div>
                      <div className="font-normal flex flex-col items-center gap-1 px-3">
                        <IconLungs />
                        <span className="text-sm">Hold</span>
                        <span className="text-md font-medium">
                          {program.exhaleHold}s
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
                <Button
                  onClick={withBoop(() => setSelectedProgram("custom"))}
                  variant={
                    selectedProgram === "custom" ? "default" : "secondary"
                  }
                >
                  Custom
                </Button>
              </div>

              {selectedProgram === "custom" && (
                <BoxSettings
                  inhale={inhale}
                  setInhale={setInhale}
                  inhaleHold={inhaleHold}
                  setInhaleHold={setInhaleHold}
                  exhale={exhale}
                  setExhale={setExhale}
                  exhaleHold={exhaleHold}
                  setExhaleHold={setExhaleHold}
                />
              )}

              <NumberInput
                value={repeat}
                onChange={setRepeat}
                max={99}
                className="flex-row"
              >
                <NumberInput.Label className="flex-row">
                  <IconRepeat />
                  Repeat
                </NumberInput.Label>
                <NumberInput.Decrement>
                  <IconChevronLeft />
                </NumberInput.Decrement>
                <NumberInput.Value suffix=" times" />
                <NumberInput.Increment>
                  <IconChevronRight />
                </NumberInput.Increment>
              </NumberInput>

              <p className="text-center">
                Total time: <span className="font-medium">{formattedTime}</span>
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="controls flex gap-4">
            {!hasStarted && !isCountingDown ? (
              <Button onClick={withTick(startCycle)} size="lg">
                Start
                <IconRocket />
              </Button>
            ) : isActive && !isCountingDown ? (
              <Button onClick={withBoop(pauseCycle)}>
                <IconPlayerPauseFilled /> Pause
              </Button>
            ) : (
              !isCountingDown && (
                <>
                  <Button onClick={withBoop(resumeCycle)}>
                    <IconPlayerPlayFilled /> Resume
                  </Button>
                </>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};
