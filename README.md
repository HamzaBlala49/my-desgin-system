# Design System

A token-driven design system monorepo built with:

- [Turborepo](https://turborepo.dev) — monorepo task orchestration and caching
- [Style Dictionary](https://styledictionary.com) — token transformation
- [Tokens Studio](https://tokens.studio) — Figma token sync
- [Radix Colors](https://www.radix-ui.com/colors) — accessible primitive color scales
- [Radix UI](https://www.radix-ui.com/primitives) — accessible primitives
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first styling
- [Storybook](https://storybook.js.org) — component documentation
- [Vitest](https://vitest.dev) + Testing Library + jest-axe — behavior and a11y tests
- [Changesets](https://github.com/changesets/changesets) — versioning and publishing

## Repository structure

```text
.
├── apps/
│   ├── docs/                      # @repo/docs — Storybook docs
│   └── playground/                # @repo/playground — consumer playground
├── packages/
│   ├── tokens/                    # @repo/tokens — token pipeline
│   │   ├── tokens/
│   │   │   ├── core/              # primitive tokens (color, space, radius, typography, shadow)
│   │   │   ├── semantic/          # semantic aliases used by components
│   │   │   └── themes/dark/       # dark theme overrides
│   │   ├── scripts/sync-radix.mjs # generates primitive colors from @radix-ui/colors
│   │   └── build.mjs              # Style Dictionary build
│   ├── ui/                        # @repo/ui — components
│   │   ├── src/components/
│   │   ├── src/lib/cn.ts
│   │   └── src/styles.css
│   ├── eslint-config/
│   └── typescript-config/
├── .changeset/
├── .github/workflows/
├── turbo.json
└── package.json
```

## Requirements

- Node.js >= 22.12.0
- pnpm 8.15.6 (`corepack enable`)

## Getting started

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
| `pnpm sync:tokens` | Regenerate primitive colors from Radix Colors   |
| `pnpm changeset`   | Create a changeset                              |
| `pnpm release`     | Build and publish via Changesets                |
| `pnpm format`      | Format with Prettier                            |

## Token architecture

Tokens are split into three levels:

1. **Primitive (`core` set)** — raw values such as `color.gray.1`, `space.4`,
   `radius.md`, `typography.fontSize.sm`, `shadow.md`.
2. **Semantic (`semantic` set)** — product decisions such as
   `semantic.color.surface.canvas`, `semantic.color.content.primary`,
   `semantic.color.accent.solid`.
3. **Component (optional)** — component-specific tokens when a semantic token
   is not enough.

Components must only use semantic tokens. The `core` set deliberately does not
prefix its groups with `core.`; this matches how Tokens Studio exports token
sets and keeps the Figma → JSON mapping direct.

### Generated outputs

`pnpm --filter @repo/tokens build` produces:

```text
packages/tokens/dist/
├── variables.css   # --ds-* CSS variables for :root and [data-theme="dark"]
├── tailwind.css    # @theme inline mapping to Tailwind v4 namespaces
├── tokens.json     # flattened resolved tokens
├── tokens.mjs      # ESM
├── tokens.cjs      # CommonJS
└── tokens.d.ts     # types
```

The CSS variable prefix is `--ds-` to avoid collisions with consumers:

- primitives: `--ds-color-gray-1`, `--ds-space-4`, `--ds-radius-md`
- semantic: `--ds-semantic-color-surface-canvas`

### Primitive colors

Primitive colors are generated from [`@radix-ui/colors`](https://www.radix-ui.com/colors)
(MIT). To regenerate them:

```bash
pnpm sync:tokens
pnpm tokens
```

The generator writes both light and dark scales. Dark mode overrides the same
token paths, so semantic aliases resolve to the correct theme automatically.

### Using tokens with Tailwind v4

`@repo/tokens/tailwind.css` maps semantic tokens into Tailwind namespaces:

```css
@import "tailwindcss";
@import "@repo/tokens/tailwind.css";

@source "./src/**/*.{ts,tsx}";
```

Semantic tokens become utilities:

- `bg-surface-canvas`, `bg-surface-raised`
- `text-content-primary`, `text-content-secondary`
- `border-stroke-default`
- `bg-accent`, `hover:bg-accent-hover`, `text-accent-contrast`
- `ring-focus`
- `rounded-md`, `shadow-sm`, `text-sm`, `font-medium`

### Theme switching

The token package ships light variables on `:root` and dark overrides on
`[data-theme="dark"]` and `.dark`.

```ts
document.documentElement.dataset.theme = "dark";
```

RTL is supported through logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`,
`text-start`, `end-*`):

```ts
document.documentElement.dir = "rtl";
```

## Figma → Tokens Studio → GitHub

1. Create a free Figma account and duplicate a community kit for visual
   reference. This project uses **Untitled UI Free** as a visual reference only;
   the Figma file is not redistributed.
2. Install the free **Tokens Studio for Figma** plugin.
3. Create token sets with these names and contents:
   - `core` — `color`, `space`, `radius`, `typography`, `shadow`
   - `semantic` — `semantic.color.*` (a top-level `semantic` group)
   - `themes/dark` — `color.*` overrides and optional `semantic.color.*`
     overrides
4. In GitHub, create a **Personal Access Token**:
   - Classic token with the `repo` scope, or
   - Fine-grained token with **Contents: Read and write**.
5. In Figma, open **Tokens Studio → Settings → Sync providers → Add new →
   GitHub** and fill the form:
   - **Name**: `design-system-tokens`
   - **Personal access token**: the token from step 4
   - **Repository (owner/repo)**: e.g. `your-user/my-desgin-system`
   - **Branch**: `main` (or a feature branch)
   - **Token storage location (file/folder path)**:
     - **Free plan (single file)**:
       `packages/tokens/tokens/studio.tokens.json`
     - **Pro plan (multi-file)**:
       `packages/tokens/tokens/studio`
   - **Base URL**: leave empty for github.com
6. Save, then choose **Push** (not Pull) in the sync modal.
7. (Optional) Import the starter tokens so you begin from the Radix-based
   scales:
   - `core` set: import `tokens/core/color.json`, `space.json`, `radius.json`,
     `typography.json`, `shadow.json`.
   - `semantic` set: import `tokens/semantic/color.json`.
   - `themes/dark` set: import `tokens/themes/dark/color.json` and
     `semantic.json`.
     Use each set's JSON view to paste/merge the contents, then push again.

The build script auto-detects the storage mode:

| Mode               | Plugin path                                 | How the build uses it                                                                     |
| ------------------ | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Single file (free) | `packages/tokens/tokens/studio.tokens.json` | merges non-dark sets for light; set names containing `dark` (e.g. `themes/dark`) for dark |
| Multi-file (Pro)   | `packages/tokens/tokens/studio`             | merges non-dark JSON files for light; files containing `dark` in the name for dark        |
| Manual fallback    | —                                           | `tokens/core/*`, `tokens/semantic/*`, `tokens/themes/dark/*`                              |

The console output confirms the detected mode:

```text
Built @repo/tokens (light: studio-file, dark: studio-file) → ...
```

> **Important:** the Tailwind mapping expects `semantic.color.*` for semantic
> tokens and `radius.*`, `typography.*`, `shadow.*` for primitives. Keep a set
> whose name contains `dark` (recommended: `themes/dark`) for the dark
> overrides. Single-file mode supports light and dark because Tokens Studio
> stores each set as a top-level key in the file; the build splits them. Pro
> multi-file sync is still recommended for teams because it is easier to review
> in git and avoids a large single file.

8. The `Tokens` GitHub Actions workflow validates the build and uploads the
   generated `dist` artifact. `dist` is never committed; it is produced by CI
   and before publishing.

## Consuming `@repo/ui`

### With the precompiled CSS (recommended)

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

### Tailwind-native consumers

If your app also uses Tailwind v4, import the token theme and scan this package's
source:

```css
@import "tailwindcss";
@import "@repo/tokens/tailwind.css";

@source "../node_modules/@repo/ui/dist";
```

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
8. Add tests, including an axe assertion.

## Component API notes

- **Button** — `variant`, `size`, `asChild`, `isLoading`, `disabled`.
- **Input** — `invalid`.
- **Label** — `required`.
- **Checkbox** — Radix Checkbox, supports `checked="indeterminate"`.
- **Badge** — `variant`, `size`.
- **Card** — composable `CardHeader`, `CardTitle`, `CardDescription`,
  `CardContent`, `CardFooter`.
- **Dialog** — Radix Dialog with overlay, content, header, footer, title,
  description, and close.
- **Select** — Radix Select with groups, labels, separators, and scroll buttons.
- **Tabs** — Radix Tabs with list, trigger, and content.

## Styling rules

1. Never use raw hex values in components.
2. Never build Tailwind class names dynamically (`bg-${color}`); use static maps
   or `cva`.
3. Use semantic tokens only; primitives are for semantic aliases.
4. Use logical properties so RTL works without overrides.
5. Do not add global CSS resets to the component package.
6. Keep `sideEffects` including `**/*.css`.

## Testing

```bash
pnpm test
```

Each component has behavior tests and an accessibility test using `jest-axe`.
Storybook also runs the a11y addon, and `parameters.a11y.test = "error"` makes
the test runner fail on violations.

## Releasing

```bash
pnpm changeset
pnpm version-packages
pnpm release
```

Publishing is handled by the `Release` GitHub Actions workflow using
Changesets. Add `NPM_TOKEN` and `GITHUB_TOKEN` to the repository secrets.

## Attribution

- Primitive colors: [Radix Colors](https://github.com/radix-ui/colors), MIT.
  See `packages/tokens/THIRD_PARTY_LICENSES.md`.
- Visual reference: [Untitled UI Free](https://www.untitledui.com/), used as a
  reference only and not redistributed.
- The project does not use shadcn/ui tokens or configuration.
