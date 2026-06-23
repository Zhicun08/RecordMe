// ── Mobile Single-Day Date Picker (bottom sheet) ─────────────
function MobileDatePicker({ initVal, onSelect, onClose }) {
  const todayStr = new Date().toISOString().slice(0,10);
  const [val, setVal] = React.useState(initVal || todayStr);
  const [cur, setCur] = React.useState(() => {
    const d = new Date((initVal || todayStr) + 'T00:00:00');
    return isNaN(d) ? new Date() : d;
  });
  const year = cur.getFullYear(), month = cur.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  function fmt(y,m,d) {
    return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.surface, borderRadius: `${r(24)}px ${r(24)}px 0 0`,
        padding: '0 0 32px', boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: '12px auto 0' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px 8px' }}>
          <span style={{ fontSize:16, fontWeight:700, color:C.text }}>选择日期</span>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke={C.text3} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', marginBottom:8 }}>
          <button onClick={() => { const d=new Date(cur); d.setMonth(d.getMonth()-1); setCur(d); }}
            style={{ background:'none', border:'none', cursor:'pointer', padding:8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke={C.text2} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>
            {cur.toLocaleDateString('zh-CN',{year:'numeric',month:'long'})}
          </span>
          <button onClick={() => { const d=new Date(cur); d.setMonth(d.getMonth()+1); setCur(d); }}
            style={{ background:'none', border:'none', cursor:'pointer', padding:8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke={C.text2} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div style={{ padding:'0 16px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:4 }}>
            {['日','一','二','三','四','五','六'].map(w => (
              <div key={w} style={{ textAlign:'center', fontSize:12, color:C.text3, fontWeight:600, padding:'4px 0' }}>{w}</div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
            {Array.from({length:firstDay}).map((_,i) => <div key={`e${i}`}/>)}
            {Array.from({length:daysInMonth},(_,i)=>i+1).map(day => {
              const dateStr = fmt(year, month, day);
              const isSel = val === dateStr;
              const isToday = dateStr === todayStr;
              const isFuture = dateStr > todayStr;
              return (
                <button key={day} onClick={() => !isFuture && setVal(dateStr)} style={{
                  aspectRatio:'1', borderRadius:r(10),
                  border: isToday && !isSel ? `2px solid ${C.primary}` : '2px solid transparent',
                  background: isSel ? C.primary : 'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor: isFuture ? 'not-allowed' : 'pointer',
                  opacity: isFuture ? 0.3 : 1, fontFamily:'inherit',
                }}>
                  <span style={{ fontSize:14, fontWeight:isToday?700:400, color:isSel?'#fff':isToday?C.primary:C.text }}>{day}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ padding:'16px 16px 0', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ flex:1, padding:'10px 14px', background:C.surface2, borderRadius:r(12) }}>
            <span style={{ fontSize:13, color:C.text3 }}>已选：</span>
            <span style={{ fontSize:14, fontWeight:700, color:C.primary }}>
              {new Date(val+'T00:00:00').toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'short'})}
            </span>
          </div>
          <button onClick={() => onSelect(val)} style={{
            padding:'12px 22px', background:C.primary, color:'#fff',
            border:'none', borderRadius:r(14), fontSize:15, fontWeight:700,
            cursor:'pointer', fontFamily:'inherit', flexShrink:0,
          }}>确定</button>
        </div>
      </div>
    </div>
  );
}

// ── Date Nav Bar (Apple Fitness style) ───────────────────────
function DateNavBar({ period, offset, setOffset }) {
  const today = new Date(); today.setHours(0,0,0,0);

  function getLabel() {
    if (period === 'today') {
      const d = new Date(today); d.setDate(d.getDate() + offset);
      const isToday = offset === 0;
      const isYesterday = offset === -1;
      if (isToday) return today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }) + ' · 今天';
      if (isYesterday) return d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }) + ' · 昨天';
      return d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });
    }
    if (period === 'week') {
      const end = new Date(today); end.setDate(end.getDate() + offset * 7);
      const start = new Date(end); start.setDate(start.getDate() - 6);
      const fmt = d => d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
      return `${fmt(start)} – ${fmt(end)}`;
    }
    if (period === 'month') {
      const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
      return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
    }
    return '';
  }

  const canGoForward = offset < 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '2px 0', marginBottom: 16,
    }}>
      <button onClick={() => setOffset(o => o - 1)} style={{
        width: 32, height: 32, borderRadius: r(10), border: 'none',
        background: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke={C.text3} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text2, textAlign: 'center', flex: 1 }}>
        {getLabel()}
      </span>
      <button onClick={() => setOffset(o => o + 1)} disabled={!canGoForward} style={{
        width: 32, height: 32, borderRadius: r(10), border: 'none',
        background: 'none', cursor: canGoForward ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: canGoForward ? 1 : 0.25,
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke={C.text3} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────
function SectionHeader({ children, right }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, margin:'0 0 14px' }}>
      <div style={{ width:3, height:15, borderRadius:2, background:C.primary }}/>
      <span style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:'0.01em' }}>{children}</span>
      {right && <div style={{ marginLeft:'auto' }}>{right}</div>}
    </div>
  );
}

// ── Review Empty State (no silent fallback to all-data) ───────
function ReviewEmpty({ onJump }) {
  return (
    <div style={{ textAlign:'center', padding:'52px 24px 40px' }}>
      <div style={{ width:58, height:58, borderRadius:'50%', background:C.surface2, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="17" rx="3" stroke={C.text3} strokeWidth="1.6"/>
          <path d="M3 9H21" stroke={C.text3} strokeWidth="1.4"/>
          <path d="M8 2V5M16 2V5" stroke={C.text3} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </div>
      <p style={{ margin:'0 0 18px', fontSize:14, color:C.text3, lineHeight:1.6 }}>这段时间还没有记录</p>
      <button onClick={onJump} style={{
        padding:'10px 22px', background:C.surface, border:`1.5px solid ${C.border}`,
        borderRadius:r(14), fontSize:13, fontWeight:600, color:C.primary,
        cursor:'pointer', fontFamily:'inherit',
      }}>回到本周</button>
    </div>
  );
}

// ── Review Screen — 总结（上）+ 时间线（下，心情+收获统一流）─
function ReviewScreen({ entries, wins, openEntry }) {
  const [period, setPeriod] = React.useState('week');
  const [offset, setOffset] = React.useState(0);
  const [filter, setFilter] = React.useState('all'); // all | mood | win

  function switchPeriod(p) { setPeriod(p); setOffset(0); }

  // Single time control → one explicit range
  let cutoff = new Date(), cutoffEnd = new Date();
  if (period === 'today') {
    cutoff = new Date(); cutoff.setHours(0,0,0,0); cutoff.setDate(cutoff.getDate() + offset);
    cutoffEnd = new Date(cutoff); cutoffEnd.setHours(23,59,59,999);
  } else if (period === 'week') {
    cutoffEnd = new Date(); cutoffEnd.setHours(23,59,59,999); cutoffEnd.setDate(cutoffEnd.getDate() + offset * 7);
    cutoff = new Date(cutoffEnd); cutoff.setDate(cutoff.getDate() - 6); cutoff.setHours(0,0,0,0);
  } else if (period === 'month') {
    const now = new Date();
    cutoff = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    cutoffEnd = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23, 59, 59, 999);
  }

  const rangeEntries = entries.filter(e => e.ts >= cutoff && e.ts <= cutoffEnd);
  const rangeWins    = wins.filter(w => w.ts >= cutoff && w.ts <= cutoffEnd);
  const hasData = rangeEntries.length > 0 || rangeWins.length > 0;

  return (
    <Screen>
      <div style={{ padding: '62px 20px calc(100px + env(safe-area-inset-bottom))' }}>
        {/* Header + single time control */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.text }}>回顾</h1>
          <div style={{ display: 'flex', background: C.surface2, borderRadius: r(12), padding: 3, gap: 2 }}>
            {[['today','日'],['week','周'],['month','月']].map(([id,lbl]) => (
              <button key={id} onClick={() => switchPeriod(id)} style={{
                padding: '5px 15px', borderRadius: r(9), fontSize: 13, fontWeight: 600,
                background: period===id ? C.surface : 'transparent',
                color: period===id ? C.primary : C.text3,
                border: 'none', cursor: 'pointer',
                boxShadow: period===id ? `0 1px 4px ${C.shadow}` : 'none',
              }}>{lbl}</button>
            ))}
          </div>
        </div>

        <DateNavBar period={period} offset={offset} setOffset={setOffset} />

        {!hasData ? (
          <ReviewEmpty onJump={() => { setPeriod('week'); setOffset(0); }} />
        ) : (
          <>
            {/* ── 总结（上）── */}
            {rangeEntries.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <ReviewSummary entries={rangeEntries} wins={rangeWins} period={period} cutoff={cutoff} cutoffEnd={cutoffEnd} />
                <InsightsView entries={rangeEntries} period={period} cutoff={cutoff} cutoffEnd={cutoffEnd} />
              </div>
            )}

            {/* ── 时间线（下，心情 + 收获统一流）── */}
            <SectionHeader>时间线</SectionHeader>
            <div style={{ display:'flex', gap:7, marginBottom:14 }}>
              {[['all','全部'],['mood','心情'],['win','★ 收获']].map(([id,lbl]) => (
                <button key={id} onClick={() => setFilter(id)} style={{
                  padding:'6px 14px', borderRadius:r(20), fontSize:12.5, fontWeight:600,
                  border:`1.5px solid ${filter===id ? C.primary : C.border}`,
                  background: filter===id ? C.primary : C.surface,
                  color: filter===id ? '#fff' : C.text2,
                  cursor:'pointer', fontFamily:'inherit',
                }}>{lbl}</button>
              ))}
            </div>
            <UnifiedTimeline entries={rangeEntries} wins={rangeWins} filter={filter} openEntry={openEntry} />

            {/* ── AI 洞察（页面最底部）── */}
            {rangeEntries.length > 0 && (
              <AIInsightCard entries={rangeEntries} period={period} />
            )}
          </>
        )}
      </div>
    </Screen>
  );
}

// ── Unified Timeline — 心情 + 收获 按时间混排 ─────────────────
function UnifiedTimeline({ entries, wins, filter, openEntry }) {
  let items = [];
  if (filter !== 'win')  items = items.concat(entries.map(e => ({ type:'mood', ts:e.ts, data:e })));
  if (filter !== 'mood') items = items.concat(wins.map(w => ({ type:'win', ts:w.ts, data:w })));
  items.sort((a,b) => b.ts - a.ts);

  function dayLabel(date) {
    const today = new Date().toDateString();
    const yest  = new Date(); yest.setDate(yest.getDate()-1);
    if (date.toDateString() === today) return '今天';
    if (date.toDateString() === yest.toDateString()) return '昨天';
    return date.toLocaleDateString('zh-CN', { month:'long', day:'numeric', weekday:'short' });
  }

  if (!items.length) {
    const msg = filter==='win' ? '这段时间还没有收获记录'
      : filter==='mood' ? '这段时间还没有心情记录' : '这段时间还没有记录';
    return <p style={{ textAlign:'center', color:C.text3, padding:'28px 0', fontSize:14 }}>{msg}</p>;
  }

  const groups = {};
  items.forEach(it => {
    const key = it.ts.toDateString();
    if (!groups[key]) groups[key] = { date: it.ts, items: [] };
    groups[key].items.push(it);
  });

  return (
    <div>
      {Object.values(groups).map(({ date, items }) => {
        const dayColors = items.filter(i=>i.type==='mood')
          .map(i=>EMOTIONS.find(x=>x.id===i.data.emotionId)?.color).filter(Boolean).map(emDark);
        return (
          <div key={date.toDateString()} style={{ marginBottom: 26 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.text3, letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{dayLabel(date)}</span>
              <div style={{ display:'flex', gap:3, flex:1 }}>
                {dayColors.slice(0,8).map((col,i) => (
                  <div key={i} style={{ height:4, flex:1, maxWidth:24, borderRadius:2, background:col }}/>
                ))}
              </div>
            </div>
            <div style={{ position:'relative', paddingLeft:18 }}>
              <div style={{ position:'absolute', left:5, top:8, bottom:8, width:2, background:C.border, borderRadius:1 }}/>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {items.map(it => {
                  if (it.type === 'mood') {
                    const em = EMOTIONS.find(e=>e.id===it.data.emotionId);
                    return (
                      <div key={'m'+it.data.id} style={{ position:'relative' }}>
                        <div style={{
                          position:'absolute', left:-15, top:16, width:10, height:10, borderRadius:'50%',
                          background: em?emDark(em.color):C.border, border:`2px solid ${C.bg}`, zIndex:1,
                        }}/>
                        <EntryCard entry={it.data} onClick={() => openEntry(it.data)} />
                      </div>
                    );
                  }
                  return (
                    <div key={'w'+it.data.id} style={{ position:'relative' }}>
                      <div style={{
                        position:'absolute', left:-15, top:16, width:10, height:10, borderRadius:'50%',
                        background:C.primary, border:`2px solid ${C.bg}`, zIndex:1,
                      }}/>
                      <TimelineWinCard win={it.data} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Win card inside the unified timeline ──────────────────────
function TimelineWinCard({ win }) {
  return (
    <div style={{
      display:'flex', alignItems:'flex-start', gap:10,
      background:C.surface, borderRadius:r(14),
      padding:'11px 13px', boxShadow:`0 1px 6px ${C.shadow}`,
    }}>
      <div style={{ width:22, height:22, borderRadius:r(7), background:C.primaryL, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={C.primary}/>
        </svg>
      </div>
      <p style={{ flex:1, margin:0, fontSize:14, color:C.text, lineHeight:1.55, wordBreak:'break-word' }}>{win.text}</p>
      <span style={{ fontSize:10, color:C.text3, flexShrink:0, marginTop:2 }}>
        {win.ts.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}
      </span>
    </div>
  );
}

// ── Review Summary — 弱化的内联总结 + 情绪色板（精修方案）────
function ReviewSummary({ entries, wins, period, cutoff, cutoffEnd }) {
  if (!entries.length) return null;
  const total = entries.length;
  const pos = entries.filter(e => (EMOTIONS.find(x => x.id === e.emotionId)?.valence ?? 0) > 0).length;
  const posPct = Math.round(pos / total * 100);
  const freq = {};
  entries.forEach(e => { freq[e.emotionId] = (freq[e.emotionId] || 0) + 1; });
  const topEm = EMOTIONS.find(e => e.id === Object.entries(freq).sort((a,b)=>b[1]-a[1])[0]?.[0]);

  const periodWord = period === 'today' ? '今天' : period === 'week' ? '这周' : '这个月';
  const mood = posPct >= 60 ? '过得挺积极的'
    : posPct >= 40 ? '情绪有起有落'
    : '有些不容易，也都走过来了';
  const fmt = d => d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
  const rangeStr = period === 'today'
    ? cutoff.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'short' })
    : `${fmt(cutoff)} – ${fmt(cutoffEnd)}`;

  // ── Emotion ribbon (情绪色板) ──
  let ribbon = [];
  if (period === 'today') {
    ribbon = [...entries].sort((a,b)=>a.ts-b.ts).map(e => ({
      color: EMOTIONS.find(x => x.id === e.emotionId)?.color || null,
      label: '',
    }));
  } else {
    const d = new Date(cutoff); d.setHours(0,0,0,0);
    const end = new Date(cutoffEnd);
    let guard = 0;
    while (d <= end && guard < 40) {
      const de = entries.filter(e => e.ts.toDateString() === d.toDateString());
      let color = null;
      if (de.length) {
        const f = {}; de.forEach(e => { f[e.emotionId] = (f[e.emotionId]||0)+1; });
        const top = Object.entries(f).sort((a,b)=>b[1]-a[1])[0][0];
        color = EMOTIONS.find(x => x.id === top)?.color || null;
      }
      ribbon.push({ color, label: String(d.getDate()) });
      d.setDate(d.getDate()+1); guard++;
    }
  }
  const dense = ribbon.length > 12;
  const showLabels = period !== 'today' && ribbon.length <= 10;

  const stats = [[String(total), '条记录'], [posPct + '%', '积极']];
  if (topEm) stats.push([topEm.name, '最多']);

  return (
    <div style={{ marginBottom: 22 }}>
      {/* Weakened inline headline + stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 13 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{periodWord}你{mood}</span>
        <span style={{ fontSize: 11.5, color: C.text3, flexShrink: 0, marginLeft: 10 }}>{rangeStr}</span>
      </div>
      <div style={{ display: 'flex', gap: 22, marginBottom: 18 }}>
        {stats.map(([n, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.text, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{n}</span>
            <span style={{ fontSize: 12, color: C.text3 }}>{l}</span>
          </div>
        ))}
      </div>

      {/* 情绪色板 — light Morandi blocks per day/entry */}
      <Card style={{ background: C.surface2, boxShadow: 'none', border: `1px solid ${C.border}`, padding: '15px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{period === 'today' ? '今日情绪色板' : '情绪色板'}</span>
          <span style={{ fontSize: 11, color: C.text3 }}>{rangeStr}</span>
        </div>
        <div style={{ display: 'flex', gap: dense ? 3 : 5, height: 30, marginBottom: showLabels ? 9 : 0 }}>
          {ribbon.map((b, i) => b.color ? (
            <div key={i} style={{ flex: 1, background: b.color, borderRadius: dense ? 3 : 6, minWidth: 0 }}/>
          ) : (
            <div key={i} style={{ flex: 1, borderRadius: dense ? 3 : 6, border: `1.5px dashed ${C.border}`, minWidth: 0 }}/>
          ))}
        </div>
        {showLabels && (
          <div style={{ display: 'flex', gap: 5 }}>
            {ribbon.map((b, i) => (
              <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: b.color ? C.text3 : C.border }}>{b.label}</span>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Mini Stats ────────────────────────────────────────────────
function MiniStats({ entries }) {
  if (!entries.length) return null;
  const total = entries.length;
  const pos = entries.filter(e => { const em = EMOTIONS.find(x => x.id===e.emotionId); return (em?.valence??0) > 0; }).length;
  const freq = {};
  entries.forEach(e => { freq[e.emotionId] = (freq[e.emotionId]||0)+1; });
  const topEm = EMOTIONS.find(e => e.id === Object.entries(freq).sort((a,b)=>b[1]-a[1])[0]?.[0]);

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
      <div style={{ flex: 1, background: C.surface, borderRadius: r(16), padding: '12px 14px', boxShadow: `0 1px 6px ${C.shadow}` }}>
        <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: C.text3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>记录</p>
        <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.primary }}>{total}</p>
        <p style={{ margin: 0, fontSize: 11, color: C.text3 }}>条</p>
      </div>
      <div style={{ flex: 1, background: C.surface, borderRadius: r(16), padding: '12px 14px', boxShadow: `0 1px 6px ${C.shadow}` }}>
        <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: C.text3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>积极</p>
        <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#A0BD9D' }}>{Math.round(pos/total*100)}%</p>
        <p style={{ margin: 0, fontSize: 11, color: C.text3 }}>情绪</p>
      </div>
      {topEm && (
        <div style={{ flex: 1.3, background: topEm.bg, borderRadius: r(16), padding: '12px 14px', border: `1.5px solid ${topEm.color}44` }}>
          <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: topEm.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>最多</p>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: topEm.color, lineHeight: 1.2 }}>{topEm.name}</p>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: topEm.color, marginTop: 4 }}/>
        </div>
      )}
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────
function TimelineView({ entries, openEntry }) {
  const groups = {};
  [...entries].sort((a,b) => b.ts-a.ts).forEach(e => {
    const key = e.ts.toDateString();
    if (!groups[key]) groups[key] = { date: e.ts, items: [] };
    groups[key].items.push(e);
  });
  const groupList = Object.values(groups);

  if (!groupList.length) {
    return <p style={{ textAlign:'center', color:C.text3, padding:'32px 0', fontSize:14 }}>这段时间还没有记录</p>;
  }

  function dayLabel(date) {
    const today = new Date().toDateString();
    const yest = new Date(); yest.setDate(yest.getDate()-1);
    if (date.toDateString() === today) return '今天';
    if (date.toDateString() === yest.toDateString()) return '昨天';
    return date.toLocaleDateString('zh-CN', { month:'long', day:'numeric', weekday:'short' });
  }

  return (
    <div>
      {groupList.map(({ date, items }) => {
        const dayColors = items.map(e => EMOTIONS.find(x=>x.id===e.emotionId)?.color).filter(Boolean);
        return (
          <div key={date.toDateString()} style={{ marginBottom: 28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.text3, letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{dayLabel(date)}</span>
              <div style={{ display:'flex', gap:3, flex:1 }}>
                {dayColors.slice(0,8).map((col,i) => (
                  <div key={i} style={{ height:4, flex:1, maxWidth:24, borderRadius:2, background:col }}/>
                ))}
              </div>
            </div>
            <div style={{ position:'relative', paddingLeft:18 }}>
              <div style={{ position:'absolute', left:5, top:8, bottom:8, width:2, background:C.border, borderRadius:1 }}/>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {items.sort((a,b)=>b.ts-a.ts).map(entry => {
                  const em = EMOTIONS.find(e=>e.id===entry.emotionId);
                  return (
                    <div key={entry.id} style={{ position:'relative' }}>
                      <div style={{
                        position:'absolute', left:-15, top:16,
                        width:10, height:10, borderRadius:'50%',
                        background: em?em.color:C.border, border:`2px solid ${C.bg}`, zIndex:1,
                      }}/>
                      <EntryCard entry={entry} onClick={() => openEntry(entry)} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Insights ──────────────────────────────────────────────────
function InsightsView({ entries, period, cutoff, cutoffEnd }) {
  const freq = {};
  entries.forEach(e => { freq[e.emotionId]=(freq[e.emotionId]||0)+1; });
  const freqSorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]);
  const maxFreq = freqSorted[0]?.[1]||1;

  // 并列检测：是否有情绪与第三名同样次数但未被列出
  const thirdCnt = freqSorted.length >= 3 ? freqSorted[2][1] : null;
  const tiedBeyond = thirdCnt != null ? freqSorted.slice(3).filter(([,c]) => c === thirdCnt).length : 0;
  const tieNote = tiedBeyond > 0 ? `另有 ${tiedBeyond} 种情绪也出现了 ${thirdCnt} 次，并列未列出。` : '';

  // Build per-day valence across the SELECTED range (no mismatch with the picker)
  const dayList = [];
  {
    const d = new Date(cutoff); d.setHours(0,0,0,0);
    const end = new Date(cutoffEnd);
    let guard = 0;
    while (d <= end && guard < 40) {
      const de = entries.filter(e => e.ts.toDateString() === d.toDateString());
      const avg = de.length ? de.reduce((s,e)=>{const em=EMOTIONS.find(x=>x.id===e.emotionId);return s+(em?.valence||0);},0)/de.length : null;
      dayList.push({ label: d.toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'}), avg, count: de.length });
      d.setDate(d.getDate()+1); guard++;
    }
  }
  const showTrend = dayList.length >= 2;

  const catCount={q1:0,q2:0,q3:0,q4:0};
  entries.forEach(e=>{const em=EMOTIONS.find(x=>x.id===e.emotionId);if(em&&em.quadrant)catCount[em.quadrant]++;});
  const total=entries.length||1;
  const posCount=catCount.q1+catCount.q2;
  const negCount=catCount.q3+catCount.q4;

  if (!entries.length) return <p style={{textAlign:'center',color:C.text3,padding:'32px 0',fontSize:14}}>还没有足够的记录</p>;

  return (
    <div>
      {/* Valence trend — only when the range spans 2+ days */}
      {showTrend && (
        <Card style={{ marginBottom:16 }}>
          <p style={{ margin:'0 0 3px', fontSize:13, fontWeight:700, color:C.text }}>情绪能量走势</p>
          <p style={{ margin:'0 0 14px', fontSize:11, color:C.text3 }}>每天平均情绪正负值（正 = 积极，负 = 消极）</p>
          <ValenceTrendChart data={dayList} />
        </Card>
      )}

      {/* Quadrant breakdown */}
      <Card style={{ marginBottom:16 }}>
        <p style={{ margin:'0 0 10px', fontSize:13, fontWeight:700, color:C.text }}>情绪分布</p>
        <div style={{ display:'flex', borderRadius:6, height:12, marginBottom:12, gap:3 }}>
          {Object.entries(QUADRANTS).map(([qid,q])=>{
            const pct=catCount[qid]/total*100;
            return pct>0?<div key={qid} style={{width:`${pct}%`,background:q.color,borderRadius:4,transition:'width 0.4s'}}/>:null;
          })}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 16px' }}>
          {Object.entries(QUADRANTS).map(([qid,q])=>(
            <div key={qid} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:q.color }}/>
              <span style={{ fontSize:11, color:C.text2 }}>{q.label} {Math.round(catCount[qid]/total*100)}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top emotions — 仅展示前三名 */}
      <Card style={{ marginBottom:20 }}>
        <p style={{ margin:'0 0 14px', fontSize:13, fontWeight:700, color:C.text }}>出现最多的情绪</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {freqSorted.slice(0,3).map(([id,cnt])=>{
            const em=EMOTIONS.find(e=>e.id===id); if(!em) return null;
            return (
              <div key={id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:emDark(em.color), flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <span style={{ fontSize:14, fontWeight:400, color:C.text }}>{em.name}</span>
                    <span style={{ fontSize:12, color:C.text3 }}>{cnt}次</span>
                  </div>
                  <div style={{ height:5, background:C.surface2, borderRadius:3 }}>
                    <div style={{ height:'100%', borderRadius:3, background:em.color, width:`${cnt/maxFreq*100}%`, transition:'width 0.5s' }}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {tieNote && (
          <p style={{ margin:'12px 0 0', fontSize:12, color:C.text3, lineHeight:1.6 }}>{tieNote}</p>
        )}
      </Card>
    </div>
  );
}

// ── AI Insight Card — lives at the very bottom of 回顾 ─────────
function AIInsightCard({ entries, period }) {
  const [aiLoading, setLoading] = React.useState(false);
  const [aiText,    setAiText]  = React.useState('');
  const [aiDone,    setAiDone]  = React.useState(false);

  const freq = {};
  entries.forEach(e => { freq[e.emotionId]=(freq[e.emotionId]||0)+1; });
  const freqSorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]);
  const catCount={q1:0,q2:0,q3:0,q4:0};
  entries.forEach(e=>{const em=EMOTIONS.find(x=>x.id===e.emotionId);if(em&&em.quadrant)catCount[em.quadrant]++;});
  const total=entries.length||1;
  const posCount=catCount.q1+catCount.q2;

  async function runAI() {
    setLoading(true); setAiText(''); setAiDone(false);
    const summary=freqSorted.slice(0,5).map(([id,cnt])=>{const em=EMOTIONS.find(e=>e.id===id);return `${em?.name||id}(${cnt}次)`;}).join('、');
    const posR=Math.round(posCount/total*100);
    const periodWord = period==='week'?'一周':period==='month'?'一个月':'这一天';
    const prompt=`我${periodWord}的情绪记录：主要情绪有${summary}，积极情绪占约${posR}%，共${entries.length}条记录。请用温和、专业的心理学视角给出简短洞察（3-4句话）和一个具体建议。用中文，语气温暖，不要说教。`;
    try { setAiText(await window.claude.complete(prompt)); }
    catch(e) { setAiText('暂时无法获取洞察，请稍后再试。'); }
    setLoading(false); setAiDone(true);
  }

  if (!entries.length) return null;

  return (
    <div style={{ marginTop:28 }}>
      <div style={{ background:'linear-gradient(135deg,#F1F2FB 0%,#F5F1FB 100%)', borderRadius:r(20), padding:'18px', border:`1px solid #E7E5F0` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{ width:34, height:34, borderRadius:r(11), background:'linear-gradient(135deg,#94A6E2 0%,#BB9FD9 100%)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px -4px rgba(148,166,226,0.55)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="1.5"/>
              <path d="M8 12h.01M12 12h.01M16 12h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p style={{ margin:0, fontSize:14, fontWeight:700, color:C.text }}>AI 情绪洞察</p>
            <p style={{ margin:0, fontSize:11, color:C.text3 }}>基于你的记录生成</p>
          </div>
        </div>
        {!aiText&&!aiLoading&&(
          <>
            <p style={{ margin:'0 0 14px', fontSize:13, color:C.text2, lineHeight:1.6 }}>让 AI 分析你{period==='week'?'这周':period==='month'?'这个月':'这一天'}的情绪模式，给出个性化洞察与建议。</p>
            <button onClick={runAI} style={{ width:'100%', padding:'13px', background:'linear-gradient(125deg,#7B8FD6 0%,#A07FC8 100%)', color:'#fff', border:'none', borderRadius:r(14), fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 6px 18px -6px rgba(123,143,214,0.55)' }}>生成情绪洞察</button>
          </>
        )}
        {aiLoading&&(
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0' }}>
            <div style={{ display:'flex', gap:4 }}>
              {[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:'50%', background:['#94A6E2','#A992D6','#BB9FD9'][i], animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }}/>)}
            </div>
            <span style={{ fontSize:13, color:C.text2 }}>正在分析你的情绪记录…</span>
          </div>
        )}
        {aiDone&&aiText&&(
          <>
            <p style={{ margin:'0 0 14px', fontSize:14, color:C.text, lineHeight:1.75 }}>{aiText}</p>
            <button onClick={runAI} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:r(10), padding:'8px 14px', fontSize:12, color:C.text3, cursor:'pointer', fontFamily:'inherit' }}>重新生成</button>
          </>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

// ── Valence Trend Chart — gray line, Morandi dots, breaks on empty days ──
function ValenceTrendChart({ data }) {
  if (!data||!data.length) return null;
  const W=280,H=80,pad=14;
  const LINE='#C7C2BA', POS='#B2CCAF', NEG='#9FB3CD';
  const xs=data.map((_,i)=>pad+i*(W-pad*2)/Math.max(data.length-1,1));
  const toY=v=>H/2-(v*(H/2-8));
  // group consecutive recorded days into segments (empty days break the line)
  const segs=[]; let cur=[];
  data.forEach((d,i)=>{ if(d.avg!==null){ cur.push({x:xs[i],y:toY(d.avg)}); } else { if(cur.length){segs.push(cur);} cur=[]; } });
  if(cur.length){segs.push(cur);}
  const smooth=p=>{ if(p.length<2) return ''; let s=`M ${p[0].x} ${p[0].y}`; for(let i=0;i<p.length-1;i++){ const c=p[i],n=p[i+1],mx=(c.x+n.x)/2; s+=` C ${mx} ${c.y}, ${mx} ${n.y}, ${n.x} ${n.y}`; } return s; };
  const labelEvery=Math.ceil(data.length/5);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H+14}`} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id="vArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={LINE} stopOpacity="0.20"/>
          <stop offset="100%" stopColor={LINE} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1={pad} y1={H/2} x2={W-pad} y2={H/2} stroke={C.border} strokeWidth="1" strokeDasharray="2,5"/>
      <text x={W-pad} y={H/2-4} textAnchor="end" fontSize="8" fill={C.text3}>积极</text>
      <text x={W-pad} y={H/2+10} textAnchor="end" fontSize="8" fill={C.text3}>消极</text>
      {segs.map((seg,si)=> seg.length>1 ? (
        <g key={si}>
          <path d={`${smooth(seg)} L ${seg[seg.length-1].x} ${H/2} L ${seg[0].x} ${H/2} Z`} fill="url(#vArea)"/>
          <path d={smooth(seg)} fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      ) : null)}
      {data.map((d,i)=>d.avg!==null&&(
        <circle key={'c'+i} cx={xs[i]} cy={toY(d.avg)} r="4" fill={d.avg>=0?POS:NEG} stroke={C.surface} strokeWidth="2"/>
      ))}
      {data.map((d,i)=>i%labelEvery===0&&(
        <text key={'t'+i} x={xs[i]} y={H+14} textAnchor="middle" fontSize="8" fill={C.text3}>{d.label}</text>
      ))}
    </svg>
  );
}

Object.assign(window, { ReviewScreen });
