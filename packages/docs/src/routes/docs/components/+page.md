# Components

155 standalone components — copy into your project with the CLI.

```bash
npx @intinyagroup/cli add <component-name>
```

The CLI resolves transitive dependencies automatically and supports core, MD3, and Flat components.

## Quick Start

```bash
npx @intinyagroup/cli add button card dialog input        # Core
npx @intinyagroup/cli add fab chip snackbar                # MD3
npx @intinyagroup/cli add blob-card hexagon-grid           # Flat
```

## Actions

| Component | Description | Install |
|-----------|-------------|---------|
| [button](/docs/components/button) |  | `npx @intinyagroup/cli add button` |
| [FAB](/docs/components/md3-fab) | Floating Action Button — Material Design 3 component for primary actions. | `npx @intinyagroup/cli add fab` (from @intinyagroup/md3) |

## Layout

| Component | Description | Install |
|-----------|-------------|---------|
| [aside](/docs/components/aside) | Semantic aside element for sidebar or tangential content. | `npx @intinyagroup/cli add aside` |
| [aspect-ratio](/docs/components/aspect-ratio) | Container that maintains a specific aspect ratio. | `npx @intinyagroup/cli add aspect-ratio` |
| [box](/docs/components/box) | Generic layout container that renders as any element with token-based padding. | `npx @intinyagroup/cli add box` |
| [card](/docs/components/card) |  | `npx @intinyagroup/cli add card` |
| [details](/docs/components/details) | Collapsible details/summary element. | `npx @intinyagroup/cli add details` |
| [divider](/docs/components/divider) | Visual divider or separator between content sections. | `npx @intinyagroup/cli add divider` |
| [figure](/docs/components/figure) | Figure element with an optional caption. | `npx @intinyagroup/cli add figure` |
| [flex](/docs/components/flex) | Flexbox layout container with direction, alignment, justification, gap, and wrap props. | `npx @intinyagroup/cli add flex` |
| [grid](/docs/components/grid) | Responsive CSS grid container with responsive column overrides and token gaps. | `npx @intinyagroup/cli add grid` |
| [resizable](/docs/components/resizable) | Resizable panels with drag handles. | `npx @intinyagroup/cli add resizable` |
| [scroll-area](/docs/components/scroll-area) | Custom-styled scrollbar container. | `npx @intinyagroup/cli add scroll-area` |
| [section](/docs/components/section) | Semantic section element for grouping content. | `npx @intinyagroup/cli add section` |
| [separator](/docs/components/separator) |  | `npx @intinyagroup/cli add separator` |
| [stack](/docs/components/stack) | Vertical flex container with token gaps and an optional divider between children. | `npx @intinyagroup/cli add stack` |

## Navigation

| Component | Description | Install |
|-----------|-------------|---------|
| [accordion](/docs/components/accordion) |  | `npx @intinyagroup/cli add accordion` |
| [breadcrumb](/docs/components/breadcrumb) |  | `npx @intinyagroup/cli add breadcrumb` |
| [drawer](/docs/components/drawer) |  | `npx @intinyagroup/cli add drawer` |
| [dropdown-menu](/docs/components/dropdown-menu) |  | `npx @intinyagroup/cli add dropdown-menu` |
| [menubar](/docs/components/menubar) | Application menu bar with dropdown menus. | `npx @intinyagroup/cli add menubar` |
| [navigation-menu](/docs/components/navigation-menu) |  | `npx @intinyagroup/cli add navigation-menu` |
| [NavigationBar](/docs/components/md3-navigation-bar) | Material Design 3 bottom navigation bar for mobile layouts. | `npx @intinyagroup/cli add navigation-bar` (from @intinyagroup/md3) |
| [NavigationRail](/docs/components/md3-navigation-rail) | Material Design 3 vertical navigation for tablet and desktop layouts. | `npx @intinyagroup/cli add navigation-rail` (from @intinyagroup/md3) |
| [pagination](/docs/components/pagination) |  | `npx @intinyagroup/cli add pagination` |
| [sidebar](/docs/components/sidebar) |  | `npx @intinyagroup/cli add sidebar` |
| [slidemenu](/docs/components/slidemenu) | Edge drawer that slides in from the left or right with overlay, focus trap, and Escape-to-close. | `npx @intinyagroup/cli add slidemenu` |
| [tabbar](/docs/components/tabbar) | Fixed bottom tab bar for mobile apps with icons, badges, blur, and safe-area insets. | `npx @intinyagroup/cli add tabbar` |
| [tabs](/docs/components/tabs) |  | `npx @intinyagroup/cli add tabs` |
| [TopAppBar](/docs/components/md3-top-app-bar) | Material Design 3 app bars in small, center, medium, and large sizes with scroll collapse. | `npx @intinyagroup/cli add top-app-bar` (from @intinyagroup/md3) |

## Forms

| Component | Description | Install |
|-----------|-------------|---------|
| [checkbox](/docs/components/checkbox) |  | `npx @intinyagroup/cli add checkbox` |
| [Chip](/docs/components/md3-chip) | Material Design 3 chips for filtering, actions, and suggestions. | `npx @intinyagroup/cli add chip` (from @intinyagroup/md3) |
| [color-picker](/docs/components/color-picker) | Color picker input with preview and input modes. | `npx @intinyagroup/cli add color-picker` |
| [combobox](/docs/components/combobox) | Searchable select with autocomplete | `npx @intinyagroup/cli add combobox` |
| [date-picker](/docs/components/date-picker) |  | `npx @intinyagroup/cli add date-picker` |
| [datetime-picker](/docs/components/datetime-picker) | Date and time picker with calendar and time selection. | `npx @intinyagroup/cli add datetime-picker` |
| [editable-label](/docs/components/editable-label) | Inline text that becomes an input on click, rendered as any heading or span. | `npx @intinyagroup/cli add editable-label` |
| [form](/docs/components/form) |  | `npx @intinyagroup/cli add form` |
| [input](/docs/components/input) |  | `npx @intinyagroup/cli add input` |
| [input-group](/docs/components/input-group) | Input field with leading/trailing addons. | `npx @intinyagroup/cli add input-group` |
| [label](/docs/components/label) |  | `npx @intinyagroup/cli add label` |
| [number-input](/docs/components/number-input) | Numeric input with increment/decrement buttons. | `npx @intinyagroup/cli add number-input` |
| [otp-input](/docs/components/otp-input) | One-time password verification code input. | `npx @intinyagroup/cli add otp-input` |
| [password-input](/docs/components/password-input) | Password input with show/hide toggle. | `npx @intinyagroup/cli add password-input` |
| [Radio](/docs/components/md3-radio) | Material Design 3 radio buttons and radio groups for single-choice selection. | `npx @intinyagroup/cli add radio` (from @intinyagroup/md3) |
| [radio-group](/docs/components/radio-group) |  | `npx @intinyagroup/cli add radio-group` |
| [rating](/docs/components/rating) | Star rating with half-star and read-only modes. | `npx @intinyagroup/cli add rating` |
| [search-select](/docs/components/search-select) | Autocomplete with server-side search | `npx @intinyagroup/cli add search-select` |
| [SearchBar](/docs/components/md3-search-bar) | Material Design 3 search input with leading icon, clear button, and full-pill styling. | `npx @intinyagroup/cli add search-bar` (from @intinyagroup/md3) |
| [SegmentedButton](/docs/components/md3-segmented-button) | Material Design 3 segmented buttons for single or multi selection. | `npx @intinyagroup/cli add segmented-button` (from @intinyagroup/md3) |
| [segmentedcontrol](/docs/components/segmentedcontrol) | Pill-style tab switcher with a sliding indicator and bindable value. | `npx @intinyagroup/cli add segmentedcontrol` |
| [select](/docs/components/select) |  | `npx @intinyagroup/cli add select` |
| [slider](/docs/components/slider) |  | `npx @intinyagroup/cli add slider` |
| [switch](/docs/components/switch) |  | `npx @intinyagroup/cli add switch` |
| [Switch](/docs/components/md3-switch) |  | `npx @intinyagroup/cli add switch` (from @intinyagroup/md3) |
| [textarea](/docs/components/textarea) |  | `npx @intinyagroup/cli add textarea` |
| [TextField](/docs/components/md3-text-field) | Material Design 3 text fields with floating labels, helper text, and error states. | `npx @intinyagroup/cli add text-field` (from @intinyagroup/md3) |
| [TimePicker](/docs/components/md3-time-picker) | Material Design 3 time picker with analog clock and keyboard input modes. | `npx @intinyagroup/cli add time-picker` (from @intinyagroup/md3) |
| [toggle](/docs/components/toggle) |  | `npx @intinyagroup/cli add toggle` |
| [toggle-group](/docs/components/toggle-group) |  | `npx @intinyagroup/cli add toggle-group` |

## Feedback

| Component | Description | Install |
|-----------|-------------|---------|
| [alert](/docs/components/alert) |  | `npx @intinyagroup/cli add alert` |
| [alert-dialog](/docs/components/alert-dialog) |  | `npx @intinyagroup/cli add alert-dialog` |
| [BottomSheet](/docs/components/md3-bottom-sheet) | Material Design 3 modal panel that slides up from the bottom of the screen. | `npx @intinyagroup/cli add bottom-sheet` (from @intinyagroup/md3) |
| [dialog](/docs/components/dialog) |  | `npx @intinyagroup/cli add dialog` |
| [live-badge](/docs/components/live-badge) | Pulsing LIVE badge with an optional viewer count. | `npx @intinyagroup/cli add live-badge` |
| [mobile-toast](/docs/components/mobile-toast) | Lightweight toast for mobile UIs with variants, duration, position, and an optional action. | `npx @intinyagroup/cli add mobile-toast` |
| [notification](/docs/components/notification) | Button that requests notification permission and shows a Web Notification, with a demo fallback. | `npx @intinyagroup/cli add notification` |
| [popover](/docs/components/popover) |  | `npx @intinyagroup/cli add popover` |
| [Ripple](/docs/components/md3-ripple) | Material Design 3 CSS-only touch ripple overlay effect. | `npx @intinyagroup/cli add ripple` (from @intinyagroup/md3) |
| [sheet](/docs/components/sheet) |  | `npx @intinyagroup/cli add sheet` |
| [Snackbar](/docs/components/md3-snackbar) | Material Design 3 transient notification message with optional action. | `npx @intinyagroup/cli add snackbar` (from @intinyagroup/md3) |
| [status-indicator](/docs/components/status-indicator) | Presence dot with online, offline, away, busy, and custom states, in three sizes. | `npx @intinyagroup/cli add status-indicator` |
| [toast](/docs/components/toast) |  | `npx @intinyagroup/cli add toast` |
| [tooltip](/docs/components/tooltip) |  | `npx @intinyagroup/cli add tooltip` |

## Data Display

| Component | Description | Install |
|-----------|-------------|---------|
| [avatar](/docs/components/avatar) |  | `npx @intinyagroup/cli add avatar` |
| [avatar-group](/docs/components/avatar-group) | Stack multiple avatars in an overlapping layout. | `npx @intinyagroup/cli add avatar-group` |
| [avatarstack](/docs/components/avatarstack) | Overlapping row of avatars that collapses extras into a +N badge. | `npx @intinyagroup/cli add avatarstack` |
| [badge](/docs/components/badge) |  | `npx @intinyagroup/cli add badge` |
| [Badge](/docs/components/md3-badge) |  | `npx @intinyagroup/cli add badge` (from @intinyagroup/md3) |
| [barcode](/docs/components/barcode) |  | `npx @intinyagroup/cli add barcode` |
| [calendar](/docs/components/calendar) |  | `npx @intinyagroup/cli add calendar` |
| [charts](/docs/components/charts) |  | `npx @intinyagroup/cli add charts` |
| [clipboard](/docs/components/clipboard) | Button that copies text to the clipboard with success feedback and legacy fallback. | `npx @intinyagroup/cli add clipboard` |
| [code-block](/docs/components/code-block) | Code display with syntax highlighting and copy button. | `npx @intinyagroup/cli add code-block` |
| [data-table](/docs/components/data-table) | Data table with sorting and pagination | `npx @intinyagroup/cli add data-table` |
| [heatmap](/docs/components/heatmap) | GitHub-style intensity heatmap with interpolated color scale and axis labels. | `npx @intinyagroup/cli add heatmap` |
| [markdown-renderer](/docs/components/markdown-renderer) | Render Markdown content as HTML. | `npx @intinyagroup/cli add markdown-renderer` |
| [progress](/docs/components/progress) |  | `npx @intinyagroup/cli add progress` |
| [progress-steps](/docs/components/progress-steps) | Stepped progress indicator with completed, current, and upcoming states and backward navigation. | `npx @intinyagroup/cli add progress-steps` |
| [ProgressIndicator](/docs/components/md3-progress-indicator) | Material Design 3 linear and circular progress indicators with determinate and indeterminate states. | `npx @intinyagroup/cli add progress-indicator` (from @intinyagroup/md3) |
| [qr-code](/docs/components/qr-code) |  | `npx @intinyagroup/cli add qr-code` |
| [stat-card](/docs/components/stat-card) | Card displaying a single metric with label and trend. | `npx @intinyagroup/cli add stat-card` |
| [stats-counter](/docs/components/stats-counter) | Animated number counter for metrics. | `npx @intinyagroup/cli add stats-counter` |
| [table](/docs/components/table) |  | `npx @intinyagroup/cli add table` |
| [timeline](/docs/components/timeline) |  | `npx @intinyagroup/cli add timeline` |
| [tree-view](/docs/components/tree-view) |  | `npx @intinyagroup/cli add tree-view` |
| [virtual-list](/docs/components/virtual-list) | Windowing for rendering 10K+ items smoothly | `npx @intinyagroup/cli add virtual-list` |

## Marketing

| Component | Description | Install |
|-----------|-------------|---------|
| [cta-section](/docs/components/cta-section) |  | `npx @intinyagroup/cli add cta-section` |
| [feature-grid](/docs/components/feature-grid) |  | `npx @intinyagroup/cli add feature-grid` |
| [footer](/docs/components/footer) |  | `npx @intinyagroup/cli add footer` |
| [hero](/docs/components/hero) |  | `npx @intinyagroup/cli add hero` |
| [logo-cloud](/docs/components/logo-cloud) | Grid of partner or customer logos. | `npx @intinyagroup/cli add logo-cloud` |
| [navbar](/docs/components/navbar) |  | `npx @intinyagroup/cli add navbar` |
| [pricing-card](/docs/components/pricing-card) |  | `npx @intinyagroup/cli add pricing-card` |
| [pricing-table](/docs/components/pricing-table) | Multi-tier pricing comparison table. | `npx @intinyagroup/cli add pricing-table` |
| [section-header](/docs/components/section-header) | Section title with optional action buttons. | `npx @intinyagroup/cli add section-header` |
| [stats](/docs/components/stats) |  | `npx @intinyagroup/cli add stats` |
| [testimonial](/docs/components/testimonial) |  | `npx @intinyagroup/cli add testimonial` |
| [testimonial-carousel](/docs/components/testimonial-carousel) | Rotating carousel of customer testimonials. | `npx @intinyagroup/cli add testimonial-carousel` |

## Composite

| Component | Description | Install |
|-----------|-------------|---------|
| [bento-grid](/docs/components/bento-grid) |  | `npx @intinyagroup/cli add bento-grid` |
| [carousel](/docs/components/carousel) |  | `npx @intinyagroup/cli add carousel` |
| [collapsible](/docs/components/collapsible) |  | `npx @intinyagroup/cli add collapsible` |
| [command](/docs/components/command) |  | `npx @intinyagroup/cli add command` |
| [comment](/docs/components/comment) | Comment thread with add, like, and delete actions, author avatars, and a composer. | `npx @intinyagroup/cli add comment` |
| [context-menu](/docs/components/context-menu) |  | `npx @intinyagroup/cli add context-menu` |
| [empty-state](/docs/components/empty-state) | Placeholder display when no data is available. | `npx @intinyagroup/cli add empty-state` |
| [file-uploader](/docs/components/file-uploader) | Drag-and-drop file upload area with progress. | `npx @intinyagroup/cli add file-uploader` |
| [gallery](/docs/components/gallery) | Multi-file image picker with drag-and-drop, live previews, and file-limit enforcement. | `npx @intinyagroup/cli add gallery` |
| [hover-card](/docs/components/hover-card) |  | `npx @intinyagroup/cli add hover-card` |
| [kanban](/docs/components/kanban) |  | `npx @intinyagroup/cli add kanban` |
| [mention](/docs/components/mention) |  | `npx @intinyagroup/cli add mention` |
| [reaction-bar](/docs/components/reaction-bar) | Emoji reaction pills with counts, selection state, and optional deselect. | `npx @intinyagroup/cli add reaction-bar` |
| [signature-pad](/docs/components/signature-pad) | Canvas-based signature capture input. | `npx @intinyagroup/cli add signature-pad` |
| [split-view](/docs/components/split-view) |  | `npx @intinyagroup/cli add split-view` |
| [stepper](/docs/components/stepper) | Step-by-step wizard with progress indicator. | `npx @intinyagroup/cli add stepper` |
| [user-profile-card](/docs/components/user-profile-card) | Rich profile card with cover, avatar, role, bio, stats row, social links, and a contact button. | `npx @intinyagroup/cli add user-profile-card` |

## Mobile

| Component | Description | Install |
|-----------|-------------|---------|
| [actionsheet](/docs/components/actionsheet) | A modal bottom sheet listing contextual actions, styled for mobile with destructive variants and focus trapping. | `npx @intinyagroup/cli add actionsheet` |
| [camera](/docs/components/camera) | Camera capture component using getUserMedia with facing mode, capture, and file-input fallback. | `npx @intinyagroup/cli add camera` |
| [fabmenu](/docs/components/fabmenu) | Floating action button speed dial that expands a stack of actions. | `npx @intinyagroup/cli add fabmenu` |
| [gyroscope](/docs/components/gyroscope) | Device orientation sensor with permission handling, sensitivity, and a mouse-simulation fallback for desktop. | `npx @intinyagroup/cli add gyroscope` |
| [infinite-scroll](/docs/components/infinite-scroll) |  | `npx @intinyagroup/cli add infinite-scroll` |
| [listview](/docs/components/listview) | Mobile settings-style list with grouped items, leading/trailing content, and chevron navigation. | `npx @intinyagroup/cli add listview` |
| [pulltorefresh](/docs/components/pulltorefresh) | Touch and pointer pull-to-refresh wrapper with an 80px threshold and async refresh callback. | `npx @intinyagroup/cli add pulltorefresh` |
| [swipeableitem](/docs/components/swipeableitem) | List row that swipes to reveal actions with rubber-band physics and axis detection. | `npx @intinyagroup/cli add swipeableitem` |

## Flat & Geometric

| Component | Description | Install |
|-----------|-------------|---------|
| [ArrowCard](/docs/components/flat-arrow-card) | Arrow-pointed flat card with direction variants. | `npx @intinyagroup/cli add arrow-card` (from @intinyagroup/flat) |
| [BlobCard](/docs/components/flat-blob-card) | Organic-shaped flat card with a SVG blob clip-path and bold colors. | `npx @intinyagroup/cli add blob-card` (from @intinyagroup/flat) |
| [CircleAvatar](/docs/components/flat-circle-avatar) | Flat avatar with a thick colored ring, image or initials. | `npx @intinyagroup/cli add circle-avatar` (from @intinyagroup/flat) |
| [CircleGrid](/docs/components/flat-circle-grid) | Row of flat colored circles for decoration and patterns. | `npx @intinyagroup/cli add circle-grid` (from @intinyagroup/flat) |
| [CrossBadge](/docs/components/flat-cross-badge) | Plus-shaped flat badge with bold colors and three sizes. | `npx @intinyagroup/cli add cross-badge` (from @intinyagroup/flat) |
| [DiamondBadge](/docs/components/flat-diamond-badge) | Diamond-shaped flat label with bold colors and three sizes. | `npx @intinyagroup/cli add diamond-badge` (from @intinyagroup/flat) |
| [EllipseBadge](/docs/components/flat-ellipse-badge) | Pill-shaped flat badge with bold colors and three sizes. | `npx @intinyagroup/cli add ellipse-badge` (from @intinyagroup/flat) |
| [HexagonGrid](/docs/components/flat-hexagon-grid) | Honeycomb-style layout container that clips its children into hexagons. | `npx @intinyagroup/cli add hexagon-grid` (from @intinyagroup/flat) |
| [OctagonCard](/docs/components/flat-octagon-card) | Octagon-shaped flat card with title, description, and content. | `npx @intinyagroup/cli add octagon-card` (from @intinyagroup/flat) |
| [ParallelogramCard](/docs/components/flat-parallelogram-card) | Slanted parallelogram flat card with title and content. | `npx @intinyagroup/cli add parallelogram-card` (from @intinyagroup/flat) |
| [PentagonStat](/docs/components/flat-pentagon-stat) | Pentagon-shaped flat metric display with value and label. | `npx @intinyagroup/cli add pentagon-stat` (from @intinyagroup/flat) |
| [StarCard](/docs/components/flat-star-card) | Star-shaped flat highlight card with title and value. | `npx @intinyagroup/cli add star-card` (from @intinyagroup/flat) |
| [TrapezoidCard](/docs/components/flat-trapezoid-card) | Trapezoid-shaped flat card with a tilted top edge. | `npx @intinyagroup/cli add trapezoid-card` (from @intinyagroup/flat) |
| [TriangleAlert](/docs/components/flat-triangle-alert) | Triangle-shaped flat warning banner with optional dismiss button. | `npx @intinyagroup/cli add triangle-alert` (from @intinyagroup/flat) |
| [WaveSection](/docs/components/flat-wave-section) | Flat section with a wavy SVG top or bottom divider. | `npx @intinyagroup/cli add wave-section` (from @intinyagroup/flat) |
| [ZigzagDivider](/docs/components/flat-zigzag-divider) | Flat zigzag SVG divider between sections. | `npx @intinyagroup/cli add zigzag-divider` (from @intinyagroup/flat) |

## Utility

| Component | Description | Install |
|-----------|-------------|---------|
| [copy-to-clipboard](/docs/components/copy-to-clipboard) | Button that copies text to the clipboard with feedback. | `npx @intinyagroup/cli add copy-to-clipboard` |
| [emoji](/docs/components/emoji) | Emoji picker with search and categories. | `npx @intinyagroup/cli add emoji` |
| [main](/docs/components/main) | Semantic main element for primary page content. | `npx @intinyagroup/cli add main` |
| [skeleton](/docs/components/skeleton) |  | `npx @intinyagroup/cli add skeleton` |
| [validate](/docs/components/validate) | Client-side form validation with custom validators and Zod | `npx @intinyagroup/cli add validate` |

## Package Sources

| Package | Components | Install |
|---------|-----------|---------|
| [@intinyagroup/ui](https://www.npmjs.com/package/@intinyagroup/ui) | Core (123) | `npm install @intinyagroup/ui` |
| [@intinyagroup/md3](https://www.npmjs.com/package/@intinyagroup/md3) | MD3 (16) | `npm install @intinyagroup/md3` |
| [@intinyagroup/flat](https://www.npmjs.com/package/@intinyagroup/flat) | Flat geometric (16) | `npm install @intinyagroup/flat` |

## Playground

Try components live with adjustable props in the [Playground](/playground).

## Related

- [Themes](/docs/themes) — 9 design directions
- [Guides](/docs/guides/theming) — advanced theming
- [Examples](/examples) — real-world patterns
