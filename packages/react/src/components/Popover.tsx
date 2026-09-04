import * as React from 'react';
import { Popover as ArkPopover } from '@ark-ui/react/popover';
import { Portal } from '@ark-ui/react/portal';
import { X } from 'lucide-react';
import { cn } from '../utils.js';

export const PopoverRoot = ArkPopover.Root;
export const PopoverTrigger = ArkPopover.Trigger;

export const PopoverPositioner = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkPopover.Positioner>>(
  ({ className, ...props }, ref) => (
    <ArkPopover.Positioner ref={ref} className={cn('z-50', className)} {...props} />
  )
);
PopoverPositioner.displayName = 'PopoverPositioner';

export const PopoverContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkPopover.Content>>(
  ({ className, ...props }, ref) => (
    <ArkPopover.Content
      ref={ref}
      className={cn(
        'relative z-50 w-72 rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-popover)] p-4 text-[var(--ui-popover-foreground)] shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className
      )}
      {...props}
    />
  )
);
PopoverContent.displayName = 'PopoverContent';

export const PopoverTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof ArkPopover.Title>>(
  ({ className, ...props }, ref) => (
    <ArkPopover.Title
      ref={ref}
      className={cn('font-medium leading-none tracking-tight text-[var(--ui-foreground)]', className)}
      {...props}
    />
  )
);
PopoverTitle.displayName = 'PopoverTitle';

export const PopoverDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof ArkPopover.Description>>(
  ({ className, ...props }, ref) => (
    <ArkPopover.Description
      ref={ref}
      className={cn('text-sm text-[var(--ui-muted-foreground)]', className)}
      {...props}
    />
  )
);
PopoverDescription.displayName = 'PopoverDescription';

export const PopoverCloseTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof ArkPopover.CloseTrigger>>(
  ({ className, children, ...props }, ref) => (
    <ArkPopover.CloseTrigger
      ref={ref}
      className={cn(
        'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--ui-ring)] focus:ring-offset-2 disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      {children ?? <X className="size-4" />}
      <span className="sr-only">Close</span>
    </ArkPopover.CloseTrigger>
  )
);
PopoverCloseTrigger.displayName = 'PopoverCloseTrigger';

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Positioner: PopoverPositioner,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  CloseTrigger: PopoverCloseTrigger
};
