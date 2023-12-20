/*! For license information please see index.js.LICENSE.txt */
!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("react"));else if("function"==typeof define&&define.amd)define(["react"],t);else{var r="object"==typeof exports?t(require("react")):t(e.react);for(var n in r)("object"==typeof exports?exports:e)[n]=r[n]}}(global,(e=>(()=>{"use strict";var t={729:e=>{var t=Object.prototype.hasOwnProperty,r="~";function n(){}function o(e,t,r){this.fn=e,this.context=t,this.once=r||!1}function s(e,t,n,s,a){if("function"!=typeof n)throw new TypeError("The listener must be a function");var c=new o(n,s||e,a),i=r?r+t:t;return e._events[i]?e._events[i].fn?e._events[i]=[e._events[i],c]:e._events[i].push(c):(e._events[i]=c,e._eventsCount++),e}function a(e,t){0==--e._eventsCount?e._events=new n:delete e._events[t]}function c(){this._events=new n,this._eventsCount=0}Object.create&&(n.prototype=Object.create(null),(new n).__proto__||(r=!1)),c.prototype.eventNames=function(){var e,n,o=[];if(0===this._eventsCount)return o;for(n in e=this._events)t.call(e,n)&&o.push(r?n.slice(1):n);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(e)):o},c.prototype.listeners=function(e){var t=r?r+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var o=0,s=n.length,a=new Array(s);o<s;o++)a[o]=n[o].fn;return a},c.prototype.listenerCount=function(e){var t=r?r+e:e,n=this._events[t];return n?n.fn?1:n.length:0},c.prototype.emit=function(e,t,n,o,s,a){var c=r?r+e:e;if(!this._events[c])return!1;var i,u,f=this._events[c],l=arguments.length;if(f.fn){switch(f.once&&this.removeListener(e,f.fn,void 0,!0),l){case 1:return f.fn.call(f.context),!0;case 2:return f.fn.call(f.context,t),!0;case 3:return f.fn.call(f.context,t,n),!0;case 4:return f.fn.call(f.context,t,n,o),!0;case 5:return f.fn.call(f.context,t,n,o,s),!0;case 6:return f.fn.call(f.context,t,n,o,s,a),!0}for(u=1,i=new Array(l-1);u<l;u++)i[u-1]=arguments[u];f.fn.apply(f.context,i)}else{var p,v=f.length;for(u=0;u<v;u++)switch(f[u].once&&this.removeListener(e,f[u].fn,void 0,!0),l){case 1:f[u].fn.call(f[u].context);break;case 2:f[u].fn.call(f[u].context,t);break;case 3:f[u].fn.call(f[u].context,t,n);break;case 4:f[u].fn.call(f[u].context,t,n,o);break;default:if(!i)for(p=1,i=new Array(l-1);p<l;p++)i[p-1]=arguments[p];f[u].fn.apply(f[u].context,i)}}return!0},c.prototype.on=function(e,t,r){return s(this,e,t,r,!1)},c.prototype.once=function(e,t,r){return s(this,e,t,r,!0)},c.prototype.removeListener=function(e,t,n,o){var s=r?r+e:e;if(!this._events[s])return this;if(!t)return a(this,s),this;var c=this._events[s];if(c.fn)c.fn!==t||o&&!c.once||n&&c.context!==n||a(this,s);else{for(var i=0,u=[],f=c.length;i<f;i++)(c[i].fn!==t||o&&!c[i].once||n&&c[i].context!==n)&&u.push(c[i]);u.length?this._events[s]=1===u.length?u[0]:u:a(this,s)}return this},c.prototype.removeAllListeners=function(e){var t;return e?(t=r?r+e:e,this._events[t]&&a(this,t)):(this._events=new n,this._eventsCount=0),this},c.prototype.off=c.prototype.removeListener,c.prototype.addListener=c.prototype.on,c.prefixed=r,c.EventEmitter=c,e.exports=c},251:(e,t,r)=>{var n=r(156),o=Symbol.for("react.element"),s=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),a=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};t.jsx=function(e,t,r){var n,i={},u=null,f=null;for(n in void 0!==r&&(u=""+r),void 0!==t.key&&(u=""+t.key),void 0!==t.ref&&(f=t.ref),t)s.call(t,n)&&!c.hasOwnProperty(n)&&(i[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps)void 0===i[n]&&(i[n]=t[n]);return{$$typeof:o,type:e,key:u,ref:f,props:i,_owner:a.current}}},893:(e,t,r)=>{e.exports=r(251)},156:t=>{t.exports=e}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var s=r[e]={exports:{}};return t[e](s,s.exports,n),s.exports}n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};return(()=>{n.r(o),n.d(o,{ISuspenseRender:()=>e,ISuspenseRenderProvider:()=>t,SuspenseRenderContext:()=>i,SuspenseRenderProvider:()=>u,useSuspenseRender:()=>l});var e={};n.r(e),n.d(e,{TaskStatus:()=>a});var t={};n.r(t);var r=n(156);const s=n(729);var a;!function(e){e[e.PENDING=0]="PENDING",e[e.RESOLVED=1]="RESOLVED",e[e.REJECTED=2]="REJECTED"}(a||(a={}));var c=n(893);const i=(0,r.createContext)({}),u=function({children:e,renderSuccess:t,renderLoading:n,renderError:o,experimentals:s}){const a=(0,r.useMemo)((()=>({renderSuccess:t,renderLoading:n,renderError:o,experimentals:s})),[o,n,t,s]);return(0,c.jsx)(i.Provider,{value:a,children:e})},f=new s,l=(e={},t=void 0)=>{const n=(0,r.useRef)(e.defaultData),[o,s]=(0,r.useState)({status:"defaultData"in e?a.RESOLVED:a.PENDING}),c=(0,r.useContext)(i);(0,r.useEffect)((()=>{if(t){const e=e=>{s(e)};return f.on(t,e),()=>{f.off(t,e)}}return()=>{}}),[t]);const u=(0,r.useCallback)(((e,t)=>{t?f.emit(t,e):s(e)}),[]),l=(0,r.useCallback)((async(e,r)=>{try{const n=c.experimentals?.taskRunnerInterceptors;if(n){let o;for(const s of n)o=s(await o,e,r),u({status:a.PENDING,promise:o},t);const s=await o;return u({status:a.RESOLVED,data:s},t),s}const o=e();u({status:a.PENDING,promise:o},t);const s=await o;return u({status:a.RESOLVED,data:s},t),s}catch(e){const r=e;throw u({status:a.REJECTED,error:r},t),e}}),[c.experimentals?.taskRunnerInterceptors,t,u]);return[(0,r.useCallback)(((t,r,s)=>{const{data:i,status:u,error:f,promise:l}=o,p=n.current;switch(u){case a.RESOLVED:{const r=(t??c.renderSuccess)||null;return n.current=i,"function"==typeof r?r(i??e.defaultData,p):r}case a.REJECTED:{const e=(s??c.renderError)||null;if(void 0===typeof e&&f instanceof Error)throw f;if(void 0===f)throw new Error("The `taskError` is undefined");return"function"==typeof e?e(f,p):e}case a.PENDING:default:{const e=(r??c.renderLoading)||null;return"function"==typeof e?e(l,p):e}}}),[o,c.renderSuccess,c.renderError,c.renderLoading,e.defaultData]),l,o.data,o.error,o.status]}})(),o})()));