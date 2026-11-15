import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../../lib/cn";

export interface LabelProps extends React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
> {
  required?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, required = false, ...props }, ref) => (
  <LabelPrimitive.Root
    className={cn(
      "text-sm leading-none font-medium text-content-primary",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  >
    {children}
    {required ? (
      <span aria-hidden="true" className="ms-1 text-danger-text">
        *
      </span>
    ) : null}
  </LabelPrimitive.Root>
));

Label.displayName = "Label";

export { Label };
