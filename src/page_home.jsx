// Home page

const KpiCard = ({ kpi }) => {
  const up = kpi.trend === 'up';
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'var(--accent-soft)', color: 'var(--accent)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={kpi.icon} size={16} />
        </div>
        <Badge tone={up ? 'success' : 'danger'} style={{ gap: 2 }}>
          <Icon name={up ? 'arrowUp' : 'arrowDown'} size={11} stroke={2.2} />
          {kpi.delta}
        </Badge>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 14 }}>{kpi.title}</div>
      <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-.02em', marginTop: 2 }}>{kpi.value}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10 }}>
        <span style={{ fontSize: 11.5, color: 'var(--fg-soft)' }}>{kpi.period}</span>
        <Sparkline data={kpi.spark} color={up ? 'var(--success)' : 'var(--danger)'} width={96} height={28} />
      </div>
    </Card>
  );
};

const RecentRow = ({ dash, go }) => {
  const isExec = dash.id && dash.id.startsWith('exec-');
  const meta = isExec
    ? { color: 'oklch(0.25 0.03 305)', soft: 'oklch(0.96 0.02 305)', icon: 'crown' }
    : (DOMAIN_META[dash.domain] || { color: 'var(--fg-muted)', soft: 'var(--bg-muted)', icon: 'grid' });
  return (
    <button onClick={() => go({ page: isExec ? 'executive-detail' : 'dashboard-detail', id: dash.id })} style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%',
      padding: '10px 12px', borderRadius: 10, textAlign: 'left',
      transition: 'background .15s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-soft)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: meta.soft, color: meta.color,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={meta.icon} size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dash.name}</div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{isExec ? 'Executive' : dash.domain} · {dash.updated}</div>
      </div>
      <Icon name="arrowRight" size={14} style={{ color: 'var(--fg-soft)' }} />
    </button>
  );
};

const HomePage = ({ go }) => {
  const recents = RECENT.map(id => [...DASHBOARDS, ...EXEC_DASHBOARDS].find(d => d.id === id)).filter(Boolean);
  const favs = DASHBOARDS.filter(d => d.fav);

  const now = new Date();
  const hr = now.getHours();
  const greet = hr < 5 ? 'Good night' : hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <PageShell>
      <header style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <h1 style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 600, letterSpacing: '-.02em' }}>
            {greet}, Jana
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--fg-muted)', maxWidth: 560 }}>
            Here's a pulse across the business. Dashboards you've opened recently are below.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon="sparkles" onClick={() => go({ page: 'assistant' })}>Ask the Assistant</Button>
          <Button variant="primary" icon="plus">New dashboard</Button>
        </div>
      </header>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {KPIS.map(k => <KpiCard key={k.id} kpi={k} />)}
      </div>

      {/* Favorites — full width */}
      <section style={{ marginTop: 32 }}>
        <SectionHeader
          title="Your favorites"
          subtitle="Pinned dashboards across your domains"
          action={<Button variant="ghost" size="sm" iconRight="arrowRight" onClick={() => go({ page: 'dashboards' })}>All dashboards</Button>}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {favs.map(d => <FavoriteCard key={d.id} dash={d} go={go} />)}
        </div>
      </section>

      {/* Quick links — full width */}
      <section style={{ marginTop: 32 }}>
        <SectionHeader title="Quick links" subtitle="Jump to tools and resources" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {QUICK_LINKS.map(ql => (
            <Card key={ql.id} interactive style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--bg-muted)', color: 'var(--fg)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon name={ql.icon} size={17} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {ql.title}
                    <Icon name="external" size={12} style={{ color: 'var(--fg-soft)' }} />
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2, lineHeight: 1.45 }}>{ql.desc}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recently viewed — below */}
      <section style={{ marginTop: 32 }}>
        <SectionHeader title="Recently viewed" subtitle="Last 7 days" />
        <Card padded={false}>
          <div style={{ padding: '6px 6px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {recents.map(d => <RecentRow key={d.id} dash={d} go={go} />)}
          </div>
        </Card>
      </section>
    </PageShell>
  );
};

const FavoriteCard = ({ dash, go }) => {
  const meta = DOMAIN_META[dash.domain];
  return (
    <Card interactive padded={false} style={{ overflow: 'hidden' }} onClick={() => go({ page: 'dashboard-detail', id: dash.id })}>
      <div style={{
        height: 64, background: `linear-gradient(135deg, ${meta.soft} 0%, oklch(0.98 0.002 80) 100%)`,
        borderBottom: '1px solid var(--border)', position: 'relative',
        display: 'flex', alignItems: 'center', padding: '0 16px',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: meta.color, color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <Icon name={meta.icon} size={14} />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkline data={[5,7,6,8,9,8,10,11,10,12,13]} color={meta.color} width={72} height={22} fill={false} />
          <Icon name="starFill" size={13} style={{ color: 'var(--warn)' }} />
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-.005em' }}>{dash.name}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{dash.desc}</div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--fg-soft)' }}>
          <Avatar name={dash.owner} size={18} />
          <span>{dash.owner}</span>
          <span style={{ color: 'var(--border-strong)' }}>·</span>
          <span>{dash.updated}</span>
        </div>
      </div>
    </Card>
  );
};

Object.assign(window, { HomePage });
