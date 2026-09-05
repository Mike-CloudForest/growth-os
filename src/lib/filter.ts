import { useGrowthStore } from "./store";
import type { FilterId } from "./types";

export function matchesFilter(businessId: FilterId, selected: FilterId) {
  return selected === "all" || businessId === selected || businessId === "all";
}

export function useSelected() {
  return useGrowthStore((s) => s.selected);
}
