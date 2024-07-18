import * as React from "react"

import { cn } from "../../lib/utils"

const variantClasses = {
  default: "border border-input bg-background",
  blank: "border border-input bg-background w-[80px]",
  filled: "border border-input bg-gray-200",
  table:"focus-visible:ring-1 focus-visible:ring-ring-0 focus-visible:ring-offset-0 border",
  disabled: "border-0 bg-transparent text-muted-foreground focus-visible:ring-0 focus-visible:ring-ring-0 focus-visible:ring-offset-0 pointer-events-none",
};

const Input = React.forwardRef(({ className, type,variant="default" , ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
