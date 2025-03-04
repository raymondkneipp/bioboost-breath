import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
