import { FunnelConfig } from '../types'

export const knxFunnelConfig: FunnelConfig = {
  id: 'knx-beratung',
  name: 'KNX Systemplanung',
  triggerCTA: 'Kostenlose KNX Beratung',

  steps: [
    // Step 1: Project Scope (What to control with KNX)
    {
      id: 'scope',
      type: 'multi-choice',
      title: 'Was möchtest du mit KNX steuern?',
      subtitle: 'Wähle alle Bereiche, die für dich wichtig sind',
      fieldName: 'knxScope',
      minSelections: 1,
      bonusThreshold: 4,
      bonusScore: 20,
      options: [
        { id: 'lighting', icon: '💡', label: 'Beleuchtung', subtext: 'Dimmen, Szenen, Präsenz', score: 10 },
        { id: 'blinds', icon: '🪟', label: 'Beschattung', subtext: 'Jalousien, Rollläden, Markisen', score: 10 },
        { id: 'heating', icon: '🌡️', label: 'Heizung & Klima', subtext: 'Raumtemperatur, Fußbodenheizung', score: 15 },
        { id: 'energy', icon: '⚡', label: 'Energiemanagement', subtext: 'Verbrauchsoptimierung, PV', score: 15 },
        { id: 'security', icon: '🔒', label: 'Sicherheit', subtext: 'Alarm, Zutrittskontrolle', score: 10 },
        { id: 'audio', icon: '🔊', label: 'Multiroom Audio', subtext: 'Musiksteuerung im ganzen Haus', score: 8 },
        { id: 'complete', icon: '🏠', label: 'Komplettlösung', subtext: 'Alles aus einer Hand', score: 25, tag: 'full-system' },
      ],
    },

    // Step 2: Property Type & Project Status
    {
      id: 'property',
      type: 'two-questions',
      title: 'Erzähl uns mehr über dein Projekt',
      questions: [
        {
          fieldName: 'propertyType',
          question: 'Um was für ein Gebäude handelt es sich?',
          options: [
            { id: 'neubau', icon: '🏗️', label: 'Neubau', score: 30, tag: 'neubau' },
            { id: 'sanierung', icon: '🔨', label: 'Kernsanierung', score: 25, tag: 'sanierung' },
            { id: 'bestand', icon: '🏠', label: 'Nachrüstung Bestand', score: 10, tag: 'bestand' },
            { id: 'gewerbe', icon: '🏢', label: 'Gewerbeobjekt', score: 20, tag: 'gewerbe' },
          ],
        },
        {
          fieldName: 'projectPhase',
          question: 'In welcher Phase ist dein Projekt?',
          options: [
            { id: 'planning', icon: '📐', label: 'Planungsphase', score: 25, tag: 'early-planning' },
            { id: 'architect', icon: '📋', label: 'Architekt beauftragt', score: 20 },
            { id: 'construction', icon: '🚧', label: 'Bau hat begonnen', score: 15 },
            { id: 'existing', icon: '🏠', label: 'Bestehendes Gebäude', score: 10 },
          ],
        },
      ],
    },

    // Step 3: Timeline & Budget
    {
      id: 'timeline-budget',
      type: 'two-questions',
      title: 'Zeitrahmen und Budget',
      questions: [
        {
          fieldName: 'timeline',
          question: 'Wann soll die Installation erfolgen?',
          options: [
            { id: 'urgent', icon: '🔥', label: 'So schnell wie möglich', score: 20, tag: 'urgent' },
            { id: 'soon', icon: '📅', label: 'In den nächsten 3 Monaten', score: 15 },
            { id: 'planned', icon: '📆', label: 'In 3-12 Monaten', score: 10 },
            { id: 'research', icon: '🔍', label: 'Erstmal nur informieren', score: 0 },
          ],
        },
        {
          fieldName: 'budget',
          question: 'Welches Budget hast du eingeplant?',
          options: [
            { id: 'under10k', icon: '💰', label: 'Bis 10.000€', score: 5 },
            { id: '10to25k', icon: '💰💰', label: '10.000 - 25.000€', score: 15 },
            { id: '25to50k', icon: '💰💰💰', label: '25.000 - 50.000€', score: 25, tag: 'high-budget' },
            { id: 'over50k', icon: '🏆', label: 'Über 50.000€', score: 35, tag: 'premium' },
            { id: 'unknown', icon: '❓', label: 'Noch unklar', score: 5 },
          ],
        },
      ],
    },

    // Step 4: Optional - Existing System & Property Size
    {
      id: 'deep-qualification',
      type: 'optional-qualification',
      title: 'Noch 2 Fragen für eine präzisere Planung',
      skipText: 'Überspringen',
      questions: [
        {
          fieldName: 'propertySize',
          question: 'Wie groß ist die Wohnfläche?',
          options: [
            { id: 'small', icon: '🏠', label: 'Unter 150m²', score: 5 },
            { id: 'medium', icon: '🏡', label: '150-300m²', score: 15 },
            { id: 'large', icon: '🏘️', label: '300-500m²', score: 25 },
            { id: 'xlarge', icon: '🏰', label: 'Über 500m²', score: 35, tag: 'large-project' },
          ],
        },
        {
          fieldName: 'existingAutomation',
          question: 'Gibt es bereits Hausautomation?',
          options: [
            { id: 'none', icon: '🆕', label: 'Nein, komplett neu', score: 10 },
            { id: 'basic', icon: '💡', label: 'Ja, einfache Steuerung', score: 5 },
            { id: 'knx-old', icon: '🔧', label: 'Ja, altes KNX System', score: 20, tag: 'upgrade' },
            { id: 'other', icon: '🔌', label: 'Ja, anderes System', score: 10 },
          ],
        },
      ],
    },

    // Step 5: Contact (Final Step)
    {
      id: 'contact',
      type: 'contact',
      title: 'Deine KNX Beratung wartet!',
      subtitle: 'Wohin dürfen wir deine persönliche Empfehlung senden?',
      valueProposition: [
        'Individuelle KNX Systemplanung',
        'Realistische Kostenschätzung',
        'Empfehlung passender KNX-Geräte',
        'Kostenloser Vor-Ort-Termin',
      ],
      fields: [
        { name: 'name', label: 'Dein Name', type: 'text', required: true, placeholder: 'Max Mustermann' },
        { name: 'email', label: 'E-Mail Adresse', type: 'email', required: true, placeholder: 'max@beispiel.de', validation: 'email' },
        { name: 'phone', label: 'Telefon', type: 'tel', required: true, placeholder: '089 1234567', validation: 'phone' },
        { name: 'plz', label: 'Postleitzahl', type: 'plz', required: true, placeholder: '80331', validation: 'plz' },
      ],
      gdprText: 'Ich stimme zu, dass meine Daten zur Bearbeitung meiner Anfrage gespeichert werden. Mehr in unserer Datenschutzerklärung.',
    },
  ],

  confirmation: {
    title: 'Perfekt, [Name]! Deine KNX Anfrage ist eingegangen.',
    message: 'Unser KNX-Experte meldet sich innerhalb von 24 Stunden bei dir.',
    nextSteps: [
      'Wir analysieren deine Projektanforderungen',
      'Ein zertifizierter KNX-Partner kontaktiert dich',
      'Kostenlose Vor-Ort-Beratung wird vereinbart',
    ],
    urgentCTA: {
      label: 'Jetzt anrufen',
      phone: '+49 89 1234 5678',
    },
  },

  scoring: {
    hot: 85,
    warm: 55,
    potential: 30,
  },
}
