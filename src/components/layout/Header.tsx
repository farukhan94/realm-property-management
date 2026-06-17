"use client";

import Image from "next/image";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between bg-slate-900 px-4 py-3 text-white md:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-primary">
          <Image src="/logo.png" alt="MANZIL" width={32} height={32} className="h-8 w-8 object-cover" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-base font-bold leading-tight tracking-tight md:text-lg">
            MANZIL{" "}
            <span className="hidden text-sm font-normal opacity-60 sm:inline">
              | Bahrain
            </span>
          </h1>
          <span className="text-xs font-normal text-slate-400">Portfolio</span>
        </div>
      </div>

      <div className="flex items-center">
        <div className="border-r border-slate-700 px-3 md:px-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <CircleHelp className="size-3.5" />
            <span className="text-xs">Help</span>
          </Button>
        </div>
        <div className="pl-3 md:pl-4">
          <button
            type="button"
            title="User menu"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            FK
          </button>
        </div>
      </div>
    </header>
  );
}
