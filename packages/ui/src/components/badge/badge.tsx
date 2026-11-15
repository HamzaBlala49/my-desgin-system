import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-badge border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        neutral:
          "border-badge-neutral-border bg-badge-neutral-background text-badge-neutral-foreground",
        primary:
          "border-badge-primary-border bg-badge-primary-background text-badge-primary-foreground",
        success:
          "border-badge-success-border bg-badge-success-background text-badge-success-foreground",
        warning:
          "border-badge-warning-border bg-badge-warning-background text-badge-warning-foreground",
        danger:
          "border-badge-danger-border bg-badge-danger-background text-badge-danger-foreground",
        outline:
          "border-badge-outline-border bg-badge-outline-background text-badge-outline-foreground",
      },
      size: {
        sm: "px-2 py-0 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant,
  size,
  ...props
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

Badge.displayName = "Badge";

export { Badge, badgeVariants };
