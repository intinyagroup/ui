# Shared UI component conventions

This repository publishes `@intinyagroup/ui` from `packages/core`. Product applications should consume its public exports rather than copy package internals. This document describes conventions supported by this repository; application-specific routes, APIs, and domain behavior belong in the application repository.

## Component selection and ownership

- Prefer an existing `@intinyagroup/ui` export for common controls, overlays, navigation, feedback, and layout. Check `packages/core/src/lib/index.ts` and component package exports first.
- Compose primitives at the product-surface boundary. Keep domain data, URL state, permission checks, and mutations in the owning feature; shared components should not acquire application-specific API dependencies.
- Extract only repeated behavior or state. Do not add cosmetic wrappers that merely rename props or duplicate styling.
- Keep component-local implementation in its package folder; expose supported public APIs through that component's `index.ts` and the relevant package export. Do not import another package's private source paths.
- Preserve existing behavior during migrations: route/URL semantics, form submission, mutation timing, disabled/destructive states, and keyboard interactions.

## Forms and actions

- Use shared controls where their semantics fit: Button, Input, Textarea, Select, Checkbox, and related exported primitives. Keep native form semantics (`form`, labels, `type="submit"`, validation, and submit behavior).
- Give controls accessible names and associate help/error text. Do not replace a labeled control with a placeholder-only field.
- Keep destructive actions visibly distinct and disabled actions genuinely disabled. Do not change mutation or confirmation behavior while replacing presentation.
- Use `ActionMenu` only for repeated overflow/action-menu behavior. Do not wrap unrelated navigation dropdowns or selectors merely to standardize appearance.
- Use dialog/sheet primitives for modal task or detail surfaces when appropriate; preserve focus, dismissal, and return-to-context behavior.

## Cards, navigation, and state

- Use existing card/layout components to establish hierarchy; avoid nesting decorative cards without meaningful grouping.
- Use navigation components for navigation, not for commands that mutate data. Preserve link semantics and current URL behavior.
- Represent loading, error, and empty states explicitly and distinctly. Offer retry only where retry is meaningful. Keep loading content from accidentally displaying stale/error content as success.
- Async state composition may use `AsyncState` only after its referenced `LoadingState`, `ErrorState`, and `EmptyState` components exist and are exported; current `web/` contains only an untracked `AsyncState.svelte`, so it is not an established application API.

## Accessibility and interaction

- Prefer semantic elements and native controls. Provide accessible names for icon-only controls, correct roles only when native semantics are insufficient, and visible focus indication.
- Preserve keyboard operation, focus management, Escape/outside-click behavior, and disabled states when migrating menus, dialogs, and sheets.
- Respect reduced-motion preferences for custom transitions and avoid conveying state through color alone.
- Verify interactive behavior with tests or manual checks, not appearance alone.

## Migration workflow and verification

1. Inspect the target application source and its local instructions before editing. Do not infer missing routes, API contracts, or components from issue descriptions.
2. Identify an existing exported primitive and confirm its actual props and behavior in source/docs.
3. Migrate one compatible surface at a time; preserve domain logic and compare before/after behavior.
4. Run relevant checks from the owning package/application. For this UI library, `pnpm --filter @intinyagroup/ui check`, `pnpm --filter @intinyagroup/ui test`, and `pnpm --filter @intinyagroup/ui build` are package-level checks (run from repository root).
5. Review `git diff` to ensure unrelated edits remain untouched.

## Current scope and evidence

The checked-in repository is the `@intinyagroup/ui` component library and contains reusable primitives, including `packages/core/src/lib/components/actionsheet/ActionSheet.svelte`, `ActionSheetItem.svelte`, `packages/kanban/src/lib/components/KanbanBoard.svelte`, and Storybook examples such as `packages/storybook/stories/KanbanBoard.stories.ts`. It does not contain the named Midory application surfaces `BoardHeader`, `WorkItemDetailSheet`, project/knowledge/notification/admin action menus, nor an application `web` package manifest or routes. The only current file under `web/` is `web/src/lib/components/ui/AsyncState.svelte`; it imports three sibling components that are not present in the available tree. Therefore application migrations and application-specific reusable-pattern inventory cannot be verified here. Do not create substitute routes or APIs in this library repository.
