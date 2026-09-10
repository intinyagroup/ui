import Close from "./sheet-close.svelte";
import Content from "./sheet-content.svelte";
import Description from "./sheet-description.svelte";
import Footer from "./sheet-footer.svelte";
import Header from "./sheet-header.svelte";
import Overlay from "./sheet-overlay.svelte";
import Portal from "./sheet-portal.svelte";
import Title from "./sheet-title.svelte";
import Trigger from "./sheet-trigger.svelte";
import Root from "./sheet.svelte";

/**
 * Namespace-merged root: supports both `<Sheet>`/`<SheetContent>` (flat)
 * and `<Sheet.Root>`/`<Sheet.Content>` (namespaced) usage.
 */
const Sheet = Object.assign(Root, {
  Root,
  Close,
  Trigger,
  Portal,
  Overlay,
  Content,
  Header,
  Footer,
  Title,
  Description,
});

export {
  Root,
  Close,
  Trigger,
  Portal,
  Overlay,
  Content,
  Header,
  Footer,
  Title,
  Description,
  Sheet,
  Close as SheetClose,
  Trigger as SheetTrigger,
  Portal as SheetPortal,
  Overlay as SheetOverlay,
  Content as SheetContent,
  Header as SheetHeader,
  Footer as SheetFooter,
  Title as SheetTitle,
  Description as SheetDescription,
};
