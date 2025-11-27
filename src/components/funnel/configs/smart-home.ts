import { FunnelConfig } from '../types'

export const smartHomeFunnelConfig: FunnelConfig = {
  id: 'smart-home-beratung',
  name: 'Smart Home Beratung',
  triggerCTA: 'Kostenlose Smart Home Beratung',

  steps: [
    // Step 1: Vision (Emotional Entry)
    {
      id: 'vision',
      type: 'single-choice',
      title: 'Wie soll sich dein Zuhause anfühlen?',
      subtitle: 'Was ist dir bei deinem Smart Home am wichtigsten?',
      fieldName: 'primaryMotivation',
      layout: 'cards',
      options: [
        {
          id: 'comfort',
          icon: '✨',
          label: 'Komfort',
          subtext: 'Alles auf Knopfdruck',
          score: 5,
          tag: 'comfort-focused',
        },
        {
          id: 'energy',
          icon: '💰',
          label: 'Energiesparen',
          subtext: 'Heizung & Strom optimieren',
          score: 10,
          tag: 'energy-focused',
        },
        {
          id: 'security',
          icon: '🔒',
          label: 'Sicherheit',
          subtext: 'Immer wissen, was zuhause passiert',
          score: 15,
          tag: 'security-focused',
        },
        {
          id: 'wow',
          icon: '🎭',
          label: 'Wow-Effekt',
          subtext: 'Gäste beeindrucken',
          score: 5,
          tag: 'luxury-focused',
        },
        {
          id: 'complete',
          icon: '🏠',
          label: 'Alles davon',
          subtext: 'Das komplette Smart Home',
          score: 25,
          tag: 'full-system',
        },
      ],
    },

    // Step 2: Scope (Qualification)
    {
      id: 'scope',
      type: 'multi-choice',
      title: 'Was möchtest du smart steuern?',
      subtitle: 'Wähle alle Bereiche, die dich interessieren',
      fieldName: 'interestedAreas',
      minSelections: 1,
      bonusThreshold: 4,
      bonusScore: 15,
      options: [
        { id: 'lighting', icon: '💡', label: 'Beleuchtung', score: 5 },
        { id: 'heating', icon: '🌡️', label: 'Heizung & Klima', score: 10 },
        { id: 'blinds', icon: '🪟', label: 'Jalousien & Rollläden', score: 8 },
        { id: 'audio', icon: '🔊', label: 'Multiroom Audio', score: 5 },
        { id: 'cameras', icon: '📹', label: 'Kameras & Türklingel', score: 8 },
        { id: 'locks', icon: '🚪', label: 'Türschlösser', score: 8 },
        { id: 'sockets', icon: '⚡', label: 'Steckdosen & Energie', score: 5 },
        { id: 'cinema', icon: '🎬', label: 'Heimkino', score: 10 },
      ],
    },

    // Step 3: Property & Timeline (Critical Qualification)
    {
      id: 'property-timeline',
      type: 'two-questions',
      title: 'Erzähl uns mehr über dein Projekt',
      questions: [
        {
          fieldName: 'propertyType',
          question: 'Um was für eine Immobilie handelt es sich?',
          options: [
            {
              id: 'neubau',
              icon: '🏗️',
              label: 'Neubau',
              score: 30,
              tag: 'neubau',
            },
            {
              id: 'bestand',
              icon: '🏠',
              label: 'Bestandsimmobilie',
              score: 10,
              tag: 'bestand',
            },
            {
              id: 'sanierung',
              icon: '🔨',
              label: 'Kernsanierung',
              score: 25,
              tag: 'sanierung',
            },
            {
              id: 'gewerbe',
              icon: '🏢',
              label: 'Gewerbe',
              score: 20,
              tag: 'gewerbe',
            },
          ],
        },
        {
          fieldName: 'timeline',
          question: 'Wann soll es losgehen?',
          options: [
            {
              id: 'urgent',
              icon: '🔥',
              label: 'So schnell wie möglich',
              score: 20,
              tag: 'urgent',
            },
            {
              id: 'planned',
              icon: '📅',
              label: 'In den nächsten 3 Monaten',
              score: 15,
              tag: 'planned',
            },
            {
              id: 'future',
              icon: '📆',
              label: 'In 3-12 Monaten',
              score: 5,
              tag: 'future',
            },
            {
              id: 'research',
              icon: '🤔',
              label: 'Nur informieren',
              score: 0,
              tag: 'research',
            },
          ],
        },
      ],
    },

    // Step 4: Contact Capture (The Exchange)
    {
      id: 'contact',
      type: 'contact',
      title: 'Fast geschafft!',
      subtitle: 'Wohin dürfen wir dein Ergebnis schicken?',
      valueProposition: [
        'Grobe Preisindikation für dein Projekt',
        'Empfehlung: KNX, Loxone oder Alternative',
        'Typische Projektdauer',
        'Nächste Schritte',
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
          label: 'Telefon (für Rückfragen)',
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
      ],
      gdprText:
        'Ich stimme zu, dass meine Daten zur Bearbeitung meiner Anfrage gespeichert werden. Mehr in unserer Datenschutzerklärung.',
    },

    // Step 5: Deep Qualification (After Commitment - Optional)
    {
      id: 'deep-qualification',
      type: 'optional-qualification',
      title: 'Noch 2 kurze Fragen für eine präzisere Einschätzung',
      skipText: 'Überspringen und absenden',
      questions: [
        {
          fieldName: 'propertySize',
          question: 'Wie groß ist die Wohnfläche ungefähr?',
          options: [
            { id: 'small', icon: '🏠', label: 'Unter 100m²', score: 5 },
            { id: 'medium', icon: '🏡', label: '100-200m²', score: 15 },
            { id: 'large', icon: '🏘️', label: '200-350m²', score: 25 },
            { id: 'xlarge', icon: '🏰', label: 'Über 350m²', score: 35 },
          ],
        },
        {
          fieldName: 'systemPreference',
          question: 'Hast du schon ein System im Blick?',
          options: [
            {
              id: 'loxone',
              icon: '🟢',
              label: 'Loxone',
              score: 10,
              tag: 'loxone-interest',
            },
            {
              id: 'knx',
              icon: '🔵',
              label: 'KNX',
              score: 15,
              tag: 'knx-interest',
            },
            {
              id: 'homekit',
              icon: '🟣',
              label: 'Apple HomeKit',
              score: 5,
              tag: 'homekit-interest',
            },
            {
              id: 'needs-consultation',
              icon: '⚪',
              label: 'Beratet mich!',
              score: 5,
              tag: 'needs-consultation',
            },
          ],
        },
      ],
    },
  ],

  confirmation: {
    title: 'Perfekt, [Name]! Deine Anfrage ist eingegangen.',
    message: 'Wir melden uns innerhalb von 24 Stunden bei dir.',
    nextSteps: [
      'Wir prüfen deine Angaben',
      'Ein Smart Home Experte meldet sich bei dir',
      'Wir vereinbaren einen kostenlosen Vor-Ort-Termin',
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
