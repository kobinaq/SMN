# Accessibility

Target: practical WCAG 2.1 AA baseline for member portal and staff ops.

## Checklist

- [ ] Keyboard reachability for all primary actions
- [ ] Visible focus indicators
- [ ] Modal focus trap + Escape closes (`ConfirmDialog`)
- [ ] Form controls have associated labels
- [ ] Errors linked via `role="alert"` / described fields
- [ ] Colour is not the only status cue (`StatusBadge` + text)
- [ ] Heading hierarchy starts at one `h1` per view
- [ ] Meaningful button names and alternative text for media
- [ ] Live regions for save/progress feedback (`aria-live`)
- [ ] Respect `prefers-reduced-motion` for non-essential motion
- [ ] Drag-and-drop curriculum actions have keyboard alternatives (move up/down)

## Verification

- Manual keyboard pass on registration, lesson player, mentor request, staff confirms
- Expand automated a11y checks in Playwright as coverage grows (`docs/testing.md`)
