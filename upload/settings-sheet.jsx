// ── Account / Settings bottom sheet (local prototype build) ──

function AccountSheet({ entries = [], wins = [], onClose }) {
  function exportData() {
    const blob = new Blob(
      [JSON.stringify({ entries, wins, exportedAt: new Date().toISOString() }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `recordme-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const Row = ({ label, sub, onClick, right }) => (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '15px 2px', background: 'none', border: 'none',
      borderBottom: `1px solid ${C.border}`,
      cursor: onClick ? 'pointer' : 'default', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <span>
        <span style={{ display: 'block', fontSize: 15, color: C.text, fontWeight: 600 }}>{label}</span>
        {sub && <span style={{ display: 'block', fontSize: 12, color: C.text3, marginTop: 3 }}>{sub}</span>}
      </span>
      {right || (onClick && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M9 18L15 12L9 6" stroke={C.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ))}
    </button>
  );

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 320,
      background: 'rgba(45,43,40,0.38)', backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.surface, borderRadius: `${r(28)}px ${r(28)}px 0 0`,
        padding: '12px 24px calc(40px + env(safe-area-inset-bottom))',
        boxShadow: '0 -8px 40px rgba(45,43,40,0.15)', maxHeight: '85%', overflowY: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: '0 auto 18px' }}/>
        <h2 style={{ margin: '0 0 18px', fontSize: 22, fontWeight: 800, color: C.text }}>设置</h2>

        {/* Account block */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 13,
          background: C.surface2, borderRadius: r(18), padding: '15px 16px', marginBottom: 18,
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #94A6E2 0%, #BB9FD9 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="1.8"/>
              <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 700, color: C.text }}>本地账户</p>
            <p style={{ margin: 0, fontSize: 12, color: C.text3, lineHeight: 1.5 }}>记录保存在这台设备上</p>
          </div>
        </div>

        <Row label="登录以云端同步" sub="在手机和电脑上看到同一份记录" onClick={() => {}}
          right={<span style={{ fontSize: 12, color: C.text3 }}>即将上线</span>} />
        <Row label="导出数据备份" sub={`${entries.length} 条心情 · ${wins.length} 条收获`} onClick={exportData} />
        <Row label="提醒与隐私" sub="记录提醒、数据安全" onClick={() => {}} />
        <Row label="关于 Record.me" sub="版本 1.0" onClick={() => {}} />

        <button onClick={onClose} style={{
          marginTop: 22, width: '100%', padding: '14px',
          background: C.surface2, border: 'none', borderRadius: r(14),
          fontSize: 15, color: C.text2, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>关闭</button>
      </div>
    </div>
  );
}

Object.assign(window, { AccountSheet });
