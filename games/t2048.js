// 2048 for the Atlas95 Game Vault: slide the tiles, merge matching numbers. Your board is saved between visits.
(()=>{
const N=4,SLIDE=110;
const COLORS={2:["#ffffff","#000"],4:["#ffffe1","#000"],8:["#ffd800","#000"],16:["#ff8c00","#000"],32:["#ff5050","#fff"],64:["#e00000","#fff"],128:["#7fd67f","#000"],256:["#008000","#fff"],512:["#1084d0","#fff"],1024:["#000080","#fff"],2048:["#800080","#fff"]};
const CSS=`
.t48-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.t48-score{display:flex;gap:6px}
.t48-score div{background:var(--hi);box-shadow:var(--sunken);padding:3px 12px;text-align:center;min-width:84px}
.t48-score small{display:block;font-size:11px;color:#404040}
.t48-score b{font-size:18px;font-variant-numeric:tabular-nums}
.t48-board{position:relative;width:min(100%,400px,calc(100vh - 250px));min-width:240px;aspect-ratio:1;background:#808080;box-shadow:var(--sunken);touch-action:none;user-select:none;-webkit-user-select:none}
.t48-cell,.t48-tile{position:absolute;width:calc(25% - 10px);height:calc(25% - 10px);margin:5px}
.t48-cell{background:#a0a0a0;box-shadow:inset 1px 1px #707070,inset -1px -1px #c8c8c8}
.t48-tile{display:flex;align-items:center;justify-content:center;font-weight:700;box-shadow:var(--raised);transition:left ${SLIDE}ms ease-out,top ${SLIDE}ms ease-out;font-size:clamp(16px,6vw,32px)}
.t48-tile.big{font-size:clamp(13px,4.6vw,25px)}.t48-tile.huge{font-size:clamp(11px,3.6vw,20px)}
.t48-tile.new{animation:t48in .15s ease-out}.t48-tile.pop{animation:t48pop .15s ease-out}
.t48-over{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35)}
.t48-over .dlg{width:auto}
.t48-over .dlg-body{align-items:center;padding:12px 16px;gap:8px;text-align:center}
@keyframes t48in{from{transform:scale(0)}to{transform:scale(1)}}
@keyframes t48pop{50%{transform:scale(1.15)}}
@media (prefers-reduced-motion:reduce){.t48-tile{transition:none}.t48-tile.new,.t48-tile.pop{animation:none}}`;
const KEYS={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",s:"down",a:"left",d:"right"};
A95G.t2048={
help:`<div>Slide all the tiles at once. When two tiles with the same number touch, they merge into one: 2+2 makes 4, 4+4 makes 8, and so on. Every move adds a new tile.</div>
<ul class="factlist"><li><b>Computer:</b> arrow keys or W A S D.</li><li><b>Phone:</b> swipe on the board.</li><li>Reach the <b>2048</b> tile to win, then keep going for a higher score. The game ends when no move is left.</li><li>Your game is saved, so you can come back to it later.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;let tiles,score,nextId=1,over=false,won,busy=false,els=new Map(),timer=null,rnd=Math.random;
  api.bar.innerHTML=`<button class="btn" type="button" data-t48="new">New game</button>`;
  api.root.innerHTML=`<div class="t48-wrap"><div class="t48-score"><div><small>SCORE</small><b id="t48s">0</b></div><div><small>BEST</small><b id="t48b">0</b></div></div><div class="t48-board" aria-label="2048 board" role="application">${[...Array(16)].map((_,i)=>`<div class="t48-cell" style="left:${i%4*25}%;top:${Math.floor(i/4)*25}%"></div>`).join("")}</div><div class="note">Swipe or use the arrow keys.</div></div>`;
  const board=api.root.querySelector(".t48-board");
  const at=(r,c)=>tiles.find(t=>t.r===r&&t.c===c&&!t.gone);
  function addTile(){const free=[];for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!at(r,c))free.push([r,c]);if(!free.length)return;const [r,c]=free[Math.floor(rnd()*free.length)];tiles.push({id:nextId++,r,c,v:rnd()<.9?2:4,fresh:true})}
  function fresh(){rnd=api.begin({});tiles=[];score=0;over=false;won=false;addTile();addTile();save();draw()}
  function save(){st.game=over?null:{t:tiles.filter(t=>!t.gone).map(t=>[t.r,t.c,t.v]),s:score,w:won};api.save()}
  function load(){const g=st.game;if(!g||!g.t||!g.t.length)return false;tiles=g.t.map(([r,c,v])=>({id:nextId++,r,c,v}));score=g.s||0;won=!!g.w;over=false;return true}
  function place(el,t){el.style.left=t.c*25+"%";el.style.top=t.r*25+"%"}
  function look(el,t){const [bg,fg]=COLORS[t.v]||["#000","#ffd800"];el.style.background=bg;el.style.color=fg;el.textContent=t.v;el.classList.toggle("big",t.v>=128&&t.v<1024);el.classList.toggle("huge",t.v>=1024)}
  function draw(){const live=new Set();tiles.forEach(t=>{if(t.gone)return;live.add(t.id);let el=els.get(t.id);
      if(!el){el=document.createElement("div");el.className="t48-tile"+(t.fresh?" new":"");board.appendChild(el);els.set(t.id,el)}
      else if(t.merged){el.classList.remove("pop");void el.offsetWidth;el.classList.add("pop")}
      place(el,t);look(el,t);t.fresh=false;t.merged=false});
    els.forEach((el,id)=>{if(!live.has(id)){el.remove();els.delete(id)}});
    api.root.querySelector("#t48s").textContent=score.toLocaleString("en-US");api.root.querySelector("#t48b").textContent=Math.max(st.best||0,score).toLocaleString("en-US");
    api.status(`Score: ${score.toLocaleString("en-US")}`,`Top tile: ${Math.max(0,...tiles.filter(t=>!t.gone).map(t=>t.v))}`)}
  function canMove(){for(let r=0;r<N;r++)for(let c=0;c<N;c++){const t=at(r,c);if(!t)return true;const a=at(r,c+1),b=at(r+1,c);if(a&&a.v===t.v||b&&b.v===t.v)return true}return false}
  function move(dir){if(over||busy)return;const dr={up:-1,down:1,left:0,right:0}[dir],dc={left:-1,right:1,up:0,down:0}[dir];
    const order=[...Array(N).keys()];if(dr>0||dc>0)order.reverse();let moved=false,gained=0;const merges=[];
    tiles.forEach(t=>t.done=false);
    for(const a of order)for(const b of order){const r=dr?a:b,c=dr?b:a,t=at(r,c);if(!t)continue;
      let nr=r,nc=c;while(true){const rr=nr+dr,cc=nc+dc;if(rr<0||rr>=N||cc<0||cc>=N)break;const o=at(rr,cc);
        if(!o){nr=rr;nc=cc;continue}if(o.v===t.v&&!o.done&&!t.done){nr=rr;nc=cc;merges.push([t,o])}break}
      if(nr!==r||nc!==c){moved=true;const m=merges.find(x=>x[0]===t&&x[1].r===nr&&x[1].c===nc);if(m){m[1].done=true;t.gone=true;t.r=nr;t.c=nc;t.into=m[1]}else{t.r=nr;t.c=nc}}}
    if(!moved)return;busy=true;
    // slide the merging tiles onto their partners first, then combine them
    tiles.filter(t=>t.gone).forEach(t=>{const el=els.get(t.id);if(el)place(el,t)});
    tiles.filter(t=>!t.gone).forEach(t=>{const el=els.get(t.id);if(el)place(el,t)});
    timer=setTimeout(()=>{merges.forEach(([t,o])=>{if(!t.gone)return;o.v*=2;o.merged=true;gained+=o.v});tiles=tiles.filter(t=>!t.gone);
      score+=gained;if(gained)api.sound("tap");addTile();draw();busy=false;
      const top=Math.max(...tiles.map(t=>t.v));
      if(top>=2048&&!won){won=true;st.won=(st.won||0)+1;api.sound("win");banner(`<big>2048!</big><div>You made the 2048 tile.</div><div class="actions"><button class="btn default" type="button" data-t48="go">Keep going</button></div>`)}
      if(!canMove())end();save()},api.reduced()?0:SLIDE)}
  function banner(h){const d=document.createElement("div");d.className="t48-over";d.innerHTML=`<div class="dlg"><div class="dlg-body">${h}</div></div>`;board.appendChild(d);const b=d.querySelector(".btn");if(b)b.focus({preventScroll:true})}
  function end(){over=true;const top=Math.max(...tiles.map(t=>t.v));if(top>(st.top||0))st.top=top;
    const r=api.result({score,text:score.toLocaleString("en-US"),xp:Math.min(30,Math.round(score/400))+(top>=2048?20:0),ch:{v:score,text:score.toLocaleString("en-US"),higher:true}});save();api.sound("lose");
    banner(`<big>Game over</big><div>Score: <b>${score.toLocaleString("en-US")}</b> &middot; top tile ${top}</div>${r.best?"<div><b>New best score!</b></div>":""}${r.xp?`<div class="note">+${r.xp} XP</div>`:""}<div class="actions"><button class="btn default" type="button" data-t48="new">Play again</button></div>`)}
  api.on(document,"keydown",e=>{if(!api.active()||e.ctrlKey||e.metaKey||e.altKey||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;const d=KEYS[e.key]||KEYS[e.key.toLowerCase()];if(d){e.preventDefault();move(d)}});
  let t0=null;
  api.on(board,"pointerdown",e=>{if(e.target.closest("button"))return;t0=[e.clientX,e.clientY]});
  api.on(board,"pointerup",e=>{if(!t0)return;const dx=e.clientX-t0[0],dy=e.clientY-t0[1];t0=null;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;move(Math.abs(dx)>Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up"))});
  api.on(board,"touchmove",e=>e.preventDefault(),{passive:false});
  const onNew=e=>{const b=e.target.closest("[data-t48]");if(!b)return;if(b.dataset.t48==="go"){b.closest(".t48-over").remove();return}
    // giving up partway still counts the score
    if(!over&&score>0&&tiles.length){const top=Math.max(...tiles.map(t=>t.v));if(top>(st.top||0))st.top=top;api.result({score,text:score.toLocaleString("en-US"),xp:Math.min(30,Math.round(score/400)),ch:{v:score,text:score.toLocaleString("en-US"),higher:true}})}
    clearTimeout(timer);busy=false;board.querySelectorAll(".t48-over").forEach(x=>x.remove());fresh()};
  api.on(api.root,"click",onNew);api.on(api.bar,"click",onNew);
  if(!api.seeded()&&load())draw();else fresh();
  return {unmount(){clearTimeout(timer)}};
}};
})();
