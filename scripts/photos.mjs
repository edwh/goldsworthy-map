// Find freely licensed Wikimedia Commons photos near each site.
import fs from 'fs';
const sites = JSON.parse(fs.readFileSync('scripts/work/sites.json','utf8'));
const API='https://commons.wikimedia.org/w/api.php';
const UA={'User-Agent':'goldsworthy-map/1.0 (https://github.com/edwh/goldsworthy-map)'};
const q=async p=>{const u=API+'?'+new URLSearchParams({format:'json',origin:'*',...p});for(let i=0;i<4;i++){const r=await fetch(u,{headers:UA});if(r.ok)return r.json();await new Promise(r=>setTimeout(r,2000))}throw new Error(u)};
const KW=/goldsworthy|sheepfold|sheep fold|pinfold|washfold|\bfold\b|drove arch|striding arch|arch|cone|cairn|hanging stone|outclosure|hanging trees|shadow stone|earthwork|maze|lambton worm|chalk stone|moonlit|refuge|byre|slate|touchstone|boulder/i;
const out={};
for (const s of sites){
  const r = s.approx?1500:400;
  const geo=await q({action:'query',list:'geosearch',gscoord:s.ll.join('|'),gsradius:r,gsnamespace:6,gslimit:100});
  let titles=(geo.query?.geosearch||[]).map(x=>x.title);
  const srch=await q({action:'query',list:'search',srnamespace:6,srlimit:30,srsearch:`"${s.name.replace(/\s*\(\d+\)/,'')}" Goldsworthy`});
  titles=[...new Set([...titles,...(srch.query?.search||[]).map(x=>x.title)])].filter(t=>KW.test(t)&&/\.(jpe?g|png)$/i.test(t));
  const res=[];
  for(let i=0;i<titles.length;i+=40){
    const d=await q({action:'query',prop:'imageinfo',titles:titles.slice(i,i+40).join('|'),iiprop:'url|extmetadata|size',iiurlwidth:900});
    for(const p of Object.values(d.query?.pages||{})){const ii=p.imageinfo?.[0];if(!ii)continue;const m=ii.extmetadata||{};
      res.push({title:p.title,thumb:ii.thumburl,page:ii.descriptionurl,w:ii.thumbwidth,h:ii.thumbheight,
        license:m.LicenseShortName?.value,licenseUrl:m.LicenseUrl?.value,artist:(m.Artist?.value||'').replace(/<[^>]+>/g,'').trim(),
        desc:(m.ImageDescription?.value||'').replace(/<[^>]+>/g,'').trim().slice(0,300)});}
  }
  out[s.name]=res; console.log(s.name,'→',res.length, res.slice(0,6).map(x=>x.title.slice(5,70)).join(' | '));
}
fs.writeFileSync('scripts/work/photo-candidates.json',JSON.stringify(out,null,1));
