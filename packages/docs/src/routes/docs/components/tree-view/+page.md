# Tree View

A hierarchical tree structure for displaying nested data like file systems or organizational charts.

## Install

```bash
npx @intinyagroup/cli add tree-view
```

## Usage

```svelte
<script>
  import { TreeView, TreeNode } from '@intinyagroup/ui';
  import type { TreeViewNode } from '@intinyagroup/ui';

  const nodes: TreeViewNode[] = [
    {
      id: '1',
      label: 'Documents',
      children: [
        { id: '1-1', label: 'report.pdf' },
        { id: '1-2', label: 'notes.txt' },
      ]
    },
    {
      id: '2',
      label: 'Pictures',
      children: [
        { id: '2-1', label: 'vacation.jpg' },
        { id: '2-2', label: 'family.png' },
      ]
    }
  ];
</script>

<TreeView {nodes} />
```

## Structure

- `TreeView` — root container for the tree
- `TreeNode` — individual node with expand/collapse support

## Props

| Sub-component | Description |
|---------------|-------------|
| `TreeView` | Root — accepts `nodes` array of `TreeViewNode` objects |
| `TreeNode` | Individual node — renders label and manages expand/collapse state |

### TreeViewNode Type

```typescript
interface TreeViewNode {
  id: string;
  label: string;
  children?: TreeViewNode[];
}
```
