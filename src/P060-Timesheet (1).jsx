import { useState, useMemo } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  primary:"#4f46e5", primaryDk:"#3730a3", primaryLt:"#eef2ff",
  accent:"#6366f1", success:"#10b981", warning:"#f59e0b",
  danger:"#ef4444", purple:"#8b5cf6", teal:"#0ea5e9",
  surface:"#ffffff", bg:"#f4f6fb", border:"#e2e8f0",
  text:"#0f172a", mid:"#475569", light:"#94a3b8", sidebar:"#0f172a",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Sora:wght@600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:${C.bg};color:${C.text};}
  input,select,textarea,button{font-family:'DM Sans',sans-serif;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px;}
  .fade-in{animation:fi .2s ease;}
  @keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  .nav-item:hover{background:rgba(255,255,255,0.08)!important;}
  .nav-item.active{background:rgba(79,70,229,0.85)!important;}
  .btn-p{background:${C.primary};color:#fff;border:none;border-radius:8px;padding:9px 20px;font-size:13.5px;font-weight:600;cursor:pointer;transition:background .15s;}
  .btn-p:hover{background:${C.primaryDk};}
  .btn-g{background:transparent;color:${C.mid};border:1.5px solid ${C.border};border-radius:8px;padding:8px 16px;font-size:13.5px;font-weight:500;cursor:pointer;transition:all .15s;}
  .btn-g:hover{border-color:${C.primary};color:${C.primary};}
  .btn-s{background:#dcfce7;color:#166534;border:none;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;}
  .btn-d{background:#fef2f2;color:${C.danger};border:1.5px solid #fecaca;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;}
  .card{background:#fff;border-radius:12px;border:1px solid ${C.border};}
  .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.3px;white-space:nowrap;}
  .finput{width:100%;border:1.5px solid ${C.border};border-radius:8px;padding:9px 12px;font-size:13.5px;color:${C.text};outline:none;transition:border .15s;background:#fff;}
  .finput:focus{border-color:${C.primary};box-shadow:0 0 0 3px rgba(79,70,229,.08);}
  select.finput{cursor:pointer;}
  .hover-row:hover{background:#f8fafc!important;}
  .h-input{width:52px;border:1.5px solid ${C.border};border-radius:6px;padding:5px 6px;font-size:13px;text-align:center;outline:none;transition:border .15s;background:#fff;}
  .h-input:focus{border-color:${C.primary};box-shadow:0 0 0 3px rgba(79,70,229,.08);}
  .h-input.warn{border-color:${C.warning};background:#fffbeb;}
  .h-input.err{border-color:${C.danger};background:#fef2f2;}
  .tab-btn{padding:7px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;color:${C.mid};border:none;background:transparent;}
  .tab-btn.on{background:${C.primary};color:#fff;}
  .tab-btn:not(.on):hover{background:${C.bg};color:${C.text};}
  .modal-ov{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
  .modal-box{background:#fff;border-radius:16px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.2);}
  .stat-card{background:#fff;border-radius:12px;border:1px solid ${C.border};padding:18px 22px;flex:1;min-width:160px;}
  .section-label{font-size:11px;font-weight:700;color:${C.light};text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid ${C.border};}
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ic = ({ n, s=18, c="currentColor" }) => {
  const d = {
    dashboard:<><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    clock:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    check:<><polyline points="20 6 9 17 4 12"/></>,
    x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    eye:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    bell:<><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    logout:<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    layers:<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    users:<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    folder:<><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></>,
    trending:<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    download:<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    send:<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    trash:<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    chevR:<><polyline points="9 18 15 12 9 6"/></>,
    alert:<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    info:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    copy:<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    approval:<><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    dollar:<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    calendar:<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d[n]}</svg>;
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Bdg = ({ status }) => {
  const m = {
    "Draft":          { bg:"#f1f5f9", c:"#475569" },
    "Submitted":      { bg:"#fef9c3", c:"#854d0e" },
    "Under Review":   { bg:"#fff7ed", c:"#9a3412" },
    "Approved":       { bg:"#dcfce7", c:"#166534" },
    "Rejected":       { bg:"#fef2f2", c:"#991b1b" },
    "Billable":       { bg:"#dcfce7", c:"#166534" },
    "Non-Billable":   { bg:"#f1f5f9", c:"#475569" },
    "Partial":        { bg:"#eff6ff", c:"#1e40af" },
  };
  const s = m[status] || { bg:"#f1f5f9", c:"#64748b" };
  return <span className="badge" style={{ background:s.bg, color:s.c }}>{status}</span>;
};

const Avatar = ({ name, sz=32, bg=C.primary }) => (
  <div style={{ width:sz, height:sz, borderRadius:"50%", background:bg, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:sz*.35, fontWeight:700, flexShrink:0 }}>
    {name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
  </div>
);

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id:"PRJ-001", name:"Fintech Portal Revamp",    client:"Orion Financial", billingMode:"Billable" },
  { id:"PRJ-002", name:"ERP Implementation",        client:"Nexus Corp",      billingMode:"Billable" },
  { id:"PRJ-003", name:"Mobile App – Retail",       client:"BlueStar Retail", billingMode:"Billable" },
  { id:"PRJ-INT", name:"Internal / Admin",          client:"Internal",        billingMode:"Non-Billable" },
  { id:"PRJ-TRN", name:"Training & Upskilling",     client:"Internal",        billingMode:"Non-Billable" },
];

const TASKS = {
  "PRJ-001":["UI Development","API Integration","Code Review","Testing","Project Management"],
  "PRJ-002":["Backend Development","Database Migration","UAT Support","Documentation","Project Management"],
  "PRJ-003":["Mobile Development","QA Automation","Deployment","Sprint Planning","Project Management"],
  "PRJ-INT":["Team Meetings","Admin / HR","Support Duty","Other"],
  "PRJ-TRN":["Technical Training","Certification Prep","Mentoring","Workshop"],
};

// Week start dates (Monday)
const WEEKS = [
  { id:"W1",  label:"10 Feb – 16 Feb 2026", start:"2026-02-10" },
  { id:"W2",  label:"17 Feb – 23 Feb 2026", start:"2026-02-17" },
  { id:"W3",  label:"24 Feb – 02 Mar 2026", start:"2026-02-24" },
  { id:"W4",  label:"03 Mar – 09 Mar 2026", start:"2026-03-03" },
  { id:"W5",  label:"10 Mar – 16 Mar 2026", start:"2026-03-10" },
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const mkRows = (entries) => entries.map((e,i) => ({ id:i+1, projectId:e[0], task:e[1], hours:e[2], note:e[3]||"" }));

const TIMESHEETS = [
  { id:"TS-001", resource:"Arun Venkat",  role:"React Developer",    weekId:"W1", week:"10 Feb – 16 Feb", status:"Approved",      totalHours:40, billableHours:36, approver:"Ravi Shankar",  submittedOn:"2026-02-17", approvedOn:"2026-02-18", comment:"", rows: mkRows([["PRJ-001","UI Development",[8,8,8,8,0,0,0]],["PRJ-001","API Integration",[0,0,0,0,6,0,0]],["PRJ-INT","Team Meetings",[0,0,0,0,2,0,0]]]) },
  { id:"TS-002", resource:"Arun Venkat",  role:"React Developer",    weekId:"W2", week:"17 Feb – 23 Feb", status:"Approved",      totalHours:38, billableHours:34, approver:"Ravi Shankar",  submittedOn:"2026-02-24", approvedOn:"2026-02-25", comment:"", rows: mkRows([["PRJ-001","UI Development",[8,8,8,8,0,0,0]],["PRJ-001","Code Review",[0,0,0,0,4,0,0]],["PRJ-INT","Team Meetings",[0,0,0,0,2,0,0]]]) },
  { id:"TS-003", resource:"Arun Venkat",  role:"React Developer",    weekId:"W3", week:"24 Feb – 02 Mar", status:"Approved",      totalHours:40, billableHours:40, approver:"Ravi Shankar",  submittedOn:"2026-03-02", approvedOn:"2026-03-03", comment:"", rows: mkRows([["PRJ-001","UI Development",[8,8,8,8,8,0,0]]]) },
  { id:"TS-004", resource:"Arun Venkat",  role:"React Developer",    weekId:"W4", week:"03 Mar – 09 Mar", status:"Rejected",      totalHours:44, billableHours:40, approver:"Ravi Shankar",  submittedOn:"2026-03-09", approvedOn:"2026-03-10", comment:"Hours exceed 40h cap. Please revise Saturday entry.", rows: mkRows([["PRJ-001","UI Development",[8,8,8,8,8,4,0]],["PRJ-INT","Team Meetings",[0,0,0,0,0,0,0]]]) },
  { id:"TS-005", resource:"Arun Venkat",  role:"React Developer",    weekId:"W5", week:"10 Mar – 16 Mar", status:"Draft",         totalHours:24, billableHours:24, approver:"Ravi Shankar",  submittedOn:"",          approvedOn:"", comment:"", rows: mkRows([["PRJ-001","UI Development",[8,8,8,0,0,0,0]]]) },
  { id:"TS-006", resource:"Sneha Pillai", role:"Business Analyst",   weekId:"W4", week:"03 Mar – 09 Mar", status:"Submitted",     totalHours:38, billableHours:30, approver:"Kavitha Reddy", submittedOn:"2026-03-09", approvedOn:"", comment:"", rows: mkRows([["PRJ-002","Documentation",[6,6,6,6,6,0,0]],["PRJ-INT","Team Meetings",[2,2,2,2,2,0,0]]]) },
  { id:"TS-007", resource:"Sneha Pillai", role:"Business Analyst",   weekId:"W5", week:"10 Mar – 16 Mar", status:"Draft",         totalHours:18, billableHours:12, approver:"Kavitha Reddy", submittedOn:"",          approvedOn:"", comment:"", rows: mkRows([["PRJ-002","Documentation",[6,6,6,0,0,0,0]]]) },
  { id:"TS-008", resource:"Kiran Desai",  role:"QA Engineer",        weekId:"W4", week:"03 Mar – 09 Mar", status:"Under Review",  totalHours:40, billableHours:40, approver:"Ravi Shankar",  submittedOn:"2026-03-09", approvedOn:"", comment:"", rows: mkRows([["PRJ-003","QA Automation",[8,8,8,8,8,0,0]]]) },
  { id:"TS-009", resource:"Kiran Desai",  role:"QA Engineer",        weekId:"W5", week:"10 Mar – 16 Mar", status:"Submitted",     totalHours:32, billableHours:32, approver:"Ravi Shankar",  submittedOn:"2026-03-11", approvedOn:"", comment:"", rows: mkRows([["PRJ-003","QA Automation",[8,8,8,8,0,0,0]]]) },
  { id:"TS-010", resource:"Meena Roy",    role:"Java Developer",     weekId:"W4", week:"03 Mar – 09 Mar", status:"Approved",      totalHours:40, billableHours:36, approver:"Suresh Babu",   submittedOn:"2026-03-09", approvedOn:"2026-03-10", comment:"", rows: mkRows([["PRJ-002","Backend Development",[8,8,8,6,6,0,0]],["PRJ-TRN","Technical Training",[0,0,0,2,2,0,0]]]) },
];

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage }) => {
  const nav = [
    { id:"list",     label:"My Timesheets",    icon:"clock" },
    { id:"entry",    label:"New Entry",         icon:"plus" },
    { id:"approval", label:"Approval Queue",    icon:"approval" },
    { id:"reports",  label:"Reports",           icon:"trending" },
  ];
  return (
    <div style={{ width:220, background:C.sidebar, height:"100vh", position:"fixed", top:0, left:0, display:"flex", flexDirection:"column", zIndex:100 }}>
      <div style={{ padding:"20px 18px 14px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, background:C.primary, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ic n="layers" s={17} c="#fff" />
          </div>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>StaffSync</div>
            <div style={{ color:C.light, fontSize:10.5 }}>Enterprise PM</div>
          </div>
        </div>
      </div>
      <div style={{ padding:"10px 12px 6px" }}>
        <div style={{ background:"rgba(255,255,255,.06)", borderRadius:8, padding:"9px 12px", display:"flex", alignItems:"center", gap:9 }}>
          <Avatar name="Arun Venkat" sz={28} />
          <div>
            <div style={{ color:"#fff", fontSize:12.5, fontWeight:600 }}>Arun Venkat</div>
            <div style={{ color:C.light, fontSize:10.5 }}>React Developer</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:"6px 8px", overflowY:"auto" }}>
        <div style={{ color:"rgba(255,255,255,.28)", fontSize:10, fontWeight:700, letterSpacing:".8px", textTransform:"uppercase", padding:"8px 8px 4px" }}>Timesheets</div>
        {nav.map(n => (
          <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}
            style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:7, cursor:"pointer", color:page===n.id?"#fff":"rgba(255,255,255,.52)", fontSize:13.5, fontWeight:500, transition:"all .12s", marginBottom:1 }}>
            <Ic n={n.icon} s={15} c={page===n.id?"#fff":"rgba(255,255,255,.42)"} />
            {n.label}
            {n.id==="approval" && <span style={{ marginLeft:"auto", background:C.danger, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:700 }}>3</span>}
          </div>
        ))}
        <div style={{ color:"rgba(255,255,255,.28)", fontSize:10, fontWeight:700, letterSpacing:".8px", textTransform:"uppercase", padding:"16px 8px 4px" }}>Platform</div>
        {[{id:"projects",label:"Projects",icon:"folder"},{id:"team",label:"Team",icon:"users"},{id:"settings",label:"Settings",icon:"settings"}].map(n=>(
          <div key={n.id} className="nav-item" style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:7, cursor:"pointer", color:"rgba(255,255,255,.42)", fontSize:13, marginBottom:1 }}>
            <Ic n={n.icon} s={14} c="rgba(255,255,255,.35)" />{n.label}
          </div>
        ))}
      </nav>
      <div style={{ padding:"8px 8px 16px", borderTop:"1px solid rgba(255,255,255,.08)" }}>
        <div className="nav-item" style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:7, cursor:"pointer", color:"rgba(255,255,255,.4)", fontSize:13 }}>
          <Ic n="logout" s={14} c="rgba(255,255,255,.35)" />Sign Out
        </div>
      </div>
    </div>
  );
};

// ─── TOP BAR ─────────────────────────────────────────────────────────────────
const TopBar = ({ title, sub, crumb }) => (
  <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"12px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
    <div>
      {crumb && <div style={{ fontSize:11, color:C.light, marginBottom:2 }}>{crumb}</div>}
      <div style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:700, color:C.text }}>{title}</div>
      {sub && <div style={{ fontSize:12, color:C.light, marginTop:1 }}>{sub}</div>}
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ position:"relative" }}>
        <input className="finput" placeholder="Search…" style={{ paddingLeft:32, paddingTop:7, paddingBottom:7, width:180, background:C.bg }} />
        <div style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}><Ic n="search" s={13} c={C.light} /></div>
      </div>
      <button style={{ background:"none", border:"none", cursor:"pointer", position:"relative", padding:6 }}>
        <Ic n="bell" s={18} c={C.mid} />
        <span style={{ position:"absolute", top:4, right:4, width:7, height:7, background:C.danger, borderRadius:"50%", border:"2px solid #fff" }} />
      </button>
      <Avatar name="Arun Venkat" sz={32} />
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// PAGE P-060: MY TIMESHEETS LIST
// ════════════════════════════════════════════════════════════════════════════
const TimesheetList = ({ setPage, setEditId }) => {
  const [statusF, setStatusF] = useState("All");
  const [search, setSearch] = useState("");
  const [resourceF, setResourceF] = useState("All");

  const statuses = ["All","Draft","Submitted","Under Review","Approved","Rejected"];
  const resources = ["All",...[...new Set(TIMESHEETS.map(t=>t.resource))]];

  const filtered = useMemo(()=>TIMESHEETS.filter(t=>{
    const ms = statusF==="All"||t.status===statusF;
    const mr = resourceF==="All"||t.resource===resourceF;
    const mq = !search||t.id.toLowerCase().includes(search.toLowerCase())||t.resource.toLowerCase().includes(search.toLowerCase())||t.week.toLowerCase().includes(search.toLowerCase());
    return ms&&mr&&mq;
  }),[statusF,resourceF,search]);

  const stats = useMemo(()=>({
    total:TIMESHEETS.length,
    pending:TIMESHEETS.filter(t=>["Submitted","Under Review"].includes(t.status)).length,
    approved:TIMESHEETS.filter(t=>t.status==="Approved").length,
    totalBillable:TIMESHEETS.filter(t=>t.status==="Approved").reduce((a,t)=>a+t.billableHours,0),
  }),[]);

  const statusColor = { "Draft":"#64748b","Submitted":"#d97706","Under Review":"#ea580c","Approved":"#16a34a","Rejected":"#dc2626" };

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:1400, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
            <div style={{ width:7, height:30, borderRadius:4, background:"linear-gradient(180deg,#4f46e5,#818cf8)" }} />
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:24, fontWeight:700, color:C.text, letterSpacing:-.5 }}>Timesheets</h1>
          </div>
          <p style={{ fontSize:13, color:C.mid, marginLeft:17 }}>Log and track weekly hours across projects and tasks.</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-g" onClick={()=>{setEditId(null);setPage("entry");}}>
            <span style={{ display:"flex", alignItems:"center", gap:6 }}><Ic n="plus" s={14} />New Timesheet</span>
          </button>
        </div>
      </div>

      {/* stat cards */}
      <div style={{ display:"flex", gap:14, marginBottom:24, flexWrap:"wrap" }}>
        {[
          { label:"Total Sheets", val:stats.total, sub:"All time", accent:C.primary },
          { label:"Pending Review", val:stats.pending, sub:"Awaiting approval", accent:C.warning },
          { label:"Approved", val:stats.approved, sub:"This month", accent:C.success },
          { label:"Billable Hours", val:`${stats.totalBillable}h`, sub:"Approved timesheets", accent:"#8b5cf6", wide:true },
        ].map((s,i)=>(
          <div key={i} className="stat-card" style={{ borderLeft:`3px solid ${s.accent}` }}>
            <div style={{ fontSize:11.5, color:C.light, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:".5px" }}>{s.label}</div>
            <div style={{ fontSize:s.wide?22:26, fontWeight:800, color:C.text, fontFamily:"'Sora',sans-serif" }}>{s.val}</div>
            <div style={{ fontSize:11.5, color:C.light, marginTop:3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="card" style={{ padding:"14px 18px", marginBottom:16, display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:"1 1 200px" }}>
          <input className="finput" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search timesheets…" style={{ paddingLeft:32, paddingTop:8, paddingBottom:8 }} />
          <div style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}><Ic n="search" s={13} c={C.light} /></div>
        </div>
        <select className="finput" style={{ width:160 }} value={statusF} onChange={e=>setStatusF(e.target.value)}>
          {statuses.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="finput" style={{ width:180 }} value={resourceF} onChange={e=>setResourceF(e.target.value)}>
          {resources.map(r=><option key={r}>{r}</option>)}
        </select>
        <button className="btn-g" style={{ padding:"8px 14px", fontSize:12.5 }}>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}><Ic n="download" s={13} />Export CSV</span>
        </button>
      </div>

      {/* pipeline pills */}
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
        {statuses.map(s=>{
          const count = s==="All"?TIMESHEETS.length:TIMESHEETS.filter(t=>t.status===s).length;
          return (
            <button key={s} onClick={()=>setStatusF(s)}
              style={{ padding:"5px 14px", borderRadius:20, border:`1.5px solid ${statusF===s?C.primary:C.border}`, background:statusF===s?C.primaryLt:"#fff", color:statusF===s?C.primary:C.mid, fontSize:12.5, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
              {s}
              <span style={{ background:statusF===s?C.primary:"#e2e8f0", color:statusF===s?"#fff":C.mid, borderRadius:10, padding:"0 6px", fontSize:10.5, fontWeight:700 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* table */}
      <div className="card" style={{ overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:C.bg, borderBottom:`1.5px solid ${C.border}` }}>
              {["Timesheet ID","Resource","Week","Total Hrs","Billable Hrs","Utilisation","Status","Approver","Actions"].map(h=>(
                <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:11.5, fontWeight:700, color:C.light, textTransform:"uppercase", letterSpacing:".5px", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ts,i)=>{
              const util = ts.totalHours>0?Math.round((ts.billableHours/ts.totalHours)*100):0;
              return (
                <tr key={ts.id} className="hover-row" style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"#fff":"#fafbfc" }}>
                  <td style={{ padding:"12px 14px" }}>
                    <span style={{ fontFamily:"monospace", fontSize:12.5, fontWeight:600, color:C.primary }}>{ts.id}</span>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <Avatar name={ts.resource} sz={26} bg={C.purple} />
                      <div>
                        <div style={{ fontSize:13.5, fontWeight:600, color:C.text }}>{ts.resource}</div>
                        <div style={{ fontSize:11, color:C.light }}>{ts.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:13, color:C.mid }}>{ts.week}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:ts.totalHours>40?C.danger:C.text }}>{ts.totalHours}h</span>
                    {ts.totalHours>40 && <span style={{ marginLeft:6, fontSize:10, color:C.danger, fontWeight:600 }}>OVER</span>}
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:13.5, fontWeight:600, color:C.success }}>{ts.billableHours}h</td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ flex:1, height:6, background:"#f1f5f9", borderRadius:3, minWidth:60, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${util}%`, background:util>=80?C.success:util>=50?C.warning:C.danger, borderRadius:3 }} />
                      </div>
                      <span style={{ fontSize:12, fontWeight:600, color:C.mid, minWidth:32 }}>{util}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 14px" }}><Bdg status={ts.status} /></td>
                  <td style={{ padding:"12px 14px", fontSize:12.5, color:C.mid }}>{ts.approver}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="btn-g" style={{ padding:"5px 10px", fontSize:12 }} onClick={()=>{setEditId(ts.id);setPage("entry");}}>
                        {ts.status==="Draft"||ts.status==="Rejected"?"Edit":"View"}
                      </button>
                      {ts.status==="Draft" && (
                        <button className="btn-p" style={{ padding:"5px 10px", fontSize:12 }}>Submit</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0&&(
          <div style={{ padding:48, textAlign:"center", color:C.light }}>
            <Ic n="clock" s={40} c="#e2e8f0" />
            <div style={{ marginTop:12, fontSize:14, fontWeight:600 }}>No timesheets found</div>
            <div style={{ fontSize:12.5, marginTop:4 }}>Try adjusting your filters</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// PAGE P-061: WEEKLY TIMESHEET ENTRY
// ════════════════════════════════════════════════════════════════════════════
const TimesheetEntry = ({ setPage, editId }) => {
  const existing = editId ? TIMESHEETS.find(t=>t.id===editId) : null;
  const [weekId, setWeekId] = useState(existing?.weekId || "W5");
  const [submitted, setSubmitted] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const blankRow = () => ({ id:Date.now(), projectId:"PRJ-001", task:"UI Development", hours:[0,0,0,0,0,0,0], note:"", billing:"Billable" });

  const [rows, setRows] = useState(existing?.rows?.map((r,i)=>({
    id:i+1, projectId:r.projectId, task:r.task, hours:[...r.hours], note:r.note||"", billing:"Billable"
  })) || [blankRow()]);

  const updateRow = (id, field, val) => setRows(rs=>rs.map(r=>r.id===id?{...r,[field]:val}:r));
  const updateHour = (id, di, val) => {
    const n = parseFloat(val)||0;
    setRows(rs=>rs.map(r=>r.id===id?{...r,hours:r.hours.map((h,i)=>i===di?n:h)}:r));
  };
  const addRow = () => setRows(rs=>[...rs,blankRow()]);
  const removeRow = (id) => setRows(rs=>rs.filter(r=>r.id!==id));

  const dayTotals = DAYS.map((_,di)=>rows.reduce((a,r)=>a+(r.hours[di]||0),0));
  const grandTotal = rows.reduce((a,r)=>a+r.hours.reduce((b,h)=>b+h,0),0);
  const billableTotal = rows.filter(r=>r.billing==="Billable").reduce((a,r)=>a+r.hours.reduce((b,h)=>b+h,0),0);

  const weekLabel = WEEKS.find(w=>w.id===weekId)?.label||"";

  if (submitted) return (
    <div className="fade-in" style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"72vh", flexDirection:"column", gap:18 }}>
      <div style={{ width:72, height:72, background:"#dcfce7", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Ic n="check" s={32} c={C.success} />
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:C.text }}>Timesheet Submitted!</div>
        <div style={{ fontSize:13.5, color:C.mid, marginTop:6 }}>Week of {weekLabel} · {grandTotal}h total · {billableTotal}h billable</div>
        <div style={{ fontSize:12.5, color:C.light, marginTop:4 }}>Sent to Ravi Shankar for approval</div>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button className="btn-g" onClick={()=>setPage("list")}>View All Timesheets</button>
        <button className="btn-p" onClick={()=>{setSubmitted(false);setRows([blankRow()]);}}>New Timesheet</button>
      </div>
    </div>
  );

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:1300, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
            <div style={{ width:7, height:30, borderRadius:4, background:"linear-gradient(180deg,#4f46e5,#818cf8)" }} />
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:C.text, letterSpacing:-.5 }}>
              {existing ? `Edit Timesheet – ${existing.id}` : "New Timesheet Entry"}
            </h1>
          </div>
          <p style={{ fontSize:13, color:C.mid, marginLeft:17 }}>Log hours per project, task, and day for the selected week.</p>
        </div>
        <button className="btn-g" onClick={()=>setPage("list")}>← Back</button>
      </div>

      {/* week selector + meta */}
      <div className="card" style={{ padding:"18px 22px", marginBottom:20, display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:5, minWidth:200 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.mid }}>Select Week</label>
          <select className="finput" style={{ width:240 }} value={weekId} onChange={e=>setWeekId(e.target.value)}>
            {WEEKS.map(w=><option key={w.id} value={w.id}>{w.label}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.mid }}>Resource</label>
          <div style={{ fontSize:14, fontWeight:600, color:C.text }}>Arun Venkat</div>
          <div style={{ fontSize:12, color:C.light }}>React Developer</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.mid }}>Approver</label>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Avatar name="Ravi Shankar" sz={24} bg={C.teal} />
            <span style={{ fontSize:13.5, fontWeight:600, color:C.text }}>Ravi Shankar</span>
          </div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:20 }}>
          {[
            { label:"Total Hours", val:`${grandTotal}h`, color:grandTotal>40?C.danger:C.text },
            { label:"Billable", val:`${billableTotal}h`, color:C.success },
            { label:"Non-Billable", val:`${grandTotal-billableTotal}h`, color:C.mid },
          ].map((m,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:11.5, color:C.light, fontWeight:600, marginBottom:2 }}>{m.label}</div>
              <div style={{ fontSize:20, fontWeight:800, color:m.color, fontFamily:"'Sora',sans-serif" }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      {grandTotal > 40 && (
        <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
          <Ic n="alert" s={16} c={C.danger} />
          <span style={{ fontSize:13, color:"#991b1b", fontWeight:500 }}>Total hours exceed 40h this week. Please review your entries before submitting.</span>
        </div>
      )}

      {/* grid */}
      <div className="card" style={{ overflow:"auto", marginBottom:16 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:900 }}>
          <thead>
            <tr style={{ background:C.bg, borderBottom:`1.5px solid ${C.border}` }}>
              <th style={{ padding:"12px 14px", textAlign:"left", fontSize:11.5, fontWeight:700, color:C.light, width:200 }}>PROJECT</th>
              <th style={{ padding:"12px 14px", textAlign:"left", fontSize:11.5, fontWeight:700, color:C.light, width:170 }}>TASK</th>
              <th style={{ padding:"12px 14px", textAlign:"left", fontSize:11.5, fontWeight:700, color:C.light, width:100 }}>BILLING</th>
              {DAYS.map((d,i)=>(
                <th key={d} style={{ padding:"12px 10px", textAlign:"center", fontSize:11.5, fontWeight:700, color:i>=5?C.warning:C.light, minWidth:60 }}>
                  {d}<div style={{ fontSize:9.5, color:C.light, fontWeight:500, marginTop:1 }}>{dayTotals[i]>0?`${dayTotals[i]}h`:""}</div>
                </th>
              ))}
              <th style={{ padding:"12px 10px", textAlign:"center", fontSize:11.5, fontWeight:700, color:C.primary, minWidth:54 }}>TOTAL</th>
              <th style={{ padding:"12px 10px", textAlign:"left", fontSize:11.5, fontWeight:700, color:C.light, width:120 }}>NOTE</th>
              <th style={{ width:36 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row,ri)=>{
              const rowTotal = row.hours.reduce((a,h)=>a+h,0);
              return (
                <tr key={row.id} style={{ borderBottom:`1px solid ${C.border}`, background:ri%2===0?"#fff":"#fafbfc" }}>
                  <td style={{ padding:"10px 10px 10px 14px" }}>
                    <select className="finput" style={{ fontSize:12.5, padding:"6px 8px" }} value={row.projectId}
                      onChange={e=>{updateRow(row.id,"projectId",e.target.value);updateRow(row.id,"task",TASKS[e.target.value][0]);}}>
                      {PROJECTS.map(p=><option key={p.id} value={p.id}>{p.id} – {p.name}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:"10px 8px" }}>
                    <select className="finput" style={{ fontSize:12.5, padding:"6px 8px" }} value={row.task}
                      onChange={e=>updateRow(row.id,"task",e.target.value)}>
                      {(TASKS[row.projectId]||[]).map(t=><option key={t}>{t}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:"10px 8px" }}>
                    <select className="finput" style={{ fontSize:12, padding:"5px 7px", width:90 }} value={row.billing}
                      onChange={e=>updateRow(row.id,"billing",e.target.value)}>
                      <option>Billable</option>
                      <option>Non-Billable</option>
                    </select>
                  </td>
                  {row.hours.map((h,di)=>{
                    const cls = h>8?"err":h>0&&di>=5?"warn":"";
                    return (
                      <td key={di} style={{ padding:"10px 6px", textAlign:"center" }}>
                        <input type="number" className={`h-input${cls?" "+cls:""}`} value={h||""}
                          min="0" max="16" step="0.5" placeholder="–"
                          onChange={e=>updateHour(row.id,di,e.target.value)} />
                      </td>
                    );
                  })}
                  <td style={{ padding:"10px 6px", textAlign:"center" }}>
                    <span style={{ fontWeight:700, fontSize:14, color:rowTotal>0?C.primary:C.light }}>{rowTotal>0?`${rowTotal}h`:"–"}</span>
                  </td>
                  <td style={{ padding:"10px 8px" }}>
                    <input className="finput" style={{ fontSize:12, padding:"5px 8px" }} value={row.note}
                      onChange={e=>updateRow(row.id,"note",e.target.value)} placeholder="Optional…" />
                  </td>
                  <td style={{ padding:"10px 8px", textAlign:"center" }}>
                    {rows.length>1&&(
                      <button onClick={()=>removeRow(row.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:4, color:C.light }}
                        onMouseEnter={e=>e.currentTarget.style.color=C.danger} onMouseLeave={e=>e.currentTarget.style.color=C.light}>
                        <Ic n="trash" s={14} c="currentColor" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {/* daily totals footer */}
            <tr style={{ background:C.bg, borderTop:`1.5px solid ${C.border}` }}>
              <td colSpan={3} style={{ padding:"10px 14px", fontSize:12.5, fontWeight:700, color:C.mid }}>Daily Totals</td>
              {dayTotals.map((dt,di)=>(
                <td key={di} style={{ padding:"10px 6px", textAlign:"center" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:dt>8?C.danger:dt>0?C.primary:C.light }}>{dt>0?`${dt}h`:"–"}</span>
                </td>
              ))}
              <td style={{ padding:"10px 6px", textAlign:"center" }}>
                <span style={{ fontSize:14, fontWeight:800, color:grandTotal>40?C.danger:C.primary }}>{grandTotal}h</span>
              </td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button className="btn-g" onClick={addRow} style={{ display:"flex", alignItems:"center", gap:7 }}>
          <Ic n="plus" s={14} />Add Row
        </button>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-g" onClick={()=>setPage("list")}>Save as Draft</button>
          <button className="btn-p" onClick={()=>setConfirmSubmit(true)}>
            <span style={{ display:"flex", alignItems:"center", gap:7 }}><Ic n="send" s={14} c="#fff" />Submit for Approval</span>
          </button>
        </div>
      </div>

      {/* confirm modal */}
      {confirmSubmit && (
        <div className="modal-ov" onClick={()=>setConfirmSubmit(false)}>
          <div className="modal-box" style={{ maxWidth:420, padding:32 }} onClick={e=>e.stopPropagation()}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ width:56, height:56, background:C.primaryLt, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                <Ic n="send" s={24} c={C.primary} />
              </div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:700, color:C.text }}>Submit Timesheet?</div>
              <div style={{ fontSize:13, color:C.mid, marginTop:8 }}>
                Week of <strong>{weekLabel}</strong> · <strong>{grandTotal}h</strong> total ({billableTotal}h billable)
              </div>
              <div style={{ fontSize:12.5, color:C.light, marginTop:6 }}>Once submitted, it will be sent to Ravi Shankar for approval. You won't be able to edit until it's reviewed.</div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-g" style={{ flex:1 }} onClick={()=>setConfirmSubmit(false)}>Cancel</button>
              <button className="btn-p" style={{ flex:1 }} onClick={()=>{setConfirmSubmit(false);setSubmitted(true);}}>Confirm Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// PAGE P-062: APPROVAL QUEUE
// ════════════════════════════════════════════════════════════════════════════
const ApprovalQueue = ({ setPage, setEditId }) => {
  const pending = TIMESHEETS.filter(t=>["Submitted","Under Review"].includes(t.status));
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState(null); // "approve" | "reject"
  const [done, setDone] = useState([]);

  const ts = selected ? TIMESHEETS.find(t=>t.id===selected) : null;

  const handleAction = (act) => {
    if(act==="reject" && !comment.trim()) return;
    setDone(d=>[...d,{ id:selected, act, comment }]);
    setSelected(null);
    setComment("");
    setAction(null);
  };

  const queue = pending.filter(t=>!done.map(d=>d.id).includes(t.id));

  return (
    <div className="fade-in" style={{ padding:"28px 32px", maxWidth:1300, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
            <div style={{ width:7, height:30, borderRadius:4, background:"linear-gradient(180deg,#4f46e5,#818cf8)" }} />
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:C.text, letterSpacing:-.5 }}>Approval Queue</h1>
          </div>
          <p style={{ fontSize:13, color:C.mid, marginLeft:17 }}>Review and approve submitted timesheets from your team.</p>
        </div>
      </div>

      <div style={{ display:"flex", gap:18 }}>
        {/* queue list */}
        <div style={{ width:340, flexShrink:0 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.light, textTransform:"uppercase", letterSpacing:".6px", marginBottom:12 }}>
            Pending ({queue.length})
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {queue.length===0 && (
              <div className="card" style={{ padding:32, textAlign:"center" }}>
                <Ic n="check" s={36} c="#a7f3d0" />
                <div style={{ marginTop:10, fontSize:13.5, fontWeight:600, color:C.mid }}>All caught up!</div>
                <div style={{ fontSize:12, color:C.light, marginTop:4 }}>No timesheets awaiting review.</div>
              </div>
            )}
            {queue.map(t=>(
              <div key={t.id} onClick={()=>{setSelected(t.id);setComment("");setAction(null);}}
                className="card" style={{ padding:"14px 16px", cursor:"pointer", borderLeft:`3px solid ${t.status==="Under Review"?C.warning:C.teal}`,
                  outline:selected===t.id?`2px solid ${C.primary}`:"none" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:700, color:C.primary }}>{t.id}</span>
                  <Bdg status={t.status} />
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                  <Avatar name={t.resource} sz={22} bg={C.purple} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{t.resource}</div>
                    <div style={{ fontSize:11, color:C.light }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:C.mid }}>{t.week}</div>
                <div style={{ display:"flex", gap:14, marginTop:8 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{t.totalHours}h</div>
                    <div style={{ fontSize:10, color:C.light }}>Total</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:15, fontWeight:700, color:C.success }}>{t.billableHours}h</div>
                    <div style={{ fontSize:10, color:C.light }}>Billable</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:15, fontWeight:700, color:C.mid }}>{t.totalHours-t.billableHours}h</div>
                    <div style={{ fontSize:10, color:C.light }}>Non-Bill</div>
                  </div>
                </div>
                {t.submittedOn && <div style={{ fontSize:11, color:C.light, marginTop:8 }}>Submitted {t.submittedOn}</div>}
              </div>
            ))}
            {/* recently actioned */}
            {done.length>0&&(
              <>
                <div style={{ fontSize:12, fontWeight:700, color:C.light, textTransform:"uppercase", letterSpacing:".6px", marginTop:12, marginBottom:8 }}>Actioned ({done.length})</div>
                {done.map(d=>(
                  <div key={d.id} className="card" style={{ padding:"12px 16px", opacity:.7, borderLeft:`3px solid ${d.act==="approve"?C.success:C.danger}` }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:700, color:C.mid }}>{d.id}</span>
                      <Bdg status={d.act==="approve"?"Approved":"Rejected"} />
                    </div>
                    {d.comment&&<div style={{ fontSize:11.5, color:C.mid, marginTop:6, fontStyle:"italic" }}>"{d.comment}"</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* detail panel */}
        <div style={{ flex:1 }}>
          {!ts ? (
            <div className="card" style={{ padding:48, textAlign:"center", color:C.light }}>
              <Ic n="eye" s={44} c="#e2e8f0" />
              <div style={{ marginTop:14, fontSize:14, fontWeight:600 }}>Select a timesheet to review</div>
              <div style={{ fontSize:12.5, marginTop:4 }}>Click any entry in the queue on the left</div>
            </div>
          ) : (
            <div className="fade-in">
              <div className="card" style={{ padding:"20px 24px", marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                  <div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:700, color:C.text }}>{ts.id} — {ts.week}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:5 }}>
                      <Avatar name={ts.resource} sz={26} bg={C.purple} />
                      <div style={{ fontSize:13.5, fontWeight:600, color:C.text }}>{ts.resource}</div>
                      <div style={{ fontSize:12, color:C.light }}>· {ts.role}</div>
                      <Bdg status={ts.status} />
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:18, textAlign:"center" }}>
                    {[{l:"Total",v:`${ts.totalHours}h`,c:ts.totalHours>40?C.danger:C.text},{l:"Billable",v:`${ts.billableHours}h`,c:C.success},{l:"Non-Bill",v:`${ts.totalHours-ts.billableHours}h`,c:C.mid}].map((m,i)=>(
                      <div key={i}>
                        <div style={{ fontSize:20, fontWeight:800, color:m.c, fontFamily:"'Sora',sans-serif" }}>{m.v}</div>
                        <div style={{ fontSize:11, color:C.light }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* breakdown table */}
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                    <thead>
                      <tr style={{ background:C.bg, borderBottom:`1.5px solid ${C.border}` }}>
                        <th style={{ padding:"9px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:C.light }}>PROJECT / TASK</th>
                        {DAYS.map(d=><th key={d} style={{ padding:"9px 8px", textAlign:"center", fontSize:11, fontWeight:700, color:C.light }}>{d}</th>)}
                        <th style={{ padding:"9px 8px", textAlign:"center", fontSize:11, fontWeight:700, color:C.primary }}>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ts.rows.map((r,i)=>{
                        const proj = PROJECTS.find(p=>p.id===r.projectId);
                        const rt = r.hours.reduce((a,h)=>a+h,0);
                        return (
                          <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
                            <td style={{ padding:"10px 12px" }}>
                              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{proj?.name||r.projectId}</div>
                              <div style={{ fontSize:11.5, color:C.light }}>{r.task} · <span style={{ color:proj?.billingMode==="Billable"?C.success:C.mid }}>{proj?.billingMode||"Billable"}</span></div>
                            </td>
                            {r.hours.map((h,di)=>(
                              <td key={di} style={{ padding:"10px 8px", textAlign:"center" }}>
                                <span style={{ fontSize:13.5, fontWeight:h>0?600:400, color:h>0?C.text:C.light }}>{h>0?`${h}h`:"–"}</span>
                              </td>
                            ))}
                            <td style={{ padding:"10px 8px", textAlign:"center" }}>
                              <span style={{ fontSize:14, fontWeight:700, color:C.primary }}>{rt}h</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* approve / reject */}
              <div className="card" style={{ padding:"20px 24px" }}>
                <div className="section-label">Review Decision</div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12.5, fontWeight:600, color:C.mid, display:"block", marginBottom:6 }}>Comment {action==="reject"&&<span style={{ color:C.danger }}>*</span>}</label>
                  <textarea className="finput" rows={3} value={comment} onChange={e=>setComment(e.target.value)}
                    placeholder={action==="reject"?"Explain the reason for rejection (required)…":"Optional comment for the resource…"} style={{ resize:"vertical" }} />
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn-s" style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"11px 0" }}
                    onClick={()=>{setAction("approve");handleAction("approve");}}>
                    <Ic n="check" s={15} c="#166534" />Approve
                  </button>
                  <button className="btn-d" style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"11px 0" }}
                    onClick={()=>setAction("reject")} disabled={action==="reject"&&!comment.trim()}>
                    <Ic n="x" s={15} c={C.danger} />
                    {action==="reject"&&!comment.trim()?"Add comment to reject":"Reject"}
                  </button>
                  {action==="reject"&&comment.trim()&&(
                    <button className="btn-d" style={{ padding:"11px 20px", fontWeight:700 }} onClick={()=>handleAction("reject")}>
                      Confirm Reject
                    </button>
                  )}
                </div>
                {action==="reject"&&!comment.trim()&&(
                  <div style={{ fontSize:12, color:C.danger, marginTop:8, display:"flex", alignItems:"center", gap:5 }}>
                    <Ic n="info" s={13} c={C.danger} />A rejection comment is required before rejecting.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function TimesheetModule() {
  const [page, setPage] = useState("list");
  const [editId, setEditId] = useState(null);

  return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", background:C.bg, minHeight:"100vh" }}>
        <Sidebar page={page} setPage={setPage} />
        <div style={{ marginLeft:220, flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" }}>
          <TopBar
            title={page==="list"?"My Timesheets":page==="entry"?"Timesheet Entry":"Approval Queue"}
            sub={page==="list"?"Week of 10 Mar – 16 Mar 2026 · Current week":page==="entry"?"Weekly hour log":"Pending approvals for your team"}
            crumb={`Timesheets › ${page==="list"?"Overview":page==="entry"?"Entry":"Approvals"}`}
          />
          {page==="list" && <TimesheetList setPage={setPage} setEditId={setEditId} />}
          {page==="entry" && <TimesheetEntry setPage={setPage} editId={editId} />}
          {page==="approval" && <ApprovalQueue setPage={setPage} setEditId={setEditId} />}
        </div>
      </div>
    </>
  );
}
