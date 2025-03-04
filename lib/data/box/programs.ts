export const BOX_PROGRAMS = [
  { name: "Focus", inhale: 4, inhaleHold: 4, exhale: 4, exhaleHold: 4 },
  { name: "Wake up", inhale: 6, inhaleHold: 1, exhale: 3, exhaleHold: 1 },
  { name: "Sleep", inhale: 4, inhaleHold: 7, exhale: 8, exhaleHold: 1 },
] as const;

export type BoxProgramName = (typeof BOX_PROGRAMS)[number]["name"];
