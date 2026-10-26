// Flappy Globe for the Atlas95 Game Vault: tap, click or press Space to flap through the gaps.
(()=>{
const W=320,H=480,GROUND=52,R=13,GAP=128,SPACING=176,PIPE=54;
const CSS=`
.fg-wrap{display:flex;flex-direction:column;align-items:center}
.fg-screen{position:relative;width:min(100%,360px,calc((100vh - 230px)*.6667));min-width:220px;box-shadow:var(--sunken);padding:2px;background:#000;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;cursor:pointer}
.fg-screen canvas{display:block;width:100%;height:auto}
.fg-msg{position:absolute;left:12px;right:12px;top:54%;text-align:center;pointer-events:none}
.fg-msg[hidden]{display:none}
.fg-msg .dlg{width:auto;pointer-events:auto}
.fg-msg .dlg-body{padding:10px;gap:6px;align-items:center}
.fg-msg big{font-size:22px;font-weight:700}`;
A95G.flappy={
help:`<div>Keep the globe in the air and fly it through the gaps between the pillars. Each gap you clear is a point.</div>
<ul class="factlist"><li><b>Flap:</b> tap the screen, click, or press Space or the up arrow.</li><li>Gravity pulls you down, so flap in short taps rather than all at once.</li><li>Touching a pillar, the ground or the sky ends the run.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;
  api.bar.innerHTML=`<button class="btn" type="button" data-fg="new">New game</button>`;
  api.root.innerHTML=`<div class="fg-wrap"><div class="fg-screen" role="button" tabindex="0" aria-label="Flap"><canvas width="${W*2}" height="${H*2}"></canvas><div class="fg-msg"></div></div></div>`;
  const cv=api.root.querySelector("canvas"),cx=cv.getContext("2d"),msg=api.root.querySelector(".fg-msg"),screen=api.root.querySelector(".fg-screen");cx.scale(2,2);
  let y,vy,pipes,score,phase,raf=null,last=0,dist,ang,ground=0,clouds,rnd=Math.random;
  function reset(){rnd=api.begin({});y=H*.42;vy=0;pipes=[];score=0;dist=0;ang=0;phase="ready";
    clouds=[...Array(5)].map((_,i)=>({x:i*80+Math.random()*40,y:30+Math.random()*180,s:.6+Math.random()*.7}));
    show(`<big>Flappy Globe</big><div>${matchMedia("(pointer:fine)").matches?"Click or press Space to flap":"Tap to flap"}</div>${st.best?`<div class="note">Best: ${st.best}</div>`:""}`);status();draw();loop()}
  function show(h){msg.innerHTML=h?`<div class="dlg"><div class="dlg-body">${h}</div></div>`:"";msg.hidden=!h}
  function status(){api.status(`Score: ${score}`,`Best: ${st.best||0}`)}
  function flap(){if(phase==="over"){if(performance.now()-dist>500)reset();return}
    if(phase!=="run"){phase="run";show("");last=performance.now()}vy=-7.4}
  function spawn(){const lo=70,hi=H-GROUND-GAP-70;pipes.push({x:W+20,top:lo+rnd()*(hi-lo),done:false})}
  function speed(){return 2.3+Math.min(score,40)*.025}
  // k = how many 60fps frames this step covers, so motion is the same speed on 60Hz and 120Hz screens
  function step(k){vy=Math.min(vy+.42*k,10);y+=vy*k;ang=Math.max(-.5,Math.min(1.2,vy/9));ground=(ground+speed()*k)%24;
    clouds.forEach(c=>{c.x-=c.s*.5*k;if(c.x<-60){c.x=W+30;c.y=30+Math.random()*180}});
    if(!pipes.length||pipes[pipes.length-1].x<W-SPACING)spawn();
    pipes.forEach(p=>{p.x-=speed()*k;if(!p.done&&p.x+PIPE<W*.3-R){p.done=true;score++;status()}});
    pipes=pipes.filter(p=>p.x>-PIPE-10);
    const bx=W*.3;if(y+R>H-GROUND||y-R<0)return over();
    for(const p of pipes){if(bx+R>p.x+3&&bx-R<p.x+PIPE-3&&(y-R<p.top||y+R>p.top+GAP))return over()}}
  function over(){phase="over";dist=performance.now();setTimeout(()=>api.sound("lose"),0);
    const txt=`${score} gap${score===1?"":"s"}`,r=api.result(Object.assign(score?{score,text:txt,xp:Math.min(score*2,25)}:{},{ch:{v:score,text:txt,higher:true}}));
    show(`<big>${score}</big><div>${score===1?"gap":"gaps"} cleared${r.best?" &middot; <b>New best!</b>":st.best?` &middot; Best: ${st.best}`:""}</div>${r.xp?`<div class="note">+${r.xp} XP</div>`:""}<button class="btn default" type="button" data-fg="new">Play again</button>`);status()}
  function loop(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function f(t){
    if(phase==="run"){const k=Math.max(0,Math.min(100,t-last))/(1000/60),n=Math.ceil(k);last=t;for(let i=0;i<n&&phase==="run";i++)step(k/n)}
    else if(phase==="ready"){y=H*.42+Math.sin(t/260)*6;ground=(ground+1.2)%24}
    draw();if(phase!=="over")raf=requestAnimationFrame(f)})}
  function pillar(x,y0,h,capTop){cx.fillStyle="#c0c0c0";cx.fillRect(x,y0,PIPE,h);cx.fillStyle="#fff";cx.fillRect(x,y0,3,h);cx.fillStyle="#808080";cx.fillRect(x+PIPE-4,y0,4,h);
    const cy=capTop?y0+h-18:y0;cx.fillStyle="#c0c0c0";cx.fillRect(x-4,cy,PIPE+8,18);cx.fillStyle="#fff";cx.fillRect(x-4,cy,PIPE+8,2);cx.fillRect(x-4,cy,2,18);cx.fillStyle="#404040";cx.fillRect(x-4,cy+16,PIPE+8,2);cx.fillRect(x+PIPE+2,cy,2,18);
    cx.strokeStyle="#000";cx.lineWidth=1;cx.strokeRect(x-3.5,cy+.5,PIPE+7,17)}
  const sky=cx.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#1084d0");sky.addColorStop(1,"#8fd8ff");
  function draw(){cx.fillStyle=sky;cx.fillRect(0,0,W,H);
    cx.fillStyle="rgba(255,255,255,.85)";clouds.forEach(c=>{cx.fillRect(c.x,c.y,44*c.s,10*c.s);cx.fillRect(c.x+10*c.s,c.y-8*c.s,24*c.s,10*c.s)});
    pipes.forEach(p=>{pillar(p.x,0,p.top,true);pillar(p.x,p.top+GAP,H-GROUND-p.top-GAP,false)});
    cx.fillStyle="#008080";cx.fillRect(0,H-GROUND,W,GROUND);cx.fillStyle="#006060";for(let x=-ground;x<W;x+=24)cx.fillRect(x,H-GROUND,12,6);cx.fillStyle="#000";cx.fillRect(0,H-GROUND,W,2);
    const bx=W*.3;cx.save();cx.translate(bx,y);cx.rotate(ang);
    cx.fillStyle="#3a6ea5";cx.strokeStyle="#000";cx.lineWidth=2;cx.beginPath();cx.arc(0,0,R,0,Math.PI*2);cx.fill();cx.stroke();
    cx.strokeStyle="#7fd67f";cx.lineWidth=3.5;cx.beginPath();cx.moveTo(-7,-6);cx.bezierCurveTo(-2,-8,0,-3,-2,1);cx.bezierCurveTo(-4,5,2,5,3,9);cx.moveTo(3,-11);cx.bezierCurveTo(4,-6,9,-6,10,-2);cx.stroke();
    cx.strokeStyle="#fc0";cx.lineWidth=2;cx.beginPath();cx.moveTo(-12,-1);cx.quadraticCurveTo(0,3,12,-1);cx.stroke();
    const wy=Math.sin(performance.now()/(phase==="run"&&vy<0?40:120))*4;cx.fillStyle="#fff";cx.strokeStyle="#000";cx.lineWidth=1.2;cx.beginPath();cx.moveTo(-10,1);cx.lineTo(-22,-3+wy);cx.lineTo(-16,6);cx.closePath();cx.fill();cx.stroke();
    cx.fillStyle="#fff";cx.beginPath();cx.arc(5,-4,3.5,0,Math.PI*2);cx.fill();cx.stroke();cx.fillStyle="#000";cx.beginPath();cx.arc(6,-4,1.6,0,Math.PI*2);cx.fill();cx.restore();
    if(phase==="run"){cx.font="700 34px Tahoma,Verdana,sans-serif";cx.textAlign="center";cx.lineWidth=5;cx.strokeStyle="#000";cx.strokeText(score,W/2,58);cx.fillStyle="#fff";cx.fillText(score,W/2,58)}}
  api.on(screen,"pointerdown",e=>{if(e.target.closest("button"))return;e.preventDefault();flap()});
  api.on(document,"keydown",e=>{if(!api.active()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key===" "||e.key==="ArrowUp"||e.key==="w"){e.preventDefault();if(e.repeat)return;flap()}});
  api.on(api.root,"click",e=>{if(e.target.closest("[data-fg]"))reset()});
  api.on(api.bar,"click",e=>{if(e.target.closest("[data-fg]"))reset()});
  reset();
  return {pause(){if(phase==="run"){phase="pause";show(`<big>Paused</big><div>Flap to keep going</div>`)}},unmount(){cancelAnimationFrame(raf)}};
}};
})();
