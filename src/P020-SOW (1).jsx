import { useState, useMemo, useRef } from "react";

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

const FLOW = ["Draft","Submitted","Under Review","Approved","Active","Expired"];
const STATUS_META = {
  "Draft":        { color:"#94a3b8", bg:"rgba(148,163,184,0.1)", dot:"#94a3b8", next:"Submitted"    },
  "Submitted":    { color:"#d97706", bg:"rgba(245,158,11,0.1)",  dot:"#f59e0b", next:"Under Review" },
  "Under Review": { color:"#4f46e5", bg:"rgba(99,102,241,0.1)",  dot:"#6366f1", next:"Approved"     },
  "Approved":     { color:"#059669", bg:"rgba(16,185,129,0.1)",  dot:"#10b981", next:"Active"       },
  "Active":       { color:"#2563eb", bg:"rgba(59,130,246,0.1)",  dot:"#3b82f6", next:"Expired"      },
  "Expired":      { color:"#94a3b8", bg:"rgba(148,163,184,0.1)", dot:"#94a3b8", next:null           },
  "Terminated":   { color:"#dc2626", bg:"rgba(239,68,68,0.1)",   dot:"#ef4444", next:null           },
};

const SEED = [
  { id:"SOW-2026-041", title:"Nexus Digital Transformation Phase 1", client:"Nexus Corp", engagementName:"Nexus Digital Transformation", status:"Active", owner:"Dana Mercer", deliveryHead:"Rachel Kim", effectiveDate:"2026-02-01", expiryDate:"2026-12-31", signedDate:"2026-01-30", created:"2026-01-10", linkedRequirements:["SR-0041","SR-0047","SR-0053"], region:"North America", category:"Digital Transformation", amendmentCount:0, notes:"Signed by James Whitfield (VP Eng). Covers CRM integration, SSO, and notification platform.", document:{ name:"SOW-2026-041-v1.pdf", size:"1.8 MB", uploadedAt:"2026-01-30", uploadedBy:"Dana Mercer", version:"v1" },
    activity:[{date:"2026-01-10",user:"Dana Mercer",action:"SOW created",detail:"Initial draft registered"},{date:"2026-01-30",user:"Dana Mercer",action:"Document uploaded",detail:"SOW-2026-041-v1.pdf signed copy"},{date:"2026-02-01",user:"System",action:"Status: Active",detail:"Effective date reached"}] },
  { id:"SOW-2026-042", title:"Meridian Analytics Suite BI and Reporting", client:"Meridian Holdings", engagementName:"Meridian Analytics Suite", status:"Active", owner:"Lian Zhou", deliveryHead:"Tom Ashby", effectiveDate:"2026-02-15", expiryDate:"2026-09-30", signedDate:"2026-02-12", created:"2026-01-14", linkedRequirements:["SR-0042","SR-0048","SR-0054"], region:"Europe", category:"Data and Analytics", amendmentCount:1, notes:"GDPR data residency addendum included. Amendment 1 covers expanded data sources.", document:{ name:"SOW-2026-042-v2.pdf", size:"2.1 MB", uploadedAt:"2026-02-20", uploadedBy:"Lian Zhou", version:"v2" },
    activity:[{date:"2026-01-14",user:"Lian Zhou",action:"SOW created",detail:"Draft from RFP response"},{date:"2026-02-12",user:"Lian Zhou",action:"Document uploaded",detail:"SOW-2026-042-v1.pdf"},{date:"2026-02-20",user:"Lian Zhou",action:"Amendment 1",detail:"SOW-2026-042-v2.pdf expanded data sources"}] },
  { id:"SOW-2026-043", title:"BlueStar Mobile Commerce App and Portal", client:"BlueStar Retail", engagementName:"BlueStar Mobile Commerce", status:"Approved", owner:"Theo Vasquez", deliveryHead:"Dana Mercer", effectiveDate:"2026-03-01", expiryDate:"2026-10-31", signedDate:"2026-02-24", created:"2026-01-16", linkedRequirements:["SR-0043","SR-0049","SR-0055"], region:"APAC", category:"Digital Services", amendmentCount:0, notes:"Client brand guide received Feb 22. App store developer accounts confirmed.", document:{ name:"SOW-2026-043-v1.pdf", size:"3.2 MB", uploadedAt:"2026-02-24", uploadedBy:"Theo Vasquez", version:"v1" },
    activity:[{date:"2026-01-16",user:"Theo Vasquez",action:"SOW created",detail:"Draft from referral"},{date:"2026-02-24",user:"Theo Vasquez",action:"Document uploaded",detail:"SOW-2026-043-v1.pdf executed copy"}] },
  { id:"SOW-2026-044", title:"Orion Financial Cloud Migration", client:"Orion Financial", engagementName:"Orion Cloud Migration", status:"Active", owner:"Dana Mercer", deliveryHead:"Sam Keller", effectiveDate:"2026-02-10", expiryDate:"2026-06-30", signedDate:"2026-02-07", created:"2026-01-19", linkedRequirements:["SR-0044"], region:"North America", category:"Cloud Services", amendmentCount:0, notes:"Rate limiting and WAF policies are internal use only per Orion security classification.", document:{ name:"SOW-2026-044-v1.pdf", size:"1.2 MB", uploadedAt:"2026-02-07", uploadedBy:"Dana Mercer", version:"v1" },
    activity:[{date:"2026-01-19",user:"Dana Mercer",action:"SOW created",detail:"Direct engagement"},{date:"2026-02-07",user:"Dana Mercer",action:"Document uploaded",detail:"SOW-2026-044-v1.pdf"},{date:"2026-02-10",user:"System",action:"Status: Active",detail:"Effective date reached"}] },
  { id:"SOW-2026-045", title:"TrueNorth Legal Ops Compliance and Currency", client:"TrueNorth Law", engagementName:"TrueNorth Legal Ops", status:"Active", owner:"Sam Keller", deliveryHead:"Lian Zhou", effectiveDate:"2026-02-01", expiryDate:"2027-01-31", signedDate:"2026-01-28", created:"2026-01-22", linkedRequirements:["SR-0045","SR-0052"], region:"North America", category:"Managed Services", amendmentCount:0, notes:"Annual contract. SOC 2 Type II is a hard contractual requirement.", document:{ name:"SOW-2026-045-v1.pdf", size:"2.8 MB", uploadedAt:"2026-01-28", uploadedBy:"Sam Keller", version:"v1" },
    activity:[{date:"2026-01-22",user:"Sam Keller",action:"SOW created",detail:"From RFP annual managed services"},{date:"2026-01-28",user:"Sam Keller",action:"Document uploaded",detail:"SOW-2026-045-v1.pdf"}] },
  { id:"SOW-2026-046", title:"Summit Energy Cloud Lift and Inventory Sync", client:"Summit Energy", engagementName:"Summit Cloud Lift", status:"Under Review", owner:"Lian Zhou", deliveryHead:"Theo Vasquez", effectiveDate:"", expiryDate:"", signedDate:"", created:"2026-01-26", linkedRequirements:["SR-0046","SR-0051"], region:"North America", category:"IT Services", amendmentCount:0, notes:"On hold pending client infrastructure readiness sign-off.", document:null,
    activity:[{date:"2026-01-26",user:"Lian Zhou",action:"SOW created",detail:"Direct covers 2 requirements"},{date:"2026-02-10",user:"Theo Vasquez",action:"Status: Under Review",detail:"Infra readiness sign-off pending"}] },
  { id:"SOW-2026-048", title:"Meridian Predictive Analytics Engine", client:"Meridian Holdings", engagementName:"Meridian Analytics Suite", status:"Submitted", owner:"Sam Keller", deliveryHead:"Tom Ashby", effectiveDate:"", expiryDate:"", signedDate:"", created:"2026-02-04", linkedRequirements:["SR-0048"], region:"Europe", category:"Data and Analytics", amendmentCount:0, notes:"EU data residency addendum required. ML model accuracy SLA to be negotiated.", document:null,
    activity:[{date:"2026-02-04",user:"Sam Keller",action:"SOW created",detail:"From RFP ML engine"},{date:"2026-02-12",user:"Sam Keller",action:"Status: Submitted",detail:"Submitted to Meridian procurement"}] },
  { id:"SOW-2026-049", title:"BlueStar Customer Portal Redesign", client:"BlueStar Retail", engagementName:"BlueStar Mobile Commerce", status:"Draft", owner:"Dana Mercer", deliveryHead:"Dana Mercer", effectiveDate:"", expiryDate:"", signedDate:"", created:"2026-02-06", linkedRequirements:["SR-0049"], region:"APAC", category:"Digital Services", amendmentCount:0, notes:"WCAG 2.1 AA accessibility clause required.", document:null,
    activity:[{date:"2026-02-06",user:"Dana Mercer",action:"SOW created",detail:"Draft from referral SR-0049"}] },
  { id:"SOW-2026-054", title:"Meridian RBAC Security Module", client:"Meridian Holdings", engagementName:"Meridian Analytics Suite", status:"Approved", owner:"Lian Zhou", deliveryHead:"Tom Ashby", effectiveDate:"2026-03-01", expiryDate:"2026-07-31", signedDate:"2026-02-25", created:"2026-02-21", linkedRequirements:["SR-0054"], region:"Europe", category:"IT Services", amendmentCount:0, notes:"ISO 27001 alignment clause included. Pen test sign-off required before go-live.", document:{ name:"SOW-2026-054-v1.pdf", size:"0.9 MB", uploadedAt:"2026-02-25", uploadedBy:"Lian Zhou", version:"v1" },
    activity:[{date:"2026-02-21",user:"Lian Zhou",action:"SOW created",detail:"From RFP RBAC module"},{date:"2026-02-25",user:"Lian Zhou",action:"Document uploaded",detail:"SOW-2026-054-v1.pdf"}] },
];

const ALL_CLIENTS    = ["Nexus Corp","Meridian Holdings","BlueStar Retail","Orion Financial","TrueNorth Law","Summit Energy"];
const ALL_OWNERS     = ["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"];
const ALL_REGIONS    = ["North America","Europe","APAC","LATAM","MEA"];
const ALL_CATEGORIES = ["Digital Transformation","Data and Analytics","Digital Services","Cloud Services","IT Services","Managed Services","Contract Staffing","Other"];
const CLIENT_ENG     = { "Nexus Corp":"Nexus Digital Transformation","Meridian Holdings":"Meridian Analytics Suite","BlueStar Retail":"BlueStar Mobile Commerce","Orion Financial":"Orion Cloud Migration","TrueNorth Law":"TrueNorth Legal Ops","Summit Energy":"Summit Cloud Lift" };
const SALES_COLORS   = { "IT Services":"#2563eb","Digital Services":"#0891b2","Data & Analytics":"#059669","Managed Services":"#d97706","Cloud Services":"#4f46e5","Contract Staffing":"#8b5cf6" };

const fmt     = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
const fmtDate = d => { if(!d) return "—"; return new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); };
const daysLeft= d => { if(!d) return null; return Math.ceil((new Date(d)-new Date())/(864e5)); };
const avColor = n => `hsl(${((n||"").charCodeAt(0)*13)%360},50%,42%)`;
const initials= n => (n||"").split(" ").map(x=>x[0]).join("").toUpperCase();

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
  .trow:hover{background:#f8faff!important}.trow:hover .ra{opacity:1!important}.ra{opacity:0;transition:opacity .15s}
  .sth{cursor:pointer;user-select:none;white-space:nowrap}.sth:hover{color:#4f46e5}
  .sc{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .stitle{font-family:'Sora',sans-serif;font-size:12px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #f1f5f9}
  .dr{display:flex;align-items:flex-start;padding:9px 0;border-bottom:1px solid #f8fafc}
  .dl{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;min-width:130px;padding-top:2px;font-weight:600;flex-shrink:0}
  .dv{font-size:13.5px;color:#1e293b;flex:1}
  .fl{font-size:11px;color:#64748b;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.6px;font-weight:600}
  .fi{background:#fff;border:1px solid #e2e8f0;color:#1e293b;border-radius:8px;padding:9px 12px;font-size:13px;outline:none;transition:border .15s;width:100%}
  .fi:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}.fi::placeholder{color:#94a3b8}
  .fs{background:#fff;border:1px solid #e2e8f0;color:#374151;border-radius:8px;padding:8px 12px;font-size:13px;cursor:pointer;outline:none}
  .fs:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
  .bp{background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(99,102,241,.3)}
  .bp:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.4)}
  .bg{background:#fff;border:1px solid #e2e8f0;color:#64748b;border-radius:9px;padding:9px 16px;font-size:13px;cursor:pointer;transition:all .15s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .bg:hover{background:#f8fafc;color:#1e293b;border-color:#cbd5e1}
  .bd{background:#fff;border:1px solid #fecaca;color:#dc2626;border-radius:9px;padding:9px 16px;font-size:13px;cursor:pointer;transition:all .15s}
  .bd:hover{background:#fef2f2}
  .ai{background:#f8fafc;border:1px solid #e2e8f0;color:#94a3b8;border-radius:6px;padding:4px 9px;font-size:12px;cursor:pointer;margin-left:4px;transition:all .15s}
  .ai:hover{background:#eef2ff;color:#4f46e5;border-color:#c7d2fe}
  .cb{accent-color:#6366f1;width:15px;height:15px;cursor:pointer}
  .pb{background:#fff;border:1px solid #e2e8f0;color:#64748b;border-radius:7px;width:32px;height:32px;cursor:pointer;font-size:13px;transition:all .15s;display:flex;align-items:center;justify-content:center}
  .pb:hover:not(:disabled){background:#eef2ff;color:#4f46e5;border-color:#c7d2fe}.pb:disabled{opacity:.35;cursor:not-allowed}
  .pb.on{background:#6366f1;color:#fff;border-color:#6366f1}
  .tb{background:none;border:none;padding:10px 18px;font-size:13px;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;color:#94a3b8;transition:all .15s}
  .tb.on{color:#4f46e5;border-bottom-color:#4f46e5}.tb:hover:not(.on){color:#475569}
  .uz{border:2px dashed #e2e8f0;border-radius:12px;padding:28px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#fafbfc}
  .uz:hover,.uz.dov{border-color:#6366f1;background:#eef2ff}
  .statc{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px 24px;flex:1;min-width:160px;transition:border .2s,box-shadow .2s;box-shadow:0 1px 4px rgba(0,0,0,.05)}
  .statc:hover{border-color:#c7d2fe;box-shadow:0 4px 16px rgba(99,102,241,.1)}
  .toast{position:fixed;bottom:28px;right:28px;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:9999;animation:sup .3s ease}
  @keyframes sup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  .mb{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fdi .2s ease}
  @keyframes fdi{from{opacity:0}to{opacity:1}}
  .mx{background:#fff;border-radius:16px;padding:28px;width:100%;max-width:480px;box-shadow:0 24px 64px rgba(0,0,0,.2);animation:sci .2s ease}
  @keyframes sci{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
`;

function Shell({page,crumb,children}){
  return(
    <div style={{minHeight:"100vh",background:"#f4f6fb",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1e293b"}}>
      <style>{CSS}</style>
      <div style={{background:"#fff",borderBottom:"1px solid #e8ecf3",padding:"10px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 4px rgba(0,0,0,.04)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>CRM Platform</span>
          <span style={{color:"#cbd5e1"}}>›</span>
          <span style={{fontSize:12,color:"#94a3b8"}}>Sales</span>
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

function Badge({status}){
  const m = STATUS_META[status]||{color:"#94a3b8",bg:"rgba(148,163,184,0.1)",dot:"#94a3b8"};
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:6,background:m.bg,color:m.color,border:`1px solid ${m.color}30`,borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:500,whiteSpace:"nowrap"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:m.dot,flexShrink:0}}/>{status}
    </span>
  );
}

function Avatar({name,size=26}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:avColor(name||""),display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.42,fontWeight:700,color:"#fff",flexShrink:0}}>{initials(name||"")}</div>;
}

function SortIco({col,sc,sd}){
  return <span style={{marginLeft:4,opacity:sc===col?1:0.3,fontSize:10}}>{sc===col?(sd==="asc"?"▲":"▼"):"⇅"}</span>;
}

function DocUpload({doc, onUpload}){
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  const handle = f => {
    if(!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if(!["pdf","doc","docx"].includes(ext)){ alert("Please upload PDF or Word (.pdf, .doc, .docx)"); return; }
    const kb = f.size/1024;
    const sz = kb>1024 ? `${(kb/1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
    const ver = doc ? `v${(parseInt((doc.version||"v1").replace("v",""))||1)+1}` : "v1";
    onUpload({ name:f.name, size:sz, uploadedAt:new Date().toISOString().split("T")[0], uploadedBy:"Dana Mercer", version:ver });
  };
  const onDrop = e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); };
  if(doc) return(
    <div style={{background:"#f8fafc",border:"1px solid #e8ecf3",borderRadius:10,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:40,height:40,background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📄</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13.5,fontWeight:600,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.name}</div>
        <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{doc.size} · {fmtDate(doc.uploadedAt)} · {doc.uploadedBy} · <span style={{color:"#6366f1",fontWeight:600}}>{doc.version}</span></div>
      </div>
      <div style={{display:"flex",gap:6,flexShrink:0}}>
        <button className="ai" style={{opacity:1,color:"#059669",border:"1px solid #bbf7d0",background:"#f0fdf4",padding:"6px 10px"}} onClick={()=>alert("Download triggered.")}>↓ Download</button>
        <button className="ai" style={{opacity:1,padding:"6px 10px"}} onClick={()=>ref.current.click()}>↑ Replace</button>
      </div>
      <input ref={ref} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={e=>handle(e.target.files[0])}/>
    </div>
  );
  return(
    <div>
      <div className={`uz${drag?" dov":""}`} onClick={()=>ref.current.click()} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop}>
        <div style={{fontSize:28,marginBottom:10}}>📎</div>
        <div style={{fontSize:14,fontWeight:600,color:"#374151",marginBottom:4}}>Upload SOW Document</div>
        <div style={{fontSize:12,color:"#94a3b8",marginBottom:14}}>Drag and drop or click to browse. PDF, DOC, DOCX accepted.</div>
        <span style={{background:"linear-gradient(135deg,#4f46e5,#6366f1)",color:"#fff",borderRadius:8,padding:"8px 18px",fontSize:13,fontWeight:600,boxShadow:"0 4px 12px rgba(99,102,241,.3)"}}>Browse Files</span>
      </div>
      <input ref={ref} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={e=>handle(e.target.files[0])}/>
    </div>
  );
}

function AdvanceModal({sow, onConfirm, onClose}){
  const [note, setNote] = useState("");
  const next = STATUS_META[sow.status]?.next;
  if(!next) return null;
  const nm = STATUS_META[next]||{};
  return(
    <div className="mb" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="mx">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{width:36,height:36,borderRadius:10,background:`${nm.dot}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>→</div>
          <div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:"#0f172a"}}>Advance Status</div>
            <div style={{fontSize:12,color:"#94a3b8"}}>{sow.id}</div>
          </div>
        </div>
        <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:14,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
          <Badge status={sow.status}/><span style={{color:"#94a3b8",fontSize:16,margin:"0 4px"}}>→</span><Badge status={next}/>
        </div>
        <div style={{marginBottom:16}}>
          <label className="fl">Note (optional)</label>
          <textarea className="fi" rows={3} value={note} onChange={e=>setNote(e.target.value)} placeholder="Add context for this status change…" style={{resize:"vertical"}}/>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button className="bg" onClick={onClose}>Cancel</button>
          <button className="bp" onClick={()=>onConfirm(next,note)}>Confirm →</button>
        </div>
      </div>
    </div>
  );
}

function TerminateModal({sow, onConfirm, onClose}){
  const [reason, setReason] = useState("");
  return(
    <div className="mb" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="mx">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{width:36,height:36,borderRadius:10,background:"#fef2f2",border:"1px solid #fecaca",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚠</div>
          <div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:"#dc2626"}}>Terminate SOW</div>
            <div style={{fontSize:12,color:"#94a3b8"}}>{sow.id}</div>
          </div>
        </div>
        <p style={{fontSize:13,color:"#475569",marginBottom:16,lineHeight:1.6}}>This marks the SOW as <strong>Terminated</strong> and is logged in the activity trail.</p>
        <div style={{marginBottom:16}}>
          <label className="fl">Reason *</label>
          <textarea className="fi" rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="e.g. Client requested early termination due to budget freeze…" style={{resize:"vertical"}}/>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button className="bg" onClick={onClose}>Cancel</button>
          <button className="bd" style={{borderRadius:9,padding:"9px 16px",fontWeight:600}} disabled={!reason.trim()} onClick={()=>reason.trim()&&onConfirm(reason)}>Terminate SOW</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   P-020  SOW LIST
══════════════════════════════════════════════ */
function SOWList({sows, onView, onCreate}){
  const [search,setSearch] = useState("");
  const [sf,setSf]         = useState("All");
  const [cf,setCf]         = useState("All");
  const [sc,setSc]         = useState("id");
  const [sd,setSd]         = useState("asc");
  const [page,setPage]     = useState(1);
  const [toast,setToast]   = useState(null);
  const PER = 8;

  const doSort = col => { if(sc===col) setSd(d=>d==="asc"?"desc":"asc"); else{setSc(col);setSd("asc");} };
  const clients  = useMemo(()=>["All",...Array.from(new Set(sows.map(s=>s.client))).sort()],[sows]);
  const statuses = ["All",...Object.keys(STATUS_META)];

  const filtered = useMemo(()=>{
    let r = sows;
    if(search) r = r.filter(x=>[x.id,x.title,x.client,x.owner,x.engagementName].some(f=>(f||"").toLowerCase().includes(search.toLowerCase())));
    if(sf!=="All") r = r.filter(x=>x.status===sf);
    if(cf!=="All") r = r.filter(x=>x.client===cf);
    return [...r].sort((a,b)=>{ let va=a[sc],vb=b[sc]; if(typeof va==="string"){va=va.toLowerCase();vb=(vb||"").toLowerCase();} return sd==="asc"?(va>vb?1:-1):(va<vb?1:-1); });
  },[sows,search,sf,cf,sc,sd]);

  const paged = filtered.slice((page-1)*PER, page*PER);
  const pages = Math.max(1, Math.ceil(filtered.length/PER));

  const stats = useMemo(()=>({
    all:   sows.length,
    active: sows.filter(s=>s.status==="Active").length,
    pend:  sows.filter(s=>["Submitted","Under Review"].includes(s.status)).length,
    val:   sows.reduce((a,s)=>a+REQUIREMENTS_REF.filter(r=>s.linkedRequirements.includes(r.id)).reduce((b,r)=>b+r.value,0),0),
    exp:   sows.filter(s=>{ const d=daysLeft(s.expiryDate); return d!==null&&d>=0&&d<=60&&s.status==="Active"; }).length,
  }),[sows]);

  const showToast = (msg,c="#10b981") => { setToast({msg,c}); setTimeout(()=>setToast(null),2500); };

  const doExport = () => {
    const hdr = ["SOW ID","Title","Client","Status","Owner","Effective","Expiry","Region","Linked Reqs","Document"];
    const data = filtered.map(s=>[s.id,s.title,s.client,s.status,s.owner,s.effectiveDate||"—",s.expiryDate||"—",s.region,s.linkedRequirements.join("; "),s.document?s.document.name:"No file"]);
    const csv = [hdr,...data].map(r=>r.map(c=>'"'+c+'"').join(",")).join("\n");
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="sow-register.csv"; a.click();
    showToast("Exported "+filtered.length+" SOWs to CSV");
  };

  const pageNums = Array.from({length:pages},(_,i)=>i+1).filter(p=>p===1||p===pages||Math.abs(p-page)<=1).reduce((acc,p,i,arr)=>{ if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; },[]);

  return(
    <Shell page="P-020" crumb={["Statements of Work"]}>
      <div style={{padding:"32px 36px",maxWidth:1500,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <div style={{width:8,height:32,borderRadius:4,background:"linear-gradient(180deg,#4f46e5,#818cf8)"}}/>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:700,color:"#0f172a",letterSpacing:-0.5}}>SOW Register</h1>
            </div>
            <p style={{fontSize:13.5,color:"#64748b",marginLeft:18}}>Track all Statements of Work — document status, approval workflow, and linked requirements.</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="bg" onClick={doExport}>↓ Export CSV</button>
            <button className="bp" onClick={onCreate}>+ New SOW</button>
          </div>
        </div>

        <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
          {[{l:"Total SOWs",v:stats.all,s:"All time",a:"#6366f1"},{l:"Active",v:stats.active,s:"Running",a:"#3b82f6"},{l:"Pending Approval",v:stats.pend,s:"In workflow",a:"#f59e0b"},{l:"Contract Value",v:fmt(stats.val),s:"Linked requirements",a:"#10b981",lg:true},{l:"Expiring Soon",v:stats.exp,s:"Within 60 days",a:"#ef4444"}].map((s,i)=>(
            <div key={i} className="statc" style={{borderLeft:"3px solid "+s.a}}>
              <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>{s.l}</div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:s.lg?20:28,fontWeight:700,color:"#0f172a",marginBottom:4}}>{s.v}</div>
              <div style={{fontSize:11,color:s.a}}>{s.s}</div>
            </div>
          ))}
        </div>

        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"14px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:14,pointerEvents:"none"}}>⌕</span>
            <input className="fi" style={{width:270,paddingLeft:34}} placeholder="Search ID, title, client…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
          </div>
          <select className="fs" value={sf} onChange={e=>{setSf(e.target.value);setPage(1);}}>{statuses.map(s=><option key={s}>{s}</option>)}</select>
          <select className="fs" value={cf} onChange={e=>{setCf(e.target.value);setPage(1);}}>{clients.map(c=><option key={c}>{c}</option>)}</select>
          {(search||sf!=="All"||cf!=="All")&&<button style={{background:"none",border:"none",color:"#6366f1",fontSize:12,cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setSearch("");setSf("All");setCf("All");setPage(1);}}>Clear</button>}
          <div style={{marginLeft:"auto",fontSize:12,color:"#94a3b8"}}>{filtered.length} of {sows.length} SOWs</div>
        </div>

        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,.05)"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"#f8fafc",borderBottom:"1px solid #e8ecf3"}}>
                  {[["id","SOW ID"],["title","Title"],["client","Client"],["status","Status"],["owner","Owner"],["effectiveDate","Effective"],["expiryDate","Expiry"]].map(([col,lbl])=>(
                    <th key={col} className="sth" style={{padding:"13px 14px",textAlign:"left",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,fontWeight:600}} onClick={()=>doSort(col)}>
                      {lbl}<SortIco col={col} sc={sc} sd={sd}/>
                    </th>
                  ))}
                  <th style={{padding:"13px 14px",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,fontWeight:600}}>Reqs</th>
                  <th style={{padding:"13px 14px",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,fontWeight:600}}>Doc</th>
                  <th style={{padding:"13px 14px",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,fontWeight:600}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length===0
                  ? <tr><td colSpan={10} style={{padding:60,textAlign:"center",color:"#94a3b8"}}><div style={{fontSize:32,marginBottom:10}}>◌</div>No SOWs match.</td></tr>
                  : paged.map(row=>{
                      const days = daysLeft(row.expiryDate);
                      const warn = days!==null&&days>=0&&days<=60&&row.status==="Active";
                      const crit = days!==null&&days>=0&&days<=14&&row.status==="Active";
                      return(
                        <tr key={row.id} className="trow" style={{borderBottom:"1px solid #f1f5f9"}}>
                          <td style={{padding:"13px 14px",fontFamily:"'Sora',sans-serif",fontWeight:700,color:"#4f46e5",fontSize:12,whiteSpace:"nowrap",cursor:"pointer"}} onClick={()=>onView(row.id)}>{row.id}</td>
                          <td style={{padding:"13px 14px",maxWidth:230,cursor:"pointer"}} onClick={()=>onView(row.id)}>
                            <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500,color:"#0f172a"}} title={row.title}>{row.title}</div>
                            <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{row.engagementName}</div>
                          </td>
                          <td style={{padding:"13px 14px",color:"#475569",whiteSpace:"nowrap"}}>{row.client}</td>
                          <td style={{padding:"13px 14px"}}><Badge status={row.status}/></td>
                          <td style={{padding:"13px 14px",whiteSpace:"nowrap"}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}><Avatar name={row.owner} size={24}/>{row.owner}</div>
                          </td>
                          <td style={{padding:"13px 14px",color:"#64748b",whiteSpace:"nowrap"}}>{fmtDate(row.effectiveDate)}</td>
                          <td style={{padding:"13px 14px",whiteSpace:"nowrap"}}>
                            <span style={{color:crit?"#dc2626":warn?"#d97706":"#64748b",fontWeight:warn?600:400}}>
                              {crit?"⚠ ":warn?"⏰ ":""}{fmtDate(row.expiryDate)}
                            </span>
                            {warn&&<div style={{fontSize:10,color:crit?"#dc2626":"#d97706"}}>{days}d left</div>}
                          </td>
                          <td style={{padding:"13px 14px"}}>
                            <span style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:6,padding:"3px 9px",fontSize:12,color:"#475569",fontWeight:600}}>{row.linkedRequirements.length}</span>
                          </td>
                          <td style={{padding:"13px 14px"}}>
                            {row.document
                              ? <span style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6,padding:"4px 9px",fontSize:11,color:"#059669",fontWeight:600}}>📄 {row.document.version}</span>
                              : <span style={{fontSize:11,color:"#94a3b8"}}>None</span>}
                          </td>
                          <td style={{padding:"13px 14px"}}>
                            <div className="ra" style={{display:"flex"}}><button className="ai" onClick={()=>onView(row.id)}>👁</button></div>
                          </td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderTop:"1px solid #f1f5f9",background:"#fafbfc",flexWrap:"wrap",gap:12}}>
            <div style={{fontSize:12,color:"#94a3b8"}}>Showing {Math.min((page-1)*PER+1,Math.max(1,filtered.length))}–{Math.min(page*PER,filtered.length)} of {filtered.length}</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <button className="pb" disabled={page===1} onClick={()=>setPage(1)}>«</button>
              <button className="pb" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
              {pageNums.map((p,i)=>typeof p==="string"?<span key={"e"+i} style={{color:"#94a3b8",fontSize:13,padding:"0 4px"}}>…</span>:<button key={p} className={"pb"+(p===page?" on":"")} onClick={()=>setPage(p)}>{p}</button>)}
              <button className="pb" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>›</button>
              <button className="pb" disabled={page===pages} onClick={()=>setPage(pages)}>»</button>
            </div>
          </div>
        </div>

        <div style={{marginTop:20,display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8}}>Flow:</span>
          {FLOW.map((s,i)=>{ const m=STATUS_META[s]||{}; return(
            <div key={s} style={{display:"flex",alignItems:"center",gap:5}}>
              {i>0&&<span style={{color:"#cbd5e1",fontSize:11}}>→</span>}
              <span style={{width:7,height:7,borderRadius:"50%",background:m.dot,display:"inline-block"}}/>
              <span style={{fontSize:12,color:"#64748b"}}>{s}</span>
            </div>
          );})}
        </div>
      </div>
      {toast&&<div className="toast" style={{background:toast.c}}>{toast.msg}</div>}
    </Shell>
  );
}

/* ══════════════════════════════════════════════
   P-021  SOW DETAIL
══════════════════════════════════════════════ */
function SOWDetail({sow:init, onBack}){
  const [sow,  setSow]  = useState(init);
  const [tab,  setTab]  = useState("overview");
  const [adv,  setAdv]  = useState(false);
  const [term, setTerm] = useState(false);
  const [toast,setToast]= useState(null);

  const showToast = (msg,c="#10b981") => { setToast({msg,c}); setTimeout(()=>setToast(null),2800); };

  const onDoc = d => {
    const rep = !!sow.document;
    const e2 = {date:new Date().toISOString().split("T")[0], user:"Dana Mercer", action:rep?"Document replaced ("+d.version+")":"Document uploaded", detail:d.name+" — "+d.size};
    setSow(s=>({...s, document:d, activity:[...s.activity,e2]}));
    showToast(rep?"Document replaced — "+d.name+" ("+d.version+")":"Document uploaded — "+d.name);
  };

  const onAdvance = (next,note) => {
    const e2 = {date:new Date().toISOString().split("T")[0], user:"Dana Mercer", action:"Status: "+next, detail:note||"Advanced to "+next};
    setSow(s=>({...s, status:next, activity:[...s.activity,e2]}));
    setAdv(false);
    showToast("Status advanced to "+next);
  };

  const onTerminate = reason => {
    const e2 = {date:new Date().toISOString().split("T")[0], user:"Dana Mercer", action:"Status: Terminated", detail:reason};
    setSow(s=>({...s, status:"Terminated", activity:[...s.activity,e2]}));
    setTerm(false);
    showToast("SOW marked as Terminated","#ef4444");
  };

  const linked  = REQUIREMENTS_REF.filter(r=>sow.linkedRequirements.includes(r.id));
  const linkVal = linked.reduce((a,r)=>a+r.value,0);
  const days    = daysLeft(sow.expiryDate);
  const warn    = days!==null&&days>=0&&days<=60&&sow.status==="Active";
  const crit    = days!==null&&days>=0&&days<=14&&sow.status==="Active";
  const sm      = STATUS_META[sow.status]||{};
  const canAdv  = !!sm.next;
  const canTerm = ["Active","Approved","Under Review"].includes(sow.status);
  const flowIdx = FLOW.indexOf(sow.status);

  return(
    <Shell page="P-021" crumb={["Statements of Work", sow.id]}>
      <div style={{padding:"28px 36px",maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <button className="bg" onClick={onBack} style={{padding:"8px 14px",fontSize:13,marginTop:4,flexShrink:0}}>← Back</button>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:"#4f46e5",background:"#eef2ff",padding:"3px 10px",borderRadius:20}}>{sow.id}</span>
                <Badge status={sow.status}/>
                <span style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#64748b"}}>{sow.region}</span>
                <span style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#64748b"}}>{sow.category}</span>
                {sow.amendmentCount>0&&<span style={{background:"#faf5ff",border:"1px solid #e9d5ff",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#7c3aed",fontWeight:600}}>Amd x{sow.amendmentCount}</span>}
              </div>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a",lineHeight:1.3,maxWidth:700}}>{sow.title}</h1>
              <p style={{fontSize:13,color:"#64748b",marginTop:4}}>{sow.client} · {sow.engagementName}</p>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0,marginTop:4}}>
            {canTerm&&<button className="bd" onClick={()=>setTerm(true)} style={{padding:"9px 14px",fontSize:12}}>Terminate</button>}
            {canAdv&&<button className="bp" onClick={()=>setAdv(true)}>→ {sm.next}</button>}
          </div>
        </div>

        {crit&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#991b1b",marginBottom:16}}><span style={{fontSize:18}}>⚠</span><div><strong>{"Expiring in "+days+" day"+(days!==1?"s":"")+"!"}</strong>{" Immediate renewal required. Expiry: "+fmtDate(sow.expiryDate)}</div></div>}
        {warn&&!crit&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#92400e",marginBottom:16}}><span style={{fontSize:18}}>⏰</span><div><strong>{"Expiring in "+days+" days."}</strong>{" Consider initiating renewal. Expiry: "+fmtDate(sow.expiryDate)}</div></div>}

        <div className="sc">
          <div className="stitle">Status Progress</div>
          <div style={{display:"flex",alignItems:"flex-start"}}>
            {FLOW.map((s,i)=>{
              const done   = i < flowIdx && sow.status!=="Terminated";
              const active = s===sow.status;
              const fsm    = STATUS_META[s]||{};
              return(
                <div key={s} style={{display:"flex",alignItems:"center",flex:i<FLOW.length-1?1:"none"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:done?"#10b981":active?fsm.dot:"#f1f5f9",border:"2px solid "+(done?"#10b981":active?fsm.dot:"#e2e8f0"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:done||active?"#fff":"#94a3b8",fontWeight:700,boxShadow:active?"0 0 0 4px "+fsm.dot+"20":"none"}}>
                      {done?"✓":i+1}
                    </div>
                    <span style={{fontSize:10,color:active?fsm.color:done?"#10b981":"#94a3b8",fontWeight:active?700:500,whiteSpace:"nowrap"}}>{s}</span>
                  </div>
                  {i<FLOW.length-1&&<div style={{flex:1,height:2,background:done?"#10b981":"#e2e8f0",margin:"0 4px",marginBottom:22}}/>}
                </div>
              );
            })}
            {sow.status==="Terminated"&&<div style={{marginLeft:20,paddingBottom:22,display:"flex",alignItems:"center",gap:8}}><div style={{width:2,height:34,background:"#e2e8f0"}}/><Badge status="Terminated"/></div>}
          </div>
        </div>

        <div style={{borderBottom:"1px solid #e2e8f0",marginBottom:20,display:"flex"}}>
          {[["overview","Overview"],["requirements","Linked Req. ("+linked.length+")"],["activity","Activity ("+sow.activity.length+")"]].map(([k,lbl])=>(
            <button key={k} className={"tb"+(tab===k?" on":"")} onClick={()=>setTab(k)}>{lbl}</button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
          <div>
            {tab==="overview"&&(<>
              <div className="sc">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>
                  <span className="stitle" style={{margin:0,padding:0,border:"none"}}>SOW Document</span>
                  {sow.document&&<span style={{fontSize:11,color:"#94a3b8"}}>Updated {fmtDate(sow.document.uploadedAt)} · {sow.document.version}</span>}
                </div>
                <DocUpload doc={sow.document} onUpload={onDoc}/>
                {!sow.document&&<p style={{fontSize:12,color:"#94a3b8",marginTop:12,textAlign:"center"}}>Upload the signed document once executed. Supported: PDF, DOC, DOCX.</p>}
              </div>
              <div className="sc">
                <div className="stitle">Details</div>
                {[["Engagement",sow.engagementName||"—"],["Category",sow.category],["Region",sow.region],["Signed",fmtDate(sow.signedDate)],["Amendments",sow.amendmentCount>0?sow.amendmentCount+" amendment"+(sow.amendmentCount>1?"s":""):"None"]].map(([l,v])=>(
                  <div key={l} className="dr"><span className="dl">{l}</span><span className="dv">{v}</span></div>
                ))}
                {sow.notes&&<div className="dr"><span className="dl">Notes</span><span className="dv" style={{whiteSpace:"pre-wrap",lineHeight:1.7,color:"#475569"}}>{sow.notes}</span></div>}
              </div>
            </>)}

            {tab==="requirements"&&(
              <div className="sc">
                <div className="stitle">Linked Requirements</div>
                {linked.length===0&&<p style={{fontSize:13,color:"#94a3b8"}}>No requirements linked.</p>}
                {linked.map(r=>{
                  const c2=SALES_COLORS[r.salesType]||"#6366f1";
                  const rdot={"Draft":"#94a3b8","Scoping":"#f59e0b","In Review":"#6366f1","Approved":"#10b981","In Progress":"#3b82f6","On Hold":"#f97316","Rejected":"#ef4444"}[r.status]||"#94a3b8";
                  return(
                    <div key={r.id} style={{background:"#fafbfc",border:"1px solid #e8ecf3",borderRadius:10,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                          <span style={{fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:700,color:"#4f46e5",background:"#eef2ff",padding:"2px 8px",borderRadius:20}}>{r.id}</span>
                          <span style={{background:c2+"12",color:c2,border:"1px solid "+c2+"30",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:600}}>{r.salesType}</span>
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
                {linked.length>0&&(
                  <div style={{borderTop:"1px solid #f1f5f9",paddingTop:14,marginTop:4,display:"flex",justifyContent:"flex-end",alignItems:"center",gap:12}}>
                    <span style={{fontSize:12,color:"#94a3b8"}}>{linked.length} requirement{linked.length!==1?"s":""} · Combined</span>
                    <span style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:"#059669"}}>{fmt(linkVal)}</span>
                  </div>
                )}
              </div>
            )}

            {tab==="activity"&&(
              <div className="sc">
                <div className="stitle">Activity Log</div>
                {[...sow.activity].reverse().map((e2,i,arr)=>(
                  <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,width:18}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:i===0?"#6366f1":"#e2e8f0",border:"2px solid "+(i===0?"#6366f1":"#cbd5e1"),marginTop:3}}/>
                      {i<arr.length-1&&<div style={{width:2,height:36,background:"#f1f5f9",margin:"3px auto"}}/>}
                    </div>
                    <div style={{paddingBottom:18,flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                        <span style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{e2.action}</span>
                        <span style={{fontSize:11,color:"#94a3b8"}}>· {fmtDate(e2.date)}</span>
                      </div>
                      <div style={{fontSize:12.5,color:"#64748b"}}>{e2.detail}</div>
                      <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>by {e2.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="sc">
              <div className="stitle">Summary</div>
              <div className="dr" style={{flexDirection:"column",gap:4}}>
                <span className="dl" style={{minWidth:"auto"}}>Status</span><Badge status={sow.status}/>
              </div>
              <div className="dr" style={{flexDirection:"column",gap:4}}>
                <span className="dl" style={{minWidth:"auto"}}>Contract Value</span>
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:700,color:"#059669"}}>{fmt(linkVal)}</span>
                <span style={{fontSize:11,color:"#94a3b8"}}>{linked.length} requirement{linked.length!==1?"s":""}</span>
              </div>
              <div className="dr" style={{flexDirection:"column",gap:4}}>
                <span className="dl" style={{minWidth:"auto"}}>Document</span>
                {sow.document
                  ? <span style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6,padding:"5px 10px",fontSize:12,color:"#059669",fontWeight:600}}>📄 {sow.document.name}</span>
                  : <span style={{fontSize:12,color:"#f59e0b",fontWeight:500}}>⚠ No document yet</span>}
              </div>
            </div>

            <div className="sc">
              <div className="stitle">Key Dates</div>
              {[["Created",fmtDate(sow.created),false],["Effective",fmtDate(sow.effectiveDate),false],["Signed",fmtDate(sow.signedDate),false],["Expiry",fmtDate(sow.expiryDate),crit||warn]].map(([l,v,w])=>(
                <div key={l} className="dr" style={{flexDirection:"column",gap:3}}>
                  <span className="dl" style={{minWidth:"auto"}}>{l}</span>
                  <span style={{fontSize:13.5,color:crit&&l==="Expiry"?"#dc2626":warn&&l==="Expiry"?"#d97706":"#1e293b",fontWeight:w?700:400}}>
                    {w&&l==="Expiry"?(crit?"⚠ ":"⏰ "):""}{v}
                  </span>
                  {l==="Expiry"&&warn&&<span style={{fontSize:11,color:crit?"#dc2626":"#d97706"}}>{days} day{days!==1?"s":""} remaining</span>}
                </div>
              ))}
            </div>

            <div className="sc">
              <div className="stitle">People</div>
              {[["Owner",sow.owner],["Delivery Head",sow.deliveryHead]].map(([l,n])=>(
                <div key={l} style={{padding:"10px 0",borderBottom:"1px solid #f8fafc"}}>
                  <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6,marginBottom:6,fontWeight:600}}>{l}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={n||""}/><span style={{fontSize:13.5,color:"#1e293b",fontWeight:500}}>{n||"—"}</span></div>
                </div>
              ))}
            </div>

            {(canAdv||canTerm)&&(
              <div className="sc">
                <div className="stitle">Workflow</div>
                <div style={{display:"grid",gap:8}}>
                  {canAdv&&<button className="bp" onClick={()=>setAdv(true)} style={{width:"100%",textAlign:"center",padding:"11px 16px"}}>→ Advance to {sm.next}</button>}
                  {canTerm&&<button className="bd" onClick={()=>setTerm(true)} style={{width:"100%",textAlign:"center",padding:"11px 16px",borderRadius:9,fontWeight:600}}>Terminate SOW</button>}
                  <p style={{fontSize:11,color:"#94a3b8",textAlign:"center",marginTop:2}}>Changes are logged in the activity trail.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {adv&&<AdvanceModal sow={sow} onConfirm={onAdvance} onClose={()=>setAdv(false)}/>}
      {term&&<TerminateModal sow={sow} onConfirm={onTerminate} onClose={()=>setTerm(false)}/>}
      {toast&&<div className="toast" style={{background:toast.c}}>{toast.msg}</div>}
    </Shell>
  );
}

/* ══════════════════════════════════════════════
   P-022  SOW CREATE FORM
══════════════════════════════════════════════ */
function SOWForm({onBack, onSave}){
  const today = new Date().toISOString().split("T")[0];
  const blank = { title:"", client:"", engagementName:"", status:"Draft", owner:"Dana Mercer", deliveryHead:"", effectiveDate:"", expiryDate:"", signedDate:"", region:"North America", category:"IT Services", notes:"", linkedRequirements:[], document:null, created:today };
  const [form,   setForm]   = useState(blank);
  const [errors, setErrors] = useState({});
  const [saved,  setSaved]  = useState(false);
  const [rq,     setRq]     = useState("");

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const onClient = v => { set("client",v); if(!form.engagementName && CLIENT_ENG[v]) set("engagementName",CLIENT_ENG[v]); };

  const toggleReq = id => set("linkedRequirements", form.linkedRequirements.includes(id) ? form.linkedRequirements.filter(r=>r!==id) : [...form.linkedRequirements,id]);

  const filteredReqs = useMemo(()=>{
    const q = rq.toLowerCase();
    return REQUIREMENTS_REF.filter(r=>!q||r.id.toLowerCase().includes(q)||r.title.toLowerCase().includes(q)||r.client.toLowerCase().includes(q));
  },[rq]);

  const validate = () => { const e={}; if(!form.title.trim()) e.title="Required"; if(!form.client) e.client="Required"; setErrors(e); return !Object.keys(e).length; };

  const save = () => { if(!validate()) return; onSave(form); setSaved(true); setTimeout(()=>setSaved(false),2500); };

  const linked  = REQUIREMENTS_REF.filter(r=>form.linkedRequirements.includes(r.id));
  const linkVal = linked.reduce((a,r)=>a+r.value,0);

  return(
    <Shell page="P-022" crumb={["Statements of Work","New SOW"]}>
      <div style={{padding:"28px 36px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button className="bg" onClick={onBack} style={{padding:"8px 14px",fontSize:13}}>← Back</button>
            <div style={{width:1,height:24,background:"#e2e8f0"}}/>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:7,height:28,borderRadius:4,background:"linear-gradient(180deg,#4f46e5,#818cf8)"}}/>
                <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a"}}>New Statement of Work</h1>
              </div>
              <p style={{fontSize:13,color:"#64748b",marginLeft:17,marginTop:2}}>Register a new SOW, link requirements, and attach the document.</p>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="bg" onClick={onBack}>Discard</button>
            <button className="bp" onClick={save}>Create SOW</button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
          <div>
            <div className="sc">
              <div className="stitle">Core Details</div>
              <div style={{display:"grid",gap:16}}>
                <div>
                  <label className="fl">SOW Title *{errors.title&&<span style={{color:"#ef4444",marginLeft:6,textTransform:"none",fontSize:11,fontWeight:400}}>— {errors.title}</span>}</label>
                  <input className="fi" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Nexus Digital Transformation — Phase 2" style={{borderColor:errors.title?"#ef4444":undefined}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div>
                    <label className="fl">Client *{errors.client&&<span style={{color:"#ef4444",marginLeft:6,textTransform:"none",fontSize:11,fontWeight:400}}>— {errors.client}</span>}</label>
                    <select className="fs" value={form.client} onChange={e=>onClient(e.target.value)} style={{width:"100%",borderColor:errors.client?"#ef4444":undefined}}>
                      <option value="">— Select —</option>
                      {ALL_CLIENTS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="fl">Engagement Name</label>
                    <input className="fi" value={form.engagementName} onChange={e=>set("engagementName",e.target.value)} placeholder="e.g. Nexus Digital Transformation"/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div>
                    <label className="fl">Category</label>
                    <select className="fs" value={form.category} onChange={e=>set("category",e.target.value)} style={{width:"100%"}}>{ALL_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
                  </div>
                  <div>
                    <label className="fl">Region</label>
                    <select className="fs" value={form.region} onChange={e=>set("region",e.target.value)} style={{width:"100%"}}>{ALL_REGIONS.map(r=><option key={r}>{r}</option>)}</select>
                  </div>
                </div>
                <div>
                  <label className="fl">Notes / Context</label>
                  <textarea className="fi" rows={3} value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Contractual constraints, escalation paths, stakeholder context…" style={{resize:"vertical"}}/>
                </div>
              </div>
            </div>

            <div className="sc">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>
                <span className="stitle" style={{margin:0,padding:0,border:"none"}}>Link Requirements</span>
                {form.linkedRequirements.length>0&&<span style={{fontSize:12,color:"#059669",fontWeight:600}}>{form.linkedRequirements.length} linked · {fmt(linkVal)}</span>}
              </div>
              {form.linkedRequirements.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
                  {linked.map(r=>(
                    <span key={r.id} style={{display:"inline-flex",alignItems:"center",gap:6,background:"#eef2ff",color:"#4f46e5",border:"1px solid #c7d2fe",borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:500}}>
                      {r.id}<span style={{cursor:"pointer",opacity:.5,fontSize:11}} onClick={()=>toggleReq(r.id)}>✕</span>
                    </span>
                  ))}
                </div>
              )}
              <div style={{position:"relative",marginBottom:10}}>
                <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:14,pointerEvents:"none"}}>⌕</span>
                <input className="fi" style={{paddingLeft:34}} value={rq} onChange={e=>setRq(e.target.value)} placeholder="Search by ID, title, or client…"/>
              </div>
              <div style={{maxHeight:280,overflowY:"auto",border:"1px solid #f1f5f9",borderRadius:10}}>
                {filteredReqs.length===0&&<div style={{padding:20,textAlign:"center",color:"#94a3b8",fontSize:13}}>No matches.</div>}
                {filteredReqs.map((r,i)=>{
                  const chk = form.linkedRequirements.includes(r.id);
                  const c2  = SALES_COLORS[r.salesType]||"#6366f1";
                  return(
                    <div key={r.id} onClick={()=>toggleReq(r.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",cursor:"pointer",borderBottom:i<filteredReqs.length-1?"1px solid #f8fafc":"none",background:chk?"#f8faff":"transparent"}}>
                      <input type="checkbox" className="cb" checked={chk} onChange={()=>toggleReq(r.id)} onClick={e=>e.stopPropagation()}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                          <span style={{fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:700,color:"#4f46e5"}}>{r.id}</span>
                          <span style={{background:c2+"12",color:c2,border:"1px solid "+c2+"25",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:600}}>{r.salesType}</span>
                        </div>
                        <div style={{fontSize:13,color:"#1e293b",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.title}</div>
                        <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{r.client}</div>
                      </div>
                      <div style={{fontSize:12,fontWeight:600,color:"#475569",flexShrink:0}}>{fmt(r.value)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sc">
              <div className="stitle">SOW Document <span style={{textTransform:"none",fontSize:11,color:"#94a3b8",fontWeight:400,letterSpacing:0}}>— optional at creation</span></div>
              <DocUpload doc={form.document} onUpload={d=>set("document",d)}/>
              {!form.document&&<p style={{fontSize:12,color:"#94a3b8",marginTop:12,textAlign:"center"}}>You can upload later from the SOW detail page.</p>}
            </div>
          </div>

          <div>
            <div className="sc">
              <div className="stitle">Status</div>
              <div style={{display:"grid",gap:14}}>
                <div>
                  <label className="fl">Initial Status</label>
                  <select className="fs" value={form.status} onChange={e=>set("status",e.target.value)} style={{width:"100%"}}>
                    {["Draft","Submitted","Under Review"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{background:"#f8fafc",border:"1px solid #e8ecf3",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#64748b",lineHeight:1.6}}>
                  New SOWs typically start as <strong>Draft</strong>. Advance the status from the detail page once created.
                </div>
              </div>
            </div>

            <div className="sc">
              <div className="stitle">People</div>
              <div style={{display:"grid",gap:14}}>
                {[["Owner","owner"],["Delivery Head","deliveryHead"]].map(([l,k])=>(
                  <div key={k}>
                    <label className="fl">{l}</label>
                    <select className="fs" value={form[k]} onChange={e=>set(k,e.target.value)} style={{width:"100%"}}>
                      <option value="">— Select —</option>
                      {ALL_OWNERS.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="sc">
              <div className="stitle">Dates</div>
              <div style={{display:"grid",gap:14}}>
                {[["Effective Date","effectiveDate"],["Expiry Date","expiryDate"],["Signed Date","signedDate"]].map(([l,k])=>(
                  <div key={k}>
                    <label className="fl">{l}</label>
                    <input type="date" className="fi" value={form[k]} onChange={e=>set(k,e.target.value)}/>
                  </div>
                ))}
                <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#92400e",lineHeight:1.6}}>
                  Dates can be filled in once the SOW is fully executed.
                </div>
              </div>
            </div>

            {(form.title||form.client||form.linkedRequirements.length>0)&&(
              <div className="sc" style={{borderLeft:"3px solid #6366f1"}}>
                <div className="stitle">Preview</div>
                {form.title&&<div style={{fontSize:13.5,fontWeight:600,color:"#0f172a",marginBottom:4}}>{form.title}</div>}
                {form.client&&<div style={{fontSize:12,color:"#64748b",marginBottom:6}}>{form.client}{form.engagementName?" · "+form.engagementName:""}</div>}
                {form.linkedRequirements.length>0&&<div style={{fontSize:12,color:"#059669",fontWeight:600,marginBottom:4}}>{form.linkedRequirements.length} requirement{form.linkedRequirements.length!==1?"s":""} · {fmt(linkVal)}</div>}
                {form.document&&<div style={{fontSize:12,color:"#4f46e5"}}>📄 {form.document.name}</div>}
              </div>
            )}
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"flex-end",gap:10,paddingBottom:40}}>
          <button className="bg" onClick={onBack}>Discard</button>
          <button className="bp" onClick={save}>Create SOW</button>
        </div>
      </div>
      {saved&&<div className="toast">SOW created successfully</div>}
    </Shell>
  );
}

/* ══════════════════════════════════════════════
   ROOT ROUTER
══════════════════════════════════════════════ */
export default function App(){
  const [sows,setSows] = useState(SEED);
  const [view,setView] = useState("list");
  const [aid, setAid]  = useState(null);
  const active = sows.find(s=>s.id===aid);

  const handleCreate = data => {
    const nums  = sows.map(s=>parseInt(s.id.replace("SOW-2026-",""))||0);
    const newId = "SOW-2026-"+String(Math.max(0,...nums)+1).padStart(3,"0");
    const e0    = {date:data.created, user:"Dana Mercer", action:"SOW created", detail:"Registered in system"};
    const e1    = data.document ? [{date:data.created, user:"Dana Mercer", action:"Document uploaded", detail:data.document.name+" — "+data.document.size}] : [];
    setSows(ss=>[{...data, id:newId, amendmentCount:0, activity:[e0,...e1]},...ss]);
    setAid(newId);
    setView("detail");
  };

  if(view==="list")           return <SOWList   sows={sows} onView={id=>{setAid(id);setView("detail");}} onCreate={()=>setView("create")}/>;
  if(view==="create")         return <SOWForm   onBack={()=>setView("list")} onSave={handleCreate}/>;
  if(view==="detail"&&active) return <SOWDetail sow={active} onBack={()=>setView("list")}/>;
  return null;
}
