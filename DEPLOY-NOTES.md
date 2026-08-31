# Syed Software conversion update

This patch is based on the latest conversion build and includes the current GDC demo route/assets plus the main landing-page refinements.

## Latest refinements

- Removed the secondary hero link, no-obligation line, and three hero trust bullets to reduce above-the-fold clutter.
- Rebuilt the moving benefits ticker with fixed, even spacing between every phrase and separator.
- Improved the quote-section lead copy and increased its contrast/readability.
- Removed the “What happens next” block from the quote section.
- Changed primary scope/price CTAs to target `#quote-form` directly instead of the top of the quote section.
- Added a “Trusted platforms” credibility section with concrete use cases for Twilio, OpenAI, Vercel, and Resend. This wording intentionally avoids implying formal partnership or endorsement.
- Removed the layout-shifting hover effect from the “What we build” links and replaced it with a cleaner inset accent/arrow movement.
- Added minor typography smoothing and responsive styling for the new platform section.

## Quote email environment variables

Set these in Vercel for the form to send via Resend:

- `RESEND_API_KEY`
- `QUOTE_TO_EMAIL`
- `RESEND_FROM_EMAIL` (optional; otherwise Resend onboarding sender is used)
