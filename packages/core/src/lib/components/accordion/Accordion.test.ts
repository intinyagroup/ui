import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Accordion from './accordion.svelte';
import AccordionItem from './accordion-item.svelte';
import AccordionTrigger from './accordion-trigger.svelte';
import AccordionContent from './accordion-content.svelte';

describe('Accordion', () => {
  it('renders accordion structure properly', () => {
    const { container } = render(Accordion);
    expect(container.querySelector('[data-slot="accordion"]')).toBeInTheDocument();
  });
});
