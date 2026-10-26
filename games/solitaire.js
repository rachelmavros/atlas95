// Solitaire (Klondike) for the Atlas95 Game Vault. Tap a card to send it to the best spot, or drag it. Your game is saved.
(()=>{
const SUITS=["♠","♥","♦","♣"],RANKS=["","A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const red=c=>c.s===1||c.s===2;
const CSS=`
.sl-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.sl-board{position:relative;width:min(100%,720px);background:#008000;box-shadow:var(--sunken);touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;overflow:hidden}
.sl-slot{position:absolute;border-radius:5px;box-shadow:inset 0 0 0 1px #004000,inset 0 0 0 3px rgba(0,0,0,.12)}
.sl-slot.found::after{content:attr(data-s);position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.25);font-size:calc(var(--cw)*.5)}
.sl-slot.stock{cursor:pointer}
.sl-slot.stock::after{content:"↻";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.5);font-size:calc(var(--cw)*.5)}
.sl-c{position:absolute;width:var(--cw);height:var(--ch);border-radius:5px;background:#fff;box-shadow:0 0 0 1px #000;font-family:var(--ui);font-weight:700;color:#000;cursor:pointer;transition:left .14s ease-out,top .14s ease-out}
.sl-c.r{color:#c00000}
.sl-c .k{position:absolute;left:3px;top:2px;line-height:.95;font-size:max(11px,calc(var(--cw)*.24));text-align:center}
.sl-c .k i{display:block;font-style:normal;font-size:.9em}
.sl-c .m{position:absolute;right:4px;bottom:2px;font-size:calc(var(--cw)*.42);line-height:1}
.sl-c.back{background:repeating-linear-gradient(45deg,#000080 0 5px,#1084d0 5px 8px);box-shadow:0 0 0 1px #000,inset 0 0 0 3px #fff}
.sl-c.drag{transition:none;z-index:500!important;box-shadow:0 0 0 1px #000,3px 4px 0 rgba(0,0,0,.35)}
.sl-c.shake{animation:slshake .3s}
.sl-fx{position:absolute;inset:0;pointer-events:auto;cursor:pointer}
@keyframes slshake{25%,75%{margin-left:-4px}50%{margin-left:4px}}
@media (prefers-reduced-motion:reduce){.sl-c{transition:none}.sl-c.shake{animation:none}}`;
A95G.solitaire={
help:`<div>Build four piles in the top right, one per suit, from Ace up to King.</div>
<ul class="factlist"><li><b>Tap a card</b> to send it to the best place, or <b>drag</b> it where you want.</li><li>In the seven columns, stack cards downward in alternating colors (red 7 on black 8). Only a King can go in an empty column.</li><li>Tap the deck in the top left to turn over cards. When it runs out, tap it again to start over.</li><li><b>Draw 3</b> turns over three at a time and is harder. <b>Undo</b> takes back a move.</li><li>Your game is saved, so you can come back to it.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;const mo=api.modeOpts();if(mo&&mo.draw)st.draw=+mo.draw;st.draw=st.draw===3?3:1;st.bests=st.bests||{};
  let G,hist=[],t0=0,tick=null,drag=null,fx=null,cw=60,ch=84,gap=6,fan={};
  api.bar.innerHTML=`<button class="btn" type="button" data-sl="new">New game</button><button class="btn" type="button" data-sl="undo">Undo</button><select class="sel95" data-sldraw aria-label="Draw">${[1,3].map(n=>`<option value="${n}"${st.draw===n?" selected":""}>Draw ${n}</option>`).join("")}</select><button class="btn" type="button" data-sl="auto" hidden>Auto finish</button>`;
  api.root.innerHTML=`<div class="sl-wrap"><div class="sl-board" role="application" aria-label="Solitaire"></div><div class="note" aria-live="polite" id="slnote"></div></div>`;
  const board=api.root.querySelector(".sl-board"),note=api.root.querySelector("#slnote");
  // ---- game state ----
  function deal(){const deck=[];for(let s=0;s<4;s++)for(let r=1;r<=13;r++)deck.push({s,r,up:false});const d=api.shuffle(deck,api.begin({draw:st.draw}));
    const tab=[...Array(7)].map((_,i)=>{const p=d.splice(0,i+1);p[i].up=true;return p});
    G={draw:st.draw,stock:d,waste:[],found:[[],[],[],[]],tab,moves:0,ms:0,done:false};hist=[];t0=0;clearInterval(tick);save();layout();status();note.textContent=""}
  const snap=()=>JSON.stringify(G);
  function save(){st.game=G.done?null:Object.assign({},G,{ms:G.ms+(t0?Date.now()-t0:0)});api.save()}
  function load(){const g=st.game;if(!g||!g.tab)return false;G=g;G.done=false;return true}
  function clock(){if(!t0){t0=Date.now();tick=setInterval(status,1000)}}
  const elapsed=()=>G.ms+(t0?Date.now()-t0:0);
  function status(){api.status(`Draw ${G.draw} · Moves: ${G.moves}`,`Time: ${api.fmtTime(elapsed())}`)}
  const topOf=a=>a[a.length-1];
  const fits=(c,f)=>f.length?topOf(f).s===c.s&&c.r===topOf(f).r+1:c.r===1;
  const onto=(c,t)=>t.length?topOf(t).up&&red(topOf(t))!==red(c)&&topOf(t).r===c.r+1:c.r===13;
  function pile(src){return src.t==="w"?G.waste:src.t==="f"?G.found[src.i]:G.tab[src.i]}
  // src: {t:"w"|"t"|"f", i, n(cards moved)}; dst: {t:"t"|"f", i}
  function legal(src,dst){const from=pile(src),cards=from.slice(from.length-src.n);if(!cards.length||!cards[0].up)return false;
    if(dst.t==="f")return src.n===1&&!(src.t==="f"&&src.i===dst.i)&&fits(cards[0],G.found[dst.i]);
    return !(src.t==="t"&&src.i===dst.i)&&onto(cards[0],G.tab[dst.i])}
  function move(src,dst,quiet){if(!legal(src,dst))return false;hist.push(snap());if(hist.length>200)hist.shift();clock();
    const from=pile(src),cards=from.splice(from.length-src.n);(dst.t==="f"?G.found[dst.i]:G.tab[dst.i]).push(...cards);
    if(src.t==="t"&&from.length&&!topOf(from).up)topOf(from).up=true;G.moves++;if(!quiet)api.sound(dst.t==="f"?"ding":"flip");after();return true}
  function drawStock(){hist.push(snap());clock();
    if(!G.stock.length){if(!G.waste.length){hist.pop();return}G.stock=G.waste.reverse().map(c=>(c.up=false,c));G.waste=[];api.sound("tap")}
    else{const n=Math.min(G.draw,G.stock.length);for(let k=0;k<n;k++){const c=G.stock.pop();c.up=true;G.waste.push(c)}api.sound("flip")}
    G.moves++;after()}
  function after(){save();layout();status();
    const canAuto=!G.stock.length&&!G.waste.length&&G.tab.every(p=>p.every(c=>c.up));api.bar.querySelector("[data-sl=auto]").hidden=!canAuto||G.done;
    if(G.found.every(f=>f.length===13))win()}
  // the best place for a tapped card: a foundation, else a column that already has cards, else an empty column
  function autoDst(src){if(src.n===1)for(let i=0;i<4;i++)if(legal(src,{t:"f",i}))return {t:"f",i};
    const order=[...Array(7).keys()].sort((a,b)=>(G.tab[b].length?1:0)-(G.tab[a].length?1:0));for(const i of order)if(legal(src,{t:"t",i}))return {t:"t",i};return null}
  function undo(){if(!hist.length||G.done)return;const ms=elapsed();G=JSON.parse(hist.pop());G.ms=ms;t0=t0?Date.now():0;G.moves++;save();layout();status();api.sound("tap")}
  // ---- layout ----
  function measure(){const w=board.clientWidth||600;gap=Math.max(4,Math.round(w*.014));cw=Math.floor((w-gap*8)/7);ch=Math.round(cw*1.4);board.style.setProperty("--cw",cw+"px");board.style.setProperty("--ch",ch+"px")}
  const colX=i=>gap+i*(cw+gap);
  function layout(){measure();const top=gap,tabY=gap*2+ch,maxH=Math.max(ch*3,(innerHeight||800)-250-tabY);
    let h="";h+=`<div class="sl-slot stock" style="left:${colX(0)}px;top:${top}px;width:${cw}px;height:${ch}px" data-stock></div>`;
    for(let i=0;i<4;i++)h+=`<div class="sl-slot found" data-s="${SUITS[i]}" style="left:${colX(3+i)}px;top:${top}px;width:${cw}px;height:${ch}px" data-fslot="${i}"></div>`;
    for(let i=0;i<7;i++)h+=`<div class="sl-slot" style="left:${colX(i)}px;top:${tabY}px;width:${cw}px;height:${ch}px" data-tslot="${i}"></div>`;
    let z=1;const card=(c,x,y,attrs)=>`<div class="sl-c${c.up?"":" back"}${c.up&&red(c)?" r":""}" style="left:${x}px;top:${y}px;z-index:${z++}" ${attrs} aria-label="${c.up?RANKS[c.r]+" of "+["spades","hearts","diamonds","clubs"][c.s]:"face-down card"}">${c.up?`<span class="k">${RANKS[c.r]}<i>${SUITS[c.s]}</i></span><span class="m">${SUITS[c.s]}</span>`:""}</div>`;
    if(G.stock.length)h+=card(G.stock[G.stock.length-1],colX(0),top,"data-stock");
    const wshow=G.waste.slice(G.draw===3?-3:-1),wo=Math.round(cw*.22);
    wshow.forEach((c,k)=>{const last=k===wshow.length-1;h+=card(c,colX(1)+k*wo,top,last?`data-src="w"`:"")});
    G.found.forEach((f,i)=>{if(f.length)h+=card(topOf(f),colX(3+i),top,`data-src="f${i}"`)});
    let bottom=tabY+ch;
    G.tab.forEach((p,i)=>{const down=p.filter(c=>!c.up).length,upn=p.length-down;let od=Math.round(cw*.16),ou=Math.round(cw*.36);
      const need=down*od+Math.max(0,upn-1)*ou;if(need>maxH-ch){const k=(maxH-ch)/need;od=Math.max(4,Math.floor(od*k));ou=Math.max(10,Math.floor(ou*k))}
      let y=tabY;fan[i]={od,ou};p.forEach((c,k)=>{h+=card(c,colX(i),y,c.up?`data-src="t${i}" data-k="${k}"`:"");y+=c.up?ou:od});bottom=Math.max(bottom,y-(p.length?(topOf(p).up?ou:od):0)+ch)});
    bottom=Math.max(bottom,tabY+ch*2.6);board.style.height=bottom+gap+"px";board.innerHTML=h;if(fx)board.appendChild(fx.cv)}
  // ---- input ----
  function srcOf(el){const s=el.dataset.src;if(!s)return null;if(s==="w")return {t:"w",n:1};if(s[0]==="f")return {t:"f",i:+s[1],n:1};const i=+s.slice(1);return {t:"t",i,n:G.tab[i].length-(+el.dataset.k)}}
  function dropAt(x,y){const b=board.getBoundingClientRect(),bx=x-b.left,by=y-b.top,col=Math.max(0,Math.min(6,Math.floor((bx-gap/2)/(cw+gap))));
    if(by<gap*1.5+ch&&col>=3)return {t:"f",i:col-3};return by>gap+ch*.6?{t:"t",i:col}:null}
  api.on(board,"pointerdown",e=>{if(fx){stopFx();return}if(e.button>0||G.done)return;const el=e.target.closest(".sl-c,[data-stock]");if(!el)return;
    if(el.hasAttribute("data-stock")){drawStock();return}const src=srcOf(el);if(!src)return;e.preventDefault();
    const els=[...board.querySelectorAll(".sl-c")].filter(c=>{const s=srcOf(c);return s&&s.t===src.t&&s.i===src.i&&s.n<=src.n});
    drag={src,els,x0:e.clientX,y0:e.clientY,on:false,el};try{board.setPointerCapture(e.pointerId)}catch(_){}});
  api.on(board,"pointermove",e=>{if(!drag)return;const dx=e.clientX-drag.x0,dy=e.clientY-drag.y0;if(!drag.on&&Math.hypot(dx,dy)<6)return;drag.on=true;
    drag.els.forEach(c=>{c.classList.add("drag");c.style.transform=`translate(${dx}px,${dy}px)`})});
  const endDrag=e=>{const d=drag;drag=null;if(!d)return;
    if(!d.on){const dst=autoDst(d.src);if(!dst||!move(d.src,dst)){d.el.classList.remove("shake");void d.el.offsetWidth;d.el.classList.add("shake")}return}
    const top=d.els[0].getBoundingClientRect(),dst=dropAt(top.left+top.width/2,top.top+top.height/3);
    if(!(dst&&move(d.src,dst)))layout()};
  api.on(board,"pointerup",endDrag);api.on(board,"pointercancel",()=>{drag=null;layout()});
  api.on(board,"touchmove",e=>{if(drag)e.preventDefault()},{passive:false});
  api.on(api.bar,"click",e=>{const b=e.target.closest("[data-sl]");if(!b)return;const k=b.dataset.sl;
    if(k==="new"){stopFx();deal()}else if(k==="undo")undo();else if(k==="auto")autoFinish()});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-sldraw]")){st.draw=+e.target.value;api.save();stopFx();deal()}});
  api.on(window,"resize",()=>{if(!drag)layout()});
  function autoFinish(){const go=()=>{if(G.done)return;for(let i=0;i<7;i++){if(G.tab[i].length){const src={t:"t",i,n:1};const dst=autoDst(src);if(dst&&dst.t==="f"){move(src,dst,true);setTimeout(go,api.reduced()?0:70);return}}}};go()}
  // ---- winning: the classic bouncing cards ----
  function win(){G.done=true;clearInterval(tick);const ms=elapsed(),k="d"+G.draw,prev=st.bests[k],nb=prev==null||ms<prev;if(nb)st.bests[k]=ms;
    st.wins=(st.wins||0)+1;st.game=null;const r=api.result({xp:G.draw===3?25:15,ch:{v:ms,text:api.fmtTime(ms),higher:false}});api.sound("win");api.bar.querySelector("[data-sl=auto]").hidden=true;
    if(nb&&prev!=null)api.toast(`<span class="gmtemo">🏆</span><span><b>New best in Solitaire!</b><br>Draw ${G.draw}: ${api.fmtTime(ms)}</span>`);
    note.innerHTML=`<b>You won!</b> ${api.fmtTime(ms)} &middot; ${G.moves} moves${nb?" &middot; best time!":""}${r.xp?` &middot; +${r.xp} XP`:""} <button class="btn default" type="button" data-sl2="new">Deal again</button>`;
    status();if(!api.reduced())bounce()}
  api.on(note,"click",e=>{if(e.target.closest("[data-sl2]")){stopFx();deal()}});
  function cardImg(c){const cv=document.createElement("canvas");cv.width=cw;cv.height=ch;const x=cv.getContext("2d");x.fillStyle="#fff";x.strokeStyle="#000";x.lineWidth=1;
    x.beginPath();x.roundRect?x.roundRect(.5,.5,cw-1,ch-1,5):x.rect(.5,.5,cw-1,ch-1);x.fill();x.stroke();x.fillStyle=red(c)?"#c00000":"#000";
    x.font=`700 ${Math.max(11,cw*.24)}px Tahoma,Verdana,sans-serif`;x.textBaseline="top";x.fillText(RANKS[c.r],3,3);x.fillText(SUITS[c.s],3,3+cw*.24);
    x.font=`700 ${cw*.42}px Tahoma,Verdana,sans-serif`;x.textAlign="right";x.textBaseline="bottom";x.fillText(SUITS[c.s],cw-4,ch-2);return cv}
  function bounce(){const cv=document.createElement("canvas"),W=board.clientWidth,H=board.clientHeight;cv.width=W;cv.height=H;cv.className="sl-fx";const x=cv.getContext("2d");
    const queue=[];for(let r=13;r>=1;r--)for(let i=0;i<4;i++)queue.push({c:{s:i,r},i});let cur=null,raf=0,lastSpawn=0;
    fx={cv,stop:()=>cancelAnimationFrame(raf)};board.appendChild(cv);
    const stepF=t=>{if(!cur||cur.x<-cw||cur.x>W){if(!queue.length){stopFx();return}const q=queue.shift();cur={img:cardImg(q.c),x:colX(3+q.i),y:gap,vx:(Math.random()<.5?-1:1)*(2+Math.random()*3),vy:-Math.random()*4}}
      cur.vy+=.5;cur.x+=cur.vx;cur.y+=cur.vy;if(cur.y+ch>H){cur.y=H-ch;cur.vy*=-.78}x.drawImage(cur.img,cur.x,cur.y);raf=requestAnimationFrame(stepF)};raf=requestAnimationFrame(stepF)}
  function stopFx(){if(!fx)return;fx.stop();fx.cv.remove();fx=null}
  if(api.seeded()||!load())deal();else{layout();status();after()}
  return {pause(){if(t0){G.ms+=Date.now()-t0;t0=0;clearInterval(tick);save()}},unmount(){if(t0){G.ms+=Date.now()-t0;t0=0;save()}clearInterval(tick);stopFx()}};
}};
})();
