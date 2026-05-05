// Influencer Scraping Configurator App

const ScraperConfigApp = ({ go }) => {
  const [view, setView] = React.useState('list'); // list | create
  const [configs, setConfigs] = React.useState(SCRAPER_CONFIGS);

  if (view === 'create') {
    return <CreateConfigView onBack={() => setView('list')} onSave={(cfg) => { setConfigs(cs => [cfg, ...cs]); setView('list'); }} />;
  }

  return (
    <PageShell>
      <Breadcrumbs items={[
        { label: 'Data Apps' },
        { label: 'Scraping Configurator' },
      ]} />
      <PageTitle
        title="Influencer Scraping Configurator"
        subtitle="Manage scraper configurations, proxies and schedules."
        action={<Button variant="primary" icon="plus" onClick={() => setView('create')}>New configuration</Button>}
      />

      {/* Stat strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Active', value: configs.filter(c => c.status === 'Active').length, color: 'var(--success)' },
          { label: 'Paused', value: configs.filter(c => c.status === 'Paused').length, color: 'var(--fg-muted)' },
          { label: 'Errors', value: configs.filter(c => c.status === 'Error').length, color: 'var(--danger)' },
          { label: 'Drafts', value: configs.filter(c => c.status === 'Draft').length, color: 'var(--warn)' },
        ].map(s => (
          <Card key={s.label} style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', marginTop: 2, color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Config table */}
      <Card padded={false}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)' }}>
                {['Configuration', 'Scraper', 'Region', 'Schedule', 'Proxy', 'Last run', 'Next run', 'Status', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {configs.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-soft)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 7,
                        background: scraperMeta(c.scraper).bg, color: scraperMeta(c.scraper).fg,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 600,
                      }}>{c.scraper[0]}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg-soft)', fontFamily: 'JetBrains Mono, monospace' }}>{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>{c.scraper}</td>
                  <td style={tdStyle}><Chip>{c.region}</Chip></td>
                  <td style={tdStyle}>{c.schedule}</td>
                  <td style={{ ...tdStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5 }}>{c.proxy}</td>
                  <td style={{ ...tdStyle, color: 'var(--fg-muted)' }}>{c.lastRun}</td>
                  <td style={{ ...tdStyle, color: 'var(--fg-muted)' }}>{c.nextRun}</td>
                  <td style={tdStyle}><StatusPill status={c.status} /></td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <IconButton icon="more" boxSize={28} size={14} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  );
};

const tdStyle = { padding: '12px 14px', verticalAlign: 'middle' };

const scraperMeta = (name) => ({
  Instagram: { bg: 'oklch(0.95 0.05 15)',  fg: 'oklch(0.55 0.18 15)' },
  TikTok:    { bg: 'oklch(0.95 0.02 180)', fg: 'oklch(0.3 0.02 260)' },
  YouTube:   { bg: 'oklch(0.95 0.05 25)',  fg: 'oklch(0.55 0.18 25)' },
  Facebook:  { bg: 'oklch(0.95 0.05 255)', fg: 'oklch(0.5 0.18 265)' },
}[name] || { bg: 'var(--bg-muted)', fg: 'var(--fg-muted)' });

const StatusPill = ({ status }) => {
  const meta = {
    Active: { bg: 'var(--success-soft)', fg: 'var(--success)', dot: 'var(--success)' },
    Paused: { bg: 'var(--bg-muted)',     fg: 'var(--fg-muted)', dot: 'var(--fg-soft)' },
    Error:  { bg: 'var(--danger-soft)',  fg: 'var(--danger)',   dot: 'var(--danger)' },
    Draft:  { bg: 'var(--warn-soft)',    fg: 'var(--warn)',     dot: 'var(--warn)' },
  }[status] || { bg: 'var(--bg-muted)', fg: 'var(--fg-muted)', dot: 'var(--fg-soft)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 500,
      background: meta.bg, color: meta.fg,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.dot }} />
      {status}
    </span>
  );
};

const CreateConfigView = ({ onBack, onSave }) => {
  const [name, setName] = React.useState('');
  const [scraper, setScraper] = React.useState('');
  const [siteOpen, setSiteOpen] = React.useState(true);
  const [advOpen, setAdvOpen] = React.useState(false);
  const [proxyOpen, setProxyOpen] = React.useState(false);

  const [hashtags, setHashtags] = React.useState('');
  const [seedProfiles, setSeedProfiles] = React.useState('');
  const [region, setRegion] = React.useState('UK');
  const [depth, setDepth] = React.useState(3);
  const [maxResults, setMaxResults] = React.useState(500);
  const [followerMin, setFollowerMin] = React.useState(1000);
  const [followerMax, setFollowerMax] = React.useState(500000);
  const [respectRobots, setRespectRobots] = React.useState(true);
  const [proxy, setProxy] = React.useState('UK-residential');

  const canSave = name.trim() && scraper;

  const save = () => {
    if (!canSave) return;
    onSave({
      id: 'cfg-' + Date.now().toString(36),
      name: name.trim(),
      scraper,
      region,
      depth,
      proxy,
      status: 'Draft',
      lastRun: '—',
      nextRun: '—',
      schedule: '—',
    });
  };

  return (
    <PageShell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <button onClick={onBack} style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--bg-elev)', border: '1px solid var(--border)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevLeft" size={14} />
        </button>
        <Breadcrumbs items={[
          { label: 'Data Apps' },
          { label: 'Scraping Configurator', onClick: onBack },
          { label: 'New configuration' },
        ]} />
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.02em' }}>VilgainScout</h1>
        <p style={{ margin: '4px 0 24px', fontSize: 13.5, color: 'var(--fg-muted)' }}>Define a new scraper configuration.</p>

        <Card style={{ padding: 24 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: '-.01em', marginBottom: 18 }}>Scraper Configuration</h2>

          <Field label="Configuration Name">
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="e.g. Instagram UK — Fitness" />
          </Field>

          <Field label="Select Scraper">
            <div style={{ position: 'relative' }}>
              <select value={scraper} onChange={e => setScraper(e.target.value)} style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }}>
                <option value="">Choose an option</option>
                {SCRAPER_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Icon name="chevDown" size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-soft)', pointerEvents: 'none' }} />
            </div>
          </Field>

          {/* Site Configuration */}
          <Accordion label="Site Configuration" icon="grid" open={siteOpen} onToggle={() => setSiteOpen(v => !v)}>
            {!scraper ? (
              <div style={{
                padding: 14, borderRadius: 8,
                background: 'oklch(0.97 0.03 235)', color: 'oklch(0.45 0.14 240)',
                fontSize: 13, fontWeight: 500,
              }}>Select a scraper to configure site settings.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Hashtags to track" hint="Comma-separated">
                  <input value={hashtags} onChange={e => setHashtags(e.target.value)} style={inputStyle} placeholder="#fitness, #calisthenics, #veganprotein" />
                </Field>
                <Field label="Seed profiles" hint="One per line — starting accounts for graph expansion">
                  <textarea value={seedProfiles} onChange={e => setSeedProfiles(e.target.value)} style={{ ...inputStyle, minHeight: 80, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} placeholder="@vilgain_official
@helenalouisefit" />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Region">
                    <div style={{ position: 'relative' }}>
                      <select value={region} onChange={e => setRegion(e.target.value)} style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }}>
                        {['UK','CZ','SK','DE','PL','HU','Global'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <Icon name="chevDown" size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-soft)', pointerEvents: 'none' }} />
                    </div>
                  </Field>
                  <Field label="Graph depth" hint="How many hops from seed">
                    <input type="number" min={1} max={5} value={depth} onChange={e => setDepth(+e.target.value)} style={inputStyle} />
                  </Field>
                </div>
              </div>
            )}
          </Accordion>

          {/* Advanced */}
          <Accordion label="Advanced Settings" icon="settings" open={advOpen} onToggle={() => setAdvOpen(v => !v)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Max results per run">
                  <input type="number" value={maxResults} onChange={e => setMaxResults(+e.target.value)} style={inputStyle} />
                </Field>
                <Field label="Request delay (ms)">
                  <input type="number" defaultValue={1200} style={inputStyle} />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Min followers">
                  <input type="number" value={followerMin} onChange={e => setFollowerMin(+e.target.value)} style={inputStyle} />
                </Field>
                <Field label="Max followers">
                  <input type="number" value={followerMax} onChange={e => setFollowerMax(+e.target.value)} style={inputStyle} />
                </Field>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 0' }}>
                <input type="checkbox" checked={respectRobots} onChange={e => setRespectRobots(e.target.checked)} />
                <span style={{ fontSize: 13 }}>Respect robots.txt</span>
              </label>
            </div>
          </Accordion>

          {/* Proxy */}
          <Accordion label="Proxy" icon="shield" open={proxyOpen} onToggle={() => setProxyOpen(v => !v)}>
            <Field label="Proxy pool">
              <div style={{ position: 'relative' }}>
                <select value={proxy} onChange={e => setProxy(e.target.value)} style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }}>
                  {PROXY_POOLS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <Icon name="chevDown" size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-soft)', pointerEvents: 'none' }} />
              </div>
            </Field>
            <Field label="Rotation strategy">
              <div style={{ position: 'relative' }}>
                <select defaultValue="per-request" style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }}>
                  <option value="per-request">Per request</option>
                  <option value="per-session">Per session</option>
                  <option value="sticky-10m">Sticky (10 min)</option>
                </select>
                <Icon name="chevDown" size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-soft)', pointerEvents: 'none' }} />
              </div>
            </Field>
          </Accordion>

          <button onClick={save} disabled={!canSave} style={{
            marginTop: 20, width: '100%', padding: '12px',
            background: canSave ? 'oklch(0.64 0.2 25)' : 'oklch(0.9 0.04 25)',
            color: '#fff', fontWeight: 500, fontSize: 14,
            borderRadius: 10, cursor: canSave ? 'pointer' : 'not-allowed',
            transition: 'background .15s',
          }}>
            Save Configuration
          </button>
        </Card>
      </div>
    </PageShell>
  );
};

const Field = ({ label, hint, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, marginBottom: 5, color: 'var(--fg)' }}>{label}</label>
    {children}
    {hint && <div style={{ fontSize: 11.5, color: 'var(--fg-soft)', marginTop: 4 }}>{hint}</div>}
  </div>
);

const inputStyle = {
  width: '100%', padding: '9px 12px',
  background: 'var(--bg-muted)', border: '1px solid transparent',
  borderRadius: 8, fontSize: 13, color: 'var(--fg)', outline: 'none',
  transition: 'all .15s ease',
};

const Accordion = ({ label, icon, open, onToggle, children }) => (
  <div style={{
    border: '1px solid var(--border)', borderRadius: 10,
    marginTop: 12, overflow: 'hidden',
  }}>
    <button onClick={onToggle} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 14px', textAlign: 'left',
      background: open ? 'var(--bg-soft)' : 'var(--bg-elev)',
      borderBottom: open ? '1px solid var(--border)' : 'none',
    }}>
      <Icon name={open ? 'chevDown' : 'chevRight'} size={13} style={{ color: 'var(--fg-muted)' }} />
      <Icon name={icon} size={14} style={{ color: 'var(--fg-muted)' }} />
      <span style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</span>
    </button>
    {open && <div style={{ padding: 14, background: 'var(--bg-elev)' }}>{children}</div>}
  </div>
);

Object.assign(window, { ScraperConfigApp });
