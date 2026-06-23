// ── Record Flow ────────────────────────────────────────────
// Step 1: Quadrant overview → zoom into one quadrant
// Step 2: Tags + optional event
// Step 3: Feeling + Cognition

function RecordScreen({ onSave, onClose }) {
  const [step, setStep]          = React.useState(1);
  const [data, setData]          = React.useState({
    ts: new Date(), tsPeriod: '刚刚',
    emotionId: null, tags: [], customTags: [],
    event: '', feeling: '', cognition: '',
  });
  const [sheetEmotion, setSheet] = React.useState(null);
  const [done, setDone]          = React.useState(false);

  function handleSave() { onSave({ ...data, id: Date.now() }); setDone(true); }
  function reset() {
    setStep(1); setSheet(null); setDone(false);
    setData({ ts: new Date(), tsPeriod: '刚刚', emotionId: null, tags: [], customTags: [], event: '', feeling: '', cognition: '' });
  }

  if (done) return <RecordDone onNew={reset} onClose={onClose} />;

  return (
    <Screen>
      <button onClick={onClose} style={{
        position: 'absolute', top: 18, right: 18, zIndex: 50,
        background: C.surface2, border: 'none', borderRadius: '50%',
        width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke={C.text3} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <div style={{ padding: '62px 20px 100px', minHeight: '100%' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 22, marginRight: 44 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: s <= step ? C.primary : C.border, transition: 'background 0.3s',
            }}/>
          ))}
        </div>

        {step === 1 && <StepEmotion data={data} setData={setData} onNext={() => setStep(2)} onInfo={em => setSheet(em)} />}
        {step === 2 && <StepEvent   data={data} setData={setData} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
        {step === 3 && <StepFeeling data={data} setData={setData} onBack={() => setStep(2)} onSave={handleSave} />}
      </div>

      {sheetEmotion && <EmotionInfoSheet emotion={sheetEmotion} onClose={() => setSheet(null)} />}
    </Screen>
  );
}

// ── Time periods ─────────────────────────────────────────────
function getAllTimePeriods() {
  // Always return all periods; each has an `available` flag based on current hour
  const h = new Date().getHours();
  return [
    { label: '刚刚', ts: () => new Date(),                                                       available: true },
    { label: '上午', ts: () => { const d=new Date(); d.setHours(9,0,0,0);  return d; },          available: h >= 6  },
    { label: '中午', ts: () => { const d=new Date(); d.setHours(12,0,0,0); return d; },          available: h >= 11 },
    { label: '下午', ts: () => { const d=new Date(); d.setHours(15,0,0,0); return d; },          available: h >= 13 },
    { label: '晚上', ts: () => { const d=new Date(); d.setHours(20,0,0,0); return d; },          available: h >= 18 },
  ];
}

// ── Step 1: Quadrant overview → zoom ─────────────────────────
function StepEmotion({ data, setData, onNext, onInfo }) {
  const [showTP,  setShowTP]  = React.useState(false);
  const [zoomedQ, setZoomedQ] = React.useState(null);
  const periods  = React.useMemo(getAllTimePeriods, []);
  const selected = EMOTIONS.find(e => e.id === data.emotionId);

  function selectPeriod(p) {
    if (!p.available) return;
    setData(d => ({ ...d, ts: p.ts(), tsPeriod: p.label }));
    setShowTP(false);
  }

  return (
    <div>
      <RecordHeader step={1} total={3} title="现在是什么情绪？" />

      {/* Time bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 13px', background: C.surface2, borderRadius: r(12), marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={C.text3} strokeWidth="1.8"/>
            <path d="M12 7V12L15 14" stroke={C.text3} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 13, color: C.text2 }}>记录时间：<strong style={{ color: C.text }}>{data.tsPeriod}</strong></span>
        </div>
        <button onClick={() => setShowTP(v => !v)} style={{
          background: 'none', border: 'none', fontSize: 12,
          color: C.primary, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>修改</button>
      </div>

      {showTP && (
        <div style={{
          background: C.surface, borderRadius: r(14), border: `1px solid ${C.border}`,
          marginBottom: 14, display: 'flex', overflow: 'hidden',
        }}>
          {periods.map((p, i) => {
            const active = data.tsPeriod === p.label;
            const disabled = !p.available;
            return (
              <button key={p.label} onClick={() => selectPeriod(p)} disabled={disabled} style={{
                flex: 1, padding: '12px 4px',
                background: active ? C.primary : 'none',
                border: 'none', borderRight: i < periods.length-1 ? `1px solid ${C.border}` : 'none',
                textAlign: 'center', fontSize: 13,
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                color: disabled ? C.text3 : active ? '#fff' : C.text,
                fontWeight: active ? 700 : 400,
                opacity: disabled ? 0.45 : 1,
              }}>{p.label}</button>
            );
          })}
        </div>
      )}

      {/* Quadrant map */}
      {zoomedQ === null
        ? <QuadrantOverview
            selectedId={data.emotionId}
            onZoom={qid => setZoomedQ(qid)}
          />
        : <QuadrantZoomed
            qid={zoomedQ}
            selectedId={data.emotionId}
            onSelect={id => setData(d => ({ ...d, emotionId: id }))}
            onInfo={onInfo}
            onBack={() => setZoomedQ(null)}
          />
      }

      {/* Selected emotion strip + continue */}
      {selected ? (
        <div style={{ marginTop: 14 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 14px', background: selected.bg,
            borderRadius: r(14), border: `1.5px solid ${selected.color}33`,
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: selected.color }}/>
              <span style={{ fontSize: 15, fontWeight: 700, color: selected.color }}>{selected.name}</span>
              <span style={{ fontSize: 11, color: C.text3 }}>{QUADRANTS[selected.quadrant]?.label}</span>
            </div>
            <button onClick={() => onInfo(selected)} style={{
              background: 'rgba(255,255,255,0.8)', border: `1px solid ${selected.color}44`,
              borderRadius: r(8), padding: '6px 12px',
              fontSize: 12, color: selected.color, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>解释 i</button>
          </div>
          <PrimaryBtn onClick={onNext}>选择「{selected.name}」，继续 →</PrimaryBtn>
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontSize: 12, color: C.text3, marginTop: 10 }}>
          {zoomedQ ? '点击情绪选择，点 i 查看解释' : '点击任意象限进入'}
        </p>
      )}
    </div>
  );
}

// ── Quadrant Overview (2×2) ───────────────────────────────────
function QuadrantOverview({ selectedId, onZoom }) {
  // Layout: top row = high energy, bot row = low energy
  //         left col = negative, right col = positive
  const grid = [['q4','q1'],['q3','q2']];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
        <span style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: '0.04em' }}>高能量</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: '0.04em',
          writingMode: 'vertical-rl', transform: 'rotate(180deg)', padding: '0 2px' }}>消极</span>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {grid.flat().map(qid => {
            const q        = QUADRANTS[qid];
            const emotions = EMOTIONS.filter(e => e.quadrant === qid);
            const selEm    = emotions.find(e => e.id === selectedId);
            return (
              <button key={qid} onClick={() => onZoom(qid)} style={{
                background: selEm ? selEm.bg : C.surface,
                border: `2px solid ${selEm ? selEm.color : q.color + '55'}`,
                borderRadius: r(16), padding: '14px 12px 12px',
                cursor: 'pointer', textAlign: 'left',
                boxShadow: `0 2px 8px ${C.shadow}`,
                transition: 'all 0.15s',
              }}>
                {/* Quadrant label */}
                <div style={{ fontSize: 11, fontWeight: 700, color: q.color, marginBottom: 10, lineHeight: 1.35, whiteSpace: 'pre-line' }}>
                  {q.label.replace('·', '\n')}
                </div>
                {/* Emotion color dots */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                  {emotions.map(em => (
                    <div key={em.id} style={{
                      width:  em.id === selectedId ? 10 : 7,
                      height: em.id === selectedId ? 10 : 7,
                      borderRadius: '50%', background: em.color,
                      border: em.id === selectedId ? `2px solid #fff` : 'none',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}/>
                  ))}
                </div>
                {/* Count + arrow */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: C.text3 }}>{emotions.length} 种情绪</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke={q.color} strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        <span style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: '0.04em',
          writingMode: 'vertical-rl', padding: '0 2px' }}>积极</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <span style={{ fontSize: 10, color: C.text3, fontWeight: 600, letterSpacing: '0.04em' }}>低能量</span>
      </div>
    </div>
  );
}

// ── Quadrant Zoomed (spatial scatter, repulsion) ─────────────
function QuadrantZoomed({ qid, selectedId, onSelect, onInfo, onBack }) {
  const q        = QUADRANTS[qid];
  const emotions = EMOTIONS.filter(e => e.quadrant === qid);
  const ref      = React.useRef(null);
  const [w, setW] = React.useState(300);

  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver(([e]) => setW(e.contentRect.width));
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const h   = Math.round(w * 0.8);
  const pad = 24;

  // Valence/arousal ranges for each quadrant
  const ranges = {
    q1: { vMin: -0.1, vMax: 1,  aMin: 0.4, aMax: 1   },
    q2: { vMin:  0.4, vMax: 1,  aMin: 0,   aMax: 0.55 },
    q3: { vMin: -1,   vMax: 0.1,aMin: 0,   aMax: 0.55 },
    q4: { vMin: -1,   vMax: 0.1,aMin: 0.4, aMax: 1   },
  };
  const rng = ranges[qid];

  // axisLabel area sizes
  const axisLabelW = 22; // left axis label width
  const axisLabelH = 18; // bottom axis label height
  const plotX = axisLabelW; // plot area starts here
  const plotY = 0;
  const plotW = w - axisLabelW;
  const plotH = h - axisLabelH;

  function toXY(em) {
    const v = Math.max(rng.vMin, Math.min(rng.vMax, em.valence));
    const a = Math.max(rng.aMin, Math.min(rng.aMax, em.arousal));
    return {
      // origin = bottom-left of plot area
      x: plotX + pad + ((v - rng.vMin) / (rng.vMax - rng.vMin)) * (plotW - pad*2),
      y: plotY + (plotH - pad) - ((a - rng.aMin) / (rng.aMax - rng.aMin)) * (plotH - pad*2),
    };
  }

  // Apply repulsion to spread nodes
  const nodes = emotions.map(em => ({ em, ...toXY(em) }));
  for (let iter = 0; iter < 40; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 0.1;
        const minD = 42;
        if (dist < minD) {
          const push = (minD - dist) / 2 * 0.5;
          nodes[i].x -= (dx/dist)*push; nodes[i].y -= (dy/dist)*push;
          nodes[j].x += (dx/dist)*push; nodes[j].y += (dy/dist)*push;
        }
      }
    }
    nodes.forEach(n => {
      n.x = Math.max(plotX + pad + 6, Math.min(plotX + plotW - pad - 6, n.x));
      n.y = Math.max(plotY + pad + 6, Math.min(plotY + plotH - pad - 6, n.y));
    });
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <button onClick={onBack} style={{
          background: C.surface2, border: 'none', borderRadius: r(10),
          width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke={C.text2} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: q.color }}>{q.label}</span>
          <span style={{ fontSize: 11, color: C.text3, marginLeft: 6 }}>{q.axis}</span>
        </div>
      </div>

      {/* Scatter map */}
      <div ref={ref} style={{
        width: '100%', borderRadius: r(18),
        background: q.bg || C.surface2,
        overflow: 'hidden',
      }}>
        <svg width={w} height={h} style={{ display: 'block' }}>
          {/* Axes: origin at bottom-left of plot area */}
          {/* Y axis */}
          <line
            x1={plotX} y1={plotY + pad/2}
            x2={plotX} y2={plotY + plotH - pad/2}
            stroke={q.color} strokeWidth="1" strokeOpacity="0.3"/>
          {/* X axis */}
          <line
            x1={plotX + pad/2} y1={plotY + plotH - pad/2}
            x2={plotX + plotW - pad/2} y2={plotY + plotH - pad/2}
            stroke={q.color} strokeWidth="1" strokeOpacity="0.3"/>

          {/* Y axis arrow */}
          <polyline
            points={`${plotX-4},${plotY+pad/2+6} ${plotX},${plotY+pad/2} ${plotX+4},${plotY+pad/2+6}`}
            fill="none" stroke={q.color} strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round"/>
          {/* X axis arrow */}
          <polyline
            points={`${plotX+plotW-pad/2-6},${plotY+plotH-pad/2-4} ${plotX+plotW-pad/2},${plotY+plotH-pad/2} ${plotX+plotW-pad/2-6},${plotY+plotH-pad/2+4}`}
            fill="none" stroke={q.color} strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round"/>

          {/* Y-axis label: 高能量 (top) */}
          <text
            x={plotX - 4} y={plotY + pad/2 + 2}
            textAnchor="end" fontSize="8" fontWeight="600"
            fill={q.color} opacity="0.7"
            writingMode="vertical-rl"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >高能量</text>
          {/* Left axis bottom label: 低能量 */}
          <text
            x={plotX - 4} y={plotY + plotH - pad/2}
            textAnchor="start" fontSize="8" fontWeight="600"
            fill={q.color} opacity="0.5"
            writingMode="vertical-rl"
          >低能量</text>

          {/* X-axis right label: 积极 */}
          <text
            x={plotX + plotW - pad/2 + 2} y={plotY + plotH - pad/2 + 1}
            textAnchor="start" fontSize="8" fontWeight="600"
            fill={q.color} opacity="0.7"
          >积极</text>
          {/* X-axis left label: 消极 */}
          <text
            x={plotX + pad/2} y={plotY + plotH - pad/2 + 1}
            textAnchor="end" fontSize="8" fontWeight="600"
            fill={q.color} opacity="0.5"
          >消极</text>

          {nodes.map(({ em, x, y }) => {
            const isSel = selectedId === em.id;
            return (
              <g key={em.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(em.id)}>
                {/* Large invisible hit area */}
                <circle cx={x} cy={y} r={24} fill="transparent"/>
                {/* Halo on selected */}
                {isSel && <circle cx={x} cy={y} r={20} fill={em.color} opacity={0.18}/>}
                {/* Main dot */}
                <circle cx={x} cy={y} r={isSel ? 10 : 7}
                  fill={em.color} stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
                {/* Name label */}
                <text
                  x={x} y={y - (isSel ? 17 : 13)}
                  textAnchor="middle"
                  fontSize={isSel ? 12 : 10}
                  fontWeight={isSel ? '800' : '600'}
                  fill={em.color}
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(255,255,255,0.95))' }}
                >{em.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ── Emotion Info Sheet ────────────────────────────────────────
function EmotionInfoSheet({ emotion: em, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(45,43,40,0.35)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.surface, borderRadius: `${r(28)}px ${r(28)}px 0 0`,
        padding: '12px 22px 44px', boxShadow: '0 -8px 40px rgba(45,43,40,0.15)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: '0 auto 20px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: r(17), background: em.color, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }}/>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>{em.name}</h2>
            <p style={{ margin: 0, fontSize: 13, color: C.text3 }}>{em.en} · {QUADRANTS[em.quadrant]?.label}</p>
          </div>
        </div>
        <p style={{ margin: '0 0 14px', fontSize: 15, color: C.text, lineHeight: 1.65 }}>{em.desc}</p>
        <div style={{ background: em.bg, borderRadius: r(14), padding: '13px 15px', borderLeft: `3px solid ${em.color}` }}>
          <p style={{ margin: '0 0 5px', fontSize: 10, fontWeight: 700, color: em.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>它想告诉你</p>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{em.func}</p>
        </div>
        <button onClick={onClose} style={{
          marginTop: 18, width: '100%', padding: '13px',
          background: C.surface2, border: 'none', borderRadius: r(14),
          fontSize: 15, color: C.text2, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
        }}>关闭</button>
      </div>
    </div>
  );
}

// ── Step 2: Tags + optional event ────────────────────────────
function StepEvent({ data, setData, onBack, onNext }) {
  const [newTag, setNewTag] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  // customTags: list of { name, selected }
  const em = EMOTIONS.find(e => e.id === data.emotionId);

  function toggleTag(id) {
    setData(d => ({ ...d, tags: d.tags.includes(id) ? d.tags.filter(t=>t!==id) : [...d.tags, id] }));
  }
  // customTags stored as array of strings; selectedCustomTags tracks which are toggled
  const [selectedCustom, setSelectedCustom] = React.useState([]);

  function toggleCustom(name) {
    setSelectedCustom(s => s.includes(name) ? s.filter(t=>t!==name) : [...s, name]);
  }
  function deleteCustom(name) {
    setData(d => ({ ...d, customTags: d.customTags.filter(t => t !== name) }));
    setSelectedCustom(s => s.filter(t => t !== name));
  }
  function addCustom() {
    const v = newTag.trim(); if (!v) return;
    if (!data.customTags.includes(v)) {
      setData(d => ({ ...d, customTags: [...d.customTags, v] }));
      setSelectedCustom(s => [...s, v]);
    }
    setNewTag(''); setAdding(false);
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
        <BackBtn onClick={onBack} />
        <RecordHeader step={2} total={3} title="是什么引发了这个情绪？" noMargin />
      </div>
      {em && <div style={{ marginBottom:14 }}><EmotionBadge emotionId={em.id} /></div>}

      <p style={{ margin:'0 0 9px', fontSize:11, fontWeight:700, color:C.text3, letterSpacing:'0.06em', textTransform:'uppercase' }}>相关情境</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:18 }}>
        {TAGS.map(tag => {
          const active = data.tags.includes(tag.id);
          return (
            <button key={tag.id} onClick={() => toggleTag(tag.id)} style={{
              display:'flex', alignItems:'center', gap:6, padding:'7px 12px',
              background: active ? C.primary : C.surface,
              border: `1.5px solid ${active ? C.primary : C.border}`,
              borderRadius: r(20), cursor:'pointer', transition:'all 0.15s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24"
                style={{ color: active ? '#fff' : C.text2, flexShrink:0 }}
                dangerouslySetInnerHTML={{ __html: tag.icon }}
              />
              <span style={{ fontSize:12, fontWeight:500, color: active?'#fff':C.text2 }}>{tag.name}</span>
            </button>
          );
        })}
        {data.customTags.map(name => {
          const active = selectedCustom.includes(name);
          return (
            <div key={name} style={{
              display:'flex', alignItems:'center',
              background: active ? C.primary : C.surface,
              border: `1.5px solid ${active ? C.primary : C.border}`,
              borderRadius: r(20), overflow: 'hidden',
            }}>
              <button onClick={() => toggleCustom(name)} style={{
                padding:'7px 10px 7px 12px', background:'transparent', border:'none',
                cursor:'pointer', fontFamily:'inherit',
              }}>
                <span style={{ fontSize:12, fontWeight:500, color:active?'#fff':C.text2 }}>{name}</span>
              </button>
              <button onClick={() => deleteCustom(name)} style={{
                padding:'7px 10px 7px 4px', background:'transparent', border:'none',
                cursor:'pointer', display:'flex', alignItems:'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke={active?'rgba(255,255,255,0.7)':C.text3} strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          );
        })}
        {adding ? (
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <input autoFocus value={newTag} onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter') addCustom(); if(e.key==='Escape') setAdding(false); }}
              placeholder="自定义标签…"
              style={{ padding:'7px 12px', fontSize:12, border:`1.5px solid ${C.primary}`,
                borderRadius:r(20), background:C.surface, color:C.text,
                outline:'none', width:110, fontFamily:'inherit' }}
            />
            <button onClick={addCustom} style={{
              padding:'7px 12px', background:C.primary, border:'none',
              borderRadius:r(20), fontSize:12, color:'#fff', cursor:'pointer', fontFamily:'inherit',
            }}>添加</button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{
            display:'flex', alignItems:'center', gap:5, padding:'7px 12px',
            background:'none', border:`1.5px dashed ${C.border}`, borderRadius:r(20), cursor:'pointer',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke={C.text3} strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize:12, color:C.text3 }}>自定义</span>
          </button>
        )}
      </div>

      <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:700, color:C.text3, letterSpacing:'0.06em', textTransform:'uppercase' }}>
        描述事件 <span style={{ color:C.primary, fontWeight:500, fontSize:11 }}>(可选)</span>
      </p>
      <textarea value={data.event} onChange={e => setData(d => ({ ...d, event:e.target.value }))}
        placeholder="简单描述发生了什么，或者当时的情境…" rows={4}
        style={{ width:'100%', boxSizing:'border-box', padding:'13px 15px',
          fontSize:15, lineHeight:1.65, border:`1.5px solid ${C.border}`,
          borderRadius:r(16), background:C.surface, color:C.text,
          resize:'none', outline:'none', fontFamily:'inherit' }}
        onFocus={e => e.target.style.borderColor=C.primary}
        onBlur={e => e.target.style.borderColor=C.border}
      />
      <div style={{ height:20 }}/>
      <PrimaryBtn onClick={onNext}>继续</PrimaryBtn>
    </div>
  );
}

// ── Step 3: Feeling + Cognition ──────────────────────────────
function StepFeeling({ data, setData, onBack, onSave }) {
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
        <BackBtn onClick={onBack} />
        <RecordHeader step={3} total={3} title="感受与认知" noMargin />
      </div>

      <p style={{ margin:'10px 0 8px', fontSize:11, fontWeight:700, color:C.text3, letterSpacing:'0.06em', textTransform:'uppercase' }}>
        情绪带来的感受 <span style={{ color:C.primary, fontWeight:500, fontSize:11 }}>(可选)</span>
      </p>
      <textarea value={data.feeling} onChange={e => setData(d => ({ ...d, feeling:e.target.value }))}
        placeholder="身体感觉、内心想法，或者它让你想做什么…" rows={3}
        style={{ width:'100%', boxSizing:'border-box', padding:'13px 15px',
          fontSize:15, lineHeight:1.65, border:`1.5px solid ${C.border}`,
          borderRadius:r(16), background:C.surface, color:C.text,
          resize:'none', outline:'none', fontFamily:'inherit', marginBottom:16 }}
        onFocus={e => e.target.style.borderColor=C.primary}
        onBlur={e => e.target.style.borderColor=C.border}
      />

      <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:C.text3, letterSpacing:'0.06em', textTransform:'uppercase' }}>
        你对这件事的认知是什么？ <span style={{ color:C.primary, fontWeight:500, fontSize:11 }}>(可选)</span>
      </p>
      <p style={{ margin:'0 0 10px', fontSize:12, color:C.text3, lineHeight:1.6 }}>
        我如何解读这件事？是否存在其他视角？
      </p>
      <textarea value={data.cognition} onChange={e => setData(d => ({ ...d, cognition:e.target.value }))}
        placeholder="例如：我觉得同事这样做是因为他压力很大，不是针对我个人…" rows={4}
        style={{ width:'100%', boxSizing:'border-box', padding:'13px 15px',
          fontSize:15, lineHeight:1.65, border:`1.5px solid ${C.border}`,
          borderRadius:r(16), background:C.surface, color:C.text,
          resize:'none', outline:'none', fontFamily:'inherit' }}
        onFocus={e => e.target.style.borderColor=C.primary}
        onBlur={e => e.target.style.borderColor=C.border}
      />
      <div style={{ height:20 }}/>
      <PrimaryBtn onClick={onSave}>保存记录</PrimaryBtn>
      <button onClick={onSave} style={{
        width:'100%', padding:'13px', marginTop:10,
        background:'none', border:'none', fontSize:14,
        color:C.text3, cursor:'pointer', fontFamily:'inherit',
      }}>跳过，直接保存</button>
    </div>
  );
}

// ── Done ─────────────────────────────────────────────────────
function RecordDone({ onNew, onClose }) {
  return (
    <Screen style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', padding:'0 32px' }}>
        <div style={{
          width:72, height:72, borderRadius:r(24), background:C.primaryL,
          margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <path d="M10 20L17 27L30 13" stroke={C.primary} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ margin:'0 0 8px', fontSize:22, fontWeight:700, color:C.text }}>记录成功</h2>
        <p style={{ margin:'0 0 32px', fontSize:15, color:C.text2, lineHeight:1.6 }}>觉察情绪，是理解自己的第一步。</p>
        <PrimaryBtn onClick={onNew} style={{ marginBottom:12 }}>再记一条</PrimaryBtn>
        <GhostBtn onClick={onClose} style={{ width:'100%' }}>返回</GhostBtn>
      </div>
    </Screen>
  );
}

function RecordHeader({ step, total, title, noMargin }) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : 18 }}>
      <p style={{ margin:'0 0 3px', fontSize:10, color:C.text3, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>步骤 {step} / {total}</p>
      <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:C.text, lineHeight:1.3 }}>{title}</h2>
    </div>
  );
}

Object.assign(window, { RecordScreen });
