"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { getLocaleByEntityId } from "@/lib/locale/resolver";
import type { Invoice } from "@/types/invoice";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice & { tenantName?: string; unitLabel?: string };
}

export function InvoicePreviewDialog({ open, onOpenChange, invoice }: Props) {
  const locale = getLocaleByEntityId(invoice.entityId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tax Invoice Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold">{locale.company.name}</p>
            <p className="text-muted-foreground">TRN: {locale.company.vatNumber}</p>
            <p className="text-muted-foreground">{locale.company.address}</p>
          </div>
          <div className="border-t border-border pt-3">
            <p>Invoice: <span className="font-mono">{invoice.id}</span></p>
            <p>Due: {invoice.dueDate}</p>
            {invoice.unitLabel && <p>Unit: {invoice.unitLabel}</p>}
          </div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-1">Rent (excl. VAT)</td>
                <td className="py-1 text-right"><CurrencyDisplay amount={invoice.amount} /></td>
              </tr>
              <tr>
                <td className="py-1">VAT ({locale.vatRate * 100}%)</td>
                <td className="py-1 text-right"><CurrencyDisplay amount={invoice.vatAmount} /></td>
              </tr>
              <tr className="border-t border-border font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right"><CurrencyDisplay amount={invoice.totalAmount} /></td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground">
            Kingdom of Bahrain — VAT compliant invoice (mock preview)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
