import{K as w}from"./KanbanBoard-CfSnu3am.js";import"./lifecycle-D5JrVwsn.js";import"./render-CHUAUhUb.js";import"./utils-DosA2vOY.js";import"./if-0WVPJ3IP.js";import"./branches-hi3FbZvd.js";import"./each-PDs5jZh8.js";import"./attributes-BALAtxBo.js";import"./class-DwB8_mQf.js";import"./input-D7sgznK8.js";import"./this-BtKAyv0G.js";import"./utils-CCsMBtsj.js";import"./badge-Z0NBSzYF.js";import"./index-CMj3ooHx.js";import"./svelte-element-DTBlWBSa.js";import"./Button-CKYvUoYm.js";import"./toolbar-overflow-B-Qqs6Ww.js";import"./props-kCI09qBY.js";import"./index-C8-d_rLC.js";import"./use-presence-context-8RtOH84O.js";import"./index-client-DKEyF-ei.js";import"./x-wNYCB7xJ.js";import"./index-totOn7k9.js";import"./SearchSelect-Dw38eHCN.js";import"./chevron-right-qMbRDPG5.js";import"./CardFooter-0qIncqg5.js";import"./QRCode-TTX_btiy.js";import"./_commonjsHelpers-CqkleIqs.js";import"./Barcode-CZzrK7IG.js";import"./utils-yarKyh02.js";import"./triangle-alert-ZyCb-XD2.js";import"./plus-tD5Ocemn.js";import"./grip-vertical-_S2fCJB6.js";import"./chevron-down-D2_Fp8xg.js";import"./x-CUx0NlTo.js";const y=[{id:"backlog",title:"Backlog",color:"#6b7280"},{id:"todo",title:"To Do",color:"#3b82f6"},{id:"in-progress",title:"In Progress",color:"#f59e0b",wipLimit:3},{id:"review",title:"Review",color:"#8b5cf6"},{id:"done",title:"Done",color:"#10b981"}],f=[{id:"c1",columnId:"backlog",title:"Research auth providers",description:"Evaluate OAuth providers for SSO integration",tags:["research"],priority:"low",assignee:"Alice"},{id:"c2",columnId:"backlog",title:"Database schema migration",description:"Plan v2 schema changes",tags:["backend","db"],priority:"medium",assignee:"Bob"},{id:"c3",columnId:"todo",title:"Implement dark mode toggle",description:"Add theme switcher to settings page",tags:["frontend","ui"],priority:"high",assignee:"Carol"},{id:"c4",columnId:"todo",title:"API rate limiting",description:"Add rate limiting middleware",tags:["backend"],priority:"medium"},{id:"c5",columnId:"in-progress",title:"Dashboard redesign",description:"New layout with sidebar navigation",tags:["frontend","ui"],priority:"high",assignee:"Alice",labels:[{text:"Sprint 5",color:"#2563eb"}]},{id:"c6",columnId:"in-progress",title:"Fix login timeout bug",description:"Session expires too quickly on mobile",tags:["bug"],priority:"high",assignee:"Bob",labels:[{text:"Urgent",color:"#ef4444"}]},{id:"c7",columnId:"review",title:"Update README docs",description:"Add getting started guide",tags:["docs"],priority:"low",assignee:"Carol"},{id:"c8",columnId:"done",title:"Setup CI/CD pipeline",description:"GitHub Actions for auto deploy",tags:["devops"],priority:"medium",assignee:"Dave"}],oi={title:"Kanban/KanbanBoard",component:w,tags:["autodocs"],args:{columns:y,cards:f}},o={},t={args:{columns:y.map(i=>({...i,wipLimit:i.id==="in-progress"?2:void 0}))}},r={args:{swimlaneBy:"priority"}},e={args:{cards:f.map(i=>({...i,labels:i.labels??(i.priority==="high"?[{text:"P1",color:"#ef4444"}]:i.priority==="medium"?[{text:"P2",color:"#f59e0b"}]:[{text:"P3",color:"#6b7280"}])}))}};var s,a,n;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:"{}",...(n=(a=o.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};var c,m,p;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    columns: columns.map(c => ({
      ...c,
      wipLimit: c.id === "in-progress" ? 2 : undefined
    }))
  }
}`,...(p=(m=t.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var d,l,g;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    swimlaneBy: "priority"
  }
}`,...(g=(l=r.parameters)==null?void 0:l.docs)==null?void 0:g.source}}};var u,b,h;e.parameters={...e.parameters,docs:{...(u=e.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    cards: cards.map(c => ({
      ...c,
      labels: c.labels ?? (c.priority === "high" ? [{
        text: "P1",
        color: "#ef4444"
      }] : c.priority === "medium" ? [{
        text: "P2",
        color: "#f59e0b"
      }] : [{
        text: "P3",
        color: "#6b7280"
      }])
    }))
  }
}`,...(h=(b=e.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};const ti=["Default","WithWipLimits","WithSwimlanes","WithLabels"];export{o as Default,e as WithLabels,r as WithSwimlanes,t as WithWipLimits,ti as __namedExportsOrder,oi as default};
