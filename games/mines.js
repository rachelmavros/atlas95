// Minesweeper for the Atlas95 Game Vault. Your first click is always safe.
(()=>{
const LV={beg:{label:"Beginner",w:9,h:9,m:10},int:{label:"Intermediate",w:16,h:16,m:40},exp:{label:"Expert",w:30,h:16,m:99}};
const NUMC=["","#0000ff","#008000","#ff0000","#000080","#800000","#008080","#000","#808080"];
const CSS=`
.ms-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.ms-frame{background:var(--face);box-shadow:var(--raised);padding:6px;display:flex;flex-direction:column;gap:6px;max-width:100%}
.ms-top{box-shadow:var(--sunken);padding:4px 6px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.ms-lcd{background:#000;color:#ff2020;font:700 22px/1 "Courier New",monospace;padding:2px 4px;letter-spacing:1px;min-width:3.2ch;text-align:right;box-shadow:inset 1px 1px #808080,inset -1px -1px #fff}
.ms-face{width:34px;height:34px;padding:0;font-size:20px;line-height:1;min-height:0}
.ms-scroll{max-width:100%;overflow:auto;box-shadow:var(--sunken);padding:3px}
.ms-grid{display:grid;gap:0;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.ms-c{width:var(--msz);height:var(--msz);border:0;padding:0;background:var(--face);box-shadow:var(--raised);font:700 calc(var(--msz)*.62)/1 var(--ui);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--ink)}
.ms-c.open{box-shadow:none;background:#c0c0c0;border-right:1px solid #808080;border-bottom:1px solid #808080;cursor:default}
.ms-c.boom{background:#ff0000}
.ms-c:focus-visible{outline:1px dotted #000;outline-offset:-3px}
.ms-tools{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center}
@media (pointer:fine){.ms-flagtool{display:none}}`;
A95G.mines={
help:`<div>Open every square that <i>isn't</i> a mine. A number tells you how many mines touch that square, including diagonally.</div>
<ul class="factlist"><li><b>Open a square:</b> click or tap it. Your first one is always safe.</li><li><b>Flag a mine:</b> right-click, or on a phone press and hold (or switch on <b>Flag mode</b>).</li><li><b>Shortcut:</b> click a number that already has that many flags around it to open all its other neighbors.</li><li>Click the smiley to start over. Clear the board as fast as you can!</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.lv=LV[st.lv]?st.lv:"beg";st.bests=st.bests||{};
  let W,H,M,cells,state,flags,opened,t0,tick=null,flagMode=false,press=null;
  api.bar.innerHTML=`<select class="sel95" data-mslv aria-label="Difficulty">${Object.entries(LV).map(([k,v])=>`<option value="${k}"${st.lv===k?" selected":""}>${v.label} (${v.w}×${v.h}, ${v.m} mines)</option>`).join("")}</select>`;
  api.root.innerHTML=`<div class="ms-wrap"><div class="ms-frame"><div class="ms-top"><span class="ms-lcd" id="msm">000</span><button class="btn ms-face" type="button" data-msnew aria-label="New game">🙂</button><span class="ms-lcd" id="mst">000</span></div><div class="ms-scroll"><div class="ms-grid"></div></div></div>
    <div class="ms-tools"><button class="btn ms-flagtool" type="button" data-msflag aria-pressed="false">🚩 Flag mode: Off</button><span class="note" aria-live="polite" id="msnote"></span></div></div>`;
  const grid=api.root.querySelector(".ms-grid"),face=api.root.querySelector(".ms-face");
  const lcd=n=>String(Math.max(-99,Math.min(999,n))).padStart(3,"0");
  function size(){const L=LV[st.lv],narrow=innerWidth<640&&L.w>L.h;W=narrow?L.h:L.w;H=narrow?L.w:L.h;M=L.m;
    const avail=Math.min(api.root.clientWidth||innerWidth,innerWidth)-34;grid.style.setProperty("--msz",Math.max(22,Math.min(30,Math.floor(avail/W)))+"px");grid.style.gridTemplateColumns=`repeat(${W},auto)`}
  function reset(){clearInterval(tick);size();cells=[...Array(W*H)].map(()=>({mine:false,n:0,open:false,flag:false}));state="ready";flags=0;opened=0;t0=0;face.textContent="🙂";
    grid.innerHTML=cells.map((_,i)=>`<button type="button" class="ms-c" data-i="${i}" aria-label="Hidden square"></button>`).join("");
    counters();api.root.querySelector("#msnote").textContent="";const b=st.bests[st.lv];api.status(LV[st.lv].label,b!=null?`Best: ${api.fmtTime(b)}`:"Best: --")}
  const nb=i=>{const x=i%W,y=Math.floor(i/W),o=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const a=x+dx,b=y+dy;if(a>=0&&a<W&&b>=0&&b<H)o.push(b*W+a)}return o};
  function lay(safe){const keep=new Set([safe,...nb(safe)]),spots=api.shuffle([...cells.keys()].filter(i=>!keep.has(i)),Math.random).slice(0,M);
    spots.forEach(i=>cells[i].mine=true);cells.forEach((c,i)=>c.n=nb(i).filter(j=>cells[j].mine).length)}
  function counters(){api.root.querySelector("#msm").textContent=lcd(M-flags);api.root.querySelector("#mst").textContent=lcd(t0?Math.floor((Date.now()-t0)/1000):0)}
  function paint(i){const c=cells[i],el=grid.children[i];if(!el)return;
    el.className="ms-c"+(c.open?" open":"")+(c.boom?" boom":"");
    if(c.open){el.textContent=c.mine?"💣":c.n||"";el.style.color=NUMC[c.n]||"";el.setAttribute("aria-label",c.mine?"Mine":c.n?`${c.n} mine${c.n===1?"":"s"} nearby`:"Empty")}
    else{el.textContent=c.flag?"🚩":c.wrong?"❌":"";el.style.color="";el.setAttribute("aria-label",c.flag?"Flagged square":"Hidden square")}}
  function open(i){const c=cells[i];if(c.open||c.flag||state==="over")return;
    if(state==="ready"){lay(i);state="run";t0=Date.now();tick=setInterval(counters,1000)}
    if(c.mine){c.open=true;c.boom=true;paint(i);lose();return}
    const q=[i];while(q.length){const j=q.pop(),d=cells[j];if(d.open||d.flag)continue;d.open=true;opened++;paint(j);if(!d.n)nb(j).forEach(k=>{if(!cells[k].open&&!cells[k].mine)q.push(k)})}
    api.sound("flip");if(opened===W*H-M)win()}
  function chord(i){const c=cells[i];if(!c.open||!c.n)return;const n=nb(i);if(n.filter(j=>cells[j].flag).length!==c.n)return;n.forEach(j=>{if(state!=="over")open(j)})}
  function flag(i){const c=cells[i];if(c.open||state==="over")return;c.flag=!c.flag;flags+=c.flag?1:-1;paint(i);counters();api.sound("tap")}
  function lose(){state="over";clearInterval(tick);face.textContent="😵";api.sound("lose");
    cells.forEach((c,i)=>{if(c.mine&&!c.flag)c.open=true;if(c.flag&&!c.mine)c.wrong=true,c.flag=false;paint(i)});
    api.result({xp:1});api.root.querySelector("#msnote").textContent="Boom! Click the face to try again."}
  function win(){state="over";clearInterval(tick);face.textContent="😎";const ms=Date.now()-t0;
    cells.forEach((c,i)=>{if(c.mine&&!c.flag){c.flag=true;flags++;paint(i)}});counters();
    const prev=st.bests[st.lv],nb_=prev==null||ms<prev;if(nb_)st.bests[st.lv]=ms;st.wins=(st.wins||0)+1;(st.lvWins||(st.lvWins={}))[st.lv]=(st.lvWins[st.lv]||0)+1;
    const r=api.result({xp:({beg:6,int:15,exp:30})[st.lv]});api.sound("win");
    if(nb_&&prev!=null)api.toast(`<span class="gmtemo">🏆</span><span><b>New best in Minesweeper!</b><br>${LV[st.lv].label}: ${api.fmtTime(ms)}</span>`);
    api.root.querySelector("#msnote").textContent=`Cleared in ${api.fmtTime(ms)}!${nb_?" New best!":""}${r.xp?` +${r.xp} XP`:""}`;
    api.status(LV[st.lv].label,`Best: ${api.fmtTime(st.bests[st.lv])}`)}
  // touch: press and hold to flag
  api.on(grid,"pointerdown",e=>{const el=e.target.closest(".ms-c");if(!el||e.button>0)return;if(state!=="over")face.textContent="😮";
    if(e.pointerType!=="mouse"){const i=+el.dataset.i;press={i,held:false,t:setTimeout(()=>{press.held=true;flag(i);try{navigator.vibrate&&navigator.vibrate(20)}catch(_){}},420)}}});
  const lift=()=>{if(state!=="over")face.textContent="🙂";if(press&&!press.held)clearTimeout(press.t)};
  api.on(document,"pointerup",lift);api.on(grid,"pointercancel",()=>{if(press)clearTimeout(press.t);press=null;lift()});
  api.on(grid,"click",e=>{const el=e.target.closest(".ms-c");if(!el)return;const i=+el.dataset.i;if(press&&press.held){press=null;return}press=null;
    if(cells[i].open){chord(i);return}if(flagMode)flag(i);else open(i)});
  api.on(grid,"contextmenu",e=>{const el=e.target.closest(".ms-c");if(!el)return;e.preventDefault();if(press){clearTimeout(press.t);if(press.held){press=null;return}press=null}const i=+el.dataset.i;if(cells[i].open)chord(i);else flag(i)});
  api.on(api.root,"click",e=>{if(e.target.closest("[data-msnew]")){reset();return}const f=e.target.closest("[data-msflag]");if(f){flagMode=!flagMode;f.setAttribute("aria-pressed",flagMode);f.textContent=`🚩 Flag mode: ${flagMode?"On":"Off"}`}});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-mslv]")){st.lv=e.target.value;api.save();reset()}});
  reset();
  return {unmount(){clearInterval(tick)}};
}};
})();
