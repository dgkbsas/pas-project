import"../chunks/CWj6FrbW.js";import{k as Y,u as Z,r as ee,a3 as te,bn as ae,c as re,f as se,a as b,N as E,O as oe,P as $,Q as f,R as ie,T as v,af as le,a6 as ne,o as ce,ac as w,aa as de,a7 as L,aD as S,a2 as d,ad as ue,ag as N,ae as T,ah as B}from"../chunks/DXalFYC5.js";import{i as H}from"../chunks/DgS_HarA.js";import{a as pe,s as R}from"../chunks/CCesXY4h.js";import{i as me,a as fe,p as ve,b as he}from"../chunks/DboXdvGe.js";import{s as U}from"../chunks/ejPKeNiZ.js";import{B as be}from"../chunks/ey38HHQe.js";import{I as j}from"../chunks/DYUOFKwE.js";import{C as ge}from"../chunks/DD2hwmqD.js";import{l as _e,s as ye,p as J,r as we}from"../chunks/BkTacmYQ.js";import{l as $e}from"../chunks/Cd8NlkRe.js";import"../chunks/D3fhBnoc.js";import{I as xe,s as Ee}from"../chunks/Wd1UXAwi.js";import{E as Ae}from"../chunks/BM1HQ7Uf.js";function Me(s,a,n){Y(()=>{var i=Z(()=>a(s,n==null?void 0:n())||{});if(n&&(i!=null&&i.update)){var e=!1,o={};ee(()=>{var r=n();te(r),e&&ae(o,r)&&(o=r,i.update(r))}),e=!0}if(i!=null&&i.destroy)return()=>i.destroy()})}function Pe(s,a){const n=_e(a,["children","$$slots","$$events","$$legacy"]);/**
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
 */const i=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"}],["path",{d:"m2 2 20 20"}]];xe(s,ye({name:"eye-off"},()=>n,{get iconNode(){return i},children:(e,o)=>{var r=re(),c=se(r);Ee(c,a,"default",{}),b(e,r)},$$slots:{default:!0}}))}function ke(s){const a=JSON.parse(s);return a.data&&(a.data=ve(a.data,he.decoders)),a}function C(s){return HTMLElement.prototype.cloneNode.call(s)}function D(s,a=()=>{}){const n=async({action:e,result:o,reset:r=!0,invalidateAll:c=!0})=>{o.type==="success"&&(r&&HTMLFormElement.prototype.reset.call(s),c&&await me()),(location.origin+location.pathname===e.origin+e.pathname||o.type==="redirect"||o.type==="error")&&await fe(o)};async function i(e){var q,x,M;if(((q=e.submitter)!=null&&q.hasAttribute("formmethod")?e.submitter.formMethod:C(s).method)!=="post")return;e.preventDefault();const r=new URL((x=e.submitter)!=null&&x.hasAttribute("formaction")?e.submitter.formAction:C(s).action),c=(M=e.submitter)!=null&&M.hasAttribute("formenctype")?e.submitter.formEnctype:C(s).enctype,_=new FormData(s,e.submitter),h=new AbortController;let y=!1;const g=await a({action:r,cancel:()=>y=!0,controller:h,formData:_,formElement:s,submitter:e.submitter})??n;if(y)return;let p;try{const l=new Headers({accept:"application/json","x-sveltekit-action":"true"});c!=="multipart/form-data"&&l.set("Content-Type",/^(:?application\/x-www-form-urlencoded|text\/plain)$/.test(c)?c:"application/x-www-form-urlencoded");const P=c==="multipart/form-data"?_:new URLSearchParams(_),k=await fetch(r,{method:"POST",headers:l,cache:"no-store",body:P,signal:h.signal});p=ke(await k.text()),p.type==="error"&&(p.status=k.status)}catch(l){if((l==null?void 0:l.name)==="AbortError")return;p={type:"error",error:l}}await g({action:r,formData:_,formElement:s,update:l=>n({action:r,result:p,reset:l==null?void 0:l.reset,invalidateAll:l==null?void 0:l.invalidateAll}),result:p})}return HTMLFormElement.prototype.addEventListener.call(s,"submit",i),{destroy(){HTMLFormElement.prototype.removeEventListener.call(s,"submit",i)}}}var Le=E('<span class="required svelte-1uz2vuh">*</span>'),Te=E("<label><!> <!></label>");function Q(s,a){let n=J(a,"required",3,!1),i=J(a,"class",3,""),e=we(a,["$$slots","$$events","$$legacy","required","class","children"]);var o=Te();pe(o,()=>({class:`label ${i()??""}`,...e}),void 0,void 0,"svelte-1uz2vuh");var r=f(o);oe(r,()=>a.children??ie);var c=$(r,2);{var _=h=>{var y=Le();b(h,y)};H(c,h=>{n()&&h(_)})}v(o),b(s,o)}var qe=E('<div class="header-content svelte-1i2smtp"><div class="logo svelte-1i2smtp"><img alt="Logo" height="48" class="svelte-1i2smtp"/> <span class="logo-text svelte-1i2smtp">PAS Manager</span></div> <p class="subtitle svelte-1i2smtp">Accede a tu cuenta</p></div>'),ze=E('<div class="error-banner svelte-1i2smtp"><p class="svelte-1i2smtp"> </p></div>'),Ie=(s,a)=>w(a,!d(a)),Ne=E('<form method="POST" action="?/login" class="form svelte-1i2smtp"><!> <div class="form-group svelte-1i2smtp"><!> <!></div> <div class="form-group svelte-1i2smtp"><!> <div class="password-input-wrapper svelte-1i2smtp"><!> <button type="button" class="password-toggle svelte-1i2smtp"><!></button></div></div> <!></form>'),Se=E('<div class="auth-container fade-in svelte-1i2smtp"><!></div>');function We(s,a){ne(a,!0);let n=L(""),i=L(""),e=L(!1),o=L(!1),r=L("");ce(()=>{var h;(h=a.form)!=null&&h.message&&(w(r,a.form.message,!0),U({type:"error",message:a.form.message}))});var c=Se(),_=f(c);ge(_,{class:"auth-card",header:y=>{var A=qe(),g=f(A),p=f(g);T(2),v(g),T(2),v(A),N(()=>R(p,"src",$e)),b(y,A)},children:(y,A)=>{var g=Ne(),p=f(g);{var q=t=>{var m=ze(),u=f(m),I=f(u,!0);v(u),v(m),N(()=>B(I,d(r))),b(t,m)};H(p,t=>{d(r)&&t(q)})}var x=$(p,2),M=f(x);Q(M,{for:"email",required:!0,children:(t,m)=>{T();var u=S("Email");b(t,u)},$$slots:{default:!0}});var l=$(M,2);j(l,{id:"email",name:"email",type:"email",placeholder:"tu@email.com",get disabled(){return d(e)},required:!0,get value(){return d(n)},set value(t){w(n,t,!0)}}),v(x);var P=$(x,2),k=f(P);Q(k,{for:"password",required:!0,children:(t,m)=>{T();var u=S("Contraseña");b(t,u)},$$slots:{default:!0}});var O=$(k,2),F=f(O);{let t=ue(()=>d(o)?"text":"password");j(F,{id:"password",name:"password",get type(){return d(t)},placeholder:"••••••••",get disabled(){return d(e)},required:!0,class:"password-input",get value(){return d(i)},set value(m){w(i,m,!0)}})}var z=$(F,2);z.__click=[Ie,o];var G=f(z);{var K=t=>{Pe(t,{size:18})},V=t=>{Ae(t,{size:18})};H(G,t=>{d(o)?t(K):t(V,!1)})}v(z),v(O),v(P);var W=$(P,2);be(W,{type:"submit",class:"w-full",get loading(){return d(e)},get disabled(){return d(e)},children:(t,m)=>{T();var u=S();N(()=>B(u,d(e)?"Iniciando sesión...":"Iniciar Sesión")),b(t,u)},$$slots:{default:!0}}),v(g),Me(g,(t,m)=>D==null?void 0:D(t,m),()=>()=>(w(e,!0),w(r,""),async({result:t,update:m})=>{var u,I;w(e,!1),t.type==="success"&&((u=t.data)!=null&&u.success)?(U({type:"success",message:"¡Bienvenido!"}),await new Promise(X=>setTimeout(X,1e3)),window.location.href="/dashboard"):t.type==="failure"&&w(r,((I=t.data)==null?void 0:I.message)||"Error al iniciar sesión",!0)})),N(()=>R(z,"aria-label",d(o)?"Ocultar contraseña":"Mostrar contraseña")),b(y,g)},$$slots:{header:!0,default:!0}}),v(c),b(s,c),de()}le(["click"]);export{We as component};
