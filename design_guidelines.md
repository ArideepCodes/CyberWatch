# AI-Powered Cyber Threat Hunting Dashboard - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern cybersecurity dashboards (Splunk, Datadog, Grafana) combined with futuristic command-center aesthetics. This is a data-heavy, utility-focused application with strong visual identity requirements.

## Core Design Elements

### A. Typography
**Primary Font**: Inter (Google Fonts) - clean, technical readability
**Accent Font**: JetBrains Mono - for IP addresses, codes, technical data

**Hierarchy**:
- Page titles: text-3xl font-bold tracking-tight
- Section headers: text-xl font-semibold
- Card titles: text-lg font-medium
- Body text: text-sm font-normal
- Technical data: text-sm font-mono
- Metadata/timestamps: text-xs text-muted-foreground

### B. Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12
- Component padding: p-4, p-6
- Section gaps: gap-6, gap-8
- Page margins: px-6, py-8
- Card spacing: space-y-4

**Grid System**:
- Dashboard: 3-column grid (lg:grid-cols-3) for metric cards
- Threats list: Single column with dense data tables
- Analytics: 2-column grid (lg:grid-cols-2) for charts
- Sidebar: Fixed 64px width (collapsed) / 256px (expanded)

### C. Visual Theme

**Dark Cybersecurity Aesthetic**:
- Background: Deep dark base (bg-slate-950, bg-slate-900)
- Surface elevation: bg-slate-900, bg-slate-800 for cards
- Border accents: border-cyan-500/30, border-purple-500/30

**Accent Colors**:
- Primary action: Neon cyan (#06b6d4) for CTAs, active states
- Secondary accent: Electric purple (#a855f7) for highlights, warnings
- Severity indicators:
  - Critical: Red (#ef4444)
  - High: Orange (#f97316)
  - Medium: Yellow (#eab308)
  - Low: Green (#22c55e)

**Glow Effects**:
- Cards: box-shadow with cyan/purple blur (shadow-cyan-500/20)
- Active elements: ring-2 ring-cyan-500/50
- Footer links: text-shadow with subtle glow
- Severity badges: matching colored glows

### D. Component Library

**Navigation**:
- Collapsible sidebar with icon-only collapsed state
- Active route: cyan accent border-left + bg-slate-800
- Icons: Heroicons (Shield, Chart, Map, Brain, Search)
- Logo area with cyber-themed mark

**Cards**:
- Dark backgrounds (bg-slate-900) with subtle borders
- Hover state: border-cyan-500/50 transition
- Header with icon + title + action button
- Consistent internal padding (p-6)

**Data Display**:
- Tables: Striped rows (bg-slate-800/50), hover highlight
- Badges: Rounded-full with severity colors + glow
- Metrics: Large numbers with label below
- Status indicators: Pulsing dot animations for "live" data

**Charts** (Recharts):
- Dark backgrounds matching theme
- Cyan/purple gradient fills
- Grid lines: subtle slate-700
- Tooltips: Dark with cyan accent
- Animated on load: smooth transitions

**Map** (Leaflet):
- Dark map tiles (Mapbox Dark or similar)
- Threat markers: Pulsing circles with severity colors
- Clustered markers for dense areas
- Custom popup styling matching theme

**Forms & Inputs**:
- Dark input backgrounds (bg-slate-800)
- Cyan focus rings
- Placeholder: text-slate-500
- Search bars with magnifying glass icon

**Modals/Dialogs**:
- Backdrop: bg-black/80 blur
- Content: bg-slate-900 with cyan border
- Close button: top-right with hover state

**Footer**:
- Fixed bottom, full-width
- bg-slate-950 with subtle top border (border-cyan-500/20)
- Centered text: text-xs text-slate-400
- Links: text-cyan-400 with hover:text-cyan-300
- Glow effect: text-shadow: 0 0 10px rgba(6, 182, 212, 0.3)
- Social icons with spacing-x-4
- "© 2025 Developed by Arideep Kanshabanik" followed by linked icons

### E. Interactions & Animations

**Micro-interactions**:
- Button hover: brightness-110 + scale-105
- Card hover: translate-y-[-2px] + enhanced shadow
- Badge pulse: animate-pulse for critical alerts
- Chart bars: Stagger animation on load (300ms delays)

**Loading States**:
- Skeleton loaders: bg-slate-800 with shimmer animation
- Spinner: Cyan rotating circle
- Progressive data loading for charts

**Transitions**:
- Sidebar collapse: transition-all duration-300
- Route changes: Fade in/out (opacity)
- Modal open: Scale from 95% to 100% + fade

### F. Responsive Behavior

**Breakpoints**:
- Mobile (< 768px): Sidebar collapses to hamburger menu, single column grids, horizontal scrollable tables
- Tablet (768-1024px): Sidebar icon-only by default, 2-column grids
- Desktop (> 1024px): Full sidebar, 3-column grids, split views

**Priority Content**:
- Mobile: Critical metrics → Live feed → Charts (scrollable)
- Touch targets: Minimum 44px height for interactive elements

### G. Page-Specific Layouts

**Dashboard Home**:
- Top: 3-metric summary cards (active threats, today's attacks, high severity)
- Middle: Live threat feed (scrollable list) + Attack origin map (side-by-side on desktop)
- Bottom: Attack timeline graph (full width)

**Threats Page**:
- Filter bar: Horizontal pills for severity, search input, sort dropdown
- Dense table with columns: Time, IP, Type, Severity badge, Country flag, Actions
- Click row → Modal with full threat details + AI explanation

**AI Insights**:
- 2x2 grid of insight cards
- Each card: Icon + Title + Generated content area
- "Generate" buttons with loading states

**IP Lookup**:
- Centered search input (large, prominent)
- Results card below: Risk score gauge + Geo info + AI summary

**Analytics**:
- 2-column chart grid
- Each chart in card with title
- Consistent chart heights (400px)

### H. Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation: Tab through sidebar, focus visible states
- Color contrast: All text meets WCAG AA against dark backgrounds
- Screen reader announcements for live threat updates

## Images
No hero images. This is a data-driven dashboard. All visual elements are functional: charts, maps, data tables, and iconography.