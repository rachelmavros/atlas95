// Pool for the Atlas95 Game Vault: 8-ball against the computer or a friend, or Solo (clear the table in as few shots as you can).
// Aim by pulling back from the cue ball like a slingshot and letting go. Table units: 200 x 100, ball radius R.
(()=>{
const L=200,WD=100,R=2.65,RAIL=9,MOUTH_C=3.3*R,MOUTH_S=2.1*R,DECEL=27,DRAG=.3,STOP=.8,MAXV=440,REST=.95,CUSH=.8,DT=1/240;
const COLORS=["#ffffff","#f5c400","#1040c0","#e00000","#6a2a9a","#ff7a00","#008a3a","#7a1020","#111111"];
const LEVELS={easy:{label:"Easy",err:3.2,think:4},medium:{label:"Medium",err:1.2,think:10},hard:{label:"Hard",err:.35,think:24}};
const MODES={easy:"vs Computer: Easy",medium:"vs Computer: Medium",hard:"vs Computer: Hard","2p":"2 players",solo:"Solo: clear the table"};
const CSS=`
.pl-wrap{display:flex;flex-direction:column;align-items:center;gap:6px}
.pl-hud{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;font-weight:700;min-height:1.5em;text-align:center}
.pl-side{display:flex;gap:2px;align-items:center;font-weight:400;font-size:12px;background:var(--hi);box-shadow:var(--sunken);padding:2px 6px}
.pl-side.on{background:var(--tip);font-weight:700}
.pl-side i{width:11px;height:11px;border-radius:50%;display:inline-block;box-shadow:0 0 0 1px #000}
.pl-table{position:relative;width:min(100%,780px);touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.pl-table canvas{display:block;width:100%;height:auto;cursor:crosshair}`;
// ---------- physics (pure: works on a world object, also used by the computer to test shots) ----------
function rack(rnd=Math.random){const balls=[{n:0,x:L*.25,y:WD/2,vx:0,vy:0,in:false}];
  // triangle with the 8 in the middle, a solid and a stripe in the back corners
  const order=[1,9,2,10,8,3,11,4,12,5,13,6,14,7,15],rest=order.filter(n=>![1,8,9,15].includes(n));const sh=api0shuffle(rest,rnd);
  const rows=[[1],[sh[0],sh[1]],[sh[2],8,sh[3]],[sh[4],sh[5],sh[6],sh[7]],[9,sh[8],sh[9],sh[10],15]];
  const fx=L*.72,dx=R*2*Math.cos(Math.PI/6)+.02;rows.forEach((row,i)=>row.forEach((n,j)=>balls.push({n,x:fx+i*dx,y:WD/2+(j-(row.length-1)/2)*(R*2+.02),vx:0,vy:0,in:false})));
  return {balls,ev:{first:null,pocketed:[],rails:0}}}
const live=w=>w.balls.filter(b=>!b.in);
const moving=w=>w.balls.some(b=>!b.in&&(b.vx||b.vy));
function stepWorld(w,dt){const bs=live(w);
  for(const b of bs){if(!b.vx&&!b.vy)continue;b.x+=b.vx*dt;b.y+=b.vy*dt;const sp=Math.hypot(b.vx,b.vy),ns=Math.max(0,sp-DECEL*dt)*(1-DRAG*dt);if(ns<STOP){b.vx=b.vy=0}else{b.vx*=ns/sp;b.vy*=ns/sp}
    // cushions, except across a pocket's mouth, where the ball drops in
    const inCornerY=b.y<MOUTH_C||b.y>WD-MOUTH_C,inCornerX=b.x<MOUTH_C||b.x>L-MOUTH_C,inSide=Math.abs(b.x-L/2)<MOUTH_S;
    if(b.x<R||b.x>L-R){if(inCornerY){pocket(w,b);continue}b.x=b.x<R?2*R-b.x:2*(L-R)-b.x;b.vx=-b.vx*CUSH;b.vy*=.96;w.ev.rails++}
    if(b.y<R||b.y>WD-R){if(inCornerX||inSide){pocket(w,b);continue}b.y=b.y<R?2*R-b.y:2*(WD-R)-b.y;b.vy=-b.vy*CUSH;b.vx*=.96;w.ev.rails++}}
  for(let i=0;i<bs.length;i++)for(let j=i+1;j<bs.length;j++){const a=bs[i],c=bs[j];if(a.in||c.in)continue;const dx=c.x-a.x,dy=c.y-a.y,d2=dx*dx+dy*dy;if(d2>=4*R*R||d2===0)continue;
    const d=Math.sqrt(d2),nx=dx/d,ny=dy/d,vn=(a.vx-c.vx)*nx+(a.vy-c.vy)*ny,ov=(2*R-d)/2;a.x-=nx*ov;a.y-=ny*ov;c.x+=nx*ov;c.y+=ny*ov;
    if(vn>0){const jn=vn*(1+REST)/2;a.vx-=jn*nx;a.vy-=jn*ny;c.vx+=jn*nx;c.vy+=jn*ny;w.ev.hit=true}
    if(w.ev.first==null&&(a.n===0||c.n===0))w.ev.first=a.n===0?c.n:a.n}}
function pocket(w,b){b.in=true;b.vx=b.vy=0;w.ev.pocketed.push(b.n)}
function strike(w,ang,pow){const c=w.balls[0];c.vx=Math.cos(ang)*pow*MAXV;c.vy=Math.sin(ang)*pow*MAXV;w.ev={first:null,pocketed:[],rails:0}}
const clone=w=>({balls:w.balls.map(b=>Object.assign({},b)),ev:{first:null,pocketed:[],rails:0}});
function simulate(w,ang,pow){const s=clone(w);strike(s,ang,pow);for(let t=0;t<8/DT/2&&moving(s);t++)stepWorld(s,DT*2);return s}
const api0shuffle=(a,rnd)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
// ---------- rules helpers ----------
const isSolid=n=>n>=1&&n<=7,isStripe=n=>n>=9;
const inGroup=(n,g)=>g==="solid"?isSolid(n):g==="stripe"?isStripe(n):false;
A95G.pool={
help:`<div><b>Aim:</b> press anywhere on the table and pull back, away from where you want the white ball to go, like a slingshot. The farther you pull, the harder the shot. Let go to shoot. (Pull back only a little and let go to cancel.)</div>
<ul class="factlist"><li><b>8-ball:</b> the first ball you sink makes you <b>solids</b> (1 to 7) or <b>stripes</b> (9 to 15). Sink all of yours, then the black 8 to win.</li><li>Sinking one of your own balls gives you another turn.</li><li><b>Fouls</b> (sinking the white ball, missing everything, or hitting the other player's ball first) give the other side <b>ball in hand</b>: they can drag the white ball anywhere.</li><li>Sinking the 8 early, or fouling while you sink it, loses the game.</li><li><b>Solo:</b> sink all 15 in as few shots as you can. Sinking the white ball costs an extra shot.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;const mo=api.modeOpts();if(mo&&MODES[mo.mode])st.mode=mo.mode;st.mode=MODES[st.mode]?st.mode:"medium";st.rec=st.rec||{};
  let W,turn,groups,phase,inHand,isBreak,shots,winner,aim=null,place=null,raf=0,aiT=null,msg="",portrait=false,s=1,dpr=1,lastT=0;
  api.bar.innerHTML=`<button class="btn" type="button" data-pl="new">New game</button><select class="sel95" data-plmode aria-label="Mode">${Object.entries(MODES).map(([k,v])=>`<option value="${k}"${st.mode===k?" selected":""}>${v}</option>`).join("")}</select>`;
  api.root.innerHTML=`<div class="pl-wrap"><div class="pl-hud" aria-live="polite"></div><div class="pl-table"><canvas aria-label="Pool table"></canvas></div><div class="note" id="plnote"></div></div>`;
  const cv=api.root.querySelector("canvas"),cx=cv.getContext("2d"),hud=api.root.querySelector(".pl-hud"),note=api.root.querySelector("#plnote"),holder=api.root.querySelector(".pl-table");
  const vsAI=()=>LEVELS[st.mode]!=null,solo=()=>st.mode==="solo";
  const name=t=>solo()?"You":vsAI()?(t===0?"You":"Computer"):`Player ${t+1}`,whose=t=>name(t)==="You"?"Your":`${name(t)}'s`;
  // ---- sizing: on narrow screens the table stands upright ----
  function size(){portrait=(holder.clientWidth||innerWidth)<560;const cssW=Math.min(holder.clientWidth||600,780);const lw=portrait?WD+2*RAIL:L+2*RAIL,lh=portrait?L+2*RAIL:WD+2*RAIL;
    let w=cssW,h=cssW*lh/lw;const maxH=Math.max(260,(innerHeight||800)-Math.max(0,holder.getBoundingClientRect().top)-70);if(h>maxH){h=maxH;w=h*lw/lh}
    dpr=Math.min(2,window.devicePixelRatio||1);cv.style.width=w+"px";cv.style.height=h+"px";cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);s=w/lw}
  function setT(){if(portrait)cx.setTransform(0,-s*dpr,s*dpr,0,s*dpr*RAIL,s*dpr*(L+RAIL));else cx.setTransform(s*dpr,0,0,s*dpr,s*dpr*RAIL,s*dpr*RAIL)}
  function toTable(e){const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)/s,py=(e.clientY-r.top)/s;return portrait?{x:L+RAIL-py,y:px-RAIL}:{x:px-RAIL,y:py-RAIL}}
  // ---- game flow ----
  function newGame(){cancelAnimationFrame(raf);clearTimeout(aiT);W=rack(api.begin({mode:st.mode}));turn=0;groups=[null,null];phase="aim";inHand=false;isBreak=true;shots=0;winner=null;aim=null;place=null;note.textContent="";
    size();say(solo()?"Break! Sink all 15 balls.":vsAI()?"Your break. Pull back from the table to aim.":"Player 1 breaks.");draw();status()}
  function say(t){msg=t;renderHud()}
  function renderHud(){const left=g=>W.balls.filter(b=>!b.in&&inGroup(b.n,g)).map(b=>b.n);
    const side=t=>{const g=groups[t];return `<span class="pl-side${turn===t&&phase!=="over"?" on":""}">${api.esc(name(t))}${g?`: ${g}s ${left(g).map(n=>`<i style="background:${COLORS[n>8?n-8:n]};${n>8?"background-image:linear-gradient(#fff 30%,transparent 30% 70%,#fff 70%)":""}"></i>`).join("")||"→ 8"}`:""}</span>`};
    hud.innerHTML=solo()?`<span class="pl-side on">Shots: ${shots} &middot; Left: ${W.balls.filter(b=>b.n&&!b.in).length}</span> <span>${api.esc(msg)}</span>`:`${side(0)}${side(1)}<span>${api.esc(msg)}</span>`}
  function status(){const r=vsAI()?st.rec[st.mode]:null;api.status(solo()?`Solo · ${shots} shots`:vsAI()?`${LEVELS[st.mode].label}: won ${r?r.w:0}, lost ${r?r.l:0}`:"2 players",solo()&&st.solo!=null?`Best: ${st.solo} shots`:"")}
  function shoot(ang,pow){if(pow<.04)return;strike(W,ang,pow);phase="moving";inHand=false;place=null;aim=null;shots++;api.sound("drop");lastT=performance.now();raf=requestAnimationFrame(run)}
  function run(t){const steps=Math.min(40,Math.max(1,Math.round((t-lastT)/1000/DT)));lastT=t;for(let i=0;i<steps&&moving(W);i++)stepWorld(W,DT);
    draw();if(moving(W)){raf=requestAnimationFrame(run);return}settle()}
  function cueBack(){const c=W.balls[0];c.in=false;c.vx=c.vy=0;c.x=L*.25;c.y=WD/2;while(W.balls.some(b=>b.n&&!b.in&&Math.hypot(b.x-c.x,b.y-c.y)<2*R+.1))c.y+=R*2.2}
  function settle(){const ev=W.ev,potted=ev.pocketed.filter(n=>n),scratch=ev.pocketed.includes(0);if(potted.length||scratch)api.sound(scratch?"lose":"ding");
    if(solo()){if(scratch){shots++;cueBack();inHand=true}
      if(W.balls.every(b=>!b.n||b.in)){finishSolo();return}
      say(scratch?"Scratch! +1 shot. Drag the white ball anywhere.":potted.length?`Nice! ${potted.length>1?potted.length+" balls":"Ball"} down.`:"Keep going.");phase="aim";isBreak=false;draw();status();return}
    const me=turn,g=groups[me],clearedBefore=g&&W.balls.every(b=>!inGroup(b.n,g)||(b.in&&!potted.includes(b.n)));
    let foul=scratch||ev.first==null;if(!foul){if(g)foul=clearedBefore?ev.first!==8:!inGroup(ev.first,g);else foul=ev.first===8}
    let why=scratch?"Scratch":ev.first==null?"No ball hit":foul?(g&&clearedBefore?"Must hit the 8 first":"Hit the wrong ball first"):"";
    if(potted.includes(8)){if(isBreak){const b8=W.balls.find(b=>b.n===8);b8.in=false;b8.x=L*.72;b8.y=WD/2;while(W.balls.some(b=>b!==b8&&!b.in&&Math.hypot(b.x-b8.x,b.y-b8.y)<2*R+.1))b8.x+=R*2.1}
      else{end(!foul&&clearedBefore?me:1-me,!foul&&clearedBefore?`${name(me)} sank the 8!`:`${name(me)} sank the 8 ${foul?"on a foul":"too early"}.`);return}}
    if(!g&&!foul&&!isBreak){const f=potted.find(n=>n!==8);if(f){groups[me]=isSolid(f)?"solid":"stripe";groups[1-me]=isSolid(f)?"stripe":"solid"}}
    const mine=potted.some(n=>n!==8&&(groups[me]?inGroup(n,groups[me]):true));
    if(scratch)cueBack();isBreak=false;
    if(foul){turn=1-me;inHand=true;say(`${why}! ${name(turn)} ${turn===0&&vsAI()?"have":"has"} ball in hand.`)}
    else if(!mine){turn=1-me;say(`${whose(turn)} turn.`)}else say(`${name(me)} ${me===0&&vsAI()?"go":"goes"} again.`);
    phase="aim";draw();status();if(vsAI()&&turn===1)aiTurn()}
  function end(w,why){phase="over";winner=w;draw();
    if(vsAI()){const r=st.rec[st.mode]||(st.rec[st.mode]={w:0,l:0});if(w===0){r.w++;if(st.mode==="hard")st.hardW=(st.hardW||0)+1}else r.l++;st.w=(st.w||0)+(w===0?1:0);st.l=(st.l||0)+(w===1?1:0)}
    const res=api.result({xp:vsAI()?(w===0?({easy:8,medium:15,hard:25})[st.mode]:3):3});api.sound(w===0||!vsAI()?"win":"lose");
    say(`${why} ${vsAI()?(w===0?"You win!":"The computer wins."):`${name(w)} wins!`}${res.xp?` +${res.xp} XP`:""}`);
    note.innerHTML=`<button class="btn default" type="button" data-pl="new">Play again</button>`;status()}
  function finishSolo(){phase="over";const prev=st.solo,nb=prev==null||shots<prev;if(nb)st.solo=shots;st.bestText=`${st.solo} shots (solo)`;
    const res=api.result({xp:Math.max(5,30-Math.max(0,shots-15)),ch:{v:shots,text:`${shots} shots`,higher:false}});api.sound("win");
    if(nb&&prev!=null)api.toast(`<span class="gmtemo">🏆</span><span><b>New best in Pool!</b><br>Cleared in ${shots} shots</span>`);
    say(`Table cleared in ${shots} shots!${nb?" New best!":""}${res.xp?` +${res.xp} XP`:""}`);note.innerHTML=`<button class="btn default" type="button" data-pl="new">Rack again</button>`;draw();status()}
  // ---- the computer: ghost-ball aiming at every legal ball and pocket, best few tested in simulation ----
  const POCKETS=[[0,0],[L/2,-R*.3],[L,0],[0,WD],[L/2,WD+R*.3],[L,WD]];
  const clearPath=(w,ax,ay,bx,by,skip)=>{const dx=bx-ax,dy=by-ay,len2=dx*dx+dy*dy||1;return live(w).every(b=>{if(skip.includes(b.n))return true;const t=Math.max(0,Math.min(1,((b.x-ax)*dx+(b.y-ay)*dy)/len2)),px=ax+dx*t-b.x,py=ay+dy*t-b.y;return px*px+py*py>4*R*R*.98})};
  function legalTargets(t){const g=groups[t];if(!g)return live(W).filter(b=>b.n&&b.n!==8);const mine=live(W).filter(b=>inGroup(b.n,g));return mine.length?mine:live(W).filter(b=>b.n===8)}
  function candidates(t){const c=W.balls[0],out=[];
    for(const b of legalTargets(t))for(const [px,py] of POCKETS){const dx=px-b.x,dy=py-b.y,d=Math.hypot(dx,dy),gx=b.x-dx/d*2*R,gy=b.y-dy/d*2*R;
      const ax=gx-c.x,ay=gy-c.y,ad=Math.hypot(ax,ay);if(ad<.5)continue;const cut=Math.acos(Math.max(-1,Math.min(1,(ax*dx+ay*dy)/(ad*d))));if(cut>1.35)continue;
      if(!clearPath(W,c.x,c.y,gx,gy,[0,b.n])||!clearPath(W,b.x,b.y,px,py,[b.n]))continue;
      const pow=Math.min(1,.14+(ad+d*1.6)/350);out.push({ang:Math.atan2(ay,ax),pow,score:cut*1.4+ad/150+d/120,n:b.n})}
    return out.sort((a,b)=>a.score-b.score)}
  function judge(t,sim){const ev=sim.ev,potted=ev.pocketed.filter(n=>n),g=groups[t];if(ev.pocketed.includes(0)||ev.first==null)return -5;
    if(potted.includes(8))return legalTargets(t)[0]&&legalTargets(t)[0].n===8&&ev.first===8?50:-50;
    if(g&&!inGroup(ev.first,g)&&legalTargets(t)[0].n!==8)return -4;return potted.filter(n=>g?inGroup(n,g):n!==8).length*10-potted.filter(n=>g&&!inGroup(n,g)).length*3}
  function plan(t){const L_=LEVELS[st.mode],cs=candidates(t).slice(0,L_.think);let best=null,bv=-1e9;
    for(const c of cs){const v=judge(t,simulate(W,c.ang,c.pow))-c.score;if(v>bv){bv=v;best=c}}
    if(!best){const tg=legalTargets(t).sort((a,b)=>Math.hypot(a.x-W.balls[0].x,a.y-W.balls[0].y)-Math.hypot(b.x-W.balls[0].x,b.y-W.balls[0].y))[0];if(tg)best={ang:Math.atan2(tg.y-W.balls[0].y,tg.x-W.balls[0].x),pow:.55}}
    return best?{ang:best.ang+(Math.random()*2-1)*L_.err*Math.PI/180,pow:Math.max(.12,Math.min(1,best.pow*(1+(Math.random()*2-1)*.06)))}:{ang:0,pow:.5}}
  function aiPlace(){const c=W.balls[0];let bestPos=[c.x,c.y],bv=1e9;for(let k=0;k<40;k++){const x=R+Math.random()*(L-2*R),y=R+Math.random()*(WD-2*R);if(W.balls.some(b=>b.n&&!b.in&&Math.hypot(b.x-x,b.y-y)<2*R+.3))continue;
      c.x=x;c.y=y;const cs=candidates(1);const v=cs.length?cs[0].score:50;if(v<bv){bv=v;bestPos=[x,y]}}c.x=bestPos[0];c.y=bestPos[1]}
  function aiTurn(){phase="ai";say(inHand?"Computer has ball in hand...":"Computer is lining up a shot...");aiT=setTimeout(()=>{if(inHand)aiPlace();draw();const p=plan(1);
      aim={ang:p.ang,pow:p.pow,ai:true};draw();aiT=setTimeout(()=>{aim=null;shoot(p.ang,p.pow)},650)},500)}
  // ---- drawing ----
  function rayHit(ang){const c=W.balls[0],dx=Math.cos(ang),dy=Math.sin(ang);let best=1e9,hit=null;
    for(const b of live(W)){if(!b.n)continue;const fx=b.x-c.x,fy=b.y-c.y,t=fx*dx+fy*dy;if(t<=0)continue;const perp=fx*fx+fy*fy-t*t;if(perp>4*R*R)continue;const tt=t-Math.sqrt(4*R*R-perp);if(tt<best){best=tt;hit=b}}
    const tx=dx>0?(L-R-c.x)/dx:dx<0?(R-c.x)/dx:1e9,ty=dy>0?(WD-R-c.y)/dy:dy<0?(R-c.y)/dy:1e9,tw=Math.min(tx,ty);if(tw<best){best=tw;hit=null}return {t:best,hit,x:c.x+dx*best,y:c.y+dy*best}}
  function draw(){setT();cx.fillStyle="#5a3214";cx.fillRect(-RAIL,-RAIL,L+2*RAIL,WD+2*RAIL);cx.fillStyle="#7a4a24";cx.fillRect(-RAIL+1.5,-RAIL+1.5,L+2*RAIL-3,WD+2*RAIL-3);
    cx.fillStyle="#0a7a3a";cx.fillRect(-1.2,-1.2,L+2.4,WD+2.4);cx.strokeStyle="rgba(0,0,0,.25)";cx.lineWidth=.6;cx.strokeRect(-.6,-.6,L+1.2,WD+1.2);
    cx.fillStyle="#f3ecc8";for(let i=1;i<8;i++){if(i===4)continue;const x=i*L/8;dot(x,-RAIL/2,.7);dot(x,WD+RAIL/2,.7)}for(let i=1;i<4;i++){dot(-RAIL/2,i*WD/4,.7);dot(L+RAIL/2,i*WD/4,.7)}
    cx.strokeStyle="rgba(255,255,255,.18)";cx.beginPath();cx.moveTo(L*.25,0);cx.lineTo(L*.25,WD);cx.stroke();
    cx.fillStyle="#000";POCKETS.forEach(([x,y],i)=>{cx.beginPath();cx.arc(x,y,i%3===1?R*1.9:R*2.3,0,Math.PI*2);cx.fill()});
    // aim guide
    const c=W.balls[0];if(aim&&!c.in){const r=rayHit(aim.ang);cx.save();cx.setLineDash([2,2]);cx.strokeStyle="rgba(255,255,255,.75)";cx.lineWidth=.5;cx.beginPath();cx.moveTo(c.x,c.y);cx.lineTo(r.x,r.y);cx.stroke();cx.setLineDash([]);
      cx.beginPath();cx.arc(r.x,r.y,R,0,Math.PI*2);cx.stroke();if(r.hit){const nx=r.hit.x-r.x,ny=r.hit.y-r.y,d=Math.hypot(nx,ny)||1;cx.beginPath();cx.moveTo(r.hit.x,r.hit.y);cx.lineTo(r.hit.x+nx/d*14,r.hit.y+ny/d*14);cx.stroke()}
      // cue stick behind the ball
      const back=4+aim.pow*22;cx.strokeStyle="#d9b77a";cx.lineWidth=1.4;cx.beginPath();cx.moveTo(c.x-Math.cos(aim.ang)*(R+back),c.y-Math.sin(aim.ang)*(R+back));cx.lineTo(c.x-Math.cos(aim.ang)*(R+back+60),c.y-Math.sin(aim.ang)*(R+back+60));cx.stroke();cx.restore()}
    for(const b of W.balls)if(!b.in)ball(b);
    if(inHand&&phase==="aim"&&!(vsAI()&&turn===1)){cx.save();cx.strokeStyle="#ffd800";cx.lineWidth=.6;cx.setLineDash([1.2,1.2]);cx.beginPath();cx.arc(c.x,c.y,R+1.6,0,Math.PI*2);cx.stroke();cx.restore()}
    if(aim&&!aim.ai){cx.save();cx.setTransform(dpr,0,0,dpr,0,0);const w=cv.width/dpr,bw=Math.min(160,w*.4);cx.fillStyle="rgba(0,0,0,.55)";cx.fillRect(8,8,bw+4,14);cx.fillStyle=aim.pow>.85?"#ff4040":"#ffd800";cx.fillRect(10,10,bw*aim.pow,10);cx.fillStyle="#fff";cx.font="700 11px Tahoma,sans-serif";cx.fillText(`Power ${Math.round(aim.pow*100)}%`,14+bw,19);cx.restore()}}
  function dot(x,y,r){cx.beginPath();cx.arc(x,y,r,0,Math.PI*2);cx.fill()}
  function ball(b){const col=COLORS[b.n>8?b.n-8:b.n];cx.save();cx.beginPath();cx.arc(b.x,b.y,R,0,Math.PI*2);cx.clip();
    cx.fillStyle=b.n>8?"#fff":col;cx.fillRect(b.x-R,b.y-R,2*R,2*R);if(b.n>8){cx.fillStyle=col;cx.fillRect(b.x-R,b.y-R*.55,2*R,R*1.1)}
    cx.fillStyle="rgba(255,255,255,.35)";cx.beginPath();cx.arc(b.x-R*.35,b.y-R*.4,R*.35,0,Math.PI*2);cx.fill();cx.restore();
    cx.strokeStyle="rgba(0,0,0,.6)";cx.lineWidth=.25;cx.beginPath();cx.arc(b.x,b.y,R,0,Math.PI*2);cx.stroke();
    if(b.n){cx.fillStyle="#fff";cx.beginPath();cx.arc(b.x,b.y,R*.48,0,Math.PI*2);cx.fill();cx.save();cx.translate(b.x,b.y);if(portrait)cx.rotate(Math.PI/2);cx.fillStyle="#000";cx.font=`700 ${R*.62}px Tahoma,sans-serif`;cx.textAlign="center";cx.textBaseline="middle";cx.fillText(b.n,0,R*.04);cx.restore()}}
  // ---- input: drag the white ball when it's in hand, otherwise pull back to aim ----
  const myTurn=()=>phase==="aim"&&!(vsAI()&&turn===1);
  api.on(cv,"pointerdown",e=>{if(!myTurn()||e.button>0)return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}const p=toTable(e),c=W.balls[0];
    if(inHand&&Math.hypot(p.x-c.x,p.y-c.y)<R*3.2){place={dx:c.x-p.x,dy:c.y-p.y};return}aim={x0:p.x,y0:p.y,ang:aim?aim.ang:0,pow:0};draw()});
  api.on(cv,"pointermove",e=>{const p=toTable(e);
    if(place){const c=W.balls[0],x=Math.max(R,Math.min(L-R,p.x+place.dx)),y=Math.max(R,Math.min(WD-R,p.y+place.dy));if(!W.balls.some(b=>b.n&&!b.in&&Math.hypot(b.x-x,b.y-y)<2*R+.1)){c.x=x;c.y=y}draw();return}
    if(!aim||aim.ai)return;const c=W.balls[0],dx=aim.x0-p.x,dy=aim.y0-p.y,d=Math.hypot(dx,dy);
    // pull back: shoot away from the finger; before the pull starts, point from the ball toward the finger
    if(d>2){aim.ang=Math.atan2(dy,dx);aim.pow=Math.min(1,d/55)}else{aim.ang=Math.atan2(p.y-c.y,p.x-c.x);aim.pow=0}draw()});
  const release=()=>{if(place){place=null;return}if(!aim||aim.ai)return;const a=aim;aim=null;if(a.pow>=.04)shoot(a.ang,a.pow);else draw()};
  api.on(cv,"pointerup",release);api.on(cv,"pointercancel",()=>{aim=null;place=null;draw()});api.on(cv,"touchmove",e=>e.preventDefault(),{passive:false});
  api.on(api.bar,"click",e=>{if(e.target.closest("[data-pl=new]"))newGame()});
  api.on(note,"click",e=>{if(e.target.closest("[data-pl=new]"))newGame()});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-plmode]")){st.mode=e.target.value;api.save();newGame()}});
  api.on(window,"resize",()=>{if(phase!=="moving"){size();draw()}});
  newGame();
  return {unmount(){cancelAnimationFrame(raf);clearTimeout(aiT)}};
}};
A95G.pool._t={rack,stepWorld,simulate,strike,moving,L,WD,R};
})();
