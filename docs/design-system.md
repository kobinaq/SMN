# Design system (portal & staff)

## Identity

Preserve the existing SMN visual language: near-black surfaces, baby-blue accents, mint success, League Spartan display type, Inter body.

## Shared interaction kit

| Pattern | Location | Use |
|---|---|---|
| Toast | `components/ui/Toast.tsx` | Transient success/error/info |
| ConfirmDialog | `components/ui/ConfirmDialog.tsx` | Destructive and consequential confirms |
| EmptyState / ErrorState / StatusBadge / FormField / Skeleton | `components/ui/Feedback.tsx` | Consistent empty/error/loading/status |
| TagInput | `components/ui/TagInput.tsx` | Skills / interests tags |
| Staff chrome | `components/staff/ui.tsx` | Staff headers, panels, fields |

## Rules

- Every async mutation shows progress and ends with success or a next-step error.
- Destructive actions require confirmation (prefer ConfirmDialog over `window.confirm`).
- Forms retain entered values after validation failure.
- Buttons disable while busy to prevent duplicate submission.
- Status is never colour-only — pair badges with text labels.
- Prefer side drawers / modals for quick edits; full pages for complex work.
