import { FunnelConfig } from '../types'

export const loxoneFunnelConfig: FunnelConfig = {
  id: 'loxone-beratung',
  name: 'Loxone Beratung',
  triggerCTA: 'Kostenlose Loxone Beratung',

  steps: [
    // Step 1: Interest Areas (Multi-choice)
    {
      id: 'features',
      type: 'multi-choice',
      title: 'Welche Loxone Funktionen interessieren dich?',
      subtitle: 'Wähle alle Bereiche, die du automatisieren möchtest',
      fieldName: 'loxoneFeatures',
      minSelections: 1,
      bonusThreshold: 4,
      bonusScore: 20,
      options: [
        { id: 'lighting', icon: '💡', label: 'Lichtsteuerung', subtext: 'Szenen, Dimmen, Farben', score: 10 },
        { id: 'climate', icon: '🌡️', label: 'Klimasteuerung', subtext: 'Heizung, Lüftung, Kühlung', score: 15 },
        { id: 'shading', icon: '🪟', label: 'Beschattung', subtext: 'Jalousien automatisch steuern', score: 10 },
        { id: 'multiroom', icon: '🎵', label: 'Multiroom Audio', subtext: 'Musik im ganzen Haus', score: 12 },
        { id: 'intercom', icon: '🚪', label: 'Intercom & Türklingel', subtext: 'Video-Gegensprechanlage', score: 10 },
        { id: 'security', icon: '🔒', label: 'Alarmanlage', subtext: 'Integrierte Sicherheit', score: 12 },
        { id: 'pool', icon: '🏊', label: 'Pool & Sauna', subtext: 'Wellness-Steuerung', score: 15, tag: 'premium' },
        { id: 'energy', icon: '⚡', label: 'Energiemanagement', subtext: 'PV, Speicher, Wallbox', score: 15 },
      ],
    },

    // Step 2: Property Type & Size
    {
      id: 'property',
      type: 'two-questions',
      title: 'Dein Zuhause',
      questions: [
        {
          fieldName: 'propertyType',
          question: 'Was für ein Gebäude soll ausgestattet werden?',
          options: [
            { id: 'neubau', icon: '🏗️', label: 'Neubau', score: 30, tag: 'neubau' },
            { id: 'sanierung', icon: '🔨', label: 'Sanierung', score: 25, tag: 'sanierung' },
            { id: 'bestand', icon: '🏠', label: 'Bestandsgebäude', score: 10, tag: 'bestand' },
            { id: 'gewerbe', icon: '🏢', label: 'Gewerbe/Büro', score: 20, tag: 'gewerbe' },
          ],
        },
        {
          fieldName: 'propertySize',
          question: 'Wie groß ist die Fläche ungefähr?',
          options: [
            { id: 'small', icon: '🏠', label: 'Bis 120m²', score: 5 },
            { id: 'medium', icon: '🏡', label: '120-250m²', score: 15 },
            { id: 'large', icon: '🏘️', label: '250-400m²', score: 25 },
            { id: 'xlarge', icon: '🏰', label: 'Über 400m²', score: 35, tag: 'large-project' },
          ],
        },
      ],
    },

    // Step 3: Timeline
    {
      id: 'timeline',
      type: 'single-choice',
      title: 'Wann soll dein Loxone Smart Home starten?',
      subtitle: 'Das hilft uns, deinen Projektplan zu erstellen',
      fieldName: 'timeline',
      layout: 'cards',
      options: [
        { id: 'urgent', icon: '🔥', label: 'Sofort', subtext: 'Projekt steht an', score: 25, tag: 'urgent' },
        { id: 'soon', icon: '📅', label: 'In 1-3 Monaten', subtext: 'Planung läuft', score: 20 },
        { id: 'planned', icon: '📆', label: 'In 3-6 Monaten', subtext: 'Noch in Vorbereitung', score: 15 },
        { id: 'future', icon: '🗓️', label: 'In 6-12 Monaten', subtext: 'Langfristige Planung', score: 10 },
        { id: 'research', icon: '🔍', label: 'Nur informieren', subtext: 'Erstmal Überblick', score: 0 },
      ],
    },

    // Step 4: Optional - Current Setup & Budget
    {
      id: 'deep-qualification',
      type: 'optional-qualification',
      title: 'Noch 2 Fragen für eine präzisere Empfehlung',
      skipText: 'Überspringen',
      questions: [
        {
          fieldName: 'existingSystem',
          question: 'Hast du bereits Smart Home Komponenten?',
          options: [
            { id: 'none', icon: '🆕', label: 'Nein, komplett neu', score: 10 },
            { id: 'basic', icon: '📱', label: 'Ja, einzelne Geräte (Alexa etc.)', score: 5 },
            { id: 'partial', icon: '🔌', label: 'Ja, teilweise verkabelt', score: 15 },
            { id: 'full', icon: '🏠', label: 'Ja, anderes Smart Home System', score: 10 },
          ],
        },
        {
          fieldName: 'budget',
          question: 'Welches Budget planst du ein?',
          options: [
            { id: 'starter', icon: '💰', label: 'Bis 15.000€', subtext: 'Starter-Paket', score: 5 },
            { id: 'comfort', icon: '💰💰', label: '15.000 - 30.000€', subtext: 'Komfort-Paket', score: 15 },
            { id: 'premium', icon: '💰💰💰', label: '30.000 - 50.000€', subtext: 'Premium-Paket', score: 25, tag: 'high-budget' },
            { id: 'luxury', icon: '🏆', label: 'Über 50.000€', subtext: 'Luxus-Ausstattung', score: 35, tag: 'premium' },
          ],
        },
      ],
    },

    // Step 5: Contact (Final Step)
    {
      id: 'contact',
      type: 'contact',
      title: 'Deine persönliche Loxone Beratung',
      subtitle: 'Ein zertifizierter Loxone Partner berät dich kostenlos',
      valueProposition: [
        'Individuelle Loxone Konfiguration',
        'Preisindikation für dein Projekt',
        'Showroom-Besuch möglich',
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
    title: 'Super, [Name]! Deine Loxone Anfrage ist eingegangen.',
    message: 'Dein persönlicher Loxone Berater meldet sich innerhalb von 24 Stunden.',
    nextSteps: [
      'Wir prüfen deine Projektanforderungen',
      'Ein zertifizierter Loxone Partner kontaktiert dich',
      'Optional: Besuch in unserem Loxone Showroom',
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
