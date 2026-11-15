import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap",
    "text-sm font-medium transition-colors",
    "focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-contrast hover:bg-accent-hover",
        secondary:
          "border border-stroke-default bg-surface-raised text-content-primary hover:bg-surface-hover",
        outline:
          "border border-stroke-default bg-transparent text-content-primary hover:bg-surface-subtle",
        ghost: "bg-transparent text-content-primary hover:bg-surface-subtle",
        destructive: "bg-danger text-danger-contrast hover:bg-danger-hover",
        link: "bg-transparent text-accent-text underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-md",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled ?? isLoading;
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild) {
      return (
        <Slot
          aria-busy={isLoading || undefined}
          className={classes}
          ref={ref}
          {...props}
          {...(isDisabled ? { disabled: true } : {})}
        >
          {children}
        </Slot>
      );
    }

    return (
      <>
        <button
          aria-busy={isLoading || undefined}
          className={classes}
          disabled={isDisabled}
          ref={ref}
          type="button"
          {...props}
        >
          {isLoading ? (
            <Loader2 aria-hidden="true" className="animate-spin" />
          ) : null}
          {children}
        </button>
        {isLoading ? (
          <span className="sr-only" role="status">
            Loading
          </span>
        ) : null}
      </>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
