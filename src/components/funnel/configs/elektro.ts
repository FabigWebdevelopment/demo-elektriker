import { FunnelConfig } from '../types'

export const elektroFunnelConfig: FunnelConfig = {
  id: 'elektro-anfrage',
  name: 'Elektroinstallation Anfrage',
  triggerCTA: 'Kostenlose Erstberatung',

  steps: [
    // Step 1: Project Type (Critical Routing)
    {
      id: 'project-type',
      type: 'single-choice',
      title: 'Was können wir für dich tun?',
      subtitle: 'Worum geht es bei deinem Projekt?',
      fieldName: 'projectType',
      layout: 'cards',
      options: [
        {
          id: 'neubau',
          icon: '🏗️',
          label: 'Neubau',
          subtext: 'Komplette Elektrik für Neubau',
          score: 40,
          tag: 'neubau',
        },
        {
          id: 'sanierung',
          icon: '🔨',
          label: 'Sanierung',
          subtext: 'Elektrik erneuern oder erweitern',
          score: 25,
          tag: 'sanierung',
        },
        {
          id: 'einzelauftrag',
          icon: '⚡',
          label: 'Einzelauftrag',
          subtext: 'Steckdosen, Lampen, Anschlüsse',
          score: 10,
          tag: 'einzelauftrag',
        },
        {
          id: 'echeck',
          icon: '✅',
          label: 'E-Check',
          subtext: 'Sicherheitsprüfung meiner Elektrik',
          score: 15,
          tag: 'echeck',
        },
        {
          id: 'notfall',
          icon: '🆘',
          label: 'Notfall',
          subtext: 'Akutes Problem, brauche schnell Hilfe',
          score: 30,
          tag: 'notfall',
        },
      ],
    },

    // Step 2: Project Details (varies by type - simplified to general questions)
    {
      id: 'project-details',
      type: 'two-questions',
      title: 'Super! Ein paar Details zu deinem Projekt',
      questions: [
        {
          fieldName: 'propertyType',
          question: 'Um was für ein Gebäude handelt es sich?',
          options: [
            {
              id: 'efh',
              icon: '🏠',
              label: 'Einfamilienhaus',
              score: 15,
              tag: 'efh',
            },
            {
              id: 'wohnung',
              icon: '🏢',
              label: 'Wohnung',
              score: 10,
              tag: 'wohnung',
            },
            {
              id: 'mfh',
              icon: '🏘️',
              label: 'Mehrfamilienhaus',
              score: 25,
              tag: 'mfh',
            },
            {
              id: 'gewerbe',
              icon: '🏭',
              label: 'Gewerbe',
              score: 30,
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
              score: 10,
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
      ],
    },

    // Step 3: Scope Assessment
    {
      id: 'scope',
      type: 'multi-choice',
      title: 'Was wird benötigt?',
      subtitle: 'Wähle alle zutreffenden Bereiche',
      fieldName: 'scope',
      minSelections: 1,
      bonusThreshold: 3,
      bonusScore: 15,
      options: [
        { id: 'neuverkabelung', icon: '🔌', label: 'Neuverkabelung', score: 20 },
        { id: 'sicherungskasten', icon: '📦', label: 'Sicherungskasten', score: 15 },
        { id: 'beleuchtung', icon: '💡', label: 'Beleuchtung', score: 8 },
        { id: 'steckdosen', icon: '🔌', label: 'Mehr Steckdosen', score: 5 },
        { id: 'netzwerk', icon: '🌐', label: 'Netzwerk/LAN', score: 10 },
        { id: 'starkstrom', icon: '⚡', label: 'Starkstrom', score: 12 },
        { id: 'smart-home', icon: '🏠', label: 'Smart Home Vorbereitung', score: 15 },
        { id: 'echeck', icon: '✅', label: 'E-Check/Prüfung', score: 10 },
      ],
    },

    // Step 4: Contact Capture
    {
      id: 'contact',
      type: 'contact',
      title: 'Wir erstellen dir ein unverbindliches Angebot',
      subtitle: 'Mit Festpreisgarantie',
      valueProposition: [
        'Kostenlose Vor-Ort-Beratung',
        'Detailliertes Angebot mit Festpreis',
        'Zeitplan für die Installation',
        'VDE-Prüfprotokoll inklusive',
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
          label: 'Adresse (optional)',
          type: 'text',
          required: false,
          placeholder: 'Musterstraße 123',
        },
      ],
      gdprText:
        'Ich stimme zu, dass meine Daten zur Bearbeitung meiner Anfrage gespeichert werden. Mehr in unserer Datenschutzerklärung.',
    },

    // Step 5: Optional Building Details
    {
      id: 'building-details',
      type: 'optional-qualification',
      title: 'Noch 2 Fragen für ein präziseres Angebot',
      skipText: 'Überspringen und absenden',
      questions: [
        {
          fieldName: 'buildingAge',
          question: 'Wann wurde das Gebäude gebaut?',
          options: [
            {
              id: 'pre-1970',
              icon: '🏚️',
              label: 'Vor 1970',
              score: 20,
              tag: 'altbau-kritisch',
            },
            {
              id: '1970-1990',
              icon: '🏠',
              label: '1970-1990',
              score: 15,
              tag: 'altbau',
            },
            {
              id: '1990-2010',
              icon: '🏡',
              label: '1990-2010',
              score: 10,
              tag: 'modern',
            },
            {
              id: 'post-2010',
              icon: '🏘️',
              label: 'Nach 2010',
              score: 5,
              tag: 'neu',
            },
          ],
        },
        {
          fieldName: 'equipmentLevel',
          question: 'Welche Ausstattung schwebt dir vor?',
          options: [
            {
              id: 'standard',
              icon: '⭐',
              label: 'Standard',
              score: 5,
            },
            {
              id: 'komfort',
              icon: '⭐⭐',
              label: 'Komfort',
              score: 15,
            },
            {
              id: 'premium',
              icon: '⭐⭐⭐',
              label: 'Premium',
              score: 30,
            },
          ],
        },
      ],
    },
  ],

  confirmation: {
    title: 'Danke [Name]! Deine Anfrage ist eingegangen.',
    message: 'Wir melden uns innerhalb von 24 Stunden bei dir.',
    nextSteps: [
      'Wir prüfen deine Angaben',
      'Ein Elektriker meldet sich für Details',
      'Vor-Ort-Termin für genaue Aufnahme',
      'Festpreis-Angebot innerhalb 48h',
    ],
    urgentCTA: {
      label: 'Jetzt anrufen',
      phone: '+49 89 1234 5678',
    },
  },

  scoring: {
    hot: 70,
    warm: 40,
    potential: 20,
  },
}
