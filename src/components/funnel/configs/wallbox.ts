import { FunnelConfig } from '../types'

export const wallboxFunnelConfig: FunnelConfig = {
  id: 'wallbox-anfrage',
  name: 'Wallbox Installation Anfrage',
  triggerCTA: 'Kostenlose Wallbox Beratung',

  steps: [
    // Step 1: Vehicle Status (Critical Qualifier)
    {
      id: 'vehicle',
      type: 'single-choice',
      title: 'Hast du bereits ein E-Auto oder planst du eins?',
      subtitle: 'Das hilft uns bei der Planung',
      fieldName: 'vehicleStatus',
      layout: 'cards',
      options: [
        {
          id: 'have-ev',
          icon: '🚗',
          label: 'E-Auto vorhanden',
          subtext: 'Ich fahre bereits elektrisch',
          score: 30,
          tag: 'has-ev',
        },
        {
          id: 'ordered',
          icon: '📋',
          label: 'E-Auto bestellt',
          subtext: 'Lieferung steht bevor',
          score: 35,
          tag: 'ev-ordered',
        },
        {
          id: 'planning',
          icon: '🔍',
          label: 'E-Auto geplant',
          subtext: 'In den nächsten 12 Monaten',
          score: 15,
          tag: 'planning-ev',
        },
        {
          id: 'hybrid',
          icon: '⚡',
          label: 'Plug-in Hybrid',
          subtext: 'Brauche Lademöglichkeit',
          score: 20,
          tag: 'hybrid',
        },
        {
          id: 'company-fleet',
          icon: '🏢',
          label: 'Firmenflotte',
          subtext: 'Mehrere Fahrzeuge laden',
          score: 40,
          tag: 'fleet',
        },
      ],
    },

    // Step 2: Property & Parking
    {
      id: 'property',
      type: 'two-questions',
      title: 'Wo soll die Wallbox installiert werden?',
      questions: [
        {
          fieldName: 'propertyType',
          question: 'Art der Immobilie',
          options: [
            {
              id: 'house',
              icon: '🏠',
              label: 'Einfamilienhaus',
              score: 20,
              tag: 'house',
            },
            {
              id: 'townhouse',
              icon: '🏘️',
              label: 'Reihenhaus',
              score: 15,
              tag: 'townhouse',
            },
            {
              id: 'apartment',
              icon: '🏢',
              label: 'Eigentumswohnung',
              score: 10,
              tag: 'apartment',
            },
            {
              id: 'commercial',
              icon: '🏭',
              label: 'Gewerbe',
              score: 25,
              tag: 'commercial',
            },
          ],
        },
        {
          fieldName: 'parkingType',
          question: 'Wo parkt das Fahrzeug?',
          options: [
            {
              id: 'garage',
              icon: '🚗',
              label: 'Garage',
              score: 15,
              tag: 'garage',
            },
            {
              id: 'carport',
              icon: '🏕️',
              label: 'Carport',
              score: 10,
              tag: 'carport',
            },
            {
              id: 'outdoor',
              icon: '🅿️',
              label: 'Außenstellplatz',
              score: 5,
              tag: 'outdoor',
            },
            {
              id: 'underground',
              icon: '⬇️',
              label: 'Tiefgarage',
              score: 5,
              tag: 'underground',
            },
          ],
        },
      ],
    },

    // Step 3: Requirements & Features
    {
      id: 'requirements',
      type: 'multi-choice',
      title: 'Was ist dir bei der Wallbox wichtig?',
      subtitle: 'Wähle alle zutreffenden Punkte',
      fieldName: 'requirements',
      minSelections: 1,
      bonusThreshold: 3,
      bonusScore: 15,
      options: [
        { id: 'fast', icon: '⚡', label: '22 kW Schnellladen', score: 10 },
        { id: 'solar', icon: '☀️', label: 'PV-Überschussladen', score: 20 },
        { id: 'app', icon: '📱', label: 'App-Steuerung', score: 5 },
        { id: 'access', icon: '🔐', label: 'Zugangskontrolle', score: 8 },
        { id: 'billing', icon: '📊', label: 'Abrechnung (Firma/Mieter)', score: 15 },
        { id: 'multiple', icon: '🔌', label: 'Mehrere Ladepunkte', score: 20 },
        { id: 'subsidy', icon: '💶', label: 'Förderung nutzen', score: 10 },
      ],
    },

    // Step 4: Contact Capture
    {
      id: 'contact',
      type: 'contact',
      title: 'Wir erstellen dir ein individuelles Wallbox-Angebot',
      valueProposition: [
        'Kostenlose Installations-Prüfung vor Ort',
        'Förderberatung (bis zu 900€ sparen)',
        'Festpreis-Angebot ohne versteckte Kosten',
        'Installation in 2-3 Wochen möglich',
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
          label: 'Straße (für Anfahrt)',
          type: 'text',
          required: false,
          placeholder: 'Musterstraße 123',
        },
      ],
      gdprText:
        'Ich stimme zu, dass meine Daten zur Bearbeitung meiner Anfrage gespeichert werden. Mehr in unserer Datenschutzerklärung.',
    },

    // Step 5: Optional Technical Details
    {
      id: 'technical',
      type: 'optional-qualification',
      title: 'Noch 2 Fragen für ein präziseres Angebot',
      skipText: 'Überspringen und absenden',
      questions: [
        {
          fieldName: 'electricalSetup',
          question: 'Wie ist dein Stromanschluss?',
          options: [
            {
              id: 'unknown',
              icon: '❓',
              label: 'Weiß ich nicht',
              score: 0,
            },
            {
              id: '3phase',
              icon: '⚡',
              label: '3-Phasen (Drehstrom)',
              score: 10,
              tag: '3-phase',
            },
            {
              id: '1phase',
              icon: '🔌',
              label: '1-Phase (Wechselstrom)',
              score: 5,
              tag: '1-phase',
            },
            {
              id: 'upgrade-needed',
              icon: '🔧',
              label: 'Muss erneuert werden',
              score: 15,
              tag: 'needs-upgrade',
            },
          ],
        },
        {
          fieldName: 'solarSetup',
          question: 'Hast du eine Photovoltaik-Anlage?',
          options: [
            {
              id: 'yes-pv',
              icon: '☀️',
              label: 'Ja, mit Speicher',
              score: 25,
              tag: 'pv-with-storage',
            },
            {
              id: 'pv-no-storage',
              icon: '🌤️',
              label: 'Ja, ohne Speicher',
              score: 20,
              tag: 'pv-no-storage',
            },
            {
              id: 'planned-pv',
              icon: '📋',
              label: 'PV geplant',
              score: 15,
              tag: 'pv-planned',
            },
            {
              id: 'no-pv',
              icon: '❌',
              label: 'Nein',
              score: 0,
            },
          ],
        },
      ],
    },
  ],

  confirmation: {
    title: 'Danke [Name]! Deine Wallbox-Anfrage ist eingegangen.',
    message:
      'Ein E-Mobilitäts-Experte meldet sich innerhalb von 24 Stunden bei dir.',
    nextSteps: [
      'Wir prüfen deine Angaben',
      'Kurzes Telefonat zur Klärung der Details',
      'Kostenlose Vor-Ort-Prüfung',
      'Festpreis-Angebot innerhalb 48h',
    ],
    urgentCTA: {
      label: 'Jetzt anrufen',
      phone: '+49 89 1234 5678',
    },
  },

  scoring: {
    hot: 80,
    warm: 50,
    potential: 25,
  },
}
