// Checkers (American rules) for the Atlas95 Game Vault: jumps are required, multi-jumps continue, men crown on the far row.
(()=>{
// board b[r][c]: 1 red man, 2 red king (you, moving up), -1 black man, -2 black king (computer, moving down)
const LEVELS={easy:{label:"Easy",depth:2,rand:.3},medium:{label:"Medium",depth:4,rand:.05},hard:{label:"Hard",depth:7,rand:0}};
const DRAW_PLIES=80;
const CSS=`
.ck-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.ck-msg{font-weight:700;min-height:1.4em;text-align:center}
.ck-board{display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);width:min(100%,440px,calc(100vh - 250px));min-width:240px;aspect-ratio:1;box-shadow:var(--sunken),0 0 0 2px #000;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.ck-sq{position:relative;border:0;padding:0;min-width:0;min-height:0;overflow:hidden;background:#f3ecc8;display:flex;align-items:center;justify-content:center}
.ck-sq.d{background:#6b4423;cursor:pointer}
.ck-sq.last{background:#8a6a2e}
.ck-sq.can::after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 0 2px #ffd800}
.ck-sq.dot::before{content:"";position:absolute;width:30%;height:30%;border-radius:50%;background:rgba(127,214,127,.9);box-shadow:0 0 0 2px #000;z-index:2}
.ck-sq:focus-visible{outline:2px dotted #fff;outline-offset:-4px}
.ck-p{width:78%;height:78%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(12px,3.4vw,22px);line-height:1;pointer-events:none}
.ck-p.r{background:#e00000;box-shadow:inset -2px -3px 0 rgba(0,0,0,.35),inset 2px 2px 0 rgba(255,255,255,.35),0 0 0 1px #000;color:#ffd800}
.ck-p.b{background:#202020;box-shadow:inset -2px -3px 0 rgba(0,0,0,.6),inset 2px 2px 0 rgba(255,255,255,.25),0 0 0 1px #000;color:#ffd800}
.ck-p.sel{outline:3px solid #ffd800;outline-offset:1px}
.ck-p.ghost{opacity:.3}`;
const sgn=x=>x>0?1:x<0?-1:0,inb=(r,c)=>r>=0&&r<8&&c>=0&&c<8;
function start(){const b=[...Array(8)].map(()=>Array(8).fill(0));for(let r=0;r<8;r++)for(let c=0;c<8;c++)if((r+c)%2){if(r<3)b[r][c]=-1;else if(r>4)b[r][c]=1}return b}
const dirsOf=p=>Math.abs(p)===2?[[-1,-1],[-1,1],[1,-1],[1,1]]:p>0?[[-1,-1],[-1,1]]:[[1,-1],[1,1]];
const crowns=(p,r)=>Math.abs(p)===1&&(p>0?r===0:r===7);
// every legal move for side: {path:[[r,c],...], caps:[[r,c],...]}; jumps are mandatory
function moves(b,side){const jumps=[],steps=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(sgn(p)!==side)continue;
    const found=[];b[r][c]=0;
    (function dfs(cr,cc,path,caps){let more=false;
      for(const [dr,dc] of dirsOf(p)){const mr=cr+dr,mc=cc+dc,lr=cr+2*dr,lc=cc+2*dc;
        if(!inb(lr,lc)||sgn(b[mr][mc])!==-side||b[lr][lc]!==0||caps.some(([x,y])=>x===mr&&y===mc))continue;
        more=true;const np=[...path,[lr,lc]],nc=[...caps,[mr,mc]];if(crowns(p,lr))found.push({path:np,caps:nc});else dfs(lr,lc,np,nc)}
      if(!more&&caps.length)found.push({path,caps})})(r,c,[[r,c]],[]);
    b[r][c]=p;jumps.push(...found);
    if(!found.length)for(const [dr,dc] of dirsOf(p)){const nr=r+dr,nc=c+dc;if(inb(nr,nc)&&b[nr][nc]===0)steps.push({path:[[r,c],[nr,nc]],caps:[]})}}
  return jumps.length?jumps:steps}
function apply(b,m){const [r0,c0]=m.path[0],[r1,c1]=m.path[m.path.length-1];let p=b[r0][c0];b[r0][c0]=0;m.caps.forEach(([r,c])=>b[r][c]=0);if(crowns(p,r1))p*=2;b[r1][c1]=p;return b}
const clone=b=>b.map(r=>r.slice());
function evalB(b,side){let s=0;for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(!p)continue;let v=Math.abs(p)===2?175:100+(p>0?7-r:r)*4;
  if(c>1&&c<6&&r>1&&r<6)v+=6;if(Math.abs(p)===1&&(p>0?r===7:r===0))v+=8;s+=sgn(p)*v}return s*side}
function negamax(b,depth,a,bb,side,ply){const ms=moves(b,side);if(!ms.length)return -1e5+ply;if(!depth)return evalB(b,side);
  ms.sort((x,y)=>y.caps.length-x.caps.length);let best=-Infinity;
  for(const m of ms){const v=-negamax(apply(clone(b),m),depth-1,-bb,-a,-side,ply+1);if(v>best)best=v;if(v>a)a=v;if(a>=bb)break}return best}
function aiPick(b,side,lvl){const L=LEVELS[lvl],ms=moves(b,side);if(ms.length===1)return ms[0];if(Math.random()<L.rand)return ms[Math.floor(Math.random()*ms.length)];
  let best=-Infinity,pick=[];for(const m of ms){const v=-negamax(apply(clone(b),m),L.depth-1,-Infinity,-best+1,-side,1);if(v>best){best=v;pick=[m]}else if(v===best)pick.push(m)}
  return pick[Math.floor(Math.random()*pick.length)]}
A95G.checkers={
help:`<div>Move your <b style="color:#c00000">red</b> pieces diagonally forward, one square at a time. Jump over an opponent's piece to capture it.</div>
<ul class="factlist"><li><b>Jumps are required.</b> If you can jump, you must. Pieces that can move are outlined in yellow.</li><li>After a jump, keep jumping if you can. The green dots show where to go next.</li><li>Reach the far side to become a <b>king</b> (♛). Kings move backward too.</li><li>Win by capturing every piece or leaving the other side with no moves.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.rec=st.rec||{};if(!LEVELS[st.lvl]&&st.lvl!=="2p")st.lvl="medium";
  let b,turn,over,busy,sel=null,prefix=null,legal=[],last=null,quiet=0,first=st.first===-1?-1:1,aiT=null;
  api.bar.innerHTML=`<button class="btn" type="button" data-ck="new">New game</button><select class="sel95" data-cklvl aria-label="Opponent">${Object.entries(LEVELS).map(([k,v])=>`<option value="${k}"${st.lvl===k?" selected":""}>vs Computer: ${v.label}</option>`).join("")}<option value="2p"${st.lvl==="2p"?" selected":""}>2 players</option></select>`;
  api.root.innerHTML=`<div class="ck-wrap"><div class="ck-msg" aria-live="polite"></div><div class="ck-board"></div></div>`;
  const board=api.root.querySelector(".ck-board"),msg=api.root.querySelector(".ck-msg");
  const vsAI=()=>st.lvl!=="2p",rec=()=>st.rec[st.lvl]||(st.rec[st.lvl]={w:0,l:0,d:0});
  const who=s=>vsAI()?(s===1?"You":"Computer"):(s===1?"Red":"Black");
  function status(){const n=s=>b.flat().filter(p=>sgn(p)===s).length,r=vsAI()?rec():null;api.status(r?`${LEVELS[st.lvl].label}: won ${r.w}, lost ${r.l}, drew ${r.d}`:"2 players",`Red ${n(1)} · Black ${n(-1)}`)}
  function draw(){const at=prefix?prefix[prefix.length-1]:null,opts=sel?legal.filter(m=>pre(m)):[],dots=new Set(opts.map(m=>m.path[prefix.length]).filter(Boolean).map(([r,c])=>r*8+c));
    const ghosts=new Set();if(prefix)opts.forEach(m=>m.caps.slice(0,prefix.length-1).forEach(([r,c])=>ghosts.add(r*8+c)));
    const can=new Set(!sel&&!busy&&!over&&!(vsAI()&&turn===-1)?legal.map(m=>m.path[0][0]*8+m.path[0][1]):[]);
    const lastSet=new Set(last?last.map(([r,c])=>r*8+c):[]);
    let h="";for(let r=0;r<8;r++)for(let c=0;c<8;c++){const i=r*8+c,d=(r+c)%2===1;let p=b[r][c];
      if(prefix&&r===prefix[0][0]&&c===prefix[0][1])p=0;if(at&&r===at[0]&&c===at[1])p=b[prefix[0][0]][prefix[0][1]];
      const piece=p?`<span class="ck-p ${p>0?"r":"b"}${at&&r===at[0]&&c===at[1]||(!prefix&&sel&&sel[0]===r&&sel[1]===c)?" sel":""}${ghosts.has(i)?" ghost":""}">${Math.abs(p)===2?"♛":""}</span>`:"";
      h+=d?`<button type="button" class="ck-sq d${lastSet.has(i)?" last":""}${can.has(i)?" can":""}${dots.has(i)?" dot":""}" data-r="${r}" data-c="${c}" aria-label="${"abcdefgh"[c]}${8-r}${p?(p>0?" red":" black")+(Math.abs(p)===2?" king":""):""}">${piece}</button>`:`<span class="ck-sq"></span>`}
    board.innerHTML=h}
  const pre=m=>prefix?prefix.every(([r,c],k)=>m.path[k]&&m.path[k][0]===r&&m.path[k][1]===c):(m.path[0][0]===sel[0]&&m.path[0][1]===sel[1]);
  function reset(){clearTimeout(aiT);b=start();over=false;busy=false;sel=null;prefix=null;last=null;quiet=0;turn=vsAI()?first:1;begin()}
  function begin(){legal=moves(b,turn);if(!legal.length){end(-turn);return}draw();status();
    if(vsAI()&&turn===-1){msg.textContent="Computer is thinking...";busy=true;draw();aiT=setTimeout(()=>{const m=aiPick(b,-1,st.lvl);busy=false;commit(m)},450);return}
    msg.textContent=(vsAI()?"Your turn":`${who(turn)}'s turn`)+(legal[0].caps.length?": you must jump!":".")}
  function commit(m){const moved=b[m.path[0][0]][m.path[0][1]];apply(b,m);last=[m.path[0],m.path[m.path.length-1]];sel=null;prefix=null;
    quiet=m.caps.length||Math.abs(moved)===1?0:quiet+1;api.sound(m.caps.length?"ding":"drop");
    if(quiet>=DRAW_PLIES){end(0);return}turn=-turn;begin()}
  function click(r,c){if(over||busy||vsAI()&&turn===-1)return;const p=b[r][c];
    if(prefix){const opts=legal.filter(pre),go=opts.filter(m=>m.path[prefix.length]&&m.path[prefix.length][0]===r&&m.path[prefix.length][1]===c);
      if(go.length){prefix=[...prefix,[r,c]];const done=go.find(m=>m.path.length===prefix.length);if(done){commit(done);return}draw();msg.textContent="Keep jumping!";return}
      if(prefix.length>1)return;prefix=null;sel=null}
    if(sgn(p)===turn&&legal.some(m=>m.path[0][0]===r&&m.path[0][1]===c)){sel=[r,c];prefix=[[r,c]];draw();return}
    if(sgn(p)===turn){msg.textContent=legal[0].caps.length?"You have to jump with a piece outlined in yellow.":"That piece can't move right now.";sel=null;prefix=null;draw();return}draw()}
  function end(w){over=true;draw();status();
    if(!vsAI()){msg.textContent=w?`${who(w)} wins!`:"It's a draw.";api.result({xp:2});api.sound(w?"win":"tap");return}
    let r;if(w===1){st.w=(st.w||0)+1;rec().w++;if(st.lvl==="hard")st.hardW=(st.hardW||0)+1;r=api.result({xp:({easy:6,medium:12,hard:25})[st.lvl]});msg.textContent=`You win!${r.xp?` +${r.xp} XP`:""}`;api.sound("win")}
    else if(w===-1){st.l=(st.l||0)+1;rec().l++;api.result({xp:2});msg.textContent="The computer wins. Try again!";api.sound("lose")}
    else{st.d=(st.d||0)+1;rec().d++;api.result({xp:4});msg.textContent="Draw: no captures for a long time."}
    first=-first;st.first=first;api.save();status();msg.insertAdjacentHTML("beforeend",` <button class="btn default" type="button" data-ck="new">Play again</button>`)}
  api.on(board,"click",e=>{const s=e.target.closest(".ck-sq.d");if(s)click(+s.dataset.r,+s.dataset.c)});
  api.on(api.root,"click",e=>{if(e.target.closest("[data-ck]"))reset()});
  api.on(api.bar,"click",e=>{if(e.target.closest("[data-ck]"))reset()});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-cklvl]")){st.lvl=e.target.value;api.save();reset()}});
  reset();
  return {unmount(){clearTimeout(aiT)}};
}};
})();
