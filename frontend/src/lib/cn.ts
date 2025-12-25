/**
 * Utility function for conditional and merged class names.
 *
 * This uses `clsx` for conditionals and `twMerge` for Tailwind class deduplication and merging.
 * Use this function to compose className props in React components.
 *
 * @param {...ClassValue[]} inputs - Class names, objects, or arrays to be merged.
 * @returns {string} - The merged className string.
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names conditionally, with Tailwind merge.
 *
 * @param {...ClassValue[]} inputs
 * @returns {string}
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(...inputs));
}
