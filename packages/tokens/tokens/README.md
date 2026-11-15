# Token sources

The direction of sync is **Figma → GitHub → code**. Figma is the source of
truth.

## Figma export (source of truth)

- `studio.tokens.json` — single-file export used by the free Tokens Studio plan.
- `studio/` — multi-file export used by the Pro plan.

These files are written by Tokens Studio when you press **Push**. Do not edit
them by hand.

## Minimal fallback

- `fallbacks/typography.json` — `font-sans`/`font-mono` and
  `letterSpacing.tight`/`wide`
- `fallbacks/shadow.json` — `shadow.xs`

Colors, spacing, radius, typography sizes/weights/line-heights, and shadows come
from the Figma export. The fallback files only fill values that the Figma export
does not provide. The Figma export always wins for any path it defines. The
fallback is **not** pushed back to Figma.

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
