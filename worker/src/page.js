// The whole page: markup, styles and client script in one string.
// Served by src/index.js at '/'. Edit here, then `npx wrangler deploy`.

export const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="description" content="Everyone's own 100 miles in September, on one board.">
<title>September Miles</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#EEF1F6">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#090F20">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Sept Miles">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,400..800&family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:wght@400;500;600&display=swap">
<style>
:root{
  color-scheme: light dark;
  --bg:#EEF1F6; --surface:#FFFFFF; --surface-2:#F5F7FC;
  --ink:#101830; --ink-2:#48546F; --ink-3:#78849D;
  --line:#DBE1EC; --line-2:#E8ECF4;
  --pine:#1C7A5E; --pine-ink:#FFFFFF; --pine-soft:#DAF0E7;
  --blaze:#DD6224;
  --brand-a:#1FC4E8; --brand-b:#6A5AF9; --brand:#5A54EE;
  --shadow:0 1px 2px rgba(16,24,48,.06), 0 8px 24px -18px rgba(16,24,48,.55);
  --r:3px;
  --display:"Archivo","Helvetica Neue",Helvetica,Arial,sans-serif;
  --body:"Public Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:#090F20; --surface:#121A33; --surface-2:#18213D;
    --ink:#E7ECF8; --ink-2:#A2AEC8; --ink-3:#77839E;
    --line:#243052; --line-2:#1C2645;
    --pine:#4FBE9B; --pine-ink:#090F20; --pine-soft:#153328;
    --blaze:#F2854F;
    --brand-a:#3ED3F0; --brand-b:#8B7DFF; --brand:#8B8CFF;
    --shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 26px -20px rgba(0,0,0,.9);
  }
}
:root[data-theme="dark"]{
    --bg:#090F20; --surface:#121A33; --surface-2:#18213D;
  --ink:#E7ECF8; --ink-2:#A2AEC8; --ink-3:#77839E;
  --line:#243052; --line-2:#1C2645;
  --pine:#4FBE9B; --pine-ink:#090F20; --pine-soft:#153328;
  --blaze:#F2854F;
  --brand-a:#3ED3F0; --brand-b:#8B7DFF; --brand:#8B8CFF;
  --shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 26px -20px rgba(0,0,0,.9);
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--body);font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased}
img{max-width:100%}
[hidden]{display:none !important}
:focus-visible{outline:2px solid var(--brand);outline-offset:2px}

.wrap{max-width:1060px;margin:0 auto;padding:clamp(20px,3.4vw,38px) clamp(14px,3vw,26px) 72px}

/* masthead */
.masthead{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:18px;padding-bottom:20px;border-bottom:2px solid var(--ink)}
.brand{display:flex;gap:14px;align-items:flex-start;min-width:0}
.appmark{flex:none;width:46px;height:46px;margin-top:2px;border-radius:12px;display:block}
.w1{color:var(--ink)}
.w2{background:linear-gradient(96deg,var(--brand-a),var(--brand-b));-webkit-background-clip:text;background-clip:text;color:transparent}
@supports not ((-webkit-background-clip:text) or (background-clip:text)){.w2{color:var(--brand)}}
.w3{color:var(--ink-3);font-weight:600;font-size:.4em;letter-spacing:.01em;margin-left:.14em}
h1{margin:0;display:flex;flex-wrap:wrap;align-items:baseline;font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:800;font-size:clamp(24px,4.6vw,40px);line-height:1.05;letter-spacing:-.012em}
.tag{margin:8px 0 0;color:var(--ink-2);font-size:14px;max-width:46ch}
.clock{flex:none;text-align:right;display:flex;align-items:baseline;gap:9px}
.clock-num{font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:800;font-size:clamp(34px,6vw,52px);line-height:.9;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.clock-lbl{font-family:var(--display);font-variation-settings:"wdth" 100;font-weight:700;font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-3);max-width:5.5em;text-align:left;line-height:1.2}

/* banner */
.banner{margin-top:18px;padding:11px 14px;border:1px solid var(--line);border-left:3px solid var(--blaze);background:var(--surface);border-radius:var(--r);font-size:13.5px;color:var(--ink-2)}

/* stat strip */
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;margin-top:22px;background:var(--line);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.stat{background:var(--surface);padding:14px 15px 15px}
.stat-k{font-family:var(--display);font-variation-settings:"wdth" 100;font-weight:700;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-3)}
.stat-v{margin-top:7px;font-family:var(--display);font-variation-settings:"wdth" 110;font-weight:700;font-size:clamp(23px,3.3vw,32px);line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.stat-s{margin-top:5px;font-family:var(--mono);font-size:11.5px;color:var(--ink-3)}
@media (max-width:640px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* layout */
.cols{display:grid;grid-template-columns:minmax(0,1fr);gap:26px;margin-top:30px}
.rail{order:-1}
@media (min-width:920px){
  .cols{grid-template-columns:minmax(0,1fr) 316px;gap:30px;align-items:start}
  .rail{order:0;position:sticky;top:22px}
}
.main{display:flex;flex-direction:column;gap:30px;min-width:0}

.sec-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}
h2{margin:0;font-family:var(--display);font-variation-settings:"wdth" 100;font-weight:700;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink)}
.sec-note{font-family:var(--mono);font-size:11.5px;color:var(--ink-3)}

/* leaderboard */
.board{list-style:none;margin:0;padding:0;border:1px solid var(--line);border-radius:var(--r);background:var(--surface);overflow:hidden}
.row{display:grid;grid-template-columns:20px 8px minmax(0,1fr) auto;grid-template-areas:"rank mark who num" ". . bar bar";column-gap:11px;row-gap:9px;align-items:center;padding:14px 15px;border-bottom:1px solid var(--line-2)}
.row:last-child{border-bottom:0}
@media (min-width:700px){
  .row{grid-template-columns:20px 8px 178px minmax(0,1fr) 104px;grid-template-areas:"rank mark who bar num";row-gap:0;column-gap:14px}
}
.rank{grid-area:rank;font-family:var(--display);font-variation-settings:"wdth" 100;font-weight:700;font-size:13px;color:var(--ink-3);font-variant-numeric:tabular-nums;text-align:right}
.row.lead .rank{color:var(--ink)}
.row.me{background:var(--surface-2)}
.rank.done{color:var(--brand);font-size:15px}
.you{display:inline-block;margin-left:6px;font-family:var(--mono);font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3);border:1px solid var(--line);border-radius:2px;padding:0 4px;vertical-align:1px}
.ro-note{margin:0;font-size:13.5px;color:var(--ink-2)}
.mark{grid-area:mark;width:8px;height:26px;border-radius:1px;align-self:center}
.who{grid-area:who;min-width:0}
.name{display:block;font-weight:600;font-size:15px;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.meta{display:block;margin-top:2px;font-family:var(--mono);font-size:10.5px;color:var(--ink-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.barwrap{grid-area:bar;min-width:0}
.track{position:relative;height:11px;background:var(--surface-2);border:1px solid var(--line-2);border-radius:2px;overflow:hidden}
.fill{position:absolute;inset:0 auto 0 0;border-radius:1px}
.tick{position:absolute;top:0;bottom:0;width:1px;background:var(--line);opacity:.9}
.pace{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--blaze);border-radius:1px}
.barmeta{display:flex;justify-content:space-between;gap:10px;margin-top:5px;font-family:var(--mono);font-size:10px;color:var(--ink-3);line-height:1.2}
.barmeta span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.num{grid-area:num;text-align:right;white-space:nowrap}
.miles{font-family:var(--display);font-variation-settings:"wdth" 108;font-weight:700;font-size:20px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.miles small{font-family:var(--mono);font-weight:400;font-size:10.5px;color:var(--ink-3);letter-spacing:0;margin-left:2px}
.chip{display:inline-block;margin-top:3px;font-family:var(--mono);font-size:10.5px;padding:1px 5px;border-radius:2px;border:1px solid var(--line);color:var(--ink-3);background:var(--surface-2)}
.chip.ahead{color:var(--pine);border-color:color-mix(in srgb, var(--pine) 35%, var(--line));background:var(--pine-soft)}
.chip.behind{color:var(--blaze);border-color:color-mix(in srgb, var(--blaze) 32%, var(--line));background:transparent}
.chip.done{color:#fff;background:linear-gradient(110deg,var(--brand-a),var(--brand-b));border-color:transparent}

/* log form */
.card{border:1px solid var(--line);border-radius:var(--r);background:var(--surface);box-shadow:var(--shadow);padding:16px}
.field{display:block;margin-bottom:12px}
.lbl{display:block;font-family:var(--display);font-variation-settings:"wdth" 100;font-weight:700;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-3);margin-bottom:5px}
input,select{width:100%;font-family:var(--body);font-size:15px;color:var(--ink);background:var(--surface-2);border:1px solid var(--line);border-radius:2px;padding:9px 10px;-webkit-appearance:none;appearance:none}
input[type="date"]{font-family:var(--mono);font-size:13.5px}
select{background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 16px) 51%,calc(100% - 11px) 51%;background-size:5px 5px,5px 5px;background-repeat:no-repeat;padding-right:32px}
input:focus,select:focus{outline:2px solid var(--brand);outline-offset:-1px;background:var(--surface)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.btn{width:100%;font-family:var(--display);font-variation-settings:"wdth" 104;font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:linear-gradient(110deg,var(--brand-a),var(--brand-b));border:1px solid transparent;border-radius:3px;padding:11px 14px;cursor:pointer;transition:filter .12s ease}
.btn:hover{filter:brightness(1.09)}
.btn:disabled{opacity:.5;cursor:default;filter:none}
.status{margin-top:10px;font-family:var(--mono);font-size:11.5px;color:var(--ink-3);min-height:1.3em}
.status.err{color:var(--blaze)}

/* feed */
.feed{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.ev{display:flex;align-items:center;gap:11px;padding:9px 2px;border-bottom:1px solid var(--line-2)}
.dot{flex:none;width:7px;height:7px;border-radius:1px}
.ev-txt{flex:1 1 auto;min-width:0;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ev-txt b{font-weight:600}
.ev-txt .note{color:var(--ink-3);font-style:italic}
.ev-when{flex:none;font-family:var(--mono);font-size:11px;color:var(--ink-3);font-variant-numeric:tabular-nums}
.rm{flex:none;font-family:var(--mono);font-size:11px;color:var(--ink-3);background:none;border:1px solid transparent;border-radius:2px;padding:2px 5px;cursor:pointer}
.rm:hover{color:var(--blaze);border-color:var(--line)}
.rm[data-arm="1"]{color:var(--blaze);border-color:var(--blaze)}

.more{display:block;width:100%;margin-top:12px;font-family:var(--mono);font-size:11.5px;color:var(--ink-2);background:var(--surface);border:1px solid var(--line);border-radius:2px;padding:8px;cursor:pointer}
.more:hover{border-color:var(--ink-3);color:var(--ink)}
.empty{padding:26px 16px;text-align:center;color:var(--ink-3);font-size:14px}
.empty b{display:block;color:var(--ink-2);font-weight:600;margin-bottom:4px}

footer{margin-top:38px;padding-top:16px;border-top:1px solid var(--line);font-family:var(--mono);font-size:11.5px;color:var(--ink-3);line-height:1.7}

.readonly .rm,.readonly .logcard form{display:none}
@media (prefers-reduced-motion: reduce){*{transition:none !important;animation:none !important}}

/* hosted-only */
.pwfield{margin-bottom:12px}
.live{display:inline-flex;align-items:center;gap:5px}
.live i{width:6px;height:6px;border-radius:50%;background:var(--pine);display:inline-block}
.offline .live i{background:var(--blaze)}
.boot{padding:40px 16px;text-align:center;color:var(--ink-3);font-family:var(--mono);font-size:12px}
</style>
</head>
<body>
<div class="wrap" id="root">
  <header class="masthead">
    <div class="brand">
      <img class="appmark" src="/icon.svg" alt="" width="46" height="46">
      <div>
        <h1><span class="w1">SEPTEMBER</span><span class="w2">MILES</span><span class="w3">.com</span></h1>
        <p class="tag" id="tag">Everyone's own 100. Same month, same goal, one board.</p>
      </div>
    </div>
    <div class="clock"><div class="clock-num" id="clocknum">&nbsp;</div><div class="clock-lbl" id="clocklbl"></div></div>
  </header>

  <div class="banner" id="banner" hidden></div>

  <section class="stats" id="stats" aria-label="Challenge totals"></section>

  <div class="cols">
    <div class="main">
      <section>
        <div class="sec-head"><h2>Everyone</h2><span class="sec-note" id="boardnote"></span></div>
        <div id="boardwrap"><div class="boot">loading the board...</div></div>
      </section>
      <section id="feedsec">
        <div class="sec-head"><h2>Activity</h2><span class="sec-note" id="feednote"></span></div>
        <div id="feedwrap"></div>
      </section>
    </div>

    <div class="rail">
      <div class="card logcard">
        <div class="sec-head" style="margin-bottom:14px"><h2>Log miles</h2><span class="sec-note live"><i></i><span id="livelbl">live</span></span></div>
        <form id="logform" autocomplete="off">
          <label class="field"><span class="lbl">Who</span>
            <select id="who"><option value="__new">+ Add someone new</option></select></label>
          <label class="field" id="newwrap"><span class="lbl">Name</span>
            <input id="newname" type="text" placeholder="First name" maxlength="24"></label>
          <div class="two">
            <label class="field"><span class="lbl">Miles</span>
              <input id="miles" type="number" inputmode="decimal" step="0.01" min="0.01" max="80" placeholder="3.1"></label>
            <label class="field"><span class="lbl">Date</span>
              <input id="date" type="date"></label>
          </div>
          <label class="field"><span class="lbl">Note <span style="text-transform:none;letter-spacing:0">(optional)</span></span>
            <input id="note" type="text" placeholder="hills, felt great" maxlength="60"></label>
          <label class="field pwfield" id="pwwrap" hidden><span class="lbl">Group password</span>
            <input id="pw" type="password" placeholder="ask whoever set this up" maxlength="64"></label>
          <button class="btn" id="save" type="submit">Add miles</button>
        </form>
        <div class="status" id="status"></div>
      </div>
    </div>
  </div>

  <footer id="foot"></footer>
</div>
<script>
(function(){
  'use strict';

  var S = null;          /* server state: {config, people, entries} */
  var feedAll = false;
  var busy = false;
  var timer = null;

  function $(id){ return document.getElementById(id); }
  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function p2(n){ return n < 10 ? '0' + n : '' + n; }
  function todayISO(){
    var d = new Date();
    return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate());
  }
  function dayOf(iso, start){
    var t = Date.parse(iso + 'T00:00:00Z'), s = Date.parse(start + 'T00:00:00Z');
    if (isNaN(t) || isNaN(s)) return 0;
    return Math.round((t - s) / 86400000) + 1;
  }
  function clamp(n, lo, hi){ return n < lo ? lo : (n > hi ? hi : n); }
  function num(m){
    var r = Math.round(m * 10) / 10;
    return (r % 1 === 0) ? String(r) : r.toFixed(1);
  }
  function shortDate(iso){
    var a = String(iso).split('-');
    var mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][(+a[1] || 1) - 1];
    return mo + ' ' + (+a[2]);
  }
  function keyOf(n){ return String(n == null ? '' : n).trim().toLowerCase(); }
  function ls(k, v){
    try {
      if (v === undefined) return window.localStorage.getItem(k);
      window.localStorage.setItem(k, v);
    } catch (e) {}
    return null;
  }

  function elapsed(){ return clamp(dayOf(todayISO(), S.config.start), 0, S.config.days); }
  function onPace(){ return S.config.goal * elapsed() / S.config.days; }

  function standings(){
    var by = {}, order = [];
    S.people.forEach(function(p){
      by[keyOf(p.name)] = { name: p.name, color: p.color, total: 0, days: {}, last: '' };
      order.push(keyOf(p.name));
    });
    S.entries.forEach(function(e){
      var k = keyOf(e.who);
      if (!by[k]){ by[k] = { name: e.who, color: '#7C8A85', total: 0, days: {}, last: '' }; order.push(k); }
      by[k].total += e.miles;
      by[k].days[e.date] = true;
      if (e.date > by[k].last) by[k].last = e.date;
    });
    var out = order.map(function(k){
      var r = by[k];
      r.activeDays = Object.keys(r.days).length;
      r.avg = r.activeDays ? r.total / r.activeDays : 0;
      return r;
    });
    out.sort(function(a, b){
      if (b.total !== a.total) return b.total - a.total;
      return a.name.localeCompare(b.name);
    });
    return out;
  }

  /* ---------- painting ---------- */
  function paint(){
    if (!S) return;
    var c = S.config, el = elapsed(), left = Math.max(0, c.days - el);
    var rows = standings();
    var today = todayISO();
    var groupTotal = S.entries.reduce(function(s, e){ return s + e.miles; }, 0);
    var todayTotal = S.entries.reduce(function(s, e){ return s + (e.date === today ? e.miles : 0); }, 0);

    $('tag').textContent = "Everyone's own " + c.goal + '. Same ' + c.days +
      ' days, same goal, one board.';
    $('clocknum').textContent = (el === 0) ? c.days : left;
    $('clocklbl').textContent = (el === 0) ? 'days to go' : 'days left';

    var me = ls('hms.me') || '';
    var mine = null;
    rows.forEach(function(r){ if (keyOf(r.name) === keyOf(me)) mine = r; });
    var onPaceCount = 0, finished = 0;
    rows.forEach(function(r){
      if (r.total >= onPace()) onPaceCount++;
      if (r.total >= c.goal) finished++;
    });

    $('stats').innerHTML =
      stat('Your ' + c.unitLong,
        mine ? num(mine.total) : '—',
        mine ? (mine.total >= c.goal ? 'done — all ' + c.goal + ' in'
                                     : num(c.goal - mine.total) + ' ' + c.unit + ' to go')
             : 'add some to start yours') +
      stat('On-pace mark',
        el === 0 ? '—' : num(onPace()),
        el === 0 ? 'starts ' + shortDate(c.start) : c.unitLong + ' each by today') +
      stat('On pace',
        (el === 0 || !rows.length) ? '—' : onPaceCount + ' of ' + rows.length,
        el === 0 ? 'nobody behind yet'
                 : (finished ? finished + ' already finished' : 'holding their own ' + c.goal)) +
      stat('Miles logged', num(groupTotal),
        rows.length ? num(todayTotal) + ' ' + c.unit + ' of it today, across ' + rows.length +
          (rows.length === 1 ? ' of us' : ' of us') : 'nobody logged yet');

    $('boardnote').textContent = el === 0 ? 'starts ' + shortDate(c.start) : 'orange line = on-pace';
    $('boardwrap').innerHTML = rows.length
      ? '<ul class="board">' + rows.map(rowHTML).join('') + '</ul>'
      : '<div class="board"><div class="empty"><b>Nobody has started</b>Add your name and your ' + c.goal + ' starts here.</div></div>';

    paintFeed();
    fillWho(rows);

    $('foot').innerHTML =
      esc(c.unitLong.charAt(0).toUpperCase() + c.unitLong.slice(1) + ' logged between ' + shortDate(c.start) +
        ' and ' + shortDate(c.end) + ' ' + String(c.start).slice(0, 4) + " · everyone's own " + c.goal) +
      '<br>Anyone with this link can log miles' + (c.locked ? ', with the group password.' : '.') +
      ' The board refreshes on its own every 30 seconds.';
  }

  function stat(k, v, s){
    return '<div class="stat"><div class="stat-k">' + esc(k) + '</div><div class="stat-v">' + esc(v) +
      '</div><div class="stat-s">' + esc(s) + '</div></div>';
  }

  function rowHTML(r, i){
    var c = S.config, el = elapsed(), left = Math.max(0, c.days - el);
    var me = ls('hms.me') || '';
    var pct = clamp(r.total / c.goal * 100, 0, 100);
    var pacePct = clamp(onPace() / c.goal * 100, 0, 100);
    var diff = r.total - onPace();

    var chip;
    if (r.total >= c.goal) chip = '<span class="chip done">' + c.goal + ' done</span>';
    else if (el === 0) chip = '<span class="chip">' + num(c.goal - r.total) + ' to go</span>';
    else if (diff >= 0) chip = '<span class="chip ahead">+' + num(diff) + ' ahead</span>';
    else chip = '<span class="chip behind">' + num(diff) + ' behind</span>';

    var bits = [];
    if (r.activeDays) bits.push(r.activeDays + (r.activeDays === 1 ? ' day logged' : ' days logged'));
    if (r.avg) bits.push(num(r.avg) + '/day avg');
    var right = r.total >= c.goal ? 'finished' :
      (left > 0 ? 'needs ' + num((c.goal - r.total) / left) + '/day' : num(c.goal - r.total) + ' ' + c.unit + ' short');

    var done = r.total >= c.goal;
    return '<li class="row' + (i === 0 && r.total > 0 ? ' lead' : '') + (keyOf(r.name) === keyOf(me) ? ' me' : '') + '">' +
      '<span class="rank' + (done ? ' done' : '') + '"' + (done ? ' title="finished"' : '') + '>' +
        (done ? '\u2713' : (i + 1)) + '</span>' +
      '<span class="mark" style="background:' + esc(r.color) + '"></span>' +
      '<div class="who"><span class="name">' + esc(r.name) +
        (keyOf(r.name) === keyOf(me) ? '<span class="you">you</span>' : '') +
      '</span><span class="meta">' + (bits.length ? esc(bits.join(' · ')) : 'no miles yet') + '</span></div>' +
      '<div class="barwrap"><div class="track" role="img" aria-label="' +
          esc(r.name + ': ' + num(r.total) + ' of ' + c.goal + ' ' + c.unitLong) + '">' +
        '<div class="fill" style="width:' + pct.toFixed(2) + '%;background:' + esc(r.color) + '"></div>' +
        '<i class="tick" style="left:25%"></i><i class="tick" style="left:50%"></i><i class="tick" style="left:75%"></i>' +
        (el > 0 && el < c.days ? '<i class="pace" style="left:' + pacePct.toFixed(2) + '%"></i>' : '') +
      '</div>' +
      '<div class="barmeta"><span>' + (r.last ? 'last on ' + esc(shortDate(r.last)) : 'nothing logged') + '</span>' +
        '<span>' + esc(right) + '</span></div></div>' +
      '<div class="num"><span class="miles">' + num(r.total) + '<small>' + esc(c.unit) + '</small></span><br>' + chip + '</div>' +
    '</li>';
  }

  function paintFeed(){
    var CAP = 24;
    var list = S.entries;
    var shown = feedAll ? list : list.slice(0, CAP);
    var colors = {};
    S.people.forEach(function(p){ colors[keyOf(p.name)] = p.color; });

    $('feednote').textContent = list.length
      ? list.length + (list.length === 1 ? ' entry' : ' entries') : 'empty';

    $('feedwrap').innerHTML = shown.length
      ? '<ul class="feed">' + shown.map(function(e){
          return '<li class="ev">' +
            '<span class="dot" style="background:' + esc(colors[keyOf(e.who)] || '#7C8A85') + '"></span>' +
            '<span class="ev-txt"><b>' + esc(e.who) + '</b> ' + num(e.miles) + ' ' + esc(S.config.unit) +
              (e.note ? ' <span class="note">— ' + esc(e.note) + '</span>' : '') + '</span>' +
            '<span class="ev-when">' + esc(shortDate(e.date)) + '</span>' +
            '<button class="rm" type="button" data-id="' + esc(e.id) + '" aria-label="Remove this entry">×</button>' +
          '</li>';
        }).join('') + '</ul>' +
        (list.length > CAP ? '<button class="more" type="button" id="morebtn">' +
          (feedAll ? 'Show the latest ' + CAP + ' only' : 'Show all ' + list.length + ' entries') + '</button>' : '')
      : '<div class="empty"><b>Nothing logged yet</b>Entries show up here the moment somebody adds one.</div>';
  }

  function fillWho(rows){
    var sel = $('who');
    var keep = sel.value && sel.value !== '__new' ? sel.value : (ls('hms.me') || '');
    var html = rows.map(function(r){ return '<option value="' + esc(r.name) + '">' + esc(r.name) + '</option>'; }).join('');
    sel.innerHTML = html + '<option value="__new">+ Add someone new</option>';
    var found = false;
    for (var i = 0; i < sel.options.length; i++){
      if (keyOf(sel.options[i].value) === keyOf(keep)){ sel.selectedIndex = i; found = true; break; }
    }
    if (!found && rows.length) sel.selectedIndex = 0;
    if (!rows.length) sel.value = '__new';
    $('newwrap').hidden = sel.value !== '__new';
  }

  /* ---------- talking to the server ---------- */
  function say(msg, isErr){
    var s = $('status');
    s.textContent = msg || '';
    s.className = 'status' + (isErr ? ' err' : '');
  }
  function setBusy(b){
    busy = b;
    $('save').disabled = b;
    $('save').textContent = b ? 'Saving...' : 'Add miles';
  }
  function connected(ok){
    document.getElementById('root').classList.toggle('offline', !ok);
    $('livelbl').textContent = ok ? 'live' : 'offline';
  }

  function load(){
    return fetch('/api/state', { cache: 'no-store' })
      .then(function(r){ if (!r.ok) throw new Error('state ' + r.status); return r.json(); })
      .then(function(d){
        var first = !S;
        S = d;
        connected(true);
        if (first) initForm();
        paint();
      })
      .catch(function(){ connected(false); });
  }

  function post(path, body){
    return fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function(r){
      return r.json().catch(function(){ return {}; }).then(function(j){
        if (!r.ok) throw { status: r.status, error: (j && j.error) || 'Request failed' };
        return j;
      });
    });
  }

  function initForm(){
    var c = S.config;
    var d = $('date'), today = todayISO();
    d.min = c.start; d.max = c.end;
    d.value = today < c.start ? c.start : (today > c.end ? c.end : today);
    $('miles').max = c.maxMiles;
    if (c.locked && !ls('hms.key')) $('pwwrap').hidden = false;
  }

  function submit(e){
    e.preventDefault();
    if (busy) return;
    var c = S.config;

    var sel = $('who');
    var who = (sel.value === '__new' ? $('newname').value : sel.value);
    who = String(who || '').replace(/\s+/g, ' ').trim();
    if (!who){ say('Add a name first.', true); return; }

    var miles = parseFloat($('miles').value);
    if (!(miles > 0)){ say('How many ' + c.unitLong + '? Enter a number above zero.', true); return; }
    if (miles > c.maxMiles){ say('That is over ' + c.maxMiles + ' ' + c.unit + ' — split it into separate entries.', true); return; }

    var date = $('date').value;
    if (!date || date < c.start || date > c.end){
      say('Pick a date between ' + shortDate(c.start) + ' and ' + shortDate(c.end) + '.', true);
      return;
    }

    var key = $('pw').value || ls('hms.key') || '';
    setBusy(true); say('Saving...');

    post('/api/entries', { who: who, date: date, miles: miles, note: $('note').value, key: key })
      .then(function(){
        if (key) ls('hms.key', key);
        ls('hms.me', who);
        $('miles').value = ''; $('note').value = ''; $('newname').value = '';
        $('pw').value = ''; $('pwwrap').hidden = true;
        setBusy(false);
        say('Logged ' + num(miles) + ' ' + c.unit + ' for ' + who + '.');
        return load();
      })
      .catch(function(err){ setBusy(false); fail(err); });
  }

  function fail(err){
    if (err && err.status === 401){
      $('pwwrap').hidden = false;
      $('pw').focus();
      say(ls('hms.key') ? 'That password is not right. Try again.' : 'This board needs the group password.', true);
      try { window.localStorage.removeItem('hms.key'); } catch (e) {}
      return;
    }
    connected(false);
    say((err && err.error) || 'That did not save — check your connection and try again.', true);
  }

  function onClick(e){
    if (e.target.id === 'morebtn'){ feedAll = !feedAll; paintFeed(); return; }
    var btn = e.target.closest ? e.target.closest('.rm') : null;
    if (!btn || busy) return;

    if (btn.getAttribute('data-arm') !== '1'){
      var prev = document.querySelector('.rm[data-arm="1"]');
      if (prev){ prev.removeAttribute('data-arm'); prev.textContent = '×'; }
      btn.setAttribute('data-arm', '1');
      btn.textContent = 'remove?';
      setTimeout(function(){
        if (btn.getAttribute('data-arm') === '1'){ btn.removeAttribute('data-arm'); btn.textContent = '×'; }
      }, 4000);
      return;
    }
    setBusy(true); say('Removing...');
    post('/api/entries/delete', { id: btn.getAttribute('data-id'), key: ls('hms.key') || $('pw').value || '' })
      .then(function(){ setBusy(false); say('Entry removed.'); return load(); })
      .catch(function(err){ setBusy(false); fail(err); });
  }

  /* ---------- boot ---------- */
  $('logform').addEventListener('submit', submit);
  $('who').addEventListener('change', function(){
    var isNew = this.value === '__new';
    $('newwrap').hidden = !isNew;
    if (isNew) $('newname').focus();
  });
  document.addEventListener('click', onClick);
  document.addEventListener('visibilitychange', function(){
    if (!document.hidden) load();
  });

  load();
  timer = setInterval(function(){ if (!document.hidden && !busy) load(); }, 30000);
})();
</script>
</body>
</html>
`;
