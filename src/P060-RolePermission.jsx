import { useState, useMemo } from "react";

/* ─────────────────── CONSTANTS ─────────────────── */
const COLORS = {
  primary:"#4f46e5", primaryLight:"#eef2ff", primaryMid:"#6366f1",
  success:"#059669", successLight:"#ecfdf5",
  warning:"#d97706", warningLight:"#fffbeb",
  danger:"#dc2626",  dangerLight:"#fef2f2",
  info:"#0891b2",    infoLight:"#e0f7fa",
  bg:"#f4f6fb", text:"#0f172a", textMid:"#475569", textLight:"#94a3b8",
  border:"#e2e8f0", white:"#ffffff",
};

const MODULES = [
  { key:"dashboard",       label:"Dashboard",           group:"Core" },
  { key:"sales_req",       label:"Sales Requirements",  group:"Sales" },
  { key:"sow",             label:"SOW Management",      group:"Sales" },
  { key:"projects",        label:"Projects",            group:"Delivery" },
  { key:"resource_req",    label:"Resource Requests",   group:"Delivery" },
  { key:"resource_alloc",  label:"Resource Allocation", group:"Delivery" },
  { key:"resource_mgmt",   label:"Resource Management", group:"HR & Ops" },
  { key:"timesheets",      label:"Timesheets",          group:"HR & Ops" },
  { key:"invoices",        label:"Invoice Requests",    group:"Finance" },
  { key:"approvals",       label:"Approval Workflows",  group:"Finance" },
  { key:"hr_onboarding",   label:"HR & Onboarding",     group:"HR & Ops" },
  { key:"notifications",   label:"Notifications",       group:"Core" },
  { key:"users",           label:"User Management",     group:"Admin" },
  { key:"roles",           label:"Roles & Permissions", group:"Admin" },
  { key:"audit",           label:"Audit Trail",         group:"Admin" },
  { key:"settings",        label:"Settings / Master",   group:"Admin" },
];

const ACTIONS = ["view","create","edit","delete","approve","export"];
const ACTION_LABELS = { view:"View", create:"Create", edit:"Edit", delete:"Delete", approve:"Approve", export:"Export" };
const ACTION_COLORS = { view:"#2563eb", create:"#059669", edit:"#d97706", delete:"#dc2626", approve:"#7c3aed", export:"#0891b2" };

// Permission presets per role
const buildPerms = (overrides) => {
  const base = {};
  MODULES.forEach(m => {
    base[m.key] = { view:false, create:false, edit:false, delete:false, approve:false, export:false };
  });
  Object.entries(overrides).forEach(([mod, acts]) => {
    if (base[mod]) acts.forEach(a => { base[mod][a] = true; });
  });
  return base;
};

const SEED_ROLES = [
  {
    id:"ROLE-001", name:"Super Admin", description:"Full unrestricted access to all modules and system settings.", color:"#4f46e5", icon:"shield",
    userCount:2, isSystem:true, created:"2025-01-01",
    users:["Suresh Babu","Meena Krishnan"],
    permissions: (() => { const p = buildPerms({}); MODULES.forEach(m => { Object.keys(p[m.key]).forEach(a => p[m.key][a]=true); }); return p; })(),
  },
  {
    id:"ROLE-002", name:"Admin", description:"Manages users, roles, settings and has broad read/write across most modules.", color:"#7c3aed", icon:"cog",
    userCount:3, isSystem:true, created:"2025-01-01",
    users:["Tom Ashby","Rachel Kim","Priya Iyer"],
    permissions: buildPerms({
      dashboard:["view"], sales_req:["view","create","edit","export"], sow:["view","create","edit","export"],
      projects:["view","create","edit","export"], resource_req:["view","create","edit","export"],
      resource_alloc:["view","create","edit"], resource_mgmt:["view","create","edit"],
      timesheets:["view","edit","approve"], invoices:["view","create","edit","approve","export"],
      approvals:["view","edit","approve"], hr_onboarding:["view","create","edit"],
      notifications:["view","create"], users:["view","create","edit","delete"],
      roles:["view","create","edit"], audit:["view","export"], settings:["view","create","edit"],
    }),
  },
  {
    id:"ROLE-003", name:"Delivery Head", description:"Oversees project delivery, approves resource requests and timesheets, manages allocations.", color:"#0891b2", icon:"briefcase",
    userCount:4, isSystem:false, created:"2025-03-12",
    users:["Dana Mercer","Rachel Kim","Sam Keller","Theo Vasquez"],
    permissions: buildPerms({
      dashboard:["view"], sales_req:["view","export"], sow:["view","export"],
      projects:["view","create","edit","export"], resource_req:["view","create","edit","approve","export"],
      resource_alloc:["view","create","edit","approve"], resource_mgmt:["view","edit"],
      timesheets:["view","edit","approve","export"], invoices:["view","approve","export"],
      approvals:["view","approve"], hr_onboarding:["view"],
      notifications:["view"], users:["view"], audit:["view"],
    }),
  },
  {
    id:"ROLE-004", name:"Project Manager", description:"Manages project scope, milestones, resources, and tracks timesheets for their projects.", color:"#059669", icon:"clipboard",
    userCount:7, isSystem:false, created:"2025-03-12",
    users:["Lian Zhou","Amit Joshi","Ravi Shankar","Sneha Pillai","Dana Mercer","Tom Ashby","Rachel Kim"],
    permissions: buildPerms({
      dashboard:["view"], sales_req:["view"],
      sow:["view"], projects:["view","create","edit","export"],
      resource_req:["view","create","edit","export"], resource_alloc:["view","edit"],
      resource_mgmt:["view"], timesheets:["view","edit","approve","export"],
      invoices:["view"], approvals:["view"], notifications:["view"],
    }),
  },
  {
    id:"ROLE-005", name:"Sales Manager", description:"Creates and manages sales requirements, SOWs, and monitors pipeline and client engagements.", color:"#d97706", icon:"chart",
    userCount:4, isSystem:false, created:"2025-04-01",
    users:["Dana Mercer","Lian Zhou","Sam Keller","Theo Vasquez"],
    permissions: buildPerms({
      dashboard:["view","export"], sales_req:["view","create","edit","delete","export"],
      sow:["view","create","edit","export"], projects:["view","export"],
      invoices:["view","create","export"], notifications:["view"],
    }),
  },
  {
    id:"ROLE-006", name:"Resource Manager", description:"Handles resource allocation, bench management, and staffing requests.", color:"#8b5cf6", icon:"users",
    userCount:3, isSystem:false, created:"2025-04-01",
    users:["Priya Iyer","Ravi Shankar","Meena Krishnan"],
    permissions: buildPerms({
      dashboard:["view"], resource_req:["view","edit","approve","export"],
      resource_alloc:["view","create","edit","approve","export"], resource_mgmt:["view","create","edit","export"],
      timesheets:["view","export"], hr_onboarding:["view","edit"], notifications:["view"],
    }),
  },
  {
    id:"ROLE-007", name:"Finance", description:"Manages invoices, approves financial requests, and exports financial reports.", color:"#0891b2", icon:"dollar",
    userCount:2, isSystem:false, created:"2025-04-15",
    users:["Meena Krishnan","Amit Joshi"],
    permissions: buildPerms({
      dashboard:["view"], invoices:["view","create","edit","approve","export"],
      approvals:["view","approve"], timesheets:["view","export"],
      sales_req:["view","export"], sow:["view","export"],
      resource_req:["view","export"], audit:["view","export"], notifications:["view"],
    }),
  },
  {
    id:"ROLE-008", name:"HR", description:"Manages onboarding, employee records, and supports resource management.", color:"#e11d48", icon:"id-card",
    userCount:2, isSystem:false, created:"2025-05-01",
    users:["Priya Iyer","Sneha Pillai"],
    permissions: buildPerms({
      dashboard:["view"], hr_onboarding:["view","create","edit","export"],
      resource_mgmt:["view","edit"], timesheets:["view","export"],
      notifications:["view"], users:["view"],
    }),
  },
  {
    id:"ROLE-009", name:"Read Only", description:"View-only access to all non-admin modules. Cannot create, edit, or delete any records.", color:"#64748b", icon:"eye",
    userCount:5, isSystem:false, created:"2025-06-01",
    users:["Guest User","Client Viewer","Temp Consultant A","Temp Consultant B","Temp Consultant C"],
    permissions: buildPerms({
      dashboard:["view"], sales_req:["view"], sow:["view"], projects:["view"],
      resource_req:["view"], resource_alloc:["view"], resource_mgmt:["view"],
      timesheets:["view"], invoices:["view"], notifications:["view"],
    }),
  },
];

const GROUP_ORDER = ["Core","Sales","Delivery","Finance","HR & Ops","Admin"];
const avColor = n => `hsl(${((n||"").charCodeAt(0)*17+23)%360},45%,40%)`;
const initials = n => (n||"").split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2);
const countPerms = perms => Object.values(perms).reduce((t,m) => t + Object.values(m).filter(Boolean).length, 0);
const totalPerms = MODULES.length * ACTIONS.length;

/* ─────────────────── CSS ─────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#f4f6fb;color:#0f172a}
  ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
  .sc{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;margin-bottom:18px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .stitle{font-family:'Sora',sans-serif;font-size:11.5px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid #f1f5f9}
  .bp{background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(99,102,241,.3)}
  .bp:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.4)}
  .bg{background:#fff;border:1px solid #e2e8f0;color:#64748b;border-radius:9px;padding:8px 16px;font-size:13px;cursor:pointer;transition:all .15s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .bg:hover{background:#f8fafc;color:#1e293b;border-color:#cbd5e1}
  .bd{background:#fff;border:1px solid #fecaca;color:#dc2626;border-radius:9px;padding:8px 14px;font-size:13px;cursor:pointer;transition:all .15s}
  .bd:hover{background:#fef2f2}
  .fi{background:#fff;border:1px solid #e2e8f0;color:#1e293b;border-radius:8px;padding:8px 12px;font-size:13px;outline:none;transition:border .15s;width:100%}
  .fi:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
  .fi::placeholder{color:#94a3b8}
  .fs{background:#fff;border:1px solid #e2e8f0;color:#374151;border-radius:8px;padding:8px 12px;font-size:13px;cursor:pointer;outline:none}
  .tb{background:none;border:none;padding:9px 18px;font-size:13px;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;color:#94a3b8;transition:all .15s}
  .tb.on{color:#4f46e5;border-bottom-color:#4f46e5}.tb:hover:not(.on){color:#475569}
  .trow:hover{background:#f8faff!important}
  .trow:hover .ra{opacity:1!important}.ra{opacity:0;transition:opacity .15s}
  .sth{cursor:pointer;user-select:none;white-space:nowrap}.sth:hover{color:#4f46e5}
  .cb{accent-color:#6366f1;width:15px;height:15px;cursor:pointer}
  .toast{position:fixed;bottom:28px;right:28px;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:9999;animation:sup .3s ease}
  @keyframes sup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  .fade-in{animation:fi2 .2s ease}
  @keyframes fi2{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .rcard{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px 22px;cursor:pointer;transition:all .2s;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .rcard:hover{border-color:#c7d2fe;box-shadow:0 4px 16px rgba(99,102,241,.12);transform:translateY(-1px)}
  .rcard.sel{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}
  .ptog{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;font-size:11px}
  .ptog.on{background:#4f46e5;color:#fff}
  .ptog.off{background:#f1f5f9;color:#94a3b8;border:1px solid #e2e8f0}
  .ptog.on:hover{background:#4338ca}
  .ptog.off:hover{background:#e0e7ff;color:#4f46e5;border-color:#a5b4fc}
  .row-all{cursor:pointer;font-size:11px;color:#6366f1;font-weight:600;padding:2px 8px;border-radius:6px;border:1px solid #c7d2fe;background:#eef2ff;transition:all .15s}
  .row-all:hover{background:#e0e7ff}
  .col-all{cursor:pointer;font-size:10px;color:#6366f1;font-weight:700;writing-mode:horizontal-tb;padding:2px 6px;border-radius:5px;border:1px solid #c7d2fe;background:#eef2ff;white-space:nowrap;transition:all .15s}
  .col-all:hover{background:#e0e7ff}
  .modal-bg{position:fixed;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(3px);z-index:1000;display:flex;align-items:center;justify-content:center}
  .modal{background:#fff;border-radius:18px;box-shadow:0 24px 64px rgba(0,0,0,.2);width:540px;max-width:95vw;max-height:88vh;overflow-y:auto}
  .pgbar{height:5px;border-radius:3px;background:#e2e8f0;overflow:hidden}
  .pgbar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#4f46e5,#818cf8);transition:width .4s}
`;

/* ─────────────────── ICON ─────────────────── */
const Icon = ({ name, size=16, color="currentColor" }) => {
  const s = { width:size, height:size, display:"inline-block", verticalAlign:"middle", color };
  const icons = {
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    plus:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    copy:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    users:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    check:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    x:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    arrow:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
    eye:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    info:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    lock:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    person: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return <span style={s}>{icons[name] || null}</span>;
};

/* ─────────────────── SHARED UI ─────────────────── */
const Avatar = ({ name, size=30 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:avColor(name), color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.36, fontWeight:700, flexShrink:0 }}>
    {initials(name)}
  </div>
);

const Badge = ({ label, color, bg }) => (
  <span style={{ background:bg||"#eef2ff", color:color||COLORS.primary, borderRadius:6, padding:"2px 9px", fontSize:11.5, fontWeight:600, display:"inline-block", whiteSpace:"nowrap" }}>
    {label}
  </span>
);

const Toast = ({ msg, type }) => {
  const bg = type==="success" ? "#059669" : type==="danger" ? "#dc2626" : "#4f46e5";
  return <div className="toast" style={{ background:bg }}>{msg}</div>;
};

const Shell = ({ crumbs, children }) => (
  <div style={{ minHeight:"100vh", background:COLORS.bg, fontFamily:"'DM Sans',sans-serif" }}>
    <style>{CSS}</style>
    <div style={{ background:"#fff", borderBottom:`1px solid ${COLORS.border}`, padding:"0 32px", position:"sticky", top:0, zIndex:50, boxShadow:"0 1px 3px rgba(0,0,0,.05)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, height:52, fontSize:13 }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
            {i>0 && <span style={{ color:COLORS.textLight }}>/</span>}
            <span style={{ color: i===crumbs.length-1 ? COLORS.text : COLORS.primary, fontWeight: i===crumbs.length-1 ? 600 : 500, cursor: c.onClick ? "pointer" : "default" }}
              onClick={c.onClick}>{c.label}</span>
          </span>
        ))}
      </div>
    </div>
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"28px 32px" }}>{children}</div>
  </div>
);

/* ─────────────────── PERMISSION MATRIX ─────────────────── */
const PermMatrix = ({ perms, onChange, readOnly=false }) => {
  const groups = GROUP_ORDER.map(g => ({ group:g, modules:MODULES.filter(m => m.group===g) }));

  const toggleCell = (mod, act) => {
    if (readOnly) return;
    onChange(mod, act, !perms[mod][act]);
  };

  const toggleRow = (mod) => {
    if (readOnly) return;
    const rowPerms = perms[mod];
    const allOn = ACTIONS.every(a => rowPerms[a]);
    ACTIONS.forEach(a => onChange(mod, a, !allOn));
  };

  const toggleCol = (act) => {
    if (readOnly) return;
    const allOn = MODULES.every(m => perms[m.key][act]);
    MODULES.forEach(m => onChange(m.key, act, !allOn));
  };

  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:0 }}>
        <thead>
          <tr>
            <th style={{ textAlign:"left", padding:"8px 12px 10px", fontSize:11, color:COLORS.textLight, fontWeight:700, textTransform:"uppercase", letterSpacing:".5px", minWidth:180 }}>Module</th>
            {ACTIONS.map(a => (
              <th key={a} style={{ textAlign:"center", padding:"8px 8px 10px", minWidth:72 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:11.5, color:ACTION_COLORS[a], fontWeight:700, textTransform:"uppercase", letterSpacing:".5px" }}>{ACTION_LABELS[a]}</span>
                  {!readOnly && (
                    <button className="col-all" onClick={() => toggleCol(a)} title={`Toggle all ${ACTION_LABELS[a]}`}>ALL</button>
                  )}
                </div>
              </th>
            ))}
            {!readOnly && <th style={{ width:48 }}></th>}
          </tr>
        </thead>
        <tbody>
          {groups.map(({ group, modules }) => (
            <>
              <tr key={`g-${group}`}>
                <td colSpan={ACTIONS.length + (readOnly?1:2)} style={{ padding:"10px 12px 4px", fontSize:11, fontWeight:700, color:COLORS.textLight, textTransform:"uppercase", letterSpacing:".7px", background:COLORS.bg, borderTop:`1px solid ${COLORS.border}`, borderBottom:`1px solid ${COLORS.border}` }}>
                  {group}
                </td>
              </tr>
              {modules.map((mod, ri) => {
                const rowPerms = perms[mod.key];
                const enabledCount = ACTIONS.filter(a => rowPerms[a]).length;
                const allOn = enabledCount === ACTIONS.length;
                return (
                  <tr key={mod.key} style={{ background: ri%2===0 ? "#fff" : "#fafbfe" }}>
                    <td style={{ padding:"9px 12px", fontSize:13, color:COLORS.text, fontWeight:500, borderBottom:`1px solid ${COLORS.border}` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span>{mod.label}</span>
                        {enabledCount > 0 && (
                          <span style={{ fontSize:10.5, color:COLORS.primary, background:COLORS.primaryLight, borderRadius:5, padding:"1px 6px", fontWeight:600 }}>{enabledCount}/{ACTIONS.length}</span>
                        )}
                      </div>
                    </td>
                    {ACTIONS.map(act => (
                      <td key={act} style={{ textAlign:"center", padding:"9px 8px", borderBottom:`1px solid ${COLORS.border}` }}>
                        <button
                          className={`ptog ${rowPerms[act] ? "on" : "off"}`}
                          style={{ margin:"0 auto" }}
                          onClick={() => toggleCell(mod.key, act)}
                          title={`${rowPerms[act]?"Revoke":"Grant"} ${ACTION_LABELS[act]} on ${mod.label}`}
                          disabled={readOnly}
                        >
                          {rowPerms[act] ? <Icon name="check" size={11} /> : ""}
                        </button>
                      </td>
                    ))}
                    {!readOnly && (
                      <td style={{ textAlign:"center", padding:"9px 8px", borderBottom:`1px solid ${COLORS.border}` }}>
                        <button className="row-all" onClick={() => toggleRow(mod.key)} title={allOn?"Clear all":"Grant all"}>
                          {allOn ? "None" : "All"}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ─────────────────── PAGE: ROLE LIST (P-060) ─────────────────── */
const RoleList = ({ setPage, setSelectedRole }) => {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [roles, setRoles] = useState(SEED_ROLES);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const filtered = useMemo(() => roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  ), [roles, search]);

  const handleDuplicate = (role) => {
    const copy = {
      ...role,
      id: `ROLE-${String(roles.length+1).padStart(3,"0")}`,
      name: `${role.name} (Copy)`,
      isSystem: false,
      userCount: 0,
      users: [],
      created: new Date().toISOString().slice(0,10),
    };
    setRoles(rs => [...rs, copy]);
    showToast(`"${copy.name}" created from duplicate.`);
  };

  const handleDelete = (role) => {
    setRoles(rs => rs.filter(r => r.id !== role.id));
    setDeleteTarget(null);
    showToast(`Role "${role.name}" deleted.`, "danger");
  };

  const totalUsers = roles.reduce((s, r) => s + r.userCount, 0);
  const customRoles = roles.filter(r => !r.isSystem).length;

  return (
    <Shell crumbs={[{ label:"Administration" }, { label:"Roles & Permissions" }]}>
      {toast && <Toast {...toast} />}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:COLORS.text, marginBottom:4 }}>Roles &amp; Permissions</h1>
          <p style={{ fontSize:13.5, color:COLORS.textMid }}>Define access levels and control what each role can see or do across the platform.</p>
        </div>
        <button className="bp" onClick={() => { setSelectedRole(null); setPage("edit"); }} style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Icon name="plus" size={14} />Create Role
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[
          { label:"Total Roles", value:roles.length, sub:"Platform roles", color:COLORS.primary, bg:COLORS.primaryLight },
          { label:"System Roles", value:roles.filter(r=>r.isSystem).length, sub:"Protected defaults", color:"#7c3aed", bg:"#f5f3ff" },
          { label:"Custom Roles", value:customRoles, sub:"User-defined", color:COLORS.success, bg:COLORS.successLight },
          { label:"Users Assigned", value:totalUsers, sub:"Across all roles", color:COLORS.warning, bg:COLORS.warningLight },
        ].map(s => (
          <div key={s.label} className="sc" style={{ padding:"18px 22px", marginBottom:0 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".6px", color:COLORS.textLight, marginBottom:8 }}>{s.label}</div>
            <div style={{ fontSize:28, fontWeight:700, fontFamily:"'Sora',sans-serif", color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:COLORS.textLight, marginTop:3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="sc" style={{ padding:"16px 20px", marginBottom:18 }}>
        <div style={{ position:"relative", maxWidth:380 }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:COLORS.textLight }}>
            <Icon name="search" size={15} />
          </span>
          <input className="fi" placeholder="Search roles…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:32 }} />
        </div>
      </div>

      {/* Role Cards Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:18 }}>
        {filtered.map(role => {
          const pct = Math.round((countPerms(role.permissions) / totalPerms) * 100);
          return (
            <div key={role.id} className="rcard fade-in" onClick={() => { setSelectedRole(role); setPage("detail"); }}>
              {/* Top strip */}
              <div style={{ height:5, borderRadius:"8px 8px 0 0", background:role.color, margin:"-20px -22px 16px", width:"calc(100% + 44px)" }} />

              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:42, height:42, borderRadius:11, background:`${role.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name="shield" size={20} color={role.color} />
                  </div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:700, color:COLORS.text }}>{role.name}</span>
                      {role.isSystem && (
                        <span style={{ fontSize:10, fontWeight:700, color:"#7c3aed", background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:5, padding:"1px 6px" }}>SYSTEM</span>
                      )}
                    </div>
                    <div style={{ fontSize:12, color:COLORS.textLight, marginTop:1 }}>{role.id}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6 }} onClick={e => e.stopPropagation()}>
                  <button className="bg" style={{ padding:"5px 10px", fontSize:12 }}
                    onClick={() => { setSelectedRole(role); setPage("edit"); }}
                    title="Edit Role">
                    <Icon name="edit" size={13} />
                  </button>
                  <button className="bg" style={{ padding:"5px 10px", fontSize:12 }}
                    onClick={() => handleDuplicate(role)}
                    title="Duplicate Role">
                    <Icon name="copy" size={13} />
                  </button>
                  {!role.isSystem && (
                    <button className="bd" style={{ padding:"5px 10px", fontSize:12 }}
                      onClick={() => setDeleteTarget(role)}
                      title="Delete Role">
                      <Icon name="trash" size={13} />
                    </button>
                  )}
                </div>
              </div>

              <p style={{ fontSize:13, color:COLORS.textMid, margin:"12px 0 14px", lineHeight:1.55 }}>{role.description}</p>

              {/* Permission bar */}
              <div style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:11.5, color:COLORS.textLight, fontWeight:600 }}>Permission coverage</span>
                  <span style={{ fontSize:12, color:role.color, fontWeight:700 }}>{pct}%</span>
                </div>
                <div className="pgbar">
                  <div className="pgbar-fill" style={{ width:`${pct}%`, background:role.color }} />
                </div>
              </div>

              {/* Footer */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:`1px solid ${COLORS.border}`, paddingTop:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Icon name="users" size={13} color={COLORS.textLight} />
                  <span style={{ fontSize:12.5, color:COLORS.textMid, fontWeight:500 }}>{role.userCount} user{role.userCount!==1?"s":""}</span>
                </div>
                <div style={{ display:"flex", gap:-6 }}>
                  {role.users.slice(0,4).map((u,i) => (
                    <div key={i} style={{ marginLeft: i>0 ? -8 : 0, border:"2px solid #fff", borderRadius:"50%", zIndex:4-i }}>
                      <Avatar name={u} size={26} />
                    </div>
                  ))}
                  {role.users.length > 4 && (
                    <div style={{ width:26, height:26, borderRadius:"50%", background:COLORS.bg, border:`2px solid #fff`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:COLORS.textMid, marginLeft:-8 }}>
                      +{role.users.length-4}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="modal-bg">
          <div className="modal" style={{ padding:32, maxWidth:420 }}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:COLORS.dangerLight, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                <Icon name="trash" size={22} color={COLORS.danger} />
              </div>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:700, marginBottom:8 }}>Delete Role?</h3>
              <p style={{ fontSize:13.5, color:COLORS.textMid, lineHeight:1.6 }}>
                Deleting <strong>"{deleteTarget.name}"</strong> will remove all permission assignments. This cannot be undone.
              </p>
              {deleteTarget.userCount > 0 && (
                <div style={{ marginTop:12, background:COLORS.warningLight, border:`1px solid #fde68a`, borderRadius:8, padding:"10px 14px", fontSize:12.5, color:COLORS.warning }}>
                  <Icon name="info" size={13} /> {deleteTarget.userCount} user{deleteTarget.userCount>1?"s are":" is"} currently assigned to this role.
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="bg" style={{ flex:1 }} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="bd" style={{ flex:1, background:COLORS.danger, color:"#fff", border:"none" }} onClick={() => handleDelete(deleteTarget)}>Delete Role</button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
};

/* ─────────────────── PAGE: ROLE DETAIL / EDIT (P-061) ─────────────────── */
const RoleDetail = ({ role: initRole, setPage, isNew=false }) => {
  const [activeTab, setActiveTab] = useState("permissions");
  const [editing, setEditing] = useState(isNew);
  const [toast, setToast] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserSearch, setAddUserSearch] = useState("");

  const emptyRole = {
    id: `ROLE-${String(Math.floor(Math.random()*900)+100)}`,
    name:"", description:"", color:"#4f46e5", icon:"shield",
    userCount:0, isSystem:false, users:[],
    created: new Date().toISOString().slice(0,10),
    permissions: buildPerms({}),
  };

  const [role, setRole] = useState(initRole || emptyRole);
  const [perms, setPerms] = useState(role.permissions);

  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };

  const togglePerm = (mod, act, val) => {
    setPerms(p => ({ ...p, [mod]: { ...p[mod], [act]: val } }));
  };

  const handleSave = () => {
    if (!role.name.trim()) { showToast("Role name is required.", "danger"); return; }
    setEditing(false);
    showToast(`Role "${role.name}" saved successfully.`);
  };

  const allUsers = ["Suresh Babu","Meena Krishnan","Tom Ashby","Rachel Kim","Priya Iyer","Dana Mercer","Sam Keller","Theo Vasquez","Lian Zhou","Amit Joshi","Ravi Shankar","Sneha Pillai"];
  const availableUsers = allUsers.filter(u => !role.users.includes(u) && u.toLowerCase().includes(addUserSearch.toLowerCase()));

  const addUser = (u) => { setRole(r => ({ ...r, users:[...r.users,u], userCount:r.userCount+1 })); };
  const removeUser = (u) => { setRole(r => ({ ...r, users:r.users.filter(x=>x!==u), userCount:r.userCount-1 })); };

  const pct = Math.round((countPerms(perms) / totalPerms) * 100);
  const grantedCount = countPerms(perms);

  const COLORS_LIST = ["#4f46e5","#7c3aed","#059669","#d97706","#0891b2","#e11d48","#64748b","#8b5cf6","#0d9488"];

  return (
    <Shell crumbs={[
      { label:"Roles & Permissions", onClick:() => setPage("list") },
      { label: isNew ? "New Role" : role.name },
    ]}>
      {toast && <Toast {...toast} />}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button className="bg" style={{ padding:"7px 10px" }} onClick={() => setPage("list")}>
            <Icon name="arrow" size={15} />
          </button>
          <div style={{ width:46, height:46, borderRadius:12, background:`${role.color}1a`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="shield" size={22} color={role.color} />
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:700, color:COLORS.text }}>
                {role.name || "New Role"}
              </h1>
              {role.isSystem && <Badge label="SYSTEM" color="#7c3aed" bg="#f5f3ff" />}
            </div>
            <div style={{ fontSize:12.5, color:COLORS.textLight, marginTop:2 }}>{role.id} · {role.userCount} user{role.userCount!==1?"s":""} assigned</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {editing ? (
            <>
              <button className="bg" onClick={() => { if(isNew) setPage("list"); else setEditing(false); }}>Cancel</button>
              <button className="bp" onClick={handleSave}>Save Role</button>
            </>
          ) : (
            !role.isSystem && (
              <button className="bp" onClick={() => setEditing(true)} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Icon name="edit" size={13} />Edit Role
              </button>
            )
          )}
        </div>
      </div>

      {/* Role Info (edit mode) */}
      {editing && (
        <div className="sc fade-in" style={{ marginBottom:20 }}>
          <div className="stitle">Role Details</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div>
              <label style={{ fontSize:11.5, fontWeight:700, color:COLORS.textMid, textTransform:"uppercase", letterSpacing:".5px", display:"block", marginBottom:6 }}>Role Name *</label>
              <input className="fi" value={role.name} onChange={e => setRole(r => ({ ...r, name:e.target.value }))} placeholder="e.g. Finance Approver" />
            </div>
            <div>
              <label style={{ fontSize:11.5, fontWeight:700, color:COLORS.textMid, textTransform:"uppercase", letterSpacing:".5px", display:"block", marginBottom:6 }}>Accent Color</label>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {COLORS_LIST.map(c => (
                  <button key={c} onClick={() => setRole(r => ({ ...r, color:c }))}
                    style={{ width:28, height:28, borderRadius:7, background:c, border: role.color===c ? "3px solid #1e293b" : "2px solid transparent", cursor:"pointer", transition:"all .15s" }} />
                ))}
              </div>
            </div>
            <div style={{ gridColumn:"span 2" }}>
              <label style={{ fontSize:11.5, fontWeight:700, color:COLORS.textMid, textTransform:"uppercase", letterSpacing:".5px", display:"block", marginBottom:6 }}>Description</label>
              <textarea className="fi" rows={2} value={role.description} onChange={e => setRole(r => ({ ...r, description:e.target.value }))} placeholder="Briefly describe what this role can do and who it's for…" style={{ resize:"vertical" }} />
            </div>
          </div>
        </div>
      )}

      {/* Summary bar */}
      <div className="sc" style={{ padding:"16px 22px", marginBottom:18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12.5, fontWeight:600, color:COLORS.textMid }}>Permission Coverage</span>
              <span style={{ fontSize:13, fontWeight:700, color:role.color }}>{pct}% &nbsp;·&nbsp; {grantedCount}/{totalPerms} permissions</span>
            </div>
            <div className="pgbar" style={{ height:7 }}>
              <div className="pgbar-fill" style={{ width:`${pct}%`, background:role.color }} />
            </div>
          </div>
          <div style={{ display:"flex", gap:20 }}>
            {ACTIONS.map(a => {
              const cnt = MODULES.filter(m => perms[m.key][a]).length;
              return (
                <div key={a} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:700, color: cnt>0 ? ACTION_COLORS[a] : COLORS.textLight }}>{cnt}</div>
                  <div style={{ fontSize:10.5, color:COLORS.textLight, fontWeight:600, textTransform:"uppercase" }}>{ACTION_LABELS[a]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom:`1px solid ${COLORS.border}`, marginBottom:20 }}>
        {[["permissions","Permissions"],["users","Users"]].map(([k,l]) => (
          <button key={k} className={`tb ${activeTab===k?"on":""}`} onClick={() => setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {/* PERMISSIONS TAB */}
      {activeTab === "permissions" && (
        <div className="sc fade-in" style={{ padding:0, overflow:"hidden" }}>
          <div style={{ padding:"18px 22px", borderBottom:`1px solid ${COLORS.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <span style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700 }}>Permission Matrix</span>
              <span style={{ fontSize:12.5, color:COLORS.textLight, marginLeft:10 }}>Toggle individual permissions per module</span>
            </div>
            {role.isSystem && (
              <span style={{ fontSize:12, color:"#7c3aed", background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:7, padding:"4px 10px", display:"flex", alignItems:"center", gap:5 }}>
                <Icon name="lock" size={12} color="#7c3aed" />System roles are read-only
              </span>
            )}
          </div>
          <PermMatrix perms={perms} onChange={togglePerm} readOnly={role.isSystem || !editing} />
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="fade-in">
          <div className="sc" style={{ padding:0, overflow:"hidden" }}>
            <div style={{ padding:"18px 22px", borderBottom:`1px solid ${COLORS.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700 }}>{role.users.length} User{role.users.length!==1?"s":""} Assigned</span>
              {!role.isSystem && (
                <button className="bp" style={{ fontSize:12.5, padding:"7px 14px", display:"flex", alignItems:"center", gap:5 }} onClick={() => setShowAddUser(true)}>
                  <Icon name="plus" size={13} />Assign User
                </button>
              )}
            </div>
            {role.users.length === 0 ? (
              <div style={{ padding:40, textAlign:"center", color:COLORS.textLight }}>
                <Icon name="users" size={32} color={COLORS.border} />
                <p style={{ marginTop:10, fontSize:13.5 }}>No users assigned to this role yet.</p>
              </div>
            ) : (
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:COLORS.bg }}>
                    {["User","Actions"].map(h => (
                      <th key={h} style={{ padding:"10px 20px", textAlign: h==="Actions"?"right":"left", fontSize:11, fontWeight:700, color:COLORS.textLight, textTransform:"uppercase", letterSpacing:".5px", borderBottom:`1px solid ${COLORS.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {role.users.map((u, i) => (
                    <tr key={u} className="trow" style={{ background: i%2===0 ? "#fff" : "#fafbfe" }}>
                      <td style={{ padding:"13px 20px", borderBottom:`1px solid ${COLORS.border}` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <Avatar name={u} size={32} />
                          <div>
                            <div style={{ fontSize:13.5, fontWeight:600, color:COLORS.text }}>{u}</div>
                            <div style={{ fontSize:11.5, color:COLORS.textLight }}>{u.replace(" ","").toLowerCase()}@company.com</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"13px 20px", textAlign:"right", borderBottom:`1px solid ${COLORS.border}` }}>
                        {!role.isSystem && (
                          <button className="bd ra" style={{ fontSize:12, padding:"5px 12px", display:"inline-flex", alignItems:"center", gap:5 }} onClick={() => removeUser(u)}>
                            <Icon name="x" size={11} />Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-bg">
          <div className="modal" style={{ padding:28 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:700 }}>Assign Users to {role.name}</h3>
              <button className="bg" style={{ padding:"5px 10px" }} onClick={() => { setShowAddUser(false); setAddUserSearch(""); }}><Icon name="x" size={14} /></button>
            </div>
            <div style={{ position:"relative", marginBottom:14 }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:COLORS.textLight }}><Icon name="search" size={14} /></span>
              <input className="fi" placeholder="Search users…" value={addUserSearch} onChange={e => setAddUserSearch(e.target.value)} style={{ paddingLeft:32 }} />
            </div>
            <div style={{ maxHeight:280, overflowY:"auto" }}>
              {availableUsers.length === 0 && (
                <div style={{ padding:20, textAlign:"center", color:COLORS.textLight, fontSize:13.5 }}>No more users available.</div>
              )}
              {availableUsers.map(u => (
                <div key={u} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 4px", borderBottom:`1px solid ${COLORS.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <Avatar name={u} size={30} />
                    <div>
                      <div style={{ fontSize:13.5, fontWeight:600, color:COLORS.text }}>{u}</div>
                      <div style={{ fontSize:11.5, color:COLORS.textLight }}>{u.replace(" ","").toLowerCase()}@company.com</div>
                    </div>
                  </div>
                  <button className="bp" style={{ fontSize:12, padding:"5px 12px" }} onClick={() => { addUser(u); showToast(`${u} assigned to ${role.name}.`); }}>
                    Assign
                  </button>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, textAlign:"right" }}>
              <button className="bg" onClick={() => { setShowAddUser(false); setAddUserSearch(""); }}>Done</button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
};

/* ─────────────────── ROOT ─────────────────── */
export default function RolePermissionModule() {
  const [page, setPage] = useState("list");
  const [selectedRole, setSelectedRole] = useState(null);

  if (page === "list") return <RoleList setPage={setPage} setSelectedRole={setSelectedRole} />;
  if (page === "detail") return <RoleDetail role={selectedRole} setPage={setPage} isNew={false} />;
  if (page === "edit")   return <RoleDetail role={selectedRole} setPage={setPage} isNew={!selectedRole} />;
  return null;
}
