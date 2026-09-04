import * as React from 'react';
import { Menu as ArkMenu } from '@ark-ui/react/menu';
import { Portal } from '@ark-ui/react/portal';
import { cn } from '../utils.js';

export const DropdownMenuRoot = ArkMenu.Root;
export const DropdownMenuTrigger = ArkMenu.Trigger;

export const DropdownMenuPositioner = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkMenu.Positioner>>(
  ({ className, ...props }, ref) => (
    <ArkMenu.Positioner ref={ref} className={cn('z-50', className)} {...props} />
  )
);
DropdownMenuPositioner.displayName = 'DropdownMenuPositioner';

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkMenu.Content>>(
  ({ className, ...props }, ref) => (
    <ArkMenu.Content
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-popover)] p-1 text-[var(--ui-popover-foreground)] shadow-md animate-in fade-in-80',
        className
      )}
      {...props}
    />
  )
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkMenu.Item>>(
  ({ className, ...props }, ref) => (
    <ArkMenu.Item
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-foreground)] data-[highlighted]:bg-[var(--ui-accent)] data-[highlighted]:text-[var(--ui-accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuSeparator = React.forwardRef<HTMLHRElement, React.ComponentPropsWithoutRef<typeof ArkMenu.Separator>>(
  ({ className, ...props }, ref) => (
    <ArkMenu.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-[var(--ui-muted)]', className)} {...props} />
  )
);
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Positioner: DropdownMenuPositioner,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Portal
};
