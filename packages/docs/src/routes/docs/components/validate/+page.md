---
title: Validate
description: Client-side form validation with custom validators and Zod
---

# Validate

Client-side form validation system with built-in validators, custom rules, and Zod adapter.

## Install

```bash
npx @intinyagroup/cli add validate
```

## Usage

### Custom validators

```html
<script>
  import { FormInput, FormGroup, validators } from '@intinyagroup/ui';
  
  let email = $state('');
  let emailError = $state(null);
</script>

<FormGroup legend="Contact">
  <FormInput
    label="Email"
    rules={[validators.required(), validators.email()]}
    bind:value={email}
    bind:error={emailError}
  />
</FormGroup>
```

### Zod adapter

```html
<script>
  import { z } from 'zod';
  import { createZodValidator, FormInput, zodRules } from '@intinyagroup/ui';

  const schema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Minimal 8 karakter')
  });

  const validator = createZodValidator(schema);
  
  function onSubmit() {
    const result = validator.validate(form);
    if (!result.valid) {
      console.log(result.errors);
    }
  }
</script>

<FormInput label="Email" rules={zodRules(schema.shape.email)} />
```

## Components

| Component | Description |
|-----------|-------------|
| `FormInput` | Validated input wrapper |
| `FormSelect` | Validated select wrapper |
| `FormTextarea` | Validated textarea wrapper |
| `FormGroup` | Fieldset with legend |
| `ValidationMessage` | Error display |

## Validators

| Validator | Description |
|-----------|-------------|
| `required()` | Field must not be empty |
| `minLength(n)` | Min characters |
| `maxLength(n)` | Max characters |
| `email()` | Valid email format |
| `url()` | Valid URL |
| `pattern(regex)` | Custom regex |
| `min(n)` | Min number |
| `max(n)` | Max number |
| `phone()` | Valid phone format |
| `numeric()` | Must be a number |

## Zod API

| Function | Description |
|----------|-------------|
| `zodRules(schema)` | Convert Zod schema to rules |
| `createZodValidator(schema)` | Full validator from Zod schema |

## Features

- Validate on blur
- Re-validate on change (after touched)
- aria-invalid on error
- role=alert error messages
- Optional zod (peer dependency)
