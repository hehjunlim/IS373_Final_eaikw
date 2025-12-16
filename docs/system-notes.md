# System Notes: Design Gallery

This document describes the approval lifecycle, data flow, automation
touchpoints, and security assumptions for the Design Gallery system.

## Approval lifecycle

- Authors submit gallery submissions into Sanity (source of truth).
- Submissions are created with `status: "submitted"`.
- Admin reviewers change `status` to `approved` or `rejected` via the
  instructor/review panel.
- When a submission transitions:
  - submitted → approved:
    - Sanity document is updated.
    - An Airtable row for the submission is created or updated (upsert keyed by
      `Sanity ID`).
    - An optional Discord announcement is sent to the configured webhook(s).
    - A site rebuild is triggered via a configured build hook so approved items
      appear publicly.
  - approved → rejected:
    - Sanity document is updated.
    - Airtable row is upserted to reflect new status.
    - No public notification is sent.

## Data flow

- Sanity is the single source of truth for all submission data.
- Eleventy (static site generator) queries Sanity at build time and renders
  content.
  - Public builds fetch only `status == "approved"` submissions.
  - Review/admin builds (when `ELEVENTY_REVIEW=true` or `REVIEW_MODE=true`)
    fetch all submissions for internal review.
- Airtable is a read-only CRM ledger for the public site: the system upserts
  submission records there for tracking and reporting.
- Discord is used for internal notifications only. Messages include submitter
  name, design style, demo URL, and status.

## Automation touchpoints

- Netlify / serverless function: `netlify/functions/sanity-submissions.js`
  - Handles creating submissions and updating status.
  - On status changes it performs idempotent updates, upserts Airtable, notifies
    Discord (best-effort), and triggers the site build hook (if configured).
- Eleventy data: `src/_data/submissions.js`
  - Fetches either approved-only (public) or all submissions (review mode) from
    Sanity via `src/_data/sanity-queries.js`.
- Airtable module: `netlify/functions/airtable-crm.js` (upsert logic keyed by
  email and `Sanity ID`).

## Failure mode and safety

- Sanity unreachable during Eleventy build: build fails loudly and aborts. This
  prevents accidental public leakage of unapproved content.
- Airtable failures: treated as non-fatal. Errors are logged; submission changes
  still succeed in Sanity and the API returns success to the caller.
- Discord failures: treated as non-fatal. The notification code retries a small
  number of times with backoff and logs errors.
- Build hook failures: treated as non-fatal and logged. The status in Sanity
  remains authoritative; a manual rebuild can be triggered if needed.
- Analytics failures: analytics integrations are optional and disabled by
  default. If analytics fail they are silently disabled and do not affect
  content delivery.

## Security assumptions

- Sanity is considered the sensitive, authoritative datastore. API tokens for
  Sanity are stored in environment variables and must never be committed.
- The review API endpoints require a `REVIEW_API_TOKEN` Bearer token for
  authorization; keep this token secret and rotate periodically.
- Airtable tokens and build hook URLs are stored in environment variables and
  treated as secrets.
- Public content is exclusively derived from `gallerySubmission` documents with
  `status == "approved"` at build time. No client-side filtering is used to
  expose unapproved content.

## Operational notes

- To build a review/admin site that renders all submissions, set
  `ELEVENTY_REVIEW=true` (or `REVIEW_MODE=true`) at build time.
- To enable build triggers after approvals, set `ELEVENTY_BUILD_HOOK` or
  `NETLIFY_BUILD_HOOK` in environment.
- To enable Discord notifications, set `DISCORD_WEBHOOK_URL` in environment.
- To enable Airtable CRM sync, set `AIRTABLE_BASE_ID` and `AIRTABLE_API_TOKEN`
  in environment.

## Files touched by this change

- `src/_data/sanity-queries.js` — Sanity GROQ queries; now fails loudly when
  client missing; added `getAllSubmissions()`.
- `src/_data/submissions.js` — Eleventy data file that returns approved-only or
  all submissions depending on review mode and fails build on Sanity errors.
- `netlify/functions/sanity-submissions.js` — Added idempotency checks, Airtable
  upsert calls, Discord retry, and build hook trigger.

For any operational change (rotating tokens, changing build hooks), update
environment variables and verify behavior in a staging build first.
