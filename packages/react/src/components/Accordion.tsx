import * as React from 'react';
import { Accordion as ArkAccordion } from '@ark-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils.js';

export const AccordionRoot = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkAccordion.Root>>(
  ({ className, ...props }, ref) => (
    <ArkAccordion.Root
      ref={ref}
      className={cn('w-full divide-y divide-[var(--ui-border)]', className)}
      {...props}
    />
  )
);
AccordionRoot.displayName = 'AccordionRoot';

export const AccordionItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkAccordion.Item>>(
  ({ className, ...props }, ref) => (
    <ArkAccordion.Item
      ref={ref}
      className={cn('border-b border-[var(--ui-border)]', className)}
      {...props}
    />
  )
);
AccordionItem.displayName = 'AccordionItem';

export const AccordionItemTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof ArkAccordion.ItemTrigger>>(
  ({ className, children, ...props }, ref) => (
    <ArkAccordion.ItemTrigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-[var(--ui-foreground)] [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 transition-transform duration-200 text-[var(--ui-muted-foreground)]" />
    </ArkAccordion.ItemTrigger>
  )
);
AccordionItemTrigger.displayName = 'AccordionItemTrigger';

export const AccordionItemContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ArkAccordion.ItemContent>>(
  ({ className, children, ...props }, ref) => (
    <ArkAccordion.ItemContent
      ref={ref}
      className={cn(
        'overflow-hidden text-sm text-[var(--ui-muted-foreground)] pb-4 pt-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className
      )}
      {...props}
    >
      {children}
    </ArkAccordion.ItemContent>
  )
);
AccordionItemContent.displayName = 'AccordionItemContent';

export const AccordionItemIndicator = ArkAccordion.ItemIndicator;

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  ItemTrigger: AccordionItemTrigger,
  ItemContent: AccordionItemContent,
  ItemIndicator: AccordionItemIndicator
};
