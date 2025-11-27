import { FunnelConfig } from '../types'

export const sicherheitFunnelConfig: FunnelConfig = {
  id: 'sicherheit-beratung',
  name: 'Sicherheitstechnik Beratung',
  triggerCTA: 'Kostenlose Sicherheitsberatung',

  steps: [
    // Step 1: Motivation Discovery (Emotional Entry)
    {
      id: 'motivation',
      type: 'single-choice',
      title: 'Was ist dir bei der Sicherheit am wichtigsten?',
      subtitle: 'Was hat dich auf das Thema gebracht?',
      fieldName: 'motivation',
      layout: 'cards',
      options: [
        {
          id: 'recent-event',
          icon: '🚨',
          label: 'Einbruch',
          subtext: 'Einbruch in der Nachbarschaft oder bei mir',
          score: 25,
          tag: 'recent-event',
        },
        {
          id: 'prevention',
          icon: '🛡️',
          label: 'Vorsorge',
          subtext: 'Möchte mich und meine Familie schützen',
          score: 15,
          tag: 'prevention',
        },
        {
          id: 'monitoring',
          icon: '📹',
          label: 'Überwachung',
          subtext: 'Sehen was zuhause passiert',
          score: 10,
          tag: 'monitoring',
        },
        {
          id: 'commercial',
          icon: '🏢',
          label: 'Gewerbe',
          subtext: 'Absicherung meines Betriebs',
          score: 20,
          tag: 'commercial',
        },
        {
          id: 'insurance',
          icon: '📋',
          label: 'Versicherung',
          subtext: 'Versicherung verlangt es',
          score: 20,
          tag: 'insurance-required',
        },
      ],
    },

    // Step 2: Scope Definition
    {
      id: 'scope',
      type: 'multi-choice',
      title: 'Welche Bereiche möchtest du absichern?',
      subtitle: 'Wähle alle Bereiche, die dich interessieren',
      fieldName: 'securityAreas',
      minSelections: 1,
      bonusThreshold: 4,
      bonusScore: 20,
      options: [
        { id: 'alarm', icon: '🚪', label: 'Einbruchmeldeanlage', score: 20 },
        { id: 'video', icon: '📹', label: 'Videoüberwachung', score: 15 },
        { id: 'doorbell', icon: '🔔', label: 'Video-Türklingel', score: 8 },
        { id: 'access', icon: '🔐', label: 'Zutrittskontrolle', score: 15 },
        { id: 'fire', icon: '🔥', label: 'Rauch-/Brandmelder', score: 10 },
        { id: 'outdoor', icon: '🚗', label: 'Außenbereich', score: 12 },
        { id: 'smarthome', icon: '📱', label: 'Smart Home Integration', score: 15 },
      ],
    },

    // Step 3: Property Assessment
    {
      id: 'property',
      type: 'two-questions',
      title: 'Über dein Objekt',
      questions: [
        {
          fieldName: 'propertyType',
          question: 'Was soll abgesichert werden?',
          options: [
            {
              id: 'house',
              icon: '🏠',
              label: 'Einfamilienhaus',
              score: 15,
              tag: 'house',
            },
            {
              id: 'apartment',
              icon: '🏢',
              label: 'Wohnung',
              score: 8,
              tag: 'apartment',
            },
            {
              id: 'multi-family',
              icon: '🏘️',
              label: 'Mehrfamilienhaus',
              score: 20,
              tag: 'multi-family',
            },
            {
              id: 'commercial',
              icon: '🏭',
              label: 'Gewerbeobjekt',
              score: 25,
              tag: 'commercial',
            },
          ],
        },
        {
          fieldName: 'propertySize',
          question: 'Wie groß ist das Objekt ungefähr?',
          options: [
            { id: 'small', icon: '📏', label: 'Klein (bis 100m²)', score: 5 },
            { id: 'medium', icon: '📐', label: 'Mittel (100-200m²)', score: 15 },
            { id: 'large', icon: '📏', label: 'Groß (200-400m²)', score: 25 },
            { id: 'xlarge', icon: '🏰', label: 'Sehr groß (400m²+)', score: 35 },
          ],
        },
      ],
    },

    // Step 4: Contact Capture
    {
      id: 'contact',
      type: 'contact',
      title: 'Wir erstellen dir ein individuelles Sicherheitskonzept',
      valueProposition: [
        'Persönliche Schwachstellen-Analyse',
        'Empfehlung für passende Technik',
        'Unverbindliches Angebot mit Festpreis',
        'Infos zu Versicherungsrabatten',
      ],
      fields: [
        {
          name: 'name',
          label: 'Dein Name',
          type: 'text',
          required: true,
          placeholder: 'Max Mustermann',
        },
        {
          name: 'email',
          label: 'E-Mail Adresse',
          type: 'email',
          required: true,
          placeholder: 'max@beispiel.de',
          validation: 'email',
        },
        {
          name: 'phone',
          label: 'Telefon',
          type: 'tel',
          required: true,
          placeholder: '089 1234567',
          validation: 'phone',
        },
        {
          name: 'plz',
          label: 'Postleitzahl',
          type: 'plz',
          required: true,
          placeholder: '80331',
          validation: 'plz',
        },
        {
          name: 'address',
          label: 'Straße (für bessere Einschätzung)',
          type: 'text',
          required: false,
          placeholder: 'Musterstraße 123',
        },
      ],
      gdprText:
        'Ich stimme zu, dass meine Daten zur Bearbeitung meiner Anfrage gespeichert werden. Deine Daten sind bei uns sicher.',
    },

    // Step 5: Urgency & Existing System (Optional)
    {
      id: 'urgency',
      type: 'optional-qualification',
      title: 'Noch zwei Fragen für ein präziseres Angebot',
      skipText: 'Überspringen und absenden',
      questions: [
        {
          fieldName: 'timeline',
          question: 'Wann soll das System installiert werden?',
          options: [
            {
              id: 'urgent',
              icon: '🔥',
              label: 'So schnell wie möglich',
              score: 25,
              tag: 'urgent',
            },
            {
              id: 'soon',
              icon: '📅',
              label: 'In den nächsten 4 Wochen',
              score: 15,
              tag: 'soon',
            },
            {
              id: 'planned',
              icon: '📆',
              label: 'In 1-3 Monaten',
              score: 5,
              tag: 'planned',
            },
            {
              id: 'research',
              icon: '🤔',
              label: 'Erstmal nur informieren',
              score: 0,
              tag: 'research',
            },
          ],
        },
        {
          fieldName: 'existingSystem',
          question: 'Hast du bereits ein Sicherheitssystem?',
          options: [
            {
              id: 'new',
              icon: '🆕',
              label: 'Komplett neu',
              score: 10,
              tag: 'new-installation',
            },
            {
              id: 'upgrade',
              icon: '🔄',
              label: 'Bestehendes erweitern',
              score: 15,
              tag: 'upgrade',
            },
            {
              id: 'replace',
              icon: '🔁',
              label: 'Altes System ersetzen',
              score: 20,
              tag: 'replacement',
            },
          ],
        },
      ],
    },
  ],

  confirmation: {
    title: 'Danke [Name]! Wir kümmern uns um deine Sicherheit.',
    message: 'Ein Sicherheitsexperte meldet sich innerhalb von 24 Stunden.',
    nextSteps: [
      'Wir prüfen deine Angaben',
      'Ein Experte kontaktiert dich für Details',
      'Vor-Ort-Termin für Schwachstellen-Analyse',
      'Individuelles Sicherheitskonzept',
    ],
    urgentCTA: {
      label: 'Jetzt anrufen',
      phone: '+49 89 1234 5678',
    },
  },

  scoring: {
    hot: 90,
    warm: 60,
    potential: 30,
  },
}
