// App shell: collapsible sidebar with search, notifications, profile

const Logo = ({ size = 28, collapsed = false }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: size, height: size, borderRadius: 9,
      background: 'linear-gradient(135deg, oklch(0.55 0.18 265) 0%, oklch(0.62 0.18 305) 100%)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 12px oklch(0.55 0.18 265 / 0.25), inset 0 1px 0 rgba(255,255,255,.3)',
      flexShrink: 0,
    }}>
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-8" />
        <path d="M22 20v-5" />
      </svg>
    </div>
    {!collapsed && <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.015em' }}>Data Portal</div>}
  </div>
);

const SidebarItem = ({ icon, label, active, badge, onClick, collapsed }) => (
  <button onClick={onClick} title={collapsed ? label : undefined} style={{
    display: 'flex', alignItems: 'center', gap: 11, width: '100%',
    padding: collapsed ? '8px 0' : '8px 10px', borderRadius: 9,
    justifyContent: collapsed ? 'center' : 'flex-start',
    background: active ? 'var(--bg-elev)' : 'transparent',
    color: active ? 'var(--fg)' : 'var(--fg-muted)',
    border: active ? '1px solid var(--border)' : '1px solid transparent',
    boxShadow: active ? 'var(--shadow-xs)' : 'none',
    fontSize: 13.5, fontWeight: active ? 500 : 400, letterSpacing: '-.005em',
    transition: 'all .15s ease', textAlign: 'left',
  }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-soft)'; e.currentTarget.style.color = 'var(--fg)'; } }}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)'; } }}
  >
    <Icon name={icon} size={17} stroke={1.7} style={{ color: active ? 'var(--accent)' : 'currentColor', flexShrink: 0 }} />
    {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
    {!collapsed && badge && (
      <span style={{
        fontSize: 10.5, fontWeight: 600, padding: '1px 6px', borderRadius: 999,
        background: 'var(--accent-soft)', color: 'var(--accent)',
      }}>{badge}</span>
    )}
  </button>
);

const subNavStyle = (active) => ({
  padding: '6px 10px 6px 14px',
  borderRadius: 7,
  fontSize: 12.5,
  fontWeight: active ? 500 : 400,
  color: active ? 'var(--fg)' : 'var(--fg-muted)',
  background: active ? 'var(--bg-muted)' : 'transparent',
  textAlign: 'left', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap',
  transition: 'background .15s ease',
});

const SearchResults = ({ query, go, onClose, collapsed }) => {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const dashs = DASHBOARDS.filter(d => d.name.toLowerCase().includes(q) || d.tags.some(t => t.includes(q))).slice(0, 4);
  const mets  = METRICS.filter(m => m.name.toLowerCase().includes(q)).slice(0, 4);
  const execs = EXEC_DASHBOARDS.filter(d => d.name.toLowerCase().includes(q)).slice(0, 3);

  const renderList = (label, items, icon, onPick) => (
    <div>
      <div style={{ padding: '6px 10px 4px', fontSize: 10.5, fontWeight: 600, color: 'var(--fg-soft)', textTransform: 'uppercase', letterSpacing: '.07em' }}>{label}</div>
      {items.length === 0 ? (
        <div style={{ padding: '4px 10px 8px', fontSize: 12, color: 'var(--fg-muted)' }}>No results</div>
      ) : items.map(it => (
        <button key={it.id} onClick={() => onPick(it)} style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: '7px 10px', borderRadius: 8, textAlign: 'left',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-soft)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Icon name={icon} size={14} style={{ color: 'var(--fg-muted)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.domain || 'Executive'}</div>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div style={{
      position: 'absolute',
      top: 40,
      left: collapsed ? 'calc(100% + 8px)' : 0,
      width: collapsed ? 300 : '100%',
      background: 'var(--bg-elev)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
      zIndex: 40, overflow: 'hidden', padding: 6,
      maxHeight: 440, overflowY: 'auto',
    }}>
      {renderList('Dashboards', dashs,  'grid',   d => { go({ page: 'dashboard-detail', id: d.id }); onClose(); })}
      {renderList('Executive',  execs,  'crown',  d => { go({ page: 'executive-detail', id: d.id }); onClose(); })}
      {renderList('Metrics',    mets,   'metric', m => { go({ page: 'metric-detail',   id: m.id }); onClose(); })}
    </div>
  );
};

const NotificationsPanel = ({ onClose, collapsed }) => (
  <div style={{
    position: 'absolute',
    bottom: collapsed ? 0 : 'calc(100% + 8px)',
    left: collapsed ? 'calc(100% + 8px)' : 0,
    right: collapsed ? 'auto' : 0,
    width: collapsed ? 340 : 'auto',
    minWidth: 300,
    background: 'var(--bg-elev)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
    zIndex: 40, overflow: 'hidden',
  }}>
    <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 13, fontWeight: 600 }}>Notifications</div>
      <button style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 500 }}>Mark all read</button>
    </div>
    <div style={{ maxHeight: 360, overflowY: 'auto' }}>
      {NOTIFICATIONS.map(n => (
        <div key={n.id} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.unread ? 'var(--accent)' : 'transparent', marginTop: 6, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>{n.title}</div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>{n.desc}</div>
            <div style={{ fontSize: 10.5, color: 'var(--fg-soft)', marginTop: 3 }}>{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProfileMenu = ({ collapsed, onClose, go }) => (
  <div style={{
    position: 'absolute',
    bottom: collapsed ? 0 : 'calc(100% + 8px)',
    left: collapsed ? 'calc(100% + 8px)' : 0,
    right: collapsed ? 'auto' : 0,
    width: collapsed ? 240 : 'auto',
    minWidth: 220,
    background: 'var(--bg-elev)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
    zIndex: 40, overflow: 'hidden', padding: 6,
  }}>
    <div style={{ padding: '10px 10px 12px', borderBottom: '1px solid var(--border)', marginBottom: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
      <Avatar name="Jana Kováčová" size={34} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Jana Kováčová</div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>jana.kovacova@lumen.ex</div>
      </div>
    </div>
    {[
      { k: 'Profile',  icon: 'user',     onClick: () => { go({ page: 'settings' }); onClose(); } },
      { k: 'Settings', icon: 'settings', onClick: () => { go({ page: 'settings' }); onClose(); } },
      { k: 'Docs & Glossary', icon: 'book', onClick: () => onClose() },
      { k: 'Sign out', icon: 'logout',   onClick: () => onClose(), danger: true },
    ].map(it => (
      <button key={it.k} onClick={it.onClick} style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '8px 10px', borderRadius: 7, textAlign: 'left',
        fontSize: 12.5, color: it.danger ? 'var(--danger)' : 'var(--fg)',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-soft)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <Icon name={it.icon} size={14} style={{ color: it.danger ? 'var(--danger)' : 'var(--fg-muted)' }} />
        {it.k}
      </button>
    ))}
  </div>
);

const Sidebar = ({ page, go, route, collapsed, onToggle }) => {
  const [execOpen, setExecOpen] = React.useState(false);
  const [appsOpen, setAppsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const unread = NOTIFICATIONS.filter(n => n.unread).length;

  // close popups when collapse state flips
  React.useEffect(() => { setNotifOpen(false); setProfileOpen(false); setSearchFocused(false); }, [collapsed]);

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: 'var(--sidebar-w)',
      background: 'oklch(0.985 0.003 80)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: collapsed ? '16px 8px' : '16px 10px',
      zIndex: 20,
      transition: 'width .2s ease, padding .2s ease',
    }}>
      {/* Logo + collapse toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', gap: 6, padding: collapsed ? '4px 0 16px' : '4px 6px 16px' }}>
        {!collapsed && <Logo />}
        {collapsed && <Logo collapsed />}
      </div>
      {!collapsed && (
        <button onClick={onToggle} title="Collapse sidebar" style={{
          position: 'absolute', top: 20, right: -12, width: 22, height: 22,
          borderRadius: '50%', background: 'var(--bg-elev)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}>
          <Icon name="chevLeft" size={12} style={{ color: 'var(--fg-muted)' }} />
        </button>
      )}
      {collapsed && (
        <button onClick={onToggle} title="Expand sidebar" style={{
          position: 'absolute', top: 20, right: -12, width: 22, height: 22,
          borderRadius: '50%', background: 'var(--bg-elev)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}>
          <Icon name="chevRight" size={12} style={{ color: 'var(--fg-muted)' }} />
        </button>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        {collapsed ? (
          <button onClick={onToggle} title="Search" style={{
            width: '100%', height: 34, borderRadius: 8,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-muted)', color: 'var(--fg-muted)',
          }}>
            <Icon name="search" size={15} />
          </button>
        ) : (
          <>
            <Icon name="search" size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-soft)' }} />
            <input
              placeholder="Search…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
              style={{
                width: '100%', height: 32, padding: '0 10px 0 30px',
                background: 'var(--bg-muted)',
                border: '1px solid transparent',
                borderRadius: 8, fontSize: 12.5, color: 'var(--fg)', outline: 'none',
                transition: 'all .15s ease',
              }}
              onFocusCapture={e => { e.target.style.background = 'var(--bg-elev)'; e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = '0 0 0 3px oklch(0.55 0.18 265 / .1)'; }}
              onBlurCapture={e => { e.target.style.background = 'var(--bg-muted)'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none'; }}
            />
            {searchFocused && query && <SearchResults query={query} go={go} onClose={() => { setQuery(''); setSearchFocused(false); }} />}
          </>
        )}
      </div>

      {/* Create CTA */}
      {!collapsed ? (
        <button onClick={() => go({ page: 'create' })} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', height: 32, marginBottom: 14, borderRadius: 8,
          background: 'var(--fg)', color: '#fff',
          fontSize: 12.5, fontWeight: 500, letterSpacing: '-.005em',
          whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow-xs)',
          transition: 'transform .15s ease, opacity .15s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.92}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          <Icon name="plus" size={13} stroke={2.2} />
          Create dashboard
        </button>
      ) : (
        <button onClick={() => go({ page: 'create' })} title="Create dashboard" style={{
          width: '100%', height: 34, marginBottom: 14, borderRadius: 8,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--fg)', color: '#fff',
        }}>
          <Icon name="plus" size={14} stroke={2.2} />
        </button>
      )}

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SidebarItem icon="home"  label="Home"       active={page === 'home'}       onClick={() => go({ page: 'home' })} collapsed={collapsed} />
        <SidebarItem icon="grid"  label="Dashboards" active={page === 'dashboards'} onClick={() => go({ page: 'dashboards' })} collapsed={collapsed} />

        {/* Collapsible Executive */}
        {collapsed ? (
          <SidebarItem icon="crown" label="Executive" active={page === 'executive'} onClick={() => go({ page: 'executive' })} collapsed />
        ) : (
          <>
            <button onClick={() => setExecOpen(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: 11, width: '100%',
              padding: '8px 10px', borderRadius: 9,
              background: page === 'executive' ? 'var(--bg-elev)' : 'transparent',
              color: page === 'executive' ? 'var(--fg)' : 'var(--fg-muted)',
              border: page === 'executive' ? '1px solid var(--border)' : '1px solid transparent',
              boxShadow: page === 'executive' ? 'var(--shadow-xs)' : 'none',
              fontSize: 13.5, fontWeight: page === 'executive' ? 500 : 400,
              textAlign: 'left', transition: 'all .15s ease',
            }}
              onMouseEnter={e => { if (page !== 'executive') { e.currentTarget.style.background = 'var(--bg-soft)'; e.currentTarget.style.color = 'var(--fg)'; } }}
              onMouseLeave={e => { if (page !== 'executive') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)'; } }}
            >
              <Icon name="crown" size={17} stroke={1.7} style={{ color: page === 'executive' ? 'var(--accent)' : 'currentColor', flexShrink: 0 }} />
              <span style={{ flex: 1 }}>Executive</span>
              <Icon name="chevDown" size={13} style={{ transition: 'transform .15s', transform: execOpen ? 'rotate(0deg)' : 'rotate(-90deg)', color: 'var(--fg-soft)' }} />
            </button>
            {execOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingLeft: 14, marginTop: 1, marginBottom: 2, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 17, top: 4, bottom: 4, width: 1, background: 'var(--border)' }} />
                <button onClick={() => go({ page: 'executive' })} style={subNavStyle(page === 'executive' && !route?.id)}>All executive</button>
                {EXEC_DASHBOARDS.map(d => {
                  const active = route?.page === 'executive-detail' && route?.id === d.id;
                  return (
                    <button key={d.id} onClick={() => go({ page: 'executive-detail', id: d.id })} style={subNavStyle(active)}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-soft)'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {d.name.replace(' Dashboard','')}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        <SidebarItem icon="metric"   label="Metrics"      active={page === 'metrics'}   onClick={() => go({ page: 'metrics' })} collapsed={collapsed} />
        <SidebarItem icon="sparkles" label="AI Assistant" active={page === 'assistant'} onClick={() => go({ page: 'assistant' })} collapsed={collapsed} />

        {/* Collapsible Data Apps */}
        {collapsed ? (
          <SidebarItem icon="bolt" label="Data Apps" active={page === 'app-scout' || page === 'app-reviews' || page === 'app-scraper'} onClick={() => go({ page: 'app-scout' })} collapsed />
        ) : (
          <>
            <button onClick={() => setAppsOpen(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: 11, width: '100%',
              padding: '8px 10px', borderRadius: 9,
              background: 'transparent',
              color: 'var(--fg-muted)',
              border: '1px solid transparent',
              fontSize: 13.5, fontWeight: 400,
              textAlign: 'left', transition: 'all .15s ease', marginTop: 2,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-soft)'; e.currentTarget.style.color = 'var(--fg)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
            >
              <Icon name="bolt" size={17} stroke={1.7} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>Data Apps</span>
              <Icon name="chevDown" size={13} style={{ transition: 'transform .15s', transform: appsOpen ? 'rotate(0deg)' : 'rotate(-90deg)', color: 'var(--fg-soft)' }} />
            </button>
            {appsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingLeft: 14, marginTop: 1, marginBottom: 2, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 17, top: 4, bottom: 4, width: 1, background: 'var(--border)' }} />
                {[
                  { id: 'app-scout',    label: 'Vilgain Scout' },
                  { id: 'app-reviews',  label: 'AI Review Insights' },
                  { id: 'app-scraper',  label: 'Scraping Configurator' },
                ].map(a => {
                  const active = page === a.id;
                  return (
                    <button key={a.id} onClick={() => go({ page: a.id })} style={subNavStyle(active)}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-soft)'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Notifications + profile pinned to bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }} title={collapsed ? 'Notifications' : undefined} style={{
            display: 'flex', alignItems: 'center', gap: 11, width: '100%',
            padding: collapsed ? '8px 0' : '8px 10px', borderRadius: 9,
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: notifOpen ? 'var(--bg-muted)' : 'transparent',
            color: 'var(--fg-muted)',
            fontSize: 13.5, fontWeight: 400,
            textAlign: 'left', transition: 'all .15s ease',
            position: 'relative',
          }}
            onMouseEnter={e => { if (!notifOpen) { e.currentTarget.style.background = 'var(--bg-soft)'; e.currentTarget.style.color = 'var(--fg)'; } }}
            onMouseLeave={e => { if (!notifOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)'; } }}
          >
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon name="bell" size={17} stroke={1.7} style={{ flexShrink: 0 }} />
              {unread > 0 && (
                <span style={{
                  position: 'absolute', top: -2, right: -3, width: 7, height: 7,
                  background: 'var(--danger)', borderRadius: '50%',
                  border: '1.5px solid oklch(0.985 0.003 80)',
                }} />
              )}
            </div>
            {!collapsed && <span style={{ flex: 1 }}>Notifications</span>}
            {!collapsed && unread > 0 && (
              <span style={{
                fontSize: 10.5, fontWeight: 600, padding: '1px 6px', borderRadius: 999,
                background: 'var(--danger-soft)', color: 'var(--danger)',
              }}>{unread}</span>
            )}
          </button>
          {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} collapsed={collapsed} />}
        </div>

        <div style={{ position: 'relative' }}>
          <button onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }} title={collapsed ? 'Jana Kováčová' : undefined} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: collapsed ? '6px 0' : '6px 8px', borderRadius: 9,
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: profileOpen ? 'var(--bg-muted)' : 'transparent',
            transition: 'background .15s ease', textAlign: 'left',
          }}
            onMouseEnter={e => { if (!profileOpen) e.currentTarget.style.background = 'var(--bg-soft)'; }}
            onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = 'transparent'; }}
          >
            <Avatar name="Jana Kováčová" size={28} />
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Jana Kováčová</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Finance · Analyst</div>
              </div>
            )}
            {!collapsed && <Icon name="chevDown" size={12} style={{ color: 'var(--fg-soft)' }} />}
          </button>
          {profileOpen && <ProfileMenu collapsed={collapsed} onClose={() => setProfileOpen(false)} go={go} />}
        </div>
      </div>
    </aside>
  );
};

Object.assign(window, { Sidebar, Logo });
