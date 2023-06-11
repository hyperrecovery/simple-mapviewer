"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3085],{86720:function(a,e,t){var n=t(69867),o=t(61067),r=t(33156),i=t(19987),c=t(54893),u=t(86395),v=t(29123),d=t(62896),s=new v.ZP({center:(0,d.mi)([5.8713,45.6452]),zoom:19}),f=new u.Z({source:new i.Z}),h=new r.Z({layers:[f],target:"map",view:s}),g=document.getElementById("geolocation_marker"),l=new c.Z({positioning:"center-center",element:g,stopEvent:!1});h.addOverlay(l);var m=new o.Z([],"XYZM"),M=new n.Z({projection:s.getProjection(),trackingOptions:{maximumAge:1e4,enableHighAccuracy:!0,timeout:6e5}}),p=500;M.on("change",(function(){var a=M.getPosition(),e=M.getAccuracy(),t=M.getHeading()||0,n=M.getSpeed()||0;!function(a,e,t,n){var o=a[0],r=a[1],i=m.getCoordinates(),c=i[i.length-1],u=c&&c[2];if(u){var v=e-(u%(2*Math.PI)+2*Math.PI)%(2*Math.PI);if(Math.abs(v)>Math.PI)v=-(v>=0?1:-1)*(2*Math.PI-Math.abs(v));e=u+v}m.appendCoordinate([o,r,e,t]),m.setCoordinates(m.getCoordinates().slice(-20)),g.src=e&&n?"data/geolocation_marker_heading.png":"data/geolocation_marker.png"}(a,t,Date.now(),n);var o=m.getCoordinates(),r=o.length;r>=2&&(p=(o[r-1][3]-o[0][3])/(r-1));var i,c=["Position: "+a[0].toFixed(2)+", "+a[1].toFixed(2),"Accuracy: "+e,"Heading: "+Math.round((i=t,360*i/(2*Math.PI)))+"&deg;","Speed: "+(3.6*n).toFixed(1)+" km/h","Delta: "+Math.round(p)+"ms"].join("<br />");document.getElementById("info").innerHTML=c})),M.on("error",(function(){alert("geolocation error")}));var w=0;function k(){var a=Date.now()-1.5*p;a=Math.max(a,w),w=a;var e,t,n,o,r=m.getCoordinateAtM(a,!0);r&&(s.setCenter((e=r,t=-r[2],n=s.getResolution(),o=h.getSize()[1],[e[0]-Math.sin(t)*o*n*1/4,e[1]+Math.cos(t)*o*n*1/4])),s.setRotation(-r[2]),l.setPosition(r),h.render())}var b,y=document.getElementById("geolocate");y.addEventListener("click",(function(){M.setTracking(!0),f.on("postrender",k),h.render(),H()}),!1);var _=new XMLHttpRequest;_.open("GET","data/geolocation-orientation.json"),_.onload=function(){b=JSON.parse(_.responseText).data},_.send();var A=document.getElementById("simulate");function D(a){var e=a.coords;M.set("accuracy",e.accuracy),M.set("heading",e.heading*Math.PI*2/360);var t=(0,d.mi)([e.longitude,e.latitude]);M.set("position",t),M.set("speed",e.speed),M.changed()}function H(){y.disabled="disabled",A.disabled="disabled"}A.addEventListener("click",(function(){var a=b,e=a.shift();D(e);var t=e.timestamp;!function e(){var n=a.shift();if(n){var o=n.timestamp;D(n),window.setTimeout((function(){t=o,e()}),(o-t)/.5)}}(),f.on("postrender",k),h.render(),H()}),!1)}},function(a){var e;e=86720,a(a.s=e)}]);
//# sourceMappingURL=geolocation-orientation.js.map