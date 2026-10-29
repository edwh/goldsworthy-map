// Full-text search of Commons for "Goldsworthy"; list geotagged UK files far from known sites.
import fs from 'fs';
const API='https://commons.wikimedia.org/w/api.php';const UA={'User-Agent':'goldsworthy-map/1.0 (https://github.com/edwh/goldsworthy-map)'};
const q=async p=>(await fetch(API+'?'+new URLSearchParams({format:'json',...p}),{headers:UA})).json();
const sites=JSON.parse(fs.readFileSync('data/sites.json','utf8'));
const dist=(a,b)=>{const R=6371,r=Math.PI/180,dl=(b[0]-a[0])*r,dn=(b[1]-a[1])*r;const h=Math.sin(dl/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))};
const titles=new Set();
for(const term of ['Goldsworthy','"Andy Goldsworthy"','"Andrew Goldsworthy"','Goldsworthy sculpture','Goldsworthy sheepfold','Goldsworthy cairn','Goldsworthy arch','Goldsworthy chamber','Goldsworthy wall']){
  let off=0; while(off<1000){const d=await q({action:'query',list:'search',srnamespace:6,srlimit:500,sroffset:off,srsearch:term});
    (d.query?.search||[]).forEach(x=>titles.add(x.title)); if(!d.continue)break; off=d.continue.sroffset;}}
const T=[...titles]; const out=[];
for(let i=0;i<T.length;i+=50){const d=await q({action:'query',prop:'coordinates|imageinfo',iiprop:'extmetadata',titles:T.slice(i,i+50).join('|')});
  for(const p of Object.values(d.query.pages)){const c=p.coordinates?.[0]; if(!c)continue; if(c.lat<49.8||c.lat>61||c.lon<-8.3||c.lon>2)continue;
    const desc=(p.imageinfo?.[0]?.extmetadata?.ImageDescription?.value||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
    if(!/goldsworthy/i.test(p.title+desc))continue;
    const near=Math.min(...sites.map(s=>dist(s.ll,[c.lat,c.lon])));
    out.push({t:p.title.slice(5,90),ll:[+c.lat.toFixed(4),+c.lon.toFixed(4)],near:+near.toFixed(1),desc:desc.slice(0,200)});}}
out.sort((a,b)=>a.ll[0]-b.ll[0]);
fs.writeFileSync('scripts/work/sweep.json',JSON.stringify(out,null,1));
console.log(T.length,'files searched',out.length,'UK geotagged mentioning Goldsworthy');
for(const o of out.filter(o=>o.near>1.5)) console.log(o.ll.join(','),'|',o.near+'km','|',o.t,'|',o.desc.slice(0,150));
