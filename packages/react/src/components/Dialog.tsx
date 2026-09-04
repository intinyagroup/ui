import * as React from 'react';
import { Dialog as ArkDialog, type DialogRootProps } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { cn } from '../utils.js';

export const DialogRoot = ArkDialog.Root;
export const DialogTrigger = ArkDialog.Trigger;
export const DialogCloseTrigger = ArkDialog.CloseTrigger;

export const DialogBackdrop = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Backdrop>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Backdrop
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)}
      {...props}
    />
  )
);
DialogBackdrop.displayName = 'DialogBackdrop';

export const DialogPositioner = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Positioner>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Positioner
      ref={ref}
      className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}
      {...props}
    />
  )
);
DialogPositioner.displayName = 'DialogPositioner';

export const DialogContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Content>>(
  ({ className, children, ...props }, ref) => (
    <ArkDialog.Content
      ref={ref}
      className={cn(
        'relative z-50 grid w-full max-w-lg gap-4 border border-[var(--ui-border)] bg-[var(--ui-background)] p-6 shadow-lg duration-200 rounded-[var(--ui-radius)] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </ArkDialog.Content>
  )
);
DialogContent.displayName = 'DialogContent';

export const DialogTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Title>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Title
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-[var(--ui-foreground)]', className)}
      {...props}
    />
  )
);
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Description>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Description
      ref={ref}
      className={cn('text-sm text-[var(--ui-muted-foreground)]', className)}
      {...props}
    />
  )
);
DialogDescription.displayName = 'DialogDescription';

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Backdrop: DialogBackdrop,
  Positioner: DialogPositioner,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  CloseTrigger: DialogCloseTrigger,
  Portal
};
