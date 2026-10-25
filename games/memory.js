// Memory Match for the Atlas95 Game Vault: flip two cards at a time and find every pair.
(()=>{
const CSS=`
.mm-grid{display:grid;gap:6px;margin:0 auto;width:min(100%,var(--mmw))}
.mm-card{aspect-ratio:3/4;position:relative;border:0;padding:0;background:none;cursor:pointer;perspective:600px;font:inherit;color:var(--ink)}
.mm-card .in{position:absolute;inset:0;transition:transform .35s;transform-style:preserve-3d}
.mm-card.up .in{transform:rotateY(180deg)}
.mm-card .f,.mm-card .b{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;align-items:center;justify-content:center;box-shadow:var(--raised)}
.mm-card .b{background:repeating-linear-gradient(45deg,#000080 0 6px,#1084d0 6px 9px);box-shadow:var(--raised),inset 0 0 0 4px var(--face)}
.mm-card .f{background:var(--hi);transform:rotateY(180deg);padding:4px;text-align:center;font-weight:700;font-size:clamp(10px,2.4vw,14px);line-height:1.15;overflow:hidden;overflow-wrap:anywhere}
.mm-card .f svg{width:72%;height:auto}
.mm-card .f img{max-width:92%;max-height:70%;box-shadow:0 0 0 1px var(--shadow)}
.mm-card .f .sym{font-size:clamp(22px,6vw,34px);color:var(--sel)}
.mm-card.done .f{background:#eaf7ea;box-shadow:var(--sunken)}
.mm-card.done{cursor:default}
.mm-card:focus-visible{outline:2px dotted var(--ink);outline-offset:2px}
.mm-done{text-align:center}
@media (prefers-reduced-motion:reduce){.mm-card .in{transition:none}}`;
const SHAPES=[
  ["Red circle",'<circle cx="20" cy="20" r="15" fill="#e00000"/>'],
  ["Blue square",'<rect x="6" y="6" width="28" height="28" fill="#1040c0"/>'],
  ["Green triangle",'<path d="M20 4L36 34H4z" fill="#008000"/>'],
  ["Yellow star",'<path d="M20 3l5 10.5 11.5 1.4-8.4 7.9 2.2 11.4L20 28.6 9.7 34.2l2.2-11.4-8.4-7.9L15 13.5z" fill="#ffd800"/>'],
  ["Pink heart",'<path d="M20 35S4 24.5 4 14a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 10.5-16 21-16 21z" fill="#ff5fa2"/>'],
  ["Purple diamond",'<path d="M20 3l15 17-15 17L5 20z" fill="#800080"/>'],
  ["Orange hexagon",'<path d="M12 5h16l8 15-8 15H12L4 20z" fill="#ff8c00"/>'],
  ["Navy moon",'<path d="M26 4a16 16 0 1 0 10 22A13 13 0 0 1 26 4z" fill="#000080"/>'],
  ["Teal cross",'<path d="M14 4h12v10h10v12H26v10H14V26H4V14h10z" fill="#008080"/>'],
  ["Brown ring",'<circle cx="20" cy="20" r="12" fill="none" stroke="#8b4513" stroke-width="7"/>'],
  ["Gold bolt",'<path d="M23 3L8 23h10l-3 14 17-21H21z" fill="#c9a000"/>'],
  ["Cyan drop",'<path d="M20 3C13 14 8 20 8 26a12 12 0 0 0 24 0c0-6-5-12-12-23z" fill="#00b4d8"/>']];
const MODES={shapes:"Shapes",flags:"Flags & countries",elements:"Element symbols"};
const SIZES={easy:{n:6,cols:4,label:"Easy"},normal:{n:8,cols:4,label:"Normal"},hard:{n:12,cols:6,label:"Hard"}};
A95G.memory={
help:`<div>All the cards start face down. Flip two at a time. If they match, they stay up. If not, they flip back, so remember where things were!</div>
<ul class="factlist"><li><b>Shapes:</b> find two identical shapes.</li><li><b>Flags &amp; countries:</b> match each flag to its country's name.</li><li><b>Element symbols:</b> match each symbol (like Fe) to its element (Iron).</li><li>Fewer moves is better. Each pair of flips counts as one move.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats,esc=api.esc;st.mode=MODES[st.mode]?st.mode:"shapes";st.size=SIZES[st.size]?st.size:"normal";st.bests=st.bests||{};
  let cards,open,moves,misses,found,lock,t0,tick=null,flipT=null;
  const bar=()=>{api.bar.innerHTML=`<button class="btn" type="button" data-mm="new">New game</button><select class="sel95" data-mmset="mode" aria-label="Cards">${Object.entries(MODES).map(([k,v])=>`<option value="${k}"${st.mode===k?" selected":""}>${v}</option>`).join("")}</select><select class="sel95" data-mmset="size" aria-label="Size">${Object.entries(SIZES).map(([k,v])=>`<option value="${k}"${st.size===k?" selected":""}>${v.label} (${v.n} pairs)</option>`).join("")}</select>`};
  function deal(){const n=SIZES[st.size].n,rnd=Math.random;let pairs;
    if(st.mode==="shapes")pairs=api.shuffle(SHAPES,rnd).slice(0,n).map((s,i)=>{const h=`<svg viewBox="0 0 40 40" role="img" aria-label="${s[0]}">${s[1]}</svg>`;return [{k:i,html:h,name:s[0]},{k:i,html:h,name:s[0]}]});
    else if(st.mode==="flags")pairs=api.shuffle(api.countries().filter(c=>c.p>8e6),rnd).slice(0,n).map((c,i)=>[{k:i,html:api.flagImg(c,"",""),name:"Flag of "+c.n},{k:i,html:esc(c.n),name:c.n}]);
    else pairs=api.shuffle(api.elements().filter(e=>e.z<=56),rnd).slice(0,n).map((e,i)=>[{k:i,html:`<span class="sym">${esc(e.s)}</span>`,name:"Symbol "+e.s},{k:i,html:esc(e.n),name:e.n}]);
    cards=api.shuffle(pairs.flat(),rnd).map(c=>Object.assign(c,{up:false,done:false}));open=[];moves=0;misses=0;found=0;lock=false;t0=null;clearInterval(tick);clearTimeout(flipT);render();status()}
  function render(){const cols=SIZES[st.size].cols;
    api.root.innerHTML=`<div class="mm-grid" style="grid-template-columns:repeat(${cols},1fr);--mmw:${cols*92}px">${cards.map((c,i)=>`<button type="button" class="mm-card${c.up||c.done?" up":""}${c.done?" done":""}" data-i="${i}" aria-label="${c.up||c.done?esc(c.name):"Face-down card "+(i+1)}"${c.done?' aria-disabled="true"':""}><span class="in"><span class="b"></span><span class="f">${c.html}</span></span></button>`).join("")}</div><div class="mm-done" aria-live="polite"></div>`}
  function sync(i){const c=cards[i],el=api.root.querySelector(`[data-i="${i}"]`);if(!el)return;el.classList.toggle("up",c.up||c.done);el.classList.toggle("done",c.done);el.setAttribute("aria-label",c.up||c.done?c.name:"Face-down card "+(i+1))}
  const key=()=>st.mode+"|"+st.size;
  function status(){const b=st.bests[key()];api.status(`Moves: ${moves} · Pairs: ${found}/${cards.length/2}`,t0?`Time: ${api.fmtTime(Date.now()-t0)}`:"Time: 0:00")}
  function flip(i){const c=cards[i];if(lock||c.up||c.done)return;
    if(!t0){t0=Date.now();tick=setInterval(status,1000)}
    c.up=true;sync(i);api.sound("flip");open.push(i);if(open.length<2)return;
    moves++;const [a,b]=open;open=[];
    if(cards[a].k===cards[b].k){cards[a].done=cards[b].done=true;found++;setTimeout(()=>{sync(a);sync(b)},250);api.sound("ding");status();if(found===cards.length/2)win();return}
    misses++;lock=true;status();flipT=setTimeout(()=>{cards[a].up=cards[b].up=false;sync(a);sync(b);lock=false},850)}
  function win(){clearInterval(tick);const ms=Date.now()-t0,k=key(),prev=st.bests[k],nb=!prev||moves<prev.moves||moves===prev.moves&&ms<prev.ms;
    if(nb)st.bests[k]={moves,ms};if(!misses)st.flawless=true;st.bestText=`${st.bests[k].moves} moves (${SIZES[st.size].label}, ${MODES[st.mode].toLowerCase()})`;
    const r=api.result({xp:({easy:5,normal:8,hard:12})[st.size]+(misses?0:5)});
    if(nb&&prev)api.toast(`<span class="gmtemo">🏆</span><span><b>New best in Memory Match!</b><br>${moves} moves</span>`);
    api.sound("win");
    api.root.querySelector(".mm-done").innerHTML=`<div class="fb ok">All ${found} pairs in ${moves} moves &middot; ${api.fmtTime(ms)}${!misses?" &middot; not a single miss!":""}</div><div class="note">${nb?(prev?"New best for this mode!":"First win in this mode."):`Best: ${prev.moves} moves`}${r.xp?` &middot; +${r.xp} XP`:""}</div><div class="actions" style="justify-content:center;margin-top:6px"><button class="btn default" type="button" data-mm="new">Play again</button></div>`;
    status();const b=api.root.querySelector(".mm-done .btn");if(b)b.focus({preventScroll:true})}
  api.on(api.root,"click",e=>{const c=e.target.closest(".mm-card");if(c){flip(+c.dataset.i);return}if(e.target.closest("[data-mm]"))deal()});
  api.on(api.bar,"click",e=>{if(e.target.closest("[data-mm]"))deal()});
  api.on(api.bar,"change",e=>{const s=e.target.closest("[data-mmset]");if(!s)return;st[s.dataset.mmset]=s.value;api.save();deal()});
  bar();deal();
  return {unmount(){clearInterval(tick);clearTimeout(flipT)}};
}};
})();
