"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9869],{93888:function(e,n,o){var t,i,r,l,c,a=o(41225),s=o(33156),f=o(54893),u=o(29123),w=o(12008),d=o(19665),g=o(96306),m=o(80244),p=o(60392),h=o(61067),v=o(19987),k=o(96802),y=o(86395),b=o(57356),M=o(23678),C=o(57899),z=new y.Z({source:new v.Z}),D=new k.Z,E=new b.Z({source:D,style:new w.ZP({fill:new d.Z({color:"rgba(255, 255, 255, 0.2)"}),stroke:new g.Z({color:"#ffcc33",width:2}),image:new m.Z({radius:7,fill:new d.Z({color:"#ffcc33"})})})}),F=new s.Z({layers:[z,E],target:"map",view:new u.ZP({center:[-11e6,46e5],zoom:15})});F.on("pointermove",(function(e){if(!e.dragging){var n="Click to start drawing";if(t){var o=t.getGeometry();o instanceof p.ZP?n="Click to continue drawing the polygon":o instanceof h.Z&&(n="Click to continue drawing the line")}i.innerHTML=n,r.setPosition(e.coordinate),i.classList.remove("hidden")}})),F.getViewport().addEventListener("mouseout",(function(){i.classList.add("hidden")}));var L,P=document.getElementById("type");function S(){var e,n="area"==P.value?"Polygon":"LineString";L=new a.ZP({source:D,type:n,style:new w.ZP({fill:new d.Z({color:"rgba(255, 255, 255, 0.2)"}),stroke:new g.Z({color:"rgba(0, 0, 0, 0.5)",lineDash:[10,10],width:2}),image:new m.Z({radius:5,stroke:new g.Z({color:"rgba(0, 0, 0, 0.7)"}),fill:new d.Z({color:"rgba(255, 255, 255, 0.2)"})})})}),F.addInteraction(L),j(),function(){i&&i.parentNode.removeChild(i);(i=document.createElement("div")).className="ol-tooltip hidden",r=new f.Z({element:i,offset:[15,0],positioning:"center-left"}),F.addOverlay(r)}(),L.on("drawstart",(function(n){t=n.feature;var o=n.coordinate;e=t.getGeometry().on("change",(function(e){var n,t,i,r,a,s=e.target;s instanceof p.ZP?(r=s,n=(a=(0,M.bg)(r))>1e4?Math.round(a/1e6*100)/100+" km<sup>2</sup>":Math.round(100*a)/100+" m<sup>2</sup>",o=s.getInteriorPoint().getCoordinates()):s instanceof h.Z&&(t=s,n=(i=(0,M.xA)(t))>100?Math.round(i/1e3*100)/100+" km":Math.round(100*i)/100+" m",o=s.getLastCoordinate()),l.innerHTML=n,c.setPosition(o)}))})),L.on("drawend",(function(){l.className="ol-tooltip ol-tooltip-static",c.setOffset([0,-7]),t=null,l=null,j(),(0,C.B)(e)}))}function j(){l&&l.parentNode.removeChild(l),(l=document.createElement("div")).className="ol-tooltip ol-tooltip-measure",c=new f.Z({element:l,offset:[0,-15],positioning:"bottom-center",stopEvent:!1,insertFirst:!1}),F.addOverlay(c)}P.onchange=function(){F.removeInteraction(L),S()},S()}},function(e){var n;n=93888,e(e.s=n)}]);
//# sourceMappingURL=measure.js.map