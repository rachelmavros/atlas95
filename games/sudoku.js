// Sudoku for the Atlas95 Game Vault: a Daily puzzle (the same for everyone) plus Easy, Medium and Hard practice.
// Every puzzle is checked to have exactly one solution. Progress is saved.
(()=>{
const LV={daily:{label:"Daily (Medium)",clues:32},easy:{label:"Easy",clues:40},medium:{label:"Medium",clues:32},hard:{label:"Hard",clues:25}};
const box=i=>Math.floor(Math.floor(i/9)/3)*3+Math.floor(i%9/3);
const PEERS=[...Array(81)].map((_,i)=>{const r=Math.floor(i/9),c=i%9,b=box(i),s=new Set();for(let j=0;j<81;j++)if(j!==i&&(Math.floor(j/9)===r||j%9===c||box(j)===b))s.add(j);return [...s]});
// how many solutions g has, stopping at limit (bitmask search, fewest-candidates cell first)
function count(g,limit){const R=new Uint16Array(9),C=new Uint16Array(9),B=new Uint16Array(9);
  for(let i=0;i<81;i++)if(g[i]){const m=1<<g[i];R[Math.floor(i/9)]|=m;C[i%9]|=m;B[box(i)]|=m}
  let n=0;(function go(){let best=-1,bm=0,bc=10;for(let i=0;i<81;i++){if(g[i])continue;const m=~(R[Math.floor(i/9)]|C[i%9]|B[box(i)])&0x3fe;let k=0;for(let x=m;x;x&=x-1)k++;if(k<bc){bc=k;best=i;bm=m;if(!k)return}}
    if(best<0){n++;return}const r=Math.floor(best/9),c=best%9,b=box(best);
    for(let d=1;d<=9&&n<limit;d++){if(!(bm&(1<<d)))continue;const m=1<<d;g[best]=d;R[r]|=m;C[c]|=m;B[b]|=m;go();R[r]&=~m;C[c]&=~m;B[b]&=~m;g[best]=0}})();
  return n}
function solved(rnd){const g=new Int8Array(81);(function fill(i){if(i===81)return true;const ds=[1,2,3,4,5,6,7,8,9];for(let k=8;k>0;k--){const j=Math.floor(rnd()*(k+1));[ds[k],ds[j]]=[ds[j],ds[k]]}
    for(const d of ds){if(PEERS[i].some(j=>g[j]===d))continue;g[i]=d;if(fill(i+1))return true}g[i]=0;return false})(0);return g}
function make(rnd,lv){const sol=solved(rnd),p=Int8Array.from(sol),order=[...Array(81).keys()];for(let k=80;k>0;k--){const j=Math.floor(rnd()*(k+1));[order[k],order[j]]=[order[j],order[k]]}
  let clues=81;for(const i of order){if(clues<=LV[lv].clues)break;const v=p[i];p[i]=0;if(count(Int8Array.from(p),2)!==1)p[i]=v;else clues--}
  return {p:[...p],sol:[...sol]}}
const CSS=`
.sd-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.sd-msg{min-height:1.4em;font-weight:700;text-align:center}
.sd-grid{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));grid-template-rows:repeat(9,minmax(0,1fr));width:min(100%,460px,calc(100vh - 330px));min-width:250px;aspect-ratio:1;background:#000;padding:2px;gap:1px;box-shadow:var(--sunken);user-select:none;-webkit-user-select:none;touch-action:manipulation}
.sd-c{border:0;padding:0;background:#fff;font:700 clamp(16px,4.6vw,24px)/1 var(--ui);color:#000080;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;min-width:0;min-height:0;overflow:hidden}
.sd-c.g{color:#000}
.sd-c.br{margin-right:2px}.sd-c.bb{margin-bottom:2px}
.sd-c.peer{background:#e8eef8}.sd-c.same{background:#c8d8f0}.sd-c.sel{background:#ffe680}
.sd-c.bad{color:#d00000;background:#ffd6d6}.sd-c.sel.bad{background:#ffb0b0}
.sd-c .n{position:absolute;inset:1px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));font:400 clamp(7px,1.8vw,10px)/1 var(--ui);color:#505050}
.sd-c .n i{font-style:normal;display:flex;align-items:center;justify-content:center}
.sd-c:focus-visible{outline:2px solid #000080;outline-offset:-2px;z-index:1}
.sd-pad{display:grid;grid-template-columns:repeat(9,1fr);gap:3px;width:min(100%,460px)}
.sd-pad .btn{padding:0;min-height:42px;font-size:18px;font-weight:700}
.sd-pad .btn small{display:block;font-size:9px;font-weight:400;color:#404040}
.sd-tools{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.sd-win{position:relative}`;
A95G.sudoku={_t:{make,count},
help:`<div>Fill the grid so every <b>row</b>, every <b>column</b> and every <b>3×3 box</b> has the numbers 1 to 9, each exactly once.</div>
<ul class="factlist"><li>Tap a square, then tap a number (or type it). Arrow keys move around on a computer.</li><li><b>Notes</b> mode lets you pencil in small numbers you're considering. Press N to switch it on a keyboard.</li><li>Numbers that break the rules turn <b style="color:#d00000">red</b>. The <b>Daily</b> puzzle is the same for everyone today, so compare your time with friends.</li><li>Your progress is saved, so you can come back to a puzzle.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.bests=st.bests||{};st.days=st.days||{};const mo=api.modeOpts();if(mo&&LV[mo.lv]&&mo.lv!=="daily")st.lv=mo.lv;st.lv=LV[st.lv]?st.lv:"daily";
  let P,sel=-1,notes=false,hist=[],t0=0,tick=null,today=api.today();
  api.bar.innerHTML=`<select class="sel95" data-sdlv aria-label="Puzzle">${Object.entries(LV).map(([k,v])=>`<option value="${k}"${st.lv===k?" selected":""}>${v.label}</option>`).join("")}</select><button class="btn" type="button" data-sd="new">New puzzle</button>`;
  api.root.innerHTML=`<div class="sd-wrap"><div class="sd-msg" aria-live="polite"></div><div class="sd-grid" role="grid" aria-label="Sudoku grid"></div>
    <div class="sd-pad">${[1,2,3,4,5,6,7,8,9].map(d=>`<button class="btn" type="button" data-d="${d}">${d}<small></small></button>`).join("")}</div>
    <div class="sd-tools"><button class="btn" type="button" data-sd="notes" aria-pressed="false">✎ Notes: Off</button><button class="btn" type="button" data-sd="erase">Erase</button><button class="btn" type="button" data-sd="undo">Undo</button></div></div>`;
  const grid=api.root.querySelector(".sd-grid"),msg=api.root.querySelector(".sd-msg"),newBtn=api.bar.querySelector("[data-sd=new]");
  grid.innerHTML=[...Array(81)].map((_,i)=>`<button type="button" class="sd-c${i%9===2||i%9===5?" br":""}${Math.floor(i/9)===2||Math.floor(i/9)===5?" bb":""}" data-i="${i}"></button>`).join("");
  const cells=[...grid.children];
  // P: {lv, day, seed, p (givens), sol, v (entries), n (notes as bitmasks), ms, mis (mistakes), done}
  function fresh(){const daily=st.lv==="daily",rnd=api.begin({lv:st.lv});
    const z=make(daily?api.rng("sudoku|"+today):rnd,daily?"medium":st.lv);
    P={lv:st.lv,day:daily?today:null,p:z.p,sol:z.sol,v:z.p.slice(),n:Array(81).fill(0),ms:0,mis:0,done:false};hist=[];t0=0;clearInterval(tick);sel=-1;save();render();
    say(daily?`Daily Sudoku for ${api.niceDate(today)}`:`${LV[st.lv].label} puzzle. Good luck!`)}
  function load(){const g=st.game;if(!g||!g.p||g.lv!==st.lv||(g.lv==="daily"&&g.day!==today))return false;P=g;hist=[];return true}
  function save(){st.game=Object.assign({},P,{ms:elapsed()});api.save()}
  const elapsed=()=>P.ms+(t0?Date.now()-t0:0);
  function clock(){if(!t0&&!P.done){t0=Date.now();tick=setInterval(status,1000)}}
  function stopClock(){if(t0){P.ms+=Date.now()-t0;t0=0}clearInterval(tick)}
  function status(){const b=st.bests[st.lv];api.status(`${LV[st.lv].label} · ${api.fmtTime(elapsed())}`,`Mistakes: ${P.mis}${b!=null?` · Best: ${api.fmtTime(b)}`:""}`)}
  function say(t){msg.textContent=t}
  const wrong=i=>P.v[i]&&!P.p[i]&&P.v[i]!==P.sol[i];
  function render(){const sv=sel>=0?P.v[sel]:0,peers=sel>=0?new Set(PEERS[sel]):new Set();
    cells.forEach((el,i)=>{const v=P.v[i];let cls="sd-c"+(i%9===2||i%9===5?" br":"")+(Math.floor(i/9)===2||Math.floor(i/9)===5?" bb":"");
      if(P.p[i])cls+=" g";if(i===sel)cls+=" sel";else if(sv&&v===sv)cls+=" same";else if(peers.has(i))cls+=" peer";if(wrong(i))cls+=" bad";el.className=cls;
      el.innerHTML=v?v:P.n[i]?`<span class="n">${[1,2,3,4,5,6,7,8,9].map(d=>`<i>${P.n[i]&(1<<d)?d:""}</i>`).join("")}</span>`:"";
      el.setAttribute("aria-label",`Row ${Math.floor(i/9)+1}, column ${i%9+1}: ${v||"empty"}${P.p[i]?" (given)":""}`)});
    // numbers already used 9 times are greyed out on the pad
    api.root.querySelectorAll(".sd-pad .btn").forEach(b=>{const d=+b.dataset.d,left=9-P.v.filter((x,i)=>x===d&&!wrong(i)).length;b.disabled=P.done||left<=0;b.querySelector("small").textContent=left>0?left:""});
    status()}
  function push(){hist.push(JSON.stringify({v:P.v,n:P.n}));if(hist.length>300)hist.shift()}
  function put(d){if(P.done||sel<0||P.p[sel])return;clock();
    if(notes){if(P.v[sel])return;push();P.n[sel]^=1<<d;save();render();return}
    if(P.v[sel]===d)return;push();P.v[sel]=d;P.n[sel]=0;
    if(d!==P.sol[sel]){P.mis++;api.sound("lose")}else{PEERS[sel].forEach(j=>P.n[j]&=~(1<<d));api.sound("tap")}
    save();render();if(P.v.every((x,i)=>x===P.sol[i]))win()}
  function erase(){if(P.done||sel<0||P.p[sel]||(!P.v[sel]&&!P.n[sel]))return;push();P.v[sel]=0;P.n[sel]=0;save();render()}
  function undo(){if(P.done||!hist.length)return;const h=JSON.parse(hist.pop());P.v=h.v;P.n=h.n;save();render()}
  function win(){stopClock();P.done=true;const ms=P.ms,daily=P.lv==="daily",lv=daily?"medium":P.lv,prev=st.bests[P.lv],nb=prev==null||ms<prev;if(nb)st.bests[P.lv]=ms;
    st.wins=(st.wins||0)+1;(st.lvWins||(st.lvWins={}))[lv]=(st.lvWins[lv]||0)+1;if(daily&&!st.days[today])st.days[today]={ms,mis:P.mis};
    const xp=({easy:8,medium:15,hard:25})[lv]+(daily?10:0);
    const r=api.result(daily?{xp}:{xp,ch:{v:ms,text:api.fmtTime(ms),higher:false}});save();render();api.sound("win");
    if(nb&&prev!=null)api.toast(`<span class="gmtemo">🏆</span><span><b>New best in Sudoku!</b><br>${LV[P.lv].label}: ${api.fmtTime(ms)}</span>`);
    msg.innerHTML=`Solved in ${api.fmtTime(ms)}!${P.mis?` ${P.mis} mistake${P.mis===1?"":"s"}.`:" No mistakes!"}${r.xp?` +${r.xp} XP`:""} ${daily?`<button class="btn" type="button" data-sd="share">Share...</button>`:`<button class="btn default" type="button" data-sd="new">Next puzzle</button>`}`;
    newBtn.hidden=daily}
  function select(i){sel=i;render();if(cells[i]&&document.activeElement!==cells[i]&&matchMedia("(pointer:fine)").matches)cells[i].focus({preventScroll:true})}
  api.on(grid,"click",e=>{const c=e.target.closest(".sd-c");if(c)select(+c.dataset.i)});
  api.on(api.root,"click",e=>{const d=e.target.closest("[data-d]");if(d){put(+d.dataset.d);return}const b=e.target.closest("[data-sd]");if(b)act(b.dataset.sd,b)});
  api.on(api.bar,"click",e=>{const b=e.target.closest("[data-sd]");if(b)act(b.dataset.sd,b)});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-sdlv]")){if(P&&!P.done)save();stopClock();st.lv=e.target.value;api.save();newBtn.hidden=false;if(!load())fresh();else{render();say(P.done?"Already solved.":"Welcome back!")}}});
  function act(k,b){if(k==="new"){if(st.lv==="daily"&&!P.done)return;stopClock();if(st.lv==="daily"){say("Come back tomorrow for a new Daily Sudoku.");return}fresh();return}
    if(k==="notes"){notes=!notes;b.setAttribute("aria-pressed",notes);b.textContent=`✎ Notes: ${notes?"On":"Off"}`;return}
    if(k==="erase"){erase();return}if(k==="undo"){undo();return}
    if(k==="share"){const d=st.days[today];if(d)api.share(`Atlas95 Daily Sudoku · ${api.niceDate(today)}\n⏱️ ${api.fmtTime(d.ms)}${d.mis?` · ${d.mis} mistake${d.mis===1?"":"s"}`:" · no mistakes"}`,b)}}
  api.on(document,"keydown",e=>{if(!api.active()||e.ctrlKey||e.metaKey||e.altKey||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
    if(/^[1-9]$/.test(e.key)){e.preventDefault();put(+e.key);return}
    if(e.key==="Backspace"||e.key==="Delete"||e.key==="0"){e.preventDefault();erase();return}
    if(e.key==="n"||e.key==="N"){act("notes",api.root.querySelector("[data-sd=notes]"));return}
    const mv={ArrowUp:-9,ArrowDown:9,ArrowLeft:-1,ArrowRight:1}[e.key];if(mv){e.preventDefault();const i=sel<0?40:sel,c=i%9;let j=i+mv;if(mv===-1&&c===0)j=i+8;if(mv===1&&c===8)j=i-8;select((j+81)%81)}});
  if(api.seeded()||!load())fresh();else{render();say(P.done?(P.lv==="daily"?"Today's puzzle is done! Try Easy, Medium or Hard.":"Already solved."):"Welcome back! Your puzzle is where you left it.");newBtn.hidden=P.lv==="daily"&&!P.done}
  newBtn.hidden=st.lv==="daily";
  return {pause(){if(t0){stopClock();save()}},unmount(){stopClock();if(P)save()}};
}};
})();
