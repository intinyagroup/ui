# Pagination

Navigation for splitting long lists of content into pages.

## Install

```bash
npx @intinyagroup/cli add pagination
```

## Usage

```svelte
<script>
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis
  } from '@intinyagroup/ui';
</script>

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">10</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## Structure

- `Pagination` — root wrapper with `aria-label="pagination"`
- `PaginationContent` — horizontal list container
- `PaginationItem` — wraps a single page element
- `PaginationLink` — page number link (accepts `isActive`)
- `PaginationPrevious` — previous page link
- `PaginationNext` — next page link
- `PaginationEllipsis` — collapsed page indicator

## Props

| Sub-component | Description |
|---------------|-------------|
| `PaginationLink` | Accepts `href` and `isActive` for current page |
| `PaginationPrevious` | Previous page link |
| `PaginationNext` | Next page link |
