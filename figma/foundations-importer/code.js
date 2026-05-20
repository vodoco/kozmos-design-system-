/* global figma, __html__ */
figma.showUI(__html__, {
  width: 560,
  height: 720,
  themeColors: true,
});

const RUN_NAMESPACE = "kozmos_ds_importer";
const FONT_REGULAR = { family: "Inter", style: "Regular" };
const FONT_BOLD = { family: "Inter", style: "Bold" };
const VALID_VARIABLE_TYPES = new Set(["COLOR", "FLOAT", "STRING", "BOOLEAN"]);
const TEXT_SIZES = [
  "XS",
  "Small",
  "Base",
  "Large",
  "XLarge",
  "2XLarge",
  "3XLarge",
  "4XLarge",
];
const TEXT_WEIGHTS = ["Normal", "Medium", "Semibold", "Bold"];
const TEXT_TONES = ["Default", "Muted", "Primary", "Destructive"];
const HEADING_LEVELS = ["H1", "H2", "H3", "H4", "H5", "H6"];
const LINK_VARIANTS = ["Default", "Subtle"];
const LINK_STATES = ["Default", "Focus"];
const LABEL_STATES = ["Default", "Disabled"];
const SEPARATOR_ORIENTATIONS = ["Horizontal", "Vertical"];
const SKELETON_SHAPES = ["Line", "Block", "Circle"];
const BOX_SURFACES = ["Transparent", "Surface", "Outlined"];
const STACK_DIRECTIONS = ["Column", "Row"];
const STACK_GAPS = ["2", "4", "6"];
const CONTAINER_CENTERED = ["True", "False"];
const BUTTON_VARIANTS = [
  "Default",
  "Destructive",
  "Outline",
  "Secondary",
  "Ghost",
  "Link",
  "Glass",
];
const BUTTON_SIZES = ["Default", "Small", "Large", "Icon"];
const BUTTON_STATES = ["Default", "Disabled", "Loading"];
const BUTTON_ICON_PROPERTY = "Icon";
const BUTTON_ICON_ON_FILL_PROPERTY = "Icon on Fill";
const BUTTON_ICON_ON_ACCENT_PROPERTY = "Icon on Accent";
const BUTTON_ICON_ON_NEUTRAL_PROPERTY = "Icon on Neutral";
const ICON_BUTTON_SIZES = ["Default", "Small", "Large"];
const BADGE_VARIANTS = [
  "Default",
  "Destructive",
  "Outline",
  "Secondary",
  "Ghost",
  "Link",
];
const BADGE_SIZES = ["Default", "Small", "Large", "Icon"];
const COUNTER_TONES = ["Neutral", "Brand", "Destructive", "Inverse"];
const COUNTER_SIZES = ["Small", "Default"];
const CHECKBOX_CHECKED = ["Unchecked", "Checked"];
const CHECKBOX_STATES = ["Default", "Disabled", "Error"];
const RADIO_CHECKED = ["Unchecked", "Checked"];
const RADIO_STATES = ["Default", "Disabled", "Error"];
const SWITCH_CHECKED = ["Unchecked", "Checked"];
const SWITCH_STATES = ["Default", "Disabled", "Error"];
const INPUT_STATES = ["Default", "Focus", "Disabled", "Readonly"];
const INPUT_STATUSES = ["Default", "Error", "Warning", "Success"];
const TEXTAREA_STATES = ["Default", "Focus", "Disabled", "Readonly"];
const TEXTAREA_STATUSES = ["Default", "Error"];
const SEARCH_STATES = ["Default", "Focus", "Disabled", "Readonly"];
const SEARCH_STATUSES = ["Default", "Error"];
const SELECT_STATES = ["Default", "Focus", "Disabled"];
const SELECT_STATUSES = ["Default", "Error"];
const SLIDER_STATES = ["Default", "Focus", "Disabled"];
const SLIDER_STATUSES = ["Default", "Error"];
const PROGRESS_VALUES = ["0", "25", "50", "75", "100"];
const SPINNER_SIZES = ["Small", "Medium", "Large", "XLarge"];
const AVATAR_CONTENT = ["Fallback", "Image"];
const ALERT_VARIANTS = ["Default", "Destructive", "Success", "Warning", "Info"];
const CARD_CONTENT = ["Basic", "Header", "Full"];
const DIALOG_CONTENT = ["Basic", "Form", "Footer"];
const POPOVER_SIDES = ["Top", "Right", "Bottom", "Left"];
const MENU_CONTENT = ["Basic", "Checkbox", "Radio", "Submenu"];
const TOAST_CONTENT = ["Basic", "Action"];
const TABS_COUNTS = ["Two", "Three", "Four"];
const TABS_ACTIVE = ["One", "Two", "Three", "Four"];
const TABS_STATES = ["Default", "Focus", "Disabled"];
const TOOLTIP_SIDES = ["Top", "Right", "Bottom", "Left"];
const TABS_COUNT_TO_NUMBER = {
  Two: 2,
  Three: 3,
  Four: 4,
};
const TABS_ACTIVE_TO_INDEX = {
  One: 0,
  Two: 1,
  Three: 2,
  Four: 3,
};
const COMPONENTS_PAGE_NAME = "Components";
const COMPONENT_PAGE_LAYOUT_X = 80;
const COMPONENT_PAGE_LAYOUT_Y = 80;
const COMPONENT_PAGE_LAYOUT_ROW_GAP = 420;
const COMPONENT_PAGE_LAYOUT_MIN_FOOTPRINT_HEIGHT = 260;
const COMPONENT_PAGE_LAYOUT_MIN_HEIGHTS = {
  "Text / v1": 980,
  "Heading / v1": 360,
  "Link / v1": 260,
  "Label / v1": 260,
  "Separator / v1": 260,
  "Skeleton / v1": 260,
  "Box / v1": 360,
  "Stack / v1": 520,
  "Container / v1": 360,
  "Button / v1": 900,
  "IconButton / v1": 820,
  "Card / v1": 420,
  "Tabs / v1": 620,
  "Tooltip / v1": 360,
  "Dialog / v1": 760,
  "Popover / v1": 360,
  "Menu / v1": 420,
  "Input / v1": 720,
  "Textarea / v1": 760,
  "Search / v1": 620,
  "Select / v1": 420,
  "Slider / v1": 500,
  "Progress / v1": 260,
  "Spinner / v1": 260,
  "Alert / v1": 260,
  "Toast / v1": 260,
  "Avatar / v1": 260,
};
const COMPONENT_PAGE_LAYOUT_ORDER = [
  "Text / v1",
  "Heading / v1",
  "Link / v1",
  "Label / v1",
  "Separator / v1",
  "Skeleton / v1",
  "Box / v1",
  "Stack / v1",
  "Container / v1",
  "Button / v1",
  "IconButton / v1",
  "Counter / v1",
  "Badge / v1",
  "Card / v1",
  "Tabs / v1",
  "Tooltip / v1",
  "Dialog / v1",
  "Popover / v1",
  "Menu / v1",
  "Checkbox / v1",
  "Radio / v1",
  "Switch / v1",
  "Input / v1",
  "Textarea / v1",
  "Search / v1",
  "Select / v1",
  "Slider / v1",
  "Progress / v1",
  "Spinner / v1",
  "Alert / v1",
  "Toast / v1",
  "Avatar / v1",
];
const COMPONENT_DOCS_PAGE_NAME = "Docs";
const COMPONENT_DOC_SPLIT_PAGE_PREFIX = "Docs / ";
const DOCS_CANVAS_X = 80;
const DOCS_CANVAS_Y = 80;
const DOCS_COLUMNS = 3;
const DOCS_SECTION_WIDTH = 760;
const DOCS_SECTION_PADDING = 32;
const DOCS_SECTION_PADDING_BOTTOM = 44;
const DOCS_SECTION_GAP = 48;
const DOCS_ROW_GAP = 56;
const DOCS_INNER_WIDTH = DOCS_SECTION_WIDTH - DOCS_SECTION_PADDING * 2;
const DOCS_CATALOG_WIDTH =
  DOCS_SECTION_WIDTH * DOCS_COLUMNS + DOCS_SECTION_GAP * (DOCS_COLUMNS - 1);
const SURFACE_QA_PAGE_NAME = "QA / Transparent Surfaces";
const SURFACE_QA_CANVAS_X = 80;
const SURFACE_QA_CANVAS_Y = 80;
const SURFACE_QA_PANEL_WIDTH = 760;
const SURFACE_QA_PANEL_GAP = 56;
const SURFACE_QA_GROUP_GAP = 18;
const SURFACE_QA_COMPONENT_GROUPS = [
  {
    title: "Actions",
    rows: [
      [
        {
          componentSetName: "Button / v1",
          variantName: "Variant=Ghost, Size=Default, State=Default",
          text: { "Label Text": "Add to library" },
        },
        {
          componentSetName: "Button / v1",
          variantName: "Variant=Link, Size=Default, State=Default",
          text: { "Label Text": "View details" },
        },
        {
          componentSetName: "Button / v1",
          variantName: "Variant=Glass, Size=Default, State=Default",
          text: { "Label Text": "Navigate" },
        },
        {
          componentSetName: "IconButton / v1",
          variantName: "Variant=Ghost, Size=Default, State=Default",
        },
        {
          componentSetName: "IconButton / v1",
          variantName: "Variant=Glass, Size=Default, State=Default",
        },
        {
          componentSetName: "Badge / v1",
          variantName: "Variant=Ghost, Size=Default",
          text: { "Label Text": "Indoor" },
        },
      ],
    ],
  },
  {
    title: "Fields",
    rows: [
      [
        {
          componentSetName: "Input / v1",
          variantName: "State=Default, Status=Default",
          text: { "Label Text": "Level", "Placeholder Text": "Choose level" },
        },
        {
          componentSetName: "Search / v1",
          variantName: "State=Default, Status=Default",
          text: { "Label Text": "Search", "Placeholder Text": "Search venue" },
        },
      ],
      [
        {
          componentSetName: "Select / v1",
          variantName: "State=Default, Status=Default",
          text: { "Placeholder Text": "Destination" },
        },
        {
          componentSetName: "Slider / v1",
          variantName: "State=Default, Status=Default",
          text: { "Label Text": "Zoom" },
        },
      ],
      [
        {
          componentSetName: "Textarea / v1",
          variantName: "State=Default, Status=Default",
          text: {
            "Label Text": "Notes",
            "Placeholder Text": "Optional context",
          },
        },
      ],
    ],
  },
  {
    title: "Selection and feedback",
    rows: [
      [
        {
          componentSetName: "Checkbox / v1",
          variantName: "Checked=Unchecked, State=Default",
          text: { "Label Text": "Accessible route" },
        },
        {
          componentSetName: "Radio / v1",
          variantName: "Checked=Checked, State=Default",
          text: { "Label Text": "Fastest" },
        },
        {
          componentSetName: "Switch / v1",
          variantName: "Checked=Checked, State=Default",
          text: { "Label Text": "Live updates" },
        },
      ],
      [
        {
          componentSetName: "Progress / v1",
          variantName: "Value=50",
        },
        {
          componentSetName: "Spinner / v1",
          variantName: "Size=Medium",
        },
      ],
    ],
  },
];
const COMPONENT_DOCS = [
  {
    componentName: "Text",
    componentSetName: "Text / v1",
    category: "Typography",
    summary:
      "Text presents body copy and compact labels with controlled size, weight, and semantic tone.",
    usage: [
      "Use Base Default Normal for standard body copy.",
      "Use Muted for secondary metadata or helper copy.",
      "Use Primary or Destructive only when the text carries semantic emphasis.",
    ],
    api: [
      "Size maps to Text.size.",
      "Weight maps to Text.weight.",
      "Tone maps to Text.color in Code Connect.",
      "Text maps to children in Code Connect.",
    ],
    properties: [
      "Size: XS, Small, Base, Large, XLarge, 2XLarge, 3XLarge, 4XLarge",
      "Weight: Normal, Medium, Semibold, Bold",
      "Tone: Default, Muted, Primary, Destructive",
      "Text",
    ],
    accessibility: [
      "Text contrast passes in Light and Dark modes for every included tone.",
      "White/inverse text is intentionally not part of v1 until inverse surface QA is defined.",
      "Text is non-interactive unless composed inside another control.",
    ],
  },
  {
    componentName: "Heading",
    componentSetName: "Heading / v1",
    category: "Typography",
    summary:
      "Heading presents section titles with semantic levels that match the React Heading API.",
    usage: [
      "Use one H1 per composed screen or major panel.",
      "Use H2 through H4 for nested content structure.",
      "Avoid choosing heading levels only for size; keep hierarchy meaningful.",
    ],
    api: [
      "Level maps to Heading.level.",
      "Heading Text maps to children in Code Connect.",
      "Font size and line height reuse the Text typography token scale.",
    ],
    properties: ["Level: H1, H2, H3, H4, H5, H6", "Heading Text"],
    accessibility: [
      "Heading levels should preserve document and screen-reader structure in product code.",
      "Text contrast passes in Light and Dark modes.",
      "Heading is non-interactive unless composed inside another control.",
    ],
  },
  {
    componentName: "Link",
    componentSetName: "Link / v1",
    category: "Typography",
    summary:
      "Link presents navigational or inline text actions with a visible focus state.",
    usage: [
      "Use Default when the link should read as an action.",
      "Use Subtle for secondary inline navigation inside dense content.",
      "Use Button when the action commits a product task rather than navigating.",
    ],
    api: [
      "Variant maps to Link.variant.",
      "State maps to focus-visible examples in Code Connect.",
      "Link Text maps to children in Code Connect.",
    ],
    properties: [
      "Variant: Default, Subtle",
      "State: Default, Focus",
      "Link Text",
    ],
    accessibility: [
      "Link text contrast passes in Light and Dark modes.",
      "The Focus state shows the generated keyboard focus ring.",
      "Product code should preserve native link semantics or accessible button semantics.",
    ],
  },
  {
    componentName: "Label",
    componentSetName: "Label / v1",
    category: "Forms",
    summary:
      "Label names a form control or setting with the same text treatment as product inputs.",
    usage: [
      "Use Label when the text belongs to an input, selection control, or field group.",
      "Use Disabled only when the associated control is unavailable.",
      "Keep labels concise and adjacent to their control.",
    ],
    api: [
      "State maps to disabled examples in Code Connect.",
      "Label Text maps to children in Code Connect.",
      "Typography aligns with the shared form label scale.",
    ],
    properties: ["State: Default, Disabled", "Label Text"],
    accessibility: [
      "Product code should associate labels with controls through htmlFor or Radix Label composition.",
      "Text contrast passes in Light and Dark modes.",
      "Label is non-interactive unless composed inside another control.",
    ],
  },
  {
    componentName: "Separator",
    componentSetName: "Separator / v1",
    category: "Layout",
    summary:
      "Separator visually divides related content with horizontal or vertical orientation.",
    usage: [
      "Use Horizontal between stacked sections or menu groups.",
      "Use Vertical inside toolbars and dense inline control groups.",
      "Avoid using Separator as decoration when spacing alone can clarify hierarchy.",
    ],
    api: [
      "Orientation maps to Separator.orientation.",
      "Decorative behavior remains a runtime accessibility concern.",
      "Sizing uses component float variables for consistent thickness.",
    ],
    properties: ["Orientation: Horizontal, Vertical"],
    accessibility: [
      "Separator uses a foreground boundary token with non-text contrast headroom.",
      "Product code should mark purely visual separators as decorative.",
      "Separator is non-interactive.",
    ],
  },
  {
    componentName: "Skeleton",
    componentSetName: "Skeleton / v1",
    category: "Feedback",
    summary:
      "Skeleton reserves space while content is loading, using non-interactive placeholder shapes.",
    usage: [
      "Use Line for text rows and metadata placeholders.",
      "Use Block for cards, media, and larger content regions.",
      "Use Circle for avatar or icon placeholders.",
    ],
    api: [
      "Shape maps to common Skeleton composition examples.",
      "Animation remains a runtime concern in React.",
      "Sizing uses component float variables for stable placeholders.",
    ],
    properties: ["Shape: Line, Block, Circle"],
    accessibility: [
      "Skeleton is non-interactive and should not receive focus.",
      "Product code should expose loading status when the wait is meaningful.",
      "Placeholder contrast is visual only and does not communicate state by itself.",
    ],
  },
  {
    componentName: "Box",
    componentSetName: "Box / v1",
    category: "Layout",
    summary:
      "Box provides a simple composition surface for arbitrary child content.",
    usage: [
      "Use Transparent when Box only owns spacing or semantic structure.",
      "Use Surface or Outlined when the child content needs a visible boundary.",
      "Prefer Card when the content has a title, description, and actions.",
    ],
    api: [
      "Surface maps to common Box composition examples.",
      "Box Text represents children in the generated Figma example.",
      "Runtime Box remains a lightweight polymorphic wrapper.",
    ],
    properties: ["Surface: Transparent, Surface, Outlined", "Box Text"],
    accessibility: [
      "Box is non-interactive unless composed around an interactive child.",
      "Placeholder text contrast passes in Light and Dark modes.",
      "Visible surfaces use shared radius, padding, and boundary variables.",
    ],
  },
  {
    componentName: "Stack",
    componentSetName: "Stack / v1",
    category: "Layout",
    summary:
      "Stack arranges child content in a row or column with consistent spacing.",
    usage: [
      "Use Column for vertical field groups, panels, and content blocks.",
      "Use Row for inline control groups and compact metadata.",
      "Use these Figma variants as canonical layout examples, not every possible flexbox combination.",
    ],
    api: [
      "Direction maps to Stack.direction.",
      "Gap maps to Stack.gap.",
      "Alignment, justification, and wrapping remain product-code composition choices.",
    ],
    properties: ["Direction: Column, Row", "Gap: 2, 4, 6"],
    accessibility: [
      "Stack is non-interactive unless composed around interactive children.",
      "Spacing does not communicate state by itself.",
      "Child controls must preserve their own labels, focus states, and touch targets.",
    ],
  },
  {
    componentName: "Container",
    componentSetName: "Container / v1",
    category: "Layout",
    summary:
      "Container provides responsive page gutters and optional centered max-width composition.",
    usage: [
      "Use Centered True for regular page sections and bounded reading layouts.",
      "Use Centered False when the layout should fill the available width.",
      "Keep Container focused on outer page structure; use Box or Card for local surfaces.",
    ],
    api: [
      "Centered maps to Container.centered.",
      "Container Text represents children in the generated Figma example.",
      "Responsive breakpoints and max-width behavior remain runtime CSS concerns.",
    ],
    properties: ["Centered: True, False", "Container Text"],
    accessibility: [
      "Container is non-interactive unless composed around interactive children.",
      "Gutters and max-width should support readable line length without hiding content.",
      "Child controls must preserve their own semantic labels and focus states.",
    ],
  },
  {
    componentName: "Button",
    componentSetName: "Button / v1",
    category: "Actions",
    summary:
      "Buttons trigger intentional product actions. Use them for committed actions in forms, dialogs, toolbars, and focused task flows.",
    usage: [
      "Use Default for the main action in a local context.",
      "Use Destructive only when the action can remove or damage user data.",
      "Use Ghost, Link, or Glass when the surrounding surface already carries visual weight.",
    ],
    api: [
      "Variant maps to Button.variant.",
      "Size maps to Button.size.",
      "State maps to disabled and isLoading in Code Connect.",
      "Label Text maps to children and Icon is an instance-swap slot.",
    ],
    properties: [
      "Variant: Default, Destructive, Outline, Secondary, Ghost, Link, Glass",
      "Size: Default, Small, Large, Icon",
      "State: Default, Disabled, Loading",
      "Label Text, Icon, Focus Visible",
    ],
    accessibility: [
      "All visual sizes meet the 44px minimum interactive target.",
      "Focus Visible controls the generated focus ring used by keyboard navigation.",
      "Text and icon contrast pass in Light and Dark modes.",
    ],
  },
  {
    componentName: "IconButton",
    componentSetName: "IconButton / v1",
    category: "Actions",
    summary:
      "IconButton presents a compact action when the icon is sufficient or an accessible label is supplied in code.",
    usage: [
      "Use for dense toolbars, map controls, and repeated actions.",
      "Prefer a text Button when the action is uncommon or ambiguous.",
      "Swap the Icon property with a curated icon source.",
    ],
    api: [
      "Variant maps to IconButton.variant.",
      "Size maps to IconButton.size: Default to icon, Small to sm, Large to lg.",
      "State maps to disabled and isLoading in Code Connect.",
      "Icon is an instance-swap slot with curated preferred values.",
    ],
    properties: [
      "Variant: Default, Destructive, Outline, Secondary, Ghost, Link, Glass",
      "Size: Default, Small, Large",
      "State: Default, Disabled, Loading",
      "Icon, Focus Visible",
    ],
    accessibility: [
      "All sizes use a 44px interaction frame.",
      "Consumers must provide an accessible name when no visible text exists.",
      "Focus Visible controls the generated focus ring.",
    ],
  },
  {
    componentName: "Counter",
    componentSetName: "Counter / v1",
    category: "Status",
    summary:
      "Counter presents a compact numeric value, such as counts, unread items, or applied filters.",
    usage: [
      "Use for short numeric values that need a stronger shape than plain text.",
      "Use inside Badge when the count belongs to a label.",
      "Keep Counter non-interactive; wrap it in another control only when the whole control is actionable.",
    ],
    api: [
      "Tone maps to Counter.tone.",
      "Size maps to Counter.size.",
      "Counter Text maps to Counter children in Code Connect.",
      "Badge composes Counter as a hidden nested instance for opt-in count display.",
    ],
    properties: [
      "Tone: Neutral, Brand, Destructive, Inverse",
      "Size: Small, Default",
      "Counter Text",
    ],
    accessibility: [
      "Counter is static status content unless wrapped by an interactive component.",
      "Text contrast passes in Light and Dark modes.",
      "Short numeric text uses tabular sizing to keep repeated counts stable.",
    ],
  },
  {
    componentName: "Badge",
    componentSetName: "Badge / v1",
    category: "Status",
    summary:
      "Badge labels compact metadata, status, or categorization. It is non-interactive by default.",
    usage: [
      "Use for short labels such as state, type, role, or count context.",
      "Keep copy concise so badges remain scannable.",
      "Do not use Badge as a replacement for primary actions.",
    ],
    api: [
      "Variant maps to Badge.variant.",
      "Size maps to Badge.size.",
      "Label Text maps to Badge children in Code Connect.",
      "Icon maps to Badge.icon for icon-sized badges.",
      "Show Counter maps to Badge.showCounter.",
      "Badge count content comes from the exposed nested Counter instance.",
      "Badge can inherit focus-visible classes when composed inside interactive elements.",
    ],
    properties: [
      "Variant: Default, Destructive, Outline, Secondary, Ghost, Link",
      "Size: Default, Small, Large, Icon",
      "Label Text, Icon, Show Counter, nested Counter",
    ],
    accessibility: [
      "Badge is treated as static content unless wrapped by an interactive component.",
      "Text contrast passes in Light and Dark modes.",
      "Icon-sized badges retain a 44px visual frame in this library.",
    ],
  },
  {
    componentName: "Card",
    componentSetName: "Card / v1",
    category: "Layout",
    summary:
      "Card groups related content and actions on a contained surface with consistent padding, border, radius, and elevation.",
    usage: [
      "Use for contained content blocks, settings panels, summaries, and forms.",
      "Use the Header content option when title and description help scanning.",
      "Use Full only when the card owns its local actions.",
    ],
    api: [
      "Content maps to composed Card anatomy in Code Connect.",
      "Title Text maps to CardTitle children.",
      "Description Text maps to CardDescription children.",
      "Body Text maps to CardContent children.",
      "Full cards compose live Button instances for footer actions.",
    ],
    properties: [
      "Content: Basic, Header, Full",
      "Title Text, Description Text, Body Text",
    ],
    accessibility: [
      "Card is non-interactive unless composed inside or around a control.",
      "Text contrast passes in Light and Dark modes.",
      "Actions inside a Card must retain their own keyboard and touch targets.",
    ],
  },
  {
    componentName: "Tabs",
    componentSetName: "Tabs / v1",
    category: "Navigation",
    summary:
      "Tabs switch between related panels while keeping the current context visible.",
    usage: [
      "Use when two to four peer views belong in the same local context.",
      "Keep tab labels short and specific.",
      "Prefer another navigation pattern when the destination list is long or hierarchical.",
    ],
    api: [
      "Count maps to the number of TabsTrigger examples.",
      "Active maps to Tabs.defaultValue in Code Connect.",
      "State maps to disabled and focus examples for the generated triggers.",
      "Tab 1 Text through Tab 4 Text map to TabsTrigger children.",
    ],
    properties: [
      "Count: Two, Three, Four",
      "Active: One, Two, Three, Four",
      "State: Default, Focus, Disabled",
      "Tab 1 Text, Tab 2 Text, Tab 3 Text, Tab 4 Text, Focus Visible",
    ],
    accessibility: [
      "The tab list keeps a 44px outer interaction frame.",
      "Active, inactive, disabled, and focus-visible text contrast passes in Light and Dark modes.",
      "Product code should pair each trigger with a matching TabsContent panel.",
    ],
  },
  {
    componentName: "Tooltip",
    componentSetName: "Tooltip / v1",
    category: "Overlay",
    summary:
      "Tooltip presents brief contextual help when a control is hovered or receives keyboard focus.",
    usage: [
      "Use for short, supplemental help that does not block the current task.",
      "Keep content concise enough to scan quickly.",
      "Do not place interactive controls inside a Tooltip.",
    ],
    api: [
      "Side maps to TooltipContent.side in Code Connect.",
      "Content Text maps to TooltipContent children.",
      "TooltipProvider and TooltipTrigger remain composition concerns in product code.",
      "Tip renders on the side facing the trigger.",
      "Side Offset uses the shared 4px overlay offset contract.",
    ],
    properties: [
      "Side: Top, Right, Bottom, Left",
      "Content Text",
      "Tip Size: 8",
      "Side Offset: 4",
    ],
    accessibility: [
      "Tooltip content is non-interactive overlay text.",
      "Text, surface, and border contrast pass in Light and Dark modes.",
      "Native platform implementations should preserve hover, focus, and accessible description behavior.",
    ],
  },
  {
    componentName: "Dialog",
    componentSetName: "Dialog / v1",
    category: "Overlay",
    summary:
      "Dialog presents focused task content above the page with a scrim, surface, close affordance, and optional footer action.",
    usage: [
      "Use when a user must complete or review a contained task before returning.",
      "Keep title and description concise so the modal context stays clear.",
      "Use Footer only when the dialog owns its confirmation action.",
    ],
    api: [
      "Content maps to composed DialogContent anatomy in Code Connect.",
      "Title Text maps to DialogTitle children.",
      "Description Text maps to DialogDescription children.",
      "Body Text maps to composed dialog body content.",
      "Form content composes live Input instances.",
      "Footer actions compose live Button instances.",
    ],
    properties: [
      "Content: Basic, Form, Footer",
      "Title Text, Description Text, Body Text",
      "Nested Input and Button instances expose their own component properties.",
    ],
    accessibility: [
      "Dialog content uses a mode-aware surface over Overlay/Scrim.",
      "Text, icon, and border contrast pass in Light and Dark modes.",
      "Product code must keep focus trapped and return focus to the trigger.",
    ],
  },
  {
    componentName: "Popover",
    componentSetName: "Popover / v1",
    category: "Overlay",
    summary:
      "Popover presents dismissible contextual content anchored to a trigger without blocking the whole page.",
    usage: [
      "Use for short controls, filters, and supplemental detail tied to one trigger.",
      "Prefer Dialog when the task requires commitment or focus trapping.",
      "Keep content compact enough to dismiss without losing task context.",
    ],
    api: [
      "Side maps to PopoverContent.side in Code Connect.",
      "Title Text and Description Text map to composed children.",
      "Side Offset uses the shared 4px overlay offset contract.",
    ],
    properties: [
      "Side: Top, Right, Bottom, Left",
      "Title Text, Description Text",
      "Side Offset: 4",
    ],
    accessibility: [
      "Popover content is keyboard reachable from its trigger in product code.",
      "Surface, text, icon, and border contrast pass in Light and Dark modes.",
      "Dismiss behavior remains a runtime composition concern.",
    ],
  },
  {
    componentName: "Menu",
    componentSetName: "Menu / v1",
    category: "Overlay",
    summary:
      "Menu presents a compact list of actions or choices from a trigger.",
    usage: [
      "Use for contextual actions where the choices are known and short.",
      "Use Checkbox or Radio content when the menu reflects selectable state.",
      "Avoid long-form content inside Menu; use Popover or Dialog instead.",
    ],
    api: [
      "Content maps to composed MenuContent examples in Code Connect.",
      "Label Text maps to MenuLabel children.",
      "Item text properties map to MenuItem, MenuCheckboxItem, or MenuRadioItem children.",
      "Shortcut Text maps to MenuShortcut children.",
    ],
    properties: [
      "Content: Basic, Checkbox, Radio, Submenu",
      "Label Text, Item 1 Text, Item 2 Text, Item 3 Text, Shortcut Text",
    ],
    accessibility: [
      "Menu items keep a 32px visual row inside a trigger-owned interaction model.",
      "Text, checked marks, and boundaries pass in Light and Dark modes.",
      "Product code must provide roving focus and dismiss behavior through Radix.",
    ],
  },
  {
    componentName: "Toast",
    componentSetName: "Toast / v1",
    category: "Feedback",
    summary:
      "Toast presents transient feedback with title, description, optional action, and close affordance.",
    usage: [
      "Use for non-blocking confirmation or status updates.",
      "Include an action only when there is a clear quick recovery path.",
      "Prefer Alert for persistent status content in page layout.",
    ],
    api: [
      "Content maps to composed Toast children in Code Connect.",
      "Title Text maps to ToastTitle children.",
      "Description Text maps to ToastDescription children.",
      "Action Text maps to ToastAction children when the Action content variant is used.",
    ],
    properties: [
      "Content: Basic, Action",
      "Title Text, Description Text, Action Text",
    ],
    accessibility: [
      "Toast is non-modal status feedback and should use runtime live-region semantics.",
      "Text, action, and close affordance contrast pass in Light and Dark modes.",
      "Viewport placement remains a product-code composition concern.",
    ],
  },
  {
    componentName: "Checkbox",
    componentSetName: "Checkbox / v1",
    category: "Selection",
    summary:
      "Checkbox lets users select one or more independent options, with clear checked, disabled, and error states.",
    usage: [
      "Use for independent settings and multi-select decisions.",
      "Use Error when validation requires user attention.",
      "Keep the label adjacent and specific.",
    ],
    api: [
      "Checked maps to Checkbox.checked.",
      "State maps to disabled and error props in Code Connect.",
      "Label Text maps to Checkbox.label.",
      "Focus follows the React focus-visible ring.",
    ],
    properties: [
      "Checked: Unchecked, Checked",
      "State: Default, Disabled, Error",
      "Label Text, Focus Visible",
    ],
    accessibility: [
      "Rows meet the 44px minimum interactive target.",
      "Control and mark contrast pass in Light and Dark modes.",
      "Focus Visible controls the generated focus ring.",
    ],
  },
  {
    componentName: "Radio",
    componentSetName: "Radio / v1",
    category: "Selection",
    summary:
      "Radio represents one choice inside a mutually exclusive option group.",
    usage: [
      "Use for visible option lists where exactly one choice can be selected.",
      "Use Error when the group requires correction before submission.",
      "Prefer Select when the option list is long or space is constrained.",
    ],
    api: [
      "Checked maps to whether RadioGroup.defaultValue matches RadioGroupItem.value.",
      "State maps to disabled and error props in Code Connect.",
      "Label Text maps to RadioGroupItem.label.",
      "Focus follows the React focus-visible ring.",
    ],
    properties: [
      "Checked: Unchecked, Checked",
      "State: Default, Disabled, Error",
      "Label Text, Focus Visible",
    ],
    accessibility: [
      "Rows meet the 44px minimum interactive target.",
      "Control and checked-dot contrast pass in Light and Dark modes.",
      "Focus Visible controls the generated focus ring.",
    ],
  },
  {
    componentName: "Switch",
    componentSetName: "Switch / v1",
    category: "Selection",
    summary: "Switch toggles an immediate binary setting on or off.",
    usage: [
      "Use for settings that take effect immediately.",
      "Do not use when the choice needs a separate confirmation action.",
      "Use Error sparingly for validation or unavailable system states.",
    ],
    api: [
      "Checked maps to Switch.checked.",
      "State maps to disabled and error props in Code Connect.",
      "Label Text maps to Switch.label.",
      "Focus follows the React focus-visible ring.",
    ],
    properties: [
      "Checked: Unchecked, Checked",
      "State: Default, Disabled, Error",
      "Label Text, Focus Visible",
    ],
    accessibility: [
      "Rows meet the 44px minimum interactive target.",
      "Track and thumb contrast pass in Light and Dark modes.",
      "Focus Visible controls the generated focus ring.",
    ],
  },
  {
    componentName: "Input",
    componentSetName: "Input / v1",
    category: "Forms",
    summary:
      "Input captures a single line of user text with label, placeholder, optional helper text, and validation status.",
    usage: [
      "Use labels for persistent context and placeholders for examples only.",
      "Use helper text for validation guidance or successful completion messages.",
      "Readonly communicates fixed values without inviting edits.",
    ],
    api: [
      "State maps to focus, disabled, and readOnly props in Code Connect.",
      "Status maps to default, error, warning, and success validation tones.",
      "Label Text, Placeholder Text, Helper Text, and Show Helper Text map to Input props.",
      "Focus follows the React focus-visible ring.",
    ],
    properties: [
      "State: Default, Focus, Disabled, Readonly",
      "Status: Default, Error, Warning, Success",
      "Label Text, Placeholder Text, Helper Text, Show Helper Text, Focus Visible",
    ],
    accessibility: [
      "Field height meets the 44px minimum target.",
      "Text, placeholder, helper, and border contrast pass in both modes.",
      "Helper text can be hidden while preserving editable content.",
    ],
  },
  {
    componentName: "Textarea",
    componentSetName: "Textarea / v1",
    category: "Forms",
    summary:
      "Textarea captures longer freeform text with label, placeholder, interaction state, and error status.",
    usage: [
      "Use when users need more than one line of text.",
      "Keep placeholder examples short enough to avoid visual clutter.",
      "Use Error when the input requires correction.",
    ],
    api: [
      "State maps to focus, disabled, and readOnly props in Code Connect.",
      "Status maps to Textarea.error in Code Connect.",
      "Label Text maps to Textarea.label.",
      "Placeholder Text maps to Textarea.placeholder.",
    ],
    properties: [
      "State: Default, Focus, Disabled, Readonly",
      "Status: Default, Error",
      "Label Text, Placeholder Text, Focus Visible",
    ],
    accessibility: [
      "Default height exceeds the 44px minimum interactive target.",
      "Text and border contrast pass in Light and Dark modes.",
      "Focus Visible controls the generated focus ring.",
    ],
  },
  {
    componentName: "Search",
    componentSetName: "Search / v1",
    category: "Forms",
    summary:
      "Search captures query text with a leading search icon and the same interaction model as Input.",
    usage: [
      "Use for filtering, search pages, and command-like lookup surfaces.",
      "Keep label text available for accessibility even when visually compact.",
      "Use Readonly only when showing a fixed query state.",
    ],
    api: [
      "State maps to focus, disabled, and readOnly props in Code Connect.",
      "Status maps to Search.error in Code Connect.",
      "Label Text maps to Search.label.",
      "Placeholder Text maps to Search.placeholder.",
    ],
    properties: [
      "State: Default, Focus, Disabled, Readonly",
      "Status: Default, Error",
      "Label Text, Placeholder Text, Focus Visible",
    ],
    accessibility: [
      "Field height meets the 44px minimum target.",
      "The search icon and field boundary pass non-text contrast checks.",
      "Focus Visible controls the generated focus ring.",
    ],
  },
  {
    componentName: "Select",
    componentSetName: "Select / v1",
    category: "Forms",
    summary:
      "SelectTrigger opens a menu of options and displays the selected value or placeholder.",
    usage: [
      "Use when users choose one value from a compact list.",
      "Prefer Radio when all choices should remain visible.",
      "Use Error to indicate invalid or missing selection.",
    ],
    api: [
      "State maps to focus and disabled props in Code Connect.",
      "Status maps to SelectTrigger.error in Code Connect.",
      "Placeholder Text maps to SelectValue.placeholder.",
      "Focus follows the React focus-visible ring.",
    ],
    properties: [
      "State: Default, Focus, Disabled",
      "Status: Default, Error",
      "Placeholder Text, Focus Visible",
    ],
    accessibility: [
      "Trigger height meets the 44px minimum target.",
      "Text, icon, and boundary contrast pass in both modes.",
      "Focus Visible controls the generated focus ring.",
    ],
  },
  {
    componentName: "Slider",
    componentSetName: "Slider / v1",
    category: "Input",
    summary:
      "Slider lets users adjust a bounded numeric value on a visual range.",
    usage: [
      "Use when approximate adjustment is faster than typing.",
      "Pair with a visible value when precision matters.",
      "Use Error for validation states tied to the selected value.",
    ],
    api: [
      "State maps to focus and disabled props in Code Connect.",
      "Status maps to Slider.error in Code Connect.",
      "Label Text maps to Slider.label.",
      "Focus follows the React focus-visible ring on the thumb.",
    ],
    properties: [
      "State: Default, Focus, Disabled",
      "Status: Default, Error",
      "Label Text, Focus Visible",
    ],
    accessibility: [
      "Overall control height meets the 44px interaction target.",
      "Track and thumb boundaries pass the 3:1 non-text guidance.",
      "Focus Visible controls the generated thumb focus ring.",
    ],
  },
  {
    componentName: "Progress",
    componentSetName: "Progress / v1",
    category: "Feedback",
    summary:
      "Progress communicates completion for determinate loading or task state.",
    usage: [
      "Use when a task has measurable completion.",
      "Use Spinner instead when progress cannot be estimated.",
      "Avoid using Progress as an interactive input.",
    ],
    api: [
      "Value maps to Progress.value in Code Connect.",
      "Value variants cover 0, 25, 50, 75, and 100 percent examples.",
      "Progress is non-interactive and does not expose focus or disabled states.",
    ],
    properties: ["Value: 0, 25, 50, 75, 100"],
    accessibility: [
      "Track and fill pass non-text contrast guidance on Surface/0.",
      "The visual bar is non-interactive, so it does not need a 44px target.",
      "Code should provide an accessible progress value.",
    ],
  },
  {
    componentName: "Spinner",
    componentSetName: "Spinner / v1",
    category: "Feedback",
    summary:
      "Spinner communicates indeterminate loading when duration or completion cannot be predicted.",
    usage: [
      "Use for short waiting states where progress is unknown.",
      "Prefer Progress when completion is measurable.",
      "Pair with status text for longer waits.",
    ],
    api: [
      "Size maps to Spinner.size in Code Connect.",
      "Sizes map to sm, md, lg, and xl runtime values.",
      "Spinner is status feedback and non-interactive.",
    ],
    properties: ["Size: Small, Medium, Large, XLarge"],
    accessibility: [
      "Spinner stroke contrast passes in Light and Dark modes.",
      "Spinner is non-interactive, so it does not need a 44px target.",
      "Code should expose an appropriate loading status when necessary.",
    ],
  },
  {
    componentName: "Avatar",
    componentSetName: "Avatar / v1",
    category: "Identity",
    summary:
      "Avatar represents a person, account, or entity with image content or fallback initials.",
    usage: [
      "Use Image when a reliable profile image is available.",
      "Use Fallback when the image is unavailable or still loading.",
      "Keep fallback text short, usually one or two initials.",
    ],
    api: [
      "Content describes whether the Figma example shows image content or fallback initials.",
      "Image URL maps to AvatarImage.src.",
      "Alt Text maps to AvatarImage.alt.",
      "Fallback maps to AvatarFallback children in Code Connect.",
    ],
    properties: ["Content: Fallback, Image", "Fallback, Image URL, Alt Text"],
    accessibility: [
      "Fallback text contrast passes in Light and Dark modes.",
      "Avatar is non-interactive unless composed inside another control.",
      "Alt Text must describe the person or entity shown by the image.",
    ],
  },
  {
    componentName: "Alert",
    componentSetName: "Alert / v1",
    category: "Feedback",
    summary:
      "Alert presents contextual status content with title, description, tone, and icon.",
    usage: [
      "Use Default for neutral contextual information.",
      "Use Destructive, Warning, Success, or Info to communicate message tone.",
      "Keep descriptions direct and action-oriented.",
    ],
    api: [
      "Variant maps to Alert.variant in Code Connect.",
      "Title maps to AlertTitle children.",
      "Description maps to AlertDescription children.",
      "Alert is non-interactive status content.",
    ],
    properties: [
      "Variant: Default, Destructive, Success, Warning, Info",
      "Title, Description",
    ],
    accessibility: [
      "Text, icon, and border contrast pass in Light and Dark modes.",
      "Alert is non-interactive, so focus states are not exposed.",
      "Use semantic live-region behavior in product code only when the message is dynamic.",
    ],
  },
];
const FOCUS_VISIBLE_PROPERTY_NAME = "Focus Visible";
const DEFAULT_ICON_COMPONENT_NAME = "Icon / Slot Default";
const ICON_PAGE_NAME = "Icons";
const DEFAULT_CURATED_ICON_NAME = "search-md";
const KOSMOS_ICON_DEFINITIONS = [
  {
    name: "activity",
    figmaName: "activity",
    category: "General",
    componentKey: "f78d9ca48d2a538e6ef669730f34436169faa378",
    description: "Activity and status pulse.",
  },
  {
    name: "alert-circle",
    figmaName: "alert-circle",
    category: "Alerts & feedback",
    componentKey: "681cbc55bcc62ab6c335467487239c06204fc121",
    description: "Circular warning or validation alert.",
  },
  {
    name: "alert-triangle",
    figmaName: "alert-triangle",
    category: "Alerts & feedback",
    componentKey: "838860cebb3d8d48570381580f46086f2cbf31f8",
    description: "Triangular warning alert.",
  },
  {
    name: "arrow-left",
    figmaName: "arrow-left",
    category: "Arrows",
    componentKey: "2004c8e9d68cd9900346b47e76aab19298edf5e5",
    description: "Directional arrow left.",
  },
  {
    name: "arrow-right",
    figmaName: "arrow-right",
    category: "Arrows",
    componentKey: "1528623f23da482c4fd66789bdbf4a55c1bc59d8",
    description: "Directional arrow right.",
  },
  {
    name: "bell-01",
    figmaName: "bell-01",
    category: "General",
    componentKey: "3deb23e1ab8a78324a4272df2d048baa50205f39",
    description: "Notification bell.",
  },
  {
    name: "building-01",
    figmaName: "building-01",
    category: "General",
    componentKey: "adc46aca049a4e59317132be8c73d2cfbd786707",
    description: "Building or venue.",
  },
  {
    name: "bus",
    figmaName: "bus",
    category: "Maps & travel",
    componentKey: "4e7536f3a9bc1e09768482fd33ef28414e6b31d6",
    description: "Bus transit mode.",
  },
  {
    name: "calendar",
    figmaName: "calendar",
    category: "Time",
    componentKey: "d4eb472c7167ff6640f51d715e7fb311890d4792",
    description: "Calendar date picker.",
  },
  {
    name: "check",
    figmaName: "check",
    category: "General",
    componentKey: "f601c3bb92fe6cb3a026af1b2a01759bbe89a806",
    description: "Confirmation check mark.",
  },
  {
    name: "chevron-down",
    figmaName: "chevron-down",
    category: "Arrows",
    componentKey: "e896ae2f00a33d950b0f7312e1128bd1c59d5170",
    description: "Chevron down.",
  },
  {
    name: "chevron-left",
    figmaName: "chevron-left",
    category: "Arrows",
    componentKey: "bbeda37dc1dc91216013fc2ad81c3399f44c0c14",
    description: "Chevron left.",
  },
  {
    name: "chevron-right",
    figmaName: "chevron-right",
    category: "Arrows",
    componentKey: "428b0806cb58e6ebee32b2f7cbd64dd9bd85f0e9",
    description: "Chevron right.",
  },
  {
    name: "chevron-up",
    figmaName: "chevron-up",
    category: "Arrows",
    componentKey: "50e56f602a4b43f9963ae7f695fe13ee2b5fa1d6",
    description: "Chevron up.",
  },
  {
    name: "clock",
    figmaName: "clock",
    category: "Time",
    componentKey: "08adbc77ee4c51b32963ccf1fe72ac6a4d3f08bd",
    description: "Clock or time.",
  },
  {
    name: "compass-01",
    figmaName: "compass-01",
    category: "Maps & travel",
    componentKey: "b262b14178d28d97a4b976b72a70bdae0999e7ff",
    description: "Compass navigation.",
  },
  {
    name: "download-01",
    figmaName: "download-01",
    category: "General",
    componentKey: "29ff9dc6686602a1c235b3dbaf9aa4ae3dfad264",
    description: "Download action.",
  },
  {
    name: "edit-01",
    figmaName: "edit-01",
    category: "General",
    componentKey: "44041483f36de252124b379a891fc00dccb059dd",
    description: "Edit action.",
  },
  {
    name: "home-line",
    figmaName: "home-line",
    category: "General",
    componentKey: "8fe986a008470b554d0b47ac63e030d00cd07a5e",
    description: "Home navigation.",
  },
  {
    name: "info-circle",
    figmaName: "info-circle",
    category: "Alerts & feedback",
    componentKey: "2bd38fbeca52d383efd64031e70c330c21f1b609",
    description: "Informational message.",
  },
  {
    name: "lock-01",
    figmaName: "lock-01",
    category: "Security",
    componentKey: "7d57a4eb976ab7f70712747b4667ae4935fbfc0f",
    description: "Locked or private state.",
  },
  {
    name: "map-01",
    figmaName: "map-01",
    category: "Maps & travel",
    componentKey: "b883e50d71e3500426a2d43c1f00ba3825b06426",
    description: "Map view.",
  },
  {
    name: "marker-pin-01",
    figmaName: "marker-pin-01",
    category: "Maps & travel",
    componentKey: "a0d318bbb6e7634b80dc173a7ea8e1f49393e4c5",
    description: "Map pin or destination marker.",
  },
  {
    name: "menu-01",
    figmaName: "menu-01",
    category: "General",
    componentKey: "2354ba287be0cbacd2de01ed47d9eb284eb89b7e",
    description: "Navigation menu.",
  },
  {
    name: "minus",
    figmaName: "minus",
    category: "General",
    componentKey: "bb51a37b247c2c552f2bcaaba31c4a2f5e41966f",
    description: "Remove, collapse, or decrement.",
  },
  {
    name: "navigation-pointer-01",
    figmaName: "navigation-pointer-01",
    category: "Maps & travel",
    componentKey: "a5702e95e86702733e297d347243e79548ad2c5e",
    description: "Navigation pointer.",
  },
  {
    name: "plus",
    figmaName: "plus",
    category: "General",
    componentKey: "19b316378295e3508135be5eae492eaa1f1afe09",
    description: "Add or expand.",
  },
  {
    name: "qr-code-01",
    figmaName: "qr-code-01",
    category: "Development",
    componentKey: "762d574fb5612498060e08dac0fc8682fb900c16",
    description: "QR code.",
  },
  {
    name: "route",
    figmaName: "route",
    category: "Maps & travel",
    componentKey: "bc439a063f5539dd462417c452c979309a44f0d5",
    description: "Route or path.",
  },
  {
    name: "scan",
    figmaName: "scan",
    category: "Security",
    componentKey: "c1f65d4b3b447c5b7fd195446e6409570a696632",
    description: "Scan frame.",
  },
  {
    name: "search-md",
    figmaName: "search-md",
    category: "General",
    componentKey: "ef51678d08d83cc3645c684bec46c1aa7629ef42",
    description: "Search action.",
  },
  {
    name: "settings-01",
    figmaName: "settings-01",
    category: "General",
    componentKey: "c2a934a796c047d31d851feee464f4b8beab765a",
    description: "Settings.",
  },
  {
    name: "trash-01",
    figmaName: "trash-01",
    category: "General",
    componentKey: "5bb204c3a75db71969d618138e6b3322e342e765",
    description: "Delete action.",
  },
  {
    name: "upload-01",
    figmaName: "upload-01",
    category: "General",
    componentKey: "9ce8b7df1a2d0568a277be65cac91d1a6e01fedb",
    description: "Upload action.",
  },
  {
    name: "user-01",
    figmaName: "user-01",
    category: "Users",
    componentKey: "94049ae03d7c9d56b3a2c4e659d3eaa63cfae05b",
    description: "Single user.",
  },
  {
    name: "users-01",
    figmaName: "users-01",
    category: "Users",
    componentKey: "ca6431b25aebf9ceea8af2f4e21478bc498f4b5c",
    description: "User group.",
  },
  {
    name: "wifi",
    figmaName: "wifi",
    category: "Media & devices",
    componentKey: "c421c14e474eec4e3a9d42def105dd146266ecd1",
    description: "Wireless connection.",
  },
  {
    name: "x-close",
    figmaName: "x-close",
    category: "General",
    componentKey: "6c340143b2eb690526e4b6d2c04c6a0a0c03a369",
    description: "Close or dismiss.",
  },
];
const COMPONENT_COLLECTION_NAME = "Kozmos Components";
const BUTTON_LABEL_TEXT_STYLE_NAME = "Button / Label";
const COMPONENT_FLOAT_TOKENS = [
  { name: "Button/width/small", value: 96, scopes: ["WIDTH_HEIGHT"] },
  { name: "Button/width/default", value: 112, scopes: ["WIDTH_HEIGHT"] },
  { name: "Button/width/large", value: 136, scopes: ["WIDTH_HEIGHT"] },
  { name: "Button/width/icon", value: 44, scopes: ["WIDTH_HEIGHT"] },
  { name: "Button/height/small", value: 44, scopes: ["WIDTH_HEIGHT"] },
  { name: "Button/height/default", value: 44, scopes: ["WIDTH_HEIGHT"] },
  { name: "Button/height/large", value: 44, scopes: ["WIDTH_HEIGHT"] },
  { name: "Button/height/icon", value: 44, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Button/padding/x/small",
    value: 12,
    alias: "Layout/spacing/150",
    scopes: ["GAP"],
  },
  {
    name: "Button/padding/x/default",
    value: 16,
    alias: "Layout/spacing/200",
    scopes: ["GAP"],
  },
  {
    name: "Button/padding/x/large",
    value: 32,
    alias: "Layout/spacing/400",
    scopes: ["GAP"],
  },
  {
    name: "Button/padding/x/icon",
    value: 0,
    alias: "Layout/spacing/0",
    scopes: ["GAP"],
  },
  {
    name: "Button/padding/y",
    value: 0,
    alias: "Layout/spacing/0",
    scopes: ["GAP"],
  },
  {
    name: "Button/gap/default",
    value: 8,
    alias: "Layout/spacing/100",
    scopes: ["GAP"],
  },
  {
    name: "Button/gap/icon",
    value: 0,
    alias: "Layout/spacing/0",
    scopes: ["GAP"],
  },
  {
    name: "Button/radius",
    value: 8,
    alias: "Radius/DEFAULT",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Button/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Button/label/font-size", value: 14, scopes: ["FONT_SIZE"] },
  { name: "Button/label/line-height", value: 20, scopes: ["LINE_HEIGHT"] },
  {
    name: "Button/icon/size",
    value: 16,
    alias: "Layout/sizing/200",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Button/spinner/size", value: 14, scopes: ["WIDTH_HEIGHT"] },
  { name: "IconButton/size/small", value: 44, scopes: ["WIDTH_HEIGHT"] },
  { name: "IconButton/size/default", value: 44, scopes: ["WIDTH_HEIGHT"] },
  { name: "IconButton/size/large", value: 44, scopes: ["WIDTH_HEIGHT"] },
  { name: "IconButton/icon/size/small", value: 14, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "IconButton/icon/size/default",
    value: 16,
    alias: "Layout/sizing/200",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "IconButton/icon/size/large", value: 20, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "IconButton/spinner/size/small",
    value: 14,
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "IconButton/spinner/size/default",
    value: 14,
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "IconButton/spinner/size/large",
    value: 16,
    alias: "Layout/sizing/200",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "IconButton/radius",
    value: 9999,
    alias: "Radius/full",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "IconButton/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Counter/height/small", value: 18, scopes: ["WIDTH_HEIGHT"] },
  { name: "Counter/height/default", value: 20, scopes: ["WIDTH_HEIGHT"] },
  { name: "Counter/min-width/small", value: 18, scopes: ["WIDTH_HEIGHT"] },
  { name: "Counter/min-width/default", value: 20, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Counter/padding/x/small",
    value: 5,
    alias: "Layout/spacing/50",
    scopes: ["GAP"],
  },
  {
    name: "Counter/padding/x/default",
    value: 6,
    alias: "Layout/spacing/75",
    scopes: ["GAP"],
  },
  {
    name: "Counter/radius",
    value: 9999,
    alias: "Radius/full",
    scopes: ["CORNER_RADIUS"],
  },
  { name: "Counter/font-size/small", value: 11, scopes: ["FONT_SIZE"] },
  { name: "Counter/font-size/default", value: 12, scopes: ["FONT_SIZE"] },
  { name: "Counter/line-height/small", value: 14, scopes: ["LINE_HEIGHT"] },
  { name: "Counter/line-height/default", value: 16, scopes: ["LINE_HEIGHT"] },
  {
    name: "Badge/height/small",
    value: 44,
    alias: "Button/height/small",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Badge/height/default",
    value: 44,
    alias: "Button/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Badge/height/large",
    value: 44,
    alias: "Button/height/large",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Badge/height/icon",
    value: 44,
    alias: "Button/height/icon",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Badge/width/icon",
    value: 44,
    alias: "Button/width/icon",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Badge/padding/x/small",
    value: 12,
    alias: "Button/padding/x/small",
    scopes: ["GAP"],
  },
  {
    name: "Badge/padding/x/default",
    value: 16,
    alias: "Button/padding/x/default",
    scopes: ["GAP"],
  },
  {
    name: "Badge/padding/x/large",
    value: 32,
    alias: "Button/padding/x/large",
    scopes: ["GAP"],
  },
  {
    name: "Badge/padding/x/icon",
    value: 0,
    alias: "Button/padding/x/icon",
    scopes: ["GAP"],
  },
  {
    name: "Badge/padding/y",
    value: 0,
    alias: "Button/padding/y",
    scopes: ["GAP"],
  },
  { name: "Badge/gap", value: 4, alias: "Layout/spacing/50", scopes: ["GAP"] },
  {
    name: "Badge/icon/size",
    value: 16,
    alias: "Layout/sizing/200",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Badge/counter/height",
    value: 20,
    alias: "Counter/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Badge/counter/padding/x",
    value: 6,
    alias: "Counter/padding/x/default",
    scopes: ["GAP"],
  },
  {
    name: "Badge/counter/radius",
    value: 9999,
    alias: "Counter/radius",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Badge/counter/font-size",
    value: 12,
    alias: "Counter/font-size/default",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Badge/counter/line-height",
    value: 16,
    alias: "Counter/line-height/default",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Badge/radius",
    value: 8,
    alias: "Button/radius",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Badge/stroke/width",
    value: 1,
    alias: "Button/stroke/width",
    scopes: ["STROKE_FLOAT"],
  },
  {
    name: "Badge/label/font-size",
    value: 14,
    alias: "Button/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Badge/label/line-height",
    value: 20,
    alias: "Button/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  { name: "Card/width/default", value: 360, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Card/padding",
    value: 24,
    alias: "Layout/spacing/300",
    scopes: ["GAP"],
  },
  {
    name: "Card/header/gap",
    value: 6,
    alias: "Layout/spacing/75",
    scopes: ["GAP"],
  },
  {
    name: "Card/body/gap",
    value: 12,
    alias: "Layout/spacing/150",
    scopes: ["GAP"],
  },
  {
    name: "Card/footer/gap",
    value: 12,
    alias: "Layout/spacing/150",
    scopes: ["GAP"],
  },
  {
    name: "Card/radius",
    value: 16,
    alias: "Radius/lg",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Card/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Card/title/font-size", value: 24, scopes: ["FONT_SIZE"] },
  { name: "Card/title/line-height", value: 24, scopes: ["LINE_HEIGHT"] },
  {
    name: "Card/description/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Card/description/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Card/body/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  { name: "Card/body/line-height", value: 22, scopes: ["LINE_HEIGHT"] },
  { name: "Tabs/width/two", value: 320, scopes: ["WIDTH_HEIGHT"] },
  { name: "Tabs/width/three", value: 480, scopes: ["WIDTH_HEIGHT"] },
  { name: "Tabs/width/four", value: 640, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Tabs/list/height",
    value: 44,
    alias: "Button/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Tabs/list/padding",
    value: 4,
    alias: "Layout/spacing/50",
    scopes: ["GAP"],
  },
  {
    name: "Tabs/list/gap",
    value: 0,
    alias: "Layout/spacing/0",
    scopes: ["GAP"],
  },
  {
    name: "Tabs/list/radius",
    value: 16,
    alias: "Radius/lg",
    scopes: ["CORNER_RADIUS"],
  },
  { name: "Tabs/trigger/height", value: 36, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Tabs/trigger/padding/x",
    value: 12,
    alias: "Layout/spacing/150",
    scopes: ["GAP"],
  },
  { name: "Tabs/trigger/radius", value: 12, scopes: ["CORNER_RADIUS"] },
  {
    name: "Tabs/trigger/font-size",
    value: 14,
    alias: "Button/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Tabs/trigger/line-height",
    value: 20,
    alias: "Button/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  { name: "Checkbox/width/default", value: 176, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Checkbox/height/default",
    value: 44,
    alias: "Button/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Checkbox/control/size", value: 20, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Checkbox/control/radius",
    value: 4,
    alias: "Radius/sm",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Checkbox/control/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  {
    name: "Checkbox/gap",
    value: 8,
    alias: "Layout/spacing/100",
    scopes: ["GAP"],
  },
  {
    name: "Checkbox/padding/x",
    value: 0,
    alias: "Layout/spacing/0",
    scopes: ["GAP"],
  },
  {
    name: "Checkbox/label/font-size",
    value: 14,
    alias: "Button/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Checkbox/label/line-height",
    value: 20,
    alias: "Button/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Radio/width/default",
    value: 176,
    alias: "Checkbox/width/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Radio/height/default",
    value: 44,
    alias: "Checkbox/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Radio/control/size",
    value: 20,
    alias: "Checkbox/control/size",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Radio/dot/size", value: 10, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Radio/control/radius",
    value: 9999,
    alias: "Radius/full",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Radio/control/stroke/width",
    value: 1,
    alias: "Checkbox/control/stroke/width",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Radio/gap", value: 8, alias: "Checkbox/gap", scopes: ["GAP"] },
  {
    name: "Radio/padding/x",
    value: 0,
    alias: "Checkbox/padding/x",
    scopes: ["GAP"],
  },
  {
    name: "Radio/label/font-size",
    value: 14,
    alias: "Checkbox/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Radio/label/line-height",
    value: 20,
    alias: "Checkbox/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Switch/width/default",
    value: 176,
    alias: "Checkbox/width/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Switch/height/default",
    value: 44,
    alias: "Checkbox/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Switch/track/width",
    value: 44,
    alias: "Button/width/icon",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Switch/track/height", value: 24, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Switch/thumb/size",
    value: 20,
    alias: "Radio/control/size",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Switch/track/radius",
    value: 9999,
    alias: "Radius/full",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Switch/thumb/radius",
    value: 9999,
    alias: "Radius/full",
    scopes: ["CORNER_RADIUS"],
  },
  { name: "Switch/track/stroke/width", value: 2, scopes: ["STROKE_FLOAT"] },
  { name: "Switch/gap", value: 8, alias: "Checkbox/gap", scopes: ["GAP"] },
  {
    name: "Switch/padding/x",
    value: 0,
    alias: "Checkbox/padding/x",
    scopes: ["GAP"],
  },
  {
    name: "Switch/label/font-size",
    value: 14,
    alias: "Checkbox/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Switch/label/line-height",
    value: 20,
    alias: "Checkbox/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  { name: "Input/width/default", value: 320, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Input/field/height",
    value: 44,
    alias: "Button/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Input/field/padding/x",
    value: 12,
    alias: "Layout/spacing/150",
    scopes: ["GAP"],
  },
  {
    name: "Input/field/padding/y",
    value: 0,
    alias: "Layout/spacing/0",
    scopes: ["GAP"],
  },
  {
    name: "Input/field/radius",
    value: 8,
    alias: "Button/radius",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Input/field/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Input/gap", value: 6, alias: "Layout/spacing/75", scopes: ["GAP"] },
  {
    name: "Input/label/font-size",
    value: 14,
    alias: "Checkbox/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Input/label/line-height",
    value: 20,
    alias: "Checkbox/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Input/text/font-size",
    value: 14,
    alias: "Checkbox/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Input/text/line-height",
    value: 20,
    alias: "Checkbox/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Tooltip/padding/x",
    value: 12,
    alias: "Layout/spacing/150",
    scopes: ["GAP"],
  },
  {
    name: "Tooltip/padding/y",
    value: 6,
    alias: "Layout/spacing/75",
    scopes: ["GAP"],
  },
  {
    name: "Tooltip/radius",
    value: 8,
    alias: "Radius/md",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Tooltip/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  {
    name: "Tooltip/tip/size",
    value: 8,
    alias: "Layout/spacing/100",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Tooltip/tip/height",
    value: 4,
    alias: "Layout/spacing/50",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Tooltip/side-offset",
    value: 4,
    alias: "Layout/spacing/50",
    scopes: ["GAP"],
  },
  {
    name: "Tooltip/content/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Tooltip/content/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  { name: "Dialog/width/default", value: 512, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Dialog/padding",
    value: 24,
    alias: "Layout/spacing/300",
    scopes: ["GAP"],
  },
  {
    name: "Dialog/gap",
    value: 16,
    alias: "Layout/spacing/200",
    scopes: ["GAP"],
  },
  {
    name: "Dialog/header/gap",
    value: 6,
    alias: "Layout/spacing/75",
    scopes: ["GAP"],
  },
  {
    name: "Dialog/body/gap",
    value: 12,
    alias: "Layout/spacing/150",
    scopes: ["GAP"],
  },
  {
    name: "Dialog/footer/gap",
    value: 8,
    alias: "Layout/spacing/100",
    scopes: ["GAP"],
  },
  {
    name: "Dialog/footer/height",
    value: 44,
    alias: "Button/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Dialog/radius",
    value: 16,
    alias: "Radius/lg",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Dialog/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Dialog/close/size", value: 32, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Dialog/close/icon/size",
    value: 16,
    alias: "Button/icon/size",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Dialog/title/font-size", value: 18, scopes: ["FONT_SIZE"] },
  { name: "Dialog/title/line-height", value: 24, scopes: ["LINE_HEIGHT"] },
  {
    name: "Dialog/description/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Dialog/description/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Dialog/body/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Dialog/body/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  { name: "Popover/width/default", value: 288, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Popover/padding",
    value: 16,
    alias: "Layout/spacing/200",
    scopes: ["GAP"],
  },
  {
    name: "Popover/gap",
    value: 16,
    alias: "Layout/spacing/200",
    scopes: ["GAP"],
  },
  {
    name: "Popover/header/gap",
    value: 8,
    alias: "Layout/spacing/100",
    scopes: ["GAP"],
  },
  {
    name: "Popover/radius",
    value: 8,
    alias: "Radius/md",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Popover/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  {
    name: "Popover/side-offset",
    value: 4,
    alias: "Layout/spacing/50",
    scopes: ["GAP"],
  },
  {
    name: "Popover/title/font-size",
    value: 14,
    alias: "Input/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Popover/title/line-height",
    value: 20,
    alias: "Input/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Popover/description/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Popover/description/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  { name: "Menu/width/default", value: 192, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Menu/padding",
    value: 4,
    alias: "Layout/spacing/50",
    scopes: ["GAP"],
  },
  {
    name: "Menu/radius",
    value: 8,
    alias: "Radius/md",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Menu/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Menu/item/height", value: 32, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Menu/item/padding/x",
    value: 8,
    alias: "Layout/spacing/100",
    scopes: ["GAP"],
  },
  {
    name: "Menu/item/inset/padding-left",
    value: 32,
    alias: "Layout/spacing/400",
    scopes: ["GAP"],
  },
  {
    name: "Menu/item/radius",
    value: 4,
    alias: "Radius/sm",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Menu/item/gap",
    value: 8,
    alias: "Layout/spacing/100",
    scopes: ["GAP"],
  },
  {
    name: "Menu/icon/size",
    value: 16,
    alias: "Button/icon/size",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Menu/separator/height",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Menu/text/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Menu/text/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  { name: "Menu/shortcut/font-size", value: 12, scopes: ["FONT_SIZE"] },
  { name: "Menu/shortcut/line-height", value: 16, scopes: ["LINE_HEIGHT"] },
  { name: "Toast/width/default", value: 420, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Toast/padding",
    value: 24,
    alias: "Layout/spacing/300",
    scopes: ["GAP"],
  },
  {
    name: "Toast/padding/right",
    value: 32,
    alias: "Layout/spacing/400",
    scopes: ["GAP"],
  },
  {
    name: "Toast/gap",
    value: 16,
    alias: "Layout/spacing/200",
    scopes: ["GAP"],
  },
  {
    name: "Toast/text/gap",
    value: 4,
    alias: "Layout/spacing/50",
    scopes: ["GAP"],
  },
  {
    name: "Toast/radius",
    value: 8,
    alias: "Radius/md",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Toast/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Toast/action/height", value: 32, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Toast/action/padding/x",
    value: 12,
    alias: "Layout/spacing/150",
    scopes: ["GAP"],
  },
  {
    name: "Toast/action/radius",
    value: 8,
    alias: "Radius/md",
    scopes: ["CORNER_RADIUS"],
  },
  { name: "Toast/close/size", value: 24, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Toast/close/icon/size",
    value: 16,
    alias: "Button/icon/size",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Toast/title/font-size",
    value: 14,
    alias: "Input/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Toast/title/line-height",
    value: 20,
    alias: "Input/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Toast/description/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Toast/description/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Textarea/width/default",
    value: 320,
    alias: "Input/width/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Textarea/field/height", value: 80, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Textarea/field/padding/x",
    value: 12,
    alias: "Input/field/padding/x",
    scopes: ["GAP"],
  },
  {
    name: "Textarea/field/padding/y",
    value: 8,
    alias: "Layout/spacing/100",
    scopes: ["GAP"],
  },
  {
    name: "Textarea/field/radius",
    value: 8,
    alias: "Input/field/radius",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Textarea/field/stroke/width",
    value: 1,
    alias: "Input/field/stroke/width",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Textarea/gap", value: 6, alias: "Input/gap", scopes: ["GAP"] },
  {
    name: "Textarea/label/font-size",
    value: 14,
    alias: "Input/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Textarea/label/line-height",
    value: 20,
    alias: "Input/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Textarea/text/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Textarea/text/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Search/width/default",
    value: 320,
    alias: "Input/width/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Search/field/height",
    value: 44,
    alias: "Input/field/height",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Search/field/padding/x",
    value: 12,
    alias: "Input/field/padding/x",
    scopes: ["GAP"],
  },
  {
    name: "Search/field/padding/y",
    value: 0,
    alias: "Input/field/padding/y",
    scopes: ["GAP"],
  },
  {
    name: "Search/field/radius",
    value: 8,
    alias: "Input/field/radius",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Search/field/stroke/width",
    value: 1,
    alias: "Input/field/stroke/width",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Search/gap", value: 6, alias: "Input/gap", scopes: ["GAP"] },
  {
    name: "Search/icon/size",
    value: 16,
    alias: "Button/icon/size",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Search/label/font-size",
    value: 14,
    alias: "Input/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Search/label/line-height",
    value: 20,
    alias: "Input/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Search/text/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Search/text/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Select/width/default",
    value: 320,
    alias: "Input/width/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Select/trigger/height",
    value: 44,
    alias: "Input/field/height",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Select/trigger/padding/x",
    value: 12,
    alias: "Input/field/padding/x",
    scopes: ["GAP"],
  },
  {
    name: "Select/trigger/padding/y",
    value: 0,
    alias: "Input/field/padding/y",
    scopes: ["GAP"],
  },
  {
    name: "Select/trigger/radius",
    value: 8,
    alias: "Input/field/radius",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Select/trigger/stroke/width",
    value: 1,
    alias: "Input/field/stroke/width",
    scopes: ["STROKE_FLOAT"],
  },
  {
    name: "Select/icon/size",
    value: 16,
    alias: "Button/icon/size",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Select/text/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Select/text/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Slider/width/default",
    value: 320,
    alias: "Input/width/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Slider/height/default",
    value: 44,
    alias: "Button/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Slider/track/height", value: 8, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Slider/thumb/size",
    value: 20,
    alias: "Radio/control/size",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Slider/gap", value: 6, alias: "Input/gap", scopes: ["GAP"] },
  {
    name: "Slider/label/font-size",
    value: 14,
    alias: "Input/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Slider/label/line-height",
    value: 20,
    alias: "Input/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Progress/width/default",
    value: 320,
    alias: "Input/width/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Progress/height/default", value: 8, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Progress/radius",
    value: 9999,
    alias: "Radius/full",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Progress/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  {
    name: "Spinner/size/small",
    value: 16,
    alias: "Button/icon/size",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Spinner/size/medium", value: 24, scopes: ["WIDTH_HEIGHT"] },
  { name: "Spinner/size/large", value: 32, scopes: ["WIDTH_HEIGHT"] },
  { name: "Spinner/size/xlarge", value: 48, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Spinner/stroke/width",
    value: 2,
    alias: "Switch/track/stroke/width",
    scopes: ["STROKE_FLOAT"],
  },
  { name: "Avatar/size/default", value: 40, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Avatar/radius",
    value: 9999,
    alias: "Radius/full",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Avatar/fallback/font-size",
    value: 14,
    alias: "Button/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Avatar/fallback/line-height",
    value: 20,
    alias: "Button/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  { name: "Alert/width/default", value: 360, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Alert/padding",
    value: 16,
    alias: "Layout/spacing/200",
    scopes: ["GAP"],
  },
  { name: "Alert/gap", value: 8, alias: "Layout/spacing/100", scopes: ["GAP"] },
  {
    name: "Alert/radius",
    value: 12,
    alias: "Radius/lg",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Alert/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  {
    name: "Alert/icon/size",
    value: 16,
    alias: "Button/icon/size",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Alert/title/font-size",
    value: 14,
    alias: "Button/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Alert/title/line-height",
    value: 20,
    alias: "Button/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Alert/description/font-size",
    value: 14,
    alias: "Input/text/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Alert/description/line-height",
    value: 20,
    alias: "Input/text/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  { name: "Text/font-size/xs", value: 12, scopes: ["FONT_SIZE"] },
  { name: "Text/line-height/xs", value: 16, scopes: ["LINE_HEIGHT"] },
  {
    name: "Text/font-size/sm",
    value: 14,
    alias: "Button/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Text/line-height/sm",
    value: 20,
    alias: "Button/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Text/font-size/base",
    value: 16,
    alias: "Input/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  { name: "Text/line-height/base", value: 24, scopes: ["LINE_HEIGHT"] },
  { name: "Text/font-size/lg", value: 18, scopes: ["FONT_SIZE"] },
  { name: "Text/line-height/lg", value: 28, scopes: ["LINE_HEIGHT"] },
  {
    name: "Text/font-size/xl",
    value: 20,
    alias: "Card/title/font-size",
    scopes: ["FONT_SIZE"],
  },
  { name: "Text/line-height/xl", value: 28, scopes: ["LINE_HEIGHT"] },
  {
    name: "Text/font-size/2xl",
    value: 24,
    alias: "Dialog/title/font-size",
    scopes: ["FONT_SIZE"],
  },
  { name: "Text/line-height/2xl", value: 32, scopes: ["LINE_HEIGHT"] },
  { name: "Text/font-size/3xl", value: 30, scopes: ["FONT_SIZE"] },
  { name: "Text/line-height/3xl", value: 36, scopes: ["LINE_HEIGHT"] },
  { name: "Text/font-size/4xl", value: 36, scopes: ["FONT_SIZE"] },
  { name: "Text/line-height/4xl", value: 40, scopes: ["LINE_HEIGHT"] },
  { name: "Link/width/default", value: 128, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Link/height/default",
    value: 44,
    alias: "Button/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Link/font-size",
    value: 14,
    alias: "Button/label/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Link/line-height",
    value: 20,
    alias: "Button/label/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Label/font-size",
    value: 14,
    alias: "Link/font-size",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Label/line-height",
    value: 20,
    alias: "Link/line-height",
    scopes: ["LINE_HEIGHT"],
  },
  {
    name: "Label/height/default",
    value: 44,
    alias: "Button/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Separator/length/default", value: 320, scopes: ["WIDTH_HEIGHT"] },
  { name: "Separator/thickness", value: 1, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Separator/height/vertical",
    value: 44,
    alias: "Button/height/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  { name: "Skeleton/width/line", value: 240, scopes: ["WIDTH_HEIGHT"] },
  { name: "Skeleton/height/line", value: 16, scopes: ["WIDTH_HEIGHT"] },
  { name: "Skeleton/width/block", value: 320, scopes: ["WIDTH_HEIGHT"] },
  { name: "Skeleton/height/block", value: 80, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Skeleton/size/circle",
    value: 40,
    alias: "Avatar/size/default",
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Skeleton/radius/default",
    value: 8,
    alias: "Radius/DEFAULT",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Skeleton/radius/circle",
    value: 9999,
    alias: "Radius/full",
    scopes: ["CORNER_RADIUS"],
  },
  { name: "Box/width/default", value: 320, scopes: ["WIDTH_HEIGHT"] },
  { name: "Box/min-height/default", value: 120, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Box/padding/default",
    value: 16,
    alias: "Layout/spacing/200",
    scopes: ["GAP"],
  },
  {
    name: "Box/radius",
    value: 8,
    alias: "Radius/DEFAULT",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Box/stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  {
    name: "Box/text/font-size",
    value: 14,
    alias: "Text/font-size/sm",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Box/text/line-height",
    value: 20,
    alias: "Text/line-height/sm",
    scopes: ["LINE_HEIGHT"],
  },
  { name: "Stack/width/default", value: 320, scopes: ["WIDTH_HEIGHT"] },
  { name: "Stack/height/column", value: 120, scopes: ["WIDTH_HEIGHT"] },
  { name: "Stack/height/row", value: 72, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Stack/gap/2",
    value: 8,
    alias: "Layout/spacing/100",
    scopes: ["GAP"],
  },
  {
    name: "Stack/gap/4",
    value: 16,
    alias: "Layout/spacing/200",
    scopes: ["GAP"],
  },
  { name: "Stack/gap/6", value: 24, scopes: ["GAP"] },
  { name: "Stack/item/width", value: 88, scopes: ["WIDTH_HEIGHT"] },
  { name: "Stack/item/height", value: 32, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Stack/item/radius",
    value: 8,
    alias: "Radius/DEFAULT",
    scopes: ["CORNER_RADIUS"],
  },
  { name: "Container/width/default", value: 480, scopes: ["WIDTH_HEIGHT"] },
  {
    name: "Container/min-height/default",
    value: 120,
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Container/padding/x",
    value: 24,
    alias: "Layout/spacing/300",
    scopes: ["GAP"],
  },
  {
    name: "Container/content-width/centered",
    value: 320,
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Container/content-width/fluid",
    value: 432,
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Container/content-height",
    value: 64,
    scopes: ["WIDTH_HEIGHT"],
  },
  {
    name: "Container/content-padding",
    value: 16,
    alias: "Layout/spacing/200",
    scopes: ["GAP"],
  },
  {
    name: "Container/content-radius",
    value: 8,
    alias: "Radius/DEFAULT",
    scopes: ["CORNER_RADIUS"],
  },
  {
    name: "Container/content-stroke/width",
    value: 1,
    alias: "Border Width/sm",
    scopes: ["STROKE_FLOAT"],
  },
  {
    name: "Container/text/font-size",
    value: 14,
    alias: "Text/font-size/sm",
    scopes: ["FONT_SIZE"],
  },
  {
    name: "Container/text/line-height",
    value: 20,
    alias: "Text/line-height/sm",
    scopes: ["LINE_HEIGHT"],
  },
];

figma.ui.onmessage = async (message) => {
  try {
    if (message.type === "inspect") {
      figma.ui.postMessage({
        type: "inspect-result",
        result: await inspectFile(),
      });
      return;
    }

    if (message.type === "import-foundations") {
      const result = await importFoundations(
        message.payload,
        message.options || {},
      );
      figma.ui.postMessage({ type: "import-result", result });
      return;
    }

    if (message.type === "build-text") {
      const result = await buildTextComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-text") {
      const result = await updateTextComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-text") {
      const result = await rebuildTextComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-heading") {
      const result = await buildHeadingComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-heading") {
      const result = await updateHeadingComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-heading") {
      const result = await rebuildHeadingComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-link") {
      const result = await buildLinkComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-link") {
      const result = await updateLinkComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-link") {
      const result = await rebuildLinkComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-label") {
      const result = await buildLabelComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-label") {
      const result = await updateLabelComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-label") {
      const result = await rebuildLabelComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-separator") {
      const result = await buildSeparatorComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-separator") {
      const result = await updateSeparatorComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-separator") {
      const result = await rebuildSeparatorComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-skeleton") {
      const result = await buildSkeletonComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-skeleton") {
      const result = await updateSkeletonComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-skeleton") {
      const result = await rebuildSkeletonComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-box") {
      const result = await buildBoxComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-box") {
      const result = await updateBoxComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-box") {
      const result = await rebuildBoxComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-stack") {
      const result = await buildStackComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-stack") {
      const result = await updateStackComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-stack") {
      const result = await rebuildStackComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-container") {
      const result = await buildContainerComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-container") {
      const result = await updateContainerComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-container") {
      const result = await rebuildContainerComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-button") {
      const result = await buildButtonComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-button") {
      const result = await updateButtonComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-button") {
      const result = await rebuildButtonComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-icon-button") {
      const result = await buildIconButtonComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-icon-button") {
      const result = await updateIconButtonComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-icon-button") {
      const result = await rebuildIconButtonComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-counter") {
      const result = await buildCounterComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-counter") {
      const result = await updateCounterComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-counter") {
      const result = await rebuildCounterComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-badge") {
      const result = await buildBadgeComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-badge") {
      const result = await updateBadgeComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-badge") {
      const result = await rebuildBadgeComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-card") {
      const result = await buildCardComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-card") {
      const result = await updateCardComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-card") {
      const result = await rebuildCardComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-tabs") {
      const result = await buildTabsComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-tabs") {
      const result = await updateTabsComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-tabs") {
      const result = await rebuildTabsComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-tooltip") {
      const result = await buildTooltipComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-tooltip") {
      const result = await updateTooltipComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-tooltip") {
      const result = await rebuildTooltipComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-dialog") {
      const result = await buildDialogComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-dialog") {
      const result = await updateDialogComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-dialog") {
      const result = await rebuildDialogComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-popover") {
      const result = await buildPopoverComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-popover") {
      const result = await updatePopoverComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-popover") {
      const result = await rebuildPopoverComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-menu") {
      const result = await buildMenuComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-menu") {
      const result = await updateMenuComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-menu") {
      const result = await rebuildMenuComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-checkbox") {
      const result = await buildCheckboxComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-checkbox") {
      const result = await updateCheckboxComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-checkbox") {
      const result = await rebuildCheckboxComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-radio") {
      const result = await buildRadioComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-radio") {
      const result = await updateRadioComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-radio") {
      const result = await rebuildRadioComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-switch") {
      const result = await buildSwitchComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-switch") {
      const result = await updateSwitchComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-switch") {
      const result = await rebuildSwitchComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-input") {
      const result = await buildInputComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-input") {
      const result = await updateInputComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-input") {
      const result = await rebuildInputComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-textarea") {
      const result = await buildTextareaComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-textarea") {
      const result = await updateTextareaComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-textarea") {
      const result = await rebuildTextareaComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-search") {
      const result = await buildSearchComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-search") {
      const result = await updateSearchComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-search") {
      const result = await rebuildSearchComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-select") {
      const result = await buildSelectComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-select") {
      const result = await updateSelectComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-select") {
      const result = await rebuildSelectComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-slider") {
      const result = await buildSliderComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-slider") {
      const result = await updateSliderComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-slider") {
      const result = await rebuildSliderComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-progress") {
      const result = await buildProgressComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-progress") {
      const result = await updateProgressComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-progress") {
      const result = await rebuildProgressComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-spinner") {
      const result = await buildSpinnerComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-spinner") {
      const result = await updateSpinnerComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-spinner") {
      const result = await rebuildSpinnerComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-avatar") {
      const result = await buildAvatarComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-avatar") {
      const result = await updateAvatarComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-avatar") {
      const result = await rebuildAvatarComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-alert") {
      const result = await buildAlertComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-alert") {
      const result = await updateAlertComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-alert") {
      const result = await rebuildAlertComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-toast") {
      const result = await buildToastComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-toast") {
      const result = await updateToastComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "rebuild-toast") {
      const result = await rebuildToastComponent();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "audit-library") {
      const result = await auditLibrary();
      figma.ui.postMessage({ type: "audit-result", result });
      return;
    }

    if (message.type === "document-components") {
      const result = await documentComponentLibrary();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "reorganize-components") {
      const result = await reorganizeComponentsPage();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-surface-qa") {
      const result = await buildSurfaceQaPage();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "build-icons") {
      const result = await syncIconSourceLibrary();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "update-icons") {
      const result = await syncIconSourceLibrary();
      figma.ui.postMessage({ type: "component-result", result });
      return;
    }

    if (message.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    figma.ui.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
};

async function inspectFile() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const variables = await figma.variables.getLocalVariablesAsync();

  return {
    fileName: figma.root.name,
    pages: figma.root.children.map((page) => page.name),
    variableCollections: collections.map((collection) => ({
      name: collection.name,
      modes: collection.modes.map((mode) => mode.name),
      variableCount: variables.filter(
        (variable) => variable.variableCollectionId === collection.id,
      ).length,
    })),
    variables: variables.length,
  };
}

async function documentComponentLibrary() {
  const stats = {
    documented: 0,
    descriptionsUpdated: 0,
    pagesCreated: 0,
    pagesUpdated: 0,
    splitPagesRemoved: 0,
    previewsCreated: 0,
    missingComponentSets: [],
    page: null,
    sections: [],
    warnings: [],
  };

  const fonts = await loadButtonFonts(stats);
  const componentSets = await findComponentSetsByName(COMPONENT_DOCS);
  await removeGeneratedSplitDocPages(stats);

  const existed = Boolean(
    figma.root.children.find((page) => page.name === COMPONENT_DOCS_PAGE_NAME),
  );
  const page = await ensurePage(COMPONENT_DOCS_PAGE_NAME);
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();
  removeGeneratedComponentDocs(page);

  const header = createDocsCatalogHeaderFrame(fonts);
  page.appendChild(header);

  let columnIndex = 0;
  let rowY = DOCS_CANVAS_Y + header.height + 48;
  let rowHeight = 0;

  for (let docIndex = 0; docIndex < COMPONENT_DOCS.length; docIndex += 1) {
    const doc = COMPONENT_DOCS[docIndex];
    const componentSet = componentSets[doc.componentSetName];
    if (!componentSet) {
      stats.missingComponentSets.push(doc.componentSetName);
      continue;
    }

    applyComponentSetDescription(
      componentSet,
      doc.componentSetName,
      false,
      null,
    );
    stats.descriptionsUpdated += 1;

    const section = createComponentDocsRoot(doc, componentSet, fonts, stats);
    section.x =
      DOCS_CANVAS_X + columnIndex * (DOCS_SECTION_WIDTH + DOCS_SECTION_GAP);
    section.y = rowY;
    page.appendChild(section);

    stats.documented += 1;
    stats.sections.push({
      name: doc.componentSetName,
      componentSetId: componentSet.id,
      urlNodeId: nodeIdForUrl(componentSet.id),
      x: section.x,
      y: section.y,
    });

    rowHeight = Math.max(rowHeight, docsMeasuredHeight(section));
    columnIndex += 1;
    if (columnIndex >= DOCS_COLUMNS) {
      columnIndex = 0;
      rowY += rowHeight + DOCS_ROW_GAP;
      rowHeight = 0;
    }
  }

  if (existed) {
    stats.pagesUpdated += 1;
  } else {
    stats.pagesCreated += 1;
  }
  stats.page = {
    name: page.name,
    id: page.id,
  };

  if (stats.missingComponentSets.length > 0) {
    stats.warnings.push(
      `Missing component sets: ${stats.missingComponentSets.join(", ")}`,
    );
  }

  stats.message = `Documented ${stats.documented} component set(s) in a ${DOCS_COLUMNS}-column Docs page grid and updated ${stats.descriptionsUpdated} description field(s).`;
  return stats;
}

async function buildSurfaceQaPage() {
  const stats = {
    page: null,
    panelsCreated: 0,
    instancesCreated: 0,
    modeBindingsApplied: 0,
    missingComponentSets: [],
    missingVariants: [],
    warnings: [],
  };

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const componentSets = await findComponentSetsByName(surfaceQaComponentDocs());
  const existed = Boolean(
    figma.root.children.find((page) => page.name === SURFACE_QA_PAGE_NAME),
  );
  const page = await ensurePage(SURFACE_QA_PAGE_NAME);
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();
  removeGeneratedSurfaceQa(page);

  const header = createSurfaceQaHeader(fonts);
  page.appendChild(header);

  const panels = [
    {
      title: "Surface/0 - Light",
      subtitle: "Transparent variants on the default product surface.",
      modeName: "Light",
      productSurface: false,
      fillToken: "Surface/0",
      fillFallback: "#FFFFFF",
      textTone: "light",
    },
    {
      title: "Surface/0 - Dark",
      subtitle: "The same live instances with the Dark variable mode applied.",
      modeName: "Dark",
      productSurface: false,
      fillToken: "Surface/0",
      fillFallback: "#101114",
      textTone: "dark",
    },
    {
      title: "Product map - Light",
      subtitle:
        "Representative indoor map surface with fill-extrusion and symbol_label layers.",
      modeName: "Light",
      productSurface: true,
      fillFallback: "#EEF3F8",
      textTone: "light",
    },
    {
      title: "Product map - Dark",
      subtitle:
        "Dark product-map host surface for glass, ghost, and transparent controls.",
      modeName: "Dark",
      productSurface: true,
      fillFallback: "#151B22",
      textTone: "dark",
    },
  ];

  for (let index = 0; index < panels.length; index += 1) {
    const panel = createSurfaceQaPanel(
      panels[index],
      componentSets,
      collections,
      variableByName,
      fonts,
      stats,
    );
    panel.x =
      SURFACE_QA_CANVAS_X +
      (index % 2) * (SURFACE_QA_PANEL_WIDTH + SURFACE_QA_PANEL_GAP);
    panel.y = SURFACE_QA_CANVAS_Y + 170 + Math.floor(index / 2) * 760;
    page.appendChild(panel);
    stats.panelsCreated += 1;
  }

  stats.page = {
    name: page.name,
    id: page.id,
    existed,
  };
  stats.message = `Built ${stats.panelsCreated} transparent surface QA panel(s) with ${stats.instancesCreated} live component instance(s).`;
  return stats;
}

function surfaceQaComponentDocs() {
  const requested = {};
  for (const group of SURFACE_QA_COMPONENT_GROUPS) {
    for (const row of group.rows) {
      for (const spec of row) requested[spec.componentSetName] = true;
    }
  }

  return Object.keys(requested).map((componentSetName) => ({
    componentSetName,
  }));
}

async function reorganizeComponentsPage() {
  const stats = {
    page: COMPONENTS_PAGE_NAME,
    preservedNodeIds: true,
    movedComponentSets: 0,
    skippedComponentSets: [],
    positions: [],
    warnings: [],
  };
  const page = figma.root.children.find(
    (child) => child.name === COMPONENTS_PAGE_NAME,
  );

  if (!page) {
    stats.message =
      "Components page was not found. Build at least one component set first.";
    return stats;
  }

  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  const nodes = [];
  for (const name of COMPONENT_PAGE_LAYOUT_ORDER) {
    const node = page.findOne(
      (child) => child.name === name && child.type === "COMPONENT_SET",
    );

    if (node) {
      nodes.push(node);
    } else {
      stats.skippedComponentSets.push(name);
    }
  }

  if (nodes.length === 0) {
    stats.message = "No known component sets were found to reorganize.";
    return stats;
  }

  let y = COMPONENT_PAGE_LAYOUT_Y;

  for (const node of nodes) {
    const bounds = measureComponentSetLayoutBounds(node);
    const footprintHeight = Math.max(
      bounds.height,
      COMPONENT_PAGE_LAYOUT_MIN_HEIGHTS[node.name] || 0,
      COMPONENT_PAGE_LAYOUT_MIN_FOOTPRINT_HEIGHT,
    );

    node.x = COMPONENT_PAGE_LAYOUT_X - bounds.minX;
    node.y = y - bounds.minY;
    stats.movedComponentSets += 1;
    stats.positions.push({
      name: node.name,
      id: node.id,
      urlNodeId: nodeIdForUrl(node.id),
      x: node.x,
      y: node.y,
      visualX: COMPONENT_PAGE_LAYOUT_X,
      visualY: y,
      width: bounds.width,
      height: bounds.height,
      footprintHeight,
    });

    y += footprintHeight + COMPONENT_PAGE_LAYOUT_ROW_GAP;
  }

  if (stats.skippedComponentSets.length > 0) {
    stats.warnings.push(
      `${stats.skippedComponentSets.length} known component set(s) were not present on the Components page.`,
    );
  }

  stats.message = `Reorganized ${stats.movedComponentSets} component set(s) on the Components page in one generous measured column; node IDs were preserved.`;
  return stats;
}

function measureComponentSetLayoutBounds(node) {
  const bounds = {
    minX: 0,
    minY: 0,
    maxX: Math.ceil(node.width || 0),
    maxY: Math.ceil(node.height || 0),
  };

  measureVisibleChildBounds(node, 0, 0, bounds);

  const minX = Math.floor(bounds.minX);
  const minY = Math.floor(bounds.minY);
  const maxX = Math.ceil(bounds.maxX);
  const maxY = Math.ceil(bounds.maxY);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function measureVisibleChildBounds(parent, offsetX, offsetY, bounds) {
  if (!parent || !("children" in parent)) return;

  for (const child of parent.children) {
    if (child.visible === false) continue;

    const childX = offsetX + (child.x || 0);
    const childY = offsetY + (child.y || 0);
    const childWidth = child.width || 0;
    const childHeight = child.height || 0;

    bounds.minX = Math.min(bounds.minX, childX);
    bounds.minY = Math.min(bounds.minY, childY);
    bounds.maxX = Math.max(bounds.maxX, childX + childWidth);
    bounds.maxY = Math.max(bounds.maxY, childY + childHeight);

    measureVisibleChildBounds(child, childX, childY, bounds);
  }
}

function removeGeneratedSurfaceQa(page) {
  const removable = [];
  for (const child of page.children) {
    if (
      child.getSharedPluginData &&
      child.getSharedPluginData(RUN_NAMESPACE, "kind") === "surface-qa"
    ) {
      removable.push(child);
    }
  }

  for (const child of removable) child.remove();
}

function createSurfaceQaHeader(fonts) {
  const header = figma.createFrame();
  header.name = "Kozmos DS / Transparent Surface QA";
  header.x = SURFACE_QA_CANVAS_X;
  header.y = SURFACE_QA_CANVAS_Y;
  header.resize(SURFACE_QA_PANEL_WIDTH * 2 + SURFACE_QA_PANEL_GAP, 120);
  header.layoutMode = "VERTICAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FIXED";
  header.itemSpacing = 10;
  header.paddingTop = 32;
  header.paddingRight = 36;
  header.paddingBottom = 32;
  header.paddingLeft = 36;
  header.cornerRadius = 16;
  header.fills = solidPaint(1, 1, 1);
  header.strokes = solidPaint(0.88, 0.89, 0.92);
  header.strokeWeight = 1;
  header.setSharedPluginData(RUN_NAMESPACE, "kind", "surface-qa");
  header.setSharedPluginData(RUN_NAMESPACE, "role", "header");

  header.appendChild(
    createSurfaceQaText(
      "Title",
      "Transparent Surface QA",
      fonts.medium,
      36,
      44,
      { r: 0.07, g: 0.08, b: 0.1 },
      SURFACE_QA_PANEL_WIDTH * 2 + SURFACE_QA_PANEL_GAP - 72,
    ),
  );
  header.appendChild(
    createSurfaceQaText(
      "Summary",
      "Generated checkpoint for the surface-dependent advisories in the component audit. Review these live instances on Surface/0 and representative product map surfaces before closing Core v1.",
      fonts.regular,
      15,
      24,
      { r: 0.28, g: 0.3, b: 0.36 },
      SURFACE_QA_PANEL_WIDTH * 2 + SURFACE_QA_PANEL_GAP - 72,
    ),
  );

  return header;
}

function createSurfaceQaPanel(
  panelSpec,
  componentSets,
  collections,
  variableByName,
  fonts,
  stats,
) {
  const panel = figma.createFrame();
  panel.name = `Surface QA / ${panelSpec.title}`;
  panel.resize(SURFACE_QA_PANEL_WIDTH, 100);
  panel.layoutMode = "VERTICAL";
  panel.primaryAxisSizingMode = "AUTO";
  panel.counterAxisSizingMode = "FIXED";
  panel.itemSpacing = 22;
  panel.paddingTop = 32;
  panel.paddingRight = 32;
  panel.paddingBottom = 36;
  panel.paddingLeft = 32;
  panel.cornerRadius = 16;
  panel.clipsContent = false;
  panel.fills = panelSpec.fillToken
    ? [
        paintFromVariable(
          panelSpec.fillToken,
          panelSpec.fillFallback,
          variableByName,
          stats,
        ),
      ]
    : [paintFromHex(panelSpec.fillFallback)];
  panel.strokes =
    panelSpec.textTone === "dark"
      ? solidPaint(0.28, 0.31, 0.36)
      : solidPaint(0.78, 0.8, 0.84);
  panel.strokeWeight = 1;
  panel.setSharedPluginData(RUN_NAMESPACE, "kind", "surface-qa");
  panel.setSharedPluginData(RUN_NAMESPACE, "role", "panel");
  panel.setSharedPluginData(RUN_NAMESPACE, "mode", panelSpec.modeName);
  panel.setSharedPluginData(
    RUN_NAMESPACE,
    "surface",
    panelSpec.productSurface ? "product-map" : "surface-0",
  );
  applySurfaceQaVariableMode(panel, collections, panelSpec.modeName, stats);

  panel.appendChild(createSurfaceQaPanelTitle(panelSpec, fonts));
  if (panelSpec.productSurface) {
    panel.appendChild(createProductMapSurfacePreview(panelSpec, fonts));
  }

  for (const group of SURFACE_QA_COMPONENT_GROUPS) {
    panel.appendChild(
      createSurfaceQaComponentGroup(
        group,
        componentSets,
        fonts,
        stats,
        panelSpec.textTone,
      ),
    );
  }

  return panel;
}

function createSurfaceQaPanelTitle(panelSpec, fonts) {
  const titleGroup = figma.createFrame();
  titleGroup.name = "Panel Header";
  titleGroup.resize(SURFACE_QA_PANEL_WIDTH - 64, 80);
  titleGroup.layoutMode = "VERTICAL";
  titleGroup.primaryAxisSizingMode = "AUTO";
  titleGroup.counterAxisSizingMode = "FIXED";
  titleGroup.itemSpacing = 6;
  titleGroup.fills = [];

  const dark = panelSpec.textTone === "dark";
  titleGroup.appendChild(
    createSurfaceQaText(
      "Title",
      panelSpec.title,
      fonts.medium,
      22,
      30,
      dark ? { r: 0.95, g: 0.96, b: 0.98 } : { r: 0.08, g: 0.09, b: 0.12 },
      SURFACE_QA_PANEL_WIDTH - 64,
    ),
  );
  titleGroup.appendChild(
    createSurfaceQaText(
      "Description",
      panelSpec.subtitle,
      fonts.regular,
      13,
      20,
      dark ? { r: 0.72, g: 0.75, b: 0.8 } : { r: 0.34, g: 0.36, b: 0.42 },
      SURFACE_QA_PANEL_WIDTH - 64,
    ),
  );

  return titleGroup;
}

function createProductMapSurfacePreview(panelSpec, fonts) {
  const dark = panelSpec.textTone === "dark";
  const map = figma.createFrame();
  map.name = "Product Surface / map preview";
  map.resize(SURFACE_QA_PANEL_WIDTH - 64, 180);
  map.cornerRadius = 12;
  map.clipsContent = true;
  map.fills = [dark ? paintFromHex("#101821") : paintFromHex("#E8EEF5")];
  map.strokes = [dark ? paintFromHex("#394452") : paintFromHex("#C4CEDB")];
  map.strokeWeight = 1;

  const extrusion = figma.createRectangle();
  extrusion.name = "Map Layer / fill-extrusion";
  extrusion.resize(250, 76);
  extrusion.x = 36;
  extrusion.y = 42;
  extrusion.cornerRadius = 10;
  extrusion.fills = [dark ? paintFromHex("#28384A") : paintFromHex("#CFD9E6")];
  map.appendChild(extrusion);

  const route = figma.createRectangle();
  route.name = "Map Layer / route";
  route.resize(420, 8);
  route.x = 176;
  route.y = 104;
  route.cornerRadius = 9999;
  route.rotation = -8;
  route.fills = [dark ? paintFromHex("#57C7FF") : paintFromHex("#135BEC")];
  map.appendChild(route);

  const label = figma.createText();
  label.name = "Map Layer / symbol_label";
  label.fontName = fonts.medium;
  label.fontSize = 13;
  label.lineHeight = { unit: "PIXELS", value: 18 };
  label.characters = "symbol_label";
  label.x = 372;
  label.y = 58;
  label.fills = [dark ? paintFromHex("#F8FAFC") : paintFromHex("#0D1016")];
  map.appendChild(label);

  const layerLabel = figma.createText();
  layerLabel.name = "Map Layer / fill-extrusion label";
  layerLabel.fontName = fonts.regular;
  layerLabel.fontSize = 12;
  layerLabel.lineHeight = { unit: "PIXELS", value: 18 };
  layerLabel.characters = "fill-extrusion";
  layerLabel.x = 52;
  layerLabel.y = 70;
  layerLabel.fills = [dark ? paintFromHex("#D8DEE8") : paintFromHex("#2D3440")];
  map.appendChild(layerLabel);

  return map;
}

function createSurfaceQaComponentGroup(
  group,
  componentSets,
  fonts,
  stats,
  textTone,
) {
  const wrapper = figma.createFrame();
  wrapper.name = `QA Group / ${group.title}`;
  wrapper.resize(SURFACE_QA_PANEL_WIDTH - 64, 100);
  wrapper.layoutMode = "VERTICAL";
  wrapper.primaryAxisSizingMode = "AUTO";
  wrapper.counterAxisSizingMode = "FIXED";
  wrapper.itemSpacing = SURFACE_QA_GROUP_GAP;
  wrapper.fills = [];
  wrapper.setSharedPluginData(RUN_NAMESPACE, "kind", "surface-qa");
  wrapper.setSharedPluginData(RUN_NAMESPACE, "role", "group");

  wrapper.appendChild(
    createSurfaceQaText(
      "Group Title",
      group.title,
      fonts.medium,
      13,
      18,
      surfaceQaMutedTextColor(textTone),
      SURFACE_QA_PANEL_WIDTH - 64,
    ),
  );

  for (const specs of group.rows) {
    const row = figma.createFrame();
    row.name = "QA Row";
    row.resize(SURFACE_QA_PANEL_WIDTH - 64, 56);
    row.layoutMode = "HORIZONTAL";
    row.primaryAxisSizingMode = "AUTO";
    row.counterAxisSizingMode = "AUTO";
    row.itemSpacing = 12;
    row.fills = [];

    for (const spec of specs) {
      appendSurfaceQaInstance(row, spec, componentSets, fonts, stats);
    }

    wrapper.appendChild(row);
  }

  return wrapper;
}

function surfaceQaMutedTextColor(textTone) {
  return textTone === "dark"
    ? { r: 0.6, g: 0.64, b: 0.72 }
    : { r: 0.43, g: 0.46, b: 0.53 };
}

function appendSurfaceQaInstance(row, spec, componentSets, fonts, stats) {
  const componentSet = componentSets[spec.componentSetName];
  if (!componentSet) {
    pushUnique(stats.missingComponentSets, spec.componentSetName);
    row.appendChild(
      createSurfaceQaMissingNode(fonts, `Missing ${spec.componentSetName}`),
    );
    return;
  }

  const component = componentSet.children.find(
    (child) => child.type === "COMPONENT" && child.name === spec.variantName,
  );
  if (!component) {
    pushUnique(
      stats.missingVariants,
      `${spec.componentSetName} / ${spec.variantName}`,
    );
    row.appendChild(createSurfaceQaMissingNode(fonts, spec.variantName));
    return;
  }

  const instance = component.createInstance();
  instance.name = `QA / ${spec.componentSetName} / ${spec.variantName}`;
  instance.setSharedPluginData(RUN_NAMESPACE, "kind", "surface-qa-instance");
  instance.setSharedPluginData(
    RUN_NAMESPACE,
    "componentSet",
    spec.componentSetName,
  );
  instance.setSharedPluginData(RUN_NAMESPACE, "variant", spec.variantName);

  if (spec.text) {
    for (const baseName of Object.keys(spec.text)) {
      setInstanceTextProperty(
        instance,
        componentSet,
        baseName,
        spec.text[baseName],
        stats,
      );
    }
  }

  row.appendChild(instance);
  stats.instancesCreated += 1;
}

function createSurfaceQaMissingNode(fonts, message) {
  const frame = figma.createFrame();
  frame.name = "QA Missing Instance";
  frame.resize(180, 44);
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.paddingTop = 10;
  frame.paddingRight = 12;
  frame.paddingBottom = 10;
  frame.paddingLeft = 12;
  frame.cornerRadius = 8;
  frame.fills = [paintFromHex("#FFF7ED")];
  frame.strokes = [paintFromHex("#FDBA74")];
  frame.strokeWeight = 1;

  frame.appendChild(
    createSurfaceQaText(
      "Missing",
      message,
      fonts.regular,
      11,
      16,
      { r: 0.54, g: 0.22, b: 0.04 },
      156,
    ),
  );

  return frame;
}

function createSurfaceQaText(
  name,
  characters,
  font,
  fontSize,
  lineHeight,
  color,
  width,
) {
  const text = figma.createText();
  text.name = name;
  text.fontName = font;
  text.fontSize = fontSize;
  text.lineHeight = { unit: "PIXELS", value: lineHeight };
  text.fills = solidPaint(color.r, color.g, color.b);
  text.resizeWithoutConstraints(width, lineHeight);
  setTextAutoResize(text, "HEIGHT");
  setLayoutSizingHorizontal(text, "FILL");
  text.characters = characters;
  return text;
}

function applySurfaceQaVariableMode(node, collections, modeName, stats) {
  if (!node || !node.setExplicitVariableModeForCollection) return;

  for (const collection of collections) {
    const mode = (collection.modes || []).find(
      (candidate) => candidate.name === modeName,
    );
    if (!mode) continue;

    try {
      node.setExplicitVariableModeForCollection(collection.id, mode.modeId);
      stats.modeBindingsApplied += 1;
    } catch (_error) {
      try {
        node.setExplicitVariableModeForCollection(collection, mode.modeId);
        stats.modeBindingsApplied += 1;
      } catch (error) {
        stats.warnings.push(
          `Could not apply ${modeName} mode for ${collection.name} (${messageFor(error)}).`,
        );
      }
    }
  }
}

function pushUnique(values, value) {
  if (values.indexOf(value) === -1) values.push(value);
}

async function findComponentSetsByName(docs) {
  const requested = {};
  const found = {};

  for (const doc of docs) {
    requested[doc.componentSetName] = true;
  }

  for (const page of figma.root.children) {
    await page.loadAsync();
    for (const child of page.children) {
      if (child.type !== "COMPONENT_SET") continue;
      if (!requested[child.name]) continue;
      found[child.name] = child;
    }
  }

  return found;
}

function removeGeneratedComponentDocs(page) {
  const removable = [];

  for (const child of page.children) {
    if (child.getSharedPluginData(RUN_NAMESPACE, "kind") === "component-docs") {
      removable.push(child);
    }
  }

  for (const child of removable) {
    child.remove();
  }
}

async function removeGeneratedSplitDocPages(stats) {
  const removable = [];

  for (const page of figma.root.children) {
    if (page.name.indexOf(COMPONENT_DOC_SPLIT_PAGE_PREFIX) !== 0) continue;

    await page.loadAsync();
    let generatedDocsPage = false;
    for (const child of page.children) {
      if (
        child.getSharedPluginData(RUN_NAMESPACE, "kind") === "component-docs"
      ) {
        generatedDocsPage = true;
        break;
      }
    }

    if (generatedDocsPage) removable.push(page);
  }

  for (const page of removable) {
    try {
      if (figma.currentPage && figma.currentPage.id === page.id) {
        const fallback = figma.root.children.find(
          (candidate) => candidate.id !== page.id,
        );
        if (fallback) await figma.setCurrentPageAsync(fallback);
      }

      page.remove();
      stats.splitPagesRemoved += 1;
    } catch (error) {
      stats.warnings.push(
        `Could not remove generated split docs page "${page.name}" (${messageFor(error)})`,
      );
    }
  }
}

function createDocsCatalogHeaderFrame(fonts) {
  const header = figma.createFrame();
  header.name = "Kozmos DS / Component Documentation";
  header.x = DOCS_CANVAS_X;
  header.y = DOCS_CANVAS_Y;
  header.resize(DOCS_CATALOG_WIDTH, 100);
  header.layoutMode = "VERTICAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FIXED";
  header.itemSpacing = 12;
  header.paddingTop = 40;
  header.paddingRight = 40;
  header.paddingBottom = 40;
  header.paddingLeft = 40;
  header.cornerRadius = 16;
  header.fills = solidPaint(1, 1, 1);
  header.strokes = solidPaint(0.88, 0.89, 0.92);
  header.strokeWeight = 1;
  header.setSharedPluginData(RUN_NAMESPACE, "kind", "component-docs");
  header.setSharedPluginData(RUN_NAMESPACE, "component", "Catalog");

  header.appendChild(
    createDocsText(
      "Eyebrow",
      "Kozmos DS",
      fonts.medium,
      13,
      18,
      { r: 0.36, g: 0.16, b: 0.86 },
      DOCS_CATALOG_WIDTH - 80,
    ),
  );
  header.appendChild(
    createDocsText(
      "Title",
      "Component Documentation",
      fonts.medium,
      44,
      52,
      { r: 0.07, g: 0.08, b: 0.1 },
      DOCS_CATALOG_WIDTH - 80,
    ),
  );
  header.appendChild(
    createDocsText(
      "Summary",
      "Generated reference for the v1 component library. Source component sets remain on the Components page so Code Connect node IDs stay stable.",
      fonts.regular,
      17,
      28,
      { r: 0.23, g: 0.25, b: 0.3 },
      DOCS_CATALOG_WIDTH - 80,
    ),
  );

  return header;
}

function createComponentDocsRoot(doc, componentSet, fonts, stats) {
  const root = figma.createFrame();
  root.name = `Docs Section / ${doc.componentSetName}`;
  root.resize(DOCS_SECTION_WIDTH, 100);
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "FIXED";
  root.itemSpacing = 24;
  root.paddingTop = DOCS_SECTION_PADDING;
  root.paddingRight = DOCS_SECTION_PADDING;
  root.paddingBottom = DOCS_SECTION_PADDING_BOTTOM;
  root.paddingLeft = DOCS_SECTION_PADDING;
  root.cornerRadius = 16;
  root.fills = solidPaint(1, 1, 1);
  root.strokes = solidPaint(0.88, 0.89, 0.92);
  root.strokeWeight = 1;
  root.setSharedPluginData(RUN_NAMESPACE, "kind", "component-docs");
  root.setSharedPluginData(RUN_NAMESPACE, "component", doc.componentName);

  const header = createDocsHeader(doc, componentSet, fonts);
  const preview = createDocsPreview(doc, componentSet, fonts, stats);
  const sections = [
    createDocsSection("Usage", doc.usage, fonts),
    createDocsSection("Properties", doc.properties, fonts),
    createDocsSection("Code Connect", doc.api, fonts),
    createDocsSection("Accessibility", doc.accessibility, fonts),
  ];
  const footer = createDocsText(
    "Source",
    [
      `Source component set: ${doc.componentSetName}`,
      `Node ID: ${nodeIdForUrl(componentSet.id)}`,
      "The source component set remains on the Components page so Code Connect links stay stable.",
    ].join("\n"),
    fonts.regular,
    13,
    20,
    { r: 0.32, g: 0.34, b: 0.39 },
  );

  root.appendChild(header);
  root.appendChild(preview);
  for (const section of sections) root.appendChild(section);
  root.appendChild(footer);

  return root;
}

function createDocsHeader(doc, componentSet, fonts) {
  const header = figma.createFrame();
  header.name = "Header";
  header.resize(DOCS_INNER_WIDTH, 100);
  header.layoutMode = "VERTICAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FIXED";
  header.itemSpacing = 12;
  header.fills = [];

  const eyebrow = createDocsText(
    "Category",
    `Kozmos DS / ${doc.category}`,
    fonts.medium,
    13,
    18,
    { r: 0.36, g: 0.16, b: 0.86 },
  );
  const title = createDocsText(
    "Title",
    doc.componentSetName,
    fonts.medium,
    34,
    42,
    { r: 0.07, g: 0.08, b: 0.1 },
  );
  const summary = createDocsText(
    "Description",
    doc.summary,
    fonts.regular,
    15,
    24,
    { r: 0.23, g: 0.25, b: 0.3 },
  );
  const metadata = createDocsText(
    "Metadata",
    [
      `Variants: ${componentSet.children.length}`,
      `Component properties: ${componentPropertyNamesForDocs(componentSet).join(", ") || "None"}`,
      `Right panel description: generated from this documentation source.`,
    ].join("\n"),
    fonts.regular,
    13,
    20,
    { r: 0.38, g: 0.4, b: 0.46 },
  );

  header.appendChild(eyebrow);
  header.appendChild(title);
  header.appendChild(summary);
  header.appendChild(metadata);
  return header;
}

function createDocsPreview(doc, componentSet, fonts, stats) {
  const frame = figma.createFrame();
  frame.name = "Preview";
  frame.resize(DOCS_INNER_WIDTH, 100);
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.itemSpacing = 18;
  frame.paddingTop = 24;
  frame.paddingRight = 24;
  frame.paddingBottom = 32;
  frame.paddingLeft = 24;
  frame.cornerRadius = 12;
  frame.fills = solidPaint(0.97, 0.97, 0.98);
  frame.strokes = solidPaint(0.88, 0.89, 0.92);
  frame.strokeWeight = 1;

  const title = createDocsText(
    "Preview Title",
    "Reference Preview",
    fonts.medium,
    16,
    22,
    { r: 0.09, g: 0.1, b: 0.13 },
  );
  const intro = createDocsText(
    "Preview Description",
    "Representative live instances from the source component set.",
    fonts.regular,
    13,
    20,
    { r: 0.34, g: 0.36, b: 0.42 },
  );
  const row = figma.createFrame();
  row.name = "Preview Instances";
  row.resize(DOCS_INNER_WIDTH - 48, 80);
  row.layoutMode = "HORIZONTAL";
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.itemSpacing = 16;
  row.paddingTop = 8;
  row.paddingRight = 8;
  row.paddingBottom = 8;
  row.paddingLeft = 8;
  row.fills = [];

  let previewCount = 0;
  const maxPreviewCount = docsPreviewLimitFor(doc.componentName);
  for (const child of docsPreviewComponentsFor(doc, componentSet)) {
    if (previewCount >= maxPreviewCount) break;

    try {
      const instance = child.createInstance();
      instance.name = `Preview / ${child.name}`;
      applyDocsPreviewOverrides(instance, child, doc, componentSet, stats);
      row.appendChild(instance);
      previewCount += 1;
      stats.previewsCreated += 1;
    } catch (error) {
      stats.warnings.push(
        `${doc.componentSetName}: could not create preview instance (${messageFor(error)})`,
      );
      break;
    }
  }

  if (previewCount === 0) {
    row.appendChild(
      createDocsText(
        "Preview Empty",
        "No preview instance could be generated for this component set.",
        fonts.regular,
        13,
        20,
        { r: 0.44, g: 0.46, b: 0.52 },
      ),
    );
  }

  frame.appendChild(title);
  frame.appendChild(intro);
  frame.appendChild(row);
  return frame;
}

function docsPreviewComponentsFor(doc, componentSet) {
  const components = componentSet.children.filter(
    (child) => child.type === "COMPONENT",
  );

  if (doc.componentName === "Badge") {
    return preferredPreviewComponents(components, [
      "Variant=Default, Size=Default",
      "Variant=Secondary, Size=Default",
      "Variant=Outline, Size=Default",
      "Variant=Destructive, Size=Default",
    ]);
  }

  if (doc.componentName === "Card") {
    return preferredPreviewComponents(components, [
      "Content=Full",
      "Content=Header",
      "Content=Basic",
    ]);
  }

  return components;
}

function preferredPreviewComponents(components, preferredNames) {
  const selected = [];

  for (const preferredName of preferredNames) {
    const match = components.find(
      (component) => component.name === preferredName,
    );
    if (match) selected.push(match);
  }

  for (const component of components) {
    if (selected.indexOf(component) === -1) selected.push(component);
  }

  return selected;
}

function applyDocsPreviewOverrides(
  instance,
  sourceComponent,
  doc,
  componentSet,
  stats,
) {
  if (!instance || !instance.setProperties) return;

  if (doc.componentName === "Badge") {
    const props = parseBadgeVariantName(sourceComponent.name);
    if (!props) return;
    setInstanceTextProperty(
      instance,
      componentSet,
      "Label Text",
      badgeLabelText(props.variant, props.size),
      stats,
    );
  }
}

function setInstanceTextProperty(
  instance,
  componentSet,
  baseName,
  value,
  stats,
) {
  const propertyName = componentPropertyNameByBaseName(
    componentSet,
    baseName,
    "TEXT",
  );
  if (!propertyName) return;

  try {
    instance.setProperties({ [propertyName]: value });
  } catch (error) {
    if (stats && stats.warnings) {
      stats.warnings.push(
        `${componentSet.name}: could not set ${baseName} preview property (${messageFor(error)})`,
      );
    }
  }
}

function setInstanceBooleanProperty(
  instance,
  componentSet,
  baseName,
  value,
  stats,
) {
  const propertyName = componentPropertyNameByBaseName(
    componentSet,
    baseName,
    "BOOLEAN",
  );
  if (!propertyName) return;

  try {
    instance.setProperties({ [propertyName]: value });
  } catch (error) {
    if (stats && stats.warnings) {
      stats.warnings.push(
        `${componentSet.name}: could not set ${baseName} instance property (${messageFor(error)})`,
      );
    }
  }
}

function componentPropertyNameByBaseName(componentSet, baseName, type) {
  const read = safeComponentPropertyDefinitions(componentSet, null, "preview");
  const definitions = read.definitions;

  for (const propertyName of Object.keys(definitions)) {
    const definition = definitions[propertyName];
    if (definition.type !== type) continue;
    if (propertyName.split("#")[0] === baseName) return propertyName;
  }

  return null;
}

async function findLocalComponentSetByName(name) {
  for (const page of figma.root.children) {
    await page.loadAsync();
    const match = page.findOne(
      (node) => node.type === "COMPONENT_SET" && node.name === name,
    );
    if (match && match.type === "COMPONENT_SET") return match;
  }

  return null;
}

function findComponentVariantByProperties(componentSet, properties) {
  if (!componentSet || !componentSet.children) return null;

  for (const child of componentSet.children) {
    if (child.type !== "COMPONENT") continue;
    if (componentVariantNameMatches(child.name, properties)) return child;
  }

  return null;
}

function componentVariantNameMatches(name, properties) {
  const actual = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    actual[key] = value;
  }

  for (const key of Object.keys(properties)) {
    if (actual[key] !== properties[key]) return false;
  }

  return true;
}

async function createNestedComponentInstance(config) {
  const componentSet = await findLocalComponentSetByName(
    config.componentSetName,
  );
  if (!componentSet) {
    if (config.stats && config.stats.warnings) {
      config.stats.warnings.push(
        `Missing ${config.componentSetName}; could not create nested ${config.name} instance.`,
      );
    }
    return null;
  }

  const variant = findComponentVariantByProperties(
    componentSet,
    config.variantProperties,
  );
  if (!variant) {
    if (config.stats && config.stats.warnings) {
      config.stats.warnings.push(
        `${config.componentSetName}: missing variant for nested ${config.name} instance.`,
      );
    }
    return null;
  }

  const instance = variant.createInstance();
  instance.name = config.name;
  markNestedComponentInstance(instance, config.componentSetName, config.role);

  return {
    componentSet,
    instance,
  };
}

function createMissingNestedComponentNode(name, message, stats) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = "HORIZONTAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.primaryAxisAlignItems = "CENTER";
  frame.counterAxisAlignItems = "CENTER";
  frame.paddingLeft = 12;
  frame.paddingRight = 12;
  frame.paddingTop = 8;
  frame.paddingBottom = 8;
  frame.cornerRadius = 8;
  frame.fills = [];
  frame.strokes = [];
  frame.resizeWithoutConstraints(180, 44);
  frame.setSharedPluginData(RUN_NAMESPACE, "kind", "missing-nested-component");

  if (stats && stats.warnings) {
    stats.warnings.push(`${name}: ${message}`);
  }

  return frame;
}

function isGeneratedNestedComponentInstance(node) {
  return (
    node &&
    node.type === "INSTANCE" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") ===
      "nested-component-instance"
  );
}

function nodeSourceComponentSet(node) {
  if (!node || node.type !== "INSTANCE" || !node.getSharedPluginData) {
    return null;
  }

  const generatedSource = node.getSharedPluginData(
    RUN_NAMESPACE,
    "sourceComponentSet",
  );
  if (generatedSource) return generatedSource;

  let mainComponent = null;
  try {
    mainComponent = node.mainComponent;
  } catch (_error) {
    mainComponent = null;
  }

  if (
    mainComponent &&
    mainComponent.parent &&
    mainComponent.parent.type === "COMPONENT_SET"
  ) {
    return mainComponent.parent.name;
  }

  return null;
}

function isNestedComponentInstance(node, componentSetName) {
  return (
    node &&
    node.type === "INSTANCE" &&
    nodeSourceComponentSet(node) === componentSetName
  );
}

function markNestedComponentInstance(node, componentSetName, role) {
  if (!node || node.type !== "INSTANCE" || !node.setSharedPluginData) return;

  node.setSharedPluginData(RUN_NAMESPACE, "kind", "nested-component-instance");
  node.setSharedPluginData(
    RUN_NAMESPACE,
    "sourceComponentSet",
    componentSetName,
  );
  if (role) {
    node.setSharedPluginData(RUN_NAMESPACE, "role", role);
  }
}

function isBadgeCounterNode(node) {
  if (!node || node.name !== "Counter" || !node.getSharedPluginData) {
    return false;
  }

  return (
    node.getSharedPluginData(RUN_NAMESPACE, "role") === "badge-counter" ||
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "badge-counter" ||
    isNestedComponentInstance(node, "Counter / v1")
  );
}

function docsPreviewLimitFor(componentName) {
  if (componentName === "Button") return 3;
  if (componentName === "IconButton") return 6;
  if (componentName === "Badge") return 4;
  if (componentName === "Card") return 1;
  if (componentName === "Tooltip") return 4;
  if (componentName === "Spinner") return 4;
  if (componentName === "Avatar") return 2;
  if (componentName === "Checkbox") return 3;
  if (componentName === "Radio") return 3;
  if (componentName === "Switch") return 3;
  if (componentName === "Input") return 2;
  if (componentName === "Textarea") return 2;
  if (componentName === "Search") return 2;
  if (componentName === "Select") return 2;
  if (componentName === "Slider") return 2;
  if (componentName === "Progress") return 2;
  if (componentName === "Alert") return 2;
  return 3;
}

function createDocsSection(title, lines, fonts) {
  const section = figma.createFrame();
  section.name = `Section / ${title}`;
  section.resize(DOCS_INNER_WIDTH, 100);
  section.layoutMode = "VERTICAL";
  section.primaryAxisSizingMode = "AUTO";
  section.counterAxisSizingMode = "FIXED";
  section.itemSpacing = 10;
  section.paddingTop = 24;
  section.paddingRight = 24;
  section.paddingBottom = 32;
  section.paddingLeft = 24;
  section.cornerRadius = 12;
  section.fills = solidPaint(1, 1, 1);
  section.strokes = solidPaint(0.88, 0.89, 0.92);
  section.strokeWeight = 1;

  const heading = createDocsText("Heading", title, fonts.medium, 18, 24, {
    r: 0.07,
    g: 0.08,
    b: 0.1,
  });
  const body = createDocsText(
    "Body",
    bulletLines(lines),
    fonts.regular,
    14,
    22,
    { r: 0.26, g: 0.28, b: 0.33 },
  );

  section.appendChild(heading);
  section.appendChild(body);
  return section;
}

function createDocsText(
  name,
  characters,
  font,
  fontSize,
  lineHeight,
  color,
  width,
) {
  const text = figma.createText();
  text.name = name;
  text.fontName = font;
  text.fontSize = fontSize;
  text.lineHeight = { unit: "PIXELS", value: lineHeight };
  text.fills = solidPaint(color.r, color.g, color.b);
  text.resizeWithoutConstraints(width || DOCS_INNER_WIDTH, lineHeight);
  setTextAutoResize(text, "HEIGHT");
  setLayoutSizingHorizontal(text, "FILL");
  text.characters = characters;
  return text;
}

function docsMeasuredHeight(node) {
  if (node && node.height && node.height > 100) return node.height;
  return 1160;
}

function bulletLines(lines) {
  const output = [];
  for (const line of lines) {
    output.push(`- ${line}`);
  }
  return output.join("\n");
}

function solidPaint(r, g, b) {
  return [{ type: "SOLID", color: { r, g, b } }];
}

function paintFromHex(value) {
  const color = parseColor(value);
  return {
    type: "SOLID",
    color: { r: color.r, g: color.g, b: color.b },
    opacity: color.a,
  };
}

function componentPropertyNamesForDocs(componentSet) {
  const read = safeComponentPropertyDefinitions(componentSet, null, "docs");
  const names = [];

  for (const propertyName in read.definitions) {
    if (!Object.prototype.hasOwnProperty.call(read.definitions, propertyName)) {
      continue;
    }

    names.push(propertyName);
  }

  return names;
}

function applyComponentSetDescription(
  componentSet,
  componentSetName,
  updated,
  fallbackLines,
) {
  const doc = componentDocForComponentSetName(componentSetName);
  const lines = doc
    ? componentSetDescriptionLines(doc)
    : fallbackComponentDescriptionLines(updated, fallbackLines);

  componentSet.description = lines.join("\n");
}

function componentDocForComponentSetName(componentSetName) {
  for (const doc of COMPONENT_DOCS) {
    if (doc.componentSetName === componentSetName) return doc;
  }

  return null;
}

function componentSetDescriptionLines(doc) {
  const lines = [doc.summary, "", "Usage:"];

  for (const item of doc.usage) lines.push(`- ${item}`);
  lines.push("");
  lines.push("Code Connect:");
  for (const item of doc.api) lines.push(`- ${item}`);
  lines.push("");
  lines.push("Accessibility:");
  for (const item of doc.accessibility) lines.push(`- ${item}`);
  lines.push("");
  lines.push(
    "Maintenance: update this component set in place to preserve Code Connect node IDs.",
  );
  return lines;
}

function fallbackComponentDescriptionLines(updated, fallbackLines) {
  const lines = [];
  if (fallbackLines) {
    for (const line of fallbackLines) lines.push(line);
  }

  if (updated) {
    lines.push("Updated in place to preserve the Code Connect node ID.");
  }

  return lines;
}

async function auditLibrary() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const variables = await figma.variables.getLocalVariablesAsync();
  const variableContext = createVariableContext(collections, variables);
  const icons = await auditIconSources();
  const surfaceQa = await auditSurfaceQaPage();
  const audit = {
    generatedAt: new Date().toISOString(),
    fileName: figma.root.name,
    pages: [],
    variables: auditVariables(collections, variables),
    icons,
    surfaceQa,
    componentSets: [],
    summary: {
      pageCount: figma.root.children.length,
      variableCollectionCount: collections.length,
      variableCount: variables.length,
      iconSourceCount: 0,
      componentSetCount: 0,
      componentCount: 0,
      warningCount: 0,
      advisoryCount: 0,
    },
    warnings: [],
    advisories: [],
  };

  if (icons.issueCount > 0) {
    audit.warnings.push(
      `${icons.issueCount} icon source component issue(s) found. Run Update Icons to refresh source sizing and constraints.`,
    );
  }

  if (surfaceQa.issueCount > 0) {
    audit.warnings.push(
      `${surfaceQa.issueCount} transparent surface QA issue(s) found. Fix the affected component contrast, then run Build Surface QA to refresh the generated page.`,
    );
  }

  for (const page of figma.root.children) {
    await page.loadAsync();
    const componentSets = page.findAll((node) => node.type === "COMPONENT_SET");
    const components = page.findAll((node) => node.type === "COMPONENT");
    const textNodes = page.findAll((node) => node.type === "TEXT");
    const pageRecord = {
      id: page.id,
      name: page.name,
      topLevelChildren: page.children.length,
      topLevelSample: page.children.slice(0, 12).map((node) => ({
        id: node.id,
        urlNodeId: nodeIdForUrl(node.id),
        name: node.name,
        type: node.type,
      })),
      componentSets: componentSets.length,
      components: components.length,
      textNodes: textNodes.length,
    };

    const unexpectedTopLevel = unexpectedTopLevelNodesForPage(page);
    if (unexpectedTopLevel.length > 0) {
      pageRecord.unexpectedTopLevel = unexpectedTopLevel;
      audit.warnings.push(
        `${page.name}: ${unexpectedTopLevel.length} unexpected top-level node(s) found: ${formatUnexpectedTopLevelNodes(unexpectedTopLevel)}.`,
      );
    }

    audit.pages.push(pageRecord);
    if (!isArchivePageName(page.name)) {
      audit.summary.componentSetCount += componentSets.length;
      audit.summary.componentCount += components.length;
    } else {
      pageRecord.archivedComponentSets = componentSets.length;
      pageRecord.archivedComponents = components.length;
    }

    if (!isArchivePageName(page.name)) {
      for (const componentSet of componentSets) {
        const record = auditComponentSet(
          componentSet,
          page.name,
          variableContext,
        );
        audit.componentSets.push(record);
        for (const warning of record.warnings) {
          audit.warnings.push(`${record.name}: ${warning}`);
        }
        for (const advisory of record.advisories) {
          audit.advisories.push(`${record.name}: ${advisory}`);
        }
      }
    }
  }

  audit.summary.iconSourceCount = audit.icons.foundCount;
  audit.summary.warningCount = audit.warnings.length;
  audit.summary.advisoryCount = audit.advisories.length;
  return audit;
}

function isArchivePageName(name) {
  return name === "Archive / Legacy Reference";
}

function unexpectedTopLevelNodesForPage(page) {
  if (page.name !== "Components") return [];

  const expectedComponentSets = new Set([
    "Text / v1",
    "Heading / v1",
    "Link / v1",
    "Label / v1",
    "Separator / v1",
    "Skeleton / v1",
    "Box / v1",
    "Stack / v1",
    "Container / v1",
    "Button / v1",
    "IconButton / v1",
    "Counter / v1",
    "Badge / v1",
    "Card / v1",
    "Tabs / v1",
    "Tooltip / v1",
    "Dialog / v1",
    "Popover / v1",
    "Menu / v1",
    "Checkbox / v1",
    "Radio / v1",
    "Switch / v1",
    "Input / v1",
    "Textarea / v1",
    "Search / v1",
    "Select / v1",
    "Slider / v1",
    "Progress / v1",
    "Spinner / v1",
    "Avatar / v1",
    "Alert / v1",
    "Toast / v1",
  ]);

  const unexpected = [];
  for (const node of page.children) {
    const isGeneratedComponentSet =
      node.type === "COMPONENT_SET" &&
      node.getSharedPluginData &&
      node.getSharedPluginData(RUN_NAMESPACE, "kind") === "component-set";
    if (
      isGeneratedComponentSet ||
      (node.type === "COMPONENT_SET" && expectedComponentSets.has(node.name))
    ) {
      continue;
    }

    unexpected.push({
      id: node.id,
      urlNodeId: nodeIdForUrl(node.id),
      name: node.name,
      type: node.type,
    });
  }

  return unexpected;
}

function formatUnexpectedTopLevelNodes(nodes) {
  const visible = nodes.slice(0, 4).map((node) => {
    return `${node.name} (${node.type}, node-id=${node.urlNodeId})`;
  });
  const remaining = nodes.length - visible.length;
  if (remaining > 0) {
    visible.push(`${remaining} more`);
  }
  return visible.join("; ");
}

function auditVariables(collections, variables) {
  const byCollection = [];

  for (const collection of collections) {
    const collectionVariables = variables.filter(
      (variable) => variable.variableCollectionId === collection.id,
    );
    const byType = {};
    let scopedVariables = 0;
    let unscopedVariables = 0;
    let variablesWithCodeSyntax = 0;

    for (const variable of collectionVariables) {
      byType[variable.resolvedType] = (byType[variable.resolvedType] || 0) + 1;
      if (variable.scopes && variable.scopes.length > 0) {
        scopedVariables += 1;
      } else {
        unscopedVariables += 1;
      }

      if (variable.codeSyntax && Object.keys(variable.codeSyntax).length > 0) {
        variablesWithCodeSyntax += 1;
      }
    }

    byCollection.push({
      id: collection.id,
      name: collection.name,
      modes: collection.modes.map((mode) => mode.name),
      variableCount: collectionVariables.length,
      byType,
      scopedVariables,
      unscopedVariables,
      variablesWithCodeSyntax,
      sample: collectionVariables.slice(0, 12).map((variable) => ({
        id: variable.id,
        name: variable.name,
        type: variable.resolvedType,
        scopes: variable.scopes || [],
      })),
    });
  }

  return {
    total: variables.length,
    byCollection,
  };
}

async function auditIconSources() {
  const expectedNames = KOSMOS_ICON_DEFINITIONS.map(
    (definition) => definition.name,
  );
  const foundNames = [];
  const foundByName = {};
  const issues = [];
  let sourceChildIssues = 0;
  let sourceConstraintIssues = 0;
  let sourceGeometryIssues = 0;
  const page = figma.root.children.find(
    (child) => child.name === ICON_PAGE_NAME,
  );

  if (page) {
    await page.loadAsync();
    const components = page.findAll(
      (node) =>
        node.type === "COMPONENT" &&
        node.getSharedPluginData &&
        node.getSharedPluginData(RUN_NAMESPACE, "kind") === "icon-source",
    );

    for (const component of components) {
      const iconName =
        component.getSharedPluginData(RUN_NAMESPACE, "icon-name") ||
        component.name.replace(/^Icon \/ /, "");
      foundNames.push(iconName);
      foundByName[iconName] = {
        id: component.id,
        urlNodeId: nodeIdForUrl(component.id),
        name: component.name,
        source: auditIconSourceComponent(component, iconName),
      };

      for (const issue of foundByName[iconName].source.issues) {
        issues.push(issue);
        if (issue.kind === "missing-source") sourceChildIssues += 1;
        if (issue.kind === "source-constraints") sourceConstraintIssues += 1;
        if (issue.kind === "source-geometry") sourceGeometryIssues += 1;
      }
    }
  }

  const missing = expectedNames.filter((name) => !foundByName[name]);
  const unexpected = foundNames.filter(
    (name) => expectedNames.indexOf(name) === -1,
  );

  foundNames.sort();

  return {
    page: ICON_PAGE_NAME,
    expectedCount: expectedNames.length,
    foundCount: foundNames.length,
    missingCount: missing.length,
    unexpectedCount: unexpected.length,
    missing,
    unexpected,
    sourceChildIssues,
    sourceConstraintIssues,
    sourceGeometryIssues,
    issueCount: issues.length,
    issues: issues.slice(0, 12),
    sample: foundNames.slice(0, 12).map((name) => foundByName[name]),
  };
}

async function auditSurfaceQaPage() {
  const page = figma.root.children.find(
    (child) => child.name === SURFACE_QA_PAGE_NAME,
  );
  const expectedPanels = 4;
  const expectedInstances = expectedPanels * surfaceQaExpectedInstanceCount();
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const variables = await figma.variables.getLocalVariablesAsync();
  const variableContext = createVariableContext(collections, variables);

  if (!page) {
    return {
      page: SURFACE_QA_PAGE_NAME,
      found: false,
      panelCount: 0,
      expectedPanels,
      instanceCount: 0,
      expectedInstances,
      issueCount: 0,
      issues: [],
    };
  }

  await page.loadAsync();
  const panels = page.findAll(
    (node) =>
      node.getSharedPluginData &&
      node.getSharedPluginData(RUN_NAMESPACE, "kind") === "surface-qa" &&
      node.getSharedPluginData(RUN_NAMESPACE, "role") === "panel",
  );
  const instances = page.findAll(
    (node) =>
      node.getSharedPluginData &&
      node.getSharedPluginData(RUN_NAMESPACE, "kind") === "surface-qa-instance",
  );
  const modes = [];
  const surfaces = [];
  const issues = [];
  const contrast = createContrastAuditResult();

  for (const panel of panels) {
    pushUnique(modes, panel.getSharedPluginData(RUN_NAMESPACE, "mode"));
    pushUnique(surfaces, panel.getSharedPluginData(RUN_NAMESPACE, "surface"));
    mergeContrastModeResult(
      contrast,
      auditSurfaceQaPanelContrast(panel, variableContext),
    );
  }

  if (panels.length !== expectedPanels) {
    issues.push({
      kind: "panel-count",
      expected: expectedPanels,
      actual: panels.length,
    });
  }

  if (instances.length < expectedInstances) {
    issues.push({
      kind: "instance-count",
      expectedAtLeast: expectedInstances,
      actual: instances.length,
    });
  }

  for (const modeName of ["Light", "Dark"]) {
    if (modes.indexOf(modeName) === -1) {
      issues.push({ kind: "missing-mode-panel", mode: modeName });
    }
  }

  for (const surfaceName of ["surface-0", "product-map"]) {
    if (surfaces.indexOf(surfaceName) === -1) {
      issues.push({ kind: "missing-surface-panel", surface: surfaceName });
    }
  }

  if (contrast.textFailures > 0 || contrast.nonTextFailures > 0) {
    issues.push({
      kind: "surface-contrast",
      textFailures: contrast.textFailures,
      nonTextFailures: contrast.nonTextFailures,
      failures: contrast.failures,
    });
  }

  if (contrast.minTextContrast !== null) {
    contrast.minTextContrast = Math.round(contrast.minTextContrast * 100) / 100;
  }

  if (contrast.minNonTextContrast !== null) {
    contrast.minNonTextContrast =
      Math.round(contrast.minNonTextContrast * 100) / 100;
  }

  return {
    page: SURFACE_QA_PAGE_NAME,
    id: page.id,
    found: true,
    panelCount: panels.length,
    expectedPanels,
    instanceCount: instances.length,
    expectedInstances,
    modes,
    surfaces,
    contrast,
    issueCount: issues.length,
    issues,
  };
}

function auditSurfaceQaPanelContrast(panel, variableContext) {
  const modeName = panel.getSharedPluginData(RUN_NAMESPACE, "mode") || "Light";
  const surfaceName =
    panel.getSharedPluginData(RUN_NAMESPACE, "surface") || "surface";
  const result = createContrastAuditResult();
  result.mode = `${modeName} / ${surfaceName}`;

  const background = surfaceQaPanelBackground(panel, variableContext, modeName);
  const instances = panel.findAll(
    (node) =>
      node.getSharedPluginData &&
      node.getSharedPluginData(RUN_NAMESPACE, "kind") === "surface-qa-instance",
  );

  for (const instance of instances) {
    auditSurfaceQaInstanceContrast(
      instance,
      background,
      modeName,
      variableContext,
      result,
    );
  }

  return result;
}

function surfaceQaPanelBackground(panel, variableContext, modeName) {
  const fill = solidPaintToRgba(
    firstVisibleSolidPaint(panel.fills),
    variableContext,
    modeName,
  );

  if (fill) return compositeColor(fill, { r: 1, g: 1, b: 1, a: 1 });

  return (
    colorForVariableName(
      "Surface/0",
      modeName === "Dark" ? "#000000" : "#FFFFFF",
      variableContext,
      modeName,
    ) || { r: 1, g: 1, b: 1, a: 1 }
  );
}

function auditSurfaceQaInstanceContrast(
  instance,
  hostBackground,
  modeName,
  variableContext,
  result,
) {
  const variantName =
    instance.getSharedPluginData(RUN_NAMESPACE, "variant") || instance.name;
  const isDisabled = variantName.indexOf("State=Disabled") !== -1;
  const instanceFill = solidPaintToRgba(
    firstVisibleSolidPaint(instance.fills),
    variableContext,
    modeName,
  );
  const background = instanceFill
    ? compositeColor(instanceFill, hostBackground)
    : hostBackground;

  auditNodeContrast(
    instance,
    background,
    isDisabled,
    result,
    variableContext,
    instance.name,
    modeName,
  );
}

function surfaceQaExpectedInstanceCount() {
  let count = 0;
  for (const group of SURFACE_QA_COMPONENT_GROUPS) {
    for (const row of group.rows) count += row.length;
  }
  return count;
}

function auditIconSourceComponent(component, iconName) {
  const source = directChildNamed(component, "Pointr Source");
  const issues = [];

  if (!source || source.type !== "INSTANCE") {
    issues.push({
      icon: iconName,
      kind: "missing-source",
      message:
        "Icon source component is missing a direct Pointr Source instance.",
    });
    return {
      childType: source ? source.type : null,
      constraints: null,
      width: null,
      height: null,
      issues,
    };
  }

  const constraints = source.constraints || {};
  if (
    constraints.horizontal !== "STRETCH" ||
    constraints.vertical !== "STRETCH"
  ) {
    issues.push({
      icon: iconName,
      kind: "source-constraints",
      horizontal: constraints.horizontal || null,
      vertical: constraints.vertical || null,
      expectedHorizontal: "STRETCH",
      expectedVertical: "STRETCH",
    });
  }

  const sameBounds =
    Math.round(source.x) === 0 &&
    Math.round(source.y) === 0 &&
    Math.round(source.width) === Math.round(component.width) &&
    Math.round(source.height) === Math.round(component.height);

  if (!sameBounds) {
    issues.push({
      icon: iconName,
      kind: "source-geometry",
      x: Math.round(source.x),
      y: Math.round(source.y),
      width: Math.round(source.width),
      height: Math.round(source.height),
      expectedWidth: Math.round(component.width),
      expectedHeight: Math.round(component.height),
    });
  }

  return {
    childType: source.type,
    constraints: {
      horizontal: constraints.horizontal || null,
      vertical: constraints.vertical || null,
    },
    width: Math.round(source.width),
    height: Math.round(source.height),
    issues,
  };
}

function auditComponentSet(componentSet, pageName, variableContext) {
  const childComponents = componentSet.children.filter(
    (child) => child.type === "COMPONENT",
  );
  const variantAxes = extractVariantAxes(childComponents);
  const accessibility = auditComponentAccessibility(
    componentSet,
    childComponents,
    variantAxes,
  );
  const boundVariableIds = collectBoundVariableIds(componentSet);
  const propertyDefinitionRead = safeComponentPropertyDefinitions(
    componentSet,
    null,
    "audit",
  );
  const propertyDefinitions = propertyDefinitionRead.definitions;
  const expectedVariantAxes = expectedVariantAxesForComponentSetName(
    componentSet.name,
  );
  const variantProperties = auditVariantProperties(
    propertyDefinitions,
    expectedVariantAxes,
  );
  const instanceSwapSlots = auditInstanceSwapSlots(
    componentSet,
    propertyDefinitions,
  );
  const textProperties = auditTextProperties(componentSet, propertyDefinitions);
  const focusVisibleProperty = auditFocusVisibleProperty(
    componentSet,
    propertyDefinitions,
  );
  const iconSlotIntegrity = auditGeneratedIconSlotIntegrity(componentSet);
  const tooltipTipIntegrity = auditTooltipTipIntegrity(
    componentSet,
    childComponents,
  );
  const compositionIntegrity = auditCompositionIntegrity(componentSet);
  const badgeContentIntegrity = auditBadgeContentIntegrity(
    componentSet,
    childComponents,
  );
  const boundVariableFields = auditBoundVariableFields(componentSet);
  const record = {
    id: componentSet.id,
    urlNodeId: nodeIdForUrl(componentSet.id),
    page: pageName,
    name: componentSet.name,
    description: componentSet.description || "",
    variantCount: childComponents.length,
    variantAxes,
    componentProperties: Object.keys(propertyDefinitions),
    variantProperties: variantProperties.properties,
    instanceSwapSlots,
    textProperties,
    focusVisibleProperty,
    iconSlotIntegrity,
    tooltipTipIntegrity,
    compositionIntegrity,
    badgeContentIntegrity,
    boundVariableCount: boundVariableIds.length,
    boundVariableFields,
    width: Math.round(componentSet.width),
    height: Math.round(componentSet.height),
    accessibility,
    contrast: auditComponentContrast(
      componentSet,
      childComponents,
      variableContext,
    ),
    warnings: [],
    advisories: [],
  };

  if (propertyDefinitionRead.error) {
    record.warnings.push(
      `Could not read component property definitions (${propertyDefinitionRead.error}). Run the component updater once to repair existing Figma property errors, then audit again.`,
    );
  }

  if (childComponents.length === 0) {
    record.warnings.push("Component set has no child components.");
  }

  if (record.boundVariableCount === 0) {
    record.warnings.push("No bound variables found in component set.");
  }

  if (
    shouldAuditLayoutBindings(record.name) &&
    boundVariableFields.layoutFieldCount === 0
  ) {
    record.warnings.push(
      "No bound layout, spacing, radius, or sizing variables found. Run the component updater to bind non-color tokens.",
    );
  }

  if (variantProperties.issueCount > 0) {
    record.warnings.push(
      `${variantProperties.issueCount} stale or unexpected variant property definition(s) found. Run the component updater to normalize the instance property panel.`,
    );
    record.variantPropertyIssues = variantProperties.issues;
  }

  if (
    shouldAuditTypographyBindings(record.name) &&
    boundVariableFields.textNodesWithoutTextStyle > 0 &&
    boundVariableFields.typographyFieldCount === 0
  ) {
    record.warnings.push(
      `${boundVariableFields.textNodesWithoutTextStyle} label text node(s) are missing typography token bindings.`,
    );
  }

  if (shouldAuditFocusBindings(record.name)) {
    if (
      !focusVisibleProperty.propertyName ||
      focusVisibleProperty.boundNodes === 0
    ) {
      record.warnings.push(
        "Focus Visible boolean property is missing or not bound to generated focus ring layers.",
      );
    }

    if (focusVisibleProperty.geometryIssueCount > 0) {
      record.warnings.push(
        `${focusVisibleProperty.geometryIssueCount} focus ring geometry issue(s) found. Run the component updater to refresh absolute focus ring placement.`,
      );
    }
  }

  if (
    record.name === "Button / v1" ||
    record.name === "Label / v1" ||
    record.name === "Badge / v1" ||
    record.name === "Checkbox / v1" ||
    record.name === "Radio / v1" ||
    record.name === "Switch / v1" ||
    record.name === "Input / v1" ||
    record.name === "Textarea / v1" ||
    record.name === "Search / v1" ||
    record.name === "Slider / v1"
  ) {
    const labelTextProperty = Object.values(textProperties).find(
      (property) => property.baseName === "Label Text",
    );
    if (!labelTextProperty || labelTextProperty.boundTextNodes === 0) {
      record.warnings.push(
        "Label Text component property is missing or not bound to label text nodes; Code Connect children mapping will not be editable from Figma.",
      );
    }

    if (
      record.name === "Input / v1" ||
      record.name === "Textarea / v1" ||
      record.name === "Search / v1" ||
      record.name === "Select / v1"
    ) {
      const placeholderTextProperty = Object.values(textProperties).find(
        (property) => property.baseName === "Placeholder Text",
      );
      if (
        !placeholderTextProperty ||
        placeholderTextProperty.boundTextNodes === 0
      ) {
        record.warnings.push(
          "Placeholder Text component property is missing or not bound to placeholder text nodes; Code Connect placeholder mapping will not be editable from Figma.",
        );
      }

      if (record.name === "Input / v1") {
        const helperTextProperty = Object.values(textProperties).find(
          (property) => property.baseName === "Helper Text",
        );
        if (!helperTextProperty || helperTextProperty.boundTextNodes === 0) {
          record.warnings.push(
            "Helper Text component property is missing or not bound to helper text nodes; validation and hint copy will not be editable from Figma.",
          );
        }
      }
    }
  }

  if (record.name === "Counter / v1") {
    const counterTextProperty = Object.values(textProperties).find(
      (property) => property.baseName === "Counter Text",
    );
    if (!counterTextProperty || counterTextProperty.boundTextNodes === 0) {
      record.warnings.push(
        "Counter Text component property is missing or not bound to generated Counter text nodes.",
      );
    }
  }

  if (record.name === "Badge / v1") {
    const hasShowCounterProperty = Object.keys(propertyDefinitions).some(
      (propertyName) => {
        const definition = propertyDefinitions[propertyName];
        return (
          propertyName.split("#")[0] === "Show Counter" &&
          definition.type === "BOOLEAN"
        );
      },
    );
    if (!hasShowCounterProperty) {
      record.warnings.push(
        "Show Counter boolean property is missing; Badge counters should be hidden by default and opt-in per instance.",
      );
    }

    const iconSlot = Object.values(instanceSwapSlots).find(
      (property) => property.baseName === "Icon",
    );
    if (!iconSlot || iconSlot.boundInstances === 0) {
      record.warnings.push(
        "Icon instance-swap property is missing or not bound to Badge icon-size variants.",
      );
    }

    if (badgeContentIntegrity.issueCount > 0) {
      record.warnings.push(
        `${badgeContentIntegrity.issueCount} Badge content integrity issue(s) found. Run the Badge updater so icon-size variants use Icon slots and label variants keep hidden counter capsules.`,
      );
    }
  }

  if (record.name === "Card / v1") {
    for (const baseName of ["Title Text", "Description Text", "Body Text"]) {
      const textProperty = Object.values(textProperties).find(
        (property) => property.baseName === baseName,
      );
      if (!textProperty || textProperty.boundTextNodes === 0) {
        record.warnings.push(
          `${baseName} component property is missing or not bound to generated Card text nodes.`,
        );
      }
    }
  }

  if (record.name === "Box / v1") {
    const textProperty = Object.values(textProperties).find(
      (property) => property.baseName === "Box Text",
    );
    if (!textProperty || textProperty.boundTextNodes === 0) {
      record.warnings.push(
        "Box Text component property is missing or not bound to generated Box text nodes.",
      );
    }
  }

  if (record.name === "Container / v1") {
    const textProperty = Object.values(textProperties).find(
      (property) => property.baseName === "Container Text",
    );
    if (!textProperty || textProperty.boundTextNodes === 0) {
      record.warnings.push(
        "Container Text component property is missing or not bound to generated Container text nodes.",
      );
    }
  }

  if (compositionIntegrity.issueCount > 0) {
    record.warnings.push(
      `${compositionIntegrity.issueCount} composite component integrity issue(s) found. Composite components must use live nested instances with valid auto-layout sizing.`,
    );
  }

  if (record.name === "Tabs / v1") {
    for (const baseName of [
      "Tab 1 Text",
      "Tab 2 Text",
      "Tab 3 Text",
      "Tab 4 Text",
    ]) {
      const textProperty = Object.values(textProperties).find(
        (property) => property.baseName === baseName,
      );
      if (!textProperty || textProperty.boundTextNodes === 0) {
        record.warnings.push(
          `${baseName} component property is missing or not bound to generated Tabs trigger text nodes.`,
        );
      }
    }
  }

  if (record.name === "Tooltip / v1") {
    const textProperty = Object.values(textProperties).find(
      (property) => property.baseName === "Content Text",
    );
    if (!textProperty || textProperty.boundTextNodes === 0) {
      record.warnings.push(
        "Content Text component property is missing or not bound to generated Tooltip text nodes.",
      );
    }

    if (tooltipTipIntegrity.tipNodes !== childComponents.length) {
      record.warnings.push(
        `Expected one generated Tooltip tip per side variant, found ${tooltipTipIntegrity.tipNodes}/${childComponents.length}. Run the Tooltip updater to refresh side indicators.`,
      );
    }
    if (tooltipTipIntegrity.triangleTipNodes !== childComponents.length) {
      record.warnings.push(
        `Expected every Tooltip tip to be a generated triangle, found ${tooltipTipIntegrity.triangleTipNodes}/${childComponents.length}. Run the Tooltip updater to refresh side indicators.`,
      );
    }
  }

  if (accessibility.hasStateAxis && !accessibility.hasDisabledState) {
    record.warnings.push("State axis exists but Disabled state is missing.");
  }

  if (shouldAuditFocusBindings(record.name) && !accessibility.hasFocusState) {
    record.warnings.push("Focus state or focus documentation is missing.");
  }

  if (
    shouldAuditTouchTarget(record.name) &&
    !accessibility.minimumTouchTargetPass
  ) {
    if (accessibility.compactVisualSize) {
      record.advisories.push(
        `Compact visual size is ${accessibility.minimumInteractiveSize}px. Keep for desktop-dense controls only; use a 44px hit area or larger visual size for touch contexts.`,
      );
    } else {
      record.warnings.push(
        `Minimum touch target is ${accessibility.minimumInteractiveSize}px; touch guidance prefers at least 44px.`,
      );
    }
  }

  if (record.contrast.textFailures > 0) {
    record.warnings.push(
      `${record.contrast.textFailures} text contrast pair(s) fail WCAG AA 4.5:1.`,
    );
  }

  if (record.contrast.nonTextFailures > 0) {
    record.warnings.push(
      `${record.contrast.nonTextFailures} icon/control contrast pair(s) fail the 3:1 non-text guidance.`,
    );
  }

  if (iconSlotIntegrity.maskWrappedSlots > 0) {
    record.warnings.push(
      `${iconSlotIntegrity.maskWrappedSlots} generated Icon slot(s) still use the legacy mask wrapper. Run the component updater to migrate them to direct instance-swap slots.`,
    );
  }

  if (iconSlotIntegrity.colorOverrideIssues > 0) {
    record.warnings.push(
      `${iconSlotIntegrity.colorOverrideIssues} generated Icon slot(s) do not expose tintable fill or stroke layers for direct color overrides.`,
    );
  }

  if (iconSlotIntegrity.unknownSlotIssues > 0) {
    record.warnings.push(
      `${iconSlotIntegrity.unknownSlotIssues} generated Icon slot(s) have an unexpected node structure.`,
    );
  }

  if (record.contrast.surfaceDependent) {
    record.advisories.push(
      "Transparent variants depend on the host surface. Test them on Surface/0 in each mode and on any product surfaces where they will be used.",
    );
  }

  return record;
}

function shouldAuditLayoutBindings(name) {
  return (
    [
      "Text / v1",
      "Heading / v1",
      "Link / v1",
      "Label / v1",
      "Separator / v1",
      "Skeleton / v1",
      "Box / v1",
      "Stack / v1",
      "Container / v1",
      "Button / v1",
      "IconButton / v1",
      "Counter / v1",
      "Badge / v1",
      "Card / v1",
      "Tabs / v1",
      "Tooltip / v1",
      "Checkbox / v1",
      "Radio / v1",
      "Switch / v1",
      "Input / v1",
      "Textarea / v1",
      "Search / v1",
      "Select / v1",
      "Slider / v1",
      "Progress / v1",
      "Spinner / v1",
      "Avatar / v1",
      "Alert / v1",
    ].indexOf(name) !== -1
  );
}

function shouldAuditTypographyBindings(name) {
  return (
    [
      "Text / v1",
      "Heading / v1",
      "Link / v1",
      "Label / v1",
      "Box / v1",
      "Container / v1",
      "Button / v1",
      "Counter / v1",
      "Badge / v1",
      "Card / v1",
      "Tabs / v1",
      "Tooltip / v1",
      "Checkbox / v1",
      "Radio / v1",
      "Switch / v1",
      "Input / v1",
      "Textarea / v1",
      "Search / v1",
      "Select / v1",
      "Slider / v1",
      "Avatar / v1",
      "Alert / v1",
    ].indexOf(name) !== -1
  );
}

function shouldAuditFocusBindings(name) {
  return (
    [
      "Button / v1",
      "IconButton / v1",
      "Checkbox / v1",
      "Radio / v1",
      "Switch / v1",
      "Tabs / v1",
      "Input / v1",
      "Textarea / v1",
      "Search / v1",
      "Select / v1",
      "Slider / v1",
    ].indexOf(name) !== -1
  );
}

function shouldAuditTouchTarget(name) {
  return (
    [
      "Button / v1",
      "IconButton / v1",
      "Badge / v1",
      "Tabs / v1",
      "Checkbox / v1",
      "Radio / v1",
      "Switch / v1",
      "Input / v1",
      "Textarea / v1",
      "Search / v1",
      "Select / v1",
      "Slider / v1",
    ].indexOf(name) !== -1
  );
}

function extractVariantAxes(childComponents) {
  const axes = {};
  for (const component of childComponents) {
    const parts = component.name.split(",");
    for (const part of parts) {
      const index = part.indexOf("=");
      if (index === -1) continue;
      const axis = part.slice(0, index).trim();
      const value = part.slice(index + 1).trim();
      if (!axes[axis]) axes[axis] = [];
      if (axes[axis].indexOf(value) === -1) axes[axis].push(value);
    }
  }

  for (const key of Object.keys(axes)) {
    axes[key].sort();
  }

  return axes;
}

function expectedVariantAxesForComponentSetName(name) {
  if (name === "Text / v1") {
    return {
      Size: TEXT_SIZES,
      Weight: TEXT_WEIGHTS,
      Tone: TEXT_TONES,
    };
  }

  if (name === "Heading / v1") {
    return {
      Level: HEADING_LEVELS,
    };
  }

  if (name === "Link / v1") {
    return {
      Variant: LINK_VARIANTS,
      State: LINK_STATES,
    };
  }

  if (name === "Label / v1") {
    return {
      State: LABEL_STATES,
    };
  }

  if (name === "Separator / v1") {
    return {
      Orientation: SEPARATOR_ORIENTATIONS,
    };
  }

  if (name === "Skeleton / v1") {
    return {
      Shape: SKELETON_SHAPES,
    };
  }

  if (name === "Box / v1") {
    return {
      Surface: BOX_SURFACES,
    };
  }

  if (name === "Stack / v1") {
    return {
      Direction: STACK_DIRECTIONS,
      Gap: STACK_GAPS,
    };
  }

  if (name === "Container / v1") {
    return {
      Centered: CONTAINER_CENTERED,
    };
  }

  if (name === "Button / v1") {
    return {
      Variant: BUTTON_VARIANTS,
      Size: BUTTON_SIZES,
      State: BUTTON_STATES,
    };
  }

  if (name === "IconButton / v1") {
    return {
      Variant: BUTTON_VARIANTS,
      Size: ICON_BUTTON_SIZES,
      State: BUTTON_STATES,
    };
  }

  if (name === "Counter / v1") {
    return {
      Tone: COUNTER_TONES,
      Size: COUNTER_SIZES,
    };
  }

  if (name === "Badge / v1") {
    return {
      Variant: BADGE_VARIANTS,
      Size: BADGE_SIZES,
    };
  }

  if (name === "Card / v1") {
    return {
      Content: CARD_CONTENT,
    };
  }

  if (name === "Tabs / v1") {
    return {
      Count: TABS_COUNTS,
      Active: TABS_ACTIVE,
      State: TABS_STATES,
    };
  }

  if (name === "Tooltip / v1") {
    return {
      Side: TOOLTIP_SIDES,
    };
  }

  if (name === "Dialog / v1") {
    return {
      Content: DIALOG_CONTENT,
    };
  }

  if (name === "Popover / v1") {
    return {
      Side: POPOVER_SIDES,
    };
  }

  if (name === "Menu / v1") {
    return {
      Content: MENU_CONTENT,
    };
  }

  if (name === "Toast / v1") {
    return {
      Content: TOAST_CONTENT,
    };
  }

  if (name === "Checkbox / v1") {
    return {
      Checked: CHECKBOX_CHECKED,
      State: CHECKBOX_STATES,
    };
  }

  if (name === "Radio / v1") {
    return {
      Checked: RADIO_CHECKED,
      State: RADIO_STATES,
    };
  }

  if (name === "Switch / v1") {
    return {
      Checked: SWITCH_CHECKED,
      State: SWITCH_STATES,
    };
  }

  if (name === "Input / v1") {
    return {
      State: INPUT_STATES,
      Status: INPUT_STATUSES,
    };
  }

  if (name === "Textarea / v1") {
    return {
      State: TEXTAREA_STATES,
      Status: TEXTAREA_STATUSES,
    };
  }

  if (name === "Search / v1") {
    return {
      State: SEARCH_STATES,
      Status: SEARCH_STATUSES,
    };
  }

  if (name === "Select / v1") {
    return {
      State: SELECT_STATES,
      Status: SELECT_STATUSES,
    };
  }

  if (name === "Slider / v1") {
    return {
      State: SLIDER_STATES,
      Status: SLIDER_STATUSES,
    };
  }

  if (name === "Progress / v1") {
    return {
      Value: PROGRESS_VALUES,
    };
  }

  if (name === "Spinner / v1") {
    return {
      Size: SPINNER_SIZES,
    };
  }

  if (name === "Avatar / v1") {
    return {
      Content: AVATAR_CONTENT,
    };
  }

  if (name === "Alert / v1") {
    return {
      Variant: ALERT_VARIANTS,
    };
  }

  return null;
}

function auditVariantProperties(propertyDefinitions, expectedAxes) {
  const properties = {};
  const issues = [];
  const expectedNames = expectedAxes ? Object.keys(expectedAxes) : [];

  for (const propertyName of Object.keys(propertyDefinitions)) {
    const definition = propertyDefinitions[propertyName];
    if (definition.type !== "VARIANT") continue;

    const baseName = propertyName.split("#")[0];
    const options = Array.isArray(definition.variantOptions)
      ? definition.variantOptions.slice()
      : [];
    const propertyIssues = [];

    if (expectedAxes && !expectedAxes[baseName]) {
      propertyIssues.push("unexpected-axis");
      issues.push({
        propertyName,
        baseName,
        kind: "unexpected-axis",
        expectedAxes: expectedNames,
      });
    } else if (expectedAxes && expectedAxes[baseName] && options.length > 0) {
      const expectedOptions = expectedAxes[baseName];
      const missing = expectedOptions.filter(
        (option) => options.indexOf(option) === -1,
      );
      const unexpected = options.filter(
        (option) => expectedOptions.indexOf(option) === -1,
      );

      if (missing.length > 0 || unexpected.length > 0) {
        propertyIssues.push("option-mismatch");
        issues.push({
          propertyName,
          baseName,
          kind: "option-mismatch",
          missing,
          unexpected,
        });
      }
    }

    properties[propertyName] = {
      baseName,
      options,
      defaultValue:
        typeof definition.defaultValue === "string"
          ? definition.defaultValue
          : null,
      issues: propertyIssues,
    };
  }

  if (expectedAxes) {
    for (const expectedName of expectedNames) {
      const exists = Object.keys(properties).some(
        (propertyName) => properties[propertyName].baseName === expectedName,
      );
      if (!exists) {
        issues.push({
          propertyName: null,
          baseName: expectedName,
          kind: "missing-axis",
        });
      }
    }
  }

  return {
    properties,
    issueCount: issues.length,
    issues,
  };
}

function auditInstanceSwapSlots(componentSet, propertyDefinitions) {
  const slots = {};

  for (const propertyName of Object.keys(propertyDefinitions)) {
    const definition = propertyDefinitions[propertyName];
    if (definition.type !== "INSTANCE_SWAP") continue;

    slots[propertyName] = {
      baseName: propertyName.split("#")[0],
      boundInstances: 0,
      preferredValues: Array.isArray(definition.preferredValues)
        ? definition.preferredValues.length
        : 0,
    };
  }

  function walk(node) {
    if (isGeneratedNestedComponentInstance(node)) return;

    if (
      node.type === "INSTANCE" &&
      node.componentPropertyReferences &&
      node.componentPropertyReferences.mainComponent
    ) {
      const propertyName = node.componentPropertyReferences.mainComponent;
      if (slots[propertyName]) {
        slots[propertyName].boundInstances += 1;
      }
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  return slots;
}

function auditTextProperties(componentSet, propertyDefinitions) {
  const properties = {};

  for (const propertyName of Object.keys(propertyDefinitions)) {
    const definition = propertyDefinitions[propertyName];
    if (definition.type !== "TEXT") continue;

    properties[propertyName] = {
      baseName: propertyName.split("#")[0],
      boundTextNodes: 0,
    };
  }

  function walk(node) {
    if (isGeneratedNestedComponentInstance(node)) return;

    if (
      node.type === "TEXT" &&
      node.componentPropertyReferences &&
      node.componentPropertyReferences.characters
    ) {
      const propertyName = node.componentPropertyReferences.characters;
      if (properties[propertyName]) {
        properties[propertyName].boundTextNodes += 1;
      }
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  return properties;
}

function auditFocusVisibleProperty(componentSet, propertyDefinitions) {
  const result = {
    propertyName: null,
    defaultValue: null,
    boundNodes: 0,
    ringNodes: 0,
    geometryIssueCount: 0,
    geometryIssues: [],
  };

  for (const propertyName of Object.keys(propertyDefinitions)) {
    const definition = propertyDefinitions[propertyName];
    const baseName = propertyName.split("#")[0];
    if (
      baseName === FOCUS_VISIBLE_PROPERTY_NAME &&
      definition.type === "BOOLEAN"
    ) {
      result.propertyName = propertyName;
      result.defaultValue =
        typeof definition.defaultValue === "boolean"
          ? definition.defaultValue
          : null;
      break;
    }
  }

  function walk(node, parent) {
    if (isGeneratedNestedComponentInstance(node)) return;

    if (
      result.propertyName &&
      node.name === "Focus Ring" &&
      node.componentPropertyReferences &&
      node.componentPropertyReferences.visible === result.propertyName
    ) {
      result.boundNodes += 1;
    }

    if (
      node.name === "Focus Ring" &&
      node.getSharedPluginData(RUN_NAMESPACE, "kind") === "focus-ring"
    ) {
      result.ringNodes += 1;

      const issues = [];
      const parentUsesAutoLayout =
        parent &&
        parent.layoutMode !== undefined &&
        parent.layoutMode !== "NONE";

      if (parentUsesAutoLayout && node.layoutPositioning !== "ABSOLUTE") {
        issues.push("not absolute");
      }

      if (parent) {
        const expectedOffset = -4;
        const expectedWidth = parent.width + 8;
        const expectedHeight = parent.height + 8;
        const tolerance = 0.5;

        if (Math.abs(node.x - expectedOffset) > tolerance) {
          issues.push(`x=${Math.round(node.x)} expected ${expectedOffset}`);
        }
        if (Math.abs(node.y - expectedOffset) > tolerance) {
          issues.push(`y=${Math.round(node.y)} expected ${expectedOffset}`);
        }
        if (Math.abs(node.width - expectedWidth) > tolerance) {
          issues.push(
            `width=${Math.round(node.width)} expected ${Math.round(expectedWidth)}`,
          );
        }
        if (Math.abs(node.height - expectedHeight) > tolerance) {
          issues.push(
            `height=${Math.round(node.height)} expected ${Math.round(expectedHeight)}`,
          );
        }
      }

      if (issues.length > 0) {
        result.geometryIssues.push({
          node: node.name,
          parent: parent ? parent.name : null,
          issues,
        });
      }
    }

    if (node.children) {
      for (const child of node.children) walk(child, node);
    }
  }

  walk(componentSet, null);
  result.geometryIssueCount = result.geometryIssues.length;
  return result;
}

function auditGeneratedIconSlotIntegrity(componentSet) {
  const result = {
    generatedSlots: 0,
    directInstanceSlots: 0,
    maskWrappedSlots: 0,
    colorOverrideIssues: 0,
    unknownSlotIssues: 0,
  };

  function walk(node) {
    if (isGeneratedNestedComponentInstance(node)) return;

    if (
      node &&
      node.name === "Icon" &&
      node.getSharedPluginData &&
      node.getSharedPluginData(RUN_NAMESPACE, "kind") === "icon-slot-instance"
    ) {
      result.generatedSlots += 1;

      if (node.type === "INSTANCE") {
        result.directInstanceSlots += 1;
        if (!hasTintableIconPaint(node)) {
          result.colorOverrideIssues += 1;
        }
      } else if (node.type === "FRAME") {
        result.maskWrappedSlots += 1;
      } else {
        result.unknownSlotIssues += 1;
      }
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  return result;
}

function auditTooltipTipIntegrity(componentSet, childComponents) {
  const result = {
    expectedTipNodes:
      componentSet.name === "Tooltip / v1" ? childComponents.length : 0,
    tipNodes: 0,
    absoluteTipNodes: 0,
    triangleTipNodes: 0,
  };

  if (componentSet.name !== "Tooltip / v1") {
    return result;
  }

  function walk(node) {
    if (isGeneratedNestedComponentInstance(node)) return;

    if (
      node &&
      node.name === "Tip" &&
      node.getSharedPluginData &&
      node.getSharedPluginData(RUN_NAMESPACE, "kind") === "tooltip-tip"
    ) {
      result.tipNodes += 1;
      if (node.layoutPositioning === "ABSOLUTE") {
        result.absoluteTipNodes += 1;
      }
      if (node.getSharedPluginData(RUN_NAMESPACE, "shape") === "triangle") {
        result.triangleTipNodes += 1;
      }
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  return result;
}

function auditCompositionIntegrity(componentSet) {
  const issues = [];

  if (componentSet.name === "Card / v1") {
    auditExpectedNestedInstance(
      componentSet,
      issues,
      "Secondary Action",
      "Button / v1",
    );
    auditExpectedNestedInstance(
      componentSet,
      issues,
      "Primary Action",
      "Button / v1",
    );
  }

  if (componentSet.name === "Dialog / v1") {
    auditExpectedNestedInstance(
      componentSet,
      issues,
      "Secondary Action",
      "Button / v1",
    );
    auditExpectedNestedInstance(
      componentSet,
      issues,
      "Primary Action",
      "Button / v1",
    );
    auditExpectedNestedInstance(
      componentSet,
      issues,
      "Name Input",
      "Input / v1",
    );
    auditExpectedNestedInstance(
      componentSet,
      issues,
      "Username Input",
      "Input / v1",
    );
    auditLegacyFrameClone(componentSet, issues, "Name Field", "Input / v1");
    auditLegacyFrameClone(componentSet, issues, "Username Field", "Input / v1");
    auditDialogAutoLayoutIntegrity(componentSet, issues);
  }

  return {
    issueCount: issues.length,
    issues,
  };
}

function counterTextNodeFor(counter) {
  if (!counter || !counter.children) return null;
  return directChildNamed(counter, "Counter Text");
}

function instanceHasComponentProperty(instance, baseName, type) {
  if (!instance || !instance.componentProperties) return false;

  for (const propertyName of Object.keys(instance.componentProperties)) {
    const property = instance.componentProperties[propertyName];
    if (propertyName.split("#")[0] !== baseName) continue;
    if (type && property.type !== type) continue;
    return true;
  }

  return false;
}

function auditBadgeContentIntegrity(componentSet, childComponents) {
  const issues = [];

  if (componentSet.name !== "Badge / v1") {
    return {
      issueCount: 0,
      issues,
    };
  }

  function pushIssue(component, kind, node, expected) {
    issues.push({
      kind,
      variant: component.name,
      node: node ? node.name : null,
      nodeType: node ? node.type : null,
      nodeId: node ? node.id : component.id,
      urlNodeId: node ? nodeIdForUrl(node.id) : nodeIdForUrl(component.id),
      expected,
    });
  }

  for (const component of childComponents) {
    const props = parseBadgeVariantName(component.name);
    if (!props) continue;

    const icon = directChildNamed(component, "Icon");
    const label = directChildNamed(component, "Label Text");
    const legacyCounterText = directChildNamed(component, "Counter Text");
    const counter = directChildNamed(component, "Counter");
    const counterText = counterTextNodeFor(counter);

    if (props.size === "Icon") {
      if (label) {
        pushIssue(
          component,
          "badge-icon-size-label-text",
          label,
          "Icon-size Badge variants should not include Label Text.",
        );
      }

      if (counter) {
        pushIssue(
          component,
          "badge-icon-size-counter",
          counter,
          "Icon-size Badge variants should not include Counter.",
        );
      }

      if (legacyCounterText) {
        pushIssue(
          component,
          "badge-icon-size-legacy-counter-text",
          legacyCounterText,
          "Icon-size Badge variants should not include legacy direct Counter Text.",
        );
      }

      if (
        !icon ||
        icon.type !== "INSTANCE" ||
        !icon.getSharedPluginData ||
        icon.getSharedPluginData(RUN_NAMESPACE, "kind") !== "icon-slot-instance"
      ) {
        pushIssue(
          component,
          "badge-icon-size-icon-slot",
          icon,
          "Icon-size Badge variants should include a direct generated Icon instance-swap slot.",
        );
      }

      continue;
    }

    if (legacyCounterText) {
      pushIssue(
        component,
        "badge-legacy-counter-text",
        legacyCounterText,
        "Non-icon Badge variants should expose count text through nested Counter / v1.",
      );
    }

    if (!label || label.type !== "TEXT") {
      pushIssue(
        component,
        "badge-label-text-missing",
        label,
        "Non-icon Badge variants should include editable Label Text.",
      );
    }

    if (!counter || !isNestedComponentInstance(counter, "Counter / v1")) {
      pushIssue(
        component,
        "badge-counter-missing",
        counter,
        "Non-icon Badge variants should include a hidden nested Counter / v1 instance.",
      );
    } else if (counter.visible !== false) {
      pushIssue(
        component,
        "badge-counter-visible-by-default",
        counter,
        "Counter should be hidden by default and shown through Show Counter.",
      );
    } else if (counter.isExposedInstance !== true) {
      pushIssue(
        component,
        "badge-counter-not-exposed",
        counter,
        "Nested Counter should be exposed so its Counter Text property remains editable.",
      );
    }

    if (
      !counterText &&
      !instanceHasComponentProperty(counter, "Counter Text", "TEXT")
    ) {
      pushIssue(
        component,
        "badge-counter-text-missing",
        counterText,
        "Nested Counter should expose editable Counter Text.",
      );
    }

    if (icon) {
      pushIssue(
        component,
        "badge-label-size-icon-slot",
        icon,
        "Non-icon Badge variants should not include the icon-size Icon slot.",
      );
    }
  }

  return {
    issueCount: issues.length,
    issues,
  };
}

function auditDialogAutoLayoutIntegrity(componentSet, issues) {
  const components = componentSet.children || [];

  for (const component of components) {
    if (component.type !== "COMPONENT") continue;

    const props = parseDialogVariantName(component.name);
    if (!props) continue;

    if (props.value === "Form") {
      const body = directChildNamed(component, "Dialog Body");
      if (!body || body.type !== "FRAME") {
        issues.push({
          kind: "dialog-form-body-missing",
          variant: component.name,
          nodeId: component.id,
          urlNodeId: nodeIdForUrl(component.id),
        });
        continue;
      }

      if (body.layoutMode !== "VERTICAL") {
        issues.push({
          kind: "dialog-form-body-layout-mode",
          variant: component.name,
          node: body.name,
          nodeId: body.id,
          urlNodeId: nodeIdForUrl(body.id),
          expected: "VERTICAL",
          actual: body.layoutMode || null,
        });
      }

      if (body.primaryAxisSizingMode !== "AUTO") {
        issues.push({
          kind: "dialog-form-body-height-sizing",
          variant: component.name,
          node: body.name,
          nodeId: body.id,
          urlNodeId: nodeIdForUrl(body.id),
          expected: "AUTO",
          actual: body.primaryAxisSizingMode || null,
        });
      }

      for (const nodeName of ["Name Input", "Username Input"]) {
        const input = directChildNamed(body, nodeName);
        if (!input) {
          issues.push({
            kind: "dialog-form-input-missing",
            variant: component.name,
            node: nodeName,
            nodeId: body.id,
            urlNodeId: nodeIdForUrl(body.id),
          });
          continue;
        }

        auditAutoLayoutSizing({
          node: input,
          issues,
          kind: "dialog-form-input-horizontal-sizing",
          field: "layoutSizingHorizontal",
          expected: "FILL",
          actual: input.layoutSizingHorizontal,
          variant: component.name,
        });
        auditAutoLayoutSizing({
          node: input,
          issues,
          kind: "dialog-form-input-vertical-sizing",
          field: "layoutSizingVertical",
          expected: "HUG",
          actual: input.layoutSizingVertical,
          variant: component.name,
        });

        if (typeof input.layoutGrow === "number" && input.layoutGrow !== 0) {
          issues.push({
            kind: "dialog-form-input-primary-axis-fill",
            variant: component.name,
            node: input.name,
            nodeType: input.type,
            nodeId: input.id,
            urlNodeId: nodeIdForUrl(input.id),
            field: "layoutGrow",
            expected: 0,
            actual: input.layoutGrow,
          });
        }

        auditVisualOverflow(component.name, input, issues);
      }
    }

    if (props.value === "Form" || props.value === "Footer") {
      auditDialogFooterActionSizing(component, issues);
    }
  }
}

function auditDialogFooterActionSizing(component, issues) {
  const footer = directChildNamed(component, "Dialog Footer");
  if (!footer || footer.type !== "FRAME") {
    issues.push({
      kind: "dialog-footer-missing",
      variant: component.name,
      nodeId: component.id,
      urlNodeId: nodeIdForUrl(component.id),
    });
    return;
  }

  if (footer.layoutMode !== "HORIZONTAL") {
    issues.push({
      kind: "dialog-footer-layout-mode",
      variant: component.name,
      node: footer.name,
      nodeId: footer.id,
      urlNodeId: nodeIdForUrl(footer.id),
      expected: "HORIZONTAL",
      actual: footer.layoutMode || null,
    });
  }

  auditAutoLayoutSizing({
    node: footer,
    issues,
    kind: "dialog-footer-horizontal-sizing",
    field: "layoutSizingHorizontal",
    expected: "FILL",
    actual: footer.layoutSizingHorizontal,
    variant: component.name,
  });
  auditAutoLayoutSizing({
    node: footer,
    issues,
    kind: "dialog-footer-vertical-sizing",
    field: "layoutSizingVertical",
    expected: "FIXED",
    actual: footer.layoutSizingVertical,
    variant: component.name,
  });

  if (typeof footer.height === "number" && footer.height < 44) {
    issues.push({
      kind: "dialog-footer-min-height",
      variant: component.name,
      node: footer.name,
      nodeId: footer.id,
      urlNodeId: nodeIdForUrl(footer.id),
      expected: ">= 44",
      actual: footer.height,
    });
  }

  for (const nodeName of ["Secondary Action", "Primary Action"]) {
    const action = directChildNamed(footer, nodeName);
    if (!action) {
      issues.push({
        kind: "dialog-footer-action-missing",
        variant: component.name,
        node: nodeName,
        nodeId: footer.id,
        urlNodeId: nodeIdForUrl(footer.id),
      });
      continue;
    }

    auditAutoLayoutSizing({
      node: action,
      issues,
      kind: "dialog-footer-action-horizontal-sizing",
      field: "layoutSizingHorizontal",
      expected: "FIXED",
      actual: action.layoutSizingHorizontal,
      variant: component.name,
    });
    auditAutoLayoutSizing({
      node: action,
      issues,
      kind: "dialog-footer-action-vertical-sizing",
      field: "layoutSizingVertical",
      expected: "FIXED",
      actual: action.layoutSizingVertical,
      variant: component.name,
    });

    if (typeof action.layoutGrow === "number" && action.layoutGrow !== 0) {
      issues.push({
        kind: "dialog-footer-action-primary-axis-fill",
        variant: component.name,
        node: action.name,
        nodeType: action.type,
        nodeId: action.id,
        urlNodeId: nodeIdForUrl(action.id),
        field: "layoutGrow",
        expected: 0,
        actual: action.layoutGrow,
      });
    }

    const inheritsCentered =
      action.layoutAlign === "INHERIT" &&
      footer.counterAxisAlignItems === "CENTER";
    if (
      action.layoutAlign &&
      action.layoutAlign !== "CENTER" &&
      !inheritsCentered
    ) {
      issues.push({
        kind: "dialog-footer-action-cross-axis-align",
        variant: component.name,
        node: action.name,
        nodeType: action.type,
        nodeId: action.id,
        urlNodeId: nodeIdForUrl(action.id),
        field: "layoutAlign",
        expected: "CENTER",
        actual: action.layoutAlign,
      });
    }

    const expectedSize = nodeName === "Primary Action" ? "Large" : "Default";
    const metrics = buttonMetrics(expectedSize);
    const minWidth = expectedDialogFooterActionWidth(
      nodeName === "Primary Action" ? "Save changes" : "Cancel",
      expectedSize,
    );

    if (typeof action.width === "number" && action.width < minWidth) {
      issues.push({
        kind: "dialog-footer-action-min-width",
        variant: component.name,
        node: action.name,
        nodeType: action.type,
        nodeId: action.id,
        urlNodeId: nodeIdForUrl(action.id),
        expected: `>= ${minWidth}`,
        actual: action.width,
      });
    }

    if (typeof action.height === "number" && action.height < metrics.height) {
      issues.push({
        kind: "dialog-footer-action-min-height",
        variant: component.name,
        node: action.name,
        nodeType: action.type,
        nodeId: action.id,
        urlNodeId: nodeIdForUrl(action.id),
        expected: `>= ${metrics.height}`,
        actual: action.height,
      });
    }

    auditVisualOverflow(
      component.name,
      action,
      issues,
      "dialog-footer-action-visual-overflow",
    );
  }
}

function auditAutoLayoutSizing(options) {
  if (typeof options.actual === "undefined") return;
  if (options.actual === options.expected) return;

  issuesPushAutoLayoutSizing(options);
}

function issuesPushAutoLayoutSizing(options) {
  options.issues.push({
    kind: options.kind,
    variant: options.variant,
    node: options.node.name,
    nodeType: options.node.type,
    nodeId: options.node.id,
    urlNodeId: nodeIdForUrl(options.node.id),
    field: options.field,
    expected: options.expected,
    actual: options.actual || null,
  });
}

function auditVisualOverflow(
  variant,
  node,
  issues,
  kind = "dialog-form-input-visual-overflow",
) {
  const ownBounds = node.absoluteBoundingBox;
  if (!ownBounds || !node.children) return;

  let childBounds = null;

  function mergeBounds(bounds) {
    if (!bounds) return;
    const next = {
      x1: bounds.x,
      y1: bounds.y,
      x2: bounds.x + bounds.width,
      y2: bounds.y + bounds.height,
    };

    if (!childBounds) {
      childBounds = next;
      return;
    }

    childBounds.x1 = Math.min(childBounds.x1, next.x1);
    childBounds.y1 = Math.min(childBounds.y1, next.y1);
    childBounds.x2 = Math.max(childBounds.x2, next.x2);
    childBounds.y2 = Math.max(childBounds.y2, next.y2);
  }

  function walk(current) {
    if (current.visible === false) return;
    mergeBounds(current.absoluteBoundingBox);

    if (current.children) {
      for (const child of current.children) walk(child);
    }
  }

  for (const child of node.children) walk(child);
  if (!childBounds) return;

  const tolerance = 1;
  const ownBottom = ownBounds.y + ownBounds.height;
  if (childBounds.y2 <= ownBottom + tolerance) return;

  issues.push({
    kind,
    variant,
    node: node.name,
    nodeType: node.type,
    nodeId: node.id,
    urlNodeId: nodeIdForUrl(node.id),
    expectedMaxBottom: Math.round(ownBottom),
    actualContentBottom: Math.round(childBounds.y2),
  });
}

function auditExpectedNestedInstance(
  componentSet,
  issues,
  nodeName,
  sourceComponentSet,
) {
  const nodes = componentSet.findAll((node) => node.name === nodeName);
  for (const node of nodes) {
    if (isNestedComponentInstance(node, sourceComponentSet)) {
      continue;
    }

    issues.push({
      kind: "cloned-subcomponent-frame",
      node: node.name,
      nodeType: node.type,
      nodeId: node.id,
      urlNodeId: nodeIdForUrl(node.id),
      expectedSource: sourceComponentSet,
    });
  }
}

function auditLegacyFrameClone(
  componentSet,
  issues,
  nodeName,
  sourceComponentSet,
) {
  const nodes = componentSet.findAll(
    (node) => node.name === nodeName && node.type !== "INSTANCE",
  );
  for (const node of nodes) {
    issues.push({
      kind: "legacy-composition-frame",
      node: node.name,
      nodeType: node.type,
      nodeId: node.id,
      urlNodeId: nodeIdForUrl(node.id),
      expectedSource: sourceComponentSet,
    });
  }
}

function hasTintableIconPaint(node) {
  if (!node) return false;
  if (
    firstVisibleSolidPaint(node.fills) ||
    firstVisibleSolidPaint(node.strokes)
  ) {
    return true;
  }

  if (node.children) {
    for (const child of node.children) {
      if (hasTintableIconPaint(child)) return true;
    }
  }

  return false;
}

function auditComponentAccessibility(
  componentSet,
  childComponents,
  variantAxes,
) {
  let minWidth = Infinity;
  let minHeight = Infinity;
  let minimumInteractiveSize = Infinity;
  const stateValues = variantAxes.State || [];
  const hasStateAxis = stateValues.length > 0;
  const hasDisabledState = stateValues.indexOf("Disabled") !== -1;
  const hasLoadingState = stateValues.indexOf("Loading") !== -1;
  const hasFocusState =
    stateValues.indexOf("Focus") !== -1 ||
    stateValues.indexOf("Focused") !== -1 ||
    hasOwnedFocusNode(componentSet);

  for (const component of childComponents) {
    minWidth = Math.min(minWidth, component.width);
    minHeight = Math.min(minHeight, component.height);
    minimumInteractiveSize = Math.min(
      minimumInteractiveSize,
      Math.min(component.width, component.height),
    );
  }

  if (childComponents.length === 0) {
    minWidth = 0;
    minHeight = 0;
    minimumInteractiveSize = 0;
  }

  return {
    hasStateAxis,
    hasDisabledState,
    hasLoadingState,
    hasFocusState,
    minWidth: Math.round(minWidth),
    minHeight: Math.round(minHeight),
    minimumInteractiveSize: Math.round(minimumInteractiveSize),
    compactVisualSize:
      minimumInteractiveSize >= 36 && minimumInteractiveSize < 44,
    recommendedTouchTarget: 44,
    minimumTouchTargetPass: minimumInteractiveSize >= 44,
  };
}

function hasOwnedFocusNode(node) {
  if (!node) return false;
  if (isGeneratedNestedComponentInstance(node)) return false;
  if (/focus/i.test(node.name)) return true;

  if (node.children) {
    for (const child of node.children) {
      if (hasOwnedFocusNode(child)) return true;
    }
  }

  return false;
}

function auditComponentContrast(
  componentSet,
  childComponents,
  variableContext,
) {
  const result = createContrastAuditResult();
  const modeNames = contrastModeNames(variableContext);

  for (const modeName of modeNames) {
    const modeResult = auditComponentContrastForMode(
      componentSet,
      childComponents,
      variableContext,
      modeName,
    );
    mergeContrastModeResult(result, modeResult);
  }

  if (result.minTextContrast !== null) {
    result.minTextContrast = Math.round(result.minTextContrast * 100) / 100;
  }

  if (result.minNonTextContrast !== null) {
    result.minNonTextContrast =
      Math.round(result.minNonTextContrast * 100) / 100;
  }

  return result;
}

function createContrastAuditResult() {
  return {
    textPairs: 0,
    textFailures: 0,
    nonTextPairs: 0,
    nonTextFailures: 0,
    minTextContrast: null,
    minNonTextContrast: null,
    surfaceDependent: false,
    modesAudited: [],
    byMode: [],
    failures: [],
  };
}

function contrastModeNames(variableContext) {
  const modeNames =
    variableContext && Array.isArray(variableContext.modeNames)
      ? variableContext.modeNames
      : [];

  const preferred = ["Light", "Dark"].filter(
    (modeName) => modeNames.indexOf(modeName) !== -1,
  );

  if (preferred.length > 0) return preferred;
  return modeNames.length > 0 ? modeNames : ["Default"];
}

function mergeContrastModeResult(result, modeResult) {
  result.modesAudited.push(modeResult.mode);
  result.byMode.push({
    mode: modeResult.mode,
    textPairs: modeResult.textPairs,
    textFailures: modeResult.textFailures,
    nonTextPairs: modeResult.nonTextPairs,
    nonTextFailures: modeResult.nonTextFailures,
    minTextContrast:
      modeResult.minTextContrast === null
        ? null
        : Math.round(modeResult.minTextContrast * 100) / 100,
    minNonTextContrast:
      modeResult.minNonTextContrast === null
        ? null
        : Math.round(modeResult.minNonTextContrast * 100) / 100,
    surfaceDependent: modeResult.surfaceDependent,
  });

  result.textPairs = Math.max(result.textPairs, modeResult.textPairs);
  result.nonTextPairs = Math.max(result.nonTextPairs, modeResult.nonTextPairs);
  result.textFailures += modeResult.textFailures;
  result.nonTextFailures += modeResult.nonTextFailures;
  result.surfaceDependent =
    result.surfaceDependent || modeResult.surfaceDependent;

  if (modeResult.minTextContrast !== null) {
    result.minTextContrast =
      result.minTextContrast === null
        ? modeResult.minTextContrast
        : Math.min(result.minTextContrast, modeResult.minTextContrast);
  }

  if (modeResult.minNonTextContrast !== null) {
    result.minNonTextContrast =
      result.minNonTextContrast === null
        ? modeResult.minNonTextContrast
        : Math.min(result.minNonTextContrast, modeResult.minNonTextContrast);
  }

  for (const failure of modeResult.failures) {
    if (result.failures.length >= 12) break;
    result.failures.push(failure);
  }
}

function auditComponentContrastForMode(
  componentSet,
  childComponents,
  variableContext,
  modeName,
) {
  const fallbackSurface = colorForVariableName(
    "Surface/0",
    "#FFFFFF",
    variableContext,
    modeName,
  ) || { r: 1, g: 1, b: 1, a: 1 };
  const result = createContrastAuditResult();
  result.mode = modeName;

  for (const component of childComponents) {
    const props =
      parseTextVariantName(component.name) ||
      parseHeadingVariantName(component.name) ||
      parseLinkVariantName(component.name) ||
      parseLabelVariantName(component.name) ||
      parseBoxVariantName(component.name) ||
      parseButtonVariantName(component.name) ||
      parseIconButtonVariantName(component.name) ||
      parseCounterVariantName(component.name) ||
      parseBadgeVariantName(component.name) ||
      parseCardVariantName(component.name) ||
      parseTabsVariantName(component.name) ||
      parseCheckboxVariantName(component.name) ||
      parseRadioVariantName(component.name) ||
      parseSwitchVariantName(component.name) ||
      parseInputVariantName(component.name) ||
      parseTextareaVariantName(component.name) ||
      parseSearchVariantName(component.name) ||
      parseSelectVariantName(component.name) ||
      parseSliderVariantName(component.name) ||
      parseProgressVariantName(component.name) ||
      parseSpinnerVariantName(component.name) ||
      parseAvatarVariantName(component.name) ||
      parseAlertVariantName(component.name) ||
      {};
    if (props.variant === "Glass") {
      result.surfaceDependent = true;
      continue;
    }

    const isDisabled = props.state === "Disabled";
    const bgPaint = solidPaintToRgba(
      firstVisibleSolidPaint(component.fills),
      variableContext,
      modeName,
    );
    if (!bgPaint) result.surfaceDependent = true;
    const background = compositeColor(
      bgPaint || fallbackSurface,
      fallbackSurface,
    );

    auditNodeContrast(
      component,
      background,
      isDisabled,
      result,
      variableContext,
      component.name,
      modeName,
    );
  }

  return result;
}

function auditNodeContrast(
  node,
  background,
  isDisabled,
  result,
  variableContext,
  ownerName,
  modeName,
) {
  if (node && node.visible === false) return;
  if (isGeneratedNestedComponentInstance(node)) return;

  if (isGeneratedDirectIconSlot(node)) {
    auditActualIconSlotPaints(
      node,
      background,
      isDisabled,
      result,
      variableContext,
      ownerName,
      modeName,
    );
    return;
  }

  if (isGeneratedCheckboxControl(node)) {
    auditCheckboxControlPaints(
      node,
      background,
      isDisabled,
      result,
      variableContext,
      ownerName,
      modeName,
    );
    return;
  }

  if (isGeneratedRadioControl(node)) {
    auditRadioControlPaints(
      node,
      background,
      isDisabled,
      result,
      variableContext,
      ownerName,
      modeName,
    );
    return;
  }

  if (isGeneratedSwitchTrack(node)) {
    auditSwitchTrackPaints(
      node,
      background,
      isDisabled,
      result,
      variableContext,
      ownerName,
      modeName,
    );
    return;
  }

  if (isGeneratedInputField(node)) {
    auditInputFieldPaints(
      node,
      background,
      isDisabled,
      result,
      variableContext,
      ownerName,
      modeName,
    );
    return;
  }

  if (isGeneratedCardAction(node)) {
    auditCardActionPaints(
      node,
      background,
      isDisabled,
      result,
      variableContext,
      ownerName,
      modeName,
    );
    return;
  }

  if (isGeneratedSliderTrack(node)) {
    auditSliderTrackPaints(
      node,
      background,
      isDisabled,
      result,
      variableContext,
      ownerName,
      modeName,
    );
    return;
  }

  if (isGeneratedSliderThumb(node)) {
    auditSliderThumbPaints(
      node,
      background,
      isDisabled,
      result,
      variableContext,
      ownerName,
      modeName,
    );
    return;
  }

  if (isGeneratedProgressTrack(node)) {
    auditSliderTrackPaints(
      node,
      background,
      isDisabled,
      result,
      variableContext,
      ownerName,
      modeName,
    );
    return;
  }

  if (isGeneratedCheckboxMark(node)) {
    auditActualIconSlotPaints(
      node,
      background,
      isDisabled,
      result,
      variableContext,
      ownerName,
      modeName,
    );
    return;
  }

  const generatedIconPaint = generatedIconSlotPaint(
    node,
    variableContext,
    modeName,
  );
  if (generatedIconPaint) {
    auditNonTextPaint(
      node,
      generatedIconPaint,
      background,
      isDisabled,
      result,
      ownerName,
      modeName,
    );
    return;
  }

  if (node.type === "TEXT") {
    const paint = solidPaintToRgba(
      firstVisibleSolidPaint(node.fills),
      variableContext,
      modeName,
    );
    if (paint) {
      const foreground = compositeColor(paint, background);
      const ratio = contrastRatio(foreground, background);
      result.textPairs += 1;
      if (!isDisabled) {
        result.minTextContrast =
          result.minTextContrast === null
            ? ratio
            : Math.min(result.minTextContrast, ratio);
      }

      if (!isDisabled && ratio < 4.5) {
        result.textFailures += 1;
        addContrastFailure(
          result,
          node,
          ratio,
          "text",
          4.5,
          ownerName,
          modeName,
        );
      }
    }
  } else if (isLikelyNonTextIndicator(node)) {
    const paints = [];
    const fill = solidPaintToRgba(
      firstVisibleSolidPaint(node.fills),
      variableContext,
      modeName,
    );
    const stroke = solidPaintToRgba(
      firstVisibleSolidPaint(node.strokes),
      variableContext,
      modeName,
    );
    if (fill) paints.push(fill);
    if (stroke) paints.push(stroke);

    for (const paint of paints) {
      auditNonTextPaint(
        node,
        paint,
        background,
        isDisabled,
        result,
        ownerName,
        modeName,
      );
    }
  }

  if (node.children) {
    for (const child of node.children) {
      auditNodeContrast(
        child,
        background,
        isDisabled,
        result,
        variableContext,
        ownerName,
        modeName,
      );
    }
  }
}

function isGeneratedCheckboxControl(node) {
  return (
    node &&
    node.name === "Checkbox Control" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "checkbox-control"
  );
}

function isGeneratedCheckboxMark(node) {
  return (
    node &&
    node.name === "Checkbox Mark" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "checkbox-mark"
  );
}

function isGeneratedRadioControl(node) {
  return (
    node &&
    node.name === "Radio Control" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "radio-control"
  );
}

function isGeneratedRadioDot(node) {
  return (
    node &&
    node.name === "Radio Dot" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "radio-dot"
  );
}

function isGeneratedSwitchTrack(node) {
  return (
    node &&
    node.name === "Switch Track" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "switch-track"
  );
}

function isGeneratedSwitchThumb(node) {
  return (
    node &&
    node.name === "Switch Thumb" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "switch-thumb"
  );
}

function isGeneratedInputField(node) {
  return (
    node &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "input-field"
  );
}

function isGeneratedSliderTrack(node) {
  return (
    node &&
    node.name === "Slider Track" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "slider-track"
  );
}

function isGeneratedSliderThumb(node) {
  return (
    node &&
    node.name === "Slider Thumb" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "slider-thumb"
  );
}

function isGeneratedProgressTrack(node) {
  return (
    node &&
    node.name === "Progress Track" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "progress-track"
  );
}

function isGeneratedCardAction(node) {
  if (!node || !node.getSharedPluginData) return false;

  const kind = node.getSharedPluginData(RUN_NAMESPACE, "kind");
  return (
    ((kind === "card-action" || kind === "dialog-action") &&
      (node.name === "Primary Action" || node.name === "Secondary Action")) ||
    (kind === "toast-action" && node.name === "Toast Action")
  );
}

function auditCheckboxControlPaints(
  node,
  background,
  isDisabled,
  result,
  variableContext,
  ownerName,
  modeName,
) {
  const fill = solidPaintToRgba(
    firstVisibleSolidPaint(node.fills),
    variableContext,
    modeName,
  );
  const stroke = solidPaintToRgba(
    firstVisibleSolidPaint(node.strokes),
    variableContext,
    modeName,
  );
  const nextBackground = fill ? compositeColor(fill, background) : background;

  if (fill) {
    auditNonTextPaint(
      node,
      fill,
      background,
      isDisabled,
      result,
      ownerName,
      modeName,
    );
  }

  if (stroke) {
    auditNonTextPaint(
      node,
      stroke,
      background,
      isDisabled,
      result,
      ownerName,
      modeName,
    );
  }

  if (node.children) {
    for (const child of node.children) {
      auditNodeContrast(
        child,
        nextBackground,
        isDisabled,
        result,
        variableContext,
        ownerName,
        modeName,
      );
    }
  }
}

function auditRadioControlPaints(
  node,
  background,
  isDisabled,
  result,
  variableContext,
  ownerName,
  modeName,
) {
  auditCheckboxControlPaints(
    node,
    background,
    isDisabled,
    result,
    variableContext,
    ownerName,
    modeName,
  );
}

function auditSwitchTrackPaints(
  node,
  background,
  isDisabled,
  result,
  variableContext,
  ownerName,
  modeName,
) {
  auditCheckboxControlPaints(
    node,
    background,
    isDisabled,
    result,
    variableContext,
    ownerName,
    modeName,
  );
}

function auditSliderTrackPaints(
  node,
  background,
  isDisabled,
  result,
  variableContext,
  ownerName,
  modeName,
) {
  const fill = solidPaintToRgba(
    firstVisibleSolidPaint(node.fills),
    variableContext,
    modeName,
  );
  const stroke = solidPaintToRgba(
    firstVisibleSolidPaint(node.strokes),
    variableContext,
    modeName,
  );
  const nextBackground = fill ? compositeColor(fill, background) : background;
  const boundaryPaint = stroke || fill;

  if (boundaryPaint) {
    auditNonTextPaint(
      node,
      boundaryPaint,
      background,
      isDisabled,
      result,
      ownerName,
      modeName,
    );
  }

  if (node.children) {
    for (const child of node.children) {
      auditNodeContrast(
        child,
        nextBackground,
        isDisabled,
        result,
        variableContext,
        ownerName,
        modeName,
      );
    }
  }
}

function auditSliderThumbPaints(
  node,
  background,
  isDisabled,
  result,
  variableContext,
  ownerName,
  modeName,
) {
  const fill = solidPaintToRgba(
    firstVisibleSolidPaint(node.fills),
    variableContext,
    modeName,
  );
  const stroke = solidPaintToRgba(
    firstVisibleSolidPaint(node.strokes),
    variableContext,
    modeName,
  );
  const boundaryPaint = stroke || fill;
  const nextBackground = fill ? compositeColor(fill, background) : background;

  if (boundaryPaint) {
    auditNonTextPaint(
      node,
      boundaryPaint,
      background,
      isDisabled,
      result,
      ownerName,
      modeName,
    );
  }

  if (node.children) {
    for (const child of node.children) {
      auditNodeContrast(
        child,
        nextBackground,
        isDisabled,
        result,
        variableContext,
        ownerName,
        modeName,
      );
    }
  }
}

function auditCardActionPaints(
  node,
  background,
  isDisabled,
  result,
  variableContext,
  ownerName,
  modeName,
) {
  const fill = solidPaintToRgba(
    firstVisibleSolidPaint(node.fills),
    variableContext,
    modeName,
  );
  const stroke = solidPaintToRgba(
    firstVisibleSolidPaint(node.strokes),
    variableContext,
    modeName,
  );
  const nextBackground = fill ? compositeColor(fill, background) : background;
  const boundaryPaint = stroke || fill;

  if (boundaryPaint) {
    auditNonTextPaint(
      node,
      boundaryPaint,
      background,
      isDisabled,
      result,
      ownerName,
      modeName,
    );
  }

  if (node.children) {
    for (const child of node.children) {
      auditNodeContrast(
        child,
        nextBackground,
        isDisabled,
        result,
        variableContext,
        ownerName,
        modeName,
      );
    }
  }
}

function auditInputFieldPaints(
  node,
  background,
  isDisabled,
  result,
  variableContext,
  ownerName,
  modeName,
) {
  const fill = solidPaintToRgba(
    firstVisibleSolidPaint(node.fills),
    variableContext,
    modeName,
  );
  const stroke = solidPaintToRgba(
    firstVisibleSolidPaint(node.strokes),
    variableContext,
    modeName,
  );
  const nextBackground = fill ? compositeColor(fill, background) : background;

  if (stroke) {
    auditNonTextPaint(
      node,
      stroke,
      background,
      isDisabled,
      result,
      ownerName,
      modeName,
    );
  }

  if (node.children) {
    for (const child of node.children) {
      auditNodeContrast(
        child,
        nextBackground,
        isDisabled,
        result,
        variableContext,
        ownerName,
        modeName,
      );
    }
  }
}

function isGeneratedDirectIconSlot(node) {
  return (
    node &&
    node.name === "Icon" &&
    node.type === "INSTANCE" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "icon-slot-instance"
  );
}

function auditActualIconSlotPaints(
  node,
  background,
  isDisabled,
  result,
  variableContext,
  ownerName,
  modeName,
) {
  function walk(current) {
    const fill = solidPaintToRgba(
      firstVisibleSolidPaint(current.fills),
      variableContext,
      modeName,
    );
    const stroke = solidPaintToRgba(
      firstVisibleSolidPaint(current.strokes),
      variableContext,
      modeName,
    );

    if (fill) {
      auditNonTextPaint(
        current,
        fill,
        background,
        isDisabled,
        result,
        ownerName,
        modeName,
      );
    }

    if (stroke) {
      auditNonTextPaint(
        current,
        stroke,
        background,
        isDisabled,
        result,
        ownerName,
        modeName,
      );
    }

    if (current.children) {
      for (const child of current.children) walk(child);
    }
  }

  walk(node);
}

function auditNonTextPaint(
  node,
  paint,
  background,
  isDisabled,
  result,
  ownerName,
  modeName,
) {
  const foreground = compositeColor(paint, background);
  const ratio = contrastRatio(foreground, background);
  result.nonTextPairs += 1;
  if (!isDisabled) {
    result.minNonTextContrast =
      result.minNonTextContrast === null
        ? ratio
        : Math.min(result.minNonTextContrast, ratio);
  }

  if (!isDisabled && ratio < 3) {
    result.nonTextFailures += 1;
    addContrastFailure(result, node, ratio, "non-text", 3, ownerName, modeName);
  }
}

function generatedIconSlotPaint(node, variableContext, modeName) {
  if (!node || !node.getSharedPluginData) return null;
  if (node.name !== "Icon") return null;
  if (
    node.getSharedPluginData(RUN_NAMESPACE, "kind") !== "icon-slot-instance"
  ) {
    return null;
  }

  const variableName = node.getSharedPluginData(
    RUN_NAMESPACE,
    "foreground-token",
  );
  const fallback = node.getSharedPluginData(
    RUN_NAMESPACE,
    "foreground-fallback",
  );

  return colorForVariableName(
    variableName,
    fallback,
    variableContext,
    modeName,
  );
}

function isLikelyNonTextIndicator(node) {
  if (!node || !node.name) return false;
  if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") return false;
  if (node.type === "FRAME" || node.type === "GROUP") return false;
  if (node.name.indexOf("Variant=") === 0) return false;

  return (
    node.name === "Icon" ||
    node.name === "Loading Indicator" ||
    node.name === "Icon Circle" ||
    node.name === "Icon Handle" ||
    node.name === "Icon Mark" ||
    node.name === "Checkbox Control" ||
    /^Checkbox Mark/.test(node.name) ||
    node.name === "Radio Control" ||
    node.name === "Radio Dot" ||
    isGeneratedRadioDot(node) ||
    node.name === "Switch Track" ||
    node.name === "Switch Thumb" ||
    isGeneratedSwitchThumb(node) ||
    node.name === "Input Field" ||
    isGeneratedInputField(node) ||
    node.name === "Slider Track" ||
    node.name === "Slider Range" ||
    node.name === "Slider Thumb" ||
    isGeneratedSliderTrack(node) ||
    isGeneratedSliderThumb(node) ||
    node.name === "Progress Track" ||
    node.name === "Progress Range" ||
    isGeneratedProgressTrack(node) ||
    /spinner|glyph/i.test(node.name)
  );
}

function addContrastFailure(
  result,
  node,
  ratio,
  kind,
  required,
  ownerName,
  modeName,
) {
  if (result.failures.length >= 12) return;

  result.failures.push({
    mode: modeName,
    node: ownerName
      ? `${ownerName} / ${node.name || node.type}`
      : node.name || node.type,
    kind,
    ratio: Math.round(ratio * 100) / 100,
    required,
  });
}

function firstVisibleSolidPaint(paints) {
  if (!Array.isArray(paints)) return null;

  for (const paint of paints) {
    if (!paint || paint.visible === false) continue;
    if (paint.type === "SOLID") return paint;
  }

  return null;
}

function solidPaintToRgba(paint, variableContext, modeName) {
  if (!paint) return null;
  const boundColor = resolveBoundPaintColor(paint, variableContext, modeName);
  const color = boundColor || paint.color;
  if (!color) return null;
  return {
    r: color.r,
    g: color.g,
    b: color.b,
    a: paint.opacity === undefined ? 1 : paint.opacity,
  };
}

function createVariableContext(collections, variables) {
  const collectionById = {};
  const variableById = {};
  const variableByName = {};
  const modeNames = [];

  for (const collection of collections) {
    collectionById[collection.id] = collection;
    for (const mode of collection.modes || []) {
      if (modeNames.indexOf(mode.name) === -1) modeNames.push(mode.name);
    }
  }

  for (const variable of variables) {
    variableById[variable.id] = variable;
    variableByName[variable.name] = variable;
  }

  return { collectionById, variableById, variableByName, modeNames };
}

function resolveBoundPaintColor(paint, variableContext, modeName) {
  if (!paint || !paint.boundVariables || !variableContext) return null;
  const alias = paint.boundVariables.color;
  if (!alias || !alias.id) return null;
  return resolveVariableColor(alias.id, variableContext, [], modeName);
}

function resolveVariableColor(variableId, variableContext, seenIds, modeName) {
  if (!variableId || seenIds.indexOf(variableId) !== -1) return null;
  const variable = variableContext.variableById[variableId];
  if (!variable || variable.resolvedType !== "COLOR") return null;

  seenIds.push(variableId);
  const collection =
    variableContext.collectionById[variable.variableCollectionId];
  const modeId = firstModeId(collection, variable, modeName);
  if (!modeId || !variable.valuesByMode) return null;

  return resolveVariableColorValue(
    variable.valuesByMode[modeId],
    variableContext,
    seenIds,
    modeName,
  );
}

function firstModeId(collection, variable, modeName) {
  if (collection && collection.modes && collection.modes.length > 0) {
    if (modeName) {
      const matchingMode = collection.modes.find(
        (mode) => mode.name === modeName,
      );
      if (matchingMode) return matchingMode.modeId;
    }

    return collection.modes[0].modeId;
  }

  if (!variable || !variable.valuesByMode) return null;
  const modeIds = Object.keys(variable.valuesByMode);
  return modeIds.length > 0 ? modeIds[0] : null;
}

function resolveVariableColorValue(value, variableContext, seenIds, modeName) {
  if (!value) return null;

  if (value.type === "VARIABLE_ALIAS" && value.id) {
    return resolveVariableColor(value.id, variableContext, seenIds, modeName);
  }

  if (
    typeof value.r === "number" &&
    typeof value.g === "number" &&
    typeof value.b === "number"
  ) {
    return {
      r: value.r,
      g: value.g,
      b: value.b,
    };
  }

  return null;
}

function colorForVariableName(
  variableName,
  fallback,
  variableContext,
  modeName,
) {
  if (variableName && variableContext && variableContext.variableByName) {
    const variable = variableContext.variableByName[variableName];
    if (variable && variable.id) {
      const resolved = resolveVariableColor(
        variable.id,
        variableContext,
        [],
        modeName,
      );
      if (resolved) {
        return {
          r: resolved.r,
          g: resolved.g,
          b: resolved.b,
          a: 1,
        };
      }
    }
  }

  if (!fallback) return null;

  try {
    const color = parseColor(fallback);
    return {
      r: color.r,
      g: color.g,
      b: color.b,
      a: color.a,
    };
  } catch (_error) {
    return null;
  }
}

function compositeColor(foreground, background) {
  const alpha = foreground.a === undefined ? 1 : foreground.a;
  if (alpha >= 1) {
    return {
      r: foreground.r,
      g: foreground.g,
      b: foreground.b,
      a: 1,
    };
  }

  return {
    r: foreground.r * alpha + background.r * (1 - alpha),
    g: foreground.g * alpha + background.g * (1 - alpha),
    b: foreground.b * alpha + background.b * (1 - alpha),
    a: 1,
  };
}

function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(color) {
  return (
    0.2126 * linearRgb(color.r) +
    0.7152 * linearRgb(color.g) +
    0.0722 * linearRgb(color.b)
  );
}

function linearRgb(value) {
  return value <= 0.03928
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

function collectBoundVariableIds(root) {
  const ids = [];

  function addId(id) {
    if (id && ids.indexOf(id) === -1) ids.push(id);
  }

  function scanValue(value) {
    if (!value) return;
    if (Array.isArray(value)) {
      for (const item of value) scanValue(item);
      return;
    }

    if (typeof value !== "object") return;

    if (
      typeof value.id === "string" &&
      (value.type === "VARIABLE_ALIAS" || value.id.indexOf("VariableID:") === 0)
    ) {
      addId(value.id);
    }

    if (value.boundVariables) scanValue(value.boundVariables);

    for (const key of Object.keys(value)) {
      if (key === "parent" || key === "children") continue;
      scanValue(value[key]);
    }
  }

  function walk(node) {
    if (isGeneratedNestedComponentInstance(node)) return;

    scanValue(node.boundVariables);
    scanValue(node.fills);
    scanValue(node.strokes);
    scanValue(node.effects);
    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(root);
  return ids;
}

function auditBoundVariableFields(root) {
  const layoutFields = new Set([
    "width",
    "height",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "itemSpacing",
    "cornerRadius",
    "strokeWeight",
  ]);
  const typographyFields = new Set(["fontSize", "lineHeight"]);
  const usage = {
    totalFields: 0,
    layoutFieldCount: 0,
    typographyFieldCount: 0,
    colorFieldCount: 0,
    byField: {},
    textNodes: 0,
    textStyleNodes: 0,
    textNodesWithoutTextStyle: 0,
  };

  function addField(field) {
    usage.totalFields += 1;
    usage.byField[field] = (usage.byField[field] || 0) + 1;

    if (layoutFields.has(field)) {
      usage.layoutFieldCount += 1;
    } else if (typographyFields.has(field)) {
      usage.typographyFieldCount += 1;
    } else if (field === "fill.color" || field === "stroke.color") {
      usage.colorFieldCount += 1;
    }
  }

  function isVariableAlias(value) {
    return (
      value &&
      typeof value === "object" &&
      typeof value.id === "string" &&
      (value.type === "VARIABLE_ALIAS" || value.id.indexOf("VariableID:") === 0)
    );
  }

  function scanBoundVariables(value, field) {
    if (!value) return;
    if (isVariableAlias(value)) {
      addField(field);
      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) scanBoundVariables(item, field);
      return;
    }

    if (typeof value !== "object") return;

    for (const key of Object.keys(value)) {
      scanBoundVariables(value[key], key);
    }
  }

  function scanPaints(paints, field) {
    if (!Array.isArray(paints)) return;

    for (const paint of paints) {
      if (!paint || !paint.boundVariables) continue;
      if (isVariableAlias(paint.boundVariables.color)) {
        addField(field);
      } else {
        scanBoundVariables(paint.boundVariables, field);
      }
    }
  }

  function hasTextStyle(node) {
    const directStyleId = node.textStyleId;
    if (
      typeof directStyleId === "string" &&
      directStyleId.length > 0 &&
      directStyleId !== figma.mixed
    ) {
      return true;
    }

    if (
      node.getRangeTextStyleId &&
      typeof node.characters === "string" &&
      node.characters.length > 0
    ) {
      try {
        const rangeStyleId = node.getRangeTextStyleId(
          0,
          node.characters.length,
        );
        return (
          typeof rangeStyleId === "string" &&
          rangeStyleId.length > 0 &&
          rangeStyleId !== figma.mixed
        );
      } catch (_error) {
        return false;
      }
    }

    return (
      typeof directStyleId === "string" &&
      directStyleId.length > 0 &&
      directStyleId !== figma.mixed
    );
  }

  function walk(node) {
    if (isGeneratedNestedComponentInstance(node)) return;

    scanBoundVariables(node.boundVariables, "");
    scanPaints(node.fills, "fill.color");
    scanPaints(node.strokes, "stroke.color");

    if (node.type === "TEXT") {
      usage.textNodes += 1;
      if (hasTextStyle(node)) {
        usage.textStyleNodes += 1;
      } else {
        usage.textNodesWithoutTextStyle += 1;
      }
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(root);
  return usage;
}

async function importFoundations(payload, options) {
  validatePayload(payload);

  const stats = {
    pagesCreated: 0,
    pagesRenamed: 0,
    pagesExisting: 0,
    collectionsCreated: 0,
    collectionsExisting: 0,
    modesCreated: 0,
    modesExisting: 0,
    variablesCreated: 0,
    variablesExisting: 0,
    variableValuesSet: 0,
    aliasesSet: 0,
    scopesSet: 0,
    syntaxSet: 0,
    docsCreated: 0,
    skipped: [],
    warnings: [],
  };

  const pages =
    options.createPages === false
      ? new Map()
      : await ensurePages(payload.pages || [], stats);

  if (options.createVariables !== false) {
    await ensureVariables(payload, stats);
  }

  if (options.createDocs !== false) {
    await ensureDocumentation(payload, pages, stats);
  }

  return {
    target: payload.target,
    summary: payload.summary,
    stats,
    file: await inspectFile(),
  };
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be a JSON object.");
  }

  if (!Array.isArray(payload.variables)) {
    throw new Error("Payload is missing a variables array.");
  }

  if (!Array.isArray(payload.collections)) {
    throw new Error("Payload is missing a collections array.");
  }

  for (const variable of payload.variables) {
    if (
      !variable.canonicalName ||
      !variable.figmaName ||
      !variable.collection ||
      !variable.figmaType
    ) {
      throw new Error(
        `Invalid variable record: ${JSON.stringify(variable).slice(0, 200)}`,
      );
    }

    if (!VALID_VARIABLE_TYPES.has(variable.figmaType)) {
      throw new Error(
        `Unsupported Figma variable type "${variable.figmaType}" for ${variable.canonicalName}.`,
      );
    }
  }
}

async function ensurePages(pageNames, stats) {
  const pages = new Map(figma.root.children.map((page) => [page.name, page]));

  for (let index = 0; index < pageNames.length; index += 1) {
    const name = pageNames[index];
    if (pages.has(name)) {
      stats.pagesExisting += 1;
      continue;
    }

    let page = null;
    const defaultPage = figma.root.children.find(
      (child) => child.name === "Page 1",
    );

    if (index === 0 && defaultPage) {
      await defaultPage.loadAsync();
      if (defaultPage.children.length === 0) {
        defaultPage.name = name;
        page = defaultPage;
        stats.pagesRenamed += 1;
      }
    }

    if (!page) {
      page = figma.createPage();
      page.name = name;
      stats.pagesCreated += 1;
    }

    page.setSharedPluginData(RUN_NAMESPACE, "kind", "page");
    pages.set(name, page);
  }

  return pages;
}

async function ensureVariables(payload, stats) {
  const collections = await ensureCollections(payload.collections, stats);
  const existingVariables = await figma.variables.getLocalVariablesAsync();
  const variableByCollectionAndName = new Map();
  const variableByCanonicalName = new Map();

  for (const variable of existingVariables) {
    variableByCollectionAndName.set(
      `${variable.variableCollectionId}:${variable.name}`,
      variable,
    );
  }

  for (const item of payload.variables) {
    const collection = collections.get(item.collection);
    if (!collection) {
      stats.skipped.push(
        `${item.canonicalName}: missing collection ${item.collection}`,
      );
      continue;
    }

    const key = `${collection.id}:${item.figmaName}`;
    let variable = variableByCollectionAndName.get(key);

    if (!variable) {
      variable = figma.variables.createVariable(
        item.figmaName,
        collection,
        item.figmaType,
      );
      variable.setSharedPluginData(
        RUN_NAMESPACE,
        "canonicalName",
        item.canonicalName,
      );
      variable.setSharedPluginData(
        RUN_NAMESPACE,
        "cssVariable",
        item.cssVariable || "",
      );
      variableByCollectionAndName.set(key, variable);
      stats.variablesCreated += 1;
    } else {
      stats.variablesExisting += 1;
    }

    variableByCanonicalName.set(item.canonicalName, variable);

    if (
      Array.isArray(item.suggestedScopes) &&
      item.suggestedScopes.length > 0
    ) {
      try {
        variable.scopes = item.suggestedScopes;
        stats.scopesSet += 1;
      } catch (error) {
        stats.warnings.push(
          `${item.canonicalName}: could not set scopes (${messageFor(error)})`,
        );
      }
    }

    setCodeSyntax(variable, item, stats);
  }

  for (const item of payload.variables) {
    const variable = variableByCanonicalName.get(item.canonicalName);
    const collection = collections.get(item.collection);
    if (!variable || !collection) continue;

    const modeIds = modeIdsFor(collection);
    await setModeValue(
      variable,
      modeIds.Light,
      item.values.light,
      item,
      variableByCanonicalName,
      stats,
    );
    await setModeValue(
      variable,
      modeIds.Dark,
      item.values.dark,
      item,
      variableByCanonicalName,
      stats,
    );
  }
}

async function ensureCollections(collectionRecords, stats) {
  const existing = await figma.variables.getLocalVariableCollectionsAsync();
  const byName = new Map(
    existing.map((collection) => [collection.name, collection]),
  );
  const collections = new Map();

  for (const record of collectionRecords) {
    let collection = byName.get(record.name);

    if (!collection) {
      collection = figma.variables.createVariableCollection(record.name);
      collection.setSharedPluginData(RUN_NAMESPACE, "kind", "collection");
      stats.collectionsCreated += 1;
    } else {
      stats.collectionsExisting += 1;
    }

    ensureModes(collection, record.modes || ["Light", "Dark"], stats);
    collections.set(record.name, collection);
  }

  return collections;
}

function ensureModes(collection, modeNames, stats) {
  const desiredModes = modeNames.length > 0 ? modeNames : ["Light", "Dark"];
  let modes = collection.modes;

  if (!modes.some((mode) => mode.name === desiredModes[0])) {
    collection.renameMode(modes[0].modeId, desiredModes[0]);
    modes = collection.modes;
  }

  for (const modeName of desiredModes) {
    if (collection.modes.some((mode) => mode.name === modeName)) {
      stats.modesExisting += 1;
      continue;
    }

    collection.addMode(modeName);
    stats.modesCreated += 1;
  }
}

function modeIdsFor(collection) {
  const light =
    collection.modes.find((mode) => mode.name === "Light") ||
    collection.modes[0];
  const dark = collection.modes.find((mode) => mode.name === "Dark") || light;

  return {
    Light: light.modeId,
    Dark: dark.modeId,
  };
}

async function setModeValue(
  variable,
  modeId,
  valueRecord,
  item,
  variableByCanonicalName,
  stats,
) {
  if (!modeId || !valueRecord) return;

  try {
    const value = await toFigmaVariableValue(
      valueRecord,
      item,
      variableByCanonicalName,
    );
    variable.setValueForMode(modeId, value);
    stats.variableValuesSet += 1;
    if (valueRecord.kind === "alias") stats.aliasesSet += 1;
  } catch (error) {
    stats.warnings.push(
      `${item.canonicalName}: could not set ${modeId} (${messageFor(error)})`,
    );
  }
}

async function toFigmaVariableValue(
  valueRecord,
  item,
  variableByCanonicalName,
) {
  if (valueRecord.kind === "alias") {
    const target = variableByCanonicalName.get(valueRecord.path);
    if (!target) {
      throw new Error(`missing alias target ${valueRecord.path}`);
    }

    if (figma.variables.createVariableAliasByIdAsync) {
      return figma.variables.createVariableAliasByIdAsync(target.id);
    }

    return { type: "VARIABLE_ALIAS", id: target.id };
  }

  if (item.figmaType === "COLOR") {
    return parseColor(valueRecord.value);
  }

  if (item.figmaType === "FLOAT") {
    const numberValue =
      typeof valueRecord.value === "number"
        ? valueRecord.value
        : Number.parseFloat(String(valueRecord.value));

    if (Number.isNaN(numberValue)) {
      throw new Error(`expected number, received ${valueRecord.value}`);
    }

    return numberValue;
  }

  if (item.figmaType === "BOOLEAN") {
    return Boolean(valueRecord.value);
  }

  return String(valueRecord.value);
}

function parseColor(value) {
  if (typeof value !== "string") {
    throw new Error(`expected color string, received ${typeof value}`);
  }

  const raw = value.trim().toLowerCase();
  if (raw === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  const hex = raw.replace(/^#/, "");
  if (/^[0-9a-f]{3}$/.test(hex)) {
    return {
      r: Number.parseInt(hex[0] + hex[0], 16) / 255,
      g: Number.parseInt(hex[1] + hex[1], 16) / 255,
      b: Number.parseInt(hex[2] + hex[2], 16) / 255,
      a: 1,
    };
  }

  if (/^[0-9a-f]{6}([0-9a-f]{2})?$/.test(hex)) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16) / 255,
      g: Number.parseInt(hex.slice(2, 4), 16) / 255,
      b: Number.parseInt(hex.slice(4, 6), 16) / 255,
      a: hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
  }

  const rgba = raw.match(/^rgba?\(([^)]+)\)$/);
  if (rgba) {
    const parts = rgba[1].split(",").map((part) => part.trim());
    if (parts.length < 3) throw new Error(`invalid rgb color ${value}`);
    return {
      r: Number.parseFloat(parts[0]) / 255,
      g: Number.parseFloat(parts[1]) / 255,
      b: Number.parseFloat(parts[2]) / 255,
      a: parts[3] === undefined ? 1 : Number.parseFloat(parts[3]),
    };
  }

  throw new Error(`unsupported color ${value}`);
}

function setCodeSyntax(variable, item, stats) {
  if (!variable.setVariableCodeSyntax || !item.syntax) return;

  const mappings = [
    ["WEB", item.syntax.web],
    ["iOS", item.syntax.ios],
    ["ANDROID", item.syntax.android],
  ];

  for (const [platform, syntax] of mappings) {
    if (!syntax) continue;

    try {
      variable.setVariableCodeSyntax(platform, syntax);
      stats.syntaxSet += 1;
    } catch (error) {
      stats.warnings.push(
        `${item.canonicalName}: could not set ${platform} syntax (${messageFor(error)})`,
      );
    }
  }
}

async function ensureDocumentation(payload, pages, stats) {
  const foundationsPage =
    pages.get("Foundations") ||
    figma.root.children.find((page) => page.name === "Foundations");
  if (!foundationsPage) return;

  await foundationsPage.loadAsync();
  await figma.setCurrentPageAsync(foundationsPage);

  if (
    foundationsPage.findOne(
      (node) => node.name === "Kozmos DS / Foundations Overview",
    )
  ) {
    return;
  }

  try {
    await figma.loadFontAsync(FONT_REGULAR);
    await figma.loadFontAsync(FONT_BOLD);
  } catch (error) {
    stats.warnings.push(
      `Could not create documentation text (${messageFor(error)})`,
    );
    return;
  }

  const frame = figma.createFrame();
  frame.name = "Kozmos DS / Foundations Overview";
  frame.resize(960, 720);
  frame.x = 80;
  frame.y = 80;
  frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.layoutMode = "VERTICAL";
  frame.itemSpacing = 20;
  frame.paddingTop = 48;
  frame.paddingRight = 48;
  frame.paddingBottom = 48;
  frame.paddingLeft = 48;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.setSharedPluginData(RUN_NAMESPACE, "kind", "documentation");

  const title = figma.createText();
  title.name = "Title";
  title.fontName = FONT_BOLD;
  title.fontSize = 32;
  title.characters = "Kozmos Foundations";

  const summary = figma.createText();
  summary.name = "Summary";
  summary.fontName = FONT_REGULAR;
  summary.fontSize = 16;
  summary.lineHeight = { unit: "PIXELS", value: 24 };
  summary.characters = [
    `Target file: ${payload.target && payload.target.fileName ? payload.target.fileName : figma.root.name}`,
    `Modes: ${(payload.target && payload.target.modes ? payload.target.modes : ["Light", "Dark"]).join(", ")}`,
    `Variable candidates: ${payload.summary ? payload.summary.variableTokens : payload.variables.length}`,
    `Style/documentation-only tokens: ${payload.summary ? payload.summary.styleOnlyTokens : 0}`,
    "",
    "This page was generated from docs/figma-foundations-payload.json. Treat code tokens as the source of truth.",
  ].join("\n");

  frame.appendChild(title);
  frame.appendChild(summary);
  foundationsPage.appendChild(frame);
  stats.docsCreated += 1;
}

function messageFor(error) {
  return error instanceof Error ? error.message : String(error);
}

function incrementStat(stats, key, amount) {
  if (!stats) return;
  stats[key] = (stats[key] || 0) + (amount || 1);
}

function pushUniqueWarning(stats, key, message) {
  if (!stats) return;
  if (!stats.__warningKeys) {
    Object.defineProperty(stats, "__warningKeys", {
      value: {},
      enumerable: false,
    });
  }

  if (stats.__warningKeys[key]) return;
  stats.__warningKeys[key] = true;
  stats.warnings.push(message);
}

async function ensureComponentRuntimeVariables(stats) {
  const collection = await ensureComponentVariableCollection(stats);
  const modeIds = modeIdsFor(collection);
  const existingVariables = await figma.variables.getLocalVariablesAsync();
  const variableByCollectionAndName = new Map();
  const variableByName = new Map();

  for (const variable of existingVariables) {
    variableByCollectionAndName.set(
      `${variable.variableCollectionId}:${variable.name}`,
      variable,
    );
    variableByName.set(variable.name, variable);
  }

  for (const token of COMPONENT_FLOAT_TOKENS) {
    const key = `${collection.id}:${token.name}`;
    let variable = variableByCollectionAndName.get(key);

    if (!variable) {
      variable = figma.variables.createVariable(
        token.name,
        collection,
        "FLOAT",
      );
      variable.setSharedPluginData(RUN_NAMESPACE, "kind", "component-token");
      variable.setSharedPluginData(
        RUN_NAMESPACE,
        "cssVariable",
        cssVariableForComponentToken(token.name),
      );
      variableByCollectionAndName.set(key, variable);
      variableByName.set(token.name, variable);
      incrementStat(stats, "componentVariablesCreated");
    } else {
      incrementStat(stats, "componentVariablesExisting");
    }

    setVariableScopes(variable, token.scopes || [], token.name, stats);
    setVariableWebSyntax(
      variable,
      `var(${cssVariableForComponentToken(token.name)})`,
      token.name,
      stats,
    );

    for (const modeId of [modeIds.Light, modeIds.Dark]) {
      if (!modeId) continue;
      try {
        const value = await componentTokenModeValue(
          token,
          variableByName,
          stats,
        );
        variable.setValueForMode(modeId, value);
        incrementStat(stats, "componentVariableValuesSet");
        if (token.alias && value && value.type === "VARIABLE_ALIAS") {
          incrementStat(stats, "componentVariableAliasesSet");
        }
      } catch (error) {
        stats.warnings.push(
          `${token.name}: could not set component token value (${messageFor(error)})`,
        );
      }
    }
  }

  const variables = await figma.variables.getLocalVariablesAsync();
  return new Map(variables.map((variable) => [variable.name, variable]));
}

async function componentTokenModeValue(token, variableByName, stats) {
  if (!token.alias) return token.value;

  const target = variableByName.get(token.alias);
  if (!target) {
    pushUniqueWarning(
      stats,
      `missing-component-alias:${token.name}:${token.alias}`,
      `${token.name}: alias target "${token.alias}" was not found; using ${token.value}.`,
    );
    return token.value;
  }

  if (figma.variables.createVariableAliasByIdAsync) {
    try {
      return await figma.variables.createVariableAliasByIdAsync(target.id);
    } catch (error) {
      pushUniqueWarning(
        stats,
        `component-alias-failed:${token.name}:${token.alias}`,
        `${token.name}: could not alias to "${token.alias}" (${messageFor(error)}); using ${token.value}.`,
      );
      return token.value;
    }
  }

  return { type: "VARIABLE_ALIAS", id: target.id };
}

async function ensureComponentVariableCollection(stats) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let collection = collections.find(
    (candidate) => candidate.name === COMPONENT_COLLECTION_NAME,
  );

  if (!collection) {
    collection = figma.variables.createVariableCollection(
      COMPONENT_COLLECTION_NAME,
    );
    collection.setSharedPluginData(RUN_NAMESPACE, "kind", "collection");
    incrementStat(stats, "componentCollectionsCreated");
  }

  ensureModeNames(collection, ["Light", "Dark"], stats);
  return collection;
}

function ensureModeNames(collection, names, stats) {
  const desired = names && names.length > 0 ? names : ["Light", "Dark"];
  let modes = collection.modes;

  if (!modes.some((mode) => mode.name === desired[0])) {
    try {
      collection.renameMode(modes[0].modeId, desired[0]);
      modes = collection.modes;
    } catch (error) {
      stats.warnings.push(
        `${collection.name}: could not rename first mode (${messageFor(error)})`,
      );
    }
  }

  for (const name of desired) {
    if (collection.modes.some((mode) => mode.name === name)) {
      incrementStat(stats, "componentModesExisting");
      continue;
    }

    try {
      collection.addMode(name);
      incrementStat(stats, "componentModesCreated");
    } catch (error) {
      stats.warnings.push(
        `${collection.name}: could not add ${name} mode (${messageFor(error)})`,
      );
    }
  }
}

function setVariableScopes(variable, scopes, name, stats) {
  if (!scopes || scopes.length === 0) return;

  try {
    variable.scopes = scopes;
    incrementStat(stats, "componentVariableScopesSet");
  } catch (error) {
    stats.warnings.push(
      `${name}: could not set component token scopes (${messageFor(error)})`,
    );
  }
}

function setVariableWebSyntax(variable, syntax, name, stats) {
  if (!variable.setVariableCodeSyntax || !syntax) return;

  try {
    variable.setVariableCodeSyntax("WEB", syntax);
    incrementStat(stats, "componentVariableSyntaxSet");
  } catch (error) {
    stats.warnings.push(
      `${name}: could not set component token code syntax (${messageFor(error)})`,
    );
  }
}

function cssVariableForComponentToken(name) {
  return `--components-${name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

async function ensureButtonLabelTextStyle(fonts, stats) {
  const styles = await getLocalTextStylesSafe();
  let style = styles.find(
    (candidate) => candidate.name === BUTTON_LABEL_TEXT_STYLE_NAME,
  );

  if (!style) {
    if (!figma.createTextStyle) {
      stats.warnings.push(
        "This Figma runtime does not expose createTextStyle; Button labels will use direct typography values.",
      );
      return null;
    }

    style = figma.createTextStyle();
    style.name = BUTTON_LABEL_TEXT_STYLE_NAME;
    incrementStat(stats, "textStylesCreated");
  } else {
    incrementStat(stats, "textStylesExisting");
  }

  try {
    style.description =
      "Typography contract for Kozmos Button labels. Font family and weight are represented by this text style; size and line height also have component variables.";
    style.fontName = fonts.medium;
    style.fontSize = 14;
    style.lineHeight = { unit: "PIXELS", value: 20 };
    style.letterSpacing = { unit: "PERCENT", value: 0 };
    style.paragraphSpacing = 0;
    incrementStat(stats, "textStylesUpdated");
  } catch (error) {
    stats.warnings.push(
      `${BUTTON_LABEL_TEXT_STYLE_NAME}: could not update text style (${messageFor(error)})`,
    );
    return null;
  }

  return style;
}

async function getLocalTextStylesSafe() {
  if (figma.getLocalTextStylesAsync) {
    return figma.getLocalTextStylesAsync();
  }

  if (figma.getLocalTextStyles) {
    return figma.getLocalTextStyles();
  }

  return [];
}

async function applyButtonLabelTypography(
  label,
  fonts,
  textStyle,
  variableByName,
  stats,
) {
  label.fontName = fonts.medium;
  label.fontSize = 14;
  label.lineHeight = { unit: "PIXELS", value: 20 };
  label.textAutoResize = "WIDTH_AND_HEIGHT";

  if (textStyle && textStyle.id) {
    try {
      if (label.setTextStyleIdAsync) {
        await label.setTextStyleIdAsync(textStyle.id);
      } else {
        label.textStyleId = textStyle.id;
      }
      incrementStat(stats, "textStyleBindingsApplied");
    } catch (error) {
      stats.warnings.push(
        `Could not apply ${BUTTON_LABEL_TEXT_STYLE_NAME} to Button label (${messageFor(error)}).`,
      );
    }
  }

  bindFloatVariable(
    label,
    "fontSize",
    "Button/label/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    label,
    "lineHeight",
    "Button/label/line-height",
    variableByName,
    stats,
  );
}

function applyTextTypography(text, size, weight, fonts, variableByName, stats) {
  const metrics = textMetrics(size);
  text.fontName = textFontForWeight(weight, fonts);
  text.fontSize = metrics.fontSize;
  text.lineHeight = { unit: "PIXELS", value: metrics.lineHeight };
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    `Text/font-size/${metrics.token}`,
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    `Text/line-height/${metrics.token}`,
    variableByName,
    stats,
  );
}

function applyBadgeLabelTypography(label, fonts, variableByName, stats) {
  label.fontName = fonts.medium;
  label.fontSize = 14;
  label.lineHeight = { unit: "PIXELS", value: 20 };
  label.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    label,
    "fontSize",
    "Badge/label/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    label,
    "lineHeight",
    "Badge/label/line-height",
    variableByName,
    stats,
  );
}

function applyCounterTypography(label, size, fonts, variableByName, stats) {
  const metrics = counterMetrics(size);
  label.fontName = fonts.medium;
  label.fontSize = metrics.fontSize;
  label.lineHeight = { unit: "PIXELS", value: metrics.lineHeight };
  label.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    label,
    "fontSize",
    metrics.fontSizeToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    label,
    "lineHeight",
    metrics.lineHeightToken,
    variableByName,
    stats,
  );
}

function applyCardTitleTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.medium;
  text.fontSize = 24;
  text.lineHeight = { unit: "PIXELS", value: 24 };
  text.textAutoResize = "HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Card/title/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Card/title/line-height",
    variableByName,
    stats,
  );
}

function applyCardDescriptionTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Card/description/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Card/description/line-height",
    variableByName,
    stats,
  );
}

function applyCardBodyTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 22 };
  text.textAutoResize = "HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Card/body/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Card/body/line-height",
    variableByName,
    stats,
  );
}

function applyTabsTriggerTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.medium;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Tabs/trigger/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Tabs/trigger/line-height",
    variableByName,
    stats,
  );
}

function applyTooltipContentTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Tooltip/content/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Tooltip/content/line-height",
    variableByName,
    stats,
  );
}

function applyDialogTitleTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.medium;
  text.fontSize = 18;
  text.lineHeight = { unit: "PIXELS", value: 24 };
  text.textAutoResize = "HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Dialog/title/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Dialog/title/line-height",
    variableByName,
    stats,
  );
}

function applyDialogDescriptionTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Dialog/description/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Dialog/description/line-height",
    variableByName,
    stats,
  );
}

function applyDialogBodyTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Dialog/body/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Dialog/body/line-height",
    variableByName,
    stats,
  );
}

function applyPopoverTitleTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.medium;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Popover/title/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Popover/title/line-height",
    variableByName,
    stats,
  );
}

function applyPopoverDescriptionTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Popover/description/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Popover/description/line-height",
    variableByName,
    stats,
  );
}

function applyMenuItemTypography(text, fonts, variableByName, stats, strong) {
  text.fontName = strong ? fonts.medium : fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Menu/text/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Menu/text/line-height",
    variableByName,
    stats,
  );
}

function applyMenuShortcutTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.medium;
  text.fontSize = 12;
  text.lineHeight = { unit: "PIXELS", value: 16 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Menu/shortcut/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Menu/shortcut/line-height",
    variableByName,
    stats,
  );
}

function applyToastTitleTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.medium;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Toast/title/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Toast/title/line-height",
    variableByName,
    stats,
  );
}

function applyToastDescriptionTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Toast/description/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Toast/description/line-height",
    variableByName,
    stats,
  );
}

function applyCheckboxLabelTypography(label, fonts, variableByName, stats) {
  label.fontName = fonts.medium;
  label.fontSize = 14;
  label.lineHeight = { unit: "PIXELS", value: 20 };
  label.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    label,
    "fontSize",
    "Checkbox/label/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    label,
    "lineHeight",
    "Checkbox/label/line-height",
    variableByName,
    stats,
  );
}

function applyRadioLabelTypography(label, fonts, variableByName, stats) {
  label.fontName = fonts.medium;
  label.fontSize = 14;
  label.lineHeight = { unit: "PIXELS", value: 20 };
  label.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    label,
    "fontSize",
    "Radio/label/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    label,
    "lineHeight",
    "Radio/label/line-height",
    variableByName,
    stats,
  );
}

function applySwitchLabelTypography(label, fonts, variableByName, stats) {
  label.fontName = fonts.medium;
  label.fontSize = 14;
  label.lineHeight = { unit: "PIXELS", value: 20 };
  label.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    label,
    "fontSize",
    "Switch/label/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    label,
    "lineHeight",
    "Switch/label/line-height",
    variableByName,
    stats,
  );
}

function applyInputLabelTypography(label, fonts, variableByName, stats) {
  label.fontName = fonts.medium;
  label.fontSize = 14;
  label.lineHeight = { unit: "PIXELS", value: 20 };
  label.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    label,
    "fontSize",
    "Input/label/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    label,
    "lineHeight",
    "Input/label/line-height",
    variableByName,
    stats,
  );
}

function applyInputTextTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Input/text/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Input/text/line-height",
    variableByName,
    stats,
  );
}

function applyFieldLabelTypography(
  label,
  fonts,
  tokenPrefix,
  variableByName,
  stats,
) {
  label.fontName = fonts.medium;
  label.fontSize = 14;
  label.lineHeight = { unit: "PIXELS", value: 20 };
  label.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    label,
    "fontSize",
    `${tokenPrefix}/label/font-size`,
    variableByName,
    stats,
  );
  bindFloatVariable(
    label,
    "lineHeight",
    `${tokenPrefix}/label/line-height`,
    variableByName,
    stats,
  );
}

function applyFieldTextTypography(
  text,
  fonts,
  tokenPrefix,
  variableByName,
  stats,
) {
  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    `${tokenPrefix}/text/font-size`,
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    `${tokenPrefix}/text/line-height`,
    variableByName,
    stats,
  );
}

function applyAvatarFallbackTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.medium;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Avatar/fallback/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Avatar/fallback/line-height",
    variableByName,
    stats,
  );
}

function applyAlertTitleTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.medium;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Alert/title/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Alert/title/line-height",
    variableByName,
    stats,
  );
}

function applyAlertDescriptionTypography(text, fonts, variableByName, stats) {
  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  bindFloatVariable(
    text,
    "fontSize",
    "Alert/description/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Alert/description/line-height",
    variableByName,
    stats,
  );
}

function bindFloatVariable(
  node,
  propertyName,
  variableName,
  variableByName,
  stats,
) {
  const variable = variableByName.get(variableName);
  if (!variable) {
    pushUniqueWarning(
      stats,
      `missing-component-variable:${variableName}`,
      `Missing component variable "${variableName}".`,
    );
    return false;
  }

  if (!node || !node.setBoundVariable) {
    incrementStat(stats, "componentVariableBindingsSkipped");
    return false;
  }

  try {
    node.setBoundVariable(propertyName, variable);
    incrementStat(stats, "componentVariableBindingsApplied");
    return true;
  } catch (error) {
    incrementStat(stats, "componentVariableBindingsFailed");
    pushUniqueWarning(
      stats,
      `component-binding:${propertyName}:${variableName}`,
      `Could not bind ${variableName} to ${propertyName} (${messageFor(error)})`,
    );
    return false;
  }
}

function bindSizeVariables(
  node,
  widthToken,
  heightToken,
  variableByName,
  stats,
) {
  bindFloatVariable(node, "width", widthToken, variableByName, stats);
  bindFloatVariable(
    node,
    "height",
    heightToken || widthToken,
    variableByName,
    stats,
  );
}

function bindButtonGeometryVariables(
  component,
  metrics,
  config,
  variableByName,
  stats,
) {
  bindSizeVariables(
    component,
    metrics.widthToken,
    metrics.heightToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    metrics.paddingXToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    metrics.paddingXToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Button/padding/y",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Button/padding/y",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    metrics.gapToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Button/radius",
    variableByName,
    stats,
  );

  if (config && config.stroke) {
    bindFloatVariable(
      component,
      "strokeWeight",
      "Button/stroke/width",
      variableByName,
      stats,
    );
  }
}

function bindIconButtonGeometryVariables(
  component,
  metrics,
  config,
  variableByName,
  stats,
) {
  bindSizeVariables(
    component,
    metrics.sizeToken,
    metrics.sizeToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Button/padding/y",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Button/padding/y",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Button/padding/y",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Button/padding/y",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Button/gap/icon",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "IconButton/radius",
    variableByName,
    stats,
  );

  if (config && config.stroke) {
    bindFloatVariable(
      component,
      "strokeWeight",
      "IconButton/stroke/width",
      variableByName,
      stats,
    );
  }
}

function bindBadgeGeometryVariables(
  component,
  metrics,
  config,
  variableByName,
  stats,
) {
  bindFloatVariable(
    component,
    "height",
    metrics.heightToken,
    variableByName,
    stats,
  );
  if (metrics.widthToken) {
    bindFloatVariable(
      component,
      "width",
      metrics.widthToken,
      variableByName,
      stats,
    );
  }
  bindFloatVariable(
    component,
    "paddingLeft",
    metrics.paddingXToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    metrics.paddingXToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Badge/padding/y",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Badge/padding/y",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Badge/gap",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Badge/radius",
    variableByName,
    stats,
  );

  if (config && config.stroke) {
    bindFloatVariable(
      component,
      "strokeWeight",
      "Badge/stroke/width",
      variableByName,
      stats,
    );
  }
}

function bindCounterGeometryVariables(counter, metrics, variableByName, stats) {
  bindFloatVariable(
    counter,
    "height",
    metrics.heightToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    counter,
    "paddingLeft",
    metrics.paddingXToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    counter,
    "paddingRight",
    metrics.paddingXToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    counter,
    "cornerRadius",
    "Counter/radius",
    variableByName,
    stats,
  );
}

function bindCardGeometryVariables(
  component,
  header,
  body,
  footer,
  variableByName,
  stats,
) {
  bindFloatVariable(
    component,
    "width",
    "Card/width/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Card/radius",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "strokeWeight",
    "Card/stroke/width",
    variableByName,
    stats,
  );

  const sections = [header, body, footer].filter(Boolean);
  for (const section of sections) {
    bindFloatVariable(
      section,
      "paddingLeft",
      "Card/padding",
      variableByName,
      stats,
    );
    bindFloatVariable(
      section,
      "paddingRight",
      "Card/padding",
      variableByName,
      stats,
    );
    bindFloatVariable(
      section,
      "paddingBottom",
      "Card/padding",
      variableByName,
      stats,
    );
  }

  if (header) {
    bindFloatVariable(
      header,
      "paddingTop",
      "Card/padding",
      variableByName,
      stats,
    );
    bindFloatVariable(
      header,
      "itemSpacing",
      "Card/header/gap",
      variableByName,
      stats,
    );
  }

  if (body) {
    bindFloatVariable(
      body,
      "itemSpacing",
      "Card/body/gap",
      variableByName,
      stats,
    );
  }

  if (footer) {
    bindFloatVariable(
      footer,
      "itemSpacing",
      "Card/footer/gap",
      variableByName,
      stats,
    );
  }
}

function bindTabsGeometryVariables(
  component,
  count,
  triggers,
  variableByName,
  stats,
) {
  const widthToken = `Tabs/width/${String(count).toLowerCase()}`;
  bindSizeVariables(
    component,
    widthToken,
    "Tabs/list/height",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Tabs/list/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Tabs/list/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Tabs/list/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Tabs/list/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Tabs/list/gap",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Tabs/list/radius",
    variableByName,
    stats,
  );

  for (const trigger of triggers) {
    bindFloatVariable(
      trigger,
      "height",
      "Tabs/trigger/height",
      variableByName,
      stats,
    );
    bindFloatVariable(
      trigger,
      "paddingLeft",
      "Tabs/trigger/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      trigger,
      "paddingRight",
      "Tabs/trigger/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      trigger,
      "cornerRadius",
      "Tabs/trigger/radius",
      variableByName,
      stats,
    );
  }
}

function bindTooltipGeometryVariables(component, variableByName, stats) {
  bindFloatVariable(
    component,
    "paddingLeft",
    "Tooltip/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Tooltip/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Tooltip/padding/y",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Tooltip/padding/y",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Tooltip/radius",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "strokeWeight",
    "Tooltip/stroke/width",
    variableByName,
    stats,
  );
}

function bindTooltipTipVariables(tip, side, variableByName, stats) {
  if (side === "Left" || side === "Right") {
    bindSizeVariables(
      tip,
      "Tooltip/tip/height",
      "Tooltip/tip/size",
      variableByName,
      stats,
    );
    return;
  }
  bindSizeVariables(
    tip,
    "Tooltip/tip/size",
    "Tooltip/tip/height",
    variableByName,
    stats,
  );
}

function bindDialogGeometryVariables(
  component,
  header,
  body,
  footer,
  close,
  variableByName,
  stats,
) {
  bindFloatVariable(
    component,
    "width",
    "Dialog/width/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Dialog/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Dialog/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Dialog/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Dialog/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Dialog/gap",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Dialog/radius",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "strokeWeight",
    "Dialog/stroke/width",
    variableByName,
    stats,
  );

  if (header) {
    const headerContent = directChildNamed(header, "Dialog Header Content");
    bindFloatVariable(
      headerContent || header,
      "itemSpacing",
      "Dialog/header/gap",
      variableByName,
      stats,
    );
  }

  if (body) {
    bindFloatVariable(
      body,
      "itemSpacing",
      "Dialog/body/gap",
      variableByName,
      stats,
    );
  }

  if (footer) {
    bindFloatVariable(
      footer,
      "itemSpacing",
      "Dialog/footer/gap",
      variableByName,
      stats,
    );
  }

  if (close) {
    bindSizeVariables(
      close,
      "Dialog/close/size",
      "Dialog/close/size",
      variableByName,
      stats,
    );
  }
}

function bindPopoverGeometryVariables(
  component,
  header,
  variableByName,
  stats,
) {
  bindFloatVariable(
    component,
    "width",
    "Popover/width/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Popover/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Popover/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Popover/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Popover/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Popover/gap",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Popover/radius",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "strokeWeight",
    "Popover/stroke/width",
    variableByName,
    stats,
  );

  if (header) {
    bindFloatVariable(
      header,
      "itemSpacing",
      "Popover/header/gap",
      variableByName,
      stats,
    );
  }
}

function bindMenuGeometryVariables(component, items, variableByName, stats) {
  bindFloatVariable(
    component,
    "width",
    "Menu/width/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Menu/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Menu/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Menu/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Menu/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Menu/radius",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "strokeWeight",
    "Menu/stroke/width",
    variableByName,
    stats,
  );

  for (const item of items) {
    if (!item || item.removed || item.type !== "FRAME") continue;
    bindFloatVariable(
      item,
      "height",
      "Menu/item/height",
      variableByName,
      stats,
    );
    bindFloatVariable(
      item,
      "paddingRight",
      "Menu/item/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      item,
      "cornerRadius",
      "Menu/item/radius",
      variableByName,
      stats,
    );
    bindFloatVariable(
      item,
      "itemSpacing",
      "Menu/item/gap",
      variableByName,
      stats,
    );
  }
}

function bindToastGeometryVariables(
  component,
  textGroup,
  action,
  close,
  variableByName,
  stats,
) {
  bindFloatVariable(
    component,
    "width",
    "Toast/width/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Toast/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Toast/padding/right",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Toast/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Toast/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Toast/gap",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Toast/radius",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "strokeWeight",
    "Toast/stroke/width",
    variableByName,
    stats,
  );

  if (textGroup) {
    bindFloatVariable(
      textGroup,
      "itemSpacing",
      "Toast/text/gap",
      variableByName,
      stats,
    );
  }

  if (action) {
    bindFloatVariable(
      action,
      "height",
      "Toast/action/height",
      variableByName,
      stats,
    );
    bindFloatVariable(
      action,
      "paddingLeft",
      "Toast/action/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      action,
      "paddingRight",
      "Toast/action/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      action,
      "cornerRadius",
      "Toast/action/radius",
      variableByName,
      stats,
    );
  }

  if (close) {
    bindSizeVariables(
      close,
      "Toast/close/size",
      "Toast/close/size",
      variableByName,
      stats,
    );
  }
}

function bindCheckboxGeometryVariables(
  component,
  control,
  variableByName,
  stats,
) {
  bindSizeVariables(
    component,
    "Checkbox/width/default",
    "Checkbox/height/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Checkbox/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Checkbox/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Checkbox/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Checkbox/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Checkbox/gap",
    variableByName,
    stats,
  );

  if (control) {
    bindSizeVariables(
      control,
      "Checkbox/control/size",
      "Checkbox/control/size",
      variableByName,
      stats,
    );
    bindFloatVariable(
      control,
      "cornerRadius",
      "Checkbox/control/radius",
      variableByName,
      stats,
    );
    bindFloatVariable(
      control,
      "strokeWeight",
      "Checkbox/control/stroke/width",
      variableByName,
      stats,
    );
  }
}

function bindRadioGeometryVariables(
  component,
  control,
  dot,
  variableByName,
  stats,
) {
  bindSizeVariables(
    component,
    "Radio/width/default",
    "Radio/height/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Radio/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Radio/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Radio/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Radio/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Radio/gap",
    variableByName,
    stats,
  );

  if (control) {
    bindSizeVariables(
      control,
      "Radio/control/size",
      "Radio/control/size",
      variableByName,
      stats,
    );
    bindFloatVariable(
      control,
      "cornerRadius",
      "Radio/control/radius",
      variableByName,
      stats,
    );
    bindFloatVariable(
      control,
      "strokeWeight",
      "Radio/control/stroke/width",
      variableByName,
      stats,
    );
  }

  if (dot) {
    bindSizeVariables(
      dot,
      "Radio/dot/size",
      "Radio/dot/size",
      variableByName,
      stats,
    );
  }
}

function bindSwitchGeometryVariables(
  component,
  track,
  thumb,
  variableByName,
  stats,
) {
  bindSizeVariables(
    component,
    "Switch/width/default",
    "Switch/height/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Switch/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Switch/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Switch/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Switch/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Switch/gap",
    variableByName,
    stats,
  );

  if (track) {
    bindSizeVariables(
      track,
      "Switch/track/width",
      "Switch/track/height",
      variableByName,
      stats,
    );
    bindFloatVariable(
      track,
      "cornerRadius",
      "Switch/track/radius",
      variableByName,
      stats,
    );
    bindFloatVariable(
      track,
      "strokeWeight",
      "Switch/track/stroke/width",
      variableByName,
      stats,
    );
  }

  if (thumb) {
    bindSizeVariables(
      thumb,
      "Switch/thumb/size",
      "Switch/thumb/size",
      variableByName,
      stats,
    );
    bindFloatVariable(
      thumb,
      "cornerRadius",
      "Switch/thumb/radius",
      variableByName,
      stats,
    );
  }
}

function bindInputGeometryVariables(component, field, variableByName, stats) {
  bindFloatVariable(
    component,
    "width",
    "Input/width/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Input/gap",
    variableByName,
    stats,
  );

  if (field) {
    bindFloatVariable(
      field,
      "height",
      "Input/field/height",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingLeft",
      "Input/field/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingRight",
      "Input/field/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingTop",
      "Input/field/padding/y",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingBottom",
      "Input/field/padding/y",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "cornerRadius",
      "Input/field/radius",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "strokeWeight",
      "Input/field/stroke/width",
      variableByName,
      stats,
    );
  }
}

function bindTextareaGeometryVariables(
  component,
  field,
  variableByName,
  stats,
) {
  bindFloatVariable(
    component,
    "width",
    "Textarea/width/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Textarea/gap",
    variableByName,
    stats,
  );

  if (field) {
    bindFloatVariable(
      field,
      "height",
      "Textarea/field/height",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingLeft",
      "Textarea/field/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingRight",
      "Textarea/field/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingTop",
      "Textarea/field/padding/y",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingBottom",
      "Textarea/field/padding/y",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "cornerRadius",
      "Textarea/field/radius",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "strokeWeight",
      "Textarea/field/stroke/width",
      variableByName,
      stats,
    );
  }
}

function bindSearchGeometryVariables(
  component,
  field,
  icon,
  variableByName,
  stats,
) {
  bindFloatVariable(
    component,
    "width",
    "Search/width/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Search/gap",
    variableByName,
    stats,
  );

  if (field) {
    bindFloatVariable(
      field,
      "height",
      "Search/field/height",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingLeft",
      "Search/field/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingRight",
      "Search/field/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingTop",
      "Search/field/padding/y",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "paddingBottom",
      "Search/field/padding/y",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "cornerRadius",
      "Search/field/radius",
      variableByName,
      stats,
    );
    bindFloatVariable(
      field,
      "strokeWeight",
      "Search/field/stroke/width",
      variableByName,
      stats,
    );
  }

  if (icon) {
    bindSizeVariables(
      icon,
      "Search/icon/size",
      "Search/icon/size",
      variableByName,
      stats,
    );
  }
}

function bindSelectGeometryVariables(
  component,
  trigger,
  icon,
  variableByName,
  stats,
) {
  bindFloatVariable(
    component,
    "width",
    "Select/width/default",
    variableByName,
    stats,
  );

  if (trigger) {
    bindFloatVariable(
      trigger,
      "height",
      "Select/trigger/height",
      variableByName,
      stats,
    );
    bindFloatVariable(
      trigger,
      "paddingLeft",
      "Select/trigger/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      trigger,
      "paddingRight",
      "Select/trigger/padding/x",
      variableByName,
      stats,
    );
    bindFloatVariable(
      trigger,
      "paddingTop",
      "Select/trigger/padding/y",
      variableByName,
      stats,
    );
    bindFloatVariable(
      trigger,
      "paddingBottom",
      "Select/trigger/padding/y",
      variableByName,
      stats,
    );
    bindFloatVariable(
      trigger,
      "cornerRadius",
      "Select/trigger/radius",
      variableByName,
      stats,
    );
    bindFloatVariable(
      trigger,
      "strokeWeight",
      "Select/trigger/stroke/width",
      variableByName,
      stats,
    );
  }

  if (icon) {
    bindSizeVariables(
      icon,
      "Select/icon/size",
      "Select/icon/size",
      variableByName,
      stats,
    );
  }
}

function bindSliderGeometryVariables(
  component,
  root,
  track,
  thumb,
  variableByName,
  stats,
) {
  bindFloatVariable(
    component,
    "width",
    "Slider/width/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Slider/gap",
    variableByName,
    stats,
  );

  if (root) {
    bindSizeVariables(
      root,
      "Slider/width/default",
      "Slider/height/default",
      variableByName,
      stats,
    );
  }

  if (track) {
    bindFloatVariable(
      track,
      "width",
      "Slider/width/default",
      variableByName,
      stats,
    );
    bindFloatVariable(
      track,
      "height",
      "Slider/track/height",
      variableByName,
      stats,
    );
  }

  if (thumb) {
    bindSizeVariables(
      thumb,
      "Slider/thumb/size",
      "Slider/thumb/size",
      variableByName,
      stats,
    );
  }
}

function bindProgressGeometryVariables(
  component,
  track,
  range,
  variableByName,
  stats,
) {
  bindSizeVariables(
    component,
    "Progress/width/default",
    "Progress/height/default",
    variableByName,
    stats,
  );

  if (track) {
    bindSizeVariables(
      track,
      "Progress/width/default",
      "Progress/height/default",
      variableByName,
      stats,
    );
    bindFloatVariable(
      track,
      "cornerRadius",
      "Progress/radius",
      variableByName,
      stats,
    );
    bindFloatVariable(
      track,
      "strokeWeight",
      "Progress/stroke/width",
      variableByName,
      stats,
    );
  }

  if (range) {
    bindFloatVariable(
      range,
      "height",
      "Progress/height/default",
      variableByName,
      stats,
    );
    bindFloatVariable(
      range,
      "cornerRadius",
      "Progress/radius",
      variableByName,
      stats,
    );
  }
}

function bindAvatarGeometryVariables(component, variableByName, stats) {
  bindSizeVariables(
    component,
    "Avatar/size/default",
    "Avatar/size/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Avatar/radius",
    variableByName,
    stats,
  );
}

function bindAlertGeometryVariables(component, icon, variableByName, stats) {
  bindFloatVariable(
    component,
    "width",
    "Alert/width/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Alert/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Alert/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingTop",
    "Alert/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingBottom",
    "Alert/padding",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    "Alert/gap",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    "Alert/radius",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "strokeWeight",
    "Alert/stroke/width",
    variableByName,
    stats,
  );

  if (icon) {
    bindSizeVariables(
      icon,
      "Alert/icon/size",
      "Alert/icon/size",
      variableByName,
      stats,
    );
  }
}

async function buildButtonComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    iconSlotsBound: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  const existing = page.findOne((node) => node.name === "Button / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Button / v1 already exists. Delete or rename it before rebuilding.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const textStyle = await ensureButtonLabelTextStyle(fonts, stats);
  const components = [];

  let index = 0;
  for (const variant of BUTTON_VARIANTS) {
    for (const size of BUTTON_SIZES) {
      for (const state of BUTTON_STATES) {
        const component = await createButtonVariant({
          variant,
          size,
          state,
          variableByName,
          fonts,
          textStyle,
          stats,
        });
        component.x = (index % 12) * 180;
        component.y = Math.floor(index / 12) * 96;
        page.appendChild(component);
        components.push(component);
        index += 1;
      }
    }
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Button / v1";
  componentSet.x = 80;
  componentSet.y = 80;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Button");
  applyComponentSetDescription(componentSet, "Button / v1", false, [
    "Kozmos Button component set generated from React Button API.",
    "Variant maps to Button.variant.",
    "Size maps to Button.size.",
    "State maps to disabled/isLoading in Code Connect.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureLabelTextProperty(componentSet, "Button", stats);
  configureFocusVisibleProperty(componentSet, stats);
  await configureButtonIconSlot(componentSet, variableByName, stats);
  return stats;
}

async function updateButtonComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsMissing: 0,
    iconSlotsBound: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  const existing = page.findOne((node) => node.name === "Button / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Button / v1 was not found. Run Build Button first.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const textStyle = await ensureButtonLabelTextStyle(fonts, stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Button");
  applyComponentSetDescription(existing, "Button / v1", true, [
    "Kozmos Button component set generated from React Button API.",
    "Variant maps to Button.variant.",
    "Size maps to Button.size.",
    "State maps to disabled/isLoading in Code Connect.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseButtonVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized Button variant "${child.name}".`,
      );
      continue;
    }

    seenKeys[`${props.variant}/${props.size}/${props.state}`] = true;
    await updateButtonVariant(child, {
      variant: props.variant,
      size: props.size,
      state: props.state,
      variableByName,
      fonts,
      textStyle,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const variant of BUTTON_VARIANTS) {
    for (const size of BUTTON_SIZES) {
      for (const state of BUTTON_STATES) {
        const key = `${variant}/${size}/${state}`;
        if (!seenKeys[key]) {
          stats.variantsMissing += 1;
          stats.warnings.push(`Missing Button variant ${key}.`);
        }
      }
    }
  }

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureLabelTextProperty(existing, "Button", stats);
  configureFocusVisibleProperty(existing, stats);
  await configureButtonIconSlot(existing, variableByName, stats);
  await refreshIconButtonSlotsIfPresent(page, variableByName, stats);
  await pruneLegacyGeneratedIconSlotComponents(stats);
  return stats;
}

async function buildIconButtonComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    iconSlotsBound: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  const existing = page.findOne((node) => node.name === "IconButton / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "IconButton / v1 already exists. Use Update IconButton to preserve its node ID.";
    return stats;
  }

  const variableByName = await ensureComponentRuntimeVariables(stats);
  const iconComponent = await resolveDefaultIconSourceComponent(
    variableByName,
    stats,
  );
  await figma.setCurrentPageAsync(page);

  const components = [];
  let index = 0;
  for (const variant of BUTTON_VARIANTS) {
    for (const size of ICON_BUTTON_SIZES) {
      for (const state of BUTTON_STATES) {
        const component = await createIconButtonVariant({
          variant,
          size,
          state,
          variableByName,
          stats,
        });
        component.x = (index % 9) * 120;
        component.y = Math.floor(index / 9) * 88;
        page.appendChild(component);
        components.push(component);
        index += 1;
      }
    }
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "IconButton / v1";
  componentSet.x = 80;
  componentSet.y = 780;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "IconButton");
  applyComponentSetDescription(componentSet, "IconButton / v1", false, [
    "Kozmos IconButton component set generated from React IconButton API.",
    "Variant maps to IconButton.variant.",
    "Size maps to IconButton.size: Default maps to icon, Small maps to sm, Large maps to lg.",
    "State maps to disabled/isLoading in Code Connect.",
    "Icon is an instance-swap slot. Swap with Pointr Icon Library symbols.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  await configureIconButtonSlot(
    componentSet,
    iconComponent,
    variableByName,
    stats,
  );
  configureFocusVisibleProperty(componentSet, stats);
  return stats;
}

async function updateIconButtonComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsMissing: 0,
    iconSlotsBound: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  const existing = page.findOne((node) => node.name === "IconButton / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message =
      "IconButton / v1 was not found. Run Build IconButton first.";
    return stats;
  }

  const variableByName = await ensureComponentRuntimeVariables(stats);
  const iconComponent = await resolveDefaultIconSourceComponent(
    variableByName,
    stats,
  );
  await figma.setCurrentPageAsync(page);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "IconButton");
  applyComponentSetDescription(existing, "IconButton / v1", true, [
    "Kozmos IconButton component set generated from React IconButton API.",
    "Variant maps to IconButton.variant.",
    "Size maps to IconButton.size: Default maps to icon, Small maps to sm, Large maps to lg.",
    "State maps to disabled/isLoading in Code Connect.",
    "Icon is an instance-swap slot. Swap with Pointr Icon Library symbols.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseIconButtonVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized IconButton variant "${child.name}".`,
      );
      continue;
    }

    seenKeys[`${props.variant}/${props.size}/${props.state}`] = true;
    await updateIconButtonVariant(child, {
      variant: props.variant,
      size: props.size,
      state: props.state,
      variableByName,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const variant of BUTTON_VARIANTS) {
    for (const size of ICON_BUTTON_SIZES) {
      for (const state of BUTTON_STATES) {
        const key = `${variant}/${size}/${state}`;
        if (!seenKeys[key]) {
          stats.variantsMissing += 1;
          stats.warnings.push(`Missing IconButton variant ${key}.`);
        }
      }
    }
  }

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  await configureIconButtonSlot(existing, iconComponent, variableByName, stats);
  configureFocusVisibleProperty(existing, stats);
  await refreshButtonSlotsIfPresent(page, variableByName, stats);
  await pruneLegacyGeneratedIconSlotComponents(stats);
  return stats;
}

async function buildTextComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Text", stats);

  const existing = page.findOne((node) => node.name === "Text / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Text / v1 already exists. Use Update Text to preserve its node ID.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const components = [];

  for (const combination of textVariantCombinations()) {
    const component = await createTextVariant({
      size: combination.size,
      weight: combination.weight,
      tone: combination.tone,
      variableByName,
      fonts,
      stats,
    });
    page.appendChild(component);
    components.push(component);
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Text / v1";
  componentSet.x = 80;
  componentSet.y = 7600;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Text");
  applyComponentSetDescription(componentSet, "Text / v1", false, [
    "Kozmos Text component set generated from React Text API.",
    "Size maps to Text.size.",
    "Weight maps to Text.weight.",
    "Tone maps to Text.color in Code Connect.",
    "Text maps to children in Code Connect.",
  ]);
  clearComponentSetContainerFill(componentSet);
  layoutTextVariants(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureTextProperties(componentSet, stats);
  return stats;
}

async function updateTextComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsCreated: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Text", stats);

  const existing = page.findOne((node) => node.name === "Text / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Text / v1 was not found. Run Build Text first.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Text");
  applyComponentSetDescription(existing, "Text / v1", true, [
    "Kozmos Text component set generated from React Text API.",
    "Size maps to Text.size.",
    "Weight maps to Text.weight.",
    "Tone maps to Text.color in Code Connect.",
    "Text maps to children in Code Connect.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseTextVariantName(child.name);
    if (!props) {
      stats.warnings.push(`Skipped unrecognized Text variant "${child.name}".`);
      continue;
    }

    seenKeys[textVariantKey(props)] = true;
    await updateTextVariant(child, {
      size: props.size,
      weight: props.weight,
      tone: props.tone,
      variableByName,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const combination of textVariantCombinations()) {
    const key = textVariantKey(combination);
    if (seenKeys[key]) continue;

    const component = await createTextVariant({
      size: combination.size,
      weight: combination.weight,
      tone: combination.tone,
      variableByName,
      fonts,
      stats,
    });
    existing.appendChild(component);
    seenKeys[key] = true;
    stats.variantsCreated += 1;
  }

  layoutTextVariants(existing);

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureTextProperties(existing, stats);
  return stats;
}

async function buildHeadingComponent() {
  return buildSingleAxisComponent({
    componentName: "Heading",
    componentSetName: "Heading / v1",
    axisName: "Level",
    values: HEADING_LEVELS,
    x: 80,
    y: 8660,
    xStep: 260,
    createVariant: createHeadingVariant,
    configureProperties: configureHeadingProperties,
    description: [
      "Kozmos Heading component set generated from React Heading API.",
      "Level maps to Heading.level.",
      "Heading Text maps to children in Code Connect.",
      "Heading typography reuses Text scale variables.",
    ],
  });
}

async function updateHeadingComponent() {
  return updateSingleAxisComponent({
    componentName: "Heading",
    componentSetName: "Heading / v1",
    axisName: "Level",
    values: HEADING_LEVELS,
    xStep: 260,
    createVariant: createHeadingVariant,
    updateVariant: updateHeadingVariant,
    parseVariantName: parseHeadingVariantName,
    configureProperties: configureHeadingProperties,
    description: [
      "Kozmos Heading component set generated from React Heading API.",
      "Level maps to Heading.level.",
      "Heading Text maps to children in Code Connect.",
      "Heading typography reuses Text scale variables.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildLinkComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Link", stats);

  const existing = page.findOne((node) => node.name === "Link / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Link / v1 already exists. Use Update Link to preserve its node ID.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const components = [];

  let index = 0;
  for (const variant of LINK_VARIANTS) {
    for (const state of LINK_STATES) {
      const component = await createLinkVariant({
        variant,
        state,
        variableByName,
        fonts,
        stats,
      });
      component.x = index * 160;
      component.y = 0;
      page.appendChild(component);
      components.push(component);
      index += 1;
    }
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Link / v1";
  componentSet.x = 80;
  componentSet.y = 9100;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Link");
  applyComponentSetDescription(componentSet, "Link / v1", false, [
    "Kozmos Link component set generated from React Link API.",
    "Variant maps to Link.variant.",
    "State provides focus-visible examples.",
    "Link Text maps to children in Code Connect.",
  ]);
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureLinkProperties(componentSet, stats);
  return stats;
}

async function updateLinkComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsMissing: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Link", stats);

  const existing = page.findOne((node) => node.name === "Link / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Link / v1 was not found. Run Build Link first.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Link");
  applyComponentSetDescription(existing, "Link / v1", true, [
    "Kozmos Link component set generated from React Link API.",
    "Variant maps to Link.variant.",
    "State provides focus-visible examples.",
    "Link Text maps to children in Code Connect.",
    "Updated in place to preserve the Code Connect node ID.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseLinkVariantName(child.name);
    if (!props) {
      stats.warnings.push(`Skipped unrecognized Link variant "${child.name}".`);
      continue;
    }

    seenKeys[`${props.variant}/${props.state}`] = true;
    await updateLinkVariant(child, {
      variant: props.variant,
      state: props.state,
      variableByName,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const variant of LINK_VARIANTS) {
    for (const state of LINK_STATES) {
      const key = `${variant}/${state}`;
      if (!seenKeys[key]) {
        stats.variantsMissing += 1;
        stats.warnings.push(`Missing Link variant ${key}.`);
      }
    }
  }

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureLinkProperties(existing, stats);
  return stats;
}

async function buildLabelComponent() {
  return buildSingleAxisComponent({
    componentName: "Label",
    componentSetName: "Label / v1",
    axisName: "State",
    values: LABEL_STATES,
    x: 80,
    y: 9420,
    xStep: 220,
    createVariant: createLabelVariant,
    configureProperties: configureLabelProperties,
    description: [
      "Kozmos Label component set generated from React Label API.",
      "State maps to disabled examples.",
      "Label Text maps to children in Code Connect.",
      "Typography aligns to the shared form label scale.",
    ],
  });
}

async function updateLabelComponent() {
  return updateSingleAxisComponent({
    componentName: "Label",
    componentSetName: "Label / v1",
    axisName: "State",
    values: LABEL_STATES,
    xStep: 220,
    createVariant: createLabelVariant,
    updateVariant: updateLabelVariant,
    parseVariantName: parseLabelVariantName,
    configureProperties: configureLabelProperties,
    description: [
      "Kozmos Label component set generated from React Label API.",
      "State maps to disabled examples.",
      "Label Text maps to children in Code Connect.",
      "Typography aligns to the shared form label scale.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildSeparatorComponent() {
  return buildSingleAxisComponent({
    componentName: "Separator",
    componentSetName: "Separator / v1",
    axisName: "Orientation",
    values: SEPARATOR_ORIENTATIONS,
    x: 80,
    y: 9740,
    xStep: 360,
    createVariant: createSeparatorVariant,
    configureProperties: configureSeparatorProperties,
    description: [
      "Kozmos Separator component set generated from React Separator API.",
      "Orientation maps to Separator.orientation.",
      "Sizing uses component float variables.",
      "Separator is non-interactive and decorative unless product code says otherwise.",
    ],
  });
}

async function updateSeparatorComponent() {
  return updateSingleAxisComponent({
    componentName: "Separator",
    componentSetName: "Separator / v1",
    axisName: "Orientation",
    values: SEPARATOR_ORIENTATIONS,
    xStep: 360,
    createVariant: createSeparatorVariant,
    updateVariant: updateSeparatorVariant,
    parseVariantName: parseSeparatorVariantName,
    configureProperties: configureSeparatorProperties,
    description: [
      "Kozmos Separator component set generated from React Separator API.",
      "Orientation maps to Separator.orientation.",
      "Sizing uses component float variables.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildSkeletonComponent() {
  return buildSingleAxisComponent({
    componentName: "Skeleton",
    componentSetName: "Skeleton / v1",
    axisName: "Shape",
    values: SKELETON_SHAPES,
    x: 80,
    y: 10060,
    xStep: 360,
    createVariant: createSkeletonVariant,
    configureProperties: configureSkeletonProperties,
    description: [
      "Kozmos Skeleton component set generated from React Skeleton API.",
      "Shape maps to common placeholder compositions.",
      "Animation remains a runtime concern.",
      "Sizing uses component float variables.",
    ],
  });
}

async function updateSkeletonComponent() {
  return updateSingleAxisComponent({
    componentName: "Skeleton",
    componentSetName: "Skeleton / v1",
    axisName: "Shape",
    values: SKELETON_SHAPES,
    xStep: 360,
    createVariant: createSkeletonVariant,
    updateVariant: updateSkeletonVariant,
    parseVariantName: parseSkeletonVariantName,
    configureProperties: configureSkeletonProperties,
    description: [
      "Kozmos Skeleton component set generated from React Skeleton API.",
      "Shape maps to common placeholder compositions.",
      "Animation remains a runtime concern.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildBoxComponent() {
  return buildSingleAxisComponent({
    componentName: "Box",
    componentSetName: "Box / v1",
    axisName: "Surface",
    values: BOX_SURFACES,
    x: 80,
    y: 10380,
    xStep: 360,
    createVariant: createBoxVariant,
    configureProperties: configureBoxProperties,
    description: [
      "Kozmos Box component set generated from React Box API.",
      "Surface maps to common composition examples.",
      "Box Text maps to children in Code Connect.",
      "Runtime Box remains a lightweight polymorphic wrapper.",
    ],
  });
}

async function updateBoxComponent() {
  return updateSingleAxisComponent({
    componentName: "Box",
    componentSetName: "Box / v1",
    axisName: "Surface",
    values: BOX_SURFACES,
    xStep: 360,
    createVariant: createBoxVariant,
    updateVariant: updateBoxVariant,
    parseVariantName: parseBoxVariantName,
    configureProperties: configureBoxProperties,
    description: [
      "Kozmos Box component set generated from React Box API.",
      "Surface maps to common composition examples.",
      "Box Text maps to children in Code Connect.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildStackComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Stack", stats);

  const existing = page.findOne((node) => node.name === "Stack / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Stack / v1 already exists. Use Update Stack to preserve its node ID.";
    return stats;
  }

  const variableByName = await ensureComponentRuntimeVariables(stats);
  const components = [];

  for (const combination of stackVariantCombinations()) {
    const component = await createStackVariant({
      direction: combination.direction,
      gap: combination.gap,
      variableByName,
      stats,
    });
    page.appendChild(component);
    components.push(component);
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Stack / v1";
  componentSet.x = 80;
  componentSet.y = 10820;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Stack");
  applyComponentSetDescription(componentSet, "Stack / v1", false, [
    "Kozmos Stack component set generated from React Stack API.",
    "Direction maps to Stack.direction.",
    "Gap maps to Stack.gap.",
    "Alignment, justification, and wrapping remain product-code composition choices.",
  ]);
  clearComponentSetContainerFill(componentSet);
  layoutStackVariants(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureStackProperties(componentSet, stats);
  return stats;
}

async function updateStackComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsCreated: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Stack", stats);

  const existing = page.findOne((node) => node.name === "Stack / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Stack / v1 was not found. Run Build Stack first.";
    return stats;
  }

  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Stack");
  applyComponentSetDescription(existing, "Stack / v1", true, [
    "Kozmos Stack component set generated from React Stack API.",
    "Direction maps to Stack.direction.",
    "Gap maps to Stack.gap.",
    "Updated in place to preserve the Code Connect node ID.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseStackVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized Stack variant "${child.name}".`,
      );
      continue;
    }

    seenKeys[stackVariantKey(props)] = true;
    await updateStackVariant(child, {
      direction: props.direction,
      gap: props.gap,
      variableByName,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const combination of stackVariantCombinations()) {
    const key = stackVariantKey(combination);
    if (seenKeys[key]) continue;

    const component = await createStackVariant({
      direction: combination.direction,
      gap: combination.gap,
      variableByName,
      stats,
    });
    existing.appendChild(component);
    seenKeys[key] = true;
    stats.variantsCreated += 1;
  }

  layoutStackVariants(existing);

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureStackProperties(existing, stats);
  return stats;
}

async function buildContainerComponent() {
  return buildSingleAxisComponent({
    componentName: "Container",
    componentSetName: "Container / v1",
    axisName: "Centered",
    values: CONTAINER_CENTERED,
    x: 80,
    y: 11380,
    xStep: 560,
    createVariant: createContainerVariant,
    configureProperties: configureContainerProperties,
    description: [
      "Kozmos Container component set generated from React Container API.",
      "Centered maps to Container.centered.",
      "Container Text maps to children in Code Connect.",
      "Responsive padding and max-width behavior remain runtime CSS concerns.",
    ],
  });
}

async function updateContainerComponent() {
  return updateSingleAxisComponent({
    componentName: "Container",
    componentSetName: "Container / v1",
    axisName: "Centered",
    values: CONTAINER_CENTERED,
    xStep: 560,
    createVariant: createContainerVariant,
    updateVariant: updateContainerVariant,
    parseVariantName: parseContainerVariantName,
    configureProperties: configureContainerProperties,
    description: [
      "Kozmos Container component set generated from React Container API.",
      "Centered maps to Container.centered.",
      "Container Text maps to children in Code Connect.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildCounterComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Counter", stats);

  const existing = page.findOne((node) => node.name === "Counter / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Counter / v1 already exists. Use Update Counter to preserve its node ID.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const components = [];

  let index = 0;
  for (const tone of COUNTER_TONES) {
    for (const size of COUNTER_SIZES) {
      const component = await createCounterVariant({
        tone,
        size,
        variableByName,
        fonts,
        stats,
      });
      component.x = (index % 4) * 112;
      component.y = Math.floor(index / 4) * 72;
      page.appendChild(component);
      components.push(component);
      index += 1;
    }
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Counter / v1";
  componentSet.x = 80;
  componentSet.y = 1280;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Counter");
  applyComponentSetDescription(componentSet, "Counter / v1", false, [
    "Kozmos Counter component set generated from React Counter API.",
    "Tone maps to Counter.tone.",
    "Size maps to Counter.size.",
    "Counter Text maps to Counter children in Code Connect.",
    "Badge composes Counter as a hidden nested instance for opt-in count display.",
  ]);
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Counter Text",
    "Counter Text",
    "2",
    stats,
  );
  return stats;
}

async function updateCounterComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsMissing: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Counter", stats);

  const existing = page.findOne((node) => node.name === "Counter / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Counter / v1 was not found. Run Build Counter first.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Counter");
  applyComponentSetDescription(existing, "Counter / v1", true, [
    "Kozmos Counter component set generated from React Counter API.",
    "Tone maps to Counter.tone.",
    "Size maps to Counter.size.",
    "Counter Text maps to Counter children in Code Connect.",
    "Badge composes Counter as a hidden nested instance for opt-in count display.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseCounterVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized Counter variant "${child.name}".`,
      );
      continue;
    }

    seenKeys[`${props.tone}/${props.size}`] = true;
    await updateCounterVariant(child, {
      tone: props.tone,
      size: props.size,
      variableByName,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const tone of COUNTER_TONES) {
    for (const size of COUNTER_SIZES) {
      const key = `${tone}/${size}`;
      if (!seenKeys[key]) {
        stats.variantsMissing += 1;
        stats.warnings.push(`Missing Counter variant ${key}.`);
      }
    }
  }

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureNamedTextProperty(
    existing,
    "Counter Text",
    "Counter Text",
    "2",
    stats,
  );
  return stats;
}

async function buildBadgeComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Badge", stats);

  const existing = page.findOne((node) => node.name === "Badge / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Badge / v1 already exists. Use Update Badge to preserve its node ID.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  await ensureCounterComponentForBadge(stats);
  const iconComponent = await resolveDefaultIconSourceComponent(
    variableByName,
    stats,
  );
  const components = [];

  let index = 0;
  for (const variant of BADGE_VARIANTS) {
    for (const size of BADGE_SIZES) {
      const component = await createBadgeVariant({
        variant,
        size,
        variableByName,
        iconComponent,
        fonts,
        stats,
      });
      component.x = (index % 8) * 148;
      component.y = Math.floor(index / 8) * 88;
      page.appendChild(component);
      components.push(component);
      index += 1;
    }
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Badge / v1";
  componentSet.x = 80;
  componentSet.y = 1440;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Badge");
  applyComponentSetDescription(componentSet, "Badge / v1", false, [
    "Kozmos Badge component set generated from React Badge API.",
    "Variant maps to Badge.variant.",
    "Size maps to Badge.size.",
    "Label Text maps to Badge children in Code Connect.",
    "Icon maps to Badge.icon for icon-sized badges.",
    "Show Counter toggles a hidden nested Counter / v1 instance for opt-in count display.",
    "Counter text is edited on the exposed nested Counter instance.",
    "Badge is non-interactive by default; React includes focus-visible classes for composed interactive usage.",
  ]);
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureLabelTextProperty(componentSet, "Badge", stats);
  deleteComponentPropertiesByBaseName(
    componentSet,
    ["Counter Text"],
    ["TEXT"],
    stats,
  );
  configureBadgeCounterVisibilityProperty(componentSet, stats);
  await configureBadgeIconSlot(
    componentSet,
    iconComponent,
    variableByName,
    stats,
  );
  return stats;
}

async function updateBadgeComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsMissing: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Badge", stats);

  const existing = page.findOne((node) => node.name === "Badge / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Badge / v1 was not found. Run Build Badge first.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  await ensureCounterComponentForBadge(stats);
  const iconComponent = await resolveDefaultIconSourceComponent(
    variableByName,
    stats,
  );
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Badge");
  applyComponentSetDescription(existing, "Badge / v1", true, [
    "Kozmos Badge component set generated from React Badge API.",
    "Variant maps to Badge.variant.",
    "Size maps to Badge.size.",
    "Label Text maps to Badge children in Code Connect.",
    "Icon maps to Badge.icon for icon-sized badges.",
    "Show Counter toggles a hidden nested Counter / v1 instance for opt-in count display.",
    "Counter text is edited on the exposed nested Counter instance.",
    "Badge is non-interactive by default; React includes focus-visible classes for composed interactive usage.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseBadgeVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized Badge variant "${child.name}".`,
      );
      continue;
    }

    seenKeys[`${props.variant}/${props.size}`] = true;
    await updateBadgeVariant(child, {
      variant: props.variant,
      size: props.size,
      variableByName,
      iconComponent,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const variant of BADGE_VARIANTS) {
    for (const size of BADGE_SIZES) {
      const key = `${variant}/${size}`;
      if (!seenKeys[key]) {
        stats.variantsMissing += 1;
        stats.warnings.push(`Missing Badge variant ${key}.`);
      }
    }
  }

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureLabelTextProperty(existing, "Badge", stats);
  deleteComponentPropertiesByBaseName(
    existing,
    ["Counter Text"],
    ["TEXT"],
    stats,
  );
  configureBadgeCounterVisibilityProperty(existing, stats);
  await configureBadgeIconSlot(existing, iconComponent, variableByName, stats);
  return stats;
}

async function ensureCounterComponentForBadge(stats) {
  const existing = await findLocalComponentSetByName("Counter / v1");
  if (existing) return existing;

  const result = await buildCounterComponent();
  if (result.warnings) {
    for (const warning of result.warnings) {
      stats.warnings.push(`Counter / v1: ${warning}`);
    }
  }

  const created = await findLocalComponentSetByName("Counter / v1");
  if (!created) {
    stats.warnings.push(
      "Counter / v1 is missing; Badge counters will use placeholder nodes until Counter is built.",
    );
  } else {
    stats.counterComponentCreated = true;
  }

  return created;
}

async function buildCardComponent() {
  return buildSingleAxisComponent({
    componentName: "Card",
    componentSetName: "Card / v1",
    axisName: "Content",
    values: CARD_CONTENT,
    x: 80,
    y: 4300,
    xStep: 420,
    createVariant: createCardVariant,
    configureProperties: configureCardProperties,
    description: [
      "Kozmos Card component set generated from React Card API.",
      "Content maps to composed Card anatomy in Code Connect.",
      "Title Text maps to CardTitle children.",
      "Description Text maps to CardDescription children.",
      "Body Text maps to CardContent children.",
    ],
  });
}

async function updateCardComponent() {
  return updateSingleAxisComponent({
    componentName: "Card",
    componentSetName: "Card / v1",
    axisName: "Content",
    values: CARD_CONTENT,
    xStep: 420,
    createVariant: createCardVariant,
    updateVariant: updateCardVariant,
    parseVariantName: parseCardVariantName,
    configureProperties: configureCardProperties,
    description: [
      "Kozmos Card component set generated from React Card API.",
      "Content maps to composed Card anatomy in Code Connect.",
      "Title Text maps to CardTitle children.",
      "Description Text maps to CardDescription children.",
      "Body Text maps to CardContent children.",
      "Full cards compose live Button instances for footer actions.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildTabsComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Tabs", stats);

  const existing = page.findOne((node) => node.name === "Tabs / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Tabs / v1 already exists. Use Update Tabs to preserve its node ID.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const combinations = tabsVariantCombinations();
  const components = [];

  for (const combination of combinations) {
    const component = await createTabsVariant({
      count: combination.count,
      active: combination.active,
      state: combination.state,
      variableByName,
      fonts,
      stats,
    });
    page.appendChild(component);
    components.push(component);
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Tabs / v1";
  componentSet.x = 80;
  componentSet.y = 4620;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Tabs");
  applyComponentSetDescription(componentSet, "Tabs / v1", false, [
    "Kozmos Tabs component set generated from React Tabs API.",
    "Count maps to the number of TabsTrigger examples.",
    "Active maps to Tabs.defaultValue.",
    "State maps to disabled and focus examples.",
    "Tab text properties map to TabsTrigger children.",
  ]);
  clearComponentSetContainerFill(componentSet);
  layoutTabsVariants(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureTabsProperties(componentSet, stats);
  return stats;
}

async function updateTabsComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsMissing: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Tabs", stats);

  const existing = page.findOne((node) => node.name === "Tabs / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Tabs / v1 was not found. Run Build Tabs first.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Tabs");
  applyComponentSetDescription(existing, "Tabs / v1", true, [
    "Kozmos Tabs component set generated from React Tabs API.",
    "Count maps to the number of TabsTrigger examples.",
    "Active maps to Tabs.defaultValue.",
    "State maps to disabled and focus examples.",
    "Tab text properties map to TabsTrigger children.",
    "Updated in place to preserve the Code Connect node ID.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseTabsVariantName(child.name);
    if (!props) {
      stats.warnings.push(`Skipped unrecognized Tabs variant "${child.name}".`);
      continue;
    }

    seenKeys[`${props.count}/${props.active}/${props.state}`] = true;
    await updateTabsVariant(child, {
      count: props.count,
      active: props.active,
      state: props.state,
      variableByName,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const combination of tabsVariantCombinations()) {
    const key = `${combination.count}/${combination.active}/${combination.state}`;
    if (!seenKeys[key]) {
      stats.variantsMissing += 1;
      stats.warnings.push(`Missing Tabs variant ${key}.`);
    }
  }

  layoutTabsVariants(existing);
  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureTabsProperties(existing, stats);
  return stats;
}

async function buildTooltipComponent() {
  return buildSingleAxisComponent({
    componentName: "Tooltip",
    componentSetName: "Tooltip / v1",
    axisName: "Side",
    values: TOOLTIP_SIDES,
    x: 80,
    y: 5360,
    xStep: 220,
    createVariant: createTooltipVariant,
    configureProperties: configureTooltipProperties,
    description: [
      "Kozmos Tooltip component set generated from React TooltipContent API.",
      "Side maps to TooltipContent.side.",
      "Content Text maps to TooltipContent children.",
      "Tip renders on the side facing the trigger.",
      "TooltipProvider and TooltipTrigger remain composition concerns in product code.",
    ],
  });
}

async function updateTooltipComponent() {
  return updateSingleAxisComponent({
    componentName: "Tooltip",
    componentSetName: "Tooltip / v1",
    axisName: "Side",
    values: TOOLTIP_SIDES,
    xStep: 220,
    createVariant: createTooltipVariant,
    updateVariant: updateTooltipVariant,
    parseVariantName: parseTooltipVariantName,
    configureProperties: configureTooltipProperties,
    description: [
      "Kozmos Tooltip component set generated from React TooltipContent API.",
      "Side maps to TooltipContent.side.",
      "Content Text maps to TooltipContent children.",
      "Tip renders on the side facing the trigger.",
      "TooltipProvider and TooltipTrigger remain composition concerns in product code.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildDialogComponent() {
  return buildSingleAxisComponent({
    componentName: "Dialog",
    componentSetName: "Dialog / v1",
    axisName: "Content",
    values: DIALOG_CONTENT,
    x: 80,
    y: 5600,
    xStep: 560,
    createVariant: createDialogVariant,
    configureProperties: configureDialogProperties,
    description: [
      "Kozmos Dialog component set generated from React DialogContent API.",
      "Content maps to composed DialogContent anatomy.",
      "Title Text maps to DialogTitle children.",
      "Description Text maps to DialogDescription children.",
      "Form content composes live Input instances.",
      "Footer actions compose live Button instances.",
    ],
  });
}

async function updateDialogComponent() {
  return updateSingleAxisComponent({
    componentName: "Dialog",
    componentSetName: "Dialog / v1",
    axisName: "Content",
    values: DIALOG_CONTENT,
    xStep: 560,
    createVariant: createDialogVariant,
    updateVariant: updateDialogVariant,
    parseVariantName: parseDialogVariantName,
    configureProperties: configureDialogProperties,
    description: [
      "Kozmos Dialog component set generated from React DialogContent API.",
      "Content maps to composed DialogContent anatomy.",
      "Title Text maps to DialogTitle children.",
      "Description Text maps to DialogDescription children.",
      "Form content composes live Input instances.",
      "Footer actions compose live Button instances.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildPopoverComponent() {
  return buildSingleAxisComponent({
    componentName: "Popover",
    componentSetName: "Popover / v1",
    axisName: "Side",
    values: POPOVER_SIDES,
    x: 80,
    y: 5960,
    xStep: 340,
    createVariant: createPopoverVariant,
    configureProperties: configurePopoverProperties,
    description: [
      "Kozmos Popover component set generated from React PopoverContent API.",
      "Side maps to PopoverContent.side.",
      "Title Text and Description Text map to composed children.",
      "Side Offset follows the shared 4px overlay offset contract.",
    ],
  });
}

async function updatePopoverComponent() {
  return updateSingleAxisComponent({
    componentName: "Popover",
    componentSetName: "Popover / v1",
    axisName: "Side",
    values: POPOVER_SIDES,
    xStep: 340,
    createVariant: createPopoverVariant,
    updateVariant: updatePopoverVariant,
    parseVariantName: parsePopoverVariantName,
    configureProperties: configurePopoverProperties,
    description: [
      "Kozmos Popover component set generated from React PopoverContent API.",
      "Side maps to PopoverContent.side.",
      "Title Text and Description Text map to composed children.",
      "Side Offset follows the shared 4px overlay offset contract.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildMenuComponent() {
  return buildSingleAxisComponent({
    componentName: "Menu",
    componentSetName: "Menu / v1",
    axisName: "Content",
    values: MENU_CONTENT,
    x: 80,
    y: 6200,
    xStep: 240,
    createVariant: createMenuVariant,
    configureProperties: configureMenuProperties,
    description: [
      "Kozmos Menu component set generated from React MenuContent API.",
      "Content maps to composed MenuContent examples.",
      "Label Text maps to MenuLabel children.",
      "Item text properties map to Menu item children.",
    ],
  });
}

async function updateMenuComponent() {
  return updateSingleAxisComponent({
    componentName: "Menu",
    componentSetName: "Menu / v1",
    axisName: "Content",
    values: MENU_CONTENT,
    xStep: 240,
    createVariant: createMenuVariant,
    updateVariant: updateMenuVariant,
    parseVariantName: parseMenuVariantName,
    configureProperties: configureMenuProperties,
    description: [
      "Kozmos Menu component set generated from React MenuContent API.",
      "Content maps to composed MenuContent examples.",
      "Label Text maps to MenuLabel children.",
      "Item text properties map to Menu item children.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildCheckboxComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Checkbox", stats);

  const existing = page.findOne((node) => node.name === "Checkbox / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Checkbox / v1 already exists. Use Update Checkbox to preserve its node ID.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const components = [];

  let index = 0;
  for (const checked of CHECKBOX_CHECKED) {
    for (const state of CHECKBOX_STATES) {
      const component = await createCheckboxVariant({
        checked,
        state,
        variableByName,
        fonts,
        stats,
      });
      component.x = (index % 3) * 220;
      component.y = Math.floor(index / 3) * 88;
      page.appendChild(component);
      components.push(component);
      index += 1;
    }
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Checkbox / v1";
  componentSet.x = 80;
  componentSet.y = 1740;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Checkbox");
  applyComponentSetDescription(componentSet, "Checkbox / v1", false, [
    "Kozmos Checkbox component set generated from React Checkbox API.",
    "Checked maps to Checkbox.checked.",
    "State maps to disabled/error props in Code Connect.",
    "Label Text maps to Checkbox.label.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureLabelTextProperty(componentSet, "Checkbox", stats);
  configureFocusVisibleProperty(componentSet, stats);
  return stats;
}

async function updateCheckboxComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsMissing: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Checkbox", stats);

  const existing = page.findOne((node) => node.name === "Checkbox / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Checkbox / v1 was not found. Run Build Checkbox first.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Checkbox");
  applyComponentSetDescription(existing, "Checkbox / v1", true, [
    "Kozmos Checkbox component set generated from React Checkbox API.",
    "Checked maps to Checkbox.checked.",
    "State maps to disabled/error props in Code Connect.",
    "Label Text maps to Checkbox.label.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseCheckboxVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized Checkbox variant "${child.name}".`,
      );
      continue;
    }

    seenKeys[`${props.checked}/${props.state}`] = true;
    await updateCheckboxVariant(child, {
      checked: props.checked,
      state: props.state,
      variableByName,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const checked of CHECKBOX_CHECKED) {
    for (const state of CHECKBOX_STATES) {
      const key = `${checked}/${state}`;
      if (!seenKeys[key]) {
        stats.variantsMissing += 1;
        stats.warnings.push(`Missing Checkbox variant ${key}.`);
      }
    }
  }

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureLabelTextProperty(existing, "Checkbox", stats);
  configureFocusVisibleProperty(existing, stats);
  return stats;
}

async function buildRadioComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Radio", stats);

  const existing = page.findOne((node) => node.name === "Radio / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Radio / v1 already exists. Use Update Radio to preserve its node ID.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const components = [];

  let index = 0;
  for (const checked of RADIO_CHECKED) {
    for (const state of RADIO_STATES) {
      const component = await createRadioVariant({
        checked,
        state,
        variableByName,
        fonts,
        stats,
      });
      component.x = (index % 3) * 220;
      component.y = Math.floor(index / 3) * 88;
      page.appendChild(component);
      components.push(component);
      index += 1;
    }
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Radio / v1";
  componentSet.x = 80;
  componentSet.y = 1900;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Radio");
  applyComponentSetDescription(componentSet, "Radio / v1", false, [
    "Kozmos Radio component set generated from React RadioGroupItem API.",
    "Checked maps to whether RadioGroup.defaultValue matches RadioGroupItem.value.",
    "State maps to disabled/error props in Code Connect.",
    "Label Text maps to RadioGroupItem.label.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureLabelTextProperty(componentSet, "Radio", stats);
  configureFocusVisibleProperty(componentSet, stats);
  return stats;
}

async function updateRadioComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsMissing: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Radio", stats);

  const existing = page.findOne((node) => node.name === "Radio / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Radio / v1 was not found. Run Build Radio first.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Radio");
  applyComponentSetDescription(existing, "Radio / v1", true, [
    "Kozmos Radio component set generated from React RadioGroupItem API.",
    "Checked maps to whether RadioGroup.defaultValue matches RadioGroupItem.value.",
    "State maps to disabled/error props in Code Connect.",
    "Label Text maps to RadioGroupItem.label.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseRadioVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized Radio variant "${child.name}".`,
      );
      continue;
    }

    seenKeys[`${props.checked}/${props.state}`] = true;
    await updateRadioVariant(child, {
      checked: props.checked,
      state: props.state,
      variableByName,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const checked of RADIO_CHECKED) {
    for (const state of RADIO_STATES) {
      const key = `${checked}/${state}`;
      if (!seenKeys[key]) {
        stats.variantsMissing += 1;
        stats.warnings.push(`Missing Radio variant ${key}.`);
      }
    }
  }

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureLabelTextProperty(existing, "Radio", stats);
  configureFocusVisibleProperty(existing, stats);
  return stats;
}

async function buildSwitchComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Switch", stats);

  const existing = page.findOne((node) => node.name === "Switch / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Switch / v1 already exists. Use Update Switch to preserve its node ID.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const components = [];

  let index = 0;
  for (const checked of SWITCH_CHECKED) {
    for (const state of SWITCH_STATES) {
      const component = await createSwitchVariant({
        checked,
        state,
        variableByName,
        fonts,
        stats,
      });
      component.x = (index % 3) * 220;
      component.y = Math.floor(index / 3) * 88;
      page.appendChild(component);
      components.push(component);
      index += 1;
    }
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Switch / v1";
  componentSet.x = 80;
  componentSet.y = 2060;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Switch");
  applyComponentSetDescription(componentSet, "Switch / v1", false, [
    "Kozmos Switch component set generated from React Switch API.",
    "Checked maps to Switch.checked.",
    "State maps to disabled/error props in Code Connect.",
    "Label Text maps to Switch.label.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureLabelTextProperty(componentSet, "Switch", stats);
  configureFocusVisibleProperty(componentSet, stats);
  return stats;
}

async function updateSwitchComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsMissing: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Switch", stats);

  const existing = page.findOne((node) => node.name === "Switch / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Switch / v1 was not found. Run Build Switch first.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Switch");
  applyComponentSetDescription(existing, "Switch / v1", true, [
    "Kozmos Switch component set generated from React Switch API.",
    "Checked maps to Switch.checked.",
    "State maps to disabled/error props in Code Connect.",
    "Label Text maps to Switch.label.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseSwitchVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized Switch variant "${child.name}".`,
      );
      continue;
    }

    seenKeys[`${props.checked}/${props.state}`] = true;
    await updateSwitchVariant(child, {
      checked: props.checked,
      state: props.state,
      variableByName,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const checked of SWITCH_CHECKED) {
    for (const state of SWITCH_STATES) {
      const key = `${checked}/${state}`;
      if (!seenKeys[key]) {
        stats.variantsMissing += 1;
        stats.warnings.push(`Missing Switch variant ${key}.`);
      }
    }
  }

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureLabelTextProperty(existing, "Switch", stats);
  configureFocusVisibleProperty(existing, stats);
  return stats;
}

async function buildInputComponent() {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Input", stats);

  const existing = page.findOne((node) => node.name === "Input / v1");
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message =
      "Input / v1 already exists. Use Update Input to preserve its node ID.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const components = [];

  for (let stateIndex = 0; stateIndex < INPUT_STATES.length; stateIndex += 1) {
    const state = INPUT_STATES[stateIndex];
    for (
      let statusIndex = 0;
      statusIndex < INPUT_STATUSES.length;
      statusIndex += 1
    ) {
      const status = INPUT_STATUSES[statusIndex];
      const component = await createInputVariant({
        state,
        status,
        variableByName,
        fonts,
        stats,
      });
      component.x = statusIndex * 360;
      component.y = stateIndex * 126;
      page.appendChild(component);
      components.push(component);
    }
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Input / v1";
  componentSet.x = 80;
  componentSet.y = 2220;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(RUN_NAMESPACE, "component", "Input");
  applyComponentSetDescription(componentSet, "Input / v1", false, [
    "Kozmos Input component set generated from React Input API.",
    "State maps to focus, disabled, and readOnly props in Code Connect.",
    "Status maps to validation tone: default, error, warning, and success.",
    "Label Text maps to Input.label.",
    "Placeholder Text maps to Input.placeholder.",
    "Helper Text maps to Input.helperText.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  configureLabelTextProperty(componentSet, "Input", stats);
  configurePlaceholderTextProperty(componentSet, "Placeholder", stats);
  configureHelperTextProperty(componentSet, "Helper text", stats);
  configureHelperVisibilityProperty(componentSet, stats);
  configureFocusVisibleProperty(componentSet, stats);
  return stats;
}

async function updateInputComponent() {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsCreated: 0,
    variantsMissing: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, "Input", stats);

  const existing = page.findOne((node) => node.name === "Input / v1");
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = "Input / v1 was not found. Run Build Input first.";
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(RUN_NAMESPACE, "component", "Input");
  applyComponentSetDescription(existing, "Input / v1", true, [
    "Kozmos Input component set generated from React Input API.",
    "State maps to focus, disabled, and readOnly props in Code Connect.",
    "Status maps to validation tone: default, error, warning, and success.",
    "Label Text maps to Input.label.",
    "Placeholder Text maps to Input.placeholder.",
    "Helper Text maps to Input.helperText.",
    "Focus follows the React focus-visible ring; documented in metadata for v1.",
  ]);
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseInputVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized Input variant "${child.name}".`,
      );
      continue;
    }

    seenKeys[`${props.state}/${props.status}`] = true;
    await updateInputVariant(child, {
      state: props.state,
      status: props.status,
      variableByName,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const state of INPUT_STATES) {
    for (const status of INPUT_STATUSES) {
      const key = `${state}/${status}`;
      if (seenKeys[key]) continue;

      const component = await createInputVariant({
        state,
        status,
        variableByName,
        fonts,
        stats,
      });
      existing.appendChild(component);
      seenKeys[key] = true;
      stats.variantsCreated += 1;
    }
  }

  layoutInputVariants(existing);

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  configureLabelTextProperty(existing, "Input", stats);
  configurePlaceholderTextProperty(existing, "Placeholder", stats);
  configureHelperTextProperty(existing, "Helper text", stats);
  configureHelperVisibilityProperty(existing, stats);
  configureFocusVisibleProperty(existing, stats);
  return stats;
}

async function rebuildTextComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Text",
    componentSetName: "Text / v1",
    build: buildTextComponent,
  });
}

async function rebuildHeadingComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Heading",
    componentSetName: "Heading / v1",
    build: buildHeadingComponent,
  });
}

async function rebuildLinkComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Link",
    componentSetName: "Link / v1",
    build: buildLinkComponent,
  });
}

async function rebuildLabelComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Label",
    componentSetName: "Label / v1",
    build: buildLabelComponent,
  });
}

async function rebuildSeparatorComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Separator",
    componentSetName: "Separator / v1",
    build: buildSeparatorComponent,
  });
}

async function rebuildSkeletonComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Skeleton",
    componentSetName: "Skeleton / v1",
    build: buildSkeletonComponent,
  });
}

async function rebuildBoxComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Box",
    componentSetName: "Box / v1",
    build: buildBoxComponent,
  });
}

async function rebuildStackComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Stack",
    componentSetName: "Stack / v1",
    build: buildStackComponent,
  });
}

async function rebuildContainerComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Container",
    componentSetName: "Container / v1",
    build: buildContainerComponent,
  });
}

async function rebuildButtonComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Button",
    componentSetName: "Button / v1",
    build: buildButtonComponent,
  });
}

async function rebuildIconButtonComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "IconButton",
    componentSetName: "IconButton / v1",
    build: buildIconButtonComponent,
  });
}

async function rebuildCounterComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Counter",
    componentSetName: "Counter / v1",
    build: buildCounterComponent,
  });
}

async function rebuildBadgeComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Badge",
    componentSetName: "Badge / v1",
    build: buildBadgeComponent,
  });
}

async function rebuildCheckboxComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Checkbox",
    componentSetName: "Checkbox / v1",
    build: buildCheckboxComponent,
  });
}

async function rebuildRadioComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Radio",
    componentSetName: "Radio / v1",
    build: buildRadioComponent,
  });
}

async function rebuildSwitchComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Switch",
    componentSetName: "Switch / v1",
    build: buildSwitchComponent,
  });
}

async function rebuildInputComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Input",
    componentSetName: "Input / v1",
    build: buildInputComponent,
  });
}

async function buildTextareaComponent() {
  return buildStateStatusComponent({
    componentName: "Textarea",
    componentSetName: "Textarea / v1",
    states: TEXTAREA_STATES,
    statuses: TEXTAREA_STATUSES,
    x: 1520,
    y: 2220,
    xStep: 360,
    yStep: 160,
    createVariant: createTextareaVariant,
    configureProperties: configureTextareaProperties,
    description: [
      "Kozmos Textarea component set generated from React Textarea API.",
      "State maps to focus, disabled, and readOnly props in Code Connect.",
      "Status maps to Textarea.error in Code Connect.",
      "Label Text maps to Textarea.label.",
      "Placeholder Text maps to Textarea.placeholder.",
      "Focus follows the React focus-visible ring; documented in metadata for v1.",
    ],
  });
}

async function updateTextareaComponent() {
  return updateStateStatusComponent({
    componentName: "Textarea",
    componentSetName: "Textarea / v1",
    states: TEXTAREA_STATES,
    statuses: TEXTAREA_STATUSES,
    xStep: 360,
    yStep: 160,
    createVariant: createTextareaVariant,
    updateVariant: updateTextareaVariant,
    parseVariantName: parseTextareaVariantName,
    configureProperties: configureTextareaProperties,
    description: [
      "Kozmos Textarea component set generated from React Textarea API.",
      "State maps to focus, disabled, and readOnly props in Code Connect.",
      "Status maps to Textarea.error in Code Connect.",
      "Label Text maps to Textarea.label.",
      "Placeholder Text maps to Textarea.placeholder.",
      "Focus follows the React focus-visible ring; documented in metadata for v1.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildSearchComponent() {
  return buildStateStatusComponent({
    componentName: "Search",
    componentSetName: "Search / v1",
    states: SEARCH_STATES,
    statuses: SEARCH_STATUSES,
    x: 80,
    y: 2740,
    xStep: 360,
    yStep: 126,
    createVariant: createSearchVariant,
    configureProperties: configureSearchProperties,
    description: [
      "Kozmos Search component set generated from React Search API.",
      "State maps to focus, disabled, and readOnly props in Code Connect.",
      "Status maps to Search.error in Code Connect.",
      "Label Text maps to Search.label.",
      "Placeholder Text maps to Search.placeholder.",
      "Focus follows the React focus-visible ring; documented in metadata for v1.",
    ],
  });
}

async function updateSearchComponent() {
  return updateStateStatusComponent({
    componentName: "Search",
    componentSetName: "Search / v1",
    states: SEARCH_STATES,
    statuses: SEARCH_STATUSES,
    xStep: 360,
    yStep: 126,
    createVariant: createSearchVariant,
    updateVariant: updateSearchVariant,
    parseVariantName: parseSearchVariantName,
    configureProperties: configureSearchProperties,
    description: [
      "Kozmos Search component set generated from React Search API.",
      "State maps to focus, disabled, and readOnly props in Code Connect.",
      "Status maps to Search.error in Code Connect.",
      "Label Text maps to Search.label.",
      "Placeholder Text maps to Search.placeholder.",
      "Focus follows the React focus-visible ring; documented in metadata for v1.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildSelectComponent() {
  return buildStateStatusComponent({
    componentName: "Select",
    componentSetName: "Select / v1",
    states: SELECT_STATES,
    statuses: SELECT_STATUSES,
    x: 80,
    y: 3280,
    xStep: 360,
    yStep: 96,
    createVariant: createSelectVariant,
    configureProperties: configureSelectProperties,
    description: [
      "Kozmos SelectTrigger component set generated from React Select API.",
      "State maps to focus and disabled props in Code Connect.",
      "Status maps to SelectTrigger.error in Code Connect.",
      "Placeholder Text maps to SelectValue.placeholder.",
      "Focus follows the React focus-visible ring; documented in metadata for v1.",
    ],
  });
}

async function updateSelectComponent() {
  return updateStateStatusComponent({
    componentName: "Select",
    componentSetName: "Select / v1",
    states: SELECT_STATES,
    statuses: SELECT_STATUSES,
    xStep: 360,
    yStep: 96,
    createVariant: createSelectVariant,
    updateVariant: updateSelectVariant,
    parseVariantName: parseSelectVariantName,
    configureProperties: configureSelectProperties,
    description: [
      "Kozmos SelectTrigger component set generated from React Select API.",
      "State maps to focus and disabled props in Code Connect.",
      "Status maps to SelectTrigger.error in Code Connect.",
      "Placeholder Text maps to SelectValue.placeholder.",
      "Focus follows the React focus-visible ring; documented in metadata for v1.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildSliderComponent() {
  return buildStateStatusComponent({
    componentName: "Slider",
    componentSetName: "Slider / v1",
    states: SLIDER_STATES,
    statuses: SLIDER_STATUSES,
    x: 1160,
    y: 3280,
    xStep: 360,
    yStep: 112,
    createVariant: createSliderVariant,
    configureProperties: configureSliderProperties,
    description: [
      "Kozmos Slider component set generated from React Slider API.",
      "State maps to focus and disabled props in Code Connect.",
      "Status maps to Slider.error in Code Connect.",
      "Label Text maps to Slider.label.",
      "Focus follows the React focus-visible ring; documented in metadata for v1.",
    ],
  });
}

async function updateSliderComponent() {
  return updateStateStatusComponent({
    componentName: "Slider",
    componentSetName: "Slider / v1",
    states: SLIDER_STATES,
    statuses: SLIDER_STATUSES,
    xStep: 360,
    yStep: 112,
    createVariant: createSliderVariant,
    updateVariant: updateSliderVariant,
    parseVariantName: parseSliderVariantName,
    configureProperties: configureSliderProperties,
    description: [
      "Kozmos Slider component set generated from React Slider API.",
      "State maps to focus and disabled props in Code Connect.",
      "Status maps to Slider.error in Code Connect.",
      "Label Text maps to Slider.label.",
      "Focus follows the React focus-visible ring; documented in metadata for v1.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildStateStatusComponent(config) {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, config.componentName, stats);

  const existing = page.findOne(
    (node) => node.name === config.componentSetName,
  );
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message = `${config.componentSetName} already exists. Use Update ${config.componentName} to preserve its node ID.`;
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const components = [];

  for (let stateIndex = 0; stateIndex < config.states.length; stateIndex += 1) {
    const state = config.states[stateIndex];
    for (
      let statusIndex = 0;
      statusIndex < config.statuses.length;
      statusIndex += 1
    ) {
      const status = config.statuses[statusIndex];
      const component = await config.createVariant({
        state,
        status,
        variableByName,
        fonts,
        stats,
      });
      component.x = statusIndex * config.xStep;
      component.y = stateIndex * config.yStep;
      page.appendChild(component);
      components.push(component);
    }
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = config.componentSetName;
  componentSet.x = config.x;
  componentSet.y = config.y;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(
    RUN_NAMESPACE,
    "component",
    config.componentName,
  );
  applyComponentSetDescription(
    componentSet,
    config.componentSetName,
    false,
    config.description,
  );
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  config.configureProperties(componentSet, stats);
  return stats;
}

async function updateStateStatusComponent(config) {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsCreated: 0,
    variantsMissing: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, config.componentName, stats);

  const existing = page.findOne(
    (node) => node.name === config.componentSetName,
  );
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = `${config.componentSetName} was not found. Run Build ${config.componentName} first.`;
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenKeys = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(
    RUN_NAMESPACE,
    "component",
    config.componentName,
  );
  applyComponentSetDescription(
    existing,
    config.componentSetName,
    true,
    config.description,
  );
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = config.parseVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized ${config.componentName} variant "${child.name}".`,
      );
      continue;
    }

    seenKeys[`${props.state}/${props.status}`] = true;
    await config.updateVariant(child, {
      state: props.state,
      status: props.status,
      variableByName,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const state of config.states) {
    for (const status of config.statuses) {
      const key = `${state}/${status}`;
      if (seenKeys[key]) continue;

      const component = await config.createVariant({
        state,
        status,
        variableByName,
        fonts,
        stats,
      });
      existing.appendChild(component);
      seenKeys[key] = true;
      stats.variantsCreated += 1;
    }
  }

  layoutStateStatusVariants(existing, config);

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  config.configureProperties(existing, stats);
  return stats;
}

function layoutStateStatusVariants(componentSet, config) {
  if (!componentSet || !componentSet.children) return;

  for (const child of componentSet.children) {
    if (child.type !== "COMPONENT") continue;

    const props = config.parseVariantName(child.name);
    if (!props) continue;

    const stateIndex = config.states.indexOf(props.state);
    const statusIndex = config.statuses.indexOf(props.status);
    child.x = statusIndex * config.xStep;
    child.y = stateIndex * config.yStep;
  }
}

function configureTextareaProperties(componentSet, stats) {
  configureLabelTextProperty(componentSet, "Textarea", stats);
  configurePlaceholderTextProperty(componentSet, "Placeholder", stats);
  configureFocusVisibleProperty(componentSet, stats);
}

function configureSearchProperties(componentSet, stats) {
  configureLabelTextProperty(componentSet, "Search", stats);
  configurePlaceholderTextProperty(componentSet, "Search", stats);
  configureFocusVisibleProperty(componentSet, stats);
}

function configureSelectProperties(componentSet, stats) {
  configurePlaceholderTextProperty(componentSet, "Select an option", stats);
  configureFocusVisibleProperty(componentSet, stats);
}

function configureSliderProperties(componentSet, stats) {
  configureLabelTextProperty(componentSet, "Slider", stats);
  configureFocusVisibleProperty(componentSet, stats);
}

async function rebuildTextareaComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Textarea",
    componentSetName: "Textarea / v1",
    build: buildTextareaComponent,
  });
}

async function rebuildSearchComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Search",
    componentSetName: "Search / v1",
    build: buildSearchComponent,
  });
}

async function rebuildSelectComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Select",
    componentSetName: "Select / v1",
    build: buildSelectComponent,
  });
}

async function rebuildSliderComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Slider",
    componentSetName: "Slider / v1",
    build: buildSliderComponent,
  });
}

async function buildProgressComponent() {
  return buildSingleAxisComponent({
    componentName: "Progress",
    componentSetName: "Progress / v1",
    axisName: "Value",
    values: PROGRESS_VALUES,
    x: 80,
    y: 3700,
    xStep: 360,
    createVariant: createProgressVariant,
    configureProperties: configureProgressProperties,
    description: [
      "Kozmos Progress component set generated from React Progress API.",
      "Value maps to Progress.value in Code Connect.",
      "Progress is non-interactive and does not expose focus or disabled states.",
    ],
  });
}

async function updateProgressComponent() {
  return updateSingleAxisComponent({
    componentName: "Progress",
    componentSetName: "Progress / v1",
    axisName: "Value",
    values: PROGRESS_VALUES,
    xStep: 360,
    createVariant: createProgressVariant,
    updateVariant: updateProgressVariant,
    parseVariantName: parseProgressVariantName,
    configureProperties: configureProgressProperties,
    description: [
      "Kozmos Progress component set generated from React Progress API.",
      "Value maps to Progress.value in Code Connect.",
      "Progress is non-interactive and does not expose focus or disabled states.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildSpinnerComponent() {
  return buildSingleAxisComponent({
    componentName: "Spinner",
    componentSetName: "Spinner / v1",
    axisName: "Size",
    values: SPINNER_SIZES,
    x: 80,
    y: 3840,
    xStep: 96,
    createVariant: createSpinnerVariant,
    configureProperties: configureSpinnerProperties,
    description: [
      "Kozmos Spinner component set generated from React Spinner API.",
      "Size maps to Spinner.size in Code Connect.",
      "Spinner is status feedback and non-interactive.",
    ],
  });
}

async function updateSpinnerComponent() {
  return updateSingleAxisComponent({
    componentName: "Spinner",
    componentSetName: "Spinner / v1",
    axisName: "Size",
    values: SPINNER_SIZES,
    xStep: 96,
    createVariant: createSpinnerVariant,
    updateVariant: updateSpinnerVariant,
    parseVariantName: parseSpinnerVariantName,
    configureProperties: configureSpinnerProperties,
    description: [
      "Kozmos Spinner component set generated from React Spinner API.",
      "Size maps to Spinner.size in Code Connect.",
      "Spinner is status feedback and non-interactive.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildAvatarComponent() {
  return buildSingleAxisComponent({
    componentName: "Avatar",
    componentSetName: "Avatar / v1",
    axisName: "Content",
    values: AVATAR_CONTENT,
    x: 80,
    y: 3980,
    xStep: 120,
    createVariant: createAvatarVariant,
    configureProperties: configureAvatarProperties,
    description: [
      "Kozmos Avatar component set generated from React Avatar API.",
      "Content describes whether the Figma example shows image content or fallback initials.",
      "Image URL maps to AvatarImage.src.",
      "Alt Text maps to AvatarImage.alt.",
      "Fallback maps to AvatarFallback children in Code Connect.",
    ],
  });
}

async function updateAvatarComponent() {
  return updateSingleAxisComponent({
    componentName: "Avatar",
    componentSetName: "Avatar / v1",
    axisName: "Content",
    values: AVATAR_CONTENT,
    xStep: 120,
    createVariant: createAvatarVariant,
    updateVariant: updateAvatarVariant,
    parseVariantName: parseAvatarVariantName,
    configureProperties: configureAvatarProperties,
    description: [
      "Kozmos Avatar component set generated from React Avatar API.",
      "Content describes whether the Figma example shows image content or fallback initials.",
      "Image URL maps to AvatarImage.src.",
      "Alt Text maps to AvatarImage.alt.",
      "Fallback maps to AvatarFallback children in Code Connect.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildAlertComponent() {
  return buildSingleAxisComponent({
    componentName: "Alert",
    componentSetName: "Alert / v1",
    axisName: "Variant",
    values: ALERT_VARIANTS,
    x: 80,
    y: 4140,
    xStep: 400,
    createVariant: createAlertVariant,
    configureProperties: configureAlertProperties,
    description: [
      "Kozmos Alert component set generated from React Alert API.",
      "Variant maps to Alert.variant in Code Connect.",
      "Title maps to AlertTitle children.",
      "Description maps to AlertDescription children.",
      "Alert is non-interactive status content.",
    ],
  });
}

async function updateAlertComponent() {
  return updateSingleAxisComponent({
    componentName: "Alert",
    componentSetName: "Alert / v1",
    axisName: "Variant",
    values: ALERT_VARIANTS,
    xStep: 400,
    createVariant: createAlertVariant,
    updateVariant: updateAlertVariant,
    parseVariantName: parseAlertVariantName,
    configureProperties: configureAlertProperties,
    description: [
      "Kozmos Alert component set generated from React Alert API.",
      "Variant maps to Alert.variant in Code Connect.",
      "Title maps to AlertTitle children.",
      "Description maps to AlertDescription children.",
      "Alert is non-interactive status content.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildToastComponent() {
  return buildSingleAxisComponent({
    componentName: "Toast",
    componentSetName: "Toast / v1",
    axisName: "Content",
    values: TOAST_CONTENT,
    x: 80,
    y: 6480,
    xStep: 480,
    createVariant: createToastVariant,
    configureProperties: configureToastProperties,
    description: [
      "Kozmos Toast component set generated from React Toast API.",
      "Content maps to composed Toast children.",
      "Title Text maps to ToastTitle children.",
      "Description Text maps to ToastDescription children.",
      "Action Text maps to ToastAction children when present.",
    ],
  });
}

async function updateToastComponent() {
  return updateSingleAxisComponent({
    componentName: "Toast",
    componentSetName: "Toast / v1",
    axisName: "Content",
    values: TOAST_CONTENT,
    xStep: 480,
    createVariant: createToastVariant,
    updateVariant: updateToastVariant,
    parseVariantName: parseToastVariantName,
    configureProperties: configureToastProperties,
    description: [
      "Kozmos Toast component set generated from React Toast API.",
      "Content maps to composed Toast children.",
      "Title Text maps to ToastTitle children.",
      "Description Text maps to ToastDescription children.",
      "Action Text maps to ToastAction children when present.",
      "Updated in place to preserve the Code Connect node ID.",
    ],
  });
}

async function buildSingleAxisComponent(config) {
  const stats = {
    created: false,
    componentSetId: null,
    urlNodeId: null,
    variants: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, config.componentName, stats);

  const existing = page.findOne(
    (node) => node.name === config.componentSetName,
  );
  if (existing) {
    stats.existing = true;
    stats.componentSetId = existing.id;
    stats.urlNodeId = nodeIdForUrl(existing.id);
    stats.message = `${config.componentSetName} already exists. Use Update ${config.componentName} to preserve its node ID.`;
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const components = [];

  for (let valueIndex = 0; valueIndex < config.values.length; valueIndex += 1) {
    const value = config.values[valueIndex];
    const component = await config.createVariant({
      value,
      variableByName,
      fonts,
      stats,
    });
    component.x = valueIndex * config.xStep;
    component.y = 0;
    page.appendChild(component);
    components.push(component);
  }

  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = config.componentSetName;
  componentSet.x = config.x;
  componentSet.y = config.y;
  componentSet.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  componentSet.setSharedPluginData(
    RUN_NAMESPACE,
    "component",
    config.componentName,
  );
  applyComponentSetDescription(
    componentSet,
    config.componentSetName,
    false,
    config.description,
  );
  clearComponentSetContainerFill(componentSet);

  stats.created = true;
  stats.componentSetId = componentSet.id;
  stats.urlNodeId = nodeIdForUrl(componentSet.id);
  stats.variants = components.length;
  normalizeComponentSetVariantProperties(
    componentSet,
    expectedVariantAxesForComponentSetName(componentSet.name),
    stats,
  );
  config.configureProperties(componentSet, stats);
  return stats;
}

async function updateSingleAxisComponent(config) {
  const stats = {
    updated: false,
    componentSetId: null,
    urlNodeId: null,
    variantsUpdated: 0,
    variantsCreated: 0,
    variantsMissing: 0,
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  removeStaleGeneratedComponentArtifacts(page, config.componentName, stats);

  const existing = page.findOne(
    (node) => node.name === config.componentSetName,
  );
  if (!existing || existing.type !== "COMPONENT_SET") {
    stats.message = `${config.componentSetName} was not found. Run Build ${config.componentName} first.`;
    return stats;
  }

  const fonts = await loadButtonFonts(stats);
  const variableByName = await ensureComponentRuntimeVariables(stats);
  const seenValues = {};

  existing.setSharedPluginData(RUN_NAMESPACE, "kind", "component-set");
  existing.setSharedPluginData(
    RUN_NAMESPACE,
    "component",
    config.componentName,
  );
  applyComponentSetDescription(
    existing,
    config.componentSetName,
    true,
    config.description,
  );
  clearComponentSetContainerFill(existing);

  for (const child of existing.children) {
    if (child.type !== "COMPONENT") continue;

    const props = config.parseVariantName(child.name);
    if (!props) {
      stats.warnings.push(
        `Skipped unrecognized ${config.componentName} variant "${child.name}".`,
      );
      continue;
    }

    seenValues[props.value] = true;
    await config.updateVariant(child, {
      value: props.value,
      variableByName,
      fonts,
      stats,
    });
    stats.variantsUpdated += 1;
  }

  for (const value of config.values) {
    if (seenValues[value]) continue;

    const component = await config.createVariant({
      value,
      variableByName,
      fonts,
      stats,
    });
    existing.appendChild(component);
    seenValues[value] = true;
    stats.variantsCreated += 1;
  }

  layoutSingleAxisVariants(existing, config);

  stats.updated = true;
  stats.componentSetId = existing.id;
  stats.urlNodeId = nodeIdForUrl(existing.id);
  normalizeComponentSetVariantProperties(
    existing,
    expectedVariantAxesForComponentSetName(existing.name),
    stats,
  );
  config.configureProperties(existing, stats);
  return stats;
}

function layoutSingleAxisVariants(componentSet, config) {
  if (!componentSet || !componentSet.children) return;

  for (const child of componentSet.children) {
    if (child.type !== "COMPONENT") continue;

    const props = config.parseVariantName(child.name);
    if (!props) continue;

    const valueIndex = config.values.indexOf(props.value);
    child.x = valueIndex * config.xStep;
    child.y = 0;
  }
}

function layoutTextVariants(componentSet) {
  if (!componentSet || !componentSet.children) return;

  const toneColumns = TEXT_TONES.length;
  const columnWidth = 240;
  const rowHeight = 86;

  for (const child of componentSet.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseTextVariantName(child.name);
    if (!props) continue;

    const sizeIndex = TEXT_SIZES.indexOf(props.size);
    const weightIndex = TEXT_WEIGHTS.indexOf(props.weight);
    const toneIndex = TEXT_TONES.indexOf(props.tone);
    child.x = (weightIndex * toneColumns + toneIndex) * columnWidth;
    child.y = sizeIndex * rowHeight;
  }
}

function layoutStackVariants(componentSet) {
  if (!componentSet || !componentSet.children) return;

  const columnWidth = 380;
  const rowHeight = 160;

  for (const child of componentSet.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseStackVariantName(child.name);
    if (!props) continue;

    const directionIndex = STACK_DIRECTIONS.indexOf(props.direction);
    const gapIndex = STACK_GAPS.indexOf(props.gap);
    child.x = gapIndex * columnWidth;
    child.y = directionIndex * rowHeight;
  }
}

function layoutTabsVariants(componentSet) {
  if (!componentSet || !componentSet.children) return;

  for (const child of componentSet.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseTabsVariantName(child.name);
    if (!props) continue;

    const countIndex = TABS_COUNTS.indexOf(props.count);
    const activeIndex = TABS_ACTIVE_TO_INDEX[props.active];
    const stateIndex = TABS_STATES.indexOf(props.state);
    child.x = activeIndex * 700;
    child.y = (countIndex * TABS_STATES.length + stateIndex) * 76;
  }
}

function configureProgressProperties(_componentSet, _stats) {}

function configureSpinnerProperties(_componentSet, _stats) {}

function configureAvatarProperties(componentSet, stats) {
  configureNamedTextProperty(componentSet, "Fallback", "Fallback", "AK", stats);
  configureNamedTextProperty(
    componentSet,
    "Image URL",
    "Image URL",
    "https://example.com/avatar.png",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Alt Text",
    "Alt Text",
    "Avatar",
    stats,
  );
}

function configureTextProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Text",
    "Text",
    "Kozmos text",
    stats,
  );
}

function configureHeadingProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Heading Text",
    "Heading Text",
    "Heading",
    stats,
  );
}

function configureLinkProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Link Text",
    "Link Text",
    "Open link",
    stats,
  );
}

function configureLabelProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Label Text",
    "Label Text",
    "Label",
    stats,
  );
}

function configureSeparatorProperties(_componentSet, _stats) {}

function configureSkeletonProperties(_componentSet, _stats) {}

function configureBoxProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Box Text",
    "Box Text",
    "Content slot",
    stats,
  );
}

function configureStackProperties(_componentSet, _stats) {}

function configureContainerProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Container Text",
    "Container Text",
    "Container content",
    stats,
  );
}

function configureAlertProperties(componentSet, stats) {
  configureNamedTextProperty(componentSet, "Title", "Title", "Heads up", stats);
  configureNamedTextProperty(
    componentSet,
    "Description",
    "Description",
    "This status message needs attention.",
    stats,
  );
}

function configureCardProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Title Text",
    "Title Text",
    "Create project",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Description Text",
    "Description Text",
    "Deploy your new project in one click.",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Body Text",
    "Body Text",
    "Use this contained surface for related content, supporting copy, and local actions.",
    stats,
  );
}

function configureTabsProperties(componentSet, stats) {
  const defaults = ["Overview", "Details", "Usage", "History"];
  for (let index = 0; index < defaults.length; index += 1) {
    const label = `Tab ${index + 1} Text`;
    configureNamedTextProperty(
      componentSet,
      label,
      label,
      defaults[index],
      stats,
    );
  }

  configureFocusVisibleProperty(componentSet, stats);
}

function configureTooltipProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Content Text",
    "Content Text",
    "Add to library",
    stats,
  );
}

function configureDialogProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Title Text",
    "Title Text",
    "Edit profile",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Description Text",
    "Description Text",
    "Make changes to your profile here.",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Body Text",
    "Body Text",
    "Use dialog body content for a short task, form, or confirmation.",
    stats,
  );
  deleteComponentPropertiesByBaseName(
    componentSet,
    ["Primary Action Text", "Secondary Action Text"],
    ["TEXT"],
    stats,
  );
}

function configurePopoverProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Title Text",
    "Title Text",
    "Dimensions",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Description Text",
    "Description Text",
    "Set the dimensions for the layer.",
    stats,
  );
}

function configureMenuProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Label Text",
    "Label Text",
    "My Account",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Item 1 Text",
    "Item 1 Text",
    "Profile",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Item 2 Text",
    "Item 2 Text",
    "Billing",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Item 3 Text",
    "Item 3 Text",
    "Team",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Shortcut Text",
    "Shortcut Text",
    "Cmd K",
    stats,
  );
}

function configureToastProperties(componentSet, stats) {
  configureNamedTextProperty(
    componentSet,
    "Title Text",
    "Title Text",
    "Scheduled: Catch up",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Description Text",
    "Description Text",
    "Friday, February 10, 2023 at 5:57 PM",
    stats,
  );
  configureNamedTextProperty(
    componentSet,
    "Action Text",
    "Action Text",
    "Undo",
    stats,
  );
}

async function rebuildCardComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Card",
    componentSetName: "Card / v1",
    build: buildCardComponent,
  });
}

async function rebuildTabsComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Tabs",
    componentSetName: "Tabs / v1",
    build: buildTabsComponent,
  });
}

async function rebuildTooltipComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Tooltip",
    componentSetName: "Tooltip / v1",
    build: buildTooltipComponent,
  });
}

async function rebuildDialogComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Dialog",
    componentSetName: "Dialog / v1",
    build: buildDialogComponent,
  });
}

async function rebuildPopoverComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Popover",
    componentSetName: "Popover / v1",
    build: buildPopoverComponent,
  });
}

async function rebuildMenuComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Menu",
    componentSetName: "Menu / v1",
    build: buildMenuComponent,
  });
}

async function rebuildProgressComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Progress",
    componentSetName: "Progress / v1",
    build: buildProgressComponent,
  });
}

async function rebuildSpinnerComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Spinner",
    componentSetName: "Spinner / v1",
    build: buildSpinnerComponent,
  });
}

async function rebuildAvatarComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Avatar",
    componentSetName: "Avatar / v1",
    build: buildAvatarComponent,
  });
}

async function rebuildAlertComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Alert",
    componentSetName: "Alert / v1",
    build: buildAlertComponent,
  });
}

async function rebuildToastComponent() {
  return rebuildGeneratedComponentSet({
    componentName: "Toast",
    componentSetName: "Toast / v1",
    build: buildToastComponent,
  });
}

async function rebuildGeneratedComponentSet(config) {
  const rebuildStats = {
    rebuilt: false,
    archived: [],
    warnings: [],
  };

  const page = await ensurePage("Components");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();
  await archiveGeneratedNodesForRebuild(
    page,
    config.componentSetName,
    config.componentName,
    rebuildStats,
  );

  const buildResult = await config.build();
  return mergeRebuildResult(rebuildStats, buildResult, config);
}

async function archiveGeneratedNodesForRebuild(
  page,
  componentSetName,
  componentName,
  stats,
) {
  const nodes = [];
  for (const child of page.children.slice()) {
    if (child.name === componentSetName) {
      nodes.push(child);
    }
  }

  if (nodes.length === 0) {
    stats.warnings.push(
      `${componentSetName} was not found on the Components page before rebuild; creating a fresh set.`,
    );
    return;
  }

  const archivePage = await ensurePage("Archive / Legacy Reference");
  const timestamp = archiveTimestamp();
  let index = 0;

  for (const node of nodes) {
    const oldName = node.name;
    const oldId = node.id;
    const archivedName = archivedComponentNodeName(
      componentName,
      node.type,
      oldId,
      timestamp,
      index,
    );

    node.name = archivedName;
    if (node.setSharedPluginData) {
      node.setSharedPluginData(RUN_NAMESPACE, "kind", "archived-component");
      node.setSharedPluginData(RUN_NAMESPACE, "component", componentName);
      node.setSharedPluginData(RUN_NAMESPACE, "archivedFromName", oldName);
      node.setSharedPluginData(RUN_NAMESPACE, "archivedFromId", oldId);
      node.setSharedPluginData(RUN_NAMESPACE, "archivedAt", timestamp);
    }

    archivePage.appendChild(node);
    node.x = 80;
    node.y = 80 + index * 120;

    stats.archived.push({
      id: oldId,
      urlNodeId: nodeIdForUrl(oldId),
      oldName,
      newName: archivedName,
      type: node.type,
    });
    index += 1;
  }
}

function archiveTimestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "Z");
}

function archivedComponentNodeName(
  componentName,
  nodeType,
  oldId,
  timestamp,
  index,
) {
  const typeLabel =
    nodeType === "COMPONENT_SET" ? "component set" : nodeType.toLowerCase();
  const suffix = index > 0 ? ` ${index + 1}` : "";
  return `Archived ${componentName} v1 ${typeLabel} ${timestamp} ${nodeIdForUrl(oldId)}${suffix}`;
}

function mergeRebuildResult(rebuildStats, buildResult, config) {
  const merged = {};
  for (const key of Object.keys(buildResult)) {
    merged[key] = buildResult[key];
  }

  merged.rebuilt = buildResult.created === true;
  merged.archived = rebuildStats.archived;

  const warnings = [];
  for (const warning of rebuildStats.warnings) warnings.push(warning);
  if (buildResult.warnings) {
    for (const warning of buildResult.warnings) warnings.push(warning);
  }
  merged.warnings = warnings;

  if (buildResult.created) {
    const archivedCount = rebuildStats.archived.length;
    merged.message =
      `${config.componentSetName} was rebuilt with fresh node-id=${buildResult.urlNodeId}. ` +
      `${archivedCount} old top-level node(s) were moved to Archive / Legacy Reference.`;
  } else if (buildResult.existing) {
    merged.message = `Could not rebuild ${config.componentSetName}; another node with that name still exists on the Components page.`;
  }

  return merged;
}

function removeStaleGeneratedComponentArtifacts(page, componentName, stats) {
  const stale = [];
  const componentSetName = `${componentName} / v1`;

  for (const child of page.children) {
    if (
      child.type === "COMPONENT" &&
      child.getSharedPluginData &&
      child.getSharedPluginData(RUN_NAMESPACE, "component") === componentName
    ) {
      stale.push(child);
      continue;
    }

    if (child.type === "INSTANCE" && child.name === componentSetName) {
      stale.push(child);
      continue;
    }

    if (
      componentName === "Badge" &&
      child.type === "TEXT" &&
      child.name === "Label Text" &&
      child.characters === ""
    ) {
      stale.push(child);
    }
  }

  for (const child of stale) {
    child.remove();
    incrementStat(stats, "staleArtifactsRemoved");
  }
}

async function ensurePage(name) {
  const existing = figma.root.children.find((page) => page.name === name);
  if (existing) {
    await existing.loadAsync();
    return existing;
  }

  const page = figma.createPage();
  page.name = name;
  page.setSharedPluginData(RUN_NAMESPACE, "kind", "page");
  await page.loadAsync();
  return page;
}

async function loadButtonFonts(stats) {
  const regular = await loadFirstAvailableFont([
    { family: "Readex Pro", style: "Regular" },
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Arial", style: "Regular" },
  ]);
  const medium = await loadFirstAvailableFont([
    { family: "Readex Pro", style: "Medium" },
    { family: "Readex Pro", style: "SemiBold" },
    { family: "Readex Pro", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Semi Bold" },
    { family: "Inter", style: "Bold" },
    regular,
  ]);
  const bold = await loadFirstAvailableFont([
    { family: "Readex Pro", style: "Bold" },
    { family: "Readex Pro", style: "SemiBold" },
    { family: "Readex Pro", style: "Medium" },
    { family: "Inter", style: "Bold" },
    { family: "Inter", style: "Semi Bold" },
    medium,
  ]);

  if (regular.family !== "Readex Pro") {
    stats.warnings.push(
      `Readex Pro Regular was unavailable; using ${regular.family} ${regular.style}.`,
    );
  }

  if (medium.family !== "Readex Pro") {
    stats.warnings.push(
      `Readex Pro Medium/SemiBold was unavailable; using ${medium.family} ${medium.style}.`,
    );
  }

  if (bold.family !== "Readex Pro") {
    stats.warnings.push(
      `Readex Pro Bold/SemiBold was unavailable; using ${bold.family} ${bold.style}.`,
    );
  }

  return { regular, medium, bold };
}

async function loadFirstAvailableFont(fonts) {
  let lastError = null;
  for (const font of fonts) {
    try {
      await figma.loadFontAsync(font);
      return font;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("No usable font found.");
}

async function createButtonVariant({
  variant,
  size,
  state,
  variableByName,
  fonts,
  textStyle,
  stats,
}) {
  const config = buttonConfig(variant, state);
  const metrics = buttonMetrics(size);
  const component = figma.createComponent();
  component.name = `Variant=${variant}, Size=${size}, State=${state}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = metrics.gap;
  component.paddingLeft = metrics.paddingX;
  component.paddingRight = metrics.paddingX;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(metrics.width, metrics.height);
  component.cornerRadius = 16;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Button");

  component.fills = config.background
    ? [
        paintFromVariable(
          config.background,
          config.backgroundFallback,
          variableByName,
          stats,
        ),
      ]
    : [];

  if (config.stroke) {
    component.strokes = [
      paintFromVariable(
        config.stroke,
        config.strokeFallback,
        variableByName,
        stats,
      ),
    ];
    component.strokeWeight = 1;
  } else {
    component.strokes = [];
    component.strokeWeight = 0;
  }

  bindButtonGeometryVariables(
    component,
    metrics,
    config,
    variableByName,
    stats,
  );

  if (variant === "Glass") {
    component.effects = [
      {
        type: "DROP_SHADOW",
        color: { r: 0, g: 0, b: 0, a: 0.12 },
        offset: { x: 0, y: 8 },
        radius: 16,
        spread: -8,
        visible: true,
        blendMode: "NORMAL",
      },
    ];
  }

  if (state === "Loading") {
    component.appendChild(
      createSpinnerGlyph(
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
        metrics.spinnerSize,
        metrics.spinnerSizeToken,
      ),
    );
  }

  if (size !== "Icon") {
    const label = figma.createText();
    label.name = "Label Text";
    await applyButtonLabelTypography(
      label,
      fonts,
      textStyle,
      variableByName,
      stats,
    );
    label.characters = state === "Loading" ? "Loading" : variant;
    label.fills = [
      paintFromVariable(
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
      ),
    ];
    if (variant === "Link") label.textDecoration = "UNDERLINE";
    component.appendChild(label);
  }

  syncFocusRing(component, {
    enabled: state === "Default",
    width: metrics.width,
    height: metrics.height,
    radius: 8,
    variableName: "Colors/theme/500",
    fallback: "#135BEC",
    variableByName,
    stats,
  });

  return component;
}

function parseButtonVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    BUTTON_VARIANTS.indexOf(values.Variant) === -1 ||
    BUTTON_SIZES.indexOf(values.Size) === -1 ||
    BUTTON_STATES.indexOf(values.State) === -1
  ) {
    return null;
  }

  return {
    variant: values.Variant,
    size: values.Size,
    state: values.State,
  };
}

async function updateButtonVariant(
  component,
  { variant, size, state, variableByName, fonts, textStyle, stats },
) {
  const config = buttonConfig(variant, state);
  const metrics = buttonMetrics(size);

  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = metrics.gap;
  component.paddingLeft = metrics.paddingX;
  component.paddingRight = metrics.paddingX;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(metrics.width, metrics.height);
  component.cornerRadius = 8;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Button");

  component.fills = config.background
    ? [
        paintFromVariable(
          config.background,
          config.backgroundFallback,
          variableByName,
          stats,
        ),
      ]
    : [];

  if (config.stroke) {
    component.strokes = [
      paintFromVariable(
        config.stroke,
        config.strokeFallback,
        variableByName,
        stats,
      ),
    ];
    component.strokeWeight = 1;
  } else {
    component.strokes = [];
    component.strokeWeight = 0;
  }

  bindButtonGeometryVariables(
    component,
    metrics,
    config,
    variableByName,
    stats,
  );

  component.effects =
    variant === "Glass"
      ? [
          {
            type: "DROP_SHADOW",
            color: { r: 0, g: 0, b: 0, a: 0.12 },
            offset: { x: 0, y: 8 },
            radius: 16,
            spread: -8,
            visible: true,
            blendMode: "NORMAL",
          },
        ]
      : [];

  await syncButtonVariantChildren({
    component,
    variant,
    size,
    state,
    config,
    variableByName,
    fonts,
    textStyle,
    stats,
  });

  syncFocusRing(component, {
    enabled: state === "Default",
    width: metrics.width,
    height: metrics.height,
    radius: 8,
    variableName: "Colors/theme/500",
    fallback: "#135BEC",
    variableByName,
    stats,
  });
}

async function createIconButtonVariant({
  variant,
  size,
  state,
  variableByName,
  stats,
}) {
  const component = figma.createComponent();
  await updateIconButtonVariant(component, {
    variant,
    size,
    state,
    variableByName,
    stats,
  });
  return component;
}

function parseIconButtonVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    BUTTON_VARIANTS.indexOf(values.Variant) === -1 ||
    ICON_BUTTON_SIZES.indexOf(values.Size) === -1 ||
    BUTTON_STATES.indexOf(values.State) === -1
  ) {
    return null;
  }

  return {
    variant: values.Variant,
    size: values.Size,
    state: values.State,
  };
}

async function updateIconButtonVariant(
  component,
  { variant, size, state, variableByName, stats },
) {
  const config = buttonConfig(variant, state);
  const metrics = iconButtonMetrics(size);

  component.name = `Variant=${variant}, Size=${size}, State=${state}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 0;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(metrics.size, metrics.size);
  component.cornerRadius = metrics.size / 2;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "IconButton");

  component.fills = config.background
    ? [
        paintFromVariable(
          config.background,
          config.backgroundFallback,
          variableByName,
          stats,
        ),
      ]
    : [];

  if (config.stroke) {
    component.strokes = [
      paintFromVariable(
        config.stroke,
        config.strokeFallback,
        variableByName,
        stats,
      ),
    ];
    component.strokeWeight = 1;
  } else {
    component.strokes = [];
    component.strokeWeight = 0;
  }

  bindIconButtonGeometryVariables(
    component,
    metrics,
    config,
    variableByName,
    stats,
  );

  component.effects =
    variant === "Glass"
      ? [
          {
            type: "DROP_SHADOW",
            color: { r: 0, g: 0, b: 0, a: 0.12 },
            offset: { x: 0, y: 8 },
            radius: 16,
            spread: -8,
            visible: true,
            blendMode: "NORMAL",
          },
        ]
      : [];

  await syncIconButtonChildren({
    component,
    variant,
    state,
    config,
    variableByName,
    iconSize: metrics.iconSize,
    iconSizeToken: metrics.iconSizeToken,
    spinnerSize: metrics.spinnerSize,
    spinnerSizeToken: metrics.spinnerSizeToken,
    stats,
  });

  syncFocusRing(component, {
    enabled: state === "Default",
    width: metrics.size,
    height: metrics.size,
    radius: metrics.size / 2,
    variableName: "Colors/theme/500",
    fallback: "#135BEC",
    variableByName,
    stats,
  });
}

async function createBadgeVariant({
  variant,
  size,
  variableByName,
  iconComponent,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateBadgeVariant(component, {
    variant,
    size,
    variableByName,
    iconComponent,
    fonts,
    stats,
  });
  return component;
}

async function createCounterVariant({
  tone,
  size,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateCounterVariant(component, {
    tone,
    size,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

async function createTextVariant({
  size,
  weight,
  tone,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateTextVariant(component, {
    size,
    weight,
    tone,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseTextVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    TEXT_SIZES.indexOf(values.Size) === -1 ||
    TEXT_WEIGHTS.indexOf(values.Weight) === -1 ||
    TEXT_TONES.indexOf(values.Tone) === -1
  ) {
    return null;
  }

  return {
    size: values.Size,
    weight: values.Weight,
    tone: values.Tone,
  };
}

async function updateTextVariant(
  component,
  { size, weight, tone, variableByName, fonts, stats },
) {
  const metrics = textMetrics(size);
  const color = textToneConfig(tone);

  component.name = `Size=${size}, Weight=${weight}, Tone=${tone}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 0;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.fills = [];
  component.strokes = [];
  component.strokeWeight = 0;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Text");

  let text = directChildNamed(component, "Text");
  if (text && text.type !== "TEXT") {
    text.remove();
    text = null;
  }

  if (!text || text.type !== "TEXT") {
    text = figma.createText();
    text.name = "Text";
  }

  applyTextTypography(text, size, weight, fonts, variableByName, stats);
  text.characters = textSampleForSize(size);
  text.fills = [
    paintFromVariable(
      color.foreground,
      color.foregroundFallback,
      variableByName,
      stats,
    ),
  ];
  setTextAutoResize(text, "WIDTH_AND_HEIGHT");
  component.appendChild(text);
}

async function createHeadingVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateHeadingVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseHeadingVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (HEADING_LEVELS.indexOf(values.Level) === -1) return null;

  return { value: values.Level, level: values.Level };
}

async function updateHeadingVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  const metrics = headingMetrics(value);

  component.name = `Level=${value}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 0;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.fills = [];
  component.strokes = [];
  component.strokeWeight = 0;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Heading");

  let text = directChildNamed(component, "Heading Text");
  if (text && text.type !== "TEXT") {
    text.remove();
    text = null;
  }

  if (!text || text.type !== "TEXT") {
    text = figma.createText();
    text.name = "Heading Text";
  }

  text.fontName = fonts.bold || fonts.medium;
  text.fontSize = metrics.fontSize;
  text.lineHeight = { unit: "PIXELS", value: metrics.lineHeight };
  text.textAutoResize = "WIDTH_AND_HEIGHT";
  bindFloatVariable(
    text,
    "fontSize",
    `Text/font-size/${metrics.token}`,
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    `Text/line-height/${metrics.token}`,
    variableByName,
    stats,
  );
  text.characters = headingSampleForLevel(value);
  text.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  component.appendChild(text);
}

async function createLinkVariant({
  variant,
  state,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateLinkVariant(component, {
    variant,
    state,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseLinkVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    LINK_VARIANTS.indexOf(values.Variant) === -1 ||
    LINK_STATES.indexOf(values.State) === -1
  ) {
    return null;
  }

  return {
    variant: values.Variant,
    state: values.State,
  };
}

async function updateLinkVariant(
  component,
  { variant, state, variableByName, fonts, stats },
) {
  const config = linkConfig(variant);

  component.name = `Variant=${variant}, State=${state}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 0;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(128, 44);
  component.fills = [];
  component.strokes = [];
  component.strokeWeight = 0;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Link");

  bindSizeVariables(
    component,
    "Link/width/default",
    "Link/height/default",
    variableByName,
    stats,
  );

  let text = directChildNamed(component, "Link Text");
  if (text && text.type !== "TEXT") {
    text.remove();
    text = null;
  }

  if (!text || text.type !== "TEXT") {
    text = figma.createText();
    text.name = "Link Text";
  }

  text.fontName = fonts.medium;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";
  text.textDecoration = "UNDERLINE";
  bindFloatVariable(text, "fontSize", "Link/font-size", variableByName, stats);
  bindFloatVariable(
    text,
    "lineHeight",
    "Link/line-height",
    variableByName,
    stats,
  );
  text.characters = variant === "Subtle" ? "Learn more" : "Open link";
  text.fills = [
    paintFromVariable(
      config.foreground,
      config.foregroundFallback,
      variableByName,
      stats,
    ),
  ];
  component.appendChild(text);

  syncFocusRing(component, {
    enabled: state === "Focus",
    width: 128,
    height: 44,
    radius: 6,
    variableName: "Colors/theme/600",
    fallback: "#1051E8",
    variableByName,
    stats,
  });
  const ring = directChildNamed(component, "Focus Ring");
  if (ring) ring.visible = state === "Focus";
}

async function createLabelVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateLabelVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseLabelVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (LABEL_STATES.indexOf(values.State) === -1) return null;

  return { value: values.State, state: values.State };
}

async function updateLabelVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  const disabled = value === "Disabled";

  component.name = `State=${value}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 0;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(96, 44);
  component.fills = [];
  component.strokes = [];
  component.strokeWeight = 0;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Label");
  bindFloatVariable(
    component,
    "height",
    "Label/height/default",
    variableByName,
    stats,
  );

  let text = directChildNamed(component, "Label Text");
  if (text && text.type !== "TEXT") {
    text.remove();
    text = null;
  }

  if (!text || text.type !== "TEXT") {
    text = figma.createText();
    text.name = "Label Text";
  }

  text.fontName = fonts.medium;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";
  bindFloatVariable(text, "fontSize", "Label/font-size", variableByName, stats);
  bindFloatVariable(
    text,
    "lineHeight",
    "Label/line-height",
    variableByName,
    stats,
  );
  text.characters = disabled ? "Disabled label" : "Label";
  text.fills = [
    paintFromVariable(
      disabled ? "Colors/foreground/500" : "Colors/foreground/0",
      disabled ? "#747B8B" : "#000000",
      variableByName,
      stats,
    ),
  ];
  component.appendChild(text);
}

async function createSeparatorVariant({ value, variableByName, stats }) {
  const component = figma.createComponent();
  await updateSeparatorVariant(component, {
    value,
    variableByName,
    stats,
  });
  return component;
}

function parseSeparatorVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (SEPARATOR_ORIENTATIONS.indexOf(values.Orientation) === -1) return null;

  return {
    value: values.Orientation,
    orientation: values.Orientation,
  };
}

async function updateSeparatorVariant(
  component,
  { value, variableByName, stats },
) {
  const horizontal = value === "Horizontal";
  component.name = `Orientation=${value}`;
  component.layoutMode = "NONE";
  component.resizeWithoutConstraints(horizontal ? 320 : 1, horizontal ? 1 : 44);
  component.fills = [
    paintFromVariable(
      "Colors/foreground/500",
      "#747B8B",
      variableByName,
      stats,
    ),
  ];
  component.strokes = [];
  component.strokeWeight = 0;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Separator");
  bindSizeVariables(
    component,
    horizontal ? "Separator/length/default" : "Separator/thickness",
    horizontal ? "Separator/thickness" : "Separator/height/vertical",
    variableByName,
    stats,
  );
}

async function createSkeletonVariant({ value, variableByName, stats }) {
  const component = figma.createComponent();
  await updateSkeletonVariant(component, {
    value,
    variableByName,
    stats,
  });
  return component;
}

function parseSkeletonVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (SKELETON_SHAPES.indexOf(values.Shape) === -1) return null;

  return {
    value: values.Shape,
    shape: values.Shape,
  };
}

async function updateSkeletonVariant(
  component,
  { value, variableByName, stats },
) {
  const metrics = skeletonMetrics(value);
  component.name = `Shape=${value}`;
  component.layoutMode = "NONE";
  component.resizeWithoutConstraints(metrics.width, metrics.height);
  component.cornerRadius = metrics.radius;
  component.fills = [
    paintFromVariable(
      "Colors/background/200",
      "#C7CAD1",
      variableByName,
      stats,
    ),
  ];
  component.strokes = [];
  component.strokeWeight = 0;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Skeleton");

  bindSizeVariables(
    component,
    metrics.widthToken,
    metrics.heightToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "cornerRadius",
    metrics.radiusToken,
    variableByName,
    stats,
  );
}

async function createBoxVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateBoxVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseBoxVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (BOX_SURFACES.indexOf(values.Surface) === -1) return null;

  return {
    value: values.Surface,
    surface: values.Surface,
  };
}

async function updateBoxVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  const config = boxSurfaceConfig(value);
  component.name = `Surface=${value}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 0;
  component.paddingLeft = 16;
  component.paddingRight = 16;
  component.paddingTop = 16;
  component.paddingBottom = 16;
  component.resizeWithoutConstraints(320, 120);
  component.cornerRadius = 8;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Box");

  component.fills = config.background
    ? [
        paintFromVariable(
          config.background,
          config.backgroundFallback,
          variableByName,
          stats,
        ),
      ]
    : [];

  if (config.stroke) {
    component.strokes = [
      paintFromVariable(
        config.stroke,
        config.strokeFallback,
        variableByName,
        stats,
      ),
    ];
    component.strokeWeight = 1;
  } else {
    component.strokes = [];
    component.strokeWeight = 0;
  }

  bindSizeVariables(
    component,
    "Box/width/default",
    "Box/min-height/default",
    variableByName,
    stats,
  );
  for (const field of [
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
  ]) {
    bindFloatVariable(
      component,
      field,
      "Box/padding/default",
      variableByName,
      stats,
    );
  }
  bindFloatVariable(
    component,
    "cornerRadius",
    "Box/radius",
    variableByName,
    stats,
  );
  if (config.stroke) {
    bindFloatVariable(
      component,
      "strokeWeight",
      "Box/stroke/width",
      variableByName,
      stats,
    );
  }

  let text = directChildNamed(component, "Box Text");
  if (text && text.type !== "TEXT") {
    text.remove();
    text = null;
  }

  if (!text || text.type !== "TEXT") {
    text = figma.createText();
    text.name = "Box Text";
  }

  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.textAutoResize = "WIDTH_AND_HEIGHT";
  bindFloatVariable(
    text,
    "fontSize",
    "Box/text/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Box/text/line-height",
    variableByName,
    stats,
  );
  text.characters = value === "Transparent" ? "Content slot" : `${value} box`;
  text.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  component.appendChild(text);
}

async function createStackVariant({ direction, gap, variableByName, stats }) {
  const component = figma.createComponent();
  await updateStackVariant(component, {
    direction,
    gap,
    variableByName,
    stats,
  });
  return component;
}

function parseStackVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    STACK_DIRECTIONS.indexOf(values.Direction) === -1 ||
    STACK_GAPS.indexOf(values.Gap) === -1
  ) {
    return null;
  }

  return {
    direction: values.Direction,
    gap: values.Gap,
  };
}

async function updateStackVariant(
  component,
  { direction, gap, variableByName, stats },
) {
  const horizontal = direction === "Row";
  component.name = `Direction=${direction}, Gap=${gap}`;
  component.layoutMode = horizontal ? "HORIZONTAL" : "VERTICAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = Number(gap) * 4;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(320, horizontal ? 72 : 120);
  component.fills = [];
  component.strokes = [];
  component.strokeWeight = 0;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Stack");

  bindSizeVariables(
    component,
    "Stack/width/default",
    horizontal ? "Stack/height/row" : "Stack/height/column",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "itemSpacing",
    `Stack/gap/${gap}`,
    variableByName,
    stats,
  );

  const existingItems = (component.children || []).filter((child) =>
    /^Stack Item /.test(child.name),
  );
  for (const child of existingItems) child.remove();

  for (let index = 0; index < 3; index += 1) {
    const item = figma.createRectangle();
    item.name = `Stack Item ${index + 1}`;
    item.resizeWithoutConstraints(88, 32);
    item.cornerRadius = 8;
    item.fills = [
      paintFromVariable(
        "Colors/background/200",
        "#C7CAD1",
        variableByName,
        stats,
      ),
    ];
    item.strokes = [];
    bindSizeVariables(
      item,
      "Stack/item/width",
      "Stack/item/height",
      variableByName,
      stats,
    );
    bindFloatVariable(
      item,
      "cornerRadius",
      "Stack/item/radius",
      variableByName,
      stats,
    );
    component.appendChild(item);
  }
}

async function createContainerVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateContainerVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseContainerVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (CONTAINER_CENTERED.indexOf(values.Centered) === -1) return null;

  return {
    value: values.Centered,
    centered: values.Centered,
  };
}

async function updateContainerVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  const centered = value === "True";
  component.name = `Centered=${value}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = centered ? "CENTER" : "MIN";
  component.itemSpacing = 0;
  component.paddingLeft = 24;
  component.paddingRight = 24;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(480, 120);
  component.fills = [];
  component.strokes = [];
  component.strokeWeight = 0;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Container");

  bindSizeVariables(
    component,
    "Container/width/default",
    "Container/min-height/default",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingLeft",
    "Container/padding/x",
    variableByName,
    stats,
  );
  bindFloatVariable(
    component,
    "paddingRight",
    "Container/padding/x",
    variableByName,
    stats,
  );

  let content = directChildNamed(component, "Container Content");
  if (content && content.type !== "FRAME") {
    content.remove();
    content = null;
  }

  if (!content || content.type !== "FRAME") {
    content = figma.createFrame();
    content.name = "Container Content";
  }

  const contentWidth = centered ? 320 : 432;
  content.layoutMode = "HORIZONTAL";
  content.primaryAxisSizingMode = "FIXED";
  content.counterAxisSizingMode = "FIXED";
  content.primaryAxisAlignItems = "CENTER";
  content.counterAxisAlignItems = "CENTER";
  content.itemSpacing = 0;
  content.paddingLeft = 16;
  content.paddingRight = 16;
  content.paddingTop = 16;
  content.paddingBottom = 16;
  content.resizeWithoutConstraints(contentWidth, 64);
  content.cornerRadius = 8;
  content.fills = [
    paintFromVariable(
      "Colors/background/100",
      "#F4F5F7",
      variableByName,
      stats,
    ),
  ];
  content.strokes = [
    paintFromVariable(
      "Colors/background/200",
      "#C7CAD1",
      variableByName,
      stats,
    ),
  ];
  content.strokeWeight = 1;
  content.clipsContent = false;

  bindSizeVariables(
    content,
    centered
      ? "Container/content-width/centered"
      : "Container/content-width/fluid",
    "Container/content-height",
    variableByName,
    stats,
  );
  for (const field of [
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
  ]) {
    bindFloatVariable(
      content,
      field,
      "Container/content-padding",
      variableByName,
      stats,
    );
  }
  bindFloatVariable(
    content,
    "cornerRadius",
    "Container/content-radius",
    variableByName,
    stats,
  );
  bindFloatVariable(
    content,
    "strokeWeight",
    "Container/content-stroke/width",
    variableByName,
    stats,
  );

  let text = directChildNamed(content, "Container Text");
  if (text && text.type !== "TEXT") {
    text.remove();
    text = null;
  }

  if (!text || text.type !== "TEXT") {
    text = figma.createText();
    text.name = "Container Text";
  }

  text.fontName = fonts.regular;
  text.fontSize = 14;
  text.lineHeight = { unit: "PIXELS", value: 20 };
  text.characters = centered ? "Centered container" : "Fluid container";
  text.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  text.textAlignHorizontal = "CENTER";
  setTextAutoResize(text, "WIDTH_AND_HEIGHT");
  bindFloatVariable(
    text,
    "fontSize",
    "Container/text/font-size",
    variableByName,
    stats,
  );
  bindFloatVariable(
    text,
    "lineHeight",
    "Container/text/line-height",
    variableByName,
    stats,
  );
  content.appendChild(text);
  component.appendChild(content);
}

function parseCounterVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    COUNTER_TONES.indexOf(values.Tone) === -1 ||
    COUNTER_SIZES.indexOf(values.Size) === -1
  ) {
    return null;
  }

  return {
    tone: values.Tone,
    size: values.Size,
  };
}

async function updateCounterVariant(
  component,
  { tone, size, variableByName, fonts, stats },
) {
  const config = counterConfig(tone);
  const metrics = counterMetrics(size);

  component.name = `Tone=${tone}, Size=${size}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 0;
  component.paddingLeft = metrics.paddingX;
  component.paddingRight = metrics.paddingX;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(metrics.minWidth, metrics.height);
  component.cornerRadius = 9999;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Counter");

  component.fills = [
    paintFromVariable(
      config.background,
      config.backgroundFallback,
      variableByName,
      stats,
    ),
  ];
  component.strokes = [];
  component.strokeWeight = 0;

  bindCounterGeometryVariables(component, metrics, variableByName, stats);

  await syncCounterVariantChildren({
    component,
    tone,
    size,
    config,
    variableByName,
    fonts,
    stats,
  });
}

function parseBadgeVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    BADGE_VARIANTS.indexOf(values.Variant) === -1 ||
    BADGE_SIZES.indexOf(values.Size) === -1
  ) {
    return null;
  }

  return {
    variant: values.Variant,
    size: values.Size,
  };
}

async function updateBadgeVariant(
  component,
  { variant, size, variableByName, iconComponent, fonts, stats },
) {
  const config = badgeConfig(variant);
  const metrics = badgeMetrics(size);

  component.name = `Variant=${variant}, Size=${size}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = size === "Icon" ? "FIXED" : "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = size === "Icon" ? 0 : 4;
  component.paddingLeft = metrics.paddingX;
  component.paddingRight = metrics.paddingX;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(metrics.width, metrics.height);
  component.cornerRadius = 8;
  component.clipsContent = false;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Badge");

  component.fills = config.background
    ? [
        paintFromVariable(
          config.background,
          config.backgroundFallback,
          variableByName,
          stats,
        ),
      ]
    : [];

  if (config.stroke) {
    component.strokes = [
      paintFromVariable(
        config.stroke,
        config.strokeFallback,
        variableByName,
        stats,
      ),
    ];
    component.strokeWeight = 1;
  } else {
    component.strokes = [];
    component.strokeWeight = 0;
  }

  bindBadgeGeometryVariables(component, metrics, config, variableByName, stats);

  await syncBadgeVariantChildren({
    component,
    variant,
    size,
    config,
    variableByName,
    iconComponent,
    fonts,
    stats,
  });
}

async function createCardVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateCardVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseCardVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (CARD_CONTENT.indexOf(values.Content) === -1) {
    return null;
  }

  return {
    value: values.Content,
  };
}

async function updateCardVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  component.name = `Content=${value}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 0;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(360, 100);
  component.cornerRadius = 16;
  component.clipsContent = false;
  component.fills = [
    paintFromVariable("Surface/0", "#FFFFFF", variableByName, stats),
  ];
  component.strokes = [
    paintFromVariable(
      "Colors/foreground/500",
      "#747B8B",
      variableByName,
      stats,
    ),
  ];
  component.strokeWeight = 1;
  component.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.05 },
      offset: { x: 0, y: 1 },
      radius: 2,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Card");

  await syncCardVariantChildren({
    component,
    value,
    variableByName,
    fonts,
    stats,
  });
}

async function createTabsVariant({
  count,
  active,
  state,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateTabsVariant(component, {
    count,
    active,
    state,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseTabsVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    TABS_COUNTS.indexOf(values.Count) === -1 ||
    TABS_ACTIVE.indexOf(values.Active) === -1 ||
    TABS_STATES.indexOf(values.State) === -1 ||
    !tabsActiveIsValidForCount(values.Active, values.Count)
  ) {
    return null;
  }

  return {
    count: values.Count,
    active: values.Active,
    state: values.State,
  };
}

async function updateTabsVariant(
  component,
  { count, active, state, variableByName, fonts, stats },
) {
  const tabCount = TABS_COUNT_TO_NUMBER[count];
  const width = tabsWidthForCount(count);

  component.name = `Count=${count}, Active=${active}, State=${state}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 0;
  component.paddingLeft = 4;
  component.paddingRight = 4;
  component.paddingTop = 4;
  component.paddingBottom = 4;
  component.resizeWithoutConstraints(width, 44);
  component.cornerRadius = 16;
  component.clipsContent = false;
  component.fills = [
    paintFromVariable(
      "Colors/background/100",
      "#E3E4E8",
      variableByName,
      stats,
    ),
  ];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Tabs");

  await syncTabsVariantChildren({
    component,
    count,
    active,
    state,
    tabCount,
    width,
    variableByName,
    fonts,
    stats,
  });
}

async function createTooltipVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateTooltipVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseTooltipVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (TOOLTIP_SIDES.indexOf(values.Side) === -1) {
    return null;
  }

  return {
    value: values.Side,
  };
}

async function updateTooltipVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  const side = value;

  component.name = `Side=${side}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 0;
  component.paddingLeft = 12;
  component.paddingRight = 12;
  component.paddingTop = 6;
  component.paddingBottom = 6;
  component.cornerRadius = 8;
  component.clipsContent = false;
  component.fills = [
    paintFromVariable("Surface/0", "#FFFFFF", variableByName, stats),
  ];
  component.strokes = [
    paintFromVariable(
      "Colors/background/200",
      "#E3E4E8",
      variableByName,
      stats,
    ),
  ];
  component.strokeWeight = 1;
  component.effects = tooltipShadowEffects();
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Tooltip");
  component.setSharedPluginData(RUN_NAMESPACE, "side", side);

  await syncTooltipVariantChildren({
    component,
    side,
    variableByName,
    fonts,
    stats,
  });
}

async function createDialogVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateDialogVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseDialogVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (DIALOG_CONTENT.indexOf(values.Content) === -1) {
    return null;
  }

  return {
    value: values.Content,
  };
}

async function updateDialogVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  component.name = `Content=${value}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 16;
  component.paddingLeft = 24;
  component.paddingRight = 24;
  component.paddingTop = 24;
  component.paddingBottom = 24;
  component.resizeWithoutConstraints(512, 100);
  component.cornerRadius = 16;
  component.clipsContent = false;
  component.fills = [
    paintFromVariable("Surface/0", "#FFFFFF", variableByName, stats),
  ];
  component.strokes = [
    paintFromVariable(
      "Colors/foreground/500",
      "#747B8B",
      variableByName,
      stats,
    ),
  ];
  component.strokeWeight = 1;
  component.effects = tooltipShadowEffects();
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Dialog");

  await syncDialogVariantChildren({
    component,
    value,
    variableByName,
    fonts,
    stats,
  });
}

async function createPopoverVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updatePopoverVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parsePopoverVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (POPOVER_SIDES.indexOf(values.Side) === -1) {
    return null;
  }

  return {
    value: values.Side,
  };
}

async function updatePopoverVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  const side = value;

  component.name = `Side=${side}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 16;
  component.paddingLeft = 16;
  component.paddingRight = 16;
  component.paddingTop = 16;
  component.paddingBottom = 16;
  component.resizeWithoutConstraints(288, 100);
  component.cornerRadius = 8;
  component.clipsContent = false;
  component.fills = [
    paintFromVariable("Surface/0", "#FFFFFF", variableByName, stats),
  ];
  component.strokes = [
    paintFromVariable(
      "Colors/foreground/500",
      "#747B8B",
      variableByName,
      stats,
    ),
  ];
  component.strokeWeight = 1;
  component.effects = tooltipShadowEffects();
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Popover");
  component.setSharedPluginData(RUN_NAMESPACE, "side", side);

  await syncPopoverVariantChildren({
    component,
    side,
    variableByName,
    fonts,
    stats,
  });
}

async function createMenuVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateMenuVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseMenuVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (MENU_CONTENT.indexOf(values.Content) === -1) {
    return null;
  }

  return {
    value: values.Content,
  };
}

async function updateMenuVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  component.name = `Content=${value}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 0;
  component.paddingLeft = 4;
  component.paddingRight = 4;
  component.paddingTop = 4;
  component.paddingBottom = 4;
  component.resizeWithoutConstraints(192, 100);
  component.cornerRadius = 8;
  component.clipsContent = false;
  component.fills = [
    paintFromVariable("Surface/0", "#FFFFFF", variableByName, stats),
  ];
  component.strokes = [
    paintFromVariable(
      "Colors/foreground/500",
      "#747B8B",
      variableByName,
      stats,
    ),
  ];
  component.strokeWeight = 1;
  component.effects = tooltipShadowEffects();
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Menu");

  await syncMenuVariantChildren({
    component,
    value,
    variableByName,
    fonts,
    stats,
  });
}

async function createCheckboxVariant({
  checked,
  state,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateCheckboxVariant(component, {
    checked,
    state,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseCheckboxVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    CHECKBOX_CHECKED.indexOf(values.Checked) === -1 ||
    CHECKBOX_STATES.indexOf(values.State) === -1
  ) {
    return null;
  }

  return {
    checked: values.Checked,
    state: values.State,
  };
}

async function updateCheckboxVariant(
  component,
  { checked, state, variableByName, fonts, stats },
) {
  const config = checkboxConfig(checked, state);

  component.name = `Checked=${checked}, State=${state}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 8;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(176, 44);
  component.cornerRadius = 0;
  component.clipsContent = false;
  component.fills = [];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Checkbox");

  await syncCheckboxVariantChildren({
    component,
    checked,
    state,
    config,
    variableByName,
    fonts,
    stats,
  });
}

async function createRadioVariant({
  checked,
  state,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateRadioVariant(component, {
    checked,
    state,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseRadioVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    RADIO_CHECKED.indexOf(values.Checked) === -1 ||
    RADIO_STATES.indexOf(values.State) === -1
  ) {
    return null;
  }

  return {
    checked: values.Checked,
    state: values.State,
  };
}

async function updateRadioVariant(
  component,
  { checked, state, variableByName, fonts, stats },
) {
  const config = radioConfig(checked, state);

  component.name = `Checked=${checked}, State=${state}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 8;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(176, 44);
  component.cornerRadius = 0;
  component.clipsContent = false;
  component.fills = [];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Radio");

  await syncRadioVariantChildren({
    component,
    checked,
    state,
    config,
    variableByName,
    fonts,
    stats,
  });
}

async function createSwitchVariant({
  checked,
  state,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateSwitchVariant(component, {
    checked,
    state,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseSwitchVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  if (
    SWITCH_CHECKED.indexOf(values.Checked) === -1 ||
    SWITCH_STATES.indexOf(values.State) === -1
  ) {
    return null;
  }

  return {
    checked: values.Checked,
    state: values.State,
  };
}

async function updateSwitchVariant(
  component,
  { checked, state, variableByName, fonts, stats },
) {
  const config = switchConfig(checked, state);

  component.name = `Checked=${checked}, State=${state}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 8;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(176, 44);
  component.cornerRadius = 0;
  component.clipsContent = false;
  component.fills = [];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Switch");

  await syncSwitchVariantChildren({
    component,
    checked,
    state,
    config,
    variableByName,
    fonts,
    stats,
  });
}

async function createInputVariant({
  state,
  status,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateInputVariant(component, {
    state,
    status,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseInputVariantName(name) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  let state = values.State;
  let status = values.Status || "Default";

  if (state === "Error" && !values.Status) {
    state = "Default";
    status = "Error";
  }

  if (INPUT_STATES.indexOf(state) === -1) {
    return null;
  }

  if (INPUT_STATUSES.indexOf(status) === -1) {
    return null;
  }

  return {
    state,
    status,
  };
}

async function updateInputVariant(
  component,
  { state, status, variableByName, fonts, stats },
) {
  const config = inputConfig(state, status);

  component.name = `State=${state}, Status=${status}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 6;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(320, 96);
  component.cornerRadius = 0;
  component.clipsContent = false;
  component.fills = [];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Input");

  await syncInputVariantChildren({
    component,
    state,
    status,
    config,
    variableByName,
    fonts,
    stats,
  });
}

function layoutInputVariants(componentSet) {
  if (!componentSet || !componentSet.children) return;

  for (const child of componentSet.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseInputVariantName(child.name);
    if (!props) continue;

    const stateIndex = INPUT_STATES.indexOf(props.state);
    const statusIndex = INPUT_STATUSES.indexOf(props.status);
    child.x = statusIndex * 360;
    child.y = stateIndex * 126;
  }
}

async function createTextareaVariant({
  state,
  status,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateTextareaVariant(component, {
    state,
    status,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseTextareaVariantName(name) {
  return parseStateStatusVariantName(name, TEXTAREA_STATES, TEXTAREA_STATUSES);
}

async function updateTextareaVariant(
  component,
  { state, status, variableByName, fonts, stats },
) {
  const config = inputConfig(state, status);

  component.name = `State=${state}, Status=${status}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 6;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(320, 132);
  component.cornerRadius = 0;
  component.clipsContent = false;
  component.fills = [];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Textarea");

  await syncTextareaVariantChildren({
    component,
    state,
    status,
    config,
    variableByName,
    fonts,
    stats,
  });
}

async function createSearchVariant({
  state,
  status,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateSearchVariant(component, {
    state,
    status,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseSearchVariantName(name) {
  return parseStateStatusVariantName(name, SEARCH_STATES, SEARCH_STATUSES);
}

async function updateSearchVariant(
  component,
  { state, status, variableByName, fonts, stats },
) {
  const config = inputConfig(state, status);

  component.name = `State=${state}, Status=${status}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 6;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(320, 96);
  component.cornerRadius = 0;
  component.clipsContent = false;
  component.fills = [];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Search");

  await syncSearchVariantChildren({
    component,
    state,
    status,
    config,
    variableByName,
    fonts,
    stats,
  });
}

async function createSelectVariant({
  state,
  status,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateSelectVariant(component, {
    state,
    status,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseSelectVariantName(name) {
  return parseStateStatusVariantName(name, SELECT_STATES, SELECT_STATUSES);
}

async function updateSelectVariant(
  component,
  { state, status, variableByName, fonts, stats },
) {
  const config = inputConfig(state, status);

  component.name = `State=${state}, Status=${status}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 0;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(320, 44);
  component.cornerRadius = 0;
  component.clipsContent = false;
  component.fills = [];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Select");

  await syncSelectVariantChildren({
    component,
    state,
    status,
    config,
    variableByName,
    fonts,
    stats,
  });
}

async function createSliderVariant({
  state,
  status,
  variableByName,
  fonts,
  stats,
}) {
  const component = figma.createComponent();
  await updateSliderVariant(component, {
    state,
    status,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseSliderVariantName(name) {
  return parseStateStatusVariantName(name, SLIDER_STATES, SLIDER_STATUSES);
}

async function updateSliderVariant(
  component,
  { state, status, variableByName, fonts, stats },
) {
  const config = sliderConfig(state, status);

  component.name = `State=${state}, Status=${status}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 6;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.resizeWithoutConstraints(320, 70);
  component.cornerRadius = 0;
  component.clipsContent = false;
  component.fills = [];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Slider");

  await syncSliderVariantChildren({
    component,
    state,
    status,
    config,
    variableByName,
    fonts,
    stats,
  });
}

async function createProgressVariant({ value, variableByName, stats }) {
  const component = figma.createComponent();
  await updateProgressVariant(component, {
    value,
    variableByName,
    stats,
  });
  return component;
}

function parseProgressVariantName(name) {
  return parseSingleAxisVariantName(name, "Value", PROGRESS_VALUES);
}

async function updateProgressVariant(
  component,
  { value, variableByName, stats },
) {
  const config = progressConfig(value);

  component.name = `Value=${value}`;
  component.layoutMode = "NONE";
  component.resizeWithoutConstraints(320, 8);
  component.cornerRadius = 0;
  component.clipsContent = false;
  component.fills = [];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Progress");

  await syncProgressVariantChildren({
    component,
    value,
    config,
    variableByName,
    stats,
  });
}

async function createSpinnerVariant({ value, variableByName, stats }) {
  const component = figma.createComponent();
  await updateSpinnerVariant(component, {
    value,
    variableByName,
    stats,
  });
  return component;
}

function parseSpinnerVariantName(name) {
  return parseSingleAxisVariantName(name, "Size", SPINNER_SIZES);
}

async function updateSpinnerVariant(
  component,
  { value, variableByName, stats },
) {
  const metrics = spinnerMetrics(value);

  component.name = `Size=${value}`;
  component.layoutMode = "NONE";
  component.resizeWithoutConstraints(metrics.size, metrics.size);
  component.cornerRadius = 0;
  component.clipsContent = false;
  component.fills = [];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Spinner");
  bindSizeVariables(
    component,
    metrics.sizeToken,
    metrics.sizeToken,
    variableByName,
    stats,
  );

  await syncSpinnerVariantChildren({
    component,
    metrics,
    variableByName,
    stats,
  });
}

async function createAvatarVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateAvatarVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseAvatarVariantName(name) {
  return parseSingleAxisVariantName(name, "Content", AVATAR_CONTENT);
}

async function updateAvatarVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  const config = avatarConfig(value);

  component.name = `Content=${value}`;
  component.layoutMode = "NONE";
  component.resizeWithoutConstraints(40, 40);
  component.cornerRadius = 9999;
  component.clipsContent = true;
  component.fills = [
    paintFromVariable(
      config.background,
      config.backgroundFallback,
      variableByName,
      stats,
    ),
  ];
  component.strokes = [];
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Avatar");
  bindAvatarGeometryVariables(component, variableByName, stats);

  await syncAvatarVariantChildren({
    component,
    value,
    config,
    variableByName,
    fonts,
    stats,
  });
}

async function createAlertVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateAlertVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseAlertVariantName(name) {
  return parseSingleAxisVariantName(name, "Variant", ALERT_VARIANTS);
}

async function updateAlertVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  const config = alertConfig(value);

  component.name = `Variant=${value}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "AUTO";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 8;
  component.paddingLeft = 16;
  component.paddingRight = 16;
  component.paddingTop = 16;
  component.paddingBottom = 16;
  component.resizeWithoutConstraints(360, 92);
  component.cornerRadius = 12;
  component.clipsContent = false;
  component.fills = [
    paintFromVariable(
      config.background,
      config.backgroundFallback,
      variableByName,
      stats,
    ),
  ];
  component.strokes = [
    paintFromVariable(
      config.stroke,
      config.strokeFallback,
      variableByName,
      stats,
    ),
  ];
  component.strokeWeight = 1;
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Alert");

  await syncAlertVariantChildren({
    component,
    value,
    config,
    variableByName,
    fonts,
    stats,
  });
}

async function createToastVariant({ value, variableByName, fonts, stats }) {
  const component = figma.createComponent();
  await updateToastVariant(component, {
    value,
    variableByName,
    fonts,
    stats,
  });
  return component;
}

function parseToastVariantName(name) {
  return parseSingleAxisVariantName(name, "Content", TOAST_CONTENT);
}

async function updateToastVariant(
  component,
  { value, variableByName, fonts, stats },
) {
  component.name = `Content=${value}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "AUTO";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 16;
  component.paddingLeft = 24;
  component.paddingRight = 32;
  component.paddingTop = 24;
  component.paddingBottom = 24;
  component.resizeWithoutConstraints(420, 100);
  component.cornerRadius = 8;
  component.clipsContent = false;
  component.fills = [
    paintFromVariable("Surface/0", "#FFFFFF", variableByName, stats),
  ];
  component.strokes = [
    paintFromVariable(
      "Colors/foreground/500",
      "#747B8B",
      variableByName,
      stats,
    ),
  ];
  component.strokeWeight = 1;
  component.effects = tooltipShadowEffects();
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "component-variant");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Toast");

  await syncToastVariantChildren({
    component,
    value,
    variableByName,
    fonts,
    stats,
  });
}

function parseSingleAxisVariantName(name, axisName, values) {
  const parts = name.split(",");
  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key !== axisName || values.indexOf(value) === -1) continue;
    return { value };
  }

  return null;
}

function parseStateStatusVariantName(name, states, statuses) {
  const values = {};
  const parts = name.split(",");

  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    values[key] = value;
  }

  const state = values.State;
  const status = values.Status || "Default";

  if (states.indexOf(state) === -1 || statuses.indexOf(status) === -1) {
    return null;
  }

  return { state, status };
}

async function syncIconButtonChildren({
  component,
  variant,
  state,
  config,
  variableByName,
  iconSize,
  iconSizeToken,
  spinnerSize,
  spinnerSizeToken,
  stats,
}) {
  removeGeneratedButtonChild(
    component,
    "Loading Indicator",
    state !== "Loading",
  );
  removeGeneratedButtonChild(component, "Icon", state === "Loading");
  removeGeneratedButtonChild(component, "Label Text", true);

  if (state === "Loading") {
    let spinner = directChildNamed(component, "Loading Indicator");
    if (spinner && spinner.type !== "ELLIPSE") {
      spinner.remove();
      spinner = null;
    }

    if (!spinner) {
      spinner = createSpinnerGlyph(
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
        spinnerSize,
        spinnerSizeToken,
      );
    } else {
      spinner.resize(spinnerSize, spinnerSize);
      bindSizeVariables(
        spinner,
        spinnerSizeToken,
        spinnerSizeToken,
        variableByName,
        stats,
      );
      spinner.fills = [];
      spinner.strokes = [
        paintFromVariable(
          config.foreground,
          config.foregroundFallback,
          variableByName,
          stats,
        ),
      ];
      spinner.strokeWeight = 2;
      spinner.dashPattern = [8, 4];
    }
    component.appendChild(spinner);
    return;
  }
}

async function syncButtonVariantChildren({
  component,
  variant,
  size,
  state,
  config,
  variableByName,
  fonts,
  textStyle,
  stats,
}) {
  const metrics = buttonMetrics(size);
  removeGeneratedButtonChild(
    component,
    "Loading Indicator",
    state !== "Loading",
  );
  removeGeneratedButtonChild(
    component,
    "Icon",
    size !== "Icon" || state === "Loading",
  );
  removeGeneratedButtonChild(component, "Label Text", size === "Icon");

  if (state === "Loading") {
    let spinner = directChildNamed(component, "Loading Indicator");
    if (spinner && spinner.type !== "ELLIPSE") {
      spinner.remove();
      spinner = null;
    }

    if (!spinner) {
      spinner = createSpinnerGlyph(
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
        metrics.spinnerSize,
        metrics.spinnerSizeToken,
      );
    } else {
      spinner.resize(metrics.spinnerSize, metrics.spinnerSize);
      bindSizeVariables(
        spinner,
        metrics.spinnerSizeToken,
        metrics.spinnerSizeToken,
        variableByName,
        stats,
      );
      spinner.fills = [];
      spinner.strokes = [
        paintFromVariable(
          config.foreground,
          config.foregroundFallback,
          variableByName,
          stats,
        ),
      ];
      spinner.strokeWeight = 2;
      spinner.dashPattern = [8, 4];
    }
    component.appendChild(spinner);
  }

  if (size !== "Icon") {
    let label = directChildNamed(component, "Label Text");
    if (label && label.type !== "TEXT") {
      label.remove();
      label = null;
    }

    if (!label || label.type !== "TEXT") {
      label = figma.createText();
      label.name = "Label Text";
    }

    await applyButtonLabelTypography(
      label,
      fonts,
      textStyle,
      variableByName,
      stats,
    );
    label.characters = state === "Loading" ? "Loading" : variant;
    label.fills = [
      paintFromVariable(
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
      ),
    ];
    label.textDecoration = variant === "Link" ? "UNDERLINE" : "NONE";
    component.appendChild(label);
  }
}

async function syncCounterVariantChildren({
  component,
  tone,
  size,
  config,
  variableByName,
  fonts,
  stats,
}) {
  let text = directChildNamed(component, "Counter Text");
  if (text && text.type !== "TEXT") {
    text.remove();
    text = null;
  }

  if (!text || text.type !== "TEXT") {
    text = figma.createText();
    text.name = "Counter Text";
  }

  applyCounterTypography(text, size, fonts, variableByName, stats);
  text.characters = tone === "Brand" ? "12" : "2";
  text.fills = [
    paintFromVariable(
      config.foreground,
      config.foregroundFallback,
      variableByName,
      stats,
    ),
  ];
  text.textDecoration = "NONE";
  text.textAlignHorizontal = "CENTER";
  text.textAlignVertical = "CENTER";
  component.appendChild(text);
  setHugChildSizing(text);
}

async function syncBadgeVariantChildren({
  component,
  variant,
  size,
  config,
  variableByName,
  iconComponent,
  fonts,
  stats,
}) {
  removeGeneratedButtonChild(component, "Loading Indicator", true);
  removeGeneratedButtonChild(component, "Icon", size !== "Icon");
  removeGeneratedButtonChild(component, "Label Text", size === "Icon");
  removeGeneratedButtonChild(component, "Counter", size === "Icon");
  removeGeneratedButtonChild(component, "Counter Text", true);

  if (size === "Icon") {
    let icon = directChildNamed(component, "Icon");
    if (icon && icon.type === "INSTANCE" && !isGeneratedIconSlotWrapper(icon)) {
      syncIconSlotInstance(
        icon,
        config,
        variableByName,
        stats,
        16,
        "Badge/icon/size",
      );
    } else if (iconComponent) {
      if (icon) icon.remove();
      icon = createIconSlotInstance(
        iconComponent,
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
        16,
        "Badge/icon/size",
      );
    }

    if (icon) {
      component.appendChild(icon);
      setHugChildSizing(icon);
    }
    return;
  }

  let label = directChildNamed(component, "Label Text");
  if (label && label.type !== "TEXT") {
    label.remove();
    label = null;
  }

  if (!label || label.type !== "TEXT") {
    label = figma.createText();
    label.name = "Label Text";
  }

  applyBadgeLabelTypography(label, fonts, variableByName, stats);
  label.characters = badgeLabelText(variant, size);
  label.fills = [
    paintFromVariable(
      config.foreground,
      config.foregroundFallback,
      variableByName,
      stats,
    ),
  ];
  label.textDecoration = variant === "Link" ? "UNDERLINE" : "NONE";
  label.textAlignHorizontal = "CENTER";
  label.textAlignVertical = "CENTER";
  component.appendChild(label);
  setHugChildSizing(label);

  let counter = directChildNamed(component, "Counter");
  if (counter && !isNestedComponentInstance(counter, "Counter / v1")) {
    counter.remove();
    counter = null;
  }

  let counterSet = null;
  const counterTone = counterToneForBadgeVariant(variant);
  if (!counter) {
    const created = await createNestedComponentInstance({
      componentSetName: "Counter / v1",
      variantProperties: {
        Tone: counterTone,
        Size: "Default",
      },
      name: "Counter",
      stats,
    });
    if (!created) {
      counter = createMissingNestedComponentNode(
        "Counter",
        "Build Counter / v1 before updating Badge.",
        stats,
      );
    } else {
      counter = created.instance;
      counterSet = created.componentSet;
    }
  } else {
    counterSet = await findLocalComponentSetByName("Counter / v1");
  }

  if (counter.type === "INSTANCE" && counterSet) {
    try {
      counter.setProperties({
        Tone: counterTone,
        Size: "Default",
      });
    } catch (error) {
      stats.warnings.push(
        `Badge Counter: could not set Counter variant properties (${messageFor(error)}).`,
      );
    }
    setInstanceTextProperty(counter, counterSet, "Counter Text", "2", stats);
    markNestedComponentInstance(counter, "Counter / v1", "badge-counter");
  }

  if (counter.setSharedPluginData) {
    counter.setSharedPluginData(RUN_NAMESPACE, "role", "badge-counter");
  }
  counter.visible = false;
  component.appendChild(counter);
  setHugChildSizing(counter);

  if (counter.type === "INSTANCE" && counterSet) {
    exposeNestedCounterInstance(counter, stats);
  }
}

async function syncCardVariantChildren({
  component,
  value,
  variableByName,
  fonts,
  stats,
}) {
  const hasHeader = value === "Header" || value === "Full";
  const hasFooter = value === "Full";

  let header = directChildNamed(component, "Card Header");
  if (header && header.type !== "FRAME") {
    header.remove();
    header = null;
  }

  if (hasHeader && (!header || header.type !== "FRAME")) {
    header = figma.createFrame();
    header.name = "Card Header";
  }

  if (header && hasHeader) {
    header.layoutMode = "VERTICAL";
    header.primaryAxisSizingMode = "AUTO";
    header.counterAxisSizingMode = "FIXED";
    header.primaryAxisAlignItems = "MIN";
    header.counterAxisAlignItems = "MIN";
    header.itemSpacing = 6;
    header.paddingLeft = 24;
    header.paddingRight = 24;
    header.paddingTop = 24;
    header.paddingBottom = 24;
    header.resizeWithoutConstraints(360, 80);
    header.fills = [];
    header.strokes = [];
    header.clipsContent = false;
    setLayoutSizingHorizontal(header, "FILL");

    let title = directChildNamed(header, "Title Text");
    if (title && title.type !== "TEXT") {
      title.remove();
      title = null;
    }
    if (!title || title.type !== "TEXT") {
      title = figma.createText();
      title.name = "Title Text";
    }
    applyCardTitleTypography(title, fonts, variableByName, stats);
    title.characters = cardTitleText(value);
    title.fills = [
      paintFromVariable(
        "Colors/foreground/0",
        "#000000",
        variableByName,
        stats,
      ),
    ];
    title.resizeWithoutConstraints(312, 24);
    setLayoutSizingHorizontal(title, "FILL");
    setTextAutoResize(title, "HEIGHT");

    let description = directChildNamed(header, "Description Text");
    if (description && description.type !== "TEXT") {
      description.remove();
      description = null;
    }
    if (!description || description.type !== "TEXT") {
      description = figma.createText();
      description.name = "Description Text";
    }
    applyCardDescriptionTypography(description, fonts, variableByName, stats);
    description.characters = cardDescriptionText(value);
    description.fills = [
      paintFromVariable(
        "Colors/foreground/400",
        "#5D626F",
        variableByName,
        stats,
      ),
    ];
    description.resizeWithoutConstraints(312, 40);
    setLayoutSizingHorizontal(description, "FILL");
    setTextAutoResize(description, "HEIGHT");

    header.appendChild(title);
    header.appendChild(description);
    component.appendChild(header);
  } else if (header) {
    header.remove();
    header = null;
  }

  let body = directChildNamed(component, "Card Content");
  if (body && body.type !== "FRAME") {
    body.remove();
    body = null;
  }
  if (!body || body.type !== "FRAME") {
    body = figma.createFrame();
    body.name = "Card Content";
  }

  body.layoutMode = "VERTICAL";
  body.primaryAxisSizingMode = "AUTO";
  body.counterAxisSizingMode = "FIXED";
  body.primaryAxisAlignItems = "MIN";
  body.counterAxisAlignItems = "MIN";
  body.itemSpacing = 12;
  body.paddingLeft = 24;
  body.paddingRight = 24;
  body.paddingTop = hasHeader ? 0 : 24;
  body.paddingBottom = 24;
  body.resizeWithoutConstraints(360, 92);
  body.fills = [];
  body.strokes = [];
  body.clipsContent = false;
  setLayoutSizingHorizontal(body, "FILL");

  let bodyText = directChildNamed(body, "Body Text");
  if (bodyText && bodyText.type !== "TEXT") {
    bodyText.remove();
    bodyText = null;
  }
  if (!bodyText || bodyText.type !== "TEXT") {
    bodyText = figma.createText();
    bodyText.name = "Body Text";
  }
  applyCardBodyTypography(bodyText, fonts, variableByName, stats);
  bodyText.characters = cardBodyText(value);
  bodyText.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  bodyText.resizeWithoutConstraints(312, 66);
  setLayoutSizingHorizontal(bodyText, "FILL");
  setTextAutoResize(bodyText, "HEIGHT");
  body.appendChild(bodyText);
  component.appendChild(body);

  let footer = directChildNamed(component, "Card Footer");
  if (footer && footer.type !== "FRAME") {
    footer.remove();
    footer = null;
  }

  if (hasFooter && (!footer || footer.type !== "FRAME")) {
    footer = figma.createFrame();
    footer.name = "Card Footer";
  }

  if (footer && hasFooter) {
    footer.layoutMode = "HORIZONTAL";
    footer.primaryAxisSizingMode = "AUTO";
    footer.counterAxisSizingMode = "FIXED";
    footer.primaryAxisAlignItems = "MAX";
    footer.counterAxisAlignItems = "CENTER";
    footer.itemSpacing = 12;
    footer.paddingLeft = 24;
    footer.paddingRight = 24;
    footer.paddingTop = 0;
    footer.paddingBottom = 24;
    footer.resizeWithoutConstraints(360, 68);
    footer.fills = [];
    footer.strokes = [];
    footer.clipsContent = false;
    setLayoutSizingHorizontal(footer, "FILL");

    await syncCardFooterAction({
      footer,
      name: "Secondary Action",
      label: "Cancel",
      primary: false,
      stats,
    });
    await syncCardFooterAction({
      footer,
      name: "Primary Action",
      label: "Save",
      primary: true,
      stats,
    });
    component.appendChild(footer);
  } else if (footer) {
    footer.remove();
    footer = null;
  }

  bindCardGeometryVariables(
    component,
    header,
    body,
    footer,
    variableByName,
    stats,
  );
  if (body && value === "Basic") {
    bindFloatVariable(
      body,
      "paddingTop",
      "Card/padding",
      variableByName,
      stats,
    );
  }
}

async function syncCardFooterAction({ footer, name, label, primary, stats }) {
  let action = directChildNamed(footer, name);
  if (action && !isNestedComponentInstance(action, "Button / v1")) {
    action.remove();
    action = null;
  }

  let buttonSet = null;
  if (!action) {
    const created = await createNestedComponentInstance({
      componentSetName: "Button / v1",
      variantProperties: {
        Variant: primary ? "Default" : "Outline",
        Size: "Default",
        State: "Default",
      },
      name,
      stats,
    });
    if (!created) {
      action = createMissingNestedComponentNode(
        name,
        "Build Button / v1 before updating Card.",
        stats,
      );
    } else {
      action = created.instance;
      buttonSet = created.componentSet;
    }
  } else {
    buttonSet = await findLocalComponentSetByName("Button / v1");
  }

  if (action.type === "INSTANCE" && buttonSet) {
    try {
      action.setProperties({
        Variant: primary ? "Default" : "Outline",
        Size: "Default",
        State: "Default",
      });
    } catch (error) {
      stats.warnings.push(
        `Card ${name}: could not set Button variant properties (${messageFor(error)}).`,
      );
    }
    setInstanceTextProperty(action, buttonSet, "Label Text", label, stats);
  }

  action.setSharedPluginData(
    RUN_NAMESPACE,
    "role",
    primary ? "primary" : "secondary",
  );
  setLayoutSizingHorizontal(action, "HUG");
  footer.appendChild(action);
}

async function syncTabsVariantChildren({
  component,
  count,
  active,
  state,
  tabCount,
  width,
  variableByName,
  fonts,
  stats,
}) {
  const triggerWidth = (width - 8) / tabCount;
  const triggers = [];

  const existingChildren = [];
  for (const child of component.children) existingChildren.push(child);

  for (const child of existingChildren) {
    const match = /^Tab (\d+) Trigger$/.exec(child.name || "");
    if (match && Number(match[1]) > tabCount) {
      child.remove();
    }
  }

  for (let index = 0; index < tabCount; index += 1) {
    const triggerName = `Tab ${index + 1} Trigger`;
    const textName = `Tab ${index + 1} Text`;
    const isActive = TABS_ACTIVE[index] === active;
    const config = tabsTriggerConfig(state, isActive);

    let trigger = directChildNamed(component, triggerName);
    if (trigger && trigger.type !== "FRAME") {
      trigger.remove();
      trigger = null;
    }
    if (!trigger || trigger.type !== "FRAME") {
      trigger = figma.createFrame();
      trigger.name = triggerName;
    }

    trigger.layoutMode = "HORIZONTAL";
    trigger.primaryAxisSizingMode = "FIXED";
    trigger.counterAxisSizingMode = "FIXED";
    trigger.primaryAxisAlignItems = "CENTER";
    trigger.counterAxisAlignItems = "CENTER";
    trigger.itemSpacing = 0;
    trigger.paddingLeft = 12;
    trigger.paddingRight = 12;
    trigger.paddingTop = 0;
    trigger.paddingBottom = 0;
    trigger.resizeWithoutConstraints(triggerWidth, 36);
    trigger.cornerRadius = 12;
    trigger.clipsContent = false;
    trigger.fills = config.background
      ? [
          paintFromVariable(
            config.background,
            config.backgroundFallback,
            variableByName,
            stats,
          ),
        ]
      : [];
    trigger.strokes = [];
    trigger.setSharedPluginData(RUN_NAMESPACE, "kind", "tabs-trigger");
    trigger.setSharedPluginData(
      RUN_NAMESPACE,
      "active",
      isActive ? "true" : "false",
    );
    setLayoutSizingHorizontal(trigger, "FILL");
    try {
      trigger.layoutGrow = 1;
    } catch (_error) {
      // layoutGrow is unavailable on older plugin runtimes.
    }

    let text = directChildNamed(trigger, textName);
    if (text && text.type !== "TEXT") {
      text.remove();
      text = null;
    }
    if (!text || text.type !== "TEXT") {
      text = figma.createText();
      text.name = textName;
    }

    applyTabsTriggerTypography(text, fonts, variableByName, stats);
    text.characters = tabsDefaultLabel(index);
    text.fills = [
      paintFromVariable(
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
      ),
    ];
    text.textAlignHorizontal = "CENTER";
    text.textAlignVertical = "CENTER";
    trigger.appendChild(text);

    syncFocusRing(trigger, {
      enabled: state === "Focus" && isActive,
      width: triggerWidth,
      height: 36,
      radius: 12,
      variableName: "Colors/theme/500",
      fallback: "#135BEC",
      variableByName,
      stats,
    });

    component.appendChild(trigger);
    triggers.push(trigger);
  }

  bindTabsGeometryVariables(component, count, triggers, variableByName, stats);
}

async function syncTooltipVariantChildren({
  component,
  side,
  variableByName,
  fonts,
  stats,
}) {
  let text = directChildNamed(component, "Content Text");
  if (text && text.type !== "TEXT") {
    text.remove();
    text = null;
  }

  if (!text || text.type !== "TEXT") {
    text = figma.createText();
    text.name = "Content Text";
  }

  applyTooltipContentTypography(text, fonts, variableByName, stats);
  text.characters = tooltipContentText(side);
  text.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  text.textAlignHorizontal = "CENTER";
  text.textAlignVertical = "CENTER";

  component.appendChild(text);
  bindTooltipGeometryVariables(component, variableByName, stats);
  await syncTooltipTip({
    component,
    side,
    variableByName,
    stats,
  });
}

async function syncTooltipTip({ component, side, variableByName, stats }) {
  let tip = directChildNamed(component, "Tip");
  if (tip && tip.type !== "FRAME") {
    tip.remove();
    tip = null;
  }

  if (!tip || tip.type !== "FRAME") {
    tip = figma.createFrame();
    tip.name = "Tip";
  }

  component.appendChild(tip);

  try {
    tip.layoutPositioning = "ABSOLUTE";
  } catch (_error) {
    // Older Figma runtimes may not expose absolute positioning on every node.
  }

  try {
    tip.constraints = tooltipTipConstraints(side);
  } catch (_error) {
    // Constraints can be rejected on some shape contexts in older runtimes.
  }

  const longEdge = 8;
  const shortEdge = 4;
  const width = side === "Left" || side === "Right" ? shortEdge : longEdge;
  const height = side === "Left" || side === "Right" ? longEdge : shortEdge;
  const overlap = 1;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  tip.resizeWithoutConstraints(width, height);
  tip.rotation = 0;
  tip.clipsContent = false;
  tip.fills = [];
  tip.strokes = [];
  tip.strokeWeight = 0;
  tip.setSharedPluginData(RUN_NAMESPACE, "kind", "tooltip-tip");
  tip.setSharedPluginData(RUN_NAMESPACE, "side", side);
  tip.setSharedPluginData(RUN_NAMESPACE, "shape", "triangle");

  await syncTooltipTipFill({
    tip,
    side,
    width,
    height,
    variableByName,
    stats,
  });

  if (side === "Top") {
    tip.x = component.width / 2 - halfWidth;
    tip.y = component.height - overlap;
  } else if (side === "Bottom") {
    tip.x = component.width / 2 - halfWidth;
    tip.y = -height + overlap;
  } else if (side === "Right") {
    tip.x = -width + overlap;
    tip.y = component.height / 2 - halfHeight;
  } else {
    tip.x = component.width - overlap;
    tip.y = component.height / 2 - halfHeight;
  }

  bindTooltipTipVariables(tip, side, variableByName, stats);
}

async function syncTooltipTipFill({
  tip,
  side,
  width,
  height,
  variableByName,
  stats,
}) {
  let fill = directChildNamed(tip, "Tip Fill");
  if (fill && fill.type !== "VECTOR") {
    fill.remove();
    fill = null;
  }

  if (!fill || fill.type !== "VECTOR") {
    fill = figma.createVector();
    fill.name = "Tip Fill";
  }

  tip.appendChild(fill);
  fill.x = 0;
  fill.y = 0;
  fill.resizeWithoutConstraints(width, height);
  await applyVectorNetwork(fill, tooltipTipVectorNetwork(side, width, height));
  fill.fills = [
    paintFromVariable("Surface/0", "#FFFFFF", variableByName, stats),
  ];
  fill.strokes = [];
  fill.strokeWeight = 0;

  try {
    fill.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
  } catch (_error) {
    // Older plugin runtimes can reject constraints on some vector nodes.
  }
}

async function applyVectorNetwork(node, vectorNetwork) {
  if (node && typeof node.setVectorNetworkAsync === "function") {
    await node.setVectorNetworkAsync(vectorNetwork);
    return;
  }
  node.vectorNetwork = vectorNetwork;
}

function tooltipTipVectorNetwork(side, width, height) {
  const points = tooltipTipPoints(side, width, height);
  return {
    vertices: [
      {
        x: points[0].x,
        y: points[0].y,
        strokeCap: "NONE",
        strokeJoin: "MITER",
      },
      {
        x: points[1].x,
        y: points[1].y,
        strokeCap: "NONE",
        strokeJoin: "MITER",
      },
      {
        x: points[2].x,
        y: points[2].y,
        strokeCap: "NONE",
        strokeJoin: "MITER",
      },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 2,
        end: 0,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
    regions: [{ windingRule: "NONZERO", loops: [[0, 1, 2]] }],
  };
}

function tooltipTipPoints(side, width, height) {
  if (side === "Top") {
    return [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width / 2, y: height },
    ];
  }
  if (side === "Bottom") {
    return [
      { x: width / 2, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
    ];
  }
  if (side === "Right") {
    return [
      { x: 0, y: height / 2 },
      { x: width, y: 0 },
      { x: width, y: height },
    ];
  }
  return [
    { x: width, y: height / 2 },
    { x: 0, y: height },
    { x: 0, y: 0 },
  ];
}

function tooltipTipConstraints(side) {
  if (side === "Top") {
    return { horizontal: "CENTER", vertical: "MAX" };
  }
  if (side === "Bottom") {
    return { horizontal: "CENTER", vertical: "MIN" };
  }
  if (side === "Right") {
    return { horizontal: "MIN", vertical: "CENTER" };
  }
  return { horizontal: "MAX", vertical: "CENTER" };
}

function tooltipContentText(side) {
  if (side === "Top") return "Add to library";
  if (side === "Right") return "View details";
  if (side === "Bottom") return "Copied";
  return "Keyboard shortcut";
}

function tooltipShadowEffects() {
  return [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 4 },
      radius: 6,
      spread: -1,
      visible: true,
      blendMode: "NORMAL",
    },
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.06 },
      offset: { x: 0, y: 2 },
      radius: 4,
      spread: -1,
      visible: true,
      blendMode: "NORMAL",
    },
  ];
}

async function syncDialogVariantChildren({
  component,
  value,
  variableByName,
  fonts,
  stats,
}) {
  const hasFooter = value === "Form" || value === "Footer";
  removeGeneratedButtonChild(component, "Dialog Close", true);

  let header = directChildNamed(component, "Dialog Header");
  if (header && header.type !== "FRAME") {
    header.remove();
    header = null;
  }
  if (!header || header.type !== "FRAME") {
    header = figma.createFrame();
    header.name = "Dialog Header";
  }
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FIXED";
  header.primaryAxisAlignItems = "MIN";
  header.counterAxisAlignItems = "MIN";
  header.itemSpacing = 12;
  header.paddingLeft = 0;
  header.paddingRight = 0;
  header.paddingTop = 0;
  header.paddingBottom = 0;
  header.resizeWithoutConstraints(464, 56);
  header.fills = [];
  header.strokes = [];
  header.clipsContent = false;
  setLayoutSizingHorizontal(header, "FILL");

  let headerContent = directChildNamed(header, "Dialog Header Content");
  if (headerContent && headerContent.type !== "FRAME") {
    headerContent.remove();
    headerContent = null;
  }
  if (!headerContent || headerContent.type !== "FRAME") {
    headerContent = figma.createFrame();
    headerContent.name = "Dialog Header Content";
  }
  headerContent.layoutMode = "VERTICAL";
  headerContent.primaryAxisSizingMode = "AUTO";
  headerContent.counterAxisSizingMode = "FIXED";
  headerContent.primaryAxisAlignItems = "MIN";
  headerContent.counterAxisAlignItems = "MIN";
  headerContent.itemSpacing = 6;
  headerContent.paddingLeft = 0;
  headerContent.paddingRight = 0;
  headerContent.paddingTop = 0;
  headerContent.paddingBottom = 0;
  headerContent.resizeWithoutConstraints(420, 56);
  headerContent.fills = [];
  headerContent.strokes = [];
  headerContent.clipsContent = false;
  setLayoutSizingHorizontal(headerContent, "FILL");
  try {
    headerContent.layoutGrow = 1;
  } catch (_error) {
    // layoutGrow is unavailable on older plugin runtimes.
  }

  let title =
    directChildNamed(headerContent, "Title Text") ||
    directChildNamed(header, "Title Text");
  if (title && title.type !== "TEXT") {
    title.remove();
    title = null;
  }
  if (!title || title.type !== "TEXT") {
    title = figma.createText();
    title.name = "Title Text";
  }
  applyDialogTitleTypography(title, fonts, variableByName, stats);
  title.characters = dialogTitleText(value);
  title.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  title.resizeWithoutConstraints(420, 24);
  setLayoutSizingHorizontal(title, "FILL");
  setTextAutoResize(title, "HEIGHT");

  let description =
    directChildNamed(headerContent, "Description Text") ||
    directChildNamed(header, "Description Text");
  if (description && description.type !== "TEXT") {
    description.remove();
    description = null;
  }
  if (!description || description.type !== "TEXT") {
    description = figma.createText();
    description.name = "Description Text";
  }
  applyDialogDescriptionTypography(description, fonts, variableByName, stats);
  description.characters = dialogDescriptionText(value);
  description.fills = [
    paintFromVariable(
      "Colors/foreground/400",
      "#5D626F",
      variableByName,
      stats,
    ),
  ];
  description.resizeWithoutConstraints(420, 40);
  setLayoutSizingHorizontal(description, "FILL");
  setTextAutoResize(description, "HEIGHT");

  headerContent.appendChild(title);
  setLayoutSizingHorizontal(title, "FILL");
  setLayoutSizingVertical(title, "HUG");
  headerContent.appendChild(description);
  setLayoutSizingHorizontal(description, "FILL");
  setLayoutSizingVertical(description, "HUG");
  header.appendChild(headerContent);
  setLayoutSizingHorizontal(headerContent, "FILL");
  setLayoutSizingVertical(headerContent, "HUG");

  const close = await syncInlineCloseButton({
    parent: header,
    name: "Dialog Close",
    kind: "dialog-close",
    size: 32,
    iconSize: 16,
    iconSizeToken: "Dialog/close/icon/size",
    variableByName,
    stats,
  });

  component.appendChild(header);
  setVerticalStackChildSizing(header);

  let body = directChildNamed(component, "Dialog Body");
  if (body && body.type !== "FRAME") {
    body.remove();
    body = null;
  }
  if (!body || body.type !== "FRAME") {
    body = figma.createFrame();
    body.name = "Dialog Body";
  }
  body.layoutMode = "VERTICAL";
  body.primaryAxisSizingMode = "AUTO";
  body.counterAxisSizingMode = "FIXED";
  body.primaryAxisAlignItems = "MIN";
  body.counterAxisAlignItems = "MIN";
  body.itemSpacing = 12;
  body.paddingLeft = 0;
  body.paddingRight = 0;
  body.paddingTop = 0;
  body.paddingBottom = 0;
  body.resizeWithoutConstraints(464, value === "Form" ? 132 : 60);
  body.fills = [];
  body.strokes = [];
  body.clipsContent = false;
  setLayoutSizingHorizontal(body, "FILL");

  let bodyText = directChildNamed(body, "Body Text");
  if (bodyText && bodyText.type !== "TEXT") {
    bodyText.remove();
    bodyText = null;
  }
  if (!bodyText || bodyText.type !== "TEXT") {
    bodyText = figma.createText();
    bodyText.name = "Body Text";
  }
  applyDialogBodyTypography(bodyText, fonts, variableByName, stats);
  bodyText.characters = dialogBodyText(value);
  bodyText.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  bodyText.resizeWithoutConstraints(464, 44);
  setLayoutSizingHorizontal(bodyText, "FILL");
  setTextAutoResize(bodyText, "HEIGHT");
  body.appendChild(bodyText);
  setLayoutSizingHorizontal(bodyText, "FILL");
  setLayoutSizingVertical(bodyText, "HUG");

  if (value === "Form") {
    removeGeneratedButtonChild(body, "Name Field", true);
    removeGeneratedButtonChild(body, "Username Field", true);
    await syncDialogInput({
      body,
      name: "Name Input",
      label: "Name",
      placeholder: "Pedro Duarte",
      stats,
    });
    await syncDialogInput({
      body,
      name: "Username Input",
      label: "Username",
      placeholder: "@peduarte",
      stats,
    });
  } else {
    removeGeneratedButtonChild(body, "Name Field", true);
    removeGeneratedButtonChild(body, "Username Field", true);
    removeGeneratedButtonChild(body, "Name Input", true);
    removeGeneratedButtonChild(body, "Username Input", true);
  }

  component.appendChild(body);
  setVerticalStackChildSizing(body);

  let footer = directChildNamed(component, "Dialog Footer");
  if (footer && footer.type !== "FRAME") {
    footer.remove();
    footer = null;
  }

  if (hasFooter && (!footer || footer.type !== "FRAME")) {
    footer = figma.createFrame();
    footer.name = "Dialog Footer";
  }

  if (footer && hasFooter) {
    footer.layoutMode = "HORIZONTAL";
    footer.primaryAxisSizingMode = "AUTO";
    footer.counterAxisSizingMode = "FIXED";
    footer.primaryAxisAlignItems = "MAX";
    footer.counterAxisAlignItems = "CENTER";
    footer.itemSpacing = 8;
    footer.paddingLeft = 0;
    footer.paddingRight = 0;
    footer.paddingTop = 0;
    footer.paddingBottom = 0;
    footer.resizeWithoutConstraints(464, 44);
    footer.fills = [];
    footer.strokes = [];
    footer.clipsContent = false;

    await syncDialogFooterAction({
      footer,
      name: "Secondary Action",
      label: "Cancel",
      primary: false,
      stats,
    });
    await syncDialogFooterAction({
      footer,
      name: "Primary Action",
      label: "Save changes",
      primary: true,
      stats,
    });
    component.appendChild(footer);
    setDialogFooterContainerSizing(footer, variableByName, stats);
  } else if (footer) {
    footer.remove();
    footer = null;
  }

  bindDialogGeometryVariables(
    component,
    header,
    body,
    footer,
    close,
    variableByName,
    stats,
  );
}

async function syncDialogInput({ body, name, label, placeholder, stats }) {
  let input = directChildNamed(body, name);
  if (input && !isNestedComponentInstance(input, "Input / v1")) {
    input.remove();
    input = null;
  }

  let inputSet = null;
  if (!input) {
    const created = await createNestedComponentInstance({
      componentSetName: "Input / v1",
      variantProperties: {
        State: "Default",
        Status: "Default",
      },
      name,
      stats,
    });
    if (!created) {
      input = createMissingNestedComponentNode(
        name,
        "Build Input / v1 before updating Dialog.",
        stats,
      );
    } else {
      input = created.instance;
      inputSet = created.componentSet;
    }
  } else {
    inputSet = await findLocalComponentSetByName("Input / v1");
  }

  if (input.type === "INSTANCE" && inputSet) {
    try {
      input.setProperties({
        State: "Default",
        Status: "Default",
      });
    } catch (error) {
      stats.warnings.push(
        `Dialog ${name}: could not set Input variant properties (${messageFor(error)}).`,
      );
    }
    setInstanceTextProperty(input, inputSet, "Label Text", label, stats);
    setInstanceTextProperty(
      input,
      inputSet,
      "Placeholder Text",
      placeholder,
      stats,
    );
    setInstanceBooleanProperty(
      input,
      inputSet,
      "Show Helper Text",
      false,
      stats,
    );
  }

  body.appendChild(input);
  setVerticalStackChildSizing(input);
}

async function syncDialogFooterAction({ footer, name, label, primary, stats }) {
  const size = primary ? "Large" : "Default";
  let action = directChildNamed(footer, name);
  if (action && !isNestedComponentInstance(action, "Button / v1")) {
    action.remove();
    action = null;
  }

  let buttonSet = null;
  if (!action) {
    const created = await createNestedComponentInstance({
      componentSetName: "Button / v1",
      variantProperties: {
        Variant: primary ? "Default" : "Outline",
        Size: size,
        State: "Default",
      },
      name,
      stats,
    });
    if (!created) {
      action = createMissingNestedComponentNode(
        name,
        "Build Button / v1 before updating Dialog.",
        stats,
      );
    } else {
      action = created.instance;
      buttonSet = created.componentSet;
    }
  } else {
    buttonSet = await findLocalComponentSetByName("Button / v1");
  }

  if (action.type === "INSTANCE" && buttonSet) {
    try {
      action.setProperties({
        Variant: primary ? "Default" : "Outline",
        Size: size,
        State: "Default",
      });
    } catch (error) {
      stats.warnings.push(
        `Dialog ${name}: could not set Button variant properties (${messageFor(error)}).`,
      );
    }
    setInstanceTextProperty(action, buttonSet, "Label Text", label, stats);
  }

  action.setSharedPluginData(
    RUN_NAMESPACE,
    "role",
    primary ? "primary" : "secondary",
  );
  footer.appendChild(action);
  setDialogFooterActionSizing(action, label, size);
}

function setDialogFooterContainerSizing(footer, variableByName, stats) {
  resizeNodeWithoutConstraints(footer, footer.width || 464, 44);
  setLayoutSizingHorizontal(footer, "FILL");
  setLayoutSizingVertical(footer, "FIXED");
  bindFloatVariable(
    footer,
    "height",
    "Dialog/footer/height",
    variableByName,
    stats,
  );

  try {
    footer.layoutAlign = "STRETCH";
  } catch (_error) {
    // layoutAlign is unavailable on older plugin runtimes.
  }

  try {
    footer.layoutGrow = 0;
  } catch (_error) {
    // layoutGrow is unavailable on older plugin runtimes.
  }
}

function setDialogFooterActionSizing(action, label, size) {
  if (!action) return;

  const metrics = buttonMetrics(size);
  const width = expectedDialogFooterActionWidth(label, size);
  const height = metrics.height;

  setLayoutSizingHorizontal(action, "FIXED");
  setLayoutSizingVertical(action, "FIXED");
  resizeNodeWithoutConstraints(action, width, height);

  try {
    action.layoutAlign = "CENTER";
  } catch (_error) {
    // layoutAlign is unavailable on older plugin runtimes.
  }

  try {
    action.layoutGrow = 0;
  } catch (_error) {
    // layoutGrow is unavailable on older plugin runtimes.
  }
}

function expectedDialogFooterActionWidth(label, size) {
  const metrics = buttonMetrics(size);
  const text = String(label || "");
  const estimatedLabelWidth = Math.ceil(text.length * 7.5);
  return Math.max(metrics.width, estimatedLabelWidth + metrics.paddingX * 2);
}

async function syncPopoverVariantChildren({
  component,
  side,
  variableByName,
  fonts,
  stats,
}) {
  let content = directChildNamed(component, "Popover Content");
  if (content && content.type !== "FRAME") {
    content.remove();
    content = null;
  }
  if (!content || content.type !== "FRAME") {
    content = figma.createFrame();
    content.name = "Popover Content";
  }
  content.layoutMode = "VERTICAL";
  content.primaryAxisSizingMode = "AUTO";
  content.counterAxisSizingMode = "FIXED";
  content.primaryAxisAlignItems = "MIN";
  content.counterAxisAlignItems = "MIN";
  content.itemSpacing = 8;
  content.paddingLeft = 0;
  content.paddingRight = 0;
  content.paddingTop = 0;
  content.paddingBottom = 0;
  content.resizeWithoutConstraints(256, 68);
  content.fills = [];
  content.strokes = [];
  content.clipsContent = false;
  setLayoutSizingHorizontal(content, "FILL");

  let title = directChildNamed(content, "Title Text");
  if (title && title.type !== "TEXT") {
    title.remove();
    title = null;
  }
  if (!title || title.type !== "TEXT") {
    title = figma.createText();
    title.name = "Title Text";
  }
  applyPopoverTitleTypography(title, fonts, variableByName, stats);
  title.characters = popoverTitleText(side);
  title.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  title.resizeWithoutConstraints(256, 20);
  setLayoutSizingHorizontal(title, "FILL");
  setTextAutoResize(title, "HEIGHT");

  let description = directChildNamed(content, "Description Text");
  if (description && description.type !== "TEXT") {
    description.remove();
    description = null;
  }
  if (!description || description.type !== "TEXT") {
    description = figma.createText();
    description.name = "Description Text";
  }
  applyPopoverDescriptionTypography(description, fonts, variableByName, stats);
  description.characters = popoverDescriptionText(side);
  description.fills = [
    paintFromVariable(
      "Colors/foreground/400",
      "#5D626F",
      variableByName,
      stats,
    ),
  ];
  description.resizeWithoutConstraints(256, 40);
  setLayoutSizingHorizontal(description, "FILL");
  setTextAutoResize(description, "HEIGHT");

  content.appendChild(title);
  content.appendChild(description);
  component.appendChild(content);
  bindPopoverGeometryVariables(component, content, variableByName, stats);
}

async function syncMenuVariantChildren({
  component,
  value,
  variableByName,
  fonts,
  stats,
}) {
  removeDirectChildren(component);
  const rows = [];

  rows.push(
    await syncMenuItemRow({
      component,
      name: "Menu Label",
      textName: "Label Text",
      text: menuLabelText(value),
      strong: true,
      variableByName,
      fonts,
      stats,
    }),
  );
  rows.push(syncMenuSeparator({ component, variableByName, stats }));

  if (value === "Checkbox") {
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 1",
        textName: "Item 1 Text",
        text: "Show traffic",
        icon: "check",
        variableByName,
        fonts,
        stats,
      }),
    );
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 2",
        textName: "Item 2 Text",
        text: "Accessible route",
        variableByName,
        fonts,
        stats,
      }),
    );
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 3",
        textName: "Item 3 Text",
        text: "Indoor mode",
        icon: "check",
        variableByName,
        fonts,
        stats,
      }),
    );
  } else if (value === "Radio") {
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 1",
        textName: "Item 1 Text",
        text: "Fastest",
        radio: true,
        variableByName,
        fonts,
        stats,
      }),
    );
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 2",
        textName: "Item 2 Text",
        text: "Accessible",
        variableByName,
        fonts,
        stats,
      }),
    );
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 3",
        textName: "Item 3 Text",
        text: "Fewest transfers",
        variableByName,
        fonts,
        stats,
      }),
    );
  } else if (value === "Submenu") {
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 1",
        textName: "Item 1 Text",
        text: "Profile",
        variableByName,
        fonts,
        stats,
      }),
    );
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 2",
        textName: "Item 2 Text",
        text: "Billing",
        variableByName,
        fonts,
        stats,
      }),
    );
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 3",
        textName: "Item 3 Text",
        text: "More",
        submenu: true,
        variableByName,
        fonts,
        stats,
      }),
    );
  } else {
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 1",
        textName: "Item 1 Text",
        text: "Profile",
        shortcut: "Cmd K",
        variableByName,
        fonts,
        stats,
      }),
    );
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 2",
        textName: "Item 2 Text",
        text: "Billing",
        variableByName,
        fonts,
        stats,
      }),
    );
    rows.push(
      await syncMenuItemRow({
        component,
        name: "Menu Item 3",
        textName: "Item 3 Text",
        text: "Team",
        variableByName,
        fonts,
        stats,
      }),
    );
  }

  bindMenuGeometryVariables(
    component,
    rows.filter(Boolean),
    variableByName,
    stats,
  );
}

async function syncMenuItemRow({
  component,
  name,
  textName,
  text,
  strong,
  icon,
  radio,
  submenu,
  shortcut,
  variableByName,
  fonts,
  stats,
}) {
  const row = figma.createFrame();
  row.name = name;
  row.layoutMode = "HORIZONTAL";
  row.primaryAxisSizingMode = "FIXED";
  row.counterAxisSizingMode = "FIXED";
  row.primaryAxisAlignItems = "MIN";
  row.counterAxisAlignItems = "CENTER";
  row.itemSpacing = 8;
  row.paddingLeft = 8;
  row.paddingRight = 8;
  row.paddingTop = 0;
  row.paddingBottom = 0;
  row.resizeWithoutConstraints(184, 32);
  row.cornerRadius = 4;
  row.fills = [];
  row.strokes = [];
  row.clipsContent = false;
  row.setSharedPluginData(RUN_NAMESPACE, "kind", "menu-item");
  setLayoutSizingHorizontal(row, "FILL");

  if (icon) {
    const iconNode = await createFixedIconInstance(
      icon,
      "Colors/foreground/0",
      "#000000",
      variableByName,
      stats,
      16,
      "Menu/icon/size",
    );
    iconNode.name = "Item Icon";
    row.appendChild(iconNode);
  } else if (radio) {
    const dot = figma.createEllipse();
    dot.name = "Radio Dot";
    dot.resizeWithoutConstraints(8, 8);
    dot.fills = [
      paintFromVariable("Colors/theme/500", "#135BEC", variableByName, stats),
    ];
    dot.strokes = [];
    row.appendChild(dot);
  }

  const label = figma.createText();
  label.name = textName;
  applyMenuItemTypography(label, fonts, variableByName, stats, strong);
  label.characters = text;
  label.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  try {
    label.layoutGrow = 1;
  } catch (_error) {
    // layoutGrow is unavailable on older plugin runtimes.
  }
  row.appendChild(label);

  if (shortcut) {
    const shortcutText = figma.createText();
    shortcutText.name = "Shortcut Text";
    applyMenuShortcutTypography(shortcutText, fonts, variableByName, stats);
    shortcutText.characters = shortcut;
    shortcutText.fills = [
      paintFromVariable(
        "Colors/foreground/400",
        "#5D626F",
        variableByName,
        stats,
      ),
    ];
    row.appendChild(shortcutText);
  }

  if (submenu) {
    const iconNode = await createFixedIconInstance(
      "chevron-right",
      "Colors/foreground/400",
      "#5D626F",
      variableByName,
      stats,
      16,
      "Menu/icon/size",
    );
    iconNode.name = "Submenu Icon";
    row.appendChild(iconNode);
  }

  component.appendChild(row);
  return row;
}

function syncMenuSeparator({ component, variableByName, stats }) {
  const separator = figma.createRectangle();
  separator.name = "Menu Separator";
  separator.resizeWithoutConstraints(184, 1);
  separator.fills = [
    paintFromVariable(
      "Colors/foreground/500",
      "#747B8B",
      variableByName,
      stats,
    ),
  ];
  separator.strokes = [];
  separator.setSharedPluginData(RUN_NAMESPACE, "kind", "menu-separator");
  setLayoutSizingHorizontal(separator, "FILL");
  bindFloatVariable(
    separator,
    "height",
    "Menu/separator/height",
    variableByName,
    stats,
  );
  component.appendChild(separator);
  return separator;
}

async function syncToastVariantChildren({
  component,
  value,
  variableByName,
  fonts,
  stats,
}) {
  let textGroup = directChildNamed(component, "Toast Content");
  if (textGroup && textGroup.type !== "FRAME") {
    textGroup.remove();
    textGroup = null;
  }
  if (!textGroup || textGroup.type !== "FRAME") {
    textGroup = figma.createFrame();
    textGroup.name = "Toast Content";
  }
  textGroup.layoutMode = "VERTICAL";
  textGroup.primaryAxisSizingMode = "AUTO";
  textGroup.counterAxisSizingMode = "FIXED";
  textGroup.primaryAxisAlignItems = "MIN";
  textGroup.counterAxisAlignItems = "MIN";
  textGroup.itemSpacing = 4;
  textGroup.paddingLeft = 0;
  textGroup.paddingRight = 0;
  textGroup.paddingTop = 0;
  textGroup.paddingBottom = 0;
  textGroup.resizeWithoutConstraints(value === "Action" ? 240 : 300, 44);
  textGroup.fills = [];
  textGroup.strokes = [];
  textGroup.clipsContent = false;
  setLayoutSizingHorizontal(textGroup, "FILL");
  try {
    textGroup.layoutGrow = 1;
  } catch (_error) {
    // layoutGrow is unavailable on older plugin runtimes.
  }

  let title = directChildNamed(textGroup, "Title Text");
  if (title && title.type !== "TEXT") {
    title.remove();
    title = null;
  }
  if (!title || title.type !== "TEXT") {
    title = figma.createText();
    title.name = "Title Text";
  }
  applyToastTitleTypography(title, fonts, variableByName, stats);
  title.characters = "Scheduled: Catch up";
  title.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  title.resizeWithoutConstraints(260, 20);
  setLayoutSizingHorizontal(title, "FILL");
  setTextAutoResize(title, "HEIGHT");

  let description = directChildNamed(textGroup, "Description Text");
  if (description && description.type !== "TEXT") {
    description.remove();
    description = null;
  }
  if (!description || description.type !== "TEXT") {
    description = figma.createText();
    description.name = "Description Text";
  }
  applyToastDescriptionTypography(description, fonts, variableByName, stats);
  description.characters = "Friday, February 10, 2023 at 5:57 PM";
  description.fills = [
    paintFromVariable(
      "Colors/foreground/400",
      "#5D626F",
      variableByName,
      stats,
    ),
  ];
  description.resizeWithoutConstraints(260, 20);
  setLayoutSizingHorizontal(description, "FILL");
  setTextAutoResize(description, "HEIGHT");

  textGroup.appendChild(title);
  textGroup.appendChild(description);
  component.appendChild(textGroup);

  let action = directChildNamed(component, "Toast Action");
  if (action && action.type !== "FRAME") {
    action.remove();
    action = null;
  }

  if (value === "Action") {
    if (!action || action.type !== "FRAME") {
      action = figma.createFrame();
      action.name = "Toast Action";
    }
    action.layoutMode = "HORIZONTAL";
    action.primaryAxisSizingMode = "AUTO";
    action.counterAxisSizingMode = "FIXED";
    action.primaryAxisAlignItems = "CENTER";
    action.counterAxisAlignItems = "CENTER";
    action.itemSpacing = 0;
    action.paddingLeft = 12;
    action.paddingRight = 12;
    action.paddingTop = 0;
    action.paddingBottom = 0;
    action.resizeWithoutConstraints(66, 32);
    action.cornerRadius = 8;
    action.fills = [];
    action.strokes = [
      paintFromVariable(
        "Colors/foreground/500",
        "#747B8B",
        variableByName,
        stats,
      ),
    ];
    action.strokeWeight = 1;
    action.clipsContent = false;
    action.setSharedPluginData(RUN_NAMESPACE, "kind", "toast-action");

    let actionText = directChildNamed(action, "Action Text");
    if (actionText && actionText.type !== "TEXT") {
      actionText.remove();
      actionText = null;
    }
    if (!actionText || actionText.type !== "TEXT") {
      actionText = figma.createText();
      actionText.name = "Action Text";
    }
    actionText.fontName = fonts.medium;
    actionText.fontSize = 14;
    actionText.lineHeight = { unit: "PIXELS", value: 20 };
    actionText.textAutoResize = "WIDTH_AND_HEIGHT";
    bindFloatVariable(
      actionText,
      "fontSize",
      "Toast/title/font-size",
      variableByName,
      stats,
    );
    bindFloatVariable(
      actionText,
      "lineHeight",
      "Toast/title/line-height",
      variableByName,
      stats,
    );
    actionText.characters = "Undo";
    actionText.fills = [
      paintFromVariable(
        "Colors/foreground/0",
        "#000000",
        variableByName,
        stats,
      ),
    ];
    action.appendChild(actionText);
    component.appendChild(action);
  } else if (action) {
    action.remove();
    action = null;
  }

  const close = await syncInlineCloseButton({
    parent: component,
    name: "Toast Close",
    kind: "toast-close",
    size: 24,
    iconSize: 16,
    iconSizeToken: "Toast/close/icon/size",
    variableByName,
    stats,
  });

  bindToastGeometryVariables(
    component,
    textGroup,
    action,
    close,
    variableByName,
    stats,
  );
}

async function syncOverlayCloseButton({
  parent,
  name,
  kind,
  size,
  iconSize,
  iconSizeToken,
  x,
  y,
  variableByName,
  stats,
}) {
  let close = directChildNamed(parent, name);
  if (close && close.type !== "FRAME") {
    close.remove();
    close = null;
  }
  if (!close || close.type !== "FRAME") {
    close = figma.createFrame();
    close.name = name;
  }
  close.layoutMode = "NONE";
  close.resizeWithoutConstraints(size, size);
  close.x = x;
  close.y = y;
  close.cornerRadius = Math.min(8, size / 2);
  close.fills = [];
  close.strokes = [];
  close.clipsContent = false;
  close.setSharedPluginData(RUN_NAMESPACE, "kind", kind);
  parent.appendChild(close);

  try {
    close.layoutPositioning = "ABSOLUTE";
  } catch (_error) {
    // Older Figma runtimes may not expose absolute positioning on every node.
  }

  removeDirectChildren(close);
  const icon = await createFixedIconInstance(
    "x-close",
    "Colors/foreground/400",
    "#5D626F",
    variableByName,
    stats,
    iconSize,
    iconSizeToken,
  );
  icon.name = "Close Icon";
  icon.x = (size - iconSize) / 2;
  icon.y = (size - iconSize) / 2;
  close.appendChild(icon);
  return close;
}

async function syncInlineCloseButton({
  parent,
  name,
  kind,
  size,
  iconSize,
  iconSizeToken,
  variableByName,
  stats,
}) {
  let close = directChildNamed(parent, name);
  if (close && close.type !== "FRAME") {
    close.remove();
    close = null;
  }
  if (!close || close.type !== "FRAME") {
    close = figma.createFrame();
    close.name = name;
  }
  close.layoutMode = "NONE";
  close.resizeWithoutConstraints(size, size);
  close.cornerRadius = Math.min(8, size / 2);
  close.fills = [];
  close.strokes = [];
  close.clipsContent = false;
  close.setSharedPluginData(RUN_NAMESPACE, "kind", kind);

  try {
    close.layoutPositioning = "AUTO";
  } catch (_error) {
    // Older Figma runtimes may not expose absolute positioning on every node.
  }

  parent.appendChild(close);

  removeDirectChildren(close);
  const icon = await createFixedIconInstance(
    "x-close",
    "Colors/foreground/400",
    "#5D626F",
    variableByName,
    stats,
    iconSize,
    iconSizeToken,
  );
  icon.name = "Close Icon";
  icon.x = (size - iconSize) / 2;
  icon.y = (size - iconSize) / 2;
  close.appendChild(icon);
  return close;
}

function removeDirectChildren(parent) {
  if (!parent || !parent.children) return;
  const children = [];
  for (const child of parent.children) children.push(child);
  for (const child of children) child.remove();
}

function dialogTitleText(value) {
  if (value === "Form") return "Edit profile";
  if (value === "Footer") return "Confirm changes";
  return "Dialog title";
}

function dialogDescriptionText(value) {
  if (value === "Form") return "Make changes to your profile here.";
  if (value === "Footer") return "Review this decision before continuing.";
  return "Use dialogs for focused tasks that need a clear return path.";
}

function dialogBodyText(value) {
  if (value === "Form")
    return "Update the fields below and save when you are done.";
  if (value === "Footer")
    return "This content explains the action, risk, or expected result.";
  return "Dialog body content can hold a short message, form summary, or composed product content.";
}

function popoverTitleText(side) {
  if (side === "Right") return "Filters";
  if (side === "Bottom") return "Route details";
  if (side === "Left") return "Layer options";
  return "Dimensions";
}

function popoverDescriptionText(side) {
  if (side === "Right")
    return "Adjust visible results without leaving this view.";
  if (side === "Bottom") return "Review nearby route metadata and constraints.";
  if (side === "Left") return "Choose which map layers should stay visible.";
  return "Set the dimensions for the layer.";
}

function menuLabelText(content) {
  if (content === "Checkbox") return "Map layers";
  if (content === "Radio") return "Route preference";
  if (content === "Submenu") return "Workspace";
  return "My Account";
}

async function syncCheckboxVariantChildren({
  component,
  checked,
  state,
  config,
  variableByName,
  fonts,
  stats,
}) {
  let control = directChildNamed(component, "Checkbox Control");
  if (control && control.type !== "FRAME") {
    control.remove();
    control = null;
  }

  if (!control || control.type !== "FRAME") {
    control = figma.createFrame();
    control.name = "Checkbox Control";
  }

  control.layoutMode = "NONE";
  control.resizeWithoutConstraints(20, 20);
  control.cornerRadius = 4;
  control.clipsContent = false;
  control.setSharedPluginData(RUN_NAMESPACE, "kind", "checkbox-control");
  control.fills = config.controlFill
    ? [
        paintFromVariable(
          config.controlFill,
          config.controlFillFallback,
          variableByName,
          stats,
        ),
      ]
    : [];
  control.strokes = [
    paintFromVariable(
      config.controlStroke,
      config.controlStrokeFallback,
      variableByName,
      stats,
    ),
  ];
  control.strokeWeight = 1;
  bindCheckboxGeometryVariables(component, control, variableByName, stats);

  removeGeneratedButtonChild(control, "Checkbox Mark Short", true);
  removeGeneratedButtonChild(control, "Checkbox Mark Long", true);
  removeGeneratedButtonChild(control, "Checkbox Mark", checked !== "Checked");

  if (checked === "Checked") {
    await syncCheckboxMark(control, config, variableByName, stats);
  }

  syncFocusRing(control, {
    enabled: state !== "Disabled",
    width: 20,
    height: 20,
    radius: 4,
    variableName: focusRingVariableForState(state),
    fallback: focusRingFallbackForState(state),
    variableByName,
    stats,
  });

  let label = directChildNamed(component, "Label Text");
  if (label && label.type !== "TEXT") {
    label.remove();
    label = null;
  }

  if (!label || label.type !== "TEXT") {
    label = figma.createText();
    label.name = "Label Text";
  }

  applyCheckboxLabelTypography(label, fonts, variableByName, stats);
  label.characters = "Checkbox";
  label.fills = [
    paintFromVariable(
      config.label,
      config.labelFallback,
      variableByName,
      stats,
    ),
  ];
  label.textAlignVertical = "CENTER";

  component.appendChild(control);
  component.appendChild(label);
}

async function syncCheckboxMark(control, config, variableByName, stats) {
  let mark = directChildNamed(control, "Checkbox Mark");
  if (mark && mark.type !== "INSTANCE") {
    mark.remove();
    mark = null;
  }

  if (!mark) {
    const iconComponent = await findKozmosIconSourceComponent("check");
    if (iconComponent) {
      mark = iconComponent.createInstance();
      mark.name = "Checkbox Mark";
    } else {
      mark = createFallbackCheckboxMark(config, variableByName, stats);
    }
  }

  mark.resize(16, 16);
  mark.x = 2;
  mark.y = 2;
  try {
    mark.constraints = {
      horizontal: "CENTER",
      vertical: "CENTER",
    };
  } catch (_error) {
    // Older plugin runtimes can reject constraints on some instance types.
  }

  storeCheckboxMarkAuditMetadata(mark, config.mark, config.markFallback, stats);

  if (mark.type === "INSTANCE") {
    applyIconColorOverrides(
      mark,
      config.mark,
      config.markFallback,
      variableByName,
      stats,
    );
  }

  control.appendChild(mark);
}

function createFallbackCheckboxMark(config, variableByName, stats) {
  const mark = figma.createVector();
  mark.name = "Checkbox Mark";
  mark.resize(16, 16);
  mark.vectorNetwork = {
    vertices: [
      { x: 3.5, y: 8.25, strokeCap: "ROUND", strokeJoin: "ROUND" },
      { x: 6.75, y: 11.5, strokeCap: "ROUND", strokeJoin: "ROUND" },
      { x: 12.75, y: 4.5, strokeCap: "ROUND", strokeJoin: "ROUND" },
    ],
    segments: [
      {
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
      {
        start: 1,
        end: 2,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 },
      },
    ],
  };
  mark.fills = [];
  mark.strokes = [
    paintFromVariable(config.mark, config.markFallback, variableByName, stats),
  ];
  mark.strokeWeight = 2;
  mark.strokeCap = "ROUND";
  mark.strokeJoin = "ROUND";
  return mark;
}

function storeCheckboxMarkAuditMetadata(mark, variableName, fallback, stats) {
  if (!mark || !mark.setSharedPluginData) return;

  try {
    mark.setSharedPluginData(RUN_NAMESPACE, "kind", "checkbox-mark");
    mark.setSharedPluginData(RUN_NAMESPACE, "foreground-token", variableName);
    mark.setSharedPluginData(RUN_NAMESPACE, "foreground-fallback", fallback);
  } catch (error) {
    stats.warnings.push(
      `Could not store Checkbox mark audit metadata (${messageFor(error)}).`,
    );
  }
}

async function syncRadioVariantChildren({
  component,
  checked,
  state,
  config,
  variableByName,
  fonts,
  stats,
}) {
  let control = directChildNamed(component, "Radio Control");
  if (control && control.type !== "FRAME") {
    control.remove();
    control = null;
  }

  if (!control || control.type !== "FRAME") {
    control = figma.createFrame();
    control.name = "Radio Control";
  }

  control.layoutMode = "NONE";
  control.resizeWithoutConstraints(20, 20);
  control.cornerRadius = 9999;
  control.clipsContent = false;
  control.setSharedPluginData(RUN_NAMESPACE, "kind", "radio-control");
  control.fills = [];
  control.strokes = [
    paintFromVariable(
      config.controlStroke,
      config.controlStrokeFallback,
      variableByName,
      stats,
    ),
  ];
  control.strokeWeight = 1;

  removeGeneratedButtonChild(control, "Radio Dot", checked !== "Checked");
  let dot = directChildNamed(control, "Radio Dot");
  if (checked === "Checked") {
    if (dot && dot.type !== "ELLIPSE") {
      dot.remove();
      dot = null;
    }

    if (!dot || dot.type !== "ELLIPSE") {
      dot = figma.createEllipse();
      dot.name = "Radio Dot";
    }

    dot.resize(10, 10);
    dot.x = 5;
    dot.y = 5;
    dot.fills = [
      paintFromVariable(config.dot, config.dotFallback, variableByName, stats),
    ];
    dot.strokes = [];
    dot.setSharedPluginData(RUN_NAMESPACE, "kind", "radio-dot");
    control.appendChild(dot);
  }

  syncFocusRing(control, {
    enabled: state !== "Disabled",
    width: 20,
    height: 20,
    radius: 9999,
    variableName: focusRingVariableForState(state),
    fallback: focusRingFallbackForState(state),
    variableByName,
    stats,
  });

  bindRadioGeometryVariables(component, control, dot, variableByName, stats);

  let label = directChildNamed(component, "Label Text");
  if (label && label.type !== "TEXT") {
    label.remove();
    label = null;
  }

  if (!label || label.type !== "TEXT") {
    label = figma.createText();
    label.name = "Label Text";
  }

  applyRadioLabelTypography(label, fonts, variableByName, stats);
  label.characters = "Radio";
  label.fills = [
    paintFromVariable(
      config.label,
      config.labelFallback,
      variableByName,
      stats,
    ),
  ];
  label.textAlignVertical = "CENTER";

  component.appendChild(control);
  component.appendChild(label);
}

async function syncSwitchVariantChildren({
  component,
  checked,
  state,
  config,
  variableByName,
  fonts,
  stats,
}) {
  let track = directChildNamed(component, "Switch Track");
  if (track && track.type !== "FRAME") {
    track.remove();
    track = null;
  }

  if (!track || track.type !== "FRAME") {
    track = figma.createFrame();
    track.name = "Switch Track";
  }

  track.layoutMode = "NONE";
  track.resizeWithoutConstraints(44, 24);
  track.cornerRadius = 9999;
  track.clipsContent = false;
  track.setSharedPluginData(RUN_NAMESPACE, "kind", "switch-track");
  track.fills = [
    paintFromVariable(
      config.trackFill,
      config.trackFillFallback,
      variableByName,
      stats,
    ),
  ];
  track.strokes = [
    paintFromVariable(
      config.trackStroke,
      config.trackStrokeFallback,
      variableByName,
      stats,
    ),
  ];
  track.strokeWeight = 2;

  let thumb = directChildNamed(track, "Switch Thumb");
  if (thumb && thumb.type !== "ELLIPSE") {
    thumb.remove();
    thumb = null;
  }

  if (!thumb || thumb.type !== "ELLIPSE") {
    thumb = figma.createEllipse();
    thumb.name = "Switch Thumb";
  }

  thumb.resize(20, 20);
  thumb.x = checked === "Checked" ? 22 : 2;
  thumb.y = 2;
  thumb.fills = [
    paintFromVariable(
      config.thumbFill,
      config.thumbFillFallback,
      variableByName,
      stats,
    ),
  ];
  thumb.strokes = [];
  thumb.setSharedPluginData(RUN_NAMESPACE, "kind", "switch-thumb");
  track.appendChild(thumb);

  syncFocusRing(track, {
    enabled: state !== "Disabled",
    width: 44,
    height: 24,
    radius: 9999,
    variableName: focusRingVariableForState(state),
    fallback: focusRingFallbackForState(state),
    variableByName,
    stats,
  });

  bindSwitchGeometryVariables(component, track, thumb, variableByName, stats);

  let label = directChildNamed(component, "Label Text");
  if (label && label.type !== "TEXT") {
    label.remove();
    label = null;
  }

  if (!label || label.type !== "TEXT") {
    label = figma.createText();
    label.name = "Label Text";
  }

  applySwitchLabelTypography(label, fonts, variableByName, stats);
  label.characters = "Switch";
  label.fills = [
    paintFromVariable(
      config.label,
      config.labelFallback,
      variableByName,
      stats,
    ),
  ];
  label.textAlignVertical = "CENTER";

  component.appendChild(track);
  component.appendChild(label);
}

async function syncInputVariantChildren({
  component,
  state,
  status,
  config,
  variableByName,
  fonts,
  stats,
}) {
  let label = directChildNamed(component, "Label Text");
  if (label && label.type !== "TEXT") {
    label.remove();
    label = null;
  }

  if (!label || label.type !== "TEXT") {
    label = figma.createText();
    label.name = "Label Text";
  }

  applyInputLabelTypography(label, fonts, variableByName, stats);
  label.characters = "Input";
  label.fills = [
    paintFromVariable(
      config.label,
      config.labelFallback,
      variableByName,
      stats,
    ),
  ];
  label.textAlignVertical = "CENTER";

  let field = directChildNamed(component, "Input Field");
  if (field && field.type !== "FRAME") {
    field.remove();
    field = null;
  }

  if (!field || field.type !== "FRAME") {
    field = figma.createFrame();
    field.name = "Input Field";
  }

  field.layoutMode = "HORIZONTAL";
  field.primaryAxisSizingMode = "FIXED";
  field.counterAxisSizingMode = "FIXED";
  field.primaryAxisAlignItems = "MIN";
  field.counterAxisAlignItems = "CENTER";
  setLayoutSizingHorizontal(field, "FILL");
  field.itemSpacing = 0;
  field.paddingLeft = 12;
  field.paddingRight = 12;
  field.paddingTop = 0;
  field.paddingBottom = 0;
  field.resizeWithoutConstraints(320, 44);
  field.cornerRadius = 8;
  field.setSharedPluginData(RUN_NAMESPACE, "kind", "input-field");
  field.fills = [
    paintFromVariable(
      config.fieldFill,
      config.fieldFillFallback,
      variableByName,
      stats,
    ),
  ];
  field.strokes = [
    paintFromVariable(
      config.fieldStroke,
      config.fieldStrokeFallback,
      variableByName,
      stats,
    ),
  ];
  field.strokeWeight = 1;
  field.clipsContent = false;

  let placeholder = directChildNamed(field, "Placeholder Text");
  if (placeholder && placeholder.type !== "TEXT") {
    placeholder.remove();
    placeholder = null;
  }

  if (!placeholder || placeholder.type !== "TEXT") {
    placeholder = figma.createText();
    placeholder.name = "Placeholder Text";
  }

  applyInputTextTypography(placeholder, fonts, variableByName, stats);
  placeholder.characters = "Placeholder";
  setLayoutSizingHorizontal(placeholder, "FILL");
  setTextAutoResize(placeholder, "TRUNCATE");
  placeholder.fills = [
    paintFromVariable(
      config.placeholder,
      config.placeholderFallback,
      variableByName,
      stats,
    ),
  ];
  placeholder.textAlignVertical = "CENTER";
  field.appendChild(placeholder);

  syncFocusRing(field, {
    enabled: state !== "Disabled",
    width: 320,
    height: 44,
    radius: 8,
    variableName: focusRingVariableForInputStatus(status),
    fallback: focusRingFallbackForInputStatus(status),
    variableByName,
    stats,
  });

  let helper = directChildNamed(component, "Helper Text");
  if (helper && helper.type !== "TEXT") {
    helper.remove();
    helper = null;
  }

  if (!helper || helper.type !== "TEXT") {
    helper = figma.createText();
    helper.name = "Helper Text";
  }

  applyInputTextTypography(helper, fonts, variableByName, stats);
  helper.characters = helperTextForInputStatus(status);
  helper.visible = status !== "Default";
  setLayoutSizingHorizontal(helper, "FILL");
  setTextAutoResize(helper, "HEIGHT");
  helper.resizeWithoutConstraints(320, 20);
  helper.fills = [
    paintFromVariable(
      config.helper,
      config.helperFallback,
      variableByName,
      stats,
    ),
  ];
  helper.textAlignVertical = "CENTER";

  bindInputGeometryVariables(component, field, variableByName, stats);

  component.appendChild(label);
  component.appendChild(field);
  component.appendChild(helper);
}

async function syncTextareaVariantChildren({
  component,
  state,
  status,
  config,
  variableByName,
  fonts,
  stats,
}) {
  const label = syncFieldLabel({
    component,
    text: "Textarea",
    tokenPrefix: "Textarea",
    colorToken: config.label,
    colorFallback: config.labelFallback,
    variableByName,
    fonts,
    stats,
  });

  let field = directChildNamed(component, "Textarea Field");
  if (field && field.type !== "FRAME") {
    field.remove();
    field = null;
  }

  if (!field || field.type !== "FRAME") {
    field = figma.createFrame();
    field.name = "Textarea Field";
  }

  field.layoutMode = "VERTICAL";
  field.primaryAxisSizingMode = "FIXED";
  field.counterAxisSizingMode = "FIXED";
  field.primaryAxisAlignItems = "MIN";
  field.counterAxisAlignItems = "MIN";
  setLayoutSizingHorizontal(field, "FILL");
  field.itemSpacing = 0;
  field.paddingLeft = 12;
  field.paddingRight = 12;
  field.paddingTop = 8;
  field.paddingBottom = 8;
  field.resizeWithoutConstraints(320, 80);
  field.cornerRadius = 8;
  field.setSharedPluginData(RUN_NAMESPACE, "kind", "input-field");
  field.fills = [
    paintFromVariable(
      config.fieldFill,
      config.fieldFillFallback,
      variableByName,
      stats,
    ),
  ];
  field.strokes = [
    paintFromVariable(
      config.fieldStroke,
      config.fieldStrokeFallback,
      variableByName,
      stats,
    ),
  ];
  field.strokeWeight = 1;
  field.clipsContent = false;

  let placeholder = directChildNamed(field, "Placeholder Text");
  if (placeholder && placeholder.type !== "TEXT") {
    placeholder.remove();
    placeholder = null;
  }

  if (!placeholder || placeholder.type !== "TEXT") {
    placeholder = figma.createText();
    placeholder.name = "Placeholder Text";
  }

  applyFieldTextTypography(
    placeholder,
    fonts,
    "Textarea",
    variableByName,
    stats,
  );
  placeholder.characters =
    status === "Error" ? "Describe the issue" : "Placeholder";
  setLayoutSizingHorizontal(placeholder, "FILL");
  setTextAutoResize(placeholder, "HEIGHT");
  placeholder.resizeWithoutConstraints(296, 40);
  placeholder.fills = [
    paintFromVariable(
      config.placeholder,
      config.placeholderFallback,
      variableByName,
      stats,
    ),
  ];
  placeholder.textAlignVertical = "TOP";
  field.appendChild(placeholder);

  syncFocusRing(field, {
    enabled: state !== "Disabled",
    width: 320,
    height: 80,
    radius: 8,
    variableName: focusRingVariableForInputStatus(status),
    fallback: focusRingFallbackForInputStatus(status),
    variableByName,
    stats,
  });

  bindTextareaGeometryVariables(component, field, variableByName, stats);

  component.appendChild(label);
  component.appendChild(field);
}

async function syncSearchVariantChildren({
  component,
  state,
  status,
  config,
  variableByName,
  fonts,
  stats,
}) {
  const label = syncFieldLabel({
    component,
    text: "Search",
    tokenPrefix: "Search",
    colorToken: config.label,
    colorFallback: config.labelFallback,
    variableByName,
    fonts,
    stats,
  });

  let field = directChildNamed(component, "Search Field");
  if (field && field.type !== "FRAME") {
    field.remove();
    field = null;
  }

  if (!field || field.type !== "FRAME") {
    field = figma.createFrame();
    field.name = "Search Field";
  }

  field.layoutMode = "HORIZONTAL";
  field.primaryAxisSizingMode = "FIXED";
  field.counterAxisSizingMode = "FIXED";
  field.primaryAxisAlignItems = "MIN";
  field.counterAxisAlignItems = "CENTER";
  setLayoutSizingHorizontal(field, "FILL");
  field.itemSpacing = 8;
  field.paddingLeft = 12;
  field.paddingRight = 12;
  field.paddingTop = 0;
  field.paddingBottom = 0;
  field.resizeWithoutConstraints(320, 44);
  field.cornerRadius = 8;
  field.setSharedPluginData(RUN_NAMESPACE, "kind", "input-field");
  field.fills = [
    paintFromVariable(
      config.fieldFill,
      config.fieldFillFallback,
      variableByName,
      stats,
    ),
  ];
  field.strokes = [
    paintFromVariable(
      config.fieldStroke,
      config.fieldStrokeFallback,
      variableByName,
      stats,
    ),
  ];
  field.strokeWeight = 1;
  field.clipsContent = false;

  removeGeneratedButtonChild(field, "Icon", true);
  const icon = await createFixedIconInstance(
    "search-md",
    config.placeholder,
    config.placeholderFallback,
    variableByName,
    stats,
    16,
    "Search/icon/size",
  );
  field.appendChild(icon);

  let placeholder = directChildNamed(field, "Placeholder Text");
  if (placeholder && placeholder.type !== "TEXT") {
    placeholder.remove();
    placeholder = null;
  }

  if (!placeholder || placeholder.type !== "TEXT") {
    placeholder = figma.createText();
    placeholder.name = "Placeholder Text";
  }

  applyFieldTextTypography(placeholder, fonts, "Search", variableByName, stats);
  placeholder.characters = "Search";
  setLayoutSizingHorizontal(placeholder, "FILL");
  setTextAutoResize(placeholder, "TRUNCATE");
  placeholder.fills = [
    paintFromVariable(
      config.placeholder,
      config.placeholderFallback,
      variableByName,
      stats,
    ),
  ];
  placeholder.textAlignVertical = "CENTER";
  field.appendChild(placeholder);

  syncFocusRing(field, {
    enabled: state !== "Disabled",
    width: 320,
    height: 44,
    radius: 8,
    variableName: focusRingVariableForInputStatus(status),
    fallback: focusRingFallbackForInputStatus(status),
    variableByName,
    stats,
  });

  bindSearchGeometryVariables(component, field, icon, variableByName, stats);

  component.appendChild(label);
  component.appendChild(field);
}

async function syncSelectVariantChildren({
  component,
  state,
  status,
  config,
  variableByName,
  fonts,
  stats,
}) {
  let trigger = directChildNamed(component, "Select Trigger");
  if (trigger && trigger.type !== "FRAME") {
    trigger.remove();
    trigger = null;
  }

  if (!trigger || trigger.type !== "FRAME") {
    trigger = figma.createFrame();
    trigger.name = "Select Trigger";
  }

  trigger.layoutMode = "HORIZONTAL";
  trigger.primaryAxisSizingMode = "FIXED";
  trigger.counterAxisSizingMode = "FIXED";
  trigger.primaryAxisAlignItems = "SPACE_BETWEEN";
  trigger.counterAxisAlignItems = "CENTER";
  setLayoutSizingHorizontal(trigger, "FILL");
  trigger.itemSpacing = 8;
  trigger.paddingLeft = 12;
  trigger.paddingRight = 12;
  trigger.paddingTop = 0;
  trigger.paddingBottom = 0;
  trigger.resizeWithoutConstraints(320, 44);
  trigger.cornerRadius = 8;
  trigger.setSharedPluginData(RUN_NAMESPACE, "kind", "input-field");
  trigger.fills = [
    paintFromVariable(
      config.fieldFill,
      config.fieldFillFallback,
      variableByName,
      stats,
    ),
  ];
  trigger.strokes = [
    paintFromVariable(
      config.fieldStroke,
      config.fieldStrokeFallback,
      variableByName,
      stats,
    ),
  ];
  trigger.strokeWeight = 1;
  trigger.clipsContent = false;

  let placeholder = directChildNamed(trigger, "Placeholder Text");
  if (placeholder && placeholder.type !== "TEXT") {
    placeholder.remove();
    placeholder = null;
  }

  if (!placeholder || placeholder.type !== "TEXT") {
    placeholder = figma.createText();
    placeholder.name = "Placeholder Text";
  }

  applyFieldTextTypography(placeholder, fonts, "Select", variableByName, stats);
  placeholder.characters = "Select an option";
  setLayoutSizingHorizontal(placeholder, "FILL");
  setTextAutoResize(placeholder, "TRUNCATE");
  placeholder.fills = [
    paintFromVariable(
      config.placeholder,
      config.placeholderFallback,
      variableByName,
      stats,
    ),
  ];
  placeholder.textAlignVertical = "CENTER";
  trigger.appendChild(placeholder);

  removeGeneratedButtonChild(trigger, "Icon", true);
  const icon = await createFixedIconInstance(
    "chevron-down",
    config.placeholder,
    config.placeholderFallback,
    variableByName,
    stats,
    16,
    "Select/icon/size",
  );
  trigger.appendChild(icon);

  syncFocusRing(trigger, {
    enabled: state !== "Disabled",
    width: 320,
    height: 44,
    radius: 8,
    variableName: focusRingVariableForInputStatus(status),
    fallback: focusRingFallbackForInputStatus(status),
    variableByName,
    stats,
  });

  bindSelectGeometryVariables(component, trigger, icon, variableByName, stats);

  component.appendChild(trigger);
}

async function syncSliderVariantChildren({
  component,
  state,
  status,
  config,
  variableByName,
  fonts,
  stats,
}) {
  const label = syncFieldLabel({
    component,
    text: "Slider",
    tokenPrefix: "Slider",
    colorToken: config.label,
    colorFallback: config.labelFallback,
    variableByName,
    fonts,
    stats,
  });

  let root = directChildNamed(component, "Slider Control");
  if (root && root.type !== "FRAME") {
    root.remove();
    root = null;
  }

  if (!root || root.type !== "FRAME") {
    root = figma.createFrame();
    root.name = "Slider Control";
  }

  root.layoutMode = "NONE";
  root.resizeWithoutConstraints(320, 44);
  root.fills = [];
  root.strokes = [];
  root.clipsContent = false;
  root.setSharedPluginData(RUN_NAMESPACE, "kind", "slider-control");

  let track = directChildNamed(root, "Slider Track");
  if (track && track.type !== "FRAME") {
    track.remove();
    track = null;
  }

  if (!track || track.type !== "FRAME") {
    track = figma.createFrame();
    track.name = "Slider Track";
  }

  track.layoutMode = "NONE";
  track.resizeWithoutConstraints(320, 8);
  track.x = 0;
  track.y = 18;
  track.cornerRadius = 9999;
  track.fills = [
    paintFromVariable(
      config.trackFill,
      config.trackFillFallback,
      variableByName,
      stats,
    ),
  ];
  track.strokes = [
    paintFromVariable(
      config.trackStroke,
      config.trackStrokeFallback,
      variableByName,
      stats,
    ),
  ];
  track.strokeWeight = 1;
  track.clipsContent = true;
  track.setSharedPluginData(RUN_NAMESPACE, "kind", "slider-track");

  let range = directChildNamed(track, "Slider Range");
  if (range && range.type !== "RECTANGLE") {
    range.remove();
    range = null;
  }

  if (!range || range.type !== "RECTANGLE") {
    range = figma.createRectangle();
    range.name = "Slider Range";
  }

  range.resizeWithoutConstraints(160, 8);
  range.x = 0;
  range.y = 0;
  range.cornerRadius = 9999;
  range.fills = [
    paintFromVariable(
      config.rangeFill,
      config.rangeFillFallback,
      variableByName,
      stats,
    ),
  ];
  range.strokes = [];
  range.setSharedPluginData(RUN_NAMESPACE, "kind", "slider-range");
  track.appendChild(range);

  let thumb = directChildNamed(root, "Slider Thumb");
  if (thumb && thumb.type !== "FRAME") {
    thumb.remove();
    thumb = null;
  }

  if (!thumb || thumb.type !== "FRAME") {
    thumb = figma.createFrame();
    thumb.name = "Slider Thumb";
  }

  thumb.layoutMode = "NONE";
  thumb.resize(20, 20);
  thumb.x = 150;
  thumb.y = 12;
  thumb.cornerRadius = 9999;
  thumb.clipsContent = false;
  thumb.fills = [
    paintFromVariable(
      config.thumbFill,
      config.thumbFillFallback,
      variableByName,
      stats,
    ),
  ];
  thumb.strokes = [
    paintFromVariable(
      config.thumbStroke,
      config.thumbStrokeFallback,
      variableByName,
      stats,
    ),
  ];
  thumb.strokeWeight = 2;
  thumb.setSharedPluginData(RUN_NAMESPACE, "kind", "slider-thumb");

  syncFocusRing(thumb, {
    enabled: state !== "Disabled",
    width: 20,
    height: 20,
    radius: 9999,
    variableName: focusRingVariableForInputStatus(status),
    fallback: focusRingFallbackForInputStatus(status),
    variableByName,
    stats,
  });

  root.appendChild(track);
  root.appendChild(thumb);
  bindSliderGeometryVariables(
    component,
    root,
    track,
    thumb,
    variableByName,
    stats,
  );

  component.appendChild(label);
  component.appendChild(root);
}

async function syncProgressVariantChildren({
  component,
  value,
  config,
  variableByName,
  stats,
}) {
  let track = directChildNamed(component, "Progress Track");
  if (track && track.type !== "FRAME") {
    track.remove();
    track = null;
  }

  if (!track || track.type !== "FRAME") {
    track = figma.createFrame();
    track.name = "Progress Track";
  }

  track.layoutMode = "NONE";
  track.resizeWithoutConstraints(320, 8);
  track.x = 0;
  track.y = 0;
  track.cornerRadius = 9999;
  track.fills = [
    paintFromVariable(
      config.trackFill,
      config.trackFillFallback,
      variableByName,
      stats,
    ),
  ];
  track.strokes = [
    paintFromVariable(
      config.trackStroke,
      config.trackStrokeFallback,
      variableByName,
      stats,
    ),
  ];
  track.strokeWeight = 1;
  track.clipsContent = true;
  track.setSharedPluginData(RUN_NAMESPACE, "kind", "progress-track");

  let range = directChildNamed(track, "Progress Range");
  if (range && range.type !== "RECTANGLE") {
    range.remove();
    range = null;
  }

  if (!range || range.type !== "RECTANGLE") {
    range = figma.createRectangle();
    range.name = "Progress Range";
  }

  const rangeWidth = Math.max(1, Math.round((Number(value) / 100) * 320));
  range.resizeWithoutConstraints(rangeWidth, 8);
  range.x = 0;
  range.y = 0;
  range.cornerRadius = 9999;
  range.visible = value !== "0";
  range.fills = [
    paintFromVariable(
      config.rangeFill,
      config.rangeFillFallback,
      variableByName,
      stats,
    ),
  ];
  range.strokes = [];
  range.setSharedPluginData(RUN_NAMESPACE, "kind", "progress-range");

  track.appendChild(range);
  component.appendChild(track);
  bindProgressGeometryVariables(component, track, range, variableByName, stats);
}

async function syncSpinnerVariantChildren({
  component,
  metrics,
  variableByName,
  stats,
}) {
  let glyph = directChildNamed(component, "Spinner Glyph");
  if (glyph && glyph.type !== "ELLIPSE") {
    glyph.remove();
    glyph = null;
  }

  if (!glyph || glyph.type !== "ELLIPSE") {
    glyph = figma.createEllipse();
    glyph.name = "Spinner Glyph";
  }

  glyph.resize(metrics.size, metrics.size);
  glyph.x = 0;
  glyph.y = 0;
  glyph.fills = [];
  glyph.strokes = [
    paintFromVariable("Colors/theme/500", "#135BEC", variableByName, stats),
  ];
  glyph.strokeWeight = 2;
  glyph.dashPattern = [8, 4];
  glyph.setSharedPluginData(RUN_NAMESPACE, "kind", "spinner-glyph");
  bindSizeVariables(
    glyph,
    metrics.sizeToken,
    metrics.sizeToken,
    variableByName,
    stats,
  );
  bindFloatVariable(
    glyph,
    "strokeWeight",
    "Spinner/stroke/width",
    variableByName,
    stats,
  );

  component.appendChild(glyph);
}

async function syncAvatarVariantChildren({
  component,
  value,
  config,
  variableByName,
  fonts,
  stats,
}) {
  removeGeneratedButtonChild(component, "Icon", true);
  removeGeneratedButtonChild(component, "Fallback", value !== "Fallback");

  if (value === "Image") {
    const icon = await createFixedIconInstance(
      "user-01",
      "Colors/foreground/1000",
      "#FFFFFF",
      variableByName,
      stats,
      20,
      null,
    );
    icon.x = 10;
    icon.y = 10;
    component.appendChild(icon);
  }

  if (value === "Fallback") {
    let fallback = directChildNamed(component, "Fallback");
    if (fallback && fallback.type !== "TEXT") {
      fallback.remove();
      fallback = null;
    }

    if (!fallback || fallback.type !== "TEXT") {
      fallback = figma.createText();
      fallback.name = "Fallback";
    }

    applyAvatarFallbackTypography(fallback, fonts, variableByName, stats);
    fallback.characters = "AK";
    fallback.fills = [
      paintFromVariable(
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
      ),
    ];
    fallback.textAlignHorizontal = "CENTER";
    fallback.textAlignVertical = "CENTER";
    fallback.x = 10;
    fallback.y = 10;
    component.appendChild(fallback);
  }

  syncHiddenAvatarTextPropertyNode({
    component,
    name: "Image URL",
    value: "https://example.com/avatar.png",
    fonts,
    variableByName,
    stats,
  });
  syncHiddenAvatarTextPropertyNode({
    component,
    name: "Alt Text",
    value: "Avatar",
    fonts,
    variableByName,
    stats,
  });
}

function syncHiddenAvatarTextPropertyNode({
  component,
  name,
  value,
  fonts,
  variableByName,
  stats,
}) {
  let text = directChildNamed(component, name);
  if (text && text.type !== "TEXT") {
    text.remove();
    text = null;
  }

  if (!text || text.type !== "TEXT") {
    text = figma.createText();
    text.name = name;
  }

  applyAvatarFallbackTypography(text, fonts, variableByName, stats);
  text.characters = value;
  text.visible = false;
  text.fills = [
    paintFromVariable("Colors/foreground/0", "#000000", variableByName, stats),
  ];
  component.appendChild(text);
}

async function syncAlertVariantChildren({
  component,
  value,
  config,
  variableByName,
  fonts,
  stats,
}) {
  removeGeneratedButtonChild(component, "Icon", true);
  const icon = await createFixedIconInstance(
    config.icon,
    config.foreground,
    config.foregroundFallback,
    variableByName,
    stats,
    16,
    "Alert/icon/size",
  );
  component.appendChild(icon);

  let content = directChildNamed(component, "Content");
  if (content && content.type !== "FRAME") {
    content.remove();
    content = null;
  }

  if (!content || content.type !== "FRAME") {
    content = figma.createFrame();
    content.name = "Content";
  }

  content.layoutMode = "VERTICAL";
  content.primaryAxisSizingMode = "AUTO";
  content.counterAxisSizingMode = "FIXED";
  content.primaryAxisAlignItems = "MIN";
  content.counterAxisAlignItems = "MIN";
  content.itemSpacing = 4;
  content.paddingLeft = 0;
  content.paddingRight = 0;
  content.paddingTop = 0;
  content.paddingBottom = 0;
  content.resizeWithoutConstraints(296, 56);
  content.fills = [];
  content.strokes = [];
  content.clipsContent = false;
  setLayoutSizingHorizontal(content, "FILL");

  let title = directChildNamed(content, "Title");
  if (title && title.type !== "TEXT") {
    title.remove();
    title = null;
  }

  if (!title || title.type !== "TEXT") {
    title = figma.createText();
    title.name = "Title";
  }

  applyAlertTitleTypography(title, fonts, variableByName, stats);
  title.characters = alertTitleForVariant(value);
  title.fills = [
    paintFromVariable(
      config.foreground,
      config.foregroundFallback,
      variableByName,
      stats,
    ),
  ];
  setLayoutSizingHorizontal(title, "FILL");
  setTextAutoResize(title, "HEIGHT");
  title.resizeWithoutConstraints(296, 20);

  let description = directChildNamed(content, "Description");
  if (description && description.type !== "TEXT") {
    description.remove();
    description = null;
  }

  if (!description || description.type !== "TEXT") {
    description = figma.createText();
    description.name = "Description";
  }

  applyAlertDescriptionTypography(description, fonts, variableByName, stats);
  description.characters = alertDescriptionForVariant(value);
  description.fills = [
    paintFromVariable(
      config.foreground,
      config.foregroundFallback,
      variableByName,
      stats,
    ),
  ];
  setLayoutSizingHorizontal(description, "FILL");
  setTextAutoResize(description, "HEIGHT");
  description.resizeWithoutConstraints(296, 36);

  content.appendChild(title);
  content.appendChild(description);
  component.appendChild(content);
  bindAlertGeometryVariables(component, icon, variableByName, stats);
}

function syncFieldLabel({
  component,
  text,
  tokenPrefix,
  colorToken,
  colorFallback,
  variableByName,
  fonts,
  stats,
}) {
  let label = directChildNamed(component, "Label Text");
  if (label && label.type !== "TEXT") {
    label.remove();
    label = null;
  }

  if (!label || label.type !== "TEXT") {
    label = figma.createText();
    label.name = "Label Text";
  }

  applyFieldLabelTypography(label, fonts, tokenPrefix, variableByName, stats);
  label.characters = text;
  label.fills = [
    paintFromVariable(colorToken, colorFallback, variableByName, stats),
  ];
  label.textAlignVertical = "CENTER";
  return label;
}

async function createFixedIconInstance(
  iconName,
  variableName,
  fallback,
  variableByName,
  stats,
  size,
  sizeToken,
) {
  const iconComponent =
    (await findKozmosIconSourceComponent(iconName)) ||
    (await resolveDefaultIconSourceComponent(variableByName, stats));
  return createIconSlotInstance(
    iconComponent,
    variableName,
    fallback,
    variableByName,
    stats,
    size,
    sizeToken,
  );
}

function helperTextForInputStatus(status) {
  if (status === "Error") return "Invalid value";
  if (status === "Warning") return "Check this value";
  if (status === "Success") return "Looks good";
  return "Helper text";
}

function focusRingVariableForState(state) {
  return state === "Error" ? "Colors/emotional/danger/600" : "Colors/theme/500";
}

function focusRingFallbackForState(state) {
  return state === "Error" ? "#D41C42" : "#135BEC";
}

function focusRingVariableForInputStatus(status) {
  if (status === "Error") return "Colors/emotional/danger/600";
  if (status === "Warning") return "Colors/emotional/alert/900";
  if (status === "Success") return "Colors/emotional/success/900";
  return "Colors/theme/500";
}

function focusRingFallbackForInputStatus(status) {
  if (status === "Error") return "#D41C42";
  if (status === "Warning") return "#744D03";
  if (status === "Success") return "#14653D";
  return "#135BEC";
}

function syncFocusRing(
  target,
  {
    enabled,
    width,
    height,
    radius,
    variableName,
    fallback,
    variableByName,
    stats,
  },
) {
  if (!target) return;

  let ring = directChildNamed(target, "Focus Ring");
  if (!enabled) {
    if (ring) ring.remove();
    return;
  }

  if (ring && ring.type !== "RECTANGLE") {
    ring.remove();
    ring = null;
  }

  if (!ring || ring.type !== "RECTANGLE") {
    ring = figma.createRectangle();
    ring.name = "Focus Ring";
  }

  target.appendChild(ring);

  try {
    ring.layoutPositioning = "ABSOLUTE";
  } catch (_error) {
    // Older Figma runtimes may not expose absolute positioning on every node.
  }

  try {
    ring.constraints = {
      horizontal: "STRETCH",
      vertical: "STRETCH",
    };
  } catch (_error) {
    // Constraints can be rejected on some shape contexts in older runtimes.
  }

  const offset = 4;
  ring.resizeWithoutConstraints(width + offset * 2, height + offset * 2);
  ring.x = -offset;
  ring.y = -offset;
  ring.cornerRadius = radius >= 9999 ? 9999 : radius + offset;
  ring.fills = [];
  ring.strokes = [
    paintFromVariable(variableName, fallback, variableByName, stats),
  ];
  ring.strokeWeight = 2;
  ring.visible = false;
  ring.setSharedPluginData(RUN_NAMESPACE, "kind", "focus-ring");
}

function setLayoutSizingHorizontal(node, value) {
  if (!node) return;

  try {
    node.layoutSizingHorizontal = value;
  } catch (_error) {
    // Older Figma runtimes may not expose layout sizing on every node type.
  }
}

function setLayoutSizingVertical(node, value) {
  if (!node) return;

  try {
    node.layoutSizingVertical = value;
  } catch (_error) {
    // Older Figma runtimes may not expose layout sizing on every node type.
  }
}

function resizeNodeWithoutConstraints(node, width, height) {
  if (!node) return;

  try {
    if (node.resizeWithoutConstraints) {
      node.resizeWithoutConstraints(width, height);
      return;
    }

    if (node.resize) {
      node.resize(width, height);
    }
  } catch (_error) {
    // Some instance types cannot be resized in older Figma runtimes.
  }
}

function setVerticalStackChildSizing(node) {
  setLayoutSizingHorizontal(node, "FILL");
  setLayoutSizingVertical(node, "HUG");

  try {
    node.layoutAlign = "STRETCH";
  } catch (_error) {
    // layoutAlign is the older Plugin API equivalent for cross-axis fill.
  }

  try {
    node.layoutGrow = 0;
  } catch (_error) {
    // layoutGrow is unavailable on older plugin runtimes.
  }
}

function setHugChildSizing(node) {
  setLayoutSizingHorizontal(node, "HUG");
  setLayoutSizingVertical(node, "HUG");

  try {
    node.layoutAlign = "CENTER";
  } catch (_error) {
    // layoutAlign is unavailable on older plugin runtimes.
  }

  try {
    node.layoutGrow = 0;
  } catch (_error) {
    // layoutGrow is unavailable on older plugin runtimes.
  }
}

function setTextAutoResize(textNode, value) {
  if (!textNode || textNode.type !== "TEXT") return;

  try {
    textNode.textAutoResize = value;
  } catch (_error) {
    textNode.textAutoResize = "NONE";
  }
}

function directChildNamed(parent, name) {
  if (!parent.children) return null;
  for (const child of parent.children) {
    if (child.name === name) return child;
  }

  return null;
}

function removeGeneratedButtonChild(component, name, shouldRemove) {
  if (!shouldRemove || !component.children) return;
  const removable = [];
  for (const child of component.children) {
    if (child.name === name) removable.push(child);
  }

  for (const child of removable) {
    child.remove();
  }
}

function syncIconSlotInstance(
  icon,
  config,
  variableByName,
  stats,
  iconSize,
  iconSizeToken,
) {
  const size = iconSize || 16;
  const existingToken = icon.getSharedPluginData
    ? icon.getSharedPluginData(RUN_NAMESPACE, "foreground-token")
    : "";
  const existingFallback = icon.getSharedPluginData
    ? icon.getSharedPluginData(RUN_NAMESPACE, "foreground-fallback")
    : "";
  const shouldRetint =
    existingToken !== config.foreground ||
    existingFallback !== config.foregroundFallback;

  icon.resize(size, size);
  if (iconSizeToken) {
    bindSizeVariables(
      icon,
      iconSizeToken,
      iconSizeToken,
      variableByName,
      stats,
    );
  }
  storeIconSlotAuditMetadata(
    icon,
    config.foreground,
    config.foregroundFallback,
    stats,
  );

  if (isGeneratedIconSlotWrapper(icon)) {
    stats.warnings.push(
      "Encountered a legacy masked Icon wrapper. Run Update Button/IconButton to rebuild direct icon instances.",
    );
    return;
  }

  if (icon.type === "INSTANCE") {
    icon.name = "Icon";
    if (shouldRetint) {
      tintIconSlotMark(icon, config, variableByName, stats);
    } else {
      incrementStat(stats, "iconSlotRetintsSkipped");
    }
    return;
  }

  if (icon.type !== "FRAME") return;

  icon.name = "Icon";
  resetIconGlyph(
    icon,
    config.foreground,
    config.foregroundFallback,
    variableByName,
    stats,
    size,
  );
}

function createIconSlotInstance(
  iconComponent,
  variableName,
  fallback,
  variableByName,
  stats,
  iconSize,
  iconSizeToken,
) {
  const size = iconSize || 16;
  const icon = iconComponent.createInstance();
  icon.name = "Icon";
  icon.resize(size, size);
  if (iconSizeToken) {
    bindSizeVariables(
      icon,
      iconSizeToken,
      iconSizeToken,
      variableByName,
      stats,
    );
  }
  icon.x = 0;
  icon.y = 0;
  storeIconSlotAuditMetadata(icon, variableName, fallback, stats);
  applyIconColorOverrides(icon, variableName, fallback, variableByName, stats);
  return icon;
}

function storeIconSlotAuditMetadata(icon, variableName, fallback, stats) {
  if (!icon || !icon.setSharedPluginData) return;

  try {
    icon.setSharedPluginData(RUN_NAMESPACE, "kind", "icon-slot-instance");
    icon.setSharedPluginData(RUN_NAMESPACE, "foreground-token", variableName);
    icon.setSharedPluginData(RUN_NAMESPACE, "foreground-fallback", fallback);
  } catch (error) {
    stats.warnings.push(
      `Could not store Icon audit metadata (${messageFor(error)}).`,
    );
  }
}

async function ensureDefaultIconComponent(variableByName, stats) {
  const existing = await findComponentByName(DEFAULT_ICON_COMPONENT_NAME);
  if (existing) {
    existing.description =
      "Default generated icon slot fallback for neutral button surfaces. Replace with Pointr Icon Library instances in consuming components.";
    resetIconGlyph(
      existing,
      "Colors/foreground/0",
      "#000000",
      variableByName,
      stats,
      16,
    );
    return existing;
  }

  const page = await ensurePage("Utilities");
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  const component = figma.createComponent();
  component.name = DEFAULT_ICON_COMPONENT_NAME;
  component.resize(16, 16);
  component.x = 80;
  component.y = 80;
  component.description =
    "Default icon artwork for instance-swap slots. Replace with Pointr Icon Library instances in consuming components.";
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "slot-default");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Icon");
  resetIconGlyph(
    component,
    "Colors/foreground/0",
    "#000000",
    variableByName,
    stats,
    16,
  );
  return component;
}

async function resolveDefaultIconSourceComponent(variableByName, stats) {
  const curated = await findKozmosIconSourceComponent(
    DEFAULT_CURATED_ICON_NAME,
  );
  if (curated) return curated;

  return ensureDefaultIconComponent(variableByName, stats);
}

async function findComponentByName(name) {
  for (const page of figma.root.children) {
    await page.loadAsync();
    const component = page.findOne(
      (node) => node.type === "COMPONENT" && node.name === name,
    );
    if (component) return component;
  }

  return null;
}

function kozmosIconComponentName(name) {
  return `Icon / ${name}`;
}

async function findKozmosIconSourceComponent(name) {
  return findComponentByName(kozmosIconComponentName(name));
}

async function findKozmosIconSourceComponents() {
  const page = figma.root.children.find(
    (child) => child.name === ICON_PAGE_NAME,
  );
  if (!page) return [];

  await page.loadAsync();
  const components = [];
  for (const definition of KOSMOS_ICON_DEFINITIONS) {
    const component = page.findOne(
      (node) =>
        node.type === "COMPONENT" &&
        node.name === kozmosIconComponentName(definition.name),
    );
    if (component) components.push(component);
  }

  return components;
}

function iconPreferredValues(components) {
  const values = [];
  for (const component of components) {
    if (!component.key) continue;
    values.push({
      type: "COMPONENT",
      key: component.key,
    });
  }

  return values;
}

async function syncIconSourceLibrary() {
  const stats = {
    updated: true,
    page: ICON_PAGE_NAME,
    planned: KOSMOS_ICON_DEFINITIONS.length,
    imported: 0,
    created: 0,
    refreshed: 0,
    failed: 0,
    preferredValuesApplied: 0,
    warnings: [],
  };

  const page = await ensurePage(ICON_PAGE_NAME);
  await figma.setCurrentPageAsync(page);
  await page.loadAsync();

  for (let index = 0; index < KOSMOS_ICON_DEFINITIONS.length; index += 1) {
    const definition = KOSMOS_ICON_DEFINITIONS[index];

    try {
      const sourceComponent = await figma.importComponentByKeyAsync(
        definition.componentKey,
      );
      stats.imported += 1;

      let component = page.findOne(
        (node) =>
          node.type === "COMPONENT" &&
          node.name === kozmosIconComponentName(definition.name),
      );

      if (!component) {
        component = figma.createComponent();
        component.name = kozmosIconComponentName(definition.name);
        page.appendChild(component);
        stats.created += 1;
      } else {
        stats.refreshed += 1;
      }

      syncKozmosIconSourceComponent(
        component,
        sourceComponent,
        definition,
        index,
        stats,
      );
    } catch (error) {
      stats.failed += 1;
      stats.warnings.push(
        `Could not import icon "${definition.name}" (${messageFor(error)}).`,
      );
    }
  }

  await refreshComponentIconSlotsAfterIconSync(stats);
  await applyCuratedIconSourcesToSlots(stats);
  stats.iconSourceCount = (await findKozmosIconSourceComponents()).length;
  return stats;
}

function syncKozmosIconSourceComponent(
  component,
  sourceComponent,
  definition,
  index,
  stats,
) {
  component.name = kozmosIconComponentName(definition.name);
  component.description = [
    `Kozmos curated icon source: ${definition.name}.`,
    `Source: Pointr Icon Library / ${definition.figmaName}.`,
    `Category: ${definition.category}.`,
    definition.description,
    "Use as an instance-swap source. Consuming components own size and foreground color.",
  ].join("\n");
  component.setSharedPluginData(RUN_NAMESPACE, "kind", "icon-source");
  component.setSharedPluginData(RUN_NAMESPACE, "component", "Icon");
  component.setSharedPluginData(RUN_NAMESPACE, "icon-name", definition.name);
  component.setSharedPluginData(
    RUN_NAMESPACE,
    "figma-name",
    definition.figmaName,
  );
  component.setSharedPluginData(
    RUN_NAMESPACE,
    "source-component-key",
    definition.componentKey,
  );

  if (component.layoutMode !== undefined) {
    component.layoutMode = "NONE";
  }
  component.resize(24, 24);
  component.clipsContent = true;
  component.fills = [];
  component.strokes = [];
  component.x = 80 + (index % 8) * 120;
  component.y = 80 + Math.floor(index / 8) * 96;

  if (component.children) {
    const existing = [];
    for (const child of component.children) existing.push(child);
    for (const child of existing) child.remove();
  }

  const source = sourceComponent.createInstance();
  source.name = "Pointr Source";
  source.x = 0;
  source.y = 0;
  try {
    source.resize(24, 24);
  } catch (error) {
    stats.warnings.push(
      `Could not resize icon "${definition.name}" source (${messageFor(error)}).`,
    );
  }
  component.appendChild(source);
  try {
    source.constraints = {
      horizontal: "STRETCH",
      vertical: "STRETCH",
    };
  } catch (error) {
    stats.warnings.push(
      `Could not set icon "${definition.name}" source constraints (${messageFor(error)}).`,
    );
  }
}

async function applyCuratedIconSourcesToSlots(stats) {
  const iconComponents = await findKozmosIconSourceComponents();
  const defaultComponent = await findKozmosIconSourceComponent(
    DEFAULT_CURATED_ICON_NAME,
  );

  if (!defaultComponent) {
    stats.warnings.push(
      `Could not apply Icon preferred values because ${kozmosIconComponentName(DEFAULT_CURATED_ICON_NAME)} was not found.`,
    );
    return;
  }

  const preferredValues = iconPreferredValues(iconComponents);
  const componentsPage = figma.root.children.find(
    (page) => page.name === "Components",
  );
  if (!componentsPage) return;

  await componentsPage.loadAsync();
  const targetNames = ["Button / v1", "IconButton / v1", "Badge / v1"];

  for (const targetName of targetNames) {
    const componentSet = componentsPage.findOne(
      (node) => node.type === "COMPONENT_SET" && node.name === targetName,
    );
    if (!componentSet) continue;

    const propertyName = ensureInstanceSwapProperty(
      componentSet,
      BUTTON_ICON_PROPERTY,
      defaultComponent.id,
      stats,
      preferredValues,
    );
    if (propertyName) stats.preferredValuesApplied += 1;
  }
}

async function refreshComponentIconSlotsAfterIconSync(stats) {
  const componentsPage = figma.root.children.find(
    (page) => page.name === "Components",
  );
  if (!componentsPage) return;

  await componentsPage.loadAsync();
  const variableByName = await ensureComponentRuntimeVariables(stats);

  await refreshButtonSlotsIfPresent(componentsPage, variableByName, stats);
  await refreshIconButtonSlotsIfPresent(componentsPage, variableByName, stats);
  await refreshBadgeSlotsIfPresent(componentsPage, variableByName, stats);
}

async function configureButtonIconSlot(componentSet, variableByName, stats) {
  const iconComponent = await resolveDefaultIconSourceComponent(
    variableByName,
    stats,
  );
  const iconSourceComponents = await findKozmosIconSourceComponents();
  const preferredValues = iconPreferredValues(iconSourceComponents);
  const propertyName = ensureInstanceSwapProperty(
    componentSet,
    BUTTON_ICON_PROPERTY,
    iconComponent.id,
    stats,
    preferredValues,
  );

  deleteInstanceSwapPropertiesByBaseName(
    componentSet,
    [
      BUTTON_ICON_ON_FILL_PROPERTY,
      BUTTON_ICON_ON_ACCENT_PROPERTY,
      BUTTON_ICON_ON_NEUTRAL_PROPERTY,
    ],
    stats,
  );

  if (!propertyName) return;

  for (const child of componentSet.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseButtonVariantName(child.name);
    if (!props || props.size !== "Icon" || props.state === "Loading") {
      continue;
    }

    const config = buttonConfig(props.variant, props.state);
    const metrics = buttonMetrics(props.size);
    let icon = directChildNamed(child, "Icon");
    if (icon && icon.type === "INSTANCE" && !isGeneratedIconSlotWrapper(icon)) {
      syncIconSlotInstance(
        icon,
        config,
        variableByName,
        stats,
        metrics.iconSize,
        metrics.iconSizeToken,
      );
    } else {
      if (icon) icon.remove();
      icon = createIconSlotInstance(
        iconComponent,
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
        metrics.iconSize,
        metrics.iconSizeToken,
      );
    }
    child.appendChild(icon);
    bindInstanceSwapProperty(icon, propertyName, stats);
    stats.iconSlotsBound += 1;
  }
}

async function configureBadgeIconSlot(
  componentSet,
  iconComponent,
  variableByName,
  stats,
) {
  if (!iconComponent) return;

  const iconSourceComponents = await findKozmosIconSourceComponents();
  const preferredValues = iconPreferredValues(iconSourceComponents);
  const propertyName = ensureInstanceSwapProperty(
    componentSet,
    BUTTON_ICON_PROPERTY,
    iconComponent.id,
    stats,
    preferredValues,
  );

  if (!propertyName) return;

  for (const child of componentSet.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseBadgeVariantName(child.name);
    if (!props || props.size !== "Icon") continue;

    const config = badgeConfig(props.variant);
    let icon = directChildNamed(child, "Icon");
    if (icon && icon.type === "INSTANCE" && !isGeneratedIconSlotWrapper(icon)) {
      syncIconSlotInstance(
        icon,
        config,
        variableByName,
        stats,
        16,
        "Badge/icon/size",
      );
    } else {
      if (icon) icon.remove();
      icon = createIconSlotInstance(
        iconComponent,
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
        16,
        "Badge/icon/size",
      );
    }
    child.appendChild(icon);
    setHugChildSizing(icon);
    bindInstanceSwapProperty(icon, propertyName, stats);
    stats.iconSlotsBound = (stats.iconSlotsBound || 0) + 1;
  }
}

async function configureIconButtonSlot(
  componentSet,
  iconComponent,
  variableByName,
  stats,
) {
  const iconSourceComponents = await findKozmosIconSourceComponents();
  const preferredValues = iconPreferredValues(iconSourceComponents);
  const propertyName = ensureInstanceSwapProperty(
    componentSet,
    BUTTON_ICON_PROPERTY,
    iconComponent.id,
    stats,
    preferredValues,
  );

  if (!propertyName) return;

  for (const child of componentSet.children) {
    if (child.type !== "COMPONENT") continue;

    const props = parseIconButtonVariantName(child.name);
    if (!props || props.state === "Loading") {
      continue;
    }

    const config = buttonConfig(props.variant, props.state);
    const metrics = iconButtonMetrics(props.size);
    let icon = directChildNamed(child, "Icon");
    if (icon && icon.type === "INSTANCE" && !isGeneratedIconSlotWrapper(icon)) {
      syncIconSlotInstance(
        icon,
        config,
        variableByName,
        stats,
        metrics.iconSize,
        metrics.iconSizeToken,
      );
    } else {
      if (icon) icon.remove();
      icon = createIconSlotInstance(
        iconComponent,
        config.foreground,
        config.foregroundFallback,
        variableByName,
        stats,
        metrics.iconSize,
        metrics.iconSizeToken,
      );
    }
    child.appendChild(icon);
    bindInstanceSwapProperty(icon, propertyName, stats);
    stats.iconSlotsBound += 1;
  }
}

async function refreshIconButtonSlotsIfPresent(page, variableByName, stats) {
  const existing = page.findOne(
    (node) => node.name === "IconButton / v1" && node.type === "COMPONENT_SET",
  );
  if (!existing) return;

  const iconComponent = await resolveDefaultIconSourceComponent(
    variableByName,
    stats,
  );
  await configureIconButtonSlot(existing, iconComponent, variableByName, stats);
  stats.relatedIconSlotsRefreshed = (stats.relatedIconSlotsRefreshed || 0) + 1;
}

async function refreshBadgeSlotsIfPresent(page, variableByName, stats) {
  const existing = page.findOne(
    (node) => node.name === "Badge / v1" && node.type === "COMPONENT_SET",
  );
  if (!existing) return;

  const iconComponent = await resolveDefaultIconSourceComponent(
    variableByName,
    stats,
  );
  await configureBadgeIconSlot(existing, iconComponent, variableByName, stats);
  stats.relatedIconSlotsRefreshed = (stats.relatedIconSlotsRefreshed || 0) + 1;
}

async function refreshButtonSlotsIfPresent(page, variableByName, stats) {
  const existing = page.findOne(
    (node) => node.name === "Button / v1" && node.type === "COMPONENT_SET",
  );
  if (!existing) return;

  await configureButtonIconSlot(existing, variableByName, stats);
  stats.relatedIconSlotsRefreshed = (stats.relatedIconSlotsRefreshed || 0) + 1;
}

async function pruneLegacyGeneratedIconSlotComponents(stats) {
  const utilities = figma.root.children.find(
    (page) => page.name === "Utilities",
  );
  if (!utilities) return;

  await utilities.loadAsync();
  const legacy = [];
  for (const child of utilities.children) {
    if (isLegacyGeneratedIconSlotComponent(child)) {
      legacy.push(child);
    }
  }

  if (legacy.length === 0) return;

  for (const component of legacy) {
    component.remove();
    stats.legacyIconSlotsRemoved = (stats.legacyIconSlotsRemoved || 0) + 1;
  }
}

function isLegacyGeneratedIconSlotComponent(node) {
  return node.type === "COMPONENT" && /^Icon \/ Slot \//.test(node.name);
}

function safeComponentPropertyDefinitions(componentSet, stats, context) {
  try {
    return {
      definitions: componentSet.componentPropertyDefinitions || {},
      error: null,
    };
  } catch (error) {
    const message = messageFor(error);
    if (stats) {
      stats.warnings.push(
        `Skipped ${context} because Figma could not read component property definitions (${message}). The variant nodes were still updated; run the updater again after Figma clears the existing property errors.`,
      );
    }
    return {
      definitions: {},
      error: message,
    };
  }
}

function normalizeComponentSetVariantProperties(
  componentSet,
  expectedAxes,
  stats,
) {
  if (!expectedAxes) return;

  const read = safeComponentPropertyDefinitions(
    componentSet,
    stats,
    "normalize variant properties",
  );
  const definitions = read.definitions;
  if (read.error) return;

  for (const propertyName of Object.keys(definitions)) {
    const definition = definitions[propertyName];
    if (definition.type !== "VARIANT") continue;

    const baseName = propertyName.split("#")[0];
    if (expectedAxes[baseName]) continue;

    if (!componentSet.deleteComponentProperty) {
      stats.warnings.push(
        `Could not remove unexpected variant property "${propertyName}"; this Figma runtime does not expose deleteComponentProperty.`,
      );
      continue;
    }

    try {
      componentSet.deleteComponentProperty(propertyName);
      stats.variantPropertiesRemoved =
        (stats.variantPropertiesRemoved || 0) + 1;
    } catch (error) {
      stats.warnings.push(
        `Could not remove unexpected variant property "${propertyName}" (${messageFor(error)}).`,
      );
    }
  }
}

function ensureInstanceSwapProperty(
  componentSet,
  name,
  defaultValue,
  stats,
  preferredValues,
) {
  const read = safeComponentPropertyDefinitions(
    componentSet,
    stats,
    `ensure ${name} instance-swap property`,
  );
  const definitions = read.definitions;
  if (read.error) return null;

  for (const propertyName of Object.keys(definitions)) {
    const definition = definitions[propertyName];
    const baseName = propertyName.split("#")[0];
    if (baseName === name && definition.type === "INSTANCE_SWAP") {
      updateInstanceSwapPropertyDefault(
        componentSet,
        propertyName,
        defaultValue,
        preferredValues,
      );
      return propertyName;
    }
  }

  if (!componentSet.addComponentProperty) {
    stats.warnings.push(
      "This Figma runtime does not expose addComponentProperty for Icon slots.",
    );
    return null;
  }

  try {
    const options = {};
    if (preferredValues && preferredValues.length > 0) {
      options.preferredValues = preferredValues;
    }

    return componentSet.addComponentProperty(
      name,
      "INSTANCE_SWAP",
      defaultValue,
      options,
    );
  } catch (error) {
    stats.warnings.push(
      `Could not create Icon instance-swap property (${messageFor(error)}).`,
    );
    return null;
  }
}

function updateInstanceSwapPropertyDefault(
  componentSet,
  propertyName,
  defaultValue,
  preferredValues,
) {
  if (!componentSet.editComponentProperty) return;

  try {
    const nextValue = { defaultValue: defaultValue };
    if (preferredValues && preferredValues.length > 0) {
      nextValue.preferredValues = preferredValues;
    }

    componentSet.editComponentProperty(propertyName, nextValue);
  } catch (_error) {
    // Older plugin runtimes may not support editing the default value in place.
  }
}

function configureLabelTextProperty(componentSet, defaultValue, stats) {
  const propertyName = ensureTextProperty(
    componentSet,
    "Label Text",
    defaultValue,
    stats,
  );
  if (!propertyName) return;

  let boundCount = 0;

  function walk(node) {
    if (node.type === "TEXT" && node.name === "Label Text") {
      bindTextProperty(node, propertyName, stats);
      boundCount += 1;
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  stats.labelTextBindings = boundCount;
}

function configurePlaceholderTextProperty(componentSet, defaultValue, stats) {
  const propertyName = ensureTextProperty(
    componentSet,
    "Placeholder Text",
    defaultValue,
    stats,
  );
  if (!propertyName) return;

  let boundCount = 0;

  function walk(node) {
    if (node.type === "TEXT" && node.name === "Placeholder Text") {
      bindTextProperty(node, propertyName, stats);
      boundCount += 1;
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  stats.placeholderTextBindings = boundCount;
}

function configureHelperTextProperty(componentSet, defaultValue, stats) {
  const propertyName = ensureTextProperty(
    componentSet,
    "Helper Text",
    defaultValue,
    stats,
  );
  if (!propertyName) return;

  let boundCount = 0;

  function walk(node) {
    if (node.type === "TEXT" && node.name === "Helper Text") {
      bindTextProperty(node, propertyName, stats);
      boundCount += 1;
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  stats.helperTextBindings = boundCount;
}

function configureNamedTextProperty(
  componentSet,
  nodeName,
  propertyName,
  defaultValue,
  stats,
) {
  const resolvedPropertyName = ensureTextProperty(
    componentSet,
    propertyName,
    defaultValue,
    stats,
  );
  if (!resolvedPropertyName) return;

  let boundCount = 0;

  function walk(node) {
    if (node.type === "TEXT" && node.name === nodeName) {
      bindTextProperty(node, resolvedPropertyName, stats);
      boundCount += 1;
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  const key = `${propertyName
    .replace(/[^A-Za-z0-9]+/g, "")
    .replace(/^./, (letter) => letter.toLowerCase())}Bindings`;
  stats[key] = boundCount;
}

function configureHelperVisibilityProperty(componentSet, stats) {
  const propertyName = ensureBooleanProperty(
    componentSet,
    "Show Helper Text",
    false,
    stats,
  );
  if (!propertyName) return;

  let boundCount = 0;

  function walk(node) {
    if (node.type === "TEXT" && node.name === "Helper Text") {
      bindVisibilityProperty(node, propertyName, stats);
      boundCount += 1;
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  stats.helperVisibilityBindings = boundCount;
}

function configureBadgeCounterVisibilityProperty(componentSet, stats) {
  const propertyName = ensureBooleanProperty(
    componentSet,
    "Show Counter",
    false,
    stats,
  );
  if (!propertyName) return;

  let boundCount = 0;

  function walk(node) {
    if (isBadgeCounterNode(node)) {
      bindVisibilityProperty(node, propertyName, stats);
      boundCount += 1;
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  stats.badgeCounterVisibilityBindings = boundCount;
}

function exposeNestedCounterInstance(instance, stats) {
  if (!instance || instance.type !== "INSTANCE") return;
  if (!nodeHasComponentAncestor(instance)) {
    if (stats && stats.warnings) {
      stats.warnings.push(
        "Could not expose nested Counter instance because it is not inside a component yet.",
      );
    }
    return;
  }

  try {
    instance.isExposedInstance = true;
  } catch (error) {
    if (stats && stats.warnings) {
      stats.warnings.push(
        `Could not expose nested Counter instance (${messageFor(error)}).`,
      );
    }
  }
}

function nodeHasComponentAncestor(node) {
  let current = node ? node.parent : null;
  while (current) {
    if (current.type === "COMPONENT" || current.type === "COMPONENT_SET") {
      return true;
    }
    current = current.parent;
  }

  return false;
}

function configureFocusVisibleProperty(componentSet, stats) {
  const propertyName = ensureBooleanProperty(
    componentSet,
    FOCUS_VISIBLE_PROPERTY_NAME,
    false,
    stats,
  );
  if (!propertyName) return;

  let boundCount = 0;

  function walk(node) {
    if (
      node.name === "Focus Ring" &&
      node.getSharedPluginData &&
      node.getSharedPluginData(RUN_NAMESPACE, "kind") === "focus-ring"
    ) {
      bindVisibilityProperty(node, propertyName, stats);
      boundCount += 1;
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(componentSet);
  stats.focusVisibleBindings = boundCount;
}

function ensureTextProperty(componentSet, name, defaultValue, stats) {
  const read = safeComponentPropertyDefinitions(
    componentSet,
    stats,
    `ensure ${name} text property`,
  );
  const definitions = read.definitions;
  if (read.error) return null;

  for (const propertyName of Object.keys(definitions)) {
    const definition = definitions[propertyName];
    const baseName = propertyName.split("#")[0];
    if (baseName === name && definition.type === "TEXT") {
      updateTextPropertyDefault(componentSet, propertyName, defaultValue);
      return propertyName;
    }
  }

  if (!componentSet.addComponentProperty) {
    stats.warnings.push(
      `This Figma runtime does not expose addComponentProperty for ${name}.`,
    );
    return null;
  }

  try {
    return componentSet.addComponentProperty(name, "TEXT", defaultValue);
  } catch (error) {
    stats.warnings.push(
      `Could not create ${name} text property (${messageFor(error)}).`,
    );
    return null;
  }
}

function ensureBooleanProperty(componentSet, name, defaultValue, stats) {
  const read = safeComponentPropertyDefinitions(
    componentSet,
    stats,
    `ensure ${name} boolean property`,
  );
  const definitions = read.definitions;
  if (read.error) return null;

  for (const propertyName of Object.keys(definitions)) {
    const definition = definitions[propertyName];
    const baseName = propertyName.split("#")[0];
    if (baseName === name && definition.type === "BOOLEAN") {
      updateBooleanPropertyDefault(componentSet, propertyName, defaultValue);
      return propertyName;
    }
  }

  if (!componentSet.addComponentProperty) {
    stats.warnings.push(
      `This Figma runtime does not expose addComponentProperty for ${name}.`,
    );
    return null;
  }

  try {
    return componentSet.addComponentProperty(name, "BOOLEAN", defaultValue);
  } catch (error) {
    stats.warnings.push(
      `Could not create ${name} boolean property (${messageFor(error)}).`,
    );
    return null;
  }
}

function updateTextPropertyDefault(componentSet, propertyName, defaultValue) {
  if (!componentSet.editComponentProperty) return;

  try {
    componentSet.editComponentProperty(propertyName, { defaultValue });
  } catch (_error) {
    // Older plugin runtimes may not support editing the default value in place.
  }
}

function updateBooleanPropertyDefault(
  componentSet,
  propertyName,
  defaultValue,
) {
  if (!componentSet.editComponentProperty) return;

  try {
    componentSet.editComponentProperty(propertyName, { defaultValue });
  } catch (_error) {
    // Older plugin runtimes may not support editing the default value in place.
  }
}

function bindTextProperty(textNode, propertyName, stats) {
  if (!textNode || textNode.type !== "TEXT") {
    stats.warnings.push(
      "Could not bind Label Text property; the generated label is not a text node.",
    );
    return;
  }

  try {
    const references = {};
    const existing = textNode.componentPropertyReferences || {};
    for (const key of Object.keys(existing)) {
      references[key] = existing[key];
    }
    references.characters = propertyName;
    textNode.componentPropertyReferences = references;
  } catch (error) {
    stats.warnings.push(
      `Could not bind Label Text property (${messageFor(error)}).`,
    );
  }
}

function bindVisibilityProperty(node, propertyName, stats) {
  if (!node) {
    stats.warnings.push(
      "Could not bind visibility property; the generated node is missing.",
    );
    return;
  }

  try {
    const references = {};
    const existing = node.componentPropertyReferences || {};
    for (const key of Object.keys(existing)) {
      references[key] = existing[key];
    }
    references.visible = propertyName;
    node.componentPropertyReferences = references;
  } catch (error) {
    stats.warnings.push(
      `Could not bind visibility property (${messageFor(error)}).`,
    );
  }
}

function deleteComponentPropertiesByBaseName(
  componentSet,
  baseNames,
  types,
  stats,
) {
  const read = safeComponentPropertyDefinitions(
    componentSet,
    stats,
    "delete stale component properties",
  );
  const definitions = read.definitions;
  if (read.error) return;

  for (const propertyName of Object.keys(definitions)) {
    const definition = definitions[propertyName];
    const baseName = propertyName.split("#")[0];
    if (baseNames.indexOf(baseName) === -1) continue;
    if (types && types.indexOf(definition.type) === -1) continue;

    if (!componentSet.deleteComponentProperty) {
      continue;
    }

    try {
      componentSet.deleteComponentProperty(propertyName);
      stats.componentPropertiesRemoved =
        (stats.componentPropertiesRemoved || 0) + 1;
    } catch (error) {
      stats.warnings.push(
        `Could not remove stale component property "${propertyName}" (${messageFor(error)}).`,
      );
    }
  }
}

function deleteInstanceSwapPropertiesByBaseName(
  componentSet,
  baseNames,
  stats,
) {
  const read = safeComponentPropertyDefinitions(
    componentSet,
    stats,
    "delete stale instance-swap properties",
  );
  const definitions = read.definitions;
  if (read.error) return;

  for (const propertyName of Object.keys(definitions)) {
    const definition = definitions[propertyName];
    const baseName = propertyName.split("#")[0];
    if (
      baseNames.indexOf(baseName) === -1 ||
      definition.type !== "INSTANCE_SWAP"
    ) {
      continue;
    }

    if (!componentSet.deleteComponentProperty) {
      continue;
    }

    try {
      componentSet.deleteComponentProperty(propertyName);
      stats.iconSlotPropertiesRemoved =
        (stats.iconSlotPropertiesRemoved || 0) + 1;
    } catch (error) {
      stats.warnings.push(
        `Could not remove stale Icon property "${propertyName}" (${messageFor(error)}).`,
      );
    }
  }
}

function bindInstanceSwapProperty(instance, propertyName, stats) {
  const target = instance;
  if (!target || target.type !== "INSTANCE") {
    stats.warnings.push(
      "Could not bind Icon instance-swap property; the generated slot is not an instance.",
    );
    return;
  }

  try {
    target.componentPropertyReferences = {
      mainComponent: propertyName,
    };
  } catch (error) {
    stats.warnings.push(
      `Could not bind Icon instance-swap property (${messageFor(error)}).`,
    );
  }
}

function tintIconSlotMark(icon, config, variableByName, stats) {
  if (isGeneratedIconSlotWrapper(icon)) {
    stats.warnings.push(
      "Encountered a legacy masked Icon wrapper while tinting. Run Update Button/IconButton to rebuild direct icon instances.",
    );
    return;
  }

  if (icon.type === "INSTANCE") {
    applyIconColorOverrides(
      icon,
      config.foreground,
      config.foregroundFallback,
      variableByName,
      stats,
    );
    return;
  }

  const paint = paintFromVariable(
    config.foreground,
    config.foregroundFallback,
    variableByName,
    stats,
  );
  let applied = false;

  function walk(node) {
    try {
      if (node.name === "Icon Circle" && node.type === "ELLIPSE") {
        node.fills = [];
        node.strokes = [clonePaint(paint)];
        node.strokeWeight = 2;
        applied = true;
      } else if (node.name === "Icon Handle" && node.type === "RECTANGLE") {
        node.fills = [clonePaint(paint)];
        node.strokes = [];
        applied = true;
      } else if (node.name === "Icon Mark" && node.type === "RECTANGLE") {
        node.fills = [clonePaint(paint)];
        node.strokes = [];
        applied = true;
      }
    } catch (error) {
      stats.warnings.push(
        `Could not tint icon slot "${node.name}" (${messageFor(error)}).`,
      );
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(icon);

  if (!applied && icon.type === "FRAME") {
    resetIconGlyph(
      icon,
      config.foreground,
      config.foregroundFallback,
      variableByName,
      stats,
      Math.round(icon.width || 16),
    );
  }
}

function isGeneratedIconSlotWrapper(node) {
  return (
    node &&
    node.name === "Icon" &&
    node.type === "FRAME" &&
    node.getSharedPluginData &&
    node.getSharedPluginData(RUN_NAMESPACE, "kind") === "icon-slot-instance"
  );
}

function applyIconColorOverrides(
  icon,
  variableName,
  fallback,
  variableByName,
  stats,
) {
  const paint = paintFromVariable(
    variableName,
    fallback,
    variableByName,
    stats,
  );
  let applied = false;

  function walk(node) {
    try {
      if (Array.isArray(node.fills) && firstVisibleSolidPaint(node.fills)) {
        node.fills = [clonePaint(paint)];
        applied = true;
      }

      if (Array.isArray(node.strokes) && firstVisibleSolidPaint(node.strokes)) {
        node.strokes = [clonePaint(paint)];
        applied = true;
      }
    } catch (error) {
      stats.warnings.push(
        `Could not override icon color on "${node.name || node.type}" (${messageFor(error)}).`,
      );
    }

    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(icon);

  if (!applied) {
    stats.warnings.push(
      `Could not find tintable fill or stroke layers in Icon slot for "${variableName}".`,
    );
  }
}

function resetIconGlyph(
  parent,
  variableName,
  fallback,
  variableByName,
  stats,
  size,
) {
  const iconSize = size || 16;
  const paint = paintFromVariable(
    variableName,
    fallback,
    variableByName,
    stats,
  );

  if (parent.layoutMode !== undefined) {
    parent.layoutMode = "NONE";
  }
  parent.resize(iconSize, iconSize);
  parent.fills = [];
  parent.strokes = [];

  if (parent.children) {
    const existing = [];
    for (const child of parent.children) existing.push(child);
    for (const child of existing) child.remove();
  }

  const circle = figma.createEllipse();
  circle.name = "Icon Circle";
  circle.resize(iconSize * 0.5, iconSize * 0.5);
  circle.x = iconSize * 0.18;
  circle.y = iconSize * 0.18;
  circle.fills = [];
  circle.strokes = [clonePaint(paint)];
  circle.strokeWeight = Math.max(1.5, iconSize * 0.12);
  circle.constraints = {
    horizontal: "SCALE",
    vertical: "SCALE",
  };

  const handle = figma.createRectangle();
  handle.name = "Icon Handle";
  handle.resize(iconSize * 0.34, Math.max(1.5, iconSize * 0.12));
  handle.x = iconSize * 0.58;
  handle.y = iconSize * 0.7;
  handle.rotation = 45;
  handle.cornerRadius = Math.max(1, iconSize * 0.06);
  handle.fills = [clonePaint(paint)];
  handle.strokes = [];
  handle.constraints = {
    horizontal: "SCALE",
    vertical: "SCALE",
  };

  parent.appendChild(circle);
  parent.appendChild(handle);
}

function clonePaint(paint) {
  const copy = {
    type: paint.type,
    color: {
      r: paint.color.r,
      g: paint.color.g,
      b: paint.color.b,
    },
    opacity: paint.opacity,
  };

  if (paint.boundVariables) copy.boundVariables = paint.boundVariables;
  if (paint.visible !== undefined) copy.visible = paint.visible;
  if (paint.blendMode) copy.blendMode = paint.blendMode;
  return copy;
}

function buttonMetrics(size) {
  if (size === "Small") {
    return {
      width: 96,
      height: 44,
      paddingX: 12,
      gap: 8,
      iconSize: 16,
      iconSizeToken: "Button/icon/size",
      spinnerSize: 14,
      spinnerSizeToken: "Button/spinner/size",
      widthToken: "Button/width/small",
      heightToken: "Button/height/small",
      paddingXToken: "Button/padding/x/small",
      gapToken: "Button/gap/default",
    };
  }

  if (size === "Large") {
    return {
      width: 136,
      height: 44,
      paddingX: 32,
      gap: 8,
      iconSize: 16,
      iconSizeToken: "Button/icon/size",
      spinnerSize: 14,
      spinnerSizeToken: "Button/spinner/size",
      widthToken: "Button/width/large",
      heightToken: "Button/height/large",
      paddingXToken: "Button/padding/x/large",
      gapToken: "Button/gap/default",
    };
  }

  if (size === "Icon") {
    return {
      width: 44,
      height: 44,
      paddingX: 0,
      gap: 0,
      iconSize: 16,
      iconSizeToken: "Button/icon/size",
      spinnerSize: 14,
      spinnerSizeToken: "Button/spinner/size",
      widthToken: "Button/width/icon",
      heightToken: "Button/height/icon",
      paddingXToken: "Button/padding/x/icon",
      gapToken: "Button/gap/icon",
    };
  }

  return {
    width: 112,
    height: 44,
    paddingX: 16,
    gap: 8,
    iconSize: 16,
    iconSizeToken: "Button/icon/size",
    spinnerSize: 14,
    spinnerSizeToken: "Button/spinner/size",
    widthToken: "Button/width/default",
    heightToken: "Button/height/default",
    paddingXToken: "Button/padding/x/default",
    gapToken: "Button/gap/default",
  };
}

function iconButtonMetrics(size) {
  if (size === "Small") {
    return {
      size: 44,
      iconSize: 14,
      spinnerSize: 14,
      sizeToken: "IconButton/size/small",
      iconSizeToken: "IconButton/icon/size/small",
      spinnerSizeToken: "IconButton/spinner/size/small",
    };
  }

  if (size === "Large") {
    return {
      size: 44,
      iconSize: 20,
      spinnerSize: 16,
      sizeToken: "IconButton/size/large",
      iconSizeToken: "IconButton/icon/size/large",
      spinnerSizeToken: "IconButton/spinner/size/large",
    };
  }

  return {
    size: 44,
    iconSize: 16,
    spinnerSize: 14,
    sizeToken: "IconButton/size/default",
    iconSizeToken: "IconButton/icon/size/default",
    spinnerSizeToken: "IconButton/spinner/size/default",
  };
}

function badgeMetrics(size) {
  if (size === "Small") {
    return {
      width: 58,
      height: 44,
      paddingX: 12,
      heightToken: "Badge/height/small",
      paddingXToken: "Badge/padding/x/small",
    };
  }

  if (size === "Large") {
    return {
      width: 86,
      height: 44,
      paddingX: 32,
      heightToken: "Badge/height/large",
      paddingXToken: "Badge/padding/x/large",
    };
  }

  if (size === "Icon") {
    return {
      width: 44,
      height: 44,
      paddingX: 0,
      iconSize: 16,
      widthToken: "Badge/width/icon",
      heightToken: "Badge/height/icon",
      paddingXToken: "Badge/padding/x/icon",
      iconSizeToken: "Badge/icon/size",
    };
  }

  return {
    width: 66,
    height: 44,
    paddingX: 16,
    heightToken: "Badge/height/default",
    paddingXToken: "Badge/padding/x/default",
  };
}

function counterMetrics(size) {
  if (size === "Small") {
    return {
      minWidth: 18,
      height: 18,
      paddingX: 5,
      fontSize: 11,
      lineHeight: 14,
      minWidthToken: "Counter/min-width/small",
      heightToken: "Counter/height/small",
      paddingXToken: "Counter/padding/x/small",
      fontSizeToken: "Counter/font-size/small",
      lineHeightToken: "Counter/line-height/small",
    };
  }

  return {
    minWidth: 20,
    height: 20,
    paddingX: 6,
    fontSize: 12,
    lineHeight: 16,
    minWidthToken: "Counter/min-width/default",
    heightToken: "Counter/height/default",
    paddingXToken: "Counter/padding/x/default",
    fontSizeToken: "Counter/font-size/default",
    lineHeightToken: "Counter/line-height/default",
  };
}

function badgeLabelText(variant, size) {
  if (size === "Icon") return "1";
  if (variant === "Default") return "Badge";
  return variant;
}

function counterToneForBadgeVariant(variant) {
  if (variant === "Default" || variant === "Destructive") return "Inverse";
  return "Neutral";
}

function cardTitleText(_content) {
  return "Create project";
}

function cardDescriptionText(_content) {
  return "Deploy your new project in one click.";
}

function cardBodyText(content) {
  if (content === "Basic") {
    return "Use a basic Card when the surrounding heading already provides enough context.";
  }

  if (content === "Full") {
    return "Full cards can carry a short decision, summary, or setting with local supporting actions.";
  }

  return "Header cards pair a clear title with supporting content so related information stays scannable.";
}

function tabsDefaultLabel(index) {
  return (
    ["Overview", "Details", "Usage", "History"][index] || `Tab ${index + 1}`
  );
}

function textVariantCombinations() {
  const combinations = [];

  for (const size of TEXT_SIZES) {
    for (const weight of TEXT_WEIGHTS) {
      for (const tone of TEXT_TONES) {
        combinations.push({ size, weight, tone });
      }
    }
  }

  return combinations;
}

function textVariantKey(props) {
  return `${props.size}/${props.weight}/${props.tone}`;
}

function stackVariantCombinations() {
  const combinations = [];

  for (const direction of STACK_DIRECTIONS) {
    for (const gap of STACK_GAPS) {
      combinations.push({ direction, gap });
    }
  }

  return combinations;
}

function stackVariantKey(props) {
  return `${props.direction}/${props.gap}`;
}

function textMetrics(size) {
  const metrics = {
    XS: { fontSize: 12, lineHeight: 16, token: "xs" },
    Small: { fontSize: 14, lineHeight: 20, token: "sm" },
    Base: { fontSize: 16, lineHeight: 24, token: "base" },
    Large: { fontSize: 18, lineHeight: 28, token: "lg" },
    XLarge: { fontSize: 20, lineHeight: 28, token: "xl" },
    "2XLarge": { fontSize: 24, lineHeight: 32, token: "2xl" },
    "3XLarge": { fontSize: 30, lineHeight: 36, token: "3xl" },
    "4XLarge": { fontSize: 36, lineHeight: 40, token: "4xl" },
  };

  return metrics[size] || metrics.Base;
}

function textFontForWeight(weight, fonts) {
  if (weight === "Bold") return fonts.bold || fonts.medium || fonts.regular;
  if (weight === "Semibold" || weight === "Medium") {
    return fonts.medium || fonts.regular;
  }
  return fonts.regular;
}

function textToneConfig(tone) {
  const configs = {
    Default: {
      foreground: "Colors/foreground/0",
      foregroundFallback: "#000000",
    },
    Muted: {
      foreground: "Colors/foreground/500",
      foregroundFallback: "#747B8B",
    },
    Primary: {
      foreground: "Colors/theme/600",
      foregroundFallback: "#1051E8",
    },
    Destructive: {
      foreground: "Colors/emotional/danger/600",
      foregroundFallback: "#D41C42",
    },
  };

  return configs[tone] || configs.Default;
}

function linkConfig(variant) {
  if (variant === "Subtle") {
    return {
      foreground: "Colors/foreground/500",
      foregroundFallback: "#747B8B",
    };
  }

  return {
    foreground: "Colors/theme/600",
    foregroundFallback: "#1051E8",
  };
}

function textSampleForSize(size) {
  if (size === "XS" || size === "Small") return "Kozmos label";
  if (size === "3XLarge" || size === "4XLarge") return "Kozmos";
  return "Kozmos text";
}

function headingMetrics(level) {
  const metrics = {
    H1: { fontSize: 36, lineHeight: 40, token: "4xl" },
    H2: { fontSize: 30, lineHeight: 36, token: "3xl" },
    H3: { fontSize: 24, lineHeight: 32, token: "2xl" },
    H4: { fontSize: 20, lineHeight: 28, token: "xl" },
    H5: { fontSize: 18, lineHeight: 28, token: "lg" },
    H6: { fontSize: 16, lineHeight: 24, token: "base" },
  };

  return metrics[level] || metrics.H2;
}

function headingSampleForLevel(level) {
  if (level === "H1" || level === "H2") return "Kozmos";
  return `${level} Heading`;
}

function skeletonMetrics(shape) {
  if (shape === "Circle") {
    return {
      width: 40,
      height: 40,
      radius: 9999,
      widthToken: "Skeleton/size/circle",
      heightToken: "Skeleton/size/circle",
      radiusToken: "Skeleton/radius/circle",
    };
  }

  if (shape === "Block") {
    return {
      width: 320,
      height: 80,
      radius: 8,
      widthToken: "Skeleton/width/block",
      heightToken: "Skeleton/height/block",
      radiusToken: "Skeleton/radius/default",
    };
  }

  return {
    width: 240,
    height: 16,
    radius: 8,
    widthToken: "Skeleton/width/line",
    heightToken: "Skeleton/height/line",
    radiusToken: "Skeleton/radius/default",
  };
}

function boxSurfaceConfig(surface) {
  if (surface === "Surface") {
    return {
      background: "Colors/background/100",
      backgroundFallback: "#E4E6EA",
    };
  }

  if (surface === "Outlined") {
    return {
      background: "Surface/0",
      stroke: "Colors/background/200",
      backgroundFallback: "#FFFFFF",
      strokeFallback: "#C7CAD1",
    };
  }

  return {};
}

function tabsWidthForCount(count) {
  if (count === "Four") return 640;
  if (count === "Three") return 480;
  return 320;
}

function tabsActiveIsValidForCount(active, count) {
  const tabCount = TABS_COUNT_TO_NUMBER[count];
  const activeIndex = TABS_ACTIVE_TO_INDEX[active];
  return (
    Number.isFinite(tabCount) && activeIndex >= 0 && activeIndex < tabCount
  );
}

function tabsVariantCombinations() {
  const combinations = [];

  for (const count of TABS_COUNTS) {
    for (const active of TABS_ACTIVE) {
      if (!tabsActiveIsValidForCount(active, count)) continue;
      for (const state of TABS_STATES) {
        combinations.push({ count, active, state });
      }
    }
  }

  return combinations;
}

function tabsTriggerConfig(state, isActive) {
  if (state === "Disabled") {
    return {
      background: isActive ? "Colors/background/200" : null,
      foreground: "Colors/foreground/500",
      backgroundFallback: "#C7CAD1",
      foregroundFallback: "#747B8B",
    };
  }

  return {
    background: isActive ? "Colors/background/0" : null,
    foreground: isActive ? "Colors/foreground/0" : "Colors/foreground/400",
    backgroundFallback: "#FFFFFF",
    foregroundFallback: isActive ? "#000000" : "#5D626F",
  };
}

function buttonConfig(variant, state) {
  const tokenState = state === "Disabled" ? "disabled" : "idle";
  const configs = {
    Default: {
      background: `Primary Buttons/themed/button/background/${tokenState}`,
      foreground: `Primary Buttons/themed/button/foreground/content/${tokenState}`,
      backgroundFallback: state === "Disabled" ? "#2E3138" : "#0D44C2",
      foregroundFallback: state === "Disabled" ? "#464A53" : "#FFFFFF",
    },
    Destructive: {
      background: `Primary Buttons/danger/button/background/${tokenState}`,
      foreground: `Primary Buttons/danger/button/foreground/content/${tokenState}`,
      backgroundFallback: state === "Disabled" ? "#2E3138" : "#B01736",
      foregroundFallback: state === "Disabled" ? "#464A53" : "#FFFFFF",
    },
    Secondary: {
      background: "Colors/background/200",
      foreground: "Colors/foreground/0",
      backgroundFallback: "#C7CAD1",
      foregroundFallback: "#000000",
    },
    Outline: {
      background: "Surface/0",
      foreground: `Secondary Buttons/themed/button/foreground/content/${tokenState}`,
      stroke: `Secondary Buttons/themed/button/foreground/content/${tokenState}`,
      backgroundFallback: "#FFFFFF",
      foregroundFallback: state === "Disabled" ? "#464A53" : "#0D44C2",
      strokeFallback: state === "Disabled" ? "#464A53" : "#0D44C2",
    },
    Ghost: {
      foreground: `Secondary Buttons/themed/button/foreground/content/${tokenState}`,
      foregroundFallback: state === "Disabled" ? "#464A53" : "#0D44C2",
    },
    Link: {
      foreground: `Secondary Buttons/themed/button/foreground/content/${tokenState}`,
      foregroundFallback: state === "Disabled" ? "#464A53" : "#0D44C2",
    },
    Glass: {
      background: "Colors/transparent/inverted/10",
      foreground: "Colors/foreground/0",
      stroke: "Border/bevel/top",
      backgroundFallback: "#FCFCFD1A",
      foregroundFallback: "#000000",
      strokeFallback: "#FFFFFF80",
    },
  };

  return configs[variant] || configs.Default;
}

function badgeConfig(variant) {
  const configs = {
    Default: {
      background: "Colors/theme/600",
      foreground: "Colors/foreground/1000",
      backgroundFallback: "#1051E8",
      foregroundFallback: "#FFFFFF",
    },
    Destructive: {
      background: "Colors/emotional/danger/600",
      foreground: "Colors/foreground/1000",
      backgroundFallback: "#D41C42",
      foregroundFallback: "#FFFFFF",
    },
    Secondary: {
      background: "Colors/background/200",
      foreground: "Colors/foreground/0",
      backgroundFallback: "#C7CAD1",
      foregroundFallback: "#000000",
    },
    Outline: {
      background: "Surface/0",
      foreground: "Colors/foreground/0",
      stroke: "Colors/background/200",
      backgroundFallback: "#FFFFFF",
      foregroundFallback: "#000000",
      strokeFallback: "#C7CAD1",
    },
    Ghost: {
      foreground: "Colors/foreground/0",
      foregroundFallback: "#000000",
    },
    Link: {
      foreground: "Colors/theme/600",
      foregroundFallback: "#1051E8",
    },
  };

  return configs[variant] || configs.Default;
}

function counterConfig(tone) {
  const configs = {
    Neutral: {
      background: "Colors/background/200",
      foreground: "Colors/foreground/0",
      backgroundFallback: "#C7CAD1",
      foregroundFallback: "#000000",
    },
    Brand: {
      background: "Colors/theme/600",
      foreground: "Colors/foreground/1000",
      backgroundFallback: "#1051E8",
      foregroundFallback: "#FFFFFF",
    },
    Destructive: {
      background: "Colors/emotional/danger/600",
      foreground: "Colors/foreground/1000",
      backgroundFallback: "#D41C42",
      foregroundFallback: "#FFFFFF",
    },
    Inverse: {
      background: "Surface/0",
      foreground: "Colors/foreground/0",
      backgroundFallback: "#FFFFFF",
      foregroundFallback: "#000000",
    },
  };

  return configs[tone] || configs.Neutral;
}

function checkboxConfig(checked, state) {
  const isChecked = checked === "Checked";
  const isDisabled = state === "Disabled";
  const isError = state === "Error";

  if (isDisabled) {
    return {
      controlFill: isChecked ? "Colors/background/200" : null,
      controlStroke: "Colors/foreground/500",
      mark: "Colors/foreground/500",
      label: "Colors/foreground/500",
      controlFillFallback: "#C7CAD1",
      controlStrokeFallback: "#747B8B",
      markFallback: "#747B8B",
      labelFallback: "#747B8B",
    };
  }

  return {
    controlFill: isChecked ? "Colors/theme/500" : null,
    controlStroke: isError
      ? "Colors/emotional/danger/600"
      : isChecked
        ? "Colors/theme/500"
        : "Colors/foreground/500",
    mark: "Colors/foreground/1000",
    label: isError ? "Colors/emotional/danger/600" : "Colors/foreground/0",
    controlFillFallback: "#135BEC",
    controlStrokeFallback: isError
      ? "#D41C42"
      : isChecked
        ? "#135BEC"
        : "#747B8B",
    markFallback: "#FFFFFF",
    labelFallback: isError ? "#D41C42" : "#000000",
  };
}

function radioConfig(checked, state) {
  const isChecked = checked === "Checked";
  const isDisabled = state === "Disabled";
  const isError = state === "Error";

  if (isDisabled) {
    return {
      controlStroke: "Colors/foreground/500",
      dot: "Colors/foreground/500",
      label: "Colors/foreground/500",
      controlStrokeFallback: "#747B8B",
      dotFallback: "#747B8B",
      labelFallback: "#747B8B",
    };
  }

  return {
    controlStroke: isError
      ? "Colors/emotional/danger/600"
      : isChecked
        ? "Colors/theme/500"
        : "Colors/foreground/500",
    dot: isError ? "Colors/emotional/danger/600" : "Colors/theme/500",
    label: isError ? "Colors/emotional/danger/600" : "Colors/foreground/0",
    controlStrokeFallback: isError
      ? "#D41C42"
      : isChecked
        ? "#135BEC"
        : "#747B8B",
    dotFallback: isError ? "#D41C42" : "#135BEC",
    labelFallback: isError ? "#D41C42" : "#000000",
  };
}

function switchConfig(checked, state) {
  const isChecked = checked === "Checked";
  const isDisabled = state === "Disabled";
  const isError = state === "Error";

  if (isDisabled) {
    return {
      trackFill: "Colors/foreground/500",
      trackStroke: "Colors/foreground/500",
      thumbFill: "Colors/background/0",
      label: "Colors/foreground/500",
      trackFillFallback: "#747B8B",
      trackStrokeFallback: "#747B8B",
      thumbFillFallback: "#FFFFFF",
      labelFallback: "#747B8B",
    };
  }

  if (isError) {
    return {
      trackFill: isChecked
        ? "Colors/emotional/danger/600"
        : "Colors/foreground/500",
      trackStroke: "Colors/emotional/danger/600",
      thumbFill: "Colors/background/0",
      label: "Colors/emotional/danger/600",
      trackFillFallback: isChecked ? "#D41C42" : "#747B8B",
      trackStrokeFallback: "#D41C42",
      thumbFillFallback: "#FFFFFF",
      labelFallback: "#D41C42",
    };
  }

  return {
    trackFill: isChecked ? "Colors/theme/500" : "Colors/foreground/500",
    trackStroke: isChecked ? "Colors/theme/500" : "Colors/foreground/500",
    thumbFill: "Colors/background/0",
    label: "Colors/foreground/0",
    trackFillFallback: isChecked ? "#135BEC" : "#747B8B",
    trackStrokeFallback: isChecked ? "#135BEC" : "#747B8B",
    thumbFillFallback: "#FFFFFF",
    labelFallback: "#000000",
  };
}

function inputConfig(state, status) {
  const isDisabled = state === "Disabled";
  const isReadonly = state === "Readonly";
  const isFocus = state === "Focus";
  const isError = status === "Error";
  const isWarning = status === "Warning";
  const isSuccess = status === "Success";

  if (isDisabled) {
    return {
      fieldFill: "Colors/background/100",
      fieldStroke: "Colors/foreground/500",
      label: "Colors/foreground/500",
      placeholder: "Colors/foreground/500",
      helper: "Colors/foreground/500",
      fieldFillFallback: "#E3E4E8",
      fieldStrokeFallback: "#747B8B",
      labelFallback: "#747B8B",
      placeholderFallback: "#747B8B",
      helperFallback: "#747B8B",
    };
  }

  if (isError || isWarning || isSuccess) {
    const tone = isError
      ? {
          token: "Colors/emotional/danger/600",
          fallback: "#D41C42",
        }
      : isWarning
        ? {
            token: "Colors/emotional/alert/900",
            fallback: "#744D03",
          }
        : {
            token: "Colors/emotional/success/900",
            fallback: "#14653D",
          };

    return {
      fieldFill: isReadonly ? "Colors/background/100" : "Colors/background/0",
      fieldStroke: tone.token,
      label: tone.token,
      placeholder: "Colors/foreground/400",
      helper: tone.token,
      fieldFillFallback: isReadonly ? "#E3E4E8" : "#FFFFFF",
      fieldStrokeFallback: tone.fallback,
      labelFallback: tone.fallback,
      placeholderFallback: "#5D626F",
      helperFallback: tone.fallback,
    };
  }

  return {
    fieldFill: isReadonly ? "Colors/background/100" : "Colors/background/0",
    fieldStroke: isFocus ? "Colors/theme/500" : "Colors/foreground/500",
    label: "Colors/foreground/0",
    placeholder: "Colors/foreground/400",
    helper: "Colors/foreground/400",
    fieldFillFallback: isReadonly ? "#E3E4E8" : "#FFFFFF",
    fieldStrokeFallback: isFocus ? "#135BEC" : "#747B8B",
    labelFallback: "#000000",
    placeholderFallback: "#5D626F",
    helperFallback: "#5D626F",
  };
}

function sliderConfig(state, status) {
  const isDisabled = state === "Disabled";
  const isError = status === "Error";

  if (isDisabled) {
    return {
      trackFill: "Colors/background/200",
      trackStroke: "Colors/foreground/500",
      rangeFill: "Colors/foreground/500",
      thumbFill: "Colors/background/0",
      thumbStroke: "Colors/foreground/500",
      label: "Colors/foreground/500",
      trackFillFallback: "#C7CAD1",
      trackStrokeFallback: "#747B8B",
      rangeFillFallback: "#747B8B",
      thumbFillFallback: "#FFFFFF",
      thumbStrokeFallback: "#747B8B",
      labelFallback: "#747B8B",
    };
  }

  if (isError) {
    return {
      trackFill: "Colors/background/200",
      trackStroke: "Colors/foreground/500",
      rangeFill: "Colors/emotional/danger/600",
      thumbFill: "Colors/background/0",
      thumbStroke: "Colors/emotional/danger/600",
      label: "Colors/emotional/danger/600",
      trackFillFallback: "#C7CAD1",
      trackStrokeFallback: "#747B8B",
      rangeFillFallback: "#D41C42",
      thumbFillFallback: "#FFFFFF",
      thumbStrokeFallback: "#D41C42",
      labelFallback: "#D41C42",
    };
  }

  return {
    trackFill: "Colors/background/200",
    trackStroke: "Colors/foreground/500",
    rangeFill: "Colors/theme/600",
    thumbFill: "Colors/background/0",
    thumbStroke: "Colors/theme/600",
    label: "Colors/foreground/0",
    trackFillFallback: "#C7CAD1",
    trackStrokeFallback: "#747B8B",
    rangeFillFallback: "#1051E8",
    thumbFillFallback: "#FFFFFF",
    thumbStrokeFallback: "#1051E8",
    labelFallback: "#000000",
  };
}

function progressConfig(_value) {
  return {
    trackFill: "Colors/background/200",
    trackStroke: "Colors/foreground/500",
    rangeFill: "Colors/theme/600",
    trackFillFallback: "#C7CAD1",
    trackStrokeFallback: "#747B8B",
    rangeFillFallback: "#1051E8",
  };
}

function spinnerMetrics(size) {
  if (size === "Small") {
    return {
      size: 16,
      sizeToken: "Spinner/size/small",
    };
  }

  if (size === "Large") {
    return {
      size: 32,
      sizeToken: "Spinner/size/large",
    };
  }

  if (size === "XLarge") {
    return {
      size: 48,
      sizeToken: "Spinner/size/xlarge",
    };
  }

  return {
    size: 24,
    sizeToken: "Spinner/size/medium",
  };
}

function avatarConfig(content) {
  if (content === "Image") {
    return {
      background: "Colors/theme/600",
      foreground: "Colors/foreground/1000",
      backgroundFallback: "#1051E8",
      foregroundFallback: "#FFFFFF",
    };
  }

  return {
    background: "Colors/background/200",
    foreground: "Colors/foreground/0",
    backgroundFallback: "#C7CAD1",
    foregroundFallback: "#000000",
  };
}

function alertConfig(variant) {
  const toneConfigs = {
    Default: {
      icon: "info-circle",
      background: "Surface/0",
      stroke: "Colors/foreground/500",
      foreground: "Colors/foreground/0",
      backgroundFallback: "#FFFFFF",
      strokeFallback: "#747B8B",
      foregroundFallback: "#000000",
    },
    Destructive: {
      icon: "alert-circle",
      background: "Surface/0",
      stroke: "Colors/emotional/danger/600",
      foreground: "Colors/emotional/danger/600",
      backgroundFallback: "#FFFFFF",
      strokeFallback: "#D41C42",
      foregroundFallback: "#D41C42",
    },
    Success: {
      icon: "check",
      background: "Surface/0",
      stroke: "Colors/emotional/success/900",
      foreground: "Colors/emotional/success/900",
      backgroundFallback: "#FFFFFF",
      strokeFallback: "#14653D",
      foregroundFallback: "#14653D",
    },
    Warning: {
      icon: "alert-triangle",
      background: "Surface/0",
      stroke: "Colors/emotional/alert/900",
      foreground: "Colors/emotional/alert/900",
      backgroundFallback: "#FFFFFF",
      strokeFallback: "#744D03",
      foregroundFallback: "#744D03",
    },
    Info: {
      icon: "info-circle",
      background: "Surface/0",
      stroke: "Colors/theme/600",
      foreground: "Colors/theme/600",
      backgroundFallback: "#FFFFFF",
      strokeFallback: "#1051E8",
      foregroundFallback: "#1051E8",
    },
  };

  return toneConfigs[variant] || toneConfigs.Default;
}

function alertTitleForVariant(variant) {
  if (variant === "Destructive") return "Error";
  if (variant === "Success") return "Success";
  if (variant === "Warning") return "Warning";
  if (variant === "Info") return "Info";
  return "Heads up";
}

function alertDescriptionForVariant(variant) {
  if (variant === "Destructive") return "Something needs your attention.";
  if (variant === "Success") return "The operation completed successfully.";
  if (variant === "Warning") return "Review this before continuing.";
  if (variant === "Info") return "Helpful context is available here.";
  return "This status message needs attention.";
}

function clearComponentSetContainerFill(componentSet) {
  componentSet.fills = [];
  componentSet.clipsContent = false;
}

function createSpinnerGlyph(
  variableName,
  fallback,
  variableByName,
  stats,
  size,
  sizeToken,
) {
  const glyph = figma.createEllipse();
  glyph.name = "Loading Indicator";
  const spinnerSize = size || 14;
  glyph.resize(spinnerSize, spinnerSize);
  if (sizeToken) {
    bindSizeVariables(glyph, sizeToken, sizeToken, variableByName, stats);
  }
  glyph.fills = [];
  glyph.strokes = [
    paintFromVariable(variableName, fallback, variableByName, stats),
  ];
  glyph.strokeWeight = 2;
  glyph.dashPattern = [8, 4];
  return glyph;
}

function paintFromVariable(name, fallback, variableByName, stats) {
  const color = parseColor(fallback);
  const paint = {
    type: "SOLID",
    color: { r: color.r, g: color.g, b: color.b },
    opacity: color.a,
  };
  const variable = variableByName.get(name);

  if (!variable) {
    stats.warnings.push(`Missing variable "${name}", used ${fallback}.`);
    return paint;
  }

  if (figma.variables.setBoundVariableForPaint) {
    try {
      return figma.variables.setBoundVariableForPaint(paint, "color", variable);
    } catch (error) {
      stats.warnings.push(`Could not bind "${name}" (${messageFor(error)}).`);
    }
  }

  return paint;
}

function paintFromVariableWithOpacity(
  name,
  fallback,
  opacity,
  variableByName,
  stats,
) {
  const paint = paintFromVariable(name, fallback, variableByName, stats);
  const tinted = clonePaint(paint);
  tinted.opacity = opacity;
  return tinted;
}

function nodeIdForUrl(id) {
  return id.replace(/:/g, "-");
}
