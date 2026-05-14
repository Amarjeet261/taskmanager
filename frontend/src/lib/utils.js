import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes with clsx and twMerge.
 * Prevents class conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
