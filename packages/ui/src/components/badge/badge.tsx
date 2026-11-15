import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        neutral:
          "border-stroke-subtle bg-surface-subtle text-content-secondary",
        primary: "border-transparent bg-accent text-accent-contrast",
        success: "border-transparent bg-success text-success-contrast",
        warning: "border-transparent bg-warning text-warning-contrast",
        danger: "border-transparent bg-danger text-danger-contrast",
        outline: "border-stroke-default bg-transparent text-content-primary",
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
