// Lights Out for the Atlas95 Game Vault: tapping a light flips it and its four neighbors; turn them all off.
(()=>{
const N=5,ALL=(1<<(N*N))-1;
// the lights a tap at i flips (itself and up/down/left/right), as a bitmask
const MASK=[...Array(N*N)].map((_,i)=>{const r=Math.floor(i/N),c=i%N;let m=1<<i;if(r)m|=1<<(i-N);if(r<N-1)m|=1<<(i+N);if(c)m|=1<<(i-1);if(c<N-1)m|=1<<(i+1);return m});
const bits=x=>{let n=0;for(;x;x&=x-1)n++;return n};
// fewest taps that turn every light in `state` off: Gaussian elimination over on/off (GF(2)), then try every free choice
function solve(state){const n=N*N,rows=MASK.map((m,i)=>({m,b:(state>>i)&1})),piv=[];let r=0;
  for(let col=0;col<n&&r<n;col++){let k=r;while(k<n&&!((rows[k].m>>col)&1))k++;if(k===n)continue;[rows[r],rows[k]]=[rows[k],rows[r]];
    for(let j=0;j<n;j++)if(j!==r&&((rows[j].m>>col)&1)){rows[j].m^=rows[r].m;rows[j].b^=rows[r].b}piv.push(col);r++}
  for(let j=r;j<n;j++)if(rows[j].b)return null;
  const free=[...Array(n).keys()].filter(c=>!piv.includes(c));let best=null;
  for(let f=0;f<(1<<free.length);f++){let x=0;free.forEach((c,k)=>{if((f>>k)&1)x|=1<<c});
    for(let j=r-1;j>=0;j--){const c=piv[j];let v=rows[j].b;const others=rows[j].m&~(1<<c);v^=bits(others&x)&1;if(v)x|=1<<c}
    if(best==null||bits(x)<bits(best))best=x}
  return best}
// a solvable puzzle: k random taps from all-off
function make(rnd,k){for(let tries=0;tries<50;tries++){const cells=[...Array(N*N).keys()];for(let a=cells.length-1;a>0;a--){const j=Math.floor(rnd()*(a+1));[cells[a],cells[j]]=[cells[j],cells[a]]}
  let s=0;cells.slice(0,k).forEach(i=>s^=MASK[i]);const sol=solve(s);if(s&&sol!=null&&bits(sol)>=Math.min(k,Math.max(1,k-2)))return {s,par:bits(sol)}}
  return {s:MASK[12],par:1}}
const taps=L=>Math.min(1+L,14);
const CSS=`
.lo-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.lo-head{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.lo-head div{background:var(--hi);box-shadow:var(--sunken);padding:3px 10px;text-align:center;min-width:70px}
.lo-head small{display:block;font-size:11px;color:#404040}.lo-head b{font-size:17px;font-variant-numeric:tabular-nums}
.lo-msg{min-height:1.4em;font-weight:700;text-align:center}
.lo-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;background:#202020;padding:8px;box-shadow:var(--sunken);width:min(100%,380px,calc(100vh - 320px));min-width:230px;aspect-ratio:1;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.lo-c{border:0;padding:0;border-radius:6px;background:#3a3a3a;box-shadow:inset 2px 2px 0 #555,inset -2px -2px 0 #1a1a1a;cursor:pointer;position:relative;transition:background .12s,box-shadow .12s}
.lo-c.on{background:radial-gradient(circle at 40% 35%,#fffbe0,#ffe14a 45%,#e0a800);box-shadow:0 0 12px 2px rgba(255,220,60,.75),inset -2px -2px 0 rgba(0,0,0,.25)}
.lo-c.hint::after{content:"";position:absolute;inset:18%;border-radius:50%;border:3px solid #00e0ff;animation:lohint 1s infinite}
.lo-c:focus-visible{outline:2px solid #fff;outline-offset:2px}
.lo-grid.won .lo-c{background:#3a3a3a}
.lo-stars{font-size:26px;letter-spacing:2px;min-height:1.2em;color:#d4a000;text-shadow:1px 1px 0 #000}
@keyframes lohint{50%{transform:scale(.8);opacity:.5}}
@media (prefers-reduced-motion:reduce){.lo-c{transition:none}.lo-c.hint::after{animation:none}}`;
A95G.lights={_t:{solve,make,MASK,bits},
help:`<div>Some squares are lit up. Your goal: <b>turn every light off</b>.</div>
<ul class="factlist"><li>Tapping a square flips it <b>and</b> the squares right above, below, left and right of it. Lights that were on go off, and lights that were off come on.</li><li>The order you tap doesn't matter, and tapping the same square twice undoes it.</li><li><b>Par</b> is the fewest taps the puzzle can be solved in. Match it for ★★★.</li><li>Stuck? <b>Hint</b> shows a square to tap next. <b>Restart</b> puts the puzzle back how it started.</li><li>Tip: clear the top row first, then work your way down. For each light still on, tap the square directly below it.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.level=Math.max(1,st.level||1);st.days=st.days||{};const mo=api.modeOpts();if(mo&&mo.mode)st.mode=mo.mode;st.mode=st.mode==="daily"?"daily":"levels";
  // a challenge plays its own level without touching your progress
  let curL=mo&&mo.level?+mo.level:st.level;
  let G,today=api.today(),hint=-1,hints=0;
  api.bar.innerHTML=`<button class="btn" type="button" data-lom="levels" aria-pressed="${st.mode==="levels"}">Levels</button><button class="btn" type="button" data-lom="daily" aria-pressed="${st.mode==="daily"}">Daily puzzle</button><span class="sep"></span><button class="btn" type="button" data-lo="hint">Hint</button><button class="btn" type="button" data-lo="restart">Restart</button>`;
  api.root.innerHTML=`<div class="lo-wrap"><div class="lo-head"></div><div class="lo-msg" aria-live="polite"></div><div class="lo-grid" role="grid" aria-label="Lights">${[...Array(N*N)].map((_,i)=>`<button type="button" class="lo-c" data-i="${i}"></button>`).join("")}</div><div class="lo-stars" aria-live="polite"></div><div class="actions" id="loact" style="justify-content:center"></div></div>`;
  const grid=api.root.querySelector(".lo-grid"),cells=[...grid.children],msg=api.root.querySelector(".lo-msg"),stars=api.root.querySelector(".lo-stars"),act=api.root.querySelector("#loact");
  function setup(){hint=-1;hints=0;const daily=st.mode==="daily";const rnd=api.begin(daily?{mode:"daily"}:{mode:"levels",level:curL});
    if(daily){const z=make(api.rng("lights|"+today),10),d=st.days[today];G={start:z.s,s:d?0:z.s,par:z.par,moves:d?d.m:0,done:!!d,daily:true}}
    else{const z=make(rnd,taps(curL));G={start:z.s,s:z.s,par:z.par,moves:0,done:false,daily:false}}
    render();act.innerHTML="";stars.textContent="";
    if(G.done){msg.textContent=`Today's puzzle is solved in ${G.moves} taps. New one tomorrow!`;stars.textContent=rate(G.moves,G.par);act.innerHTML=`<button class="btn" type="button" data-lo="share">Share...</button><button class="btn" type="button" data-lom="levels">Play levels</button>`}
    else msg.textContent=daily?`Daily puzzle for ${api.niceDate(today)}: turn every light off.`:curL===1?"Tap a light. It flips along with its neighbors. Turn them all off!":`Level ${curL}: turn every light off.`}
  const rate=(m,par)=>m<=par?"★★★":m<=par+3?"★★☆":"★☆☆";
  function render(){cells.forEach((el,i)=>{const on=(G.s>>i)&1;el.classList.toggle("on",!!on);el.classList.toggle("hint",i===hint);el.setAttribute("aria-label",`Row ${Math.floor(i/N)+1}, column ${i%N+1}: ${on?"on":"off"}`)});
    grid.classList.toggle("won",G.done);const lit=bits(G.s);
    api.root.querySelector(".lo-head").innerHTML=`<div><small>${G.daily?"DAILY":"LEVEL"}</small><b>${G.daily?"★":curL}</b></div><div><small>TAPS</small><b>${G.moves}</b></div><div><small>PAR</small><b>${G.par}</b></div><div><small>LIGHTS ON</small><b>${lit}</b></div>`;
    api.status(G.daily?`Daily puzzle · ${G.moves} taps`:`Level ${curL} · ${G.moves} taps`,`Best level: ${st.maxLevel||st.level}`)}
  function tap(i){if(G.done)return;G.s^=MASK[i];G.moves++;hint=-1;api.sound("tap");render();if(!G.s)win()}
  function win(){G.done=true;const r3=rate(G.moves,G.par),perfect=G.moves<=G.par;api.sound("win");
    if(G.daily){st.days[today]={m:G.moves,par:G.par,h:hints};const r=api.result({xp:perfect?15:8});
      msg.textContent=`Solved in ${G.moves} taps! Par was ${G.par}.${r.xp?` +${r.xp} XP`:""}`;act.innerHTML=`<button class="btn default" type="button" data-lo="share">Share...</button><button class="btn" type="button" data-lom="levels">Play levels</button>`}
    else{const lv=curL,mine=!api.seeded();st.cleared=(st.cleared||0)+1;if(perfect)st.perfect=(st.perfect||0)+1;if(mine){st.maxLevel=Math.max(st.maxLevel||1,lv+1);st.level=lv+1}api.save();
      st.bestText=`Level ${st.maxLevel||lv}`;const r=api.result({xp:Math.min(20,3+lv)+(perfect?3:0),ch:{v:G.moves,text:`${G.moves} taps`,higher:false}});
      msg.textContent=`Level ${lv} cleared in ${G.moves} taps!${perfect?" Perfect!":` Par was ${G.par}.`}${r.xp?` +${r.xp} XP`:""}`;
      act.innerHTML=`<button class="btn default" type="button" data-lo="next">${mine?`Level ${lv+1} &gt;`:`Back to my level ${st.level} &gt;`}</button>`;const b=act.querySelector("button");if(b&&matchMedia("(pointer:fine)").matches)b.focus({preventScroll:true})}
    stars.textContent=r3;render()}
  function giveHint(){if(G.done)return;const x=solve(G.s);if(x==null)return;hint=[...Array(N*N).keys()].find(i=>(x>>i)&1);hints++;msg.textContent="Try tapping the square with the blue ring.";render()}
  api.on(grid,"click",e=>{const c=e.target.closest(".lo-c");if(c)tap(+c.dataset.i)});
  const onBtn=e=>{const m=e.target.closest("[data-lom]");if(m){st.mode=m.dataset.lom;curL=st.level;api.save();api.bar.querySelectorAll("[data-lom]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lom===st.mode));setup();return}
    const b=e.target.closest("[data-lo]");if(!b)return;const k=b.dataset.lo;
    if(k==="hint")giveHint();else if(k==="restart"){if(G.done&&G.daily)return;G.s=G.start;G.moves=0;G.done=false;hint=-1;act.innerHTML="";stars.textContent="";msg.textContent="Back to the start.";render()}
    else if(k==="next"){curL=st.level;setup()}else if(k==="share"){const d=st.days[today];if(d)api.share(`Atlas95 Lights Out · ${api.niceDate(today)}\n💡 Solved in ${d.m} taps (par ${d.par}) ${rate(d.m,d.par)}${d.h?`\n${d.h} hint${d.h===1?"":"s"}`:""}`,b)}};
  api.on(api.root,"click",onBtn);api.on(api.bar,"click",onBtn);
  api.on(document,"keydown",e=>{if(!api.active()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==="h"||e.key==="H")giveHint()});
  setup();
  return {unmount(){}};
}};
})();
