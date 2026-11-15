# Token source

This folder is the single source of truth for the design-system tokens. The
direction of sync is **Figma → GitHub → code**.

## Sets

- `primitives/*.json` — one file per primitive set:
  `color-light`, `color-dark`, `typography-en`, `typography-ar`, `space`,
  `radius`, `border-width`, `shadow`, `opacity`, `sizing`, `breakpoints`.
- `semantic/*.json` — one file per semantic set:
  `color-light`, `color-dark`, `border-light`, `border-dark`,
  `typography-light`, `typography-dark`.
- `component/*.json` — one file per component:
  `button`, `input`, `label`, `checkbox`, `badge`, `card`, `dialog`, `select`,
  `tabs`.
- `$metadata.json` — Tokens Studio set order.
- `$themes.json` — Tokens Studio themes (currently empty).

Each JSON file is one Tokens Studio set. The files are written by Tokens Studio
folder sync (Pro) or imported manually. Do not move them into a single file;
the build reads them as separate sets.

## Flow

```text
Figma + Tokens Studio
        │ Push (folder storage)
        ▼
packages/tokens/tokens/{primitives,semantic}/*.json
        │ pnpm tokens
        ▼
packages/tokens/dist/
```
