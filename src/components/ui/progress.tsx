<<<<<<< HEAD
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/lib/utils';
=======
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
<<<<<<< HEAD
    className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
=======
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
<<<<<<< HEAD
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
=======
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
