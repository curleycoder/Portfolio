import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        // base structure
        "flex min-h-[140px] w-full rounded-xl border border-input px-3 py-2 text-sm",
        
        // surface
        "bg-background/40 backdrop-blur",
        
        // text
        "text-foreground placeholder:text-muted-foreground/70",
        
        // interaction
        "transition-colors",
        "hover:bg-accent/40",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        
        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        
        className
      )}
      {...props}
    />
  );
});

export { Textarea };