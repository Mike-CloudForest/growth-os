import { useMemo, useState, type ReactNode } from "react";
import { BUSINESS_BY_ID } from "@/lib/businesses";
import { matchesFilter, useSelected } from "@/lib/filter";
import type { BusinessId } from "@/lib/types";
import { Input } from "./ui/input";

function Field({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium tracking-wider text-subtle uppercase">
        {label}
      </span>
      <div className="relative">
        {prefix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-subtle"
          >
            {prefix}
          </span>
        )}
        <Input
          type="number"
          min={0}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className={prefix ? "pl-8" : undefined}
        />
      </div>
    </label>
  );
}

function Result({ kicker, value, detail }: { kicker: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg bg-muted px-4 py-4">
      <p className="text-[11px] tracking-wider text-subtle uppercase">{kicker}</p>
      <p className="font-display mt-1 text-3xl tabular-nums tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function DojoStack() {
  const [billing, setBilling] = useState(199);
  const [site, setSite] = useState(29);
  const [email, setEmail] = useState(49);
  const [courses, setCourses] = useState(99);
  const [community, setCommunity] = useState(79);
  const stack = billing + site + email + courses + community;
  const save = Math.max(stack - 99, 0);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Billing (Mindbody-class)" value={billing} onChange={setBilling} prefix="$" />
      <Field label="Website" value={site} onChange={setSite} prefix="$" />
      <Field label="Email" value={email} onChange={setEmail} prefix="$" />
      <Field label="Courses" value={courses} onChange={setCourses} prefix="$" />
      <Field label="Community app" value={community} onChange={setCommunity} prefix="$" />
      <Result
        kicker="You keep, per month"
        value={money(save)}
        detail={`${money(stack)} stack vs $99 founding DojoZeus.`}
      />
    </div>
  );
}

function MechLeak() {
  const [jobs, setJobs] = useState(8);
  const [avg, setAvg] = useState(420);
  const [rate, setRate] = useState(22);
  const week = jobs * avg * (rate / 100);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Declined jobs / week" value={jobs} onChange={setJobs} />
      <Field label="Average declined ticket" value={avg} onChange={setAvg} prefix="$" />
      <Field label="Close rate if you text same day" value={rate} onChange={setRate} />
      <Result
        kicker="Recoverable / week"
        value={money(week)}
        detail={`${money(week * 52)} a year if the text actually goes out.`}
      />
    </div>
  );
}

function RigVisor() {
  const [hours, setHours] = useState(4);
  const [wage, setWage] = useState(45);
  const [trucks, setTrucks] = useState(2);
  const week = hours * wage * trucks;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Hours on the visor / truck / week" value={hours} onChange={setHours} />
      <Field label="What an hour is worth" value={wage} onChange={setWage} prefix="$" />
      <Field label="Trucks" value={trucks} onChange={setTrucks} />
      <Result
        kicker="Visor tax / week"
        value={money(week)}
        detail={`Radar is $79 a truck. The visor is ${money(week)} of your week.`}
      />
    </div>
  );
}

function LyceumCut() {
  const [rev, setRev] = useState(4000);
  const kajabi = 149 + rev * 0.029;
  const academy = 249;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Member revenue / month" value={rev} onChange={setRev} prefix="$" />
      <Result
        kicker="Kajabi-shaped stack"
        value={money(kajabi)}
        detail="Platform fee plus processing. You still do not own the hall."
      />
      <Result
        kicker="Lyceum Academy"
        value={money(academy)}
        detail="0% of members, forever. Stripe is yours."
      />
      <Result
        kicker="Kept, per year"
        value={money((kajabi - academy) * 12)}
        detail="The difference, if revenue holds."
      />
    </div>
  );
}

function CloudVisit() {
  const [visits, setVisits] = useState(14);
  const [show, setShow] = useState(6);
  const [enroll, setEnroll] = useState(3);
  const showRate = visits ? show / visits : 0;
  const close = show ? enroll / show : 0;
  const extra = Math.round(visits * 0.85 * 0.55);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Visitor passes this week" value={visits} onChange={setVisits} />
      <Field label="Actually trained" value={show} onChange={setShow} />
      <Field label="$49 enrollments" value={enroll} onChange={setEnroll} />
      <Result
        kicker="Show rate"
        value={`${Math.round(showRate * 100)}%`}
        detail={`Close rate on the floor: ${Math.round(close * 100)}%. The leak is the 72 hours after the waiver.`}
      />
      <Result
        kicker="If 85% pick a class in 24h"
        value={`${extra} members`}
        detail="Same traffic. A same-day class pick and a 24-hour text."
      />
    </div>
  );
}

const SURFACES: {
  id: BusinessId;
  title: string;
  lede: string;
  View: () => ReactNode;
}[] = [
  {
    id: "dojozeus",
    title: "Stack replacement",
    lede: "What the five-tool dojo stack costs against founding $99.",
    View: DojoStack,
  },
  {
    id: "mechcorrect",
    title: "Declined-work leak",
    lede: "The HVAC move: stop losing the work you already found.",
    View: MechLeak,
  },
  {
    id: "rigboss",
    title: "Visor tax",
    lede: "Hours on fuel tickets and IFTA, priced like wages.",
    View: RigVisor,
  },
  {
    id: "lyceum",
    title: "The cut",
    lede: "Kajabi-shaped fees versus Academy at 0% share.",
    View: LyceumCut,
  },
  {
    id: "cloudforest",
    title: "72-hour leak",
    lede: "Visitor passes that never become a class on the floor.",
    View: CloudVisit,
  },
];

export function Calculators() {
  const selected = useSelected();
  const items = useMemo(
    () => SURFACES.filter((s) => matchesFilter(s.id, selected)),
    [selected],
  );
  return (
    <div className="space-y-4">
      {items.map((s) => {
        const View = s.View;
        return (
          <article key={s.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="text-[11px] font-medium tracking-wider text-subtle uppercase">
              Surface · {BUSINESS_BY_ID[s.id].name}
            </p>
            <h3 className="font-display mt-1 text-xl">{s.title}</h3>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">{s.lede}</p>
            <View />
          </article>
        );
      })}
    </div>
  );
}
