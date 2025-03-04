import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { IconHomeFilled, IconLungsFilled } from "@tabler/icons-react";
import { buttonVariants } from "~/lib/components/ui/button";

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-blue-300">
        <div className="container mx-auto p-2 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <IconLungsFilled className="size-10" />
            <span className="text-xl font-bold">BioBoost Breath</span>
          </Link>

          <nav className="flex gap-2">
            <Link to="/" className={buttonVariants({ variant: "ghost" })}>
              <IconHomeFilled />
              Home
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
