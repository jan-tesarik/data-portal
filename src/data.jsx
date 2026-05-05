// Mock data for the portal

const DOMAIN_META = {
  Finance:     { color: 'oklch(0.55 0.18 265)', soft: 'oklch(0.96 0.03 265)', icon: 'dollar' },
  Marketing:   { color: 'oklch(0.55 0.18 305)', soft: 'oklch(0.96 0.03 305)', icon: 'bolt' },
  Product:     { color: 'oklch(0.6 0.12 200)',  soft: 'oklch(0.96 0.03 200)', icon: 'package' },
  Operations:  { color: 'oklch(0.62 0.14 155)', soft: 'oklch(0.96 0.03 155)', icon: 'briefcase' },
  People:      { color: 'oklch(0.72 0.14 75)',  soft: 'oklch(0.97 0.04 75)',  icon: 'users' },
};

const KPIS = [
  { id: 'revenue', title: 'Revenue',      value: '€ 655M', delta: '+12.4%', trend: 'up',   period: 'vs last quarter', icon: 'dollar', spark: [35,42,38,44,46,52,58,55,62,68,72,70,78] },
  { id: 'gm',      title: 'Gross Margin', value: '45.1%',  delta: '+0.8pp', trend: 'up',   period: 'vs last quarter', icon: 'trendUp', spark: [40,41,40,42,43,42,43,44,44,45,44,45,45] },
  { id: 'users',   title: 'Active Users', value: '1.82M',  delta: '+4.2%',  trend: 'up',   period: 'last 28 days',    icon: 'users',  spark: [12,13,13,14,14,15,15,16,16,17,17,18,18] },
  { id: 'conv',    title: 'Conversion',   value: '3.64%',  delta: '−0.2pp', trend: 'down', period: 'last 28 days',    icon: 'cart',   spark: [4,4.1,4,3.9,3.8,3.8,3.7,3.7,3.6,3.7,3.6,3.65,3.64] },
];

const DASHBOARDS = [
  // Finance
  { id: 'fin-sales-main',  domain: 'Finance', name: 'Sales — Main Metrics',      desc: 'Revenue, gross margin and products sold across all channels and geographies.', owner: 'Elena Váňová',  tags: ['revenue','gm','weekly'],  views: '2.1k/wk', updated: '4h ago', fav: true },
  { id: 'fin-pnl',         domain: 'Finance', name: 'P&L by Business Unit',      desc: 'Income statement drill-down by business unit, region and legal entity.',      owner: 'Martin Kovač',  tags: ['pnl','finance','mtd'],    views: '820/wk',  updated: '1d ago', fav: false },
  { id: 'fin-cash',        domain: 'Finance', name: 'Cash & Working Capital',    desc: 'Cashflow, AR/AP aging and working capital trends with 13-week forecast.',     owner: 'Aida Persson',  tags: ['cash','forecast'],        views: '410/wk',  updated: '2d ago', fav: false },

  // Marketing
  { id: 'mkt-campaigns',   domain: 'Marketing', name: 'Campaign Performance',    desc: 'Spend, CAC, ROAS and attribution across paid channels and creative sets.',   owner: 'Jonas Řehák',   tags: ['cac','roas','paid'],      views: '1.4k/wk', updated: '2h ago', fav: true },
  { id: 'mkt-funnel',      domain: 'Marketing', name: 'Acquisition Funnel',      desc: 'Visits → signup → first order funnel with cohort retention overlay.',         owner: 'Lena Bauer',    tags: ['funnel','cohort'],        views: '930/wk',  updated: '6h ago', fav: false },
  { id: 'mkt-brand',       domain: 'Marketing', name: 'Brand & Content',         desc: 'Share of voice, content engagement and organic traffic breakdown.',           owner: 'Jonas Řehák',   tags: ['brand','seo'],            views: '280/wk',  updated: '3d ago', fav: false },

  // Product
  { id: 'prd-engagement',  domain: 'Product', name: 'Engagement & Retention',    desc: 'DAU/WAU/MAU, feature adoption and retention curves by cohort.',                owner: 'Priya Shah',    tags: ['dau','retention'],        views: '1.1k/wk', updated: '1h ago', fav: true },
  { id: 'prd-experiments', domain: 'Product', name: 'Experiments',               desc: 'Running A/B tests with lift, significance and guardrail metrics.',             owner: 'Kenji Sato',    tags: ['ab','experiments'],       views: '640/wk',  updated: '30m ago', fav: false },
  { id: 'prd-quality',     domain: 'Product', name: 'Quality & Errors',          desc: 'Crash-free sessions, p95 latency and error budget burn by service.',            owner: 'Kenji Sato',    tags: ['reliability','slo'],      views: '390/wk',  updated: '1d ago', fav: false },

  // Operations
  { id: 'ops-supply',      domain: 'Operations', name: 'Supply Chain',           desc: 'On-time delivery, inbound/outbound throughput and supplier performance.',      owner: 'Tomáš Lang',    tags: ['supply','otd'],           views: '520/wk',  updated: '5h ago', fav: false },
  { id: 'ops-inventory',   domain: 'Operations', name: 'Inventory Health',       desc: 'Stock cover, ABC analysis, dead stock and replenishment signals.',             owner: 'Tomáš Lang',    tags: ['inventory','abc'],        views: '710/wk',  updated: '8h ago', fav: false },
  { id: 'ops-support',     domain: 'Operations', name: 'Customer Support',       desc: 'Ticket volume, CSAT, first-response and resolution time by queue.',            owner: 'Mira Halík',    tags: ['csat','support'],         views: '340/wk',  updated: '12h ago', fav: false },
];

const EXEC_DASHBOARDS = [
  { id: 'exec-ceo-sales',  name: 'Sales Dashboard',             desc: 'Company-wide revenue pulse with country, channel and target deltas.', owner: 'Office of the CEO', updated: 'Live • 2 min ago', tag: 'Board' },
  { id: 'exec-cfo',        name: 'Marketing Dashboard',         desc: 'Campaign performance, spend efficiency, channel mix and attribution.', owner: 'Office of the CMO', updated: 'Live • 5 min ago', tag: 'Board' },
  { id: 'exec-coo',        name: 'Logistics Dashboard',         desc: 'Operational KPIs across supply, inventory, support and fulfilment.',  owner: 'Office of the COO', updated: 'Live • 8 min ago', tag: 'Executive' },
  { id: 'exec-cpo',        name: 'Physical Product Dashboard',  desc: 'Product health: quality, returns, category performance and lifecycle.', owner: 'Office of the CPO', updated: 'Live • 11 min ago', tag: 'Executive' },
];

const METRICS = [
  { id: 'm-revenue',    name: 'Revenue',                domain: 'Finance',    status: 'Certified',  owner: 'Elena Váňová', desc: 'Net revenue after returns and discounts, in reporting currency.', dims: ['Country','Channel','Category','Manufacturer'], formula: 'sum(gross_sales) − sum(returns) − sum(discounts)', dashboards: ['fin-sales-main','fin-pnl','exec-ceo-sales'], updated: '2 days ago' },
  { id: 'm-gm',         name: 'Gross Margin %',         domain: 'Finance',    status: 'Certified',  owner: 'Elena Váňová', desc: '(Revenue − COGS) divided by Revenue, excluding shipping.',        dims: ['Country','Category','Product Variant'],      formula: '(revenue − cogs) / revenue',                       dashboards: ['fin-sales-main','fin-pnl'], updated: '2 days ago' },
  { id: 'm-aov',        name: 'Average Order Value',    domain: 'Finance',    status: 'Certified',  owner: 'Martin Kovač', desc: 'Mean order value for paid orders in the period.',                 dims: ['Channel','Country','Segment'],               formula: 'revenue / count(distinct order_id)',               dashboards: ['fin-sales-main'], updated: '1 week ago' },
  { id: 'm-cac',        name: 'Customer Acquisition Cost', domain: 'Marketing', status: 'Certified', owner: 'Jonas Řehák', desc: 'Paid marketing spend per newly acquired paying customer.',        dims: ['Channel','Campaign','Country'],              formula: 'sum(paid_spend) / count(new_paying_customers)',    dashboards: ['mkt-campaigns','mkt-funnel'], updated: '3 days ago' },
  { id: 'm-roas',       name: 'Return on Ad Spend',     domain: 'Marketing',  status: 'Certified',  owner: 'Jonas Řehák', desc: 'Attributed revenue divided by paid spend, last-click model.',     dims: ['Channel','Campaign','Creative'],             formula: 'attributed_revenue / paid_spend',                  dashboards: ['mkt-campaigns'], updated: '3 days ago' },
  { id: 'm-conv',       name: 'Conversion Rate',        domain: 'Marketing',  status: 'Certified',  owner: 'Lena Bauer',  desc: 'Sessions with a completed order divided by total sessions.',      dims: ['Device','Country','Landing Page'],           formula: 'converted_sessions / total_sessions',              dashboards: ['mkt-funnel','prd-engagement'], updated: '1 day ago' },
  { id: 'm-dau',        name: 'Daily Active Users',     domain: 'Product',    status: 'Certified',  owner: 'Priya Shah',  desc: 'Distinct signed-in users performing any qualifying event that day.', dims: ['Platform','Country','Plan'],              formula: 'count(distinct user_id where qualifying_event)',   dashboards: ['prd-engagement'], updated: '4 days ago' },
  { id: 'm-retention',  name: 'Week-4 Retention',       domain: 'Product',    status: 'Draft',      owner: 'Priya Shah',  desc: 'Share of cohort returning in week 4 after first session.',        dims: ['Cohort Week','Platform','Country'],          formula: 'returning_users_w4 / cohort_size',                 dashboards: ['prd-engagement'], updated: '6 days ago' },
  { id: 'm-nps',        name: 'Net Promoter Score',     domain: 'Product',    status: 'Certified',  owner: 'Mira Halík',  desc: '% promoters (9-10) − % detractors (0-6) from in-product survey.', dims: ['Plan','Country','Segment'],                  formula: 'pct(promoters) − pct(detractors)',                 dashboards: ['prd-engagement','exec-cpo'], updated: '5 days ago' },
  { id: 'm-otd',        name: 'On-Time Delivery %',     domain: 'Operations', status: 'Certified',  owner: 'Tomáš Lang',  desc: 'Orders delivered by promised date divided by total shipped.',     dims: ['Region','Carrier','SKU Class'],              formula: 'on_time_orders / shipped_orders',                  dashboards: ['ops-supply'], updated: '2 days ago' },
  { id: 'm-stockcover', name: 'Stock Cover (weeks)',    domain: 'Operations', status: 'Certified',  owner: 'Tomáš Lang',  desc: 'On-hand inventory divided by average weekly sell-out.',           dims: ['Warehouse','Category','Supplier'],           formula: 'stock_on_hand / avg(weekly_sell_out)',             dashboards: ['ops-inventory'], updated: '1 day ago' },
  { id: 'm-csat',       name: 'CSAT',                   domain: 'Operations', status: 'Certified',  owner: 'Mira Halík',  desc: 'Average customer satisfaction score on resolved support tickets.', dims: ['Queue','Channel','Country'],                 formula: 'avg(csat_score)',                                  dashboards: ['ops-support'], updated: '2 days ago' },
  { id: 'm-churn',      name: 'Logo Churn (monthly)',   domain: 'Finance',    status: 'Deprecated', owner: 'Aida Persson', desc: 'Deprecated in favour of Revenue Churn. Do not use for new work.', dims: ['Plan','Segment'],                             formula: 'churned_logos / logos_start',                      dashboards: [], updated: '2 months ago' },
  { id: 'm-hc',         name: 'Headcount',              domain: 'People',     status: 'Certified',  owner: 'Noa Wenger',  desc: 'Full-time-equivalent employees at period end, excluding contractors.', dims: ['Department','Country','Level'],            formula: 'sum(fte) at period_end',                           dashboards: [], updated: '1 week ago' },
  { id: 'm-attrition',  name: 'Attrition (annualised)', domain: 'People',     status: 'Draft',      owner: 'Noa Wenger',  desc: 'Voluntary leavers over trailing 12 months, annualised.',           dims: ['Department','Tenure Band'],                  formula: 'voluntary_leavers_ttm / avg_headcount',            dashboards: [], updated: '3 weeks ago' },
];

const RECENT = ['fin-sales-main','mkt-campaigns','prd-engagement','exec-ceo-sales','ops-inventory'];
const FAVORITES = DASHBOARDS.filter(d => d.fav).map(d => d.id);

const QUICK_LINKS = [
  { id: 'ql-sql',    title: 'SQL Workbench', desc: 'Write and share queries across certified warehouses.', icon: 'database' },
  { id: 'ql-notebk', title: 'Notebooks',     desc: 'Python + SQL notebooks with scheduled runs.',          icon: 'book' },
  { id: 'ql-docs',   title: 'Data Docs',     desc: 'Table lineage, ownership and column descriptions.',    icon: 'layers' },
  { id: 'ql-req',    title: 'Access Requests', desc: 'Request or approve data access across domains.',     icon: 'shield' },
];

const SUGGESTED_Q = [
  'What is revenue this month?',
  'Show customer growth by region',
  'Explain gross margin',
  'Which campaigns had the best ROAS last week?',
  'How is week-4 retention trending?',
];

const NOTIFICATIONS = [
  { id: 'n1', title: 'Revenue dashboard refresh complete', desc: 'Finance · Sales — Main Metrics', time: '2 min ago', unread: true },
  { id: 'n2', title: 'New metric awaiting certification',  desc: 'Week-4 Retention · drafted by Priya Shah', time: '1 h ago',  unread: true },
  { id: 'n3', title: 'Access approved',                     desc: 'You can now query warehouse.ops.shipments', time: '5 h ago',  unread: false },
  { id: 'n4', title: 'Sales Dashboard pinned to you',       desc: 'by Office of the CEO',                      time: 'Yesterday',  unread: false },
];

Object.assign(window, {
  DOMAIN_META, KPIS, DASHBOARDS, EXEC_DASHBOARDS, METRICS,
  RECENT, FAVORITES, QUICK_LINKS, SUGGESTED_Q, NOTIFICATIONS,
});
