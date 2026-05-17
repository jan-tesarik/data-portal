// Create Dashboard wizard
// Flow: source → data → describe → generate (Claude) → preview → save

const SAMPLE_DATASETS = {
  spreadsheet: {
    filename: 'events_2026_q1.xlsx',
    columns: ['event_id','event_name','date','city','spend_eur','attended','leads','pipeline_eur'],
    rows: [
      ['EV-001','Berlin Sport Expo',     '2026-01-12','Berlin',    18400,1240,184,420000],
      ['EV-002','London Marathon Booth', '2026-01-26','London',    22800, 980,142,360000],
      ['EV-003','Prague Wellness Days',  '2026-02-08','Prague',     7200, 640, 88,180000],
      ['EV-004','Vienna Fitness Summit', '2026-02-22','Vienna',    12400, 540,102,240000],
      ['EV-005','Webinar: Recovery',     '2026-03-01','Online',      900,1820, 96,140000],
      ['EV-006','Sponsorship: HYROX SK', '2026-03-14','Bratislava',24000,2200,310,560000],
      ['EV-007','Munich Trail Festival', '2026-03-21','Munich',    14200, 720,114,210000],
      ['EV-008','Webinar: Protein 101',  '2026-04-05','Online',      900,2400,128,180000],
    ],
  },
  chat: {
    columns: ['warehouse','sku_class','week','picks','errors','error_rate'],
    rows: [
      ['SK03','Powders','2026-W14',  4200, 38, 0.90],
      ['SK03','Bars',   '2026-W14',  3100, 22, 0.71],
      ['CZ01','Powders','2026-W14',  5800, 12, 0.21],
      ['CZ01','Bars',   '2026-W14',  4400,  6, 0.14],
      ['CZ02','Powders','2026-W14',  3900, 18, 0.46],
      ['SK03','Powders','2026-W15',  4400, 42, 0.95],
      ['CZ01','Powders','2026-W15',  6100, 10, 0.16],
      ['CZ02','Powders','2026-W15',  4100, 19, 0.46],
    ],
  },
};

const CreateDashboard = ({ go }) => {
  const [step, setStep] = React.useState(1);
  const [source, setSource] = React.useState(null);    // 'spreadsheet' | 'chat'
  const [dataset, setDataset] = React.useState(null);
  const [chatMsgs, setChatMsgs] = React.useState([]);
  const [chatInput, setChatInput] = React.useState('');
  const [chatBusy, setChatBusy] = React.useState(false);
  const [name, setName] = React.useState('');
  const [prompt, setPrompt] = React.useState('');
  const [generating, setGenerating] = React.useState(false);
  const [spec, setSpec] = React.useState(null);
  const [shareTeams, setShareTeams] = React.useState(['Marketing']);
  const [saved, setSaved] = React.useState(false);

  const steps = ['Source', 'Data', 'Describe', 'Preview', 'Save'];

  // -- Step 1 → 2
  const chooseSource = (s) => {
    setSource(s);
    if (s === 'spreadsheet') {
      // simulate upload
      setDataset(SAMPLE_DATASETS.spreadsheet);
      setName('Marketing event ROI tracker');
      setPrompt('Show spend, leads and pipeline by event. Highlight the top performers and a weekly trend.');
    } else {
      setChatMsgs([{ role: 'assistant', text: "Hi! Tell me what data you want. I can pull from any certified warehouse table." }]);
    }
    setStep(2);
  };

  const askChat = async (q) => {
    setChatBusy(true);
    setChatMsgs(m => [...m, { role: 'user', text: q }]);
    setChatInput('');
    await new Promise(r => setTimeout(r, 700));
    setChatMsgs(m => [...m, {
      role: 'assistant',
      text: `Found a matching slice in warehouse.ops_mart.pick_quality — 184k rows across 14 warehouses. Returning a sample weekly cut for the last 90 days.`,
    }]);
    setDataset(SAMPLE_DATASETS.chat);
    setName('Pick error rate by warehouse');
    setPrompt('Show error rate trend by warehouse over the last 13 weeks; highlight outliers.');
    setChatBusy(false);
  };

  // -- Generation with Claude (graceful fallback)
  const generate = async () => {
    setGenerating(true);
    const fallback = source === 'spreadsheet' ? COMMUNITY_DASHBOARDS[0].spec : COMMUNITY_DASHBOARDS[1].spec;
    try {
      const cols = dataset.columns.join(', ');
      const sample = dataset.rows.slice(0, 4).map(r => r.join(' | ')).join('\n');
      const sys = `You design quick BI dashboards. Reply with ONLY a JSON object matching this schema:
{
  "kpis": [{"label": string, "value": string, "delta": string, "trend": "up"|"down"}],
  "charts": [{"type": "line"|"bar", "title": string, "data"?: [{"label": string, "value": number}], "series"?: [{"color": string, "data": number[]}], "xLabels"?: string[]}]
}
Use 3-4 KPIs and 1-2 charts. Colors should be OKLCH strings.`;
      const userMsg = `Dataset columns: ${cols}\nSample rows:\n${sample}\n\nUser request: ${prompt}\n\nReturn ONLY the JSON.`;
      const out = await window.claude.complete({ messages: [{ role: 'user', content: sys + '\n\n' + userMsg }] });
      // Extract JSON
      const m = out.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(m ? m[0] : out);
      if (!parsed.kpis || !parsed.charts) throw new Error('bad shape');
      setSpec(parsed);
    } catch (e) {
      // graceful fallback to canned spec
      setSpec(fallback);
    } finally {
      setGenerating(false);
      setStep(4);
    }
  };

  const saveAndShare = () => {
    setSaved(true);
    setStep(5);
  };

  return (
    <PageShell>
      <Breadcrumbs items={[
        { label: 'Dashboards', onClick: () => go({ page: 'dashboards' }) },
        { label: 'Create dashboard' },
      ]} />

      <header style={{ margin: '14px 0 24px' }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.02em' }}>Create a dashboard</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--fg-muted)', maxWidth: 640 }}>
          Bring your own data — a spreadsheet or a question for the Data Assistant — and Claude will draft a dashboard you can save and share.
        </p>
      </header>

      <Stepper steps={steps} current={step} />

      <div style={{ marginTop: 28 }}>
        {step === 1 && <StepSource onPick={chooseSource} />}
        {step === 2 && (
          source === 'spreadsheet'
            ? <StepUploadPreview dataset={dataset} onBack={() => setStep(1)} onNext={() => setStep(3)} />
            : <StepChatPreview msgs={chatMsgs} input={chatInput} setInput={setChatInput} ask={askChat} busy={chatBusy} dataset={dataset} onBack={() => setStep(1)} onNext={() => setStep(3)} />
        )}
        {step === 3 && <StepDescribe name={name} setName={setName} prompt={prompt} setPrompt={setPrompt} generating={generating} onBack={() => setStep(2)} onGenerate={generate} />}
        {step === 4 && <StepPreview name={name} spec={spec} shareTeams={shareTeams} setShareTeams={setShareTeams} onBack={() => setStep(3)} onSave={saveAndShare} />}
        {step === 5 && <StepDone name={name} go={go} />}
      </div>
    </PageShell>
  );
};

// ---------- Stepper ----------
const Stepper = ({ steps, current }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '14px 18px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 14 }}>
    {steps.map((s, i) => {
      const idx = i + 1;
      const done = idx < current;
      const active = idx === current;
      return (
        <React.Fragment key={s}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: done ? 'var(--success)' : active ? 'var(--fg)' : 'var(--bg-muted)',
              color: done || active ? '#fff' : 'var(--fg-muted)',
              fontSize: 11.5, fontWeight: 600,
              border: active ? 'none' : (done ? 'none' : '1px solid var(--border)'),
            }}>
              {done ? <Icon name="check" size={12} stroke={2.5} /> : idx}
            </div>
            <div style={{
              fontSize: 13, fontWeight: active ? 600 : 500,
              color: active ? 'var(--fg)' : done ? 'var(--fg)' : 'var(--fg-muted)',
            }}>{s}</div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 1, background: done ? 'var(--success)' : 'var(--border)', margin: '0 14px' }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ---------- Step 1: Source ----------
const StepSource = ({ onPick }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
    {[
      { id: 'spreadsheet', icon: 'layers',    title: 'Upload a spreadsheet', desc: 'CSV or Excel (.xlsx). We\'ll preview the first rows and infer column types.', cta: 'Choose file' },
      { id: 'chat',        icon: 'sparkles',  title: 'Ask the Data Assistant', desc: 'Describe what you need. The assistant queries certified warehouse tables.', cta: 'Start chat' },
    ].map(opt => (
      <button key={opt.id} onClick={() => onPick(opt.id)} style={{
        textAlign: 'left', padding: 24, borderRadius: 14,
        background: 'var(--bg-elev)', border: '1px solid var(--border)',
        cursor: 'pointer', transition: 'all .2s ease',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: 'var(--accent-soft)', color: 'var(--accent)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={opt.icon} size={20} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14, letterSpacing: '-.01em' }}>{opt.title}</div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.55 }}>{opt.desc}</div>
        <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 13, fontWeight: 500 }}>
          {opt.cta} <Icon name="arrowRight" size={13} />
        </div>
      </button>
    ))}
  </div>
);

// ---------- Step 2: Upload preview ----------
const StepUploadPreview = ({ dataset, onBack, onNext }) => (
  <div>
    <DropZone filename={dataset.filename} rows={dataset.rows.length} />
    <DataTable dataset={dataset} />
    <StepFooter onBack={onBack} onNext={onNext} nextLabel="Continue" nextDisabled={!dataset} />
  </div>
);

const DropZone = ({ filename, rows }) => (
  <div style={{
    padding: '20px 20px', border: '1.5px dashed oklch(0.8 0.05 155)',
    background: 'oklch(0.97 0.05 155 / 0.4)',
    borderRadius: 12, marginBottom: 14,
    display: 'flex', alignItems: 'center', gap: 14,
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 10,
      background: 'var(--success-soft)', color: 'var(--success)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name="check" size={20} stroke={2} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{filename}</div>
      <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{rows} rows · column types inferred</div>
    </div>
    <Button variant="ghost" size="sm" icon="refresh">Replace</Button>
  </div>
);

const DataTable = ({ dataset }) => (
  <Card padded={false} style={{ overflow: 'hidden' }}>
    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 13, fontWeight: 600 }}>Preview · first {dataset.rows.length} rows</div>
      <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{dataset.columns.length} columns</div>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 700 }}>
        <thead>
          <tr style={{ background: 'var(--bg-soft)' }}>
            {dataset.columns.map(c => (
              <th key={c} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid var(--border)' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataset.rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
              {r.map((v, j) => (
                <td key={j} style={{ padding: '8px 12px', fontFamily: typeof v === 'number' ? 'JetBrains Mono, monospace' : 'inherit', fontSize: typeof v === 'number' ? 11.5 : 12.5, textAlign: typeof v === 'number' ? 'right' : 'left', color: 'var(--fg)' }}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

// ---------- Step 2 (chat) ----------
const StepChatPreview = ({ msgs, input, setInput, ask, busy, dataset, onBack, onNext }) => (
  <div>
    <Card padded={false} style={{ overflow: 'hidden', marginBottom: 14 }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="sparkles" size={14} style={{ color: 'var(--accent)' }} />
        <div style={{ fontSize: 13, fontWeight: 600 }}>Data Assistant</div>
        <Badge tone="accent" style={{ marginLeft: 'auto' }}>Certified warehouse</Badge>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '76%', padding: '8px 12px', borderRadius: 12,
              background: m.role === 'user' ? 'var(--fg)' : 'var(--bg-muted)',
              color: m.role === 'user' ? '#fff' : 'var(--fg)',
              fontSize: 13, lineHeight: 1.5,
            }}>{m.text}</div>
          </div>
        ))}
        {busy && <div style={{ color: 'var(--fg-soft)', fontSize: 12 }}>Searching warehouse…</div>}
      </div>
      <form onSubmit={e => { e.preventDefault(); if (input.trim()) ask(input); }} style={{
        display: 'flex', gap: 8, padding: 10, borderTop: '1px solid var(--border)',
      }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. Pick error rate by warehouse, weekly, last 90 days"
          style={{ flex: 1, height: 34, padding: '0 12px', background: 'var(--bg-muted)', borderRadius: 8, border: '1px solid transparent', fontSize: 13, outline: 'none' }} />
        <Button variant="primary" size="md" icon="arrowRight" type="submit">Send</Button>
      </form>
    </Card>
    {dataset && <DataTable dataset={dataset} />}
    <StepFooter onBack={onBack} onNext={onNext} nextLabel="Continue" nextDisabled={!dataset} />
  </div>
);

// ---------- Step 3: Describe ----------
const StepDescribe = ({ name, setName, prompt, setPrompt, generating, onBack, onGenerate }) => (
  <Card style={{ padding: 24 }}>
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 12.5, fontWeight: 500, display: 'block', marginBottom: 6 }}>Dashboard name</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Marketing event ROI tracker" style={{
        width: '100%', height: 38, padding: '0 12px',
        background: 'var(--bg-muted)', border: '1px solid transparent',
        borderRadius: 9, fontSize: 14, outline: 'none',
      }} />
    </div>

    <div>
      <label style={{ fontSize: 12.5, fontWeight: 500, display: 'block', marginBottom: 6 }}>What should the dashboard show?</label>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} placeholder="Describe the views, KPIs, and grouping you want." style={{
        width: '100%', padding: '10px 12px',
        background: 'var(--bg-muted)', border: '1px solid transparent',
        borderRadius: 9, fontSize: 13.5, lineHeight: 1.55, outline: 'none',
        resize: 'vertical', fontFamily: 'inherit',
      }} />
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[
          'Add a weekly trend line',
          'Compare against last quarter',
          'Highlight top-5 outliers',
          'Group by region and channel',
        ].map(s => (
          <button key={s} onClick={() => setPrompt(p => p + (p ? '\n• ' : '• ') + s)} style={{
            padding: '4px 10px', borderRadius: 999,
            background: 'var(--bg-muted)', border: '1px solid var(--border)',
            fontSize: 11.5, color: 'var(--fg-muted)',
          }}>+ {s}</button>
        ))}
      </div>
    </div>

    <div style={{
      marginTop: 22, padding: 14, borderRadius: 10,
      background: 'linear-gradient(135deg, oklch(0.98 0.03 265), oklch(0.97 0.03 305))',
      border: '1px solid oklch(0.9 0.04 265)',
      display: 'flex', gap: 12, alignItems: 'center',
    }}>
      <Icon name="sparkles" size={18} style={{ color: 'var(--accent)' }} />
      <div style={{ flex: 1, fontSize: 12.5, color: 'var(--fg)' }}>
        Claude will draft KPIs and charts from your data. You can edit after generating.
      </div>
    </div>

    <StepFooter onBack={onBack} onNext={onGenerate} nextLabel={generating ? 'Generating…' : 'Generate with Claude'} nextIcon="sparkles" nextDisabled={!name.trim() || !prompt.trim() || generating} />
  </Card>
);

// ---------- Step 4: Preview ----------
const StepPreview = ({ name, spec, shareTeams, setShareTeams, onBack, onSave }) => {
  const teamOpts = ['Marketing','Finance','Product','Operations','People'];
  const togTeam = (t) => setShareTeams(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]);
  return (
    <div>
      <Card padded={false} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="sparkles" size={14} style={{ color: 'var(--accent)' }} />
          <div style={{ fontSize: 13, fontWeight: 600 }}>{name || 'Untitled dashboard'}</div>
          <Badge tone="warn">Draft</Badge>
          <div style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--fg-muted)' }}>Generated by Claude · just now</div>
        </div>
        <div style={{ padding: 20 }}>
          <DashboardSpec spec={spec} />
        </div>
      </Card>

      <Card style={{ marginTop: 14 }}>
        <SectionHeader title="Share with" subtitle="Anyone on these teams can find this dashboard in the Community tab" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {teamOpts.map(t => <Chip key={t} active={shareTeams.includes(t)} onClick={() => togTeam(t)}>{t}</Chip>)}
        </div>
      </Card>

      <StepFooter onBack={onBack} onNext={onSave} nextLabel="Save & share" nextIcon="check" />
    </div>
  );
};

const DashboardSpec = ({ spec }) => {
  if (!spec) return null;
  return (
    <div>
      {spec.kpis && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${spec.kpis.length}, 1fr)`, gap: 12, marginBottom: 18 }}>
          {spec.kpis.map((k, i) => (
            <div key={i} style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-soft)' }}>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', marginTop: 2 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: k.trend === 'up' ? 'var(--success)' : 'var(--danger)', marginTop: 2, fontWeight: 500 }}>{k.delta}</div>
            </div>
          ))}
        </div>
      )}
      {spec.charts && spec.charts.map((c, i) => (
        <div key={i} style={{ marginTop: i === 0 ? 0 : 22 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>{c.title}</div>
          {c.type === 'line' && (
            <LineChart
              series={(c.series || []).map((s, j) => ({ name: 'S' + (j+1), color: s.color || `oklch(0.55 0.18 ${265 - j*40})`, data: s.data || s }))}
              xLabels={c.xLabels || []}
              height={220}
            />
          )}
          {c.type === 'bar' && <BarChart data={c.data || []} height={220} />}
        </div>
      ))}
    </div>
  );
};

// ---------- Step 5: Done ----------
const StepDone = ({ name, go }) => (
  <Card style={{ padding: 36, textAlign: 'center' }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16, margin: '0 auto 14px',
      background: 'var(--success-soft)', color: 'var(--success)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name="check" size={26} stroke={2.5} />
    </div>
    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-.015em' }}>Dashboard saved</h2>
    <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--fg-muted)', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
      "{name}" is in <strong>Community Dashboards</strong>. Request verification from the BI team to add a verified badge.
    </p>
    <div style={{ marginTop: 22, display: 'flex', gap: 8, justifyContent: 'center' }}>
      <Button variant="secondary" icon="grid" onClick={() => go({ page: 'dashboards' })}>Back to Dashboards</Button>
      <Button variant="primary" icon="shield" onClick={() => go({ page: 'dashboards' })}>Request verification</Button>
    </div>
  </Card>
);

// ---------- Footer (back / next) ----------
const StepFooter = ({ onBack, onNext, nextLabel, nextIcon, nextDisabled }) => (
  <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
    {onBack ? <Button variant="ghost" icon="chevLeft" onClick={onBack}>Back</Button> : <span />}
    <Button variant="primary" icon={nextIcon} onClick={onNext} disabled={nextDisabled} style={{ opacity: nextDisabled ? 0.5 : 1, cursor: nextDisabled ? 'not-allowed' : 'pointer' }}>
      {nextLabel}
    </Button>
  </div>
);

Object.assign(window, { CreateDashboard, DashboardSpec });
