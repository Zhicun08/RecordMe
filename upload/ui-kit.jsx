// ── Shared UI Components ──────────────────────────────────────

function r(base) { return Math.round(base * (window.RM_R ?? 1)); }

// Make a Morandi pastel read clearly on white: boost saturation, only a touch darker
function emDark(hex) {
  if (!hex || hex[0] !== '#') return hex;
  const n = parseInt(hex.slice(1), 16);
  let r = ((n>>16)&255)/255, g = ((n>>8)&255)/255, b = (n&255)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max-min;
  let h = 0, s = 0, l = (max+min)/2;
  if (d !== 0) {
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    if (max === r) h = (g-b)/d + (g<b?6:0);
    else if (max === g) h = (b-r)/d + 2;
    else h = (r-g)/d + 4;
    h /= 6;
  }
  const deg = h * 360;
  const warm = deg < 45 || deg > 340;            // reds / oranges read hotter
  if (warm) s = Math.min(1, s * 0.95);           // ease warm hues down
  else      s = Math.min(1, s * 1.3 + 0.05);     // lift muted cools a bit
  l = Math.max(0, l - 0.07);                     // only slightly darker
  const hue2rgb = (p,q,t) => { if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; };
  let r2, g2, b2;
  if (s === 0) { r2 = g2 = b2 = l; }
  else {
    const q = l < 0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
    r2 = hue2rgb(p,q,h+1/3); g2 = hue2rgb(p,q,h); b2 = hue2rgb(p,q,h-1/3);
  }
  const to = v => Math.round(v*255).toString(16).padStart(2,'0');
  return '#' + to(r2) + to(g2) + to(b2);
}

const C = {
  bg:       '#F7F6F3',
  surface:  '#FFFFFF',
  surface2: '#F2F1ED',
  primary:  '#37332E',
  primaryL: '#E3DFD9',
  text:     '#2D2B28',
  text2:    '#6E6962',
  text3:    '#A9A69E',
  border:   '#ECEBE6',
  shadow:   'rgba(45,43,40,0.06)',
};

function TabBar({ tab, setTab }) {
  const tabs = [
    { id: 'home',   icon: TabHomeIcon,   label: '今天' },
    { id: 'review', icon: TabReviewIcon, label: '回顾' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 'calc(83px + env(safe-area-inset-bottom))',
      background: 'rgba(247,246,243,0.88)', backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',
      paddingTop: 10, paddingBottom: 'calc(30px + env(safe-area-inset-bottom))', zIndex: 100,
    }}>
      {tabs.map(t => {
        const Icon = t.icon; const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 20px',
          }}>
            <Icon active={active} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? C.primary : C.text3 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TabHomeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        fill={active ? C.primary : 'none'} stroke={active ? C.primary : C.text3} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}
function TabEventsIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="3" fill={active ? C.primary : 'none'} stroke={active ? C.primary : C.text3} strokeWidth="1.6"/>
      <path d="M3 9H21" stroke={active ? '#fff' : C.text3} strokeWidth="1.4"/>
      <path d="M8 2V5M16 2V5" stroke={active ? C.primary : C.text3} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M7 13H17M7 17H13" stroke={active ? '#fff' : C.text3} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function TabReviewIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="12" width="4" height="9" rx="1.5" fill={active ? C.primary : C.text3}/>
      <rect x="10" y="7" width="4" height="14" rx="1.5" fill={active ? C.primary : C.text3} opacity={active?1:0.6}/>
      <rect x="17" y="3" width="4" height="18" rx="1.5" fill={active ? C.primary : C.text3} opacity={active?1:0.35}/>
    </svg>
  );
}

function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.surface, borderRadius: r(22),
      padding: '17px 18px', boxShadow: `0 6px 24px -10px rgba(45,43,40,0.10)`, ...style,
    }}>{children}</div>
  );
}

function PrimaryBtn({ children, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? C.primaryL : C.primary, color: '#fff',
      border: 'none', borderRadius: r(16), padding: '15px 28px',
      fontSize: 17, fontWeight: 600, width: '100%',
      cursor: disabled ? 'default' : 'pointer',
      letterSpacing: '0.01em', fontFamily: 'inherit', ...style,
    }}>{children}</button>
  );
}
function GhostBtn({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', color: C.primary, border: `1.5px solid ${C.primaryL}`,
      borderRadius: r(14), padding: '12px 20px', fontSize: 15, fontWeight: 500,
      cursor: 'pointer', fontFamily: 'inherit', ...style,
    }}>{children}</button>
  );
}
function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: C.surface2, border: 'none', borderRadius: r(12),
      width: 36, height: 36, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke={C.text2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function EntryCard({ entry, onClick }) {
  const em = EMOTIONS.find(e => e.id === entry.emotionId);
  if (!em) return null;
  const timeStr = entry.ts.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const entryTags = (entry.tags || []).slice(0,2).map(id => TAGS.find(t => t.id === id)).filter(Boolean);
  const nameColor = emDark(em.color);
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'stretch', background: C.surface,
      borderRadius: r(16), boxShadow: `0 5px 20px -12px rgba(45,43,40,0.12)`,
      cursor: 'pointer', overflow: 'hidden',
    }}>
      <div style={{ flex: 1, padding: '12px 15px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: nameColor, flexShrink: 0 }}/>
            <span style={{ fontSize: 15, fontWeight: 700, color: nameColor }}>{em.name}</span>
            {entryTags.map(tag => (
              <svg key={tag.id} width="12" height="12" viewBox="0 0 24 24"
                style={{ color: C.text3, flexShrink: 0 }}
                dangerouslySetInnerHTML={{ __html: tag.icon }}
              />
            ))}
          </div>
          <span style={{ fontSize: 10, color: C.text3, flexShrink: 0 }}>{timeStr}</span>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: entry.event ? C.text : C.text3, lineHeight: 1.55, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: entry.event ? 'normal' : 'italic' }}>
          {entry.event || '无事件描述'}
        </p>
      </div>
    </div>
  );
}

function EmotionBadge({ emotionId }) {
  const em = EMOTIONS.find(e => e.id === emotionId);
  if (!em) return null;
  return (
    <span style={{ background: em.bg, color: em.color, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{em.name}</span>
  );
}

function Screen({ children, style }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: C.bg,
      overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', ...style,
    }}>{children}</div>
  );
}

// ── Split capsule FAB — ＋记心情（主） | ★记收获（次）──
function SplitFab({ onMood, onWin }) {
  return (
    <div style={{
      position: 'absolute', bottom: 'calc(95px + env(safe-area-inset-bottom))', right: 20, zIndex: 110,
      display: 'flex', alignItems: 'stretch', height: 52,
      background: C.primary, borderRadius: r(26), overflow: 'hidden',
      boxShadow: `0 7px 22px -6px ${C.primary}66, 0 4px 14px rgba(45,43,40,0.14)`,
    }}>
      <button onClick={onMood} style={{
        display: 'flex', alignItems: 'center', gap: 7, padding: '0 18px',
        background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>记心情</span>
      </button>
      <div style={{ width: 1, background: 'rgba(255,255,255,0.28)', margin: '11px 0' }}></div>
      <button onClick={onWin} style={{
        width: 50, background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="rgba(255,255,255,0.22)" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── Win quick-add bottom sheet ──
const WIN_PLACEHOLDERS = [
  '完成了一件小事…', '今天吃了好吃的…', '做了让自己开心的事…',
  '帮助了某个人…', '学到了新东西…', '给自己一点肯定…',
];

function WinQuickSheet({ onSave, onClose }) {
  const [text, setText] = React.useState('');
  const [placeholder] = React.useState(() => WIN_PLACEHOLDERS[Math.floor(Math.random() * WIN_PLACEHOLDERS.length)]);

  function save() {
    const v = text.trim(); if (!v) return;
    onSave(v); onClose();
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 250,
      background: 'rgba(45,43,40,0.35)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.surface, borderRadius: `${r(24)}px ${r(24)}px 0 0`,
        padding: '12px 20px 36px', boxShadow: '0 -8px 40px rgba(45,43,40,0.15)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: '0 auto 16px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={C.primary}/>
          </svg>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>记一条收获</span>
        </div>
        <textarea
          autoFocus value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); } }}
          placeholder={placeholder} rows={3}
          style={{
            width: '100%', boxSizing: 'border-box', padding: '13px 15px',
            fontSize: 15, lineHeight: 1.65, border: `1.5px solid ${C.border}`,
            borderRadius: r(16), background: C.surface2, color: C.text,
            resize: 'none', outline: 'none', fontFamily: 'inherit', marginBottom: 14,
          }}
          onFocus={e => e.target.style.borderColor = C.primary}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        <PrimaryBtn onClick={save} disabled={!text.trim()}>保存</PrimaryBtn>
        <p style={{ margin: '12px 0 0', fontSize: 12, color: C.text3, textAlign: 'center', lineHeight: 1.6 }}>
          记下今天做到的小事、值得开心的瞬间，或者对自己的一点肯定。
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { C, r, emDark, TabBar, Card, PrimaryBtn, GhostBtn, BackBtn, EntryCard, EmotionBadge, Screen, SplitFab, WinQuickSheet });
