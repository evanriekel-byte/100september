// The whole page: markup, styles and client script in one string.
// Served by src/index.js at '/'. Edit here, then `npx wrangler deploy`.
//
// Two rules keep this file working:
//   1. No backticks and no dollar-brace anywhere inside PAGE, or the module
//      stops parsing.
//   2. A backslash meant for the browser has to be written twice. The template
//      literal eats single ones, so /\\s+/g here is /\s+/g in the served page.

export const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="description" content="Everyone's own 100 miles in September, on one board.">
<title>September Miles</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="canonical" href="__ORIGIN__/">
<!-- The board is readable by anyone with the link, and it carries real names,
     notes and photos. Keep it out of search results; the link is the door. -->
<meta name="robots" content="noindex, nofollow">
<!-- Link previews. __ORIGIN__ is filled in per request by src/index.js, so a
     self-hosted copy previews itself rather than septembermiles.com. -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="September Miles">
<meta property="og:title" content="September Miles">
<meta property="og:description" content="Everyone's own 100 miles in September, on one board.">
<meta property="og:url" content="__ORIGIN__/">
<meta property="og:image" content="__ORIGIN__/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="SEPTEMBERMILES.com - everyone's own 100 miles in September, on one board.">
<meta name="twitter:card" content="summary_large_image">
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
  --scrim:rgba(9,15,32,.92);
  --shadow:0 1px 2px rgba(16,24,48,.06), 0 8px 24px -18px rgba(16,24,48,.55);
  --lift:0 -6px 20px -18px rgba(16,24,48,.9);
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
    --scrim:rgba(3,6,16,.94);
    --shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 26px -20px rgba(0,0,0,.9);
    --lift:0 -8px 22px -18px rgba(0,0,0,1);
  }
}
:root[data-theme="dark"]{
  --bg:#090F20; --surface:#121A33; --surface-2:#18213D;
  --ink:#E7ECF8; --ink-2:#A2AEC8; --ink-3:#77839E;
  --line:#243052; --line-2:#1C2645;
  --pine:#4FBE9B; --pine-ink:#090F20; --pine-soft:#153328;
  --blaze:#F2854F;
  --brand-a:#3ED3F0; --brand-b:#8B7DFF; --brand:#8B8CFF;
  --scrim:rgba(3,6,16,.94);
  --shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 26px -20px rgba(0,0,0,.9);
  --lift:0 -8px 22px -18px rgba(0,0,0,1);
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--body);font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased}
img{max-width:100%}
[hidden]{display:none !important}
:focus-visible{outline:2px solid var(--brand);outline-offset:2px}

.wrap{max-width:1060px;margin:0 auto;
  padding:clamp(16px,3.4vw,38px) clamp(14px,3vw,26px) calc(84px + env(safe-area-inset-bottom))}
@media (min-width:760px){.wrap{padding-bottom:64px}}

/* masthead */
.masthead{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:18px;padding-bottom:18px;border-bottom:2px solid var(--ink)}
.brand{display:flex;gap:14px;align-items:flex-start;min-width:0}
.appmark{flex:none;width:40px;height:40px;margin-top:2px;border-radius:11px;display:block}
@media (min-width:760px){.appmark{width:46px;height:46px}}
.w1{color:var(--ink)}
.w2{background:linear-gradient(96deg,var(--brand-a),var(--brand-b));-webkit-background-clip:text;background-clip:text;color:transparent}
@supports not ((-webkit-background-clip:text) or (background-clip:text)){.w2{color:var(--brand)}}
.w3{color:var(--ink-3);font-weight:600;font-size:.4em;letter-spacing:.01em;margin-left:.14em}
h1{margin:0;display:flex;flex-wrap:wrap;align-items:baseline;font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:800;font-size:clamp(22px,4.6vw,40px);line-height:1.05;letter-spacing:-.012em}
.tag{margin:7px 0 0;color:var(--ink-2);font-size:13.5px;max-width:46ch}
.clock{flex:none;margin-left:auto;text-align:right;display:flex;align-items:baseline;gap:9px}
.clock-num{font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:800;font-size:clamp(30px,6vw,52px);line-height:.9;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.clock-lbl{font-family:var(--display);font-variation-settings:"wdth" 100;font-weight:700;font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-3);max-width:5.5em;text-align:left;line-height:1.2}

/* ---- navigation ----
   Phone: a fixed bar in thumb reach. Desktop: a rail under the masthead.
   The active tab is marked in ink, never in the brand gradient — the gradient
   only ever means identity here. */
.nav{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;
  background:var(--surface);border-top:1px solid var(--line);box-shadow:var(--lift);
  padding-bottom:env(safe-area-inset-bottom)}
.tab{position:relative;flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:3px;
  padding:9px 4px 8px;background:none;border:0;border-top:2px solid transparent;margin-top:-1px;
  text-decoration:none;cursor:pointer;color:var(--ink-3);
  font-family:var(--display);font-variation-settings:"wdth" 100;font-weight:700;
  font-size:9.5px;letter-spacing:.1em;text-transform:uppercase}
.tab svg{width:21px;height:21px;flex:none;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.tab:hover{color:var(--ink-2)}
.tab[aria-current="page"]{color:var(--ink);border-top-color:var(--ink)}
.newdot{position:absolute;top:6px;left:calc(50% + 8px);width:7px;height:7px;border-radius:50%;background:var(--blaze);border:2px solid var(--surface)}
@media (min-width:760px){
  .nav{position:static;display:flex;gap:28px;margin-top:0;padding:0;
    background:none;box-shadow:none;border-top:0;border-bottom:1px solid var(--line)}
  .tab{flex:0 0 auto;flex-direction:row;gap:8px;padding:12px 2px;margin:0 0 -1px;
    border-top:0;border-bottom:2px solid transparent;font-size:11px;letter-spacing:.13em}
  .tab svg{width:17px;height:17px}
  .tab[aria-current="page"]{border-top-color:transparent;border-bottom-color:var(--ink)}
  .newdot{top:9px;left:auto;right:-11px;border-color:var(--bg)}
}

/* views */
.view{display:flex;flex-direction:column;gap:28px;margin-top:24px}

/* stat strip */
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.stat{background:var(--surface);padding:14px 15px 15px}
.stat-k{font-family:var(--display);font-variation-settings:"wdth" 100;font-weight:700;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-3)}
.stat-v{margin-top:7px;font-family:var(--display);font-variation-settings:"wdth" 110;font-weight:700;font-size:clamp(23px,3.3vw,32px);line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.stat-s{margin-top:5px;font-family:var(--mono);font-size:11.5px;color:var(--ink-3)}
@media (max-width:640px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
.stats.three{grid-template-columns:repeat(3,minmax(0,1fr))}
@media (max-width:640px){
  .stats.three{grid-template-columns:repeat(3,minmax(0,1fr))}
  .stats.three .stat{padding:12px 10px 13px}
  .stats.three .stat-v{font-size:21px}
  .stats.three .stat-s{font-size:10.5px}
}

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
input,select,textarea{width:100%;font-family:var(--body);font-size:15px;color:var(--ink);background:var(--surface-2);border:1px solid var(--line);border-radius:2px;padding:9px 10px;-webkit-appearance:none;appearance:none}
input[type="date"]{font-family:var(--mono);font-size:13.5px}
select{background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 16px) 51%,calc(100% - 11px) 51%;background-size:5px 5px,5px 5px;background-repeat:no-repeat;padding-right:32px}
input:focus,select:focus,textarea:focus{outline:2px solid var(--brand);outline-offset:-1px;background:var(--surface)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.btn{width:100%;font-family:var(--display);font-variation-settings:"wdth" 104;font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:linear-gradient(110deg,var(--brand-a),var(--brand-b));border:1px solid transparent;border-radius:3px;padding:11px 14px;cursor:pointer;transition:filter .12s ease}
.btn:hover{filter:brightness(1.09)}
.btn:disabled{opacity:.5;cursor:default;filter:none}
.status{margin-top:10px;font-family:var(--mono);font-size:11.5px;color:var(--ink-3);min-height:1.3em}
.status.err{color:var(--blaze)}

/* main page split: the form leads, your history sits beside it */
.loggrid{display:grid;grid-template-columns:minmax(0,1fr);gap:26px}
@media (min-width:920px){
  .loggrid{grid-template-columns:326px minmax(0,1fr);gap:30px;align-items:start}
  .loggrid .logcard{position:sticky;top:22px}
}
.facts{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px}
.fact{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);background:var(--surface);border:1px solid var(--line);border-radius:2px;padding:4px 9px;white-space:nowrap}
.fact b{font-family:var(--display);font-variation-settings:"wdth" 106;font-weight:700;font-size:12.5px;color:var(--ink);letter-spacing:-.01em;margin-right:4px;font-variant-numeric:tabular-nums}

/* your history */
.hist{list-style:none;margin:0;padding:0;border:1px solid var(--line);border-radius:var(--r);background:var(--surface);overflow:hidden}
.hrow{display:grid;grid-template-columns:52px auto minmax(0,1fr) 28px;align-items:center;gap:12px;padding:11px 14px;border-bottom:1px solid var(--line-2)}
.hrow:last-child{border-bottom:0}
.hdate{font-family:var(--mono);font-size:11px;color:var(--ink-3);white-space:nowrap}
.hmiles{font-family:var(--display);font-variation-settings:"wdth" 108;font-weight:700;font-size:16px;letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap}
.hmiles small{font-family:var(--mono);font-weight:400;font-size:10px;color:var(--ink-3);margin-left:2px}
.hnote{font-size:13.5px;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* group activity feed */
.filters{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.fbtn{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;color:var(--ink-2);background:var(--surface);border:1px solid var(--line);border-radius:2px;padding:4px 9px;cursor:pointer}
.fbtn i{width:7px;height:7px;border-radius:1px;display:inline-block}
.fbtn:hover{border-color:var(--ink-3)}
.fbtn[aria-pressed="true"]{color:var(--ink);border-color:var(--ink);background:var(--surface-2)}
.feed{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.ev{display:flex;align-items:center;gap:11px;padding:9px 2px;border-bottom:1px solid var(--line-2)}
.dot{flex:none;width:7px;height:7px;border-radius:1px}
.ev-txt{flex:1 1 auto;min-width:0;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ev-txt b{font-weight:600}
.ev-txt .note{color:var(--ink-3);font-style:italic}
.ev-when{flex:none;font-family:var(--mono);font-size:11px;color:var(--ink-3);font-variant-numeric:tabular-nums}
.by{flex:none;max-width:11ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--mono);font-size:9.5px;letter-spacing:.05em;color:var(--ink-2);border:1px solid var(--line);border-radius:2px;padding:1px 5px}
.hnote .by{margin-left:7px;display:inline-block;vertical-align:1px}
.rm{flex:none;font-family:var(--mono);font-size:11px;color:var(--ink-3);background:none;border:1px solid transparent;border-radius:2px;padding:2px 5px;cursor:pointer}
.rm:hover{color:var(--blaze);border-color:var(--line)}
.rm[data-arm="1"]{color:var(--blaze);border-color:var(--blaze)}

.more{display:block;width:100%;margin-top:12px;font-family:var(--mono);font-size:11.5px;color:var(--ink-2);background:var(--surface);border:1px solid var(--line);border-radius:2px;padding:8px;cursor:pointer}
.more:hover{border-color:var(--ink-3);color:var(--ink)}
.empty{padding:26px 16px;text-align:center;color:var(--ink-3);font-size:14px}
.empty b{display:block;color:var(--ink-2);font-weight:600;margin-bottom:4px}

/* ---- chat ---- */
.chat{padding:0;display:flex;flex-direction:column;overflow:hidden}
.chat.drop{outline:2px dashed var(--brand);outline-offset:-5px}
.chatscroll{flex:1 1 auto;height:min(56vh,520px);overflow-y:auto;overscroll-behavior:contain;
  padding:16px;display:flex;flex-direction:column;gap:11px}
.chatscroll > :first-child{margin-top:auto}
.daydiv{display:flex;align-items:center;gap:10px;margin:4px 0;font-family:var(--mono);font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-3)}
.daydiv:before,.daydiv:after{content:"";flex:1 1 auto;height:1px;background:var(--line-2)}
.msg{display:flex;gap:9px;align-items:flex-end;max-width:100%}
.msg.mine{flex-direction:row-reverse}
.msg.tail{margin-top:-6px}
.av{flex:none;width:26px;height:26px;border-radius:3px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--display);font-variation-settings:"wdth" 100;font-weight:700;font-size:12px;line-height:1}
.msg.tail .av{visibility:hidden}
.bub{min-width:0;max-width:min(80%,440px);background:var(--surface-2);border:1px solid var(--line-2);border-radius:3px;padding:8px 11px 6px}
.msg.mine .bub{background:color-mix(in srgb, var(--brand) 11%, var(--surface));border-color:color-mix(in srgb, var(--brand) 26%, var(--line))}
.from{display:block;font-family:var(--display);font-variation-settings:"wdth" 100;font-weight:700;font-size:10px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px}
.msg.tail .from{display:none}
.text{font-size:14.5px;white-space:pre-wrap;overflow-wrap:anywhere}
.photo{display:block;width:auto;height:auto;max-width:100%;max-height:290px;border-radius:2px;background:var(--surface-2);cursor:zoom-in}
.text + .photo{margin-top:7px}
.stamp{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-top:3px;font-family:var(--mono);font-size:9.5px;color:var(--ink-3);font-variant-numeric:tabular-nums}
.stamp .rm{font-size:10px;padding:0 4px}

.composer{flex:none;border-top:1px solid var(--line);background:var(--surface);padding:11px 12px 12px}
.cwho{display:flex;align-items:center;gap:8px;margin-bottom:9px;font-family:var(--mono);font-size:11px;color:var(--ink-3)}
.cwho select{width:auto;max-width:170px;font-size:12px;padding:4px 28px 4px 8px;background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%}
.cwho input{width:auto;flex:1 1 110px;min-width:0;font-size:12px;padding:4px 8px}
.cav{flex:none;width:15px;height:15px;border-radius:2px;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-family:var(--display);font-weight:700;font-size:8.5px;line-height:1}
.cme{font-family:var(--display);font-variation-settings:"wdth" 104;font-weight:700;font-size:12.5px;letter-spacing:.01em;color:var(--ink);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.linkbtn{flex:none;margin-left:auto;font-family:var(--mono);font-size:10.5px;color:var(--ink-3);background:none;border:0;border-bottom:1px solid var(--line);border-radius:0;padding:0 0 1px;cursor:pointer}
.linkbtn:hover{color:var(--ink);border-bottom-color:var(--ink-3)}
.attach{display:flex;align-items:center;gap:10px;margin-bottom:9px;padding:7px;border:1px solid var(--line);border-radius:2px;background:var(--surface-2)}
.attach img{flex:none;width:44px;height:44px;object-fit:cover;border-radius:2px}
.attach span{flex:1 1 auto;min-width:0;font-family:var(--mono);font-size:10.5px;color:var(--ink-3)}
.crow{display:flex;align-items:flex-end;gap:8px}
.crow textarea{flex:1 1 auto;resize:none;max-height:116px;line-height:1.4;padding:9px 10px}
.iconbtn,.sendbtn{flex:none;width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:2px;cursor:pointer}
.iconbtn svg,.sendbtn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.iconbtn{color:var(--ink-2);background:var(--surface-2);border:1px solid var(--line)}
.iconbtn:hover{color:var(--ink);border-color:var(--ink-3)}
.iconbtn[aria-pressed="true"]{color:var(--brand);border-color:var(--brand)}
.sendbtn{color:#fff;background:linear-gradient(110deg,var(--brand-a),var(--brand-b));border:1px solid transparent;transition:filter .12s ease}
.sendbtn:hover{filter:brightness(1.09)}
.sendbtn:disabled{opacity:.45;cursor:default;filter:none}
.lightbox{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:18px;background:var(--scrim);cursor:zoom-out}
.lightbox img{max-width:100%;max-height:100%;border-radius:3px}

footer{margin-top:34px;padding-top:16px;border-top:1px solid var(--line);font-family:var(--mono);font-size:11.5px;color:var(--ink-3);line-height:1.7}

.live{display:inline-flex;align-items:center;gap:5px}
.live i{width:6px;height:6px;border-radius:50%;background:var(--pine);display:inline-block}
.offline .live i{background:var(--blaze)}
.boot{padding:40px 16px;text-align:center;color:var(--ink-3);font-family:var(--mono);font-size:12px}
.nojs{margin:0;padding:13px clamp(14px,3vw,26px);background:var(--surface);border-bottom:1px solid var(--line);border-left:3px solid var(--blaze);font-size:13.5px;color:var(--ink-2)}
.nojs a{color:var(--ink)}
@media (prefers-reduced-motion: reduce){*{transition:none !important;animation:none !important}}
</style>
</head>
<body>
<noscript><div class="nojs">This board is drawn in the browser, so it needs JavaScript switched on.
The whole log is also available as a plain file at <a href="/api/export.csv">/api/export.csv</a>.</div></noscript>
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

  <nav class="nav" id="nav" aria-label="Sections">
    <a class="tab" href="#/log" data-view="log" aria-current="page">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 8.2v7.6M8.2 12h7.6"></path></svg>
      <span>Log</span></a>
    <a class="tab" href="#/group" data-view="group">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V13M10 20V4M16 20v-9M2 20h20"></path></svg>
      <span>Group</span></a>
    <a class="tab" href="#/social" data-view="social" hidden>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5a3 3 0 0 1-3 3H9l-4.5 3.2V6.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z"></path></svg>
      <span>Social</span><i class="newdot" id="newdot" hidden></i></a>
  </nav>

  <main>
    <!-- MAIN PAGE: log an activity, see your own history -->
    <section class="view" id="view-log">
      <section class="stats three" id="youstats" aria-label="Your progress"></section>
      <div class="loggrid">
        <div class="card logcard">
          <div class="sec-head" style="margin-bottom:14px"><h2>Log an activity</h2><span class="sec-note live"><i></i><span id="livelbl">live</span></span></div>
          <form id="logform" autocomplete="off">
            <label class="field"><span class="lbl">Who</span>
              <select id="who"><option value="">— pick your name —</option><option value="__new">+ Add someone new</option></select></label>
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
            <label class="field" id="pwwrap" hidden><span class="lbl">Group password</span>
              <input id="pw" type="password" placeholder="ask whoever set this up" maxlength="64"></label>
            <button class="btn" id="save" type="submit">Add miles</button>
          </form>
          <div class="status" id="status"></div>
        </div>

        <section id="histsec">
          <div class="sec-head"><h2>Your history</h2><span class="sec-note" id="histnote"></span></div>
          <div class="facts" id="histfacts"></div>
          <div id="histwrap"><div class="boot">loading...</div></div>
        </section>
      </div>
    </section>

    <!-- GROUP GOAL PAGE: leaderboard + everyone's activity -->
    <section class="view" id="view-group" hidden>
      <section class="stats" id="stats" aria-label="Challenge totals"></section>
      <section>
        <div class="sec-head"><h2>Leaderboard</h2><span class="sec-note" id="boardnote"></span></div>
        <div id="boardwrap"><div class="boot">loading the board...</div></div>
      </section>
      <section>
        <div class="sec-head"><h2>Group activity</h2><span class="sec-note" id="feednote"></span></div>
        <div class="filters" id="filters"></div>
        <div id="feedwrap"></div>
      </section>
    </section>

    <!-- SOCIAL: group chat with photos -->
    <section class="view" id="view-social" hidden>
      <section>
        <div class="sec-head"><h2>Group chat</h2><span class="sec-note live"><i></i><span id="livelbl2">live</span></span></div>
        <div class="card chat" id="chatcard">
          <div class="chatscroll" id="chatscroll" role="log" aria-live="polite"><div class="boot">loading the chat...</div></div>
          <form class="composer" id="chatform" autocomplete="off">
            <div class="cwho" id="cwholock" hidden>
              <span>Posting as</span>
              <span class="cav" id="cav" aria-hidden="true"></span>
              <b class="cme" id="cmename"></b>
              <button class="linkbtn" type="button" id="cswitch">not you?</button>
            </div>
            <div class="cwho" id="cwhopick" hidden>
              <span>Posting as</span>
              <select id="cwho" aria-label="Who you are"><option value="">— pick your name —</option><option value="__new">+ Add someone new</option></select>
              <input id="cnewname" type="text" placeholder="First name" maxlength="24" aria-label="Your name" hidden>
              <button class="linkbtn" type="button" id="ccancel" hidden>cancel</button>
            </div>
            <div class="attach" id="attach" hidden>
              <img id="attachimg" alt="Photo you are about to send">
              <span id="attachnote"></span>
              <button class="rm" type="button" id="attachdrop">remove</button>
            </div>
            <div class="crow">
              <button class="iconbtn" type="button" id="pickimg" aria-label="Add a photo" title="Add a photo">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.8 8.4h3l1.6-2.2h7.2l1.6 2.2h3a.9.9 0 0 1 .9.9v9a.9.9 0 0 1-.9.9H3.8a.9.9 0 0 1-.9-.9v-9a.9.9 0 0 1 .9-.9z"></path><circle cx="12" cy="13.4" r="3.2"></circle></svg>
              </button>
              <textarea id="chatbody" rows="1" maxlength="500" placeholder="Say something to the group"></textarea>
              <button class="sendbtn" type="submit" id="send" aria-label="Send">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.2 20 4l-7.4 16-2.2-6.6z"></path></svg>
              </button>
            </div>
            <input type="file" id="file" accept="image/*" hidden>
            <label class="field" id="cpwwrap" hidden style="margin:11px 0 0"><span class="lbl">Group password</span>
              <input id="cpw" type="password" placeholder="ask whoever set this up" maxlength="64"></label>
            <div class="status" id="cstatus"></div>
          </form>
        </div>
      </section>
    </section>
  </main>

  <footer id="foot"></footer>
</div>

<div class="lightbox" id="lightbox" hidden></div>

<script>
(function(){
  'use strict';

  var S = null;              /* board state: {config, people, entries} */
  var M = [];                /* chat messages, oldest first */
  var VIEWS = ['log','group','social'];
  var feedAll = false;
  var feedWho = '';
  var busy = false, chatBusy = false;
  var pending = null;        /* photo staged in the composer */
  var chatSig = '', chatTimer = null;
  var chatPick = false;      /* composer is asking who you are, rather than assuming */
  var whoReady = false;      /* has fillWho run once? decides remembered-name vs. keep */

  function $(id){ return document.getElementById(id); }
  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function tidy(s){ return String(s == null ? '' : s).replace(/\\s+/g, ' ').trim(); }
  function p2(n){ return n < 10 ? '0' + n : '' + n; }
  function iso(d){ return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  function todayISO(){ return iso(new Date()); }
  function dayOf(s, start){
    var t = Date.parse(s + 'T00:00:00Z'), a = Date.parse(start + 'T00:00:00Z');
    if (isNaN(t) || isNaN(a)) return 0;
    return Math.round((t - a) / 86400000) + 1;
  }
  function clamp(n, lo, hi){ return n < lo ? lo : (n > hi ? hi : n); }
  function num(m){
    var r = Math.round(m * 10) / 10;
    return (r % 1 === 0) ? String(r) : r.toFixed(1);
  }
  function shortDate(s){
    var a = String(s).split('-');
    var mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][(+a[1] || 1) - 1];
    return mo + ' ' + (+a[2]);
  }
  function timeOf(ts){
    var d = new Date(ts), h = d.getHours(), ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (!h) h = 12;
    return h + ':' + p2(d.getMinutes()) + ' ' + ap;
  }
  function dayLabel(ts){
    var k = iso(new Date(ts));
    if (k === todayISO()) return 'Today';
    var y = new Date(); y.setDate(y.getDate() - 1);
    if (k === iso(y)) return 'Yesterday';
    var d = new Date(ts);
    return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()] + ' ' + shortDate(k);
  }
  function keyOf(n){ return String(n == null ? '' : n).trim().toLowerCase(); }
  function ls(k, v){
    try {
      if (v === undefined) return window.localStorage.getItem(k);
      window.localStorage.setItem(k, v);
    } catch (e) {}
    return null;
  }
  var PICK = '— pick your name —';
  function me(){ return ls('hms.me') || ''; }
  /* A random id for this browser, made once and kept. It says nothing about
     who you are -- it only lets the board notice that several entries were
     typed on the same device. */
  function devId(){
    var d = ls('hms.dev');
    if (!d){ d = Math.random().toString(36).slice(2, 10); ls('hms.dev', d); }
    return d;
  }
  /* Who did the typing, when that is not who the miles are for. */
  function loggedBy(e){
    var by = tidy(e.logged_by);
    return (by && keyOf(by) !== keyOf(e.who)) ? by : '';
  }
  function byTag(e){
    var by = loggedBy(e);
    return by ? '<span class="by" title="' + esc('Logged by ' + by) + '">by ' + esc(by) + '</span>' : '';
  }
  function initial(n){ return String(n || '?').trim().charAt(0).toUpperCase() || '?'; }
  function colorOf(n){
    var c = '#7C8A85';
    if (S) S.people.forEach(function(p){ if (keyOf(p.name) === keyOf(n)) c = p.color; });
    return c;
  }

  function elapsed(){ return clamp(dayOf(todayISO(), S.config.start), 0, S.config.days); }
  function onPace(){ return S.config.goal * elapsed() / S.config.days; }
  /* Days you can still log in, today included. The old "days - elapsed" spent
     today the moment it began: on the last day it said 0 days left and called
     everybody short while the whole day was still ahead of them, and every
     other day it divided the per-day plan by one day too few. */
  function remaining(){
    var d = dayOf(todayISO(), S.config.start);
    if (d > S.config.days) return 0;      /* the month is over */
    if (d < 1) return S.config.days;      /* it has not started */
    return S.config.days - d + 1;
  }

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

  /* ---------- routing ---------- */

  function social(){ return !!(S && S.config.social); }
  function route(){
    var h = String(location.hash || '').replace('#/', '').replace('#', '');
    if (VIEWS.indexOf(h) < 0) return 'log';
    // A #/social link while the chat is off lands on Log rather than nothing.
    if (h === 'social' && !social()) return 'log';
    return h;
  }
  function show(r){
    document.querySelector('.tab[data-view="social"]').hidden = !social();
    VIEWS.forEach(function(v){ $('view-' + v).hidden = (v !== r); });
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++){
      if (tabs[i].getAttribute('data-view') === r) tabs[i].setAttribute('aria-current', 'page');
      else tabs[i].removeAttribute('aria-current');
    }
    if (r === 'social'){ startChat(); } else { stopChat(); }
  }
  function onHash(){
    show(route());
    window.scrollTo(0, 0);
  }

  /* ---------- painting ---------- */

  function paint(){
    if (!S) return;
    paintHeader();
    paintYou();
    paintGroup();
    paintHistory();
    dateBounds();
    fillWho();
    paintChatWho();
    if (route() === 'social' && M.length) paintChat(false);
    paintFoot();
  }

  function paintHeader(){
    var c = S.config, el = elapsed(), left = remaining();
    $('tag').textContent = "Everyone's own " + c.goal + '. Same ' + c.days + ' days, same goal, one board.';
    $('clocknum').textContent = left;
    $('clocklbl').textContent = (el === 0) ? 'days to go' : (left === 1 ? 'day left' : 'days left');
  }

  function mine(){
    var found = null;
    standings().forEach(function(r){ if (keyOf(r.name) === keyOf(me())) found = r; });
    return found;
  }

  function paintYou(){
    var c = S.config, el = elapsed(), left = remaining(), r = mine();
    if (!r){
      $('youstats').innerHTML =
        stat('Your ' + c.unitLong, '—', 'log one to start yours') +
        stat('On-pace mark', el === 0 ? '—' : num(onPace()), el === 0 ? 'starts ' + shortDate(c.start) : c.unitLong + ' by today') +
        stat('Days left', String(left), left ? 'of ' + c.days : 'the month is done');
      return;
    }
    var diff = r.total - onPace();
    var short = num(Math.max(0, c.goal - r.total)) + ' ' + c.unit;
    var need = left > 1 ? num(Math.max(0, (c.goal - r.total) / left)) + ' ' + c.unit + '/day from here'
             : left === 1 ? short + ' to finish today'
             : short + ' short';
    $('youstats').innerHTML =
      stat('Your ' + c.unitLong, num(r.total),
        r.total >= c.goal ? 'done — all ' + c.goal + ' in' : num(c.goal - r.total) + ' ' + c.unit + ' to go') +
      stat('Your pace',
        r.total >= c.goal ? 'done' : (el === 0 ? '—' : (diff >= 0 ? '+' + num(diff) : num(diff))),
        r.total >= c.goal ? 'you finished your ' + c.goal : (el === 0 ? 'starts ' + shortDate(c.start) : (diff >= 0 ? c.unit + ' ahead of pace' : c.unit + ' behind pace'))) +
      stat('To finish', r.total >= c.goal ? '✓' : (left > 0 ? num((c.goal - r.total) / left) : '—'),
        r.total >= c.goal ? 'nothing left to do' : need);
  }

  function paintGroup(){
    var c = S.config, el = elapsed();
    var rows = standings();
    var today = todayISO();
    var groupTotal = S.entries.reduce(function(s, e){ return s + e.miles; }, 0);
    var todayTotal = S.entries.reduce(function(s, e){ return s + (e.date === today ? e.miles : 0); }, 0);
    var r = mine();
    var onPaceCount = 0, finished = 0;
    rows.forEach(function(x){
      if (x.total >= onPace()) onPaceCount++;
      if (x.total >= c.goal) finished++;
    });

    $('stats').innerHTML =
      stat('Your ' + c.unitLong, r ? num(r.total) : '—',
        r ? (r.total >= c.goal ? 'done — all ' + c.goal + ' in' : num(c.goal - r.total) + ' ' + c.unit + ' to go')
          : 'add some to start yours') +
      stat('On-pace mark', el === 0 ? '—' : num(onPace()),
        el === 0 ? 'starts ' + shortDate(c.start) : c.unitLong + ' each by today') +
      stat('On pace', (el === 0 || !rows.length) ? '—' : onPaceCount + ' of ' + rows.length,
        el === 0 ? 'nobody behind yet' : (finished ? finished + ' already finished' : 'holding their own ' + c.goal)) +
      stat('Miles logged', num(groupTotal),
        rows.length ? num(todayTotal) + ' ' + c.unit + ' of it today, across ' + rows.length + ' of us'
                    : 'nobody logged yet');

    $('boardnote').textContent = el === 0 ? 'starts ' + shortDate(c.start) : 'orange line = on-pace';
    $('boardwrap').innerHTML = rows.length
      ? '<ul class="board">' + rows.map(rowHTML).join('') + '</ul>'
      : '<div class="board"><div class="empty"><b>Nobody has started</b>Add your name and your ' + c.goal + ' starts here.</div></div>';

    paintFilters(rows);
    paintFeed();
  }

  function stat(k, v, s){
    return '<div class="stat"><div class="stat-k">' + esc(k) + '</div><div class="stat-v">' + esc(v) +
      '</div><div class="stat-s">' + esc(s) + '</div></div>';
  }

  function rowHTML(r, i){
    var c = S.config, el = elapsed(), left = remaining();
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
    var right = r.total >= c.goal ? 'finished'
      : left > 1 ? 'needs ' + num((c.goal - r.total) / left) + '/day'
      : left === 1 ? 'needs ' + num(c.goal - r.total) + ' today'
      : num(c.goal - r.total) + ' ' + c.unit + ' short';

    var done = r.total >= c.goal;
    return '<li class="row' + (i === 0 && r.total > 0 ? ' lead' : '') + (keyOf(r.name) === keyOf(me()) ? ' me' : '') + '">' +
      '<span class="rank' + (done ? ' done' : '') + '"' + (done ? ' title="finished"' : '') + '>' +
        (done ? '✓' : (i + 1)) + '</span>' +
      '<span class="mark" style="background:' + esc(r.color) + '"></span>' +
      '<div class="who"><span class="name">' + esc(r.name) +
        (keyOf(r.name) === keyOf(me()) ? '<span class="you">you</span>' : '') +
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

  function paintFilters(rows){
    if (rows.length < 2){ $('filters').innerHTML = ''; return; }
    $('filters').innerHTML = '<button class="fbtn" type="button" data-filter="" aria-pressed="' +
      (feedWho ? 'false' : 'true') + '">Everyone</button>' +
      rows.map(function(r){
        return '<button class="fbtn" type="button" data-filter="' + esc(r.name) + '" aria-pressed="' +
          (keyOf(feedWho) === keyOf(r.name) ? 'true' : 'false') + '"><i style="background:' + esc(r.color) +
          '"></i>' + esc(r.name) + '</button>';
      }).join('');
  }

  function paintFeed(){
    var CAP = 24;
    var list = feedWho ? S.entries.filter(function(e){ return keyOf(e.who) === keyOf(feedWho); }) : S.entries;
    var shown = feedAll ? list : list.slice(0, CAP);

    $('feednote').textContent = list.length
      ? list.length + (list.length === 1 ? ' entry' : ' entries') + (feedWho ? ' from ' + feedWho : '')
      : 'empty';

    $('feedwrap').innerHTML = shown.length
      ? '<ul class="feed">' + shown.map(function(e){
          return '<li class="ev">' +
            '<span class="dot" style="background:' + esc(colorOf(e.who)) + '"></span>' +
            '<span class="ev-txt"><b>' + esc(e.who) + '</b> ' + num(e.miles) + ' ' + esc(S.config.unit) +
              (e.note ? ' <span class="note">— ' + esc(e.note) + '</span>' : '') + '</span>' +
            byTag(e) +
            '<span class="ev-when">' + esc(shortDate(e.date)) + '</span>' +
            '<button class="rm" type="button" data-kind="entry" data-id="' + esc(e.id) + '" aria-label="Remove this entry">×</button>' +
          '</li>';
        }).join('') + '</ul>' +
        (list.length > CAP ? '<button class="more" type="button" id="morebtn">' +
          (feedAll ? 'Show the latest ' + CAP + ' only' : 'Show all ' + list.length + ' entries') + '</button>' : '')
      : '<div class="empty"><b>Nothing here yet</b>' +
        (feedWho ? esc(feedWho) + ' has not logged anything.' : 'Entries show up the moment somebody adds one.') + '</div>';
  }

  /* ---------- your history ---------- */

  function streakOf(dates){
    var set = {}, n = 0;
    dates.forEach(function(d){ set[d] = 1; });
    var d = new Date();
    if (!set[iso(d)]) d.setDate(d.getDate() - 1);
    while (set[iso(d)]){ n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function paintHistory(){
    var c = S.config;
    var name = me();
    var list = name ? S.entries.filter(function(e){ return keyOf(e.who) === keyOf(name); }) : [];

    if (!name){
      $('histnote').textContent = '';
      $('histfacts').innerHTML = '';
      $('histwrap').innerHTML = '<div class="hist"><div class="empty"><b>Nothing of yours yet</b>' +
        'Log your first activity and it lands here, with your streak and your daily average.</div></div>';
      return;
    }

    $('histnote').textContent = list.length
      ? list.length + (list.length === 1 ? ' activity' : ' activities')
      : 'nothing yet';

    var total = list.reduce(function(s, e){ return s + e.miles; }, 0);
    var days = {};
    list.forEach(function(e){ days[e.date] = (days[e.date] || 0) + e.miles; });
    var keys = Object.keys(days);
    var best = 0, bestDay = '';
    keys.forEach(function(k){ if (days[k] > best){ best = days[k]; bestDay = k; } });
    var streak = streakOf(keys);

    var many = keys.length > 1;
    var facts = [
      ['<b>' + num(total) + '</b>' + esc(c.unit) + ' logged', keys.length > 0],
      ['<b>' + keys.length + '</b>' + (keys.length === 1 ? 'day out' : 'days out'), keys.length > 0],
      // On a single day these two just repeat the total, so they wait for a second.
      ['<b>' + num(total / (keys.length || 1)) + '</b>' + esc(c.unit) + ' on a day you go', many],
      ['<b>' + num(best) + '</b>best day, ' + esc(shortDate(bestDay || todayISO())), many],
      ['<b>' + streak + '</b>day streak', streak > 0]
    ];
    $('histfacts').innerHTML = facts.filter(function(f){ return f[1]; })
      .map(function(f){ return '<span class="fact">' + f[0] + '</span>'; }).join('');

    $('histwrap').innerHTML = list.length
      ? '<ul class="hist">' + list.map(function(e){
          return '<li class="hrow">' +
            '<span class="hdate">' + esc(shortDate(e.date)) + '</span>' +
            '<span class="hmiles">' + num(e.miles) + '<small>' + esc(c.unit) + '</small></span>' +
            '<span class="hnote">' + (e.note ? esc(e.note) : '') + byTag(e) + '</span>' +
            '<button class="rm" type="button" data-kind="entry" data-id="' + esc(e.id) + '" aria-label="Remove this activity">×</button>' +
          '</li>';
        }).join('') + '</ul>'
      : '<div class="hist"><div class="empty"><b>Nothing logged yet</b>Your first activity shows up here.</div></div>';
  }

  function paintFoot(){
    var c = S.config;
    $('foot').innerHTML =
      esc(c.unitLong.charAt(0).toUpperCase() + c.unitLong.slice(1) + ' logged between ' + shortDate(c.start) +
        ' and ' + shortDate(c.end) + ' ' + String(c.start).slice(0, 4) + " · everyone's own " + c.goal) +
      '<br>Anyone with this link can log miles' + (c.social ? ' and post to the chat' : '') +
      (c.locked ? ', with the group password.' : '.') +
      ' The board refreshes on its own every 30 seconds.';
  }

  /* The Who menu opens blank on a device that has not said who it is.
     It used to open on the first name in the list -- and that list is sorted
     by total, so a new phone silently pre-selected whoever was winning. Fill
     in miles, tap Add, and you had logged them for somebody else without ever
     touching the field. A blank cannot be submitted, so the mistake now has to
     be made on purpose. A device that already knows you still gets your own
     name: defaulting to yourself is the point of remembering. */
  function fillWho(){
    var rows = standings();
    [['who', 'newwrap'], ['cwho', 'cnewname']].forEach(function(pair){
      var sel = $(pair[0]);
      // On the first fill fall back to whoever this device already is. After
      // that keep whatever is showing — the blank and "+ Add someone new"
      // included, or a 30-second refresh wipes a name being typed.
      var keep = whoReady ? sel.value : me();
      sel.innerHTML = '<option value="">' + PICK + '</option>' +
        rows.map(function(r){
          return '<option value="' + esc(r.name) + '">' + esc(r.name) + '</option>';
        }).join('') + '<option value="__new">+ Add someone new</option>';
      var found = false;
      for (var i = 0; i < sel.options.length; i++){
        if (keyOf(sel.options[i].value) === keyOf(keep)){ sel.selectedIndex = i; found = true; break; }
      }
      // Nothing to restore — an unknown device, or a name since removed from
      // the board. Blank, never the person at the top of it.
      if (!found) sel.value = '';
      if (!rows.length) sel.value = '__new';
      $(pair[1]).hidden = sel.value !== '__new';
    });
    whoReady = true;
  }

  /* ---------- chat ---------- */

  function startChat(){
    if (!social()) return;
    loadChat(true);
    if (!chatTimer){
      chatTimer = setInterval(function(){
        if (!document.hidden && route() === 'social' && !chatBusy) loadChat(false);
      }, 7000);
    }
  }
  function stopChat(){
    if (chatTimer){ clearInterval(chatTimer); chatTimer = null; }
  }

  function loadChat(force){
    if (!social()) return Promise.resolve();
    return fetch('/api/chat', { cache: 'no-store' })
      .then(function(r){ if (!r.ok) throw new Error('chat ' + r.status); return r.json(); })
      .then(function(d){
        M = d.messages || [];
        connected(true);
        var sig = M.length + ':' + (M.length ? M[M.length - 1].id : '');
        if (!force && sig === chatSig){ markSeen(); return; }
        chatSig = sig;
        paintChat(force);
        markSeen();
      })
      .catch(function(){ connected(false); });
  }

  function newest(){ return M.length ? M[M.length - 1].ts : 0; }
  function markSeen(){
    if (route() === 'social' && !document.hidden) ls('hms.seen', String(newest()));
    paintDot();
  }
  function paintDot(){
    var seen = Number(ls('hms.seen') || 0);
    $('newdot').hidden = !(social() && newest() > seen && route() !== 'social');
  }

  function paintChat(force){
    var box = $('chatscroll');
    var atEnd = force || (box.scrollHeight - box.scrollTop - box.clientHeight < 90);

    if (!M.length){
      box.innerHTML = '<div class="empty"><b>No messages yet</b>Say hello, or post a photo from today.</div>';
      return;
    }

    var html = '', lastDay = '', lastWho = '', lastTs = 0;
    M.forEach(function(m){
      var day = iso(new Date(m.ts));
      if (day !== lastDay){
        html += '<div class="daydiv">' + esc(dayLabel(m.ts)) + '</div>';
        lastDay = day; lastWho = ''; lastTs = 0;
      }
      var isMine = keyOf(m.who) === keyOf(me());
      var tail = keyOf(m.who) === keyOf(lastWho) && (m.ts - lastTs) < 300000;
      lastWho = m.who; lastTs = m.ts;
      var color = colorOf(m.who);

      html += '<div class="msg' + (isMine ? ' mine' : '') + (tail ? ' tail' : '') + '">' +
        '<span class="av" style="background:' + esc(color) + '" aria-hidden="true">' + esc(initial(m.who)) + '</span>' +
        '<div class="bub">' +
          '<span class="from" style="color:' + esc(color) + '">' + esc(m.who) + '</span>' +
          (m.body ? '<div class="text">' + esc(m.body) + '</div>' : '') +
          (m.img ? '<img class="photo" src="/img/' + esc(m.img) + '" alt="Photo from ' + esc(m.who) + '"' +
            (m.w && m.h ? ' width="' + m.w + '" height="' + m.h + '"' : '') + ' loading="lazy">' : '') +
          '<div class="stamp"><span>' + esc(timeOf(m.ts)) + '</span>' +
            '<button class="rm" type="button" data-kind="msg" data-id="' + esc(m.id) + '" aria-label="Remove this message">×</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    box.innerHTML = html;
    if (!atEnd) return;
    // Photos land after the markup does, so pin to the bottom again as each
    // one finishes and pushes the height down.
    var toEnd = function(){ box.scrollTop = box.scrollHeight; };
    toEnd();
    var shots = box.querySelectorAll('.photo');
    for (var i = 0; i < shots.length; i++){
      if (!shots[i].complete) shots[i].addEventListener('load', toEnd);
    }
  }

  /* Photos are downscaled in the browser: a phone shot goes out around 150 KB
     instead of 4 MB, so the upload is quick and the row stays small. */
  function shrink(file, done){
    if (!file || file.type.indexOf('image/') !== 0){ done(null, 'That file is not an image.'); return; }
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function(){
      var max = 1280;
      var w = img.naturalWidth || 1, h = img.naturalHeight || 1;
      var k = Math.min(1, max / Math.max(w, h));
      w = Math.max(1, Math.round(w * k)); h = Math.max(1, Math.round(h * k));
      var cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      var q = 0.78, data = '';
      for (var i = 0; i < 6; i++){
        data = cv.toDataURL('image/jpeg', q);
        if (data.length * 0.75 < 420000) break;
        q -= 0.11;
      }
      done({ data: data, w: w, h: h, bytes: Math.round(data.length * 0.75) }, null);
    };
    img.onerror = function(){
      URL.revokeObjectURL(url);
      done(null, 'That image would not open. Try a JPEG or PNG.');
    };
    img.src = url;
  }

  function stagePhoto(file){
    csay('Preparing the photo...');
    shrink(file, function(p, err){
      if (!p){ csay(err, true); return; }
      pending = p;
      $('attachimg').src = p.data;
      $('attachnote').textContent = p.w + '×' + p.h + ' · ' + Math.max(1, Math.round(p.bytes / 1024)) + ' KB';
      $('attach').hidden = false;
      $('pickimg').setAttribute('aria-pressed', 'true');
      csay('');
      $('chatbody').focus();
    });
  }
  function clearPhoto(){
    pending = null;
    $('attach').hidden = true;
    $('attachimg').removeAttribute('src');
    $('file').value = '';
    $('pickimg').setAttribute('aria-pressed', 'false');
  }

  /* The composer posts as this device's own name rather than offering a menu of
     everyone. A dropdown is a fair trade for miles, where a wrong entry is a
     visible, deletable fact; in a conversation it is an invitation to speak as
     somebody else. "not you?" is still there for a shared phone. */
  function paintChatWho(){
    var known = me();
    var open = chatPick || !known;
    $('cwholock').hidden = open;
    $('cwhopick').hidden = !open;
    $('ccancel').hidden = !known;
    if (!open){
      $('cmename').textContent = known;
      $('cav').textContent = initial(known);
      $('cav').style.background = colorOf(known);
    }
  }

  function chatWho(){
    if ($('cwhopick').hidden) return tidy(me());
    var sel = $('cwho');
    return tidy(sel.value === '__new' ? $('cnewname').value : sel.value);
  }

  function sendChat(e){
    e.preventDefault();
    if (chatBusy) return;

    var who = chatWho();
    if (!who){
      csay('Pick who you are first.', true);
      chatPick = true; paintChatWho(); $('cnewname').focus();
      return;
    }
    var text = $('chatbody').value.trim();
    if (!text && !pending){ csay('Write something, or add a photo.', true); return; }

    var key = $('cpw').value || ls('hms.key') || '';
    setChatBusy(true); csay(pending ? 'Sending the photo...' : 'Sending...');

    post('/api/chat', {
      who: who, body: text, key: key,
      image: pending ? pending.data : null,
      w: pending ? pending.w : null,
      h: pending ? pending.h : null
    }).then(function(){
      if (key) ls('hms.key', key);
      ls('hms.me', who);
      $('chatbody').value = ''; grow();
      $('cpw').value = ''; $('cpwwrap').hidden = true;
      $('pw').value = ''; $('pwwrap').hidden = true;
      clearPhoto();
      chatPick = false; paintChatWho();
      setChatBusy(false); csay('');
      // Board first: a brand-new poster has only just been given their colour.
      return load().then(function(){ return loadChat(true); });
    }).catch(function(err){ setChatBusy(false); fail(err, 'chat'); });
  }

  function grow(){
    var t = $('chatbody');
    t.style.height = 'auto';
    t.style.height = Math.min(116, t.scrollHeight) + 'px';
  }

  function openPhoto(src){
    $('lightbox').innerHTML = '<img src="' + esc(src) + '" alt="">';
    $('lightbox').hidden = false;
  }
  function closePhoto(){
    $('lightbox').hidden = true;
    $('lightbox').innerHTML = '';
  }

  /* ---------- talking to the server ---------- */

  function say(msg, isErr){
    $('status').textContent = msg || '';
    $('status').className = 'status' + (isErr ? ' err' : '');
  }
  function csay(msg, isErr){
    $('cstatus').textContent = msg || '';
    $('cstatus').className = 'status' + (isErr ? ' err' : '');
  }
  function setBusy(b){
    busy = b;
    $('save').disabled = b;
    $('save').textContent = b ? 'Saving...' : 'Add miles';
  }
  function setChatBusy(b){
    chatBusy = b;
    $('send').disabled = b;
  }
  function connected(ok){
    $('root').classList.toggle('offline', !ok);
    $('livelbl').textContent = ok ? 'live' : 'offline';
    $('livelbl2').textContent = ok ? 'live' : 'offline';
  }

  function load(){
    return fetch('/api/state', { cache: 'no-store' })
      .then(function(r){ if (!r.ok) throw new Error('state ' + r.status); return r.json(); })
      .then(function(d){
        var first = !S;
        S = d;
        connected(true);
        if (first) initForm();
        // The nav is drawn before config lands, so settle the route once it has.
        if (first) onHash();
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
    d.min = c.start;
    d.value = today < c.start ? c.start : (today > c.end ? c.end : today);
    dateBounds();
    $('miles').max = c.maxMiles;
    // Ask for the password up front rather than letting the first thing someone
    // writes bounce off a 401.
    if (c.locked && !ls('hms.key')){
      $('pwwrap').hidden = false;
      $('cpwwrap').hidden = false;
    }
  }

  /* The picker stops at today, so nobody logs Thursday's run on Tuesday. Kept
     fresh on every paint, or a tab left open overnight stays a day behind. */
  function dateBounds(){
    var c = S.config, today = todayISO();
    $('date').max = today < c.end ? today : c.end;
  }

  function submit(e){
    e.preventDefault();
    if (busy) return;
    var c = S.config;

    var sel = $('who');
    if (!sel.value){
      say('Pick who you are first — the board will not guess.', true);
      sel.focus();
      return;
    }
    var who = tidy(sel.value === '__new' ? $('newname').value : sel.value);
    if (!who){ say('Type your name first.', true); $('newname').focus(); return; }

    var miles = parseFloat($('miles').value);
    if (!(miles > 0)){ say('How many ' + c.unitLong + '? Enter a number above zero.', true); return; }
    if (miles > c.maxMiles){ say('That is over ' + c.maxMiles + ' ' + c.unit + ' — split it into separate entries.', true); return; }

    var date = $('date').value;
    if (!date || date < c.start || date > c.end){
      say('Pick a date between ' + shortDate(c.start) + ' and ' + shortDate(c.end) + '.', true);
      return;
    }
    if (date > todayISO()){ say('That day has not happened yet.', true); return; }

    var key = $('pw').value || ls('hms.key') || '';
    setBusy(true); say('Saving...');

    post('/api/entries', { who: who, date: date, miles: miles, note: $('note').value, key: key,
                           by: me() || who, dev: devId() })
      .then(function(){
        if (key) ls('hms.key', key);
        ls('hms.me', who);
        $('miles').value = ''; $('note').value = ''; $('newname').value = '';
        $('pw').value = ''; $('pwwrap').hidden = true;
        $('cpw').value = ''; $('cpwwrap').hidden = true;
        setBusy(false);
        say('Logged ' + num(miles) + ' ' + c.unit + ' for ' + who + '.');
        return load();
      })
      .catch(function(err){ setBusy(false); fail(err, 'log'); });
  }

  function fail(err, scope){
    var isChat = scope === 'chat';
    var out = isChat ? csay : say;
    if (err && err.status === 401){
      $(isChat ? 'cpwwrap' : 'pwwrap').hidden = false;
      $(isChat ? 'cpw' : 'pw').focus();
      out(ls('hms.key') ? 'That password is not right. Try again.' : 'This board needs the group password.', true);
      try { window.localStorage.removeItem('hms.key'); } catch (e) {}
      return;
    }
    connected(false);
    out((err && err.error) || 'That did not save — check your connection and try again.', true);
  }

  /* ---------- interaction ---------- */

  function onClick(e){
    var t = e.target;

    if (t.id === 'morebtn'){ feedAll = !feedAll; paintFeed(); return; }
    if (t.classList && t.classList.contains('photo')){ openPhoto(t.getAttribute('src')); return; }

    var f = t.closest ? t.closest('.fbtn') : null;
    if (f){
      feedWho = f.getAttribute('data-filter') || '';
      feedAll = false;
      paintFilters(standings());
      paintFeed();
      return;
    }

    var btn = t.closest ? t.closest('.rm') : null;
    if (!btn) return;

    if (btn.id === 'attachdrop'){ clearPhoto(); csay(''); return; }
    if (busy || chatBusy) return;

    // Two clicks to remove: the first arms the button for four seconds.
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

    var key = ls('hms.key') || $('pw').value || $('cpw').value || '';
    if (btn.getAttribute('data-kind') === 'msg'){
      setChatBusy(true); csay('Removing...');
      post('/api/chat/delete', { id: btn.getAttribute('data-id'), key: key })
        .then(function(){ setChatBusy(false); csay(''); return loadChat(false); })
        .catch(function(err){ setChatBusy(false); fail(err, 'chat'); });
    } else {
      setBusy(true); say('Removing...');
      post('/api/entries/delete', { id: btn.getAttribute('data-id'), key: key })
        .then(function(){ setBusy(false); say('Entry removed.'); return load(); })
        .catch(function(err){ setBusy(false); fail(err, 'log'); });
    }
  }

  /* ---------- boot ---------- */

  $('logform').addEventListener('submit', submit);
  $('chatform').addEventListener('submit', sendChat);

  $('who').addEventListener('change', function(){
    var isNew = this.value === '__new';
    $('newwrap').hidden = !isNew;
    if (this.value) say('');
    if (isNew) $('newname').focus();
  });
  $('cwho').addEventListener('change', function(){
    var isNew = this.value === '__new';
    $('cnewname').hidden = !isNew;
    if (isNew) $('cnewname').focus();
  });
  $('cswitch').addEventListener('click', function(){
    chatPick = true;
    paintChatWho();
    $('cwho').focus();
  });
  $('ccancel').addEventListener('click', function(){
    chatPick = false;
    $('cnewname').value = '';
    paintChatWho();
    $('chatbody').focus();
  });

  $('pickimg').addEventListener('click', function(){ $('file').click(); });
  $('file').addEventListener('change', function(){
    if (this.files && this.files[0]) stagePhoto(this.files[0]);
  });

  $('chatbody').addEventListener('input', grow);
  $('chatbody').addEventListener('keydown', function(e){
    if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); $('chatform').requestSubmit ? $('chatform').requestSubmit() : sendChat(e); }
  });
  $('chatbody').addEventListener('paste', function(e){
    var items = (e.clipboardData && e.clipboardData.items) || [];
    for (var i = 0; i < items.length; i++){
      if (items[i].type.indexOf('image/') === 0){
        var f = items[i].getAsFile();
        if (f){ e.preventDefault(); stagePhoto(f); return; }
      }
    }
  });

  ['dragenter','dragover'].forEach(function(ev){
    $('chatcard').addEventListener(ev, function(e){ e.preventDefault(); this.classList.add('drop'); });
  });
  ['dragleave','drop'].forEach(function(ev){
    $('chatcard').addEventListener(ev, function(e){ e.preventDefault(); this.classList.remove('drop'); });
  });
  $('chatcard').addEventListener('drop', function(e){
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) stagePhoto(f);
  });

  $('lightbox').addEventListener('click', closePhoto);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !$('lightbox').hidden) closePhoto();
  });

  document.addEventListener('click', onClick);
  window.addEventListener('hashchange', onHash);
  document.addEventListener('visibilitychange', function(){
    if (document.hidden) return;
    load();
    if (social()) loadChat(false);
  });

  onHash();
  // Chat is polled separately, only while the Social tab is open, and only when
  // the server has SOCIAL on — so this waits for config rather than racing it.
  load().then(function(){ return loadChat(true); }).then(paintDot);
  setInterval(function(){
    if (document.hidden || busy) return;
    load();
    // Keep the unseen dot honest from the other tabs. Social does its own
    // faster polling while it is the tab you are actually looking at.
    if (social() && route() !== 'social' && !chatBusy) loadChat(false);
  }, 30000);
})();
</script>
</body>
</html>
`;
