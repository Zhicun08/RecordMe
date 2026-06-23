// ── Home Screen — 极简 + 今日心情曲线 + 今日收获 ─────────────

function HomeScreen({ entries, wins = [], onSeeAllWins, onOpenSettings }) {
  const [now, setNow] = React.useState(new Date());
  const [colonVisible, setColonVisible] = React.useState(true);

  React.useEffect(() => {
    const tick = setInterval(() => {
      setNow(new Date());
      setColonVisible(v => !v);
    }, 500);
    return () => clearInterval(tick);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 5 ? '还没睡呢' : hour < 11 ? '早上好'
    : hour < 14 ? '中午好' : hour < 18 ? '下午好'
    : hour < 22 ? '晚上好' : '夜深了';

  const todayEntries = entries
    .filter(e => e.ts.toDateString() === now.toDateString())
    .sort((a, b) => a.ts - b.ts);
  const todayWins = wins
    .filter(w => w.ts.toDateString() === now.toDateString())
    .sort((a, b) => b.ts - a.ts);

  const dateStr = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  return (
    <Screen>
      <div style={{ padding: '62px 24px calc(130px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

        {/* Date + Live Clock — full width */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          width: '100%', marginBottom: 18,
        }}>
          <p style={{ margin: 0, fontSize: 13, color: C.text3, fontWeight: 500 }}>{dateStr}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 13, color: C.text3, fontWeight: 600, letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {hh}<span style={{ opacity: colonVisible ? 1 : 0, transition: 'opacity 0.1s' }}>:</span>{mm}
            </p>
            {onOpenSettings && (
              <button onClick={onOpenSettings} aria-label="设置" style={{
                background: 'none', border: 'none', padding: 4, margin: -4, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke={C.text3} strokeWidth="1.7"/>
                  <path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={C.text3} strokeWidth="1.4"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Greeting */}
        <h1 style={{ margin: '0 0 32px', fontSize: 40, fontWeight: 800, color: C.text, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          {greeting}
        </h1>

        {/* Today mood curve */}
        {todayEntries.length > 0 ? (
          <Card style={{ marginBottom: 16, background: C.surface2, boxShadow: 'none', border: `1px solid ${C.border}` }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              今日情绪轨迹
            </p>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: C.text3 }}>{todayEntries.length} 条记录</p>
            <MoodCurve entries={todayEntries} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
              {todayEntries.map(e => {
                const em = EMOTIONS.find(x => x.id === e.emotionId);
                if (!em) return null;
                return (
                  <span key={e.id} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: em.bg, borderRadius: r(20),
                    padding: '4px 10px', fontSize: 12, color: em.color, fontWeight: 600,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: em.color, display: 'inline-block' }}/>
                    {em.name}
                    <span style={{ fontSize: 10, color: em.color, opacity: 0.7 }}>
                      {e.ts.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>
                );
              })}
            </div>
          </Card>
        ) : (
          <div style={{ marginBottom: 16, padding: '20px 0' }}>
            <p style={{ margin: 0, fontSize: 16, color: C.text2, lineHeight: 1.7 }}>
              记录今天的第一个心情，<br/>开始了解自己。
            </p>
          </div>
        )}

        {/* Today wins overview — read-only, recording via ★ in FAB */}
        {todayWins.length > 0 ? (
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={C.primary}/>
                </svg>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>今日收获</span>
                <span style={{ fontSize: 11, background: C.primaryL, color: C.primary, borderRadius: 10, padding: '1px 7px', fontWeight: 600 }}>{todayWins.length}</span>
              </div>
              {onSeeAllWins && (
                <button onClick={onSeeAllWins} style={{ background: 'none', border: 'none', fontSize: 12, color: C.text3, cursor: 'pointer', fontFamily: 'inherit' }}>查看全部 →</button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {todayWins.slice(0, 3).map(win => (
                <div key={win.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.primary, marginTop: 7, flexShrink: 0 }}></div>
                  <p style={{ flex: 1, margin: 0, fontSize: 13, color: C.text2, lineHeight: 1.55 }}>{win.text}</p>
                  <span style={{ fontSize: 10, color: C.text3, flexShrink: 0, marginTop: 2 }}>
                    {win.ts.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <p style={{ margin: 0, fontSize: 13, color: C.text3, lineHeight: 1.7 }}>
            今天还没有收获记录 —— 点右下角 ★ 记一条小事。
          </p>
        )}


      </div>
    </Screen>
  );
}

// ── Today Wins Card ────────────────────────────────────────────
const WIN_PROMPTS = [
  '完成了一件小事…',
  '今天吃了好吃的…',
  '做了让自己开心的事…',
  '帮助了某个人…',
  '学到了新东西…',
  '给自己一点肯定…',
];

function TodayWins({ wins, onAdd, onDelete }) {
  const [input,    setInput]    = React.useState('');
  const [focused,  setFocused]  = React.useState(false);
  const [placeholder] = React.useState(() =>
    WIN_PROMPTS[Math.floor(Math.random() * WIN_PROMPTS.length)]
  );

  function submit() {
    const v = input.trim();
    if (!v) return;
    onAdd(v);
    setInput('');
  }

  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={C.primary} stroke={C.primary} strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>今日收获</span>
        {wins.length > 0 && (
          <span style={{
            fontSize: 11, background: C.primaryL, color: C.primary,
            borderRadius: 10, padding: '1px 7px', fontWeight: 600,
          }}>{wins.length}</span>
        )}
      </div>

      {/* Win list */}
      {wins.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {wins.map(win => (
            <WinItem key={win.id} win={win} onDelete={() => onDelete(win.id)} />
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'flex-end',
        background: C.surface,
        border: `1.5px solid ${focused ? C.primary : C.border}`,
        borderRadius: r(16),
        padding: '10px 12px',
        transition: 'border-color 0.15s',
        boxShadow: `0 1px 6px ${C.shadow}`,
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder={placeholder}
          rows={2}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            fontSize: 14, color: C.text, lineHeight: 1.55, resize: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button onClick={submit} disabled={!input.trim()} style={{
          width: 32, height: 32, borderRadius: r(10), border: 'none', flexShrink: 0,
          background: input.trim() ? C.primary : C.surface2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: input.trim() ? 'pointer' : 'default',
          transition: 'background 0.15s',
          alignSelf: 'flex-end',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M13 6L19 12L13 18" stroke={input.trim() ? '#fff' : C.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {wins.length === 0 && (
        <p style={{ margin: '10px 0 0', fontSize: 12, color: C.text3, lineHeight: 1.6 }}>
          记下今天做到的小事、值得开心的瞬间，或者对自己的一点肯定。
        </p>
      )}
    </div>
  );
}

// ── Win Item ──────────────────────────────────────────────────
function WinItem({ win, onDelete }) {
  const [pressing, setPressing] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setPressing(true)}
      onMouseLeave={() => setPressing(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        background: C.surface,
        borderRadius: r(14),
        padding: '11px 13px',
        boxShadow: `0 1px 4px ${C.shadow}`,
        transition: 'box-shadow 0.15s',
      }}
    >
      {/* Star dot */}
      <div style={{
        width: 22, height: 22, borderRadius: r(7), flexShrink: 0,
        background: C.primaryL,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 1,
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={C.primary} strokeWidth="0"/>
        </svg>
      </div>

      {/* Text */}
      <p style={{ flex: 1, margin: 0, fontSize: 14, color: C.text, lineHeight: 1.55, wordBreak: 'break-word' }}>
        {win.text}
      </p>

      {/* Time + delete */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: C.text3 }}>
          {win.ts.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </span>
        {pressing && (
          <button onClick={onDelete} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 2,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke={C.text3} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Today Mood Curve ──────────────────────────────────────────
function MoodCurve({ entries }) {
  if (!entries.length) return null;
  const W = 280, H = 80;
  const pad = { l: 8, r: 8, t: 10, b: 10 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const startOfDay = new Date(entries[0].ts); startOfDay.setHours(0,0,0,0);
  const endOfDay   = new Date(startOfDay);    endOfDay.setHours(23,59,59,999);
  const totalMs = endOfDay - startOfDay;
  const pts = entries.map(e => {
    const em = EMOTIONS.find(x => x.id === e.emotionId);
    const valence = em?.valence ?? 0;
    const x = pad.l + ((e.ts - startOfDay) / totalMs) * innerW;
    const y = pad.t + ((1 - (valence + 1) / 2)) * innerH;
    return { x, y, em };
  });
  function catmullRom(points) {
    if (points.length < 2) return `M ${points[0].x} ${points[0].y}`;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i-1)], p1 = points[i];
      const p2 = points[i+1], p3 = points[Math.min(points.length-1, i+2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6, cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6, cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }
  const linePath = catmullRom(pts);
  const areaPath = linePath + ` L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`;
  const zeroY = pad.t + innerH / 2;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C7C2BA" stopOpacity="0.20"/>
          <stop offset="100%" stopColor="#C7C2BA" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1={pad.l} y1={zeroY} x2={W-pad.r} y2={zeroY} stroke={C.border} strokeWidth="1" strokeDasharray="3,3"/>
      {pts.length > 1 && <path d={areaPath} fill="url(#curveGrad)"/>}
      {pts.length > 1 && <path d={linePath} fill="none" stroke="#C7C2BA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4.5" fill={p.em?.color ?? C.primary} stroke={C.bg} strokeWidth="2"/>
      ))}
    </svg>
  );
}

Object.assign(window, { HomeScreen });
