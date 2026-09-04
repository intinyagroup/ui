import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../utils.js';

export const buttonVariants = tv({
  base: 'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--ui-radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ui-ring)] disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow hover:bg-[var(--ui-primary)]/90',
      destructive: 'bg-[var(--ui-destructive)] text-[var(--ui-destructive-foreground)] shadow-sm hover:bg-[var(--ui-destructive)]/90',
      outline: 'border border-[var(--ui-input)] bg-[var(--ui-background)] shadow-sm hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-foreground)]',
      secondary: 'bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)] shadow-sm hover:bg-[var(--ui-secondary)]/80',
      ghost: 'hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-foreground)]',
      link: 'text-[var(--ui-primary)] underline-offset-4 hover:underline'
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-[var(--ui-radius)] px-3 text-xs',
      lg: 'h-10 rounded-[var(--ui-radius)] px-8',
      icon: 'size-9'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
