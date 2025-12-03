# Twenty CRM - Setup Guide

## Overview

Das CRM-Setup ist zweigeteilt:

| Teil | Methode | Was wird eingerichtet |
|------|---------|----------------------|
| **Automatisch** | `npm run setup:crm` | Objekte, Felder, Labels, Status-Optionen |
| **Manuell** | Twenty UI | Views, Workflows mit Formularen |

---

## Teil 1: Automatisches Setup

### Voraussetzungen

1. Twenty CRM Workspace erstellt
2. API Key generiert (Settings → Developers → API Keys)
3. `.env` konfiguriert:

```env
TWENTY_CRM_API_URL=https://crm.kundenname.de/rest
TWENTY_API_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Setup ausführen

```bash
npm run setup:crm
# oder
npx tsx scripts/setup-crm.ts
```

### Was wird automatisch eingerichtet

#### 1. Deutsche Objekt-Labels
| Objekt | Vorher | Nachher |
|--------|--------|---------|
| person | Person | Kontakt |
| company | Company | Unternehmen |
| opportunity | Opportunity | Anfrage |
| task | Task | Aufgabe |
| note | Note | Notiz |

#### 2. Pipeline-Stufen (Anfragen)
| Value | Label | Farbe |
|-------|-------|-------|
| NEW | Neue Anfrage | Blau |
| SCREENING | In Bearbeitung | Gelb |
| MEETING | Termin vereinbart | Orange |
| PROPOSAL | Angebot gesendet | Lila |
| CUSTOMER | Kunde gewonnen | Grün |

#### 3. Task-Status
| Value | Label | Farbe |
|-------|-------|-------|
| TODO | Zu erledigen | Hellblau |
| IN_PROGRESS | In Bearbeitung | Lila |
| DONE | Erledigt | Grün |

#### 4. Custom Fields - Anfrage (Opportunity)
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| leadScore | Number | Automatische Bewertung (0-100) |
| leadClassification | Select | 🔥 Heiß / 🌡️ Warm / 📊 Potentiell / 🌱 Langfristig |
| funnelSource | Select | Smart Home / Elektro / Sicherheit / Wallbox / Notdienst |
| estimatedValue | Currency | Geschätzter Auftragswert |
| urgency | Select | Dringend / Bald / Geplant / Flexibel |

#### 5. Custom Fields - Kontakt (Person)
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| gdprConsent | Boolean | DSGVO-Einwilligung |
| preferredContact | Select | Telefon / WhatsApp / E-Mail |

#### 6. Custom Fields - Aufgabe (Task)
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| anrufStatus | Select | Ausstehend / Erreicht / Nicht erreicht / Termin / Kein Interesse |
| termin | Text | Termindetails (z.B. "15.12.2024 14:00") |
| terminDatum | Date | Datum des Termins |
| terminUhrzeit | Text | Uhrzeit (z.B. "14:00") |

---

## Teil 2: Manuelles Setup (Views & Workflows)

### Views erstellen

#### View 1: 💼 Pipeline (Anfragen)

1. Klicke **Anfragen** in der Sidebar
2. Klicke View-Dropdown → **"+ Add view"**
3. Name: `💼 Pipeline`
4. Type: **Kanban**
5. Gruppiert nach: `stage`

#### View 2: 📞 Rückrufe Heute (Aufgaben)

1. Klicke **Aufgaben** in der Sidebar
2. Klicke View-Dropdown → **"+ Add view"**
3. Name: `📞 Rückrufe Heute`
4. Type: **Table**
5. Filter hinzufügen: `status` = `Zu erledigen`
6. Spalten: `title`, `status`, `dueAt`, `anrufStatus`
7. Sortierung: `dueAt` aufsteigend

#### View 3: 📅 Termine Heute (Aufgaben)

1. Bleibe in **Aufgaben**
2. Klicke View-Dropdown → **"+ Add view"**
3. Name: `📅 Termine Heute`
4. Type: **Table**
5. Filter hinzufügen: `terminDatum` = `heute`
6. Spalten: `title`, `terminDatum`, `terminUhrzeit`, `anrufStatus`
7. Sortierung: `terminUhrzeit` aufsteigend

#### View 4: 🔥 Heiße Leads (Anfragen)

1. Klicke **Anfragen** in der Sidebar
2. Klicke View-Dropdown → **"+ Add view"**
3. Name: `🔥 Heiße Leads`
4. Type: **Table**
5. Filter: `stage` = `Neue Anfrage`
6. Spalten: `name`, `stage`, `leadClassification`, `createdAt`

---

### Workflow erstellen: Termin buchen

Dieser Workflow ermöglicht es, nach einem erfolgreichen Anruf einen Termin zu buchen und automatisch eine Bestätigungs-E-Mail zu senden.

#### Schritt 1: Workflow anlegen

1. Gehe zu **Settings** → **Workflows**
2. Klicke **"+ New Workflow"**
3. Name: `Termin buchen`

#### Schritt 2: Trigger konfigurieren

1. Trigger Type: **Manual**
2. Record Type: **Task** (Aufgabe)

Der Workflow wird über `Cmd+K` → "Termin buchen" ausgelöst.

#### Schritt 3: Formular hinzufügen

1. Klicke **"+ Add Step"** → **Form**
2. Füge Feld hinzu:
   - Label: `Termin`
   - Field: `termin` (Text)
   - Placeholder: `15.12.2024 14:00`

#### Schritt 4: Webhook hinzufügen

1. Klicke **"+ Add Step"** → **Webhook**
2. Konfiguration:
   - Method: `POST`
   - URL: `https://[DEINE-DOMAIN]/api/call-status`
   - Headers:
     ```
     Content-Type: application/json
     ```
   - Body:
     ```json
     {
       "opportunityId": "{{record.taskTargets[0].opportunityId}}",
       "personId": "{{record.taskTargets[0].personId}}",
       "status": "APPOINTMENT",
       "termin": "{{formData.termin}}"
     }
     ```

#### Schritt 5: Aktivieren

1. Klicke **"Publish"** oben rechts
2. Workflow ist jetzt aktiv

---

## Täglicher Workflow für Business Owner

### Morgen-Routine

1. **📞 Rückrufe Heute** öffnen
   - Zeigt alle neuen Leads, die heute angerufen werden müssen
   - Nach Priorität (dueAt) sortiert

2. Für jeden Lead:
   - Klicke auf Task
   - Rufe Kunden an
   - Aktualisiere `anrufStatus`:
     - ✅ Erreicht → Notiz hinzufügen
     - 📅 Termin vereinbart → `Cmd+K` → "Termin buchen"
     - 📵 Nicht erreicht → Task bleibt offen
     - 🔄 Rückruf gewünscht → neues Datum setzen

3. **📅 Termine Heute** prüfen
   - Zeigt alle Termine für heute
   - Nach Uhrzeit sortiert

### Lead-Übersicht

- **💼 Pipeline**: Kanban-Ansicht aller Anfragen
- **🔥 Heiße Leads**: Neue, unbearbeitete Anfragen

---

## Troubleshooting

### API Key funktioniert nicht

```
Error: API Error 401: Unauthorized
```

**Lösung**: Neuen API Key generieren:
1. Twenty CRM → Settings → Developers
2. API Keys → Create new key
3. In `.env` eintragen

### Felder existieren bereits

```
⏭️ Lead-Bewertung existiert bereits
```

Das ist normal - das Setup überspringt existierende Felder.

### Webhook wird nicht aufgerufen

1. Prüfe ob Workflow aktiv ist (grüner Status)
2. Prüfe URL in Workflow-Einstellungen
3. Prüfe Next.js Logs für eingehende Requests

---

## Referenz

### API Endpoints

| Zweck | Endpoint |
|-------|----------|
| Objekte | `/metadata/objects` |
| Felder | `/metadata/fields` |
| Views | `/metadata/views` |
| Webhooks | `/webhooks` |

### Webhook Payload (von Twenty)

```json
{
  "record": {
    "id": "task-uuid",
    "title": "Rückruf: Max Mustermann",
    "taskTargets": [
      {
        "personId": "person-uuid",
        "opportunityId": "opportunity-uuid"
      }
    ]
  },
  "formData": {
    "termin": "15.12.2024 14:00"
  }
}
```
