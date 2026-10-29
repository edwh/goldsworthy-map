// Fetches image URL, photographer and title for chosen Geograph photos (all CC BY-SA 2.0).
import fs from 'fs';
const ids = process.argv.slice(2);
const out = fs.existsSync('scripts/work/geograph.json') ? JSON.parse(fs.readFileSync('scripts/work/geograph.json', 'utf8')) : {};
for (const id of ids) {
  const html = await (await fetch(`https://www.geograph.org.uk/photo/${id}`, { headers: { 'User-Agent': 'goldsworthy-map/1.0' } })).text();
  const meta = p => (html.match(new RegExp(`<meta[^>]+(?:property|name)="${p}"[^>]+content="([^"]*)"`, 'i')) || [])[1];
  const src = meta('og:image');
  const title = meta('og:title');
  const artist = (html.match(/&copy; Copyright <a[^>]*>([^<]+)<\/a>/) || html.match(/copyright[^<]*<a[^>]*>([^<]+)<\/a>/i) || [])[1];
  const lic = /by-sa\/2\.0/.test(html) ? 'CC BY-SA 2.0' : null;
  out[id] = { src, page: `https://www.geograph.org.uk/photo/${id}`, license: lic, artist, title };
  console.log(id, '|', title, '|', artist, '|', lic, '|', src);
}
fs.writeFileSync('scripts/work/geograph.json', JSON.stringify(out, null, 1));
