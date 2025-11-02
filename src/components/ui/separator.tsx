<<<<<<< HEAD
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as React from 'react';

import { cn } from '@/lib/utils';
=======
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
<<<<<<< HEAD
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
=======
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
<<<<<<< HEAD
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    )}
=======
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
