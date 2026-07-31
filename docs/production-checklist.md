# Production Release Checklist

**Updated:** 2026-07-21

Use this checklist for every production promotion. Complete the additional payment or AI sections only when exposing those capabilities.

## Ownership and recovery

- [ ] Deployment owner named
- [ ] Migration owner named
- [ ] Incident and rollback owner named
- [ ] Database recovery point recorded
- [ ] R2 recovery/versioning confirmed where critical

## Environment

- [ ] DATABASE_URL targets durable production PostgreSQL
- [ ] PAYLOAD_SECRET is unique, non-default, and stable across deployments
- [ ] NEXT_PUBLIC_SITE_URL exactly matches the live origin
- [ ] R2 configuration is complete when uploads are enabled
- [ ] RESEND_API_KEY and verified RESEND_FROM configured
- [ ] Operations inbox, Mailchimp audience, cron secret, analytics property, WhatsApp invite, and Classroom links confirmed as applicable
- [ ] STAFF_LEGACY_ADMIN is unset
- [ ] All AI flags remain false unless separately approved

## Quality and schema

- [ ] Typecheck passes on the release commit
- [ ] Lint passes without unexplained errors
- [ ] Unit tests pass
- [ ] Production build passes
- [ ] Playwright passes on the release commit
- [ ] Full migration chain passes on disposable PostgreSQL
- [ ] Production payload-migrations matches the intended state
- [ ] Only reviewed pending forward migrations are applied
- [ ] Post-migration collection reads pass

## Authentication

- [ ] Member signup, login, password reset behavior, and logout
- [ ] Staff login and logout at /staff/login
- [ ] /admin redirects to /staff
- [ ] Simultaneous staff/member sessions remain isolated
- [ ] Protected staff/member/API routes reject anonymous and wrong-role access

## Core workflows

- [ ] Public home, programmes, courses, events, stories, resources, apply, contact, and legal pages
- [ ] Member profile and onboarding save
- [ ] Course access, lesson completion, progress, and resume
- [ ] Mentor application, review, request, and transition
- [ ] Opportunity import/manual listing, moderation, and member tracking
- [ ] Portfolio draft/edit/publish and public privacy
- [ ] Certificate issue/revoke/reissue and public verification
- [ ] Staff media upload and delivery
- [ ] AI-disabled and provider-failure states do not break core pages

## Events and Paystack

- [ ] 20260717_events_paystack is recorded in production
- [ ] Paystack keys and webhook secret are configured
- [ ] Production webhook endpoint is registered
- [ ] Free registration works
- [ ] Test paid checkout verifies product, amount, currency, and member identity
- [ ] Invalid webhook signature is rejected
- [ ] Duplicate verification/webhook delivery does not duplicate payment, registration, or enrollment
- [ ] Successful payment grants the correct ticket/course/Classroom access
- [ ] Email failure does not undo payment fulfillment
- [ ] Member tickets and staff registration list agree
- [ ] Cancellation, refund ownership, and check-in are verified
- [ ] Settlement/refund owner signs off before live paid CTAs

## AI private beta

- [ ] Production AI schema verified
- [ ] Only the approved feature flag is enabled
- [ ] Course entitlement and retrieval isolation pass
- [ ] Unsupported answers decline with citations policy intact
- [ ] Injection, prohibited-action, quota, timeout, and provider-failure tests pass
- [ ] Retention, deletion, feedback, and privacy copy pass
- [ ] Content Studio cannot auto-publish
- [ ] Career Coach requires confirmation before state changes
- [ ] Rollback by disabling the affected flag is tested

## Post-deploy

- [ ] Deployment and migration evidence recorded
- [ ] Critical route smoke completed
- [ ] Logs checked for auth, database, storage, email, payment, and AI errors
- [ ] Stakeholders notified of enabled/disabled capabilities and known gates
