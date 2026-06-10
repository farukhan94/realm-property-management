"use client";

import { DemoControlsBar } from "./DemoControlsBar";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { StatusFooter } from "./StatusFooter";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 font-sans text-slate-900">
      <DemoControlsBar />
      <Header />
      <main className="flex flex-1 gap-dashboard-gap overflow-hidden p-2 md:p-3">
        <Sidebar />
        <section className="flex w-full flex-1 flex-col gap-dashboard-gap overflow-y-auto rounded-lg bg-transparent pb-10">
          {children}
        </section>
      </main>
      <StatusFooter />
    </div>
  );
}
