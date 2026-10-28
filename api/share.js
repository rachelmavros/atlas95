// Link previews for shared games. vercel.json sends /s/<id> (a saved share) and /g/<game> (a link that carries its own data) here.
// Messaging apps read this page's title and description for the preview card; people's browsers go straight on to the app.
const SB_URL = process.env.SUPABASE_URL || "https://gbzqzphqqfwgonmrnuiw.supabase.co";
const SB_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_vlSmgIMoOEB3KKCfEaaddQ_bhNCJvct";

const GAMES = {
  doodle: { name: "Doodle Relay", emo: "🎨", title: n => `${n} sent you a Doodle Relay`, desc: n => `Watch the drawing from ${n} come to life, then guess what it is.` },
  pindrop: { name: "Pin Drop", emo: "📍", title: n => `${n} challenged you to Pin Drop`, desc: n => `Same five cities, one blank map. Can you drop your pins closer than ${n}?` },
  closest: { name: "Closest Wins", emo: "🎯", title: n => `${n} challenged you to Closest Wins`, desc: n => `Seven questions, guess the numbers. Can you get closer than ${n}?` }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

module.exports = async (req, res) => {
  const id = String(req.query.id || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 16);
  let game = String(req.query.g || "").replace(/[^a-z0-9]/g, ""), name = "";
  if (id) {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/shares?id=eq.${id}&select=game,data`, { headers: { apikey: SB_KEY } });
      const row = (await r.json())[0];
      if (row) { game = row.game; name = (row.data && row.data.n) || ""; }
    } catch (e) { /* the app still opens the share itself */ }
  }
  const g = GAMES[game], who = name || "A friend", them = name || "your friend";
  const title = g ? `${g.emo} ${g.title(who)}` : "Atlas95";
  const desc = g ? `${g.desc(them)} ${g.name} on Atlas95.` : "A retro study desktop with games.";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const img = `https://${host}/icon-512.png`;
  // a saved share opens as /#s=<id>; a /g/ link keeps the data that's already in its #fragment
  const go = id ? `"/#s=${id}"` : `"/"+location.hash`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", id ? "public, s-maxage=86400" : "public, s-maxage=3600");
  res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:site_name" content="Atlas95"><meta property="og:type" content="website"><meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}">
<script>location.replace(${go})</script></head>
<body style="font:16px sans-serif;background:#008080;color:#fff;text-align:center;padding:40px">Opening Atlas95... <a style="color:#fff" href="/">Tap here</a> if nothing happens.</body></html>`);
};
