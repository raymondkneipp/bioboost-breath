import { IconLungs, IconLungsFilled, IconWind } from "@tabler/icons-react";
import { type BreathState } from "~/lib/hooks/breathing-cycle";
import { cn } from "~/lib/utils";

export function StateIndicator(props: { currentState: BreathState }) {
  return (
    <div className="grid grid-cols-4 w-full">
      {[
        {
          icon: <IconWind className="-rotate-90 size-12" />,
          label: "Inhale",
          id: "INHALE",
        },
        {
          icon: <IconLungsFilled className="size-12" />,
          label: "Hold",
          id: "INHALE_HOLD",
        },
        {
          icon: <IconWind className="rotate-90 size-12" />,
          label: "Exhale",
          id: "EXHALE",
        },
        {
          icon: <IconLungs className="size-12" />,
          label: "Hold",
          id: "EXHALE_HOLD",
        },
      ].map((stage) => (
        <div
          key={stage.id}
          className={cn(
            "flex flex-col items-center justify-center text-center transition-all text-blue-900/50 p-4",
            {
              "scale-150 text-blue-900": props.currentState === stage.id,
            },
          )}
        >
          <span className="text-sm">{stage.label}</span>
          {stage.icon}
        </div>
      ))}
    </div>
  );
}
