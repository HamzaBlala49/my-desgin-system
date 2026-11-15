import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-button whitespace-nowrap",
    "text-sm font-medium transition-colors",
    "focus-visible:ring-2 focus-visible:ring-button-focus-ring focus-visible:outline-none",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "border border-button-primary-border bg-button-primary-background text-button-primary-foreground hover:bg-button-primary-background-hover",
        secondary:
          "border border-button-secondary-border bg-button-secondary-background text-button-secondary-foreground hover:bg-button-secondary-background-hover",
        outline:
          "border border-button-outline-border bg-button-outline-background text-button-outline-foreground hover:bg-button-outline-background-hover",
        ghost:
          "border border-button-ghost-border bg-button-ghost-background text-button-ghost-foreground hover:bg-button-ghost-background-hover",
        destructive:
          "border border-button-destructive-border bg-button-destructive-background text-button-destructive-foreground hover:bg-button-destructive-background-hover",
        link: "bg-transparent text-button-link-foreground underline-offset-4 hover:underline",
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
