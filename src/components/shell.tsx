import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  Brain,
  FlaskConical,
  LayoutDashboard,
  Menu,
  PenLine,
  Quote,
  Radar,
  Search,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BUSINESSES } from "@/lib/businesses";
import { useGrowthStore } from "@/lib/store";
import type { FilterId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const NAV = [
  { to: "/", label: "Cockpit", icon: LayoutDashboard },
  { to: "/truth", label: "Customer truth", icon: Quote },
  { to: "/content", label: "Content", icon: PenLine },
  { to: "/outbound", label: "Outbound", icon: Send },
  { to: "/creative", label: "Creative", icon: FlaskConical },
  { to: "/search", label: "AI search", icon: Search },
  { to: "/agents", label: "Agents", icon: Bot },
  { to: "/brain", label: "SuperBrain", icon: Brain },
] as const;

function BrandLockup() {
  return (
    <Link to="/" className="flex items-baseline gap-2">
      <Radar className="size-4 text-foreground" strokeWidth={1.75} />
      <span className="font-display text-lg tracking-tight">Growth OS</span>
    </Link>
  );
}

export function BusinessSwitcher({
  onPick,
  layout = "wrap",
}: {
  onPick?: () => void;
  layout?: "wrap" | "stack";
}) {
  const selected = useGrowthStore((s) => s.selected);
  const setSelected = useGrowthStore((s) => s.setSelected);
  const options: { id: FilterId; label: string }[] = [
    { id: "all", label: "House" },
    ...BUSINESSES.map((b) => ({ id: b.id as FilterId, label: b.name })),
  ];
  return (
    <div className={cn(layout === "stack" ? "flex flex-col gap-0.5" : "flex flex-wrap gap-1")}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => {
            setSelected(opt.id);
            onPick?.();
          }}
          className={cn(
            "h-9 rounded-md px-3 text-xs font-medium transition-colors duration-150",
            layout === "stack" && "w-full text-left",
            selected === opt.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function NavLinks({ onPick }: { onPick?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onPick}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onPick }: { onPick?: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-1 pt-1 pb-5">
        <BrandLockup />
        <p className="mt-1 text-xs text-subtle">Market signal into pipeline</p>
      </div>
      <p className="mb-2 px-1 text-xs font-medium tracking-wider text-subtle uppercase">Company</p>
      <BusinessSwitcher onPick={onPick} layout="stack" />
      <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <p className="mb-2 px-1 text-xs font-medium tracking-wider text-subtle uppercase">Systems</p>
        <NavLinks onPick={onPick} />
      </div>
      <p className="pt-6 px-1 text-xs leading-relaxed text-subtle">
        Five companies. One operating system. SuperBrain remembers.
      </p>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void useGrowthStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-60 overflow-y-auto border-r border-border bg-card px-4 py-5 lg:flex">
        <SidebarBody />
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm lg:hidden">
          <div className="flex items-center gap-3 px-4 py-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SidebarBody onPick={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <BrandLockup />
          </div>
          <div className="overflow-x-auto px-3 pb-2">
            <div className="flex w-max gap-1">
              <BusinessSwitcher />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
