import fs from 'fs';
const API='https://commons.wikimedia.org/w/api.php';const UA={'User-Agent':'goldsworthy-map/1.0'};
const q=async p=>(await fetch(API+'?'+new URLSearchParams({format:'json',...p}),{headers:UA})).json();
const lines=fs.readFileSync('scripts/work/cat.txt','utf8').split('\n').filter(l=>l.includes(' :: ')&&!/Stanford|Wood Line|Leaping|de Young|Barles|refuge|Musée|Presidio|Gouda|Jesús|Domodeargila|exhibition \(/.test(l));
let titles=lines.map(l=>'File:'+l.split(' :: ')[1]);
const cand=JSON.parse(fs.readFileSync('scripts/work/photo-candidates.json','utf8'));
for(const k in cand) for(const p of cand[k]) titles.push(p.title);
titles=[...new Set(titles)];
const out=[];
for(let i=0;i<titles.length;i+=40){
  const d=await q({action:'query',prop:'imageinfo|coordinates',titles:titles.slice(i,i+40).join('|'),iiprop:'url|extmetadata',iiurlwidth:1000,colimit:500});
  for(const p of Object.values(d.query.pages)){const ii=p.imageinfo?.[0];if(!ii)continue;const m=ii.extmetadata||{};
    out.push({title:p.title,ll:p.coordinates?[p.coordinates[0].lat,p.coordinates[0].lon]:null,thumb:ii.thumburl,page:ii.descriptionurl,
      license:m.LicenseShortName?.value,artist:(m.Artist?.value||'').replace(/<[^>]+>/g,'').trim(),
      desc:(m.ImageDescription?.value||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,220)});}}
fs.writeFileSync('scripts/work/info.json',JSON.stringify(out,null,1));
for(const o of out) console.log([o.title.slice(5,75),o.ll?o.ll.map(x=>x.toFixed(3)).join(','):'-',o.license,o.artist.slice(0,25),o.desc.slice(0,140)].join(' | '));
