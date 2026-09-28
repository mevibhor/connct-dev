export function RightPanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-foreground">Trending Tech</h3>
        <ul className="space-y-3">
          {["Next.js 15", "Tailwind v4", "React Server Components"].map(
            (tech) => (
              <li key={tech} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{tech}</span>
                <span className="text-xs font-medium text-primary">
                  Trending
                </span>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
