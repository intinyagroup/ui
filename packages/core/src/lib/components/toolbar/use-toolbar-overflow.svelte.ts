export type ToolbarOverflowOptions = {
  initialVisible?: number;
  minVisible?: number;
};

export function createToolbarOverflow(options?: ToolbarOverflowOptions) {
  let containerRef = $state<HTMLElement | null>(null);
  let visibleCount = $state<number>(
    options?.initialVisible ?? Number.POSITIVE_INFINITY,
  );
  let hasOverflow = $state<boolean>(false);
  let isCollapsed = $state<boolean>(false);

  function checkOverflow() {
    if (!containerRef) return;
    hasOverflow = containerRef.scrollWidth > containerRef.clientWidth;
  }

  function action(node: HTMLElement) {
    containerRef = node;
    checkOverflow();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      checkOverflow();
    });
    observer.observe(node);
    return {
      destroy() {
        observer.disconnect();
      },
    };
  }

  return {
    get containerRef() {
      return containerRef;
    },
    set containerRef(value: HTMLElement | null) {
      containerRef = value;
      checkOverflow();
    },
    get visibleCount() {
      return visibleCount;
    },
    set visibleCount(value: number) {
      visibleCount = value;
    },
    get hasOverflow() {
      return hasOverflow;
    },
    get isCollapsed() {
      return isCollapsed;
    },
    set isCollapsed(value: boolean) {
      isCollapsed = value;
    },
    checkOverflow,
    action,
  };
}

export const useToolbarOverflow = createToolbarOverflow;
