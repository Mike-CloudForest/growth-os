import { BUSINESS_BY_ID } from "@/lib/businesses";
import type { BusinessId, FilterId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Mark({
  id,
  className,
}: {
  id: FilterId;
  className?: string;
}) {
  if (id === "all") {
    return (
      <span
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-sm bg-muted text-[10px] font-medium tracking-wider text-muted-foreground",
          className,
        )}
      >
        ALL
      </span>
    );
  }
  const b = BUSINESS_BY_ID[id as BusinessId];
  return (
    <span
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-sm bg-muted font-mono text-[11px] font-medium text-foreground",
        className,
      )}
    >
      {b.mark}
    </span>
  );
}
