// Fret Tunes for the Atlas95 Game Vault: play a tune on a guitar fretboard. Read the tab, press that string and fret, and the note plays.
// Songs come from Riff Rush (loaded first as a dependency). Standard tuning; songs drop an octave so they sit in open position.
(()=>{
const {SONGS,parse}=A95G.riff._t;
const STRINGS=[["e",64],["B",59],["G",55],["D",50],["A",45],["E",40]],FRETS=6,NOTE_NAMES=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const LEVELS={easy:{label:"Easy",hint:"glow",par:2.2},medium:{label:"Medium",hint:"tab",par:3},hard:{label:"Hard",hint:"names",par:4}};
// each note gets a string and fret: low frets first (open position, like a beginner plays), then whatever is nearest the hand
function tab(song){const ns=parse(song.n).filter(x=>x.midi!=null);let hand=2;
  return ns.map(x=>{const m=x.midi-12,cost=f=>f+.3*Math.abs(f-hand),c=STRINGS.map(([n,o],s)=>({s,f:m-o})).filter(c=>c.f>=0&&c.f<FRETS).sort((a,b)=>cost(a.f)-cost(b.f))[0];
    if(c.f>0)hand=c.f;return {midi:m,beats:x.beats,s:c.s,f:c.f}})}
const CSS=`
.ft-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;max-width:560px;margin:0 auto}
.ft-list{display:flex;flex-direction:column;gap:4px;width:100%}
.ft-song{display:flex;align-items:center;gap:8px;text-align:left;padding:6px 10px;min-height:44px}
.ft-song b{flex:1}.ft-song .sub{font-weight:400;color:#404040;font-size:12px}.ft-song .ft-st{font-size:13px;white-space:nowrap;letter-spacing:1px}.ft-song.today{background:#fffbe0}
.ft-hud{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
.ft-hud div{background:var(--hi);box-shadow:var(--sunken);padding:2px 10px;text-align:center;min-width:64px}
.ft-hud small{display:block;font-size:11px;color:#404040}.ft-hud b{font-size:16px;font-variant-numeric:tabular-nums}
.ft-big{font-size:30px;font-weight:700;text-align:center}.ft-stars{font-size:28px;letter-spacing:2px;text-align:center}.ft-res{text-align:center;line-height:1.6}
.ft-tab{width:min(100%,520px);background:#fff;box-shadow:var(--sunken);padding:4px 0}.ft-tab svg{display:block;width:100%;height:auto}
.ft-names{display:flex;gap:10px;justify-content:center;align-items:baseline;font-weight:700;min-height:2em;flex-wrap:wrap}
.ft-names span{color:#808080;font-size:16px}.ft-names .now{color:#000080;font-size:30px}.ft-names .done{color:#c0c0c0;font-size:14px}
.ft-board{width:min(100%,520px);display:grid;grid-template-columns:22px .7fr repeat(5,1fr);background:#c89660;box-shadow:var(--sunken);touch-action:manipulation;user-select:none;-webkit-user-select:none}
.ft-board .lab{display:flex;align-items:center;justify-content:center;font:700 12px sans-serif;background:var(--face)}
.ft-board button{position:relative;height:38px;border:0;padding:0;margin:0;background:transparent;border-right:3px solid #d8d8d8;cursor:pointer;font:inherit}
.ft-board button.open{background:#e8d5b0;border-right:6px solid #f4f4f4}
.ft-board button::before{content:"";position:absolute;left:0;right:0;top:50%;border-top:var(--sw,1.5px) solid #303030}
.ft-board button.dot::after{content:"";position:absolute;width:10px;height:10px;border-radius:50%;background:#f4ecd8;left:50%;top:100%;transform:translate(-50%,-50%);z-index:1}
.ft-board button i{position:relative;z-index:2;display:inline-block;width:26px;height:26px;line-height:26px;border-radius:50%;font:700 13px sans-serif;font-style:normal}
.ft-board button.glow i{background:#ffd800;box-shadow:0 0 0 3px #fff,0 0 12px 4px #ffd800}
.ft-board button.ok i{background:#20b020;color:#fff}.ft-board button.no i{background:#e02020;color:#fff}
.ft-board .num{text-align:center;font:700 12px sans-serif;background:var(--face);padding:2px 0}
.ft-free{text-align:center;font-weight:700;min-height:1.4em}`;
A95G.frettunes={
help:`<div>Play a tune on the guitar. The tab at the top shows each note as a number on one of the six strings: that's the fret to press. Press that spot on the fretboard and the note plays. Get them all and you've played the song.</div>
<ul class="factlist"><li><b>Easy:</b> the next spot glows. <b>Medium:</b> read the tab numbers. <b>Hard:</b> you only get the note name, so find it yourself (any string works).</li>
<li>0 means play the string open, without pressing a fret. Strings run thinnest (e) on top to thickest (E) at the bottom, just like tab.</li>
<li>Take your time: a wrong note just plays (and counts as a miss). Your score counts misses and how long you take. Press <b>Listen</b> to hear the tune first.</li>
<li><b>Free play</b> lets you strum around and see each note's name. The <b>Song of the day</b> on Medium has its own leaderboard.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.best=st.best||{};st.days=st.days||{};const mo=api.modeOpts();if(mo&&mo.lv)st.lv=mo.lv;st.lv=LEVELS[st.lv]?st.lv:"medium";
  const today=api.today(),daySong=SONGS[Math.floor(api.rng("frettunes|"+today)()*SONGS.length)],songById=id=>SONGS.find(s=>s.id===id),starStr=n=>"★".repeat(n)+"☆".repeat(5-n);
  let ac=null,master=null,F=null,clock=0,timers=[],free=false;
  api.bar.innerHTML=`<select class="sel95" data-ftlv aria-label="Level">${Object.keys(LEVELS).map(k=>`<option value="${k}"${st.lv===k?" selected":""}>${LEVELS[k].label}</option>`).join("")}</select>`;
  api.root.innerHTML=`<div class="ft-wrap"></div>`;const wrap=api.root.querySelector(".ft-wrap");
  const status=()=>api.status(F?`${F.song.name} · ${LEVELS[F.lv].label}`:free?"Free play":"Pick a song",`Stars: ${Object.values(st.best).reduce((a,b)=>a+(b.stars||0),0)}`);
  // ---- sound: the vault's shared audio, and a plucked-string tone
  function audio(){const a=api.audio();if(!a)return null;if(a!==ac){ac=a;master=ac.createGain();master.gain.value=.5;master.connect(ac.destination)}return ac}
  function pluck(midi,dur,at){if(!audio()||api.muted())return;const f=440*Math.pow(2,(midi-69)/12),t=at||ac.currentTime,len=Math.min(1.6,Math.max(.4,dur*1.2));
    const o1=ac.createOscillator(),o2=ac.createOscillator(),fl=ac.createBiquadFilter(),g=ac.createGain();o1.type="sawtooth";o2.type="triangle";o1.frequency.value=f;o2.frequency.value=f*2.003;
    fl.type="lowpass";fl.frequency.setValueAtTime(f*8,t);fl.frequency.exponentialRampToValueAtTime(f*1.5,t+len);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.35,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+len);
    o1.connect(fl);o2.connect(fl);fl.connect(g);g.connect(master);o1.start(t);o2.start(t);o1.stop(t+len+.05);o2.stop(t+len+.05)}
  // play the whole tune at its tempo (Listen, and Hear the song at the end)
  function listen(song){if(!audio())return;const spb=60/song.bpm;let t=ac.currentTime+.15;tab(song).forEach(n=>{pluck(n.midi,n.beats*spb,t);t+=n.beats*spb})}
  const noteName=m=>NOTE_NAMES[m%12];
  function stop(){clearInterval(clock);clock=0;timers.forEach(clearTimeout);timers=[]}
  // ---- song list
  function menu(){stop();F=null;free=false;status();
    wrap.innerHTML=`<div class="note" style="text-align:center">Pick a song to play on the fretboard, or just play around.</div>
      <div class="ft-list">${SONGS.slice().sort((a,b)=>(b===daySong)-(a===daySong)).map(s=>{const b=st.best[s.id+"|"+st.lv];
        return `<button class="btn ft-song${s===daySong?" today":""}" type="button" data-ftsong="${s.id}"><b>${s===daySong?"⭐ ":""}${api.esc(s.name)}<br><span class="sub">${s===daySong?"Song of the day · ":""}${api.esc(s.by)}</span></b><span class="ft-st" aria-label="${b?b.stars:0} of 5 stars">${starStr(b?b.stars:0)}</span></button>`}).join("")}
        <button class="btn ft-song" type="button" data-ft="free"><b>🎸 Free play<br><span class="sub">Strum around and learn the note names</span></b></button></div>`}
  // ---- the fretboard
  function boardHTML(){let h="";STRINGS.forEach(([n],s)=>{h+=`<span class="lab">${n}</span>`;for(let f=0;f<FRETS;f++)h+=`<button type="button" class="${f===0?"open":""}${s===2&&(f===3||f===5)?" dot":""}" style="--sw:${(1+s*.45).toFixed(2)}px" data-fts="${s}" data-ftf="${f}" aria-label="${n} string, ${f?`fret ${f}`:"open"}"><i></i></button>`});
    return `<div class="ft-board" role="group" aria-label="Fretboard">${h}<span class="num"></span>${Array.from({length:FRETS},(_,f)=>`<span class="num">${f}</span>`).join("")}</div>`}
  function flash(b,cls,txt){const i=b.querySelector("i");if(txt!=null)i.textContent=txt;b.classList.add(cls);timers.push(setTimeout(()=>{b.classList.remove(cls);if(txt!=null)i.textContent=""},260))}
  function freePlay(){stop();F=null;free=true;status();
    wrap.innerHTML=`<div class="ft-free" aria-live="polite">Press any string and fret.</div>${boardHTML()}<div class="actions" style="justify-content:center"><button class="btn" type="button" data-ft="menu">All songs</button></div>`}
  function start(id){const song=songById(id);if(!song)return;const lv=st.lv;audio();api.begin({song:id,lv});stop();free=false;
    F={song,lv,notes:tab(song),i:0,miss:0,t0:0,t1:0,done:false};status();
    wrap.innerHTML=`<div class="ft-hud"><div><small>NOTE</small><b id="ftn">1/${F.notes.length}</b></div><div><small>TIME</small><b id="ftt">0:00</b></div><div><small>MISSES</small><b id="ftm">0</b></div></div>
      <div id="ftcue"></div>${boardHTML()}
      <div class="actions" style="justify-content:center"><button class="btn" type="button" data-ft="listen">▶ Listen</button><button class="btn" type="button" data-ft="menu">Stop</button>${api.muted()?`<span class="note">Sound is off. Turn it on to hear the song!</span>`:""}</div>`;
    cue();mark();clock=setInterval(()=>{if(F&&F.t0&&!F.done){const e=wrap.querySelector("#ftt");if(e)e.textContent=api.fmtTime(Date.now()-F.t0)}},250)}
  // the cue: tab numbers on the six strings (Easy and Medium) or just note names (Hard)
  function cue(){const c=wrap.querySelector("#ftcue");if(!c||!F)return;const from=Math.max(0,F.i-1),win=F.notes.slice(from,from+9);
    if(LEVELS[F.lv].hint==="names"){c.className="ft-names";c.innerHTML=win.map((n,k)=>`<span class="${from+k<F.i?"done":from+k===F.i?"now":""}">${noteName(n.midi)}</span>`).join("");return}
    const W=520,H=6*16+8,x0=26,dx=(W-x0-10)/9,cur=F.notes[F.i];c.className="ft-tab";
    c.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tab: next note on the ${STRINGS[cur.s][0]} string, ${cur.f?`fret ${cur.f}`:"open"}">`+
      `<rect x="${x0+(F.i-from)*dx+2}" y="1" width="${dx-4}" height="${H-2}" fill="#fff3a0" stroke="#000080"/>`+
      STRINGS.map(([n],s)=>`<text x="4" y="${s*16+14}" font-size="12" font-weight="700">${n}</text><line x1="${x0-4}" x2="${W-4}" y1="${s*16+10}" y2="${s*16+10}" stroke="#808080"/>`).join("")+
      win.map((n,k)=>{const x=x0+k*dx+dx/2,y=n.s*16+10;return `<rect x="${x-9}" y="${y-8}" width="18" height="16" fill="${from+k===F.i?"#fff3a0":"#fff"}"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="15" font-weight="700" fill="${from+k<F.i?"#b0b0b0":"#000"}">${n.f}</text>`}).join("")+`</svg>`}
  function mark(){wrap.querySelectorAll(".ft-board .glow").forEach(e=>e.classList.remove("glow"));const n=F&&F.notes[F.i];
    if(n&&LEVELS[F.lv].hint==="glow"){const b=wrap.querySelector(`[data-fts="${n.s}"][data-ftf="${n.f}"]`);if(b)b.classList.add("glow")}}
  // right is the same pitch (any string); on Hard, any octave of that note counts too
  function press(b){const s=+b.dataset.fts,f=+b.dataset.ftf,m=STRINGS[s][1]+f;
    if(free){pluck(m,.8);flash(b,"ok",noteName(m));const t=wrap.querySelector(".ft-free");if(t)t.textContent=`${noteName(m)} · ${STRINGS[s][0]} string, ${f?`fret ${f}`:"open"}`;return}
    if(!F||F.done)return;const n=F.notes[F.i];if(!F.t0)F.t0=Date.now();
    const ok=m===n.midi||(LEVELS[F.lv].hint==="names"&&m%12===n.midi%12);pluck(m,ok?Math.max(.4,n.beats*60/F.song.bpm):.35);
    if(!ok){F.miss++;flash(b,"no");wrap.querySelector("#ftm").textContent=F.miss;return}
    flash(b,"ok");F.i++;wrap.querySelector("#ftn").textContent=`${Math.min(F.i+1,F.notes.length)}/${F.notes.length}`;if(F.i>=F.notes.length){F.t1=Date.now();finish();return}cue();mark()}
  // score: 100 a note, scaled by accuracy and by speed against a relaxed par time for the level
  function score(){const N=F.notes.length,par=F.notes.reduce((a,n)=>a+n.beats,0)*60/F.song.bpm*LEVELS[F.lv].par,T=Math.max(1,(F.t1-F.t0)/1000),acc=N/(N+F.miss),speed=Math.max(.5,Math.min(1.25,par/T)),p=acc*Math.min(1,speed);
    return {score:Math.round(N*100*acc*speed),stars:p>=.9?5:p>=.75?4:p>=.55?3:p>=.35?2:1,acc,T}}
  function finish(){F.done=true;stop();const {score:sc,stars,acc,T}=score(),k=F.song.id+"|"+F.lv,prev=st.best[k],nb=!prev||sc>prev.s;
    if(nb)st.best[k]={s:sc,stars:Math.max(stars,prev?prev.stars:0)};else if(stars>prev.stars)prev.stars=stars;
    const daily=F.song===daySong&&F.lv==="medium";if(daily){const d=st.days[today];if(!d||sc>d.s)st.days[today]={s:sc,stars}}
    if(stars===5)st.five=(st.five||0)+1;
    const r=api.result({xp:Math.round(stars*3+acc*5),ch:{v:sc,text:`${sc.toLocaleString("en-US")} on ${F.song.name} (${LEVELS[F.lv].label})`,higher:true}});
    if(nb&&prev)api.toast(`<span class="gmtemo">🎸</span><span><b>New best!</b><br>${api.esc(F.song.name)}: ${sc.toLocaleString("en-US")}</span>`);api.sound(stars>=3?"win":"lose");status();
    wrap.innerHTML=`<div class="ft-res"><div class="ft-stars" aria-label="${stars} of 5 stars">${starStr(stars)}</div><div class="ft-big">${sc.toLocaleString("en-US")}</div>
      <b>${api.esc(F.song.name)}</b> &middot; ${LEVELS[F.lv].label}<br>${F.notes.length} notes &middot; ${F.miss} wrong &middot; ${Math.round(acc*100)}% right &middot; ${api.fmtTime(T*1000)}${r.xp?`<br>+${r.xp} XP`:""}${daily?`<br>⭐ Song of the day: your best today is ${st.days[today].s.toLocaleString("en-US")}`:""}</div>
      <div class="actions" style="justify-content:center"><button class="btn" type="button" data-ft="listen">▶ Hear the song</button><button class="btn default" type="button" data-ft="again">Play again</button><button class="btn" type="button" data-ft="menu">All songs</button></div>`}
  // ---- input
  api.on(api.root,"pointerdown",e=>{const b=e.target.closest(".ft-board [data-fts]");if(!b)return;e.preventDefault();audio();press(b)});
  api.on(api.root,"keydown",e=>{const b=e.target.closest&&e.target.closest(".ft-board [data-fts]");if(b&&(e.key==="Enter"||e.key===" ")){e.preventDefault();audio();press(b)}});
  api.on(api.root,"click",e=>{const s=e.target.closest("[data-ftsong]");if(s){start(s.dataset.ftsong);return}const b=e.target.closest("[data-ft]");if(!b)return;const k=b.dataset.ft;
    if(k==="menu")menu();else if(k==="again")start(F.song.id);else if(k==="listen"&&F)listen(F.song);else if(k==="free")freePlay()});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-ftlv]")){st.lv=e.target.value;api.save();menu()}});
  // a challenge goes straight to its song
  if(mo&&mo.song&&songById(mo.song)){api.bar.querySelector("[data-ftlv]").disabled=true;wrap.innerHTML=`<div class="ft-res"><div class="ft-big">🎸</div><b>${api.esc(songById(mo.song).name)}</b> &middot; ${LEVELS[st.lv].label}<br>Get your fingers ready.</div><div class="actions" style="justify-content:center"><button class="btn default" type="button" data-ftsong="${mo.song}">Start</button></div>`;status()}
  else menu();
  A95G.frettunes._live=()=>F;
  return {unmount(){stop();if(master)try{master.disconnect()}catch(e){}}};
}};
A95G.frettunes._t={tab,STRINGS,LEVELS};
})();
