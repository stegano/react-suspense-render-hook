/*! For license information please see index.js.LICENSE.txt */
define(["react"],(e=>(()=>{"use strict";var r={251:(e,r,t)=>{var o=t(650),n=Symbol.for("react.element"),s=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),d=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};r.jsx=function(e,r,t){var o,u={},c=null,i=null;for(o in void 0!==t&&(c=""+t),void 0!==r.key&&(c=""+r.key),void 0!==r.ref&&(i=r.ref),r)s.call(r,o)&&!a.hasOwnProperty(o)&&(u[o]=r[o]);if(e&&e.defaultProps)for(o in r=e.defaultProps)void 0===u[o]&&(u[o]=r[o]);return{$$typeof:n,type:e,key:c,ref:i,props:u,_owner:d.current}}},893:(e,r,t)=>{e.exports=t(251)},650:r=>{r.exports=e}},t={};function o(e){var n=t[e];if(void 0!==n)return n.exports;var s=t[e]={exports:{}};return r[e](s,s.exports,o),s.exports}o.d=(e,r)=>{for(var t in r)o.o(r,t)&&!o.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},o.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return(()=>{o.r(n),o.d(n,{ISuspenseRender:()=>e,ISuspenseRenderProvider:()=>r,SuspenseRenderContext:()=>a,SuspenseRenderProvider:()=>u,useSuspenseRender:()=>c});var e={};o.r(e),o.d(e,{Status:()=>t});var r={};o.r(r);var t,s=o(650);!function(e){e[e.Pending=0]="Pending",e[e.Resolved=1]="Resolved",e[e.Rejected=2]="Rejected"}(t||(t={}));var d=o(893);const a=(0,s.createContext)({}),u=function({children:e,loading:r,error:t}){const o=(0,s.useMemo)((()=>({loading:r,error:t})),[t,r]);return(0,d.jsx)(a.Provider,{value:o,children:e})},c=e=>{const[r,o]=(0,s.useState)(t.Pending),[n,d]=(0,s.useState)(void 0),[u,c]=(0,s.useState)(void 0),i=(0,s.useContext)(a);(0,s.useEffect)((()=>{e().then((e=>{o(t.Resolved),d(e)})).catch((e=>{o(t.Rejected),c(e)}))}),[e]);const l=(0,s.useCallback)((()=>{o(t.Pending),e().then((e=>{o(t.Resolved),d(e)})).catch((e=>{o(t.Rejected),c(e)}))}),[e]);return[(0,s.useCallback)(((e,o=i.loading||e,n=i.error)=>{switch(r){case t.Resolved:return e;case t.Rejected:if(void 0===n)throw u;return n;case t.Pending:default:return o}}),[i.error,i.loading,u,r]),l,n,u]}})(),n})()));