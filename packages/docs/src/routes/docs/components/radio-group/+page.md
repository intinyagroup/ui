# Radio Group

A set of radio buttons for selecting one option from a list. Built on bits-ui radio group primitives.

## Install

```bash
npx @intinyagroup/cli add radio-group
```

## Usage

```svelte
<script>
  import { RadioGroup, RadioGroupItem } from '@intinyagroup/ui';
  import { Label } from '@intinyagroup/ui';

  let selected = $state('comfortable');
</script>

<RadioGroup bind:value={selected}>
  <div class="flex items-center space-x-2">
    <RadioGroupItem value="default" id="r1" />
    <Label for="r1">Default</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroupItem value="comfortable" id="r2" />
    <Label for="r2">Comfortable</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroupItem value="compact" id="r3" />
    <Label for="r3">Compact</Label>
  </div>
</RadioGroup>
```

## Props

| Sub-component | Description |
|---------------|-------------|
| `RadioGroup` | Root — accepts `value` (bindable), `orientation`, `name`, `disabled` |
| `RadioGroupItem` | Individual radio button — requires `value`, optionally `id` |
