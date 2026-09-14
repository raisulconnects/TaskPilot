# UI Design Reference (non-normative)

Working notes from the UI overhaul (landing, login redesign, signup, dashboard
reskin): the original `DESIGN.md` brief, `tokens.json` token definitions,
`theme.css` / `variables.css` explorations, and `ui-agent-context.md`.

These files are **reference only** — nothing in `client/src` imports them.
The shipped source of truth for all design values is `client/src/index.css`
(`@theme` tokens). If a value here disagrees with `index.css`, `index.css`
wins. Do not add new product docs here; use the `doc/phase-*.md` convention.
