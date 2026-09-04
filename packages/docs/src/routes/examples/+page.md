---
title: Examples Gallery
description: Component examples and patterns for Intinya UI
---

# Examples Gallery

Real-world examples and patterns using Intinya UI components.

---

## Pricing Section

```html
<script>
  import { Card, Button, Badge } from '@intinyagroup/ui';
</script>

<div class="grid gap-6 md:grid-cols-3">
  <Card>
    <div class="p-6 text-center">
      <h3 class="text-lg font-semibold">Starter</h3>
      <div class="mt-4 text-4xl font-bold">$9<span class="text-lg">/mo</span></div>
      <ul class="mt-6 space-y-2 text-sm">
        <li>✓ 1 Project</li>
        <li>✓ Basic features</li>
        <li>✓ Email support</li>
      </ul>
      <Button class="mt-6 w-full" variant="outline">Get Started</Button>
    </div>
  </Card>
  
  <Card class="border-2 border-[var(--ui-primary)]">
    <div class="p-6 text-center">
      <Badge class="mb-2">Popular</Badge>
      <h3 class="text-lg font-semibold">Pro</h3>
      <div class="mt-4 text-4xl font-bold">$29<span class="text-lg">/mo</span></div>
      <ul class="mt-6 space-y-2 text-sm">
        <li>✓ Unlimited projects</li>
        <li>✓ All features</li>
        <li>✓ Priority support</li>
      </ul>
      <Button class="mt-6 w-full">Get Started</Button>
    </div>
  </Card>
  
  <Card>
    <div class="p-6 text-center">
      <h3 class="text-lg font-semibold">Enterprise</h3>
      <div class="mt-4 text-4xl font-bold">$99<span class="text-lg">/mo</span></div>
      <ul class="mt-6 space-y-2 text-sm">
        <li>✓ Everything in Pro</li>
        <li>✓ Custom integrations</li>
        <li>✓ Dedicated support</li>
      </ul>
      <Button class="mt-6 w-full" variant="outline">Contact Sales</Button>
    </div>
  </Card>
</div>
```

---

## Login Form

```html
<script>
  import { Card, CardHeader, CardContent, CardFooter } from '@intinyagroup/ui';
  import { Button, Input, Label, Separator } from '@intinyagroup/ui';
</script>

<Card class="mx-auto w-full max-w-md">
  <CardHeader>
    <h2 class="text-2xl font-bold">Welcome back</h2>
    <p class="text-sm text-[var(--ui-muted-foreground)]">Sign in to your account</p>
  </CardHeader>
  <CardContent class="space-y-4">
    <div class="space-y-2">
      <Label for="email">Email</Label>
      <Input id="email" type="email" placeholder="name@example.com" />
    </div>
    <div class="space-y-2">
      <Label for="password">Password</Label>
      <Input id="password" type="password" placeholder="••••••••" />
    </div>
    <Button class="w-full">Sign In</Button>
    <Separator />
    <Button variant="outline" class="w-full">Continue with Google</Button>
  </CardContent>
  <CardFooter class="justify-center">
    <p class="text-sm text-[var(--ui-muted-foreground)]">
      Don't have an account? <a href="/signup" class="text-[var(--ui-primary)] hover:underline">Sign up</a>
    </p>
  </CardFooter>
</Card>
```

---

## Dashboard Stats

```html
<script>
  import { Card, CardContent } from '@intinyagroup/ui';
  import { TrendingUp, Users, DollarSign, Activity } from 'lucide-svelte';
</script>

<div class="grid gap-4 md:grid-cols-4">
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-[var(--ui-muted-foreground)]">Revenue</p>
          <p class="text-2xl font-bold">$45,231</p>
          <p class="text-xs text-green-500">+20.1% from last month</p>
        </div>
        <DollarSign class="size-8 text-[var(--ui-muted-foreground)]" />
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-[var(--ui-muted-foreground)]">Users</p>
          <p class="text-2xl font-bold">+2,350</p>
          <p class="text-xs text-green-500">+180.1% from last month</p>
        </div>
        <Users class="size-8 text-[var(--ui-muted-foreground)]" />
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-[var(--ui-muted-foreground)]">Sales</p>
          <p class="text-2xl font-bold">+12,234</p>
          <p class="text-xs text-green-500">+19% from last month</p>
        </div>
        <TrendingUp class="size-8 text-[var(--ui-muted-foreground)]" />
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-[var(--ui-muted-foreground)]">Active Now</p>
          <p class="text-2xl font-bold">+573</p>
          <p class="text-xs text-green-500">+201 since last hour</p>
        </div>
        <Activity class="size-8 text-[var(--ui-muted-foreground)]" />
      </div>
    </CardContent>
  </Card>
</div>
```

---

## Settings Form

```html
<script>
  import { Card, CardHeader, CardContent, CardFooter } from '@intinyagroup/ui';
  import { Button, Input, Label, Switch, Separator } from '@intinyagroup/ui';
</script>

<Card>
  <CardHeader>
    <h2 class="text-lg font-semibold">Settings</h2>
    <p class="text-sm text-[var(--ui-muted-foreground)]">Manage your account settings</p>
  </CardHeader>
  <CardContent class="space-y-6">
    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <Label for="name">Name</Label>
        <Input id="name" value="John Doe" />
      </div>
      <div class="space-y-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" value="john@example.com" />
      </div>
    </div>
    
    <Separator />
    
    <div class="space-y-4">
      <h3 class="font-medium">Notifications</h3>
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">Email notifications</p>
          <p class="text-sm text-[var(--ui-muted-foreground)]">Receive email about your account</p>
        </div>
        <Switch />
      </div>
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">Marketing emails</p>
          <p class="text-sm text-[var(--ui-muted-foreground)]">Receive tips and promotions</p>
        </div>
        <Switch />
      </div>
    </div>
  </CardContent>
  <CardFooter class="flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Save changes</Button>
  </CardFooter>
</Card>
```

---

## Feature Grid

```html
<script>
  import { Card, CardContent } from '@intinyagroup/ui';
  import { Zap, Shield, Globe, Code } from 'lucide-svelte';
</script>

<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardContent class="p-6 text-center">
      <Zap class="mx-auto mb-4 size-12 text-[var(--ui-primary)]" />
      <h3 class="font-semibold">Fast</h3>
      <p class="mt-2 text-sm text-[var(--ui-muted-foreground)]">Built for performance with Svelte 5</p>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent class="p-6 text-center">
      <Shield class="mx-auto mb-4 size-12 text-[var(--ui-primary)]" />
      <h3 class="font-semibold">Secure</h3>
      <p class="mt-2 text-sm text-[var(--ui-muted-foreground)]">Enterprise-grade security</p>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent class="p-6 text-center">
      <Globe class="mx-auto mb-4 size-12 text-[var(--ui-primary)]" />
      <h3 class="font-semibold">Global</h3>
      <p class="mt-2 text-sm text-[var(--ui-muted-foreground)]">CDN-backed worldwide</p>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent class="p-6 text-center">
      <Code class="mx-auto mb-4 size-12 text-[var(--ui-primary)]" />
      <h3 class="font-semibold">Developer First</h3>
      <p class="mt-2 text-sm text-[var(--ui-muted-foreground)]">Built for developers</p>
    </CardContent>
  </Card>
</div>
```

---

## Theme Showcase

Switch themes to see all examples change:

```html
<script>
  import { Button } from '@intinyagroup/ui';
</script>

<div class="flex flex-wrap gap-2">
  <Button onclick="document.documentElement.dataset.uiTheme='neutral'">shadcn</Button>
  <Button onclick="document.documentElement.dataset.uiTheme='md3'" variant="secondary">MD3</Button>
  <Button onclick="document.documentElement.dataset.uiTheme='cyberpunk'" variant="outline">Cyberpunk</Button>
  <Button onclick="document.documentElement.dataset.uiTheme='retro'" variant="ghost">Retro</Button>
</div>
```

---

## MD3 Components

```html
<script>
  import { FAB, Chip, NavigationBar } from '@intinyagroup/md3';
</script>

<!-- Floating Action Button -->
<FAB onclick={() => alert('Clicked!')}>+</FAB>

<!-- Chips -->
<div class="flex gap-2">
  <Chip>Default</Chip>
  <Chip variant="selected">Selected</Chip>
  <Chip variant="outlined">Outlined</Chip>
</div>
```

---

## Flat Geometric

```html
<script>
  import { HexagonGrid, OctagonCard, DiamondBadge } from '@intinyagroup/flat';
</script>

<HexagonGrid columns={3}>
  <OctagonCard color="blue" title="Feature 1" />
  <OctagonCard color="green" title="Feature 2" />
  <OctagonCard color="purple" title="Feature 3" />
</HexagonGrid>

<div class="flex gap-4">
  <DiamondBadge color="red" label="New" />
  <DiamondBadge color="blue" label="Beta" />
</div>
```

---

## More Examples

- [Components](/docs/components) — Browse all 86 components
- [Themes](/docs/themes) — Explore 9 theme directions
- [MD3 Components](/docs/components/badge) — Material Design 3
