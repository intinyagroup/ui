import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../utils.js';

export const badgeVariants = tv({
  base: 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ui-ring)] focus:ring-offset-2',
  variants: {
    variant: {
      default: 'border-transparent bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow hover:bg-[var(--ui-primary)]/80',
      secondary: 'border-transparent bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)] hover:bg-[var(--ui-secondary)]/80',
      destructive: 'border-transparent bg-[var(--ui-destructive)] text-[var(--ui-destructive-foreground)] shadow hover:bg-[var(--ui-destructive)]/80',
      outline: 'text-[var(--ui-foreground)]'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
