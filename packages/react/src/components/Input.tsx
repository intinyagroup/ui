import * as React from 'react';
import { cn } from '../utils.js';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-[var(--ui-radius)] border border-[var(--ui-input)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--ui-foreground)] placeholder:text-[var(--ui-muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ui-ring)] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
