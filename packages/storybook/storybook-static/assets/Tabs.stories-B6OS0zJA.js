import{T as o,a as i,b as e,c as a}from"./index-totOn7k9.js";import"./lifecycle-D5JrVwsn.js";import"./props-kCI09qBY.js";import"./utils-CCsMBtsj.js";import"./class-DwB8_mQf.js";import"./use-presence-context-8RtOH84O.js";import"./if-0WVPJ3IP.js";import"./branches-hi3FbZvd.js";import"./svelte-element-DTBlWBSa.js";import"./attributes-BALAtxBo.js";import"./utils-DosA2vOY.js";import"./this-BtKAyv0G.js";import"./index-client-DKEyF-ei.js";import"./index-CMj3ooHx.js";const _={title:"Layout/Tabs",component:a,tags:["autodocs"],args:{value:"account"}},n={render:p=>({Component:a,props:p,children:[{Component:i,children:[{Component:o,props:{value:"account"},children:"Account"},{Component:o,props:{value:"password"},children:"Password"},{Component:o,props:{value:"settings"},children:"Settings"}]},{Component:e,props:{value:"account"},children:"Manage your account settings and personal preferences."},{Component:e,props:{value:"password"},children:"Change your password and secure your login credentials."},{Component:e,props:{value:"settings"},children:"Configure application notifications and display settings."}]})};var r,s,t;n.parameters={...n.parameters,docs:{...(r=n.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: args => ({
    Component: Tabs,
    props: args,
    children: [{
      Component: TabsList,
      children: [{
        Component: TabsTrigger,
        props: {
          value: "account"
        },
        children: "Account"
      }, {
        Component: TabsTrigger,
        props: {
          value: "password"
        },
        children: "Password"
      }, {
        Component: TabsTrigger,
        props: {
          value: "settings"
        },
        children: "Settings"
      }]
    }, {
      Component: TabsContent,
      props: {
        value: "account"
      },
      children: "Manage your account settings and personal preferences."
    }, {
      Component: TabsContent,
      props: {
        value: "password"
      },
      children: "Change your password and secure your login credentials."
    }, {
      Component: TabsContent,
      props: {
        value: "settings"
      },
      children: "Configure application notifications and display settings."
    }]
  })
}`,...(t=(s=n.parameters)==null?void 0:s.docs)==null?void 0:t.source}}};const S=["Default"];export{n as Default,S as __namedExportsOrder,_ as default};
