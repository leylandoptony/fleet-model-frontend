import * as React from "react";
import { cn } from "../../lib/utils";
import { LoaderIcon } from "lucide-react";

const spinnerVariants = "w-8 h-8 rounded-full animate-spin";


const LoadingSpinner = React.forwardRef(
  (props, ref) => {
    const { className, ...rest } = props;
    return (
      <LoaderIcon
        ref={ref}
        className={cn(spinnerVariants, className)}
        {...rest}
      />
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;