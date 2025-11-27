# Repository Split Migration Guide

> **Goal:** Transform the current monolithic `website-builder` repo into a multi-repo architecture
>
> **Timeline:** Execute when ready to scale beyond demo phase

---

## Current State

```
website-builder/                    # Current monolithic repo
├── src/
│   ├── app/
│   │   ├── page.tsx               # Root page (placeholder)
│   │   ├── demo/
│   │   │   ├── electrician/       # Demo electrician site
│   │   │   └── barber/            # Demo barber site
│   │   └── api/                   # API routes
│   │
│   ├── components/
│   │   ├── demo/                  # Demo-specific components
│   │   ├── ui/                    # shadcn/ui components
│   │   └── [feature components]   # Hero, CTA, etc.
│   │
│   └── config/
│       ├── demo.config.ts         # Demo mode settings
│       ├── clients/               # Client configs
│       └── themes/                # Theme configs
│
├── scripts/
│   ├── apply-config.ts            # Client config generator
│   └── generate-*.ts              # Image generation scripts
│
└── docs/                          # All documentation
```

---

## Target State

```
GitHub: fabig-webdevelopment/
│
├── fabig-agency/                  # Agency marketing site
│   └── fabig.website
│
├── demo-electrician/              # Demo: Electrician industry
│   └── demo-electrician.fabig.website
│
├── demo-barber/                   # Demo: Barber industry
│   └── demo-barber.fabig.website
│
├── demo-restaurant/               # Demo: Restaurant industry
│   └── demo-restaurant.fabig.website
│
├── client-mueller-elektrik/       # Client: Mueller
│   └── mueller-elektrik.de
│
└── client-[more]/                 # More clients...
```

---

## Migration Steps

### Phase 1: Prepare Current Repo

**1.1 Verify Demo Mode System**

```bash
# Ensure demo components respect DEMO_MODE
# Should already be done - verify in:
cat src/config/demo.config.ts
cat src/components/demo/DemoLayout.tsx
```

**Expected:** All demo components check `DEMO_MODE` before rendering.

**1.2 Test Demo Mode Toggle**

```bash
# Test with demo mode ON
echo "NEXT_PUBLIC_DEMO_MODE=true" >> .env.local
npm run dev
# Verify: Demo banner, badge, footer CTA visible

# Test with demo mode OFF
echo "NEXT_PUBLIC_DEMO_MODE=false" > .env.local
npm run dev
# Verify: No demo components visible
```

**1.3 Verify apply-config Script**

```bash
# Test the config transformation
npx tsx scripts/apply-config.ts --data=scripts/sample-onboarding-data.json
```

---

### Phase 2: Create Demo Template

**2.1 Create Template Repository**

```bash
# On GitHub: Create new repo
gh repo create fabig-webdevelopment/demo-template --private --description "Base template for industry demos"

# Clone locally
cd ~/projects
git clone https://github.com/fabig-webdevelopment/demo-template
cd demo-template
```

**2.2 Copy Core Files from website-builder**

```bash
# From website-builder, copy:
cp -r src/components demo-template/src/
cp -r src/config demo-template/src/
cp -r src/lib demo-template/src/
cp -r src/hooks demo-template/src/
cp -r src/providers demo-template/src/
cp -r src/types demo-template/src/
cp -r scripts demo-template/
cp -r public demo-template/

# Copy config files
cp package.json demo-template/
cp tsconfig.json demo-template/
cp tailwind.config.ts demo-template/
cp next.config.ts demo-template/
cp postcss.config.mjs demo-template/
cp components.json demo-template/
cp .eslintrc.json demo-template/
cp .gitignore demo-template/
```

**2.3 Create Template App Structure**

```bash
# Create app directory with placeholder structure
mkdir -p demo-template/src/app

# Create root layout
cat > demo-template/src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { DemoLayout } from '@/components/demo/DemoLayout'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Demo Template',
  description: 'Template for industry demos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider>
          <DemoLayout showFooterCTA>
            {children}
          </DemoLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
EOF
```

**2.4 Set Demo Mode Default**

```bash
# Create .env.example for demos
cat > demo-template/.env.example << 'EOF'
# Demo Mode - ENABLED for demo sites
NEXT_PUBLIC_DEMO_MODE=true

# CRM - FABIG WORKSPACE (demos send leads to your CRM)
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY=your_key_here
TWENTY_WORKSPACE_ID=fabig-main

# Email - YOUR domain
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=demo@fabig.website
EOF
```

**2.5 Update package.json**

```json
{
  "name": "demo-template",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "apply-config": "tsx scripts/apply-config.ts",
    "generate-images": "tsx scripts/generate-demo-images.ts"
  }
}
```

**2.6 Commit and Push**

```bash
cd demo-template
git add .
git commit -m "feat: Initial demo template setup"
git push origin main
```

---

### Phase 3: Create First Demo Repo

**3.1 Create demo-electrician from Template**

```bash
# Create repo from template
gh repo create fabig-webdevelopment/demo-electrician \
  --template fabig-webdevelopment/demo-template \
  --private

# Clone it
git clone https://github.com/fabig-webdevelopment/demo-electrician
cd demo-electrician
```

**3.2 Copy Electrician-Specific Content**

```bash
# From website-builder, copy electrician pages
cp -r ../website-builder/src/app/demo/electrician/* src/app/

# Copy electrician images
cp -r ../website-builder/public/demo-electrician/* public/images/
```

**3.3 Update Configuration**

```bash
# Keep the demo-electrician config as primary
# Update src/config/clients/index.ts to export demoElectricianConfig
```

**3.4 Create .env.local**

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_DEMO_MODE=true
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY=eyJ...your_key
TWENTY_WORKSPACE_ID=fabig-main
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=demo@fabig.website
EOF
```

**3.5 Test Locally**

```bash
npm install
npm run dev
# Visit http://localhost:3000
# Verify: Demo components visible, site works
```

**3.6 Deploy to Vercel**

```bash
# Link to Vercel
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_DEMO_MODE production
# ... add all env vars

# Deploy
vercel --prod

# Add custom domain
vercel domains add demo-electrician.fabig.website
```

---

### Phase 4: Create Agency Repo

**4.1 Create fabig-agency Repository**

```bash
gh repo create fabig-webdevelopment/fabig-agency \
  --private \
  --description "Fabig Webdevelopment agency website"

git clone https://github.com/fabig-webdevelopment/fabig-agency
cd fabig-agency
```

**4.2 Initialize Next.js Project**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**4.3 Build Agency Pages**

Create the following pages:
- `/` - Landing page with value proposition
- `/leistungen` - Services offered
- `/portfolio` - Links to demo sites
- `/preise` - Pricing tiers
- `/ueber-uns` - About Thomas
- `/kontakt` - Contact form
- `/onboarding/[client-id]` - Client onboarding funnel

**4.4 Configure for Agency**

```bash
# .env.local - Agency config
cat > .env.local << 'EOF'
# Agency site - NO demo mode
NEXT_PUBLIC_DEMO_MODE=false

# YOUR CRM workspace
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY=eyJ...
TWENTY_WORKSPACE_ID=fabig-main

# YOUR email domain
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=info@fabig.website

# Google Drive for onboarding data
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_DRIVE_FOLDER_ID=xxx
EOF
```

**4.5 Deploy**

```bash
vercel link
vercel --prod
vercel domains add fabig.website
```

---

### Phase 5: Client Creation Workflow

When you win a new client, follow this process:

**5.1 Clone from Appropriate Demo**

```bash
# Example: New electrician client
git clone https://github.com/fabig-webdevelopment/demo-electrician client-mueller-elektrik
cd client-mueller-elektrik

# Reset git history
rm -rf .git
git init
```

**5.2 Apply Client Configuration**

```bash
# Copy onboarding data from Google Drive
# Usually at: /Clients/Mueller Elektrik 2025-01-15/onboarding-data.json
cp ~/Google\ Drive/Clients/Mueller\ Elektrik\ 2025-01-15/onboarding-data.json ./client-data/

# Run apply-config
npx tsx scripts/apply-config.ts --data=./client-data/onboarding-data.json
```

**5.3 Upload Client Assets**

```bash
# Copy logo
cp ~/Google\ Drive/Clients/Mueller\ Elektrik\ 2025-01-15/logo.png public/images/logo.png

# Copy team photos
cp ~/Google\ Drive/Clients/Mueller\ Elektrik\ 2025-01-15/team/*.jpg public/images/team/
```

**5.4 Regenerate Images (Optional)**

```bash
# If client wants custom hero/benefit images
npm run generate-images
```

**5.5 Create GitHub Repo**

```bash
git add .
git commit -m "feat: Initial setup for Mueller Elektrik"
gh repo create fabig-webdevelopment/client-mueller-elektrik --private
git remote add origin https://github.com/fabig-webdevelopment/client-mueller-elektrik
git push -u origin main
```

**5.6 Setup CRM Workspace**

1. Log into Twenty CRM
2. Create new workspace: `client-mueller-elektrik`
3. Generate API key
4. Update `.env.local` with new credentials

**5.7 Setup Email Domain**

1. Log into Resend
2. Add domain: `mueller-elektrik.de`
3. Get DNS records
4. Send to client for DNS configuration
5. Verify domain
6. Update `.env.local` with verified domain

**5.8 Deploy to Vercel**

```bash
vercel link
vercel env add TWENTY_API_KEY production
vercel env add TWENTY_WORKSPACE_ID production
vercel env add RESEND_API_KEY production
# ... all env vars

# Deploy to staging
vercel

# After client approval
vercel --prod
vercel domains add mueller-elektrik.de
```

---

### Phase 6: Archive Old Repo

**6.1 Final Backup**

```bash
# Create final backup of website-builder
cd ~/projects
tar -czf website-builder-archive-$(date +%Y%m%d).tar.gz website-builder/
```

**6.2 Archive on GitHub**

```bash
# Archive the old repo (keep for reference)
gh repo edit fabig-webdevelopment/website-builder --archived
```

---

## Verification Checklist

### Demo Template Ready
- [ ] All components copied and working
- [ ] Demo mode toggle functional
- [ ] apply-config script works
- [ ] Image generation scripts work
- [ ] README.md with setup instructions

### Demo Sites Ready
- [ ] demo-electrician deployed and working
- [ ] demo-barber deployed and working
- [ ] Demo components visible
- [ ] Forms send to YOUR CRM
- [ ] Links back to agency site

### Agency Site Ready
- [ ] fabig.website deployed
- [ ] Links to all demo sites
- [ ] Pricing page complete
- [ ] Contact form works
- [ ] Onboarding funnel ready

### Client Workflow Tested
- [ ] Successfully created test client from demo
- [ ] apply-config works end-to-end
- [ ] CRM workspace creation documented
- [ ] Email domain setup documented
- [ ] Vercel deployment process tested

---

## Quick Reference Commands

```bash
# Create new demo from template
gh repo create fabig-webdevelopment/demo-[industry] \
  --template fabig-webdevelopment/demo-template --private

# Create client from demo
git clone https://github.com/fabig-webdevelopment/demo-[industry] client-[name]
cd client-[name]
rm -rf .git && git init
npx tsx scripts/apply-config.ts --data=./onboarding-data.json

# Deploy to Vercel
vercel link
vercel --prod
vercel domains add [domain]
```

---

## Rollback Plan

If migration fails:

1. **Keep website-builder active** until all demos are verified
2. **Don't delete** - archive instead
3. **Test each demo** before going live
4. **Keep DNS records** pointing to old deployments until verified

---

**Migration Author:** Claude (AI Assistant)
**Last Updated:** ${new Date().toISOString().split('T')[0]}
**Status:** Ready for execution

---

**Built for Fabig Webdevelopment**
**From Monolith to Multi-Repo Excellence**
