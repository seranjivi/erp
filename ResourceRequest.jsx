import { useState } from "react";

const COLORS = {
  primary: "#1a56db", primaryDark: "#1e429f", primaryLight: "#ebf5ff",
  accent: "#0ea5e9", success: "#10b981", warning: "#f59e0b",
  danger: "#ef4444", purple: "#8b5cf6", orange: "#f97316",
  surface: "#ffffff", bg: "#f8fafc", border: "#e2e8f0",
  text: "#0f172a", textMid: "#475569", textLight: "#94a3b8",
  sidebar: "#0f172a",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: ${COLORS.bg}; color: ${COLORS.text}; }
  input, select, textarea, button { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  .fade-in { animation: fadeIn 0.22s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  .hover-row:hover { background: #f8fafc !important; }
  .nav-item:hover { background: rgba(255,255,255,0.08) !important; }
  .nav-item.active { background: rgba(26,86,219,0.85) !important; }
  .btn-primary { background:${COLORS.primary}; color:#fff; border:none; border-radius:8px; padding:9px 20px; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.15s; }
  .btn-primary:hover { background:${COLORS.primaryDark}; }
  .btn-success { background:${COLORS.success}; color:#fff; border:none; border-radius:8px; padding:9px 18px; font-size:13.5px; font-weight:600; cursor:pointer; }
  .btn-ghost { background:transparent; color:${COLORS.textMid}; border:1.5px solid ${COLORS.border}; border-radius:8px; padding:8px 16px; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.15s; }
  .btn-ghost:hover { border-color:${COLORS.primary}; color:${COLORS.primary}; }
  .btn-danger { background:#fef2f2; color:${COLORS.danger}; border:1.5px solid #fecaca; border-radius:8px; padding:7px 14px; font-size:13px; font-weight:600; cursor:pointer; }
  .card { background:#fff; border-radius:12px; border:1px solid ${COLORS.border}; }
  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.3px; white-space:nowrap; }
  .input-field { width:100%; border:1.5px solid ${COLORS.border}; border-radius:8px; padding:9px 13px; font-size:14px; color:${COLORS.text}; outline:none; transition:border 0.15s; background:#fff; }
  .input-field:focus { border-color:${COLORS.primary}; box-shadow:0 0 0 3px rgba(26,86,219,0.08); }
  select.input-field { cursor:pointer; }
  .label { font-size:13px; font-weight:600; color:${COLORS.textMid}; margin-bottom:6px; display:block; }
  .section-title { font-size:12px; font-weight:700; color:${COLORS.textLight}; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid ${COLORS.border}; }
  .skill-tag { display:inline-flex; align-items:center; gap:6px; background:${COLORS.primaryLight}; color:${COLORS.primary}; border-radius:20px; padding:4px 12px; font-size:12.5px; font-weight:600; }
  .skill-tag-remove { background:none; border:none; cursor:pointer; color:${COLORS.primary}; display:flex; align-items:center; padding:0; }
  .tab-pill { padding:7px 16px; border-radius:8px; font-size:13.5px; font-weight:500; cursor:pointer; transition:all 0.15s; color:${COLORS.textMid}; border:none; background:transparent; }
  .tab-pill.active { background:${COLORS.primary}; color:#fff; }
  .tab-pill:hover:not(.active) { background:${COLORS.bg}; color:${COLORS.text}; }
  .step-connector { flex:1; height:2px; margin:0 6px; margin-bottom:18px; }
  .modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.45); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
  .modal-box { background:#fff; border-radius:16px; max-width:640px; width:100%; max-height:90vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,0.2); }
  .slide-in { animation: slideIn 0.2s ease; }
  @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
  .kanban-col { background:${COLORS.bg}; border-radius:12px; padding:14px; min-width:200px; flex:1; }
  .res-card { border:2px solid ${COLORS.border}; border-radius:12px; padding:16px; background:#fff; transition:all 0.15s; }
  .res-card:hover { border-color:${COLORS.primary}; box-shadow:0 4px 16px rgba(26,86,219,0.08); }
  .res-card.selected { border-color:${COLORS.primary}; background:${COLORS.primaryLight}; }
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    folder:    <><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    users:     <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    bell:      <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    logout:    <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    trending:  <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    check:     <><polyline points="20 6 9 17 4 12"/></>,
    alert:     <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    calendar:  <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    edit:      <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    info:      <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    layers:    <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    dollar:    <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
    list:      <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    grid:      <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    send:      <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    copy:      <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    hiring:    <><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></>,
    approval:  <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    chevDown:  <><polyline points="6 9 12 15 18 9"/></>,
    chevRight: <><polyline points="9 18 15 12 9 6"/></>,
    download:  <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    more:      <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
    bench:     <><rect x="2" y="7" width="20" height="3" rx="1"/><path d="M5 10v7"/><path d="M19 10v7"/><path d="M3 17h18"/></>,
    person:    <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    resource:  <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="19" y1="8" x2="23" y2="8"/><line x1="21" y1="6" x2="21" y2="10"/></>,
    zap:       <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    tag:       <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    percent:   <><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>,
    link:      <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    refresh:   <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    "Draft":              { bg:"#faf5ff", color:"#6b21a8" },
    "Pending Finance":    { bg:"#fff7ed", color:"#9a3412" },
    "Pending Approval":   { bg:"#fef9c3", color:"#854d0e" },
    "Approved":           { bg:"#dcfce7", color:"#166534" },
    "Resource Assigned":  { bg:"#ecfdf5", color:"#065f46" },
    "Active":             { bg:"#eff6ff", color:"#1e40af" },
    "Partially Filled":   { bg:"#fff7ed", color:"#9a3412" },
    "Completed":          { bg:"#dcfce7", color:"#166534" },
    "On Hold":            { bg:"#f1f5f9", color:"#475569" },
    "Cancelled":          { bg:"#fef2f2", color:"#991b1b" },
    "Rejected":           { bg:"#fef2f2", color:"#991b1b" },
    "Critical":           { bg:"#fef2f2", color:"#991b1b" },
    "High":               { bg:"#fff1f2", color:"#be123c" },
    "Medium":             { bg:"#fff7ed", color:"#c2410c" },
    "Low":                { bg:"#f0fdf4", color:"#166534" },
    "Internal Staff":     { bg:"#eff6ff", color:"#1e40af" },
    "Bench":              { bg:"#faf5ff", color:"#6b21a8" },
    "External Contractor":{ bg:"#fff7ed", color:"#9a3412" },
    "Vendor":             { bg:"#fefce8", color:"#713f12" },
    "Mixed":              { bg:"#f0fdf4", color:"#065f46" },
    "Billable":           { bg:"#dcfce7", color:"#166534" },
    "Non-Billable":       { bg:"#f1f5f9", color:"#475569" },
    "Cost Center":        { bg:"#eff6ff", color:"#1e40af" },
    "T&M":                { bg:"#faf5ff", color:"#6b21a8" },
    "Fixed Price":        { bg:"#eff6ff", color:"#1e40af" },
  };
  const s = map[status] || { bg:"#f1f5f9", color:"#475569" };
  return <span className="badge" style={{ background:s.bg, color:s.color }}>{status}</span>;
};

const Avatar = ({ name, size = 32, bg = COLORS.primary }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size * 0.35, fontWeight:700, flexShrink:0 }}>
      {initials}
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage }) => {
  const nav = [
    { id:"dashboard",   label:"Dashboard",          icon:"dashboard" },
    { id:"projects",    label:"My Projects",         icon:"folder" },
    { id:"create",      label:"New Project",         icon:"plus" },
    { id:"hiring",      label:"Hiring Requests",     icon:"hiring" },
    { id:"resources",   label:"Resource Requests",   icon:"resource" },
    { id:"createRR",    label:"New Resource Request", icon:"person" },
    { id:"bench",       label:"Bench / Talent",      icon:"bench" },
    { id:"approvals",   label:"Approvals",           icon:"approval" },
    { id:"team",        label:"My Team",             icon:"users" },
    { id:"reports",     label:"Reports",             icon:"trending" },
  ];
  return (
    <div style={{ width:224, background:COLORS.sidebar, height:"100vh", position:"fixed", top:0, left:0, display:"flex", flexDirection:"column", zIndex:100, flexShrink:0 }}>
      <div style={{ padding:"22px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, background:COLORS.primary, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="layers" size={17} color="#fff" />
          </div>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:14.5 }}>StaffSync</div>
            <div style={{ color:COLORS.textLight, fontSize:10.5, fontWeight:500 }}>Enterprise PM</div>
          </div>
        </div>
      </div>
      <div style={{ padding:"12px 14px 8px" }}>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:9, padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
          <Avatar name="Ravi Shankar" size={30} />
          <div>
            <div style={{ color:"#fff", fontSize:13, fontWeight:600 }}>Ravi Shankar</div>
            <div style={{ color:COLORS.textLight, fontSize:11 }}>Project Manager</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:"6px 10px", overflowY:"auto", display:"flex", flexDirection:"column", gap:1 }}>
        <div style={{ color:"rgba(255,255,255,0.28)", fontSize:10, fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase", padding:"8px 8px 4px" }}>Navigation</div>
        {nav.map(n => (
          <div key={n.id} className={`nav-item${page === n.id ? " active" : ""}`} onClick={() => setPage(n.id)}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, cursor:"pointer", color:page === n.id ? "#fff" : "rgba(255,255,255,0.52)", fontSize:13.5, fontWeight:500, transition:"all 0.12s" }}>
            <Icon name={n.icon} size={15} color={page === n.id ? "#fff" : "rgba(255,255,255,0.45)"} />
            {n.label}
            {n.id === "resources" && <span style={{ marginLeft:"auto", background:COLORS.danger, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10.5, fontWeight:700 }}>8</span>}
          </div>
        ))}
      </nav>
      <div style={{ padding:"10px 10px 18px", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", flexDirection:"column", gap:1 }}>
        {[{ id:"settings", label:"Settings", icon:"settings" }, { id:"login", label:"Sign Out", icon:"logout" }].map(n => (
          <div key={n.id} className="nav-item" onClick={() => setPage(n.id)}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:8, cursor:"pointer", color:"rgba(255,255,255,0.45)", fontSize:13 }}>
            <Icon name={n.icon} size={14} color="rgba(255,255,255,0.38)" />
            {n.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const TopBar = ({ title, subtitle, actions, breadcrumb }) => (
  <div style={{ background:"#fff", borderBottom:`1px solid ${COLORS.border}`, padding:"13px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
    <div>
      {breadcrumb && <div style={{ fontSize:11.5, color:COLORS.textLight, marginBottom:2 }}>{breadcrumb}</div>}
      <div style={{ fontSize:18, fontWeight:700, color:COLORS.text }}>{title}</div>
      {subtitle && <div style={{ fontSize:12.5, color:COLORS.textLight, marginTop:1 }}>{subtitle}</div>}
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ position:"relative" }}>
        <input className="input-field" placeholder="Search…" style={{ paddingLeft:34, paddingTop:7, paddingBottom:7, width:196, background:COLORS.bg }} />
        <div style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}><Icon name="search" size={14} color={COLORS.textLight} /></div>
      </div>
      <button style={{ background:"none", border:"none", cursor:"pointer", position:"relative", padding:6 }}>
        <Icon name="bell" size={18} color={COLORS.textMid} />
        <span style={{ position:"absolute", top:4, right:4, width:8, height:8, background:COLORS.danger, borderRadius:"50%", border:"2px solid #fff" }} />
      </button>
      <Avatar name="Ravi Shankar" size={32} />
      {actions}
    </div>
  </div>
);

// ─── SKILL TAG INPUT ──────────────────────────────────────────────────────────
const SkillTagInput = ({ skills, setSkills, placeholder = "Type skill and press Enter…" }) => {
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim();
    if (val && !skills.includes(val)) setSkills([...skills, val]);
    setInput("");
  };
  const remove = (s) => setSkills(skills.filter(x => x !== s));
  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"8px 10px", border:`1.5px solid ${COLORS.border}`, borderRadius:8, background:"#fff", minHeight:44 }}>
        {skills.map(s => (
          <span key={s} className="skill-tag">
            {s}
            <button className="skill-tag-remove" onClick={() => remove(s)}><Icon name="x" size={12} /></button>
          </span>
        ))}
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder={skills.length === 0 ? placeholder : "Add more…"}
          style={{ border:"none", outline:"none", fontSize:13.5, flex:1, minWidth:120, background:"transparent" }} />
      </div>
      <div style={{ fontSize:11.5, color:COLORS.textLight, marginTop:4 }}>Press Enter or comma to add · Click × to remove</div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// PAGE 1: CREATE / EDIT RESOURCE REQUEST
// ════════════════════════════════════════════════════════════════════════════
const CreateResourceRequest = ({ setPage, editData = null }) => {
  const isEdit = !!editData;
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showTalentModal, setShowTalentModal] = useState(false);
  const [talentFilter, setTalentFilter] = useState("All");
  const [selectedTalent, setSelectedTalent] = useState(editData?.preferredResources || []);

  const [roles, setRoles] = useState(editData?.roles || [{
    id: 1, role: "", resourceType: "Internal Staff", department: "", skills: [],
    count: 1, allocation: "100%", experience: "Mid-Level (3–5 yrs)",
    workMode: "Hybrid", shift: "General (9–6)", duration: "",
    engagementType: "T&M", billingMode: "Billable",
    dailyRate: "", currency: "INR", remarks: "",
  }]);

  const [form, setForm] = useState(editData || {
    project: "PRJ-002 – ERP Implementation",
    requestTitle: "",
    requestedBy: "Ravi Shankar",
    requestDate: "2026-03-06",
    startDate: "", endDate: "",
    priority: "High",
    purpose: "Project Staffing",
    businessJustification: "",
    budgetRef: "",
    costCenter: "",
    financeApprover: "Meena Krishnan (Finance Manager)",
    mgmtApprover: "Suresh Babu (Delivery Head)",
    hrOwner: "Priya Iyer (HR Lead)",
    additionalNotes: "",
  });

  const updateForm = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updateRole = (id, k, v) => setRoles(rs => rs.map(r => r.id === id ? { ...r, [k]: v } : r));
  const addRole = () => setRoles(rs => [...rs, {
    id: Date.now(), role: "", resourceType: "Internal Staff", department: "", skills: [],
    count: 1, allocation: "100%", experience: "Mid-Level (3–5 yrs)",
    workMode: "Hybrid", shift: "General (9–6)", duration: "",
    engagementType: "T&M", billingMode: "Billable",
    dailyRate: "", currency: "INR", remarks: "",
  }]);
  const removeRole = (id) => setRoles(rs => rs.filter(r => r.id !== id));

  const totalHeadcount = roles.reduce((a, r) => a + (parseInt(r.count) || 0), 0);

  const steps = [
    { n:1, label:"Request Details" },
    { n:2, label:"Roles & Skills" },
    { n:3, label:"Budget & Rates" },
    { n:4, label:"Preferred Resources" },
    { n:5, label:"Approval Routing" },
    { n:6, label:"Review & Submit" },
  ];

  const Field = ({ label, required, half, children, hint }) => (
    <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
      <label className="label">{label}{required && <span style={{ color:COLORS.danger }}> *</span>}</label>
      {children}
      {hint && <div style={{ fontSize:11.5, color:COLORS.textLight, marginTop:4 }}>{hint}</div>}
    </div>
  );
  const Sel = ({ val, onChange, options }) => (
    <select className="input-field" value={val} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
  const Inp = ({ val, onChange, placeholder, type="text" }) => (
    <input className="input-field" type={type} value={val} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
  );

  const talentPool = [
    { name:"Arun Venkat",  role:"React Developer",    exp:"4 yrs", skills:["React","TypeScript","Node.js"],           available:"Immediate", type:"Bench",               allocation:"100%" },
    { name:"Sneha Pillai", role:"Business Analyst",   exp:"6 yrs", skills:["BPMN","Agile","SQL"],                    available:"2 weeks",   type:"Internal Staff",      allocation:"50%" },
    { name:"Kiran Desai",  role:"QA Engineer",        exp:"3 yrs", skills:["Selenium","JIRA","API Testing"],          available:"Immediate", type:"Bench",               allocation:"100%" },
    { name:"Meena Roy",    role:"Java Developer",     exp:"5 yrs", skills:["Spring Boot","Microservices","AWS"],      available:"1 week",    type:"External Contractor", allocation:"100%" },
    { name:"Raj Mohan",    role:"DevOps Engineer",    exp:"7 yrs", skills:["Kubernetes","Terraform","CI/CD"],         available:"Immediate", type:"Vendor",              allocation:"75%" },
    { name:"Priya Nair",   role:"UI/UX Designer",     exp:"4 yrs", skills:["Figma","Design Systems","CSS"],           available:"3 weeks",   type:"Internal Staff",      allocation:"50%" },
    { name:"Arjun Menon",  role:"Data Engineer",      exp:"5 yrs", skills:["Python","Spark","dbt","Databricks"],      available:"Immediate", type:"Bench",               allocation:"100%" },
    { name:"Lakshmi Iyer", role:"Project Coordinator",exp:"3 yrs", skills:["JIRA","Confluence","Agile","Reporting"],  available:"1 week",    type:"Internal Staff",      allocation:"25%" },
  ];
  const bgForType = (t) => t === "Internal Staff" ? COLORS.primary : t === "Bench" ? COLORS.purple : t === "Vendor" ? COLORS.orange : COLORS.accent;

  if (submitted) return (
    <div className="fade-in" style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"78vh", flexDirection:"column", gap:20 }}>
      <div style={{ width:76, height:76, background:"#dcfce7", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name="check" size={34} color={COLORS.success} />
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:24, fontWeight:800, color:COLORS.text }}>{isEdit ? "Request Updated!" : "Resource Request Submitted!"}</div>
        <div style={{ fontSize:15, color:COLORS.textMid, marginTop:6 }}>
          {isEdit ? `${editData.id} has been updated successfully.` : "RR-019 has been created and sent to Finance for budget approval."}
        </div>
        <div style={{ marginTop:16, display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"8px 16px", fontSize:13, color:COLORS.success, fontWeight:600 }}>
            <Icon name="check" size={14} color={COLORS.success} />Submitted to Finance: Meena Krishnan
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:8, padding:"8px 16px", fontSize:13, color:COLORS.primary, fontWeight:600 }}>
            <Icon name="clock" size={14} color={COLORS.primary} />Mgmt Approval: Pending after Finance
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:12 }}>
        <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(1); }}>New Request</button>
        <button className="btn-ghost" onClick={() => setPage("resources")}>View All Requests</button>
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      <style>{css}</style>
      <TopBar
        title={isEdit ? `Edit Resource Request · ${editData.id}` : "New Resource Request"}
        subtitle={isEdit ? "Update allocation details and re-route for approval" : "Define roles, allocation and route for approval"}
        breadcrumb={`Resource Requests › ${isEdit ? "Edit" : "Create New"}`}
      />

      {/* Talent Modal */}
      {showTalentModal && (
        <div className="modal-overlay" onClick={() => setShowTalentModal(false)}>
          <div className="modal-box slide-in" onClick={e => e.stopPropagation()}>
            <div style={{ padding:"22px 24px", borderBottom:`1px solid ${COLORS.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:17, fontWeight:700 }}>Find from Talent Pool</div>
                <div style={{ fontSize:12.5, color:COLORS.textLight, marginTop:2 }}>Internal Staff, Bench & External Contractors</div>
              </div>
              <button style={{ background:"none", border:"none", cursor:"pointer" }} onClick={() => setShowTalentModal(false)}><Icon name="x" size={20} color={COLORS.textMid} /></button>
            </div>
            <div style={{ padding:"16px 24px" }}>
              <div style={{ display:"flex", gap:6, marginBottom:16 }}>
                {["All","Internal Staff","Bench","External Contractor","Vendor"].map(f => (
                  <button key={f} className={`tab-pill${talentFilter === f ? " active" : ""}`} onClick={() => setTalentFilter(f)} style={{ padding:"6px 12px", fontSize:12.5 }}>{f}</button>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {talentPool.filter(b => talentFilter === "All" || b.type === talentFilter).map((b, i) => (
                  <div key={i} className={`res-card${selectedTalent.includes(b.name) ? " selected" : ""}`}
                    style={{ display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}
                    onClick={() => setSelectedTalent(s => s.includes(b.name) ? s.filter(x => x !== b.name) : [...s, b.name])}>
                    <Avatar name={b.name} size={40} bg={bgForType(b.type)} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14 }}>{b.name}</div>
                      <div style={{ fontSize:12.5, color:COLORS.textMid }}>{b.role} · {b.exp}</div>
                      <div style={{ display:"flex", gap:4, marginTop:5, flexWrap:"wrap" }}>
                        {b.skills.map(s => <span key={s} style={{ background:COLORS.bg, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"2px 8px", fontSize:11, color:COLORS.textMid }}>{s}</span>)}
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <Badge status={b.type} />
                      <div style={{ fontSize:11, color:COLORS.textLight, marginTop:4 }}>Avail: {b.available}</div>
                      <div style={{ fontSize:11, color:COLORS.primary, fontWeight:600, marginTop:2 }}>Alloc: {b.allocation}</div>
                    </div>
                    {selectedTalent.includes(b.name) && (
                      <div style={{ width:22, height:22, background:COLORS.primary, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon name="check" size={12} color="#fff" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding:"16px 24px", borderTop:`1px solid ${COLORS.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:13, color:COLORS.textMid }}>{selectedTalent.length} selected</div>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-ghost" onClick={() => setShowTalentModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={() => setShowTalentModal(false)}>Add to Request ({selectedTalent.length})</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding:"22px 28px", maxWidth:900 }}>
        {/* Stepper */}
        <div className="card" style={{ padding:"16px 22px", marginBottom:18, display:"flex", alignItems:"center", overflowX:"auto" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display:"flex", alignItems:"center", flex:1 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer", minWidth:90 }} onClick={() => step > s.n && setStep(s.n)}>
                <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700,
                  background: step > s.n ? COLORS.success : step === s.n ? COLORS.primary : COLORS.bg,
                  color: step >= s.n ? "#fff" : COLORS.textLight,
                  border:`2px solid ${step >= s.n ? (step > s.n ? COLORS.success : COLORS.primary) : COLORS.border}` }}>
                  {step > s.n ? <Icon name="check" size={13} color="#fff" /> : s.n}
                </div>
                <div style={{ fontSize:11, fontWeight:step === s.n ? 700 : 500, color:step === s.n ? COLORS.primary : COLORS.textLight, whiteSpace:"nowrap" }}>{s.label}</div>
              </div>
              {i < steps.length - 1 && <div className="step-connector" style={{ background:step > s.n ? COLORS.success : COLORS.border }} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Request Details ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="card fade-in" style={{ padding:28 }}>
            <div className="section-title">Resource Request Details</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <Field label="Linked Project" required>
                <Sel val={form.project} onChange={v => updateForm("project", v)}
                  options={["PRJ-001 – Fintech Portal Revamp","PRJ-002 – ERP Implementation","PRJ-003 – Mobile App – Retail","PRJ-004 – Data Analytics Platform","PRJ-006 – Cloud Migration Phase 2"]} />
              </Field>
              <Field label="Request Title" required half>
                <Inp val={form.requestTitle} onChange={v => updateForm("requestTitle", v)} placeholder="e.g. Q2 Staffing – ERP Team" />
              </Field>
              <Field label="Requested By" half>
                <Sel val={form.requestedBy} onChange={v => updateForm("requestedBy", v)} options={["Ravi Shankar","Priya Nair","Amit Joshi","Sneha Pillai"]} />
              </Field>
              <Field label="Request Date" half>
                <Inp val={form.requestDate} onChange={v => updateForm("requestDate", v)} type="date" />
              </Field>
              <Field label="Engagement Start Date" required half>
                <Inp val={form.startDate} onChange={v => updateForm("startDate", v)} type="date" />
              </Field>
              <Field label="Engagement End Date" half>
                <Inp val={form.endDate} onChange={v => updateForm("endDate", v)} type="date" />
              </Field>
              <Field label="Request Priority" half>
                <Sel val={form.priority} onChange={v => updateForm("priority", v)} options={["Critical","High","Medium","Low"]} />
              </Field>
              <Field label="Purpose / Category" half>
                <Sel val={form.purpose} onChange={v => updateForm("purpose", v)}
                  options={["Project Staffing","Backfill","Team Augmentation","Specialised Expertise","Transition Support","Bench Utilisation"]} />
              </Field>
              <Field label="Budget Reference / PO" half hint="Reference the approved project budget or PO number">
                <Inp val={form.budgetRef} onChange={v => updateForm("budgetRef", v)} placeholder="e.g. PRJ-002-BUD-001" />
              </Field>
              <Field label="Cost Center" half>
                <Inp val={form.costCenter} onChange={v => updateForm("costCenter", v)} placeholder="e.g. CC-1042" />
              </Field>
              <Field label="Business Justification" required hint="Explain why these resources are required and the impact of delay">
                <textarea className="input-field" rows={4} value={form.businessJustification}
                  placeholder="Describe the project need, skills gap, and business impact of not filling these roles…"
                  onChange={e => updateForm("businessJustification", e.target.value)} style={{ resize:"vertical" }} />
              </Field>
            </div>
          </div>
        )}

        {/* ── STEP 2: Roles & Skills ──────────────────────────────────────────── */}
        {step === 2 && (
          <div className="fade-in">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ fontSize:14, color:COLORS.textMid }}>
                <span style={{ fontWeight:700, color:COLORS.text }}>{roles.length}</span> role type{roles.length > 1 ? "s" : ""} · <span style={{ fontWeight:700, color:COLORS.primary }}>{totalHeadcount}</span> total headcount
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button className="btn-ghost" style={{ fontSize:12.5, padding:"7px 14px" }} onClick={() => setShowTalentModal(true)}>
                  <span style={{ display:"flex", alignItems:"center", gap:6 }}><Icon name="bench" size={14} color={COLORS.textMid} />Find from Talent Pool</span>
                </button>
                <button className="btn-primary" style={{ fontSize:12.5, padding:"7px 14px" }} onClick={addRole}>
                  <span style={{ display:"flex", alignItems:"center", gap:6 }}><Icon name="plus" size={14} color="#fff" />Add Another Role</span>
                </button>
              </div>
            </div>
            {roles.map((pos, idx) => (
              <div key={pos.id} className="card" style={{ padding:22, marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div style={{ fontWeight:700, fontSize:14.5, color:COLORS.primary }}>Role #{idx + 1}</div>
                  {roles.length > 1 && (
                    <button className="btn-danger" style={{ padding:"5px 12px", fontSize:12.5 }} onClick={() => removeRole(pos.id)}>Remove Role</button>
                  )}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <label className="label">Role / Designation <span style={{ color:COLORS.danger }}>*</span></label>
                    <input className="input-field" value={pos.role} onChange={e => updateRole(pos.id, "role", e.target.value)} placeholder="e.g. Senior React Developer" />
                  </div>
                  <div>
                    <label className="label">Resource Type</label>
                    <select className="input-field" value={pos.resourceType} onChange={e => updateRole(pos.id, "resourceType", e.target.value)}>
                      {["Internal Staff","Bench","External Contractor","Vendor","Mixed"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Department / Team</label>
                    <select className="input-field" value={pos.department} onChange={e => updateRole(pos.id, "department", e.target.value)}>
                      <option value="">Select department</option>
                      {["Engineering","QA & Testing","DevOps","UI/UX","Data & Analytics","Business Analysis","Project Management","Finance","HR"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Headcount</label>
                    <input className="input-field" type="number" min={1} value={pos.count} onChange={e => updateRole(pos.id, "count", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Allocation %</label>
                    <select className="input-field" value={pos.allocation} onChange={e => updateRole(pos.id, "allocation", e.target.value)}>
                      {["25%","50%","75%","100%"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Experience Level</label>
                    <select className="input-field" value={pos.experience} onChange={e => updateRole(pos.id, "experience", e.target.value)}>
                      {["Fresher (0 yr)","Junior (1–2 yrs)","Mid-Level (3–5 yrs)","Senior (5–8 yrs)","Lead (8–12 yrs)","Principal (12+ yrs)"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Work Mode</label>
                    <select className="input-field" value={pos.workMode} onChange={e => updateRole(pos.id, "workMode", e.target.value)}>
                      {["Onsite","Remote","Hybrid","Client Site","Offshore"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Shift</label>
                    <select className="input-field" value={pos.shift} onChange={e => updateRole(pos.id, "shift", e.target.value)}>
                      {["General (9–6)","Morning (7–4)","Evening (2–11)","Night (10–7)","Flexible","US Overlap","UK Overlap"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Engagement Type</label>
                    <select className="input-field" value={pos.engagementType} onChange={e => updateRole(pos.id, "engagementType", e.target.value)}>
                      {["T&M","Fixed Price","Retainer","Outcome-Based"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Billing Mode</label>
                    <select className="input-field" value={pos.billingMode} onChange={e => updateRole(pos.id, "billingMode", e.target.value)}>
                      {["Billable","Non-Billable","Cost Center","Internal Transfer"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn:"span 2" }}>
                    <label className="label">Required Skills</label>
                    <SkillTagInput skills={pos.skills} setSkills={v => updateRole(pos.id, "skills", v)} placeholder="e.g. React, TypeScript, Node.js…" />
                  </div>
                  <div style={{ gridColumn:"span 2" }}>
                    <label className="label">Remarks / Special Requirements</label>
                    <textarea className="input-field" rows={2} value={pos.remarks} onChange={e => updateRole(pos.id, "remarks", e.target.value)} placeholder="Any specific certifications, domain knowledge, or constraints…" style={{ resize:"vertical" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 3: Budget & Rates ──────────────────────────────────────────── */}
        {step === 3 && (
          <div className="card fade-in" style={{ padding:28 }}>
            <div className="section-title">Budget & Commercial Details</div>
            <div style={{ background:COLORS.bg, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
              <Icon name="info" size={16} color={COLORS.primary} />
              <div style={{ fontSize:13, color:COLORS.textMid }}>Enter rates per role below. Total cost will be auto-computed based on headcount, allocation, and duration.</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {roles.map((pos, idx) => (
                <div key={pos.id} style={{ border:`1.5px solid ${COLORS.border}`, borderRadius:10, padding:18, background:"#fff" }}>
                  <div style={{ fontWeight:700, fontSize:13.5, color:COLORS.text, marginBottom:14 }}>
                    Role #{idx + 1} — {pos.role || <span style={{ color:COLORS.textLight, fontStyle:"italic" }}>Untitled Role</span>}
                    <span style={{ marginLeft:8 }}><Badge status={pos.resourceType} /></span>
                    <span style={{ marginLeft:8 }}><Badge status={pos.billingMode} /></span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                    <div>
                      <label className="label">Currency</label>
                      <select className="input-field" value={pos.currency} onChange={e => updateRole(pos.id, "currency", e.target.value)}>
                        {["INR","USD","EUR","GBP","SGD","AED"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Daily Rate</label>
                      <input className="input-field" type="number" value={pos.dailyRate} onChange={e => updateRole(pos.id, "dailyRate", e.target.value)} placeholder="e.g. 8000" />
                    </div>
                    <div>
                      <label className="label">Engagement Duration</label>
                      <input className="input-field" value={pos.duration} onChange={e => updateRole(pos.id, "duration", e.target.value)} placeholder="e.g. 3 months" />
                    </div>
                    <div>
                      <label className="label">Est. Total Cost</label>
                      <div style={{ height:40, border:`1.5px solid ${COLORS.border}`, borderRadius:8, padding:"8px 13px", fontSize:14, fontWeight:700, color: pos.dailyRate ? COLORS.primary : COLORS.textLight, background:COLORS.bg }}>
                        {pos.dailyRate ? `${pos.currency} ${(parseFloat(pos.dailyRate) * (parseInt(pos.count)||1) * 22).toLocaleString()}` : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:20, padding:"14px 18px", background:COLORS.primaryLight, borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:13.5, fontWeight:600, color:COLORS.primary }}>Estimated Total Request Budget</div>
              <div style={{ fontSize:20, fontWeight:800, color:COLORS.primary }}>
                {roles.some(r => r.dailyRate)
                  ? `INR ${roles.reduce((a, r) => a + (parseFloat(r.dailyRate)||0) * (parseInt(r.count)||1) * 22, 0).toLocaleString()}`
                  : "—"}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Preferred Resources ─────────────────────────────────────── */}
        {step === 4 && (
          <div className="fade-in">
            <div className="card" style={{ padding:"14px 18px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:14 }}>Preferred Resources <span style={{ color:COLORS.textLight, fontWeight:400, fontSize:13 }}>(Optional)</span></div>
                <div style={{ fontSize:12.5, color:COLORS.textLight, marginTop:2 }}>Tag specific people from the talent pool if you have preferences. HR will use this as a guide.</div>
              </div>
              <button className="btn-primary" style={{ fontSize:12.5, padding:"7px 16px" }} onClick={() => setShowTalentModal(true)}>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}><Icon name="bench" size={14} color="#fff" />Browse Talent Pool</span>
              </button>
            </div>

            {selectedTalent.length === 0 ? (
              <div className="card" style={{ padding:"48px 20px", textAlign:"center" }}>
                <Icon name="users" size={32} color={COLORS.border} />
                <div style={{ marginTop:12, color:COLORS.textLight, fontSize:14 }}>No preferred resources selected.</div>
                <div style={{ fontSize:12.5, color:COLORS.textLight, marginTop:4 }}>HR will allocate available resources from the pool based on skill match.</div>
                <button className="btn-ghost" style={{ marginTop:14 }} onClick={() => setShowTalentModal(true)}>Browse Talent Pool</button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {talentPool.filter(b => selectedTalent.includes(b.name)).map((b, i) => (
                  <div key={i} className="card" style={{ padding:16, display:"flex", alignItems:"center", gap:14 }}>
                    <Avatar name={b.name} size={42} bg={bgForType(b.type)} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14 }}>{b.name}</div>
                      <div style={{ fontSize:12.5, color:COLORS.textMid }}>{b.role} · {b.exp}</div>
                      <div style={{ display:"flex", gap:4, marginTop:5, flexWrap:"wrap" }}>
                        {b.skills.map(s => <span key={s} style={{ background:COLORS.bg, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"2px 8px", fontSize:11, color:COLORS.textMid }}>{s}</span>)}
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0, marginRight:8 }}>
                      <Badge status={b.type} />
                      <div style={{ fontSize:11.5, color:COLORS.textLight, marginTop:4 }}>Available: {b.available}</div>
                      <div style={{ fontSize:11.5, color:COLORS.primary, fontWeight:600, marginTop:2 }}>Max Alloc: {b.allocation}</div>
                    </div>
                    <button onClick={() => setSelectedTalent(s => s.filter(x => x !== b.name))} style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"6px 12px", cursor:"pointer", color:COLORS.danger, fontSize:12.5, fontWeight:600 }}>Remove</button>
                  </div>
                ))}
                <div style={{ marginTop:8, display:"flex", justifyContent:"flex-end" }}>
                  <button className="btn-ghost" style={{ fontSize:12.5 }} onClick={() => setShowTalentModal(true)}>
                    <span style={{ display:"flex", alignItems:"center", gap:5 }}><Icon name="plus" size={13} />Add More</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 5: Approval Routing ─────────────────────────────────────────── */}
        {step === 5 && (
          <div className="card fade-in" style={{ padding:28 }}>
            <div className="section-title">Approval & Ownership</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
              <div style={{ gridColumn:"span 2" }}>
                <label className="label">Approval Route</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {[
                    { label:"Finance Approval", desc:"Required for external / vendor / contractor resources" },
                    { label:"Delivery Head Approval", desc:"Required for all requests above 50% allocation" },
                    { label:"HR Review", desc:"Mandatory for all requests" },
                    { label:"PMO Sign-off", desc:"Required for cross-project resource sharing" },
                  ].map(r => (
                    <div key={r.label} style={{ border:`1.5px solid ${COLORS.border}`, borderRadius:10, padding:"12px 16px", flex:"1 0 calc(50% - 8px)", background:COLORS.bg }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <div style={{ width:14, height:14, background:COLORS.primary, borderRadius:3, flexShrink:0 }}></div>
                        <div style={{ fontSize:13.5, fontWeight:600, color:COLORS.text }}>{r.label}</div>
                      </div>
                      <div style={{ fontSize:12, color:COLORS.textLight, paddingLeft:22 }}>{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Finance Approver</label>
                <select className="input-field" value={form.financeApprover} onChange={e => updateForm("financeApprover", e.target.value)}>
                  {["Meena Krishnan (Finance Manager)","Rakesh Gupta (CFO)","Nalini Iyer (Finance Lead)"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Delivery Head / Mgmt Approver</label>
                <select className="input-field" value={form.mgmtApprover} onChange={e => updateForm("mgmtApprover", e.target.value)}>
                  {["Suresh Babu (Delivery Head)","Kavitha Reddy (VP Delivery)","Tom Ashby (Engagement Manager)"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="label">HR Owner</label>
                <select className="input-field" value={form.hrOwner} onChange={e => updateForm("hrOwner", e.target.value)}>
                  {["Priya Iyer (HR Lead)","Sunita Mehta (Talent Manager)","Karthik Nair (HR BP)"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Additional Notes for Approvers</label>
                <textarea className="input-field" rows={3} value={form.additionalNotes} onChange={e => updateForm("additionalNotes", e.target.value)} placeholder="Any context the approvers should be aware of…" style={{ resize:"vertical" }} />
              </div>
            </div>
            {/* Approval flow visualiser */}
            <div style={{ background:COLORS.bg, borderRadius:10, padding:"16px 20px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:COLORS.textLight, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:14 }}>Approval Flow Preview</div>
              <div style={{ display:"flex", alignItems:"center", gap:4, overflowX:"auto" }}>
                {[
                  { label:"You (PM)", sub:"Submitter", color:COLORS.primary },
                  { label:"Finance", sub:form.financeApprover.split(" (")[0], color:COLORS.warning },
                  { label:"Mgmt", sub:form.mgmtApprover.split(" (")[0], color:COLORS.purple },
                  { label:"HR", sub:form.hrOwner.split(" (")[0], color:COLORS.accent },
                  { label:"Approved", sub:"Final", color:COLORS.success },
                ].map((node, i, arr) => (
                  <div key={node.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, minWidth:70 }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:node.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon name={i === arr.length - 1 ? "check" : "person"} size={15} color="#fff" />
                      </div>
                      <div style={{ fontSize:11.5, fontWeight:700, color:COLORS.text }}>{node.label}</div>
                      <div style={{ fontSize:10.5, color:COLORS.textLight, whiteSpace:"nowrap" }}>{node.sub}</div>
                    </div>
                    {i < arr.length - 1 && <div style={{ flex:1, height:2, background:COLORS.border, minWidth:20 }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 6: Review & Submit ──────────────────────────────────────────── */}
        {step === 6 && (
          <div className="fade-in">
            <div className="card" style={{ padding:24, marginBottom:14 }}>
              <div className="section-title">Request Summary</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { l:"Project", v:form.project },
                  { l:"Request Title", v:form.requestTitle || "—" },
                  { l:"Requested By", v:form.requestedBy },
                  { l:"Priority", v:form.priority },
                  { l:"Purpose", v:form.purpose },
                  { l:"Start Date", v:form.startDate || "—" },
                  { l:"End Date", v:form.endDate || "—" },
                  { l:"Cost Center", v:form.costCenter || "—" },
                  { l:"Budget Ref", v:form.budgetRef || "—" },
                  { l:"Total Headcount", v:totalHeadcount },
                ].map(f => (
                  <div key={f.l} style={{ background:COLORS.bg, borderRadius:8, padding:"10px 14px", border:`1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize:11, color:COLORS.textLight, marginBottom:3 }}>{f.l}</div>
                    <div style={{ fontSize:13.5, fontWeight:600, color:COLORS.text }}>{f.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding:24, marginBottom:14 }}>
              <div className="section-title">Roles ({roles.length})</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {roles.map((r, i) => (
                  <div key={r.id} style={{ border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"12px 16px", display:"flex", gap:14, alignItems:"flex-start" }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:COLORS.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:COLORS.primary }}>#{i+1}</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14 }}>{r.role || "Untitled Role"} <span style={{ marginLeft:6 }}><Badge status={r.resourceType} /></span></div>
                      <div style={{ fontSize:12.5, color:COLORS.textMid, marginTop:3 }}>
                        {r.count} resource{r.count > 1 ? "s" : ""} · {r.allocation} allocation · {r.workMode} · {r.experience}
                      </div>
                      {r.skills.length > 0 && (
                        <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
                          {r.skills.map(s => <span key={s} style={{ background:COLORS.primaryLight, color:COLORS.primary, borderRadius:12, padding:"2px 9px", fontSize:11.5, fontWeight:600 }}>{s}</span>)}
                        </div>
                      )}
                    </div>
                    {r.dailyRate && (
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontSize:12, color:COLORS.textLight }}>Daily Rate</div>
                        <div style={{ fontSize:14, fontWeight:700, color:COLORS.text }}>{r.currency} {parseFloat(r.dailyRate).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {selectedTalent.length > 0 && (
              <div className="card" style={{ padding:24, marginBottom:14 }}>
                <div className="section-title">Preferred Resources ({selectedTalent.length})</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {selectedTalent.map(name => {
                    const p = talentPool.find(x => x.name === name);
                    return p ? (
                      <div key={name} style={{ display:"flex", alignItems:"center", gap:8, background:COLORS.bg, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"8px 12px" }}>
                        <Avatar name={p.name} size={28} bg={bgForType(p.type)} />
                        <div>
                          <div style={{ fontSize:13, fontWeight:600 }}>{p.name}</div>
                          <div style={{ fontSize:11.5, color:COLORS.textMid }}>{p.role}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            <div className="card" style={{ padding:24 }}>
              <div className="section-title">Approval Chain</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                {[{ l:"Finance", v:form.financeApprover }, { l:"Mgmt Approver", v:form.mgmtApprover }, { l:"HR Owner", v:form.hrOwner }].map(f => (
                  <div key={f.l} style={{ background:COLORS.bg, borderRadius:8, padding:"10px 14px", border:`1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize:11, color:COLORS.textLight, marginBottom:3 }}>{f.l}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:COLORS.text }}>{f.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
          <div>
            {step > 1 && <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>}
            {step === 1 && <button className="btn-ghost" onClick={() => setPage("resources")}>Cancel</button>}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {step < 6
              ? <button className="btn-primary" onClick={() => setStep(s => s + 1)}>Continue →</button>
              : <button className="btn-success" onClick={() => setSubmitted(true)}>{isEdit ? "Save Changes" : "Submit for Approval"}</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};


// ════════════════════════════════════════════════════════════════════════════
// PAGE 2: RESOURCE REQUEST LIST
// ════════════════════════════════════════════════════════════════════════════
const RESOURCE_REQUESTS = [
  { id:"RR-001", title:"ERP Backend Engineers – Phase 2",       project:"PRJ-002 – ERP Implementation",       projectId:"PRJ-002", resourceType:"Internal Staff",      status:"Active",             priority:"Critical", headcount:3, filled:3, allocation:"100%", startDate:"2026-02-01", endDate:"2026-06-30", billingMode:"Billable",     engagementType:"T&M",         skills:["Java","Spring Boot","Microservices"],  requester:"Ravi Shankar",   financeApprover:"Meena Krishnan", mgmtApprover:"Suresh Babu", hrOwner:"Priya Iyer",    submittedOn:"2026-01-28", budget:"INR 5,28,000" },
  { id:"RR-002", title:"React UI Developers – Fintech Portal",  project:"PRJ-001 – Fintech Portal Revamp",    projectId:"PRJ-001", resourceType:"Bench",               status:"Resource Assigned",  priority:"High",     headcount:2, filled:1, allocation:"100%", startDate:"2026-03-01", endDate:"2026-05-31", billingMode:"Billable",     engagementType:"T&M",         skills:["React","TypeScript","CSS"],            requester:"Priya Nair",     financeApprover:"Meena Krishnan", mgmtApprover:"Kavitha Reddy",hrOwner:"Priya Iyer",    submittedOn:"2026-02-10", budget:"INR 2,64,000" },
  { id:"RR-003", title:"QA Automation – Retail Mobile App",     project:"PRJ-003 – Mobile App – Retail",      projectId:"PRJ-003", resourceType:"Bench",               status:"Pending Approval",   priority:"High",     headcount:2, filled:0, allocation:"75%",  startDate:"2026-03-15", endDate:"2026-06-15", billingMode:"Billable",     engagementType:"Fixed Price",  skills:["Selenium","Appium","API Testing"],     requester:"Amit Joshi",     financeApprover:"Meena Krishnan", mgmtApprover:"Suresh Babu", hrOwner:"Sunita Mehta",  submittedOn:"2026-02-20", budget:"INR 1,98,000" },
  { id:"RR-004", title:"Data Engineers – Analytics Platform",   project:"PRJ-004 – Data Analytics Platform",  projectId:"PRJ-004", resourceType:"External Contractor", status:"Pending Finance",    priority:"High",     headcount:2, filled:0, allocation:"100%", startDate:"2026-04-01", endDate:"2026-09-30", billingMode:"Cost Center",  engagementType:"T&M",         skills:["Python","Spark","dbt","Databricks"],   requester:"Ravi Shankar",   financeApprover:"Rakesh Gupta",   mgmtApprover:"Tom Ashby",   hrOwner:"Karthik Nair",  submittedOn:"2026-02-18", budget:"INR 7,92,000" },
  { id:"RR-005", title:"DevOps Lead – Cloud Migration",         project:"PRJ-006 – Cloud Migration Phase 2",  projectId:"PRJ-006", resourceType:"Vendor",              status:"Approved",           priority:"Critical", headcount:1, filled:0, allocation:"100%", startDate:"2026-03-10", endDate:"2026-08-31", billingMode:"Billable",     engagementType:"Retainer",    skills:["Kubernetes","Terraform","CI/CD","AWS"], requester:"Sneha Pillai",   financeApprover:"Meena Krishnan", mgmtApprover:"Kavitha Reddy",hrOwner:"Priya Iyer",    submittedOn:"2026-02-22", budget:"INR 3,30,000" },
  { id:"RR-006", title:"Business Analyst – ERP Scoping",        project:"PRJ-002 – ERP Implementation",       projectId:"PRJ-002", resourceType:"Internal Staff",      status:"Active",             priority:"Medium",   headcount:1, filled:1, allocation:"50%",  startDate:"2026-02-15", endDate:"2026-05-15", billingMode:"Non-Billable", engagementType:"T&M",         skills:["BPMN","Agile","SAP ERP"],             requester:"Priya Nair",     financeApprover:"Meena Krishnan", mgmtApprover:"Suresh Babu", hrOwner:"Priya Iyer",    submittedOn:"2026-02-05", budget:"INR 66,000" },
  { id:"RR-007", title:"UI/UX Designer – Portal Redesign",      project:"PRJ-001 – Fintech Portal Revamp",    projectId:"PRJ-001", resourceType:"Bench",               status:"Draft",              priority:"Medium",   headcount:1, filled:0, allocation:"50%",  startDate:"2026-04-01", endDate:"2026-06-30", billingMode:"Billable",     engagementType:"Fixed Price",  skills:["Figma","Design Systems","Prototyping"],requester:"Amit Joshi",     financeApprover:"Meena Krishnan", mgmtApprover:"Tom Ashby",   hrOwner:"Sunita Mehta",  submittedOn:"—",          budget:"INR 99,000" },
  { id:"RR-008", title:"Project Co-ordinator – PMO Support",    project:"PRJ-004 – Data Analytics Platform",  projectId:"PRJ-004", resourceType:"Internal Staff",      status:"On Hold",            priority:"Low",      headcount:1, filled:0, allocation:"25%",  startDate:"2026-05-01", endDate:"2026-07-31", billingMode:"Non-Billable", engagementType:"T&M",         skills:["JIRA","Confluence","Reporting"],       requester:"Ravi Shankar",   financeApprover:"Nalini Iyer",    mgmtApprover:"Suresh Babu", hrOwner:"Karthik Nair",  submittedOn:"2026-02-25", budget:"INR 33,000" },
  { id:"RR-009", title:"Security Engineer – Cloud Hardening",   project:"PRJ-006 – Cloud Migration Phase 2",  projectId:"PRJ-006", resourceType:"External Contractor", status:"Partially Filled",   priority:"High",     headcount:2, filled:1, allocation:"100%", startDate:"2026-03-01", endDate:"2026-07-31", billingMode:"Billable",     engagementType:"Fixed Price",  skills:["IAM","SOC2","PenTest","AWS"],          requester:"Sneha Pillai",   financeApprover:"Rakesh Gupta",   mgmtApprover:"Kavitha Reddy",hrOwner:"Priya Iyer",    submittedOn:"2026-02-16", budget:"INR 4,40,000" },
  { id:"RR-010", title:"Mobile Devs – iOS & Android",           project:"PRJ-003 – Mobile App – Retail",      projectId:"PRJ-003", resourceType:"Bench",               status:"Completed",          priority:"High",     headcount:3, filled:3, allocation:"100%", startDate:"2025-12-01", endDate:"2026-02-28", billingMode:"Billable",     engagementType:"Fixed Price",  skills:["Swift","Kotlin","React Native"],        requester:"Amit Joshi",     financeApprover:"Meena Krishnan", mgmtApprover:"Suresh Babu", hrOwner:"Sunita Mehta",  submittedOn:"2025-11-20", budget:"INR 3,96,000" },
];

const ResourceRequestList = ({ setPage }) => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  const statusPipeline = ["All","Draft","Pending Finance","Pending Approval","Approved","Resource Assigned","Partially Filled","Active","On Hold","Completed","Cancelled"];
  const statusColor = {
    "Draft":"#8b5cf6","Pending Finance":"#f59e0b","Pending Approval":"#f59e0b",
    "Approved":"#10b981","Resource Assigned":"#0ea5e9","Active":"#1a56db",
    "Partially Filled":"#f97316","Completed":"#10b981","On Hold":"#94a3b8","Cancelled":"#ef4444"
  };

  const filtered = RESOURCE_REQUESTS.filter(r => {
    const matchStatus   = statusFilter === "All" || r.status === statusFilter;
    const matchPriority = priorityFilter === "All" || r.priority === priorityFilter;
    const matchProject  = projectFilter === "All" || r.projectId === projectFilter;
    const matchType     = typeFilter === "All" || r.resourceType === typeFilter;
    const matchSearch   = !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase()) || r.project.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchProject && matchType && matchSearch;
  });

  const counts = {};
  statusPipeline.forEach(s => { counts[s] = s === "All" ? RESOURCE_REQUESTS.length : RESOURCE_REQUESTS.filter(r => r.status === s).length; });

  const DetailPanel = ({ req }) => (
    <div className="slide-in" style={{ padding:"14px 16px 18px", background:COLORS.bg, borderBottom:`1px solid ${COLORS.border}` }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:14 }}>
        {[
          { l:"Start Date",         v:req.startDate },
          { l:"End Date",           v:req.endDate },
          { l:"Allocation",         v:req.allocation },
          { l:"Filled / Total",     v:`${req.filled} / ${req.headcount}` },
          { l:"Billing Mode",       v:req.billingMode },
          { l:"Engagement Type",    v:req.engagementType },
          { l:"Finance Approver",   v:req.financeApprover },
          { l:"HR Owner",           v:req.hrOwner },
        ].map(f => (
          <div key={f.l} style={{ background:"#fff", borderRadius:8, padding:"10px 12px", border:`1px solid ${COLORS.border}` }}>
            <div style={{ fontSize:11, color:COLORS.textLight, marginBottom:3 }}>{f.l}</div>
            <div style={{ fontSize:13, fontWeight:600, color:COLORS.text }}>{f.v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:12, fontWeight:600, color:COLORS.textLight, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>Required Skills</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {req.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
        </div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {req.status === "Draft" && <button className="btn-primary" style={{ fontSize:12.5, padding:"7px 16px" }}>Submit for Approval</button>}
        {["Pending Finance","Pending Approval"].includes(req.status) && <button className="btn-ghost" style={{ fontSize:12.5, padding:"7px 14px" }}>Send Reminder</button>}
        {req.status === "Approved" && <button className="btn-primary" style={{ fontSize:12.5, padding:"7px 16px" }}>Assign Resource</button>}
        {req.status === "Resource Assigned" && <button className="btn-success" style={{ fontSize:12.5, padding:"7px 16px" }}>Activate</button>}
        <button className="btn-ghost" style={{ fontSize:12.5, padding:"7px 14px" }} onClick={() => setPage("createRR")}>Edit Request</button>
        <button className="btn-ghost" style={{ fontSize:12.5, padding:"7px 14px" }}>Clone</button>
        {!["Completed","Cancelled"].includes(req.status) && <button className="btn-danger" style={{ marginLeft:"auto" }}>Cancel</button>}
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      <style>{css}</style>
      <TopBar
        title="Resource Requests"
        subtitle={`${filtered.length} requests · ${RESOURCE_REQUESTS.filter(r => ["Pending Finance","Pending Approval"].includes(r.status)).length} awaiting action`}
        breadcrumb="PM Dashboard › Resource Requests"
        actions={<button className="btn-primary" onClick={() => setPage("createRR")} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13.5 }}><Icon name="plus" size={14} color="#fff" />New Request</button>}
      />

      <div style={{ padding:"20px 28px" }}>
        {/* Status pipeline */}
        <div className="card" style={{ padding:"12px 16px", marginBottom:16, overflowX:"auto" }}>
          <div style={{ display:"flex", gap:4, minWidth:"max-content" }}>
            {statusPipeline.map(s => (
              <button key={s} className={`tab-pill${statusFilter === s ? " active" : ""}`} onClick={() => setStatusFilter(s)}
                style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 13px", fontSize:13 }}>
                {s !== "All" && <span style={{ width:7, height:7, borderRadius:"50%", background:statusFilter === s ? "#fff" : (statusColor[s] || COLORS.textLight), display:"inline-block" }} />}
                {s}
                {counts[s] > 0 && <span style={{ background: statusFilter === s ? "rgba(255,255,255,0.25)" : COLORS.bg, color: statusFilter === s ? "#fff" : COLORS.textMid, borderRadius:10, padding:"1px 7px", fontSize:11, fontWeight:700 }}>{counts[s]}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding:"12px 16px", marginBottom:16, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:1, minWidth:200 }}>
            <div style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}><Icon name="search" size={14} color={COLORS.textLight} /></div>
            <input className="input-field" placeholder="Search by ID, title, project…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:32, paddingTop:7, paddingBottom:7 }} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <Icon name="filter" size={14} color={COLORS.textMid} />
            <select className="input-field" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{ width:"auto", paddingTop:7, paddingBottom:7, paddingRight:24 }}>
              <option value="All">All Priorities</option>
              {["Critical","High","Medium","Low"].map(o => <option key={o}>{o}</option>)}
            </select>
            <select className="input-field" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width:"auto", paddingTop:7, paddingBottom:7, paddingRight:24 }}>
              <option value="All">All Types</option>
              {["Internal Staff","Bench","External Contractor","Vendor","Mixed"].map(o => <option key={o}>{o}</option>)}
            </select>
            <select className="input-field" value={projectFilter} onChange={e => setProjectFilter(e.target.value)} style={{ width:"auto", paddingTop:7, paddingBottom:7, paddingRight:24 }}>
              <option value="All">All Projects</option>
              {[...new Set(RESOURCE_REQUESTS.map(r => r.projectId))].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:4, background:COLORS.bg, borderRadius:8, padding:3 }}>
            {["table","grid"].map(v => (
              <button key={v} onClick={() => setViewMode(v)} style={{ padding:"5px 9px", borderRadius:6, border:"none", background:viewMode === v ? "#fff" : "transparent", cursor:"pointer", boxShadow:viewMode === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                <Icon name={v === "table" ? "list" : "grid"} size={14} color={viewMode === v ? COLORS.primary : COLORS.textLight} />
              </button>
            ))}
          </div>
          <button className="btn-ghost" style={{ padding:"7px 14px", fontSize:12.5, display:"flex", alignItems:"center", gap:5 }}>
            <Icon name="download" size={13} color={COLORS.textMid} /> Export
          </button>
        </div>

        {/* Summary stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:16 }}>
          {[
            { l:"Total Requests",      v:RESOURCE_REQUESTS.length,                                                                 color:COLORS.primary },
            { l:"Pending Action",      v:RESOURCE_REQUESTS.filter(r=>["Pending Finance","Pending Approval"].includes(r.status)).length, color:COLORS.warning },
            { l:"Active",              v:RESOURCE_REQUESTS.filter(r=>r.status==="Active").length,                                  color:COLORS.accent },
            { l:"Completed",           v:RESOURCE_REQUESTS.filter(r=>r.status==="Completed").length,                               color:COLORS.success },
            { l:"Total Headcount",     v:RESOURCE_REQUESTS.reduce((a,r)=>a+r.headcount,0),                                        color:COLORS.purple },
          ].map(s => (
            <div key={s.l} className="card" style={{ padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12.5, color:COLORS.textMid }}>{s.l}</span>
              <span style={{ fontSize:18, fontWeight:800, color:s.color }}>{s.v}</span>
            </div>
          ))}
        </div>

        {/* TABLE VIEW */}
        {viewMode === "table" && (
          <div className="card" style={{ overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:COLORS.bg }}>
                  <th style={{ width:32, padding:"10px 8px 10px 16px" }}></th>
                  {["Request ID","Title","Project","Resource Type","Status","Priority","Headcount","Allocation","Submitted","Actions"].map(h => (
                    <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:COLORS.textLight, fontWeight:600, fontSize:11.5, whiteSpace:"nowrap", borderBottom:`1px solid ${COLORS.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <>
                    <tr key={r.id} className="hover-row" style={{ borderBottom:`1px solid ${COLORS.border}`, cursor:"pointer", background:expandedRow === r.id ? COLORS.primaryLight : "transparent" }}
                      onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                      <td style={{ padding:"12px 4px 12px 16px" }}>
                        <div style={{ width:22, height:22, borderRadius:6, background:expandedRow === r.id ? COLORS.primary : COLORS.bg, border:`1.5px solid ${expandedRow === r.id ? COLORS.primary : COLORS.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Icon name={expandedRow === r.id ? "chevDown" : "chevRight"} size={12} color={expandedRow === r.id ? "#fff" : COLORS.textLight} />
                        </div>
                      </td>
                      <td style={{ padding:"12px", fontFamily:"DM Mono, monospace", fontSize:12, color:COLORS.primary, fontWeight:600, whiteSpace:"nowrap" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <span style={{ width:7, height:7, borderRadius:"50%", background:statusColor[r.status] || COLORS.textLight, display:"inline-block", flexShrink:0 }} />
                          {r.id}
                        </div>
                      </td>
                      <td style={{ padding:"12px", maxWidth:200 }}>
                        <div style={{ fontWeight:600, color:COLORS.text }}>{r.title}</div>
                        <div style={{ fontSize:11.5, color:COLORS.textLight, marginTop:2 }}>{r.requester}</div>
                      </td>
                      <td style={{ padding:"12px", color:COLORS.textMid, fontSize:12.5, whiteSpace:"nowrap" }}>
                        <span style={{ fontSize:11.5, color:COLORS.textLight }}>{r.projectId}</span>
                      </td>
                      <td style={{ padding:"12px" }}><Badge status={r.resourceType} /></td>
                      <td style={{ padding:"12px" }}><Badge status={r.status} /></td>
                      <td style={{ padding:"12px" }}><Badge status={r.priority} /></td>
                      <td style={{ padding:"12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ fontWeight:700, color:r.filled === r.headcount ? COLORS.success : COLORS.text }}>{r.filled}</span>
                          <span style={{ color:COLORS.textLight }}>/</span>
                          <span style={{ color:COLORS.textMid }}>{r.headcount}</span>
                          <div style={{ width:40, height:5, background:COLORS.border, borderRadius:10, overflow:"hidden" }}>
                            <div style={{ width:`${(r.filled/r.headcount)*100}%`, height:"100%", background:r.filled===r.headcount ? COLORS.success : COLORS.primary, borderRadius:10 }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"12px" }}>
                        <span style={{ fontSize:12, color:COLORS.textMid }}>{r.allocation}</span>
                      </td>
                      <td style={{ padding:"12px", fontSize:12, color:COLORS.textMid, whiteSpace:"nowrap" }}>{r.submittedOn}</td>
                      <td style={{ padding:"12px" }}>
                        <div style={{ display:"flex", gap:4 }}>
                          <button style={{ padding:"5px 8px", border:"none", background:COLORS.primaryLight, borderRadius:6, cursor:"pointer" }} onClick={e => { e.stopPropagation(); setPage("createRR"); }}>
                            <Icon name="edit" size={13} color={COLORS.primary} />
                          </button>
                          <button style={{ padding:"5px 8px", border:"none", background:COLORS.bg, borderRadius:6, cursor:"pointer" }}>
                            <Icon name="copy" size={13} color={COLORS.textMid} />
                          </button>
                          <button style={{ padding:"5px 8px", border:"none", background:COLORS.bg, borderRadius:6, cursor:"pointer" }}>
                            <Icon name="more" size={13} color={COLORS.textMid} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === r.id && (
                      <tr key={`${r.id}-exp`}><td colSpan={11} style={{ padding:0 }}><DetailPanel req={r} /></td></tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign:"center", padding:"48px 20px" }}>
                <Icon name="search" size={32} color={COLORS.border} />
                <div style={{ marginTop:12, color:COLORS.textLight, fontSize:14 }}>No requests match your filters.</div>
                <button className="btn-ghost" style={{ marginTop:12 }} onClick={() => { setStatusFilter("All"); setSearch(""); setPriorityFilter("All"); setTypeFilter("All"); }}>Clear Filters</button>
              </div>
            )}
            <div style={{ padding:"12px 16px", borderTop:`1px solid ${COLORS.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:13, color:COLORS.textLight }}>Showing {filtered.length} of {RESOURCE_REQUESTS.length} requests</div>
              <div style={{ display:"flex", gap:6 }}>
                {[1,2].map(p => <button key={p} style={{ width:30, height:30, borderRadius:6, border:`1.5px solid ${p===1 ? COLORS.primary : COLORS.border}`, background:p===1 ? COLORS.primary : "#fff", color:p===1 ? "#fff" : COLORS.textMid, cursor:"pointer", fontSize:13, fontWeight:600 }}>{p}</button>)}
              </div>
            </div>
          </div>
        )}

        {/* KANBAN / GRID VIEW */}
        {viewMode === "grid" && (
          <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:8 }}>
            {["Draft","Pending Finance","Pending Approval","Approved","Resource Assigned","Active","Completed"].map(col => {
              const colItems = filtered.filter(r => r.status === col);
              return (
                <div key={col} className="kanban-col" style={{ minWidth:240 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ fontWeight:700, fontSize:12.5, color:COLORS.text, display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{ width:7, height:7, borderRadius:"50%", background:statusColor[col] || COLORS.textLight, display:"inline-block" }} />
                      {col}
                    </div>
                    <span style={{ background:"#fff", color:COLORS.textMid, borderRadius:10, padding:"2px 8px", fontSize:11.5, fontWeight:700, border:`1px solid ${COLORS.border}` }}>{colItems.length}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {colItems.map(r => (
                      <div key={r.id} className="card" style={{ padding:14, cursor:"pointer" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                          <span style={{ fontFamily:"DM Mono, monospace", fontSize:11, color:COLORS.primary, fontWeight:600 }}>{r.id}</span>
                          <Badge status={r.priority} />
                        </div>
                        <div style={{ fontWeight:600, fontSize:13.5, color:COLORS.text, marginBottom:4 }}>{r.title}</div>
                        <div style={{ fontSize:12, color:COLORS.textMid, marginBottom:8 }}>{r.projectId}</div>
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
                          {r.skills.slice(0,2).map(s => <span key={s} style={{ background:COLORS.primaryLight, color:COLORS.primary, borderRadius:12, padding:"2px 7px", fontSize:10.5, fontWeight:600 }}>{s}</span>)}
                          {r.skills.length > 2 && <span style={{ fontSize:10.5, color:COLORS.textLight }}>+{r.skills.length-2}</span>}
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <Badge status={r.resourceType} />
                          <div style={{ fontSize:11.5, color:COLORS.textLight }}>{r.filled}/{r.headcount} filled</div>
                        </div>
                      </div>
                    ))}
                    {colItems.length === 0 && <div style={{ textAlign:"center", padding:"20px 0", fontSize:12, color:COLORS.textLight }}>No requests</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PLACEHOLDER ──────────────────────────────────────────────────────────────
const Placeholder = ({ title, icon, setPage }) => (
  <div className="fade-in">
    <style>{css}</style>
    <TopBar title={title} />
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"65vh", gap:14 }}>
      <div style={{ width:60, height:60, background:COLORS.primaryLight, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name={icon} size={26} color={COLORS.primary} />
      </div>
      <div style={{ fontSize:17, fontWeight:700, color:COLORS.text }}>{title}</div>
      <div style={{ fontSize:13.5, color:COLORS.textLight }}>Coming in the next sprint.</div>
      <button className="btn-primary" onClick={() => setPage("resources")}>← Back</button>
    </div>
  </div>
);

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("resources");

  const pages = {
    createRR:  <CreateResourceRequest setPage={setPage} />,
    resources: <ResourceRequestList setPage={setPage} />,
    dashboard: <Placeholder title="Dashboard" icon="dashboard" setPage={setPage} />,
    projects:  <Placeholder title="My Projects" icon="folder" setPage={setPage} />,
    create:    <Placeholder title="New Project" icon="plus" setPage={setPage} />,
    hiring:    <Placeholder title="Hiring Requests" icon="hiring" setPage={setPage} />,
    bench:     <Placeholder title="Bench / Talent" icon="bench" setPage={setPage} />,
    approvals: <Placeholder title="Approvals" icon="approval" setPage={setPage} />,
    team:      <Placeholder title="My Team" icon="users" setPage={setPage} />,
    reports:   <Placeholder title="Reports" icon="trending" setPage={setPage} />,
    settings:  <Placeholder title="Settings" icon="settings" setPage={setPage} />,
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", minHeight:"100vh" }}>
        <Sidebar page={page} setPage={setPage} />
        <div style={{ marginLeft:224, flex:1, background:COLORS.bg, minHeight:"100vh" }}>
          {pages[page] || pages.resources}
        </div>
      </div>
    </>
  );
}
