# Image Selection Workflow

> **CRITICAL: This workflow is MANDATORY before selecting ANY image**
>
> Filename ≠ Content. Always verify in IMAGE_CATALOG.md.

---

## The Golden Rules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         IMAGE SELECTION RULES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  RULE 1: NEVER guess from filename                                          │
│          "smart-home-tablet.webp" might show a kitchen, not a tablet!       │
│                                                                             │
│  RULE 2: ALWAYS check IMAGE_CATALOG.md                                      │
│          Read the "What it actually shows" column                           │
│                                                                             │
│  RULE 3: UNIQUE images per page                                             │
│          Same image cannot appear twice on any page                         │
│                                                                             │
│  RULE 4: Image MUST match section purpose                                   │
│          Hero = outcome, Benefits = lifestyle, Process = hands              │
│                                                                             │
│  RULE 5: Generate if nothing fits                                           │
│          Better to generate than use wrong image                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Workflow

### Step 1: Identify Image Need

Before looking at any images, define what you need:

```markdown
## IMAGE REQUIREMENT

Section: [Section name]
Purpose: [Psychological purpose of this section]
Type: [hero | benefit | process | cta | service]
Must Show: [Specific content that must be visible]
Mood: [Emotional tone needed]
Aspect Ratio: [16:9 | 4:3 | 1:1 | 3:2]
```

**Example:**
```markdown
## IMAGE REQUIREMENT

Section: Hero
Purpose: Stop scrolling, show competence + trustworthiness
Type: hero
Must Show: Professional electrician environment, modern equipment, quality work
Mood: Professional, warm, trustworthy
Aspect Ratio: 16:9
```

---

### Step 2: Open IMAGE_CATALOG.md

**Location:** `/docs/IMAGE_CATALOG.md`

**CRITICAL:** Do NOT skip this step. Ever.

The catalog contains:
- **Filename**: What the file is called (UNRELIABLE!)
- **What it actually shows**: Detailed description (THIS IS TRUTH)
- **Use For**: Recommended uses
- **NOT For**: Where NOT to use it
- **Object Position**: CSS positioning hints

---

### Step 3: Search by DESCRIPTION, Not Filename

**WRONG approach:**
```
Need image for "Smart Home" section
→ Search for files with "smart-home" in name
→ Pick "smart-home-tablet-control.webp"
→ WRONG! This might show something completely different!
```

**RIGHT approach:**
```
Need image for "Smart Home" section
→ Open IMAGE_CATALOG.md
→ Read the "What it actually shows" column
→ Find image that ACTUALLY matches need
→ Verify with "Use For" column
→ Check "NOT For" to avoid misuse
```

---

### Step 4: Create Image Map

For EVERY page, create an image map before writing code:

```markdown
## IMAGE MAP: [Page Name]

| Section | Filename | Actual Content | Matches Purpose? | Unique? |
|---------|----------|----------------|------------------|---------|
| Hero | xxx.webp | [from catalog] | ✓ Yes | ✓ |
| Benefit 1 | yyy.webp | [from catalog] | ✓ Yes | ✓ |
| Benefit 2 | zzz.webp | [from catalog] | ✓ Yes | ✓ |
| Benefit 3 | aaa.webp | [from catalog] | ✓ Yes | ✓ |
| Benefit 4 | bbb.webp | [from catalog] | ✓ Yes | ✓ |
| Process 1 | ccc.webp | [from catalog] | ✓ Yes | ✓ |
| Process 2 | ddd.webp | [from catalog] | ✓ Yes | ✓ |
| Process 3 | eee.webp | [from catalog] | ✓ Yes | ✓ |
| CTA | fff.webp | [from catalog] | ✓ Yes | ✓ |

### Uniqueness Check:
All filenames unique: ✓ Yes

### Missing Images (Need to Generate):
- [List any sections where no catalog image fits]
```

---

### Step 5: Validate Before Using

For each image selection, answer these questions:

```
□ Did I check IMAGE_CATALOG.md? (Not just filename)
□ Does the actual content match my section's purpose?
□ Is this image NOT used elsewhere on this page?
□ Is this image NOT used on other main pages?
□ Does the mood match my Visual DNA?
□ Is the aspect ratio correct?
□ Did I note the object-position hint?
```

If ANY answer is NO → Go back to Step 3

---

### Step 6: Handle Missing Images

If no catalog image fits your need:

**Option A: Generate New Image**

1. Document the requirement:
```markdown
## IMAGE GENERATION NEEDED

Section: [section]
Requirement: [what must be shown]
Visual DNA: [from research]
Aspect Ratio: [ratio]

PROMPT:
[Full generation prompt using Visual DNA base]
```

2. Generate using `/api/generate-image` or scripts
3. Add to catalog after generation

**Option B: Deprioritize Visual**

Consider if this section needs an image at all:
- Can it use icons instead?
- Can it use a chart instead?
- Is the copy strong enough without image?

---

## Image Type Guidelines

### Hero Images

**Purpose:** Stop scrolling, establish brand
**Must Show:** Outcome, lifestyle, or professional environment
**Never Show:** Generic stock, busy scenes, faces
**Aspect Ratio:** 16:9 or 4:3
**Examples:**
- Charged EV in driveway at golden hour
- Smart home living room with ambient lighting
- Modern electrical panel (clean, professional)

### Benefit Images

**Purpose:** Visualize life AFTER getting benefit
**Must Show:** The RESULT, not the product
**Never Show:** The product itself, technical details
**Aspect Ratio:** 4:3
**Examples:**
- Morning coffee while car charges (freedom)
- Family relaxed in smart home (comfort)
- Low energy bill on phone (savings)

**CRITICAL:** 4 benefits = 4 DIFFERENT images

### Process Step Images

**Purpose:** Show professional work in progress
**Must Show:** Expert hands, professional tools
**Never Show:** Faces, messy work areas
**Aspect Ratio:** 4:3 or 1:1
**Examples:**
- Hands pointing at floor plan
- Hands wiring with Wera tools visible
- Hands configuring tablet/app

### Service Images

**Purpose:** Represent specific service category
**Must Show:** Service outcome or environment
**Never Show:** Generic tech images
**Aspect Ratio:** 4:3 or 1:1
**Examples:**
- Loxone Miniserver (for Loxone service)
- KNX switch panel (for KNX service)
- Wallbox installation (for E-Mobility)

### CTA Images

**Purpose:** Trust-building, push toward action
**Must Show:** Professional, trustworthy scene
**Never Show:** Pushy, salesy imagery
**Aspect Ratio:** 4:3
**Examples:**
- Team in front of company van
- Professional workspace
- Customer handshake (if no faces, just hands)

---

## Common Mistakes to Avoid

### Mistake 1: Assuming Filename = Content

```
❌ WRONG:
"I need a smart home image, I'll use smart-home-service.webp"

✓ RIGHT:
"I need a smart home image. Let me check IMAGE_CATALOG.md to see what
smart-home-service.webp actually shows... it shows [actual content].
Does that match what I need? [Yes/No]"
```

### Mistake 2: Reusing Images

```
❌ WRONG:
Hero: smart-home-tablet.webp
Benefit 1: smart-home-tablet.webp  ← DUPLICATE!

✓ RIGHT:
Hero: smart-home-hero.webp
Benefit 1: smart-home-morning.webp
Benefit 2: smart-home-app.webp
Benefit 3: smart-home-voice.webp
Benefit 4: smart-home-blinds.webp
All different!
```

### Mistake 3: Using Generic Stock Feel

```
❌ WRONG:
"A happy family looking at a tablet" → Stock photo vibes

✓ RIGHT:
"Hands holding iPhone with Loxone app visible, ambient lighting
in background" → Specific, editorial, matches Visual DNA
```

### Mistake 4: Wrong Image Type for Section

```
❌ WRONG:
Benefits section → Product photos (Miniserver, switches)
This is FEATURE thinking, not BENEFIT thinking!

✓ RIGHT:
Benefits section → Lifestyle outcomes
"Morning routine automated" → Bedroom with sunrise through opening blinds
"Energy savings" → Relaxed person with low energy bill on phone
```

---

## Image Map Template

Copy this template for every page:

```markdown
# IMAGE MAP: [Page Name]

## Date: [Date]
## Visual DNA Reference: [Link to visual DNA doc]

---

## Section 1: Hero

**Requirement:**
- Type: Hero
- Must Show: [specific requirement]
- Mood: [emotional tone]
- Aspect Ratio: 16:9

**Selection:**
- Filename: [xxx.webp]
- Catalog Description: [paste from IMAGE_CATALOG.md]
- Use For: [paste from catalog]
- NOT For: [paste from catalog]
- Object Position: [from catalog]

**Validation:**
- [x] Checked IMAGE_CATALOG.md
- [x] Content matches purpose
- [x] Unique on page
- [x] Mood matches Visual DNA
- [x] Aspect ratio correct

---

## Section 2: Benefit 1

[Repeat structure...]

---

## Section 3: Benefit 2

[Repeat structure...]

---

[Continue for all image sections...]

---

## Summary

| Section | Image | Status |
|---------|-------|--------|
| Hero | xxx.webp | ✓ Selected |
| Benefit 1 | yyy.webp | ✓ Selected |
| Benefit 2 | zzz.webp | ✓ Selected |
| Benefit 3 | aaa.webp | ✓ Selected |
| Benefit 4 | ⚠️ GENERATE | Need generation |
| Process 1 | bbb.webp | ✓ Selected |
| Process 2 | ccc.webp | ✓ Selected |

## Images to Generate

### Image: benefit-4-[description].webp

**Requirement:** [what it needs to show]
**Visual DNA Application:**
- Lighting: [from Visual DNA]
- Environment: [from Visual DNA]
- Mood: [from Visual DNA]

**Generation Prompt:**
```
[Full prompt...]
```
```

---

## Automation: Image Selection Agent

When running the image-generation agent, use this context:

```markdown
## IMAGE SELECTION TASK

Page: [Page name]
Visual DNA: [paste Visual DNA summary]

### Sections Needing Images:

1. Hero
   - Purpose: [purpose]
   - Must Show: [requirement]

2. Benefit 1
   - Purpose: [purpose]
   - Must Show: [requirement]

[etc...]

### Available Images:
[Paste relevant section from IMAGE_CATALOG.md]

### Instructions:
1. For each section, find best match from catalog
2. Verify actual content matches purpose (not filename!)
3. Ensure no duplicates
4. Flag any sections needing new generation
5. Output complete Image Map
```

---

## Quality Checklist

Before finalizing any page's images:

```
CATALOG VERIFICATION
□ Every image was looked up in IMAGE_CATALOG.md
□ "What it actually shows" column was read
□ "Use For" column confirms appropriate usage
□ "NOT For" column was checked for warnings

UNIQUENESS
□ No image appears twice on this page
□ Hero image is unique across site (not on homepage AND service page)
□ Benefit images are all different from each other

PURPOSE ALIGNMENT
□ Hero shows OUTCOME, not product
□ Benefits show LIFESTYLE, not features
□ Process shows HANDS AT WORK, not faces
□ All images match the section's psychological purpose

VISUAL CONSISTENCY
□ All images follow the Visual DNA (lighting, mood, style)
□ No jarring style differences between sections
□ German aesthetic maintained (not American stock photos)

TECHNICAL
□ Aspect ratios are correct for each section
□ Object-position hints are noted
□ File sizes are optimized (<200KB)
```

---

**Built for Fabig Webdevelopment**
**Never Guess. Always Verify.**
