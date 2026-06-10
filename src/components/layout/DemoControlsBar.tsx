"use client";

import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/lib/role-context";
import { ROLES, type Role } from "@/types/role";

export function DemoControlsBar() {
  const { role, setRole } = useRole();

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-slate-100 px-4 py-1.5 text-xs text-slate-600 md:px-6">
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-100 px-1.5 py-0 font-mono text-[10px] uppercase tracking-wider text-blue-700"
        >
          Demo
        </Badge>
        <span className="hidden text-slate-500 sm:inline">
          Prototype controls — not production UI
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-500">Role</span>
          <select
            title="Switch role"
            className="cursor-pointer rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-900 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="text-slate-900">
                {r} View
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
