// Data Apps: data & fixtures

// --- Vilgain Scout Scraping App: influencers
const SCOUT_INFLUENCERS = [
  { id: 1,  name: 'Helena Bush',            customer_id: 751684, region: 'UK', instagram: 'https://www.instagram.com/helenalouisefit/',    tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 2,  name: 'Eve Dobson',             customer_id: 749749, region: 'UK', instagram: 'https://www.instagram.com/eviecalisthenics/',  tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 3,  name: 'Juliana Potoczka',       customer_id: 749416, region: 'UK', instagram: 'https://www.instagram.com/julipotoczka',        tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 4,  name: 'Annabelle Cassidy',      customer_id: 750965, region: 'UK', instagram: '',                                              tiktok: 'https://www.tiktok.com/@annabellecassidy_',       youtube: '',                                          facebook: '' },
  { id: 5,  name: 'Alexandra Botting',      customer_id: 565600, region: 'UK', instagram: 'https://www.instagram.com/alexarciab?igsh=MTF',tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 6,  name: 'Lily Thompstone',        customer_id: 744278, region: 'UK', instagram: 'https://www.instagram.com/ellieb.runs/',        tiktok: 'https://www.tiktok.com/@lilythompstone',          youtube: '',                                          facebook: '' },
  { id: 7,  name: 'Ellie Bradley',          customer_id: 742061, region: 'UK', instagram: '',                                              tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 8,  name: 'Kenzie Draper',          customer_id: 749109, region: 'UK', instagram: '',                                              tiktok: 'https://www.tiktok.com/@kenziedraperfitness',     youtube: '',                                          facebook: '' },
  { id: 9,  name: 'Calum Goddard',          customer_id: 744870, region: 'UK', instagram: 'https://www.instagram.com/calumgoddard',        tiktok: 'https://www.tiktok.com/@calumgoddard',            youtube: 'https://www.youtube.com/@calumgoddard',     facebook: '' },
  { id: 10, name: 'Zartasha Arif',          customer_id: 728725, region: 'UK', instagram: 'https://www.instagram.com/zartasha.a/',         tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 11, name: 'Chelsey Watkins',        customer_id: 740857, region: 'UK', instagram: 'https://www.instagram.com/foodiefunwithus',     tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 12, name: 'Ellie-Mae Hunn',         customer_id: 748572, region: 'UK', instagram: 'https://www.instagram.com/maedbyel',            tiktok: 'https://www.tiktok.com/@elliemaehunn',            youtube: '',                                          facebook: '' },
  { id: 13, name: 'Steph Van Der Velden',   customer_id: 741673, region: 'UK', instagram: 'https://www.instagram.com/stephvandervelden/',  tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 14, name: '2TwinFit (Libby & Flora)',customer_id: 745501,region: 'UK', instagram: 'https://www.instagram.com/2twinfit/',           tiktok: 'https://www.tiktok.com/@2twinfit',                youtube: '',                                          facebook: '' },
  { id: 15, name: 'Charlie Hunchman',       customer_id: 746140, region: 'UK', instagram: 'https://www.instagram.com/charliesmith_fitness',tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 16, name: 'Maja Novotná',           customer_id: 752911, region: 'CZ', instagram: 'https://www.instagram.com/majanovotna.fit/',    tiktok: 'https://www.tiktok.com/@majanovotna',             youtube: '',                                          facebook: '' },
  { id: 17, name: 'Tomáš Kovář',            customer_id: 742803, region: 'CZ', instagram: 'https://www.instagram.com/kovar.tomas',         tiktok: '',                                               youtube: 'https://www.youtube.com/@kovartomas',       facebook: '' },
  { id: 18, name: 'Eliška Procházková',     customer_id: 748120, region: 'SK', instagram: 'https://www.instagram.com/eliska.prochazkova',  tiktok: 'https://www.tiktok.com/@eliskaprochazkova',       youtube: '',                                          facebook: 'https://facebook.com/eliskaprochazkova' },
  { id: 19, name: 'Martin Dudáš',           customer_id: 750210, region: 'SK', instagram: 'https://www.instagram.com/martin.dudas.fit',    tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 20, name: 'Sofia Varga',            customer_id: 746991, region: 'HU', instagram: 'https://www.instagram.com/sofia.varga',         tiktok: 'https://www.tiktok.com/@sofiavarga',              youtube: '',                                          facebook: '' },
  { id: 21, name: 'Piotr Kowalski',         customer_id: 749001, region: 'PL', instagram: 'https://www.instagram.com/piotr.kowalski.fit',  tiktok: '',                                               youtube: 'https://www.youtube.com/@piotrkowalski',    facebook: '' },
  { id: 22, name: 'Hana Svobodová',         customer_id: 744302, region: 'CZ', instagram: 'https://www.instagram.com/hana.svobodova',      tiktok: '',                                               youtube: '',                                          facebook: '' },
  { id: 23, name: 'Lukáš Horváth',          customer_id: 747800, region: 'SK', instagram: '',                                              tiktok: 'https://www.tiktok.com/@lukashorvath',            youtube: '',                                          facebook: '' },
  { id: 24, name: 'Anna Kováčová',          customer_id: 745612, region: 'CZ', instagram: 'https://www.instagram.com/anna.kovacova',       tiktok: '',                                               youtube: '',                                          facebook: '' },
];

// --- AI Review Insights App: LLM summary + reviews
const REVIEW_SUMMARY = {
  generated: 'Today, 8:47 AM',
  totalUrgent: 27,
  total7d: 214,
  topThemes: [
    { label: 'Short expiry dates',       count: 42, share: 0.23, delta: '+8 vs last wk', tone: 'danger' },
    { label: 'Damaged packaging',        count: 31, share: 0.17, delta: '+3 vs last wk', tone: 'danger' },
    { label: 'Missing items in order',   count: 24, share: 0.13, delta: '−2 vs last wk', tone: 'warn'   },
    { label: 'Delivery delays',          count: 19, share: 0.10, delta: '+1 vs last wk', tone: 'warn'   },
    { label: 'Flavour / taste',          count: 17, share: 0.09, delta: '±0 vs last wk', tone: 'neutral'},
    { label: 'Wrong product shipped',    count: 12, share: 0.06, delta: '−4 vs last wk', tone: 'neutral'},
  ],
  narrative:
    "This week's urgent complaints are dominated by expiry and packaging issues. 23% of negative reviews mention products arriving within 2–3 months of their expiry date, with SK and CZ warehouses over-indexed. Packaging damage is stable but high, mostly on protein powder tubs from the Trnava DC. Missing items and delivery delays are declining week-over-week. Recommend prioritising expiry rotation at SK03 and reviewing tub sealing for TP-series SKUs.",
};

const REVIEWS = [
  { id: 1,  order: 6226763, brand: 'Vilgain',   country: 'SK', rating: 1, urgency: 4, category: 'Product Quality',
    text: "Po doručení som zistila, že viaceré produkty majú veľmi krátku dobu do ukončenia spotreby. Konkrétne niektoré produkty majú dátum spotreby už v júni a ďalšie v auguste tohto roku. Chcela by som sa informovať, či je takýto postup z Vašej strany štandardný. Zároveň týmto podávam reklamáciu, nakoľko s takouto krátkou dobou spotreby nie som spokojná a nepovažujem to za adekvátne pri bežnom predaji. Prosím o Vaše vyjadrenie k situácii a návrh riešenia.",
    customer: 'Jana K.', time: '2h ago', resolved: false },
  { id: 2,  order: 6226744, brand: 'Vilgain',   country: 'CZ', rating: 1, urgency: 5, category: 'Packaging',
    text: "Balíček dorazil zcela rozbitý. Víko kbelíku bylo prasklé a asi 200g proteinu uniklo do krabice. Chci buď výměnu nebo vrácení peněz. Takhle nemůžu produkt používat.",
    customer: 'Petr N.', time: '3h ago', resolved: false },
  { id: 3,  order: 6226712, brand: 'Vilgain',   country: 'SK', rating: 2, urgency: 3, category: 'Missing Item',
    text: "V objednávke mi chýbal 1 kus kreatínu. Na faktúre je uvedený, ale v balíku nebol. Prosím o doslanie alebo refundáciu.",
    customer: 'Marek D.', time: '5h ago', resolved: false },
  { id: 4,  order: 6226701, brand: 'Vilgain',   country: 'CZ', rating: 2, urgency: 3, category: 'Delivery',
    text: "Zásilka měla dorazit v úterý, dorazila až v pátek. Žádné avízo, nic. Zbytečně jsem čekal doma.",
    customer: 'Lenka H.', time: '7h ago', resolved: false },
  { id: 5,  order: 6226689, brand: 'Vilgain',   country: 'SK', rating: 1, urgency: 4, category: 'Product Quality',
    text: "Whey protein má divnú chuť, úplne iná než predchádzajúca várka. Batch 2025-11-03. Nedá sa piť.",
    customer: 'Katarína B.', time: '9h ago', resolved: false },
  { id: 6,  order: 6226672, brand: 'Vilgain',   country: 'CZ', rating: 3, urgency: 2, category: 'Wrong Item',
    text: "Objednal jsem vanilkový shake, dorazil čokoládový. Chybí rukojmí obalu. Můžete vyřešit?",
    customer: 'Tomáš V.', time: '11h ago', resolved: false },
  { id: 7,  order: 6226634, brand: 'Vilgain',   country: 'SK', rating: 1, urgency: 5, category: 'Product Quality',
    text: "Expirácia 06/2026 — to je necelé 2 mesiace. Za plnú cenu. Toto je neakceptovateľné, toto by mal byť výpredaj.",
    customer: 'Martina S.', time: '14h ago', resolved: true },
  { id: 8,  order: 6226601, brand: 'Vilgain',   country: 'CZ', rating: 2, urgency: 3, category: 'Packaging',
    text: "Obal BCAA kapslí byl zmáčknutý, víčko poškozené. Obsah vypadá v pořádku, ale prezentace je špatná.",
    customer: 'Jakub R.', time: 'Yesterday', resolved: false },
];

// --- Influencer Scraping Configurator: saved configurations
const SCRAPER_CONFIGS = [
  { id: 'cfg-ig-uk',    name: 'Instagram UK — Fitness',      scraper: 'Instagram',  status: 'Active',   lastRun: '2h ago',  nextRun: 'in 4h',   region: 'UK', depth: 3,  proxy: 'UK-residential', schedule: 'Every 6h' },
  { id: 'cfg-tt-cz',    name: 'TikTok CZ — Health & Food',   scraper: 'TikTok',     status: 'Active',   lastRun: '1h ago',  nextRun: 'in 5h',   region: 'CZ', depth: 2,  proxy: 'EU-datacenter',  schedule: 'Every 6h' },
  { id: 'cfg-yt-de',    name: 'YouTube DE — Strength',       scraper: 'YouTube',    status: 'Paused',   lastRun: '2d ago',  nextRun: '—',       region: 'DE', depth: 4,  proxy: 'EU-residential', schedule: 'Daily 03:00' },
  { id: 'cfg-ig-sk',    name: 'Instagram SK — Nutrition',    scraper: 'Instagram',  status: 'Active',   lastRun: '30m ago', nextRun: 'in 5h30', region: 'SK', depth: 3,  proxy: 'SK-residential', schedule: 'Every 6h' },
  { id: 'cfg-tt-uk',    name: 'TikTok UK — Calisthenics',    scraper: 'TikTok',     status: 'Error',    lastRun: '45m ago', nextRun: 'retry',   region: 'UK', depth: 2,  proxy: 'UK-residential', schedule: 'Every 4h' },
  { id: 'cfg-fb-pl',    name: 'Facebook PL — Bodybuilding',  scraper: 'Facebook',   status: 'Draft',    lastRun: '—',       nextRun: '—',       region: 'PL', depth: 3,  proxy: 'EU-residential', schedule: '—' },
  { id: 'cfg-ig-hu',    name: 'Instagram HU — Yoga',         scraper: 'Instagram',  status: 'Active',   lastRun: '3h ago',  nextRun: 'in 3h',   region: 'HU', depth: 2,  proxy: 'EU-datacenter',  schedule: 'Every 6h' },
];

const SCRAPER_TYPES = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter/X', 'LinkedIn'];
const PROXY_POOLS   = ['UK-residential', 'UK-datacenter', 'EU-residential', 'EU-datacenter', 'SK-residential', 'CZ-residential', 'Global-residential'];
