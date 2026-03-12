import { useState, useMemo } from "react";

/* ─────────────────── GLOBAL CSS ─────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body,input,select,textarea,button{font-family:'DM Sans','Segoe UI',sans-serif}
::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
.trow:hover{background:#f8faff!important}.trow:hover .row-act{opacity:1!important}.row-act{opacity:0;transition:opacity .15s}
.sort-th{cursor:pointer;user-select:none;white-space:nowrap}.sort-th:hover{color:#4f46e5}
.stat-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px 22px;flex:1;min-width:148px;box-shadow:0 1px 4px rgba(0,0,0,.05);transition:all .2s}
.stat-card:hover{border-color:#c7d2fe;box-shadow:0 4px 16px rgba(99,102,241,.1)}
.fsel{background:#fff;border:1px solid #e2e8f0;color:#374151;border-radius:8px;padding:8px 12px;font-size:13px;cursor:pointer;outline:none;width:100%}
.fsel:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
.finput{background:#fff;border:1px solid #e2e8f0;color:#1e293b;border-radius:8px;padding:9px 12px;font-size:13px;outline:none;transition:border .15s,box-shadow .15s;width:100%}
.finput:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}.finput::placeholder{color:#94a3b8}
.btn-primary{background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(99,102,241,.3)}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.4)}
.btn-ghost{background:#fff;border:1px solid #e2e8f0;color:#64748b;border-radius:9px;padding:9px 16px;font-size:13px;cursor:pointer;transition:all .15s}
.btn-ghost:hover{background:#f8fafc;color:#1e293b;border-color:#cbd5e1}
.section-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:22px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.section-title{font-family:'Sora',sans-serif;font-size:11px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #f1f5f9}
.field-label{font-size:11px;color:#64748b;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.6px;font-weight:600}
.skill-tag{display:inline-flex;align-items:center;gap:5px;background:#eef2ff;color:#4f46e5;border:1px solid #c7d2fe;border-radius:20px;padding:4px 10px;font-size:12px;font-weight:500;margin:3px}
.skill-remove{cursor:pointer;opacity:.5;font-size:11px}.skill-remove:hover{opacity:1}
.filter-chip{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:5px 12px;font-size:12px;color:#64748b;cursor:pointer;transition:all .12s;white-space:nowrap}
.filter-chip:hover{border-color:#c7d2fe;color:#4f46e5}.filter-chip.active{background:#eef2ff;border-color:#c7d2fe;color:#4f46e5;font-weight:600}
.overlay{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(2px)}
.modal{background:#fff;border-radius:16px;width:100%;max-width:720px;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 32px 80px rgba(0,0,0,.25);overflow:hidden}
.toast{position:fixed;bottom:24px;right:24px;background:#10b981;color:#fff;padding:11px 18px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 8px 24px rgba(16,185,129,.3);z-index:9999;animation:slideup .3s ease}
@keyframes slideup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.util-bar{height:6px;border-radius:3px;background:#e2e8f0;overflow:hidden;flex-shrink:0}
.util-fill{height:100%;border-radius:3px;transition:width .3s}
.drawer-panel{position:fixed;right:0;top:0;bottom:0;width:430px;background:#fff;border-left:1px solid #e2e8f0;z-index:400;display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.1);animation:slideInR .2s ease;overflow:hidden}
.drawer-backdrop{position:fixed;inset:0;z-index:399;background:rgba(15,23,42,.18)}
@keyframes slideInR{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
.alloc-row{display:grid;grid-template-columns:1fr 70px 112px 112px 30px;gap:8px;align-items:end;padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:6px}
.alloc-row:hover{border-color:#c7d2fe}
.info-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:12px;color:#64748b;margin-top:6px;line-height:1.5}
.seg-btn{flex:1;padding:9px 0;border-radius:8px;border:2px solid #e2e8f0;background:#fff;color:#64748b;font-weight:600;font-size:12.5px;cursor:pointer;transition:all .15s;text-align:center}
.seg-btn.on{border-color:#6366f1;background:#eef2ff;color:#4f46e5}
`;

/* ─────────────────── CONSTANTS ─────────────────── */
const DEPTS       = ["Engineering","Delivery","Analytics","Design","DevOps","Cloud","Security","Project Management","Sales","HR","Finance"];
const SKILLS_POOL = ["React","Node.js","Python","Java","SQL","AWS","Azure","GCP","Terraform","Docker","Kubernetes","Salesforce","SAP","Power BI","Tableau","Scrum","PMP","ITIL","ServiceNow","Agile","ETL","Machine Learning","Cybersecurity","REST API","GraphQL","TypeScript","DevSecOps","Data Engineering","UX Design","Business Analysis"];
const EMP_BASIS   = ["Permanent","Fixed-Term Contract","Part-Time"];
const ENG_MODELS  = ["Direct Employee","Staffing Agency","Independent Contractor","Consulting Firm","Vendor / Subcontractor"];
const RES_SCOPES  = ["Client-Facing","Internal Projects","Overhead / Support","Bench"];
const CURRENCIES  = ["USD","EUR","GBP","CAD","AUD","SGD","INR"];

const SEED_PROJECTS = [
  {id:"PRJ-001",name:"Nexus Digital Transformation"},
  {id:"PRJ-002",name:"Meridian Analytics Suite"},
  {id:"PRJ-003",name:"BlueStar Mobile Commerce"},
  {id:"PRJ-004",name:"Orion Cloud Migration"},
  {id:"PRJ-005",name:"TrueNorth Legal Ops"},
  {id:"PRJ-006",name:"Summit Cloud Lift"},
  {id:"PRJ-007",name:"Internal IT Infrastructure Upgrade"},
  {id:"PRJ-008",name:"Data Platform Modernisation"},
  {id:"PRJ-009",name:"HR System Migration"},
  {id:"PRJ-010",name:"Cloud Cost Optimisation Program"},
  {id:"PRJ-011",name:"Security Compliance Rollout"},
  {id:"PRJ-012",name:"Nexus Legal Ops Phase 2"},
];

/* ─────────────────── SEED USERS ─────────────────── */
const SEED_USERS = [
  { id:"USR-001", firstName:"Rachel",  lastName:"Kim",      email:"rachel.kim@nexusops.com",    phone:"+1 415-222-1001", employeeId:"EMP-1001", jobTitle:"Senior Delivery Manager",  department:"Delivery",           reportsTo:"",        location:"San Francisco, CA, USA", workModel:"Hybrid",  employmentBasis:"Permanent",          engagementModel:"Direct Employee",        resourceScope:"Client-Facing",      startDate:"2022-03-01", contractEnd:"",           billabilityType:"Billable",     billingRate:145, costRate:95,  currency:"USD", billableFrom:"2026-01-01", billableUntil:"2026-12-31", allocations:[{id:"a1",projectId:"PRJ-001",projectName:"Nexus Digital Transformation",allocationPct:60,from:"2026-01-01",until:"2026-12-31"},{id:"a2",projectId:"PRJ-005",projectName:"TrueNorth Legal Ops",allocationPct:27,from:"2026-02-01",until:"2026-06-30"}], status:"Active",     accessRole:"Manager", skills:["Scrum","PMP","Agile","Salesforce"] },
  { id:"USR-002", firstName:"Tom",     lastName:"Ashby",    email:"tom.ashby@nexusops.com",     phone:"+1 415-222-1002", employeeId:"EMP-1002", jobTitle:"Data & BI Lead",            department:"Analytics",          reportsTo:"USR-001", location:"Austin, TX, USA",        workModel:"Remote",  employmentBasis:"Permanent",          engagementModel:"Direct Employee",        resourceScope:"Client-Facing",      startDate:"2021-07-15", contractEnd:"",           billabilityType:"Billable",     billingRate:165, costRate:108, currency:"USD", billableFrom:"2026-01-01", billableUntil:"2026-09-30", allocations:[{id:"a3",projectId:"PRJ-002",projectName:"Meridian Analytics Suite",allocationPct:100,from:"2026-01-01",until:"2026-09-30"}], status:"Active",     accessRole:"Manager", skills:["Power BI","Tableau","SQL","Python","ETL"] },
  { id:"USR-003", firstName:"Dana",    lastName:"Mercer",   email:"dana.mercer@nexusops.com",   phone:"+1 415-222-1003", employeeId:"EMP-1003", jobTitle:"Cloud Solutions Architect", department:"Cloud",              reportsTo:"",        location:"Seattle, WA, USA",       workModel:"Hybrid",  employmentBasis:"Permanent",          engagementModel:"Direct Employee",        resourceScope:"Client-Facing",      startDate:"2020-11-01", contractEnd:"",           billabilityType:"Billable",     billingRate:195, costRate:125, currency:"USD", billableFrom:"2026-02-01", billableUntil:"2026-11-30", allocations:[{id:"a4",projectId:"PRJ-004",projectName:"Orion Cloud Migration",allocationPct:50,from:"2026-02-01",until:"2026-09-30"},{id:"a5",projectId:"PRJ-010",projectName:"Cloud Cost Optimisation Program",allocationPct:22,from:"2026-02-01",until:"2026-07-31"}], status:"Active",     accessRole:"Manager", skills:["AWS","Terraform","Kubernetes","Docker","DevSecOps"] },
  { id:"USR-004", firstName:"Sam",     lastName:"Keller",   email:"sam.keller@nexusops.com",    phone:"+1 415-222-1004", employeeId:"EMP-1004", jobTitle:"IT Solutions Consultant",   department:"Engineering",        reportsTo:"USR-003", location:"Chicago, IL, USA",       workModel:"Onsite",  employmentBasis:"Permanent",          engagementModel:"Direct Employee",        resourceScope:"Client-Facing",      startDate:"2023-01-10", contractEnd:"",           billabilityType:"Billable",     billingRate:135, costRate:85,  currency:"USD", billableFrom:"2026-01-15", billableUntil:"2026-12-31", allocations:[{id:"a6",projectId:"PRJ-005",projectName:"TrueNorth Legal Ops",allocationPct:65,from:"2026-01-15",until:"2026-12-31"}], status:"Active",     accessRole:"Member",  skills:["ITIL","ServiceNow","REST API","Agile"] },
  { id:"USR-005", firstName:"Lian",    lastName:"Zhou",     email:"lian.zhou@nexusops.com",     phone:"+1 415-222-1005", employeeId:"EMP-1005", jobTitle:"ML & Data Engineer",        department:"Analytics",          reportsTo:"USR-002", location:"New York, NY, USA",      workModel:"Remote",  employmentBasis:"Permanent",          engagementModel:"Direct Employee",        resourceScope:"Client-Facing",      startDate:"2022-09-05", contractEnd:"",           billabilityType:"Billable",     billingRate:178, costRate:115, currency:"USD", billableFrom:"2026-01-01", billableUntil:"2026-08-31", allocations:[{id:"a7",projectId:"PRJ-006",projectName:"Summit Cloud Lift",allocationPct:60,from:"2026-01-01",until:"2026-08-31"},{id:"a8",projectId:"PRJ-008",projectName:"Data Platform Modernisation",allocationPct:30,from:"2026-01-01",until:"2026-06-30"}], status:"Active",     accessRole:"Member",  skills:["Python","Machine Learning","ETL","Data Engineering","AWS"] },
  { id:"USR-006", firstName:"Theo",    lastName:"Vasquez",  email:"theo.vasquez@nexusops.com",  phone:"+1 415-222-1006", employeeId:"EMP-1006", jobTitle:"UX / UI Design Lead",       department:"Design",             reportsTo:"USR-001", location:"Los Angeles, CA, USA",   workModel:"Hybrid",  employmentBasis:"Permanent",          engagementModel:"Direct Employee",        resourceScope:"Client-Facing",      startDate:"2021-04-20", contractEnd:"",           billabilityType:"Billable",     billingRate:155, costRate:98,  currency:"USD", billableFrom:"2026-03-01", billableUntil:"2026-12-31", allocations:[{id:"a9",projectId:"PRJ-003",projectName:"BlueStar Mobile Commerce",allocationPct:78,from:"2026-03-01",until:"2026-12-31"}], status:"Active",     accessRole:"Member",  skills:["UX Design","React","TypeScript","GraphQL"] },
  { id:"USR-007", firstName:"Maya",    lastName:"Patel",    email:"maya.patel@nexusops.com",    phone:"+1 415-222-1007", employeeId:"CON-2001", jobTitle:"DevOps Engineer",            department:"DevOps",             reportsTo:"USR-003", location:"Remote",                 workModel:"Remote",  employmentBasis:"Fixed-Term Contract", engagementModel:"Independent Contractor", resourceScope:"Client-Facing",      startDate:"2025-10-01", contractEnd:"2026-04-30", billabilityType:"Billable",     billingRate:185, costRate:185, currency:"USD", billableFrom:"2025-10-01", billableUntil:"2026-04-30", allocations:[{id:"a10",projectId:"PRJ-001",projectName:"Nexus Digital Transformation",allocationPct:100,from:"2025-10-01",until:"2026-04-30"}], status:"Active",     accessRole:"Member",  skills:["Docker","Kubernetes","Terraform","AWS"] },
  { id:"USR-008", firstName:"James",   lastName:"Okafor",   email:"james.okafor@nexusops.com",  phone:"+1 415-222-1008", employeeId:"CON-2002", jobTitle:"Security Engineer",          department:"Security",           reportsTo:"USR-004", location:"Washington DC, USA",     workModel:"Onsite",  employmentBasis:"Fixed-Term Contract", engagementModel:"Consulting Firm",        resourceScope:"Client-Facing",      startDate:"2026-01-15", contractEnd:"2026-07-14", billabilityType:"Billable",     billingRate:210, costRate:210, currency:"USD", billableFrom:"2026-01-15", billableUntil:"2026-07-14", allocations:[{id:"a11",projectId:"PRJ-011",projectName:"Security Compliance Rollout",allocationPct:60,from:"2026-01-15",until:"2026-07-14"},{id:"a12",projectId:"PRJ-001",projectName:"Nexus Digital Transformation",allocationPct:35,from:"2026-02-01",until:"2026-07-14"}], status:"Active",     accessRole:"Member",  skills:["Cybersecurity","ITIL","Python"] },
  { id:"USR-009", firstName:"Priya",   lastName:"Nair",     email:"priya.nair@nexusops.com",    phone:"+1 415-222-1009", employeeId:"CON-2003", jobTitle:"Business Analyst",           department:"Delivery",           reportsTo:"USR-001", location:"Remote",                 workModel:"Remote",  employmentBasis:"Fixed-Term Contract", engagementModel:"Staffing Agency",        resourceScope:"Client-Facing",      startDate:"2025-12-01", contractEnd:"2026-05-31", billabilityType:"Partial",      billingRate:120, costRate:120, currency:"USD", billableFrom:"2025-12-01", billableUntil:"2026-05-31", allocations:[{id:"a13",projectId:"PRJ-005",projectName:"TrueNorth Legal Ops",allocationPct:55,from:"2025-12-01",until:"2026-05-31"}], status:"Active",     accessRole:"Member",  skills:["Business Analysis","Agile","Salesforce","SQL"] },
  { id:"USR-010", firstName:"Carlos",  lastName:"Reyes",    email:"carlos.reyes@nexusops.com",  phone:"+1 415-222-1010", employeeId:"EMP-1010", jobTitle:"Project Manager",            department:"Project Management", reportsTo:"USR-001", location:"Miami, FL, USA",         workModel:"Hybrid",  employmentBasis:"Permanent",          engagementModel:"Direct Employee",        resourceScope:"Internal Projects",  startDate:"2023-06-01", contractEnd:"",           billabilityType:"Non-Billable", billingRate:0,   costRate:82,  currency:"USD", billableFrom:"",           billableUntil:"",           allocations:[{id:"a14",projectId:"PRJ-007",projectName:"Internal IT Infrastructure Upgrade",allocationPct:30,from:"2026-01-01",until:"2026-12-31"}], status:"Active",     accessRole:"Member",  skills:["PMP","Scrum","Agile","Business Analysis"] },
  { id:"USR-011", firstName:"Nina",    lastName:"Bergmann", email:"nina.bergmann@nexusops.com", phone:"+49 30-222-1011", employeeId:"EMP-1011", jobTitle:"HR Business Partner",       department:"HR",                 reportsTo:"",        location:"Berlin, Germany",        workModel:"Hybrid",  employmentBasis:"Permanent",          engagementModel:"Direct Employee",        resourceScope:"Overhead / Support", startDate:"2021-08-01", contractEnd:"",           billabilityType:"Non-Billable", billingRate:0,   costRate:75,  currency:"EUR", billableFrom:"",           billableUntil:"",           allocations:[], status:"On Leave",    accessRole:"Viewer",  skills:["ITIL","Agile"] },
  { id:"USR-012", firstName:"Felix",   lastName:"Hsu",      email:"felix.hsu@nexusops.com",     phone:"+1 415-222-1012", employeeId:"EMP-1012", jobTitle:"Full Stack Engineer",        department:"Engineering",        reportsTo:"USR-004", location:"Toronto, Canada",        workModel:"Remote",  employmentBasis:"Permanent",          engagementModel:"Direct Employee",        resourceScope:"Bench",              startDate:"2024-02-01", contractEnd:"",           billabilityType:"Billable",     billingRate:138, costRate:90,  currency:"CAD", billableFrom:"2026-04-01", billableUntil:"2026-12-31", allocations:[], status:"Active",     accessRole:"Member",  skills:["React","Node.js","TypeScript","SQL","REST API"] },
  { id:"USR-013", firstName:"Sophie",  lastName:"Laurent",  email:"sophie.laurent@nexusops.com",phone:"+33 1-222-1013",  employeeId:"EMP-1013", jobTitle:"PMO Analyst",                department:"Project Management", reportsTo:"USR-010", location:"Paris, France",          workModel:"Hybrid",  employmentBasis:"Part-Time",          engagementModel:"Direct Employee",        resourceScope:"Overhead / Support", startDate:"2025-01-15", contractEnd:"",           billabilityType:"Non-Billable", billingRate:0,   costRate:70,  currency:"EUR", billableFrom:"",           billableUntil:"",           allocations:[], status:"Offboarding", accessRole:"Viewer",  skills:["Business Analysis","PMP"] },
];

/* ─────────────────── HELPERS ─────────────────── */
function daysLeft(d){if(!d)return null;return Math.ceil((new Date(d)-new Date())/86400000);}
const AVC=["#4f46e5","#0891b2","#059669","#d97706","#dc2626","#7c3aed","#db2777","#0284c7","#65a30d"];
function avColor(n){let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))%AVC.length;return AVC[h];}
function totalAlloc(allocs){return(allocs||[]).reduce((s,a)=>s+Number(a.allocationPct),0);}

/* ─────────────────── UI PRIMITIVES ─────────────────── */
function Avatar({name,size=32}){
  const ini=name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return <div style={{width:size,height:size,borderRadius:"50%",background:avColor(name),display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.35,fontWeight:700,color:"#fff",flexShrink:0}}>{ini}</div>;
}

const BADGE_STYLES={
  billable:{background:"#ecfdf5",color:"#059669",border:"1px solid #a7f3d0"},
  "non-billable":{background:"#f1f5f9",color:"#64748b",border:"1px solid #e2e8f0"},
  partial:{background:"#fffbeb",color:"#d97706",border:"1px solid #fde68a"},
  "direct employee":{background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe"},
  "staffing agency":{background:"#faf5ff",color:"#7c3aed",border:"1px solid #e9d5ff"},
  "independent contractor":{background:"#fff7ed",color:"#ea580c",border:"1px solid #fed7aa"},
  "consulting firm":{background:"#fdf4ff",color:"#9333ea",border:"1px solid #f0abfc"},
  "vendor / subcontractor":{background:"#fefce8",color:"#ca8a04",border:"1px solid #fde68a"},
  active:{background:"#ecfdf5",color:"#059669",border:"1px solid #a7f3d0"},
  inactive:{background:"#f1f5f9",color:"#94a3b8",border:"1px solid #e2e8f0"},
  onleave:{background:"#fffbeb",color:"#d97706",border:"1px solid #fde68a"},
  offboarding:{background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca"},
  admin:{background:"#faf5ff",color:"#7c3aed",border:"1px solid #e9d5ff"},
  manager:{background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe"},
  member:{background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0"},
  viewer:{background:"#f8fafc",color:"#94a3b8",border:"1px solid #e2e8f0"},
  "client-facing":{background:"#eef2ff",color:"#4f46e5",border:"1px solid #c7d2fe"},
  "internal projects":{background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0"},
  "overhead / support":{background:"#f8fafc",color:"#64748b",border:"1px solid #e2e8f0"},
  bench:{background:"#fef9ee",color:"#b45309",border:"1px solid #fde68a"},
};
function Badge({label}){
  const s=BADGE_STYLES[(label||"").toLowerCase()]||{background:"#f1f5f9",color:"#64748b",border:"1px solid #e2e8f0"};
  return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:600,...s}}>{label}</span>;
}
function UtilBar({pct}){
  const c=pct>100?"#7c3aed":pct>=90?"#ef4444":pct>=70?"#f59e0b":"#10b981";
  return(
    <div style={{display:"flex",alignItems:"center",gap:7}}>
      <div className="util-bar" style={{width:52}}>
        <div className="util-fill" style={{width:`${Math.min(pct,100)}%`,background:c}}/>
      </div>
      <span style={{fontSize:11,fontWeight:700,color:c,minWidth:30}}>{pct}%{pct>100?" ⚠":""}</span>
    </div>
  );
}
function DaysChip({until}){
  if(!until)return <span style={{fontSize:11,color:"#94a3b8"}}>—</span>;
  const d=daysLeft(until);
  if(d<0)return <span style={{fontSize:11,fontWeight:600,color:"#dc2626",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:4,padding:"2px 7px"}}>Expired</span>;
  const [c,bg,bo]=d<=30?["#dc2626","#fef2f2","#fecaca"]:d<=90?["#d97706","#fffbeb","#fde68a"]:["#059669","#ecfdf5","#a7f3d0"];
  return <span style={{fontSize:11,fontWeight:600,color:c,background:bg,border:`1px solid ${bo}`,borderRadius:4,padding:"2px 7px"}}>{d}d left</span>;
}
function Shell({children}){
  return(
    <div style={{minHeight:"100vh",background:"#f4f6fb",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1e293b"}}>
      <style>{GLOBAL_CSS}</style>
      <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"0 28px",height:48,display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#94a3b8",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
        <span style={{color:"#6366f1",fontWeight:700,fontSize:13}}>NexusOps</span>
        <span style={{color:"#e2e8f0"}}>/</span>
        <span>Administration</span>
        <span style={{color:"#e2e8f0"}}>/</span>
        <span style={{color:"#1e293b",fontWeight:600}}>User Management</span>
      </div>
      <div style={{padding:"24px 28px",maxWidth:1640,margin:"0 auto"}}>{children}</div>
    </div>
  );
}

/* ─────────────────── ALLOCATION EDITOR ─────────────────── */
function AllocationEditor({allocations,onChange}){
  const tot=totalAlloc(allocations);
  const barColor=tot>100?"#dc2626":tot===100?"#10b981":tot>=70?"#f59e0b":"#6366f1";
  const addRow=()=>onChange([...allocations,{id:`a${Date.now()}`,projectId:"",projectName:"",allocationPct:0,from:"",until:""}]);
  const updRow=(id,k,v)=>onChange(allocations.map(a=>{
    if(a.id!==id)return a;
    if(k==="projectId"){const p=SEED_PROJECTS.find(x=>x.id===v);return {...a,projectId:v,projectName:p?p.name:v};}
    return {...a,[k]:v};
  }));
  const delRow=(id)=>onChange(allocations.filter(a=>a.id!==id));
  return(
    <div>
      <div style={{marginBottom:12,padding:"10px 14px",background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:12,fontWeight:600,color:"#475569"}}>Total allocation</span>
          <span style={{fontSize:13,fontWeight:700,color:barColor}}>
            {tot}%
            {tot>100?" — OVER-ALLOCATED":""}
            {tot===100?" — Fully booked":""}
            {tot>0&&tot<100?` — ${100-tot}% bench time`:""}
            {tot===0?" — Unallocated (bench)":""}
          </span>
        </div>
        <div style={{height:7,borderRadius:4,background:"#e2e8f0",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${Math.min(tot,100)}%`,background:barColor,borderRadius:4,transition:"width .3s"}}/>
        </div>
        {tot>100&&<div style={{marginTop:6,fontSize:11.5,color:"#dc2626",fontWeight:600}}>Allocation exceeds 100%. Reduce before saving.</div>}
      </div>
      {allocations.map(a=>(
        <div key={a.id} className="alloc-row">
          <div>
            <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Project</div>
            <select className="fsel" style={{fontSize:12.5}} value={a.projectId} onChange={e=>updRow(a.id,"projectId",e.target.value)}>
              <option value="">Select project…</option>
              {SEED_PROJECTS.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>%</div>
            <input className="finput" type="number" min={0} max={100} value={a.allocationPct} onChange={e=>updRow(a.id,"allocationPct",Number(e.target.value))} style={{fontWeight:700,color:"#4f46e5"}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>From</div>
            <input className="finput" type="date" style={{fontSize:12}} value={a.from} onChange={e=>updRow(a.id,"from",e.target.value)}/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Until</div>
            <input className="finput" type="date" style={{fontSize:12}} value={a.until} onChange={e=>updRow(a.id,"until",e.target.value)}/>
          </div>
          <button onClick={()=>delRow(a.id)} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,color:"#dc2626",cursor:"pointer",fontSize:14,height:34,width:30,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      ))}
      <button onClick={addRow} style={{width:"100%",padding:"9px",border:"2px dashed #c7d2fe",borderRadius:9,background:"#fafbff",color:"#6366f1",fontSize:13,fontWeight:600,cursor:"pointer",marginTop:4}}>
        + Add project allocation
      </button>
    </div>
  );
}

/* ─────────────────── USER MODAL (5-step) ─────────────────── */
const EMPTY_FORM={firstName:"",lastName:"",email:"",phone:"",employeeId:"",jobTitle:"",department:"",reportsTo:"",location:"",workModel:"Hybrid",employmentBasis:"Permanent",engagementModel:"Direct Employee",resourceScope:"Client-Facing",startDate:"",contractEnd:"",billabilityType:"Billable",billingRate:"",costRate:"",currency:"USD",billableFrom:"",billableUntil:"",allocations:[],status:"Active",accessRole:"Member",skills:[]};
const STEPS=[{n:1,label:"Personal"},{n:2,label:"Role"},{n:3,label:"Billing"},{n:4,label:"Allocations"},{n:5,label:"Skills"}];

function UserModal({onClose,onSave,editUser,allUsers}){
  const [step,setStep]=useState(1);
  const [form,setForm]=useState(editUser?{...editUser,billingRate:String(editUser.billingRate||""),costRate:String(editUser.costRate||"")}:{...EMPTY_FORM});
  const [allocErr,setAllocErr]=useState("");
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const toggleSk=(sk)=>setForm(p=>({...p,skills:p.skills.includes(sk)?p.skills.filter(s=>s!==sk):[...p.skills,sk]}));

  const managers=allUsers.filter(u=>["Admin","Manager"].includes(u.accessRole)&&(!editUser||u.id!==editUser.id));
  const needContractEnd=form.employmentBasis==="Fixed-Term Contract"||form.engagementModel!=="Direct Employee";

  function handleSave(){
    const tot=totalAlloc(form.allocations);
    if(tot>100){setAllocErr("Total exceeds 100%. Please adjust allocations.");setStep(4);return;}
    setAllocErr("");
    onSave({...form,id:editUser?.id||`USR-${String(Date.now()).slice(-4)}`,billingRate:Number(form.billingRate)||0,costRate:Number(form.costRate)||0});
  }

  const SegPicker=({label,options,value,onChange,wide})=>(
    <div style={{gridColumn:wide?"span 2":"auto"}}>
      <label className="field-label">{label}</label>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:4}}>
        {options.map(o=>(
          <button key={o} className={`seg-btn${value===o?" on":""}`} style={{flex:"none",padding:"8px 14px",fontSize:12}} onClick={()=>onChange(o)}>{o}</button>
        ))}
      </div>
    </div>
  );

  return(
    <div className="overlay">
      <div className="modal">
        <div style={{padding:"15px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,color:"#0f172a",fontFamily:"'Sora',sans-serif"}}>{editUser?"Edit User":"Add New User"}</div>
            <div style={{fontSize:12,color:"#94a3b8",marginTop:1}}>Step {step} of 5 — {STEPS[step-1].label}</div>
          </div>
          <button className="btn-ghost" style={{padding:"5px 10px",fontSize:15,lineHeight:1}} onClick={onClose}>✕</button>
        </div>

        {/* Stepper */}
        <div style={{padding:"12px 20px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",flexShrink:0,background:"#fafbff"}}>
          {STEPS.map((s,i)=>(
            <div key={s.n} style={{display:"flex",alignItems:"center",flex:1}}>
              <div onClick={()=>s.n<step&&setStep(s.n)} style={{display:"flex",alignItems:"center",gap:6,cursor:s.n<step?"pointer":"default"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:step>s.n?"#10b981":step===s.n?"#4f46e5":"#e2e8f0",color:step>=s.n?"#fff":"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,transition:"all .2s"}}>
                  {step>s.n?"✓":s.n}
                </div>
                <span style={{fontSize:11,fontWeight:600,color:step===s.n?"#4f46e5":step>s.n?"#10b981":"#94a3b8",whiteSpace:"nowrap"}}>{s.label}</span>
              </div>
              {i<4&&<div style={{flex:1,height:1,background:step>s.n?"#10b981":"#e2e8f0",margin:"0 8px",minWidth:4}}/>}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>

          {/* STEP 1: Personal */}
          {step===1&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px 16px"}}>
              <div><label className="field-label">First Name *</label><input className="finput" value={form.firstName} onChange={e=>set("firstName",e.target.value)} placeholder="Rachel"/></div>
              <div><label className="field-label">Last Name *</label><input className="finput" value={form.lastName} onChange={e=>set("lastName",e.target.value)} placeholder="Kim"/></div>
              <div style={{gridColumn:"span 2"}}><label className="field-label">Work Email *</label><input className="finput" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="rachel.kim@company.com"/></div>
              <div><label className="field-label">Phone</label><input className="finput" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+1 415-000-0000"/></div>
              <div><label className="field-label">Employee / Contract ID *</label><input className="finput" value={form.employeeId} onChange={e=>set("employeeId",e.target.value)} placeholder="EMP-1001 or CON-2001"/></div>
              <div className="info-box" style={{gridColumn:"span 2"}}>
                Use <strong>EMP-</strong> for permanent employees and <strong>CON-</strong> for contractors and consultants. This ID links timesheets, invoices, and approvals across the platform.
              </div>
            </div>
          )}

          {/* STEP 2: Role & Classification */}
          {step===2&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px 16px"}}>
              <div style={{gridColumn:"span 2"}}><label className="field-label">Job Title *</label><input className="finput" value={form.jobTitle} onChange={e=>set("jobTitle",e.target.value)} placeholder="e.g. Senior Cloud Architect"/></div>
              <div>
                <label className="field-label">Department *</label>
                <select className="fsel" value={form.department} onChange={e=>set("department",e.target.value)}>
                  <option value="">Select…</option>{DEPTS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Reports To</label>
                <select className="fsel" value={form.reportsTo} onChange={e=>set("reportsTo",e.target.value)}>
                  <option value="">None (top-level)</option>
                  {managers.map(u=><option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.jobTitle}</option>)}
                </select>
              </div>
              <div style={{gridColumn:"span 2"}}><label className="field-label">Location</label><input className="finput" value={form.location} onChange={e=>set("location",e.target.value)} placeholder="e.g. San Francisco, CA, USA"/></div>
              <div>
                <label className="field-label">Work Model *</label>
                <select className="fsel" value={form.workModel} onChange={e=>set("workModel",e.target.value)}>
                  <option>Remote</option><option>Hybrid</option><option>Onsite</option>
                </select>
              </div>
              <div>
                <label className="field-label">Status *</label>
                <select className="fsel" value={form.status} onChange={e=>set("status",e.target.value)}>
                  <option>Active</option><option>On Leave</option><option>Offboarding</option><option>Inactive</option>
                </select>
              </div>
              <div><label className="field-label">Start Date *</label><input className="finput" type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)}/></div>
              {needContractEnd&&<div><label className="field-label">Contract End Date</label><input className="finput" type="date" value={form.contractEnd} onChange={e=>set("contractEnd",e.target.value)}/></div>}

              <SegPicker wide label="Employment Basis *" options={EMP_BASIS} value={form.employmentBasis} onChange={v=>set("employmentBasis",v)}/>
              <div style={{gridColumn:"span 2"}}>
                <label className="field-label">Engagement Model *</label>
                <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:4}}>
                  {ENG_MODELS.map(m=>(
                    <button key={m} className={`seg-btn${form.engagementModel===m?" on":""}`} style={{flex:"none",padding:"8px 14px",fontSize:12}} onClick={()=>set("engagementModel",m)}>{m}</button>
                  ))}
                </div>
                <div className="info-box">
                  {form.engagementModel==="Direct Employee"&&"Salaried headcount on your payroll — no agency or vendor involved."}
                  {form.engagementModel==="Staffing Agency"&&"Placed by a staffing firm; you pay the agency who pays the worker."}
                  {form.engagementModel==="Independent Contractor"&&"Self-employed; invoices directly to the company with no intermediary."}
                  {form.engagementModel==="Consulting Firm"&&"Deployed by a consulting partner under a services or framework agreement."}
                  {form.engagementModel==="Vendor / Subcontractor"&&"Third-party vendor or subcontractor engaged on a specific deliverable."}
                </div>
              </div>
              <div style={{gridColumn:"span 2"}}>
                <label className="field-label">Resource Scope *</label>
                <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:4}}>
                  {RES_SCOPES.map(s=>(
                    <button key={s} className={`seg-btn${form.resourceScope===s?" on":""}`} style={{flex:"none",padding:"8px 14px",fontSize:12}} onClick={()=>set("resourceScope",s)}>{s}</button>
                  ))}
                </div>
                <div className="info-box">
                  {form.resourceScope==="Client-Facing"&&"Deployed on client SOW engagements — revenue-generating resource."}
                  {form.resourceScope==="Internal Projects"&&"Working on company IT, data, migrations or infra — internal cost centre."}
                  {form.resourceScope==="Overhead / Support"&&"HR, Finance, PMO, Admin — pure overhead with no project allocation."}
                  {form.resourceScope==="Bench"&&"Available and unallocated — awaiting assignment."}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Billing */}
          {step===3&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px 16px"}}>
              <div style={{gridColumn:"span 2"}}>
                <label className="field-label">Billability Type *</label>
                <div style={{display:"flex",gap:8,marginTop:6}}>
                  {["Billable","Non-Billable","Partial"].map(t=>(
                    <button key={t} className={`seg-btn${form.billabilityType===t?" on":""}`} onClick={()=>set("billabilityType",t)}>{t}</button>
                  ))}
                </div>
                <div className="info-box">
                  {form.billabilityType==="Billable"&&"All time logged is invoiced to clients at the billing rate below."}
                  {form.billabilityType==="Non-Billable"&&"Internal resource — costs are tracked but not charged to client engagements."}
                  {form.billabilityType==="Partial"&&"Split billing — a portion of time is client-billable. Define rates and the active window."}
                </div>
              </div>
              {form.billabilityType!=="Non-Billable"&&<>
                <div><label className="field-label">Billing Rate / hr *</label><input className="finput" type="number" value={form.billingRate} onChange={e=>set("billingRate",e.target.value)} placeholder="145"/></div>
                <div>
                  <label className="field-label">Currency</label>
                  <select className="fsel" value={form.currency} onChange={e=>set("currency",e.target.value)}>
                    {CURRENCIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="field-label">Billable From</label><input className="finput" type="date" value={form.billableFrom} onChange={e=>set("billableFrom",e.target.value)}/></div>
                <div><label className="field-label">Billable Until</label><input className="finput" type="date" value={form.billableUntil} onChange={e=>set("billableUntil",e.target.value)}/></div>
              </>}
              <div>
                <label className="field-label">Internal Cost Rate / hr</label>
                <input className="finput" type="number" value={form.costRate} onChange={e=>set("costRate",e.target.value)} placeholder="95"/>
              </div>
            </div>
          )}

          {/* STEP 4: Allocations */}
          {step===4&&(
            <div>
              <p style={{fontSize:12.5,color:"#64748b",marginBottom:14,lineHeight:1.6}}>
                Assign this user to one or more active projects. Each allocation carries its own percentage and date window. The total across all projects must not exceed 100%. Anything below 100% is treated as bench time.
              </p>
              <AllocationEditor allocations={form.allocations} onChange={v=>set("allocations",v)}/>
              {allocErr&&<div style={{marginTop:10,padding:"9px 12px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,fontSize:12.5,color:"#dc2626",fontWeight:600}}>{allocErr}</div>}
            </div>
          )}

          {/* STEP 5: Skills + Access */}
          {step===5&&(
            <div>
              <div style={{marginBottom:20}}>
                <label className="field-label">System Access Role *</label>
                <div style={{display:"flex",gap:8,marginTop:6}}>
                  {["Admin","Manager","Member","Viewer"].map(r=>(
                    <button key={r} className={`seg-btn${form.accessRole===r?" on":""}`} onClick={()=>set("accessRole",r)}>{r}</button>
                  ))}
                </div>
                <div className="info-box">
                  {form.accessRole==="Admin"&&"Full system access — manages users, roles, settings, and all records."}
                  {form.accessRole==="Manager"&&"Manages team records, approves requests, views dashboards and reports."}
                  {form.accessRole==="Member"&&"Creates and edits own records, submits timesheets, views assigned projects."}
                  {form.accessRole==="Viewer"&&"Read-only access to assigned modules only."}
                </div>
              </div>
              <div>
                <label className="field-label">Skills {form.skills.length>0&&`(${form.skills.length} selected)`}</label>
                <div style={{display:"flex",flexWrap:"wrap",minHeight:34,padding:"4px 0",marginBottom:8}}>
                  {form.skills.length===0
                    ?<span style={{fontSize:12,color:"#94a3b8",fontStyle:"italic",padding:"4px 0"}}>None — click below to add</span>
                    :form.skills.map(sk=><span key={sk} className="skill-tag">{sk}<span className="skill-remove" onClick={()=>toggleSk(sk)}>✕</span></span>)
                  }
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,padding:10,background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0",maxHeight:156,overflowY:"auto"}}>
                  {SKILLS_POOL.filter(sk=>!form.skills.includes(sk)).map(sk=>(
                    <button key={sk} onClick={()=>toggleSk(sk)} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#64748b",cursor:"pointer"}}>+ {sk}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{padding:"12px 20px",borderTop:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafbff",flexShrink:0}}>
          <button className="btn-ghost" onClick={step>1?()=>setStep(s=>s-1):onClose}>{step>1?"← Back":"Cancel"}</button>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#94a3b8"}}>{step} / 5</span>
            {step<5
              ?<button className="btn-primary" onClick={()=>setStep(s=>s+1)}>Continue →</button>
              :<button className="btn-primary" onClick={handleSave}>{editUser?"Save Changes":"Create User"}</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── USER DRAWER ─────────────────── */
function UserDrawer({user,allUsers,onClose,onEdit}){
  const fn=`${user.firstName} ${user.lastName}`;
  const tot=totalAlloc(user.allocations);
  const mgr=allUsers.find(u=>u.id===user.reportsTo);
  const DR=({label,value})=>(
    <div style={{display:"flex",alignItems:"flex-start",padding:"7px 0",borderBottom:"1px solid #f8fafc"}}>
      <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5,minWidth:124,fontWeight:600,flexShrink:0,paddingTop:1}}>{label}</div>
      <div style={{fontSize:13,color:"#1e293b",flex:1}}>{value||"—"}</div>
    </div>
  );
  return(
    <>
      <div className="drawer-backdrop" onClick={onClose}/>
      <div className="drawer-panel">
        <div style={{padding:"18px 20px",borderBottom:"1px solid #e2e8f0",background:"linear-gradient(135deg,#eef2ff 0%,#f8faff 100%)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:10}}>
            <Avatar name={fn} size={44}/>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:700,color:"#0f172a",fontFamily:"'Sora',sans-serif",letterSpacing:-.2}}>{fn}</div>
              <div style={{fontSize:12.5,color:"#64748b",marginTop:2}}>{user.jobTitle}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{user.department} · {user.workModel} · {user.location}</div>
              <div style={{fontSize:10,fontFamily:"monospace",color:"#6366f1",marginTop:4,background:"#eef2ff",display:"inline-block",padding:"2px 7px",borderRadius:4,border:"1px solid #e0e7ff"}}>{user.employeeId}</div>
            </div>
            <button onClick={onClose} style={{background:"none",border:"none",fontSize:17,color:"#94a3b8",cursor:"pointer",lineHeight:1}}>✕</button>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <Badge label={user.status}/>
            <Badge label={user.billabilityType}/>
            <Badge label={user.engagementModel}/>
            <Badge label={user.resourceScope}/>
            <Badge label={user.accessRole}/>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",background:"#e2e8f0",gap:1,flexShrink:0}}>
          {[{label:"Bill Rate",value:user.billingRate>0?`${user.currency} ${user.billingRate}/hr`:"N/A"},{label:"Cost Rate",value:user.costRate>0?`${user.currency} ${user.costRate}/hr`:"N/A"},{label:"Utilisation",value:`${tot}%`,color:tot>100?"#7c3aed":tot>=90?"#ef4444":tot>=70?"#f59e0b":"#059669"}].map(m=>(
            <div key={m.label} style={{background:"#fff",padding:"11px 8px",textAlign:"center"}}>
              <div style={{fontSize:10,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.4,marginBottom:3}}>{m.label}</div>
              <div style={{fontSize:13.5,fontWeight:700,color:m.color||"#0f172a"}}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
          <div className="section-title">Contact</div>
          <DR label="Email" value={<a href={`mailto:${user.email}`} style={{color:"#4f46e5",textDecoration:"none"}}>{user.email}</a>}/>
          <DR label="Phone" value={user.phone}/>
          <DR label="Reports To" value={mgr?`${mgr.firstName} ${mgr.lastName}`:user.reportsTo||"—"}/>

          <div className="section-title" style={{marginTop:16}}>Classification</div>
          <DR label="Emp. Basis"  value={user.employmentBasis}/>
          <DR label="Engagement"  value={user.engagementModel}/>
          <DR label="Scope"       value={user.resourceScope}/>
          <DR label="Start Date"  value={user.startDate}/>
          {user.contractEnd&&<DR label="Contract End" value={<span style={{display:"flex",alignItems:"center",gap:8}}>{user.contractEnd} <DaysChip until={user.contractEnd}/></span>}/>}

          {user.billabilityType!=="Non-Billable"&&<>
            <div className="section-title" style={{marginTop:16}}>Billing Window</div>
            <DR label="From"  value={user.billableFrom}/>
            <DR label="Until" value={<span style={{display:"flex",alignItems:"center",gap:8}}>{user.billableUntil} <DaysChip until={user.billableUntil}/></span>}/>
          </>}

          {user.allocations.length>0&&<>
            <div className="section-title" style={{marginTop:16}}>Project Allocations</div>
            {user.allocations.map(a=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,marginBottom:5}}>
                <div>
                  <div style={{fontSize:12.5,fontWeight:600,color:"#1e293b"}}>{a.projectName}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{a.from} to {a.until||"Open"}</div>
                </div>
                <span style={{fontSize:14,fontWeight:700,color:"#4f46e5",background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:6,padding:"3px 10px"}}>{a.allocationPct}%</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:4}}>
              <span style={{fontSize:12,fontWeight:700,color:tot>100?"#dc2626":tot===100?"#059669":"#64748b"}}>
                Total: {tot}% {tot<100&&`(${100-tot}% bench)`}
              </span>
            </div>
          </>}

          {user.allocations.length===0&&(
            <div style={{marginTop:16,padding:"12px 14px",background:"#fef9ee",border:"1px solid #fde68a",borderRadius:8,fontSize:12.5,color:"#b45309",fontWeight:500}}>
              No project allocations — this user is on bench.
            </div>
          )}

          {user.skills.length>0&&<>
            <div className="section-title" style={{marginTop:16}}>Skills</div>
            <div style={{display:"flex",flexWrap:"wrap",marginTop:4}}>{user.skills.map(sk=><span key={sk} className="skill-tag">{sk}</span>)}</div>
          </>}
        </div>

        <div style={{padding:"12px 20px",borderTop:"1px solid #e2e8f0",display:"flex",gap:8,background:"#fafbff",flexShrink:0}}>
          <button className="btn-primary" style={{flex:1}} onClick={onEdit}>Edit User</button>
          <button className="btn-ghost" style={{fontSize:12,padding:"8px 12px",color:"#dc2626",borderColor:"#fecaca"}}>Deactivate</button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────── USERS PAGE ─────────────────── */
function UsersPage(){
  const [users,setUsers]     = useState(SEED_USERS);
  const [search,setSearch]   = useState("");
  const [billF,setBillF]     = useState("All");
  const [scopeF,setScopeF]   = useState("All");
  const [statF,setStatF]     = useState("All");
  const [sortCol,setSortCol] = useState("firstName");
  const [sortDir,setSortDir] = useState(1);
  const [showCreate,setShowCreate] = useState(false);
  const [editUser,setEditUser]     = useState(null);
  const [drawer,setDrawer]         = useState(null);
  const [toast,setToast]           = useState("");
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),3000);};

  const filtered=useMemo(()=>{
    let out=users.filter(u=>{
      const q=search.toLowerCase();
      const mQ=!q||`${u.firstName} ${u.lastName} ${u.email} ${u.jobTitle} ${u.department} ${u.employeeId}`.toLowerCase().includes(q);
      const mB=billF==="All"||u.billabilityType===billF;
      const mSc=scopeF==="All"||u.resourceScope===scopeF;
      const mSt=statF==="All"||u.status===statF;
      return mQ&&mB&&mSc&&mSt;
    });
    out.sort((a,b)=>{
      const av=a[sortCol]??"";const bv=b[sortCol]??"";
      return typeof av==="number"?(av-bv)*sortDir:String(av).localeCompare(String(bv))*sortDir;
    });
    return out;
  },[users,search,billF,scopeF,statF,sortCol,sortDir]);

  const active    = users.filter(u=>u.status==="Active");
  const billable  = users.filter(u=>u.billabilityType==="Billable");
  const bench     = users.filter(u=>u.status==="Active"&&totalAlloc(u.allocations)===0);
  const overAlloc = users.filter(u=>totalAlloc(u.allocations)>100);
  const expiring  = users.filter(u=>u.contractEnd&&(daysLeft(u.contractEnd)??Infinity)<=30&&(daysLeft(u.contractEnd)??-1)>=0);

  const handleSave=(user)=>{
    setUsers(p=>{const i=p.findIndex(u=>u.id===user.id);return i>=0?p.map((u,x)=>x===i?user:u):[user,...p];});
    setShowCreate(false);setEditUser(null);
    showToast(editUser?"User updated":"User created successfully");
  };

  const Th=({col,label,w})=>(
    <th className="sort-th" onClick={()=>sortCol===col?setSortDir(d=>-d):(setSortCol(col),setSortDir(1))}
      style={{fontSize:10.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6,padding:"9px 12px",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",textAlign:"left",minWidth:w,whiteSpace:"nowrap"}}>
      {label}{sortCol===col?(sortDir===1?" ↑":" ↓"):""}
    </th>
  );
  const Ph=({label,w})=>(
    <th style={{fontSize:10.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6,padding:"9px 12px",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",textAlign:"left",minWidth:w,whiteSpace:"nowrap"}}>{label}</th>
  );

  return(
    <>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h1 style={{fontSize:23,fontWeight:700,color:"#0f172a",fontFamily:"'Sora',sans-serif",letterSpacing:-.4}}>User Management</h1>
          <p style={{fontSize:13,color:"#64748b",marginTop:4}}>
            {users.length} total users · {active.length} active · {expiring.length} contract{expiring.length!==1?"s":""} expiring{overAlloc.length>0?` · ${overAlloc.length} over-allocated`:""}
          </p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn-ghost" style={{fontSize:12}}>↓ Export</button>
          <button className="btn-primary" onClick={()=>setShowCreate(true)}>+ Add User</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        {[
          {label:"Total Headcount",    val:users.length,       sub:`${active.length} active`,                                icon:"👥",color:"#4f46e5"},
          {label:"Billable",           val:billable.length,    sub:`${Math.round(billable.length/users.length*100)}% of workforce`,icon:"💲",color:"#059669"},
          {label:"On Bench",           val:bench.length,       sub:"Zero allocation — available",                            icon:"📋",color:"#0891b2"},
          {label:"Expiring Contracts", val:expiring.length,    sub:"Next 30 days",                                           icon:"📅",color:expiring.length>0?"#dc2626":"#94a3b8"},
          {label:"Over-Allocated",     val:overAlloc.length,   sub:"Exceeds 100%",                                           icon:"⚠️",color:overAlloc.length>0?"#7c3aed":"#94a3b8"},
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5}}>{s.label}</span>
              <span style={{fontSize:18}}>{s.icon}</span>
            </div>
            <div style={{fontSize:25,fontWeight:700,color:s.color,fontFamily:"'Sora',sans-serif",letterSpacing:-.4}}>{s.val}</div>
            <div style={{fontSize:11.5,color:"#94a3b8",marginTop:4}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="section-card" style={{padding:"11px 14px",marginBottom:12}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"6px 10px",width:218}}>
            <span style={{color:"#94a3b8",fontSize:13}}>🔍</span>
            <input style={{border:"none",background:"none",outline:"none",fontSize:13,color:"#374151",width:"100%"}} placeholder="Name, email, dept, ID…" value={search} onChange={e=>setSearch(e.target.value)}/>
            {search&&<span style={{cursor:"pointer",color:"#94a3b8",fontSize:12}} onClick={()=>setSearch("")}>✕</span>}
          </div>
          <div style={{width:1,height:20,background:"#e2e8f0"}}/>
          <span style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5}}>Billability:</span>
          {["All","Billable","Non-Billable","Partial"].map(f=>(
            <button key={f} className={`filter-chip${billF===f?" active":""}`} onClick={()=>setBillF(f)}>{f}</button>
          ))}
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <select className="fsel" style={{width:172}} value={scopeF} onChange={e=>setScopeF(e.target.value)}>
              <option value="All">All Scopes</option>
              {RES_SCOPES.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="fsel" style={{width:136}} value={statF} onChange={e=>setStatF(e.target.value)}>
              <option value="All">All Statuses</option>
              <option>Active</option><option>On Leave</option><option>Offboarding</option><option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="section-card" style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:1500}}>
            <thead>
              <tr>
                <Th col="firstName"      label="User"             w={192}/>
                <Th col="jobTitle"        label="Title / Dept"     w={152}/>
                <Ph                       label="Classification"   w={185}/>
                <Th col="resourceScope"   label="Scope"            w={120}/>
                <Th col="billabilityType" label="Billability"      w={104}/>
                <Th col="billingRate"     label="Bill / Cost"      w={128}/>
                <Ph                       label="Billable Period"  w={165}/>
                <Ph                       label="Allocations"      w={192}/>
                <Ph                       label="Utilisation"      w={100}/>
                <Th col="status"          label="Status"           w={90}/>
                <Ph                       label="Actions"          w={84}/>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0
                ?<tr><td colSpan={11} style={{textAlign:"center",padding:"44px",color:"#94a3b8",fontSize:13}}>No users match the current filters.</td></tr>
                :filtered.map(u=>{
                  const fn=`${u.firstName} ${u.lastName}`;
                  const tot=totalAlloc(u.allocations);
                  const mgr=users.find(x=>x.id===u.reportsTo);
                  return(
                    <tr key={u.id} className="trow" style={{borderBottom:"1px solid #f1f5f9",cursor:"pointer"}} onClick={()=>setDrawer(u)}>
                      <td style={{padding:"9px 12px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:9}}>
                          <Avatar name={fn} size={30}/>
                          <div>
                            <div style={{fontSize:12.5,fontWeight:600,color:"#0f172a"}}>{fn}</div>
                            <div style={{fontSize:10,fontFamily:"monospace",color:"#6366f1",marginTop:1}}>{u.employeeId}</div>
                            <div style={{fontSize:10.5,color:"#94a3b8",marginTop:1}}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{padding:"9px 12px"}}>
                        <div style={{fontSize:12.5,color:"#1e293b",fontWeight:500,maxWidth:144,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.jobTitle}</div>
                        <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{u.department}</div>
                        {mgr&&<div style={{fontSize:10.5,color:"#94a3b8",marginTop:1}}>↑ {mgr.firstName} {mgr.lastName}</div>}
                      </td>
                      <td style={{padding:"9px 12px"}}>
                        <div style={{fontSize:11.5,color:"#475569",fontWeight:500}}>{u.employmentBasis}</div>
                        <div style={{marginTop:3}}><Badge label={u.engagementModel}/></div>
                        {u.contractEnd&&<div style={{marginTop:3}}><DaysChip until={u.contractEnd}/></div>}
                      </td>
                      <td style={{padding:"9px 12px"}}><Badge label={u.resourceScope}/></td>
                      <td style={{padding:"9px 12px"}}><Badge label={u.billabilityType}/></td>
                      <td style={{padding:"9px 12px"}}>
                        {u.billingRate>0
                          ?<div><div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{u.currency} {u.billingRate}/hr</div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>Cost: {u.costRate}/hr</div></div>
                          :<span style={{fontSize:12,color:"#94a3b8"}}>N/A</span>
                        }
                      </td>
                      <td style={{padding:"9px 12px"}}>
                        {u.billableFrom
                          ?<div>
                            <div style={{fontSize:11.5,color:"#475569",fontWeight:500}}>{u.billableFrom}</div>
                            <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>to {u.billableUntil||"Open"}</div>
                            <div style={{marginTop:4}}><DaysChip until={u.billableUntil}/></div>
                          </div>
                          :<span style={{fontSize:11,color:"#94a3b8",fontStyle:"italic"}}>Not billable</span>
                        }
                      </td>
                      <td style={{padding:"9px 12px"}}>
                        {u.allocations.length===0
                          ?<span style={{fontSize:11.5,background:"#fef9ee",color:"#b45309",border:"1px solid #fde68a",borderRadius:5,padding:"3px 8px"}}>On Bench</span>
                          :<div>
                            {u.allocations.slice(0,2).map(a=>(
                              <div key={a.id} style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                                <span style={{fontSize:10,fontWeight:700,color:"#4f46e5",background:"#eef2ff",borderRadius:4,padding:"1px 5px",flexShrink:0}}>{a.allocationPct}%</span>
                                <span style={{fontSize:11,color:"#475569",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:110}}>{a.projectName}</span>
                              </div>
                            ))}
                            {u.allocations.length>2&&<div style={{fontSize:10.5,color:"#94a3b8"}}>+{u.allocations.length-2} more</div>}
                          </div>
                        }
                      </td>
                      <td style={{padding:"9px 12px"}}><UtilBar pct={tot}/></td>
                      <td style={{padding:"9px 12px"}}><Badge label={u.status}/></td>
                      <td style={{padding:"9px 12px"}}>
                        <div className="row-act" style={{display:"flex",gap:4}}>
                          <button onClick={ev=>{ev.stopPropagation();setDrawer(u);}} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"4px 8px",fontSize:11,cursor:"pointer",color:"#64748b"}}>View</button>
                          <button onClick={ev=>{ev.stopPropagation();setEditUser(u);}} style={{background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:6,padding:"4px 8px",fontSize:11,cursor:"pointer",color:"#4f46e5"}}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
        <div style={{padding:"9px 14px",borderTop:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafbff"}}>
          <span style={{fontSize:12,color:"#94a3b8"}}>Showing {filtered.length} of {users.length} users</span>
          <div style={{display:"flex",gap:4}}>
            {[{l:"‹",d:true},{l:"1",d:false,a:true},{l:"›",d:true}].map((b,i)=>(
              <button key={i} disabled={b.d} style={{background:b.a?"#6366f1":"#fff",border:`1px solid ${b.a?"#6366f1":"#e2e8f0"}`,color:b.a?"#fff":"#64748b",borderRadius:7,width:30,height:30,cursor:b.d?"not-allowed":"pointer",opacity:b.d?.4:1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:b.a?700:400}}>{b.l}</button>
            ))}
          </div>
        </div>
      </div>

      {(showCreate||editUser)&&<UserModal onClose={()=>{setShowCreate(false);setEditUser(null);}} onSave={handleSave} editUser={editUser} allUsers={users}/>}
      {drawer&&<UserDrawer user={drawer} allUsers={users} onClose={()=>setDrawer(null)} onEdit={()=>{setEditUser(drawer);setDrawer(null);}}/>}
      {toast&&<div className="toast">✓ {toast}</div>}
    </>
  );
}

export default function App(){
  return <Shell><UsersPage/></Shell>;
}
