# Kanban

A drag-and-drop kanban board built from `KanbanBoard`, `KanbanColumn`, and `KanbanCard`. Columns and cards are plain objects; moving a card notifies you via an `onCardMove` callback.

## Usage

```svelte
<script>
  import { KanbanBoard, KanbanColumn, KanbanCard } from '@intinyagroup/ui';

  let columns = $state([
    {
      id: 'todo',
      title: 'To do',
      accent: '#ef4444',
      cards: [
        { id: '1', title: 'Design sign-up', tags: ['design'] },
        { id: '2', title: 'Wire up auth' }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      cards: [{ id: '3', title: 'Ship v0.1', description: 'Released 🎉' }]
    }
  ]);

  function onCardMove(cardId, fromColumnId, toColumnId, index) {
    // columns is mutated by the board; use this to persist changes
    console.log({ cardId, fromColumnId, toColumnId, index });
  }
</script>

<KanbanBoard bind:columns {onCardMove} />
```

## Data types

```ts
type KanbanCardType = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
};

type KanbanColumnType = {
  id: string;
  title: string;
  cards: KanbanCardType[];
  accent?: string; // column indicator color
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `KanbanColumnType[]` | `[]` | Column data (bindable) |
| `onCardMove` | `(cardId, fromColumnId, toColumnId, index) => void` | — | Called when a card is dropped |

### Sub-components

| Component | Description |
|-----------|-------------|
| `KanbanColumn` | Renders a single column (takes a `column` prop); used internally by the board |
| `KanbanCard` | Renders a single card inside a column |

## Features

- Drag-and-drop across columns with drop-target highlighting
- Column `accent` color dot and card count badge
- Keyboard-accessible columns with `aria` roles and drop areas
- `onCardMove` fires with exact source/target/position for persistence

## Install

```bash
npx @intinyagroup/cli add kanban
```