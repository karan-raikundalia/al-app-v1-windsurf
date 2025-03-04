
import React from "react";
import { cn } from "@/lib/utils";

interface DataPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function DataPanel({
  title,
  description,
  children,
  className,
  ...props
}: DataPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm animate-scale-in",
        className
      )}
      {...props}
    >
      {title && (
        <div className="mb-4">
          <h3 className="font-medium text-lg">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
