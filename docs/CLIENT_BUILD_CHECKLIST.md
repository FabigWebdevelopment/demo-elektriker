# Client Build Checklist

> **Step-by-step process from signed contract to live website**
>
> **Timeline:** 7-10 business days

---

## Pre-Build (Day 0)

### Contract & Payment

- [ ] Contract signed (digital signature)
- [ ] Setup fee paid (if applicable)
- [ ] First month subscription started
- [ ] Package tier confirmed: ____________________
- [ ] Client added to billing system

### Onboarding Data Received

- [ ] Onboarding form completed
- [ ] All required fields filled
- [ ] Files uploaded:
  - [ ] Logo (PNG/SVG, min 500x500)
  - [ ] Owner photo
  - [ ] Team photos (if applicable)
  - [ ] Project photos (if provided)
- [ ] Data saved to Google Drive: `/Clients/[Name] [Date]/`
- [ ] Data synced to Twenty CRM

### Data Review

- [ ] Business info complete and accurate
- [ ] Contact info verified (phone works, email valid)
- [ ] Address correct (for NAP consistency)
- [ ] Services list complete
- [ ] Certifications verified
- [ ] USPs identified (3 unique selling points)
- [ ] Logo quality sufficient
- [ ] Photos usable (resolution, quality)

**If data incomplete:** Contact client for clarification before proceeding

---

## Day 1: Setup

### Repository Creation

```bash
# Clone from appropriate demo
git clone https://github.com/fabig/demo-[industry] client-[name]
cd client-[name]

# Remove git history
rm -rf .git
git init

# Create new repo
gh repo create fabig/client-[name] --private
git remote add origin https://github.com/fabig/client-[name]
```

- [ ] Repo created from demo template
- [ ] Git history reset
- [ ] New repo initialized
- [ ] Pushed to GitHub

### Disable Demo Mode

```typescript
// src/config/demo.config.ts
export const DEMO_MODE = false
```

```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=false
```

- [ ] `DEMO_MODE` set to `false` in config
- [ ] `DEMO_MODE` set to `false` in env
- [ ] Demo components verified not rendering

### Apply Client Configuration

```bash
# Option A: Manual edit
# Edit src/config/business.config.ts directly

# Option B: Script (if available)
npm run apply-config --data=/path/to/onboarding-data.json
```

**business.config.ts updates:**

- [ ] `legalName`: ____________________
- [ ] `brandName`: ____________________
- [ ] `tagline`: ____________________
- [ ] `phone`: ____________________
- [ ] `email`: ____________________
- [ ] `whatsapp`: ____________________
- [ ] `address.street`: ____________________
- [ ] `address.zip`: ____________________
- [ ] `address.city`: ____________________
- [ ] `hours.weekdays`: ____________________
- [ ] `hours.saturday`: ____________________
- [ ] `hours.emergency`: ____________________
- [ ] `services[]`: ____________________
- [ ] `certifications[]`: ____________________
- [ ] `serviceArea.mainCity`: ____________________
- [ ] `serviceArea.districts[]`: ____________________
- [ ] `social.facebook`: ____________________
- [ ] `social.instagram`: ____________________
- [ ] `reviews.googleUrl`: ____________________
- [ ] `reviews.rating`: ____________________
- [ ] `reviews.count`: ____________________
- [ ] `legal.handelsregister`: ____________________
- [ ] `legal.ustId`: ____________________

### Apply Theme Configuration

**theme.config.ts updates:**

- [ ] Primary color: ____________________
- [ ] Secondary color: ____________________
- [ ] Accent color (derived): ____________________
- [ ] Font (if custom): ____________________

```css
/* Verify in globals.css or theme file */
--primary: oklch(...);
--primary-foreground: oklch(...);
```

---

## Day 2: Assets

### Logo Integration

- [ ] Logo copied to `/public/images/logo.png`
- [ ] Logo copied to `/public/images/logo.svg` (if available)
- [ ] Logo displays correctly in header
- [ ] Logo displays correctly in footer
- [ ] Favicon generated from logo
- [ ] OG image includes logo

### Team Photos

- [ ] Owner photo → `/public/images/team/[name].jpg`
- [ ] Photo optimized (WebP, <200KB)
- [ ] Photo displays on "Über uns" page
- [ ] Alt text added

### Project Photos (if provided)

- [ ] Photos copied to `/public/images/projects/`
- [ ] Photos optimized
- [ ] Gallery component updated (if used)

### Image Generation

**Required images to generate:**

| Image | Status | Notes |
|-------|--------|-------|
| Hero | [ ] | 16:9, warm lighting |
| Benefit 1 | [ ] | 4:3, [theme] |
| Benefit 2 | [ ] | 4:3, [theme] |
| Benefit 3 | [ ] | 4:3, [theme] |
| Benefit 4 | [ ] | 4:3, [theme] |
| Process Step 1 | [ ] | 4:3, hands only |
| Process Step 2 | [ ] | 4:3, hands only |
| Process Step 3 | [ ] | 4:3, hands only |
| Process Step 4 | [ ] | 4:3, hands only |
| Service Area | [ ] | 16:9, city view |

```bash
# Generate images
npm run generate-images --visual-dna=client-[name]

# Or manually via API
curl -X POST /api/generate-image \
  -d '{"prompt": "...", "aspectRatio": "16:9"}'
```

- [ ] All images generated
- [ ] All images reviewed for quality
- [ ] No AI artifacts visible
- [ ] Consistent with Visual DNA
- [ ] Images optimized (<200KB each)

---

## Day 3: Content & Legal

### Content Updates

**Home Page:**

- [ ] Hero headline updated with city
- [ ] Hero subheadline updated
- [ ] Trust bar stats accurate
- [ ] Services list matches client
- [ ] Testimonials section (use generic or client-provided)

**Service Pages:**

- [ ] All service pages have correct content
- [ ] Pricing info updated (if shown)
- [ ] FAQ content relevant to client

**About Page:**

- [ ] Owner bio updated
- [ ] Team section populated
- [ ] Company story written
- [ ] Experience/founding year correct

**Contact Page:**

- [ ] All contact info correct
- [ ] Map shows correct location
- [ ] Form works

### Legal Pages

**Impressum:**

- [ ] Company name correct
- [ ] Address correct
- [ ] Phone correct
- [ ] Email correct
- [ ] Handelsregister number
- [ ] USt-IdNr.
- [ ] Responsible person (V.i.S.d.P.)

**Datenschutz:**

- [ ] Company info updated
- [ ] Contact for data requests
- [ ] Cookies policy accurate
- [ ] Third-party services listed (Analytics, CRM, etc.)

---

## Day 4: Infrastructure

### CRM Setup

**Create Client Workspace in Twenty:**

- [ ] New workspace created: `client-[name]`
- [ ] API key generated
- [ ] Pipelines configured:
  - [ ] Leads
  - [ ] Customers
- [ ] Custom fields added (if needed)
- [ ] Webhook URL configured

### Email Setup

**Resend Domain Verification:**

- [ ] Domain added to Resend: `[client-domain].de`
- [ ] DNS records provided to client:
  - [ ] SPF record
  - [ ] DKIM record
  - [ ] DMARC record (optional)
- [ ] Client confirms DNS added
- [ ] Domain verified in Resend
- [ ] Test email sent successfully

### Environment Variables

**Update `.env.local`:**

```bash
# CRM - CLIENT'S WORKSPACE
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY=[client_api_key]
TWENTY_WORKSPACE_ID=[client_workspace_id]

# Email - CLIENT'S DOMAIN
RESEND_API_KEY=[client_resend_key]
RESEND_FROM_EMAIL=info@[client-domain].de

# WhatsApp (if different from default)
TWILIO_WHATSAPP_NUMBER=[client_number]

# Analytics
NEXT_PUBLIC_PIRSCH_CODE=[client_pirsch_code]

# Demo mode OFF
NEXT_PUBLIC_DEMO_MODE=false
```

- [ ] All env vars updated
- [ ] Env vars added to Vercel project

### Vercel Setup

```bash
# Link to Vercel
vercel link

# Add environment variables
vercel env add TWENTY_API_KEY production
vercel env add TWENTY_WORKSPACE_ID production
# ... etc
```

- [ ] Vercel project created
- [ ] Linked to GitHub repo
- [ ] All env vars added
- [ ] Build settings correct

---

## Day 5: Testing

### Functional Testing

**Forms:**

- [ ] Contact form submits
- [ ] Lead appears in client's CRM
- [ ] Confirmation email sent (from client's domain)
- [ ] Emergency form works (if applicable)

**Links:**

- [ ] All internal links work
- [ ] All external links work (social, GMB)
- [ ] Phone number dials correctly
- [ ] WhatsApp opens correctly
- [ ] Email links work

**Navigation:**

- [ ] Desktop navigation works
- [ ] Mobile navigation works
- [ ] Footer links work

### Device Testing

- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)
- [ ] Real mobile device (not just emulator)

---

## Day 6: QA Audits

### Run Full QA Suite

```bash
npm run qa-suite --url=https://staging-[client].vercel.app
```

| Audit | Score | Pass? | Notes |
|-------|-------|-------|-------|
| SEO | __/100 | [ ] | Target: ≥90 |
| Conversion | __/100 | [ ] | Target: ≥85 |
| Accessibility | __/100 | [ ] | Target: ≥95 |
| Performance | __/100 | [ ] | Target: ≥90 |
| Code Review | __/100 | [ ] | Target: ≥90 |

### Fix Critical Issues

**List issues found:**

1. ____________________
2. ____________________
3. ____________________

**Issues fixed:**

- [ ] Issue 1 resolved
- [ ] Issue 2 resolved
- [ ] Issue 3 resolved

### Re-run Audits

- [ ] All audits now pass
- [ ] Overall score: __/100

### Manual Checks

- [ ] No placeholder text ("Lorem ipsum", etc.)
- [ ] German spelling correct
- [ ] All images load
- [ ] No console errors
- [ ] SSL certificate valid (on Vercel preview)
- [ ] Favicon present

---

## Day 7: Client Review

### Deploy to Staging

```bash
vercel  # Deploys to preview URL
```

Staging URL: `https://[project]-[hash].vercel.app`

### Send for Review

**Email to client:**

```
Betreff: Ihre neue Website ist bereit zur Prüfung

Hallo [Name],

Ihre neue Website ist fertig und wartet auf Ihre Freigabe!

🔗 Preview: [staging URL]

Bitte prüfen Sie:
- [ ] Alle Texte korrekt
- [ ] Bilder passen
- [ ] Kontaktdaten stimmen
- [ ] Keine Fehler gefunden

Bitte antworten Sie mit "Freigabe erteilt" oder listen Sie
benötigte Änderungen auf.

Bei Fragen stehe ich gerne zur Verfügung.

Beste Grüße,
Thomas
```

- [ ] Review email sent
- [ ] Client responded

### Handle Feedback

**Client feedback:**

1. ____________________
2. ____________________
3. ____________________

**Changes made:**

- [ ] Feedback 1 addressed
- [ ] Feedback 2 addressed
- [ ] Feedback 3 addressed
- [ ] New staging deployed
- [ ] Client approved final version

---

## Day 8-9: Launch

### Pre-Launch Checklist

- [ ] Client approval received
- [ ] All QA audits pass
- [ ] DNS instructions sent to client
- [ ] Client ready for DNS change

### DNS Configuration

**Send to client:**

```
Bitte fügen Sie diese DNS-Einträge bei Ihrem Domain-Anbieter hinzu:

Typ: A
Name: @
Wert: 76.76.21.21

Typ: CNAME
Name: www
Wert: cname.vercel-dns.com

Nach dem Hinzufügen dauert es bis zu 48 Stunden, bis die
Änderungen wirksam werden (meist schneller).
```

- [ ] DNS instructions sent
- [ ] Client confirms DNS updated
- [ ] DNS propagated (check with dig/nslookup)

### Production Deployment

```bash
# Deploy to production
vercel --prod

# Add custom domain
vercel domains add [client-domain].de
vercel domains add www.[client-domain].de
```

- [ ] Production deployed
- [ ] Custom domain added
- [ ] SSL certificate issued
- [ ] www redirect configured

### Post-Launch Verification

- [ ] Site loads on custom domain
- [ ] SSL works (https://)
- [ ] All pages load
- [ ] Forms work
- [ ] Emails send from correct domain
- [ ] Analytics tracking
- [ ] CRM receiving leads

---

## Day 10: Handoff

### Training Call

**Agenda (30 min):**

1. Walk through website (5 min)
2. How to request content changes (5 min)
3. CRM overview - viewing leads (10 min)
4. Questions (10 min)

- [ ] Call scheduled
- [ ] Call completed
- [ ] Client understands process

### Documentation Sent

- [ ] Login credentials (CRM, if applicable)
- [ ] How to request changes
- [ ] Emergency contact info
- [ ] Service agreement reminder
- [ ] First invoice/receipt

### Internal Wrap-Up

- [ ] Client marked as "Active" in CRM
- [ ] Project marked complete
- [ ] Time tracked
- [ ] Any learnings documented

---

## Project Sign-Off

**Client:** ____________________

**Package:** ____________________

**Domain:** ____________________

**Go-Live Date:** ____________________

**Build Duration:** ____ days

**QA Score:** ____/100

**Notes:**
```
[Any relevant notes about the project]
```

**Signed off by:** ____________________

**Date:** ____________________

---

**Built for Fabig Webdevelopment**
**Every Client. On Time. Exceeding Expectations.**
