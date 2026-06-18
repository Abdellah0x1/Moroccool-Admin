---
name: Systematic Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'        
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  sidebar-width: 280px
  container-max: 1440px
  gutter: 1.5rem
---

## Brand & Style

The design system is engineered for high-utility administrative environments where data density and clarity are paramount. The brand personality is professional, objective, and efficient, aimed at power users who manage complex workflows.

The visual style is **Minimalist / Corporate Modern**, prioritizing a "content-first" approach. By removing decorative elements, the system focuses the user's attention on metrics and actionable insights. The aesthetic evokes a sense of reliability and architectural order through rigorous alignment, ample whitespace used functionally rather than decoratively, and a restrained color palette.

## Colors

The color strategy uses a **Deep Indigo** primary for interactive elements and brand presence. The interface relies heavily on a neutral foundation of cool grays to define structure without adding visual noise.

- **Surface & Backgrounds**: Use `#F8FAFC` for page backgrounds and pure `#FFFFFF` for cards and elevated containers to create a subtle but clear distinction between the canvas and the content.
- **Borders**: A consistent `#E2E8F0` is used for all structural lines, ensuring a crisp grid without high contrast that might distract from text.
- **Functional Accents**: Success, Warning, and Error colors are used strictly for status communication and data visualization, ensuring they maintain high semantic value.

## Typography

This design system utilizes **Inter** for all UI levels to leverage its exceptional legibility in data-dense environments. 

The type hierarchy is strictly defined to help users scan large amounts of information. **Labels** use a slightly heavier weight and increased letter spacing to remain readable at small sizes (11px-12px) in table headers and metadata tags. **Headlines** utilize a tighter letter spacing and semi-bold weights to ground the page sections. Body text is kept at a comfortable 14px or 16px to maintain high information density without sacrificing comfort.

## Layout & Spacing

The system employs a **Sidebar-driven fixed grid** model. The sidebar remains at a constant width (280px) while the main content area utilizes a fluid layout with a maximum constraint of 1440px to prevent excessive line lengths in data tables.

- **Grid**: A 12-column system is used within the main content area.
- **Rhythm**: All spacing follows a 4px baseline shift (increments of 4, 8, 16, 24, 32).
- **Density**: In data-heavy views (like tables), vertical padding is reduced to `sm` (8px) to increase the number of visible rows, while dashboard cards use `lg` (24px) padding to provide more breathing room for high-level metrics.
- **Breakpoints**: On mobile, the sidebar collapses into a hamburger menu or bottom navigation, and margins shrink from 24px to 16px.

## Elevation & Depth

This design system avoids heavy shadows in favor of **Tonal Layers** and **Low-contrast Outlines**. 

Depth is achieved by placing white containers (`#FFFFFF`) on a light gray canvas (`#F8FAFC`). Subtle `1px` borders in `#E2E8F0` provide the necessary separation between elements. Shadows, when used (e.g., for dropdowns or modals), must be extremely diffused: `0px 4px 6px -1px rgba(0, 0, 0, 0.1)`. This approach maintains a "flat" engineering-led feel while providing just enough visual cues for interactivity and layering.

## Shapes

The shape language is **Soft** (4px default). This provides a precise, modern feel that is less aggressive than sharp corners but more professional than fully rounded "pill" shapes. 

Standard components like input fields, buttons, and cards use the `rounded` (4px) token. Larger structural containers, such as dashboard widgets, use `rounded-lg` (8px) to soften the overall interface slightly without compromising the utilitarian aesthetic. Icons should follow a similar 2px or 4px corner radius to ensure harmony with the UI components.

## Components

- **Buttons**: Primary buttons use the Indigo fill with white text. Secondary buttons use a white background with a subtle gray border (`#E2E8F0`). Buttons have a consistent height (36px for standard, 44px for large).
- **Data Tables**: The core of the system. Use sticky headers, zebra striping with `#F8FAFC`, and 12px `label-md` for headers. Rows should have a hover state using a very light blue or gray tint.
- **Input Fields**: Borders are `#E2E8F0`, turning Primary Indigo on focus with a 2px outer glow. Labels sit above the field in `label-md`.
- **Chips/Badges**: Small, low-contrast pills for status. For example, a "Success" badge uses a light green background with dark green text, rather than a heavy solid fill.
- **Cards**: The primary container for dashboard content. They feature a 1px border, no shadow, and 24px internal padding. 
- **Navigation**: Sidebar items use a "ghost" style, where the active state is indicated by a primary color vertical bar on the left and a subtle background tint.