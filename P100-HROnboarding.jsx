import { useState, useMemo } from "react";

/* ─────────────────── GLOBAL CSS ─────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body,input,select,textarea,button{font-family:'DM Sans','Segoe UI',sans-serif}
::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
.trow:hover{background:#f8faff!important}.trow:hover .row-act{opacity:1!important}.row-act{opacity:0;transition:opacity .15s}
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
.btn-danger{background:#fff;border:1px solid #fecaca;color:#dc2626;border-radius:9px;padding:9px 16px;font-size:13px;cursor:pointer;transition:all .15s}
.btn-danger:hover{background:#fef2f2;border-color:#f87171}
.section-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:22px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.section-title{font-family:'Sora',sans-serif;font-size:11px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #f1f5f9}
.field-label{font-size:11px;color:#64748b;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.6px;font-weight:600}
.overlay{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(2px)}
.modal{background:#fff;border-radius:16px;width:100%;max-width:660px;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 32px 80px rgba(0,0,0,.25);overflow:hidden}
.toast{position:fixed;bottom:24px;right:24px;background:#10b981;color:#fff;padding:11px 18px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 8px 24px rgba(16,185,129,.3);z-index:9999;animation:slideup .3s ease}
@keyframes slideup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.filter-chip{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:5px 12px;font-size:12px;color:#64748b;cursor:pointer;transition:all .12s;white-space:nowrap}
.filter-chip:hover{border-color:#c7d2fe;color:#4f46e5}.filter-chip.active{background:#eef2ff;border-color:#c7d2fe;color:#4f46e5;font-weight:600}
.check-item{display:flex;align-items:flex-start;gap:12px;padding:11px 14px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:8px;background:#fff;cursor:pointer;transition:all .15s}
.check-item:hover{border-color:#c7d2fe;background:#fafbff}
.check-item.done{background:#f0fdf4;border-color:#bbf7d0}
.check-item.done .ci-title{text-decoration:line-through;color:#94a3b8}
.check-box{width:20px;height:20px;border-radius:5px;border:2px solid #e2e8f0;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s;margin-top:1px}
.check-box.checked{background:#10b981;border-color:#10b981}
.progress-bar{height:8px;border-radius:4px;background:#e2e8f0;overflow:hidden}
.progress-fill{height:100%;border-radius:4px;transition:width .4s ease}
.tab-btn{padding:8px 16px;font-size:13px;font-weight:500;border:none;background:transparent;color:#64748b;cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap}
.tab-btn.active{color:#4f46e5;border-bottom-color:#4f46e5;font-weight:600}
.tab-btn:hover:not(.active){color:#1e293b}
.skill-tag{display:inline-flex;align-items:center;gap:5px;background:#eef2ff;color:#4f46e5;border:1px solid #c7d2fe;border-radius:20px;padding:3px 10px;font-size:12px;font-weight:500;margin:2px}
`;

/* ─────────────────── SEED DATA ─────────────────── */
const DEPTS = ["All","Engineering","Analytics","Cloud","DevOps","Design","Delivery","Project Management","Security","HR"];
const STATUSES = ["All","Onboarding","Active","On Leave","Offboarding","Terminated"];

const SEED_EMPLOYEES = [
  {id:"EMP-001",firstName:"Jordan",lastName:"Blake",jobTitle:"Senior Full Stack Engineer",department:"Engineering",email:"jordan.blake@nexusops.com",phone:"+1 415-301-2201",location:"San Francisco, CA",workModel:"Hybrid",startDate:"2026-03-01",contractEnd:"",status:"Onboarding",manager:"Rachel Kim",skills:["React","Node.js","TypeScript","SQL"],onboardingChecks:{preArrival:[true,true,true,false],dayOne:[false,false,false],weekOne:[false,false,false],firstMonth:[false,false,false]},offboardingChecks:null},
  {id:"EMP-002",firstName:"Sara",lastName:"Nguyen",jobTitle:"Data Analyst",department:"Analytics",email:"sara.nguyen@nexusops.com",phone:"+1 512-301-2202",location:"Austin, TX",workModel:"Remote",startDate:"2026-02-15",contractEnd:"",status:"Onboarding",manager:"Tom Ashby",skills:["SQL","Python","Tableau","Power BI"],onboardingChecks:{preArrival:[true,true,true,true],dayOne:[true,true,true],weekOne:[true,false,false],firstMonth:[false,false,false]},offboardingChecks:null},
  {id:"EMP-003",firstName:"Marcus",lastName:"Ellroy",jobTitle:"Cloud Architect",department:"Cloud",email:"marcus.ellroy@nexusops.com",phone:"+1 206-301-2203",location:"Seattle, WA",workModel:"Hybrid",startDate:"2025-11-01",contractEnd:"",status:"Active",manager:"Dana Mercer",skills:["AWS","Azure","Terraform","Kubernetes"],onboardingChecks:{preArrival:[true,true,true,true],dayOne:[true,true,true],weekOne:[true,true,true],firstMonth:[true,true,true]},offboardingChecks:null},
  {id:"EMP-004",firstName:"Aisha",lastName:"Kamara",jobTitle:"DevOps Engineer",department:"DevOps",email:"aisha.kamara@nexusops.com",phone:"+1 312-301-2204",location:"Chicago, IL",workModel:"Remote",startDate:"2024-09-01",contractEnd:"",status:"Active",manager:"Dana Mercer",skills:["Docker","Kubernetes","CI/CD","Terraform"],onboardingChecks:{preArrival:[true,true,true,true],dayOne:[true,true,true],weekOne:[true,true,true],firstMonth:[true,true,true]},offboardingChecks:null},
  {id:"EMP-005",firstName:"Leo",lastName:"Fontaine",jobTitle:"UX Designer",department:"Design",email:"leo.fontaine@nexusops.com",phone:"+1 213-301-2205",location:"Los Angeles, CA",workModel:"Hybrid",startDate:"2023-06-15",contractEnd:"",status:"On Leave",manager:"Theo Vasquez",skills:["Figma","UX Design","Prototyping"],onboardingChecks:{preArrival:[true,true,true,true],dayOne:[true,true,true],weekOne:[true,true,true],firstMonth:[true,true,true]},offboardingChecks:null},
  {id:"EMP-006",firstName:"Rita",lastName:"Osei",jobTitle:"Delivery Manager",department:"Delivery",email:"rita.osei@nexusops.com",phone:"+44 20-301-2206",location:"London, UK",workModel:"Onsite",startDate:"2022-03-10",contractEnd:"2026-04-30",status:"Offboarding",manager:"Rachel Kim",skills:["Scrum","Agile","PMP","Stakeholder Management"],onboardingChecks:{preArrival:[true,true,true,true],dayOne:[true,true,true],weekOne:[true,true,true],firstMonth:[true,true,true]},offboardingChecks:{hrNotice:[true,true,false],knowledgeTransfer:[true,false,false,false],itAccess:[false,false,false],finalSteps:[false,false,false]}},
  {id:"EMP-007",firstName:"Kwame",lastName:"Asante",jobTitle:"Project Manager",department:"Project Management",email:"kwame.asante@nexusops.com",phone:"+1 305-301-2207",location:"Miami, FL",workModel:"Hybrid",startDate:"2021-07-20",contractEnd:"",status:"Active",manager:"Rachel Kim",skills:["PMP","Jira","Agile","Risk Management"],onboardingChecks:{preArrival:[true,true,true,true],dayOne:[true,true,true],weekOne:[true,true,true],firstMonth:[true,true,true]},offboardingChecks:null},
  {id:"EMP-008",firstName:"Nadia",lastName:"Brennan",jobTitle:"Security Analyst",department:"Security",email:"nadia.brennan@nexusops.com",phone:"+353 1-301-2208",location:"Dublin, Ireland",workModel:"Hybrid",startDate:"2023-10-01",contractEnd:"",status:"Active",manager:"James Okafor",skills:["Cybersecurity","SIEM","Penetration Testing","ITIL"],onboardingChecks:{preArrival:[true,true,true,true],dayOne:[true,true,true],weekOne:[true,true,true],firstMonth:[true,true,true]},offboardingChecks:null},
  {id:"EMP-009",firstName:"Victor",lastName:"Huang",jobTitle:"Business Analyst",department:"Delivery",email:"victor.huang@nexusops.com",phone:"+1 415-301-2209",location:"San Francisco, CA",workModel:"Remote",startDate:"2020-05-01",contractEnd:"",status:"Active",manager:"Rachel Kim",skills:["Business Analysis","SQL","BPMN","Agile"],onboardingChecks:{preArrival:[true,true,true,true],dayOne:[true,true,true],weekOne:[true,true,true],firstMonth:[true,true,true]},offboardingChecks:null},
  {id:"EMP-010",firstName:"Preethi",lastName:"Rajan",jobTitle:"HR Coordinator",department:"HR",email:"preethi.rajan@nexusops.com",phone:"+91 98-301-2210",location:"Bangalore, India",workModel:"Onsite",startDate:"2026-03-10",contractEnd:"",status:"Onboarding",manager:"Nina Bergmann",skills:["HRIS","Recruitment","Onboarding","Compliance"],onboardingChecks:{preArrival:[true,true,false,false],dayOne:[false,false,false],weekOne:[false,false,false],firstMonth:[false,false,false]},offboardingChecks:null},
];

/* ─────────────────── CHECKLIST DEFINITIONS ─────────────────── */
const ONBOARDING_SECTIONS = [
  {key:"preArrival",label:"Pre-Arrival",icon:"📋",items:["Offer letter countersigned","Background check cleared","Laptop & equipment ordered","System accounts provisioned"]},
  {key:"dayOne",label:"Day 1",icon:"🎉",items:["ID badge issued","Welcome meeting with manager","Tool access verified (email, Slack, Jira)"]},
  {key:"weekOne",label:"Week 1",icon:"📚",items:["HR orientation completed","Benefits enrollment submitted","Team introductions done"]},
  {key:"firstMonth",label:"First 30 Days",icon:"🚀",items:["Role-specific training completed","First project assigned","30-day check-in with manager"]},
];
const OFFBOARDING_SECTIONS = [
  {key:"hrNotice",label:"HR & Notice",icon:"📝",items:["Resignation / termination letter filed","Exit date confirmed with HR","Payroll & benefits notified"]},
  {key:"knowledgeTransfer",label:"Knowledge Transfer",icon:"🔄",items:["Handover document created","Key contacts introduced to successor","Outstanding tasks reassigned","Client communications handed over"]},
  {key:"itAccess",label:"IT & Access",icon:"🔒",items:["Laptop & equipment returned","All system access revoked","Data backed up and archived"]},
  {key:"finalSteps",label:"Final Steps",icon:"✅",items:["Exit interview completed","Final payslip processed","Reference letter issued"]},
];

/* ─────────────────── HELPERS ─────────────────── */
const AVC=["#4f46e5","#0891b2","#059669","#d97706","#dc2626","#7c3aed","#db2777","#0284c7"];
function avColor(n){let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))%AVC.length;return AVC[h];}
function calcProgress(checks,sections){
  if(!checks)return 0;
  let total=0,done=0;
  sections.forEach(s=>{const arr=checks[s.key]||[];total+=arr.length;done+=arr.filter(Boolean).length;});
  return total===0?0:Math.round((done/total)*100);
}
function fmt(d){if(!d)return"—";const [y,m,dd]=d.split("-");return`${dd}/${m}/${y}`;}
function daysLeft(d){if(!d)return null;return Math.ceil((new Date(d)-new Date())/86400000);}

const STATUS_STYLES={
  "Onboarding":{background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe"},
  "Active":{background:"#ecfdf5",color:"#059669",border:"1px solid #a7f3d0"},
  "On Leave":{background:"#fffbeb",color:"#d97706",border:"1px solid #fde68a"},
  "Offboarding":{background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca"},
  "Terminated":{background:"#f1f5f9",color:"#94a3b8",border:"1px solid #e2e8f0"},
};
function StatusBadge({s}){
  const st=STATUS_STYLES[s]||{background:"#f1f5f9",color:"#64748b",border:"1px solid #e2e8f0"};
  return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 9px",borderRadius:4,fontSize:11,fontWeight:600,...st}}>{s}</span>;
}
function Avatar({name,size=32}){
  const ini=name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return <div style={{width:size,height:size,borderRadius:"50%",background:avColor(name),display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.36,fontWeight:700,color:"#fff",flexShrink:0}}>{ini}</div>;
}
function ProgressRing({pct,size=52,stroke=5}){
  const r=size/2-stroke;const circ=2*Math.PI*r;
  const offset=circ*(1-pct/100);
  const c=pct===100?"#10b981":pct>=60?"#6366f1":pct>=30?"#f59e0b":"#e2e8f0";
  return(
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{transition:"stroke-dashoffset .4s ease"}}/>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" style={{fontSize:size*.25,fontWeight:700,fill:c,transform:"rotate(90deg)",transformOrigin:"50% 50%"}}>{pct}%</text>
    </svg>
  );
}

/* ─────────────────── SHELL ─────────────────── */
function Shell({view,children}){
  const crumbs=view==="onboarding"||view==="offboarding"?"Employee Detail":null;
  return(
    <div style={{minHeight:"100vh",background:"#f4f6fb",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1e293b"}}>
      <style>{GLOBAL_CSS}</style>
      <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"0 28px",height:48,display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#94a3b8",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
        <span style={{color:"#6366f1",fontWeight:700,fontSize:13}}>NexusOps</span>
        <span style={{color:"#e2e8f0"}}>/</span>
        <span>HR</span>
        <span style={{color:"#e2e8f0"}}>/</span>
        <span style={{color:"#1e293b",fontWeight:600}}>HR &amp; Onboarding</span>
        {crumbs&&<><span style={{color:"#e2e8f0"}}>/</span><span style={{color:"#4f46e5",fontWeight:600}}>{crumbs}</span></>}
      </div>
      <div style={{padding:"24px 28px",maxWidth:1640,margin:"0 auto"}}>{children}</div>
    </div>
  );
}

/* ─────────────────── TOAST ─────────────────── */
function Toast({msg}){return msg?<div className="toast">{msg}</div>:null;}

/* ─────────────────── CHECKLIST VIEW (shared for onboarding + offboarding) ─────────────────── */
function ChecklistView({emp,sections,checksKey,onToggle,onBack,onInitiateOffboard,isOffboarding}){
  const checks=emp[checksKey]||{};
  const pct=calcProgress(checks,sections);
  const progressColor=pct===100?"#10b981":pct>=60?"#6366f1":pct>=30?"#f59e0b":"#94a3b8";
  return(
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button className="btn-ghost" style={{padding:"7px 12px",fontSize:12}} onClick={onBack}>← Back</button>
        <div style={{flex:1}}/>
        {!isOffboarding&&emp.status==="Active"&&(
          <button className="btn-danger" onClick={onInitiateOffboard}>Initiate Offboarding</button>
        )}
      </div>

      {/* Employee card */}
      <div className="section-card" style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <Avatar name={`${emp.firstName} ${emp.lastName}`} size={52}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:700,color:"#0f172a"}}>{emp.firstName} {emp.lastName}</span>
              <StatusBadge s={emp.status}/>
            </div>
            <div style={{fontSize:13,color:"#64748b",marginTop:3}}>{emp.jobTitle} · {emp.department}</div>
            <div style={{display:"flex",gap:16,marginTop:6,flexWrap:"wrap"}}>
              {[["📅 Start",fmt(emp.startDate)],["📍",emp.location],["💼",emp.workModel],["👤 Manager",emp.manager]].map(([k,v])=>(
                <span key={k} style={{fontSize:12,color:"#94a3b8"}}><span style={{fontWeight:600,color:"#64748b"}}>{k}:</span> {v}</span>
              ))}
              {emp.contractEnd&&<span style={{fontSize:12}}><span style={{fontWeight:600,color:"#64748b"}}>Ends:</span> <span style={{color:"#dc2626",fontWeight:600}}>{fmt(emp.contractEnd)} ({daysLeft(emp.contractEnd)}d)</span></span>}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <ProgressRing pct={pct} size={64} stroke={6}/>
            <span style={{fontSize:11,fontWeight:600,color:progressColor}}>{isOffboarding?"Offboarding":"Onboarding"} Progress</span>
          </div>
        </div>
        {emp.skills&&emp.skills.length>0&&(
          <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid #f1f5f9"}}>
            {emp.skills.map(s=><span key={s} className="skill-tag">{s}</span>)}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <div className="progress-bar" style={{flex:1}}>
          <div className="progress-fill" style={{width:`${pct}%`,background:progressColor}}/>
        </div>
        <span style={{fontSize:13,fontWeight:700,color:progressColor,minWidth:40}}>{pct}%</span>
        {pct===100&&<span style={{fontSize:13,fontWeight:600,color:"#10b981"}}>✓ Complete</span>}
      </div>

      {/* Sections */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
        {sections.map(sec=>{
          const arr=checks[sec.key]||[];
          const done=arr.filter(Boolean).length;
          return(
            <div key={sec.key} className="section-card" style={{marginBottom:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontWeight:700,fontSize:13,color:"#0f172a"}}>{sec.icon} {sec.label}</span>
                <span style={{fontSize:12,fontWeight:600,color:done===arr.length?"#10b981":"#94a3b8"}}>{done}/{arr.length}</span>
              </div>
              {sec.items.map((item,i)=>{
                const checked=!!arr[i];
                return(
                  <div key={i} className={`check-item${checked?" done":""}`} onClick={()=>onToggle(sec.key,i)}>
                    <div className={`check-box${checked?" checked":""}`}>
                      {checked&&<span style={{color:"#fff",fontSize:13,lineHeight:1}}>✓</span>}
                    </div>
                    <div style={{flex:1}}>
                      <div className="ci-title" style={{fontSize:13,fontWeight:500,color:checked?"#94a3b8":"#1e293b"}}>{item}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────── ADD EMPLOYEE MODAL ─────────────────── */
function AddEmployeeModal({onClose,onSave}){
  const blank={firstName:"",lastName:"",jobTitle:"",department:"Engineering",email:"",phone:"",location:"",workModel:"Hybrid",startDate:"",contractEnd:"",manager:"",status:"Onboarding"};
  const [form,setForm]=useState(blank);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const valid=form.firstName&&form.lastName&&form.jobTitle&&form.email&&form.startDate;
  function save(){
    const newEmp={
      ...form,
      id:`EMP-${String(Date.now()).slice(-4)}`,
      skills:[],
      onboardingChecks:{preArrival:[false,false,false,false],dayOne:[false,false,false],weekOne:[false,false,false],firstMonth:[false,false,false]},
      offboardingChecks:null,
    };
    onSave(newEmp);
  }
  return(
    <div className="overlay">
      <div className="modal">
        <div style={{padding:"20px 24px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:"#0f172a"}}>Add New Employee</span>
          <button className="btn-ghost" style={{padding:"4px 10px"}} onClick={onClose}>✕</button>
        </div>
        <div style={{padding:"20px 24px",overflowY:"auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[["First Name","firstName","text"],["Last Name","lastName","text"],["Job Title","jobTitle","text"],["Email","email","email"],["Phone","phone","text"],["Location","location","text"],["Start Date","startDate","date"],["Contract End (optional)","contractEnd","date"]].map(([label,key,type])=>(
            <div key={key}>
              <label className="field-label">{label}</label>
              <input className="finput" type={type} value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={label}/>
            </div>
          ))}
          <div>
            <label className="field-label">Department</label>
            <select className="fsel" value={form.department} onChange={e=>set("department",e.target.value)}>
              {DEPTS.filter(d=>d!=="All").map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Work Model</label>
            <select className="fsel" value={form.workModel} onChange={e=>set("workModel",e.target.value)}>
              {["Hybrid","Remote","Onsite"].map(w=><option key={w}>{w}</option>)}
            </select>
          </div>
          <div style={{gridColumn:"1 / -1"}}>
            <label className="field-label">Manager</label>
            <input className="finput" value={form.manager} onChange={e=>set("manager",e.target.value)} placeholder="Manager name"/>
          </div>
        </div>
        <div style={{padding:"16px 24px",borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"flex-end",gap:10}}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!valid} style={{opacity:valid?1:.5}} onClick={save}>Add Employee</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── OFFBOARD CONFIRM MODAL ─────────────────── */
function OffboardModal({emp,onConfirm,onClose}){
  const [exitDate,setExitDate]=useState("");
  const [reason,setReason]=useState("Resignation");
  return(
    <div className="overlay">
      <div className="modal" style={{maxWidth:480}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:"#dc2626"}}>Initiate Offboarding</span>
          <button className="btn-ghost" style={{padding:"4px 10px"}} onClick={onClose}>✕</button>
        </div>
        <div style={{padding:"20px 24px"}}>
          <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:"#dc2626"}}>
            You are initiating the offboarding process for <strong>{emp.firstName} {emp.lastName}</strong>. This will update their status and start the offboarding checklist.
          </div>
          <div style={{marginBottom:14}}>
            <label className="field-label">Reason for Leaving</label>
            <select className="fsel" value={reason} onChange={e=>setReason(e.target.value)}>
              {["Resignation","Contract End","Termination","Redundancy","Retirement"].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Last Working Day</label>
            <input className="finput" type="date" value={exitDate} onChange={e=>setExitDate(e.target.value)}/>
          </div>
        </div>
        <div style={{padding:"16px 24px",borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"flex-end",gap:10}}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={()=>onConfirm(exitDate,reason)}>Confirm Offboarding</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── EMPLOYEE LIST ─────────────────── */
function EmployeeList({employees,onSelect,onAdd}){
  const [search,setSearch]=useState("");
  const [deptFilter,setDeptFilter]=useState("All");
  const [statusFilter,setStatusFilter]=useState("All");

  const filtered=useMemo(()=>employees.filter(e=>{
    const name=`${e.firstName} ${e.lastName} ${e.jobTitle} ${e.department}`.toLowerCase();
    const matchSearch=!search||name.includes(search.toLowerCase());
    const matchDept=deptFilter==="All"||e.department===deptFilter;
    const matchStatus=statusFilter==="All"||e.status===statusFilter;
    return matchSearch&&matchDept&&matchStatus;
  }),[employees,search,deptFilter,statusFilter]);

  const stats=useMemo(()=>({
    total:employees.length,
    onboarding:employees.filter(e=>e.status==="Onboarding").length,
    active:employees.filter(e=>e.status==="Active").length,
    offboarding:employees.filter(e=>e.status==="Offboarding").length,
    onLeave:employees.filter(e=>e.status==="On Leave").length,
  }),[employees]);

  return(
    <div>
      {/* Page header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a"}}>HR &amp; Onboarding</h1>
          <p style={{fontSize:13,color:"#64748b",marginTop:4}}>Manage employee lifecycle — onboarding, active, and offboarding.</p>
        </div>
        <button className="btn-primary" onClick={onAdd}>+ Add Employee</button>
      </div>

      {/* Stat cards */}
      <div style={{display:"flex",gap:12,marginBottom:22,flexWrap:"wrap"}}>
        {[
          {label:"Total Employees",val:stats.total,color:"#6366f1",bg:"#eef2ff"},
          {label:"Onboarding",val:stats.onboarding,color:"#2563eb",bg:"#eff6ff"},
          {label:"Active",val:stats.active,color:"#059669",bg:"#ecfdf5"},
          {label:"On Leave",val:stats.onLeave,color:"#d97706",bg:"#fffbeb"},
          {label:"Offboarding",val:stats.offboarding,color:"#dc2626",bg:"#fef2f2"},
        ].map(c=>(
          <div key={c.label} className="stat-card" style={{cursor:"pointer"}} onClick={()=>setStatusFilter(c.label==="Total Employees"?"All":c.label)}>
            <div style={{fontSize:26,fontWeight:800,color:c.color,fontFamily:"'Sora',sans-serif"}}>{c.val}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:3,fontWeight:500}}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="section-card" style={{marginBottom:16}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{flex:1,minWidth:220}}>
            <input className="finput" placeholder="Search by name, title, department…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="fsel" style={{width:"auto",minWidth:150}} value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
            {DEPTS.map(d=><option key={d}>{d}</option>)}
          </select>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {STATUSES.map(s=>(
              <button key={s} className={`filter-chip${statusFilter===s?" active":""}`} onClick={()=>setStatusFilter(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="section-card" style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"1px solid #f1f5f9",background:"#fafbff"}}>
                {["Employee","Department","Work Model","Start Date","Status","Progress",""].map(h=>(
                  <th key={h} style={{padding:"11px 16px",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".6px",textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0&&(
                <tr><td colSpan={7} style={{padding:"36px",textAlign:"center",color:"#94a3b8",fontSize:13}}>No employees match your filters.</td></tr>
              )}
              {filtered.map(e=>{
                const sections=e.status==="Offboarding"?OFFBOARDING_SECTIONS:ONBOARDING_SECTIONS;
                const checksKey=e.status==="Offboarding"?"offboardingChecks":"onboardingChecks";
                const pct=calcProgress(e[checksKey],sections);
                const progressColor=pct===100?"#10b981":pct>=60?"#6366f1":pct>=30?"#f59e0b":"#e2e8f0";
                const showProgress=e.status==="Onboarding"||e.status==="Offboarding";
                return(
                  <tr key={e.id} className="trow" style={{borderBottom:"1px solid #f8fafc",cursor:"pointer"}} onClick={()=>onSelect(e)}>
                    <td style={{padding:"12px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <Avatar name={`${e.firstName} ${e.lastName}`} size={34}/>
                        <div>
                          <div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{e.firstName} {e.lastName}</div>
                          <div style={{fontSize:12,color:"#94a3b8"}}>{e.jobTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:"12px 16px",fontSize:13,color:"#374151"}}>{e.department}</td>
                    <td style={{padding:"12px 16px"}}>
                      <span style={{fontSize:12,fontWeight:500,color:"#64748b",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:4,padding:"2px 7px"}}>{e.workModel}</span>
                    </td>
                    <td style={{padding:"12px 16px",fontSize:13,color:"#374151"}}>{fmt(e.startDate)}</td>
                    <td style={{padding:"12px 16px"}}><StatusBadge s={e.status}/></td>
                    <td style={{padding:"12px 16px",minWidth:130}}>
                      {showProgress?(
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div className="progress-bar" style={{flex:1,height:6}}>
                            <div className="progress-fill" style={{width:`${pct}%`,background:progressColor,height:6}}/>
                          </div>
                          <span style={{fontSize:11,fontWeight:700,color:progressColor,minWidth:30}}>{pct}%</span>
                        </div>
                      ):(
                        <span style={{fontSize:12,color:"#94a3b8"}}>—</span>
                      )}
                    </td>
                    <td style={{padding:"12px 16px"}}>
                      <button className="btn-ghost row-act" style={{padding:"4px 10px",fontSize:12}} onClick={e2=>{e2.stopPropagation();onSelect(e);}}>View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid #f1f5f9",fontSize:12,color:"#94a3b8"}}>
          Showing {filtered.length} of {employees.length} employees
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN APP ─────────────────── */
export default function App(){
  const [employees,setEmployees]=useState(SEED_EMPLOYEES);
  const [view,setView]=useState("list"); // list | onboarding | offboarding
  const [selected,setSelected]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [showOffboard,setShowOffboard]=useState(false);
  const [toast,setToast]=useState("");

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(""),3000);}

  function handleSelect(emp){
    setSelected(emp);
    setView(emp.status==="Offboarding"?"offboarding":"onboarding");
  }

  function handleToggle(sectionKey,idx){
    setSelected(prev=>{
      const checksKey=prev.status==="Offboarding"?"offboardingChecks":"onboardingChecks";
      const checks={...prev[checksKey]};
      const arr=[...(checks[sectionKey]||[])];
      arr[idx]=!arr[idx];
      checks[sectionKey]=arr;
      const updated={...prev,[checksKey]:checks};
      setEmployees(es=>es.map(e=>e.id===updated.id?updated:e));
      return updated;
    });
  }

  function handleAddEmployee(newEmp){
    setEmployees(prev=>[newEmp,...prev]);
    setShowAdd(false);
    showToast(`${newEmp.firstName} ${newEmp.lastName} added successfully`);
  }

  function handleInitiateOffboard(){setShowOffboard(true);}

  function handleConfirmOffboard(exitDate,reason){
    setEmployees(prev=>prev.map(e=>{
      if(e.id!==selected.id)return e;
      return {...e,status:"Offboarding",contractEnd:exitDate||e.contractEnd,offboardingChecks:{hrNotice:[false,false,false],knowledgeTransfer:[false,false,false,false],itAccess:[false,false,false],finalSteps:[false,false,false]}};
    }));
    setSelected(prev=>({...prev,status:"Offboarding",contractEnd:exitDate||prev.contractEnd,offboardingChecks:{hrNotice:[false,false,false],knowledgeTransfer:[false,false,false,false],itAccess:[false,false,false],finalSteps:[false,false,false]}}));
    setShowOffboard(false);
    setView("offboarding");
    showToast(`Offboarding initiated for ${selected.firstName} ${selected.lastName}`);
  }

  const isOffboarding=view==="offboarding";
  const sections=isOffboarding?OFFBOARDING_SECTIONS:ONBOARDING_SECTIONS;
  const checksKey=isOffboarding?"offboardingChecks":"onboardingChecks";

  return(
    <Shell view={view}>
      {view==="list"?(
        <EmployeeList employees={employees} onSelect={handleSelect} onAdd={()=>setShowAdd(true)}/>
      ):(
        selected&&(
          <ChecklistView
            emp={selected}
            sections={sections}
            checksKey={checksKey}
            onToggle={handleToggle}
            onBack={()=>setView("list")}
            onInitiateOffboard={handleInitiateOffboard}
            isOffboarding={isOffboarding}
          />
        )
      )}
      {showAdd&&<AddEmployeeModal onClose={()=>setShowAdd(false)} onSave={handleAddEmployee}/>}
      {showOffboard&&selected&&<OffboardModal emp={selected} onConfirm={handleConfirmOffboard} onClose={()=>setShowOffboard(false)}/>}
      <Toast msg={toast}/>
    </Shell>
  );
}
