// Merges the site list with hand-checked Commons photos and refined positions.
// Run from the repo root: node scripts/curate.mjs
import fs from 'fs';
import { g } from './osgb.mjs';
const sites = JSON.parse(fs.readFileSync('scripts/work/sites.json', 'utf8'));
const info = Object.fromEntries(JSON.parse(fs.readFileSync('scripts/work/info.json', 'utf8')).map(x => [x.title.slice(5), x]));
const byName = Object.fromEntries(sites.map(s => [s.name, s]));
const slug = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// The Striding Arches are four separate sites; positions from photo geotags.
const SA = byName['Striding Arches']; sites.splice(sites.indexOf(SA), 1);
SA.about = 'Each arch is just under four metres high and is built from 31 blocks of red sandstone. From any one hilltop arch you can see the others.';
const arch = (name, ll, place, note) => ({ ...SA, name, ll, place, count: 1, approx: true, kind: 'Sandstone arch', note });
sites.push(
  arch('Striding Arch, Cairnhead Byre', [55.2530, -4.0430], 'Cairnhead, near Moniaive', 'The first of the four. The arch passes through the end wall of a restored byre. Reached by a forest road.'),
  arch('Striding Arch, Bail Hill', [55.2390, -4.0130], 'Bail Hill, above Glencairn', 'On a hilltop; a steep walk.'),
  arch('Striding Arch, Colt Hill', [55.2670, -4.0500], 'Colt Hill, near Cairnhead', 'On a hilltop; a steep walk.'),
  arch('Striding Arch, Benbrack', [55.2510, -4.0780], 'Benbrack, near Cairnhead', 'The highest of the hilltop arches, on the Southern Upland Way.'),
);

// Jupiter Artland has two separate works.
const J = byName['Stone House and Coppice Room']; sites.splice(sites.indexOf(J), 1);
sites.push(
  { ...J, name: 'Stone House', ll: [55.9060, -3.4275], count: 1, kind: 'Stone building', note: 'Seasonal opening, ticketed.' },
  { ...J, name: 'Stone Coppice', ll: [55.9030, -3.4210], count: 1, kind: 'Stone and trees', place: 'Badger Wood, Jupiter Artland', note: 'Seasonal opening, ticketed.' },
);

// Gateshead.
sites.push({ name: 'Cone', group: 'Gateshead', year: '1990', ll: [54.9650, -1.6100], place: 'Riverside Sculpture Park, Gateshead', region: 'Tyne & Wear', access: 'open', kind: 'Cone', count: 1, approx: true, note: 'In the riverside park by the Tyne.' });

// Positions corrected from photo geotags.
const fix = {
  'Lambton Earthwork': [54.8680, -1.5840], 'Leadgate Maze': [54.8630, -1.7910], 'Penpont Cairn (Millennium Cone)': [55.2370, -3.8010],
  'Three Sandstone Cones': [55.0740, -3.6070], 'Chalk Stones Trail': [50.9150, -0.7850], 'Hutton Roof and Earth Walls': [55.9470, -3.1910],
  'Slate, Hole, Wall and Slate Cone': [55.9660, -3.2100], 'Shadow Stone Fold': [53.6110, -1.5640], 'Grizedale Forest early works': [54.3400, -3.0210],
};
for (const k in fix) byName[k].ll = fix[k];
byName['Grizedale Forest early works'].note = 'His Grizedale works were made to weather away. Taking a Wall for a Walk (1990) was still standing, damaged by felling, when photographed. Ask at the visitor centre.';
byName['Three Sandstone Cones'].year = '';
byName['Chalk Stones Trail'].about = 'Thirteen huge balls of chalk, carved in 2002 and set along a walk over the Downs. They are meant to weather and crumble.';
byName['Hanging Stones'].about = 'Ten farm buildings and shelters in one small valley, each rebuilt around a work by Goldsworthy and joined by a six-mile walk.';
byName['Lambton Earthwork'].about = 'A long, winding grassed earthwork beside the old railway line, built in 1988.';

// Found by the full-text sweeps of Commons and Geograph.
sites.push(
  { name: 'Clougha Pike Chambers', group: 'Forest of Bowland', year: '1999–2001', grid: 'SD 5555 5951', ll: g('SD 5555 5951'), place: 'Old quarry below Grit Fell, Clougha, near Quernmore, Lancashire', region: 'Lancashire', access: 'open', kind: 'Three stone chambers', count: 3,
    about: 'Three stone chambers built from leftover quarry stone, one a year from 1999. Each has an oval opening and is big enough to step inside.',
    note: 'On the Abbeystead estate, reached on foot from the Jubilee Tower car park or Rigg Lane. Locals sometimes call them the Three Chairs, but that name on the OS map is a different feature about 500 m away.', url: 'https://fabulousnorth.com/clougha-pike-chambers/' },
  { name: 'Leaping Arch', group: 'Nithsdale', year: '2009', ll: [55.2723, -3.8149], place: 'Marr Burn, Drumlanrig estate, near Thornhill', region: 'Dumfries & Galloway', access: 'open', kind: 'Sandstone arch', count: 1,
    about: 'A red sandstone arch that leaps across the Marr Burn, built from estate stone for the Duke of Buccleuch.',
    note: 'On the estate walking routes "A Turn Along the Marr Burn" and "Castle View".', url: 'https://www.drumlanrigcastle.co.uk/outdoor-activities/walking-and-hiking-2/' },
  { name: 'Wigton Pinfold', group: 'Sheepfolds, 1996–2003', year: '2009', ll: [54.8200, -3.1596], place: 'Road junction by the petrol station, Wigton', region: 'Cumbria & borders', access: 'open', kind: 'Pinfold', count: 1, approx: true,
    about: 'A red sandstone pinfold, described as the last work of the Sheepfolds project.' },
  { name: 'Stone Gathering', group: 'Northumberland', year: '', ll: [55.1428, -2.0721], place: 'Stelling by Lunga Crags, near Elsdon, Northumberland', region: 'Northumberland', access: 'gone', kind: 'Stone-filled stelling', count: 1,
    about: 'A small circular stelling, a stone shelter for sheep, filled with gathered stones.',
    note: 'Unconfirmed. One photographer names it as Goldsworthy’s Stone Gathering; another says only that it apparently is. Not on any OS map.' },
);
const GZ = byName['Grizedale Forest early works'];
Object.assign(GZ, { name: 'Taking a Wall for a Walk', group: 'Grizedale Forest', year: '1990', access: 'open', kind: 'Dry-stone wall', approx: true,
  about: 'A dry-stone wall that winds between the trees. It is the one Grizedale work by Goldsworthy known to survive; Seven Spires and Sidewinder have gone.',
  note: 'Some of the trees it weaves around have been felled. Hard to find, so ask at the visitor centre.' });
const GR = byName['Gravestones'];
Object.assign(GR, { year: 'under construction', ll: [55.3400, -3.6700],
  about: 'A walled enclosure, about 25 metres square, filled with stones turned up by grave digging in 108 Dumfries and Galloway cemeteries.',
  note: 'Still being built in 2026, with no opening date or access arrangements published. Position is only the Dalveen Pass.' });
byName['Leadgate Maze'].about = 'A maze of grassed banks on the site of the old Eden Pit colliery. A viewing platform lets you see the pattern.';
byName['Penpont Cairn (Millennium Cone)'].about = 'A tall, egg-shaped red sandstone cairn in a field near the artist’s home village, built for the millennium.';

const PH = {
  'Brough Pinfold Cone': ['Brough Cone Pinfold by Andy Goldsworthy - geograph.org.uk - 5966898', '“Pinfold Cone” by Andrew Goldsworthy - geograph.org.uk - 5965869'],
  'Crosby Ravensworth Pinfold Cone': ["Andy Goldsworthy's Pinfold Cone at Crosby Ravensworth"],
  'Outhgill Pinfold Cone': ['Pinfold Cone - geograph.org.uk - 1302475'],
  'Raisbeck Pinfold Cone': ['Pinfold with Goldsworthy Cone - geograph.org.uk - 1169103', 'Stone Acorn - geograph.org.uk - 712319'],
  'Warcop Pinfold Cone': ["Andy Goldsworthy's cone sculpture at Warcop", 'Pinfold and Goldsworthy Sculpture - geograph.org.uk - 1170628'],
  'Melmerby Washfold': ['Melmerby washfold - geograph.org.uk - 2866131'],
  'Redmire Farm Fold': ['Redmire Farm Sheepfold - geograph.org.uk - 1713413', 'Redmire Farm Fold - geograph.org.uk - 5353868'],
  'Field Boulder Fold': ['Sheepfold in a Pile of Stones - geograph.org.uk - 1713400'],
  'Tilberthwaite Touchstone Fold': ['Tilberthwaite Touchstone Fold - geograph.org.uk - 354959', 'Slate patterns - geograph.org.uk - 354969', 'Tilberthwaite Touchstone Fold - geograph.org.uk - 2138954'],
  'Mountjoy Farm Folds (2)': ['Andy Goldsworthy-Fold2'],
  "Jack's Fold": ["Jack's Fold, Barbondale (by Andy Goldsworthy)"],
  'Fellfoot Drove Folds (16)': ['Fellfoot Drove Sheepfold - geograph.org.uk - 1155943', 'Andy Goldsworthy sheepfold, north end of Fellfoot Road', 'Sheepfold - geograph.org.uk - 1130729'],
  'Red Gill Washfold': ['Washfold, Red Gill - geograph.org.uk - 1312164', 'Sheepfold, Red Gill Beck - geograph.org.uk - 4853103'],
  'Hanging Trees': ['Hanging Trees - geograph.org.uk - 398014'],
  'Shadow Stone Fold': ['Detail of Shadow Stone Fold by Andy Goldsworthy'],
  'Lambton Earthwork': ['The Lambton Worm - geograph.org.uk - 141448'],
  'Leadgate Maze': ['The Jolly Drovers Maze, Leadgate - geograph.org.uk - 141446', 'The Leadgate Maze - geograph.org.uk - 4803084'],
  'Taking a Wall for a Walk': ['"Taking a Wall for a Walk" - Grizedale Forest'],
  'Striding Arch, Cairnhead Byre': ['Striding Arch, Cairnhead - geograph.org.uk - 432703'],
  'Striding Arch, Bail Hill': ['Bail Hill Striding Arch - geograph.org.uk - 1619970'],
  'Striding Arch, Colt Hill': ['Striding Arch sculpture by Andy Goldsworthy on Colt Hill'],
  'Striding Arch, Benbrack': ['Striding Arch on top of Benbrack - geograph.org.uk - 1277046'],
  'Penpont Cairn (Millennium Cone)': ['Millennium Cairn - geograph.org.uk - 376962', 'Landscape with egg - Stone Curlew or Roc^'],
  'Three Sandstone Cones': ['Three Cones - geograph.org.uk - 1769909'],
  'Stone House': ["Jupiter Artland - 'Stone House - Bonnington'"],
  'Stone Coppice': ["'Stone Coppice' at Jupiter Artland"],
  'Hutton Roof and Earth Walls': ['Sculpture in National Museum of Scotland by Andy Goldsworthy', 'Hearth, Andy Goldsworthy'],
  'Slate, Hole, Wall and Slate Cone': ['Goldsworthy Edinburgh', 'Cone by Andy Goldsworthy, Royal Botanic Garden, Edinburgh'],
  'Chalk Stones Trail': ['Giant chalk snowball - geograph.org.uk - 465013', "One of Andy Goldsworthy's chalk balls - geograph.org.uk - 1283156", 'Boulder on the Chalk Stones Trail'],
  'Arch at Goodwood': ['AndyGoldsworthy-ArchatGoodwood-2002'],
  'Cone': ['Gateshead Riverside Park (2) - geograph.org.uk - 4350752'],
};
// Geograph photos fetched by scripts/geograph.mjs, by photo id.
const geo = JSON.parse(fs.readFileSync('scripts/work/geograph.json', 'utf8'));
const GEO = {
  'Clougha Pike Chambers': ['3546167', '7766725'],
  'Leaping Arch': ['5091414'],
  'Wigton Pinfold': ['2480823'],
  'Stone Gathering': ['596579'],
  'Bolton Pinfold Cone': ['4572764'],
  'Raisbeck Pinfold Cone': ['8406056'],
  'Deadman Gill Touchstone Fold': ['5954657'],
  'Fellfoot Drove Folds (16)': ['2909535'],
};
const keys = Object.keys(info);
const find = t => info[keys.find(k => k.startsWith(t))];
const OK = /^(CC BY|CC0|Public domain|FAL)/i;
const KIND = {
  'Drove arch fold': 'A sheepfold on an old drove road, rebuilt with a stone arch in its wall. The arches recall the animals driven along these routes to market.',
  'Pinfold cone': 'A village pinfold, the walled pound where stray animals were once held, rebuilt with a tall stone cone at its centre.',
  'Touchstone fold': 'A sheepfold rebuilt with a touchstone set into its wall: a panel of stone that invites people passing to touch it.',
  'Fold': 'One of the old Cumbrian sheepfolds rebuilt by Goldsworthy and local wallers, often holding a boulder, a cairn or another stone feature.',
};
let missing = 0, n = 0;
for (const s of sites) {
  s.id = slug(s.name);
  if (!s.about && KIND[s.kind]) s.about = KIND[s.kind];
  s.photos = [];
  for (const t of PH[s.name] || []) {
    const f = find(t);
    if (!f) { console.log('MISSING', s.name, t); missing++; continue; }
    if (!OK.test(f.license || '')) { console.log('LICENCE?', t, f.license); continue; }
    s.photos.push({ src: f.thumb, page: f.page, license: f.license, artist: f.artist || 'Unknown', title: f.title.slice(5) });
    n++;
  }
  for (const id of GEO[s.name] || []) {
    const f = geo[id];
    if (!f || f.license !== 'CC BY-SA 2.0' || !f.artist) { console.log('GEOGRAPH?', s.name, id); missing++; continue; }
    s.photos.push({ src: f.src, page: f.page, license: f.license, artist: f.artist, title: f.title.replace(/\s*&amp;copy;.*$/, '') });
    n++;
  }
}
sites.sort((a, b) => b.ll[0] - a.ll[0]);
fs.writeFileSync('data/sites.json', JSON.stringify(sites, null, 1) + '\n');
console.log(sites.length, 'sites', n, 'photos', missing, 'missing', sites.filter(s => s.photos.length).length, 'with photos');
