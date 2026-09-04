import * as React from 'react';
import { Tabs as ArkTabs } from '@ark-ui/react/tabs';
import { cn } from '../utils.js';

export const TabsRoot = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkTabs.Root>>(
  ({ className, ...props }, ref) => (
    <ArkTabs.Root
      ref={ref}
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
);
TabsRoot.displayName = 'TabsRoot';

export const TabsList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkTabs.List>>(
  ({ className, ...props }, ref) => (
    <ArkTabs.List
      ref={ref}
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-[var(--ui-radius)] bg-[var(--ui-muted)] p-1 text-[var(--ui-muted-foreground)] relative',
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof ArkTabs.Trigger>>(
  ({ className, ...props }, ref) => (
    <ArkTabs.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-[calc(var(--ui-radius)-4px)] px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-[var(--ui-background)] data-[selected]:text-[var(--ui-foreground)] data-[selected]:shadow-sm cursor-pointer',
        className
      )}
      {...props}
    />
  )
);
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkTabs.Content>>(
  ({ className, ...props }, ref) => (
    <ArkTabs.Content
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)] focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  )
);
TabsContent.displayName = 'TabsContent';

export const TabsIndicator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkTabs.Indicator>>(
  ({ className, ...props }, ref) => (
    <ArkTabs.Indicator
      ref={ref}
      className={cn('bg-[var(--ui-background)] rounded-[calc(var(--ui-radius)-4px)] shadow-sm', className)}
      {...props}
    />
  )
);
TabsIndicator.displayName = 'TabsIndicator';

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  Indicator: TabsIndicator
};
