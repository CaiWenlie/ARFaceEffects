import{d as u,r as f,c as d,o as p,a as m,b as _,e as h}from"./vendor.1eebe7e1.js";const y=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}};y();var v=(c,n)=>{const s=c.__vccOpts||c;for(const[r,e]of n)s[r]=e;return s};const g=u({name:"App"});function L(c,n,s,r,e,t){const o=f("router-view");return p(),d(o)}var $=v(g,[["render",L]]);const w="modulepreload",i={},A="/ARFaceEffects/",E=function(n,s){return!s||s.length===0?n():Promise.all(s.map(r=>{if(r=`${A}${r}`,r in i)return;i[r]=!0;const e=r.endsWith(".css"),t=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${t}`))return;const o=document.createElement("link");if(o.rel=e?"stylesheet":w,e||(o.as="script",o.crossOrigin=""),o.href=r,document.head.appendChild(o),e)return new Promise((a,l)=>{o.addEventListener("load",a),o.addEventListener("error",l)})})).then(()=>n())},O=[{path:"/",redirect:"/tensorflow"},{path:"/tensorflow",component:()=>E(()=>import("./Tensorflow.dad7ec8e.js"),["assets/Tensorflow.dad7ec8e.js","assets/Tensorflow.91a86776.css","assets/vendor.1eebe7e1.js"])}],b=m({history:_(),routes:O});h($).use(b).mount("#app");export{v as _};