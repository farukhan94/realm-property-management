"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Download, Upload } from "lucide-react";
import { AiActionButton } from "@/components/shared/AiActionButton";
import { ContractPreviewDialog } from "@/components/property/ContractPreviewDialog";
import { migrationService } from "@/lib/api/services/migration";
import {
  parseCsv,
  validateByTemplate,
  type ValidationError,
  type CsvRow,
} from "@/lib/migration/validators";

type WizardStep = "upload" | "validate" | "preview" | "commit";

export function MigrationMapView() {
  const [steps, setSteps] = useState<Awaited<ReturnType<typeof migrationService.listSteps>>>([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [wizardStep, setWizardStep] = useState<WizardStep>("upload");
  const [template, setTemplate] = useState("leases");
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [committed, setCommitted] = useState(false);

  useEffect(() => {
    migrationService.listSteps().then(setSteps);
  }, []);

  async function handleAiMapping(target: string) {
    const text = await migrationService.generateMappingSuggestion(target);
    setAiText(text);
    setAiOpen(true);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsv(reader.result as string);
      setRows(parsed);
      setWizardStep("validate");
      setErrors(validateByTemplate(template, parsed));
      setCommitted(false);
    };
    reader.readAsText(file);
  }

  function handleValidate() {
    setErrors(validateByTemplate(template, rows));
    setWizardStep(errors.length === 0 ? "preview" : "validate");
  }

  function handlePreview() {
    if (errors.length === 0) setWizardStep("preview");
  }

  function handleCommit() {
    setCommitted(true);
    setWizardStep("commit");
  }

  return (
    <PageShell
      title="Migration map"
      description="Legacy system import paths and Bahrain CSV migration wizard."
      actions={
        <AiActionButton
          label="AI assist mapping"
          onClick={() => handleAiMapping("Leases & Tenants")}
        />
      }
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>CSV import wizard</CardTitle>
          <CardDescription>Upload → validate → preview → mock commit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {["buildings", "units", "leases", "hoa-ledgers"].map((t) => (
              <Button
                key={t}
                variant={template === t ? "default" : "outline"}
                size="sm"
                onClick={() => setTemplate(t)}
              >
                {t}
              </Button>
            ))}
          </div>

          {wizardStep === "upload" && (
            <div className="flex flex-col gap-3">
              <Input type="file" accept=".csv" onChange={handleFileUpload} />
              <div className="flex flex-wrap gap-2">
                {["buildings", "units", "leases", "hoa-ledgers"].map((t) => (
                  <Button key={t} variant="outline" size="sm" render={<a href={`/templates/${t}.csv`} download />}>
                    <Download className="h-4 w-4" />
                    {t}.csv
                  </Button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === "validate" && (
            <div className="space-y-3">
              <p className="text-sm">{rows.length} rows parsed from {template}.csv</p>
              {errors.length > 0 ? (
                <ul className="text-sm text-destructive space-y-1">
                  {errors.map((e, i) => (
                    <li key={i}>Row {e.row}: {e.field} — {e.message}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-emerald-600">All rows valid</p>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={handleValidate}>Re-validate</Button>
                <Button size="sm" variant="outline" onClick={handlePreview} disabled={errors.length > 0}>
                  Continue to preview
                </Button>
              </div>
            </div>
          )}

          {wizardStep === "preview" && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Dry-run summary</p>
              <ul className="text-sm text-muted-foreground">
                <li>Template: {template}</li>
                <li>Rows to import: {rows.length}</li>
                <li>Buildings: {template === "buildings" ? rows.length : "—"}</li>
                <li>Units: {template === "units" ? rows.length : "—"}</li>
                <li>Leases: {template === "leases" ? rows.length : "—"}</li>
              </ul>
              <Button size="sm" onClick={handleCommit}>Mock commit</Button>
            </div>
          )}

          {wizardStep === "commit" && committed && (
            <Badge variant="default">
              <Upload className="mr-1 h-3 w-3" />
              {rows.length} records merged into mock store (demo)
            </Badge>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {steps.map((step) => (
          <Card key={`${step.source}-${step.target}`}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">{step.target}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      step.status === "Mapped"
                        ? "default"
                        : step.status === "In Progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {step.status}
                  </Badge>
                  <AiActionButton
                    label="Map"
                    size="sm"
                    onClick={() => handleAiMapping(step.target)}
                  />
                </div>
              </div>
              <CardDescription>{step.records}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
                {step.source}
              </span>
              <ArrowRight className="h-4 w-4" />
              <span className="rounded bg-blue-50 px-2 py-1 font-mono text-xs text-blue-700">
                Manzel
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <ContractPreviewDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        contractText={aiText}
      />
    </PageShell>
  );
}
