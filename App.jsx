import { useState, useEffect } from "react";

const THEMES = [
  { key: "vehicules",   label: "Véhicules",   icon: "🚒", color: "#ef4444" },
  { key: "materiels",   label: "Matériels",   icon: "🔧", color: "#f59e0b" },
  { key: "casernement", label: "Casernement", icon: "🏠", color: "#3b82f6" },
  { key: "personnels",  label: "Personnels",  icon: "👤", color: "#22c55e" },
  { key: "pharmacie",   label: "Pharmacie",   icon: "💊", color: "#a855f7" },
  { key: "textiles",    label: "Textiles",    icon: "👕", color: "#06b6d4" },
  { key: "archives",    label: "Archives",    icon: "🗂", color: "#64748b" },
];

const INITIAL_CONSIGNES = [
  { id: 1, heure: "06:00", auteur: "Adj. Martin", texte: "FPT-01 en maintenance préventive jusqu'à 12h. Utiliser FPT-02 en priorité.", priorite: "haute", theme: "vehicules", lu: false },
  { id: 2, heure: "06:30", auteur: "Sgt. Lefebvre", texte: "Vérifier les ARI et les EPI avant prise de garde.", priorite: "haute", theme: "materiels", lu: false },
  { id: 3, heure: "07:00", auteur: "Adj. Martin", texte: "Nettoyage de la salle de repos prévu ce matin.", priorite: "normale", theme: "casernement", lu: false },
  { id: 4, heure: "07:30", auteur: "Lt. Dupont", texte: "Exercice incendie prévu à 14h00. Toutes les équipes concernées.", priorite: "normale", theme: "personnels", lu: false },
  { id: 5, heure: "08:00", auteur: "Inf. Rousseau", texte: "Vérifier les dates de péremption des médicaments du VSAV 15.", priorite: "haute", theme: "pharmacie", lu: false },
  { id: 6, heure: "08:30", auteur: "Sgt. Lefebvre", texte: "Tenues de feu à récupérer au pressing — voir liste en salle.", priorite: "normale", theme: "textiles", lu: false },
];

const getNow = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
};
const getTheme = (key) => THEMES.find(t => t.key === key) || THEMES[0];

export default function App() {
  const [consignes, setConsignes] = useState(INITIAL_CONSIGNES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ auteur: "", texte: "", priorite: "normale", theme: "vehicules" });
  const [heure, setHeure] = useState(getNow());
  const [themeActif, setThemeActif] = useState("tous");

  useEffect(() => {
    const t = setInterval(() => setHeure(getNow()), 10000);
    return () => clearInterval(t);
  }, []);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const actives = consignes.filter(c => !c.lu);
  const archivees = consignes.filter(c => c.lu);

  const marquerLu = (id) => setConsignes(c => c.map(x => x.id === id ? { ...x, lu: true } : x));
  const desarchiver = (id) => setConsignes(c => c.map(x => x.id === id ? { ...x, lu: false } : x));
  const supprimer = (id) => setConsignes(c => c.filter(x => x.id !== id));

  const ajouter = () => {
    if (!form.texte.trim() || !form.auteur.trim()) return;
    setConsignes(c => [{ id: Date.now(), heure: getNow(), ...form, lu: false }, ...c]);
    setForm({ auteur: "", texte: "", priorite: "normale", theme: "vehicules" });
    setShowForm(false);
  };

  const liste = themeActif === "tous"
    ? actives
    : themeActif === "archives"
    ? archivees
    : actives.filter(c => c.theme === themeActif);

  const TABS = [
    { key: "tous", label: "Tous", icon: "📋", color: "#dc2626", count: actives.length },
    ...THEMES.slice(0, 6).map(t => ({ ...t, count: actives.filter(c => c.theme === t.key).length })),
    { key: "archives", label: "Archives", icon: "🗂", color: "#64748b", count: archivees.length },
  ];

  const IS = {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12, padding: "14px 16px",
    color: "#f1f5f9", fontSize: 16, outline: "none",
    fontFamily: "inherit", width: "100%", boxSizing: "border-box"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#e2e8f0", paddingBottom: 100 }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg,#1e1b24,#1a1f2e)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 16px 12px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#dc2626,#991b1b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🚒</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#f1f5f9" }}>CASERNE CONNECT</div>
              <div style={{ fontSize: 12, color: "#64748b", textTransform: "capitalize" }}>{today}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#ef4444", fontFamily: "monospace", lineHeight: 1 }}>{heure}</div>
          </div>
        </div>
      </div>

      {/* ── Titre section + bouton ── */}
      <div style={{ padding: "16px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>
            {themeActif === "tous" ? "Toutes les consignes"
              : themeActif === "archives" ? "🗂 Archives"
              : `${getTheme(themeActif).icon} ${getTheme(themeActif).label}`}
          </h2>
          {themeActif !== "archives"
            ? actives.length > 0
              ? <p style={{ margin: "4px 0 0", fontSize: 14, color: "#ef4444" }}>⚠ {actives.length} non lue{actives.length > 1 ? "s" : ""}</p>
              : <p style={{ margin: "4px 0 0", fontSize: 14, color: "#22c55e" }}>✓ Toutes validées</p>
            : <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>{archivees.length} archivée{archivees.length > 1 ? "s" : ""}</p>
          }
        </div>
        {themeActif !== "archives" && (
          <button onClick={() => setShowForm(!showForm)} style={{
            background: showForm ? "rgba(220,38,38,0.3)" : "#dc2626",
            color: "#fff", border: "none", borderRadius: 14,
            width: 52, height: 52, fontSize: 26, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>{showForm ? "✕" : "+"}</button>
        )}
      </div>

      {/* ── Formulaire ── */}
      {showForm && themeActif !== "archives" && (
        <div style={{ margin: "14px 16px 0", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 18, padding: 18 }}>
          <p style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#fca5a5" }}>Nouvelle consigne</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input value={form.auteur} onChange={e => setForm(f => ({ ...f, auteur: e.target.value }))}
              placeholder="Auteur (ex : Lt. Dupont)" style={IS} />
            <select value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))} style={IS}>
              {THEMES.slice(0, 6).map(t => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
            </select>
            <select value={form.priorite} onChange={e => setForm(f => ({ ...f, priorite: e.target.value }))} style={IS}>
              <option value="normale">Priorité normale</option>
              <option value="haute">🔴 Haute priorité</option>
            </select>
            <textarea value={form.texte} onChange={e => setForm(f => ({ ...f, texte: e.target.value }))}
              placeholder="Texte de la consigne..." rows={4}
              style={{ ...IS, resize: "none" }} />
            <button onClick={ajouter} style={{
              background: "#dc2626", color: "#fff", border: "none", borderRadius: 14,
              padding: "16px", fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: "inherit"
            }}>Publier la consigne</button>
          </div>
        </div>
      )}

      {/* ── Liste des consignes ── */}
      <div style={{ padding: "14px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>

        {liste.length === 0 && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "36px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 36, marginBottom: 10 }}>{themeActif === "archives" ? "🗂" : "✅"}</p>
            <p style={{ color: "#475569", fontSize: 16, margin: 0 }}>
              {themeActif === "archives" ? "Aucune consigne archivée" : "Aucune consigne active"}
            </p>
            {themeActif === "archives" && (
              <p style={{ color: "#334155", fontSize: 13, margin: "8px 0 0" }}>Les consignes validées ✓ apparaîtront ici</p>
            )}
          </div>
        )}

        {liste.map(c => {
          const th = getTheme(c.theme);
          const isArchive = themeActif === "archives" || c.lu;
          return (
            <div key={c.id} style={{
              background: c.priorite === "haute" && !isArchive ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${c.priorite === "haute" && !isArchive ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.09)"}`,
              borderLeft: `5px solid ${c.priorite === "haute" && !isArchive ? "#ef4444" : th.color}`,
              borderRadius: 18, padding: "16px 16px",
              opacity: isArchive ? 0.7 : 1
            }}>
              {/* Méta */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: "#64748b", fontFamily: "monospace", fontWeight: 700 }}>{c.heure}</span>
                    {c.priorite === "haute" && !isArchive && (
                      <span style={{ background: "rgba(239,68,68,0.2)", color: "#f87171", borderRadius: 8, fontSize: 12, fontWeight: 800, padding: "2px 10px" }}>🔴 URGENT</span>
                    )}
                    <span style={{ background: th.color + "22", color: th.color, borderRadius: 8, fontSize: 12, fontWeight: 700, padding: "2px 10px" }}>{th.icon} {th.label}</span>
                    {isArchive && <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", borderRadius: 8, fontSize: 12, fontWeight: 700, padding: "2px 10px" }}>✓ Validée</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#64748b", fontWeight: 600 }}>{c.auteur}</p>
                </div>
              </div>

              {/* Texte */}
              <p style={{ margin: "0 0 14px", color: isArchive ? "#94a3b8" : "#f1f5f9", fontSize: 16, lineHeight: 1.6, fontWeight: 500 }}>{c.texte}</p>

              {/* Boutons d'action */}
              <div style={{ display: "flex", gap: 10 }}>
                {!isArchive && (
                  <button onClick={() => marquerLu(c.id)} style={{
                    flex: 1, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)",
                    color: "#22c55e", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 800,
                    cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}>✓ Valider</button>
                )}
                {isArchive && (
                  <button onClick={() => desarchiver(c.id)} style={{
                    flex: 1, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.35)",
                    color: "#3b82f6", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 800,
                    cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}>↩ Remettre</button>
                )}
                <button onClick={() => supprimer(c.id)} style={{
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                  color: "#ef4444", borderRadius: 12, padding: "12px 18px", fontSize: 20,
                  cursor: "pointer", fontFamily: "inherit"
                }}>🗑</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Navigation bas (mobile) ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "#1e293b", borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: "8px 4px 12px",
        display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 2
      }}>
        {TABS.map(t => {
          const isActif = themeActif === t.key;
          return (
            <button key={t.key} onClick={() => { setThemeActif(t.key); setShowForm(false); }} style={{
              background: isActif ? t.color + "22" : "transparent",
              border: "none", borderRadius: 10,
              padding: "6px 2px", cursor: "pointer", fontFamily: "inherit",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              borderTop: `2px solid ${isActif ? t.color : "transparent"}`,
              transition: "all 0.15s"
            }}>
              <div style={{ position: "relative" }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                {t.count > 0 && (
                  <span style={{
                    position: "absolute", top: -4, right: -6,
                    background: t.key === "archives" ? "#475569" : "#ef4444",
                    color: "#fff", borderRadius: 999, fontSize: 9, fontWeight: 900,
                    padding: "1px 4px", minWidth: 14, textAlign: "center"
                  }}>{t.count}</span>
                )}
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: isActif ? t.color : "#475569", textAlign: "center", lineHeight: 1.2 }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
