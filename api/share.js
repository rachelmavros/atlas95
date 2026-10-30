// Link previews for shared games. vercel.json sends /s/<id> (a saved share) and /g/<game> (a link that carries its own data) here.
// Messaging apps read this page's title and description for the preview card; people's browsers go straight on to the app.
// There is no og:image on purpose: without one, Messages shows a compact card with the small app icon instead of a big picture.
const SB_URL = process.env.SUPABASE_URL || "https://gbzqzphqqfwgonmrnuiw.supabase.co";
const SB_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_vlSmgIMoOEB3KKCfEaaddQ_bhNCJvct";

const GAMES = {
  doodle: { name: "Doodle Relay", emo: "🎨", title: n => `${n} sent you a Doodle Relay`, desc: n => `Watch the drawing from ${n} come to life, then guess what it is.` },
  pindrop: { name: "Pin Drop", emo: "📍", title: n => `${n} challenged you to Pin Drop`, desc: n => `Same five cities, one blank map. Can you drop your pins closer than ${n}?` },
  closest: { name: "Closest Wins", emo: "🎯", title: n => `${n} challenged you to Closest Wins`, desc: n => `Seven questions, guess the numbers. Can you get closer than ${n}?` }
};
// every vault game, for challenge links (/g/<game>#ch=...) that carry no preview text of their own
const NAMES = { word: "Daily Word", quad: "Quad Word", pindrop: "Pin Drop", closest: "Closest Wins", doodle: "Doodle Relay", snake: "Snake", flappy: "Flappy Globe", t2048: "2048",
  logic: "Logic Puzzles", lights: "Lights Out", sudoku: "Sudoku", mines: "Minesweeper", anagram: "Anagram Sprint", solitaire: "Solitaire", draw: "Draw from Memory",
  circle: "Perfect Circle", memory: "Memory Match", pool: "Pool", connect4: "Connect Four", checkers: "Checkers", riff: "Riff Rush", frettunes: "Fret Tunes" };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

module.exports = async (req, res) => {
  const id = String(req.query.id || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 16);
  let game = String(req.query.g || "").replace(/[^a-z0-9]/g, ""), name = "", pt = "", pd = "";
  if (id) {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/shares?id=eq.${id}&select=game,data`, { headers: { apikey: SB_KEY } });
      const row = (await r.json())[0];
      // a share can carry its own preview text (vault challenges do)
      if (row) { game = row.game; name = (row.data && row.data.n) || ""; pt = (row.data && row.data.t) || ""; pd = (row.data && row.data.d) || ""; }
    } catch (e) { /* the app still opens the share itself */ }
  }
  const g = GAMES[game], who = name || "A friend", them = name || "your friend";
  const title = String(pt || (g ? `${g.emo} ${g.title(who)}` : NAMES[game] ? `🏁 ${who} challenged you to ${NAMES[game]}` : "Atlas95")).slice(0, 120);
  const desc = String(pd || (g ? `${g.desc(them)} ${g.name} on Atlas95.` : NAMES[game] ? `Same game, same start. Can you beat ${them}? Atlas95 Game Vault.` : "A retro study desktop with games.")).slice(0, 200);
  // a saved share opens as /#s=<id>; a /g/ link keeps the data that's already in its #fragment
  const go = id ? `"/#s=${id}"` : `"/"+location.hash`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", id ? "public, s-maxage=86400" : "public, s-maxage=3600");
  res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:site_name" content="Atlas95"><meta property="og:type" content="website">
<link rel="apple-touch-icon" href="/icon-192.png"><link rel="icon" type="image/png" href="/icon-192.png"><meta name="theme-color" content="#008080">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}">
<script>location.replace(${go})</script></head>
<body style="font:16px sans-serif;background:#008080;color:#fff;text-align:center;padding:40px">Opening Atlas95... <a style="color:#fff" href="/">Tap here</a> if nothing happens.</body></html>`);
};
