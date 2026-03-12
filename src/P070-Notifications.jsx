import { useState, useMemo } from "react";

/* ─────────────────── GLOBAL CSS ─────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body,input,select,textarea,button{font-family:'DM Sans','Segoe UI',sans-serif}
::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
.finput{background:#fff;border:1px solid #e2e8f0;color:#1e293b;border-radius:8px;padding:9px 12px;font-size:13px;outline:none;transition:border .15s,box-shadow .15s;width:100%}
.finput:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}.finput::placeholder{color:#94a3b8}
.btn-primary{background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(99,102,241,.3)}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.4)}
.btn-ghost{background:#fff;border:1px solid #e2e8f0;color:#64748b;border-radius:9px;padding:9px 16px;font-size:13px;cursor:pointer;transition:all .15s}
.btn-ghost:hover{background:#f8fafc;color:#1e293b;border-color:#cbd5e1}
.section-title{font-family:'Sora',sans-serif;font-size:11px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #f1f5f9}
.toast{position:fixed;bottom:24px;right:24px;background:#10b981;color:#fff;padding:11px 18px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 8px 24px rgba(16,185,129,.3);z-index:9999;animation:slideup .3s ease}
@keyframes slideup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.drawer-panel{position:fixed;right:0;top:0;bottom:0;width:420px;background:#fff;border-left:1px solid #e2e8f0;z-index:400;display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.1);animation:slideInR .2s ease;overflow:hidden}
.drawer-backdrop{position:fixed;inset:0;z-index:399;background:rgba(15,23,42,.18)}
@keyframes slideInR{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
.notif-row{display:flex;gap:14px;align-items:flex-start;padding:14px 20px;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background .12s;position:relative}
.notif-row:hover{background:#f8faff}
.notif-row.unread{background:#fafbff}
.notif-row.unread::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#6366f1;border-radius:0 2px 2px 0}
.notif-row.selected{background:#f0f4ff;outline:2px solid #c7d2fe;outline-offset:-2px}
.tab-btn{padding:7px 14px;border-radius:8px;border:none;background:transparent;color:#64748b;font-size:13px;font-weight:500;cursor:pointer;transition:all .12s;white-space:nowrap;display:flex;align-items:center;gap:6px}
.tab-btn.active{background:#eef2ff;color:#4f46e5;font-weight:700}
.tab-btn:hover:not(.active){background:#f8fafc;color:#1e293b}
.pref-toggle{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f8fafc}
.toggle-track{width:36px;height:20px;border-radius:10px;cursor:pointer;transition:background .2s;flex-shrink:0;position:relative}
.toggle-thumb{width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:2px;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.stat-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px 22px;flex:1;min-width:148px;box-shadow:0 1px 4px rgba(0,0,0,.05);transition:all .2s}
.stat-card:hover{border-color:#c7d2fe;box-shadow:0 4px 16px rgba(99,102,241,.1)}
`;

/* ─────────────────── SEED DATA ─────────────────── */
const NOW = new Date("2026-03-12T10:30:00");

function minsAgo(m){ const d=new Date(NOW); d.setMinutes(d.getMinutes()-m); return d.toISOString(); }
function hoursAgo(h){ const d=new Date(NOW); d.setHours(d.getHours()-h); return d.toISOString(); }
function daysAgo(n){ const d=new Date(NOW); d.setDate(d.getDate()-n); return d.toISOString(); }

const SEED_NOTIFS = [
  { id:"N-001", type:"approval", category:"Timesheet", title:"Timesheet Pending Your Approval", body:"Rachel Kim has submitted her timesheet for Week 10 (Mar 3–7, 2026) totalling 42 hrs. Billable: 38 hrs / Non-billable: 4 hrs. Linked to Nexus Digital Transformation.", module:"Timesheet", actor:"Rachel Kim", ref:"TS-2026-0310", refLink:"#", timestamp:minsAgo(18), read:false, priority:"high", actions:["Approve","Reject","View Details"] },
  { id:"N-002", type:"approval", category:"SOW", title:"SOW Awaiting Final Approval", body:"SOW-2026-048 (Meridian Predictive Analytics Engine) has been submitted for approval and is now awaiting your sign-off. Value: $175,000. Owner: Sam Keller.", module:"SOW", actor:"Sam Keller", ref:"SOW-2026-048", refLink:"#", timestamp:minsAgo(45), read:false, priority:"high", actions:["Approve","Reject","View SOW"] },
  { id:"N-003", type:"alert", category:"SOW Expiry", title:"SOW Expiring in 14 Days", body:"SOW-2026-041 (Nexus Digital Transformation) is set to expire on 26 Mar 2026. Client: Nexus Corp. Delivery Head: Rachel Kim. Consider initiating renewal or amendment.", module:"SOW", actor:"System", ref:"SOW-2026-041", refLink:"#", timestamp:hoursAgo(1), read:false, priority:"high", actions:["View SOW","Start Renewal"] },
  { id:"N-004", type:"reminder", category:"Timesheet", title:"Timesheet Submission Reminder", body:"Your timesheet for Week 10 (Mar 3–7, 2026) has not yet been submitted. Deadline is today at 5:00 PM. Please submit to avoid payroll delays.", module:"Timesheet", actor:"System", ref:"", refLink:"#", timestamp:hoursAgo(2), read:false, priority:"medium", actions:["Submit Timesheet"] },
  { id:"N-005", type:"alert", category:"Budget", title:"Project Budget Overrun Alert", body:"BlueStar Mobile Commerce (PRJ-003) has exceeded 90% of its budget. Spent: $198,400 of $220,000 allocated. Remaining: $21,600. Review spend breakdown before next milestone.", module:"Projects", actor:"System", ref:"PRJ-003", refLink:"#", timestamp:hoursAgo(3), read:false, priority:"high", actions:["View Project","Review Budget"] },
  { id:"N-006", type:"approval", category:"Invoice", title:"Invoice Request Pending Approval", body:"INV-REQ-2026-022 for Orion Financial has been raised by Dana Mercer. Amount: $34,000. SOW: SOW-2026-044. Requires your approval before dispatch.", module:"Invoice", actor:"Dana Mercer", ref:"INV-REQ-2026-022", refLink:"#", timestamp:hoursAgo(5), read:true, priority:"high", actions:["Approve","Reject","View Invoice"] },
  { id:"N-007", type:"info", category:"Resource", title:"Resource Allocation Updated", body:"Theo Vasquez's allocation on BlueStar Mobile Commerce has been updated from 70% to 78%. Updated by Rachel Kim. Effective from 1 Mar 2026.", module:"Resources", actor:"Rachel Kim", ref:"USR-006", refLink:"#", timestamp:hoursAgo(7), read:true, priority:"low", actions:["View Profile"] },
  { id:"N-008", type:"alert", category:"Contract", title:"Contractor Contract Expiring in 30 Days", body:"Maya Patel (DevOps Engineer) contract ends on 30 Apr 2026 — 49 days remaining. Consider initiating renewal or sourcing a replacement to avoid resource gap.", module:"HR", actor:"System", ref:"USR-007", refLink:"#", timestamp:hoursAgo(10), read:true, priority:"medium", actions:["View Profile","Initiate Renewal"] },
  { id:"N-009", type:"system", category:"User", title:"New User Account Created", body:"Felix Hsu (Full Stack Engineer) has been added to the platform by Admin. Employee ID: EMP-1012. Department: Engineering. Access role: Member.", module:"User Mgmt", actor:"Admin", ref:"USR-012", refLink:"#", timestamp:daysAgo(1), read:true, priority:"low", actions:["View User"] },
  { id:"N-010", type:"reminder", category:"SOW", title:"SOW Review Due Tomorrow", body:"SOW-2026-046 (Summit Energy Cloud Lift) is currently Under Review. The SLA for review turnaround expires tomorrow (13 Mar 2026). Pending sign-off: Theo Vasquez.", module:"SOW", actor:"System", ref:"SOW-2026-046", refLink:"#", timestamp:daysAgo(1), read:true, priority:"medium", actions:["View SOW"] },
  { id:"N-011", type:"approval", category:"Timesheet", title:"Timesheet Rejected — Action Required", body:"Your timesheet for Week 9 (Feb 24 – Feb 28, 2026) was rejected by Rachel Kim. Reason: Missing project codes for 6 hrs on Tuesday. Please revise and resubmit.", module:"Timesheet", actor:"Rachel Kim", ref:"TS-2026-0228", refLink:"#", timestamp:daysAgo(2), read:true, priority:"high", actions:["Revise Timesheet"] },
  { id:"N-012", type:"info", category:"Project", title:"New Milestone Marked Complete", body:"Milestone 'Discovery & Requirements Sign-off' on Nexus Digital Transformation (PRJ-001) has been completed. Marked by Rachel Kim on 10 Mar 2026.", module:"Projects", actor:"Rachel Kim", ref:"PRJ-001", refLink:"#", timestamp:daysAgo(2), read:true, priority:"low", actions:["View Project"] },
  { id:"N-013", type:"system", category:"Audit", title:"Role Permission Updated", body:"The 'Manager' role permissions were updated by Admin: 'Invoice Approval' privilege was granted. Change recorded in audit trail.", module:"Role & Permission", actor:"Admin", ref:"ROLE-MGR", refLink:"#", timestamp:daysAgo(3), read:true, priority:"low", actions:["View Audit Trail"] },
  { id:"N-014", type:"alert", category:"Resource", title:"Resource Over-Allocated", body:"James Okafor (Security Engineer) is currently allocated at 95% across PRJ-011 and PRJ-001. Total billable load may be unsustainable. Review allocations.", module:"Resources", actor:"System", ref:"USR-008", refLink:"#", timestamp:daysAgo(3), read:true, priority:"medium", actions:["View Allocations"] },
  { id:"N-015", type:"info", category:"Sales", title:"Requirement Moved to Approved", body:"SR-0049 (Customer Portal Redesign) for BlueStar Retail has been moved to Approved status by Dana Mercer. SOW drafting can now proceed.", module:"Sales Requirements", actor:"Dana Mercer", ref:"SR-0049", refLink:"#", timestamp:daysAgo(4), read:true, priority:"low", actions:["View Requirement"] },
];

const TYPE_META = {
  approval: { label:"Approval", icon:"✓", color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe" },
  alert:    { label:"Alert",    icon:"⚠", color:"#dc2626", bg:"#fef2f2", border:"#fecaca" },
  reminder: { label:"Reminder", icon:"◷", color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  system:   { label:"System",   icon:"⚙", color:"#475569", bg:"#f8fafc", border:"#e2e8f0" },
  info:     { label:"Info",     icon:"ℹ", color:"#0ea5e9", bg:"#f0f9ff", border:"#bae6fd" },
};

const MODULE_COLORS = {
  "Timesheet":"#7c3aed","SOW":"#0ea5e9","Projects":"#10b981","Invoice":"#f59e0b",
  "Resources":"#6366f1","HR":"#ec4899","User Mgmt":"#475569","Role & Permission":"#64748b",
  "Sales Requirements":"#8b5cf6",
};

const PREF_DEFAULTS = {
  approval_email:true, approval_inapp:true, approval_push:true,
  alert_email:true, alert_inapp:true, alert_push:true,
  reminder_email:true, reminder_inapp:true, reminder_push:false,
  system_email:false, system_inapp:true, system_push:false,
  info_email:false, info_inapp:true, info_push:false,
};

/* ─────────────────── HELPERS ─────────────────── */
function fmtRelative(iso){
  const diff = (NOW - new Date(iso))/1000;
  if(diff < 60) return "Just now";
  if(diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if(diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  if(diff < 172800) return "Yesterday";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

function fmtFull(iso){
  return new Date(iso).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"});
}

function initials(name){
  return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
}

const AVATAR_COLORS = ["#4f46e5","#7c3aed","#0ea5e9","#10b981","#f59e0b","#ec4899","#dc2626"];
function avatarColor(name){ return AVATAR_COLORS[name.charCodeAt(0)%AVATAR_COLORS.length]; }

/* ─────────────────── SHELL ─────────────────── */
function Shell({children,tab,setTab}){
  return(
    <div style={{minHeight:"100vh",background:"#f4f6fb",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1e293b"}}>
      <style>{GLOBAL_CSS}</style>
      <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"0 28px",height:48,display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#94a3b8",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
        <span style={{color:"#6366f1",fontWeight:700,fontSize:13}}>NexusOps</span>
        <span style={{color:"#e2e8f0"}}>/</span>
        <span style={{color:"#1e293b",fontWeight:600}}>Notifications</span>
        <div style={{marginLeft:"auto",display:"flex",gap:4}}>
          {["Inbox","Preferences"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 14px",borderRadius:7,border:"none",background:tab===t?"#eef2ff":"transparent",color:tab===t?"#4f46e5":"#94a3b8",fontSize:12,fontWeight:tab===t?700:500,cursor:"pointer",transition:"all .15s"}}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"28px 32px",maxWidth:1300,margin:"0 auto"}}>{children}</div>
    </div>
  );
}

/* ─────────────────── NOTIFICATION ROW ─────────────────── */
function NotifRow({n, selected, onSelect, onToggleRead, onDismiss, onView}){
  const tm = TYPE_META[n.type];
  const isSystem = n.actor === "System";
  return(
    <div className={`notif-row${!n.read?" unread":""}${selected?" selected":""}`} onClick={()=>onView(n)}>
      {/* Select checkbox */}
      <div onClick={e=>{e.stopPropagation();onSelect(n.id);}} style={{paddingTop:2,flexShrink:0}}>
        <div style={{width:16,height:16,borderRadius:4,border:`2px solid ${selected?"#6366f1":"#cbd5e1"}`,background:selected?"#6366f1":"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .12s"}}>
          {selected&&<span style={{color:"#fff",fontSize:9,fontWeight:800}}>✓</span>}
        </div>
      </div>

      {/* Avatar / icon */}
      <div style={{flexShrink:0,paddingTop:2}}>
        {isSystem
          ? <div style={{width:36,height:36,borderRadius:10,background:tm.bg,border:`1px solid ${tm.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:tm.color}}>{tm.icon}</div>
          : <div style={{width:36,height:36,borderRadius:"50%",background:avatarColor(n.actor),display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>{initials(n.actor)}</div>
        }
      </div>

      {/* Content */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
          {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:"#6366f1",flexShrink:0}}/>}
          <span style={{fontSize:13.5,fontWeight:n.read?500:700,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:480}}>{n.title}</span>
          <span style={{fontSize:10.5,fontWeight:600,color:tm.color,background:tm.bg,border:`1px solid ${tm.border}`,borderRadius:20,padding:"1px 8px",flexShrink:0,marginLeft:"auto"}}>{tm.label}</span>
        </div>
        <div style={{fontSize:12.5,color:"#64748b",lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:560,marginBottom:6}}>{n.body}</div>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:11,fontWeight:600,color:MODULE_COLORS[n.module]||"#64748b",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:4,padding:"1px 7px"}}>{n.module}</span>
          {n.ref&&<span style={{fontSize:11,color:"#94a3b8",background:"#f1f5f9",borderRadius:4,padding:"1px 7px"}}>{n.ref}</span>}
          <span style={{fontSize:11,color:"#94a3b8",marginLeft:4}}>{fmtRelative(n.timestamp)}</span>
          <div style={{marginLeft:"auto",display:"flex",gap:4,opacity:0}} className="notif-actions">
            <button onClick={e=>{e.stopPropagation();onToggleRead(n.id);}} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"3px 9px",fontSize:11,cursor:"pointer",color:"#64748b"}}>{n.read?"Mark Unread":"Mark Read"}</button>
            <button onClick={e=>{e.stopPropagation();onDismiss(n.id);}} style={{background:"#fff5f5",border:"1px solid #fecaca",borderRadius:6,padding:"3px 9px",fontSize:11,cursor:"pointer",color:"#dc2626"}}>Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── DETAIL DRAWER ─────────────────── */
function NotifDrawer({n, onClose, onToggleRead, onDismiss}){
  const tm = TYPE_META[n.type];
  const isSystem = n.actor==="System";
  return(
    <>
      <div className="drawer-backdrop" onClick={onClose}/>
      <div className="drawer-panel">
        {/* Header */}
        <div style={{padding:"16px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:12,flexShrink:0,background:"#fafbff"}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:700,color:tm.color,background:tm.bg,border:`1px solid ${tm.border}`,borderRadius:20,padding:"2px 10px"}}>{tm.label}</span>
              <span style={{fontSize:11,fontWeight:600,color:MODULE_COLORS[n.module]||"#64748b",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:4,padding:"2px 8px"}}>{n.module}</span>
            </div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:"#0f172a",lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.title}</div>
          </div>
          <button className="btn-ghost" style={{padding:"5px 10px",fontSize:14,lineHeight:1,flexShrink:0}} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
          {/* Actor + time */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"12px 14px",background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0"}}>
            {isSystem
              ? <div style={{width:34,height:34,borderRadius:8,background:tm.bg,border:`1px solid ${tm.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:tm.color,flexShrink:0}}>{tm.icon}</div>
              : <div style={{width:34,height:34,borderRadius:"50%",background:avatarColor(n.actor),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>{initials(n.actor)}</div>
            }
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{isSystem?"Automated System Notification":n.actor}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{fmtFull(n.timestamp)}</div>
            </div>
            {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"#6366f1",flexShrink:0}}/>}
          </div>

          {/* Message body */}
          <div style={{fontSize:13.5,color:"#374151",lineHeight:1.75,marginBottom:20,padding:"16px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:10}}>{n.body}</div>

          {/* Reference */}
          {n.ref&&(
            <div style={{marginBottom:20,padding:"11px 14px",background:"#f0f4ff",borderRadius:10,border:"1px solid #c7d2fe",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,color:"#4f46e5",textTransform:"uppercase",letterSpacing:.5}}>Reference</span>
              <span style={{fontSize:13,fontWeight:700,color:"#0f172a",flex:1}}>{n.ref}</span>
              <button style={{background:"#fff",border:"1px solid #c7d2fe",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:600,color:"#4f46e5",cursor:"pointer"}}>Open ↗</button>
            </div>
          )}

          {/* Priority */}
          <div style={{marginBottom:20}}>
            <div className="section-title">Priority</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {["low","medium","high"].map(p=>{
                const [c,bg]= p==="high"?["#dc2626","#fef2f2"]:p==="medium"?["#d97706","#fffbeb"]:["#64748b","#f8fafc"];
                return <span key={p} style={{padding:"4px 14px",borderRadius:20,fontSize:12,fontWeight:600,color:n.priority===p?c:"#94a3b8",background:n.priority===p?bg:"transparent",border:`1px solid ${n.priority===p?"currentColor":"#e2e8f0"}`}}>{p.charAt(0).toUpperCase()+p.slice(1)}</span>;
              })}
            </div>
          </div>

          {/* Actions */}
          {n.actions?.length>0&&(
            <div style={{marginBottom:20}}>
              <div className="section-title">Quick Actions</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {n.actions.map((a,i)=>{
                  const isPrimary=i===0;
                  const isDanger=a.toLowerCase().includes("reject");
                  const bg=isDanger?"#fef2f2":isPrimary?"linear-gradient(135deg,#4f46e5,#6366f1)":"#fff";
                  const color=isDanger?"#dc2626":isPrimary?"#fff":"#374151";
                  const border=isDanger?"1px solid #fecaca":isPrimary?"none":"1px solid #e2e8f0";
                  return(
                    <button key={a} style={{padding:"10px 16px",borderRadius:9,border,background:bg,color,fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",boxShadow:isPrimary?"0 4px 14px rgba(99,102,241,.3)":"none",transition:"all .15s"}}>{a}</button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{padding:"12px 20px",borderTop:"1px solid #e2e8f0",display:"flex",gap:8,flexShrink:0,background:"#fafbff"}}>
          <button className="btn-ghost" style={{flex:1,fontSize:12}} onClick={()=>onToggleRead(n.id)}>{n.read?"Mark as Unread":"Mark as Read"}</button>
          <button onClick={()=>{onDismiss(n.id);onClose();}} style={{flex:1,background:"#fff5f5",border:"1px solid #fecaca",borderRadius:9,padding:"9px 14px",fontSize:12,fontWeight:600,cursor:"pointer",color:"#dc2626"}}>Dismiss</button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────── PREFERENCES PAGE ─────────────────── */
function PreferencesPage(){
  const [prefs,setPrefs]=useState(PREF_DEFAULTS);
  const [toast,setToast]=useState("");
  const toggle=(k)=>setPrefs(p=>({...p,[k]:!p[k]}));
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2500);};

  function Toggle({k}){
    const on=prefs[k];
    return(
      <div className="toggle-track" style={{background:on?"#6366f1":"#cbd5e1"}} onClick={()=>toggle(k)}>
        <div className="toggle-thumb" style={{left:on?18:2}}/>
      </div>
    );
  }

  const sections=[
    { type:"approval", title:"Approval Notifications", desc:"SOW approvals, timesheet approvals, invoice requests" },
    { type:"alert", title:"Alert Notifications", desc:"Budget overruns, SOW expiry, over-allocation, health alerts" },
    { type:"reminder", title:"Reminder Notifications", desc:"Timesheet deadlines, contract renewals, SOW reviews" },
    { type:"system", title:"System Notifications", desc:"User management, role changes, audit events" },
    { type:"info", title:"Informational Updates", desc:"Status changes, milestone completions, resource updates" },
  ];

  return(
    <div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <div style={{width:8,height:32,borderRadius:4,background:"linear-gradient(180deg,#4f46e5,#818cf8)"}}/>
            <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:24,fontWeight:700,color:"#0f172a",letterSpacing:-.5}}>Notification Preferences</h1>
          </div>
          <p style={{fontSize:13.5,color:"#64748b",marginLeft:18}}>Control how and when you receive notifications across each channel.</p>
        </div>
        <button className="btn-primary" onClick={()=>showToast("Preferences saved")}>Save Preferences</button>
      </div>

      {/* Channel legend */}
      <div style={{display:"flex",gap:12,marginBottom:24,padding:"14px 20px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,alignItems:"center"}}>
        <span style={{fontSize:12.5,fontWeight:600,color:"#64748b",marginRight:8}}>Channels:</span>
        {[{icon:"✉",label:"Email",color:"#0ea5e9"},{icon:"🔔",label:"In-App",color:"#6366f1"},{icon:"📱",label:"Push",color:"#10b981"}].map(c=>(
          <span key={c.label} style={{display:"flex",alignItems:"center",gap:5,fontSize:12.5,color:c.color,fontWeight:600,background:`${c.color}12`,border:`1px solid ${c.color}30`,borderRadius:20,padding:"3px 12px"}}>{c.icon} {c.label}</span>
        ))}
        <span style={{fontSize:12,color:"#94a3b8",marginLeft:4}}>— Toggle each channel on or off per notification type.</span>
      </div>

      <div style={{display:"grid",gap:14}}>
        {sections.map(s=>{
          const tm=TYPE_META[s.type];
          return(
            <div key={s.type} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"20px 24px",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                <div style={{width:32,height:32,borderRadius:8,background:tm.bg,border:`1px solid ${tm.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:tm.color}}>{tm.icon}</div>
                <div>
                  <div style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:"#0f172a"}}>{s.title}</div>
                  <div style={{fontSize:12,color:"#94a3b8",marginTop:1}}>{s.desc}</div>
                </div>
              </div>
              <div style={{borderTop:"1px solid #f1f5f9",marginTop:14,paddingTop:4}}>
                {[{key:"email",icon:"✉",label:"Email Notifications",sub:"Sent to your registered email address"},{key:"inapp",icon:"🔔",label:"In-App Notifications",sub:"Shown in the notifications inbox"},{key:"push",icon:"📱",label:"Push Notifications",sub:"Sent to your mobile or desktop browser"}].map(ch=>(
                  <div key={ch.key} className="pref-toggle">
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:16,width:22,textAlign:"center"}}>{ch.icon}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:"#374151"}}>{ch.label}</div>
                        <div style={{fontSize:11.5,color:"#94a3b8"}}>{ch.sub}</div>
                      </div>
                    </div>
                    <Toggle k={`${s.type}_${ch.key}`}/>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {toast&&<div className="toast">✓ {toast}</div>}
    </div>
  );
}

/* ─────────────────── INBOX PAGE ─────────────────── */
function InboxPage(){
  const [notifs, setNotifs] = useState(SEED_NOTIFS);
  const [activeTab, setActiveTab]   = useState("All");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState(new Set());
  const [detail, setDetail]         = useState(null);
  const [toast, setToast]           = useState("");
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2500);};

  const TABS=[
    {k:"All",    label:"All"},
    {k:"Unread", label:"Unread"},
    {k:"approval",label:"Approvals"},
    {k:"alert",  label:"Alerts"},
    {k:"reminder",label:"Reminders"},
    {k:"system", label:"System"},
    {k:"info",   label:"Info"},
  ];

  const unreadCount = notifs.filter(n=>!n.read).length;
  const approvalCount = notifs.filter(n=>n.type==="approval"&&!n.read).length;
  const alertCount = notifs.filter(n=>n.type==="alert"&&!n.read).length;
  const todayCount = notifs.filter(n=>{const d=new Date(n.timestamp);return d.toDateString()===NOW.toDateString();}).length;

  const filtered = useMemo(()=>{
    return notifs.filter(n=>{
      const q=search.toLowerCase();
      const mQ=!q||(n.title+n.body+n.module+n.actor+n.ref).toLowerCase().includes(q);
      const mT=activeTab==="All"||(activeTab==="Unread"?!n.read:n.type===activeTab);
      return mQ&&mT;
    });
  },[notifs,activeTab,search]);

  // Group by date bucket
  const groups = useMemo(()=>{
    const today=[], yesterday=[], older=[];
    filtered.forEach(n=>{
      const d=new Date(n.timestamp);
      if(d.toDateString()===NOW.toDateString()) today.push(n);
      else if(d.toDateString()===new Date(daysAgo(1)).toDateString()) yesterday.push(n);
      else older.push(n);
    });
    const out=[];
    if(today.length)    out.push({label:"Today",items:today});
    if(yesterday.length)out.push({label:"Yesterday",items:yesterday});
    if(older.length)    out.push({label:"Earlier",items:older});
    return out;
  },[filtered]);

  function toggleSelect(id){ setSelected(prev=>{ const s=new Set(prev); s.has(id)?s.delete(id):s.add(id); return s; }); }
  function selectAll(){ setSelected(new Set(filtered.map(n=>n.id))); }
  function clearSelect(){ setSelected(new Set()); }

  function toggleRead(id){
    setNotifs(p=>p.map(n=>n.id===id?{...n,read:!n.read}:n));
    if(detail?.id===id) setDetail(p=>({...p,read:!p.read}));
  }
  function markAllRead(){
    setNotifs(p=>p.map(n=>({...n,read:true})));
    showToast("All notifications marked as read");
  }
  function dismiss(id){
    setNotifs(p=>p.filter(n=>n.id!==id));
    if(detail?.id===id) setDetail(null);
    showToast("Notification dismissed");
  }
  function dismissSelected(){
    const ids=selected;
    setNotifs(p=>p.filter(n=>!ids.has(n.id)));
    setSelected(new Set());
    showToast(`${ids.size} notification${ids.size>1?"s":""} dismissed`);
  }
  function markSelectedRead(){
    setNotifs(p=>p.map(n=>selected.has(n.id)?{...n,read:true}:n));
    setSelected(new Set());
    showToast(`${selected.size} marked as read`);
  }

  const tabCount=(k)=>{
    if(k==="All") return notifs.length;
    if(k==="Unread") return notifs.filter(n=>!n.read).length;
    return notifs.filter(n=>n.type===k&&!n.read).length||null;
  };

  return(
    <>
      {/* Stat cards */}
      <div style={{display:"flex",gap:14,marginBottom:24,flexWrap:"wrap"}}>
        {[
          {l:"Unread",v:unreadCount,s:"Notifications",a:"#6366f1"},
          {l:"Pending Approvals",v:approvalCount,s:"Require action",a:"#7c3aed"},
          {l:"Active Alerts",v:alertCount,s:"Require attention",a:"#dc2626"},
          {l:"Today",v:todayCount,s:"New this session",a:"#0ea5e9"},
        ].map((c,i)=>(
          <div key={i} className="stat-card" style={{borderLeft:`3px solid ${c.a}`}}>
            <div style={{fontSize:24,fontWeight:800,color:c.a,fontFamily:"'Sora',sans-serif"}}>{c.v}</div>
            <div style={{fontSize:13,fontWeight:600,color:"#1e293b",marginTop:2}}>{c.l}</div>
            <div style={{fontSize:11.5,color:"#94a3b8",marginTop:1}}>{c.s}</div>
          </div>
        ))}
      </div>

      {/* Main card */}
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,boxShadow:"0 2px 8px rgba(0,0,0,.05)",overflow:"hidden"}}>
        {/* Toolbar */}
        <div style={{padding:"14px 20px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",background:"#fafbff"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:200}}>
            <input className="finput" placeholder="Search notifications…" value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:280,height:36,padding:"0 12px"}}/>
          </div>
          {selected.size>0
            ? <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <span style={{fontSize:12,color:"#64748b",fontWeight:600}}>{selected.size} selected</span>
                <button onClick={markSelectedRead} className="btn-ghost" style={{padding:"6px 12px",fontSize:12}}>Mark Read</button>
                <button onClick={dismissSelected} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer",color:"#dc2626"}}>Dismiss</button>
                <button onClick={clearSelect} className="btn-ghost" style={{padding:"6px 12px",fontSize:12}}>✕ Clear</button>
              </div>
            : <div style={{display:"flex",gap:8}}>
                <button onClick={selectAll} className="btn-ghost" style={{padding:"6px 12px",fontSize:12}}>Select All</button>
                <button onClick={markAllRead} className="btn-ghost" style={{padding:"6px 12px",fontSize:12}}>✓ Mark All Read</button>
              </div>
          }
        </div>

        {/* Tabs */}
        <div style={{padding:"8px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",gap:2,flexWrap:"wrap",overflowX:"auto"}}>
          {TABS.map(t=>{
            const cnt=tabCount(t.k);
            return(
              <button key={t.k} className={`tab-btn${activeTab===t.k?" active":""}`} onClick={()=>setActiveTab(t.k)}>
                {t.label}
                {cnt>0&&<span style={{background:activeTab===t.k?"#6366f1":"#e2e8f0",color:activeTab===t.k?"#fff":"#64748b",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700,minWidth:18,textAlign:"center"}}>{cnt}</span>}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div style={{minHeight:200}}>
          {groups.length===0
            ? <div style={{padding:"60px 20px",textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:12}}>🔔</div>
                <div style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:"#1e293b",marginBottom:6}}>No notifications</div>
                <div style={{fontSize:13,color:"#94a3b8"}}>You're all caught up. Check back later.</div>
              </div>
            : groups.map(g=>(
                <div key={g.label}>
                  <div style={{padding:"8px 20px 4px",fontSize:10.5,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,background:"#f8fafc",borderBottom:"1px solid #f1f5f9"}}>{g.label} · {g.items.length}</div>
                  {g.items.map(n=>(
                    <NotifRow key={n.id} n={n} selected={selected.has(n.id)} onSelect={toggleSelect} onToggleRead={toggleRead} onDismiss={dismiss} onView={(n)=>{setDetail(n);if(!n.read)toggleRead(n.id);}}/>
                  ))}
                </div>
              ))
          }
        </div>

        {/* Footer */}
        <div style={{padding:"10px 20px",borderTop:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafbff"}}>
          <span style={{fontSize:12,color:"#94a3b8"}}>Showing {filtered.length} of {notifs.length} notifications</span>
          <button className="btn-ghost" style={{fontSize:11.5,padding:"5px 12px"}}>Load older notifications</button>
        </div>
      </div>

      {detail&&<NotifDrawer n={detail} onClose={()=>setDetail(null)} onToggleRead={toggleRead} onDismiss={dismiss}/>}
      {toast&&<div className="toast">✓ {toast}</div>}

      {/* Inline hover style injection */}
      <style>{`.notif-row:hover .notif-actions{opacity:1!important}`}</style>
    </>
  );
}

/* ─────────────────── APP ─────────────────── */
export default function App(){
  const [tab,setTab]=useState("Inbox");
  return(
    <Shell tab={tab} setTab={setTab}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24}}>
        {tab==="Inbox"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <div style={{width:8,height:32,borderRadius:4,background:"linear-gradient(180deg,#4f46e5,#818cf8)"}}/>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:24,fontWeight:700,color:"#0f172a",letterSpacing:-.5}}>Notifications</h1>
            </div>
            <p style={{fontSize:13.5,color:"#64748b",marginLeft:18}}>Your activity feed — approvals, alerts, reminders, and system events.</p>
          </div>
        )}
      </div>
      {tab==="Inbox" ? <InboxPage/> : <PreferencesPage/>}
    </Shell>
  );
}
