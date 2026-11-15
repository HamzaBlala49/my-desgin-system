import * as React from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", invalid = false, ...props }, ref) => (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "flex h-10 w-full rounded-input border border-input-border bg-input-background px-3 py-2 text-sm text-input-foreground shadow-xs transition-colors",
        "placeholder:text-input-placeholder",
        "focus-visible:ring-2 focus-visible:ring-input-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-input-foreground",
        invalid &&
          "border-input-border-invalid focus-visible:ring-input-border-invalid",
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export { Input };
