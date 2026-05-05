// AI Assistant — chat UI

const MOCK_ANSWERS = {
  revenue: {
    text: "Revenue month-to-date is €146.2M — tracking +8.4% vs same period last month and +19.1% YoY. B2C contributes 64%, Marketplace 22%. Two country callouts: CZ at +31% YoY, DE at −6% (shortfall in Protein).",
    chips: ['Revenue', 'MTD', 'By country'],
    followups: ["Break down by channel", "Compare to target", "Why is DE down?"],
    chart: { kind: 'line', series: [58,62,60,68,72,70,78,82,80,84,88,92,96,102,108,112,118,124,130,136,140,144,146.2], label: '€ MTD, 23 days' },
  },
  growth: {
    text: "Customer growth by region (last 90 days, new paying customers):\n• CEE +18.4%  • DACH +9.1%  • Benelux +4.2%  • Southern EU +2.8%\nCEE is propelled by a referral program that shipped in Feb.",
    chips: ['Customers', 'Region', 'L90D'],
    followups: ['Plot as a chart', 'Segment by channel', 'Who owns CEE growth?'],
    chart: { kind: 'bar', data: [['CEE',18.4],['DACH',9.1],['Benelux',4.2],['S.EU',2.8]], label: '% change L90D' },
  },
  gm: {
    text: "Gross Margin is (Revenue − COGS) / Revenue, excluding shipping and payment fees. We report it both as absolute (GM1) and as a percentage (GM1 %). It is certified, owned by Elena Váňová in Finance, and computed daily from the finance mart.",
    chips: ['Gross Margin', 'Definition'],
    followups: ['Show current GM%', 'Compare GM across categories', 'Open the metric page'],
  },
  default: {
    text: "I pulled certified metrics for that. Nothing looks anomalous in the last 7 days. Want me to expand the window, or break it down by a specific dimension?",
    chips: ['Certified', 'L7D'],
    followups: ['Last 30 days', 'By region', 'By channel'],
  },
};

const matchAnswer = (q) => {
  const s = q.toLowerCase();
  if (s.includes('revenue')) return MOCK_ANSWERS.revenue;
  if (s.includes('growth') || s.includes('customer') || s.includes('region')) return MOCK_ANSWERS.growth;
  if (s.includes('gross margin') || s.includes('gm') || s.includes('explain')) return MOCK_ANSWERS.gm;
  return MOCK_ANSWERS.default;
};

const ChatBubble = ({ role, children }) => {
  const isUser = role === 'user';
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row' }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: isUser ? 'var(--bg-muted)' : 'linear-gradient(135deg, oklch(0.55 0.18 265), oklch(0.6 0.18 305))',
        color: isUser ? 'var(--fg)' : '#fff',
        flexShrink: 0, boxShadow: 'var(--shadow-xs)',
      }}>
        {isUser ? <Icon name="user" size={14} /> : <Icon name="sparkles" size={15} />}
      </div>
      <div style={{
        maxWidth: '80%',
        background: isUser ? 'var(--fg)' : 'var(--bg-elev)',
        color: isUser ? '#fff' : 'var(--fg)',
        border: isUser ? 'none' : '1px solid var(--border)',
        borderRadius: 14,
        padding: '12px 14px',
        fontSize: 13.5, lineHeight: 1.6,
        boxShadow: isUser ? 'none' : 'var(--shadow-xs)',
      }}>
        {children}
      </div>
    </div>
  );
};

const AssistantPage = ({ go }) => {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const ask = (q) => {
    if (!q.trim()) return;
    setMessages(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const ans = matchAnswer(q);
      setMessages(m => [...m, { role: 'assistant', ...ans }]);
      setTyping(false);
    }, 700);
  };

  const showEmpty = messages.length === 0 && !typing;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--header-h))' }}>
      <PageShell style={{ paddingTop: 20, paddingBottom: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'linear-gradient(135deg, oklch(0.55 0.18 265), oklch(0.6 0.18 305))',
                color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <Icon name="sparkles" size={15} />
              </div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-.015em' }}>AI Assistant</h1>
              <Badge tone="accent">Beta</Badge>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 4 }}>
              Ask in plain English. Answers use certified metrics only — never raw tables.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" size="sm" icon="refresh" onClick={() => setMessages([])}>New chat</Button>
            <Button variant="secondary" size="sm" icon="clock">History</Button>
          </div>
        </div>
      </PageShell>

      {/* Scroll area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '12px 36px 24px' }}>
          {showEmpty && (
            <div style={{ textAlign: 'center', padding: '40px 0 24px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 14px',
                background: 'linear-gradient(135deg, oklch(0.55 0.18 265), oklch(0.6 0.18 305))',
                color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
              }}>
                <Icon name="sparkles" size={26} />
              </div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-.02em' }}>What would you like to know?</h2>
              <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--fg-muted)' }}>Ask anything about the business. Grounded in certified metrics.</p>

              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 640, margin: '24px auto 0' }}>
                {SUGGESTED_Q.map(q => (
                  <button key={q} onClick={() => ask(q)} style={{
                    textAlign: 'left', padding: '14px 16px', borderRadius: 12,
                    background: 'var(--bg-elev)', border: '1px solid var(--border)',
                    fontSize: 13.5, color: 'var(--fg)', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'all .15s ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <Icon name="sparkle2" size={14} style={{ color: 'var(--accent)' }} />
                    {q}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 22, fontSize: 11.5, color: 'var(--fg-soft)' }}>
                <Icon name="shield" size={11} style={{ verticalAlign: -2, marginRight: 4 }} />
                Responses never include PII. Queries are logged for quality review.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role}>
                {m.role === 'user' ? m.text : (
                  <>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                    {m.chips && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                        {m.chips.map(c => <Badge key={c} tone="accent">{c}</Badge>)}
                      </div>
                    )}
                    {m.chart && m.chart.kind === 'line' && (
                      <div style={{ marginTop: 14, padding: 12, background: 'var(--bg-soft)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 11, color: 'var(--fg-soft)', marginBottom: 6 }}>{m.chart.label}</div>
                        <Sparkline data={m.chart.series} color="var(--accent)" width={560} height={72} />
                      </div>
                    )}
                    {m.chart && m.chart.kind === 'bar' && (
                      <div style={{ marginTop: 14, padding: 12, background: 'var(--bg-soft)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 11, color: 'var(--fg-soft)', marginBottom: 6 }}>{m.chart.label}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {m.chart.data.map(([k,v]) => {
                            const max = Math.max(...m.chart.data.map(x => x[1]));
                            return (
                              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                <div style={{ width: 60 }}>{k}</div>
                                <div style={{ flex: 1, height: 8, background: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
                                  <div style={{ width: `${(v / max) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 4 }} />
                                </div>
                                <div style={{ width: 48, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>+{v}%</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {m.followups && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                        {m.followups.map(f => (
                          <button key={f} onClick={() => ask(f)} style={{
                            padding: '5px 10px', borderRadius: 999,
                            background: 'var(--bg-muted)', color: 'var(--fg)',
                            fontSize: 11.5, fontWeight: 500,
                            border: '1px solid var(--border)',
                          }}>{f}</button>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--fg-soft)' }}>
                      <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="copy" size={11} /> Copy</button>
                      <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="share" size={11} /> Share</button>
                      <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent)' }} onClick={() => go({ page: 'metrics' })}><Icon name="book" size={11} /> See source</button>
                    </div>
                  </>
                )}
              </ChatBubble>
            ))}

            {typing && (
              <ChatBubble role="assistant">
                <div style={{ display: 'flex', gap: 4, padding: '4px 2px' }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--fg-soft)',
                      animation: `bounce 1.2s ${i * 0.15}s infinite ease-in-out`,
                    }} />
                  ))}
                </div>
              </ChatBubble>
            )}
          </div>
        </div>
      </div>

      {/* Composer */}
      <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', background: 'oklch(0.992 0.002 80 / 0.9)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '14px 36px 20px' }}>
          <form onSubmit={e => { e.preventDefault(); ask(input); }} style={{
            display: 'flex', alignItems: 'flex-end', gap: 8,
            background: 'var(--bg-elev)', border: '1px solid var(--border-strong)',
            borderRadius: 14, padding: 8, boxShadow: 'var(--shadow-sm)',
          }}>
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); } }}
              placeholder="Ask about revenue, retention, conversion…"
              style={{
                flex: 1, resize: 'none', border: 'none', outline: 'none',
                background: 'transparent', color: 'var(--fg)',
                fontSize: 13.5, lineHeight: 1.5, padding: '8px 10px',
                minHeight: 24, maxHeight: 140,
              }}
            />
            <button type="button" style={{ padding: '6px', borderRadius: 8, color: 'var(--fg-muted)' }}><Icon name="plus" size={16} /></button>
            <button type="submit" style={{
              width: 34, height: 34, borderRadius: 10,
              background: input.trim() ? 'var(--fg)' : 'var(--bg-muted)',
              color: input.trim() ? '#fff' : 'var(--fg-soft)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="arrowUp" size={15} stroke={2.2} />
            </button>
          </form>
          <div style={{ fontSize: 11, color: 'var(--fg-soft)', marginTop: 8, textAlign: 'center' }}>
            The Assistant can make mistakes. Always verify against the source dashboard.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: .4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

Object.assign(window, { AssistantPage });
