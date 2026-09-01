# Leverage Systems rebrand + outbound landing-page update

This patch is designed to be applied over the current `gitbigga/Syed_software` repository.

## What changed

- Complete public rebrand from **Syed Software** to **Leverage Systems**.
- New Leverage Systems logo asset and matching dark-navy / lime visual system.
- Browser title, metadata, Open Graph preview, social card, favicon, manifest, footer and form copy updated.
- Homepage rewritten for cold/outbound prospects:
  - automation-first hero;
  - repetitive-work problem section;
  - clear automation categories;
  - interactive Problem → Working System use cases;
  - four-step delivery process;
  - capability demos and clearly labelled GDC concept;
  - trusted technology + concrete use cases;
  - lower-friction **Discuss your workflow** CTA.
- Pricing/package section removed from the homepage so qualification happens before pricing.
- Form now asks only:
  - name;
  - business;
  - email;
  - phone (optional);
  - what takes too much time.
- Added a basic `/privacy` page.
- GDC demo page rebranded to Leverage Systems and kept `noindex`.

## Form → Resend + Airtable

`app/api/quote/route.ts` now sends the lead through two channels:

1. **Airtable**
   - finds/creates the company;
   - finds/creates the contact;
   - sets company status to `Interested`;
   - sets `Lead Source` to `Inbound`;
   - sets `Outbound Paused` to `true`;
   - clears `Next Action At`;
   - creates an `Outreach` record with `Direction = Inbound`.

2. **Resend**
   - sends an internal enquiry notification;
   - sends a branded acknowledgement to the prospect as a best-effort follow-up.

The existing Airtable base used is:

- Base: `Leverage Systems — Lead Intelligence`
- Default base ID: `appH4B2WvCghTcroe`

Two company fields were added to that base for this flow:

- `Lead Source` — Outbound / Inbound
- `Outbound Paused` — checkbox

### Important crawler rule

The outbound crawler/sequence runner should skip a company whenever:

- `Outbound Paused = true`, **or**
- `Lead Source = Inbound`, **or**
- the company status is no longer `Outreach Active`.

The website endpoint sets all relevant state on inbound submission, but the outbound worker must enforce the skip rule when selecting follow-ups.

## Required Vercel environment variables

```text
RESEND_API_KEY=...
QUOTE_TO_EMAIL=...
RESEND_FROM_EMAIL=Leverage Systems <hello@leveragesystems.tech>
AIRTABLE_PAT=...
```

Optional overrides (defaults are already in the route):

```text
AIRTABLE_BASE_ID=appH4B2WvCghTcroe
AIRTABLE_COMPANIES_TABLE_ID=tblNKmd9wIhv9oHEs
AIRTABLE_CONTACTS_TABLE_ID=tbliocRbhLARfbBG1
AIRTABLE_OUTREACH_TABLE_ID=tblpEhdVAp84YPwOC
```

Before sending traffic, confirm that `hello@leveragesystems.tech` can receive mail and that the sender/domain is verified in Resend.

## Domain

The metadata and canonical URLs now assume:

```text
https://leveragesystems.tech
```

Attach that domain to the production Vercel project before starting volume outreach.
