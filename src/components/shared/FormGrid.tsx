import { cn } from "@/lib/utils";

interface FormGridProps {
  children: React.ReactNode;
  className?: string;
}

export function FormGrid({ children, className }: FormGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      {children}
    </div>
  );
}

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
  span?: "full";
}

export function FormField({ children, className, span }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", span === "full" && "sm:col-span-2", className)}>
      {children}
    </div>
  );
}
