---
title: OTP Input
description: One-time password verification code input.
---

# OTP Input

An input for entering one-time passwords or verification codes, with separate character cells.

## Install

```bash
npx @intinyagroup/cli add otp-input
```

## Usage

```svelte
<script>
  import { OtpInput } from '@intinyagroup/ui';

  let code = $state('');
</script>

<OtpInput length={6} bind:value={code} />
<p>Code: {code}</p>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | '' | Current code value |
| length | number | 6 | Number of input cells |
| autoFocus | boolean | true | Focus first cell on mount |
| disabled | boolean | false | Disable all inputs |
| class | string | - | Additional CSS classes |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| complete | string | Fires when all cells are filled |
| change | string | Fires on each input change |

## Notes

- Auto-advances cursor to next cell on input.
- Supports paste of a full code string.
- Backspace moves to the previous cell.
