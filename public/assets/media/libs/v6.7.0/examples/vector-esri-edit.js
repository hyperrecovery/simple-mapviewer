"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5621],{26008:function(e,r,t){var s=t(13843),n=t(33156),i=t(96802),a=t(29123),o=t(93613),c=t(41225),u=t(93767),l=t(5651),f=t(85920),v=t(57356),p=t(86395),d=t(61430),m=t(62896),y=t(1005),g="https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/",S=new s.Z,w=new i.Z({loader:function(e,r,t){var s=g+"2/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry="+encodeURIComponent('{"xmin":'+e[0]+',"ymin":'+e[1]+',"xmax":'+e[2]+',"ymax":'+e[3]+',"spatialReference":{"wkid":102100}}')+"&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100";$.ajax({url:s,dataType:"jsonp",success:function(e){if(e.error)alert(e.error.message+"\n"+e.error.details.join("\n"));else{var r=S.readFeatures(e,{featureProjection:t});r.length>0&&w.addFeatures(r)}}})},strategy:(0,y.Gg)((0,d.dl)({tileSize:512}))}),j=new v.Z({source:w}),F=new p.Z({source:new o.Z({attributions:'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"})}),h=new c.ZP({source:w,type:"Polygon"}),I=new u.Z;I.setActive(!1);var R=I.getFeatures(),M=new l.Z({features:R});M.setActive(!1);var W=new n.Z({interactions:(0,f.ce)().extend([h,I,M]),layers:[F,j],target:document.getElementById("map"),view:new a.ZP({center:(0,m.mi)([-110.875,37.345]),zoom:5})}),x=document.getElementById("type");x.onchange=function(){h.setActive("DRAW"===x.value),I.setActive("MODIFY"===x.value),M.setActive("MODIFY"===x.value)};var G={};R.on("add",(function(e){e.element.on("change",(function(e){G[e.target.get("objectid")]=!0}))})),R.on("remove",(function(e){var r=e.element,t=r.get("objectid");if(!0===G[t]){var s="["+S.writeFeature(r,{featureProjection:W.getView().getProjection()})+"]";$.post("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2/updateFeatures",{f:"json",features:s}).done((function(e){var r="string"==typeof e?JSON.parse(e):e;if(r.updateResults&&r.updateResults.length>0)if(!0!==r.updateResults[0].success){var s=r.updateResults[0].error;alert(s.description+" ("+s.code+")")}else delete G[t]}))}})),h.on("drawend",(function(e){var r=e.feature,t="["+S.writeFeature(r,{featureProjection:W.getView().getProjection()})+"]";$.post("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2/addFeatures",{f:"json",features:t}).done((function(e){var t="string"==typeof e?JSON.parse(e):e;if(t.addResults&&t.addResults.length>0)if(!0===t.addResults[0].success)r.set("objectid",t.addResults[0].objectId);else{var s=t.addResults[0].error;alert(s.description+" ("+s.code+")")}}))}))}},function(e){var r;r=26008,e(e.s=r)}]);
//# sourceMappingURL=vector-esri-edit.js.map