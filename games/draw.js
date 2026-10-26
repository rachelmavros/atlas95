// Draw from Memory for the Atlas95 Game Vault: study a shape or an everyday object for 3 seconds, then draw it. Scored on how well the lines match.
(()=>{
const ROUNDS=5,SHOW_MS=3000,GRID=64;
const CFG={tol:2,lo:.45,hi:.93,pow:.8};
const SHAPES=[["Star","M50 8L61 38H93L67 57L77 88L50 69L23 88L33 57L7 38H39Z"],["Heart","M50 85C20 62 8 45 12 30C16 14 38 10 50 28C62 10 84 14 88 30C92 45 80 62 50 85Z"],
  ["Arrow","M10 50H80M58 28L82 50L58 72"],["Lightning bolt","M58 6L22 54H48L38 94L80 40H54Z"],["Moon","M62 10A40 40 0 1 0 90 68A32 32 0 1 1 62 10Z"],
  ["Crown","M14 78L10 30L32 52L50 22L68 52L90 30L86 78Z"],["Diamond","M50 8L84 50L50 92L16 50Z"],["Hexagon","M30 14H70L90 50L70 86H30L10 50Z"],
  ["Plus sign","M38 10H62V38H90V62H62V90H38V62H10V38H38Z"],["Triangle in a circle","M50 8A42 42 0 1 1 49.9 8ZM50 22L80 72H20Z"],
  ["Infinity","M50 50C40 30 12 30 12 50C12 70 40 70 50 50C60 30 88 30 88 50C88 70 60 70 50 50Z"],
  ["Spiral","M50 50A4 4 0 0 1 58 50A8 8 0 0 1 42 50A12 12 0 0 1 66 50A16 16 0 0 1 34 50A20 20 0 0 1 74 50A24 24 0 0 1 26 50A28 28 0 0 1 82 50"],
  ["Pentagon","M50 8L90 38L75 86H25L10 38Z"],["Square in a square","M20 20H80V80H20ZM35 35H65V65H35Z"],["Zigzag","M8 60L22 36L36 60L50 36L64 60L78 36L92 60"]];
const OBJECTS=[["House","M15 50L50 15L85 50M25 42V88H75V42M42 88V64H58V88"],["Umbrella","M10 52Q50 4 90 52Q76 44 63 52Q50 44 37 52Q24 44 10 52ZM50 52V84Q50 92 42 88"],
  ["Cloud","M25 70A15 15 0 0 1 25 40A20 20 0 0 1 60 30A17 17 0 0 1 82 50A12 12 0 0 1 80 70Z"],["Tree","M50 8L80 48H62L84 76H16L38 48H20ZM44 76V92H56V76"],
  ["Sailboat","M50 10V70M50 14L80 62H50M12 74H88L76 90H24Z"],["Envelope","M12 26H88V78H12ZM12 26L50 56L88 26"],["Fish","M12 50C32 22 66 22 80 50C66 78 32 78 12 50ZM80 50L94 32V68Z"],
  ["Smiley face","M50 10A40 40 0 1 1 49.9 10ZM37 36V46M63 36V46M30 60Q50 80 70 60"],["Key","M30 50A16 16 0 1 1 29.9 50ZM46 50H90M78 50V64M88 50V60"],
  ["Diamond ring","M50 8L62 22L50 34L38 22ZM50 34A28 28 0 1 1 49.9 34Z"],["Coffee cup","M22 30H70V66A14 14 0 0 1 56 80H36A14 14 0 0 1 22 66ZM70 38H78A10 10 0 0 1 78 58H70M16 88H76"],
  ["Light bulb","M36 60C22 48 24 14 50 12C76 14 78 48 64 60V70H36ZM38 78H62M41 86H59"],["Glasses","M8 46A14 14 0 1 0 36 46A14 14 0 1 0 8 46ZM64 46A14 14 0 1 0 92 46A14 14 0 1 0 64 46ZM36 44Q50 36 64 44"],
  ["Apple","M50 30C30 18 12 34 16 56C20 78 36 90 50 82C64 90 80 78 84 56C88 34 70 18 50 30ZM50 30C50 22 52 14 58 10M52 22C60 14 70 16 72 18C66 24 58 24 52 22Z"],
  ["Sun","M50 34A16 16 0 1 1 49.9 34ZM50 8V20M50 80V92M8 50H20M80 50H92M20 20L28 28M72 72L80 80M20 80L28 72M72 28L80 20"],["Clock","M50 8A42 42 0 1 1 49.9 8ZM50 22V50L68 62"],
  ["Mushroom","M12 54C12 24 88 24 88 54ZM38 54V86H62V54"],["Ice cream cone","M28 44A22 22 0 0 1 72 44ZM28 44L50 92L72 44"],
  ["Balloon","M50 10C30 10 22 26 22 40C22 58 38 70 50 72C62 70 78 58 78 40C78 26 70 10 50 10ZM50 72L46 78H54ZM50 78C44 84 56 88 50 94"],
  ["Bell","M50 10C34 10 28 26 28 40V62L18 74H82L72 62V40C72 26 66 10 50 10ZM42 74A8 8 0 0 0 58 74"],
  ["Rocket","M50 6C62 18 66 34 64 60H36C34 34 38 18 50 6ZM36 60L24 76V84L38 72M64 60L76 76V84L62 72M44 60L50 80L56 60M50 26A6 6 0 1 1 49.9 26Z"],
  ["Car","M8 66V52L20 50L30 34H66L80 50L92 54V66ZM24 66A9 9 0 1 0 42 66A9 9 0 1 0 24 66ZM60 66A9 9 0 1 0 78 66A9 9 0 1 0 60 66ZM34 38L30 50H64L58 38Z"],
  ["Pencil","M16 84L24 60L70 14L86 30L40 76ZM16 84L36 78M62 22L78 38"],["Candle","M38 40H62V90H38ZM50 40V30M50 30C44 24 46 14 50 8C54 14 56 24 50 30Z"]];
const MODES={shapes:"Shapes",objects:"Objects"};
const CSS=`
.dm-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.dm-head{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.dm-head div{background:var(--hi);box-shadow:var(--sunken);padding:3px 10px;text-align:center;min-width:80px}
.dm-head small{display:block;font-size:11px;color:#404040}.dm-head b{font-size:17px;font-variant-numeric:tabular-nums}
.dm-title{font-weight:700;font-size:16px;min-height:1.4em;text-align:center}
.dm-pad{position:relative;width:min(100%,380px,calc(100vh - 300px));min-width:220px;aspect-ratio:1;background:#fff;box-shadow:var(--sunken);touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.dm-pad canvas{display:block;width:100%;height:100%;cursor:crosshair}
.dm-timer{position:absolute;left:0;bottom:0;height:5px;background:#000080;width:100%}
.dm-big{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;font:700 38px var(--ui);color:var(--sel);text-shadow:0 0 4px #fff,0 0 8px #fff}
.dm-big small{font-size:14px;color:#000}
.dm-scores{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;font-size:12px}
.dm-scores span{background:var(--hi);box-shadow:var(--sunken);padding:2px 6px;font-variant-numeric:tabular-nums}`;
// cells within TOL of each lit cell, by chessboard distance (0 = on the line)
function distMap(lit){const d=new Uint8Array(GRID*GRID).fill(255),q=[];lit.forEach(i=>{d[i]=0;q.push(i)});
  for(let h=0;h<q.length;h++){const i=q[h],x=i%GRID,y=(i/GRID)|0,v=d[i];if(v>=CFG.tol)continue;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const a=x+dx,b=y+dy;if(a<0||b<0||a>=GRID||b>=GRID)continue;const j=b*GRID+a;if(d[j]>v+1){d[j]=v+1;q.push(j)}}}return d}
function litCells(draw){const cv=document.createElement("canvas");cv.width=cv.height=GRID;const x=cv.getContext("2d");x.lineCap=x.lineJoin="round";x.strokeStyle="#000";x.lineWidth=2.2;x.scale(GRID/100,GRID/100);x.lineWidth=2.2*100/GRID;draw(x);
  const px=x.getImageData(0,0,GRID,GRID).data,out=[];for(let i=0;i<GRID*GRID;i++)if(px[i*4+3]>60)out.push(i);return out}
const bbox=cells=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;cells.forEach(i=>{const x=i%GRID,y=(i/GRID)|0;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)});return {x0,y0,x1,y1,w:x1-x0+1,h:y1-y0+1,cx:(x0+x1)/2,cy:(y0+y1)/2}};
// score: lines are lined up by their bounding boxes (one scale for both directions), then compared both ways
function score(targetD,strokes){const T=litCells(x=>x.stroke(new Path2D(targetD)));const pts=strokes.flat();if(pts.length<2||!T.length)return 0;
  const raw=litCells(x=>strokes.forEach(s=>{x.beginPath();s.forEach(([a,b],k)=>k?x.lineTo(a,b):x.moveTo(a,b));if(s.length===1)x.lineTo(s[0][0]+.1,s[0][1]);x.stroke()}));
  const tb=bbox(T),ub=bbox(raw),k=Math.max(tb.w,tb.h)/Math.max(ub.w,ub.h,1),u2t=GRID/100;
  const U=litCells(x=>{x.setTransform(1,0,0,1,0,0);x.translate(tb.cx+.5,tb.cy+.5);x.scale(k,k);x.translate(-(ub.cx+.5),-(ub.cy+.5));x.scale(u2t,u2t);x.lineWidth=2.2/(k*u2t);
    strokes.forEach(s=>{x.beginPath();s.forEach(([a,b],j)=>j?x.lineTo(a,b):x.moveTo(a,b));if(s.length===1)x.lineTo(s[0][0]+.1,s[0][1]);x.stroke()})});
  const dT=distMap(T),dU=distMap(U),near=(d,i)=>Math.max(0,1-d[i]/(CFG.tol+1));
  const P=U.reduce((a,i)=>a+near(dT,i),0)/U.length,R=T.reduce((a,i)=>a+near(dU,i),0)/T.length;if(!P||!R)return 0;
  // F1 of the two directions, stretched so a random scribble lands near 0 and a careful copy near 100
  const f=2*P*R/(P+R),m=Math.max(0,Math.min(1,(f-CFG.lo)/(CFG.hi-CFG.lo)))**CFG.pow;return Math.round(m*1000)/10}
A95G.draw={
help:`<div>A picture appears for <b>3 seconds</b>. Remember it! Then the picture disappears and you draw it from memory.</div>
<ul class="factlist"><li>Draw with your finger or mouse. Use as many lines as you like, then press <b>Done</b>.</li><li>Your score is how closely your lines match the original. Size and position don't matter much, but the shape and its proportions do.</li><li>Each game is ${ROUNDS} drawings. Pick <b>Shapes</b> (stars, spirals, hexagons...) or <b>Objects</b> (a cup, a rocket, a light bulb...).</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;const mo=api.modeOpts();if(mo&&MODES[mo.mode])st.mode=mo.mode;st.mode=MODES[st.mode]?st.mode:"shapes";st.bests=st.bests||{};
  let phase="ready",items=[],idx=0,scores=[],strokes=[],cur=null,showT=null,raf=0,target=null;
  const bar=()=>{api.bar.innerHTML=`<button class="btn" type="button" data-dm="new">New game</button><select class="sel95" data-dmmode aria-label="Pictures">${Object.entries(MODES).map(([k,v])=>`<option value="${k}"${st.mode===k?" selected":""}>${v}</option>`).join("")}</select>`};bar();
  api.root.innerHTML=`<div class="dm-wrap"><div class="dm-head"></div><div class="dm-title" aria-live="polite"></div><div class="dm-pad"><canvas width="600" height="600" aria-label="Drawing pad"></canvas><div class="dm-big"></div></div><div class="actions" id="dmact" style="justify-content:center"></div><div class="dm-scores"></div></div>`;
  const cv=api.root.querySelector("canvas"),cx=cv.getContext("2d"),big=api.root.querySelector(".dm-big"),title=api.root.querySelector(".dm-title"),act=api.root.querySelector("#dmact"),pad=api.root.querySelector(".dm-pad");
  const S=600/100;
  const pool=()=>(st.mode==="objects"?OBJECTS:SHAPES).map(([name,d])=>({name,d}));
  function head(){const avg=scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:null,b=st.bests[st.mode];
    api.root.querySelector(".dm-head").innerHTML=`<div><small>DRAWING</small><b>${phase==="ready"?"-":Math.min(phase==="result"||phase==="over"?idx:idx+1,ROUNDS)}/${ROUNDS}</b></div><div><small>AVERAGE</small><b>${avg==null?"--":avg.toFixed(1)+"%"}</b></div><div><small>BEST</small><b>${b!=null?b.toFixed(1)+"%":"--"}</b></div>`;
    api.root.querySelector(".dm-scores").innerHTML=scores.map((s,i)=>`<span title="${api.esc(items[i].name)}">${api.esc(items[i].name)}: ${s.toFixed(1)}%</span>`).join("");
    api.status(`${MODES[st.mode]} · drawing ${Math.min(phase==="result"||phase==="over"?idx:idx+1,ROUNDS)} of ${ROUNDS}`,b!=null?`Best: ${b.toFixed(1)}%`:"Best: --")}
  function clear(){cx.setTransform(1,0,0,1,0,0);cx.fillStyle="#fff";cx.fillRect(0,0,600,600);cx.strokeStyle="#eef";cx.lineWidth=1;for(let i=60;i<600;i+=60){cx.beginPath();cx.moveTo(i+.5,0);cx.lineTo(i+.5,600);cx.moveTo(0,i+.5);cx.lineTo(600,i+.5);cx.stroke()}}
  function paintTarget(color,width,dash){cx.save();cx.scale(S,S);cx.strokeStyle=color;cx.lineWidth=width/S;cx.lineCap=cx.lineJoin="round";if(dash)cx.setLineDash(dash.map(v=>v/S));cx.stroke(new Path2D(target.d));cx.restore()}
  function paintStrokes(color){cx.save();cx.strokeStyle=color;cx.lineWidth=7;cx.lineCap=cx.lineJoin="round";strokes.forEach(s=>{cx.beginPath();s.forEach(([a,b],k)=>k?cx.lineTo(a*S,b*S):cx.moveTo(a*S,b*S));if(s.length===1)cx.lineTo(s[0][0]*S+.5,s[0][1]*S);cx.stroke()});cx.restore()}
  function ready(){phase="ready";idx=0;scores=[];strokes=[];clearTimeout(showT);cancelAnimationFrame(raf);clear();
    big.innerHTML=`Draw from Memory<small>${MODES[st.mode]}: ${ROUNDS} drawings</small>`;title.textContent="";act.innerHTML=`<button class="btn default" type="button" data-dm="start">Start</button>`;head();act.querySelector("button").focus({preventScroll:true})}
  function start(){const p=pool();items=api.shuffle(p,api.begin({mode:st.mode})).slice(0,ROUNDS);idx=0;scores=[];show()}
  function show(){phase="show";target=items[idx];A95G.draw._cur=target.d;strokes=[];clear();paintTarget("#000080",9);big.innerHTML="";title.textContent=`Memorize: ${target.name}`;act.innerHTML="";head();api.sound("tap");
    let bar=pad.querySelector(".dm-timer");if(!bar){bar=document.createElement("div");bar.className="dm-timer";pad.appendChild(bar)}bar.style.display="";const t0=performance.now();
    const tickBar=t=>{const f=Math.max(0,1-(t-t0)/SHOW_MS);bar.style.width=f*100+"%";if(f>0&&phase==="show")raf=requestAnimationFrame(tickBar)};raf=requestAnimationFrame(tickBar);
    showT=setTimeout(drawPhase,SHOW_MS)}
  function drawPhase(){phase="draw";cancelAnimationFrame(raf);const bar=pad.querySelector(".dm-timer");if(bar)bar.style.display="none";clear();
    title.textContent=`Now draw: ${target.name}`;act.innerHTML=`<button class="btn" type="button" data-dm="undo">Undo</button><button class="btn" type="button" data-dm="clear">Clear</button><button class="btn default" type="button" data-dm="done">Done</button>`;api.sound("ding")}
  function done(){if(phase!=="draw")return;if(!strokes.flat().length){title.textContent="Draw something first!";return}
    const s=score(target.d,strokes);scores.push(s);phase="result";clear();paintTarget("#7fd67f",10);paintStrokes("rgba(0,0,128,.85)");
    big.innerHTML=`${s.toFixed(1)}%<small>${s>=90?"Incredible memory!":s>=75?"Great match!":s>=60?"Pretty close":s>=40?"Getting there":"Hmm, not quite"}</small>`;
    title.textContent=`${target.name}: green is the original, blue is yours`;api.sound(s>=75?"win":"tap");idx++;head();
    act.innerHTML=idx<ROUNDS?`<button class="btn default" type="button" data-dm="next">Next drawing &gt;</button>`:`<button class="btn default" type="button" data-dm="finish">See my score &gt;</button>`;act.querySelector("button").focus({preventScroll:true})}
  function finish(){phase="over";const avg=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length*10)/10,prev=st.bests[st.mode],nb=prev==null||avg>prev;if(nb)st.bests[st.mode]=avg;
    st.bestText=`${Math.max(...Object.values(st.bests)).toFixed(1)}%`;const r=api.result({xp:Math.round(avg/8),ch:{v:avg,text:`${avg.toFixed(1)}%`,higher:true}});
    if(nb&&prev!=null)api.toast(`<span class="gmtemo">🏆</span><span><b>New best in Draw from Memory!</b><br>${MODES[st.mode]}: ${avg.toFixed(1)}%</span>`);
    clear();big.innerHTML=`${avg.toFixed(1)}%<small>average over ${ROUNDS} drawings${nb?" · new best!":""}${r.xp?` · +${r.xp} XP`:""}</small>`;title.textContent="Game over";head();
    act.innerHTML=`<button class="btn default" type="button" data-dm="start">Play again</button>`;api.sound("win")}
  const toPt=e=>{const r=cv.getBoundingClientRect();return [Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))]};
  function redraw(){clear();paintStrokes("#000")}
  api.on(cv,"pointerdown",e=>{if(phase!=="draw"||e.button>0)return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}cur=[toPt(e)];strokes.push(cur);redraw()});
  api.on(cv,"pointermove",e=>{if(!cur)return;const p=toPt(e),q=cur[cur.length-1];if(Math.hypot(p[0]-q[0],p[1]-q[1])<.4)return;cur.push(p);
    cx.save();cx.strokeStyle="#000";cx.lineWidth=7;cx.lineCap="round";cx.beginPath();cx.moveTo(q[0]*S,q[1]*S);cx.lineTo(p[0]*S,p[1]*S);cx.stroke();cx.restore()});
  const up=()=>{cur=null};api.on(cv,"pointerup",up);api.on(cv,"pointercancel",up);api.on(cv,"touchmove",e=>e.preventDefault(),{passive:false});
  api.on(api.root,"click",e=>{const b=e.target.closest("[data-dm]");if(!b)return;const k=b.dataset.dm;
    if(k==="start")start();else if(k==="next")show();else if(k==="finish")finish();else if(k==="done")done();else if(k==="undo"){strokes.pop();redraw()}else if(k==="clear"){strokes=[];redraw()}});
  api.on(api.bar,"click",e=>{if(e.target.closest("[data-dm=new]"))ready()});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-dmmode]")){st.mode=e.target.value;api.save();ready()}});
  ready();
  return {unmount(){clearTimeout(showT);cancelAnimationFrame(raf)}};
}};
// exposed for tests
A95G.draw._score=score;A95G.draw._shapes=SHAPES.concat(OBJECTS);A95G.draw._cfg=CFG;
})();
