import * as React from 'react';
import { Dialog as ArkDialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { cn } from '../utils.js';
import { buttonVariants } from './Button.js';

export const AlertDialogRoot = ArkDialog.Root;
export const AlertDialogTrigger = ArkDialog.Trigger;
export const AlertDialogPortal = Portal;

export const AlertDialogBackdrop = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Backdrop>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Backdrop
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)}
      {...props}
    />
  )
);
AlertDialogBackdrop.displayName = 'AlertDialogBackdrop';

export const AlertDialogPositioner = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Positioner>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Positioner
      ref={ref}
      className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}
      {...props}
    />
  )
);
AlertDialogPositioner.displayName = 'AlertDialogPositioner';

export const AlertDialogContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Content>>(
  ({ className, children, ...props }, ref) => (
    <ArkDialog.Content
      ref={ref}
      role="alertdialog"
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
AlertDialogContent.displayName = 'AlertDialogContent';

export const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

export const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

export const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Title>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Title
      ref={ref}
      className={cn('text-lg font-semibold text-[var(--ui-foreground)]', className)}
      {...props}
    />
  )
);
AlertDialogTitle.displayName = 'AlertDialogTitle';

export const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Description>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Description
      ref={ref}
      className={cn('text-sm text-[var(--ui-muted-foreground)]', className)}
      {...props}
    />
  )
);
AlertDialogDescription.displayName = 'AlertDialogDescription';

export const AlertDialogAction = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof ArkDialog.CloseTrigger>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.CloseTrigger
      ref={ref}
      className={cn(buttonVariants({ variant: 'default' }), className)}
      {...props}
    />
  )
);
AlertDialogAction.displayName = 'AlertDialogAction';

export const AlertDialogCancel = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof ArkDialog.CloseTrigger>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.CloseTrigger
      ref={ref}
      className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
      {...props}
    />
  )
);
AlertDialogCancel.displayName = 'AlertDialogCancel';

export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Backdrop: AlertDialogBackdrop,
  Positioner: AlertDialogPositioner,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel
};
