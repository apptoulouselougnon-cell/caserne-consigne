import { useState, useEffect } from "react";

// ─── Données initiales ────────────────────────────────────────────────────────
const INITIAL_CONSIGNES = [
  { id: 1, heure: "06:00", auteur: "Adj. Martin", texte: "Contrôle des EPI obligatoire avant prise de garde. Vérifier les ARI.", priorite: "haute", lu: false },
  { id: 2, heure: "07:30", auteur: "Lt. Dupont", texte: "Exercice incendie prévu à 14h00. Toutes les équipes concernées.", priorite: "normale", lu: false },
  { id: 3, heure: "08:00", auteur: "Sgt. Lefebvre", texte: "FPT-01 en maintenance préventive jusqu'à 12h. Utiliser FPT-02 en priorité.", priorite: "haute", lu: false },
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

// ─── Composants UI ────────────────────────────────────────────────────────────
function Badge({ children, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      color, background: color + "22", letterSpacing: "0.04em", textTransform: "uppercase"
    }}>{children}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "20px 24px", ...style
    }}>{children}</div>
  );
}

// ─── App principale ───────────────────────────────────────────────────────────
export default function App() {
  const [consignes, setConsignes] = useState(INITIAL_CONSIGNES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ auteur: "", texte: "", priorite: "normale" });
  const [heure, setHeure] = useState("");

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
  const nonLues = consignes.filter(c => !c.lu).length;

  const marquerLu = (id) => setConsignes(c => c.map(x => x.id === id ? { ...x, lu: true } : x));
  const supprimer = (id) => setConsignes(c => c.filter(x => x.id !== id));

  const ajouter = () => {
    if (!form.texte.trim() || !form.auteur.trim()) return;
    const n = new Date();
    const h = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
    setConsignes(c => [{ id: Date.now(), heure: h, ...form, lu: false }, ...c]);
    setForm({ auteur: "", texte: "", priorite: "normale" });
    setShowForm(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#e2e8f0" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b24 0%, #1a1f2e 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 24px", position: "sticky", top: 0, zIndex: 50
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
              }}>🚒</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.02em" }}>CASERNE CONNECT</div>
                <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Consignes journalières</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#ef4444", fontFamily: "monospace" }}>{heure}</div>
              <div style={{ fontSize: 11, color: "#475569" }}>{today}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* Barre d'action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>Consignes du jour</h2>
            {nonLues > 0
              ? <p style={{ margin: "4px 0 0", fontSize: 13, color: "#ef4444" }}>⚠ {nonLues} consigne{nonLues > 1 ? "s" : ""} non lue{nonLues > 1 ? "s" : ""}</p>
              : <p style={{ margin: "4px 0 0", fontSize: 13, color: "#22c55e" }}>✓ Toutes les consignes sont lues</p>
            }
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: "#dc2626", color: "#fff", border: "none", borderRadius: 10,
            padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "inherit"
          }}>+ Nouvelle consigne</button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <Card style={{ border: "1px solid rgba(220,38,38,0.4)", background: "rgba(220,38,38,0.07)", marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 16px", color: "#fca5a5", fontSize: 15 }}>Nouvelle consigne</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                value={form.auteur}
                onChange={e => setForm(f => ({ ...f, auteur: e.target.value }))}
                placeholder="Auteur (ex : Lt. Dupont)"
                style={inputStyle}
              />
              <textarea
                value={form.texte}
                onChange={e => setForm(f => ({ ...f, texte: e.target.value }))}
                placeholder="Texte de la consigne..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <select
                value={form.priorite}
                onChange={e => setForm(f => ({ ...f, priorite: e.target.value }))}
                style={inputStyle}
              >
                <option value="normale">Priorité normale</option>
                <option value="haute">Priorité haute</option>
              </select>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={ajouter} style={{ ...btnStyle, background: "#dc2626" }}>Publier</button>
                <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: "rgba(255,255,255,0.1)" }}>Annuler</button>
              </div>
            </div>
          </Card>
        )}

        {/* Liste des consignes */}
        {consignes.length === 0 && (
          <Card>
            <p style={{ textAlign: "center", color: "#475569", margin: 0 }}>Aucune consigne pour le moment.</p>
          </Card>
        )}

        {consignes.map(c => (
          <Card key={c.id} style={{
            borderLeft: `4px solid ${c.priorite === "haute" ? "#ef4444" : "#475569"}`,
            opacity: c.lu ? 0.55 : 1, transition: "opacity 0.2s", marginBottom: 12
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{c.heure}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>{c.auteur}</span>
                  {c.priorite === "haute" && <Badge color="#ef4444">🔴 Haute priorité</Badge>}
                  {c.lu && <Badge color="#475569">✓ Lu</Badge>}
                </div>
                <p style={{ margin: 0, color: "#e2e8f0", lineHeight: 1.6, fontSize: 15 }}>{c.texte}</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {!c.lu && (
                  <button onClick={() => marquerLu(c.id)} title="Marquer comme lu" style={{
                    background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
                    color: "#22c55e", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14
                  }}>✓</button>
                )}
                <button onClick={() => supprimer(c.id)} title="Supprimer" style={{
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  color: "#ef4444", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14
                }}>✕</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
