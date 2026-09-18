// ============================================
// @intinyagroup/grid-core — Filter AST & Query Builder Engine
// ============================================

export type FilterCondition = "and" | "or";

export type FilterOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual"
  | "between"
  | "notBetween"
  | "in"
  | "notIn"
  | "isNull"
  | "isNotNull"
  | "isEmpty"
  | "isNotEmpty";

export interface FilterField {
  id: string;
  label: string;
  type: "string" | "number" | "boolean" | "date" | "select";
  options?: Array<{ label: string; value: unknown }>;
}

export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value?: unknown;
  valueTo?: unknown;
}

export interface FilterGroup {
  id: string;
  condition: FilterCondition;
  not?: boolean;
  rules: Array<FilterRule | FilterGroup>;
}

let nextId = 1;
export function generateFilterId(prefix: "rule" | "group" = "rule"): string {
  return `${prefix}_${Date.now().toString(36)}_${(nextId++).toString(36)}`;
}

export function isFilterGroup(
  item: FilterRule | FilterGroup,
): item is FilterGroup {
  return (
    typeof item === "object" &&
    item !== null &&
    "condition" in item &&
    Array.isArray((item as FilterGroup).rules)
  );
}

export function createFilterRule(
  field = "",
  operator: FilterOperator = "equals",
  value?: unknown,
  valueTo?: unknown,
): FilterRule {
  return {
    id: generateFilterId("rule"),
    field,
    operator,
    value,
    valueTo,
  };
}

export function createFilterGroup(
  condition: FilterCondition = "and",
  rules: Array<FilterRule | FilterGroup> = [],
  not = false,
): FilterGroup {
  return {
    id: generateFilterId("group"),
    condition,
    not,
    rules,
  };
}

export function getOperatorsForType(
  type: FilterField["type"],
): FilterOperator[] {
  switch (type) {
    case "number":
    case "date":
      return [
        "equals",
        "notEquals",
        "greaterThan",
        "greaterThanOrEqual",
        "lessThan",
        "lessThanOrEqual",
        "between",
        "notBetween",
        "isNull",
        "isNotNull",
      ];
    case "boolean":
      return ["equals", "notEquals", "isNull", "isNotNull"];
    case "select":
      return ["equals", "notEquals", "in", "notIn", "isNull", "isNotNull"];
    case "string":
    default:
      return [
        "contains",
        "notContains",
        "equals",
        "notEquals",
        "startsWith",
        "endsWith",
        "isEmpty",
        "isNotEmpty",
        "isNull",
        "isNotNull",
      ];
  }
}

export function evaluateFilterRule(
  rule: FilterRule,
  item: Record<string, unknown>,
): boolean {
  if (!rule.field) return true;
  const rawValue = item[rule.field];

  switch (rule.operator) {
    case "isNull":
      return rawValue === null || rawValue === undefined;
    case "isNotNull":
      return rawValue !== null && rawValue !== undefined;
    case "isEmpty":
      return (
        rawValue === null ||
        rawValue === undefined ||
        (typeof rawValue === "string" && rawValue.trim() === "")
      );
    case "isNotEmpty":
      return (
        rawValue !== null &&
        rawValue !== undefined &&
        (typeof rawValue !== "string" || rawValue.trim() !== "")
      );
    case "equals": {
      if (rule.value === undefined || rule.value === "") return true;
      if (typeof rawValue === "string" && typeof rule.value === "string") {
        return rawValue.toLowerCase() === rule.value.toLowerCase();
      }
      return rawValue == rule.value;
    }
    case "notEquals": {
      if (rule.value === undefined || rule.value === "") return true;
      if (typeof rawValue === "string" && typeof rule.value === "string") {
        return rawValue.toLowerCase() !== rule.value.toLowerCase();
      }
      return rawValue != rule.value;
    }
    case "contains": {
      if (rule.value === undefined || rule.value === "") return true;
      return String(rawValue ?? "")
        .toLowerCase()
        .includes(String(rule.value).toLowerCase());
    }
    case "notContains": {
      if (rule.value === undefined || rule.value === "") return true;
      return !String(rawValue ?? "")
        .toLowerCase()
        .includes(String(rule.value).toLowerCase());
    }
    case "startsWith": {
      if (rule.value === undefined || rule.value === "") return true;
      return String(rawValue ?? "")
        .toLowerCase()
        .startsWith(String(rule.value).toLowerCase());
    }
    case "endsWith": {
      if (rule.value === undefined || rule.value === "") return true;
      return String(rawValue ?? "")
        .toLowerCase()
        .endsWith(String(rule.value).toLowerCase());
    }
    case "greaterThan": {
      if (rule.value === undefined || rule.value === "") return true;
      return Number(rawValue) > Number(rule.value);
    }
    case "greaterThanOrEqual": {
      if (rule.value === undefined || rule.value === "") return true;
      return Number(rawValue) >= Number(rule.value);
    }
    case "lessThan": {
      if (rule.value === undefined || rule.value === "") return true;
      return Number(rawValue) < Number(rule.value);
    }
    case "lessThanOrEqual": {
      if (rule.value === undefined || rule.value === "") return true;
      return Number(rawValue) <= Number(rule.value);
    }
    case "between": {
      if (rule.value === undefined || rule.valueTo === undefined) return true;
      const val = Number(rawValue);
      const min = Math.min(Number(rule.value), Number(rule.valueTo));
      const max = Math.max(Number(rule.value), Number(rule.valueTo));
      return val >= min && val <= max;
    }
    case "notBetween": {
      if (rule.value === undefined || rule.valueTo === undefined) return true;
      const val = Number(rawValue);
      const min = Math.min(Number(rule.value), Number(rule.valueTo));
      const max = Math.max(Number(rule.value), Number(rule.valueTo));
      return val < min || val > max;
    }
    case "in": {
      if (!Array.isArray(rule.value)) return true;
      return rule.value.some((candidate) => candidate == rawValue);
    }
    case "notIn": {
      if (!Array.isArray(rule.value)) return true;
      return !rule.value.some((candidate) => candidate == rawValue);
    }
    default:
      return true;
  }
}

export function evaluateFilterGroup(
  group: FilterGroup,
  item: Record<string, unknown>,
): boolean {
  if (!group.rules || group.rules.length === 0) return true;

  let matches: boolean;
  if (group.condition === "or") {
    matches = group.rules.some((child) =>
      isFilterGroup(child)
        ? evaluateFilterGroup(child, item)
        : evaluateFilterRule(child, item),
    );
  } else {
    // default: "and"
    matches = group.rules.every((child) =>
      isFilterGroup(child)
        ? evaluateFilterGroup(child, item)
        : evaluateFilterRule(child, item),
    );
  }

  return group.not ? !matches : matches;
}

export function filterGroupToPredicate<T = Record<string, unknown>>(
  group: FilterGroup,
): (item: T) => boolean {
  return (item: T) =>
    evaluateFilterGroup(group, item as Record<string, unknown>);
}

export function filterGroupToSQL(group: FilterGroup): {
  sql: string;
  params: unknown[];
} {
  const params: unknown[] = [];

  function compileRule(rule: FilterRule): string {
    const col = `"${rule.field.replace(/"/g, '""')}"`;
    switch (rule.operator) {
      case "isNull":
        return `${col} IS NULL`;
      case "isNotNull":
        return `${col} IS NOT NULL`;
      case "isEmpty":
        return `(${col} IS NULL OR ${col} = '')`;
      case "isNotEmpty":
        return `(${col} IS NOT NULL AND ${col} <> '')`;
      case "equals":
        params.push(rule.value);
        return `${col} = $${params.length}`;
      case "notEquals":
        params.push(rule.value);
        return `${col} <> $${params.length}`;
      case "contains":
        params.push(`%${rule.value}%`);
        return `${col} ILIKE $${params.length}`;
      case "notContains":
        params.push(`%${rule.value}%`);
        return `${col} NOT ILIKE $${params.length}`;
      case "startsWith":
        params.push(`${rule.value}%`);
        return `${col} ILIKE $${params.length}`;
      case "endsWith":
        params.push(`%${rule.value}`);
        return `${col} ILIKE $${params.length}`;
      case "greaterThan":
        params.push(rule.value);
        return `${col} > $${params.length}`;
      case "greaterThanOrEqual":
        params.push(rule.value);
        return `${col} >= $${params.length}`;
      case "lessThan":
        params.push(rule.value);
        return `${col} < $${params.length}`;
      case "lessThanOrEqual":
        params.push(rule.value);
        return `${col} <= $${params.length}`;
      case "between":
        params.push(rule.value);
        params.push(rule.valueTo);
        return `${col} BETWEEN $${params.length - 1} AND $${params.length}`;
      case "notBetween":
        params.push(rule.value);
        params.push(rule.valueTo);
        return `${col} NOT BETWEEN $${params.length - 1} AND $${params.length}`;
      case "in": {
        const list = Array.isArray(rule.value) ? rule.value : [rule.value];
        const placeholders = list.map((v) => {
          params.push(v);
          return `$${params.length}`;
        });
        return `${col} IN (${placeholders.join(", ")})`;
      }
      case "notIn": {
        const list = Array.isArray(rule.value) ? rule.value : [rule.value];
        const placeholders = list.map((v) => {
          params.push(v);
          return `$${params.length}`;
        });
        return `${col} NOT IN (${placeholders.join(", ")})`;
      }
      default:
        return "1=1";
    }
  }

  function compileGroup(g: FilterGroup): string {
    if (!g.rules || g.rules.length === 0) return "1=1";
    const parts = g.rules.map((child) =>
      isFilterGroup(child) ? compileGroup(child) : compileRule(child),
    );
    const glue = g.condition === "or" ? " OR " : " AND ";
    const combined = `(${parts.join(glue)})`;
    return g.not ? `NOT ${combined}` : combined;
  }

  const sql = compileGroup(group);
  return { sql, params };
}

export function filterGroupToJSON(group: FilterGroup): string {
  return JSON.stringify(group, null, 2);
}

export function filterGroupFromJSON(json: string): FilterGroup {
  return JSON.parse(json) as FilterGroup;
}

// Immutable tree operations for QueryBuilder state
export function addRuleToGroup(
  root: FilterGroup,
  targetGroupId: string,
  newItem: FilterRule | FilterGroup,
): FilterGroup {
  if (root.id === targetGroupId) {
    return {
      ...root,
      rules: [...root.rules, newItem],
    };
  }

  return {
    ...root,
    rules: root.rules.map((child) =>
      isFilterGroup(child)
        ? addRuleToGroup(child, targetGroupId, newItem)
        : child,
    ),
  };
}

export function removeRuleFromGroup(
  root: FilterGroup,
  targetId: string,
): FilterGroup {
  return {
    ...root,
    rules: root.rules
      .filter((child) => child.id !== targetId)
      .map((child) =>
        isFilterGroup(child) ? removeRuleFromGroup(child, targetId) : child,
      ),
  };
}

export function updateRuleInGroup(
  root: FilterGroup,
  ruleId: string,
  patch: Partial<FilterRule>,
): FilterGroup {
  return {
    ...root,
    rules: root.rules.map((child) => {
      if (isFilterGroup(child)) {
        return updateRuleInGroup(child, ruleId, patch);
      }
      if (child.id === ruleId) {
        return { ...child, ...patch };
      }
      return child;
    }),
  };
}

export function updateGroupInGroup(
  root: FilterGroup,
  groupId: string,
  patch: Partial<FilterGroup>,
): FilterGroup {
  if (root.id === groupId) {
    return { ...root, ...patch };
  }

  return {
    ...root,
    rules: root.rules.map((child) =>
      isFilterGroup(child) ? updateGroupInGroup(child, groupId, patch) : child,
    ),
  };
}
