/*! For license information please see index.js.LICENSE.txt */
!function(e,r){if("object"==typeof exports&&"object"==typeof module)module.exports=r(require("react"));else if("function"==typeof define&&define.amd)define(["react"],r);else{var t="object"==typeof exports?r(require("react")):r(e.react);for(var o in t)("object"==typeof exports?exports:e)[o]=t[o]}}(global,(e=>(()=>{"use strict";var r={251:(e,r,t)=>{var o=t(156),n=Symbol.for("react.element"),s=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),a=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};r.jsx=function(e,r,t){var o,c={},i=null,d=null;for(o in void 0!==t&&(i=""+t),void 0!==r.key&&(i=""+r.key),void 0!==r.ref&&(d=r.ref),r)s.call(r,o)&&!u.hasOwnProperty(o)&&(c[o]=r[o]);if(e&&e.defaultProps)for(o in r=e.defaultProps)void 0===c[o]&&(c[o]=r[o]);return{$$typeof:n,type:e,key:i,ref:d,props:c,_owner:a.current}}},893:(e,r,t)=>{e.exports=t(251)},156:r=>{r.exports=e}},t={};function o(e){var n=t[e];if(void 0!==n)return n.exports;var s=t[e]={exports:{}};return r[e](s,s.exports,o),s.exports}o.d=(e,r)=>{for(var t in r)o.o(r,t)&&!o.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},o.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return(()=>{o.r(n),o.d(n,{ISuspenseRender:()=>e,ISuspenseRenderProvider:()=>r,SuspenseRenderContext:()=>u,SuspenseRenderProvider:()=>c,useSuspenseRender:()=>i});var e={};o.r(e),o.d(e,{TaskStatus:()=>t});var r={};o.r(r);var t,s=o(156);!function(e){e[e.PENDING=0]="PENDING",e[e.RESOLVED=1]="RESOLVED",e[e.REJECTED=2]="REJECTED"}(t||(t={}));var a=o(893);const u=(0,s.createContext)({}),c=function({children:e,renderSuccess:r,renderLoading:t,renderError:o,experimentals:n}){const c=(0,s.useMemo)((()=>({renderSuccess:r,renderLoading:t,renderError:o,experimentals:n})),[o,t,r,n]);return(0,a.jsx)(u.Provider,{value:c,children:e})},i=(e={})=>{const[r,o]=(0,s.useState)({status:"defaultData"in e?t.RESOLVED:t.PENDING}),n=(0,s.useContext)(u),a=(0,s.useCallback)((async(e,r)=>{try{const s=n.experimentals?.taskRunnerInterceptors;if(s){let n;for(const a of s){n=a(await n,e,r);const s=n instanceof Promise?n:void 0;o({status:t.PENDING,promise:s})}const a=await n;return o({status:t.RESOLVED,data:a}),a}const a=e(),u=a instanceof Promise?a:void 0;o({status:t.PENDING,promise:u});const c=await a;return o({status:t.RESOLVED,data:c}),c}catch(e){const r=e;return o({status:t.REJECTED,error:r}),r}}),[n]);return[(0,s.useCallback)(((o,s,a)=>{const{data:u,status:c,error:i,promise:d}=r;switch(c){case t.RESOLVED:{const r=(o??n.renderSuccess)||null;return"function"==typeof r?r(u??e.defaultData):r}case t.REJECTED:{const e=(a??n.renderError)||null;if(void 0===typeof e&&i instanceof Error)throw i;if(void 0===i)throw new Error("The `taskError` is undefined");return"function"==typeof e?e(i):e}case t.PENDING:default:{const e=(s??n.renderLoading)||null;return"function"==typeof e?e(d):e}}}),[r,n.renderSuccess,n.renderError,n.renderLoading,e.defaultData]),a,r.data,r.error,r.status]}})(),n})()));