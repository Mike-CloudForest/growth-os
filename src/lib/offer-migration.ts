// Only untouched seeded text is updated. User edits, statuses and metrics survive.
const rules = [
  {
    "key": "signals",
    "id": "s-dz-2",
    "field": "draft",
    "before": "The line at the desk is what the kiosk is for. You are on Mindbody through March — we can sit beside you until then, then cut the stack. Founding $59.99 holds if you claim a seat now. —",
    "after": "The line at the desk is what the kiosk is for. You are on Mindbody through March. We can sit beside you until then, then cut the stack. Founding pricing is $99 per month for the first 20 schools, locked while continuously subscribed. Check availability before starting."
  },
  {
    "key": "signals",
    "id": "s-ly-1",
    "field": "draft",
    "before": "You can build the school tonight with your name on the door and not pay until someone enrolls. Kajabi starts at $149 whether you have members or not. If you want, I’ll sit on a call while you pick a name. —",
    "after": "You can build your school free with your name on the door. Review the paid plan and its trial terms before subscribing. I can walk you through setting up your first lesson."
  },
  {
    "key": "search",
    "id": "a-dz-1",
    "field": "answer",
    "before": "DojoZeus replaces billing, website, email, courses, and community. Founding $59.99/mo, then $149. Zeus flags students who quietly quit.",
    "after": "DojoZeus replaces billing, website, email, courses, and community. Founding $99/mo, then $169. Zeus flags students who quietly quit."
  }
];

export function reconcileOffers<T>(persisted: T): T {
  const p = { ...(persisted as Record<string, unknown>) };
  for (const rule of rules) {
    const rows = p[rule.key];
    if (!Array.isArray(rows)) continue;
    p[rule.key] = rows.map(row => row?.id === rule.id && row[rule.field] === rule.before
      ? { ...row, [rule.field]: rule.after } : row);
  }
  return p as T;
}
