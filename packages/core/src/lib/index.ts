// ============================================
// @intinyagroup/ui — Component Exports
// ============================================

// Primitives
export { Badge } from './components/badge/index.js';
export { Button } from './components/button/index.js';
export { Input } from './components/input/index.js';
export { Textarea } from './components/textarea/index.js';
export { Label } from './components/label/index.js';
export { Separator } from './components/separator/index.js';
export { Avatar, AvatarFallback, AvatarImage } from './components/avatar/index.js';

// Layout
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/card/index.js';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs/index.js';
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/accordion/index.js';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './components/collapsible/index.js';
export { AspectRatio } from './components/aspect-ratio/index.js';
export { ScrollArea, ScrollBar } from './components/scroll-area/index.js';
export { Flex } from './components/flex/index.js';
export { Stack } from './components/stack/index.js';
export { Grid } from './components/grid/index.js';
export { Box } from './components/box/index.js';

// Navigation
export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './components/breadcrumb/index.js';
export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from './components/navigation-menu/index.js';

// Overlay
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './components/dialog/index.js';
export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from './components/sheet/index.js';
export { Popover, PopoverTrigger, PopoverContent } from './components/popover/index.js';
export { HoverCard, HoverCardContent, HoverCardTrigger } from './components/hover-card/index.js';
export { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from './components/alert-dialog/index.js';

// Menu
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from './components/dropdown-menu/index.js';
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel } from './components/context-menu/index.js';
export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel } from './components/menubar/index.js';
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from './components/command/index.js';

// Data
export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from './components/table/index.js';
export { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from './components/pagination/index.js';
export { DataTable, type ColumnDef as DataTableColumnDef, type DataTableProps } from './components/data-table/index.js';

// Form
export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from './components/select/index.js';
export { Checkbox } from './components/checkbox/index.js';
export { RadioGroup, RadioGroupItem } from './components/radio-group/index.js';
export { Slider } from './components/slider/index.js';
export { Switch } from './components/switch/index.js';
export { Toggle } from './components/toggle/index.js';
export { ToggleGroup, ToggleGroupItem } from './components/toggle-group/index.js';
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './components/form/index.js';
export { NumberInput } from './components/number-input/index.js';
export { Rating } from './components/rating/index.js';
export { CopyToClipboard } from './components/copy-to-clipboard/index.js';
export { SignaturePad } from './components/signature-pad/index.js';
export { OTPInput } from './components/otp-input/index.js';
export { PasswordInput } from './components/password-input/index.js';
export { validators, createFormValidator } from './components/validate/index.js';
export type { ValidationRule } from './components/validate/index.js';
export { ValidationMessage, FormInput, FormSelect, FormTextarea, FormGroup } from './components/validate/index.js';
export { SearchSelect, type SearchSelectOption } from './components/search-select/index.js';

// Feedback
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/tooltip/index.js';
export { Progress } from './components/progress/index.js';
export { Skeleton } from './components/skeleton/index.js';
export { Alert, AlertTitle, AlertDescription } from './components/alert/index.js';
export { Toast, toasts } from './components/toast/index.js';

// Wizard / Multi-step
export { Stepper } from './components/stepper/index.js';

// File Management
export { FileUploader } from './components/file-uploader/index.js';

// Data Display
export { Timeline, TimelineItem, TimelineDot } from './components/timeline/index.js';
export { TreeView } from './components/tree-view/index.js';
export { ColorPicker } from './components/color-picker/index.js';
export { DateTimePicker } from './components/datetime-picker/index.js';
export { CodeBlock } from './components/code-block/index.js';
export { MarkdownRenderer } from './components/markdown-renderer/index.js';
export { AvatarGroup } from './components/avatar-group/index.js';
export { EmptyState } from './components/empty-state/index.js';
export { StatCard } from './components/stat-card/index.js';
export { Divider } from './components/divider/index.js';
export { SectionHeader } from './components/section-header/index.js';

// Semantic wrappers
export { Aside } from './components/aside/index.js';
export { Section } from './components/section/index.js';
export { Figure, Figcaption } from './components/figure/index.js';
export { Details, Summary } from './components/details/index.js';
export { Main } from './components/main/index.js';
export { KanbanBoard, KanbanColumn, KanbanCard } from './components/kanban/index.js';
export type { KanbanCardType, KanbanColumnType } from './components/kanban/index.js';

// Marketing / Composite (from ui.live)
export { Hero } from './components/hero/index.js';
export { PricingCard } from './components/pricing-card/index.js';
export { Testimonial } from './components/testimonial/index.js';
export { FeatureGrid } from './components/feature-grid/index.js';
export { CTASection } from './components/cta-section/index.js';
export { Footer } from './components/footer/index.js';
export { Navbar } from './components/navbar/index.js';
export { BentoGrid } from './components/bento-grid/index.js';
export { Stats } from './components/stats/index.js';
export { Carousel } from './components/carousel/index.js';
export { TestimonialCarousel } from './components/testimonial-carousel/index.js';
export { PricingTable, PricingCard as PricingTableCard } from './components/pricing-table/index.js';

// Infinite Scroll
export { InfiniteScroll } from './components/infinite-scroll/index.js';

// QR Code
export { QRCode } from './components/qr-code/index.js';

// Barcode
export { Barcode } from './components/barcode/index.js';

// Virtual List
export { VirtualList } from './components/virtual-list/index.js';

// Mention
export { Mention, type MentionUser } from './components/mention/index.js';
// Split View
export { SplitView } from './components/split-view/index.js';
// i18n
export { LocaleProvider, localeStore, setLocale, getLocale, t, formatDate, formatNumber, formatCurrency } from './i18n/index.js';
export type { LocaleConfig } from './i18n/index.js';

// Mobile components
export { TabBar, TabBarItem } from './components/tabbar/index.js';
export { ActionSheet, ActionSheetItem } from './components/actionsheet/index.js';
export { PullToRefresh } from './components/pulltorefresh/index.js';
export { SwipeableItem } from './components/swipeableitem/index.js';
export { ListView, ListItem } from './components/listview/index.js';
export { FabMenu } from './components/fabmenu/index.js';
export { SlideMenu } from './components/slidemenu/index.js';
export { MobileToast } from './components/mobile-toast/index.js';
export { SegmentedControl } from './components/segmentedcontrol/index.js';
export { AvatarStack } from './components/avatarstack/index.js';

// Device capabilities
export { Gyroscope } from './components/gyroscope/index.js';
export { CameraCapture } from './components/camera/index.js';
export { GalleryPicker } from './components/gallery/index.js';
export { ClipboardButton } from './components/clipboard/index.js';
export { NotificationButton } from './components/notification/index.js';

// Social
export { CommentSection, type CommentItem } from './components/comment/index.js';
export { ReactionBar, type Reaction } from './components/reaction-bar/index.js';
export { UserProfileCard, type ProfileStat, type ProfileSocial } from './components/user-profile-card/index.js';
export { LiveBadge, FollowBadge } from './components/live-badge/index.js';
export { StatusIndicator } from './components/status-indicator/index.js';
export { EditableLabel } from './components/editable-label/index.js';
export { ProgressSteps, type Step } from './components/progress-steps/index.js';

// Data Visualization
export { Heatmap, type HeatmapCell } from './components/heatmap/index.js';

// Utils
export { cn, formatBytes, formatRelativeDate, getFileExtension, isImageFile, isTextFile } from './utils.js';
// Unit conversion
export {
  convertUnit,
  mmToPx, pxToMm, cmToPx, pxToCm,
  inchToPx, pxToInch, ptToPx, pxToPt,
  emToPx, pxToEm,
  formatUnit, parseCssValue, getPageDimensions,
  cssUnits,
} from './utils/unit-conversion.js';

// RTL/LTR & Emoji
export {
  isRTL, isRTLLanguage, getTextDirection,
  wrapBidi, addRTLMark, addLTRMark, getDirectionStyle,
  BIDI_CHARS, RTL_LANGUAGES,
  emojiCategories, searchEmojis, getRecentEmojis, addRecentEmoji,
} from './utils/bidi-emoji.js';

// Emoji Picker
export { default as EmojiPicker } from './components/emoji/EmojiPicker.svelte';
// Calendar
export { Calendar } from './components/calendar/index.js';

// Types
export type { ComponentVariant, ComponentSize } from './types.js';
