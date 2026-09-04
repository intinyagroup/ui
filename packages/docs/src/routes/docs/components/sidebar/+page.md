# Sidebar

A collapsible sidebar navigation component with groups, menus, and inset content area.

## Install

```bash
npx @intinyagroup/cli add sidebar
```

## Usage

```svelte
<script>
  import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
    SidebarInset
  } from '@intinyagroup/ui';
</script>

<Sidebar>
  <SidebarHeader>
    <span class="font-semibold">My App</span>
  </SidebarHeader>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>Settings</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
  <SidebarFooter>
    <span class="text-xs text-muted-foreground">© 2024</span>
  </SidebarFooter>
</Sidebar>
```

## Structure

- `Sidebar` — root wrapper
- `SidebarHeader` / `SidebarFooter` — top and bottom regions
- `SidebarContent` — scrollable main area
- `SidebarGroup` — groups related items
- `SidebarGroupLabel` — group heading
- `SidebarGroupContent` — group body
- `SidebarMenu` / `SidebarMenuItem` / `SidebarMenuButton` — navigation items
- `SidebarTrigger` — toggle button for collapsing
- `SidebarInset` — main content area beside the sidebar

## Props

| Sub-component | Description |
|---------------|-------------|
| `SidebarMenuButton` | Accepts `isActive` for highlighting current page |
| `SidebarTrigger` | Toggle button for sidebar visibility |
| `SidebarInset` | Main content area that adjusts to sidebar state |
