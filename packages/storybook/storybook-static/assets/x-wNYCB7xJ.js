import{aX as I,i as L,a as k,p as P,b as X,s as h,d as _,u as B,k as M,aY as Y,h as Z,c as q,f as D,j as u,r as E,aZ as F}from"./lifecycle-D5JrVwsn.js";import{s as G}from"./props-kCI09qBY.js";import{e as H,i as J}from"./each-PDs5jZh8.js";import{e as K}from"./svelte-element-DTBlWBSa.js";import{d as b}from"./attributes-BALAtxBo.js";/**
 * @file
 * @license @lucide/svelte v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @file
 * @license @lucide/svelte v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};/**
 * @file
 * @license @lucide/svelte v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=Symbol("lucide-context"),T=()=>I(R);var U=Y("<svg><!><!></svg>");function V(e,t){X(t,!1);const i=()=>h(a,"$props",o),n=()=>h(derived,"$derived",o),[o,c]=_(),s=T()??{},{name:m,color:w=s.color??"currentColor",size:d=s.size??24,strokeWidth:f=s.strokeWidth??2,absoluteStrokeWidth:x=s.absoluteStrokeWidth??!1,iconNode:W=[],children:r,...a}=i()(),C=n()(x?Number(f)*24/Number(d):f);L();var p=U();b(p,l=>({...O,...l,...a,width:d,height:d,stroke:w,"stroke-width":C,class:B(()=>["lucide-icon lucide",s.class,m&&`lucide-${m}`,a.class])}),[()=>!r&&!Q(a)&&{"aria-hidden":"true"}]);var $=Z(p);H($,1,()=>W,J,(l,y)=>{var g=E(()=>F(u(y),2));let S=()=>u(g)[0],j=()=>u(g)[1];var v=q(),z=D(v);K(z,S,!0,(A,tt)=>{b(A,()=>({...j()}))}),k(l,v)});var N=M($);r==null||r(N),k(e,p),P(),c()}function it(e){const t=()=>h(o,"$props",i),[i,n]=_();let o=t()();const c=[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]];V(e,G({name:"x"},()=>o,{get iconNode(){return c}})),n()}export{V as I,it as X};
