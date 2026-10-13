/**
 * Lightweight command palette state.
 * Provides shared context for search, filtering, selection, and keyboard navigation.
 */
import { getContext, setContext } from "svelte";

const SCORE_CONTINUE_MATCH = 1;
const SCORE_SPACE_WORD_JUMP = 0.9;
const SCORE_NON_SPACE_WORD_JUMP = 0.8;
const SCORE_CHARACTER_JUMP = 0.17;
const SCORE_TRANSPOSITION = 0.1;
const PENALTY_SKIPPED = 0.999;
const PENALTY_CASE_MISMATCH = 0.9999;
const PENALTY_NOT_COMPLETE = 0.99;
const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/;
const COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g;
const IS_SPACE_REGEXP = /[\s-]/;
const COUNT_SPACE_REGEXP = /[\s-]/g;

function formatInput(string: string): string {
  return string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}

function computeCommandScoreInner(
  command: string,
  abbreviation: string,
  lowerCommand: string,
  lowerAbbreviation: string,
  commandIndex: number,
  abbrIndex: number,
  memo: Record<string, number>,
): number {
  if (abbrIndex === abbreviation.length) {
    return commandIndex === command.length
      ? SCORE_CONTINUE_MATCH
      : PENALTY_NOT_COMPLETE;
  }
  const key = `${commandIndex},${abbrIndex}`;
  if (memo[key] !== undefined) return memo[key];

  const abbrChar = lowerAbbreviation.charAt(abbrIndex);
  let index = lowerCommand.indexOf(abbrChar, commandIndex);
  let highScore = 0;

  while (index >= 0) {
    let score = computeCommandScoreInner(
      command,
      abbreviation,
      lowerCommand,
      lowerAbbreviation,
      index + 1,
      abbrIndex + 1,
      memo,
    );

    if (score > highScore) {
      if (index === commandIndex) {
        score *= SCORE_CONTINUE_MATCH;
      } else if (IS_GAP_REGEXP.test(command.charAt(index - 1))) {
        score *= SCORE_NON_SPACE_WORD_JUMP;
        const gaps = command
          .slice(commandIndex, index - 1)
          .match(COUNT_GAPS_REGEXP);
        if (gaps && commandIndex > 0) score *= PENALTY_SKIPPED ** gaps.length;
      } else if (IS_SPACE_REGEXP.test(command.charAt(index - 1))) {
        score *= SCORE_SPACE_WORD_JUMP;
        const spaces = command
          .slice(commandIndex, index - 1)
          .match(COUNT_SPACE_REGEXP);
        if (spaces && commandIndex > 0)
          score *= PENALTY_SKIPPED ** spaces.length;
      } else {
        score *= SCORE_CHARACTER_JUMP;
        if (commandIndex > 0)
          score *= PENALTY_SKIPPED ** (index - commandIndex);
      }
      if (command.charAt(index) !== abbreviation.charAt(abbrIndex)) {
        score *= PENALTY_CASE_MISMATCH;
      }
    }

    if (
      (score < SCORE_TRANSPOSITION &&
        lowerCommand.charAt(index - 1) ===
          lowerAbbreviation.charAt(abbrIndex + 1)) ||
      (lowerAbbreviation.charAt(abbrIndex + 1) ===
        lowerAbbreviation.charAt(abbrIndex) &&
        lowerCommand.charAt(index - 1) !== lowerAbbreviation.charAt(abbrIndex))
    ) {
      const ts = computeCommandScoreInner(
        command,
        abbreviation,
        lowerCommand,
        lowerAbbreviation,
        index + 1,
        abbrIndex + 2,
        memo,
      );
      if (ts * SCORE_TRANSPOSITION > score) score = ts * SCORE_TRANSPOSITION;
    }

    if (score > highScore) highScore = score;
    index = lowerCommand.indexOf(abbrChar, index + 1);
  }

  memo[key] = highScore;
  return highScore;
}

export function computeCommandScore(
  command: string,
  search: string,
  keywords?: string[],
): number {
  const full =
    keywords && keywords.length > 0
      ? `${command} ${keywords.join(" ")}`
      : command;
  return computeCommandScoreInner(
    full,
    search,
    formatInput(full),
    formatInput(search),
    0,
    0,
    {},
  );
}

// ---------- Types ----------

export type CommandItemData = {
  value: string;
  keywords?: string[];
  el: HTMLElement;
  forceMount?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};

export type CommandGroupData = {
  value: string;
  heading?: string;
  el: HTMLElement;
  forceMount?: boolean;
};

export type CommandFilteredState = {
  count: number;
  items: Map<string, number>;
  groups: Set<string>;
};

export type CommandState = {
  search: string;
  value: string;
  filtered: CommandFilteredState;
};

export type CommandContext = {
  search: string;
  setSearch: (v: string) => void;
  value: string;
  setValue: (v: string) => void;
  shouldFilter: boolean;
  filter: (value: string, search: string, keywords?: string[]) => number;
  loop: boolean;
  inputNode: HTMLElement | null;
  setInputNode: (el: HTMLElement | null) => void;
  viewportNode: HTMLElement | null;
  setViewportNode: (el: HTMLElement | null) => void;
  items: Map<string, CommandItemData>;
  groups: Map<string, CommandGroupData>;
  groupItems: Map<string, Set<string>>;
  registerItem: (data: CommandItemData) => void;
  unregisterItem: (value: string) => void;
  registerGroup: (data: CommandGroupData) => void;
  unregisterGroup: (value: string) => void;
  addItemToGroup: (groupValue: string, itemValue: string) => void;
  removeItemFromGroup: (groupValue: string, itemValue: string) => void;
  getValidItems: () => HTMLElement[];
  moveSelection: (dir: 1 | -1) => void;
  setSelectedIndex: (index: number) => void;
  selectedIndex: number;
  filtered: CommandFilteredState;
  key: number;
};

const COMMAND_CONTEXT_KEY = Symbol("command-context");

export function setCommandContext(ctx: CommandContext): CommandContext {
  return setContext(COMMAND_CONTEXT_KEY, ctx);
}

export function getCommandContext(): CommandContext {
  return getContext(COMMAND_CONTEXT_KEY);
}
