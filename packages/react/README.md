# @intinyagroup/react

React component library for IntinyaGroup, powered by Ark UI (Zag.js state machine) and `@intinyagroup/tokens`.

## Features
- **Headless Power**: Built on `@ark-ui/react` for keyboard navigation, focus trap, and ARIA 1.2 compliance.
- **Shared Tokens**: Consumes `@intinyagroup/tokens` (CSS variables) for consistent theming across React & Svelte.
- **Tailwind Ready**: Styled with standard utility classes and `tailwind-variants`.

## Installation

```bash
pnpm add @intinyagroup/react @intinyagroup/tokens
# or
npm install @intinyagroup/react @intinyagroup/tokens
```

## Quick Start

```tsx
import React from 'react';
import { Button, Dialog, Card } from '@intinyagroup/react';
import '@intinyagroup/tokens/base.css'; // or cyberpunk.css, brutalist.css, etc.

export function App() {
  return (
    <Card className="p-6">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="default">Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Title>Hello from React</Dialog.Title>
              <Dialog.Description>
                This component uses Ark UI state machines and shared IntinyaGroup tokens!
              </Dialog.Description>
              <Dialog.CloseTrigger asChild>
                <Button variant="outline" size="sm">Close</Button>
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Portal>
      </Dialog.Root>
    </Card>
  );
}
```
