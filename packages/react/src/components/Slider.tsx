import * as React from 'react';
import { Slider as ArkSlider } from '@ark-ui/react/slider';
import { cn } from '../utils.js';

export const SliderRoot = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkSlider.Root>>(
  ({ className, ...props }, ref) => (
    <ArkSlider.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    />
  )
);
SliderRoot.displayName = 'SliderRoot';

export const SliderControl = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkSlider.Control>>(
  ({ className, ...props }, ref) => (
    <ArkSlider.Control
      ref={ref}
      className={cn('relative flex w-full items-center', className)}
      {...props}
    />
  )
);
SliderControl.displayName = 'SliderControl';

export const SliderTrack = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkSlider.Track>>(
  ({ className, ...props }, ref) => (
    <ArkSlider.Track
      ref={ref}
      className={cn('relative h-1.5 w-full grow overflow-hidden rounded-full bg-[var(--ui-muted)]', className)}
      {...props}
    />
  )
);
SliderTrack.displayName = 'SliderTrack';

export const SliderRange = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkSlider.Range>>(
  ({ className, ...props }, ref) => (
    <ArkSlider.Range
      ref={ref}
      className={cn('absolute h-full bg-[var(--ui-primary)]', className)}
      {...props}
    />
  )
);
SliderRange.displayName = 'SliderRange';

export const SliderThumb = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkSlider.Thumb>>(
  ({ className, ...props }, ref) => (
    <ArkSlider.Thumb
      ref={ref}
      className={cn(
        'block size-4 rounded-full border border-[var(--ui-primary)]/50 bg-[var(--ui-background)] shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ui-ring)] disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);
SliderThumb.displayName = 'SliderThumb';

export const SliderLabel = ArkSlider.Label;
export const SliderValueText = ArkSlider.ValueText;
export const SliderHiddenInput = ArkSlider.HiddenInput;

export const Slider = {
  Root: SliderRoot,
  Control: SliderControl,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
  Label: SliderLabel,
  ValueText: SliderValueText,
  HiddenInput: SliderHiddenInput
};
