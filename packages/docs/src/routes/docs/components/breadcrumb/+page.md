# Breadcrumb

A navigation aid showing the current page's location within a hierarchy.

## Install

```bash
npx @intinyagroup/cli add breadcrumb
```

## Usage

```svelte
<script>
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from '@intinyagroup/ui';
</script>

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Components</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Structure

- `Breadcrumb` — root wrapper with `aria-label="breadcrumb"`
- `BreadcrumbList` — horizontal list container
- `BreadcrumbItem` — wraps a single breadcrumb entry
- `BreadcrumbLink` — clickable link
- `BreadcrumbPage` — current page (non-interactive)
- `BreadcrumbSeparator` — visual separator between items
- `BreadcrumbEllipsis` — collapsed menu indicator

## Props

| Sub-component | Description |
|---------------|-------------|
| `Breadcrumb` | Root — sets `aria-label="breadcrumb"` |
| `BreadcrumbLink` | Accepts `href` for navigation |
| `BreadcrumbPage` | Current page, `aria-current="page"` |
| `BreadcrumbSeparator` | Renders `/` by default, accepts children |
