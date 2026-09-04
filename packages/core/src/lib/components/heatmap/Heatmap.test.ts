import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Heatmap from './Heatmap.svelte';

const data = [
	{ x: 'Mon', y: 'wk1', value: 1 },
	{ x: 'Mon', y: 'wk2', value: 5 },
	{ x: 'Tue', y: 'wk1', value: 3 }
];

describe('Heatmap', () => {
	it('renders a cell per data point with an accessible label', () => {
		render(Heatmap, { data });
		expect(screen.getByRole('img', { name: 'Mon, wk1: 1' })).toBeInTheDocument();
		expect(screen.getByRole('img', { name: 'Mon, wk2: 5' })).toBeInTheDocument();
		expect(screen.getByRole('img', { name: 'Tue, wk1: 3' })).toBeInTheDocument();
	});

	it('infers x and y labels from the data', () => {
		render(Heatmap, { data });
		expect(screen.getByText('Mon')).toBeInTheDocument();
		expect(screen.getByText('Tue')).toBeInTheDocument();
		expect(screen.getByText('wk1')).toBeInTheDocument();
		expect(screen.getByText('wk2')).toBeInTheDocument();
	});

	it('renders explicit xLabels and yLabels when provided', () => {
		render(Heatmap, { data, xLabels: ['Mon', 'Tue'], yLabels: ['wk1', 'wk2'] });
		expect(screen.getByText('Mon')).toBeInTheDocument();
		expect(screen.getByText('Tue')).toBeInTheDocument();
		expect(screen.getByText('wk1')).toBeInTheDocument();
		expect(screen.getByText('wk2')).toBeInTheDocument();
	});

	it('applies a background color per value', () => {
		const { container } = render(Heatmap, { data });
		const cells = container.querySelectorAll('[role="img"]');
		expect(cells.length).toBe(3);
		const colors = Array.from(cells).map((c) => c.getAttribute('style'));
		// All three cells carry a background-color style.
		colors.forEach((c) => expect(c).toMatch(/^background-color: rgb\(/));
	});

	it('uses the max value color when all values are equal', () => {
		const { container } = render(Heatmap, { data: [{ x: 'a', y: 'b', value: 4 }] });
		const cell = container.querySelector('[role="img"]');
		expect(cell?.getAttribute('style')).toBe('background-color: rgb(33, 110, 57);');
	});

	it('renders cells with no data without a role or color', () => {
		const { container } = render(Heatmap, {
			data: [{ x: 'Mon', y: 'wk1', value: 2 }],
			xLabels: ['Mon', 'Tue'],
			yLabels: ['wk1', 'wk2']
		});
		// A cell with no data gets no role/style, whereas the parent row still
		// wraps the empty slots in plain divs.
		expect(container.querySelectorAll('[role="img"]').length).toBe(1);
		expect(container.querySelectorAll('div[class*="rounded-[4px]"]').length).toBe(4);
	});

	it('shows a legend when values exist and showLegend is true', () => {
		render(Heatmap, { data });
		expect(screen.getByText('Less')).toBeInTheDocument();
		expect(screen.getByText('More')).toBeInTheDocument();
	});

	it('hides the legend when showLegend is false', () => {
		render(Heatmap, { data, showLegend: false });
		expect(screen.queryByText('Less')).not.toBeInTheDocument();
		expect(screen.queryByText('More')).not.toBeInTheDocument();
	});
});
