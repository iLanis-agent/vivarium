/* Vivarium engine: build math for a glass enclosure.
   - glass panel areas and weight (soda-lime glass ~2.5 kg/m2 per mm thickness)
   - drainage layer and substrate volumes (ABG-style mix proportions)
   - ventilation air changes and misting water use
   Rules of thumb are common hobby practice; soil settles and hardscape
   displaces volume. Pure JS, browser + Node. */
(function(root,factory){
  if(typeof module==='object'&&module.exports){module.exports=factory();}
  else{root.Vivarium=factory();}
})(typeof self!=='undefined'?self:this,function(){
'use strict';
var GLASS_KG_PER_M2_MM=2.5;
/* ABG mix (Atlanta Botanical Garden style), parts by volume */
var MIX=[
 {part:'Tree fern fiber or sphagnum',frac:2/5},
 {part:'Peat or coco coir',frac:1/5},
 {part:'Orchid bark',frac:1/5},
 {part:'Horticultural charcoal',frac:1/5}
];
/* dims in cm: length x width x height */
function glass(lenCm,widCm,heiCm,thickMm){
  if(!(lenCm>0)||!(widCm>0)||!(heiCm>0)||!(thickMm>0))return null;
  var L=lenCm/100,W=widCm/100,H=heiCm/100; /* meters */
  var panels={
    bottom:L*W,
    front:L*H,
    back:L*H,
    left:W*H,
    right:W*H
  };
  var area=0;
  for(var k in panels){area+=panels[k];panels[k]=Math.round(panels[k]*10000)/10000;}
  var kg=area*thickMm*GLASS_KG_PER_M2_MM;
  return {areaM2:Math.round(area*100)/100,weightKg:Math.round(kg*10)/10,panels:panels};
}
/* substrate stack: drainage depth + soil depth in cm; returns liters */
function substrate(lenCm,widCm,drainCm,soilCm,hardscapePct){
  if(!(lenCm>0)||!(widCm>0)||!(drainCm>=0)||!(soilCm>=0))return null;
  var hp=hardscapePct||0;
  if(hp<0||hp>90)return null;
  var baseL=lenCm*widCm/1000; /* liters per cm of depth */
  var drain=baseL*drainCm;
  var soilRaw=baseL*soilCm;
  var soil=soilRaw*(1-hp/100);
  var parts=MIX.map(function(m){
    return {part:m.part,liters:Math.round(soil*m.frac*10)/10};
  });
  return {
    drainLiters:Math.round(drain*10)/10,
    soilLiters:Math.round(soil*10)/10,
    soilBeforeHardscape:Math.round(soilRaw*10)/10,
    mix:parts
  };
}
/* enclosure air volume and misting: rule of thumb 2-5% of volume per misting */
function air(lenCm,widCm,heiCm){
  if(!(lenCm>0)||!(widCm>0)||!(heiCm>0))return null;
  var liters=lenCm*widCm*heiCm/1000;
  return {liters:Math.round(liters*10)/10,
    mistMinMl:Math.round(liters*1000*0.02),
    mistMaxMl:Math.round(liters*1000*0.05)};
}
return {glass:glass,substrate:substrate,air:air,MIX:MIX};
});
