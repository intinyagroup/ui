<script lang="ts">
  import {
    createFilterGroup,
    createFilterRule,
    getOperatorsForType,
    isFilterGroup,
    addRuleToGroup,
    removeRuleFromGroup,
    updateRuleInGroup,
    updateGroupInGroup,
    filterGroupToSQL,
    filterGroupToPredicate,
    type FilterGroup,
    type FilterRule,
    type FilterField,
    type FilterOperator,
    type FilterCondition,
  } from "@intinyagroup/grid-core";
  import { Button, Input, Select } from "@intinyagroup/ui";
  import { Plus, Trash2, Code2, Copy, Check, Filter } from "lucide-svelte";
  import { untrack } from "svelte";

  let {
    fields = [],
    value,
    maxDepth = 3,
    allowNot = true,
    showSql = false,
    class: className = "",
    onchange,
  }: {
    fields: FilterField[];
    value?: FilterGroup;
    maxDepth?: number;
    allowNot?: boolean;
    showSql?: boolean;
    class?: string;
    onchange?: (
      group: FilterGroup,
      meta: {
        sql: string;
        predicate: (item: Record<string, unknown>) => boolean;
      },
    ) => void;
  } = $props();

  const defaultRoot = untrack(() => {
    if (value) return value;
    const initialField = fields[0]?.id || "";
    return createFilterGroup("and", [createFilterRule(initialField)]);
  });

  let rootGroup = $state<FilterGroup>(defaultRoot);
  let showSqlPreview = $state(showSql);
  let copied = $state(false);

  // Synchronize external value if passed and changed
  $effect(() => {
    if (value && value.id !== rootGroup.id) {
      rootGroup = value;
    }
  });

  const sqlResult = $derived(filterGroupToSQL(rootGroup));
  const predicate = $derived(filterGroupToPredicate(rootGroup));

  function notifyChange(newGroup: FilterGroup) {
    rootGroup = newGroup;
    const meta = {
      sql: filterGroupToSQL(newGroup).sql,
      predicate: filterGroupToPredicate(newGroup),
    };
    onchange?.(newGroup, meta);
  }

  function handleAddRule(groupId: string) {
    const firstField = fields[0]?.id || "";
    const newRule = createFilterRule(firstField);
    notifyChange(addRuleToGroup(rootGroup, groupId, newRule));
  }

  function handleAddGroup(groupId: string) {
    const firstField = fields[0]?.id || "";
    const newGroup = createFilterGroup("and", [createFilterRule(firstField)]);
    notifyChange(addRuleToGroup(rootGroup, groupId, newGroup));
  }

  function handleRemove(id: string) {
    notifyChange(removeRuleFromGroup(rootGroup, id));
  }

  function handleFieldChange(ruleId: string, newField: string) {
    const fieldDef = fields.find((f) => f.id === newField);
    const validOperators = getOperatorsForType(fieldDef?.type || "string");
    notifyChange(
      updateRuleInGroup(rootGroup, ruleId, {
        field: newField,
        operator: validOperators[0] || "equals",
        value: "",
        valueTo: undefined,
      }),
    );
  }

  function handleOperatorChange(ruleId: string, newOp: FilterOperator) {
    notifyChange(
      updateRuleInGroup(rootGroup, ruleId, {
        operator: newOp,
      }),
    );
  }

  function handleValueChange(ruleId: string, val: unknown) {
    notifyChange(updateRuleInGroup(rootGroup, ruleId, { value: val }));
  }

  function handleValueToChange(ruleId: string, valTo: unknown) {
    notifyChange(updateRuleInGroup(rootGroup, ruleId, { valueTo: valTo }));
  }

  function handleConditionChange(groupId: string, condition: FilterCondition) {
    notifyChange(updateGroupInGroup(rootGroup, groupId, { condition }));
  }

  function handleNotToggle(groupId: string, currentNot: boolean | undefined) {
    notifyChange(updateGroupInGroup(rootGroup, groupId, { not: !currentNot }));
  }

  async function copySql() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(sqlResult.sql);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    }
  }

  function formatOperatorLabel(op: FilterOperator): string {
    switch (op) {
      case "equals":
        return "Equals";
      case "notEquals":
        return "Not equals";
      case "contains":
        return "Contains";
      case "notContains":
        return "Does not contain";
      case "startsWith":
        return "Starts with";
      case "endsWith":
        return "Ends with";
      case "greaterThan":
        return "> Greater than";
      case "greaterThanOrEqual":
        return ">= Greater or equal";
      case "lessThan":
        return "< Less than";
      case "lessThanOrEqual":
        return "<= Less or equal";
      case "between":
        return "Between";
      case "notBetween":
        return "Not between";
      case "in":
        return "In list";
      case "notIn":
        return "Not in list";
      case "isNull":
        return "Is null";
      case "isNotNull":
        return "Is not null";
      case "isEmpty":
        return "Is empty";
      case "isNotEmpty":
        return "Is not empty";
      default:
        return op;
    }
  }
</script>

{#snippet renderRule(rule: FilterRule, parentGroupId: string)}
  {@const fieldDef = fields.find((f) => f.id === rule.field)}
  {@const ops = getOperatorsForType(fieldDef?.type || "string")}
  {@const isBetween =
    rule.operator === "between" || rule.operator === "notBetween"}
  {@const noValueNeeded =
    rule.operator === "isNull" ||
    rule.operator === "isNotNull" ||
    rule.operator === "isEmpty" ||
    rule.operator === "isNotEmpty"}

  <div
    class="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-[var(--ui-muted)]/30 border border-[var(--ui-border)]/60 transition-all hover:border-[var(--ui-border)]"
    data-slot="query-builder-rule"
    data-rule-id={rule.id}
  >
    <!-- Field selection -->
    <select
      class="h-8 px-2.5 text-xs font-medium rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/40"
      value={rule.field}
      onchange={(e) => handleFieldChange(rule.id, e.currentTarget.value)}
      aria-label="Filter field"
    >
      {#each fields as f}
        <option value={f.id}>{f.label}</option>
      {/each}
    </select>

    <!-- Operator selection -->
    <select
      class="h-8 px-2.5 text-xs font-medium rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/40"
      value={rule.operator}
      onchange={(e) =>
        handleOperatorChange(rule.id, e.currentTarget.value as FilterOperator)}
      aria-label="Filter operator"
    >
      {#each ops as op}
        <option value={op}>{formatOperatorLabel(op)}</option>
      {/each}
    </select>

    <!-- Value input -->
    {#if !noValueNeeded}
      {#if fieldDef?.type === "boolean"}
        <select
          class="h-8 px-2.5 text-xs rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/40"
          value={String(rule.value ?? "true")}
          onchange={(e) =>
            handleValueChange(rule.id, e.currentTarget.value === "true")}
          aria-label="Filter boolean value"
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      {:else if fieldDef?.type === "select" && fieldDef.options}
        <select
          class="h-8 px-2.5 text-xs rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/40"
          value={String(rule.value ?? "")}
          onchange={(e) => handleValueChange(rule.id, e.currentTarget.value)}
          aria-label="Filter select option"
        >
          <option value="">Select option...</option>
          {#each fieldDef.options as opt}
            <option value={String(opt.value)}>{opt.label}</option>
          {/each}
        </select>
      {:else if isBetween}
        <div class="flex items-center gap-1.5">
          <input
            type={fieldDef?.type === "number"
              ? "number"
              : fieldDef?.type === "date"
                ? "date"
                : "text"}
            class="h-8 w-24 px-2.5 text-xs rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/40"
            placeholder="From"
            value={String(rule.value ?? "")}
            oninput={(e) => handleValueChange(rule.id, e.currentTarget.value)}
            aria-label="Between start value"
          />
          <span class="text-xs text-[var(--ui-muted-foreground)]">and</span>
          <input
            type={fieldDef?.type === "number"
              ? "number"
              : fieldDef?.type === "date"
                ? "date"
                : "text"}
            class="h-8 w-24 px-2.5 text-xs rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/40"
            placeholder="To"
            value={String(rule.valueTo ?? "")}
            oninput={(e) => handleValueToChange(rule.id, e.currentTarget.value)}
            aria-label="Between end value"
          />
        </div>
      {:else}
        <input
          type={fieldDef?.type === "number"
            ? "number"
            : fieldDef?.type === "date"
              ? "date"
              : "text"}
          class="h-8 min-w-[120px] flex-1 px-2.5 text-xs rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/40 placeholder:text-[var(--ui-muted-foreground)]"
          placeholder="Enter value..."
          value={String(rule.value ?? "")}
          oninput={(e) => handleValueChange(rule.id, e.currentTarget.value)}
          aria-label="Filter rule value"
        />
      {/if}
    {/if}

    <!-- Delete button -->
    <button
      type="button"
      class="p-1.5 rounded-md text-[var(--ui-muted-foreground)] hover:text-red-500 hover:bg-red-500/10 transition-colors ml-auto"
      onclick={() => handleRemove(rule.id)}
      title="Delete rule"
      aria-label="Delete rule"
    >
      <Trash2 class="size-3.5" />
    </button>
  </div>
{/snippet}

{#snippet renderGroup(group: FilterGroup, depth = 0)}
  <div
    class="space-y-3 p-3.5 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] transition-all shadow-xs"
    style="margin-left: {depth > 0 ? 1.25 : 0}rem"
    data-slot="query-builder-group"
    data-group-id={group.id}
  >
    <!-- Group header bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ui-border)]/50 pb-2.5"
    >
      <div class="flex items-center gap-2">
        <!-- AND / OR switch -->
        <div
          class="inline-flex rounded-lg p-0.5 bg-[var(--ui-muted)] border border-[var(--ui-border)]/50 text-xs"
        >
          <button
            type="button"
            class="px-2.5 py-1 rounded-md font-semibold transition-all {group.condition ===
            'and'
              ? 'bg-[var(--ui-background)] text-[var(--ui-foreground)] shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'}"
            onclick={() => handleConditionChange(group.id, "and")}
          >
            AND
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md font-semibold transition-all {group.condition ===
            'or'
              ? 'bg-[var(--ui-background)] text-[var(--ui-foreground)] shadow-xs'
              : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'}"
            onclick={() => handleConditionChange(group.id, "or")}
          >
            OR
          </button>
        </div>

        <!-- NOT button toggle -->
        {#if allowNot}
          <button
            type="button"
            class="h-7 px-2 text-[11px] font-semibold rounded-md border transition-all {group.not
              ? 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400'
              : 'border-[var(--ui-border)] text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-muted)]'}"
            onclick={() => handleNotToggle(group.id, group.not)}
            title="Invert this group result"
          >
            NOT
          </button>
        {/if}

        <span class="text-xs text-[var(--ui-muted-foreground)]">
          ({group.rules.length}
          {group.rules.length === 1 ? "rule" : "rules"})
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          class="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] hover:bg-[var(--ui-muted)] transition-colors"
          onclick={() => handleAddRule(group.id)}
        >
          <Plus class="size-3" />
          Rule
        </button>

        {#if depth < maxDepth}
          <button
            type="button"
            class="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] hover:bg-[var(--ui-muted)] transition-colors"
            onclick={() => handleAddGroup(group.id)}
          >
            <Plus class="size-3" />
            Group
          </button>
        {/if}

        {#if depth > 0}
          <button
            type="button"
            class="p-1.5 rounded-md text-[var(--ui-muted-foreground)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
            onclick={() => handleRemove(group.id)}
            title="Delete group"
          >
            <Trash2 class="size-3.5" />
          </button>
        {/if}
      </div>
    </div>

    <!-- Group Children (Rules + Sub-groups) -->
    <div class="space-y-2 pt-1">
      {#if group.rules.length === 0}
        <div
          class="py-4 text-center text-xs text-[var(--ui-muted-foreground)] border border-dashed border-[var(--ui-border)] rounded-lg"
        >
          No rules in this group. Click "+ Rule" to add one.
        </div>
      {:else}
        {#each group.rules as item (item.id)}
          {#if isFilterGroup(item)}
            {@render renderGroup(item, depth + 1)}
          {:else}
            {@render renderRule(item, group.id)}
          {/if}
        {/each}
      {/if}
    </div>
  </div>
{/snippet}

<div
  class="space-y-4 rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-background)] p-4 text-[var(--ui-foreground)] {className}"
  data-slot="query-builder"
>
  <!-- Header Bar -->
  <div
    class="flex items-center justify-between gap-2 pb-2 border-b border-[var(--ui-border)]/60"
  >
    <div class="flex items-center gap-2">
      <Filter class="size-4 text-[var(--ui-primary)]" />
      <h3 class="text-sm font-semibold tracking-tight">Query Builder</h3>
    </div>

    <button
      type="button"
      class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-[var(--ui-border)] hover:bg-[var(--ui-muted)] transition-colors {showSqlPreview
        ? 'bg-[var(--ui-muted)]'
        : ''}"
      onclick={() => (showSqlPreview = !showSqlPreview)}
      aria-label="Toggle SQL preview"
    >
      <Code2 class="size-3.5" />
      <span>SQL Preview</span>
    </button>
  </div>

  <!-- Root Group Rendering -->
  <div class="space-y-3">
    {@render renderGroup(rootGroup, 0)}
  </div>

  <!-- SQL Preview Panel -->
  {#if showSqlPreview}
    <div
      class="mt-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-muted)]/40 p-3 text-xs space-y-2"
    >
      <div
        class="flex items-center justify-between text-[var(--ui-muted-foreground)]"
      >
        <span class="font-medium uppercase tracking-wider text-[10px]"
          >Generated SQL WHERE Clause</span
        >
        <button
          type="button"
          class="inline-flex items-center gap-1 hover:text-[var(--ui-foreground)] transition-colors"
          onclick={copySql}
        >
          {#if copied}
            <Check class="size-3 text-emerald-500" />
            <span class="text-emerald-500 font-medium">Copied</span>
          {:else}
            <Copy class="size-3" />
            <span>Copy SQL</span>
          {/if}
        </button>
      </div>

      <pre
        class="font-mono text-xs overflow-x-auto p-2.5 rounded-lg bg-[var(--ui-card)] border border-[var(--ui-border)]/50 text-[var(--ui-foreground)] leading-relaxed">{sqlResult.sql}</pre>
    </div>
  {/if}
</div>
