# Intinya Mobile App Starter

A PWA + Capacitor starter built with SvelteKit, Tailwind CSS v4, [@intinyagroup/ui](https://www.npmjs.com/package/@intinyagroup/ui), and Capacitor 7.

The demo page showcases the mobile component library: TabBar, PullToRefresh, ListView, ActionSheet, FabMenu, SlideMenu, SegmentedControl, AvatarStack, and MobileToast.

## Quick start

```bash
pnpm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`) — try it in a phone-sized browser window or DevTools device mode.

## PWA (installable web app)

```bash
npm run build
npm run preview
```

Then visit the preview URL from a phone on the same network (or deploy `build/` to any static host, e.g. Cloudflare Pages or Netlify). The app is installable:

- **iOS Safari:** Share → Add to Home Screen
- **Android Chrome:** menu → Install app / Add to Home screen

It runs standalone, full-screen with `viewport-fit=cover` and safe-area padding built into the components.

Replace the placeholder icons in `static/icon-192.png` and `static/icon-512.png` with your own artwork.

## Capacitor (native iOS / Android)

```bash
# add a native platform once
npx cap add ios
npx cap add android

# build the web assets and copy them into the native projects
npm run build
npm run sync

# open in Xcode / Android Studio
npm run ios      # or: npm run android

# or build & run directly from the CLI
npm run ios:build
npm run android:build
```

> First Android run needs a device or emulator; `cap run android` will prompt you. iOS requires Xcode and (for a device) a signing team.

## Customizing

- **appId / appName** — edit `capacitor.config.json` (e.g. `"appId": "com.yourcompany.yourapp"`). The appId must be changed before the first native build; it becomes the native bundle identifier.
- **PWA identity** — update `static/manifest.json` (`name`, `short_name`, `theme_color`) and the `<meta name="theme-color">` in `src/app.html`.
- **Icons** — replace `static/icon-192.png` and `static/icon-512.png` (any 192×192 / 512×512 PNGs).
- **Theme** — swap the token import in `src/routes/+layout.svelte` (`@intinyagroup/tokens/base`, `md3`, `flat`, `glass`, `brutalist`, etc.). See the tokens package (`@intinyagroup/tokens`).
- **Dark mode** — add `class="dark"` on `<html>` in `src/app.html`; all components and tokens respond automatically.

## Project structure

```
src/
  app.html          PWA meta: manifest + apple-touch-icon links, viewport-fit=cover
  app.css           Tailwind v4 + base body styles, safe-area + overscroll reset
  routes/
    +layout.svelte  Root layout (tokens import)
    +page.svelte    Mobile component demo
static/
  manifest.json     PWA manifest (standalone display)
  icon-192.png      App icon (replace)
  icon-512.png      App icon (replace)
capacitor.config.json
svelte.config.js    adapter-static (fallback index.html for SPA routing)
vite.config.ts      SvelteKit + Tailwind v4 plugins
package.json