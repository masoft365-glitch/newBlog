// Minimal SPA: loads posts.json, supports categories, search, trending and post view.
// Keep posts in posts.json for easy editing.

const YEAR_EL = () => document.getElementById('year').textContent = new Date().getFullYear();
YEAR_EL();

const APP = document.getElementById('app');
let posts = [];
const categories = [
  {id:'dev', name:'DEV'},
  {id:'ai', name:'AI'},
  {id:'tech', name:'Tech'},
  {id:'edu', name:'Education'},
  {id:'finance', name:'Finance'},
  {id:'google', name:'Google/YT'},
  {id:'social', name:'Instagram/Fb/X'},
  {id:'reddit', name:'Reddit Trend'}
];

function route(){
  const raw = location.hash.replace(/^#/, '') || '/';
  if(raw.startsWith('/post/')){
    renderPost(raw.split('/post/')[1]);
  } else if(raw.startsWith('/trending')){
    renderTrending();
  } else if(raw.startsWith('/categories')){
    renderCategories();
  } else if(raw.startsWith('/about')){
    renderAbout();
  } else {
    // home with optional q param
    const q = parseQuery(raw).q || '';
    renderHome(q);
  }
}

function parseQuery(raw){
  const idx = raw.indexOf('?');
  if(idx === -1) return {};
  return Object.fromEntries(new URLSearchParams(raw.slice(idx+1)));
}

async function load(){
  try{
    const res = await fetch('/posts.json');
    posts = await res.json();
  }catch(e){
    console.error('Failed loading posts.json', e);
    posts = [];
  }
  route();
}

function renderHome(q=''){
  const qEsc = escapeHtml(q || '');
  APP.innerHTML = `
    <section class="hero">
      <div class="hero-left">
        <h2>Pulse — Catch what's trending</h2>
        <p>Curated Dev posts, AI & Tech insights, Education, Finance and social trends from Google, YouTube, Instagram, Facebook, X and Reddit.</p>
      </div>
      <div>
        <div class="chips" id="chipContainer"></div>
        <div style="height:10px"></div>
        <div class="searchbar">
          <input id="search" placeholder="Search posts, tags, authors..." value="${qEsc}" />
          <button id="btnTrending" class="chip">🔥 Trending</button>
        </div>
      </div>
    </section>
    <section class="grid" id="grid"></section>
  `;
  const chipContainer = document.getElementById('chipContainer');
  categories.forEach(c => {
    const el = document.createElement('button');
    el.className = 'chip';
    el.textContent = c.name;
    el.dataset.id = c.id;
    el.addEventListener('click', () => {
      location.hash = `#/categories?cat=${c.id}`;
    });
    chipContainer.appendChild(el);
  });

  document.getElementById('btnTrending').addEventListener('click', () => {
    location.hash = '#/trending';
  });

  document.getElementById('search').addEventListener('input', (e) => {
    const v = e.target.value;
    // update url without adding history
    history.replaceState(null, '', `#/` + (v ? `?q=${encodeURIComponent(v)}` : ''));
    renderCards(v ? filterPostsByQuery(v) : posts);
  });

  renderCards(q ? filterPostsByQuery(q) : posts);
}

function renderCards(list){
  const grid = document.getElementById('grid');
  if(!list || list.length === 0){
    grid.innerHTML = `<div class="card"><div class="card-body"><h3>No posts</h3><p class="card-excerpt">No posts match your search.</p></div></div>`;
    return;
  }
  grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-media">${renderIconForCategory(p.category)}</div>
      <div class="card-body">
        <h3 class="card-title"><a href="#/post/${p.id}">${escapeHtml(p.title)}</a></h3>
        <p class="card-excerpt">${escapeHtml(p.excerpt)}</p>
        <div class="card-meta">${escapeHtml(p.date)} • ${escapeHtml(p.readTime || '')} • ${escapeHtml(p.author || '')}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderIconForCategory(cat){
  const col = {
    dev: ['#00d4ff','#7c4dff'],
    ai: ['#ffd166','#ef476f'],
    tech: ['#7c4dff','#00d4ff'],
    edu: ['#00e396','#7c4dff'],
    finance: ['#00d4ff','#00e396'],
    google: ['#ffb86b','#ff5c7c'],
    social: ['#7c4dff','#00d4ff'],
    reddit: ['#ff6b6b','#ffb86b']
  }[cat] || ['#7c4dff','#00d4ff'];

  // small SVG with gradient to feel 3D
  return `
  <svg class="icon-3d" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="g${cat}" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${col[0]}"/>
        <stop offset="1" stop-color="${col[1]}"/>
      </linearGradient>
      <filter id="f${cat}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="${col[1]}" flood-opacity="0.18"/>
      </filter>
    </defs>
    <g filter="url(#f${cat})">
      <rect x="6" y="6" rx="10" width="36" height="36" fill="url(#g${cat})" />
      <g opacity="0.14" fill="#fff">
        <rect x="8" y="8" width="10" height="10" rx="3" />
        <circle cx="32" cy="22" r="6" />
      </g>
    </g>
  </svg>`;
}

function filterPostsByQuery(q){
  const qq = q.trim().toLowerCase();
  if(!qq) return posts;
  return posts.filter(p => (p.title + ' ' + (p.excerpt||'') + ' ' + (p.tags||[]).join(' ') + ' ' + (p.author||'')).toLowerCase().includes(qq));
}

function renderCategories(){
  const raw = parseQuery(location.hash.replace(/^#/, ''));
  const cat = raw.cat || '';
  APP.innerHTML = `
    <h2>Categories</h2>
    <div class="chips" id="cats"></div>
    <section id="catGrid" class="grid" style="margin-top:14px"></section>
  `;
  const cats = document.getElementById('cats');
  categories.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (c.id === cat ? ' active' : '');
    btn.textContent = c.name;
    btn.onclick = () => { location.hash = `#/categories?cat=${c.id}`; };
    cats.appendChild(btn);
  });
  const list = cat ? posts.filter(p => p.category === cat) : posts;
  renderCards(list);
}

function renderTrending(){
  // simple trending algorithm: posts with trendingScore or most views
  const ranked = posts.slice().sort((a,b) => (b.trendingScore || b.views || 0) - (a.trendingScore || a.views || 0));
  APP.innerHTML = `<h2>Trending Now</h2><div class="grid" id="trendGrid" style="margin-top:12px"></div>`;
  const grid = document.getElementById('trendGrid');
  renderCards(ranked.slice(0,12));
}

function renderPost(id){
  const post = posts.find(p => String(p.id) === String(id));
  if(!post){
    APP.innerHTML = `<a class="back" href="#/">← Back</a><div class="card post-content"><h3>Post not found</h3></div>`;
    return;
  }
  APP.innerHTML = `
    <a class="back" href="#/">← Back</a>
    <article class="post-content">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
        <div style="width:60px;height:60px">${renderIconForCategory(post.category)}</div>
        <div>
          <h1 style="margin:0">${escapeHtml(post.title)}</h1>
          <div class="card-meta">${escapeHtml(post.author || '')} • ${escapeHtml(post.date)} • ${escapeHtml(post.readTime||'')}</div>
        </div>
      </div>
      <div style="margin-top:18px">${post.html || `<p>${escapeHtml(post.content || '')}</p>`}</div>
      <div style="margin-top:18px;display:flex;gap:10px;align-items:center">
        <button id="shareBtn" class="chip">Share</button>
        <a class="chip" href="${encodeShareLink(post, 'twitter')}" target="_blank">Share on X</a>
        <a class="chip" href="${encodeShareLink(post, 'facebook')}" target="_blank">Share on FB</a>
      </div>
    </article>
  `;
  const shareBtn = document.getElementById('shareBtn');
  shareBtn.addEventListener('click', async () => {
    const url = location.href;
    try{
      await navigator.share?.({title: post.title, text: post.excerpt || '', url});
    }catch(e){
      navigator.clipboard?.writeText(url);
      alert('Link copied to clipboard');
    }
  });
}

function encodeShareLink(post, platform){
  const url = encodeURIComponent(location.href);
  const text = encodeURIComponent(post.title + ' — ' + (post.excerpt||''));
  if(platform === 'twitter'){
    return `https://x.com/intent/tweet?text=${text}&url=${url}`;
  }else{
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }
}

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

/* initial load & router */
window.addEventListener('hashchange', route);
load();