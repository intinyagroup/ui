# Navigation Menu

A vertical or horizontal navigation menu with support for mega-menu content panels. Built on bits-ui navigation menu primitives.

## Install

```bash
npx @intinyagroup/cli add navigation-menu
```

## Usage

```svelte
<script>
  import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink
  } from '@intinyagroup/ui';
</script>

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div class="grid gap-3 p-4 w-96">
          <NavigationMenuLink href="/docs/introduction">
            <div class="font-medium">Introduction</div>
            <p class="text-muted-foreground">Re-usable components built with Radix UI and Tailwind.</p>
          </NavigationMenuLink>
          <NavigationMenuLink href="/docs/installation">
            <div class="font-medium">Installation</div>
            <p class="text-muted-foreground">How to install dependencies and structure your app.</p>
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Components</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div class="grid gap-3 p-4 w-96">
          <NavigationMenuLink href="/docs/components/button">
            <div class="font-medium">Button</div>
            <p class="text-muted-foreground">Interactive button with variants and sizes.</p>
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## Structure

- `NavigationMenu` — root wrapper
- `NavigationMenuList` — horizontal list container
- `NavigationMenuItem` — wraps a trigger + content pair
- `NavigationMenuTrigger` — opens the content panel
- `NavigationMenuContent` — the dropdown/mega-menu panel
- `NavigationMenuLink` — a navigation link inside content

## Props

| Sub-component | Description |
|---------------|-------------|
| `NavigationMenu` | Root — accepts `orientation` (`'horizontal' \| 'vertical'`) |
| `NavigationMenuContent` | Accepts `align` and `sideOffset` |
| `NavigationMenuLink` | Accepts `href` and `active` |
