"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[259],{2635:function(e,n,o){var r,t,i=o(33156),c=o(29123),f=o(12008),u=o(19665),w=o(96306),l=o(80244),a=o(5651),m=o(41225),y=o(79846),s=o(35154),G=o(60392),d=o(92535),v=o(19987),E=o(96802),P=o(86395),S=o(57356),g=o(23678),b=o(62896),p=new P.Z({source:new v.Z}),C=new E.Z,h=new f.ZP({fill:new u.Z({color:"rgba(255, 255, 255, 0.2)"}),stroke:new w.Z({color:"#33cc33",width:2}),image:new l.Z({radius:7,fill:new u.Z({color:"#ffcc33"})})}),k=new f.ZP({geometry:function(e){return e.get("modifyGeometry")||e.getGeometry()},fill:new u.Z({color:"rgba(255, 255, 255, 0.2)"}),stroke:new w.Z({color:"#ff3333",width:2}),image:new l.Z({radius:7,fill:new u.Z({color:"rgba(0, 0, 0, 0)"})})}),z=new S.Z({source:C,style:function(e){return"GeometryCollection"===e.getGeometry().getType()?k:h}}),F=new i.Z({layers:[p,z],target:"map",view:new c.ZP({center:[-11e6,66e5],zoom:3})}),j=new a.Z({source:C}).getOverlay().getStyleFunction(),q=new a.Z({source:C,style:function(e){return e.get("features").forEach((function(n){var o=n.get("modifyGeometry");if(o){var r,t,i,c=e.getGeometry().getCoordinates(),f=n.getGeometry().getGeometries(),u=f[0].getCoordinates()[0],w=f[1].getCoordinates(),l=F.getView().getProjection();c[0]===w[0]&&c[1]===w[1]?(r=(0,b.vs)(u[0],l,"EPSG:4326"),t=(0,b.vs)(u[(u.length-1)/2],l,"EPSG:4326"),i=(0,g.Sp)(r,t)/2):(r=(0,b.vs)(w,l,"EPSG:4326"),t=(0,b.vs)(c,l,"EPSG:4326"),i=(0,g.Sp)(r,t));var a=(0,G.iu)((0,b.vs)(w,l,"EPSG:4326"),i,128);a.transform("EPSG:4326",l),f[0].setCoordinates(a.getCoordinates()),o.setGeometries(f)}})),j(e)}});q.on("modifystart",(function(e){e.features.forEach((function(e){var n=e.getGeometry();"GeometryCollection"===n.getType()&&e.set("modifyGeometry",n.clone(),!0)}))})),q.on("modifyend",(function(e){e.features.forEach((function(e){var n=e.get("modifyGeometry");n&&(e.setGeometry(n),e.unset("modifyGeometry",!0))}))})),F.addInteraction(q);var x=document.getElementById("type");function A(){var e,n=x.value;"Geodesic"===n&&(n="Circle",e=function(e,n,o){n||(n=new s.Z([new G.ZP([]),new d.Z(e[0])]));var r=n.getGeometries(),t=(0,b.vs)(e[0],o,"EPSG:4326"),i=(0,b.vs)(e[1],o,"EPSG:4326"),c=(0,g.Sp)(t,i),f=(0,G.iu)(t,c,128);return f.transform("EPSG:4326",o),r[0].setCoordinates(f.getCoordinates()),n.setGeometries(r),n}),r=new m.ZP({source:C,type:n,geometryFunction:e}),F.addInteraction(r),t=new y.Z({source:C}),F.addInteraction(t)}x.onchange=function(){F.removeInteraction(r),F.removeInteraction(t),A()},A()}},function(e){var n;n=2635,e(e.s=n)}]);
//# sourceMappingURL=draw-and-modify-geodesic.js.map