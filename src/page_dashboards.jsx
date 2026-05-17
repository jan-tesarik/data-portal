// Dashboards listing + detail (simulated Superset embed placeholder)

const DashboardCard = ({ dash, go }) => {
  const meta = DOMAIN_META[dash.domain];
  return (
    <Card interactive padded={false} onClick={() => go({ page: 'dashboard-detail', id: dash.id })}>
      {/* thumb */}
      <div style={{
        height: 110, position: 'relative',
        borderBottom: '1px solid var(--border)',
        background: `linear-gradient(135deg, ${meta.soft} 0%, #fff 70%)`,
        overflow: 'hidden',
      }}>
        {/* stripes placeholder imagery */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id={`stripe-${dash.id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="14" stroke={meta.color} strokeWidth="1" strokeOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#stripe-${dash.id})`} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: meta.color, color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-xs)',
            }}>
              <Icon name={meta.icon} size={14} />
            </div>
            {dash.fav && <Icon name="starFill" size={14} style={{ color: 'var(--warn)' }} />}
          </div>
          <Sparkline data={[5,7,6,8,9,7,10,11,9,12,13,12,14]} color={meta.color} width={140} height={30} />
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-.005em' }}>{dash.name}</div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 36 }}>{dash.desc}</div>

        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {dash.tags.map(t => <Badge key={t}>#{t}</Badge>)}
        </div>

        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Avatar name={dash.owner} size={22} />
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--fg)', fontWeight: 500 }}>{dash.owner}</div>
              <div style={{ fontSize: 10.5, color: 'var(--fg-soft)' }}>{dash.updated} · {dash.views}</div>
            </div>
          </div>
          <Button variant="secondary" size="sm" iconRight="arrowRight" onClick={(e) => { e.stopPropagation(); go({ page: 'dashboard-detail', id: dash.id }); }}>
            Open
          </Button>
        </div>
      </div>
    </Card>
  );
};

const DashboardsPage = ({ go }) => {
  const [tab, setTab] = React.useState('domain');
  return (
    <PageShell>
      <PageTitle
        title="Dashboards"
        subtitle="Browse certified domain dashboards or explore dashboards built by your colleagues."
        action={<div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="filter">Filters</Button>
          <Button variant="primary" icon="plus" onClick={() => go({ page: 'create' })}>New dashboard</Button>
        </div>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-muted)', borderRadius: 10, width: 'fit-content', marginBottom: 18 }}>
        {[
          { k: 'domain',    label: 'Domain',    icon: 'grid',  count: DASHBOARDS.length },
          { k: 'community', label: 'Community', icon: 'users', count: COMMUNITY_DASHBOARDS.length },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 14px', borderRadius: 7,
            fontSize: 13, fontWeight: 500,
            background: tab === t.k ? 'var(--bg-elev)' : 'transparent',
            color: tab === t.k ? 'var(--fg)' : 'var(--fg-muted)',
            boxShadow: tab === t.k ? 'var(--shadow-xs)' : 'none',
          }}>
            <Icon name={t.icon} size={14} />
            {t.label}
            <span style={{ padding: '0 6px', borderRadius: 999, fontSize: 11, background: tab === t.k ? 'var(--bg-muted)' : 'transparent', color: 'var(--fg-soft)' }}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === 'domain'    && <DomainDashboards go={go} />}
      {tab === 'community' && <CommunityDashboards go={go} />}
    </PageShell>
  );
};

const DomainDashboards = ({ go }) => {
  const [domain, setDomain] = React.useState('All');
  const [q, setQ] = React.useState('');
  const domains = ['All', ...Object.keys(DOMAIN_META).filter(d => DASHBOARDS.some(x => x.domain === d))];
  const filtered = DASHBOARDS.filter(d =>
    (domain === 'All' || d.domain === domain) &&
    (q === '' || d.name.toLowerCase().includes(q.toLowerCase()) || d.desc.toLowerCase().includes(q.toLowerCase()))
  );
  const grouped = {};
  filtered.forEach(d => { (grouped[d.domain] = grouped[d.domain] || []).push(d); });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ position: 'relative', width: 320 }}>
          <Icon name="search" size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-soft)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search dashboards"
            style={{ width: '100%', height: 32, padding: '0 10px 0 30px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', color: 'var(--fg)' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {domains.map(d => <Chip key={d} active={domain === d} onClick={() => setDomain(d)}>{d}</Chip>)}
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--fg-muted)' }}>
          {filtered.length} of {DASHBOARDS.length}
        </div>
      </div>

      {Object.keys(grouped).map(dom => <CollapsibleDomain key={dom} dom={dom} dashes={grouped[dom]} go={go} />)}
    </>
  );
};

const CollapsibleDomain = ({ dom, dashes, go }) => {
  const [open, setOpen] = React.useState(true);
  return (
    <section style={{ marginBottom: 20 }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '8px 4px', marginBottom: 10, textAlign: 'left',
      }}>
        <Icon name="chevDown" size={14} style={{ color: 'var(--fg-soft)', transition: 'transform .15s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: DOMAIN_META[dom].soft, color: DOMAIN_META[dom].color,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={DOMAIN_META[dom].icon} size={12} />
        </div>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: '-.005em' }}>{dom}</h3>
        <span style={{ fontSize: 12, color: 'var(--fg-soft)' }}>· {dashes.length}</span>
      </button>
      {open && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {dashes.map(d => <DashboardCard key={d.id} dash={d} go={go} />)}
        </div>
      )}
    </section>
  );
};

// ---------- Community dashboards ----------

const CommunityDashboards = ({ go }) => {
  const [filter, setFilter] = React.useState('all');
  const [q, setQ] = React.useState('');

  const filters = [
    { k: 'all',         label: 'All',                  match: () => true },
    { k: 'mine',        label: 'Created by me',        match: d => d.creator === 'Jana Kováčová' },
    { k: 'verified',    label: 'Verified',             match: d => d.status === 'verified' },
    { k: 'pending',     label: 'Pending verification', match: d => d.status === 'pending' },
    { k: 'bi-building', label: 'BI implementing',      match: d => d.status === 'bi-building' },
    { k: 'popular',     label: 'Popular',              match: d => d.popular },
  ];
  const matcher = (filters.find(f => f.k === filter) || filters[0]).match;
  const list = COMMUNITY_DASHBOARDS.filter(d =>
    matcher(d) && (q === '' || d.name.toLowerCase().includes(q.toLowerCase()) || d.desc.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      {/* Highlight: "Create" CTA */}
      <div style={{
        marginBottom: 18, padding: 16, borderRadius: 12,
        background: 'linear-gradient(135deg, oklch(0.97 0.03 265), oklch(0.97 0.03 305))',
        border: '1px solid oklch(0.9 0.04 265)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--accent), oklch(0.62 0.18 305))',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="sparkles" size={18} style={{ color: '#fff' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-.005em' }}>Build your own dashboard with Claude</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>
            Upload a spreadsheet or chat with the Data Assistant — Claude drafts the dashboard for you.
          </div>
        </div>
        <Button variant="primary" icon="plus" onClick={() => go({ page: 'create' })}>Create</Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Icon name="search" size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-soft)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search community dashboards"
            style={{ width: '100%', height: 32, padding: '0 10px 0 30px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {filters.map(f => <Chip key={f.k} active={filter === f.k} onClick={() => setFilter(f.k)}>{f.label}</Chip>)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {list.map(d => <CommunityCard key={d.id} dash={d} go={go} />)}
      </div>
      {list.length === 0 && <Empty icon="search" title="Nothing here yet" desc="Try a different filter or create the first one." />}
    </div>
  );
};

const VerifiedBadge = () => (
  <span title="Verified by BI" style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 17, height: 17, borderRadius: '50%',
    background: 'var(--accent)', color: '#fff',
    flexShrink: 0,
  }}>
    <Icon name="check" size={10} stroke={3} />
  </span>
);

const StatusChip = ({ status }) => {
  const meta = COMMUNITY_STATUS_META[status];
  if (!meta) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 999,
      fontSize: 10.5, fontWeight: 500,
      background: meta.bg, color: meta.color,
    }}>
      {status === 'verified' && <Icon name="shield" size={10} />}
      {status === 'bi-building' && <Icon name="bolt" size={10} />}
      {status === 'pending' && <Icon name="clock" size={10} />}
      {status === 'draft' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color }} />}
      {meta.label}
    </span>
  );
};

const CommunityCard = ({ dash, go }) => (
  <Card interactive padded={false} onClick={() => go({ page: 'community-detail', id: dash.id })}>
    {/* Thumb */}
    <div style={{
      height: 100, borderBottom: '1px solid var(--border)',
      background: 'linear-gradient(135deg, oklch(0.97 0.025 ' + ((dash.id.charCodeAt(4) * 17) % 360) + '), #fff)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', padding: '0 16px',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: '#fff', border: '1px solid var(--border)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--shadow-xs)',
      }}>
        <Icon name={dash.source === 'spreadsheet' ? 'layers' : 'sparkles'} size={14} style={{ color: 'var(--accent)' }} />
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkline data={[4,6,5,7,8,7,9,11,10,12,13,12,14]} color="var(--accent)" width={80} height={26} fill={false} />
      </div>
    </div>

    <div style={{ padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-.005em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dash.name}</div>
        {dash.status === 'verified' && <VerifiedBadge />}
      </div>
      <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 3, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 35 }}>
        {dash.desc}
      </div>

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <StatusChip status={dash.status} />
        {dash.popular && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, background: 'oklch(0.97 0.07 50)', color: 'oklch(0.55 0.18 50)', fontSize: 10.5, fontWeight: 500 }}>
            <Icon name="bolt" size={10} /> Popular
          </span>
        )}
      </div>

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Avatar name={dash.creator} size={20} />
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 500 }}>{dash.creator}</div>
            <div style={{ fontSize: 10.5, color: 'var(--fg-soft)' }}>{dash.team} · {dash.updated}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--fg-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Icon name="arrowUp" size={10} /> {dash.upvotes}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Icon name="eye" size={10} /> {dash.views}
          </span>
        </div>
      </div>
    </div>
  </Card>
);

// ---------- Community detail ----------

const CommunityDashboardDetail = ({ id, go }) => {
  const orig = COMMUNITY_DASHBOARDS.find(d => d.id === id) || COMMUNITY_DASHBOARDS[0];
  const [dash, setDash] = React.useState(orig);

  // Demo: pretend the current user is BI-eligible
  const isBI = true;

  const verify = () => setDash(d => ({ ...d, status: 'verified', verifiedBy: 'BI · You', verifiedOn: 'just now' }));
  const takeOver = () => setDash(d => ({ ...d, status: 'bi-building', biOwner: 'You', biEta: '~2 weeks' }));
  const requestVerify = () => setDash(d => ({ ...d, status: 'pending' }));
  const upvote = () => setDash(d => ({ ...d, upvotes: d.upvotes + 1 }));

  return (
    <PageShell>
      <Breadcrumbs items={[
        { label: 'Dashboards',          onClick: () => go({ page: 'dashboards' }) },
        { label: 'Community' },
        { label: dash.name },
      ]} />

      {/* Header */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: '-.02em' }}>{dash.name}</h1>
            {dash.status === 'verified' && <VerifiedBadge />}
            <StatusChip status={dash.status} />
            {dash.popular && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 999, background: 'oklch(0.97 0.07 50)', color: 'oklch(0.55 0.18 50)', fontSize: 10.5, fontWeight: 500 }}>
                <Icon name="bolt" size={10} /> Popular
              </span>
            )}
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--fg-muted)', maxWidth: 720 }}>{dash.desc}</p>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--fg-muted)', flexWrap: 'wrap' }}>
            <Avatar name={dash.creator} size={20} />
            <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{dash.creator}</span>
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <span>{dash.team}</span>
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <span>Created {dash.created}</span>
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name={dash.source === 'spreadsheet' ? 'layers' : 'sparkles'} size={11} />
              {dash.source === 'spreadsheet' ? `from ${dash.filename}` : 'from Data Assistant chat'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="arrowUp" onClick={upvote}>Upvote · {dash.upvotes}</Button>
          <Button variant="secondary" icon="share">Share</Button>
          <Button variant="secondary" icon="copy">Duplicate</Button>
        </div>
      </div>

      {/* BI action strip */}
      {(dash.status === 'draft' || dash.status === 'pending') && (
        <Card style={{ marginTop: 18, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'var(--accent-soft)', color: 'var(--accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="shield" size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>
              {dash.status === 'draft' ? 'Want a verified badge?' : 'Awaiting BI verification'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>
              {dash.status === 'draft'
                ? 'Request BI to check the data and definitions, then publish with a verified badge.'
                : 'The BI team will review the dataset, definitions and chart logic.'}
            </div>
          </div>
          {dash.status === 'draft' && <Button variant="primary" icon="shield" onClick={requestVerify}>Request verification</Button>}
          {isBI && dash.status === 'pending' && (
            <>
              <Button variant="ghost">Request changes</Button>
              <Button variant="primary" icon="check" onClick={verify}>Approve & verify</Button>
            </>
          )}
        </Card>
      )}

      {dash.status === 'verified' && (
        <Card style={{
          marginTop: 18, padding: 14, display: 'flex', gap: 12, alignItems: 'center',
          background: 'var(--accent-soft)', borderColor: 'oklch(0.86 0.06 265)',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'var(--accent)', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={16} stroke={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)' }}>Verified by BI</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
              {dash.verifiedBy} · {dash.verifiedOn}
            </div>
          </div>
          {dash.popular && isBI && (
            <Button variant="primary" icon="bolt" onClick={takeOver}>BI take over — full implementation</Button>
          )}
        </Card>
      )}

      {dash.status === 'bi-building' && (
        <Card style={{
          marginTop: 18, padding: 14, display: 'flex', gap: 12, alignItems: 'center',
          background: 'oklch(0.97 0.04 50)', borderColor: 'oklch(0.88 0.07 50)',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'oklch(0.7 0.16 50)', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="bolt" size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>BI is implementing this dashboard</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
              Owner: {dash.biOwner} · ETA {dash.biEta} · Will become a certified domain dashboard
            </div>
          </div>
          <Button variant="secondary" icon="external">View ticket</Button>
        </Card>
      )}

      {/* Provenance */}
      {dash.promptedBy && (
        <Card style={{ marginTop: 14, padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-soft)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 5 }}>Prompt used</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--fg)' }}>{dash.promptedBy}</div>
        </Card>
      )}

      {/* The dashboard itself */}
      <Card padded={false} style={{ marginTop: 18, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="sparkles" size={14} style={{ color: 'var(--accent)' }} />
          <div style={{ fontSize: 13, fontWeight: 600 }}>Auto-generated by Claude</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {dash.tags.map(t => <Badge key={t}>#{t}</Badge>)}
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <DashboardSpec spec={dash.spec} />
        </div>
      </Card>
    </PageShell>
  );
};

Object.assign(window, { CommunityDashboards, CommunityDashboardDetail });

const FilterField = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 10.5, color: 'var(--fg-soft)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 4 }}>{label}</div>
    <button style={{
      width: '100%', height: 30, padding: '0 8px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 7,
      fontSize: 12, color: 'var(--fg)', textAlign: 'left',
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
      <Icon name="chevDown" size={12} style={{ color: 'var(--fg-soft)', flexShrink: 0 }} />
    </button>
  </div>
);

const EmbeddedMetricTile = ({ title, value, spark, delta, trend, color = 'var(--accent)' }) => (
  <Card style={{ padding: 16 }}>
    <div style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 500 }}>{title}</div>
    <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-.02em', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
      <Badge tone={trend === 'up' ? 'success' : 'danger'} style={{ gap: 2 }}>
        <Icon name={trend === 'up' ? 'arrowUp' : 'arrowDown'} size={10} stroke={2.2} />
        {delta}
      </Badge>
      <Sparkline data={spark} color={color} width={90} height={24} />
    </div>
  </Card>
);

const monthsX = ['Jan 27','Feb 3','Feb 10','Feb 17','Feb 24','Mar 3','Mar 10','Mar 17','Mar 24','Mar 31','Apr 7','Apr 14','Apr 21'];
const rev = [540,560,550,580,600,595,620,640,650,655,670,660,680];
const revPrev = [460,470,480,490,500,495,510,520,515,530,540,535,540];
const prod = [6.2,6.4,6.3,6.5,6.6,6.7,6.6,6.8,6.9,6.85,6.95,6.9,7.0];
const prodPrev = [5.3,5.4,5.5,5.45,5.5,5.55,5.5,5.55,5.6,5.58,5.6,5.55,5.6];

const DashboardDetail = ({ id, go }) => {
  const dash = DASHBOARDS.find(d => d.id === id) || DASHBOARDS[0];
  const meta = DOMAIN_META[dash.domain];
  const [tab, setTab] = React.useState('Graphs');

  return (
    <div>
      <PageShell style={{ paddingBottom: 24 }}>
        <Breadcrumbs items={[
          { label: 'Dashboards', onClick: () => go({ page: 'dashboards' }) },
          { label: dash.domain },
          { label: dash.name },
        ]} />

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: meta.color, color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <Icon name={meta.icon} size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-.02em' }}>{dash.name}</h1>
                <Badge tone="success"><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', marginRight: 2 }} />Published</Badge>
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Avatar name={dash.owner} size={18} /> {dash.owner}
                </span>
                <span style={{ color: 'var(--border-strong)' }}>·</span>
                <span>Updated {dash.updated}</span>
                <span style={{ color: 'var(--border-strong)' }}>·</span>
                <span>{dash.views} views</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <IconButton icon="star" boxSize={34} />
            <IconButton icon="share" boxSize={34} />
            <IconButton icon="download" boxSize={34} />
            <Button variant="secondary" icon="refresh" size="sm">Refresh</Button>
            <Button variant="primary" size="sm">Edit dashboard</Button>
          </div>
        </div>
      </PageShell>

      {/* Embed area */}
      <div style={{
        margin: '0 36px 48px', maxWidth: 1360,
        marginLeft: 'auto', marginRight: 'auto',
        padding: '0 36px',
      }}>
        <Card padded={false} style={{ overflow: 'hidden' }}>
          {/* Embed chrome bar */}
          <div style={{
            padding: '10px 14px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--bg-soft)',
            fontSize: 11.5, color: 'var(--fg-soft)',
          }}>
            <Icon name="lock" size={11} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>warehouse.superset.internal / embedded</span>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} /> Connected
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 700 }}>
            {/* Left filter rail (simulated) */}
            <aside style={{ borderRight: '1px solid var(--border)', padding: 14, background: 'var(--bg-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
                <Icon name="filter" size={12} /> Filters
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <FilterField label="Date" value="Last quarter" />
                <FilterField label="Granularity" value="Week" />
                <FilterField label="Channel" value="All (4)" />
                <FilterField label="Country" value="All (14)" />
                <FilterField label="Category" value="All (32)" />
                <FilterField label="Manufacturer" value="All (50)" />
                <FilterField label="Supplier" value="All (22)" />
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
                <Button variant="primary" size="sm" style={{ flex: 1 }}>Apply</Button>
                <Button variant="ghost" size="sm">Clear</Button>
              </div>
            </aside>

            {/* Content */}
            <div style={{ padding: 20 }}>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', marginBottom: 18, overflowX: 'auto' }}>
                {['Graphs','By PV','By Product','By Manufacturer','By Category','By Country','About'].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    padding: '8px 12px', fontSize: 12.5, fontWeight: 500,
                    color: tab === t ? 'var(--fg)' : 'var(--fg-muted)',
                    borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,
                    marginBottom: -1, whiteSpace: 'nowrap',
                  }}>{t}</button>
                ))}
              </div>

              {/* Metric tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <EmbeddedMetricTile title="Revenue"       value="€ 655M" spark={rev}  delta="+12.4%" trend="up"  color="var(--accent)" />
                <EmbeddedMetricTile title="Products Sold" value="6.9M"   spark={prod} delta="+5.1%"  trend="up"  color="var(--accent)" />
                <EmbeddedMetricTile title="Gross Margin"  value="€ 296M" spark={rev.map(x => x*0.45)} delta="+3.8%" trend="up" color="var(--teal)" />
                <EmbeddedMetricTile title="Gross Margin %" value="45.1%" spark={[43,44,44,45,44,45,45,46,45,45,45,45,45.1]} delta="+0.8pp" trend="up" color="var(--teal)" />
              </div>

              {/* Selected dates bar */}
              <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  ['Selected dates', '2026-01-25 — 2026-04-19'],
                  ['MoM', '2026-03-22 — 2026-04-19'],
                  ['QoQ', '2025-10-26 — 2026-01-24'],
                  ['YoY', '2025-01-26 — 2025-04-20'],
                ].map(([k,v]) => (
                  <div key={k} style={{
                    padding: '10px 12px', background: 'var(--bg-soft)',
                    border: '1px solid var(--border)', borderRadius: 8,
                  }}>
                    <div style={{ fontSize: 10.5, color: 'var(--fg-soft)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontSize: 12.5, fontFamily: 'JetBrains Mono, monospace', marginTop: 2, color: 'var(--fg)' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Revenue chart */}
              <div style={{ marginTop: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Revenue</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11.5, color: 'var(--fg-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 10, height: 2, background: 'var(--accent)', borderRadius: 2 }} /> Revenue
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 10, height: 2, background: 'var(--accent)', borderRadius: 2, opacity: .4 }} /> Revenue · 1 year ago
                    </span>
                  </div>
                </div>
                <LineChart
                  series={[
                    { name: 'Revenue', color: 'oklch(0.55 0.18 265)', data: rev },
                    { name: 'Rev prev year', color: 'oklch(0.55 0.18 265)', data: revPrev, dashed: true },
                  ]}
                  xLabels={monthsX}
                  yFmt={v => v + 'M'}
                  height={220}
                />
              </div>

              {/* Products sold */}
              <div style={{ marginTop: 26 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Products Sold</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>Weekly · 13 weeks</div>
                </div>
                <LineChart
                  series={[
                    { name: 'Products Sold', color: 'oklch(0.6 0.12 200)', data: prod },
                    { name: 'Prev year', color: 'oklch(0.6 0.12 200)', data: prodPrev, dashed: true },
                  ]}
                  xLabels={monthsX}
                  yFmt={v => v.toFixed(1) + 'M'}
                  height={200}
                />
              </div>

              {/* Gross margin bar */}
              <div style={{ marginTop: 26 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>% Gross Margin 1 — by category</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>Top 10</div>
                </div>
                <BarChart
                  data={[
                    { label: 'Protein',   value: 52.4 },
                    { label: 'Bars',      value: 48.1 },
                    { label: 'Vitamins',  value: 47.6 },
                    { label: 'Apparel',   value: 46.8 },
                    { label: 'Drinks',    value: 44.9 },
                    { label: 'Snacks',    value: 43.1 },
                    { label: 'Accessories', value: 41.8 },
                    { label: 'Creatine', value: 39.6 },
                    { label: 'Greens',   value: 37.2 },
                    { label: 'Other',    value: 32.5, dim: true },
                  ]}
                  barColor="oklch(0.55 0.18 265)"
                  yFmt={v => v.toFixed(0) + '%'}
                  height={220}
                />
              </div>
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--fg-soft)', display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
          <Icon name="info" size={12} /> Rendered via Superset embed. Filters, drill-downs and exports use warehouse permissions of the signed-in viewer.
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { DashboardsPage, DashboardDetail });
