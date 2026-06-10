"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Shared horizontal inset for all form drawer sections (header, body, footer). */
export const FORM_SHEET_INSET = "px-6";

const SIZE_CLASSES = {
  default: "sm:max-w-xl lg:max-w-2xl",
  wide: "sm:max-w-2xl lg:max-w-3xl",
  full: "sm:max-w-3xl lg:max-w-[min(56rem,90vw)]",
} as const;

interface FormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  loading?: boolean;
  size?: keyof typeof SIZE_CLASSES;
  footer?: React.ReactNode;
  hideDefaultFooter?: boolean;
}

export function FormSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Save",
  loading = false,
  size = "default",
  footer,
  hideDefaultFooter = false,
}: FormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn("flex w-full flex-col gap-0 p-0", SIZE_CLASSES[size])}
      >
        <SheetHeader
          className={cn(
            "shrink-0 border-b border-border pb-4 pt-5 pr-12",
            FORM_SHEET_INSET
          )}
        >
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className={cn("space-y-4 py-5", FORM_SHEET_INSET)}>{children}</div>
        </div>

        {footer !== undefined ? (
          <div
            className={cn(
              "mt-auto shrink-0 border-t border-border py-4",
              FORM_SHEET_INSET
            )}
          >
            {footer}
          </div>
        ) : (
          !hideDefaultFooter &&
          onSubmit && (
            <div
              className={cn(
                "mt-auto shrink-0 border-t border-border py-4",
                FORM_SHEET_INSET
              )}
            >
              <div className="flex flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={onSubmit} disabled={loading}>
                  {submitLabel}
                </Button>
              </div>
            </div>
          )
        )}
      </SheetContent>
    </Sheet>
  );
}
