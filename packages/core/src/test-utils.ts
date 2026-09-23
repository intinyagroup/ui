import { cleanup } from "@testing-library/svelte";
import { afterEach, beforeEach } from "vitest";

export function setupBrowserFixtures() {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id="test-root"></div><div id="portal-root"></div>';
    window.matchMedia =
      window.matchMedia ??
      ((query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList);
    window.ResizeObserver =
      window.ResizeObserver ??
      (class {
        observe() {}
        unobserve() {}
        disconnect() {}
      } as unknown as typeof ResizeObserver);
    window.IntersectionObserver =
      window.IntersectionObserver ??
      (class {
        observe() {}
        unobserve() {}
        disconnect() {}
        root = null;
        rootMargin = "";
        thresholds: number[] = [];
        takeRecords() {
          return [];
        }
      } as unknown as typeof IntersectionObserver);
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });
}
