// Connect Four for the Atlas95 Game Vault: you (red) against the computer (yellow), or two players on one device.
(()=>{
const W=7,H=6;
const CSS=`
.c4-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.c4-board{display:grid;grid-template-columns:repeat(7,1fr);gap:0;background:#1040c0;box-shadow:var(--raised),0 0 0 1px #000;padding:6px;width:min(100%,440px);touch-action:manipulation}
.c4-col{display:grid;grid-template-rows:repeat(7,auto);grid-template-columns:100%;min-width:0;border:0;background:none;padding:0 2px;cursor:pointer}
.c4-col:disabled{cursor:default}
.c4-col:focus-visible{outline:2px dotted #fff;outline-offset:-2px}
.c4-cell{display:block;width:100%;aspect-ratio:1;border-radius:50%;margin:3px 0;background:#fff;box-shadow:inset 2px 2px 0 rgba(0,0,0,.35);position:relative}
.c4-cell.hint{background:none;box-shadow:none;margin:0 0 3px}
.c4-col:not(:disabled):hover .c4-cell.hint,.c4-col:focus-visible .c4-cell.hint{background:var(--c4you);opacity:.55;box-shadow:inset 0 0 0 1px #000}
.c4-cell.r{background:#e00000;box-shadow:inset -2px -2px 0 rgba(0,0,0,.3),0 0 0 1px #000}
.c4-cell.y{background:#ffd800;box-shadow:inset -2px -2px 0 rgba(0,0,0,.2),0 0 0 1px #000}
.c4-cell.drop{animation:c4drop .3s cubic-bezier(.4,0,1,1)}
.c4-cell.win::after{content:"";position:absolute;inset:28%;border-radius:50%;background:#fff;box-shadow:0 0 0 2px #000}
@keyframes c4drop{from{transform:translateY(var(--c4from))}to{transform:none}}
.c4-msg{font-weight:700;min-height:1.4em;text-align:center}
@media (prefers-reduced-motion:reduce){.c4-cell.drop{animation:none}}`;
const LEVELS={easy:{label:"Easy",depth:2,rand:.35},medium:{label:"Medium",depth:4,rand:.08},hard:{label:"Hard",depth:8,rand:0}};
const ORDER=[3,2,4,1,5,0,6];
// board: b[c][r], r=0 is the bottom row; 1 = red, 2 = yellow
const top=(b,c)=>b[c].indexOf(0);
function lines(b,p){const out=[];for(let c=0;c<W;c++)for(let r=0;r<H;r++)for(const [dc,dr] of [[1,0],[0,1],[1,1],[1,-1]]){const cs=[];for(let k=0;k<4;k++){const x=c+dc*k,y=r+dr*k;if(x<0||x>=W||y<0||y>=H)break;cs.push([x,y])}if(cs.length===4&&cs.every(([x,y])=>b[x][y]===p))out.push(cs)}return out}
function winner(b){for(const p of [1,2])if(lines(b,p).length)return p;return 0}
function evalBoard(b,me){const op=3-me;let s=0;for(let r=0;r<H;r++){if(b[3][r]===me)s+=3;else if(b[3][r]===op)s-=3}
  for(let c=0;c<W;c++)for(let r=0;r<H;r++)for(const [dc,dr] of [[1,0],[0,1],[1,1],[1,-1]]){const ex=c+dc*3,ey=r+dr*3;if(ex<0||ex>=W||ey<0||ey>=H)continue;let m=0,o=0;
    for(let k=0;k<4;k++){const v=b[c+dc*k][r+dr*k];if(v===me)m++;else if(v===op)o++}
    if(m&&!o)s+=m===3?5:m===2?2:0;else if(o&&!m)s-=o===3?6:o===2?2:0}
  return s}
// would p dropping into (c,r) make four? (the cell itself is still empty)
function isWin(b,c,r,p){for(const [dc,dr] of [[1,0],[0,1],[1,1],[1,-1]]){let n=1;for(const s of [1,-1]){let x=c+dc*s,y=r+dr*s;while(x>=0&&x<W&&y>=0&&y<H&&b[x][y]===p){n++;x+=dc*s;y+=dr*s}}if(n>=4)return true}return false}
// score for p, who is about to move
function negamax(b,depth,a,bb,p,ply){let any=false;
  for(const c of ORDER){const r=top(b,c);if(r<0)continue;any=true;if(isWin(b,c,r,p))return 1e6-ply}
  if(!any)return 0;if(!depth)return evalBoard(b,p);
  let best=-Infinity;for(const c of ORDER){const r=top(b,c);if(r<0)continue;b[c][r]=p;const v=-negamax(b,depth-1,-bb,-a,3-p,ply+1);b[c][r]=0;if(v>best)best=v;if(v>a)a=v;if(a>=bb)break}
  return best}
function aiMove(b,p,lvl){const L=LEVELS[lvl],open=ORDER.filter(c=>top(b,c)>=0);
  for(const c of open)if(isWin(b,c,top(b,c),p))return c;
  if(Math.random()<L.rand)return open[Math.floor(Math.random()*open.length)];
  let best=-Infinity,pick=open[0];for(const c of open){const r=top(b,c);b[c][r]=p;const v=-negamax(b,L.depth-1,-Infinity,-best,3-p,1);b[c][r]=0;if(v>best){best=v;pick=c}}
  return pick}
A95G.connect4={
help:`<div>Take turns dropping discs into the columns. The first to get <b>four in a row</b> wins: across, up and down, or diagonally.</div>
<ul class="factlist"><li>Click or tap a column to drop your disc. On a keyboard, press 1 to 7.</li><li>You're <b style="color:#c00000">red</b>. Against the computer, who goes first switches every game.</li><li>Pick <b>2 players</b> to play a friend on the same screen.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.lvl=st.lvl||"medium";if(LEVELS[st.lvl]==null&&st.lvl!=="2p")st.lvl="medium";
  let b,turn,over,busy,first=st.first===2?2:1,aiT=null;
  api.bar.innerHTML=`<button class="btn" type="button" data-c4="new">New game</button><select class="sel95" data-c4lvl aria-label="Opponent">${Object.entries(LEVELS).map(([k,v])=>`<option value="${k}"${st.lvl===k?" selected":""}>vs Computer: ${v.label}</option>`).join("")}<option value="2p"${st.lvl==="2p"?" selected":""}>2 players</option></select>`;
  api.root.innerHTML=`<div class="c4-wrap"><div class="c4-msg" aria-live="polite"></div><div class="c4-board"></div></div>`;
  const board=api.root.querySelector(".c4-board"),msg=api.root.querySelector(".c4-msg");
  const vsAI=()=>st.lvl!=="2p";
  const name=p=>vsAI()?(p===1?"You":"Computer"):(p===1?"Red":"Yellow");
  function status(){api.status(vsAI()?`${LEVELS[st.lvl].label}: won ${st.w||0}, lost ${st.l||0}, drew ${st.d||0}`:"2 players","")}
  function draw(last,wins){board.style.setProperty("--c4you",turn===1?"#e00000":"#ffd800");
    board.innerHTML=[...Array(W)].map((_,c)=>`<button type="button" class="c4-col" data-c="${c}" aria-label="Column ${c+1}"${over||busy||top(b,c)<0?" disabled":""}><span class="c4-cell hint"></span>${[...Array(H)].map((_,k)=>{const r=H-1-k,v=b[c][r],isLast=last&&last[0]===c&&last[1]===r,w=wins&&wins.some(([x,y])=>x===c&&y===r);
      return `<span class="c4-cell${v===1?" r":v===2?" y":""}${isLast&&!api.reduced()?" drop":""}${w?" win":""}"${isLast?` style="--c4from:-${(H-r)*112}%"`:""}></span>`}).join("")}</button>`).join("")}
  function reset(){clearTimeout(aiT);b=[...Array(W)].map(()=>Array(H).fill(0));over=false;busy=false;turn=vsAI()?first:1;draw();status();
    if(vsAI()&&turn===2){msg.textContent="Computer goes first...";ai()}else msg.textContent=vsAI()?"Your turn: drop a red disc.":"Red's turn.";
    const c=board.querySelector(".c4-col:not(:disabled)");if(c&&matchMedia("(pointer:fine)").matches)c.focus({preventScroll:true})}
  function play(c){if(over||busy)return;const r=top(b,c);if(r<0)return;b[c][r]=turn;api.sound("drop");
    const w=winner(b);if(w){end(w,[c,r]);return}if(ORDER.every(x=>top(b,x)<0)){end(0,[c,r]);return}
    turn=3-turn;draw([c,r]);
    if(vsAI()&&turn===2){msg.textContent="Computer is thinking...";ai()}else msg.textContent=vsAI()?"Your turn.":`${name(turn)}'s turn.`}
  function ai(){busy=true;draw();aiT=setTimeout(()=>{const c=aiMove(b,2,st.lvl);busy=false;play(c);
    const f=board.querySelector(`.c4-col[data-c="${c}"]`)||board.querySelector(".c4-col:not(:disabled)");if(f&&!over&&matchMedia("(pointer:fine)").matches)f.focus({preventScroll:true})},420)}
  function end(w,last){over=true;draw(last,w?lines(b,w).flat():null);
    if(!vsAI()){msg.textContent=w?`${name(w)} wins!`:"It's a draw.";api.sound(w?"win":"tap");api.result({xp:2});status();return}
    let r;if(w===1){st.w=(st.w||0)+1;if(st.lvl==="hard")st.hardW=(st.hardW||0)+1;r=api.result({xp:({easy:5,medium:10,hard:20})[st.lvl]});msg.textContent=`You win!${r.xp?` +${r.xp} XP`:""}`;api.sound("win")}
    else if(w===2){st.l=(st.l||0)+1;r=api.result({xp:2});msg.textContent="The computer wins. Try again!";api.sound("lose")}
    else{st.d=(st.d||0)+1;r=api.result({xp:4});msg.textContent="It's a draw."}
    first=3-first;st.first=first;api.save();status();
    msg.insertAdjacentHTML("beforeend",` <button class="btn default" type="button" data-c4="new">Play again</button>`)}
  api.on(api.root,"click",e=>{const col=e.target.closest(".c4-col");if(col&&!col.disabled){play(+col.dataset.c);return}if(e.target.closest("[data-c4]"))reset()});
  api.on(api.bar,"click",e=>{if(e.target.closest("[data-c4]"))reset()});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-c4lvl]")){st.lvl=e.target.value;api.save();reset()}});
  api.on(document,"keydown",e=>{if(!api.active()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;const n=+e.key;if(n>=1&&n<=7){e.preventDefault();if(!(vsAI()&&turn===2))play(n-1)}});
  reset();
  return {unmount(){clearTimeout(aiT)}};
}};
})();
