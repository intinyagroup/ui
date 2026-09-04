---
title: Mobile Apps
description: Build mobile-first apps with Intinya UI — touch components, Capacitor, PWA
---

# Mobile Apps with Intinya UI

Intinya UI includes mobile components designed for touch-first interfaces. Combined with Capacitor, one codebase targets web, PWA, and native app stores.

## Mobile Component Set

| Component | Purpose |
|-----------|---------|
| `TabBar` | Bottom navigation with badge support |
| `PullToRefresh` | Refresh gesture |
| `ListView` | Virtualized scrollable list |
| `ListItem` | Touch list row |
| `ActionSheet` | Bottom action picker |
| `FabMenu` | Floating action menu |
| `SlideMenu` | Drawer navigation |
| `SegmentedControl` | Toggle group |
| `MobileToast` | Bottom notification |
| `AvatarStack` | Avatar group |

All mobile components are:
- **Touch-optimized** — 44px+ targets, no hover-dependent features
- **Safe-area aware** — respects notches via `env(safe-area-inset-*)`
- **Tree-shakeable** — import only what you use

## Basic Layout

```svelte
<script>
  import { TabBar, TabBarItem, ListView, ListItem, PullToRefresh } from '@intinyagroup/ui';
  import { Home, ShoppingBag, User } from 'lucide-svelte';

  let tab = $state('home');
  let items = $state([...Array(50)].map((_, i) => ({ id: i, title: `Item ${i}` })));
  let refreshing = $state(false);

  async function onRefresh() {
    refreshing = true;
    await new Promise((r) => setTimeout(r, 1000));
    items = [...Array(50)].map((_, i) => ({ id: i, title: `Fresh ${i}` }));
    refreshing = false;
  }
</script>

<div class="flex h-dvh flex-col">
  <PullToRefresh {refreshing} onrefresh={onRefresh}>
    <ListView items={items} let:item>
      <ListItem {item} />
    </ListView>
  </PullToRefresh>

  <TabBar bind:value={tab}>
    <TabBarItem value="home" label="Home"><Home /></TabBarItem>
    <TabBarItem value="shop" label="Shop" badge={3}><ShoppingBag /></TabBarItem>
    <TabBarItem value="profile" label="Profile"><User /></TabBarItem>
  </TabBar>
</div>
```

## PWA Setup

1. Install a manifest + service worker (SvelteKit `@svelte-kit/pwa` or `vite-plugin-pwa`)
2. Add theme-color meta:
```html
<meta name="theme-color" content="#7c3aed" />
```
3. Add to home screen — the app works offline via cache

## Capacitor Setup

```bash
npm install @capacitor/core @capacitor/cli @intinyagroup/native
npx cap init "My App" com.example.app
npx cap add android
npx cap add ios
```

```ts
import { takePhoto, localNotify } from '@intinyagroup/native';

const photo = await takePhoto(); // web: file input, native: camera
await localNotify('Welcome', 'Your app is ready');
```

`@intinyagroup/native` detects the platform and falls back to web APIs when not running in Capacitor.

## Safe Areas

Mobile components respect safe areas automatically. For custom layouts:

```css
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Performance Tips

- Import only the mobile components you use
- Use `ListView` for long lists (virtualized)
- Lazy-load images below the fold
- Avoid heavy animations on low-end devices

## Start Fast

```bash
# Clone the PWA starter
git clone https://github.com/intinyagroup/ui
cd ui/templates/pwa-starter
pnpm install && pnpm dev
```

## Next Steps

- [Native features with @intinyagroup/native](/docs/components)
- [Browse all components](/docs/components)
- [Get started](/docs/getting-started)
