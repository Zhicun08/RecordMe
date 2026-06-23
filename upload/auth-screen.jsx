// ── Auth + Settings UI for the cloud-synced phone build ──────

function RMSplash() {
  return (
    <div style={{
      position: "absolute", inset: 0, background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: r(20), background: C.primary,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 8px 30px ${C.primary}55`,
      }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "rmspin 0.8s linear infinite" }}/>
      </div>
      <p style={{ margin: 0, fontSize: 14, color: C.text3 }}>正在同步…</p>
      <style>{`@keyframes rmspin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode]   = React.useState("signin"); // signin | signup
  const [email, setEmail] = React.useState("");
  const [pw, setPw]       = React.useState("");
  const [busy, setBusy]   = React.useState(false);
  const [err, setErr]     = React.useState("");
  const [info, setInfo]   = React.useState("");

  async function submit() {
    setErr(""); setInfo("");
    if (!email.trim() || !pw) { setErr("请填写邮箱和密码"); return; }
    if (pw.length < 6) { setErr("密码至少 6 位"); return; }
    setBusy(true);
    try {
      if (mode === "signup") {
        const data = await RMCloud.signUp(email.trim(), pw);
        if (!data.session) {
          setInfo("注册成功！请前往邮箱点击确认链接后再登录。");
          setMode("signin");
        }
      } else {
        await RMCloud.signIn(email.trim(), pw);
      }
      // onAuthStateChange in the root will swap to the app
    } catch (e) {
      const m = (e && e.message) || "出错了，请重试";
      if (/invalid login/i.test(m)) setErr("邮箱或密码不正确");
      else if (/already registered/i.test(m)) { setErr("该邮箱已注册，请直接登录"); setMode("signin"); }
      else if (/not confirmed/i.test(m)) setErr("邮箱尚未确认，请查收确认邮件");
      else setErr(m);
    }
    setBusy(false);
  }

  const inputStyle = {
    width: "100%", boxSizing: "border-box", padding: "14px 16px",
    fontSize: 16, border: `1.5px solid ${C.border}`, borderRadius: r(14),
    background: C.surface, color: C.text, outline: "none", fontFamily: "inherit",
    marginBottom: 12,
  };

  return (
    <div style={{
      position: "absolute", inset: 0, background: C.bg, overflowY: "auto",
      padding: "calc(72px + env(safe-area-inset-top)) 28px calc(40px + env(safe-area-inset-bottom))",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: r(18), background: C.primary,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22,
        boxShadow: `0 6px 22px ${C.primary}44`,
      }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", border: "3px solid #fff" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", margin: "5px auto 0" }}/>
        </div>
      </div>

      <h1 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>
        {mode === "signin" ? "登录 Record.me" : "创建账号"}
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 14, color: C.text3, lineHeight: 1.6 }}>
        登录后，你的记录会自动同步到云端，<br/>在手机和电脑上看到同一份数据。
      </p>

      <input style={inputStyle} type="email" inputMode="email" autoCapitalize="none" autoCorrect="off"
        placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} />
      <input style={inputStyle} type="password"
        placeholder="密码（至少 6 位）" value={pw} onChange={e => setPw(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") submit(); }} />

      {err && <p style={{ margin: "2px 0 12px", fontSize: 13, color: "#C0392B" }}>{err}</p>}
      {info && <p style={{ margin: "2px 0 12px", fontSize: 13, color: C.primary }}>{info}</p>}

      <button onClick={submit} disabled={busy} style={{
        width: "100%", padding: "15px", background: C.primary, color: "#fff",
        border: "none", borderRadius: r(14), fontSize: 16, fontWeight: 700,
        cursor: busy ? "default" : "pointer", fontFamily: "inherit", opacity: busy ? 0.6 : 1,
        marginBottom: 16,
      }}>
        {busy ? "请稍候…" : mode === "signin" ? "登录" : "注册并登录"}
      </button>

      <div style={{ textAlign: "center" }}>
        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(""); setInfo(""); }}
          style={{ background: "none", border: "none", fontSize: 14, color: C.text2, cursor: "pointer", fontFamily: "inherit" }}>
          {mode === "signin"
            ? <>还没有账号？<span style={{ color: C.primary, fontWeight: 700 }}>注册</span></>
            : <>已有账号？<span style={{ color: C.primary, fontWeight: 700 }}>登录</span></>}
        </button>
      </div>

      <p style={{ margin: "auto 0 0", paddingTop: 28, fontSize: 12, color: C.text3, lineHeight: 1.7, textAlign: "center" }}>
        🔒 你的记录是私密的，只有登录你邮箱的人能看到。
      </p>
    </div>
  );
}

function SyncBadge({ state }) {
  const map = {
    syncing: { t: "同步中…", c: C.text3, dot: C.text3 },
    synced:  { t: "已同步",   c: "#1F8A5B", dot: "#1F8A5B" },
    offline: { t: "离线",     c: "#C0392B", dot: "#C0392B" },
    idle:    { t: "",         c: C.text3, dot: C.text3 },
  };
  const s = map[state] || map.idle;
  if (!s.t) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: s.c, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, animation: state === "syncing" ? "rmpulse 1s ease-in-out infinite" : "none" }}/>
      {s.t}
      <style>{`@keyframes rmpulse{0%,100%{opacity:.35}50%{opacity:1}}`}</style>
    </span>
  );
}

function SettingsSheet({ email, syncState, entries, wins, onSignOut, onResync, onClose }) {
  function exportData() {
    const blob = new Blob([JSON.stringify({ entries, wins, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `recordme-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const Row = ({ label, sub, onClick, danger, right }) => (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "15px 0", background: "none", border: "none", borderBottom: `1px solid ${C.border}`,
      cursor: onClick ? "pointer" : "default", fontFamily: "inherit", textAlign: "left",
    }}>
      <span>
        <span style={{ display: "block", fontSize: 15, color: danger ? "#C0392B" : C.text, fontWeight: 600 }}>{label}</span>
        {sub && <span style={{ display: "block", fontSize: 12, color: C.text3, marginTop: 3 }}>{sub}</span>}
      </span>
      {right}
    </button>
  );

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 320,
      background: "rgba(45,43,40,0.38)", backdropFilter: "blur(6px)",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.surface, borderRadius: `${r(28)}px ${r(28)}px 0 0`,
        padding: "12px 24px calc(40px + env(safe-area-inset-bottom))",
        boxShadow: "0 -8px 40px rgba(45,43,40,0.15)", maxHeight: "85%", overflowY: "auto",
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 18px" }}/>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: C.text }}>设置</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0 8px" }}>
          <span style={{ fontSize: 13, color: C.text2 }}>{email}</span>
          <SyncBadge state={syncState} />
        </div>

        <Row label="立即同步" sub="从云端拉取最新记录" onClick={onResync} />
        <Row label="导出备份" sub="把所有记录存成一个文件" onClick={exportData} />
        <Row label="退出登录" sub="本机的本地记录会保留" danger onClick={onSignOut} />

        <button onClick={onClose} style={{
          marginTop: 20, width: "100%", padding: "14px",
          background: C.surface2, border: "none", borderRadius: r(14),
          fontSize: 15, color: C.text2, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>关闭</button>
      </div>
    </div>
  );
}

Object.assign(window, { RMSplash, AuthScreen, SyncBadge, SettingsSheet });
