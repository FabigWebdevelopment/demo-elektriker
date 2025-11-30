# Twenty CRM - Deutsche Workspace-Konfiguration

## Übersicht

Twenty CRM verwendet ein dreischichtiges System für Labels:

1. **`name`-Feld**: Technischer Name (z.B. `createdAt`) - unveränderbar, für API-Konsistenz
2. **`label`-Feld**: Basis-Label (z.B. "Creation date") - API gibt dieses zurück
3. **`standardOverrides.label`**: Benutzerdefiniertes Label (z.B. "Erstellt") - UI zeigt dieses an

### Wie es funktioniert

```
API-Abfrage eines Feldes:
{
  "name": "createdAt",           // Unveränderbar - technischer Name
  "label": "Creation date",       // Basis-Label (englisch)
  "standardOverrides": {
    "label": "Erstellt"           // ← UI zeigt dieses an!
  }
}
```

## Setup-Methoden

### Methode 1: Datenbank-Script (Empfohlen für Self-Hosted)

Für selbst gehostete Twenty CRM Instanzen (Docker) bietet das Datenbank-Script volle Kontrolle:

```bash
# Prüfen, was geändert werden muss
npx tsx scripts/twenty-db-setup.ts --check

# Änderungen anwenden
npx tsx scripts/twenty-db-setup.ts --apply
```

**Voraussetzungen:**
- `TWENTY_DATABASE_URL` in `.env` setzen (PostgreSQL Connection String)
- Beispiel: `postgresql://postgres:password@localhost:5432/twenty`

**Vorteile:**
- ✅ Kann Labels IMMER ändern (nicht nur einmal)
- ✅ Keine API-Limitationen
- ✅ Schneller als API
- ✅ Kann Fehler korrigieren

**Nach Änderungen:** Twenty CRM neu starten oder Redis Cache leeren!

### Methode 2: API-Script (Für neue Workspaces)

Für frische Workspaces ohne bestehende Konfiguration:

```bash
npx tsx scripts/setup-german-workspace.ts
```

**Voraussetzungen:**
- `TWENTY_CRM_API_URL` und `TWENTY_API_KEY` in `.env`

**KRITISCHE API-LIMITATION:**

Die Twenty CRM API hat eine undokumentierte Einschränkung bei `standardOverrides.label`:

1. Felder mit gleichem `name` (z.B. alle `createdAt`-Felder) können NICHT alle auf denselben Label-Wert gesetzt werden
2. Sobald ein Feld ein `standardOverrides.label` hat, kann es nur zu einem NEUEN (eindeutigen) Wert geändert werden
3. Das Setzen auf einen Label-Wert, der bereits bei einem anderen Feld mit gleichem Namen existiert, schlägt **silent** fehl

**Beispiel:**
- `person.createdAt` hat `standardOverrides.label = "Erstellt"` ✅
- `company.createdAt` auf `"Erstellt"` setzen → **FEHLSCHLAG** (behält alten Wert)
- `company.createdAt` auf `"EinzigartigerWert"` setzen → ✅ funktioniert

**Lösungen:**
1. **Frischer Workspace:** Alle Felder beim ERSTEN Setup korrekt setzen
2. **Database-Zugriff:** Für Self-Hosted mit direktem PostgreSQL-Zugriff
3. **UI:** Manuell über Twenty Settings > Data Model

## Was konfigurierbar ist

| Element | API | Datenbank | UI |
|---------|-----|-----------|-----|
| Objekt-Labels | ✅ Ja (mehrfach) | ✅ Ja | ✅ Ja |
| Field Labels (erstmalig) | ✅ Ja | ✅ Ja | ✅ Ja |
| Field Labels (ändern) | ❌ Nein | ✅ Ja | ✅ Ja |
| Status-Optionen | ✅ Ja | ✅ Ja | ✅ Ja |
| Custom Fields | ✅ Ja | ✅ Ja | ✅ Ja |

## Setup-Workflow für neue Kunden

### Schritt 1: Vollautomatische Konfiguration (Script)

```bash
npx tsx scripts/setup-german-workspace.ts
```

Das Script konfiguriert **alles automatisch**:
- ✅ Objekt-Labels (People → Kontakte, Tasks → Aufgaben, etc.)
- ✅ **Alle Standard-Feld-Labels** (createdAt → Erstellt, etc.)
- ✅ Status-Optionen (TODO → Zu erledigen, etc.)
- ✅ Custom Fields für Lead-Management

### Schritt 2: Ansichten konfigurieren (optional)

1. **Kanban-Ansichten** für Anfragen und Aufgaben erstellen
2. **Tabellenansichten** anpassen (Spalten sortieren)
3. **Filter** als Ansichten speichern

## Vollständige Feld-Übersetzungen

Das Setup-Script übersetzt automatisch folgende Felder:

### Allgemeine Felder (in fast allen Objekten)

| API-Name | Englisch | Deutsch |
|----------|----------|---------|
| createdAt | Creation date | Erstellt |
| updatedAt | Last update | Zuletzt aktualisiert |
| deletedAt | Deleted at | Gelöscht am |
| id | Id | ID |
| name | Name | Name |
| position | Position | Position |
| favorites | Favorites | Favoriten |
| attachments | Attachments | Anhänge |
| timelineActivities | Timeline Activities | Aktivitätsverlauf |
| searchVector | Search vector | (ausblenden) |

### Kontakte (person)

| API-Name | Englisch | Deutsch |
|----------|----------|---------|
| firstName | First name | Vorname |
| lastName | Last name | Nachname |
| emails | Emails | E-Mail-Adressen |
| phones | Phones | Telefonnummern |
| city | City | Stadt |
| jobTitle | Job Title | Position |
| company | Company | Unternehmen |
| linkedinLink | Linkedin | LinkedIn |
| xLink | X | X (Twitter) |
| avatarUrl | Avatar | Profilbild |

### Unternehmen (company)

| API-Name | Englisch | Deutsch |
|----------|----------|---------|
| domainName | Domain Name | Domain |
| address | Address | Adresse |
| employees | Employees | Mitarbeiter |
| annualRecurringRevenue | ARR | Jahresumsatz |
| idealCustomerProfile | ICP | Idealkunde |
| linkedinLink | Linkedin | LinkedIn |

### Anfragen (opportunity)

| API-Name | Englisch | Deutsch |
|----------|----------|---------|
| amount | Amount | Betrag |
| closeDate | Close date | Abschlussdatum |
| pointOfContact | Point of Contact | Ansprechpartner |
| stage | Stage | Status |
| notes | Notes | Notizen |
| tasks | Tasks | Aufgaben |

### Aufgaben (task)

| API-Name | Englisch | Deutsch |
|----------|----------|---------|
| title | Title | Titel |
| body | Body | Beschreibung |
| dueAt | Due Date | Fällig am |
| assignee | Assignee | Zugewiesen an |
| status | Status | Status |

### Automatisierungen (workflow)

| API-Name | Englisch | Deutsch |
|----------|----------|---------|
| versions | Versions | Versionen |
| runs | Runs | Ausführungen |
| statuses | Statuses | Status-Werte |
| createdBy | Created by | Erstellt von |
| automatedTriggers | Automated Triggers | Automatische Trigger |
| lastPublishedVersionId | Last published Version Id | Letzte veröffentlichte Version |

## API-Integration

### Leads erstellen

Beim Erstellen von Leads via API **immer englische Feldnamen** verwenden:

```typescript
// ✅ Korrekt - englische API-Namen
const lead = await createOpportunity({
  name: "Max Müller - Wallbox",
  stage: "NEW",           // Nicht "Neue Anfrage"
  amount: { amountMicros: 250000000, currencyCode: "EUR" },
  closeDate: "2025-02-15"
})

// ❌ Falsch - deutsche UI-Labels funktionieren nicht
const lead = await createOpportunity({
  name: "Max Müller",
  Status: "Neue Anfrage"  // Wird nicht erkannt
})
```

### Feld-Labels programmatisch aktualisieren

```typescript
// GraphQL Mutation - aktualisiert standardOverrides.label
const response = await fetch(`${baseUrl}/metadata`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: `
      mutation UpdateField($input: UpdateOneFieldMetadataInput!) {
        updateOneField(input: $input) {
          id
          name
          label
          standardOverrides { label }
        }
      }
    `,
    variables: {
      input: {
        id: fieldId,
        update: {
          label: 'Deutsches Label'
        }
      }
    }
  })
})

// Ergebnis:
// {
//   "label": "English Default",      // Bleibt unverändert
//   "standardOverrides": {
//     "label": "Deutsches Label"     // UI zeigt dieses an
//   }
// }
```

### Feldnamen-Referenz (API → UI)

| UI-Label (Deutsch) | API-Name (Englisch) |
|--------------------|---------------------|
| Erstellt | createdAt |
| Zuletzt aktualisiert | updatedAt |
| Gelöscht am | deletedAt |
| Vorname | firstName |
| Nachname | lastName |
| E-Mail-Adressen | emails |
| Telefonnummern | phones |
| Unternehmen | company |
| Status (Anfragen) | stage |
| Status (Aufgaben) | status |
| Betrag | amount |
| Abschlussdatum | closeDate |

## Tipps für konsistente Labels

### Do's ✅

- **Kurze Labels verwenden**: "Erstellt" statt "Erstellt am"
- **Konsistente Begriffe**: Immer "Unternehmen" (nicht mal "Firma")
- **Deutsche Umlaute**: ä, ö, ü, ß funktionieren einwandfrei

### Don'ts ❌

- Keine Sonderzeichen außer Umlauten
- Keine sehr langen Labels (> 25 Zeichen)
- Keine Emojis in Labels

## Workspace-Backup

### Für Self-Hosted (Docker)

```bash
# Datenbank-Backup erstellen
docker exec twenty-db-1 pg_dump -U postgres default > twenty_backup_$(date +%Y%m%d).sql

# Backup wiederherstellen
docker exec -i twenty-db-1 psql -U postgres default < twenty_backup_20250129.sql
```

### Für Cloud (app.twenty.com)

- Kein direkter DB-Zugriff
- Daten-Export nur als CSV/XLSX
- **Lösung:** Setup-Script erneut ausführen nach Workspace-Reset

## Technische Details

### StandardOverrides-Struktur

```typescript
// Für Objekte
interface ObjectStandardOverrides {
  labelSingular?: string
  labelPlural?: string
  description?: string
  icon?: string
  translations?: Record<string, unknown>
}

// Für Felder
interface StandardOverrides {
  label?: string
  description?: string
  icon?: string
  translations?: Record<string, unknown>
}
```

### Warum dieses System?

Twenty trennt bewusst zwischen:
- **Technische Stabilität**: `name` bleibt immer gleich für API-Integrationen
- **UI-Flexibilität**: `standardOverrides.label` kann beliebig angepasst werden
- **Mehrsprachigkeit**: `translations`-Feld für zukünftige i18n-Unterstützung

## Weiterführende Ressourcen

- [Twenty Dokumentation](https://docs.twenty.com)
- [Twenty GitHub](https://github.com/twentyhq/twenty)
- [API Playground](https://docs.twenty.com/developers/api-and-webhooks/api)
- [Crowdin Übersetzungen](https://twenty.crowdin.com/)
