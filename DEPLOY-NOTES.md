# Syed Software conversion update

This patch is intended to replace/add files in `gitbigga/Syed_software`.

## Main conversion changes
- Sticky top navigation with only brand + `Get a scope & price` CTA.
- Removed the old `SOFTWARE FOR LOCAL BUSINESS` eyebrow.
- Hero rewritten around customer outcomes: more customers, less admin, more time back.
- Process carousel timer now uses a resettable timeout, so manual navigation and the visual progress bar stay synchronized.
- Benefits-focused ticker replaces the old list of software categories.
- New `Problems we solve` section.
- `What we build` reframed around outcomes and each card now links somewhere useful.
- Added a GDC concept-demo block that links to `/demo/gentle-dental-care` and clearly labels it as a concept, not a customer case study.
- Added trust/risk-reversal section.
- Packages renamed around outcomes and given indicative AUD price ranges.
- `Automation 100` renamed to `Lead Follow-Up System`.
- Added a mid-page CTA and FAQ section.
- Quote form reduced to name, email and plain-English problem description.
- Quote API now treats business/project as optional.

## Indicative ranges currently shown
- Business Website: AUD $1,500–$4,000
- Lead Follow-Up System: AUD $1,000–$3,000 setup; typical ongoing $150–$500/month
- Business Workflow System: AUD $3,000–$10,000+

These are intentionally labeled indicative and can be edited before the next production deployment.

## Required Vercel environment variables
- `RESEND_API_KEY`
- `QUOTE_TO_EMAIL`
- `RESEND_FROM_EMAIL` (recommended after verifying your sending domain)
