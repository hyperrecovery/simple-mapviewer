"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9336],{63739:function(n,e,t){var c,i=t(33156),o=t(19987),s=t(86395),a=t(29123),u=t(75302),r=t(61994),l=document.getElementById("units"),f=document.getElementById("type"),w=document.getElementById("steps"),m=document.getElementById("showScaleText"),h=document.getElementById("showScaleTextDiv"),d="scaleline",g=4,p=!0;function v(){return c="scaleline"===d?new u.Z({units:l.value}):new u.Z({units:l.value,bar:!0,steps:g,text:p,minWidth:140})}var x=new i.Z({controls:(0,r.ce)().extend([v()]),layers:[new s.Z({source:new o.Z})],target:"map",view:new a.ZP({center:[0,0],zoom:2})});l.addEventListener("change",(function(){c.setUnits(l.value)})),f.addEventListener("change",(function(){d=f.value,"scalebar"===f.value?(w.style.display="inline",h.style.display="inline",x.removeControl(c),x.addControl(v())):(w.style.display="none",h.style.display="none",x.removeControl(c),x.addControl(v()))})),w.addEventListener("change",(function(){g=parseInt(w.value,10),x.removeControl(c),x.addControl(v())})),m.addEventListener("change",(function(){p=m.checked,x.removeControl(c),x.addControl(v())}))}},function(n){var e;e=63739,n(n.s=e)}]);
//# sourceMappingURL=scale-line.js.map