import { render, expect } from '@testing-library/svelte';
import { describe, it, vi } from 'vitest';
import Gyroscope from './Gyroscope.svelte';

describe.skip('gyro-debug (device API)', () => {
  it('listeners', () => {
    const listeners = {};
    vi.stubGlobal('window', {
      addEventListener: (e, cb) => { (listeners[e] ??= []).push(cb); },
      removeEventListener: () => {},
    });
    render(Gyroscope, { enabled: true });
    console.log('LEN', Object.keys(listeners).map(k => `${k}:${listeners[k].length}`).join(',') || 'NONE');
  });
});
