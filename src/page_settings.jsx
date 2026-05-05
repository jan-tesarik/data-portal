// Settings — simple

const SettingsPage = ({ go }) => {
  const [theme, setTheme] = React.useState('Auto');
  const [density, setDensity] = React.useState('Comfortable');
  const [notif, setNotif] = React.useState({ refresh: true, alerts: true, weekly: false });

  return (
    <PageShell>
      <PageTitle title="Settings" subtitle="Preferences, access and notifications" />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>
        {/* Left nav */}
        <aside>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { k: 'Profile', icon: 'user', active: true },
              { k: 'Notifications', icon: 'bell' },
              { k: 'Access & Permissions', icon: 'shield' },
              { k: 'Appearance', icon: 'layers' },
              { k: 'API tokens', icon: 'lock' },
              { k: 'Integrations', icon: 'external' },
            ].map(it => (
              <button key={it.k} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8,
                background: it.active ? 'var(--bg-muted)' : 'transparent',
                color: it.active ? 'var(--fg)' : 'var(--fg-muted)',
                fontWeight: it.active ? 500 : 400, fontSize: 13,
                textAlign: 'left',
              }}>
                <Icon name={it.icon} size={15} />
                {it.k}
              </button>
            ))}
          </div>
        </aside>

        {/* Right panel */}
        <div>
          <Card>
            <SectionHeader title="Profile" subtitle="Visible to other members of your organisation" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar name="Jana Kováčová" size={64} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Jana Kováčová</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>jana.kovacova@lumen.ex · Finance Analyst</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <Button size="sm" variant="secondary">Change avatar</Button>
                <Button size="sm">Edit profile</Button>
              </div>
            </div>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <SectionHeader title="Appearance" subtitle="Theme and density" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 6 }}>Theme</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Light','Dark','Auto'].map(t => <Chip key={t} active={theme === t} onClick={() => setTheme(t)}>{t}</Chip>)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 6 }}>Density</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Comfortable','Compact'].map(d => <Chip key={d} active={density === d} onClick={() => setDensity(d)}>{d}</Chip>)}
                </div>
              </div>
            </div>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <SectionHeader title="Notifications" subtitle="What should we email you about?" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { k: 'refresh', t: 'Dashboard refreshes', d: 'When a dashboard you subscribe to finishes refreshing.' },
                { k: 'alerts',  t: 'Metric alerts',       d: 'When a threshold on a metric you follow is breached.' },
                { k: 'weekly',  t: 'Weekly digest',       d: 'A Monday summary of your KPIs and notable movements.' },
              ].map((it, i, arr) => (
                <div key={it.k} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{it.t}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 2 }}>{it.d}</div>
                  </div>
                  <Toggle value={notif[it.k]} onChange={v => setNotif({ ...notif, [it.k]: v })} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
};

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)} style={{
    width: 38, height: 22, borderRadius: 999,
    background: value ? 'var(--fg)' : 'var(--bg-muted)',
    position: 'relative', transition: 'background .2s ease',
    border: '1px solid var(--border)',
  }}>
    <span style={{
      position: 'absolute', top: 2, left: value ? 18 : 2,
      width: 16, height: 16, borderRadius: '50%',
      background: '#fff', boxShadow: 'var(--shadow-xs)',
      transition: 'left .2s ease',
    }} />
  </button>
);

Object.assign(window, { SettingsPage });
