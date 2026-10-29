import fs from 'fs'; import {g} from './osgb.mjs';
const SF='Sheepfolds, 1996–2003'; const SFurl='https://www.edenbenchmarks.org.uk/sheepfolds.html';
const fold=(name,place,ref,kind,extra={})=>({name,place,grid:ref,ll:g(ref.split(' & ')[0].replace('Between ','')),group:SF,kind,year:'1996–2003',access:'open',region:'Cumbria & borders',src:'sheepfoldscumbria.co.uk (official list)',...extra});
const S=[
 // Drove Arch Folds
 fold('Spango Farm Drove Arch Fold','Near Sanquhar, Dumfriesshire','NS 829 192','Drove arch fold',{region:'Dumfries & Galloway'}),
 fold('Longtown Drove Arch Fold',"Thomas Armstrong's Yard, Longtown",'NY 377 689','Drove arch fold'),
 fold('Milestone House Drove Arch Fold','Penrith','NY 503 324','Drove arch fold'),
 fold('Shap Beck Quarry Drove Arch Fold','Hanson Quarry, Shap','NY 555 184','Drove arch fold',{note:'Inside a working quarry; check access before going.'}),
 fold('Thunderstone Drove Arch Fold','Near Shap','NY 582 155','Drove arch fold'),
 fold('Scout Green Drove Arch Fold','Near Tebay','NY 594 076','Drove arch fold'),
 fold('Grayrigg Common Drove Arch Fold','Near Kendal','SD 605 981','Drove arch fold'),
 fold('Lambrigg Drove Arch Fold','Near Sedbergh','SD 597 932','Drove arch fold'),
 fold('Wyndhammere Drove Arch Fold','Old Town, near Kirkby Lonsdale','SD 597 847','Drove arch fold'),
 fold('Fellside Drove Arch Fold','Hop House Lane, near Kirkby Lonsdale','SD 593 795','Drove arch fold'),
 fold('Tearnside Drove Arch Fold','Near Kirkby Lonsdale','SD 591 794','Drove arch fold'),
 fold("Drove Arch Hut and Toby's Fold",'Thornton-in-Lonsdale, near Ingleton','SD 684 749','Drove arch fold',{region:'North Yorkshire'}),
 // Cone pinfolds
 fold('Bolton Pinfold Cone','Bolton, near Appleby','NY 638 232','Pinfold cone'),
 fold('Brough Pinfold Cone','Church Brough, near Kirkby Stephen','NY 794 143','Pinfold cone'),
 fold('Crosby Ravensworth Pinfold Cone','Crosby Ravensworth','NY 621 144','Pinfold cone'),
 fold('Outhgill Pinfold Cone','Outhgill, near Kirkby Stephen','NY 784 016','Pinfold cone'),
 fold('Raisbeck Pinfold Cone','Raisbeck, near Tebay','NY 647 072','Pinfold cone'),
 fold('Warcop Pinfold Cone','Warcop, near Kirkby Stephen','NY 750 154','Pinfold cone'),
 // Individual folds
 fold('Melmerby Washfold','Melmerby, near Penrith','NY 613 373','Fold'),
 fold('Potts Gill Fold','Hesket Newmarket','NY 318 375','Fold'),
 fold('Redmire Farm Fold','Mungrisdale, near Keswick','NY 372 296','Fold'),
 fold('Field Boulder Fold','Mungrisdale, near Keswick','NY 375 294','Fold'),
 fold('Deadman Gill Touchstone Fold','Near Brough','NY 823 188','Touchstone fold'),
 fold("Megan's Fold",'Bretherdale, near Tebay','NY 595 046','Fold'),
 fold('Tilberthwaite Touchstone Fold','Near Coniston','NY 307 010','Touchstone fold',{note:'Built from slate from the nearby Tilberthwaite quarry.'}),
 fold('Mountjoy Farm Folds (2)','Underbarrow, near Kendal','SD 460 931 & SD 460 932','Fold',{count:2}),
 fold("Jack's Fold",'Barbondale, near Barbon','SD 647 826','Fold'),
 fold('Fellfoot Drove Folds (16)','Fellfoot Road, Casterton, near Kirkby Lonsdale','Between SD 635 811 & SD 636 785','Fold',{ll:g('SD 6355 7980'),count:16,note:'Sixteen small folds along the lane, each holding a boulder. Walk the lane between the two grid references.'}),
 fold('Red Gill Washfold','Above Cautley Spout, near Sedbergh','SD 676 971','Fold',{note:'A fell walk; above Cautley Spout waterfall.'}),
 fold('Snowball Fold','Dalton-in-Furness','SD 225 737','Fold'),
];
const o=(x)=>({count:1,...x});
const other=[
 {name:'Outclosure',group:'Yorkshire Sculpture Park',year:'2006',ll:[53.6180,-1.5715],place:'Round Wood, YSP, West Bretton',region:'West Yorkshire',access:'open',kind:'Enclosure',note:'One of four permanent works on the 3-mile Goldsworthy trail at YSP (ticketed parking).',url:'https://ysp.org.uk/art-outdoors/featured-collections/andy-goldsworthy',approx:true},
 {name:'Hanging Trees',group:'Yorkshire Sculpture Park',year:'2007',ll:[53.6146,-1.5780],place:'Oxley Bank, YSP',region:'West Yorkshire',access:'open',kind:'Trees in walls',url:'https://ysp.org.uk/art-outdoors/featured-collections/andy-goldsworthy',approx:true},
 {name:'Shadow Stone Fold',group:'Yorkshire Sculpture Park',year:'2007',ll:[53.6128,-1.5560],place:'Country Park, YSP',region:'West Yorkshire',access:'open',kind:'Fold',url:'https://ysp.org.uk/art-outdoors/featured-collections/andy-goldsworthy',approx:true},
 {name:"Peter's Fold",group:'Yorkshire Sculpture Park',year:'2023',ll:[53.6162,-1.5640],place:'YSP',region:'West Yorkshire',access:'open',kind:'Fold',url:'https://ysp.org.uk/art-outdoors/andy-goldsworthy-peters-fold',approx:true},
 {name:'Hanging Stones',group:'Hanging Stones',year:'2017 onwards',ll:[54.3780,-0.9070],place:'Northdale, near Rosedale Abbey, North York Moors',region:'North Yorkshire',access:'limited',kind:'Ten rebuilt buildings on a 6-mile walk',count:10,note:'Southfield House, Hanging Stone House, Sugget Spring, Job’s Well, Hither House, Bogs House, Ebenezer, Northdale Head House, Red House and one new building. Visits by arrangement; buildings are opened with a key.',url:'https://hangingstones.org/introduction/',approx:true},
 {name:'Lambton Earthwork',group:'County Durham earthworks',year:'1988–89',ll:[54.8585,-1.6150],place:'C2C path (Consett & Sunderland Railway Path), near Chester-le-Street',region:'County Durham',access:'open',kind:'Earthwork',note:'Known locally as “The Lambton Worm”. Grassed over; easy to miss.',url:'https://www.durham.gov.uk/media/3804/i-see-public-artwork-County-Durham/pdf/ISeePublicArtworkCountyDurham.pdf',approx:true},
 {name:'Leadgate Maze',group:'County Durham earthworks',year:'1989',ll:[54.8575,-1.7870],place:'Jolly Drovers roundabout, Leadgate, Consett',region:'County Durham',access:'open',kind:'Earthwork',note:'Also called the Jolly Drovers Maze. The cycle path runs through it.',url:'https://www.durham.gov.uk/media/3804/i-see-public-artwork-County-Durham/pdf/ISeePublicArtworkCountyDurham.pdf',approx:true},
 {name:'Grizedale Forest early works',group:'Grizedale Forest',year:'1984',ll:[54.3475,-3.0220],place:'Grizedale Forest, near Hawkshead',region:'Cumbria & borders',access:'gone',kind:'Wood and stone',note:'His Grizedale works, such as Seven Spires, were made to decay. Treat this as history, not a destination.',approx:true},
 {name:'Striding Arches',group:'Striding Arches',year:'2003–08',ll:[55.2590,-3.9830],place:'Cairnhead, near Moniaive, Dumfries & Galloway',region:'Dumfries & Galloway',access:'open',kind:'Four sandstone arches',count:4,note:'Arches on Benbrack, Colt Hill and Bail Hill, plus one through the Byre at Cairnhead. Hill walking for the summit arches.',url:'https://www.ginkgoprojects.co.uk/striding-arches',approx:true},
 {name:'Penpont Cairn (Millennium Cone)',group:'Nithsdale',year:'2000',ll:[55.2335,-3.8070],place:'Just east of Penpont, by the A702',region:'Dumfries & Galloway',access:'open',kind:'Cairn',approx:true},
 {name:'Three Sandstone Cones',group:'Nithsdale',year:'',ll:[55.0770,-3.6080],place:'Gracefield Arts Centre, Dumfries',region:'Dumfries & Galloway',access:'open',kind:'Cones',note:'Listed by Art UK. Check the centre is open before going.',approx:true},
 {name:'Gravestones',group:'Nithsdale',year:'unconfirmed',ll:[55.3600,-3.7350],place:'Dalveen, Dumfries & Galloway',region:'Dumfries & Galloway',access:'gone',kind:'Unconfirmed',note:'Listed on Wikipedia with no date. Not confirmed as built or visitable.',approx:true},
 {name:'Stone House and Coppice Room',group:'Jupiter Artland',year:'2009',ll:[55.9105,-3.4185],place:'Jupiter Artland, Wilkieston, near Edinburgh',region:'Edinburgh & Lothians',access:'limited',kind:'Two works',count:2,note:'Seasonal opening, ticketed.',url:'https://www.jupiterartland.org',approx:true},
 {name:'Hutton Roof and Earth Walls',group:'National Museum of Scotland',year:'1998',ll:[55.9470,-3.1893],place:'National Museum of Scotland, Chambers Street, Edinburgh',region:'Edinburgh & Lothians',access:'open',kind:'Roof garden work; clay walls',count:2,note:'Hutton Roof is on the roof terrace; the earth and slate walls are inside.',url:'https://www.nms.ac.uk',approx:true},
 {name:'Slate, Hole, Wall and Slate Cone',group:'Royal Botanic Garden Edinburgh',year:'1990',ll:[55.9655,-3.2090],place:'Royal Botanic Garden Edinburgh, Inverleith',region:'Edinburgh & Lothians',access:'open',kind:'Slate wall; slate cone',count:2,note:'Cumbrian slate, built with waller Joe Smith. The cone stood near Inverleith House.',url:'https://www.rbge.org.uk/visit/royal-botanic-garden-edinburgh/art-in-edinburgh-garden/',approx:true},
 {name:'Hatfield Cairn',group:'Hertfordshire',year:'',ll:[51.7525,-0.2405],place:'University of Hertfordshire, Hatfield',region:'South of England',access:'open',kind:'Cairn',note:'Listed by Art UK.',approx:true},
 {name:'Moonlit Path',group:'West Sussex',year:'2002',ll:[50.9935,-0.6165],place:'Petworth Park, West Sussex',region:'South of England',access:'open',kind:'Path of white chalk',note:'A path through the woods lined with chalk so it shows by moonlight.',approx:true},
 {name:'Chalk Stones Trail',group:'West Sussex',year:'2002',ll:[50.9320,-0.7700],place:'South Downs above West Dean',region:'South of England',access:'open',kind:'Thirteen chalk boulders on a 5-mile walk',count:13,approx:true},
 {name:'Arch at Goodwood',group:'West Sussex',year:'2002',ll:[50.9060,-0.7560],place:'Former Cass Sculpture Foundation, Goodwood',region:'South of England',access:'gone',kind:'Arch',note:'Cass closed its Goodwood park. Whether the arch is still on site is unconfirmed.',approx:true},
].map(o);
const all=[...S.map(o),...other];
fs.writeFileSync('scripts/work/sites.json',JSON.stringify(all));
console.log(all.length,'markers', all.reduce((a,s)=>a+s.count,0),'works');
