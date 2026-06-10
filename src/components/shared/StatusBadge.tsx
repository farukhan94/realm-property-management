import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { LeaseStatus } from "@/types/lease";
import type { WorkOrderStatus } from "@/types/work-order";

type Status = LeaseStatus | WorkOrderStatus | string;

const STATUS_HINTS: Record<string, string> = {
  active: "Lease is currently in force and billable.",
  completed: "Work order has been resolved and closed.",
  renewed: "Lease was extended from a prior term.",
  draft: "Record is saved but not yet finalized.",
  new: "Awaiting assignment or triage.",
  assigned: "Assigned to a technician or owner.",
  in_progress: "Work is actively underway.",
  terminated: "Lease ended before natural expiry.",
  expired: "Lease term has elapsed without renewal.",
  cancelled: "Record was voided before completion.",
  critical: "Requires immediate attention.",
  high: "Elevated priority — address within SLA.",
};

const VARIANT_MAP: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  completed: "default",
  renewed: "default",
  draft: "outline",
  new: "outline",
  assigned: "secondary",
  in_progress: "secondary",
  terminated: "destructive",
  expired: "destructive",
  cancelled: "destructive",
  critical: "destructive",
  high: "destructive",
};

export function StatusBadge({
  status,
  hint,
}: {
  status: Status;
  hint?: string;
}) {
  const key = status.toLowerCase().replace(/\s+/g, "_");
  const variant = VARIANT_MAP[key] ?? "secondary";
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const tooltip = hint ?? STATUS_HINTS[key];

  const badge = <Badge variant={variant}>{label}</Badge>;

  if (!tooltip) return badge;

  return (
    <Tooltip>
      <TooltipTrigger>{badge}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
