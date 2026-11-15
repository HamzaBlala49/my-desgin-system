# Token sources

The direction of sync is **Figma → GitHub → code**. Figma is the source of
truth.

## Figma export (source of truth)

- `studio.tokens.json` — single-file export used by the free Tokens Studio plan.
- `studio/` — multi-file export used by the Pro plan.

These files are written by Tokens Studio when you press **Push**. Do not edit
them by hand.

## Bootstrap fallback

- `core/` — primitive tokens (`color`, `space`, `radius`, `typography`, `shadow`)
- `semantic/` — semantic aliases (`semantic.color.*`)
- `themes/dark/` — dark overrides

These are only used while the Figma export is empty, so the repo can be built
before the first push. They are **not** pushed back to Figma. Once
`studio.tokens.json` (or `studio/`) contains tokens, the build ignores them.

## Flow

```text
Figma + Tokens Studio
        │ Push
        ▼
packages/tokens/tokens/studio.tokens.json  (or studio/)
        │ pnpm tokens
        ▼
packages/tokens/dist/
```
