// Riff Rush for the Atlas95 Game Vault: notes fall down the lanes; hit each one on the beat and it plays, so you hear the tune come together.
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
.rr-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;max-width:560px;margin:0 auto}
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
.rr-res{text-align:center;line-height:1.6}`;
A95G.riff={
help:`<div>Notes slide down the lanes toward the circles at the bottom. Hit each note just as it reaches its circle, and it plays. Hit them all and you'll hear the whole tune.</div>
<ul class="factlist"><li><b>Phone:</b> tap the lane. <b>Keyboard:</b> A S D F G (or 1 to 5), left to right.</li><li><b>Perfect</b> hits score more than <b>Good</b> ones. Every 10 notes in a row raises your multiplier, up to ×4. A miss resets it.</li>
<li><b>Easy</b> has 3 lanes, <b>Medium</b> 4 and <b>Hard</b> 5, and they get faster. The <b>Song of the day</b> on Medium has its own leaderboard.</li><li>After a song, press <b>Challenge a friend</b> to send them the same song and level.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.best=st.best||{};st.days=st.days||{};const mo=api.modeOpts();if(mo){if(mo.lv)st.lv=mo.lv}st.lv=LEVELS[st.lv]?st.lv:"medium";
  const today=api.today(),daySong=SONGS[Math.floor(api.rng("riff|"+today)()*SONGS.length)];
  let ac=null,master=null,G=null,raf=0,cv,cx,W=0,H=0,keyDown=null;
  api.bar.innerHTML=`<select class="sel95" data-rrlv aria-label="Level">${Object.entries(LEVELS).map(([k,v])=>`<option value="${k}"${st.lv===k?" selected":""}>${v.label}</option>`).join("")}</select>`;
  api.root.innerHTML=`<div class="rr-wrap"></div>`;const wrap=api.root.querySelector(".rr-wrap");
  const songById=id=>SONGS.find(s=>s.id===id);
  const starStr=n=>"★".repeat(n)+"☆".repeat(5-n);
  function status(){const tot=Object.values(st.best).reduce((a,b)=>a+(b.stars||0),0);api.status(G?`${G.song.name} · ${LEVELS[G.lv].label}`:"Pick a song",`Stars: ${tot}`)}
  // ---- song list
  function menu(){stop();G=null;status();const lv=st.lv;
    wrap.innerHTML=`<div class="rr-list">${SONGS.slice().sort((a,b)=>(b===daySong)-(a===daySong)).map(s=>{const b=st.best[s.id+"|"+lv];
      return `<button class="btn rr-song${s===daySong?" today":""}" type="button" data-rrsong="${s.id}"><b>${s===daySong?"⭐ ":""}${api.esc(s.name)}<br><span class="sub">${s===daySong?"Song of the day · ":""}${api.esc(s.by)}</span></b><span class="rr-st" aria-label="${b?b.stars:0} of 5 stars">${starStr(b?b.stars:0)}</span></button>`}).join("")}</div>`}
  // ---- audio: a plucked tone for each hit note, and a soft tick on each beat
  function audio(){if(!ac){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ac=new AC();master=ac.createGain();master.gain.value=.5;master.connect(ac.destination)}if(ac.state==="suspended")ac.resume();return ac}
  function pluck(midi,dur){if(!ac||api.muted())return;const f=440*Math.pow(2,(midi-69)/12),t=ac.currentTime,len=Math.min(1.4,Math.max(.25,dur*1.2));
    const o1=ac.createOscillator(),o2=ac.createOscillator(),fl=ac.createBiquadFilter(),g=ac.createGain();o1.type="sawtooth";o2.type="triangle";o1.frequency.value=f;o2.frequency.value=f*2.003;
    fl.type="lowpass";fl.frequency.setValueAtTime(f*8,t);fl.frequency.exponentialRampToValueAtTime(f*1.5,t+len);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.35,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+len);
    o1.connect(fl);o2.connect(fl);fl.connect(g);g.connect(master);o1.start(t);o2.start(t);o1.stop(t+len+.05);o2.stop(t+len+.05)}
  function tick(at,acc){if(!ac||api.muted())return;const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=acc?1600:1100;g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(acc?.06:.035,at+.002);g.gain.exponentialRampToValueAtTime(.0001,at+.05);o.connect(g);g.connect(master);o.start(at);o.stop(at+.06)}
  function thud(){if(!ac||api.muted())return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type="square";o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(55,t+.12);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.0001,t+.13);o.connect(g);g.connect(master);o.start(t);o.stop(t+.14)}
  // ---- play
  function start(id){const song=songById(id);if(!song)return;const lv=st.lv;audio();api.begin({song:id,lv});
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
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0}
  function pause(){if(!G||G.done||G.paused)return;G.paused=true;G.pauseAt=now();if(ac)ac.suspend();
    const s=wrap.querySelector(".rr-stage");if(s&&!s.querySelector(".rr-pause"))s.insertAdjacentHTML("beforeend",`<div class="rr-pause" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#000a"><button class="btn default" type="button" data-rr="resume">Resume</button></div>`)}
  function resume(){if(!G||!G.paused||G.done)return;if(ac)ac.resume();const gap=now()-G.pauseAt;
    // resume with a one-second lead-in so the next notes aren't right on top of you
    G.t0+=gap+1;G.paused=false;wrap.querySelector(".rr-pause")?.remove()}
  // ---- input
  const laneAt=x=>{const r=cv.getBoundingClientRect();return Math.max(0,Math.min(G.L.lanes-1,Math.floor((x-r.left)/r.width*G.L.lanes)))};
  api.on(api.root,"pointerdown",e=>{if(!G||G.done||!cv||!e.target.closest(".rr-stage canvas"))return;e.preventDefault();press(laneAt(e.clientX))});
  api.on(document,"keydown",e=>{if(!G||G.done||e.repeat||!api.active()||e.metaKey||e.ctrlKey||e.altKey)return;const k=e.key.toLowerCase();let i=KEYS[0].indexOf(k);if(i<0)i=KEYS[1].indexOf(k);
    if(i>=0&&i<G.L.lanes){e.preventDefault();press(i)}else if(k===" "||k==="escape"){e.preventDefault();G.paused?resume():pause()}});
  api.on(api.root,"click",e=>{const s=e.target.closest("[data-rrsong]");if(s){start(s.dataset.rrsong);return}const b=e.target.closest("[data-rr]");if(!b)return;const k=b.dataset.rr;
    if(k==="quit"||k==="menu")menu();else if(k==="again")start(G.song.id);else if(k==="resume")resume()});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-rrlv]")){st.lv=e.target.value;api.save();if(!G||G.done||!raf)menu()}});
  api.on(window,"resize",()=>{if(cv&&cv.isConnected)size()});
  // a challenge goes straight to its song
  if(mo&&mo.song&&songById(mo.song)){api.bar.querySelector("[data-rrlv]").disabled=true;wrap.innerHTML=`<div class="rr-res"><div class="rr-big">🎸</div><b>${api.esc(songById(mo.song).name)}</b> &middot; ${LEVELS[st.lv].label}<br>Get your fingers ready.</div><div class="actions" style="justify-content:center"><button class="btn default" type="button" data-rrsong="${mo.song}">Start</button></div>`;status()}
  else menu();
  A95G.riff._live=()=>G&&{G,t:now()-G.t0};
  return {pause,unmount(){stop();if(ac)try{ac.close()}catch(e){}}};
}};
A95G.riff._t={SONGS,chart,parse,maxScore,starsFor};
})();
