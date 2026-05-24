# NG SIEM Intel — Design review

Actionable list for Claude Code. Reviewed against the Sophos Central XCT design system.

Tasks are grouped by priority. Each task names the **file**, the **current state**, and the **target state** with concrete values.

---

## P0 — Token swap (≈1 afternoon, closes ~80% of the visual gap)

### 1. Replace the entire `:root` palette in `src/index.css`

The current CSS variables use generic Tailwind slate. Sophos Central uses a specific token set. **Sophos Blue is wrong: `#0066CC` should be `#0049bd`.**

Replace the contents of `src/index.css` (the `:root` and `.dark` blocks) with:

```css
:root {
  /* Surfaces */
  --color-bg-primary: #f0f2f4;          /* page bg (was #F8FAFC) */
  --color-bg-secondary: #f5f5f5;        /* table row header */
  --color-bg-card: #ffffff;
  --color-bg-sidebar: #2c2d2e;          /* dark, not light — Central side nav */
  --color-bg-hover: #e5e7ea;            /* secondary hover */

  /* Text */
  --color-text-primary: #212121;
  --color-text-secondary: #505050;
  --color-text-muted: #737373;          /* tertiary, not Tailwind slate-400 */

  /* Borders */
  --color-border: #eaeaea;              /* container border */
  --color-rule: #c9c9c9;                /* heavier rule line */

  /* Interactive — THE Sophos blue */
  --color-sophos-blue: #0049bd;         /* was #0066CC — wrong */
  --color-sophos-blue-light: #003996;   /* hover, not a lighter tint */
  --color-sophos-blue-pressed: #002562;
  --color-sophos-blue-selected: #f3f8ff;
  --color-sophos-tag-bg: #e5effa;
  --color-sophos-tag-fg: #005bc8;

  /* Feedback */
  --color-negative: #da0711;
  --color-caution: #ab8a17;
  --color-positive: #36a151;
  --color-info: #5a068e;
  --color-bg-negative: #f8cdcf;
  --color-bg-caution: #f4efc1;
  --color-bg-positive: #d7ecdc;
  --color-bg-info: #decde8;

  /* Severity ramp (fixed, do not reorder) */
  --severity-critical: #da0711;
  --severity-high: #e86800;
  --severity-medium: #ab8a17;
  --severity-low: #538184;
  --severity-info: #9976a6;

  /* Datavis (charts) — 6-color hue-separated set */
  --datavis-blue-70: #0c70d4;
  --datavis-violet-80: #5a068e;
  --datavis-magenta-60: #bc108e;
  --datavis-apricot-70: #cc5c00;
  --datavis-pine-50: #007769;
  --datavis-blue-50: #3996f3;

  /* Top nav (the navy bar — used in light AND dark themes) */
  --color-nav-bg: #001a47;
  --color-nav-text: #bdbdbd;
  --color-nav-text-selected: #65adf6;
}

.dark {
  --color-bg-primary: #121212;          /* was #0F172A */
  --color-bg-secondary: #2a2a2a;
  --color-bg-card: #1e1e1e;
  --color-bg-sidebar: #2c2d2e;
  --color-bg-hover: #424344;
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #e0e0e0;
  --color-text-muted: #9e9e9e;
  --color-border: #434343;
  --color-rule: #747474;
  --color-sophos-blue: #81cefd;
  --color-sophos-blue-light: #b5e1fe;
  --color-sophos-blue-selected: #14293d;
  /* feedback, severity, datavis, nav inherit from :root */
}
```

### 2. Switch the font stack to Inter

In `src/index.css`, change the `body` font-family and add a Google Fonts import at the top:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  /* … */
}
```

> Long-term, host the Inter variable font locally (see `sophos-central-xct/assets/fonts/Inter-Variable.ttf`).

### 3. Add Sophos type-role utility classes to `src/index.css`

Append these classes — components below will use them instead of ad-hoc `text-xs` / `text-sm`:

```css
.type-page-title    { font: 900 24px/1.33 'Inter', sans-serif; letter-spacing: 0.7px; }
.type-section-title { font: 700 20px/1.2  'Inter', sans-serif; letter-spacing: 0.6px; }
.type-container-title { font: 700 14px/1.43 'Inter', sans-serif; letter-spacing: 0.4px; }
.type-base          { font: 400 14px/1.29 'Inter', sans-serif; }
.type-base-semibold { font: 600 14px/1.29 'Inter', sans-serif; }
.type-base-small    { font: 600 12px/1.33 'Inter', sans-serif; letter-spacing: 0.3px; }
.type-button        { font: 600 14px/1    'Inter', sans-serif; letter-spacing: 0.35px; }
.type-tbl-head      { font: 700 12px/1.17 'Inter', sans-serif; letter-spacing: 0.3px; }
.type-tab-label     { font: 700 14px/1    'Inter', sans-serif; letter-spacing: 0.5px; text-transform: uppercase; }
.type-badge-small   { font: 700 10px/1.4  'Inter', sans-serif; letter-spacing: 0.7px; text-transform: uppercase; }
```

### 4. Drop card radii from 12px to 4px (rectilinear)

Sophos surfaces are rectilinear. Cards = 4px. Buttons = 8px. Pills (radius-full) = OK for small badges only.

Search/replace across `src/components/**`:

| Find | Replace | Where |
|---|---|---|
| `rounded-xl` | `rounded` *(4px)* | All cards: `MainContent.tsx`, `ChartToggle.tsx`, `MatrixCell.tsx` popover, `TopNav.tsx` export dropdown |
| `rounded-lg` on **inputs** | `rounded-md` *(6px, fine)* or `rounded` *(4px)* | `Sidebar.tsx` search input, `MatrixCell.tsx` score/rationale inputs |
| `rounded-full` on **score chips** | `rounded` *(4px)* | `ScoreBadge.tsx` |

Keep `rounded-lg` (8px) on **buttons** and **nav items** — that matches `--radius-md`.

### 5. Fix the page title sizing in `src/components/layout/TopNav.tsx`

```tsx
// Before
<h1 className="text-sm font-semibold text-text-primary truncate">
  NG SIEM Vendor Intelligence
</h1>
<p className="text-xs text-text-muted hidden sm:block">Competitive Analysis Platform</p>

// After
<h1 className="type-page-title text-text-primary truncate">
  NG SIEM Vendor Intelligence
</h1>
<p className="type-base-small text-text-muted hidden sm:block uppercase">
  Competitive analysis · NG SIEM
</p>
```

Also bump the header height from `h-14` (56px) to `h-12` (48px) to match the Central top-nav height of 48px — and change its background to navy:

```tsx
<header className="h-12 flex items-center px-4 gap-3 sticky top-0 z-40 no-print"
  style={{ background: 'var(--color-nav-bg)', color: '#fff' }}>
```

Replace the logo image with `/sophos-logo-white.svg` (white wordmark on navy):

```tsx
<img src="/sophos-logo-white.svg" alt="Sophos" className="h-5" />
```

### 6. Floor every `text-[10px]` at 12px

Search for `text-[10px]` across `src/components/**` and change to `text-xs` (12px). 10px is illegible at sit-distance and is the minimum sin Sophos style review catches.

Affected: `ComparisonMatrix.tsx` (vendor pill, product name caption), `MatrixCell.tsx` (Sparkles size adjacent text), badge size in vendor headers.

---

## P1 — Component alignment (≈2–3 days)

### 7. Recolor score chips to use feedback-bg tokens, not raw red/amber/green

`src/utils/colorUtils.ts` currently interpolates between `#3B82F6` / `#22C55E` / `#F59E0B` / `#EF4444` (Tailwind primaries). Replace with Sophos feedback tokens — and use a **background + dark-text** pattern, not a saturated fill. This keeps scores readable next to the rest of Central.

Replace `interpolateColor` and `scoreToHeatmapBg`:

```ts
export function scoreToBg(score: number | null): { bg: string; fg: string } {
  if (score === null) return { bg: 'var(--color-bg-hover)', fg: 'var(--color-text-secondary)' };
  if (score >= 8.5)  return { bg: 'var(--color-bg-positive)', fg: '#1f5a2b' };
  if (score >= 7)    return { bg: 'var(--color-bg-positive)', fg: '#1f5a2b' }; // optional opacity 0.85
  if (score >= 5)    return { bg: 'var(--color-bg-caution)',  fg: '#5c4a07' };
  return                     { bg: 'var(--color-bg-negative)', fg: '#6c0511' };
}
```

Then update `ScoreBadge.tsx` to apply `bg`/`fg` via inline style, and `HeatmapGrid.tsx` to use the same function.

### 8. Adopt the Sophos Tag pattern for "Us" and "Custom" pills

In `src/components/layout/Sidebar.tsx` and `src/components/comparison/ComparisonMatrix.tsx`, the "Us" pill is `bg-sophos-blue text-white` and "Custom" is `bg-purple-100 text-purple-700`. Replace with the canonical Sophos tag:

```tsx
// "Us" pill
<span
  className="type-badge-small px-2 py-0.5 rounded"
  style={{ background: 'var(--color-sophos-tag-bg)', color: 'var(--color-sophos-tag-fg)' }}
>
  US
</span>

// "Custom" tag
<span
  className="type-badge-small px-2 py-0.5 rounded"
  style={{ background: 'var(--color-bg-info)', color: 'var(--color-info)' }}
>
  CUSTOM
</span>
```

Note: badges are 4px radius, not 9999px pill, in Central.

### 9. Replace the weight-warning banner with the sectional-banner pattern

`src/components/layout/MainContent.tsx`, the amber warning bar. Change:

```tsx
// Before
<div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs no-print">
  <AlertTriangle size={14} />
  Category weights sum to {…}% …
</div>

// After
<div
  className="flex items-center gap-3 px-4 py-3 no-print"
  style={{ background: 'var(--color-bg-caution)', color: '#5c4a07' }}
>
  <AlertTriangle size={16} />
  <span className="type-base">
    <b>Category weights sum to {Math.round(totalWeight * 100)}%.</b> Open Manage categories to normalize before publishing the comparison.
  </span>
</div>
```

Lose the border — Sophos sectional banners are flat fills.

### 10. Recolor vendor series with `--datavis-*` tokens

The current vendor `logoColor` values (in `src/data/vendors.ts`) cluster around blue/cyan — Sophos, Sentinel, and Chronicle all read as the same hue on the radar overlay. Replace with the 6-color Sophos datavis palette which is hue-separated by ~60°:

| Vendor | Current | Target token | Hex |
|---|---|---|---|
| Sophos | `#0066CC` (or similar) | `--datavis-blue-70` | `#0c70d4` |
| Splunk | `#6F2DA8` | `--datavis-violet-80` | `#5a068e` |
| Microsoft Sentinel | `#00BCF2` | `--datavis-magenta-60` | `#bc108e` |
| Google Chronicle | `#4285F4` | `--datavis-apricot-70` | `#cc5c00` |
| Elastic | `#00BFB3` | `--datavis-pine-50` | `#007769` |
| Exabeam | `#FF6B35` | `--datavis-blue-50` | `#3996f3` |
| QRadar | — | reuse `--datavis-violet-80` darker variant | `#3d0560` |
| Securonix | — | reuse `--datavis-apricot-70` lighter | `#ff8526` |

Sophos blue stays the most saturated of the set, on purpose — it's our product.

### 11. Tighten the Button component to match `.type-button`

`src/components/ui/Button.tsx` — bump font weight from `font-medium` (500) to 600, add letter-spacing, and use the proper hover token:

```tsx
'inline-flex items-center justify-center rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1',
// font: now from type-button
'font-semibold tracking-[0.025em]',
{
  // Primary
  'bg-[var(--color-sophos-blue)] text-white hover:bg-[var(--color-sophos-blue-light)]':
    variant === 'primary',
  // Secondary — stroked, not filled
  'bg-transparent text-text-primary border border-border-color hover:bg-[var(--color-bg-hover)]':
    variant === 'secondary',
  // Ghost
  'text-text-secondary hover:text-text-primary hover:bg-[var(--color-bg-hover)]':
    variant === 'ghost',
  // Danger
  'bg-[var(--color-negative)] text-white hover:bg-[#8e0217]':
    variant === 'danger',
  // Sizes
  'h-7 px-2.5 text-xs gap-1.5':  size === 'sm',
  'h-9 px-3.5 text-sm gap-2':    size === 'md',
  'h-11 px-5 text-base gap-2.5': size === 'lg',
}
```

Note: dropped the box-shadow on primary (Sophos buttons are flat) and gave each size a fixed height for alignment in toolbars.

### 12. Swap `lucide-react` icons for Material Symbols Outlined

This is the biggest single visual lift after the shell. Two options:

**A. Web-font drop-in (fastest):**
- Add `<link href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" rel="stylesheet">` in `index.html`
- Create `src/components/ui/MIcon.tsx`:

```tsx
export function MIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ''}`}
      style={{ fontSize: size, lineHeight: 1, fontVariationSettings: "'wght' 400, 'GRAD' 0, 'opsz' 20" }}
      aria-hidden="true"
    >{name}</span>
  );
}
```

- Then replace Lucide imports one-for-one:

| Lucide | Material Symbols name |
|---|---|
| `Download` | `download` |
| `ChevronDown` | `expand_more` |
| `Plus` | `add` |
| `Search` | `search` |
| `Settings2` | `tune` |
| `ArrowUpDown` | `swap_vert` |
| `Sparkles` | `auto_awesome` (use the Sophos AI icon for AI rationale instead — see #14) |
| `Info` | `info` |
| `AlertTriangle` | `warning` |
| `Table2` | `grid_on` |
| `Activity` | `radar` |
| `Grid3x3` | `grid_view` |
| `BarChart2` | `bar_chart` |

**B. Keep Lucide for now** but standardize on `size={16}` everywhere except in the matrix where 14 is fine. The current mix of 10/11/12/13/14 px sizes is the bigger problem than the icon family.

### 13. Three-zone shell

Today: white top nav + light-blue sidebar that holds vendors.
Target: navy top nav + dark side nav for **product navigation** + page area that holds vendor pickers.

Steps in `src/components/layout/AppShell.tsx` / `Sidebar.tsx`:

1. Top nav → navy. Already covered in #5.
2. Side nav → dark `#2c2d2e`. Two-tone change in `Sidebar.tsx`:

```tsx
<aside
  className="w-64 flex-shrink-0 flex flex-col h-full no-print"
  style={{ background: 'var(--color-bg-sidebar)', color: '#e0e0e0' }}
>
```

3. Section labels in side nav should be UPPERCASE 10px, use `.type-badge-small` class with `color: #9e9e9e`.

4. Selected-item treatment: not a blue tint, but `background: #404142` with a 3px left border `#65adf6`.

5. Vendor pickers: see #15 — move them out of the side nav.

### 14. Use the Sophos AI icon for AI-generated rationales

`src/components/comparison/MatrixCell.tsx` uses a purple `Sparkles` icon when `scoreEntry?.dataSource === 'ai-generated'`. There's an official Sophos AI icon at:

```
public/sophos-ai-icon-2026.svg
```

(Available in the design system; copy from `sophos-central-xct/assets/sophos-ai-icon-2026.svg`.)

It's a fixed-gradient SVG — **don't recolor it**. Render at 12–14px next to the score:

```tsx
{scoreEntry?.dataSource === 'ai-generated' && (
  <img src="/sophos-ai-icon-2026.svg" alt="AI-generated" title="AI-generated rationale" width="12" height="12" />
)}
```

This is a free brand pop on the most distinctive feature of the app.

---

## P2 — Information architecture, polish, copy

### 15. Move vendor selection out of the side nav

Currently the left rail holds the vendor multi-select. In Central, the side nav is reserved for **module navigation** (DASHBOARD / DETECT / INVESTIGATE / CONFIGURE). The vendor list is doing a different job — it's a *column picker for the matrix*.

Suggested move: render the vendor picker as a **compact chip bar** at the top of the matrix card, with a "+ Add vendor" button at the end of the row. Frees the rail to host real cross-page nav: "Vendor comparison", "Threat coverage", "Battlecards", "Categories & weights", "Vendor library".

This is a conversation, not a directive — call out the trade-off and let the product owner decide.

### 16. Replace `rounded-2xl` / `rounded-xl` everywhere with `rounded` (4px)

```
grep -r "rounded-xl\|rounded-2xl" src/
```

Each hit on a card or panel surface — change to `rounded`. Keep `rounded-lg` (8px) only on buttons, inputs, and nav items.

### 17. Density check: standardize gaps to the 8-step rem scale

The scale is `2 / 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 56` px. Most current values are close — but search for off-scale values:

```
grep -r "gap-2\.5\|gap-1\.5\|py-2\.5\|px-2\.5\|p-3\.5\|gap-0\.5" src/
```

Snap each to the nearest 4 or 8: `gap-2.5` → `gap-2` (8px) or `gap-3` (12px). Not a behavior change, but the visual rhythm tightens noticeably.

### 18. Copy polish

| Where | Today | Suggestion |
|---|---|---|
| `TopNav.tsx` subtitle | "Competitive Analysis Platform" | "NG SIEM vendor analysis" (sentence case, less corporate) |
| `Sidebar.tsx` header | "Vendors (3/7)" | "Vendors · 3 of 7 selected" (denominator on counts is the Central convention) |
| `ComparisonMatrix.tsx` vendor pill | "OUR PRODUCT" | "US" (10px badge — already shorter is better) |
| `MatrixCell.tsx` add-score placeholder | (icon only) | Add tooltip text: "Score this category" |
| `MainContent.tsx` weight banner | "…overall scores may be inaccurate. Open Manage Categories to normalize." | "…before publishing the comparison." (more direct, fewer words) |
| Empty state `ComparisonMatrix.tsx` | "Select vendors from the sidebar to start comparing." | If you do #15, update to "Add vendors from the picker above." |

### 19. Score badge — use `.type-datavis-display` for the overall score

The overall row currently renders the same `<ScoreBadge size="lg">` (44px circle with 16px text) as every other row's badge. Central treats the headline metric differently — it's the big number on the slide:

```tsx
<div className="flex flex-col items-center gap-1">
  <span style={{ font: '400 36px/1.22 Inter', color: 'var(--color-text-primary)' }}>
    {vendor.overallScore.toFixed(1)}
  </span>
  <span className="type-base-small uppercase" style={{ color: 'var(--color-text-muted)' }}>
    Weighted
  </span>
</div>
```

Big number, small label underneath. This is the canonical Sophos datavis pattern (`--type-datavis-display` + `--type-datavis-label`).

### 20. Print stylesheet — set the page bg to white explicitly

Already partially done in `src/index.css`. Add:

```css
@media print {
  body { background: white !important; color: #212121 !important; }
  .no-print { display: none !important; }
  /* Drop the navy top bar in print */
  header[class*="bg-"] { background: white !important; color: #212121 !important; border-bottom: 1px solid #c9c9c9 !important; }
}
```

---

## Quick-reference: token glossary

| Concept | Current value | Target token / value |
|---|---|---|
| Sophos Blue | `#0066CC` | **`#0049bd`** (`--light-interactive-active`) |
| Page bg | `#F8FAFC` | `#f0f2f4` |
| Card bg | `#FFFFFF` | `#ffffff` ✓ |
| Card border | `#E2E8F0` | `#eaeaea` |
| Text primary | `#0F172A` | `#212121` |
| Side nav bg | `#F1F5F9` (light) | `#2c2d2e` (dark — Central is light-first but the rail is dark) |
| Top nav bg | white | `#001a47` (navy, brand-unique) |
| Card radius | 12px (`rounded-xl`) | 4px (`rounded`) |
| Button radius | 8px (`rounded-lg`) | 8px ✓ |
| Font | system stack | Inter 400/500/600/700/900 |
| Icons | lucide-react | Material Symbols Outlined |

---

## Files you'll touch

```
src/index.css                                       # P0 — palette, fonts, type roles
src/components/layout/TopNav.tsx                    # P0 — navy bar, page title sizing, logo
src/components/layout/Sidebar.tsx                   # P1 — dark rail, type-badge-small headers
src/components/layout/MainContent.tsx               # P1 — sectional banner
src/components/ui/Button.tsx                        # P1 — type-button, flat primary
src/components/ui/Badge.tsx                         # P1 — radius 4, Sophos tag colors
src/components/comparison/ComparisonMatrix.tsx      # P0/P1 — "US" tag, type roles, vendor header
src/components/comparison/MatrixCell.tsx            # P1 — AI icon swap, popover radius
src/components/comparison/ScoreBadge.tsx            # P1 — feedback-bg tokens, radius 4
src/components/charts/HeatmapGrid.tsx               # P1 — same color util
src/components/filters/FilterBar.tsx                # P1 — chip styling
src/utils/colorUtils.ts                             # P1 — replace interpolateColor entirely
src/data/vendors.ts                                 # P1 — recolor logoColor field
src/components/ui/MIcon.tsx                         # P1 — new file, MS Outlined wrapper
public/sophos-ai-icon-2026.svg                      # P1 — new asset for AI rationale
```

Reference design system: `sophos-central-xct/{tokens.css, components.css, Foundations.html, Components.html, Active Attack.html}` — open `Foundations.html` and `Components.html` for live examples of every pattern referenced above.
