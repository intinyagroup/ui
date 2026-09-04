<script lang="ts">
  import { Draggable } from '../dnd/index.js';

  const components = [
    { id: 'button', name: 'Button', icon: '⌘' },
    { id: 'card', name: 'Card', icon: '▢' },
    { id: 'input', name: 'Input', icon: '▭' },
    { id: 'badge', name: 'Badge', icon: '●' },
    { id: 'alert', name: 'Alert', icon: '⚠' },
    { id: 'avatar', name: 'Avatar', icon: '◉' },
    { id: 'checkbox', name: 'Checkbox', icon: '☑' },
    { id: 'radio', name: 'Radio', icon: '○' },
    { id: 'switch', name: 'Switch', icon: '◐' },
    { id: 'slider', name: 'Slider', icon: '━' },
  ];
</script>

<div class="w-60 border-r border-[var(--ui-border)] bg-[var(--ui-card)] p-4">
  <h3 class="mb-4 text-sm font-semibold">Components</h3>
  <div class="grid grid-cols-2 gap-2">
    {#each components as comp}
      <Draggable id="new-{comp.id}" data={{ type: comp.id }}>
        <div class="flex flex-col items-center gap-1 rounded-lg border border-[var(--ui-border)] p-3 text-xs hover:bg-[var(--ui-muted)] cursor-grab">
          <span class="text-lg">{comp.icon}</span>
          <span>{comp.name}</span>
        </div>
      </Draggable>
    {/each}
  </div>
</div>
