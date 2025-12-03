import { FunnelConfig } from '../types'

export const beleuchtungFunnelConfig: FunnelConfig = {
  id: 'beleuchtung-beratung',
  name: 'Intelligente Lichtplanung',
  triggerCTA: 'Kostenlose Lichtberatung',

  steps: [
    // Step 1: Rooms (Multi-choice)
    {
      id: 'rooms',
      type: 'multi-choice',
      title: 'Welche Räume sollen beleuchtet werden?',
      subtitle: 'Wähle alle Bereiche für deine Lichtplanung',
      fieldName: 'rooms',
      minSelections: 1,
      bonusThreshold: 4,
      bonusScore: 15,
      options: [
        { id: 'living', icon: '🛋️', label: 'Wohnzimmer', subtext: 'Ambient & Akzentlicht', score: 10 },
        { id: 'kitchen', icon: '🍳', label: 'Küche', subtext: 'Arbeitslicht & Stimmung', score: 10 },
        { id: 'bedroom', icon: '🛏️', label: 'Schlafzimmer', subtext: 'Sanftes Wohlfühllicht', score: 8 },
        { id: 'bathroom', icon: '🚿', label: 'Bad', subtext: 'Spiegel- & Stimmungslicht', score: 10 },
        { id: 'office', icon: '💼', label: 'Arbeitszimmer', subtext: 'Produktives Tageslicht', score: 8 },
        { id: 'outdoor', icon: '🌳', label: 'Außenbereich', subtext: 'Garten, Terrasse, Einfahrt', score: 12, tag: 'outdoor' },
        { id: 'stairs', icon: '🪜', label: 'Flur & Treppe', subtext: 'Orientierung & Sicherheit', score: 8 },
        { id: 'complete', icon: '🏠', label: 'Komplettes Haus', subtext: 'Einheitliches Lichtkonzept', score: 20, tag: 'full-house' },
      ],
    },

    // Step 2: Features (Multi-choice)
    {
      id: 'features',
      type: 'multi-choice',
      title: 'Welche Funktionen sind dir wichtig?',
      subtitle: 'Moderne Beleuchtung bietet viele Möglichkeiten',
      fieldName: 'lightingFeatures',
      minSelections: 1,
      bonusThreshold: 3,
      bonusScore: 15,
      options: [
        { id: 'dimming', icon: '🔆', label: 'Dimmbar', subtext: 'Helligkeit anpassen', score: 10 },
        { id: 'color', icon: '🌈', label: 'Farbwechsel', subtext: 'RGB & Warmweiß', score: 12, tag: 'rgb' },
        { id: 'motion', icon: '👋', label: 'Bewegungsmelder', subtext: 'Automatisch an/aus', score: 10 },
        { id: 'scenes', icon: '🎭', label: 'Lichtszenen', subtext: 'Kino, Dinner, Entspannung', score: 12 },
        { id: 'schedule', icon: '⏰', label: 'Zeitsteuerung', subtext: 'Automatische Abläufe', score: 8 },
        { id: 'voice', icon: '🗣️', label: 'Sprachsteuerung', subtext: 'Alexa, Google, Siri', score: 8 },
        { id: 'app', icon: '📱', label: 'App-Steuerung', subtext: 'Auch von unterwegs', score: 8 },
        { id: 'circadian', icon: '☀️', label: 'Biodynamisch', subtext: 'Licht wie Tageslicht', score: 15, tag: 'premium' },
      ],
    },

    // Step 3: Property & Timeline
    {
      id: 'property-timeline',
      type: 'two-questions',
      title: 'Dein Projekt',
      questions: [
        {
          fieldName: 'propertyType',
          question: 'Um was für ein Gebäude handelt es sich?',
          options: [
            { id: 'neubau', icon: '🏗️', label: 'Neubau', score: 25, tag: 'neubau' },
            { id: 'sanierung', icon: '🔨', label: 'Sanierung/Umbau', score: 20, tag: 'sanierung' },
            { id: 'bestand', icon: '🏠', label: 'Bestehendes Gebäude', score: 10, tag: 'bestand' },
            { id: 'gewerbe', icon: '🏢', label: 'Gewerbe/Büro', score: 15, tag: 'gewerbe' },
          ],
        },
        {
          fieldName: 'timeline',
          question: 'Wann soll das Licht installiert werden?',
          options: [
            { id: 'urgent', icon: '🔥', label: 'So schnell wie möglich', score: 20, tag: 'urgent' },
            { id: 'soon', icon: '📅', label: 'In den nächsten Wochen', score: 15 },
            { id: 'planned', icon: '📆', label: 'In 1-3 Monaten', score: 10 },
            { id: 'research', icon: '🔍', label: 'Erstmal nur informieren', score: 0 },
          ],
        },
      ],
    },

    // Step 4: Contact
    {
      id: 'contact',
      type: 'contact',
      title: 'Deine persönliche Lichtberatung',
      subtitle: 'Wir erstellen dir ein individuelles Lichtkonzept',
      valueProposition: [
        'Professionelle Lichtplanung',
        'Produktempfehlungen für dein Budget',
        'Visualisierung deiner Lichtsituation',
        'Kostenlose Vor-Ort-Beratung',
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
    title: 'Perfekt, [Name]! Deine Lichtberatung ist gebucht.',
    message: 'Unser Lichtexperte meldet sich innerhalb von 24 Stunden bei dir.',
    nextSteps: [
      'Wir analysieren deine Raumsituation',
      'Ein Lichtplaner kontaktiert dich',
      'Wir vereinbaren eine kostenlose Vor-Ort-Beratung',
    ],
    urgentCTA: {
      label: 'Jetzt anrufen',
      phone: '+49 89 1234 5678',
    },
  },

  scoring: {
    hot: 75,
    warm: 45,
    potential: 25,
  },
}
