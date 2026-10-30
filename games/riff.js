// Riff Rush for the Atlas95 Game Vault. Fretboard mode: read the tab and tap each string and fret to play the tune.
// Rhythm mode: notes fall down the lanes; hit each one on the beat and it plays.
// Every song here is a public-domain melody. Notes are "name:beats" (R is a rest).
(()=>{
const SONGS=[
 {id:"twinkle",name:"Twinkle, Twinkle, Little Star",by:"Traditional",bpm:100,n:"C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2 G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2 G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2 C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2"},
 {id:"mary",name:"Mary Had a Little Lamb",by:"Traditional",bpm:112,n:"E4:1 D4:1 C4:1 D4:1 E4:1 E4:1 E4:2 D4:1 D4:1 D4:2 E4:1 G4:1 G4:2 E4:1 D4:1 C4:1 D4:1 E4:1 E4:1 E4:1 E4:1 D4:1 D4:1 E4:1 D4:1 C4:4"},
 {id:"frere",name:"Frère Jacques",by:"Traditional",bpm:120,n:"C4:1 D4:1 E4:1 C4:1 C4:1 D4:1 E4:1 C4:1 E4:1 F4:1 G4:2 E4:1 F4:1 G4:2 G4:.5 A4:.5 G4:.5 F4:.5 E4:1 C4:1 G4:.5 A4:.5 G4:.5 F4:.5 E4:1 C4:1 C4:1 G3:1 C4:2 C4:1 G3:1 C4:2"},
 {id:"row",name:"Row, Row, Row Your Boat",by:"Traditional",bpm:104,n:"C4:1.5 C4:1.5 C4:1 D4:.5 E4:1.5 E4:1 D4:.5 E4:1 F4:.5 G4:3 C5:.5 C5:.5 C5:.5 G4:.5 G4:.5 G4:.5 E4:.5 E4:.5 E4:.5 C4:.5 C4:.5 C4:.5 G4:1 F4:.5 E4:1 D4:.5 C4:3"},
 {id:"birthday",name:"Happy Birthday",by:"Mildred & Patty Hill",bpm:108,n:"G4:.75 G4:.25 A4:1 G4:1 C5:1 B4:2 G4:.75 G4:.25 A4:1 G4:1 D5:1 C5:2 G4:.75 G4:.25 G5:1 E5:1 C5:1 B4:1 A4:2 F5:.75 F5:.25 E5:1 C5:1 D5:1 C5:2"},
 {id:"ode",name:"Ode to Joy",by:"Beethoven",bpm:124,n:"E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 E4:1.5 D4:.5 D4:2 E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 D4:1.5 C4:.5 C4:2 D4:1 D4:1 E4:1 C4:1 D4:1 E4:.5 F4:.5 E4:1 C4:1 D4:1 E4:.5 F4:.5 E4:1 D4:1 C4:1 D4:1 G3:2 E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 D4:1.5 C4:.5 C4:2"},
 {id:"jingle",name:"Jingle Bells",by:"James Lord Pierpont",bpm:132,n:"E4:1 E4:1 E4:2 E4:1 E4:1 E4:2 E4:1 G4:1 C4:1.5 D4:.5 E4:4 F4:1 F4:1 F4:1.5 F4:.5 F4:1 E4:1 E4:1 E4:.5 E4:.5 E4:1 D4:1 D4:1 E4:1 D4:2 G4:2 E4:1 E4:1 E4:2 E4:1 E4:1 E4:2 E4:1 G4:1 C4:1.5 D4:.5 E4:4 F4:1 F4:1 F4:1.5 F4:.5 F4:1 E4:1 E4:1 E4:.5 E4:.5 G4:1 G4:1 F4:1 D4:1 C4:4"},
 {id:"saints",name:"When the Saints Go Marching In",by:"Traditional",bpm:150,n:"C4:1 E4:1 F4:1 G4:5 C4:1 E4:1 F4:1 G4:5 C4:1 E4:1 F4:1 G4:2 E4:2 C4:2 E4:2 D4:4 E4:1 E4:1 D4:1 C4:3 C4:1 E4:1 G4:2 G4:1 F4:3 E4:1 F4:1 G4:2 E4:2 C4:2 D4:2 C4:4"},
 {id:"greensleeves",name:"Greensleeves",by:"Traditional",bpm:104,n:"A4:1 C5:2 D5:1 E5:1.5 F5:.5 E5:1 D5:2 B4:1 G4:1.5 A4:.5 B4:1 C5:2 A4:1 A4:1.5 G#4:.5 A4:1 B4:2 G#4:1 E4:2 A4:1 C5:2 D5:1 E5:1.5 F5:.5 E5:1 D5:2 B4:1 G4:1.5 A4:.5 B4:1 C5:1.5 B4:.5 A4:1 G#4:1.5 F#4:.5 G#4:1 A4:3"},
 {id:"elise",name:"Für Elise",by:"Beethoven",bpm:140,n:"E5:.5 D#5:.5 E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 A4:1.5 C4:.5 E4:.5 A4:.5 B4:1.5 E4:.5 G#4:.5 B4:.5 C5:1.5 E5:.5 D#5:.5 E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 A4:1.5 C4:.5 E4:.5 A4:.5 B4:1.5 E4:.5 C5:.5 B4:.5 A4:3"},
 {id:"mountain",name:"In the Hall of the Mountain King",by:"Grieg",bpm:132,n:"A3:.5 B3:.5 C4:.5 D4:.5 E4:.5 C4:.5 E4:1 D#4:.5 B3:.5 D#4:1 D4:.5 A#3:.5 D4:1 A3:.5 B3:.5 C4:.5 D4:.5 E4:.5 C4:.5 E4:.5 A4:.5 G4:.5 E4:.5 C4:.5 E4:.5 G4:2 A3:.5 B3:.5 C4:.5 D4:.5 E4:.5 C4:.5 E4:1 D#4:.5 B3:.5 D#4:1 D4:.5 A#3:.5 D4:1 A3:.5 B3:.5 C4:.5 D4:.5 E4:.5 C4:.5 E4:.5 A4:.5 G4:.5 E4:.5 C4:.5 E4:.5 G4:2"}];
const LEVELS={easy:{label:"Easy",lanes:3,speed:.85,travel:2.1},medium:{label:"Medium",lanes:4,speed:1,travel:1.7},hard:{label:"Hard",lanes:5,speed:1.15,travel:1.35}};
const LANE_COL=["#20b020","#e02020","#f0c800","#2060f0","#f08000"],KEYS=["asdfg","12345"],LEAD=2.2,PERFECT=.07,GOOD=.15;
// ---- fretboard mode: standard tuning, tab order (high e on top); songs drop an octave to sit in the first 7 frets
const STRINGS=[["e",64],["B",59],["G",55],["D",50],["A",45],["E",40]],FRETS=6,NOTE_NAMES=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const FLEVELS={easy:{label:"Easy",hint:"glow",par:2.2},medium:{label:"Medium",hint:"tab",par:3},hard:{label:"Hard",hint:"names",par:4}};
// each note gets a string and fret: low frets first (open position, like a beginner plays), then whatever is nearest the hand
function tab(song){const ns=parse(song.n).filter(x=>x.midi!=null);let hand=2;
  return ns.map(x=>{const m=x.midi-12,cost=f=>f+.3*Math.abs(f-hand),c=STRINGS.map(([n,o],s)=>({s,f:m-o})).filter(c=>c.f>=0&&c.f<FRETS).sort((a,b)=>cost(a.f)-cost(b.f))[0];
    if(c.f>0)hand=c.f;return {midi:m,beats:x.beats,s:c.s,f:c.f}})}
const NOTE_I={C:0,"C#":1,D:2,"D#":3,E:4,F:5,"F#":6,G:7,"G#":8,A:9,"A#":10,B:11};
// "G#4:.5" -> {midi, beats}
function parse(s){return s.split(/\s+/).map(t=>{const [n,b]=t.split(":"),m=/^([A-G]#?)(\d)$/.exec(n);return {midi:m?12*(+m[2]+1)+NOTE_I[m[1]]:null,beats:+b}})}
// the chart: note times in seconds and a lane for each, higher notes further right
function chart(song,lv){const L=LEVELS[lv],spb=60/(song.bpm*L.speed),ns=parse(song.n),pitches=[...new Set(ns.filter(x=>x.midi!=null).map(x=>x.midi))].sort((a,b)=>a-b);
  let t=LEAD;const out=[];ns.forEach(x=>{if(x.midi!=null){const r=pitches.indexOf(x.midi);out.push({t,midi:x.midi,dur:x.beats*spb,lane:Math.min(L.lanes-1,Math.floor(r*L.lanes/pitches.length))})}t+=x.beats*spb});
  return {notes:out,end:t+1.2,spb}}
const maxScore=n=>{let s=0;for(let i=0;i<n;i++)s+=100*Math.min(4,1+Math.floor(i/10));return s};
// stars blend score (which rewards streaks) with plain accuracy, so a few misses don't sink you
const starsFor=(s,n,hits)=>{const p=.5*s/maxScore(n)+.5*hits/n;return p>=.9?5:p>=.75?4:p>=.55?3:p>=.35?2:p>0?1:0};
const CSS=`
.rr-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;max-width:560px;margin:0 auto}
.rr-list{display:flex;flex-direction:column;gap:4px;width:100%}
.rr-song{display:flex;align-items:center;gap:8px;text-align:left;padding:6px 10px;min-height:44px}
.rr-song b{flex:1}.rr-song .sub{font-weight:400;color:#404040;font-size:12px}
.rr-song .rr-st{font-size:13px;white-space:nowrap;letter-spacing:1px}
.rr-song.today{background:#fffbe0}
.rr-stage{position:relative;width:min(100%,460px);touch-action:none;user-select:none;-webkit-user-select:none}
.rr-stage canvas{display:block;width:100%;background:#101018;box-shadow:var(--sunken)}
.rr-hud{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
.rr-hud div{background:var(--hi);box-shadow:var(--sunken);padding:2px 10px;text-align:center;min-width:64px}
.rr-hud small{display:block;font-size:11px;color:#404040}.rr-hud b{font-size:16px;font-variant-numeric:tabular-nums}
.rr-big{font-size:30px;font-weight:700;text-align:center}.rr-stars{font-size:28px;letter-spacing:2px;text-align:center}
.rr-res{text-align:center;line-height:1.6}
.rr-tabbox{width:min(100%,520px);background:#fff;box-shadow:var(--sunken);padding:4px 0}
.rr-tabbox svg{display:block;width:100%;height:auto}
.rr-names{display:flex;gap:10px;justify-content:center;align-items:baseline;font-weight:700;min-height:2em;flex-wrap:wrap}
.rr-names span{color:#808080;font-size:16px}.rr-names .now{color:#000080;font-size:30px}.rr-names .done{color:#c0c0c0;font-size:14px}
.rr-board{width:min(100%,520px);display:grid;grid-template-columns:22px .7fr repeat(5,1fr);background:#c89660;box-shadow:var(--sunken);touch-action:manipulation;user-select:none;-webkit-user-select:none}
.rr-board .lab{display:flex;align-items:center;justify-content:center;font:700 12px sans-serif;background:var(--face)}
.rr-board button{position:relative;height:38px;border:0;padding:0;margin:0;background:transparent;border-right:3px solid #d8d8d8;cursor:pointer;font:inherit}
.rr-board button.open{background:#e8d5b0;border-right:6px solid #f4f4f4}
.rr-board button::before{content:"";position:absolute;left:0;right:0;top:50%;border-top:var(--sw,1.5px) solid #303030}
.rr-board button.dot::after{content:"";position:absolute;width:10px;height:10px;border-radius:50%;background:#f4ecd8;left:50%;top:100%;transform:translate(-50%,-50%);z-index:1}
.rr-board button i{position:relative;z-index:2;display:inline-block;width:26px;height:26px;line-height:26px;border-radius:50%;font:700 13px sans-serif;font-style:normal}
.rr-board button.glow i{background:#ffd800;box-shadow:0 0 0 3px #fff,0 0 12px 4px #ffd800}
.rr-board button.ok i{background:#20b020;color:#fff}.rr-board button.no i{background:#e02020;color:#fff}
.rr-board .num{text-align:center;font:700 12px sans-serif;background:var(--face);padding:2px 0}`;
A95G.riff={
help:`<div><b>Fretboard</b> (the main mode): play the tune on a guitar. The tab shows each note as a number on one of the six strings: that's the fret to press. Tap that spot on the fretboard and the note plays. Get them all and you've played the song.</div>
<ul class="factlist"><li><b>Easy:</b> the next spot glows. <b>Medium:</b> read the tab numbers. <b>Hard:</b> you only get the note name, so find it yourself (any string works).</li>
<li>0 means play the string open, without pressing a fret. Strings run thinnest (e) on top to thickest (E) at the bottom, just like tab.</li>
<li>Your score counts wrong notes and how fast you play. Press <b>Listen</b> to hear the tune first.</li></ul>
<div><b>Rhythm</b> mode: notes slide down the lanes toward the circles at the bottom. Hit each note just as it reaches its circle, and it plays. Hit them all and you'll hear the whole tune.</div>
<ul class="factlist"><li><b>Phone:</b> tap the lane. <b>Keyboard:</b> A S D F G (or 1 to 5), left to right.</li><li><b>Perfect</b> hits score more than <b>Good</b> ones. Every 10 notes in a row raises your multiplier, up to ×4. A miss resets it.</li>
<li><b>Easy</b> has 3 lanes, <b>Medium</b> 4 and <b>Hard</b> 5, and they get faster. The <b>Song of the day</b> on Medium has its own leaderboard.</li><li>After a song, press <b>Challenge a friend</b> to send them the same song, mode and level.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.best=st.best||{};st.days=st.days||{};st.fdays=st.fdays||{};const mo=api.modeOpts();
  // challenges from before Fretboard mode existed are Rhythm ones
  if(mo){st.mode=mo.mode==="fret"?"fret":"rhythm";if(mo.lv)st.lv=mo.lv}st.mode=st.mode==="rhythm"?"rhythm":"fret";st.lv=LEVELS[st.lv]?st.lv:"medium";
  const lvName=()=>(st.mode==="fret"?FLEVELS:LEVELS)[st.lv].label,bestKey=id=>(st.mode==="fret"?"f|":"")+id+"|"+st.lv;
  const today=api.today(),daySong=SONGS[Math.floor(api.rng("riff|"+today)()*SONGS.length)];
  let ac=null,master=null,G=null,F=null,raf=0,cv,cx,W=0,H=0,keyDown=null,clock=0,playback=[];
  api.bar.innerHTML=`<select class="sel95" data-rrmode aria-label="Mode"><option value="fret"${st.mode==="fret"?" selected":""}>Fretboard</option><option value="rhythm"${st.mode==="rhythm"?" selected":""}>Rhythm</option></select><select class="sel95" data-rrlv aria-label="Level">${Object.keys(LEVELS).map(k=>`<option value="${k}"${st.lv===k?" selected":""}>${LEVELS[k].label}</option>`).join("")}</select>`;
  api.root.innerHTML=`<div class="rr-wrap"></div>`;const wrap=api.root.querySelector(".rr-wrap");
  const songById=id=>SONGS.find(s=>s.id===id);
  const starStr=n=>"★".repeat(n)+"☆".repeat(5-n);
  function status(){const tot=Object.values(st.best).reduce((a,b)=>a+(b.stars||0),0),cur=G||F;api.status(cur?`${cur.song.name} · ${st.mode==="fret"?"Fretboard":"Rhythm"} · ${lvName()}`:"Pick a song",`Stars: ${tot}`)}
  // ---- song list
  function menu(){stop();G=null;F=null;status();
    wrap.innerHTML=`<div class="note" style="text-align:center">${st.mode==="fret"?"Play the tune on the fretboard. Pick a song:":"Hit the notes as they reach the circles. Pick a song:"}</div><div class="rr-list">${SONGS.slice().sort((a,b)=>(b===daySong)-(a===daySong)).map(s=>{const b=st.best[bestKey(s.id)];
      return `<button class="btn rr-song${s===daySong?" today":""}" type="button" data-rrsong="${s.id}"><b>${s===daySong?"⭐ ":""}${api.esc(s.name)}<br><span class="sub">${s===daySong&&st.mode==="fret"?"Song of the day · ":""}${api.esc(s.by)}</span></b><span class="rr-st" aria-label="${b?b.stars:0} of 5 stars">${starStr(b?b.stars:0)}</span></button>`}).join("")}</div>`}
  // ---- audio: a plucked tone for each hit note, and a soft tick on each beat
  function audio(){if(!ac){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ac=new AC();master=ac.createGain();master.gain.value=.5;master.connect(ac.destination)}if(ac.state==="suspended")ac.resume();return ac}
  function pluck(midi,dur,at){if(!ac||api.muted())return;const f=440*Math.pow(2,(midi-69)/12),t=at||ac.currentTime,len=Math.min(1.4,Math.max(.25,dur*1.2));
    const o1=ac.createOscillator(),o2=ac.createOscillator(),fl=ac.createBiquadFilter(),g=ac.createGain();o1.type="sawtooth";o2.type="triangle";o1.frequency.value=f;o2.frequency.value=f*2.003;
    fl.type="lowpass";fl.frequency.setValueAtTime(f*8,t);fl.frequency.exponentialRampToValueAtTime(f*1.5,t+len);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.35,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+len);
    o1.connect(fl);o2.connect(fl);fl.connect(g);g.connect(master);o1.start(t);o2.start(t);o1.stop(t+len+.05);o2.stop(t+len+.05)}
  function tick(at,acc){if(!ac||api.muted())return;const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=acc?1600:1100;g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(acc?.06:.035,at+.002);g.gain.exponentialRampToValueAtTime(.0001,at+.05);o.connect(g);g.connect(master);o.start(at);o.stop(at+.06)}
  function thud(){if(!ac||api.muted())return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type="square";o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(55,t+.12);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.0001,t+.13);o.connect(g);g.connect(master);o.start(t);o.stop(t+.14)}
  // ---- play
  function start(id){if(st.mode==="fret"){fstart(id);return}const song=songById(id);if(!song)return;const lv=st.lv;audio();api.begin({song:id,lv});
    const c=chart(song,lv);G={song,lv,L:LEVELS[lv],notes:c.notes.map(n=>Object.assign({},n,{hit:0})),end:c.end,spb:c.spb,t0:0,score:0,combo:0,maxCombo:0,perfect:0,good:0,miss:0,flash:[],pop:null,nextTick:0,paused:false,done:false};
    wrap.innerHTML=`<div class="rr-hud"><div><small>SCORE</small><b id="rrsc">0</b></div><div><small>COMBO</small><b id="rrco">0</b></div><div><small>MULTI</small><b id="rrmu">×1</b></div></div>
      <div class="rr-stage"><canvas aria-label="Note highway: tap a lane when its note reaches the circle"></canvas></div>
      <div class="actions" style="justify-content:center"><button class="btn" type="button" data-rr="quit">Stop</button>${api.muted()?`<span class="note">Sound is off. Turn it on to hear the song!</span>`:""}</div>`;
    cv=wrap.querySelector("canvas");size();G.flash=new Array(G.L.lanes).fill(0);
    G.t0=(ac?ac.currentTime:performance.now()/1000);status();loop()}
  const now=()=>ac?ac.currentTime:performance.now()/1000;
  function size(){if(!cv)return;const r=cv.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);W=r.width;H=Math.min(560,Math.max(320,Math.round(window.innerHeight*.58)));cv.style.height=H+"px";cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cx=cv.getContext("2d");cx.setTransform(dpr,0,0,dpr,0,0)}
  const strikeY=()=>H-64;
  function loop(){raf=requestAnimationFrame(loop);if(!G||G.paused||G.done)return;const t=now()-G.t0;
    // beat ticks a little ahead, so they land on time
    if(ac){while(G.nextTick*G.spb<=t+.12&&G.nextTick*G.spb<G.end){const at=G.t0+G.nextTick*G.spb;if(at>=ac.currentTime)tick(at,G.nextTick%4===0);G.nextTick++}}
    G.notes.forEach(n=>{if(!n.hit&&t-n.t>GOOD){n.hit=-1;G.miss++;G.combo=0;G.pop={txt:"Miss",col:"#ff6060",at:t,lane:n.lane};thud();hud()}});
    draw(t);if(t>G.end)finish()}
  function draw(t){const c=cx,L=G.L.lanes,lw=W/L,sy=strikeY(),T=G.L.travel;c.clearRect(0,0,W,H);
    for(let i=0;i<L;i++){c.fillStyle=i%2?"#16162a":"#1c1c34";c.fillRect(i*lw,0,lw,H);if(G.flash[i]>t){c.fillStyle="rgba(255,255,255,.12)";c.fillRect(i*lw,0,lw,H)}}
    c.strokeStyle="#ffffff60";c.lineWidth=2;c.beginPath();c.moveTo(0,sy);c.lineTo(W,sy);c.stroke();
    // beat lines
    c.strokeStyle="#ffffff18";c.lineWidth=1;for(let b=Math.ceil((t-.3)/G.spb);b*G.spb<t+T;b++){const y=sy-(b*G.spb-t)/T*sy;if(y>0&&y<H){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}}
    const r=Math.min(lw*.32,26);
    for(let i=0;i<L;i++){const x=i*lw+lw/2,col=LANE_COL[L===3?[0,2,4][i]:L===4?[0,1,2,3][i]:i];c.beginPath();c.arc(x,sy,r+4,0,7);c.strokeStyle=col;c.lineWidth=G.flash[i]>t?6:3;c.stroke();
      c.fillStyle="#ffffff70";c.font=`700 ${Math.round(r*.7)}px sans-serif`;c.textAlign="center";c.textBaseline="middle";c.fillText(KEYS[0][i].toUpperCase(),x,sy+r+20)}
    G.notes.forEach(n=>{if(n.hit===1)return;const dt=n.t-t;if(dt>T||dt<-.3)return;const x=n.lane*lw+lw/2,y=sy-dt/T*sy,col=LANE_COL[L===3?[0,2,4][n.lane]:n.lane];
      c.globalAlpha=n.hit===-1?.3:1;c.beginPath();c.arc(x,y,r,0,7);c.fillStyle=col;c.fill();c.beginPath();c.arc(x,y,r*.45,0,7);c.fillStyle="#ffffffd0";c.fill();c.globalAlpha=1});
    if(G.pop&&t-G.pop.at<.5){c.globalAlpha=1-(t-G.pop.at)/.5;c.fillStyle=G.pop.col;c.font="700 22px sans-serif";c.textAlign="center";c.fillText(G.pop.txt,G.pop.lane*lw+lw/2,sy-r-28-(t-G.pop.at)*40);c.globalAlpha=1}
    if(t<LEAD){const n=Math.ceil(LEAD-t);c.fillStyle="#fff";c.font="700 56px sans-serif";c.textAlign="center";c.fillText(t<LEAD-.3?String(Math.min(3,n)):"Go!",W/2,H*.4)}}
  function hud(){const sc=wrap.querySelector("#rrsc");if(!sc)return;sc.textContent=G.score.toLocaleString("en-US");wrap.querySelector("#rrco").textContent=G.combo;wrap.querySelector("#rrmu").textContent="×"+Math.min(4,1+Math.floor(G.combo/10))}
  // a press in a lane hits the closest unplayed note in that lane within the window
  function press(lane){if(!G||G.done||G.paused)return;const t=now()-G.t0;G.flash[lane]=t+.12;let best=null;
    G.notes.forEach(n=>{if(!n.hit&&n.lane===lane&&Math.abs(n.t-t)<=GOOD&&(!best||Math.abs(n.t-t)<Math.abs(best.t-t)))best=n});
    if(!best){if(G.combo>0){G.combo=0;hud()}return}
    const d=Math.abs(best.t-t),perfect=d<=PERFECT;best.hit=1;G.combo++;G.maxCombo=Math.max(G.maxCombo,G.combo);const m=Math.min(4,1+Math.floor((G.combo-1)/10));
    G.score+=(perfect?100:50)*m;if(perfect)G.perfect++;else G.good++;G.pop={txt:perfect?"Perfect":"Good",col:perfect?"#60ff80":"#ffe060",at:t,lane};pluck(best.midi,best.dur);hud()}
  function finish(){if(G.done)return;G.done=true;cancelAnimationFrame(raf);raf=0;const n=G.notes.length,stars=starsFor(G.score,n,G.perfect+G.good),k=G.song.id+"|"+G.lv,prev=st.best[k],nb=!prev||G.score>prev.s;
    if(nb)st.best[k]={s:G.score,stars:Math.max(stars,prev?prev.stars:0)};else if(stars>prev.stars)prev.stars=stars;
    const daily=G.song===daySong&&G.lv==="medium";if(daily){const d=st.days[today];if(!d||G.score>d.s)st.days[today]={s:G.score,stars}}
    if(stars===5)st.five=(st.five||0)+1;
    const acc=Math.round((G.perfect+G.good)/n*100);
    const r=api.result({xp:Math.round(stars*3+acc/20),ch:{v:G.score,text:`${G.score.toLocaleString("en-US")} on ${G.song.name} (${LEVELS[G.lv].label})`,higher:true}});
    if(nb&&prev)api.toast(`<span class="gmtemo">🎸</span><span><b>New best!</b><br>${api.esc(G.song.name)}: ${G.score.toLocaleString("en-US")}</span>`);api.sound(stars>=3?"win":"lose");status();
    wrap.innerHTML=`<div class="rr-res"><div class="rr-stars" aria-label="${stars} of 5 stars">${starStr(stars)}</div><div class="rr-big">${G.score.toLocaleString("en-US")}</div>
      <b>${api.esc(G.song.name)}</b> &middot; ${LEVELS[G.lv].label}<br>Perfect ${G.perfect} &middot; Good ${G.good} &middot; Missed ${G.miss} &middot; ${acc}% hit &middot; best streak ${G.maxCombo}${r.xp?`<br>+${r.xp} XP`:""}${daily?`<br>⭐ Song of the day: your best today is ${st.days[today].s.toLocaleString("en-US")}`:""}</div>
      <div class="actions" style="justify-content:center"><button class="btn default" type="button" data-rr="again">Play again</button><button class="btn" type="button" data-rr="menu">All songs</button></div>`;G.paused=true}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;clearInterval(clock);clock=0;quiet()}
  // ---- fretboard mode
  function quiet(){playback.forEach(t=>clearTimeout(t));playback=[]}
  // play the whole tune at its tempo (Listen, and Hear it at the end)
  function listen(song){audio();quiet();if(!ac)return;const spb=60/song.bpm;let t=ac.currentTime+.15;tab(song).forEach(n=>{pluck(n.midi,n.beats*spb,t);t+=n.beats*spb})}
  const noteName=m=>NOTE_NAMES[m%12];
  function fstart(id){const song=songById(id);if(!song)return;const lv=st.lv;audio();api.begin({mode:"fret",song:id,lv});quiet();
    F={song,lv,notes:tab(song),i:0,miss:0,t0:0,t1:0,done:false};G=null;status();
    wrap.innerHTML=`<div class="rr-hud"><div><small>NOTE</small><b id="rrn">1/${F.notes.length}</b></div><div><small>TIME</small><b id="rrt">0:00</b></div><div><small>MISSES</small><b id="rrm">0</b></div></div>
      <div id="rrcue"></div><div class="rr-board" role="group" aria-label="Fretboard"></div>
      <div class="actions" style="justify-content:center"><button class="btn" type="button" data-rr="listen">▶ Listen</button><button class="btn" type="button" data-rr="quit">Stop</button>${api.muted()?`<span class="note">Sound is off. Turn it on to hear the song!</span>`:""}</div>`;
    board();cue();clock=setInterval(()=>{if(F&&F.t0&&!F.done){const e=wrap.querySelector("#rrt");if(e)e.textContent=api.fmtTime(Date.now()-F.t0)}},250)}
  function board(){const b=wrap.querySelector(".rr-board");if(!b)return;let h="";
    STRINGS.forEach(([n],s)=>{h+=`<span class="lab">${n}</span>`;for(let f=0;f<FRETS;f++)h+=`<button type="button" class="${f===0?"open":""}${s===2&&(f===3||f===5)?" dot":""}" style="--sw:${(1+s*.45).toFixed(2)}px" data-rrs="${s}" data-rrf="${f}" aria-label="${n} string, ${f?`fret ${f}`:"open"}"><i></i></button>`});
    h+=`<span class="num"></span>`+Array.from({length:FRETS},(_,f)=>`<span class="num">${f}</span>`).join("");b.innerHTML=h;mark()}
  // the cue: tab numbers on the six strings (Easy and Medium) or just note names (Hard)
  function cue(){const c=wrap.querySelector("#rrcue");if(!c||!F)return;const from=Math.max(0,F.i-1),win=F.notes.slice(from,from+9);
    if(FLEVELS[F.lv].hint==="names"){c.className="rr-names";c.innerHTML=win.map((n,k)=>`<span class="${from+k<F.i?"done":from+k===F.i?"now":""}">${noteName(n.midi)}</span>`).join("");return}
    const W=520,H=6*16+8,x0=26,dx=(W-x0-10)/9;c.className="rr-tabbox";
    c.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tab: next note on the ${STRINGS[F.notes[F.i].s][0]} string, fret ${F.notes[F.i].f}">`+
      (F.i<F.notes.length?`<rect x="${x0+(F.i-from)*dx+2}" y="1" width="${dx-4}" height="${H-2}" fill="#fff3a0" stroke="#000080"/>`:"")+
      STRINGS.map(([n],s)=>`<text x="4" y="${s*16+14}" font-size="12" font-weight="700">${n}</text><line x1="${x0-4}" x2="${W-4}" y1="${s*16+10}" y2="${s*16+10}" stroke="#808080"/>`).join("")+
      win.map((n,k)=>{const x=x0+k*dx+dx/2,y=n.s*16+10,past=from+k<F.i;return `<rect x="${x-9}" y="${y-8}" width="18" height="16" fill="${from+k===F.i?"#fff3a0":"#fff"}"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="15" font-weight="700" fill="${past?"#b0b0b0":"#000"}">${n.f}</text>`}).join("")+`</svg>`}
  function mark(){if(!F)return;wrap.querySelectorAll(".rr-board .glow").forEach(e=>e.classList.remove("glow"));const n=F.notes[F.i];
    if(n&&FLEVELS[F.lv].hint==="glow"){const b=wrap.querySelector(`[data-rrs="${n.s}"][data-rrf="${n.f}"]`);if(b)b.classList.add("glow")}}
  function flash(b,cls){b.classList.add(cls);setTimeout(()=>b.classList.remove(cls),220)}
  // right is the same pitch (any string); on Hard, any octave of that note counts too
  function fpress(b){if(!F||F.done)return;const s=+b.dataset.rrs,f=+b.dataset.rrf,m=STRINGS[s][1]+f,n=F.notes[F.i];if(!F.t0)F.t0=Date.now();
    const ok=m===n.midi||(FLEVELS[F.lv].hint==="names"&&m%12===n.midi%12);pluck(m,ok?Math.max(.4,n.beats*60/F.song.bpm):.35);
    if(!ok){F.miss++;flash(b,"no");wrap.querySelector("#rrm").textContent=F.miss;return}
    flash(b,"ok");F.i++;wrap.querySelector("#rrn").textContent=`${Math.min(F.i+1,F.notes.length)}/${F.notes.length}`;if(F.i>=F.notes.length){F.t1=Date.now();ffinish();return}cue();mark()}
  // score: 100 a note, scaled by accuracy and by speed against a relaxed par time for the level
  function fscore(){const N=F.notes.length,par=F.notes.reduce((a,n)=>a+n.beats,0)*60/F.song.bpm*FLEVELS[F.lv].par,T=Math.max(1,(F.t1-F.t0)/1000),acc=N/(N+F.miss),speed=Math.max(.5,Math.min(1.25,par/T));
    const p=acc*Math.min(1,speed);return {score:Math.round(N*100*acc*speed),stars:p>=.9?5:p>=.75?4:p>=.55?3:p>=.35?2:1,acc,T}}
  function ffinish(){F.done=true;clearInterval(clock);clock=0;const {score,stars,acc,T}=fscore(),k="f|"+F.song.id+"|"+F.lv,prev=st.best[k],nb=!prev||score>prev.s;
    if(nb)st.best[k]={s:score,stars:Math.max(stars,prev?prev.stars:0)};else if(stars>prev.stars)prev.stars=stars;
    const daily=F.song===daySong&&F.lv==="medium";if(daily){const d=st.fdays[today];if(!d||score>d.s)st.fdays[today]={s:score,stars}}
    if(stars===5)st.five=(st.five||0)+1;
    const r=api.result({xp:Math.round(stars*3+acc*5),ch:{v:score,text:`${score.toLocaleString("en-US")} on ${F.song.name} (Fretboard, ${FLEVELS[F.lv].label})`,higher:true}});
    if(nb&&prev)api.toast(`<span class="gmtemo">🎸</span><span><b>New best!</b><br>${api.esc(F.song.name)}: ${score.toLocaleString("en-US")}</span>`);api.sound(stars>=3?"win":"lose");status();
    wrap.innerHTML=`<div class="rr-res"><div class="rr-stars" aria-label="${stars} of 5 stars">${starStr(stars)}</div><div class="rr-big">${score.toLocaleString("en-US")}</div>
      <b>${api.esc(F.song.name)}</b> &middot; Fretboard &middot; ${FLEVELS[F.lv].label}<br>${F.notes.length} notes &middot; ${F.miss} wrong &middot; ${Math.round(acc*100)}% right &middot; ${api.fmtTime(T*1000)}${r.xp?`<br>+${r.xp} XP`:""}${daily?`<br>⭐ Song of the day: your best today is ${st.fdays[today].s.toLocaleString("en-US")}`:""}</div>
      <div class="actions" style="justify-content:center"><button class="btn" type="button" data-rr="listen">▶ Hear the song</button><button class="btn default" type="button" data-rr="again">Play again</button><button class="btn" type="button" data-rr="menu">All songs</button></div>`}
  function pause(){if(!G||G.done||G.paused)return;G.paused=true;G.pauseAt=now();if(ac)ac.suspend();
    const s=wrap.querySelector(".rr-stage");if(s&&!s.querySelector(".rr-pause"))s.insertAdjacentHTML("beforeend",`<div class="rr-pause" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#000a"><button class="btn default" type="button" data-rr="resume">Resume</button></div>`)}
  function resume(){if(!G||!G.paused||G.done)return;if(ac)ac.resume();const gap=now()-G.pauseAt;
    // resume with a one-second lead-in so the next notes aren't right on top of you
    G.t0+=gap+1;G.paused=false;wrap.querySelector(".rr-pause")?.remove()}
  // ---- input
  const laneAt=x=>{const r=cv.getBoundingClientRect();return Math.max(0,Math.min(G.L.lanes-1,Math.floor((x-r.left)/r.width*G.L.lanes)))};
  api.on(api.root,"pointerdown",e=>{const fb=e.target.closest(".rr-board [data-rrs]");if(fb){e.preventDefault();audio();fpress(fb);return}
    if(!G||G.done||!cv||!e.target.closest(".rr-stage canvas"))return;e.preventDefault();press(laneAt(e.clientX))});
  api.on(document,"keydown",e=>{if(!G||G.done||e.repeat||!api.active()||e.metaKey||e.ctrlKey||e.altKey)return;const k=e.key.toLowerCase();let i=KEYS[0].indexOf(k);if(i<0)i=KEYS[1].indexOf(k);
    if(i>=0&&i<G.L.lanes){e.preventDefault();press(i)}else if(k===" "||k==="escape"){e.preventDefault();G.paused?resume():pause()}});
  api.on(api.root,"click",e=>{const s=e.target.closest("[data-rrsong]");if(s){start(s.dataset.rrsong);return}const b=e.target.closest("[data-rr]");if(!b)return;const k=b.dataset.rr;
    if(k==="quit"||k==="menu")menu();else if(k==="again")start((F||G).song.id);else if(k==="resume")resume();else if(k==="listen"&&F)listen(F.song)});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-rrmode]")){st.mode=e.target.value;api.save();menu();return}
    if(e.target.matches("[data-rrlv]")){st.lv=e.target.value;api.save();if((!G||G.done||!raf)&&(!F||F.done))menu();else if(F&&!F.done)menu()}});
  api.on(window,"resize",()=>{if(cv&&cv.isConnected)size()});
  // a challenge goes straight to its song
  if(mo&&mo.song&&songById(mo.song)){api.bar.querySelector("[data-rrlv]").disabled=true;api.bar.querySelector("[data-rrmode]").disabled=true;wrap.innerHTML=`<div class="rr-res"><div class="rr-big">🎸</div><b>${api.esc(songById(mo.song).name)}</b> &middot; ${st.mode==="fret"?"Fretboard":"Rhythm"} &middot; ${lvName()}<br>Get your fingers ready.</div><div class="actions" style="justify-content:center"><button class="btn default" type="button" data-rrsong="${mo.song}">Start</button></div>`;status()}
  else menu();
  A95G.riff._live=()=>G&&{G,t:now()-G.t0};A95G.riff._fret=()=>F;
  return {pause,unmount(){stop();if(ac)try{ac.close()}catch(e){}}};
}};
A95G.riff._t={tab,STRINGS,SONGS,chart,parse,maxScore,starsFor};
})();
