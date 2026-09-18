import{S as u}from"./SearchSelect-Dw38eHCN.js";import"./lifecycle-D5JrVwsn.js";import"./render-CHUAUhUb.js";import"./utils-DosA2vOY.js";import"./if-0WVPJ3IP.js";import"./branches-hi3FbZvd.js";import"./each-PDs5jZh8.js";import"./attributes-BALAtxBo.js";import"./class-DwB8_mQf.js";import"./this-BtKAyv0G.js";import"./utils-CCsMBtsj.js";import"./props-kCI09qBY.js";import"./x-wNYCB7xJ.js";import"./svelte-element-DTBlWBSa.js";const d=[{value:"svelte",label:"Svelte 5"},{value:"react",label:"React 19"},{value:"vue",label:"Vue 3"},{value:"angular",label:"Angular"},{value:"nextjs",label:"Next.js"},{value:"astro",label:"Astro"},{value:"solid",label:"SolidJS"}],R={title:"Form/SearchSelect (Select2 / MultiSelect)",component:u,tags:["autodocs"],args:{options:d,placeholder:"Select framework...",searchPlaceholder:"Search framework (e.g. Svelte)..."}},e={args:{multiple:!1,value:"svelte"}},r={args:{multiple:!0,value:["svelte","react","nextjs"],placeholder:"Pick multiple frameworks..."}},t={args:{loading:!0,options:[],placeholder:"Fetching options from API..."}};var a,l,o;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    multiple: false,
    value: "svelte"
  }
}`,...(o=(l=e.parameters)==null?void 0:l.docs)==null?void 0:o.source}}};var s,c,i;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    multiple: true,
    value: ["svelte", "react", "nextjs"],
    placeholder: "Pick multiple frameworks..."
  }
}`,...(i=(c=r.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};var n,m,p;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    loading: true,
    options: [],
    placeholder: "Fetching options from API..."
  }
}`,...(p=(m=t.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const I=["SingleSelect","MultiSelect","RemoteLoading"];export{r as MultiSelect,t as RemoteLoading,e as SingleSelect,I as __namedExportsOrder,R as default};
