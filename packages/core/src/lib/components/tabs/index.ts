import Content from "./tabs-content.svelte";
import Trigger from "./tabs-trigger.svelte";
import Root from "./tabs.svelte";
import List, {
  tabsListVariants,
  type TabsListVariant,
} from "./tabs-list.svelte";

/**
 * Namespace-merged root: supports both `<Tabs>`/`<TabsList>` (flat)
 * and `<Tabs.Root>`/`<Tabs.List>` (namespaced) usage.
 */
const Tabs = Object.assign(Root, {
  Root,
  Content,
  List,
  Trigger,
  tabsListVariants,
});

export {
  Root,
  Content,
  List,
  Trigger,
  tabsListVariants,
  type TabsListVariant,
  Tabs,
  Content as TabsContent,
  List as TabsList,
  Trigger as TabsTrigger,
};
