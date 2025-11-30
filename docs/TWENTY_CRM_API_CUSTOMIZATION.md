# Twenty CRM - API Customization Guide

## Overview

This guide documents how to customize Twenty CRM workspaces via API for German local business clients. All customizations use the GraphQL Metadata API with dynamic API key usage from environment variables.

## API Architecture

Twenty CRM provides two APIs:

| API | Endpoint | Purpose |
|-----|----------|---------|
| **REST API** | `{BASE_URL}/rest` | CRUD operations on records (People, Companies, etc.) |
| **GraphQL Metadata API** | `{BASE_URL}/metadata` | Schema customization (Objects, Fields, Labels) |

For workspace customization, we use the **GraphQL Metadata API**.

### OpenAPI Reference

Twenty provides OpenAPI documentation at:
- **REST API**: `{BASE_URL}/open-api/core`
- **Metadata API**: `{BASE_URL}/open-api/metadata`

Example: `https://crm.fabig-suite.de/open-api/metadata`

## Environment Setup

```env
# .env
TWENTY_CRM_API_URL=https://crm.fabig-suite.de/rest
TWENTY_API_KEY=eyJhbGciOiJIUzI1NiIs...
```

## API Helper Functions

### TypeScript Setup

```typescript
import 'dotenv/config'

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ''
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ''

// REST API URL
function getRestUrl(): string {
  let url = TWENTY_API_URL
  if (url && !url.startsWith('http')) url = 'https://' + url
  if (url && !url.endsWith('/rest')) url = url.replace(/\/$/, '') + '/rest'
  return url
}

// GraphQL Metadata API URL
function getGraphQLUrl(): string {
  let url = TWENTY_API_URL
  if (url && !url.startsWith('http')) url = 'https://' + url
  return url.replace(/\/rest$/, '').replace(/\/$/, '') + '/metadata'
}

// GraphQL call helper
async function graphqlCall(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(getGraphQLUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })
  return response.json()
}

// REST API call helper
async function restCall(endpoint: string, method = 'GET', body?: object) {
  const response = await fetch(`${getRestUrl()}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return response.json()
}
```

## Label System: How It Works

Twenty CRM uses a three-layer label system:

```
┌─────────────────────────────────────────────────────────────┐
│  Field Metadata                                              │
├─────────────────────────────────────────────────────────────┤
│  name: "createdAt"              ← Technical (immutable)      │
│  label: "Creation date"         ← Base English label         │
│  standardOverrides: {                                        │
│    label: "Erstellt (Kontakt)"  ← UI displays THIS           │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

- **`name`**: Technical identifier, used in API calls, never changes
- **`label`**: Default English label
- **`standardOverrides.label`**: Custom label shown in the UI

### Critical Limitation

**Labels must be unique across fields with the same `name`.**

For example, all `createdAt` fields share `name: "createdAt"`. You cannot set multiple `createdAt` fields to the same `standardOverrides.label` value.

**Solution**: Use unique labels per object:
- `Erstellt (Kontakt)` for person.createdAt
- `Erstellt (Unternehmen)` for company.createdAt
- `Erstellt (Anfrage)` for opportunity.createdAt

## Common Customization Tasks

### 1. Get All Objects

```typescript
const result = await graphqlCall(`
  query {
    objects(paging: { first: 50 }) {
      edges {
        node {
          id
          nameSingular
          namePlural
          labelSingular
          labelPlural
        }
      }
    }
  }
`)

const objects = result.data?.objects?.edges?.map(e => e.node) || []
```

### 2. Get All Fields with Labels

```typescript
const result = await graphqlCall(`
  query {
    fields(paging: { first: 500 }) {
      edges {
        node {
          id
          name
          label
          isActive
          standardOverrides { label }
          object { nameSingular }
        }
      }
    }
  }
`)

const fields = result.data?.fields?.edges?.map(e => e.node) || []
```

### 3. Update Object Labels

```typescript
// Update object labels (singular/plural)
await restCall(`/metadata/objects/${objectId}`, 'PATCH', {
  labelSingular: 'Kontakt',
  labelPlural: 'Kontakte',
  description: 'Kundenkontakte und Leads'
})
```

### 4. Update Field Labels

```typescript
// Use GraphQL mutation - this properly sets standardOverrides.label
await graphqlCall(`
  mutation UpdateField($input: UpdateOneFieldMetadataInput!) {
    updateOneField(input: $input) {
      id
      name
      label
      standardOverrides { label }
    }
  }
`, {
  input: {
    id: fieldId,
    update: { label: 'Erstellt (Kontakt)' }
  }
})
```

### 5. Update Select Field Options

```typescript
// Update status/stage options with German labels
await restCall(`/metadata/fields/${fieldId}`, 'PATCH', {
  options: [
    { value: 'NEW', label: 'Neue Anfrage', color: 'blue', position: 0 },
    { value: 'SCREENING', label: 'In Bearbeitung', color: 'yellow', position: 1 },
    { value: 'MEETING', label: 'Termin vereinbart', color: 'orange', position: 2 },
    { value: 'PROPOSAL', label: 'Angebot gesendet', color: 'purple', position: 3 },
    { value: 'CUSTOMER', label: 'Kunde gewonnen', color: 'green', position: 4 },
  ]
})
```

### 6. Create Custom Fields

```typescript
await restCall('/metadata/fields', 'POST', {
  objectMetadataId: objectId,
  name: 'leadScore',
  label: 'Lead-Bewertung',
  type: 'NUMBER',
  description: 'Automatische Bewertung (0-100)',
  icon: 'IconStar',
  isNullable: true,
})

// For SELECT fields, include options:
await restCall('/metadata/fields', 'POST', {
  objectMetadataId: objectId,
  name: 'urgency',
  label: 'Dringlichkeit',
  type: 'SELECT',
  icon: 'IconClock',
  isNullable: true,
  options: [
    { value: 'URGENT', label: 'Dringend', color: 'red', position: 0 },
    { value: 'SOON', label: 'Bald', color: 'orange', position: 1 },
    { value: 'PLANNED', label: 'Geplant', color: 'blue', position: 2 },
    { value: 'FLEXIBLE', label: 'Flexibel', color: 'gray', position: 3 },
  ]
})
```

## Complete German Setup Script

The main setup script is located at `scripts/setup-german-workspace.ts`.

### What It Configures

1. **Object Labels**
   - person → Kontakt/Kontakte
   - company → Unternehmen/Unternehmen
   - opportunity → Anfrage/Anfragen
   - task → Aufgabe/Aufgaben
   - etc.

2. **Field Labels** (with unique suffixes)
   - createdAt → "Erstellt (Objektname)"
   - updatedAt → "Aktualisiert (Objektname)"
   - deletedAt → "Gelöscht (Objektname)"
   - All other standard fields

3. **Status Options**
   - Task: Zu erledigen, In Bearbeitung, Erledigt
   - Opportunity: Neue Anfrage, In Bearbeitung, Termin vereinbart, etc.

4. **Custom Fields**
   - Lead scoring fields
   - Funnel source tracking
   - DSGVO consent
   - Preferred contact method

### Usage

```bash
# Run the complete setup
npx tsx scripts/setup-german-workspace.ts

# Set all date fields to unique German labels
npx tsx scripts/set-all-german-labels.ts
```

## API Field Types

| Type | Description | Options |
|------|-------------|---------|
| `TEXT` | Single line text | - |
| `NUMBER` | Numeric value | - |
| `BOOLEAN` | True/False | - |
| `DATE` | Date only | - |
| `DATE_TIME` | Date and time | - |
| `SELECT` | Single select | `options[]` required |
| `MULTI_SELECT` | Multiple select | `options[]` required |
| `CURRENCY` | Money value | - |
| `LINK` | URL | - |
| `EMAIL` | Email address | - |
| `PHONE` | Phone number | - |
| `RELATION` | Link to other object | Complex setup |

## Available Icons

Common icons for fields:
- `IconStar` - Ratings, favorites
- `IconClock` - Time, urgency
- `IconCurrencyEuro` - Money, value
- `IconTag` - Categories, labels
- `IconForms` - Forms, sources
- `IconShield` - Privacy, security
- `IconMessage` - Communication
- `IconMail` - Email
- `IconPhone` - Phone
- `IconUser` - People
- `IconBuilding` - Companies

## Troubleshooting

### Label Update Returns `undefined`

This happens when:
1. Another field with the same `name` already has that label
2. You're trying to set a duplicate `standardOverrides.label`

**Solution**: Use unique labels with object suffix: `"Erstellt (Kontakt)"`

### Field Creation Fails

Check:
1. Field `name` must be camelCase
2. Field `name` must be unique within the object
3. `objectMetadataId` must be valid
4. For SELECT fields, `options` must be provided

### API Returns 401 Unauthorized

Check:
1. `TWENTY_API_KEY` is set correctly in `.env`
2. API key hasn't expired
3. API key has correct permissions

## Best Practices

1. **Always use unique labels** for fields with the same name across objects
2. **Use German labels** for all client-facing content
3. **Keep API names in English** for consistency (camelCase)
4. **Test on fresh workspace first** before production
5. **Run setup script immediately** after creating new workspace
6. **Document custom fields** for each client

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `setup-german-workspace.ts` | Complete German workspace setup |
| `set-all-german-labels.ts` | Set all date fields to unique German labels |

## Further Resources

- [Twenty API Documentation](https://docs.twenty.com/developers/api-and-webhooks/api)
- [Twenty GraphQL Playground](https://docs.twenty.com/developers/api-and-webhooks/graphql)
- [Twenty GitHub](https://github.com/twentyhq/twenty)
