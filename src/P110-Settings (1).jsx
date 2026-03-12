import { useState, useMemo } from "react";

/* ── SEED DATA ────────────────────────────────────────────────────────────── */
const INIT_CLIENTS = [
  { id:"CLT-001", name:"Nexus Corp",        industry:"Technology",    region:"North America", status:"Active",  contact:"John Hargreaves",  email:"jh@nexuscorp.com" },
  { id:"CLT-002", name:"Meridian Holdings", industry:"Finance",       region:"APAC",          status:"Active",  contact:"Sandra Yip",        email:"sy@meridian.com" },
  { id:"CLT-003", name:"BlueStar Retail",   industry:"Retail",        region:"North America", status:"Active",  contact:"Marcus Elliot",     email:"me@bluestar.com" },
  { id:"CLT-004", name:"Orion Financial",   industry:"Finance",       region:"EMEA",          status:"Active",  contact:"Priya Patel",       email:"pp@orionfi.com" },
  { id:"CLT-005", name:"TrueNorth Law",     industry:"Legal",         region:"North America", status:"Active",  contact:"Claire Hudson",     email:"ch@truenorth.com" },
  { id:"CLT-006", name:"Summit Energy",     industry:"Energy",        region:"APAC",          status:"Inactive",contact:"Derek Tan",         email:"dt@summitenergy.com" },
];
const INIT_DEPARTMENTS = [
  { id:"DEPT-001", name:"Delivery",       head:"Rachel Kim",    headcount:34, costCenter:"CC-1001", status:"Active" },
  { id:"DEPT-002", name:"Sales",          head:"Dana Mercer",   headcount:12, costCenter:"CC-1002", status:"Active" },
  { id:"DEPT-003", name:"Finance",        head:"Priya Mehta",   headcount:8,  costCenter:"CC-1003", status:"Active" },
  { id:"DEPT-004", name:"HR",             head:"Karthik Nair",  headcount:6,  costCenter:"CC-1004", status:"Active" },
  { id:"DEPT-005", name:"PMO",            head:"Tom Ashby",     headcount:9,  costCenter:"CC-1005", status:"Active" },
  { id:"DEPT-006", name:"Cloud Practice", head:"Theo Vasquez",  headcount:15, costCenter:"CC-1006", status:"Active" },
  { id:"DEPT-007", name:"Data Practice",  head:"Lian Zhou",     headcount:11, costCenter:"CC-1007", status:"Active" },
  { id:"DEPT-008", name:"Legal",          head:"Sam Keller",    headcount:3,  costCenter:"CC-1008", status:"Inactive" },
];
const INIT_SKILLS = [
  { id:"SKL-001", name:"React",        category:"Frontend",   demand:"High",   status:"Active" },
  { id:"SKL-002", name:"Node.js",      category:"Backend",    demand:"High",   status:"Active" },
  { id:"SKL-003", name:"AWS",          category:"Cloud",      demand:"High",   status:"Active" },
  { id:"SKL-004", name:"Azure",        category:"Cloud",      demand:"Medium", status:"Active" },
  { id:"SKL-005", name:"Python",       category:"Backend",    demand:"High",   status:"Active" },
  { id:"SKL-006", name:"Databricks",   category:"Data",       demand:"High",   status:"Active" },
  { id:"SKL-007", name:"Kubernetes",   category:"DevOps",     demand:"Medium", status:"Active" },
  { id:"SKL-008", name:"Figma",        category:"Design",     demand:"Medium", status:"Active" },
  { id:"SKL-009", name:"Salesforce",   category:"CRM",        demand:"Low",    status:"Active" },
  { id:"SKL-010", name:"Terraform",    category:"DevOps",     demand:"Medium", status:"Active" },
  { id:"SKL-011", name:"Power BI",     category:"Data",       demand:"Medium", status:"Active" },
  { id:"SKL-012", name:"Java",         category:"Backend",    demand:"Low",    status:"Inactive" },
];
const INIT_COSTCENTERS = [
  { id:"CC-1001", name:"Delivery Operations",    budget:2400000, spent:1680000, owner:"Rachel Kim",  status:"Active" },
  { id:"CC-1002", name:"Sales & BD",             budget:800000,  spent:510000,  owner:"Dana Mercer", status:"Active" },
  { id:"CC-1003", name:"Finance & Accounting",   budget:500000,  spent:320000,  owner:"Priya Mehta", status:"Active" },
  { id:"CC-1004", name:"Human Resources",        budget:420000,  spent:290000,  owner:"Karthik Nair",status:"Active" },
  { id:"CC-1005", name:"PMO & Governance",       budget:600000,  spent:380000,  owner:"Tom Ashby",   status:"Active" },
  { id:"CC-1006", name:"Cloud Practice",         budget:1100000, spent:720000,  owner:"Theo Vasquez",status:"Active" },
  { id:"CC-1007", name:"Data Practice",          budget:900000,  spent:605000,  owner:"Lian Zhou",   status:"Active" },
  { id:"CC-1008", name:"Legal & Compliance",     budget:250000,  spent:98000,   owner:"Sam Keller",  status:"Inactive" },
];
const INTEGRATIONS = [
  { id:"INT-001", name:"Jira",        category:"Project Mgmt",    status:"Connected",    lastSync:"2026-03-12 08:14", icon:"🔷", desc:"Bi-directional project & issue sync" },
  { id:"INT-002", name:"Slack",       category:"Communication",   status:"Connected",    lastSync:"2026-03-12 09:00", icon:"💬", desc:"Approval notifications & alerts" },
  { id:"INT-003", name:"SAP ERP",     category:"Finance / ERP",   status:"Connected",    lastSync:"2026-03-12 06:30", icon:"🔶", desc:"Invoice, GL coding & cost center sync" },
  { id:"INT-004", name:"Workday",     category:"HR / Payroll",    status:"Connected",    lastSync:"2026-03-11 23:00", icon:"🔵", desc:"Employee data, org chart & leave balances" },
  { id:"INT-005", name:"Salesforce",  category:"CRM",             status:"Disconnected", lastSync:"2026-02-28 14:00", icon:"☁",  desc:"Client, opportunity & revenue data" },
  { id:"INT-006", name:"DocuSign",    category:"e-Signature",     status:"Connected",    lastSync:"2026-03-12 07:45", icon:"✍",  desc:"SOW & contract e-signature workflow" },
  { id:"INT-007", name:"Power BI",    category:"Analytics",       status:"Error",        lastSync:"2026-03-10 02:00", icon:"📊", desc:"Executive dashboard & KPI reporting" },
  { id:"INT-008", name:"Azure AD",    category:"Identity",        status:"Connected",    lastSync:"2026-03-12 09:01", icon:"🔐", desc:"SSO, MFA & directory sync" },
];

/* ── HELPERS ──────────────────────────────────────────────────────────────── */
const fmt$ = n => "$" + Number(n).toLocaleString();
const pct  = (s,b) => Math.min(100,Math.round((s/b)*100));
const avatarColor = n => { const h=["#6366f1","#0891b2","#059669","#d97706","#dc2626","#8b5cf6"]; let s=0; for(let c of n||"") s+=c.charCodeAt(0); return h[s%h.length]; };
const initials = n => (n||"").split(" ").map(p=>p[0]).join("").toUpperCase().slice(0,2);
const uid = pfx => `${pfx}-${Date.now().toString(36).toUpperCase()}`;

/* ── CSS ──────────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#f4f6fb;}
.btn-primary{background:#4f46e5;color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s;}
.btn-primary:hover{background:#4338ca;}
.btn-ghost{background:#fff;color:#374151;border:1px solid #e2e8f0;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:500;cursor:pointer;}
.btn-ghost:hover{background:#f8fafc;border-color:#c7d2fe;}
.btn-danger{background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:8px;padding:6px 13px;font-size:12px;font-weight:600;cursor:pointer;}
.btn-danger:hover{background:#fecaca;}
.finput{width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:13.5px;font-family:'DM Sans',sans-serif;outline:none;transition:border .15s;}
.finput:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1);}
.fsel{border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:13.5px;font-family:'DM Sans',sans-serif;outline:none;background:#fff;}
.fsel:focus{border-color:#6366f1;}
.trow:hover{background:#f8fafc;}
.nav-item:hover{background:rgba(255,255,255,.08);}
.settings-nav-item{padding:10px 14px;border-radius:8px;cursor:pointer;font-size:13.5px;display:flex;align-items:center;gap:9px;transition:all .13s;color:#475569;}
.settings-nav-item:hover{background:#f1f5f9;color:#4f46e5;}
.settings-nav-item.active{background:#eef2ff;color:#4f46e5;font-weight:600;}
.settings-nav-group{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;padding:12px 14px 4px;}
.section-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px 24px;margin-bottom:20px;}
.field-label{display:block;font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.7px;color:#64748b;margin-bottom:6px;}
.stat-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:600;}
.modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:200;display:flex;align-items:center;justify-content:center;}
.modal{background:#fff;border-radius:16px;padding:28px 32px;width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.18);}
.toast{position:fixed;bottom:28px;right:28px;background:#0f172a;color:#fff;padding:12px 22px;border-radius:10px;font-size:13.5px;font-weight:500;z-index:999;display:flex;align-items:center;gap:9px;box-shadow:0 8px 24px rgba(0,0,0,.22);}
`;

/* ── SHARED COMPONENTS ────────────────────────────────────────────────────── */
const Toast = ({msg,color="#4f46e5"}) => (
  <div className="toast"><span style={{color,fontSize:16}}>●</span>{msg}</div>
);

const Badge = ({label,color="#4f46e5",bg}) => (
  <span className="stat-chip" style={{color,background:bg||color+"18"}}>{label}</span>
);

const Avatar = ({name,size=26}) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:avatarColor(name),display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.36,fontWeight:700,color:"#fff",flexShrink:0}}>
    {initials(name)}
  </div>
);

const SpendBar = ({spent,budget}) => {
  const p = pct(spent,budget);
  const color = p>90?"#dc2626":p>70?"#d97706":"#4f46e5";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11.5,color:"#64748b",marginBottom:4}}>
        <span>{fmt$(spent)}</span><span style={{color:"#94a3b8"}}>{p}%</span>
      </div>
      <div style={{height:5,background:"#f1f5f9",borderRadius:3}}>
        <div style={{width:p+"%",height:"100%",borderRadius:3,background:color}}/>
      </div>
    </div>
  );
};

const IntStatus = ({status}) => {
  const m = {Connected:{c:"#059669",b:"rgba(16,185,129,.1)",dot:"#10b981"},Disconnected:{c:"#64748b",b:"rgba(100,116,139,.1)",dot:"#94a3b8"},Error:{c:"#dc2626",b:"rgba(239,68,68,.1)",dot:"#ef4444"}};
  const s = m[status]||m.Disconnected;
  return <span className="stat-chip" style={{color:s.c,background:s.b}}><span style={{width:6,height:6,borderRadius:"50%",background:s.dot,display:"inline-block"}}></span>{status}</span>;
};

/* ── SHELL ────────────────────────────────────────────────────────────────── */
const Shell = ({children,section,setSection}) => {
  const navGroups = [
    { label:"General", items:[
      { id:"general",  icon:"⚙", label:"General Settings" },
      { id:"org",      icon:"🏢", label:"Organisation Profile" },
    ]},
    { label:"Master Data", items:[
      { id:"clients",     icon:"👤", label:"Clients" },
      { id:"departments", icon:"🏗",  label:"Departments" },
      { id:"skills",      icon:"🎯",  label:"Skills & Roles" },
      { id:"costcenters", icon:"💰",  label:"Cost Centers" },
    ]},
    { label:"System", items:[
      { id:"integrations", icon:"🔌", label:"Integrations" },
      { id:"audittrail",   icon:"📋",  label:"Audit Trail" },
    ]},
  ];

  return (
    <>
      <style>{css}</style>
      <div style={{display:"flex",minHeight:"100vh",background:"#f4f6fb"}}>
        {/* Sidebar */}
        <div style={{width:220,background:"#1e1b4b",position:"fixed",top:0,left:0,height:"100vh",display:"flex",flexDirection:"column",padding:"0 0 16px",zIndex:100}}>
          <div style={{padding:"20px 18px 14px",borderBottom:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:14.5,fontWeight:700,color:"#fff",letterSpacing:-0.3}}>IT Services CRM</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginTop:2}}>Enterprise Platform</div>
          </div>
          <nav style={{flex:1,overflowY:"auto",padding:"10px 8px"}}>
            {[{id:"dashboard",label:"Dashboard",icon:"◉"},{id:"requirements",label:"Requirements",icon:"📋"},{id:"sow",label:"SOW",icon:"📄"},{id:"projects",label:"Projects",icon:"📁"},{id:"resources",label:"Resources",icon:"👥"},{id:"timesheet",label:"Timesheets",icon:"🕐"},{id:"invoices",label:"Invoices",icon:"🧾"},{id:"approvals",label:"Approvals",icon:"✅"}].map(n=>(
              <div key={n.id} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 10px",borderRadius:7,cursor:"pointer",color:"rgba(255,255,255,.45)",fontSize:13.5,marginBottom:1}}>
                <span style={{fontSize:13}}>{n.icon}</span>{n.label}
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:9,padding:"8px 10px",borderRadius:7,cursor:"pointer",background:"rgba(255,255,255,.12)",color:"#fff",fontSize:13.5,fontWeight:600,marginBottom:1}}>
              <span style={{fontSize:13}}>⚙</span>Settings
            </div>
          </nav>
        </div>

        {/* Content */}
        <div style={{marginLeft:220,flex:1,display:"flex"}}>
          {/* Settings sub-nav */}
          <div style={{width:210,background:"#fff",borderRight:"1px solid #e2e8f0",minHeight:"100vh",padding:"16px 10px",position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:"#0f172a",padding:"4px 14px 12px"}}>Settings</div>
            {navGroups.map(g=>(
              <div key={g.label}>
                <div className="settings-nav-group">{g.label}</div>
                {g.items.map(it=>(
                  <div key={it.id} className={`settings-nav-item${section===it.id?" active":""}`} onClick={()=>setSection(it.id)}>
                    <span style={{fontSize:14}}>{it.icon}</span>{it.label}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Main */}
          <div style={{flex:1,padding:"28px 32px",maxWidth:1100}}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

/* ── PAGE HEADER ──────────────────────────────────────────────────────────── */
const PageHeader = ({title,sub,actions}) => (
  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24}}>
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
        <div style={{width:6,height:26,borderRadius:3,background:"linear-gradient(180deg,#4f46e5,#818cf8)"}}/>
        <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a",letterSpacing:-0.4}}>{title}</h1>
      </div>
      {sub&&<div style={{fontSize:13,color:"#64748b",marginLeft:16}}>{sub}</div>}
    </div>
    {actions&&<div style={{display:"flex",gap:8}}>{actions}</div>}
  </div>
);

/* ── FIELD HELPER ─────────────────────────────────────────────────────────── */
const Field = ({label,half,children}) => (
  <div style={{gridColumn:half?"span 1":"span 2"}}>
    <label className="field-label">{label}</label>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   GENERAL SETTINGS
═══════════════════════════════════════════════════════════ */
const GeneralSettings = ({showToast}) => {
  const [form,setForm] = useState({
    defaultCurrency:"USD", timezone:"Asia/Kolkata (IST, UTC+5:30)",
    fiscalYearStart:"April", dateFormat:"DD/MM/YYYY",
    timesheetCycle:"Weekly", approvalReminder:"48",
    invoicePrefix:"INV", sowPrefix:"SOW", projectPrefix:"PRJ",
    maxTimesheetHours:"60", overtimeThreshold:"45",
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const [saved,setSaved] = useState(false);
  const handleSave = () => { setSaved(true); showToast("General settings saved"); setTimeout(()=>setSaved(false),2500); };

  return (
    <>
      <PageHeader title="General Settings" sub="Platform-wide defaults for time, currency, and workflow behaviour"/>
      <div className="section-card">
        <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:18,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>Locale &amp; Display</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Field label="Default Currency" half>
            <select className="fsel" style={{width:"100%"}} value={form.defaultCurrency} onChange={e=>set("defaultCurrency",e.target.value)}>
              {["USD","EUR","GBP","INR","AUD","SGD"].map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Timezone" half>
            <select className="fsel" style={{width:"100%"}} value={form.timezone} onChange={e=>set("timezone",e.target.value)}>
              {["Asia/Kolkata (IST, UTC+5:30)","America/New_York (EST, UTC-5)","Europe/London (GMT, UTC+0)","Asia/Singapore (SGT, UTC+8)","Australia/Sydney (AEDT, UTC+11)"].map(t=><option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Fiscal Year Start" half>
            <select className="fsel" style={{width:"100%"}} value={form.fiscalYearStart} onChange={e=>set("fiscalYearStart",e.target.value)}>
              {["January","April","July","October"].map(m=><option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Date Format" half>
            <select className="fsel" style={{width:"100%"}} value={form.dateFormat} onChange={e=>set("dateFormat",e.target.value)}>
              {["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD"].map(f=><option key={f}>{f}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="section-card">
        <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:18,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>Timesheet &amp; Workflow</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Field label="Timesheet Cycle" half>
            <select className="fsel" style={{width:"100%"}} value={form.timesheetCycle} onChange={e=>set("timesheetCycle",e.target.value)}>
              {["Weekly","Bi-weekly","Monthly"].map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Approval Reminder (hours before due)" half>
            <input className="finput" type="number" value={form.approvalReminder} onChange={e=>set("approvalReminder",e.target.value)}/>
          </Field>
          <Field label="Max Timesheet Hours / Week" half>
            <input className="finput" type="number" value={form.maxTimesheetHours} onChange={e=>set("maxTimesheetHours",e.target.value)}/>
          </Field>
          <Field label="Overtime Threshold (hrs/week)" half>
            <input className="finput" type="number" value={form.overtimeThreshold} onChange={e=>set("overtimeThreshold",e.target.value)}/>
          </Field>
        </div>
      </div>

      <div className="section-card">
        <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:18,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>ID Prefixes</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          {[["Invoice Prefix","invoicePrefix"],["SOW Prefix","sowPrefix"],["Project Prefix","projectPrefix"]].map(([label,key])=>(
            <div key={key}>
              <label className="field-label">{label}</label>
              <input className="finput" value={form[key]} onChange={e=>set(key,e.target.value)}/>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button className="btn-primary" onClick={handleSave}>{saved?"✓ Saved":"Save Settings"}</button>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   ORG PROFILE
═══════════════════════════════════════════════════════════ */
const OrgProfile = ({showToast}) => {
  const [form,setForm] = useState({
    orgName:"Infocraft Solutions Pvt. Ltd.", regNumber:"U72900MH2015PTC123456",
    industry:"IT Services", size:"201–500", website:"https://infocraft.io",
    email:"admin@infocraft.io", phone:"+91 22 4000 5000",
    address:"Level 12, One BKC, Bandra Kurla Complex", city:"Mumbai", state:"Maharashtra", country:"India", zip:"400051",
    primaryContact:"Ravi Shankar", contactTitle:"CEO",
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <>
      <PageHeader title="Organisation Profile" sub="Legal entity details and primary contact information"/>
      <div className="section-card">
        <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:18,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>Company Details</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Field label="Organisation Name"><input className="finput" value={form.orgName} onChange={e=>set("orgName",e.target.value)}/></Field>
          <Field label="Registration Number"><input className="finput" value={form.regNumber} onChange={e=>set("regNumber",e.target.value)}/></Field>
          <Field label="Industry" half>
            <select className="fsel" style={{width:"100%"}} value={form.industry} onChange={e=>set("industry",e.target.value)}>
              {["IT Services","Consulting","SaaS","BPO","Staffing"].map(i=><option key={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Company Size" half>
            <select className="fsel" style={{width:"100%"}} value={form.size} onChange={e=>set("size",e.target.value)}>
              {["1–50","51–200","201–500","501–1000","1000+"].map(s=><option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Website"><input className="finput" value={form.website} onChange={e=>set("website",e.target.value)}/></Field>
          <Field label="Email"><input className="finput" value={form.email} onChange={e=>set("email",e.target.value)}/></Field>
        </div>
      </div>
      <div className="section-card">
        <div style={{fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:18,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>Registered Address</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Field label="Street Address"><input className="finput" value={form.address} onChange={e=>set("address",e.target.value)}/></Field>
          <Field label="City" half><input className="finput" value={form.city} onChange={e=>set("city",e.target.value)}/></Field>
          <Field label="State" half><input className="finput" value={form.state} onChange={e=>set("state",e.target.value)}/></Field>
          <Field label="Country" half><input className="finput" value={form.country} onChange={e=>set("country",e.target.value)}/></Field>
          <Field label="Postal Code" half><input className="finput" value={form.zip} onChange={e=>set("zip",e.target.value)}/></Field>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button className="btn-primary" onClick={()=>showToast("Organisation profile saved")}>Save Profile</button>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   GENERIC MASTER TABLE
═══════════════════════════════════════════════════════════ */
const MasterTable = ({title,sub,columns,rows,onAdd,onEdit,onDelete,addLabel="Add"}) => {
  const [search,setSearch] = useState("");
  const filtered = useMemo(()=>rows.filter(r=>
    columns.some(c=>String(r[c.key]||"").toLowerCase().includes(search.toLowerCase()))
  ),[rows,search,columns]);
  return (
    <>
      <PageHeader title={title} sub={sub}
        actions={<button className="btn-primary" onClick={onAdd}>+ {addLabel}</button>}/>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <div style={{position:"relative",flex:1,maxWidth:340}}>
          <input className="finput" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:34}}/>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#94a3b8"}}>🔍</span>
        </div>
        <div style={{marginLeft:"auto",fontSize:12.5,color:"#94a3b8"}}>{filtered.length} of {rows.length} records</div>
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:"#f8fafc",borderBottom:"1px solid #e8ecf3"}}>
              {columns.map(c=><th key={c.key} style={{padding:"12px 14px",textAlign:"left",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,fontWeight:600,whiteSpace:"nowrap"}}>{c.label}</th>)}
              <th style={{padding:"12px 14px",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,fontWeight:600}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={columns.length+1} style={{padding:36,textAlign:"center",color:"#94a3b8"}}>No records found.</td></tr>}
            {filtered.map(row=>(
              <tr key={row.id} className="trow" style={{borderBottom:"1px solid #f1f5f9"}}>
                {columns.map(c=>(
                  <td key={c.key} style={{padding:"11px 14px",...(c.style||{})}}>
                    {c.render ? c.render(row[c.key],row) : <span style={{fontSize:13,color:"#374151"}}>{row[c.key]||"—"}</span>}
                  </td>
                ))}
                <td style={{padding:"11px 14px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button className="btn-ghost" style={{padding:"5px 12px",fontSize:12}} onClick={()=>onEdit(row)}>Edit</button>
                    <button className="btn-danger" onClick={()=>onDelete(row.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ── STATUS BADGE ─────────────────────────────────────────────────────────── */
const StatusDot = ({s}) => {
  const m={Active:{c:"#059669",b:"rgba(16,185,129,.1)"},Inactive:{c:"#94a3b8",b:"rgba(148,163,184,.1)"}};
  const {c,b}=m[s]||m.Inactive;
  return <span className="stat-chip" style={{color:c,background:b}}><span style={{width:5,height:5,borderRadius:"50%",background:c,display:"inline-block"}}></span>{s}</span>;
};

/* ═══════════════════════════════════════════════════════════
   CLIENTS
═══════════════════════════════════════════════════════════ */
const Clients = ({showToast}) => {
  const [rows,setRows] = useState(INIT_CLIENTS);
  const [modal,setModal] = useState(null); // null | {mode:"add"|"edit", data}
  const blank = {id:"",name:"",industry:"Technology",region:"North America",status:"Active",contact:"",email:""};
  const [form,setForm] = useState(blank);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const openAdd = () => { setForm({...blank}); setModal({mode:"add"}); };
  const openEdit = (row) => { setForm({...row}); setModal({mode:"edit"}); };
  const handleSave = () => {
    if(modal.mode==="add"){
      setRows(r=>[...r,{...form,id:uid("CLT")}]);
      showToast("Client added");
    } else {
      setRows(r=>r.map(x=>x.id===form.id?form:x));
      showToast("Client updated");
    }
    setModal(null);
  };
  const handleDelete = id => { setRows(r=>r.filter(x=>x.id!==id)); showToast("Client removed","#dc2626"); };

  const cols = [
    {key:"id",    label:"ID",       style:{fontFamily:"monospace",fontSize:12,color:"#6366f1",fontWeight:600}},
    {key:"name",  label:"Client",   render:(v)=><span style={{fontWeight:600,color:"#0f172a"}}>{v}</span>},
    {key:"industry",label:"Industry"},
    {key:"region",label:"Region"},
    {key:"contact",label:"Contact", render:(v,r)=>(
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <Avatar name={v} size={24}/><div><div style={{fontSize:12.5,fontWeight:600,color:"#374151"}}>{v}</div><div style={{fontSize:11,color:"#94a3b8"}}>{r.email}</div></div>
      </div>
    )},
    {key:"status",label:"Status",   render:(v)=><StatusDot s={v}/>},
  ];
  return (
    <>
      <MasterTable title="Clients" sub="Client accounts linked across SOWs, projects, and invoices" columns={cols} rows={rows} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} addLabel="Client"/>
      {modal&&(
        <div className="modal-backdrop" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:700,marginBottom:20}}>{modal.mode==="add"?"Add Client":"Edit Client"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{gridColumn:"span 2"}}><label className="field-label">Client Name</label><input className="finput" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
              <div><label className="field-label">Industry</label>
                <select className="fsel" style={{width:"100%"}} value={form.industry} onChange={e=>set("industry",e.target.value)}>
                  {["Technology","Finance","Retail","Energy","Legal","Healthcare","Manufacturing","Other"].map(i=><option key={i}>{i}</option>)}
                </select>
              </div>
              <div><label className="field-label">Region</label>
                <select className="fsel" style={{width:"100%"}} value={form.region} onChange={e=>set("region",e.target.value)}>
                  {["North America","EMEA","APAC","LATAM","Global"].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div><label className="field-label">Primary Contact</label><input className="finput" value={form.contact} onChange={e=>set("contact",e.target.value)}/></div>
              <div><label className="field-label">Contact Email</label><input className="finput" value={form.email} onChange={e=>set("email",e.target.value)}/></div>
              <div><label className="field-label">Status</label>
                <select className="fsel" style={{width:"100%"}} value={form.status} onChange={e=>set("status",e.target.value)}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:22}}>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>{modal.mode==="add"?"Add Client":"Save Changes"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   DEPARTMENTS
═══════════════════════════════════════════════════════════ */
const Departments = ({showToast}) => {
  const [rows,setRows] = useState(INIT_DEPARTMENTS);
  const [modal,setModal] = useState(null);
  const blank = {id:"",name:"",head:"",headcount:"",costCenter:"",status:"Active"};
  const [form,setForm] = useState(blank);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const openAdd = () => { setForm({...blank}); setModal({mode:"add"}); };
  const openEdit = (row) => { setForm({...row}); setModal({mode:"edit"}); };
  const handleSave = () => {
    if(modal.mode==="add"){setRows(r=>[...r,{...form,id:uid("DEPT")}]);showToast("Department added");}
    else{setRows(r=>r.map(x=>x.id===form.id?form:x));showToast("Department updated");}
    setModal(null);
  };
  const handleDelete = id => { setRows(r=>r.filter(x=>x.id!==id)); showToast("Department removed","#dc2626"); };

  const cols = [
    {key:"id",     label:"ID",    style:{fontFamily:"monospace",fontSize:12,color:"#6366f1",fontWeight:600}},
    {key:"name",   label:"Name",  render:v=><span style={{fontWeight:600,color:"#0f172a"}}>{v}</span>},
    {key:"head",   label:"Head",  render:v=><div style={{display:"flex",alignItems:"center",gap:7}}><Avatar name={v} size={24}/><span style={{fontSize:13,color:"#374151"}}>{v}</span></div>},
    {key:"headcount",label:"Headcount",render:v=><Badge label={v+" people"} color="#4f46e5"/>},
    {key:"costCenter",label:"Cost Center",style:{fontFamily:"monospace",fontSize:12,color:"#0891b2"}},
    {key:"status", label:"Status",render:v=><StatusDot s={v}/>},
  ];
  return (
    <>
      <MasterTable title="Departments" sub="Organisational units and their resource allocation mapping" columns={cols} rows={rows} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} addLabel="Department"/>
      {modal&&(
        <div className="modal-backdrop" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:700,marginBottom:20}}>{modal.mode==="add"?"Add Department":"Edit Department"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{gridColumn:"span 2"}}><label className="field-label">Department Name</label><input className="finput" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
              <div><label className="field-label">Department Head</label><input className="finput" value={form.head} onChange={e=>set("head",e.target.value)}/></div>
              <div><label className="field-label">Headcount</label><input className="finput" type="number" value={form.headcount} onChange={e=>set("headcount",e.target.value)}/></div>
              <div><label className="field-label">Cost Center</label><input className="finput" value={form.costCenter} onChange={e=>set("costCenter",e.target.value)} placeholder="e.g. CC-1001"/></div>
              <div><label className="field-label">Status</label>
                <select className="fsel" style={{width:"100%"}} value={form.status} onChange={e=>set("status",e.target.value)}><option>Active</option><option>Inactive</option></select>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:22}}>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>{modal.mode==="add"?"Add Department":"Save Changes"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   SKILLS & ROLES
═══════════════════════════════════════════════════════════ */
const DEMAND_META = {High:{c:"#dc2626",b:"rgba(239,68,68,.1)"},Medium:{c:"#d97706",b:"rgba(245,158,11,.1)"},Low:{c:"#64748b",b:"rgba(100,116,139,.1)"}};
const Skills = ({showToast}) => {
  const [rows,setRows] = useState(INIT_SKILLS);
  const [catFilter,setCatFilter] = useState("All");
  const [modal,setModal] = useState(null);
  const blank = {id:"",name:"",category:"Frontend",demand:"Medium",status:"Active"};
  const [form,setForm] = useState(blank);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const cats = ["All",...Array.from(new Set(INIT_SKILLS.map(s=>s.category)))];
  const filtered = catFilter==="All"?rows:rows.filter(r=>r.category===catFilter);
  const openAdd = () => { setForm({...blank}); setModal({mode:"add"}); };
  const openEdit = row => { setForm({...row}); setModal({mode:"edit"}); };
  const handleSave = () => {
    if(modal.mode==="add"){setRows(r=>[...r,{...form,id:uid("SKL")}]);showToast("Skill added");}
    else{setRows(r=>r.map(x=>x.id===form.id?form:x));showToast("Skill updated");}
    setModal(null);
  };
  const handleDelete = id => { setRows(r=>r.filter(x=>x.id!==id)); showToast("Skill removed","#dc2626"); };

  return (
    <>
      <PageHeader title="Skills &amp; Roles" sub="Skill taxonomy used in resource requests, requirements, and allocation"
        actions={<button className="btn-primary" onClick={openAdd}>+ Add Skill</button>}/>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCatFilter(c)}
            style={{padding:"6px 14px",borderRadius:20,border:"1px solid",fontSize:12.5,fontWeight:500,cursor:"pointer",
              background:catFilter===c?"#4f46e5":"#fff",color:catFilter===c?"#fff":"#374151",borderColor:catFilter===c?"#4f46e5":"#e2e8f0"}}>
            {c}
          </button>
        ))}
        <span style={{marginLeft:"auto",fontSize:12.5,color:"#94a3b8",alignSelf:"center"}}>{filtered.length} skills</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
        {filtered.map(s=>{
          const d=DEMAND_META[s.demand]||DEMAND_META.Medium;
          return (
            <div key={s.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontWeight:600,color:"#0f172a",fontSize:14,marginBottom:5}}>{s.name}</div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <Badge label={s.category} color="#0891b2"/>
                  <span className="stat-chip" style={{color:d.c,background:d.b,fontSize:11}}>{s.demand} Demand</span>
                  {s.status==="Inactive"&&<StatusDot s="Inactive"/>}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <button className="btn-ghost" style={{padding:"4px 10px",fontSize:11.5}} onClick={()=>openEdit(s)}>Edit</button>
                <button className="btn-danger" style={{padding:"4px 10px",fontSize:11.5}} onClick={()=>handleDelete(s.id)}>Del</button>
              </div>
            </div>
          );
        })}
      </div>
      {modal&&(
        <div className="modal-backdrop" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:700,marginBottom:20}}>{modal.mode==="add"?"Add Skill":"Edit Skill"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{gridColumn:"span 2"}}><label className="field-label">Skill / Role Name</label><input className="finput" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
              <div><label className="field-label">Category</label>
                <select className="fsel" style={{width:"100%"}} value={form.category} onChange={e=>set("category",e.target.value)}>
                  {["Frontend","Backend","Cloud","DevOps","Data","Design","CRM","Other"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="field-label">Demand Level</label>
                <select className="fsel" style={{width:"100%"}} value={form.demand} onChange={e=>set("demand",e.target.value)}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
              <div><label className="field-label">Status</label>
                <select className="fsel" style={{width:"100%"}} value={form.status} onChange={e=>set("status",e.target.value)}><option>Active</option><option>Inactive</option></select>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:22}}>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>{modal.mode==="add"?"Add Skill":"Save Changes"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   COST CENTERS
═══════════════════════════════════════════════════════════ */
const CostCenters = ({showToast}) => {
  const [rows,setRows] = useState(INIT_COSTCENTERS);
  const [modal,setModal] = useState(null);
  const blank = {id:"",name:"",budget:"",spent:"",owner:"",status:"Active"};
  const [form,setForm] = useState(blank);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const openAdd = () => { setForm({...blank}); setModal({mode:"add"}); };
  const openEdit = row => { setForm({...row}); setModal({mode:"edit"}); };
  const handleSave = () => {
    if(modal.mode==="add"){setRows(r=>[...r,{...form,id:uid("CC"),budget:Number(form.budget),spent:Number(form.spent)}]);showToast("Cost center added");}
    else{setRows(r=>r.map(x=>x.id===form.id?{...form,budget:Number(form.budget),spent:Number(form.spent)}:x));showToast("Cost center updated");}
    setModal(null);
  };
  const handleDelete = id => { setRows(r=>r.filter(x=>x.id!==id)); showToast("Cost center removed","#dc2626"); };

  const cols = [
    {key:"id",    label:"ID",      style:{fontFamily:"monospace",fontSize:12,color:"#0891b2",fontWeight:600}},
    {key:"name",  label:"Name",    render:v=><span style={{fontWeight:600,color:"#0f172a"}}>{v}</span>},
    {key:"owner", label:"Owner",   render:v=><div style={{display:"flex",alignItems:"center",gap:6}}><Avatar name={v} size={22}/><span style={{fontSize:12.5,color:"#374151"}}>{v}</span></div>},
    {key:"budget",label:"Budget",  render:v=><span style={{fontSize:13,color:"#374151",fontWeight:500}}>{fmt$(v)}</span>},
    {key:"spent", label:"Spend vs Budget", render:(v,row)=><div style={{minWidth:160}}><SpendBar spent={v} budget={row.budget}/></div>},
    {key:"status",label:"Status",  render:v=><StatusDot s={v}/>},
  ];
  return (
    <>
      <MasterTable title="Cost Centers" sub="Budget allocation and spend tracking per organisational unit" columns={cols} rows={rows} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} addLabel="Cost Center"/>
      {modal&&(
        <div className="modal-backdrop" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:700,marginBottom:20}}>{modal.mode==="add"?"Add Cost Center":"Edit Cost Center"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{gridColumn:"span 2"}}><label className="field-label">Cost Center Name</label><input className="finput" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
              <div><label className="field-label">Annual Budget (USD)</label><input className="finput" type="number" value={form.budget} onChange={e=>set("budget",e.target.value)}/></div>
              <div><label className="field-label">YTD Spend (USD)</label><input className="finput" type="number" value={form.spent} onChange={e=>set("spent",e.target.value)}/></div>
              <div><label className="field-label">Owner</label><input className="finput" value={form.owner} onChange={e=>set("owner",e.target.value)}/></div>
              <div><label className="field-label">Status</label>
                <select className="fsel" style={{width:"100%"}} value={form.status} onChange={e=>set("status",e.target.value)}><option>Active</option><option>Inactive</option></select>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:22}}>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>{modal.mode==="add"?"Add Cost Center":"Save Changes"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   INTEGRATIONS
═══════════════════════════════════════════════════════════ */
const Integrations = ({showToast}) => {
  const [ints,setInts] = useState(INTEGRATIONS);
  const [modal,setModal] = useState(null);

  const toggle = (id) => {
    setInts(prev=>prev.map(i=>{
      if(i.id!==id) return i;
      const ns = i.status==="Connected"?"Disconnected":"Connected";
      showToast(ns==="Connected"?`${i.name} connected`:`${i.name} disconnected`, ns==="Connected"?"#059669":"#dc2626");
      return {...i,status:ns,lastSync:ns==="Connected"?"Just now":i.lastSync};
    }));
  };

  const cats = Array.from(new Set(INTEGRATIONS.map(i=>i.category)));
  const [activeCat,setActiveCat] = useState("All");
  const visible = activeCat==="All"?ints:ints.filter(i=>i.category===activeCat);

  return (
    <>
      <PageHeader title="Integrations" sub="Connected systems and third-party service configurations"/>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {["All",...cats].map(c=>(
          <button key={c} onClick={()=>setActiveCat(c)}
            style={{padding:"6px 14px",borderRadius:20,border:"1px solid",fontSize:12.5,fontWeight:500,cursor:"pointer",
              background:activeCat===c?"#4f46e5":"#fff",color:activeCat===c?"#fff":"#374151",borderColor:activeCat===c?"#4f46e5":"#e2e8f0"}}>
            {c}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {visible.map(i=>(
          <div key={i.id} style={{background:"#fff",border:`1px solid ${i.status==="Error"?"#fca5a5":i.status==="Connected"?"#e2e8f0":"#e2e8f0"}`,borderRadius:14,padding:"18px 20px",display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                  {i.icon}
                </div>
                <div>
                  <div style={{fontWeight:700,color:"#0f172a",fontSize:14.5}}>{i.name}</div>
                  <div style={{fontSize:11.5,color:"#94a3b8",marginTop:1}}>{i.category}</div>
                </div>
              </div>
              <IntStatus status={i.status}/>
            </div>
            <div style={{fontSize:12.5,color:"#64748b",lineHeight:1.5}}>{i.desc}</div>
            {i.status==="Error"&&(
              <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#dc2626"}}>
                ⚠ Sync failed. Last successful sync: {i.lastSync}. Check credentials.
              </div>
            )}
            {i.status!=="Error"&&(
              <div style={{fontSize:11.5,color:"#94a3b8"}}>Last sync: {i.lastSync}</div>
            )}
            <div style={{display:"flex",gap:8,marginTop:2}}>
              <button className="btn-ghost" style={{flex:1,fontSize:12.5}} onClick={()=>setModal(i)}>Configure</button>
              <button onClick={()=>toggle(i.id)}
                style={{flex:1,border:"1px solid",borderRadius:8,padding:"7px",fontSize:12.5,fontWeight:600,cursor:"pointer",
                  background:i.status==="Connected"?"#fef2f2":"#f0fdf4",
                  color:i.status==="Connected"?"#dc2626":"#059669",
                  borderColor:i.status==="Connected"?"#fca5a5":"#86efac"}}>
                {i.status==="Connected"?"Disconnect":"Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal&&(
        <div className="modal-backdrop" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <div style={{width:40,height:40,borderRadius:10,background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{modal.icon}</div>
              <div>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:700}}>{modal.name} — Configuration</div>
                <div style={{fontSize:12.5,color:"#94a3b8"}}>{modal.category}</div>
              </div>
            </div>
            <div style={{display:"grid",gap:14}}>
              <div><label className="field-label">API Endpoint / Base URL</label><input className="finput" defaultValue="https://api.example.com/v2" placeholder="https://…"/></div>
              <div><label className="field-label">API Key / Token</label><input className="finput" type="password" defaultValue="••••••••••••••••" placeholder="Paste API key…"/></div>
              <div><label className="field-label">Sync Frequency</label>
                <select className="fsel" style={{width:"100%"}} defaultValue="Every hour">
                  {["Real-time","Every 15 min","Every hour","Every 6 hours","Daily"].map(f=><option key={f}>{f}</option>)}
                </select>
              </div>
              <div><label className="field-label">Webhook URL (inbound)</label><input className="finput" readOnly value={"https://itscrm.infocraft.io/webhooks/"+modal.id} style={{background:"#f8fafc",color:"#64748b"}}/></div>
            </div>
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 14px",marginTop:16,fontSize:12.5,color:"#64748b"}}>
              Changes are validated before saving. Test connection before disconnecting your current live sync.
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:18}}>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn-ghost" style={{color:"#059669",borderColor:"#86efac"}} onClick={()=>{showToast("Connection test passed","#059669");setModal(null);}}>Test Connection</button>
              <button className="btn-primary" onClick={()=>{showToast(`${modal.name} configuration saved`);setModal(null);}}>Save Config</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   AUDIT TRAIL (read-only log view)
═══════════════════════════════════════════════════════════ */
const AUDIT_SEED = [
  { id:"AUD-001", action:"Settings Updated",    user:"Ravi Shankar",  module:"General Settings", detail:"Fiscal year start changed: January → April",                 ts:"2026-03-12 09:14" },
  { id:"AUD-002", action:"Integration Toggled", user:"Priya Mehta",   module:"Integrations",     detail:"Salesforce disconnected",                                     ts:"2026-03-11 16:05" },
  { id:"AUD-003", action:"Record Added",        user:"Karthik Nair",  module:"Skills",            detail:"Skill 'Terraform' added to DevOps category",                  ts:"2026-03-11 11:30" },
  { id:"AUD-004", action:"Record Deleted",      user:"Dana Mercer",   module:"Clients",           detail:"Client 'OldClient Ltd.' (CLT-099) removed",                  ts:"2026-03-10 17:22" },
  { id:"AUD-005", action:"Record Updated",      user:"Rachel Kim",    module:"Departments",       detail:"Dept head for 'Cloud Practice' updated to Theo Vasquez",      ts:"2026-03-10 14:40" },
  { id:"AUD-006", action:"Settings Updated",    user:"Ravi Shankar",  module:"General Settings", detail:"Timesheet cycle changed: Monthly → Weekly",                  ts:"2026-03-09 10:00" },
  { id:"AUD-007", action:"Integration Toggled", user:"Priya Mehta",   module:"Integrations",     detail:"DocuSign connected. Webhook registered.",                     ts:"2026-03-08 09:55" },
  { id:"AUD-008", action:"Record Added",        user:"Sam Keller",    module:"Cost Centers",     detail:"Cost Center 'Legal & Compliance' (CC-1008) added",        ts:"2026-03-07 15:10" },
];
const ACTION_META = {
  "Settings Updated":    {c:"#4f46e5",b:"rgba(99,102,241,.1)"},
  "Integration Toggled": {c:"#0891b2",b:"rgba(8,145,178,.1)"},
  "Record Added":        {c:"#059669",b:"rgba(16,185,129,.1)"},
  "Record Updated":      {c:"#d97706",b:"rgba(245,158,11,.1)"},
  "Record Deleted":      {c:"#dc2626",b:"rgba(239,68,68,.1)"},
};
const AuditTrail = () => {
  const [search,setSearch] = useState("");
  const [moduleFilter,setModuleFilter] = useState("All");
  const modules = ["All",...Array.from(new Set(AUDIT_SEED.map(a=>a.module)))];
  const rows = useMemo(()=>AUDIT_SEED.filter(a=>{
    const ms = moduleFilter==="All"||a.module===moduleFilter;
    const ss = !search||[a.user,a.detail,a.action].some(x=>x.toLowerCase().includes(search.toLowerCase()));
    return ms&&ss;
  }),[search,moduleFilter]);
  return (
    <>
      <PageHeader title="Audit Trail" sub="Immutable log of all settings and master data changes"/>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative"}}>
          <input className="finput" placeholder="Search events…" value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:34,width:280}}/>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#94a3b8"}}>🔍</span>
        </div>
        <select className="fsel" value={moduleFilter} onChange={e=>setModuleFilter(e.target.value)}>
          {modules.map(m=><option key={m}>{m}</option>)}
        </select>
        <span style={{marginLeft:"auto",fontSize:12.5,color:"#94a3b8"}}>{rows.length} events</span>
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:"#f8fafc",borderBottom:"1px solid #e8ecf3"}}>
              {["Event ID","Action","Module","User","Detail","Timestamp"].map(h=>(
                <th key={h} style={{padding:"12px 14px",textAlign:"left",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.7,fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(a=>{
              const m=ACTION_META[a.action]||ACTION_META["Settings Updated"];
              return(
                <tr key={a.id} className="trow" style={{borderBottom:"1px solid #f1f5f9"}}>
                  <td style={{padding:"11px 14px",fontFamily:"monospace",fontSize:11.5,color:"#94a3b8"}}>{a.id}</td>
                  <td style={{padding:"11px 14px"}}><span className="stat-chip" style={{color:m.c,background:m.b}}>{a.action}</span></td>
                  <td style={{padding:"11px 14px",fontSize:12.5,color:"#374151"}}>{a.module}</td>
                  <td style={{padding:"11px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><Avatar name={a.user} size={22}/><span style={{fontSize:12.5,color:"#374151"}}>{a.user}</span></div>
                  </td>
                  <td style={{padding:"11px 14px",fontSize:12.5,color:"#64748b",maxWidth:320}}>{a.detail}</td>
                  <td style={{padding:"11px 14px",fontSize:12,color:"#94a3b8",whiteSpace:"nowrap"}}>{a.ts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App(){
  const [section,setSection] = useState("general");
  const [toast,setToast] = useState(null);
  const showToast = (msg,color="#4f46e5") => { setToast({msg,color}); setTimeout(()=>setToast(null),2600); };

  const pages = {
    general:     <GeneralSettings showToast={showToast}/>,
    org:         <OrgProfile showToast={showToast}/>,
    clients:     <Clients showToast={showToast}/>,
    departments: <Departments showToast={showToast}/>,
    skills:      <Skills showToast={showToast}/>,
    costcenters: <CostCenters showToast={showToast}/>,
    integrations:<Integrations showToast={showToast}/>,
    audittrail:  <AuditTrail/>,
  };

  return (
    <>
      <Shell section={section} setSection={setSection}>
        {pages[section]||pages.general}
      </Shell>
      {toast&&<Toast msg={toast.msg} color={toast.color}/>}
    </>
  );
}
