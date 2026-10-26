// Logic Puzzles for the Atlas95 Game Vault: a short mystery, a list of clues, and a grid to mark until only one answer fits.
// Puzzles are generated: a random answer, then true clues are added until exactly one answer fits, then extra clues are removed.
(()=>{
const NAMES=["Sally","Tom","Mia","Ben","Ava","Leo","Zoe","Max","Ivy","Sam","Lily","Jack","Nora","Owen","Ella","Finn","Ruby","Eli","Rosa","Kai"];
// ordered categories (ages, prices, places...) also say how to compare two kids: cmp={more, one} as in "is older than", "is exactly one year older than"
const cat=(key,label,values,pos,neg,rel,either,cmp)=>({key,label,values,pos,neg,rel,either,ordered:!!cmp,cmp});
const fill=(t,v)=>t.replace("{v}",v);
const SNACK=cat("snack","Snack",["apples","cookies","pretzels","grapes","cupcakes"],v=>`swiped the ${v}`,v=>`didn't swipe the ${v}`,v=>`the kid who swiped the ${v}`,(a,b)=>`swiped either the ${a} or the ${b}`);
const SHIRT=cat("shirt","Shirt",["red","blue","green","yellow","purple"],v=>`wore ${v}`,v=>`didn't wear ${v}`,v=>`the kid in ${v}`,(a,b)=>`wore either ${a} or ${b}`);
const PET=cat("pet","Pet",["cat","dog","hamster","parrot","rabbit"],v=>`has a ${v}`,v=>`doesn't have a ${v}`,v=>`the ${v}'s owner`,(a,b)=>`has either a ${a} or a ${b}`);
const RIBBON=cat("ribbon","Ribbon",["blue","red","yellow","green","white"],v=>`won the ${v} ribbon`,v=>`didn't win the ${v} ribbon`,v=>`the ${v} ribbon winner`,(a,b)=>`won either the ${a} or the ${b} ribbon`);
const ENTRY=cat("entry","Pet",["puppy","kitten","bunny","turtle","parakeet"],v=>`entered the ${v}`,v=>`didn't enter the ${v}`,v=>`the ${v}'s owner`,(a,b)=>`entered either the ${a} or the ${b}`);
const AGE=(lo)=>cat("age","Age",[0,1,2,3,4].map(i=>String(lo+i)),v=>`is ${v}`,v=>`isn't ${v}`,v=>`the ${v}-year-old`,(a,b)=>`is either ${a} or ${b}`,{more:"is older than",one:"is exactly one year older than"});
const LOST=cat("lost","Lost item",["backpack","umbrella","scarf","water bottle","lunchbox"],v=>`lost the ${v}`,v=>`didn't lose the ${v}`,v=>`the kid who lost the ${v}`,(a,b)=>`lost either the ${a} or the ${b}`);
const SPOT=cat("spot","Last seen",["gym","library","cafeteria","playground","bus"],v=>`was last seen in the ${v}`,v=>`wasn't last seen in the ${v}`,v=>`the kid last seen in the ${v}`,(a,b)=>`was last seen in either the ${a} or the ${b}`);
const BAKED=cat("baked","Baked",["brownies","cookies","cupcakes","pie","muffins"],v=>`baked the ${v}`,v=>`didn't bake the ${v}`,v=>`the kid who baked the ${v}`,(a,b)=>`baked either the ${a} or the ${b}`);
const PRICE=cat("price","Price",["$1","$2","$3","$4","$5"],v=>`charged ${v}`,v=>`didn't charge ${v}`,v=>`the kid who charged ${v}`,(a,b)=>`charged either ${a} or ${b}`,{more:"charged more than",one:"charged exactly $1 more than"});
const APRON=cat("apron","Apron",["red","blue","green","yellow","pink"],v=>`wore the ${v} apron`,v=>`didn't wear the ${v} apron`,v=>`the kid in the ${v} apron`,(a,b)=>`wore either the ${a} or the ${b} apron`);
const PROJ=cat("proj","Project",["volcano","robot","rocket","solar oven","crystal garden"],v=>`built the ${v}`,v=>`didn't build the ${v}`,v=>`the kid who built the ${v}`,(a,b)=>`built either the ${a} or the ${b}`);
const PLACE=cat("place","Place",["1st","2nd","3rd","4th","5th"],v=>`finished ${v}`,v=>`didn't finish ${v}`,v=>`the kid who finished ${v}`,(a,b)=>`finished either ${a} or ${b}`,{more:"finished behind",one:"finished one place behind"});
const SPOOK=cat("spook","Found",["ghost","bat","skeleton","black cat","spider"],v=>`found the ${v}`,v=>`didn't find the ${v}`,v=>`the kid who found the ${v}`,(a,b)=>`found either the ${a} or the ${b}`);
const ROOM=cat("room","Room",["attic","basement","kitchen","library","hallway"],v=>`explored the ${v}`,v=>`didn't explore the ${v}`,v=>`the kid who explored the ${v}`,(a,b)=>`explored either the ${a} or the ${b}`);
const LIGHT=cat("light","Flashlight",["red","blue","green","yellow","purple"],v=>`carried the ${v} flashlight`,v=>`didn't carry the ${v} flashlight`,v=>`the kid with the ${v} flashlight`,(a,b)=>`carried either the ${a} or the ${b} flashlight`);
const POS=cat("pos","Position",["goalie","defender","midfielder","winger","striker"],v=>`plays ${v}`,v=>`doesn't play ${v}`,v=>`the ${v}`,(a,b)=>`plays either ${a} or ${b}`);
const GOALS=cat("goals","Goals",["no goals","1 goal","2 goals","3 goals","4 goals"],v=>`scored ${v}`,v=>`didn't score ${v}`,v=>`the kid who scored ${v}`,(a,b)=>`scored either ${a} or ${b}`,{more:"scored more goals than",one:"scored exactly one more goal than"});
const JERSEY=cat("jersey","Jersey",["#3","#7","#9","#10","#11"],v=>`wears ${v}`,v=>`doesn't wear ${v}`,v=>`the kid wearing ${v}`,(a,b)=>`wears either ${a} or ${b}`);
const ACT=cat("act","Activity",["archery","canoeing","crafts","hiking","swimming"],v=>`signed up for ${v}`,v=>`didn't sign up for ${v}`,v=>`the kid doing ${v}`,(a,b)=>`signed up for either ${a} or ${b}`);
const CABIN=cat("cabin","Cabin",["Oak","Pine","Maple","Birch","Cedar"],v=>`slept in ${v} Cabin`,v=>`didn't sleep in ${v} Cabin`,v=>`the kid in ${v} Cabin`,(a,b)=>`slept in either ${a} or ${b} Cabin`);
const THEMES=[
  {title:"The Snack Swipers",intro:"Snacks went missing from the class party! Each kid swiped exactly one snack, wore a different color, and has a different pet at home.",q:v=>`Who swiped the ${v}?`,a:(p,v)=>`It was ${p} who swiped the ${v}!`,cats:[SNACK,SHIRT,PET]},
  {title:"The Pet Show",intro:"At the town pet show, each kid entered one pet, every pet won a different ribbon, and no two kids are the same age.",q:v=>`Who entered the ${v}?`,a:(p,v)=>`${p} entered the ${v}!`,cats:[ENTRY,RIBBON,AGE(7)]},
  {title:"Summer Camp",intro:"A group of friends went to summer camp. Each signed up for a different activity, slept in a different cabin, and no two are the same age.",q:v=>`Who signed up for ${v}?`,a:(p,v)=>`${p} signed up for ${v}!`,cats:[ACT,CABIN,AGE(9)]},
  {title:"Lost and Found",intro:"A pile of stuff turned up in the lost and found! Each thing belongs to a different kid, and each kid was last seen somewhere different. No two kids are the same age.",q:v=>`Whose ${v} is it?`,a:(p,v)=>`The ${v} belongs to ${p}!`,cats:[LOST,SPOT,AGE(6)]},
  {title:"The Bake Sale",intro:"It's the school bake sale! Each kid baked something different, charged a different price, and wore a different apron.",q:v=>`Who baked the ${v}?`,a:(p,v)=>`${p} baked the ${v}!`,cats:[BAKED,PRICE,APRON]},
  {title:"The Science Fair",intro:"The science fair results are in! Each kid built a different project, finished in a different place, and wore a different color.",q:v=>`Who built the ${v}?`,a:(p,v)=>`${p} built the ${v}!`,cats:[PROJ,PLACE,SHIRT]},
  {title:"The Haunted House",intro:"On a dare, a group of friends explored the old house on the hill. Each found something spooky in a different room, carrying a different flashlight.",q:v=>`Who found the ${v}?`,a:(p,v)=>`${p} found the ${v}!`,cats:[SPOOK,ROOM,LIGHT]},
  {title:"The Soccer Team",intro:"The team just won the big game! Each player has a different position, scored a different number of goals, and wears a different jersey.",q:v=>`Who plays ${v}?`,a:(p,v)=>`${p} plays ${v}!`,cats:[POS,GOALS,JERSEY]}];
const LV={daily:{label:"Daily (Medium)",n:4,m:3},easy:{label:"Easy",n:3,m:2},medium:{label:"Medium",n:4,m:3},hard:{label:"Hard",n:5,m:3}};
const shuf=(a,rnd)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const perms=n=>{const out=[];(function go(a,rest){if(!rest.length){out.push(a);return}rest.forEach((x,i)=>go([...a,x],rest.filter((_,j)=>j!==i)))})([],[...Array(n).keys()]);return out};
// a "ref" points at a person: {p} by name, or {c,v} = whoever has value v in category c. S[c][p] = value index.
const who=(S,ref)=>ref.p!=null?ref.p:S[ref.c].indexOf(ref.v);
function holds(S,k){const a=who(S,k.a);
  if(k.t==="same")return a===who(S,k.b);
  if(k.t==="diff")return a!==who(S,k.b);
  if(k.t==="either")return k.opts.some(r=>a===who(S,r));
  const b=who(S,k.b),d=S[k.c][a]-S[k.c][b];return k.t==="more"?d>0:d===1}
const catsOf=k=>{const s=new Set();[k.a,k.b,...(k.opts||[])].forEach(r=>{if(r&&r.c!=null)s.add(r.c)});if(k.c!=null)s.add(k.c);return s};
// how many answers fit the clues (stops at limit); categories are filled one at a time and clues checked as soon as they can be
// WORK counts arrangements tried, so make() can give up on a slow draw (a step budget, not a clock, keeps seeded puzzles identical on every device)
let WORK=0;
function count(n,m,clues,limit){const P=perms(n),byLast=[...Array(m)].map(()=>[]);clues.forEach(k=>{const cs=[...catsOf(k)];byLast[cs.length?Math.max(...cs):0].push(k)});
  const S=[];let found=0;(function go(c){if(found>=limit)return;if(c===m){found++;return}for(const p of P){WORK++;S[c]=p;if(byLast[c].every(k=>holds(S,k)))go(c+1);if(found>=limit)return}S.length=c})(0);return found}
// every true clue about the answer, in all the shapes the text can take
function candidates(n,m,S,cats,rnd){const out=[],ref=(c,v)=>({c,v}),person=p=>({p});
  for(let p=0;p<n;p++)for(let c=0;c<m;c++)for(let v=0;v<n;v++){const yes=S[c][p]===v;out.push({t:yes?"same":"diff",a:person(p),b:ref(c,v)})}
  for(let c1=0;c1<m;c1++)for(let c2=c1+1;c2<m;c2++)for(let v1=0;v1<n;v1++)for(let v2=0;v2<n;v2++){const yes=S[c1].indexOf(v1)===S[c2].indexOf(v2);out.push({t:yes?"same":"diff",a:ref(c1,v1),b:ref(c2,v2)})}
  for(let p=0;p<n;p++)for(let c=0;c<m;c++){const right=S[c][p],wrong=shuf([...Array(n).keys()].filter(v=>v!==right),rnd)[0];if(wrong==null)continue;const o=shuf([right,wrong],rnd);out.push({t:"either",a:person(p),opts:o.map(v=>ref(c,v)),c2:c})}
  for(let c=0;c<m;c++)for(let v=0;v<n;v++){const right=S[c].indexOf(v),wrong=shuf([...Array(n).keys()].filter(p=>p!==right),rnd)[0];out.push({t:"either",a:ref(c,v),opts:shuf([right,wrong],rnd).map(person)})}
  cats.forEach((K,c)=>{if(!K.ordered||c>=m)return;const refs=[...Array(n).keys()].map(person);for(let c2=0;c2<m;c2++)if(c2!==c)for(let v=0;v<n;v++)refs.push(ref(c2,v));
    for(const A of refs)for(const B of refs){const a=who(S,A),b=who(S,B);if(a===b)continue;const d=S[c][a]-S[c][b];if(d>0)out.push({t:"more",a:A,b:B,c});if(d===1)out.push({t:"onemore",a:A,b:B,c})}});
  return out}
// how much each kind of clue is wanted at each difficulty (easier puzzles lean on direct clues)
const WEIGHT={easy:{same:3,diff:2,either:1,more:1,onemore:1},medium:{same:1,diff:3,either:2,more:2,onemore:2},hard:{same:.4,diff:3,either:3,more:3,onemore:3}};
function make(rnd,lvKey){const L=LV[lvKey],diff=lvKey==="daily"?"medium":lvKey,n=L.n,m=L.m;
  const BUDGET=250000;
  for(let attempt=0;attempt<40;attempt++){WORK=0;
    const theme=THEMES[Math.floor(rnd()*THEMES.length)],cats=theme.cats.slice(0,m),names=shuf(NAMES,rnd).slice(0,n);
    const vals=cats.map(K=>K.ordered?K.values.slice(0,n):shuf(K.values,rnd).slice(0,n)),S=cats.map(()=>shuf([...Array(n).keys()],rnd));
    const pool=candidates(n,m,S,cats,rnd).map(k=>({k,w:-Math.log(rnd()+1e-9)/WEIGHT[diff][k.t]})).sort((a,b)=>a.w-b.w).map(x=>x.k);
    const qv=Math.floor(rnd()*n),qp=S[0].indexOf(qv);
    // the question can't be answered by one clue on its own
    const direct=k=>k.t==="same"&&((k.a.p===qp&&k.b.c===0&&k.b.v===qv)||(k.b.p===qp&&k.a.c===0&&k.a.v===qv));
    const clues=[];for(const k of pool){if(direct(k))continue;clues.push(k);if(count(n,m,clues,2)===1||WORK>BUDGET)break}
    if(WORK>BUDGET||count(n,m,clues,2)!==1)continue;
    let slow=false;for(const k of shuf(clues,rnd)){const rest=clues.filter(x=>x!==k);if(count(n,m,rest,2)===1)clues.splice(clues.indexOf(k),1);if(WORK>BUDGET){slow=true;break}}
    if(slow)continue;
    if(clues.length<n)continue;
    return {theme:THEMES.indexOf(theme),names,vals,S,clues:shuf(clues,rnd),q:qv,n,m}}
  return null}
function text(P,k){const T=THEMES[P.theme],cats=T.cats,cap=s=>s[0].toUpperCase()+s.slice(1);
  const name=r=>r.p!=null?P.names[r.p]:cats[r.c].rel(P.vals[r.c][r.v]);
  const pred=(r,neg)=>{const K=cats[r.c],v=P.vals[r.c][r.v];return neg?K.neg(v):K.pos(v)};
  if(k.t==="same"||k.t==="diff"){const subj=k.a.p!=null?k.a:k.b.p!=null?k.b:k.a,obj=subj===k.a?k.b:k.a;
    if(obj.p!=null)return k.t==="same"?`${cap(name(subj))} is ${name(obj)}.`:`${cap(name(subj))} isn't ${name(obj)}.`;
    return `${cap(name(subj))} ${pred(obj,k.t==="diff")}.`}
  if(k.t==="either"){if(k.a.p!=null){const c=k.opts[0].c;return `${cap(name(k.a))} ${cats[c].either(P.vals[c][k.opts[0].v],P.vals[c][k.opts[1].v])}.`}
    return `${cap(name(k.a))} is either ${name(k.opts[0])} or ${name(k.opts[1])}.`}
  const K=cats[k.c];return `${cap(name(k.a))} ${k.t==="more"?K.cmp.more:K.cmp.one} ${name(k.b)}.`}
const CSS=`
.lg-wrap{display:flex;flex-direction:column;gap:10px;max-width:720px;margin:0 auto;width:100%}
.lg-story{background:var(--tip);border:1px solid var(--ink);padding:8px 10px;display:flex;flex-direction:column;gap:4px}
.lg-story h3{margin:0;font-size:15px}
.lg-q{font-weight:700;font-size:14px}
.lg-clues{background:var(--hi);box-shadow:var(--sunken);padding:8px 10px}
.lg-clues ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px}
.lg-clues li{cursor:pointer;line-height:1.35;display:flex;gap:6px;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
.lg-clues li .lg-n{flex:0 0 1.8em;text-align:right}
.lg-clues li.used{text-decoration:line-through;color:#808080}
.lg-clues li:focus-visible{outline:1px dotted var(--ink)}
.lg-grids{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.lg-t{border-collapse:collapse;background:var(--hi);box-shadow:var(--sunken)}
.lg-t caption{font-weight:700;text-align:left;padding:0 0 3px}
.lg-t th{font-size:11.5px;font-weight:700;padding:3px 4px;background:var(--face);box-shadow:var(--raised)}
.lg-t th.lg-ch{min-width:44px;max-width:66px;overflow-wrap:anywhere;line-height:1.1}
.lg-t th.lg-rh{text-align:right;white-space:nowrap}
.lg-t td{padding:0;border:1px solid #c0c0c0}
.lg-t td button{width:100%;min-width:40px;height:38px;border:0;background:#fff;font:700 18px var(--ui);cursor:pointer;color:#000}
.lg-t td button.x{color:#c00000}.lg-t td button.y{color:#008000;background:#eaf7ea}
.lg-t td button.bad{background:#ffb0b0}
.lg-t td button:focus-visible{outline:2px solid #000080;outline-offset:-2px}
.lg-msg{min-height:1.4em;font-weight:700;text-align:center}
.lg-tools{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}`;
A95G.logic={_t:{make,count,text,LV,THEMES},
help:`<div>Read the story and the clues, then work out who goes with what. Every kid matches exactly one thing in each grid.</div>
<ul class="factlist"><li>Tap a square once for <b style="color:#c00000">✗</b> (can't be), twice for <b style="color:#008000">✓</b> (it's this one), and a third time to clear it. A ✓ crosses out the rest of its row and column for you.</li><li>Tap a clue (or its number) to cross it off once you've used it.</li><li>Clues like "the kid in red" mean whichever kid wore red, so you can link the grids together: if the kid in red has the dog, then whoever wore red and whoever has the dog are the same kid.</li><li>Fill in a ✓ for every kid in every grid to finish. Stuck? <b>Hint</b> shows a wrong mark, or fills in one answer.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.days=st.days||{};const mo=api.modeOpts();if(mo&&LV[mo.lv]&&mo.lv!=="daily")st.lv=mo.lv;st.lv=LV[st.lv]?st.lv:"daily";
  let G,hist=[],t0=0,tick=null,today=api.today(),bad=null;
  api.bar.innerHTML=`<select class="sel95" data-lglv aria-label="Puzzle">${Object.entries(LV).map(([k,v])=>`<option value="${k}"${st.lv===k?" selected":""}>${v.label}</option>`).join("")}</select><button class="btn" type="button" data-lg="new">New puzzle</button>`;
  const newBtn=api.bar.querySelector("[data-lg=new]");
  // G: {lv, day, P (the puzzle), mk[c][p][v] (0 empty, 1 ✗, 2 ✓), used (crossed-off clues), ms, hints, wrong, done}
  function fresh(){const daily=st.lv==="daily",rnd=api.begin({lv:st.lv});const P=make(daily?api.rng("logic|"+today):rnd,st.lv);
    G={lv:st.lv,day:daily?today:null,P,mk:P.S.map(()=>[...Array(P.n)].map(()=>Array(P.n).fill(0))),used:[],ms:0,hints:0,wrong:0,done:false};hist=[];t0=0;clearInterval(tick);bad=null;save();render()}
  function load(){const g=st.game;if(!g||!g.P||g.lv!==st.lv||(g.lv==="daily"&&g.day!==today))return false;G=g;hist=[];return true}
  const elapsed=()=>G.ms+(t0?Date.now()-t0:0);
  function save(){st.game=Object.assign({},G,{ms:elapsed()});api.save()}
  function clock(){if(!t0&&!G.done){t0=Date.now();tick=setInterval(status,1000)}}
  function stopClock(){if(t0){G.ms+=Date.now()-t0;t0=0}clearInterval(tick)}
  function status(){api.status(`${LV[G.lv].label} · ${api.fmtTime(elapsed())}`,`Hints: ${G.hints}${G.wrong?` · Wrong tries: ${G.wrong}`:""}`)}
  function render(){const P=G.P,T=THEMES[P.theme],cats=T.cats,qp=P.S[0].indexOf(P.q);
    api.root.innerHTML=`<div class="lg-wrap"><div class="lg-story"><h3>🔎 ${api.esc(T.title)}</h3><div>${api.esc(T.intro)}</div><div><b>The kids:</b> ${P.names.map(api.esc).join(", ")}</div><div class="lg-q">${G.done?api.esc(T.a(P.names[qp],P.vals[0][P.q])):api.esc(T.q(P.vals[0][P.q]))}</div></div>
      <div class="lg-clues"><b>Clues</b> <span class="note">(tap a clue or its number to cross it off)</span><ol>${P.clues.map((k,i)=>{const u=G.used.includes(i);return `<li data-cl="${i}" class="${u?"used":""}" role="checkbox" aria-checked="${u}" tabindex="0"><span class="lg-n">${i+1}.</span><span>${api.esc(text(P,k))}</span></li>`}).join("")}</ol></div>
      <div class="lg-msg" aria-live="polite"></div>
      <div class="lg-grids">${P.S.map((_,c)=>`<table class="lg-t"><caption>${api.esc(cats[c].label)}</caption><thead><tr><th></th>${P.vals[c].map(v=>`<th class="lg-ch" scope="col">${api.esc(v)}</th>`).join("")}</tr></thead><tbody>${P.names.map((nm,p)=>`<tr><th class="lg-rh" scope="row">${api.esc(nm)}</th>${P.vals[c].map((v,vi)=>{const m=G.mk[c][p][vi];return `<td><button type="button" data-c="${c}" data-p="${p}" data-v="${vi}" class="${m===1?"x":m===2?"y":""}${bad&&bad.c===c&&bad.p===p&&bad.v===vi?" bad":""}" aria-label="${api.esc(nm)}, ${api.esc(v)}: ${m===1?"no":m===2?"yes":"unknown"}"${G.done?" disabled":""}>${m===1?"✗":m===2?"✓":""}</button></td>`}).join("")}</tr>`).join("")}</tbody></table>`).join("")}</div>
      <div class="lg-tools">${G.done?(G.lv==="daily"?`<button class="btn default" type="button" data-lg="share">Share...</button>`:`<button class="btn default" type="button" data-lg="new">Next puzzle</button>`):`<button class="btn" type="button" data-lg="undo">Undo</button><button class="btn" type="button" data-lg="hint">Hint</button><button class="btn" type="button" data-lg="clear">Clear marks</button>`}</div></div>`;
    newBtn.hidden=G.lv==="daily";status()}
  function say(t){const e=api.root.querySelector(".lg-msg");if(e)e.textContent=t}
  function cell(c,p,v){if(G.done)return;clock();hist.push(JSON.stringify(G.mk));if(hist.length>300)hist.shift();bad=null;
    const m=G.mk[c],nv=(m[p][v]+1)%3;m[p][v]=nv;
    if(nv===2)for(let k=0;k<G.P.n;k++){if(k!==v&&!m[p][k])m[p][k]=1;if(k!==p&&!m[k][v])m[k][v]=1}
    api.sound("tap");save();render();check()}
  // finished when every kid has exactly one ✓ in every grid
  function check(){const P=G.P,full=G.mk.every(m=>m.every(r=>r.filter(x=>x===2).length===1)&&[...Array(P.n).keys()].every(v=>m.filter(r=>r[v]===2).length===1));if(!full)return;
    const right=G.mk.every((m,c)=>m.every((r,p)=>r[P.S[c][p]]===2));if(right){win();return}
    G.wrong++;save();status();say("Not quite. Something doesn't fit the clues yet. Keep checking!");api.sound("lose")}
  function hint(){if(G.done)return;const P=G.P;clock();
    for(let c=0;c<P.m;c++)for(let p=0;p<P.n;p++)for(let v=0;v<P.n;v++){const m=G.mk[c][p][v],yes=P.S[c][p]===v;if((m===2&&!yes)||(m===1&&yes)){bad={c,p,v};G.hints++;save();render();say("This mark (in red) is wrong.");return}}
    const open=[];for(let c=0;c<P.m;c++)for(let p=0;p<P.n;p++)if(!G.mk[c][p].includes(2))open.push([c,p]);if(!open.length)return;
    const [c,p]=open[Math.floor(Math.random()*open.length)];G.hints++;hist.push(JSON.stringify(G.mk));G.mk[c][p][P.S[c][p]]=0;cell(c,p,P.S[c][p]);if(G.mk[c][p][P.S[c][p]]!==2)cell(c,p,P.S[c][p]);
    if(!G.done)say(`Hint: ${P.names[p]} goes with ${P.vals[c][P.S[c][p]]}.`)}
  function win(){stopClock();G.done=true;const ms=G.ms,daily=G.lv==="daily",lv=daily?"medium":G.lv,prev=(st.bests||{})[G.lv];st.bests=st.bests||{};const nb=prev==null||ms<prev;if(nb)st.bests[G.lv]=ms;
    st.wins=(st.wins||0)+1;(st.lvWins||(st.lvWins={}))[lv]=(st.lvWins[lv]||0)+1;if(lv==="hard"&&!G.hints)st.hardClean=(st.hardClean||0)+1;if(daily&&!st.days[today])st.days[today]={ms,h:G.hints};
    const xp=({easy:6,medium:12,hard:20})[lv]+(daily?8:0)-Math.min(G.hints*2,8);
    const r=api.result(daily?{xp}:{xp,ch:{v:ms,text:api.fmtTime(ms),higher:false}});save();render();api.sound("win");
    say(`Solved in ${api.fmtTime(ms)}${G.hints?` with ${G.hints} hint${G.hints===1?"":"s"}`:" with no hints"}!${r.xp?` +${r.xp} XP`:""}`)}
  const onClick=e=>{const b=e.target.closest("[data-c]");if(b&&!b.disabled){cell(+b.dataset.c,+b.dataset.p,+b.dataset.v);return}
    const li=e.target.closest("[data-cl]");if(li){toggleClue(li);return}
    const t=e.target.closest("[data-lg]");if(!t)return;const k=t.dataset.lg;
    if(k==="new"){if(G.lv==="daily")return;stopClock();fresh();return}
    if(k==="undo"){if(G.done||!hist.length)return;G.mk=JSON.parse(hist.pop());bad=null;save();render();return}
    if(k==="clear"){if(G.done)return;hist.push(JSON.stringify(G.mk));G.mk=G.mk.map(m=>m.map(r=>r.map(()=>0)));bad=null;save();render();return}
    if(k==="hint"){hint();return}
    if(k==="share"){const d=st.days[today];if(d)api.share(`Atlas95 Logic Puzzle · ${api.niceDate(today)}\n🔎 ${THEMES[G.P.theme].title}: solved in ${api.fmtTime(d.ms)}${d.h?` (${d.h} hint${d.h===1?"":"s"})`:" with no hints"}`,t)}};
  function toggleClue(li){const i=+li.dataset.cl,u=!G.used.includes(i);G.used=u?[...G.used,i]:G.used.filter(x=>x!==i);
    li.classList.toggle("used",u);li.setAttribute("aria-checked",u);save()}
  api.on(api.root,"click",onClick);api.on(api.bar,"click",onClick);
  api.on(api.root,"keydown",e=>{const li=e.target.closest&&e.target.closest("[data-cl]");if(li&&(e.key===" "||e.key==="Enter")){e.preventDefault();toggleClue(li)}});
  api.on(api.bar,"change",e=>{if(e.target.matches("[data-lglv]")){if(G&&!G.done)save();stopClock();st.lv=e.target.value;api.save();if(!load())fresh();else render()}});
  if(api.seeded()||!load())fresh();else{render();if(G.done&&G.lv==="daily")say("Today's puzzle is solved! Try Easy, Medium or Hard.")}
  return {pause(){if(t0){stopClock();save()}},unmount(){stopClock();if(G)save()}};
}};
})();
