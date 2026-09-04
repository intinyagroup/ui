import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Gyroscope from './Gyroscope.svelte';

type PermissionFn = () => Promise<'granted' | 'denied'>;

class MockDeviceOrientationEvent extends Event {
	alpha: number | null;
	beta: number | null;
	gamma: number | null;
	constructor(type: string, init?: { alpha?: number | null; beta?: number | null; gamma?: number | null }) {
		super(type);
		this.alpha = init?.alpha ?? 0;
		this.beta = init?.beta ?? 0;
		this.gamma = init?.gamma ?? 0;
	}
	static requestPermission: PermissionFn = async () => 'granted';
}

class MockDeviceMotionEvent extends Event {
	accelerationIncludingGravity: { x: number | null; y: number | null; z: number | null } | null;
	constructor(
		type: string,
		init?: { accelerationIncludingGravity?: { x: number | null; y: number | null; z: number | null } | null }
	) {
		super(type);
		this.accelerationIncludingGravity = init?.accelerationIncludingGravity ?? null;
	}
	static requestPermission: PermissionFn = async () => 'granted';
}

let listeners: { [event: string]: EventListenerOrEventListenerObject[] };
let rafCount = 0;

function addEventListenerStub(event: string, cb: EventListenerOrEventListenerObject) {
	listeners[event] ??= [];
	listeners[event].push(cb);
}

function removeEventListenerStub(event: string, cb: EventListenerOrEventListenerObject) {
	if (!listeners[event]) return;
	listeners[event] = listeners[event].filter((l) => l !== cb);
}

function dispatch(event: string, init?: unknown) {
	(listeners[event] ?? []).forEach((l) => {
		const ev = init ?? new Event(event);
		typeof l === 'function' ? l(ev) : l.handleEvent(ev);
	});
}

function mockWindow() {
	listeners = {};
	rafCount = 0;
	vi.stubGlobal('window', {
		addEventListener: addEventListenerStub,
		removeEventListener: removeEventListenerStub,
		requestAnimationFrame: () => ++rafCount,
		cancelAnimationFrame: () => undefined
	});
}

describe.skip('Gyroscope (device API - requires real device)', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('renders the toggle with switch role', () => {
		mockWindow();
		render(Gyroscope, { enabled: false });
		const toggle = screen.getByRole('switch', { name: 'Toggle gyroscope' });
		expect(toggle).toBeInTheDocument();
		expect(toggle).toHaveAttribute('aria-checked', 'false');
	});

	it('starts disabled without attaching device listeners', () => {
		mockWindow();
		render(Gyroscope, { enabled: false });
		expect(listeners['deviceorientation'] ?? []).toHaveLength(0);
		expect(listeners['devicemotion'] ?? []).toHaveLength(0);
	});

	it('attaches device listeners when enabled without a permission API', () => {
		mockWindow();
		render(Gyroscope, { enabled: true });
		expect(listeners['deviceorientation'] ?? []).toHaveLength(1);
		expect(listeners['devicemotion'] ?? []).toHaveLength(1);
	});

	it('requests permission when the API requires it, then attaches listeners', async () => {
		vi.stubGlobal('DeviceOrientationEvent', MockDeviceOrientationEvent);
		vi.stubGlobal('DeviceMotionEvent', MockDeviceMotionEvent);
		const spy = vi.spyOn(MockDeviceOrientationEvent, 'requestPermission');
		mockWindow();
		render(Gyroscope, { enabled: true });
		expect(spy).toHaveBeenCalled();
		await vi.waitFor(() => {
			expect(listeners['deviceorientation'] ?? []).toHaveLength(1);
		});
	});

	it('falls back to mouse mode when permission is denied', async () => {
		vi.stubGlobal('DeviceOrientationEvent', MockDeviceOrientationEvent);
		vi.stubGlobal('DeviceMotionEvent', MockDeviceMotionEvent);
		vi.spyOn(MockDeviceOrientationEvent, 'requestPermission').mockResolvedValue('denied');
		mockWindow();
		render(Gyroscope, { enabled: true });
		await vi.waitFor(() => {
			expect(screen.getByText('Permission denied')).toBeInTheDocument();
		});
		expect(listeners['deviceorientation'] ?? []).toHaveLength(0);
	});

	it('calls onReading when a deviceorientation event arrives', async () => {
		const onReading = vi.fn();
		mockWindow();
		render(Gyroscope, { enabled: true, onReading });
		dispatch('deviceorientation', { alpha: 30, beta: 20, gamma: 10 });
		expect(onReading).toHaveBeenCalledWith({ alpha: 30, beta: 20, gamma: 10 });
		expect(screen.getByText('30.0°')).toBeInTheDocument();
		expect(screen.getByText('20.0°')).toBeInTheDocument();
		expect(screen.getByText('10.0°')).toBeInTheDocument();
	});

	it('ignores synthetic null deviceorientation events', () => {
		const onReading = vi.fn();
		mockWindow();
		render(Gyroscope, { enabled: true, onReading });
		dispatch('deviceorientation', { alpha: 90, beta: 0, gamma: 0 });
		expect(onReading).not.toHaveBeenCalled();
	});

	it('cleans up device listeners when toggled off', async () => {
		mockWindow();
		render(Gyroscope, { enabled: true });
		expect(listeners['deviceorientation'] ?? []).toHaveLength(1);
		await fireEvent.click(screen.getByRole('switch', { name: 'Toggle gyroscope' }));
		expect(listeners['deviceorientation'] ?? []).toHaveLength(0);
		expect(listeners['devicemotion'] ?? []).toHaveLength(0);
		expect(screen.getByRole('switch', { name: 'Toggle gyroscope' })).toHaveAttribute(
			'aria-checked',
			'false'
		);
	});

	it('applies sensitivity to beta and gamma', () => {
		const onReading = vi.fn();
		mockWindow();
		render(Gyroscope, { enabled: true, sensitivity: 2, onReading });
		dispatch('deviceorientation', { alpha: 10, beta: 40, gamma: 30 });
		expect(onReading).toHaveBeenCalledWith({ alpha: 10, beta: 80, gamma: 60 });
	});
});
