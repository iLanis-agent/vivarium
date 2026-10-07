/* Vivarium tests: engine vs tests/expected.json (python oracle). */
'use strict';
const fs=require('fs'),path=require('path');
const V=require(path.join(__dirname,'..','engine.js'));
const items=JSON.parse(fs.readFileSync(path.join(__dirname,'expected.json'),'utf8')).items;
let pass=0,fail=0;
function ok(){pass++;}
function bad(l,a,b){fail++;console.log('FAIL '+l+': got '+JSON.stringify(a)+' want '+JSON.stringify(b));}
for(const it of items){
  const T=it.kind+' '+JSON.stringify(it.dims)+' ';
  const d=it.dims;
  if(it.kind==='glass'){
    const r=V.glass(d[0],d[1],d[2],d[3]);
    if((r===null&&it.oracle===null)||(r&&it.oracle&&Math.abs(r.areaM2-it.oracle.areaM2)<=0.02&&Math.abs(r.weightKg-it.oracle.weightKg)<=0.15))ok();
    else bad(T,r,it.oracle);
  }else if(it.kind==='substrate'){
    const r=V.substrate(d[0],d[1],d[2],d[3],d[4]);
    const cl=(a,b)=>Math.abs(a-b)<=0.15;
    let good=(r===null&&it.oracle===null)||(r&&it.oracle&&cl(r.drainLiters,it.oracle.drainLiters)&&cl(r.soilLiters,it.oracle.soilLiters)&&cl(r.soilBeforeHardscape,it.oracle.soilBeforeHardscape));
    if(good&&r&&it.oracle){
      for(let i=0;i<4;i++)if(!cl(r.mix[i].liters,it.oracle.mixLiters[i]))good=false;
    }
    if(good)ok(); else bad(T,r,it.oracle);
  }else{
    const r=V.air(d[0],d[1],d[2]);
    if((r===null&&it.oracle===null)||(r&&it.oracle&&r.liters===it.oracle.liters&&Math.abs(r.mistMinMl-it.oracle.mistMinMl)<=1&&Math.abs(r.mistMaxMl-it.oracle.mistMaxMl)<=1))ok();
    else bad(T,r,it.oracle);
  }
}
// known reference: 60x45x60cm at 6mm -> 1.62 m2, 24.3 kg
const g=V.glass(60,45,60,6);
if(g&&g.areaM2===1.53&&g.weightKg===23)pass++; else bad('glass ref',g,'1.53/23');
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
