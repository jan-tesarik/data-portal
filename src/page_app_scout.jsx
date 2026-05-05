// Vilgain Scout Scraping App — spreadsheet-style influencer table

const ScoutApp = ({ go }) => {
  const [rows, setRows] = React.useState(SCOUT_INFLUENCERS);
  const [query, setQuery] = React.useState('');
  const [regionFilter, setRegionFilter] = React.useState('all');
  const [selected, setSelected] = React.useState(new Set());

  const regions = ['all', ...Array.from(new Set(SCOUT_INFLUENCERS.map(r => r.region)))];

  const filtered = rows.filter(r => {
    if (regionFilter !== 'all' && r.region !== regionFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !String(r.customer_id).includes(q)) return false;
    }
    return true;
  });

  const toggleRow = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  };

  return (
    <PageShell>
      <Breadcrumbs items={[
        { label: 'Data Apps' },
        { label: 'Vilgain Scout' },
      ]} />
      <PageTitle
        title="Vilgain Scout"
        subtitle="Scraped influencer contacts, social handles, and verification status."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" icon="download">Export CSV</Button>
            <Button variant="primary" icon="plus">Add influencer</Button>
          </div>
        }
      />

      {/* Stat strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        {[
          { label: 'Total influencers',  value: rows.length,    icon: 'user'    },
          { label: 'With Instagram',     value: rows.filter(r => r.instagram).length, icon: 'sparkles' },
          { label: 'With TikTok',        value: rows.filter(r => r.tiktok).length, icon: 'sparkles' },
          { label: 'With YouTube',       value: rows.filter(r => r.youtube).length, icon: 'sparkles' },
        ].map(s => (
          <Card key={s.label} style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', marginTop: 2 }}>{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 360 }}>
          <Icon name="search" size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-soft)' }} />
          <input
            placeholder="Search name or customer_id…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', height: 34, padding: '0 10px 0 32px',
              background: 'var(--bg-elev)', border: '1px solid var(--border)',
              borderRadius: 8, fontSize: 13, outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-muted)', padding: 3, borderRadius: 8 }}>
          {regions.map(r => (
            <button key={r} onClick={() => setRegionFilter(r)} style={{
              padding: '5px 11px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              background: regionFilter === r ? 'var(--bg-elev)' : 'transparent',
              boxShadow: regionFilter === r ? 'var(--shadow-xs)' : 'none',
              color: regionFilter === r ? 'var(--fg)' : 'var(--fg-muted)',
            }}>{r === 'all' ? 'All regions' : r}</button>
          ))}
        </div>
        {selected.size > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{selected.size} selected</span>
            <Button variant="ghost" size="sm" icon="mail">Contact</Button>
            <Button variant="ghost" size="sm" icon="tag">Tag</Button>
            <Button variant="ghost" size="sm" icon="trash">Remove</Button>
          </div>
        )}
      </div>

      {/* Spreadsheet */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-elev)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 1100 }}>
            <thead>
              <tr style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)' }}>
                <th style={headCellStyle(36)}>
                  <input type="checkbox"
                    checked={selected.size > 0 && selected.size === filtered.length}
                    onChange={toggleAll} />
                </th>
                {['name','customer_id','region','instagram','tiktok','youtube','facebook'].map((h, i) => (
                  <th key={h} style={headCellStyle(colWidths[h])}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {h}
                      <Icon name="chevDown" size={10} style={{ color: 'var(--fg-soft)' }} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={r.id} style={{
                  borderBottom: '1px solid var(--border)',
                  background: selected.has(r.id) ? 'oklch(0.97 0.04 265)' : (idx % 2 === 0 ? 'var(--bg-elev)' : 'oklch(0.992 0.001 80)'),
                }}>
                  <td style={bodyCellStyle}>
                    <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleRow(r.id)} />
                  </td>
                  <td style={{ ...bodyCellStyle, background: 'oklch(0.97 0.02 60)', fontWeight: 500 }}>
                    {r.name}
                  </td>
                  <td style={bodyCellStyle}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5 }}>{r.customer_id}</span>
                  </td>
                  <td style={bodyCellStyle}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 8px', borderRadius: 4,
                      background: 'oklch(0.92 0.08 150)', color: 'oklch(0.28 0.08 150)',
                      fontSize: 11, fontWeight: 500,
                    }}>
                      {r.region} <Icon name="chevDown" size={9} />
                    </div>
                  </td>
                  <td style={bodyCellStyle}>{renderLink(r.instagram)}</td>
                  <td style={bodyCellStyle}>{renderLink(r.tiktok)}</td>
                  <td style={bodyCellStyle}>{renderLink(r.youtube)}</td>
                  <td style={bodyCellStyle}>{renderLink(r.facebook)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', fontSize: 11.5, color: 'var(--fg-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{filtered.length} of {rows.length} rows</span>
          <span>Last scrape: 2h ago · Next: in 4h</span>
        </div>
      </div>
    </PageShell>
  );
};

const colWidths = { name: 180, customer_id: 120, region: 88, instagram: 260, tiktok: 240, youtube: 220, facebook: 200 };

const headCellStyle = (w) => ({
  textAlign: 'left', padding: '7px 10px', fontSize: 11.5, fontWeight: 600,
  color: 'var(--fg-muted)', borderRight: '1px solid var(--border)',
  minWidth: w, position: 'sticky', top: 0,
});

const bodyCellStyle = {
  padding: '7px 10px', borderRight: '1px solid var(--border)',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  maxWidth: 280,
};

const renderLink = (url) => {
  if (!url) return <span style={{ color: 'var(--fg-soft)' }}>—</span>;
  return (
    <a href={url} target="_blank" rel="noopener" style={{
      color: 'oklch(0.48 0.18 265)', textDecoration: 'underline', fontSize: 11.5,
      overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 260, verticalAlign: 'bottom',
    }}>{url}</a>
  );
};

Object.assign(window, { ScoutApp });
