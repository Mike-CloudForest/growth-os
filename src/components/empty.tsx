export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-card px-5 py-10 text-center shadow-[var(--shadow-border)]">
      <p className="font-display text-lg text-foreground">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
