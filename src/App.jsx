import { useState, useEffect } from "react";

// ─── Thèmes ───────────────────────────────────────────────────────────────────
const THEMES = [
  { key: "vehicules",   label: "Véhicules",   icon: "🚒", color: "#ef4444" },
  { key: "materiels",   label: "Matériels",   icon: "🔧", color: "#f59e0b" },
  { key: "casernement", label: "Casernement", icon: "🏠", color: "#3b82f6" },
  { key: "personnels",  label: "Personnels",  icon: "👤", color: "#22c55e" },
  { key: "pharmacie",   label: "Pharmacie",   icon: "💊", color: "#a855f7" },
  { key: "textiles",    label: "Textiles",    icon: "👕", color: "#06b6d4" },
];

// ─── Données initiales ────────────────────────────────────────────────────────
const INITIAL_CONSIGNES = [
  { id: 1, heure: "06:00", auteur: "Adj. Martin", texte: "FPT-01 en maintenance préventive jusqu'à 12h. Utiliser FPT-02 en priorité.", priorite: "haute", theme: "vehicules", lu: false },
  { id: 2, heure: "06:30", auteur: "Sgt. Lefebvre", texte: "Vérifier les ARI et les EPI avant prise de garde.", priorite: "haute", theme: "materiels", lu: false },
  { id: 3, heure: "07:00", auteur: "Adj. Martin", texte: "Nettoyage de la salle de repos prévu ce matin.", priorite: "normale", theme: "casernement", lu: false },
  { id: 4, heure: "07:30", auteur: "Lt. Dupont", texte: "Exercice incendie prévu à 14h00. Toutes les équipes concernées.", priorite: "normale", theme: "personnels", lu: false },
  { id: 5, heure: "08:00", auteur: "Inf. Rousseau", texte: "Vérifier les dates de péremption des médicaments du VSAV 15.", priorite: "haute", theme: "pharmacie", lu: false },
  { id: 6, heure: "08:30", auteur: "Sgt. Lefebvre", texte: "Tenues de feu à récupérer au pressing — voir liste en salle.", priorite: "normale", theme: "textiles", lu: false },
];

// ─── Styles communs ───────────────────────────────────────────────────────────
const inputStyle = {
  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontSize: 13, outline: "none",
  fontFamily: "inherit", width: "100%", boxSizing: "border-box"
};
const btnStyle = {
  border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700,
  cursor: "pointer", fontSize: 13, color: "#fff", fontFamily: "inherit"
};

function Badge({ children, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700,
      color, background: color + "22", letterSpacing: "0.04em", textTransform: "uppercase"
    }}>{children}</span>
  );
}

// ─── App principale ───────────────────────────────────────────────────────────
export default function App() {
  const [consignes, setConsignes] = useState(INITIAL_CONSIGNES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ auteur: "", texte: "", priorite: "normale", theme: "vehicules" });
  const [heure, setHeure] = useState("");
  const [themeActif, setThemeActif] = useState("tous");

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setHeure(`${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    const t = setInterval(tick, 10000);
    return () => clearInterval(t);
  }, []);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  const actives  = consignes.filter(c => !c.lu);
  const archivees = consignes.filter(c => c.lu);
  const nonLues  = actives.length;

  const getTheme = (key) => THEMES.find(t => t.key === key) || THEMES[0];

  const marquerLu = (id) => {
    setConsignes(c => c.map(x => x.id === id ? { ...x, lu: true } : x));
  };

  const desarchiver = (id) => {
    setConsignes(c => c.map(x => x.id === id ? { ...x, lu: false } : x));
  };

  const supprimer = (id) => setConsignes(c => c.filter(x => x.id !== id));

  const ajouter = () => {
    if (!form.texte.trim() || !form.auteur.trim()) return;
    const n = new Date();
    const h = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
    setConsignes(c => [{ id: Date.now(), heure: h, ...form, lu: false }, ...c]);
    setForm({ auteur: "", texte: "", priorite: "normale", theme: "vehicules" });
    setShowForm(false);
  };

  // Consignes actives filtrées par thème
  const filtrees = themeActif === "tous"
    ? actives
    : themeActif === "archives"
    ? archivees
    : actives.filter(c => c.theme === themeActif);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#e2e8f0" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b24 0%, #1a1f2e 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 20px", position: "sticky", top: 0, zIndex: 50
      }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
              }}>🚒</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.02em" }}>CASERNE CONNECT</div>
                <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Consignes journalières</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444", fontFamily: "monospace" }}>{heure}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>{today}</div>
            </div>
          </div>

          {/* Onglets */}
          <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 1 }}>
            {/* Tous */}
            <button onClick={() => setThemeActif("tous")} style={{
              background: themeActif === "tous" ? "rgba(220,38,38,0.2)" : "transparent",
              border: "none", borderBottom: `2px solid ${themeActif === "tous" ? "#dc2626" : "transparent"}`,
              color: themeActif === "tous" ? "#f87171" : "#64748b",
              padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700,
              fontFamily: "inherit", borderRadius: "6px 6px 0 0", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4
            }}>
              📋 Tous
              {nonLues > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: 999, fontSize: 9, fontWeight: 900, padding: "1px 5px" }}>{nonLues}</span>}
            </button>

            {/* Thèmes */}
            {THEMES.map(t => {
              const count = actives.filter(c => c.theme === t.key).length;
              return (
                <button key={t.key} onClick={() => setThemeActif(t.key)} style={{
                  background: themeActif === t.key ? t.color + "22" : "transparent",
                  border: "none", borderBottom: `2px solid ${themeActif === t.key ? t.color : "transparent"}`,
                  color: themeActif === t.key ? t.color : "#64748b",
                  padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700,
                  fontFamily: "inherit", borderRadius: "6px 6px 0 0", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4
                }}>
                  {t.icon} {t.label}
                  {count > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: 999, fontSize: 9, fontWeight: 900, padding: "1px 5px" }}>{count}</span>}
                </button>
              );
            })}

            {/* Archives */}
            <button onClick={() => setThemeActif("archives")} style={{
              background: themeActif === "archives" ? "rgba(100,116,139,0.2)" : "transparent",
              border: "none", borderBottom: `2px solid ${themeActif === "archives" ? "#64748b" : "transparent"}`,
              color: themeActif === "archives" ? "#94a3b8" : "#475569",
              padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700,
              fontFamily: "inherit", borderRadius: "6px 6px 0 0", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4,
              borderLeft: "1px solid rgba(255,255,255,0.07)", marginLeft: 4
            }}>
              🗂 Archives
              {archivees.length > 0 && <span style={{ background: "#475569", color: "#fff", borderRadius: 999, fontSize: 9, fontWeight: 900, padding: "1px 5px" }}>{archivees.length}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "20px 16px 60px" }}>

        {/* Barre d'action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>
              {themeActif === "tous" ? "Toutes les consignes"
                : themeActif === "archives" ? "🗂 Archives"
                : `${getTheme(themeActif).icon} ${getTheme(themeActif).label}`}
            </h2>
            {themeActif !== "archives" && (
              nonLues > 0
                ? <p style={{ margin: "3px 0 0", fontSize: 12, color: "#ef4444" }}>⚠ {nonLues} non lue{nonLues > 1 ? "s" : ""}</p>
                : <p style={{ margin: "3px 0 0", fontSize: 12, color: "#22c55e" }}>✓ Toutes les consignes sont lues</p>
            )}
            {themeActif === "archives" && (
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b" }}>{archivees.length} consigne{archivees.length > 1 ? "s" : ""} archivée{archivees.length > 1 ? "s" : ""}</p>
            )}
          </div>
          {themeActif !== "archives" && (
            <button onClick={() => setShowForm(!showForm)} style={{
              background: "#dc2626", color: "#fff", border: "none", borderRadius: 10,
              padding: "9px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "inherit"
            }}>+ Nouvelle consigne</button>
          )}
        </div>

        {/* Formulaire */}
        {showForm && themeActif !== "archives" && (
          <div style={{
            background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.4)",
            borderRadius: 16, padding: "20px", marginBottom: 20
          }}>
            <h3 style={{ margin: "0 0 14px", color: "#fca5a5", fontSize: 14 }}>Nouvelle consigne</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input value={form.auteur} onChange={e => setForm(f => ({ ...f, auteur: e.target.value }))}
                placeholder="Auteur (ex : Lt. Dupont)" style={inputStyle} />
              <select value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))} style={inputStyle}>
                {THEMES.map(t => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
              </select>
              <textarea value={form.texte} onChange={e => setForm(f => ({ ...f, texte: e.target.value }))}
                placeholder="Texte de la consigne..." rows={3}
                style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }} />
              <select value={form.priorite} onChange={e => setForm(f => ({ ...f, priorite: e.target.value }))} style={inputStyle}>
                <option value="normale">Priorité normale</option>
                <option value="haute">Priorité haute</option>
              </select>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={ajouter} style={{ ...btnStyle, background: "#dc2626", flex: 1 }}>Publier</button>
                <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "rgba(255,255,255,0.1)", flex: 1 }}>Annuler</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Vue TOUS — colonnes par thème + archives ── */}
        {themeActif === "tous" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {THEMES.map(theme => {
              const items = actives.filter(c => c.theme === theme.key);
              return (
                <ColonneTheme
                  key={theme.key}
                  theme={theme}
                  items={items}
                  onValider={marquerLu}
                  onSupprimer={supprimer}
                />
              );
            })}

            {/* Colonne Archives */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(100,116,139,0.3)",
              borderTop: "3px solid #475569",
              borderRadius: 12, overflow: "hidden"
            }}>
              <div style={{
                padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "rgba(100,116,139,0.1)", borderBottom: "1px solid rgba(100,116,139,0.2)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 16 }}>🗂</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#94a3b8" }}>Archives</span>
                </div>
                <span style={{ fontSize: 10, color: "#64748b" }}>{archivees.length} consigne{archivees.length !== 1 ? "s" : ""}</span>
              </div>
              <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 7, minHeight: 60 }}>
                {archivees.length === 0 && (
                  <p style={{ color: "#334155", fontSize: 11, textAlign: "center", padding: "12px 0", margin: 0 }}>
                    Les consignes validées apparaîtront ici
                  </p>
                )}
                {archivees.map(c => {
                  const th = getTheme(c.theme);
                  return (
                    <div key={c.id} style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: `3px solid ${th.color}55`,
                      borderRadius: 8, padding: "9px 10px", opacity: 0.6
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 7 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{c.heure}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>{c.auteur}</span>
                            <Badge color={th.color}>{th.icon} {th.label}</Badge>
                          </div>
                          <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.45, fontSize: 12 }}>{c.texte}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                          <button onClick={() => desarchiver(c.id)} title="Désarchiver" style={{
                            background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
                            color: "#3b82f6", borderRadius: 5, padding: "3px 7px", cursor: "pointer", fontSize: 11
                          }}>↩</button>
                          <button onClick={() => supprimer(c.id)} title="Supprimer" style={{
                            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                            color: "#ef4444", borderRadius: 5, padding: "3px 7px", cursor: "pointer", fontSize: 11
                          }}>✕</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Vue filtrée par thème ── */}
        {themeActif !== "tous" && themeActif !== "archives" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtrees.length === 0 && (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24, textAlign: "center" }}>
                <p style={{ color: "#475569", margin: 0 }}>Aucune consigne active dans cette catégorie.</p>
              </div>
            )}
            {filtrees.map(c => {
              const theme = getTheme(c.theme);
              return (
                <div key={c.id} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderLeft: `4px solid ${c.priorite === "haute" ? "#ef4444" : theme.color}`,
                  borderRadius: 14, padding: "16px 20px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{c.heure}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>{c.auteur}</span>
                        {c.priorite === "haute" && <Badge color="#ef4444">🔴 Haute priorité</Badge>}
                      </div>
                      <p style={{ margin: 0, color: "#e2e8f0", lineHeight: 1.6, fontSize: 14 }}>{c.texte}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => marquerLu(c.id)} title="Valider → Archives" style={{
                        background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
                        color: "#22c55e", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14
                      }}>✓</button>
                      <button onClick={() => supprimer(c.id)} style={{
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                        color: "#ef4444", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14
                      }}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Vue Archives ── */}
        {themeActif === "archives" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {archivees.length === 0 && (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 32, textAlign: "center" }}>
                <p style={{ fontSize: 28, marginBottom: 10 }}>🗂</p>
                <p style={{ color: "#475569", margin: 0, fontSize: 14 }}>Aucune consigne archivée pour le moment.</p>
                <p style={{ color: "#334155", margin: "6px 0 0", fontSize: 12 }}>Les consignes validées (✓) apparaîtront ici automatiquement.</p>
              </div>
            )}
            {archivees.map(c => {
              const theme = getTheme(c.theme);
              return (
                <div key={c.id} style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: `4px solid ${theme.color}44`,
                  borderRadius: 14, padding: "14px 20px", opacity: 0.7
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{c.heure}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{c.auteur}</span>
                        <Badge color={theme.color}>{theme.icon} {theme.label}</Badge>
                        {c.priorite === "haute" && <Badge color="#ef444466">Haute priorité</Badge>}
                        <Badge color="#22c55e">✓ Validée</Badge>
                      </div>
                      <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.55, fontSize: 13 }}>{c.texte}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => desarchiver(c.id)} title="Remettre en actif" style={{
                        background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
                        color: "#3b82f6", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14
                      }}>↩</button>
                      <button onClick={() => supprimer(c.id)} style={{
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                        color: "#ef4444", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14
                      }}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Composant ColonneTheme ───────────────────────────────────────────────────
function ColonneTheme({ theme, items, onValider, onSupprimer }) {
  function Badge({ children, color }) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", padding: "1px 7px", borderRadius: 999,
        fontSize: 10, fontWeight: 700, color, background: color + "22", textTransform: "uppercase", letterSpacing: "0.04em"
      }}>{children}</span>
    );
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${theme.color}30`,
      borderTop: `3px solid ${theme.color}`,
      borderRadius: 12, overflow: "hidden"
    }}>
      <div style={{
        padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: theme.color + "10", borderBottom: `1px solid ${theme.color}20`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 16 }}>{theme.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: theme.color }}>{theme.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {items.length > 0 && (
            <span style={{ background: "#ef4444", color: "#fff", borderRadius: 999, fontSize: 9, fontWeight: 900, padding: "1px 6px" }}>
              {items.length}
            </span>
          )}
          <span style={{ fontSize: 10, color: "#64748b" }}>{items.length} consigne{items.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
      <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 7, minHeight: 60 }}>
        {items.length === 0 && (
          <p style={{ color: "#334155", fontSize: 11, textAlign: "center", padding: "12px 0", margin: 0 }}>Aucune consigne</p>
        )}
        {items.map(c => (
          <div key={c.id} style={{
            background: c.priorite === "haute" ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${c.priorite === "haute" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
            borderLeft: `3px solid ${c.priorite === "haute" ? "#ef4444" : theme.color}`,
            borderRadius: 8, padding: "9px 10px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 7 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{c.heure}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>{c.auteur}</span>
                  {c.priorite === "haute" && <Badge color="#ef4444">🔴 Urgent</Badge>}
                </div>
                <p style={{ margin: 0, color: "#e2e8f0", lineHeight: 1.45, fontSize: 12 }}>{c.texte}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                <button onClick={() => onValider(c.id)} title="Valider → Archives" style={{
                  background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
                  color: "#22c55e", borderRadius: 5, padding: "3px 7px", cursor: "pointer", fontSize: 11
                }}>✓</button>
                <button onClick={() => onSupprimer(c.id)} style={{
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  color: "#ef4444", borderRadius: 5, padding: "3px 7px", cursor: "pointer", fontSize: 11
                }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
