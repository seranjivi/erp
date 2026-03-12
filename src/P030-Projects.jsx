import { useState, useMemo } from "react";

/* ─────────────────── REFERENCE DATA (mirrors P010 / P020) ─────────────────── */
const REQUIREMENTS_REF = [
  { id:"SR-0041", title:"CRM Integration for Enterprise Tier",  client:"Nexus Corp",        salesType:"IT Services",       status:"In Review",   value:142000, owner:"Dana Mercer"  },
  { id:"SR-0042", title:"Custom Reporting Dashboard",           client:"Meridian Holdings", salesType:"Data & Analytics",  status:"Approved",    value:88500,  owner:"Lian Zhou"    },
  { id:"SR-0043", title:"White-label Mobile App",               client:"BlueStar Retail",   salesType:"Digital Services",  status:"Scoping",     value:220000, owner:"Theo Vasquez" },
  { id:"SR-0044", title:"API Gateway Configuration",            client:"Orion Financial",   salesType:"Cloud Services",    status:"Approved",    value:34000,  owner:"Dana Mercer"  },
  { id:"SR-0045", title:"Compliance Audit Module",              client:"TrueNorth Law",     salesType:"Managed Services",  status:"In Progress", value:67000,  owner:"Sam Keller"   },
  { id:"SR-0046", title:"Data Migration (Legacy to Cloud)",     client:"Summit Energy",     salesType:"IT Services",       status:"On Hold",     value:51000,  owner:"Lian Zhou"    },
  { id:"SR-0047", title:"SSO and Identity Federation",          client:"Nexus Corp",        salesType:"Contract Staffing", status:"Draft",       value:29500,  owner:"Theo Vasquez" },
  { id:"SR-0048", title:"Predictive Analytics Engine",          client:"Meridian Holdings", salesType:"Data & Analytics",  status:"In Review",   value:175000, owner:"Sam Keller"   },
  { id:"SR-0049", title:"Customer Portal Redesign",             client:"BlueStar Retail",   salesType:"Digital Services",  status:"Approved",    value:43000,  owner:"Dana Mercer"  },
  { id:"SR-0051", title:"Inventory Sync Module",                client:"Summit Energy",     salesType:"Contract Staffing", status:"Draft",       value:19000,  owner:"Sam Keller"   },
  { id:"SR-0052", title:"Multi-Currency Support",               client:"TrueNorth Law",     salesType:"Digital Services",  status:"Scoping",     value:37500,  owner:"Theo Vasquez" },
  { id:"SR-0053", title:"Real-time Notification Service",       client:"Nexus Corp",        salesType:"Managed Services",  status:"In Progress", value:55000,  owner:"Dana Mercer"  },
  { id:"SR-0054", title:"Role-Based Access Control",            client:"Meridian Holdings", salesType:"Contract Staffing", status:"Approved",    value:48000,  owner:"Lian Zhou"    },
  { id:"SR-0055", title:"Embedded BI Widgets",                  client:"BlueStar Retail",   salesType:"Data & Analytics",  status:"On Hold",     value:61000,  owner:"Sam Keller"   },
];

const SOWS_REF = [
  { id:"SOW-2026-041", title:"Nexus Digital Transformation Phase 1",             client:"Nexus Corp",        status:"Active",       value:226500 },
  { id:"SOW-2026-042", title:"Meridian Analytics Suite BI and Reporting",        client:"Meridian Holdings", status:"Active",       value:311500 },
  { id:"SOW-2026-043", title:"BlueStar Mobile Commerce App and Portal",          client:"BlueStar Retail",   status:"Approved",     value:324000 },
  { id:"SOW-2026-044", title:"Orion Financial Cloud Migration",                  client:"Orion Financial",   status:"Active",       value:34000  },
  { id:"SOW-2026-045", title:"TrueNorth Legal Ops Compliance and Currency",      client:"TrueNorth Law",     status:"Active",       value:104500 },
  { id:"SOW-2026-046", title:"Summit Energy Cloud Lift and Inventory Sync",      client:"Summit Energy",     status:"Under Review", value:70000  },
  { id:"SOW-2026-048", title:"Meridian Predictive Analytics Engine",             client:"Meridian Holdings", status:"Submitted",    value:175000 },
  { id:"SOW-2026-049", title:"BlueStar Customer Portal Redesign",                client:"BlueStar Retail",   status:"Draft",        value:43000  },
  { id:"SOW-2026-054", title:"Meridian RBAC Security Module",                    client:"Meridian Holdings", status:"Approved",     value:48000  },
];

/* ─────────────────── PROJECT DATA ─────────────────── */
const SEED_PROJECTS = [
  {
    id:"PRJ-2026-01", name:"Nexus Digital Transformation", client:"Nexus Corp",
    status:"Active", health:"On Track",
    pm:"Dana Mercer", deliveryHead:"Rachel Kim",
    startDate:"2026-02-01", endDate:"2026-12-31", created:"2026-01-08",
    budget:380000, spend:156000,
    description:"End-to-end digital transformation for Nexus Corp covering CRM integration, identity federation, and a real-time notification platform across the enterprise tier.",
    region:"North America", category:"Digital Transformation",
    linkedSOWs:["SOW-2026-041"],
    linkedRequirements:["SR-0041","SR-0047","SR-0053"],
    team:[{name:"Dana Mercer",role:"Project Manager"},{name:"Rachel Kim",role:"Delivery Head"},{name:"Theo Vasquez",role:"Tech Lead"},{name:"Lian Zhou",role:"Solution Architect"}],
    milestones:[
      {id:"M01",title:"Kickoff & Requirements Sign-off",     dueDate:"2026-02-08",status:"Done",     owner:"Dana Mercer"},
      {id:"M02",title:"CRM Connector — Dev Complete",        dueDate:"2026-03-01",status:"Done",     owner:"Rachel Kim"},
      {id:"M03",title:"SSO Integration UAT",                 dueDate:"2026-04-15",status:"In Progress",owner:"Theo Vasquez"},
      {id:"M04",title:"Notification Platform Load Test",     dueDate:"2026-05-10",status:"Upcoming", owner:"Lian Zhou"},
      {id:"M05",title:"Production Go-Live",                  dueDate:"2026-06-30",status:"Upcoming", owner:"Dana Mercer"},
    ],
    activity:[
      {date:"2026-01-08",user:"Dana Mercer",  action:"Project created",        detail:"Initial project registered from RFP submission"},
      {date:"2026-01-30",user:"Rachel Kim",   action:"SOW linked",             detail:"SOW-2026-041 attached — signed copy uploaded"},
      {date:"2026-02-01",user:"System",       action:"Status: Active",         detail:"Start date reached — project moved to Active"},
      {date:"2026-02-08",user:"Dana Mercer",  action:"Milestone completed",    detail:"M01 — Kickoff & Requirements Sign-off"},
      {date:"2026-03-01",user:"Rachel Kim",   action:"Milestone completed",    detail:"M02 — CRM Connector Dev Complete"},
      {date:"2026-03-06",user:"Theo Vasquez", action:"Comment added",          detail:"SSO UAT environment provisioned. Auth flows pending client SAML metadata."},
    ],
  },
  {
    id:"PRJ-2026-02", name:"Meridian Analytics Suite", client:"Meridian Holdings",
    status:"Active", health:"At Risk",
    pm:"Lian Zhou", deliveryHead:"Tom Ashby",
    startDate:"2026-02-15", endDate:"2026-09-30", created:"2026-01-12",
    budget:540000, spend:280000,
    description:"Comprehensive BI and analytics platform for Meridian Holdings — custom reporting dashboards, predictive analytics engine, embedded BI widgets, and RBAC security across the full data estate.",
    region:"Europe", category:"Data and Analytics",
    linkedSOWs:["SOW-2026-042","SOW-2026-048","SOW-2026-054"],
    linkedRequirements:["SR-0042","SR-0048","SR-0054","SR-0055"],
    team:[{name:"Lian Zhou",role:"Project Manager"},{name:"Tom Ashby",role:"Delivery Head"},{name:"Sam Keller",role:"Data Lead"},{name:"Dana Mercer",role:"Solutions Architect"}],
    milestones:[
      {id:"M01",title:"Data Warehouse Integration Complete", dueDate:"2026-03-01",status:"Done",        owner:"Sam Keller"},
      {id:"M02",title:"Dashboard v1 UAT Sign-off",           dueDate:"2026-03-25",status:"At Risk",     owner:"Lian Zhou"},
      {id:"M03",title:"GDPR Addendum Executed",              dueDate:"2026-04-01",status:"In Progress", owner:"Tom Ashby"},
      {id:"M04",title:"Predictive Model Accuracy SLA Review",dueDate:"2026-05-15",status:"Upcoming",   owner:"Sam Keller"},
      {id:"M05",title:"RBAC Pen Test Completion",            dueDate:"2026-06-01",status:"Upcoming",   owner:"Lian Zhou"},
    ],
    activity:[
      {date:"2026-01-12",user:"Lian Zhou",  action:"Project created",       detail:"Registered from direct engagement with Meridian procurement"},
      {date:"2026-02-15",user:"System",     action:"Status: Active",        detail:"Start date reached"},
      {date:"2026-03-01",user:"Sam Keller", action:"Milestone completed",   detail:"M01 — Data Warehouse Integration Complete"},
      {date:"2026-03-05",user:"Lian Zhou",  action:"Health: At Risk",       detail:"Dashboard UAT delayed — 3 open defects pending client data sign-off"},
      {date:"2026-03-08",user:"Tom Ashby",  action:"Comment added",         detail:"GDPR addendum sent to Meridian legal. Response expected by Mar 15."},
    ],
  },
  {
    id:"PRJ-2026-03", name:"BlueStar Mobile Commerce", client:"BlueStar Retail",
    status:"Active", health:"On Track",
    pm:"Theo Vasquez", deliveryHead:"Dana Mercer",
    startDate:"2026-03-01", endDate:"2026-10-31", created:"2026-01-15",
    budget:328000, spend:42000,
    description:"Full-stack mobile commerce initiative for BlueStar Retail — white-label iOS/Android app, customer portal redesign with WCAG 2.1 AA compliance, and embedded BI widgets for real-time sales analytics.",
    region:"APAC", category:"Digital Services",
    linkedSOWs:["SOW-2026-043","SOW-2026-049"],
    linkedRequirements:["SR-0043","SR-0049","SR-0055"],
    team:[{name:"Theo Vasquez",role:"Project Manager"},{name:"Dana Mercer",role:"Delivery Head"},{name:"Sam Keller",role:"Analytics Lead"},{name:"Rachel Kim",role:"UX Lead"}],
    milestones:[
      {id:"M01",title:"Brand Asset Delivery & Design System",dueDate:"2026-03-15",status:"Done",     owner:"Rachel Kim"},
      {id:"M02",title:"iOS Alpha Build",                      dueDate:"2026-04-15",status:"In Progress",owner:"Theo Vasquez"},
      {id:"M03",title:"Android Alpha Build",                  dueDate:"2026-04-30",status:"In Progress",owner:"Theo Vasquez"},
      {id:"M04",title:"Portal Redesign UAT",                  dueDate:"2026-05-20",status:"Upcoming", owner:"Dana Mercer"},
      {id:"M05",title:"App Store Submission",                 dueDate:"2026-05-31",status:"Upcoming", owner:"Theo Vasquez"},
    ],
    activity:[
      {date:"2026-01-15",user:"Theo Vasquez",action:"Project created",     detail:"From referral — BlueStar Mobile Commerce initiative"},
      {date:"2026-02-24",user:"Theo Vasquez",action:"SOW linked",          detail:"SOW-2026-043 executed and uploaded"},
      {date:"2026-03-01",user:"System",      action:"Status: Active",      detail:"Start date reached"},
      {date:"2026-03-15",user:"Rachel Kim",  action:"Milestone completed", detail:"M01 — Brand assets and design system delivered"},
    ],
  },
  {
    id:"PRJ-2026-04", name:"Orion Financial Cloud Migration", client:"Orion Financial",
    status:"Active", health:"On Track",
    pm:"Dana Mercer", deliveryHead:"Sam Keller",
    startDate:"2026-02-10", endDate:"2026-06-30", created:"2026-01-18",
    budget:38000, spend:12000,
    description:"Cloud migration project covering API Gateway configuration, rate limiting, WAF policies, and PCI-DSS alignment for Orion Financial's public-facing financial services endpoints.",
    region:"North America", category:"Cloud Services",
    linkedSOWs:["SOW-2026-044"],
    linkedRequirements:["SR-0044"],
    team:[{name:"Dana Mercer",role:"Project Manager"},{name:"Sam Keller",role:"Cloud Architect"},{name:"Lian Zhou",role:"DevOps Lead"}],
    milestones:[
      {id:"M01",title:"WAF Policy Legal Review",     dueDate:"2026-02-20",status:"Done",        owner:"Dana Mercer"},
      {id:"M02",title:"API Gateway Staging Deploy",  dueDate:"2026-03-10",status:"Done",        owner:"Sam Keller"},
      {id:"M03",title:"Rate Limiting Config Complete",dueDate:"2026-03-28",status:"In Progress",owner:"Lian Zhou"},
      {id:"M04",title:"Production Cutover",          dueDate:"2026-04-20",status:"Upcoming",   owner:"Dana Mercer"},
    ],
    activity:[
      {date:"2026-01-18",user:"Dana Mercer",action:"Project created",     detail:"Direct engagement from Orion Financial"},
      {date:"2026-02-07",user:"Dana Mercer",action:"SOW linked",          detail:"SOW-2026-044 signed and uploaded"},
      {date:"2026-02-10",user:"System",     action:"Status: Active",      detail:"Start date reached"},
      {date:"2026-02-20",user:"Dana Mercer",action:"Milestone completed", detail:"M01 — WAF Policy cleared legal review"},
      {date:"2026-03-10",user:"Sam Keller", action:"Milestone completed", detail:"M02 — API Gateway staging deployment validated"},
    ],
  },
  {
    id:"PRJ-2026-05", name:"TrueNorth Legal Ops", client:"TrueNorth Law",
    status:"Active", health:"Off Track",
    pm:"Sam Keller", deliveryHead:"Lian Zhou",
    startDate:"2026-02-01", endDate:"2027-01-31", created:"2026-01-22",
    budget:110000, spend:71000,
    description:"Annual managed services engagement for TrueNorth Law — compliance audit module with SOC 2 Type II e-signature support, multi-currency handling, and ongoing security operations.",
    region:"North America", category:"Managed Services",
    linkedSOWs:["SOW-2026-045"],
    linkedRequirements:["SR-0045","SR-0052"],
    team:[{name:"Sam Keller",role:"Project Manager"},{name:"Lian Zhou",role:"Compliance Lead"},{name:"Tom Ashby",role:"Security Ops"}],
    milestones:[
      {id:"M01",title:"SOC 2 Audit Trail Schema Approved", dueDate:"2026-02-10",status:"Done",     owner:"Lian Zhou"},
      {id:"M02",title:"E-Signature Legal Review Complete", dueDate:"2026-03-01",status:"At Risk",  owner:"Sam Keller"},
      {id:"M03",title:"Compliance Module Go-Live",         dueDate:"2026-03-14",status:"At Risk",  owner:"Sam Keller"},
      {id:"M04",title:"Multi-Currency UAT",                dueDate:"2026-04-30",status:"Upcoming", owner:"Lian Zhou"},
      {id:"M05",title:"Annual SLA Review Q1",              dueDate:"2026-05-01",status:"Upcoming", owner:"Sam Keller"},
    ],
    activity:[
      {date:"2026-01-22",user:"Sam Keller", action:"Project created",    detail:"From RFP — annual managed services contract"},
      {date:"2026-01-28",user:"Sam Keller", action:"SOW linked",         detail:"SOW-2026-045 signed copy uploaded"},
      {date:"2026-02-01",user:"System",     action:"Status: Active",     detail:"Start date reached"},
      {date:"2026-02-10",user:"Lian Zhou",  action:"Milestone completed",detail:"M01 — SOC 2 Audit Trail Schema Approved"},
      {date:"2026-03-05",user:"Sam Keller", action:"Health: Off Track",  detail:"E-signature legal review stalled. Overdue risk escalated. Go-live target at risk."},
    ],
  },
  {
    id:"PRJ-2026-06", name:"Summit Cloud Lift", client:"Summit Energy",
    status:"On Hold", health:"At Risk",
    pm:"Lian Zhou", deliveryHead:"Theo Vasquez",
    startDate:"2026-03-01", endDate:"2026-07-31", created:"2026-01-25",
    budget:74000, spend:8000,
    description:"Cloud infrastructure lift-and-shift and inventory sync module for Summit Energy — migrating 12 legacy databases to AWS RDS with full data validation and rollback plan.",
    region:"North America", category:"IT Services",
    linkedSOWs:["SOW-2026-046"],
    linkedRequirements:["SR-0046","SR-0051"],
    team:[{name:"Lian Zhou",role:"Project Manager"},{name:"Theo Vasquez",role:"Cloud Architect"},{name:"Sam Keller",role:"Database Lead"}],
    milestones:[
      {id:"M01",title:"Client Infra Readiness Sign-off",   dueDate:"2026-03-01",status:"At Risk",  owner:"Lian Zhou"},
      {id:"M02",title:"DB Migration Schema Design",        dueDate:"2026-03-20",status:"Upcoming", owner:"Sam Keller"},
      {id:"M03",title:"Staging Migration Complete",        dueDate:"2026-04-30",status:"Upcoming", owner:"Theo Vasquez"},
      {id:"M04",title:"Production Cutover",                dueDate:"2026-06-30",status:"Upcoming", owner:"Lian Zhou"},
    ],
    activity:[
      {date:"2026-01-25",user:"Lian Zhou",   action:"Project created",    detail:"Direct engagement — Summit Cloud Lift"},
      {date:"2026-01-26",user:"Lian Zhou",   action:"SOW registered",     detail:"SOW-2026-046 created, pending signature"},
      {date:"2026-02-10",user:"Theo Vasquez",action:"Status: On Hold",    detail:"Placed on hold — client infra readiness sign-off pending"},
    ],
  },
];

/* ─────────────────── CONSTANTS ─────────────────── */
const STATUS_META = {
  "Planning":  { color:"#94a3b8", bg:"rgba(148,163,184,0.1)", dot:"#94a3b8" },
  "Active":    { color:"#2563eb", bg:"rgba(59,130,246,0.1)",  dot:"#3b82f6" },
  "On Hold":   { color:"#ea580c", bg:"rgba(249,115,22,0.1)",  dot:"#f97316" },
  "Completed": { color:"#059669", bg:"rgba(16,185,129,0.1)",  dot:"#10b981" },
  "Cancelled": { color:"#dc2626", bg:"rgba(239,68,68,0.1)",   dot:"#ef4444" },
};
const HEALTH_META = {
  "On Track":  { color:"#059669", bg:"rgba(16,185,129,0.1)",  icon:"✓" },
  "At Risk":   { color:"#d97706", bg:"rgba(245,158,11,0.1)",  icon:"⚠" },
  "Off Track": { color:"#dc2626", bg:"rgba(239,68,68,0.1)",   icon:"✕" },
};
const MILESTONE_META = {
  "Done":        { color:"#059669", bg:"#f0fdf4", border:"#bbf7d0", icon:"✓" },
  "In Progress": { color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe", icon:"●" },
  "At Risk":     { color:"#d97706", bg:"#fffbeb", border:"#fde68a", icon:"⚠" },
  "Upcoming":    { color:"#94a3b8", bg:"#f8fafc", border:"#e2e8f0", icon:"○" },
};
const SALES_COLORS = {
  "IT Services":"#2563eb","Digital Services":"#0891b2","Data & Analytics":"#059669",
  "Managed Services":"#d97706","Cloud Services":"#4f46e5","Contract Staffing":"#8b5cf6",
};
const REQ_STATUS_DOT = {
  "Draft":"#94a3b8","Scoping":"#f59e0b","In Review":"#6366f1","Approved":"#10b981",
  "In Progress":"#3b82f6","On Hold":"#f97316","Rejected":"#ef4444",
};
const ALL_STATUSES   = ["All",...Object.keys(STATUS_META)];
const ALL_HEALTH     = ["All","On Track","At Risk","Off Track"];
const ALL_CLIENTS    = ["Nexus Corp","Meridian Holdings","BlueStar Retail","Orion Financial","TrueNorth Law","Summit Energy"];
const ALL_REGIONS    = ["North America","Europe","APAC","LATAM","MEA"];
const ALL_CATEGORIES = ["Digital Transformation","Data and Analytics","Digital Services","Cloud Services","IT Services","Managed Services","Contract Staffing","Other"];
const ALL_PMS        = ["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"];

/* ─────────────────── HELPERS ─────────────────── */
const fmt     = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
const fmtDate = d => { if(!d) return "—"; return new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); };
const avColor = n => `hsl(${((n||"").charCodeAt(0)*13)%360},50%,42%)`;
const initials = n => (n||"").split(" ").map(x=>x[0]).join("").toUpperCase();
const spendPct = (s,b) => b>0 ? Math.min(100,Math.round(s/b*100)) : 0;
const nextId   = list => { const nums=list.map(p=>parseInt(p.id.replace("PRJ-2026-",""))||0); return "PRJ-2026-"+(Math.max(0,...nums)+1).toString().padStart(2,"0"); };

/* ─────────────────── GLOBAL CSS ─────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
  .trow:hover{background:#f8faff!important}.trow:hover .row-actions{opacity:1!important}.row-actions{opacity:0;transition:opacity .15s}
  .sth{cursor:pointer;user-select:none;white-space:nowrap}.sth:hover{color:#4f46e5}
  .statc{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px 24px;flex:1;min-width:160px;transition:border .2s,box-shadow .2s;box-shadow:0 1px 4px rgba(0,0,0,.05)}
  .statc:hover{border-color:#c7d2fe;box-shadow:0 4px 16px rgba(99,102,241,.1)}
  .fi{background:#fff;border:1px solid #e2e8f0;color:#1e293b;border-radius:8px;padding:9px 12px;font-size:13px;outline:none;transition:border .15s,box-shadow .15s;width:100%}
  .fi:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}.fi::placeholder{color:#94a3b8}
  .fs{background:#fff;border:1px solid #e2e8f0;color:#374151;border-radius:8px;padding:8px 12px;font-size:13px;cursor:pointer;outline:none}
  .fs:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
  .ai{background:#f8fafc;border:1px solid #e2e8f0;color:#94a3b8;border-radius:6px;padding:4px 8px;font-size:12px;cursor:pointer;margin-left:4px;transition:all .15s}
  .ai:hover{background:#eef2ff;color:#4f46e5;border-color:#c7d2fe}
  .pb{background:#fff;border:1px solid #e2e8f0;color:#64748b;border-radius:7px;width:32px;height:32px;cursor:pointer;font-size:13px;transition:all .15s;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.04)}
  .pb:hover:not(:disabled){background:#eef2ff;color:#4f46e5;border-color:#c7d2fe}.pb:disabled{opacity:.35;cursor:not-allowed}
  .pb.on{background:#6366f1;color:#fff;border-color:#6366f1}
  .bp{background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(99,102,241,.3)}
  .bp:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.4)}
  .bg{background:#fff;border:1px solid #e2e8f0;color:#64748b;border-radius:9px;padding:9px 16px;font-size:13px;cursor:pointer;transition:all .15s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .bg:hover{background:#f8fafc;color:#1e293b;border-color:#cbd5e1}
  .bd{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;border-radius:9px;padding:9px 16px;font-size:13px;cursor:pointer;font-weight:600;transition:all .15s}
  .bd:hover{background:#fee2e2}
  .tb{background:none;border:none;padding:10px 18px;font-size:13px;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;color:#94a3b8;transition:all .15s}
  .tb.on{color:#4f46e5;border-bottom-color:#4f46e5}.tb:hover:not(.on){color:#475569}
  .sc{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .stitle{font-family:'Sora',sans-serif;font-size:12px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #f1f5f9}
  .dr{display:flex;align-items:flex-start;padding:9px 0;border-bottom:1px solid #f8fafc}
  .dl{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;min-width:140px;padding-top:2px;font-weight:600;flex-shrink:0}
  .dv{font-size:13.5px;color:#1e293b;flex:1}
  .fl{font-size:11px;color:#64748b;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.6px;font-weight:600}
  .toast{position:fixed;bottom:28px;right:28px;background:#10b981;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 8px 24px rgba(16,185,129,.35);z-index:9999;animation:sup .3s ease}
  @keyframes sup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  .mb{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fdi .2s ease}
  @keyframes fdi{from{opacity:0}to{opacity:1}}
  .mx{background:#fff;border-radius:16px;padding:32px;width:100%;max-width:640px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.2);animation:sci .2s ease}
  @keyframes sci{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
  .cb-item{border:1.5px solid #e2e8f0;border-radius:8px;padding:8px 12px;cursor:pointer;transition:all .15s;font-size:12.5px;color:#374151}
  .cb-item:hover{border-color:#c7d2fe;background:#f5f3ff}.cb-item.selected{border-color:#6366f1;background:#eef2ff;color:#4f46e5}
`;

/* ─────────────────── SHARED SHELL ─────────────────── */
function Shell({page, crumb, children}){
  return(
    <div style={{minHeight:"100vh",background:"#f4f6fb",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1e293b"}}>
      <style>{CSS}</style>
      <div style={{background:"#fff",borderBottom:"1px solid #e8ecf3",padding:"10px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 4px rgba(0,0,0,.04)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>CRM Platform</span>
          <span style={{color:"#cbd5e1"}}>›</span>
          <span style={{fontSize:12,color:"#94a3b8"}}>Projects</span>
          {crumb.map((b,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:"#cbd5e1"}}>›</span>
              <span style={{fontSize:12,color:i===crumb.length-1?"#475569":"#94a3b8",fontWeight:i===crumb.length-1?500:400}}>{b}</span>
            </span>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:11,color:"#94a3b8"}}>{page}</span>
          <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#4f46e5,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff"}}>DM</div>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─────────────────── ATOMS ─────────────────── */
function StatusBadge({status}){
  const m = STATUS_META[status]||{color:"#94a3b8",bg:"rgba(148,163,184,0.1)",dot:"#94a3b8"};
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:6,background:m.bg,color:m.color,border:`1px solid ${m.color}30`,borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:500,whiteSpace:"nowrap"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:m.dot,flexShrink:0}}/>{status}
    </span>
  );
}

function HealthBadge({health}){
  const m = HEALTH_META[health]||HEALTH_META["On Track"];
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,background:m.bg,color:m.color,border:`1px solid ${m.color}30`,borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>
      <span style={{fontSize:10}}>{m.icon}</span>{health}
    </span>
  );
}

function Avatar({name, size=26}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:avColor(name||""),display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.42,fontWeight:700,color:"#fff",flexShrink:0,border:"2px solid #fff"}}>{initials(name||"")}</div>;
}

function SortIco({col, sc, sd}){
  return <span style={{marginLeft:4,opacity:sc===col?1:0.3,fontSize:10}}>{sc===col?(sd==="asc"?"▲":"▼"):"⇅"}</span>;
}

function SpendBar({spend, budget}){
  const pct = spendPct(spend, budget);
  const color = pct>90?"#ef4444":pct>70?"#f59e0b":"#10b981";
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11,color:"#64748b"}}>
        <span>{fmt(spend)}</span><span>{pct}%</span>
      </div>
      <div style={{height:5,background:"#f1f5f9",borderRadius:4,overflow:"hidden"}}>
        <div style={{width:pct+"%",height:"100%",background:color,borderRadius:4,transition:"width .3s"}}/>
      </div>
      <div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>{fmt(budget)} budget</div>
    </div>
  );
}

/* ─────────────────── CREATE / EDIT MODAL ─────────────────── */
const BLANK_PROJECT = {
  name:"", client:"", status:"Planning", health:"On Track",
  pm:"", deliveryHead:"", startDate:"", endDate:"",
  budget:"", description:"", region:"", category:"",
  linkedSOWs:[], linkedRequirements:[],
};

function ProjectFormModal({project, onSave, onClose}){
  const editing = !!project?.id;
  const [form, setForm] = useState(editing ? {...project, budget:String(project.budget||"")} : BLANK_PROJECT);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleSOW  = id => set("linkedSOWs",  form.linkedSOWs.includes(id)  ? form.linkedSOWs.filter(x=>x!==id)  : [...form.linkedSOWs, id]);
  const toggleReq  = id => set("linkedRequirements", form.linkedRequirements.includes(id) ? form.linkedRequirements.filter(x=>x!==id) : [...form.linkedRequirements, id]);

  const validate1 = () => {
    const e={};
    if(!form.name.trim()) e.name="Project name is required.";
    if(!form.client)      e.client="Client is required.";
    if(!form.pm)          e.pm="Project Manager is required.";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleNext = () => { if(validate1()) setStep(2); };
  const handleSave = () => {
    if(!validate1()) { setStep(1); return; }
    const today = new Date().toISOString().split("T")[0];
    const saved = {
      ...form,
      id: editing ? form.id : null,
      budget: parseFloat(form.budget)||0,
      created: editing ? form.created : today,
      spend: editing ? form.spend : 0,
      team: editing ? form.team : [{name:form.pm, role:"Project Manager"}, ...(form.deliveryHead&&form.deliveryHead!==form.pm ? [{name:form.deliveryHead,role:"Delivery Head"}] : [])],
      milestones: editing ? form.milestones : [],
      activity: editing
        ? [...(form.activity||[]), {date:today,user:"Dana Mercer",action:"Project updated",detail:"Fields updated via edit form"}]
        : [{date:today,user:"Dana Mercer",action:"Project created",detail:"New project registered"}],
    };
    onSave(saved);
  };

  const clientSOWs = SOWS_REF.filter(s=>!form.client || s.client===form.client);
  const clientReqs = REQUIREMENTS_REF.filter(r=>!form.client || r.client===form.client);

  return(
    <div className="mb" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="mx">
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#4f46e5,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff"}}>◈</div>
            <div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:"#0f172a"}}>{editing?"Edit Project":"New Project"}</div>
              {editing&&<div style={{fontSize:12,color:"#94a3b8"}}>{project.id}</div>}
            </div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,color:"#94a3b8",cursor:"pointer",lineHeight:1}}>✕</button>
        </div>

        {/* Step indicators */}
        <div style={{display:"flex",gap:6,marginBottom:24}}>
          {["Project Details","Linked Resources"].map((lbl,i)=>(
            <div key={i} style={{flex:1,textAlign:"center"}}>
              <div style={{height:3,borderRadius:2,background:i+1<=step?"#6366f1":"#e2e8f0",marginBottom:6,transition:"background .2s"}}/>
              <div style={{fontSize:11,fontWeight:600,color:i+1===step?"#4f46e5":i+1<step?"#10b981":"#94a3b8",textTransform:"uppercase",letterSpacing:.5}}>{lbl}</div>
            </div>
          ))}
        </div>

        {step===1 && (
          <div style={{display:"grid",gap:16}}>
            <div>
              <label className="fl">Project Name *</label>
              <input className="fi" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Nexus Digital Transformation"/>
              {errors.name&&<div style={{fontSize:11,color:"#ef4444",marginTop:4}}>{errors.name}</div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <label className="fl">Client *</label>
                <select className="fi" value={form.client} onChange={e=>{set("client",e.target.value);set("linkedSOWs",[]);set("linkedRequirements",[]);}}>
                  <option value="">Select client…</option>
                  {ALL_CLIENTS.map(c=><option key={c}>{c}</option>)}
                </select>
                {errors.client&&<div style={{fontSize:11,color:"#ef4444",marginTop:4}}>{errors.client}</div>}
              </div>
              <div>
                <label className="fl">Region</label>
                <select className="fi" value={form.region} onChange={e=>set("region",e.target.value)}>
                  <option value="">Select region…</option>
                  {ALL_REGIONS.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <label className="fl">Status</label>
                <select className="fi" value={form.status} onChange={e=>set("status",e.target.value)}>
                  {Object.keys(STATUS_META).map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="fl">Health</label>
                <select className="fi" value={form.health} onChange={e=>set("health",e.target.value)}>
                  {Object.keys(HEALTH_META).map(h=><option key={h}>{h}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="fl">Category</label>
              <select className="fi" value={form.category} onChange={e=>set("category",e.target.value)}>
                <option value="">Select category…</option>
                {ALL_CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <label className="fl">Project Manager *</label>
                <select className="fi" value={form.pm} onChange={e=>set("pm",e.target.value)}>
                  <option value="">Select PM…</option>
                  {ALL_PMS.map(p=><option key={p}>{p}</option>)}
                </select>
                {errors.pm&&<div style={{fontSize:11,color:"#ef4444",marginTop:4}}>{errors.pm}</div>}
              </div>
              <div>
                <label className="fl">Delivery Head</label>
                <select className="fi" value={form.deliveryHead} onChange={e=>set("deliveryHead",e.target.value)}>
                  <option value="">Select delivery head…</option>
                  {ALL_PMS.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <label className="fl">Start Date</label>
                <input className="fi" type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)}/>
              </div>
              <div>
                <label className="fl">End Date</label>
                <input className="fi" type="date" value={form.endDate} onChange={e=>set("endDate",e.target.value)}/>
              </div>
            </div>
            <div>
              <label className="fl">Budget (USD)</label>
              <input className="fi" type="number" value={form.budget} onChange={e=>set("budget",e.target.value)} placeholder="e.g. 250000"/>
            </div>
            <div>
              <label className="fl">Description</label>
              <textarea className="fi" rows={3} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Brief description of project scope and objectives…" style={{resize:"vertical"}}/>
            </div>
          </div>
        )}

        {step===2 && (
          <div style={{display:"grid",gap:20}}>
            <div>
              <label className="fl" style={{marginBottom:10}}>Link SOWs {form.client&&<span style={{color:"#94a3b8",fontWeight:400,textTransform:"none",letterSpacing:0}}>— {form.client}</span>}</label>
              {clientSOWs.length===0 && <div style={{fontSize:13,color:"#94a3b8",fontStyle:"italic"}}>No SOWs found for this client.</div>}
              <div style={{display:"grid",gap:8}}>
                {clientSOWs.map(s=>{
                  const sel = form.linkedSOWs.includes(s.id);
                  const sm = {Draft:"#94a3b8",Submitted:"#f59e0b","Under Review":"#6366f1",Approved:"#10b981",Active:"#3b82f6",Expired:"#94a3b8",Terminated:"#ef4444"}[s.status]||"#94a3b8";
                  return(
                    <div key={s.id} className={"cb-item"+(sel?" selected":"")} onClick={()=>toggleSOW(s.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                          <span style={{fontSize:11,fontWeight:700,color:"#4f46e5",background:"#eef2ff",padding:"1px 7px",borderRadius:20}}>{s.id}</span>
                          <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,color:sm,fontWeight:500}}><span style={{width:5,height:5,borderRadius:"50%",background:sm,display:"inline-block"}}/>{s.status}</span>
                        </div>
                        <div style={{fontSize:12.5,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div>
                      </div>
                      <div style={{width:20,height:20,borderRadius:5,border:"2px solid "+(sel?"#6366f1":"#d1d5db"),background:sel?"#6366f1":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                        {sel&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="fl" style={{marginBottom:10}}>Link Requirements {form.client&&<span style={{color:"#94a3b8",fontWeight:400,textTransform:"none",letterSpacing:0}}>— {form.client}</span>}</label>
              {clientReqs.length===0 && <div style={{fontSize:13,color:"#94a3b8",fontStyle:"italic"}}>No requirements found for this client.</div>}
              <div style={{display:"grid",gap:8}}>
                {clientReqs.map(r=>{
                  const sel = form.linkedRequirements.includes(r.id);
                  const rc = SALES_COLORS[r.salesType]||"#6366f1";
                  return(
                    <div key={r.id} className={"cb-item"+(sel?" selected":"")} onClick={()=>toggleReq(r.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
                          <span style={{fontSize:11,fontWeight:700,color:"#4f46e5",background:"#eef2ff",padding:"1px 7px",borderRadius:20}}>{r.id}</span>
                          <span style={{background:rc+"12",color:rc,border:"1px solid "+rc+"30",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:600}}>{r.salesType}</span>
                        </div>
                        <div style={{fontSize:12.5,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.title}</div>
                      </div>
                      <div style={{width:20,height:20,borderRadius:5,border:"2px solid "+(sel?"#6366f1":"#d1d5db"),background:sel?"#6366f1":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                        {sel&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:24,paddingTop:20,borderTop:"1px solid #f1f5f9"}}>
          <button className="bg" onClick={onClose}>Cancel</button>
          <div style={{display:"flex",gap:10}}>
            {step===2 && <button className="bg" onClick={()=>setStep(1)}>← Back</button>}
            {step===1  ? <button className="bp" onClick={handleNext}>Next →</button>
                       : <button className="bp" onClick={handleSave}>{editing?"Save Changes":"Create Project"}</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── DELETE CONFIRM ─────────────────── */
function DeleteModal({project, onConfirm, onClose}){
  return(
    <div className="mb" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="mx" style={{maxWidth:440}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{width:36,height:36,borderRadius:10,background:"#fef2f2",border:"1px solid #fecaca",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚠</div>
          <div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:"#dc2626"}}>Delete Project</div>
            <div style={{fontSize:12,color:"#94a3b8"}}>{project.id}</div>
          </div>
        </div>
        <p style={{fontSize:13.5,color:"#475569",lineHeight:1.65,marginBottom:20}}>
          Are you sure you want to delete <strong>{project.name}</strong>? This will remove the project and all linked milestones and activity. This action cannot be undone.
        </p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button className="bg" onClick={onClose}>Cancel</button>
          <button className="bd" onClick={()=>onConfirm(project.id)}>Delete Project</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   P-030  PROJECT LIST
══════════════════════════════════════════════════════ */
function ProjectList({projects, onCreate, onView, onEdit, onDelete}){
  const [search, setSearch] = useState("");
  const [sf, setSf]         = useState("All");
  const [hf, setHf]         = useState("All");
  const [cf, setCf]         = useState("All");
  const [sc, setSc]         = useState("id");
  const [sd, setSd]         = useState("asc");
  const [page, setPage]     = useState(1);
  const PER = 8;

  const doSort = col => { if(sc===col) setSd(d=>d==="asc"?"desc":"asc"); else{setSc(col);setSd("asc");} };

  const filtered = useMemo(()=>{
    let r = projects;
    if(search) r = r.filter(x=>[x.id,x.name,x.client,x.pm,x.category].some(f=>(f||"").toLowerCase().includes(search.toLowerCase())));
    if(sf!=="All") r = r.filter(x=>x.status===sf);
    if(hf!=="All") r = r.filter(x=>x.health===hf);
    if(cf!=="All") r = r.filter(x=>x.client===cf);
    return [...r].sort((a,b)=>{
      let va=a[sc], vb=b[sc];
      if(typeof va==="string"){va=va.toLowerCase();vb=(vb||"").toLowerCase();}
      return sd==="asc"?(va>vb?1:-1):(va<vb?1:-1);
    });
  },[projects,search,sf,hf,cf,sc,sd]);

  const paged = filtered.slice((page-1)*PER, page*PER);
  const pages = Math.max(1, Math.ceil(filtered.length/PER));

  const stats = useMemo(()=>({
    total:     projects.length,
    active:    projects.filter(p=>p.status==="Active").length,
    atRisk:    projects.filter(p=>p.health==="At Risk"||p.health==="Off Track").length,
    onTrack:   projects.filter(p=>p.health==="On Track"&&p.status==="Active").length,
    budget:    projects.reduce((a,p)=>a+p.budget,0),
    spend:     projects.reduce((a,p)=>a+p.spend,0),
  }),[projects]);

  const pageNums = Array.from({length:pages},(_,i)=>i+1)
    .filter(p=>p===1||p===pages||Math.abs(p-page)<=1)
    .reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[]);

  const clients = useMemo(()=>["All",...Array.from(new Set(projects.map(p=>p.client))).sort()],[projects]);

  const doExport = () => {
    const hdr = ["Project ID","Name","Client","Status","Health","PM","Delivery Head","Start","End","Budget","Spend","Region","Category"];
    const data = filtered.map(p=>[p.id,p.name,p.client,p.status,p.health,p.pm,p.deliveryHead,p.startDate||"—",p.endDate||"—",p.budget,p.spend,p.region,p.category]);
    const csv = [hdr,...data].map(r=>r.map(c=>'"'+c+'"').join(",")).join("\n");
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="project-register.csv"; a.click();
  };

  return(
    <Shell page="P-030" crumb={["Project Register"]}>
      <div style={{padding:"32px 36px",maxWidth:1500,margin:"0 auto"}}>
        {/* Page header */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <div style={{width:8,height:32,borderRadius:4,background:"linear-gradient(180deg,#4f46e5,#818cf8)"}}/>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:700,color:"#0f172a",letterSpacing:-0.5}}>Project Register</h1>
            </div>
            <p style={{fontSize:13.5,color:"#64748b",marginLeft:18}}>Track all active and upcoming projects — health, budget, SOWs, and linked requirements in one view.</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="bg" onClick={doExport}>↓ Export CSV</button>
            <button className="bp" onClick={onCreate}>+ New Project</button>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
          {[
            {l:"Total Projects",  v:stats.total,          s:"All time",          a:"#6366f1"},
            {l:"Active",          v:stats.active,         s:"Running now",       a:"#3b82f6"},
            {l:"Needs Attention", v:stats.atRisk,         s:"At Risk / Off Track",a:"#ef4444"},
            {l:"On Track",        v:stats.onTrack,        s:"Active & healthy",  a:"#10b981"},
            {l:"Total Budget",    v:fmt(stats.budget),    s:"All projects",      a:"#8b5cf6", lg:true},
            {l:"Total Spend",     v:fmt(stats.spend),     s:spendPct(stats.spend,stats.budget)+"%  of budget",a:"#059669",lg:true},
          ].map((s,i)=>(
            <div key={i} className="statc" style={{borderLeft:"3px solid "+s.a}}>
              <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>{s.l}</div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:s.lg?20:28,fontWeight:700,color:"#0f172a",marginBottom:4}}>{s.v}</div>
              <div style={{fontSize:11,color:s.a}}>{s.s}</div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"14px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:14,pointerEvents:"none"}}>⌕</span>
            <input className="fi" style={{width:260,paddingLeft:34}} placeholder="Search ID, name, client, PM…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
          </div>
          <select className="fs" value={sf} onChange={e=>{setSf(e.target.value);setPage(1);}}>
            {ALL_STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select className="fs" value={hf} onChange={e=>{setHf(e.target.value);setPage(1);}}>
            {ALL_HEALTH.map(h=><option key={h}>{h}</option>)}
          </select>
          <select className="fs" value={cf} onChange={e=>{setCf(e.target.value);setPage(1);}}>
            {clients.map(c=><option key={c}>{c}</option>)}
          </select>
          {(search||sf!=="All"||hf!=="All"||cf!=="All")&&
            <button style={{background:"none",border:"none",color:"#6366f1",fontSize:12,cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setSearch("");setSf("All");setHf("All");setCf("All");setPage(1);}}>Clear</button>}
          <div style={{marginLeft:"auto",fontSize:12,color:"#94a3b8"}}>{filtered.length} of {projects.length} projects</div>
        </div>

        {/* Table */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,.05)"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"#f8fafc",borderBottom:"1px solid #e8ecf3"}}>
                  {[["id","Project ID"],["name","Name"],["client","Client"],["status","Status"],["health","Health"],["pm","PM"],["startDate","Start"],["endDate","End"]].map(([col,lbl])=>(
                    <th key={col} className="sth" style={{padding:"13px 14px",textAlign:"left",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,fontWeight:600}} onClick={()=>doSort(col)}>
                      {lbl}<SortIco col={col} sc={sc} sd={sd}/>
                    </th>
                  ))}
                  <th style={{padding:"13px 14px",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,fontWeight:600}}>Budget / Spend</th>
                  <th style={{padding:"13px 14px",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,fontWeight:600}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length===0
                  ? <tr><td colSpan={10} style={{padding:60,textAlign:"center",color:"#94a3b8"}}><div style={{fontSize:32,marginBottom:10}}>◌</div>No projects match.</td></tr>
                  : paged.map(p=>(
                    <tr key={p.id} className="trow" style={{borderBottom:"1px solid #f1f5f9",cursor:"pointer"}} onClick={()=>onView(p)}>
                      <td style={{padding:"13px 14px",whiteSpace:"nowrap"}}>
                        <span style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:"#4f46e5",background:"#eef2ff",padding:"3px 10px",borderRadius:20}}>{p.id}</span>
                      </td>
                      <td style={{padding:"13px 14px",maxWidth:220}}>
                        <div style={{fontWeight:500,color:"#0f172a",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                        <div style={{fontSize:11,color:"#94a3b8"}}>{p.category||"—"}</div>
                      </td>
                      <td style={{padding:"13px 14px",fontSize:13,color:"#374151",whiteSpace:"nowrap"}}>{p.client}</td>
                      <td style={{padding:"13px 14px"}}><StatusBadge status={p.status}/></td>
                      <td style={{padding:"13px 14px"}}><HealthBadge health={p.health}/></td>
                      <td style={{padding:"13px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <Avatar name={p.pm} size={24}/>
                          <span style={{fontSize:12.5,color:"#374151"}}>{p.pm}</span>
                        </div>
                      </td>
                      <td style={{padding:"13px 14px",fontSize:12.5,color:"#64748b",whiteSpace:"nowrap"}}>{fmtDate(p.startDate)}</td>
                      <td style={{padding:"13px 14px",fontSize:12.5,color:"#64748b",whiteSpace:"nowrap"}}>{fmtDate(p.endDate)}</td>
                      <td style={{padding:"13px 14px",minWidth:160}}>
                        <div style={{marginBottom:4,display:"flex",justifyContent:"space-between",fontSize:11,color:"#64748b"}}>
                          <span>{fmt(p.spend)}</span>
                          <span style={{color:spendPct(p.spend,p.budget)>90?"#ef4444":spendPct(p.spend,p.budget)>70?"#f59e0b":"#10b981",fontWeight:600}}>{spendPct(p.spend,p.budget)}%</span>
                        </div>
                        <div style={{height:4,background:"#f1f5f9",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:spendPct(p.spend,p.budget)+"%",height:"100%",background:spendPct(p.spend,p.budget)>90?"#ef4444":spendPct(p.spend,p.budget)>70?"#f59e0b":"#10b981",borderRadius:3}}/>
                        </div>
                        <div style={{fontSize:10.5,color:"#94a3b8",marginTop:3}}>{fmt(p.budget)} budget</div>
                      </td>
                      <td style={{padding:"13px 14px"}}>
                        <div className="row-actions" style={{display:"flex"}}>
                          <button className="ai" onClick={e=>{e.stopPropagation();onView(p);}}>View</button>
                          <button className="ai" onClick={e=>{e.stopPropagation();onEdit(p);}}>Edit</button>
                          <button className="ai" style={{color:"#ef4444",borderColor:"#fecaca",background:"#fef2f2"}} onClick={e=>{e.stopPropagation();onDelete(p);}}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{padding:"14px 20px",borderTop:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <span style={{fontSize:12,color:"#94a3b8"}}>
              {filtered.length===0?"No results":
               `${(page-1)*PER+1}–${Math.min(page*PER,filtered.length)} of ${filtered.length} project${filtered.length!==1?"s":""}`}
            </span>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <button className="pb" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
              {pageNums.map((p,i)=>
                p==="…"
                  ? <span key={"e"+i} style={{padding:"0 4px",color:"#94a3b8",fontSize:13}}>…</span>
                  : <button key={p} className={"pb"+(p===page?" on":"")} onClick={()=>setPage(p)}>{p}</button>
              )}
              <button className="pb" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>›</button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════
   P-031  PROJECT DETAIL
══════════════════════════════════════════════════════ */
function ProjectDetail({project:init, onBack, onEdit}){
  const [project, setProject] = useState(init);
  const [tab, setTab]         = useState("overview");
  const [toast, setToast]     = useState(null);
  const showToast = (msg,c="#10b981")=>{ setToast({msg,c}); setTimeout(()=>setToast(null),2800); };

  const linkedSOWs = SOWS_REF.filter(s=>project.linkedSOWs.includes(s.id));
  const linkedReqs = REQUIREMENTS_REF.filter(r=>project.linkedRequirements.includes(r.id));
  const totalReqVal = linkedReqs.reduce((a,r)=>a+r.value,0);
  const totalSOWVal = linkedSOWs.reduce((a,s)=>a+s.value,0);
  const pct = spendPct(project.spend, project.budget);
  const doneMs  = (project.milestones||[]).filter(m=>m.status==="Done").length;
  const totalMs = (project.milestones||[]).length;

  const toggleMilestone = (id, newStatus) => {
    const today = new Date().toISOString().split("T")[0];
    setProject(p=>({
      ...p,
      milestones: p.milestones.map(m=>m.id===id?{...m,status:newStatus}:m),
      activity: [...p.activity, {date:today,user:"Dana Mercer",action:"Milestone updated",detail:p.milestones.find(m=>m.id===id)?.title+" → "+newStatus}],
    }));
    showToast("Milestone updated");
  };

  const hm = HEALTH_META[project.health]||HEALTH_META["On Track"];
  const sm = STATUS_META[project.status]||{};

  return(
    <Shell page="P-031" crumb={["Project Register", project.id]}>
      <div style={{padding:"28px 36px",maxWidth:1200,margin:"0 auto"}}>

        {/* Detail header */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <button className="bg" onClick={onBack} style={{padding:"8px 14px",fontSize:13,marginTop:4,flexShrink:0}}>← Back</button>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:"#4f46e5",background:"#eef2ff",padding:"3px 10px",borderRadius:20}}>{project.id}</span>
                <StatusBadge status={project.status}/>
                <HealthBadge health={project.health}/>
                {project.region&&<span style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#64748b"}}>{project.region}</span>}
                {project.category&&<span style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#64748b"}}>{project.category}</span>}
              </div>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a",lineHeight:1.3,maxWidth:680}}>{project.name}</h1>
              <p style={{fontSize:13,color:"#64748b",marginTop:4}}>{project.client}</p>
            </div>
          </div>
          <button className="bp" onClick={()=>onEdit(project)} style={{marginTop:4,flexShrink:0}}>✎ Edit Project</button>
        </div>

        {/* Health alert */}
        {project.health==="Off Track"&&(
          <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#991b1b",marginBottom:16}}>
            <span style={{fontSize:18}}>⚠</span>
            <div><strong>Project is Off Track.</strong> Review milestones and activity log — immediate action may be required.</div>
          </div>
        )}
        {project.health==="At Risk"&&(
          <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#92400e",marginBottom:16}}>
            <span style={{fontSize:18}}>⏰</span>
            <div><strong>Project is At Risk.</strong> One or more milestones require attention.</div>
          </div>
        )}

        {/* KPI strip */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
          {[
            {l:"Budget",    v:fmt(project.budget),    s:"Total allocated",      a:"#8b5cf6"},
            {l:"Spend",     v:fmt(project.spend),     s:pct+"% utilized",       a:pct>90?"#ef4444":pct>70?"#f59e0b":"#10b981"},
            {l:"Milestones",v:`${doneMs} / ${totalMs}`,s:"completed",           a:"#3b82f6"},
            {l:"Linked SOWs",v:linkedSOWs.length,    s:fmt(totalSOWVal)+" value",a:"#059669"},
          ].map((k,i)=>(
            <div key={i} className="sc" style={{margin:0,padding:"16px 20px",borderLeft:"3px solid "+k.a}}>
              <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,marginBottom:6}}>{k.l}</div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:2}}>{k.v}</div>
              <div style={{fontSize:11,color:k.a}}>{k.s}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{borderBottom:"1px solid #e2e8f0",marginBottom:20,display:"flex"}}>
          {[
            ["overview",  "Overview"],
            ["milestones","Milestones ("+(project.milestones||[]).length+")"],
            ["sows",      "SOWs ("+linkedSOWs.length+")"],
            ["reqs",      "Requirements ("+linkedReqs.length+")"],
            ["activity",  "Activity ("+(project.activity||[]).length+")"],
          ].map(([k,lbl])=>(
            <button key={k} className={"tb"+(tab===k?" on":"")} onClick={()=>setTab(k)}>{lbl}</button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
          {/* Main panel */}
          <div>
            {/* ─ OVERVIEW ─ */}
            {tab==="overview"&&(<>
              {project.description&&(
                <div className="sc">
                  <div className="stitle">About This Project</div>
                  <p style={{fontSize:13.5,color:"#475569",lineHeight:1.75}}>{project.description}</p>
                </div>
              )}
              <div className="sc">
                <div className="stitle">Project Details</div>
                {[
                  ["Client",       project.client||"—"],
                  ["Category",     project.category||"—"],
                  ["Region",       project.region||"—"],
                  ["PM",           project.pm||"—"],
                  ["Delivery Head",project.deliveryHead||"—"],
                  ["Start Date",   fmtDate(project.startDate)],
                  ["End Date",     fmtDate(project.endDate)],
                  ["Created",      fmtDate(project.created)],
                ].map(([l,v])=>(
                  <div key={l} className="dr"><span className="dl">{l}</span><span className="dv">{v}</span></div>
                ))}
              </div>
              <div className="sc">
                <div className="stitle">Budget Utilisation</div>
                <SpendBar spend={project.spend} budget={project.budget}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}>
                  {[
                    {l:"Total Budget",  v:fmt(project.budget), a:"#8b5cf6"},
                    {l:"Spend to Date", v:fmt(project.spend),  a:pct>90?"#ef4444":pct>70?"#f59e0b":"#10b981"},
                    {l:"Remaining",     v:fmt(project.budget-project.spend), a:"#64748b"},
                    {l:"Utilisation",   v:pct+"%", a:pct>90?"#ef4444":pct>70?"#f59e0b":"#10b981"},
                  ].map((k,i)=>(
                    <div key={i} style={{background:"#f8fafc",border:"1px solid #f1f5f9",borderRadius:10,padding:"12px 14px"}}>
                      <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6,marginBottom:4}}>{k.l}</div>
                      <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:k.a}}>{k.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>)}

            {/* ─ MILESTONES ─ */}
            {tab==="milestones"&&(
              <div className="sc">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>
                  <span className="stitle" style={{margin:0,padding:0,border:"none"}}>Milestones</span>
                  <span style={{fontSize:12,color:"#94a3b8"}}>{doneMs} of {totalMs} complete</span>
                </div>
                {(project.milestones||[]).length===0&&<p style={{fontSize:13,color:"#94a3b8"}}>No milestones added yet.</p>}
                {(project.milestones||[]).map((m,i,arr)=>{
                  const mm = MILESTONE_META[m.status]||MILESTONE_META["Upcoming"];
                  return(
                    <div key={m.id} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,width:36}}>
                        <div style={{width:32,height:32,borderRadius:"50%",background:mm.bg,border:"2px solid "+mm.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:mm.color,fontWeight:700,boxShadow:m.status==="In Progress"?"0 0 0 3px "+mm.border:"none"}}>
                          {mm.icon}
                        </div>
                        {i<arr.length-1&&<div style={{width:2,height:36,background:"#f1f5f9",margin:"4px auto"}}/>}
                      </div>
                      <div style={{paddingBottom:20,flex:1}}>
                        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:4}}>
                          <div>
                            <div style={{fontSize:13.5,fontWeight:600,color:"#0f172a",marginBottom:2}}>{m.title}</div>
                            <div style={{fontSize:11.5,color:"#94a3b8"}}>Due {fmtDate(m.dueDate)} · {m.owner}</div>
                          </div>
                          <div style={{display:"flex",gap:5,flexShrink:0}}>
                            {m.status!=="Done"&&(
                              <button className="ai" style={{opacity:1,color:"#059669",border:"1px solid #bbf7d0",background:"#f0fdf4",padding:"4px 9px",fontSize:11}} onClick={()=>toggleMilestone(m.id,"Done")}>✓ Mark Done</button>
                            )}
                            {m.status==="Upcoming"&&(
                              <button className="ai" style={{opacity:1,padding:"4px 9px",fontSize:11}} onClick={()=>toggleMilestone(m.id,"In Progress")}>Start</button>
                            )}
                            {m.status==="In Progress"&&(
                              <button className="ai" style={{opacity:1,color:"#d97706",border:"1px solid #fde68a",background:"#fffbeb",padding:"4px 9px",fontSize:11}} onClick={()=>toggleMilestone(m.id,"At Risk")}>⚠ At Risk</button>
                            )}
                          </div>
                        </div>
                        <span style={{display:"inline-flex",alignItems:"center",gap:5,background:mm.bg,color:mm.color,border:"1px solid "+mm.border,borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:600}}>
                          {mm.icon} {m.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {doneMs>0&&totalMs>0&&(
                  <div style={{borderTop:"1px solid #f1f5f9",paddingTop:14,marginTop:4}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#64748b",marginBottom:6}}>
                      <span>Progress</span><span style={{fontWeight:600,color:"#0f172a"}}>{Math.round(doneMs/totalMs*100)}%</span>
                    </div>
                    <div style={{height:6,background:"#f1f5f9",borderRadius:4,overflow:"hidden"}}>
                      <div style={{width:Math.round(doneMs/totalMs*100)+"%",height:"100%",background:"#10b981",borderRadius:4,transition:"width .3s"}}/>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─ SOWs ─ */}
            {tab==="sows"&&(
              <div className="sc">
                <div className="stitle">Linked Statements of Work</div>
                {linkedSOWs.length===0&&<p style={{fontSize:13,color:"#94a3b8"}}>No SOWs linked to this project.</p>}
                {linkedSOWs.map(s=>{
                  const sdot={Draft:"#94a3b8",Submitted:"#f59e0b","Under Review":"#6366f1",Approved:"#10b981",Active:"#3b82f6",Expired:"#94a3b8",Terminated:"#ef4444"}[s.status]||"#94a3b8";
                  const sbg ={Draft:"rgba(148,163,184,0.1)",Submitted:"rgba(245,158,11,0.1)","Under Review":"rgba(99,102,241,0.1)",Approved:"rgba(16,185,129,0.1)",Active:"rgba(59,130,246,0.1)",Expired:"rgba(148,163,184,0.1)",Terminated:"rgba(239,68,68,0.1)"}[s.status]||"rgba(148,163,184,0.1)";
                  return(
                    <div key={s.id} style={{background:"#fafbfc",border:"1px solid #e8ecf3",borderRadius:10,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                          <span style={{fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:700,color:"#4f46e5",background:"#eef2ff",padding:"2px 8px",borderRadius:20}}>{s.id}</span>
                          <span style={{display:"inline-flex",alignItems:"center",gap:5,background:sbg,color:sdot,border:`1px solid ${sdot}30`,borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:500}}><span style={{width:5,height:5,borderRadius:"50%",background:sdot}}/>{s.status}</span>
                        </div>
                        <div style={{fontSize:13.5,fontWeight:500,color:"#0f172a",marginBottom:2}}>{s.title}</div>
                        <div style={{fontSize:12,color:"#94a3b8"}}>{s.client}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:"#1e293b"}}>{fmt(s.value)}</div>
                        <div style={{fontSize:11,color:"#94a3b8"}}>contract value</div>
                      </div>
                    </div>
                  );
                })}
                {linkedSOWs.length>0&&(
                  <div style={{borderTop:"1px solid #f1f5f9",paddingTop:14,marginTop:4,display:"flex",justifyContent:"flex-end",alignItems:"center",gap:12}}>
                    <span style={{fontSize:12,color:"#94a3b8"}}>{linkedSOWs.length} SOW{linkedSOWs.length!==1?"s":""} · Combined</span>
                    <span style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:"#059669"}}>{fmt(totalSOWVal)}</span>
                  </div>
                )}
              </div>
            )}

            {/* ─ REQUIREMENTS ─ */}
            {tab==="reqs"&&(
              <div className="sc">
                <div className="stitle">Linked Requirements</div>
                {linkedReqs.length===0&&<p style={{fontSize:13,color:"#94a3b8"}}>No requirements linked to this project.</p>}
                {linkedReqs.map(r=>{
                  const rc = SALES_COLORS[r.salesType]||"#6366f1";
                  const rdot = REQ_STATUS_DOT[r.status]||"#94a3b8";
                  return(
                    <div key={r.id} style={{background:"#fafbfc",border:"1px solid #e8ecf3",borderRadius:10,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                          <span style={{fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:700,color:"#4f46e5",background:"#eef2ff",padding:"2px 8px",borderRadius:20}}>{r.id}</span>
                          <span style={{background:rc+"12",color:rc,border:"1px solid "+rc+"30",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:600}}>{r.salesType}</span>
                          <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,color:rdot,fontWeight:500}}><span style={{width:5,height:5,borderRadius:"50%",background:rdot,display:"inline-block"}}/>{r.status}</span>
                        </div>
                        <div style={{fontSize:13.5,fontWeight:500,color:"#0f172a",marginBottom:2}}>{r.title}</div>
                        <div style={{fontSize:12,color:"#94a3b8"}}>{r.client} · {r.owner}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:"#1e293b"}}>{fmt(r.value)}</div>
                        <div style={{fontSize:11,color:"#94a3b8"}}>est. value</div>
                      </div>
                    </div>
                  );
                })}
                {linkedReqs.length>0&&(
                  <div style={{borderTop:"1px solid #f1f5f9",paddingTop:14,marginTop:4,display:"flex",justifyContent:"flex-end",alignItems:"center",gap:12}}>
                    <span style={{fontSize:12,color:"#94a3b8"}}>{linkedReqs.length} requirement{linkedReqs.length!==1?"s":""} · Combined</span>
                    <span style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:"#059669"}}>{fmt(totalReqVal)}</span>
                  </div>
                )}
              </div>
            )}

            {/* ─ ACTIVITY ─ */}
            {tab==="activity"&&(
              <div className="sc">
                <div className="stitle">Activity Log</div>
                {[...(project.activity||[])].reverse().map((e,i,arr)=>(
                  <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,width:18}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:i===0?"#6366f1":"#e2e8f0",border:"2px solid "+(i===0?"#6366f1":"#cbd5e1"),marginTop:3}}/>
                      {i<arr.length-1&&<div style={{width:2,height:36,background:"#f1f5f9",margin:"3px auto"}}/>}
                    </div>
                    <div style={{paddingBottom:18,flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                        <span style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{e.action}</span>
                        <span style={{fontSize:11,color:"#94a3b8"}}>· {fmtDate(e.date)}</span>
                      </div>
                      <div style={{fontSize:12.5,color:"#64748b"}}>{e.detail}</div>
                      <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>by {e.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sc">
              <div className="stitle">Summary</div>
              <div className="dr" style={{flexDirection:"column",gap:6,alignItems:"flex-start"}}>
                <span className="dl">Status</span><StatusBadge status={project.status}/>
              </div>
              <div className="dr" style={{flexDirection:"column",gap:6,alignItems:"flex-start"}}>
                <span className="dl">Health</span><HealthBadge health={project.health}/>
              </div>
              {[
                ["Client",        project.client||"—"],
                ["Start",         fmtDate(project.startDate)],
                ["End",           fmtDate(project.endDate)],
                ["Budget",        fmt(project.budget)],
                ["Spend",         fmt(project.spend)+" ("+pct+"%)"],
                ["SOWs",          linkedSOWs.length+" linked"],
                ["Requirements",  linkedReqs.length+" linked"],
              ].map(([l,v])=>(
                <div key={l} className="dr"><span className="dl">{l}</span><span className="dv" style={{fontSize:13}}>{v}</span></div>
              ))}
            </div>

            <div className="sc">
              <div className="stitle">Project Team</div>
              {(project.team||[]).map(m=>(
                <div key={m.name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f8fafc"}}>
                  <Avatar name={m.name} size={32}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:500,color:"#0f172a"}}>{m.name}</div>
                    <div style={{fontSize:11,color:"#94a3b8"}}>{m.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {totalMs>0&&(
              <div className="sc">
                <div className="stitle">Milestone Progress</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:13,color:"#64748b"}}>{doneMs} of {totalMs} complete</span>
                  <span style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:"#10b981"}}>{Math.round(doneMs/totalMs*100)}%</span>
                </div>
                <div style={{height:8,background:"#f1f5f9",borderRadius:4,overflow:"hidden",marginBottom:12}}>
                  <div style={{width:Math.round(doneMs/totalMs*100)+"%",height:"100%",background:"#10b981",borderRadius:4,transition:"width .4s"}}/>
                </div>
                {(project.milestones||[]).map(m=>{
                  const mm = MILESTONE_META[m.status]||MILESTONE_META["Upcoming"];
                  return(
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid #f8fafc"}}>
                      <span style={{fontSize:11,color:mm.color,fontWeight:700,width:14,textAlign:"center",flexShrink:0}}>{mm.icon}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.title}</div>
                        <div style={{fontSize:10.5,color:"#94a3b8"}}>{fmtDate(m.dueDate)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {toast&&<div className="toast" style={{background:toast.c}}>{toast.msg}</div>}
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT — STATE ROUTER
══════════════════════════════════════════════════════ */
export default function App(){
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [view,  setView]  = useState("list");   // "list" | "detail"
  const [sel,   setSel]   = useState(null);
  const [modal, setModal] = useState(null);     // null | {mode:"create"|"edit", project?}
  const [delTgt,setDelTgt]= useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (msg,c="#10b981")=>{ setToast({msg,c}); setTimeout(()=>setToast(null),2800); };

  const handleSave = saved => {
    if(saved.id){
      // edit
      setProjects(ps=>ps.map(p=>p.id===saved.id?saved:p));
      if(sel?.id===saved.id){ setSel(saved); }
      showToast("Project updated — "+saved.name);
    } else {
      // create
      const newId = nextId(projects);
      const created = {...saved, id:newId};
      setProjects(ps=>[...ps,created]);
      showToast("Project created — "+newId,"#6366f1");
    }
    setModal(null);
  };

  const handleDelete = id => {
    setProjects(ps=>ps.filter(p=>p.id!==id));
    setDelTgt(null);
    if(sel?.id===id){ setView("list"); setSel(null); }
    showToast("Project deleted","#ef4444");
  };

  return(
    <>
      {view==="list"&&(
        <ProjectList
          projects={projects}
          onCreate={()=>setModal({mode:"create"})}
          onView={p=>{setSel(p);setView("detail");}}
          onEdit={p=>setModal({mode:"edit",project:p})}
          onDelete={p=>setDelTgt(p)}
        />
      )}
      {view==="detail"&&sel&&(
        <ProjectDetail
          project={projects.find(p=>p.id===sel.id)||sel}
          onBack={()=>setView("list")}
          onEdit={p=>setModal({mode:"edit",project:p})}
        />
      )}
      {modal&&(
        <ProjectFormModal
          project={modal.mode==="edit"?modal.project:null}
          onSave={handleSave}
          onClose={()=>setModal(null)}
        />
      )}
      {delTgt&&(
        <DeleteModal
          project={delTgt}
          onConfirm={handleDelete}
          onClose={()=>setDelTgt(null)}
        />
      )}
      {toast&&<div className="toast" style={{background:toast.c,position:"fixed",bottom:28,right:28,color:"#fff",padding:"12px 20px",borderRadius:10,fontSize:13,fontWeight:500,boxShadow:"0 8px 24px rgba(0,0,0,.2)",zIndex:9999,animation:"sup .3s ease"}}>{toast.msg}</div>}
    </>
  );
}
