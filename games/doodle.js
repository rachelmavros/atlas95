// Doodle Relay for the Atlas95 Game Vault: draw a word, send the drawing as a link, your friend watches it replay and guesses. Or guess the computer's doodles.
(()=>{
const WORDS=("cat dog fish bird snake spider turtle rabbit mouse elephant giraffe penguin owl frog snail octopus whale shark crab bee butterfly ladybug duck pig cow horse lion monkey bat dinosaur unicorn "+
  "house castle tent igloo bridge lighthouse windmill pyramid tower church barn "+
  "tree flower cactus mushroom leaf palm tree sunflower rose volcano mountain island rainbow cloud sun moon star lightning snowflake tornado wave beach "+
  "car bus train bicycle boat sailboat airplane rocket helicopter tractor submarine skateboard "+
  "apple banana cherry grapes pear pineapple watermelon carrot corn pizza burger hot dog taco donut cupcake cake cookie ice cream popcorn sandwich egg cheese bread lollipop "+
  "guitar drum piano trumpet violin "+
  "clock phone camera computer lamp light bulb candle key lock scissors pencil book glasses umbrella balloon kite ball crown hat shoe sock shirt dress tie ring necklace backpack "+
  "chair bed door window ladder bucket hammer saw shovel toothbrush cup mug teapot fork spoon bottle bathtub toilet "+
  "snowman robot ghost alien pirate mermaid dragon king witch angel skeleton "+
  "heart anchor flag map globe magnet battery trophy medal gift bell sword shield bow and arrow bone envelope tooth eye hand foot nose ear brain").split(" ");
// two-word entries are joined above with spaces; rebuild them
const MULTI=["palm tree","hot dog","ice cream","light bulb","bow and arrow"];
const LIST=(()=>{const out=[];for(let i=0;i<WORDS.length;i++){const m=MULTI.find(x=>WORDS.slice(i,i+x.split(" ").length).join(" ")===x);if(m){out.push(m);i+=m.split(" ").length-1}else if(WORDS[i])out.push(WORDS[i])}return [...new Set(out)]})();
const COLORS=["#000000","#e00000","#0050e0","#00a000","#ff9800","#8b4513","#ffd800","#ff69b4"],SIZES=[3,7,14];
const CSS=`
.dr-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;max-width:560px;margin:0 auto}
.dr-msg{font-weight:700;font-size:16px;text-align:center;line-height:1.35}
.dr-sub{font-size:13px;color:#404040;text-align:center}
.dr-pad{flex:none;position:relative;width:min(100%,440px,calc(100dvh - 330px));min-width:240px;aspect-ratio:1;background:#fff;box-shadow:var(--sunken)}
.dr-pad canvas{display:block;width:100%;height:100%;touch-action:none;cursor:crosshair}
.dr-tools{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;align-items:center}
.dr-sw{width:30px;height:30px;padding:0;min-width:0;border:0;box-shadow:var(--raised);cursor:pointer}
.dr-sw[aria-pressed="true"]{box-shadow:var(--sunken);outline:2px dotted #000;outline-offset:1px}
.dr-sz{min-width:34px;min-height:30px;padding:0 4px}
.dr-sz[aria-pressed="true"]{box-shadow:var(--sunken);background:var(--hi)}
.dr-sz i{display:inline-block;border-radius:50%;background:#000;vertical-align:middle}
.dr-words{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.dr-words .btn{min-width:100px;font-weight:700;font-size:15px;padding:8px 12px}
.dr-blanks{font:700 22px/1.2 ui-monospace,Consolas,monospace;letter-spacing:.25em;text-align:center;word-break:break-word}
.dr-guess{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
.dr-guess input{font:inherit;font-size:17px;width:12em;max-width:60vw;padding:4px 6px;box-shadow:var(--sunken);border:0;background:#fff}
.dr-fb{min-height:1.4em;text-align:center;font-weight:700}
.dr-shake{animation:drsh .3s}@keyframes drsh{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.dr-name{display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap}
.dr-name input{font:inherit;padding:3px 6px;box-shadow:var(--sunken);border:0;background:#fff;width:11em}
.dr-url{width:min(100%,440px);font:12px ui-monospace,Consolas,monospace;box-shadow:var(--sunken);border:0;padding:4px;resize:none}`;
// ---- stroke packing: [version, word, name, strokes]; points are 0-255 bytes
const te=new TextEncoder(),td=new TextDecoder();
function rdp(p,eps){if(p.length<3)return p.slice();let mx=0,ix=0;const [a,b]=[p[0],p[p.length-1]],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;
  for(let i=1;i<p.length-1;i++){const d=L>1e-6?Math.abs(dy*p[i][0]-dx*p[i][1]+b[0]*a[1]-b[1]*a[0])/L:Math.hypot(p[i][0]-a[0],p[i][1]-a[1]);if(d>mx){mx=d;ix=i}}
  if(mx<=eps)return [a,b];return rdp(p.slice(0,ix+1),eps).slice(0,-1).concat(rdp(p.slice(ix),eps))}
function pack(word,name,strokes){for(let eps=.8;;eps*=1.5){const out=[1],w=te.encode(word),n=te.encode(name.slice(0,24));
    out.push(w.length,...w.map((b,i)=>b^((0x5a+i*7)&255)),n.length,...n);
    const parts=[];strokes.forEach(s=>{const q=rdp(s.p,eps).map(([x,y])=>[Math.max(0,Math.min(255,Math.round(x))),Math.max(0,Math.min(255,Math.round(y)))]);
      for(let i=0;i<q.length;i+=254)parts.push([s.c,s.w,q.slice(i,i+255)]);});
    out.push(Math.min(255,parts.length>>8),parts.length&255);parts.forEach(([c,w,q])=>{out.push(c<<3|w,q.length);q.forEach(([x,y])=>out.push(x,y))});
    if(out.length<=3600||eps>40){let s="";for(const b of out)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}}}
function unpack(s){try{s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";const b=Uint8Array.from(atob(s),c=>c.charCodeAt(0));let i=0;const rd=()=>{if(i>=b.length)throw 0;return b[i++]};
    if(rd()!==1)return null;const wl=rd(),w=[];for(let k=0;k<wl;k++)w.push(rd()^((0x5a+k*7)&255));const nl=rd(),n=[];for(let k=0;k<nl;k++)n.push(rd());
    const cnt=rd()*256+rd(),strokes=[];for(let k=0;k<cnt;k++){const st=rd(),len=rd(),p=[];for(let j=0;j<len;j++)p.push([rd(),rd()]);strokes.push({c:(st>>3)&7,w:Math.min(2,st&7),p})}
    const word=td.decode(new Uint8Array(w));return word?{word,name:td.decode(new Uint8Array(n)),strokes}:null}catch(e){return null}}
// the computer's doodles: Draw from Memory's outlines, sampled into strokes in the same 0-255 space
function shapeStrokes(d){const ns="http://www.w3.org/2000/svg",svg=document.createElementNS(ns,"svg");svg.style.cssText="position:absolute;width:0;height:0;visibility:hidden";document.body.appendChild(svg);
  const out=[];d.split(/(?=M)/).forEach(sub=>{const p=document.createElementNS(ns,"path");p.setAttribute("d",sub);svg.appendChild(p);const L=p.getTotalLength(),n=Math.max(2,Math.ceil(L/2)),pts=[];
    for(let i=0;i<=n;i++){const q=p.getPointAtLength(L*i/n);pts.push([28+q.x*2,28+q.y*2])}out.push({c:0,w:1,p:pts})});svg.remove();return out}
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]/g,"");
function near(a,b){if(Math.abs(a.length-b.length)>1)return false;let i=0,j=0,e=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue}if(++e>1)return false;if(a.length>b.length)i++;else if(b.length>a.length)j++;else{i++;j++}}return e+(a.length-i)+(b.length-j)<=1}
A95G.doodle={
help:`<div>Pictionary by text message. Pick a word, draw it, and send the link to a friend. They watch your drawing come to life and try to guess it, then draw one back.</div>
<ul class="factlist"><li><b>Draw for a friend:</b> pick one of three words, draw it, then press <b>Send</b> to copy or share the link. No letters or numbers in your drawing!</li>
<li><b>Guess:</b> open a friend's link, or switch to <b>Guess the computer's doodles</b> to play solo. Every two misses, a letter is filled in for you.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.mode=st.mode==="solo"?"solo":"draw";const link=api.linkData();
  let strokes=[],undone=null,cur=null,color=0,size=1,cv,ctx,anim=0,phase="",G=null,word="";
  api.bar.innerHTML=`<select class="sel95" data-drmode aria-label="Mode"><option value="draw"${st.mode==="draw"?" selected":""}>Draw for a friend</option><option value="solo"${st.mode==="solo"?" selected":""}>Guess the computer's doodles</option></select>`;
  api.root.innerHTML=`<div class="dr-wrap"></div>`;const W=api.root.querySelector(".dr-wrap");
  const status=()=>api.status(st.mode==="solo"&&!G?.link?"Solo":G?.link?"Friend's doodle":"Drawing",`Guessed: ${st.guessed||0} · Sent: ${st.sent||0}`);
  // ---- canvas
  // the canvas is sized from its box, so refit and repaint whenever the box changes
  const ro=typeof ResizeObserver==="function"?new ResizeObserver(()=>{if(!cv||!cv.isConnected)return;const w=cv.width;fit();if(cv.width!==w)repaint()}):null;
  function repaint(){if(phase==="draw"||phase==="send")redraw();else if(G){if(anim)play();else redraw(G.strokes)}}
  function pad(){W.querySelector(".dr-pad")?.remove();const d=document.createElement("div");d.className="dr-pad";d.innerHTML=`<canvas aria-label="Drawing pad"></canvas>`;if(ro){ro.disconnect();ro.observe(d)}return d}
  function fit(){if(!cv)return;const r=cv.getBoundingClientRect(),dpr=Math.min(3,window.devicePixelRatio||1),px=Math.max(1,Math.round(r.width*dpr));if(cv.width!==px||cv.height!==px){cv.width=cv.height=px}ctx=cv.getContext("2d");ctx.setTransform(px/256,0,0,px/256,0,0);ctx.lineCap=ctx.lineJoin="round"}
  function seg(s,from,to){const p=s.p;ctx.strokeStyle=COLORS[s.c]||"#000";ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=SIZES[s.w]||7;
    if(p.length===1||to===0){ctx.beginPath();ctx.arc(p[0][0],p[0][1],(SIZES[s.w]||7)/2,0,7);ctx.fill();if(p.length===1)return}
    ctx.beginPath();ctx.moveTo(p[Math.max(0,from)][0],p[Math.max(0,from)][1]);for(let i=Math.max(1,from+1);i<=Math.min(to,p.length-1);i++)ctx.lineTo(p[i][0],p[i][1]);ctx.stroke()}
  function redraw(list){if(!ctx)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.restore();(list||strokes).forEach(s=>seg(s,0,s.p.length-1))}
  const pos=e=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)/r.width*256,(e.clientY-r.top)/r.height*256]};
  function drawable(){cv.addEventListener("pointerdown",e=>{if(phase!=="draw"||(e.pointerType==="mouse"&&e.button))return;e.preventDefault();cv.setPointerCapture(e.pointerId);cur={c:color,w:size,p:[pos(e)]};strokes.push(cur);undone=null;seg(cur,0,0)});
    cv.addEventListener("pointermove",e=>{if(!cur)return;const evs=e.getCoalescedEvents?e.getCoalescedEvents():[e];evs.forEach(ev=>{const q=pos(ev),l=cur.p[cur.p.length-1];if(Math.hypot(q[0]-l[0],q[1]-l[1])>=1){cur.p.push(q);seg(cur,cur.p.length-2,cur.p.length-1)}})});
    const up=()=>{cur=null;tools()};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up)}
  // ---- draw for a friend
  function choose(){cancelAnim();phase="choose";strokes=[];G=null;status();const pick=api.shuffle(LIST,Math.random).slice(0,3);
    W.innerHTML=`<div class="dr-msg">Pick something to draw</div><div class="dr-words">${pick.map(w=>`<button class="btn" type="button" data-drw="${api.esc(w)}">${api.esc(w)}</button>`).join("")}</div>
      <button class="btn" type="button" data-dr="reroll">Different words</button>${st.sent?"":`<div class="dr-sub">Your friend gets a link, watches your drawing replay, and guesses.</div>`}`}
  function canvasUI(msg){W.innerHTML=`<div class="dr-msg">${msg}</div>`;const d=pad();W.appendChild(d);cv=d.querySelector("canvas");fit()}
  function drawScreen(w){word=w;phase="draw";strokes=[];undone=null;canvasUI(`Draw: <u>${api.esc(w)}</u>`);drawable();
    const t=document.createElement("div");t.className="dr-tools";W.appendChild(t);const a=document.createElement("div");a.className="dr-tools";a.id="dract";W.appendChild(a);tools()}
  function tools(){const t=W.querySelector(".dr-tools");if(!t||phase!=="draw")return;
    t.innerHTML=COLORS.map((c,i)=>`<button class="dr-sw" type="button" data-drc="${i}" style="background:${c}" aria-label="Color ${i+1}" aria-pressed="${i===color}"></button>`).join("")+
      SIZES.map((s,i)=>`<button class="btn dr-sz" type="button" data-drs="${i}" aria-label="${["Thin","Medium","Thick"][i]} pen" aria-pressed="${i===size}"><i style="width:${s*.9+2}px;height:${s*.9+2}px"></i></button>`).join("");
    W.querySelector("#dract").innerHTML=`<button class="btn" type="button" data-dr="undo"${strokes.length||undone?"":" disabled"}>Undo</button><button class="btn" type="button" data-dr="clear"${strokes.length?"":" disabled"}>Clear</button><button class="btn" type="button" data-dr="pick">Change word</button><button class="btn default" type="button" data-dr="done"${strokes.length?"":" disabled"}>Done</button>`}
  function sendScreen(){phase="send";const name=api.nick();cancelAnim();
    W.innerHTML=`<div class="dr-msg">Nice! Now send it to a friend.</div><div class="dr-sub">They'll see it drawn line by line and try to guess <b>${api.esc(word)}</b>.</div>`;
    const d=pad();W.appendChild(d);cv=d.querySelector("canvas");fit();redraw();
    W.insertAdjacentHTML("beforeend",`${name?"":`<div class="dr-name"><label for="drnm">Your name:</label><input id="drnm" maxlength="24" autocomplete="nickname" placeholder="So they know it's you"></div>`}
      <div class="dr-tools"><button class="btn default" type="button" data-dr="send">Send...</button><button class="btn" type="button" data-dr="back">Keep drawing</button><button class="btn" type="button" data-dr="pick">Draw another</button></div><div class="dr-fb" aria-live="polite"></div>`)}
  async function send(btn){const ni=W.querySelector("#drnm"),name=(ni&&ni.value.trim())||api.nick()||"";if(ni&&ni.value.trim())api.nick(ni.value.trim());
    const url=api.link(pack(word,name||"A friend",strokes)),text=`${name?name+" drew":"I drew"} you something on Atlas95. Can you guess it? 🎨`;
    if(!st.sentW||st.sentW!==word+strokes.length){st.sent=(st.sent||0)+1;st.sentW=word+strokes.length;api.result({xp:5})}status();
    const fb=W.querySelector(".dr-fb");
    if(navigator.share&&matchMedia("(pointer:coarse)").matches){try{await navigator.share({text,url});if(fb)fb.textContent="Sent! Draw another while you wait?";return}catch(e){if(e&&e.name==="AbortError")return}}
    api.share(`${text}\n${url}`,btn);if(fb)fb.textContent="Link copied. Paste it to a friend!"}
  // ---- guessing (a friend's link or the computer)
  function guessScreen(g){cancelAnim();G=g;G.tries=0;G.shown=new Set();G.done=false;phase="watch";status();
    W.innerHTML=`<div class="dr-msg">${g.link?`🎨 ${api.esc(g.name||"A friend")} drew something for you!`:"What is the computer drawing?"}</div>`;const d=pad();W.appendChild(d);cv=d.querySelector("canvas");fit();
    W.insertAdjacentHTML("beforeend",`<div class="dr-blanks" aria-label="Word to guess"></div><form class="dr-guess" data-drf><input id="drg" type="text" autocomplete="off" autocapitalize="none" enterkeyhint="go" aria-label="Your guess" placeholder="Your guess"><button class="btn default" type="submit">Guess</button></form>
      <div class="dr-fb" aria-live="polite"></div><div class="dr-tools" id="dract"><button class="btn" type="button" data-dr="replay">Replay</button><button class="btn" type="button" data-dr="giveup">Give up</button></div>`);
    blanks();play();const inp=W.querySelector("#drg");if(matchMedia("(pointer:fine)").matches)inp.focus({preventScroll:true})}
  function blanks(){const b=W.querySelector(".dr-blanks");if(!b)return;b.textContent=[...G.word].map((ch,i)=>/[a-z0-9]/i.test(ch)?(G.done||G.shown.has(i)?ch.toUpperCase():"_"):ch===" "?"  ":ch).join("")}
  function cancelAnim(){if(anim)cancelAnimationFrame(anim);anim=0}
  function play(){cancelAnim();redraw([]);const S=G.strokes,lens=S.map(s=>{let l=0;for(let i=1;i<s.p.length;i++)l+=Math.hypot(s.p[i][0]-s.p[i-1][0],s.p[i][1]-s.p[i-1][1]);return l}),total=lens.reduce((a,b)=>a+b,0)+S.length*30;
    if(api.reduced()||!total){redraw(S);return}const dur=Math.min(7000,Math.max(1800,total*2.2)),t0=performance.now();let si=0,pi=0,acc=0;
    const step=now=>{if(!api.active()||!cv.isConnected){anim=0;return}const goal=Math.min(total,(now-t0)/dur*total);
      while(si<S.length&&acc<goal){const s=S[si];if(pi===0){seg(s,0,0);acc+=30;if(s.p.length===1){si++;continue}}const nx=pi+1;if(nx>=s.p.length){si++;pi=0;continue}
        acc+=Math.hypot(s.p[nx][0]-s.p[pi][0],s.p[nx][1]-s.p[pi][1]);seg(s,pi,nx);pi=nx}
      anim=si<S.length?requestAnimationFrame(step):0};anim=requestAnimationFrame(step)}
  function guess(){if(!G||G.done)return;const inp=W.querySelector("#drg"),v=norm(inp.value),w=norm(G.word),fb=W.querySelector(".dr-fb");if(!v)return;
    if(v===w||v===w+"s"||v+"s"===w||v===w+"es"){win();return}
    const raw=inp.value.trim();G.tries++;inp.value="";const f=W.querySelector(".dr-guess");f.classList.remove("dr-shake");void f.offsetWidth;f.classList.add("dr-shake");api.sound("tap");
    fb.textContent=near(v,w)?"So close! Check the spelling.":`Not "${raw}". Try again!`;
    if(G.tries%2===0){const hid=[...G.word].map((c,i)=>i).filter(i=>/[a-z0-9]/i.test(G.word[i])&&!G.shown.has(i));if(hid.length>1){G.shown.add(hid[Math.floor(Math.random()*hid.length)]);blanks();fb.textContent+=" Here's a letter."}}}
  function win(){G.done=true;cancelAnim();redraw(G.strokes);blanks();st.guessed=(st.guessed||0)+1;const n=G.tries+1;if(n===1)st.first=(st.first||0)+1;
    const r=api.result({xp:n===1?8:5});api.sound("win");status();end(`🎉 Got it${n===1?" on the first try":` in ${n} guesses`}! It's <b>${api.esc(G.word)}</b>.${r.xp?` +${r.xp} XP`:""}`)}
  function giveUp(){if(!G||G.done)return;G.done=true;cancelAnim();redraw(G.strokes);blanks();api.sound("lose");end(`It was <b>${api.esc(G.word)}</b>.`)}
  function end(msg){W.querySelector(".dr-guess")?.remove();W.querySelector(".dr-fb").innerHTML=msg;
    W.querySelector("#dract").innerHTML=G.link?`<button class="btn default" type="button" data-dr="pick">Draw one back</button>${G.name?`<span class="note">Send ${api.esc(G.name)} your own doodle.</span>`:""}`:`<button class="btn default" type="button" data-dr="solo">Next doodle</button><button class="btn" type="button" data-dr="replay">Replay</button>`}
  let soloQ=[];function solo(){const all=((A95G.draw&&A95G.draw._shapes)||[]).filter(x=>!/ in a /.test(x[0]));if(!all.length){W.innerHTML=`<div class="dr-msg">Couldn't load the computer's doodles.</div>`;return}
    if(!soloQ.length)soloQ=api.shuffle(all,Math.random);const [name,d]=soloQ.pop();guessScreen({word:name.toLowerCase(),strokes:shapeStrokes(d),link:false})}
  function start(){if(st.mode==="solo")solo();else choose()}
  const onClick=e=>{const b=e.target.closest("[data-dr],[data-drw],[data-drc],[data-drs]");if(!b||b.disabled)return;
    if(b.dataset.drw){drawScreen(b.dataset.drw);return}if(b.dataset.drc){color=+b.dataset.drc;tools();return}if(b.dataset.drs){size=+b.dataset.drs;tools();return}
    const k=b.dataset.dr;
    if(k==="reroll"||k==="pick"){if(k==="pick"&&G&&G.link){st.mode="draw";api.bar.querySelector("[data-drmode]").value="draw"}choose()}
    else if(k==="undo"){if(strokes.length)strokes.pop();else if(undone){strokes=undone;undone=null}redraw();tools()}
    else if(k==="clear"){undone=strokes;strokes=[];redraw();tools()}
    else if(k==="done"){if(strokes.length)sendScreen()}else if(k==="back"){const keep=strokes;drawScreen(word);strokes=keep;redraw();tools()}
    else if(k==="send")send(b);else if(k==="replay")play();else if(k==="giveup")giveUp();else if(k==="solo")solo()};
  api.on(api.root,"click",onClick);
  api.on(api.root,"submit",e=>{if(e.target.matches("[data-drf]")){e.preventDefault();guess()}});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-drmode]")){st.mode=e.target.value;api.save();start()}});
  if(!ro)api.on(window,"resize",()=>{if(!cv||!cv.isConnected)return;fit();repaint()});
  if(typeof link==="string"){const g=unpack(link);if(g)guessScreen({word:g.word,name:g.name,strokes:g.strokes,link:true});else{choose();api.toast("That doodle link looks broken. Ask your friend to send it again.")}}
  else start();
  return {unmount(){cancelAnim();if(ro)ro.disconnect()}};
}};
A95G.doodle._t={pack,unpack,rdp,LIST};
})();
