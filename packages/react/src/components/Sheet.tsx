import * as React from 'react';
import { Dialog as ArkDialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { cn } from '../utils.js';
import { X } from 'lucide-react';
import { tv, type VariantProps } from 'tailwind-variants';

export const sheetVariants = tv({
  base: 'fixed z-50 gap-4 bg-[var(--ui-background)] p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  variants: {
    side: {
      top: 'inset-x-0 top-0 border-b border-[var(--ui-border)] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
      bottom: 'inset-x-0 bottom-0 border-t border-[var(--ui-border)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
      left: 'inset-y-0 left-0 h-full w-3/4 border-r border-[var(--ui-border)] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
      right: 'inset-y-0 right-0 h-full w-3/4 border-l border-[var(--ui-border)] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm'
    }
  },
  defaultVariants: {
    side: 'right'
  }
});

export const SheetRoot = ArkDialog.Root;
export const SheetTrigger = ArkDialog.Trigger;
export const SheetCloseTrigger = ArkDialog.CloseTrigger;
export const SheetPortal = Portal;

export const SheetBackdrop = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Backdrop>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Backdrop
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)}
      {...props}
    />
  )
);
SheetBackdrop.displayName = 'SheetBackdrop';

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof ArkDialog.Content>,
    VariantProps<typeof sheetVariants> {}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => (
    <ArkDialog.Positioner className="fixed inset-0 z-50 flex">
      <ArkDialog.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <ArkDialog.CloseTrigger className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </ArkDialog.CloseTrigger>
      </ArkDialog.Content>
    </ArkDialog.Positioner>
  )
);
SheetContent.displayName = 'SheetContent';

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
SheetFooter.displayName = 'SheetFooter';

export const SheetTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Title>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Title
      ref={ref}
      className={cn('text-lg font-semibold text-[var(--ui-foreground)]', className)}
      {...props}
    />
  )
);
SheetTitle.displayName = 'SheetTitle';

export const SheetDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof ArkDialog.Description>>(
  ({ className, ...props }, ref) => (
    <ArkDialog.Description
      ref={ref}
      className={cn('text-sm text-[var(--ui-muted-foreground)]', className)}
      {...props}
    />
  )
);
SheetDescription.displayName = 'SheetDescription';

export const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  CloseTrigger: SheetCloseTrigger,
  Portal: SheetPortal,
  Backdrop: SheetBackdrop,
  Content: SheetContent,
  Header: SheetHeader,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription
};
