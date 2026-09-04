import * as React from 'react';
import { Select as ArkSelect, createListCollection } from '@ark-ui/react/select';
import { Portal } from '@ark-ui/react/portal';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../utils.js';

export { createListCollection };

export const SelectRoot = ArkSelect.Root;
export const SelectLabel = ArkSelect.Label;
export const SelectControl = ArkSelect.Control;
export const SelectClearTrigger = ArkSelect.ClearTrigger;

export const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof ArkSelect.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <ArkSelect.Trigger
      ref={ref}
      className={cn(
        'flex h-9 w-full items-center justify-between rounded-[var(--ui-radius)] border border-[var(--ui-input)] bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-[var(--ui-muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ui-ring)] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 opacity-50" />
    </ArkSelect.Trigger>
  )
);
SelectTrigger.displayName = 'SelectTrigger';

export const SelectValueText = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<typeof ArkSelect.ValueText>>(
  ({ className, ...props }, ref) => (
    <ArkSelect.ValueText ref={ref} className={cn('line-clamp-1', className)} {...props} />
  )
);
SelectValueText.displayName = 'SelectValueText';

export const SelectPositioner = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkSelect.Positioner>>(
  ({ className, ...props }, ref) => (
    <ArkSelect.Positioner ref={ref} className={cn('z-50', className)} {...props} />
  )
);
SelectPositioner.displayName = 'SelectPositioner';

export const SelectContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkSelect.Content>>(
  ({ className, ...props }, ref) => (
    <ArkSelect.Content
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-popover)] p-1 text-[var(--ui-popover-foreground)] shadow-md animate-in fade-in-80',
        className
      )}
      {...props}
    />
  )
);
SelectContent.displayName = 'SelectContent';

export const SelectItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkSelect.Item>>(
  ({ className, children, ...props }, ref) => (
    <ArkSelect.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[highlighted]:bg-[var(--ui-accent)] data-[highlighted]:text-[var(--ui-accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <ArkSelect.ItemText>{children}</ArkSelect.ItemText>
      <ArkSelect.ItemIndicator className="absolute right-2 flex size-3.5 items-center justify-center">
        <Check className="size-4" />
      </ArkSelect.ItemIndicator>
    </ArkSelect.Item>
  )
);
SelectItem.displayName = 'SelectItem';

export const Select = {
  Root: SelectRoot,
  Control: SelectControl,
  Trigger: SelectTrigger,
  ValueText: SelectValueText,
  Positioner: SelectPositioner,
  Content: SelectContent,
  Item: SelectItem,
  Label: SelectLabel,
  ClearTrigger: SelectClearTrigger,
  Portal
};
