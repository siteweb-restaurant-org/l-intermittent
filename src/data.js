// Contenu réel : carte relevée sur les stories Instagram du restaurant.

export const INFO = {
  name: "L'Intermittent",
  address: '87 avenue Jean-Baptiste Clément',
  city: '92100 Boulogne-Billancourt',
  phone: '01 46 04 55 50',
  phoneHref: 'tel:+33146045550',
  instagram: 'https://www.instagram.com/restaurant.lintermittent/',
  facebook: 'https://www.facebook.com/restaurantlintermittent/',
  open: 8,
  close: 24,
}

export const SIGNATURES = [
  { img: 'os-moelle', name: 'Os à moelle', note: 'copeaux de foie gras', price: 12 },
  { img: 'escargots', name: 'Escargots de Bourgogne', note: '« le gros », six pièces', price: 9 },
  { img: 'gravlax', name: 'Saumon gravlax', note: 'crème de raifort', price: 12 },
  { img: 'croquettes', name: 'Beignets de calamars & morue', note: 'sauce maison', price: 10 },
  { img: 'filet-poivre', name: 'Filet au poivre', note: 'mignonnette', price: 28 },
  { img: 'canard-confit', name: 'Cuisse de canard confite', note: 'pommes sautées', price: 19 },
  { img: 'milanaise', name: 'Escalope de veau', note: 'à la milanaise', price: 21 },
  { img: 'planche', name: 'Planche « ibérique »', note: 'charcuterie & fromages', price: 25 },
  { img: 'pavlova', name: 'Pavlova du chef', note: 'fruits rouges, amandes', price: 10 },
  { img: 'creme-brulee', name: 'Crème brûlée', note: 'à partager', price: 14 },
]

export const MENU = [
  {
    id: 'entrees', title: 'Entrées', img: 'os-moelle',
    items: [
      { name: 'Crevette tempura', desc: 'sauce thaï', price: 8 },
      { name: 'Saumon gravlax', desc: 'raifort', price: 12, img: 'gravlax' },
      { name: 'Escargots de Bourgogne « le gros »', desc: 'six escargots', price: 9, img: 'escargots' },
      { name: 'Planche de charcuterie et fromages « ibérique »', price: 25, img: 'planche' },
      { name: 'Beignets de calamars et de morue', price: 10, img: 'croquettes' },
      { name: 'Os à moelle', desc: 'copeaux de foie gras', price: 12, img: 'os-moelle' },
      { name: 'Tartare de betteraves aux herbes', price: 10 },
    ],
  },
  {
    id: 'salades', title: 'Salades', img: 'burrata',
    items: [
      { name: 'César', desc: 'poulet croustillant, croûtons, grana padano', price: 16 },
      { name: 'Bowl', desc: 'avocat, mangue, quinoa, saumon, edamame, concombre, tomate', price: 18 },
    ],
  },
  {
    id: 'plats', title: 'Plats', img: 'burger',
    items: [
      { name: 'Burger montagnard', desc: 'avec bacon', price: 19, img: 'burger' },
      { name: 'Burger montagnard', desc: 'sans bacon', price: 18 },
      { name: 'Club poulet', price: 19 },
      { name: 'Omelette aux fines herbes', price: 16 },
      { name: 'Tortelli aux cèpes', price: 19 },
      { name: 'Légumes sautés au tofu', price: 20 },
    ],
  },
  {
    id: 'viandes', title: 'Viandes', img: 'boeuf-tranche',
    items: [
      { name: "Épaule d'agneau 7 heures", desc: 'miel, romarin', price: 25, img: 'agneau-7h' },
      { name: 'Filet au poivre mignonnette', price: 28, img: 'filet-poivre' },
      { name: 'Côte de bœuf fumée aux herbes', desc: 'pour deux personnes, 1,2 kg', price: 90, img: 'boeuf-tranche' },
      { name: "L'entrecôte", desc: "bleu d'Auvergne", price: 26 },
      { name: 'Tartare de bœuf', price: 18 },
      { name: 'Cuisse de canard confite', price: 19, img: 'canard-confit' },
      { name: 'Magret de canard', desc: 'clémentines rôties', price: 22 },
      { name: "Cocotte de pintade à l'ancienne", price: 24 },
      { name: 'Escalope de veau milanaise', price: 21, img: 'milanaise' },
      { name: 'Pas pour les grands', desc: 'steak haché ou poulet croustillant, glace', price: 10 },
    ],
  },
  {
    id: 'poissons', title: 'Poissons', img: 'saumon-oseille',
    items: [
      { name: "Darne de saumon à l'oseille", price: 23, img: 'saumon-oseille' },
      { name: 'Sole meunière', price: 45 },
      { name: 'Filet de sandre au beurre rouge', price: 22 },
    ],
  },
  {
    id: 'desserts', title: 'Desserts', img: 'pavlova',
    items: [
      { name: 'Tarte tatin aux poires', price: 10 },
      { name: 'Pavlova du chef', price: 10, img: 'pavlova' },
      { name: 'Tiramisu', price: 8 },
      { name: 'Mœlleux au chocolat', price: 8, img: 'moelleux' },
      { name: 'Profiteroles', price: 10, img: 'profiteroles' },
      { name: 'Baba au rhum', price: 10 },
      { name: 'Crème brûlée à partager', price: 14, img: 'creme-brulee' },
      { name: 'Café gourmand', price: 8 },
      { name: 'Assortiment de trois fromages', price: 10 },
    ],
  },
]

export const WINES = [
  {
    title: 'Rouges', unit: '75 cl',
    items: [
      ['Pauillac', 'La Fleur de Haut-Bages Libéral', 65],
      ['Graves', 'Château Pontey Lamartine', 38],
      ['Médoc', 'Château Lacombe Noaillac', 35],
      ['Lalande-de-Pomerol', 'R de Réal-Caillou', 42],
      ['Saint-Julien', 'Éléonore du Château Teynac', 45],
      ['Pessac-Léognan', 'Château de Rochemorin', 45],
      ['Saint-Georges-Saint-Émilion', '', 40],
      ['Lussac-Saint-Émilion', 'Château Tour de Ségur', 48],
      ['Côtes-du-Rhône', 'Parallèle 45, Maison Jaboulet', 30],
      ['Crozes-Hermitage', 'Maison Jaboulet', 38],
      ['Bourgogne Hautes-Côtes-de-Nuits', 'Albert Bichot', 40],
      ['Savigny-lès-Beaune', '« Les Pimentiers », Domaine Arnoux', 40],
      ['Côte-de-Brouilly', 'Crêt des Garanches', 30],
      ['Saint-Amour', '', 30],
      ['Pic Saint-Loup', 'Cros-Pujol', 33],
      ['Saint-Nicolas-de-Bourgueil', 'Domaine Bois Mayaud', 35],
    ],
  },
  {
    title: 'Rosés', unit: '75 cl',
    items: [
      ['M de Minuty', 'Provence', 40],
      ['Côtes-de-Provence', '« Domaine de la Sanglière » spécial', 30],
    ],
  },
  {
    title: 'Blancs', unit: '75 cl',
    items: [
      ['Pouilly-Fumé', '« Domaine de Maltaverne »', 38],
      ['Chablis', '« Giraudon »', 31],
      ['Chitry', '« Giraudon »', 30],
      ['Crozes-Hermitage', 'Maison Jaboulet', 38],
      ['Saint-Véran', 'Meurgey', 38],
    ],
  },
  {
    title: 'Champagnes', unit: '75 cl',
    items: [
      ['Producteur de la maison', '', 50],
      ['Ruinart', 'Brut', 90],
      ['Ruinart', 'Blanc de Blancs', 110],
    ],
  },
]

// Rendez-vous : dates d'exemple pour la maquette (Beaujolais = 3e jeudi de novembre).
export const EVENTS = [
  { date: '2026-09-29', board: ['MAR 29.09', 'LIGUE DES CHAMPIONS', '21:00'], title: 'Ligue des Champions', detail: 'Soirée PSG sur grand écran', tag: 'Match' },
  { date: '2026-10-10', board: ['SAM 10.10', 'LES BLEUS · FOOTBALL', '20:45'], title: 'Équipe de France', detail: 'Tous les matchs des Bleus en direct', tag: 'Match' },
  { date: '2026-11-14', board: ['SAM 14.11', 'XV DE FRANCE · RUGBY', '21:10'], title: 'XV de France', detail: 'Tests de novembre, ambiance 100 % supporters', tag: 'Match' },
  { date: '2026-11-19', board: ['JEU 19.11', 'BEAUJOLAIS NOUVEAU', '19:00'], title: 'Beaujolais nouveau', detail: 'Buffet géant, saucisson lyonnais, bœuf bourguignon', tag: 'Soirée' },
  { date: '2026-12-31', board: ['JEU 31.12', 'RÉVEILLON', '20:00'], title: 'Réveillon du 31', detail: 'Menu de fête et coupe de minuit', tag: 'Soirée' },
]

export const euro = (n) => `${n} €`
