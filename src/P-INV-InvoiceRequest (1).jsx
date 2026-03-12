import { useState, useMemo } from "react";

/* ── DESIGN TOKENS ─────────────────────────────────────────────────────────── */
const C = {
  primary:"#4f46e5", primaryDk:"#3730a3", primaryLt:"#eef2ff",
  success:"#10b981", warning:"#f59e0b", danger:"#ef4444",
  teal:"#0ea5e9", purple:"#8b5cf6", amber:"#d97706",
  surface:"#fff", bg:"#f4f6fb", border:"#e2e8f0",
  text:"#0f172a", mid:"#475569", light:"#94a3b8", sidebar:"#0f172a",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');
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
  .btn-success{background:#dcfce7;color:#166534;border:none;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer;}
  .btn-danger{background:#fef2f2;color:${C.danger};border:1.5px solid #fecaca;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer;}
  .btn-amber{background:#fffbeb;color:#92400e;border:1.5px solid #fde68a;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer;}
  .card{background:#fff;border-radius:12px;border:1px solid ${C.border};}
  .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.3px;white-space:nowrap;}
  .finput{width:100%;border:1.5px solid ${C.border};border-radius:8px;padding:9px 12px;font-size:13.5px;color:${C.text};outline:none;transition:border .15s;background:#fff;}
  .finput:focus{border-color:${C.primary};box-shadow:0 0 0 3px rgba(79,70,229,.08);}
  select.finput{cursor:pointer;}
  textarea.finput{resize:vertical;min-height:72px;}
  .hover-row:hover{background:#f8fafc!important;}
  .tab-btn{padding:7px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;color:${C.mid};border:none;background:transparent;}
  .tab-btn.on{background:${C.primary};color:#fff;}
  .tab-btn:not(.on):hover{background:${C.bg};color:${C.text};}
  .modal-ov{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
  .modal-box{background:#fff;border-radius:16px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.2);}
  .stat-card{background:#fff;border-radius:12px;border:1px solid ${C.border};padding:18px 22px;flex:1;min-width:140px;}
  .section-label{font-size:11px;font-weight:700;color:${C.light};text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid ${C.border};}
  .li-row:hover{background:#f8fafc;}
  .step-dot{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;}
  .toast{position:fixed;bottom:28px;right:28px;background:#1e293b;color:#fff;padding:11px 22px;border-radius:10px;font-size:13.5px;font-weight:500;z-index:999;box-shadow:0 6px 24px rgba(0,0,0,.18);}
  .pg-btn{min-width:30px;height:30px;border-radius:6px;border:1.5px solid ${C.border};background:#fff;color:${C.mid};font-size:12.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
  .pg-btn:disabled{opacity:.35;cursor:default;}
  .pg-btn.active{background:${C.primary};border-color:${C.primary};color:#fff;font-weight:600;}
  .action-icon{padding:5px 8px;border-radius:6px;border:none;background:transparent;cursor:pointer;color:${C.mid};font-size:15px;transition:background .12s;}
  .action-icon:hover{background:#f1f5f9;color:${C.primary};}
`;

/* ── ICONS ─────────────────────────────────────────────────────────────────── */
const Ic = ({ n, s=18, c="currentColor" }) => {
  const d = {
    dashboard:<><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    invoice:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    check:<><polyline points="20 6 9 17 4 12"/></>,
    x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    eye:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    download:<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    send:<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    trash:<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    layers:<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    approval:<><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    logout:<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    dollar:<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    alert:<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    chevR:<><polyline points="9 18 15 12 9 6"/></>,
    copy:<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    trending:<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d[n]}</svg>;
};

/* ── HELPERS ────────────────────────────────────────────────────────────────── */
const fmt = v => "₹" + Number(v).toLocaleString("en-IN", { minimumFractionDigits:2, maximumFractionDigits:2 });
/* GST: intra-state → CGST + SGST (each = rate/2); inter-state → IGST (= rate) */
const calcTax = (subtotal, supplyType, gstRate) => {
  const r = parseFloat(gstRate) || 0;
  if (supplyType === "intra") {
    const each = Math.round(subtotal * (r/2) / 100 * 100) / 100;
    return { cgst:each, sgst:each, igst:0, total:each*2 };
  }
  const igst = Math.round(subtotal * r / 100 * 100) / 100;
  return { cgst:0, sgst:0, igst, total:igst };
};
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const Avatar = ({ name, sz=30, bg=C.primary }) => (
  <div style={{ width:sz, height:sz, borderRadius:"50%", background:bg, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:sz*.34, fontWeight:700, flexShrink:0 }}>
    {name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
  </div>
);

/* ── SEED DATA ──────────────────────────────────────────────────────────────── */
const INVOICES_SEED = [
  { id:"INV-2026-031", client:"BlueStar Retail",   project:"PRJ-003", sow:"SOW-2026-043", title:"BlueStar Mobile Commerce — Milestone 2", submittedBy:"Theo Vasquez", submittedDate:"2026-03-07", dueDate:"2026-04-06", status:"Under Review", paymentTerms:"Net-30", currency:"INR", ourGSTIN:"27AABCS1429B1ZX", clientGSTIN:"33AABCB5421R1ZP", placeOfSupply:"Tamil Nadu", supplyType:"inter", gstRate:18, notes:"iOS Alpha Build milestone delivery. Client sign-off received 2026-03-06.", lineItems:[{desc:"iOS Alpha Build Development",qty:1,rate:42000},{desc:"QA Automation Suite",qty:1,rate:8500},{desc:"Project Management (6 wks)",qty:6,rate:250}], steps:[{role:"Project Manager",approver:"Dana Mercer",status:"Approved",date:"2026-03-08",comment:"Milestone 2 deliverables accepted by client."},{role:"Finance Review",approver:"Priya Mehta",status:"Pending",date:null,comment:""}], activity:[{date:"2026-03-07",user:"Theo Vasquez",action:"Invoice created"},{date:"2026-03-08",user:"Dana Mercer",action:"PM approved — milestone confirmed"}] },
  { id:"INV-2026-028", client:"Meridian Holdings", project:"PRJ-002", sow:"SOW-2026-054", title:"Meridian Analytics Suite — Milestone 1", submittedBy:"Lian Zhou",   submittedDate:"2026-02-25", dueDate:"2026-03-27", status:"Paid",        paymentTerms:"Net-30", currency:"INR", ourGSTIN:"27AABCS1429B1ZX", clientGSTIN:"27AABCM3322K1ZH", placeOfSupply:"Maharashtra", supplyType:"intra", gstRate:18, notes:"Initial data pipeline and schema delivery.", lineItems:[{desc:"Data Pipeline Engineering",qty:1,rate:55000},{desc:"Schema Design & Documentation",qty:1,rate:12000},{desc:"Stakeholder Workshop",qty:2,rate:3000}], steps:[{role:"Project Manager",approver:"Tom Ashby",status:"Approved",date:"2026-02-26",comment:"M1 gates passed."},{role:"Finance Review",approver:"Priya Mehta",status:"Approved",date:"2026-02-28",comment:"Sent to AR. Payment confirmed 2026-03-25."}], activity:[{date:"2026-02-25",user:"Lian Zhou",action:"Invoice created"},{date:"2026-02-26",user:"Tom Ashby",action:"PM approved"},{date:"2026-02-28",user:"Priya Mehta",action:"Finance approved — sent to AR"},{date:"2026-03-25",user:"System",action:"Payment received — marked Paid"}] },
  { id:"INV-2026-035", client:"Nexus Corp",        project:"PRJ-001", sow:"SOW-2026-041", title:"Fintech Portal — Sprint 4 Delivery",  submittedBy:"Dana Mercer",  submittedDate:"2026-03-10", dueDate:"2026-04-09", status:"Submitted",   paymentTerms:"Net-30", currency:"INR", ourGSTIN:"27AABCS1429B1ZX", clientGSTIN:"29AABCN8812S1ZK", placeOfSupply:"Karnataka", supplyType:"inter", gstRate:18, notes:"Sprint 4 covers auth module and API gateway integration.", lineItems:[{desc:"Auth Module Development",qty:1,rate:28000},{desc:"API Gateway Integration",qty:1,rate:16000},{desc:"Security Penetration Test",qty:1,rate:9500}], steps:[{role:"Project Manager",approver:"Rachel Kim",status:"Pending",date:null,comment:""},{role:"Finance Review",approver:"Priya Mehta",status:"Pending",date:null,comment:""}], activity:[{date:"2026-03-10",user:"Dana Mercer",action:"Invoice created and submitted"}] },
  { id:"INV-2026-036", client:"Orion Financial",   project:"PRJ-004", sow:"SOW-2026-044", title:"Orion Cloud Migration — Phase 1",      submittedBy:"Dana Mercer",  submittedDate:"2026-03-11", dueDate:"2026-04-10", status:"Submitted",   paymentTerms:"Net-45", currency:"INR", ourGSTIN:"27AABCS1429B1ZX", clientGSTIN:"07AABCO6634D1ZN", placeOfSupply:"Delhi", supplyType:"inter", gstRate:12, notes:"WAF configuration and rate-limiting implementation complete.", lineItems:[{desc:"AWS WAF Configuration",qty:1,rate:14000},{desc:"Rate Limiting & DDoS Protection",qty:1,rate:7500},{desc:"Technical Documentation",qty:1,rate:3500}], steps:[{role:"Project Manager",approver:"Sam Keller",status:"Pending",date:null,comment:""},{role:"Finance Review",approver:"Priya Mehta",status:"Pending",date:null,comment:""}], activity:[{date:"2026-03-11",user:"Dana Mercer",action:"Invoice created and submitted"}] },
  { id:"INV-2026-030", client:"TrueNorth Law",     project:"PRJ-005", sow:"SOW-2026-045", title:"Compliance Audit Module — Delivery",   submittedBy:"Sam Keller",   submittedDate:"2026-02-20", dueDate:"2026-03-22", status:"Approved",    paymentTerms:"Net-30", currency:"INR", ourGSTIN:"27AABCS1429B1ZX", clientGSTIN:"22AABCT5519J1ZQ", placeOfSupply:"Chhattisgarh", supplyType:"inter", gstRate:18, notes:"SOC 2 compliance module delivered. Awaiting client PO.", lineItems:[{desc:"Compliance Module Development",qty:1,rate:48000},{desc:"Audit Trail Integration",qty:1,rate:9000},{desc:"User Training (2 sessions)",qty:2,rate:2000}], steps:[{role:"Project Manager",approver:"Lian Zhou",status:"Approved",date:"2026-02-21",comment:"All deliverables accepted."},{role:"Finance Review",approver:"Priya Mehta",status:"Approved",date:"2026-02-23",comment:"PO reference TN-PO-8821 received. Sending to AR."}], activity:[{date:"2026-02-20",user:"Sam Keller",action:"Invoice created"},{date:"2026-02-21",user:"Lian Zhou",action:"PM approved"},{date:"2026-02-23",user:"Priya Mehta",action:"Finance approved — routed to AR"}] },
  { id:"INV-2026-029", client:"Summit Energy",     project:"PRJ-006", sow:"SOW-2026-046", title:"Summit Cloud Lift — Discovery Phase",  submittedBy:"Lian Zhou",    submittedDate:"2026-02-18", dueDate:"2026-03-20", status:"Rejected",    paymentTerms:"Net-30", currency:"INR", ourGSTIN:"27AABCS1429B1ZX", clientGSTIN:"36AABCS7712M1ZV", placeOfSupply:"Telangana", supplyType:"inter", gstRate:18, notes:"Rejected — SOW still under review. Resubmit after SOW approval.", lineItems:[{desc:"Cloud Discovery Workshop",qty:3,rate:4000},{desc:"Architecture Blueprint",qty:1,rate:18000}], steps:[{role:"Project Manager",approver:"Theo Vasquez",status:"Rejected",date:"2026-02-19",comment:"SOW not yet signed. Cannot approve invoice until SOW-2026-046 is executed."},{role:"Finance Review",approver:"Priya Mehta",status:"Pending",date:null,comment:""}], activity:[{date:"2026-02-18",user:"Lian Zhou",action:"Invoice created"},{date:"2026-02-19",user:"Theo Vasquez",action:"PM rejected — SOW unsigned"}] },
  { id:"INV-2026-033", client:"Meridian Holdings", project:"PRJ-002", sow:"SOW-2026-048", title:"Predictive Analytics Engine — M1",     submittedBy:"Sam Keller",   submittedDate:"2026-03-05", dueDate:"2026-04-04", status:"Sent",        paymentTerms:"Net-30", currency:"INR", ourGSTIN:"27AABCS1429B1ZX", clientGSTIN:"27AABCM3322K1ZH", placeOfSupply:"Maharashtra", supplyType:"intra", gstRate:18, notes:"M1: ingestion pipeline and feature store. Sent to client AP.", lineItems:[{desc:"ML Feature Store Setup",qty:1,rate:32000},{desc:"Data Ingestion Pipeline",qty:1,rate:24000},{desc:"Model Registry Configuration",qty:1,rate:11000}], steps:[{role:"Project Manager",approver:"Tom Ashby",status:"Approved",date:"2026-03-06",comment:"M1 gates cleared. Good delivery."},{role:"Finance Review",approver:"Priya Mehta",status:"Approved",date:"2026-03-08",comment:"Sent to client AP team. Expected payment 2026-04-04."}], activity:[{date:"2026-03-05",user:"Sam Keller",action:"Invoice created"},{date:"2026-03-06",user:"Tom Ashby",action:"PM approved"},{date:"2026-03-08",user:"Priya Mehta",action:"Finance approved"},{date:"2026-03-09",user:"System",action:"Invoice sent to client AP"}] },
  { id:"INV-2026-037", client:"BlueStar Retail",   project:"PRJ-003", sow:"SOW-2026-043", title:"BlueStar Mobile Commerce — Milestone 3", submittedBy:"Theo Vasquez", submittedDate:"", dueDate:"", status:"Draft", paymentTerms:"Net-30", currency:"INR", ourGSTIN:"27AABCS1429B1ZX", clientGSTIN:"", placeOfSupply:"Tamil Nadu", supplyType:"inter", gstRate:18, notes:"Android build + integration testing. Not yet submitted.", lineItems:[{desc:"Android Alpha Build",qty:1,rate:38000},{desc:"Integration Testing & Bug Fix",qty:1,rate:9500},{desc:"Release Notes & Documentation",qty:1,rate:2500}], steps:[{role:"Project Manager",approver:"Dana Mercer",status:"Pending",date:null,comment:""},{role:"Finance Review",approver:"Priya Mehta",status:"Pending",date:null,comment:""}], activity:[{date:"2026-03-11",user:"Theo Vasquez",action:"Draft invoice created"}] },
];

const STATUS_META = {
  "Draft":        { bg:"#f1f5f9", c:"#475569" },
  "Submitted":    { bg:"#fef9c3", c:"#854d0e" },
  "Under Review": { bg:"#fff7ed", c:"#9a3412" },
  "Approved":     { bg:"#dcfce7", c:"#166534" },
  "Sent":         { bg:"#eff6ff", c:"#1e40af" },
  "Paid":         { bg:"#f0fdf4", c:"#15803d" },
  "Rejected":     { bg:"#fef2f2", c:"#991b1b" },
};
const STEP_META = {
  "Approved": { bg:"#dcfce7", c:"#166534", dot:"#10b981" },
  "Pending":  { bg:"#f8fafc", c:"#64748b",  dot:"#cbd5e1"  },
  "Rejected": { bg:"#fef2f2", c:"#991b1b", dot:"#ef4444" },
};
const CLIENTS  = ["All Clients","BlueStar Retail","Meridian Holdings","Nexus Corp","Orion Financial","TrueNorth Law","Summit Energy"];
const STATUSES = ["All Statuses","Draft","Submitted","Under Review","Approved","Sent","Paid","Rejected"];
const PROJECTS_REF = ["PRJ-001","PRJ-002","PRJ-003","PRJ-004","PRJ-005","PRJ-006"];
const SOWS_REF = ["SOW-2026-041","SOW-2026-043","SOW-2026-044","SOW-2026-045","SOW-2026-046","SOW-2026-048","SOW-2026-054"];
const PER_PAGE = 8;

/* ── BADGE ──────────────────────────────────────────────────────────────────── */
const Bdg = ({ status }) => {
  const s = STATUS_META[status] || { bg:"#f1f5f9", c:"#64748b" };
  return <span className="badge" style={{ background:s.bg, color:s.c }}>{status}</span>;
};

/* ── SIDEBAR ────────────────────────────────────────────────────────────────── */
const Sidebar = ({ page, setPage, pendingCount }) => {
  const nav = [
    { id:"list",     label:"Invoice Register", icon:"invoice" },
    { id:"create",   label:"New Invoice",      icon:"plus" },
    { id:"approval", label:"Approval Queue",   icon:"approval", badge: pendingCount },
    { id:"reports",  label:"Analytics",        icon:"trending" },
  ];
  return (
    <div style={{ width:220, background:C.sidebar, height:"100vh", position:"fixed", top:0, left:0, display:"flex", flexDirection:"column", zIndex:100 }}>
      <div style={{ padding:"20px 18px 14px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, background:C.primary, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ic n="layers" s={17} c="#fff"/>
          </div>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>StaffSync</div>
            <div style={{ color:C.light, fontSize:10.5 }}>Enterprise PM</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
        <div style={{ color:"rgba(255,255,255,.28)", fontSize:10, fontWeight:700, letterSpacing:".8px", textTransform:"uppercase", padding:"6px 8px 4px" }}>Invoices</div>
        {nav.map(n => (
          <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}
            style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:7, cursor:"pointer", color:page===n.id?"#fff":"rgba(255,255,255,.52)", fontSize:13.5, fontWeight:500, transition:"all .12s", marginBottom:1 }}>
            <Ic n={n.icon} s={15} c={page===n.id?"#fff":"rgba(255,255,255,.42)"}/>
            {n.label}
            {n.badge > 0 && <span style={{ marginLeft:"auto", background:C.danger, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{n.badge}</span>}
          </div>
        ))}
        <div style={{ color:"rgba(255,255,255,.28)", fontSize:10, fontWeight:700, letterSpacing:".8px", textTransform:"uppercase", padding:"16px 8px 4px" }}>Platform</div>
        {[{label:"Dashboard",icon:"dashboard"},{label:"Projects",icon:"layers"},{label:"Settings",icon:"settings"}].map(n=>(
          <div key={n.label} className="nav-item" style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:7, cursor:"pointer", color:"rgba(255,255,255,.4)", fontSize:13, marginBottom:1 }}>
            <Ic n={n.icon} s={14} c="rgba(255,255,255,.35)"/>{n.label}
          </div>
        ))}
      </nav>
      <div style={{ padding:"8px 8px 16px", borderTop:"1px solid rgba(255,255,255,.08)" }}>
        <div className="nav-item" style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:7, cursor:"pointer", color:"rgba(255,255,255,.4)", fontSize:13 }}>
          <Ic n="logout" s={14} c="rgba(255,255,255,.35)"/>Sign Out
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   P-INV-010  INVOICE LIST
══════════════════════════════════════════════════════════════════════════════ */
function InvoiceList({ invoices, onView, onNew }) {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All Statuses");
  const [clientF, setClientF] = useState("All Clients");
  const [sortCol, setSortCol] = useState("submittedDate");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(false);

  const invTotal = inv => {
    const sub = inv.lineItems.reduce((s,l)=>s+l.qty*l.rate,0);
    return sub + calcTax(sub, inv.supplyType, inv.gstRate).total;
  };

  const filtered = useMemo(() => {
    let r = invoices;
    if (search) r = r.filter(x => [x.id,x.title,x.client].some(f => f.toLowerCase().includes(search.toLowerCase())));
    if (statusF !== "All Statuses") r = r.filter(x => x.status === statusF);
    if (clientF !== "All Clients") r = r.filter(x => x.client === clientF);
    return [...r].sort((a,b) => {
      let va = a[sortCol] || "", vb = b[sortCol] || "";
      if (sortCol === "total") { va = invTotal(a); vb = invTotal(b); }
      if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
  }, [invoices, search, statusF, clientF, sortCol, sortDir]);

  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const stats = useMemo(() => {
    const total = invoices.reduce((s,i) => s + invTotal(i), 0);
    const paid = invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+invTotal(i),0);
    const pending = invoices.filter(i=>["Submitted","Under Review","Approved"].includes(i.status));
    const overdue = invoices.filter(i=>i.dueDate && i.dueDate < "2026-03-12" && !["Paid","Rejected"].includes(i.status));
    return { total, paid, pending:pending.length, pendingAmt:pending.reduce((s,i)=>s+invTotal(i),0), overdue:overdue.length };
  }, [invoices]);

  const sort = col => { if(sortCol===col) setSortDir(d=>d==="asc"?"desc":"asc"); else{setSortCol(col);setSortDir("asc");} };
  const Th = ({ col, label }) => (
    <th onClick={() => sort(col)} style={{ padding:"11px 14px", fontSize:11, fontWeight:700, color:C.light, textTransform:"uppercase", letterSpacing:".7px", textAlign:"left", cursor:"pointer", userSelect:"none", background:"#f8fafc", whiteSpace:"nowrap" }}>
      {label} {sortCol===col ? (sortDir==="asc"?"↑":"↓") : ""}
    </th>
  );

  const handleExport = () => {
    const rows = [["ID","Client","Title","Status","Submitted","Due","Total"],
      ...filtered.map(i=>[i.id,i.client,i.title,i.status,i.submittedDate,i.dueDate,i.lineItems.reduce((s,l)=>s+l.qty*l.rate,0)])];
    const csv = rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="invoices.csv"; a.click();
    setToast(true); setTimeout(()=>setToast(false),2500);
  };

  return (
    <div className="fade-in" style={{ padding:"32px 36px", maxWidth:1500, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:8, height:36, borderRadius:4, background:`linear-gradient(180deg,${C.primary},#818cf8)` }}/>
          <div>
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:700, color:C.text, letterSpacing:-.5 }}>Invoice Register</h1>
            <p style={{ color:C.light, fontSize:13.5, marginTop:3 }}>Manage billing milestones and track payment status</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-g" onClick={handleExport} style={{ display:"flex", alignItems:"center", gap:7 }}>
            <Ic n="download" s={14}/> Export CSV
          </button>
          <button className="btn-p" onClick={onNew} style={{ display:"flex", alignItems:"center", gap:7 }}>
            <Ic n="plus" s={15} c="#fff"/> New Invoice
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:"flex", gap:16, marginBottom:24, flexWrap:"wrap" }}>
        {[
          { label:"Total Invoiced", value:fmt(stats.total), icon:"dollar", color:C.primary },
          { label:"Collected (Paid)", value:fmt(stats.paid), icon:"check", color:C.success },
          { label:"Pending Approval", value:`${stats.pending} invoices`, sub:fmt(stats.pendingAmt), icon:"approval", color:C.warning },
          { label:"Overdue", value:`${stats.overdue}`, icon:"alert", color:C.danger },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:10, background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Ic n={s.icon} s={20} c={s.color}/>
            </div>
            <div>
              <div style={{ fontSize:11, color:C.light, fontWeight:600, textTransform:"uppercase", letterSpacing:.6 }}>{s.label}</div>
              <div style={{ fontSize:20, fontWeight:700, color:C.text, lineHeight:1.2 }}>{s.value}</div>
              {s.sub && <div style={{ fontSize:11, color:C.light }}>{s.sub} outstanding</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding:"14px 18px", marginBottom:18, display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ flex:1, minWidth:200, display:"flex", alignItems:"center", gap:8, background:"#f8fafc", border:`1.5px solid ${C.border}`, borderRadius:8, padding:"7px 12px" }}>
          <Ic n="search" s={14} c={C.light}/>
          <input placeholder="Search ID, client, title…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
            style={{ border:"none", outline:"none", background:"transparent", fontSize:13.5, flex:1, color:C.text }}/>
        </div>
        <select className="finput" style={{ width:160 }} value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}}>
          {STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="finput" style={{ width:170 }} value={clientF} onChange={e=>{setClientF(e.target.value);setPage(1);}}>
          {CLIENTS.map(c=><option key={c}>{c}</option>)}
        </select>
        <div style={{ color:C.light, fontSize:12.5, marginLeft:"auto" }}>{filtered.length} results</div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${C.border}` }}>
                <Th col="id" label="Invoice ID"/>
                <Th col="client" label="Client"/>
                <Th col="title" label="Description"/>
                <Th col="status" label="Status"/>
                <Th col="submittedDate" label="Submitted"/>
                <Th col="dueDate" label="Due Date"/>
                <Th col="total" label="Amount"/>
                <th style={{ padding:"11px 14px", fontSize:11, fontWeight:700, color:C.light, textTransform:"uppercase", letterSpacing:".7px", background:"#f8fafc" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={8} style={{ padding:"48px 24px", textAlign:"center", color:C.light, fontSize:14 }}>No invoices match the current filters.</td></tr>
              )}
              {paged.map(inv => {
                const total = invTotal(inv);
                const isOverdue = inv.dueDate && inv.dueDate < "2026-03-12" && !["Paid","Rejected"].includes(inv.status);
                return (
                  <tr key={inv.id} className="hover-row" style={{ borderBottom:`1px solid #f1f5f9`, cursor:"pointer" }} onClick={()=>onView(inv.id)}>
                    <td style={{ padding:"13px 14px", fontFamily:"monospace", fontSize:12, color:C.primary, fontWeight:600 }}>{inv.id}</td>
                    <td style={{ padding:"13px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <Avatar name={inv.client} sz={26} bg={["Nexus Corp","Meridian Holdings"].includes(inv.client)?"#4f46e5":"#0891b2"}/>
                        <span style={{ fontSize:13.5, fontWeight:500, color:C.text }}>{inv.client}</span>
                      </div>
                    </td>
                    <td style={{ padding:"13px 14px", maxWidth:260 }}>
                      <div style={{ fontSize:13.5, fontWeight:500, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{inv.title}</div>
                      <div style={{ fontSize:11, color:C.light, marginTop:2 }}>{inv.sow}</div>
                    </td>
                    <td style={{ padding:"13px 14px" }}><Bdg status={inv.status}/></td>
                    <td style={{ padding:"13px 14px", fontSize:13, color:C.mid, whiteSpace:"nowrap" }}>{fmtDate(inv.submittedDate)}</td>
                    <td style={{ padding:"13px 14px", fontSize:13, fontWeight:500, color:isOverdue?"#dc2626":C.mid, whiteSpace:"nowrap" }}>
                      {fmtDate(inv.dueDate)}{isOverdue&&<span style={{ fontSize:10, background:"#fef2f2", color:"#dc2626", borderRadius:4, padding:"1px 5px", marginLeft:5, fontWeight:600 }}>OVERDUE</span>}
                    </td>
                    <td style={{ padding:"13px 14px", fontWeight:700, color:C.text, whiteSpace:"nowrap" }}>{fmt(total)}</td>
                    <td style={{ padding:"13px 14px" }} onClick={e=>e.stopPropagation()}>
                      <button className="action-icon" title="View" onClick={()=>onView(inv.id)}><Ic n="eye" s={15}/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 18px", borderTop:`1px solid #f1f5f9`, background:"#fafbfc" }}>
            <span style={{ fontSize:12, color:C.light }}>Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}</span>
            <div style={{ display:"flex", gap:5 }}>
              <button className="pg-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <button key={p} className={`pg-btn${p===page?" active":""}`} onClick={()=>setPage(p)}>{p}</button>
              ))}
              <button className="pg-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
            </div>
          </div>
        )}
      </div>
      {toast && <div className="toast">✓ Exported {filtered.length} invoices to CSV</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   P-INV-020  CREATE INVOICE
══════════════════════════════════════════════════════════════════════════════ */
function CreateInvoice({ onBack, onSave }) {
  const blank = { client:"", project:"", sow:"", title:"", paymentTerms:"Net-30", currency:"INR", dueDate:"", notes:"", ourGSTIN:"27AABCS1429B1ZX", clientGSTIN:"", placeOfSupply:"Maharashtra", supplyType:"inter", gstRate:"18" };
  const [form, setForm] = useState(blank);
  const [lineItems, setLineItems] = useState([{ id:1, desc:"", qty:1, rate:0 }]);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const subtotal = lineItems.reduce((s,l)=>s+(l.qty||0)*(l.rate||0),0);
  const tax = calcTax(subtotal, form.supplyType, form.gstRate);
  const grandTotal = subtotal + tax.total;

  const updateLine = (id, k, v) => setLineItems(ls => ls.map(l => l.id===id ? {...l,[k]:k==="qty"||k==="rate"?parseFloat(v)||0:v} : l));
  const addLine = () => setLineItems(ls => [...ls, { id:Date.now(), desc:"", qty:1, rate:0 }]);
  const removeLine = id => setLineItems(ls => ls.filter(l=>l.id!==id));

  const validate = () => {
    const e = {};
    if (!form.client.trim()) e.client = "Required";
    if (!form.project.trim()) e.project = "Required";
    if (!form.title.trim()) e.title = "Required";
    if (lineItems.some(l=>!l.desc.trim())) e.lines = "All line items need a description";
    return e;
  };

  const handleSave = (asDraft=true) => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const newInv = {
      id: `INV-2026-0${Math.floor(Math.random()*900+100)}`,
      ...form, lineItems, submittedBy:"Dana Mercer",
      submittedDate: asDraft ? "" : new Date().toISOString().split("T")[0],
      status: asDraft ? "Draft" : "Submitted",
      steps:[{role:"Project Manager",approver:"Rachel Kim",status:"Pending",date:null,comment:""},{role:"Finance Review",approver:"Priya Mehta",status:"Pending",date:null,comment:""}],
      activity:[{date:new Date().toISOString().split("T")[0],user:"Dana Mercer",action:asDraft?"Draft invoice created":"Invoice created and submitted"}],
    };
    setSaved(true);
    setTimeout(()=>{ onSave(newInv); onBack(); },1200);
  };

  return (
    <div className="fade-in" style={{ padding:"32px 36px", maxWidth:1100, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:8, height:36, borderRadius:4, background:`linear-gradient(180deg,${C.primary},#818cf8)` }}/>
          <div>
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:24, fontWeight:700, color:C.text }}>New Invoice Request</h1>
            <p style={{ color:C.light, fontSize:13 }}>Create a billing milestone and route for approval</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-g" onClick={onBack}>Discard</button>
          <button className="btn-g" onClick={()=>handleSave(true)}>Save as Draft</button>
          <button className="btn-p" onClick={()=>handleSave(false)}>Submit for Approval</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20 }}>
        {/* Left col */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Billing context */}
          <div className="card" style={{ padding:22 }}>
            <div className="section-label">Billing Context</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>Client / Account *</label>
                <select className="finput" value={form.client} onChange={e=>set("client",e.target.value)} style={{ borderColor:errors.client?"#ef4444":undefined }}>
                  <option value="">Select client…</option>
                  {CLIENTS.slice(1).map(c=><option key={c}>{c}</option>)}
                </select>
                {errors.client && <div style={{ color:"#ef4444", fontSize:11.5, marginTop:3 }}>{errors.client}</div>}
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>Project *</label>
                <select className="finput" value={form.project} onChange={e=>set("project",e.target.value)} style={{ borderColor:errors.project?"#ef4444":undefined }}>
                  <option value="">Select project…</option>
                  {PROJECTS_REF.map(p=><option key={p}>{p}</option>)}
                </select>
                {errors.project && <div style={{ color:"#ef4444", fontSize:11.5, marginTop:3 }}>{errors.project}</div>}
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>Linked SOW</label>
                <select className="finput" value={form.sow} onChange={e=>set("sow",e.target.value)}>
                  <option value="">None</option>
                  {SOWS_REF.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>Invoice Title *</label>
                <input className="finput" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Project Name — Milestone 1" style={{ borderColor:errors.title?"#ef4444":undefined }}/>
                {errors.title && <div style={{ color:"#ef4444", fontSize:11.5, marginTop:3 }}>{errors.title}</div>}
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>Payment Terms</label>
                <select className="finput" value={form.paymentTerms} onChange={e=>set("paymentTerms",e.target.value)}>
                  {["Net-15","Net-30","Net-45","Net-60","Due on Receipt"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>Due Date</label>
                <input type="date" className="finput" value={form.dueDate} onChange={e=>set("dueDate",e.target.value)}/>
              </div>
            </div>
          </div>

          {/* GST Details */}
          <div className="card" style={{ padding:22 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:28, height:28, borderRadius:7, background:"#fef3c7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>₹</div>
              <div className="section-label" style={{ margin:0, padding:0, border:"none" }}>GST Details</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>Our GSTIN</label>
                <input className="finput" value={form.ourGSTIN} onChange={e=>set("ourGSTIN",e.target.value.toUpperCase())} placeholder="27AABCS1429B1ZX" maxLength={15} style={{ fontFamily:"monospace", letterSpacing:.5 }}/>
                <div style={{ fontSize:11, color:C.light, marginTop:3 }}>15-char GST Identification Number</div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>Client GSTIN</label>
                <input className="finput" value={form.clientGSTIN} onChange={e=>set("clientGSTIN",e.target.value.toUpperCase())} placeholder="Client GSTIN (if registered)" maxLength={15} style={{ fontFamily:"monospace", letterSpacing:.5 }}/>
                <div style={{ fontSize:11, color:C.light, marginTop:3 }}>Leave blank if client is unregistered</div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>Place of Supply</label>
                <select className="finput" value={form.placeOfSupply} onChange={e=>set("placeOfSupply",e.target.value)}>
                  {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>Supply Type</label>
                <div style={{ display:"flex", gap:8 }}>
                  {[["inter","Inter-state (IGST)"],["intra","Intra-state (CGST + SGST)"]].map(([val,label])=>(
                    <div key={val} onClick={()=>set("supplyType",val)}
                      style={{ flex:1, padding:"9px 12px", borderRadius:8, border:`1.5px solid ${form.supplyType===val?C.primary:C.border}`, background:form.supplyType===val?C.primaryLt:"#fff", cursor:"pointer", fontSize:13, fontWeight:form.supplyType===val?600:400, color:form.supplyType===val?C.primary:C.mid, transition:"all .12s" }}>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:5 }}>GST Rate</label>
                <select className="finput" value={form.gstRate} onChange={e=>set("gstRate",e.target.value)}>
                  {["0","5","12","18","28"].map(r=><option key={r} value={r}>{r}% GST{r==="0"?" (Exempt)":r==="18"?" (Standard)":""}</option>)}
                </select>
              </div>
              {/* Live breakdown preview */}
              <div style={{ background:"#f8fafc", borderRadius:8, padding:"10px 14px", border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:4 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.light, textTransform:"uppercase", letterSpacing:.6, marginBottom:2 }}>Tax Breakdown Preview</div>
                {form.supplyType === "intra" ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:C.mid }}>
                      <span>CGST @ {parseFloat(form.gstRate||0)/2}%</span>
                      <span style={{ fontWeight:600 }}>{fmt(tax.cgst)}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:C.mid }}>
                      <span>SGST @ {parseFloat(form.gstRate||0)/2}%</span>
                      <span style={{ fontWeight:600 }}>{fmt(tax.sgst)}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:C.mid }}>
                    <span>IGST @ {form.gstRate||0}%</span>
                    <span style={{ fontWeight:600 }}>{fmt(tax.igst)}</span>
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.text, fontWeight:700, borderTop:`1px solid ${C.border}`, paddingTop:4, marginTop:2 }}>
                  <span>Total Tax</span>
                  <span style={{ color:C.amber }}>{fmt(tax.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card" style={{ padding:22 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
              <div className="section-label" style={{ margin:0, padding:0, border:"none" }}>Line Items</div>
              <button className="btn-g" onClick={addLine} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", fontSize:12.5 }}>
                <Ic n="plus" s={12}/> Add Line
              </button>
            </div>
            {errors.lines && <div style={{ color:"#ef4444", fontSize:12, marginBottom:10 }}>{errors.lines}</div>}

            {/* Table header */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 120px 110px 36px", gap:8, marginBottom:8, padding:"0 4px" }}>
              {["Description","Qty","Rate (USD)","Amount",""].map(h=>(
                <div key={h} style={{ fontSize:11, fontWeight:700, color:C.light, textTransform:"uppercase", letterSpacing:.6 }}>{h}</div>
              ))}
            </div>

            {lineItems.map(l => (
              <div key={l.id} className="li-row" style={{ display:"grid", gridTemplateColumns:"1fr 80px 120px 110px 36px", gap:8, marginBottom:8, padding:"6px 4px", borderRadius:6 }}>
                <input className="finput" placeholder="Service description…" value={l.desc} onChange={e=>updateLine(l.id,"desc",e.target.value)} style={{ padding:"8px 10px" }}/>
                <input type="number" className="finput" value={l.qty} min={1} onChange={e=>updateLine(l.id,"qty",e.target.value)} style={{ padding:"8px 10px", textAlign:"center" }}/>
                <input type="number" className="finput" value={l.rate} min={0} onChange={e=>updateLine(l.id,"rate",e.target.value)} style={{ padding:"8px 10px" }}/>
                <div style={{ display:"flex", alignItems:"center", fontSize:13.5, fontWeight:600, color:C.text, padding:"0 4px" }}>{fmt(l.qty*l.rate)}</div>
                <button onClick={()=>removeLine(l.id)} disabled={lineItems.length===1}
                  style={{ border:"none", background:"transparent", cursor:lineItems.length===1?"not-allowed":"pointer", color:lineItems.length===1?"#cbd5e1":C.danger, display:"flex", alignItems:"center" }}>
                  <Ic n="trash" s={14}/>
                </button>
              </div>
            ))}

            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16, borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
              <div style={{ textAlign:"right", minWidth:240 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.mid, marginBottom:4 }}>
                  <span>Subtotal</span><span style={{ fontWeight:600 }}>{fmt(subtotal)}</span>
                </div>
                {form.supplyType === "intra" ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.mid, marginBottom:4 }}>
                      <span>CGST @ {parseFloat(form.gstRate||0)/2}%</span><span style={{ fontWeight:600 }}>{fmt(tax.cgst)}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.mid, marginBottom:8 }}>
                      <span>SGST @ {parseFloat(form.gstRate||0)/2}%</span><span style={{ fontWeight:600 }}>{fmt(tax.sgst)}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.mid, marginBottom:8 }}>
                    <span>IGST @ {form.gstRate||0}%</span><span style={{ fontWeight:600 }}>{fmt(tax.igst)}</span>
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", borderTop:`1.5px solid ${C.border}`, paddingTop:8 }}>
                  <span style={{ fontSize:16, fontWeight:700, color:C.text }}>Grand Total</span>
                  <span style={{ fontSize:16, fontWeight:800, color:C.primary }}>{fmt(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card" style={{ padding:22 }}>
            <div className="section-label">Notes &amp; Instructions</div>
            <textarea className="finput" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Add billing notes, milestone details, or instructions for Finance…"/>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div className="card" style={{ padding:18 }}>
            <div className="section-label">Invoice Summary</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { label:"Client", value:form.client||"—" },
                { label:"Project", value:form.project||"—" },
                { label:"SOW", value:form.sow||"None" },
                { label:"Payment Terms", value:form.paymentTerms },
                { label:"Supply Type", value:form.supplyType==="intra"?"Intra-state":"Inter-state" },
                { label:"GST Rate", value:`${form.gstRate}%` },
                { label:"Line Items", value:`${lineItems.length} item${lineItems.length!==1?"s":""}` },
              ].map(r=>(
                <div key={r.label} style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                  <span style={{ color:C.light }}>{r.label}</span>
                  <span style={{ fontWeight:500, color:C.text }}>{r.value}</span>
                </div>
              ))}
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:10, marginTop:4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:C.mid, marginBottom:4 }}>
                  <span>Subtotal</span><span>{fmt(subtotal)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:C.mid, marginBottom:6 }}>
                  <span>GST ({form.gstRate}%)</span><span>{fmt(tax.total)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", borderTop:`1px solid ${C.border}`, paddingTop:8 }}>
                  <span style={{ fontWeight:700, color:C.text }}>Grand Total</span>
                  <span style={{ fontWeight:800, fontSize:17, color:C.primary }}>{fmt(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding:18 }}>
            <div className="section-label">Approval Route</div>
            {[{role:"Project Manager",approver:"Rachel Kim"},{role:"Finance Review",approver:"Priya Mehta"}].map((s,i)=>(
              <div key={s.role} style={{ display:"flex", gap:10, marginBottom:i<1?14:0 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div className="step-dot" style={{ background:"#f1f5f9", color:C.light, fontSize:12 }}>{i+1}</div>
                  {i < 1 && <div style={{ width:2, flex:1, background:"#e2e8f0", minHeight:20, marginTop:4 }}/>}
                </div>
                <div style={{ paddingBottom:i<1?14:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{s.role}</div>
                  <div style={{ fontSize:12, color:C.light }}>{s.approver}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {saved && <div className="toast">✓ Invoice saved successfully</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   P-INV-030  INVOICE DETAIL / APPROVAL
══════════════════════════════════════════════════════════════════════════════ */
function InvoiceDetail({ invoice, onBack, onUpdate }) {
  const [tab, setTab] = useState("overview");
  const [toast, setToast] = useState("");
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [approveModal, setApproveModal] = useState(false);
  const [approveComment, setApproveComment] = useState("");

  const subtotal = invoice.lineItems.reduce((s,l)=>s+l.qty*l.rate,0);
  const tax = calcTax(subtotal, invoice.supplyType, invoice.gstRate);
  const grandTotal = subtotal + tax.total;
  const approvedSteps = invoice.steps.filter(s=>s.status==="Approved").length;
  const totalSteps = invoice.steps.length;
  const nextPending = invoice.steps.find(s=>s.status==="Pending");
  const isOverdue = invoice.dueDate && invoice.dueDate < "2026-03-12" && !["Paid","Rejected"].includes(invoice.status);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),2500); };

  const doAction = (action) => {
    const updated = {...invoice};
    const today = "2026-03-12";
    if (action === "submit") {
      updated.status = "Submitted";
      updated.submittedDate = today;
      updated.activity = [...updated.activity, {date:today,user:"Dana Mercer",action:"Invoice submitted for approval"}];
    } else if (action === "approve") {
      const stepIdx = updated.steps.findIndex(s=>s.status==="Pending");
      if (stepIdx>=0) { updated.steps[stepIdx] = {...updated.steps[stepIdx],status:"Approved",date:today,comment:approveComment}; }
      const allApproved = updated.steps.every(s=>s.status==="Approved");
      updated.status = allApproved ? "Approved" : "Under Review";
      updated.activity = [...updated.activity,{date:today,user:updated.steps[stepIdx]?.approver||"Approver",action:`${updated.steps[stepIdx]?.role} approved`+(approveComment?` — ${approveComment}`:"")}];
      setApproveModal(false); setApproveComment("");
    } else if (action === "reject") {
      const stepIdx = updated.steps.findIndex(s=>s.status==="Pending");
      if (stepIdx>=0) { updated.steps[stepIdx] = {...updated.steps[stepIdx],status:"Rejected",date:today,comment:rejectComment}; }
      updated.status = "Rejected";
      updated.activity = [...updated.activity,{date:today,user:updated.steps[stepIdx]?.approver||"Approver",action:`Rejected — ${rejectComment}`}];
      setRejectModal(false); setRejectComment("");
    } else if (action === "mark-sent") {
      updated.status = "Sent";
      updated.activity = [...updated.activity,{date:today,user:"Priya Mehta",action:"Invoice sent to client AP"}];
    } else if (action === "mark-paid") {
      updated.status = "Paid";
      updated.activity = [...updated.activity,{date:today,user:"System",action:"Payment received — marked Paid"}];
    }
    onUpdate(updated);
    showToast(`✓ Invoice ${action === "submit" ? "submitted" : action === "approve" ? "approved" : action === "reject" ? "rejected" : action === "mark-sent" ? "marked as Sent" : "marked as Paid"}`);
  };

  return (
    <div className="fade-in" style={{ padding:"32px 36px", maxWidth:1200, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <button onClick={onBack} style={{ border:"none", background:"none", cursor:"pointer", color:C.light, fontSize:13, display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
          ← Back to Register
        </button>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
              <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:22, fontWeight:700, color:C.text }}>{invoice.id}</h1>
              <Bdg status={invoice.status}/>
              {isOverdue && <span style={{ background:"#fef2f2", color:"#dc2626", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700 }}>OVERDUE</span>}
            </div>
            <div style={{ color:C.mid, fontSize:14 }}>{invoice.title}</div>
            <div style={{ color:C.light, fontSize:12.5, marginTop:4 }}>{invoice.client} · {invoice.project} · {invoice.sow}</div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {invoice.status === "Draft" && <button className="btn-p" onClick={()=>doAction("submit")}>Submit for Approval</button>}
            {["Submitted","Under Review"].includes(invoice.status) && nextPending && (
              <>
                <button className="btn-success" onClick={()=>setApproveModal(true)}>Approve</button>
                <button className="btn-danger" onClick={()=>setRejectModal(true)}>Reject</button>
              </>
            )}
            {invoice.status === "Approved" && <button className="btn-amber" onClick={()=>doAction("mark-sent")} style={{ display:"flex", alignItems:"center", gap:7 }}><Ic n="send" s={13}/>Mark as Sent</button>}
            {invoice.status === "Sent" && <button className="btn-success" onClick={()=>doAction("mark-paid")} style={{ display:"flex", alignItems:"center", gap:7 }}><Ic n="check" s={13}/>Mark as Paid</button>}
            <button className="btn-g" style={{ display:"flex", alignItems:"center", gap:7 }}><Ic n="download" s={14}/>Export PDF</button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding:"14px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ fontSize:12.5, color:C.mid, fontWeight:600, whiteSpace:"nowrap" }}>Approval Progress</div>
        <div style={{ flex:1, height:6, background:"#e2e8f0", borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${(approvedSteps/totalSteps)*100}%`, background:C.success, borderRadius:4, transition:"width .3s" }}/>
        </div>
        <div style={{ fontSize:12.5, color:C.mid, whiteSpace:"nowrap" }}>{approvedSteps}/{totalSteps} steps</div>
        {invoice.status === "Paid" && <span style={{ fontSize:13, fontWeight:700, color:C.success }}>✓ Payment Received</span>}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {["overview","line-items","approval","activity"].map(t=>(
          <button key={t} className={`tab-btn${tab===t?" on":""}`} onClick={()=>setTab(t)}>
            {t==="line-items"?"Line Items":t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div className="card" style={{ padding:22 }}>
              <div className="section-label">Invoice Details</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {[
                  {label:"Client",val:invoice.client},{label:"Project",val:invoice.project},
                  {label:"Linked SOW",val:invoice.sow||"—"},{label:"Payment Terms",val:invoice.paymentTerms},
                  {label:"Submitted By",val:invoice.submittedBy},{label:"Submitted Date",val:fmtDate(invoice.submittedDate)},
                  {label:"Due Date",val:fmtDate(invoice.dueDate)},{label:"Currency",val:invoice.currency},
                  {label:"Our GSTIN",val:invoice.ourGSTIN||"—"},{label:"Client GSTIN",val:invoice.clientGSTIN||"Unregistered"},
                  {label:"Place of Supply",val:invoice.placeOfSupply||"—"},{label:"Supply Type",val:invoice.supplyType==="intra"?"Intra-state (CGST + SGST)":"Inter-state (IGST)"},
                ].map(r=>(
                  <div key={r.label}>
                    <div style={{ fontSize:11, color:C.light, fontWeight:600, textTransform:"uppercase", letterSpacing:.5, marginBottom:3 }}>{r.label}</div>
                    <div style={{ fontSize:14, color:C.text, fontWeight:500 }}>{r.val}</div>
                  </div>
                ))}
              </div>
              {invoice.notes && (
                <div style={{ marginTop:18, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:11, color:C.light, fontWeight:600, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Notes</div>
                  <div style={{ fontSize:13.5, color:C.mid, lineHeight:1.6 }}>{invoice.notes}</div>
                </div>
              )}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div className="card" style={{ padding:18 }}>
              <div className="section-label">Amount Summary</div>
              {invoice.lineItems.map((l,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8, color:C.mid }}>
                  <span style={{ maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.desc}</span>
                  <span style={{ fontWeight:500, color:C.text }}>{fmt(l.qty*l.rate)}</span>
                </div>
              ))}
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:10, marginTop:4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:C.mid, marginBottom:4 }}>
                  <span>Subtotal</span><span style={{ fontWeight:600 }}>{fmt(subtotal)}</span>
                </div>
                {invoice.supplyType === "intra" ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:C.mid, marginBottom:4 }}>
                      <span>CGST @ {parseFloat(invoice.gstRate||0)/2}%</span><span style={{ fontWeight:600 }}>{fmt(tax.cgst)}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:C.mid, marginBottom:8 }}>
                      <span>SGST @ {parseFloat(invoice.gstRate||0)/2}%</span><span style={{ fontWeight:600 }}>{fmt(tax.sgst)}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:C.mid, marginBottom:8 }}>
                    <span>IGST @ {invoice.gstRate||0}%</span><span style={{ fontWeight:600 }}>{fmt(tax.igst)}</span>
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", borderTop:`1.5px solid ${C.border}`, paddingTop:8 }}>
                  <span style={{ fontWeight:700, fontSize:14, color:C.text }}>Grand Total</span>
                  <span style={{ fontWeight:800, fontSize:18, color:C.primary }}>{fmt(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Line Items tab */}
      {tab === "line-items" && (
        <div className="card" style={{ overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc", borderBottom:`2px solid ${C.border}` }}>
                {["#","Description","Qty","Rate","Amount"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:700, color:C.light, textTransform:"uppercase", letterSpacing:.7, textAlign:["Qty","Rate","Amount"].includes(h)?"right":"left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((l,i)=>(
                <tr key={i} className="hover-row" style={{ borderBottom:`1px solid #f1f5f9` }}>
                  <td style={{ padding:"14px 16px", color:C.light, fontSize:13 }}>{i+1}</td>
                  <td style={{ padding:"14px 16px", fontSize:14, color:C.text, fontWeight:500 }}>{l.desc}</td>
                  <td style={{ padding:"14px 16px", textAlign:"right", fontSize:14, color:C.mid }}>{l.qty}</td>
                  <td style={{ padding:"14px 16px", textAlign:"right", fontSize:14, color:C.mid }}>{fmt(l.rate)}</td>
                  <td style={{ padding:"14px 16px", textAlign:"right", fontSize:14, fontWeight:600, color:C.text }}>{fmt(l.qty*l.rate)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background:"#f8fafc", borderTop:`1px solid ${C.border}` }}>
                <td colSpan={4} style={{ padding:"10px 16px", textAlign:"right", color:C.mid, fontSize:13 }}>Subtotal</td>
                <td style={{ padding:"10px 16px", textAlign:"right", fontWeight:600, color:C.text, fontSize:13 }}>{fmt(subtotal)}</td>
              </tr>
              {invoice.supplyType === "intra" ? (
                <>
                  <tr style={{ background:"#fefce8" }}>
                    <td colSpan={4} style={{ padding:"8px 16px", textAlign:"right", color:C.amber, fontSize:13 }}>CGST @ {parseFloat(invoice.gstRate||0)/2}%</td>
                    <td style={{ padding:"8px 16px", textAlign:"right", fontWeight:600, color:C.amber, fontSize:13 }}>{fmt(tax.cgst)}</td>
                  </tr>
                  <tr style={{ background:"#fefce8" }}>
                    <td colSpan={4} style={{ padding:"8px 16px", textAlign:"right", color:C.amber, fontSize:13 }}>SGST @ {parseFloat(invoice.gstRate||0)/2}%</td>
                    <td style={{ padding:"8px 16px", textAlign:"right", fontWeight:600, color:C.amber, fontSize:13 }}>{fmt(tax.sgst)}</td>
                  </tr>
                </>
              ) : (
                <tr style={{ background:"#fefce8" }}>
                  <td colSpan={4} style={{ padding:"8px 16px", textAlign:"right", color:C.amber, fontSize:13 }}>IGST @ {invoice.gstRate||0}%</td>
                  <td style={{ padding:"8px 16px", textAlign:"right", fontWeight:600, color:C.amber, fontSize:13 }}>{fmt(tax.igst)}</td>
                </tr>
              )}
              <tr style={{ background:"#f8fafc", borderTop:`2px solid ${C.border}` }}>
                <td colSpan={4} style={{ padding:"14px 16px", textAlign:"right", fontWeight:700, color:C.text, fontSize:14 }}>Grand Total</td>
                <td style={{ padding:"14px 16px", textAlign:"right", fontWeight:800, color:C.primary, fontSize:18 }}>{fmt(grandTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Approval tab */}
      {tab === "approval" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
          <div className="card" style={{ padding:22 }}>
            <div className="section-label">Approval Chain</div>
            {invoice.steps.map((step, i) => {
              const m = STEP_META[step.status] || STEP_META["Pending"];
              return (
                <div key={i} style={{ display:"flex", gap:16, marginBottom:i<invoice.steps.length-1?0:0 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div className="step-dot" style={{ background:m.bg, color:m.c }}>
                      {step.status==="Approved"?"✓":step.status==="Rejected"?"✕":(i+1)}
                    </div>
                    {i < invoice.steps.length-1 && <div style={{ width:2, flex:1, background:"#e2e8f0", minHeight:32, marginTop:4, marginBottom:4 }}/>}
                  </div>
                  <div style={{ flex:1, paddingBottom:i<invoice.steps.length-1?20:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <span style={{ fontSize:14, fontWeight:600, color:C.text }}>{step.role}</span>
                      <span className="badge" style={{ background:m.bg, color:m.c }}>{step.status}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:step.comment?8:0 }}>
                      <Avatar name={step.approver} sz={24} bg={C.primary}/>
                      <span style={{ fontSize:13, color:C.mid }}>{step.approver}</span>
                      {step.date && <span style={{ fontSize:12, color:C.light }}>· {fmtDate(step.date)}</span>}
                    </div>
                    {step.comment && <div style={{ fontSize:13, color:C.mid, background:"#f8fafc", borderRadius:6, padding:"8px 12px", borderLeft:`3px solid ${m.dot}` }}>{step.comment}</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card" style={{ padding:18, alignSelf:"start" }}>
            <div className="section-label">Status Timeline</div>
            {[
              { label:"Created", done:true, date:invoice.activity[0]?.date },
              { label:"Submitted", done:!!invoice.submittedDate, date:invoice.submittedDate },
              { label:"PM Approved", done:invoice.steps[0]?.status==="Approved", date:invoice.steps[0]?.date },
              { label:"Finance Approved", done:invoice.steps[1]?.status==="Approved", date:invoice.steps[1]?.date },
              { label:"Sent to Client", done:["Sent","Paid"].includes(invoice.status), date:null },
              { label:"Payment Received", done:invoice.status==="Paid", date:null },
            ].map((s,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:s.done?C.success:"#e2e8f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:s.done?"#fff":"#94a3b8", fontWeight:700, flexShrink:0 }}>
                  {s.done?"✓":""}
                </div>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:13, color:s.done?C.text:C.light, fontWeight:s.done?500:400 }}>{s.label}</span>
                </div>
                {s.date && <span style={{ fontSize:11.5, color:C.light }}>{fmtDate(s.date)}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity tab */}
      {tab === "activity" && (
        <div className="card" style={{ padding:22 }}>
          <div className="section-label">Activity Log</div>
          {[...invoice.activity].reverse().map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:12, marginBottom:16, paddingBottom:16, borderBottom:i<invoice.activity.length-1?`1px solid #f1f5f9`:"none" }}>
              <Avatar name={a.user} sz={32} bg={a.user==="System"?"#64748b":C.primary}/>
              <div>
                <div style={{ fontSize:13.5, fontWeight:500, color:C.text }}>{a.action}</div>
                <div style={{ fontSize:12, color:C.light, marginTop:2 }}>{a.user} · {fmtDate(a.date)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve Modal */}
      {approveModal && (
        <div className="modal-ov" onClick={()=>setApproveModal(false)}>
          <div className="modal-box" style={{ maxWidth:480 }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:"24px 28px" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:700, color:C.text, marginBottom:6 }}>Approve Invoice</div>
              <div style={{ color:C.mid, fontSize:13, marginBottom:18 }}>Approving as <strong>{nextPending?.role}</strong> — {nextPending?.approver}</div>
              <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:6 }}>Comment (optional)</label>
              <textarea className="finput" value={approveComment} onChange={e=>setApproveComment(e.target.value)} placeholder="Add an approval comment…" style={{ minHeight:80 }}/>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
                <button className="btn-g" onClick={()=>setApproveModal(false)}>Cancel</button>
                <button className="btn-success" onClick={()=>doAction("approve")}>Confirm Approval</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="modal-ov" onClick={()=>setRejectModal(false)}>
          <div className="modal-box" style={{ maxWidth:480 }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:"24px 28px" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:700, color:"#dc2626", marginBottom:6 }}>Reject Invoice</div>
              <div style={{ color:C.mid, fontSize:13, marginBottom:18 }}>Rejecting as <strong>{nextPending?.role}</strong> — {nextPending?.approver}</div>
              <label style={{ fontSize:12, fontWeight:600, color:C.mid, display:"block", marginBottom:6 }}>Reason for rejection *</label>
              <textarea className="finput" value={rejectComment} onChange={e=>setRejectComment(e.target.value)} placeholder="Explain the reason for rejection…" style={{ minHeight:80, borderColor:"#fecaca" }}/>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
                <button className="btn-g" onClick={()=>setRejectModal(false)}>Cancel</button>
                <button className="btn-danger" onClick={()=>{ if(rejectComment.trim()) doAction("reject"); }} style={{ opacity:rejectComment.trim()?1:.5 }}>Confirm Rejection</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   P-INV-040  APPROVAL QUEUE
══════════════════════════════════════════════════════════════════════════════ */
function ApprovalQueue({ invoices, onView }) {
  const pending = invoices.filter(i => ["Submitted","Under Review"].includes(i.status));
  return (
    <div className="fade-in" style={{ padding:"32px 36px", maxWidth:1100, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
        <div style={{ width:8, height:36, borderRadius:4, background:`linear-gradient(180deg,${C.primary},#818cf8)` }}/>
        <div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:700, color:C.text }}>Approval Queue</h1>
          <p style={{ color:C.light, fontSize:13, marginTop:3 }}>{pending.length} invoice{pending.length!==1?"s":""} awaiting your action</p>
        </div>
      </div>
      {pending.length === 0 ? (
        <div className="card" style={{ padding:"60px 24px", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🎉</div>
          <div style={{ fontSize:16, fontWeight:600, color:C.text, marginBottom:6 }}>All clear!</div>
          <div style={{ fontSize:13.5, color:C.light }}>No invoices are pending approval at this time.</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {pending.map(inv => {
            const sub = inv.lineItems.reduce((s,l)=>s+l.qty*l.rate,0);
            const total = sub + calcTax(sub, inv.supplyType, inv.gstRate).total;
            const nextStep = inv.steps.find(s=>s.status==="Pending");
            const approvedCount = inv.steps.filter(s=>s.status==="Approved").length;
            return (
              <div key={inv.id} className="card" style={{ padding:20, cursor:"pointer", transition:"box-shadow .15s" }}
                onClick={()=>onView(inv.id)}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(79,70,229,.12)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
                      <span style={{ fontFamily:"monospace", fontSize:12, color:C.primary, fontWeight:700 }}>{inv.id}</span>
                      <Bdg status={inv.status}/>
                    </div>
                    <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:3 }}>{inv.title}</div>
                    <div style={{ fontSize:13, color:C.light }}>{inv.client} · {inv.sow}</div>
                    {nextStep && (
                      <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:8 }}>
                        <Avatar name={nextStep.approver} sz={22} bg={C.warning}/>
                        <span style={{ fontSize:12.5, color:C.mid }}>Awaiting <strong>{nextStep.role}</strong> — {nextStep.approver}</span>
                        <span style={{ fontSize:11, background:"#fff7ed", color:"#92400e", borderRadius:4, padding:"1px 7px", fontWeight:600 }}>Step {approvedCount+1}/{inv.steps.length}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:20, fontWeight:800, color:C.primary }}>{fmt(total)}</div>
                    <div style={{ fontSize:12, color:C.light, marginTop:2 }}>Due {fmtDate(inv.dueDate)}</div>
                    <div style={{ fontSize:12, color:C.light }}>By {inv.submittedBy}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════════════════ */
export default function InvoiceModule() {
  const [page, setPage] = useState("list");
  const [invoices, setInvoices] = useState(INVOICES_SEED);
  const [selectedId, setSelectedId] = useState(null);

  const pendingCount = invoices.filter(i=>["Submitted","Under Review"].includes(i.status)).length;
  const selectedInv = invoices.find(i=>i.id===selectedId);

  const handleView = id => { setSelectedId(id); setPage("detail"); };
  const handleUpdate = updated => setInvoices(prev => prev.map(i=>i.id===updated.id?updated:i));
  const handleNew = () => setPage("create");
  const handleSave = newInv => setInvoices(prev=>[newInv,...prev]);

  return (
    <>
      <style>{css}</style>
      <Sidebar page={["list","create","detail","reports"].includes(page)?page.replace("detail","list"):page} setPage={p=>{setSelectedId(null);setPage(p);}} pendingCount={pendingCount}/>
      <div style={{ marginLeft:220, minHeight:"100vh", background:C.bg }}>
        {page === "list"     && <InvoiceList invoices={invoices} onView={handleView} onNew={handleNew}/>}
        {page === "create"   && <CreateInvoice onBack={()=>setPage("list")} onSave={handleSave}/>}
        {page === "detail" && selectedInv && <InvoiceDetail invoice={selectedInv} onBack={()=>setPage("list")} onUpdate={handleUpdate}/>}
        {page === "approval" && <ApprovalQueue invoices={invoices} onView={handleView}/>}
        {page === "reports"  && (
          <div style={{ padding:"32px 36px", display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
            <div style={{ textAlign:"center", color:C.light }}>
              <div style={{ fontSize:32, marginBottom:12 }}>📊</div>
              <div style={{ fontSize:16, fontWeight:600, color:C.mid, marginBottom:6 }}>Invoice Analytics</div>
              <div style={{ fontSize:13.5 }}>Coming soon — revenue trends, aging reports, and client-level summaries.</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
