// Executive dashboards — visually distinct (dark, premium)

const ExecutiveList = ({ go }) => {
  return (
    <PageShell>
      <PageTitle
        title="Executive Dashboards"
        subtitle="Board-ready views. Real-time, curated by the Office of the CEO and finance leadership."
        action={<Button variant="secondary" icon="download">Export board pack</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {EXEC_DASHBOARDS.map(d => (
          <ExecCard key={d.id} dash={d} go={go} />
        ))}
      </div>
    </PageShell>
  );
};

const ExecCard = ({ dash, go }) => (
  <div onClick={() => go({ page: 'executive-detail', id: dash.id })} style={{
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, oklch(0.17 0.025 265) 0%, oklch(0.22 0.04 305) 100%)',
    color: '#fff',
    border: '1px solid oklch(0.3 0.03 265)',
    borderRadius: 'var(--radius-lg)',
    padding: 22,
    cursor: 'pointer',
    transition: 'all .2s ease',
    boxShadow: 'var(--shadow-sm)',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
  >
    {/* decorative */}
    <svg style={{ position: 'absolute', top: -40, right: -40, opacity: 0.2 }} width="220" height="220" viewBox="0 0 220 220">
      <circle cx="110" cy="110" r="108" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 4" />
      <circle cx="110" cy="110" r="70" fill="none" stroke="white" strokeWidth="1" />
      <circle cx="110" cy="110" r="40" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
    </svg>

    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.09em', opacity: 0.65 }}>
      <Icon name="crown" size={13} /> {dash.tag}
    </div>
    <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', marginTop: 12 }}>{dash.name}</div>
    <div style={{ fontSize: 13, opacity: 0.65, marginTop: 6, lineHeight: 1.5, maxWidth: 420 }}>{dash.desc}</div>

    <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, opacity: 0.75 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.75 0.15 155)', boxShadow: '0 0 10px oklch(0.75 0.15 155 / 0.8)' }} />
        {dash.updated}
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500 }}>
        Open <Icon name="arrowRight" size={13} />
      </div>
    </div>
  </div>
);

// ---- Executive detail (full-screen feel) ----

const countries = [
  { flag: '🇨🇿', name: 'CZ', val: 1.82, yoy: 1.05 },
  { flag: '🇸🇰', name: 'SK', val: 0.98, yoy: 0.58 },
  { flag: '🇩🇪', name: 'DE', val: 0.74, yoy: 0.42 },
  { flag: '🇵🇱', name: 'PL', val: 0.54, yoy: 0.36 },
  { flag: '🇦🇹', name: 'AT', val: 0.38, yoy: 0.22 },
  { flag: '🇭🇺', name: 'HU', val: 0.31, yoy: 0.19 },
  { flag: '🇷🇴', name: 'RO', val: 0.24, yoy: 0.16 },
  { flag: '🇸🇮', name: 'SI', val: 0.18, yoy: 0.12 },
  { flag: '🇭🇷', name: 'HR', val: 0.14, yoy: 0.10 },
  { flag: '🇧🇬', name: 'BG', val: 0.11, yoy: 0.08 },
  { flag: '🇮🇹', name: 'IT', val: 0.09, yoy: 0.05 },
  { flag: '🇳🇱', name: 'NL', val: 0.08, yoy: 0.06 },
  { flag: '🇺🇸', name: 'US', val: 0.04, yoy: 0.03 },
];

const ExecMetricStrip = ({ label, value, items }) => (
  <Card style={{
    padding: 16, borderRadius: 'var(--radius)',
    display: 'grid', gridTemplateColumns: `minmax(200px, 1fr) repeat(${items.length}, minmax(0,1fr))`,
    alignItems: 'center', gap: 16,
  }}>
    <div>
      <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-.02em', marginTop: 2 }}>{value}</div>
      <div style={{ fontSize: 10.5, color: 'var(--fg-soft)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>HISTOGRAM · CZK</div>
    </div>
    {items.map(([k, v, tone], i) => (
      <div key={i} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>{k}</div>
        <div style={{
          fontSize: 18, fontWeight: 600, marginTop: 4, fontVariantNumeric: 'tabular-nums',
          color: tone === 'neg' ? 'var(--danger)' : tone === 'pos' ? 'var(--success)' : 'var(--fg)',
        }}>{v}</div>
      </div>
    ))}
  </Card>
);

const ExecutiveDetail = ({ id, go }) => {
  const dash = EXEC_DASHBOARDS.find(d => d.id === id) || EXEC_DASHBOARDS[0];
  const [countryFilter, setCountryFilter] = React.useState('All');
  const [period, setPeriod] = React.useState('Yesterday');
  const [granularity, setGranularity] = React.useState('Day');

  return (
    <div style={{ background: 'oklch(0.985 0.005 265)', minHeight: 'calc(100vh - var(--header-h))' }}>
      <PageShell style={{ paddingTop: 24, paddingBottom: 24 }}>
        <Breadcrumbs items={[
          { label: 'Executive', onClick: () => go({ page: 'executive' }) },
          { label: dash.name },
        ]} />

        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: '-.02em' }}>{dash.name}</h1>
            <Badge tone="success" style={{ padding: '4px 10px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', marginRight: 2 }} /> LIVE
            </Badge>
            <Badge tone="accent" style={{ padding: '4px 10px' }}>BOARD</Badge>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Last refresh 2026-04-20 13:38:22</span>
            <IconButton icon="maximize" />
            <IconButton icon="share" />
            <Button variant="primary" size="sm" icon="download">Export</Button>
          </div>
        </div>
      </PageShell>

      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 36px 60px' }}>
        {/* Filters panel */}
        <Card padded={false} style={{ overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* countries */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {countries.map(c => (
                <button key={c.name} onClick={() => setCountryFilter(c.name)} style={{
                  width: 34, height: 34, borderRadius: '50%',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: countryFilter === c.name ? 'var(--accent-soft)' : 'var(--bg-soft)',
                  border: `2px solid ${countryFilter === c.name ? 'var(--accent)' : 'transparent'}`,
                  fontSize: 16, transition: 'all .15s',
                }} title={c.name}>{c.flag}</button>
              ))}
              <Chip active={countryFilter === 'All'} onClick={() => setCountryFilter('All')}>All Countries</Chip>
            </div>

            {/* segments */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['All','B2C','B2B','Marketplace','Retail','Vending'].map((s,i) => (
                <Chip key={s} active={i === 0}>{s}</Chip>
              ))}
            </div>

            {/* period + granularity */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Yesterday','Prev Week','Prev Month','L30D','MTD','QTD','YTD'].map(p => (
                  <Chip key={p} active={period === p} onClick={() => setPeriod(p)}>{p}</Chip>
                ))}
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-muted)', borderRadius: 8 }}>
                  {['Day','Week','Month','Quarter'].map(g => (
                    <button key={g} onClick={() => setGranularity(g)} style={{
                      padding: '5px 12px', borderRadius: 6,
                      fontSize: 12, fontWeight: 500,
                      background: granularity === g ? 'var(--bg-elev)' : 'transparent',
                      color: granularity === g ? 'var(--fg)' : 'var(--fg-muted)',
                      boxShadow: granularity === g ? 'var(--shadow-xs)' : 'none',
                    }}>{g}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-muted)', borderRadius: 8 }}>
                  {['CZK','EUR'].map((g,i) => (
                    <button key={g} style={{
                      padding: '5px 12px', borderRadius: 6,
                      fontSize: 12, fontWeight: 500,
                      background: i === 0 ? 'var(--bg-elev)' : 'transparent',
                      color: i === 0 ? 'var(--fg)' : 'var(--fg-muted)',
                      boxShadow: i === 0 ? 'var(--shadow-xs)' : 'none',
                    }}>{g}</button>
                  ))}
                </div>
                <IconButton icon="refresh" />
              </div>
            </div>
          </div>
        </Card>

        {/* Total Revenue strip */}
        <ExecMetricStrip
          label="Total Revenue"
          value="5.61M"
          items={[
            ['WoW', '−33.9%', 'neg'],
            ['4W ago', '−7.43%', 'neg'],
            ['QoQ', '−27.3%', 'neg'],
            ['YoY', '+202%', 'pos'],
            ['vs Target', '82.6%', 'pos'],
            ['vs Forecast', '73.0%', 'pos'],
          ]}
        />

        {/* Revenue Trend */}
        <Card style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Revenue Trend</div>
            <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-muted)', borderRadius: 8 }}>
              {['Show Total','4W ago','QoQ','YoY'].map((t,i) => (
                <button key={t} style={{
                  padding: '5px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 500,
                  background: i === 3 ? 'var(--bg-elev)' : 'transparent',
                  color: i === 3 ? 'var(--fg)' : 'var(--fg-muted)',
                  boxShadow: i === 3 ? 'var(--shadow-xs)' : 'none',
                }}>{t}</button>
              ))}
            </div>
          </div>
          <CountryBars />
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 14, fontSize: 11, color: 'var(--fg-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: 'oklch(0.55 0.18 265)', borderRadius: 2 }} /> Revenue
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: 'oklch(0.55 0.18 265)', borderRadius: 2, opacity: .35 }} /> YoY
            </span>
          </div>
        </Card>

        {/* vs Target strip */}
        <div style={{ marginTop: 16 }}>
          <ExecMetricStrip
            label="Total Revenue vs Target Revenue"
            value="82.6%"
            items={[
              ['WoW', '−31.5pp', 'neg'],
              ['4W ago', '+7.27pp', 'pos'],
              ['QoQ', '−26.1pp', 'neg'],
              ['YoY', '+11.2pp', 'pos'],
            ]}
          />
        </div>

        {/* vs target trend */}
        <Card style={{ marginTop: 16, minHeight: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Revenue vs Target Revenue Trend (%)</div>
            <Chip active>Show Total</Chip>
          </div>
          <LineChart
            series={[
              { name: 'vs Target', color: 'oklch(0.55 0.18 265)', data: [72,78,82,74,85,88,80,82,79,83,86,82.6] },
              { name: 'Target 100%', color: 'oklch(0.62 0.14 155)', data: Array(12).fill(100), dashed: true },
            ]}
            xLabels={['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr']}
            yFmt={v => v + '%'}
            height={260}
          />
        </Card>
      </div>
    </div>
  );
};

const CountryBars = () => {
  const max = Math.max(...countries.map(c => c.val));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 280, padding: '8px 4px 0' }}>
      {countries.map((c, i) => {
        const hue = (i * 36) % 360;
        const color = `oklch(0.58 0.17 ${hue})`;
        return (
          <div key={c.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', gap: 3, justifyContent: 'center' }}>
              <div style={{ width: '44%', height: `${(c.val / max) * 100}%`, background: color, borderRadius: '4px 4px 0 0', boxShadow: `0 2px 8px ${color}33` }} />
              <div style={{ width: '44%', height: `${(c.yoy / max) * 100}%`, background: color, opacity: 0.35, borderRadius: '4px 4px 0 0' }} />
            </div>
            <div style={{ fontSize: 16 }}>{c.flag}</div>
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, { ExecutiveList, ExecutiveDetail });
