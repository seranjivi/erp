import { useState, useMemo } from "react";

/* ─── COLORS ─────────────────────────────────────────────────────────── */
const C = {
  primary:"#1a56db",primaryDark:"#1e429f",primaryLight:"#ebf5ff",
  success:"#10b981",successBg:"#ecfdf5",
  warning:"#f59e0b",warningBg:"#fffbeb",
  danger:"#ef4444",dangerBg:"#fef2f2",
  purple:"#8b5cf6",purpleBg:"#f5f3ff",
  orange:"#f97316",orangeBg:"#fff7ed",
  teal:"#0d9488",tealBg:"#f0fdfa",
  surface:"#fff",bg:"#f8fafc",border:"#e2e8f0",
  text:"#0f172a",textMid:"#475569",textLight:"#94a3b8",
};
const PROJ_CLR = {
  "PRJ-001":"#1a56db","PRJ-002":"#8b5cf6","PRJ-003":"#0d9488",
  "PRJ-004":"#ef4444","PRJ-005":"#f97316","PRJ-006":"#0ea5e9",
};

/* ─── TIMELINE ───────────────────────────────────────────────────────── */
const TL_START  = new Date("2026-03-01");
const TL_DAYS   = 184;
const TL_W      = 800;
const TODAY_PX  = Math.round(((new Date("2026-03-12")-TL_START)/86400000/TL_DAYS)*TL_W);
const MONTH_MARKS = [0,1,2,3,4,5].map(i=>{const d=new Date("2026-03-01");d.setMonth(d.getMonth()+i);return d;});
const MONTH_LABELS = ["Mar '26","Apr '26","May '26","Jun '26","Jul '26","Aug '26"];
const px  = d => Math.max(0,Math.min(TL_W,((new Date(d)-TL_START)/86400000/TL_DAYS)*TL_W));
const bw  = (s,e) => Math.max(6, px(e)-px(s));
const fmtD = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

/* ─── CSS ────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:${C.bg};color:${C.text}}
  input,select,button,textarea{font-family:'DM Sans',sans-serif}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px}
  .fade-in{animation:fadeIn 0.2s ease}
  @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  .btn-primary{background:${C.primary};color:#fff;border:none;border-radius:8px;padding:9px 20px;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.15s}
  .btn-primary:hover{background:${C.primaryDark}}
  .btn-ghost{background:transparent;color:${C.textMid};border:1.5px solid ${C.border};border-radius:8px;padding:8px 16px;font-size:13.5px;font-weight:500;cursor:pointer;transition:all 0.15s}
  .btn-ghost:hover{border-color:${C.primary};color:${C.primary}}
  .btn-sm{background:${C.primaryLight};color:${C.primary};border:1px solid rgba(26,86,219,0.2);border-radius:6px;padding:5px 12px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s}
  .btn-sm:hover{background:${C.primary};color:#fff}
  .btn-danger-sm{background:${C.dangerBg};color:${C.danger};border:1.5px solid #fecaca;border-radius:6px;padding:5px 12px;font-size:12px;font-weight:600;cursor:pointer}
  .card{background:#fff;border-radius:12px;border:1px solid ${C.border}}
  .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.3px;white-space:nowrap}
  .finput{width:100%;border:1.5px solid ${C.border};border-radius:8px;padding:8px 12px;font-size:13.5px;color:${C.text};outline:none;transition:border 0.15s;background:#fff}
  .finput:focus{border-color:${C.primary};box-shadow:0 0 0 3px rgba(26,86,219,0.08)}
  .fsel{width:100%;border:1.5px solid ${C.border};border-radius:8px;padding:8px 12px;font-size:13.5px;color:${C.text};outline:none;background:#fff;cursor:pointer}
  .fsel:focus{border-color:${C.primary}}
  .section-title{font-size:11px;font-weight:700;color:${C.textLight};text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid ${C.border}}
  .tab-btn{padding:7px 18px;border-radius:8px;font-size:13.5px;font-weight:500;cursor:pointer;transition:all 0.15s;color:${C.textMid};border:none;background:transparent}
  .tab-btn.active{background:${C.primary};color:#fff}
  .tab-btn:hover:not(.active){background:${C.bg};color:${C.text}}
  .gantt-row{display:flex;align-items:stretch;border-bottom:1px solid ${C.border};cursor:pointer;transition:background 0.1s}
  .gantt-row:hover{background:#f0f4ff}
  .gantt-row:hover .gr-name{color:${C.primary}}
  .modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.4);z-index:300;display:flex;justify-content:flex-end}
  .drawer{background:#fff;width:520px;height:100vh;overflow-y:auto;box-shadow:-8px 0 40px rgba(0,0,0,0.15);animation:slideD 0.22s ease}
  @keyframes slideD{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
  .conflict-card{border:1.5px solid #fecaca;border-radius:12px;padding:18px;background:${C.dangerBg};transition:box-shadow 0.15s;margin-bottom:14px}
  .conflict-card:hover{box-shadow:0 4px 16px rgba(239,68,68,0.1)}
  .conflict-card.resolved{border-color:#bbf7d0;background:${C.successBg};opacity:0.7}
  .nav-item{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:8px;color:rgba(255,255,255,0.65);font-size:13.5px;font-weight:500;cursor:pointer;transition:all 0.15s;white-space:nowrap;border:none;background:transparent;width:100%}
  .nav-item:hover{background:rgba(255,255,255,0.07);color:#fff}
  .nav-item.active{background:rgba(26,86,219,0.85);color:#fff}
  .stat-card{background:#fff;border-radius:12px;border:1px solid ${C.border};padding:18px 22px}
  .resolve-btn{border-radius:7px;padding:7px 14px;font-size:12.5px;font-weight:600;cursor:pointer;transition:all 0.15s;border:1.5px solid}
`;

/* ─── ICONS ──────────────────────────────────────────────────────────── */
const Icon = ({name,size=16,color="currentColor"})=>{
  const p = {
    users:    <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    user:     <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    alert:    <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    check:    <><polyline points="20 6 9 17 4 12"/></>,
    x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    layers:   <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    edit:     <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    percent:  <><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>,
    briefcase:<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
    clock:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    chevR:    <><polyline points="9 18 15 12 9 6"/></>,
    swap:     <><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></>,
    search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    filter:   <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    dashboard:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    folder:   <><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></>,
    zap:      <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{p[name]}</svg>;
};

/* ─── SEED DATA ──────────────────────────────────────────────────────── */
const RESOURCES = [
  {id:"RES-001",name:"Ravi Shankar",   role:"Full Stack Dev",   dept:"Engineering",   seniority:"Senior",  loc:"Bengaluru"},
  {id:"RES-004",name:"Sneha Pillai",   role:"Project Manager",  dept:"PMO",           seniority:"Lead",    loc:"Bengaluru"},
  {id:"RES-005",name:"Vikram Das",     role:"DevOps Engineer",  dept:"Infrastructure",seniority:"Senior",  loc:"Hyderabad"},
  {id:"RES-006",name:"Meera Krishnan", role:"Business Analyst", dept:"Consulting",    seniority:"Mid",     loc:"Chennai"},
  {id:"RES-007",name:"Arjun Mehta",    role:"Frontend Dev",     dept:"Engineering",   seniority:"Mid",     loc:"Bengaluru"},
  {id:"RES-008",name:"Lakshmi Rao",    role:"Cloud Architect",  dept:"Infrastructure",seniority:"Principal",loc:"Bengaluru"},
  {id:"RES-009",name:"Suresh Babu",    role:"Delivery Manager", dept:"PMO",           seniority:"Director",loc:"Mumbai"},
  {id:"RES-011",name:"Rahul Verma",    role:"ML Engineer",      dept:"Data",          seniority:"Senior",  loc:"Hyderabad"},
  {id:"RES-012",name:"Kavya Iyer",     role:"Scrum Master",     dept:"PMO",           seniority:"Mid",     loc:"Bengaluru"},
  {id:"RES-013",name:"Nathan Cruz",    role:"Backend Dev",      dept:"Engineering",   seniority:"Mid",     loc:"Remote"},
];

const PROJECTS = {
  "PRJ-001":{name:"Nexus Digital Transformation", client:"Nexus Corp",        short:"Nexus DT"},
  "PRJ-002":{name:"Meridian Analytics Suite",     client:"Meridian Holdings", short:"Meridian AS"},
  "PRJ-003":{name:"BlueStar Mobile Commerce",     client:"BlueStar Retail",   short:"BlueStar MC"},
  "PRJ-004":{name:"Orion Financial Cloud Mgn",    client:"Orion Financial",   short:"Orion CM"},
  "PRJ-005":{name:"TrueNorth Legal Ops Platform", client:"TrueNorth Law",     short:"TrueNorth LO"},
  "PRJ-006":{name:"Summit Energy Cloud Lift",     client:"Summit Energy",     short:"Summit CL"},
};

const ALLOCATIONS_SEED = [
  {id:"ALO-001",resId:"RES-001",projId:"PRJ-002",pct:90,start:"2026-01-15",end:"2026-04-15",billable:true, role:"Lead Full Stack Dev", status:"Active"},
  {id:"ALO-002",resId:"RES-001",projId:"PRJ-001",pct:30,start:"2026-04-01",end:"2026-07-15",billable:true, role:"Backend Consultant",  status:"Active"},
  {id:"ALO-003",resId:"RES-004",projId:"PRJ-003",pct:75,start:"2026-03-01",end:"2026-10-31",billable:true, role:"Project Manager",     status:"Active"},
  {id:"ALO-004",resId:"RES-005",projId:"PRJ-001",pct:100,start:"2026-01-01",end:"2026-04-30",billable:true,role:"DevOps Lead",          status:"Active"},
  {id:"ALO-005",resId:"RES-006",projId:"PRJ-004",pct:20,start:"2026-02-10",end:"2026-06-30",billable:true, role:"Business Analyst",    status:"Active"},
  {id:"ALO-006",resId:"RES-007",projId:"PRJ-003",pct:80,start:"2026-03-01",end:"2026-10-31",billable:true, role:"Frontend Developer",  status:"Active"},
  {id:"ALO-007",resId:"RES-008",projId:"PRJ-001",pct:80,start:"2026-01-01",end:"2026-06-01",billable:true, role:"Cloud Architect",     status:"Active"},
  {id:"ALO-008",resId:"RES-009",projId:"PRJ-002",pct:60,start:"2026-01-01",end:"2026-07-01",billable:false,role:"Delivery Manager",    status:"Active"},
  {id:"ALO-009",resId:"RES-011",projId:"PRJ-005",pct:85,start:"2026-02-01",end:"2026-05-15",billable:true, role:"ML Engineer",         status:"Active"},
  {id:"ALO-010",resId:"RES-012",projId:"PRJ-003",pct:30,start:"2026-03-01",end:"2026-10-31",billable:true, role:"Scrum Master",        status:"Active"},
  {id:"ALO-011",resId:"RES-013",projId:"PRJ-001",pct:100,start:"2026-01-01",end:"2026-03-31",billable:true,role:"Backend Developer",   status:"Active"},
  {id:"ALO-012",resId:"RES-008",projId:"PRJ-002",pct:40,start:"2026-05-15",end:"2026-08-01",billable:true, role:"Technical Advisor",   status:"Pending"},
  {id:"ALO-013",resId:"RES-005",projId:"PRJ-003",pct:60,start:"2026-04-15",end:"2026-07-31",billable:true, role:"DevOps Consultant",   status:"Pending"},
  {id:"ALO-014",resId:"RES-011",projId:"PRJ-002",pct:50,start:"2026-05-01",end:"2026-09-15",billable:true, role:"Data Scientist",      status:"Pending"},
];

/* ─── HELPERS ────────────────────────────────────────────────────────── */
const avPalette = ["#1a56db","#8b5cf6","#0d9488","#f97316","#e11d48","#0ea5e9","#16a34a","#d97706"];
const avatar = (name,size=34) => {
  const idx = name.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%avPalette.length;
  const initials = name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:avPalette[idx],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:size*0.35,fontWeight:700,color:"#fff",fontFamily:"Sora,sans-serif"}}>
      {initials}
    </div>
  );
};

const detectConflicts = (allocs) => {
  const groups = {};
  allocs.forEach(a=>{if(!groups[a.resId])groups[a.resId]=[];groups[a.resId].push(a);});
  const result=[];
  Object.entries(groups).forEach(([resId,list])=>{
    for(let i=0;i<list.length;i++){
      for(let j=i+1;j<list.length;j++){
        const a=list[i],b=list[j];
        const os=new Date(Math.max(new Date(a.start),new Date(b.start)));
        const oe=new Date(Math.min(new Date(a.end),new Date(b.end)));
        if(os<oe && a.pct+b.pct>100){
          result.push({
            id:`${a.id}-${b.id}`,resId,
            allocA:a,allocB:b,
            totalPct:a.pct+b.pct,
            overStart:os.toISOString().slice(0,10),
            overEnd:oe.toISOString().slice(0,10),
          });
        }
      }
    }
  });
  return result;
};

/* ─── STAT CARDS ─────────────────────────────────────────────────────── */
const StatCards = ({allocs,conflicts,resources}) => {
  const activeResIds = new Set(allocs.map(a=>a.resId));
  const totalAlloc = resources.filter(r=>activeResIds.has(r.id)).length;
  const fullyAlloc = resources.filter(r=>{
    const total = allocs.filter(a=>a.resId===r.id && a.status==="Active").reduce((s,a)=>s+a.pct,0);
    return total>=100;
  }).length;
  const stats = [
    {label:"Allocated Resources", value:totalAlloc, icon:"users",    color:C.primary, bg:C.primaryLight},
    {label:"Active Allocations",  value:allocs.filter(a=>a.status==="Active").length, icon:"briefcase",color:C.teal,  bg:C.tealBg},
    {label:"Fully Allocated",     value:fullyAlloc, icon:"percent",  color:C.warning, bg:C.warningBg},
    {label:"Pending Approvals",   value:allocs.filter(a=>a.status==="Pending").length,icon:"clock",    color:C.orange,bg:C.orangeBg},
    {label:"Conflicts Detected",  value:conflicts.length, icon:"alert",   color:C.danger, bg:C.dangerBg},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:24}}>
      {stats.map(s=>(
        <div key={s.label} className="stat-card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{fontSize:26,fontWeight:700,color:C.text,fontFamily:"Sora,sans-serif"}}>{s.value}</div>
            <div style={{background:s.bg,borderRadius:8,padding:"6px 8px",color:s.color}}>
              <Icon name={s.icon} size={16} color={s.color}/>
            </div>
          </div>
          <div style={{fontSize:12.5,color:C.textMid,marginTop:6}}>{s.label}</div>
        </div>
      ))}
    </div>
  );
};

/* ─── GANTT ROW ──────────────────────────────────────────────────────── */
const GanttRow = ({resource,allocs,hasConflict,onClick}) => {
  const [hoverBar,setHoverBar] = useState(null);
  const totalPct = allocs.filter(a=>a.status==="Active").reduce((s,a)=>s+a.pct,0);
  const utilColor = totalPct>100 ? C.danger : totalPct>=80 ? C.warning : totalPct>=40 ? C.success : C.textLight;

  return (
    <div className="gantt-row" onClick={onClick} style={{borderLeft:hasConflict?`3px solid ${C.danger}`:"3px solid transparent"}}>
      {/* Resource name column */}
      <div style={{width:240,minWidth:240,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,borderRight:`1px solid ${C.border}`}}>
        {avatar(resource.name,32)}
        <div style={{minWidth:0}}>
          <div className="gr-name" style={{fontSize:13,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",transition:"color 0.1s"}}>{resource.name}</div>
          <div style={{fontSize:11.5,color:C.textLight,marginTop:1}}>{resource.role}</div>
        </div>
        {hasConflict && (
          <span title="Allocation conflict" style={{marginLeft:"auto",flexShrink:0,color:C.danger}}>
            <Icon name="alert" size={13} color={C.danger}/>
          </span>
        )}
      </div>

      {/* Timeline area */}
      <div style={{flex:1,position:"relative",height:52,overflow:"hidden"}}>
        {/* Month gridlines */}
        {MONTH_MARKS.map((m,i)=>(
          <div key={i} style={{position:"absolute",left:px(m),top:0,bottom:0,width:1,background:i===0?"transparent":"#e9eef5",zIndex:0}}/>
        ))}
        {/* Today marker */}
        <div style={{position:"absolute",left:TODAY_PX,top:0,bottom:0,width:2,background:"rgba(26,86,219,0.25)",zIndex:1}}/>

        {/* Allocation bars */}
        {allocs.map(a=>{
          const left=px(a.start);
          const width=bw(a.start,a.end);
          const clr=PROJ_CLR[a.projId]||C.primary;
          const isHov=hoverBar===a.id;
          const pending=a.status==="Pending";
          return (
            <div key={a.id}
              onMouseEnter={e=>{e.stopPropagation();setHoverBar(a.id);}}
              onMouseLeave={()=>setHoverBar(null)}
              style={{
                position:"absolute",
                left,width,
                top:14,height:24,
                background:pending?`repeating-linear-gradient(45deg,${clr}22,${clr}22 4px,${clr}44 4px,${clr}44 8px)`:clr,
                borderRadius:5,
                border:`1.5px solid ${pending?clr+"66":clr+"cc"}`,
                display:"flex",alignItems:"center",overflow:"hidden",
                cursor:"pointer",
                transition:"transform 0.1s,box-shadow 0.1s",
                transform:isHov?"scaleY(1.12)":"scaleY(1)",
                boxShadow:isHov?`0 2px 8px ${clr}55`:"none",
                zIndex:isHov?10:2,
              }}>
              {width>46 && (
                <span style={{fontSize:10.5,fontWeight:700,color:"#fff",padding:"0 7px",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",textShadow:"0 1px 2px rgba(0,0,0,0.2)"}}>
                  {PROJECTS[a.projId]?.short || a.projId} {a.pct}%
                </span>
              )}
              {/* Tooltip */}
              {isHov && (
                <div style={{position:"absolute",bottom:30,left:0,background:"#1e293b",color:"#fff",borderRadius:7,padding:"7px 11px",fontSize:11.5,whiteSpace:"nowrap",zIndex:50,pointerEvents:"none",boxShadow:"0 4px 12px rgba(0,0,0,0.25)"}}>
                  <div style={{fontWeight:700,marginBottom:3}}>{PROJECTS[a.projId]?.short}</div>
                  <div style={{color:"#94a3b8"}}>{a.role} · {a.pct}% · {a.status}</div>
                  <div style={{color:"#94a3b8",marginTop:2}}>{fmtD(a.start)} – {fmtD(a.end)}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Utilization % */}
      <div style={{width:60,display:"flex",alignItems:"center",justifyContent:"center",borderLeft:`1px solid ${C.border}`,fontSize:12,fontWeight:700,color:utilColor}}>
        {totalPct}%
      </div>
    </div>
  );
};

/* ─── ALLOCATION BOARD ───────────────────────────────────────────────── */
const AllocationBoard = ({allocs,onSelectRes,conflicts}) => {
  const [search,setSearch]  = useState("");
  const [filterDept,setDept]= useState("");
  const [filterProj,setProj]= useState("");
  const [showConflicts,setShowConflicts] = useState(false);
  const conflictResIds = new Set(conflicts.map(c=>c.resId));

  const filtered = useMemo(()=>RESOURCES.filter(r=>{
    if(search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.role.toLowerCase().includes(search.toLowerCase())) return false;
    if(filterDept && r.dept!==filterDept) return false;
    const resAllocs=allocs.filter(a=>a.resId===r.id);
    if(filterProj && !resAllocs.some(a=>a.projId===filterProj)) return false;
    if(showConflicts && !conflictResIds.has(r.id)) return false;
    return true;
  }),[search,filterDept,filterProj,showConflicts,allocs,conflictResIds]);

  const depts = [...new Set(RESOURCES.map(r=>r.dept))].sort();

  return (
    <div className="fade-in">
      {/* Filter bar */}
      <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200,maxWidth:280}}>
          <Icon name="search" size={14} color={C.textLight} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)"}}/>
          <input className="finput" placeholder="Search by name or role…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{paddingLeft:34}}/>
        </div>
        <select className="fsel" style={{width:160}} value={filterDept} onChange={e=>setDept(e.target.value)}>
          <option value="">All Departments</option>
          {depts.map(d=><option key={d} value={d}>{d}</option>)}
        </select>
        <select className="fsel" style={{width:180}} value={filterProj} onChange={e=>setProj(e.target.value)}>
          <option value="">All Projects</option>
          {Object.entries(PROJECTS).map(([id,p])=><option key={id} value={id}>{p.short}</option>)}
        </select>
        <button className={`btn-ghost`} onClick={()=>setShowConflicts(v=>!v)}
          style={{borderColor:showConflicts?C.danger:"",color:showConflicts?C.danger:"",background:showConflicts?C.dangerBg:"",gap:6,display:"flex",alignItems:"center"}}>
          <Icon name="alert" size={13} color={showConflicts?C.danger:C.textMid}/>
          {showConflicts?"Conflicts only":"Show conflicts"}
          {conflicts.length>0 && <span style={{background:C.danger,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10.5,fontWeight:700}}>{conflicts.length}</span>}
        </button>
      </div>

      {/* Gantt table */}
      <div className="card" style={{overflow:"hidden"}}>
        {/* Header row */}
        <div style={{display:"flex",borderBottom:`2px solid ${C.border}`,background:C.bg}}>
          <div style={{width:240,minWidth:240,padding:"10px 14px",fontSize:11.5,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:"0.6px",borderRight:`1px solid ${C.border}`}}>
            Resource
          </div>
          <div style={{flex:1,position:"relative",height:38}}>
            {MONTH_MARKS.map((m,i)=>(
              <div key={i} style={{position:"absolute",left:px(m),top:0,height:"100%",paddingTop:12}}>
                <span style={{fontSize:10.5,fontWeight:700,color:C.textLight,letterSpacing:"0.4px",paddingLeft:6}}>{MONTH_LABELS[i]}</span>
              </div>
            ))}
            {/* Today line in header */}
            <div style={{position:"absolute",left:TODAY_PX,top:0,bottom:0,width:2,background:"rgba(26,86,219,0.3)"}}/>
            <div style={{position:"absolute",left:TODAY_PX-16,top:4,background:C.primary,color:"#fff",fontSize:9.5,fontWeight:700,borderRadius:4,padding:"2px 5px",letterSpacing:"0.2px"}}>TODAY</div>
          </div>
          <div style={{width:60,display:"flex",alignItems:"center",justifyContent:"center",borderLeft:`1px solid ${C.border}`,fontSize:11,fontWeight:700,color:C.textLight}}>
            UTIL
          </div>
        </div>

        {/* Resource rows */}
        {filtered.length===0 ? (
          <div style={{padding:"40px 0",textAlign:"center",color:C.textLight,fontSize:14}}>No resources match your filters.</div>
        ) : filtered.map(res=>(
          <GanttRow key={res.id}
            resource={res}
            allocs={allocs.filter(a=>a.resId===res.id)}
            hasConflict={conflictResIds.has(res.id)}
            onClick={()=>onSelectRes(res)}/>
        ))}
      </div>

      {/* Legend */}
      <div style={{marginTop:14,display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,color:C.textLight,fontWeight:600}}>Projects:</span>
        {Object.entries(PROJECTS).map(([id,p])=>(
          <div key={id} style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:12,height:12,borderRadius:3,background:PROJ_CLR[id],display:"inline-block"}}/>
            <span style={{fontSize:11.5,color:C.textMid}}>{p.short}</span>
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:5,marginLeft:8}}>
          <span style={{width:14,height:10,borderRadius:3,background:"repeating-linear-gradient(45deg,#8b5cf633,#8b5cf633 3px,#8b5cf655 3px,#8b5cf655 6px)",border:"1.5px solid #8b5cf666",display:"inline-block"}}/>
          <span style={{fontSize:11.5,color:C.textMid}}>Pending approval</span>
        </div>
      </div>
    </div>
  );
};

/* ─── ALLOCATION DETAIL DRAWER ───────────────────────────────────────── */
const AllocationDetail = ({resource,allocs,onClose}) => {
  const [editing,setEditing] = useState(null);
  const [pctEdit,setPctEdit] = useState("");

  const grouped = allocs.reduce((m,a)=>{
    if(!m[a.projId])m[a.projId]=[];
    m[a.projId].push(a);
    return m;
  },{});

  const totalActive = allocs.filter(a=>a.status==="Active").reduce((s,a)=>s+a.pct,0);
  const utilColor = totalActive>100?C.danger:totalActive>=80?C.warning:C.success;

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="drawer fade-in">
        {/* Header */}
        <div style={{padding:"24px 26px 18px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              {avatar(resource.name,48)}
              <div>
                <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:17,color:C.text}}>{resource.name}</div>
                <div style={{fontSize:13,color:C.textMid,marginTop:2}}>{resource.role} · {resource.dept}</div>
                <div style={{marginTop:6,display:"flex",gap:6,alignItems:"center"}}>
                  <span className="badge" style={{background:C.primaryLight,color:C.primary}}>{resource.seniority}</span>
                  <span className="badge" style={{background:"#f1f5f9",color:C.textMid}}>{resource.loc}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{border:"none",background:"#f1f5f9",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.textMid}}>
              <Icon name="x" size={16}/>
            </button>
          </div>

          {/* Utilization summary */}
          <div style={{background:C.bg,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:12.5,color:C.textMid,fontWeight:500}}>Total Allocation</span>
              <span style={{fontSize:16,fontWeight:700,color:utilColor,fontFamily:"Sora,sans-serif"}}>{totalActive}%</span>
            </div>
            <div style={{height:6,borderRadius:6,background:C.border}}>
              <div style={{height:6,borderRadius:6,background:utilColor,width:`${Math.min(100,totalActive)}%`,transition:"width 0.3s"}}/>
            </div>
            {totalActive>100 && (
              <div style={{marginTop:8,display:"flex",alignItems:"center",gap:5,color:C.danger,fontSize:12,fontWeight:600}}>
                <Icon name="alert" size={12} color={C.danger}/>
                Over-allocated by {totalActive-100}% — conflict detected
              </div>
            )}
          </div>
        </div>

        {/* Allocations by project */}
        <div style={{padding:"20px 26px"}}>
          <div className="section-title">Allocation Breakdown</div>

          {Object.entries(grouped).map(([projId,projAllocs])=>{
            const proj=PROJECTS[projId];
            const clr=PROJ_CLR[projId]||C.primary;
            return (
              <div key={projId} style={{marginBottom:16,padding:"14px 16px",border:`1px solid ${C.border}`,borderRadius:10,borderLeft:`4px solid ${clr}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <div style={{fontSize:13.5,fontWeight:700,color:C.text}}>{proj?.name||projId}</div>
                    <div style={{fontSize:12,color:C.textMid,marginTop:1}}>{proj?.client}</div>
                  </div>
                  <span style={{background:clr+"18",color:clr,borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700}}>
                    {projId}
                  </span>
                </div>
                {projAllocs.map(a=>(
                  <div key={a.id} style={{padding:"10px 12px",background:C.bg,borderRadius:8,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:12.5,fontWeight:600,color:C.text}}>{a.role}</span>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <span className="badge" style={{background:a.status==="Active"?C.successBg:C.warningBg,color:a.status==="Active"?C.success:C.warning}}>
                          {a.status}
                        </span>
                        <span className="badge" style={{background:a.billable?C.primaryLight:"#f1f5f9",color:a.billable?C.primary:C.textMid}}>
                          {a.billable?"Billable":"Non-Billable"}
                        </span>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:16,alignItems:"center"}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <span style={{fontSize:11.5,color:C.textLight}}>Allocation</span>
                          {editing===a.id ? (
                            <div style={{display:"flex",gap:4,alignItems:"center"}}>
                              <input type="number" value={pctEdit} onChange={e=>setPctEdit(e.target.value)}
                                style={{width:52,border:`1.5px solid ${C.primary}`,borderRadius:5,padding:"1px 5px",fontSize:12,fontWeight:700,color:C.primary,outline:"none"}}/>
                              <span style={{fontSize:11,color:C.textLight}}>%</span>
                              <button className="btn-sm" onClick={()=>setEditing(null)} style={{padding:"2px 7px",fontSize:11}}>Save</button>
                            </div>
                          ) : (
                            <span style={{fontSize:12.5,fontWeight:700,color:clr,display:"flex",alignItems:"center",gap:4}}>
                              {a.pct}%
                              <button onClick={()=>{setEditing(a.id);setPctEdit(a.pct);}}
                                style={{border:"none",background:"none",cursor:"pointer",color:C.textLight,padding:0,lineHeight:1}}>
                                <Icon name="edit" size={11} color={C.textLight}/>
                              </button>
                            </span>
                          )}
                        </div>
                        <div style={{height:4,borderRadius:4,background:C.border}}>
                          <div style={{height:4,borderRadius:4,background:clr,width:`${a.pct}%`}}/>
                        </div>
                      </div>
                    </div>
                    <div style={{marginTop:8,display:"flex",gap:10,fontSize:11.5,color:C.textMid}}>
                      <span style={{display:"flex",alignItems:"center",gap:4}}>
                        <Icon name="calendar" size={11} color={C.textLight}/>
                        {fmtD(a.start)}
                      </span>
                      <span style={{color:C.textLight}}>→</span>
                      <span>{fmtD(a.end)}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {allocs.length===0 && (
            <div style={{padding:"30px 0",textAlign:"center",color:C.textLight,fontSize:14}}>No active allocations for this resource.</div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── CONFLICT RESOLUTION ────────────────────────────────────────────── */
const ConflictResolution = ({allocs,resolvedIds,onResolve}) => {
  const conflicts = useMemo(()=>detectConflicts(allocs),[allocs]);
  const [expanded,setExpanded] = useState(null);

  if(conflicts.length===0){
    return (
      <div className="fade-in card" style={{padding:"60px 32px",textAlign:"center",marginTop:8}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:C.successBg,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name="check" size={24} color={C.success}/>
        </div>
        <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:17,color:C.text,marginBottom:6}}>No Conflicts Detected</div>
        <div style={{fontSize:13.5,color:C.textLight}}>All resource allocations are within capacity limits.</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Summary banner */}
      <div style={{background:C.dangerBg,border:`1.5px solid #fecaca`,borderRadius:10,padding:"12px 16px",marginBottom:18,display:"flex",alignItems:"center",gap:10}}>
        <Icon name="alert" size={18} color={C.danger}/>
        <div>
          <span style={{fontWeight:700,color:C.danger,fontSize:13.5}}>{conflicts.length - resolvedIds.size} active conflict{conflicts.length - resolvedIds.size!==1?"s":""} detected</span>
          <span style={{color:C.danger,fontSize:12.5,marginLeft:8}}>— resources are over-allocated during the overlapping periods shown below.</span>
        </div>
      </div>

      {conflicts.map(cf=>{
        const res  = RESOURCES.find(r=>r.id===cf.resId);
        const projA= PROJECTS[cf.allocA.projId];
        const projB= PROJECTS[cf.allocB.projId];
        const clrA = PROJ_CLR[cf.allocA.projId]||C.primary;
        const clrB = PROJ_CLR[cf.allocB.projId]||C.purple;
        const isResolved = resolvedIds.has(cf.id);
        const isOpen = expanded===cf.id;
        const over = cf.totalPct-100;

        return (
          <div key={cf.id} className={`conflict-card${isResolved?" resolved":""}`}>
            {/* Conflict header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                {avatar(res?.name||cf.resId,38)}
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:14,fontWeight:700,color:isResolved?C.success:C.text}}>{res?.name}</span>
                    {isResolved
                      ? <span className="badge" style={{background:C.successBg,color:C.success}}>Resolved</span>
                      : <span className="badge" style={{background:C.dangerBg,color:C.danger}}>+{over}% over</span>
                    }
                  </div>
                  <div style={{fontSize:12.5,color:C.textMid,marginTop:2}}>{res?.role} · {res?.dept}</div>
                  <div style={{fontSize:12,color:isResolved?C.success:C.danger,marginTop:4,fontWeight:500}}>
                    Conflict period: {fmtD(cf.overStart)} – {fmtD(cf.overEnd)} · Combined: {cf.totalPct}%
                  </div>
                </div>
              </div>
              <button onClick={()=>setExpanded(isOpen?null:cf.id)} style={{border:`1px solid ${isResolved?"#bbf7d0":C.danger}`,background:"transparent",borderRadius:7,padding:"5px 10px",cursor:"pointer",color:isResolved?C.success:C.danger,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4,transition:"transform 0.15s",transform:isOpen?"rotate(-90deg)":"rotate(0deg)"}}>
                <Icon name="chevR" size={13} color={isResolved?C.success:C.danger}/>
              </button>
            </div>

            {/* Overlapping allocations */}
            <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
              {[cf.allocA,cf.allocB].map((a,i)=>{
                const clr=i===0?clrA:clrB;
                const proj=i===0?projA:projB;
                return (
                  <div key={a.id} style={{flex:1,minWidth:190,padding:"10px 12px",background:"#fff",borderRadius:8,border:`1.5px solid ${clr}44`,borderLeft:`4px solid ${clr}`}}>
                    <div style={{fontSize:12,fontWeight:700,color:clr,marginBottom:4}}>{proj?.short||a.projId}</div>
                    <div style={{fontSize:11.5,color:C.textMid}}>{a.role}</div>
                    <div style={{fontSize:13,fontWeight:700,color:clr,marginTop:4}}>{a.pct}% allocation</div>
                    <div style={{fontSize:11,color:C.textLight,marginTop:3}}>{fmtD(a.start)} – {fmtD(a.end)}</div>
                    <div style={{marginTop:6,height:4,borderRadius:4,background:"#e2e8f0"}}>
                      <div style={{height:4,borderRadius:4,background:clr,width:`${a.pct}%`}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resolution actions */}
            {isOpen && !isResolved && (
              <div className="fade-in" style={{marginTop:14,padding:"14px 16px",background:"#fff",borderRadius:8,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:12,fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:12}}>Resolution Options</div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="resolve-btn" onClick={()=>onResolve(cf.id)}
                    style={{background:C.primaryLight,color:C.primary,borderColor:"rgba(26,86,219,0.25)"}}>
                    <span style={{display:"flex",alignItems:"center",gap:6}}>
                      <Icon name="percent" size={13} color={C.primary}/>
                      Reduce {PROJECTS[cf.allocB.projId]?.short} to {100-cf.allocA.pct}%
                    </span>
                  </button>
                  <button className="resolve-btn" onClick={()=>onResolve(cf.id)}
                    style={{background:C.warningBg,color:C.warning,borderColor:"rgba(245,158,11,0.3)"}}>
                    <span style={{display:"flex",alignItems:"center",gap:6}}>
                      <Icon name="calendar" size={13} color={C.warning}/>
                      Push {PROJECTS[cf.allocA.projId]?.short} end date
                    </span>
                  </button>
                  <button className="resolve-btn" onClick={()=>onResolve(cf.id)}
                    style={{background:C.purpleBg,color:C.purple,borderColor:"rgba(139,92,246,0.25)"}}>
                    <span style={{display:"flex",alignItems:"center",gap:6}}>
                      <Icon name="swap" size={13} color={C.purple}/>
                      Replace with alternate resource
                    </span>
                  </button>
                </div>
              </div>
            )}
            {isResolved && (
              <div style={{marginTop:10,display:"flex",alignItems:"center",gap:6,color:C.success,fontSize:12.5,fontWeight:600}}>
                <Icon name="check" size={14} color={C.success}/>
                Conflict resolved — allocation adjusted
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ─── SIDEBAR ────────────────────────────────────────────────────────── */
const Sidebar = () => (
  <div style={{width:220,background:"#0f172a",position:"fixed",top:0,left:0,height:"100vh",display:"flex",flexDirection:"column",padding:"20px 12px",zIndex:100}}>
    <div style={{padding:"4px 6px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",marginBottom:12}}>
      <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:15.5,color:"#fff",letterSpacing:"-0.3px"}}>IT Services CRM</div>
      <div style={{fontSize:11.5,color:"rgba(255,255,255,0.35)",marginTop:2}}>Resource Allocation</div>
    </div>
    {[
      {icon:"dashboard",label:"Dashboard"},
      {icon:"folder",label:"Projects",active:false},
      {icon:"users",label:"Resources",active:false},
      {icon:"layers",label:"Allocation",active:true},
      {icon:"trending",label:"Timesheets"},
      {icon:"zap",label:"Approvals"},
    ].map(item=>(
      <button key={item.label} className={`nav-item${item.active?" active":""}`}>
        <Icon name={item.icon} size={16} color={item.active?"#fff":"rgba(255,255,255,0.5)"}/>
        {item.label}
      </button>
    ))}
  </div>
);

/* ─── APP ────────────────────────────────────────────────────────────── */
export default function App() {
  const [view,setView]         = useState("board");
  const [selectedRes,setRes]   = useState(null);
  const [resolvedIds,setResolved] = useState(new Set());
  const [allocs]               = useState(ALLOCATIONS_SEED);

  const conflicts = useMemo(()=>detectConflicts(allocs),[allocs]);
  const openConflicts = conflicts.filter(c=>!resolvedIds.has(c.id)).length;

  const handleResolve = (id) => setResolved(prev=>new Set([...prev,id]));

  return (
    <>
      <style>{css}</style>
      <div style={{display:"flex",minHeight:"100vh"}}>
        <Sidebar/>
        <div style={{marginLeft:220,flex:1,background:C.bg,minHeight:"100vh",padding:"28px 30px"}}>

          {/* Page header */}
          <div style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:11.5,color:C.textLight,marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
                <span>Resources</span>
                <Icon name="chevR" size={11} color={C.textLight}/>
                <span style={{color:C.primary,fontWeight:600}}>Allocation Board</span>
              </div>
              <h1 style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:22,color:C.text,letterSpacing:"-0.4px"}}>Resource Allocation</h1>
              <p style={{fontSize:13.5,color:C.textMid,marginTop:3}}>Timeline view · Mar – Aug 2026 · {allocs.length} active allocations across {Object.keys(PROJECTS).length} projects</p>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn-ghost" style={{display:"flex",alignItems:"center",gap:6}}>
                <Icon name="filter" size={14} color={C.textMid}/>
                Export
              </button>
              <button className="btn-primary" style={{display:"flex",alignItems:"center",gap:6}}>
                <Icon name="plus" size={14}/>
                Add Allocation
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <StatCards allocs={allocs} conflicts={conflicts} resources={RESOURCES}/>

          {/* Tabs */}
          <div style={{display:"flex",gap:4,marginBottom:20,padding:"4px",background:C.border,borderRadius:10,width:"fit-content"}}>
            {[
              {key:"board",    label:"Allocation Board",  icon:"layers"},
              {key:"conflicts",label:`Conflict Resolution${openConflicts>0?` (${openConflicts})`:""}`, icon:"alert"},
            ].map(t=>(
              <button key={t.key} className={`tab-btn${view===t.key?" active":""}`}
                onClick={()=>setView(t.key)}
                style={{display:"flex",alignItems:"center",gap:6,borderRadius:7,
                  color:t.key==="conflicts"&&openConflicts>0&&view!==t.key?C.danger:undefined}}>
                <Icon name={t.icon} size={14} color={view===t.key?"#fff":t.key==="conflicts"&&openConflicts>0?C.danger:C.textMid}/>
                {t.label}
              </button>
            ))}
          </div>

          {/* Views */}
          {view==="board" && (
            <AllocationBoard allocs={allocs} onSelectRes={setRes} conflicts={conflicts}/>
          )}
          {view==="conflicts" && (
            <ConflictResolution allocs={allocs} resolvedIds={resolvedIds} onResolve={handleResolve}/>
          )}

          {/* Detail drawer */}
          {selectedRes && (
            <AllocationDetail
              resource={selectedRes}
              allocs={allocs.filter(a=>a.resId===selectedRes.id)}
              onClose={()=>setRes(null)}/>
          )}
        </div>
      </div>
    </>
  );
}
