import { createFileRoute, Link } from "@tanstack/react-router";
import { IconBox, IconLungsFilled } from "@tabler/icons-react";
import { buttonVariants } from "~/lib/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="container mx-auto max-w-lg flex flex-col gap-4 min-h-dvh items-center justify-center p-2">
      <div className="flex items-center gap-2 justify-center flex-wrap">
        <IconLungsFilled className="size-16" />
        <h1 className="text-3xl font-bold text-center">BioBoost Breath</h1>
      </div>
      <p className="text-lg text-blue-900/80 text-center">
        Breathing is the foundation of calm and focus. Control your breath, and
        you control your mind and body.
      </p>
      <Link to="/box" className={buttonVariants({ size: "lg" })}>
        <IconBox /> Box Breathing
      </Link>
      <p className="text-sm font-medium text-blue-900/60">More to come...</p>
    </div>
  );
}
