import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

const JOBS = [
  { id: 1, title: "Frontend Developer", co: "Nova Tech", type: "Full-time", cat: "Engineering", loc: "Remote", pay: "$70k–90k", e: "💻" },
  { id: 2, title: "Product Designer", co: "Pixel Labs", type: "Full-time", cat: "Design", loc: "Lagos", pay: "$55k–75k", e: "🎨" },
  { id: 3, title: "Data Analyst", co: "Insightly", type: "Full-time", cat: "Data", loc: "Remote", pay: "$60k–80k", e: "📊" },
  { id: 4, title: "Backend Engineer", co: "Nova Tech", type: "Full-time", cat: "Engineering", loc: "Remote", pay: "$80k–110k", e: "🛠️" },
  { id: 5, title: "UX Researcher", co: "Pixel Labs", type: "Contract", cat: "Design", loc: "Remote", pay: "$45/hr", e: "🔍" },
  { id: 6, title: "DevOps Engineer", co: "CloudNine", type: "Full-time", cat: "Engineering", loc: "Remote", pay: "$90k–120k", e: "☁️" },
  { id: 7, title: "Marketing Intern", co: "BrightAds", type: "Internship", cat: "Marketing", loc: "Abuja", pay: "$1.5k/mo", e: "📣" },
];
const CATS = [...new Set(JOBS.map((j) => j.cat))];

const SavedCtx = createContext();
function useSaved() { return useContext(SavedCtx); }

function List() {
  const { saved, toggle } = useSaved();
  const [q, setQ] = useState("");
  const [cats, setCats] = useState([]);
  const [onlySaved, setOnlySaved] = useState(false);
  const shown = useMemo(() => JOBS.filter((j) =>
    (!q || (j.title + j.co).toLowerCase().includes(q.toLowerCase())) &&
    (!cats.length || cats.includes(j.cat)) &&
    (!onlySaved || saved.includes(j.id))
  ), [q, cats, onlySaved, saved]);

  return (
    <div className="wrap" style={{ padding: "26px 20px" }}>
      <h1 style={{ fontSize: "1.7rem", marginBottom: 4 }}>Find your next role</h1>
      <p className="muted" style={{ marginBottom: 18 }}>{saved.length} saved job(s).</p>
      <div className="grid" style={{ gridTemplateColumns: "230px 1fr", gap: 24, alignItems: "start" }}>
        <aside className="card pad">
          <input className="input" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 14 }} />
          <h4 style={{ marginBottom: 8 }}>Category</h4>
          {CATS.map((c) => (
            <label key={c} className="flex items gap" style={{ padding: "4px 0", fontSize: ".9rem", cursor: "pointer" }}>
              <input type="checkbox" checked={cats.includes(c)} onChange={() => setCats((s) => s.includes(c) ? s.filter((x) => x !== c) : [...s, c])} /> {c}
            </label>
          ))}
          <label className="flex items gap" style={{ padding: "10px 0 0", fontSize: ".9rem", cursor: "pointer" }}>
            <input type="checkbox" checked={onlySaved} onChange={(e) => setOnlySaved(e.target.checked)} /> Saved only
          </label>
        </aside>
        <div className="grid" style={{ gap: 12 }}>
          <b className="muted">{shown.length} job(s)</b>
          {shown.map((j) => (
            <div key={j.id} className="card pad flex items gap">
              <div style={{ width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", background: "linear-gradient(135deg,var(--brand),#222c44)", flex: "none" }}>{j.e}</div>
              <div style={{ flex: 1 }}>
                <Link to={"/job/" + j.id} style={{ fontWeight: 700 }}>{j.title}</Link>
                <div className="muted" style={{ fontSize: ".86rem" }}>{j.co} · 📍 {j.loc}</div>
                <div className="flex gap wrapf" style={{ marginTop: 6 }}><span className="badge brand">{j.type}</span><span className="badge ok">{j.pay}</span></div>
              </div>
              <button className="btn sm" onClick={() => toggle(j.id)}>{saved.includes(j.id) ? "★ Saved" : "☆ Save"}</button>
            </div>
          ))}
          {!shown.length && <div className="card pad center muted">No jobs match your filters.</div>}
        </div>
      </div>
    </div>
  );
}

function Detail() {
  const { id } = useParams(); const nav = useNavigate();
  const { saved, toggle } = useSaved();
  const j = JOBS.find((x) => x.id === Number(id));
  if (!j) return <div className="wrap" style={{ padding: 30 }}>Not found. <Link to="/">Back</Link></div>;
  return (
    <div className="wrap" style={{ padding: "26px 20px", maxWidth: 720 }}>
      <button className="btn sm" onClick={() => nav(-1)}>← Back</button>
      <div className="card pad" style={{ marginTop: 16 }}>
        <div className="flex items gap" style={{ marginBottom: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", background: "linear-gradient(135deg,var(--brand),#222c44)" }}>{j.e}</div>
          <div><h1 style={{ fontSize: "1.5rem" }}>{j.title}</h1><div className="muted">{j.co} · 📍 {j.loc} · {j.type}</div></div>
        </div>
        <div className="flex gap wrapf" style={{ marginBottom: 14 }}><span className="badge brand">{j.cat}</span><span className="badge ok">{j.pay}</span></div>
        <p>We're hiring a {j.title} to join {j.co}. You'll ship high-impact work with a supportive team. Strong fundamentals and good communication required.</p>
        <ul style={{ margin: "12px 0 0 18px", color: "var(--muted)" }}><li>Competitive pay ({j.pay})</li><li>{j.loc === "Remote" ? "Fully remote" : "Hybrid"}</li><li>Learning budget</li></ul>
        <div className="flex gap" style={{ marginTop: 18 }}>
          <button className="btn primary" onClick={() => alert("Application submitted! (demo)")}>Apply now</button>
          <button className="btn" onClick={() => toggle(j.id)}>{saved.includes(j.id) ? "★ Saved" : "☆ Save"}</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem("roles_saved")) || []; } catch { return []; } });
  useEffect(() => { try { localStorage.setItem("roles_saved", JSON.stringify(saved)); } catch {} }, [saved]);
  const toggle = (id) => setSaved((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  return (
    <SavedCtx.Provider value={{ saved, toggle }}>
      <HashRouter>
        <nav className="nav"><div className="wrap"><Link to="/" className="brand">Roles<span>.</span></Link></div></nav>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/job/:id" element={<Detail />} />
        </Routes>
      </HashRouter>
    </SavedCtx.Provider>
  );
}
