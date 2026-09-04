import * as React from 'react';
import { Switch as ArkSwitch } from '@ark-ui/react/switch';
import { cn } from '../utils.js';

export const SwitchRoot = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<typeof ArkSwitch.Root>>(
  ({ className, ...props }, ref) => (
    <ArkSwitch.Root
      ref={ref}
      className={cn('inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...props}
    />
  )
);
SwitchRoot.displayName = 'SwitchRoot';

export const SwitchControl = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<typeof ArkSwitch.Control>>(
  ({ className, ...props }, ref) => (
    <ArkSwitch.Control
      ref={ref}
      className={cn(
        'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-background)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--ui-primary)] data-[state=unchecked]:bg-[var(--ui-input)]',
        className
      )}
      {...props}
    />
  )
);
SwitchControl.displayName = 'SwitchControl';

export const SwitchThumb = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<typeof ArkSwitch.Thumb>>(
  ({ className, ...props }, ref) => (
    <ArkSwitch.Thumb
      ref={ref}
      className={cn(
        'pointer-events-none block size-4 rounded-full bg-[var(--ui-background)] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        className
      )}
      {...props}
    />
  )
);
SwitchThumb.displayName = 'SwitchThumb';

export const SwitchLabel = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<typeof ArkSwitch.Label>>(
  ({ className, ...props }, ref) => (
    <ArkSwitch.Label
      ref={ref}
      className={cn('text-sm font-medium leading-none select-none text-[var(--ui-foreground)]', className)}
      {...props}
    />
  )
);
SwitchLabel.displayName = 'SwitchLabel';

export const SwitchHiddenInput = ArkSwitch.HiddenInput;

export const Switch = {
  Root: SwitchRoot,
  Control: SwitchControl,
  Thumb: SwitchThumb,
  Label: SwitchLabel,
  HiddenInput: SwitchHiddenInput
};
