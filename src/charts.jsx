// Inline SVG charts — no libraries

const Sparkline = ({ data, color = 'var(--accent)', width = 120, height = 36, fill = true }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pad = 2;
  const w = width - pad * 2, h = height - pad * 2;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * step, pad + h - ((v - min) / span) * h]);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = `${path} L ${pts[pts.length-1][0].toFixed(1)} ${pad + h} L ${pts[0][0].toFixed(1)} ${pad + h} Z`;
  const gid = 'sp-' + Math.random().toString(36).slice(2, 8);
  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path d={path} stroke={color} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r={2.5} fill={color} />
    </svg>
  );
};

const LineChart = ({ series, width = 800, height = 260, yFmt = v => v, xLabels = [] }) => {
  // series: [{ name, color, data: [n,n,...] }]
  const pad = { l: 44, r: 16, t: 14, b: 28 };
  const w = width - pad.l - pad.r, h = height - pad.t - pad.b;
  const all = series.flatMap(s => s.data);
  const max = Math.max(...all);
  const min = Math.min(0, ...all);
  const span = max - min || 1;
  const n = series[0].data.length;
  const x = (i) => pad.l + (i / (n - 1)) * w;
  const y = (v) => pad.t + h - ((v - min) / span) * h;
  const ticks = 5;
  const tickVals = Array.from({length: ticks}, (_, i) => min + (span * i) / (ticks - 1));
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {tickVals.map((v, i) => (
        <g key={i}>
          <line x1={pad.l} x2={pad.l + w} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeWidth="1" strokeDasharray={i === 0 ? '' : '2 3'} />
          <text x={pad.l - 8} y={y(v) + 3.5} textAnchor="end" fontSize="10" fill="var(--fg-soft)" fontFamily="Inter">{yFmt(v)}</text>
        </g>
      ))}
      {xLabels.length > 0 && xLabels.map((lab, i) => {
        const pos = (i / (xLabels.length - 1)) * w + pad.l;
        return <text key={i} x={pos} y={pad.t + h + 16} textAnchor="middle" fontSize="10" fill="var(--fg-soft)" fontFamily="Inter">{lab}</text>;
      })}
      {series.map((s, si) => {
        const path = s.data.map((v, i) => (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
        const area = `${path} L ${x(n-1).toFixed(1)} ${y(min).toFixed(1)} L ${x(0).toFixed(1)} ${y(min).toFixed(1)} Z`;
        const gid = `lc-${si}-${Math.random().toString(36).slice(2,6)}`;
        return (
          <g key={si}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={si === 0 ? 0.16 : 0.06} />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {si === 0 && <path d={area} fill={`url(#${gid})`} />}
            <path d={path} stroke={s.color} strokeWidth="1.8" fill="none" strokeDasharray={s.dashed ? '5 4' : ''} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
};

const BarChart = ({ data, width = 800, height = 260, yFmt = v => v, barColor }) => {
  // data: [{ label, value, color? }]
  const pad = { l: 44, r: 16, t: 14, b: 32 };
  const w = width - pad.l - pad.r, h = height - pad.t - pad.b;
  const max = Math.max(...data.map(d => d.value));
  const min = 0;
  const span = max - min || 1;
  const y = (v) => pad.t + h - ((v - min) / span) * h;
  const gap = 8;
  const bw = (w - gap * (data.length - 1)) / data.length;
  const ticks = 5;
  const tickVals = Array.from({length: ticks}, (_, i) => (span * i) / (ticks - 1));
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {tickVals.map((v, i) => (
        <g key={i}>
          <line x1={pad.l} x2={pad.l + w} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeDasharray={i === 0 ? '' : '2 3'} />
          <text x={pad.l - 8} y={y(v) + 3.5} textAnchor="end" fontSize="10" fill="var(--fg-soft)" fontFamily="Inter">{yFmt(v)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const bx = pad.l + i * (bw + gap);
        const by = y(d.value);
        const bh = pad.t + h - by;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={bw} height={bh} rx={4} fill={d.color || barColor || 'var(--accent)'} opacity={d.dim ? 0.3 : 1} />
            <text x={bx + bw / 2} y={pad.t + h + 16} textAnchor="middle" fontSize="10" fill="var(--fg-soft)" fontFamily="Inter">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const Donut = ({ value, total = 100, size = 52, stroke = 6, color = 'var(--accent)', track = 'var(--bg-muted)' }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / total));
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round" />
    </svg>
  );
};

Object.assign(window, { Sparkline, LineChart, BarChart, Donut });
