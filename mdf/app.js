/* Maryland Deathfest XXII companion.
   bands.json is read-only seed data. Everything the two of you type — Paige's
   own score, seen-it ticks, notes — lives in localStorage and is merged over
   the seed on load, keyed by band name. */

'use strict';

var STORE = 'mdf-xxii-state-v1';
var BANDS = [];
var state = {};                 // name -> {seen, paigeRank, notes}
var cards = new Map();          // band -> card element
var groups = [];
var order = 'paige';
var mode = 'all';

var listEl, countEl, tallyEl, qEl, sortEl, statusEl;

/* ---------- persistence ---------- */

function loadState(){
  try{
    var raw = localStorage.getItem(STORE);
    state = raw ? JSON.parse(raw) : {};
  }catch(e){ state = {}; }
  if(!state || typeof state !== 'object') state = {};
}

function saveState(){
  try{ localStorage.setItem(STORE, JSON.stringify(state)); }
  catch(e){ setStatus('Could not save on this device — private browsing blocks storage.'); }
}

function userOf(name){
  if(!state[name]) state[name] = { seen:false, paigeRank:null, notes:'' };
  return state[name];
}

/* ---------- helpers ---------- */

function el(tag, cls, text){
  var n = document.createElement(tag);
  if(cls) n.className = cls;
  if(text != null) n.textContent = text;
  return n;
}

function byName(a,b){ return a.sortName.localeCompare(b.sortName); }

function gapOf(b){
  var r = userOf(b.name).paigeRank;
  return r == null ? -1 : Math.abs(r - b.paige);
}

var SORTS = {
  paige:  { cmp:function(a,b){ return b.paige - a.paige || byName(a,b); },
            group:function(b){ return scoreBand(b.paige); } },
  gap:    { cmp:function(a,b){ return gapOf(b) - gapOf(a) || byName(a,b); },
            group:null },
  name:   { cmp:byName,
            group:function(b){ return b.sortName.charAt(0).toUpperCase(); } },
  country:{ cmp:function(a,b){ return a.country0.localeCompare(b.country0) || byName(a,b); },
            group:function(b){ return b.country0; } },
  formed: { cmp:function(a,b){
              return ((a.formed===null)-(b.formed===null)) || (a.formed-b.formed) || byName(a,b); },
            group:function(b){ return b.formed ? (Math.floor(b.formed/10)*10)+'s' : 'Year unknown'; } },
  verdict:{ cmp:function(a,b){
              return (VRANK[a.verdict] - VRANK[b.verdict]) || (b.stars - a.stars)
                     || (b.paige - a.paige) || byName(a,b); },
            group:function(b){ return VLABEL[b.verdict]; } }
};

/* Paige's own three lists, plus the handful of bands she did not write down. */
var VRANK  = { want:0, maybe:1, pass:2, 'undefined':3, 'null':3 };
var VLABEL = { want:'Want to see', maybe:'Maybe', pass:'Pass' };
VRANK[undefined] = 3; VRANK[null] = 3;
VLABEL[undefined] = 'Not on her list'; VLABEL[null] = 'Not on her list';

var SCORE_BANDS = [[9,'Paige 9–10'],[7,'Paige 7–8'],[5,'Paige 5–6'],[3,'Paige 3–4'],[1,'Paige 1–2']];
function scoreBand(s){
  for(var i=0;i<SCORE_BANDS.length;i++) if(s >= SCORE_BANDS[i][0]) return SCORE_BANDS[i][1];
  return SCORE_BANDS[SCORE_BANDS.length-1][1];
}

function matchesFilter(b){
  var u = userOf(b.name);
  switch(mode){
    case 'p8':      return b.paige >= 8;
    case 'p6':      return b.paige >= 6;
    case 'sets':    return !!b.specialSet;
    case 'rec':     return b.rec;
    case 'moved':   return b.delta !== 0 || b.v3Prev !== null;
    case 'unrated': return u.paigeRank == null;
    default:        return true;
  }
}

/* ---------- card ---------- */

function buildCard(b){
  var u = userOf(b.name);

  var card = el('article','band');
  card.id = b.slug;

  /* ---- collapsed row ---- */
  var head = el('button','rowhead');
  head.type = 'button';
  head.setAttribute('aria-expanded','false');

  var score = el('div','score' + (b.paige >= 8 ? ' s-hi' : ''));
  score.appendChild(document.createTextNode(String(b.paige)));
  score.appendChild(el('small', null, 'my call'));
  head.appendChild(score);

  var mid = el('div');
  var h3 = el('h3','bandname', b.name);
  if(b.specialSet) h3.appendChild(el('span','setnote', b.specialSet));
  mid.appendChild(h3);

  var facts = [b.country, b.formed ? 'formed ' + b.formed : null, b.genre].filter(Boolean).join('  ·  ');
  mid.appendChild(el('p','facts', facts));

  var tags = el('div','tags');
  if(b.verdict){
    tags.appendChild(el('span','tag v-' + b.verdict,
      VLABEL[b.verdict] + (b.stars ? ' ' + '★'.repeat(b.stars) : '')));
  }
  if(b.rec)   tags.appendChild(el('span','tag rec','Drew & Ryan rec'));
  if(b.recBy) tags.appendChild(el('span','tag rec', b.recBy));
  /* v3 moved the score after her notes; the v1→v2 tag has to stop at the pre-v3 value. */
  if(b.v3Prev !== null){
    tags.appendChild(el('span','tag v3',
      (b.paige > b.v3Prev ? '▲ ' : '▼ ') + b.v3Prev + ' → ' + b.paige));
  }
  if(b.delta !== 0){
    tags.appendChild(el('span','tag ' + (b.delta > 0 ? 'up' : 'down'),
      (b.delta > 0 ? '▲ ' : '▼ ') + b.paigePrev + ' → ' + (b.v3Prev !== null ? b.v3Prev : b.paige)));
  }
  if(b.specialSet) tags.appendChild(el('span','tag','Special set'));
  if(b.deepDive)   tags.appendChild(el('span','tag','Deep dive'));
  var seenTag = el('span','tag seentag','Seen');
  tags.appendChild(seenTag);
  mid.appendChild(tags);
  head.appendChild(mid);

  var her = el('div','her');
  var herNum = el('b');
  var herLabel = el('small', null, 'Paige');
  var herGap = el('span','gap');
  her.appendChild(herNum); her.appendChild(herLabel); her.appendChild(herGap);
  head.appendChild(her);

  card.appendChild(head);

  /* ---- expanded detail ---- */
  var detail = el('div','detail');

  detail.appendChild(el('p', null, b.why));

  if(b.paigeQuote){
    var q = el('p','quote');
    q.appendChild(document.createTextNode('“' + b.paigeQuote + '”'));
    q.appendChild(el('span','attrib', '— Paige'));
    detail.appendChild(q);
  }

  if(b.v3Note){
    var v3 = el('p','revision v3note');
    v3.appendChild(el('span','label', 'Moved ' + b.v3Prev + ' → ' + b.paige + '.'));
    v3.appendChild(document.createTextNode(' ' + b.v3Note));
    detail.appendChild(v3);
  }

  if(b.paigeNote){
    var rev = el('p','revision');
    var to = b.v3Prev !== null ? b.v3Prev : b.paige;
    rev.appendChild(el('span','label', 'Earlier, ' + b.paigePrev + ' → ' + to + '.'));
    rev.appendChild(document.createTextNode(' ' + b.paigeNote));
    detail.appendChild(rev);
  }

  [['Pedigree.', b.pedigree], ['Gets to the US.', b.usFrequency]].forEach(function(pair){
    var p = el('p','meta');
    p.appendChild(el('span','label', pair[0]));
    p.appendChild(document.createTextNode(' ' + pair[1]));
    detail.appendChild(p);
  });

  if(b.specialSet){
    var sp = el('p','meta');
    sp.appendChild(el('span','label','Playing.'));
    sp.appendChild(document.createTextNode(' ' + b.specialSet));
    detail.appendChild(sp);
  }

  /* rating pad */
  var fs = el('fieldset');
  fs.appendChild(el('legend', null, "Paige's score"));
  var pad = el('div','rate');
  var rateBtns = [];
  for(var n=1;n<=10;n++){
    (function(v){
      var btn = el('button', null, String(v));
      btn.type = 'button';
      btn.setAttribute('aria-pressed','false');
      btn.setAttribute('aria-label', "Paige's score: " + v);
      btn.addEventListener('click', function(){
        var cur = userOf(b.name);
        cur.paigeRank = (cur.paigeRank === v) ? null : v;
        saveState();
        paint(b);
        updateTally();
      });
      rateBtns.push(btn);
      pad.appendChild(btn);
    })(n);
  }
  fs.appendChild(pad);
  detail.appendChild(fs);

  var drow = el('div','detailrow');
  var seenBtn = el('button','seen','Seen it');
  seenBtn.type = 'button';
  seenBtn.setAttribute('aria-pressed','false');
  seenBtn.addEventListener('click', function(){
    var cur = userOf(b.name);
    cur.seen = !cur.seen;
    saveState();
    paint(b);
  });
  drow.appendChild(seenBtn);

  var clearBtn = el('button','btn clear','Clear score');
  clearBtn.type = 'button';
  clearBtn.addEventListener('click', function(){
    userOf(b.name).paigeRank = null;
    saveState();
    paint(b);
    updateTally();
  });
  drow.appendChild(clearBtn);
  detail.appendChild(drow);

  var ta = el('textarea');
  ta.placeholder = 'Notes — where you saw them, what she said…';
  ta.setAttribute('aria-label', 'Notes for ' + b.name);
  ta.addEventListener('input', function(){
    userOf(b.name).notes = ta.value;
    saveState();
  });
  detail.appendChild(ta);

  card.appendChild(detail);

  head.addEventListener('click', function(){
    var open = card.classList.toggle('open');
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  card._paint = function(){
    var s = userOf(b.name);
    herNum.textContent = s.paigeRank == null ? '—' : String(s.paigeRank);
    herNum.style.color = s.paigeRank == null ? 'var(--dimmer)'
                       : (s.paigeRank >= 8 ? 'var(--blood)' : 'var(--ink)');
    herLabel.textContent = s.paigeRank == null ? 'unrated' : 'Paige';
    if(s.paigeRank == null){
      herGap.textContent = '';
    }else{
      var d = s.paigeRank - b.paige;
      herGap.textContent = d === 0 ? 'agreed' : (d > 0 ? '+' + d : String(d));
    }
    seenTag.hidden = !s.seen;
    seenBtn.setAttribute('aria-pressed', s.seen ? 'true' : 'false');
    seenBtn.textContent = s.seen ? 'Seen it ✓' : 'Seen it';
    rateBtns.forEach(function(btn, i){
      btn.setAttribute('aria-pressed', s.paigeRank === (i+1) ? 'true' : 'false');
    });
    if(ta.value !== s.notes) ta.value = s.notes || '';
  };

  return card;
}

function paint(b){ cards.get(b)._paint(); }

/* ---------- render ---------- */

function render(){
  var S = SORTS[order];
  var frag = document.createDocumentFragment();
  groups = [];
  var current = null;

  var pool = BANDS.slice();
  /* The disagreement view only means anything for bands she has actually rated. */
  if(order === 'gap') pool = pool.filter(function(b){ return userOf(b.name).paigeRank != null; });
  pool.sort(S.cmp);

  pool.forEach(function(b){
    if(S.group){
      var name = S.group(b);
      if(name !== current){
        current = name;
        var h = el('h2','ghead');
        h.appendChild(el('span', null, name));
        h.appendChild(el('small'));
        frag.appendChild(h);
        groups.push({ head:h, cards:[] });
      }
    }
    var card = cards.get(b);
    frag.appendChild(card);
    if(groups.length) groups[groups.length-1].cards.push(card);
  });

  listEl.textContent = '';
  listEl.appendChild(frag);
  apply();
}

function apply(){
  var term = qEl.value.trim().toLowerCase();
  var shown = 0;

  BANDS.forEach(function(b){
    var card = cards.get(b);
    var ok = matchesFilter(b) && (!term || b.haystack.indexOf(term) !== -1);
    if(order === 'gap' && userOf(b.name).paigeRank == null) ok = false;
    card.style.display = ok ? '' : 'none';
    if(ok) shown++;
  });

  groups.forEach(function(g){
    var n = 0;
    g.cards.forEach(function(c){ if(c.style.display !== 'none') n++; });
    g.head.style.display = n ? '' : 'none';
    g.head.lastChild.textContent = n === 1 ? '1 band' : n + ' bands';
  });

  countEl.textContent = shown + ' of ' + BANDS.length;

  var old = listEl.querySelector('.empty');
  if(old) old.remove();
  if(!shown){
    listEl.appendChild(el('p','empty', order === 'gap'
      ? 'Nothing to compare yet. Give a band one of Paige’s scores and it shows up here.'
      : 'Nothing matches that. Clear the search or pick another filter.'));
  }
}

function updateTally(){
  var rated = 0, agree = 0, gapSum = 0;
  BANDS.forEach(function(b){
    var r = userOf(b.name).paigeRank;
    if(r == null) return;
    rated++;
    gapSum += Math.abs(r - b.paige);
    if(r === b.paige) agree++;
  });
  var bits = [BANDS.length + ' bands'];
  if(rated){
    bits.push('Paige has rated ' + rated);
    bits.push('average gap ' + (gapSum / rated).toFixed(1));
    bits.push(agree + ' exact ' + (agree === 1 ? 'match' : 'matches'));
  }else{
    bits.push('Paige has rated none yet');
  }
  tallyEl.textContent = bits.join('  ·  ');
}

/* ---------- export / import ---------- */

function setStatus(msg){
  statusEl.textContent = msg;
  if(msg) setTimeout(function(){ if(statusEl.textContent === msg) statusEl.textContent = ''; }, 6000);
}

function exportState(){
  var payload = {
    app:'mdf-xxii',
    version:1,
    exported:new Date().toISOString(),
    state:state
  };
  var blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'mdf-xxii-ratings.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
  setStatus('Exported. Share the file, then use Import on the other phone.');
}

function importState(file){
  var reader = new FileReader();
  reader.onload = function(){
    var data;
    try{ data = JSON.parse(reader.result); }
    catch(e){ setStatus('That file is not readable JSON.'); return; }

    var incoming = (data && data.state && typeof data.state === 'object') ? data.state
                 : (data && typeof data === 'object' && !data.app) ? data : null;
    if(!incoming){ setStatus('No ratings found in that file.'); return; }

    var known = {}, n = 0;
    BANDS.forEach(function(b){ known[b.name] = true; });
    Object.keys(incoming).forEach(function(name){
      if(!known[name]) return;
      var v = incoming[name] || {};
      var cur = userOf(name);
      if(typeof v.paigeRank === 'number' && v.paigeRank >= 1 && v.paigeRank <= 10) cur.paigeRank = v.paigeRank;
      else if(v.paigeRank === null) cur.paigeRank = null;
      if(typeof v.seen === 'boolean') cur.seen = v.seen;
      if(typeof v.notes === 'string' && v.notes) cur.notes = v.notes;
      n++;
    });

    if(!n){ setStatus('That file had no band names this app recognises.'); return; }
    saveState();
    BANDS.forEach(paint);
    updateTally();
    render();
    setStatus('Merged ratings for ' + n + (n === 1 ? ' band.' : ' bands.'));
  };
  reader.onerror = function(){ setStatus('Could not read that file.'); };
  reader.readAsText(file);
}

/* ---------- boot ---------- */

function wire(){
  document.querySelectorAll('.chip').forEach(function(ch){
    ch.addEventListener('click', function(){
      document.querySelectorAll('.chip').forEach(function(o){ o.setAttribute('aria-pressed','false'); });
      ch.setAttribute('aria-pressed','true');
      mode = ch.dataset.filter;
      apply();
    });
  });
  qEl.addEventListener('input', apply);
  sortEl.addEventListener('change', function(){ order = sortEl.value; render(); });

  document.getElementById('export').addEventListener('click', exportState);
  var fileInput = document.getElementById('importFile');
  document.getElementById('import').addEventListener('click', function(){ fileInput.click(); });
  fileInput.addEventListener('change', function(){
    if(fileInput.files && fileInput.files[0]) importState(fileInput.files[0]);
    fileInput.value = '';
  });
}

function start(data){
  BANDS = data.map(function(b){
    b.slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    b.sortName = b.name.replace(/^The\s+/i,'');
    b.country0 = b.country.split(' / ')[0];
    b.haystack = [b.name,b.country,b.genre,b.why,b.pedigree,b.usFrequency,b.specialSet,b.paigeNote,
                  b.paigeQuote,b.v3Note,b.verdict,b.rec ? 'drew ryan rec' : '',b.recBy]
      .filter(Boolean).join(' ').toLowerCase();
    return b;
  });

  BANDS.forEach(function(b){ cards.set(b, buildCard(b)); });
  BANDS.forEach(paint);
  wire();
  render();
  updateTally();
}

function failed(){
  listEl.textContent = '';
  var box = el('div','loaderr');
  box.appendChild(el('p', null, 'Could not load bands.json.'));
  box.appendChild(el('p', null,
    'Opening index.html straight off the disk blocks the data file — browsers refuse file:// reads. ' +
    'Serve the folder instead, then open the address it prints:'));
  box.appendChild(el('code', null, 'python3 -m http.server 8000'));
  listEl.appendChild(box);
  tallyEl.textContent = 'Data not loaded';
}

document.addEventListener('DOMContentLoaded', function(){
  listEl   = document.getElementById('list');
  countEl  = document.getElementById('count');
  tallyEl  = document.getElementById('tally');
  qEl      = document.getElementById('q');
  sortEl   = document.getElementById('sort');
  statusEl = document.getElementById('toolStatus');

  loadState();

  fetch('./bands.json')
    .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
    .then(start)
    .catch(failed);
});

if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('./sw.js', { scope:'./' }).catch(function(){});
  });
}
