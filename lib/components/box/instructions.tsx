import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "~/lib/components/ui/button";

export function BoxInstructions(props: { onContinue: () => void }) {
  return (
    <div className="container p-2 max-w-md flex flex-col items-center gap-4">
      <Link className={buttonVariants({ variant: "ghost", size: "sm" })} to="/">
        <IconArrowLeft />
        Home
      </Link>
      <h1 className="font-bold text-3xl text-center">Box Breathing</h1>
      <ol className="list-decimal sm:list-outside list-inside flex flex-col gap-2 text-blue-900">
        <li>
          Sit in a comfortable position with your back straight and feet flat on
          the floor
        </li>
        <li>
          Place one hand on your chest and the other on your abdomen to monitor
          your breathing
        </li>
        <li>
          Inhale slowly through your nose, allowing your abdomen to expand
          first, followed by a slight lift in your chest
        </li>
        <li>Hold your breath gently, maintaining a relaxed posture</li>
        <li>
          Exhale completely through your nose, letting your abdomen and chest
          relax naturally
        </li>
        <li>
          Pause at the bottom of your exhale before beginning the next cycle
        </li>
        <li>
          Focus on keeping your shoulders relaxed and your breathing smooth
          throughout
        </li>
      </ol>
      <Button onClick={props.onContinue} size="lg">
        Next
        <IconArrowRight />
      </Button>
    </div>
  );
}
