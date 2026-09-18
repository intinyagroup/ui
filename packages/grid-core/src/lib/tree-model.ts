// ============================================
// @intinyagroup/grid-core — Tree Data Model & Utilities
// ============================================

export interface TreeNodeData {
  id: string;
  parentId?: string | null;
  [key: string]: unknown;
}

export type TreeNode<T extends TreeNodeData> = T & {
  children?: TreeNode<T>[];
  level: number;
  hasChildren: boolean;
};

export type FlatTreeRow<T extends TreeNodeData> = T & {
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isLoading?: boolean;
};

/**
 * Transforms flat self-referencing items (with id and parentId) into a hierarchical tree.
 */
export function flatToTree<T extends TreeNodeData>(
  items: T[],
  options: {
    idKey?: keyof T;
    parentKey?: keyof T;
  } = {},
): TreeNode<T>[] {
  const idKey = options.idKey ?? ("id" as keyof T);
  const parentKey = options.parentKey ?? ("parentId" as keyof T);

  const itemMap = new Map<string, TreeNode<T>>();
  const roots: TreeNode<T>[] = [];

  // Initialize nodes
  for (const item of items) {
    const id = String(item[idKey]);
    const node: TreeNode<T> = {
      ...item,
      id,
      parentId: item[parentKey] ? String(item[parentKey]) : null,
      children: [],
      level: 0,
      hasChildren: false,
    };
    itemMap.set(id, node);
  }

  // Link children to parents
  for (const item of items) {
    const id = String(item[idKey]);
    const node = itemMap.get(id)!;
    const parentId = item[parentKey] ? String(item[parentKey]) : null;

    if (parentId && itemMap.has(parentId)) {
      const parent = itemMap.get(parentId)!;
      parent.children!.push(node);
      parent.hasChildren = true;
    } else {
      roots.push(node);
    }
  }

  // Assign level depths
  function setLevels(nodes: TreeNode<T>[], currentLevel: number) {
    for (const node of nodes) {
      node.level = currentLevel;
      if (node.children && node.children.length > 0) {
        setLevels(node.children, currentLevel + 1);
      }
    }
  }

  setLevels(roots, 0);
  return roots;
}

/**
 * Flattens a hierarchical tree into a linear list of visible rows based on expanded state.
 */
export function treeToFlat<T extends TreeNodeData>(
  nodes: TreeNode<T>[],
  expandedIds: Set<string> | Record<string, boolean> = new Set(),
  loadingIds: Set<string> = new Set(),
): FlatTreeRow<T>[] {
  const isExpanded = (id: string): boolean =>
    expandedIds instanceof Set ? expandedIds.has(id) : Boolean(expandedIds[id]);

  const flat: FlatTreeRow<T>[] = [];

  function traverse(list: TreeNode<T>[]) {
    for (const node of list) {
      const expanded = isExpanded(node.id);
      const loading = loadingIds.has(node.id);

      flat.push({
        ...node,
        isExpanded: expanded,
        isLoading: loading,
      });

      if (expanded && node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(nodes);
  return flat;
}

/**
 * Recursively filters a tree.
 * Keeps a parent if any of its descendants matches the predicate.
 */
export function filterTree<T extends TreeNodeData>(
  nodes: TreeNode<T>[],
  predicate: (node: T) => boolean,
  includeChildrenOnParentMatch = true,
): TreeNode<T>[] {
  function filterNode(node: TreeNode<T>): TreeNode<T> | null {
    const isSelfMatch = predicate(node);

    if (isSelfMatch && includeChildrenOnParentMatch) {
      return { ...node };
    }

    const filteredChildren: TreeNode<T>[] = [];
    if (node.children) {
      for (const child of node.children) {
        const filtered = filterNode(child);
        if (filtered) filteredChildren.push(filtered);
      }
    }

    if (isSelfMatch || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
        hasChildren: filteredChildren.length > 0,
      };
    }

    return null;
  }

  return nodes.map(filterNode).filter((n): n is TreeNode<T> => n !== null);
}

/**
 * Recursively sorts tree nodes within their siblings at every depth.
 */
export function sortTree<T extends TreeNodeData>(
  nodes: TreeNode<T>[],
  compareFn: (a: T, b: T) => number,
): TreeNode<T>[] {
  return [...nodes].sort(compareFn).map((node) => ({
    ...node,
    children: node.children ? sortTree(node.children, compareFn) : [],
  }));
}

/**
 * Computes cascading tree selection (checking parent checks all children,
 * parent becomes indeterminate if some children are checked).
 */
export function cascadeSelect<T extends TreeNodeData>(
  roots: TreeNode<T>[],
  currentSelected: Set<string>,
  targetId: string,
  check: boolean,
): { selected: Set<string>; indeterminate: Set<string> } {
  const nextSelected = new Set(currentSelected);

  // 1. Find target and collect all its descendants
  function collectDescendantIds(node: TreeNode<T>, ids: string[]) {
    ids.push(node.id);
    if (node.children) {
      for (const child of node.children) {
        collectDescendantIds(child, ids);
      }
    }
  }

  function findAndApply(nodes: TreeNode<T>[]): boolean {
    for (const node of nodes) {
      if (node.id === targetId) {
        const ids: string[] = [];
        collectDescendantIds(node, ids);
        for (const id of ids) {
          if (check) nextSelected.add(id);
          else nextSelected.delete(id);
        }
        return true;
      }
      if (node.children && findAndApply(node.children)) {
        return true;
      }
    }
    return false;
  }

  findAndApply(roots);

  // 2. Compute ancestor indeterminate / checked states bottom-up
  const indeterminate = new Set<string>();

  function reconcile(node: TreeNode<T>): {
    allSelected: boolean;
    someSelected: boolean;
  } {
    if (!node.children || node.children.length === 0) {
      const isSelected = nextSelected.has(node.id);
      return { allSelected: isSelected, someSelected: isSelected };
    }

    let allChildrenSelected = true;
    let anyChildSelected = false;

    for (const child of node.children) {
      const res = reconcile(child);
      if (res.allSelected) anyChildSelected = true;
      else allChildrenSelected = false;

      if (res.someSelected) anyChildSelected = true;
    }

    if (allChildrenSelected) {
      nextSelected.add(node.id);
      indeterminate.delete(node.id);
      return { allSelected: true, someSelected: true };
    }

    if (anyChildSelected) {
      nextSelected.delete(node.id);
      indeterminate.add(node.id);
      return { allSelected: false, someSelected: true };
    }

    nextSelected.delete(node.id);
    indeterminate.delete(node.id);
    return { allSelected: false, someSelected: false };
  }

  for (const root of roots) {
    reconcile(root);
  }

  return { selected: nextSelected, indeterminate };
}
