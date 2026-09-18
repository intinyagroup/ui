import{D as h}from"./TreeGrid-CLwMb2pe.js";import"./lifecycle-D5JrVwsn.js";import"./render-CHUAUhUb.js";import"./utils-DosA2vOY.js";import"./if-0WVPJ3IP.js";import"./branches-hi3FbZvd.js";import"./each-PDs5jZh8.js";import"./attributes-BALAtxBo.js";import"./class-DwB8_mQf.js";import"./this-BtKAyv0G.js";import"./badge-Z0NBSzYF.js";import"./index-CMj3ooHx.js";import"./svelte-element-DTBlWBSa.js";import"./utils-CCsMBtsj.js";import"./Button-CKYvUoYm.js";import"./input-D7sgznK8.js";import"./toolbar-overflow-B-Qqs6Ww.js";import"./props-kCI09qBY.js";import"./index-C8-d_rLC.js";import"./use-presence-context-8RtOH84O.js";import"./index-client-DKEyF-ei.js";import"./x-wNYCB7xJ.js";import"./index-totOn7k9.js";import"./SearchSelect-Dw38eHCN.js";import"./chevron-right-qMbRDPG5.js";import"./CardFooter-0qIncqg5.js";import"./QRCode-TTX_btiy.js";import"./_commonjsHelpers-CqkleIqs.js";import"./Barcode-CZzrK7IG.js";import"./trash-2-ierFM7Cx.js";import"./grip-vertical-_S2fCJB6.js";import"./chevron-left-OGjglLCP.js";import"./x-CUx0NlTo.js";import"./search-DjBTE3-y.js";import"./chevron-down-D2_Fp8xg.js";import"./file-text-DnBJXGlJ.js";import"./plus-tD5Ocemn.js";const b=[{id:"1",name:"Joshua",email:"joshua@intinya.dev",role:"Lead Architect",status:"Active",department:"Core Engineering",joinedDate:"12 Jan 2024"},{id:"2",name:"Budi Santoso",email:"budi@intinya.dev",role:"Senior Developer",status:"Active",department:"Frontend Platform",joinedDate:"01 Mar 2024"},{id:"3",name:"Siti Rahma",email:"siti@intinya.dev",role:"UI/UX Designer",status:"Pending",department:"Design Systems",joinedDate:"15 Apr 2024"},{id:"4",name:"Alex Wong",email:"alex@intinya.dev",role:"Product Manager",status:"Inactive",department:"Product Ops",joinedDate:"20 May 2024"},{id:"5",name:"Dewi Lestari",email:"dewi@intinya.dev",role:"Frontend Engineer",status:"Active",department:"Web Experience",joinedDate:"10 Jun 2024"}],y=[{accessorKey:"name",header:"Name"},{accessorKey:"email",header:"Email"},{accessorKey:"role",header:"Role"},{accessorKey:"department",header:"Department"},{accessorKey:"status",header:"Status"}],re={title:"Data/DataTable",component:h,tags:["autodocs"],args:{data:b,columns:y,title:"Users Management",description:"Enterprise data table with server-side support, sorting, and export",searchable:!0,exportable:!0,selectable:!0,densityToggle:!0,columnToggle:!0,pageSize:10}},e={},t={args:{quickFilters:[{id:"status",label:"Active Only",value:"Active"},{id:"status",label:"Pending Only",value:"Pending"},{id:"department",label:"Engineering Only",value:"Core Engineering"}]}},r={args:{pinnedRowIds:["1"],description:"First row (Joshua - Lead Architect) is frozen at the top"}},a={args:{mobileCardView:!0,expandable:!0,description:"Resize viewport to mobile (< 640px) to see automatic transformation into stacked card layout without horizontal overflow"}};var i,o,n;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:"{}",...(n=(o=e.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};var s,m,p;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    quickFilters: [{
      id: "status",
      label: "Active Only",
      value: "Active"
    }, {
      id: "status",
      label: "Pending Only",
      value: "Pending"
    }, {
      id: "department",
      label: "Engineering Only",
      value: "Core Engineering"
    }]
  }
}`,...(p=(m=t.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var d,c,l;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    pinnedRowIds: ["1"],
    description: "First row (Joshua - Lead Architect) is frozen at the top"
  }
}`,...(l=(c=r.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var u,g,v;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    mobileCardView: true,
    expandable: true,
    description: "Resize viewport to mobile (< 640px) to see automatic transformation into stacked card layout without horizontal overflow"
  }
}`,...(v=(g=a.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const ae=["Default","WithQuickFilters","WithPinnedRows","MobileCardViewResponsive"];export{e as Default,a as MobileCardViewResponsive,r as WithPinnedRows,t as WithQuickFilters,ae as __namedExportsOrder,re as default};
