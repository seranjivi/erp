import { useState, useRef, useEffect } from "react";

/* ── GLOBAL STYLES ─────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body,input,select,textarea,button{font-family:'IBM Plex Sans',sans-serif}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#94a3b8}

.shell{display:flex;height:100vh;background:#f0f2f5;overflow:hidden}

/* SIDEBAR */
.sidebar{background:#fff;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;transition:width .2s ease;overflow:hidden;flex-shrink:0;position:relative;z-index:10}
.sidebar.open{width:188px}.sidebar.closed{width:44px}
.sb-logo{display:flex;align-items:center;gap:8px;padding:12px 10px 10px;border-bottom:1px solid #f1f5f9;flex-shrink:0}
.sb-logo-mark{width:22px;height:22px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
.sb-logo-text{font-size:12px;font-weight:600;color:#0f172a;white-space:nowrap;letter-spacing:.3px}
.sb-toggle{position:absolute;right:-10px;top:14px;width:20px;height:20px;background:#fff;border:1px solid #e2e8f0;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#94a3b8;z-index:20;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.sb-toggle:hover{background:#f8fafc;color:#374151;border-color:#cbd5e1}
.sb-section{font-size:9px;font-weight:700;color:#cbd5e1;text-transform:uppercase;letter-spacing:1px;padding:10px 10px 4px;white-space:nowrap;overflow:hidden}
.sb-item{display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-radius:6px;margin:1px 6px;transition:all .12s;color:#64748b;white-space:nowrap;overflow:hidden}
.sb-item:hover{background:#f8fafc;color:#1e293b}
.sb-item.active{background:#eff6ff;color:#1d4ed8}
.sb-item svg{flex-shrink:0}
.sb-label{font-size:11px;font-weight:500;white-space:nowrap}
.sb-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px}
.sb-bottom{margin-top:auto;padding:8px;border-top:1px solid #f1f5f9}
.sb-user{display:flex;align-items:center;gap:8px;padding:6px 4px;border-radius:6px;cursor:pointer;color:#64748b}
.sb-user:hover{background:#f8fafc;color:#374151}
.av{width:22px;height:22px;border-radius:50%;background:#1d4ed8;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0}

/* MAIN */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.topbar{background:#fff;border-bottom:1px solid #e2e8f0;padding:0 16px;height:42px;display:flex;align-items:center;gap:10px;flex-shrink:0}
.tb-title{font-size:12px;font-weight:600;color:#0f172a}
.tb-sub{font-size:10px;color:#94a3b8}
.tb-sep{color:#e2e8f0}
.search-wrap{display:flex;align-items:center;gap:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:0 8px;height:26px;margin-left:auto}
.search-wrap input{background:none;border:none;outline:none;font-size:11px;color:#374151;width:160px}
.search-wrap input::placeholder{color:#cbd5e1}
.tb-btn{display:flex;align-items:center;gap:5px;background:#1d4ed8;color:#fff;border:none;border-radius:6px;padding:5px 10px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap}
.tb-btn:hover{background:#1e40af}
.tb-btn-ghost{display:flex;align-items:center;gap:5px;background:transparent;color:#64748b;border:1px solid #e2e8f0;border-radius:6px;padding:4px 9px;font-size:11px;cursor:pointer}
.tb-btn-ghost:hover{border-color:#94a3b8;color:#374151}

/* CONTENT */
.content{flex:1;overflow:auto;padding:12px 14px}

/* FILTER BAR */
.filter-bar{display:flex;align-items:center;gap:6px;margin-bottom:10px;flex-wrap:wrap}
.filter-chip{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #e2e8f0;border-radius:5px;padding:3px 8px;font-size:10px;color:#64748b;cursor:pointer;transition:all .12s}
.filter-chip:hover{border-color:#93c5fd;color:#1d4ed8}
.filter-chip.active{background:#eff6ff;border-color:#3b82f6;color:#1d4ed8;font-weight:600}
.filter-chip select{background:none;border:none;outline:none;font-size:10px;color:inherit;cursor:pointer}

/* TABLE */
.tbl-wrap{background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}
.tbl{width:100%;border-collapse:collapse}
.tbl th{font-size:9.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;padding:7px 10px;background:#f8fafc;border-bottom:1px solid #e2e8f0;white-space:nowrap;text-align:left}
.tbl td{font-size:10.5px;color:#374151;padding:6px 10px;border-bottom:1px solid #f1f5f9;vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:#f8faff}
.tbl-id{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#6366f1;font-weight:500}
.tbl-title{font-weight:500;color:#0f172a;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tbl-client{color:#475569;font-size:10.5px}
.tbl-actions{display:flex;align-items:center;gap:4px;opacity:0;transition:opacity .12s}
.tbl tr:hover .tbl-actions{opacity:1}
.act-btn{display:flex;align-items:center;gap:3px;border:1px solid #e2e8f0;background:#fff;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;color:#64748b;white-space:nowrap}
.act-btn:hover{border-color:#3b82f6;color:#1d4ed8;background:#eff6ff}
.act-btn.lifecycle{border-color:#7c3aed;color:#7c3aed;background:#faf5ff}
.act-btn.lifecycle:hover{background:#ede9fe;border-color:#6d28d9}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:9.5px;font-weight:600;white-space:nowrap}
.stage-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}

/* LIFECYCLE PROGRESS BAR in table */
.lc-bar{display:flex;align-items:center;gap:2px}
.lc-seg{height:4px;border-radius:2px;flex:1;background:#e2e8f0}
.lc-seg.done{background:#3b82f6}
.lc-seg.active{background:#8b5cf6}

/* ═══════════════════ OVERLAY & MODAL ═══════════════════ */
.overlay{position:fixed;inset:0;background:rgba(10,17,32,.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(2px)}
.modal{background:#fff;border-radius:12px;width:100%;max-width:860px;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 32px 80px rgba(0,0,0,.3);overflow:hidden}

/* MODAL HEADER */
.modal-head{background:#fff;border-bottom:1px solid #e2e8f0;padding:11px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}
.modal-id{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:500;color:#6366f1;background:#f5f3ff;padding:2px 7px;border-radius:4px;border:1px solid #e0e7ff}
.modal-title{font-size:12px;font-weight:600;color:#0f172a;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.modal-client{font-size:10px;color:#94a3b8}
.modal-close{background:#f8fafc;border:1px solid #e2e8f0;color:#94a3b8;width:22px;height:22px;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1}
.modal-close:hover{background:#f1f5f9;color:#374151;border-color:#cbd5e1}

/* LIFECYCLE STEPPER */
.stepper{background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:8px 16px;display:flex;align-items:center;gap:0;flex-shrink:0;overflow-x:auto}
.step{display:flex;align-items:center;gap:0;flex:1;min-width:0}
.step-node{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:2px 6px;border-radius:5px;transition:background .12s;flex-shrink:0}
.step-node:hover{background:#f1f5f9}
.step-circle{width:22px;height:22px;border-radius:50%;border:1.5px solid #e2e8f0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#94a3b8;transition:all .15s;background:#fff}
.step-circle.done{background:#1d4ed8;border-color:#3b82f6;color:#fff}
.step-circle.current{background:#7c3aed;border-color:#8b5cf6;color:#fff;box-shadow:0 0 0 3px rgba(139,92,246,.15)}
.step-circle.locked{opacity:.4}
.step-label{font-size:8.5px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.step-label.done{color:#3b82f6}
.step-label.current{color:#7c3aed}
.step-connector{flex:1;height:1px;background:#e2e8f0;min-width:10px}
.step-connector.done{background:#3b82f6}

/* TAB BAR */
.tab-bar{display:flex;align-items:stretch;background:#f8fafc;border-bottom:1px solid #e2e8f0;flex-shrink:0;overflow-x:auto}
.tab{display:flex;align-items:center;gap:5px;padding:7px 12px;font-size:10.5px;font-weight:500;color:#94a3b8;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:all .12s;border-top:none;border-left:none;border-right:none;background:none}
.tab:hover{color:#374151;background:#f1f5f9}
.tab.active{color:#1d4ed8;border-bottom-color:#3b82f6;background:#fff;font-weight:600}
.tab.locked{opacity:.45;cursor:not-allowed}
.tab-dot{width:5px;height:5px;border-radius:50%}

/* TAB CONTENT */
.tab-body{flex:1;overflow-y:auto;padding:14px 16px}

/* FORM GRID */
.fg{display:grid;gap:8px 12px}
.fg-2{grid-template-columns:1fr 1fr}
.fg-3{grid-template-columns:1fr 1fr 1fr}
.fg-4{grid-template-columns:1fr 1fr 1fr 1fr}
.fg-full{grid-column:1/-1}
label.lbl{font-size:9.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px}
.fi{width:100%;border:1px solid #e2e8f0;border-radius:5px;padding:5px 8px;font-size:10.5px;color:#1e293b;outline:none;background:#fff;transition:border .12s}
.fi:focus{border-color:#6366f1;box-shadow:0 0 0 2px rgba(99,102,241,.1)}
.fi[disabled]{background:#f8fafc;color:#94a3b8;cursor:not-allowed}
.fi::placeholder{color:#cbd5e1}
select.fi{cursor:pointer}
textarea.fi{resize:vertical;min-height:56px}

/* SECTION HEADERS */
.sh{font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;padding:6px 0 4px;border-bottom:1px solid #f1f5f9;margin-bottom:6px;grid-column:1/-1}

/* INFO BLOCKS */
.info-row{display:flex;padding:5px 0;border-bottom:1px solid #f8fafc}
.info-row:last-child{border-bottom:none}
.info-key{font-size:9.5px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;min-width:120px;flex-shrink:0;padding-top:1px}
.info-val{font-size:10.5px;color:#1e293b;flex:1;font-weight:500}
.info-val.mono{font-family:'IBM Plex Mono',monospace;font-size:10px}

/* TAGS */
.tags{display:flex;flex-wrap:wrap;gap:3px;margin-top:3px}
.tag{display:inline-flex;align-items:center;gap:4px;background:#eff6ff;color:#1d4ed8;border-radius:3px;padding:2px 6px;font-size:9.5px;font-weight:600}
.tag.purple{background:#faf5ff;color:#7c3aed}
.tag.green{background:#f0fdf4;color:#16a34a}
.tag.orange{background:#fff7ed;color:#c2410c}
.tag.gray{background:#f8fafc;color:#64748b;border:1px solid #e2e8f0}
.tag-x{background:none;border:none;cursor:pointer;color:inherit;opacity:.6;padding:0 1px;font-size:11px;line-height:1}
.tag-x:hover{opacity:1}

/* RESOURCE CARDS */
.res-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.res-card{border:1px solid #e2e8f0;border-radius:7px;padding:9px 10px;cursor:pointer;transition:all .12s}
.res-card:hover{border-color:#3b82f6;background:#f8faff}
.res-card.selected{border-color:#3b82f6;background:#eff6ff}
.res-name{font-size:11px;font-weight:600;color:#0f172a}
.res-meta{font-size:9.5px;color:#64748b;margin-top:2px}
.alloc-bar{height:3px;background:#e2e8f0;border-radius:2px;margin-top:5px;overflow:hidden}
.alloc-fill{height:100%;border-radius:2px;background:#3b82f6;transition:width .3s}

/* TIMELINE */
.tl-item{display:flex;gap:9px;margin-bottom:8px}
.tl-dot{width:7px;height:7px;border-radius:50%;background:#3b82f6;flex-shrink:0;margin-top:3px}
.tl-dot.gray{background:#cbd5e1}
.tl-dot.green{background:#10b981}
.tl-line{position:relative;padding-left:16px}
.tl-line::before{content:'';position:absolute;left:3px;top:10px;bottom:-8px;width:1px;background:#e2e8f0}
.tl-date{font-size:9px;color:#94a3b8;margin-bottom:1px;font-family:'IBM Plex Mono',monospace}
.tl-text{font-size:10.5px;color:#374151;font-weight:500}
.tl-sub{font-size:9.5px;color:#94a3b8}

/* MODAL FOOTER */
.modal-foot{background:#f8fafc;border-top:1px solid #e2e8f0;padding:9px 16px;display:flex;align-items:center;gap:6px;flex-shrink:0}
.foot-status{font-size:9.5px;color:#64748b;flex:1}
.btn{display:inline-flex;align-items:center;gap:5px;border-radius:5px;padding:5px 11px;font-size:10.5px;font-weight:600;cursor:pointer;border:none;transition:all .12s;white-space:nowrap}
.btn-primary{background:#1d4ed8;color:#fff}.btn-primary:hover{background:#1e40af}
.btn-secondary{background:#fff;color:#374151;border:1px solid #e2e8f0}.btn-secondary:hover{border-color:#94a3b8}
.btn-success{background:#059669;color:#fff}.btn-success:hover{background:#047857}
.btn-warning{background:#d97706;color:#fff}.btn-warning:hover{background:#b45309}
.btn-danger{background:#fff;color:#dc2626;border:1px solid #fca5a5}.btn-danger:hover{background:#fef2f2}
.btn-ghost{background:transparent;color:#64748b;border:1px solid #e2e8f0}.btn-ghost:hover{color:#374151}
.btn-purple{background:#7c3aed;color:#fff}.btn-purple:hover{background:#6d28d9}

/* UPLOAD ZONE */
.upload-zone{border:1.5px dashed #cbd5e1;border-radius:7px;padding:16px;text-align:center;cursor:pointer;transition:all .12s;color:#94a3b8}
.upload-zone:hover{border-color:#3b82f6;color:#3b82f6;background:#f8faff}
.upload-zone.has-file{border-color:#10b981;background:#f0fdf4;color:#10b981}

/* STAT CARDS */
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:10px}
.stat-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:8px 10px}
.stat-val{font-size:16px;font-weight:700;color:#0f172a;font-family:'IBM Plex Mono',monospace}
.stat-lbl{font-size:9px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-top:1px}
.stat-delta{font-size:9.5px;font-weight:600;margin-top:3px}

/* EXPIRY ALERT */
.alert{border-radius:7px;padding:8px 11px;margin-bottom:10px;font-size:10.5px;display:flex;align-items:flex-start;gap:7px}
.alert.warn{background:#fffbeb;border:1px solid #fcd34d;color:#92400e}
.alert.danger{background:#fef2f2;border:1px solid #fca5a5;color:#991b1b}
.alert.info{background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}
.alert.success{background:#f0fdf4;border:1px solid #86efac;color:#166534}
.alert-icon{font-size:12px;flex-shrink:0;margin-top:1px}

/* TIMESHEET TABLE */
.ts-tbl{width:100%;border-collapse:collapse;font-size:10.5px}
.ts-tbl th{font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;padding:5px 8px;background:#f8fafc;border-bottom:1px solid #e2e8f0;text-align:left}
.ts-tbl td{padding:5px 8px;border-bottom:1px solid #f1f5f9;color:#374151}
.ts-tbl tr:hover td{background:#f8faff}
.ts-input{width:100%;border:1px solid #e2e8f0;border-radius:4px;padding:3px 6px;font-size:10.5px;outline:none;text-align:center}
.ts-input:focus{border-color:#6366f1}

/* MONITORING */
.mon-gauge{position:relative;height:4px;background:#e2e8f0;border-radius:4px;overflow:visible;margin:6px 0}
.mon-fill{height:100%;border-radius:4px;transition:width .4s}
.mon-marker{position:absolute;top:-3px;width:10px;height:10px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2)}
`;

/* ── SEED DATA ─────────────────────────────────────────────── */
const DEALS = [
  { id:"SR-0041", title:"CRM Integration for Enterprise Tier",  client:"Nexus Corp",        type:"IT Services",       priority:"Critical", status:"Active",      stage:5, owner:"Dana Mercer",   dh:"Rachel Kim",  budget:150000,value:142000, start:"2026-02-01",end:"2026-12-31", sow:"SOW-2026-041", project:"PRJ-0082", region:"North America", skills:["API Design","CRM","Enterprise Architecture"] },
  { id:"SR-0042", title:"Custom Reporting Dashboard",           client:"Meridian Holdings", type:"Data & Analytics",  priority:"High",     status:"Active",      stage:4, owner:"Lian Zhou",     dh:"Tom Ashby",   budget:95000, value:88500,  start:"2026-02-15",end:"2026-09-30", sow:"SOW-2026-042", project:"PRJ-0083", region:"Europe",        skills:["Power BI","Tableau","SQL"] },
  { id:"SR-0043", title:"White-label Mobile App",               client:"BlueStar Retail",   type:"Digital Services",  priority:"High",     status:"Scoping",     stage:2, owner:"Theo Vasquez",  dh:"Dana Mercer", budget:240000,value:220000, start:"2026-03-01",end:"2026-10-31", sow:"SOW-2026-043", project:"",         region:"APAC",          skills:["React Native","iOS","Android"] },
  { id:"SR-0044", title:"API Gateway Configuration",            client:"Orion Financial",   type:"Cloud Services",    priority:"Medium",   status:"Active",      stage:4, owner:"Dana Mercer",   dh:"Sam Keller",  budget:38000, value:34000,  start:"2026-02-10",end:"2026-06-30", sow:"SOW-2026-044", project:"PRJ-0084", region:"North America", skills:["AWS","Terraform","IAM"] },
  { id:"SR-0045", title:"Compliance Audit Module",              client:"TrueNorth Law",     type:"Managed Services",  priority:"Critical", status:"In Progress", stage:5, owner:"Sam Keller",    dh:"Lian Zhou",   budget:72000, value:67000,  start:"2026-02-01",end:"2027-01-31", sow:"SOW-2026-045", project:"PRJ-0085", region:"North America", skills:["SOC 2","Compliance","Security"] },
  { id:"SR-0046", title:"Data Migration (Legacy to Cloud)",     client:"Summit Energy",     type:"IT Services",       priority:"High",     status:"On Hold",     stage:2, owner:"Lian Zhou",     dh:"Theo Vasquez",budget:55000, value:51000,  start:"2026-03-01",end:"2026-07-31", sow:"",              project:"",         region:"North America", skills:["ETL","PostgreSQL","AWS"] },
  { id:"SR-0047", title:"SSO & Identity Federation",            client:"Nexus Corp",        type:"Contract Staffing", priority:"Medium",   status:"Draft",       stage:1, owner:"Theo Vasquez",  dh:"Rachel Kim",  budget:32000, value:29500,  start:"2026-03-15",end:"2026-07-15", sow:"",              project:"",         region:"North America", skills:["SAML","OAuth 2.0","IAM"] },
  { id:"SR-0048", title:"Predictive Analytics Engine",          client:"Meridian Holdings", type:"Data & Analytics",  priority:"High",     status:"In Review",   stage:2, owner:"Sam Keller",    dh:"Tom Ashby",   budget:190000,value:175000, start:"2026-03-20",end:"2026-10-31", sow:"SOW-2026-048", project:"",         region:"Europe",        skills:["ML","Python","Databricks"] },
];

const STAGE_LABELS = ["Sales","SOW","Project","Resources","Delivery","Finance","Monitoring"];
const STAGE_ICONS  = ["📋","📝","🚀","👥","⏱","💰","📡"];

const PRIORITY_COLORS = { Critical:"#dc2626",High:"#d97706",Medium:"#2563eb",Low:"#64748b" };
const STATUS_COLORS   = { Active:"#059669",Draft:"#94a3b8","In Progress":"#d97706","In Review":"#4f46e5",Scoping:"#0891b2","On Hold":"#dc2626",Approved:"#059669" };
const TYPE_COLORS     = { "IT Services":"#2563eb","Data & Analytics":"#059669","Digital Services":"#0891b2","Cloud Services":"#4f46e5","Managed Services":"#d97706","Contract Staffing":"#8b5cf6" };

const fmt   = n => `$${(n/1000).toFixed(0)}k`;
const fmtFull = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
const daysTo  = d => { if(!d) return null; return Math.ceil((new Date(d)-new Date())/864e5); };

/* ── ICON SVG ─────────────────────────────────────────────── */
const Ico = ({n,s=12,c="currentColor"})=>{
  const p={
    menu:     <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    dash:     <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    folder:   <><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></>,
    sow:      <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    proj:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    users:    <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    time:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    finance:  <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    monitor:  <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    filter:   <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    chevL:    <><polyline points="15 18 9 12 15 6"/></>,
    chevR:    <><polyline points="9 18 15 12 9 6"/></>,
    x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check:    <><polyline points="20 6 9 17 4 12"/></>,
    upload:   <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    mail:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    alert:    <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    bell:     <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    link:     <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{p[n]}</svg>;
};

/* ══════════════════════════════════════════════════════════
   PERMISSION SYSTEM
═══════════════════════════════════════════════════════════ */
const ROLE_DEFS = {
  admin:          { label:"Admin",           color:"#dc2626", bg:"#fef2f2",  initials:"AD" },
  delivery_head:  { label:"Delivery Head",   color:"#7c3aed", bg:"#faf5ff",  initials:"DH" },
  project_manager:{ label:"Project Manager", color:"#1d4ed8", bg:"#eff6ff",  initials:"PM" },
  sow_manager:    { label:"SOW Manager",     color:"#0891b2", bg:"#ecfeff",  initials:"SM" },
  finance:        { label:"Finance",         color:"#059669", bg:"#f0fdf4",  initials:"FN" },
  resource:       { label:"Resource",        color:"#64748b", bg:"#f8fafc",  initials:"RE" },
};

const ROLE_PERMS = {
  admin:          { sales:true,  sow:true,  projects:true,  res_manage:true,  res_view:true,  timesheet_all:true,  my_timesheet:true,  finance:true,  reports:true,  activity:true,  alerts:true,  pipeline:true,  bench:true,  utilization:true },
  delivery_head:  { sales:true,  sow:true,  projects:true,  res_manage:true,  res_view:true,  timesheet_all:true,  my_timesheet:false, finance:false, reports:true,  activity:true,  alerts:true,  pipeline:true,  bench:true,  utilization:true },
  project_manager:{ sales:false, sow:false, projects:true,  res_manage:false, res_view:true,  timesheet_all:true,  my_timesheet:false, finance:false, reports:false, activity:true,  alerts:true,  pipeline:false, bench:true,  utilization:false },
  sow_manager:    { sales:true,  sow:true,  projects:false, res_manage:false, res_view:false, timesheet_all:false, my_timesheet:false, finance:false, reports:false, activity:false, alerts:true,  pipeline:false, bench:false, utilization:false },
  finance:        { sales:false, sow:true,  projects:false, res_manage:false, res_view:false, timesheet_all:true,  my_timesheet:false, finance:true,  reports:true,  activity:false, alerts:true,  pipeline:false, bench:false, utilization:false },
  resource:       { sales:false, sow:false, projects:false, res_manage:false, res_view:false, timesheet_all:false, my_timesheet:true,  finance:false, reports:false, activity:false, alerts:false, pipeline:false, bench:false, utilization:false },
};

const can = (role,perm) => !!(ROLE_PERMS[role]||{})[perm];

/* ── DASHBOARD SEED DATA ──────────────────────────────────── */
const DB_PROJECTS = [
  { id:"PRJ-0082", name:"Nexus Digital Transformation",  client:"Nexus Corp",        pm:"Rachel Kim",  status:"Active",    health:"On Track",  pct:38, budget:142000, spent:54000, start:"2026-02-01", end:"2026-12-31", type:"IT Services"      },
  { id:"PRJ-0083", name:"Meridian Analytics Suite",       client:"Meridian Holdings", pm:"Tom Ashby",   status:"Active",    health:"At Risk",   pct:52, budget:88500,  spent:47000, start:"2026-02-15", end:"2026-09-30", type:"Data & Analytics"  },
  { id:"PRJ-0084", name:"Orion Cloud Migration",          client:"Orion Financial",   pm:"Sam Keller",  status:"Active",    health:"On Track",  pct:61, budget:34000,  spent:21000, start:"2026-02-10", end:"2026-06-30", type:"Cloud Services"    },
  { id:"PRJ-0085", name:"TrueNorth Legal Ops",            client:"TrueNorth Law",     pm:"Lian Zhou",   status:"Active",    health:"Delayed",   pct:29, budget:72000,  spent:22000, start:"2026-02-01", end:"2027-01-31", type:"Managed Services"  },
  { id:"PRJ-0086", name:"BlueStar Mobile Commerce",       client:"BlueStar Retail",   pm:"Dana Mercer", status:"Planning",  health:"On Track",  pct:8,  budget:240000, spent:4000,  start:"2026-03-01", end:"2026-10-31", type:"Digital Services"  },
];
const DB_SOWS = [
  { id:"SOW-2026-041", client:"Nexus Corp",        title:"Nexus Digital Transformation", status:"Active",      expiry:"2026-12-31", value:142000, dh:"Rachel Kim"  },
  { id:"SOW-2026-042", client:"Meridian Holdings", title:"Meridian Analytics Suite",      status:"Active",      expiry:"2026-09-30", value:88500,  dh:"Tom Ashby"   },
  { id:"SOW-2026-043", client:"BlueStar Retail",   title:"BlueStar Mobile Commerce",      status:"Approved",    expiry:"2026-10-31", value:220000, dh:"Dana Mercer" },
  { id:"SOW-2026-044", client:"Orion Financial",   title:"Orion Cloud Migration",         status:"Active",      expiry:"2026-06-30", value:34000,  dh:"Sam Keller"  },
  { id:"SOW-2026-045", client:"TrueNorth Law",     title:"TrueNorth Legal Ops",           status:"Active",      expiry:"2027-01-31", value:67000,  dh:"Lian Zhou"   },
  { id:"SOW-2026-048", client:"Meridian Holdings", title:"Predictive Analytics Engine",   status:"Submitted",   expiry:"2026-10-31", value:175000, dh:"Tom Ashby"   },
  { id:"SOW-2026-049", client:"BlueStar Retail",   title:"Customer Portal Redesign",      status:"Draft",       expiry:"2026-04-20", value:43000,  dh:"Dana Mercer" },
];
const DB_RESOURCES = [
  { name:"Priya Sharma",  role:"Sr. React Developer", avail:100, proj:null,         skills:["React","TypeScript","Node.js"], exp:6, status:"Bench" },
  { name:"Carlos Ruiz",   role:"Cloud Architect",      avail:0,   proj:"PRJ-0082",   skills:["AWS","Terraform","K8s"],        exp:9, status:"Allocated" },
  { name:"Emma Liu",      role:"UI/UX Designer",        avail:60,  proj:"PRJ-0085",   skills:["Figma","UX Research"],          exp:4, status:"Partial" },
  { name:"James Park",    role:"Backend Engineer",      avail:100, proj:null,         skills:["Node.js","PostgreSQL","REST"],   exp:5, status:"Bench" },
  { name:"Sofia Torres",  role:"DevOps Engineer",       avail:30,  proj:"PRJ-0083",   skills:["Docker","Jenkins","Ansible"],   exp:7, status:"Partial" },
  { name:"Raj Patel",     role:"Data Engineer",         avail:100, proj:null,         skills:["Python","ETL","Databricks"],    exp:5, status:"Bench" },
  { name:"Nina Chen",     role:"QA Lead",               avail:0,   proj:"PRJ-0084",   skills:["Selenium","QA","Testing"],      exp:6, status:"Allocated" },
  { name:"Omar Ali",      role:"Security Engineer",     avail:50,  proj:"PRJ-0082",   skills:["IAM","SAML","OAuth"],           exp:8, status:"Partial" },
];
const DB_INVOICES = [
  { id:"INV-0084", client:"Nexus Corp",        period:"Feb 2026", amount:35500, status:"Paid",    due:"2026-03-01" },
  { id:"INV-0085", client:"Meridian Holdings", period:"Feb 2026", amount:22000, status:"Paid",    due:"2026-03-05" },
  { id:"INV-0097", client:"Nexus Corp",        period:"Mar 2026", amount:35500, status:"Sent",    due:"2026-04-01" },
  { id:"INV-0098", client:"Orion Financial",   period:"Mar 2026", amount:8500,  status:"Sent",    due:"2026-04-05" },
  { id:"INV-0099", client:"TrueNorth Law",     period:"Mar 2026", amount:14000, status:"Overdue", due:"2026-03-08" },
  { id:"INV-0100", client:"BlueStar Retail",   period:"Mar 2026", amount:19000, status:"Draft",   due:"2026-04-10" },
];
const DB_ACTIVITY = [
  { ts:"10 min ago", user:"Rachel Kim",  action:"Updated milestone",   detail:"PRJ-0082 — Design & Architecture → In Progress",  icon:"proj",    color:"#1d4ed8" },
  { ts:"1 hr ago",   user:"Tom Ashby",   action:"Timesheet approved",  detail:"Meridian Analytics — Week of Mar 3 (Sofia Torres)", icon:"check",   color:"#059669" },
  { ts:"2 hr ago",   user:"System",      action:"SOW expiry alert",    detail:"SOW-2026-044 — 111 days remaining. Reminder sent.",  icon:"bell",    color:"#d97706" },
  { ts:"3 hr ago",   user:"Dana Mercer", action:"New requirement",     detail:"SR-0052 created — Multi-Currency Support",           icon:"folder",  color:"#7c3aed" },
  { ts:"Yesterday",  user:"Sam Keller",  action:"Invoice sent",        detail:"INV-0098 — Orion Financial — $8,500",                icon:"finance", color:"#059669" },
  { ts:"Yesterday",  user:"Lian Zhou",   action:"Resource assigned",   detail:"Emma Liu (40%) → TrueNorth Legal Ops",              icon:"users",   color:"#0891b2" },
  { ts:"2 days ago", user:"System",      action:"Project status",      detail:"PRJ-0083 flagged At Risk — budget >53% utilized",    icon:"alert",   color:"#dc2626" },
  { ts:"2 days ago", user:"Tom Ashby",   action:"SOW amended",         detail:"SOW-2026-042 v2 — expanded data sources addendum",   icon:"sow",     color:"#6366f1" },
];
const MY_TIMESHEET = [
  { proj:"PRJ-0082", client:"Nexus Corp", task:"API Design & Review", Mon:8,Tue:7,Wed:8,Thu:8,Fri:8, status:"Pending" },
  { proj:"PRJ-0082", client:"Nexus Corp", task:"Technical Documentation", Mon:0,Tue:1,Wed:0,Thu:0,Fri:0, status:"Pending" },
];
const MY_ASSIGNMENTS = [
  { proj:"PRJ-0082", client:"Nexus Corp",  role:"Cloud Architect", alloc:100, start:"2026-02-10", end:"2026-06-30", pm:"Rachel Kim", health:"On Track" },
];

/* ── DASHBOARD EXTRA CSS ──────────────────────────────────── */
const DASH_CSS = `
/* WIDGET */
.widget{background:#fff;border:1px solid #e2e8f0;border-radius:9px;overflow:hidden;display:flex;flex-direction:column}
.widget-head{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-bottom:1px solid #f1f5f9;flex-shrink:0}
.widget-title{font-size:10px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.6px;display:flex;align-items:center;gap:6px}
.widget-action{font-size:9.5px;color:#1d4ed8;cursor:pointer;font-weight:600;border:none;background:none;padding:0}
.widget-action:hover{text-decoration:underline}
.widget-body{padding:10px 12px;flex:1;overflow:hidden}
.widget-footer{padding:6px 12px;border-top:1px solid #f8fafc;background:#fafafa;font-size:9px;color:#94a3b8}

/* KPI CARDS */
.kpi-grid{display:grid;gap:8px}
.kpi-card{background:#fff;border:1px solid #e2e8f0;border-radius:9px;padding:10px 12px;display:flex;flex-direction:column;gap:2px;position:relative;overflow:hidden}
.kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.kpi-num{font-size:22px;font-weight:700;font-family:'IBM Plex Mono',monospace;line-height:1.1}
.kpi-lbl{font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;margin-top:1px}
.kpi-delta{font-size:9.5px;font-weight:600;margin-top:4px;display:flex;align-items:center;gap:3px}
.kpi-icon{position:absolute;right:10px;top:10px;opacity:.08;font-size:28px}

/* PIPELINE */
.pipe-stage{display:flex;align-items:center;gap:7px;padding:5px 0;border-bottom:1px solid #f8fafc}
.pipe-bar{flex:1;height:5px;background:#e2e8f0;border-radius:3px;overflow:hidden}
.pipe-fill{height:100%;border-radius:3px;transition:width .4s}

/* PROJECT ROWS */
.proj-row{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f8fafc}
.proj-row:last-child{border-bottom:none}
.proj-name{font-size:10.5px;font-weight:600;color:#0f172a;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.proj-mini-bar{width:60px;height:4px;background:#e2e8f0;border-radius:2px;overflow:hidden;flex-shrink:0}
.proj-mini-fill{height:100%;border-radius:2px}
.health-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}

/* SOW EXPIRY */
.sow-row{display:flex;align-items:center;gap:7px;padding:5px 0;border-bottom:1px solid #f8fafc}
.sow-row:last-child{border-bottom:none}
.expiry-pill{padding:1px 6px;border-radius:3px;font-size:9px;font-weight:700;white-space:nowrap;flex-shrink:0}

/* RESOURCE GRID */
.res-mini{display:flex;align-items:center;gap:7px;padding:4px 0;border-bottom:1px solid #f8fafc}
.res-mini:last-child{border-bottom:none}
.avail-bar{width:50px;height:4px;background:#e2e8f0;border-radius:2px;overflow:hidden;flex-shrink:0}
.avail-fill{height:100%;border-radius:2px}

/* FINANCE */
.fin-row{display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f8fafc;font-size:10.5px}
.fin-row:last-child{border-bottom:none}

/* ACTIVITY */
.act-item{display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #f8fafc}
.act-item:last-child{border-bottom:none}
.act-icon{width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.act-time{font-size:9px;color:#94a3b8;font-family:'IBM Plex Mono',monospace;margin-top:1px}

/* ALERTS */
.al-item{display:flex;align-items:flex-start;gap:7px;padding:5px 0;border-bottom:1px solid #f8fafc}
.al-item:last-child{border-bottom:none}

/* MY TIMESHEET mini */
.ts-mini th{font-size:8.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;padding:3px 5px;background:#f8fafc;border-bottom:1px solid #e2e8f0;text-align:center}
.ts-mini td{font-size:10px;padding:4px 5px;border-bottom:1px solid #f1f5f9;color:#374151}
.ts-mini td:first-child{text-align:left;font-weight:500;max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* UTILIZATION DONUT placeholder */
.util-ring{position:relative;display:flex;align-items:center;justify-content:center}

/* ROLE SWITCHER */
.role-switcher{display:flex;align-items:center;gap:4px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:3px}
.role-btn{padding:3px 8px;border-radius:4px;font-size:9.5px;font-weight:600;cursor:pointer;border:none;background:none;color:#64748b;white-space:nowrap;transition:all .12s}
.role-btn.active{color:#fff}
.role-btn:not(.active):hover{background:#fff;color:#374151}

/* DASH GRID */
.dash-grid{display:grid;gap:9px}
.dash-main{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px}
.dash-wide{grid-column:1/-1}
.dash-half{grid-column:span 2}
.dash-third{}
`;

/* ── WIDGET WRAPPER ───────────────────────────────────────── */
function Widget({title,icon,action,actionLabel,children,footer,accent="#1d4ed8",style={}}){
  return(
    <div className="widget" style={style}>
      <div className="widget-head">
        <div className="widget-title">
          <span style={{color:accent,fontSize:11}}>{icon}</span>
          {title}
        </div>
        {actionLabel&&<button className="widget-action" onClick={action}>{actionLabel} →</button>}
      </div>
      <div className="widget-body">{children}</div>
      {footer&&<div className="widget-footer">{footer}</div>}
    </div>
  );
}

/* ── WIDGET: KPI BAR ──────────────────────────────────────── */
function KpiBar({role}){
  const p = ROLE_PERMS[role];
  const cards=[];
  if(p.pipeline||p.sales)   cards.push({lbl:"Open Deals",num:"12",delta:"+2 this week",up:true,col:"#1d4ed8",icon:"📋"});
  if(p.sow)                  cards.push({lbl:"Active SOWs",num:"5",delta:"2 expiring <90d",up:null,col:"#7c3aed",icon:"📝"});
  if(p.projects)             cards.push({lbl:"Live Projects",num:"5",delta:"1 at risk",up:null,col:"#0891b2",icon:"🚀"});
  if(p.res_view||p.bench)    cards.push({lbl:"On Bench",num:"3",delta:"2 long-tenured",up:false,col:"#d97706",icon:"👥"});
  if(p.finance)              cards.push({lbl:"Outstanding",num:"$49.5k",delta:"1 overdue",up:false,col:"#dc2626",icon:"💰"});
  if(p.timesheet_all)        cards.push({lbl:"Pending TS",num:"8",delta:"3 this week",up:false,col:"#059669",icon:"⏱"});
  if(p.my_timesheet&&!p.timesheet_all) cards.push({lbl:"My Hours (Mar)",num:"120h",delta:"Target: 160h",up:null,col:"#059669",icon:"⏱"});
  if(p.utilization)          cards.push({lbl:"Utilization",num:"72%",delta:"+4% vs Feb",up:true,col:"#6366f1",icon:"📊"});
  if(p.sow&&!p.projects)     cards.push({lbl:"Pipeline Value",num:"$807k",delta:"8 active SOWs",up:true,col:"#059669",icon:"💹"});

  if(!cards.length) return null;
  return(
    <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(cards.length,4)},1fr)`,gap:8,marginBottom:0}}>
      {cards.map(c=>(
        <div key={c.lbl} className="kpi-card" style={{"--accent":c.col}}>
          <div style={{height:2,background:c.col,position:"absolute",top:0,left:0,right:0,borderRadius:"9px 9px 0 0"}}/>
          <div className="kpi-icon">{c.icon}</div>
          <div className="kpi-num" style={{color:c.col}}>{c.num}</div>
          <div className="kpi-lbl">{c.lbl}</div>
          <div className="kpi-delta" style={{color:c.up===true?"#059669":c.up===false?"#dc2626":"#94a3b8"}}>
            {c.up===true?"↑":c.up===false?"↓":"·"} {c.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── WIDGET: PIPELINE FUNNEL ──────────────────────────────── */
function PipelineWidget(){
  const stages=[
    {label:"Draft",count:4,value:90500,col:"#94a3b8"},
    {label:"In Review",count:3,value:205000,col:"#6366f1"},
    {label:"Scoping",count:2,value:257500,col:"#d97706"},
    {label:"Approved",count:5,value:342000,col:"#059669"},
    {label:"Active",count:5,value:422500,col:"#1d4ed8"},
  ];
  const max=422500;
  return(
    <Widget title="Sales Pipeline" icon="📋" accent="#1d4ed8" actionLabel="View all" footer={`Total pipeline: $1.32M across ${stages.reduce((a,b)=>a+b.count,0)} requirements`}>
      {stages.map(s=>(
        <div key={s.label} className="pipe-stage">
          <div style={{width:64,fontSize:9.5,fontWeight:600,color:"#64748b",flexShrink:0}}>{s.label}</div>
          <div className="pipe-bar">
            <div className="pipe-fill" style={{width:`${(s.value/max)*100}%`,background:s.col}}/>
          </div>
          <div style={{width:36,textAlign:"right",fontSize:9.5,fontWeight:700,fontFamily:"monospace",color:"#374151",flexShrink:0}}>{s.count}</div>
          <div style={{width:46,textAlign:"right",fontSize:9,color:"#94a3b8",fontFamily:"monospace",flexShrink:0}}>{`$${(s.value/1000).toFixed(0)}k`}</div>
        </div>
      ))}
    </Widget>
  );
}

/* ── WIDGET: SOW HEALTH ───────────────────────────────────── */
function SowHealthWidget(){
  const sows = DB_SOWS.map(s=>({...s,days:daysTo(s.expiry)}));
  const expiring = sows.filter(s=>s.days!==null&&s.days<=90).sort((a,b)=>a.days-b.days);
  const getExpCol = d => d<=0?"#dc2626":d<=10?"#dc2626":d<=30?"#d97706":d<=90?"#f59e0b":"#059669";
  const getExpBg  = d => d<=0?"#fef2f2":d<=10?"#fef2f2":d<=30?"#fffbeb":d<=90?"#fffbeb":"#f0fdf4";
  return(
    <Widget title="SOW Health" icon="📝" accent="#7c3aed" actionLabel="View SOWs" footer={`${sows.filter(s=>s.status==="Active").length} active · ${expiring.length} expiring in 90 days`}>
      {sows.slice(0,7).map(s=>(
        <div key={s.id} className="sow-row">
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:600,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.client}</div>
            <div style={{fontSize:9,color:"#94a3b8",fontFamily:"monospace"}}>{s.id}</div>
          </div>
          <span className="badge" style={{background:STATUS_COLORS[s.status]+"18",color:STATUS_COLORS[s.status],fontSize:8.5,flexShrink:0}}>{s.status}</span>
          {s.days!==null&&(
            <span className="expiry-pill" style={{background:getExpBg(s.days),color:getExpCol(s.days)}}>
              {s.days<=0?`${Math.abs(s.days)}d ago`:`${s.days}d`}
            </span>
          )}
          <div style={{fontSize:9,fontWeight:700,fontFamily:"monospace",color:"#374151",minWidth:38,textAlign:"right"}}>{`$${(s.value/1000).toFixed(0)}k`}</div>
        </div>
      ))}
    </Widget>
  );
}

/* ── WIDGET: ACTIVE PROJECTS ──────────────────────────────── */
const HEALTH_COLORS = {"On Track":"#059669","At Risk":"#d97706","Delayed":"#dc2626","Planning":"#94a3b8"};
function ActiveProjectsWidget(){
  return(
    <Widget title="Active Projects" icon="🚀" accent="#0891b2" actionLabel="Projects board" footer={`${DB_PROJECTS.filter(p=>p.status==="Active").length} active · ${DB_PROJECTS.filter(p=>p.health==="At Risk"||p.health==="Delayed").length} need attention`}>
      {DB_PROJECTS.map(p=>{
        const burnPct = Math.round(p.spent/p.budget*100);
        const hc = HEALTH_COLORS[p.health]||"#94a3b8";
        return(
          <div key={p.id} className="proj-row">
            <div className="health-dot" style={{background:hc}}/>
            <div style={{flex:1,minWidth:0}}>
              <div className="proj-name">{p.name}</div>
              <div style={{fontSize:9,color:"#94a3b8"}}>{p.client} · {p.pm}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:9,color:"#94a3b8",marginBottom:2}}>{p.pct}% done · burn {burnPct}%</div>
              <div className="proj-mini-bar"><div className="proj-mini-fill" style={{width:`${p.pct}%`,background:hc}}/></div>
            </div>
            <span style={{fontSize:8.5,fontWeight:700,color:hc,minWidth:52,textAlign:"right",flexShrink:0}}>{p.health}</span>
          </div>
        );
      })}
    </Widget>
  );
}

/* ── WIDGET: BENCH / RESOURCE AVAILABILITY ────────────────── */
function BenchWidget(){
  const bench = DB_RESOURCES.filter(r=>r.status==="Bench"||r.status==="Partial");
  return(
    <Widget title="Resource Availability" icon="👥" accent="#d97706" actionLabel="Resource pool" footer={`${DB_RESOURCES.filter(r=>r.status==="Bench").length} on bench · ${DB_RESOURCES.filter(r=>r.status==="Partial").length} partially allocated`}>
      {bench.map(r=>(
        <div key={r.name} className="res-mini">
          <div className="av" style={{width:20,height:20,fontSize:8,background:`hsl(${r.name.charCodeAt(0)*17%360},40%,38%)`}}>{r.name.split(" ").map(x=>x[0]).join("")}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:600,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</div>
            <div style={{fontSize:9,color:"#94a3b8"}}>{r.role} · {r.exp}y</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:9,color:"#94a3b8",marginBottom:2}}>{r.avail}% avail</div>
            <div className="avail-bar"><div className="avail-fill" style={{width:`${r.avail}%`,background:r.avail===100?"#059669":r.avail>=50?"#d97706":"#94a3b8"}}/></div>
          </div>
          <span className="badge" style={{fontSize:8.5,background:r.status==="Bench"?"#f0fdf4":"#fffbeb",color:r.status==="Bench"?"#16a34a":"#92400e",flexShrink:0}}>{r.status}</span>
        </div>
      ))}
    </Widget>
  );
}

/* ── WIDGET: FINANCE OVERVIEW ─────────────────────────────── */
function FinanceWidget(){
  const invColors={"Paid":"#059669","Sent":"#1d4ed8","Overdue":"#dc2626","Draft":"#94a3b8"};
  const invBgs   ={"Paid":"#f0fdf4","Sent":"#eff6ff","Overdue":"#fef2f2","Draft":"#f8fafc"};
  const totals={paid:57500,sent:44000,overdue:14000,draft:19000};
  return(
    <Widget title="Finance & Invoicing" icon="💰" accent="#059669" actionLabel="Finance hub" footer="Mar 2026 billing cycle · Net 30 terms">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5,marginBottom:8}}>
        {Object.entries(totals).map(([k,v])=>(
          <div key={k} style={{background:invBgs[k.charAt(0).toUpperCase()+k.slice(1)]||"#f8fafc",border:`1px solid ${invColors[k.charAt(0).toUpperCase()+k.slice(1)]||"#e2e8f0"}20`,borderRadius:5,padding:"5px 7px"}}>
            <div style={{fontSize:12,fontWeight:700,fontFamily:"monospace",color:invColors[k.charAt(0).toUpperCase()+k.slice(1)]||"#374151"}}>${(v/1000).toFixed(1)}k</div>
            <div style={{fontSize:8.5,color:"#94a3b8",textTransform:"capitalize",fontWeight:600}}>{k}</div>
          </div>
        ))}
      </div>
      {DB_INVOICES.slice(0,5).map(inv=>(
        <div key={inv.id} className="fin-row">
          <span style={{fontFamily:"monospace",fontSize:9.5,color:"#6366f1",minWidth:80}}>{inv.id}</span>
          <span style={{flex:1,fontSize:10,color:"#475569"}}>{inv.client}</span>
          <span style={{fontFamily:"monospace",fontSize:10,fontWeight:700,color:"#374151",minWidth:52,textAlign:"right"}}>${(inv.amount/1000).toFixed(1)}k</span>
          <span className="badge" style={{fontSize:8.5,background:invBgs[inv.status],color:invColors[inv.status],marginLeft:5}}>{inv.status}</span>
        </div>
      ))}
    </Widget>
  );
}

/* ── WIDGET: ACTIVITY FEED ────────────────────────────────── */
function ActivityFeedWidget(){
  return(
    <Widget title="Recent Activity" icon="📡" accent="#6366f1" footer="System-wide activity · last 72 hours">
      {DB_ACTIVITY.map((a,i)=>(
        <div key={i} className="act-item">
          <div className="act-icon" style={{background:a.color+"18"}}>
            <Ico n={a.icon} s={10} c={a.color}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"baseline",gap:5}}>
              <span style={{fontSize:10,fontWeight:600,color:"#374151"}}>{a.user}</span>
              <span style={{fontSize:9.5,color:"#64748b"}}>{a.action}</span>
            </div>
            <div style={{fontSize:9,color:"#94a3b8",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.detail}</div>
          </div>
          <div className="act-time">{a.ts}</div>
        </div>
      ))}
    </Widget>
  );
}

/* ── WIDGET: ALERTS ───────────────────────────────────────── */
function AlertsWidget({role}){
  const all=[
    {type:"danger",  icon:"🔴", msg:"SOW-2026-044 expires in 111 days",         sub:"Orion Financial · Action required",          perm:"sow"},
    {type:"warn",    icon:"⚠",  msg:"PRJ-0083 budget >53% — 52% progress",      sub:"Meridian Analytics · At Risk status",         perm:"projects"},
    {type:"danger",  icon:"🔴", msg:"INV-0099 overdue — $14,000",               sub:"TrueNorth Law · Due 8 Mar 2026",              perm:"finance"},
    {type:"warn",    icon:"⚠",  msg:"3 resources on bench >30 days",            sub:"Priya Sharma, James Park, Raj Patel",          perm:"bench"},
    {type:"info",    icon:"ℹ",  msg:"Timesheet pending approval — 8 records",   sub:"Week of Mar 3 · PM review required",          perm:"timesheet_all"},
    {type:"warn",    icon:"⚠",  msg:"SOW-2026-049 expiry in 40 days",          sub:"BlueStar Retail · Review needed",             perm:"sow"},
    {type:"info",    icon:"ℹ",  msg:"My timesheet due for submission",          sub:"Week of Mar 3–7 · Submit by EOD Friday",      perm:"my_timesheet"},
  ];
  const visible = all.filter(a=>can(role,a.perm));
  const tc={"danger":"#fef2f2","warn":"#fffbeb","info":"#eff6ff"};
  const bc={"danger":"#fca5a5","warn":"#fcd34d","info":"#bfdbfe"};
  const fc={"danger":"#991b1b","warn":"#92400e","info":"#1e40af"};
  if(!visible.length) return null;
  return(
    <Widget title={`Alerts & Actions`} icon="🔔" accent="#dc2626" footer={`${visible.filter(a=>a.type==="danger").length} critical · ${visible.filter(a=>a.type==="warn").length} warnings`}>
      {visible.map((a,i)=>(
        <div key={i} className="al-item">
          <span style={{fontSize:11,flexShrink:0,marginTop:1}}>{a.icon}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:600,color:fc[a.type]}}>{a.msg}</div>
            <div style={{fontSize:9,color:"#94a3b8",marginTop:1}}>{a.sub}</div>
          </div>
          <button style={{background:tc[a.type],border:`1px solid ${bc[a.type]}`,borderRadius:4,padding:"2px 7px",fontSize:9,color:fc[a.type],cursor:"pointer",fontWeight:600,flexShrink:0}}>View</button>
        </div>
      ))}
    </Widget>
  );
}

/* ── WIDGET: MY TIMESHEET (resource view) ─────────────────── */
function MyTimesheetWidget(){
  const days=["Mon","Tue","Wed","Thu","Fri"];
  const [rows,setRows]=useState(MY_TIMESHEET);
  const total=rows.reduce((s,r)=>s+days.reduce((a,d)=>a+(+r[d]||0),0),0);
  return(
    <Widget title="My Timesheet — Week of Mar 3" icon="⏱" accent="#059669" actionLabel="Full timesheet" footer={`${total} hrs logged this week · Pending submission`}>
      <table style={{width:"100%",borderCollapse:"collapse"}} className="ts-mini">
        <thead><tr><th style={{textAlign:"left"}}>Project / Task</th>{days.map(d=><th key={d}>{d}</th>)}<th>Total</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td>
                <div style={{fontSize:10,fontWeight:600,color:"#0f172a"}}>{r.proj}</div>
                <div style={{fontSize:9,color:"#94a3b8"}}>{r.task}</div>
              </td>
              {days.map(d=>(
                <td key={d} style={{textAlign:"center"}}>
                  <input style={{width:28,border:"1px solid #e2e8f0",borderRadius:3,padding:"2px 3px",fontSize:10,textAlign:"center",outline:"none"}}
                    value={r[d]} onChange={e=>setRows(p=>p.map((x,j)=>j===i?{...x,[d]:e.target.value}:x))} />
                </td>
              ))}
              <td style={{textAlign:"center",fontWeight:700,fontFamily:"monospace",color:"#1d4ed8",fontSize:10}}>{days.reduce((a,d)=>a+(+r[d]||0),0)}h</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{display:"flex",gap:5,marginTop:7}}>
        <button className="btn btn-primary" style={{fontSize:9.5,padding:"4px 9px"}}>Submit for Approval</button>
        <button className="btn btn-ghost" style={{fontSize:9.5,padding:"4px 9px"}}>Save Draft</button>
      </div>
    </Widget>
  );
}

/* ── WIDGET: MY ASSIGNMENTS (resource view) ───────────────── */
function MyAssignmentsWidget(){
  return(
    <Widget title="My Assignments" icon="📌" accent="#0891b2" footer="Your active project allocations">
      {MY_ASSIGNMENTS.map((a,i)=>(
        <div key={i} style={{padding:"7px 0",borderBottom:"1px solid #f8fafc"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#0f172a"}}>{a.proj} — {a.client}</div>
              <div style={{fontSize:9.5,color:"#64748b"}}>{a.role} · PM: {a.pm}</div>
            </div>
            <span className="badge" style={{background:HEALTH_COLORS[a.health]+"18",color:HEALTH_COLORS[a.health],fontSize:9}}>{a.health}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{flex:1,height:4,background:"#e2e8f0",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${a.alloc}%`,background:"#1d4ed8",borderRadius:2}}/>
            </div>
            <span style={{fontSize:9,fontWeight:700,fontFamily:"monospace",color:"#1d4ed8"}}>{a.alloc}%</span>
            <span style={{fontSize:9,color:"#94a3b8"}}>{a.start} → {a.end}</span>
          </div>
        </div>
      ))}
      <div style={{marginTop:8,padding:"7px 9px",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6}}>
        <div style={{fontSize:9.5,fontWeight:600,color:"#166534"}}>✓ No pending approvals from your manager</div>
        <div style={{fontSize:9,color:"#4ade80",marginTop:2}}>Timesheet for Mar 3 week is pending your submission</div>
      </div>
    </Widget>
  );
}

/* ── WIDGET: UTILIZATION CHART ────────────────────────────── */
function UtilizationWidget(){
  const data=[
    {m:"Oct",v:68},{m:"Nov",v:71},{m:"Dec",v:65},{m:"Jan",v:74},{m:"Feb",v:69},{m:"Mar",v:72},
  ];
  const max=100;
  const byType=[
    {type:"IT Services",pct:78,col:"#2563eb"},{type:"Data & Analytics",pct:84,col:"#059669"},
    {type:"Digital Services",pct:61,col:"#0891b2"},{type:"Managed Services",pct:72,col:"#d97706"},
    {type:"Cloud Services",pct:55,col:"#4f46e5"},{type:"Contract Staffing",pct:90,col:"#8b5cf6"},
  ];
  return(
    <Widget title="Resource Utilization — 6 Month Trend" icon="📊" accent="#6366f1" footer="Org-wide billable utilization · Target: 75%">
      <div style={{display:"flex",alignItems:"flex-end",gap:5,height:60,marginBottom:8}}>
        {data.map(d=>(
          <div key={d.m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <div style={{fontSize:8.5,fontWeight:700,color:d.v>=75?"#059669":"#d97706"}}>{d.v}%</div>
            <div style={{width:"100%",borderRadius:"2px 2px 0 0",background:d.v>=75?"#dbeafe":"#fef3c7",border:`1px solid ${d.v>=75?"#3b82f6":"#fcd34d"}`,height:`${(d.v/max)*52}px`,transition:"height .4s"}}/>
            <div style={{fontSize:8,color:"#94a3b8"}}>{d.m}</div>
          </div>
        ))}
      </div>
      <div style={{borderTop:"1px solid #f1f5f9",paddingTop:6}}>
        {byType.map(t=>(
          <div key={t.type} style={{display:"flex",alignItems:"center",gap:6,padding:"2px 0"}}>
            <div style={{width:72,fontSize:9,color:"#64748b",flexShrink:0}}>{t.type}</div>
            <div style={{flex:1,height:4,background:"#e2e8f0",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${t.pct}%`,background:t.col,borderRadius:2}}/>
            </div>
            <div style={{fontSize:9,fontWeight:700,fontFamily:"monospace",color:t.pct>=75?t.col:"#d97706",minWidth:30,textAlign:"right"}}>{t.pct}%</div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

/* ── WIDGET: SOW-ONLY SUMMARY (sow_manager role) ─────────── */
function SowSummaryWidget(){
  const byStatus={Active:0,Approved:0,Submitted:0,Draft:0,Expired:0};
  DB_SOWS.forEach(s=>{ if(byStatus[s.status]!==undefined) byStatus[s.status]++; });
  const totalVal=DB_SOWS.reduce((a,s)=>a+s.value,0);
  return(
    <Widget title="SOW Portfolio Summary" icon="📝" accent="#7c3aed" footer={`Total portfolio: ${fmtFull(totalVal)} across ${DB_SOWS.length} SOWs`}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:10}}>
        {Object.entries(byStatus).map(([s,n])=>(
          <div key={s} style={{textAlign:"center",padding:"6px 4px",background:STATUS_COLORS[s]+"12",border:`1px solid ${STATUS_COLORS[s]||"#e2e8f0"}20`,borderRadius:5}}>
            <div style={{fontSize:16,fontWeight:700,fontFamily:"monospace",color:STATUS_COLORS[s]||"#94a3b8"}}>{n}</div>
            <div style={{fontSize:8.5,color:"#94a3b8",fontWeight:600}}>{s}</div>
          </div>
        ))}
      </div>
      {DB_SOWS.map(s=>(
        <div key={s.id} className="sow-row">
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:600,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div>
            <div style={{fontSize:9,color:"#94a3b8"}}>{s.id} · {s.dh}</div>
          </div>
          <span className="badge" style={{background:STATUS_COLORS[s.status]+"18",color:STATUS_COLORS[s.status]||"#94a3b8",fontSize:8.5}}>{s.status}</span>
          <span style={{fontSize:9,fontWeight:700,fontFamily:"monospace",color:"#374151",minWidth:40,textAlign:"right"}}>{`$${(s.value/1000).toFixed(0)}k`}</span>
        </div>
      ))}
    </Widget>
  );
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════════════ */
function DashboardPage({role,onRoleChange}){
  const p = ROLE_PERMS[role];
  const rd = ROLE_DEFS[role];
  const today = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});

  /* Greeting by role */
  const greetings={
    admin:          "Full system overview — all modules visible.",
    delivery_head:  "Your delivery portfolio, resource pool, and SOW pipeline.",
    project_manager:"Your projects and team timesheets.",
    sow_manager:    "SOW pipeline, expiry tracking, and contract health.",
    finance:        "Invoicing pipeline, payment status, and SOW financials.",
    resource:       "Your active assignments and timesheet.",
  };

  return(
    <div className="content" style={{padding:"10px 14px",overflowY:"auto"}}>
      <style>{DASH_CSS}</style>

      {/* ── TOPBAR ROW ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>Good morning, {role==="resource"?"Carlos":rd.label} 👋</div>
          <div style={{fontSize:9.5,color:"#94a3b8",marginTop:1}}>{today} · {greetings[role]}</div>
        </div>
        {/* Role switcher — demo only */}
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>View as:</span>
          <div className="role-switcher">
            {Object.entries(ROLE_DEFS).map(([k,v])=>(
              <button key={k} className={`role-btn ${role===k?"active":""}`}
                style={role===k?{background:v.color}:{}}
                onClick={()=>onRoleChange(k)}
                title={v.label}>
                {v.initials}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI BAR ── */}
      <KpiBar role={role}/>

      {/* ── RESOURCE-ONLY VIEW ── */}
      {role==="resource"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:9}}>
          <MyAssignmentsWidget/>
          <MyTimesheetWidget/>
          <div style={{gridColumn:"1/-1"}}><AlertsWidget role={role}/></div>
        </div>
      )}

      {/* ── SOW MANAGER VIEW ── */}
      {role==="sow_manager"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:9}}>
          <SowSummaryWidget/>
          <SowHealthWidget/>
          <div style={{gridColumn:"1/-1"}}><AlertsWidget role={role}/></div>
        </div>
      )}

      {/* ── FINANCE VIEW ── */}
      {role==="finance"&&(
        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:9,marginTop:9}}>
          <FinanceWidget/>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            <SowHealthWidget/>
            <AlertsWidget role={role}/>
          </div>
        </div>
      )}

      {/* ── PROJECT MANAGER VIEW ── */}
      {role==="project_manager"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:9}}>
          <ActiveProjectsWidget/>
          <BenchWidget/>
          <div style={{gridColumn:"1/-1"}}><AlertsWidget role={role}/></div>
          <div style={{gridColumn:"1/-1"}}><ActivityFeedWidget/></div>
        </div>
      )}

      {/* ── ADMIN / DELIVERY HEAD VIEW ── */}
      {(role==="admin"||role==="delivery_head")&&(
        <div style={{marginTop:9}}>
          {/* Row 1: Pipeline + SOW + Projects */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:9}}>
            <PipelineWidget/>
            <SowHealthWidget/>
            <ActiveProjectsWidget/>
          </div>
          {/* Row 2: Bench + Finance + Alerts */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:9}}>
            <BenchWidget/>
            <FinanceWidget/>
            <AlertsWidget role={role}/>
          </div>
          {/* Row 3: Utilization wide + Activity */}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:9}}>
            <UtilizationWidget/>
            <ActivityFeedWidget/>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── TABS CONFIG ──────────────────────────────────────────── */
const TABS = [
  { id:"sales",     label:"Sales",      icon:"📋", desc:"Requirements & assignment" },
  { id:"sow",       label:"SOW",        icon:"📝", desc:"Statement of Work" },
  { id:"project",   label:"Project",    icon:"🚀", desc:"Project setup" },
  { id:"resources", label:"Resources",  icon:"👥", desc:"Staffing & allocation" },
  { id:"delivery",  label:"Delivery",   icon:"⏱",  desc:"Timesheets & approval" },
  { id:"finance",   label:"Finance",    icon:"💰", desc:"Invoicing & payments" },
  { id:"monitor",   label:"Monitor",    icon:"📡", desc:"SOW health & alerts" },
];

/* ── TAB: SALES ───────────────────────────────────────────── */
function TabSales({deal}){
  return(
    <div>
      <div className="stat-row">
        {[
          {lbl:"Contract Value",val:fmtFull(deal.value),delta:null,col:"#1d4ed8"},
          {lbl:"Budget",val:fmtFull(deal.budget),delta:null,col:"#059669"},
          {lbl:"Utilization",val:`${Math.round(deal.value/deal.budget*100)}%`,delta:null,col:"#7c3aed"},
          {lbl:"Priority",val:deal.priority,delta:null,col:PRIORITY_COLORS[deal.priority]},
        ].map(s=>(
          <div key={s.lbl} className="stat-card">
            <div className="stat-val" style={{fontSize:15,color:s.col}}>{s.val}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="fg fg-3" style={{marginBottom:10}}>
        <div className="sh">Engagement Details</div>
        <div><label className="lbl">Sales ID</label><input className="fi" defaultValue={deal.id} /></div>
        <div><label className="lbl">Engagement Title</label><input className="fi" defaultValue={deal.title} /></div>
        <div><label className="lbl">Client / Account</label><input className="fi" defaultValue={deal.client} /></div>
        <div><label className="lbl">Service Type</label>
          <select className="fi" defaultValue={deal.type}>
            {["IT Services","Data & Analytics","Digital Services","Cloud Services","Managed Services","Contract Staffing"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div><label className="lbl">Region / Market</label>
          <select className="fi" defaultValue={deal.region}>
            {["North America","Europe","APAC","LATAM","MEA"].map(r=><option key={r}>{r}</option>)}
          </select>
        </div>
        <div><label className="lbl">Engagement Type</label>
          <select className="fi"><option>External</option><option>Internal</option></select>
        </div>

        <div className="sh">Financials & Timeline</div>
        <div><label className="lbl">Estimated Value (USD)</label><input className="fi" defaultValue={deal.value.toLocaleString()} /></div>
        <div><label className="lbl">Budget (USD)</label><input className="fi" defaultValue={deal.budget.toLocaleString()} /></div>
        <div><label className="lbl">Contract Type</label>
          <select className="fi"><option>T&M</option><option>Fixed Price</option><option>Retainer</option><option>Milestone</option></select>
        </div>
        <div><label className="lbl">Start Date</label><input type="date" className="fi" defaultValue={deal.start} /></div>
        <div><label className="lbl">End Date</label><input type="date" className="fi" defaultValue={deal.end} /></div>
        <div><label className="lbl">Source</label>
          <select className="fi"><option>RFP</option><option>Direct</option><option>Referral</option><option>Inbound</option><option>Partner</option></select>
        </div>

        <div className="sh">Assignment</div>
        <div><label className="lbl">Account Owner</label>
          <select className="fi" defaultValue={deal.owner}>
            {["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"].map(u=><option key={u}>{u}</option>)}
          </select>
        </div>
        <div><label className="lbl">Delivery Head</label>
          <select className="fi" defaultValue={deal.dh}>
            {["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"].map(u=><option key={u}>{u}</option>)}
          </select>
        </div>
        <div><label className="lbl">Priority</label>
          <select className="fi" defaultValue={deal.priority}>
            {["Critical","High","Medium","Low"].map(p=><option key={p}>{p}</option>)}
          </select>
        </div>

        <div className="sh">Skills Required</div>
        <div className="fg-full">
          <div className="tags">{deal.skills.map(s=><span key={s} className="tag">{s}<button className="tag-x">×</button></span>)}</div>
          <input className="fi" placeholder="+ add skill (e.g. React, AWS, DevOps)" style={{marginTop:5}} />
        </div>

        <div className="sh">Description & Notes</div>
        <div className="fg-full"><label className="lbl">Opportunity Description</label>
          <textarea className="fi" rows={3} defaultValue="Full bidirectional CRM sync for enterprise tier clients including contact, deal, and activity data." />
        </div>
        <div className="fg-full"><label className="lbl">Internal Notes</label>
          <textarea className="fi" rows={2} defaultValue="Client requires Salesforce connector by Q1. Executive sponsor: James Whitfield." />
        </div>
      </div>
    </div>
  );
}

/* ── TAB: SOW ─────────────────────────────────────────────── */
function TabSOW({deal}){
  const [file,setFile]=useState(deal.sow?"SOW-2026-041-v1.pdf":null);
  const hasSow = !!deal.sow;
  return(
    <div>
      {!hasSow && <div className="alert info"><span className="alert-icon"><Ico n="alert" s={13}/></span><div><strong>No SOW attached.</strong> Create a draft SOW or upload the client-provided document to proceed to project creation.</div></div>}
      {hasSow  && <div className="alert success"><span className="alert-icon">✓</span><div><strong>SOW Active</strong> — {deal.sow} · Expiry: {new Date(deal.end).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div></div>}

      <div className="fg fg-3" style={{marginBottom:10}}>
        <div className="sh">SOW Reference</div>
        <div><label className="lbl">SOW Number</label><input className="fi" defaultValue={deal.sow||""} placeholder="SOW-2026-XXX" /></div>
        <div><label className="lbl">SOW Title</label><input className="fi" defaultValue={hasSow?"Nexus Digital Transformation Phase 1":""} placeholder="e.g. Phase 1 Implementation" /></div>
        <div><label className="lbl">Category</label>
          <select className="fi"><option>Digital Transformation</option><option>IT Services</option><option>Data & Analytics</option><option>Managed Services</option><option>Cloud Services</option></select>
        </div>

        <div className="sh">Key Dates</div>
        <div><label className="lbl">Effective Date</label><input type="date" className="fi" defaultValue={deal.start} /></div>
        <div><label className="lbl">Expiry Date</label><input type="date" className="fi" defaultValue={deal.end} /></div>
        <div><label className="lbl">Signed Date</label><input type="date" className="fi" defaultValue="2026-01-30" /></div>
        <div><label className="lbl">Amendment Count</label><input className="fi" defaultValue="0" /></div>
        <div><label className="lbl">Contract Value (USD)</label><input className="fi" defaultValue={deal.value.toLocaleString()} /></div>
        <div><label className="lbl">Billing Model</label>
          <select className="fi"><option>T&M — Monthly</option><option>Fixed Milestone</option><option>Retainer</option></select>
        </div>

        <div className="sh">SOW Document</div>
        <div className="fg-full">
          <div className={`upload-zone ${file?"has-file":""}`} onClick={()=>setFile(file?"":"SOW-Draft.pdf")} style={{cursor:"pointer"}}>
            {file
              ? <><div style={{fontSize:16,marginBottom:4}}>📄</div><div style={{fontWeight:600,fontSize:11}}>{file}</div><div style={{fontSize:9.5,marginTop:2,opacity:.7}}>Click to replace · 1.8 MB · Uploaded by Dana Mercer</div></>
              : <><div style={{fontSize:18,marginBottom:4}}><Ico n="upload" s={18}/></div><div style={{fontWeight:600,fontSize:11}}>Drop PDF or click to upload</div><div style={{fontSize:9.5,marginTop:2}}>Signed SOW, draft, or received client SOW</div></>
            }
          </div>
          <div style={{display:"flex",gap:6,marginTop:7}}>
            <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="upload" s={10}/> Upload Client SOW</button>
            <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="sow" s={10}/> Generate SOW Template</button>
            <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="mail" s={10}/> Send to Client</button>
          </div>
        </div>

        <div className="sh">SOW Status & Approval</div>
        <div><label className="lbl">Current Status</label>
          <select className="fi" defaultValue={hasSow?"Active":"Draft"}>
            {["Draft","Submitted","Under Review","Approved","Active","Expired","Terminated"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div><label className="lbl">Client Contact (SOW Signatory)</label><input className="fi" defaultValue="James Whitfield (VP Engineering)" /></div>
        <div><label className="lbl">Internal Approver</label>
          <select className="fi" defaultValue={deal.dh}>{["Dana Mercer","Lian Zhou","Rachel Kim","Tom Ashby","Sam Keller"].map(u=><option key={u}>{u}</option>)}</select>
        </div>

        <div className="sh">Activity Log</div>
        <div className="fg-full">
          {[
            {date:"2026-01-10",user:"Dana Mercer",action:"SOW created",detail:"Initial draft registered",c:"gray"},
            {date:"2026-01-30",user:"Dana Mercer",action:"Document uploaded",detail:"SOW-2026-041-v1.pdf signed copy",c:"blue"},
            {date:"2026-02-01",user:"System",action:"Status → Active",detail:"Effective date reached",c:"green"},
          ].map((e,i)=>(
            <div key={i} className="tl-item">
              <div><div className={`tl-dot ${e.c==="green"?"green":e.c==="blue"?"":""}`} style={{background:e.c==="green"?"#10b981":e.c==="blue"?"#3b82f6":"#cbd5e1"}} /></div>
              <div><div className="tl-date">{e.date} · {e.user}</div><div className="tl-text">{e.action}</div><div className="tl-sub">{e.detail}</div></div>
            </div>
          ))}
          <input className="fi" placeholder="Add note or log entry…" style={{marginTop:4}} />
        </div>
      </div>
    </div>
  );
}

/* ── TAB: PROJECT ─────────────────────────────────────────── */
function TabProject({deal}){
  const hasProj = !!deal.project;
  const [created,setCreated]=useState(hasProj);
  return(
    <div>
      {!hasProj && !created && <div className="alert warn"><span className="alert-icon">⚠</span><div><strong>SOW must be confirmed</strong> before project creation. Once SOW is Active, create the project manually or trigger auto-creation.</div></div>}
      {(hasProj||created) && <div className="alert success"><span className="alert-icon">✓</span><div><strong>Project created</strong> — {deal.project||"PRJ-NEW"} · Status: Active</div></div>}

      <div className="fg fg-3" style={{marginBottom:10}}>
        <div className="sh">Project Identity</div>
        <div><label className="lbl">Project ID</label><input className="fi" defaultValue={deal.project||""} placeholder="PRJ-XXXX (auto-generated)" /></div>
        <div><label className="lbl">Project Name</label><input className="fi" defaultValue={deal.title} /></div>
        <div><label className="lbl">Project Code</label><input className="fi" defaultValue="NX-DT-2026" placeholder="Internal code" /></div>
        <div><label className="lbl">Linked SOW</label><input className="fi" defaultValue={deal.sow} disabled /></div>
        <div><label className="lbl">Linked Sales Req</label><input className="fi" defaultValue={deal.id} disabled /></div>
        <div><label className="lbl">Status</label>
          <select className="fi"><option>Planning</option><option>Active</option><option>On Hold</option><option>Completed</option><option>Cancelled</option></select>
        </div>

        <div className="sh">Timeline & Delivery</div>
        <div><label className="lbl">Project Start</label><input type="date" className="fi" defaultValue={deal.start} /></div>
        <div><label className="lbl">Project End</label><input type="date" className="fi" defaultValue={deal.end} /></div>
        <div><label className="lbl">Delivery Model</label>
          <select className="fi"><option>Agile / Scrum</option><option>Kanban</option><option>Waterfall</option><option>Hybrid</option></select>
        </div>
        <div><label className="lbl">Work Model</label>
          <select className="fi"><option>Remote</option><option>Hybrid</option><option>Onsite</option></select>
        </div>
        <div><label className="lbl">Sprint Length</label>
          <select className="fi"><option>2 weeks</option><option>1 week</option><option>3 weeks</option><option>4 weeks</option></select>
        </div>
        <div><label className="lbl">Estimated Effort (hrs)</label><input className="fi" placeholder="e.g. 1200" /></div>

        <div className="sh">Team Assignment</div>
        <div><label className="lbl">Project Manager</label>
          <select className="fi" defaultValue={deal.dh}>{["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"].map(u=><option key={u}>{u}</option>)}</select>
        </div>
        <div><label className="lbl">Delivery Head</label>
          <select className="fi" defaultValue={deal.dh}>{["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"].map(u=><option key={u}>{u}</option>)}</select>
        </div>
        <div><label className="lbl">QA Lead</label>
          <select className="fi"><option>— Unassigned —</option>{["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller"].map(u=><option key={u}>{u}</option>)}</select>
        </div>

        <div className="sh">Milestones</div>
        <div className="fg-full">
          <table className="ts-tbl" style={{width:"100%"}}>
            <thead><tr><th>Milestone</th><th>Target Date</th><th>Status</th><th>Owner</th></tr></thead>
            <tbody>
              {[
                {m:"Kickoff & Onboarding",d:"2026-02-10",s:"Done"},
                {m:"Discovery & Requirements",d:"2026-02-28",s:"Done"},
                {m:"Design & Architecture",d:"2026-03-20",s:"In Progress"},
                {m:"Development Sprint 1–3",d:"2026-05-15",s:"Pending"},
                {m:"UAT & Client Sign-off",d:"2026-06-30",s:"Pending"},
                {m:"Go-Live",d:"2026-07-15",s:"Pending"},
              ].map((row,i)=>(
                <tr key={i}>
                  <td style={{fontWeight:500}}>{row.m}</td>
                  <td style={{fontFamily:"monospace",fontSize:10}}>{row.d}</td>
                  <td><span className="badge" style={{background:row.s==="Done"?"#f0fdf4":row.s==="In Progress"?"#eff6ff":"#f8fafc",color:row.s==="Done"?"#16a34a":row.s==="In Progress"?"#1d4ed8":"#94a3b8",fontSize:9}}>{row.s}</span></td>
                  <td>{deal.dh}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-ghost" style={{fontSize:10,marginTop:6}}><Ico n="plus" s={10}/> Add Milestone</button>
        </div>

        {!created && <div className="fg-full" style={{marginTop:4}}>
          <button className="btn btn-primary" onClick={()=>setCreated(true)} style={{fontSize:10.5}}><Ico n="proj" s={11}/> Create Project</button>
          <span style={{fontSize:9.5,color:"#94a3b8",marginLeft:8}}>or</span>
          <button className="btn btn-ghost" onClick={()=>setCreated(true)} style={{fontSize:10,marginLeft:6}}>Auto-create from SOW</button>
        </div>}
      </div>
    </div>
  );
}

/* ── TAB: RESOURCES ───────────────────────────────────────── */
function TabResources({deal}){
  const resources = [
    {name:"Priya Sharma",role:"Senior React Developer",avail:100,alloc:0,exp:6,skills:["React","Node.js","TypeScript"],status:"Bench"},
    {name:"Carlos Ruiz",role:"Cloud Architect",avail:100,alloc:0,exp:9,skills:["AWS","Terraform","K8s"],status:"Bench"},
    {name:"Emma Liu",role:"UI/UX Designer",avail:60,alloc:40,exp:4,skills:["Figma","Design Systems","UX Research"],status:"Partial"},
    {name:"James Park",role:"Backend Engineer",avail:100,alloc:0,exp:5,skills:["Node.js","PostgreSQL","REST API"],status:"Bench"},
    {name:"Sofia Torres",role:"DevOps Engineer",avail:30,alloc:70,exp:7,skills:["Docker","Jenkins","GitHub Actions"],status:"Partial"},
    {name:"Raj Patel",role:"Data Engineer",avail:100,alloc:0,exp:5,skills:["Python","ETL","Databricks"],status:"Bench"},
  ];
  const [selected,setSelected]=useState(["Carlos Ruiz"]);
  const [tab,setTab]=useState("bench");
  return(
    <div>
      <div className="stat-row" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[{lbl:"Assigned",val:selected.length,col:"#1d4ed8"},{lbl:"Requested",val:2,col:"#7c3aed"},{lbl:"Open Roles",val:3,col:"#d97706"}].map(s=>(
          <div key={s.lbl} className="stat-card"><div className="stat-val" style={{fontSize:16,color:s.col}}>{s.val}</div><div className="stat-lbl">{s.lbl}</div></div>
        ))}
      </div>

      <div style={{display:"flex",gap:4,marginBottom:9}}>
        {[{id:"bench",lbl:"Bench / Available"},{id:"assigned",lbl:"Assigned"},{id:"request",lbl:"New Request"},{id:"partial",lbl:"Partial Allocation"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className="btn" style={{fontSize:10,background:tab===t.id?"#eff6ff":"#f8fafc",color:tab===t.id?"#1d4ed8":"#64748b",border:`1px solid ${tab===t.id?"#bfdbfe":"#e2e8f0"}`,padding:"4px 9px"}}>{t.lbl}</button>
        ))}
        <div className="search-wrap" style={{marginLeft:"auto",height:24}}>
          <Ico n="search" s={10} c="#94a3b8"/>
          <input placeholder="Search name, skill, role…" style={{width:130,fontSize:10}}/>
        </div>
      </div>

      {tab==="request" && (
        <div className="fg fg-3" style={{marginBottom:10,padding:"10px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:7}}>
          <div className="sh" style={{marginTop:0}}>Resource Request Form</div>
          <div><label className="lbl">Role / Title</label><input className="fi" placeholder="e.g. Senior React Developer" /></div>
          <div><label className="lbl">Headcount</label><input className="fi" defaultValue="1" type="number" /></div>
          <div><label className="lbl">Start Date</label><input type="date" className="fi" defaultValue={deal.start}/></div>
          <div><label className="lbl">Duration (months)</label><input className="fi" placeholder="e.g. 6" /></div>
          <div><label className="lbl">Allocation %</label><input className="fi" placeholder="100" /></div>
          <div><label className="lbl">Work Model</label>
            <select className="fi"><option>Remote</option><option>Hybrid</option><option>Onsite</option></select>
          </div>
          <div><label className="lbl">Min. Experience</label><input className="fi" placeholder="e.g. 5 years" /></div>
          <div><label className="lbl">Employee Type</label>
            <select className="fi"><option>Internal</option><option>External Contractor</option><option>Subcontractor</option></select>
          </div>
          <div><label className="lbl">Clearance Level</label>
            <select className="fi"><option>None</option><option>Confidential</option><option>Secret</option></select>
          </div>
          <div className="fg-full"><label className="lbl">Required Skills</label>
            <div className="tags" style={{marginBottom:5}}>
              {deal.skills.map(s=><span key={s} className="tag">{s}<button className="tag-x">×</button></span>)}
            </div>
            <input className="fi" placeholder="+ add skill" />
          </div>
          <div className="fg-full"><label className="lbl">Notes / Special Requirements</label><textarea className="fi" rows={2} /></div>
          <div className="fg-full" style={{display:"flex",gap:6}}><button className="btn btn-primary" style={{fontSize:10}}>Submit Request</button><button className="btn btn-ghost" style={{fontSize:10}}>Cancel</button></div>
        </div>
      )}

      {(tab==="bench"||tab==="partial") && (
        <div className="res-grid">
          {resources.filter(r=>tab==="partial"?r.status==="Partial":r.status==="Bench"||r.status==="Partial").map(r=>(
            <div key={r.name} className={`res-card ${selected.includes(r.name)?"selected":""}`} onClick={()=>setSelected(p=>p.includes(r.name)?p.filter(x=>x!==r.name):[...p,r.name])}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div className="res-name">{r.name}</div>
                  <div className="res-meta">{r.role} · {r.exp}y exp</div>
                </div>
                <span className="badge" style={{background:r.status==="Bench"?"#f0fdf4":"#fffbeb",color:r.status==="Bench"?"#16a34a":"#92400e",fontSize:9}}>{r.status}</span>
              </div>
              <div className="tags" style={{margin:"5px 0 5px"}}>
                {r.skills.map(s=><span key={s} className="tag gray" style={{fontSize:9}}>{s}</span>)}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:9.5,color:"#64748b"}}>
                <span>Availability: <strong style={{color:"#374151"}}>{r.avail}%</strong></span>
                {selected.includes(r.name)&&<span style={{color:"#1d4ed8",fontWeight:700,fontSize:10}}>✓ Selected</span>}
              </div>
              <div className="alloc-bar"><div className="alloc-fill" style={{width:`${r.alloc}%`}} /></div>
            </div>
          ))}
        </div>
      )}

      {tab==="assigned" && (
        <table className="ts-tbl">
          <thead><tr><th>Name</th><th>Role</th><th>Alloc %</th><th>From</th><th>To</th><th>Timesheet</th><th>Status</th></tr></thead>
          <tbody>
            {[
              {name:"Carlos Ruiz",role:"Cloud Architect",alloc:100,from:"2026-02-10",to:"2026-06-30",ts:"Submitted",s:"Active"},
              {name:"Emma Liu",role:"UI/UX Designer",alloc:40,from:"2026-03-01",to:"2026-05-31",ts:"Pending",s:"Active"},
            ].map((r,i)=>(
              <tr key={i}>
                <td style={{fontWeight:600}}>{r.name}</td>
                <td style={{color:"#64748b"}}>{r.role}</td>
                <td><span style={{fontFamily:"monospace",fontWeight:700,color:"#1d4ed8"}}>{r.alloc}%</span></td>
                <td style={{fontFamily:"monospace",fontSize:10}}>{r.from}</td>
                <td style={{fontFamily:"monospace",fontSize:10}}>{r.to}</td>
                <td><span className="badge" style={{background:r.ts==="Submitted"?"#eff6ff":"#fffbeb",color:r.ts==="Submitted"?"#1d4ed8":"#92400e",fontSize:9}}>{r.ts}</span></td>
                <td><span className="badge" style={{background:"#f0fdf4",color:"#16a34a",fontSize:9}}>{r.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ── TAB: DELIVERY / TIMESHEETS ───────────────────────────── */
function TabDelivery({deal}){
  const days=["Mon","Tue","Wed","Thu","Fri"];
  const resources=["Carlos Ruiz","Emma Liu"];
  const [data,setData]=useState({
    "Carlos Ruiz":{Mon:8,Tue:8,Wed:8,Thu:8,Fri:8},
    "Emma Liu":{Mon:4,Tue:4,Wed:4,Thu:4,Fri:4},
  });
  const total=(name)=>Object.values(data[name]||{}).reduce((a,b)=>a+(+b||0),0);
  return(
    <div>
      <div className="stat-row" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
        {[{lbl:"Total Hours (Mar)",val:"284h",col:"#1d4ed8"},{lbl:"Logged This Week",val:"120h",col:"#059669"},{lbl:"Pending Approval",val:"80h",col:"#d97706"},{lbl:"Approved (YTD)",val:"1,040h",col:"#7c3aed"}].map(s=>(
          <div key={s.lbl} className="stat-card"><div className="stat-val" style={{fontSize:15,color:s.col}}>{s.val}</div><div className="stat-lbl">{s.lbl}</div></div>
        ))}
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{fontSize:10.5,fontWeight:600,color:"#374151"}}>Week of Mar 3 – Mar 7, 2026</div>
        <div style={{display:"flex",gap:5}}>
          <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="upload" s={10}/> Upload Timesheet</button>
          <button className="btn btn-primary" style={{fontSize:10}}>Submit for Approval</button>
        </div>
      </div>

      <div style={{border:"1px solid #e2e8f0",borderRadius:7,overflow:"hidden",marginBottom:10}}>
        <table className="ts-tbl" style={{width:"100%"}}>
          <thead>
            <tr>
              <th style={{width:130}}>Resource</th>
              {days.map(d=><th key={d} style={{textAlign:"center"}}>{d}</th>)}
              <th style={{textAlign:"center"}}>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(name=>(
              <tr key={name}>
                <td style={{fontWeight:600,fontSize:10.5}}>{name}</td>
                {days.map(d=>(
                  <td key={d}>
                    <input className="ts-input" style={{width:36}} value={data[name][d]} onChange={e=>setData(p=>({...p,[name]:{...p[name],[d]:e.target.value}}))} />
                  </td>
                ))}
                <td style={{textAlign:"center",fontWeight:700,fontFamily:"monospace",color:"#1d4ed8"}}>{total(name)}h</td>
                <td><span className="badge" style={{background:"#fffbeb",color:"#92400e",fontSize:9}}>Pending</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div>
          <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>Approval Chain</div>
          {[
            {stage:"Employee Submit",user:"Carlos Ruiz",status:"Done",date:"Mar 08"},
            {stage:"PM Review",user:"Rachel Kim",status:"Pending",date:"—"},
            {stage:"Delivery Head",user:"Dana Mercer",status:"Waiting",date:"—"},
            {stage:"Finance Verified",user:"Finance Team",status:"Waiting",date:"—"},
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 0",borderBottom:"1px solid #f1f5f9"}}>
              <div style={{width:16,height:16,borderRadius:"50%",background:s.status==="Done"?"#059669":s.status==="Pending"?"#d97706":"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {s.status==="Done"&&<Ico n="check" s={9} c="#fff"/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:600,color:"#374151"}}>{s.stage}</div>
                <div style={{fontSize:9.5,color:"#94a3b8"}}>{s.user}</div>
              </div>
              <div style={{fontSize:9,fontFamily:"monospace",color:"#94a3b8"}}>{s.date}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>Timesheet Notes</div>
          <textarea className="fi" rows={5} placeholder="Add notes, overtime justification, or client remarks…" style={{marginBottom:6}} />
          <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:6,marginTop:4}}>Client Timesheet PDF</div>
          <div className="upload-zone" style={{padding:10,fontSize:10}}>
            <Ico n="upload" s={14}/><div style={{marginTop:4,fontWeight:600,fontSize:10.5}}>Drop or click to attach client-approved timesheet</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── TAB: FINANCE ─────────────────────────────────────────── */
function TabFinance({deal}){
  return(
    <div>
      <div className="stat-row">
        {[
          {lbl:"Contract Value",val:fmtFull(deal.value),col:"#1d4ed8"},
          {lbl:"Invoiced (YTD)",val:"$71,000",col:"#7c3aed"},
          {lbl:"Received",val:"$35,500",col:"#059669"},
          {lbl:"Outstanding",val:"$35,500",col:"#d97706"},
        ].map(s=>(
          <div key={s.lbl} className="stat-card"><div className="stat-val" style={{fontSize:14,color:s.col}}>{s.val}</div><div className="stat-lbl">{s.lbl}</div></div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div>
          <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>Invoice Requests</div>
          <table className="ts-tbl" style={{width:"100%"}}>
            <thead><tr><th>Invoice #</th><th>Period</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {[
                {inv:"INV-0084",period:"Feb 2026",amt:"$35,500",status:"Paid"},
                {inv:"INV-0097",period:"Mar 2026",amt:"$35,500",status:"Sent"},
                {inv:"INV-DRAFT",period:"Apr 2026",amt:"$35,500",status:"Draft"},
              ].map((r,i)=>(
                <tr key={i}>
                  <td style={{fontFamily:"monospace",fontSize:9.5,color:"#6366f1"}}>{r.inv}</td>
                  <td>{r.period}</td>
                  <td style={{fontWeight:700,fontFamily:"monospace"}}>{r.amt}</td>
                  <td><span className="badge" style={{background:r.status==="Paid"?"#f0fdf4":r.status==="Sent"?"#eff6ff":"#f8fafc",color:r.status==="Paid"?"#16a34a":r.status==="Sent"?"#1d4ed8":"#94a3b8",fontSize:9}}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-ghost" style={{fontSize:10,marginTop:7}}><Ico n="plus" s={10}/> Create Invoice Request</button>
        </div>

        <div>
          <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>Payment Tracking</div>
          <table className="ts-tbl" style={{width:"100%"}}>
            <thead><tr><th>Ref</th><th>Amount</th><th>Rcvd Date</th><th>Method</th></tr></thead>
            <tbody>
              {[
                {ref:"PAY-0041",amt:"$35,500",date:"2026-03-01",method:"Wire"},
              ].map((r,i)=>(
                <tr key={i}>
                  <td style={{fontFamily:"monospace",fontSize:9.5,color:"#059669"}}>{r.ref}</td>
                  <td style={{fontWeight:700,fontFamily:"monospace"}}>{r.amt}</td>
                  <td style={{fontFamily:"monospace",fontSize:10}}>{r.date}</td>
                  <td>{r.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-ghost" style={{fontSize:10,marginTop:7}}><Ico n="plus" s={10}/> Log Payment</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:8}}>Invoice Request Form</div>
        <div className="fg fg-3">
          <div><label className="lbl">Billing Period (Month)</label><input type="month" className="fi" defaultValue="2026-04" /></div>
          <div><label className="lbl">Approved Hours</label><input className="fi" placeholder="e.g. 160" /></div>
          <div><label className="lbl">Rate (USD/hr)</label><input className="fi" placeholder="e.g. 185" /></div>
          <div><label className="lbl">Invoice Amount (USD)</label><input className="fi" placeholder="Auto-calculated" /></div>
          <div><label className="lbl">Billing Contact</label><input className="fi" placeholder="Client finance contact" /></div>
          <div><label className="lbl">PO Number</label><input className="fi" placeholder="Client PO ref" /></div>
          <div className="fg-full"><label className="lbl">Notes / Special Terms</label><textarea className="fi" rows={2} placeholder="Add any billing notes, discounts, or adjustments…" /></div>
          <div className="fg-full" style={{display:"flex",gap:6}}>
            <button className="btn btn-primary" style={{fontSize:10}}>Send to Finance</button>
            <button className="btn btn-ghost" style={{fontSize:10}}>Save Draft</button>
            <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="upload" s={10}/> Attach Approved Timesheet PDF</button>
          </div>
        </div>
      </div>

      <div style={{marginTop:10,padding:"8px 10px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6}}>
        <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:4}}>Payment Acknowledgement</div>
        <div style={{display:"flex",gap:8}}>
          <select className="fi" style={{flex:1}}><option>Select invoice to acknowledge…</option><option>INV-0084 — Feb 2026 — $35,500</option></select>
          <button className="btn btn-success" style={{fontSize:10}}>Send Acknowledgement to Client</button>
        </div>
      </div>
    </div>
  );
}

/* ── TAB: MONITOR ─────────────────────────────────────────── */
function TabMonitor({deal}){
  const days = daysTo(deal.end);
  const alertLevel = days!==null ? (days<=0?"danger":days<=10?"danger":days<=30?"warn":"info") : "info";
  const totalDays = Math.ceil((new Date(deal.end)-new Date(deal.start))/864e5);
  const elapsed   = Math.ceil((new Date()-new Date(deal.start))/864e5);
  const pct       = Math.min(100,Math.max(0,Math.round(elapsed/totalDays*100)));

  return(
    <div>
      {days!==null && days<=30 && (
        <div className={`alert ${alertLevel}`}>
          <span className="alert-icon">{days<=0?"🔴":days<=10?"⚠":"🔔"}</span>
          <div>
            <strong>{days<=0?"SOW EXPIRED":"SOW Expiry Alert"}</strong> — {days<=0?`Expired ${Math.abs(days)} days ago.`:days<=10?`Only ${days} days remaining. Renewal or closure decision required urgently.`:`${days} days remaining. Begin renewal discussions.`}
            <div style={{marginTop:4,display:"flex",gap:5}}>
              <button className="btn btn-warning" style={{fontSize:9.5,padding:"3px 8px"}}>Extend SOW</button>
              <button className="btn btn-ghost" style={{fontSize:9.5,padding:"3px 8px"}}>Close Project</button>
              <button className="btn btn-ghost" style={{fontSize:9.5,padding:"3px 8px"}}><Ico n="mail" s={9}/> Send Reminder</button>
            </div>
          </div>
        </div>
      )}

      <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px 14px",marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:10.5,fontWeight:600,color:"#374151"}}>SOW Progress — {deal.sow||"No SOW"}</div>
          <span style={{fontSize:10,color:"#6366f1",fontFamily:"monospace",fontWeight:700}}>{pct}% elapsed</span>
        </div>
        <div style={{background:"#e2e8f0",borderRadius:4,height:8,overflow:"hidden"}}>
          <div style={{height:"100%",background:`linear-gradient(90deg, #3b82f6, ${pct>80?"#ef4444":"#8b5cf6"})`,width:`${pct}%`,borderRadius:4,transition:"width .5s"}} />
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#94a3b8",marginTop:4}}>
          <span>{deal.start}</span>
          <span style={{color:"#64748b"}}>{days!==null?`${days>0?days+" days left":"Expired"}`:"-"}</span>
          <span>{deal.end}</span>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <div>
          <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>SOW Health Indicators</div>
          {[
            {metric:"Budget Utilization",val:`${Math.round(deal.value/deal.budget*100)}%`,status:"ok"},
            {metric:"Schedule Progress",val:`${pct}%`,status:pct>90?"warn":"ok"},
            {metric:"Milestones Complete",val:"2 / 6",status:"ok"},
            {metric:"Resource Allocation",val:"100%",status:"ok"},
            {metric:"Timesheet Compliance",val:"95%",status:"ok"},
            {metric:"Invoice Cycle",val:"On Track",status:"ok"},
          ].map((h,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #f8fafc",fontSize:10.5}}>
              <span style={{color:"#475569"}}>{h.metric}</span>
              <span style={{fontWeight:700,color:h.status==="warn"?"#d97706":"#059669",fontFamily:"monospace"}}>{h.val}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>Alert Configuration</div>
          <div className="fg fg-2" style={{gap:6}}>
            <div><label className="lbl">Expiry Warn (days before)</label><input className="fi" defaultValue="10" /></div>
            <div><label className="lbl">Notify User(s)</label><input className="fi" defaultValue={deal.dh} /></div>
            <div><label className="lbl">Secondary Notify</label><input className="fi" placeholder="email or user" /></div>
            <div><label className="lbl">Alert Channel</label>
              <select className="fi"><option>Email</option><option>Email + In-App</option><option>Slack</option></select>
            </div>
          </div>

          <div style={{marginTop:10}}>
            <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>Extension / Closure</div>
            <div className="fg fg-2" style={{gap:6}}>
              <div><label className="lbl">Action</label>
                <select className="fi"><option>Extend SOW</option><option>Close Project</option><option>Renew</option><option>Terminate</option></select>
              </div>
              <div><label className="lbl">New End Date</label><input type="date" className="fi" defaultValue={deal.end} /></div>
              <div className="fg-full"><label className="lbl">Reason / Notes</label><textarea className="fi" rows={2} placeholder="Reason for extension, closure, or renewal…" /></div>
            </div>
            <div style={{display:"flex",gap:5,marginTop:6}}>
              <button className="btn btn-primary" style={{fontSize:10}}>Update SOW</button>
              <button className="btn btn-danger" style={{fontSize:10}}>Mark Closed</button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>Cron Alert History</div>
        <table className="ts-tbl" style={{width:"100%"}}>
          <thead><tr><th>Triggered</th><th>Type</th><th>Recipient</th><th>Action Taken</th></tr></thead>
          <tbody>
            {[
              {date:"2026-03-01",type:"30-Day Warning",rec:"Rachel Kim",action:"Acknowledged"},
              {date:"2026-02-01",type:"Effective Date",rec:"System",action:"SOW marked Active"},
            ].map((r,i)=>(
              <tr key={i}>
                <td style={{fontFamily:"monospace",fontSize:9.5}}>{r.date}</td>
                <td>{r.type}</td>
                <td>{r.rec}</td>
                <td><span className="badge" style={{background:"#f0fdf4",color:"#16a34a",fontSize:9}}>{r.action}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── LIFECYCLE MODAL ──────────────────────────────────────── */
function LifecycleModal({deal,onClose}){
  const [tab,setTab]=useState("sales");

  const tabUnlock = {
    sales:true,
    sow:true,
    project:!!deal.sow,
    resources:!!deal.sow,
    delivery:!!deal.project,
    finance:!!deal.project,
    monitor:!!deal.sow,
  };

  return(
    <div className="overlay" onClick={e=>{if(e.target.classList.contains("overlay"))onClose()}}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        {/* HEAD */}
        <div className="modal-head">
          <span className="modal-id">{deal.id}</span>
          <div style={{flex:1,minWidth:0}}>
            <div className="modal-title">{deal.title}</div>
            <div className="modal-client">{deal.client} · {deal.type}</div>
          </div>
          <span className="badge" style={{background:STATUS_COLORS[deal.status]+"22",color:STATUS_COLORS[deal.status],fontSize:9,marginRight:6}}>{deal.status}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* STEPPER */}
        <div className="stepper">
          {STAGE_LABELS.map((label,i)=>{
            const isDone    = i < deal.stage - 1;
            const isCurrent = i === deal.stage - 1;
            const isLocked  = i > deal.stage;
            return(
              <div key={label} className="step">
                <div className={`step-node`} onClick={()=>!isLocked&&setTab(TABS[i].id)}>
                  <div className={`step-circle ${isDone?"done":isCurrent?"current":isLocked?"locked":""}`}>{isDone?<Ico n="check" s={9} c="#fff"/>:<span>{i+1}</span>}</div>
                  <div className={`step-label ${isDone?"done":isCurrent?"current":""}`}>{label}</div>
                </div>
                {i<STAGE_LABELS.length-1&&<div className={`step-connector ${isDone?"done":""}`}/>}
              </div>
            );
          })}
        </div>

        {/* TABS */}
        <div className="tab-bar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?"active":""} ${!tabUnlock[t.id]?"locked":""}`}
              onClick={()=>tabUnlock[t.id]&&setTab(t.id)}
              title={!tabUnlock[t.id]?"Complete previous stage to unlock":t.desc}>
              <span>{t.icon}</span>{t.label}
              {!tabUnlock[t.id]&&<span style={{fontSize:9,opacity:.5}}>🔒</span>}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="tab-body">
          {tab==="sales"    &&<TabSales     deal={deal}/>}
          {tab==="sow"      &&<TabSOW       deal={deal}/>}
          {tab==="project"  &&<TabProject   deal={deal}/>}
          {tab==="resources"&&<TabResources deal={deal}/>}
          {tab==="delivery" &&<TabDelivery  deal={deal}/>}
          {tab==="finance"  &&<TabFinance   deal={deal}/>}
          {tab==="monitor"  &&<TabMonitor   deal={deal}/>}
        </div>

        {/* FOOTER */}
        <div className="modal-foot">
          <span className="foot-status">
            <span style={{fontFamily:"monospace",fontSize:9.5,color:"#6366f1"}}>{deal.id}</span>
            {deal.sow&&<span style={{marginLeft:8,fontFamily:"monospace",fontSize:9.5,color:"#0891b2"}}>{deal.sow}</span>}
            {deal.project&&<span style={{marginLeft:8,fontFamily:"monospace",fontSize:9.5,color:"#059669"}}>{deal.project}</span>}
            <span style={{marginLeft:10,fontSize:9.5,color:"#94a3b8"}}>Last updated: Mar 05, 2026 · Rachel Kim</span>
          </span>
          <button className="btn btn-ghost" style={{fontSize:10}} onClick={onClose}>Discard</button>
          <button className="btn btn-secondary" style={{fontSize:10}}>Save Draft</button>
          <button className="btn btn-primary" style={{fontSize:10}}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ── SIDEBAR ──────────────────────────────────────────────── */
function Sidebar({open,onToggle,activePage,onNav}){
  const nav=[
    {id:"dashboard",icon:"dash",label:"Dashboard"},
    {id:"sales",icon:"folder",label:"Sales Requirements",badge:3},
    {id:"sow",icon:"sow",label:"Statements of Work"},
    {id:"sow_approval",icon:"check",label:"SOW Approvals",badge:3},
    {id:"projects",icon:"proj",label:"Projects"},
    {id:"resources",icon:"users",label:"Resources",badge:2},
    {id:"delivery",icon:"time",label:"Delivery & Timesheets"},
    {id:"finance",icon:"finance",label:"Finance & Invoicing"},
    {id:"monitor",icon:"monitor",label:"SOW Monitoring"},
  ];
  return(
    <div className={`sidebar ${open?"open":"closed"}`}>
      <div className="sb-logo">
        <div className="sb-logo-mark">NX</div>
        {open&&<div className="sb-logo-text">NexusOps</div>}
      </div>
      <button className="sb-toggle" onClick={onToggle} title={open?"Collapse":"Expand"}>
        <Ico n={open?"chevL":"chevR"} s={10}/>
      </button>

      {open&&<div className="sb-section">Workspace</div>}
      {nav.map(item=>(
        <div key={item.id} className={`sb-item ${activePage===item.id?"active":""}`} onClick={()=>onNav(item.id)} title={!open?item.label:undefined}>
          <Ico n={item.icon} s={13} c={activePage===item.id?"#93c5fd":"#64748b"}/>
          {open&&<span className="sb-label">{item.label}</span>}
          {open&&item.badge&&<span className="sb-badge">{item.badge}</span>}
        </div>
      ))}

      <div className="sb-bottom">
        <div className={`sb-item`} title={!open?"Settings":undefined}>
          <Ico n="settings" s={13} c="#4b5563"/>
          {open&&<span className="sb-label">Settings</span>}
        </div>
        <div className="sb-user" title={!open?"Dana Mercer":undefined}>
          <div className="av">DM</div>
          {open&&<div><div style={{fontSize:10.5,fontWeight:600,color:"#374151"}}>Dana Mercer</div><div style={{fontSize:9,color:"#94a3b8"}}>Delivery Head</div></div>}
        </div>
      </div>
    </div>
  );
}

/* ── MAIN TABLE PAGE ──────────────────────────────────────── */
function MainList({deals,onOpenLifecycle}){
  const [search,setSearch]=useState("");
  const [filterType,setFilterType]=useState("all");
  const [filterPriority,setFilterPriority]=useState("all");

  const filtered = deals.filter(d=>{
    if(search&&!d.title.toLowerCase().includes(search.toLowerCase())&&!d.client.toLowerCase().includes(search.toLowerCase()))return false;
    if(filterType!=="all"&&d.type!==filterType)return false;
    if(filterPriority!=="all"&&d.priority!==filterPriority)return false;
    return true;
  });

  const stageColor = s=>{
    const c=["","#94a3b8","#d97706","#2563eb","#059669","#7c3aed","#dc2626","#0891b2"];
    return c[s]||"#94a3b8";
  };

  return(
    <div className="content">
      <div className="filter-bar">
        <span style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6}}>Filter:</span>
        {["all","IT Services","Data & Analytics","Digital Services","Cloud Services","Managed Services","Contract Staffing"].map(t=>(
          <button key={t} className={`filter-chip ${filterType===t?"active":""}`} onClick={()=>setFilterType(t)}>
            {t==="all"?"All Types":t}
          </button>
        ))}
        <div style={{width:1,height:14,background:"#e2e8f0",margin:"0 2px"}}/>
        {["all","Critical","High","Medium","Low"].map(p=>(
          <button key={p} className={`filter-chip ${filterPriority===p?"active":""}`} onClick={()=>setFilterPriority(p)}>
            {p==="all"?"All Priority":p}
          </button>
        ))}
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Client</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Value</th>
              <th>SOW</th>
              <th>Lifecycle</th>
              <th style={{width:120}}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d=>(
              <tr key={d.id}>
                <td><span className="tbl-id">{d.id}</span></td>
                <td><span className="tbl-title" title={d.title}>{d.title}</span></td>
                <td><span className="tbl-client">{d.client}</span></td>
                <td>
                  <span className="badge" style={{background:TYPE_COLORS[d.type]+"18",color:TYPE_COLORS[d.type],fontSize:9}}>{d.type}</span>
                </td>
                <td>
                  <span style={{fontSize:9.5,fontWeight:700,color:PRIORITY_COLORS[d.priority]}}>{d.priority}</span>
                </td>
                <td>
                  <span className="badge" style={{background:STATUS_COLORS[d.status]+"18",color:STATUS_COLORS[d.status],fontSize:9}}>
                    <span className="stage-dot" style={{background:STATUS_COLORS[d.status]}}/>
                    {d.status}
                  </span>
                </td>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div className="av" style={{width:18,height:18,fontSize:8,background:`hsl(${d.owner.charCodeAt(0)*17%360},45%,35%)`}}>{d.owner.split(" ").map(x=>x[0]).join("")}</div>
                    <span style={{fontSize:10,color:"#475569"}}>{d.owner.split(" ")[0]}</span>
                  </div>
                </td>
                <td><span style={{fontSize:10,fontWeight:700,color:"#374151",fontFamily:"monospace"}}>{fmt(d.value)}</span></td>
                <td>
                  {d.sow
                    ? <span style={{fontSize:9.5,fontFamily:"monospace",color:"#0891b2"}}>{d.sow}</span>
                    : <span style={{fontSize:9,color:"#cbd5e1"}}>—</span>}
                </td>
                <td>
                  <div className="lc-bar">
                    {[1,2,3,4,5,6,7].map(s=>(
                      <div key={s} className={`lc-seg ${s<d.stage?"done":s===d.stage?"active":""}`} title={STAGE_LABELS[s-1]} />
                    ))}
                  </div>
                  <div style={{fontSize:8.5,color:stageColor(d.stage),fontWeight:700,marginTop:2,letterSpacing:.3}}>{STAGE_LABELS[d.stage-1]}</div>
                </td>
                <td>
                  <div className="tbl-actions">
                    <button className="act-btn lifecycle" onClick={()=>onOpenLifecycle(d)}>
                      <Ico n="link" s={9}/> Lifecycle
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8,padding:"0 2px"}}>
        <div style={{fontSize:9.5,color:"#94a3b8"}}>{filtered.length} of {deals.length} records · showing all</div>
        <div style={{display:"flex",gap:5}}>
          {["←","1","2","→"].map(p=>(
            <button key={p} style={{width:22,height:22,border:"1px solid #e2e8f0",background:"#fff",borderRadius:4,fontSize:10,cursor:"pointer",color:"#64748b"}}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── NEW REQUIREMENT MODAL ────────────────────────────────── */
const SKILL_POOL = ["API Design","CRM","Enterprise Architecture","Data Visualization","React","SQL","React Native","UX Design","iOS","Android","AWS","DevOps","Compliance","ETL","Data Modeling","SAML","OAuth 2.0","ML","Python","Data Science","Azure","Automation","REST API","ERP Integration","Node.js","IAM","Security","BI","QA","Scrum","Project Management","Terraform","Docker","Kubernetes","PostgreSQL","MongoDB","Elasticsearch","Kafka","Databricks","Snowflake","Power BI","Tableau","Figma","TypeScript","Java","Go",".NET"];
const TYPE_FIELD_MAP = {
  "IT Services":       {label:"Tech Stack / Tools",pool:["React","Angular","Node.js","Java","Python",".NET","Go","Kubernetes","Docker","Kafka","Redis","PostgreSQL","MongoDB","Terraform","Ansible","Jenkins","GitHub Actions"]},
  "Data & Analytics":  {label:"Analytics Tools & Sources",pool:["Power BI","Tableau","Looker","Databricks","Snowflake","dbt","Apache Spark","Azure Synapse","AWS Redshift","BigQuery","Jupyter","MLflow","Python","SQL"]},
  "Digital Services":  {label:"Platforms & Scope",pool:["UX Research","UI Design","Prototyping","Branding","Design System","Web Development","Mobile App","PWA","E-commerce","CMS Development","SEO","Performance Optimization","Figma"]},
  "Managed Services":  {label:"Service Scope",pool:["Application Support","Infrastructure Monitoring","Security Operations","Database Admin","Cloud Operations","Helpdesk L1/L2","Patch Management","Incident Management","Backup & DR","Performance Tuning"]},
  "Cloud Services":    {label:"Cloud Scope",pool:["Virtual Machines","Containers (K8s)","Serverless Functions","Object Storage","RDS","NoSQL DB","CDN","Load Balancer","VPN/Networking","IAM","Secret Management","Terraform","Ansible","GitHub Actions"]},
  "Contract Staffing": {label:"Required Skills",pool:SKILL_POOL},
};

const NR_STEPS = ["Basics","Service Type","Financials","Team & Priority","Description"];

function NewRequirementModal({onClose, onSave, nextId}){
  const [step,setStep]=useState(0);
  const [errors,setErrors]=useState({});
  const [form,setForm]=useState({
    title:"", client:"", engagementName:"", region:"North America", engType:"External",
    source:"Direct", type:"IT Services",
    // financials
    value:"", budget:"", contractType:"T&M", start:"", end:"",
    // team
    owner:"Dana Mercer", dh:"Rachel Kim", priority:"High",
    // type-specific
    typeSkills:[],
    skills:[],
    // contract staffing extras
    roles:[{role:"",count:1}], workModel:"Hybrid", minExp:"", clearanceLevel:"None",
    // it services extras
    solutionType:"Implementation", deploymentModel:"Cloud", cloudProvider:"AWS", slaTier:"Standard", securityClass:"Internal",
    // digital extras
    platform:"Web", designSystem:"Existing", accessibilityStd:"WCAG 2.1 AA",
    // data extras
    analyticsType:"Descriptive", dataVolume:"1–100 GB", dataResidency:"Regional",
    // managed extras
    supportCoverage:"Business Hours", contractDuration:"Annual",
    // cloud extras
    migrationType:"Re-platform",
    // description
    description:"", notes:"", tags:[],
  });

  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const toggleTag=(pool,k,v)=>set(k,form[k].includes(v)?form[k].filter(x=>x!==v):[...form[k],v]);

  const CLIENTS=["Nexus Corp","Meridian Holdings","BlueStar Retail","Orion Financial","TrueNorth Law","Summit Energy","— New Client —"];
  const OWNERS=["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"];

  const validate=()=>{
    const e={};
    if(step===0){if(!form.title.trim())e.title="Required";if(!form.client)e.client="Required";}
    if(step===2){if(!form.value)e.value="Required";if(!form.budget)e.budget="Required";if(!form.start)e.start="Required";if(!form.end)e.end="Required";}
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const next=()=>{if(validate())setStep(s=>Math.min(s+1,NR_STEPS.length-1));};
  const prev=()=>{setErrors({});setStep(s=>Math.max(s-1,0));};

  const handleSave=()=>{
    if(!validate())return;
    const newDeal={
      id:nextId, title:form.title, client:form.client, type:form.type,
      priority:form.priority, status:"Draft", stage:1,
      owner:form.owner, dh:form.dh, budget:parseInt(form.budget)||0,
      value:parseInt(form.value)||0, start:form.start, end:form.end,
      sow:"", project:"", region:form.region,
      skills:form.typeSkills.length?form.typeSkills:form.skills,
    };
    onSave(newDeal);
  };

  const typeInfo = TYPE_FIELD_MAP[form.type];
  const pct = Math.round((step/(NR_STEPS.length-1))*100);

  return(
    <div className="overlay" onClick={e=>{if(e.target.classList.contains("overlay"))onClose()}}>
      <div className="modal" style={{maxWidth:720}} onClick={e=>e.stopPropagation()}>

        {/* HEAD */}
        <div className="modal-head">
          <div style={{width:24,height:24,borderRadius:6,background:"linear-gradient(135deg,#3b82f6,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>✦</div>
          <div style={{flex:1}}>
            <div className="modal-title">New Sales Requirement</div>
            <div className="modal-client">Step {step+1} of {NR_STEPS.length} — {NR_STEPS[step]}</div>
          </div>
          <span style={{fontFamily:"monospace",fontSize:9.5,color:"#475569",marginRight:6}}>{nextId}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* PROGRESS BAR */}
        <div style={{background:"#f8fafc",borderBottom:"1px solid #e2e8f0",padding:"10px 16px 10px",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            {NR_STEPS.map((s,i)=>(
              <div key={s} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,flex:1}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:i<step?"#1d4ed8":i===step?"#7c3aed":"#fff",border:`1.5px solid ${i<step?"#3b82f6":i===step?"#8b5cf6":"#e2e8f0"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:i<=step?"#fff":"#94a3b8",boxShadow:i===step?"0 0 0 3px rgba(139,92,246,.15)":"none",transition:"all .2s"}}>
                  {i<step?<Ico n="check" s={9} c="#fff"/>:i+1}
                </div>
                <div style={{fontSize:8,fontWeight:600,color:i===step?"#7c3aed":i<step?"#3b82f6":"#94a3b8",textTransform:"uppercase",letterSpacing:.5,whiteSpace:"nowrap"}}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{height:2,background:"#e2e8f0",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#3b82f6,#7c3aed)",borderRadius:2,transition:"width .3s"}}/>
          </div>
        </div>

        {/* BODY */}
        <div className="tab-body" style={{flex:1}}>

          {/* ── STEP 0: BASICS ── */}
          {step===0&&(
            <div className="fg fg-3">
              <div className="sh" style={{marginTop:0}}>Engagement Identity</div>
              <div className="fg-full">
                <label className="lbl">Requirement Title <span style={{color:"#ef4444"}}>*</span></label>
                <input className="fi" placeholder="e.g. CRM Integration for Enterprise Tier" value={form.title} onChange={e=>set("title",e.target.value)} style={{borderColor:errors.title?"#ef4444":undefined}} />
                {errors.title&&<div style={{fontSize:9,color:"#ef4444",marginTop:2}}>{errors.title}</div>}
              </div>
              <div>
                <label className="lbl">Client / Account <span style={{color:"#ef4444"}}>*</span></label>
                <select className="fi" value={form.client} onChange={e=>set("client",e.target.value)} style={{borderColor:errors.client?"#ef4444":undefined}}>
                  <option value="">— Select client —</option>
                  {CLIENTS.map(c=><option key={c}>{c}</option>)}
                </select>
                {errors.client&&<div style={{fontSize:9,color:"#ef4444",marginTop:2}}>{errors.client}</div>}
              </div>
              <div>
                <label className="lbl">Engagement / Programme Name</label>
                <input className="fi" placeholder="e.g. Nexus Digital Transformation" value={form.engagementName} onChange={e=>set("engagementName",e.target.value)} />
              </div>
              <div>
                <label className="lbl">Client Industry</label>
                <select className="fi"><option>Financial Services</option><option>Retail & E-commerce</option><option>Healthcare</option><option>Legal & Compliance</option><option>Energy & Utilities</option><option>Technology</option><option>Manufacturing</option><option>Other</option></select>
              </div>
              <div className="sh">Geography & Source</div>
              <div>
                <label className="lbl">Region / Market</label>
                <select className="fi" value={form.region} onChange={e=>set("region",e.target.value)}>
                  {["North America","Europe","APAC","LATAM","MEA"].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="lbl">Engagement Type</label>
                <select className="fi" value={form.engType} onChange={e=>set("engType",e.target.value)}>
                  <option>External</option><option>Internal</option><option>Partner</option>
                </select>
              </div>
              <div>
                <label className="lbl">Lead Source</label>
                <select className="fi" value={form.source} onChange={e=>set("source",e.target.value)}>
                  <option>Direct</option><option>RFP</option><option>Referral</option><option>Inbound</option><option>Partner</option><option>Cold Outreach</option>
                </select>
              </div>
              <div>
                <label className="lbl">Employee Destination</label>
                <input className="fi" placeholder="e.g. Client Site — London HQ" />
              </div>
              <div>
                <label className="lbl">Time Zone</label>
                <select className="fi"><option>EST (UTC-5)</option><option>PST (UTC-8)</option><option>GMT (UTC+0)</option><option>CET (UTC+1)</option><option>IST (UTC+5:30)</option><option>SGT (UTC+8)</option></select>
              </div>
              <div>
                <label className="lbl">Language</label>
                <select className="fi"><option>English</option><option>French</option><option>German</option><option>Spanish</option><option>Japanese</option></select>
              </div>
            </div>
          )}

          {/* ── STEP 1: SERVICE TYPE ── */}
          {step===1&&(
            <div>
              <div style={{marginBottom:10}}>
                <div className="sh" style={{marginTop:0}}>Service Category</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                  {Object.keys(TYPE_FIELD_MAP).map(t=>(
                    <div key={t} onClick={()=>set("type",t)} style={{border:`1.5px solid ${form.type===t?"#3b82f6":"#e2e8f0"}`,borderRadius:7,padding:"8px 10px",cursor:"pointer",background:form.type===t?"#eff6ff":"#fff",transition:"all .12s"}}>
                      <div style={{fontSize:12,marginBottom:3}}>
                        {{"IT Services":"⚙️","Data & Analytics":"◈","Digital Services":"✦","Managed Services":"🛡","Cloud Services":"☁","Contract Staffing":"👥"}[t]}
                      </div>
                      <div style={{fontSize:10.5,fontWeight:600,color:form.type===t?"#1d4ed8":"#374151"}}>{t}</div>
                      <div style={{fontSize:9,color:"#94a3b8",marginTop:2}}>{{"IT Services":"Implementation & integration","Data & Analytics":"BI, ML & data engineering","Digital Services":"UX, web & mobile","Managed Services":"Ongoing ops & support","Cloud Services":"Cloud migration & infra","Contract Staffing":"Resource augmentation"}[t]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fg fg-3">
                <div className="sh">Type-Specific Configuration</div>

                {form.type==="IT Services"&&<>
                  <div><label className="lbl">Solution Type</label><select className="fi" value={form.solutionType} onChange={e=>set("solutionType",e.target.value)}><option>Implementation</option><option>Integration</option><option>Migration</option><option>Modernization</option><option>Support</option></select></div>
                  <div><label className="lbl">Deployment Model</label><select className="fi"><option>Cloud</option><option>On-Premise</option><option>Hybrid</option><option>SaaS</option></select></div>
                  <div><label className="lbl">Cloud Provider</label><select className="fi" value={form.cloudProvider} onChange={e=>set("cloudProvider",e.target.value)}><option>AWS</option><option>Azure</option><option>GCP</option><option>Multi-Cloud</option></select></div>
                  <div><label className="lbl">SLA Tier</label><select className="fi"><option>Standard</option><option>Premium</option><option>Enterprise</option></select></div>
                  <div><label className="lbl">Security Classification</label><select className="fi"><option>Internal</option><option>Confidential</option><option>Restricted</option><option>Public</option></select></div>
                </>}

                {form.type==="Data & Analytics"&&<>
                  <div><label className="lbl">Analytics Type</label><select className="fi"><option>Descriptive</option><option>Diagnostic</option><option>Predictive</option><option>Prescriptive</option></select></div>
                  <div><label className="lbl">Data Volume</label><select className="fi"><option>&lt;1 GB</option><option>1–100 GB</option><option>100 GB–1 TB</option><option>&gt;1 TB</option></select></div>
                  <div><label className="lbl">Data Residency</label><select className="fi"><option>Regional</option><option>Global</option><option>In-Country</option></select></div>
                  <div><label className="lbl">Privacy Compliance</label><select className="fi"><option>GDPR</option><option>HIPAA</option><option>CCPA</option><option>PDPA</option><option>None</option></select></div>
                </>}

                {form.type==="Digital Services"&&<>
                  <div><label className="lbl">Platform</label><select className="fi"><option>Web</option><option>Mobile (iOS)</option><option>Mobile (Android)</option><option>Cross-Platform</option></select></div>
                  <div><label className="lbl">Design System</label><select className="fi"><option>Existing</option><option>New</option><option>Third-party (e.g. MUI)</option></select></div>
                  <div><label className="lbl">Accessibility Standard</label><select className="fi"><option>WCAG 2.1 AA</option><option>WCAG 2.1 AAA</option><option>Section 508</option><option>None</option></select></div>
                  <div><label className="lbl">CMS / Framework</label><input className="fi" placeholder="e.g. React, Next.js, WordPress" /></div>
                </>}

                {form.type==="Managed Services"&&<>
                  <div><label className="lbl">SLA Tier</label><select className="fi"><option>Silver</option><option>Gold</option><option>Platinum</option></select></div>
                  <div><label className="lbl">Support Coverage</label><select className="fi"><option>Business Hours</option><option>12x5</option><option>24x5</option><option>24x7</option></select></div>
                  <div><label className="lbl">Escalation Tiers</label><select className="fi"><option>2</option><option>3</option><option>4</option></select></div>
                  <div><label className="lbl">Contract Duration</label><select className="fi"><option>Monthly</option><option>Quarterly</option><option>Annual</option><option>Multi-Year</option></select></div>
                </>}

                {form.type==="Cloud Services"&&<>
                  <div><label className="lbl">Cloud Provider</label><select className="fi"><option>AWS</option><option>Azure</option><option>GCP</option><option>Multi-Cloud</option></select></div>
                  <div><label className="lbl">Migration Type</label><select className="fi"><option>Re-host (Lift & Shift)</option><option>Re-platform</option><option>Re-architect</option><option>Retire</option></select></div>
                  <div><label className="lbl">Compliance Framework</label><select className="fi"><option>SOC 2 Type II</option><option>ISO 27001</option><option>PCI-DSS</option><option>HIPAA</option><option>FedRAMP</option><option>None</option></select></div>
                </>}

                {form.type==="Contract Staffing"&&<>
                  <div><label className="lbl">Work Model</label><select className="fi"><option>Remote</option><option>Hybrid</option><option>Onsite</option></select></div>
                  <div><label className="lbl">Contract Type</label><select className="fi"><option>T&M</option><option>Fixed Price</option><option>Retainer</option></select></div>
                  <div><label className="lbl">Min. Experience (years)</label><input className="fi" type="number" placeholder="e.g. 5" /></div>
                  <div><label className="lbl">Clearance Level</label><select className="fi"><option>None</option><option>Confidential</option><option>Secret</option><option>TS/SCI</option></select></div>
                </>}

                <div className="sh">{typeInfo.label}</div>
                <div className="fg-full">
                  <div className="tags" style={{marginBottom:5}}>
                    {form.typeSkills.map(s=>(
                      <span key={s} className="tag">{s}<button className="tag-x" onClick={()=>toggleTag("typeSkills","typeSkills",s)}>×</button></span>
                    ))}
                    {form.typeSkills.length===0&&<span style={{fontSize:9.5,color:"#cbd5e1"}}>None selected — click below to add</span>}
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>
                    {typeInfo.pool.filter(s=>!form.typeSkills.includes(s)).map(s=>(
                      <button key={s} onClick={()=>toggleTag("typeSkills","typeSkills",s)} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:4,padding:"2px 7px",fontSize:9.5,cursor:"pointer",color:"#64748b"}}>+ {s}</button>
                    ))}
                  </div>
                </div>

                {form.type==="Contract Staffing"&&<>
                  <div className="sh">Role Requirements</div>
                  <div className="fg-full">
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5}}>
                      <thead><tr>{["Role / Title","Headcount","Level","Work Model",""].map(h=><th key={h} style={{textAlign:"left",padding:"4px 6px",fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5,background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}</tr></thead>
                      <tbody>
                        {form.roles.map((r,i)=>(
                          <tr key={i}>
                            <td style={{padding:"3px 4px"}}><input className="fi" value={r.role} placeholder="e.g. React Developer" style={{fontSize:10.5}} onChange={e=>set("roles",form.roles.map((x,j)=>j===i?{...x,role:e.target.value}:x))} /></td>
                            <td style={{padding:"3px 4px",width:60}}><input className="fi" type="number" value={r.count} min="1" style={{fontSize:10.5}} onChange={e=>set("roles",form.roles.map((x,j)=>j===i?{...x,count:e.target.value}:x))} /></td>
                            <td style={{padding:"3px 4px"}}><select className="fi" style={{fontSize:10.5}}><option>Junior</option><option>Mid</option><option>Senior</option><option>Lead</option><option>Principal</option></select></td>
                            <td style={{padding:"3px 4px"}}><select className="fi" style={{fontSize:10.5}}><option>Remote</option><option>Hybrid</option><option>Onsite</option></select></td>
                            <td style={{padding:"3px 4px"}}><button onClick={()=>set("roles",form.roles.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:14}}>×</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button className="btn btn-ghost" style={{fontSize:10,marginTop:5}} onClick={()=>set("roles",[...form.roles,{role:"",count:1}])}><Ico n="plus" s={9}/> Add Role</button>
                  </div>
                </>}
              </div>
            </div>
          )}

          {/* ── STEP 2: FINANCIALS ── */}
          {step===2&&(
            <div className="fg fg-3">
              <div className="sh" style={{marginTop:0}}>Contract Value & Budget</div>
              <div>
                <label className="lbl">Estimated Contract Value (USD) <span style={{color:"#ef4444"}}>*</span></label>
                <input className="fi" type="number" placeholder="e.g. 150000" value={form.value} onChange={e=>set("value",e.target.value)} style={{borderColor:errors.value?"#ef4444":undefined}} />
                {errors.value&&<div style={{fontSize:9,color:"#ef4444",marginTop:2}}>{errors.value}</div>}
              </div>
              <div>
                <label className="lbl">Approved Budget (USD) <span style={{color:"#ef4444"}}>*</span></label>
                <input className="fi" type="number" placeholder="e.g. 160000" value={form.budget} onChange={e=>set("budget",e.target.value)} style={{borderColor:errors.budget?"#ef4444":undefined}} />
                {errors.budget&&<div style={{fontSize:9,color:"#ef4444",marginTop:2}}>{errors.budget}</div>}
              </div>
              <div>
                <label className="lbl">Contract Type</label>
                <select className="fi" value={form.contractType} onChange={e=>set("contractType",e.target.value)}>
                  <option>T&M</option><option>Fixed Price</option><option>Retainer</option><option>Milestone</option><option>Cost-Plus</option>
                </select>
              </div>
              <div>
                <label className="lbl">Billing Frequency</label>
                <select className="fi"><option>Monthly</option><option>Bi-Monthly</option><option>Milestone</option><option>Quarterly</option><option>One-Time</option></select>
              </div>
              <div>
                <label className="lbl">Rate Type</label>
                <select className="fi"><option>Hourly</option><option>Daily</option><option>Fixed Lump Sum</option><option>Monthly Retainer</option></select>
              </div>
              <div>
                <label className="lbl">Currency</label>
                <select className="fi"><option>USD</option><option>EUR</option><option>GBP</option><option>SGD</option><option>AUD</option></select>
              </div>

              <div className="sh">Timeline</div>
              <div>
                <label className="lbl">Start Date <span style={{color:"#ef4444"}}>*</span></label>
                <input type="date" className="fi" value={form.start} onChange={e=>set("start",e.target.value)} style={{borderColor:errors.start?"#ef4444":undefined}} />
                {errors.start&&<div style={{fontSize:9,color:"#ef4444",marginTop:2}}>{errors.start}</div>}
              </div>
              <div>
                <label className="lbl">End Date <span style={{color:"#ef4444"}}>*</span></label>
                <input type="date" className="fi" value={form.end} onChange={e=>set("end",e.target.value)} style={{borderColor:errors.end?"#ef4444":undefined}} />
                {errors.end&&<div style={{fontSize:9,color:"#ef4444",marginTop:2}}>{errors.end}</div>}
              </div>
              <div>
                <label className="lbl">Renewal Option</label>
                <select className="fi"><option>None</option><option>1-Year Auto-Renew</option><option>Mutual Agreement</option></select>
              </div>

              {form.value&&form.budget&&(
                <div className="fg-full">
                  <div style={{display:"flex",gap:7}}>
                    {[
                      {lbl:"Contract Value",val:`$${parseInt(form.value).toLocaleString()}`,col:"#1d4ed8"},
                      {lbl:"Budget",val:`$${parseInt(form.budget).toLocaleString()}`,col:"#059669"},
                      {lbl:"Utilization",val:`${Math.round(parseInt(form.value)/parseInt(form.budget)*100)}%`,col:parseInt(form.value)/parseInt(form.budget)>1?"#dc2626":"#7c3aed"},
                      {lbl:"Duration",val:(form.start&&form.end)?`${Math.ceil((new Date(form.end)-new Date(form.start))/864e5/30)}mo`:"—",col:"#d97706"},
                    ].map(s=>(
                      <div key={s.lbl} className="stat-card" style={{flex:1}}>
                        <div className="stat-val" style={{fontSize:13,color:s.col}}>{s.val}</div>
                        <div className="stat-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="sh">Compliance & Commercial</div>
              <div>
                <label className="lbl">PO Required?</label>
                <select className="fi"><option>Yes</option><option>No</option><option>TBD</option></select>
              </div>
              <div>
                <label className="lbl">NDA Status</label>
                <select className="fi"><option>Signed</option><option>Required</option><option>Not Required</option><option>Pending</option></select>
              </div>
              <div>
                <label className="lbl">MSA In Place?</label>
                <select className="fi"><option>Yes</option><option>No</option><option>In Progress</option></select>
              </div>
              <div>
                <label className="lbl">Payment Terms</label>
                <select className="fi"><option>Net 30</option><option>Net 45</option><option>Net 60</option><option>Immediate</option><option>Milestone-based</option></select>
              </div>
              <div>
                <label className="lbl">Penalty Clause?</label>
                <select className="fi"><option>No</option><option>Yes — Delay Penalty</option><option>Yes — SLA Breach</option></select>
              </div>
              <div>
                <label className="lbl">Discount %</label>
                <input className="fi" type="number" placeholder="0" />
              </div>
            </div>
          )}

          {/* ── STEP 3: TEAM & PRIORITY ── */}
          {step===3&&(
            <div className="fg fg-3">
              <div className="sh" style={{marginTop:0}}>Ownership & Assignment</div>
              <div>
                <label className="lbl">Account Owner / Sales Rep</label>
                <select className="fi" value={form.owner} onChange={e=>set("owner",e.target.value)}>
                  {OWNERS.map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="lbl">Delivery Head</label>
                <select className="fi" value={form.dh} onChange={e=>set("dh",e.target.value)}>
                  {OWNERS.map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="lbl">Project Manager (if known)</label>
                <select className="fi"><option>— TBD —</option>{OWNERS.map(u=><option key={u}>{u}</option>)}</select>
              </div>
              <div>
                <label className="lbl">Executive Sponsor (Internal)</label>
                <input className="fi" placeholder="e.g. John Doe (CTO)" />
              </div>
              <div>
                <label className="lbl">Client Sponsor</label>
                <input className="fi" placeholder="e.g. James Whitfield (VP Eng)" />
              </div>
              <div>
                <label className="lbl">Notify On Assignment</label>
                <select className="fi"><option>Email</option><option>Email + In-App</option><option>Slack</option><option>None</option></select>
              </div>

              <div className="sh">Priority & Risk</div>
              <div>
                <label className="lbl">Priority</label>
                <div style={{display:"flex",gap:5,marginTop:2}}>
                  {["Critical","High","Medium","Low"].map(p=>(
                    <button key={p} onClick={()=>set("priority",p)} style={{flex:1,padding:"5px 4px",border:`1.5px solid ${form.priority===p?PRIORITY_COLORS[p]:"#e2e8f0"}`,borderRadius:5,background:form.priority===p?PRIORITY_COLORS[p]+"15":"#fff",color:form.priority===p?PRIORITY_COLORS[p]:"#94a3b8",fontSize:10,fontWeight:600,cursor:"pointer",transition:"all .12s"}}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="lbl">Strategic Tier</label>
                <select className="fi"><option>Tier 1 — Strategic</option><option>Tier 2 — Key</option><option>Tier 3 — Standard</option></select>
              </div>
              <div>
                <label className="lbl">Win Probability %</label>
                <input className="fi" type="number" placeholder="e.g. 75" min="0" max="100" />
              </div>
              <div>
                <label className="lbl">Risk Level</label>
                <select className="fi"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
              </div>
              <div>
                <label className="lbl">Stage / Status</label>
                <select className="fi"><option>Draft</option><option>In Review</option><option>Scoping</option><option>Approved</option></select>
              </div>
              <div>
                <label className="lbl">Competitor Threat</label>
                <select className="fi"><option>Low</option><option>Medium</option><option>High</option><option>No competition</option></select>
              </div>

              <div className="sh">Notifications</div>
              <div className="fg-full">
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {[
                    {id:"n1",label:"Notify Delivery Head on creation"},
                    {id:"n2",label:"Send email to Account Owner"},
                    {id:"n3",label:"Trigger SOW reminder at D-10"},
                    {id:"n4",label:"CC Finance on assignment"},
                  ].map(n=>(
                    <label key={n.id} style={{display:"flex",alignItems:"center",gap:5,fontSize:10.5,color:"#374151",cursor:"pointer"}}>
                      <input type="checkbox" defaultChecked={n.id==="n1"||n.id==="n2"} style={{accentColor:"#1d4ed8",width:11,height:11}} />
                      {n.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: DESCRIPTION ── */}
          {step===4&&(
            <div>
              <div className="fg fg-2" style={{marginBottom:10}}>
                <div className="sh" style={{marginTop:0}}>Opportunity Summary</div>
                <div className="fg-full">
                  <label className="lbl">Opportunity Description</label>
                  <textarea className="fi" rows={4} placeholder="Describe the engagement scope, deliverables, and key objectives…" value={form.description} onChange={e=>set("description",e.target.value)} />
                </div>
                <div className="fg-full">
                  <label className="lbl">Internal Notes (visible to team only)</label>
                  <textarea className="fi" rows={3} placeholder="Flags, caveats, client sensitivities, special considerations…" value={form.notes} onChange={e=>set("notes",e.target.value)} />
                </div>
                <div>
                  <label className="lbl">Assumptions</label>
                  <textarea className="fi" rows={2} placeholder="Key assumptions the estimate is based on…" />
                </div>
                <div>
                  <label className="lbl">Exclusions / Out of Scope</label>
                  <textarea className="fi" rows={2} placeholder="Explicitly list what is NOT included…" />
                </div>
                <div>
                  <label className="lbl">Dependencies</label>
                  <textarea className="fi" rows={2} placeholder="External systems, teams, or decisions this depends on…" />
                </div>
                <div>
                  <label className="lbl">Success Criteria</label>
                  <textarea className="fi" rows={2} placeholder="How will we measure a successful delivery?…" />
                </div>
              </div>

              {/* Summary Review Card */}
              <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px 14px",marginTop:4}}>
                <div style={{fontSize:9.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:8}}>Review Summary</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                  {[
                    {k:"ID",v:nextId},{k:"Title",v:form.title||"—"},{k:"Client",v:form.client||"—"},
                    {k:"Type",v:form.type},{k:"Region",v:form.region},{k:"Priority",v:form.priority},
                    {k:"Value",v:form.value?`$${parseInt(form.value).toLocaleString()}`:"—"},
                    {k:"Budget",v:form.budget?`$${parseInt(form.budget).toLocaleString()}`:"—"},
                    {k:"Start",v:form.start||"—"},{k:"End",v:form.end||"—"},
                    {k:"Owner",v:form.owner},{k:"Delivery Head",v:form.dh},
                  ].map(({k,v})=>(
                    <div key={k} style={{display:"flex",gap:6,alignItems:"baseline"}}>
                      <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5,minWidth:90,flexShrink:0}}>{k}</span>
                      <span style={{fontSize:10.5,color:"#0f172a",fontWeight:500}}>{v}</span>
                    </div>
                  ))}
                </div>
                {form.typeSkills.length>0&&(
                  <div style={{marginTop:8,paddingTop:6,borderTop:"1px solid #e2e8f0"}}>
                    <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Skills / Scope</div>
                    <div className="tags">{form.typeSkills.map(s=><span key={s} className="tag" style={{fontSize:9}}>{s}</span>)}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-foot">
          <span className="foot-status" style={{fontSize:9.5}}>
            {step===NR_STEPS.length-1
              ? <span style={{color:"#059669",fontWeight:600}}>✓ Ready to save</span>
              : <span style={{color:"#94a3b8"}}>Complete all steps to create the requirement</span>
            }
          </span>
          <button className="btn btn-ghost" style={{fontSize:10}} onClick={onClose}>Cancel</button>
          {step>0&&<button className="btn btn-secondary" style={{fontSize:10}} onClick={prev}><Ico n="chevL" s={10}/> Back</button>}
          {step<NR_STEPS.length-1
            ? <button className="btn btn-primary" style={{fontSize:10}} onClick={next}>Next <Ico n="chevR" s={10}/></button>
            : <button className="btn btn-success" style={{fontSize:10}} onClick={handleSave}><Ico n="check" s={10}/> Create Requirement</button>
          }
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SOW PAGE — FULL SEED DATA
═══════════════════════════════════════════════════════════ */
const SOW_SEED = [
  {
    id:"SOW-2026-041", title:"Nexus Digital Transformation Phase 1",
    client:"Nexus Corp", engName:"Nexus Digital Transformation",
    category:"Digital Transformation", region:"North America", type:"IT Services",
    status:"Active", billingModel:"T&M — Monthly", currency:"USD",
    value:142000, invoiced:71000, received:35500, outstanding:35500,
    effectiveDate:"2026-02-01", expiryDate:"2026-12-31", signedDate:"2026-01-30",
    created:"2026-01-10", amendCount:0, version:"v1",
    owner:"Dana Mercer", dh:"Rachel Kim", clientContact:"James Whitfield (VP Eng)",
    linkedReqs:["SR-0041","SR-0047","SR-0053"], linkedProj:"PRJ-0082",
    nda:"Signed", msa:"Yes", poRequired:"Yes", paymentTerms:"Net 30",
    penaltyClause:"None", autoRenew:"No",
    document:{ name:"SOW-2026-041-v1.pdf", size:"1.8 MB", by:"Dana Mercer", date:"2026-01-30" },
    notes:"Signed by James Whitfield (VP Eng). Covers CRM integration, SSO, and notification platform.",
    activity:[
      { date:"2026-01-10", user:"Dana Mercer", action:"SOW created",       detail:"Initial draft registered" },
      { date:"2026-01-30", user:"Dana Mercer", action:"Document uploaded",  detail:"SOW-2026-041-v1.pdf signed copy" },
      { date:"2026-02-01", user:"System",      action:"Status → Active",   detail:"Effective date reached — auto-promoted" },
    ],
    milestones:[
      { label:"Kickoff",          date:"2026-02-10", done:true  },
      { label:"Discovery",        date:"2026-02-28", done:true  },
      { label:"Design Phase",     date:"2026-03-20", done:false },
      { label:"Dev Sprint 1–3",   date:"2026-05-15", done:false },
      { label:"UAT",              date:"2026-06-30", done:false },
      { label:"Go-Live",          date:"2026-07-15", done:false },
    ],
  },
  {
    id:"SOW-2026-042", title:"Meridian Analytics Suite BI & Reporting",
    client:"Meridian Holdings", engName:"Meridian Analytics Suite",
    category:"Data & Analytics", region:"Europe", type:"Data & Analytics",
    status:"Active", billingModel:"T&M — Monthly", currency:"EUR",
    value:88500, invoiced:44000, received:44000, outstanding:0,
    effectiveDate:"2026-02-15", expiryDate:"2026-09-30", signedDate:"2026-02-12",
    created:"2026-01-14", amendCount:1, version:"v2",
    owner:"Lian Zhou", dh:"Tom Ashby", clientContact:"Ingrid Müller (CTO)",
    linkedReqs:["SR-0042","SR-0048","SR-0054"], linkedProj:"PRJ-0083",
    nda:"Signed", msa:"Yes", poRequired:"Yes", paymentTerms:"Net 30",
    penaltyClause:"Yes — SLA Breach", autoRenew:"Mutual Agreement",
    document:{ name:"SOW-2026-042-v2.pdf", size:"2.1 MB", by:"Lian Zhou", date:"2026-02-20" },
    notes:"GDPR data residency addendum included. Amendment 1 covers expanded data sources.",
    activity:[
      { date:"2026-01-14", user:"Lian Zhou", action:"SOW created",    detail:"Draft from RFP response" },
      { date:"2026-02-12", user:"Lian Zhou", action:"Doc uploaded",   detail:"SOW-2026-042-v1.pdf" },
      { date:"2026-02-20", user:"Lian Zhou", action:"Amendment 1",   detail:"SOW-2026-042-v2.pdf — expanded data sources" },
    ],
    milestones:[
      { label:"Data Audit",       date:"2026-02-28", done:true  },
      { label:"Dashboard MVP",    date:"2026-04-15", done:true  },
      { label:"Predictive Layer", date:"2026-06-30", done:false },
      { label:"Final Delivery",   date:"2026-09-01", done:false },
    ],
  },
  {
    id:"SOW-2026-043", title:"BlueStar Mobile Commerce App & Portal",
    client:"BlueStar Retail", engName:"BlueStar Mobile Commerce",
    category:"Digital Services", region:"APAC", type:"Digital Services",
    status:"Approved", billingModel:"Fixed Milestone", currency:"USD",
    value:220000, invoiced:0, received:0, outstanding:220000,
    effectiveDate:"2026-03-01", expiryDate:"2026-10-31", signedDate:"2026-02-24",
    created:"2026-01-16", amendCount:0, version:"v1",
    owner:"Theo Vasquez", dh:"Dana Mercer", clientContact:"Kevin Lim (Head of Digital)",
    linkedReqs:["SR-0043","SR-0049","SR-0055"], linkedProj:"PRJ-0086",
    nda:"Signed", msa:"In Progress", poRequired:"No", paymentTerms:"Milestone-based",
    penaltyClause:"Yes — Delay Penalty", autoRenew:"No",
    document:{ name:"SOW-2026-043-v1.pdf", size:"3.2 MB", by:"Theo Vasquez", date:"2026-02-24" },
    notes:"Client brand guide received Feb 22. App store developer accounts confirmed.",
    activity:[
      { date:"2026-01-16", user:"Theo Vasquez", action:"SOW created",  detail:"Draft from referral" },
      { date:"2026-02-24", user:"Theo Vasquez", action:"Doc uploaded", detail:"SOW-2026-043-v1.pdf executed copy" },
      { date:"2026-02-25", user:"Dana Mercer",  action:"Approved",     detail:"Internal approval — Dana Mercer (DH)" },
    ],
    milestones:[
      { label:"Brand Onboarding",  date:"2026-03-10", done:false },
      { label:"UX Prototype",      date:"2026-04-15", done:false },
      { label:"App Build M1",      date:"2026-06-01", done:false },
      { label:"Store Submission",  date:"2026-08-01", done:false },
    ],
  },
  {
    id:"SOW-2026-044", title:"Orion Financial Cloud Migration",
    client:"Orion Financial", engName:"Orion Cloud Migration",
    category:"Cloud Services", region:"North America", type:"Cloud Services",
    status:"Active", billingModel:"T&M — Monthly", currency:"USD",
    value:34000, invoiced:21000, received:21000, outstanding:0,
    effectiveDate:"2026-02-10", expiryDate:"2026-06-30", signedDate:"2026-02-07",
    created:"2026-01-19", amendCount:0, version:"v1",
    owner:"Dana Mercer", dh:"Sam Keller", clientContact:"Rhonda Parks (CISO)",
    linkedReqs:["SR-0044"], linkedProj:"PRJ-0084",
    nda:"Signed", msa:"Yes", poRequired:"Yes", paymentTerms:"Net 45",
    penaltyClause:"None", autoRenew:"No",
    document:{ name:"SOW-2026-044-v1.pdf", size:"1.2 MB", by:"Dana Mercer", date:"2026-02-07" },
    notes:"Rate limiting and WAF policies are internal use only per Orion security classification.",
    activity:[
      { date:"2026-01-19", user:"Dana Mercer", action:"SOW created",  detail:"Direct engagement" },
      { date:"2026-02-07", user:"Dana Mercer", action:"Doc uploaded", detail:"SOW-2026-044-v1.pdf" },
      { date:"2026-02-10", user:"System",      action:"Status → Active", detail:"Effective date reached" },
    ],
    milestones:[
      { label:"Infra Audit",      date:"2026-02-20", done:true  },
      { label:"Migration Wave 1", date:"2026-03-31", done:true  },
      { label:"Migration Wave 2", date:"2026-05-15", done:false },
      { label:"Cutover",          date:"2026-06-20", done:false },
    ],
  },
  {
    id:"SOW-2026-045", title:"TrueNorth Legal Ops Compliance & Currency",
    client:"TrueNorth Law", engName:"TrueNorth Legal Ops",
    category:"Managed Services", region:"North America", type:"Managed Services",
    status:"Active", billingModel:"Retainer — Monthly", currency:"USD",
    value:67000, invoiced:22000, received:14000, outstanding:8000,
    effectiveDate:"2026-02-01", expiryDate:"2027-01-31", signedDate:"2026-01-28",
    created:"2026-01-22", amendCount:0, version:"v1",
    owner:"Sam Keller", dh:"Lian Zhou", clientContact:"Barbara Chen (General Counsel)",
    linkedReqs:["SR-0045","SR-0052"], linkedProj:"PRJ-0085",
    nda:"Signed", msa:"Yes", poRequired:"Yes", paymentTerms:"Net 30",
    penaltyClause:"Yes — SLA Breach", autoRenew:"1-Year Auto-Renew",
    document:{ name:"SOW-2026-045-v1.pdf", size:"2.8 MB", by:"Sam Keller", date:"2026-01-28" },
    notes:"Annual contract. SOC 2 Type II is a hard contractual requirement.",
    activity:[
      { date:"2026-01-22", user:"Sam Keller", action:"SOW created",  detail:"From RFP annual managed services" },
      { date:"2026-01-28", user:"Sam Keller", action:"Doc uploaded", detail:"SOW-2026-045-v1.pdf" },
      { date:"2026-02-01", user:"System",     action:"Status → Active", detail:"Effective date reached" },
    ],
    milestones:[
      { label:"Go-Live",         date:"2026-02-10", done:true  },
      { label:"Q1 SLA Review",   date:"2026-04-01", done:false },
      { label:"Mid-Year Review", date:"2026-07-31", done:false },
      { label:"Renewal Review",  date:"2026-11-01", done:false },
    ],
  },
  {
    id:"SOW-2026-046", title:"Summit Energy Cloud Lift & Inventory Sync",
    client:"Summit Energy", engName:"Summit Cloud Lift",
    category:"IT Services", region:"North America", type:"IT Services",
    status:"Under Review", billingModel:"Fixed Price", currency:"USD",
    value:51000, invoiced:0, received:0, outstanding:51000,
    effectiveDate:"", expiryDate:"", signedDate:"",
    created:"2026-01-26", amendCount:0, version:"v1",
    owner:"Lian Zhou", dh:"Theo Vasquez", clientContact:"Mike Torres (IT Director)",
    linkedReqs:["SR-0046","SR-0051"], linkedProj:"",
    nda:"Signed", msa:"In Progress", poRequired:"Yes", paymentTerms:"Net 30",
    penaltyClause:"None", autoRenew:"No",
    document:null,
    notes:"On hold pending client infrastructure readiness sign-off.",
    activity:[
      { date:"2026-01-26", user:"Lian Zhou",    action:"SOW created",   detail:"Direct — covers 2 requirements" },
      { date:"2026-02-10", user:"Theo Vasquez", action:"Under Review",  detail:"Infra readiness sign-off pending" },
    ],
    milestones:[],
  },
  {
    id:"SOW-2026-048", title:"Meridian Predictive Analytics Engine",
    client:"Meridian Holdings", engName:"Meridian Analytics Suite",
    category:"Data & Analytics", region:"Europe", type:"Data & Analytics",
    status:"Submitted", billingModel:"T&M — Monthly", currency:"EUR",
    value:175000, invoiced:0, received:0, outstanding:175000,
    effectiveDate:"", expiryDate:"2026-10-31", signedDate:"",
    created:"2026-02-04", amendCount:0, version:"v1",
    owner:"Sam Keller", dh:"Tom Ashby", clientContact:"Ingrid Müller (CTO)",
    linkedReqs:["SR-0048"], linkedProj:"",
    nda:"Signed", msa:"Yes", poRequired:"TBD", paymentTerms:"Net 30",
    penaltyClause:"Yes — SLA Breach", autoRenew:"Mutual Agreement",
    document:null,
    notes:"EU data residency addendum required. ML model accuracy SLA to be negotiated.",
    activity:[
      { date:"2026-02-04", user:"Sam Keller", action:"SOW created",    detail:"From RFP — ML engine" },
      { date:"2026-02-12", user:"Sam Keller", action:"Status → Submitted", detail:"Submitted to Meridian procurement" },
    ],
    milestones:[],
  },
  {
    id:"SOW-2026-049", title:"BlueStar Customer Portal Redesign",
    client:"BlueStar Retail", engName:"BlueStar Mobile Commerce",
    category:"Digital Services", region:"APAC", type:"Digital Services",
    status:"Draft", billingModel:"T&M — Monthly", currency:"USD",
    value:43000, invoiced:0, received:0, outstanding:43000,
    effectiveDate:"", expiryDate:"2026-04-20", signedDate:"",
    created:"2026-02-06", amendCount:0, version:"v1",
    owner:"Dana Mercer", dh:"Dana Mercer", clientContact:"Kevin Lim (Head of Digital)",
    linkedReqs:["SR-0049"], linkedProj:"",
    nda:"Required", msa:"In Progress", poRequired:"No", paymentTerms:"Net 30",
    penaltyClause:"None", autoRenew:"No",
    document:null,
    notes:"WCAG 2.1 AA accessibility clause required.",
    activity:[
      { date:"2026-02-06", user:"Dana Mercer", action:"SOW created", detail:"Draft from referral SR-0049" },
    ],
    milestones:[],
  },
  {
    id:"SOW-2026-054", title:"Meridian RBAC Security Module",
    client:"Meridian Holdings", engName:"Meridian Analytics Suite",
    category:"IT Services", region:"Europe", type:"IT Services",
    status:"Approved", billingModel:"Fixed Price", currency:"EUR",
    value:48000, invoiced:0, received:0, outstanding:48000,
    effectiveDate:"2026-03-01", expiryDate:"2026-07-31", signedDate:"2026-02-25",
    created:"2026-02-21", amendCount:0, version:"v1",
    owner:"Lian Zhou", dh:"Tom Ashby", clientContact:"Ingrid Müller (CTO)",
    linkedReqs:["SR-0054"], linkedProj:"",
    nda:"Signed", msa:"Yes", poRequired:"Yes", paymentTerms:"Net 45",
    penaltyClause:"None", autoRenew:"No",
    document:{ name:"SOW-2026-054-v1.pdf", size:"0.9 MB", by:"Lian Zhou", date:"2026-02-25" },
    notes:"ISO 27001 alignment clause included. Pen test sign-off required before go-live.",
    activity:[
      { date:"2026-02-21", user:"Lian Zhou",  action:"SOW created", detail:"From RFP RBAC module" },
      { date:"2026-02-25", user:"Lian Zhou",  action:"Doc uploaded",detail:"SOW-2026-054-v1.pdf" },
      { date:"2026-02-26", user:"Tom Ashby",  action:"Approved",    detail:"DH approval — Tom Ashby" },
    ],
    milestones:[
      { label:"Design",      date:"2026-03-15", done:false },
      { label:"Build",       date:"2026-05-01", done:false },
      { label:"Pen Test",    date:"2026-06-15", done:false },
      { label:"Go-Live",     date:"2026-07-20", done:false },
    ],
  },
];

const SOW_FLOW   = ["Draft","Submitted","Under Review","Approved","Active","Expired"];
const SOW_STATUS_META = {
  "Draft":        { color:"#64748b", bg:"#f8fafc",   border:"#e2e8f0" },
  "Submitted":    { color:"#d97706", bg:"#fffbeb",   border:"#fcd34d" },
  "Under Review": { color:"#6366f1", bg:"#f5f3ff",   border:"#c4b5fd" },
  "Approved":     { color:"#059669", bg:"#f0fdf4",   border:"#86efac" },
  "Active":       { color:"#1d4ed8", bg:"#eff6ff",   border:"#bfdbfe" },
  "Expired":      { color:"#94a3b8", bg:"#f8fafc",   border:"#e2e8f0" },
  "Terminated":   { color:"#dc2626", bg:"#fef2f2",   border:"#fca5a5" },
};

const SOW_PAGE_CSS = `
/* ── SOW PAGE LAYOUT ── */
.sow-page{display:flex;height:100%;overflow:hidden;background:#f0f2f5}
.sow-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.sow-drawer{width:340px;flex-shrink:0;background:#fff;border-left:1px solid #e2e8f0;display:flex;flex-direction:column;overflow:hidden;transition:width .2s ease}
.sow-drawer.hidden{width:0;border:none}

/* ── SOW KPI STRIP ── */
.sow-kpi-strip{display:flex;gap:7px;padding:10px 14px;border-bottom:1px solid #e2e8f0;background:#fff;flex-shrink:0;overflow-x:auto}
.sow-kpi{flex:1;min-width:90px;padding:7px 10px;border:1px solid #e2e8f0;border-radius:7px;background:#fff;position:relative;overflow:hidden}
.sow-kpi::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px}
.sow-kpi-val{font-size:17px;font-weight:700;font-family:'IBM Plex Mono',monospace;line-height:1.1}
.sow-kpi-lbl{font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
.sow-kpi-sub{font-size:9px;margin-top:3px;font-weight:600}

/* ── SOW STATUS TABS ── */
.sow-tabs{display:flex;align-items:center;gap:0;padding:0 14px;background:#fff;border-bottom:1px solid #e2e8f0;flex-shrink:0;overflow-x:auto}
.sow-tab{padding:7px 11px;font-size:10.5px;font-weight:500;color:#94a3b8;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:all .12s;display:flex;align-items:center;gap:5px}
.sow-tab:hover{color:#374151}
.sow-tab.active{color:#1d4ed8;border-bottom-color:#3b82f6;font-weight:700}
.sow-tab-count{font-size:9px;font-weight:700;padding:1px 5px;border-radius:9px;background:#f1f5f9;color:#64748b}
.sow-tab.active .sow-tab-count{background:#dbeafe;color:#1d4ed8}

/* ── SOW TOOLBAR ── */
.sow-toolbar{display:flex;align-items:center;gap:6px;padding:8px 14px;background:#fff;border-bottom:1px solid #f1f5f9;flex-shrink:0}
.sow-search{display:flex;align-items:center;gap:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:0 9px;height:27px;flex:1;max-width:280px}
.sow-search input{background:none;border:none;outline:none;font-size:10.5px;color:#374151;width:100%}
.sow-search input::placeholder{color:#cbd5e1}
.sow-chip{display:flex;align-items:center;gap:4px;border:1px solid #e2e8f0;border-radius:5px;padding:3px 8px;font-size:10px;color:#64748b;cursor:pointer;background:#fff}
.sow-chip:hover{border-color:#94a3b8;color:#374151}
.sow-chip select{background:none;border:none;outline:none;font-size:10px;color:inherit;cursor:pointer;padding:0}
.view-toggle{display:flex;border:1px solid #e2e8f0;border-radius:5px;overflow:hidden}
.vt-btn{padding:3px 8px;font-size:10px;cursor:pointer;background:#fff;border:none;color:#94a3b8;transition:all .12s}
.vt-btn.active{background:#eff6ff;color:#1d4ed8;font-weight:700}

/* ── SOW TABLE ── */
.sow-tbl-wrap{flex:1;overflow:auto;padding:0}
.sow-tbl{width:100%;border-collapse:collapse;font-size:10.5px}
.sow-tbl th{font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;padding:7px 10px;background:#f8fafc;border-bottom:1px solid #e2e8f0;white-space:nowrap;text-align:left;position:sticky;top:0;z-index:1;cursor:pointer;user-select:none}
.sow-tbl th:hover{color:#374151}
.sow-tbl th.sorted{color:#1d4ed8}
.sow-tbl td{padding:6px 10px;border-bottom:1px solid #f1f5f9;vertical-align:middle;color:#374151}
.sow-tbl tr:last-child td{border-bottom:none}
.sow-tbl tr.selected td{background:#f0f7ff!important}
.sow-tbl tr:hover td{background:#f8faff;cursor:pointer}
.sow-tbl tr.selected:hover td{background:#e6f0fd!important}

/* ── EXPIRY BADGE ── */
.exp-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:3px;font-size:9px;font-weight:700;white-space:nowrap}

/* ── HEALTH BAR ── */
.sow-burn{display:flex;align-items:center;gap:5px}
.sow-burn-bar{flex:1;height:4px;background:#e2e8f0;border-radius:2px;overflow:hidden;min-width:40px}
.sow-burn-fill{height:100%;border-radius:2px;transition:width .3s}

/* ── DRAWER ── */
.drawer-head{padding:11px 13px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:#fff}
.drawer-tabs{display:flex;border-bottom:1px solid #e2e8f0;flex-shrink:0;overflow-x:auto;background:#f8fafc}
.drawer-tab{padding:6px 11px;font-size:10px;font-weight:500;color:#94a3b8;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:all .12s}
.drawer-tab:hover{color:#374151}
.drawer-tab.active{color:#1d4ed8;border-bottom-color:#3b82f6;background:#fff;font-weight:700}
.drawer-body{flex:1;overflow-y:auto;padding:11px 13px}
.d-row{display:flex;padding:4px 0;border-bottom:1px solid #f8fafc;align-items:flex-start}
.d-row:last-child{border-bottom:none}
.d-key{font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;min-width:110px;flex-shrink:0;padding-top:1px}
.d-val{font-size:10.5px;color:#1e293b;flex:1;font-weight:500;word-break:break-word}
.d-val.mono{font-family:'IBM Plex Mono',monospace;font-size:10px}
.drawer-section{font-size:8.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;padding:8px 0 4px;border-bottom:1px solid #f1f5f9;margin-bottom:5px;margin-top:4px}

/* ── FLOW STEPPER in drawer ── */
.flow-step{display:flex;flex-direction:column;align-items:center;flex:1}
.flow-circle{width:20px;height:20px;border-radius:50%;border:1.5px solid #e2e8f0;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;background:#fff;color:#94a3b8}
.flow-circle.done{background:#1d4ed8;border-color:#3b82f6;color:#fff}
.flow-circle.curr{background:#7c3aed;border-color:#8b5cf6;color:#fff;box-shadow:0 0 0 3px rgba(139,92,246,.12)}
.flow-lbl{font-size:7.5px;color:#94a3b8;margin-top:3px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;white-space:nowrap}
.flow-lbl.done{color:#3b82f6}
.flow-lbl.curr{color:#7c3aed}
.flow-conn{flex:1;height:1px;background:#e2e8f0;margin-bottom:12px}
.flow-conn.done{background:#3b82f6}

/* ── MILESTONE ROW ── */
.ms-row{display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid #f8fafc}
.ms-row:last-child{border-bottom:none}
.ms-check{width:13px;height:13px;border-radius:50%;border:1.5px solid #e2e8f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#fff}
.ms-check.done{background:#059669;border-color:#059669}

/* ── CARD VIEW ── */
.sow-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:9px;padding:12px 14px}
.sow-card{background:#fff;border:1px solid #e2e8f0;border-radius:9px;padding:11px 12px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden}
.sow-card:hover{border-color:#93c5fd;box-shadow:0 2px 8px rgba(59,130,246,.1)}
.sow-card.selected{border-color:#3b82f6;background:#f8faff}
.sow-card-accent{position:absolute;top:0;left:0;right:0;height:2px}
.sow-card-id{font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:#6366f1;font-weight:500}
.sow-card-title{font-size:11px;font-weight:600;color:#0f172a;margin:3px 0 1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sow-card-client{font-size:9.5px;color:#64748b}

/* ── NEW SOW MODAL ── */
.nsow-head{background:#fff;border-bottom:1px solid #e2e8f0;padding:11px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}
.nsow-step-bar{background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:8px 16px;flex-shrink:0;display:flex;flex-direction:column;gap:5px}
`;

/* ──────────────────────────────────────────────────────────
   SOW DETAIL DRAWER
────────────────────────────────────────────────────────── */
function SowDrawer({ sow, onClose, onStatusChange }){
  const [dtab, setDtab] = useState("overview");
  if(!sow) return null;

  const days      = daysTo(sow.expiryDate);
  const sm        = SOW_STATUS_META[sow.status] || SOW_STATUS_META["Draft"];
  const flowIdx   = SOW_FLOW.indexOf(sow.status);
  const burnPct   = sow.invoiced && sow.value ? Math.round(sow.invoiced/sow.value*100) : 0;
  const receivedPct = sow.invoiced ? Math.round(sow.received/sow.invoiced*100) : 0;

  const expColor  = !days ? "#94a3b8" : days<=0 ? "#dc2626" : days<=10 ? "#dc2626" : days<=30 ? "#d97706" : days<=90 ? "#f59e0b" : "#059669";

  const DRAWER_TABS = ["overview","financials","milestones","documents","activity"];

  return(
    <div className="sow-drawer">
      {/* HEAD */}
      <div className="drawer-head">
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"monospace",fontSize:9.5,color:"#6366f1",fontWeight:600,marginBottom:2}}>{sow.id}</div>
          <div style={{fontSize:11,fontWeight:700,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sow.title}</div>
          <div style={{fontSize:9.5,color:"#94a3b8",marginTop:1}}>{sow.client}</div>
        </div>
        <button onClick={onClose} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:5,width:22,height:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b",flexShrink:0,fontSize:14}}>×</button>
      </div>

      {/* FLOW STEPPER */}
      <div style={{padding:"9px 12px 6px",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center"}}>
          {SOW_FLOW.map((s,i)=>(
            <div key={s} style={{display:"flex",alignItems:"center",flex:i<SOW_FLOW.length-1?1:"unset"}}>
              <div className="flow-step" style={{flex:"unset"}}>
                <div className={`flow-circle ${i<flowIdx?"done":i===flowIdx?"curr":""}`}>
                  {i<flowIdx ? <Ico n="check" s={8} c="#fff"/> : i+1}
                </div>
                <div className={`flow-lbl ${i<flowIdx?"done":i===flowIdx?"curr":""}`}>{s}</div>
              </div>
              {i<SOW_FLOW.length-1 && <div className={`flow-conn ${i<flowIdx?"done":""}`}/>}
            </div>
          ))}
        </div>
        {/* Status action buttons */}
        <div style={{display:"flex",gap:5,marginTop:7}}>
          {SOW_FLOW[flowIdx+1] && (
            <button className="btn btn-primary" style={{fontSize:9,padding:"3px 9px"}}
              onClick={()=>onStatusChange(sow.id, SOW_FLOW[flowIdx+1])}>
              → Advance to {SOW_FLOW[flowIdx+1]}
            </button>
          )}
          {sow.status==="Active" && <button className="btn btn-warning" style={{fontSize:9,padding:"3px 9px"}}>Extend</button>}
          {(sow.status==="Active"||sow.status==="Approved") && <button className="btn btn-danger" style={{fontSize:9,padding:"3px 9px"}}>Terminate</button>}
          <button className="btn btn-ghost" style={{fontSize:9,padding:"3px 8px"}}><Ico n="mail" s={9}/> Send</button>
        </div>
      </div>

      {/* TABS */}
      <div className="drawer-tabs">
        {DRAWER_TABS.map(t=>(
          <button key={t} className={`drawer-tab ${dtab===t?"active":""}`} onClick={()=>setDtab(t)} style={{background:"none",border:"none"}}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* BODY */}
      <div className="drawer-body">

        {/* OVERVIEW */}
        {dtab==="overview"&&(
          <div>
            <div className="drawer-section">Contract Details</div>
            {[
              {k:"SOW ID",       v:sow.id,              mono:true},
              {k:"Title",        v:sow.title},
              {k:"Client",       v:sow.client},
              {k:"Engagement",   v:sow.engName},
              {k:"Category",     v:sow.category},
              {k:"Region",       v:sow.region},
              {k:"Service Type", v:sow.type},
              {k:"Billing",      v:sow.billingModel},
              {k:"Currency",     v:sow.currency},
              {k:"Version",      v:sow.version},
              {k:"Amendments",   v:sow.amendCount},
            ].map(r=>(
              <div key={r.k} className="d-row">
                <div className="d-key">{r.k}</div>
                <div className={`d-val ${r.mono?"mono":""}`}>{r.v||"—"}</div>
              </div>
            ))}

            <div className="drawer-section">Key Dates</div>
            {[
              {k:"Effective",  v:sow.effectiveDate||"TBD"},
              {k:"Expiry",     v:sow.expiryDate||"TBD"},
              {k:"Signed",     v:sow.signedDate||"TBD"},
              {k:"Created",    v:sow.created},
              {k:"Days Left",  v: days===null?"N/A": days<=0?`Expired ${Math.abs(days)}d ago`:`${days} days`, color:expColor},
            ].map(r=>(
              <div key={r.k} className="d-row">
                <div className="d-key">{r.k}</div>
                <div className="d-val mono" style={r.color?{color:r.color,fontWeight:700}:{}}>{r.v}</div>
              </div>
            ))}

            <div className="drawer-section">Ownership</div>
            {[
              {k:"Owner",          v:sow.owner},
              {k:"Delivery Head",  v:sow.dh},
              {k:"Client Contact", v:sow.clientContact},
            ].map(r=>(
              <div key={r.k} className="d-row">
                <div className="d-key">{r.k}</div>
                <div className="d-val">{r.v||"—"}</div>
              </div>
            ))}

            <div className="drawer-section">Commercial</div>
            {[
              {k:"NDA",          v:sow.nda},
              {k:"MSA",          v:sow.msa},
              {k:"PO Required",  v:sow.poRequired},
              {k:"Payment",      v:sow.paymentTerms},
              {k:"Penalty",      v:sow.penaltyClause},
              {k:"Auto-Renew",   v:sow.autoRenew},
            ].map(r=>(
              <div key={r.k} className="d-row">
                <div className="d-key">{r.k}</div>
                <div className="d-val">{r.v||"—"}</div>
              </div>
            ))}

            {sow.notes&&(
              <>
                <div className="drawer-section">Notes</div>
                <div style={{fontSize:10.5,color:"#374151",lineHeight:1.5,padding:"3px 0"}}>{sow.notes}</div>
              </>
            )}
          </div>
        )}

        {/* FINANCIALS */}
        {dtab==="financials"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
              {[
                {lbl:"Contract Value",  val:fmtFull(sow.value),           col:"#1d4ed8"},
                {lbl:"Invoiced",        val:fmtFull(sow.invoiced),        col:"#7c3aed"},
                {lbl:"Received",        val:fmtFull(sow.received),        col:"#059669"},
                {lbl:"Outstanding",     val:fmtFull(sow.outstanding),     col: sow.outstanding>0?"#d97706":"#059669"},
              ].map(c=>(
                <div key={c.lbl} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"7px 9px"}}>
                  <div style={{fontSize:14,fontWeight:700,fontFamily:"monospace",color:c.col}}>{c.val}</div>
                  <div style={{fontSize:8.5,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginTop:2}}>{c.lbl}</div>
                </div>
              ))}
            </div>

            <div className="drawer-section">Billing Progress</div>
            <div style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9.5,color:"#64748b",marginBottom:3}}>
                <span>Invoiced vs Contract</span><span style={{fontWeight:700,fontFamily:"monospace"}}>{burnPct}%</span>
              </div>
              <div style={{height:5,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${burnPct}%`,background:burnPct>90?"#dc2626":burnPct>75?"#d97706":"#3b82f6",borderRadius:3}}/>
              </div>
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9.5,color:"#64748b",marginBottom:3}}>
                <span>Received vs Invoiced</span><span style={{fontWeight:700,fontFamily:"monospace"}}>{receivedPct}%</span>
              </div>
              <div style={{height:5,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${receivedPct}%`,background:"#059669",borderRadius:3}}/>
              </div>
            </div>

            <div className="drawer-section">Linked Requirements</div>
            {sow.linkedReqs.map(r=>(
              <div key={r} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 0",borderBottom:"1px solid #f8fafc"}}>
                <span style={{fontFamily:"monospace",fontSize:9.5,color:"#6366f1",fontWeight:600}}>{r}</span>
              </div>
            ))}
            {sow.linkedProj&&(
              <>
                <div className="drawer-section">Linked Project</div>
                <span style={{fontFamily:"monospace",fontSize:10,color:"#059669",fontWeight:700}}>{sow.linkedProj}</span>
              </>
            )}
          </div>
        )}

        {/* MILESTONES */}
        {dtab==="milestones"&&(
          <div>
            <div className="drawer-section">Contract Milestones</div>
            {sow.milestones.length===0
              ? <div style={{fontSize:10.5,color:"#94a3b8",padding:"8px 0"}}>No milestones defined yet.</div>
              : sow.milestones.map((m,i)=>(
                <div key={i} className="ms-row">
                  <div className={`ms-check ${m.done?"done":""}`}>
                    {m.done&&<Ico n="check" s={8} c="#fff"/>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:10.5,fontWeight:600,color:m.done?"#94a3b8":"#0f172a",textDecoration:m.done?"line-through":"none"}}>{m.label}</div>
                    <div style={{fontSize:9,fontFamily:"monospace",color:"#94a3b8"}}>{m.date}</div>
                  </div>
                  <span style={{fontSize:9,fontWeight:700,color:m.done?"#059669":"#94a3b8"}}>{m.done?"Done":"Pending"}</span>
                </div>
              ))
            }
            <button className="btn btn-ghost" style={{fontSize:9.5,marginTop:8}}><Ico n="plus" s={9}/> Add Milestone</button>
          </div>
        )}

        {/* DOCUMENTS */}
        {dtab==="documents"&&(
          <div>
            <div className="drawer-section">SOW Document</div>
            {sow.document
              ? (
                <div style={{border:"1px solid #e2e8f0",borderRadius:7,padding:"9px 10px",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{fontSize:20}}>📄</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:10.5,fontWeight:600,color:"#0f172a"}}>{sow.document.name}</div>
                    <div style={{fontSize:9,color:"#94a3b8",marginTop:1}}>{sow.document.size} · {sow.document.by} · {sow.document.date}</div>
                  </div>
                  <button className="btn btn-ghost" style={{fontSize:9,padding:"2px 7px"}}>↓</button>
                </div>
              )
              : <div style={{border:"1.5px dashed #cbd5e1",borderRadius:7,padding:"12px",textAlign:"center",color:"#94a3b8",marginBottom:8}}>
                  <div style={{fontSize:16,marginBottom:4}}><Ico n="upload" s={16}/></div>
                  <div style={{fontSize:10.5,fontWeight:600}}>No document uploaded</div>
                  <div style={{fontSize:9,marginTop:2}}>Drop signed PDF or click to upload</div>
                </div>
            }
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              <button className="btn btn-ghost" style={{fontSize:9.5}}><Ico n="upload" s={9}/> Upload</button>
              <button className="btn btn-ghost" style={{fontSize:9.5}}><Ico n="sow" s={9}/> Generate Template</button>
              <button className="btn btn-ghost" style={{fontSize:9.5}}><Ico n="mail" s={9}/> Send to Client</button>
            </div>
            <div className="drawer-section" style={{marginTop:10}}>Version History</div>
            {sow.amendCount===0
              ? <div style={{fontSize:10,color:"#94a3b8"}}>No amendments yet.</div>
              : <div style={{display:"flex",alignItems:"center",gap:7,padding:"4px 0",fontSize:10.5}}>
                  <span style={{fontFamily:"monospace",color:"#6366f1",fontSize:9.5}}>v2</span>
                  <span style={{flex:1,color:"#374151"}}>Amendment 1 — expanded data sources</span>
                  <span style={{fontSize:9,color:"#94a3b8"}}>Feb 20</span>
                </div>
            }
          </div>
        )}

        {/* ACTIVITY */}
        {dtab==="activity"&&(
          <div>
            <div className="drawer-section">Activity Log</div>
            {sow.activity.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:8,paddingBottom:8,marginBottom:8,borderBottom:"1px solid #f8fafc"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:i===0?"#3b82f6":"#e2e8f0",flexShrink:0,marginTop:4}}/>
                <div>
                  <div style={{fontSize:9,fontFamily:"monospace",color:"#94a3b8",marginBottom:1}}>{a.date} · {a.user}</div>
                  <div style={{fontSize:10.5,fontWeight:600,color:"#374151"}}>{a.action}</div>
                  <div style={{fontSize:9.5,color:"#94a3b8"}}>{a.detail}</div>
                </div>
              </div>
            ))}
            <div style={{marginTop:4}}>
              <input className="fi" placeholder="Add note or log entry…" style={{fontSize:10.5}}/>
            </div>
          </div>
        )}
      </div>

      {/* DRAWER FOOTER */}
      <div style={{padding:"8px 12px",borderTop:"1px solid #e2e8f0",background:"#f8fafc",display:"flex",gap:5,flexShrink:0}}>
        <button className="btn btn-primary" style={{fontSize:9.5,flex:1}}>Save Changes</button>
        <button className="btn btn-ghost"   style={{fontSize:9.5}}>Edit Full</button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   NEW SOW MODAL
────────────────────────────────────────────────────────── */
const NSOW_STEPS = ["Identity","Dates & Terms","Ownership","Documents"];

function NewSowModal({ onClose, onSave, nextId }){
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title:"", client:"", engName:"", category:"Digital Transformation", region:"North America",
    type:"IT Services", billingModel:"T&M — Monthly", currency:"USD", value:"",
    effectiveDate:"", expiryDate:"", signedDate:"",
    linkedReqs:"", autoRenew:"No", paymentTerms:"Net 30",
    penaltyClause:"None", nda:"Signed", msa:"Yes", poRequired:"Yes",
    owner:"Dana Mercer", dh:"Rachel Kim", clientContact:"",
    notes:"",
  });
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const pct=Math.round((step/(NSOW_STEPS.length-1))*100);

  const validate=()=>{
    const e={};
    if(step===0){if(!form.title.trim())e.title="Required";if(!form.client)e.client="Required";}
    if(step===1){if(!form.value)e.value="Required";if(!form.effectiveDate)e.effectiveDate="Required";if(!form.expiryDate)e.expiryDate="Required";}
    setErrors(e);
    return Object.keys(e).length===0;
  };
  const next=()=>{if(validate())setStep(s=>Math.min(s+1,NSOW_STEPS.length-1))};
  const prev=()=>{setErrors({});setStep(s=>Math.max(s-1,0))};

  const handleSave=()=>{
    if(!validate())return;
    onSave({
      id:nextId, title:form.title, client:form.client, engName:form.engName,
      category:form.category, region:form.region, type:form.type,
      status:"Draft", billingModel:form.billingModel, currency:form.currency,
      value:parseInt(form.value)||0, invoiced:0, received:0, outstanding:parseInt(form.value)||0,
      effectiveDate:form.effectiveDate, expiryDate:form.expiryDate, signedDate:form.signedDate,
      created:new Date().toISOString().slice(0,10),
      amendCount:0, version:"v1",
      owner:form.owner, dh:form.dh, clientContact:form.clientContact,
      linkedReqs:form.linkedReqs?form.linkedReqs.split(",").map(r=>r.trim()).filter(Boolean):[],
      linkedProj:"", nda:form.nda, msa:form.msa, poRequired:form.poRequired,
      paymentTerms:form.paymentTerms, penaltyClause:form.penaltyClause, autoRenew:form.autoRenew,
      document:null, notes:form.notes, activity:[{date:new Date().toISOString().slice(0,10),user:form.owner,action:"SOW created",detail:"Created via New SOW form"}],
      milestones:[],
    });
  };

  const OWNERS=["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"];

  return(
    <div className="overlay" onClick={e=>{if(e.target.classList.contains("overlay"))onClose()}}>
      <div className="modal" style={{maxWidth:660}} onClick={e=>e.stopPropagation()}>
        {/* HEAD */}
        <div className="nsow-head">
          <div style={{width:24,height:24,borderRadius:6,background:"linear-gradient(135deg,#6366f1,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>📝</div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>New Statement of Work</div>
            <div style={{fontSize:9.5,color:"#94a3b8"}}>Step {step+1} of {NSOW_STEPS.length} — {NSOW_STEPS[step]}</div>
          </div>
          <span style={{fontFamily:"monospace",fontSize:9.5,color:"#6366f1",marginRight:6}}>{nextId}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* STEP PROGRESS */}
        <div className="nsow-step-bar">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            {NSOW_STEPS.map((s,i)=>(
              <div key={s} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flex:1}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:i<step?"#1d4ed8":i===step?"#7c3aed":"#fff",border:`1.5px solid ${i<step?"#3b82f6":i===step?"#8b5cf6":"#e2e8f0"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8.5,fontWeight:700,color:i<=step?"#fff":"#94a3b8",boxShadow:i===step?"0 0 0 3px rgba(139,92,246,.12)":"none"}}>
                  {i<step?<Ico n="check" s={8} c="#fff"/>:i+1}
                </div>
                <div style={{fontSize:8,fontWeight:600,color:i===step?"#7c3aed":i<step?"#3b82f6":"#94a3b8",textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{height:2,background:"#e2e8f0",borderRadius:2,overflow:"hidden",marginTop:4}}>
            <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#3b82f6,#7c3aed)",transition:"width .3s",borderRadius:2}}/>
          </div>
        </div>

        {/* FORM BODY */}
        <div className="tab-body" style={{flex:1,minHeight:320}}>
          {step===0&&(
            <div className="fg fg-3">
              <div className="sh" style={{marginTop:0}}>SOW Identity</div>
              <div className="fg-full">
                <label className="lbl">SOW Title <span style={{color:"#ef4444"}}>*</span></label>
                <input className="fi" placeholder="e.g. Nexus Digital Transformation Phase 1" value={form.title} onChange={e=>set("title",e.target.value)} style={{borderColor:errors.title?"#ef4444":""}}/>
                {errors.title&&<div style={{fontSize:9,color:"#ef4444",marginTop:2}}>{errors.title}</div>}
              </div>
              <div>
                <label className="lbl">Client <span style={{color:"#ef4444"}}>*</span></label>
                <select className="fi" value={form.client} onChange={e=>set("client",e.target.value)} style={{borderColor:errors.client?"#ef4444":""}}>
                  <option value="">— Select —</option>
                  {["Nexus Corp","Meridian Holdings","BlueStar Retail","Orion Financial","TrueNorth Law","Summit Energy","— New —"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="lbl">Engagement / Programme</label><input className="fi" placeholder="e.g. Nexus Digital Transformation" value={form.engName} onChange={e=>set("engName",e.target.value)}/></div>
              <div><label className="lbl">Service Category</label>
                <select className="fi" value={form.category} onChange={e=>set("category",e.target.value)}>
                  {["Digital Transformation","Data & Analytics","Digital Services","Cloud Services","IT Services","Managed Services","Contract Staffing"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="lbl">Service Type</label>
                <select className="fi" value={form.type} onChange={e=>set("type",e.target.value)}>
                  {["IT Services","Data & Analytics","Digital Services","Cloud Services","Managed Services","Contract Staffing"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="lbl">Region</label>
                <select className="fi" value={form.region} onChange={e=>set("region",e.target.value)}>
                  {["North America","Europe","APAC","LATAM","MEA"].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div><label className="lbl">Linked Requirements (comma-sep)</label><input className="fi" placeholder="SR-0041, SR-0042" value={form.linkedReqs} onChange={e=>set("linkedReqs",e.target.value)}/></div>
            </div>
          )}

          {step===1&&(
            <div className="fg fg-3">
              <div className="sh" style={{marginTop:0}}>Contract Value</div>
              <div><label className="lbl">Contract Value <span style={{color:"#ef4444"}}>*</span></label>
                <input className="fi" type="number" placeholder="e.g. 142000" value={form.value} onChange={e=>set("value",e.target.value)} style={{borderColor:errors.value?"#ef4444":""}}/>
                {errors.value&&<div style={{fontSize:9,color:"#ef4444",marginTop:2}}>{errors.value}</div>}
              </div>
              <div><label className="lbl">Currency</label>
                <select className="fi" value={form.currency} onChange={e=>set("currency",e.target.value)}>
                  {["USD","EUR","GBP","SGD","AUD","INR"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="lbl">Billing Model</label>
                <select className="fi" value={form.billingModel} onChange={e=>set("billingModel",e.target.value)}>
                  {["T&M — Monthly","Fixed Milestone","Retainer — Monthly","Fixed Price","Cost-Plus"].map(b=><option key={b}>{b}</option>)}
                </select>
              </div>

              <div className="sh">Key Dates</div>
              <div><label className="lbl">Effective Date <span style={{color:"#ef4444"}}>*</span></label>
                <input type="date" className="fi" value={form.effectiveDate} onChange={e=>set("effectiveDate",e.target.value)} style={{borderColor:errors.effectiveDate?"#ef4444":""}}/>
              </div>
              <div><label className="lbl">Expiry Date <span style={{color:"#ef4444"}}>*</span></label>
                <input type="date" className="fi" value={form.expiryDate} onChange={e=>set("expiryDate",e.target.value)} style={{borderColor:errors.expiryDate?"#ef4444":""}}/>
              </div>
              <div><label className="lbl">Signed Date</label><input type="date" className="fi" value={form.signedDate} onChange={e=>set("signedDate",e.target.value)}/></div>

              <div className="sh">Commercial Terms</div>
              <div><label className="lbl">Payment Terms</label>
                <select className="fi" value={form.paymentTerms} onChange={e=>set("paymentTerms",e.target.value)}>
                  {["Net 30","Net 45","Net 60","Immediate","Milestone-based"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="lbl">Auto-Renew</label>
                <select className="fi" value={form.autoRenew} onChange={e=>set("autoRenew",e.target.value)}>
                  {["No","1-Year Auto-Renew","Mutual Agreement"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="lbl">Penalty Clause</label>
                <select className="fi" value={form.penaltyClause} onChange={e=>set("penaltyClause",e.target.value)}>
                  {["None","Yes — Delay Penalty","Yes — SLA Breach"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="lbl">NDA Status</label>
                <select className="fi" value={form.nda} onChange={e=>set("nda",e.target.value)}>
                  {["Signed","Required","Not Required","Pending"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="lbl">MSA In Place</label>
                <select className="fi" value={form.msa} onChange={e=>set("msa",e.target.value)}>
                  {["Yes","No","In Progress"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="lbl">PO Required</label>
                <select className="fi" value={form.poRequired} onChange={e=>set("poRequired",e.target.value)}>
                  {["Yes","No","TBD"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          {step===2&&(
            <div className="fg fg-3">
              <div className="sh" style={{marginTop:0}}>Ownership</div>
              <div><label className="lbl">Owner / Sales</label>
                <select className="fi" value={form.owner} onChange={e=>set("owner",e.target.value)}>
                  {["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"].map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
              <div><label className="lbl">Delivery Head</label>
                <select className="fi" value={form.dh} onChange={e=>set("dh",e.target.value)}>
                  {["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"].map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
              <div><label className="lbl">Client Contact (Signatory)</label>
                <input className="fi" placeholder="e.g. John Smith (VP Engineering)" value={form.clientContact} onChange={e=>set("clientContact",e.target.value)}/>
              </div>
              <div className="fg-full"><label className="lbl">Internal Notes</label>
                <textarea className="fi" rows={3} placeholder="Key flags, requirements, sensitivities…" value={form.notes} onChange={e=>set("notes",e.target.value)}/>
              </div>
            </div>
          )}

          {step===3&&(
            <div>
              <div className="fg fg-2">
                <div className="sh" style={{marginTop:0}}>Upload Document</div>
                <div className="fg-full">
                  <div className="upload-zone" style={{cursor:"pointer"}}>
                    <div style={{fontSize:18,marginBottom:4}}><Ico n="upload" s={18}/></div>
                    <div style={{fontWeight:600,fontSize:11}}>Drop signed SOW PDF or click to upload</div>
                    <div style={{fontSize:9.5,marginTop:2,color:"#94a3b8"}}>PDF · Max 20MB · Signed or draft copy</div>
                  </div>
                  <div style={{display:"flex",gap:5,marginTop:7}}>
                    <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="sow" s={10}/> Generate Template</button>
                    <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="mail" s={10}/> Send to Client</button>
                  </div>
                </div>
                <div className="sh">Summary Review</div>
              </div>
              <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:7,padding:"10px 12px",marginTop:4}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                  {[
                    {k:"SOW ID",v:nextId},{k:"Title",v:form.title||"—"},{k:"Client",v:form.client||"—"},
                    {k:"Category",v:form.category},{k:"Region",v:form.region},{k:"Billing",v:form.billingModel},
                    {k:"Value",v:form.value?`${form.currency} ${parseInt(form.value).toLocaleString()}`:"—"},
                    {k:"Effective",v:form.effectiveDate||"TBD"},{k:"Expiry",v:form.expiryDate||"TBD"},
                    {k:"Owner",v:form.owner},{k:"DH",v:form.dh},{k:"Auto-Renew",v:form.autoRenew},
                  ].map(({k,v})=>(
                    <div key={k} style={{display:"flex",gap:5,alignItems:"baseline"}}>
                      <span style={{fontSize:8.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.4,minWidth:80,flexShrink:0}}>{k}</span>
                      <span style={{fontSize:10,color:"#0f172a",fontWeight:500}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-foot">
          <span className="foot-status">
            {step===NSOW_STEPS.length-1
              ? <span style={{color:"#059669",fontWeight:600,fontSize:9.5}}>✓ Ready to create SOW</span>
              : <span style={{fontSize:9.5,color:"#94a3b8"}}>Fill all required fields to proceed</span>}
          </span>
          <button className="btn btn-ghost" style={{fontSize:10}} onClick={onClose}>Cancel</button>
          {step>0&&<button className="btn btn-secondary" style={{fontSize:10}} onClick={prev}><Ico n="chevL" s={10}/> Back</button>}
          {step<NSOW_STEPS.length-1
            ? <button className="btn btn-primary" style={{fontSize:10}} onClick={next}>Next <Ico n="chevR" s={10}/></button>
            : <button className="btn btn-success" style={{fontSize:10}} onClick={handleSave}><Ico n="check" s={10}/> Create SOW</button>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SOW TRACKER PAGE
═══════════════════════════════════════════════════════════ */
function SowPage(){
  const [sows, setSows]           = useState(SOW_SEED);
  const [statusTab, setStatusTab] = useState("All");
  const [search, setSearch]       = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterDH, setFilterDH]   = useState("all");
  const [sortCol, setSortCol]     = useState("id");
  const [sortDir, setSortDir]     = useState("asc");
  const [viewMode, setViewMode]   = useState("table");
  const [selected, setSelected]   = useState(null);   // selected SOW id for drawer
  const [showNew, setShowNew]     = useState(false);

  const nextSowId = `SOW-2026-0${String(Math.max(...sows.map(s=>parseInt(s.id.split("-")[2])))+1)}`;

  /* ── FILTERS ── */
  const STATUS_TABS = ["All", ...SOW_FLOW, "Terminated"];
  const counts = STATUS_TABS.reduce((acc,t)=>{
    acc[t] = t==="All" ? sows.length : sows.filter(s=>s.status===t).length;
    return acc;
  },{});

  const filtered = sows
    .filter(s=> statusTab==="All" || s.status===statusTab)
    .filter(s=> !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.client.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()))
    .filter(s=> filterClient==="all" || s.client===filterClient)
    .filter(s=> filterRegion==="all" || s.region===filterRegion)
    .filter(s=> filterDH==="all"     || s.dh===filterDH)
    .sort((a,b)=>{
      let av=a[sortCol]??"", bv=b[sortCol]??"";
      if(sortCol==="value"||sortCol==="invoiced"){av=+av;bv=+bv;}
      if(av<bv)return sortDir==="asc"?-1:1;
      if(av>bv)return sortDir==="asc"?1:-1;
      return 0;
    });

  const toggleSort=(col)=>{
    if(sortCol===col) setSortDir(d=>d==="asc"?"desc":"asc");
    else {setSortCol(col);setSortDir("asc");}
  };

  const handleStatusChange=(id,newStatus)=>{
    setSows(p=>p.map(s=>s.id===id?{...s,status:newStatus,activity:[{date:new Date().toISOString().slice(0,10),user:"Admin",action:`Status → ${newStatus}`,detail:"Manual status change"},...s.activity]}:s));
  };

  const handleSaveNew=(nsow)=>{
    setSows(p=>[nsow,...p]);
    setShowNew(false);
    setSelected(nsow.id);
  };

  /* ── KPI ── */
  const totalVal  = sows.reduce((a,s)=>a+s.value,0);
  const totalInv  = sows.reduce((a,s)=>a+s.invoiced,0);
  const totalOS   = sows.reduce((a,s)=>a+s.outstanding,0);
  const expiring  = sows.filter(s=>{ const d=daysTo(s.expiryDate); return d!==null&&d>=0&&d<=90; }).length;
  const overdue   = sows.filter(s=>{ const d=daysTo(s.expiryDate); return d!==null&&d<0&&s.status!=="Terminated"; }).length;

  /* ── EXPIRY COLOR ── */
  const expCol = d => d===null?"#94a3b8":d<=0?"#dc2626":d<=10?"#dc2626":d<=30?"#d97706":d<=90?"#f59e0b":"#64748b";
  const expBg  = d => d===null?"#f8fafc":d<=30?"#fef2f2":d<=90?"#fffbeb":"#f8fafc";

  const selectedSow = sows.find(s=>s.id===selected);

  const TH=({col,label,style={}})=>(
    <th style={style} className={`${sortCol===col?"sorted":""}`} onClick={()=>toggleSort(col)}>
      {label} {sortCol===col?(sortDir==="asc"?"↑":"↓"):""}
    </th>
  );

  return(
    <div className="sow-page">
      <style>{SOW_PAGE_CSS}</style>
      <div className="sow-main">

        {/* ── KPI STRIP ── */}
        <div className="sow-kpi-strip">
          {[
            {lbl:"Total SOWs",    val:sows.length,               sub:`${sows.filter(s=>s.status==="Active").length} active`,    col:"#1d4ed8"},
            {lbl:"Portfolio Value",val:fmtFull(totalVal),        sub:"across all SOWs",                                          col:"#7c3aed"},
            {lbl:"Invoiced",      val:fmtFull(totalInv),         sub:`${Math.round(totalInv/totalVal*100)}% of contract`,        col:"#059669"},
            {lbl:"Outstanding",   val:fmtFull(totalOS),          sub:"pending collection",                                       col:totalOS>50000?"#d97706":"#64748b"},
            {lbl:"Expiring ≤90d", val:expiring,                  sub:"need review",                                              col:expiring>0?"#d97706":"#64748b"},
            {lbl:"Overdue",       val:overdue,                   sub:"expired not closed",                                       col:overdue>0?"#dc2626":"#64748b"},
            {lbl:"Amendments",    val:sows.reduce((a,s)=>a+s.amendCount,0), sub:"total amendments",                             col:"#64748b"},
          ].map(k=>(
            <div key={k.lbl} className="sow-kpi" style={{"--c":k.col}}>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:k.col,borderRadius:"0 0 7px 7px"}}/>
              <div className="sow-kpi-val" style={{color:k.col}}>{k.val}</div>
              <div className="sow-kpi-lbl">{k.lbl}</div>
              <div className="sow-kpi-sub" style={{color:k.col+"aa"}}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── STATUS TABS ── */}
        <div className="sow-tabs">
          {STATUS_TABS.filter(t=>counts[t]>0||t==="All").map(t=>(
            <button key={t} className={`sow-tab ${statusTab===t?"active":""}`} onClick={()=>setStatusTab(t)} style={{background:"none",border:"none"}}>
              {t}
              <span className="sow-tab-count">{counts[t]||0}</span>
            </button>
          ))}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="sow-toolbar">
          <div className="sow-search">
            <Ico n="search" s={10} c="#94a3b8"/>
            <input placeholder="Search SOW ID, title, client…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="sow-chip">
            <Ico n="users" s={10}/>
            <select value={filterClient} onChange={e=>setFilterClient(e.target.value)}>
              <option value="all">All Clients</option>
              {["Nexus Corp","Meridian Holdings","BlueStar Retail","Orion Financial","TrueNorth Law","Summit Energy"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sow-chip">
            <select value={filterRegion} onChange={e=>setFilterRegion(e.target.value)}>
              <option value="all">All Regions</option>
              {["North America","Europe","APAC","LATAM","MEA"].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="sow-chip">
            <select value={filterDH} onChange={e=>setFilterDH(e.target.value)}>
              <option value="all">All DH</option>
              {["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"].map(u=><option key={u}>{u}</option>)}
            </select>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
            <div className="view-toggle">
              <button className={`vt-btn ${viewMode==="table"?"active":""}`} onClick={()=>setViewMode("table")}>≡ Table</button>
              <button className={`vt-btn ${viewMode==="card"?"active":""}`}  onClick={()=>setViewMode("card")}>⊞ Cards</button>
            </div>
            <button className="btn btn-ghost"   style={{fontSize:10}}><Ico n="upload" s={10}/> Export</button>
            <button className="btn btn-primary" style={{fontSize:10}} onClick={()=>setShowNew(true)}><Ico n="plus" s={10}/> New SOW</button>
          </div>
        </div>

        {/* ── TABLE VIEW ── */}
        {viewMode==="table"&&(
          <div className="sow-tbl-wrap">
            <table className="sow-tbl">
              <thead>
                <tr>
                  <TH col="id"           label="SOW ID"          style={{width:120}}/>
                  <TH col="title"        label="Title"           style={{minWidth:180}}/>
                  <TH col="client"       label="Client"          style={{minWidth:120}}/>
                  <TH col="type"         label="Type"            style={{width:120}}/>
                  <TH col="status"       label="Status"          style={{width:110}}/>
                  <TH col="value"        label="Value"           style={{width:90}}/>
                  <TH col="invoiced"     label="Invoiced"        style={{width:90}}/>
                  <th style={{width:120}}>Billing Progress</th>
                  <TH col="effectiveDate" label="Effective"      style={{width:90}}/>
                  <TH col="expiryDate"   label="Expiry"          style={{width:90}}/>
                  <th style={{width:70}}>Days Left</th>
                  <TH col="dh"           label="DH"              style={{width:100}}/>
                  <th style={{width:30}}/>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s=>{
                  const days   = daysTo(s.expiryDate);
                  const sm     = SOW_STATUS_META[s.status]||SOW_STATUS_META["Draft"];
                  const burnPct= s.value?Math.round(s.invoiced/s.value*100):0;
                  const isSelected = selected===s.id;
                  return(
                    <tr key={s.id} className={isSelected?"selected":""} onClick={()=>setSelected(s.id===selected?null:s.id)}>
                      <td><span style={{fontFamily:"monospace",fontSize:9.5,color:"#6366f1",fontWeight:600}}>{s.id}</span></td>
                      <td>
                        <div style={{fontSize:10.5,fontWeight:600,color:"#0f172a",maxWidth:210,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.title}</div>
                        <div style={{fontSize:9,color:"#94a3b8"}}>{s.engName}</div>
                      </td>
                      <td><div style={{fontSize:10.5,fontWeight:500,color:"#374151"}}>{s.client}</div><div style={{fontSize:9,color:"#94a3b8"}}>{s.region}</div></td>
                      <td><span className="badge" style={{background:TYPE_COLORS[s.type]+"18",color:TYPE_COLORS[s.type]||"#64748b",fontSize:8.5}}>{s.type}</span></td>
                      <td><span className="badge" style={{background:sm.bg,color:sm.color,border:`1px solid ${sm.border}`,fontSize:9}}>{s.status}</span></td>
                      <td><span style={{fontFamily:"monospace",fontSize:10.5,fontWeight:700,color:"#374151"}}>{fmt(s.value)}</span></td>
                      <td><span style={{fontFamily:"monospace",fontSize:10,color:"#7c3aed"}}>{fmt(s.invoiced)}</span></td>
                      <td>
                        <div className="sow-burn">
                          <div className="sow-burn-bar">
                            <div className="sow-burn-fill" style={{width:`${burnPct}%`,background:burnPct>80?"#dc2626":burnPct>60?"#d97706":"#3b82f6"}}/>
                          </div>
                          <span style={{fontSize:9,fontFamily:"monospace",color:"#64748b",minWidth:26,flexShrink:0}}>{burnPct}%</span>
                        </div>
                      </td>
                      <td><span style={{fontFamily:"monospace",fontSize:9.5,color:"#64748b"}}>{s.effectiveDate||"—"}</span></td>
                      <td><span style={{fontFamily:"monospace",fontSize:9.5,color:"#64748b"}}>{s.expiryDate||"—"}</span></td>
                      <td>
                        {days!==null
                          ? <span className="exp-badge" style={{background:expBg(days),color:expCol(days)}}>
                              {days<=0?`${Math.abs(days)}d ago`:`${days}d`}
                            </span>
                          : <span style={{color:"#cbd5e1",fontSize:9}}>—</span>}
                      </td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <div className="av" style={{width:18,height:18,fontSize:8,background:`hsl(${s.dh.charCodeAt(0)*17%360},40%,38%)`}}>{s.dh.split(" ").map(x=>x[0]).join("")}</div>
                          <span style={{fontSize:10,color:"#475569"}}>{s.dh.split(" ")[0]}</span>
                        </div>
                      </td>
                      <td>
                        <button style={{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:12,padding:"0 2px"}}
                          onClick={e=>{e.stopPropagation();setSelected(s.id===selected?null:s.id);}}>
                          {isSelected?"›":"›"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length===0&&(
              <div style={{padding:"40px",textAlign:"center",color:"#94a3b8"}}>
                <div style={{fontSize:20,marginBottom:8}}>📝</div>
                <div style={{fontSize:11,fontWeight:600}}>No SOWs match the current filters</div>
                <div style={{fontSize:10,marginTop:4}}>Try changing the status tab or clearing search</div>
              </div>
            )}
          </div>
        )}

        {/* ── CARD VIEW ── */}
        {viewMode==="card"&&(
          <div style={{flex:1,overflow:"auto"}}>
            <div className="sow-card-grid">
              {filtered.map(s=>{
                const days = daysTo(s.expiryDate);
                const sm   = SOW_STATUS_META[s.status]||SOW_STATUS_META["Draft"];
                const burnPct = s.value?Math.round(s.invoiced/s.value*100):0;
                return(
                  <div key={s.id} className={`sow-card ${selected===s.id?"selected":""}`} onClick={()=>setSelected(s.id===selected?null:s.id)}>
                    <div className="sow-card-accent" style={{background:sm.color}}/>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
                      <div className="sow-card-id">{s.id}</div>
                      <span className="badge" style={{background:sm.bg,color:sm.color,border:`1px solid ${sm.border}`,fontSize:8.5}}>{s.status}</span>
                    </div>
                    <div className="sow-card-title">{s.title}</div>
                    <div className="sow-card-client">{s.client} · {s.region}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:7,marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:700,fontFamily:"monospace",color:"#0f172a"}}>{fmt(s.value)}</span>
                      {days!==null&&<span className="exp-badge" style={{background:expBg(days),color:expCol(days)}}>{days<=0?`exp. ${Math.abs(days)}d ago`:`${days}d left`}</span>}
                    </div>
                    <div style={{height:4,background:"#e2e8f0",borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${burnPct}%`,background:burnPct>80?"#dc2626":burnPct>60?"#d97706":"#3b82f6",borderRadius:2}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#94a3b8",marginTop:3}}>
                      <span>Invoiced {burnPct}%</span>
                      <span>{s.dh}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM STATUS BAR */}
        <div style={{padding:"5px 14px",borderTop:"1px solid #e2e8f0",background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:9.5,color:"#94a3b8"}}>{filtered.length} of {sows.length} SOWs · {statusTab!=="All"?statusTab:"All statuses"}</div>
          <div style={{display:"flex",gap:5}}>
            {["←","1","→"].map(p=><button key={p} style={{width:20,height:20,border:"1px solid #e2e8f0",background:"#fff",borderRadius:4,fontSize:10,cursor:"pointer",color:"#64748b"}}>{p}</button>)}
          </div>
        </div>
      </div>

      {/* ── DETAIL DRAWER ── */}
      <SowDrawer
        sow={selectedSow||null}
        onClose={()=>setSelected(null)}
        onStatusChange={handleStatusChange}
      />

      {/* ── NEW SOW MODAL ── */}
      {showNew&&<NewSowModal onClose={()=>setShowNew(false)} onSave={handleSaveNew} nextId={nextSowId}/>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SOW APPROVAL PAGE
═══════════════════════════════════════════════════════════ */
const APPROVAL_QUEUE = [
  {
    id:"SAPPR-001", sowId:"SOW-2026-043", title:"BlueStar Mobile Commerce App & Portal",
    client:"BlueStar Retail", value:220000, region:"APAC", type:"Digital Services",
    submittedBy:"Theo Vasquez", submittedAt:"2026-03-04", urgency:"High",
    billingModel:"Fixed Milestone", expiryDate:"2026-10-31", linkedReqs:["SR-0043","SR-0049"],
    notes:"Client brand guide confirmed. App store accounts ready. Request fast-track approval before kickoff on Mar 10.",
    stages:[
      { role:"Sales Lead",    person:"Theo Vasquez", status:"approved", date:"2026-03-04", note:"Opportunity validated. Value confirmed by client procurement." },
      { role:"Delivery Head", person:"Dana Mercer",  status:"approved", date:"2026-03-05", note:"Resource plan attached. Timeline feasible." },
      { role:"Legal Review",  person:"Rachel Kim",   status:"pending",  date:null,         note:"" },
      { role:"Finance",       person:"Sam Keller",   status:"pending",  date:null,         note:"" },
      { role:"Admin / Final", person:"Dana Mercer",  status:"pending",  date:null,         note:"" },
    ],
    documents:[
      { name:"SOW-2026-043-v1.pdf",        type:"SOW",           size:"3.2 MB", date:"2026-02-24" },
      { name:"BlueStar-BrandGuide.pdf",    type:"Supporting",    size:"5.6 MB", date:"2026-02-22" },
      { name:"ResourcePlan-PRJ-0086.xlsx", type:"Resource Plan", size:"0.4 MB", date:"2026-03-03" },
    ],
    history:[],
  },
  {
    id:"SAPPR-002", sowId:"SOW-2026-048", title:"Meridian Predictive Analytics Engine",
    client:"Meridian Holdings", value:175000, region:"Europe", type:"Data & Analytics",
    submittedBy:"Sam Keller", submittedAt:"2026-03-05", urgency:"Critical",
    billingModel:"T&M — Monthly", expiryDate:"2026-10-31", linkedReqs:["SR-0048"],
    notes:"EU data residency clause negotiated. ML model SLA at 95% accuracy agreed. Procurement window closes in 48 hrs.",
    stages:[
      { role:"Sales Lead",    person:"Sam Keller",   status:"approved", date:"2026-03-05", note:"Pricing validated. Margin confirmed at 38%." },
      { role:"Delivery Head", person:"Tom Ashby",    status:"approved", date:"2026-03-06", note:"Databricks env provisioned. Data team available Q2." },
      { role:"Legal Review",  person:"Rachel Kim",   status:"approved", date:"2026-03-07", note:"GDPR addendum reviewed. Data processing agreement signed." },
      { role:"Finance",       person:"Sam Keller",   status:"pending",  date:null,         note:"" },
      { role:"Admin / Final", person:"Dana Mercer",  status:"pending",  date:null,         note:"" },
    ],
    documents:[
      { name:"SOW-2026-048-v1.pdf",       type:"SOW",    size:"2.4 MB", date:"2026-03-05" },
      { name:"GDPR-DataProcessing.pdf",   type:"Legal",  size:"1.1 MB", date:"2026-03-06" },
    ],
    history:[],
  },
  {
    id:"SAPPR-003", sowId:"SOW-2026-054", title:"Meridian RBAC Security Module",
    client:"Meridian Holdings", value:48000, region:"Europe", type:"IT Services",
    submittedBy:"Lian Zhou", submittedAt:"2026-03-01", urgency:"Medium",
    billingModel:"Fixed Price", expiryDate:"2026-07-31", linkedReqs:["SR-0054"],
    notes:"ISO 27001 alignment clause included. Pen test sign-off milestone before go-live.",
    stages:[
      { role:"Sales Lead",    person:"Lian Zhou",    status:"approved", date:"2026-03-01", note:"Fixed-price agreed. SOW scope locked." },
      { role:"Delivery Head", person:"Tom Ashby",    status:"approved", date:"2026-03-02", note:"Security engineer assigned — Omar Ali." },
      { role:"Legal Review",  person:"Rachel Kim",   status:"approved", date:"2026-03-03", note:"ISO 27001 clause verified. Pen test SLA acceptable." },
      { role:"Finance",       person:"Sam Keller",   status:"approved", date:"2026-03-04", note:"Fixed-price margin at 41%. Invoice milestones agreed." },
      { role:"Admin / Final", person:"Dana Mercer",  status:"pending",  date:null,         note:"" },
    ],
    documents:[
      { name:"SOW-2026-054-v1.pdf",     type:"SOW",    size:"0.9 MB", date:"2026-02-25" },
      { name:"ISO27001-Compliance.pdf", type:"Legal",  size:"0.7 MB", date:"2026-02-28" },
    ],
    history:[],
  },
  {
    id:"SAPPR-004", sowId:"SOW-2026-046", title:"Summit Energy Cloud Lift & Inventory Sync",
    client:"Summit Energy", value:51000, region:"North America", type:"IT Services",
    submittedBy:"Lian Zhou", submittedAt:"2026-02-28", urgency:"Low",
    billingModel:"Fixed Price", expiryDate:"", linkedReqs:["SR-0046","SR-0051"],
    notes:"On hold — client infra readiness sign-off pending. SOW scope depends on ETL audit outcome.",
    stages:[
      { role:"Sales Lead",    person:"Lian Zhou",    status:"approved",  date:"2026-02-28", note:"Deal qualified. Waiting on infra audit." },
      { role:"Delivery Head", person:"Theo Vasquez", status:"rejected",  date:"2026-03-02", note:"Cannot commit resources until client ETL audit is complete. Resubmit when ready." },
      { role:"Legal Review",  person:"Rachel Kim",   status:"skipped",   date:null,         note:"" },
      { role:"Finance",       person:"Sam Keller",   status:"skipped",   date:null,         note:"" },
      { role:"Admin / Final", person:"Dana Mercer",  status:"skipped",   date:null,         note:"" },
    ],
    documents:[{ name:"SOW-2026-046-draft.pdf", type:"SOW", size:"1.3 MB", date:"2026-02-28" }],
    history:[{ date:"2026-03-02", user:"Theo Vasquez", action:"Rejected at Delivery Head", note:"Resubmit after ETL audit." }],
  },
];

const URGENCY_META = {
  Critical:{ color:"#dc2626", bg:"#fef2f2", border:"#fca5a5" },
  High:    { color:"#d97706", bg:"#fffbeb", border:"#fcd34d" },
  Medium:  { color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
  Low:     { color:"#64748b", bg:"#f8fafc", border:"#e2e8f0" },
};
const STAGE_STATUS_META = {
  approved:{ color:"#059669", bg:"#f0fdf4", border:"#86efac", icon:"✓", label:"Approved" },
  pending: { color:"#d97706", bg:"#fffbeb", border:"#fcd34d", icon:"◷", label:"Pending"  },
  rejected:{ color:"#dc2626", bg:"#fef2f2", border:"#fca5a5", icon:"✕", label:"Rejected" },
  skipped: { color:"#94a3b8", bg:"#f8fafc", border:"#e2e8f0", icon:"—", label:"Skipped"  },
};

const APPR_CSS = `
.appr-page{display:flex;height:100%;overflow:hidden;background:#f0f2f5}
.appr-left{width:310px;flex-shrink:0;display:flex;flex-direction:column;border-right:1px solid #e2e8f0;background:#fff;overflow:hidden}
.appr-right{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#fff}
.appr-queue-head{padding:10px 13px;border-bottom:1px solid #e2e8f0;flex-shrink:0}
.appr-queue-scroll{flex:1;overflow-y:auto}
.appr-queue-item{padding:10px 13px;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background .1s;position:relative;border-left:3px solid transparent}
.appr-queue-item:hover{background:#f8faff}
.appr-queue-item.active{background:#eff6ff;border-left-color:#3b82f6}
.appr-kpi-strip{display:flex;gap:7px;padding:10px 16px;border-bottom:1px solid #e2e8f0;flex-shrink:0;background:#f8fafc;overflow-x:auto}
.appr-kpi{flex:1;min-width:80px;padding:7px 10px;border:1px solid #e2e8f0;border-radius:7px;background:#fff;text-align:center}
.appr-kpi-val{font-size:19px;font-weight:700;font-family:'IBM Plex Mono',monospace}
.appr-kpi-lbl{font-size:8.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
.chain-wrap{display:flex;align-items:flex-start;padding:14px 20px;background:#f8fafc;border-bottom:1px solid #e2e8f0;flex-shrink:0;overflow-x:auto;gap:0}
.chain-node{display:flex;flex-direction:column;align-items:center;min-width:80px;flex:1}
.chain-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid;position:relative;z-index:1}
.chain-circle.curr{box-shadow:0 0 0 4px rgba(59,130,246,.15)}
.chain-role{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;margin-top:4px;text-align:center;color:#64748b;max-width:76px}
.chain-person{font-size:9px;color:#374151;font-weight:600;text-align:center;max-width:76px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chain-date{font-size:8px;color:#94a3b8;font-family:'IBM Plex Mono',monospace;text-align:center;margin-top:1px}
.chain-connector{flex:1;height:2px;margin:15px -1px 0;min-width:12px}
.appr-detail-tabs{display:flex;border-bottom:1px solid #e2e8f0;flex-shrink:0;padding:0 20px;background:#fff}
.appr-detail-tab{padding:7px 12px;font-size:10.5px;font-weight:500;color:#94a3b8;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;background:none;border-top:none;border-left:none;border-right:none;transition:all .12s}
.appr-detail-tab.active{color:#1d4ed8;border-bottom-color:#3b82f6;font-weight:700}
.appr-detail-body{flex:1;overflow-y:auto;padding:16px 20px}
.appr-action-bar{padding:11px 20px;border-top:1px solid #e2e8f0;background:#fff;flex-shrink:0;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:12px}
.info-cell{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:7px 9px}
.info-cell-lbl{font-size:8.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
.info-cell-val{font-size:10.5px;font-weight:600;color:#0f172a}
.stage-row{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #f1f5f9;align-items:flex-start}
.stage-row:last-child{border-bottom:none}
.stage-num{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0;border:1.5px solid;margin-top:1px}
.doc-row{display:flex;align-items:center;gap:8px;padding:7px 10px;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:5px;background:#fafafa;cursor:pointer}
.doc-row:hover{background:#eff6ff;border-color:#bfdbfe}
.appr-confirm-overlay{position:fixed;inset:0;background:rgba(15,23,42,.4);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(3px)}
.appr-confirm-box{background:#fff;border-radius:11px;width:460px;box-shadow:0 20px 60px rgba(15,23,42,.25);overflow:hidden}
.btn-appr-approve{background:linear-gradient(135deg,#059669,#047857);color:#fff;border:none;border-radius:6px;padding:7px 18px;font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;transition:opacity .12s}
.btn-appr-approve:hover{opacity:.88}
.btn-appr-reject{background:#fef2f2;color:#dc2626;border:1px solid #fca5a5;border-radius:6px;padding:7px 14px;font-size:11px;font-weight:700;cursor:pointer}
.btn-appr-reject:hover{background:#fee2e2}
.btn-appr-info{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:6px;padding:7px 14px;font-size:11px;font-weight:600;cursor:pointer}
.reject-banner{background:#fef2f2;border:1px solid #fca5a5;border-radius:7px;padding:10px 13px;margin-bottom:12px;display:flex;gap:9px;align-items:flex-start}
`;

const getActiveStage  = stages => stages.findIndex((s,i)=>s.status==="pending"&&(i===0||stages[i-1].status==="approved"));
const getOverallStatus= stages => stages.some(s=>s.status==="rejected")?"rejected":stages.every(s=>s.status==="approved")?"approved":"pending";

/* ── Confirm modal ── */
function ApproveConfirmModal({item,action,onConfirm,onCancel}){
  const [note,setNote]=useState("");
  const colors={approve:"#059669",reject:"#dc2626",info:"#1d4ed8"};
  const titles={approve:"Approve SOW",reject:"Reject SOW",info:"Request More Information"};
  const activeIdx=getActiveStage(item.stages);
  const isFinal=activeIdx===item.stages.length-1;
  return(
    <div className="appr-confirm-overlay" onClick={e=>e.target.classList.contains("appr-confirm-overlay")&&onCancel()}>
      <div className="appr-confirm-box">
        <div style={{padding:"12px 16px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:28,height:28,borderRadius:7,background:colors[action]+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{action==="approve"?"✓":action==="reject"?"✕":"?"}</div>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>{titles[action]}</div><div style={{fontSize:9.5,color:"#94a3b8"}}>{item.sowId} · {item.client}</div></div>
          <button onClick={onCancel} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:5,width:22,height:22,cursor:"pointer",fontSize:14,color:"#64748b"}}>×</button>
        </div>
        <div style={{padding:"13px 16px"}}>
          {action==="approve"&&<div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:6,padding:"9px 11px",marginBottom:11,fontSize:10.5,color:"#166534"}}>
            <strong>Approving</strong> <span style={{fontFamily:"monospace"}}>{item.sowId}</span> — "{item.title}" for <strong>{new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(item.value)}</strong>.
            {isFinal?<div style={{marginTop:4,fontWeight:700}}>⚠ Final approval — SOW will be marked Approved and activated.</div>:<div style={{marginTop:4}}>Advances SOW to the next review stage.</div>}
          </div>}
          {action==="reject"&&<div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:6,padding:"9px 11px",marginBottom:11,fontSize:10.5,color:"#991b1b"}}>
            <strong>Rejection will block</strong> this SOW from advancing. Submitter will be notified. A reason is required.
          </div>}
          {action==="info"&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:6,padding:"9px 11px",marginBottom:11,fontSize:10.5,color:"#1e40af"}}>
            Submitter will be notified to supply additional information before re-review.
          </div>}
          <label style={{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:.5}}>
            {action==="approve"?"Approval Note (optional)":action==="reject"?"Rejection Reason *":"Information Needed *"}
          </label>
          <textarea className="fi" rows={3} style={{marginTop:5,fontSize:11,resize:"none"}}
            placeholder={action==="approve"?"Optional note for the record…":action==="reject"?"Explain why this SOW cannot be approved…":"What additional information is required?"}
            value={note} onChange={e=>setNote(e.target.value)}/>
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"flex-end",gap:7,background:"#f8fafc"}}>
          <button className="btn btn-ghost" style={{fontSize:10.5}} onClick={onCancel}>Cancel</button>
          <button style={{background:colors[action],color:"#fff",border:"none",borderRadius:6,padding:"6px 18px",fontSize:11,fontWeight:700,cursor:action==="reject"&&!note.trim()?"not-allowed":"pointer",opacity:action==="reject"&&!note.trim()?0.5:1}}
            disabled={action==="reject"&&!note.trim()} onClick={()=>onConfirm(note)}>
            {action==="approve"?"✓ Confirm Approval":action==="reject"?"✕ Confirm Rejection":"Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Approval chain strip ── */
function ApprovalChain({stages}){
  return(
    <div className="chain-wrap">
      {stages.map((s,i)=>{
        const sm=STAGE_STATUS_META[s.status];
        const isActive=s.status==="pending"&&(i===0||stages[i-1].status==="approved");
        return(
          <div key={i} style={{display:"flex",alignItems:"flex-start",flex:i<stages.length-1?1:"unset"}}>
            <div className="chain-node">
              <div className={`chain-circle ${isActive?"curr":""}`} style={{background:sm.bg,borderColor:sm.border,color:sm.color}}>{sm.icon}</div>
              <div className="chain-role">{s.role}</div>
              <div className="chain-person">{s.person}</div>
              <div className="chain-date">{s.date||"—"}</div>
            </div>
            {i<stages.length-1&&<div className="chain-connector" style={{background:s.status==="approved"?"#86efac":s.status==="rejected"?"#fca5a5":"#e2e8f0"}}/>}
          </div>
        );
      })}
    </div>
  );
}

/* ── Queue item ── */
function QueueCard({item,active,onClick}){
  const overall=getOverallStatus(item.stages);
  const activeIdx=getActiveStage(item.stages);
  const um=URGENCY_META[item.urgency];
  return(
    <div className={`appr-queue-item ${active?"active":""}`} onClick={onClick}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontFamily:"monospace",fontSize:9.5,color:"#6366f1",fontWeight:600}}>{item.sowId}</span>
        <span style={{fontSize:8.5,fontWeight:700,padding:"1px 6px",borderRadius:3,background:um.bg,color:um.color,border:`1px solid ${um.border}`}}>{item.urgency}</span>
      </div>
      <div style={{fontSize:10.5,fontWeight:600,color:"#0f172a",marginBottom:2,lineHeight:1.35,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{item.title}</div>
      <div style={{fontSize:9.5,color:"#64748b",marginBottom:6}}>{item.client}</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:3}}>
          {item.stages.map((s,i)=>{ const sm=STAGE_STATUS_META[s.status]; return<div key={i} style={{width:10,height:10,borderRadius:"50%",background:sm.bg,border:`1.5px solid ${sm.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,color:sm.color,fontWeight:700}}>{sm.icon}</div>; })}
        </div>
        <span style={{fontSize:9,fontFamily:"monospace",fontWeight:700,color:"#374151"}}>${(item.value/1000).toFixed(0)}k</span>
      </div>
      {overall==="rejected"&&<div style={{marginTop:4,fontSize:9,color:"#dc2626",fontWeight:600}}>✕ Rejected at {item.stages.find(s=>s.status==="rejected")?.role}</div>}
      {overall==="pending"&&activeIdx>=0&&<div style={{marginTop:4,fontSize:9,color:"#d97706",fontWeight:600}}>Awaiting: {item.stages[activeIdx].role}</div>}
      {overall==="approved"&&<div style={{marginTop:4,fontSize:9,color:"#059669",fontWeight:600}}>✓ Fully Approved</div>}
    </div>
  );
}

/* ── SOW APPROVAL PAGE ── */
function SowApprovalPage(){
  const [queue,setQueue]=useState(APPROVAL_QUEUE);
  const [selected,setSelected]=useState("SAPPR-001");
  const [dtab,setDtab]=useState("overview");
  const [confirmAction,setConfirmAction]=useState(null);
  const [filterStatus,setFilterStatus]=useState("all");
  const [search,setSearch]=useState("");

  const item=queue.find(q=>q.id===selected);

  const filteredQ=queue
    .filter(q=>filterStatus==="all"||getOverallStatus(q.stages)===filterStatus)
    .filter(q=>!search||q.title.toLowerCase().includes(search.toLowerCase())||q.client.toLowerCase().includes(search.toLowerCase())||q.sowId.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>({Critical:0,High:1,Medium:2,Low:3}[a.urgency]??4)-({Critical:0,High:1,Medium:2,Low:3}[b.urgency]??4));

  const handleConfirm=(note)=>{
    const {action,item:target}=confirmAction;
    const now=new Date().toISOString().slice(0,10);
    const activeIdx=getActiveStage(target.stages);
    setQueue(prev=>prev.map(q=>{
      if(q.id!==target.id)return q;
      const newStages=q.stages.map((s,i)=>i!==activeIdx?s:{...s,status:action==="reject"?"rejected":action==="approve"?"approved":"pending",date:now,note});
      const newHistory=[{date:now,user:"Dana Mercer (Admin)",action:action==="approve"?`Approved — ${target.stages[activeIdx].role}`:action==="reject"?`Rejected — ${target.stages[activeIdx].role}`:"Requested more information",note},...q.history];
      return{...q,stages:newStages,history:newHistory};
    }));
    setConfirmAction(null);
  };

  const pending =queue.filter(q=>getOverallStatus(q.stages)==="pending").length;
  const approved=queue.filter(q=>getOverallStatus(q.stages)==="approved").length;
  const rejected=queue.filter(q=>getOverallStatus(q.stages)==="rejected").length;
  const critical=queue.filter(q=>q.urgency==="Critical"||q.urgency==="High").length;
  const totalVal=queue.filter(q=>getOverallStatus(q.stages)==="pending").reduce((a,q)=>a+q.value,0);

  const canActNow=item&&getOverallStatus(item.stages)==="pending"&&getActiveStage(item.stages)>=0;
  const activeStageIdx=item?getActiveStage(item.stages):-1;
  const isFinalStage=item&&activeStageIdx===item.stages.length-1;
  const overall=item?getOverallStatus(item.stages):null;
  const DTABS=["overview","stages","documents","history"];

  return(
    <div className="appr-page">
      <style>{APPR_CSS}</style>

      {/* LEFT QUEUE */}
      <div className="appr-left">
        <div className="appr-queue-head">
          <div style={{fontSize:11,fontWeight:700,color:"#0f172a",marginBottom:7}}>Approval Queue</div>
          <div style={{display:"flex",gap:4,marginBottom:7}}>
            {["all","pending","approved","rejected"].map(f=>(
              <button key={f} onClick={()=>setFilterStatus(f)} style={{flex:1,padding:"3px 0",borderRadius:4,fontSize:9,fontWeight:700,cursor:"pointer",textTransform:"capitalize",background:filterStatus===f?"#eff6ff":"#f8fafc",color:filterStatus===f?"#1d4ed8":"#64748b",border:`1px solid ${filterStatus===f?"#bfdbfe":"#e2e8f0"}`}}>{f}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"4px 8px"}}>
            <Ico n="search" s={10} c="#94a3b8"/>
            <input style={{background:"none",border:"none",outline:"none",fontSize:10.5,width:"100%",color:"#374151"}} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
        <div className="appr-queue-scroll">
          {filteredQ.map(q=><QueueCard key={q.id} item={q} active={selected===q.id} onClick={()=>{setSelected(q.id);setDtab("overview");}}/>)}
          {filteredQ.length===0&&<div style={{padding:"30px",textAlign:"center",color:"#94a3b8"}}><div style={{fontSize:18,marginBottom:6}}>🎉</div><div style={{fontSize:10.5,fontWeight:600}}>Queue is clear</div></div>}
        </div>
      </div>

      {/* RIGHT DETAIL */}
      <div className="appr-right">
        {!item?(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8"}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:28,marginBottom:8}}>📝</div><div style={{fontSize:11,fontWeight:600}}>Select an item from the queue</div></div>
          </div>
        ):(
          <>
            {/* KPI STRIP */}
            <div className="appr-kpi-strip">
              {[
                {lbl:"Pending",      val:pending,  col:"#d97706"},
                {lbl:"Approved",     val:approved, col:"#059669"},
                {lbl:"Rejected",     val:rejected, col:"#dc2626"},
                {lbl:"Crit / High",  val:critical, col:"#7c3aed"},
                {lbl:"Pending Value",val:`$${(totalVal/1000).toFixed(0)}k`,col:"#1d4ed8"},
              ].map(k=>(
                <div key={k.lbl} className="appr-kpi">
                  <div className="appr-kpi-val" style={{color:k.col}}>{k.val}</div>
                  <div className="appr-kpi-lbl">{k.lbl}</div>
                </div>
              ))}
            </div>

            {/* SOW HEADER */}
            <div style={{padding:"11px 20px",borderBottom:"1px solid #e2e8f0",background:"#fff",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"monospace",fontSize:10,color:"#6366f1",fontWeight:700}}>{item.sowId}</span>
                    <span style={{fontFamily:"monospace",fontSize:9.5,color:"#cbd5e1"}}>·</span>
                    <span style={{fontFamily:"monospace",fontSize:9.5,color:"#94a3b8"}}>{item.id}</span>
                    <span style={{fontSize:8.5,fontWeight:700,padding:"1px 6px",borderRadius:3,background:URGENCY_META[item.urgency].bg,color:URGENCY_META[item.urgency].color,border:`1px solid ${URGENCY_META[item.urgency].border}`}}>{item.urgency}</span>
                    {overall==="approved"&&<span style={{fontSize:9,fontWeight:700,color:"#059669",background:"#f0fdf4",border:"1px solid #86efac",padding:"1px 7px",borderRadius:3}}>✓ APPROVED</span>}
                    {overall==="rejected"&&<span style={{fontSize:9,fontWeight:700,color:"#dc2626",background:"#fef2f2",border:"1px solid #fca5a5",padding:"1px 7px",borderRadius:3}}>✕ REJECTED</span>}
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:3}}>{item.title}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{item.client} · {item.region} · {item.type} · Submitted by {item.submittedBy} on {item.submittedAt}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:20,fontWeight:700,fontFamily:"monospace",color:"#0f172a"}}>{new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(item.value)}</div>
                  <div style={{fontSize:9.5,color:"#94a3b8"}}>{item.billingModel}</div>
                </div>
              </div>
              {overall==="rejected"&&(
                <div className="reject-banner" style={{marginTop:9}}>
                  <div style={{fontSize:16,flexShrink:0}}>✕</div>
                  <div>
                    <div style={{fontSize:10.5,fontWeight:700,color:"#991b1b",marginBottom:2}}>SOW Rejected</div>
                    <div style={{fontSize:10,color:"#dc2626"}}>{item.stages.find(s=>s.status==="rejected")?.role}: {item.stages.find(s=>s.status==="rejected")?.note}</div>
                    <button style={{marginTop:4,fontSize:9.5,color:"#1d4ed8",background:"none",border:"none",cursor:"pointer",fontWeight:600,padding:0}}>→ Resubmit revised SOW</button>
                  </div>
                </div>
              )}
            </div>

            {/* APPROVAL CHAIN */}
            <ApprovalChain stages={item.stages}/>

            {/* DETAIL TABS */}
            <div className="appr-detail-tabs">
              {DTABS.map(t=>(
                <button key={t} className={`appr-detail-tab ${dtab===t?"active":""}`} onClick={()=>setDtab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
              ))}
            </div>

            {/* DETAIL BODY */}
            <div className="appr-detail-body">

              {dtab==="overview"&&(
                <div>
                  <div className="info-grid">
                    {[
                      {lbl:"SOW ID",       val:item.sowId},
                      {lbl:"Client",       val:item.client},
                      {lbl:"Service Type", val:item.type},
                      {lbl:"Region",       val:item.region},
                      {lbl:"Value",        val:new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(item.value)},
                      {lbl:"Billing",      val:item.billingModel},
                      {lbl:"Expiry",       val:item.expiryDate||"TBD"},
                      {lbl:"Urgency",      val:item.urgency},
                      {lbl:"Submitted by", val:item.submittedBy},
                      {lbl:"Submitted on", val:item.submittedAt},
                    ].map(c=>(
                      <div key={c.lbl} className="info-cell">
                        <div className="info-cell-lbl">{c.lbl}</div>
                        <div className="info-cell-val">{c.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6,marginBottom:5}}>Linked Requirements</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
                    {item.linkedReqs.map(r=><span key={r} style={{fontFamily:"monospace",fontSize:10,color:"#6366f1",background:"#f5f3ff",border:"1px solid #e0e7ff",padding:"2px 8px",borderRadius:4,fontWeight:600}}>{r}</span>)}
                  </div>
                  <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6,marginBottom:5}}>Submission Notes</div>
                  <div style={{fontSize:10.5,color:"#374151",lineHeight:1.6,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"9px 11px"}}>{item.notes}</div>
                </div>
              )}

              {dtab==="stages"&&(
                <div>
                  <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6,marginBottom:8}}>Review Stages</div>
                  {item.stages.map((s,i)=>{
                    const sm=STAGE_STATUS_META[s.status];
                    const isActive=s.status==="pending"&&(i===0||item.stages[i-1].status==="approved");
                    const isAdminStage=s.role==="Admin / Final";
                    return(
                      <div key={i} className="stage-row">
                        <div className="stage-num" style={{background:isActive?"#fffbeb":sm.bg,borderColor:sm.border,color:sm.color}}>{isActive?"◷":sm.icon}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2,flexWrap:"wrap"}}>
                            <span style={{fontSize:10.5,fontWeight:700,color:"#0f172a"}}>{s.role}</span>
                            {isAdminStage&&<span style={{fontSize:8.5,fontWeight:700,color:"#dc2626",background:"#fef2f2",border:"1px solid #fca5a5",padding:"1px 5px",borderRadius:3}}>🔑 Admin</span>}
                            <span style={{fontSize:8.5,fontWeight:700,padding:"1px 6px",borderRadius:3,background:sm.bg,color:sm.color,border:`1px solid ${sm.border}`}}>{sm.label}</span>
                            {isActive&&<span style={{fontSize:8.5,color:"#d97706",fontWeight:700}}>● Awaiting</span>}
                          </div>
                          <div style={{fontSize:10,color:"#64748b"}}>{s.person}{s.date&&` · ${s.date}`}</div>
                          {s.note&&<div style={{fontSize:10,color:"#374151",marginTop:3,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:4,padding:"4px 7px"}}>{s.note}</div>}
                          {!s.note&&s.status==="pending"&&<div style={{fontSize:9.5,color:"#cbd5e1",marginTop:2,fontStyle:"italic"}}>Awaiting review…</div>}
                        </div>
                        <div style={{fontSize:9,fontFamily:"monospace",color:"#94a3b8",flexShrink:0}}>{i+1}/{item.stages.length}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {dtab==="documents"&&(
                <div>
                  <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6,marginBottom:8}}>Attached Documents</div>
                  {item.documents.map((d,i)=>(
                    <div key={i} className="doc-row">
                      <span style={{fontSize:18,flexShrink:0}}>📄</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:10.5,fontWeight:600,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
                        <div style={{fontSize:9,color:"#94a3b8"}}>{d.type} · {d.size} · {d.date}</div>
                      </div>
                      <div style={{display:"flex",gap:5}}>
                        <button className="btn btn-ghost" style={{fontSize:9,padding:"2px 8px"}}>View</button>
                        <button className="btn btn-ghost" style={{fontSize:9,padding:"2px 8px"}}>↓</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {dtab==="history"&&(
                <div>
                  <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6,marginBottom:8}}>Approval History</div>
                  {item.history.length===0
                    ?<div style={{fontSize:10.5,color:"#94a3b8",fontStyle:"italic"}}>No actions recorded yet.</div>
                    :item.history.map((h,i)=>(
                      <div key={i} style={{display:"flex",gap:9,paddingBottom:9,marginBottom:9,borderBottom:"1px solid #f8fafc"}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:"#3b82f6",flexShrink:0,marginTop:5}}/>
                        <div>
                          <div style={{fontSize:9,fontFamily:"monospace",color:"#94a3b8",marginBottom:1}}>{h.date} · {h.user}</div>
                          <div style={{fontSize:10.5,fontWeight:700,color:"#374151"}}>{h.action}</div>
                          {h.note&&<div style={{fontSize:10,color:"#64748b",marginTop:2,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:4,padding:"3px 7px"}}>{h.note}</div>}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

            </div>

            {/* ACTION BAR */}
            <div className="appr-action-bar">
              {canActNow&&(
                <>
                  <button className="btn-appr-approve" onClick={()=>setConfirmAction({action:"approve",item})}>
                    <span>✓</span> {isFinalStage?"Final Approval — Activate SOW":"Approve & Advance"}
                  </button>
                  <button className="btn-appr-reject" onClick={()=>setConfirmAction({action:"reject",item})}>✕ Reject</button>
                  <button className="btn-appr-info"   onClick={()=>setConfirmAction({action:"info",item})}>? Request Info</button>
                  <div style={{padding:"5px 10px",background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:6,fontSize:9.5,color:"#92400e",fontWeight:600}}>
                    Stage {activeStageIdx+1}/{item.stages.length}: <strong>{item.stages[activeStageIdx]?.role}</strong>
                    {isFinalStage&&<span style={{marginLeft:6,color:"#dc2626",fontWeight:700}}>— Final Sign-off 🔑</span>}
                  </div>
                </>
              )}
              {!canActNow&&overall==="pending"&&<div style={{fontSize:10.5,color:"#94a3b8",fontStyle:"italic"}}>Awaiting earlier stage approvals before Admin can act.</div>}
              {overall==="approved"&&(
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#059669"}}>✓ Fully approved — SOW ready to activate</span>
                  <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="mail" s={10}/> Notify Client</button>
                  <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="sow"  s={10}/> Generate Countersign</button>
                </div>
              )}
              {overall==="rejected"&&(
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#dc2626"}}>✕ SOW rejected — pending resubmission</span>
                  <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="mail" s={10}/> Notify Submitter</button>
                </div>
              )}
              <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="link" s={10}/> Open SOW</button>
                <button className="btn btn-ghost" style={{fontSize:10}}><Ico n="sow"  s={10}/> Download</button>
              </div>
            </div>
          </>
        )}
      </div>

      {confirmAction&&<ApproveConfirmModal item={confirmAction.item} action={confirmAction.action} onConfirm={handleConfirm} onCancel={()=>setConfirmAction(null)}/>}
    </div>
  );
}

/* ── ROOT APP ─────────────────────────────────────────────── */
export default function App(){
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [activePage,setActivePage]=useState("dashboard");
  const [openDeal,setOpenDeal]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [deals,setDeals]=useState(DEALS);
  const [role,setRole]=useState("admin");

  const nextId=`SR-${String(Math.max(...deals.map(d=>parseInt(d.id.split("-")[1])))+1).padStart(4,"0")}`;

  const handleSaveNew=newDeal=>{
    setDeals(p=>[newDeal,...p]);
    setShowNew(false);
    setOpenDeal(newDeal);
  };

  const pageTitle={
    dashboard:"Dashboard", sales:"Sales Requirements", sow:"Statements of Work",
    sow_approval:"SOW Approvals",
    projects:"Projects", resources:"Resource Pool", delivery:"Delivery & Timesheets",
    finance:"Finance & Invoicing", monitor:"SOW Monitoring",
  };

  return(
    <>
      <style>{G}</style>
      <div className="shell">
        <Sidebar open={sidebarOpen} onToggle={()=>setSidebarOpen(p=>!p)} activePage={activePage} onNav={setActivePage}/>
        <div className="main">
          <div className="topbar">
            <div>
              <div className="tb-title">{pageTitle[activePage]||"NexusOps"}</div>
              <div className="tb-sub">NexusOps · Engagement Tracker</div>
            </div>
            <span className="tb-sep">|</span>
            <div className="search-wrap">
              <Ico n="search" s={11} c="#94a3b8"/>
              <input placeholder="Search deals, clients, SOW…" />
            </div>
            <button className="tb-btn-ghost"><Ico n="filter" s={10}/> Filters</button>
            {activePage==="sales"&&<button className="tb-btn" onClick={()=>setShowNew(true)}><Ico n="plus" s={11}/> New Requirement</button>}
          </div>
          {activePage==="dashboard"
            ? <DashboardPage role={role} onRoleChange={setRole}/>
            : activePage==="sow"
            ? <SowPage/>
            : activePage==="sow_approval"
            ? <SowApprovalPage/>
            : <MainList deals={deals} onOpenLifecycle={d=>setOpenDeal(d)}/>
          }
        </div>
      </div>
      {openDeal&&<LifecycleModal deal={openDeal} onClose={()=>setOpenDeal(null)}/>}
      {showNew&&<NewRequirementModal onClose={()=>setShowNew(false)} onSave={handleSaveNew} nextId={nextId}/>}
    </>
  );
}
