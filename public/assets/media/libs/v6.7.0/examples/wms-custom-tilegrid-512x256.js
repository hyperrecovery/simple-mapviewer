"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4803],{9010:function(e,r,t){for(var s=t(33156),n=t(19987),o=t(71840),a=t(86395),w=t(78068),i=t(29123),c=t(62896),v=t(85409),l=(0,c.U2)("EPSG:3857").getExtent(),u=(0,v.dz)(l)/256,p=new Array(22),f=0,m=p.length;f<m;++f)p[f]=u/Math.pow(2,f);var g=new o.Z({extent:[-13884991,2870341,-7455066,6338219],resolutions:p,tileSize:[512,256]}),h=[new a.Z({source:new n.Z}),new a.Z({source:new w.Z({url:"https://ahocevar.com/geoserver/wms",params:{LAYERS:"topp:states",TILED:!0},serverType:"geoserver",tileGrid:g})})];new s.Z({layers:h,target:"map",view:new i.ZP({center:[-10997148,4569099],zoom:4})})}},function(e){var r;r=9010,e(e.s=r)}]);
//# sourceMappingURL=wms-custom-tilegrid-512x256.js.map