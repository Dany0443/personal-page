// apply saved theme and hue from local storage
document.documentElement.classList.add('js');
try {
  const d = document.documentElement;
  const c = localStorage.themeChoice;
  const h = +localStorage.hue;
  if (c === 'light' || c === 'dark') d.dataset.theme = c;
  if (h) d.style.setProperty('--h', [285, 160, 25, 230, 335][h] || 285);
} catch (e) {}

// selector helpers
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const link = (u, t) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
const ico = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;

// stack data
const stack = [
  ['Privacy & Search', [
    ['shield', 'AdGuard Home', 'https://adguard.com/en/adguard-home/overview.html', 'Network-wide DNS server for ad blocking, tracker prevention, and local domain rewrites across all home devices.'],
    ['search', 'SearXNG', 'https://docs.searxng.org', 'Privacy-respecting metasearch engine that aggregates results from multiple engines without tracking or profiling search queries.']]],
  ['Media & Photos', [
    ['image', 'Immich', 'https://immich.app', 'Self-hosted photo and video management solution with automatic phone backups, facial recognition, and albums.'],
    ['disc', 'Navidrome', 'https://www.navidrome.org', 'Lightweight music server and streamer for listening to my personal FLAC and MP3 music collection from any client.']]],
  ['Infrastructure & Monitoring', [
    ['server', 'Beszel', 'https://beszel.dev', 'Minimalist, resource-friendly server monitoring hub and agent for tracking CPU, memory, disk, and docker container stats.'],
    ['monitor', 'Pterodactyl', 'https://pterodactyl.io', 'Open-source game server management panel and Wings daemon running servers in isolated Docker environments.']]],
  ['Game Servers', [
    ['target', 'CS2 Dedicated Server', '', 'Private Counter-Strike 2 dedicated server instance configured for matches, practice, and custom workshop maps.'],
    ['box', 'Minecraft Server', '', 'Fabric server instance running a survival world with friends, performance optimization mods, and automated backups.']]]
];

// hardware and setup data
const rigs = [
  {t: 'OS & Environment', c: 'p', rows: [['OS', link('https://www.opensuse.org/', 'openSUSE') + ' Tumbleweed (KDE Plasma 6, Wayland)'], ['Why', 'Bleeding edge and stable'], ['Terminal & Shell', link('https://sw.kovidgoyal.net/kitty/', 'kitty') + ' + ' + link('https://fishshell.com/', 'fish shell')]]},
  {t: 'Main PC Hardware', c: 's', n: "I built this PC myself from scratch right before the rampocalypse and I'm proud of it.", rows: [['OS', 'openSUSE Tumbleweed'], ['CPU', 'AMD Ryzen 5 7600X'], ['GPU', 'Gigabyte RX 7600 8GB OC'], ['RAM', 'Kingston Fury 2x8GB 5600 MT/s'], ['Primary SSD', 'Samsung 980 Pro 1TB'], ['Secondary SSD', 'Samsung 980 500GB'], ['PSU', 'MSI MAG A650BN']]},
  {t: 'Work Laptop', c: 't', n: 'My portable machine used primarily for work, mobile tasks, and as a reliable backup workstation.', rows: [['OS', 'openSUSE Tumbleweed'], ['CPU', 'AMD Ryzen 7 5800H'], ['GPU', 'NVIDIA GeForce GTX 1650'], ['RAM', '32GB DDR4'], ['Storage', 'Samsung 980 500GB NVMe SSD']]},
  {t: 'Peripherals', c: 'n', rows: [['Mouse', link('https://www.logitechg.com/en-us/products/gaming-mice/pro-x2-superlight-wireless-mouse.html', 'Logitech PRO X SUPERLIGHT 2')], ['Keyboard', link('https://hator.gg/keyboards/rockfall-3-mecha-tkl-wireless/', 'HATOR Rockfall 3 TKL Wireless')], ['Headphones', link('https://hator.gg/audio/hyperpunk-3x/', 'HATOR Hyperpunk 3X Wireless')], ['Monitor', link('https://sg.aoc.com/product/24G4', 'AOC 24G4 (24" 1080p 180Hz)')]]},
  {h: 'Server', n: 'My homelab runs on one dedicated headless machine. It operates purely via the command line and is managed remotely from my main PC over SSH. It also has battery backup power to keep everything running smoothly during sudden outages.'},
  {t: 'Main Server (Debian Headless)', c: 'p', w: 1, n: 'Built to strengthen my sysadmin skills. It hosts my personal websites, runs my entire self-hosted stack, and handles the game servers and heavier tasks.', rows: [['CPU', 'Intel Core i3-1115G4'], ['RAM', '8GB DDR4'], ['Storage', '256GB NVMe SSD + 500GB SSD + 500GB HDD']]},
  {t: 'Phone', c: 't', rows: [['Device', link('https://store.google.com/product/pixel_9', 'Google Pixel 9') + ' running ' + link('https://grapheneos.org/', 'GrapheneOS')]]},
  {t: 'In-House Networking', c: 'n', w: 1, n: 'I replaced the default ISP router setup entirely to have full control over traffic and hardware. The incoming fiber line connects directly into an SFP-to-RJ45 media converter, which feeds into a <strong>FRITZ!Box 7950</strong> handling the main WAN connection and head routing.', n2: 'For my room and local devices, I use a <strong>Xiaomi AX3000T</strong> flashed with custom <strong>OpenWrt</strong> firmware, handling local routing, access point duties, and hardwired Ethernet connections.'}
];

// interests data
const likes = [
  ['code', 'Open Source Software', 'p', "I'm a big advocate for open source. Whenever a viable open-source alternative exists, I will always choose it over proprietary software. I value privacy, transparency, having actual ownership over my tools, and knowing what is running on my hardware."],
  ['server', 'Servers & Infrastructure', 's', 'I really enjoy working with servers and self-hosting services for my own daily needs. Managing homelab machines, spinning up containers, and tweaking networking and infrastructure as a whole is where I spend most of my time tinkering.'],
  ['spark', 'Always Learning', 't', "I'm still learning a ton along the way. Most of what I know comes from hands-on experimentation - trying out new setups, troubleshooting when things break, and figuring out how systems fit together under the hood."]
];

// render stack, setup, and interests sections
$('#stack').innerHTML = stack.map(([g, items]) => `<h3 class="grp rv">${g}</h3><div class="grid">${items.map(([i, n, u, d], k) =>
  `<article class="card c-${k ? 'n' : 's'} rv" style="--d:${k * .08}s"><div class="item"><div class="blob">${ico(i)}</div><div><h3>${u ? link(u, n) : n}</h3><p>${d}</p></div></div></article>`).join('')}</div>`).join('');
$('#rigs').innerHTML = rigs.map(r => r.h
  ? `<div class="sub-h rv"><h3>${r.h}</h3><p>${r.n}</p></div>`
  : `<article class="card c-${r.c} rv${r.w ? ' wide' : ''}"><h3>${r.t}</h3>${r.n ? `<p>${r.n}</p>` : ''}${r.n2 ? `<p>${r.n2}</p>` : ''}${r.rows ? `<dl>${r.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}${r.note ? `<p class="note">${r.note}</p>` : ''}</article>`).join('');
$('#likes').innerHTML = likes.map(([i, t, c, p], k) =>
  `<article class="card big-card c-${c} rv" style="--d:${k * .1}s"><div class="blob">${ico(i)}</div><h3>${t}</h3><p>${p}</p></article>`).join('');

// theme and palette toggles
const hues = [285, 160, 25, 230, 335];
const sysDark = matchMedia('(prefers-color-scheme: dark)');
let hi = 0, manual = null;
try { hi = +localStorage.hue || 0; manual = localStorage.themeChoice || null; } catch {}
const applyLook = () => {
  root.style.setProperty('--h', hues[hi]);
  if (manual) root.dataset.theme = manual; else delete root.dataset.theme;
  try { localStorage.hue = hi; } catch {}
};
applyLook();
$('#hueBtn').onclick = () => { hi = (hi + 1) % hues.length; applyLook(); };
$('#themeBtn').onclick = () => {
  const isDark = manual ? manual === 'dark' : sysDark.matches;
  manual = isDark ? 'light' : 'dark';
  try { localStorage.themeChoice = manual; } catch {}
  applyLook();
};

// wrap each letter in hero title for pointer interaction
const title = $('#title');
title.innerHTML = title.textContent.split(' ').map(w => `<span class="w" aria-hidden="true">${[...w].map(c => `<span class="l">${c}</span>`).join('')}</span>`).join(' ');
const letters = $$('.l', title);
letters.forEach((l, i) => l.style.setProperty('--i', i));

// pointer hover effect on hero title and stage
const stage = $('#stage');
let pt = null, swelled = false;
const resetLetters = () => {
  if (!swelled) return;
  swelled = false;
  letters.forEach(l => { l.style.removeProperty('--w'); l.style.removeProperty('--d'); });
  stage.style.setProperty('--px', 0);
  stage.style.setProperty('--py', 0);
};
addEventListener('pointermove', e => {
  if (calm || e.pointerType === 'touch' || pt) return;
  pt = requestAnimationFrame(() => {
    pt = null;
    if (scrollY > innerHeight) { resetLetters(); return; }
    swelled = true;
    letters.forEach(l => {
      const r = l.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const k = Math.max(0, 1 - d / 220);
      l.style.setProperty('--w', 650 + 350 * k);
      l.style.setProperty('--d', 100 + 40 * k);
    });
    stage.style.setProperty('--px', e.clientX / innerWidth - .5);
    stage.style.setProperty('--py', e.clientY / innerHeight - .5);
  });
}, {passive: true});
root.addEventListener('mouseleave', resetLetters);

// polygon morph animation for hero shape
const N = 160, TAU = Math.PI * 2;
const prof = f => { const a = Array.from({length: N}, (_, i) => f(i / N * TAU)); const m = Math.max(...a); return a.map(r => r / m); };
const lobes = (n, a) => t => 1 + a * Math.cos(n * t);
const squircle = t => Math.pow(Math.abs(Math.cos(t)) ** 4 + Math.abs(Math.sin(t)) ** 4, -.25);
const shapes = [prof(lobes(9, .07)), prof(lobes(5, .13)), prof(squircle), prof(lobes(12, .05)), prof(lobes(3, .16)), prof(() => 1)];
const cs = Array.from({length: N}, (_, i) => Math.cos(i / N * TAU)), sn = Array.from({length: N}, (_, i) => Math.sin(i / N * TAU));
const cur = [...shapes[0]], vel = new Array(N).fill(0);
let si = 0, running = false;
const shapeEl = $('#shape');
const draw = () => { shapeEl.style.clipPath = `polygon(${cur.map((r, i) => `${(50 + 50 * r * cs[i]).toFixed(2)}% ${(50 + 50 * r * sn[i]).toFixed(2)}%`).join(',')})`; };
const step = () => {
  const tg = shapes[si]; let moving = false;
  for (let i = 0; i < N; i++) {
    vel[i] = (vel[i] + (tg[i] - cur[i]) * .09) * .8;
    cur[i] += vel[i];
    if (Math.abs(vel[i]) > .0004 || Math.abs(tg[i] - cur[i]) > .0004) moving = true;
  }
  draw();
  running = moving;
  if (moving) requestAnimationFrame(step);
};
const morph = () => { si = (si + 1) % shapes.length; if (!running) { running = true; requestAnimationFrame(step); } };
draw();
shapeEl.onclick = morph;
if (!calm) setInterval(() => { if (!document.hidden) morph(); }, 4000);

// scroll reveal animation
const rev = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } }), {threshold: .12});
$$('.rv').forEach(el => rev.observe(el));

// floating navigation bar indicator
const bar = $('#bar'), ind = $('#ind'), links = $$('#bar a');
const stops = [$('#top'), ...$$('section')];
let activeI = 0, lock = false;
const geo = () => ({x: links[activeI].offsetLeft, w: links[activeI].offsetWidth});
const place = () => {
  ind.getAnimations().forEach(a => a.cancel());
  const g = geo();
  ind.style.left = g.x + 'px'; ind.style.width = g.w + 'px';
};
function setActive(i) {
  if (i === activeI || i < 0) return;
  const old = activeI;
  const cs = getComputedStyle(ind);
  const from = {x: parseFloat(cs.left) || 0, w: parseFloat(cs.width) || 0};
  ind.getAnimations().forEach(a => a.cancel());
  bar.classList.add('snap');
  links[old].classList.remove('on'); links[i].classList.add('on'); activeI = i;
  const to = geo();
  links[i].classList.remove('on'); links[old].classList.add('on');
  void bar.offsetWidth;
  bar.classList.remove('snap');
  void bar.offsetWidth;
  links[old].classList.remove('on'); links[i].classList.add('on');
  ind.style.left = to.x + 'px'; ind.style.width = to.w + 'px';
  if (!calm) {
    const l = Math.min(from.x, to.x), r = Math.max(from.x + from.w, to.x + to.w);
    ind.animate([
      {left: from.x + 'px', width: from.w + 'px', easing: 'cubic-bezier(.2,0,0,1)'},
      {left: l + 'px', width: (r - l) + 'px', offset: .35, easing: 'cubic-bezier(.3,.7,.2,1)'},
      {left: to.x + 'px', width: to.w + 'px'}
    ], {duration: Math.min(560, 260 + Math.abs(i - old) * 60)});
  }
}
place();
let lastW = innerWidth, placeT;
addEventListener('resize', () => {
  if (innerWidth === lastW) return;
  lastW = innerWidth;
  clearTimeout(placeT);
  placeT = setTimeout(place, 350);
});
if (document.fonts) {
  document.fonts.ready.then(place);
  document.fonts.addEventListener('loadingdone', place);
}

// update active navigation link on scroll
const syncActive = () => {
  let i = 0;
  if (scrollY + innerHeight >= root.scrollHeight - 4) i = stops.length - 1;
  else stops.forEach((s, k) => { if (s.getBoundingClientRect().top <= innerHeight * .47) i = k; });
  setActive(i);
};
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting && !lock) setActive(stops.indexOf(e.target));
}), {rootMargin: '-45% 0px -50% 0px'});
stops.forEach(s => spy.observe(s));

// smooth scroll to position
let gid = 0, glideT0 = 0;
const glide = y => {
  const from = scrollY, to = Math.max(0, Math.min(y, root.scrollHeight - innerHeight)), d = to - from, id = ++gid;
  if (!d || calm) { scrollTo({top: to, behavior: 'instant'}); lock = false; return; }
  const dur = Math.min(1400, Math.max(600, Math.abs(d) * .3)), t0 = glideT0 = performance.now();
  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  root.style.scrollBehavior = 'auto';
  const tick = now => {
    if (id !== gid) return;
    const k = Math.min(1, (now - t0) / dur);
    scrollTo({top: from + d * ease(k), behavior: 'instant'});
    if (k < 1) requestAnimationFrame(tick); else { root.style.scrollBehavior = ''; lock = false; }
  };
  requestAnimationFrame(tick);
};

// cancel smooth scroll on user input
const cancelGlide = e => {
  if (!lock) return;
  if (e.type === 'wheel' && performance.now() - glideT0 < 600) return;
  if (e.type === 'keydown' && !['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) return;
  gid++; lock = false; root.style.scrollBehavior = '';
  syncActive();
};
['wheel', 'touchstart', 'keydown'].forEach(n => addEventListener(n, cancelGlide, {passive: true}));

// navigate to section by index
const go = i => {
  const el = stops[i];
  lock = true;
  setActive(i);
  glide(i === 0 ? 0 : Math.round(el.getBoundingClientRect().top + scrollY) + 1);
  try { history.replaceState(null, '', i === 0 ? location.pathname + location.search : '#' + el.id); } catch {}
};

// handle navigation click
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  const i = a ? stops.indexOf(document.getElementById(a.getAttribute('href').slice(1))) : -1;
  if (i < 0) return;
  e.preventDefault();
  go(i);
});

// keyboard shortcuts for section navigation
addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
  const t = e.target;
  if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
  if (e.key === 'j') go(Math.min(activeI + 1, stops.length - 1));
  else if (e.key === 'k') go(Math.max(activeI - 1, 0));
});

// scroll progress indicator bar
const wave = $('#wave');
$$('path', wave).forEach(p => p.setAttribute('d', 'M2 7H998'));
const prog = $('.p', wave);
let wasBottom = false;
const upd = () => {
  const m = root.scrollHeight - innerHeight, p = m > 0 ? scrollY / m : 0;
  prog.style.strokeDashoffset = 1 - p;
  prog.style.strokeOpacity = p > .003 ? 1 : 0;
  const bottom = m > 0 && scrollY >= m - 4;
  if (!lock && bottom !== wasBottom) { wasBottom = bottom; syncActive(); }
};
addEventListener('scroll', upd, {passive: true});
addEventListener('resize', upd);
if (window.ResizeObserver) new ResizeObserver(upd).observe(document.body);
upd();

// ripple effect on button click
addEventListener('pointerdown', e => {
  const t = e.target.closest('.btn, .ib, .bar a, .tile, .card.lnk');
  if (!t) return;
  const r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, d = document.createElement('span');
  d.className = 'rip';
  d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  t.append(d);
  setTimeout(() => d.remove(), 700);
});

// copy email address to clipboard
const snack = $('#snack');
let snackT;
const say = m => { snack.textContent = m; snack.classList.add('show'); clearTimeout(snackT); snackT = setTimeout(() => snack.classList.remove('show'), 2200); };
$('#emailBtn').onclick = () => {
  const mail = 'danzcrackz@pm.me';
  if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(mail).then(() => say('Email copied to clipboard')).catch(() => location.href = 'mailto:' + mail);
  else location.href = 'mailto:' + mail;
};

// last.fm now playing status
const PROFILE = 'https://www.last.fm/user/Dany0443';
const secure = u => typeof u === 'string' && /^https:\/\//i.test(u) ? u : null;
const music = $('#music'), cover = $('#cover'), disc = $('#fallback');
let fmOk = false, fmSeq = 0, fmCtl = null, fmAt = 0;

// show album cover or fallback icon
const showCover = url => {
  if (url && cover.getAttribute('src') !== url) cover.src = url;
  if (!url) cover.removeAttribute('src');
  cover.hidden = !url;
  disc.style.display = url ? 'none' : '';
};
cover.addEventListener('error', () => showCover(null));

// fetch latest track from last.fm
async function loadFM() {
  if (fmCtl) fmCtl.abort();
  const ctl = fmCtl = new AbortController(), seq = ++fmSeq;
  const timer = setTimeout(() => ctl.abort(), 8000);
  try {
    const res = await fetch('https://lastfm-last-played.biancarosa.com.br/Dany0443/latest-song', {signal: ctl.signal});
    if (!res.ok) throw new Error(res.status);
    const song = (await res.json()).track;
    if (!song) throw new Error('no track');
    if (seq !== fmSeq) return;
    const live = !!(song['@attr'] && song['@attr'].nowplaying === 'true');
    $('#song').textContent = song.name || 'Unknown Track';
    $('#song').href = secure(song.url) || PROFILE;
    $('#artist').textContent = (typeof song.artist === 'object' ? song.artist['#text'] : song.artist) || 'Unknown Artist';
    fmOk = true; fmAt = Date.now();
    music.classList.remove('load');
    music.classList.toggle('on', live);
    $('#status').textContent = live ? 'Listening now' : 'Recently played';
    const imgs = song.image || [];
    const img = imgs.find(i => i.size === 'large' || i.size === 'medium') || imgs[0];
    showCover(img && secure(img['#text']));
  } catch {
    if (seq !== fmSeq) return;
    if (fmOk) {
      music.classList.remove('on');
      $('#status').textContent = 'Recently played';
      return;
    }
    music.classList.remove('load');
    $('#status').textContent = 'Last.fm is offline';
    $('#song').textContent = 'Nothing to show right now';
    $('#artist').textContent = 'My profile has the full history';
    showCover(null);
  } finally {
    clearTimeout(timer);
  }
}
loadFM();
setInterval(() => { if (!document.hidden) loadFM(); }, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - fmAt > 30000) loadFM(); });