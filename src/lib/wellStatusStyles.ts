import type { WellStatus } from "../store/useOilFlowStore";

export const WELL_STATUS_STYLES: Record<
  WellStatus,
  { badge: string; dot: string }
> = {
  operational: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  maintenance: {
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    dot: "bg-sky-400",
  },
  critical: {
    badge: "bg-red-500/10 text-red-400 border-red-500/30",
    dot: "bg-red-400",
  },
};
