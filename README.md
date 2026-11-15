# Design System

A production-ready, token-driven design system monorepo. **Figma is the source
of truth.** Tokens Studio writes one JSON file per set into
`packages/tokens/tokens/`, the build compiles CSS variables and a Tailwind v4
theme, and the React components consume only semantic tokens.

The design system includes Light and Dark modes, RTL support, accessible Radix
UI primitives, Storybook documentation, a consumer playground, and automated
tests.

## The single source of truth

The token source of truth is the structured set files in:

```text
packages/tokens/tokens/
├── primitives/
│   ├── color-light.json
│   ├── color-dark.json
│   ├── typography-en.json
│   ├── typography-ar.json
│   ├── space.json
│   ├── radius.json
│   ├── border-width.json
│   ├── shadow.json
│   ├── opacity.json
│   ├── sizing.json
│   └── breakpoints.json
├── semantic/
│   ├── color-light.json
│   ├── color-dark.json
│   ├── border-light.json
│   ├── border-dark.json
│   ├── typography-light.json
│   └── typography-dark.json
├── component/
│   ├── button.json
│   ├── input.json
│   ├── label.json
│   ├── checkbox.json
│   ├── badge.json
│   ├── card.json
│   ├── dialog.json
│   ├── select.json
│   └── tabs.json
├── $metadata.json
├── $themes.json
└── README.md
```

These files are written by Tokens Studio folder sync (Pro) or imported
manually. The build reads this folder first; `studio.tokens.json` and
`tokens/studio/` are legacy formats that are still supported but are no longer
the production source.

## Flow at a glance

```text
Figma (primitives/* and semantic/* sets)
  │
  │  Tokens Studio → Push (folder storage)
  ▼
packages/tokens/tokens/{primitives,semantic}/*.json
  │
  │  pnpm tokens  (packages/tokens/build.mjs)
  │  1. read the structured set files
  │  2. merge primitives + the matching light/dark semantics
  │  3. normalize into the component contract
  ▼
packages/tokens/dist/
  ├── variables.css    --ds-* variables for :root and [data-theme="dark"]
  ├── tailwind.css     @theme inline mapping for Tailwind v4
  ├── tokens.json      flattened resolved tokens
  ├── tokens.mjs       ESM
  ├── tokens.cjs       CommonJS
  └── tokens.d.ts      types
  │
  ▼
@repo/ui/styles.css    precompiled component CSS (tailwindcss CLI)
  │
  ├── @repo/docs       Storybook 8 documentation
  └── @repo/playground Vite consumer demo
  │
  ▼
Changesets → npm
```

## What we built, step by step

1. **Monorepo baseline** — Turborepo + pnpm, renamed packages to `@repo/*`,
   fixed peer dependencies, `sideEffects` for CSS, Changesets, CI, and package
   scripts.
2. **Token pipeline** — `@repo/tokens` with Style Dictionary v5 and
   `@tokens-studio/sd-transforms`. Three-tier token architecture
   (primitive → semantic → component). Every token, including fonts, tracking,
   and shadows, comes from the structured source files.
3. **Structured token source** — one JSON file per set under
   `tokens/primitives` and `tokens/semantic`, with `$metadata.json` and
   `$themes.json`. This is the single source of truth.
4. **Plus UI compatibility** — the build still understands the Plus UI set
   structure (the migration source) and normalizes it when a legacy
   `studio.tokens.json` is present.
5. **Tailwind CSS v4** — CSS-first theme generated from tokens; precompiled
   component CSS; no preflight in the library.
6. **Core components** — Button, Input, Label, Checkbox, Badge, Card.
7. **Radix components** — Dialog, Select, Tabs.
8. **Documentation** — Storybook with autodocs, a11y addon, theme/RTL toolbar,
   and foundations pages (colors, typography, radius, spacing, shadows).
9. **Validation** — Vitest + Testing Library + jest-axe; playground app;
   27 behavior and accessibility tests.
10. **Delivery** — CI, tokens workflow, release workflow, Changesets, and this
    README. A Figma AI prompt is available in `FIGMA_AI_PROMPT.md`.

## Repository structure

```text
.
├── apps/
│   ├── docs/                       # @repo/docs — Storybook 8
│   │   ├── .storybook/
│   │   └── stories/{components,foundations}/
│   └── playground/                 # @repo/playground — Vite consumer
├── packages/
│   ├── tokens/                     # @repo/tokens — token pipeline
│   │   ├── tokens/
│   │   │   ├── primitives/         # one file per primitive set
│   │   │   ├── semantic/           # one file per semantic set
│   │   │   ├── $metadata.json
│   │   │   └── $themes.json
│   │   └── build.mjs               # normalize + Style Dictionary build
│   ├── ui/                         # @repo/ui — React components
│   │   ├── src/components/
│   │   ├── src/lib/cn.ts
│   │   ├── src/styles.css
│   │   └── src/test/
│   ├── eslint-config/
│   └── typescript-config/
├── .changeset/
├── .github/workflows/{ci,tokens,release}.yml
├── FIGMA_AI_PROMPT.md
├── turbo.json
└── package.json
```

## Requirements

- Node.js >= 22.12.0
- pnpm 8.15.6 (`corepack enable`)

## Quick start

```bash
pnpm install
pnpm build
pnpm dev
```

`pnpm dev` runs Storybook at `http://localhost:6006` and the playground at
`http://localhost:5173`.

### Commands

| Command          | Description                                     |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | Run Storybook, playground, and package watchers |
| `pnpm build`     | Build tokens, components, docs, and playground  |
| `pnpm lint`      | Lint all packages                               |
| `pnpm typecheck` | Typecheck all packages                          |
| `pnpm test`      | Run Vitest + Testing Library + jest-axe         |
| `pnpm tokens`    | Build tokens only                               |
| `pnpm changeset` | Create a changeset                              |
| `pnpm release`   | Build and publish via Changesets                |
| `pnpm format`    | Format with Prettier                            |

## Token source in detail

### Direction of sync

```text
Figma + Tokens Studio  →  Push  →  GitHub  →  pnpm tokens  →  code
```

- Tokens are authored in **Figma**.
- Tokens Studio folder sync **Push** writes one JSON file per set into
  `packages/tokens/tokens/{primitives,semantic,component}`.
- The build consumes those files.
- **Pull** does the opposite (GitHub → Figma) and is used only to load the
  source files into a Figma file.
- Nothing in this repository pushes tokens to Figma in the normal flow.

### Set files and token counts

| File                             | Tokens | Purpose                          |
| -------------------------------- | -----: | -------------------------------- |
| `primitives/color-light.json`    |    302 | Primitive + brand color scales   |
| `primitives/color-dark.json`     |    302 | Dark primitive scales            |
| `primitives/typography-en.json`  |     32 | Latin font, sizes, weights, etc. |
| `primitives/typography-ar.json`  |      1 | Arabic font family               |
| `primitives/space.json`          |     35 | Spacing scale                    |
| `primitives/radius.json`         |      9 | Border radius                    |
| `primitives/border-width.json`   |      5 | Border widths                    |
| `primitives/shadow.json`         |      7 | Shadows                          |
| `primitives/opacity.json`        |     15 | Opacity scale                    |
| `primitives/sizing.json`         |     35 | Sizing scale                     |
| `primitives/breakpoints.json`    |      5 | Responsive breakpoints           |
| `semantic/color-light.json`      |     99 | Light semantic colors            |
| `semantic/color-dark.json`       |     99 | Dark semantic colors             |
| `semantic/border-light.json`     |      8 | Light border aliases             |
| `semantic/border-dark.json`      |      8 | Dark border aliases              |
| `semantic/typography-light.json` |      1 | Light typography alias           |
| `semantic/typography-dark.json`  |      1 | Dark typography alias            |
| `component/button.json`          |     23 | Button colors + radius           |
| `component/input.json`           |      7 | Input colors + radius            |
| `component/label.json`           |      2 | Label colors                     |
| `component/checkbox.json`        |      6 | Checkbox colors + radius         |
| `component/badge.json`           |     19 | Badge variants + radius          |
| `component/card.json`            |      5 | Card colors + radius             |
| `component/dialog.json`          |      8 | Dialog colors + radius           |
| `component/select.json`          |     11 | Select colors + radius           |
| `component/tabs.json`            |      7 | Tabs colors + radius             |

`$metadata.json` defines `tokenSetOrder`; `$themes.json` is the Tokens Studio
theme list (currently empty).

### Component tokens

Component tokens are the third tier. They describe the decisions that are
specific to one component and are the contract between the design system and the
component implementation.

Rules we follow:

1. **Reference semantic tokens, not primitives.** Every component color points
   to a `semantic.color.*` token, so Light/Dark and future brand themes work
   automatically. Dimensions may reference core tokens such as `radius.*` until
   a semantic dimension layer exists.
2. **Tokenize only what varies.** For each component we define the colors,
   borders, radius, and variant-specific decisions. We do not tokenize every
   padding or layout utility; those stay in the component class names.
3. **One file per component.** `component/<component>.json` keeps ownership clear.
4. **Use a predictable path.** `component.<component>.<variant>.<property>` for
   variants, and `component.<component>.<property>` for shared properties.
5. **Consume tokens in components.** Component tokens are mapped to Tailwind
   names such as `bg-button-primary-background`, `text-input-foreground`, and
   `rounded-card`, and the components use those classes instead of the semantic
   utilities.
6. **Preview both themes.** Every component token must be checked in Storybook
   in Light and Dark, and in RTL.

Example:

```json
{
  "component": {
    "button": {
      "radius": { "value": "{radius.md}", "type": "borderRadius" },
      "primary": {
        "background": {
          "value": "{semantic.color.accent.solid}",
          "type": "color"
        },
        "foreground": {
          "value": "{semantic.color.accent.contrast}",
          "type": "color"
        }
      }
    }
  }
}
```

The build exposes these as CSS variables and Tailwind theme entries:

```css
--ds-component-button-primary-background
--color-button-primary-background
--radius-button
```

### How the build processes the source

`packages/tokens/build.mjs` runs these steps:

1. **Read the source**
   - Structured folder (primary): `tokens/primitives` + `tokens/semantic`.
   - Legacy single file: `tokens/studio.tokens.json`.
   - Legacy folder: `tokens/studio/`.
   - If nothing is available, the build fails with a clear error. The structured
     source files are required.

2. **Split primitives and semantics**
   - Structured folder:
     - Light = `primitives/color-light` + shared primitives + `semantic/*-light`
     - Dark = `primitives/color-dark` + shared primitives + `semantic/*-dark`
     - Shared primitives = `typography-en`, `typography-ar`, `space`, `radius`,
       `border-width`, `shadow`, `opacity`, `sizing`, `breakpoints`, plus every
       `component/*` set.
   - Legacy Plus UI:
     - A set whose name contains `dark` → dark theme.
     - A set whose name contains `light` → light theme.
     - Every other set → shared.
     - The dark build includes the shared sets and the dark theme so aliases
       such as `{primary.700}`, `{radius.rounded}`, and
       `{font-family.default}` resolve.

3. **Normalize the names**
   - Color families are copied as primitives.
   - Brand groups are copied as `primary`, `neutral`, `info`, `success`,
     `warning`, `danger`, `base`.
   - Theme sets are copied as `color.*`, and `semantic.color.*` is generated
     from them.
   - Typography groups are mapped to `typography.fontFamily`,
     `typography.fontWeight`, `typography.fontSize`,
     `typography.lineHeight`, and `typography.letterSpacing`.
   - `radius` is copied and aliased to the Tailwind names (`rounded` → `sm`,
     `rounded-md` → `md`, ...).
   - `space-*`, `opacity-*`, `size-*`, and breakpoint tokens are mapped to
     `space.*`, `opacity.*`, `size.*`, and `breakpoint.*`.
   - `Box Shadow` is mapped to `shadow.*`.
   - Numeric font sizes and line heights are converted to `px`.
   - Composite box shadows are converted to valid CSS strings.

4. **Map Plus UI semantics to the component contract**

   The component library expects these semantic names:

   | Component contract    | Plus UI source                                      |
   | --------------------- | --------------------------------------------------- |
   | `surface.canvas`      | `color.background.default.default`                  |
   | `surface.subtle`      | `color.background.default.hovered`                  |
   | `surface.raised`      | `color.background.surface`                          |
   | `surface.hover`       | `color.background.default.hovered`                  |
   | `surface.active`      | `color.background.default.pressed`                  |
   | `surface.overlay`     | generated per theme (`rgba(0,0,0,0.4/0.6)`)         |
   | `content.primary`     | `color.text.default`                                |
   | `content.secondary`   | `color.text.caption`                                |
   | `content.disabled`    | `color.text.disabled`                               |
   | `content.inverse`     | `color.text.invert.default`                         |
   | `stroke.subtle`       | `color.border.disabled`                             |
   | `stroke.default`      | `color.border.default`                              |
   | `stroke.strong`       | `color.border.default`                              |
   | `accent.solid`        | `color.background.primary.default`                  |
   | `accent.solid-hover`  | `color.background.primary.hovered`                  |
   | `accent.text`         | `color.text.primary`                                |
   | `accent.emphasis`     | `color.background.primary.pressed`                  |
   | `accent.subtle`       | `color.background.primary.invert.default`           |
   | `accent.subtle-hover` | `color.background.primary.invert.hovered`           |
   | `accent.contrast`     | `color.text.base`                                   |
   | `danger.*`            | `color.background.danger.*` / `color.text.danger`   |
   | `success.*`           | `color.background.success.*` / `color.text.success` |
   | `warning.*`           | `color.background.warning.*` / `color.text.warning` |
   | `info.*`              | `color.background.info.*` / `color.text.info`       |
   | `focus`               | `color.border.ring`                                 |

5. **Build CSS and JS**

   Style Dictionary produces the files described below.

### Generated outputs

```text
packages/tokens/dist/
├── variables.css   # :root + [data-theme="dark"] + .dark
├── tailwind.css    # @theme inline mapping
├── tokens.json     # flattened resolved tokens (light)
├── tokens.mjs      # ESM
├── tokens.cjs      # CommonJS
└── tokens.d.ts     # types
```

CSS variable contract:

- Primitives: `--ds-blue-700`, `--ds-space-4`, `--ds-radius-md`.
- Semantic: `--ds-semantic-color-surface-canvas`,
  `--ds-semantic-color-accent-solid`.
- The build also emits `--ds-color-*`, `--ds-border-*`, `--ds-typography-*`,
  `--ds-opacity-*`, `--ds-size-*`, and `--ds-breakpoint-*`.

### Current build result

```text
Built @repo/tokens (light: tokens-folder, dark: tokens-folder)
→ 49 semantic colors, 18 radii, 37 typography tokens, 8 shadows
```

Resolved values from the current source:

| Token             | Light     | Dark      |
| ----------------- | --------- | --------- |
| `accent.solid`    | `#4338ca` | `#a5b4fc` |
| `surface.canvas`  | `#f3f4f6` | `#111827` |
| `surface.raised`  | `#ffffff` | `#000000` |
| `content.primary` | `#030712` | `#ffffff` |
| `danger.solid`    | `#b91c1c` | `#fca5a5` |
| `warning.solid`   | `#a16207` | `#fde047` |
| `focus`           | `#93c5fd` | `#1d4ed8` |

## Figma + Tokens Studio setup

The source files are already in `packages/tokens/tokens/`. To connect Figma:

1. In Figma, create the sets `primitives/*` and `semantic/*` (or load the
   existing source files with a Pull, see below).
2. In GitHub, create a **Personal Access Token**:
   - Classic token with the `repo` scope, or
   - Fine-grained token with **Contents: Read and write**.
3. In Figma, open **Tokens Studio → Settings → Sync providers → Add new →
   GitHub** and fill the form:
   - **Name**: `design-system-tokens`
   - **Personal access token**: the token from step 2
   - **Repository (owner/repo)**: `your-user/my-desgin-system`
   - **Branch**: `main` (or a feature branch)
   - **Token storage location (file/folder path)**:
     - **Folder (recommended)**: `packages/tokens/tokens`
     - **Single file (legacy)**: `packages/tokens/tokens/studio.tokens.json`
   - **Base URL**: leave empty for github.com
4. Save, then use **Pull** to load the existing source files into Figma.
   Tokens Studio creates one set per file.
5. After the initial load, use **Push** for Figma → GitHub changes.

> **Direction of sync:** In the normal workflow, Tokens Studio **Push** writes
> the Figma tokens to GitHub, and the build consumes them. **Pull** is used
> only to load the existing source files into Figma.

> **Free plan:** Folder sync is a Pro feature. On the free plan, the source
> files can still be used by the build, but Figma cannot write them as separate
> files. You would need to create the sets manually and import each JSON file,
> or use the legacy single-file mode.

## Tailwind v4 integration

`@repo/ui/src/styles.css` imports the token theme and compiles only the
utilities used by the components:

```css
@import "tailwindcss/theme.css" layer(theme);
@import "@repo/tokens/tailwind.css";
@import "tailwindcss/utilities.css" layer(utilities);

@source "./**/*.{ts,tsx}";
```

The generated theme maps tokens to Tailwind namespaces:

- `bg-surface-canvas`, `bg-surface-raised`, `bg-surface-overlay`
- `text-content-primary`, `text-content-secondary`, `text-content-disabled`
- `border-stroke-default`, `border-stroke-strong`
- `bg-accent`, `hover:bg-accent-hover`, `text-accent-contrast`
- `bg-danger`, `bg-success`, `bg-warning`, `bg-info`
- `ring-focus`
- `rounded-sm` … `rounded-3xl`, `rounded-full`
- `shadow-xs` … `shadow-2xl`
- `text-xs` … `text-9xl`
- `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- `leading-*`, `tracking-*`

Tailwind-native consumers can import the theme directly:

```css
@import "tailwindcss";
@import "@repo/tokens/tailwind.css";

@source "../node_modules/@repo/ui/dist";
```

## Theme switching and RTL

Light variables live on `:root`; dark overrides live on
`[data-theme="dark"]` and `.dark`.

```ts
document.documentElement.dataset.theme = "dark";
```

RTL uses logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `text-start`,
`end-*`):

```ts
document.documentElement.dir = "rtl";
```

## Consuming `@repo/ui`

### Precompiled CSS (recommended)

```tsx
import { Button, Card, Input } from "@repo/ui";
import "@repo/ui/styles.css";

export function Example() {
  return (
    <Card>
      <Input placeholder="Email" />
      <Button>Save</Button>
    </Card>
  );
}
```

The compiled `@repo/ui/styles.css` includes the token variables and all
utilities used by the components. It does **not** include Tailwind preflight, so
the consumer controls the reset. The consumer does not need Tailwind installed.

## Components

| Component    | API                                                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Button**   | `variant` (primary/secondary/outline/ghost/destructive/link), `size`, `asChild`, `isLoading`, `disabled`                      |
| **Input**    | `invalid`, native input props                                                                                                 |
| **Label**    | `required`, Radix Label                                                                                                       |
| **Checkbox** | Radix Checkbox, supports `checked="indeterminate"`                                                                            |
| **Badge**    | `variant` (neutral/primary/success/warning/danger/outline), `size`                                                            |
| **Card**     | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`                                             |
| **Dialog**   | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose` |
| **Select**   | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`                     |
| **Tabs**     | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`                                                                              |

## Adding a component

1. Create `packages/ui/src/components/<name>/`:
   - `<name>.tsx`
   - `index.ts`
   - `<name>.test.tsx`
2. Use `React.forwardRef`, `cn`, and `cva` for variants.
3. Use semantic tokens only (`bg-accent`, `text-content-primary`, ...).
4. Use logical properties for RTL (`ps-*`, `pe-*`, `ms-*`, `me-*`).
5. Add the entry to `packages/ui/tsup.config.ts`.
6. Add the export to `packages/ui/package.json` and `packages/ui/src/index.ts`.
7. Add a story under `apps/docs/stories/components/`.
8. Add behavior tests and an axe assertion.

## Styling rules

1. Never use raw hex values in components.
2. Never build Tailwind class names dynamically (`bg-${color}`) because Tailwind
   only sees static strings; use `cva` maps.
3. Use semantic tokens only; primitives are for semantic aliases.
4. Use logical properties so RTL works without overrides.
5. Do not add global CSS resets to the component package.
6. Keep `sideEffects` including `**/*.css`.

## Documentation and playground

- `apps/docs` — Storybook 8 with autodocs, a11y addon, theme/RTL toolbar, and
  foundations stories.
- `apps/playground` — Vite app that consumes the precompiled
  `@repo/ui/styles.css` without a Tailwind config, demonstrating Light/Dark and
  RTL.

## Testing

```bash
pnpm test
```

Each component has behavior tests and an accessibility test using `jest-axe`.
The suite currently contains **27 tests** across 9 component test files.
Storybook also uses `@storybook/addon-a11y` with
`parameters.a11y.test = "error"`.

## CI/CD

| Workflow      | Trigger                                           | What it does                                  |
| ------------- | ------------------------------------------------- | --------------------------------------------- |
| `ci.yml`      | push to `main`, pull requests                     | install → build → lint → typecheck → test     |
| `tokens.yml`  | changes under `packages/tokens/tokens/**`, manual | build tokens, verify outputs, upload artifact |
| `release.yml` | push to `main`                                    | Changesets release/publish via pnpm           |

### Releasing

```bash
pnpm changeset
pnpm version-packages
pnpm release
```

Add `NPM_TOKEN` and `GITHUB_TOKEN` to the repository secrets. The initial
changeset bumps `@repo/tokens` and `@repo/ui` to their first minor version.

## Current status and notes

- The active source is the structured folder: `light: tokens-folder,
dark: tokens-folder`.
- The source contains 26 set files (11 primitives, 6 semantic, 9 component)
  plus `$metadata.json` and `$themes.json`.
- The build output is 49 semantic colors, 18 radii, 37 typography tokens,
  8 shadows, and component tokens for 9 components.
- There is **no fallback layer**. Every token, including `shadow-xs`,
  `font-sans`, `font-mono`, `tracking-tight`, and `tracking-wide`, comes from the
  structured source files.
- The primary accent is **indigo** (`#4338ca` light / `#a5b4fc` dark).
- `primitives/color-dark` currently mirrors `color-light` because the primitive
  palette is mode-independent. Replace it with a real dark palette when needed;
  the build will use it automatically.
- The legacy `studio.tokens.json` and Plus UI structure are still supported by
  the build for backward compatibility, but they are not the production source.

### Possible next steps

1. Add a real dark primitive palette in `primitives/color-dark.json`.
2. Expand `primitives/typography-ar.json` with Arabic-specific sizes and line
   heights.
3. Filter `variables.css` to emit only semantic and used tokens.
4. Add component-level tokens for multi-brand support.
5. Add more components (Dropdown, Tooltip, Switch, Toast).
6. Add visual regression testing (Chromatic or Playwright screenshots).
7. Connect the Figma MCP server for design-to-code workflows.
8. Use `FIGMA_AI_PROMPT.md` to generate or extend the Figma design system.

## Attribution and licenses

- **Radix UI** (MIT) — accessible component primitives.
- **Plus UI** community token structure — the migration source for the current
  token values. Verify the Figma file's license before redistributing its
  assets.
- This project does **not** use shadcn/ui tokens, naming, or configuration.
