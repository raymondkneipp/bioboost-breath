import * as React from "react";
import mountains from "~/assets/mountain.svg?url";
import trees from "~/assets/trees.svg";
import { Button } from "./ui/button";
import { IconMountain, IconTree } from "@tabler/icons-react";

export function ToggleBg() {
  const [bg, setBg] = React.useState<"trees" | "mountains">("trees");

  function toggleBg() {
    if (bg === "mountains") {
      setBg("trees");
    } else if (bg === "trees") {
      setBg("mountains");
    }
  }

  return (
    <>
      <Button className="fixed top-3 left-3" size="icon" onClick={toggleBg}>
        {bg === "trees" ? <IconTree /> : <IconMountain />}
      </Button>
      <div
        style={{
          backgroundImage: `url(${bg === "mountains" ? mountains : trees})`,
        }}
        className="min-h-dvh w-full bg-cover bg-top opacity-5 fixed -z-10 top-1/4"
      ></div>
    </>
  );
}
