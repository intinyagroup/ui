import{C as a,a as n,b as y,c as T,d as F,e as H}from"./CardFooter-0qIncqg5.js";import"./lifecycle-D5JrVwsn.js";import"./attributes-BALAtxBo.js";import"./utils-DosA2vOY.js";import"./class-DwB8_mQf.js";import"./utils-CCsMBtsj.js";const N={title:"Layout/Card",component:n,tags:["autodocs"]},e={render:D=>({Component:n,props:D,children:"Card content"})},r={render:()=>({Component:n,children:[{Component:F,children:[{Component:y,children:"Card Title"},{Component:T,children:"Card description goes here."}]},{Component:a,children:"This is the card body."}]})},o={render:()=>({Component:n,children:[{Component:a,children:"Only content inside this card."}]})},t={render:()=>({Component:n,children:[{Component:F,children:[{Component:y,children:"Notifications"},{Component:T,children:"You have 3 unread messages."}]},{Component:a,children:"Manage your notification preferences."},{Component:H,children:"Footer actions"}]})};var d,i,s;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: args => ({
    Component: Card,
    props: args,
    children: "Card content"
  })
}`,...(s=(i=e.parameters)==null?void 0:i.docs)==null?void 0:s.source}}};var c,p,C;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => ({
    Component: Card,
    children: [{
      Component: CardHeader,
      children: [{
        Component: CardTitle,
        children: "Card Title"
      }, {
        Component: CardDescription,
        children: "Card description goes here."
      }]
    }, {
      Component: CardContent,
      children: "This is the card body."
    }]
  })
}`,...(C=(p=r.parameters)==null?void 0:p.docs)==null?void 0:C.source}}};var m,l,h;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => ({
    Component: Card,
    children: [{
      Component: CardContent,
      children: "Only content inside this card."
    }]
  })
}`,...(h=(l=o.parameters)==null?void 0:l.docs)==null?void 0:h.source}}};var u,g,f;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => ({
    Component: Card,
    children: [{
      Component: CardHeader,
      children: [{
        Component: CardTitle,
        children: "Notifications"
      }, {
        Component: CardDescription,
        children: "You have 3 unread messages."
      }]
    }, {
      Component: CardContent,
      children: "Manage your notification preferences."
    }, {
      Component: CardFooter,
      children: "Footer actions"
    }]
  })
}`,...(f=(g=t.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};const W=["Default","WithHeader","Content","Footer"];export{o as Content,e as Default,t as Footer,r as WithHeader,W as __namedExportsOrder,N as default};
