"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[1181],{82725:function(e,n,o){var r=o(39352),t=o(33156),w=o(48154),c=o(29123),i=o(12008),a=o(80244),l=o(19665),d=o(96306),f=o(96090),u=o(41225),s=o(79846),v=o(61067),g=o(92535),h=o(60392),m=o(19987),y=o(96802),k=o(86395),p=o(57356),x=new k.Z({source:new m.Z}),b=new y.Z({wrapX:!1}),X=new p.Z({source:b,style:function(e){return[new i.ZP({image:new a.Z({radius:8,fill:new l.Z({color:"rgba(255, 0, 0, 0.2)"}),stroke:new d.Z({color:"red",width:1})}),text:new f.Z({text:e.get("node").id.toString(),fill:new l.Z({color:"red"}),stroke:new d.Z({color:"white",width:3})})})]}}),z=new y.Z({wrapX:!1}),L=new p.Z({source:z,style:function(e){return[new i.ZP({stroke:new d.Z({color:"blue",width:1}),text:new f.Z({text:e.get("edge").id.toString(),fill:new l.Z({color:"blue"}),stroke:new d.Z({color:"white",width:2})})})]}}),S=new y.Z({wrapX:!1}),j=new p.Z({source:S,style:function(e){return[new i.ZP({stroke:new d.Z({color:"black",width:1}),fill:new l.Z({color:"rgba(0, 255, 0, 0.2)"}),text:new f.Z({font:"bold 12px sans-serif",text:e.get("face").id.toString(),fill:new l.Z({color:"green"}),stroke:new d.Z({color:"white",width:2})})})]}}),q=new t.Z({layers:[x,j,L,X],target:"map",view:new c.ZP({center:[-11e6,46e5],zoom:16})}),A=topolis.createTopology();function B(e,n){var o=e.getFeatureById(n.id);e.removeFeature(o)}function C(e,n){var o=e.getEdgeByPoint(n,5)[0];return o?e.modEdgeSplit(o,n):e.addIsoNode(n)}A.on("addnode",(function(e){var n=new r.Z({geometry:new g.Z(e.coordinate),node:e});n.setId(e.id),b.addFeature(n)})),A.on("removenode",(function(e){B(b,e)})),A.on("addedge",(function(e){var n=new r.Z({geometry:new v.Z(e.coordinates),edge:e});n.setId(e.id),z.addFeature(n)})),A.on("modedge",(function(e){z.getFeatureById(e.id).setGeometry(new v.Z(e.coordinates))})),A.on("removeedge",(function(e){B(z,e)})),A.on("addface",(function(e){var n=A.getFaceGeometry(e),o=new r.Z({geometry:new h.ZP(n),face:e});o.setId(e.id),S.addFeature(o)})),A.on("removeface",(function(e){B(S,e)}));var D=new u.ZP({type:"LineString"});D.on("drawend",(function(e){var n,o,r=e.feature.getGeometry().getCoordinates(),t=r[0],w=r[r.length-1];try{n=A.getNodeByPoint(t),o=A.getNodeByPoint(w);var c=A.getEdgeByPoint(t,5),i=A.getEdgeByPoint(w,5),a=A.getEdgesByLine(r);if(1===a.length&&!n&&!o&&0===c.length&&0===i.length)return A.remEdgeNewFace(a[0]),(n=a[0].start).face&&A.removeIsoNode(n),void((o=a[0].end).face&&A.removeIsoNode(o));n||(n=C(A,t),r[0]=n.coordinate),o||(o=C(A,w),r[r.length-1]=o.coordinate),A.addEdgeNewFaces(n,o,r)}catch(e){toastr.warning(e.toString())}})),q.addInteraction(D);var E=new s.Z({source:z});q.addInteraction(E),q.addControl(new w.Z)}},function(e){var n;n=82725,e(e.s=n)}]);
//# sourceMappingURL=topolis.js.map