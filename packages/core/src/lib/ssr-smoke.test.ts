// @vitest-environment node
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import * as UI from "$lib/index.js";
import Input from "$lib/components/input/input.svelte";
import Badge from "$lib/components/badge/badge.svelte";
import Button from "$lib/components/button/Button.svelte";
import DialogRoot from "$lib/components/dialog/dialog.svelte";
import SheetRoot from "$lib/components/sheet/sheet.svelte";
import PopoverRoot from "$lib/components/popover/popover.svelte";
import TooltipRoot from "$lib/components/tooltip/tooltip.svelte";
import CommandRoot from "$lib/components/command/command.svelte";

describe("SSR smoke (node environment, no browser globals)", () => {
  it("library barrel imports without touching browser-only globals", () => {
    expect(UI).toBeDefined();
  });

  it("renders presentational primitives to HTML strings", () => {
    expect(render(Input, { props: { placeholder: "ssr" } }).body).toContain(
      "placeholder",
    );
    expect(render(Badge, { props: {} }).body).toContain('data-slot="badge"');
    expect(render(Button, { props: {} }).body).toContain("<button");
  });

  it("renders overlay roots without crashing (closed state)", () => {
    for (const Root of [
      DialogRoot,
      SheetRoot,
      PopoverRoot,
      TooltipRoot,
      CommandRoot,
    ]) {
      expect(() => render(Root, { props: {} })).not.toThrow();
    }
  });
});
