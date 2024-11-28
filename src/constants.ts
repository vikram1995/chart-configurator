export const Breakpoints = {
  Desktop: "(min-width: 768px)",
  Tablet: "(min-width: 640px)",
  Mobile: "(max-width: 639px)",
} as const;

export const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;
