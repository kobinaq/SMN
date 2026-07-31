# Accessibility

**Updated:** 2026-07-21

**Target:** practical WCAG 2.1 AA across public, member, and staff critical paths

## Implemented baseline

- Global skip link and visible focus treatment.
- Associated labels on core auth and marketing forms.
- Shared alert/status/loading/empty/error primitives.
- Text labels alongside status colour.
- Reduced-motion handling in motion-aware surfaces.
- Keyboard alternatives for curriculum ordering actions.
- Branded route loading, error, and not-found states.

## Verification still required

- Complete keyboard route pass for signup/login, member navigation, lesson player, mentor request, portfolio, event checkout/tickets, and staff workflows.
- Focus trap, focus return, Escape, and accessible names for every modal/confirmation.
- Error association and live-region behavior after async mutations.
- Heading hierarchy and landmark review on July 18 redesigned pages.
- Contrast, zoom/reflow, 375px member, and tablet staff review.
- Meaningful image alternatives and decorative-image treatment.
- Automated accessibility checks in Playwright/CI.
- Reduced-motion review for GSAP, Framer Motion, and staff transitions.

Accessibility is not release-verified merely because primitives exist. Record manual and automated results against the current release commit.

See [testing.md](testing.md), [design-system.md](design-system.md), and [production-checklist.md](production-checklist.md).
