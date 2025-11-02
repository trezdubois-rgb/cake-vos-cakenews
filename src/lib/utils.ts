<<<<<<< HEAD
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
=======
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
