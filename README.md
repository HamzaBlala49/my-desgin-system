# Design System

A production-ready, token-driven design system monorepo. **Figma is the source
of truth.** Tokens Studio pushes Figma tokens to GitHub, the build normalizes
them, compiles CSS variables and a Tailwind v4 theme, and the React components
consume only semantic tokens.

The design system includes Light and Dark modes, RTL support, accessible Radix
UI primitives, Storybook documentation, a consumer playground, and automated
tests.

## Flow at a glance

```text
Figma (Plus UI token sets)
  │
  │  Tokens Studio → Push
  ▼
GitHub: packages/tokens/tokens/studio.tokens.json
  │
  │  pnpm tokens  (packages/tokens/build.mjs)
  │  1. split sets into shared / light / dark
  │  2. normalize Plus UI names into the design-system contract
  │  3. merge the Figma export over a minimal fallback
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
   (primitive → semantic → component) and a minimal fallback for the few values
   Figma does not export.
3. **Figma integration** — Tokens Studio GitHub sync with support for both
   single-file (free) and multi-file (Pro) token storage.
4. **Plus UI normalization** — the build understands the Plus UI community set
   structure, so tokens do not need to be moved into `core`/`semantic` manually.
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
│   │   │   ├── studio.tokens.json  # Figma export — source of truth
│   │   │   └── fallbacks/          # only values Figma does not export
│   │   │       ├── typography.json # font-sans/mono + tracking
│   │   │       └── shadow.json     # shadow.xs
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

| Command            | Description                                     |
| ------------------ | ----------------------------------------------- |
| `pnpm dev`         | Run Storybook, playground, and package watchers |
| `pnpm build`       | Build tokens, components, docs, and playground  |
| `pnpm lint`        | Lint all packages                               |
| `pnpm typecheck`   | Typecheck all packages                          |
| `pnpm test`        | Run Vitest + Testing Library + jest-axe         |
| `pnpm tokens`      | Build tokens only                               |
| `pnpm figma:check` | Generate a sandbox Figma import bundle          |
| `pnpm changeset`   | Create a changeset                              |
| `pnpm release`     | Build and publish via Changesets                |
| `pnpm format`      | Format with Prettier                            |

## Token flow in detail

### Source of truth and direction

```text
Figma + Tokens Studio  →  Push  →  GitHub  →  pnpm tokens  →  code
```

- Tokens are authored in **Figma**.
- **Push** in Tokens Studio writes the Figma tokens to GitHub.
- The build consumes the pushed JSON.
- **Pull** does the opposite (GitHub → Figma) and is only used to bring pushed
  changes back into Figma.
- Nothing in this repository pushes tokens from code to Figma.

### Current Figma export: Plus UI

The current Figma file uses the **Plus UI** set structure. The synced file is
`packages/tokens/tokens/studio.tokens.json` (single-file storage).

| Figma set               | Tokens | Normalized to                                                        |
| ----------------------- | -----: | -------------------------------------------------------------------- |
| `global`                |    107 | `shadow.*` + typography fallbacks                                    |
| `Color/Mode 1`          |    244 | primitive color families (`blue.*`, `gray.*`, `indigo.*`, ...)       |
| `+Theme/Light`          |    108 | `semantic.color.*` + `border`/`typography` aliases                   |
| `+Theme/Dark`           |    108 | same paths as Light, dark values                                     |
| `+Brand/Mode 1`         |     69 | `primary`, `neutral`, `info`, `success`, `warning`, `danger`, `base` |
| `Typography/Mode 1`     |     31 | `typography.*`                                                       |
| `Border/Mode 1`         |     14 | `radius.*` + `width.*`                                               |
| `Spacing/Value`         |     35 | `space.*`                                                            |
| `Breakpoints/min-width` |      5 | `breakpoint.*`                                                       |
| `Opacity/Mode 1`        |     15 | `opacity.*`                                                          |
| `Sizing/Mode 1`         |     35 | `size.*`                                                             |

The build does **not** require these sets to be renamed or moved. It reads them
and normalizes them into the design-system contract.

> **What does `/Mode 1` mean?** It is the default **Figma Variables mode** name,
> not a theme. Figma variable collections have modes; Tokens Studio exports each
> collection + mode as a set named `<Collection>/<Mode>`. Plus UI uses a single
> mode for primitives, brand, typography, border, spacing, opacity, and sizing,
> so those sets end with `/Mode 1`. The actual themes are the separate
> `+Theme/Light` and `+Theme/Dark` sets. The build treats `Mode 1` sets as
> shared; only set names containing `Light` or `Dark` drive theme splitting. If
> you rename the mode in Figma, the build still works because it normalizes by
> the set contents, not by the `/Mode 1` suffix.

### How the build processes the export

`packages/tokens/build.mjs` runs these steps:

1. **Read the export**
   - Single file: `tokens/studio.tokens.json`.
   - Multi-file (Pro): `tokens/studio/`.
   - If the export is missing or empty, the build warns and uses only the
     minimal fallback. Colors will be missing until Figma pushes tokens.

2. **Split the sets**
   - A set whose name contains `dark` → dark theme.
   - A set whose name contains `light` → light theme.
   - Every other set → shared (primitives, brand scales, typography, radius,
     spacing, shadows).
   - The dark build includes the shared sets **and** the dark theme so that
     aliases such as `{primary.700}`, `{radius.rounded}`, and
     `{font-family.default}` resolve.
   - If the export uses the structured `primitives/*` + `semantic/*` layout,
     the build switches to:
     - light = `primitives/color-light` + shared primitives +
       `semantic/*-light`
     - dark = `primitives/color-dark` + shared primitives +
       `semantic/*-dark`
     - shared primitives = `typography-en`, `typography-ar`, `space`, `radius`,
       `border-width`, `shadow`, `opacity`, `sizing`, `breakpoints`.

3. **Normalize the names**
   - Color families are copied as primitives.
   - Brand groups are copied as `primary`, `neutral`, `info`, `success`,
     `warning`, `danger`, `base`.
   - Theme sets are copied as `color.*`, and `semantic.color.*` is generated
     from them.
   - Typography groups are mapped to `typography.fontFamily`,
     `typography.fontWeight`, `typography.fontSize`,
     `typography.lineHeight`, and `typography.letterSpacing`.
   - `Border/Mode 1.radius` is copied and aliased to the Tailwind names
     (`rounded` → `sm`, `rounded-md` → `md`, ...).
   - `Spacing/Value`, `Opacity/Mode 1`, `Sizing/Mode 1`, and
     `Breakpoints/min-width` are mapped to `space.*`, `opacity.*`, `size.*`, and
     `breakpoint.*`.
   - `global` `Box Shadow` is mapped to `shadow.*`.
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

5. **Merge with the minimal fallback**

   The Figma export is deep-merged over the minimal fallback, so any missing
   token keeps its fallback value. The fallback currently supplies only:

   - `shadow.xs`
   - `typography.fontFamily.sans` / `typography.fontFamily.mono`
   - `typography.letterSpacing.tight` / `typography.letterSpacing.wide`

   All colors, spacing, radius, font sizes, font weights, line heights, and the
   remaining shadows come from Figma.

6. **Build CSS and JS**

   Style Dictionary produces the files described below.

### Minimal fallback

The fallback lives in:

```text
packages/tokens/tokens/
└── fallbacks/
    ├── typography.json   # font-sans/mono + tracking
    └── shadow.json       # shadow.xs
```

It only fills values that the Figma export does not provide. The Figma export
always wins for any token path it defines. There are no fallback colors anymore;
the old Radix-based `core/semantic/themes` fallback files were removed.

The fallback is not the source of truth and is not pushed back to Figma.

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
  `--ds-opacity-*`, `--ds-size-*`, and `--ds-breakpoint-*` for every exported
  token.

### Current build result

```text
Built @repo/tokens (light: studio-file, dark: studio-file)
→ 49 semantic colors, 18 radii, 39 typography tokens, 8 shadows
```

Resolved values from the current Plus UI export:

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

1. Create a Figma file and use the **Plus UI** community token structure (or any
   structure listed above).
2. Install **Tokens Studio for Figma**.
3. In GitHub, create a **Personal Access Token**:
   - Classic token with the `repo` scope, or
   - Fine-grained token with **Contents: Read and write**.
4. In Figma, open **Tokens Studio → Settings → Sync providers → Add new →
   GitHub** and fill the form:
   - **Name**: `design-system-tokens`
   - **Personal access token**: the token from step 3
   - **Repository (owner/repo)**: `your-user/my-desgin-system`
   - **Branch**: `main` (or a feature branch)
   - **Token storage location (file/folder path)**:
     - **Free plan (single file)**:
       `packages/tokens/tokens/studio.tokens.json`
     - **Pro plan (multi-file)**:
       `packages/tokens/tokens/studio`
   - **Base URL**: leave empty for github.com
5. Define or edit tokens in Figma, then choose **Push** in the sync modal.
6. The `Tokens` GitHub Actions workflow validates the build and uploads the
   generated `dist` artifact.

> **Do not edit `studio.tokens.json` by hand.** It is written by Tokens Studio.
> The only hand-maintained token files are the minimal fallbacks under
> `tokens/fallbacks/`.

### One-time migration: write the structured sets to Figma

The target Figma structure is:

```text
primitives/
  color-light.json
  color-dark.json
  typography-en.json
  typography-ar.json
  space.json
  radius.json
  border-width.json
  shadow.json
  opacity.json
  sizing.json
  breakpoints.json
semantic/
  color-light.json
  color-dark.json
  border-light.json
  border-dark.json
  typography-light.json
  typography-dark.json
```

Generate the import bundle:

```bash
pnpm figma:check
```

This writes `packages/tokens/figma-check/figma-check.tokens.json` plus the same
structure as individual files. The `figma-check/` folder is gitignored.

Migration steps:

1. Import `figma-check.tokens.json` into a **new sandbox Figma file** first and
   verify the sets.
2. If correct, import it into the production Figma file **once** to replace the
   Plus UI sets.
3. Push from Tokens Studio to GitHub. The build detects `primitives/*` and
   `semantic/*` automatically:
   - Light: `primitives/color-light` + shared primitives + `semantic/*-light`
   - Dark: `primitives/color-dark` + shared primitives + `semantic/*-dark`
4. After this one-time migration, the flow is **Figma → GitHub → code**. Do not
   run `figma:check` again for production.

> `primitives/color-dark` currently contains the same primitive scales as light
> because Plus UI primitives are mode-independent. You can replace it with a
> real dark primitive palette later; the build will use it automatically.

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

- The Figma export is active: `light: studio-file, dark: studio-file`.
- The export contains 11 sets and is about 132 KB.
- The build emits all exported primitives, brand scales, spacing, sizing,
  opacity, and breakpoints, so `variables.css` is about 54 KB. This is expected;
  it can be filtered later if bundle size becomes a concern.
- The Plus UI organization is kept as is. There is no need to move tokens into
  `core`/`semantic`; the build adapter handles the mapping.
- There are **no fallback colors** anymore. The old Radix-based
  `core/semantic/themes` fallback files were removed. The minimal fallback
  supplies only `shadow.xs`, `font-sans`/`font-mono`, and
  `letterSpacing.tight`/`wide`.
- `dist/tokens.json` contains the Plus UI primitive paths such as `gray.50` and
  the normalized semantic tokens. It no longer contains `color.gray.1`.
- The primary accent is **indigo** (Plus UI brand). The component API is
  unchanged because components use semantic tokens.

### Possible next steps

1. Filter `variables.css` to emit only semantic and used tokens.
2. Add component-level tokens for multi-brand support.
3. Add more components (Dropdown, Tooltip, Switch, Toast).
4. Add visual regression testing (Chromatic or Playwright screenshots).
5. Connect the Figma MCP server for design-to-code workflows.
6. Use `FIGMA_AI_PROMPT.md` to generate or extend the Figma design system.

## Attribution and licenses

- **Radix UI** (MIT) — accessible component primitives.
- **Plus UI** community token structure — current Figma token source. Verify the
  Figma file's license before redistributing its assets.
- This project does **not** use shadcn/ui tokens, naming, or configuration.
