// Perfect Circle for the Atlas95 Game Vault: draw around the dot, scored on how evenly far each point is from it.
(()=>{
const SIZE=480;
const CSS=`
.pc-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.pc-board{position:relative;width:min(100%,480px);background:#fff;box-shadow:var(--sunken);padding:2px;touch-action:none;user-select:none;-webkit-user-select:none}
.pc-board canvas{display:block;width:100%;height:auto;cursor:crosshair}
.pc-score{position:absolute;left:0;right:0;top:calc(50% + 18px);text-align:center;font:700 34px var(--ui);color:var(--sel);pointer-events:none;font-variant-numeric:tabular-nums}
.pc-score small{display:block;font-size:13px;font-weight:700;color:#303030}
.pc-hist{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;font-size:12px}
.pc-hist span{background:var(--hi);box-shadow:var(--sunken);padding:2px 6px;font-variant-numeric:tabular-nums}`;
// how far off a point is (0 = exactly on the circle) mapped to green..yellow..red
const hue=err=>`hsl(${Math.max(0,120-err*1100)},85%,${err<.04?36:44}%)`;
A95G.circle={
help:`<div>Press and drag to draw a circle around the red dot, then let go. The closer every part of your line stays to the same distance from the dot, the higher your score.</div>
<ul class="factlist"><li>Go all the way around. Half a circle doesn't count.</li><li>Bigger circles are easier to keep even.</li><li>Green parts of your line are on target. Red parts wandered off.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.hist=st.hist||[];
  api.bar.innerHTML=`<button class="btn" type="button" data-pc="clear">Clear</button>`;
  api.root.innerHTML=`<div class="pc-wrap"><div class="pc-board"><canvas width="${SIZE}" height="${SIZE}" aria-label="Drawing area. Draw a circle around the dot."></canvas><div class="pc-score" aria-live="polite"></div></div><div class="pc-hist"></div></div>`;
  const cv=api.root.querySelector("canvas"),cx=cv.getContext("2d"),out=api.root.querySelector(".pc-score"),hist=api.root.querySelector(".pc-hist");
  const C=SIZE/2;let pts=[],drawing=false,turn=0,lastA=null;
  const toXY=e=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)/r.width*SIZE,(e.clientY-r.top)/r.height*SIZE]};
  function base(){cx.fillStyle="#fff";cx.fillRect(0,0,SIZE,SIZE);cx.strokeStyle="#eef";cx.lineWidth=1;
    for(let i=40;i<SIZE;i+=40){cx.beginPath();cx.moveTo(i+.5,0);cx.lineTo(i+.5,SIZE);cx.moveTo(0,i+.5);cx.lineTo(SIZE,i+.5);cx.stroke()}
    cx.fillStyle="#c00000";cx.beginPath();cx.arc(C,C,5,0,Math.PI*2);cx.fill()}
  function fit(){const rs=pts.map(([x,y])=>Math.hypot(x-C,y-C)),R=rs.reduce((a,b)=>a+b,0)/rs.length;
    const dev=Math.sqrt(rs.reduce((a,r)=>a+(r-R)*(r-R),0)/rs.length)/R;return {R,rs,score:Math.max(0,Math.min(100,100*(1-2.6*dev)))}}
  function paint(final){base();if(pts.length<2)return;const f=fit();
    if(final){cx.strokeStyle="rgba(0,0,128,.25)";cx.setLineDash([6,6]);cx.lineWidth=2;cx.beginPath();cx.arc(C,C,f.R,0,Math.PI*2);cx.stroke();cx.setLineDash([])}
    cx.lineWidth=6;cx.lineCap="round";for(let i=1;i<pts.length;i++){cx.strokeStyle=hue(Math.abs(f.rs[i]-f.R)/f.R);cx.beginPath();cx.moveTo(pts[i-1][0],pts[i-1][1]);cx.lineTo(pts[i][0],pts[i][1]);cx.stroke()}
    return f}
  function say(big,small){out.innerHTML=big==null?"":`${big}${small?`<small>${small}</small>`:""}`}
  function showHist(){hist.innerHTML=st.hist.length?`Recent: ${st.hist.map(s=>`<span>${s.toFixed(1)}%</span>`).join("")}`:"";api.status(st.hist.length?`Last: ${st.hist[0].toFixed(1)}%`:"Draw a circle",`Best: ${st.best!=null?st.best.toFixed(1)+"%":"--"}`)}
  function finish(){drawing=false;if(pts.length<8){paint();say(null);return}
    const f=paint(true);
    if(f.R<45){say("Too small","Draw a bigger circle");api.sound("lose");return}
    if(Math.abs(turn)<Math.PI*2*.9){say("Keep going","Draw all the way around the dot");api.sound("lose");return}
    const s=Math.round(f.score*10)/10;st.hist.unshift(s);st.hist=st.hist.slice(0,6);
    const r=api.result({score:s,text:s.toFixed(1)+"%",xp:s>=95?10:s>=90?6:s>=80?3:1});
    const word=s>=97?"Flawless!":s>=93?"Amazing!":s>=88?"Great circle!":s>=80?"Nice!":s>=65?"Not bad":"Wobbly...";
    say(`${s.toFixed(1)}%`,r.best?"New best!":word);api.sound(s>=90?"win":"ding");showHist()}
  api.on(cv,"pointerdown",e=>{if(e.button>0)return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}drawing=true;pts=[toXY(e)];turn=0;lastA=Math.atan2(pts[0][1]-C,pts[0][0]-C);say(null);paint()});
  api.on(cv,"pointermove",e=>{if(!drawing)return;const p=toXY(e),q=pts[pts.length-1];if(Math.hypot(p[0]-q[0],p[1]-q[1])<2)return;
    if(Math.hypot(p[0]-C,p[1]-C)<18){drawing=false;paint();say("Too close","Stay away from the dot");api.sound("lose");return}
    const a=Math.atan2(p[1]-C,p[0]-C);let d=a-lastA;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;turn+=d;lastA=a;pts.push(p);
    const f=paint();if(pts.length>10)say(`${(Math.round(f.score*10)/10).toFixed(1)}%`);
    if(Math.abs(turn)>=Math.PI*2+.15)finish()});
  api.on(cv,"pointerup",()=>{if(drawing)finish()});
  api.on(cv,"pointercancel",()=>{if(drawing)finish()});
  api.on(cv,"touchmove",e=>e.preventDefault(),{passive:false});
  api.on(api.bar,"click",e=>{if(e.target.closest("[data-pc]")){pts=[];drawing=false;base();say(null)}});
  base();say("","Draw a circle around the dot");showHist();
  return {unmount(){}};
}};
})();
