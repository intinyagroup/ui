export interface GridSnapOptions {
  size: number; // grid cell size in px
  enabled: boolean;
}

export function snapToGrid(x: number, y: number, options: GridSnapOptions): { x: number; y: number } {
  if (!options.enabled) return { x, y };

  return {
    x: Math.round(x / options.size) * options.size,
    y: Math.round(y / options.size) * options.size
  };
}

export function snapToElements(
  x: number,
  y: number,
  elements: { x: number; y: number; width: number; height: number }[],
  threshold: number = 5
): { x: number; y: number } {
  let snappedX = x;
  let snappedY = y;
  let minDistX = threshold;
  let minDistY = threshold;

  for (const el of elements) {
    // Snap to left edge
    const distLeft = Math.abs(x - el.x);
    if (distLeft < minDistX) {
      snappedX = el.x;
      minDistX = distLeft;
    }

    // Snap to right edge
    const distRight = Math.abs(x - (el.x + el.width));
    if (distRight < minDistX) {
      snappedX = el.x + el.width;
      minDistX = distRight;
    }

    // Snap to top edge
    const distTop = Math.abs(y - el.y);
    if (distTop < minDistY) {
      snappedY = el.y;
      minDistY = distTop;
    }

    // Snap to bottom edge
    const distBottom = Math.abs(y - (el.y + el.height));
    if (distBottom < minDistY) {
      snappedY = el.y + el.height;
      minDistY = distBottom;
    }
  }

  return { x: snappedX, y: snappedY };
}
