<<<<<<< HEAD
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn } from '@/lib/utils';
=======
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
<<<<<<< HEAD
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
=======
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
<<<<<<< HEAD
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
=======
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
<<<<<<< HEAD
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
=======
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
