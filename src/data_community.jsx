// Community / user-created dashboards

const COMMUNITY_DASHBOARDS = [
  {
    id: 'com-1', name: 'Marketing event ROI tracker',
    desc: 'Spend, attended, leads and pipeline by event. Built from the events CSV the team maintains.',
    creator: 'Lena Bauer',  team: 'Marketing',
    created: '4 days ago', updated: '2h ago',
    source: 'spreadsheet', filename: 'events_2026_q1.xlsx',
    status: 'verified', verifiedBy: 'BI · Elena Váňová', verifiedOn: '2 days ago',
    upvotes: 38, views: 412, popular: true,
    promptedBy: false,
    tags: ['events','pipeline','q1'],
    spec: {
      kpis: [
        { label: 'Total spend',  value: '€ 184k', delta: '−6%',  trend: 'down' },
        { label: 'Leads',        value: '1,240',  delta: '+18%', trend: 'up' },
        { label: 'Pipeline',     value: '€ 2.4M', delta: '+22%', trend: 'up' },
        { label: 'ROI',          value: '13.2×',  delta: '+2.1×',trend: 'up' },
      ],
      charts: [
        { type: 'line', title: 'Pipeline by week', series: [{ color: 'oklch(0.55 0.18 265)', data: [120,180,150,220,260,240,310,340,300,360,380,420,460,440,490,510] }], xLabels: ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12','W13','W14','W15','W16'] },
        { type: 'bar',  title: 'Spend by channel', data: [{label:'Trade shows',value:62},{label:'Webinars',value:38},{label:'Sponsorships',value:34},{label:'Meetups',value:28},{label:'Private dinners',value:22}] },
      ],
    },
  },
  {
    id: 'com-2', name: 'Warehouse pick error rate',
    desc: 'Daily error rate by warehouse and SKU class — diagnosing the SK03 quality dip.',
    creator: 'Tomáš Lang', team: 'Operations',
    created: '1 week ago', updated: '6h ago',
    source: 'chat',
    status: 'verified', verifiedBy: 'BI · Martin Kovač', verifiedOn: '3 days ago',
    upvotes: 24, views: 198, popular: false,
    promptedBy: 'Show pick error rate by warehouse, daily, last 90 days',
    tags: ['ops','quality','sk03'],
    spec: {
      kpis: [
        { label: 'Avg error rate',     value: '0.42%', delta: '+0.08pp', trend: 'down' },
        { label: 'Worst warehouse',    value: 'SK03',  delta: '0.91%',    trend: 'down' },
        { label: 'Best warehouse',     value: 'CZ01',  delta: '0.11%',    trend: 'up' },
        { label: 'Picks reviewed',     value: '184k',  delta: '+12%',     trend: 'up' },
      ],
      charts: [
        { type: 'line', title: 'Error rate by warehouse (last 90d)', series: [
            { color: 'oklch(0.58 0.18 25)', data: [0.5,0.55,0.6,0.7,0.75,0.82,0.88,0.91,0.9,0.91,0.92,0.91,0.91] },
            { color: 'oklch(0.6 0.12 200)', data: [0.4,0.42,0.41,0.43,0.44,0.42,0.43,0.42,0.41,0.42,0.41,0.4,0.42] },
            { color: 'oklch(0.62 0.14 155)', data: [0.12,0.13,0.11,0.13,0.12,0.11,0.11,0.10,0.11,0.10,0.11,0.10,0.11] },
          ], xLabels: ['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7','Wk8','Wk9','Wk10','Wk11','Wk12','Wk13'] },
        { type: 'bar', title: 'Errors by SKU class', data: [
            { label: 'Powders',  value: 412 }, { label: 'Bars', value: 240 },
            { label: 'Drinks',   value: 180 }, { label: 'Vitamins', value: 120 },
            { label: 'Apparel',  value: 64 },
          ] },
      ],
    },
  },
  {
    id: 'com-3', name: 'Vending machine hourly traffic',
    desc: 'Foot traffic and conversion at our 14 vending pilots — built from the Helsinki sensor export.',
    creator: 'Mira Halík', team: 'Operations',
    created: '3 days ago', updated: '1d ago',
    source: 'spreadsheet', filename: 'vending_pilot_traffic.csv',
    status: 'pending',
    upvotes: 9, views: 84, popular: false,
    promptedBy: false,
    tags: ['vending','pilot','traffic'],
    spec: {
      kpis: [
        { label: 'Avg footfall/day', value: '312',   delta: '+11%', trend: 'up' },
        { label: 'Conversion',       value: '4.2%',  delta: '−0.3pp', trend: 'down' },
        { label: 'AOV',              value: '€ 6.40', delta: '+2%',  trend: 'up' },
        { label: 'Best location',    value: 'PRG-B', delta: '8.1%',  trend: 'up' },
      ],
      charts: [
        { type: 'bar', title: 'Footfall by hour (avg)', data: Array.from({length:12}, (_,i) => ({ label: (i+8)+':00', value: Math.round([8,14,22,28,40,55,62,58,45,35,28,18][i]) })) },
      ],
    },
  },
  {
    id: 'com-4', name: 'Customer support sentiment by topic',
    desc: 'Ticket-level sentiment scored by an LLM, grouped by topic. Helps prioritise process fixes.',
    creator: 'Priya Shah', team: 'Product',
    created: '2 weeks ago', updated: '4d ago',
    source: 'chat',
    status: 'bi-building', biOwner: 'Aida Persson', biEta: 'May 26',
    upvotes: 51, views: 612, popular: true,
    promptedBy: 'Score support tickets by sentiment using the LLM column, group by topic, last 60 days',
    tags: ['support','sentiment','nlp'],
    spec: {
      kpis: [
        { label: 'Tickets scored',  value: '8,420', delta: '+4%',   trend: 'up' },
        { label: 'Avg sentiment',   value: '0.18',  delta: '−0.05', trend: 'down' },
        { label: 'Negative topics', value: '4',     delta: '+1',    trend: 'down' },
        { label: 'NPS proxy',       value: '23',    delta: '−6',    trend: 'down' },
      ],
      charts: [
        { type: 'bar', title: 'Sentiment by topic', data: [
            { label: 'Shipping',    value: 0.40 }, { label: 'Product',  value: 0.31 },
            { label: 'Account',     value: 0.18 }, { label: 'Payments', value: 0.05 },
            { label: 'Returns',     value: -0.12, color: 'oklch(0.58 0.18 25)' },
            { label: 'Damaged',     value: -0.42, color: 'oklch(0.58 0.18 25)' },
          ] },
      ],
    },
  },
  {
    id: 'com-5', name: 'Returns by carrier & reason',
    desc: 'Cross-tab of return reason against carrier. Started as a one-off slack export.',
    creator: 'Jakub R.', team: 'Operations',
    created: 'Yesterday', updated: 'Yesterday',
    source: 'spreadsheet', filename: 'returns_q1_q2.csv',
    status: 'draft',
    upvotes: 3, views: 22, popular: false,
    promptedBy: false,
    tags: ['returns','carrier','q1'],
    spec: {
      kpis: [
        { label: 'Total returns',    value: '2,140', delta: '+3%',  trend: 'down' },
        { label: 'Damaged-in-transit', value: '38%', delta: '+5pp', trend: 'down' },
        { label: 'Top carrier (returns)', value: 'GLS', delta: '52%', trend: 'down' },
        { label: 'Reshipment cost',  value: '€ 28k', delta: '+8%',  trend: 'down' },
      ],
      charts: [
        { type: 'bar', title: 'Returns by carrier', data: [
            { label: 'GLS',   value: 1110 }, { label: 'DHL',  value: 420 },
            { label: 'DPD',   value: 280 },  { label: 'Local', value: 180 },
            { label: 'PPL',   value: 150 },
          ] },
      ],
    },
  },
];

const COMMUNITY_STATUS_META = {
  draft:       { label: 'Draft',                 color: 'var(--fg-muted)', bg: 'var(--bg-muted)' },
  pending:     { label: 'Pending verification',  color: 'var(--warn)',     bg: 'var(--warn-soft)' },
  verified:    { label: 'Verified',              color: 'var(--success)',  bg: 'var(--success-soft)' },
  'bi-building': { label: 'BI implementing',     color: 'var(--accent)',   bg: 'var(--accent-soft)' },
};

Object.assign(window, { COMMUNITY_DASHBOARDS, COMMUNITY_STATUS_META });
