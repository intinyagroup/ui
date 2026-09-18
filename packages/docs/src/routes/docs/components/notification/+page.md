---
title: Notification
description: Button that requests notification permission and shows a Web Notification, with a demo fallback.
---

# Notification

A button that requests notification permission and fires a Web Notification. Handles all permission states (`default`, `granted`, `denied`, `unsupported`) and simulates a demo when the API is unavailable or permission is denied.

## Usage

```svelte
<script>
  import { NotificationButton } from '@intinyagroup/ui';
</script>

<NotificationButton
  title="New message"
  body="You have 1 unread message"
  icon="/logo.png"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Notification title |
| `body` | `string` | `''` | Notification body |
| `icon` | `string` | — | Optional notification icon URL |
| `onClick` | `() => void` | — | Called when the button is pressed |
| `class` | `string` | — | Additional CSS classes |

## Features

- Requests permission on first use, then notifies.
- Reflects the current permission state in its label.
- Falls back to `serviceWorker.showNotification` when direct construction fails.
- Simulates a demo when notifications are unsupported or blocked.
- Initializes the permission label on mount.