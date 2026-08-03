// ============================================
// Effects system — blur, zoom, color, transform
// ============================================

import type { Effect, EffectType } from '../core.js';

/** Generate CSS filter string from effects */
export function getFilterString(effects: Effect[], currentFrame: number): string {
  const filters: string[] = [];

  for (const effect of effects) {
    if (effect.fromFrame !== undefined && currentFrame < effect.fromFrame) continue;
    if (effect.toFrame !== undefined && currentFrame > effect.toFrame) continue;

    switch (effect.type) {
      case 'blur':
        filters.push(`blur(${effect.params.radius ?? 4}px)`);
        break;
      case 'brightness':
        filters.push(`brightness(${effect.params.value ?? 1.5})`);
        break;
      case 'contrast':
        filters.push(`contrast(${effect.params.value ?? 1.5})`);
        break;
      case 'saturate':
        filters.push(`saturate(${effect.params.value ?? 2})`);
        break;
      case 'hue-rotate':
        filters.push(`hue-rotate(${effect.params.degrees ?? 90}deg)`);
        break;
      case 'sepia':
        filters.push(`sepia(${effect.params.value ?? 1})`);
        break;
      case 'invert':
        filters.push(`invert(${effect.params.value ?? 1})`);
        break;
      case 'grayscale':
        filters.push(`grayscale(${effect.params.value ?? 1})`);
        break;
      case 'drop-shadow':
        filters.push(`drop-shadow(${effect.params.x ?? 0}px ${effect.params.y ?? 4}px ${effect.params.blur ?? 4}px ${effect.params.color ?? 'rgba(0,0,0,0.3)'})`);
        break;
    }
  }

  return filters.length > 0 ? filters.join(' ') : 'none';
}

/** Generate CSS transform string from effects */
export function getTransformString(effects: Effect[], currentFrame: number): string {
  const transforms: string[] = [];

  for (const effect of effects) {
    if (effect.fromFrame !== undefined && currentFrame < effect.fromFrame) continue;
    if (effect.toFrame !== undefined && currentFrame > effect.toFrame) continue;

    switch (effect.type) {
      case 'zoom-in':
        transforms.push(`scale(${1 + (effect.params.amount ?? 0.5) * Math.min(1, (currentFrame - (effect.fromFrame ?? 0)) / ((effect.toFrame ?? 30) - (effect.fromFrame ?? 0)))})`);
        break;
      case 'zoom-out':
        transforms.push(`scale(${1 - (effect.params.amount ?? 0.5) * Math.min(1, (currentFrame - (effect.fromFrame ?? 0)) / ((effect.toFrame ?? 30) - (effect.fromFrame ?? 0)))})`);
        break;
      case 'pan-left':
        transforms.push(`translateX(-${(effect.params.amount ?? 50) * Math.min(1, (currentFrame - (effect.fromFrame ?? 0)) / ((effect.toFrame ?? 30) - (effect.fromFrame ?? 0)))}px)`);
        break;
      case 'pan-right':
        transforms.push(`translateX(${(effect.params.amount ?? 50) * Math.min(1, (currentFrame - (effect.fromFrame ?? 0)) / ((effect.toFrame ?? 30) - (effect.fromFrame ?? 0)))}px)`);
        break;
      case 'pan-up':
        transforms.push(`translateY(-${(effect.params.amount ?? 50) * Math.min(1, (currentFrame - (effect.fromFrame ?? 0)) / ((effect.toFrame ?? 30) - (effect.fromFrame ?? 0)))}px)`);
        break;
      case 'pan-down':
        transforms.push(`translateY(${(effect.params.amount ?? 50) * Math.min(1, (currentFrame - (effect.fromFrame ?? 0)) / ((effect.toFrame ?? 30) - (effect.fromFrame ?? 0)))}px)`);
        break;
      case 'rotate':
        transforms.push(`rotate(${(effect.params.degrees ?? 360) * Math.min(1, (currentFrame - (effect.fromFrame ?? 0)) / ((effect.toFrame ?? 30) - (effect.fromFrame ?? 0)))}deg)`);
        break;
      case 'shake':
        const shakeX = Math.sin(currentFrame * 0.5) * (effect.params.intensity ?? 5);
        const shakeY = Math.cos(currentFrame * 0.7) * (effect.params.intensity ?? 5);
        transforms.push(`translate(${shakeX}px, ${shakeY}px)`);
        break;
      case 'bounce':
        const bounceProgress = (currentFrame - (effect.fromFrame ?? 0)) / ((effect.toFrame ?? 30) - (effect.fromFrame ?? 0));
        const bounceY = Math.abs(Math.sin(bounceProgress * Math.PI * 3)) * (effect.params.height ?? 20);
        transforms.push(`translateY(-${bounceY}px)`);
        break;
      case 'pulse':
        const pulseScale = 1 + Math.sin(currentFrame * 0.2) * (effect.params.amount ?? 0.1);
        transforms.push(`scale(${pulseScale})`);
        break;
    }
  }

  return transforms.length > 0 ? transforms.join(' ') : 'none';
}

/** Preset effects */
export const effectPresets: { type: EffectType; label: string; params: Record<string, number> }[] = [
  { type: 'blur', label: 'Blur', params: { radius: 4 } },
  { type: 'brightness', label: 'Brighten', params: { value: 1.5 } },
  { type: 'contrast', label: 'High Contrast', params: { value: 1.5 } },
  { type: 'saturate', label: 'Saturate', params: { value: 2 } },
  { type: 'hue-rotate', label: 'Hue Rotate', params: { degrees: 90 } },
  { type: 'sepia', label: 'Sepia Tone', params: { value: 1 } },
  { type: 'grayscale', label: 'Grayscale', params: { value: 1 } },
  { type: 'zoom-in', label: 'Zoom In', params: { amount: 0.5 } },
  { type: 'zoom-out', label: 'Zoom Out', params: { amount: 0.5 } },
  { type: 'pan-left', label: 'Pan Left', params: { amount: 50 } },
  { type: 'pan-right', label: 'Pan Right', params: { amount: 50 } },
  { type: 'rotate', label: 'Rotate', params: { degrees: 360 } },
  { type: 'shake', label: 'Shake', params: { intensity: 5 } },
  { type: 'bounce', label: 'Bounce', params: { height: 20 } },
  { type: 'pulse', label: 'Pulse', params: { amount: 0.1 } },
  { type: 'fade-in', label: 'Fade In', params: {} },
  { type: 'fade-out', label: 'Fade Out', params: {} },
  { type: 'drop-shadow', label: 'Drop Shadow', params: { x: 0, y: 4, blur: 4 } },
];
