import * as React from 'react';
import { RadioGroup as ArkRadioGroup } from '@ark-ui/react/radio-group';
import { cn } from '../utils.js';

export const RadioGroupRoot = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkRadioGroup.Root>>(
  ({ className, ...props }, ref) => (
    <ArkRadioGroup.Root
      ref={ref}
      className={cn('grid gap-2', className)}
      {...props}
    />
  )
);
RadioGroupRoot.displayName = 'RadioGroupRoot';

export const RadioGroupLabel = ArkRadioGroup.Label;

export const RadioGroupItem = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<typeof ArkRadioGroup.Item>>(
  ({ className, ...props }, ref) => (
    <ArkRadioGroup.Item
      ref={ref}
      className={cn('flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...props}
    />
  )
);
RadioGroupItem.displayName = 'RadioGroupItem';

export const RadioGroupItemControl = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkRadioGroup.ItemControl>>(
  ({ className, children, ...props }, ref) => (
    <ArkRadioGroup.ItemControl
      ref={ref}
      className={cn(
        'aspect-square size-4 rounded-full border border-[var(--ui-primary)] text-[var(--ui-primary)] shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ui-ring)] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center relative data-[state=checked]:border-[var(--ui-primary)]',
        className
      )}
      {...props}
    >
      {children ?? (
        <span className="size-2 rounded-full bg-current hidden data-[state=checked]:block" />
      )}
    </ArkRadioGroup.ItemControl>
  )
);
RadioGroupItemControl.displayName = 'RadioGroupItemControl';

export const RadioGroupItemText = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<typeof ArkRadioGroup.ItemText>>(
  ({ className, ...props }, ref) => (
    <ArkRadioGroup.ItemText
      ref={ref}
      className={cn('text-sm font-medium leading-none select-none text-[var(--ui-foreground)]', className)}
      {...props}
    />
  )
);
RadioGroupItemText.displayName = 'RadioGroupItemText';

export const RadioGroupItemHiddenInput = ArkRadioGroup.ItemHiddenInput;
export const RadioGroupIndicator = ArkRadioGroup.Indicator;

export const RadioGroup = {
  Root: RadioGroupRoot,
  Label: RadioGroupLabel,
  Item: RadioGroupItem,
  ItemControl: RadioGroupItemControl,
  ItemText: RadioGroupItemText,
  ItemHiddenInput: RadioGroupItemHiddenInput,
  Indicator: RadioGroupIndicator
};
