// Snake for the Atlas95 Game Vault. Arrow keys / WASD, swipe, or the on-screen pad.
(()=>{
const N=20,CELL=16,SIZE=N*CELL;
const CSS=`
.sn-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.sn-screen{position:relative;background:#000;box-shadow:var(--sunken);padding:3px;width:min(100%,420px);touch-action:none}
.sn-screen canvas{display:block;width:100%;height:auto;image-rendering:pixelated}
.sn-msg{position:absolute;inset:3px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#80ff80;font:700 15px var(--ui);text-align:center;background:rgba(0,0,0,.55);padding:12px}
.sn-msg[hidden]{display:none}
.sn-msg big{font-size:26px;color:#fff}
.sn-msg small{font-weight:400;color:#c0ffc0;font-size:13px}
.sn-pad{display:grid;grid-template-columns:repeat(3,56px);grid-template-rows:repeat(2,48px);gap:4px}
.sn-pad .btn{font-size:18px;padding:0}
.sn-pad [data-d="up"]{grid-column:2}
.sn-pad [data-d="left"]{grid-column:1;grid-row:2}.sn-pad [data-d="down"]{grid-column:2;grid-row:2}.sn-pad [data-d="right"]{grid-column:3;grid-row:2}
@media (pointer:fine){.sn-pad{display:none}}`;
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const KEYS={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",s:"down",a:"left",d:"right",W:"up",S:"down",A:"left",D:"right"};

A95G.snake={
help:`<div>Steer the snake to eat the red apples. Each apple makes you longer and a little faster.</div>
<ul class="factlist"><li><b>Computer:</b> arrow keys or W A S D. Space pauses.</li><li><b>Phone:</b> swipe on the screen, or use the arrow pad.</li><li>Hitting your own tail ends the game. With <b>Walls: On</b>, so does hitting the edge. With walls off, you wrap around to the other side.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;if(st.walls==null)st.walls=true;
  api.bar.innerHTML=`<button class="btn" type="button" data-sn="new">New game</button><button class="btn" type="button" data-sn="walls" aria-pressed="${st.walls}">Walls: ${st.walls?"On":"Off"}</button>`;
  api.root.innerHTML=`<div class="sn-wrap"><div class="sn-screen"><canvas width="${SIZE}" height="${SIZE}" aria-label="Snake game board"></canvas><div class="sn-msg"></div></div>
    <div class="sn-pad"><button class="btn" type="button" data-d="up" aria-label="Up">▲</button><button class="btn" type="button" data-d="left" aria-label="Left">◀</button><button class="btn" type="button" data-d="down" aria-label="Down">▼</button><button class="btn" type="button" data-d="right" aria-label="Right">▶</button></div></div>`;
  const cv=api.root.querySelector("canvas"),cx=cv.getContext("2d"),msg=api.root.querySelector(".sn-msg"),screen=api.root.querySelector(".sn-screen");
  let snake,dir,queue,apple,apples,phase,timer=null,grow;
  const speed=()=>Math.max(55,135-apples*3);
  function reset(){const m=N>>1;snake=[[m,m],[m-1,m],[m-2,m]];dir="right";queue=[];apples=0;grow=0;placeApple();phase="ready";draw();
    show(`<big>Snake</big>${st.best?`Best: ${st.best} apple${st.best===1?"":"s"}`:""}<small>${matchMedia("(pointer:fine)").matches?"Press an arrow key to start":"Swipe or tap an arrow to start"}</small>`);status()}
  function placeApple(){const free=[];for(let x=0;x<N;x++)for(let y=0;y<N;y++)if(!snake.some(p=>p[0]===x&&p[1]===y))free.push([x,y]);apple=free[Math.floor(Math.random()*free.length)]}
  function show(h){msg.innerHTML=h;msg.hidden=!h}
  function status(){api.status(`Apples: ${apples}`,`Best: ${st.best||0}`)}
  function turn(d){if(phase==="over")return;const last=queue.length?queue[queue.length-1]:dir,[a,b]=DIRS[last],[c,e]=DIRS[d];if(a===-c&&b===-e||last===d)return;if(queue.length<3)queue.push(d);if(phase!=="run")start()}
  function start(){if(phase==="over")reset();phase="run";show("");clearTimeout(timer);timer=setTimeout(step,speed())}
  function pause(){if(phase!=="run")return;phase="pause";clearTimeout(timer);show(`<big>Paused</big><small>Press Space or tap to keep going</small>`)}
  function step(){if(phase!=="run")return;if(queue.length)dir=queue.shift();const [dx,dy]=DIRS[dir];let x=snake[0][0]+dx,y=snake[0][1]+dy;
    if(!st.walls){x=(x+N)%N;y=(y+N)%N}
    const hitWall=x<0||y<0||x>=N||y>=N,body=grow>0?snake:snake.slice(0,-1);
    if(hitWall||body.some(p=>p[0]===x&&p[1]===y)){over();return}
    snake.unshift([x,y]);if(grow>0)grow--;else snake.pop();
    if(x===apple[0]&&y===apple[1]){apples++;grow+=1;api.sound("eat");if(snake.length>=N*N){over(true);return}placeApple();status()}
    draw();timer=setTimeout(step,speed())}
  function over(won){phase="over";clearTimeout(timer);draw(true);api.sound(won?"win":"lose");
    const r=api.result(apples?{score:apples,text:`${apples} apple${apples===1?"":"s"}`,xp:Math.min(apples,25)}:{});
    show(`<big>${won?"You filled the board!":"Game over"}</big>${apples} apple${apples===1?"":"s"}${r.best?" · New best!":st.best?` · Best: ${st.best}`:""}${r.xp?`<small>+${r.xp} XP</small>`:""}<small>Press Space or tap to play again</small>`);status()}
  function draw(dead){cx.fillStyle="#000";cx.fillRect(0,0,SIZE,SIZE);
    cx.fillStyle="#0b1a0b";for(let x=0;x<N;x++)for(let y=0;y<N;y++)if((x+y)%2)cx.fillRect(x*CELL,y*CELL,CELL,CELL);
    if(st.walls){cx.strokeStyle="#2a6a2a";cx.lineWidth=2;cx.strokeRect(1,1,SIZE-2,SIZE-2)}
    cx.fillStyle="#ff3030";cx.fillRect(apple[0]*CELL+3,apple[1]*CELL+3,CELL-6,CELL-6);cx.fillStyle="#ff9a9a";cx.fillRect(apple[0]*CELL+4,apple[1]*CELL+4,3,3);
    snake.forEach((p,i)=>{cx.fillStyle=dead?(i?"#806020":"#c08030"):i?"#00c000":"#80ff80";cx.fillRect(p[0]*CELL+1,p[1]*CELL+1,CELL-2,CELL-2)});
    const [hx,hy]=snake[0],[dx,dy]=DIRS[dir];cx.fillStyle="#000";
    const ex=hx*CELL+CELL/2+dx*3,ey=hy*CELL+CELL/2+dy*3;cx.fillRect(ex-1+dy*3,ey-1+dx*3,3,3);cx.fillRect(ex-1-dy*3,ey-1-dx*3,3,3)}
  api.on(document,"keydown",e=>{if(!api.active()||e.ctrlKey||e.metaKey||e.altKey||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
    const d=KEYS[e.key];if(d){e.preventDefault();turn(d);return}
    if(e.key===" "){e.preventDefault();if(phase==="run")pause();else if(phase==="pause")start();else if(phase==="over")reset()}});
  let t0=null;
  api.on(screen,"pointerdown",e=>{t0=[e.clientX,e.clientY]});
  api.on(screen,"pointerup",e=>{if(!t0)return;const dx=e.clientX-t0[0],dy=e.clientY-t0[1];t0=null;
    if(Math.max(Math.abs(dx),Math.abs(dy))<20){if(phase==="run")pause();else if(phase==="pause")start();else if(phase==="over")reset();return}
    turn(Math.abs(dx)>Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up"))});
  api.on(screen,"touchmove",e=>e.preventDefault(),{passive:false});
  api.on(api.root,"click",e=>{const b=e.target.closest("[data-d]");if(b)turn(b.dataset.d)});
  api.on(api.bar,"click",e=>{const b=e.target.closest("[data-sn]");if(!b)return;
    if(b.dataset.sn==="walls"){st.walls=!st.walls;api.save();b.setAttribute("aria-pressed",st.walls);b.textContent=`Walls: ${st.walls?"On":"Off"}`}
    clearTimeout(timer);reset()});
  reset();
  return {pause,unmount(){clearTimeout(timer)}};
}};
})();
