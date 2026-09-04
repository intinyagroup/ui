# Tabs

Tabbed content with keyboard navigation, built on bits-ui tabs.

## Preview

```svelte
<script>
  import { Tabs, TabsList, TabsTrigger, TabsContent } from '@intinyagroup/ui';
</script>

<Tabs value="account" class="w-80">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account" class="mt-3">
    <p>Account settings</p>
  </TabsContent>
  <TabsContent value="password" class="mt-3">
    <p>Password settings</p>
  </TabsContent>
</Tabs>
```

## Structure

- `Tabs` — root (managed `value` state)
- `TabsList` — the tab bar
- `TabsTrigger` — a single tab button
- `TabsContent` — panel shown when its tab is active

## Props

`Tabs` accepts `value` / `onValueChange` (bits-ui bindable). All sub-components forward props.

## Install

```bash
npx @intinyagroup/cli add tabs
```
