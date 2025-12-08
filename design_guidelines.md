# Deeper - Christian Dating Conversation Card App Design Guidelines

## Design Approach
**Mobile-First Progressive Web Application** - Clean, warm, modern aesthetic with spiritual depth and emotional warmth appropriate for Christian couples building their relationship.

## Layout & Structure

### Screen Dimensions
- Mobile-first: max-width 480px centered on larger screens
- Card stack: 5/8 of screen height, centered vertically
- Bottom navigation: Fixed position, always visible
- All screens maintain consistent max-width container

### Core Screens Layout

**Main Card Screen:**
- Category label at top of card with category-specific styling
- Question text centered, large readable font occupying majority of card space
- Card background uses gradient of category primary/secondary colors
- Visual tilt responds to drag direction (touch and mouse support)

**Category Filter:**
- 3x3 grid of category cards
- Each card displays: category name, icon (emoji), background color
- "Show All" and "Clear All" buttons at top
- Active/inactive toggle states clearly visible

**Conversation Journal:**
- Tab navigation at top: "Saved for Later" | "Discussed"
- Progress bar spanning full width above tabs
- List view with category color indicators on left edge
- Saved items show orange/yellow accent, discussed items greyed with checkmarks

**Onboarding (First Visit):**
- Welcome screen: App purpose and welcome message
- 3-step tutorial screens showing swipe mechanics with visual demonstrations
- "Start Conversations" CTA button at bottom of final screen

## Typography
- Font Family: Inter or similar clean sans-serif
- Card Questions: Large, readable size (24-28px), medium weight, generous line-height (1.5)
- Category Labels: Small caps or uppercase, 12-14px, semi-bold
- Navigation: 10-12px labels below icons
- Body/List Text: 16px regular weight

## Component Design

### Card Stack
- Border-radius: 16px on all cards
- Soft drop shadow: 0 8px 24px rgba(0,0,0,0.12)
- Layered stack effect showing 2-3 cards behind active card
- Top card fully interactive, behind cards slightly offset and scaled down

### Navigation Bar (Bottom Fixed)
- Three icons: Home | Filter | Journal
- Icons with labels below
- Journal icon shows red circular badge with count number
- Active state: icon filled/colored, inactive: outline/grey
- Height: 64px with internal padding

### Swipe Interactions
- **RIGHT Swipe (Discussed):**
  - Green glow border appears during drag
  - Checkmark icon fades in
  - Card flies off screen to right with spring physics
  - Rotation: 15-20 degrees
  
- **LEFT Swipe (Saved):**
  - Orange/yellow glow border during drag
  - Clock icon fades in
  - Card flies off screen to left with spring physics
  - Rotation: -15 to -20 degrees

### Category Colors (9 Categories)
Each category has primary + secondary hex colors for gradients:

1. **Faith & Spirituality** — Deep purple (#6B46C1 → #8B5CF6)
2. **Family & Upbringing** — Warm orange (#EA580C → #FB923C)
3. **Marriage Expectations** — Rose/pink (#E11D48 → #FB7185)
4. **Communication** — Sky blue (#0284C7 → #38BDF8)
5. **Finances** — Green (#059669 → #34D399)
6. **Intimacy** — Soft red (#DC2626 → #F87171)
7. **Life Goals** — Teal (#0D9488 → #2DD4BF)
8. **Conflict Resolution** — Amber (#D97706 → #FBBF24)
9. **Fun & Lifestyle** — Yellow (#CA8A04 → #FDE047)

### Premium Teaser Card
- Same card dimensions as question cards
- Centered text: "Want to go deeper?"
- Subtext: "Unlock all 264 questions with Premium"
- Gradient background using brand colors
- No swipe functionality - tap only

### Progress Indicators
- Progress bar: Thin (4px), rounded ends, category color fill
- Badge counts: Red circular (#EF4444), white text, subtle pulse animation on increment
- Completion counts: "45/90 questions discussed" format

## Animations & Interactions
- **Card swipe:** Spring physics (not linear), natural bounce feel
- **Badge pulse:** Subtle scale animation (1.0 → 1.15 → 1.0) over 0.6s when count increases
- **Screen transitions:** 300ms ease-in-out fade with slight slide (20px)
- **Category toggle:** Immediate visual feedback, 150ms color transition
- **No continuous/looping animations** - all animations triggered by user action

## Admin CMS Visual Treatment
- Clean table layout with alternating row colors
- Same color palette but professional/utilitarian styling
- Category color previews shown as small circular swatches
- Drag handles for reordering (≡ icon)
- Modal overlays for add/edit with backdrop blur
- Form inputs: rounded (8px), clear focus states, validation messaging

## Spacing System
Use consistent Tailwind spacing units:
- Micro spacing: 2, 4 (p-2, m-4)
- Standard spacing: 4, 6, 8 (py-6, px-4, gap-8)
- Large spacing: 12, 16, 20 (mb-12, pt-16, space-y-20)
- Card padding: p-8 on mobile, p-10 on larger screens

## Accessibility
- Touch targets minimum 44x44px
- High contrast text on category backgrounds
- Focus visible states on all interactive elements
- ARIA labels for icon-only buttons
- Keyboard navigation support for admin CMS

## Images
No hero images or photography needed - this is a card-based interaction app focused on typography and color. Category icons are emoji-based, not image files.