// ── Record.me cloud sync (Supabase) ──────────────────────────
// Append-only model: entries & wins are never edited/deleted in-app,
// so sync is a simple union-by-id. Local cache stays the offline source
// of truth; cloud is the cross-device mirror.
(function () {
  let sb = null;

  const RMCloud = {
    ready: false,

    init() {
      const cfg = window.RM_SUPABASE || {};
      if (!window.supabase || !window.supabase.createClient) {
        console.warn("[RMCloud] supabase-js not loaded");
        return null;
      }
      if (!cfg.url || !cfg.key) {
        console.warn("[RMCloud] missing config");
        return null;
      }
      sb = window.supabase.createClient(cfg.url, cfg.key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: "recordme_auth",
        },
      });
      this.ready = true;
      return sb;
    },

    client() { return sb; },

    async getSession() {
      if (!sb) return null;
      try { const { data } = await sb.auth.getSession(); return data?.session || null; }
      catch (e) { return null; }
    },

    async getUser() {
      if (!sb) return null;
      try { const { data } = await sb.auth.getUser(); return data?.user || null; }
      catch (e) { return null; }
    },

    onAuth(cb) {
      if (!sb) return;
      sb.auth.onAuthStateChange((_e, session) => cb(session));
    },

    async signUp(email, password) {
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    },

    async signIn(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },

    async signOut() { if (sb) await sb.auth.signOut(); },

    // Pull all of this user's records, split back into entries + wins
    async pull() {
      if (!sb) return { entries: [], wins: [] };
      const { data, error } = await sb
        .from("records")
        .select("kind,payload,ts")
        .order("ts", { ascending: false });
      if (error) throw error;
      const entries = [], wins = [];
      for (const row of data || []) {
        const obj = row.payload || {};
        if (obj.ts) obj.ts = new Date(obj.ts);
        if (row.kind === "entry") entries.push(obj);
        else if (row.kind === "win") wins.push(obj);
      }
      return { entries, wins };
    },

    // Upsert one record (entry or win)
    async push(kind, obj) {
      if (!sb) return;
      const user = await this.getUser();
      if (!user) return;
      const tsIso = obj.ts instanceof Date ? obj.ts.toISOString() : new Date(obj.ts).toISOString();
      const payload = Object.assign({}, obj, { ts: tsIso });
      const row = {
        id: kind + "_" + obj.id,
        user_id: user.id,
        kind: kind,
        payload: payload,
        ts: tsIso,
        updated_at: new Date().toISOString(),
      };
      const { error } = await sb.from("records").upsert(row, { onConflict: "id" });
      if (error) throw error;
    },

    // Push many (used when uploading local-only records)
    async pushMany(kind, arr) {
      for (const obj of arr) {
        try { await this.push(kind, obj); } catch (e) { console.warn("[RMCloud] push failed", e); throw e; }
      }
    },
  };

  window.RMCloud = RMCloud;
})();
