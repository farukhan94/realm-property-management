interface TimelineBarProps {
  label: string;
  startDate: string;
  endDate: string | null;
  rangeStart: string;
  rangeEnd: string;
  color: string;
  detail: string;
}

function dateToPercent(date: string, rangeStart: string, rangeEnd: string): number {
  const start = new Date(rangeStart).getTime();
  const end = new Date(rangeEnd).getTime();
  const d = new Date(date).getTime();
  const span = end - start;
  if (span <= 0) return 0;
  return Math.max(0, Math.min(100, ((d - start) / span) * 100));
}

export function TimelineBar({
  label,
  startDate,
  endDate,
  rangeStart,
  rangeEnd,
  color,
  detail,
}: TimelineBarProps) {
  const effectiveEnd = endDate ?? rangeEnd;
  const left = dateToPercent(startDate, rangeStart, rangeEnd);
  const right = dateToPercent(effectiveEnd, rangeStart, rangeEnd);
  const width = Math.max(right - left, 2);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{detail}</span>
      </div>
      <div className="relative h-6 rounded bg-muted">
        <div
          className="absolute top-0.5 h-5 rounded-sm"
          style={{
            left: `${left}%`,
            width: `${width}%`,
            backgroundColor: color,
          }}
          title={`${startDate} → ${endDate ?? "present"}`}
        />
      </div>
    </div>
  );
}
