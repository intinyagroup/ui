import { describe, it, expect } from "vitest";
import {
  createFilterGroup,
  createFilterRule,
  evaluateFilterGroup,
  evaluateFilterRule,
  filterGroupToSQL,
  addRuleToGroup,
  removeRuleFromGroup,
  updateRuleInGroup,
  isFilterGroup,
} from "./filter-ast.js";

describe("filter-ast", () => {
  it("evaluates basic comparison rules correctly", () => {
    const item = { name: "Alice", age: 30, active: true, salary: 5000 };

    expect(
      evaluateFilterRule(createFilterRule("name", "equals", "alice"), item),
    ).toBe(true);
    expect(
      evaluateFilterRule(createFilterRule("name", "startsWith", "al"), item),
    ).toBe(true);
    expect(
      evaluateFilterRule(createFilterRule("name", "endsWith", "ce"), item),
    ).toBe(true);
    expect(
      evaluateFilterRule(createFilterRule("name", "contains", "lic"), item),
    ).toBe(true);

    expect(
      evaluateFilterRule(createFilterRule("age", "greaterThan", 25), item),
    ).toBe(true);
    expect(
      evaluateFilterRule(createFilterRule("age", "lessThan", 25), item),
    ).toBe(false);
    expect(
      evaluateFilterRule(
        createFilterRule("salary", "between", 4000, 6000),
        item,
      ),
    ).toBe(true);
  });

  it("evaluates nested groups with AND and OR logic", () => {
    const group = createFilterGroup("and", [
      createFilterRule("dept", "equals", "Engineering"),
      createFilterGroup("or", [
        createFilterRule("level", "equals", "Senior"),
        createFilterRule("salary", "greaterThan", 100000),
      ]),
    ]);

    expect(
      evaluateFilterGroup(group, {
        dept: "Engineering",
        level: "Senior",
        salary: 80000,
      }),
    ).toBe(true);

    expect(
      evaluateFilterGroup(group, {
        dept: "Engineering",
        level: "Junior",
        salary: 120000,
      }),
    ).toBe(true);

    expect(
      evaluateFilterGroup(group, {
        dept: "Sales",
        level: "Senior",
        salary: 150000,
      }),
    ).toBe(false);
  });

  it("generates SQL parameterized query", () => {
    const group = createFilterGroup("and", [
      createFilterRule("status", "equals", "active"),
      createFilterRule("score", "greaterThanOrEqual", 75),
    ]);

    const { sql, params } = filterGroupToSQL(group);
    expect(sql).toBe('("status" = $1 AND "score" >= $2)');
    expect(params).toEqual(["active", 75]);
  });

  it("supports immutable tree updates", () => {
    const root = createFilterGroup("and", [
      createFilterRule("name", "equals", "John"),
    ]);

    const ruleId = root.rules[0].id;
    const updated = updateRuleInGroup(root, ruleId, { value: "Jane" });
    const firstRule = updated.rules[0];
    if (!isFilterGroup(firstRule)) {
      expect(firstRule.value).toBe("Jane");
    }

    const withNewRule = addRuleToGroup(
      updated,
      root.id,
      createFilterRule("age", "greaterThan", 20),
    );
    expect(withNewRule.rules).toHaveLength(2);

    const removed = removeRuleFromGroup(withNewRule, ruleId);
    expect(removed.rules).toHaveLength(1);
    const remainingRule = removed.rules[0];
    if (!isFilterGroup(remainingRule)) {
      expect(remainingRule.field).toBe("age");
    }
  });
});
