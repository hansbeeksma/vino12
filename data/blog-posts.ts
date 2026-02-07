export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  category: "wijn-101" | "food-pairing" | "regio" | "seizoen";
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "perfecte-wijn-kaas-combinatie",
    title: "De Perfecte Wijn & Kaas Combinatie",
    excerpt:
      "Ontdek welke wijnen het beste passen bij je favoriete kazen. Van zachte brie tot pittige oude kaas.",
    date: "2026-01-15",
    readTime: 4,
    category: "food-pairing",
    content: `
## Waarom wijn en kaas zo goed samengaan

De combinatie van wijn en kaas is een klassieker om een reden: de tannines in rode wijn worden verzacht door het vet in kaas, terwijl de zuren in witte wijn een fris contrast bieden.

## Zachte kazen (Brie, Camembert)

**Beste match:** Onze **Chardonnay uit de Bourgogne** met zijn romige textuur en subtiele eikennoten.

De boter-achtige kwaliteiten van zowel de kaas als de wijn versterken elkaar, terwijl de frisse zuurgraad van de Chardonnay het gehemelte reinigt.

## Harde kazen (Oude Gouda, Parmezaan)

**Beste match:** De **Tempranillo uit Rioja** met zijn krachtige tannines en rijpe fruittonen.

De intensiteit van oude kaas vraagt om een wijn die kan meekomen. De donkere vruchten en specerijen van de Tempranillo staan mooi naast de zoute, kristallijne structuur van oude kaas.

## Geitenkaas

**Beste match:** Onze **Sauvignon Blanc uit de Loire** met zijn levendige zuurgraad en grasachtige tonen.

Een klassieke combinatie uit de Loire-vallei zelf. De minerale, citrusachtige Sauvignon Blanc snijdt door de romigheid van geitenkaas.

## Tips voor je kaasplank

1. Serveer kaas op kamertemperatuur
2. Begin met zachte kazen, eindig met sterke
3. Voeg honing en noten toe voor extra dimensie
4. Kies 3-4 kazen voor variatie zonder overweldiging
    `.trim(),
  },
  {
    slug: "rode-vs-witte-wijn-beginnersgids",
    title: "Rode vs Witte Wijn: Een Beginnersgids",
    excerpt:
      "Alles wat je moet weten over het verschil tussen rode en witte wijn. Van druiven tot serveertemperatuur.",
    date: "2026-01-28",
    readTime: 5,
    category: "wijn-101",
    content: `
## Het fundamentele verschil

Het verschil tussen rode en witte wijn zit niet alleen in de kleur van de druif. Rode wijn wordt gemaakt met de schillen, wat tannines, kleur en extra smaakcomplexiteit geeft. Witte wijn wordt geperst zonder schillen.

## Rode wijn in het kort

- **Tannines**: Die droge sensatie in je mond
- **Body**: Meestal voller en zwaarder
- **Temperatuur**: 16-18\u00B0C (niet te warm!)
- **Bewaring**: Vaak langer houdbaar door tannines

### Onze rode selectie

In de Vino12 Box vind je 6 rode wijnen, van de lichte **Gamay uit Beaujolais** tot de volle **Malbec uit Cahors**. Zo ontdek je het hele spectrum.

## Witte wijn in het kort

- **Frisheid**: Hogere zuurgraad, verfrissender
- **Body**: Meestal lichter
- **Temperatuur**: 8-12\u00B0C (goed gekoeld)
- **Bewaring**: Meestal jong drinken

### Onze witte selectie

De 6 witte wijnen vari\u00EBren van de minerale **Riesling uit de Elzas** tot de romige **Viognier uit de Rh\u00F4ne**. Van bone-dry tot subtiel fruitig.

## Wanneer welke wijn?

| Gelegenheid | Aanrader |
|-------------|----------|
| Zomeravond | Witte wijn, goed gekoeld |
| Winterdiner | Rode wijn bij stoofgerechten |
| Aperitief | Lichte witte of ros\u00E9 |
| BBQ | Medium-bodied rode wijn |
    `.trim(),
  },
  {
    slug: "wijnregio-bourgogne",
    title: "Wijnregio: Bourgogne - Het Hart van Franse Wijn",
    excerpt:
      "Een reis door de Bourgogne, waar Pinot Noir en Chardonnay hun meest elegante vorm bereiken.",
    date: "2026-02-05",
    readTime: 6,
    category: "regio",
    content: `
## Waarom Bourgogne speciaal is

De Bourgogne is voor wijnliefhebbers wat Parijs is voor de mode: het epicentrum. Hier bereiken Pinot Noir en Chardonnay hun absolute hoogtepunt, dankzij een unieke combinatie van kalksteen, klimaat en eeuwenlange traditie.

## Terroir: het geheim

Het Franse woord *terroir* vat samen wat Bourgogne zo bijzonder maakt: de combinatie van bodem, klimaat, hoogte en menselijke kennis die elke wijngaard uniek maakt.

De kalksteenbodem van de Bourgogne geeft de wijnen hun karakteristieke minerale elegantie. Geen enkele andere regio ter wereld maakt Pinot Noir met dezelfde finesse.

## In de Vino12 Box

Onze **Pinot Noir uit de Bourgogne** is het perfecte voorbeeld: elegante rode kersen, subtiele aardse tonen en zijdezachte tannines. Een wijn die laat zien waarom Bourgogne zo geroemd wordt.

En de **Chardonnay uit de Bourgogne** toont de andere kant: romig maar verfrissend, met tonen van witte bloemen en citrus.

## Serveer tips

- Pinot Noir: 16\u00B0C, breed glas
- Chardonnay: 10-12\u00B0C, smaller glas
- Laat rode Bourgogne 30 minuten ademen
    `.trim(),
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const blogCategories = {
  "wijn-101": "Wijn 101",
  "food-pairing": "Food Pairing",
  regio: "Wijnregio's",
  seizoen: "Seizoen",
} as const;
