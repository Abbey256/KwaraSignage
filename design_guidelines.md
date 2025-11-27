# Kwara Billboard Analytics Portal - Design Guidelines

## Design Approach

**Hybrid Strategy:** Combine civic platform credibility (gov.uk, Singapore.gov) with location-based discovery UX (Airbnb maps, Zillow) for public portal, and Material Design principles for admin dashboard.

**Core Principle:** Professional government service meeting modern digital expectations - trustworthy, transparent, and data-driven.

## Typography

**Font Family:** Inter (primary), with fallback to system fonts
- **Hero/Headlines:** Font weight 700, tracking tight (-0.02em)
- **Section Titles:** Font weight 600, size text-2xl to text-4xl
- **Body Text:** Font weight 400, size text-base, line-height relaxed (1.625)
- **Data/Numbers:** Font weight 600, tabular figures for analytics
- **UI Labels:** Font weight 500, size text-sm, uppercase with letter-spacing

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- **Component padding:** p-4 (mobile), p-6 to p-8 (desktop)
- **Section spacing:** py-12 to py-20 (vertical rhythm)
- **Grid gaps:** gap-4 to gap-8
- **Container max-width:** max-w-7xl with mx-auto

## Public Portal Layout

**Hero Section (80vh):**
- Full-width slideshow of Kwara State landmarks with subtle Ken Burns effect
- Centered overlay with white text on semi-transparent dark backdrop (bg-black/40)
- Headline emphasizing billboard advertising opportunities
- Subtext explaining the analytics advantage
- Primary CTA button with backdrop blur

**Billboard Map Section:**
- Full-width LeafletJS map (600px height minimum)
- Custom markers using Kwara green for available, gray for occupied
- Sidebar filter panel (desktop: 320px width, mobile: bottom sheet)
- Map controls positioned top-right

**Billboard Cards Grid:**
- 3-column grid (lg:), 2-column (md:), 1-column (mobile)
- Card structure: Image (16:9 aspect), title, location badge, stats row (4 metrics), status pill, CTA button
- Hover elevation: shadow-md to shadow-xl transition

**Contact/Request Form:**
- 2-column layout (desktop): Form on left (60%), context/info on right (40%)
- Form fields: Full-width inputs with clear labels above, spacing of mb-6
- Submit button full-width on mobile, auto-width on desktop

## Admin Dashboard Layout

**Navigation:**
- Fixed sidebar (260px width) with Kwara State logo at top (64px height container)
- Navigation items with icons (left-aligned) using Heroicons
- Active state: green background with subtle rounded corners
- Collapsed sidebar option (mobile): hamburger menu

**Dashboard Grid:**
- Stats cards: 4-column grid (lg:), 2-column (md:), 1-column (mobile)
- Each card: Icon (left, 48px circle), metric (right-aligned number), label below
- Charts section: 2-column layout for comparison charts, full-width for timeline charts

**Data Tables:**
- Sticky header row with sort indicators
- Alternating row backgrounds (subtle stripe pattern)
- Action column (right): Icon buttons for edit/delete
- Pagination controls bottom-right

**Video Upload Interface:**
- Drag-and-drop zone (dashed border, py-12)
- Processing status with progress bar
- Results card displaying count with visualization

## Component Library

**Buttons:**
- Primary: Solid Kwara green, white text, px-6 py-3, rounded-lg, shadow-sm
- Secondary: Outline style, green border, green text
- Ghost: Text only, no border, green text
- Icon buttons: 40px square, rounded-md, centered icon

**Form Inputs:**
- Label above input (mb-2, font-medium)
- Input: border-2, rounded-lg, px-4 py-3, focus ring in Kwara green
- Error state: red border with error message below

**Cards:**
- Rounded-xl, shadow-sm, p-6
- Header with title and optional action button
- Content area with consistent internal spacing

**Badges/Pills:**
- Available: Green background, white text, px-3 py-1, rounded-full, text-xs font-semibold
- Occupied: Gray background
- Status indicators: 8px circle with label

**Charts (Chart.js):**
- Line charts: Smooth curves, Kwara green primary color, grid lines subtle
- Bar charts: Rounded tops, spacing between bars
- Consistent tooltips with white background, shadow-lg

**Map Markers:**
- Custom SVG markers with billboard icon inside
- Popup cards: Image thumbnail, title, quick stats, "View Details" link

## Images

**Hero Slideshow (3-5 images):**
- Kwara State Government House
- Ilorin cityscape/skyline
- Modern infrastructure (roads, bridges)
- Cultural landmarks
- Each 1920x1080, optimized WebP format

**Billboard Images:**
- Actual billboard photos (16:9 aspect ratio)
- Location context showing surrounding area
- Clear, well-lit photography

**Placeholder:**
- Gray rectangle with billboard icon for listings without images

## Animations

**Minimal, Purposeful Only:**
- Hero slideshow: 5-second crossfade transitions
- Card hover: Subtle lift (transform translateY -2px)
- Button interactions: Built-in states only
- Loading states: Simple spinner, no complex animations
- Chart reveals: Fade-in on scroll (once)

## Accessibility

- Minimum touch target: 44px
- Form labels programmatically associated with inputs
- Map keyboard navigation enabled
- Color contrast ratios meeting WCAG AA
- Focus indicators visible (green ring, 2px offset)