import { NumberInput } from "~/lib/components/ui/number-input";
import { IconWind, IconLungs, IconLungsFilled } from "@tabler/icons-react";

interface BoxSettingsProps {
  inhale: number;
  setInhale: React.Dispatch<React.SetStateAction<number>>;
  inhaleHold: number;
  setInhaleHold: React.Dispatch<React.SetStateAction<number>>;
  exhale: number;
  setExhale: React.Dispatch<React.SetStateAction<number>>;
  exhaleHold: number;
  setExhaleHold: React.Dispatch<React.SetStateAction<number>>;
}

export function BoxSettings(props: BoxSettingsProps) {
  return (
    <div className="flex gap-8 w-full justify-around bg-blue-100 p-6 rounded-2xl shadow shadow-blue-400 inset-shadow-sm inset-shadow-white border border-blue-200">
      <NumberInput value={props.inhale} onChange={props.setInhale}>
        <NumberInput.Label>
          <IconWind className="-rotate-90" />
          Inhale
        </NumberInput.Label>
        <NumberInput.Increment />
        <NumberInput.Value suffix="s" />
        <NumberInput.Decrement />
      </NumberInput>

      <NumberInput value={props.inhaleHold} onChange={props.setInhaleHold}>
        <NumberInput.Label>
          <IconLungsFilled />
          Hold
        </NumberInput.Label>
        <NumberInput.Increment />
        <NumberInput.Value suffix="s" />
        <NumberInput.Decrement />
      </NumberInput>

      <NumberInput value={props.exhale} onChange={props.setExhale}>
        <NumberInput.Label>
          <IconWind className="rotate-90" />
          Exhale
        </NumberInput.Label>
        <NumberInput.Increment />
        <NumberInput.Value suffix="s" />
        <NumberInput.Decrement />
      </NumberInput>

      <NumberInput value={props.exhaleHold} onChange={props.setExhaleHold}>
        <NumberInput.Label>
          <IconLungs />
          Hold
        </NumberInput.Label>
        <NumberInput.Increment />
        <NumberInput.Value suffix="s" />
        <NumberInput.Decrement />
      </NumberInput>
    </div>
  );
}
