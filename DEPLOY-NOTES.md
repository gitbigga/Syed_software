# Syed Software update

Files in this patch are intended to replace/add files in `gitbigga/Syed_software`.

## Main-site changes
- `app/page.tsx`: viewport-triggered process carousel, moving services ticker, packaged offers, async quote form.
- `app/globals.css`: carousel/ticker/package styling and mobile/reduced-motion support.
- `app/api/quote/route.ts`: sends quote enquiries through Resend.

## Reusable prospect demo system
- `lib/demo-clients.ts`: one configuration object per prospect.
- `app/demo/[slug]/page.tsx`: reusable client landing page.
- `app/demo/[slug]/page.module.css`: client-theme-driven page styles.
- `public/clients/gentle-dental-care/logo.png`
- `public/clients/gentle-dental-care/demo.mp4`

First page slug: `/demo/gentle-dental-care`

## Required Vercel environment variables for the quote form
- `RESEND_API_KEY` — Resend API key.
- `QUOTE_TO_EMAIL` — inbox that should receive new quote requests.
- `RESEND_FROM_EMAIL` — recommended after verifying a sending domain in Resend, e.g. `Syed Software <quotes@yourdomain.com>`.

If `RESEND_FROM_EMAIL` is absent, the API route falls back to `Syed Software <onboarding@resend.dev>`, which is suitable only for Resend testing constraints.

## Prospect page usage conditions currently shown
- Up to 100 automated SMS/call actions per monthly billing period.
- Included actions do not roll over.
- Additional usage can be sold as packaged add-on blocks.
- Pricing is presented as a defined range and fixed after scope confirmation; no exact public price is hard-coded.

## Validation performed
The TypeScript/TSX files were syntax-checked using the TypeScript compiler API. A full `next build` still needs the repository dependencies/environment.
