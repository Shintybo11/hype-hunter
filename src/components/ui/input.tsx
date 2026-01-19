import * as React from 'react';
import { cn } from '@/lib/utils/cn';

// ============================================================================
// Types
// ============================================================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

// ============================================================================
// Component
// ============================================================================

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-zinc-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:bg-zinc-950 dark:placeholder:text-zinc-500',
            error
              ? 'border-red-500 focus-visible:ring-red-400'
              : 'border-zinc-200 dark:border-zinc-800',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ============================================================================
// Textarea
// ============================================================================

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm',
            'placeholder:text-zinc-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:bg-zinc-950 dark:placeholder:text-zinc-500',
            error
              ? 'border-red-500 focus-visible:ring-red-400'
              : 'border-zinc-200 dark:border-zinc-800',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ============================================================================
// Label
// ============================================================================

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Input, Textarea, Label };
