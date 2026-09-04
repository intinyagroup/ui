import * as React from 'react';
import { Tooltip as ArkTooltip } from '@ark-ui/react/tooltip';
import { Portal } from '@ark-ui/react/portal';
import { cn } from '../utils.js';

export const TooltipRoot = ArkTooltip.Root;
export const TooltipTrigger = ArkTooltip.Trigger;

export const TooltipPositioner = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkTooltip.Positioner>>(
  ({ className, ...props }, ref) => (
    <ArkTooltip.Positioner ref={ref} className={cn('z-50', className)} {...props} />
  )
);
TooltipPositioner.displayName = 'TooltipPositioner';

export const TooltipContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkTooltip.Content>>(
  ({ className, ...props }, ref) => (
    <ArkTooltip.Content
      ref={ref}
      className={cn(
        'z-50 overflow-hidden rounded-[var(--ui-radius)] bg-[var(--ui-primary)] px-3 py-1.5 text-xs text-[var(--ui-primary-foreground)] shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className
      )}
      {...props}
    />
  )
);
TooltipContent.displayName = 'TooltipContent';

export const TooltipArrow = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkTooltip.Arrow>>(
  ({ className, ...props }, ref) => (
    <ArkTooltip.Arrow ref={ref} className={cn('fill-[var(--ui-primary)]', className)} {...props}>
      <ArkTooltip.ArrowTip />
    </ArkTooltip.Arrow>
  )
);
TooltipArrow.displayName = 'TooltipArrow';

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Positioner: TooltipPositioner,
  Content: TooltipContent,
  Arrow: TooltipArrow
};
