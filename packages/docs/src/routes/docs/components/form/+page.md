# Form

Form components for building accessible forms with validation. Built on formsnap + sveltekit-superforms.

## Install

```bash
npx @intinyagroup/cli add form
```

## Usage

```svelte
<script>
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
  } from '@intinyagroup/ui';
  import { Input } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
  import { superForm } from 'sveltekit-superforms';

  const { form, enhance } = superForm(data.form);
</script>

<Form method="POST" use:enhance>
  <FormField {form} name="username">
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input bind:value={$form.username} placeholder="Enter username" />
      </FormControl>
      <FormDescription>This is your public display name.</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
  <Button type="submit">Submit</Button>
</Form>
```

## Structure

- `Form` — root form element with SuperForms enhance
- `FormField` — connects a field to the form schema (requires `form` and `name`)
- `FormItem` — layout wrapper for label + control + errors
- `FormLabel` — accessible label (highlights on error)
- `FormControl` — wraps the input control
- `FormDescription` — help text below the field
- `FormMessage` / `FieldErrors` — validation error display
- `FormFieldset` / `FormLegend` — fieldset grouping

## Props

| Sub-component | Description |
|---------------|-------------|
| `FormField` | Requires `form` and `name` — provides `value`, `errors`, `constraints` via snippet |
| `FormLabel` | Auto-highlights red when the field has errors |
| `FormMessage` | Renders the first validation error for the field |
