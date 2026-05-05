// App root + router

const LS_KEY = 'lumen-portal-route-v1';
const LS_SIDEBAR = 'lumen-portal-sidebar-v1';

const App = () => {
  const [route, setRoute] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      if (saved && saved.page) return saved;
    } catch (e) {}
    return { page: 'home' };
  });

  const [collapsed, setCollapsed] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_SIDEBAR) || 'false'); } catch (e) { return false; }
  });

  React.useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(route)); } catch (e) {}
  }, [route]);

  React.useEffect(() => {
    try { localStorage.setItem(LS_SIDEBAR, JSON.stringify(collapsed)); } catch (e) {}
    document.documentElement.style.setProperty('--sidebar-w', collapsed ? '64px' : '232px');
  }, [collapsed]);

  const go = (r) => setRoute(r);

  const navPage = (() => {
    if (route.page === 'dashboard-detail') return 'dashboards';
    if (route.page === 'executive-detail') return 'executive';
    if (route.page === 'metric-detail')    return 'metrics';
    return route.page;
  })();

  let content;
  switch (route.page) {
    case 'home':              content = <HomePage go={go} />; break;
    case 'dashboards':        content = <DashboardsPage go={go} />; break;
    case 'dashboard-detail':  content = <DashboardDetail id={route.id} go={go} />; break;
    case 'executive':         content = <ExecutiveList go={go} />; break;
    case 'executive-detail':  content = <ExecutiveDetail id={route.id} go={go} />; break;
    case 'metrics':           content = <MetricsCatalog go={go} />; break;
    case 'metric-detail':     content = <MetricDetail id={route.id} go={go} />; break;
    case 'assistant':         content = <AssistantPage go={go} />; break;
    case 'app-scout':         content = <ScoutApp go={go} />; break;
    case 'app-reviews':       content = <ReviewInsightsApp go={go} />; break;
    case 'app-scraper':       content = <ScraperConfigApp go={go} />; break;
    case 'settings':          content = <SettingsPage go={go} />; break;
    default:                  content = <HomePage go={go} />;
  }

  const isFullHeight = route.page === 'assistant';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} data-screen-label={route.page}>
      <Sidebar page={navPage} go={go} route={route} collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <main style={{
        flex: 1, marginLeft: 'var(--sidebar-w)',
        display: 'flex', flexDirection: 'column',
        minHeight: '100vh',
        transition: 'margin-left .2s ease',
      }}>
        <div style={{ flex: 1, display: isFullHeight ? 'flex' : 'block', flexDirection: 'column', minHeight: 0 }}>
          {content}
        </div>
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
