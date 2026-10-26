// Quad Word for the Atlas95 Game Vault: four hidden words, nine guesses, every guess goes on all four boards (like Quordle).
(()=>{
const split=s=>s.match(/.{5}/g);
const ANSWERS=split(A95LIB.words5.ans),VALID=new Set([...ANSWERS,...split(A95LIB.words5.guess)]);
const BOARDS=4,TRIES=9,ROWS=[..."qwertyuiop"],ROW2=[..."asdfghjkl"],ROW3=[..."zxcvbnm"];
const CSS=`
.qw-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.qw-msg{min-height:1.4em;font-weight:700;text-align:center}
.qw-boards{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:min(100%,460px)}
.qw-b{display:grid;grid-template-rows:repeat(${TRIES},1fr);gap:2px;background:var(--hi);box-shadow:var(--sunken);padding:4px;position:relative}
.qw-b.won{background:#eaf7ea}
.qw-r{display:grid;grid-template-columns:repeat(5,1fr);gap:2px}
.qw-t{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font:700 clamp(11px,3.4vw,17px) var(--ui);text-transform:uppercase;background:#fff;box-shadow:inset 0 0 0 1px #c0c0c0}
.qw-t.on{box-shadow:inset 0 0 0 1px #404040}
.qw-t.g,.qw-t.y,.qw-t.b{color:#fff;box-shadow:none}.qw-t.g{background:#6aaa64}.qw-t.y{background:#c9b458}.qw-t.b{background:#787c7e}
.qw-b .tag{position:absolute;right:4px;top:3px;font:700 11px var(--ui);background:#6aaa64;color:#fff;padding:0 4px}
.qw-b.lost .tag{background:#c00000}
.qw-kb{display:flex;flex-direction:column;gap:4px;width:min(100%,500px);position:sticky;bottom:calc(44px + env(safe-area-inset-bottom,0px));background:var(--face);padding:4px 0;z-index:2}
.qw-kr{display:flex;gap:3px;justify-content:center}
.qw-kb .btn{flex:1 1 0;min-width:0;padding:0;min-height:44px;font-weight:700;text-transform:uppercase;font-size:14px;position:relative;overflow:hidden}
.qw-kb .btn.wide{flex:1.6 1 0;font-size:12px;text-transform:none}
.qw-kb .btn .q{position:absolute;inset:3px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;pointer-events:none}
.qw-kb .btn .q i.g{background:#6aaa64}.qw-kb .btn .q i.y{background:#c9b458}.qw-kb .btn .q i.b{background:#787c7e}
.qw-kb .btn span{position:relative}
.qw-kb .btn.c span{color:#fff;text-shadow:0 0 3px #000}
.qw-row.shake{animation:qwshake .35s}
@media (max-width:520px){.qw-t{aspect-ratio:1.4}.qw-boards{gap:5px}.qw-b{padding:3px}}
@keyframes qwshake{20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
@media (prefers-reduced-motion:reduce){.qw-row.shake{animation:none}}`;
function rate(guess,ans){const res=Array(5).fill("b"),left={};for(let i=0;i<5;i++){if(guess[i]===ans[i])res[i]="g";else left[ans[i]]=(left[ans[i]]||0)+1}
  for(let i=0;i<5;i++)if(res[i]!=="g"&&left[guess[i]]){res[i]="y";left[guess[i]]--}return res}
const NUM=["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
A95G.quad={
help:`<div>Four hidden 5-letter words, and <b>9 guesses</b> to find them all. Every guess goes on all four boards at once.</div>
<ul class="factlist"><li>Colors work like Daily Word: <b style="color:#4a8a44">green</b> is the right letter in the right spot, <b style="color:#a08c30">yellow</b> is in the word but somewhere else, <b style="color:#606060">gray</b> isn't in that word.</li><li>Each board stops once you solve it. The keyboard is split into four corners, one for each board: top left, top right, bottom left, bottom right.</li><li>The <b>Daily</b> puzzle is the same for everyone today. <b>Practice</b> gives you new words any time.</li></ul>`,
mount(api){
  api.css(CSS);const st=api.stats;st.days=st.days||{};const today=api.today();
  let mode=api.seeded()?"practice":"daily",ans,guesses,cur="",done,busy=false;
  function pick(rnd){const out=[];while(out.length<BOARDS){const w=ANSWERS[Math.floor(rnd()*ANSWERS.length)];if(!out.includes(w))out.push(w)}return out}
  function load(m){mode=m;cur="";busy=false;
    if(m==="daily"){ans=pick(api.rng("quad|"+today));const d=st.days[today];if(d){guesses=d.g.slice();done=true}else{guesses=st.cur&&st.cur.d===today?st.cur.g.slice():[];done=false}}
    else{ans=pick(api.begin({}));guesses=[];done=false}
    api.bar.innerHTML=`<button class="btn" type="button" data-qm="daily" aria-pressed="${m==="daily"}">Daily</button><button class="btn" type="button" data-qm="practice" aria-pressed="${m==="practice"}">${m==="practice"?"New practice":"Practice"}</button>`;
    render();say(m==="daily"?(done?"":`Quad Word for ${api.niceDate(today)}`):"Practice: four new words.")}
  const solvedAt=k=>{const i=guesses.indexOf(ans[k]);return i<0?null:i};
  function say(t){const e=api.root.querySelector(".qw-msg");if(e)e.textContent=t}
  function boardHTML(k){const sa=solvedAt(k),lost=done&&sa==null;let h=`<div class="qw-b${sa!=null?" won":""}${lost?" lost":""}" aria-label="Board ${k+1}">`;
    if(sa!=null)h+=`<span class="tag">${sa+1}</span>`;else if(lost)h+=`<span class="tag">${ans[k].toUpperCase()}</span>`;
    for(let r=0;r<TRIES;r++){const g=guesses[r];
      if(g&&(sa==null||r<=sa)){const rt=rate(g,ans[k]);h+=`<div class="qw-r">${[...g].map((c,j)=>`<span class="qw-t ${rt[j]}">${c}</span>`).join("")}</div>`}
      else if(r===guesses.length&&sa==null&&!done)h+=`<div class="qw-r qw-row" data-cur>${[0,1,2,3,4].map(j=>`<span class="qw-t${cur[j]?" on":""}">${cur[j]||""}</span>`).join("")}</div>`;
      else h+=`<div class="qw-r">${'<span class="qw-t"></span>'.repeat(5)}</div>`}
    return h+"</div>"}
  // per key, the best color it has reached on each board (a solved board leaves its corner blank)
  function keyColors(){const K={};for(let k=0;k<BOARDS;k++){const sa=solvedAt(k);guesses.forEach((g,r)=>{if(sa!=null&&r>sa)return;rate(g,ans[k]).forEach((c,j)=>{const L=g[j],o=(K[L]=K[L]||[])[k];if(c==="g"||(c==="y"&&o!=="g")||!o)K[L][k]=c})});if(sa!=null)Object.values(K).forEach(a=>a[k]="")}return K}
  function render(){const K=keyColors();
    api.root.innerHTML=`<div class="qw-wrap"><div class="qw-msg" aria-live="polite"></div><div class="qw-boards">${[0,1,2,3].map(boardHTML).join("")}</div>
      ${done?endHTML():`<div class="qw-kb">${[ROWS,ROW2,ROW3].map((row,ri)=>`<div class="qw-kr">${ri===2?`<button class="btn wide" type="button" data-k="enter">Enter</button>`:""}${row.map(c=>{const q=K[c]||[];return `<button class="btn${q.some(x=>x)?" c":""}" type="button" data-k="${c}"><span class="q">${[0,1,2,3].map(k=>`<i class="${q[k]||""}"></i>`).join("")}</span><span>${c}</span></button>`}).join("")}${ri===2?`<button class="btn wide" type="button" data-k="back" aria-label="Backspace">⌫</button>`:""}</div>`).join("")}</div>`}</div>`;
    status()}
  function drawCur(){api.root.querySelectorAll("[data-cur]").forEach(row=>{row.innerHTML=[0,1,2,3,4].map(j=>`<span class="qw-t${cur[j]?" on":""}">${cur[j]||""}</span>`).join("")})}
  const solvedN=()=>[0,1,2,3].filter(k=>solvedAt(k)!=null).length;
  function status(){api.status(mode==="daily"?`Quad Word · ${api.niceDate(today)}`:"Practice",`Solved ${solvedN()}/4 · guess ${Math.min(guesses.length+(done?0:1),TRIES)}/${TRIES}`)}
  function endHTML(){const n=solvedN();return `<div class="actions" style="justify-content:center">${mode==="daily"?`<button class="btn default" type="button" data-qshare>Share...</button>`:""}<button class="btn${mode==="daily"?"":" default"}" type="button" data-qm="practice">${mode==="daily"?"Practice":"New practice"}</button></div>${mode==="daily"?`<div class="note" style="text-align:center">${st.streak>1?`🔥 ${st.streak}-day streak · `:""}New words tomorrow.</div>`:""}`}
  function type(k){if(done||busy)return;if(k==="back"){cur=cur.slice(0,-1);drawCur();return}if(k==="enter"){submit();return}if(/^[a-z]$/.test(k)&&cur.length<5){cur+=k;drawCur()}}
  function bad(t){say(t);api.root.querySelectorAll("[data-cur]").forEach(r=>{r.classList.remove("shake");void r.offsetWidth;r.classList.add("shake")})}
  function submit(){if(cur.length<5){bad("Not enough letters");return}if(!VALID.has(cur)){bad("Not in the word list");return}
    const before=solvedN();guesses.push(cur);cur="";const n=solvedN();done=n===BOARDS||guesses.length>=TRIES;
    if(mode==="daily"&&!done){st.cur={d:today,g:guesses.slice()};api.save()}
    render();if(done)finish();else{api.sound(n>before?"ding":"tap");say(n>before?`Board solved! ${n} of 4.`:"")}}
  function finish(){const n=solvedN(),rows=[0,1,2,3].map(k=>solvedAt(k)),total=rows.reduce((a,r)=>a+(r==null?10:r+1),0),won=n===BOARDS;
    if(mode==="daily"&&!st.days[today]){st.days[today]={g:guesses.slice(),rows,n};st.cur=null;
      const yd=(()=>{const d=new Date(today+"T12:00:00");d.setDate(d.getDate()-1);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")})();
      if(won){st.wins=(st.wins||0)+1;st.streak=st.days[yd]&&st.days[yd].n===BOARDS?(st.streak||0)+1:1;st.maxStreak=Math.max(st.maxStreak||0,st.streak)}else st.streak=0;
      const r=api.result({xp:n*6+(won?10:0)});render();say(`${won?"All four!":`${n} of 4 solved.`}${r.xp?` +${r.xp} XP`:""}`)}
    else{const r=api.result({xp:n+(won?3:0),ch:{v:total,text:won?`4/4 in ${guesses.length} guesses`:`${n}/4 solved`,higher:false}});render();say(`${won?`All four in ${guesses.length}!`:`${n} of 4 solved.`}${r.xp?` +${r.xp} XP`:""}`)}
    api.sound(won?"win":"lose")}
  function share(btn){const d=st.days[today];if(!d)return;const cell=r=>r==null?"🟥":NUM[r+1];
    api.share(`Atlas95 Quad Word · ${api.niceDate(today)}\n${cell(d.rows[0])}${cell(d.rows[1])}\n${cell(d.rows[2])}${cell(d.rows[3])}${st.streak>1?`\n🔥 ${st.streak}-day streak`:""}`,btn)}
  api.on(api.root,"click",e=>{const k=e.target.closest("[data-k]");if(k){type(k.dataset.k);return}const s=e.target.closest("[data-qshare]");if(s){share(s);return}const m=e.target.closest("[data-qm]");if(m)load(m.dataset.qm)});
  api.on(api.bar,"click",e=>{const m=e.target.closest("[data-qm]");if(m)load(m.dataset.qm)});
  api.on(document,"keydown",e=>{if(!api.active()||e.ctrlKey||e.metaKey||e.altKey||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
    if(e.key==="Enter"){if(e.target.closest&&e.target.closest("button")&&!e.target.closest(".qw-kb"))return;e.preventDefault();type("enter")}else if(e.key==="Backspace"){e.preventDefault();type("back")}else if(/^[a-zA-Z]$/.test(e.key))type(e.key.toLowerCase())});
  load(mode);
  return {unmount(){}};
}};
A95G.quad._t={rate};
})();
