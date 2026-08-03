// ============================================
// Transitions — CSS transition helpers
// ============================================

import type { Transition, TransitionType } from '@intinyagroup/motion';

export function getTransitionStyles(transition: Transition | undefined, progress: number, direction: 'in' | 'out' = 'in'): Record<string, string> {
  if (!transition || transition.type === 'none') return {};
  const p = direction === 'in' ? progress : 1 - progress;
  switch (transition.type) {
    case 'fade': case 'cross-fade': return { opacity: String(p) };
    case 'slide-left': return { transform: `translateX(${(1 - p) * 100}%)`, opacity: String(p) };
    case 'slide-right': return { transform: `translateX(${(p - 1) * 100}%)`, opacity: String(p) };
    case 'slide-up': return { transform: `translateY(${(1 - p) * 100}%)`, opacity: String(p) };
    case 'slide-down': return { transform: `translateY(${(p - 1) * 100}%)`, opacity: String(p) };
    case 'wipe-left': return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` };
    case 'wipe-right': return { clipPath: `inset(0 0 0 ${(1 - p) * 100}%)` };
    case 'wipe-up': return { clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` };
    case 'wipe-down': return { clipPath: `inset(${(1 - p) * 100}% 0 0 0)` };
    case 'dissolve': return { filter: `blur(${(1 - p) * 10}px)`, opacity: String(p) };
    case 'blur': return { filter: `blur(${(1 - p) * 20}px)`, opacity: String(p) };
    case 'zoom': return { transform: `scale(${0.5 + p * 0.5})`, opacity: String(p) };
    case 'rotate': return { transform: `rotate(${(1 - p) * 180}deg) scale(${0.5 + p * 0.5})`, opacity: String(p) };
    case 'push-left': return { transform: `translateX(${(1 - p) * 100}%)` };
    case 'push-right': return { transform: `translateX(${(p - 1) * 100}%)` };
    case 'push-up': return { transform: `translateY(${(1 - p) * 100}%)` };
    case 'push-down': return { transform: `translateY(${(p - 1) * 100}%)` };
    default: return {};
  }
}

export const transitionPresets: { type: TransitionType; label: string; category: string }[] = [
  { type: 'none', label: 'None', category: 'Basic' },
  { type: 'fade', label: 'Fade', category: 'Basic' },
  { type: 'cross-fade', label: 'Cross Fade', category: 'Basic' },
  { type: 'slide-left', label: 'Slide Left', category: 'Slide' },
  { type: 'slide-right', label: 'Slide Right', category: 'Slide' },
  { type: 'slide-up', label: 'Slide Up', category: 'Slide' },
  { type: 'slide-down', label: 'Slide Down', category: 'Slide' },
  { type: 'wipe-left', label: 'Wipe Left', category: 'Wipe' },
  { type: 'wipe-right', label: 'Wipe Right', category: 'Wipe' },
  { type: 'wipe-up', label: 'Wipe Up', category: 'Wipe' },
  { type: 'wipe-down', label: 'Wipe Down', category: 'Wipe' },
  { type: 'dissolve', label: 'Dissolve', category: 'Fancy' },
  { type: 'blur', label: 'Blur', category: 'Fancy' },
  { type: 'zoom', label: 'Zoom', category: 'Fancy' },
  { type: 'rotate', label: 'Rotate', category: 'Fancy' },
  { type: 'push-left', label: 'Push Left', category: 'Push' },
  { type: 'push-right', label: 'Push Right', category: 'Push' },
  { type: 'push-up', label: 'Push Up', category: 'Push' },
  { type: 'push-down', label: 'Push Down', category: 'Push' },
  { type: 'cover-left', label: 'Cover Left', category: 'Cover' },
  { type: 'cover-right', label: 'Cover Right', category: 'Cover' },
  { type: 'cover-up', label: 'Cover Up', category: 'Cover' },
  { type: 'cover-down', label: 'Cover Down', category: 'Cover' },
];

export function getTransitionProgress(currentFrame: number, startFrame: number, duration: number): number {
  if (currentFrame < startFrame) return 0;
  if (currentFrame > startFrame + duration) return 1;
  return (currentFrame - startFrame) / duration;
}
