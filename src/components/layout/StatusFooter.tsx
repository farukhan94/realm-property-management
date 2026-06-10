export function StatusFooter() {
  return (
    <footer className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-100 px-4 py-1.5 font-mono text-[9px] text-slate-400">
      <div className="flex gap-4">
        <span>DB: Connected</span>
        <span>Latency: 12ms</span>
        <span>Cloudflare: Active</span>
      </div>
      <div className="flex gap-4">
        <span className="hidden sm:inline">UTC: 2026-06-10 14:22:11</span>
        <span className="text-blue-500">V 0.1.0-DEV</span>
      </div>
    </footer>
  );
}
