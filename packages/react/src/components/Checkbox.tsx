import * as React from 'react';
import { Checkbox as ArkCheckbox } from '@ark-ui/react/checkbox';
import { Check } from 'lucide-react';
import { cn } from '../utils.js';

export const CheckboxRoot = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<typeof ArkCheckbox.Root>>(
  ({ className, ...props }, ref) => (
    <ArkCheckbox.Root
      ref={ref}
      className={cn('inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...props}
    />
  )
);
CheckboxRoot.displayName = 'CheckboxRoot';

export const CheckboxControl = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkCheckbox.Control>>(
  ({ className, children, ...props }, ref) => (
    <ArkCheckbox.Control
      ref={ref}
      className={cn(
        'size-4 shrink-0 rounded-[calc(var(--ui-radius)-4px)] border border-[var(--ui-primary)] shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ui-ring)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--ui-primary)] data-[state=checked]:text-[var(--ui-primary-foreground)] flex items-center justify-center transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </ArkCheckbox.Control>
  )
);
CheckboxControl.displayName = 'CheckboxControl';

export const CheckboxIndicator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkCheckbox.Indicator>>(
  ({ className, children, ...props }, ref) => (
    <ArkCheckbox.Indicator
      ref={ref}
      className={cn('flex items-center justify-center text-current', className)}
      {...props}
    >
      {children ?? <Check className="size-3.5 stroke-[2.5]" />}
    </ArkCheckbox.Indicator>
  )
);
CheckboxIndicator.displayName = 'CheckboxIndicator';

export const CheckboxLabel = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<typeof ArkCheckbox.Label>>(
  ({ className, ...props }, ref) => (
    <ArkCheckbox.Label
      ref={ref}
      className={cn('text-sm font-medium leading-none select-none text-[var(--ui-foreground)]', className)}
      {...props}
    />
  )
);
CheckboxLabel.displayName = 'CheckboxLabel';

export const CheckboxHiddenInput = ArkCheckbox.HiddenInput;

export const Checkbox = {
  Root: CheckboxRoot,
  Control: CheckboxControl,
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
  HiddenInput: CheckboxHiddenInput
};
