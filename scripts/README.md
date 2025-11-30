# Scripts Dokumentation

## Twenty CRM Setup Scripts

### Deutsches Workspace-Template

Für **neue Kunden-Workspaces** das komplette deutsche Template anwenden:

```bash
npx tsx scripts/setup-german-workspace.ts
```

**Was wird konfiguriert:**
- Alle Objekt-Labels (People→Kontakte, Tasks→Aufgaben, Notes→Notizen, etc.)
- Alle Feld-Labels (Created at→Erstellt am, Status, Beschreibung, etc.)
- Task-Status-Optionen (To do→Zu erledigen, In progress→In Bearbeitung, Done→Erledigt)
- Opportunity-Pipeline (Neue Anfrage, In Bearbeitung, Termin vereinbart, Angebot gesendet, Kunde gewonnen)
- Custom Fields für Lead-Management (Lead-Bewertung, Einstufung, Dringlichkeit, DSGVO-Einwilligung)

**Voraussetzungen:**
```bash
# .env Datei muss enthalten:
TWENTY_CRM_API_URL=https://crm.fabig-suite.de
TWENTY_API_KEY=your_api_key_here
```

**Workflow für neue Kunden:**
1. Twenty Workspace erstellen
2. API Key in Settings → Developers generieren
3. `.env` mit URL und Key aktualisieren
4. `npx tsx scripts/setup-german-workspace.ts` ausführen
5. Fertig! CRM ist komplett auf Deutsch.

### Nur Custom Fields erstellen

```bash
npx tsx scripts/setup-twenty-crm.ts
```

Erstellt nur die Custom Fields für Lead-Management ohne die Übersetzungen.

---

# Image Generation Scripts

## Quick Start

### 1. Setup API Key

Add your Gemini API key to `.env.local`:

```bash
GOOGLE_GEMINI_API_KEY=your_key_here
```

Get your API key at: https://makersuite.google.com/app/apikey

### 2. Generate Images

#### Generate All Demo Images (Barber + Electrician)

```bash
npx tsx scripts/generate-demo-images.ts
```

**Generates:**
- 2 images for barber demo
- 8 images for electrician demo (persona-focused)
- **Total:** 10 images
- **Time:** 5-8 minutes
- **Cost:** ~$0.50-1.00

#### Generate Electrician Images Only

```bash
npx tsx scripts/generate-demo-images.ts --electrician-only
```

**Generates:**
- 8 professional, persona-focused images for Thomas Müller electrician demo
- **Time:** 4-6 minutes
- **Cost:** ~$0.40-0.80

**Output Files:**
```
public/demo-electrician/
├── electrician-hero.png              (Hero background image)
├── electrician-logo.png               (Company logo)
├── thomas-mueller-portrait.jpg        (Professional headshot)
├── thomas-mueller-at-work.jpg         (Action shot at installation)
├── thomas-mueller-consulting.jpg      (Meeting with clients)
├── smart-home-service.jpg             (Smart home showcase)
├── installation-service.jpg           (Electrical panel installation)
└── security-service.jpg               (Security system installation)
```

## What Makes These Images Special?

### Ultra-Detailed Prompts (300-500 words each)

Instead of generic prompts like:
> "Professional electrician installing smart home"

We use ultra-detailed prompts like:
> "Action shot of Thomas Müller, 42-year-old German master electrician, working on a Loxone smart home panel installation. Short dark brown hair with grey at temples, athletic build, wearing clean professional navy work shirt with VDE badge, using Wera screwdriver with Knipex pliers nearby. Modern German home with white walls and floor-to-ceiling windows. Shot on Nikon Z9, 35mm f/1.4 at f/2.2, editorial photojournalism style. Meister certificate blurred in background. Color-coded wiring visible (brown=L, blue=N, green-yellow=PE). Professional cable management with printed labels. Target emotion: 'Das ist kein Pfuscher - das ist ein echter Profi' (This is no hack - this is a real professional)"

**Result:** Professional-quality images that look like real project documentation, not stock photos.

## Documentation

Full documentation available in:

- **`docs/IMAGE_GENERATION.md`** - Complete system documentation
  - Prompt engineering strategies
  - Technical architecture
  - Troubleshooting guide
  - Cost estimation
  - How to add new image types

- **`docs/PROMPT_EXAMPLES.md`** - Prompt templates and examples
  - Reusable prompt blocks (copy-paste ready)
  - Annotated prompt examples
  - Quality checklist
  - Common mistakes to avoid

## Key Features

### 1. Persona Consistency

Thomas Müller looks the same across all images:
- 42 years old
- Short dark brown hair with grey at temples
- Athletic build from physical work
- Professional work attire with VDE badge

### 2. Technical Accuracy

- Real German brands (Loxone, KNX, Gira, Hager, Wera, Knipex, Fluke)
- Correct VDE wire color codes (Brown=L, Blue=N, Green-Yellow=PE)
- Professional tool usage and cable management
- German text on interfaces and labels

### 3. Cultural Context

- German Meister certifications (VDE badge, certificates)
- German emotional triggers ("Qualität", "Vertrauen", "Handwerk")
- German room names on smart home interfaces
- Target emotions written in German

### 4. Professional Photography

- Specific camera/lens specs (Canon EOS R5, Sony A7R V, Nikon Z9)
- Detailed lighting setups (key light angles, rim light, fill light)
- Color grading directions (warm tones, professional blues)
- Proper depth of field and composition

## Customization

### Generate Images for Different Persona

Edit `scripts/generate-demo-images.ts`:

```typescript
{
  id: 'plumber',
  name: 'Schmidt Sanitär',
  type: 'Sanitärinstallation',
  style: 'professional',
  ceo: {
    name: 'Klaus Schmidt',
    title: 'Geschäftsführer & Installateur-Meister',
  },
  services: [
    { id: 'bathroom', type: 'bathroom-renovation', filename: 'bathroom-service.jpg' },
    // Add more services
  ],
}
```

Then add corresponding prompts in `src/lib/gemini/image-generation.ts`.

### Add New Service Types

1. Add new service type to `generateServiceImage()` function
2. Write ultra-detailed prompt (300-500 words)
3. Follow prompt template structure (see `docs/PROMPT_EXAMPLES.md`)
4. Include all elements: appearance, environment, photography, psychology, exclusions

## Troubleshooting

### Error: "GOOGLE_GEMINI_API_KEY not found"

**Solution:** Add API key to `.env.local`:
```bash
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
```

### Error: "Rate limit exceeded"

**Solution:** Script includes delays. If still hitting limits:
- Wait 5 minutes and retry
- Generate one image type at a time
- Contact Google to increase quota

### Images Look Generic/Stock-Photo-Like

**Solution:** Prompts need more details:
1. Check prompt length (should be 300-500 words)
2. Add specific brand names (Loxone, Wera, Knipex)
3. Add CRITICAL exclusions section
4. Add target emotion in German
5. See `docs/PROMPT_EXAMPLES.md` for templates

### Thomas Looks Different in Each Image

**Solution:** Ensure consistent appearance block is in every prompt:
```typescript
Physical appearance (consistent):
- 42-year-old man, short dark brown hair with grey at temples
- Athletic build from physical work
- Clean-shaven or short stubble
```

Copy this block into all Thomas-related prompts.

## Cost Estimation

### Gemini 3 Pro Image Preview Pricing

- Per image: $0.05-0.10
- Full electrician set (8 images): $0.40-0.80
- Full demo batch (10 images): $0.50-1.00
- Monthly development: $5-10
- Per client production: $2-5

**Budget:** Allow 2-3x for regenerations/iterations during development.

## Next Steps

After generating images:

1. **Review Images**
   - Check for consistency (Thomas looks same across images)
   - Verify technical accuracy (wire colors, brands)
   - Confirm professional quality (not stock photo look)

2. **Update Image Paths**
   - Images are saved to `public/demo-electrician/`
   - Paths in demo page already match filenames
   - Verify images load correctly: `http://localhost:3000/demo/electrician`

3. **Optimize (Optional)**
   - Images generated at 2K resolution (already web-optimized)
   - Next.js `<Image>` component handles automatic optimization
   - No manual optimization needed

4. **Generate Variations (Optional)**
   - Run script multiple times
   - Pick best versions
   - Mix and match for variety

5. **Extend to Other Demos**
   - Copy electrician prompt structure
   - Adapt for other industries (plumber, HVAC, landscaping)
   - Maintain same quality standards

## Support

Questions or issues? Check documentation:

- `docs/IMAGE_GENERATION.md` - Full technical documentation
- `docs/PROMPT_EXAMPLES.md` - Prompt templates and examples

---

**Built by Thomas Fabig | Fabig Webdevelopment**
