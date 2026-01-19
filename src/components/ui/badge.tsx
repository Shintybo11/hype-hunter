import * as React from 'react';
import { cn } from '@/lib/utils/cn';

// ============================================================================
// Badge Variants
// ============================================================================

const badgeVariants = {
  default: 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900',
  secondary: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
  outline: 'border border-zinc-200 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100',
  destructive: 'bg-red-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  // Hype score variants
  extreme: 'bg-red-600 text-white animate-pulse',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-zinc-900',
  low: 'bg-blue-500 text-white',
  minimal: 'bg-zinc-400 text-white',
  // Stock status variants
  in_stock: 'bg-green-500 text-white',
  out_of_stock: 'bg-red-500 text-white',
  preorder: 'bg-blue-500 text-white',
  coming_soon: 'bg-yellow-500 text-zinc-900',
};

// ============================================================================
// Types
// ============================================================================

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

// ============================================================================
// Component
// ============================================================================

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
