// Metrics catalog + detail

const MetricRow = ({ m, go }) => {
  const meta = DOMAIN_META[m.domain];
  return (
    <button onClick={() => go({ page: 'metric-detail', id: m.id })} style={{
      display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.6fr 1fr 0.8fr 30px',
      alignItems: 'center', gap: 16, width: '100%',
      padding: '14px 16px', background: 'var(--bg-elev)',
      border: '1px solid var(--border)', borderTop: 'none',
      textAlign: 'left', transition: 'background .12s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-soft)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elev)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: meta.soft, color: meta.color,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="metric" size={13} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-.005em' }}>{m.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--fg-soft)', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.formula}</div>
        </div>
      </div>
      <div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--fg)', fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color }} />
          {m.domain}
        </span>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', lineHeight: 1.45, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {m.desc}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Avatar name={m.owner} size={22} />
        <span style={{ fontSize: 12.5 }}>{m.owner}</span>
      </div>
      <div><StatusDot status={m.status} /></div>
      <Icon name="chevRight" size={14} style={{ color: 'var(--fg-soft)' }} />
    </button>
  );
};

const MetricsCatalog = ({ go }) => {
  const [q, setQ] = React.useState('');
  const [domain, setDomain] = React.useState('All');
  const [status, setStatus] = React.useState('All');
  const domains = ['All', ...Object.keys(DOMAIN_META)];
  const statuses = ['All', 'Certified', 'Draft', 'Deprecated'];

  const filtered = METRICS.filter(m =>
    (domain === 'All' || m.domain === domain) &&
    (status === 'All' || m.status === status) &&
    (q === '' || m.name.toLowerCase().includes(q.toLowerCase()) || m.desc.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <PageShell>
      <PageTitle
        title="Metrics Catalog"
        subtitle="One source of truth. Every metric ships with an owner, a definition, and the dashboards that use it."
        action={<div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="book">Glossary</Button>
          <Button variant="primary" icon="plus">Propose metric</Button>
        </div>}
      />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { k: 'Total metrics', v: METRICS.length, sub: 'across 5 domains' },
          { k: 'Certified',     v: METRICS.filter(m => m.status === 'Certified').length, sub: '100% documented' },
          { k: 'Draft',         v: METRICS.filter(m => m.status === 'Draft').length,     sub: 'in review' },
          { k: 'Deprecated',    v: METRICS.filter(m => m.status === 'Deprecated').length, sub: 'use successor' },
        ].map(s => (
          <Card key={s.k} style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{s.k}</div>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.02em', marginTop: 2 }}>{s.v}</div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-soft)', marginTop: 2 }}>{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 420 }}>
          <Icon name="search" size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-soft)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search metrics — e.g. revenue, retention"
            style={{ width: '100%', height: 36, padding: '0 12px 0 34px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, outline: 'none', color: 'var(--fg)' }} />
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {domains.map(d => <Chip key={d} active={domain === d} onClick={() => setDomain(d)}>{d}</Chip>)}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 11.5, color: 'var(--fg-soft)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Status</span>
        <div style={{ display: 'flex', gap: 5 }}>
          {statuses.map(s => <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>)}
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--fg-muted)' }}>{filtered.length} metrics</div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        {/* header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.6fr 1fr 0.8fr 30px',
          gap: 16, padding: '10px 16px',
          background: 'var(--bg-soft)', border: '1px solid var(--border)',
          fontSize: 10.5, fontWeight: 600, color: 'var(--fg-soft)',
          textTransform: 'uppercase', letterSpacing: '.06em',
        }}>
          <div>Metric</div>
          <div>Domain</div>
          <div>Description</div>
          <div>Owner</div>
          <div>Status</div>
          <div />
        </div>
        {filtered.map(m => <MetricRow key={m.id} m={m} go={go} />)}
        {filtered.length === 0 && (
          <div style={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderTop: 'none' }}>
            <Empty icon="search" title="No metrics match" desc="Try a different domain or clear the search." />
          </div>
        )}
      </div>
    </PageShell>
  );
};

// ---- Metric detail ----

const MetricDetail = ({ id, go }) => {
  const m = METRICS.find(x => x.id === id) || METRICS[0];
  const meta = DOMAIN_META[m.domain];
  const usedIn = m.dashboards.map(did => [...DASHBOARDS, ...EXEC_DASHBOARDS].find(d => d.id === did)).filter(Boolean);

  return (
    <PageShell>
      <Breadcrumbs items={[
        { label: 'Metrics Catalog', onClick: () => go({ page: 'metrics' }) },
        { label: m.domain },
        { label: m.name },
      ]} />

      <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 13,
            background: meta.color, color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <Icon name="metric" size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.02em' }}>{m.name}</h1>
              <StatusDot status={m.status} />
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginTop: 6 }}>{m.desc}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="copy" size="sm">Copy SQL</Button>
          <Button variant="secondary" icon="share" size="sm">Share</Button>
          <Button variant="primary" size="sm" icon="eye" onClick={() => usedIn[0] && go({ page: usedIn[0].id.startsWith('exec-') ? 'executive-detail' : 'dashboard-detail', id: usedIn[0].id })}>See in dashboard</Button>
        </div>
      </div>

      {/* Meta strip */}
      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { k: 'Domain', v: m.domain, icon: meta.icon, color: meta.color },
          { k: 'Owner',  v: m.owner, icon: 'user' },
          { k: 'Last verified', v: m.updated, icon: 'shield' },
          { k: 'Used in', v: `${usedIn.length} dashboard${usedIn.length === 1 ? '' : 's'}`, icon: 'grid' },
        ].map(x => (
          <Card key={x.k} style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--bg-muted)', color: x.color || 'var(--fg)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={x.icon} size={15} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-soft)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{x.k}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 1 }}>{x.v}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Left */}
        <div>
          {/* Business definition */}
          <Card>
            <SectionHeader title="Business definition" subtitle="How business teams should interpret this metric" />
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: 'var(--fg)' }}>
              {m.desc} It is reported in the company's reporting currency (CZK) and converted from local currency at month-end rates.
              Only transactions with a completed status are counted; refunds, returns and manual adjustments are netted out.
            </p>
          </Card>

          {/* Formula */}
          <Card style={{ marginTop: 16 }}>
            <SectionHeader title="Definition" subtitle="Computed from the certified warehouse layer" />
            <div style={{
              background: 'oklch(0.18 0.01 265)', color: 'oklch(0.92 0.01 265)',
              borderRadius: 10, padding: '14px 16px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, lineHeight: 1.7,
              overflowX: 'auto',
            }}>
              <div style={{ color: 'oklch(0.7 0.15 280)' }}>-- {m.name} (metric · {m.status.toLowerCase()})</div>
              <div><span style={{ color: 'oklch(0.75 0.15 220)' }}>SELECT</span> {m.formula} <span style={{ color: 'oklch(0.75 0.15 220)' }}>AS</span> {m.id.replace('m-','')}</div>
              <div><span style={{ color: 'oklch(0.75 0.15 220)' }}>FROM</span>   warehouse.<span style={{ color: 'oklch(0.8 0.15 120)' }}>{m.domain.toLowerCase()}_mart</span></div>
              <div><span style={{ color: 'oklch(0.75 0.15 220)' }}>GROUP BY</span> {m.dims.slice(0,2).map(d => d.toLowerCase().replace(' ','_')).join(', ')}</div>
            </div>
          </Card>

          {/* Example usage */}
          <Card style={{ marginTop: 16 }}>
            <SectionHeader title="Example usage" subtitle="Copy and adapt" />
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.9, color: 'var(--fg)' }}>
              <li><b>Weekly business review:</b> {m.name.toLowerCase()} by {m.dims[0].toLowerCase()} over last 13 weeks, compared to prior year.</li>
              <li><b>Country drill-down:</b> segment by {m.dims[1]?.toLowerCase() || 'country'} to spot outliers.</li>
              <li><b>Alerting:</b> trigger when WoW change exceeds ±10% with minimum sample size 2,000.</li>
            </ul>
          </Card>
        </div>

        {/* Right */}
        <div>
          {/* Dimensions */}
          <Card>
            <SectionHeader title="Dimensions" subtitle="Slices supported out-of-the-box" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {m.dims.map(d => (
                <div key={d} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 8,
                  background: 'var(--bg-soft)',
                }}>
                  <Icon name="layers" size={14} style={{ color: 'var(--fg-soft)' }} />
                  <span style={{ fontSize: 13 }}>{d}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-soft)', fontFamily: 'JetBrains Mono, monospace' }}>{d.toLowerCase().replace(' ','_')}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Used in dashboards */}
          <Card style={{ marginTop: 16 }}>
            <SectionHeader title="Used in dashboards" subtitle={`${usedIn.length} place${usedIn.length === 1 ? '' : 's'}`} />
            {usedIn.length === 0 ? (
              <Empty title="Not yet used" desc="This metric isn't referenced by any dashboard." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {usedIn.map(d => {
                  const isExec = d.id.startsWith('exec-');
                  const dmeta = isExec ? { color: 'oklch(0.25 0.03 305)', soft: 'oklch(0.96 0.02 305)', icon: 'crown' } : DOMAIN_META[d.domain];
                  return (
                    <button key={d.id} onClick={() => go({ page: isExec ? 'executive-detail' : 'dashboard-detail', id: d.id })} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: 10, borderRadius: 8, textAlign: 'left',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-soft)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: dmeta.soft, color: dmeta.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={dmeta.icon} size={12} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{d.name}</span>
                      <Icon name="arrowRight" size={13} style={{ color: 'var(--fg-soft)' }} />
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Certification */}
          <Card style={{ marginTop: 16 }}>
            <SectionHeader title="Certification" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <Row k="Tier"      v={<Badge tone="success">Tier 1 · Certified</Badge>} />
              <Row k="Reviewer"  v={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Avatar name={m.owner} size={18} />{m.owner}</span>} />
              <Row k="Last check" v={m.updated} />
              <Row k="Next review" v="in 24 days" />
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
};

const Row = ({ k, v }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
    <span style={{ color: 'var(--fg-muted)' }}>{k}</span>
    <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{v}</span>
  </div>
);

Object.assign(window, { MetricsCatalog, MetricDetail });
