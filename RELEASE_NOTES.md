# DigitalGrow Release Notes

Newest version first. Version rules: patch (x.y.Z) for bug fixes only, minor (x.Y.0) for new features, major (X.0.0) for module-level changes.

| Version | Release type | Date | Focus |
|---|---|---|---|
| v3.1.0 | Feature addition | 2026-11-20 | Assessment and local SEO |
| v3.0.0 | Major, module level | 2026-11-20 | Restructured modules |
| v2.5.0 | Feature addition | 2026-10-28 | New capabilities |
| v2.4.1 | Minor bug fix | 2026-09-29 | Fixes only |
| v2.4.0 | Baseline | 2026-09-15 | Stable starting point |

---

## v3.1.0 (2026-11-20) - Feature addition

### Change log
- **Positioning:** Refocused DigitalGrow on local businesses with clear starting prices.

### Features added
- **Assessment:** Added a six-question flow with package recommendations, reference numbers, and WhatsApp and enquiry options.
- **Local SEO:** Added Hooghly and Kolkata pages, local business structured data, and sitemap entries.
- **Pricing and privacy:** Added a package comparison and a privacy policy.

### Bug fixes
- **Mobile layout:** Fixed horizontal overflow on the local landing pages.

### Testing focus
- **Responsive layouts:** Checked widths from 360px to 1440px.
- **Lead flow:** Verified assessment recommendations, reference links, form prefill, and local preview submission.

---

## v3.0.0 (2026-11-20) - Major change, module level

### Change log
- **Changed:** site rebuilt into separate modules: Clients, Projects, Billing and Bookings.
- **Changed:** new navigation and faster page loads.
- **Removed:** old contact page, replaced by Bookings.

### Features added
- **Bookings module:** visitors book calls in their own time zone.

### Bug fixes
- **Module links:** old page addresses now redirect correctly.

### Testing focus
- Full regression across all four modules.
- Data carried over from v2.5.0.
- Old links and redirects.
- Devices: Chrome, Safari, Firefox, Edge, iPhone and Android.

---

## v2.5.0 (2026-10-28) - Feature addition

### Features added
- **Client portal:** clients view progress and approve work from a private link.
- **Invoice builder:** send invoices with automatic payment reminders.

### Change log
- **Added:** client portal and invoice builder. Nothing removed.

### Testing focus
- Portal links stay private.
- Invoice totals, tax and PDFs are correct.

---

## v2.4.1 (2026-09-29) - Minor bug fix

### Bug fixes
- **Contact form:** no more duplicate messages.
- **Invoice PDFs:** no longer cut off on Safari.
- **Bookings:** correct time shown across time zones.

### Testing focus
- Retest each fix, then run a quick check of core pages.

---

## v2.4.0 (2026-09-15) - Baseline

### Change log
- **Changed:** dashboard layout and report exports.

### Testing focus
- Login, dashboard and report exports across main browsers.
