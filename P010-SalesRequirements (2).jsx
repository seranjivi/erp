import { useState, useMemo } from "react";

/* ─────────────────── SALES TYPE CONFIG ─────────────────── */
const SALES_TYPES = [
  { value: "Contract Staffing", icon: "👥", color: "#8b5cf6", desc: "Resource augmentation & talent placement" },
  { value: "IT Services",       icon: "⚙️", color: "#2563eb", desc: "Technology implementation & integration" },
  { value: "Digital Services",  icon: "✦",  color: "#0891b2", desc: "UX, web, mobile & digital transformation" },
  { value: "Data & Analytics",  icon: "◈",  color: "#059669", desc: "BI, analytics, ML & data engineering" },
  { value: "Managed Services",  icon: "🛡",  color: "#d97706", desc: "Ongoing operations & support contracts" },
  { value: "Cloud Services",    icon: "☁",  color: "#4f46e5", desc: "Cloud migration, infra & DevOps" },
];

const SALES_TYPE_META = Object.fromEntries(SALES_TYPES.map(t => [t.value, t]));

/* type-specific field defaults */
const TYPE_DEFAULTS = {
  "Contract Staffing": { skills: [], roles: [{ role: "", count: 1 }], workModel: "Hybrid", contractType: "T&M", minExperience: "", clearanceLevel: "None" },
  "IT Services":       { techStack: [], solutionType: "Implementation", deploymentModel: "Cloud", cloudProvider: "AWS", slaTier: "Standard", securityClassification: "Internal" },
  "Digital Services":  { serviceScope: [], platform: "Web", designSystem: "Existing", accessibilityStandard: "WCAG 2.1 AA", supportedDevices: [], cmsFramework: "" },
  "Data & Analytics":  { dataSources: [], analyticsType: "Predictive", dataVolume: "1–100 GB", dataResidency: "Regional", privacyCompliance: [], analyticsTools: [] },
  "Managed Services":  { serviceScope: [], slaTier: "Gold", supportCoverage: "24x7", escalationTiers: "3", monitoringTools: [], contractDuration: "Annual" },
  "Cloud Services":    { cloudProvider: "AWS", migrationType: "Re-platform", infraScope: [], devOpsToolchain: [], complianceFramework: [] },
};

/* ─────────────────── TAG POOLS ─────────────────── */
const TAG_POOLS = {
  skills:             ["API Design","CRM","Enterprise Architecture","Data Visualization","React","SQL","React Native","UX Design","iOS","Android","AWS","DevOps","Compliance","ETL","Data Modeling","SAML","OAuth 2.0","ML","Python","Data Science","Azure","Accessibility","OCR","Automation","Finance","REST API","ERP Integration","i18n","Backend","Node.js","IAM","Security","BI","D3.js","QA","Scrum","Project Management","Change Management"],
  techStack:          ["React","Angular","Vue","Node.js","Java","Python",".NET","Go","Kubernetes","Docker","Kafka","Redis","PostgreSQL","MongoDB","Elasticsearch","Terraform","Ansible","Jenkins","GitHub Actions","Azure DevOps"],
  serviceScope_dig:   ["UX Research","UI Design","Prototyping","Branding","Design System","Web Development","Mobile App","Progressive Web App","E-commerce","CMS Development","SEO","Accessibility Audit","Performance Optimization"],
  dataSources:        ["CRM","ERP","Data Warehouse","Data Lake","Streaming (Kafka)","Flat Files","REST API","Third-party SaaS","IoT Sensors","Social Media","Databases (SQL)","Databases (NoSQL)"],
  analyticsTools:     ["Power BI","Tableau","Looker","Databricks","Snowflake","dbt","Apache Spark","Azure Synapse","AWS Redshift","Google BigQuery","Jupyter","MLflow"],
  serviceScope_mgd:   ["Application Support","Infrastructure Monitoring","Security Operations","Database Administration","Cloud Operations","Helpdesk L1/L2","Patch Management","Incident Management","Backup & DR","Performance Tuning"],
  infraScope:         ["Virtual Machines","Containers (Docker/K8s)","Serverless Functions","Object Storage","Relational Database","NoSQL Database","CDN","Load Balancer","VPN/Networking","IAM","Secret Management"],
  devOpsToolchain:    ["Terraform","Ansible","GitHub Actions","GitLab CI","Jenkins","ArgoCD","Helm","Prometheus","Grafana","Datadog","PagerDuty","Vault"],
  complianceFramework:["SOC 2 Type II","ISO 27001","PCI-DSS","HIPAA","GDPR","FedRAMP","NIST 800-53","CIS Benchmark"],
  privacyCompliance:  ["GDPR","HIPAA","SOC 2 Type II","ISO 27001","PCI-DSS","PDPA","CCPA","None"],
  supportedDevices:   ["iOS","Android","Desktop Chrome","Desktop Safari","Desktop Firefox","Edge","Tablet","Smart TV","Kiosk"],
};

/* ─────────────────── DATA ─────────────────── */
const INITIAL_REQUIREMENTS = [
  { id:"SR-0041", salesType:"IT Services",       title:"CRM Integration for Enterprise Tier",  client:"Nexus Corp",        engagementName:"Nexus Digital Transformation", category:"Integration", priority:"Critical", status:"In Review",   owner:"Dana Mercer",  deliveryHead:"Rachel Kim", created:"2026-01-08", due:"2026-03-20", startDate:"2026-02-01", value:142000, budget:150000, source:"RFP",     type:"External", destination:"North America", sow:"SOW-2026-041", notes:"Client requires Salesforce connector by Q1. Executive sponsor: James Whitfield.", description:"Full bidirectional CRM sync for enterprise tier clients including contact, deal, and activity data.", typeData:{ techStack:["API Design","CRM","Enterprise Architecture"], solutionType:"Integration", deploymentModel:"Cloud", cloudProvider:"AWS", slaTier:"Enterprise", securityClassification:"Confidential" } },
  { id:"SR-0042", salesType:"Data & Analytics",  title:"Custom Reporting Dashboard",           client:"Meridian Holdings", engagementName:"Meridian Analytics Suite",    category:"Product",     priority:"High",     status:"Approved",    owner:"Lian Zhou",    deliveryHead:"Tom Ashby",   created:"2026-01-12", due:"2026-04-01", startDate:"2026-02-15", value:88500,  budget:95000,  source:"Direct",  type:"External", destination:"Europe",        sow:"SOW-2026-042", notes:"Dashboard must support white-labeling. Stakeholder review scheduled for March 10.", description:"Interactive BI dashboard with custom KPIs, drill-down filters, and PDF export.", typeData:{ dataSources:["CRM","ERP","Data Warehouse"], analyticsType:"Descriptive", dataVolume:"1–100 GB", dataResidency:"Regional", privacyCompliance:["GDPR"], analyticsTools:["Power BI","Tableau"] } },
  { id:"SR-0043", salesType:"Digital Services",  title:"White-label Mobile App",               client:"BlueStar Retail",   engagementName:"BlueStar Mobile Commerce",   category:"Custom",      priority:"High",     status:"Scoping",     owner:"Theo Vasquez", deliveryHead:"Dana Mercer", created:"2026-01-15", due:"2026-05-15", startDate:"2026-03-01", value:220000, budget:240000, source:"Referral",type:"External", destination:"APAC",          sow:"SOW-2026-043", notes:"Brand assets to be provided by client. App store submission by end of May.", description:"White-label iOS and Android retail app with product catalog, cart, and checkout flows.", typeData:{ serviceScope:["UI Design","Mobile App","E-commerce"], platform:"Mobile", designSystem:"New", accessibilityStandard:"WCAG 2.1 AA", supportedDevices:["iOS","Android"], cmsFramework:"React Native" } },
  { id:"SR-0044", salesType:"Cloud Services",    title:"API Gateway Configuration",            client:"Orion Financial",   engagementName:"Orion Cloud Migration",       category:"Integration", priority:"Medium",   status:"Approved",    owner:"Dana Mercer",  deliveryHead:"Sam Keller",  created:"2026-01-18", due:"2026-03-28", startDate:"2026-02-10", value:34000,  budget:38000,  source:"Direct",  type:"Internal", destination:"North America", sow:"SOW-2026-044", notes:"Rate limiting policies need legal review. Internal use only.", description:"AWS API Gateway setup with rate limiting, auth, and WAF for financial services endpoints.", typeData:{ cloudProvider:"AWS", migrationType:"Re-platform", infraScope:["Load Balancer","IAM","Secret Management"], devOpsToolchain:["Terraform","GitHub Actions"], complianceFramework:["SOC 2 Type II","PCI-DSS"] } },
  { id:"SR-0045", salesType:"Managed Services",  title:"Compliance Audit Module",              client:"TrueNorth Law",     engagementName:"TrueNorth Legal Ops",         category:"Service",     priority:"Critical", status:"In Progress", owner:"Sam Keller",   deliveryHead:"Lian Zhou",   created:"2026-01-22", due:"2026-03-14", startDate:"2026-02-01", value:67000,  budget:72000,  source:"RFP",     type:"External", destination:"North America", sow:"SOW-2026-045", notes:"OVERDUE RISK. Module must meet SOC 2 Type II. Legal review in progress.", description:"Automated compliance audit trail with e-signature support and regulatory reporting exports.", typeData:{ serviceScope:["Security Operations","Incident Management"], slaTier:"Platinum", supportCoverage:"24x7", escalationTiers:"3", monitoringTools:["Datadog","PagerDuty"], contractDuration:"Annual" } },
  { id:"SR-0046", salesType:"IT Services",       title:"Data Migration (Legacy to Cloud)",     client:"Summit Energy",     engagementName:"Summit Cloud Lift",           category:"Service",     priority:"High",     status:"On Hold",     owner:"Lian Zhou",    deliveryHead:"Theo Vasquez",created:"2026-01-25", due:"2026-04-30", startDate:"2026-03-01", value:51000,  budget:55000,  source:"Direct",  type:"External", destination:"North America", sow:"SOW-2026-046", notes:"On hold pending client infrastructure readiness sign-off.", description:"End-to-end lift of 12 legacy databases to AWS RDS with full data validation and rollback plan.", typeData:{ techStack:["ETL","AWS S3","PostgreSQL"], solutionType:"Migration", deploymentModel:"Cloud", cloudProvider:"AWS", slaTier:"Premium", securityClassification:"Confidential" } },
  { id:"SR-0047", salesType:"Contract Staffing", title:"SSO & Identity Federation",            client:"Nexus Corp",        engagementName:"Nexus Digital Transformation", category:"Integration", priority:"Medium",   status:"Draft",       owner:"Theo Vasquez", deliveryHead:"Rachel Kim",  created:"2026-02-01", due:"2026-05-01", startDate:"2026-03-15", value:29500,  budget:32000,  source:"Direct",  type:"Internal", destination:"North America", sow:"",              notes:"Companion to SR-0041. Awaiting security architecture sign-off.", description:"SAML 2.0 and OAuth federation for enterprise SSO across Nexus Corp product suite.", typeData:{ skills:["SAML","OAuth 2.0","Identity Management"], roles:[{role:"Security Engineer",count:1}], workModel:"Remote", contractType:"T&M", minExperience:"5", clearanceLevel:"None" } },
  { id:"SR-0048", salesType:"Data & Analytics",  title:"Predictive Analytics Engine",          client:"Meridian Holdings", engagementName:"Meridian Analytics Suite",    category:"Product",     priority:"High",     status:"In Review",   owner:"Sam Keller",   deliveryHead:"Tom Ashby",   created:"2026-02-03", due:"2026-06-10", startDate:"2026-03-20", value:175000, budget:190000, source:"RFP",     type:"External", destination:"Europe",        sow:"SOW-2026-048", notes:"Model accuracy target: >85%. EU data residency required.", description:"ML-powered predictive engine for churn, revenue forecasting, and anomaly detection.", typeData:{ dataSources:["CRM","Streaming (Kafka)","Databases (SQL)"], analyticsType:"Predictive", dataVolume:">1 TB", dataResidency:"Regional", privacyCompliance:["GDPR"], analyticsTools:["Databricks","MLflow","Azure Synapse"] } },
  { id:"SR-0049", salesType:"Digital Services",  title:"Customer Portal Redesign",             client:"BlueStar Retail",   engagementName:"BlueStar Mobile Commerce",   category:"Custom",      priority:"Low",      status:"Approved",    owner:"Dana Mercer",  deliveryHead:"Dana Mercer", created:"2026-02-05", due:"2026-04-20", startDate:"2026-03-10", value:43000,  budget:45000,  source:"Referral",type:"External", destination:"APAC",          sow:"SOW-2026-049", notes:"WCAG 2.1 AA compliance required.", description:"Full UX overhaul of self-service customer portal including account management and order tracking.", typeData:{ serviceScope:["UX Research","UI Design","Web Development"], platform:"Web", designSystem:"Existing", accessibilityStandard:"WCAG 2.1 AA", supportedDevices:["Desktop Chrome","Desktop Safari","iOS","Android"], cmsFramework:"React" } },
  { id:"SR-0050", salesType:"IT Services",       title:"Automated Invoice Processing",         client:"Orion Financial",   engagementName:"Orion Cloud Migration",       category:"Product",     priority:"Medium",   status:"Rejected",    owner:"Lian Zhou",    deliveryHead:"Sam Keller",  created:"2026-02-09", due:"2026-03-31", startDate:"",           value:28000,  budget:30000,  source:"Direct",  type:"External", destination:"North America", sow:"",              notes:"Rejected. Client reprioritized. Revisit in Q3 2026.", description:"OCR-based invoice ingestion with GL coding, approval workflow, and ERP push integration.", typeData:{ techStack:["OCR","Python","REST API"], solutionType:"Implementation", deploymentModel:"Cloud", cloudProvider:"Azure", slaTier:"Standard", securityClassification:"Internal" } },
  { id:"SR-0051", salesType:"Contract Staffing", title:"Inventory Sync Module",                client:"Summit Energy",     engagementName:"Summit Cloud Lift",           category:"Integration", priority:"Low",      status:"Draft",       owner:"Sam Keller",   deliveryHead:"Theo Vasquez",created:"2026-02-11", due:"2026-05-25", startDate:"2026-04-01", value:19000,  budget:21000,  source:"RFP",     type:"External", destination:"North America", sow:"",              notes:"Blocked by SOW-2026-046.", description:"Real-time inventory sync between field ops system and central ERP via REST API.", typeData:{ skills:["REST API","ERP Integration","Backend"], roles:[{role:"Backend Engineer",count:1}], workModel:"Hybrid", contractType:"T&M", minExperience:"3", clearanceLevel:"None" } },
  { id:"SR-0052", salesType:"Digital Services",  title:"Multi-Currency Support",               client:"TrueNorth Law",     engagementName:"TrueNorth Legal Ops",         category:"Product",     priority:"Medium",   status:"Scoping",     owner:"Theo Vasquez", deliveryHead:"Lian Zhou",   created:"2026-02-14", due:"2026-04-15", startDate:"2026-03-15", value:37500,  budget:40000,  source:"Direct",  type:"External", destination:"Europe",        sow:"SOW-2026-052", notes:"Requires EUR, GBP, CAD at minimum.", description:"Multi-currency billing engine with real-time FX conversion, localization, and reporting.", typeData:{ serviceScope:["Web Development"], platform:"Web", designSystem:"Existing", accessibilityStandard:"None", supportedDevices:["Desktop Chrome"], cmsFramework:"Node.js / i18n" } },
  { id:"SR-0053", salesType:"Managed Services",  title:"Real-time Notification Service",       client:"Nexus Corp",        engagementName:"Nexus Digital Transformation", category:"Service",     priority:"High",     status:"In Progress", owner:"Dana Mercer",  deliveryHead:"Rachel Kim",  created:"2026-02-18", due:"2026-03-25", startDate:"2026-02-25", value:55000,  budget:58000,  source:"Referral",type:"External", destination:"North America", sow:"SOW-2026-053", notes:"Load test target: 50k concurrent connections.", description:"Event-driven notification platform supporting push, email, and SMS with delivery receipts.", typeData:{ serviceScope:["Application Support","Infrastructure Monitoring"], slaTier:"Gold", supportCoverage:"24x7", escalationTiers:"2", monitoringTools:["Prometheus","PagerDuty"], contractDuration:"Annual" } },
  { id:"SR-0054", salesType:"Contract Staffing", title:"Role-Based Access Control",            client:"Meridian Holdings", engagementName:"Meridian Analytics Suite",    category:"Integration", priority:"Critical", status:"Approved",    owner:"Lian Zhou",    deliveryHead:"Tom Ashby",   created:"2026-02-20", due:"2026-04-05", startDate:"2026-03-01", value:48000,  budget:50000,  source:"RFP",     type:"Internal", destination:"Europe",        sow:"SOW-2026-054", notes:"Pen test required before go-live. ISO 27001 alignment mandatory.", description:"Fine-grained RBAC system with role inheritance, permission scoping, and admin dashboard.", typeData:{ skills:["IAM","Security","Backend"], roles:[{role:"Security Engineer",count:1},{role:"Backend Engineer",count:1}], workModel:"Onsite", contractType:"Fixed Price", minExperience:"6", clearanceLevel:"Basic" } },
  { id:"SR-0055", salesType:"Data & Analytics",  title:"Embedded BI Widgets",                 client:"BlueStar Retail",   engagementName:"BlueStar Mobile Commerce",   category:"Product",     priority:"Medium",   status:"On Hold",     owner:"Sam Keller",   deliveryHead:"Dana Mercer", created:"2026-02-22", due:"2026-06-01", startDate:"2026-04-15", value:61000,  budget:65000,  source:"Direct",  type:"External", destination:"APAC",          sow:"SOW-2026-055", notes:"On hold. Depends on SR-0049 completion.", description:"Embeddable analytics widgets for the customer portal with real-time sales, stock, and revenue charts.", typeData:{ dataSources:["CRM","Databases (SQL)"], analyticsType:"Descriptive", dataVolume:"1–100 GB", dataResidency:"No Restriction", privacyCompliance:[], analyticsTools:["Tableau","D3.js"] } },
];

const AUDIT_TRAILS = {
  "SR-0041":[{date:"2026-01-08",user:"Dana Mercer",action:"Created requirement",detail:"Initial draft created from RFP submission"},{date:"2026-01-15",user:"Rachel Kim",action:"Status changed",detail:"Draft → Scoping"},{date:"2026-01-22",user:"Dana Mercer",action:"Budget updated",detail:"Budget revised from $130,000 to $150,000"},{date:"2026-02-03",user:"Rachel Kim",action:"Status changed",detail:"Scoping → In Review"},{date:"2026-02-10",user:"System",action:"SOW linked",detail:"SOW-2026-041 attached"},{date:"2026-02-18",user:"Dana Mercer",action:"Comment added",detail:"Escalation path confirmed with executive sponsor"}],
  "SR-0045":[{date:"2026-01-22",user:"Sam Keller",action:"Created requirement",detail:"Initial draft from RFP"},{date:"2026-01-28",user:"Lian Zhou",action:"Status changed",detail:"Draft → Scoping"},{date:"2026-02-05",user:"Sam Keller",action:"Status changed",detail:"Scoping → In Review"},{date:"2026-02-12",user:"Lian Zhou",action:"Status changed",detail:"In Review → Approved"},{date:"2026-02-20",user:"Sam Keller",action:"Status changed",detail:"Approved → In Progress"},{date:"2026-03-01",user:"System",action:"Overdue warning",detail:"Due date approaching within 14 days"}],
};

const COMMENTS_SEED = {
  "SR-0041":[{id:1,user:"Rachel Kim",initials:"RK",date:"2026-02-05",text:"Salesforce connector spec reviewed. Two edge cases flagged — awaiting client clarification on object mapping for custom fields."},{id:2,user:"Dana Mercer",initials:"DM",date:"2026-02-12",text:"Client confirmed standard object mapping is sufficient. Custom fields scoped out of v1."},{id:3,user:"Theo Vasquez",initials:"TV",date:"2026-02-19",text:"Linked SSO requirement SR-0047 — identity federation should be completed before CRM integration goes live."}],
  "SR-0045":[{id:1,user:"Lian Zhou",initials:"LZ",date:"2026-02-08",text:"SOC 2 Type II requirements documented. Compliance team has approved the audit trail schema."},{id:2,user:"Sam Keller",initials:"SK",date:"2026-02-22",text:"Legal review still pending e-signature module. Risk: may delay go-live by 1 week."}],
};

const STATUS_ORDER = ["Draft","Scoping","In Review","Approved","In Progress"];
const STATUS_META = {
  "Draft":      {color:"#94a3b8",bg:"rgba(148,163,184,0.1)",dot:"#94a3b8"},
  "Scoping":    {color:"#d97706",bg:"rgba(245,158,11,0.1)", dot:"#f59e0b"},
  "In Review":  {color:"#4f46e5",bg:"rgba(99,102,241,0.1)",dot:"#6366f1"},
  "Approved":   {color:"#059669",bg:"rgba(16,185,129,0.1)",dot:"#10b981"},
  "In Progress":{color:"#2563eb",bg:"rgba(59,130,246,0.1)",dot:"#3b82f6"},
  "On Hold":    {color:"#ea580c",bg:"rgba(249,115,22,0.1)",dot:"#f97316"},
  "Rejected":   {color:"#dc2626",bg:"rgba(239,68,68,0.1)", dot:"#ef4444"},
};
const PRIORITY_META = {"Critical":{color:"#dc2626"},"High":{color:"#ea580c"},"Medium":{color:"#d97706"},"Low":{color:"#059669"}};

const ALL_STATUSES    = ["All",...Object.keys(STATUS_META)];
const ALL_PRIORITIES  = ["All","Critical","High","Medium","Low"];
const ALL_CATEGORIES  = ["All","Integration","Product","Service","Custom"];
const ALL_OWNERS      = ["Dana Mercer","Lian Zhou","Theo Vasquez","Sam Keller","Rachel Kim","Tom Ashby"];
const ALL_DESTINATIONS= ["North America","Europe","APAC","LATAM","MEA"];

/* ─────────────────── HELPERS ─────────────────── */
function fmt(n){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n)}
function fmtDate(d){if(!d)return"—";return new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
function isOverdue(d,s){return d&&new Date(d)<new Date()&&!["Approved","Rejected"].includes(s)}
function avatarColor(n){return`hsl(${((n||"").charCodeAt(0)*13)%360},50%,42%)`}
function initials(n){return(n||"").split(" ").map(x=>x[0]).join("").toUpperCase()}

const SortIcon=({col,sortCol,sortDir})=>(
  <span style={{marginLeft:4,opacity:sortCol===col?1:0.3,fontSize:10}}>
    {sortCol===col?(sortDir==="asc"?"▲":"▼"):"⇅"}
  </span>
);

/* ─────────────────── GLOBAL CSS ─────────────────── */
const GLOBAL_CSS=`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
  .trow:hover{background:#f8faff!important}.trow:hover .row-actions{opacity:1!important}.row-actions{opacity:0;transition:opacity .15s}
  .sort-th{cursor:pointer;user-select:none;white-space:nowrap}.sort-th:hover{color:#4f46e5}
  .stat-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px 24px;flex:1;min-width:160px;transition:border .2s,box-shadow .2s;box-shadow:0 1px 4px rgba(0,0,0,.05)}
  .stat-card:hover{border-color:#c7d2fe;box-shadow:0 4px 16px rgba(99,102,241,.1)}
  .fsel{background:#fff;border:1px solid #e2e8f0;color:#374151;border-radius:8px;padding:8px 12px;font-size:13px;cursor:pointer;outline:none}
  .fsel:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
  .finput{background:#fff;border:1px solid #e2e8f0;color:#1e293b;border-radius:8px;padding:9px 12px;font-size:13px;outline:none;transition:border .15s,box-shadow .15s;width:100%}
  .finput:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}.finput::placeholder{color:#94a3b8}
  .action-icon{background:#f8fafc;border:1px solid #e2e8f0;color:#94a3b8;border-radius:6px;padding:4px 8px;font-size:12px;cursor:pointer;margin-left:4px;transition:all .15s}
  .action-icon:hover{background:#eef2ff;color:#4f46e5;border-color:#c7d2fe}
  .cb{accent-color:#6366f1;width:15px;height:15px;cursor:pointer}
  .pg-btn{background:#fff;border:1px solid #e2e8f0;color:#64748b;border-radius:7px;width:32px;height:32px;cursor:pointer;font-size:13px;transition:all .15s;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.04)}
  .pg-btn:hover:not(:disabled){background:#eef2ff;color:#4f46e5;border-color:#c7d2fe}.pg-btn:disabled{opacity:.35;cursor:not-allowed}
  .pg-btn.active{background:#6366f1;color:#fff;border-color:#6366f1}
  .btn-primary{background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(99,102,241,.3)}
  .btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.4)}
  .btn-ghost{background:#fff;border:1px solid #e2e8f0;color:#64748b;border-radius:9px;padding:9px 16px;font-size:13px;cursor:pointer;transition:all .15s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .btn-ghost:hover{background:#f8fafc;color:#1e293b;border-color:#cbd5e1}
  .overdue-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#ef4444;margin-right:5px;animation:pulse2 1.5s infinite}
  @keyframes pulse2{0%,100%{opacity:1}50%{opacity:.4}}
  .toast{position:fixed;bottom:28px;right:28px;background:#10b981;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 8px 24px rgba(16,185,129,.35);z-index:9999;animation:slideup .3s ease}
  @keyframes slideup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  .clear-btn{background:none;border:none;color:#6366f1;font-size:12px;cursor:pointer;text-decoration:underline;padding:0}
  .tab-btn{background:none;border:none;padding:10px 18px;font-size:13px;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;color:#94a3b8;transition:all .15s}
  .tab-btn.active{color:#4f46e5;border-bottom-color:#4f46e5}.tab-btn:hover:not(.active){color:#475569}
  .skill-tag{display:inline-flex;align-items:center;gap:6px;background:#eef2ff;color:#4f46e5;border:1px solid #c7d2fe;border-radius:20px;padding:4px 10px;font-size:12px;font-weight:500;margin:3px}
  .skill-remove{cursor:pointer;opacity:.5;font-size:11px;line-height:1}.skill-remove:hover{opacity:1}
  .field-label{font-size:11px;color:#64748b;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:.6px;font-weight:600}
  .section-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .section-title{font-family:'Sora',sans-serif;font-size:12px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.8px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #f1f5f9}
  .detail-row{display:flex;align-items:flex-start;padding:9px 0;border-bottom:1px solid #f8fafc}
  .detail-label{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;min-width:130px;padding-top:2px;font-weight:600;flex-shrink:0}
  .detail-value{font-size:13.5px;color:#1e293b;flex:1}
  .comment-card{background:#f8fafc;border:1px solid #f1f5f9;border-radius:10px;padding:14px 16px;margin-bottom:10px}
  .sugg-skill{background:#f8fafc;border:1px solid #e2e8f0;border-radius:20px;padding:3px 10px;font-size:11px;color:#64748b;cursor:pointer;transition:all .1s}
  .sugg-skill:hover{background:#eef2ff;color:#4f46e5;border-color:#c7d2fe}
  .type-card{border:2px solid #e2e8f0;border-radius:12px;padding:14px 16px;cursor:pointer;transition:all .2s;background:#fff}
  .type-card:hover{border-color:#c7d2fe;background:#fafbff}
  .type-card.selected{background:#fafbff}
`;

/* ─────────────────── SHARED SHELL ─────────────────── */
function Shell({page,breadcrumb,children}){
  return(
    <div style={{minHeight:"100vh",background:"#f4f6fb",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1e293b"}}>
      <style>{GLOBAL_CSS}</style>
      <div style={{background:"#fff",borderBottom:"1px solid #e8ecf3",padding:"10px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 4px rgba(0,0,0,.04)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>CRM Platform</span>
          <span style={{color:"#cbd5e1"}}>›</span>
          <span style={{fontSize:12,color:"#94a3b8"}}>Sales</span>
          {breadcrumb.map((b,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:"#cbd5e1"}}>›</span>
              <span style={{fontSize:12,color:i===breadcrumb.length-1?"#475569":"#94a3b8",fontWeight:i===breadcrumb.length-1?500:400}}>{b}</span>
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

function StatusBadge({status}){
  const sm=STATUS_META[status]||{};
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:6,background:sm.bg,color:sm.color,border:`1px solid ${sm.color}30`,borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:500,whiteSpace:"nowrap"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:sm.dot,flexShrink:0}}/>{status}
    </span>
  );
}

function SalesTypePill({type}){
  const meta = SALES_TYPE_META[type]||{color:"#94a3b8",icon:"●"};
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,background:`${meta.color}12`,color:meta.color,border:`1px solid ${meta.color}30`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>
      <span style={{fontSize:12}}>{meta.icon}</span>{type}
    </span>
  );
}

/* ─────────────────── TAG PICKER (reusable) ─────────────────── */
function TagPicker({tags, onChange, pool, placeholder, accentColor="#4f46e5", poolLimit=14}){
  const [input,setInput]=useState("");
  const add=s=>{const t=s.trim();if(t&&!tags.includes(t))onChange([...tags,t]);setInput("");};
  const remove=s=>onChange(tags.filter(x=>x!==s));
  const bgColor=`${accentColor}12`;
  const borderColor=`${accentColor}40`;
  return(
    <div>
      <div style={{marginBottom:8,minHeight:32}}>
        {tags.map(s=>(
          <span key={s} style={{display:"inline-flex",alignItems:"center",gap:6,background:bgColor,color:accentColor,border:`1px solid ${borderColor}`,borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:500,margin:3}}>
            {s}<span style={{cursor:"pointer",opacity:.5,fontSize:11}} onClick={()=>remove(s)}>✕</span>
          </span>
        ))}
        {!tags.length&&<span style={{fontSize:13,color:"#94a3b8"}}>None added yet.</span>}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <input className="finput" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add(input);}}} placeholder={placeholder} list={`pool-${placeholder}`}/>
        <datalist id={`pool-${placeholder}`}>{(pool||[]).filter(s=>!tags.includes(s)).map(s=><option key={s} value={s}/>)}</datalist>
        <button className="btn-ghost" onClick={()=>add(input)} style={{whiteSpace:"nowrap",padding:"9px 14px"}}>+ Add</button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {(pool||[]).filter(s=>!tags.includes(s)).slice(0,poolLimit).map(s=>(
          <button key={s} className="sugg-skill" onClick={()=>add(s)}>+ {s}</button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── DYNAMIC SERVICE SPEC SECTION ─────────────────── */
function ServiceSpecSection({salesType, typeData, setTypeData}){
  const set=(k,v)=>setTypeData(d=>({...d,[k]:v}));
  const Field=({label,children})=>(<div><label className="field-label">{label}</label>{children}</div>);

  if(salesType==="Contract Staffing") return(
    <div style={{display:"grid",gap:16}}>
      <Field label="Required Skills">
        <TagPicker tags={typeData.skills||[]} onChange={v=>set("skills",v)} pool={TAG_POOLS.skills} placeholder="Type a skill and press Enter…" accentColor="#8b5cf6"/>
      </Field>
      <Field label="Roles & Headcount">
        <div style={{display:"grid",gap:8}}>
          {(typeData.roles||[]).map((r,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 100px auto",gap:8,alignItems:"center"}}>
              <input className="finput" value={r.role} onChange={e=>{const rs=[...(typeData.roles||[])];rs[i]={...rs[i],role:e.target.value};set("roles",rs);}} placeholder="Role title e.g. Senior Backend Engineer"/>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={()=>{const rs=[...(typeData.roles||[])];rs[i]={...rs[i],count:Math.max(1,(rs[i].count||1)-1)};set("roles",rs);}} style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <span style={{fontSize:14,fontWeight:600,minWidth:24,textAlign:"center"}}>{r.count||1}</span>
                <button onClick={()=>{const rs=[...(typeData.roles||[])];rs[i]={...rs[i],count:(rs[i].count||1)+1};set("roles",rs);}} style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
              {(typeData.roles||[]).length>1&&<button onClick={()=>set("roles",(typeData.roles||[]).filter((_,idx)=>idx!==i))} style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#ef4444",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
            </div>
          ))}
          <button className="btn-ghost" onClick={()=>set("roles",[...(typeData.roles||[]),{role:"",count:1}])} style={{alignSelf:"flex-start",padding:"7px 14px",fontSize:12}}>+ Add Role</button>
        </div>
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Work Model">
          <select className="fsel" value={typeData.workModel||"Hybrid"} onChange={e=>set("workModel",e.target.value)} style={{width:"100%"}}>
            {["Onsite","Remote","Hybrid"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Contract Type">
          <select className="fsel" value={typeData.contractType||"T&M"} onChange={e=>set("contractType",e.target.value)} style={{width:"100%"}}>
            {["T&M","Fixed Price","Retainer","BOT"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Min. Experience (years)">
          <input className="finput" type="number" value={typeData.minExperience||""} onChange={e=>set("minExperience",e.target.value)} placeholder="e.g. 5"/>
        </Field>
        <Field label="Clearance Level">
          <select className="fsel" value={typeData.clearanceLevel||"None"} onChange={e=>set("clearanceLevel",e.target.value)} style={{width:"100%"}}>
            {["None","Basic","Secret","Top Secret"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );

  if(salesType==="IT Services") return(
    <div style={{display:"grid",gap:16}}>
      <Field label="Technology Stack">
        <TagPicker tags={typeData.techStack||[]} onChange={v=>set("techStack",v)} pool={TAG_POOLS.techStack} placeholder="e.g. React, Node.js, PostgreSQL…" accentColor="#2563eb"/>
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Solution Type">
          <select className="fsel" value={typeData.solutionType||"Implementation"} onChange={e=>set("solutionType",e.target.value)} style={{width:"100%"}}>
            {["Implementation","Integration","Migration","Upgrade","Custom Development","Support & Maintenance"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Deployment Model">
          <select className="fsel" value={typeData.deploymentModel||"Cloud"} onChange={e=>set("deploymentModel",e.target.value)} style={{width:"100%"}}>
            {["Cloud","On-Premises","Hybrid","Multi-Cloud"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Cloud Provider">
          <select className="fsel" value={typeData.cloudProvider||"AWS"} onChange={e=>set("cloudProvider",e.target.value)} style={{width:"100%"}}>
            {["AWS","Azure","GCP","Multi-Cloud","N/A"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="SLA Tier">
          <select className="fsel" value={typeData.slaTier||"Standard"} onChange={e=>set("slaTier",e.target.value)} style={{width:"100%"}}>
            {["Standard","Premium","Enterprise"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Security Classification">
          <select className="fsel" value={typeData.securityClassification||"Internal"} onChange={e=>set("securityClassification",e.target.value)} style={{width:"100%"}}>
            {["Public","Internal","Confidential","Restricted"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );

  if(salesType==="Digital Services") return(
    <div style={{display:"grid",gap:16}}>
      <Field label="Service Scope">
        <TagPicker tags={typeData.serviceScope||[]} onChange={v=>set("serviceScope",v)} pool={TAG_POOLS.serviceScope_dig} placeholder="e.g. UX Research, Mobile App…" accentColor="#0891b2"/>
      </Field>
      <Field label="Supported Devices / Platforms">
        <TagPicker tags={typeData.supportedDevices||[]} onChange={v=>set("supportedDevices",v)} pool={TAG_POOLS.supportedDevices} placeholder="e.g. iOS, Android, Desktop Chrome…" accentColor="#0891b2"/>
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Primary Platform">
          <select className="fsel" value={typeData.platform||"Web"} onChange={e=>set("platform",e.target.value)} style={{width:"100%"}}>
            {["Web","Mobile","Web + Mobile","Desktop","Other"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Design System">
          <select className="fsel" value={typeData.designSystem||"Existing"} onChange={e=>set("designSystem",e.target.value)} style={{width:"100%"}}>
            {["New","Existing","TBD"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Accessibility Standard">
          <select className="fsel" value={typeData.accessibilityStandard||"WCAG 2.1 AA"} onChange={e=>set("accessibilityStandard",e.target.value)} style={{width:"100%"}}>
            {["WCAG 2.1 AA","WCAG 2.1 AAA","WCAG 2.2 AA","Section 508","None"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Framework / CMS">
          <input className="finput" value={typeData.cmsFramework||""} onChange={e=>set("cmsFramework",e.target.value)} placeholder="e.g. React, Next.js, WordPress…"/>
        </Field>
      </div>
    </div>
  );

  if(salesType==="Data & Analytics") return(
    <div style={{display:"grid",gap:16}}>
      <Field label="Data Sources">
        <TagPicker tags={typeData.dataSources||[]} onChange={v=>set("dataSources",v)} pool={TAG_POOLS.dataSources} placeholder="e.g. CRM, Data Warehouse, Kafka…" accentColor="#059669"/>
      </Field>
      <Field label="Tools & Platforms">
        <TagPicker tags={typeData.analyticsTools||[]} onChange={v=>set("analyticsTools",v)} pool={TAG_POOLS.analyticsTools} placeholder="e.g. Power BI, Databricks…" accentColor="#059669"/>
      </Field>
      <Field label="Privacy & Compliance Requirements">
        <TagPicker tags={typeData.privacyCompliance||[]} onChange={v=>set("privacyCompliance",v)} pool={TAG_POOLS.privacyCompliance} placeholder="e.g. GDPR, HIPAA…" accentColor="#059669"/>
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Analytics Type">
          <select className="fsel" value={typeData.analyticsType||"Predictive"} onChange={e=>set("analyticsType",e.target.value)} style={{width:"100%"}}>
            {["Descriptive","Diagnostic","Predictive","Prescriptive","ML / AI","Real-time Streaming"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Data Volume">
          <select className="fsel" value={typeData.dataVolume||"1–100 GB"} onChange={e=>set("dataVolume",e.target.value)} style={{width:"100%"}}>
            {["< 1 GB","1–100 GB","100 GB–1 TB","> 1 TB","Unknown"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Data Residency">
          <select className="fsel" value={typeData.dataResidency||"Regional"} onChange={e=>set("dataResidency",e.target.value)} style={{width:"100%"}}>
            {["Local","Regional","Global","No Restriction"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );

  if(salesType==="Managed Services") return(
    <div style={{display:"grid",gap:16}}>
      <Field label="Service Scope">
        <TagPicker tags={typeData.serviceScope||[]} onChange={v=>set("serviceScope",v)} pool={TAG_POOLS.serviceScope_mgd} placeholder="e.g. Application Support, Incident Management…" accentColor="#d97706"/>
      </Field>
      <Field label="Monitoring Tools">
        <TagPicker tags={typeData.monitoringTools||[]} onChange={v=>set("monitoringTools",v)} pool={TAG_POOLS.devOpsToolchain} placeholder="e.g. Datadog, Prometheus…" accentColor="#d97706"/>
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="SLA Tier">
          <select className="fsel" value={typeData.slaTier||"Gold"} onChange={e=>set("slaTier",e.target.value)} style={{width:"100%"}}>
            {["Bronze","Silver","Gold","Platinum"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Support Coverage">
          <select className="fsel" value={typeData.supportCoverage||"24x7"} onChange={e=>set("supportCoverage",e.target.value)} style={{width:"100%"}}>
            {["Business Hours (8x5)","Extended (12x5)","16x5","24x5","24x7"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Escalation Tiers">
          <input className="finput" type="number" value={typeData.escalationTiers||"3"} onChange={e=>set("escalationTiers",e.target.value)} placeholder="e.g. 3"/>
        </Field>
        <Field label="Contract Duration">
          <select className="fsel" value={typeData.contractDuration||"Annual"} onChange={e=>set("contractDuration",e.target.value)} style={{width:"100%"}}>
            {["Monthly","Quarterly","6 Months","Annual","2 Years","3 Years"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );

  if(salesType==="Cloud Services") return(
    <div style={{display:"grid",gap:16}}>
      <Field label="Infrastructure Scope">
        <TagPicker tags={typeData.infraScope||[]} onChange={v=>set("infraScope",v)} pool={TAG_POOLS.infraScope} placeholder="e.g. Containers, Serverless, Databases…" accentColor="#4f46e5"/>
      </Field>
      <Field label="DevOps Toolchain">
        <TagPicker tags={typeData.devOpsToolchain||[]} onChange={v=>set("devOpsToolchain",v)} pool={TAG_POOLS.devOpsToolchain} placeholder="e.g. Terraform, GitHub Actions…" accentColor="#4f46e5"/>
      </Field>
      <Field label="Compliance Framework">
        <TagPicker tags={typeData.complianceFramework||[]} onChange={v=>set("complianceFramework",v)} pool={TAG_POOLS.complianceFramework} placeholder="e.g. SOC 2, ISO 27001…" accentColor="#4f46e5"/>
      </Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Cloud Provider">
          <select className="fsel" value={typeData.cloudProvider||"AWS"} onChange={e=>set("cloudProvider",e.target.value)} style={{width:"100%"}}>
            {["AWS","Azure","GCP","Multi-Cloud","Private Cloud"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Migration / Engagement Type">
          <select className="fsel" value={typeData.migrationType||"Re-platform"} onChange={e=>set("migrationType",e.target.value)} style={{width:"100%"}}>
            {["Lift & Shift","Re-platform","Re-architect","Greenfield","Hybrid Extension","Decommission"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );

  return <div style={{color:"#94a3b8",fontSize:13}}>Select a sales type above to see relevant fields.</div>;
}

/* ═══════════════ P-010 LIST ═══════════════ */
function RequirementsList({requirements,onView,onEdit,onCreate}){
  const [search,setSearch]=useState("");
  const [statusFilter,setStatusFilter]=useState("All");
  const [priorityFilter,setPriorityFilter]=useState("All");
  const [categoryFilter,setCategoryFilter]=useState("All");
  const [sortCol,setSortCol]=useState("id");
  const [sortDir,setSortDir]=useState("asc");
  const [page,setPage]=useState(1);
  const [selected,setSelected]=useState(new Set());
  const [exportMsg,setExportMsg]=useState(false);
  const PER_PAGE=8;

  const handleSort=col=>{if(sortCol===col)setSortDir(d=>d==="asc"?"desc":"asc");else{setSortCol(col);setSortDir("asc");}};

  const filtered=useMemo(()=>{
    let r=requirements;
    if(search)r=r.filter(x=>[x.id,x.title,x.client,x.owner].some(f=>f.toLowerCase().includes(search.toLowerCase())));
    if(statusFilter!=="All")r=r.filter(x=>x.status===statusFilter);
    if(priorityFilter!=="All")r=r.filter(x=>x.priority===priorityFilter);
    if(categoryFilter!=="All")r=r.filter(x=>x.category===categoryFilter);
    return[...r].sort((a,b)=>{let va=a[sortCol],vb=b[sortCol];if(typeof va==="string"){va=va.toLowerCase();vb=vb.toLowerCase();}return sortDir==="asc"?(va>vb?1:-1):(va<vb?1:-1);});
  },[requirements,search,statusFilter,priorityFilter,categoryFilter,sortCol,sortDir]);

  const paged=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const totalPages=Math.max(1,Math.ceil(filtered.length/PER_PAGE));
  const stats=useMemo(()=>({total:requirements.length,active:requirements.filter(x=>["In Progress","In Review","Scoping"].includes(x.status)).length,totalValue:requirements.reduce((s,x)=>s+x.value,0),critical:requirements.filter(x=>x.priority==="Critical").length}),[requirements]);
  const toggleRow=id=>setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleAll=()=>setSelected(s=>s.size===paged.length?new Set():new Set(paged.map(x=>x.id)));

  const handleExport=()=>{
    const rows=[["ID","Sales Type","Title","Client","Priority","Status","Owner","Due","Value"],
      ...filtered.map(r=>[r.id,r.salesType||"—",r.title,r.client,r.priority,r.status,r.owner,r.due,r.value])];
    const csv=rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="sales-requirements.csv";a.click();
    setExportMsg(true);setTimeout(()=>setExportMsg(false),2500);
  };

  return(
    <Shell page="P-010" breadcrumb={["Requirements"]}>
      <div style={{padding:"32px 36px",maxWidth:1500,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <div style={{width:8,height:32,borderRadius:4,background:"linear-gradient(180deg,#4f46e5,#818cf8)"}}/>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:700,color:"#0f172a",letterSpacing:-0.5}}>Sales Requirements</h1>
            </div>
            <p style={{fontSize:13.5,color:"#64748b",marginLeft:18}}>Track and manage all sales requirements across IT, Digital, Data, Cloud, Managed Services, and Contract Staffing.</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-ghost" onClick={handleExport}>↓ Export CSV</button>
            <button className="btn-primary" onClick={onCreate}>+ New Requirement</button>
          </div>
        </div>

        <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
          {[{label:"Total Requirements",val:stats.total,sub:"All time",accent:"#6366f1"},{label:"Active",val:stats.active,sub:"In flight",accent:"#3b82f6"},{label:"Pipeline Value",val:fmt(stats.totalValue),sub:"Estimated",accent:"#10b981",lg:true},{label:"Critical Priority",val:stats.critical,sub:"Needs attention",accent:"#ef4444"}].map((s,i)=>(
            <div key={i} className="stat-card" style={{borderLeft:`3px solid ${s.accent}`}}>
              <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>{s.label}</div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:s.lg?20:28,fontWeight:700,color:"#0f172a",marginBottom:4}}>{s.val}</div>
              <div style={{fontSize:11,color:s.accent}}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"14px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:14,pointerEvents:"none"}}>⌕</span>
            <input className="finput" style={{width:280,paddingLeft:34}} placeholder="Search ID, title, client, owner…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
          </div>
          <select className="fsel" value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}}>{ALL_STATUSES.map(s=><option key={s}>{s}</option>)}</select>
          <select className="fsel" value={priorityFilter} onChange={e=>{setPriorityFilter(e.target.value);setPage(1);}}>{ALL_PRIORITIES.map(p=><option key={p}>{p}</option>)}</select>
          <select className="fsel" value={categoryFilter} onChange={e=>{setCategoryFilter(e.target.value);setPage(1);}}>{ALL_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
          {(search||statusFilter!=="All"||priorityFilter!=="All"||categoryFilter!=="All")&&<button className="clear-btn" onClick={()=>{setSearch("");setStatusFilter("All");setPriorityFilter("All");setCategoryFilter("All");setPage(1);}}>✕ Clear</button>}
          <div style={{marginLeft:"auto",fontSize:12,color:"#94a3b8"}}>
            {selected.size>0&&<span style={{color:"#6366f1",marginRight:12,fontWeight:600}}>{selected.size} selected</span>}
            {filtered.length} of {requirements.length} requirements
          </div>
        </div>

        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,.05)"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"#f8fafc",borderBottom:"1px solid #e8ecf3"}}>
                  <th style={{padding:"13px 16px",width:40}}><input type="checkbox" className="cb" checked={paged.length>0&&paged.every(r=>selected.has(r.id))} onChange={toggleAll}/></th>
                  {[["id","Req. ID"],["salesType","Sales Type"],["title","Title"],["client","Client"],["priority","Priority"],["status","Status"],["owner","Owner"],["due","Due Date"],["value","Est. Value"]].map(([col,label])=>(
                    <th key={col} className="sort-th" style={{padding:"13px 14px",textAlign:"left",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,fontWeight:600}} onClick={()=>handleSort(col)}>
                      {label}<SortIcon col={col} sortCol={sortCol} sortDir={sortDir}/>
                    </th>
                  ))}
                  <th style={{padding:"13px 14px",fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8,fontWeight:600}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length===0?(
                  <tr><td colSpan={11} style={{padding:60,textAlign:"center",color:"#94a3b8"}}><div style={{fontSize:32,marginBottom:10}}>◌</div>No requirements match the current filters.</td></tr>
                ):paged.map(row=>{
                  const pm=PRIORITY_META[row.priority]||{};
                  const overdue=isOverdue(row.due,row.status);
                  return(
                    <tr key={row.id} className="trow" style={{borderBottom:"1px solid #f1f5f9",background:selected.has(row.id)?"#eef2ff":"transparent"}}>
                      <td style={{padding:"13px 16px"}}><input type="checkbox" className="cb" checked={selected.has(row.id)} onChange={()=>toggleRow(row.id)}/></td>
                      <td style={{padding:"13px 14px",fontFamily:"'Sora',sans-serif",fontWeight:700,color:"#4f46e5",fontSize:12,whiteSpace:"nowrap",cursor:"pointer"}} onClick={()=>onView(row.id)}>{row.id}</td>
                      <td style={{padding:"13px 14px"}}>{row.salesType&&<SalesTypePill type={row.salesType}/>}</td>
                      <td style={{padding:"13px 14px",color:"#0f172a",fontWeight:500,maxWidth:220,cursor:"pointer"}} onClick={()=>onView(row.id)}>
                        <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={row.title}>{row.title}</div>
                      </td>
                      <td style={{padding:"13px 14px",color:"#475569"}}>{row.client}</td>
                      <td style={{padding:"13px 14px",fontWeight:700,fontSize:12,color:pm.color,whiteSpace:"nowrap"}}>
                        <span style={{display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:7,height:7,borderRadius:"50%",background:pm.color}}/>{row.priority}</span>
                      </td>
                      <td style={{padding:"13px 14px"}}><StatusBadge status={row.status}/></td>
                      <td style={{padding:"13px 14px",color:"#475569",whiteSpace:"nowrap"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{width:24,height:24,borderRadius:"50%",background:avatarColor(row.owner),display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{initials(row.owner)}</div>
                          {row.owner}
                        </div>
                      </td>
                      <td style={{padding:"13px 14px",whiteSpace:"nowrap"}}>
                        {overdue&&<span className="overdue-dot"/>}
                        <span style={{color:overdue?"#dc2626":"#64748b"}}>{fmtDate(row.due)}</span>
                      </td>
                      <td style={{padding:"13px 14px",fontWeight:600,color:"#1e293b",whiteSpace:"nowrap"}}>{fmt(row.value)}</td>
                      <td style={{padding:"13px 14px"}}>
                        <div className="row-actions" style={{display:"flex"}}>
                          <button className="action-icon" title="View" onClick={()=>onView(row.id)}>👁</button>
                          <button className="action-icon" title="Edit" onClick={()=>onEdit(row.id)}>✎</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderTop:"1px solid #f1f5f9",flexWrap:"wrap",gap:12,background:"#fafbfc"}}>
            <div style={{fontSize:12,color:"#94a3b8"}}>Showing {Math.min((page-1)*PER_PAGE+1,Math.max(1,filtered.length))}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length} results</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <button className="pg-btn" disabled={page===1} onClick={()=>setPage(1)}>«</button>
              <button className="pg-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1).reduce((acc,p,i,arr)=>{if(i>0&&p-arr[i-1]>1)acc.push("…");acc.push(p);return acc;},[]).map((p,i)=>typeof p==="string"?<span key={`e${i}`} style={{color:"#94a3b8",fontSize:13,padding:"0 4px"}}>…</span>:<button key={p} className={`pg-btn${p===page?" active":""}`} onClick={()=>setPage(p)}>{p}</button>)}
              <button className="pg-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
              <button className="pg-btn" disabled={page===totalPages} onClick={()=>setPage(totalPages)}>»</button>
            </div>
          </div>
        </div>

        <div style={{marginTop:20,display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.8}}>Sales Types:</span>
          {SALES_TYPES.map(t=>(
            <div key={t.value} style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:14}}>{t.icon}</span>
              <span style={{fontSize:12,color:"#64748b"}}>{t.value}</span>
            </div>
          ))}
        </div>
      </div>
      {exportMsg&&<div className="toast">✓ Exported {filtered.length} requirements to CSV</div>}
    </Shell>
  );
}

/* ═══════════════ P-011 CREATE / EDIT FORM ═══════════════ */
function RequirementForm({requirement,onBack,onSave}){
  const isEdit=!!requirement;
  const blank={salesType:"IT Services",title:"",client:"",engagementName:"",category:"Integration",priority:"High",status:"Draft",owner:"Dana Mercer",deliveryHead:"",created:new Date().toISOString().split("T")[0],due:"",startDate:"",value:"",budget:"",source:"Direct",type:"External",destination:"North America",sow:"",notes:"",description:"",typeData:{...TYPE_DEFAULTS["IT Services"]}};
  const [form,setForm]=useState(isEdit?{...requirement,typeData:requirement.typeData||{...TYPE_DEFAULTS[requirement.salesType||"IT Services"]}}:blank);
  const [saved,setSaved]=useState(false);
  const [errors,setErrors]=useState({});

  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const setTypeData=updater=>setForm(f=>({...f,typeData:typeof updater==="function"?updater(f.typeData):{...f.typeData,...updater}}));

  const handleSalesTypeChange=newType=>{
    setForm(f=>({...f,salesType:newType,typeData:{...(TYPE_DEFAULTS[newType]||{})}}));
  };

  const validate=()=>{
    const e={};
    if(!form.title.trim())e.title="Required";
    if(!form.client.trim())e.client="Required";
    if(!form.due)e.due="Required";
    if(!form.value)e.value="Required";
    setErrors(e);return!Object.keys(e).length;
  };

  const handleSave=()=>{
    if(!validate())return;
    onSave({...form,value:Number(form.value),budget:Number(form.budget)});
    setSaved(true);setTimeout(()=>setSaved(false),2500);
  };

  const Field=({label,error,children})=>(
    <div><label className="field-label">{label}{error&&<span style={{color:"#ef4444",marginLeft:6,textTransform:"none",fontSize:11,fontWeight:400}}>— {error}</span>}</label>{children}</div>
  );

  const selectedMeta=SALES_TYPE_META[form.salesType]||SALES_TYPES[0];

  return(
    <Shell page="P-011" breadcrumb={["Requirements",isEdit?`Edit ${requirement.id}`:"New Requirement"]}>
      <div style={{padding:"28px 36px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button className="btn-ghost" onClick={onBack} style={{padding:"8px 14px",fontSize:13}}>← Back</button>
            <div style={{width:1,height:24,background:"#e2e8f0"}}/>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:7,height:28,borderRadius:4,background:`linear-gradient(180deg,${selectedMeta.color},${selectedMeta.color}99)`}}/>
                <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a"}}>{isEdit?`Edit Requirement — ${requirement.id}`:"New Sales Requirement"}</h1>
              </div>
              <p style={{fontSize:13,color:"#64748b",marginLeft:17,marginTop:2}}>{isEdit?"Update requirement details, classification, and type-specific fields.":"Capture a new sales requirement. Select a Sales Type to see context-relevant fields."}</p>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-ghost" onClick={onBack}>Discard</button>
            <button className="btn-primary" onClick={handleSave}>{isEdit?"Save Changes":"Create Requirement"}</button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
          <div>
            {/* BASIC INFO */}
            <div className="section-card">
              <div className="section-title">Basic Information</div>
              <div style={{display:"grid",gap:16}}>

                {/* SALES TYPE SELECTOR */}
                <div>
                  <label className="field-label">Sales Type <span style={{color:"#6366f1",fontWeight:400,textTransform:"none"}}>— determines required fields below</span></label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                    {SALES_TYPES.map(t=>(
                      <div key={t.value} className={`type-card${form.salesType===t.value?" selected":""}`}
                        style={{borderColor:form.salesType===t.value?t.color:"#e2e8f0",background:form.salesType===t.value?`${t.color}08`:"#fff"}}
                        onClick={()=>handleSalesTypeChange(t.value)}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <span style={{fontSize:16}}>{t.icon}</span>
                          <span style={{fontSize:13,fontWeight:600,color:form.salesType===t.value?t.color:"#374151"}}>{t.value}</span>
                          {form.salesType===t.value&&<span style={{marginLeft:"auto",width:16,height:16,borderRadius:"50%",background:t.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>✓</span>}
                        </div>
                        <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.4}}>{t.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Field label="Requirement Title *" error={errors.title}>
                  <input className="finput" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. CRM Integration for Enterprise Tier" style={{borderColor:errors.title?"#ef4444":undefined}}/>
                </Field>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <Field label="Client / Account *" error={errors.client}>
                    <input className="finput" value={form.client} onChange={e=>set("client",e.target.value)} placeholder="e.g. Nexus Corp" style={{borderColor:errors.client?"#ef4444":undefined}}/>
                  </Field>
                  <Field label="Engagement Name">
                    <input className="finput" value={form.engagementName} onChange={e=>set("engagementName",e.target.value)} placeholder="e.g. Nexus Digital Transformation"/>
                  </Field>
                </div>
                <Field label="Description">
                  <textarea className="finput" rows={3} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Describe scope, goals, and expected outcomes…" style={{resize:"vertical"}}/>
                </Field>
                <Field label="Internal Notes">
                  <textarea className="finput" rows={3} value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Escalation paths, blockers, stakeholder context…" style={{resize:"vertical"}}/>
                </Field>
              </div>
            </div>

            {/* DYNAMIC SERVICE SPECIFICATION */}
            <div className="section-card" style={{borderTop:`3px solid ${selectedMeta.color}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>
                <span style={{fontSize:18}}>{selectedMeta.icon}</span>
                <div>
                  <div style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:"#0f172a",textTransform:"uppercase",letterSpacing:.8}}>{form.salesType} — Service Specification</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{selectedMeta.desc}</div>
                </div>
              </div>
              <ServiceSpecSection salesType={form.salesType} typeData={form.typeData} setTypeData={setTypeData}/>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div className="section-card">
              <div className="section-title">Classification</div>
              <div style={{display:"grid",gap:14}}>
                {[["Status","status",Object.keys(STATUS_META)],["Priority","priority",["Critical","High","Medium","Low"]],["Category","category",["Integration","Product","Service","Custom"]],["Source","source",["Direct","RFP","Referral","Upsell"]],["Type","type",["External","Internal"]]].map(([label,key,opts])=>(
                  <Field key={key} label={label}><select className="fsel" value={form[key]} onChange={e=>set(key,e.target.value)} style={{width:"100%"}}>{opts.map(o=><option key={o}>{o}</option>)}</select></Field>
                ))}
                <Field label="Destination / Region">
                  <select className="fsel" value={form.destination} onChange={e=>set("destination",e.target.value)} style={{width:"100%"}}>
                    {ALL_DESTINATIONS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div className="section-card">
              <div className="section-title">People</div>
              <div style={{display:"grid",gap:14}}>
                {[["Owner","owner"],["Delivery Head","deliveryHead"]].map(([label,key])=>(
                  <Field key={key} label={label}>
                    <select className="fsel" value={form[key]} onChange={e=>set(key,e.target.value)} style={{width:"100%"}}>
                      <option value="">— Select —</option>
                      {ALL_OWNERS.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </Field>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="section-title">Dates</div>
              <div style={{display:"grid",gap:14}}>
                {[["Created","created"],["Start Date","startDate"],["Due Date *","due"]].map(([label,key])=>(
                  <Field key={key} label={label} error={key==="due"?errors.due:undefined}>
                    <input type="date" className="finput" value={form[key]} onChange={e=>set(key,e.target.value)} style={{borderColor:key==="due"&&errors.due?"#ef4444":undefined}}/>
                  </Field>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="section-title">Financials</div>
              <div style={{display:"grid",gap:14}}>
                <Field label="Estimated Value ($) *" error={errors.value}>
                  <input type="number" className="finput" value={form.value} onChange={e=>set("value",e.target.value)} placeholder="0" style={{borderColor:errors.value?"#ef4444":undefined}}/>
                </Field>
                <Field label="Budget ($)">
                  <input type="number" className="finput" value={form.budget} onChange={e=>set("budget",e.target.value)} placeholder="0"/>
                </Field>
                <Field label="Linked SOW">
                  <input className="finput" value={form.sow} onChange={e=>set("sow",e.target.value)} placeholder="e.g. SOW-2026-041"/>
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"flex-end",gap:10,paddingBottom:40}}>
          <button className="btn-ghost" onClick={onBack}>Discard Changes</button>
          <button className="btn-primary" onClick={handleSave}>{isEdit?"Save Changes":"Create Requirement"}</button>
        </div>
      </div>
      {saved&&<div className="toast">✓ Requirement {isEdit?"updated":"created"} successfully</div>}
    </Shell>
  );
}

/* ═══════════════ P-012 DETAIL VIEW ═══════════════ */
function RequirementDetail({requirement,allComments,onBack,onEdit,onCommentAdd}){
  const [activeTab,setActiveTab]=useState("overview");
  const [newComment,setNewComment]=useState("");
  const comments=allComments[requirement.id]||[];
  const audit=AUDIT_TRAILS[requirement.id]||[];
  const pm=PRIORITY_META[requirement.priority]||{};
  const overdue=isOverdue(requirement.due,requirement.status);
  const budgetPct=requirement.budget?Math.min(100,Math.round((requirement.value/requirement.budget)*100)):0;
  const typeMeta=SALES_TYPE_META[requirement.salesType]||{color:"#6366f1",icon:"●"};
  const td=requirement.typeData||{};

  const addComment=()=>{
    if(!newComment.trim())return;
    onCommentAdd(requirement.id,{id:Date.now(),user:"Dana Mercer",initials:"DM",date:new Date().toISOString().split("T")[0],text:newComment.trim()});
    setNewComment("");
  };

  /* Render type-specific fields for detail view */
  const renderTypeData=()=>{
    const TagList=({tags})=>tags&&tags.length?(<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{tags.map(s=><span key={s} className="skill-tag" style={{margin:0,background:`${typeMeta.color}12`,color:typeMeta.color,borderColor:`${typeMeta.color}30`}}>{s}</span>)}</div>):(<span style={{color:"#94a3b8"}}>—</span>);
    const Row=({label,value})=>(<div className="detail-row"><span className="detail-label">{label}</span><span className="detail-value">{value||"—"}</span></div>);

    if(requirement.salesType==="Contract Staffing") return(<>
      <Row label="Skills" value={<TagList tags={td.skills}/>}/>
      <Row label="Roles & Headcount" value={td.roles&&td.roles.filter(r=>r.role).length?(<div style={{display:"grid",gap:4}}>{td.roles.filter(r=>r.role).map((r,i)=>(<div key={i} style={{display:"flex",gap:8,alignItems:"center"}}><span style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:6,padding:"3px 10px",fontSize:12,color:"#475569"}}>{r.count}×</span><span style={{fontSize:13.5}}>{r.role}</span></div>))}</div>):"—"}/>
      <Row label="Work Model" value={td.workModel}/><Row label="Contract Type" value={td.contractType}/><Row label="Min. Experience" value={td.minExperience?`${td.minExperience} years`:undefined}/><Row label="Clearance Level" value={td.clearanceLevel}/>
    </>);
    if(requirement.salesType==="IT Services") return(<>
      <Row label="Technology Stack" value={<TagList tags={td.techStack}/>}/>
      <Row label="Solution Type" value={td.solutionType}/><Row label="Deployment Model" value={td.deploymentModel}/><Row label="Cloud Provider" value={td.cloudProvider}/><Row label="SLA Tier" value={td.slaTier}/><Row label="Security Classification" value={td.securityClassification}/>
    </>);
    if(requirement.salesType==="Digital Services") return(<>
      <Row label="Service Scope" value={<TagList tags={td.serviceScope}/>}/>
      <Row label="Supported Devices" value={<TagList tags={td.supportedDevices}/>}/>
      <Row label="Primary Platform" value={td.platform}/><Row label="Design System" value={td.designSystem}/><Row label="Accessibility" value={td.accessibilityStandard}/><Row label="Framework / CMS" value={td.cmsFramework}/>
    </>);
    if(requirement.salesType==="Data & Analytics") return(<>
      <Row label="Data Sources" value={<TagList tags={td.dataSources}/>}/>
      <Row label="Analytics Tools" value={<TagList tags={td.analyticsTools}/>}/>
      <Row label="Privacy Compliance" value={<TagList tags={td.privacyCompliance}/>}/>
      <Row label="Analytics Type" value={td.analyticsType}/><Row label="Data Volume" value={td.dataVolume}/><Row label="Data Residency" value={td.dataResidency}/>
    </>);
    if(requirement.salesType==="Managed Services") return(<>
      <Row label="Service Scope" value={<TagList tags={td.serviceScope}/>}/>
      <Row label="Monitoring Tools" value={<TagList tags={td.monitoringTools}/>}/>
      <Row label="SLA Tier" value={td.slaTier}/><Row label="Support Coverage" value={td.supportCoverage}/><Row label="Escalation Tiers" value={td.escalationTiers}/><Row label="Contract Duration" value={td.contractDuration}/>
    </>);
    if(requirement.salesType==="Cloud Services") return(<>
      <Row label="Infrastructure Scope" value={<TagList tags={td.infraScope}/>}/>
      <Row label="DevOps Toolchain" value={<TagList tags={td.devOpsToolchain}/>}/>
      <Row label="Compliance Framework" value={<TagList tags={td.complianceFramework}/>}/>
      <Row label="Cloud Provider" value={td.cloudProvider}/><Row label="Migration Type" value={td.migrationType}/>
    </>);
    return null;
  };

  return(
    <Shell page="P-012" breadcrumb={["Requirements",requirement.id]}>
      <div style={{padding:"28px 36px",maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <button className="btn-ghost" onClick={onBack} style={{padding:"8px 14px",fontSize:13,marginTop:4,flexShrink:0}}>← Back</button>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:"#4f46e5",background:"#eef2ff",padding:"3px 10px",borderRadius:20}}>{requirement.id}</span>
                <SalesTypePill type={requirement.salesType}/>
                <StatusBadge status={requirement.status}/>
                {overdue&&<span style={{background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600}}>⚠ Overdue</span>}
                <span style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#64748b"}}>{requirement.type}</span>
              </div>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a",lineHeight:1.3,maxWidth:680}}>{requirement.title}</h1>
              <p style={{fontSize:13,color:"#64748b",marginTop:4}}>{requirement.client} · {requirement.engagementName}</p>
            </div>
          </div>
          <button className="btn-primary" onClick={onEdit} style={{flexShrink:0,marginTop:4}}>✎ Edit</button>
        </div>

        {/* STATUS TIMELINE */}
        <div className="section-card">
          <div className="section-title">Status Progress</div>
          <div style={{display:"flex",alignItems:"flex-start"}}>
            {STATUS_ORDER.map((s,i)=>{
              const done=i<STATUS_ORDER.indexOf(requirement.status)&&!["On Hold","Rejected"].includes(requirement.status);
              const active=s===requirement.status;
              const sm=STATUS_META[s]||{};
              return(
                <div key={s} style={{display:"flex",alignItems:"center",flex:i<STATUS_ORDER.length-1?1:"none"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:done?"#10b981":active?sm.dot:"#f1f5f9",border:`2px solid ${done?"#10b981":active?sm.dot:"#e2e8f0"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:done||active?"#fff":"#94a3b8",fontWeight:700,boxShadow:active?`0 0 0 4px ${sm.dot}20`:"none",transition:"all .3s"}}>
                      {done?"✓":i+1}
                    </div>
                    <span style={{fontSize:10,color:active?sm.color:done?"#10b981":"#94a3b8",fontWeight:active?700:500,whiteSpace:"nowrap",letterSpacing:.3}}>{s}</span>
                  </div>
                  {i<STATUS_ORDER.length-1&&<div style={{flex:1,height:2,background:done?"#10b981":"#e2e8f0",margin:"0 4px",marginBottom:22,transition:"background .3s"}}/>}
                </div>
              );
            })}
            {["On Hold","Rejected"].includes(requirement.status)&&(
              <div style={{marginLeft:20,display:"flex",alignItems:"center",gap:8,paddingBottom:22}}>
                <div style={{width:2,height:34,background:"#e2e8f0"}}/>
                <StatusBadge status={requirement.status}/>
              </div>
            )}
          </div>
        </div>

        <div style={{borderBottom:"1px solid #e2e8f0",marginBottom:20,display:"flex"}}>
          {[["overview","Overview"],["comments",`Comments (${comments.length})`],["audit","Audit Trail"]].map(([k,label])=>(
            <button key={k} className={`tab-btn${activeTab===k?" active":""}`} onClick={()=>setActiveTab(k)}>{label}</button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
          <div>
            {activeTab==="overview"&&(<>
              <div className="section-card">
                <div className="section-title">Requirement Details</div>
                {[["Description",<span style={{lineHeight:1.7,whiteSpace:"pre-wrap"}}>{requirement.description||"—"}</span>],["Client",requirement.client],["Engagement",requirement.engagementName||"—"],["Category",requirement.category],["Source",requirement.source],["Type",requirement.type],["Destination",requirement.destination],["Linked SOW",requirement.sow?<span style={{fontFamily:"monospace",background:"#f1f5f9",borderRadius:4,padding:"2px 7px",color:"#4f46e5",fontSize:13,border:"1px solid #e2e8f0"}}>{requirement.sow}</span>:<span style={{color:"#94a3b8"}}>—</span>]].map(([label,value])=>(
                  <div key={label} className="detail-row"><span className="detail-label">{label}</span><span className="detail-value">{value}</span></div>
                ))}
              </div>

              <div className="section-card" style={{borderTop:`3px solid ${typeMeta.color}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,paddingBottom:12,borderBottom:"1px solid #f1f5f9"}}>
                  <span style={{fontSize:18}}>{typeMeta.icon}</span>
                  <span style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:"#0f172a",textTransform:"uppercase",letterSpacing:.8}}>{requirement.salesType} Details</span>
                </div>
                {renderTypeData()}
              </div>

              {requirement.notes&&(
                <div className="section-card" style={{borderLeft:"3px solid #f59e0b"}}>
                  <div className="section-title">Internal Notes</div>
                  <p style={{fontSize:13.5,color:"#475569",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{requirement.notes}</p>
                </div>
              )}
            </>)}

            {activeTab==="comments"&&(
              <div className="section-card">
                <div className="section-title">Comments & Collaboration</div>
                {comments.map(c=>(
                  <div key={c.id} className="comment-card">
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:avatarColor(c.user),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{c.initials}</div>
                      <span style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{c.user}</span>
                      <span style={{fontSize:11,color:"#94a3b8"}}>{fmtDate(c.date)}</span>
                    </div>
                    <p style={{fontSize:13.5,color:"#475569",lineHeight:1.65}}>{c.text}</p>
                  </div>
                ))}
                {!comments.length&&<p style={{color:"#94a3b8",fontSize:13,marginBottom:16}}>No comments yet. Start the conversation.</p>}
                <div style={{marginTop:16,display:"flex",gap:8,alignItems:"flex-start"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:avatarColor("Dana Mercer"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0,marginTop:2}}>DM</div>
                  <div style={{flex:1}}>
                    <textarea className="finput" rows={3} value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Add a comment…" style={{resize:"vertical",marginBottom:8}}/>
                    <button className="btn-primary" onClick={addComment} style={{padding:"8px 16px",fontSize:12}}>Post Comment</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab==="audit"&&(
              <div className="section-card">
                <div className="section-title">Audit Trail</div>
                {!audit.length&&<p style={{color:"#94a3b8",fontSize:13}}>No audit history available.</p>}
                {audit.map((entry,i)=>(
                  <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,width:18}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:i===0?"#6366f1":"#e2e8f0",border:`2px solid ${i===0?"#6366f1":"#cbd5e1"}`,marginTop:3}}/>
                      {i<audit.length-1&&<div style={{width:2,height:36,background:"#f1f5f9",margin:"3px auto"}}/>}
                    </div>
                    <div style={{paddingBottom:18,flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                        <span style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{entry.action}</span>
                        <span style={{fontSize:11,color:"#94a3b8"}}>· {fmtDate(entry.date)}</span>
                      </div>
                      <div style={{fontSize:12.5,color:"#64748b"}}>{entry.detail}</div>
                      <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>by {entry.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="section-card">
              <div className="section-title">Summary</div>
              <div className="detail-row" style={{flexDirection:"column",gap:4}}>
                <span className="detail-label" style={{minWidth:"auto"}}>Priority</span>
                <span style={{fontWeight:700,color:pm.color,display:"flex",alignItems:"center",gap:5}}><span style={{width:7,height:7,borderRadius:"50%",background:pm.color,display:"inline-block"}}/>{requirement.priority}</span>
              </div>
              <div className="detail-row" style={{flexDirection:"column",gap:4}}>
                <span className="detail-label" style={{minWidth:"auto"}}>Status</span>
                <StatusBadge status={requirement.status}/>
              </div>
              <div className="detail-row" style={{flexDirection:"column",gap:6}}>
                <span className="detail-label" style={{minWidth:"auto"}}>Est. Value vs Budget</span>
                <span style={{fontWeight:700,color:"#059669",fontSize:16}}>{fmt(requirement.value)}</span>
                {requirement.budget>0&&(<>
                  <div style={{height:6,background:"#f1f5f9",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${budgetPct}%`,background:budgetPct>90?"#ef4444":"#10b981",borderRadius:3,transition:"width .5s"}}/>
                  </div>
                  <span style={{fontSize:11,color:"#94a3b8"}}>{budgetPct}% of {fmt(requirement.budget)} budget</span>
                </>)}
              </div>
            </div>

            <div className="section-card">
              <div className="section-title">Dates</div>
              {[["Created",fmtDate(requirement.created),false],["Start Date",fmtDate(requirement.startDate),false],["Due Date",fmtDate(requirement.due),overdue]].map(([label,val,warn])=>(
                <div key={label} className="detail-row" style={{flexDirection:"column",gap:4}}>
                  <span className="detail-label" style={{minWidth:"auto"}}>{label}</span>
                  <span style={{fontSize:13.5,color:warn?"#dc2626":"#1e293b",fontWeight:warn?700:400}}>{warn&&"⚠ "}{val}</span>
                </div>
              ))}
            </div>

            <div className="section-card">
              <div className="section-title">People</div>
              {[["Owner",requirement.owner],["Delivery Head",requirement.deliveryHead]].map(([label,name])=>(
                <div key={label} style={{padding:"10px 0",borderBottom:"1px solid #f8fafc"}}>
                  <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.6,marginBottom:6,fontWeight:600}}>{label}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:avatarColor(name),display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{initials(name)}</div>
                    <span style={{fontSize:13.5,color:"#1e293b",fontWeight:500}}>{name||"—"}</span>
                  </div>
                </div>
              ))}
            </div>

            {requirement.sow&&(
              <div className="section-card" style={{borderLeft:"3px solid #6366f1"}}>
                <div className="section-title">Linked Documents</div>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0"}}>
                  <span style={{fontSize:22}}>📄</span>
                  <div>
                    <div style={{fontSize:13,color:"#4f46e5",fontWeight:600,fontFamily:"monospace"}}>{requirement.sow}</div>
                    <div style={{fontSize:11,color:"#94a3b8"}}>Statement of Work</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ═══════════════ ROOT ROUTER ═══════════════ */
export default function App(){
  const [requirements,setRequirements]=useState(INITIAL_REQUIREMENTS);
  const [comments,setComments]=useState(COMMENTS_SEED);
  const [view,setView]=useState("list");
  const [activeId,setActiveId]=useState(null);
  const activeReq=requirements.find(r=>r.id===activeId);

  const handleSave=data=>{
    if(data.id){
      setRequirements(rs=>rs.map(r=>r.id===data.id?data:r));
    }else{
      const newId=`SR-${String(Math.max(...requirements.map(r=>parseInt(r.id.split("-")[1])))+1).padStart(4,"0")}`;
      setRequirements(rs=>[...rs,{...data,id:newId}]);
      setActiveId(newId);
    }
    setView(data.id?"detail":"detail");
    if(!data.id)setTimeout(()=>setActiveId(prev=>prev),0);
  };

  const handleSaveNew=data=>{
    const newId=`SR-${String(Math.max(...requirements.map(r=>parseInt(r.id.split("-")[1])))+1).padStart(4,"0")}`;
    const newReq={...data,id:newId};
    setRequirements(rs=>[...rs,newReq]);
    setActiveId(newId);
    setView("detail");
  };

  const handleCommentAdd=(reqId,comment)=>setComments(prev=>({...prev,[reqId]:[...(prev[reqId]||[]),comment]}));

  if(view==="list")return <RequirementsList requirements={requirements} onView={id=>{setActiveId(id);setView("detail");}} onEdit={id=>{setActiveId(id);setView("edit");}} onCreate={()=>{setActiveId(null);setView("create");}}/>;
  if(view==="create")return <RequirementForm requirement={null} onBack={()=>setView("list")} onSave={handleSaveNew}/>;
  if(view==="edit"&&activeReq)return <RequirementForm requirement={activeReq} onBack={()=>setView("detail")} onSave={data=>{setRequirements(rs=>rs.map(r=>r.id===data.id?data:r));setView("detail");}}/>;
  if(view==="detail"&&activeReq)return <RequirementDetail requirement={activeReq} allComments={comments} onBack={()=>setView("list")} onEdit={()=>setView("edit")} onCommentAdd={handleCommentAdd}/>;
  return null;
}
