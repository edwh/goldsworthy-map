'use strict';

const STORE_KEY = 'goldsworthy-visited-v1';
const ACCESS = { open: 'Open to visit', limited: 'Ticketed or by arrangement', gone: 'Lost, unfinished or unconfirmed' };
const REGIONS = ['Edinburgh & Lothians', 'Dumfries & Galloway', 'Northumberland', 'Tyne & Wear', 'County Durham', 'Cumbria & borders', 'Lancashire', 'North Yorkshire', 'West Yorkshire', 'South of England'];

const $ = id => document.getElementById(id);
const show = { open: true, limited: true, gone: true };
let hideVisited = false;
let sites = [];
let current = null;
let photoIndex = 0;

// Visited list, kept in this browser. Storage can be blocked, so every access is guarded.
function loadVisited() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
let visited = loadVisited();
function saveVisited() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(visited)); } catch { /* private mode: keep in memory */ }
}

const map = L.map('map', { zoomControl: true }).setView([54.6, -2.6], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function pinIcon(s) {
  const cls = ['pin', s.access, s.count > 1 ? 'multi' : '', visited[s.id] ? 'visited' : ''].join(' ');
  const size = s.count > 1 ? 20 : 16;
  return L.divIcon({ className: '', html: `<span class="${cls}"></span>`, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

function fmtDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isShown(s) {
  return show[s.access] && !(hideVisited && visited[s.id]);
}

function refreshMarkers() {
  for (const s of sites) {
    s.marker.setIcon(pinIcon(s));
    if (isShown(s)) s.marker.addTo(map); else s.marker.remove();
  }
}

function renderProgress() {
  const reachable = sites.filter(s => s.access !== 'gone');
  const done = reachable.filter(s => visited[s.id]).length;
  const pct = reachable.length ? Math.round(done / reachable.length * 100) : 0;
  $('progress').innerHTML = `<span><b>${done}</b> of ${reachable.length} places visited</span><div class="bar"><i style="width:${pct}%"></i></div>`;
}

function renderList() {
  const list = $('list');
  list.textContent = '';
  for (const r of REGIONS) {
    const items = sites.filter(s => s.region === r && isShown(s));
    if (!items.length) continue;
    const sec = document.createElement('section');
    sec.className = 'region';
    const h = document.createElement('h3');
    h.textContent = `${r} · ${items.length}`;
    sec.append(h);
    for (const s of items) {
      const b = document.createElement('button');
      b.className = 'item' + (visited[s.id] ? ' is-visited' : '');
      b.innerHTML = `<i class="dot ${visited[s.id] ? 'visited' : s.access}"></i><span><span class="nm"></span><span class="pl"></span></span><span class="tag"></span>`;
      b.querySelector('.nm').textContent = s.name;
      b.querySelector('.pl').textContent = s.place;
      b.querySelector('.tag').textContent = visited[s.id] ? '✓ ' + fmtDate(visited[s.id]) : (s.count > 1 ? '×' + s.count : '');
      b.onclick = () => { openSite(s); map.setView(s.ll, Math.max(map.getZoom(), 13)); closeSheet(); };
      sec.append(b);
    }
    list.append(sec);
  }
}

function renderFilters() {
  const f = $('filters');
  for (const k of Object.keys(ACCESS)) {
    const b = document.createElement('button');
    b.className = 'chip';
    b.setAttribute('aria-pressed', 'true');
    b.innerHTML = `<i class="dot ${k}"></i>`;
    b.append(ACCESS[k]);
    b.onclick = () => { show[k] = !show[k]; b.setAttribute('aria-pressed', show[k]); refreshAll(); };
    f.append(b);
  }
  const hv = document.createElement('button');
  hv.className = 'chip';
  hv.setAttribute('aria-pressed', 'false');
  hv.innerHTML = '<i class="dot visited"></i>Hide visited';
  hv.onclick = () => { hideVisited = !hideVisited; hv.setAttribute('aria-pressed', hideVisited); refreshAll(); };
  f.append(hv);
}

function refreshAll() { refreshMarkers(); renderList(); renderProgress(); }

// Modal
const modal = $('modal');

function showPhoto() {
  const p = current.photos[photoIndex];
  const has = !!p;
  $('m-photo').hidden = !has;
  $('m-credit').hidden = !has;
  modal.classList.toggle('nophoto', !has);
  if (!has) return;
  const img = $('m-img');
  img.src = p.src;
  img.alt = `${current.name}: photo by ${p.artist}`;
  const many = current.photos.length > 1;
  $('m-prev').hidden = $('m-next').hidden = $('m-count').hidden = !many;
  $('m-count').textContent = `${photoIndex + 1} / ${current.photos.length}`;
  const c = $('m-credit');
  c.textContent = 'Photo: ';
  const a = document.createElement('a');
  a.href = p.page; a.target = '_blank'; a.rel = 'noopener';
  a.textContent = `${p.artist}, ${p.license}`;
  c.append(a, p.page.includes('geograph.org.uk') ? ', via Geograph' : ', via Wikimedia Commons');
}

function renderVisitButton() {
  const b = $('m-visit');
  const d = visited[current.id];
  b.classList.toggle('done', !!d);
  b.textContent = d ? `✓ Visited ${fmtDate(d)} · Undo` : 'Mark as visited';
}

function openSite(s) {
  current = s;
  photoIndex = 0;
  $('m-group').textContent = s.group;
  $('m-name').textContent = s.name;
  $('m-place').textContent = s.place;
  $('m-about').textContent = s.about || '';
  $('m-about').hidden = !s.about;
  $('m-note').textContent = s.note || '';
  $('m-note').hidden = !s.note;
  const meta = $('m-meta');
  meta.textContent = '';
  const row = (k, v, mono) => {
    if (!v) return;
    const dt = document.createElement('dt'); dt.textContent = k;
    const dd = document.createElement('dd'); dd.textContent = v; if (mono) dd.className = 'mono';
    meta.append(dt, dd);
  };
  row('Type', s.kind + (s.count > 1 ? ` (${s.count})` : ''));
  row('Date', s.year);
  row('Access', ACCESS[s.access]);
  row('Grid ref', s.grid, true);
  row('Lat, long', s.ll.join(', ') + (s.approx ? ' (approx.)' : ''), true);
  $('m-dir').href = `https://www.google.com/maps/dir/?api=1&destination=${s.ll[0]},${s.ll[1]}`;
  $('m-more').hidden = !s.url;
  if (s.url) $('m-more').href = s.url;
  renderVisitButton();
  showPhoto();
  if (!modal.open) { modal.showModal(); modal.focus(); }
  modal.scrollTop = 0;
  if (location.hash !== '#' + s.id) history.replaceState(null, '', '#' + s.id);
}

$('m-visit').onclick = () => {
  if (visited[current.id]) delete visited[current.id];
  else visited[current.id] = new Date().toISOString().slice(0, 10);
  saveVisited();
  renderVisitButton();
  refreshAll();
};
$('m-zoom').onclick = () => { modal.close(); map.setView(current.ll, 15); };
$('m-close').onclick = () => modal.close();
$('m-prev').onclick = () => { photoIndex = (photoIndex - 1 + current.photos.length) % current.photos.length; showPhoto(); };
$('m-next').onclick = () => { photoIndex = (photoIndex + 1) % current.photos.length; showPhoto(); };
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
modal.addEventListener('close', () => history.replaceState(null, '', location.pathname + location.search));
modal.addEventListener('keydown', e => {
  if (!current || current.photos.length < 2) return;
  if (e.key === 'ArrowLeft') $('m-prev').click();
  if (e.key === 'ArrowRight') $('m-next').click();
});

// Phone list sheet
const sheet = $('side');
const toggle = $('listtoggle');
function closeSheet() { sheet.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'List'; }
toggle.onclick = () => {
  const open = !sheet.classList.contains('open');
  sheet.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.textContent = open ? 'Map' : 'List';
};

// Another tab changed the visited list.
addEventListener('storage', e => { if (e.key === STORE_KEY) { visited = loadVisited(); refreshAll(); } });

fetch('data/sites.json').then(r => r.json()).then(data => {
  sites = data;
  for (const s of sites) {
    s.marker = L.marker(s.ll, { icon: pinIcon(s), title: s.name, keyboard: true })
      .bindTooltip(s.name, { direction: 'top', offset: [0, -8] })
      .on('click', () => openSite(s));
  }
  renderFilters();
  refreshAll();
  map.fitBounds(L.latLngBounds(sites.map(s => s.ll)), { padding: [30, 30] });
  const id = location.hash.slice(1);
  const s = sites.find(x => x.id === id);
  if (s) { map.setView(s.ll, 13); openSite(s); }
});
