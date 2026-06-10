"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContractPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractText: string;
}

export function ContractPreviewDialog({
  open,
  onOpenChange,
  contractText,
}: ContractPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI-generated lease draft</DialogTitle>
          <DialogDescription>
            Review with legal counsel before execution.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] rounded border bg-muted/30 p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm">{contractText}</pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
