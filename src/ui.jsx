// Shared UI primitives

const Badge = ({ children, tone = 'neutral', soft = false, style, ...rest }) => {
  const tones = {
    neutral: { bg: 'var(--bg-muted)', fg: 'var(--fg-muted)', bd: 'var(--border)' },
    accent:  { bg: 'var(--accent-soft)', fg: 'var(--accent)', bd: 'transparent' },
    success: { bg: 'var(--success-soft)', fg: 'var(--success)', bd: 'transparent' },
    warn:    { bg: 'var(--warn-soft)',    fg: 'var(--warn)',    bd: 'transparent' },
    danger:  { bg: 'var(--danger-soft)',  fg: 'var(--danger)',  bd: 'transparent' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span {...rest} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 999,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontSize: 11, fontWeight: 500, letterSpacing: '.01em',
      ...style,
    }}>{children}</span>
  );
};

const Chip = ({ active, children, onClick, style }) => (
  <button onClick={onClick} style={{
    padding: '6px 12px', borderRadius: 999,
    border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
    background: active ? 'var(--fg)' : 'var(--bg-elev)',
    color: active ? '#fff' : 'var(--fg)',
    fontSize: 12.5, fontWeight: 500,
    transition: 'all .15s ease',
    ...style,
  }}>{children}</button>
);

const Button = ({ variant = 'secondary', size = 'md', icon, iconRight, children, style, ...rest }) => {
  const sizes = {
    sm: { h: 28, px: 10, fs: 12.5, gap: 6, ic: 14 },
    md: { h: 34, px: 12, fs: 13,   gap: 6, ic: 15 },
    lg: { h: 40, px: 16, fs: 14,   gap: 8, ic: 16 },
  }[size];
  const variants = {
    primary:   { bg: 'var(--fg)', fg: '#fff', bd: 'var(--fg)', sh: 'var(--shadow-xs)' },
    secondary: { bg: 'var(--bg-elev)', fg: 'var(--fg)', bd: 'var(--border)', sh: 'var(--shadow-xs)' },
    ghost:     { bg: 'transparent', fg: 'var(--fg)', bd: 'transparent', sh: 'none' },
    accent:    { bg: 'var(--accent)', fg: '#fff', bd: 'var(--accent)', sh: 'var(--shadow-xs)' },
  };
  const v = variants[variant];
  return (
    <button {...rest} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sizes.gap,
      height: sizes.h, padding: `0 ${sizes.px}px`, borderRadius: 10,
      background: v.bg, color: v.fg, border: `1px solid ${v.bd}`,
      fontSize: sizes.fs, fontWeight: 500, letterSpacing: '-.005em',
      boxShadow: v.sh, transition: 'all .15s ease', whiteSpace: 'nowrap',
      ...style,
    }}>
      {icon && <Icon name={icon} size={sizes.ic} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sizes.ic} />}
    </button>
  );
};

const IconButton = ({ icon, size = 16, boxSize = 34, active, style, ...rest }) => (
  <button {...rest} style={{
    width: boxSize, height: boxSize, borderRadius: 10,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: active ? 'var(--bg-muted)' : 'transparent',
    color: active ? 'var(--fg)' : 'var(--fg-muted)',
    border: '1px solid transparent',
    transition: 'all .15s ease',
    ...style,
  }} onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-soft)'; }}
     onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
    <Icon name={icon} size={size} />
  </button>
);

const Card = ({ children, style, padded = true, interactive = false, ...rest }) => (
  <div {...rest} style={{
    background: 'var(--bg-elev)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: padded ? 20 : 0,
    boxShadow: 'var(--shadow-xs)',
    transition: 'all .2s ease',
    cursor: interactive ? 'pointer' : 'default',
    ...style,
  }}
    onMouseEnter={interactive ? e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.borderColor = 'var(--border-strong)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    } : undefined}
    onMouseLeave={interactive ? e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.transform = 'translateY(0)';
    } : undefined}
  >{children}</div>
);

const Avatar = ({ name = 'You', size = 28, color }) => {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const hue = color || ((name.charCodeAt(0) * 37) % 360);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `oklch(0.9 0.05 ${hue})`, color: `oklch(0.35 0.12 ${hue})`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.38), fontWeight: 600, letterSpacing: '-.01em',
      flexShrink: 0,
    }}>{initials}</div>
  );
};

const SectionHeader = ({ title, subtitle, action, style }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 14, ...style }}>
    <div>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-.01em' }}>{title}</h3>
      {subtitle && <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--fg-muted)' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Breadcrumbs = ({ items }) => (
  <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-muted)' }}>
    {items.map((it, i) => (
      <React.Fragment key={i}>
        {i > 0 && <Icon name="chevRight" size={13} style={{ color: 'var(--fg-soft)', opacity: .7 }} />}
        {it.onClick ? (
          <button onClick={it.onClick} style={{
            color: i === items.length - 1 ? 'var(--fg)' : 'var(--fg-muted)',
            fontWeight: i === items.length - 1 ? 500 : 400,
            padding: '2px 6px', borderRadius: 6, margin: '0 -6px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{it.label}</button>
        ) : (
          <span style={{ color: i === items.length - 1 ? 'var(--fg)' : 'var(--fg-muted)', fontWeight: i === items.length - 1 ? 500 : 400 }}>{it.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

const StatusDot = ({ status }) => {
  const c = {
    Certified:  { color: 'var(--success)', bg: 'var(--success-soft)', label: 'Certified' },
    Draft:      { color: 'var(--warn)',    bg: 'var(--warn-soft)',    label: 'Draft' },
    Deprecated: { color: 'var(--danger)',  bg: 'var(--danger-soft)',  label: 'Deprecated' },
  }[status] || { color: 'var(--fg-muted)', bg: 'var(--bg-muted)', label: status };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
      {c.label}
    </span>
  );
};

const Empty = ({ icon, title, desc }) => (
  <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--fg-muted)' }}>
    {icon && <Icon name={icon} size={24} style={{ color: 'var(--fg-soft)' }} />}
    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)', marginTop: 8 }}>{title}</div>
    {desc && <div style={{ fontSize: 13, marginTop: 4 }}>{desc}</div>}
  </div>
);

// Page container — consistent padding + max-width
const PageShell = ({ children, style }) => (
  <div style={{
    maxWidth: 1360, margin: '0 auto',
    padding: '28px 36px 48px', ...style,
  }}>{children}</div>
);

const PageTitle = ({ crumbs, title, subtitle, action }) => (
  <header style={{ marginBottom: 24 }}>
    {crumbs && <div style={{ marginBottom: 14 }}><Breadcrumbs items={crumbs} /></div>}
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.02em' }}>{title}</h1>
        {subtitle && <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--fg-muted)', maxWidth: 640 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  </header>
);

Object.assign(window, {
  Badge, Chip, Button, IconButton, Card, Avatar,
  SectionHeader, Breadcrumbs, StatusDot, Empty,
  PageShell, PageTitle,
});
