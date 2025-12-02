# Twenty CRM Workflow: Anruf-Tracking

Diese Anleitung beschreibt das **einfache Anruf-Tracking System** für Twenty CRM.

## Das Prinzip

**Zwei Workflows. Ein Status-Dropdown. Automatische E-Mails & Stage-Updates.**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ANRUF-TRACKING SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  WORKFLOW 1: Status-Änderungen (Automatisch)                                │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  📵 Nicht erreicht (1/2/3) → E-Mail an Kunden                          │ │
│  │  ❌ Kein Interesse         → Stage → VERLOREN                          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  WORKFLOW 2: Termin buchen (Manuell via Cmd+K)                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  📅 Termin buchen          → Formular (Datum/Zeit) → Kalender + E-Mail │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Opportunity Stages (5 Stufen)

Der Lead durchläuft automatisch diese Stages:

```
NEUE_ANFRAGE ─────┬────────────────────────────────────────▶ VERLOREN
(Lead erstellt)   │                                            ▲
                  │                                            │
                  ▼                                            │
              FOLLOW_UP ───────────────────────────────────────┤
            (E-Mails gesendet)                                 │
                  │                                            │
                  │                                            │
                  ▼                                            │
          TERMIN_VEREINBART ───────────────────────────────────┤
            (Termin gebucht)                                   │
                  │                                            │
                  ▼                                            │
           KUNDE_GEWONNEN
            (Deal gewonnen)
```

| Stage | Bedeutung | Wie erreicht |
|-------|-----------|--------------|
| NEUE_ANFRAGE | Frischer Lead | Automatisch bei Funnel-Eingang |
| FOLLOW_UP | E-Mails wurden gesendet | Automatisch bei "Nicht erreicht (1)" |
| TERMIN_VEREINBART | Termin steht | Automatisch bei "Termin vereinbart" |
| KUNDE_GEWONNEN | Deal abgeschlossen | Manuell durch Inhaber |
| VERLOREN | Kein Abschluss | Automatisch bei "Kein Interesse" oder 3x nicht erreicht |

---

## Task Status-Optionen (6 Optionen)

| Status | Was passiert automatisch |
|--------|-------------------------|
| 📋 **Neu** | Initaler Status, keine Aktion |
| 📵 **Nicht erreicht (1)** | E-Mail #1 an Kunden, Stage → FOLLOW_UP |
| 📵 **Nicht erreicht (2)** | E-Mail #2 an Kunden |
| 📵 **Nicht erreicht (3)** | E-Mail #3 (letzte Chance), Stage → VERLOREN |
| 📅 **Termin vereinbart** | Kalender-Event + Bestätigungs-E-Mail, Stage → TERMIN_VEREINBART |
| ❌ **Kein Interesse** | Stage → VERLOREN |

**Wichtig:** Es gibt keinen "Erreicht"-Status. Nach einem Gespräch muss der Inhaber entweder:
- 📅 "Termin vereinbart" wählen (wenn Termin ausgemacht)
- ❌ "Kein Interesse" wählen (wenn kein Interesse)

---

## Workflow einrichten

### Schritt 1: Custom Fields erstellt ✅

Die folgenden Felder wurden bereits auf dem Task-Objekt erstellt:

| Feld | Typ | Optionen |
|------|-----|----------|
| `anrufStatus` | SELECT | NEU, NICHT_ERREICHT_1/2/3, TERMIN, KEIN_INTERESSE |
| `terminDatum` | DATE | - |
| `terminUhrzeit` | TEXT | z.B. "14:00" |

### Schritt 2: Opportunity Stages aktualisiert ✅

Die Stages wurden auf 5 reduziert:
- NEUE_ANFRAGE
- FOLLOW_UP
- TERMIN_VEREINBART
- KUNDE_GEWONNEN
- VERLOREN

### Schritt 3: Workflows erstellen

Du brauchst **zwei Workflows** - einen für automatische Status-Änderungen, einen für Terminbuchungen.

---

#### Workflow 1: Status-Änderungen (Automatisch)

1. Twenty CRM → **Settings** → **Workflows**
2. **+ New Workflow**
3. Name: `📞 Anruf-Status (Auto)`

**Trigger:**
- Typ: `Record Updated`
- Objekt: `Task`
- Bedingung: `anrufStatus` geändert

**Condition Step:**
- Bedingung: `anrufStatus != TERMIN`
- (Nur weitermachen wenn NICHT Termin - Termin wird separat behandelt)

**Aktion: HTTP Request**
```
Method: POST
URL: https://elektriker.fabig-suite.de/api/call-status

Headers:
  Content-Type: application/json

Body:
{
  "taskId": "{{record.id}}",
  "anrufStatus": "{{record.anrufStatus}}"
}
```

4. **Save** und **Activate**

---

#### Workflow 2: Termin buchen (Manuell)

1. **+ New Workflow**
2. Name: `📅 Termin buchen`

**Trigger:**
- Typ: `Manual`
- Objekt: `Task`
- (Erscheint im Cmd+K Menü wenn Task ausgewählt)

**Form Step:**
- Titel: `Termin-Details`
- Feld: `terminDateTime` (DateTime, Required)
  - Label: `Termin Datum & Uhrzeit`

**Aktion: HTTP Request**
```
Method: POST
URL: https://elektriker.fabig-suite.de/api/call-status

Headers:
  Content-Type: application/json

Body:
{
  "taskId": "{{record.id}}",
  "anrufStatus": "TERMIN",
  "terminDateTime": "{{form.terminDateTime}}"
}
```

4. **Save** und **Activate**

---

## Benutzer-Anleitung

### So funktioniert's für den Inhaber:

1. **Task öffnen** → Telefonnummer und Lead-Details sehen
2. **Anrufen** → Auf Telefon-Link klicken
3. **Nach dem Anruf:**

| Situation | Aktion |
|-----------|--------|
| Niemand dran | Status → "Nicht erreicht (1)" |
| 2. Versuch, niemand dran | Status → "Nicht erreicht (2)" |
| 3. Versuch, niemand dran | Status → "Nicht erreicht (3)" |
| Kein Interesse | Status → "Kein Interesse" |
| **Termin ausgemacht** | **Cmd+K → "Termin buchen"** |

### Bei Termin (Cmd+K Workflow):

1. Task auswählen
2. **Cmd+K** (oder Rechtsklick → Workflows)
3. `📅 Termin buchen` wählen
4. **Datum & Uhrzeit** im Formular eingeben
5. **Absenden**
6. **Automatisch:** Kalender-Event + Bestätigungs-E-Mail an Kunden

---

## Was die E-Mails sagen

### Nicht erreicht (1. Versuch)
> "Wir haben heute versucht, Sie telefonisch zu erreichen..."

### Nicht erreicht (2. Versuch)
> "Dies ist unser zweiter Versuch, Sie zu erreichen..."

### Nicht erreicht (3. Versuch)
> "Wir haben nun mehrfach versucht, Sie zu erreichen. Falls Sie noch Interesse haben, melden Sie sich gerne bei uns."

### Termin bestätigt
> "Ihr Termin am [Datum] um [Uhrzeit] wurde bestätigt!"

---

## API Endpoint

**Health Check:**
```bash
curl https://elektriker.fabig-suite.de/api/call-status
```

**Response zeigt:**
- Gültige Status-Optionen
- Opportunity Stages
- Konfigurationsstatus

---

## Zusammenfassung

| Aktion | Ergebnis |
|--------|----------|
| Nicht erreicht (1) | E-Mail #1 + Stage → FOLLOW_UP |
| Nicht erreicht (2) | E-Mail #2 |
| Nicht erreicht (3) | E-Mail #3 + Stage → VERLOREN |
| Termin vereinbart | Kalender + E-Mail + Stage → TERMIN_VEREINBART |
| Kein Interesse | Stage → VERLOREN |

**Minimaler Aufwand:** 1 Dropdown ändern
**Maximale Automation:** E-Mails, Kalender, Stage-Updates
