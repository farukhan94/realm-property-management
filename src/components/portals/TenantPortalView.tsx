"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  FileText,
  Home,
  MessageSquare,
  Receipt,
  Star,
  Ticket,
  User,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { portalsService } from "@/lib/api/services/portals";
import { FULL_TABLE, fullTableSort } from "@/lib/data-table/full-table";
import { cn } from "@/lib/utils";

type Section = "dashboard" | "ticket" | "contact" | "feedback" | "invoices" | "profile" | "contract" | "alerts";

const SECTIONS: { id: Section; label: string; icon: typeof Home }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "ticket", label: "Create Ticket", icon: Ticket },
  { id: "contact", label: "Contact Owner", icon: MessageSquare },
  { id: "feedback", label: "Feedback", icon: Star },
  { id: "invoices", label: "Invoices & Receipts", icon: Receipt },
  { id: "profile", label: "Profile", icon: User },
  { id: "contract", label: "Contract", icon: FileText },
  { id: "alerts", label: "Alerts", icon: Bell },
];

export function TenantPortalView() {
  const [section, setSection] = useState<Section>("dashboard");
  const [data, setData] = useState<Awaited<ReturnType<typeof portalsService.getForRole>>>(null);
  const [ticketForm, setTicketForm] = useState({ title: "", description: "", category: "maintenance", priority: "medium" });
  const [contactForm, setContactForm] = useState({ subject: "", message: "" });
  const [feedbackForm, setFeedbackForm] = useState({ category: "Maintenance", rating: 5, message: "" });
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    portalsService.getForRole("Tenant").then(setData);
  }, []);

  if (!data || !("leases" in data)) {
    return <PageShell title="Tenant Portal" description="Loading…"><p className="text-muted-foreground">Loading…</p></PageShell>;
  }

  const activeLease = data.leases.find((l) => l.status === "active");
  const dueAmount = data.invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.totalAmount - (i.paidAmount ?? 0), 0);

  return (
    <PageShell
      title="Tenant Portal"
      description="Your lease, payments, and building services"
      actions={<Button variant="outline" size="sm" render={<Link href="/" />}>Dashboard</Button>}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto lg:w-48 lg:flex-col">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setSection(s.id); setSubmitted(null); }}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                section === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <s.icon className="h-4 w-4 shrink-0" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {section === "dashboard" && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>What&apos;s Due</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive"><CurrencyDisplay amount={dueAmount} /></div>
                  <p className="text-sm text-muted-foreground">Outstanding balance</p>
                </CardContent>
              </Card>
              {activeLease && (
                <Card>
                  <CardHeader><CardTitle>Active Lease</CardTitle></CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p>{activeLease.unitLabel}</p>
                    <p><CurrencyDisplay amount={activeLease.monthlyRent} />/mo</p>
                    <p className="text-muted-foreground">{activeLease.startDate} → {activeLease.endDate}</p>
                  </CardContent>
                </Card>
              )}
              <Card className="md:col-span-2">
                <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => setSection("ticket")}>Create Ticket</Button>
                  <Button size="sm" variant="outline" onClick={() => setSection("invoices")}>Pay Invoice</Button>
                  <Button size="sm" variant="outline" onClick={() => setSection("contact")}>Contact Owner</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {section === "ticket" && (
            <Card>
              <CardHeader><CardTitle>Create Maintenance Ticket</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {submitted ? <p className="text-sm text-primary">{submitted}</p> : (
                  <>
                    <Input placeholder="Title" value={ticketForm.title} onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })} />
                    <Textarea placeholder="Describe the issue…" value={ticketForm.description} onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })} rows={4} />
                    <div className="flex gap-3">
                      <select className="rounded-md border border-input px-3 py-2 text-sm" value={ticketForm.category} onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })} title="Category">
                        <option value="maintenance">Maintenance</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="ac">AC / HVAC</option>
                      </select>
                      <select className="rounded-md border border-input px-3 py-2 text-sm" value={ticketForm.priority} onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })} title="Priority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <Button onClick={() => setSubmitted(`Ticket "${ticketForm.title || "Maintenance request"}" submitted successfully.`)}>Submit Ticket</Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {section === "contact" && (
            <Card>
              <CardHeader><CardTitle>Contact Owner</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {submitted ? <p className="text-sm text-primary">{submitted}</p> : (
                  <>
                    <Input placeholder="Subject" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} />
                    <Textarea placeholder="Your message…" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} rows={5} />
                    <Button onClick={() => setSubmitted("Message sent to your owner.")}>Send Message</Button>
                  </>
                )}
                {"messages" in data && data.messages.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-border pt-4">
                    <h4 className="text-sm font-semibold">Previous Messages</h4>
                    {data.messages.map((m) => (
                      <div key={m.id} className="rounded-md bg-muted/50 p-3 text-sm">
                        <p className="font-medium">{m.subject}</p>
                        <p className="text-muted-foreground">{m.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {section === "feedback" && (
            <Card>
              <CardHeader><CardTitle>Feedback</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {submitted ? <p className="text-sm text-primary">{submitted}</p> : (
                  <>
                    <select className="w-full rounded-md border border-input px-3 py-2 text-sm" value={feedbackForm.category} onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })} title="Category">
                      <option>Maintenance</option>
                      <option>Building Management</option>
                      <option>Amenities</option>
                      <option>Other</option>
                    </select>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" onClick={() => setFeedbackForm({ ...feedbackForm, rating: n })} className={cn("text-2xl", n <= feedbackForm.rating ? "text-primary" : "text-muted")}>★</button>
                      ))}
                    </div>
                    <Textarea placeholder="Your feedback…" value={feedbackForm.message} onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })} rows={4} />
                    <Button onClick={() => setSubmitted("Thank you for your feedback!")}>Submit Feedback</Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {section === "invoices" && (
            <Card>
              <CardHeader><CardTitle>Invoices & Receipts</CardTitle></CardHeader>
              <CardContent>
                <DataTable
                  {...FULL_TABLE}
                  data={data.invoices}
                  searchKeys={["id"]}
                  defaultSort={fullTableSort("dueDate")}
                  columns={[
                    { key: "id", header: "Invoice", sortable: true, cell: (r) => r.id },
                    { key: "dueDate", header: "Due", sortable: true, cell: (r) => r.dueDate },
                    { key: "totalAmount", header: "Total", sortable: true, cell: (r) => <CurrencyDisplay amount={r.totalAmount} />, className: "text-right" },
                    { key: "status", header: "Status", sortable: true, filterKey: "status", filterValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
                  ]}
                  actions={[
                    { label: "Pay Now", onClick: () => setSubmitted("Payment simulated — invoice marked as paid.") },
                    { label: "Download", onClick: () => {} },
                  ]}
                />
              </CardContent>
            </Card>
          )}

          {section === "profile" && data.profile && (
            <Card>
              <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid gap-2 md:grid-cols-2">
                  <div><span className="text-muted-foreground">Name</span><p className="font-medium">{data.profile.name}</p></div>
                  <div><span className="text-muted-foreground">Email</span><p className="font-medium">{data.profile.email}</p></div>
                  <div><span className="text-muted-foreground">Phone</span><p className="font-medium">{data.profile.phone}</p></div>
                  <div><span className="text-muted-foreground">Nationality</span><p className="font-medium">{data.profile.nationality}</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          {section === "contract" && activeLease && (
            <Card>
              <CardHeader><CardTitle>Lease Contract</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-md border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed">
                  <p className="font-bold">TENANCY AGREEMENT — Kingdom of Bahrain</p>
                  <p className="mt-2">Unit: {activeLease.unitLabel}</p>
                  <p>Tenant: {data.profile?.name}</p>
                  <p>Monthly Rent: BHD {activeLease.monthlyRent.toFixed(3)}</p>
                  <p>Term: {activeLease.startDate} to {activeLease.endDate}</p>
                  <p className="mt-2 text-muted-foreground">Registered with SLRB. EWA account on file.</p>
                </div>
                <Button variant="outline" size="sm">Download PDF</Button>
              </CardContent>
            </Card>
          )}

          {section === "alerts" && "notifications" in data && (
            <Card>
              <CardHeader><CardTitle>Alerts & Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {data.notifications.map((n) => (
                  <div key={n.id} className="flex items-start justify-between border-b border-border pb-3">
                    <div>
                      <p className="font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                      <p className="text-xs text-muted-foreground">{n.date}</p>
                    </div>
                    {!n.read && <Badge>New</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  );
}
