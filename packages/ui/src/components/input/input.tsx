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
        "flex h-10 w-full rounded-md border border-stroke-default bg-surface-canvas px-3 py-2 text-sm text-content-primary shadow-xs transition-colors",
        "placeholder:text-content-secondary",
        "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-content-primary",
        invalid && "border-danger focus-visible:ring-danger",
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
