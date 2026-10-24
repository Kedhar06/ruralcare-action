---
name: Rural Care Action
colors:
  surface: '#f9f9ff'
  surface-dim: '#d1daf4'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8ff'
  surface-container-highest: '#d9e2fc'
  on-surface: '#121b2e'
  on-surface-variant: '#44464e'
  inverse-surface: '#273044'
  inverse-on-surface: '#edf0ff'
  outline: '#75777f'
  outline-variant: '#c5c6d0'
  surface-tint: '#4d5d89'
  primary: '#000e2e'
  on-primary: '#ffffff'
  primary-container: '#10234b'
  on-primary-container: '#7a8bb9'
  inverse-primary: '#b5c6f7'
  secondary: '#006874'
  on-secondary: '#ffffff'
  secondary-container: '#95f1ff'
  on-secondary-container: '#006f7b'
  tertiary: '#00130b'
  on-tertiary: '#ffffff'
  tertiary-container: '#002b1d'
  on-tertiary-container: '#3d9c78'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b5c6f7'
  on-primary-fixed: '#041941'
  on-primary-fixed-variant: '#35466f'
  secondary-fixed: '#95f1ff'
  secondary-fixed-dim: '#79d4e2'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f57'
  tertiary-fixed: '#97f5cc'
  tertiary-fixed-dim: '#7bd8b1'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#00513a'
  background: '#f9f9ff'
  on-background: '#121b2e'
  surface-variant: '#d9e2fc'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 42px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  body-xl:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  label-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

The design system is engineered for rural healthcare operational agility, local worker empowerment, and elder digital inclusion. It bridges institutional clinical authority with warm, hyper-legible, community-first accessibility. The system embodies four core pillars:

- **Uncompromising Legibility & High Affordance:** Explicit signifiers, generous tap regions (minimum 48px), high-contrast borders, and robust visual anchors that accommodate low digital literacy, visual impairments, and intermittent device quality.
- **Calm, Clinical Reassurance:** A tranquil, structured atmosphere that eliminates cognitive overload. Deep navy anchors the visual weight, while restorative clinical teal guides critical interactions without generating clinical dread.
- **Operational Fluidity:** Dense, data-rich operational workspaces for field health workers that gracefully shift into spacious, assisted interfaces for rural patients and village elders.
- **Bilingual & Cultural Empathy:** Structural allowances for multi-script parity (Latin and Telugu), prioritizing vertical headroom, predictable text wrapping, and explicit icon-label pairing.

The aesthetic blends **Modern Accessible Functionalism** with **Soft Clinical Tactility**—eschewing ethereal glass effects and microscopic minimalist conventions in favor of grounded, solid-state surfaces, deliberate focal rings, and reassuring spatial rhythm.

## Colors

The color architecture is built around strict WCAG AAA luminance requirements for text and interactive controls, utilizing dedicated tokens for patient-facing clarity and clinical field operations:

- **Primary Deep Navy (`#10234B`):** The structural bedrock. Used for top-level navigation headers, primary patient callouts, high-emphasis typography, and critical operational prompts. Delivers a contrast ratio of >12:1 against light canvas surfaces.
- **Teal Accent (`#087F8C`):** The active catalyst. Applied to interactive highlights, confirmed appointment state tags, high-priority interactive icons, focus indicators, and focal-action buttons.
- **Success & Recovery Greens:**
  - Solid Emerald (`#047857`): Status badges, resolved alerts, validated fields, vitals within normal parameters.
  - Soft Meadow (`#DDF4E7` / `#D1FAE5`): Tinted background fills for success banners, medication verification shields, and triage status indicators.
- **Surfaces & Canvases:**
  - Base Background (`#F6F8FA`): Cool neutral foundation minimizing glare under direct sunlight.
  - Card & Container Surface (`#FFFFFF`): Pure white interior card elevations, preserving high contrast against the `#F6F8FA` canvas.
- **Typography & Communication:**
  - Primary Content (`#172033`): Ultra-legible dark slate with a contrast ratio exceeding 12.5:1.
  - Secondary/Supporting (`#5F6B7A`): Metadata, timestamps, non-critical health worker IDs (strictly maintaining >4.5:1 on white).
- **Critical Diagnostics & Alerts:**
  - Warning Amber (`#B45309` on `#FEF3C7` container): Supply shortages, overdue field visits, borderline triage observations.
  - Critical Red (`#B91C1C` on `#FEE2E2` container): High-risk emergency vitals, missed chronic treatment doses, critical network synchronization failures.

## Typography

Typography prioritizes maximum optical distinction and cognitive comfort across generational boundaries:

- **Headlines (Plus Jakarta Sans):** Crafted with balanced, open apertures and robust terminal stems. Delivers authoritative clarity without feeling intimidating.
- **Body & Labels (Inter):** Configured with an accessible baseline of **18px (`body-lg`)** for general patient interfaces, appointment confirmations, and instructions. This combats low visual acuity and small screen sizes in mobile field kits. Field-worker operational tables may step down to `body-md` (16px) for data density, but never below.
- **Bilingual Typographic Accommodations:** When rendering Telugu scripts alongside English, line-height scales dynamically by +15% across all levels to prevent diacritic clipping (matras and vowel indicators).
- **Proportional Tabular Numerals:** Numerals within vital signs, dosage calculations, and biometric records automatically adopt monospaced/tabular figures (`tnum`) to ensure scanning alignment across tabular rows.

## Layout & Spacing

The layout is built upon a flexible 12-column system on desktop and tablet, converting to an intentional single-column vertical track on mobile devices:

- **Desktop & Field Workstation (1024px+):** 12-column grid, `2rem` margins, `1.5rem` gutters. Accommodates dual-pane views: community schedule and worker navigation on the left; rich clinical profiles, triage logs, and patient records on the right.
- **Tablet & Field Tablet (768px - 1023px):** 8-column grid, `1.5rem` margins, `1.25rem` gutters. Optimized for bedside and door-to-door community health assessments.
- **Mobile Handheld (320px - 767px):** 4-column responsive grid, `1rem` side margins, `1rem` gutters. Stacks all interactive cards vertically, anchoring action triggers to sticky thumb zones at the bottom of the viewport.
- **Touch Target Integrity:** No interactive touch target may measure less than 48px × 48px. Spacing between distinct actionable components must preserve a minimum buffer of `space-sm` (0.75rem / 12px) to prevent mis-taps by tremors or motor-impaired users.

## Elevation & Depth

Visual hierarchy employs **Structured Tonal Layers paired with Soft Ambient Support and Crisp Boundaries**:

- **Border Containment:** Because diffuse shadows fail under high ambient sunlight in rural outdoor settings, all raised surfaces combine subtle elevation with a crisp 1px structural border (`#E2E8F0` or `#CBD5E1`).
- **Elevation 0 (Canvas Base):** Flat `#F6F8FA`. Houses persistent structural elements, page backgrounds, and non-actionable layout regions.
- **Elevation 1 (Cards, Lists, Work Panels):** `#FFFFFF` background, `border: 1px solid #E2E8F0`, with an ambient drop-shadow: `0 2px 4px -1px rgba(16, 35, 75, 0.05), 0 1px 2px -1px rgba(16, 35, 75, 0.03)`.
- **Elevation 2 (Floating Action Targets & Dropdowns):** `#FFFFFF` surface, `border: 1px solid #CBD5E1`, with elevation shadow: `0 8px 16px -3px rgba(16, 35, 75, 0.08), 0 3px 6px -2px rgba(16, 35, 75, 0.04)`. Used for role selector menus, time-slot selection sheets, and active appointment cards.
- **Elevation 3 (Critical Modals & Emergency Triage Drawers):** `0 20px 25px -5px rgba(16, 35, 75, 0.12), 0 10px 10px -5px rgba(16, 35, 75, 0.04)`, layered over an accessible `#10234B` backdrop overlay at 60% opacity with a subtle 2px blur.

## Shapes

The system implements a balanced `roundedness: 2` (base 0.5rem / 8px radius) to convey approachable human care while maintaining structural precision:

- **Base Radius (`0.5rem` / 8px):** Form input fields, dropdown toggles, operational table cells, status tags, and action buttons.
- **Large Radius (`rounded-lg` / `1rem` / 16px):** Patient appointment summary cards, clinical service tiles, modular metric pods, and bottom sheets.
- **Pill Radius (`9999px`):** Status indicator tags, language toggle chips (English / Telugu), vital parameter quick-badges, and floating emergency assistance triggers.
- **Focus Rings:** All focused elements exhibit an unmistakable double-ring boundary: 2px pure white inner spacer surrounded by a 3px solid `#087F8C` outer ring, ensuring 100% keyboard and screen reader accessibility.

## Components

### 1. High-Accessibility Action Buttons
- **Primary:** Background `#10234B`, Text `#FFFFFF`, font weight 600, min-height 52px, horizontal padding `1.75rem`. Hover: `#1C3770`. Active focus ring: 3px outer `#087F8C`.
- **Secondary (Teal Accent):** Background `#087F8C`, Text `#FFFFFF`, min-height 52px. Hover: `#066772`.
- **Assisted / Tertiary:** White background, 2px border `#10234B`, text `#10234B`. Explicit active state fills with `#DDF4E7`.

### 2. Dual-Role Login & Portal Switcher
- Segmented toggle or contextual header dropdown allowing seamless role-swapping: **"Community Member / Patient"** vs. **"Field Health Worker / ASHA"**.
- Features an unmistakable persistent badge indicator indicating current operational role with explicit high-contrast iconography (User silhouette vs. Stethoscope badge).

### 3. Patient Appointment & Vital Monitoring Cards
- Container: Surface `#FFFFFF`, border `1px solid #E2E8F0`, radius `1rem`, padding `1.5rem`.
- Header: High-contrast title (`#172033`), appointment date/time badge highlighted with soft teal background (`#DDF4E7`) and deep teal text (`#087F8C`).
- Content Body: Clear horizontal key-value pairs with 18px body copy for visiting doctor, location/sub-center, and prescription status.
- Primary card action: Direct call or map assistance button with persistent icon and 48px minimum touch area.

### 4. Bilingual Language Selector Chips (English / Telugu)
- High-affordance pill toggles: Resting state `#FFFFFF` with `1.5px solid #CBD5E1`, text `#172033`. Active state: `#10234B` background, `#FFFFFF` text, subtle checkmark prefix icon.
- Font styling ensures identical visual baseline alignment between Latin and Telugu glyph sets.

### 5. Health Worker Data Tables
- Header row: `#F6F8FA` background, uppercase 13px bold tracking, `#5F6B7A` text, 1px bottom border `#CBD5E1`.
- Row height: Generous 56px minimum to support touch interaction on tablet field devices. Alternating rows utilize faint `#FBFBFC` striping.
- Status cells: Encapsulated within high-contrast pills (`#047857` on `#D1FAE5` for Normal; `#B45309` on `#FEF3C7` for Follow-up; `#B91C1C` on `#FEE2E2` for Urgent attention).

### 6. Accessible Input Fields & Selection Controls
- Input fields: Min-height 52px, 1.5px border `#CBD5E1`, background `#FFFFFF`, text `#172033` (18px). On focus: Border `#087F8C` with 3px halo tint.
- Checkboxes & Radios: 24px × 24px dimensions with a 2px high-contrast border. Check state fills `#10234B` with a bold white vector checkmark, preventing ambiguity for low-dexterity users.