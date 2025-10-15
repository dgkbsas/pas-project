import"../chunks/CWj6FrbW.js";import{o as Y,u as Z,q as ee,a4 as te,bm as ae,c as re,f as se,a as b,b as E,s as oe,U as $,d as f,n as ie,r as v,ag as le,a7 as ne,B as ce,ad as w,ab as de,a8 as L,ak as C,a3 as d,ae as ue,t as S,af as P,ah as O}from"../chunks/dGHTYzhB.js";import{i as B}from"../chunks/_danfitL.js";import{a as me,s as U}from"../chunks/X3gEIfGK.js";import{i as pe,a as fe,p as ve,b as he}from"../chunks/DmrR99iC.js";import{s as R}from"../chunks/CXhoiRHA.js";import{B as be}from"../chunks/DOI_CNwM.js";import{I as j}from"../chunks/CFvsllsx.js";import{C as ge}from"../chunks/D80h1qkp.js";import{l as _e,s as ye,p as J,r as we}from"../chunks/pnKjlpSc.js";import{l as $e}from"../chunks/Cd8NlkRe.js";import"../chunks/Bf0aZHXT.js";import{I as xe,s as Ee}from"../chunks/DblrYRE4.js";import{E as Ae}from"../chunks/Du7u80LR.js";function Me(s,a,n){Y(()=>{var i=Z(()=>a(s,n==null?void 0:n())||{});if(n&&(i!=null&&i.update)){var e=!1,o={};ee(()=>{var r=n();te(r),e&&ae(o,r)&&(o=r,i.update(r))}),e=!0}if(i!=null&&i.destroy)return()=>i.destroy()})}function ke(s,a){const n=_e(a,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.545.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const i=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"}],["path",{d:"m2 2 20 20"}]];xe(s,ye({name:"eye-off"},()=>n,{get iconNode(){return i},children:(e,o)=>{var r=re(),c=se(r);Ee(c,a,"default",{}),b(e,r)},$$slots:{default:!0}}))}function qe(s){const a=JSON.parse(s);return a.data&&(a.data=ve(a.data,he.decoders)),a}function H(s){return HTMLElement.prototype.cloneNode.call(s)}function N(s,a=()=>{}){const n=async({action:e,result:o,reset:r=!0,invalidateAll:c=!0})=>{o.type==="success"&&(r&&HTMLFormElement.prototype.reset.call(s),c&&await pe()),(location.origin+location.pathname===e.origin+e.pathname||o.type==="redirect"||o.type==="error")&&await fe(o)};async function i(e){var T,x,M;if(((T=e.submitter)!=null&&T.hasAttribute("formmethod")?e.submitter.formMethod:H(s).method)!=="post")return;e.preventDefault();const r=new URL((x=e.submitter)!=null&&x.hasAttribute("formaction")?e.submitter.formAction:H(s).action),c=(M=e.submitter)!=null&&M.hasAttribute("formenctype")?e.submitter.formEnctype:H(s).enctype,_=new FormData(s,e.submitter),h=new AbortController;let y=!1;const g=await a({action:r,cancel:()=>y=!0,controller:h,formData:_,formElement:s,submitter:e.submitter})??n;if(y)return;let m;try{const l=new Headers({accept:"application/json","x-sveltekit-action":"true"});c!=="multipart/form-data"&&l.set("Content-Type",/^(:?application\/x-www-form-urlencoded|text\/plain)$/.test(c)?c:"application/x-www-form-urlencoded");const k=c==="multipart/form-data"?_:new URLSearchParams(_),q=await fetch(r,{method:"POST",headers:l,cache:"no-store",body:k,signal:h.signal});m=qe(await q.text()),m.type==="error"&&(m.status=q.status)}catch(l){if((l==null?void 0:l.name)==="AbortError")return;m={type:"error",error:l}}await g({action:r,formData:_,formElement:s,update:l=>n({action:r,result:m,reset:l==null?void 0:l.reset,invalidateAll:l==null?void 0:l.invalidateAll}),result:m})}return HTMLFormElement.prototype.addEventListener.call(s,"submit",i),{destroy(){HTMLFormElement.prototype.removeEventListener.call(s,"submit",i)}}}var Le=E('<span class="required svelte-1uz2vuh">*</span>'),Pe=E("<label><!> <!></label>");function G(s,a){let n=J(a,"required",3,!1),i=J(a,"class",3,""),e=we(a,["$$slots","$$events","$$legacy","required","class","children"]);var o=Pe();me(o,()=>({class:`label ${i()??""}`,...e}),void 0,void 0,"svelte-1uz2vuh");var r=f(o);oe(r,()=>a.children??ie);var c=$(r,2);{var _=h=>{var y=Le();b(h,y)};B(c,h=>{n()&&h(_)})}v(o),b(s,o)}var Te=E('<div class="header-content svelte-1i2smtp"><div class="logo svelte-1i2smtp"><img alt="Logo" height="48" class="svelte-1i2smtp"/> <span class="logo-text svelte-1i2smtp">PAS Manager</span></div> <p class="subtitle svelte-1i2smtp">Accede a tu cuenta</p></div>'),ze=E('<div class="error-banner svelte-1i2smtp"><p class="svelte-1i2smtp"> </p></div>'),Ie=(s,a)=>w(a,!d(a)),Se=E('<form method="POST" action="?/login" class="form svelte-1i2smtp"><!> <div class="form-group svelte-1i2smtp"><!> <!></div> <div class="form-group svelte-1i2smtp"><!> <div class="password-input-wrapper svelte-1i2smtp"><!> <button type="button" class="password-toggle svelte-1i2smtp"><!></button></div></div> <!></form>'),Ce=E('<div class="auth-container fade-in svelte-1i2smtp"><!></div>');function We(s,a){ne(a,!0);let n=L(""),i=L(""),e=L(!1),o=L(!1),r=L("");ce(()=>{var h;(h=a.form)!=null&&h.message&&(w(r,a.form.message,!0),R({type:"error",message:a.form.message}))});var c=Ce(),_=f(c);ge(_,{class:"auth-card",header:y=>{var A=Te(),g=f(A),m=f(g);P(2),v(g),P(2),v(A),S(()=>U(m,"src",$e)),b(y,A)},children:(y,A)=>{var g=Se(),m=f(g);{var T=t=>{var p=ze(),u=f(p),I=f(u,!0);v(u),v(p),S(()=>O(I,d(r))),b(t,p)};B(m,t=>{d(r)&&t(T)})}var x=$(m,2),M=f(x);G(M,{for:"email",required:!0,children:(t,p)=>{P();var u=C("Email");b(t,u)},$$slots:{default:!0}});var l=$(M,2);j(l,{id:"email",name:"email",type:"email",placeholder:"tu@email.com",get disabled(){return d(e)},required:!0,get value(){return d(n)},set value(t){w(n,t,!0)}}),v(x);var k=$(x,2),q=f(k);G(q,{for:"password",required:!0,children:(t,p)=>{P();var u=C("Contraseña");b(t,u)},$$slots:{default:!0}});var D=$(q,2),F=f(D);{let t=ue(()=>d(o)?"text":"password");j(F,{id:"password",name:"password",get type(){return d(t)},placeholder:"••••••••",get disabled(){return d(e)},required:!0,class:"password-input",get value(){return d(i)},set value(p){w(i,p,!0)}})}var z=$(F,2);z.__click=[Ie,o];var K=f(z);{var Q=t=>{ke(t,{size:18})},V=t=>{Ae(t,{size:18})};B(K,t=>{d(o)?t(Q):t(V,!1)})}v(z),v(D),v(k);var W=$(k,2);be(W,{type:"submit",class:"w-full",get loading(){return d(e)},get disabled(){return d(e)},children:(t,p)=>{P();var u=C();S(()=>O(u,d(e)?"Iniciando sesión...":"Iniciar Sesión")),b(t,u)},$$slots:{default:!0}}),v(g),Me(g,(t,p)=>N==null?void 0:N(t,p),()=>()=>(w(e,!0),w(r,""),async({result:t,update:p})=>{var u,I;w(e,!1),t.type==="success"&&((u=t.data)!=null&&u.success)?(R({type:"success",message:"¡Bienvenido!"}),await new Promise(X=>setTimeout(X,1e3)),window.location.href="/dashboard"):t.type==="failure"&&w(r,((I=t.data)==null?void 0:I.message)||"Error al iniciar sesión",!0)})),S(()=>U(z,"aria-label",d(o)?"Ocultar contraseña":"Mostrar contraseña")),b(y,g)},$$slots:{header:!0,default:!0}}),v(c),b(s,c),de()}le(["click"]);export{We as component};
