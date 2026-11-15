import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    className={cn(
      "peer size-4 shrink-0 rounded-checkbox border border-checkbox-border bg-checkbox-background shadow-xs",
      "focus-visible:ring-2 focus-visible:ring-checkbox-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-checkbox-checked-background data-[state=checked]:bg-checkbox-checked-background data-[state=checked]:text-checkbox-checked-foreground",
      "data-[state=indeterminate]:border-checkbox-checked-background data-[state=indeterminate]:bg-checkbox-checked-background data-[state=indeterminate]:text-checkbox-checked-foreground",
      className,
    )}
    ref={ref}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
