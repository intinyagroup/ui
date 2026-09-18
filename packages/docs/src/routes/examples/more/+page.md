---
title: More Examples
description: Additional component examples and patterns
---

# More Examples

Advanced patterns and real-world use cases.

---

## E-commerce Product Card

```html
<script>
  import { Card, CardContent } from '@intinyagroup/ui';
  import { Button, Badge } from '@intinyagroup/ui';
  import { ShoppingCart, Heart } from 'lucide-svelte';
</script>

<Card class="overflow-hidden">
  <img src="/product.jpg" alt="Product" class="aspect-square w-full object-cover" />
  <CardContent class="p-4">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="font-semibold">Premium Headphones</h3>
        <p class="text-sm text-[var(--ui-muted-foreground)]">Wireless noise-canceling</p>
      </div>
      <Badge>New</Badge>
    </div>
    <div class="mt-4 flex items-center justify-between">
      <span class="text-2xl font-bold">$299</span>
      <div class="flex gap-2">
        <Button size="icon" variant="outline"><Heart class="size-4" /></Button>
        <Button size="icon"><ShoppingCart class="size-4" /></Button>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Notification Center

```html
<script>
  import { Card, CardHeader, CardContent } from '@intinyagroup/ui';
  import { Button, Badge } from '@intinyagroup/ui';
  import { Bell, Check, X } from 'lucide-svelte';
</script>

<Card>
  <CardHeader class="flex flex-row items-center justify-between">
    <h3 class="font-semibold">Notifications</h3>
    <Badge>3 new</Badge>
  </CardHeader>
  <CardContent class="space-y-3">
    <div class="flex items-start gap-3 rounded-lg border p-3">
      <Bell class="mt-0.5 size-4 text-[var(--ui-primary)]" />
      <div class="flex-1">
        <p class="text-sm font-medium">New comment on your post</p>
        <p class="text-xs text-[var(--ui-muted-foreground)]">2 minutes ago</p>
      </div>
      <Button size="icon" variant="ghost" class="size-8"><Check class="size-4" /></Button>
    </div>
    <div class="flex items-start gap-3 rounded-lg border p-3">
      <Bell class="mt-0.5 size-4 text-[var(--ui-primary)]" />
      <div class="flex-1">
        <p class="text-sm font-medium">Someone mentioned you</p>
        <p class="text-xs text-[var(--ui-muted-foreground)]">1 hour ago</p>
      </div>
      <Button size="icon" variant="ghost" class="size-8"><Check class="size-4" /></Button>
    </div>
    <Button variant="outline" class="w-full">View all</Button>
  </CardContent>
</Card>
```

---

## Team Members

```html
<script>
  import { Card, CardContent } from '@intinyagroup/ui';
  import { Button, Badge } from '@intinyagroup/ui';
</script>

<Card>
  <CardContent class="p-6">
    <h3 class="mb-4 font-semibold">Team Members</h3>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" class="size-10 rounded-full" alt="Alice" />
          <div>
            <p class="font-medium">Alice Johnson</p>
            <p class="text-sm text-[var(--ui-muted-foreground)]">alice@example.com</p>
          </div>
        </div>
        <Badge>Admin</Badge>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" class="size-10 rounded-full" alt="Bob" />
          <div>
            <p class="font-medium">Bob Smith</p>
            <p class="text-sm text-[var(--ui-muted-foreground)]">bob@example.com</p>
          </div>
        </div>
        <Badge variant="secondary">Member</Badge>
      </div>
      <Button variant="outline" class="w-full">Add member</Button>
    </div>
  </CardContent>
</Card>
```

---

## Progress Tracker

```html
<script>
  import { Card, CardContent } from '@intinyagroup/ui';
  import { Badge } from '@intinyagroup/ui';
</script>

<Card>
  <CardContent class="p-6">
    <h3 class="mb-4 font-semibold">Project Progress</h3>
    <div class="space-y-4">
      <div>
        <div class="mb-2 flex justify-between text-sm">
          <span>Design</span>
          <span class="text-[var(--ui-muted-foreground)]">100%</span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-[var(--ui-muted)]">
          <div class="h-full bg-green-500" style="width: 100%"></div>
        </div>
      </div>
      <div>
        <div class="mb-2 flex justify-between text-sm">
          <span>Development</span>
          <span class="text-[var(--ui-muted-foreground)]">65%</span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-[var(--ui-muted)]">
          <div class="h-full bg-[var(--ui-primary)]" style="width: 65%"></div>
        </div>
      </div>
      <div>
        <div class="mb-2 flex justify-between text-sm">
          <span>Testing</span>
          <span class="text-[var(--ui-muted-foreground)]">30%</span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-[var(--ui-muted)]">
          <div class="h-full bg-yellow-500" style="width: 30%"></div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Activity Feed

```html
<script>
  import { Card, CardContent } from '@intinyagroup/ui';
  import { Avatar } from '@intinyagroup/ui';
</script>

<Card>
  <CardContent class="p-6">
    <h3 class="mb-4 font-semibold">Recent Activity</h3>
    <div class="space-y-4">
      <div class="flex gap-3">
        <Avatar class="size-8">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User1" alt="User" />
        </Avatar>
        <div>
          <p class="text-sm"><span class="font-medium">John</span> pushed a commit</p>
          <p class="text-xs text-[var(--ui-muted-foreground)]">2 minutes ago</p>
        </div>
      </div>
      <div class="flex gap-3">
        <Avatar class="size-8">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User2" alt="User" />
        </Avatar>
        <div>
          <p class="text-sm"><span class="font-medium">Sarah</span> opened a PR</p>
          <p class="text-xs text-[var(--ui-muted-foreground)]">15 minutes ago</p>
        </div>
      </div>
      <div class="flex gap-3">
        <Avatar class="size-8">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User3" alt="User" />
        </Avatar>
        <div>
          <p class="text-sm"><span class="font-medium">Mike</span> merged a PR</p>
          <p class="text-xs text-[var(--ui-muted-foreground)]">1 hour ago</p>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Invoice Summary

```html
<script>
  import { Card, CardHeader, CardContent, CardFooter } from '@intinyagroup/ui';
  import { Button, Badge, Separator } from '@intinyagroup/ui';
  import { Download, Send } from 'lucide-svelte';
</script>

<Card>
  <CardHeader>
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">Invoice #1234</h3>
      <Badge variant="secondary">Pending</Badge>
    </div>
  </CardHeader>
  <CardContent class="space-y-4">
    <div class="flex justify-between text-sm">
      <span class="text-[var(--ui-muted-foreground)]">Subtotal</span>
      <span>$1,200.00</span>
    </div>
    <div class="flex justify-between text-sm">
      <span class="text-[var(--ui-muted-foreground)]">Tax (10%)</span>
      <span>$120.00</span>
    </div>
    <Separator />
    <div class="flex justify-between font-semibold">
      <span>Total</span>
      <span>$1,320.00</span>
    </div>
  </CardContent>
  <CardFooter class="flex gap-2">
    <Button variant="outline" class="flex-1"><Download class="mr-2 size-4" /> Download</Button>
    <Button class="flex-1"><Send class="mr-2 size-4" /> Send</Button>
  </CardFooter>
</Card>
```

---

## Status Board

```html
<script>
  import { Card, CardContent } from '@intinyagroup/ui';
  import { Badge } from '@intinyagroup/ui';
</script>

<div class="grid gap-4 md:grid-cols-3">
  <Card>
    <CardContent class="p-4">
      <div class="mb-2 flex items-center justify-between">
        <h4 class="font-medium">To Do</h4>
        <Badge variant="secondary">3</Badge>
      </div>
      <div class="space-y-2">
        <div class="rounded-lg border p-2 text-sm">Update documentation</div>
        <div class="rounded-lg border p-2 text-sm">Fix login bug</div>
        <div class="rounded-lg border p-2 text-sm">Add dark mode</div>
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent class="p-4">
      <div class="mb-2 flex items-center justify-between">
        <h4 class="font-medium">In Progress</h4>
        <Badge>2</Badge>
      </div>
      <div class="space-y-2">
        <div class="rounded-lg border border-[var(--ui-primary)] p-2 text-sm">Build dashboard</div>
        <div class="rounded-lg border border-[var(--ui-primary)] p-2 text-sm">API integration</div>
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent class="p-4">
      <div class="mb-2 flex items-center justify-between">
        <h4 class="font-medium">Done</h4>
        <Badge variant="outline">5</Badge>
      </div>
      <div class="space-y-2">
        <div class="rounded-lg border bg-[var(--ui-muted)] p-2 text-sm opacity-60">Setup project</div>
        <div class="rounded-lg border bg-[var(--ui-muted)] p-2 text-sm opacity-60">Design system</div>
      </div>
    </CardContent>
  </Card>
</div>
```

---

## Comparison Table

```html
<script>
  import { Card, CardContent } from '@intinyagroup/ui';
  import { Button, Badge } from '@intinyagroup/ui';
  import { Check, X } from 'lucide-svelte';
</script>

<Card>
  <CardContent class="p-6">
    <h3 class="mb-4 text-center text-lg font-semibold">Compare Plans</h3>
    <table class="w-full">
      <thead>
        <tr class="border-b">
          <th class="pb-3 text-left text-sm font-medium">Feature</th>
          <th class="pb-3 text-center text-sm font-medium">Free</th>
          <th class="pb-3 text-center text-sm font-medium">Pro</th>
        </tr>
      </thead>
      <tbody class="text-sm">
        <tr class="border-b">
          <td class="py-3">Projects</td>
          <td class="py-3 text-center">1</td>
          <td class="py-3 text-center">Unlimited</td>
        </tr>
        <tr class="border-b">
          <td class="py-3">Storage</td>
          <td class="py-3 text-center">1GB</td>
          <td class="py-3 text-center">100GB</td>
        </tr>
        <tr class="border-b">
          <td class="py-3">Support</td>
          <td class="py-3 text-center"><X class="mx-auto size-4 text-red-500" /></td>
          <td class="py-3 text-center"><Check class="mx-auto size-4 text-green-500" /></td>
        </tr>
        <tr>
          <td class="py-3"></td>
          <td class="py-3 text-center"><Button variant="outline" size="sm">Choose</Button></td>
          <td class="py-3 text-center"><Button size="sm">Choose</Button></td>
        </tr>
      </tbody>
    </table>
  </CardContent>
</Card>
```

---

## Authentication Card

Sign-in form with social buttons and validation.

```html
<script>
  import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@intinyagroup/ui';
</script>

<div class="flex min-h-[50vh] items-center justify-center">
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Welcome back</CardTitle>
      <CardDescription>Sign in to your account to continue</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center justify-between">
            <Label for="password">Password</Label>
            <a href="#" class="text-sm text-[var(--ui-primary)] hover:underline">Forgot password?</a>
          </div>
          <Input id="password" type="password" />
        </div>
        <Button class="w-full">Sign in</Button>
        <div class="relative my-2">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-[var(--ui-border)]"></span>
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="bg-[var(--ui-background)] px-2 text-[var(--ui-muted-foreground)]">or continue with</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <Button variant="outline">GitHub</Button>
          <Button variant="outline">Google</Button>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

---

## Dashboard Header

Sticky header with search, notifications, and user menu.

```html
<script>
  import { Button, Input, Avatar, AvatarFallback, Badge } from '@intinyagroup/ui';
  import { Bell, Search } from '@lucide/svelte';
</script>

<div class="flex items-center justify-between border-b border-[var(--ui-border)] px-6 py-4">
  <div>
    <h2 class="text-lg font-semibold">Overview</h2>
    <p class="text-sm text-[var(--ui-muted-foreground)]">Welcome back, Joshua</p>
  </div>
  <div class="flex items-center gap-3">
    <div class="relative">
      <Search class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[var(--ui-muted-foreground)]" />
      <Input placeholder="Search…" class="pl-8 w-56" />
    </div>
    <Button variant="outline" size="icon" class="relative">
      <Bell class="size-4" />
      <Badge class="absolute -right-1 -top-1 size-4 p-0 text-[10px]">3</Badge>
    </Button>
    <Avatar class="size-8">
      <AvatarFallback>AJ</AvatarFallback>
    </Avatar>
  </div>
</div>
```

---

## Settings Panel

Settings with sidebar categories and toggle rows.

```html
<script>
  import { Card, CardContent, CardHeader, CardTitle, Button, Switch, Label } from '@intinyagroup/ui';
</script>

<Card class="w-full max-w-lg">
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
  </CardHeader>
  <CardContent class="divide-y divide-[var(--ui-border)]">
    <div class="flex items-center justify-between py-3">
      <div>
        <p class="text-sm font-medium">Email notifications</p>
        <p class="text-xs text-[var(--ui-muted-foreground)]">Updates about your account</p>
      </div>
      <Switch checked />
    </div>
    <div class="flex items-center justify-between py-3">
      <div>
        <p class="text-sm font-medium">Product updates</p>
        <p class="text-xs text-[var(--ui-muted-foreground)]">New features and improvements</p>
      </div>
      <Switch />
    </div>
    <div class="flex items-center justify-between py-3">
      <div>
        <p class="text-sm font-medium">Weekly digest</p>
        <p class="text-xs text-[var(--ui-muted-foreground)]">A summary of your activity</p>
      </div>
      <Switch checked />
    </div>
    <div class="flex justify-end gap-2 pt-4">
      <Button variant="outline">Cancel</Button>
      <Button>Save changes</Button>
    </div>
  </CardContent>
</Card>
```

---

## Analytics Stats

Stat cards with trends and sparkline-style badges.

```html
<script>
  import { Card, CardContent } from '@intinyagroup/ui';
  import { TrendingUp, TrendingDown, Users, DollarSign, Activity } from '@lucide/svelte';
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <span class="text-sm text-[var(--ui-muted-foreground)]">Revenue</span>
        <DollarSign class="size-4 text-[var(--ui-primary)]" />
      </div>
      <p class="mt-2 text-2xl font-bold">$45,231</p>
      <p class="mt-1 flex items-center gap-1 text-xs text-green-500">
        <TrendingUp class="size-3" /> +20.1% from last month
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <span class="text-sm text-[var(--ui-muted-foreground)]">Users</span>
        <Users class="size-4 text-[var(--ui-primary)]" />
      </div>
      <p class="mt-2 text-2xl font-bold">+2,350</p>
      <p class="mt-1 flex items-center gap-1 text-xs text-green-500">
        <TrendingUp class="size-3" /> +180.1% this month
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <span class="text-sm text-[var(--ui-muted-foreground)]">Active</span>
        <Activity class="size-4 text-[var(--ui-primary)]" />
      </div>
      <p class="mt-2 text-2xl font-bold">12,234</p>
      <p class="mt-1 flex items-center gap-1 text-xs text-green-500">
        <TrendingUp class="size-3" /> +19% from last week
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <span class="text-sm text-[var(--ui-muted-foreground)]">Bounce rate</span>
        <TrendingDown class="size-4 text-red-500" />
      </div>
      <p class="mt-2 text-2xl font-bold">41.2%</p>
      <p class="mt-1 flex items-center gap-1 text-xs text-green-500">
        <TrendingDown class="size-3" /> -2.4% from last month
      </p>
    </CardContent>
  </Card>
</div>
```
