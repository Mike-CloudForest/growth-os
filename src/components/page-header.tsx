import { BUSINESS_BY_ID } from "@/lib/businesses";
import { useSelected } from "@/lib/filter";

export function PageHeader({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede: string;
}) {
  const selected = useSelected();
  const company = selected === "all" ? "the house" : BUSINESS_BY_ID[selected].name;
  return (
    <header className="mb-8 max-w-3xl">
      <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">
        {kicker} · {company}
      </p>
      <h1 className="font-display mt-2 text-3xl leading-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lede}</p>
    </header>
  );
}
