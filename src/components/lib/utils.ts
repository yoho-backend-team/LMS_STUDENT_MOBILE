import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to conditionally join Tailwind CSS class names
 * Example:
 *   cn("p-2", isActive && "bg-blue-500", "text-white")
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
