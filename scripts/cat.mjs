const API='https://commons.wikimedia.org/w/api.php';const UA={'User-Agent':'goldsworthy-map/1.0'};
const q=async p=>(await fetch(API+'?'+new URLSearchParams({format:'json',...p}),{headers:UA})).json();
const seen=new Set();
async function walk(cat,depth){ if(seen.has(cat)||depth>3)return; seen.add(cat);
  let cont={}; do{ const d=await q({action:'query',list:'categorymembers',cmtitle:cat,cmlimit:500,cmtype:'file|subcat',...cont});
   for(const m of d.query.categorymembers){ if(m.ns===14){console.log('#',depth,m.title); await walk(m.title,depth+1);} else console.log(cat.slice(9,60),'::',m.title.slice(5,110)); }
   cont=d.continue||null; }while(cont); }
await walk('Category:Andy Goldsworthy',0);
