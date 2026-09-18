import Root, {
  type AppBarPosition,
  type AppBarVariant,
} from "./app-bar.svelte";
import Section, { type AppBarSectionAlign } from "./app-bar-section.svelte";
import Title from "./app-bar-title.svelte";
import Action from "./app-bar-action.svelte";

export {
  Root,
  Section,
  Title,
  Action,
  // Aliases
  Root as AppBar,
  Root as AppBarRoot,
  Section as AppBarSection,
  Title as AppBarTitle,
  Action as AppBarAction,
  type AppBarPosition,
  type AppBarVariant,
  type AppBarSectionAlign,
};
