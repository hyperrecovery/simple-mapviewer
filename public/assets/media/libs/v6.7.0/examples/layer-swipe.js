"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7792],{19923:function(e,t,r){var n=r(33156),o=r(19987),a=r(86395),p=r(29123),i=r(93613),c=r(633),s=new a.Z({source:new o.Z}),u=new a.Z({source:new i.Z({attributions:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',url:"https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=get_your_own_D6rA4zTHduk6KOKTXzGB",maxZoom:20})}),w=new n.Z({layers:[s,u],target:"map",view:new p.ZP({center:[0,0],zoom:2})}),l=document.getElementById("swipe");u.on("prerender",(function(e){var t=e.context,r=w.getSize(),n=r[0]*(l.value/100),o=(0,c.CR)(e,[n,0]),a=(0,c.CR)(e,[r[0],0]),p=(0,c.CR)(e,[n,r[1]]),i=(0,c.CR)(e,r);t.save(),t.beginPath(),t.moveTo(o[0],o[1]),t.lineTo(p[0],p[1]),t.lineTo(i[0],i[1]),t.lineTo(a[0],a[1]),t.closePath(),t.clip()})),u.on("postrender",(function(e){e.context.restore()})),l.addEventListener("input",(function(){w.render()}),!1)}},function(e){var t;t=19923,e(e.s=t)}]);
//# sourceMappingURL=layer-swipe.js.map