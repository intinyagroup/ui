<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "$lib/utils.js";

  export type InputMaskProps = WithElementRef<
    Omit<HTMLInputAttributes, "type" | "value" | "oninput" | "onblur"> & {
      /** Mask pattern. `0` accepts digits, `A` letters, and `*` alphanumeric characters. */
      mask: string;
      value?: string;
      /** Unformatted characters matching mask tokens. Supports bind:rawValue. */
      rawValue?: string;
      oninput?: HTMLInputAttributes["oninput"];
      onblur?: HTMLInputAttributes["onblur"];
      /** Called after rawValue changes, with unformatted token characters. */
      onrawvaluechange?: (rawValue: string) => void;
      disabled?: boolean;
    }
  >;

  export type InputMaskToken = "0" | "A" | "*";
</script>

<script lang="ts">
  const tokenPattern: Record<InputMaskToken, RegExp> = {
    "0": /[0-9]/,
    A: /[A-Za-z]/,
    "*": /[A-Za-z0-9]/,
  };

  let {
    ref = $bindable(null),
    value = $bindable(""),
    rawValue = $bindable(""),
    mask,
    disabled = false,
    class: className,
    oninput,
    onblur,
    onrawvaluechange,
    ...restProps
  }: InputMaskProps = $props();

  let currentRaw = $state("");
  let initialized = $state(false);
  let lastValue = "";
  let lastRawValue = "";

  function isToken(character: string): character is InputMaskToken {
    return character === "0" || character === "A" || character === "*";
  }

  function accepts(character: string, token: InputMaskToken): boolean {
    return tokenPattern[token].test(character);
  }

  /** Extract token characters in mask order, dropping invalid input. */
  function sanitizeRaw(input: string): string {
    const result: string[] = [];
    let tokenIndex = 0;

    for (const character of input) {
      while (tokenIndex < mask.length && !isToken(mask[tokenIndex]))
        tokenIndex++;
      if (tokenIndex >= mask.length) break;
      const t = mask[tokenIndex];
      if (isToken(t) && accepts(character, t)) {
        result.push(character);
        tokenIndex++;
      }
    }

    return result.join("");
  }

  function formatRaw(raw: string): string {
    if (!raw) return "";

    const result: string[] = [];
    let rawIdx = 0;

    for (let i = 0; i < mask.length && rawIdx < raw.length; i++) {
      const m = mask[i];
      if (isToken(m)) {
        if (accepts(raw[rawIdx], m)) {
          result.push(raw[rawIdx]);
          rawIdx++;
        } else {
          break;
        }
      } else {
        result.push(m);
      }
    }

    return result.join("");
  }

  function formattedCaretForRawIndex(rawIndex: number): number {
    if (rawIndex <= 0) {
      for (let index = 0; index < mask.length; index++) {
        if (isToken(mask[index])) return index;
      }
      return 0;
    }

    let tokenCount = 0;
    for (let index = 0; index < mask.length; index++) {
      if (isToken(mask[index])) {
        tokenCount++;
        if (tokenCount >= rawIndex) {
          return index + 1;
        }
      }
    }
    return formatRaw(currentRaw).length;
  }

  function sync(nextRaw: string, input?: HTMLInputElement) {
    currentRaw = nextRaw;
    const nextValue = formatRaw(nextRaw);
    rawValue = nextRaw;
    value = nextValue;
    lastRawValue = nextRaw;
    lastValue = nextValue;

    if (input) {
      input.value = nextValue;
      const caret = formattedCaretForRawIndex(nextRaw.length);
      input.setSelectionRange(caret, caret);
    }
    onrawvaluechange?.(nextRaw);
  }

  // Keep controlled props and bindable rawValue in sync when parent changes either one.
  $effect(() => {
    const incomingValue = value ?? "";
    const incomingRawValue = rawValue ?? "";

    if (!initialized) {
      const nextRaw = incomingRawValue
        ? sanitizeRaw(incomingRawValue)
        : sanitizeRaw(incomingValue);
      currentRaw = nextRaw;
      const nextValue = formatRaw(nextRaw);
      rawValue = nextRaw;
      value = nextValue;
      lastRawValue = nextRaw;
      lastValue = nextValue;
      initialized = true;
      return;
    }

    if (incomingRawValue !== lastRawValue && incomingRawValue !== currentRaw) {
      sync(sanitizeRaw(incomingRawValue));
    } else if (
      incomingValue !== lastValue &&
      incomingValue !== formatRaw(currentRaw)
    ) {
      sync(sanitizeRaw(incomingValue));
    }
  });

  function handleInput(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const caret = input.selectionStart ?? input.value.length;
    const nextRaw = sanitizeRaw(input.value);
    const rawBeforeCaret = sanitizeRaw(input.value.slice(0, caret));
    const nextCaretRawIndex = Math.min(rawBeforeCaret.length, nextRaw.length);

    currentRaw = nextRaw;
    const nextValue = formatRaw(nextRaw);
    rawValue = nextRaw;
    value = nextValue;
    lastRawValue = nextRaw;
    lastValue = nextValue;
    input.value = nextValue;
    const nextCaret = formattedCaretForRawIndex(nextCaretRawIndex);
    input.setSelectionRange(nextCaret, nextCaret);
    onrawvaluechange?.(nextRaw);
    oninput?.(event as any);
  }

  function handleBlur(event: FocusEvent) {
    onblur?.(event as any);
  }
</script>

<input
  bind:this={ref}
  type="text"
  {value}
  {disabled}
  data-slot="input-mask"
  class={cn(
    "h-8 w-full min-w-0 rounded-lg border border-input bg-input px-2.5 py-1 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    className,
  )}
  oninput={handleInput}
  onblur={handleBlur}
  {...restProps}
/>
