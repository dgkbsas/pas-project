import"./CWj6FrbW.js";import"./D3fhBnoc.js";import{c as W,f as w,a as b,a6 as D,N as k,ag as y,aa as H,Q as p,P as Q,T as c,a2 as s,u as h,a3 as j,ah as A,aE as B}from"./DXalFYC5.js";import{I as C,s as q}from"./Wd1UXAwi.js";import{l as F,s as G,p as d}from"./BkTacmYQ.js";import{c as I}from"./P-h-QmmT.js";import{e as J,s as _,i as K}from"./CCesXY4h.js";import{s as N}from"./CiAFSiaO.js";import{i as L}from"./CDduCnYr.js";function sa(v,e){const n=F(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const l=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"}]];C(v,G({name:"square-pen"},()=>n,{get iconNode(){return l},children:(f,g)=>{var o=W(),u=w(o);q(u,e,"default",{}),b(f,o)},$$slots:{default:!0}}))}var O=k('<button type="button" role="tab"> </button>'),R=k('<div><div class="tabs-list svelte-h216gr" role="tablist"></div> <div class="tabs-content svelte-h216gr" role="tabpanel"><!></div></div>');function ia(v,e){D(e,!1);let n=d(e,"tabs",24,()=>[]),l=d(e,"activeTab",12,""),f=d(e,"variant",8,"line"),g=d(e,"size",8,"md"),o=d(e,"fullWidth",8,!1);const u=I();function E(i){var a;(a=n().find(t=>t.id===i))!=null&&a.disabled||(l(i),u("change",i))}L();var r=R();let T;var m=p(r);J(m,5,n,K,(i,a)=>{var t=O();let x;var P=p(t,!0);c(t),y(S=>{x=N(t,1,"tab svelte-h216gr",null,x,S),_(t,"aria-selected",(j(l()),s(a),h(()=>l()===s(a).id))),t.disabled=(s(a),h(()=>s(a).disabled)),A(P,(s(a),h(()=>s(a).label)))},[()=>({active:l()===s(a).id,disabled:s(a).disabled})]),B("click",t,()=>E(s(a).id)),b(i,t)}),c(m);var z=Q(m,2),M=p(z);q(M,e,"default",{}),c(z),c(r),y(i=>{T=N(r,1,"tabs svelte-h216gr",null,T,i),_(r,"data-variant",f()),_(r,"data-size",g())},[()=>({"full-width":o()})]),b(v,r),H()}export{sa as S,ia as T};
